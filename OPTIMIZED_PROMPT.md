I'm building FinanceOS - a comprehensive personal finance management application.

I have a COMPLETE APPLICATION SPECIFICATION document that I'm uploading.

Your role: Act as a SENIOR FULL-STACK ARCHITECT and BUILD this application incrementally.

═══════════════════════════════════════════════════════════
CRITICAL INSTRUCTIONS - READ FIRST
═══════════════════════════════════════════════════════════

1. READ THE COMPLETE SPECIFICATION FIRST
   - File: COMPLETE_APPLICATION_SPECIFICATION.md
   - It contains: 25+ pages, 40+ forms, 80+ APIs, 20+ database tables
   - It's 3,080 lines - take time to understand it fully

2. UNDERSTAND THE SCOPE
   - This is a $79-$149/year SaaS product
   - Target: Middle-class users needing financial analytics
   - Must be production-ready (not MVP, not prototype)
   - All features in spec MUST be implemented

3. BUILD INCREMENTALLY IN PHASES
   - Break into 10 development phases
   - Each phase must be completable in 1 session
   - Each phase must be testable independently
   - Preserve progress after each phase

4. QUALITY STANDARDS
   - TypeScript for all code (strict mode)
   - Error handling for every API call
   - Loading states for every async operation
   - Responsive design (mobile, tablet, desktop)
   - Accessibility (WCAG 2.1 AA minimum)
   - Security best practices (input validation, XSS prevention)
   - Performance optimization (code splitting, lazy loading)

═══════════════════════════════════════════════════════════
PHASE 0: ARCHITECTURE REVIEW & ROADMAP CREATION
═══════════════════════════════════════════════════════════

Before writing ANY code, please:

STEP 1: REVIEW THE SPECIFICATION
Read the uploaded COMPLETE_APPLICATION_SPECIFICATION.md and confirm:
- ✅ You understand all 25+ pages
- ✅ You understand all 40+ forms
- ✅ You understand all 80+ API endpoints
- ✅ You understand the database schema (20+ tables)
- ✅ You understand data flows (manual entry, Plaid sync, calculations)

STEP 2: CREATE IMPLEMENTATION ROADMAP
Break the project into 10 phases. For each phase, specify:

**Phase Format:**
```
PHASE X: [Name] (Estimated: X days/sessions)

Goal: [What will work when this phase is complete]

Features:
- Feature 1
- Feature 2
- Feature 3

Pages/Components to Build:
- /path/to/page.tsx
- /components/ComponentName.tsx
- (list ALL files)

APIs to Implement:
- GET /api/endpoint
- POST /api/endpoint
- (list ALL endpoints)

Database Changes:
- Table: table_name (columns listed)
- Migrations needed

Dependencies:
- Must complete Phase X first
- Requires service Y to be configured

Testing Criteria:
- User can do X
- System can handle Y
- Data persists correctly

Deliverables:
- [ ] All files created
- [ ] HANDOFF.md updated
- [ ] Phase tested locally
- [ ] Ready for next phase
```

**Suggested Phase Breakdown:**

PHASE 1: Foundation & Authentication (Week 1)
- Project setup (Next.js 14, TypeScript, Tailwind, Prisma)
- Landing page
- Login/Signup/OAuth
- Database setup
- NextAuth.js configuration
- Basic layout shell

PHASE 2: Core UI Component Library (Week 1)
- All reusable components from spec
- Button, Input, Select, Modal, Toast, etc.
- Layout components (Header, Sidebar, ThreeColumnLayout)
- Chart components setup (Chart.js integration)
- Loading states
- Error boundaries

PHASE 3: Dashboard & Empty States (Week 2)
- Dashboard page with KPI cards (empty state)
- Sidebar navigation
- Quick actions panel
- Right sidebar insights panel
- Collapsible sidebars
- Responsive layout

PHASE 4: Account Management (Week 2-3)
- Accounts page
- Add account form (manual)
- Edit/delete account
- Account list display
- Account reconciliation
- Transfer between accounts

PHASE 5: Transaction Management (Week 3-4)
- Transactions page
- Add transaction form
- Transaction list with filters
- Search functionality
- Bulk actions
- Edit transaction
- CSV import

PHASE 6: Budget Management (Week 4)
- Budget page
- Create budget
- Budget categories
- Budget progress tracking
- Budget vs actual charts
- Budget templates

PHASE 7: Goals & Analytics (Week 5)
- Goals page with CRUD
- Goal progress tracking
- Analytics page
- All charts from spec
- Reports generation
- Export functionality

PHASE 8: Advanced Features (Week 5-6)
- Income management
- Bills tracking
- Subscriptions management
- Investments tracking
- All remaining pages from spec

