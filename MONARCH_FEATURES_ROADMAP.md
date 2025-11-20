# Monarch Money Features - Implementation Roadmap

This document outlines how to achieve all the premium features similar to Monarch Money (monarchmoney.com).

## ✅ Already Implemented

### Core Features
- ✅ **Net Worth Tracking** - Dashboard shows total assets vs liabilities
- ✅ **Transaction Management** - Add, edit, delete transactions
- ✅ **Budget Management** - Multi-category budgets with alerts
- ✅ **Goals Tracking** - Savings goals with progress visualization
- ✅ **Analytics Dashboard** - Charts and spending insights
- ✅ **Beautiful Landing Page** - Dashboard preview with animated charts
- ✅ **User Profiles** - Settings, logout, authentication
- ✅ **Responsive Design** - Mobile-friendly UI

## 🚀 Next Phase: Monarch-Level Features

### 1. Investment Portfolio Tracking

**Features to Add:**
- Real-time stock prices and portfolio values
- Investment performance tracking
- Asset allocation pie charts
- Dividend tracking
- Cost basis and tax lot tracking

**Implementation:**
```typescript
// Database Schema (add to schema.prisma)
model Investment {
  id            String   @id @default(cuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id])
  symbol        String   // Stock ticker (AAPL, TSLA, etc.)
  name          String   // Company/Asset name
  type          String   // "stock" | "etf" | "crypto" | "bond"
  shares        Decimal
  avgCostBasis  Decimal  // Average purchase price
  accountId     String?
  account       Account? @relation(fields: [accountId], references: [id])
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model InvestmentTransaction {
  id              String   @id @default(cuid())
  userId          String
  investmentId    String
  investment      Investment @relation(fields: [investmentId], references: [id])
  type            String   // "buy" | "sell" | "dividend"
  shares          Decimal
  pricePerShare   Decimal
  totalAmount     Decimal
  fees            Decimal  @default(0)
  date            DateTime
  createdAt       DateTime @default(now())
}

// Stock Price Service (lib/services/stock-service.ts)
import axios from 'axios'

export class StockService {
  private apiKey = process.env.ALPHA_VANTAGE_KEY

  async getCurrentPrice(symbol: string): Promise<number> {
    const response = await axios.get(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.apiKey}`
    )
    return parseFloat(response.data['Global Quote']['05. price'])
  }

  async getHistoricalPrices(symbol: string, period: '1M' | '3M' | '1Y'): Promise<PriceData[]> {
    const response = await axios.get(
      `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${this.apiKey}`
    )
    // Parse and return price data
  }
}

// Portfolio Component (components/investments/portfolio-overview.tsx)
export function PortfolioOverview() {
  const [portfolio, setPortfolio] = useState<Investment[]>([])
  const [prices, setPrices] = useState<Map<string, number>>(new Map())

  useEffect(() => {
    fetchPortfolio()
    // Update prices every minute
    const interval = setInterval(fetchPrices, 60000)
    return () => clearInterval(interval)
  }, [])

  const calculatePortfolioValue = () => {
    return portfolio.reduce((total, investment) => {
      const currentPrice = prices.get(investment.symbol) || 0
      return total + (parseFloat(investment.shares.toString()) * currentPrice)
    }, 0)
  }

  const calculateTotalReturn = () => {
    return portfolio.reduce((total, investment) => {
      const currentPrice = prices.get(investment.symbol) || 0
      const currentValue = parseFloat(investment.shares.toString()) * currentPrice
      const costBasis = parseFloat(investment.shares.toString()) * parseFloat(investment.avgCostBasis.toString())
      return total + (currentValue - costBasis)
    }, 0)
  }
}
```

**APIs to Use:**
- **Alpha Vantage** (Free tier: 5 API calls/min) - https://www.alphavantage.co/
- **Finnhub** (Free tier: 60 calls/min) - https://finnhub.io/
- **IEX Cloud** (Free tier: 50k messages/month) - https://iexcloud.io/

### 2. Recurring Transaction Detection

**Algorithm:**
```typescript
// lib/algorithms/recurring-detector.ts
export class RecurringTransactionDetector {
  detectRecurring(transactions: Transaction[]): RecurringPattern[] {
    const patterns: RecurringPattern[] = []
    const merchants = groupByMerchant(transactions)

    merchants.forEach((transactionGroup, merchant) => {
      if (transactionGroup.length < 3) return // Need at least 3 occurrences

      // Sort by date
      transactionGroup.sort((a, b) => a.date.getTime() - b.date.getTime())

      // Calculate intervals between transactions
      const intervals: number[] = []
      for (let i = 1; i < transactionGroup.length; i++) {
        const daysBetween = Math.round(
          (transactionGroup[i].date.getTime() - transactionGroup[i-1].date.getTime()) / (1000 * 60 * 60 * 24)
        )
        intervals.push(daysBetween)
      }

      // Check if intervals are consistent (within 3 days variance)
      const avgInterval = intervals.reduce((sum, val) => sum + val, 0) / intervals.length
      const isConsistent = intervals.every(interval => Math.abs(interval - avgInterval) <= 3)

      if (isConsistent) {
        const avgAmount = transactionGroup.reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0) / transactionGroup.length

        patterns.push({
          merchant,
          frequency: avgInterval <= 31 ? 'monthly' : avgInterval <= 93 ? 'quarterly' : 'yearly',
          averageAmount: avgAmount,
          nextExpectedDate: new Date(transactionGroup[transactionGroup.length - 1].date.getTime() + avgInterval * 24 * 60 * 60 * 1000),
          confidence: calculateConfidence(intervals)
        })
      }
    })

