import type { Material } from '@mig/modules-schema'

const COR_TEN = '#B45A3C'
const COR_TEN_DARK = '#8A4429'
const TIMBER_LIGHT = '#A87C5A'
const TIMBER_DARK = '#6B4F38'
const CORNER = '#1a1a1d'

function ContainerShell({ w, h, d }: { w: number; h: number; d: number }) {
  const grooves = Math.max(8, Math.floor(w * 4))
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, h / 2, 0]}>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={COR_TEN} roughness={0.55} metalness={0.45} />
      </mesh>
      {Array.from({ length: grooves }).map((_, i) => {
        const x = -w / 2 + (i + 0.5) * (w / grooves)
        return (
          <group key={i}>
            <mesh position={[x, h / 2, d / 2 + 0.003]} castShadow>
              <boxGeometry args={[0.02, h * 0.92, 0.04]} />
              <meshStandardMaterial color={COR_TEN_DARK} roughness={0.6} metalness={0.4} />
            </mesh>
            <mesh position={[x, h / 2, -d / 2 - 0.003]} castShadow>
              <boxGeometry args={[0.02, h * 0.92, 0.04]} />
              <meshStandardMaterial color={COR_TEN_DARK} roughness={0.6} metalness={0.4} />
            </mesh>
          </group>
        )
      })}
      {[-1, 1].map((sx) =>
        [-1, 1].map((sz) => (
          <mesh key={`${sx}-${sz}`} position={[(sx * w) / 2, h / 2, (sz * d) / 2]} castShadow>
            <boxGeometry args={[0.15, h, 0.15]} />
            <meshStandardMaterial color={CORNER} roughness={0.4} metalness={0.7} />
          </mesh>
        )),
      )}
    </group>
  )
}

function TimberShell({ w, h, d }: { w: number; h: number; d: number }) {
  const planks = 10
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, h / 2, 0]}>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={TIMBER_LIGHT} roughness={0.85} />
      </mesh>
      {Array.from({ length: planks }).map((_, i) => {
        const y = ((i + 0.5) / planks) * h
        return (
          <group key={i}>
            <mesh position={[0, y, d / 2 + 0.005]}>
              <boxGeometry args={[w, 0.02, 0.04]} />
              <meshStandardMaterial color={TIMBER_DARK} roughness={0.9} />
            </mesh>
            <mesh position={[0, y, -d / 2 - 0.005]}>
              <boxGeometry args={[w, 0.02, 0.04]} />
              <meshStandardMaterial color={TIMBER_DARK} roughness={0.9} />
            </mesh>
          </group>
        )
      })}
      <mesh position={[0, h + 0.45, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[Math.max(w, d) * 0.7, 1.1, 4]} />
        <meshStandardMaterial color={TIMBER_DARK} roughness={0.85} />
      </mesh>
    </group>
  )
}

function HybridShell({ w, h, d }: { w: number; h: number; d: number }) {
  return (
    <group>
      <ContainerShell w={w} h={h} d={d} />
      {[-1, 1].map((sx) => (
        <mesh key={sx} position={[(sx * (w + 0.08)) / 2, h / 2, 0]} castShadow>
          <boxGeometry args={[0.08, h * 0.95, d * 0.9]} />
          <meshStandardMaterial color={TIMBER_LIGHT} roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

export function Shell({ material, w, h, d }: { material: Material; w: number; h: number; d: number }) {
  if (material === 'container') return <ContainerShell w={w} h={h} d={d} />
  if (material === 'timber') return <TimberShell w={w} h={h} d={d} />
  return <HybridShell w={w} h={h} d={d} />
}
