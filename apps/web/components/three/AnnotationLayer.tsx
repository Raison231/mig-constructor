'use client'

import { Html } from '@react-three/drei'
import { useAnnotations } from '@/stores/annotations'

const NOTE_STYLE = {
  background: 'rgba(10, 10, 11, 0.85)',
  color: '#F5F5F7',
  borderColor: 'rgba(0, 210, 106, 0.5)',
  maxWidth: 200,
}

export function AnnotationLayer() {
  const active = useAnnotations((s) => s.active)
  const list = useAnnotations((s) => s.list)
  const remove = useAnnotations((s) => s.remove)

  if (!active || list.length === 0) return null

  return (
    <>
      {list.map((a) => (
        <group key={a.id} position={a.position}>
          <mesh>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshBasicMaterial color={a.color} />
          </mesh>
          <Html distanceFactor={10} position={[0, 0.5, 0]} center>
            <div
              className="pointer-events-auto select-none rounded-md border px-2 py-1 text-xs shadow-lg backdrop-blur"
              style={NOTE_STYLE}
            >
              <button
                type="button"
                onClick={() => remove(a.id)}
                className="float-right ml-2 opacity-60 hover:opacity-100"
                aria-label="Delete annotation"
              >
                ×
              </button>
              <div className="whitespace-pre-wrap break-words">{a.text || '…'}</div>
            </div>
          </Html>
        </group>
      ))}
    </>
  )
}
