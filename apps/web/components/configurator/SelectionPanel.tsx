'use client'

import { useConfigurator } from '@/stores/configurator'
import { getModule } from '@mig/modules-schema'

export function SelectionPanel() {
  const selectionId = useConfigurator((s) => s.selectionId)
  const modules = useConfigurator((s) => s.modules)
  const rotate = useConfigurator((s) => s.rotateSelected)
  const duplicate = useConfigurator((s) => s.duplicateSelected)
  const remove = useConfigurator((s) => s.removeSelected)
  const deselect = useConfigurator((s) => s.deselect)

  const instance = modules.find((m) => m.instanceId === selectionId)
  if (!instance) return null
  const def = getModule(instance.moduleId)
  if (!def) return null

  return (
    <div className="glass rounded-2xl p-4">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <div className="text-sm font-semibold">{def.name.ru}</div>
          <div className="text-[11px] capitalize text-fg-secondary">
            {instance.material} · {def.area_m2} m² · {def.connectors.length} sides
          </div>
        </div>
        <button onClick={deselect} className="text-fg-secondary hover:text-fg" aria-label="Deselect">
          ✕
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => rotate(-Math.PI / 2)} className="rounded-lg bg-bg py-2 text-xs hover:bg-panel">
          ↺ 90° (Q)
        </button>
        <button onClick={() => rotate(Math.PI / 2)} className="rounded-lg bg-bg py-2 text-xs hover:bg-panel">
          ↻ 90° (E)
        </button>
      </div>
      <button
        onClick={duplicate}
        className="mt-2 w-full rounded-lg bg-bg py-2 text-xs hover:bg-panel"
      >
        ⧉ Duplicate (⌘D)
      </button>
      <button
        onClick={remove}
        className="mt-2 w-full rounded-lg bg-bg py-2 text-xs text-accent-orange hover:bg-panel"
      >
        ✕ Delete (Del)
      </button>
    </div>
  )
}
