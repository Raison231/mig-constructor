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

const MAT_ACCENT: Record<Material | 'any', string> = {
  any: 'from-brand-primary to-brand-secondary',
  container: 'from-brand-coral to-brand-accent',
  timber: 'from-brand-accent to-amber-300',
  hybrid: 'from-brand-secondary to-brand-field',
}

export function ModulePanel() {
  const [matFilter, setMatFilter] = useState<Material | 'any'>('any')
  const [matChoice, setMatChoice] = useState<Material>('container')
  const addModule = useConfigurator((s) => s.addModule)
  const locale = useLocale((s) => s.locale)

  const filtered = matFilter === 'any'
    ? modules
    : modules.filter((m) => m.prices && (m.prices as Record<string, number>)[matFilter] != null)

  return (
    <div className="glass flex h-full flex-col rounded-3xl p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink3">{t('panel.modules', locale)}</div>
          <div className="mt-0.5 text-[11px] text-ink2">{filtered.length} · {t(matFilter === 'any' ? 'mat.any' : MAT_KEY[matFilter], locale)}</div>
        </div>
        <div className={`h-8 w-8 rounded-2xl bg-gradient-to-br ${MAT_ACCENT[matFilter]} shadow-aurora`} />
      </div>

      <div className="mb-2.5 grid grid-cols-4 gap-1 rounded-2xl bg-white/45 p-1 border border-hairline">
        {MATERIALS_F.map((m) => (
          <button
            key={m}
            onClick={() => setMatFilter(m)}
            className={`rounded-xl px-2 py-1.5 text-[10px] font-bold transition ${
              matFilter === m
                ? 'bg-white text-ink shadow-aurora'
                : 'text-ink3 hover:text-ink2'
            }`}
          >
            {m === 'any' ? t('mat.any', locale) : t(MAT_KEY[m], locale)}
          </button>
        ))}
      </div>

      <div className="mb-3 flex gap-1 rounded-2xl bg-white/45 p-1 border border-hairline">
        {MATERIALS_C.map((m) => (
          <button
            key={m}
            onClick={() => setMatChoice(m)}
            className={`flex-1 rounded-xl px-2 py-1.5 text-[10px] font-bold transition ${
              matChoice === m ? 'bg-ink text-white shadow-aurora' : 'text-ink2 hover:text-ink'
            }`}
          >
            {t(MAT_KEY[m], locale)}
          </button>
        ))}
      </div>

      <div className="flex-1 space-y-1.5 overflow-y-auto pr-1 -mr-1">
        {filtered.map((m) => {
          const prices = m.prices as Record<string, number> | undefined
          const price = prices?.[matChoice]
          const disabled = price == null
          return (
            <button
              key={m.id}
              onClick={() => !disabled && addModule(m.id, matChoice)}
              disabled={disabled}
              className={`group w-full rounded-2xl border p-2.5 text-left transition-all duration-200 ${
                disabled
                  ? 'border-hairline bg-white/30 opacity-40 cursor-not-allowed'
                  : 'border-hairline bg-white/55 hover:bg-white hover:border-brand-primary/40 hover:shadow-aurora hover:-translate-y-px'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="truncate text-[13px] font-semibold text-ink">{pickName(m.name, locale)}</div>
                <div className="shrink-0 rounded-full bg-brand-primary/12 text-brand-primary text-[10px] font-bold px-2 py-0.5">{m.area_m2} m²</div>
              </div>
              <div className="mt-1 flex items-center justify-between text-[10px]">
                <span className="text-ink3">{m.connectors.length} sides · {t(MAT_KEY[matChoice], locale)}</span>
                <span className={`font-mono ${disabled ? 'text-ink3' : 'text-ink font-semibold'}`}>{price != null ? `${price.toLocaleString()} GEL` : '—'}</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
