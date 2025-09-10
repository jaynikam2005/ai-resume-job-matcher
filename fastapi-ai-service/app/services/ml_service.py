import asyncio
from sentence_transformers import SentenceTransformer
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import logging
from typing import List, Tuple

logger = logging.getLogger(__name__)

class MLService:
    def __init__(self):
        self.model = None
        self.model_name = "all-MiniLM-L6-v2"  # Lightweight but effective model
    
    async def initialize(self):
        """Initialize the ML model asynchronously."""
        try:
            logger.info(f"Loading sentence transformer model: {self.model_name}")
            # Run model loading in thread pool to avoid blocking
            loop = asyncio.get_event_loop()
            self.model = await loop.run_in_executor(
                None, 
                SentenceTransformer, 
                self.model_name
            )
            logger.info("Model loaded successfully")
        except Exception as e:
            logger.error(f"Error loading model: {e}")
            raise
    
    async def compute_embeddings(self, texts: List[str]) -> np.ndarray:
        """Compute embeddings for a list of texts."""
        if not self.model:
            raise RuntimeError("Model not initialized")
        
        try:
            loop = asyncio.get_event_loop()
            embeddings = await loop.run_in_executor(
                None, 
                self.model.encode, 
                texts
            )
            return embeddings
        except Exception as e:
            logger.error(f"Error computing embeddings: {e}")
            raise
    
    async def compute_similarity_scores(
        self, 
        resume_text: str, 
        job_descriptions: List[str]
    ) -> List[Tuple[int, float]]:
        """Compute similarity scores between resume and job descriptions."""
        
        # Prepare all texts for embedding
        all_texts = [resume_text] + job_descriptions
        
        # Compute embeddings
        embeddings = await self.compute_embeddings(all_texts)
        
        # Resume embedding is the first one
        resume_embedding = embeddings[0:1]
        job_embeddings = embeddings[1:]
        
        # Compute cosine similarities
        similarities = cosine_similarity(resume_embedding, job_embeddings)[0]
        
        # Return sorted list of (index, score) tuples
        scored_jobs = [(i, float(score)) for i, score in enumerate(similarities)]
        scored_jobs.sort(key=lambda x: x[1], reverse=True)
        
        return scored_jobs
    
    def extract_matching_skills(self, resume_text: str, job_description: str) -> List[str]:
        """Extract skills that match between resume and job description."""
        
        # Simple keyword-based matching for skills
        common_skills = [
            'python', 'java', 'javascript', 'react', 'angular', 'vue', 'node.js',
            'spring boot', 'django', 'flask', 'sql', 'postgresql', 'mysql',
            'mongodb', 'redis', 'elasticsearch', 'docker', 'kubernetes',
            'aws', 'azure', 'gcp', 'git', 'jenkins', 'ci/cd', 'agile',
            'machine learning', 'ai', 'data science', 'tensorflow', 'pytorch'
        ]
        
        resume_lower = resume_text.lower()
        job_lower = job_description.lower()
        
        matched_skills = []
        for skill in common_skills:
            if skill in resume_lower and skill in job_lower:
                matched_skills.append(skill)
        
        return matched_skills
