import { create } from 'zustand'

export type PresenceCursor = {
	userId: string
	name: string
	color: string
	x: number
	y: number
	z: number
	at: number
}

type RealtimeState = {
	roomId: string
	connected: boolean
	selfId: string
	selfName: string
	selfColor: string
	cursors: Record<string, PresenceCursor>
	setRoomId: (id: string) => void
	setConnected: (v: boolean) => void
	setSelf: (p: { id: string; name: string; color: string }) => void
	upsertCursor: (c: PresenceCursor) => void
	removeCursor: (userId: string) => void
	reset: () => void
}

const COLORS = ['#00D26A', '#FF6B35', '#4A90FF', '#FFCC00', '#FF4D8D', '#8B6F47']

export const pickRealtimeColor = () => COLORS[Math.floor(Math.random() * COLORS.length)] ?? '#00D26A'

export const useRealtime = create<RealtimeState>((set) => ({
	roomId: 'mig-default',
	connected: false,
	selfId: '',
	selfName: 'Guest',
	selfColor: '#00D26A',
	cursors: {},
	setRoomId: (roomId) => set({ roomId }),
	setConnected: (connected) => set({ connected }),
	setSelf: (p) => set({ selfId: p.id, selfName: p.name, selfColor: p.color }),
	upsertCursor: (c) =>
		set((s) => ({ cursors: { ...s.cursors, [c.userId]: c } })),
	removeCursor: (userId) =>
		set((s) => {
			const { [userId]: _, ...rest } = s.cursors
			return { cursors: rest }
		}),
	reset: () => set({ cursors: {}, connected: false }),
}))
