'use client'

import { create } from 'zustand'

export type Point3 = [number, number, number]

type MeasureState = {
  active: boolean
  points: Point3[]
  setActive: (v: boolean) => void
  toggle: () => void
  addPoint: (p: Point3) => void
  clear: () => void
}

export const useMeasure = create<MeasureState>((set, get) => ({
  active: false,
  points: [],
  setActive: (v) => set({ active: v, points: v ? get().points : [] }),
  toggle: () => {
    const next = !get().active
    set({ active: next, points: next ? get().points : [] })
  },
  addPoint: (p) => {
    const pts = get().points
    // Click 3 resets the line to start fresh from the new point
    if (pts.length >= 2) {
      set({ points: [p] })
      return
    }
    set({ points: [...pts, p] })
  },
  clear: () => set({ points: [] }),
}))
