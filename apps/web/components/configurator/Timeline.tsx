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
    { name: t('timeline.survey', locale), weeks: 1, color: 'bg-fg-secondary' },
    { name: t('timeline.earthworks', locale), weeks: 2, color: 'bg-accent-timber' },
    { name: t('timeline.factory', locale), weeks: Math.max(totalWeeks - 4, 1), color: 'bg-accent-orange' },
    { name: t('timeline.delivery', locale), weeks: 1, color: 'bg-accent-green' },
  ]

  return (
    <div className="glass rounded-2xl p-3">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-mono text-xs uppercase tracking-wider text-fg-secondary">{t('panel.timeline', locale)}</h2>
        <span className="text-xs text-fg-secondary">{totalWeeks} {t('timeline.total', locale)}</span>
      </div>
      <div className="flex gap-1">
        {phases.map((p) => {
          const style: CSSProperties = { flex: p.weeks }
          return (
            <div
              key={p.name}
              className={`${p.color} flex h-8 items-center justify-center rounded-md px-2 text-[10px] font-medium text-bg`}
              style={style}
              title={`${p.name} · ${p.weeks}w`}
            >
              {p.weeks}w
            </div>
          )
        })}
      </div>
    </div>
  )
}
