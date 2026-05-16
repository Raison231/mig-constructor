'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef } from 'react'
import { ModulePanel } from '@/components/configurator/ModulePanel'
import { PricePanel } from '@/components/configurator/PricePanel'
import { Timeline } from '@/components/configurator/Timeline'
import { SelectionPanel } from '@/components/configurator/SelectionPanel'
import { KeyboardHelp } from '@/components/configurator/KeyboardHelp'
import { Header } from '@/components/header/Header'
import { useConfigurator } from '@/stores/configurator'
import { useLocale } from '@/stores/locale'
import { t } from '@mig/i18n'
import { decodeLayout, encodeLayout } from '@/lib/url-state'

const Scene = dynamic(() => import('@/components/three/Scene').then((m) => m.Scene), {
  ssr: false,
  loading: () => null,
})

export default function HomePage() {
  const selectionId = useConfigurator((s) => s.selectionId)
  const modules = useConfigurator((s) => s.modules)
  const setLayout = useConfigurator((s) => s.setLayout)
  const rotate = useConfigurator((s) => s.rotateSelected)
  const duplicate = useConfigurator((s) => s.duplicateSelected)
  const remove = useConfigurator((s) => s.removeSelected)
  const undo = useConfigurator((s) => s.undo)
  const redo = useConfigurator((s) => s.redo)
  const locale = useLocale((s) => s.locale)
  const hydratedRef = useRef(false)

  useEffect(() => {
    if (hydratedRef.current) return
    hydratedRef.current = true
    if (typeof window === 'undefined') return
    const hash = window.location.hash.replace(/^#layout=/, '')
    if (hash) {
      const parsed = decodeLayout(hash)
      if (parsed && parsed.length > 0) setLayout(parsed)
    }
  }, [setLayout])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (modules.length === 0) {
      if (window.location.hash) history.replaceState(null, '', window.location.pathname)
      return
    }
    const h = encodeLayout(modules)
    history.replaceState(null, '', `#layout=${h}`)
  }, [modules])

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
      <Header />

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

      <noscript className="absolute inset-0 flex items-center justify-center text-fg">
        {t('loading.scene', locale)}
      </noscript>
    </main>
  )
}
