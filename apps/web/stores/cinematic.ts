import { create } from 'zustand'

export type CinematicMode = 'free' | 'drone' | 'walk'

type CinematicState = {
  mode: CinematicMode
  droneSpeed: number
  droneRadius: number
  walkSpeed: number
  walkHeight: number
  setMode: (m: CinematicMode) => void
  setDroneSpeed: (v: number) => void
  setDroneRadius: (v: number) => void
  setWalkSpeed: (v: number) => void
  setWalkHeight: (v: number) => void
}

export const useCinematic = create<CinematicState>((set) => ({
  mode: 'free',
  droneSpeed: 0.15,
  droneRadius: 20,
  walkSpeed: 5,
  walkHeight: 1.7,
  setMode: (mode) => set({ mode }),
  setDroneSpeed: (v) => set({ droneSpeed: Math.max(0.01, Math.min(1, v)) }),
  setDroneRadius: (v) => set({ droneRadius: Math.max(5, Math.min(60, v)) }),
  setWalkSpeed: (v) => set({ walkSpeed: Math.max(1, Math.min(20, v)) }),
  setWalkHeight: (v) => set({ walkHeight: Math.max(0.5, Math.min(3, v)) }),
}))