    return patterns
  }
}
```

### 3. Cash Flow Forecasting

```typescript
// lib/algorithms/cash-flow-forecaster.ts
export class CashFlowForecaster {
  forecast(historicalData: MonthlyData[], monthsAhead: number = 6): Forecast[] {
    const forecasts: Forecast[] = []

    // Use exponential smoothing for prediction
    const alpha = 0.3 // Smoothing factor
    let lastIncome = historicalData[historicalData.length - 1].income
    let lastExpenses = historicalData[historicalData.length - 1].expenses

    for (let i = 1; i <= monthsAhead; i++) {
      // Calculate seasonal adjustment
      const seasonalFactor = this.getSeasonalFactor(new Date().getMonth() + i)

      // Exponential smoothing forecast
      const forecastedIncome = lastIncome * (1 + seasonalFactor)
      const forecastedExpenses = lastExpenses * (1 + seasonalFactor)

      forecasts.push({
        month: new Date(Date.now() + i * 30 * 24 * 60 * 60 * 1000),
        predictedIncome: forecastedIncome,
        predictedExpenses: forecastedExpenses,
        predictedSavings: forecastedIncome - forecastedExpenses,
        confidence: Math.max(0.5, 1 - (i * 0.1)) // Confidence decreases over time
      })

      // Update for next iteration
      lastIncome = forecastedIncome
      lastExpenses = forecastedExpenses
    }

    return forecasts
  }

  private getSeasonalFactor(month: number): number {
    // Seasonal adjustments (December has higher spending, etc.)
    const seasonalFactors = {
      0: 0.05,   // January
      11: 0.15,  // December (holiday spending)
      // ... other months
    }
    return seasonalFactors[month] || 0
  }
}
```

### 4. Financial News RSS Feeds

```bash
# Install RSS parser
npm install rss-parser
```

```typescript
// lib/services/news-service.ts
import Parser from 'rss-parser'

export class FinancialNewsService {
  private parser = new Parser()

  // Premium financial news sources
  private feeds = {
    market: [
      'https://feeds.bloomberg.com/markets/news.rss',
      'https://www.cnbc.com/id/100003114/device/rss/rss.html',
      'https://www.investing.com/rss/news.rss',
      'https://www.marketwatch.com/rss/topstories'
    ],
    personal_finance: [
      'https://www.nerdwallet.com/blog/feed/',
      'https://www.thebalance.com/rss',
      'https://www.moneyunder30.com/feed'
    ],
    crypto: [
      'https://cointelegraph.com/rss',
      'https://www.coindesk.com/arc/outboundfeeds/rss/'
    ]
  }

  async getPersonalizedNews(userId: string): Promise<NewsItem[]> {
    const userProfile = await this.getUserProfile(userId)
    const news: NewsItem[] = []

    // Get news for user's holdings
    if (userProfile.hasInvestments) {
      const symbols = await this.getUserInvestmentSymbols(userId)
      for (const symbol of symbols) {
        const stockNews = await this.getStockNews(symbol)
        news.push(...stockNews)
      }
    }

    // Get general financial news
    const generalNews = await this.getNews('personal_finance', 10)
    news.push(...generalNews)

    return this.deduplicateAndSort(news).slice(0, 20)
  }

