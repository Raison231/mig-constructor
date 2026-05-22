'use client'

import { create } from 'zustand'

export type ThermalSeason = 'winter' | 'spring' | 'summer' | 'autumn'

type ThermalState = {
  enabled: boolean
  season: ThermalSeason
  outdoorTempC: number
  indoorTargetC: number
  setEnabled: (v: boolean) => void
  setSeason: (s: ThermalSeason) => void
  setOutdoorTempC: (n: number) => void
  setIndoorTargetC: (n: number) => void
}

const STORAGE_KEY = 'mig-thermal-v1'

export const SEASON_DEFAULTS: Record<ThermalSeason, number> = {
  winter: -8,
  spring: 12,
  summer: 26,
  autumn: 8,
}

function load(): Partial<ThermalState> | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function persist(s: Pick<ThermalState, 'enabled' | 'season' | 'outdoorTempC' | 'indoorTargetC'>) {
  if (typeof window === 'undefined') return
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)) } catch {}
}

const loaded = load()

export const useThermal = create<ThermalState>((set, get) => ({
  enabled: loaded?.enabled ?? false,
  season: (loaded?.season as ThermalSeason) ?? 'winter',
  outdoorTempC: typeof loaded?.outdoorTempC === 'number' ? loaded.outdoorTempC : SEASON_DEFAULTS.winter,
  indoorTargetC: typeof loaded?.indoorTargetC === 'number' ? loaded.indoorTargetC : 21,
  setEnabled: (enabled) => { set({ enabled }); persist({ ...get(), enabled }) },
  setSeason: (season) => {
    const outdoorTempC = SEASON_DEFAULTS[season]
    set({ season, outdoorTempC })
    persist({ ...get(), season, outdoorTempC })
  },
  setOutdoorTempC: (n) => {
    const outdoorTempC = Math.max(-40, Math.min(45, n))
    set({ outdoorTempC })
    persist({ ...get(), outdoorTempC })
  },
  setIndoorTargetC: (n) => {
    const indoorTargetC = Math.max(10, Math.min(28, n))
    set({ indoorTargetC })
    persist({ ...get(), indoorTargetC })
  },
}))
