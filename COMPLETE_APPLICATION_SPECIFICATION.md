COMPLETE APPLICATION SPECIFICATION
FinanceOS - Data-Rich Analytical Finance Management App
Based on: finance-app-analytical-demo.html
Target Price: $79-$149/year
Target Users: Middle-class users seeking comprehensive financial analytics

1. COMPLETE PAGE INVENTORY
Authentication Pages

 Landing Page (/)

Hero section with ROI messaging ("Save $6,000/year")
Feature showcase (3-panel layout, analytics, reports)
Pricing comparison table
Testimonials section
FAQ section
Footer with links
CTA buttons: "Start 30-Day Free Trial"


 Login Page (/login)

Email input field
Password input field (with show/hide toggle)
"Remember me" checkbox
"Forgot password?" link
Social login buttons (Google, Apple)
"Don't have an account? Sign up" link
Error message display area


 Signup Page (/signup)

Full name input
Email input with validation
Password input with strength meter
Confirm password input
Terms & Privacy Policy checkbox
Newsletter opt-in checkbox (optional)
Social signup buttons (Google, Apple)
"Already have an account? Login" link
Plan selection (Basic/Plus/Family)


 Forgot Password Page (/forgot-password)

Email input field
Submit button
"Back to login" link
Success message display


 Reset Password Page (/reset-password/:token)

New password input with strength meter
Confirm new password input
Submit button
Token expiration handling
Success redirect to login


 Email Verification Page (/verify-email/:token)

Verification status display
Success message with redirect countdown
Resend verification email button
Support contact link


 OAuth Callback Pages

/auth/google/callback - Google OAuth handler
/auth/apple/callback - Apple OAuth handler
Loading state during authentication
Error handling for failed auth



Main Application Pages

 Dashboard (/app/dashboard)

4 KPI cards (Net Worth, Monthly Income, Expenses, Savings Rate)
Cash flow analysis chart (line chart with income/expenses)
Recent transactions table (top 5)
Quick actions section
Insights panel (right sidebar)
Budget progress indicators
Collapsible left/right sidebars


 Transactions Page (/app/transactions)

Advanced filter panel (date range, category, account, amount range, status)
Search bar (real-time search)
Sortable data table (date, merchant, category, account, amount, status)
Pagination (50/100/200 per page options)
Bulk actions (categorize, delete, export)
Add transaction button (opens modal)
Edit transaction (inline or modal)
Transaction details drawer (right panel)
Export options (CSV, Excel, PDF)
Monthly/weekly grouping toggle
Attachments column (receipts)


 Budget Management Page (/app/budget)

Budget period selector (weekly, monthly, yearly)
Budget methodology selector (zero-based, 50/30/20, envelope)
3 summary cards (Budgeted, Spent, Remaining)
Category breakdown table with progress bars
Visual budget allocation chart (pie/donut)
Category management (add, edit, delete, reorder)
Budget vs actual comparison chart
Historical budget performance
Budget templates library
Rollover settings per category


 Analytics Page (/app/analytics)

Time period selector (1M, 3M, 6M, 1Y, All, Custom)
Net worth trend chart (area chart)
Income vs expenses trend (dual-axis line chart)
Spending by category (horizontal bar chart)
Monthly comparison chart
Cash flow forecast (predictive chart)
Savings rate over time
Top merchants table
Unusual spending alerts
Export dashboard as PDF


 Reports Page (/app/reports)

Report templates library:

Monthly summary report
Tax preparation report
Net worth statement
Cash flow statement
Spending analysis report
Budget variance report


Custom report builder
Date range selector
Report preview
Download options (PDF, Excel, CSV)
Scheduled reports (email delivery)
Saved reports history


 Investments Page (/app/investments)

Portfolio overview (total value, gain/loss, allocation)
Holdings table (symbol, shares, cost basis, current value, gain/loss %)
Asset allocation pie chart
Performance chart (1D, 1W, 1M, 3M, 6M, 1Y, All)
Dividend tracker
Cost basis calculator
Investment goals section
Manual holding entry form
API connection for auto-sync (if available)


 Income Management Page (/app/income)

Income sources summary cards (Total Monthly, YTD, Active Streams)
Income sources table (source, type, frequency, amount, YTD, status)
Add income source form
Edit income source modal
Income forecast chart
Income vs expenses comparison
Irregular income tracker
Tax withholding calculator


 Goals Page (/app/goals)

Goals summary cards (Total Goals, Total Saved, Target Amount)
Goal cards with progress bars:

Goal name & emoji
Target amount
Current amount
Percentage complete
Target date
Monthly contribution calculator


Create goal modal (name, target, date, contribution frequency)
Edit goal functionality
Goal progress over time chart
Milestone celebrations
Goal templates (Emergency Fund, Vacation, House, Car, etc.)


 Bills Management Page (/app/bills)

Upcoming bills calendar view
Bills list table (name, due date, amount, status, auto-pay)
Add bill form
Bill reminders settings
Paid bills history
Recurring bills setup
Bill payment tracking
Average monthly bills calculation
Bill due date alerts


 Subscriptions Page (/app/subscriptions)

Active subscriptions card grid (name, cost, billing cycle, next charge)
Total monthly/yearly subscription cost
Subscription categories (Entertainment, Productivity, etc.)
Add subscription form
Cancel subscription tracking
Unused subscriptions alerts
Subscription renewal calendar
Free trial expiration reminders
Subscription comparison tool


 Accounts Page (/app/accounts)

Account list with balances:

Checking accounts
Savings accounts
Credit cards
Investment accounts
Loans
Other assets


Add account manually form
Link bank account via Plaid
Account sync status
Edit account details
Hide/unhide accounts
Account reconciliation tool
Account history chart
Transfer between accounts


 Settings Page (/app/settings)

Tabs: Profile, Security, Preferences, Billing, Notifications
Profile Tab:

Avatar upload
Name, email fields
Phone number
Timezone
Currency preference
Fiscal year start


Security Tab:

Change password form
Two-factor authentication setup
Active sessions list
Login history
Trusted devices


Preferences Tab:

Theme (light/dark/auto)
Language selection
Date format
Number format
Default dashboard view
Email preferences


Billing Tab:

Current plan display
Upgrade/downgrade options
Payment method management
Billing history
Invoices download
Cancel subscription


Notifications Tab:

Email notification toggles
Push notification toggles
SMS notification settings
Budget alerts configuration
Bill reminders settings




 Profile Page (/app/profile)

User avatar and banner
Account statistics overview
Recent activity feed
Connected accounts status
Quick links to settings


 Notifications Page (/app/notifications)

All notifications list (grouped by date)
Notification types:

Budget alerts
Bill reminders
Goal milestones
Large transactions
Unusual activity
Account sync errors
System updates


Mark as read/unread
Archive notifications
Notification filters
Clear all button


 Help/Support Page (/app/help)

Knowledge base search
FAQ accordion
Getting started guides
Video tutorials
Contact support form
Live chat widget
Feature request form
Bug report form
Community forum link


 Pricing/Upgrade Page (/app/pricing)

Current plan indicator
3-tier pricing cards (Basic $79, Plus $99, Family $149)
Feature comparison table
ROI calculator
Upgrade CTA
Downgrade option
Annual vs monthly toggle
Family member management (if Family plan)



Utility Pages

 404 Not Found (/404)

Friendly error message
Search bar
Popular pages links
Back to dashboard button
Contact support link


 500 Server Error (/500)

Error message
Error ID for support
Retry button
Status page link
Report issue button


 503 Maintenance Mode (/maintenance)

Maintenance message
Estimated return time
Subscribe to updates form
Social media links
Status page link


 Onboarding Flow (/onboarding)

Step 1: Welcome - App overview
Step 2: Connect Accounts - Plaid integration or manual entry
Step 3: Set Budget - Quick budget setup wizard
Step 4: Create First Goal - Savings goal creation
Step 5: Customize Dashboard - Widget preferences
Progress indicator (5 steps)
Skip option
Save & continue buttons



Empty States (Component-level)

 Dashboard Empty State

"Welcome to FinanceOS" message
"Get started" checklist:

Connect your first account
Add a transaction
Set up your budget
Create a savings goal


Video tutorial embed
Sample data toggle option


 Transactions Empty State

"No transactions yet" illustration
Add transaction button (prominent)
Import transactions option
Connect bank account CTA


 Budget Empty State

"Create your first budget" message
Budget templates showcase
Quick setup wizard CTA
Why budgeting matters content


 Goals Empty State

"Set your first goal" illustration
Popular goals examples
Create goal button
Goal calculator tool


 Investments Empty State

