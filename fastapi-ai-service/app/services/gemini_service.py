import os
import json
import logging
from typing import List, Dict, Any, Optional
import asyncio
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold

logger = logging.getLogger(__name__)

class GeminiAIService:
    def __init__(self):
        self.client = None
        self.model = None
        
    async def initialize(self):
        """Initialize the Gemini AI client."""
        try:
            # Get API key from environment variable
            api_key = os.getenv("GOOGLE_API_KEY")
            if not api_key:
                raise ValueError("GOOGLE_API_KEY environment variable not set")
            
            # Configure the Gemini client
            genai.configure(api_key=api_key)
            
            # Initialize the model
            self.model = genai.GenerativeModel(
                model_name="gemini-1.5-flash",
                safety_settings={
                    HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                    HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                    HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                    HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                }
            )
            
            logger.info("Gemini AI service initialized successfully")
            
        except Exception as e:
            logger.error(f"Error initializing Gemini AI service: {e}")
            raise

    async def analyze_resume(self, resume_text: str, filename: str = "") -> Dict[str, Any]:
        """Analyze resume and extract structured information using Gemini AI."""
        
        if not self.model:
            raise RuntimeError("Gemini AI service not initialized")
        
        prompt = f"""
        Analyze the following resume and extract structured information in JSON format.
        
        Resume text:
        {resume_text}
        
        Please extract and return a JSON object with the following structure:
        {{
            "skills": ["skill1", "skill2", "skill3"],
            "experience": "X years of experience in...",
            "email": "extracted_email@example.com",
            "phone": "extracted_phone_number",
            "name": "Full Name if present",
            "title": "Primary professional title or role",
            "summary": "Professional summary...",
            "education": ["Degree 1", "Degree 2"],
            "certifications": ["Cert 1", "Cert 2"]
        }}
        
        Instructions:
        - Extract technical skills, programming languages, frameworks, and tools
        - Summarize work experience with years of experience
        - Extract contact information (email, phone)
        - Extract full name from header or contact section when possible
        - Extract most relevant title (e.g., 'Full Stack Developer')
        - Create a concise professional summary
        - List education qualifications
        - List any certifications or professional qualifications
        - Return only valid JSON, no additional text or explanations
        """
        
        try:
            response = await self._generate_content(prompt)
            
            # Parse the JSON response
            try:
                # Clean the response to extract JSON
                response_text = response.strip()
                if response_text.startswith("```json"):
                    response_text = response_text[7:]
                if response_text.endswith("```"):
                    response_text = response_text[:-3]
                
                result = json.loads(response_text.strip())
                # Normalize keys used elsewhere
                normalized = {
                    "skills": result.get("skills", []),
                    "experience": result.get("experience", ""),
                    "experience_list": result.get("experience_list", []),
                    "email": result.get("email", ""),
                    "phone": result.get("phone", ""),
                    "name": result.get("name"),
                    "title": result.get("title"),
                    "summary": result.get("summary", ""),
                    "education": result.get("education", []),
                    "certifications": result.get("certifications", []),
                }
                return normalized
                
            except json.JSONDecodeError as e:
                logger.error(f"Error parsing JSON response: {e}")
                logger.error(f"Raw response: {response}")
                
                # Return fallback structure
                return {
                    "skills": [],
                    "experience": "Unable to parse experience",
                    "email": "",
                    "phone": "",
                    "summary": "Unable to parse summary",
                    "education": [],
                    "certifications": []
                }
                
        except Exception as e:
            logger.error(f"Error analyzing resume with Gemini AI: {e}")
            raise

    async def match_jobs(self, resume_text: str, resume_skills: List[str], jobs: List[Dict[str, Any]], max_matches: int = 10) -> List[Dict[str, Any]]:
        """Match resume with jobs using Gemini AI for intelligent scoring."""
        
        if not self.model:
            raise RuntimeError("Gemini AI service not initialized")
        
        # Prepare job information for the AI
        jobs_text = ""
        for i, job in enumerate(jobs):
            jobs_text += f"Job {i+1}:\n"
            jobs_text += f"Title: {job.get('title', 'N/A')}\n"
            jobs_text += f"Company: {job.get('company', 'N/A')}\n"
            jobs_text += f"Description: {job.get('description', 'N/A')}\n"
            jobs_text += f"Requirements: {job.get('requirements', 'N/A')}\n\n"
        
        prompt = f"""
        You are an expert recruiter and career advisor. Analyze the following resume and job postings to provide intelligent job matching.
        
        RESUME:
        {resume_text}
        
        EXTRACTED SKILLS: {', '.join(resume_skills)}
        
        AVAILABLE JOBS:
        {jobs_text}
        
        Please analyze each job and provide a match score (0-100) based on:
        1. Skill alignment
        2. Experience requirements
        3. Job responsibilities fit
        4. Career growth potential
        
        Return a JSON array with the top {max_matches} matches in the following format:
        [
            {{
                "jobId": 1,
                "jobTitle": "Job Title",
                "company": "Company Name",
                "matchScore": 85.5,
                "matchingSkills": ["skill1", "skill2"],
                "missingSkills": ["skill3", "skill4"],
                "explanation": "Detailed explanation of why this is a good match and what makes the candidate suitable."
            }}
        ]
        
        Sort by match score (highest first) and return only the top {max_matches} matches.
        Return only valid JSON, no additional text.
        """
        
        try:
            response = await self._generate_content(prompt)
            
            # Parse the JSON response
            try:
                # Clean the response to extract JSON
                response_text = response.strip()
                if response_text.startswith("```json"):
                    response_text = response_text[7:]
                if response_text.endswith("```"):
                    response_text = response_text[:-3]
                
                matches = json.loads(response_text.strip())
                return matches
                
            except json.JSONDecodeError as e:
                logger.error(f"Error parsing job matching JSON response: {e}")
                logger.error(f"Raw response: {response}")
                
                # Return fallback matches
                fallback_matches = []
                for i, job in enumerate(jobs[:max_matches]):
                    fallback_matches.append({
                        "jobId": job.get("id", i+1),
                        "jobTitle": job.get("title", "Unknown Title"),
                        "company": job.get("company", "Unknown Company"),
                        "matchScore": 50.0,  # Default score
                        "matchingSkills": [],
                        "missingSkills": [],
                        "explanation": "Unable to perform detailed analysis due to parsing error."
                    })
                
                return fallback_matches
                
        except Exception as e:
            logger.error(f"Error matching jobs with Gemini AI: {e}")
            raise

    async def _generate_content(self, prompt: str) -> str:
        """Generate content using Gemini AI model. Run blocking call in a thread."""
        try:
            response = await asyncio.to_thread(self.model.generate_content, prompt)
            return response.text
        except Exception as e:
            logger.error(f"Error generating content with Gemini AI: {e}")
            raise