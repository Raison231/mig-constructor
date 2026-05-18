'use client'

import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useCinematic } from '@/stores/cinematic'
import { useConfigurator } from '@/stores/configurator'

const CENTER = new THREE.Vector3()
const TARGET = new THREE.Vector3()

export function DroneCamera() {
	const mode = useCinematic((s) => s.mode)
	const speed = useCinematic((s) => s.speed)
	const orbitRadius = useCinematic((s) => s.orbitRadius)
	const orbitHeight = useCinematic((s) => s.orbitHeight)
	const modules = useConfigurator((s) => s.modules)
	const angleRef = useRef(0)
	const { camera } = useThree()

	useFrame((_, dt) => {
		if (mode !== 'drone' && mode !== 'orbit') return
		CENTER.set(0, 0, 0)
		if (modules.length > 0) {
			let sx = 0, sz = 0
			for (const m of modules) { sx += m.position[0]; sz += m.position[2] }
			CENTER.set(sx / modules.length, 0, sz / modules.length)
		}
		angleRef.current += dt * speed * 0.3
		const a = angleRef.current
		const wobble = mode === 'drone' ? Math.sin(a * 0.5) * 1.5 : 0
		camera.position.set(CENTER.x + Math.cos(a) * orbitRadius, orbitHeight + wobble, CENTER.z + Math.sin(a) * orbitRadius)
		TARGET.copy(CENTER).setY(1.5)
		camera.lookAt(TARGET)
	})

	return null
}
