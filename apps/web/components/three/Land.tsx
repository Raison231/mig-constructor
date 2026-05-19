'use client'

import { Suspense } from 'react'
import { useLoader } from '@react-three/fiber'
import { TextureLoader, SRGBColorSpace } from 'three'
import { useLand } from '@/stores/land'

function LandTextured({ url }: { url: string }) {
  const widthMeters = useLand((s) => s.widthMeters)
  const rotationDeg = useLand((s) => s.rotationDeg)
  const offsetX = useLand((s) => s.offsetX)
  const offsetZ = useLand((s) => s.offsetZ)
  const opacity = useLand((s) => s.opacity)

  const texture = useLoader(TextureLoader, url)
  texture.colorSpace = SRGBColorSpace
  const img = texture.image as { width?: number; height?: number } | undefined
  const aspect = img?.width && img?.height ? img.width / img.height : 1
  const w = widthMeters
  const h = widthMeters / aspect
  const rotY = (rotationDeg * Math.PI) / 180

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, rotY]}
      position={[offsetX, 0.001, offsetZ]}
      receiveShadow
    >
      <planeGeometry args={[w, h]} />
      <meshStandardMaterial
        map={texture}
        transparent
        opacity={opacity}
        roughness={0.95}
        metalness={0.02}
      />
    </mesh>
  )
}

export function Land() {
  const enabled = useLand((s) => s.enabled)
  const url = useLand((s) => s.imageDataUrl)
  if (!enabled || !url) return null
  return (
    <Suspense fallback={null}>
      <LandTextured url={url} />
    </Suspense>
  )
}
