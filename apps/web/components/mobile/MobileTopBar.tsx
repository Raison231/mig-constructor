'use client'

import { useMobileUi } from '@/stores/mobileUi'
import { useConfigurator } from '@/stores/configurator'

/**
 * Compact top bar shown only on mobile (<768px).
 * Logo + AURORA badge + counter + hamburger (opens MobileMoreMenu).
 */
export function MobileTopBar() {
  const setMoreMenuOpen = useMobileUi((s) => s.setMoreMenuOpen)
  const modulesCount = useConfigurator((s) => s.modules.length)

  return (
    <header
      className="md:hidden pointer-events-auto fixed left-0 right-0 top-0 z-30 glass-strong border-b border-hairline px-3 flex items-center justify-between"
      style=
        paddingTop: 'calc(0.5rem + env(safe-area-inset-top, 0px))',
        paddingBottom: '0.5rem',
      
    >
      <div className="flex items-center gap-2 min-w-0">
        <div className="aurora-glow relative h-9 w-9 rounded-2xl bg-gradient-to-br from-brand-primary via-brand-secondary to-brand-field shadow-aurora-primary flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm font-extrabold drop-shadow">M</span>
        </div>
        <div className="flex flex-col leading-tight min-w-0">
          <span className="font-mono text-[11px] font-bold tracking-[0.04em] text-ink truncate">
            MIG.CONSTRUCTOR
          </span>
          <span className="text-[8px] tracking-[0.18em] text-ink3 uppercase truncate">
            AURORA · v0.11
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="rounded-full border border-hairline bg-white/60 px-2 py-1 text-[10px] font-bold text-ink2">
          {modulesCount} мод.
        </div>
        <button
          type="button"
          onClick={() => setMoreMenuOpen(true)}
          className="glass rounded-2xl px-3 py-1.5 text-[13px] font-bold text-ink hover:bg-white transition active:scale-95"
          aria-label="Меню"
        >
          ☰
        </button>
      </div>
    </header>
  )
}
