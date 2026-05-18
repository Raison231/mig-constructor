'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ModuleInstance } from '@/stores/configurator'
import { TEMPLATE_PRESETS, type TemplatePreset, type TemplateId } from '@/lib/template-presets'

type TemplatesState = {
	activeId: TemplateId | null
	presets: TemplatePreset[]
	setActive: (id: TemplateId | null) => void
	getPreset: (id: TemplateId) => TemplatePreset | undefined
	applyPreset: (id: TemplateId) => ModuleInstance[]
}

export const useTemplates = create<TemplatesState>()(
	persist(
		(set, get) => ({
			activeId: null,
			presets: TEMPLATE_PRESETS,
			setActive: (id) => set({ activeId: id }),
			getPreset: (id) => get().presets.find((p) => p.id === id),
			applyPreset: (id) => {
				const preset = get().presets.find((p) => p.id === id)
				if (!preset) return []
				set({ activeId: id })
				// клонируем с новыми instanceId
				return preset.layout.map((m, idx) => ({
					...m,
					instanceId: `${id}-${Date.now()}-${idx}`,
				}))
			},
		}),
		{ name: 'mig-templates-v1', partialize: (s) => ({ activeId: s.activeId }) }
	)
)
