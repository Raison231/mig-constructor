import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CinematicMode = 'off' | 'walkthrough' | 'drone' | 'orbit'

type CinematicState = {
	mode: CinematicMode
	speed: number
	orbitRadius: number
	orbitHeight: number
	walkHeight: number
	walkSpeed: number
	recording: boolean
	setMode: (m: CinematicMode) => void
	setSpeed: (n: number) => void
	setOrbitRadius: (n: number) => void
	setOrbitHeight: (n: number) => void
	setWalkHeight: (n: number) => void
	setWalkSpeed: (n: number) => void
	setRecording: (v: boolean) => void
}

export const useCinematic = create<CinematicState>()(
	persist(
		(set) => ({
			mode: 'off',
			speed: 1,
			orbitRadius: 14,
			orbitHeight: 6,
			walkHeight: 1.7,
			walkSpeed: 2.4,
			recording: false,
			setMode: (mode) => set({ mode }),
			setSpeed: (speed) => set({ speed: Math.max(0.1, Math.min(5, speed)) }),
			setOrbitRadius: (orbitRadius) => set({ orbitRadius }),
			setOrbitHeight: (orbitHeight) => set({ orbitHeight }),
			setWalkHeight: (walkHeight) => set({ walkHeight }),
			setWalkSpeed: (walkSpeed) => set({ walkSpeed }),
			setRecording: (recording) => set({ recording }),
		}),
		{ name: 'mig-cinematic-v1' },
	),
)
