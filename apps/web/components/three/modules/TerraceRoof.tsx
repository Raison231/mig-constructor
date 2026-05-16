import type { Material } from '@mig/modules-schema'

export function TerraceRoof({ material: _material, w, h, d }: { material: Material; w: number; h: number; d: number }) {
  const rails: Array<{ pos: [number, number, number]; scale: [number, number, number] }> = [
    { pos: [0, 0.5, -d / 2], scale: [w, 1, 0.05] },
    { pos: [-w / 2, 0.5, 0], scale: [0.05, 1, d] },
    { pos: [w / 2, 0.5, 0], scale: [0.05, 1, d] },
  ]
  const pillars: Array<[number, number]> = [
    [-w/2+0.1, -d/2+0.1], [w/2-0.1, -d/2+0.1], [-w/2+0.1, d/2-0.1], [w/2-0.1, d/2-0.1]
  ]
  return (
    <group>
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[w, 0.1, d]} />
        <meshStandardMaterial color="#6b4a2a" roughness={0.85} />
      </mesh>
      {rails.map((r, i) => (
        <mesh key={i} position={r.pos}>
          <boxGeometry args={r.scale} />
          <meshStandardMaterial color="#8a8a8e" metalness={0.3} roughness={0.6} />
        </mesh>
      ))}
      {pillars.map((p, i) => (
        <mesh key={i} position={[p[0], h/2, p[1]]} castShadow>
          <boxGeometry args={[0.12, h, 0.12]} />
          <meshStandardMaterial color="#3a3a3e" />
        </mesh>
      ))}
      <mesh position={[0, h, 0]}>
        <boxGeometry args={[w, 0.08, d]} />
        <meshStandardMaterial color="#1a1a1e" transparent opacity={0.55} />
      </mesh>
    </group>
  )
}
