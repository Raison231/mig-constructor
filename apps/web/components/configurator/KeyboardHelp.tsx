'use client'

export function KeyboardHelp() {
  const items = [
    { k: 'Click', d: 'Select module' },
    { k: 'Q / E', d: 'Rotate ±90°' },
    { k: '⌘D', d: 'Duplicate' },
    { k: 'Del', d: 'Remove' },
    { k: '⌘Z', d: 'Undo' },
    { k: '⌘⇧Z', d: 'Redo' },
  ]
  return (
    <div className="glass rounded-xl px-3 py-2 text-[10px]">
      <div className="mb-1 font-mono uppercase tracking-wider text-fg-secondary">Shortcuts</div>
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
