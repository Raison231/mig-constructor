import { PBRMaterial, type PBRPresetName } from './shared/materials'
import type { Material } from '@mig/modules-schema'

const ROOF_PRESET: Record<Material, PBRPresetName> = {
  container: 'cortenSteelDark',
  timber: 'timberDark',
  hybrid: 'timberDark',
}

export function Carport({ material, w, h, d }: { material: Material; w: number; h: number; d: number }) {
  const pillars: Array<[number, number]> = [
    [-w / 2 + 0.15, -d / 2 + 0.15],
    [ w / 2 - 0.15, -d / 2 + 0.15],
    [-w / 2 + 0.15,  d / 2 - 0.15],
    [ w / 2 - 0.15,  d / 2 - 0.15],
  ]
  return (
    <group>
      {pillars.map((p, i) => (
        <mesh key={i} position={[p[0], h / 2, p[1]]} castShadow>
          <boxGeometry args={[0.2, h, 0.2]} />
          <PBRMaterial preset="blackMatte" />
        </mesh>
      ))}
      <mesh position={[0, h + 0.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[w * 1.1, 0.12, d * 1.1]} />
        <PBRMaterial preset={ROOF_PRESET[material]} />
      </mesh>
      <mesh position={[0, h + 0.13, 0]}>
        <boxGeometry args={[w * 1.05, 0.02, d * 1.05]} />
        <PBRMaterial preset="solarPanel" />
      </mesh>
    </group>
  )
}
