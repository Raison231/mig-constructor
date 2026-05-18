'use client'

import { Html } from '@react-three/drei'
import { useAnnotations } from '@/stores/annotations'

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
              style= background: 'rgba(20,20,23,0.85)', borderColor: a.color, color: '#F5F5F7', maxWidth: 200 
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
