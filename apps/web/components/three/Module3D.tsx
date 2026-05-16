'use client'

import { useMemo } from 'react'
import { modules } from '@mig/modules-schema'
import type { ModuleInstance } from '@/stores/configurator'
import { useConfigurator } from '@/stores/configurator'
import { moduleComponents } from './modules/registry'
import { moduleDims } from './modules/shared/dimensions'
import { ConnectorIndicators } from './modules/shared/ConnectorIndicators'
import { SelectionRing } from './SelectionRing'

export function Module3D({ instance }: { instance: ModuleInstance }) {
  const def = useMemo(() => modules.find((m) => m.id === instance.moduleId), [instance.moduleId])
  const selectionId = useConfigurator((s) => s.selectionId)
  const select = useConfigurator((s) => s.select)
  const setDragging = useConfigurator((s) => s.setDragging)

  if (!def) return null
  const Visual = moduleComponents[def.id]
  const { w, h, d } = moduleDims(def.area_m2, instance.material)
  const isSelected = selectionId === instance.instanceId
  const rotationVec: [number, number, number] = [0, instance.rotationY, 0]

  return (
    <group
      position={instance.position}
      rotation={rotationVec}
      onPointerDown={(e) => {
        e.stopPropagation()
        select(instance.instanceId)
        setDragging(instance.instanceId)
      }}
    >
      {Visual ? <Visual material={instance.material} w={w} h={h} d={d} /> : null}
      {isSelected && <SelectionRing w={w} d={d} />}
      {isSelected && <ConnectorIndicators sides={def.connectors} w={w} h={h} d={d} />}
    </group>
  )
}
