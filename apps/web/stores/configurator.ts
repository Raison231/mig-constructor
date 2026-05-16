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

function snapshot(s: Snapshot): Snapshot {
  return { modules: s.modules.map((m) => ({ ...m })), selectionId: s.selectionId }
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
      past: [...state.past, snapshot(state)].slice(-50),
      future: [],
    })
  },

  removeModule: (instanceId) => {
    const state = get()
    set({
      modules: state.modules.filter((m) => m.instanceId !== instanceId),
      selectionId: state.selectionId === instanceId ? null : state.selectionId,
      past: [...state.past, snapshot(state)].slice(-50),
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
      past: [...state.past, snapshot(state)].slice(-50),
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
      past: [...state.past, snapshot(state)].slice(-50),
      future: [],
    })
  },

  removeSelected: () => {
    const state = get()
    if (!state.selectionId) return
    set({