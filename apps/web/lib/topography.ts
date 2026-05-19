'use client'

const OPEN_ELEVATION_URL = 'https://api.open-elevation.com/api/v1/lookup'

export type HeightmapResult = {
  size: number
  sizeMeters: number
  heights: Float32Array
  minHeight: number
  maxHeight: number
  lat: number
  lon: number
}

const EARTH_RADIUS_M = 6371000

function metersToDegLat(m: number) {
  return (m / EARTH_RADIUS_M) * (180 / Math.PI)
}
function metersToDegLon(m: number, lat: number) {
  return (m / (EARTH_RADIUS_M * Math.cos((lat * Math.PI) / 180))) * (180 / Math.PI)
}

export async function fetchHeightmap(
  lat: number,
  lon: number,
  sizeMeters = 200,
  gridSize = 32,
  signal?: AbortSignal,
): Promise<HeightmapResult> {
  const half = sizeMeters / 2
  const stepLat = metersToDegLat(sizeMeters / (gridSize - 1))
  const stepLon = metersToDegLon(sizeMeters / (gridSize - 1), lat)
  const lat0 = lat - metersToDegLat(half)
  const lon0 = lon - metersToDegLon(half, lat)

  const locations: { latitude: number; longitude: number }[] = []
  for (let j = 0; j < gridSize; j++) {
    for (let i = 0; i < gridSize; i++) {
      locations.push({ latitude: lat0 + j * stepLat, longitude: lon0 + i * stepLon })
    }
  }

  const res = await fetch(OPEN_ELEVATION_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ locations }),
    signal,
  })
  if (!res.ok) throw new Error(`open-elevation HTTP ${res.status}`)
  const data = (await res.json()) as { results: { elevation: number }[] }

  const heights = new Float32Array(gridSize * gridSize)
  let min = Infinity
  let max = -Infinity
  for (let i = 0; i < heights.length; i++) {
    const h = data.results[i]?.elevation ?? 0
    heights[i] = h
    if (h < min) min = h
    if (h > max) max = h
  }
  const baseline = (
    heights[0] +
    heights[gridSize - 1] +
    heights[heights.length - gridSize] +
    heights[heights.length - 1]
  ) / 4
  for (let i = 0; i < heights.length; i++) heights[i] -= baseline

  return {
    size: gridSize,
    sizeMeters,
    heights,
    minHeight: min - baseline,
    maxHeight: max - baseline,
    lat,
    lon,
  }
}
