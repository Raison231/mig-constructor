import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ModuleInstance } from '@mig/modules-schema'
import { TEMPLATE_PRESETS, type TemplatePresetId } from '@/lib/template-presets'

interface TemplatesState {
  activePresetId: TemplatePresetId | null
  setActivePresetId: (id: TemplatePresetId | null) => void
  getPresetInstances: (id: TemplatePresetId) => ModuleInstance[]
}

export const useTemplates = create<TemplatesState>()(
  persist(
    (set) => ({
      activePresetId: null,
      setActivePresetId: (id) => set({ activePresetId: id }),
      getPresetInstances: (id) => {
        const preset = TEMPLATE_PRESETS.find((p) => p.id === id)
        if (!preset) return []
        // Deep clone with new instanceIds
        return preset.instances.map((inst) => ({
          ...inst,
          instanceId: `${id}-${inst.moduleId}-${Math.random().toString(36).slice(2, 9)}`,
          position: [...inst.position] as [number, number, number],
        }))
      },
    }),
    { name: 'mig-templates-v1' },
  ),
)
