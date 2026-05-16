'use client'

import dynamic from 'next/dynamic'
import { ModulePanel } from '@/components/configurator/ModulePanel'
import { PricePanel } from '@/components/configurator/PricePanel'
import { Timeline } from '@/components/configurator/Timeline'

const Scene = dynamic(() => import('@/components/three/Scene').then((m) => m.Scene), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center text-fg-secondary">
      Загружаем сцену…
    </div>
  ),
})

export default function HomePage() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-bg">
      <Scene />

      <header className="pointer-events-none absolute left-0 right-0 top-0 z-10 flex items-center justify-between p-6">
        <div className="pointer-events-auto flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-accent-green" />
          <span className="font-mono text-sm font-semibold tracking-tight">MIG.CONSTRUCTOR</span>
          <span className="ml-2 rounded-md bg-panel px-2 py-0.5 text-xs text-fg-secondary">
            v0.1 · Wave 1
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
        <div className="pointer-events-auto absolute right-6 top-24 w-80">
          <PricePanel />
        </div>
        <div className="pointer-events-auto absolute bottom-6 left-6 right-6">
          <Timeline />
        </div>
      </div>
    </main>
  )
}
