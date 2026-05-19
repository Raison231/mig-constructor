'use client'

import { create } from 'zustand'

export type Weather = 'clear' | 'rain' | 'snow' | 'fog'
export type Site = 'tbilisi' | 'bakuriani' | 'kakheti' | 'adjara'
export type CameraMode = 'orbit' | 'topdown' | 'cinematic' | 'interior'

type WorldState = {
  hour: number
  weather: Weather
  site: Site
  cameraMode: CameraMode
  /** When true, the SunSky ticker advances `hour` every frame. */
  dayNightAuto: boolean
  /** Game hours advanced per one real-time second. 1 = 1 game-hour/sec (= 24 sec full cycle). */
  dayNightSpeed: number
  setHour: (h: number) => void
  /** Frame-rate-safe hour tick. Does NOT persist (would thrash localStorage at 60fps). */
  tickHour: (deltaHours: number) => void
  setWeather: (w: Weather) => void
  setSite: (s: Site) => void
  setCameraMode: (c: CameraMode) => void
  setDayNightAuto: (v: boolean) => void
  setDayNightSpeed: (n: number) => void
}

const STORAGE_KEY = 'mig-world-v1'

function load(): Partial<WorldState> | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function persist(s: Pick<WorldState, 'hour' | 'weather' | 'site' | 'cameraMode' | 'dayNightAuto' | 'dayNightSpeed'>) {
  if (typeof window === 'undefined') return
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)) } catch {}
}

const loaded = load()

export const useWorld = create<WorldState>((set, get) => ({
  hour: loaded?.hour ?? 14,
  weather: (loaded?.weather as Weather) ?? 'clear',
  site: (loaded?.site as Site) ?? 'tbilisi',
  cameraMode: (loaded?.cameraMode as CameraMode) ?? 'orbit',
  dayNightAuto: typeof loaded?.dayNightAuto === 'boolean' ? loaded.dayNightAuto : false,
  dayNightSpeed: typeof loaded?.dayNightSpeed === 'number' ? loaded.dayNightSpeed : 1,
  setHour: (hour) => { set({ hour }); persist({ ...get(), hour }) },
  tickHour: (delta) => {
    const next = ((get().hour + delta) % 24 + 24) % 24
    set({ hour: next })
    // intentionally NOT persisted — SunSky/DayNight runs at 60fps; persist on stop instead
  },
  setWeather: (weather) => { set({ weather }); persist({ ...get(), weather }) },
  setSite: (site) => { set({ site }); persist({ ...get(), site }) },
  setCameraMode: (cameraMode) => { set({ cameraMode }); persist({ ...get(), cameraMode }) },
  setDayNightAuto: (dayNightAuto) => { set({ dayNightAuto }); persist({ ...get(), dayNightAuto }) },
  setDayNightSpeed: (n) => {
    const dayNightSpeed = Math.max(0.05, Math.min(60, n))
    set({ dayNightSpeed })
    persist({ ...get(), dayNightSpeed })
  },
}))

export type SiteMeta = {
  groundColor: string
  bgColor: string
  fogColor: string
  tempC: number
}

export const SITE_META: Record<Site, SiteMeta> = {
  tbilisi:   { groundColor: '#3a2d1f', bgColor: '#1a1410', fogColor: '#2a2018', tempC: 22 },
  bakuriani: { groundColor: '#e8eef2', bgColor: '#1a2530', fogColor: '#3a4858', tempC: -3 },
  kakheti:   { groundColor: '#2e3d1c', bgColor: '#15201a', fogColor: '#1f2e22', tempC: 18 },
  adjara:    { groundColor: '#1c3540', bgColor: '#0a1a22', fogColor: '#142838', tempC: 24 },
}