"Track your investments" message
Add holding manually
Connect brokerage account
Investment education links


 Search No Results

"No results found for '{query}'"
Search suggestions
Clear search button
Browse all categories link




2. COMPLETE FORM INVENTORY
Authentication Forms

 Login Form

Fields:

Email (required, email validation)
Password (required, min 8 characters)
Remember me (checkbox)


Buttons: Login (primary), Continue with Google, Continue with Apple
Validation: Real-time email format, required fields
Error handling: Invalid credentials, account locked, email not verified
Success: Redirect to /app/dashboard


 Signup Form

Fields:

Full name (required, 2-50 characters)
Email (required, email validation, uniqueness check)
Password (required, strength meter: 8+ chars, uppercase, lowercase, number, symbol)
Confirm password (required, must match)
Terms & Privacy checkbox (required)
Newsletter opt-in (optional)


Buttons: Create Account (primary), Continue with Google, Continue with Apple
Validation: Real-time for all fields, async email availability check
Error handling: Email already exists, weak password, terms not accepted
Success: Email verification sent, redirect to /verify-email-prompt


 Forgot Password Form

Fields:

Email (required, email validation)


Buttons: Send Reset Link (primary), Back to Login (secondary)
Validation: Email format
Error handling: Email not found (show success anyway for security)
Success: Show success message, check email prompt


 Reset Password Form

Fields:

New password (required, strength meter)
Confirm new password (required, must match)


Buttons: Reset Password (primary)
Validation: Password strength, match confirmation
Error handling: Token expired, token invalid, passwords don't match
Success: Password updated, redirect to login with success message



Account Management Forms

 Add Account Form (Manual)

Fields:

Account type (dropdown: Checking, Savings, Credit Card, Investment, Loan, Other)
Account name (required, e.g., "Chase Checking")
Institution name (autocomplete from common banks)
Account number (last 4 digits, optional)
Current balance (required, currency input)
Currency (dropdown, default USD)
Account color (color picker for visual identification)
Notes (textarea, optional)


Buttons: Add Account (primary), Cancel (secondary)
Validation: Required fields, balance format, unique account name
Success: Account added, redirect to accounts page with success toast


 Link Bank Account Form (Plaid)

Flow:

Click "Link Bank Account" button
Plaid Link modal opens
User selects institution
User enters credentials in Plaid interface
User selects accounts to link
Plaid returns access token


Backend handling:

Exchange public token for access token
Fetch account data
Store encrypted access token
Sync initial transactions


Success: Accounts linked, initial sync started, redirect with success message


 Edit Account Form

Same fields as Add Account
Additional: Archive account checkbox
Pre-filled with existing data
Buttons: Save Changes (primary), Delete Account (danger), Cancel (secondary)
Validation: Same as add form
Success: Account updated, return to accounts page



Transaction Forms

 Add Transaction Form

Fields:

Transaction type (dropdown: Expense, Income, Transfer)
Date (date picker, default today)
Amount (required, currency input)
Account (dropdown, required for expense/income)
Category (dropdown with icons, required)
Merchant/Payee (autocomplete from previous merchants)
Description (textarea, optional)
Tags (multi-select, optional)
Receipt attachment (file upload, jpg/png/pdf)


If Transfer type:

From account (dropdown)
To account (dropdown)
Transfer fee (optional)


Buttons: Add Transaction (primary), Add & New (secondary), Cancel
Validation: Required fields, amount > 0, valid date
Success: Transaction added, refresh list, show toast


 Edit Transaction Form

Same fields as Add Transaction
Pre-filled with existing data
Additional: Split transaction option
Buttons: Save (primary), Delete (danger), Cancel (secondary)
Success: Transaction updated, refresh list


 Bulk Edit Transactions

Appears when multiple transactions selected
Fields:

Category (apply to all)
Tags (add to all)
Mark as reviewed (checkbox)


Buttons: Apply to Selected (primary), Cancel
Success: Bulk update applied, show count updated


 Import Transactions Form

Fields:

Account (dropdown, select target account)
CSV file upload (with format guide link)
Column mapping interface (map CSV columns to app fields)
Duplicate detection (checkbox, default on)


Preview table showing first 5 rows
Buttons: Import (primary), Cancel (secondary)
Validation: Valid CSV format, required columns present
Success: X transactions imported, Y duplicates skipped



Budget Forms

 Create Budget Form

Fields:

Budget name (required, e.g., "November 2025")
Budget period (dropdown: Weekly, Monthly, Quarterly, Yearly)
Start date (date picker)
Budget method (dropdown: Zero-based, 50/30/20, Envelope, Custom)
Total income (auto-filled from income data, editable)


Category allocation section:

Each category has amount input
Percentage of total displayed
Rollover toggle per category


Template options:

Use previous month
Use average of last 3 months
Start from scratch


Buttons: Create Budget (primary), Save as Template, Cancel
Validation: Total allocations = income (for zero-based), categories sum check
Success: Budget created, redirect to budget page


 Edit Budget Category Form

Fields:

Category name (required)
Budgeted amount (currency input)
Rollover unused amount (checkbox)
Alert when reaching X% (slider, 75-100%)
Notes (textarea)


Buttons: Save (primary), Delete Category (danger), Cancel
Success: Category updated, budget recalculated


 Add Budget Category Form

Fields:

Category name (required)
Category icon (icon picker, 50+ options)
Parent category (dropdown, optional for sub-categories)
Budgeted amount (currency input)
Color (color picker)


Buttons: Add Category (primary), Cancel
Validation: Unique category name, amount >= 0
Success: Category added to budget



Goal Forms

 Create Goal Form

Fields:

Goal name (required, e.g., "Emergency Fund")
Goal emoji (emoji picker, optional but encouraged)
Target amount (required, currency input)
Current amount (currency input, default 0)
Target date (date picker, optional)
Contribution frequency (dropdown: Weekly, Bi-weekly, Monthly)
Automatic contribution amount (optional)
Account to save in (dropdown, optional)
Notes (textarea)


Goal templates section:

Emergency Fund (3-6 months expenses)
Vacation
Down Payment
Car Purchase
Debt Payoff
Custom


Buttons: Create Goal (primary), Save & Create Another, Cancel
Validation: Target > current, valid date if provided
Success: Goal created, redirect to goals page with confetti animation


 Update Goal Progress Form

Quick action modal
Fields:

Add amount (currency input)
Subtract amount (currency input, for withdrawals)
Date (date picker, default today)
Note (textarea, optional)


Buttons: Update Progress (primary), Cancel
Validation: New total >= 0, not > target
Success: Progress updated, show new percentage, celebration if milestone reached


 Edit Goal Form

Same fields as Create Goal
Pre-filled with existing data
Additional: Archive goal checkbox
Buttons: Save Changes (primary), Delete Goal (danger), Cancel
Success: Goal updated, return to goals page



Income Forms

 Add Income Source Form

Fields:

Income source name (required, e.g., "Freelance Design")
Income type (dropdown: Salary, Freelance, Business, Investment, Rental, Other)
Amount (required, currency input)
Frequency (dropdown: One-time, Weekly, Bi-weekly, Monthly, Quarterly, Yearly)
Next expected date (date picker, for recurring)
Account (dropdown, where income is received)
Tax category (dropdown: W-2, 1099, Tax-exempt, etc.)
Notes (textarea)


Buttons: Add Income Source (primary), Cancel
Validation: Amount > 0, required fields
Success: Income source added, forecast updated


 Edit Income Source Form

Same fields as Add Income Source
Pre-filled with existing data
Additional: Mark as inactive checkbox
Buttons: Save (primary), Delete (danger), Cancel
Success: Income source updated



Bill Forms

 Add Bill Form

Fields:

Bill name (required, e.g., "Electric Company")
Amount (currency input, or "Varies")
Due date (day of month, 1-31)
Frequency (dropdown: Monthly, Quarterly, Yearly, One-time)
Account to pay from (dropdown)
Category (dropdown)
Auto-pay enabled (checkbox)
Reminder days before (number input, default 3)
Website URL (for bill pay, optional)
Notes (textarea)


Buttons: Add Bill (primary), Cancel
Validation: Required fields, valid due date
Success: Bill added, calendar updated


 Mark Bill as Paid Form

Quick action modal
Fields:

Amount paid (currency input, pre-filled with expected amount)
Date paid (date picker, default today)
Account paid from (dropdown)
Notes (optional)


Buttons: Mark as Paid (primary), Cancel
Success: Bill marked paid, transaction created automatically



Subscription Forms

 Add Subscription Form

Fields:

