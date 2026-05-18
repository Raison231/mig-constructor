import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Annotation {
  id: string
  position: [number, number, number]
  text: string
  color: string
  attachedToInstanceId?: string
}

interface AnnotationsState {
  active: boolean
  list: Annotation[]
  setActive: (v: boolean) => void
  add: (a: Omit<Annotation, 'id'>) => string
  remove: (id: string) => void
  edit: (id: string, patch: Partial<Omit<Annotation, 'id'>>) => void
  clear: () => void
}

export const useAnnotations = create<AnnotationsState>()(
  persist(
    (set) => ({
      active: false,
      list: [],
      setActive: (v) => set({ active: v }),
      add: (a) => {
        const id = `ann-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
        set((s) => ({ list: [...s.list, { ...a, id }] }))
        return id
      },
      remove: (id) => set((s) => ({ list: s.list.filter((x) => x.id !== id) })),
      edit: (id, patch) =>
        set((s) => ({ list: s.list.map((x) => (x.id === id ? { ...x, ...patch } : x)) })),
      clear: () => set({ list: [] }),
    }),
    { name: 'mig-annotations-v1' },
  ),
)
