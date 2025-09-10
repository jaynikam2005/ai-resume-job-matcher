from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from .routers import resume, matching
from .services.gemini_service import GeminiAIService

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting AI Resume Matcher service with Gemini AI...")
    
    # Initialize Gemini AI service
    gemini_service = GeminiAIService()
    await gemini_service.initialize()
    app.state.gemini_service = gemini_service
    
    yield
    
    # Shutdown
    logger.info("Shutting down AI Resume Matcher service...")

app = FastAPI(
    title="AI Resume Matcher",
    description="AI-powered resume parsing and job matching service using Google Gemini AI",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(resume.router, prefix="/api/v1", tags=["resume"])
app.include_router(matching.router, prefix="/api/v1", tags=["matching"])

@app.get("/")
async def root():
    return {"message": "AI Resume Matcher API with Google Gemini AI", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
