import { create } from 'zustand'
import type { Material } from '@mig/modules-schema'

export type ModuleInstance = {
  instanceId: string
  moduleId: string
  material: Material
  position: [number, number, number]
  rotationY: number
}

type Snapshot = { modules: ModuleInstance[]; selectionId: string | null }

type ConfiguratorState = Snapshot & {
  past: Snapshot[]
  future: Snapshot[]
  draggingId: string | null
  snapTargetIds: { from: string; to: string } | null
  addModule: (moduleId: string, material: Material) => void
  removeModule: (id: string) => void
  setLayout: (modules: ModuleInstance[]) => void
  moveModule: (id: string, position: [number, number, number]) => void
  commitMove: () => void
  setDragging: (id: string | null) => void
  setSnapTarget: (t: { from: string; to: string } | null) => void
  select: (id: string) => void
  deselect: () => void
  rotateSelected: (delta: number) => void
  duplicateSelected: () => void
  removeSelected: () => void
  undo: () => void
  redo: () => void
  reset: () => void
}

let counter = 0
const nextId = () => `mod-${Date.now()}-${++counter}`

const STORAGE_KEY = 'mig-constructor-v3'

function snap(s: Snapshot): Snapshot {
  return { modules: s.modules.map((m) => ({ ...m })), selectionId: s.selectionId }
}
function pushPast(state: ConfiguratorState): Snapshot[] {
  return [...state.past, snap(state)].slice(-50)
}

function loadFromStorage(): ModuleInstance[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as ModuleInstance[]
  } catch { return [] }
}
function saveToStorage(modules: ModuleInstance[]) {
  if (typeof window === 'undefined') return
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(modules)) } catch {}
}

export const useConfigurator = create<ConfiguratorState>((set, get) => ({
  modules: loadFromStorage(),
  selectionId: null,
  past: [], future: [],
  draggingId: null,
  snapTargetIds: null,

  addModule: (moduleId, material) => {
    const state = get()
    const inst: ModuleInstance = {
      instanceId: nextId(), moduleId, material,
      position: [state.modules.length * 3 - 6, 0, 0],
      rotationY: 0,
    }
    const next = [...state.modules, inst]
    set({ modules: next, selectionId: inst.instanceId, past: pushPast(state), future: [] })
    saveToStorage(next)
  },

  removeModule: (id) => {
    const state = get()
    const next = state.modules.filter((m) => m.instanceId !== id)
    set({ modules: next, selectionId: state.selectionId === id ? null : state.selectionId, past: pushPast(state), future: [] })
    saveToStorage(next)
  },

  setLayout: (modules) => {
    const state = get()
    set({ modules, selectionId: null, past: pushPast(state), future: [] })
    saveToStorage(modules)
  },

  moveModule: (id, position) => {
    const next = get().modules.map((m) => (m.instanceId === id ? { ...m, position } : m))
    set({ modules: next })
  },

  commitMove: () => {
    const state = get()
    set({ past: pushPast(state), future: [], snapTargetIds: null })
    saveToStorage(state.modules)
  },

  setDragging: (id) => set({ draggingId: id }),
  setSnapTarget: (t) => set({ snapTargetIds: t }),

  select: (id) => set({ selectionId: id }),
  deselect: () => set({ selectionId: null }),

  rotateSelected: (delta) => {
    const state = get()
    if (!state.selectionId) return
    const next = state.modules.map((m) =>
      m.instanceId === state.selectionId ? { ...m, rotationY: m.rotationY + delta } : m,
    )
    set({ modules: next, past: pushPast(state), future: [] })
    saveToStorage(next)
  },

  duplicateSelected: () => {
    const state = get()
    if (!state.selectionId) return
    const orig = state.modules.find((m) => m.instanceId === state.selectionId)
    if (!orig) return
    const copy: ModuleInstance = { ...orig, instanceId: nextId(), position: [orig.position[0] + 3, orig.position[1], orig.position[2]] }
    const next = [...state.modules, copy]
    set({ modules: next, selectionId: copy.instanceId, past: pushPast(state), future: [] })
    saveToStorage(next)
  },

  removeSelected: () => {
    const state = get()
    if (!state.selectionId) return
    const next = state.modules.filter((m) => m.instanceId !== state.selectionId)
    set({ modules: next, selectionId: null, past: pushPast(state), future: [] })
    saveToStorage(next)
  },

  undo: () => {
    const state = get()
    if (state.past.length === 0) return
    const prev = state.past[state.past.length - 1]
    set({ modules: prev.modules, selectionId: prev.selectionId, past: state.past.slice(0, -1), future: [snap(state), ...state.future].slice(0, 50) })
    saveToStorage(prev.modules)
  },

  redo: () => {
    const state = get()
    if (state.future.length === 0) return
    const nx = state.future[0]
    set({ modules: nx.modules, selectionId: nx.selectionId, past: pushPast(state), future: state.future.slice(1) })
    saveToStorage(nx.modules)
  },

  reset: () => {
    set({ modules: [], selectionId: null, past: [], future: [], draggingId: null, snapTargetIds: null })
    saveToStorage([])
  },
}))
