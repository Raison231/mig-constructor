'use client'

import { useConfigurator } from '@/stores/configurator'
import { modules } from '@mig/modules-schema'
import type { Material } from '@mig/modules-schema'
import { useLocale } from '@/stores/locale'
import { t, pickName } from '@mig/i18n'

const MAT_KEY: Record<Material, string> = {
  container: 'mat.container', timber: 'mat.timber', hybrid: 'mat.hybrid',
}

export function SelectionPanel() {
  const selectionId = useConfigurator((s) => s.selectionId)
  const all = useConfigurator((s) => s.modules)
  const rotate = useConfigurator((s) => s.rotateSelected)
  const duplicate = useConfigurator((s) => s.duplicateSelected)
  const remove = useConfigurator((s) => s.removeSelected)
  const deselect = useConfigurator((s) => s.deselect)
  const locale = useLocale((s) => s.locale)

  const instance = all.find((m) => m.instanceId === selectionId)
  if (!instance) return null
  const def = modules.find((d) => d.id === instance.moduleId)
  if (!def) return null

  return (
    <div className="glass rounded-3xl p-4 animate-fade-up relative overflow-hidden">
      <div className="pointer-events-none absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-brand-secondary/18 blur-3xl" aria-hidden />
      <div className="mb-3 flex items-start justify-between relative">
        <div>
          <div className="text-sm font-bold text-ink">{pickName(def.name, locale)}</div>
          <div className="mt-0.5 text-[11px] text-ink2">
            {t(MAT_KEY[instance.material], locale)} · {def.area_m2} m² · {def.connectors.length} sides
          </div>
        </div>
        <button
          onClick={deselect}
          className="h-7 w-7 rounded-full border border-hairline bg-white/65 text-ink2 hover:bg-white hover:text-ink transition"
          aria-label={t('sel.deselect', locale)}
        >✕</button>
      </div>

      <div className="grid grid-cols-2 gap-2 relative">
        <button onClick={() => rotate(-Math.PI / 2)} className="rounded-2xl border border-hairline bg-white/65 py-2 text-xs font-semibold text-ink hover:bg-white hover:border-brand-primary/40 transition">↺ 90° (Q)</button>
        <button onClick={() => rotate(Math.PI / 2)} className="rounded-2xl border border-hairline bg-white/65 py-2 text-xs font-semibold text-ink hover:bg-white hover:border-brand-primary/40 transition">↻ 90° (E)</button>
      </div>
      <button onClick={duplicate} className="mt-2 w-full rounded-2xl border border-hairline bg-white/65 py-2 text-xs font-semibold text-ink hover:bg-white hover:border-brand-primary/40 transition relative">⧉ {t('sel.duplicate', locale)} (⌘D)</button>
      <button onClick={remove} className="mt-2 w-full rounded-2xl border border-brand-coral/30 bg-brand-coral/10 py-2 text-xs font-semibold text-brand-coral hover:bg-brand-coral hover:text-white transition relative">✕ {t('sel.delete', locale)} (Del)</button>
    </div>
  )
}
