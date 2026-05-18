import { create } from 'zustand'

export type ARSessionStatus = 'idle' | 'requesting' | 'active' | 'unsupported' | 'denied'

type ARState = {
	status: ARSessionStatus
	supported: boolean
	placementScale: number
	placementHeightY: number
	rotationY: number
	setStatus: (s: ARSessionStatus) => void
	setSupported: (s: boolean) => void
	setPlacementScale: (n: number) => void
	setPlacementHeightY: (n: number) => void
	setRotationY: (n: number) => void
	reset: () => void
}

export const useAR = create<ARState>((set) => ({
	status: 'idle',
	supported: false,
	placementScale: 1,
	placementHeightY: 0,
	rotationY: 0,
	setStatus: (status) => set({ status }),
	setSupported: (supported) => set({ supported }),
	setPlacementScale: (placementScale) =>
		set({ placementScale: Math.max(0.1, Math.min(5, placementScale)) }),
	setPlacementHeightY: (placementHeightY) => set({ placementHeightY }),
	setRotationY: (rotationY) => set({ rotationY }),
	reset: () =>
		set({ status: 'idle', placementScale: 1, placementHeightY: 0, rotationY: 0 }),
}))
