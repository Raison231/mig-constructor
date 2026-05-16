import type { Material } from '@mig/modules-schema'

export function ObservationDeck({ material: _material, w, h, d: _d }: { material: Material; w: number; h: number; d: number }) {
  return (
    <group>
      <mesh position={[0, h * 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.6, h * 0.8, 8]} />
        <meshStandardMaterial color="#3a3a3e" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0, h * 0.85, 0]} receiveShadow>
        <cylinderGeometry args={[w * 0.5, w * 0.5, 0.15, 24]} />
        <meshStandardMaterial color="#6b4a2a" roughness={0.8} />
      </mesh>
      <mesh position={[0, h * 1.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[w * 0.45, 0.04, 8, 32]} />
        <meshStandardMaterial color="#8a8a8e" metalness={0.6} />
      </mesh>
      <mesh position={[w * 0.25, h * 1.05, 0]} rotation={[0, 0, Math.PI / 3.5]}>
        <cylinderGeometry args={[0.1, 0.08, 0.6, 12]} />
        <meshStandardMaterial color="#1a1a1e" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, h * 0.93, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.05, 16]} />
        <meshStandardMaterial color="#00D26A" emissive="#00D26A" emissiveIntensity={1.5} />
      </mesh>
    </group>
  )
}
