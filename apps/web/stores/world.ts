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
  setHour: (h: number) => void
  setWeather: (w: Weather) => void
  setSite: (s: Site) => void
  setCameraMode: (c: CameraMode) => void
}

const STORAGE_KEY = 'mig-world-v1'

function load(): Partial<WorldState> | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function persist(s: Pick<WorldState, 'hour' | 'weather' | 'site' | 'cameraMode'>) {
  if (typeof window === 'undefined') return
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)) } catch {}
}

const loaded = load()

export const useWorld = create<WorldState>((set, get) => ({
  hour: loaded?.hour ?? 14,
  weather: (loaded?.weather as Weather) ?? 'clear',
  site: (loaded?.site as Site) ?? 'tbilisi',
  cameraMode: (loaded?.cameraMode as CameraMode) ?? 'orbit',
  setHour: (hour) => { set({ hour }); persist({ ...get(), hour }) },
  setWeather: (weather) => { set({ weather }); persist({ ...get(), weather }) },
  setSite: (site) => { set({ site }); persist({ ...get(), site }) },
  setCameraMode: (cameraMode) => { set({ cameraMode }); persist({ ...get(), cameraMode }) },
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
