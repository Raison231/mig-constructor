'use client'

import type { CSSProperties } from 'react'
import { useMobileUi, type MobileTab } from '@/stores/mobileUi'

const TABBAR_STYLE: CSSProperties = {
  paddingBottom: 'calc(0.375rem + env(safe-area-inset-bottom, 0px))',
}

const TABS: Array<{ id: MobileTab; emoji: string; label: string }> = [
  { id: 'build', emoji: '🧩', label: 'Сборка' },
  { id: 'world', emoji: '🌍', label: 'Мир' },
  { id: 'pro', emoji: '⚙️', label: 'Pro' },
  { id: 'ai', emoji: '🤖', label: 'AI' },
  { id: 'cost', emoji: '💰', label: 'Цена' },
]

/**
 * Fixed bottom tab bar — 5 categories. Tap a tab to open MobileSheet with its panels;
 * tap the active tab again to close. Respects iOS safe-area-inset-bottom.
 */
export function MobileTabBar() {
  const activeTab = useMobileUi((s) => s.activeTab)
  const toggleTab = useMobileUi((s) => s.toggleTab)

  return (
    <nav
      className="md:hidden pointer-events-auto fixed left-0 right-0 bottom-0 z-30 glass-strong border-t border-hairline px-1.5 pt-1.5"
      style={TABBAR_STYLE}
      aria-label="Разделы"
    >
      <div className="flex items-stretch justify-between gap-1">
        {TABS.map((tab) => {
          const active = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => toggleTab(tab.id)}
              className={
                'flex-1 flex flex-col items-center justify-center gap-0.5 rounded-2xl py-1.5 transition active:scale-95 ' +
                (active
                  ? 'bg-brand-primary text-white shadow-aurora-primary'
                  : 'text-ink2 hover:bg-white/60')
              }
              aria-pressed={active}
              aria-label={tab.label}
            >
              <span className="text-lg leading-none">{tab.emoji}</span>
              <span className="text-[10px] font-bold leading-none mt-0.5">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
