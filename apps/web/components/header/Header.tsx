'use client'

import { useState } from 'react'
import { useConfigurator } from '@/stores/configurator'
import { useLocale, type Locale } from '@/stores/locale'
import { t } from '@mig/i18n'
import { copyShareLink } from '@/lib/url-state'
import { downloadSceneScreenshot } from '@/lib/screenshot'

const LOCALES: Locale[] = ['ru', 'en', 'ka']
const LOCALE_LABELS: Record<Locale, string> = { ru: 'RU', en: 'EN', ka: 'KA' }

export function Header() {
  const locale = useLocale((s) => s.locale)
  const setLocale = useLocale((s) => s.setLocale)
  const modules = useConfigurator((s) => s.modules)
  const reset = useConfigurator((s) => s.reset)
  const [toast, setToast] = useState<string | null>(null)

  async function share() {
    const ok = await copyShareLink(modules)
    setToast(t(ok ? 'share.copied' : 'share.failed', locale))
    setTimeout(() => setToast(null), 2000)
  }

  return (
    <header className="pointer-events-none absolute left-0 right-0 top-0 z-20 flex items-center justify-between p-6">
      <div className="pointer-events-auto flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-accent-green" />
        <span className="font-mono text-sm font-semibold tracking-tight">MIG.CONSTRUCTOR</span>
        <span className="ml-2 rounded-md bg-panel px-2 py-0.5 text-xs text-fg-secondary">
          {t('app.subtitle', locale)}
        </span>
      </div>

      <div className="pointer-events-auto flex items-center gap-2 text-xs">
        <button onClick={share} className="glass rounded-lg px-3 py-1.5 hover:bg-panel">
          {t('header.share', locale)}
        </button>
        <button onClick={downloadSceneScreenshot} className="glass rounded-lg px-3 py-1.5 hover:bg-panel">
          {t('header.screenshot', locale)}
        </button>
        <button onClick={reset} className="glass rounded-lg px-3 py-1.5 text-accent-orange hover:bg-panel">
          {t('header.reset', locale)}
        </button>

        <div className="ml-2 flex gap-1 rounded-lg bg-panel p-1">
          {LOCALES.map((l) => (
            <button
              key={l}
              onClick={() => setLocale(l)}
              className={`rounded-md px-2 py-1 text-[10px] ${locale === l ? 'bg-accent-green text-bg' : 'text-fg-secondary hover:text-fg'}`}
            >
              {LOCALE_LABELS[l]}
            </button>
          ))}
        </div>
      </div>

      {toast && (
        <div className="pointer-events-none absolute left-1/2 top-20 -translate-x-1/2 rounded-lg bg-accent-green px-4 py-2 text-xs font-medium text-bg">
          {toast}
        </div>
      )}
    </header>
  )
}
