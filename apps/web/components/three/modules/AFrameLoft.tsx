import type { Material } from '@mig/modules-schema'

export function AFrameLoft({ material, w, h, d }: { material: Material; w: number; h: number; d: number }) {
  const totalH = Math.max(h * 2.4, 5)
  const slope = Math.atan(w / 2 / totalH)
  const slopeLen = Math.sqrt((w / 2) ** 2 + totalH ** 2)
  const wallColor = material === 'timber' ? '#6B4F38' : '#7a5e44'
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.15, 0]}>
        <boxGeometry args={[w, 0.3, d]} />
        <meshStandardMaterial color="#A87C5A" roughness={0.85} />
      </mesh>
      {[-1, 1].map((sx) => (
        <mesh
          key={sx}
          position={[(sx * w) / 4, totalH / 2 + 0.15, 0]}
          rotation={[0, 0, -sx * slope]}
          castShadow
        >
          <boxGeometry args={[0.2, slopeLen, d * 0.98]} />
          <meshStandardMaterial color={wallColor} roughness={0.85} />
        </mesh>
      ))}
      <mesh position={[0, 1.1, d / 2 + 0.02]}>
        <planeGeometry args={[0.85, 2.1]} />
        <meshStandardMaterial color="#1a1a1d" />
      </mesh>
      <mesh position={[0, totalH * 0.65, d / 2 + 0.02]}>
        <circleGeometry args={[0.4, 16]} />
        <meshPhysicalMaterial color="#a8d0ff" transparent opacity={0.6} transmission={0.8} />
      </mesh>
    </group>
  )
}
