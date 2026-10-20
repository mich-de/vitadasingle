// src/types/entities/vehicle.ts

export type VehicleType = 'car' | 'motorcycle' | 'van' | 'other';
export type VehicleStatus = 'active' | 'sold' | 'maintenance';

export interface Vehicle {
  id: string;
  userId: string;
  make: string;
  model: string;
  year?: number;
  licensePlate?: string;
  vin?: string;
  type: VehicleType;
  status: VehicleStatus;
  purchaseDate?: string;
  purchasePrice?: number;
  currentValue?: number;
  insuranceExpiry?: string;
  inspectionExpiry?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVehicleInput {
  make: string;
  model: string;
  year?: number;
  licensePlate?: string;
  vin?: string;
  type: VehicleType;
  status: VehicleStatus;
  purchaseDate?: string;
  purchasePrice?: number;
  currentValue?: number;
  insuranceExpiry?: string;
  inspectionExpiry?: string;
  notes?: string;
}

export interface UpdateVehicleInput {
  make?: string;
  model?: string;
  year?: number;
  licensePlate?: string;
  vin?: string;
  type?: VehicleType;
  status?: VehicleStatus;
  purchaseDate?: string;
  purchasePrice?: number;
  currentValue?: number;
  insuranceExpiry?: string;
  inspectionExpiry?: string;
  notes?: string;
}

export interface VehicleFilters {
  make?: string;
  model?: string;
  yearRange?: {
    min: number;
    max: number;
  };
  expiringInsurance?: boolean;
  expiringInspection?: boolean;
}

export interface VehicleMaintenance {
  id: string;
  vehicleId: string;
  type: 'oil_change' | 'tire_rotation' | 'brake_service' | 'general_maintenance' | 'repair';
  description: string;
  cost: number;
  mileage?: number;
  date: string;
  nextServiceMileage?: number;
  nextServiceDate?: string;
}

export interface VehicleDocument {
  id: string;
  vehicleId: string;
  type: 'insurance' | 'registration' | 'inspection' | 'warranty' | 'manual' | 'receipt';
  name: string;
  fileUrl: string;
  expiryDate?: string;
}
