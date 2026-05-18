import { Shell } from './shared/shells'
import { PBRMaterial } from './shared/materials'
import type { Material } from '@mig/modules-schema'

export function Garage({ material, w, h, d }: { material: Material; w: number; h: number; d: number }) {
  return (
    <group>
      <Shell material={material} w={w} h={h} d={d} />
      <mesh position={[0, h * 0.45, d / 2 + 0.02]}>
        <planeGeometry args={[w * 0.75, h * 0.85]} />
        <PBRMaterial preset="blackMatte" />
      </mesh>
      {Array.from({ length: 7 }).map((_, i) => (
        <mesh key={i} position={[0, ((i + 0.5) / 7) * h * 0.85, d / 2 + 0.025]}>
          <boxGeometry args={[w * 0.75, 0.018, 0.005]} />
          <PBRMaterial preset="corner" />
        </mesh>
      ))}
      <mesh position={[w * 0.3, h * 0.85, d / 2 + 0.03]}>
        <boxGeometry args={[0.05, 0.05, 0.04]} />
        <PBRMaterial preset="ledOrange" />
      </mesh>
    </group>
  )
}
