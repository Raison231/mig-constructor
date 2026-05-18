import { create } from 'zustand'
import type { ModuleInstance } from '@mig/modules-schema'

interface CompareState {
  active: boolean
  snapshotA: ModuleInstance[] | null
  snapshotB: ModuleInstance[] | null
  setActive: (v: boolean) => void
  snapshotToA: (instances: ModuleInstance[]) => void
  snapshotToB: (instances: ModuleInstance[]) => void
  swap: () => void
  clear: () => void
}

export const useCompare = create<CompareState>((set, get) => ({
  active: false,
  snapshotA: null,
  snapshotB: null,
  setActive: (v) => set({ active: v }),
  snapshotToA: (instances) =>
    set({ snapshotA: instances.map((i) => ({ ...i, position: [...i.position] as [number, number, number] })) }),
  snapshotToB: (instances) =>
    set({ snapshotB: instances.map((i) => ({ ...i, position: [...i.position] as [number, number, number] })) }),
  swap: () => {
    const { snapshotA, snapshotB } = get()
    set({ snapshotA: snapshotB, snapshotB: snapshotA })
  },
  clear: () => set({ snapshotA: null, snapshotB: null, active: false }),
}))
