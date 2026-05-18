'use client'

import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { PointerLockControls } from '@react-three/drei'
import * as THREE from 'three'
import { useCinematic } from '@/stores/cinematic'

const FORWARD = new THREE.Vector3()
const RIGHT = new THREE.Vector3()
const UP = new THREE.Vector3(0, 1, 0)

export function WalkthroughCamera() {
	const mode = useCinematic((s) => s.mode)
	const walkHeight = useCinematic((s) => s.walkHeight)
	const walkSpeed = useCinematic((s) => s.walkSpeed)
	const { camera } = useThree()
	const keysRef = useRef<Record<string, boolean>>({})

	useEffect(() => {
		if (mode !== 'walkthrough') return
		camera.position.set(0, walkHeight, 6)
		camera.lookAt(0, walkHeight, 0)
		const onDown = (e: KeyboardEvent) => { keysRef.current[e.code] = true }
		const onUp = (e: KeyboardEvent) => { keysRef.current[e.code] = false }
		window.addEventListener('keydown', onDown)
		window.addEventListener('keyup', onUp)
		return () => {
			window.removeEventListener('keydown', onDown)
			window.removeEventListener('keyup', onUp)
			keysRef.current = {}
		}
	}, [mode, walkHeight, camera])

	useFrame((_, dt) => {
		if (mode !== 'walkthrough') return
		const k = keysRef.current
		const run = k['ShiftLeft'] || k['ShiftRight']
		const speed = walkSpeed * (run ? 2 : 1) * dt
		camera.getWorldDirection(FORWARD)
		FORWARD.y = 0
		FORWARD.normalize()
		RIGHT.crossVectors(FORWARD, UP).normalize()
		if (k['KeyW'] || k['ArrowUp']) camera.position.addScaledVector(FORWARD, speed)
		if (k['KeyS'] || k['ArrowDown']) camera.position.addScaledVector(FORWARD, -speed)
		if (k['KeyA'] || k['ArrowLeft']) camera.position.addScaledVector(RIGHT, -speed)
		if (k['KeyD'] || k['ArrowRight']) camera.position.addScaledVector(RIGHT, speed)
		camera.position.y = walkHeight
	})

	if (mode !== 'walkthrough') return null
	return <PointerLockControls />
}
