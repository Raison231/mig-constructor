'use client'

import { useMemo } from 'react'
import * as THREE from 'three'
import { useConfigurator } from '@/stores/configurator'
import { useThermal } from '@/stores/thermal'
import { computeThermal, heatLossColor } from '@/lib/thermal'
import { footprintsFromModules } from '@/lib/flora'

const HALO_Y = 0.04
const HALO_PADDING = 0.4

/**
 * Renders translucent colored halo planes above each module footprint when
 * Thermal Simulation is enabled. Color = per-m² heat loss intensity.
 */
export function ThermalHeatmap() {
  const enabled = useThermal((s) => s.enabled)
  const outdoorTempC = useThermal((s) => s.outdoorTempC)
  const indoorTargetC = useThermal((s) => s.indoorTargetC)
  const modules = useConfigurator((s) => s.modules)

  const halos = useMemo(() => {
    if (!enabled || modules.length === 0) return []
    const summary = computeThermal(modules, outdoorTempC, indoorTargetC)
    const footprints = footprintsFromModules(modules)
    return modules.map((m, i) => {
      const loss = summary.perModule[i]
      const fp = footprints[i]
      return {
        instanceId: m.instanceId,
        position: [m.position[0], HALO_Y, m.position[2]] as [number, number, number],
        rotationY: m.rotationY ?? 0,
        width: (fp?.width ?? 6) + HALO_PADDING * 2,
        depth: (fp?.depth ?? 3) + HALO_PADDING * 2,
        color: heatLossColor(loss?.wattsPerM2 ?? 0),
      }
    })
  }, [enabled, modules, outdoorTempC, indoorTargetC])

  if (!enabled) return null

  return (
    <group>
      {halos.map((h) => (
        <mesh
          key={h.instanceId}
          position={h.position}
          rotation={[-Math.PI / 2, 0, h.rotationY]}
        >
          <planeGeometry args={[h.width, h.depth]} />
          <meshBasicMaterial
            color={h.color}
            transparent
            opacity={0.55}
            depthWrite={false}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  )
}
