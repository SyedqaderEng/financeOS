# API ENDPOINTS DOCUMENTATION
## FinanceOS - Complete API Reference

**Base URL:** `https://api.financeos.com` (Production)
**Base URL:** `http://localhost:3000` (Development)

**Authentication:** JWT Bearer Token (except auth endpoints)
**Content-Type:** `application/json`

---

## Table of Contents
1. [Authentication APIs](#authentication-apis)
2. [Account Management APIs](#account-management-apis)
3. [Transaction APIs](#transaction-apis)
4. [Budget APIs](#budget-apis)
5. [Category APIs](#category-apis)
6. [Goal APIs](#goal-apis)
7. [Income Source APIs](#income-source-apis)
8. [Bill Management APIs](#bill-management-apis)
9. [Subscription Tracking APIs](#subscription-tracking-apis)
10. [Investment APIs](#investment-apis)
11. [Analytics APIs](#analytics-apis)
12. [Report APIs](#report-apis)
13. [Notification APIs](#notification-apis)
14. [Settings APIs](#settings-apis)
15. [Subscription & Billing APIs](#subscription--billing-apis)
16. [Error Codes Reference](#error-codes-reference)

---

## Authentication APIs

### POST /api/auth/signup
**Description:** Create a new user account
**Authentication:** None required
**Rate Limit:** 5 requests per hour per IP

**Request:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "agreeToTerms": true,
  "subscribeToNewsletter": false
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Account created. Please check your email to verify.",
  "userId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Errors:**
- `400` - Validation error (weak password, invalid email)
- `409` - Email already exists
- `500` - Server error

---

### POST /api/auth/login
**Description:** Authenticate user and receive JWT token
**Authentication:** None required
**Rate Limit:** 10 requests per 15 minutes per IP

**Request:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!",
  "rememberMe": true
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john@example.com",
    "fullName": "John Doe",
    "subscriptionPlan": "plus",
    "emailVerified": true
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": "2025-12-19T00:00:00Z"
}
```

**Errors:**
- `401` - Invalid credentials
- `403` - Email not verified
- `429` - Too many login attempts
- `500` - Server error

---

### POST /api/auth/logout
**Description:** Invalidate current session token
**Authentication:** Required
**Rate Limit:** None

**Request:**
```json
{}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### POST /api/auth/forgot-password
**Description:** Request password reset email
**Authentication:** None required
**Rate Limit:** 3 requests per hour per IP

**Request:**
```json
{
  "email": "john@example.com"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

**Note:** Always returns success for security (doesn't reveal if email exists)

---

### POST /api/auth/reset-password
**Description:** Reset password using token from email
**Authentication:** None required
**Rate Limit:** 5 requests per hour

**Request:**
```json
{
  "token": "reset-token-from-email",
  "newPassword": "NewSecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

**Errors:**
- `400` - Invalid or expired token
- `400` - Weak password

---

### GET /api/auth/verify-email
**Description:** Verify email address using token
**Authentication:** None required
**Query Parameters:**
- `token` (required) - Email verification token

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

**Errors:**
- `400` - Invalid or expired token
- `404` - User not found

---

### POST /api/auth/resend-verification
**Description:** Resend email verification link
**Authentication:** None required
**Rate Limit:** 3 requests per hour

**Request:**
```json
{
  "email": "john@example.com"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Verification email sent"
}
```

---

### POST /api/auth/oauth/google
**Description:** Authenticate with Google OAuth
**Authentication:** None required

**Request:**
```json
{
  "credential": "google-oauth-credential-token"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "user": { /* user object */ },
  "token": "jwt-token",
  "isNewUser": false
}
```

---

### POST /api/auth/oauth/apple
**Description:** Authenticate with Apple Sign In
**Authentication:** None required

**Request:**
```json
{
  "identityToken": "apple-identity-token",
  "authorizationCode": "apple-auth-code"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "user": { /* user object */ },
  "token": "jwt-token",
  "isNewUser": false
}
```

---

## Account Management APIs

### GET /api/accounts
**Description:** Get all user accounts
**Authentication:** Required
**Query Parameters:**
- `includeHidden` (optional, default: false) - Include hidden accounts

**Response (200 OK):**
```json
{
  "success": true,
  "accounts": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "accountType": "checking",
      "name": "Chase Checking",
      "institution": "Chase",
      "currentBalance": 8240.00,
      "currency": "USD",
      "color": "#3b82f6",
      "isActive": true,
      "isHidden": false,
      "lastSyncedAt": "2025-11-18T10:30:00Z",
      "syncStatus": "synced",
      "createdAt": "2025-01-15T00:00:00Z"
    }
  ],
  "totalBalance": 48555.00,
  "totalAssets": 52680.00,
  "totalLiabilities": 4125.00
}
```

---

### GET /api/accounts/:id
**Description:** Get single account details
**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "account": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "accountType": "checking",
    "name": "Chase Checking",
    "institution": "Chase",
    "accountNumberLast4": "1234",
    "currentBalance": 8240.00,
    "currency": "USD",
    "color": "#3b82f6",
    "notes": "Primary checking account",
    "transactionCount": 142,
    "createdAt": "2025-01-15T00:00:00Z"
  }
}
```

**Errors:**
- `404` - Account not found
- `403` - Unauthorized access

---

### POST /api/accounts
**Description:** Create a new account manually
**Authentication:** Required

**Request:**
```json
{
  "accountType": "checking",
  "name": "Wells Fargo Checking",
  "institution": "Wells Fargo",
  "accountNumberLast4": "5678",
  "currentBalance": 5000.00,
  "currency": "USD",
  "color": "#ef4444",
  "notes": "Secondary checking account"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "account": { /* created account object */ },
  "message": "Account created successfully"
}
```

**Errors:**
- `400` - Validation error
- `409` - Account name already exists

---

### PUT /api/accounts/:id
**Description:** Update account details
**Authentication:** Required

**Request:**
```json
{
  "name": "Wells Fargo Primary",
  "currentBalance": 5200.00,
  "notes": "Updated notes",
  "isHidden": false
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "account": { /* updated account */ },
  "message": "Account updated successfully"
}
```

**Errors:**
- `404` - Account not found
- `400` - Validation error

---

### DELETE /api/accounts/:id
**Description:** Delete an account
**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

**Errors:**
- `404` - Account not found
- `400` - Account has associated transactions (cannot delete)

**Note:** Recommend archiving instead of deleting if transactions exist

---

### POST /api/accounts/link-plaid
**Description:** Link bank account via Plaid integration
**Authentication:** Required

**Request:**
```json
{
  "publicToken": "public-sandbox-xxxx-xxxx",
  "metadata": {
    "institution": {
      "name": "Chase",
      "institution_id": "ins_3"
    },
    "accounts": [
      {
        "id": "plaid-account-id",
        "name": "Plaid Checking",
        "type": "depository",
        "subtype": "checking"
      }
    ]
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "accounts": [
    { /* newly created account 1 */ },
    { /* newly created account 2 */ }
  ],
  "message": "Bank accounts linked successfully",
  "syncStatus": "pending"
}
```

**Errors:**
- `400` - Invalid Plaid token
- `500` - Plaid API error

---

### POST /api/accounts/:id/sync
**Description:** Manually trigger account sync via Plaid
**Authentication:** Required

**Request:**
```json
{}
```

**Response (200 OK):**
```json
{
  "success": true,
  "syncedAt": "2025-11-18T11:00:00Z",
  "newTransactions": 12,
  "updatedBalance": 8350.00,
  "message": "Account synced successfully"
}
```

**Errors:**
- `404` - Account not found
- `400` - Account not connected to Plaid
- `500` - Plaid sync error

---

### POST /api/accounts/:id/reconcile
**Description:** Reconcile account balance
**Authentication:** Required

**Request:**
```json
{
  "actualBalance": 8240.00,
  "reconciliationDate": "2025-11-18",
  "notes": "Monthly reconciliation"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "difference": 0,
  "message": "Account reconciled successfully"
}
```

---

## Transaction APIs

### GET /api/transactions
**Description:** Get transactions with filtering and pagination
**Authentication:** Required
**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 50, max: 200)
- `startDate` (YYYY-MM-DD)
- `endDate` (YYYY-MM-DD)
- `accountId` (UUID)
- `categoryId` (UUID)
- `minAmount` (number)
- `maxAmount` (number)
- `search` (string - searches merchant/description)
- `status` (pending, posted, reconciled)
- `transactionType` (expense, income, transfer)
- `sort` (date, amount, merchant)
- `order` (asc, desc)

**Response (200 OK):**
```json
{
  "success": true,
  "transactions": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "accountId": "account-uuid",
      "transactionType": "expense",
      "date": "2025-11-17",
      "amount": 142.38,
      "category": {
        "id": "category-uuid",
        "name": "Groceries",
        "icon": "🛒",
        "color": "#10b981"
      },
      "merchant": "Whole Foods Market",
      "description": null,
      "tags": ["food", "weekly"],
      "status": "posted",
      "isReviewed": false,
      "receiptUrl": null,
      "createdAt": "2025-11-17T14:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 142,
    "totalPages": 3
  },
  "summary": {
    "totalIncome": 6165.00,
    "totalExpenses": 3892.00,
    "netCashFlow": 2273.00
  }
}
```

---

### GET /api/transactions/:id
**Description:** Get single transaction details
**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "transaction": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "accountId": "account-uuid",
    "account": {
      "id": "account-uuid",
      "name": "Chase Checking",
      "accountType": "checking"
    },
    "transactionType": "expense",
    "date": "2025-11-17",
    "amount": 142.38,
    "category": { /* full category object */ },
    "merchant": "Whole Foods Market",
    "description": "Weekly grocery shopping",
    "tags": ["food", "weekly"],
    "status": "posted",
    "isReviewed": true,
    "isRecurring": false,
    "receiptUrl": "https://s3.amazonaws.com/...",
    "notes": "Bought organic produce",
    "plaidTransactionId": "plaid-txn-xxx",
    "createdAt": "2025-11-17T14:30:00Z",
    "updatedAt": "2025-11-17T14:30:00Z"
  }
}
```

**Errors:**
- `404` - Transaction not found

---

### POST /api/transactions
**Description:** Create a new transaction
**Authentication:** Required

**Request:**
```json
{
  "accountId": "account-uuid",
  "transactionType": "expense",
  "date": "2025-11-18",
  "amount": 45.50,
  "categoryId": "category-uuid",
  "merchant": "Starbucks",
  "description": "Coffee meeting",
  "tags": ["business", "meeting"],
  "receiptFile": "base64-encoded-file-data"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "transaction": { /* created transaction */ },
  "message": "Transaction added successfully",
  "receiptUrl": "https://s3.amazonaws.com/..."
}
```

**Errors:**
- `400` - Validation error
- `404` - Account or category not found

---

### POST /api/transactions/transfer
**Description:** Create a transfer between accounts
**Authentication:** Required

**Request:**
```json
{
  "fromAccountId": "account-uuid-1",
  "toAccountId": "account-uuid-2",
  "amount": 500.00,
  "date": "2025-11-18",
  "transferFee": 0,
  "description": "Monthly savings transfer"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "transfer": {
    "id": "transfer-uuid",
    "transactionId": "transaction-uuid",
    "fromAccount": { /* account object */ },
    "toAccount": { /* account object */ },
    "amount": 500.00,
    "transferFee": 0,
    "date": "2025-11-18"
  },
  "message": "Transfer completed successfully"
}
```

---

### PUT /api/transactions/:id
**Description:** Update a transaction
**Authentication:** Required

**Request:**
```json
{
  "categoryId": "new-category-uuid",
  "merchant": "Updated Merchant Name",
  "description": "Updated description",
  "isReviewed": true
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "transaction": { /* updated transaction */ },
  "message": "Transaction updated successfully"
}
```

---

### DELETE /api/transactions/:id
**Description:** Delete a transaction
**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Transaction deleted successfully"
}
```

**Errors:**
- `404` - Transaction not found
- `400` - Cannot delete synced Plaid transaction

---

### POST /api/transactions/bulk-update
**Description:** Update multiple transactions at once
**Authentication:** Required

**Request:**
```json
{
  "transactionIds": [
    "uuid-1",
    "uuid-2",
    "uuid-3"
  ],
  "updates": {
    "categoryId": "category-uuid",
    "isReviewed": true,
    "tags": ["business"]
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "updatedCount": 3,
  "message": "3 transactions updated successfully"
}
```

---

### DELETE /api/transactions/bulk-delete
**Description:** Delete multiple transactions
**Authentication:** Required

**Request:**
```json
{
  "transactionIds": ["uuid-1", "uuid-2", "uuid-3"]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "deletedCount": 3,
  "message": "3 transactions deleted successfully"
}
```

---

### POST /api/transactions/import
**Description:** Import transactions from CSV file
**Authentication:** Required
**Content-Type:** `multipart/form-data`

**Request (Form Data):**
```
accountId: "account-uuid"
file: <csv-file>
columnMapping: {
  "date": 0,
  "description": 1,
  "amount": 2,
  "category": 3
}
skipDuplicates: true
```

**Response (200 OK):**
```json
{
  "success": true,
  "imported": 45,
  "skipped": 3,
  "errors": [
    {
      "row": 12,
      "error": "Invalid date format"
    }
  ],
  "message": "Imported 45 transactions, skipped 3 duplicates"
}
```

**Errors:**
- `400` - Invalid CSV format
- `413` - File too large (max 10MB)

---

### GET /api/transactions/export
**Description:** Export transactions to CSV/Excel
**Authentication:** Required
**Query Parameters:**
- `format` (csv, xlsx, pdf)
- `startDate` (YYYY-MM-DD)
- `endDate` (YYYY-MM-DD)
- `accountId` (optional)
- `categoryId` (optional)

**Response (200 OK):**
```
Content-Type: text/csv (or application/vnd.ms-excel)
Content-Disposition: attachment; filename="transactions-2025-11.csv"

Date,Merchant,Category,Amount,Account,Status
2025-11-17,Whole Foods Market,Groceries,142.38,Chase Checking,Posted
...
```

---

## Budget APIs

### GET /api/budgets
**Description:** Get all budgets
**Authentication:** Required
**Query Parameters:**
- `startDate` (optional)
- `endDate` (optional)
- `periodType` (optional: weekly, monthly, quarterly, yearly)

**Response (200 OK):**
```json
{
  "success": true,
  "budgets": [
    {
      "id": "budget-uuid",
      "name": "November 2025",
      "periodType": "monthly",
      "startDate": "2025-11-01",
      "endDate": "2025-11-30",
      "budgetMethod": "zero_based",
      "totalIncome": 6165.00,
      "totalBudgeted": 5200.00,
      "totalSpent": 3892.00,
      "remainingAmount": 1308.00,
      "percentageUsed": 74.9,
      "categories": [
        {
          "categoryId": "category-uuid",
          "categoryName": "Housing",
          "categoryIcon": "🏠",
          "budgetedAmount": 1800.00,
          "spentAmount": 1800.00,
          "remainingAmount": 0,
          "percentageUsed": 100,
          "rolloverEnabled": false
        }
      ],
      "createdAt": "2025-11-01T00:00:00Z"
    }
  ]
}
```

---

### GET /api/budgets/current
**Description:** Get current period budget
**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "budget": { /* current budget object */ }
}
```

**Errors:**
- `404` - No active budget for current period

---

### GET /api/budgets/:id
**Description:** Get single budget details
**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "budget": { /* full budget object with categories */ }
}
```

---

### POST /api/budgets
**Description:** Create a new budget
**Authentication:** Required

**Request:**
```json
{
  "name": "December 2025",
  "periodType": "monthly",
  "startDate": "2025-12-01",
  "endDate": "2025-12-31",
  "budgetMethod": "zero_based",
  "totalIncome": 6165.00,
  "categories": [
    {
      "categoryId": "category-uuid",
      "budgetedAmount": 1800.00,
      "rolloverEnabled": false,
      "alertThreshold": 90
    }
  ]
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "budget": { /* created budget */ },
  "message": "Budget created successfully"
}
```

**Errors:**
- `400` - Validation error (dates overlap existing budget)
- `400` - Total budgeted exceeds income (for zero-based)

---

### PUT /api/budgets/:id
**Description:** Update budget
**Authentication:** Required

**Request:**
```json
{
  "name": "Updated Name",
  "totalIncome": 6500.00,
  "categories": [
    {
      "categoryId": "category-uuid",
      "budgetedAmount": 2000.00
    }
  ]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "budget": { /* updated budget */ },
  "message": "Budget updated successfully"
}
```

---

### DELETE /api/budgets/:id
**Description:** Delete a budget
**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Budget deleted successfully"
}
```

---

### POST /api/budgets/:id/duplicate
**Description:** Duplicate budget for next period
**Authentication:** Required

**Request:**
```json
{
  "startDate": "2025-12-01",
  "endDate": "2025-12-31",
  "name": "December 2025"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "budget": { /* duplicated budget */ },
  "message": "Budget duplicated successfully"
}
```

---

## Category APIs

### GET /api/categories
**Description:** Get all categories
**Authentication:** Required
**Query Parameters:**
- `includeSystem` (default: true) - Include system categories
- `isIncome` (optional) - Filter by income/expense categories

**Response (200 OK):**
```json
{
  "success": true,
  "categories": [
    {
      "id": "category-uuid",
      "name": "Groceries",
      "icon": "🛒",
      "color": "#10b981",
      "parentCategoryId": null,
      "isSystem": true,
      "isIncome": false,
      "displayOrder": 1,
      "transactionCount": 45,
      "totalSpent": 1240.50
    }
  ]
}
```

---

### GET /api/categories/:id
**Description:** Get single category
**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "category": {
    "id": "category-uuid",
    "name": "Groceries",
    "icon": "🛒",
    "color": "#10b981",
    "parentCategoryId": null,
    "subcategories": [
      { /* subcategory 1 */ },
      { /* subcategory 2 */ }
    ],
    "statistics": {
      "totalTransactions": 45,
      "totalSpent": 1240.50,
      "averagePerTransaction": 27.57,
      "monthlyAverage": 413.50
    }
  }
}
```

---

### POST /api/categories
**Description:** Create a new category
**Authentication:** Required

**Request:**
```json
{
  "name": "Pet Care",
  "icon": "🐕",
  "color": "#f59e0b",
  "parentCategoryId": null,
  "isIncome": false
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "category": { /* created category */ },
  "message": "Category created successfully"
}
```

**Errors:**
- `400` - Validation error
- `409` - Category name already exists

---

### PUT /api/categories/:id
**Description:** Update category
**Authentication:** Required

**Request:**
```json
{
  "name": "Pet Supplies",
  "icon": "🐾",
  "color": "#f97316"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "category": { /* updated category */ },
  "message": "Category updated successfully"
}
```

**Errors:**
- `400` - Cannot edit system category

---

### DELETE /api/categories/:id
**Description:** Delete a category
**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Category deleted successfully",
  "reassignedTransactions": 12
}
```

**Note:** Transactions are reassigned to "Uncategorized" category

**Errors:**
- `400` - Cannot delete system category
- `404` - Category not found

---

### PUT /api/categories/reorder
**Description:** Reorder categories
**Authentication:** Required

**Request:**
```json
{
  "categoryOrder": [
    { "id": "uuid-1", "displayOrder": 1 },
    { "id": "uuid-2", "displayOrder": 2 },
    { "id": "uuid-3", "displayOrder": 3 }
  ]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Categories reordered successfully"
}
```

---

## Goal APIs

### GET /api/goals
**Description:** Get all goals
**Authentication:** Required
**Query Parameters:**
- `status` (active, completed, archived)

**Response (200 OK):**
```json
{
  "success": true,
  "goals": [
    {
      "id": "goal-uuid",
      "name": "Emergency Fund",
      "emoji": "🚨",
      "targetAmount": 10000.00,
      "currentAmount": 8400.00,
      "percentageComplete": 84,
      "targetDate": "2025-12-31",
      "contributionFrequency": "monthly",
      "autoContributionAmount": 200.00,
      "status": "active",
      "monthlyContributionNeeded": 800.00,
      "daysRemaining": 43,
      "createdAt": "2025-06-01T00:00:00Z"
    }
  ],
  "summary": {
    "totalGoals": 5,
    "activeGoals": 3,
    "completedGoals": 2,
    "totalTargetAmount": 50000.00,
    "totalCurrentAmount": 32400.00,
    "overallProgress": 64.8
  }
}
```

---

### GET /api/goals/:id
**Description:** Get single goal details
**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "goal": {
    "id": "goal-uuid",
    "name": "Emergency Fund",
    "emoji": "🚨",
    "targetAmount": 10000.00,
    "currentAmount": 8400.00,
    "percentageComplete": 84,
    "targetDate": "2025-12-31",
    "contributions": [
      {
        "id": "contribution-uuid",
        "amount": 500.00,
        "date": "2025-11-01",
        "notes": "Monthly contribution"
      }
    ],
    "progressHistory": [
      { "date": "2025-06-01", "amount": 0 },
      { "date": "2025-07-01", "amount": 1200.00 },
      { "date": "2025-11-01", "amount": 8400.00 }
    ]
  }
}
```

---

### POST /api/goals
**Description:** Create a new goal
**Authentication:** Required

**Request:**
```json
{
  "name": "Vacation Fund",
  "emoji": "✈️",
  "targetAmount": 5000.00,
  "currentAmount": 0,
  "targetDate": "2026-06-01",
  "contributionFrequency": "monthly",
  "autoContributionAmount": 200.00,
  "accountId": "account-uuid",
  "notes": "Summer vacation to Europe"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "goal": { /* created goal */ },
  "message": "Goal created successfully"
}
```

---

### POST /api/goals/:id/contribute
**Description:** Add contribution to goal
**Authentication:** Required

**Request:**
```json
{
  "amount": 500.00,
  "date": "2025-11-18",
  "notes": "Bonus money",
  "createTransaction": true,
  "accountId": "account-uuid"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "goal": { /* updated goal */ },
  "contribution": { /* created contribution */ },
  "isMilestone": true,
  "milestonePercentage": 90,
  "message": "You're 90% of the way to your goal! 🎉"
}
```

**Note:** `isMilestone` is true when crossing 25%, 50%, 75%, or 100%

---

### PUT /api/goals/:id
**Description:** Update goal
**Authentication:** Required

**Request:**
```json
{
  "targetAmount": 6000.00,
  "targetDate": "2026-07-01",
  "autoContributionAmount": 250.00
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "goal": { /* updated goal */ },
  "message": "Goal updated successfully"
}
```

---

### DELETE /api/goals/:id
**Description:** Delete a goal
**Authentication:** Required
**Query Parameters:**
- `refundContributions` (default: false) - Whether to reverse linked transactions

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Goal deleted successfully"
}
```

---

### PATCH /api/goals/:id/status
**Description:** Change goal status
**Authentication:** Required

**Request:**
```json
{
  "status": "completed"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "goal": { /* updated goal */ },
  "message": "Goal marked as completed! 🎉"
}
```

---

## Income Source APIs

### GET /api/income-sources
**Description:** Get all income sources
**Authentication:** Required
**Query Parameters:**
- `activeOnly` (default: true)

**Response (200 OK):**
```json
{
  "success": true,
  "incomeSources": [
    {
      "id": "income-uuid",
      "name": "Primary Salary",
      "incomeType": "salary",
      "amount": 5200.00,
      "frequency": "monthly",
      "nextExpectedDate": "2025-12-01",
      "accountId": "account-uuid",
      "taxCategory": "w2",
      "isActive": true,
      "yearToDateTotal": 52000.00,
      "createdAt": "2025-01-01T00:00:00Z"
    }
  ],
  "summary": {
    "totalMonthly": 6165.00,
    "totalYearly": 73980.00,
    "activeSourcesCount": 3
  }
}
```

---

### GET /api/income-sources/:id
**Description:** Get single income source
**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "incomeSource": {
    "id": "income-uuid",
    "name": "Primary Salary",
    "incomeType": "salary",
    "amount": 5200.00,
    "frequency": "monthly",
    "history": [
      { "date": "2025-11-01", "amount": 5200.00 },
      { "date": "2025-10-01", "amount": 5200.00 }
    ]
  }
}
```

---

### POST /api/income-sources
**Description:** Create income source
**Authentication:** Required

**Request:**
```json
{
  "name": "Freelance Web Design",
  "incomeType": "freelance",
  "amount": 1500.00,
  "frequency": "monthly",
  "nextExpectedDate": "2025-12-01",
  "accountId": "account-uuid",
  "taxCategory": "1099",
  "notes": "Average monthly freelance income"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "incomeSource": { /* created income source */ },
  "message": "Income source created successfully"
}
```

---

### PUT /api/income-sources/:id
**Description:** Update income source
**Authentication:** Required

**Request:**
```json
{
  "amount": 1750.00,
  "nextExpectedDate": "2025-12-15"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "incomeSource": { /* updated income source */ },
  "message": "Income source updated successfully"
}
```

---

### DELETE /api/income-sources/:id
**Description:** Delete income source
**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Income source deleted successfully"
}
```

---

## Bill Management APIs

### GET /api/bills
**Description:** Get all bills
**Authentication:** Required
**Query Parameters:**
- `activeOnly` (default: true)
- `upcoming` (optional: number of days to look ahead)

**Response (200 OK):**
```json
{
  "success": true,
  "bills": [
    {
      "id": "bill-uuid",
      "name": "Electric Bill",
      "amount": 98.00,
      "amountVaries": false,
      "dueDay": 20,
      "frequency": "monthly",
      "nextDueDate": "2025-11-20",
      "accountId": "account-uuid",
      "categoryId": "category-uuid",
      "autoPayEnabled": false,
      "reminderDaysBefore": 3,
      "isActive": true,
      "lastPaidDate": "2025-10-20",
      "lastPaidAmount": 95.50
    }
  ],
  "upcomingBills": [
    {
      "billId": "bill-uuid",
      "name": "Electric Bill",
      "amount": 98.00,
      "dueDate": "2025-11-20",
      "daysUntilDue": 2,
      "isPaid": false
    }
  ],
  "summary": {
    "monthlyTotal": 1240.00,
    "yearlyTotal": 14880.00,
    "activeBillsCount": 12
  }
}
```

---

### GET /api/bills/:id
**Description:** Get single bill details
**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "bill": {
    "id": "bill-uuid",
    "name": "Electric Bill",
    "amount": 98.00,
    "paymentHistory": [
      {
        "id": "payment-uuid",
        "amountPaid": 95.50,
        "datePaid": "2025-10-20",
        "transactionId": "transaction-uuid"
      }
    ],
    "averageAmount": 96.25,
    "totalPaidYTD": 1058.75
  }
}
```

---

### POST /api/bills
**Description:** Create a new bill
**Authentication:** Required

**Request:**
```json
{
  "name": "Internet Bill",
  "amount": 89.99,
  "amountVaries": false,
  "dueDay": 15,
  "frequency": "monthly",
  "accountId": "account-uuid",
  "categoryId": "category-uuid",
  "autoPayEnabled": true,
  "reminderDaysBefore": 3,
  "websiteUrl": "https://provider.com/pay",
  "notes": "Auto-pay enabled"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "bill": { /* created bill */ },
  "message": "Bill created successfully"
}
```

---

### PUT /api/bills/:id
**Description:** Update bill
**Authentication:** Required

**Request:**
```json
{
  "amount": 99.99,
  "reminderDaysBefore": 5
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "bill": { /* updated bill */ },
  "message": "Bill updated successfully"
}
```

---

### DELETE /api/bills/:id
**Description:** Delete a bill
**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Bill deleted successfully"
}
```

---

### POST /api/bills/:id/mark-paid
**Description:** Mark bill as paid
**Authentication:** Required

**Request:**
```json
{
  "amountPaid": 98.00,
  "datePaid": "2025-11-18",
  "accountId": "account-uuid",
  "notes": "Paid online",
  "createTransaction": true
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "payment": { /* bill payment record */ },
  "transaction": { /* created transaction if createTransaction=true */ },
  "message": "Bill marked as paid"
}
```

---

## Subscription Tracking APIs

### GET /api/subscriptions
**Description:** Get all subscriptions
**Authentication:** Required
**Query Parameters:**
- `status` (active, canceled, expired)

**Response (200 OK):**
```json
{
  "success": true,
  "subscriptions": [
    {
      "id": "subscription-uuid",
      "serviceName": "Netflix",
      "cost": 15.99,
      "billingCycle": "monthly",
      "nextBillingDate": "2025-11-22",
      "categoryId": "category-uuid",
      "accountId": "account-uuid",
      "autoRenewal": true,
      "freeTrialEndDate": null,
      "status": "active",
      "yearToDateTotal": 175.89,
      "createdAt": "2025-01-15T00:00:00Z"
    }
  ],
  "summary": {
    "monthlyTotal": 89.00,
    "yearlyTotal": 1068.00,
    "activeCount": 8,
    "upcomingRenewals": 3
  }
}
```

---

### GET /api/subscriptions/:id
**Description:** Get single subscription
**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "subscription": {
    "id": "subscription-uuid",
    "serviceName": "Netflix",
    "cost": 15.99,
    "billingHistory": [
      { "date": "2025-11-01", "amount": 15.99 },
      { "date": "2025-10-01", "amount": 15.99 }
    ],
    "totalPaid": 175.89
  }
}
```

---

### POST /api/subscriptions
**Description:** Create a subscription
**Authentication:** Required

**Request:**
```json
{
  "serviceName": "Spotify Premium",
  "cost": 9.99,
  "billingCycle": "monthly",
  "nextBillingDate": "2025-12-01",
  "categoryId": "category-uuid",
  "accountId": "account-uuid",
  "autoRenewal": true,
  "freeTrialEndDate": null,
  "cancelUrl": "https://spotify.com/cancel",
  "notes": "Premium plan"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "subscription": { /* created subscription */ },
  "message": "Subscription added successfully"
}
```

---

### PUT /api/subscriptions/:id
**Description:** Update subscription
**Authentication:** Required

**Request:**
```json
{
  "cost": 10.99,
  "nextBillingDate": "2025-12-15"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "subscription": { /* updated subscription */ },
  "message": "Subscription updated successfully"
}
```

---

### DELETE /api/subscriptions/:id
**Description:** Delete a subscription
**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Subscription deleted successfully"
}
```

---

### POST /api/subscriptions/:id/cancel
**Description:** Mark subscription as canceled
**Authentication:** Required

**Request:**
```json
{
  "cancellationDate": "2025-11-18",
  "finalBillingDate": "2025-12-01",
  "cancellationReason": "too_expensive",
  "notes": "Switching to free tier"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "subscription": { /* updated subscription with canceled status */ },
  "message": "Subscription marked as canceled"
}
```

---

## Investment APIs

### GET /api/investments
**Description:** Get all investments
**Authentication:** Required
**Query Parameters:**
- `accountId` (optional)
- `assetType` (optional: stock, bond, etf, mutual_fund, crypto)

**Response (200 OK):**
```json
{
  "success": true,
  "investments": [
    {
      "id": "investment-uuid",
      "accountId": "account-uuid",
      "symbol": "AAPL",
      "name": "Apple Inc.",
      "assetType": "stock",
      "shares": 10.5,
      "costBasis": 1575.00,
      "currentPrice": 185.50,
      "currentValue": 1947.75,
      "gainLoss": 372.75,
      "gainLossPercentage": 23.67,
      "lastUpdatedAt": "2025-11-18T16:00:00Z"
    }
  ],
  "summary": {
    "totalValue": 24340.00,
    "totalCostBasis": 20000.00,
    "totalGainLoss": 4340.00,
    "totalGainLossPercentage": 21.7
  }
}
```

---

### GET /api/investments/:id
**Description:** Get single investment
**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "investment": {
    "id": "investment-uuid",
    "symbol": "AAPL",
    "name": "Apple Inc.",
    "priceHistory": [
      { "date": "2025-11-18", "price": 185.50 },
      { "date": "2025-11-17", "price": 184.25 }
    ]
  }
}
```

---

### POST /api/investments
**Description:** Add a new investment
**Authentication:** Required

**Request:**
```json
{
  "accountId": "account-uuid",
  "symbol": "MSFT",
  "name": "Microsoft Corporation",
  "assetType": "stock",
  "shares": 5,
  "costBasis": 1850.00,
  "purchaseDate": "2025-11-01",
  "notes": "Tech sector investment"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "investment": { /* created investment */ },
  "message": "Investment added successfully"
}
```

---

### PUT /api/investments/:id
**Description:** Update investment
**Authentication:** Required

**Request:**
```json
{
  "shares": 7.5,
  "costBasis": 2775.00
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "investment": { /* updated investment */ },
  "message": "Investment updated successfully"
}
```

---

### DELETE /api/investments/:id
**Description:** Delete an investment
**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Investment deleted successfully"
}
```

---

### POST /api/investments/sync-prices
**Description:** Update current prices for all investments
**Authentication:** Required

**Request:**
```json
{}
```

**Response (200 OK):**
```json
{
  "success": true,
  "updated": 15,
  "failed": 0,
  "message": "Investment prices updated successfully"
}
```

---

## Analytics APIs

### GET /api/analytics/net-worth
**Description:** Get net worth trend over time
**Authentication:** Required
**Query Parameters:**
- `period` (1m, 3m, 6m, 1y, all, custom)
- `startDate` (if period=custom)
- `endDate` (if period=custom)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    { "date": "2025-06-01", "value": 41000.00, "assets": 45000.00, "liabilities": 4000.00 },
    { "date": "2025-07-01", "value": 42500.00, "assets": 46700.00, "liabilities": 4200.00 },
    { "date": "2025-11-18", "value": 48555.00, "assets": 52680.00, "liabilities": 4125.00 }
  ],
  "current": 48555.00,
  "change": 7555.00,
  "changePercent": 18.4,
  "periodStart": 41000.00,
  "periodEnd": 48555.00
}
```

---

### GET /api/analytics/cash-flow
**Description:** Get income vs expenses trend
**Authentication:** Required
**Query Parameters:**
- `period` (1m, 3m, 6m, 1y, all)
- `groupBy` (day, week, month)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "month": "2025-06",
      "income": 5200.00,
      "expenses": 3300.00,
      "net": 1900.00,
      "savingsRate": 36.5
    },
    {
      "month": "2025-11",
      "income": 6165.00,
      "expenses": 3892.00,
      "net": 2273.00,
      "savingsRate": 36.8
    }
  ],
  "summary": {
    "totalIncome": 36990.00,
    "totalExpenses": 23352.00,
    "totalNet": 13638.00,
    "averageSavingsRate": 36.9
  }
}
```

---

### GET /api/analytics/spending-by-category
**Description:** Get spending breakdown by category
**Authentication:** Required
**Query Parameters:**
- `startDate` (YYYY-MM-DD)
- `endDate` (YYYY-MM-DD)
- `limit` (default: 10)

**Response (200 OK):**
```json
{
  "success": true,
  "categories": [
    {
      "categoryId": "category-uuid",
      "categoryName": "Housing",
      "categoryIcon": "🏠",
      "categoryColor": "#3b82f6",
      "amount": 1800.00,
      "percentage": 46.2,
      "transactionCount": 1,
      "averageTransaction": 1800.00
    },
    {
      "categoryId": "category-uuid-2",
      "categoryName": "Groceries",
      "categoryIcon": "🛒",
      "categoryColor": "#10b981",
      "amount": 892.00,
      "percentage": 22.9,
      "transactionCount": 8,
      "averageTransaction": 111.50
    }
  ],
  "total": 3892.00,
  "periodStart": "2025-11-01",
  "periodEnd": "2025-11-30"
}
```

---

### GET /api/analytics/spending-trends
**Description:** Get spending trends and patterns
**Authentication:** Required
**Query Parameters:**
- `categoryId` (optional)
- `period` (1m, 3m, 6m, 1y)

**Response (200 OK):**
```json
{
  "success": true,
  "trends": {
    "averageMonthly": 3892.00,
    "highestMonth": {
      "month": "2025-11",
      "amount": 4200.00
    },
    "lowestMonth": {
      "month": "2025-08",
      "amount": 3200.00
    },
    "trend": "increasing",
    "changePercent": 8.5
  }
}
```

---

### GET /api/analytics/forecast
**Description:** Get cash flow forecast
**Authentication:** Required
**Query Parameters:**
- `months` (default: 6, max: 12)

**Response (200 OK):**
```json
{
  "success": true,
  "forecast": [
    {
      "month": "2025-12",
      "projectedIncome": 6165.00,
      "projectedExpenses": 3900.00,
      "projectedNet": 2265.00,
      "confidence": 0.85
    }
  ],
  "assumptions": [
    "Based on last 6 months average",
    "Includes recurring bills and subscriptions",
    "Income assumed constant"
  ]
}
```

---

### GET /api/analytics/top-merchants
**Description:** Get top spending merchants
**Authentication:** Required
**Query Parameters:**
- `startDate` (YYYY-MM-DD)
- `endDate` (YYYY-MM-DD)
- `limit` (default: 10)

**Response (200 OK):**
```json
{
  "success": true,
  "merchants": [
    {
      "merchant": "Whole Foods Market",
      "totalSpent": 892.00,
      "transactionCount": 8,
      "averageTransaction": 111.50,
      "category": "Groceries"
    }
  ]
}
```

---

### GET /api/analytics/unusual-spending
**Description:** Detect unusual spending patterns
**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "alerts": [
    {
      "type": "large_transaction",
      "transaction": { /* transaction object */ },
      "reason": "Transaction 3x larger than category average",
      "severity": "medium"
    },
    {
      "type": "budget_exceeded",
      "category": "Dining Out",
      "budgetedAmount": 400.00,
      "actualAmount": 485.00,
      "percentOver": 21.25,
      "severity": "high"
    }
  ]
}
```

---

## Report APIs

### GET /api/reports
**Description:** Get all saved reports
**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "reports": [
    {
      "id": "report-uuid",
      "name": "Monthly Summary",
      "reportType": "expenses",
      "isTemplate": false,
      "scheduleFrequency": "monthly",
      "lastGeneratedAt": "2025-11-01T00:00:00Z",
      "createdAt": "2025-01-01T00:00:00Z"
    }
  ]
}
```

---

### GET /api/reports/:id
**Description:** Get single report details
**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "report": {
    "id": "report-uuid",
    "name": "Monthly Summary",
    "reportType": "expenses",
    "config": {
      "startDate": "2025-11-01",
      "endDate": "2025-11-30",
      "groupBy": "category",
      "includeCharts": true
    }
  }
}
```

---

### POST /api/reports
**Description:** Create a custom report
**Authentication:** Required

**Request:**
```json
{
  "name": "Q4 2025 Tax Report",
  "reportType": "tax",
  "config": {
    "startDate": "2025-10-01",
    "endDate": "2025-12-31",
    "accountIds": ["account-uuid-1", "account-uuid-2"],
    "categoryIds": ["category-uuid"],
    "groupBy": "month",
    "includeCharts": true,
    "includeTransactionsList": true
  },
  "isTemplate": false
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "report": { /* created report */ },
  "message": "Report created successfully"
}
```

---

### POST /api/reports/:id/generate
**Description:** Generate report file (PDF/Excel/CSV)
**Authentication:** Required
**Query Parameters:**
- `format` (pdf, xlsx, csv)

**Request:**
```json
{}
```

**Response (200 OK):**
```json
{
  "success": true,
  "reportUrl": "https://s3.amazonaws.com/reports/report-uuid.pdf",
  "expiresAt": "2025-11-19T00:00:00Z",
  "message": "Report generated successfully"
}
```

---

### POST /api/reports/:id/schedule
**Description:** Schedule automatic report generation
**Authentication:** Required

**Request:**
```json
{
  "frequency": "monthly",
  "deliveryMethod": "email",
  "recipients": ["user@example.com"],
  "format": "pdf",
  "dayOfMonth": 1
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Report scheduled successfully",
  "nextGeneration": "2025-12-01T00:00:00Z"
}
```

---

### DELETE /api/reports/:id
**Description:** Delete a report
**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Report deleted successfully"
}
```

---

## Notification APIs

### GET /api/notifications
**Description:** Get all notifications
**Authentication:** Required
**Query Parameters:**
- `unreadOnly` (default: false)
- `limit` (default: 20)
- `page` (default: 1)
- `type` (optional: filter by notification type)

**Response (200 OK):**
```json
{
  "success": true,
  "notifications": [
    {
      "id": "notification-uuid",
      "type": "budget_alert",
      "title": "Budget Alert: Dining Out",
      "message": "You've exceeded your dining budget by $85",
      "actionUrl": "/app/budget",
      "isRead": false,
      "isArchived": false,
      "metadata": {
        "categoryId": "category-uuid",
        "budgetId": "budget-uuid",
        "amountOver": 85.00
      },
      "createdAt": "2025-11-18T10:00:00Z"
    }
  ],
  "unreadCount": 3,
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 47,
    "totalPages": 3
  }
}
```

---

### GET /api/notifications/:id
**Description:** Get single notification
**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "notification": { /* full notification object */ }
}
```

---

### PUT /api/notifications/:id/read
**Description:** Mark notification as read
**Authentication:** Required

**Request:**
```json
{}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

---

### PUT /api/notifications/mark-all-read
**Description:** Mark all notifications as read
**Authentication:** Required

**Request:**
```json
{}
```

**Response (200 OK):**
```json
{
  "success": true,
  "markedCount": 12,
  "message": "All notifications marked as read"
}
```

---

### DELETE /api/notifications/:id
**Description:** Delete a notification
**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Notification deleted successfully"
}
```

---

### POST /api/notifications/:id/archive
**Description:** Archive a notification
**Authentication:** Required

**Request:**
```json
{}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Notification archived"
}
```

---

## Settings APIs

### GET /api/settings/profile
**Description:** Get user profile
**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "profile": {
    "id": "user-uuid",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "avatarUrl": "https://s3.amazonaws.com/avatars/user-uuid.jpg",
    "dateOfBirth": "1990-01-15",
    "timezone": "America/New_York",
    "currency": "USD",
    "fiscalYearStart": 1,
    "dateFormat": "MM/DD/YYYY",
    "createdAt": "2025-01-01T00:00:00Z"
  }
}
```

