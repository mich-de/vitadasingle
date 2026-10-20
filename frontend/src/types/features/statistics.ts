// src/types/features/statistics.ts

export interface ExpenseStats {
  totalAmount: number;
  averageAmount: number;
  totalExpenses: number;
  categoryBreakdown: Record<string, number>;
}

export interface BookingStats {
  totalRevenue: number;
  totalBookings: number;
  occupancyRate: number;
  avgNightlyRate: number;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  fill?: boolean;
}

export interface TimeSeriesData {
  timestamp: string;
  value: number;
  category?: string;
}

export interface CategoryData {
  category: string;
  value: number;
  percentage: number;
  color?: string;
}

export interface ComparisonData {
  current: number;
  previous: number;
  change: number;
  changePercentage: number;
  trend: 'up' | 'down' | 'stable';
}

export interface StatisticsFilter {
  period: TimePeriod;
  startDate?: string;
  endDate?: string;
  categories?: string[];
  groupBy?: 'day' | 'week' | 'month' | 'year';
}

export type TimePeriod = 
  | 'today' 
  | 'yesterday' 
  | 'this_week' 
  | 'last_week' 
  | 'this_month' 
  | 'last_month' 
  | 'this_year' 
  | 'last_year' 
  | 'custom';

export interface KPI {
  id: string;
  label: string;
  value: number;
  unit?: string;
  change?: ComparisonData;
  target?: number;
  format?: 'currency' | 'percentage' | 'number' | 'decimal';
  color?: string;
  description?: string;
}

export interface Report {
  id: string;
  name: string;
  description?: string;
  type: ReportType;
  config: ReportConfig;
  schedule?: ReportSchedule;
  lastGenerated?: string;
  recipients?: string[];
}

export type ReportType = 
  | 'expenses' 
  | 'bookings' 
  | 'deadlines' 
  | 'properties' 
  | 'financial_summary' 
  | 'custom';

export interface ReportConfig {
  filters: StatisticsFilter;
  metrics: string[];
  charts: ChartConfig[];
  format: 'pdf' | 'excel' | 'csv';
}

export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'doughnut' | 'area';
  title: string;
  dataSource: string;
  groupBy?: string;
  limit?: number;
  colors?: string[];
}

export interface ReportSchedule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  dayOfWeek?: number; // 0-6, Sunday=0
  dayOfMonth?: number; // 1-31
  time: string; // HH:mm format
  timezone: string;
  active: boolean;
}

export interface Benchmark {
  metric: string;
  userValue: number;
  benchmarkValue: number;
  category: string;
  unit: string;
  performance: 'above' | 'below' | 'equal';
  percentile?: number;
}

export interface Trend {
  metric: string;
  data: TimeSeriesData[];
  direction: 'up' | 'down' | 'stable';
  strength: 'weak' | 'moderate' | 'strong';
  correlation?: number;
}

export interface Goal {
  id: string;
  name: string;
  description?: string;
  metric: string;
  targetValue: number;
  currentValue: number;
  deadline: string;
  progress: number; // 0-100
  status: 'on_track' | 'at_risk' | 'behind' | 'completed';
}
