// src/types/entities/deadline.ts

export type DeadlinePriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  category: string;
  priority: DeadlinePriority | string;
}

export interface Deadline {
  id: string;
  title: string;
  description?: string;
  dueDate: string; // ISO 8601 format
  priority: DeadlinePriority;
  isCompleted: boolean;
  createdAt: string; // ISO 8601 format
  updatedAt: string; // ISO 8601 format
  category?: string;
  tags?: string[];
}

export interface CreateDeadlineInput {
  title: string;
  description?: string;
  dueDate: string; // ISO 8601 format
  priority: DeadlinePriority;
  category?: string;
  tags?: string[];
}

export interface UpdateDeadlineInput {
  title?: string;
  description?: string;
  dueDate?: string; // ISO 8601 format
  priority?: DeadlinePriority;
  isCompleted?: boolean;
  category?: string;
  tags?: string[];
}

export interface DeadlineFilters {
  priority?: DeadlinePriority;
  isCompleted?: boolean;
  category?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export type SortField = 'dueDate' | 'createdAt' | 'priority' | 'title';
export type SortOrder = 'asc' | 'desc';

export interface DeadlineSortOptions {
  field: SortField;
  order: SortOrder;
}

export interface DeadlineNotification {
  id: string;
  deadlineId: string;
  type: 'reminder' | 'overdue' | 'completed';
  message: string;
  isRead: boolean;
  createdAt: Date;
}

export interface DeadlineStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  dueToday: number;
  dueThisWeek: number;
}

export interface DeadlineGroup {
  category: string;
  deadlines: Deadline[];
  count: number;
}

export interface DeadlineFormErrors {
  title?: string;
  description?: string;
  dueDate?: string;
  priority?: string;
  category?: string;
}
