package com.airesumemaker.service;

import com.airesumemaker.dto.JobCreateRequest;
import com.airesumemaker.dto.JobResponse;
import com.airesumemaker.dto.JobUpdateRequest;
import com.airesumemaker.entity.Job;
import com.airesumemaker.repository.JobRepository;
import com.airesumemaker.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class JobService {
    
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    
    public JobService(JobRepository jobRepository, UserRepository userRepository) {
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
    }
    
    public Page<JobResponse> getAllJobs(Pageable pageable, String location, List<String> skills, String company) {
        Page<Job> jobs = jobRepository.findJobsWithFilters(location, company, skills, pageable);
        return jobs.map(this::mapToJobResponse);
    }
    
    public JobResponse getJob(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + id));
        return mapToJobResponse(job);
    }
    
    @Transactional
    public JobResponse createJob(JobCreateRequest request, String recruiterEmail) {
        userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() -> new RuntimeException("Recruiter not found with email: " + recruiterEmail));
        
        Job job = new Job();
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setCompany(request.getCompany());
        job.setLocation(request.getLocation());
        job.setSalaryMin(request.getSalaryMin());
        job.setSalaryMax(request.getSalaryMax());
        job.setJobType(request.getJobType());
        job.setExperienceLevel(request.getExperienceLevel());
        job.setSkills(request.getSkills());
        job.setRequirements(request.getRequirements());
        job.setBenefits(request.getBenefits());
        job.setRecruiterEmail(recruiterEmail);
        job.setCreatedAt(LocalDateTime.now());
        job.setUpdatedAt(LocalDateTime.now());
        
        Job savedJob = jobRepository.save(job);
        return mapToJobResponse(savedJob);
    }
    
    @Transactional
    public JobResponse updateJob(Long id, JobUpdateRequest request, String recruiterEmail) {
        Job job = jobRepository.findByIdAndRecruiterEmail(id, recruiterEmail)
                .orElseThrow(() -> new RuntimeException("Job not found or unauthorized"));
        
        if (request.getTitle() != null) {
            job.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            job.setDescription(request.getDescription());
        }
        if (request.getCompany() != null) {
            job.setCompany(request.getCompany());
        }
        if (request.getLocation() != null) {
            job.setLocation(request.getLocation());
        }
        if (request.getSalaryMin() != null) {
            job.setSalaryMin(request.getSalaryMin());
        }
        if (request.getSalaryMax() != null) {
            job.setSalaryMax(request.getSalaryMax());
        }
        if (request.getJobType() != null) {
            job.setJobType(request.getJobType());
        }
        if (request.getExperienceLevel() != null) {
            job.setExperienceLevel(request.getExperienceLevel());
        }
        if (request.getSkills() != null) {
            job.setSkills(request.getSkills());
        }
        if (request.getRequirements() != null) {
            job.setRequirements(request.getRequirements());
        }
        if (request.getBenefits() != null) {
            job.setBenefits(request.getBenefits());
        }
        
        job.setUpdatedAt(LocalDateTime.now());
        
        Job savedJob = jobRepository.save(job);
        return mapToJobResponse(savedJob);
    }
    
    @Transactional
    public void deleteJob(Long id, String recruiterEmail) {
        Job job = jobRepository.findByIdAndRecruiterEmail(id, recruiterEmail)
                .orElseThrow(() -> new RuntimeException("Job not found or unauthorized"));
        jobRepository.delete(job);
    }
    
    public List<JobResponse> getJobsByRecruiter(String recruiterEmail) {
        List<Job> jobs = jobRepository.findByRecruiterEmail(recruiterEmail);
        return jobs.stream()
                .map(this::mapToJobResponse)
                .toList();
    }
    
    private JobResponse mapToJobResponse(Job job) {
        return new JobResponse(
                job.getId(),
                job.getTitle(),
                job.getDescription(),
                job.getCompany(),
                job.getLocation(),
                job.getSalaryMin(),
                job.getSalaryMax(),
                job.getJobType(),
                job.getExperienceLevel(),
                job.getSkills(),
                job.getRequirements(),
                job.getBenefits(),
                job.getRecruiterEmail(),
                job.getCreatedAt(),
                job.getUpdatedAt()
        );
    }
}