'use client'

import { useEffect } from 'react'
import type { Vector3 } from 'three'
import { TeleportTarget, XROrigin, useXR } from '@react-three/xr'
import { useVR } from '@/stores/vr'

/**
 * VR player rig. Lives inside ARScene (the XR provider). Renders only while an
 * immersive-vr session is active (session.environmentBlendMode === 'opaque').
 *
 * - <XROrigin position={xrOrigin}/> offsets the VR camera rig in world space.
 * - <TeleportTarget> wraps a transparent ground plane; on controller-ray trigger
 *   it calls onTeleport(worldPoint), and we snap xrOrigin to that point.
 */
export function VRPlayer() {
  const session = useXR((s) => s.session)
  const xrOrigin = useVR((s) => s.xrOrigin)
  const teleportEnabled = useVR((s) => s.teleportEnabled)
  const setXrOrigin = useVR((s) => s.setXrOrigin)
  const setStatus = useVR((s) => s.setStatus)

  useEffect(() => {
    if (!session) {
      setStatus('idle')
      return
    }
    const blendMode = (session as XRSession & { environmentBlendMode?: string }).environmentBlendMode
    if (blendMode === 'opaque') {
      setStatus('active')
      return () => setStatus('idle')
    }
  }, [session, setStatus])

  if (!session) return null
  const blendMode = (session as XRSession & { environmentBlendMode?: string }).environmentBlendMode
  if (blendMode !== 'opaque') return null

  return (
    <>
      <XROrigin position={xrOrigin} />
      {teleportEnabled && (
        <TeleportTarget onTeleport={(v: Vector3) => setXrOrigin([v.x, 0, v.z])}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
            <planeGeometry args={[200, 200]} />
            <meshBasicMaterial color="#10B981" transparent opacity={0} depthWrite={false} />
          </mesh>
        </TeleportTarget>
      )}
    </>
  )
}
