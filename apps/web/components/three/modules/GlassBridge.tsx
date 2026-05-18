import { PBRMaterial } from './shared/materials'
import type { Material } from '@mig/modules-schema'

export function GlassBridge({ material: _material, w, h, d }: { material: Material; w: number; h: number; d: number }) {
  void _material
  return (
    <group>
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[w, 0.1, d]} />
        <PBRMaterial preset="timberDark" />
      </mesh>
      <mesh position={[0, h / 2 + 0.05, 0]}>
        <boxGeometry args={[w, h, d]} />
        <PBRMaterial preset="glassClear" />
      </mesh>
      <mesh position={[0, h + 0.1, 0]}>
        <boxGeometry args={[w * 1.05, 0.06, d * 1.05]} />
        <PBRMaterial preset="blackMatte" />
      </mesh>
      <mesh position={[0, h + 0.05, -d / 2]}>
        <boxGeometry args={[w, 0.05, 0.05]} />
        <meshStandardMaterial color="#00D26A" emissive="#00D26A" emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[0, h + 0.05, d / 2]}>
        <boxGeometry args={[w, 0.05, 0.05]} />
        <meshStandardMaterial color="#00D26A" emissive="#00D26A" emissiveIntensity={1.2} />
      </mesh>
    </group>
  )
}
