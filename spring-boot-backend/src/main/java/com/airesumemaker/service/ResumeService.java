package com.airesumemaker.service;

import com.airesumemaker.entity.Resume;
import com.airesumemaker.entity.User;
import com.airesumemaker.repository.ResumeRepository;
import com.airesumemaker.client.AIServiceClient;
import com.airesumemaker.dto.ResumeAnalysisRequest;
import com.airesumemaker.dto.ResumeAnalysisResponse;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ResumeService {

    private ResumeRepository resumeRepository;
    private AIServiceClient aiServiceClient;

    public ResumeService(ResumeRepository resumeRepository, AIServiceClient aiServiceClient) {
        this.resumeRepository = resumeRepository;
        this.aiServiceClient = aiServiceClient;
    }

    public Resume saveResume(Resume resume) {
        return resumeRepository.save(resume);
    }

    public Optional<Resume> getResumeById(Long id) {
        return resumeRepository.findById(id);
    }

    public List<Resume> getAllResumes() {
        return resumeRepository.findAll();
    }

    public List<Resume> getResumesByUser(User user) {
        return resumeRepository.findByUser(user);
    }

    public void deleteResume(Long id) {
        resumeRepository.deleteById(id);
    }

    public Resume processResumeWithAI(String resumeText, String fileName, User user) {
        try {
            // Create request for AI service
            ResumeAnalysisRequest request = new ResumeAnalysisRequest(resumeText, fileName, "text");
            
            // Call AI service for analysis
            ResumeAnalysisResponse analysis = aiServiceClient.analyzeResume(request);
            
            // Create Resume entity with AI analysis results
            Resume resume = new Resume();
            resume.setFileName(fileName);
            resume.setParsedContent(resumeText);
            resume.setSkills(String.join(", ", analysis.getSkills()));
            resume.setExperience(analysis.getExperience());
            resume.setUser(user);
            resume.setCreatedAt(LocalDateTime.now());
            
            // Save and return the resume
            return resumeRepository.save(resume);
            
        } catch (Exception e) {
            // Fallback: save resume without AI analysis
            Resume resume = new Resume();
            resume.setFileName(fileName);
            resume.setParsedContent(resumeText);
            resume.setUser(user);
            resume.setCreatedAt(LocalDateTime.now());
            return resumeRepository.save(resume);
        }
    }
}