import { Shell } from './shared/shells'
import { PBRMaterial } from './shared/materials'
import type { Material } from '@mig/modules-schema'

export function KitchenPod({ material, w, h, d }: { material: Material; w: number; h: number; d: number }) {
  return (
    <group>
      <Shell material={material} w={w} h={h} d={d} />
      <mesh position={[0, h * 0.7, d / 2 + 0.02]}>
        <planeGeometry args={[w * 0.65, 0.7]} />
        <PBRMaterial preset="glassBlue" />
      </mesh>
      <mesh position={[w * 0.38, h * 0.4, d / 2 + 0.025]}>
        <planeGeometry args={[0.85, 2.05]} />
        <PBRMaterial preset="blackMatte" />
      </mesh>
      <mesh position={[w * 0.15, h + 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 1, 12]} />
        <PBRMaterial preset="aluminumBrushed" />
      </mesh>
    </group>
  )
}
