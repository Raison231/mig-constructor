'use client'

import { zip, unzip, strToU8, strFromU8 } from 'fflate'
import type { ModuleInstance } from '@/stores/configurator'

export const MIG_FILE_VERSION = 1
export const MIG_FILE_EXT = '.mig'

export type MigWorldSnapshot = {
  hour: number
  weather: string
  site: string
  cameraMode: string
}

export type MigLandSnapshot = {
  widthMeters: number
  rotationDeg: number
  offsetX: number
  offsetZ: number
  lat: number | null
  lon: number | null
  hasImage: boolean
  hasHeightmap: boolean
  heightmapSize: number
  heightmapScale: number
}

export type MigFile = {
  version: number
  createdAt: string
  app: 'mig-constructor'
  modules: ModuleInstance[]
  world: MigWorldSnapshot
  land: MigLandSnapshot
}

export type MigBundle = {
  scene: MigFile
  landImage?: Uint8Array
  landImageMime?: string
  heightmap?: Float32Array
}

function zipAsync(files: Record<string, Uint8Array>): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    zip(files, { level: 6 }, (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })
}

function unzipAsync(data: Uint8Array): Promise<Record<string, Uint8Array>> {
  return new Promise((resolve, reject) => {
    unzip(data, (err, out) => {
      if (err) reject(err)
      else resolve(out)
    })
  })
}

function dataUrlToBytes(dataUrl: string): { bytes: Uint8Array; mime: string } {
  const m = /^data:([^;]+);base64,(.+)$/.exec(dataUrl)
  if (!m) return { bytes: new Uint8Array(), mime: 'application/octet-stream' }
  const mime = m[1]
  const b64 = m[2]
  const binStr = atob(b64)
  const bytes = new Uint8Array(binStr.length)
  for (let i = 0; i < binStr.length; i++) bytes[i] = binStr.charCodeAt(i)
  return { bytes, mime }
}

function bytesToDataUrl(bytes: Uint8Array, mime: string): string {
  let binStr = ''
  const chunk = 0x8000
  for (let i = 0; i < bytes.length; i += chunk) {
    const slice = bytes.subarray(i, Math.min(i + chunk, bytes.length))
    binStr += String.fromCharCode.apply(null, slice as unknown as number[])
  }
  return `data:${mime};base64,${btoa(binStr)}`
}

function f32ToBytes(arr: Float32Array): Uint8Array {
  return new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength)
}

function bytesToF32(bytes: Uint8Array): Float32Array {
  const buf = new ArrayBuffer(bytes.byteLength)
  new Uint8Array(buf).set(bytes)
  return new Float32Array(buf)
}

export async function encodeMigFile(bundle: MigBundle): Promise<Uint8Array> {
  const files: Record<string, Uint8Array> = {
    'scene.json': strToU8(JSON.stringify(bundle.scene, null, 2)),
    'meta.json': strToU8(JSON.stringify({
      version: MIG_FILE_VERSION,
      createdAt: bundle.scene.createdAt,
      app: 'mig-constructor',
    }, null, 2)),
  }
  if (bundle.landImage && bundle.landImage.length > 0) {
    const ext = bundle.landImageMime === 'image/jpeg' ? 'jpg' : 'png'
    files[`land.${ext}`] = bundle.landImage
  }
  if (bundle.heightmap && bundle.heightmap.length > 0) {
    files['heightmap.bin'] = f32ToBytes(bundle.heightmap)
  }
  return zipAsync(files)
}

export async function decodeMigFile(data: Uint8Array): Promise<MigBundle> {
  const files = await unzipAsync(data)
  const sceneRaw = files['scene.json']
  if (!sceneRaw) throw new Error('Invalid .mig — scene.json missing')
  const scene = JSON.parse(strFromU8(sceneRaw)) as MigFile
  if (scene.app !== 'mig-constructor') throw new Error('Not a mig-constructor file')

  let landImage: Uint8Array | undefined
  let landImageMime: string | undefined
  if (files['land.png']) { landImage = files['land.png']; landImageMime = 'image/png' }
  else if (files['land.jpg']) { landImage = files['land.jpg']; landImageMime = 'image/jpeg' }

  let heightmap: Float32Array | undefined
  if (files['heightmap.bin']) heightmap = bytesToF32(files['heightmap.bin'])

  return { scene, landImage, landImageMime, heightmap }
}

export function downloadBytes(bytes: Uint8Array, filename: string, mime = 'application/zip') {
  const blob = new Blob([new Uint8Array(bytes)], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export async function saveMigFile(bytes: Uint8Array, suggestedName = `mig-scene-${Date.now()}.mig`) {
  const w = window as unknown as { showSaveFilePicker?: (opts: unknown) => Promise<FileSystemFileHandle> }
  if (w.showSaveFilePicker) {
    try {
      const handle = await w.showSaveFilePicker({
        suggestedName,
        types: [{ description: 'MIG Scene', accept: { 'application/zip': ['.mig'] } }],
      })
      const writable = await (handle as unknown as { createWritable: () => Promise<{ write: (b: Uint8Array) => Promise<void>; close: () => Promise<void> }> }).createWritable()
      await writable.write(bytes)
      await writable.close()
      return
    } catch (e) {
      const err = e as { name?: string }
      if (err?.name === 'AbortError') return
    }
  }
  downloadBytes(bytes, suggestedName)
}

export async function pickMigFile(): Promise<Uint8Array | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.mig,application/zip'
    input.onchange = async () => {
      const f = input.files?.[0]
      if (!f) return resolve(null)
      const ab = await f.arrayBuffer()
      resolve(new Uint8Array(ab))
    }
    input.click()
  })
}

export function imageDataUrlToBytes(dataUrl: string) { return dataUrlToBytes(dataUrl) }
export function imageBytesToDataUrl(bytes: Uint8Array, mime: string) { return bytesToDataUrl(bytes, mime) }
