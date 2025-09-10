import re
import spacy
from typing import Dict, List, Optional
import PyPDF2
from docx import Document
import io
import logging

logger = logging.getLogger(__name__)

class ResumeParser:
    def __init__(self):
        self.nlp = None
        self._load_model()
    
    def _load_model(self):
        try:
            self.nlp = spacy.load("en_core_web_sm")
        except OSError:
            logger.warning("spaCy model not found. Install with: python -m spacy download en_core_web_sm")
            self.nlp = None
    
    def extract_text(self, file_content: bytes, filename: str) -> str:
        """Extract text from file without full parsing."""
        
        # Extract text based on file type
        if filename.lower().endswith('.pdf'):
            return self._extract_pdf_text(file_content)
        elif filename.lower().endswith(('.doc', '.docx')):
            return self._extract_docx_text(file_content)
        else:
            # Assume it's plain text
            return file_content.decode('utf-8', errors='ignore')

    async def parse_file(self, file_content: bytes, filename: str) -> Dict:
# Extract text based on file type
        if filename.lower().endswith('.pdf'):
            text = self._extract_pdf_text(file_content)
        elif filename.lower().endswith(('.doc', '.docx')):
            text = self._extract_docx_text(file_content)
        else:
            # Assume it's plain text
            text = file_content.decode('utf-8', errors='ignore')
        
        # Parse the extracted text
        parsed_data = self._parse_text(text)
        parsed_data['parsed_text'] = text
        
        return parsed_data
    
    def _extract_pdf_text(self, file_content: bytes) -> str:
        """Extract text from PDF file."""
        try:
            pdf_file = io.BytesIO(file_content)
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
            
            return text
        except Exception as e:
            logger.error(f"Error extracting PDF text: {e}")
            return ""
    
    def _extract_docx_text(self, file_content: bytes) -> str:
        """Extract text from DOCX file."""
        try:
            doc_file = io.BytesIO(file_content)
            doc = Document(doc_file)
            
            text = ""
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
            
            return text
        except Exception as e:
            logger.error(f"Error extracting DOCX text: {e}")
            return ""
    
    def _parse_text(self, text: str) -> Dict:
        """Parse structured information from text."""
        
        parsed_data = {
            'name': self._extract_name(text),
            'email': self._extract_email(text),
            'phone': self._extract_phone(text),
            'skills': self._extract_skills(text),
            'experience': self._extract_experience(text),
            'education': self._extract_education(text),
            'confidence_score': 0.8  # Simple confidence score
        }
        
        return parsed_data

    def compute_ats_score(self, text: str, analysis: Dict) -> int:
        """Compute a simple ATS readiness score (0-100) using deterministic heuristics.
        This is not a vendor ATS score but correlates with commonly used checks.
        """
        score = 0
        # Contact info (0-15)
        if analysis.get('email'): score += 8
        if analysis.get('phone'): score += 7

        # Skills coverage (0-25)
        skills = analysis.get('skills') or []
        unique_skills = len(set(skills))
        score += min(25, unique_skills)

        # Experience signals (0-20)
        years_match = re.search(r'(\d+)(?:\+)?\s*(?:years|yrs)', text.lower())
        if years_match:
            yrs = int(years_match.group(1))
            score += min(20, 5 + yrs)  # base 5 + years capped at 20
        elif analysis.get('experience'):
            score += 10

        # Education present (0-10)
        if analysis.get('education'):
            score += 10

        # Formatting & readability (0-20)
        lines = [ln.strip() for ln in text.split('\n') if ln.strip()]
        bullets = sum(1 for ln in lines if ln.startswith(('-', '*', '•')))
        if bullets >= 10:
            score += 20
        elif bullets >= 5:
            score += 15
        elif bullets >= 1:
            score += 8

        # Length threshold (0-10)
        if len(text) >= 1500:
            score += 10
        elif len(text) >= 800:
            score += 6
        elif len(text) >= 300:
            score += 3

        return max(0, min(100, int(score)))
    
    def _extract_name(self, text: str) -> Optional[str]:
        """Extract name using simple heuristics."""
        lines = text.split('\n')
        
        # Look for name in first few lines
        for line in lines[:5]:
            line = line.strip()
            if len(line.split()) == 2 and line.replace(' ', '').isalpha():
                # Simple check for two words that are only letters
                if not any(keyword in line.lower() for keyword in ['email', 'phone', 'address']):
                    return line
        
        return None
    
    def _extract_email(self, text: str) -> Optional[str]:
        """Extract email using regex."""
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        emails = re.findall(email_pattern, text)
        
        # Return the first valid-looking email
        if emails:
            return emails[0]
        
        return None
    
    def _extract_phone(self, text: str) -> Optional[str]:
        """Extract phone number using regex."""
        phone_patterns = [
            r'\+?1?[-.\s]?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})',
            r'\+?([0-9]{1,3})[-.\s]?([0-9]{3,4})[-.\s]?([0-9]{3,4})[-.\s]?([0-9]{3,4})'
        ]
        
        for pattern in phone_patterns:
            matches = re.findall(pattern, text)
            if matches:
                return ''.join(matches[0])
        
        return None
    
    def _extract_skills(self, text: str) -> List[str]:
        """Extract skills using keyword matching and NLP."""
        
        # Common technical skills
        technical_skills = [
            'python', 'java', 'javascript', 'react', 'angular', 'vue', 'node.js',
            'spring boot', 'django', 'flask', 'sql', 'postgresql', 'mysql',
            'mongodb', 'redis', 'elasticsearch', 'docker', 'kubernetes',
            'aws', 'azure', 'gcp', 'git', 'jenkins', 'ci/cd', 'agile',
            'machine learning', 'ai', 'data science', 'tensorflow', 'pytorch'
        ]
        
        found_skills = []
        text_lower = text.lower()
        
        for skill in technical_skills:
            if skill.lower() in text_lower:
                found_skills.append(skill)
        
        # Use NLP for additional entity extraction if available
        if self.nlp:
            doc = self.nlp(text)
            for ent in doc.ents:
                if ent.label_ in ['PRODUCT', 'ORG'] and len(ent.text) > 2:
                    # Filter for technology-related entities
                    if any(tech in ent.text.lower() for tech in ['framework', 'language', 'database', 'tool']):
                        found_skills.append(ent.text)
        
        return list(set(found_skills))
    
    def _extract_experience(self, text: str) -> List[str]:
        """Extract work experience sections."""
        experience = []
        
        # Look for common experience section headers
        experience_headers = ['experience', 'work experience', 'employment', 'career']
        
        lines = text.split('\n')
        in_experience_section = False
        current_experience = ""
        
        for line in lines:
            line = line.strip()
            
            # Check if we're entering an experience section
            if any(header in line.lower() for header in experience_headers):
                in_experience_section = True
                continue
            
            # Check if we're leaving the experience section
            if in_experience_section and any(section in line.lower() for section in ['education', 'skills', 'projects']):
                if current_experience:
                    experience.append(current_experience.strip())
                    current_experience = ""
                in_experience_section = False
            
            if in_experience_section and line:
                current_experience += line + " "
        
        if current_experience:
            experience.append(current_experience.strip())
        
        return experience
    
    def _extract_education(self, text: str) -> List[str]:
        """Extract education information."""
        education = []
        
        # Common degree keywords
        degree_patterns = [
            r'bachelor[\'s]*\s+(?:of\s+)?(?:science|arts|engineering)',
            r'master[\'s]*\s+(?:of\s+)?(?:science|arts|business|engineering)',
            r'phd|ph\.d\.|doctorate',
            r'associate[\'s]*\s+degree',
            r'b\.?s\.?|b\.?a\.?|m\.?s\.?|m\.?a\.?|m\.?b\.?a\.?'
        ]
        
        text_lower = text.lower()
        for pattern in degree_patterns:
            matches = re.findall(pattern, text_lower)
            education.extend(matches)
        
        return list(set(education))
