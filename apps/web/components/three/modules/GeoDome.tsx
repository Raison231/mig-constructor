import type { Material } from '@mig/modules-schema'

export function GeoDome({ material, w, h, d }: { material: Material; w: number; h: number; d: number }) {
  const r = Math.min(w, d) / 2
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.1, 0]}>
        <cylinderGeometry args={[r * 1.02, r * 1.02, 0.2, 32]} />
        <meshStandardMaterial color="#6B4F38" roughness={0.85} />
      </mesh>
      <mesh position={[0, r * 0.5 + 0.2, 0]} castShadow>
        <icosahedronGeometry args={[r, 1]} />
        <meshStandardMaterial color="#A87C5A" roughness={0.7} flatShading />
      </mesh>
      <mesh position={[0, r + 0.25, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.55, 16]} />
        <meshPhysicalMaterial color="#a8d0ff" transparent opacity={0.6} transmission={0.85} />
      </mesh>
      <mesh position={[0, 1.1, r - 0.05]}>
        <planeGeometry args={[0.85, 2.1]} />
        <meshStandardMaterial color="#1a1a1d" />
      </mesh>
    </group>
  )
}
