'use client'

import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import { ModulePanel } from '@/components/configurator/ModulePanel'
import { PricePanel } from '@/components/configurator/PricePanel'
import { Timeline } from '@/components/configurator/Timeline'
import { SelectionPanel } from '@/components/configurator/SelectionPanel'
import { KeyboardHelp } from '@/components/configurator/KeyboardHelp'
import { useConfigurator } from '@/stores/configurator'

const Scene = dynamic(() => import('@/components/three/Scene').then((m) => m.Scene), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center text-fg-secondary">
      Загружаем сцену…
    </div>
  ),
})

export default function HomePage() {
  const selectionId = useConfigurator((s) => s.selectionId)
  const rotate = useConfigurator((s) => s.rotateSelected)
  const duplicate = useConfigurator((s) => s.duplicateSelected)
  const remove = useConfigurator((s) => s.removeSelected)
  const undo = useConfigurator((s) => s.undo)
  const redo = useConfigurator((s) => s.redo)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement | null)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      const meta = e.metaKey || e.ctrlKey
      const k = e.key.toLowerCase()
      if (meta && k === 'z' && !e.shiftKey) { e.preventDefault(); undo(); return }
      if (meta && (k === 'y' || (e.shiftKey && k === 'z'))) { e.preventDefault(); redo(); return }
      if (meta && k === 'd') { e.preventDefault(); duplicate(); return }
      if (!meta && (e.key === 'Delete' || e.key === 'Backspace')) { e.preventDefault(); remove(); return }
      if (!meta && k === 'q') { e.preventDefault(); rotate(-Math.PI / 2); return }
      if (!meta && k === 'e') { e.preventDefault(); rotate(Math.PI / 2); return }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [rotate, duplicate, remove, undo, redo])

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-bg">
      <Scene />

      <header className="pointer-events-none absolute left-0 right-0 top-0 z-10 flex items-center justify-between p-6">
        <div className="pointer-events-auto flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-accent-green" />
          <span className="font-mono text-sm font-semibold tracking-tight">MIG.CONSTRUCTOR</span>
          <span className="ml-2 rounded-md bg-panel px-2 py-0.5 text-xs text-fg-secondary">
            v0.2 · Wave 2
          </span>
        </div>
        <div className="pointer-events-auto flex gap-2 text-xs text-fg-secondary">
          <button className="glass rounded-lg px-3 py-1.5">RU</button>
          <button className="glass rounded-lg px-3 py-1.5">EN</button>
          <button className="glass rounded-lg px-3 py-1.5">KA</button>
        </div>
      </header>

      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="pointer-events-auto absolute left-6 top-24 bottom-24 w-72">
          <ModulePanel />
        </div>
        <div className="pointer-events-auto absolute right-6 top-24 w-80 space-y-3">
          <PricePanel />
          {selectionId && <SelectionPanel />}
        </div>
        <div className="pointer-events-auto absolute bottom-6 left-6 right-[26rem]">
          <Timeline />
        </div>
        <div className="pointer-events-auto absolute bottom-6 right-6 w-72">
          <KeyboardHelp />
        </div>
      </div>
    </main>
  )
}
