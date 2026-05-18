import { type ReactNode } from 'react'
import { cn } from '@/lib/cn'

export function SectionLabel({
  children,
  className,
  right,
}: {
  children: ReactNode
  className?: string
  right?: ReactNode
}) {
  return (
    <div className={cn('mb-2 flex items-center justify-between', className)}>
      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink3">
        {children}
      </span>
      {right}
    </div>
  )
}
