import { Shell } from './shared/shells'
import { PBRMaterial } from './shared/materials'
import type { Material } from '@mig/modules-schema'

export function BedroomPano({ material, w, h, d }: { material: Material; w: number; h: number; d: number }) {
  return (
    <group>
      <Shell material={material} w={w} h={h} d={d} />
      <mesh position={[0, h / 2, d / 2 + 0.02]}>
        <planeGeometry args={[w * 0.88, h * 0.88]} />
        <PBRMaterial preset="glassBlue" />
      </mesh>
      {[-1, 0, 1].map((i) => (
        <mesh key={i} position={[(i * w * 0.88) / 3, h / 2, d / 2 + 0.025]}>
          <boxGeometry args={[0.05, h * 0.88, 0.02]} />
          <PBRMaterial preset="blackMatte" />
        </mesh>
      ))}
    </group>
  )
}
