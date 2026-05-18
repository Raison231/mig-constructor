'use client'

import { create } from 'zustand'
import type { ModuleInstance } from '@/stores/configurator'

export type CompareSnapshot = {
	name: string
	instances: ModuleInstance[]
	timestamp: number
}

type CompareState = {
	active: boolean
	snapshotA: CompareSnapshot | null
	snapshotB: CompareSnapshot | null
	activePane: 'A' | 'B'
	toggle: () => void
	setActivePane: (pane: 'A' | 'B') => void
	captureA: (instances: ModuleInstance[], name?: string) => void
	captureB: (instances: ModuleInstance[], name?: string) => void
	swap: () => void
	clear: () => void
}

export const useCompare = create<CompareState>((set, get) => ({
	active: false,
	snapshotA: null,
	snapshotB: null,
	activePane: 'A',
	toggle: () => set((s) => ({ active: !s.active })),
	setActivePane: (pane) => set({ activePane: pane }),
	captureA: (instances, name = 'Вариант A') =>
		set({ snapshotA: { name, instances: instances.map((m) => ({ ...m })), timestamp: Date.now() } }),
	captureB: (instances, name = 'Вариант B') =>
		set({ snapshotB: { name, instances: instances.map((m) => ({ ...m })), timestamp: Date.now() } }),
	swap: () => {
		const { snapshotA, snapshotB } = get()
		set({ snapshotA: snapshotB, snapshotB: snapshotA })
	},
	clear: () => set({ snapshotA: null, snapshotB: null, active: false, activePane: 'A' }),
}))
