package com.airesumemaker.dto;

import java.util.List;

public class JobMatchRequest {
    private String resumeText;
    private List<String> resumeSkills;
    private List<JobResponse> availableJobs;
    private int maxMatches = 10;

    public JobMatchRequest() {
        // Default constructor
    }

    public JobMatchRequest(String resumeText, List<String> resumeSkills, List<JobResponse> availableJobs) {
        this.resumeText = resumeText;
        this.resumeSkills = resumeSkills;
        this.availableJobs = availableJobs;
    }

    // Getters and Setters
    public String getResumeText() { return resumeText; }
    public void setResumeText(String resumeText) { this.resumeText = resumeText; }

    public List<String> getResumeSkills() { return resumeSkills; }
    public void setResumeSkills(List<String> resumeSkills) { this.resumeSkills = resumeSkills; }

    public List<JobResponse> getAvailableJobs() { return availableJobs; }
    public void setAvailableJobs(List<JobResponse> availableJobs) { this.availableJobs = availableJobs; }

    public int getMaxMatches() { return maxMatches; }
    public void setMaxMatches(int maxMatches) { this.maxMatches = maxMatches; }
}