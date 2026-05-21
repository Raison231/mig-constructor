// TERRAIN PAINTER — 6 soil materials + soft-falloff circle brush.
//
// Pure math / palette. Three.js-agnostic. The store owns the Uint8ClampedArray;
// this module just knows how to mutate it.

import type { TerrainMaterial } from '@/stores/terrain'

export interface TerrainMaterialDef {
  id: TerrainMaterial
  emoji: string
  label: string
  rgba: [number, number, number, number]  // 0..255, alpha is brush peak
  color: string                              // hex for UI swatch
}

export const TERRAIN_MATERIALS: Record<TerrainMaterial, TerrainMaterialDef> = {
  grass: { id: 'grass', emoji: '🌱', label: 'Трава',   rgba: [80, 140, 60, 220],  color: '#508c3c' },
  sand:  { id: 'sand',  emoji: '🏖️', label: 'Песок',   rgba: [220, 200, 140, 220], color: '#dcc88c' },
  stone: { id: 'stone', emoji: '🪨', label: 'Камень',  rgba: [150, 150, 155, 220], color: '#96969b' },
  dirt:  { id: 'dirt',  emoji: '🟤', label: 'Грязь',   rgba: [110, 80, 50, 220],   color: '#6e5032' },
  snow:  { id: 'snow',  emoji: '❄️',  label: 'Снег',    rgba: [240, 245, 250, 230], color: '#f0f5fa' },
  erase: { id: 'erase', emoji: '🧽', label: 'Стереть', rgba: [0, 0, 0, 0],          color: '#ffffff' },
}

export const TERRAIN_MATERIAL_ORDER: TerrainMaterial[] = ['grass', 'sand', 'stone', 'dirt', 'snow', 'erase']

/**
 * Paint a soft-edged circle of the given material into the RGBA splat data.
 * Uses linear falloff (1 - r/R) at the edge. `opacity` is a multiplier on top.
 * For 'erase', we drive alpha toward zero instead of mixing colors.
 */
export function paintCircle(
  data: Uint8ClampedArray,
  gridSize: number,
  cx: number,
  cy: number,
  radius: number,
  material: TerrainMaterial,
  opacity: number,
): void {
  if (radius <= 0) return
  const def = TERRAIN_MATERIALS[material]
  const isErase = material === 'erase'
  const r2 = radius * radius
  const x0 = Math.max(0, Math.floor(cx - radius))
  const x1 = Math.min(gridSize - 1, Math.ceil(cx + radius))
  const y0 = Math.max(0, Math.floor(cy - radius))
  const y1 = Math.min(gridSize - 1, Math.ceil(cy + radius))
  const peakAlpha = def.rgba[3]
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const dx = x - cx, dy = y - cy
      const d2 = dx * dx + dy * dy
      if (d2 > r2) continue
      const t = 1 - Math.sqrt(d2) / radius // soft linear falloff in [0,1]
      const k = t * opacity                  // brush strength at this pixel
      const idx = (y * gridSize + x) * 4
      if (isErase) {
        const a = data[idx + 3]
        data[idx + 3] = Math.max(0, a - 255 * k)
      } else {
        const inv = 1 - k
        data[idx]     = Math.round(data[idx]     * inv + def.rgba[0] * k)
        data[idx + 1] = Math.round(data[idx + 1] * inv + def.rgba[1] * k)
        data[idx + 2] = Math.round(data[idx + 2] * inv + def.rgba[2] * k)
        // alpha is max'd up to the material peak — so painting builds up but
        // never blows past the material’s intended max opacity.
        data[idx + 3] = Math.max(data[idx + 3], Math.round(peakAlpha * k))
      }
    }
  }
}

/** Convert world XZ (meters) to splat pixel coords. Null if out of plane bounds. */
export function worldToSplatPixel(
  worldX: number,
  worldZ: number,
  gridSize: number,
  worldSize: number,
): { px: number; py: number } | null {
  const half = worldSize / 2
  if (worldX < -half || worldX > half || worldZ < -half || worldZ > half) return null
  const u = (worldX + half) / worldSize
  const v = (worldZ + half) / worldSize
  return {
    px: Math.max(0, Math.min(gridSize - 1, Math.floor(u * gridSize))),
    py: Math.max(0, Math.min(gridSize - 1, Math.floor(v * gridSize))),
  }
}

/** Pixel coverage of painted soil (alpha > 0). Useful for the panel HUD. */
export function paintedCoverage(data: Uint8ClampedArray, gridSize: number): number {
  let painted = 0
  const total = gridSize * gridSize
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] > 8) painted++
  }
  return painted / total
}
