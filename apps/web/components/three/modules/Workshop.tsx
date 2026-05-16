import { Shell } from './shared/shells'
import type { Material } from '@mig/modules-schema'

export function Workshop({ material, w, h, d }: { material: Material; w: number; h: number; d: number }) {
  return (
    <group>
      <Shell material={material} w={w} h={h} d={d} />
      <mesh position={[0, h * 0.45, d / 2 + 0.02]}>
        <planeGeometry args={[w * 0.55, h * 0.85]} />
        <meshStandardMaterial color="#5a5a5e" metalness={0.5} roughness={0.4} />
      </mesh>
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} position={[0, ((i + 0.5) / 8) * h * 0.85, d / 2 + 0.03]}>
          <boxGeometry args={[w * 0.55, 0.02, 0.01]} />
          <meshStandardMaterial color="#3a3a3e" />
        </mesh>
      ))}
    </group>
  )
}
