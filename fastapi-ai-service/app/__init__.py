from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Create FastAPI app instance
app = FastAPI(
    title="AI Resume Job Matcher Service",
    description="API service for resume parsing and job matching using AI",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import routers after app creation to avoid circular imports
from app.routers import matching, resume

# Include routers
app.include_router(resume.router, prefix="/api/v1", tags=["resume"])
app.include_router(matching.router, prefix="/api/v1", tags=["matching"])

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "ai-resume-matcher"}