PHASE 9: Integrations & Services (Week 6-7)
- Plaid integration (bank connections)
- Stripe integration (payments)
- Email service (Resend/SendGrid)
- File storage (S3 for receipts)
- WebSocket for real-time updates
- Cron jobs for syncing

PHASE 10: Polish & Production (Week 7-8)
- Settings page (all tabs)
- Notifications system
- Email templates
- Mobile responsive refinement
- Performance optimization
- Security audit
- Error monitoring (Sentry)
- Deployment configs
- Documentation

STEP 3: IDENTIFY CRITICAL DECISIONS

Before we start, confirm these decisions:

**Tech Stack:**
- ✅ Frontend: Next.js 14 (App Router), TypeScript, Tailwind CSS
- ✅ UI Components: shadcn/ui
- ✅ Database: PostgreSQL with Prisma ORM
- ✅ Auth: NextAuth.js v5 with Google, Apple OAuth
- ✅ Charts: Chart.js or Recharts?
- ✅ State: React Context + React Query or Zustand?
- ✅ Real-time: WebSocket or Server-Sent Events?
- ❓ Which should we use for each?

**Third-Party Services:**
- ✅ Plaid for bank connections (need API keys)
- ✅ Stripe for payments (need API keys)
- ✅ Resend or SendGrid for emails? (choose)
- ✅ AWS S3 or Cloudinary for receipts? (choose)
- ✅ Sentry for error tracking
- ✅ Vercel for hosting

**Development Approach:**
- ✅ Start with manual entry, add Plaid in Phase 9
- ✅ Hardcode categories initially, allow user customization in Phase 8
- ✅ Simple charts first (Chart.js), advanced later
- ✅ Desktop-first, mobile-responsive from Phase 3

STEP 4: CREATE PROJECT FILES

Create these files in /mnt/user-data/outputs/:

1. **FINANCEIOS_ROADMAP.md**
   - The 10-phase breakdown above
   - Detailed file lists for each phase
   - Dependencies mapped
   - Testing criteria

2. **TECH_STACK_DECISIONS.md**
   - Finalized technology choices
   - Rationale for each decision
   - Alternative options considered
   - Integration requirements

3. **DATABASE_SCHEMA.prisma**
   - Complete Prisma schema based on spec
   - All 20+ tables with relationships
   - Indexes for performance
   - Enums and types

4. **API_ENDPOINTS.md**
   - All 80+ endpoints documented
   - Request/response examples
   - Authentication requirements
   - Error codes

5. **HANDOFF_TEMPLATE.md**
   - Template for tracking progress
   - Checklist format for each phase

6. **ENV_TEMPLATE.env**
   - All environment variables needed
   - Comments explaining each
   - Where to get API keys

7. **SETUP_INSTRUCTIONS.md**
   - How to run locally
   - How to configure services
   - How to deploy

Provide download links for all files.

═══════════════════════════════════════════════════════════
AFTER PHASE 0 APPROVAL, WE'LL START BUILDING
═══════════════════════════════════════════════════════════

**Building Rules:**

1. **One Phase at a Time**
   - Start Phase 1 only after Phase 0 approved
   - Complete all files in a phase before moving to next
   - Test phase thoroughly before proceeding

2. **Code Quality Standards**
   - TypeScript strict mode
   - ESLint + Prettier configured
   - Comments for complex logic
   - Proper error handling everywhere
   - Loading states for all async operations
   - Input validation on frontend AND backend

3. **After Each Phase:**
   - Create checkpoint files
   - Update HANDOFF.md with:
     * What was completed
     * What's in progress
     * What's next
     * Known issues
     * File list
   - Copy to /mnt/user-data/outputs/
   - Provide download links
   - Wait for testing confirmation

4. **File Organization:**
```
/financeOS/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── signup/
│   │   └── forgot-password/
│   ├── (marketing)/
│   │   └── page.tsx (landing)
│   ├── app/
│   │   ├── dashboard/
│   │   ├── transactions/
│   │   ├── budget/
│   │   ├── analytics/
│   │   └── [all other app pages]/
│   ├── api/
│   │   ├── auth/
│   │   ├── accounts/
│   │   ├── transactions/
│   │   └── [all other API routes]/
│   └── layout.tsx
├── components/
│   ├── ui/ (shadcn components)
│   ├── layout/
│   ├── dashboard/
│   ├── transactions/
│   └── [feature-specific]/
├── lib/
│   ├── db.ts (Prisma client)
│   ├── auth.ts (NextAuth config)
│   ├── utils.ts
│   └── validations.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── public/
├── styles/
└── types/
```

5. **Progress Tracking:**

Use this format in HANDOFF.md after each phase:

