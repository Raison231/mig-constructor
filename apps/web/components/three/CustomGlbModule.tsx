'use client'

import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import type { ModuleInstance } from '@/stores/configurator'
import { useConfigurator } from '@/stores/configurator'
import { useCustomModules } from '@/stores/customModules'
import { blobUrlFromBase64, customModuleKey } from '@/lib/customGlbImport'
import { SelectionRing } from './SelectionRing'

const blobUrlCache = new Map<string, string>()

function stableBlobUrl(id: string, base64: string): string {
  const existing = blobUrlCache.get(id)
  if (existing) return existing
  const url = blobUrlFromBase64(base64)
  blobUrlCache.set(id, url)
  return url
}

export function CustomGlbModule({ instance }: { instance: ModuleInstance }) {
  const key = customModuleKey(instance.moduleId)
  const info = useCustomModules((s) => s.modules[key])
  const selectionId = useConfigurator((s) => s.selectionId)
  const select = useConfigurator((s) => s.select)
  const setDragging = useConfigurator((s) => s.setDragging)

  const isSelected = selectionId === instance.instanceId
  const rotationVec: [number, number, number] = [0, instance.rotationY, 0]

  if (!info) {
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
        <mesh>
          <boxGeometry args={[1.5, 1.5, 1.5]} />
          <meshStandardMaterial color="#FF6B6B" wireframe />
        </mesh>
        {isSelected && <SelectionRing w={1.5} d={1.5} />}
      </group>
    )
  }

  const url = stableBlobUrl(info.id, info.arrayBufferBase64)

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
      <CustomGlbContent url={url} />
      {isSelected && <SelectionRing w={Math.max(info.width, 1)} d={Math.max(info.depth, 1)} />}
    </group>
  )
}

function CustomGlbContent({ url }: { url: string }) {
  const gltf = useGLTF(url) as unknown as { scene: { clone: (recursive: boolean) => any } }
  const cloned = useMemo(() => gltf.scene.clone(true), [gltf.scene])
  return <primitive object={cloned} />
}
