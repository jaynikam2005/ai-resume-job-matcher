from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Request
from ..services.resume_parser import ResumeParser
from ..services.gemini_service import GeminiAIService
from ..models.schemas import ResumeParseResponse
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

def get_resume_parser():
    return ResumeParser()

def get_gemini_service(request: Request):
    return request.app.state.gemini_service

@router.post("/parse-resume", response_model=ResumeParseResponse)
async def parse_resume(
    file: UploadFile = File(...),
    parser: ResumeParser = Depends(get_resume_parser),
    gemini_service: GeminiAIService = Depends(get_gemini_service)
):
    """Parse an uploaded resume file and extract structured information using Gemini AI."""
    
    # Validate file type
    allowed_types = ['application/pdf', 'application/msword', 
                     'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                     'text/plain']
    
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400, 
            detail=f"File type {file.content_type} not supported. Please upload PDF, DOC, DOCX, or TXT files."
        )
    
    # Validate file size (10MB limit)
    file_content = await file.read()
    if len(file_content) > 10 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="File size too large. Maximum size is 10MB."
        )
    
    try:
        # First, extract text from the file
        extracted_text = parser.extract_text(file_content, file.filename)
        
        # Then use Gemini AI to analyze the resume
        analysis_result = await gemini_service.analyze_resume(extracted_text, file.filename)
        
        # Compute ATS score using parser heuristics + extracted analysis
        ats_score = parser.compute_ats_score(extracted_text, analysis_result)

        # Convert Gemini response to our schema format
        response = ResumeParseResponse(
            name=analysis_result.get("name"),
            email=analysis_result.get("email", ""),
            phone=analysis_result.get("phone", ""),
            title=analysis_result.get("title"),
            summary=analysis_result.get("summary"),
            skills=analysis_result.get("skills", []),
            experience=analysis_result.get("experience_list", []) or ([analysis_result.get("experience")] if analysis_result.get("experience") else []),
            education=analysis_result.get("education", []),
            parsed_text=extracted_text,
            confidence_score=0.9,
            ats_score=ats_score
        )
        
        return response
    
    except Exception as e:
        logger.error(f"Error parsing resume: {e}")
        raise HTTPException(
            status_code=500,
            detail="Error processing resume file"
        )

@router.post("/analyze-text")
async def analyze_resume_text(
    request: dict,
    gemini_service: GeminiAIService = Depends(get_gemini_service)
):
    """Analyze resume text directly using Gemini AI (for Spring Boot integration)."""
    
    try:
        resume_text = request.get("resumeText", "")
        filename = request.get("fileName", "")
        
        if not resume_text:
            raise HTTPException(status_code=400, detail="Resume text is required")
        
        # Analyze with Gemini AI
        analysis_result = await gemini_service.analyze_resume(resume_text, filename)
        
        return analysis_result
    
    except Exception as e:
        logger.error(f"Error analyzing resume text: {e}")
        raise HTTPException(
            status_code=500,
            detail="Error analyzing resume text"
        )
