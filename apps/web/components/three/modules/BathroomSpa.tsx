import { Shell } from './shared/shells'
import type { Material } from '@mig/modules-schema'

export function BathroomSpa({ material, w, h, d }: { material: Material; w: number; h: number; d: number }) {
  return (
    <group>
      <Shell material={material} w={w} h={h} d={d} />
      <mesh position={[0, h * 0.75, d / 2 + 0.02]}>
        <planeGeometry args={[w * 0.4, 0.4]} />
        <meshPhysicalMaterial color="#cce0ff" transparent opacity={0.75} roughness={0.1} />
      </mesh>
      <mesh position={[w * 0.3, h + 0.4, d * 0.3]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.8, 10]} />
        <meshStandardMaterial color="#2a2a2e" metalness={0.5} />
      </mesh>
    </group>
  )
}
