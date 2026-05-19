'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { MigBundle } from '@/lib/migFile'
import { imageBytesToDataUrl } from '@/lib/migFile'

const STORAGE_KEY = 'mig-land-v1'

export type LandState = {
  enabled: boolean
  imageDataUrl: string | null
  imageMime: string | null
  widthMeters: number
  rotationDeg: number
  offsetX: number
  offsetZ: number
  opacity: number
  lat: number | null
  lon: number | null
  heightmap: Float32Array | null
  heightmapSize: number
  heightmapScale: number

  setEnabled: (v: boolean) => void
  setImage: (dataUrl: string | null, mime: string | null) => void
  setWidthMeters: (v: number) => void
  setRotationDeg: (v: number) => void
  setOffset: (x: number, z: number) => void
  setOpacity: (v: number) => void
  setLatLon: (lat: number | null, lon: number | null) => void
  setHeightmap: (h: Float32Array | null, size: number) => void
  setHeightmapScale: (v: number) => void
  reset: () => void
  hydrateFromBundle: (b: MigBundle) => void
}

const initial = {
  enabled: false,
  imageDataUrl: null as string | null,
  imageMime: null as string | null,
  widthMeters: 30,
  rotationDeg: 0,
  offsetX: 0,
  offsetZ: 0,
  opacity: 0.95,
  lat: null as number | null,
  lon: null as number | null,
  heightmap: null as Float32Array | null,
  heightmapSize: 0,
  heightmapScale: 1,
}

export const useLand = create<LandState>()(
  persist(
    (set) => ({
      ...initial,
      setEnabled: (v) => set({ enabled: v }),
      setImage: (dataUrl, mime) => set({ imageDataUrl: dataUrl, imageMime: mime, enabled: dataUrl ? true : false }),
      setWidthMeters: (v) => set({ widthMeters: Math.max(1, v) }),
      setRotationDeg: (v) => set({ rotationDeg: v }),
      setOffset: (x, z) => set({ offsetX: x, offsetZ: z }),
      setOpacity: (v) => set({ opacity: Math.max(0, Math.min(1, v)) }),
      setLatLon: (lat, lon) => set({ lat, lon }),
      setHeightmap: (h, size) => set({ heightmap: h, heightmapSize: size }),
      setHeightmapScale: (v) => set({ heightmapScale: Math.max(0.05, v) }),
      reset: () => set({ ...initial }),
      hydrateFromBundle: (b) => {
        const land = b.scene.land
        const img = b.landImage && b.landImageMime ? imageBytesToDataUrl(b.landImage, b.landImageMime) : null
        const hm = b.heightmap ?? null
        const size = land.hasHeightmap ? land.heightmapSize : 0
        set({
          enabled: !!img || !!hm,
          imageDataUrl: img,
          imageMime: img ? (b.landImageMime ?? 'image/png') : null,
          widthMeters: land.widthMeters,
          rotationDeg: land.rotationDeg,
          offsetX: land.offsetX,
          offsetZ: land.offsetZ,
          lat: land.lat,
          lon: land.lon,
          heightmap: hm,
          heightmapSize: size,
          heightmapScale: land.heightmapScale,
        })
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => {
        const safe: Storage = {
          length: 0,
          clear: () => {},
          getItem: (k) => { try { return localStorage.getItem(k) } catch { return null } },
          setItem: (k, v) => { try { localStorage.setItem(k, v) } catch { /* quota */ } },
          removeItem: (k) => { try { localStorage.removeItem(k) } catch { /* noop */ } },
          key: (i) => { try { return localStorage.key(i) } catch { return null } },
        }
        return safe
      }),
      partialize: (s) => ({
        enabled: s.enabled,
        imageDataUrl: s.imageDataUrl,
        imageMime: s.imageMime,
        widthMeters: s.widthMeters,
        rotationDeg: s.rotationDeg,
        offsetX: s.offsetX,
        offsetZ: s.offsetZ,
        opacity: s.opacity,
        lat: s.lat,
        lon: s.lon,
        heightmapScale: s.heightmapScale,
      }),
    },
  ),
)
