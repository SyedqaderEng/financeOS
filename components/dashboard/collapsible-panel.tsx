"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CollapsiblePanelProps {
  children: React.ReactNode
  side: 'left' | 'right'
  defaultCollapsed?: boolean
  className?: string
}

export function CollapsiblePanel({ children, side, defaultCollapsed = false, className }: CollapsiblePanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)

  return (
    <div
      className={cn(
        "relative transition-all duration-300",
        side === 'left' ? 'border-r' : 'border-l',
        isCollapsed ? 'w-0' : 'w-80',
        className
      )}
    >
      {/* Collapse/Expand Button */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "absolute top-4 z-10 h-8 w-8 rounded-full border bg-background shadow-md hover:shadow-lg transition-all",
          side === 'left' ? '-right-4' : '-left-4'
        )}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {side === 'left' ? (
          isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />
        ) : (
          isCollapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
        )}
      </Button>

      {/* Panel Content */}
      <div
        className={cn(
          "h-full overflow-hidden transition-all duration-300",
          isCollapsed ? 'opacity-0 w-0' : 'opacity-100'
        )}
      >
        <div className="h-full overflow-y-auto p-4 space-y-6">
          {children}
        </div>
      </div>
    </div>
  )
}
