import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type ARState = {
  active: boolean
  supported: boolean | null
  anchored: boolean
  scale: number
  setActive: (v: boolean) => void
  setSupported: (v: boolean) => void
  setAnchored: (v: boolean) => void
  setScale: (v: number) => void
  toggle: () => void
}

export const useAR = create<ARState>()(
  persist(
    (set, get) => ({
      active: false,
      supported: null,
      anchored: false,
      scale: 1,
      setActive: (v) => set({ active: v }),
      setSupported: (v) => set({ supported: v }),
      setAnchored: (v) => set({ anchored: v }),
      setScale: (v) => set({ scale: Math.max(0.1, Math.min(5, v)) }),
      toggle: () => set({ active: !get().active }),
    }),
    { name: 'mig-ar-v1', partialize: (s) => ({ scale: s.scale }) }
  )
)
