'use client'

import { useState } from 'react'
import { MOOD_PRESETS, applyMood, useMoods } from '@/stores/moods'

export function MoodPanel() {
  const activeId = useMoods((s) => s.activeId)
  const [hoverId, setHoverId] = useState<string | null>(null)
  const hovered = hoverId ? MOOD_PRESETS.find((m) => m.id === hoverId) : null

  return (
    <div className="glass rounded-3xl p-3.5 border border-hairline bg-white/60">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-base">🎭</span>
          <span className="text-[13px] font-semibold text-ink">Настроения</span>
        </div>
        {activeId && (
          <span className="text-[10px] font-mono text-ink3">
            {MOOD_PRESETS.find((m) => m.id === activeId)?.label}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        {MOOD_PRESETS.map((mood) => {
          const isActive = activeId === mood.id
          return (
            <button
              key={mood.id}
              type="button"
              onClick={() => applyMood(mood.id)}
              onMouseEnter={() => setHoverId(mood.id)}
              onMouseLeave={() => setHoverId(null)}
              className={`flex items-center gap-1.5 rounded-2xl px-2.5 py-2 text-left transition ${
                isActive
                  ? 'bg-aurora-primary text-white shadow-aurora-primary'
                  : 'bg-ink/5 text-ink hover:bg-ink/10'
              }`}
            >
              <span className="text-base leading-none">{mood.emoji}</span>
              <span className="text-[11px] font-bold leading-tight">{mood.label}</span>
            </button>
          )
        })}
      </div>

      {hovered && (
        <div className="mt-2 rounded-2xl bg-ink/5 px-3 py-2 text-[11px] text-ink2 leading-snug">
          {hovered.description}
        </div>
      )}
      {!hovered && activeId && (
        <div className="mt-2 rounded-2xl bg-ink/5 px-3 py-2 text-[11px] text-ink3 leading-snug">
          Наведи на карточку — увидишь описание.
        </div>
      )}
      {!hovered && !activeId && (
        <div className="mt-2 rounded-2xl bg-ink/5 px-3 py-2 text-[11px] text-ink3 leading-snug">
          Один тап — погода, время и звук переключаются пакетом.
        </div>
      )}
    </div>
  )
}
