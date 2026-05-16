'use client'

import { create } from 'zustand'

type CostState = {
  materialPremium: number // 0..1 (0 = base, 1 = +100%)
  locationMultiplier: number // 1..2 (1 = easy, 2 = remote)
  rushMultiplier: number // 1..2 (1 = normal, 2 = rush)
  setMaterialPremium: (v: number) => void
  setLocationMultiplier: (v: number) => void
  setRushMultiplier: (v: number) => void
  reset: () => void
}

const STORAGE_KEY = 'mig-cost-v1'

function load(): Partial<CostState> | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}
function persist(s: Pick<CostState, 'materialPremium' | 'locationMultiplier' | 'rushMultiplier'>) {
  if (typeof window === 'undefined') return
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)) } catch {}
}

const loaded = load()

export const useCost = create<CostState>((set, get) => ({
  materialPremium: loaded?.materialPremium ?? 0,
  locationMultiplier: loaded?.locationMultiplier ?? 1,
  rushMultiplier: loaded?.rushMultiplier ?? 1,
  setMaterialPremium: (materialPremium) => { set({ materialPremium }); persist({ ...get(), materialPremium }) },
  setLocationMultiplier: (locationMultiplier) => { set({ locationMultiplier }); persist({ ...get(), locationMultiplier }) },
  setRushMultiplier: (rushMultiplier) => { set({ rushMultiplier }); persist({ ...get(), rushMultiplier }) },
  reset: () => {
    set({ materialPremium: 0, locationMultiplier: 1, rushMultiplier: 1 })
    persist({ materialPremium: 0, locationMultiplier: 1, rushMultiplier: 1 })
  },
}))
