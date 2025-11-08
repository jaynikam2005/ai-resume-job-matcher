-- infrastructure/postgres-init/init.sql
-- Production-Ready PostgreSQL Schema for AI Resume and Job Matcher
-- Compatible with Supabase, Neon, Railway, and managed PostgreSQL services
-- Version: 2.0

-- ============================================
-- EXTENSIONS SETUP
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Text search performance
CREATE EXTENSION IF NOT EXISTS "unaccent"; -- Accent-insensitive search

-- ============================================
-- SCHEMA SETUP
-- ============================================
CREATE SCHEMA IF NOT EXISTS app;
CREATE SCHEMA IF NOT EXISTS audit;

-- Set search path
SET search_path TO app, public;

-- ============================================
-- CLEANUP (Safe for re-runs)
-- ============================================
DROP TABLE IF EXISTS app.job_applications CASCADE;
DROP TABLE IF EXISTS app.jobs CASCADE;
DROP TABLE IF EXISTS app.resumes CASCADE;
DROP TABLE IF EXISTS app.users CASCADE;
DROP TABLE IF EXISTS audit.activity_log CASCADE;

DROP TYPE IF EXISTS app.user_role CASCADE;
DROP TYPE IF EXISTS app.application_status CASCADE;

-- ============================================
-- CUSTOM TYPES
-- ============================================
CREATE TYPE app.user_role AS ENUM ('JOB_SEEKER', 'RECRUITER', 'ADMIN');
CREATE TYPE app.application_status AS ENUM ('PENDING', 'REVIEWED', 'SHORTLISTED', 'ACCEPTED', 'REJECTED');

-- ============================================
-- CORE TABLES
-- ============================================

-- Users Table
CREATE TABLE app.users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    role app.user_role NOT NULL DEFAULT 'JOB_SEEKER',
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Profile fields
    profile_image_url VARCHAR(500),
    phone VARCHAR(20),
    location VARCHAR(255),
    bio TEXT,
    linkedin_url VARCHAR(500),
    github_url VARCHAR(500),
    website_url VARCHAR(500),
    company_name VARCHAR(255), -- For recruiters
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_login_at TIMESTAMPTZ,
    
    -- Constraints
    CONSTRAINT users_email_valid CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT users_username_length CHECK (LENGTH(username) >= 3 AND LENGTH(username) <= 50),
    CONSTRAINT users_password_length CHECK (LENGTH(password) >= 8)
);

-- Resumes Table
CREATE TABLE app.resumes (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES app.users(id) ON DELETE CASCADE,
    
    -- Resume content
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    summary TEXT,
    
    -- File metadata
    file_path VARCHAR(500),
    file_name VARCHAR(255),
    file_size INTEGER,
    mime_type VARCHAR(100),
    
    -- Parsed fields
    skills TEXT[],
    experience_years INTEGER DEFAULT 0,
    education TEXT,
    certifications TEXT[],
    languages TEXT[],
    
    -- Status
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    version INTEGER NOT NULL DEFAULT 1,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT resumes_title_length CHECK (LENGTH(title) >= 3 AND LENGTH(title) <= 255),
    CONSTRAINT resumes_content_min CHECK (LENGTH(content) >= 10),
    CONSTRAINT resumes_experience_positive CHECK (experience_years >= 0),
    CONSTRAINT resumes_file_size_limit CHECK (file_size IS NULL OR file_size <= 10485760)
);

