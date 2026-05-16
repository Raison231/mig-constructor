import { Shell } from './shared/shells'
import type { Material } from '@mig/modules-schema'

export function Cellar({ material, w, h, d }: { material: Material; w: number; h: number; d: number }) {
  return (
    <group position={[0, -h * 0.7, 0]}>
      <Shell material={material} w={w} h={h} d={d} />
      <mesh position={[0, h + 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.2, 1.2]} />
        <meshStandardMaterial color="#3a3a3e" metalness={0.6} roughness={0.5} />
      </mesh>
    </group>
  )
}
