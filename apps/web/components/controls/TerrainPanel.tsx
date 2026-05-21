'use client'

import { useState } from 'react'
import { useTerrain, type TerrainMaterial } from '@/stores/terrain'
import { TERRAIN_MATERIALS, TERRAIN_MATERIAL_ORDER } from '@/lib/terrain'

/**
 * Soil & Terrain Painter panel. Switches the scene into a paint mode where
 * the overlay plane catches pointer events and the user paints splatmap
 * channels onto the ground. Glass card, AURORA tokens, optimistic UX.
 */
export function TerrainPanel() {
  const enabled = useTerrain((s) => s.enabled)
  const setEnabled = useTerrain((s) => s.setEnabled)
  const painting = useTerrain((s) => s.painting)
  const setPainting = useTerrain((s) => s.setPainting)
  const brushMaterial = useTerrain((s) => s.brushMaterial)
  const setBrushMaterial = useTerrain((s) => s.setBrushMaterial)
  const brushSize = useTerrain((s) => s.brushSize)
  const setBrushSize = useTerrain((s) => s.setBrushSize)
  const brushOpacity = useTerrain((s) => s.brushOpacity)
  const setBrushOpacity = useTerrain((s) => s.setBrushOpacity)
  const clear = useTerrain((s) => s.clear)
  const fillAll = useTerrain((s) => s.fillAll)

  const [confirmClear, setConfirmClear] = useState(false)

  return (
    <div className="rounded-3xl border border-black/10 bg-white/65 backdrop-blur-md p-3.5 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-base leading-none">🎨</span>
          <h3 className="text-[12px] font-bold tracking-tight text-black/80">Краска почвы</h3>
        </div>
        <button
          type="button"
          onClick={() => {
            const next = !enabled
            setEnabled(next)
            if (!next) setPainting(false)
          }}
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${enabled ? 'bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25' : 'bg-black/10 text-black/60 hover:bg-black/15'}`}
        >
          {enabled ? 'ON' : 'off'}
        </button>
      </div>

      {enabled && (
        <>
          <button
            type="button"
            onClick={() => setPainting(!painting)}
            className={`w-full h-9 rounded-2xl text-[11px] font-bold transition-all ${painting
              ? 'bg-red-500/90 hover:bg-red-500 text-white shadow-md'
              : 'bg-emerald-500/95 hover:bg-emerald-500 text-white shadow-aurora-primary'}`}
          >
            {painting ? '✕ Остановить краску' : '🖌️ Красить землю'}
          </button>

          {painting && (
            <p className="mt-2 text-[10px] text-black/55 leading-snug">
              Клики и тяни по земле — перетаскивание модулей приостановлено на время покраски.
            </p>
          )}

          <div className="mt-3">
            <div className="text-[10px] font-semibold text-black/60 mb-1.5">Материал</div>
            <div className="grid grid-cols-6 gap-1.5">
              {TERRAIN_MATERIAL_ORDER.map((id) => {
                const def = TERRAIN_MATERIALS[id]
                const active = brushMaterial === id
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setBrushMaterial(id as TerrainMaterial)}
                    className={`relative h-10 rounded-xl border transition-all flex items-center justify-center text-base ${active ? 'border-emerald-500 ring-2 ring-emerald-500/40 scale-105' : 'border-black/15 hover:border-black/30'}`}
                    style= background: def.color 
                    title={def.label}
                  >
                    <span className="drop-shadow-sm">{def.emoji}</span>
                  </button>
                )
              })}
            </div>
            <div className="mt-1 text-center text-[10px] font-semibold text-black/65">
              {TERRAIN_MATERIALS[brushMaterial].label}
            </div>
          </div>

          <div className="mt-3 space-y-2">
            <div>
              <div className="flex items-center justify-between text-[10px] font-semibold text-black/60 mb-1">
                <span>Размер кисти</span>
                <span>{brushSize} пкс</span>
              </div>
              <input
                type="range"
                min={1}
                max={64}
                step={1}
                value={brushSize}
                onChange={(e) => setBrushSize(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-500"
              />
            </div>
            <div>
              <div className="flex items-center justify-between text-[10px] font-semibold text-black/60 mb-1">
                <span>Нажим</span>
                <span>{Math.round(brushOpacity * 100)}%</span>
              </div>
              <input
                type="range"
                min={0.05}
                max={1}
                step={0.05}
                value={brushOpacity}
                onChange={(e) => setBrushOpacity(parseFloat(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => fillAll(brushMaterial)}
              disabled={brushMaterial === 'erase'}
              className="h-8 rounded-xl text-[10px] font-bold bg-black/5 hover:bg-black/10 text-black/70 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              title="Залить всю поверхность выбранным материалом"
            >
              🪣 Залить всё
            </button>
            <button
              type="button"
              onClick={() => {
                if (confirmClear) {
                  clear()
                  setConfirmClear(false)
                } else {
                  setConfirmClear(true)
                  setTimeout(() => setConfirmClear(false), 2200)
                }
              }}
              className={`h-8 rounded-xl text-[10px] font-bold transition-colors ${confirmClear ? 'bg-red-500/90 hover:bg-red-500 text-white' : 'bg-black/5 hover:bg-black/10 text-black/70'}`}
              title="Очистить всю покраску"
            >
              {confirmClear ? '⚠️ Точно?' : '🧽 Очистить'}
            </button>
          </div>
        </>
      )}

      {!enabled && (
        <p className="text-[10px] text-black/55 leading-snug">
          Крась траву, песок, камень, грязь или снег кистью прямо по земле участка. Включи и жми «Красить».
        </p>
      )}
    </div>
  )
}
