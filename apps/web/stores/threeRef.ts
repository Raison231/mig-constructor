'use client'

import { create } from 'zustand'
import type { Scene } from 'three'

export type ThreeRefState = {
  scene: Scene | null
  setScene: (s: Scene | null) => void
}

export const useThreeRef = create<ThreeRefState>((set) => ({
  scene: null,
  setScene: (s) => set({ scene: s }),
}))
