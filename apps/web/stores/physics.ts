import { create } from 'zustand'

interface PhysicsState {
  active: boolean
  dropQueue: string[] // instanceIds queued to drop
  setActive: (v: boolean) => void
  enqueueDrop: (instanceIds: string[]) => void
  clearQueue: () => void
  dropAll: () => void // sets a flag; consumed by Scene
  dropAllSignal: number
}

export const usePhysics = create<PhysicsState>((set) => ({
  active: false,
  dropQueue: [],
  dropAllSignal: 0,
  setActive: (v) => set({ active: v }),
  enqueueDrop: (instanceIds) => set((s) => ({ dropQueue: [...s.dropQueue, ...instanceIds] })),
  clearQueue: () => set({ dropQueue: [] }),
  dropAll: () => set((s) => ({ dropAllSignal: s.dropAllSignal + 1 })),
}))
