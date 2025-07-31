// src/types/entities/event.ts

export interface Event {
  id: string;
  userId: string;
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  location?: string;
  category: EventCategory;
  reminderMinutes?: number;
  attendees?: string[];
  createdAt: string;
  updatedAt: string;
}

export type EventCategory = 'personal' | 'work' | 'health' | 'social' | 'travel' | 'other';

export interface CreateEventInput {
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  location?: string;
  category: EventCategory;
  reminderMinutes?: number;
  attendees?: string[];
}

export interface UpdateEventInput {
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  category?: EventCategory;
  reminderMinutes?: number;
  attendees?: string[];
}

export interface EventFilters {
  category?: EventCategory;
  dateRange?: {
    start: string;
    end: string;
  };
  location?: string;
  hasReminder?: boolean;
}

export interface EventReminder {
  id: string;
  eventId: string;
  reminderTime: string;
  sent: boolean;
  type: 'email' | 'push' | 'sms';
}

export interface CalendarView {
  month: number;
  year: number;
  events: Event[];
}

export interface EventConflict {
  eventId: string;
  conflictingEventId: string;
  overlapStart: string;
  overlapEnd: string;
}
