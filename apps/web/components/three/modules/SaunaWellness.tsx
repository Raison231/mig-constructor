import { Shell } from './shared/shells'
import type { Material } from '@mig/modules-schema'

export function SaunaWellness({ material, w, h, d }: { material: Material; w: number; h: number; d: number }) {
  return (
    <group>
      <Shell material={material} w={w} h={h} d={d} />
      <mesh position={[0, h / 2, d / 2 + 0.01]}>
        <planeGeometry args={[w * 0.95, h * 0.95]} />
        <meshStandardMaterial color="#3d2817" roughness={0.95} />
      </mesh>
      <mesh position={[w * 0.3, h * 0.65, d / 2 + 0.03]}>
        <circleGeometry args={[0.25, 24]} />
        <meshPhysicalMaterial color="#ffaa55" emissive="#ff7733" emissiveIntensity={0.4} transparent opacity={0.7} />
      </mesh>
      <mesh position={[-w * 0.3, h + 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 1.2, 12]} />
        <meshStandardMaterial color="#1a1a1d" metalness={0.6} />
      </mesh>
    </group>
  )
}
