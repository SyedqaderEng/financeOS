# FinanceOS - Personal Finance Management Application

> Comprehensive personal finance management. Track expenses, manage budgets, set goals, and gain insights into your financial health.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.7-green)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38bdf8)](https://tailwindcss.com/)

## 🚀 Features

- **📊 Advanced Analytics** - Visualize spending patterns, income trends, and net worth growth
- **💳 Bank Sync** - Automatically sync transactions from 10,000+ banks (Plaid)
- **🎯 Smart Budgets** - Flexible budgets with rollover support and alerts
- **🎁 Savings Goals** - Track progress with automatic contribution calculations
- **📈 Investment Tracking** - Monitor portfolio, gains/losses, and asset allocation
- **🔐 Bank-Level Security** - End-to-end encryption and industry-standard security

## 📋 Project Status

**Current Phase:** Phase 1 - Foundation & Authentication (In Progress)

**Completed:**
- ✅ Phase 0: Architecture Review & Roadmap Creation
- ✅ Next.js 14 project structure
- ✅ TypeScript strict mode configuration
- ✅ Tailwind CSS with shadcn/ui theming
- ✅ Landing page with full design
- ✅ Database schema (Prisma)
- ✅ Utility functions and validations
- ⏳ Authentication system (In Progress)

**Next Steps:**
- NextAuth.js v5 configuration
- Login/Signup pages
- Email verification flow
- Google & Apple OAuth

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (Strict Mode)
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui (Radix UI)
- **State Management:** Zustand + TanStack Query
- **Charts:** Chart.js with React Chart.js 2
- **Forms:** React Hook Form + Zod validation
- **Theme:** next-themes (dark/light mode)

### Backend
- **Runtime:** Node.js 18+
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** NextAuth.js v5
- **Validation:** Zod

### Third-Party Services
- **Bank Integration:** Plaid
- **Payments:** Stripe
- **Email:** Resend
- **File Storage:** AWS S3
- **Error Tracking:** Sentry

## 📁 Project Structure

```
financeOS/
├── app/                      # Next.js 14 App Router
│   ├── (auth)/              # Authentication pages
│   ├── (dashboard)/         # Protected app routes
│   ├── api/                 # API routes
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Landing page
│   └── globals.css          # Global styles
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── providers/           # Context providers
│   └── [features]/          # Feature-specific components
├── lib/
│   ├── db.ts                # Prisma client
│   ├── auth.ts              # NextAuth configuration
│   ├── utils.ts             # Utility functions
│   ├── validations.ts       # Zod schemas
│   └── constants.ts         # App constants
├── hooks/                   # Custom React hooks
├── types/                   # TypeScript type definitions
├── prisma/
│   └── schema.prisma        # Database schema
├── public/                  # Static assets
├── FINANCEOS_ROADMAP.md     # Development roadmap
├── TECH_STACK_DECISIONS.md  # Architecture decisions
├── API_ENDPOINTS.md         # API documentation
├── SETUP_INSTRUCTIONS.md    # Setup guide
└── .env.example             # Environment variables template
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18.17 or later
- PostgreSQL 14 or later
- npm 9.0 or later

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/financeOS.git
   cd financeOS
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your values (see SETUP_INSTRUCTIONS.md for details)

4. **Set up the database**
   ```bash
   # Run migrations
   npx prisma migrate dev

   # Generate Prisma Client
   npx prisma generate

   # (Optional) Seed database
   npx prisma db seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open http://localhost:3000**

### Quick Start with Docker

```bash
# Start PostgreSQL
docker run -d \
  --name financeos-postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  postgres:16

# Run the app
npm install
npx prisma migrate dev
npm run dev
```

## 📚 Documentation

- **[Setup Instructions](./SETUP_INSTRUCTIONS.md)** - Complete setup and deployment guide
- **[API Documentation](./API_ENDPOINTS.md)** - All 85+ API endpoints
- **[Roadmap](./FINANCEOS_ROADMAP.md)** - 10-phase development plan
- **[Tech Stack Decisions](./TECH_STACK_DECISIONS.md)** - Architecture and technology choices
- **[Environment Variables](./.env.example)** - Configuration template

## 🧪 Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm start                # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run type-check       # TypeScript type checking
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting

# Database
npm run db:generate      # Generate Prisma Client
npm run db:migrate       # Run database migrations
npm run db:push          # Push schema changes (dev)
npm run db:studio        # Open Prisma Studio
npm run db:seed          # Seed database
npm run db:reset         # Reset database (WARNING: deletes data)
```

## 🔐 Environment Variables

Required environment variables:

```env
# Database
DATABASE_URL="postgresql://..."

# Authentication
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"

# OAuth (Optional for Phase 1)
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
APPLE_ID="..."

# Third-Party Services (Phase 9)
PLAID_CLIENT_ID="..."
PLAID_SECRET="..."
STRIPE_SECRET_KEY="..."
RESEND_API_KEY="..."
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
```

See [.env.example](./.env.example) for complete list.

## 🤝 Contributing

This is a personal project currently under development. Phase 1 is in progress.

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Prisma](https://www.prisma.io/)
- [Plaid](https://plaid.com/)
- [Stripe](https://stripe.com/)

## 📞 Support

For questions or issues:
- Check [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md)
- Review [API Documentation](./API_ENDPOINTS.md)
- Create an issue on GitHub

---

**Built with ❤️ using Next.js 14 and TypeScript**

**Current Progress:** Phase 1 of 10 (Foundation & Authentication)
