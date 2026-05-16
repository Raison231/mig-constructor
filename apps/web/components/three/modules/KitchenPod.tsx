import { Shell } from './shared/shells'
import type { Material } from '@mig/modules-schema'

export function KitchenPod({ material, w, h, d }: { material: Material; w: number; h: number; d: number }) {
  return (
    <group>
      <Shell material={material} w={w} h={h} d={d} />
      <mesh position={[0, h * 0.7, d / 2 + 0.02]}>
        <planeGeometry args={[w * 0.65, 0.7]} />
        <meshPhysicalMaterial color="#a8d0ff" transparent opacity={0.6} transmission={0.7} roughness={0.05} />
      </mesh>
      <mesh position={[w * 0.38, h * 0.4, d / 2 + 0.025]}>
        <planeGeometry args={[0.85, 2.05]} />
        <meshStandardMaterial color="#0d0d10" />
      </mesh>
      <mesh position={[w * 0.15, h + 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 1, 12]} />
        <meshStandardMaterial color="#2a2a2e" metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  )
}
