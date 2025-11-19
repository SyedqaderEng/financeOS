import bcrypt from 'bcryptjs';
import crypto from 'crypto';

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate a random token for email verification or password reset
 */
export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Generate a token that expires in the specified number of hours
 */
export function generateTokenWithExpiry(hours: number = 24): {
  token: string;
  expires: Date;
} {
  return {
    token: generateToken(),
    expires: new Date(Date.now() + hours * 60 * 60 * 1000),
  };
}

/**
 * Verify if a token is still valid
 */
export function isTokenValid(expiresAt: Date | null): boolean {
  if (!expiresAt) return false;
  return new Date() < expiresAt;
}
