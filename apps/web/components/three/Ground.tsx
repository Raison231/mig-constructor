'use client'

const ROTATION: [number, number, number] = [-Math.PI / 2, 0, 0]
const POSITION: [number, number, number] = [0, 0, 0]
const PLANE_ARGS: [number, number] = [100, 100]

export function Ground() {
  return (
    <mesh receiveShadow rotation={ROTATION} position={POSITION}>
      <planeGeometry args={PLANE_ARGS} />
      <meshStandardMaterial color="#0d2f1c" roughness={0.95} metalness={0} />
    </mesh>
  )
}
