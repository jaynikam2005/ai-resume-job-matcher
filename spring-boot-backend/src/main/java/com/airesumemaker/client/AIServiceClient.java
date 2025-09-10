package com.airesumemaker.client;

import com.airesumemaker.dto.ResumeAnalysisRequest;
import com.airesumemaker.dto.ResumeAnalysisResponse;
import com.airesumemaker.dto.JobMatchRequest;
import com.airesumemaker.dto.JobMatchResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class AIServiceClient {

    private final RestTemplate restTemplate;
    private final String aiServiceUrl;

    public AIServiceClient(RestTemplate restTemplate, @Value("${ai-service.url}") String aiServiceUrl) {
        this.restTemplate = restTemplate;
        this.aiServiceUrl = aiServiceUrl;
    }

    public ResumeAnalysisResponse analyzeResume(ResumeAnalysisRequest request) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        HttpEntity<ResumeAnalysisRequest> entity = new HttpEntity<>(request, headers);
        
        ResponseEntity<ResumeAnalysisResponse> response = restTemplate.exchange(
            aiServiceUrl + "/analyze-resume",
            HttpMethod.POST,
            entity,
            ResumeAnalysisResponse.class
        );
        
        return response.getBody();
    }

    public JobMatchResponse matchJobs(JobMatchRequest request) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        HttpEntity<JobMatchRequest> entity = new HttpEntity<>(request, headers);
        
        ResponseEntity<JobMatchResponse> response = restTemplate.exchange(
            aiServiceUrl + "/match-jobs",
            HttpMethod.POST,
            entity,
            JobMatchResponse.class
        );
        
        return response.getBody();
    }
}