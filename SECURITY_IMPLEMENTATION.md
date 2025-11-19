# Security Implementation Guide for FinanceOS

## Overview

This document outlines realistic, cost-effective security practices for a new financial application. These are industry-standard practices that can be implemented without expensive third-party audits while still providing strong security for user data.

---

## Security Principles

### What We Promise Users
- **Encryption**: Data encrypted in transit (TLS 1.3) and at rest
- **Privacy**: We never sell user data to third parties
- **Read-only access**: Cannot move money or initiate transactions
- **No password storage**: Banking credentials stay with Plaid
- **Two-factor authentication**: Available for all users
- **Regular updates**: Security patches applied promptly

### What We DON'T Claim
- ❌ SOC 2 Type II certification (costs $15k-$50k, takes 12-18 months)
- ❌ "Bank-level security" (too vague and implies expensive audits)
- ❌ Third-party security audits (expensive for startups)
- ❌ PCI DSS compliance (not needed - we don't process payments directly)

---

## 1. Encryption

### Data in Transit (TLS 1.3)

**Implementation**: Next.js + Vercel/AWS with proper HTTPS configuration

```typescript
// next.config.js - Security headers
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
        ],
      },
    ];
  },
};
```

**SSL Certificate**:
- Use **Let's Encrypt** (free) or **AWS Certificate Manager** (free)
- Enforce HTTPS everywhere
- No cost

### Data at Rest

**Database Encryption**:
- Use **Vercel Postgres** or **Supabase** (both have encryption enabled by default)
- Or **AWS RDS with encryption enabled** (checkbox during setup)
- No additional code needed - it's automatic

**Environment Variables**:
```bash
# .env.local (never commit to git)
DATABASE_URL=postgresql://...
PLAID_CLIENT_ID=your_client_id
PLAID_SECRET=your_secret
NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32
ENCRYPTION_KEY=generate_with_openssl_rand_hex_64
```

**Sensitive Data Encryption** (optional, for extra security):
```typescript
// lib/encryption.ts
import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  // Return iv:authTag:encrypted
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

export function decrypt(encryptedData: string): string {
  const [ivHex, authTagHex, encrypted] = encryptedData.split(':');

  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    KEY,
    Buffer.from(ivHex, 'hex')
  );

  decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
```

---

## 2. Authentication

### Password Security

```typescript
// lib/auth.ts
import bcrypt from 'bcryptjs';

// Hash password with bcrypt (cost factor 12)
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// Verify password
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Password validation
export function isStrongPassword(password: string): boolean {
  // Minimum 12 characters
  if (password.length < 12) return false;

  // Must contain uppercase, lowercase, number, special char
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return hasUpper && hasLower && hasNumber && hasSpecial;
}
```

### Two-Factor Authentication (MFA)

```typescript
// lib/mfa.ts
import { authenticator } from 'otplib';
import QRCode from 'qrcode';

// Generate MFA secret for user
export function generateMFASecret(): string {
  return authenticator.generateSecret();
}

// Generate QR code for user to scan
export async function generateQRCode(
  email: string,
  secret: string
): Promise<string> {
  const otpauthUrl = authenticator.keyuri(email, 'FinanceOS', secret);
  return QRCode.toDataURL(otpauthUrl);
}

// Verify MFA code
export function verifyMFACode(code: string, secret: string): boolean {
  return authenticator.verify({ token: code, secret });
}
```

**Setup Flow**:
1. User enables MFA in settings
2. Generate secret and QR code
3. User scans QR with Google Authenticator/Authy
4. User enters 6-digit code to verify
5. Save `mfaSecret` (encrypted) and set `mfaEnabled: true`

### Session Management

```typescript
// lib/auth.ts with NextAuth.js
import { AuthOptions } from 'next-auth';

export const authOptions: AuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: '__Secure-next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true, // HTTPS only
      },
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};
```

---

## 3. Plaid Integration Security

### Why Plaid is Secure

**Plaid handles all the heavy lifting**:
- ✅ **No password storage**: User enters credentials directly into Plaid's UI
- ✅ **Read-only access**: Cannot initiate transfers or move money
- ✅ **Secure tokens**: We only store encrypted access tokens
- ✅ **Bank-grade**: Plaid is used by Venmo, Robinhood, Coinbase, etc.

### Implementation

```typescript
// lib/plaid.ts
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox, // Use 'production' when ready
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID!,
      'PLAID-SECRET': process.env.PLAID_SECRET!,
    },
  },
});

export const plaidClient = new PlaidApi(configuration);

// Create link token (client-side uses this to open Plaid Link)
export async function createLinkToken(userId: string) {
  const response = await plaidClient.linkTokenCreate({
    user: { client_user_id: userId },
    client_name: 'FinanceOS',
    products: ['transactions'], // Read-only
    country_codes: ['US'],
    language: 'en',
  });

  return response.data.link_token;
}

// Exchange public token for access token (server-side only)
export async function exchangePublicToken(publicToken: string, userId: string) {
  const response = await plaidClient.itemPublicTokenExchange({
    public_token: publicToken,
  });

  const { access_token, item_id } = response.data;

  // Store access_token encrypted
  await db.plaidItem.create({
    data: {
      userId,
      itemId: item_id,
      accessToken: encrypt(access_token), // Encrypt before storing
    },
  });

  return item_id;
}
```

**Important**: Access tokens are **encrypted** before storing in database.

---

## 4. Rate Limiting & Abuse Prevention

### Login Rate Limiting

```typescript
// middleware.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '15 m'), // 5 requests per 15 minutes
});

export async function loginRateLimit(req: Request) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown';

  const { success, limit, reset, remaining } = await ratelimit.limit(
    `login_${ip}`
  );

  if (!success) {
    throw new Error('Too many login attempts. Try again later.');
  }

  return { limit, reset, remaining };
}
```

**Alternative (free)**: Use in-memory rate limiting with `express-rate-limit` or simple Redis.

### API Rate Limiting

```typescript
// Rate limit API routes
const apiLimiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 requests per minute
});
```

---

## 5. Security Monitoring (Free/Cheap Options)

### Error Tracking

**Sentry** (free tier: 5,000 errors/month):
```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1, // 10% of transactions
  beforeSend(event) {
    // Remove sensitive data
    if (event.request?.headers) {
      delete event.request.headers.Authorization;
      delete event.request.headers.Cookie;
    }
    return event;
  },
});
```

### Audit Logging

```typescript
// lib/audit-log.ts
export async function logSecurityEvent(event: {
  type: 'login' | 'logout' | 'password_change' | 'mfa_enabled' | 'bank_connected';
  userId: string;
  ip: string;
  userAgent: string;
  success: boolean;
}) {
  await db.auditLog.create({
    data: {
      ...event,
      timestamp: new Date(),
    },
  });

  // Alert on suspicious activity
  if (await isSuspicious(event)) {
    await sendAlert(event);
  }
}

async function isSuspicious(event: AuditEvent): Promise<boolean> {
  // Multiple failed logins
  if (!event.success && event.type === 'login') {
    const recentFailed = await db.auditLog.count({
      where: {
        userId: event.userId,
        type: 'login',
        success: false,
        timestamp: { gte: new Date(Date.now() - 15 * 60 * 1000) },
      },
    });

    return recentFailed >= 5; // 5 failed attempts in 15 min
  }

  return false;
}
```

### Database Backups

**Automated backups** (most hosting providers include this):
- **Vercel Postgres**: Automatic backups
- **Supabase**: Daily backups on free tier
- **AWS RDS**: Enable automated backups (7-35 days retention)

---

## 6. Data Privacy & GDPR Compliance

### Privacy Policy Requirements

Must include:
- What data we collect (email, transactions, bank accounts)
- How we use it (provide the service)
- Who we share with (Plaid for bank connections)
- How long we keep it (7 years for financial records)
- User rights (export, delete)

### Data Export (GDPR Article 20)

```typescript
// app/api/user/export/route.ts
import { getServerSession } from 'next-auth';

export async function GET() {
  const session = await getServerSession();

  const userData = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      transactions: true,
      budgets: true,
      goals: true,
      accounts: true,
    },
  });

  return Response.json(userData, {
    headers: {
      'Content-Disposition': 'attachment; filename="financeos-data.json"',
    },
  });
}
```

### Account Deletion (GDPR Article 17)

```typescript
// app/api/user/delete/route.ts
export async function DELETE() {
  const session = await getServerSession();

  // Mark as deleted (soft delete for financial record keeping)
  await db.user.update({
    where: { id: session.user.id },
    data: {
      email: `deleted_${Date.now()}@deleted.financeos.com`,
      name: 'Deleted User',
      deletedAt: new Date(),
    },
  });

  // Disconnect Plaid accounts
  await disconnectAllBankAccounts(session.user.id);

  return Response.json({ success: true });
}
```

---

## 7. Deployment Security Checklist

### Before Launch

- [ ] **HTTPS enforced** (automatic with Vercel/Netlify)
- [ ] **Environment variables** in secure vault (Vercel env vars, not .env files)
- [ ] **Database encryption** enabled (Vercel Postgres has this by default)
- [ ] **Password hashing** with bcrypt cost factor 12+
- [ ] **Session cookies** are httpOnly and secure
- [ ] **Rate limiting** on login and API routes
- [ ] **MFA available** for all users
- [ ] **Plaid integration** tested in sandbox
- [ ] **Error tracking** setup (Sentry)
- [ ] **Audit logging** for security events
- [ ] **Privacy policy** published
- [ ] **Terms of service** published
- [ ] **Automated backups** configured

### Security Headers

```typescript
// Verify these are set in production:
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

Test at: https://securityheaders.com

---

## 8. Ongoing Security Practices

### Regular Updates

**Weekly**:
- Check for npm security vulnerabilities: `npm audit`
- Apply critical security patches

**Monthly**:
- Update dependencies: `npm update`
- Review audit logs for suspicious activity

**Quarterly**:
- Review and rotate secrets (API keys)
- Test disaster recovery procedures
- Review user permissions

### Vulnerability Disclosure

**security.txt** file:
```
Contact: security@financeos.com
Preferred-Languages: en
Canonical: https://financeos.com/.well-known/security.txt
```

Respond to security reports within:
- Critical: 24 hours
- High: 72 hours
- Medium/Low: 7 days

---

## 9. Cost Breakdown

### Free Tier Options

| Service | Free Tier | Cost if Exceeded |
|---------|-----------|------------------|
| Vercel Postgres | 256 MB | $20/mo for 1 GB |
| Sentry | 5,000 errors/month | $26/mo |
| Upstash Redis | 10,000 commands/day | $0.20 per 100k |
| Plaid | 100 sandbox items | $0.25/item in production |
| Let's Encrypt | Unlimited SSL certs | Free forever |
| AWS RDS Free Tier | 750 hours/month (12 months) | ~$15/mo after |

**Total startup cost**: $0-$50/month for first year

### What We're NOT Paying For
- ❌ SOC 2 audit: $15,000-$50,000
- ❌ Penetration testing: $5,000-$15,000
- ❌ Security consultant: $150-$300/hour
- ❌ PCI DSS compliance: Not needed (Stripe handles payments)

---

## 10. Incident Response Plan

### If a Security Issue is Reported

1. **Acknowledge** within 24 hours
2. **Assess** severity (Critical/High/Medium/Low)
3. **Fix** the vulnerability
4. **Deploy** patch to production
5. **Notify** affected users if data was exposed
6. **Document** the incident and response

### Data Breach Notification

**If user data is compromised**:
- Notify affected users within 72 hours (GDPR requirement)
- Explain what data was exposed
- What we're doing to prevent recurrence
- Offer credit monitoring if SSN exposed (US users)

---

## Summary

**What FinanceOS Security Actually Means**:

✅ **Industry-standard encryption** (TLS 1.3, bcrypt, AES-256)
✅ **Secure authentication** (sessions, MFA)
✅ **Plaid integration** (read-only bank access, no password storage)
✅ **Privacy-first** (no selling data, GDPR compliance)
✅ **Monitoring** (error tracking, audit logs)
✅ **Regular updates** (security patches)
✅ **Data protection** (backups, export, deletion)

❌ NOT claiming: SOC 2, third-party audits, "bank-level" security

### Timeline to Launch-Ready Security

**Week 1**:
- Set up HTTPS and security headers
- Implement password hashing
- Configure session management

**Week 2**:
- Add MFA functionality
- Set up rate limiting
- Configure error tracking (Sentry)

**Week 3**:
- Implement audit logging
- Add data export/deletion endpoints
- Write privacy policy and terms

**Week 4**:
- Security review and testing
- Configure automated backups
- Final checklist review

**Total**: 4 weeks to production-ready security without expensive audits.

---

## Recommended Reading

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [Plaid Security Docs](https://plaid.com/security/)
- [Next.js Security Best Practices](https://nextjs.org/docs/pages/building-your-application/deploying/production-checklist#security)

This approach provides **strong security for a startup** without the $20k+ cost of audits and certifications.