Service name (required, autocomplete from common services)
Cost (currency input)
Billing cycle (dropdown: Monthly, Quarterly, Yearly)
Next billing date (date picker)
Category (dropdown: Entertainment, Productivity, Shopping, etc.)
Account charged (dropdown)
Auto-renewal (checkbox, default on)
Free trial end date (date picker, optional)
Cancel URL (text input, optional)
Notes (textarea)


Buttons: Add Subscription (primary), Cancel
Validation: Required fields, next billing date in future
Success: Subscription added, calendar updated


 Cancel Subscription Tracker

Quick action modal
Fields:

Cancellation date (date picker, default today)
Final billing date (date picker)
Reason for canceling (dropdown: Too expensive, Not using, Found alternative, etc.)
Notes (textarea, optional)


Checkbox: Remove from active subscriptions
Buttons: Mark as Canceled (primary), Cancel
Success: Subscription marked canceled, removed from totals



Settings Forms

 Edit Profile Form

Fields:

Profile photo (image upload, crop tool)
Full name (required)
Email (required, email validation)
Phone number (optional, phone format)
Date of birth (date picker, optional)
Timezone (dropdown, auto-detect)
Currency (dropdown, affects all amounts)
Fiscal year start (dropdown: January-December)


Buttons: Save Changes (primary), Cancel
Validation: Valid email, unique email check
Success: Profile updated, show toast


 Change Password Form

Fields:

Current password (required)
New password (required, strength meter)
Confirm new password (required, must match)


Buttons: Update Password (primary), Cancel
Validation: Current password correct, new password strong, passwords match
Success: Password changed, logout other sessions option


 Two-Factor Authentication Setup

Flow:

Generate QR code
Scan with authenticator app
Enter 6-digit code to verify
Show backup codes (10 codes)
Download/print backup codes


Fields:

Verification code (6-digit input)


Buttons: Enable 2FA (primary), Cancel
Success: 2FA enabled, backup codes saved


 Update Payment Method Form

Stripe Elements integration
Fields:

Card number (Stripe element)
Expiry date (Stripe element)
CVC (Stripe element)
Cardholder name (text input)
Billing address (optional)


Buttons: Save Payment Method (primary), Cancel
Validation: Handled by Stripe
Success: Payment method updated, confirm with small charge


 Notification Preferences Form

Checkboxes for each notification type:

Budget alerts (email, push)
Bill reminders (email, push, SMS)
Goal milestones (email, push)
Large transactions (email, push)
Unusual activity (email, push, SMS)
Weekly summary (email)
Monthly report (email)
Product updates (email)
Marketing emails (email)


Frequency settings:

Digest frequency (dropdown: Real-time, Daily, Weekly)
Quiet hours (time range picker)


Buttons: Save Preferences (primary), Turn Off All, Cancel
Success: Preferences saved


 Delete Account Form

Warning message (data deletion is permanent)
Fields:

Reason for leaving (dropdown + textarea)
Type "DELETE" to confirm (text input, exact match)
Final confirmation checkbox


Buttons: Delete My Account (danger, disabled until confirmed), Cancel
Validation: Must type DELETE exactly, checkbox checked
Success: Account queued for deletion, logout, show 30-day recovery period message



Report Forms

 Custom Report Builder Form

Fields:

Report name (required)
Date range (date range picker: This month, Last month, Last 3 months, Last year, Custom)
Accounts (multi-select, default all)
Categories (multi-select, default all)
Report type (dropdown: Income, Expenses, Net Worth, Cash Flow, Tax Summary)
Group by (dropdown: Category, Merchant, Account, Month, Week)
Include charts (checkbox)
Include transactions list (checkbox)


Buttons: Generate Report (primary), Save Template, Cancel
Success: Report generated, preview shown, download options


 Schedule Report Form

Fields:

Report template (dropdown)
Frequency (dropdown: Weekly, Monthly, Quarterly, Yearly)
Delivery method (email, default)
Recipients (email input, multi)
Format (dropdown: PDF, Excel, CSV)


Buttons: Schedule Report (primary), Cancel
Success: Report scheduled, confirmation email sent




3. COMPLETE COMPONENT INVENTORY
UI Components
Buttons

 Button Component

Variants: primary, secondary, danger, ghost, link
Sizes: sm, md, lg
States: default, hover, active, disabled, loading
Props: onClick, type, variant, size, disabled, loading, icon, fullWidth
Loading state shows spinner



Form Inputs

 TextInput Component

Types: text, email, password, tel, url
States: default, focus, error, disabled
Props: label, placeholder, value, onChange, error, helperText, required, icon
Password toggle for password type
Character counter optional


 NumberInput Component

Currency formatting mode
Decimal places control
Min/max validation
Step increment buttons
Props: label, value, onChange, min, max, step, currency, decimals


 TextArea Component

Auto-resize option
Character limit
Props: label, placeholder, value, onChange, rows, maxLength, error


 Select Component

Single and multi-select modes
Search/filter functionality
Custom option rendering
Grouped options
Props: label, options, value, onChange, multiple, searchable, placeholder


 Checkbox Component

Checked, unchecked, indeterminate states
Props: label, checked, onChange, indeterminate, disabled


 Radio Component

Radio group wrapper
Props: name, options, value, onChange, disabled


 Toggle/Switch Component

On/off states
Props: checked, onChange, label, disabled


 DatePicker Component

Single date and date range modes
Calendar popup
Keyboard navigation
Min/max date constraints
Props: value, onChange, mode, minDate, maxDate, placeholder


 TimePicker Component

12/24 hour format
Props: value, onChange, format, step


 ColorPicker Component

Hex, RGB, HSL modes
Preset colors
Props: value, onChange, presets


 FileUpload Component

Drag and drop
File type restrictions
Size limits
Preview for images
Progress indicator
Props: accept, maxSize, multiple, onUpload, maxFiles


 Slider Component

Single and range modes
Props: min, max, step, value, onChange, marks, labels



Feedback Components

 Modal/Dialog Component

Sizes: sm, md, lg, xl, fullscreen
Header, body, footer sections
Close button and backdrop click
Props: isOpen, onClose, title, size, closeOnBackdrop, showCloseButton


 Toast/Notification Component

Types: success, error, warning, info
Auto-dismiss timer
Action button optional
Position: top-right, top-left, bottom-right, bottom-left, top-center, bottom-center
Props: message, type, duration, onClose, action


 Alert Component

Types: success, error, warning, info
Dismissible option
Icon included
Props: type, title, message, dismissible, onDismiss


 Loading Spinner Component

Sizes: sm, md, lg
Overlay mode for full-page loading
Props: size, overlay, text


 Progress Bar Component

Determinate and indeterminate modes
Color variants
Props: value, max, variant, showLabel, label


 Skeleton Loader Component

Variants: text, circle, rectangle
Animation pulse effect
Props: variant, width, height, count


 Tooltip Component

Positions: top, bottom, left, right
Props: content, position, trigger, delay


 Popover Component

Custom content
Trigger modes: click, hover
Props: content, trigger, position, isOpen, onToggle



Navigation Components

 Header/Navbar Component

Logged out version: Logo, Features, Pricing, Login, Signup
Logged in version: Logo, Search, Notifications, User menu
Responsive mobile menu
Props: user, onLogout, notificationCount


 Sidebar Navigation Component

Collapsible (width: 260px → 60px)
Toggle button
Active state indicator
Sections: Overview, Management, Accounts
Props: collapsed, onToggle, activeItem, onNavigate


 Right Insights Panel Component

Collapsible (width: 320px → 0px)
Toggle button
Sections: Insights, Quick Actions, Budget Progress
Props: collapsed, onToggle, insights, actions


 Breadcrumbs Component

Separator customizable
Clickable path items
Props: items, separator, maxItems


 Tabs Component

Horizontal and vertical modes
Props: tabs, activeTab, onChange, variant


 Pagination Component

Page numbers, prev/next buttons
Items per page selector
Props: currentPage, totalPages, onPageChange, itemsPerPage, totalItems


 User Menu Dropdown Component

Avatar image
Username display
Menu items: Profile, Settings, Help, Logout
Props: user, onLogout, onNavigate



Data Display Components

 Card Component

Header, body, footer sections
Hover effects
Props: title, subtitle, children, onClick, hoverable


 Stat Card/KPI Card Component

Icon
Label
Value (large text)
Change indicator (percentage with up/down arrow)
Props: icon, label, value, change, trend


 Table Component

Sortable columns
Selectable rows (checkbox)
Expandable rows
Fixed header on scroll
Column resizing
Props: columns, data, sortable, selectable, onSort, onRowClick, loading


 DataTable with Filters Component

