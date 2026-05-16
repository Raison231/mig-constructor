'use client'

import { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { PointerLockControls } from '@react-three/drei'
import * as THREE from 'three'

const MOVE_SPEED = 4
const EYE_HEIGHT = 1.7

export function InteriorCam() {
  const { camera } = useThree()
  const keys = useRef({ w: false, a: false, s: false, d: false, shift: false })
  const fwd = useRef(new THREE.Vector3())
  const right = useRef(new THREE.Vector3())

  useEffect(() => {
    camera.position.set(0, EYE_HEIGHT, 4)
    camera.lookAt(0, EYE_HEIGHT, 0)
  }, [camera])

  useEffect(() => {
    function down(e: KeyboardEvent) {
      const k = e.key.toLowerCase()
      if (k === 'w') keys.current.w = true
      else if (k === 'a') keys.current.a = true
      else if (k === 's') keys.current.s = true
      else if (k === 'd') keys.current.d = true
      else if (k === 'shift') keys.current.shift = true
    }
    function up(e: KeyboardEvent) {
      const k = e.key.toLowerCase()
      if (k === 'w') keys.current.w = false
      else if (k === 'a') keys.current.a = false
      else if (k === 's') keys.current.s = false
      else if (k === 'd') keys.current.d = false
      else if (k === 'shift') keys.current.shift = false
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [])

  useFrame((_, dt) => {
    const k = keys.current
    if (!k.w && !k.a && !k.s && !k.d) {
      camera.position.y = EYE_HEIGHT
      return
    }
    camera.getWorldDirection(fwd.current)
    fwd.current.y = 0
    fwd.current.normalize()
    right.current.copy(fwd.current).cross(camera.up)
    const speed = MOVE_SPEED * (k.shift ? 2 : 1) * dt
    if (k.w) camera.position.addScaledVector(fwd.current, speed)
    if (k.s) camera.position.addScaledVector(fwd.current, -speed)
    if (k.d) camera.position.addScaledVector(right.current, speed)
    if (k.a) camera.position.addScaledVector(right.current, -speed)
    camera.position.y = EYE_HEIGHT
  })

  return <PointerLockControls makeDefault />
}
