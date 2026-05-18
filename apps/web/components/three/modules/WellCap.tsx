import { PBRMaterial } from './shared/materials'
import type { Material } from '@mig/modules-schema'

export function WellCap({ material: _material, w, h, d: _d }: { material: Material; w: number; h: number; d: number }) {
  return (
    <group>
      <mesh position={[0, h * 0.5, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[w * 0.4, w * 0.4, h, 16]} />
        <PBRMaterial preset="stone" />
      </mesh>
      <mesh position={[0, h + 0.05, 0]}>
        <cylinderGeometry args={[w * 0.42, w * 0.42, 0.1, 16]} />
        <PBRMaterial preset="blackMatte" />
      </mesh>
      <mesh position={[w * 0.18, h + 0.4, 0]}>
        <boxGeometry args={[0.08, 0.7, 0.08]} />
        <PBRMaterial preset="blackMatte" />
      </mesh>
      <mesh position={[w * 0.18, h + 0.75, 0]} rotation={[0, 0, Math.PI / 6]}>
        <boxGeometry args={[0.25, 0.05, 0.05]} />
        <PBRMaterial preset="rustedMetal" />
      </mesh>
    </group>
  )
}
