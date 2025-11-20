import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { stockService } from '@/lib/services/stock-service'

// GET /api/investments - Get user's investment portfolio
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

    const { searchParams } = new URL(request.url)
    const includeQuotes = searchParams.get('includeQuotes') === 'true'

    // Fetch investments
    const investments = await db.investment.findMany({
      where: { userId: user.id },
      include: {
        account: {
          select: {
            name: true,
            type: true
          }
        }
      },
      orderBy: {
        symbol: 'asc'
      }
    })

    // If requested, fetch current quotes for all holdings
    if (includeQuotes && investments.length > 0) {
      const symbols = investments.map(inv => inv.symbol)
      const quotes = await stockService.getBatchQuotes(symbols)

      // Update investments with current prices
      const updatedInvestments = await Promise.all(
        investments.map(async (inv) => {
          const quote = quotes.get(inv.symbol)

          if (quote) {
            const currentValue = parseFloat(inv.shares.toString()) * quote.price
            const costBasis = parseFloat(inv.avgCostBasis.toString()) * parseFloat(inv.shares.toString())
            const totalGainLoss = currentValue - costBasis
            const percentReturn = costBasis > 0 ? (totalGainLoss / costBasis) * 100 : 0

            // Update database with latest prices
            await db.investment.update({
              where: { id: inv.id },
              data: {
                currentPrice: quote.price,
                totalGainLoss,
                percentReturn
              }
            })

            return {
              ...inv,
              currentPrice: quote.price,
              currentValue,
              totalGainLoss,
              percentReturn,
              quote
            }
          }

          return inv
        })
      )

      return NextResponse.json({ investments: updatedInvestments })
    }

    return NextResponse.json({ investments })
  } catch (error) {
    console.error('Error fetching investments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch investments' },
      { status: 500 }
    )
  }
}

// POST /api/investments - Add or update investment
export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { accountId, symbol, shares, avgCostBasis } = body

    if (!accountId || !symbol || shares === undefined || avgCostBasis === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify account belongs to user
    const account = await db.account.findFirst({
      where: {
        id: accountId,
        userId: user.id
      }
    })

    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 })
    }

    // Get current price
    const quote = await stockService.getCurrentPrice(symbol.toUpperCase())

    if (!quote) {
      return NextResponse.json(
        { error: 'Invalid stock symbol' },
        { status: 400 }
      )
    }

    // Check if investment already exists
    const existing = await db.investment.findFirst({
      where: {
        userId: user.id,
        accountId,
        symbol: symbol.toUpperCase()
      }
    })

    let investment

    if (existing) {
      // Update existing investment
      const newShares = parseFloat(existing.shares.toString()) + parseFloat(shares)
      const newCostBasis = (
        (parseFloat(existing.avgCostBasis.toString()) * parseFloat(existing.shares.toString())) +
        (parseFloat(avgCostBasis) * parseFloat(shares))
      ) / newShares

      investment = await db.investment.update({
        where: { id: existing.id },
        data: {
          shares: newShares,
          avgCostBasis: newCostBasis,
          currentPrice: quote.price
        }
      })
    } else {
      // Create new investment
      investment = await db.investment.create({
        data: {
          userId: user.id,
          accountId,
          symbol: symbol.toUpperCase(),
          shares: parseFloat(shares),
          avgCostBasis: parseFloat(avgCostBasis),
          currentPrice: quote.price
        }
      })
    }

    return NextResponse.json({ investment }, { status: existing ? 200 : 201 })
  } catch (error) {
    console.error('Error creating investment:', error)
    return NextResponse.json(
      { error: 'Failed to create investment' },
      { status: 500 }
    )
  }
}

// DELETE /api/investments - Remove investment
export async function DELETE(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const investmentId = searchParams.get('id')

    if (!investmentId) {
      return NextResponse.json(
        { error: 'Investment ID required' },
        { status: 400 }
      )
    }

    // Verify ownership
    const investment = await db.investment.findFirst({
      where: {
        id: investmentId,
        userId: user.id
      }
    })

    if (!investment) {
      return NextResponse.json({ error: 'Investment not found' }, { status: 404 })
    }

    await db.investment.delete({
      where: { id: investmentId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting investment:', error)
    return NextResponse.json(
      { error: 'Failed to delete investment' },
      { status: 500 }
    )
  }
}
