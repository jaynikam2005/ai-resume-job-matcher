from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class ResumeParseResponse(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    title: Optional[str] = None
    summary: Optional[str] = None
    skills: List[str] = []
    experience: List[str] = []
    education: List[str] = []
    parsed_text: str
    confidence_score: float = Field(..., ge=0.0, le=1.0)
    ats_score: int = Field(0, ge=0, le=100)

class JobDescription(BaseModel):
    id: int
    title: str
    company: str
    description: str
    requirements: str
    location: str

class MatchRequest(BaseModel):
    resume_text: str
    job_descriptions: List[JobDescription]

class JobMatch(BaseModel):
    job_id: int
    title: str
    company: str
    similarity_score: float = Field(..., ge=0.0, le=1.0)
    match_percentage: int = Field(..., ge=0, le=100)
    matched_skills: List[str] = []

class MatchResponse(BaseModel):
    matches: List[JobMatch]
    total_jobs: int
    processing_time_ms: int
