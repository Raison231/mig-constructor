'use client'

import { useState } from 'react'
import type { CSSProperties } from 'react'
import { useAudio } from '@/stores/audio'

const POPOVER_STYLE: CSSProperties = {
  top: 'calc(100% + 8px)',
  right: 0,
  minWidth: '220px',
}

export function AudioBadge() {
  const enabled = useAudio((s) => s.enabled)
  const masterVolume = useAudio((s) => s.masterVolume)
  const setEnabled = useAudio((s) => s.setEnabled)
  const setMasterVolume = useAudio((s) => s.setMasterVolume)
  const markUnlocked = useAudio((s) => s.markUnlocked)
  const [open, setOpen] = useState(false)

  const icon = !enabled ? '🔇' : masterVolume < 0.05 ? '🔈' : masterVolume < 0.5 ? '🔉' : '🔊'

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => { markUnlocked(); setOpen((v) => !v) }}
        className={`rounded-2xl px-3 py-1.5 text-xs font-semibold transition border ${enabled ? 'bg-emerald-500 text-white border-emerald-500 shadow-aurora-primary' : 'glass text-ink2 border-transparent hover:bg-white'}`}
        title={enabled ? 'Амбиент: вкл' : 'Амбиент: выкл'}
      >
        {icon}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} aria-hidden />
          <div
            className="absolute z-40 glass-strong rounded-2xl p-3 shadow-2xl border border-hairline"
            style={POPOVER_STYLE}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink3">Амбиент</span>
              <button
                onClick={() => { markUnlocked(); setEnabled(!enabled) }}
                className={`rounded-full px-2 py-0.5 text-[9px] font-bold border transition ${enabled ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-ink3 border-hairline'}`}
              >
                {enabled ? 'ON' : 'OFF'}
              </button>
            </div>
            <div className="flex items-center justify-between text-[10px] mb-1">
              <span className="text-ink2 font-medium">Общая</span>
              <span className="font-mono text-emerald-600 font-bold">{Math.round(masterVolume * 100)}%</span>
            </div>
            <input
              type="range" min={0} max={1} step={0.05} value={masterVolume}
              onChange={(e) => setMasterVolume(Number(e.target.value))}
              className="aurora-range w-full"
              disabled={!enabled}
            />
            <div className="mt-2 text-[9px] text-ink3 leading-snug">
              {enabled ? 'Биом и погода управляют миксом автоматически' : 'Нажми ON чтобы включить слои звука'}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