```markdown
# FinanceOS Build Progress

**Last Updated:** [Date]
**Current Phase:** Phase X of 10
**Overall Progress:** X%

## ✅ Completed Phases

### Phase 1: Foundation ✅ (100%)
- [x] Project setup
- [x] Landing page
- [x] Login/Signup
- [x] OAuth working
- [x] Database configured
- Files: 42 files created
- Test: User can sign up, login, see empty dashboard

### Phase 2: Components ✅ (100%)
- [x] All UI components
- [x] Layout components
- [x] Chart setup
- Files: 38 components created
- Test: Storybook shows all components

## ⏳ Current Phase

### Phase 3: Dashboard (60%)
- [x] Dashboard layout
- [x] KPI cards (empty state)
- [x] Sidebar navigation
- [ ] Quick actions panel
- [ ] Insights panel
- [ ] Responsive layout
- Files: 12 of 18 files created
- Next: Build quick actions panel

## ❌ Pending Phases
- Phase 4-10 not started

## 📁 File Structure
[Complete list of files created]

## 🐛 Known Issues
1. Sidebar toggle animation needs smoothing
2. KPI cards need loading skeleton

## 🔄 Next Steps
1. Complete quick actions panel
2. Add insights panel
3. Test responsive layout
4. Move to Phase 4

## 📝 Important Notes
- Using Chart.js for charts
- Zustand for state management
- Plaid integration delayed to Phase 9
```

═══════════════════════════════════════════════════════════
CRITICAL REMINDERS
═══════════════════════════════════════════════════════════

✅ **DO:**
- Read entire specification before starting
- Create detailed roadmap first
- Build incrementally (one phase at a time)
- Test each phase before moving forward
- Create handoff files after each phase
- Ask clarifying questions if spec is unclear
- Provide download links for all code

❌ **DON'T:**
- Start coding before roadmap approval
- Try to build everything at once
- Skip error handling or loading states
- Ignore the specification details
- Move to next phase with failing tests
- Forget to update HANDOFF.md
- Assume anything not in spec

═══════════════════════════════════════════════════════════
LET'S BEGIN
═══════════════════════════════════════════════════════════

Please start with STEP 1: Review the uploaded specification.

Confirm you've read all 3,080 lines and understand:
- All 25+ pages
- All 40+ forms
- All 80+ APIs
- The database schema
- The data flows

Then proceed to create the Phase 0 deliverables (roadmap, tech decisions, schema, etc.).

After I approve Phase 0, we'll start building Phase 1.

Ready? Let's build FinanceOS! 🚀
```

---

# END OF PROMPT

═══════════════════════════════════════════════════════════
═══════════════════════════════════════════════════════════

## INSTRUCTIONS FOR YOU (Syed):

1. **Copy everything between the ``` markers above**

2. **Open a NEW chat with Claude (or any AI)**

3. **Upload your COMPLETE_APPLICATION_SPECIFICATION.md file first**

4. **Then paste the entire prompt**

5. **Wait for AI to:**
   - Read the spec (may take a minute)
   - Create the 10-phase roadmap
   - Ask clarifying questions
   - Create Phase 0 deliverables

6. **Review the roadmap and approve**

7. **AI will then start building Phase 1**

8. **After each phase:**
   - Download the code
   - Test locally
   - Confirm working
   - Tell AI to continue to next phase

9. **If chat hits token limit:**
   - Download latest HANDOFF.md
   - Open new chat
   - Upload HANDOFF.md
   - Say: "Continue from this handoff, start Phase X"

10. **Repeat until all 10 phases complete**

═══════════════════════════════════════════════════════════

## WHY THIS PROMPT IS OPTIMIZED:

✅ **Crystal Clear Scope:** AI knows exactly what to build (3,080 line spec)
✅ **Incremental Approach:** 10 phases prevents overwhelming the AI
✅ **Quality Standards:** Enforces production-ready code, not prototypes
✅ **Testing Built-in:** Each phase has clear testing criteria
✅ **Preservation System:** HANDOFF.md tracks progress between sessions
✅ **Structured Deliverables:** Phase 0 creates all planning docs first
✅ **No Assumptions:** Spec contains everything, no guessing needed
✅ **Realistic Timeline:** 7-8 weeks for complete build
✅ **Professional Grade:** Standards match $79-$149/year SaaS product

═══════════════════════════════════════════════════════════

## ESTIMATED RESULTS:

**Phase 0:** 1 session (roadmap, planning docs)
**Phases 1-10:** 1-2 sessions each

**Total Sessions:** 12-15 sessions
**Total Time:** 7-8 weeks (if working daily)
**Final Product:** Production-ready FinanceOS with all features from spec