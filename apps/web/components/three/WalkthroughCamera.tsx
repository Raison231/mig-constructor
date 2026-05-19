'use client'

import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { PointerLockControls } from '@react-three/drei'
import * as THREE from 'three'
import { useCinematic } from '@/stores/cinematic'

const FORWARD = new THREE.Vector3()
const RIGHT = new THREE.Vector3()
const UP = new THREE.Vector3(0, 1, 0)

const GRAVITY = 20      // m/s²
const JUMP_V0 = 6.5     // m/s initial jump velocity → ~1.05m peak
const CROUCH_FACTOR = 0.55

/**
 * First-person walkthrough camera.
 *  WASD / arrows  → move
 *  Shift          → run (×2 speed)
 *  Space          → jump
 *  C              → crouch (hold)
 *  Mouse          → look (PointerLockControls)
 *  Esc            → release pointer lock (browser-native)
 */
export function WalkthroughCamera() {
	const mode = useCinematic((s) => s.mode)
	const walkHeight = useCinematic((s) => s.walkHeight)
	const walkSpeed = useCinematic((s) => s.walkSpeed)
	const { camera } = useThree()
	const keysRef = useRef<Record<string, boolean>>({})
	const velYRef = useRef(0) // vertical velocity for jump
	const groundedRef = useRef(true)

	useEffect(() => {
		if (mode !== 'walkthrough') return
		camera.position.set(0, walkHeight, 6)
		camera.lookAt(0, walkHeight, 0)
		velYRef.current = 0
		groundedRef.current = true
		const onDown = (e: KeyboardEvent) => {
			keysRef.current[e.code] = true
			// trigger jump on press, only when grounded
			if (e.code === 'Space' && groundedRef.current) {
				velYRef.current = JUMP_V0
				groundedRef.current = false
			}
		}
		const onUp = (e: KeyboardEvent) => { keysRef.current[e.code] = false }
		window.addEventListener('keydown', onDown)
		window.addEventListener('keyup', onUp)
		return () => {
			window.removeEventListener('keydown', onDown)
			window.removeEventListener('keyup', onUp)
			keysRef.current = {}
			velYRef.current = 0
			groundedRef.current = true
		}
	}, [mode, walkHeight, camera])

	useFrame((_, dtRaw) => {
		if (mode !== 'walkthrough') return
		const dt = Math.min(dtRaw, 1 / 30) // clamp big jumps on focus loss
		const k = keysRef.current
		const run = !!(k['ShiftLeft'] || k['ShiftRight'])
		const crouch = !!(k['KeyC'])
		const speed = walkSpeed * (run ? 2 : 1) * dt

		camera.getWorldDirection(FORWARD)
		FORWARD.y = 0
		FORWARD.normalize()
		RIGHT.crossVectors(FORWARD, UP).normalize()

		if (k['KeyW'] || k['ArrowUp'])    camera.position.addScaledVector(FORWARD, speed)
		if (k['KeyS'] || k['ArrowDown'])  camera.position.addScaledVector(FORWARD, -speed)
		if (k['KeyA'] || k['ArrowLeft'])  camera.position.addScaledVector(RIGHT, -speed)
		if (k['KeyD'] || k['ArrowRight']) camera.position.addScaledVector(RIGHT, speed)

		// Vertical: gravity-driven jump + crouch as an eye-height adjustment
		const targetY = crouch ? walkHeight * CROUCH_FACTOR : walkHeight
		if (!groundedRef.current) {
			velYRef.current -= GRAVITY * dt
			camera.position.y += velYRef.current * dt
			if (camera.position.y <= targetY) {
				camera.position.y = targetY
				velYRef.current = 0
				groundedRef.current = true
			}
		} else {
			// snap eye height (smooth-ish via lerp on crouch toggle)
			camera.position.y += (targetY - camera.position.y) * Math.min(1, dt * 12)
		}
	})

	if (mode !== 'walkthrough') return null
	return <PointerLockControls />
}