---

### PUT /api/settings/profile
**Description:** Update user profile
**Authentication:** Required

**Request:**
```json
{
  "fullName": "John David Doe",
  "phone": "+1234567890",
  "timezone": "America/Los_Angeles",
  "currency": "USD",
  "avatarFile": "base64-encoded-image"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "profile": { /* updated profile */ },
  "message": "Profile updated successfully"
}
```

---

### PUT /api/settings/password
**Description:** Change password
**Authentication:** Required

**Request:**
```json
{
  "currentPassword": "CurrentPass123!",
  "newPassword": "NewSecurePass123!",
  "confirmPassword": "NewSecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Errors:**
- `400` - Current password incorrect
- `400` - Passwords don't match
- `400` - Weak password

---

### POST /api/settings/2fa/enable
**Description:** Enable two-factor authentication
**Authentication:** Required

**Request:**
```json
{}
```

**Response (200 OK):**
```json
{
  "success": true,
  "qrCode": "data:image/png;base64,...",
  "secret": "JBSWY3DPEHPK3PXP",
  "backupCodes": [
    "12345678",
    "87654321",
    ...
  ],
  "message": "2FA setup initiated. Please verify with code."
}
```

---

### POST /api/settings/2fa/verify
**Description:** Verify and activate 2FA
**Authentication:** Required

**Request:**
```json
{
  "code": "123456"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "2FA enabled successfully"
}
```

**Errors:**
- `400` - Invalid verification code

---

### POST /api/settings/2fa/disable
**Description:** Disable two-factor authentication
**Authentication:** Required

**Request:**
```json
{
  "password": "CurrentPass123!",
  "code": "123456"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "2FA disabled successfully"
}
```

---

### GET /api/settings/preferences
**Description:** Get user preferences
**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "preferences": {
    "theme": "dark",
    "language": "en",
    "notificationsEmail": {
      "budgetAlerts": true,
      "billReminders": true,
      "goalMilestones": true,
      "weeklySummary": true,
      "monthlyReport": true,
      "productUpdates": false,
      "marketingEmails": false
    },
    "notificationsPush": {
      "budgetAlerts": true,
      "billReminders": true,
      "largeTransactions": true
    },
    "notificationsSms": {
      "billReminders": false
    },
    "digestFrequency": "daily",
    "quietHoursStart": "22:00",
    "quietHoursEnd": "08:00",
    "defaultDashboardView": "overview"
  }
}
```

