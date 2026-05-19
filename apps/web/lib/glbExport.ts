'use client'

import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'
import type { Object3D } from 'three'
import { downloadBytes } from './migFile'

export function exportSceneToGlb(scene: Object3D, filename = `mig-scene-${Date.now()}.glb`) {
  const exporter = new GLTFExporter()
  exporter.parse(
    scene,
    (result) => {
      if (result instanceof ArrayBuffer) {
        downloadBytes(new Uint8Array(result), filename, 'model/gltf-binary')
      } else {
        const json = JSON.stringify(result)
        const enc = new TextEncoder().encode(json)
        downloadBytes(enc, filename.replace(/\.glb$/, '.gltf'), 'model/gltf+json')
      }
    },
    (error) => {
      console.error('[GLB export]', error)
    },
    { binary: true, onlyVisible: true, truncateDrawRange: true },
  )
}
