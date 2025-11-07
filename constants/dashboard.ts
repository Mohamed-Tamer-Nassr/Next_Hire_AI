// ✅ NEW: Dashboard constants file

export const DASHBOARD_CONSTANTS = {
  // Pagination
  RESULT_PER_PAGE: 10,
  MAX_RESULTS_PER_PAGE: 50,
  MIN_RESULTS_PER_PAGE: 1,

  // Stats
  DEFAULT_COMPLETION_RATE: 0,
  DEFAULT_TOTAL_INTERVIEWS: 0,

  // Subscription
  SUBSCRIPTION_PRICE: "$9.99",
  SUBSCRIPTION_STATUS: {
    ACTIVE: "active",
    INACTIVE: "inactive",
    CANCELLED: "cancelled",
    TRIALING: "trialing",
  },

  // Caching
  CACHE_REVALIDATE_TIME: 60, // seconds
  CACHE_CONTROL_HEADER: "private, max-age=60, must-revalidate",

  // Validation
  MIN_QUESTIONS: 1,
  MAX_QUESTIONS: 50,
  MIN_DURATION_MINUTES: 2,
  MAX_DURATION_MINUTES: 120,
  MAX_ANSWER_LENGTH: 5000,

  // Time
  MILLISECONDS_IN_SECOND: 1000,
  SECONDS_IN_MINUTE: 60,
  MINUTES_IN_HOUR: 60,
  HOURS_IN_DAY: 24,

  // Retry
  MAX_RETRY_ATTEMPTS: 3,
  RETRY_DELAY_MS: 1000,
} as const;

// ✅ Icon mappings
export const DASHBOARD_ICONS = {
  TOTAL_INTERVIEWS: "solar:users-group-rounded-linear",
  COMPLETION_RATE: "solar:users-group-two-rounded-bold",
  SUBSCRIPTION: "solar:dollar-minimalistic-broken",
  ERROR: "solar:danger-circle-broken",
  EMPTY_STATE: "solar:document-broken",
  LOADING: "solar:refresh-circle-linear",
} as const;

// ✅ Color mappings
export const DASHBOARD_COLORS = {
  PRIMARY: {
    bgColor: "bg-primary-50",
    iconColor: "text-primary",
  },
  WARNING: {
    bgColor: "bg-warning-50",
    iconColor: "text-warning",
  },
  SUCCESS: {
    bgColor: "bg-success-50",
    iconColor: "text-success",
  },
  DANGER: {
    bgColor: "bg-danger-50",
    iconColor: "text-danger",
  },
} as const;

// ✅ Error messages
export const DASHBOARD_ERROR_MESSAGES = {
  FAILED_TO_LOAD: "Failed to load dashboard data",
  NO_INTERVIEWS: "No interviews found",
  INVALID_DATE_RANGE: "Invalid date range selected",
  UNAUTHORIZED: "You must be logged in to view this page",
  SERVER_ERROR: "An unexpected error occurred. Please try again later.",
} as const;

// ✅ Success messages
export const DASHBOARD_SUCCESS_MESSAGES = {
  DATA_LOADED: "Dashboard data loaded successfully",
  DATA_REFRESHED: "Dashboard data refreshed",
} as const;

// ✅ Chart configuration
export const CHART_CONSTANTS = {
  DEFAULT_HEIGHT: 400,
  ANIMATION_DURATION: 300,
  COLORS: {
    PRIMARY: "#0070f3",
    SUCCESS: "#00c853",
    WARNING: "#ff9800",
    DANGER: "#f44336",
  },
} as const;