  async getStockNews(symbol: string): Promise<NewsItem[]> {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${symbol}&apikey=${process.env.ALPHA_VANTAGE_KEY}`
    )
    const data = await response.json()
    return data.feed
  }
}
```

### 5. AI-Powered Insights

```typescript
// lib/services/ai-insights.ts
export class AIInsightsService {
  async generateInsights(userId: string): Promise<Insight[]> {
    const insights: Insight[] = []

    // 1. Spending Anomaly Detection
    const spendingAnomalies = await this.detectSpendingAnomalies(userId)
    if (spendingAnomalies.length > 0) {
      insights.push({
        type: 'warning',
        priority: 'high',
        title: 'Unusual Spending Detected',
        message: `You've spent ${spendingAnomalies[0].percentIncrease}% more than usual on ${spendingAnomalies[0].category} this month.`,
        action: {
          label: 'Review Transactions',
          link: `/app/transactions?category=${spendingAnomalies[0].category}`
        }
      })
    }

    // 2. Subscription Waste Detection
    const unusedSubscriptions = await this.findUnusedSubscriptions(userId)
    if (unusedSubscriptions.length > 0) {
      const potentialSavings = unusedSubscriptions.reduce((sum, sub) => sum + sub.monthlyAmount, 0)
      insights.push({
        type: 'opportunity',
        priority: 'medium',
        title: `Save $${potentialSavings}/mo on Unused Subscriptions`,
        message: `We detected ${unusedSubscriptions.length} subscriptions you might not be using.`,
        action: {
          label: 'Review Subscriptions',
          link: '/app/subscriptions'
        }
      })
    }

    // 3. Budget Performance
    const budgetPerformance = await this.analyzeBudgetPerformance(userId)
    if (budgetPerformance.overBudgetCategories.length > 0) {
      insights.push({
        type: 'alert',
        priority: 'high',
        title: 'Budget Alert',
        message: `You're over budget in ${budgetPerformance.overBudgetCategories.length} categories.`,
        action: {
          label: 'Adjust Budget',
          link: '/app/budgets'
        }
      })
    }

    // 4. Savings Opportunities
    const savingsRate = await this.calculateSavingsRate(userId)
    if (savingsRate < 20) {
      insights.push({
        type: 'tip',
        priority: 'low',
        title: 'Increase Your Savings',
        message: `Your savings rate is ${savingsRate}%. Consider setting aside ${this.suggestSavingsIncrease(userId)}/mo more.`,
        action: {
          label: 'Set Savings Goal',
          link: '/app/goals'
        }
      })
    }

    // 5. Investment Diversification
    const portfolio = await this.analyzePortfolioDiversification(userId)
    if (portfolio.isDiversified === false) {
      insights.push({
        type: 'recommendation',
        priority: 'medium',
        title: 'Diversify Your Portfolio',
        message: `${portfolio.concentration}% of your portfolio is in ${portfolio.topHolding}. Consider diversifying to reduce risk.`,
        action: {
          label: 'See Recommendations',
          link: '/app/investments/recommendations'
        }
      })
    }

    return insights.sort((a, b) => priorityScore(b) - priorityScore(a))
  }

  private async detectSpendingAnomalies(userId: string) {
    const last90Days = await this.getTransactions(userId, 90)
    const categorySpending = this.groupByCategory(last90Days)

    const anomalies = []
    for (const [category, transactions] of categorySpending) {
      const thisMonthSpending = transactions
        .filter(t => isThisMonth(t.date))
        .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0)

      const avgMonthlySpending = transactions.reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0) / 3

      if (thisMonthSpending > avgMonthlySpending * 1.5) { // 50% increase
        anomalies.push({
          category,
          thisMonth: thisMonthSpending,
          average: avgMonthlySpending,
          percentIncrease: ((thisMonthSpending - avgMonthlySpending) / avgMonthlySpending * 100).toFixed(0)
        })
      }
    }

    return anomalies
  }
}
```

### 6. Collaborative Features (Monarch's Family Plan)

```typescript
// Database Schema
model HouseholdMember {
  id          String   @id @default(cuid())
  householdId String
  household   Household @relation(fields: [householdId], references: [id])
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  role        String   // "owner" | "admin" | "member"
  permissions Json     // { canViewAll: true, canEdit: true, canDelete: false }
  createdAt   DateTime @default(now())
}

model Household {
  id        String   @id @default(cuid())
  name      String
  members   HouseholdMember[]
  budgets   Budget[]
  goals     Goal[]
  createdAt DateTime @default(now())
}

// API Endpoint (app/api/household/invite/route.ts)
export async function POST(req: NextRequest) {
  const { email, role } = await req.json()
  const user = await getCurrentUser()

  // Check if user is household owner
  const household = await db.household.findFirst({
    where: {
      members: {
        some: {
          userId: user.id,
          role: 'owner'
        }
      }
    }
  })

  if (!household) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
  }

  // Send invitation email
  await sendHouseholdInvitation(email, household.id, role)

  return NextResponse.json({ success: true })
}
```

### 7. Custom Reports & Export

```typescript
// lib/services/report-generator.ts
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

