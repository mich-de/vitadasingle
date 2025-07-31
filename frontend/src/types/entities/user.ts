// src/types/entities/user.ts

export interface User {
  id: string;
  email: string;
  username?: string;
  fullName?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserInput {
  email: string;
  username?: string;
  fullName?: string;
  password: string;
}

export interface UpdateUserInput {
  username?: string;
  fullName?: string;
  avatarUrl?: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  language: 'it' | 'en';
  notifications: {
    email: boolean;
    push: boolean;
    deadlines: boolean;
    expenses: boolean;
  };
}

export interface UserSession {
  userId: string;
  token: string;
  expiresAt: string;
  refreshToken: string;
}

export interface UserStats {
  totalDeadlines: number;
  totalExpenses: number;
  totalProperties: number;
  joinedDate: string;
}
