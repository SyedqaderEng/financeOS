"use client"

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrendingUp, TrendingDown, Trash2 } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface Holding {
  id: string
  symbol: string
  shares: number
  avgCostBasis: number
  currentPrice: number
  currentValue: number
  costValue: number
  gainLoss: number
  gainLossPercent: number
  accountName: string
}

interface HoldingsTableProps {
  holdings: Holding[]
  onDelete?: (id: string) => void
}

export function HoldingsTable({ holdings, onDelete }: HoldingsTableProps) {
  if (holdings.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="text-muted-foreground">
          <p className="text-lg font-medium mb-2">No investments yet</p>
          <p className="text-sm">Add your first investment to start tracking your portfolio</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Symbol</TableHead>
              <TableHead>Account</TableHead>
              <TableHead className="text-right">Shares</TableHead>
              <TableHead className="text-right">Avg Cost</TableHead>
              <TableHead className="text-right">Current Price</TableHead>
              <TableHead className="text-right">Market Value</TableHead>
              <TableHead className="text-right">Gain/Loss</TableHead>
              <TableHead className="text-right">Return %</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {holdings.map((holding) => {
              const isPositive = holding.gainLoss >= 0

              return (
                <TableRow key={holding.id}>
                  <TableCell className="font-bold">{holding.symbol}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {holding.accountName}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {holding.shares.toLocaleString('en-US', {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 6
                    })}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    ${holding.avgCostBasis.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    ${holding.currentPrice.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </TableCell>
                  <TableCell className="text-right tabular-nums font-medium">
                    ${holding.currentValue.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </TableCell>
                  <TableCell className={`text-right tabular-nums font-medium ${
                    isPositive ? 'text-success' : 'text-destructive'
                  }`}>
                    <div className="flex items-center justify-end gap-1">
                      {isPositive ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {isPositive ? '+' : ''}${holding.gainLoss.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </div>
                  </TableCell>
                  <TableCell className={`text-right tabular-nums font-medium ${
                    isPositive ? 'text-success' : 'text-destructive'
                  }`}>
                    {isPositive ? '+' : ''}{holding.gainLossPercent.toFixed(2)}%
                  </TableCell>
                  <TableCell className="text-right">
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(holding.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}
