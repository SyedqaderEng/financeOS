import { requireAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Wallet, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { KPICard } from '@/components/dashboard/kpi-card';
import { CashFlowChart } from '@/components/dashboard/cash-flow-chart';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { InsightsPanel } from '@/components/dashboard/insights-panel';
import { AccountOverview } from '@/components/dashboard/account-overview';
import { UpcomingBills } from '@/components/dashboard/upcoming-bills';
import { BudgetProgress } from '@/components/dashboard/budget-progress';

export default async function DashboardPage() {
  let user;

  try {
    user = await requireAuth();
  } catch {
    redirect('/login');
  }

  // For Phase 3, we're showing sample data with modal details
  // In Phase 4+, we'll fetch actual data from the API
  const isEmpty = false;
  const isLoading = false;

  // Sample data for demonstration
  const kpiData = {
    totalBalance: {
      value: '$48,555',
      trend: { value: 5.2, label: 'this month', isPositive: true },
      description: 'Your total account balance across all connected accounts including checking, savings, and investment accounts.',
      breakdown: [
        { label: 'Checking Account', value: '$12,340', percentage: 25 },
        { label: 'Savings Account', value: '$28,450', percentage: 59 },
        { label: 'Investment Account', value: '$7,765', percentage: 16 },
      ],
      historicalData: [
        { month: 'Jul', value: '$42,120' },
        { month: 'Aug', value: '$44,890' },
        { month: 'Sep', value: '$45,230' },
        { month: 'Oct', value: '$46,100' },
        { month: 'Nov', value: '$48,555' },
      ],
    },
    monthlyIncome: {
      value: '$8,250',
      trend: { value: 3.1, label: 'this month', isPositive: true },
      description: 'Total income received this month from all sources including salary, freelance work, and passive income.',
      breakdown: [
        { label: 'Salary', value: '$6,500', percentage: 79 },
        { label: 'Freelance', value: '$1,200', percentage: 15 },
        { label: 'Passive Income', value: '$550', percentage: 6 },
      ],
      historicalData: [
        { month: 'Jul', value: '$7,890' },
        { month: 'Aug', value: '$8,100' },
        { month: 'Sep', value: '$7,950' },
        { month: 'Oct', value: '$8,000' },
        { month: 'Nov', value: '$8,250' },
      ],
    },
    monthlyExpenses: {
      value: '$5,420',
      trend: { value: 2.3, label: 'this month', isPositive: false },
      description: 'Total expenses for this month across all categories including housing, food, transportation, and entertainment.',
      breakdown: [
        { label: 'Housing', value: '$2,100', percentage: 39 },
        { label: 'Food & Dining', value: '$890', percentage: 16 },
        { label: 'Transportation', value: '$650', percentage: 12 },
        { label: 'Utilities', value: '$420', percentage: 8 },
        { label: 'Entertainment', value: '$580', percentage: 11 },
        { label: 'Other', value: '$780', percentage: 14 },
      ],
      historicalData: [
        { month: 'Jul', value: '$5,120' },
        { month: 'Aug', value: '$5,340' },
        { month: 'Sep', value: '$5,200' },
        { month: 'Oct', value: '$5,300' },
        { month: 'Nov', value: '$5,420' },
      ],
    },
    netWorth: {
      value: '$125,780',
      trend: { value: 4.8, label: 'this month', isPositive: true },
      description: 'Your total net worth calculated as total assets minus total liabilities. This includes all accounts, properties, and debts.',
      breakdown: [
        { label: 'Liquid Assets', value: '$48,555', percentage: 39 },
        { label: 'Real Estate', value: '$85,000', percentage: 68 },
        { label: 'Investments', value: '$12,225', percentage: 10 },
        { label: 'Liabilities', value: '-$20,000', percentage: -16 },
      ],
      historicalData: [
        { month: 'Jul', value: '$115,200' },
        { month: 'Aug', value: '$118,450' },
        { month: 'Sep', value: '$120,890' },
        { month: 'Oct', value: '$123,100' },
        { month: 'Nov', value: '$125,780' },
      ],
    },
  };

  return (
    <div className="space-y-8">
      {/* Header with gradient background */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-lg -z-10" />
        <div className="p-6 rounded-lg">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Welcome back, {user.name?.split(' ')[0] || user.email}!
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Here's an overview of your financial health
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Balance"
          value={kpiData.totalBalance.value}
          icon={DollarSign}
          trend={kpiData.totalBalance.trend}
          isEmpty={isEmpty}
          isLoading={isLoading}
          emptyMessage="Add accounts to see your total balance"
          description={kpiData.totalBalance.description}
          breakdown={kpiData.totalBalance.breakdown}
          historicalData={kpiData.totalBalance.historicalData}
        />
        <KPICard
          title="Monthly Income"
          value={kpiData.monthlyIncome.value}
          icon={TrendingUp}
          trend={kpiData.monthlyIncome.trend}
          isEmpty={isEmpty}
          isLoading={isLoading}
          emptyMessage="Track income transactions"
          description={kpiData.monthlyIncome.description}
          breakdown={kpiData.monthlyIncome.breakdown}
          historicalData={kpiData.monthlyIncome.historicalData}
        />
        <KPICard
          title="Monthly Expenses"
          value={kpiData.monthlyExpenses.value}
          icon={TrendingDown}
          trend={kpiData.monthlyExpenses.trend}
          isEmpty={isEmpty}
          isLoading={isLoading}
          emptyMessage="Track expense transactions"
          description={kpiData.monthlyExpenses.description}
          breakdown={kpiData.monthlyExpenses.breakdown}
          historicalData={kpiData.monthlyExpenses.historicalData}
        />
        <KPICard
          title="Net Worth"
          value={kpiData.netWorth.value}
          icon={Wallet}
          trend={kpiData.netWorth.trend}
          isEmpty={isEmpty}
          isLoading={isLoading}
          emptyMessage="Assets minus liabilities"
          description={kpiData.netWorth.description}
          breakdown={kpiData.netWorth.breakdown}
          historicalData={kpiData.netWorth.historicalData}
        />
      </div>

      {/* Three-column layout */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left column - Quick Actions & Accounts (hidden on mobile, shown on lg+) */}
        <div className="hidden lg:block lg:col-span-3 space-y-6">
          <QuickActions />
          <AccountOverview isEmpty={isEmpty} />
        </div>

        {/* Middle column - Main content */}
        <div className="lg:col-span-6 space-y-6">
          {/* Cash Flow Chart */}
          <CashFlowChart isEmpty={isEmpty} isLoading={isLoading} />

          {/* Recent Transactions */}
          <RecentTransactions isEmpty={isEmpty} isLoading={isLoading} />

          {/* Account Overview (mobile only) */}
          <div className="lg:hidden">
            <AccountOverview isEmpty={isEmpty} />
          </div>

          {/* Quick Actions (mobile only) */}
          <div className="lg:hidden">
            <QuickActions />
          </div>

          {/* Bills & Budget (mobile only) */}
          <div className="lg:hidden space-y-6">
            <UpcomingBills isEmpty={isEmpty} />
            <BudgetProgress isEmpty={isEmpty} />
          </div>
        </div>

        {/* Right column - Insights, Bills & Budget */}
        <div className="lg:col-span-3 space-y-6">
          <InsightsPanel />
          <UpcomingBills isEmpty={isEmpty} />
          <BudgetProgress isEmpty={isEmpty} />
        </div>
      </div>
    </div>
  );
}
