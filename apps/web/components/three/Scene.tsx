'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Grid } from '@react-three/drei'
import { useConfigurator } from '@/stores/configurator'
import { Module3D } from './Module3D'
import { Ground } from './Ground'

export function Scene() {
  const modules = useConfigurator((s) => s.modules)

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera= position: [12, 10, 12], fov: 35 
      gl= antialias: true, powerPreference: 'high-performance' 
    >
      <color attach="background" args={['#0A0A0B']} />
      <fog attach="fog" args={['#0A0A0B', 30, 80]} />

      <ambientLight intensity={0.3} />
      <directionalLight
        position={[10, 20, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
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
