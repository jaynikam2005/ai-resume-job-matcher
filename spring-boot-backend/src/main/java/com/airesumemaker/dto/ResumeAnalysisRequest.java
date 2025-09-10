package com.airesumemaker.dto;

public class ResumeAnalysisRequest {
    private String resumeText;
    private String fileName;
    private String fileType;

    public ResumeAnalysisRequest() {
        // Default constructor for JSON deserialization
    }

    public ResumeAnalysisRequest(String resumeText, String fileName, String fileType) {
        this.resumeText = resumeText;
        this.fileName = fileName;
        this.fileType = fileType;
    }

    // Getters and Setters
    public String getResumeText() { return resumeText; }
    public void setResumeText(String resumeText) { this.resumeText = resumeText; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }
}