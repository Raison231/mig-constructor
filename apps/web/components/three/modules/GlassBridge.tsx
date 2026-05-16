import type { Material } from '@mig/modules-schema'

export function GlassBridge({ material: _material, w, h, d }: { material: Material; w: number; h: number; d: number }) {
  return (
    <group>
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[w, 0.1, d]} />
        <meshStandardMaterial color="#3a2d1f" roughness={0.8} />
      </mesh>
      <mesh position={[0, h / 2 + 0.05, 0]}>
        <boxGeometry args={[w, h, d]} />
        <meshPhysicalMaterial color="#a0d4ff" transparent opacity={0.22} roughness={0.05} transmission={0.92} thickness={0.5} />
      </mesh>
      <mesh position={[0, h + 0.1, 0]}>
        <boxGeometry args={[w * 1.05, 0.06, d * 1.05]} />
        <meshStandardMaterial color="#1a1a1e" metalness={0.5} />
      </mesh>
      <mesh position={[0, h + 0.05, -d/2]}>
        <boxGeometry args={[w, 0.05, 0.05]} />
        <meshStandardMaterial color="#00D26A" emissive="#00D26A" emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[0, h + 0.05, d/2]}>
        <boxGeometry args={[w, 0.05, 0.05]} />
        <meshStandardMaterial color="#00D26A" emissive="#00D26A" emissiveIntensity={1.2} />
      </mesh>
    </group>
  )
}
