'use client'

import { useConfigurator } from '@/stores/configurator'
import { calculatePrice } from '@mig/pricing-engine'
import { useMemo } from 'react'
import type { CSSProperties } from 'react'
import { useLocale } from '@/stores/locale'
import { t } from '@mig/i18n'

export function Timeline() {
  const modules = useConfigurator((s) => s.modules)
  const locale = useLocale((s) => s.locale)
  const { weeks } = useMemo(() => calculatePrice(modules), [modules])
  const totalWeeks = Math.max(weeks, 4)

  const phases = [
    { name: t('timeline.survey', locale), weeks: 1, gradient: 'from-ink3 to-ink2' },
    { name: t('timeline.earthworks', locale), weeks: 2, gradient: 'from-brand-accent to-amber-400' },
    { name: t('timeline.factory', locale), weeks: Math.max(totalWeeks - 4, 1), gradient: 'from-brand-field to-purple-400' },
    { name: t('timeline.delivery', locale), weeks: 1, gradient: 'from-brand-primary to-emerald-400' },
  ]

  return (
    <div className="glass rounded-3xl p-3.5">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink3">{t('panel.timeline', locale)}</div>
        <span className="rounded-full bg-brand-accent/15 text-[#8B4F00] text-[10px] font-bold px-2 py-0.5 border border-brand-accent/25">{totalWeeks} {t('timeline.total', locale)}</span>
      </div>
      <div className="flex gap-1">
        {phases.map((p) => {
          const style: CSSProperties = { flex: p.weeks }
          return (
            <div
              key={p.name}
              className={`bg-gradient-to-r ${p.gradient} flex h-10 items-center justify-center rounded-xl px-2 text-[11px] font-bold text-white shadow-aurora`}
              style={style}
              title={`${p.name} · ${p.weeks}w`}
            >
              {p.weeks}w
            </div>
          )
        })}
      </div>
      <div className="mt-2 grid grid-cols-4 gap-1 text-[9px] font-medium text-ink3 text-center">
        {phases.map((p) => (
          <div key={p.name} className="truncate">{p.name}</div>
        ))}
      </div>
    </div>
  )
}
