import { Shell } from './shared/shells'
import { PBRMaterial } from './shared/materials'
import type { Material } from '@mig/modules-schema'

export function Greenhouse({ material, w, h, d }: { material: Material; w: number; h: number; d: number }) {
  return (
    <group>
      <Shell material={material} w={w} h={h * 0.55} d={d} />
      <mesh position={[0, h * 0.55 + 0.55, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[Math.max(w, d) * 0.7, 1.3, 4]} />
        <PBRMaterial preset="greenhouseGlass" />
      </mesh>
    </group>
  )
}
