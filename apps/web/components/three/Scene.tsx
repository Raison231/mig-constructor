'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Grid } from '@react-three/drei'
import { useConfigurator } from '@/stores/configurator'
import { Module3D } from './Module3D'
import { Ground } from './Ground'

const CAMERA_OPTS = { fov: 50, position: [14, 11, 14] as [number, number, number], near: 0.1, far: 200 }
const GL_OPTS = { antialias: true, alpha: false, powerPreference: 'high-performance' as const }
const SHADOW_MAP_SIZE: [number, number] = [2048, 2048]
const LIGHT_POS: [number, number, number] = [10, 20, 5]
const BG_ARGS = ['#0A0A0B'] as const
const FOG_ARGS = ['#0A0A0B', 30, 90] as const
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
      <color attach="background" args={BG_ARGS} />
      <fog attach="fog" args={FOG_ARGS} />

      <ambientLight intensity={0.35} />
      <directionalLight
        position={LIGHT_POS}
        intensity={1.3}
        castShadow
        shadow-mapSize={SHADOW_MAP_SIZE}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
      />

      <Environment preset="sunset" background={false} />

      <Ground />

      <Grid
        args={GRID_ARGS}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#1a3520"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#00D26A"
        fadeDistance={30}
        fadeStrength={1.5}
        infiniteGrid
      />

      {modules.map((m) => (
        <Module3D key={m.instanceId} instance={m} />
      ))}

      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.05}
        minDistance={4}
        maxDistance={40}
        maxPolarAngle={Math.PI / 2.1}
      />
    </Canvas>
  )
}
