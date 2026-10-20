// src/types/entities/profile.ts

export interface Profile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  bio?: string;
}

export interface CreateProfileInput {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  bio?: string;
}

export interface UpdateProfileInput {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  bio?: string;
}

export interface ProfileSettings {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends';
    showEmail: boolean;
    showPhone: boolean;
    showAddress: boolean;
  };
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    language: 'it' | 'en';
    timezone: string;
    dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
    currency: 'EUR' | 'USD' | 'GBP';
  };
}

export interface ContactInfo {
  type: 'email' | 'phone' | 'address' | 'website' | 'social';
  label: string;
  value: string;
  primary?: boolean;
  verified?: boolean;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  address?: string;
  primary: boolean;
}

export interface ProfileActivity {
  id: string;
  type: 'login' | 'profile_update' | 'password_change' | 'settings_change';
  description: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}
