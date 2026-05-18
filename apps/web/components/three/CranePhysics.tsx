'use client'

import { Physics, RigidBody } from '@react-three/rapier'
import { useEffect, useState, type ReactNode } from 'react'
import { useConfigurator } from '@/stores/configurator'
import { usePhysics } from '@/stores/physics'
import { Module3D } from './Module3D'
import { DROP_HEIGHT, GRAVITY, LINEAR_DAMPING, ANGULAR_DAMPING, RESTITUTION, FRICTION } from '@/lib/crane-physics'

interface CranePhysicsProps {
  children?: ReactNode
}

export function CranePhysics({ children }: CranePhysicsProps) {
  const active = usePhysics((s) => s.active)
  const dropAllSignal = usePhysics((s) => s.dropAllSignal)
  const modules = useConfigurator((s) => s.modules)
  const [resetKey, setResetKey] = useState(0)

  useEffect(() => {
    if (active) setResetKey((k) => k + 1)
  }, [active, dropAllSignal])

  if (!active) return <>{children}</>

  return (
    <Physics gravity={GRAVITY} key={resetKey}>
      {/* Floor */}
      <RigidBody type="fixed" friction={FRICTION} restitution={RESTITUTION}>
        <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial />
        </mesh>
      </RigidBody>
      {modules.map((m) => (
        <RigidBody
          key={m.instanceId}
          colliders="cuboid"
          position={[m.position[0], DROP_HEIGHT, m.position[2]]}
          rotation={[0, m.rotationY, 0]}
          linearDamping={LINEAR_DAMPING}
          angularDamping={ANGULAR_DAMPING}
          restitution={RESTITUTION}
          friction={FRICTION}
        >
          <Module3D instance={m} />
        </RigidBody>
      ))}
    </Physics>
  )
}