Search input
Column filters
Filter chips display
Export button
Props: columns, data, filters, onFilter, onExport


 List Component

Simple list items
Interactive items with click
Dividers between items
Props: items, onItemClick, showDividers


 Empty State Component

Illustration/icon
Title
Description
Action button
Props: icon, title, description, action, actionLabel


 Error State Component

Error icon
Error message
Retry button
Support link
Props: error, onRetry, showSupport


 Badge Component

Variants: primary, success, warning, danger, info
Sizes: sm, md, lg
Props: text, variant, size


 Avatar Component

Image fallback to initials
Sizes: xs, sm, md, lg, xl
Status indicator optional
Props: src, alt, name, size, status


 Accordion Component

Expandable sections
Allow multiple open or single open
Props: items, allowMultiple, defaultOpen



Chart Components

 Line Chart Component

Multiple datasets
Tooltip on hover
Legend
Zoom/pan optional
Props: data, labels, options, height


 Bar Chart Component

Vertical and horizontal modes
Stacked option
Props: data, labels, options, stacked, horizontal


 Pie/Donut Chart Component

Interactive legend
Center label (for donut)
Props: data, labels, donut, centerLabel


 Area Chart Component

Stacked option
Gradient fill
Props: data, labels, options, stacked


 Sparkline Component

Mini trend visualization
Props: data, color, width, height



Feature-Specific Components

 Transaction Row Component

Icon/emoji
Merchant name
Category badge
Amount (color-coded)
Date
Actions (edit, delete)
Props: transaction, onEdit, onDelete


 Budget Category Component

Category icon/emoji
Category name
Progress bar
Amount spent / budgeted
Percentage
Props: category, spent, budgeted


 Goal Card Component

Goal emoji/icon
Goal name
Progress bar
Current amount / target amount
Percentage complete
Target date
Props: goal, onUpdate


 Account Card Component

Account icon
Account name
Account type
Balance
Sync status
Props: account, onSync, onClick


 Insight Card Component

Alert type icon
Title
Description
Action button optional
Props: insight, onAction


 Quick Action Button Component

Icon
Label
Description
Props: icon, label, description, onClick

4. BACKEND & API SPECIFICATION
Database Schema
Users Table
sqlCREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  avatar_url TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  email_verification_token VARCHAR(255),
  password_reset_token VARCHAR(255),
  password_reset_expires TIMESTAMP,
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  two_factor_secret VARCHAR(255),
  timezone VARCHAR(50) DEFAULT 'America/New_York',
  currency VARCHAR(3) DEFAULT 'USD',
  fiscal_year_start INTEGER DEFAULT 1, -- 1 = January
  date_format VARCHAR(20) DEFAULT 'MM/DD/YYYY',
  subscription_plan VARCHAR(20) DEFAULT 'trial', -- trial, basic, plus, family
  subscription_status VARCHAR(20) DEFAULT 'active', -- active, canceled, expired
  subscription_ends_at TIMESTAMP,
  stripe_customer_id VARCHAR(255),
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_subscription ON users(subscription_plan, subscription_status);

OAuth Accounts Table
sqlCREATE TABLE oauth_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL, -- google, apple
  provider_account_id VARCHAR(255) NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(provider, provider_account_id)
);

CREATE INDEX idx_oauth_user ON oauth_accounts(user_id);
Sessions Table
sqlCREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  device_info JSONB, -- browser, OS, device type
  ip_address VARCHAR(45),
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(token);
Accounts Table
sqlCREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  account_type VARCHAR(50) NOT NULL, -- checking, savings, credit_card, investment, loan, other
  name VARCHAR(100) NOT NULL,
  institution VARCHAR(100),
  account_number_last_4 VARCHAR(4),
  current_balance DECIMAL(15, 2) NOT NULL DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'USD',
  color VARCHAR(7), -- hex color
  is_active BOOLEAN DEFAULT TRUE,
  is_hidden BOOLEAN DEFAULT FALSE,
  plaid_account_id VARCHAR(255),
  plaid_access_token TEXT, -- encrypted
  last_synced_at TIMESTAMP,
  sync_status VARCHAR(20) DEFAULT 'manual', -- manual, syncing, synced, error
  notes TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_accounts_user ON accounts(user_id);
CREATE INDEX idx_accounts_active ON accounts(user_id, is_active);
Categories Table
sqlCREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(50), -- emoji or icon name
  color VARCHAR(7), -- hex color
  parent_category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  is_system BOOLEAN DEFAULT FALSE, -- system categories can't be deleted
  is_income BOOLEAN DEFAULT FALSE, -- true for income categories
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, name)
);

CREATE INDEX idx_categories_user ON categories(user_id);
CREATE INDEX idx_categories_parent ON categories(parent_category_id);
Transactions Table
sqlCREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
  transaction_type VARCHAR(20) NOT NULL, -- expense, income, transfer
  date DATE NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  merchant VARCHAR(255),
  description TEXT,
  tags TEXT[], -- array of tags
  is_recurring BOOLEAN DEFAULT FALSE,
  recurring_rule_id UUID, -- reference to recurring rules
  plaid_transaction_id VARCHAR(255),
  status VARCHAR(20) DEFAULT 'posted', -- pending, posted, reconciled
  is_reviewed BOOLEAN DEFAULT FALSE,
  receipt_url TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_account ON transactions(account_id);
CREATE INDEX idx_transactions_date ON transactions(user_id, date DESC);
CREATE INDEX idx_transactions_category ON transactions(category_id);
CREATE INDEX idx_transactions_plaid ON transactions(plaid_transaction_id);
Transfers Table (for transfer type transactions)
sqlCREATE TABLE transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
  from_account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
  to_account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
  transfer_fee DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transfers_transaction ON transfers(transaction_id);
Budgets Table
sqlCREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  period_type VARCHAR(20) NOT NULL, -- weekly, monthly, quarterly, yearly
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  budget_method VARCHAR(20) DEFAULT 'custom', -- zero_based, envelope, 50_30_20, custom
  total_income DECIMAL(15, 2),
  is_template BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_budgets_user ON budgets(user_id);
CREATE INDEX idx_budgets_period ON budgets(user_id, start_date, end_date);
Budget Categories Table
sqlCREATE TABLE budget_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_id UUID REFERENCES budgets(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  budgeted_amount DECIMAL(15, 2) NOT NULL,
  rollover_enabled BOOLEAN DEFAULT FALSE,
  alert_threshold INTEGER DEFAULT 90, -- alert at 90% of budget
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(budget_id, category_id)
);

