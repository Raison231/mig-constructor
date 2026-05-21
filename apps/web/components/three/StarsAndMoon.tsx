'use client'

import { useMemo, useRef } from 'react'
import { Stars } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useWorld } from '@/stores/world'

const MOON_RADIUS = 1.6
const MOON_DISTANCE = 80

/**
 * Computes night intensity (0..1) for a given hour. 1 = deep night,
 * 0 = full daylight, smooth fade across dusk (18–21) and dawn (4–7).
 */
function nightAlpha(hour: number): number {
  // Symmetric tent: peak at 0/24, zero between 7 and 18.
  if (hour >= 7 && hour <= 18) return 0
  if (hour > 18 && hour < 21) return (hour - 18) / 3 // 0→1 across 18→21
  if (hour > 4 && hour < 7) return (7 - hour) / 3 // 1→0 across 4→7
  return 1 // 21..24 and 0..4
}

/**
 * Sun direction matches SunSky's arc: azimuth driven by hour, elevation by
 * a sinusoidal day curve. Moon sits opposite the sun on the celestial sphere.
 */
function sunDirection(hour: number): THREE.Vector3 {
  // Map hour [0..24] to angle around horizon. Noon (12) = up, midnight = down.
  const t = (hour - 6) / 12 // 0 at dawn, 1 at dusk
  const angle = t * Math.PI // 0→PI
  const x = Math.cos(angle) * 50
  const y = Math.sin(angle) * 50
  const z = Math.sin(angle * 0.5) * 30
  return new THREE.Vector3(x, y, z)
}

export function StarsAndMoon() {
  const hour = useWorld((s) => s.hour)
  const moonRef = useRef<THREE.Mesh>(null)
  const haloRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)

  const alpha = nightAlpha(hour)

  const moonMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#f6f0d8',
        transparent: true,
        opacity: 0,
        depthWrite: false,
        toneMapped: false,
      }),
    [],
  )

  const haloMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#fff8dc',
        transparent: true,
        opacity: 0,
        depthWrite: false,
        side: THREE.BackSide,
        toneMapped: false,
      }),
    [],
  )

  useFrame(() => {
    // Live read so the moon follows day/night auto-ticks without re-renders.
    const h = useWorld.getState().hour
    const a = nightAlpha(h)
    const sun = sunDirection(h)
    // Moon = opposite of sun, lifted slightly above horizon when night peaks.
    const moonDir = sun.clone().multiplyScalar(-1).normalize()
    if (moonDir.y < 0.1) moonDir.y = 0.1 + (0.1 - moonDir.y) * 0.5
    moonDir.normalize().multiplyScalar(MOON_DISTANCE)

    if (groupRef.current) {
      groupRef.current.position.copy(moonDir)
      groupRef.current.visible = a > 0.02
    }
    moonMat.opacity = a * 0.95
    haloMat.opacity = a * 0.18
  })

  return (
    <>
      {alpha > 0.02 && (
        <Stars
          radius={120}
          depth={40}
          count={Math.floor(2800 * alpha)}
          factor={3.2}
          saturation={0}
          fade
          speed={0.4}
        />
      )}
      <group ref={groupRef}>
        <mesh ref={moonRef} material={moonMat}>
          <sphereGeometry args={[MOON_RADIUS, 24, 24]} />
        </mesh>
        <mesh ref={haloRef} material={haloMat}>
          <sphereGeometry args={[MOON_RADIUS * 2.4, 24, 24]} />
        </mesh>
      </group>
    </>
  )
}
