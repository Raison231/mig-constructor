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
    <div className="glass rounded-xl px-3 py-2 text-[10px]">
      <div className="mb-1 font-mono uppercase tracking-wider text-fg-secondary">{t('panel.shortcuts', locale)}</div>
      <div className="grid grid-cols-1 gap-0.5">
        {items.map((i) => (
          <div key={i.k} className="flex items-center justify-between gap-3 text-fg-secondary">
            <kbd className="rounded bg-bg px-1.5 py-0.5 font-mono text-fg">{i.k}</kbd>
            <span>{i.d}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
