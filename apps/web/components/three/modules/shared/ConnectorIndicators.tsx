'use client'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Mesh } from 'three'
import type { ConnectorSide } from '@mig/modules-schema'

function anchorOffset(side: ConnectorSide, w: number, h: number, d: number): [number, number, number] {
  switch (side) {
    case 'north': return [0, h / 2, -d / 2]
    case 'south': return [0, h / 2, d / 2]
    case 'east':  return [w / 2, h / 2, 0]
    case 'west':  return [-w / 2, h / 2, 0]
    case 'top':   return [0, h + 0.05, 0]
    case 'bottom':return [0, 0.05, 0]
  }
}

function Indicator({ pos, color }: { pos: [number, number, number]; color: string }) {
  const ref = useRef<Mesh>(null!)
  useFrame((s) => {
    if (!ref.current) return
    const t = s.clock.elapsedTime
    ref.current.scale.setScalar(1 + Math.sin(t * 3) * 0.18)
  })
  return (
    <mesh ref={ref} position={pos}>
      <sphereGeometry args={[0.13, 16, 16]} />
      <meshBasicMaterial color={color} transparent opacity={0.85} toneMapped={false} />
    </mesh>
  )
}

export function ConnectorIndicators({
  sides,
  w,
  h,
  d,
  color = '#00D26A',
}: {
  sides: ConnectorSide[]
  w: number
  h: number
  d: number
  color?: string
}) {
  return (
    <>
      {sides.map((s) => (
        <Indicator key={s} pos={anchorOffset(s, w, h, d)} color={color} />
      ))}
    </>
  )
}
