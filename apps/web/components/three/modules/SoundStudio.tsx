import { Shell } from './shared/shells'
import type { Material } from '@mig/modules-schema'

export function SoundStudio({ material, w, h, d }: { material: Material; w: number; h: number; d: number }) {
  return (
    <group>
      <Shell material={material} w={w} h={h} d={d} />
      <mesh position={[0, h / 2, d / 2 + 0.01]}>
        <planeGeometry args={[w * 0.92, h * 0.92]} />
        <meshStandardMaterial color="#1a1a1d" roughness={1} />
      </mesh>
      {Array.from({ length: 5 }).map((_, r) =>
        Array.from({ length: 6 }).map((_, c) => (
          <mesh
            key={`${r}-${c}`}
            position={[-w * 0.4 + c * ((w * 0.8) / 5), h * 0.18 + r * ((h * 0.6) / 4), d / 2 + 0.025]}
          >
            <boxGeometry args={[w * 0.1, h * 0.1, 0.04]} />
            <meshStandardMaterial color="#3a2a1a" roughness={0.95} />
          </mesh>
        )),
      )}
    </group>
  )
}
