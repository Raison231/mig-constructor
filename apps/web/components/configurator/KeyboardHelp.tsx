'use client'

import { useLocale } from '@/stores/locale'
import { t } from '@mig/i18n'

export function KeyboardHelp() {
  const locale = useLocale((s) => s.locale)
  const items: Array<{ k: string; d: string }> = [
    { k: 'Click', d: t('shortcut.select', locale) },
    { k: 'Drag', d: t('shortcut.move', locale) },
    { k: 'Q / E', d: t('shortcut.rot', locale) },
    { k: '⌘D', d: t('shortcut.dup', locale) },
    { k: 'Del', d: t('shortcut.del', locale) },
    { k: '⌘Z', d: t('shortcut.undo', locale) },
    { k: '⌘⇧Z', d: t('shortcut.redo', locale) },
  ]
  return (
    <div className="glass rounded-3xl px-3.5 py-3 text-[10px]">
      <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink3">{t('panel.shortcuts', locale)}</div>
      <div className="grid grid-cols-1 gap-1">
        {items.map((i) => (
          <div key={i.k} className="flex items-center justify-between gap-3">
            <kbd className="rounded-lg border border-hairline bg-white/65 px-2 py-0.5 font-mono text-[10px] text-ink shadow-sm">{i.k}</kbd>
            <span className="text-ink2">{i.d}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
