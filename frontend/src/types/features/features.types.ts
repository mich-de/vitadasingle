// src/types/features/features.types.ts
// Define feature-related types here

export type DashboardStats = {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
};

export type DashboardWidget = {
  id: string;
  type: WidgetType;
  title: string;
  data: any;
};

export type WidgetType = 'chart' | 'summary' | 'list' | 'kpi';
export type QuickAction = {
  id: string;
  label: string;
  icon: string;
  action: () => void;
};

export type RecentActivity = {
  id: string;
  description: string;
  timestamp: Date;
  type: string;
};

export type ExpenseStats = {
  totalExpenses: number;
  monthlyAverage: number;
  categories: Record<string, number>;
};

export type BookingStats = {
  totalBookings: number;
  activeBookings: number;
  revenue: number;
};

export type ChartData = {
  labels: string[];
  datasets: ChartDataset[];
};

export type ChartDataset = {
  label: string;
  data: number[];
  backgroundColor: string;
  borderColor: string;
};

export type TimeSeriesData = {
  dates: Date[];
  values: number[];
};

export type CategoryData = {
  category: string;
  value: number;
};

export type KPI = {
  id: string;
  name: string;
  value: number;
  trend: 'up' | 'down' | 'neutral';
};

export type Report = {
  id: string;
  title: string;
  description: string;
  data: any;
  generatedAt: Date;
};

export type Benchmark = {
  metric: string;
  currentValue: number;
  targetValue: number;
  comparison: number;
};
