import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT, DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      emailVerified: boolean;
      subscriptionPlan: string;
      subscriptionStatus: string;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    emailVerified: boolean;
    subscriptionPlan?: string;
    subscriptionStatus?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string;
    emailVerified: boolean;
    subscriptionPlan: string;
    subscriptionStatus: string;
  }
}
