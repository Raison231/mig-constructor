'use client'

import { useConfigurator } from '@/stores/configurator'
import { calculatePrice } from '@mig/pricing-engine'
import { useMemo } from 'react'

export function Timeline() {
  const modules = useConfigurator((s) => s.modules)
  const { weeks } = useMemo(() => calculatePrice(modules), [modules])
  const totalWeeks = Math.max(weeks, 4)

  const phases = [
    { name: 'Survey + permits', weeks: 1, color: 'bg-fg-secondary' },
    { name: 'Earthworks + foundation', weeks: 2, color: 'bg-accent-timber' },
    { name: 'Factory production', weeks: Math.max(totalWeeks - 4, 1), color: 'bg-accent-orange' },
    { name: 'Delivery + assembly', weeks: 1, color: 'bg-accent-green' },
  ]

  return (
    <div className="glass rounded-2xl p-3">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-mono text-xs uppercase tracking-wider text-fg-secondary">Timeline</h2>
        <span className="text-xs text-fg-secondary">{totalWeeks} weeks total</span>
      </div>
      <div className="flex gap-1">
        {phases.map((p) => (
          <div
            key={p.name}
            className={`${p.color} flex h-8 items-center justify-center rounded-md px-2 text-[10px] font-medium text-bg`}
            style= flex: p.weeks 
            title={`${p.name} · ${p.weeks}w`}
          >
            {p.weeks}w
          </div>
        ))}
      </div>
    </div>
  )
}
