'use client'

import { useState } from 'react'
import { modules } from '@mig/modules-schema'
import type { Material } from '@mig/modules-schema'
import { useConfigurator } from '@/stores/configurator'
import { useLocale } from '@/stores/locale'
import { t, pickName } from '@mig/i18n'

const MAT_KEY: Record<Material, string> = {
  container: 'mat.container', timber: 'mat.timber', hybrid: 'mat.hybrid',
}
const MATERIALS_F: Array<Material | 'any'> = ['any', 'container', 'timber', 'hybrid']
const MATERIALS_C: Material[] = ['container', 'timber', 'hybrid']

export function ModulePanel() {
  const [matFilter, setMatFilter] = useState<Material | 'any'>('any')
  const [matChoice, setMatChoice] = useState<Material>('container')
  const addModule = useConfigurator((s) => s.addModule)
  const locale = useLocale((s) => s.locale)

  const filtered = matFilter === 'any'
    ? modules
    : modules.filter((m) => m.prices && (m.prices as Record<string, number>)[matFilter] != null)

  return (
    <div className="glass flex h-full flex-col rounded-2xl p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-mono text-xs uppercase tracking-wider text-fg-secondary">{t('panel.modules', locale)}</h2>
        <span className="text-[10px] text-fg-secondary">{filtered.length}</span>
      </div>

      <div className="mb-3 grid grid-cols-4 gap-1">
        {MATERIALS_F.map((m) => (
          <button
            key={m}
            onClick={() => setMatFilter(m)}
            className={`rounded-md px-2 py-1 text-[10px] ${matFilter === m ? 'bg-accent-green text-bg' : 'bg-bg text-fg-secondary hover:bg-panel'}`}
          >
            {m === 'any' ? t('mat.any', locale) : t(MAT_KEY[m], locale)}
          </button>
        ))}
      </div>

      <div className="mb-3 flex gap-1 rounded-lg bg-bg p-1">
        {MATERIALS_C.map((m) => (
          <button
            key={m}
            onClick={() => setMatChoice(m)}
            className={`flex-1 rounded-md px-2 py-1 text-[10px] ${matChoice === m ? 'bg-panel text-fg' : 'text-fg-secondary'}`}
          >
            {t(MAT_KEY[m], locale)}
          </button>
        ))}
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto pr-1">
        {filtered.map((m) => {
          const prices = m.prices as Record<string, number> | undefined
          const price = prices?.[matChoice]
          return (
            <button
              key={m.id}
              onClick={() => addModule(m.id, matChoice)}
              className="w-full rounded-lg bg-bg p-2 text-left text-sm transition hover:bg-panel"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="truncate">{pickName(m.name, locale)}</div>
                <div className="shrink-0 text-[11px] text-fg-secondary">{m.area_m2}m²</div>
              </div>
              <div className="mt-0.5 text-[10px] text-fg-secondary">
                {price != null ? `${price.toLocaleString()} GEL` : '—'}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
