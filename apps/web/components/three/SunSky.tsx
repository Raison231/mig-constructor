'use client'

import { Sky } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { useWorld } from '@/stores/world'

const MOON_POS: [number, number, number] = [-30, 40, -20]

function clamp01(v: number) { return Math.max(0, Math.min(1, v)) }
function lerp(a: number, b: number, t: number) { return a + (b - a) * clamp01(t) }
function lerpRGB(c1: readonly [number, number, number], c2: readonly [number, number, number], t: number): string {
  const k = clamp01(t)
  const r = Math.round(c1[0] + (c2[0] - c1[0]) * k)
  const g = Math.round(c1[1] + (c2[1] - c1[1]) * k)
  const b = Math.round(c1[2] + (c2[2] - c1[2]) * k)
  return `rgb(${r},${g},${b})`
}

/**
 * Sun world-position from clock hour:
 *  06:00 → sunrise (altitude 0, east)
 *  12:00 → noon    (altitude 1, zenith)
 *  18:00 → sunset  (altitude 0, west)
 *  00:00 → midnight (altitude -1)
 * Sky shader hides the disk when y < ~ -20, so we clamp the visible y.
 */
function sunPosFromHour(hour: number): { sunPos: [number, number, number]; alt: number } {
  const t = ((hour - 6) / 12) * Math.PI
  const y = Math.sin(t)
  const x = Math.cos(t)
  return { sunPos: [x * 100, Math.max(y * 100, -20), 30], alt: y }
}

const COL_NIGHT: readonly [number, number, number]  = [120, 145, 200] // cold blue
const COL_SUNSET: readonly [number, number, number] = [255, 168, 95]  // warm orange
const COL_DAY: readonly [number, number, number]    = [255, 250, 240] // soft white

/**
 * SunSky
 *  - Renders procedural sky + directional sun + ambient + (optional) moon.
 *  - All visual params (intensity, color, turbidity, rayleigh) are smoothly
 *    lerped against the sun's altitude factor — no stepped if/else, so a
 *    running day/night cycle looks continuous.
 *  - When `useWorld.dayNightAuto` is true, advances the hour each frame
 *    by `dayNightSpeed` game-hours per real second (no localStorage thrash).
 */
export function SunSky() {
  const hour = useWorld((s) => s.hour)
  const auto = useWorld((s) => s.dayNightAuto)
  const speed = useWorld((s) => s.dayNightSpeed)
  const tickHour = useWorld((s) => s.tickHour)
  const lastPersistRef = useRef(0)

  useFrame((_, dt) => {
    if (!auto) return
    // dt clamp — avoid huge jumps on tab refocus
    const safeDt = Math.min(dt, 1 / 15)
    tickHour(safeDt * speed)
    // occasional persist of current hour so refresh doesn't lose all progress
    const now = performance.now()
    if (now - lastPersistRef.current > 4000) {
      lastPersistRef.current = now
      useWorld.getState().setHour(useWorld.getState().hour)
    }
  })

  const { sunPos, alt } = sunPosFromHour(hour)
  // factors
  const day     = clamp01(alt / 0.4)              // 1 once sun >= ~24°
  const horizon = clamp01(1 - Math.abs(alt) / 0.25) // peaks at sunrise/sunset
  const night   = clamp01(-alt / 0.2)              // 1 once sun < ~-12°

  const dirIntensity = lerp(0.04, 1.4, day) + horizon * 0.35
  const ambIntensity = lerp(0.10, 0.45, day) + horizon * 0.08
  const turbidity    = lerp(20, 6, day) + horizon * 5
  const rayleigh     = lerp(0.35, 1.0, day) + horizon * 3

  // Smooth color blend: NIGHT — SUNSET — DAY
  // alt:  -1 ......... 0 ......... 1
  //       night       sunset      day
  let dirColor: string
  if (alt >= 0) {
    // sunrise/sunset → day: blend SUNSET→DAY as sun rises
    dirColor = lerpRGB(COL_SUNSET, COL_DAY, alt / 0.5)
  } else {
    // sunset → night: blend SUNSET→NIGHT as sun drops below horizon
    dirColor = lerpRGB(COL_SUNSET, COL_NIGHT, -alt / 0.3)
  }

  return (
    <>
      <Sky
        distance={450000}
        sunPosition={sunPos}
        inclination={0}
        azimuth={0.25}
        turbidity={turbidity}
        rayleigh={rayleigh}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
      />
      <ambientLight intensity={ambIntensity} />
      <directionalLight
        position={sunPos}
        intensity={dirIntensity}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
        color={dirColor}
      />
      {night > 0.15 && (
        <directionalLight
          position={MOON_POS}
          intensity={0.05 + 0.25 * night}
          color="#8aa8ff"
        />
      )}
    </>
  )
}