---

### PUT /api/settings/preferences
**Description:** Update user preferences
**Authentication:** Required

**Request:**
```json
{
  "theme": "light",
  "notificationsEmail": {
    "budgetAlerts": true,
    "marketingEmails": false
  },
  "digestFrequency": "weekly"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "preferences": { /* updated preferences */ },
  "message": "Preferences updated successfully"
}
```

---

### GET /api/settings/sessions
**Description:** Get active sessions
**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "sessions": [
    {
      "id": "session-uuid",
      "deviceInfo": {
        "browser": "Chrome 119",
        "os": "Windows 11",
        "deviceType": "desktop"
      },
      "ipAddress": "192.168.1.1",
      "isCurrent": true,
      "createdAt": "2025-11-18T10:00:00Z",
      "expiresAt": "2025-12-18T10:00:00Z"
    }
  ]
}
```

---

### DELETE /api/settings/sessions/:id
**Description:** Revoke a session
**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Session revoked successfully"
}
```

---

### DELETE /api/settings/account
**Description:** Delete user account
**Authentication:** Required

**Request:**
```json
{
  "password": "CurrentPass123!",
  "confirmationText": "DELETE",
  "reason": "Not using the app anymore"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Account scheduled for deletion. You have 30 days to cancel.",
  "deletionDate": "2025-12-18T00:00:00Z"
}
```

