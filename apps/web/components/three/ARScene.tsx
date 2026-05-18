'use client'

import { XR, createXRStore } from '@react-three/xr'
import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { useAR } from '@/stores/ar'

export const xrStore = createXRStore({
	foveation: 0,
	frameBufferScaling: 1,
})

export function ARScene({ children }: { children: ReactNode }) {
	const setStatus = useAR((s) => s.setStatus)

	useEffect(() => {
		const unsub = xrStore.subscribe((state) => {
			if (state.session) setStatus('active')
			else setStatus('idle')
		})
		return () => unsub()
	}, [setStatus])

	return <XR store={xrStore}>{children}</XR>
}
