-- infrastructure/postgres-init/init.sql
-- Comprehensive PostgreSQL initialization script for AI Resume and Job Matcher
-- Handles all possible scenarios and ensures clean setup

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search performance
CREATE EXTENSION IF NOT EXISTS "unaccent"; -- For accent-insensitive search

-- Create database if not exists (for standalone execution)
-- Note: This will only work if running as superuser
-- SELECT 'CREATE DATABASE ai_resume_db' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'ai_resume_db')\gexec

-- Create schemas for better organization
CREATE SCHEMA IF NOT EXISTS app;
CREATE SCHEMA IF NOT EXISTS audit;

-- Set default schema
SET search_path TO app, public;

-- Drop existing tables if they exist (for clean reinstalls)
DROP TABLE IF EXISTS app.job_applications CASCADE;
DROP TABLE IF EXISTS app.job_skills CASCADE;
DROP TABLE IF EXISTS app.jobs CASCADE;
DROP TABLE IF EXISTS app.resumes CASCADE;
DROP TABLE IF EXISTS app.users CASCADE;

-- Drop existing types if they exist
DROP TYPE IF EXISTS app.user_role CASCADE;
DROP TYPE IF EXISTS app.application_status CASCADE;

-- Create custom types
CREATE TYPE app.user_role AS ENUM ('JOB_SEEKER', 'RECRUITER');
CREATE TYPE app.application_status AS ENUM ('PENDING', 'REVIEWED', 'ACCEPTED', 'REJECTED');

-- Create users table with comprehensive fields
CREATE TABLE app.users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    role app.user_role NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    profile_image_url VARCHAR(500),
    phone VARCHAR(20),
    location VARCHAR(255),
    bio TEXT,
    linkedin_url VARCHAR(500),
    github_url VARCHAR(500),
    website_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    CONSTRAINT users_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT users_username_length CHECK (LENGTH(username) >= 3 AND LENGTH(username) <= 50),
    CONSTRAINT users_password_length CHECK (LENGTH(password) >= 8),
    CONSTRAINT users_phone_format CHECK (phone IS NULL OR phone ~* '^\+?[1-9]\d{1,14}$')
);

-- Create resumes table with enhanced fields
CREATE TABLE app.resumes (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES app.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    file_path VARCHAR(500),
    file_name VARCHAR(255),
    file_size INTEGER,
    mime_type VARCHAR(100),
    summary TEXT,
    skills TEXT[], -- Array of skills
    experience_years INTEGER DEFAULT 0,
    education TEXT,
    certifications TEXT[],
    languages TEXT[],
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    version INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT resumes_title_length CHECK (LENGTH(title) >= 3 AND LENGTH(title) <= 255),
    CONSTRAINT resumes_content_length CHECK (LENGTH(content) >= 10),
    CONSTRAINT resumes_experience_positive CHECK (experience_years >= 0),
    CONSTRAINT resumes_file_size_limit CHECK (file_size IS NULL OR file_size <= 10485760) -- 10MB limit
);

