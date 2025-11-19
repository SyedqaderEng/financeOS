import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, generateTokenWithExpiry } from '@/lib/auth-utils';
import { signupSchema } from '@/lib/validations';
import type { ApiResponse } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate request body
    const validatedFields = signupSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid input data',
            details: validatedFields.error.errors,
          },
        },
        { status: 400 }
      );
    }

    const { fullName, email, password } = validatedFields.data;

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: 'USER_EXISTS',
            message: 'An account with this email already exists',
          },
        },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Generate email verification token
    const { token: emailVerificationToken, expires: tokenExpires } =
      generateTokenWithExpiry(24);

    // Create user
    const user = await db.user.create({
      data: {
        fullName,
        email,
        passwordHash,
        emailVerificationToken,
        passwordResetExpires: tokenExpires,
        subscriptionPlan: 'trial',
        subscriptionStatus: 'active',
        subscriptionEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days trial
      },
      select: {
        id: true,
        email: true,
        fullName: true,
      },
    });

    // TODO: Send verification email in Phase 9
    console.log(`Email verification token for ${email}: ${emailVerificationToken}`);
    console.log(`Verification URL: ${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${emailVerificationToken}`);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: {
          userId: user.id,
          email: user.email,
        },
        message: 'Account created successfully. Please check your email to verify your account.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred during signup. Please try again.',
        },
      },
      { status: 500 }
    );
  }
}
