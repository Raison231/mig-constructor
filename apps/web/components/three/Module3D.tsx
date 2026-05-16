'use client'

import { useMemo } from 'react'
import type { ModuleInstance } from '@/stores/configurator'
import { modules } from '@mig/modules-schema'

const MATERIAL_COLORS = {
  container: '#FF6B35',
  timber: '#8B6F47',
  hybrid: '#4A90FF',
} as const

export function Module3D({ instance }: { instance: ModuleInstance }) {
  const def = useMemo(() => modules.find((m) => m.id === instance.moduleId), [instance.moduleId])
  if (!def) return null

  const color = MATERIAL_COLORS[instance.material]
  const w = instance.material === 'container' ? (def.area_m2 > 20 ? 12.2 : 6.1) : 5
  const h = 2.6
  const d = instance.material === 'container' ? 2.44 : 4

  return (
    <group position={instance.position} rotation={[0, instance.rotationY, 0]}>
      <mesh castShadow receiveShadow position={[0, h / 2, 0]}>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={color} roughness={0.6} metalness={instance.material === 'container' ? 0.4 : 0.05} />
      </mesh>
      {/* Connector markers (Phase 2 — wire to MIG-Connector lib) */}
    </group>
  )
}
