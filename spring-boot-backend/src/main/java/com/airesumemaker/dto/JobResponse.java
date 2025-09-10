package com.airesumemaker.dto;

import com.airesumemaker.entity.Job.ExperienceLevel;
import com.airesumemaker.entity.Job.JobType;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class JobResponse {
    private Long id;
    private String title;
    private String description;
    private String company;
    private String location;
    private BigDecimal salaryMin;
    private BigDecimal salaryMax;
    private JobType jobType;
    private ExperienceLevel experienceLevel;
    private List<String> skills;
    private String requirements;
    private String benefits;
    private String recruiterEmail;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructors
    public JobResponse() {
        // Default constructor
    }

    public JobResponse(Long id, String title, String description, String company, String location, BigDecimal salaryMin, BigDecimal salaryMax, JobType jobType, ExperienceLevel experienceLevel, List<String> skills, String requirements, String benefits, String recruiterEmail, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.company = company;
        this.location = location;
        this.salaryMin = salaryMin;
        this.salaryMax = salaryMax;
        this.jobType = jobType;
        this.experienceLevel = experienceLevel;
        this.skills = skills;
        this.requirements = requirements;
        this.benefits = benefits;
        this.recruiterEmail = recruiterEmail;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public BigDecimal getSalaryMin() { return salaryMin; }
    public void setSalaryMin(BigDecimal salaryMin) { this.salaryMin = salaryMin; }

    public BigDecimal getSalaryMax() { return salaryMax; }
    public void setSalaryMax(BigDecimal salaryMax) { this.salaryMax = salaryMax; }

    public JobType getJobType() { return jobType; }
    public void setJobType(JobType jobType) { this.jobType = jobType; }

    public ExperienceLevel getExperienceLevel() { return experienceLevel; }
    public void setExperienceLevel(ExperienceLevel experienceLevel) { this.experienceLevel = experienceLevel; }

    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills; }

    public String getRequirements() { return requirements; }
    public void setRequirements(String requirements) { this.requirements = requirements; }

    public String getBenefits() { return benefits; }
    public void setBenefits(String benefits) { this.benefits = benefits; }

    public String getRecruiterEmail() { return recruiterEmail; }
    public void setRecruiterEmail(String recruiterEmail) { this.recruiterEmail = recruiterEmail; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}