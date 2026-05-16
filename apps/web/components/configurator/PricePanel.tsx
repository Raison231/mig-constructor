'use client'

import { useConfigurator } from '@/stores/configurator'
import { calculatePrice } from '@mig/pricing-engine'
import { useMemo } from 'react'

export function PricePanel() {
  const modules = useConfigurator((s) => s.modules)
  const removeModule = useConfigurator((s) => s.removeModule)

  const breakdown = useMemo(() => calculatePrice(modules), [modules])

  return (
    <div className="glass rounded-2xl p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-mono text-xs uppercase tracking-wider text-fg-secondary">Estimate</h2>
        <span className="text-xs text-fg-secondary">{modules.length} modules</span>
      </div>

      <div className="mb-4 space-y-1 text-sm">
        <Row label="Modules" value={breakdown.modulesCost} />
        <Row label="Delivery (GE)" value={breakdown.deliveryCost} />
        <Row label="Earthworks" value={breakdown.earthworksCost} />
        <Row label="Assembly" value={breakdown.assemblyCost} />
      </div>

      <div className="mb-4 flex items-end justify-between border-t border-white/5 pt-3">
        <div>
          <div className="text-xs text-fg-secondary">Total turnkey</div>
          <div className="font-mono text-3xl font-bold text-accent-green">
            ${breakdown.total.toLocaleString('en-US')}
          </div>
        </div>
        <div className="text-right text-xs">
          <div className="text-fg-secondary">≈ {breakdown.weeks} weeks</div>
          <div className="text-fg-secondary">{breakdown.totalAreaM2} m²</div>
        </div>
      </div>

      {modules.length > 0 && (
        <div className="max-h-48 space-y-1 overflow-y-auto pr-1">
          {modules.map((m) => (
            <div
              key={m.instanceId}
              className="flex items-center justify-between rounded-lg bg-bg px-2.5 py-1.5 text-xs"
            >
              <span>{m.moduleId}</span>
              <button
                onClick={() => removeModule(m.instanceId)}
                className="text-fg-secondary hover:text-accent-orange"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between">
      <span className="text-fg-secondary">{label}</span>
      <span className="font-mono">${value.toLocaleString('en-US')}</span>
    </div>
  )
}
