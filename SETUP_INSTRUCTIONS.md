# FinanceOS - Setup Instructions

Complete guide to set up FinanceOS locally and deploy to production.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Database Setup](#database-setup)
4. [Third-Party Services Configuration](#third-party-services-configuration)
5. [Running the Application](#running-the-application)
6. [Testing](#testing)
7. [Deployment](#deployment)
8. [Troubleshooting](#troubleshooting)
9. [Common Commands](#common-commands)

---

## Prerequisites

### Required Software

- **Node.js** 18.17 or later
  - Download: https://nodejs.org/
  - Verify: `node --version`

- **npm** 9.0 or later (comes with Node.js)
  - Verify: `npm --version`

- **PostgreSQL** 14 or later
  - Download: https://www.postgresql.org/download/
  - Or use Docker: `docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=password postgres:16`
  - Verify: `psql --version`

- **Git**
  - Download: https://git-scm.com/downloads
  - Verify: `git --version`

### Optional but Recommended

- **Docker** (for containerized database)
  - Download: https://www.docker.com/products/docker-desktop

- **VS Code** (recommended IDE)
  - Download: https://code.visualstudio.com/
  - Recommended extensions:
    - Prisma
    - ESLint
    - Prettier
    - Tailwind CSS IntelliSense
    - TypeScript and JavaScript

---

## Local Development Setup

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/your-username/financeOS.git

# Navigate to project directory
cd financeOS
```

### Step 2: Install Dependencies

```bash
# Install all npm packages
npm install

# This will install:
# - Next.js 14
# - React 18
# - TypeScript
# - Tailwind CSS
# - Prisma ORM
# - NextAuth.js
# - All other dependencies from package.json
```

### Step 3: Environment Variables

```bash
# Copy environment template
cp .env.example .env.local

# Open .env.local and fill in the values
# See "Third-Party Services Configuration" section below for obtaining credentials
```

**Minimum required variables for local development:**

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/financeos_dev?schema=public"
NEXTAUTH_SECRET="generate-this-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Generate NEXTAUTH_SECRET:**

```bash
# On macOS/Linux
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))

# Or use an online generator (for development only)
# https://generate-secret.vercel.app/32
```

### Step 4: Database Setup

See [Database Setup](#database-setup) section below.

### Step 5: Initialize Prisma

```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations (creates all tables)
npx prisma migrate dev --name init

# Optional: Seed database with sample data
npx prisma db seed
```

### Step 6: Verify Setup

```bash
# Run type check
npm run type-check

# Run linter
npm run lint

# Start development server
npm run dev
```

Visit http://localhost:3000 - you should see the landing page!

---

## Database Setup

### Option 1: Local PostgreSQL (Recommended for Development)

**Using Docker (Easiest):**

```bash
# Start PostgreSQL container
docker run -d \
  --name financeos-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=financeos_dev \
  -p 5432:5432 \
  postgres:16

# Verify container is running
docker ps

# Connection string for .env.local:
# DATABASE_URL="postgresql://postgres:password@localhost:5432/financeos_dev?schema=public"
```

**Using Native PostgreSQL:**

1. Install PostgreSQL 14+
2. Start PostgreSQL service
3. Create database:

```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database
CREATE DATABASE financeos_dev;

-- Create user (optional)
CREATE USER financeos_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE financeos_dev TO financeos_user;

-- Exit
\q
```

4. Update `.env.local` with connection string:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/financeos_dev?schema=public"
```

### Option 2: Hosted Database (Production-like)

**Supabase (Free tier available):**

1. Sign up at https://supabase.com
2. Create new project
3. Copy database connection string from Settings > Database
4. Update `.env.local`:

```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

**Neon (Free tier available):**

1. Sign up at https://neon.tech
2. Create new project
3. Copy connection string
4. Update `.env.local`:

```env
DATABASE_URL="postgresql://[USER]:[PASSWORD]@[ENDPOINT].neon.tech/[DATABASE]?sslmode=require"
```

**Railway (Free tier available):**

1. Sign up at https://railway.app
2. Create new project > Add PostgreSQL
3. Copy DATABASE_URL from Variables tab
4. Update `.env.local`

### Database Migrations

```bash
# Create a new migration after schema changes
npx prisma migrate dev --name description_of_change

# Apply migrations to production
npx prisma migrate deploy

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# View database in browser
npx prisma studio
```

---

## Third-Party Services Configuration

### 1. Google OAuth

**Purpose:** Allow users to sign in with Google

**Setup:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Enable "Google+ API"
4. Go to "Credentials" > "Create Credentials" > "OAuth 2.0 Client ID"
5. Configure consent screen if prompted
6. Application type: "Web application"
7. Add Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
8. Copy Client ID and Client Secret
9. Add to `.env.local`:

```env
GOOGLE_CLIENT_ID="xxxxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="xxxxx"
```

### 2. Apple Sign In

**Purpose:** Allow users to sign in with Apple

**Setup:**

1. Go to [Apple Developer](https://developer.apple.com/account/)
2. Certificates, Identifiers & Profiles > Identifiers
3. Create new identifier > "Services IDs"
4. Configure "Sign in with Apple"
5. Add Return URLs:
   - `http://localhost:3000/api/auth/callback/apple`
   - `https://yourdomain.com/api/auth/callback/apple`
6. Create private key for Sign in with Apple
7. Add to `.env.local`:

```env
APPLE_ID="com.yourcompany.financeos"
APPLE_TEAM_ID="YOUR_TEAM_ID"
APPLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
APPLE_KEY_ID="YOUR_KEY_ID"
```

### 3. Plaid (Bank Integration)

**Purpose:** Connect users' bank accounts and sync transactions

**Setup:**

1. Sign up at [Plaid Dashboard](https://dashboard.plaid.com/signup)
2. Verify email and phone
3. Go to Team Settings > Keys
4. Copy credentials for Sandbox environment
5. Add to `.env.local`:

```env
PLAID_CLIENT_ID="your_client_id"
PLAID_SECRET="your_sandbox_secret"
PLAID_ENV="sandbox"
NEXT_PUBLIC_PLAID_ENV="sandbox"
```

**Testing with Sandbox:**

- Username: `user_good`
- Password: `pass_good`
- MFA: `1234`

**Production Setup:**

1. Complete Plaid onboarding
2. Submit compliance questionnaire
3. Get approved for Production
4. Update environment to `production`
5. Use production secret

### 4. Stripe (Payments)

**Purpose:** Process subscription payments

**Setup:**

1. Sign up at [Stripe](https://stripe.com)
2. Go to Developers > API keys
3. Copy Test keys for development
4. Create products and prices:
   - Go to Products > Add Product
   - Create: Basic ($79/year), Plus ($99/year), Family ($149/year)
   - Copy price IDs
5. Add to `.env.local`:

```env
STRIPE_SECRET_KEY="sk_test_xxxxx"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_xxxxx"
STRIPE_WEBHOOK_SECRET="whsec_xxxxx"
STRIPE_PRICE_ID_BASIC_YEARLY="price_xxxxx"
STRIPE_PRICE_ID_PLUS_YEARLY="price_xxxxx"
STRIPE_PRICE_ID_FAMILY_YEARLY="price_xxxxx"
```

**Webhook Setup:**

1. Go to Developers > Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events:
   - `customer.subscription.*`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy webhook signing secret

**Local Testing with Stripe CLI:**

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe  # macOS
# Or download from https://stripe.com/docs/stripe-cli

# Login
stripe login

# Forward webhooks to local
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Copy webhook signing secret to .env.local
```

### 5. Resend (Email Service)

**Purpose:** Send transactional emails

**Setup:**

1. Sign up at [Resend](https://resend.com)
2. Verify your domain (or use test domain for development)
3. Go to API Keys > Create API Key
4. Add to `.env.local`:

```env
RESEND_API_KEY="re_xxxxx"
RESEND_FROM_EMAIL="FinanceOS <noreply@yourdomain.com>"
```

**Domain Verification:**

1. Add DNS records provided by Resend
2. Wait for verification (usually 5-10 minutes)
3. Test with: `curl https://api.resend.com/domains/[domain-id]`

**Alternative: SendGrid:**

```env
SENDGRID_API_KEY="SG.xxxxx"
SENDGRID_FROM_EMAIL="noreply@yourdomain.com"
```

### 6. AWS S3 (File Storage)

**Purpose:** Store receipt images and generated reports

**Setup:**

1. Sign up at [AWS](https://aws.amazon.com/)
2. Go to IAM > Users > Create User
3. Attach policy: `AmazonS3FullAccess` (or create custom policy)
4. Create access key
5. Go to S3 > Create Bucket
   - Name: `financeos-user-uploads-production`
   - Region: `us-east-1` (or your choice)
   - Block public access: ON (we'll use signed URLs)
6. Add CORS configuration:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["http://localhost:3000", "https://yourdomain.com"],
    "ExposeHeaders": ["ETag"]
  }
]
```

7. Add to `.env.local`:

```env
AWS_ACCESS_KEY_ID="AKIAXXXXX"
AWS_SECRET_ACCESS_KEY="xxxxx"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="financeos-user-uploads-production"
```

**Alternative: Cloudinary:**

```env
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="xxxxx"
CLOUDINARY_API_SECRET="xxxxx"
```

### 7. Sentry (Error Tracking)

**Purpose:** Monitor errors and performance

**Setup:**

1. Sign up at [Sentry](https://sentry.io)
2. Create new project (Next.js)
3. Copy DSN
4. Add to `.env.local`:

```env
SENTRY_DSN="https://xxxxx@xxxxx.ingest.sentry.io/xxxxx"
SENTRY_ORG="your-org"
SENTRY_PROJECT="financeos"
```

5. Install Sentry wizard:

```bash
npx @sentry/wizard@latest -i nextjs
```

---

## Running the Application

### Development Mode

```bash
# Start development server with hot reload
npm run dev

# Open in browser
# http://localhost:3000
```

**Development Features:**
- Hot module replacement
- Error overlay
- TypeScript type checking
- Auto-refresh on file changes

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start

# Or do both
npm run build && npm start
```

### Database GUI

```bash
# Open Prisma Studio (visual database editor)
npx prisma studio

# Opens at http://localhost:5555
```

---

## Testing

### Type Checking

```bash
# Check TypeScript types
npm run type-check
```

### Linting

```bash
# Run ESLint
npm run lint

# Auto-fix issues
npm run lint:fix
```

### Unit Tests (Once implemented)

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### E2E Tests (Once implemented)

```bash
# Run Playwright tests
npm run test:e2e

# Run in UI mode
npm run test:e2e:ui
```

---

## Deployment

### Vercel (Recommended)

**Automatic Deployment:**

1. Push code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Vercel auto-detects Next.js
5. Add environment variables in project settings
6. Deploy!

**Manual Deployment:**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

**Environment Variables:**

1. Go to Project Settings > Environment Variables
2. Add all variables from `.env.example`
3. Use production values for:
   - `DATABASE_URL` (hosted database)
   - `PLAID_ENV=production`
   - Stripe live keys
   - Production OAuth credentials

### Railway

1. Sign up at [Railway](https://railway.app)
2. New Project > Deploy from GitHub
3. Add PostgreSQL service
4. Add environment variables
5. Deploy

### Docker Deployment

**Build Docker image:**

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1
RUN npx prisma generate
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

**Build and run:**

```bash
# Build image
docker build -t financeos .

# Run container
docker run -p 3000:3000 --env-file .env financeos
```

### Post-Deployment Checklist

- [ ] Database migrations applied
- [ ] Environment variables set
- [ ] OAuth redirect URIs updated with production URL
- [ ] Stripe webhook endpoint configured
- [ ] Plaid webhook endpoint configured
- [ ] Domain configured with SSL
- [ ] Sentry configured
- [ ] Email service verified
- [ ] S3 bucket CORS configured
- [ ] Test authentication flows
- [ ] Test payment flows
- [ ] Monitor error rates

---

## Troubleshooting

### Common Issues

#### Database Connection Fails

**Error:** `Can't reach database server`

**Solutions:**
```bash
# Check PostgreSQL is running
docker ps  # for Docker
pg_ctl status  # for native PostgreSQL

# Check connection string format
# postgresql://USER:PASSWORD@HOST:PORT/DATABASE

# Test connection
psql "postgresql://postgres:password@localhost:5432/financeos_dev"
```

#### Prisma Generate Fails

**Error:** `Prisma schema validation failed`

**Solutions:**
```bash
# Format schema
npx prisma format

# Validate schema
npx prisma validate

# Clear Prisma cache
rm -rf node_modules/.prisma

# Regenerate
npx prisma generate
```

#### OAuth Not Working

**Error:** `redirect_uri_mismatch`

**Solutions:**
1. Check redirect URI in provider console matches exactly:
   - `http://localhost:3000/api/auth/callback/google`
   - No trailing slash
   - Correct protocol (http vs https)
2. Clear browser cookies
3. Check `NEXTAUTH_URL` in `.env.local`

#### Plaid Link Won't Open

**Error:** Plaid Link button doesn't open modal

**Solutions:**
1. Check `NEXT_PUBLIC_PLAID_ENV` is set
2. Verify `PLAID_CLIENT_ID` in `.env.local`
3. Check browser console for errors
4. Test with sandbox credentials:
   - Username: `user_good`
   - Password: `pass_good`

#### Stripe Webhooks Failing

**Error:** `Webhook signature verification failed`

**Solutions:**
```bash
# Use Stripe CLI for local testing
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Copy webhook signing secret to .env.local
# Make sure endpoint is publicly accessible in production
```

#### Build Errors

**Error:** `Type error: ...`

**Solutions:**
```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules
rm -rf node_modules
npm install

# Check TypeScript
npm run type-check
```

#### Port Already in Use

**Error:** `Port 3000 is already in use`

**Solutions:**
```bash
# Find process using port 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows

# Or use different port
PORT=3001 npm run dev
```

---

## Common Commands

### Project Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run type checking
npm run type-check

# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format
```

### Database Commands

```bash
# Generate Prisma Client
npx prisma generate

# Create and apply migration
npx prisma migrate dev --name migration_name

# Apply migrations (production)
npx prisma migrate deploy

# Reset database (WARNING: deletes data)
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio

# Seed database
npx prisma db seed

# Push schema without migration
npx prisma db push

# Pull schema from database
npx prisma db pull

# Format schema file
npx prisma format

# Validate schema
npx prisma validate
```

### Git Commands

```bash
# Clone repository
git clone <repo-url>

# Create new branch
git checkout -b feature/feature-name

# Stage changes
git add .

# Commit changes
git commit -m "Description of changes"

# Push to remote
git push origin branch-name

# Pull latest changes
git pull origin main

# View status
git status

# View commit history
git log --oneline
```

### Docker Commands

```bash
# Start PostgreSQL container
docker run -d --name financeos-postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 postgres:16

# Stop container
docker stop financeos-postgres

# Start container
docker start financeos-postgres

# View logs
docker logs financeos-postgres

# Remove container
docker rm financeos-postgres

# List running containers
docker ps

# List all containers
docker ps -a
```

---

## Next Steps

After completing setup:

1. **Review Documentation:**
   - Read `FINANCEOS_ROADMAP.md` for development phases
   - Check `TECH_STACK_DECISIONS.md` for architecture details
   - Review `API_ENDPOINTS.md` for API documentation

2. **Start Development:**
   - Begin with Phase 1: Foundation & Authentication
   - Follow `HANDOFF_TEMPLATE.md` for progress tracking

3. **Join Community:**
   - [Discord](https://discord.gg/financeos) (if available)
   - [GitHub Discussions](https://github.com/your-repo/discussions)

---

## Support

- **Documentation:** Check all `.md` files in root directory
- **Issues:** [GitHub Issues](https://github.com/your-repo/issues)
- **Email:** support@financeos.com

---

**Last Updated:** November 18, 2025

**Questions or issues?** Open an issue on GitHub or contact the development team.

Happy coding! 🚀
