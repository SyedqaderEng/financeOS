// App Configuration
export const APP_NAME = 'FinanceOS';
export const APP_DESCRIPTION = 'Master Your Money with FinanceOS';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Subscription Plans
export const SUBSCRIPTION_PLANS = {
  TRIAL: 'trial',
  BASIC: 'basic',
  PLUS: 'plus',
  FAMILY: 'family',
} as const;

export const SUBSCRIPTION_PLAN_NAMES = {
  [SUBSCRIPTION_PLANS.TRIAL]: '30-Day Trial',
  [SUBSCRIPTION_PLANS.BASIC]: 'Basic',
  [SUBSCRIPTION_PLANS.PLUS]: 'Plus',
  [SUBSCRIPTION_PLANS.FAMILY]: 'Family',
} as const;

export const SUBSCRIPTION_PRICES = {
  [SUBSCRIPTION_PLANS.BASIC]: { monthly: 7.99, yearly: 79 },
  [SUBSCRIPTION_PLANS.PLUS]: { monthly: 9.99, yearly: 99 },
  [SUBSCRIPTION_PLANS.FAMILY]: { monthly: 14.99, yearly: 149 },
} as const;

// Account Types
export const ACCOUNT_TYPES = {
  CHECKING: 'checking',
  SAVINGS: 'savings',
  CREDIT_CARD: 'credit_card',
  INVESTMENT: 'investment',
  LOAN: 'loan',
  OTHER: 'other',
} as const;

// Transaction Types
export const TRANSACTION_TYPES = {
  EXPENSE: 'expense',
  INCOME: 'income',
  TRANSFER: 'transfer',
} as const;

// Transaction Status
export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  POSTED: 'posted',
  RECONCILED: 'reconciled',
} as const;

// Budget Methods
export const BUDGET_METHODS = {
  ZERO_BASED: 'zero_based',
  FIFTY_THIRTY_TWENTY: '50_30_20',
  ENVELOPE: 'envelope',
  CUSTOM: 'custom',
} as const;

// Period Types
export const PERIOD_TYPES = {
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  YEARLY: 'yearly',
} as const;

// Goal Status
export const GOAL_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  ARCHIVED: 'archived',
} as const;

// Income Types
export const INCOME_TYPES = {
  SALARY: 'salary',
  FREELANCE: 'freelance',
  BUSINESS: 'business',
  INVESTMENT: 'investment',
  RENTAL: 'rental',
  OTHER: 'other',
} as const;

// Frequency Types
export const FREQUENCY_TYPES = {
  ONE_TIME: 'one_time',
  WEEKLY: 'weekly',
  BIWEEKLY: 'biweekly',
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  YEARLY: 'yearly',
} as const;

// Notification Types
export const NOTIFICATION_TYPES = {
  BUDGET_ALERT: 'budget_alert',
  BILL_REMINDER: 'bill_reminder',
  GOAL_MILESTONE: 'goal_milestone',
  LARGE_TRANSACTION: 'large_transaction',
  UNUSUAL_ACTIVITY: 'unusual_activity',
  SYNC_ERROR: 'sync_error',
  SYSTEM_UPDATE: 'system_update',
} as const;

// Date Formats
export const DATE_FORMATS = {
  SHORT: 'MM/DD/YYYY',
  LONG: 'MMMM DD, YYYY',
  FULL: 'MMMM DD, YYYY HH:mm',
} as const;

// Currency
export const DEFAULT_CURRENCY = 'USD';
export const SUPPORTED_CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'] as const;

// Pagination
export const DEFAULT_PAGE_SIZE = 50;
export const MAX_PAGE_SIZE = 200;

// File Upload
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

// Rate Limiting
export const RATE_LIMIT_MAX_REQUESTS = 100;
export const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

// Session
export const SESSION_MAX_AGE = 30 * 24 * 60 * 60; // 30 days
export const SESSION_UPDATE_AGE = 24 * 60 * 60; // 1 day

// Validation
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Error Messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PASSWORD:
    'Password must be at least 8 characters and contain uppercase, lowercase, number, and special character',
  PASSWORDS_DONT_MATCH: 'Passwords do not match',
  TERMS_NOT_ACCEPTED: 'You must accept the terms and conditions',
  GENERIC_ERROR: 'An error occurred. Please try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
} as const;
