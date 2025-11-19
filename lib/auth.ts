import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { loginSchema } from '@/lib/validations';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(db),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
    verifyRequest: '/verify-email',
    newUser: '/app/dashboard',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          // Validate input
          const validatedFields = loginSchema.safeParse(credentials);
          if (!validatedFields.success) {
            return null;
          }

          const { email, password } = validatedFields.data;

          // Find user by email
          const user = await db.user.findUnique({
            where: { email },
          });

          if (!user || !user.passwordHash) {
            return null;
          }

          // Check if email is verified
          // TODO: Re-enable after implementing email service in Phase 9
          // if (!user.emailVerified) {
          //   throw new Error('Please verify your email before logging in');
          // }

          // Verify password
          const passwordMatch = await bcrypt.compare(password, user.passwordHash);
          if (!passwordMatch) {
            return null;
          }

          // Update last login
          await db.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
          });

          return {
            id: user.id,
            email: user.email,
            name: user.fullName,
            image: user.avatarUrl,
            emailVerified: user.emailVerified,
          };
        } catch (error) {
          console.error('Authorization error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.emailVerified = user.emailVerified;

        // Fetch additional user data
        const dbUser = await db.user.findUnique({
          where: { id: user.id },
          select: {
            subscriptionPlan: true,
            subscriptionStatus: true,
            fullName: true,
          },
        });

        if (dbUser) {
          token.subscriptionPlan = dbUser.subscriptionPlan;
          token.subscriptionStatus = dbUser.subscriptionStatus;
          token.name = dbUser.fullName;
        }
      }

      // OAuth sign in - create OAuth account record
      if (account?.provider && account.provider !== 'credentials') {
        await db.oAuthAccount.upsert({
          where: {
            provider_providerAccountId: {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            },
          },
          create: {
            userId: user.id,
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            accessToken: account.access_token,
            refreshToken: account.refresh_token,
            expiresAt: account.expires_at ? new Date(account.expires_at * 1000) : null,
          },
          update: {
            accessToken: account.access_token,
            refreshToken: account.refresh_token,
            expiresAt: account.expires_at ? new Date(account.expires_at * 1000) : null,
          },
        });
      }

      // Update session
      if (trigger === 'update' && session) {
        token.name = session.user.name;
        token.email = session.user.email;
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.emailVerified = token.emailVerified as boolean;
        session.user.subscriptionPlan = token.subscriptionPlan as string;
        session.user.subscriptionStatus = token.subscriptionStatus as string;
      }

      return session;
    },
    async signIn({ user, account, profile }) {
      // For OAuth providers
      if (account?.provider !== 'credentials') {
        // Check if user exists
        const existingUser = await db.user.findUnique({
          where: { email: user.email! },
        });

        // If user doesn't exist, create them
        if (!existingUser) {
          await db.user.create({
            data: {
              email: user.email!,
              fullName: user.name || '',
              avatarUrl: user.image,
              emailVerified: true, // OAuth providers verify email
              subscriptionPlan: 'trial',
              subscriptionStatus: 'active',
              subscriptionEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            },
          });
        } else if (!existingUser.emailVerified) {
          // If user exists but email not verified, verify it now
          await db.user.update({
            where: { id: existingUser.id },
            data: { emailVerified: true },
          });
        }
      }

      return true;
    },
  },
  events: {
    async createUser({ user }) {
      // Send welcome email
      console.log(`New user created: ${user.email}`);
      // TODO: Send welcome email via Resend in Phase 9
    },
    async signIn({ user, account, isNewUser }) {
      console.log(`User signed in: ${user.email}`);
      // TODO: Log sign-in event in audit log
    },
  },
  debug: process.env.NODE_ENV === 'development',
});

// Helper function to get current session
export async function getCurrentUser() {
  const session = await auth();
  return session?.user;
}

// Helper function to require authentication
export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  return session.user;
}
