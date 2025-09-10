# 🚀 AI Resume and Job Matcher

<div align="center">

![GitHub stars](https://img.shields.io/github/stars/yourusername/ai-resume-job-matcher?style=for-the-badge)
![GitHub forks](https://img.shields.io/github/forks/yourusername/ai-resume-job-matcher?style=for-the-badge)
![GitHub issues](https://img.shields.io/github/issues/yourusername/ai-resume-job-matcher?style=for-the-badge)
![License](https://img.shields.io/github/license/yourusername/ai-resume-job-matcher?style=for-the-badge)

<h3>Revolutionizing the hiring process with AI-powered resume parsing and job matching</h3>

[Demo](https://your-demo-link.com) • [Documentation](https://your-docs-link.com) • [Report Bug](https://github.com/yourusername/ai-resume-job-matcher/issues) • [Request Feature](https://github.com/yourusername/ai-resume-job-matcher/issues)

</div>

<p align="center">
  <img src="frontend/public/placeholder-logo.png" alt="AI Resume Job Matcher Logo" width="300">
</p>

A cutting-edge AI-powered application that transforms the recruitment process by leveraging Google's Gemini AI to intelligently parse resumes and match candidates with job postings. Our platform bridges the gap between job seekers and recruiters with precision matching, skills analysis, and personalized recommendations.

## ✨ Features

- **🤖 AI-Powered Resume Parsing** - Extract skills, experience, and qualifications using Google Gemini AI
- **🔍 Intelligent Job Matching** - Match candidates with ideal positions using advanced algorithms
- **📊 Interactive Dashboards** - Visual analytics for both candidates and recruiters
- **🛡️ Role-Based Access** - Separate workflows for job seekers and recruiters
- **📱 Responsive Design** - Seamless experience across all devices
- **🌐 Real-time Updates** - Instant notifications for job matches and applications
- **🔐 Secure Authentication** - JWT-based authentication and authorization

## 🏗️ Architecture

<p align="center">
  <img src="frontend/public/placeholder.svg" alt="Architecture Diagram" width="700">
</p>

| Component | Technology | Description |
|-----------|------------|-------------|
| **Frontend** | Next.js 15.5.2 with TypeScript and Tailwind CSS | Modern, responsive UI with server and client components |
| **Backend API** | Spring Boot 3.3.4 with Java 21 | Robust REST API with JWT authentication |
| **AI Service** | FastAPI with Google Gemini AI | Intelligent document parsing and analysis |
| **Database** | PostgreSQL with Flyway migrations | Relational database with automatic migrations |
| **Search** | Elasticsearch | Fast full-text search capabilities |
| **Cache** | Redis | High-performance caching layer |
| **Containerization** | Docker and Docker Compose | Containerized microservices architecture |

## 📋 Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local frontend development)
- Java 21+ (for local backend development)
- Python 3.9+ (for local AI service development)
- Google Gemini AI API Key

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ai-resume-job-matcher.git
cd ai-resume-job-matcher
```

### 2. Environment Configuration

Copy the example environment file and configure your settings:

```bash
cp .env.example .env
```

Edit `.env` file with your configuration:

```bash
# Google Gemini AI API Key (Required)
# Get your API key from: https://makersuite.google.com/app/apikey
GOOGLE_API_KEY=your_google_api_key_here

# JWT Secret for authentication (Required for production)
JWT_SECRET=your_secure_jwt_secret_key_here

# Database configuration (Optional - defaults provided)
DB_HOST=postgres
DB_PORT=5432
DB_NAME=ai_resume_db
DB_USERNAME=postgres
DB_PASSWORD=postgres

# Redis configuration (Optional - defaults provided)
REDIS_HOST=redis
REDIS_PORT=6379

# Elasticsearch configuration (Optional - defaults provided)
ELASTICSEARCH_HOST=elasticsearch
ELASTICSEARCH_PORT=9200

# Service URLs (Optional - defaults provided)
AI_SERVICE_URL=http://fastapi-ai-service:8001
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_AI_SERVICE_URL=http://localhost:8001
```

### 3. Start All Services

```bash
docker-compose up -d
```

This will start:

- PostgreSQL database (port 5432)
- Elasticsearch (port 9200)
- Redis (port 6379)
- FastAPI AI service (port 8001)
- Spring Boot backend (port 8080)
- Next.js frontend (port 3000)

### 4. Access the Application

- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:8080/api`
- **AI Service**: `http://localhost:8001`
- **API Documentation**: `http://localhost:8001/docs` (FastAPI Swagger)

## 📡 API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

### Resume Management

- `POST /api/resumes/upload` - Upload and parse resume
- `GET /api/resumes` - Get user's resumes
- `GET /api/resumes/{id}` - Get specific resume
- `DELETE /api/resumes/{id}` - Delete resume

### Job Management

- `GET /api/jobs` - List jobs with filters
- `POST /api/jobs` - Create job (recruiters only)
- `GET /api/jobs/{id}` - Get specific job
- `PUT /api/jobs/{id}` - Update job (recruiters only)
- `DELETE /api/jobs/{id}` - Delete job (recruiters only)

### AI Services

- `POST /api/v1/analyze-text` - Analyze resume text with Gemini AI
- `POST /api/v1/match-jobs` - Match resume with jobs using AI

## 💻 Development Setup

### Backend Development (Spring Boot)

1. **Prerequisites**: Java 21+, PostgreSQL running
2. **Navigate to backend directory**:

```bash
cd spring-boot-backend
```

3. **Run the application**:

```bash
./gradlew bootRun
```

### AI Service Development (FastAPI)

1. **Prerequisites**: Python 3.9+
2. **Navigate to AI service directory**:

```bash
cd fastapi-ai-service
```

3. **Install dependencies**:

```bash
pip install -r requirements.txt
```

4. **Set environment variables**:

```bash
export GOOGLE_API_KEY=your_api_key_here
```

5. **Run the service**:

```bash
uvicorn app.main:app --reload --port 8001
```

### Frontend Development (Next.js)

1. **Prerequisites**: Node.js 18+
2. **Navigate to frontend directory**:

```bash
cd frontend
```

3. **Install dependencies**:

```bash
pnpm install
```

4. **Run development server**:

```bash
pnpm dev
```

## 🗄️ Database Schema

The application uses PostgreSQL with the following main tables:

- **users**: User accounts (job seekers and recruiters)
- **resumes**: Uploaded resumes with parsed content
- **jobs**: Job postings by recruiters
- **job_applications**: Applications submitted by job seekers

Database migrations are handled automatically by Flyway on application startup.

## 🧠 AI Features

### Resume Parsing

- Extracts skills, experience, education, and contact information
- Uses Google Gemini AI for intelligent text analysis
- Supports PDF, DOC, DOCX, and text files

### Job Matching

- AI-powered matching between resumes and job postings
- Provides match scores and explanations
- Identifies matching and missing skills

### Skills Analysis

- Auto-detection of technical and soft skills
- Skill categorization by industry and specialty
- Skill gap analysis with recommendations

## ⚙️ Configuration Options

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GOOGLE_API_KEY` | Google Gemini AI API key | Required |
| `JWT_SECRET` | Secret key for JWT tokens | `your-secret-key-here` |
| `DB_HOST` | Database host | `postgres` |
| `DB_PORT` | Database port | `5432` |
| `DB_NAME` | Database name | `ai_resume_db` |
| `DB_USERNAME` | Database username | `postgres` |
| `DB_PASSWORD` | Database password | `postgres` |
| `REDIS_HOST` | Redis host | `redis` |
| `REDIS_PORT` | Redis port | `6379` |
| `ELASTICSEARCH_HOST` | Elasticsearch host | `elasticsearch` |
| `ELASTICSEARCH_PORT` | Elasticsearch port | `9200` |
| `AI_SERVICE_URL` | FastAPI service URL | `http://fastapi-ai-service:8001` |

## 🛠️ Troubleshooting

### Common Issues

1. **Google Gemini AI API errors**:
   - Ensure your API key is valid and has sufficient quota
   - Check the API key in your `.env` file

2. **Database connection errors**:
   - Ensure PostgreSQL is running and accessible
   - Check database credentials in environment variables

3. **Service communication issues**:
   - Verify all services are running: `docker-compose ps`
   - Check service logs: `docker-compose logs [service-name]`

4. **Frontend build errors**:
   - Ensure Node.js dependencies are installed
   - Check for TypeScript errors in the console

### Viewing Logs

```bash
# View all service logs
docker-compose logs

# View specific service logs
docker-compose logs spring-boot-backend
docker-compose logs fastapi-ai-service
docker-compose logs frontend
docker-compose logs postgres
```

### Restarting Services

```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart spring-boot-backend
```

## 🔒 Security Considerations

- Use strong JWT secrets in production
- Set up proper CORS configuration
- Use HTTPS in production environments
- Implement rate limiting for API endpoints
- Secure your Google Gemini AI API key

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`./gradlew test` for backend, `pnpm test` for frontend)
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Contact

Project Link: [https://github.com/yourusername/ai-resume-job-matcher](https://github.com/yourusername/ai-resume-job-matcher)

## ✨ Acknowledgements

- [Google Gemini AI](https://gemini.google.com)
- [Spring Boot](https://spring.io/projects/spring-boot)
- [FastAPI](https://fastapi.tiangolo.com)
- [Next.js](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [PostgreSQL](https://postgresql.org)
- [Elasticsearch](https://elastic.co)
- [Redis](https://redis.io)
- [Docker](https://docker.com)

---

Made with ❤️ by Your Name - Happy Matching!
 
 