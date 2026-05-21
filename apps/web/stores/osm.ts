import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type OsmBuilding = {
  /** Footprint in local meters relative to lot center. Each point is [x, z]. */
  footprint: Array<[number, number]>
  /** Building height in meters. */
  height: number
  /** Optional level count if known (used for UI / future shading). */
  levels?: number
  /** OSM way id for stable keys. */
  id?: string
}

type OsmState = {
  enabled: boolean
  radiusMeters: number
  fetching: boolean
  error: string | null
  buildings: OsmBuilding[]
  fetchedAt: number | null
  centerLat: number | null
  centerLon: number | null
  setEnabled: (v: boolean) => void
  setRadiusMeters: (n: number) => void
  fetchAround: (lat: number, lon: number, radius?: number) => Promise<void>
  clear: () => void
}

export const useOsm = create<OsmState>()(
  persist(
    (set, get) => ({
      enabled: false,
      radiusMeters: 200,
      fetching: false,
      error: null,
      buildings: [],
      fetchedAt: null,
      centerLat: null,
      centerLon: null,
      setEnabled: (enabled) => set({ enabled }),
      setRadiusMeters: (radiusMeters) => set({ radiusMeters: Math.max(50, Math.min(800, Math.round(radiusMeters))) }),
      fetchAround: async (lat, lon, radius) => {
        const r = radius ?? get().radiusMeters
        set({ fetching: true, error: null })
        try {
          const { fetchOsmBuildings } = await import('@/lib/osm')
          const buildings = await fetchOsmBuildings(lat, lon, r)
          set({
            buildings,
            fetching: false,
            fetchedAt: Date.now(),
            centerLat: lat,
            centerLon: lon,
          })
        } catch (e) {
          const msg = e instanceof Error ? e.message : 'OSM fetch failed'
          set({ fetching: false, error: msg })
        }
      },
      clear: () => set({ buildings: [], fetchedAt: null, centerLat: null, centerLon: null, error: null }),
    }),
    {
      name: 'mig-osm-v1',
      storage: createJSONStorage(() => (typeof window === 'undefined' ? ({} as Storage) : window.localStorage)),
      partialize: (s) => ({
        enabled: s.enabled,
        radiusMeters: s.radiusMeters,
        buildings: s.buildings,
        fetchedAt: s.fetchedAt,
        centerLat: s.centerLat,
        centerLon: s.centerLon,
      }),
    },
  ),
)
