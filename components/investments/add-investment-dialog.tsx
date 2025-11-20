"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Account {
  id: string
  name: string
  type: string
}

interface AddInvestmentDialogProps {
  accounts: Account[]
  onSuccess?: () => void
}

export function AddInvestmentDialog({ accounts, onSuccess }: AddInvestmentDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    accountId: '',
    symbol: '',
    shares: '',
    avgCostBasis: ''
  })
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.accountId || !formData.symbol || !formData.shares || !formData.avgCostBasis) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/investments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          accountId: formData.accountId,
          symbol: formData.symbol.toUpperCase(),
          shares: parseFloat(formData.shares),
          avgCostBasis: parseFloat(formData.avgCostBasis)
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to add investment')
      }

      toast({
        title: 'Investment added',
        description: `Successfully added ${formData.symbol.toUpperCase()} to your portfolio`
      })

      // Reset form
      setFormData({
        accountId: '',
        symbol: '',
        shares: '',
        avgCostBasis: ''
      })

      setOpen(false)
      onSuccess?.()
    } catch (error) {
      console.error('Error adding investment:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add investment',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Investment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Investment</DialogTitle>
            <DialogDescription>
              Add a new stock, ETF, or cryptocurrency to your portfolio
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Account Selection */}
            <div className="grid gap-2">
              <Label htmlFor="accountId">Account *</Label>
              <Select
                value={formData.accountId}
                onValueChange={(value) =>
                  setFormData({ ...formData, accountId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name} ({account.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Symbol */}
            <div className="grid gap-2">
              <Label htmlFor="symbol">Stock Symbol *</Label>
              <Input
                id="symbol"
                placeholder="AAPL, TSLA, BTC, etc."
                value={formData.symbol}
                onChange={(e) =>
                  setFormData({ ...formData, symbol: e.target.value.toUpperCase() })
                }
                disabled={loading}
                maxLength={10}
              />
              <p className="text-xs text-muted-foreground">
                Enter the ticker symbol (e.g., AAPL for Apple)
              </p>
            </div>

            {/* Shares */}
            <div className="grid gap-2">
              <Label htmlFor="shares">Number of Shares *</Label>
              <Input
                id="shares"
                type="number"
                step="0.000001"
                min="0"
                placeholder="10"
                value={formData.shares}
                onChange={(e) =>
                  setFormData({ ...formData, shares: e.target.value })
                }
                disabled={loading}
              />
            </div>

            {/* Average Cost Basis */}
            <div className="grid gap-2">
              <Label htmlFor="avgCostBasis">Average Cost per Share *</Label>
              <Input
                id="avgCostBasis"
                type="number"
                step="0.01"
                min="0"
                placeholder="150.00"
                value={formData.avgCostBasis}
                onChange={(e) =>
                  setFormData({ ...formData, avgCostBasis: e.target.value })
                }
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">
                The price you paid per share
              </p>
            </div>

            {/* Total Cost Display */}
            {formData.shares && formData.avgCostBasis && (
              <div className="rounded-lg bg-secondary p-3">
                <p className="text-sm text-muted-foreground">Total Cost</p>
                <p className="text-lg font-bold">
                  ${(parseFloat(formData.shares) * parseFloat(formData.avgCostBasis)).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Add Investment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
