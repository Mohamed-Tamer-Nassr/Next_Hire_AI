// ✅ NEW: Centralized type definitions for dashboard

export interface DailyStats {
  date: string;
  totalInterviews: number;
  completedQuestions: number;
  unAnswerQuestions: number;
  completionRate: number;
}

export interface DashboardStatsData {
  totalInterviews: number;
  completionRate: number;
  stats: DailyStats[];
}

export interface DashboardProps {
  data: DashboardStatsData | null;
}

export interface DashboardStatsProps {
  totalInterviews: number;
  completionRate: number;
  subscriptionStatus: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: {
    message: string;
    statusCode?: number;
  };
}

// ✅ Constants
export const DASHBOARD_CONSTANTS = {
  RESULT_PER_PAGE: 10,
  MAX_RESULTS_PER_PAGE: 50,
  DEFAULT_COMPLETION_RATE: 0,
  SUBSCRIPTION_PRICE: "$9.99",
  CACHE_REVALIDATE_TIME: 60, // seconds
} as const;

// ✅ Utility types
export type SubscriptionStatus =
  | "active"
  | "inactive"
  | "cancelled"
  | "trialing";

export interface DateRange {
  start: Date;
  end: Date;
}
