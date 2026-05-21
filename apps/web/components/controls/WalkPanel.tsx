'use client'

import { useCinematic } from '@/stores/cinematic'

const KBD = 'inline-flex items-center justify-center min-w-[1.4rem] h-[1.4rem] px-1 rounded-md border border-black/15 bg-white/70 text-[10px] font-bold text-black/70 shadow-sm'

/**
 * Compact glass panel to enter/exit first-person Walk Mode and tweak
 * eye height + walk speed. Mounted in the right-hand desktop column.
 */
export function WalkPanel() {
  const mode = useCinematic((s) => s.mode)
  const setMode = useCinematic((s) => s.setMode)
  const walkHeight = useCinematic((s) => s.walkHeight)
  const setWalkHeight = useCinematic((s) => s.setWalkHeight)
  const walkSpeed = useCinematic((s) => s.walkSpeed)
  const setWalkSpeed = useCinematic((s) => s.setWalkSpeed)
  const collisionsEnabled = useCinematic((s) => s.walkCollisionsEnabled)
  const setCollisionsEnabled = useCinematic((s) => s.setWalkCollisionsEnabled)

  const active = mode === 'walkthrough'

  return (
    <div className="rounded-3xl border border-black/10 bg-white/65 backdrop-blur-md p-3.5 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-base leading-none">🚶</span>
          <h3 className="text-[12px] font-bold tracking-tight text-black/80">Walk Mode</h3>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${active ? 'bg-emerald-500/15 text-emerald-700' : 'bg-black/10 text-black/60'}`}>
          {active ? 'ACTIVE' : 'idle'}
        </span>
      </div>

      <button
        type="button"
        onClick={() => setMode(active ? 'off' : 'walkthrough')}
        className={`w-full h-9 rounded-2xl text-[11px] font-bold transition-all ${active
          ? 'bg-red-500/90 hover:bg-red-500 text-white shadow-md'
          : 'bg-emerald-500/95 hover:bg-emerald-500 text-white shadow-aurora-primary'}`}
      >
        {active ? '✕ Выйти из Walk' : '⏎ Пойти на участок'}
      </button>

      {active && (
        <p className="mt-2 text-[10px] text-black/55 leading-snug">
          Кликни на сцену — курсор захватится. <kbd className={KBD}>Esc</kbd> — отпустить.
        </p>
      )}

      <div className="mt-3 grid grid-cols-4 gap-1 text-[10px] text-black/65">
        <div className="flex items-center gap-1"><kbd className={KBD}>W</kbd> вперёд</div>
        <div className="flex items-center gap-1"><kbd className={KBD}>S</kbd> назад</div>
        <div className="flex items-center gap-1"><kbd className={KBD}>A</kbd> влево</div>
        <div className="flex items-center gap-1"><kbd className={KBD}>D</kbd> вправо</div>
      </div>
      <div className="mt-1.5 grid grid-cols-3 gap-1 text-[10px] text-black/65">
        <div className="flex items-center gap-1"><kbd className={KBD}>⇧</kbd> бег</div>
        <div className="flex items-center gap-1"><kbd className={KBD}>␣</kbd> прыжок</div>
        <div className="flex items-center gap-1"><kbd className={KBD}>C</kbd> присесть</div>
      </div>

      <div className="mt-3 space-y-2">
        <div>
          <div className="flex items-center justify-between text-[10px] font-semibold text-black/60 mb-1">
            <span>Рост (глаза)</span>
            <span>{walkHeight.toFixed(2)} м</span>
          </div>
          <input
            type="range"
            min={1.2}
            max={2.2}
            step={0.05}
            value={walkHeight}
            onChange={(e) => setWalkHeight(parseFloat(e.target.value))}
            className="w-full accent-emerald-500"
          />
        </div>
        <div>
          <div className="flex items-center justify-between text-[10px] font-semibold text-black/60 mb-1">
            <span>Скорость</span>
            <span>{walkSpeed.toFixed(1)} м/с</span>
          </div>
          <input
            type="range"
            min={0.8}
            max={6}
            step={0.1}
            value={walkSpeed}
            onChange={(e) => setWalkSpeed(parseFloat(e.target.value))}
            className="w-full accent-emerald-500"
          />
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-black/10">
        <button
          type="button"
          onClick={() => setCollisionsEnabled(!collisionsEnabled)}
          className={`w-full h-8 rounded-2xl text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 ${collisionsEnabled
            ? 'bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25'
            : 'bg-black/5 text-black/55 hover:bg-black/10'}`}
          title={collisionsEnabled ? 'Не проходишь сквозь стены' : 'Проходишь сквозь модули'}
        >
          <span className="text-sm leading-none">🧱</span>
          <span>Коллизии: {collisionsEnabled ? 'ON' : 'OFF'}</span>
        </button>
        {!collisionsEnabled && (
          <p className="mt-1.5 text-[9px] text-black/45 leading-snug text-center">
            Без коллизий пройдёшь сквозь модули — удобно для обзора.
          </p>
        )}
      </div>
    </div>
  )
}
