import { requireAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Wallet, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { KPICard } from '@/components/dashboard/kpi-card';
import { CashFlowChart } from '@/components/dashboard/cash-flow-chart';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { InsightsPanel } from '@/components/dashboard/insights-panel';

export default async function DashboardPage() {
  let user;

  try {
    user = await requireAuth();
  } catch {
    redirect('/login');
  }

  // For Phase 3, we're showing empty states
  // In Phase 4+, we'll fetch actual data from the API
  const isEmpty = true;
  const isLoading = false;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user.name?.split(' ')[0] || user.email}!
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's an overview of your financial health
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Balance"
          value="$0.00"
          icon={DollarSign}
          isEmpty={isEmpty}
          isLoading={isLoading}
          emptyMessage="Add accounts to see your total balance"
        />
        <KPICard
          title="Monthly Income"
          value="$0.00"
          icon={TrendingUp}
          isEmpty={isEmpty}
          isLoading={isLoading}
          emptyMessage="Track income transactions"
        />
        <KPICard
          title="Monthly Expenses"
          value="$0.00"
          icon={TrendingDown}
          isEmpty={isEmpty}
          isLoading={isLoading}
          emptyMessage="Track expense transactions"
        />
        <KPICard
          title="Net Worth"
          value="$0.00"
          icon={Wallet}
          isEmpty={isEmpty}
          isLoading={isLoading}
          emptyMessage="Assets minus liabilities"
        />
      </div>

      {/* Three-column layout */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left column - Quick Actions (hidden on mobile, shown on lg+) */}
        <div className="hidden lg:block lg:col-span-3">
          <QuickActions />
        </div>

        {/* Middle column - Main content */}
        <div className="lg:col-span-6 space-y-6">
          {/* Cash Flow Chart */}
          <CashFlowChart isEmpty={isEmpty} isLoading={isLoading} />

          {/* Recent Transactions */}
          <RecentTransactions isEmpty={isEmpty} isLoading={isLoading} />

          {/* Quick Actions (mobile only) */}
          <div className="lg:hidden">
            <QuickActions />
          </div>
        </div>

        {/* Right column - Insights */}
        <div className="lg:col-span-3">
          <InsightsPanel />
        </div>
      </div>
    </div>
  );
}
