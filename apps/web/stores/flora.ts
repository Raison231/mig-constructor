'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type BiomeId = 'forest' | 'taiga' | 'mediterranean' | 'subtropical' | 'meadow'
export type SpeciesId = 'pine' | 'birch' | 'oak' | 'spruce' | 'cypress' | 'olive'

export interface FloraState {
  enabled: boolean
  biome: BiomeId
  // density 0..1 controls average tree count per m²
  density: number
  // disk region radius around centerX/centerZ
  radius: number
  centerX: number
  centerZ: number
  // deterministic PRNG seed
  seed: number
  // minimum spacing between trees in meters
  minSpacing: number
  speciesEnabled: Record<SpeciesId, boolean>
  windStrength: number
  // bump to force regeneration without changing seed
  regenSalt: number
  setEnabled: (v: boolean) => void
  setBiome: (b: BiomeId) => void
  setDensity: (d: number) => void
  setRadius: (r: number) => void
  setCenter: (x: number, z: number) => void
  setSeed: (s: number) => void
  setMinSpacing: (m: number) => void
  toggleSpecies: (s: SpeciesId) => void
  setWindStrength: (w: number) => void
  regenerate: () => void
}

export const ALL_SPECIES: SpeciesId[] = ['pine', 'birch', 'oak', 'spruce', 'cypress', 'olive']

export const useFlora = create<FloraState>()(
  persist(
    (set, get) => ({
      enabled: false,
      biome: 'forest',
      density: 0.35,
      radius: 32,
      centerX: 0,
      centerZ: 0,
      seed: 1337,
      minSpacing: 2.4,
      speciesEnabled: { pine: true, birch: true, oak: true, spruce: true, cypress: true, olive: true },
      windStrength: 0.55,
      regenSalt: 0,
      setEnabled: (v) => set({ enabled: v }),
      setBiome: (b) => set({ biome: b }),
      setDensity: (d) => set({ density: Math.max(0, Math.min(1, d)) }),
      setRadius: (r) => set({ radius: Math.max(8, Math.min(80, r)) }),
      setCenter: (x, z) => set({ centerX: x, centerZ: z }),
      setSeed: (s) => set({ seed: s | 0 }),
      setMinSpacing: (m) => set({ minSpacing: Math.max(1, Math.min(8, m)) }),
      toggleSpecies: (s) => set({ speciesEnabled: { ...get().speciesEnabled, [s]: !get().speciesEnabled[s] } }),
      setWindStrength: (w) => set({ windStrength: Math.max(0, Math.min(1, w)) }),
      regenerate: () => set({ regenSalt: get().regenSalt + 1 }),
    }),
    { name: 'mig-flora-v1' },
  ),
)
