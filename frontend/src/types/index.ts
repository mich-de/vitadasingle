// src/types/index.ts
// File principale con import espliciti per debug

// Import specifici per evitare problemi di export *
import type { User, CreateUserInput, UpdateUserInput, UserPreferences, UserSession, UserStats } from './entities/user';
import type { Expense, ExpenseCategory, PaymentMethod, CreateExpenseInput, UpdateExpenseInput, ExpenseFilters } from './entities/expense';
import type { Booking, BookingStatus, BookingSource, CreateBookingInput, UpdateBookingInput, BookingFilters, BookingCalendarEvent, BookingRevenue } from './entities/booking';
import type { Property, PropertyType, PropertyStatus, CreatePropertyInput, UpdatePropertyInput, PropertyFilters, PropertyFinancials, PropertyMaintenance } from './entities/property';
import type { Vehicle, CreateVehicleInput, UpdateVehicleInput, VehicleFilters, VehicleMaintenance, VehicleDocument } from './entities/vehicle';
import type { Event, EventCategory, CreateEventInput, UpdateEventInput, EventFilters, EventReminder, CalendarView, EventConflict } from './entities/event';
import type { Workout, WorkoutType, WorkoutIntensity, CreateWorkoutInput, UpdateWorkoutInput, WorkoutFilters, Exercise, ExerciseCategory, WorkoutSet, WorkoutPlan, WorkoutStats } from './entities/workout';
import type { Document, DocumentCategory, CreateDocumentInput, UpdateDocumentInput, DocumentFilters, DocumentVersion, DocumentShare, DocumentTemplate, DocumentField, DocumentMetadata } from './entities/document';
import type { Contact, ContactType, CreateContactInput, UpdateContactInput, ContactFilters, ContactGroup, ContactStats } from './entities/contact';
import type { CreateDeadlineInput, UpdateDeadlineInput, DeadlineFilters, SortField, SortOrder, DeadlineSortOptions, DeadlineNotification, DeadlineStats, DeadlineGroup, DeadlineFormErrors, Task } from './entities/deadline';
import type { ApiResponse, PaginatedResponse, RequestConfig, ApiError, LoadingState, AsyncState } from './common/api';
import type { Theme, Language, BaseComponentProps, Pagination, SortConfig, FilterConfig, Coordinates, Address } from './common/base';
import type { FormOption, FormField, FormFieldType, ValidationRule, FormErrors, FormState, ModalProps, ToastNotification, TabItem, MenuItem, BreadcrumbItem, TableColumn, TableProps, CardProps, ButtonProps, InputProps } from './common/ui';
import type { DashboardStats, DashboardWidget, WidgetType, QuickAction, RecentActivity, ExpenseStats, BookingStats, ChartData, TimeSeriesData, CategoryData, KPI, Report, Benchmark } from './features/features.types';

import type { Deadline, DeadlinePriority } from './entities/deadline';

// Re-export espliciti di tutti i tipi
export type {
  // Users
  User, CreateUserInput, UpdateUserInput, UserPreferences, UserSession, UserStats,
  
  // Expenses  
  Expense, ExpenseCategory, PaymentMethod, CreateExpenseInput, UpdateExpenseInput, ExpenseFilters,
  
  // Bookings
  Booking, BookingStatus, BookingSource, CreateBookingInput, UpdateBookingInput, BookingFilters, BookingCalendarEvent, BookingRevenue,
  
  // Properties
  Property, PropertyType, PropertyStatus, CreatePropertyInput, UpdatePropertyInput, PropertyFilters, PropertyFinancials, PropertyMaintenance,
  
  // Vehicles
  Vehicle, CreateVehicleInput, UpdateVehicleInput, VehicleFilters, VehicleMaintenance, VehicleDocument,
  
  // Events
  Event, EventCategory, CreateEventInput, UpdateEventInput, EventFilters, EventReminder, CalendarView, EventConflict,
  
  // Workouts
  Workout, WorkoutType, WorkoutIntensity, CreateWorkoutInput, UpdateWorkoutInput, WorkoutFilters, Exercise, ExerciseCategory, WorkoutSet, WorkoutPlan, WorkoutStats,
  
  // Documents
  Document, DocumentCategory, CreateDocumentInput, UpdateDocumentInput, DocumentFilters, DocumentVersion, DocumentShare, DocumentTemplate, DocumentField, DocumentMetadata,
  
  // Deadlines
  Deadline, DeadlinePriority, CreateDeadlineInput, UpdateDeadlineInput, DeadlineFilters, SortField, SortOrder, DeadlineSortOptions, DeadlineNotification, DeadlineStats, DeadlineGroup, DeadlineFormErrors, Task,
  
  // Contacts
  Contact, ContactType, CreateContactInput, UpdateContactInput, ContactFilters, ContactGroup, ContactStats,
  
  // API
  ApiResponse, PaginatedResponse, RequestConfig, ApiError, LoadingState, AsyncState,
  
  // Base
  Theme, Language, BaseComponentProps, Pagination, SortConfig, FilterConfig, Coordinates, Address,
  
  // UI
  FormOption, FormField, FormFieldType, ValidationRule, FormErrors, FormState, ModalProps, ToastNotification, TabItem, MenuItem, BreadcrumbItem, TableColumn, TableProps, CardProps, ButtonProps, InputProps,
  
  // Features
  DashboardStats, DashboardWidget, WidgetType, QuickAction, RecentActivity, ExpenseStats, BookingStats, ChartData, TimeSeriesData, CategoryData, KPI, Report, Benchmark
};
