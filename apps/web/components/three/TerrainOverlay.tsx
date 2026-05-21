'use client'

import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import type { ThreeEvent } from '@react-three/fiber'
import { useTerrain, TERRAIN_GRID_SIZE, TERRAIN_WORLD_SIZE } from '@/stores/terrain'
import { paintCircle, worldToSplatPixel } from '@/lib/terrain'
import { useCinematic } from '@/stores/cinematic'
import { usePhysics } from '@/stores/physics'

/**
 * Invisible-by-default overlay plane that hosts the soil splatmap.
 *
 *  • Renders only when `terrain.enabled`.
 *  • Accepts pointer events only when `terrain.painting` is true and we’re
 *    not in walk/drone or crane-physics mode. Outside paint mode, regular
 *    module dragging and selection are completely untouched.
 *  • Stroke smoothing: paints along the line between the last and current
 *    pointer pixel so fast drags don’t leave gaps.
 */
export function TerrainOverlay() {
  const enabled = useTerrain((s) => s.enabled)
  const painting = useTerrain((s) => s.painting)
  const splatData = useTerrain((s) => s.splatData)
  const splatVersion = useTerrain((s) => s.splatVersion)
  const brushMaterial = useTerrain((s) => s.brushMaterial)
  const brushSize = useTerrain((s) => s.brushSize)
  const brushOpacity = useTerrain((s) => s.brushOpacity)
  const cinematicMode = useCinematic((s) => s.mode)
  const physicsActive = usePhysics((s) => s.active)

  // CanvasTexture backed by an offscreen canvas. We blit splatData via putImageData.
  const { texture, ctx } = useMemo(() => {
    if (typeof document === 'undefined') {
      return { texture: null as THREE.Texture | null, ctx: null as CanvasRenderingContext2D | null }
    }
    const canvas = document.createElement('canvas')
    canvas.width = TERRAIN_GRID_SIZE
    canvas.height = TERRAIN_GRID_SIZE
    const c = canvas.getContext('2d', { willReadFrequently: true })!
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.minFilter = THREE.LinearFilter
    tex.magFilter = THREE.LinearFilter
    tex.needsUpdate = true
    return { texture: tex, ctx: c }
  }, [])

  // Sync store splat → canvas → texture whenever splatVersion bumps.
  useEffect(() => {
    if (!ctx || !texture) return
    const img = new ImageData(splatData, TERRAIN_GRID_SIZE, TERRAIN_GRID_SIZE)
    ctx.putImageData(img, 0, 0)
    texture.needsUpdate = true
  }, [splatData, splatVersion, ctx, texture])

  const draggingRef = useRef(false)
  const lastPxRef = useRef<{ px: number; py: number } | null>(null)

  const interactive = enabled && painting && cinematicMode === 'off' && !physicsActive

  function paintAt(px: number, py: number) {
    paintCircle(splatData, TERRAIN_GRID_SIZE, px, py, brushSize, brushMaterial, brushOpacity)
  }

  function handleStroke(e: ThreeEvent<PointerEvent>) {
    const p = e.point
    const pix = worldToSplatPixel(p.x, p.z, TERRAIN_GRID_SIZE, TERRAIN_WORLD_SIZE)
    if (!pix) return
    const last = lastPxRef.current
    if (last) {
      const dx = pix.px - last.px, dy = pix.py - last.py
      const dist = Math.hypot(dx, dy)
      const step = Math.max(1, brushSize / 3)
      const steps = Math.max(1, Math.ceil(dist / step))
      for (let i = 1; i <= steps; i++) {
        const tx = last.px + (dx * i) / steps
        const ty = last.py + (dy * i) / steps
        paintAt(tx, ty)
      }
    } else {
      paintAt(pix.px, pix.py)
    }
    lastPxRef.current = pix
    // Bump version through setState (we mutated splatData in place).
    useTerrain.setState((s) => ({ splatVersion: s.splatVersion + 1 }))
  }

  if (!enabled) return null

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0.012, 0]}
      renderOrder={1}
      onPointerDown={interactive ? (e) => {
        e.stopPropagation()
        draggingRef.current = true
        lastPxRef.current = null
        handleStroke(e)
      } : undefined}
      onPointerMove={interactive ? (e) => {
        if (!draggingRef.current) return
        handleStroke(e)
      } : undefined}
      onPointerUp={interactive ? () => {
        draggingRef.current = false
        lastPxRef.current = null
      } : undefined}
      onPointerLeave={interactive ? () => {
        draggingRef.current = false
        lastPxRef.current = null
      } : undefined}
    >
      <planeGeometry args={[TERRAIN_WORLD_SIZE, TERRAIN_WORLD_SIZE]} />
      <meshBasicMaterial
        map={texture ?? undefined}
        transparent
        opacity={0.92}
        depthWrite={false}
        polygonOffset
        polygonOffsetFactor={-1}
        polygonOffsetUnits={-1}
      />
    </mesh>
  )
}
