-- Fix jobs table to match the Job entity
ALTER TABLE jobs 
DROP COLUMN IF EXISTS salary_range,
DROP COLUMN IF EXISTS posted_date,
DROP COLUMN IF EXISTS application_deadline;

ALTER TABLE jobs 
ADD COLUMN salary_min DECIMAL(10,2),
ADD COLUMN salary_max DECIMAL(10,2),
ADD COLUMN benefits TEXT,
ADD COLUMN recruiter_email VARCHAR(255) NOT NULL DEFAULT '';

-- Rename is_active to active to match entity
ALTER TABLE jobs RENAME COLUMN is_active TO active;

-- Create job_skills table for @ElementCollection mapping
CREATE TABLE job_skills (
    job_id BIGINT NOT NULL,
    skill VARCHAR(255) NOT NULL,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);

-- Create index for job_skills
CREATE INDEX idx_job_skills_job_id ON job_skills(job_id);