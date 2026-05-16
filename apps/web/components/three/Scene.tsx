'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Grid } from '@react-three/drei'
import { useConfigurator } from '@/stores/configurator'
import { Module3D } from './Module3D'
import { Ground } from './Ground'

export function Scene() {
  const modules = useConfigurator((s) => s.modules)
  const deselect = useConfigurator((s) => s.deselect)

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera= fov: 50, position: [14, 11, 14], near: 0.1, far: 200 
      gl= antialias: true, alpha: false, powerPreference: 'high-performance' 
      onPointerMissed={() => deselect()}
    >
      <color attach="background" args={['#0A0A0B']} />
      <fog attach="fog" args={['#0A0A0B', 30, 90]} />

      <ambientLight intensity={0.35} />
      <directionalLight
        position={[10, 20, 5]}
        intensity={1.3}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
      />

      <Environment preset="sunset" background={false} />

      <Ground />

      <Grid
        args={[40, 40]}
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
