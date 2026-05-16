'use client'

import { useState } from 'react'
import { modules, type Material } from '@mig/modules-schema'
import { useConfigurator } from '@/stores/configurator'
import clsx from 'clsx'

const CATEGORIES = ['core', 'wet', 'leisure', 'utility', 'roof', 'cellar', 'exterior'] as const

export function ModulePanel() {
  const [material, setMaterial] = useState<Material>('container')
  const [category, setCategory] = useState<(typeof CATEGORIES)[number] | 'all'>('all')
  const addModule = useConfigurator((s) => s.addModule)

  const visible = modules.filter(
    (m) =>
      m.materials.includes(material) && (category === 'all' || m.category === category),
  )

  return (
    <div className="glass flex h-full flex-col rounded-2xl p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-mono text-xs uppercase tracking-wider text-fg-secondary">Modules</h2>
        <span className="text-xs text-fg-secondary">{visible.length}</span>
      </div>

      <div className="mb-3 grid grid-cols-3 gap-1 rounded-lg bg-bg p-1">
        {(['container', 'timber', 'hybrid'] as Material[]).map((m) => (
          <button
            key={m}
            onClick={() => setMaterial(m)}
            className={clsx(
              'rounded-md px-2 py-1.5 text-xs capitalize transition-colors',
              material === m ? 'bg-panel text-fg' : 'text-fg-secondary hover:text-fg',
            )}
          >
            {m === 'container' ? '📦' : m === 'timber' ? '🌲' : '⚡️'} {m}
          </button>
        ))}
      </div>

      <div className="mb-3 flex flex-wrap gap-1">
        <button
          onClick={() => setCategory('all')}
          className={clsx(
            'rounded-md px-2 py-1 text-xs',
            category === 'all' ? 'bg-accent-green text-bg' : 'bg-bg text-fg-secondary',
          )}
        >
          all
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={clsx(
              'rounded-md px-2 py-1 text-xs',
              category === c ? 'bg-accent-green text-bg' : 'bg-bg text-fg-secondary',
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="flex-1 space-y-1.5 overflow-y-auto pr-1">
        {visible.map((m) => (
          <button
            key={m.id}
            onClick={() => addModule(m.id, material)}
            className="flex w-full items-center justify-between rounded-lg bg-bg p-2.5 text-left hover:bg-panel"
          >
            <div>
              <div className="text-sm font-medium">{m.name.ru}</div>
              <div className="text-[11px] text-fg-secondary">{m.area_m2} m² · {m.category}</div>
            </div>
            <div className="font-mono text-xs text-accent-green">+</div>
          </button>
        ))}
      </div>
    </div>
  )
}
