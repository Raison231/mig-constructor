import { PBRMaterial } from './shared/materials'
import type { Material } from '@mig/modules-schema'

export function SolarTower({ material: _material, w, h, d: _d }: { material: Material; w: number; h: number; d: number }) {
  const panelCount = 4
  return (
    <group>
      <mesh position={[0, h / 2, 0]} castShadow>
        <boxGeometry args={[w * 0.3, h, w * 0.3]} />
        <PBRMaterial preset="blackMatte" />
      </mesh>
      {Array.from({ length: panelCount }).map((_, i) => (
        <mesh
          key={i}
          position={[0, h * (0.2 + 0.2 * i), w * 0.22]}
          rotation={[Math.PI / 6, 0, 0]}
          castShadow
        >
          <boxGeometry args={[w * 0.7, 0.04, w * 0.28]} />
          <PBRMaterial preset="solarPanel" />
        </mesh>
      ))}
      <mesh position={[0, h + 0.25, 0]}>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshStandardMaterial color="#00D26A" emissive="#00D26A" emissiveIntensity={2.5} />
      </mesh>
      <mesh position={[0, h + 0.45, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.4, 6]} />
        <PBRMaterial preset="blackMatte" />
      </mesh>
    </group>
  )
}
