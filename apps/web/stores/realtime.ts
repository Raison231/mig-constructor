import { create } from 'zustand'

export type RemoteCursor = {
  id: string
  name: string
  color: string
  position: [number, number, number]
  lastSeen: number
}

type RealtimeState = {
  active: boolean
  roomId: string | null
  selfId: string
  selfName: string
  selfColor: string
  cursors: Record<string, RemoteCursor>
  setActive: (v: boolean) => void
  setRoom: (id: string | null) => void
  setSelf: (name: string, color: string) => void
  upsertCursor: (c: RemoteCursor) => void
  removeCursor: (id: string) => void
  clear: () => void
}

const CURSOR_COLORS = ['#00D26A', '#FF6B35', '#4A90FF', '#F5C518', '#FF4D6D', '#8E5BF5']

function randomId(): string {
  return Math.random().toString(36).slice(2, 10)
}

export const useRealtime = create<RealtimeState>((set) => ({
  active: false,
  roomId: null,
  selfId: randomId(),
  selfName: 'Guest',
  selfColor: CURSOR_COLORS[Math.floor(Math.random() * CURSOR_COLORS.length)] as string,
  cursors: {},
  setActive: (v) => set({ active: v }),
  setRoom: (id) => set({ roomId: id }),
  setSelf: (name, color) => set({ selfName: name, selfColor: color }),
  upsertCursor: (c) => set((s) => ({ cursors: { ...s.cursors, [c.id]: c } })),
  removeCursor: (id) => set((s) => {
    const next = { ...s.cursors }
    delete next[id]
    return { cursors: next }
  }),
  clear: () => set({ cursors: {} }),
}))

export { CURSOR_COLORS }
