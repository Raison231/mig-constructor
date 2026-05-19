// FIELD HEAL — saves and restores a quick scene snapshot to localStorage.
// Ring of 3 slots: mig-heal-snapshot-{0,1,2}, pointer at mig-heal-latest.
// Snapshots are tiny (configurator + world + land meta + custom GLB ids),
// they are NOT a substitute for .mig save — just a crash safety net.

import { useConfigurator } from '@/stores/configurator'
import { useWorld } from '@/stores/world'
import { useLand } from '@/stores/land'
import { useCustomModules } from '@/stores/customModules'
import { useHeal } from '@/stores/heal'

export const HEAL_VERSION = 1
export const HEAL_RING_SIZE = 3
export const HEAL_KEY_PREFIX = 'mig-heal-snapshot-'
export const HEAL_LATEST_KEY = 'mig-heal-latest'

export interface HealSnapshot {
  version: number
  createdAt: number
  app: 'mig-constructor'
  modules: ReturnType<typeof useConfigurator.getState>['modules']
  world: {
    hour: number
    weather: string
    site: string
    cameraMode: string
    dayNightAuto?: boolean
    dayNightSpeed?: number
  }
  land: {
    widthMeters: number
    rotationDeg: number
    offsetX: number
    offsetZ: number
    lat?: number
    lon?: number
    enabled: boolean
  }
  customModuleIds: string[]
  notes?: string
}

function isBrowser() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

export function captureSnapshot(notes?: string): HealSnapshot {
  const cfg = useConfigurator.getState()
  const w = useWorld.getState()
  const l = useLand.getState()
  const cm = useCustomModules.getState()
  return {
    version: HEAL_VERSION,
    createdAt: Date.now(),
    app: 'mig-constructor',
    modules: cfg.modules,
    world: {
      hour: w.hour,
      weather: w.weather as string,
      site: w.site as string,
      cameraMode: w.cameraMode as string,
      dayNightAuto: w.dayNightAuto,
      dayNightSpeed: w.dayNightSpeed,
    },
    land: {
      widthMeters: l.widthMeters,
      rotationDeg: l.rotationDeg,
      offsetX: l.offsetX,
      offsetZ: l.offsetZ,
      lat: l.lat,
      lon: l.lon,
      enabled: l.enabled,
    },
    customModuleIds: cm.list().map((c) => c.id),
    notes,
  }
}

export function saveSnapshot(snapshot: HealSnapshot): { slot: number } | null {
  if (!isBrowser()) return null
  try {
    const latestRaw = localStorage.getItem(HEAL_LATEST_KEY)
    const latest = latestRaw ? Number(latestRaw) : -1
    const slot = (latest + 1) % HEAL_RING_SIZE
    localStorage.setItem(HEAL_KEY_PREFIX + slot, JSON.stringify(snapshot))
    localStorage.setItem(HEAL_LATEST_KEY, String(slot))
    useHeal.getState().setLastSnapshotAt(snapshot.createdAt)
    return { slot }
  } catch (e) {
    console.warn('[migHeal] saveSnapshot failed', e)
    useHeal.getState().pushEvent('error', 'Snapshot save failed (quota?)')
    return null
  }
}

export function quickSnapshot(notes?: string) {
  const snap = captureSnapshot(notes)
  const r = saveSnapshot(snap)
  if (r) useHeal.getState().pushEvent('snapshot', `Slot ${r.slot} · ${snap.modules.length} mods`)
  return r
}

export function listSnapshots(): Array<{ slot: number; snapshot: HealSnapshot }> {
  if (!isBrowser()) return []
  const out: Array<{ slot: number; snapshot: HealSnapshot }> = []
  for (let i = 0; i < HEAL_RING_SIZE; i++) {
    const raw = localStorage.getItem(HEAL_KEY_PREFIX + i)
    if (!raw) continue
    try {
      const snap = JSON.parse(raw) as HealSnapshot
      out.push({ slot: i, snapshot: snap })
    } catch {
      // ignore corrupt slot
    }
  }
  return out.sort((a, b) => b.snapshot.createdAt - a.snapshot.createdAt)
}

export function loadLatestSnapshot(): HealSnapshot | null {
  if (!isBrowser()) return null
  const latestRaw = localStorage.getItem(HEAL_LATEST_KEY)
  if (!latestRaw) return null
  const slot = Number(latestRaw)
  const raw = localStorage.getItem(HEAL_KEY_PREFIX + slot)
  if (!raw) return null
  try {
    return JSON.parse(raw) as HealSnapshot
  } catch {
    return null
  }
}

export function restoreSnapshot(snapshot: HealSnapshot): boolean {
  try {
    useConfigurator.getState().setLayout(snapshot.modules)
    const w = useWorld.getState()
    if (typeof snapshot.world.hour === 'number') w.setHour(snapshot.world.hour)
    if (snapshot.world.weather) w.setWeather(snapshot.world.weather as never)
    if (snapshot.world.site) w.setSite(snapshot.world.site as never)
    if (snapshot.world.cameraMode) w.setCameraMode(snapshot.world.cameraMode as never)
    if (typeof snapshot.world.dayNightAuto === 'boolean') w.setDayNightAuto(snapshot.world.dayNightAuto)
    if (typeof snapshot.world.dayNightSpeed === 'number') w.setDayNightSpeed(snapshot.world.dayNightSpeed)
    useHeal.getState().pushEvent('restore', `${snapshot.modules.length} mods · ${new Date(snapshot.createdAt).toLocaleTimeString()}`)
    return true
  } catch (e) {
    console.warn('[migHeal] restoreSnapshot failed', e)
    useHeal.getState().pushEvent('error', 'Restore failed')
    return false
  }
}

export function restoreLatest(): boolean {
  const snap = loadLatestSnapshot()
  if (!snap) return false
  return restoreSnapshot(snap)
}

export function clearAllSnapshots() {
  if (!isBrowser()) return
  for (let i = 0; i < HEAL_RING_SIZE; i++) localStorage.removeItem(HEAL_KEY_PREFIX + i)
  localStorage.removeItem(HEAL_LATEST_KEY)
  useHeal.getState().setLastSnapshotAt(0)
  useHeal.getState().pushEvent('clear', 'All heal slots wiped')
}

export function formatRelativeTime(ts: number | null): string {
  if (!ts) return '—'
  const sec = Math.max(0, Math.round((Date.now() - ts) / 1000))
  if (sec < 5) return 'только что'
  if (sec < 60) return `${sec}с назад`
  const min = Math.round(sec / 60)
  if (min < 60) return `${min}м назад`
  const hr = Math.round(min / 60)
  return `${hr}ч назад`
}
