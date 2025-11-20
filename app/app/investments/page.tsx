"use client"

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { PortfolioSummary } from '@/components/investments/portfolio-summary'
import { HoldingsTable } from '@/components/investments/holdings-table'
import { AddInvestmentDialog } from '@/components/investments/add-investment-dialog'
import { RefreshCw, Loader2, TrendingUp, AlertCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface PortfolioData {
  totalValue: number
  totalCost: number
  totalGainLoss: number
  totalGainLossPercent: number
  holdings: any[]
  allocation: Record<string, number>
  topGainers: any[]
  topLosers: any[]
  diversificationScore?: string
  concentrationRisk?: number
}

interface Account {
  id: string
  name: string
  type: string
}

export default function InvestmentsPage() {
  const { data: session, status } = useSession()
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null)
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/login')
    }

    if (status === 'authenticated') {
      fetchData()
      fetchAccounts()
    }
  }, [status])

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/investments/portfolio')

      if (!response.ok) {
        throw new Error('Failed to fetch portfolio')
      }

      const data = await response.json()
      setPortfolio(data)
    } catch (error) {
      console.error('Error fetching portfolio:', error)
      toast({
        title: 'Error',
        description: 'Failed to load portfolio data',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchAccounts = async () => {
    try {
      const response = await fetch('/api/accounts')

      if (!response.ok) {
        throw new Error('Failed to fetch accounts')
      }

      const data = await response.json()
      setAccounts(data.accounts || [])
    } catch (error) {
      console.error('Error fetching accounts:', error)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchData()
    setRefreshing(false)
    toast({
      title: 'Portfolio refreshed',
      description: 'Latest prices have been updated'
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this investment?')) {
      return
    }

    try {
      const response = await fetch(`/api/investments?id=${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete investment')
      }

      toast({
        title: 'Investment removed',
        description: 'The investment has been removed from your portfolio'
      })

      await fetchData()
    } catch (error) {
      console.error('Error deleting investment:', error)
      toast({
        title: 'Error',
        description: 'Failed to remove investment',
        variant: 'destructive'
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Investment Portfolio</h1>
          <p className="text-muted-foreground">
            Track your stocks, ETFs, and crypto investments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
          <AddInvestmentDialog accounts={accounts} onSuccess={fetchData} />
        </div>
      </div>

      {/* Portfolio Summary */}
      {portfolio && (
        <PortfolioSummary
          totalValue={portfolio.totalValue}
          totalCost={portfolio.totalCost}
          totalGainLoss={portfolio.totalGainLoss}
          totalGainLossPercent={portfolio.totalGainLossPercent}
          diversificationScore={portfolio.diversificationScore}
          concentrationRisk={portfolio.concentrationRisk}
        />
      )}

      {/* Holdings Table */}
      {portfolio && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Holdings</h2>
          <HoldingsTable holdings={portfolio.holdings} onDelete={handleDelete} />
        </div>
      )}

      {/* Top Gainers & Losers */}
      {portfolio && portfolio.holdings.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Top Gainers */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-success" />
              <h3 className="text-lg font-semibold">Top Gainers</h3>
            </div>
            <div className="space-y-3">
              {portfolio.topGainers.slice(0, 3).map((holding) => (
                <div key={holding.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{holding.symbol}</p>
                    <p className="text-sm text-muted-foreground">
                      ${holding.currentValue.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-success">
                      +{holding.gainLossPercent.toFixed(2)}%
                    </p>
                    <p className="text-sm text-success">
                      +${holding.gainLoss.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Top Losers */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <h3 className="text-lg font-semibold">Top Losers</h3>
            </div>
            <div className="space-y-3">
              {portfolio.topLosers.slice(0, 3).map((holding) => (
                <div key={holding.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{holding.symbol}</p>
                    <p className="text-sm text-muted-foreground">
                      ${holding.currentValue.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-destructive">
                      {holding.gainLossPercent.toFixed(2)}%
                    </p>
                    <p className="text-sm text-destructive">
                      ${holding.gainLoss.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {portfolio && portfolio.holdings.length === 0 && (
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto space-y-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Start Building Your Portfolio</h3>
              <p className="text-muted-foreground mb-6">
                Add your first investment to start tracking your portfolio performance with real-time data
              </p>
              <AddInvestmentDialog accounts={accounts} onSuccess={fetchData} />
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
