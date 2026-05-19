'use client'

import { create } from 'zustand'
import type { CustomGlbInfo } from '@/lib/customGlbImport'
import { CUSTOM_MODULES_STORAGE_KEY } from '@/lib/customGlbImport'

type CustomModulesState = {
  modules: Record<string, CustomGlbInfo>
  add: (info: CustomGlbInfo) => void
  remove: (id: string) => void
  getById: (id: string) => CustomGlbInfo | undefined
  list: () => CustomGlbInfo[]
  clear: () => void
}

function loadFromStorage(): Record<string, CustomGlbInfo> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(CUSTOM_MODULES_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Record<string, CustomGlbInfo>) : {}
  } catch {
    return {}
  }
}

function saveToStorage(modules: Record<string, CustomGlbInfo>) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(CUSTOM_MODULES_STORAGE_KEY, JSON.stringify(modules))
  } catch (e) {
    console.warn('[customModules] localStorage save failed (quota?)', e)
  }
}

export const useCustomModules = create<CustomModulesState>((set, get) => ({
  modules: loadFromStorage(),
  add: (info) => {
    const next = { ...get().modules, [info.id]: info }
    set({ modules: next })
    saveToStorage(next)
  },
  remove: (id) => {
    const next = { ...get().modules }
    delete next[id]
    set({ modules: next })
    saveToStorage(next)
  },
  getById: (id) => get().modules[id],
  list: () => Object.values(get().modules).sort((a, b) => (a.addedAt < b.addedAt ? 1 : -1)),
  clear: () => {
    set({ modules: {} })
    saveToStorage({})
  },
}))
