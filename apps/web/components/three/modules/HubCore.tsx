import { Shell } from './shared/shells'
import type { Material } from '@mig/modules-schema'

export function HubCore({ material, w, h, d }: { material: Material; w: number; h: number; d: number }) {
  return (
    <group>
      <Shell material={material} w={w} h={h} d={d} />
      <mesh position={[0, h * 0.55, d / 2 + 0.02]}>
        <planeGeometry args={[w * 0.7, h * 0.6]} />
        <meshPhysicalMaterial color="#a8d0ff" transparent opacity={0.55} transmission={0.7} roughness={0.05} />
      </mesh>
      <mesh position={[w * 0.35, h * 0.4, d / 2 + 0.025]}>
        <planeGeometry args={[0.85, 2.05]} />
        <meshStandardMaterial color="#1a1a1d" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[w * 0.2, h + 0.005, 0]}>
        <planeGeometry args={[1.6, 1.6]} />
        <meshPhysicalMaterial color="#a8d0ff" transmission={0.9} transparent opacity={0.5} />
      </mesh>
    </group>
  )
}
