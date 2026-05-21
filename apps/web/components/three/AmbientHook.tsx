'use client'

import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useAudio, type AmbientChannel } from '@/stores/audio'
import { useFlora, type BiomeId } from '@/stores/flora'
import { useWorld } from '@/stores/world'
import { useCinematic } from '@/stores/cinematic'
import { getEngine } from '@/lib/ambientEngine'

// Biome → base mix on channels (excluding rain which is weather-driven)
const BIOME_MIX: Record<BiomeId, Record<AmbientChannel, number>> = {
  forest:        { wind: 0.35, birds: 0.75, rustle: 0.55, rain: 0,    water: 0,    drone: 0.05 },
  taiga:         { wind: 0.75, birds: 0.25, rustle: 0.40, rain: 0,    water: 0,    drone: 0.10 },
  mediterranean: { wind: 0.50, birds: 0.45, rustle: 0.30, rain: 0,    water: 0.20, drone: 0.05 },
  subtropical:   { wind: 0.35, birds: 0.60, rustle: 0.65, rain: 0,    water: 0.35, drone: 0.05 },
  meadow:        { wind: 0.55, birds: 0.80, rustle: 0.35, rain: 0,    water: 0.10, drone: 0.05 },
}

const NO_FLORA_MIX: Record<AmbientChannel, number> = {
  wind: 0.40, birds: 0.30, rustle: 0.20, rain: 0, water: 0, drone: 0.10,
}

const CHANNELS: AmbientChannel[] = ['wind', 'birds', 'rustle', 'rain', 'water', 'drone']

/**
 * Bridges audio engine with the live scene state.
 *  - starts/stops the engine when `enabled` toggles
 *  - recomputes target channel levels from biome + weather + user overrides
 *  - in Walk Mode, triggers footsteps when camera moves on the ground plane
 */
export function AmbientHook() {
  const enabled = useAudio((s) => s.enabled)
  const master = useAudio((s) => s.masterVolume)
  const chVols = useAudio((s) => s.channelVolumes)
  const footstepsEnabled = useAudio((s) => s.footstepsEnabled)
  const footstepVolume = useAudio((s) => s.footstepVolume)

  const floraEnabled = useFlora((s) => s.enabled)
  const biome = useFlora((s) => s.biome)
  const weather = useWorld((s) => s.weather)
  const cinematicMode = useCinematic((s) => s.mode)
  const walkSpeed = useCinematic((s) => s.walkSpeed)
  const inWalk = cinematicMode === 'walkthrough'

  const { camera } = useThree()
  const lastPosRef = useRef<{ x: number; z: number; t: number } | null>(null)
  const accDistRef = useRef(0)

  // start / stop engine
  useEffect(() => {
    const engine = getEngine()
    if (enabled) {
      engine.start().catch(() => { /* swallowed: autoplay blocked, will retry on next toggle */ })
    } else {
      engine.stop()
    }
  }, [enabled])

  // master volume
  useEffect(() => {
    if (enabled) getEngine().setMasterVolume(master)
  }, [enabled, master])

  // channel mix derived from biome + weather
  useEffect(() => {
    if (!enabled) return
    const engine = getEngine()
    const base = floraEnabled ? BIOME_MIX[biome] : NO_FLORA_MIX
    const rainy = weather === 'rain'
    const cloudy = weather === 'cloudy'
    for (const ch of CHANNELS) {
      let target = base[ch] * chVols[ch]
      if (rainy) {
        if (ch === 'rain') target = 0.9 * chVols.rain
        else if (ch === 'birds') target *= 0.15
        else if (ch === 'wind') target = Math.max(target, 0.55) * chVols.wind
      } else if (cloudy) {
        if (ch === 'birds') target *= 0.55
        if (ch === 'wind') target = Math.max(target, 0.45) * chVols.wind
      }
      engine.setChannelLevel(ch, target)
    }
  }, [enabled, floraEnabled, biome, weather, chVols])

  // footsteps: accumulate camera ground-plane motion in Walk Mode
  useFrame(() => {
    if (!enabled || !inWalk || !footstepsEnabled) {
      lastPosRef.current = null
      accDistRef.current = 0
      return
    }
    const now = performance.now()
    const cur = { x: camera.position.x, z: camera.position.z, t: now }
    const prev = lastPosRef.current
    if (!prev) { lastPosRef.current = cur; return }
    const dx = cur.x - prev.x
    const dz = cur.z - prev.z
    const dist = Math.sqrt(dx * dx + dz * dz)
    accDistRef.current += dist
    // stride length scales loosely with walkSpeed; ~0.75m at default 2.4 m/s
    const stride = 0.55 + Math.min(0.6, walkSpeed * 0.12)
    if (accDistRef.current >= stride) {
      accDistRef.current = 0
      const speedFrac = Math.min(1, dist / (stride * 0.6))
      getEngine().triggerFootstep(footstepVolume * (0.6 + speedFrac * 0.5))
    }
    lastPosRef.current = cur
  })

  return null
}
