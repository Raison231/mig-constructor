'use client'

import { create } from 'zustand'

type PhysicsState = {
	active: boolean
	dropping: boolean
	craneSpeed: number // m/s descent
	toggle: () => void
	setActive: (v: boolean) => void
	startDrop: () => void
	endDrop: () => void
	setSpeed: (v: number) => void
}

export const usePhysics = create<PhysicsState>((set) => ({
	active: false,
	dropping: false,
	craneSpeed: 2.5,
	toggle: () => set((s) => ({ active: !s.active, dropping: false })),
	setActive: (v) => set({ active: v, dropping: false }),
	startDrop: () => set({ dropping: true }),
	endDrop: () => set({ dropping: false }),
	setSpeed: (v) => set({ craneSpeed: Math.max(0.5, Math.min(10, v)) }),
}))
