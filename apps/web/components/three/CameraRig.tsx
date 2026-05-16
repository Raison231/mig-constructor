'use client'

import { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { useWorld } from '@/stores/world'
import { useConfigurator } from '@/stores/configurator'

const ORBIT_POS: [number, number, number] = [14, 11, 14]
const TOPDOWN_POS: [number, number, number] = [0, 30, 0.01]

export function CameraRig() {
  const cameraMode = useWorld((s) => s.cameraMode)
  const draggingId = useConfigurator((s) => s.draggingId)
  const { camera } = useThree()
  const controlsRef = useRef<OrbitControlsImpl | null>(null)
  const cinematicAngle = useRef(0)

  useEffect(() => {
    if (cameraMode === 'topdown') {
      camera.position.set(TOPDOWN_POS[0], TOPDOWN_POS[1], TOPDOWN_POS[2])
      camera.lookAt(0, 0, 0)
    } else if (cameraMode === 'orbit') {
      camera.position.set(ORBIT_POS[0], ORBIT_POS[1], ORBIT_POS[2])
      camera.lookAt(0, 0, 0)
    }
    controlsRef.current?.update()
  }, [cameraMode, camera])

  useFrame((_, dt) => {
    if (cameraMode !== 'cinematic') return
    cinematicAngle.current += dt * 0.15
    const r = 18
    camera.position.x = Math.cos(cinematicAngle.current) * r
    camera.position.z = Math.sin(cinematicAngle.current) * r
    camera.position.y = 9 + Math.sin(cinematicAngle.current * 0.5) * 2
    camera.lookAt(0, 1, 0)
  })

  const orbitEnabled = cameraMode === 'orbit' && !draggingId

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.05}
      minDistance={4}
      maxDistance={40}
      maxPolarAngle={Math.PI / 2.1}
      enabled={orbitEnabled}
    />
  )
}
