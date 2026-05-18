'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Annotation = {
	id: string
	position: [number, number, number]
	text: string
	color: string
	createdAt: number
	targetInstanceId?: string
}

type AnnotationsState = {
	list: Annotation[]
	visible: boolean
	selectedId: string | null
	add: (a: Omit<Annotation, 'id' | 'createdAt'>) => string
	update: (id: string, patch: Partial<Pick<Annotation, 'text' | 'color' | 'position'>>) => void
	remove: (id: string) => void
	select: (id: string | null) => void
	toggleVisible: () => void
	clear: () => void
}

const ID = () =>
	typeof crypto !== 'undefined' && 'randomUUID' in crypto
		? crypto.randomUUID()
		: `ann-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

export const useAnnotations = create<AnnotationsState>()(
	persist(
		(set, get) => ({
			list: [],
			visible: true,
			selectedId: null,
			add: (a) => {
				const id = ID()
				set((s) => ({ list: [...s.list, { ...a, id, createdAt: Date.now() }] }))
				return id
			},
			update: (id, patch) =>
				set((s) => ({ list: s.list.map((x) => (x.id === id ? { ...x, ...patch } : x)) })),
			remove: (id) =>
				set((s) => ({
					list: s.list.filter((x) => x.id !== id),
					selectedId: s.selectedId === id ? null : s.selectedId,
				})),
			select: (id) => set({ selectedId: id }),
			toggleVisible: () => set((s) => ({ visible: !s.visible })),
			clear: () => set({ list: [], selectedId: null }),
		}),
		{ name: 'mig-annotations-v1', partialize: (s) => ({ list: s.list, visible: s.visible }) }
	)
)
