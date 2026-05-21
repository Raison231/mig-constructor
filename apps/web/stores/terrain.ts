import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { paintCircle } from '@/lib/terrain'

export type TerrainMaterial = 'grass' | 'sand' | 'stone' | 'dirt' | 'snow' | 'erase'

export const TERRAIN_GRID_SIZE = 256                  // splat texture resolution
export const TERRAIN_WORLD_SIZE = 60                   // plane width/depth in meters

export function makeBlankSplat(): Uint8ClampedArray {
  return new Uint8ClampedArray(TERRAIN_GRID_SIZE * TERRAIN_GRID_SIZE * 4)
}

type TerrainState = {
  enabled: boolean              // overlay rendered at all
  painting: boolean             // pointer-events on (turned on by panel)
  brushMaterial: TerrainMaterial
  brushSize: number             // radius in splat pixels (1..64)
  brushOpacity: number          // 0..1
  splatData: Uint8ClampedArray  // RGBA flat, mutated in place
  splatVersion: number          // bump to retrigger texture upload
  setEnabled: (v: boolean) => void
  setPainting: (v: boolean) => void
  setBrushMaterial: (m: TerrainMaterial) => void
  setBrushSize: (n: number) => void
  setBrushOpacity: (n: number) => void
  paintPixel: (px: number, py: number) => void
  clear: () => void
  fillAll: (m: TerrainMaterial) => void
}

export const useTerrain = create<TerrainState>()(
  persist(
    (set, get) => ({
      enabled: false,
      painting: false,
      brushMaterial: 'grass',
      brushSize: 14,
      brushOpacity: 0.85,
      splatData: makeBlankSplat(),
      splatVersion: 0,
      setEnabled: (enabled) => set({ enabled }),
      setPainting: (painting) => set({ painting }),
      setBrushMaterial: (brushMaterial) => set({ brushMaterial }),
      setBrushSize: (brushSize) => set({ brushSize: Math.max(1, Math.min(64, brushSize)) }),
      setBrushOpacity: (brushOpacity) => set({ brushOpacity: Math.max(0, Math.min(1, brushOpacity)) }),
      paintPixel: (px, py) => {
        const s = get()
        paintCircle(s.splatData, TERRAIN_GRID_SIZE, px, py, s.brushSize, s.brushMaterial, s.brushOpacity)
        set({ splatVersion: s.splatVersion + 1 })
      },
      clear: () => set((s) => ({ splatData: makeBlankSplat(), splatVersion: s.splatVersion + 1 })),
      fillAll: (material) => {
        const s = get()
        const data = makeBlankSplat()
        paintCircle(data, TERRAIN_GRID_SIZE, TERRAIN_GRID_SIZE / 2, TERRAIN_GRID_SIZE / 2, TERRAIN_GRID_SIZE * 2, material, 1)
        set({ splatData: data, splatVersion: s.splatVersion + 1 })
      },
    }),
    {
      name: 'mig-terrain-v1',
      storage: createJSONStorage(() => (typeof window === 'undefined' ? ({} as Storage) : window.localStorage)),
      // Only stable UX settings are persisted. Splat data lives in memory
      // (256x256x4 = 256KB — too heavy for localStorage and ephemeral by design).
      partialize: (s) => ({
        enabled: s.enabled,
        brushMaterial: s.brushMaterial,
        brushSize: s.brushSize,
        brushOpacity: s.brushOpacity,
      }),
    },
  ),
)
