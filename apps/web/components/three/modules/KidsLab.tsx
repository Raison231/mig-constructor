import { Shell } from './shared/shells'
import type { Material } from '@mig/modules-schema'

const PEG_COLORS = ['#FF6B35', '#00D26A', '#4A90FF', '#F5B544']

export function KidsLab({ material, w, h, d }: { material: Material; w: number; h: number; d: number }) {
  return (
    <group>
      <Shell material={material} w={w} h={h} d={d} />
      {Array.from({ length: 12 }).map((_, i) => {
        const row = Math.floor(i / 4)
        const col = i % 4
        return (
          <mesh
            key={i}
            position={[-w * 0.25 + col * 0.2, h * 0.25 + row * 0.42, d / 2 + 0.05]}
            castShadow
          >
            <sphereGeometry args={[0.07, 12, 12]} />
            <meshStandardMaterial color={PEG_COLORS[i % PEG_COLORS.length]} roughness={0.5} />
          </mesh>
        )
      })}
      <mesh position={[w * 0.35, h * 0.4, d / 2 + 0.025]}>
        <planeGeometry args={[0.85, 2.05]} />
        <meshStandardMaterial color="#FF6B35" />
      </mesh>
    </group>
  )
}
