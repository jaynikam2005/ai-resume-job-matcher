package com.airesumemaker.dto;

import java.util.List;

public class JobMatchResponse {
    private List<JobMatch> matches;

    public JobMatchResponse() {
        // Default constructor
    }

    public JobMatchResponse(List<JobMatch> matches) {
        this.matches = matches;
    }

    public List<JobMatch> getMatches() { return matches; }
    public void setMatches(List<JobMatch> matches) { this.matches = matches; }

    public static class JobMatch {
        private Long jobId;
        private String jobTitle;
        private String company;
        private double matchScore;
        private List<String> matchingSkills;
        private List<String> missingSkills;
        private String explanation;

        public JobMatch() {
            // Default constructor
        }

        // Getters and Setters
        public Long getJobId() { return jobId; }
        public void setJobId(Long jobId) { this.jobId = jobId; }

        public String getJobTitle() { return jobTitle; }
        public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }

        public String getCompany() { return company; }
        public void setCompany(String company) { this.company = company; }

        public double getMatchScore() { return matchScore; }
        public void setMatchScore(double matchScore) { this.matchScore = matchScore; }

        public List<String> getMatchingSkills() { return matchingSkills; }
        public void setMatchingSkills(List<String> matchingSkills) { this.matchingSkills = matchingSkills; }

        public List<String> getMissingSkills() { return missingSkills; }
        public void setMissingSkills(List<String> missingSkills) { this.missingSkills = missingSkills; }

        public String getExplanation() { return explanation; }
        public void setExplanation(String explanation) { this.explanation = explanation; }
    }
}