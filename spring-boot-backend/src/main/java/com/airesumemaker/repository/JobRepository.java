package com.airesumemaker.repository;

import com.airesumemaker.entity.Job;
import com.airesumemaker.entity.Job.ExperienceLevel;
import com.airesumemaker.entity.Job.JobType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    
    @Query("SELECT j FROM Job j WHERE " +
           "(:location IS NULL OR j.location ILIKE %:location%) AND " +
           "(:company IS NULL OR j.company ILIKE %:company%) AND " +
           "(:skills IS NULL OR EXISTS (SELECT 1 FROM j.skills s WHERE s IN :skills))")
    Page<Job> findJobsWithFilters(
        @Param("location") String location,
        @Param("company") String company,
        @Param("skills") List<String> skills,
        Pageable pageable
    );
    
    List<Job> findByRecruiterEmail(String recruiterEmail);
    
    Optional<Job> findByIdAndRecruiterEmail(Long id, String recruiterEmail);
    
    Page<Job> findByTitleContainingIgnoreCase(String title, Pageable pageable);
    
    Page<Job> findByCompanyContainingIgnoreCase(String company, Pageable pageable);
    
    Page<Job> findByLocationContainingIgnoreCase(String location, Pageable pageable);
    
    Page<Job> findByJobType(JobType jobType, Pageable pageable);
    
    Page<Job> findByExperienceLevel(ExperienceLevel experienceLevel, Pageable pageable);
}