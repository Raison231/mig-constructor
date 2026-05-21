// OSM via Overpass API — fetch building footprints around a lat/lon center.
//
// We use the equirectangular approximation: accurate enough for the ~1km
// radius we ever request, and avoids pulling in proj4 / d3-geo.

import type { OsmBuilding } from '@/stores/osm'

const EARTH_R = 6378137 // WGS84 mean radius in meters
const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
] as const

/**
 * Project (lat, lon) to local meters around (lat0, lon0).
 * Result: [x = east, z = south] — so that increasing latitude maps to -z,
 * matching the way the rest of the scene treats +Z as toward the camera
 * with a default north-is-back convention.
 */
export function latLonToXZ(lat: number, lon: number, lat0: number, lon0: number): [number, number] {
  const dLat = ((lat - lat0) * Math.PI) / 180
  const dLon = ((lon - lon0) * Math.PI) / 180
  const x = dLon * Math.cos((lat0 * Math.PI) / 180) * EARTH_R
  const z = -dLat * EARTH_R
  return [x, z]
}

type OverpassWay = {
  id: number
  type: 'way' | 'node' | 'relation'
  geometry?: Array<{ lat: number; lon: number }>
  tags?: Record<string, string>
}

type OverpassResponse = {
  elements: OverpassWay[]
}

export function buildOverpassQuery(lat: number, lon: number, radius: number): string {
  return `[out:json][timeout:25];(way["building"](around:${radius},${lat},${lon}););out geom 250;`
}

async function postOverpass(query: string): Promise<OverpassResponse> {
  let lastErr: unknown
  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'data=' + encodeURIComponent(query),
      })
      if (!res.ok) {
        lastErr = new Error(`Overpass HTTP ${res.status} at ${endpoint}`)
        continue
      }
      return (await res.json()) as OverpassResponse
    } catch (e) {
      lastErr = e
      continue
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error('All Overpass endpoints failed')
}

/** Parse a single OSM way into an OsmBuilding (or null if not a valid polygon). */
export function parseBuilding(el: OverpassWay, centerLat: number, centerLon: number): OsmBuilding | null {
  if (el.type !== 'way' || !el.geometry || el.geometry.length < 3) return null
  const footprint: Array<[number, number]> = el.geometry.map((p) => latLonToXZ(p.lat, p.lon, centerLat, centerLon))
  const tags = el.tags || {}
  let height = 6
  let levels: number | undefined
  const heightTag = tags['height']
  const levelsTag = tags['building:levels']
  if (heightTag) {
    const h = parseFloat(heightTag)
    if (Number.isFinite(h) && h > 0) height = h
  } else if (levelsTag) {
    const lv = parseFloat(levelsTag)
    if (Number.isFinite(lv) && lv > 0) {
      levels = lv
      height = lv * 3.2
    }
  }
  // Skip degenerate buildings (tiny / probably parsing noise)
  if (footprint.length < 3) return null
  return { id: String(el.id), footprint, height, levels }
}

export async function fetchOsmBuildings(lat: number, lon: number, radius: number): Promise<OsmBuilding[]> {
  const query = buildOverpassQuery(lat, lon, radius)
  const json = await postOverpass(query)
  const out: OsmBuilding[] = []
  for (const el of json.elements || []) {
    const b = parseBuilding(el, lat, lon)
    if (b) out.push(b)
  }
  return out
}
