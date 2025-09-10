import { apiRequest, API_ENDPOINTS } from '../api';

export interface Resume {
  id: number;
  fileName: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  parsedContent: string;
  skills: string;
  experience: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResumeAnalysis {
  skills: string[];
  experience: string;
  email: string;
  phone: string;
  name?: string;
  title?: string;
  summary: string;
  education: string[];
  certifications: string[];
  ats_score?: number;
}

export interface ResumeUploadResponse {
  message: string;
  resume: Resume;
}

export class ResumeService {
  static async uploadResume(file: File): Promise<ResumeUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    // For file uploads, we need to not set Content-Type header
    // so the browser can set it with boundary for multipart/form-data
    const headers: { [key: string]: string } = {};
    
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    const response = await fetch(API_ENDPOINTS.resumes.upload, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  static async getResumes(): Promise<Resume[]> {
    return apiRequest<Resume[]>(API_ENDPOINTS.resumes.list, {
      method: 'GET',
    });
  }

  static async getResume(id: string): Promise<Resume> {
    return apiRequest<Resume>(API_ENDPOINTS.resumes.get(id), {
      method: 'GET',
    });
  }

  static async deleteResume(id: string): Promise<void> {
    return apiRequest<void>(API_ENDPOINTS.resumes.delete(id), {
      method: 'DELETE',
    });
  }

  static async analyzeResumeText(resumeText: string, fileName: string = ''): Promise<ResumeAnalysis> {
    return apiRequest<ResumeAnalysis>(API_ENDPOINTS.resumes.analyze, {
      method: 'POST',
      body: JSON.stringify({
        resumeText,
        fileName,
        fileType: 'text'
      }),
    });
  }

  static async parseResumeFile(file: File) {
    const form = new FormData();
    form.append('file', file);
    const response = await fetch(API_ENDPOINTS.resumes.parse, {
      method: 'POST',
      body: form,
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }
}

export default ResumeService;