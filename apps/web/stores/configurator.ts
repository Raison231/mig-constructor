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
  addModule: (moduleId: string, material: Material) => void
  removeModule: (instanceId: string) => void
  moveModule: (instanceId: string, position: [number, number, number]) => void
  select: (instanceId: string) => void
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

function snap(s: Snapshot): Snapshot {
  return { modules: s.modules.map((m) => ({ ...m })), selectionId: s.selectionId }
}

function pushPast(state: ConfiguratorState): Snapshot[] {
  return [...state.past, snap(state)].slice(-50)
}

export const useConfigurator = create<ConfiguratorState>((set, get) => ({
  modules: [],
  selectionId: null,
  past: [],
  future: [],

  addModule: (moduleId, material) => {
    const state = get()
    const newInst: ModuleInstance = {
      instanceId: nextId(),
      moduleId,
      material,
      position: [state.modules.length * 3 - 6, 0, 0],
      rotationY: 0,
    }
    set({
      modules: [...state.modules, newInst],
      selectionId: newInst.instanceId,
      past: pushPast(state),
      future: [],
    })
  },

  removeModule: (instanceId) => {
    const state = get()
    set({
      modules: state.modules.filter((m) => m.instanceId !== instanceId),
      selectionId: state.selectionId === instanceId ? null : state.selectionId,
      past: pushPast(state),
      future: [],
    })
  },

  moveModule: (instanceId, position) =>
    set((s) => ({
      modules: s.modules.map((m) => (m.instanceId === instanceId ? { ...m, position } : m)),
    })),

  select: (instanceId) => set({ selectionId: instanceId }),
  deselect: () => set({ selectionId: null }),

  rotateSelected: (delta) => {
    const state = get()
    if (!state.selectionId) return
    set({
      modules: state.modules.map((m) =>
        m.instanceId === state.selectionId ? { ...m, rotationY: m.rotationY + delta } : m,
      ),
      past: pushPast(state),
      future: [],
    })
  },

  duplicateSelected: () => {
    const state = get()
    if (!state.selectionId) return
    const orig = state.modules.find((m) => m.instanceId === state.selectionId)
    if (!orig) return
    const copy: ModuleInstance = {
      ...orig,
      instanceId: nextId(),
      position: [orig.position[0] + 3, orig.position[1], orig.position[2]],
    }
    set({
      modules: [...state.modules, copy],
      selectionId: copy.instanceId,
      past: pushPast(state),
      future: [],
    })
  },

  removeSelected: () => {
    const state = get()
    if (!state.selectionId) return
    set({
      modules: state.modules.filter((m) => m.instanceId !== state.selectionId),
      selectionId: null,
      past: pushPast(state),
      future: [],
    })
  },

  undo: () => {
    const state = get()
    if (state.past.length === 0) return
    const prev = state.past[state.past.length - 1]
    set({
      modules: prev.modules,
      selectionId: prev.selectionId,
      past: state.past.slice(0, -1),
      future: [snap(state), ...state.future].slice(0, 50),
    })
  },

  redo: () => {
    const state = get()
    if (state.future.length === 0) return
    const next = state.future[0]
    set({
      modules: next.modules,
      selectionId: next.selectionId,
      past: pushPast(state),
      future: state.future.slice(1),
    })
  },

  reset: () => set({ modules: [], selectionId: null, past: [], future: [] }),
}))
