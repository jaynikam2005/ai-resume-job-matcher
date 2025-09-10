from fastapi import APIRouter, HTTPException, Depends, Request
from ..models.schemas import MatchRequest, MatchResponse, JobMatch
from ..services.gemini_service import GeminiAIService
import time
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

def get_gemini_service(request: Request):
    return request.app.state.gemini_service

@router.post("/match", response_model=MatchResponse)
async def match_resume_to_jobs(
    match_request: MatchRequest,
    gemini_service: GeminiAIService = Depends(get_gemini_service)
):
    """Match a resume against multiple job descriptions using Gemini AI."""
    
    start_time = time.time()
    
    try:
        # Convert job descriptions to the format expected by Gemini
        jobs_for_gemini = []
        for job in match_request.job_descriptions:
            jobs_for_gemini.append({
                "id": job.id,
                "title": job.title,
                "company": job.company,
                "description": job.description,
                "requirements": job.requirements,
                "location": job.location
            })
        
        # Get matches from Gemini AI (with empty skills list for now)
        gemini_matches = await gemini_service.match_jobs(
            match_request.resume_text,
            [],  # We'll extract skills from resume later if needed
            jobs_for_gemini,
            max_matches=len(jobs_for_gemini)
        )
        
        # Convert Gemini matches to our schema format
        matches = []
        for gemini_match in gemini_matches:
            match = JobMatch(
                job_id=gemini_match.get("jobId", 0),
                title=gemini_match.get("jobTitle", ""),
                company=gemini_match.get("company", ""),
                similarity_score=gemini_match.get("matchScore", 0) / 100.0,  # Convert to 0-1 range
                match_percentage=int(gemini_match.get("matchScore", 0)),
                matched_skills=gemini_match.get("matchingSkills", [])
            )
            matches.append(match)
        
        processing_time = int((time.time() - start_time) * 1000)
        
        return MatchResponse(
            matches=matches,
            total_jobs=len(match_request.job_descriptions),
            processing_time_ms=processing_time
        )
    
    except Exception as e:
        logger.error(f"Error matching resume to jobs: {e}")
        raise HTTPException(
            status_code=500,
            detail="Error processing job matching request"
        )

@router.post("/match-jobs")
async def match_jobs_endpoint(
    request: dict,
    gemini_service: GeminiAIService = Depends(get_gemini_service)
):
    """Match jobs endpoint for Spring Boot integration."""
    
    try:
        resume_text = request.get("resumeText", "")
        resume_skills = request.get("resumeSkills", [])
        available_jobs = request.get("availableJobs", [])
        max_matches = request.get("maxMatches", 10)
        
        if not resume_text:
            raise HTTPException(status_code=400, detail="Resume text is required")
        
        if not available_jobs:
            raise HTTPException(status_code=400, detail="Available jobs list is required")
        
        # Use Gemini AI for job matching
        matches = await gemini_service.match_jobs(
            resume_text,
            resume_skills,
            available_jobs,
            max_matches
        )
        
        return {"matches": matches}
    
    except Exception as e:
        logger.error(f"Error in job matching endpoint: {e}")
        raise HTTPException(
            status_code=500,
            detail="Error processing job matching request"
        )

@router.get("/health")
async def health_check():
    """Health check endpoint for the matching service."""
    return {"status": "healthy", "service": "job-matching"}
