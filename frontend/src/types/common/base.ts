// src/types/common/base.ts

export type Theme = 'light' | 'dark';
export type Language = 'it' | 'en';

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

export interface FilterConfig {
  [key: string]: any;
}

export interface SearchConfig {
  query: string;
  fields?: string[];
  caseSensitive?: boolean;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  coordinates?: Coordinates;
}

export interface TimeRange {
  start: string;
  end: string;
}

export interface DateRange {
  start: string;
  end: string;
}

export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export interface FileInfo {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  url?: string;
}

export type ValidationRule = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
};

export interface ValidationRules {
  [fieldName: string]: ValidationRule;
}
