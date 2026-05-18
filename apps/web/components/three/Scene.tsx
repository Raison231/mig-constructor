'use client'

import { Canvas } from '@react-three/fiber'
import { Grid, Environment, ContactShadows } from '@react-three/drei'
import { useConfigurator } from '@/stores/configurator'
import { usePhysics } from '@/stores/physics'
import { useCinematic } from '@/stores/cinematic'
import { Module3D } from './Module3D'
import { Ground } from './Ground'
import { DragControls } from './DragControls'
import { SnapPreview } from './SnapPreview'
import { SunSky } from './SunSky'
import { Weather } from './Weather'
import { SiteEnvironment } from './SiteEnvironment'
import { CameraRig } from './CameraRig'
import { MeasureTool } from './MeasureTool'
import { CranePhysics } from './CranePhysics'
import { AnnotationLayer } from './AnnotationLayer'
import { ARScene } from './ARScene'
import { RealtimeCursors } from './RealtimeCursors'
import { WalkthroughCamera } from './WalkthroughCamera'
import { DroneCamera } from './DroneCamera'

const CAMERA_OPTS = { fov: 45, position: [12, 10, 14] as [number, number, number], near: 0.1, far: 200 }
const GL_OPTS = { antialias: true, alpha: false, powerPreference: 'high-performance' as const, preserveDrawingBuffer: true }
const GRID_ARGS: [number, number] = [50, 50]
const DPR: [number, number] = [1, 2]
const CONTACT_SHADOW_POS: [number, number, number] = [0, 0.005, 0]

export function Scene() {
  const modules = useConfigurator((s) => s.modules)
  const deselect = useConfigurator((s) => s.deselect)
  const physicsActive = usePhysics((s) => s.active)
  const cinematicMode = useCinematic((s) => s.mode)
  const cinematicActive = cinematicMode !== 'off'
  const showContactShadows = !physicsActive && !cinematicActive

  return (
    <Canvas
      shadows
      dpr={DPR}
      camera={CAMERA_OPTS}
      gl={GL_OPTS}
      onPointerMissed={() => deselect()}
    >
      <ARScene>
        <SiteEnvironment />
        <SunSky />
        <Weather />
        <Ground />
        <Environment preset="city" background={false} />
        <ambientLight intensity={0.35} />
        <hemisphereLight args={["#cbe3ff", "#f8f5ea", 0.45]} />
        <Grid
          args={GRID_ARGS}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#D1D5DB"
          sectionSize={5}
          sectionThickness={1}
          sectionColor="#94A3B8"
          fadeDistance={32}
          fadeStrength={1.5}
          infiniteGrid
        />
        {showContactShadows && (
          <ContactShadows
            position={CONTACT_SHADOW_POS}
            opacity={0.35}
            scale={60}
            blur={2.4}
            far={8}
            resolution={1024}
            color="#0B1220"
          />
        )}
        {physicsActive ? (
          <CranePhysics />
        ) : (
          modules.map((m) => <Module3D key={m.instanceId} instance={m} />)
        )}
        <AnnotationLayer />
        <RealtimeCursors />
        <SnapPreview />
        {!physicsActive && !cinematicActive && <DragControls />}
        <MeasureTool />
        {!cinematicActive && <CameraRig />}
        <WalkthroughCamera />
        <DroneCamera />
      </ARScene>
    </Canvas>
  )
}
