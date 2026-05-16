'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type CostState = {
  materialPremium: number    // 0..1
  locationMultiplier: number // 1..2
  rushMultiplier: number     // 1..2
  setMaterialPremium: (v: number) => void
  setLocationMultiplier: (v: number) => void
  setRushMultiplier: (v: number) => void
  reset: () => void
}

const DEFAULTS = {
  materialPremium: 0,
  locationMultiplier: 1,
  rushMultiplier: 1,
}

export const useCost = create<CostState>()(
  persist(
    (set) => ({
      ...DEFAULTS,
      setMaterialPremium:    (v) => set({ materialPremium: clamp(v, 0, 1) }),
      setLocationMultiplier: (v) => set({ locationMultiplier: clamp(v, 1, 2) }),
      setRushMultiplier:     (v) => set({ rushMultiplier: clamp(v, 1, 2) }),
      reset: () => set({ ...DEFAULTS }),
    }),
    { name: 'mig-cost-v1' },
  ),
)

function clamp(v: number, min: number, max: number): number {
  if (Number.isNaN(v)) return min
  return Math.max(min, Math.min(max, v))
}
