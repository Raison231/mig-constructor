import type { Material } from '@mig/modules-schema'

const PILLAR_COLOR = '#3a3a3e'
const ROOF_COLOR_M: Record<Material, string> = {
  container: '#4a4a4e', timber: '#6b4a2a', hybrid: '#5a4a3e',
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
          <meshStandardMaterial color={PILLAR_COLOR} metalness={0.6} roughness={0.4} />
        </mesh>
      ))}
      <mesh position={[0, h + 0.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[w * 1.1, 0.12, d * 1.1]} />
        <meshStandardMaterial color={ROOF_COLOR_M[material]} roughness={0.75} />
      </mesh>
      <mesh position={[0, h + 0.13, 0]}>
        <boxGeometry args={[w * 1.05, 0.02, d * 1.05]} />
        <meshStandardMaterial color="#1a3a6a" metalness={0.7} roughness={0.2} emissive="#0a1a3a" />
      </mesh>
    </group>
  )
}