CREATE INDEX idx_budget_categories_budget ON budget_categories(budget_id);
Goals Table
sqlCREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  emoji VARCHAR(10),
  target_amount DECIMAL(15, 2) NOT NULL,
  current_amount DECIMAL(15, 2) DEFAULT 0,
  target_date DATE,
  contribution_frequency VARCHAR(20), -- weekly, biweekly, monthly
  auto_contribution_amount DECIMAL(10, 2),
  account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'active', -- active, completed, archived
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_goals_user ON goals(user_id);
CREATE INDEX idx_goals_status ON goals(user_id, status);
Goal Contributions Table
sqlCREATE TABLE goal_contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id UUID REFERENCES goals(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  contribution_date DATE NOT NULL,
  transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_goal_contributions_goal ON goal_contributions(goal_id);
Income Sources Table
sqlCREATE TABLE income_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  income_type VARCHAR(50) NOT NULL, -- salary, freelance, business, investment, rental, other
  amount DECIMAL(15, 2) NOT NULL,
  frequency VARCHAR(20) NOT NULL, -- one_time, weekly, biweekly, monthly, quarterly, yearly
  next_expected_date DATE,
  account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
  tax_category VARCHAR(50), -- w2, 1099, tax_exempt, etc
  is_active BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_income_sources_user ON income_sources(user_id);
Bills Table
sqlCREATE TABLE bills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  amount DECIMAL(10, 2), -- null if varies
  amount_varies BOOLEAN DEFAULT FALSE,
  due_day INTEGER NOT NULL, -- day of month (1-31)
  frequency VARCHAR(20) NOT NULL, -- monthly, quarterly, yearly, one_time
  account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  auto_pay_enabled BOOLEAN DEFAULT FALSE,
  reminder_days_before INTEGER DEFAULT 3,
  website_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_bills_user ON bills(user_id);
CREATE INDEX idx_bills_due ON bills(user_id, due_day);
Bill Payments Table
sqlCREATE TABLE bill_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_id UUID REFERENCES bills(id) ON DELETE CASCADE,
  amount_paid DECIMAL(10, 2) NOT NULL,
  date_paid DATE NOT NULL,
  transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_bill_payments_bill ON bill_payments(bill_id);
Subscriptions Table
sqlCREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  service_name VARCHAR(100) NOT NULL,
  cost DECIMAL(10, 2) NOT NULL,
  billing_cycle VARCHAR(20) NOT NULL, -- monthly, quarterly, yearly
  next_billing_date DATE NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
  auto_renewal BOOLEAN DEFAULT TRUE,
  free_trial_end_date DATE,
  cancel_url TEXT,
  status VARCHAR(20) DEFAULT 'active', -- active, canceled, expired
  cancellation_date DATE,
  cancellation_reason VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(user_id, status);
Investments Table
sqlCREATE TABLE investments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
  symbol VARCHAR(20) NOT NULL,
  name VARCHAR(100),
  asset_type VARCHAR(50), -- stock, bond, etf, mutual_fund, crypto, other
  shares DECIMAL(15, 6),
  cost_basis DECIMAL(15, 2),
  current_price DECIMAL(15, 2),
  current_value DECIMAL(15, 2),
  last_updated_at TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_investments_user ON investments(user_id);
CREATE INDEX idx_investments_account ON investments(account_id);
Reports Table
sqlCREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  report_type VARCHAR(50) NOT NULL, -- income, expenses, net_worth, cash_flow, tax
  config JSONB NOT NULL, -- date range, filters, grouping, etc.
  is_template BOOLEAN DEFAULT FALSE,
  schedule_frequency VARCHAR(20), -- null for one-time, or weekly/monthly/etc
  last_generated_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reports_user ON reports(user_id);
Notifications Table
sqlCREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- budget_alert, bill_reminder, goal_milestone, etc.
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  action_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  is_archived BOOLEAN DEFAULT FALSE,
  metadata JSONB, -- additional data specific to notification type
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;
User Preferences Table
sqlCREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  theme VARCHAR(20) DEFAULT 'dark', -- light, dark, auto
  language VARCHAR(10) DEFAULT 'en',
  notifications_email JSONB DEFAULT '{}', -- each notification type: true/false
  notifications_push JSONB DEFAULT '{}',
  notifications_sms JSONB DEFAULT '{}',
  digest_frequency VARCHAR(20) DEFAULT 'realtime', -- realtime, daily, weekly
  quiet_hours_start TIME,
  quiet_hours_end TIME,
  default_dashboard_view VARCHAR(50) DEFAULT 'overview',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);
Audit Log Table
sqlCREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL, -- login, logout, create_transaction, delete_account, etc.
  resource_type VARCHAR(50), -- transaction, account, budget, etc.
  resource_id UUID,
  metadata JSONB, -- additional context
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id, created_at DESC);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);

API Endpoints
Authentication APIs
POST /api/auth/signup
jsonRequest:
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "agreeToTerms": true
}

Response (201):
{
  "success": true,
  "message": "Account created. Please check your email to verify.",
  "userId": "uuid"
}

Errors:
400 - Validation error (weak password, invalid email)
409 - Email already exists
500 - Server error
POST /api/auth/login
jsonRequest:
{
  "email": "john@example.com",
  "password": "SecurePass123!",
  "rememberMe": true
}

Response (200):
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "fullName": "John Doe",
    "subscriptionPlan": "plus"
  },
  "token": "jwt-token",
  "expiresAt": "2025-12-19T00:00:00Z"
}

Errors:
401 - Invalid credentials
403 - Email not verified
429 - Too many login attempts
500 - Server error
POST /api/auth/logout
jsonRequest: (requires auth token in header)
{}

Response (200):
{
  "success": true,
  "message": "Logged out successfully"
}
POST /api/auth/forgot-password
jsonRequest:
{
  "email": "john@example.com"
}

Response (200):
{
  "success": true,
  "message": "Password reset email sent"
}
// Always returns success for security (don't reveal if email exists)
POST /api/auth/reset-password
jsonRequest:
{
  "token": "reset-token-from-email",
  "newPassword": "NewSecurePass123!"
}

Response (200):
{
  "success": true,
  "message": "Password reset successfully"
}

Errors:
400 - Invalid or expired token
400 - Weak password
GET /api/auth/verify-email?token=xxx
jsonResponse (200):
{
  "success": true,
  "message": "Email verified successfully"
}

Errors:
400 - Invalid or expired token
404 - User not found
POST /api/auth/resend-verification
jsonRequest:
{
  "email": "john@example.com"
}

Response (200):
{
  "success": true,
  "message": "Verification email sent"
}
Account APIs
GET /api/accounts
jsonRequest: (requires auth)
Query params: ?includeHidden=false

Response (200):
{
  "success": true,
  "accounts": [
    {
      "id": "uuid",
      "accountType": "checking",
      "name": "Chase Checking",
      "institution": "Chase",
      "currentBalance": 8240.00,
      "currency": "USD",
      "color": "#3b82f6",
      "lastSyncedAt": "2025-11-18T10:30:00Z",
      "syncStatus": "synced"
    }
  ],
  "totalBalance": 48555.00
}
POST /api/accounts
jsonRequest:
{
  "accountType": "checking",
  "name": "Wells Fargo Checking",
  "institution": "Wells Fargo",
  "currentBalance": 5000.00,
  "currency": "USD",
  "color": "#ef4444",
  "notes": "Primary checking account"
}

Response (201):
{
  "success": true,
  "account": { /* account object */ },
  "message": "Account created successfully"
}

Errors:
400 - Validation error
409 - Account name already exists
PUT /api/accounts/:id
jsonRequest:
{
  "name": "Wells Fargo Primary",
  "currentBalance": 5200.00,
  "notes": "Updated notes"
}

Response (200):
{
  "success": true,
  "account": { /* updated account */ }
}
DELETE /api/accounts/:id
jsonResponse (200):
{
  "success": true,
  "message": "Account deleted successfully"
}

Note: Should check if account has transactions first
POST /api/accounts/link-plaid
jsonRequest:
{
  "publicToken": "public-sandbox-xxx",
  "metadata": {
    "institution": { "name": "Chase", "institution_id": "ins_3" },
    "accounts": [{ "id": "xxx", "name": "Plaid Checking", "type": "depository" }]
  }
}

Response (200):
{
  "success": true,
  "accounts": [ /* newly created accounts */ ],
  "message": "Bank accounts linked successfully"
}
POST /api/accounts/:id/sync
jsonRequest: (requires auth)
{}

Response (200):
{
  "success": true,
  "syncedAt": "2025-11-18T11:00:00Z",
  "newTransactions": 12,
  "updatedBalance": 8350.00
}
Transaction APIs
GET /api/transactions
jsonRequest:
Query params:
  ?page=1
  &limit=50
  &startDate=2025-11-01
  &endDate=2025-11-30
  &accountId=uuid
  &categoryId=uuid
  &minAmount=0
  &maxAmount=1000
  &search=starbucks
  &status=posted
  &sort=date
  &order=desc

