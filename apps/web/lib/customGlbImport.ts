'use client'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as THREE from 'three'

export type CustomGlbInfo = {
  id: string
  name: string
  arrayBufferBase64: string
  width: number
  height: number
  depth: number
  sizeBytes: number
  addedAt: string
}

export const CUSTOM_MODULE_PREFIX = 'custom:'
export const CUSTOM_MODULES_STORAGE_KEY = 'mig-custom-modules-v1'

export function isCustomModuleId(id: string): boolean {
  return id.startsWith(CUSTOM_MODULE_PREFIX)
}

export function customModuleKey(id: string): string {
  return id.startsWith(CUSTOM_MODULE_PREFIX) ? id.slice(CUSTOM_MODULE_PREFIX.length) : id
}

export function makeCustomModuleId(key: string): string {
  return key.startsWith(CUSTOM_MODULE_PREFIX) ? key : CUSTOM_MODULE_PREFIX + key
}

export function bytesToBase64(bytes: Uint8Array): string {
  let binStr = ''
  const chunk = 0x8000
  for (let i = 0; i < bytes.length; i += chunk) {
    const slice = bytes.subarray(i, Math.min(i + chunk, bytes.length))
    binStr += String.fromCharCode.apply(null, slice as unknown as number[])
  }
  return btoa(binStr)
}

export function base64ToBytes(b64: string): Uint8Array {
  const binStr = atob(b64)
  const bytes = new Uint8Array(binStr.length)
  for (let i = 0; i < binStr.length; i++) bytes[i] = binStr.charCodeAt(i)
  return bytes
}

export function blobUrlFromBase64(b64: string, mime = 'model/gltf-binary'): string {
  const bytes = base64ToBytes(b64)
  const blob = new Blob([new Uint8Array(bytes)], { type: mime })
  return URL.createObjectURL(blob)
}

export async function readGlbFile(file: File): Promise<CustomGlbInfo> {
  const ab = await file.arrayBuffer()
  const bytes = new Uint8Array(ab)
  const loader = new GLTFLoader()
  const gltf = await new Promise<{ scene: THREE.Group }>((resolve, reject) => {
    loader.parse(ab.slice(0), '', (g) => resolve(g as { scene: THREE.Group }), (e) => reject(e))
  })
  const box = new THREE.Box3().setFromObject(gltf.scene)
  const size = new THREE.Vector3()
  box.getSize(size)
  const id = `custom-${Date.now()}-${Math.floor(Math.random() * 10000)}`
  const baseName = file.name.replace(/\.(glb|gltf)$/i, '') || 'GLB Module'
  return {
    id,
    name: baseName,
    arrayBufferBase64: bytesToBase64(bytes),
    width: Math.max(0.5, isFinite(size.x) ? size.x : 1),
    height: Math.max(0.5, isFinite(size.y) ? size.y : 1),
    depth: Math.max(0.5, isFinite(size.z) ? size.z : 1),
    sizeBytes: bytes.byteLength,
    addedAt: new Date().toISOString(),
  }
}

export async function pickGlbFile(): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.glb,.gltf,model/gltf-binary,model/gltf+json'
    input.onchange = () => {
      const f = input.files?.[0] ?? null
      resolve(f)
    }
    input.click()
  })
}

export function humanBytes(n: number): string {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / (1024 * 1024)).toFixed(1)} MB`
}
