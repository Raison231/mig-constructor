import { Shell } from './shared/shells'
import { PBRMaterial } from './shared/materials'
import type { Material } from '@mig/modules-schema'

export function PoolHottub({ material, w, h, d }: { material: Material; w: number; h: number; d: number }) {
  return (
    <group>
      <Shell material={material} w={w} h={h} d={d} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, h * 0.85, 0]}>
        <planeGeometry args={[w * 0.85, d * 0.85]} />
        <PBRMaterial preset="poolWater" />
      </mesh>
      {[-1, 1].map((sx) => (
        <mesh key={sx} position={[sx * w * 0.5, h + 0.4, 0]}>
          <boxGeometry args={[0.04, 0.8, d * 0.9]} />
          <PBRMaterial preset="glassClear" />
        </mesh>
      ))}
    </group>
  )
}
