'use client'

import { useEffect } from 'react'
import { useMobileUi, type MobileTab } from '@/stores/mobileUi'
import { useConfigurator } from '@/stores/configurator'
import { ModulePanel } from '@/components/configurator/ModulePanel'
import { SelectionPanel } from '@/components/configurator/SelectionPanel'
import { PricePanel } from '@/components/configurator/PricePanel'
import { WorldPanel } from '@/components/controls/WorldPanel'
import { ProPanel } from '@/components/controls/ProPanel'
import { TemplatesPanel } from '@/components/controls/TemplatesPanel'
import { CinematicPanel } from '@/components/controls/CinematicPanel'
import { LandPanel } from '@/components/header/LandPanel'
import { CopilotPanel } from '@/components/header/CopilotPanel'
import { PresetsPanel } from '@/components/header/PresetsPanel'
import { CustomModulesPanel } from '@/components/header/CustomModulesPanel'

const TAB_TITLES: Record<MobileTab, string> = {
  build: '🧩 Сборка',
  world: '🌍 Мир и участок',
  pro: '⚙️ Pro и режиссура',
  ai: '🤖 AI и пресеты',
  cost: '💰 Стоимость и сроки',
}

/**
 * Bottom-sheet panel shown above MobileTabBar. Renders panels for the active tab.
 * Tap the backdrop or close button to dismiss.
 */
export function MobileSheet() {
  const activeTab = useMobileUi((s) => s.activeTab)
  const setActiveTab = useMobileUi((s) => s.setActiveTab)
  const selectionId = useConfigurator((s) => s.selectionId)

  // Lock background scroll while the sheet is open.
  useEffect(() => {
    if (!activeTab) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [activeTab])

  if (!activeTab) return null

  return (
    <>
      <div
        onClick={() => setActiveTab(null)}
        className="md:hidden fixed inset-0 z-20 bg-ink/25 backdrop-blur-[2px] pointer-events-auto animate-fade-up"
        aria-hidden="true"
      />
      <section
        className="md:hidden fixed left-0 right-0 z-30 pointer-events-auto glass-strong rounded-t-3xl border-t border-hairline shadow-2xl animate-fade-up flex flex-col"
        style=
          bottom: 'calc(4.25rem + env(safe-area-inset-bottom, 0px))',
          top: 'calc(4.5rem + env(safe-area-inset-top, 0px))',
        
        role="dialog"
        aria-modal="true"
        aria-label={TAB_TITLES[activeTab]}
      >
        {/* drag handle */}
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 rounded-full bg-ink3/30" />
        </div>
        {/* title + close */}
        <div className="flex items-center justify-between px-4 pb-2 border-b border-hairline">
          <div className="text-[13px] font-bold text-ink">{TAB_TITLES[activeTab]}</div>
          <button
            type="button"
            onClick={() => setActiveTab(null)}
            className="rounded-xl border border-hairline bg-white/60 px-2.5 py-1 text-[11px] font-bold text-ink2 hover:bg-white transition active:scale-95"
            aria-label="Закрыть"
          >
            ✕
          </button>
        </div>
        {/* panels */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-3 py-3 space-y-3">
          {activeTab === 'build' && (
            <>
              <ModulePanel />
              {selectionId && <SelectionPanel />}
            </>
          )}
          {activeTab === 'world' && (
            <>
              <WorldPanel />
              <LandPanel />
            </>
          )}
          {activeTab === 'pro' && (
            <>
              <ProPanel />
              <TemplatesPanel />
              <CinematicPanel />
            </>
          )}
          {activeTab === 'ai' && (
            <>
              <CopilotPanel />
              <PresetsPanel />
              <CustomModulesPanel />
            </>
          )}
          {activeTab === 'cost' && <PricePanel />}
        </div>
      </section>
    </>
  )
}
