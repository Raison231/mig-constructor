'use client'

import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Mesh, MeshBasicMaterial } from 'three'
import { useConfigurator } from '@/stores/configurator'

export function SnapPreview() {
  const target = useConfigurator((s) => s.snapTargetIds)
  const all = useConfigurator((s) => s.modules)
  const ref = useRef<Mesh>(null!)

  useFrame((s) => {
    if (!ref.current) return
    const t = s.clock.elapsedTime
    const mat = ref.current.material as MeshBasicMaterial
    mat.opacity = 0.5 + Math.sin(t * 5) * 0.3
  })

  if (!target) return null
  const a = all.find((m) => m.instanceId === target.from)
  const b = all.find((m) => m.instanceId === target.to)
  if (!a || !b) return null
  const mid: [number, number, number] = [
    (a.position[0] + b.position[0]) / 2,
    1.3,
    (a.position[2] + b.position[2]) / 2,
  ]
  return (
    <mesh ref={ref} position={mid}>
      <sphereGeometry args={[0.45, 16, 16]} />
      <meshBasicMaterial color="#00D26A" transparent opacity={0.7} toneMapped={false} />
    </mesh>
  )
}
