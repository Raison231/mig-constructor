'use client'

import { useEffect, useMemo } from 'react'
import { PlaneGeometry } from 'three'
import { useLand } from '@/stores/land'

export function Terrain() {
  const heightmap = useLand((s) => s.heightmap)
  const size = useLand((s) => s.heightmapSize)
  const scale = useLand((s) => s.heightmapScale)
  const widthMeters = useLand((s) => s.widthMeters)
  const rotationDeg = useLand((s) => s.rotationDeg)
  const offsetX = useLand((s) => s.offsetX)
  const offsetZ = useLand((s) => s.offsetZ)

  const geometry = useMemo(() => {
    if (!heightmap || size < 2) return null
    const g = new PlaneGeometry(widthMeters, widthMeters, size - 1, size - 1)
    const pos = g.attributes.position
    for (let j = 0; j < size; j++) {
      for (let i = 0; i < size; i++) {
        const v = j * size + i
        const h = heightmap[v] * scale
        pos.setZ(v, h)
      }
    }
    pos.needsUpdate = true
    g.computeVertexNormals()
    return g
  }, [heightmap, size, scale, widthMeters])

  useEffect(() => {
    return () => {
      geometry?.dispose()
    }
  }, [geometry])

  if (!geometry) return null
  const rotY = (rotationDeg * Math.PI) / 180

  return (
    <mesh
      geometry={geometry}
      rotation={[-Math.PI / 2, 0, rotY]}
      position={[offsetX, 0, offsetZ]}
      receiveShadow
      castShadow
    >
      <meshStandardMaterial color="#7a8a6e" roughness={0.95} metalness={0.05} flatShading />
    </mesh>
  )
}