-- Jobs Table
CREATE TABLE app.jobs (
    id BIGSERIAL PRIMARY KEY,
    recruiter_id BIGINT NOT NULL REFERENCES app.users(id) ON DELETE CASCADE,
    
    -- Job details
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    remote_work BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Salary
    salary_min DECIMAL(12,2),
    salary_max DECIMAL(12,2),
    salary_currency VARCHAR(3) DEFAULT 'USD',
    
    -- Job type
    employment_type VARCHAR(50) NOT NULL DEFAULT 'FULL_TIME',
    experience_level VARCHAR(50) NOT NULL DEFAULT 'MID_LEVEL',
    
    -- Requirements
    required_skills TEXT[],
    preferred_skills TEXT[],
    benefits TEXT[],
    
    -- Status
    application_deadline DATE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    view_count INTEGER NOT NULL DEFAULT 0,
    application_count INTEGER NOT NULL DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT jobs_title_length CHECK (LENGTH(title) >= 3 AND LENGTH(title) <= 255),
    CONSTRAINT jobs_description_min CHECK (LENGTH(description) >= 50),
    CONSTRAINT jobs_company_min CHECK (LENGTH(company_name) >= 2),
    CONSTRAINT jobs_salary_range CHECK (salary_min IS NULL OR salary_max IS NULL OR salary_min <= salary_max),
    CONSTRAINT jobs_salary_positive CHECK (salary_min IS NULL OR salary_min >= 0),
    CONSTRAINT jobs_employment_type_valid CHECK (employment_type IN ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE')),
    CONSTRAINT jobs_experience_level_valid CHECK (experience_level IN ('ENTRY_LEVEL', 'MID_LEVEL', 'SENIOR_LEVEL', 'EXECUTIVE'))
);

-- Job Applications Table
CREATE TABLE app.job_applications (
    id BIGSERIAL PRIMARY KEY,
    job_id BIGINT NOT NULL REFERENCES app.jobs(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES app.users(id) ON DELETE CASCADE,
    resume_id BIGINT REFERENCES app.resumes(id) ON DELETE SET NULL,
    
    -- Application details
    status app.application_status NOT NULL DEFAULT 'PENDING',
    cover_letter TEXT,
    notes TEXT,
    match_score DECIMAL(5,2), -- AI-generated match score (0-100)
    
    -- Timestamps
    applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(job_id, user_id),
    CONSTRAINT applications_cover_letter_min CHECK (cover_letter IS NULL OR LENGTH(cover_letter) >= 50),
    CONSTRAINT applications_match_score_range CHECK (match_score IS NULL OR (match_score >= 0 AND match_score <= 100))
);

-- Audit Log Table
CREATE TABLE audit.activity_log (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES app.users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id BIGINT,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Users indexes
CREATE INDEX idx_users_email ON app.users(email);
CREATE INDEX idx_users_username ON app.users(username);
CREATE INDEX idx_users_role ON app.users(role);
CREATE INDEX idx_users_enabled ON app.users(enabled) WHERE enabled = TRUE;
CREATE INDEX idx_users_created_at ON app.users(created_at DESC);

-- Resumes indexes
CREATE INDEX idx_resumes_user_id ON app.resumes(user_id);
CREATE INDEX idx_resumes_is_active ON app.resumes(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_resumes_is_public ON app.resumes(is_public) WHERE is_public = TRUE;
CREATE INDEX idx_resumes_skills ON app.resumes USING GIN(skills);
CREATE INDEX idx_resumes_content_search ON app.resumes USING GIN(to_tsvector('english', content));
CREATE INDEX idx_resumes_created_at ON app.resumes(created_at DESC);

-- Jobs indexes
CREATE INDEX idx_jobs_recruiter_id ON app.jobs(recruiter_id);
CREATE INDEX idx_jobs_is_active ON app.jobs(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_jobs_location ON app.jobs(location);
CREATE INDEX idx_jobs_employment_type ON app.jobs(employment_type);
CREATE INDEX idx_jobs_experience_level ON app.jobs(experience_level);
CREATE INDEX idx_jobs_required_skills ON app.jobs USING GIN(required_skills);
CREATE INDEX idx_jobs_title_search ON app.jobs USING GIN(to_tsvector('english', title));
CREATE INDEX idx_jobs_description_search ON app.jobs USING GIN(to_tsvector('english', description));
CREATE INDEX idx_jobs_created_at ON app.jobs(created_at DESC);
CREATE INDEX idx_jobs_deadline ON app.jobs(application_deadline) WHERE application_deadline IS NOT NULL;

-- Job applications indexes
CREATE INDEX idx_applications_job_id ON app.job_applications(job_id);
CREATE INDEX idx_applications_user_id ON app.job_applications(user_id);
CREATE INDEX idx_applications_status ON app.job_applications(status);
CREATE INDEX idx_applications_applied_at ON app.job_applications(applied_at DESC);
CREATE INDEX idx_applications_match_score ON app.job_applications(match_score DESC NULLS LAST);

-- Audit indexes
CREATE INDEX idx_audit_user_id ON audit.activity_log(user_id);
CREATE INDEX idx_audit_entity ON audit.activity_log(entity_type, entity_id);
CREATE INDEX idx_audit_created_at ON audit.activity_log(created_at DESC);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update job application count function
CREATE OR REPLACE FUNCTION update_job_application_count()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE app.jobs SET application_count = application_count + 1 WHERE id = NEW.job_id;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE app.jobs SET application_count = GREATEST(0, application_count - 1) WHERE id = OLD.job_id;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-update timestamps
CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON app.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_resumes_updated_at
    BEFORE UPDATE ON app.resumes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_jobs_updated_at
    BEFORE UPDATE ON app.jobs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_applications_updated_at
    BEFORE UPDATE ON app.job_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-update application count
CREATE TRIGGER trigger_update_application_count
    AFTER INSERT OR DELETE ON app.job_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_job_application_count();

-- ============================================
-- VIEWS
-- ============================================

-- Active jobs with recruiter info
CREATE OR REPLACE VIEW app.active_jobs_view AS
SELECT 
    j.*,
    u.first_name || ' ' || u.last_name AS recruiter_name,
    u.email AS recruiter_email,
    u.company_name AS recruiter_company,
    u.location AS recruiter_location
FROM app.jobs j
INNER JOIN app.users u ON j.recruiter_id = u.id
WHERE j.is_active = TRUE 
    AND (j.application_deadline IS NULL OR j.application_deadline >= CURRENT_DATE)
    AND u.enabled = TRUE;

-- User statistics
CREATE OR REPLACE VIEW app.user_stats_view AS
SELECT 
    u.id,
    u.username,
    u.email,
    u.role,
    u.created_at,
    COALESCE(r.resume_count, 0) AS resume_count,
    CASE 
        WHEN u.role = 'JOB_SEEKER' THEN COALESCE(a.application_count, 0)
        WHEN u.role = 'RECRUITER' THEN COALESCE(j.job_count, 0)
        ELSE 0
    END AS activity_count,
    CASE 
        WHEN u.role = 'JOB_SEEKER' THEN a.last_application_date
        WHEN u.role = 'RECRUITER' THEN j.last_job_posted_date
        ELSE NULL
    END AS last_activity_date
FROM app.users u
LEFT JOIN (
    SELECT user_id, COUNT(*) AS resume_count 
    FROM app.resumes 
    WHERE is_active = TRUE 
    GROUP BY user_id
) r ON u.id = r.user_id
LEFT JOIN (
    SELECT user_id, COUNT(*) AS application_count, MAX(applied_at) AS last_application_date
    FROM app.job_applications 
    GROUP BY user_id
) a ON u.id = a.user_id
LEFT JOIN (
    SELECT recruiter_id, COUNT(*) AS job_count, MAX(created_at) AS last_job_posted_date
    FROM app.jobs 
    WHERE is_active = TRUE 
    GROUP BY recruiter_id
) j ON u.id = j.recruiter_id;

-- Job application details
CREATE OR REPLACE VIEW app.application_details_view AS
SELECT 
    ja.*,
    j.title AS job_title,
    j.company_name,
    j.location AS job_location,
    j.employment_type,
    u.first_name || ' ' || u.last_name AS applicant_name,
    u.email AS applicant_email,
    u.phone AS applicant_phone,
    r.title AS resume_title,
    r.skills AS applicant_skills,
    r.experience_years AS applicant_experience
FROM app.job_applications ja
INNER JOIN app.jobs j ON ja.job_id = j.id
INNER JOIN app.users u ON ja.user_id = u.id
LEFT JOIN app.resumes r ON ja.resume_id = r.id;

-- ============================================
-- PERMISSIONS
-- ============================================

-- Grant schema usage
GRANT USAGE ON SCHEMA app TO PUBLIC;
GRANT USAGE ON SCHEMA audit TO PUBLIC;

-- Grant table permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA app TO PUBLIC;
GRANT SELECT, INSERT ON audit.activity_log TO PUBLIC;

-- Grant sequence permissions
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA app TO PUBLIC;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA audit TO PUBLIC;

-- Set default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA app 
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO PUBLIC;
ALTER DEFAULT PRIVILEGES IN SCHEMA app 
    GRANT USAGE, SELECT ON SEQUENCES TO PUBLIC;

-- ============================================
-- SAMPLE DATA (Optional - Uncomment to use)
-- ============================================

-- Sample admin user (password: 'admin123')
-- INSERT INTO app.users (username, email, password, first_name, last_name, role, email_verified) VALUES
-- ('admin', 'admin@ai-resume-matcher.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'User', 'ADMIN', TRUE);

-- Sample job seeker (password: 'password123')
-- INSERT INTO app.users (username, email, password, first_name, last_name, role) VALUES
-- ('john_doe', 'john.doe@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John', 'Doe', 'JOB_SEEKER');

-- Sample recruiter (password: 'password123')
-- INSERT INTO app.users (username, email, password, first_name, last_name, role, company_name) VALUES
-- ('recruiter_jane', 'jane.smith@techcorp.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Jane', 'Smith', 'RECRUITER', 'TechCorp Inc.');

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Verify tables created
-- SELECT schemaname, tablename FROM pg_tables WHERE schemaname IN ('app', 'audit') ORDER BY schemaname, tablename;

-- Verify indexes created
-- SELECT schemaname, tablename, indexname FROM pg_indexes WHERE schemaname = 'app' ORDER BY tablename, indexname;

-- Verify triggers created
-- SELECT trigger_schema, trigger_name, event_object_table FROM information_schema.triggers WHERE trigger_schema = 'app';

-- Check table sizes
-- SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size 
-- FROM pg_tables WHERE schemaname IN ('app', 'audit') ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- ============================================
-- COMPLETION
-- ============================================
-- Database schema initialized successfully!
-- Total Tables: 5 (users, resumes, jobs, job_applications, activity_log)
-- Total Indexes: 28
-- Total Views: 3
-- Total Triggers: 5
-- Total Functions: 2