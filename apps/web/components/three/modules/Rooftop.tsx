import type { Material } from '@mig/modules-schema'

export function Rooftop({ material, w, h, d }: { material: Material; w: number; h: number; d: number }) {
  const floorColor = material === 'container' ? '#B45A3C' : '#A87C5A'
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.15, 0]}>
        <boxGeometry args={[w, 0.3, d]} />
        <meshStandardMaterial color={floorColor} roughness={0.7} />
      </mesh>
      {[-1, 1].map((sz) => (
        <mesh key={sz} position={[0, 0.8, sz * d * 0.48]}>
          <boxGeometry args={[w * 0.95, 1.0, 0.03]} />
          <meshPhysicalMaterial color="#ddeeff" transparent opacity={0.35} transmission={0.7} />
        </mesh>
      ))}
      {[-1, 1].map((sx) => (
        <mesh key={sx} position={[sx * w * 0.48, 0.8, 0]}>
          <boxGeometry args={[0.03, 1.0, d * 0.95]} />
          <meshPhysicalMaterial color="#ddeeff" transparent opacity={0.35} transmission={0.7} />
        </mesh>
      ))}
      <mesh position={[0, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.6, 0.5, 16]} />
        <meshStandardMaterial color="#1a1a1d" emissive="#ff6633" emissiveIntensity={0.5} />
      </mesh>
    </group>
  )
}
