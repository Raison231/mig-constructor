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
    <div className="glass rounded-3xl p-4 relative overflow-hidden">
      <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-brand-primary/18 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-brand-secondary/15 blur-3xl" aria-hidden />
      <div className="mb-3 flex items-center justify-between relative">
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink3">{t('panel.price', locale)}</div>
        <span className="rounded-full bg-brand-primary/12 text-brand-primary text-[10px] font-bold px-2 py-0.5 border border-brand-primary/25">
          {modules.length} mod.
        </span>
      </div>

      <div className="space-y-1.5 text-xs relative">
        <Row label={t('price.modules', locale)} value={fmt(breakdown.modulesCost)} />
        <Row label={t('price.delivery', locale)} value={fmt(breakdown.deliveryCost)} />
        <Row label={t('price.earthworks', locale)} value={fmt(breakdown.earthworksCost)} />
        <Row label={t('price.assembly', locale)} value={fmt(breakdown.assemblyCost)} />
      </div>

      <div className="mt-4 pt-3 border-t border-hairline relative">
        <div className="flex items-baseline justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-ink3">{t('price.total', locale)}</span>
          <span className="text-2xl font-extrabold bg-gradient-to-r from-brand-primary via-emerald-400 to-brand-secondary bg-clip-text text-transparent">{fmt(breakdown.total)}</span>
        </div>
        <div className="mt-0.5 text-right text-[10px] text-ink3 font-mono">{fmtUsd(breakdown.total)}</div>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-ink2">{label}</span>
      <span className="font-mono text-ink">{value}</span>
    </div>
  )
}
