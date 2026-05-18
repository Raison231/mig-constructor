import { PBRMaterial } from './shared/materials'
import type { Material } from '@mig/modules-schema'

export function ObservationDeck({ material: _material, w, h, d: _d }: { material: Material; w: number; h: number; d: number }) {
  return (
    <group>
      <mesh position={[0, h * 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.6, h * 0.8, 8]} />
        <PBRMaterial preset="aluminumBrushed" />
      </mesh>
      <mesh position={[0, h * 0.85, 0]} receiveShadow>
        <cylinderGeometry args={[w * 0.5, w * 0.5, 0.15, 24]} />
        <PBRMaterial preset="timberDark" />
      </mesh>
      <mesh position={[0, h * 1.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[w * 0.45, 0.04, 8, 32]} />
        <PBRMaterial preset="aluminum" />
      </mesh>
      <mesh position={[w * 0.25, h * 1.05, 0]} rotation={[0, 0, Math.PI / 3.5]}>
        <cylinderGeometry args={[0.1, 0.08, 0.6, 12]} />
        <PBRMaterial preset="blackMatte" />
      </mesh>
      <mesh position={[0, h * 0.93, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.05, 16]} />
        <meshStandardMaterial color="#00D26A" emissive="#00D26A" emissiveIntensity={1.5} />
      </mesh>
    </group>
  )
}
