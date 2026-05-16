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
    <div className="glass rounded-2xl p-4">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <div className="text-sm font-semibold">{pickName(def.name, locale)}</div>
          <div className="text-[11px] text-fg-secondary">
            {t(MAT_KEY[instance.material], locale)} · {def.area_m2} m² · {def.connectors.length} sides
          </div>
        </div>
        <button onClick={deselect} className="text-fg-secondary hover:text-fg" aria-label={t('sel.deselect', locale)}>✕</button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => rotate(-Math.PI / 2)} className="rounded-lg bg-bg py-2 text-xs hover:bg-panel">↺ 90° (Q)</button>
        <button onClick={() => rotate(Math.PI / 2)} className="rounded-lg bg-bg py-2 text-xs hover:bg-panel">↻ 90° (E)</button>
      </div>
      <button onClick={duplicate} className="mt-2 w-full rounded-lg bg-bg py-2 text-xs hover:bg-panel">⧉ {t('sel.duplicate', locale)} (⌘D)</button>
      <button onClick={remove} className="mt-2 w-full rounded-lg bg-bg py-2 text-xs text-accent-orange hover:bg-panel">✕ {t('sel.delete', locale)} (Del)</button>
    </div>
  )
}
