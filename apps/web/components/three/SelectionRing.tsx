'use client'

import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Mesh, MeshBasicMaterial } from 'three'

export function SelectionRing({ w, d }: { w: number; d: number }) {
  const ref = useRef<Mesh>(null!)
  const r = Math.max(w, d) * 0.7
  useFrame((s) => {
    if (!ref.current) return
    const t = s.clock.elapsedTime
    const mat = ref.current.material as MeshBasicMaterial
    mat.opacity = 0.45 + Math.sin(t * 2.4) * 0.25
  })
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
      <ringGeometry args={[r, r + 0.15, 48]} />
      <meshBasicMaterial color="#00D26A" transparent opacity={0.6} toneMapped={false} />
    </mesh>
  )
}
