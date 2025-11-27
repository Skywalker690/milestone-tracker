// Data Models
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Milestone {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  achieveDate?: string; // yyyy-MM-dd
  createdDate: string;
  completedDate?: string;
  userId: number;
}

// API Payloads
export interface CreateMilestoneRequest {
  title: string;
  description?: string;
  achieveDate?: string;
}

export interface UpdateMilestoneRequest {
  title?: string;
  description?: string;
  achieveDate?: string;
  completed?: boolean;
  completedDate?: string;
}

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

// API Responses
export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  MILESTONES = 'MILESTONES',
}