'use client'

import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useHeal } from '@/stores/heal'
import { quickSnapshot } from '@/lib/migHeal'

const SAMPLE_INTERVAL = 0.25 // seconds — sample 4× per second

/**
 * Mounted INSIDE the Canvas. Samples WebGL renderer.info on a low-frequency
 * tick, listens for WebGL context loss/restore, and periodically captures a
 * lightweight scene snapshot for crash recovery.
 */
export function HealthMonitor() {
  const gl = useThree((s) => s.gl)
  const setStats = useHeal((s) => s.setStats)
  const incContextLost = useHeal((s) => s.incContextLost)
  const pushEvent = useHeal((s) => s.pushEvent)
  const autoSnapshotEnabled = useHeal((s) => s.autoSnapshotEnabled)
  const autoSnapshotIntervalSec = useHeal((s) => s.autoSnapshotIntervalSec)

  const acc = useRef(0)
  const frames = useRef(0)
  const frameMsAcc = useRef(0)
  const lastSnap = useRef(0)

  // WebGL context loss / restore listeners on the canvas element.
  useEffect(() => {
    const dom = gl.domElement
    const onLost = (e: Event) => {
      e.preventDefault()
      incContextLost()
      pushEvent('context_lost', 'WebGL context lost — попытка восстановления...')
      // Best-effort: capture a snapshot RIGHT NOW so user data survives.
      try { quickSnapshot('on-context-lost') } catch {}
    }
    const onRestored = () => {
      pushEvent('context_restored', 'WebGL context восстановлен')
    }
    dom.addEventListener('webglcontextlost', onLost as EventListener, false)
    dom.addEventListener('webglcontextrestored', onRestored as EventListener, false)
    return () => {
      dom.removeEventListener('webglcontextlost', onLost as EventListener)
      dom.removeEventListener('webglcontextrestored', onRestored as EventListener)
    }
  }, [gl, incContextLost, pushEvent])

  useFrame((_, delta) => {
    acc.current += delta
    frames.current += 1
    frameMsAcc.current += delta * 1000

    // Throttled sample → state update.
    if (acc.current >= SAMPLE_INTERVAL) {
      const fps = frames.current / acc.current
      const frameMs = frameMsAcc.current / Math.max(1, frames.current)
      const info = gl.info
      setStats({
        fps: Math.round(fps * 10) / 10,
        frameMs: Math.round(frameMs * 10) / 10,
        drawCalls: info.render.calls,
        triangles: info.render.triangles,
        geometries: info.memory.geometries,
        textures: info.memory.textures,
        programs: info.programs?.length ?? 0,
      })
      acc.current = 0
      frames.current = 0
      frameMsAcc.current = 0
    }

    // Periodic auto-snapshot (uses performance.now to be independent of state).
    if (autoSnapshotEnabled) {
      const now = performance.now()
      if (now - lastSnap.current >= autoSnapshotIntervalSec * 1000) {
        lastSnap.current = now
        try { quickSnapshot('auto') } catch {}
      }
    }
  })

  return null
}