**Errors:**
- `400` - Incorrect password
- `400` - Confirmation text doesn't match

---

## Subscription & Billing APIs
*(App subscription, not tracking user subscriptions)*

### GET /api/subscription/current
**Description:** Get current subscription plan
**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "subscription": {
    "plan": "plus",
    "status": "active",
    "startsAt": "2025-01-01T00:00:00Z",
    "endsAt": "2026-01-01T00:00:00Z",
    "cancelAtPeriodEnd": false,
    "trialEndsAt": null,
    "features": [
      "Unlimited accounts",
      "Plaid bank sync",
      "Advanced analytics",
      "Custom reports",
      "Priority support"
    ]
  }
}
```

---

### POST /api/subscription/upgrade
**Description:** Upgrade subscription plan
**Authentication:** Required

**Request:**
```json
{
  "plan": "family",
  "billingCycle": "yearly",
  "paymentMethodId": "pm_stripe_xxx"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "subscription": { /* updated subscription */ },
  "message": "Subscription upgraded successfully",
  "proratedAmount": 50.00
}
```

---

### POST /api/subscription/downgrade
**Description:** Downgrade subscription plan
**Authentication:** Required

**Request:**
```json
{
  "plan": "basic"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "subscription": { /* updated subscription */ },
  "message": "Subscription downgraded. Changes take effect at end of billing period.",
  "effectiveDate": "2026-01-01T00:00:00Z"
}
```

---

### POST /api/subscription/cancel
**Description:** Cancel subscription
**Authentication:** Required

**Request:**
```json
{
  "reason": "too_expensive",
  "feedback": "Great app but too costly for my needs"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Subscription canceled. Access continues until 2026-01-01",
  "endsAt": "2026-01-01T00:00:00Z"
}
```

---

### POST /api/subscription/reactivate
**Description:** Reactivate canceled subscription
**Authentication:** Required

**Request:**
```json
{}
```

**Response (200 OK):**
```json
{
  "success": true,
  "subscription": { /* reactivated subscription */ },
  "message": "Subscription reactivated successfully"
}
```

---

### GET /api/subscription/invoices
**Description:** Get billing invoices
**Authentication:** Required
**Query Parameters:**
- `limit` (default: 12)

**Response (200 OK):**
```json
{
  "success": true,
  "invoices": [
    {
      "id": "invoice-uuid",
      "date": "2025-11-01",
      "amount": 99.00,
      "status": "paid",
      "invoiceUrl": "https://invoice.stripe.com/...",
      "downloadUrl": "https://s3.amazonaws.com/invoices/..."
    }
  ]
}
```

---

### POST /api/subscription/payment-method
**Description:** Update payment method
**Authentication:** Required

**Request:**
```json
{
  "paymentMethodId": "pm_stripe_new_xxx"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Payment method updated successfully"
}
```

---

### POST /api/plaid/create-link-token
**Description:** Create Plaid Link token
**Authentication:** Required

**Request:**
```json
{}
```

**Response (200 OK):**
```json
{
  "success": true,
  "linkToken": "link-sandbox-xxx-xxx",
  "expiresAt": "2025-11-18T14:00:00Z"
}
```

---

## Error Codes Reference

### HTTP Status Codes
- `200` - OK (Success)
- `201` - Created (Resource created successfully)
- `400` - Bad Request (Validation error, malformed request)
- `401` - Unauthorized (Invalid or missing authentication token)
- `403` - Forbidden (Valid auth but insufficient permissions)
- `404` - Not Found (Resource doesn't exist)
- `409` - Conflict (Resource already exists, e.g., duplicate email)
- `413` - Payload Too Large (File upload exceeds limit)
- `429` - Too Many Requests (Rate limit exceeded)
- `500` - Internal Server Error (Unexpected server error)
- `503` - Service Unavailable (Maintenance mode or external service down)

### Custom Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      },
      {
        "field": "password",
        "message": "Password must be at least 8 characters"
      }
    ]
  },
  "requestId": "req_550e8400-e29b-41d4-a716-446655440000"
}
```

