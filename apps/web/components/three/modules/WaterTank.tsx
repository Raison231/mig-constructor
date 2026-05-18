import { PBRMaterial } from './shared/materials'
import type { Material } from '@mig/modules-schema'

export function WaterTank({ material: _material, w, h, d: _d }: { material: Material; w: number; h: number; d: number }) {
  return (
    <group>
      <mesh position={[0, h * 0.5, 0]} castShadow>
        <cylinderGeometry args={[w * 0.45, w * 0.45, h, 24]} />
        <PBRMaterial preset="aluminumBrushed" />
      </mesh>
      <mesh position={[0, h, 0]}>
        <sphereGeometry args={[w * 0.45, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <PBRMaterial preset="aluminum" />
      </mesh>
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} position={[w * 0.5, (i + 0.5) * (h / 8), 0]}>
          <boxGeometry args={[0.08, 0.04, 0.4]} />
          <PBRMaterial preset="blackMatte" />
        </mesh>
      ))}
      <mesh position={[w * 0.48, h / 2, -0.18]}>
        <boxGeometry args={[0.04, h, 0.04]} />
        <PBRMaterial preset="blackMatte" />
      </mesh>
      <mesh position={[w * 0.48, h / 2, 0.18]}>
        <boxGeometry args={[0.04, h, 0.04]} />
        <PBRMaterial preset="blackMatte" />
      </mesh>
      <mesh position={[0, h * 0.6, w * 0.45 + 0.01]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[w * 0.1, w * 0.15, 16]} />
        <PBRMaterial preset="ledCool" />
      </mesh>
    </group>
  )
}