Response (200):
{
  "success": true,
  "transactions": [
    {
      "id": "uuid",
      "accountId": "uuid",
      "transactionType": "expense",
      "date": "2025-11-17",
      "amount": 142.38,
      "category": {
        "id": "uuid",
        "name": "Groceries",
        "icon": "🛒"
      },
      "merchant": "Whole Foods Market",
      "description": null,
      "status": "posted",
      "isReviewed": false,
      "receiptUrl": null
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 142,
    "totalPages": 3
  }
}
GET /api/transactions/:id
jsonResponse (200):
{
  "success": true,
  "transaction": { /* full transaction object with all details */ }
}
POST /api/transactions
jsonRequest:
{
  "accountId": "uuid",
  "transactionType": "expense",
  "date": "2025-11-18",
  "amount": 45.50,
  "categoryId": "uuid",
  "merchant": "Starbucks",
  "description": "Coffee meeting",
  "tags": ["business", "meeting"],
  "receiptFile": "base64-encoded-file" // optional
}

Response (201):
{
  "success": true,
  "transaction": { /* created transaction */ },
  "message": "Transaction added successfully"
}
PUT /api/transactions/:id
jsonRequest:
{
  "categoryId": "uuid",
  "merchant": "Updated Merchant",
  "description": "Updated description"
}

Response (200):
{
  "success": true,
  "transaction": { /* updated transaction */ }
}
DELETE /api/transactions/:id
jsonResponse (200):
{
  "success": true,
  "message": "Transaction deleted successfully"
}
POST /api/transactions/bulk-update
jsonRequest:
{
  "transactionIds": ["uuid1", "uuid2", "uuid3"],
  "updates": {
    "categoryId": "uuid",
    "isReviewed": true
  }
}

Response (200):
{
  "success": true,
  "updatedCount": 3,
  "message": "3 transactions updated"
}
POST /api/transactions/import
jsonRequest (multipart/form-data):
{
  "accountId": "uuid",
  "file": <csv-file>,
  "columnMapping": {
    "date": 0,
    "description": 1,
    "amount": 2,
    "category": 3
  },
  "skipDuplicates": true
}

Response (200):
{
  "success": true,
  "imported": 45,
  "skipped": 3,
  "errors": [],
  "message": "Imported 45 transactions, skipped 3 duplicates"
}
Budget APIs
GET /api/budgets
jsonRequest:
Query params: ?startDate=2025-11-01&endDate=2025-11-30

Response (200):
{
  "success": true,
  "budgets": [
    {
      "id": "uuid",
      "name": "November 2025",
      "periodType": "monthly",
      "startDate": "2025-11-01",
      "endDate": "2025-11-30",
      "totalIncome": 6165.00,
      "totalBudgeted": 5200.00,
      "totalSpent": 3892.00,
      "categories": [
        {
          "categoryId": "uuid",
          "categoryName": "Housing",
          "budgetedAmount": 1800.00,
          "spentAmount": 1800.00,
          "remainingAmount": 0,
          "percentageUsed": 100
        }
      ]
    }
  ]
}
GET /api/budgets/current
jsonResponse (200):
{
  "success": true,
  "budget": { /* current period budget */ }
}
POST /api/budgets
jsonRequest:
{
  "name": "December 2025",
  "periodType": "monthly",
  "startDate": "2025-12-01",
  "endDate": "2025-12-31",
  "budgetMethod": "zero_based",
  "totalIncome": 6165.00,
  "categories": [
    {
      "categoryId": "uuid",
      "budgetedAmount": 1800.00,
      "rolloverEnabled": false
    }
  ]
}

Response (201):
{
  "success": true,
  "budget": { /* created budget */ }
}
PUT /api/budgets/:id
jsonRequest:
{
  "name": "Updated Name",
  "categories": [ /* updated categories */ ]
}

Response (200):
{
  "success": true,
  "budget": { /* updated budget */ }
}
DELETE /api/budgets/:id
jsonResponse (200):
{
  "success": true,
  "message": "Budget deleted"
}
Category APIs
GET /api/categories
jsonResponse (200):
{
  "success": true,
  "categories": [
    {
      "id": "uuid",
      "name": "Groceries",
      "icon": "🛒",
      "color": "#10b981",
      "parentCategoryId": null,
      "isIncome": false,
      "displayOrder": 1
    }
  ]
}
POST /api/categories
jsonRequest:
{
  "name": "Pet Care",
  "icon": "🐕",
  "color": "#f59e0b",
  "parentCategoryId": null,
  "isIncome": false
}

Response (201):
{
  "success": true,
  "category": { /* created category */ }
}
PUT /api/categories/:id
jsonRequest:
{
  "name": "Pet Supplies",
  "icon": "🐾"
}

Response (200):
{
  "success": true,
  "category": { /* updated category */ }
}
DELETE /api/categories/:id
jsonResponse (200):
{
  "success": true,
  "message": "Category deleted"
}

Note: Should reassign transactions to "Uncategorized" first
Goal APIs
GET /api/goals
jsonResponse (200):
{
  "success": true,
  "goals": [
    {
      "id": "uuid",
      "name": "Emergency Fund",
      "emoji": "🚨",
      "targetAmount": 10000.00,
      "currentAmount": 8400.00,
      "percentageComplete": 84,
      "targetDate": "2025-12-31",
      "status": "active"
    }
  ]
}
POST /api/goals
jsonRequest:
{
  "name": "Vacation Fund",
  "emoji": "✈️",
  "targetAmount": 5000.00,
  "currentAmount": 0,
  "targetDate": "2026-06-01",
  "contributionFrequency": "monthly",
  "autoContributionAmount": 200.00
}

Response (201):
{
  "success": true,
  "goal": { /* created goal */ }
}
POST /api/goals/:id/contribute
jsonRequest:
{
  "amount": 500.00,
  "date": "2025-11-18",
  "note": "Bonus money"
}

Response (200):
{
  "success": true,
  "goal": { /* updated goal */ },
  "isMilestone": true, // if crossed 25%, 50%, 75%, or 100%
  "message": "You're 90% of the way to your goal! 🎉"
}
PUT /api/goals/:id
jsonRequest:
{
  "targetAmount": 6000.00,
  "targetDate": "2026-07-01"
}

Response (200):
{
  "success": true,
  "goal": { /* updated goal */ }
}
DELETE /api/goals/:id
jsonResponse (200):
{
  "success": true,
  "message": "Goal deleted"
}
Income Source APIs
GET /api/income-sources
jsonResponse (200):
{
  "success": true,
  "incomeSources": [
    {
      "id": "uuid",
      "name": "Primary Salary",
      "incomeType": "salary",
      "amount": 5200.00,
      "frequency": "monthly",
      "nextExpectedDate": "2025-12-01",
      "isActive": true
    }
  ],
  "totalMonthly": 6165.00
}
POST /api/income-sources
jsonRequest:
{
  "name": "Freelance Web Design",
  "incomeType": "freelance",
  "amount": 1500.00,
  "frequency": "monthly",
  "accountId": "uuid",
  "taxCategory": "1099"
}

Response (201):
{
  "success": true,
  "incomeSource": { /* created income source */ }
}
PUT /api/income-sources/:id
DELETE /api/income-sources/:id
(Similar patterns to other resources)
Bill APIs
GET /api/bills
jsonResponse (200):
{
  "success": true,
  "bills": [
    {
      "id": "uuid",
      "name": "Electric Bill",
      "amount": 98.00,
      "dueDay": 20,
      "frequency": "monthly",
      "nextDueDate": "2025-11-20",
      "isActive": true,
      "autoPayEnabled": false
    }
  ],
  "upcomingBills": [ /* next 7 days */ ]
}
POST /api/bills
PUT /api/bills/:id
DELETE /api/bills/:id
POST /api/bills/:id/mark-paid
(Similar REST patterns)
Subscription APIs
GET /api/subscriptions
jsonResponse (200):
{
  "success": true,
  "subscriptions": [
    {
      "id": "uuid",
      "serviceName": "Netflix",
      "cost": 15.99,
      "billingCycle": "monthly",
      "nextBillingDate": "2025-11-22",
      "status": "active"
    }
  ],
  "monthlyTotal": 89.00,
  "yearlyTotal": 1068.00
}
POST /api/subscriptions
PUT /api/subscriptions/:id
DELETE /api/subscriptions/:id
POST /api/subscriptions/:id/cancel
(Similar REST patterns)
Investment APIs
GET /api/investments
POST /api/investments
PUT /api/investments/:id
DELETE /api/investments/:id
Analytics APIs
GET /api/analytics/net-worth
jsonRequest:
Query params: ?period=6m (1m, 3m, 6m, 1y, all)

Response (200):
{
  "success": true,
  "data": [
    { "date": "2025-06-01", "value": 41000.00 },
    { "date": "2025-07-01", "value": 42500.00 },
    ...
  ],
  "current": 48555.00,
  "change": 7555.00,
  "changePercent": 18.4
}
GET /api/analytics/cash-flow
jsonRequest:
Query params: ?period=6m

Response (200):
{
  "success": true,
  "data": [
    { "month": "2025-06", "income": 5200.00, "expenses": 3300.00, "net": 1900.00 },
    ...
  ]
}
GET /api/analytics/spending-by-category
jsonRequest:
Query params: ?startDate=2025-11-01&endDate=2025-11-30

Response (200):
{
  "success": true,
  "categories": [
    {
      "categoryId": "uuid",
      "categoryName": "Housing",
      "amount": 1800.00,
      "percentage": 46.2,
      "transactionCount": 1
    }
  ],
  "total": 3892.00
}
GET /api/analytics/trends
GET /api/analytics/forecast
(Similar analytics endpoints)
Report APIs
GET /api/reports
POST /api/reports
POST /api/reports/:id/generate
jsonRequest:
{}

Response (200):
{
  "success": true,
  "reportUrl": "/downloads/report-uuid.pdf",
  "expiresAt": "2025-11-19T00:00:00Z"
}
POST /api/reports/:id/schedule
DELETE /api/reports/:id
Notification APIs
GET /api/notifications
jsonRequest:
Query params: ?unreadOnly=true&limit=20

Response (200):
{
  "success": true,
  "notifications": [
    {
      "id": "uuid",
      "type": "budget_alert",
      "title": "Budget Alert: Dining Out",
      "message": "You've exceeded your dining budget by $85",
      "actionUrl": "/app/budget",
      "isRead": false,
      "createdAt": "2025-11-18T10:00:00Z"
    }
  ],
  "unreadCount": 3
}
PUT /api/notifications/:id/read
PUT /api/notifications/mark-all-read
DELETE /api/notifications/:id
Settings APIs
GET /api/settings/profile
PUT /api/settings/profile
PUT /api/settings/password
POST /api/settings/2fa/enable
POST /api/settings/2fa/disable
GET /api/settings/preferences
PUT /api/settings/preferences
DELETE /api/settings/account
Subscription/Billing APIs (App Subscription, not tracking subscriptions)
GET /api/subscription/current
jsonResponse (200):
{
  "success": true,
  "subscription": {
    "plan": "plus",
    "status": "active",
    "endsAt": "2026-11-18T00:00:00Z",
    "cancelAtPeriodEnd": false
  }
}
POST /api/subscription/upgrade
POST /api/subscription/cancel
POST /api/subscription/reactivate
GET /api/subscription/invoices

Third-Party API Integrations
1. Plaid API (Bank Account Integration)
Purpose: Securely connect users' bank accounts to sync transactions automatically
Authentication:

Public key (client-side)
Secret key (server-side)
Environment: sandbox, development, production

Key Endpoints Used:

POST /link/token/create - Create link token for Plaid Link
POST /item/public_token/exchange - Exchange public token for access token
POST /accounts/get - Get account information
POST /transactions/get - Fetch transactions
POST /accounts/balance/get - Get current balances
POST /item/webhook/update - Set up webhooks

Sample Flow:
javascript// 1. Client: Initialize Plaid Link
const linkToken = await fetch('/api/plaid/create-link-token')
const handler = Plaid.create({
  token: linkToken,
  onSuccess: (public_token, metadata) => {
    // 2. Send public_token to backend
    fetch('/api/accounts/link-plaid', {
      method: 'POST',
      body: JSON.stringify({ publicToken: public_token, metadata })
    })
  }
})

// 3. Backend: Exchange token and fetch data
const response = await plaidClient.itemPublicTokenExchange({ public_token })
const accessToken = response.data.access_token
// Store encrypted access_token in database

// 4. Fetch accounts
const accounts = await plaidClient.accountsGet({ access_token: accessToken })

// 5. Fetch transactions (initial sync: last 30 days)
const transactions = await plaidClient.transactionsGet({
  access_token: accessToken,
  start_date: '2025-10-18',
  end_date: '2025-11-18'
})
Rate Limits:

Development: 100 requests/minute
Production: Varies by plan

Fallback Strategy:

If Plaid is down: Show manual entry option
If account fails to sync: Display error, offer to reconnect
Webhook failures: Implement retry mechanism with exponential backoff

Data Stored:

Encrypted access tokens (never plain text)
Account IDs
Last sync timestamps
Transaction data (cached locally)

Security:

Never log access tokens
Encrypt tokens at rest
Use environment variables for keys
Implement token rotation

2. Stripe API (Payment Processing)
Purpose: Process subscription payments
Authentication:

Publishable key (client-side)
Secret key (server-side)

Key Endpoints:

POST /v1/customers - Create customer
POST /v1/subscriptions - Create subscription
POST /v1/payment_methods - Attach payment method
POST /v1/billing_portal/sessions - Customer portal
Webhooks for events

Webhook Events to Handle:

customer.subscription.created
customer.subscription.updated
customer.subscription.deleted
invoice.payment_succeeded
invoice.payment_failed

Sample Flow:
javascript// 1. Create customer
const customer = await stripe.customers.create({
  email: user.email,
  name: user.fullName,
  metadata: { userId: user.id }
})

// 2. Create subscription
const subscription = await stripe.subscriptions.create({
  customer: customer.id,
  items: [{ price: 'price_xxx' }],
  trial_period_days: 30
})

// 3. Handle webhook
stripe.webhooks.constructEvent(
  req.body,
  signature,
  webhookSecret
)
Rate Limits:

100 read requests/second
100 write requests/second

Fallback:

Failed payment: Retry 3 times, then downgrade to free tier
Webhook failures: Implement idempotency with event IDs

3. Resend/SendGrid (Email Service)
Purpose: Send transactional emails
Key Email Types:

Welcome email
Email verification
Password reset
Budget alerts
Bill reminders
Monthly summary
Weekly digest

Sample Request:
javascriptawait resend.emails.send({
  from: 'FinanceOS <noreply@financeos.com>',
  to: user.email,
  subject: 'Budget Alert: Dining Out',
  html: emailTemplate
})
Rate Limits:

Resend: 10 emails/second (free tier)

Fallback:

Queue emails if rate limited
Retry failed sends after 5 minutes
Log all email failures

4. AWS S3 (File Storage)
Purpose: Store receipt images and report PDFs
Configuration:

Bucket: financeos-user-uploads-production
Region: us-east-1
Encryption: AES-256

Sample Upload:
javascriptconst key = `receipts/${userId}/${transactionId}/${filename}`
await s3.putObject({
  Bucket: 'financeos-user-uploads',
  Key: key,
  Body: fileBuffer,
  ContentType: 'image/jpeg',
  ServerSideEncryption: 'AES256'
})
// Return signed URL for access
const url = s3.getSignedUrl('getObject', {
  Bucket: 'financeos-user-uploads',
  Key: key,
  Expires: 3600 // 1 hour
})
```

**Fallback:**
- If S3 is down: Store in local filesystem temporarily
- Use CloudFront CDN for faster access

---

## 5. DATA FLOW SPECIFICATION

### How Data Gets Into The App

#### Option A: Manual Entry (Primary Method for MVP)
**User Flow:**
1. User clicks "Add Account" button
2. Fills out Add Account Form:
   - Account type (dropdown)
   - Account name (text input)
   - Institution (autocomplete)
   - Current balance (currency input)
3. Submits form
4. Backend creates account record
5. User can then add transactions manually

**Database Flow:**
```
User Input → Frontend Form → POST /api/accounts → 
Backend Validation → INSERT into accounts table → 
Return account object → Update UI
```

#### Option B: Plaid Bank Connection (Premium Feature)
**User Flow:**
1. User clicks "Link Bank Account" button
2. Plaid Link modal opens
3. User searches for their bank
4. Enters credentials in Plaid interface
5. Selects accounts to link
6. Plaid returns access token
7. Backend exchanges token, creates accounts, syncs transactions

**Database Flow:**
```
User selects bank → Plaid Link → Public token → 
POST /api/accounts/link-plaid → Exchange for access token → 
Fetch accounts from Plaid → Create account records → 
Fetch last 30 days transactions → Create transaction records → 
Schedule daily sync job → Return success
```

**Ongoing Sync:**
- Daily cron job (3 AM user timezone)
- Fetch new transactions via Plaid
- De-duplicate using plaid_transaction_id
- Update account balances
- Send push notification if new transactions

#### Option C: CSV Import
**User Flow:**
1. User clicks "Import Transactions"
2. Selects account
3. Uploads CSV file
4. Maps CSV columns to app fields
5. Preview first 5 rows
6. Confirms import
7. System processes file

**Database Flow:**
```
CSV file → POST /api/transactions/import → 
Parse CSV → Map columns → Validate rows → 
Check for duplicates (by date + amount + merchant) → 
Bulk INSERT transactions → Return summary → Update UI

Data Mapping: What You See in the Demo
Let me trace EXACTLY where each piece of demo data comes from:
Dashboard Page

KPI Card: "Total Net Worth - $48,555"

Data Source: Calculated field
Calculation: SUM(accounts.current_balance WHERE account_type IN ('checking', 'savings', 'investment')) - SUM(accounts.current_balance WHERE account_type = 'credit_card')
API: GET /api/analytics/net-worth
Updates: Real-time when accounts sync or transactions added


KPI Card: "Monthly Income - $6,165"

Data Source: income_sources table + transactions table
Calculation: SUM(income_sources.amount WHERE frequency = 'monthly') + one-time income this month
API: GET /api/income-sources + GET /api/transactions?type=income&month=current
Updates: When user adds/edits income sources or income transactions


KPI Card: "Total Expenses - $3,892"

Data Source: transactions table
Calculation: SUM(transactions.amount WHERE transaction_type = 'expense' AND date BETWEEN month_start AND month_end)
API: GET /api/transactions?type=expense&period=current_month&aggregate=sum
Updates: Every time transaction is added/edited/deleted


KPI Card: "Savings Rate - 36.8%"

Data Source: Calculated from income and expenses
Calculation: ((income - expenses) / income) * 100
API: GET /api/analytics/savings-rate
Updates: When income or expenses change


Cash Flow Chart

Data Source: transactions table grouped by month
Calculation:



sql     SELECT 
       DATE_TRUNC('month', date) as month,
       SUM(CASE WHEN transaction_type = 'income' THEN amount ELSE 0 END) as income,
       SUM(CASE WHEN transaction_type = 'expense' THEN amount ELSE 0 END) as expenses
     FROM transactions
     WHERE user_id = $1 AND date >= $2
     GROUP BY month
     ORDER BY month

API: GET /api/analytics/cash-flow?period=6m
Updates: Daily or when significant transaction added


Recent Transactions Table

Data Source: transactions table with JOINs
Query:



sql     SELECT t.*, c.name as category_name, c.icon as category_icon, a.name as account_name
     FROM transactions t
     LEFT JOIN categories c ON t.category_id = c.id
     LEFT JOIN accounts a ON t.account_id = a.id
     WHERE t.user_id = $1
     ORDER BY t.date DESC, t.created_at DESC
     LIMIT 5

API: GET /api/transactions?limit=5&sort=date&order=desc
Updates: Real-time when transaction added

Accounts Sidebar Section

"💳 Chase Checking - $8,240"

Data Source: accounts table
How it got there:

Manual: User clicked "Add Account", filled form with name="Chase Checking", balance=8240
Plaid: User connected via Plaid, system fetched account data and created record


Fields in DB:



sql     id: uuid
     user_id: user's uuid
     account_type: 'checking'
     name: 'Chase Checking'
     institution: 'Chase'
     current_balance: 8240.00
     plaid_account_id: 'plaid_xxx' (if connected via Plaid)

Updates:

Manual: User edits balance
Plaid: Daily sync updates balance
Transaction: Balance recalculated when transaction added




"💰 Savings - $12,850"

Same flow as above, different account_type


"📊 Investment - $24,340"

Could be:

Manual entry: User enters total investment value
Plaid connected: Syncs from brokerage if supported
Manual investments: SUM of investments table where account_id matches




"💎 Crypto - $3,125"

Manual entry (crypto not supported by Plaid)
User updates balance periodically
Could integrate with Coinbase API in future



Transaction Details Breakdown
Example Transaction: "Whole Foods Market - $142.38"
How this transaction was created:
Option 1: Manual Entry
javascriptUser fills form:
- Date: Nov 17, 2025
- Amount: 142.38
- Account: Chase Checking (dropdown, selected from accounts table)
- Category: Groceries (dropdown, selected from categories table)
- Merchant: "Whole Foods Market"

POST /api/transactions
{
  accountId: "chase-uuid",
  transactionType: "expense",
  date: "2025-11-17",
  amount: 142.38,
  categoryId: "groceries-uuid",
  merchant: "Whole Foods Market"
}

Backend creates:
INSERT INTO transactions (
  id, user_id, account_id, transaction_type, date, amount, 
  category_id, merchant, status, created_at
) VALUES (
  gen_random_uuid(), 'user-uuid', 'chase-uuid', 'expense', 
  '2025-11-17', 142.38, 'groceries-uuid', 'Whole Foods Market', 
  'posted', NOW()
)

Backend also updates account balance:
UPDATE accounts 
SET current_balance = current_balance - 142.38 
WHERE id = 'chase-uuid'
Option 2: Plaid Sync
javascriptDaily Sync Job runs:
1. Fetch transactions from Plaid
   plaidClient.transactionsGet({
     access_token: account.plaid_access_token,
     start_date: last_sync_date,
     end_date: today
   })

2. Plaid returns:
   {
     transaction_id: "plaid_xxx",
     amount: 142.38,
     date: "2025-11-17",
     name: "WHOLE FOODS #123",
     merchant_name: "Whole Foods Market",
     category: ["Shops", "Food and Drink", "Groceries"]
   }

3. Auto-categorize:
   - Look up category by Plaid category hierarchy
   - Find "Groceries" in categories table
   - Fall back to "Uncategorized" if no match

4. Check for duplicate:
   - Search for transaction with same plaid_transaction_id
   - Or same date + amount + merchant (fuzzy match)
   - Skip if exists

5. Insert if new:
   INSERT INTO transactions (
     id, user_id, account_id, transaction_type, date, amount,
     category_id, merchant, plaid_transaction_id, status, created_at
   ) VALUES (
     gen_random_uuid(), 'user-uuid', 'account-uuid', 'expense',
     '2025-11-17', 142.38, 'groceries-uuid', 'Whole Foods Market',
     'plaid_xxx', 'posted', NOW()
   )

6. Update account balance (Plaid provides current balance too)
Budget Progress Bars
Example: "Housing - $1,800 / $1,800 (100%)"
Data Flow:

User creates monthly budget (November 2025)
Allocates $1,800 to Housing category
This creates:

sql   INSERT INTO budgets (user_id, name, period_type, start_date, end_date, total_income)
   VALUES ('user-uuid', 'November 2025', 'monthly', '2025-11-01', '2025-11-30', 6165.00)
   
   INSERT INTO budget_categories (budget_id, category_id, budgeted_amount)
   VALUES ('budget-uuid', 'housing-category-uuid', 1800.00)

When displaying budget progress:

sql   SELECT 
     bc.budgeted_amount,
     COALESCE(SUM(t.amount), 0) as spent_amount,
     c.name as category_name,
     c.icon as category_icon
   FROM budget_categories bc
   JOIN categories c ON bc.category_id = c.id
   LEFT JOIN transactions t ON t.category_id = c.id 
     AND t.transaction_type = 'expense'
     AND t.date BETWEEN '2025-11-01' AND '2025-11-30'
   WHERE bc.budget_id = 'budget-uuid'
   GROUP BY bc.id, bc.budgeted_amount, c.name, c.icon

Frontend calculates percentage: (spent / budgeted) * 100

Goals Progress
Example: "Emergency Fund - $8,400 / $10,000 (84%)"
Data Flow:

User creates goal:

javascript   POST /api/goals
   {
     name: "Emergency Fund",
     emoji: "🚨",
     targetAmount: 10000.00,
     currentAmount: 0,
     targetDate: "2025-12-31"
   }
   
   INSERT INTO goals (id, user_id, name, emoji, target_amount, current_amount, target_date)
   VALUES (gen_random_uuid(), 'user-uuid', 'Emergency Fund', '🚨', 10000.00, 0, '2025-12-31')

User adds contribution:

javascript   POST /api/goals/:id/contribute
   {
     amount: 500.00,
     date: "2025-11-18"
   }
   
   UPDATE goals SET current_amount = current_amount + 500.00 WHERE id = 'goal-uuid'
   
   INSERT INTO goal_contributions (goal_id, amount, contribution_date)
   VALUES ('goal-uuid', 500.00, '2025-11-18')

User could also:

Link a transaction to goal (creates goal_contribution automatically)
Set up auto-contribution (creates scheduled transaction)
Transfer from specific account


Progress calculation: (current_amount / target_amount) * 100


State Management & Real-Time Updates
Frontend State:

React Context for global state (user, accounts, categories)
React Query for server state caching
Optimistic updates for instant feedback

Real-Time Features:

WebSocket connection for live updates
Push notifications via Firebase Cloud Messaging
Email notifications via Resend/SendGrid

Sync Strategy:

Pull: User-initiated refresh
Push: Webhook from Plaid triggers sync
Scheduled: Daily cron job at 3 AM user timezone
Real-time: WebSocket for multi-device sync


Summary of Data Sources
Demo ElementData SourceHow It's CreatedHow It's UpdatedAccount balancesaccounts tableManual entry or Plaid syncTransaction add/edit, Plaid syncTransaction listtransactions tableManual entry, Plaid sync, CSV importEdit transaction, categorizeBudget progressbudget_categories + transactions aggregationBudget creation, category allocationTransaction categorizationGoal progressgoals table + goal_contributionsGoal creation, contributionsAdd contribution, link transactionNet worthCalculated from accountsAccount creationAccount balance changesIncome totalincome_sources + transactions (type=income)Income source creation, transactionsAdd income, edit amountCategoriescategories tableSystem defaults + user createsUser adds/edits categoriesInsightsAlgorithm analyzing transactions, budgetsBackground job nightlyDaily recalculation

This specification provides a complete blueprint for building FinanceOS. Every page, form, component, API endpoint, database table, and data flow is documented. Ready to start implementation! 🚀