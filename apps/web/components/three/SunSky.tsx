'use client'

import { Sky } from '@react-three/drei'
import { useMemo } from 'react'
import { useWorld } from '@/stores/world'

function sunPosFromHour(hour: number): [number, number, number] {
  const t = ((hour - 6) / 12) * Math.PI
  const y = Math.sin(t)
  const x = Math.cos(t)
  return [x * 100, Math.max(y * 100, -20), 30]
}

const MOON_POS: [number, number, number] = [-30, 40, -20]

export function SunSky() {
  const hour = useWorld((s) => s.hour)
  const sunPos = useMemo(() => sunPosFromHour(hour), [hour])
  const isNight = hour < 6 || hour > 20
  const isDusk = (hour >= 18 && hour <= 20) || (hour >= 5 && hour <= 7)
  const dirIntensity = isNight ? 0.15 : isDusk ? 0.7 : 1.4
  const ambIntensity = isNight ? 0.18 : isDusk ? 0.3 : 0.45
  const dirColor = isNight ? '#9bb4ff' : isDusk ? '#ffb070' : '#ffffff'
  const turbidity = isNight ? 20 : isDusk ? 12 : 6
  const rayleigh = isNight ? 0.5 : isDusk ? 4 : 1

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
      {isNight && (
        <directionalLight position={MOON_POS} intensity={0.25} color="#8aa8ff" />
      )}
    </>
  )
}
