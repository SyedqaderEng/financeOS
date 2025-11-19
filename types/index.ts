import { User as PrismaUser } from '@prisma/client';

// Extend Prisma User type
export type User = PrismaUser;

export type SessionUser = {
  id: string;
  email: string;
  fullName: string;
  emailVerified: boolean;
  avatarUrl: string | null;
  subscriptionPlan: string;
  subscriptionStatus: string;
};

export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown[];
  };
  message?: string;
};

export type PaginationParams = {
  page: number;
  limit: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

export type DateRange = {
  startDate: string;
  endDate: string;
};

// Form types
export type LoginFormData = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export type SignupFormData = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  subscribeToNewsletter?: boolean;
};

export type ForgotPasswordFormData = {
  email: string;
};

export type ResetPasswordFormData = {
  password: string;
  confirmPassword: string;
};
