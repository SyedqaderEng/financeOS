import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isTokenValid } from '@/lib/auth-utils';
import type { ApiResponse } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: 'INVALID_TOKEN',
            message: 'Verification token is required',
          },
        },
        { status: 400 }
      );
    }

    // Find user with this token
    const user = await db.user.findFirst({
      where: {
        emailVerificationToken: token,
      },
    });

    if (!user) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: 'INVALID_TOKEN',
            message: 'Invalid or expired verification token',
          },
        },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (!isTokenValid(user.passwordResetExpires)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: 'TOKEN_EXPIRED',
            message: 'Verification token has expired. Please request a new one.',
          },
        },
        { status: 400 }
      );
    }

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json<ApiResponse>(
        {
          success: true,
          message: 'Email already verified. You can login now.',
        },
        { status: 200 }
      );
    }

    // Verify email
    await db.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationToken: null,
        passwordResetExpires: null,
      },
    });

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: 'Email verified successfully! You can now log in.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred during verification. Please try again.',
        },
      },
      { status: 500 }
    );
  }
}
