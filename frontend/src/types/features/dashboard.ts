// src/types/features/dashboard.ts

export interface DashboardStats {
  urgentDeadlinesCount?: number;
  currentMonthExpenses?: number;
  propertyCount?: number;
  totalPropertyValue?: number;
  vehicleCount?: number;
  totalVehicleValue?: number;
  lastActivity?: string;
}

export interface DashboardWidget {
  id: string;
  type: WidgetType;
  title: string;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  config: WidgetConfig;
  visible: boolean;
}

export type WidgetType = 
  | 'deadlines' 
  | 'expenses' 
  | 'bookings' 
  | 'calendar' 
  | 'weather' 
  | 'notes' 
  | 'tasks' 
  | 'chart' 
  | 'quick_actions';

export interface WidgetConfig {
  [key: string]: any;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  href?: string;
  onClick?: () => void;
  color?: string;
  description?: string;
}

export interface DashboardLayout {
  id: string;
  name: string;
  widgets: DashboardWidget[];
  isDefault: boolean;
}

export interface RecentActivity {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  timestamp: string;
  entityId?: string;
  entityType?: string;
  icon?: string;
  color?: string;
}

export type ActivityType = 
  | 'deadline_created' 
  | 'deadline_completed' 
  | 'expense_added' 
  | 'booking_created' 
  | 'property_updated' 
  | 'document_uploaded' 
  | 'event_scheduled';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export type NotificationType = 
  | 'deadline_reminder' 
  | 'deadline_overdue' 
  | 'expense_limit' 
  | 'booking_reminder' 
  | 'document_expiry' 
  | 'system_update' 
  | 'security_alert';

export interface DashboardMetrics {
  period: 'today' | 'week' | 'month' | 'year';
  data: {
    deadlines: {
      total: number;
      completed: number;
      overdue: number;
      dueToday: number;
    };
    expenses: {
      total: number;
      amount: number;
      avgPerDay: number;
      topCategory: string;
    };
    bookings: {
      total: number;
      revenue: number;
      occupancyRate: number;
      avgNightlyRate: number;
    };
    properties: {
      total: number;
      occupied: number;
      vacant: number;
      totalValue: number;
    };
  };
}

export interface WeatherInfo {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  forecast: {
    day: string;
    high: number;
    low: number;
    condition: string;
    icon: string;
  }[];
}
