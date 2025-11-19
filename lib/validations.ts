import { z } from 'zod';
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  EMAIL_REGEX,
  ERROR_MESSAGES,
} from '@/lib/constants';

// Authentication Schemas
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, ERROR_MESSAGES.REQUIRED_FIELD)
    .email(ERROR_MESSAGES.INVALID_EMAIL),
  password: z.string().min(1, ERROR_MESSAGES.REQUIRED_FIELD),
  rememberMe: z.boolean().optional(),
});

export const signupSchema = z
  .object({
    fullName: z
      .string()
      .min(1, ERROR_MESSAGES.REQUIRED_FIELD)
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must be less than 100 characters'),
    email: z
      .string()
      .min(1, ERROR_MESSAGES.REQUIRED_FIELD)
      .regex(EMAIL_REGEX, ERROR_MESSAGES.INVALID_EMAIL),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH, ERROR_MESSAGES.INVALID_PASSWORD)
      .regex(PASSWORD_REGEX, ERROR_MESSAGES.INVALID_PASSWORD),
    confirmPassword: z.string().min(1, ERROR_MESSAGES.REQUIRED_FIELD),
    agreeToTerms: z
      .boolean()
      .refine((val) => val === true, ERROR_MESSAGES.TERMS_NOT_ACCEPTED),
    subscribeToNewsletter: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: ERROR_MESSAGES.PASSWORDS_DONT_MATCH,
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, ERROR_MESSAGES.REQUIRED_FIELD)
    .email(ERROR_MESSAGES.INVALID_EMAIL),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH, ERROR_MESSAGES.INVALID_PASSWORD)
      .regex(PASSWORD_REGEX, ERROR_MESSAGES.INVALID_PASSWORD),
    confirmPassword: z.string().min(1, ERROR_MESSAGES.REQUIRED_FIELD),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: ERROR_MESSAGES.PASSWORDS_DONT_MATCH,
    path: ['confirmPassword'],
  });

// Account Schemas
export const accountSchema = z.object({
  accountType: z.enum([
    'checking',
    'savings',
    'credit_card',
    'investment',
    'loan',
    'other',
  ]),
  name: z
    .string()
    .min(1, ERROR_MESSAGES.REQUIRED_FIELD)
    .max(100, 'Account name must be less than 100 characters'),
  institution: z.string().max(100).optional(),
  accountNumberLast4: z.string().length(4).optional().or(z.literal('')),
  currentBalance: z.number().or(z.string().transform((val) => parseFloat(val))),
  currency: z.string().length(3).default('USD'),
  color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  notes: z.string().max(500).optional(),
});

// Transaction Schemas
export const transactionSchema = z.object({
  accountId: z.string().uuid(),
  transactionType: z.enum(['expense', 'income', 'transfer']),
  date: z.string().or(z.date()),
  amount: z.number().positive().or(z.string().transform((val) => parseFloat(val))),
  categoryId: z.string().uuid().optional(),
  merchant: z.string().max(255).optional(),
  description: z.string().max(500).optional(),
  tags: z.array(z.string()).optional(),
  receiptFile: z.string().optional(), // base64 encoded file
});

// Budget Schemas
export const budgetSchema = z.object({
  name: z.string().min(1, ERROR_MESSAGES.REQUIRED_FIELD).max(100),
  periodType: z.enum(['weekly', 'monthly', 'quarterly', 'yearly']),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()),
  budgetMethod: z.enum(['zero_based', '50_30_20', 'envelope', 'custom']),
  totalIncome: z.number().positive().optional(),
  categories: z
    .array(
      z.object({
        categoryId: z.string().uuid(),
        budgetedAmount: z.number().nonnegative(),
        rolloverEnabled: z.boolean().optional(),
        alertThreshold: z.number().min(0).max(100).optional(),
      })
    )
    .optional(),
});

// Goal Schemas
export const goalSchema = z.object({
  name: z.string().min(1, ERROR_MESSAGES.REQUIRED_FIELD).max(100),
  emoji: z.string().max(10).optional(),
  targetAmount: z.number().positive(),
  currentAmount: z.number().nonnegative().default(0),
  targetDate: z.string().or(z.date()).optional(),
  contributionFrequency: z
    .enum(['weekly', 'biweekly', 'monthly'])
    .optional(),
  autoContributionAmount: z.number().positive().optional(),
  accountId: z.string().uuid().optional(),
  notes: z.string().max(500).optional(),
});

// Category Schemas
export const categorySchema = z.object({
  name: z.string().min(1, ERROR_MESSAGES.REQUIRED_FIELD).max(100),
  icon: z.string().max(50).optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  parentCategoryId: z.string().uuid().optional(),
  isIncome: z.boolean().default(false),
});

// Profile Schemas
export const profileSchema = z.object({
  fullName: z.string().min(2).max(100),
  phone: z.string().max(20).optional(),
  timezone: z.string().max(50).optional(),
  currency: z.string().length(3).default('USD'),
  fiscalYearStart: z.number().min(1).max(12).optional(),
  dateFormat: z.string().max(20).optional(),
  avatarFile: z.string().optional(), // base64 encoded file
});

// Helper to validate form data
export function validateFormData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors: Record<string, string> = {};
  result.error.errors.forEach((err) => {
    if (err.path) {
      errors[err.path.join('.')] = err.message;
    }
  });

  return { success: false, errors };
}
