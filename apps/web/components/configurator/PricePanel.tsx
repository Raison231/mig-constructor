'use client'

import { useMemo } from 'react'
import { useConfigurator } from '@/stores/configurator'
import { useLocale } from '@/stores/locale'
import { calculatePrice } from '@mig/pricing-engine'
import { t } from '@mig/i18n'

const USD_RATE = 0.37

export function PricePanel() {
  const modules = useConfigurator((s) => s.modules)
  const locale = useLocale((s) => s.locale)
  const breakdown = useMemo(() => calculatePrice(modules), [modules])

  const fmt = (n: number) => `${n.toLocaleString()} GEL`
  const fmtUsd = (n: number) => `≈ $${Math.round(n * USD_RATE).toLocaleString()}`

  return (
    <div className="glass rounded-2xl p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-mono text-xs uppercase tracking-wider text-fg-secondary">{t('panel.price', locale)}</h2>
        <span className="text-[10px] text-fg-secondary">{modules.length} mod.</span>
      </div>

      <div className="space-y-1 text-xs">
        <Row label={t('price.modules', locale)} value={fmt(breakdown.modulesCost)} />
        <Row label={t('price.delivery', locale)} value={fmt(breakdown.deliveryCost)} />
        <Row label={t('price.earthworks', locale)} value={fmt(breakdown.earthworksCost)} />
        <Row label={t('price.assembly', locale)} value={fmt(breakdown.assemblyCost)} />
      </div>

      <div className="mt-3 border-t border-panel pt-3">
        <div className="flex items-baseline justify-between">
          <span className="text-xs text-fg-secondary">{t('price.total', locale)}</span>
          <span className="text-xl font-semibold text-accent-green">{fmt(breakdown.total)}</span>
        </div>
        <div className="mt-0.5 text-right text-[10px] text-fg-secondary">{fmtUsd(breakdown.total)}</div>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-fg-secondary">{label}</span>
      <span>{value}</span>
    </div>
  )
}
