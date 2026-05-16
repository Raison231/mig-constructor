'use client'

import { useWorld, SITE_META } from '@/stores/world'

const PLANE_ARGS: [number, number] = [80, 80]
const ROTATION: [number, number, number] = [-Math.PI / 2, 0, 0]

export function Ground() {
  const site = useWorld((s) => s.site)
  const groundColor = SITE_META[site].groundColor

  return (
    <mesh rotation={ROTATION} receiveShadow>
      <planeGeometry args={PLANE_ARGS} />
      <meshStandardMaterial color={groundColor} roughness={0.95} metalness={0.05} />
    </mesh>
  )
}
