// src/types/entities/property.ts

export interface Property {
  id: string;
  userId: string;
  name: string;
  address?: string;
  type: PropertyType;
  status: PropertyStatus;
  size?: number;
  purchaseDate?: string;
  purchasePrice?: number;
  currentValue?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type PropertyType = 'residential' | 'commercial' | 'rental';
export type PropertyStatus = 'occupied' | 'vacant' | 'maintenance';

export interface CreatePropertyInput {
  name: string;
  address?: string;
  type: PropertyType;
  status: PropertyStatus;
  size?: number;
  purchaseDate?: string;
  purchasePrice?: number;
  currentValue?: number;
  notes?: string;
}

export interface UpdatePropertyInput {
  name?: string;
  address?: string;
  type?: PropertyType;
  status?: PropertyStatus;
  size?: number;
  purchaseDate?: string;
  purchasePrice?: number;
  currentValue?: number;
  notes?: string;
}

export interface PropertyFilters {
  type?: PropertyType;
  status?: PropertyStatus;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
}

export interface PropertyFinancials {
  monthlyIncome?: number;
  monthlyExpenses?: number;
  netIncome?: number;
  roi?: number; // Return on Investment
  appreciation?: number;
}

export interface PropertyMaintenance {
  id: string;
  propertyId: string;
  description: string;
  cost: number;
  date: string;
  category: 'repair' | 'improvement' | 'inspection' | 'cleaning';
  status: 'scheduled' | 'in_progress' | 'completed';
}