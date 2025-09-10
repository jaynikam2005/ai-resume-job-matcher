package com.airesumemaker.controller;

import com.airesumemaker.dto.JobCreateRequest;
import com.airesumemaker.dto.JobResponse;
import com.airesumemaker.dto.JobUpdateRequest;
import com.airesumemaker.service.JobService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/jobs")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping
    public ResponseEntity<Page<JobResponse>> getAllJobs(
            Pageable pageable,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) List<String> skills,
            @RequestParam(required = false) String company) {
        return ResponseEntity.ok(jobService.getAllJobs(pageable, location, skills, company));
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobResponse> getJob(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getJob(id));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('RECRUITER')")
    public ResponseEntity<JobResponse> createJob(@Valid @RequestBody JobCreateRequest request, Authentication auth) {
        return ResponseEntity.ok(jobService.createJob(request, auth.getName()));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('RECRUITER')")
    public ResponseEntity<JobResponse> updateJob(@PathVariable Long id, @Valid @RequestBody JobUpdateRequest request, Authentication auth) {
        return ResponseEntity.ok(jobService.updateJob(id, request, auth.getName()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('RECRUITER')")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id, Authentication auth) {
        jobService.deleteJob(id, auth.getName());
        return ResponseEntity.noContent().build();
    }
}
