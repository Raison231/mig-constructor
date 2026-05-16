'use client'

import { Canvas } from '@react-three/fiber'
import { Grid } from '@react-three/drei'
import { useConfigurator } from '@/stores/configurator'
import { Module3D } from './Module3D'
import { Ground } from './Ground'
import { DragControls } from './DragControls'
import { SnapPreview } from './SnapPreview'
import { SunSky } from './SunSky'
import { Weather } from './Weather'
import { SiteEnvironment } from './SiteEnvironment'
import { CameraRig } from './CameraRig'

const CAMERA_OPTS = { fov: 50, position: [14, 11, 14] as [number, number, number], near: 0.1, far: 200 }
const GL_OPTS = { antialias: true, alpha: false, powerPreference: 'high-performance' as const, preserveDrawingBuffer: true }
const GRID_ARGS: [number, number] = [40, 40]
const DPR: [number, number] = [1, 2]

export function Scene() {
  const modules = useConfigurator((s) => s.modules)
  const deselect = useConfigurator((s) => s.deselect)

  return (
    <Canvas
      shadows
      dpr={DPR}
      camera={CAMERA_OPTS}
      gl={GL_OPTS}
      onPointerMissed={() => deselect()}
    >
      <SiteEnvironment />
      <SunSky />
      <Weather />
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
      <SnapPreview />
      <DragControls />
      <CameraRig />
    </Canvas>
  )
}