### Common Error Codes
- `VALIDATION_ERROR` - Input validation failed
- `AUTHENTICATION_FAILED` - Invalid credentials
- `TOKEN_EXPIRED` - JWT token has expired
- `RESOURCE_NOT_FOUND` - Requested resource doesn't exist
- `DUPLICATE_RESOURCE` - Resource already exists
- `INSUFFICIENT_PERMISSIONS` - User lacks required permissions
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `EXTERNAL_SERVICE_ERROR` - Third-party service (Plaid, Stripe) error
- `DATABASE_ERROR` - Database operation failed

---

## Rate Limiting

**Global Rate Limits:**
- Authenticated requests: 1000 requests per hour per user
- Unauthenticated requests: 100 requests per hour per IP
- File uploads: 50 uploads per hour per user

**Endpoint-Specific Limits:**
- `POST /api/auth/signup`: 5 per hour per IP
- `POST /api/auth/login`: 10 per 15 minutes per IP
- `POST /api/auth/forgot-password`: 3 per hour per IP
- `POST /api/transactions/import`: 10 per hour per user
- `GET /api/analytics/*`: 100 per hour per user

**Rate Limit Headers:**
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 987
X-RateLimit-Reset: 1700326800
```

---

## Pagination

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 50, max: 200)

**Response Format:**
```json
{
  "data": [ /* items */ ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 142,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## Authentication

**Header Format:**
```
Authorization: Bearer <jwt-token>
```

**Token Lifetime:**
- Standard: 7 days
- Remember Me: 30 days
- Refresh before expiration via `/api/auth/refresh`

---

## Webhooks

### Plaid Webhooks
**Endpoint:** `POST /api/webhooks/plaid`

**Events:**
- `INITIAL_UPDATE` - Initial transaction data available
- `HISTORICAL_UPDATE` - Historical data available
- `DEFAULT_UPDATE` - New transactions available
- `TRANSACTIONS_REMOVED` - Transactions deleted
- `ERROR` - Item error occurred

### Stripe Webhooks
**Endpoint:** `POST /api/webhooks/stripe`

**Events:**
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

---

**API Version:** v1
**Last Updated:** November 18, 2025
**Total Endpoints:** 85+

For additional support, contact: api-support@financeos.com
