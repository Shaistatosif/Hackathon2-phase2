/**
 * API client base for frontend-backend communication
 */
import type {
  ApiError,
  ChatHistoryResponse,
  ChatMessageRequest,
  ChatMessageResponse,
  Task,
  TaskCreateRequest,
  TaskFilterParams,
  TaskListResponse,
  TaskUpdateRequest,
  TokenResponse,
  User,
  UserLoginRequest,
  UserRegisterRequest,
  ValidationError,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiClient {
  private baseUrl: string;
  private accessToken: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.accessToken) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        detail: 'An unknown error occurred',
      }));
      // Handle different error formats from FastAPI
      let errorMessage = 'An unknown error occurred';
      if (typeof error.detail === 'string') {
        errorMessage = error.detail;
      } else if (Array.isArray(error.detail)) {
        // Validation errors come as array
        errorMessage = (error.detail as ValidationError[]).map((e) => e.msg || e.message || JSON.stringify(e)).join(', ');
      } else if (typeof error.detail === 'object') {
        errorMessage = JSON.stringify(error.detail);
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  // Auth endpoints
  async register(data: UserRegisterRequest): Promise<TokenResponse> {
    return this.request<TokenResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: UserLoginRequest): Promise<TokenResponse> {
    return this.request<TokenResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async logout(): Promise<void> {
    await this.request<void>('/api/auth/logout', {
      method: 'POST',
    });
    this.accessToken = null;
  }

  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    return this.request<TokenResponse>('/api/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  }

  async getMe(): Promise<User> {
    return this.request<User>('/api/auth/me');
  }

  // Task endpoints
  async getTasks(params?: TaskFilterParams): Promise<TaskListResponse> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
    }
    const query = searchParams.toString();
    return this.request<TaskListResponse>(`/api/tasks${query ? `?${query}` : ''}`);
  }

  async getTask(id: string): Promise<Task> {
    return this.request<Task>(`/api/tasks/${id}`);
  }

  async createTask(data: TaskCreateRequest): Promise<Task> {
    return this.request<Task>('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTask(id: string, data: TaskUpdateRequest): Promise<Task> {
    return this.request<Task>(`/api/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTask(id: string): Promise<void> {
    return this.request<void>(`/api/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  async completeTask(id: string): Promise<Task> {
    return this.request<Task>(`/api/tasks/${id}/complete`, {
      method: 'POST',
    });
  }

  // Chat endpoints
  async sendMessage(data: ChatMessageRequest): Promise<ChatMessageResponse> {
    return this.request<ChatMessageResponse>('/api/chat/message', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getChatHistory(): Promise<ChatHistoryResponse> {
    return this.request<ChatHistoryResponse>('/api/chat/history');
  }

  async clearChatHistory(): Promise<void> {
    return this.request<void>('/api/chat/history', {
      method: 'DELETE',
    });
  }

  // Health check
  async healthCheck(): Promise<{ status: string; version: string }> {
    return this.request<{ status: string; version: string }>('/health');
  }
}

// Export singleton instance
export const api = new ApiClient(API_BASE_URL);

// Export class for testing
export { ApiClient };
