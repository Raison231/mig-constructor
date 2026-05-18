'use client'

import { Canvas } from '@react-three/fiber'
import { Grid, OrbitControls } from '@react-three/drei'
import type { ModuleInstance } from '@mig/modules-schema'
import { Module3D } from './Module3D'
import { Ground } from './Ground'
import { SunSky } from './SunSky'

const CAMERA_OPTS = { fov: 50, position: [12, 9, 12] as [number, number, number], near: 0.1, far: 200 }
const GL_OPTS = { antialias: true, alpha: false, powerPreference: 'default' as const }
const GRID_ARGS: [number, number] = [40, 40]
const DPR: [number, number] = [1, 1.5]

interface SnapshotSceneProps {
  modules: ModuleInstance[]
  label?: string
}

export function SnapshotScene({ modules, label }: SnapshotSceneProps) {
  return (
    <div className="relative h-full w-full">
      <Canvas shadows dpr={DPR} camera={CAMERA_OPTS} gl={GL_OPTS}>
        <SunSky />
        <Ground />
        <Grid
          args={GRID_ARGS}
          cellSize={1} cellThickness={0.5} cellColor="#1a3520"
          sectionSize={5} sectionThickness={1} sectionColor="#00D26A"
          fadeDistance={30} fadeStrength={1.5} infiniteGrid
        />
        {modules.map((m) => (
          <Module3D key={m.instanceId} instance={m} />
        ))}
        <OrbitControls makeDefault enablePan enableZoom enableRotate />
      </Canvas>
      {label && (
        <div className="absolute left-3 top-3 rounded-md border border-white/10 bg-black/60 px-3 py-1 text-xs font-semibold text-fg backdrop-blur">
          {label}
        </div>
      )}
    </div>
  )
}