-- Create jobs table
CREATE TABLE app.jobs (
    id BIGSERIAL PRIMARY KEY,
    recruiter_id BIGINT NOT NULL REFERENCES app.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    remote_work BOOLEAN NOT NULL DEFAULT FALSE,
    salary_min DECIMAL(12,2),
    salary_max DECIMAL(12,2),
    salary_currency VARCHAR(3) DEFAULT 'USD',
    employment_type VARCHAR(50) NOT NULL DEFAULT 'FULL_TIME',
    experience_level VARCHAR(50) NOT NULL DEFAULT 'MID_LEVEL',
    required_skills TEXT[],
    preferred_skills TEXT[],
    benefits TEXT[],
    application_deadline DATE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    view_count INTEGER NOT NULL DEFAULT 0,
    application_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT jobs_title_length CHECK (LENGTH(title) >= 3 AND LENGTH(title) <= 255),
    CONSTRAINT jobs_description_length CHECK (LENGTH(description) >= 50),
    CONSTRAINT jobs_company_length CHECK (LENGTH(company_name) >= 2),
    CONSTRAINT jobs_salary_valid CHECK (salary_min IS NULL OR salary_max IS NULL OR salary_min <= salary_max),
    CONSTRAINT jobs_salary_positive CHECK (salary_min IS NULL OR salary_min >= 0),
    CONSTRAINT jobs_employment_type_valid CHECK (employment_type IN ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE')),
    CONSTRAINT jobs_experience_level_valid CHECK (experience_level IN ('ENTRY_LEVEL', 'MID_LEVEL', 'SENIOR_LEVEL', 'EXECUTIVE')),
    CONSTRAINT jobs_currency_valid CHECK (salary_currency IN ('USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR'))
);

-- Create job applications table
CREATE TABLE app.job_applications (
    id BIGSERIAL PRIMARY KEY,
    job_id BIGINT NOT NULL REFERENCES app.jobs(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES app.users(id) ON DELETE CASCADE,
    resume_id BIGINT REFERENCES app.resumes(id) ON DELETE SET NULL,
    status app.application_status NOT NULL DEFAULT 'PENDING',
    cover_letter TEXT,
    notes TEXT,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure unique application per user per job
    UNIQUE(job_id, user_id),
    
    -- Constraints
    CONSTRAINT applications_cover_letter_length CHECK (cover_letter IS NULL OR LENGTH(cover_letter) >= 50)
);

-- Create audit log table for tracking changes
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
-- Users table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_email ON app.users(email);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_username ON app.users(username);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_role ON app.users(role);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_enabled ON app.users(enabled);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_created_at ON app.users(created_at);

-- Resumes table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_resumes_user_id ON app.resumes(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_resumes_is_active ON app.resumes(is_active);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_resumes_is_public ON app.resumes(is_public);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_resumes_skills ON app.resumes USING GIN(skills);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_resumes_content_search ON app.resumes USING GIN(to_tsvector('english', content));

-- Jobs table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jobs_recruiter_id ON app.jobs(recruiter_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jobs_is_active ON app.jobs(is_active);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jobs_location ON app.jobs(location);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jobs_employment_type ON app.jobs(employment_type);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jobs_experience_level ON app.jobs(experience_level);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jobs_required_skills ON app.jobs USING GIN(required_skills);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jobs_title_search ON app.jobs USING GIN(to_tsvector('english', title));
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jobs_description_search ON app.jobs USING GIN(to_tsvector('english', description));
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jobs_created_at ON app.jobs(created_at);

-- Job applications table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_applications_job_id ON app.job_applications(job_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_applications_user_id ON app.job_applications(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_applications_status ON app.job_applications(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_applications_applied_at ON app.job_applications(applied_at);

-- Audit table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_user_id ON audit.activity_log(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_entity ON audit.activity_log(entity_type, entity_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_created_at ON audit.activity_log(created_at);

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates
DROP TRIGGER IF EXISTS update_users_updated_at ON app.users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON app.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_resumes_updated_at ON app.resumes;
CREATE TRIGGER update_resumes_updated_at
    BEFORE UPDATE ON app.resumes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_jobs_updated_at ON app.jobs;
CREATE TRIGGER update_jobs_updated_at
    BEFORE UPDATE ON app.jobs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_applications_updated_at ON app.job_applications;
CREATE TRIGGER update_applications_updated_at
    BEFORE UPDATE ON app.job_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function for logging activities
CREATE OR REPLACE FUNCTION log_activity()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit.activity_log (user_id, action, entity_type, entity_id, old_values, new_values)
    VALUES (
        COALESCE(NEW.user_id, OLD.user_id),
        TG_OP,
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
        CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN row_to_json(NEW) ELSE NULL END
    );
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Create audit triggers (optional, can be resource intensive)
-- Uncomment if you want detailed audit logging
-- CREATE TRIGGER audit_users AFTER INSERT OR UPDATE OR DELETE ON app.users FOR EACH ROW EXECUTE FUNCTION log_activity();
-- CREATE TRIGGER audit_resumes AFTER INSERT OR UPDATE OR DELETE ON app.resumes FOR EACH ROW EXECUTE FUNCTION log_activity();
-- CREATE TRIGGER audit_jobs AFTER INSERT OR UPDATE OR DELETE ON app.jobs FOR EACH ROW EXECUTE FUNCTION log_activity();

-- Insert sample data for testing (optional)
-- Uncomment if you want some initial test data

-- Sample users
-- INSERT INTO app.users (username, email, password, first_name, last_name, role) VALUES
-- ('admin', 'admin@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'User', 'RECRUITER'),
-- ('jobseeker1', 'seeker@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John', 'Doe', 'JOB_SEEKER'),
-- ('recruiter1', 'recruiter@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Jane', 'Smith', 'RECRUITER');

-- Create views for common queries
CREATE OR REPLACE VIEW app.active_jobs AS
SELECT 
    j.*,
    u.first_name || ' ' || u.last_name AS recruiter_name,
    u.company_name AS recruiter_company
FROM app.jobs j
JOIN app.users u ON j.recruiter_id = u.id
WHERE j.is_active = TRUE 
  AND (j.application_deadline IS NULL OR j.application_deadline >= CURRENT_DATE);

CREATE OR REPLACE VIEW app.user_stats AS
SELECT 
    u.id,
    u.username,
    u.email,
    u.role,
    COALESCE(r.resume_count, 0) AS resume_count,
    CASE 
        WHEN u.role = 'JOB_SEEKER' THEN COALESCE(a.application_count, 0)
        WHEN u.role = 'RECRUITER' THEN COALESCE(j.job_count, 0)
        ELSE 0
    END AS activity_count
FROM app.users u
LEFT JOIN (
    SELECT user_id, COUNT(*) AS resume_count 
    FROM app.resumes 
    WHERE is_active = TRUE 
    GROUP BY user_id
) r ON u.id = r.user_id
LEFT JOIN (
    SELECT user_id, COUNT(*) AS application_count 
    FROM app.job_applications 
    GROUP BY user_id
) a ON u.id = a.user_id
LEFT JOIN (
    SELECT recruiter_id, COUNT(*) AS job_count 
    FROM app.jobs 
    WHERE is_active = TRUE 
    GROUP BY recruiter_id
) j ON u.id = j.recruiter_id;

-- Grant permissions
GRANT USAGE ON SCHEMA app TO PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA app TO PUBLIC;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA app TO PUBLIC;
GRANT USAGE ON SCHEMA audit TO PUBLIC;
GRANT SELECT, INSERT ON audit.activity_log TO PUBLIC;

-- Set default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA app GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO PUBLIC;
ALTER DEFAULT PRIVILEGES IN SCHEMA app GRANT USAGE, SELECT ON SEQUENCES TO PUBLIC;

COMMIT;
