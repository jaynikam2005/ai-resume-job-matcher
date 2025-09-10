// API configuration and base URL
import getConfig from 'next/config';

// Get Next.js runtime configurations
const { serverRuntimeConfig, publicRuntimeConfig } = getConfig() || {
  serverRuntimeConfig: {}, 
  publicRuntimeConfig: {}
};

// Use internal URLs for server-side requests and public URLs for client-side
const isServer = typeof window === 'undefined';

// For server-side requests, prefer internal URLs (container network)
// For client-side requests, use public URLs
const API_BASE_URL = isServer && serverRuntimeConfig.internalApiUrl
  ? serverRuntimeConfig.internalApiUrl
  : publicRuntimeConfig?.apiUrl || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const AI_SERVICE_URL = isServer && serverRuntimeConfig.internalAiServiceUrl
  ? serverRuntimeConfig.internalAiServiceUrl
  : publicRuntimeConfig?.aiServiceUrl || process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://localhost:8001';

// API endpoints
export const API_ENDPOINTS = {
  // Authentication endpoints
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
    logout: `${API_BASE_URL}/auth/logout`,
    me: `${API_BASE_URL}/auth/me`,
    resumeLogin: `${API_BASE_URL}/auth/resume-login`,
  },
  
  // User endpoints
  users: {
    profile: `${API_BASE_URL}/users/profile`,
    update: `${API_BASE_URL}/users/profile`,
  },
  
  // Resume endpoints
  resumes: {
    upload: `${API_BASE_URL}/resumes/upload`,
    list: `${API_BASE_URL}/resumes`,
    get: (id: string) => `${API_BASE_URL}/resumes/${id}`,
    delete: (id: string) => `${API_BASE_URL}/resumes/${id}`,
    analyze: `${AI_SERVICE_URL}/api/v1/analyze-text`,
    parse: `${AI_SERVICE_URL}/api/v1/parse-resume`,
  },
  
  // Job endpoints
  jobs: {
    list: `${API_BASE_URL}/jobs`,
    create: `${API_BASE_URL}/jobs`,
    get: (id: string) => `${API_BASE_URL}/jobs/${id}`,
    update: (id: string) => `${API_BASE_URL}/jobs/${id}`,
    delete: (id: string) => `${API_BASE_URL}/jobs/${id}`,
    search: `${API_BASE_URL}/jobs/search`,
    match: `${AI_SERVICE_URL}/api/v1/match-jobs`,
  },
  
  // Application endpoints
  applications: {
    list: `${API_BASE_URL}/applications`,
    create: `${API_BASE_URL}/applications`,
    get: (id: string) => `${API_BASE_URL}/applications/${id}`,
    update: (id: string) => `${API_BASE_URL}/applications/${id}`,
  }
};

// API client configuration
export const apiConfig = {
  baseURL: API_BASE_URL,
  aiServiceURL: AI_SERVICE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
};

// Helper function to get authorization header
export const getAuthHeader = (): { Authorization?: string } => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
  return {};
};

// Helper function to make API requests
export const apiRequest = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  try {
    const isServer = typeof window === 'undefined';
    const debugPrefix = isServer ? '[Server]' : '[Client]';
    
    if (process.env.NODE_ENV !== 'production') {
      console.log(`${debugPrefix} API Request:`, { url, method: options.method || 'GET' });
    }
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...apiConfig.headers,
        ...getAuthHeader(),
        ...options.headers,
      },
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      let message = `HTTP error! status: ${response.status}`;
      let errorData = {};
      
      try {
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          errorData = await response.json();
          // Type-safe error message extraction
          const typedError = errorData as Record<string, any>;
          message = (typedError.message || typedError.error || typedError.details || message);
        } else {
          const text = await response.text();
          if (text) {
            message = text;
            errorData = { responseText: text };
          }
        }
      } catch (parseError) {
        console.error(`${debugPrefix} Failed to parse error response:`, parseError);
      }
      
      console.error(`${debugPrefix} API Error:`, { 
        url, 
        status: response.status, 
        statusText: response.statusText,
        message,
        errorData 
      });
      
      const error = new Error(message);
      (error as any).status = response.status;
      (error as any).data = errorData;
      throw error;
    }

    return response.json();
  } catch (error) {
    // If it's already our custom error, just rethrow it
    if (error instanceof Error && (error as any).status) {
      throw error;
    }
    
    // Otherwise wrap it for consistent error handling
    console.error(`Failed to fetch from ${url}:`, error);
    const wrappedError = new Error(`API request failed: ${error instanceof Error ? error.message : String(error)}`);
    (wrappedError as any).originalError = error;
    throw wrappedError;
  }
};

export default apiConfig;