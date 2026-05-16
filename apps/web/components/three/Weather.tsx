'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useWorld, SITE_META } from '@/stores/world'

const RAIN_COUNT = 1500
const SNOW_COUNT = 800
const AREA = 30
const HEIGHT = 25

function createPositions(count: number) {
  const arr = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    arr[i * 3 + 0] = (Math.random() - 0.5) * AREA * 2
    arr[i * 3 + 1] = Math.random() * HEIGHT
    arr[i * 3 + 2] = (Math.random() - 0.5) * AREA * 2
  }
  return arr
}

function Rain() {
  const ref = useRef<THREE.Points>(null)
  const positions = useMemo(() => createPositions(RAIN_COUNT), [])

  useFrame((_, dt) => {
    const pts = ref.current
    if (!pts) return
    const geom = pts.geometry as THREE.BufferGeometry
    const arr = geom.attributes.position.array as Float32Array
    for (let i = 0; i < RAIN_COUNT; i++) {
      arr[i * 3 + 1] -= dt * 30
      if (arr[i * 3 + 1] < 0) arr[i * 3 + 1] = HEIGHT
    }
    geom.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={RAIN_COUNT}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.07} color="#9bb8d0" transparent opacity={0.65} sizeAttenuation />
    </points>
  )
}

function Snow() {
  const ref = useRef<THREE.Points>(null)
  const positions = useMemo(() => createPositions(SNOW_COUNT), [])

  useFrame((state, dt) => {
    const pts = ref.current
    if (!pts) return
    const geom = pts.geometry as THREE.BufferGeometry
    const arr = geom.attributes.position.array as Float32Array
    const t = state.clock.elapsedTime
    for (let i = 0; i < SNOW_COUNT; i++) {
      arr[i * 3 + 1] -= dt * 1.2
      arr[i * 3 + 0] += Math.sin(t * 0.5 + i) * dt * 0.3
      if (arr[i * 3 + 1] < 0) arr[i * 3 + 1] = HEIGHT
    }
    geom.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={SNOW_COUNT}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.14} color="#ffffff" transparent opacity={0.9} sizeAttenuation />
    </points>
  )
}

export function Weather() {
  const weather = useWorld((s) => s.weather)
  const site = useWorld((s) => s.site)
  const fogColor = SITE_META[site].fogColor
  const fogArgs = useMemo(() => {
    if (weather === 'rain') return [fogColor, 15, 60] as [string, number, number]
    if (weather === 'snow') return [fogColor, 12, 55] as [string, number, number]
    if (weather === 'fog') return [fogColor, 8, 35] as [string, number, number]
    return [fogColor, 30, 90] as [string, number, number]
  }, [weather, fogColor])

  return (
    <>
      <fog attach="fog" args={fogArgs} />
      {weather === 'rain' && <Rain />}
      {weather === 'snow' && <Snow />}
    </>
  )
}
