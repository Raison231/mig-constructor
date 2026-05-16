'use client'

import { create } from 'zustand'

export type Point3 = [number, number, number]

type MeasureState = {
  active: boolean
  points: Point3[]
  setActive: (a: boolean) => void
  addPoint: (p: Point3) => void
  clear: () => void
}

export const useMeasure = create<MeasureState>((set, get) => ({
  active: false,
  points: [],
  setActive: (active) => set({ active, points: active ? get().points : [] }),
  addPoint: (p) => {
    const pts = get().points
    if (pts.length >= 2) set({ points: [p] })
    else set({ points: [...pts, p] })
  },
  clear: () => set({ points: [] }),
}))
