import { Shell } from './shared/shells'
import { PBRMaterial } from './shared/materials'
import type { Material } from '@mig/modules-schema'

export function Cellar({ material, w, h, d }: { material: Material; w: number; h: number; d: number }) {
  return (
    <group position={[0, -h * 0.7, 0]}>
      <Shell material={material} w={w} h={h} d={d} />
      <mesh position={[0, h + 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.2, 1.2]} />
        <PBRMaterial preset="aluminumBrushed" />
      </mesh>
    </group>
  )
}