export class ReportGenerator {
  async generateMonthlyReport(userId: string, month: Date): Promise<Buffer> {
    const data = await this.getMonthlyData(userId, month)

    const doc = new jsPDF()

    // Header
    doc.setFontSize(20)
    doc.text('Monthly Financial Report', 20, 20)
    doc.setFontSize(12)
    doc.text(`${month.toLocaleString('default', { month: 'long', year: 'numeric' })}`, 20, 30)

    // Summary Section
    doc.setFontSize(14)
    doc.text('Summary', 20, 45)

    autoTable(doc, {
      startY: 50,
      head: [['Metric', 'Amount']],
      body: [
        ['Total Income', `$${data.totalIncome.toLocaleString()}`],
        ['Total Expenses', `$${data.totalExpenses.toLocaleString()}`],
        ['Net Savings', `$${(data.totalIncome - data.totalExpenses).toLocaleString()}`],
        ['Savings Rate', `${((data.totalIncome - data.totalExpenses) / data.totalIncome * 100).toFixed(1)}%`],
      ]
    })

    // Category Breakdown
    doc.addPage()
    doc.text('Spending by Category', 20, 20)

    autoTable(doc, {
      startY: 30,
      head: [['Category', 'Amount', '% of Total']],
      body: data.categoryBreakdown.map(cat => [
        cat.name,
        `$${cat.amount.toLocaleString()}`,
        `${(cat.amount / data.totalExpenses * 100).toFixed(1)}%`
      ])
    })

    return doc.output('arraybuffer')
  }
}
```

## 🎨 UI/UX Improvements (Monarch-Level Polish)

### Landing Page Enhancements
- ✅ **Animated Charts** - Implemented in `components/landing/animated-chart.tsx`
- ✅ **Dashboard Preview** - Live preview in `components/landing/dashboard-preview.tsx`
- ✅ **Floating Cards** - Animated stat cards
- ✅ **Gradient Effects** - Modern glassmorphism design

### Dashboard Improvements Needed
1. **Smart Insights Widget** - Show AI-generated insights prominently
2. **Quick Actions** - One-click access to common tasks
3. **Spending Trends Graph** - 6-month spending comparison
4. **Upcoming Bills** - Predict and show upcoming recurring charges
5. **Financial Health Score** - Overall score (0-100) with breakdown

## 📊 Monarch Feature Comparison

| Feature | Monarch | FinanceOS (Current) | Priority |
|---------|---------|-------------------|----------|
| Net Worth Tracking | ✅ | ✅ | - |
| Budget Management | ✅ | ✅ | - |
| Goals Tracking | ✅ | ✅ | - |
| Transaction Categorization | ✅ | ✅ | - |
| **Investment Tracking** | ✅ | ❌ | 🔥 High |
| **Recurring Detection** | ✅ | ❌ | 🔥 High |
| **Cash Flow Forecast** | ✅ | ❌ | 🔥 High |
| **Bill Reminders** | ✅ | ❌ | Medium |
| **Collaborative Budgets** | ✅ | ❌ | Medium |
| **Custom Reports** | ✅ | ✅ (Basic) | Medium |
| **Mobile Apps** | ✅ | ❌ | Low |
| **Plaid Bank Sync** | ✅ | ❌ | 🔥 High |

## 🚀 Implementation Priority

### Phase 1 (Weeks 1-2): Critical Features
1. Investment portfolio tracking
2. Stock price API integration
3. Recurring transaction detection
4. Enhanced analytics with predictions

### Phase 2 (Weeks 3-4): User Experience
1. Cash flow forecasting
2. AI-powered insights
3. Bill reminders
4. Custom report generation

### Phase 3 (Weeks 5-6): Collaborative Features
1. Household/family budgets
2. Multi-user support
3. Shared goals and budgets
4. Permission system

### Phase 4 (Weeks 7-8): Polish & Integrations
1. Plaid bank sync integration
2. Mobile-responsive improvements
3. RSS news feeds
4. Performance optimizations

## 💡 Key Differentiators

To compete with Monarch, focus on:

1. **Better Algorithm Quality** - More accurate predictions and insights
2. **Faster Performance** - Optimize for speed
3. **Cleaner UI** - Even more polished than Monarch
4. **Lower Price** - Undercut Monarch's $99/year pricing
5. **Better Customization** - More flexible categories and rules
6. **Advanced Analytics** - ML-powered insights Monarch doesn't have

## 📚 Resources

### APIs & Services
- **Stock Data**: Alpha Vantage, Finnhub, IEX Cloud
- **Crypto Data**: CoinGecko, CoinMarketCap
- **News**: RSS feeds, Alpha Vantage News
- **Bank Sync**: Plaid (when ready)

### Libraries
```bash
npm install rss-parser      # RSS feed parsing
npm install axios           # HTTP client
npm install jspdf           # PDF generation
npm install chart.js        # Chart components
npm install date-fns        # Date manipulation
npm install lodash          # Utility functions
```

Ready to start implementation? Choose a feature from Phase 1 and I'll help you build it!
