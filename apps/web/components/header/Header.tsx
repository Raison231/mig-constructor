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
      <div className="pointer-events-auto flex items-center gap-3">
        <div className="aurora-glow relative h-10 w-10 rounded-2xl bg-gradient-to-br from-brand-primary via-brand-secondary to-brand-field shadow-aurora-primary flex items-center justify-center">
          <span className="text-white text-lg font-extrabold drop-shadow">M</span>
        </div>
        <div className="flex flex-col leading-tight">
          <span className="font-mono text-[13px] font-semibold tracking-[0.04em] text-ink">MIG.CONSTRUCTOR</span>
          <span className="mt-0.5 text-[10px] tracking-wider text-ink3 uppercase">{t('app.subtitle', locale)}</span>
        </div>
        <span className="ml-2 rounded-full bg-brand-primary/10 text-brand-primary px-2.5 py-0.5 text-[10px] font-semibold tracking-wide border border-brand-primary/20">AURORA · v0.9</span>
      </div>

      <div className="pointer-events-auto flex items-center gap-2">
        <button onClick={share} className="glass rounded-2xl px-3.5 py-1.5 text-xs font-semibold text-ink hover:bg-white transition">⤴ {t('header.share', locale)}</button>
        <button onClick={downloadSceneScreenshot} className="glass rounded-2xl px-3.5 py-1.5 text-xs font-semibold text-ink hover:bg-white transition">⎙ {t('header.screenshot', locale)}</button>
        <button onClick={reset} className="glass rounded-2xl px-3.5 py-1.5 text-xs font-semibold text-brand-coral hover:bg-brand-coral hover:text-white transition">⟲ {t('header.reset', locale)}</button>

        <div className="ml-2 flex gap-0.5 rounded-full glass p-1">
          {LOCALES.map((l) => (
            <button
              key={l}
              onClick={() => setLocale(l)}
              className={`rounded-full px-2.5 py-1 text-[10px] font-bold transition ${
                locale === l ? 'bg-brand-primary text-white shadow-aurora-primary' : 'text-ink2 hover:text-ink'
              }`}
            >
              {LOCALE_LABELS[l]}
            </button>
          ))}
        </div>
      </div>

      {toast && (
        <div className="pointer-events-none absolute left-1/2 top-20 -translate-x-1/2 animate-fade-up rounded-full bg-brand-primary px-4 py-2 text-xs font-semibold text-white shadow-aurora-primary">
          {toast}
        </div>
      )}
    </header>
  )
}
