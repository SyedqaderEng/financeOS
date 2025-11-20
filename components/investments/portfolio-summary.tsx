"use client"

import { Card } from '@/components/ui/card'
import { TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react'

interface PortfolioSummaryProps {
  totalValue: number
  totalCost: number
  totalGainLoss: number
  totalGainLossPercent: number
  diversificationScore?: string
  concentrationRisk?: number
}

export function PortfolioSummary({
  totalValue,
  totalCost,
  totalGainLoss,
  totalGainLossPercent,
  diversificationScore,
  concentrationRisk
}: PortfolioSummaryProps) {
  const isPositive = totalGainLoss >= 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Value */}
      <Card className="kpi-card">
        <div className="flex items-center gap-2 kpi-label">
          <DollarSign className="h-4 w-4" />
          Portfolio Value
        </div>
        <div className="kpi-value">
          ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className="text-xs text-muted-foreground">
          Cost Basis: ${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </Card>

      {/* Total Gain/Loss */}
      <Card className="kpi-card">
        <div className="flex items-center gap-2 kpi-label">
          {isPositive ? (
            <TrendingUp className="h-4 w-4 text-success" />
          ) : (
            <TrendingDown className="h-4 w-4 text-destructive" />
          )}
          Total Gain/Loss
        </div>
        <div className={`kpi-value ${isPositive ? 'text-success' : 'text-destructive'}`}>
          {isPositive ? '+' : ''}${totalGainLoss.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className={`text-xs font-medium ${isPositive ? 'text-success' : 'text-destructive'}`}>
          {isPositive ? '+' : ''}{totalGainLossPercent.toFixed(2)}%
        </div>
      </Card>

      {/* Diversification Score */}
      {diversificationScore && (
        <Card className="kpi-card">
          <div className="flex items-center gap-2 kpi-label">
            <PieChart className="h-4 w-4" />
            Diversification
          </div>
          <div className="text-2xl font-bold mb-2">
            {diversificationScore}
          </div>
          <div className="text-xs text-muted-foreground">
            Top holding: {concentrationRisk?.toFixed(1)}%
          </div>
        </Card>
      )}

      {/* Holdings Count */}
      <Card className="kpi-card">
        <div className="kpi-label">
          Total Holdings
        </div>
        <div className="kpi-value">
          {/* This will be passed as a prop or calculated */}
          -
        </div>
        <div className="text-xs text-muted-foreground">
          Across all accounts
        </div>
      </Card>
    </div>
  )
}
