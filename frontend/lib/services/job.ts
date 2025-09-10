import { apiRequest, API_ENDPOINTS } from '../api';

export interface Job {
  id: number;
  title: string;
  company: string;
  description: string;
  requirements: string;
  location: string;
  salaryRange: string;
  jobType: string;
  experienceLevel: string;
  postedDate: string;
  applicationDeadline: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface JobCreateRequest {
  title: string;
  company: string;
  description: string;
  requirements: string;
  location: string;
  salaryRange?: string;
  jobType?: string;
  experienceLevel?: string;
  applicationDeadline?: string;
}

export interface JobSearchFilters {
  keyword?: string;
  location?: string;
  jobType?: string;
  experienceLevel?: string;
  page?: number;
  size?: number;
}

export interface JobSearchResponse {
  content: Job[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface JobMatch {
  jobId: number;
  jobTitle: string;
  company: string;
  matchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  explanation: string;
}

export interface JobMatchResponse {
  matches: JobMatch[];
}

export class JobService {
  static async getJobs(filters?: JobSearchFilters): Promise<JobSearchResponse> {
    let url = API_ENDPOINTS.jobs.list;
    
    if (filters) {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
    }

    return apiRequest<JobSearchResponse>(url, {
      method: 'GET',
    });
  }

  static async getJob(id: string): Promise<Job> {
    return apiRequest<Job>(API_ENDPOINTS.jobs.get(id), {
      method: 'GET',
    });
  }

  static async createJob(jobData: JobCreateRequest): Promise<Job> {
    return apiRequest<Job>(API_ENDPOINTS.jobs.create, {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
  }

  static async updateJob(id: string, jobData: Partial<JobCreateRequest>): Promise<Job> {
    return apiRequest<Job>(API_ENDPOINTS.jobs.update(id), {
      method: 'PUT',
      body: JSON.stringify(jobData),
    });
  }

  static async deleteJob(id: string): Promise<void> {
    return apiRequest<void>(API_ENDPOINTS.jobs.delete(id), {
      method: 'DELETE',
    });
  }

  static async searchJobs(filters: JobSearchFilters): Promise<JobSearchResponse> {
    return apiRequest<JobSearchResponse>(API_ENDPOINTS.jobs.search, {
      method: 'POST',
      body: JSON.stringify(filters),
    });
  }

  static async matchJobs(
    resumeText: string, 
    resumeSkills: string[], 
    availableJobs: Job[], 
    maxMatches: number = 10
  ): Promise<JobMatchResponse> {
    return apiRequest<JobMatchResponse>(API_ENDPOINTS.jobs.match, {
      method: 'POST',
      body: JSON.stringify({
        resumeText,
        resumeSkills,
        availableJobs,
        maxMatches,
      }),
    });
  }
}

export default JobService;