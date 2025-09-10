package com.airesumemaker.dto;

import java.util.List;

public class ResumeAnalysisResponse {
    private List<String> skills;
    private String experience;
    private String email;
    private String phone;
    private String summary;
    private List<String> education;
    private List<String> certifications;

    public ResumeAnalysisResponse() {
        // Default constructor
    }

    // Getters and Setters
    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills; }

    public String getExperience() { return experience; }
    public void setExperience(String experience) { this.experience = experience; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public List<String> getEducation() { return education; }
    public void setEducation(List<String> education) { this.education = education; }

    public List<String> getCertifications() { return certifications; }
    public void setCertifications(List<String> certifications) { this.certifications = certifications; }
}