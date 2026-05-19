'use client'

import { create } from 'zustand'

export type CopilotMessage = {
  id: string
  role: 'user' | 'assistant'
  text: string
  ts: number
}

type CopilotState = {
  messages: CopilotMessage[]
  open: boolean
  setOpen: (open: boolean) => void
  toggle: () => void
  push: (msg: Omit<CopilotMessage, 'id' | 'ts'>) => void
  clear: () => void
}

let counter = 0
const nextId = () => `cop-${Date.now()}-${++counter}`

const INITIAL_GREETING: CopilotMessage = {
  id: nextId(),
  role: 'assistant',
  text: 'Привет! Я MIG Copilot. Напиши «help» — покажу команды ☝️',
  ts: Date.now(),
}

export const useCopilot = create<CopilotState>((set, get) => ({
  messages: [INITIAL_GREETING],
  open: false,
  setOpen: (open) => set({ open }),
  toggle: () => set({ open: !get().open }),
  push: (msg) => {
    const next = [...get().messages, { ...msg, id: nextId(), ts: Date.now() }]
    set({ messages: next.slice(-50) })
  },
  clear: () => set({ messages: [INITIAL_GREETING] }),
}))
