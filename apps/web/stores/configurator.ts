import { create } from 'zustand'
import type { Material } from '@mig/modules-schema'

export type ModuleInstance = {
  instanceId: string
  moduleId: string
  material: Material
  position: [number, number, number]
  rotationY: number
}

type ConfiguratorState = {
  modules: ModuleInstance[]
  addModule: (moduleId: string, material: Material) => void
  removeModule: (instanceId: string) => void
  moveModule: (instanceId: string, position: [number, number, number]) => void
  reset: () => void
}

let counter = 0
const nextId = () => `mod-${Date.now()}-${++counter}`

export const useConfigurator = create<ConfiguratorState>((set) => ({
  modules: [],
  addModule: (moduleId, material) =>
    set((s) => ({
      modules: [
        ...s.modules,
        {
          instanceId: nextId(),
          moduleId,
          material,
          position: [s.modules.length * 3 - 6, 0, 0],
          rotationY: 0,
        },
      ],
    })),
  removeModule: (instanceId) =>
    set((s) => ({ modules: s.modules.filter((m) => m.instanceId !== instanceId) })),
  moveModule: (instanceId, position) =>
    set((s) => ({
      modules: s.modules.map((m) => (m.instanceId === instanceId ? { ...m, position } : m)),
    })),
  reset: () => set({ modules: [] }),
}))
