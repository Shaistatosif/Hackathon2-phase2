/**
 * TypeScript type definitions for the Todo App
 */

// Enums
export type TaskStatus = 'pending' | 'in_progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';
export type RecurrencePattern = 'daily' | 'weekly' | 'monthly';
export type SenderType = 'user' | 'assistant';

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// Task types
export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  tags: string[];
  isRecurring: boolean;
  recurrencePattern: RecurrencePattern | null;
  createdAt: string;
  updatedAt: string;
}

// Conversation types
export interface Conversation {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  messages?: Message[];
}

// Message types
export interface Message {
  id: string;
  conversationId: string;
  senderType: SenderType;
  content: string;
  createdAt: string;
}

// API Request types
export interface TaskCreateRequest {
  title: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: string;
  tags?: string[];
  isRecurring?: boolean;
  recurrencePattern?: RecurrencePattern;
}

export interface TaskUpdateRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  tags?: string[];
  isRecurring?: boolean;
  recurrencePattern?: RecurrencePattern;
}

export interface UserRegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface ChatMessageRequest {
  message: string;
  conversationId?: string;
}

// API Response types
export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface TaskListResponse {
  tasks: Task[];
  total: number;
  page: number;
  pageSize: number;
}

export interface TaskActionResponse {
  action: 'created' | 'updated' | 'completed' | 'deleted' | 'listed';
  task?: Task;
  tasks?: Task[];
  message?: string;
}

export interface ChatMessageResponse {
  userMessage: Message;
  assistantMessage: Message;
  taskAction?: TaskActionResponse;
}

export interface ChatHistoryResponse {
  conversations: Conversation[];
  total: number;
}

// Filter types
export interface TaskFilterParams {
  status?: TaskStatus;
  priority?: TaskPriority;
  search?: string;
  sortBy?: 'created_at' | 'due_date' | 'priority' | 'title';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

// Error types
export interface ApiError {
  detail: string;
  errorCode?: string;
}

// Auth state types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
