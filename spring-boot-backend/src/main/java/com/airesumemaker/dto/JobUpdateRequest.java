package com.airesumemaker.dto;

import com.airesumemaker.entity.Job.ExperienceLevel;
import com.airesumemaker.entity.Job.JobType;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.util.List;

public class JobUpdateRequest {
    private String title;
    private String description;
    private String company;
    private String location;
    
    @Positive
    private BigDecimal salaryMin;
    
    @Positive
    private BigDecimal salaryMax;
    
    private JobType jobType;
    private ExperienceLevel experienceLevel;
    private List<String> skills;
    private String requirements;
    private String benefits;

    // Default constructor
    public JobUpdateRequest() {
        // Default constructor for JSON deserialization
    }

    // Getters and Setters
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
}