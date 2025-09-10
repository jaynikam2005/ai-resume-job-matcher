import { apiRequest, API_ENDPOINTS, apiConfig } from '../api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'JOB_SEEKER' | 'RECRUITER';
}

export interface ResumeLoginRequest {
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface User {
  id?: number;
  username?: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export class AuthService {
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const isServer = typeof window === 'undefined';
      const debugPrefix = isServer ? '[Server]' : '[Client]';
      
      console.log(`${debugPrefix} Attempting login at: ${API_ENDPOINTS.auth.login}`);
      
      // For debugging only - don't log passwords in production
      if (process.env.NODE_ENV !== 'production') {
        console.log(`${debugPrefix} Authentication context:`, {
          loginEndpoint: API_ENDPOINTS.auth.login,
          email: credentials.email,
          isServer,
          apiBaseUrl: apiConfig.baseURL,
        });
      }
      
      const response = await apiRequest<AuthResponse>(API_ENDPOINTS.auth.login, {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      console.log(`${debugPrefix} Login successful, storing token and user data`);
      // Store token in localStorage (client-side only)
      if (typeof window !== 'undefined' && response.token) {
        localStorage.setItem('authToken', response.token);
        const user: User = {
          email: response.email,
          role: response.role,
          firstName: response.firstName,
          lastName: response.lastName,
        };
        localStorage.setItem('user', JSON.stringify(user));
      }

      return response;
    } catch (error) {
      const isServer = typeof window === 'undefined';
      const debugPrefix = isServer ? '[Server]' : '[Client]';
      
      console.error(`${debugPrefix} Login error:`, error);
      
      // Enhanced error logging
      if (error instanceof Error) {
        console.error(`${debugPrefix} Authentication failed:`, {
          message: error.message,
          errorType: error.constructor.name,
          // Include additional error properties if available
          status: (error as any).status,
          data: (error as any).data,
          stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
        });
      }
      
      throw error;
    }
  }

  static async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const isServer = typeof window === 'undefined';
      const debugPrefix = isServer ? '[Server]' : '[Client]';
      
      console.log(`${debugPrefix} Attempting registration at: ${API_ENDPOINTS.auth.register}`);
      
      // For debugging only - don't log sensitive data in production
      if (process.env.NODE_ENV !== 'production') {
        console.log(`${debugPrefix} Registration context:`, {
          registerEndpoint: API_ENDPOINTS.auth.register,
          email: userData.email,
          username: userData.username,
          role: userData.role,
          isServer,
          apiBaseUrl: apiConfig.baseURL,
        });
      }
      
      const response = await apiRequest<AuthResponse>(API_ENDPOINTS.auth.register, {
        method: 'POST',
        body: JSON.stringify(userData),
      });
  
      console.log(`${debugPrefix} Registration successful, storing token and user data`);
      // Store token in localStorage (client-side only)
      if (typeof window !== 'undefined' && response.token) {
        localStorage.setItem('authToken', response.token);
        const user: User = {
          email: response.email,
          role: response.role,
          firstName: response.firstName,
          lastName: response.lastName,
        };
        localStorage.setItem('user', JSON.stringify(user));
      }
  
      return response;
    } catch (error) {
      const isServer = typeof window === 'undefined';
      const debugPrefix = isServer ? '[Server]' : '[Client]';
      
      console.error(`${debugPrefix} Registration error:`, error);
      
      // Enhanced error logging
      if (error instanceof Error) {
        console.error(`${debugPrefix} Registration failed:`, {
          message: error.message,
          errorType: error.constructor.name,
          // Include additional error properties if available
          status: (error as any).status,
          data: (error as any).data,
          stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
        });
      }
      
      throw error;
    }
  }

  static async resumeLogin(userData: ResumeLoginRequest): Promise<AuthResponse> {
    const response = await apiRequest<AuthResponse>(API_ENDPOINTS.auth.resumeLogin, {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    // Store token in localStorage
    if (typeof window !== 'undefined' && response.token) {
      localStorage.setItem('authToken', response.token);
      const user: User = {
        email: response.email,
        role: response.role,
        firstName: response.firstName,
        lastName: response.lastName,
      };
      localStorage.setItem('user', JSON.stringify(user));
    }

    return response;
  }

  static async logout(): Promise<void> {
    try {
      await apiRequest<void>(API_ENDPOINTS.auth.logout, {
        method: 'POST',
      });
    } catch (error) {
      // Logout locally even if server request fails
      console.error('Logout request failed:', error);
    } finally {
      // Clear local storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
  }

  static async getCurrentUser(): Promise<User> {
    return apiRequest<User>(API_ENDPOINTS.auth.me, {
      method: 'GET',
    });
  }

  static getStoredUser(): User | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }

  static getStoredToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  static isAuthenticated(): boolean {
    return !!this.getStoredToken();
  }
}

export default AuthService;