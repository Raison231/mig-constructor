'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type HealEventKind = 'snapshot' | 'restore' | 'context_lost' | 'context_restored' | 'clear' | 'error'

export interface HealEvent {
  id: string
  at: number
  kind: HealEventKind
  message: string
}

export interface HealStats {
  fps: number
  frameMs: number
  drawCalls: number
  triangles: number
  geometries: number
  textures: number
  programs: number
  contextLostCount: number
}

export interface HealState extends HealStats {
  // settings (persisted)
  autoSnapshotEnabled: boolean
  autoSnapshotIntervalSec: number
  // runtime (not persisted)
  lastSnapshotAt: number | null
  events: HealEvent[]
  // setters
  setStats: (s: Partial<HealStats>) => void
  incContextLost: () => void
  setLastSnapshotAt: (ts: number) => void
  pushEvent: (kind: HealEventKind, message: string) => void
  clearEvents: () => void
  setAutoSnapshotEnabled: (v: boolean) => void
  setAutoSnapshotIntervalSec: (s: number) => void
}

const HEAL_MAX_EVENTS = 24

export const useHeal = create<HealState>()(
  persist(
    (set, get) => ({
      // initial stats
      fps: 60,
      frameMs: 16.6,
      drawCalls: 0,
      triangles: 0,
      geometries: 0,
      textures: 0,
      programs: 0,
      contextLostCount: 0,
      // settings
      autoSnapshotEnabled: true,
      autoSnapshotIntervalSec: 30,
      // runtime
      lastSnapshotAt: null,
      events: [],
      setStats: (s) => set(s),
      incContextLost: () => set({ contextLostCount: get().contextLostCount + 1 }),
      setLastSnapshotAt: (ts) => set({ lastSnapshotAt: ts }),
      pushEvent: (kind, message) => {
        const ev: HealEvent = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, at: Date.now(), kind, message }
        const next = [ev, ...get().events].slice(0, HEAL_MAX_EVENTS)
        set({ events: next })
      },
      clearEvents: () => set({ events: [] }),
      setAutoSnapshotEnabled: (v) => set({ autoSnapshotEnabled: v }),
      setAutoSnapshotIntervalSec: (s) => set({ autoSnapshotIntervalSec: Math.max(5, Math.min(600, Math.round(s))) }),
    }),
    {
      name: 'mig-heal-v1',
      partialize: (s) => ({
        autoSnapshotEnabled: s.autoSnapshotEnabled,
        autoSnapshotIntervalSec: s.autoSnapshotIntervalSec,
      }),
    },
  ),
)
