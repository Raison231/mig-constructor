import { Shell } from './shared/shells'
import type { Material } from '@mig/modules-schema'

export function PoolHottub({ material, w, h, d }: { material: Material; w: number; h: number; d: number }) {
  return (
    <group>
      <Shell material={material} w={w} h={h} d={d} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, h * 0.85, 0]}>
        <planeGeometry args={[w * 0.85, d * 0.85]} />
        <meshPhysicalMaterial color="#3aa6c4" transparent opacity={0.8} transmission={0.4} roughness={0.1} />
      </mesh>
      {[-1, 1].map((sx) => (
        <mesh key={sx} position={[sx * w * 0.5, h + 0.4, 0]}>
          <boxGeometry args={[0.04, 0.8, d * 0.9]} />
          <meshPhysicalMaterial color="#ddeeff" transparent opacity={0.4} transmission={0.7} />
        </mesh>
      ))}
    </group>
  )
}
