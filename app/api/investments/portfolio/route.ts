import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { stockService } from '@/lib/services/stock-service'

// GET /api/investments/portfolio - Get portfolio summary and analytics
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Fetch all investments
    const investments = await db.investment.findMany({
      where: { userId: user.id },
      include: {
        account: {
          select: {
            name: true,
            type: true
          }
        }
      }
    })

    if (investments.length === 0) {
      return NextResponse.json({
        totalValue: 0,
        totalCost: 0,
        totalGainLoss: 0,
        totalGainLossPercent: 0,
        holdings: [],
        allocation: {},
        topGainers: [],
        topLosers: []
      })
    }

    // Fetch current quotes for all symbols
    const symbols = [...new Set(investments.map(inv => inv.symbol))]
    const quotes = await stockService.getBatchQuotes(symbols)

    // Calculate portfolio metrics
    let totalValue = 0
    let totalCost = 0

    const holdingsWithMetrics = investments.map(inv => {
      const quote = quotes.get(inv.symbol)
      const shares = parseFloat(inv.shares.toString())
      const costBasis = parseFloat(inv.avgCostBasis.toString())
      const currentPrice = quote?.price || parseFloat(inv.currentPrice?.toString() || '0')

      const currentValue = shares * currentPrice
      const costValue = shares * costBasis
      const gainLoss = currentValue - costValue
      const gainLossPercent = costValue > 0 ? (gainLoss / costValue) * 100 : 0

      totalValue += currentValue
      totalCost += costValue

      return {
        id: inv.id,
        symbol: inv.symbol,
        shares,
        avgCostBasis: costBasis,
        currentPrice,
        currentValue,
        costValue,
        gainLoss,
        gainLossPercent,
        accountName: inv.account.name,
        accountType: inv.account.type,
        quote: quote || null
      }
    })

    const totalGainLoss = totalValue - totalCost
    const totalGainLossPercent = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0

    // Calculate asset allocation
    const allocation: Record<string, number> = {}
    holdingsWithMetrics.forEach(holding => {
      const percentage = totalValue > 0 ? (holding.currentValue / totalValue) * 100 : 0
      allocation[holding.symbol] = percentage
    })

    // Get top gainers and losers
    const sorted = [...holdingsWithMetrics].sort((a, b) => b.gainLossPercent - a.gainLossPercent)
    const topGainers = sorted.slice(0, 5)
    const topLosers = sorted.reverse().slice(0, 5)

    // Calculate diversification score
    const concentrationRisk = Math.max(...Object.values(allocation))
    const diversificationScore = concentrationRisk < 20 ? 'Well Diversified' :
                                 concentrationRisk < 40 ? 'Moderately Diversified' :
                                 'Concentrated'

    return NextResponse.json({
      totalValue,
      totalCost,
      totalGainLoss,
      totalGainLossPercent,
      holdings: holdingsWithMetrics,
      allocation,
      topGainers,
      topLosers,
      diversificationScore,
      concentrationRisk
    })
  } catch (error) {
    console.error('Error fetching portfolio:', error)
    return NextResponse.json(
      { error: 'Failed to fetch portfolio' },
      { status: 500 }
    )
  }
}
