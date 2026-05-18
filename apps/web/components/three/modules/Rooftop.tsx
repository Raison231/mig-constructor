import { PBRMaterial, type PBRPresetName } from './shared/materials'
import type { Material } from '@mig/modules-schema'

const FLOOR_PRESET: Record<Material, PBRPresetName> = {
  container: 'cortenSteel',
  timber: 'timberLight',
  hybrid: 'timberLight',
}

export function Rooftop({ material, w, h, d }: { material: Material; w: number; h: number; d: number }) {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.15, 0]}>
        <boxGeometry args={[w, 0.3, d]} />
        <PBRMaterial preset={FLOOR_PRESET[material]} />
      </mesh>
      {[-1, 1].map((sz) => (
        <mesh key={sz} position={[0, 0.8, sz * d * 0.48]}>
          <boxGeometry args={[w * 0.95, 1.0, 0.03]} />
          <PBRMaterial preset="glassClear" />
        </mesh>
      ))}
      {[-1, 1].map((sx) => (
        <mesh key={sx} position={[sx * w * 0.48, 0.8, 0]}>
          <boxGeometry args={[0.03, 1.0, d * 0.95]} />
          <PBRMaterial preset="glassClear" />
        </mesh>
      ))}
      <mesh position={[0, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.6, 0.5, 16]} />
        <meshStandardMaterial color="#1a1a1d" emissive="#ff6633" emissiveIntensity={0.5} />
      </mesh>
    </group>
  )
}
