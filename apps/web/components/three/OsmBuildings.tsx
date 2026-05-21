'use client'

import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { useOsm } from '@/stores/osm'
import { useLand } from '@/stores/land'

const WALL_MAT = new THREE.MeshStandardMaterial({
  color: '#b6bcc8',
  roughness: 0.85,
  metalness: 0.05,
  flatShading: true,
})

function makeBuildingGeometry(footprint: Array<[number, number]>, height: number): THREE.BufferGeometry | null {
  if (footprint.length < 3) return null
  const shape = new THREE.Shape()
  shape.moveTo(footprint[0][0], footprint[0][1])
  for (let i = 1; i < footprint.length; i++) {
    shape.lineTo(footprint[i][0], footprint[i][1])
  }
  shape.closePath()
  const geom = new THREE.ExtrudeGeometry(shape, { depth: height, bevelEnabled: false })
  // Shape lives in XY; rotate so Y becomes world-up and XZ is the footprint.
  geom.rotateX(-Math.PI / 2)
  geom.computeVertexNormals()
  return geom
}

/**
 * Renders fetched OSM building footprints as extruded boxes around the lot.
 * Positioned and rotated with the land plane so the user can dial in the
 * site orientation in LandPanel and the surroundings follow.
 */
export function OsmBuildings() {
  const enabled = useOsm((s) => s.enabled)
  const buildings = useOsm((s) => s.buildings)
  const offsetX = useLand((s) => s.offsetX)
  const offsetZ = useLand((s) => s.offsetZ)
  const rotationDeg = useLand((s) => s.rotationDeg)

  const geometries = useMemo(() => {
    if (!enabled || buildings.length === 0) return []
    const out: Array<{ id: string; geom: THREE.BufferGeometry }> = []
    for (let i = 0; i < buildings.length; i++) {
      const b = buildings[i]
      const g = makeBuildingGeometry(b.footprint, b.height)
      if (g) out.push({ id: b.id ?? String(i), geom: g })
    }
    return out
  }, [enabled, buildings])

  // Dispose previous geometries on re-build / unmount to keep GPU memory clean.
  useEffect(() => {
    return () => {
      for (const item of geometries) item.geom.dispose()
    }
  }, [geometries])

  if (!enabled || geometries.length === 0) return null

  const rot = ((rotationDeg || 0) * Math.PI) / 180
  const position: [number, number, number] = [offsetX || 0, 0, offsetZ || 0]
  const rotation: [number, number, number] = [0, rot, 0]

  return (
    <group position={position} rotation={rotation}>
      {geometries.map((g) => (
        <mesh key={g.id} geometry={g.geom} material={WALL_MAT} castShadow receiveShadow />
      ))}
    </group>
  )
}
