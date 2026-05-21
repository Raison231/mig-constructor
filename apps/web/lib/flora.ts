// FLORA SYSTEM — Instanced trees with Poisson-disk distribution.
//
// Pure math + data, no Three.js dependency. The Three.js component consumes
// buildForest() to fill InstancedMesh matrices.

import type { BiomeId, SpeciesId } from '@/stores/flora'
import type { ModuleInstance } from '@/stores/configurator'

export interface SpeciesDef {
  id: SpeciesId
  emoji: string
  label: string
  trunkHeight: number      // meters
  trunkRadius: number
  trunkColor: string
  crownHeight: number
  crownRadius: number
  crownColor: string
  // crown geometry kind
  crownKind: 'cone' | 'sphere'
  // vertical sway response (1.0 normal)
  flex: number
}

export const SPECIES: Record<SpeciesId, SpeciesDef> = {
  pine:    { id: 'pine',    emoji: '🌲', label: 'Сосна',    trunkHeight: 4.5, trunkRadius: 0.18, trunkColor: '#5a3a22', crownHeight: 5.0, crownRadius: 1.3, crownColor: '#2f6b3a', crownKind: 'cone',   flex: 0.9 },
  birch:   { id: 'birch',   emoji: '🌳', label: 'Берёза',   trunkHeight: 5.0, trunkRadius: 0.12, trunkColor: '#e8e3d3', crownHeight: 3.0, crownRadius: 1.5, crownColor: '#7fb069', crownKind: 'sphere', flex: 1.4 },
  oak:     { id: 'oak',     emoji: '🌳', label: 'Дуб',      trunkHeight: 3.8, trunkRadius: 0.28, trunkColor: '#6a4a2c', crownHeight: 3.6, crownRadius: 2.4, crownColor: '#3d7a44', crownKind: 'sphere', flex: 0.7 },
  spruce:  { id: 'spruce',  emoji: '🌲', label: 'Ель',      trunkHeight: 4.0, trunkRadius: 0.16, trunkColor: '#4a2f1c', crownHeight: 6.5, crownRadius: 1.6, crownColor: '#23532d', crownKind: 'cone',   flex: 1.0 },
  cypress: { id: 'cypress', emoji: '🌲', label: 'Кипарис',  trunkHeight: 2.5, trunkRadius: 0.14, trunkColor: '#574437', crownHeight: 7.5, crownRadius: 0.9, crownColor: '#345a3a', crownKind: 'cone',   flex: 1.1 },
  olive:   { id: 'olive',   emoji: '🌳', label: 'Олива',    trunkHeight: 2.2, trunkRadius: 0.16, trunkColor: '#6e5a44', crownHeight: 2.4, crownRadius: 1.6, crownColor: '#8aa46a', crownKind: 'sphere', flex: 1.2 },
}

export interface BiomeDef {
  id: BiomeId
  emoji: string
  label: string
  description: string
  // species -> relative weight; missing means 0
  mix: Partial<Record<SpeciesId, number>>
}

export const BIOMES: Record<BiomeId, BiomeDef> = {
  forest:        { id: 'forest',        emoji: '🌲', label: 'Лес',         description: 'Дуб, берёза, сосна, ель', mix: { oak: 35, birch: 30, pine: 25, spruce: 10 } },
  taiga:         { id: 'taiga',         emoji: '❄️', label: 'Тайга',       description: 'Сосна, ель, берёза',     mix: { pine: 50, spruce: 35, birch: 15 } },
  mediterranean: { id: 'mediterranean', emoji: '🌿', label: 'Средиземноморье', description: 'Олива, кипарис, сосна',  mix: { olive: 40, cypress: 35, pine: 25 } },
  subtropical:   { id: 'subtropical',   emoji: '🌴', label: 'Субтропики', description: 'Дуб, кипарис, олива',   mix: { oak: 40, cypress: 30, olive: 30 } },
  meadow:        { id: 'meadow',        emoji: '🌾', label: 'Луг',          description: 'Редкие берёзы и дубы',   mix: { birch: 60, oak: 25, pine: 15 } },
}

// mulberry32 — fast deterministic 32-bit PRNG.
export function mulberry32(seed: number) {
  let s = seed >>> 0
  return function rand() {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export interface Point2 { x: number; z: number }

// Bridson Poisson-disk sampling in a disk of given radius around (cx, cz).
export function poissonDiskInDisk(
  cx: number,
  cz: number,
  radius: number,
  minDist: number,
  rand: () => number,
  k = 24,
): Point2[] {
  const cellSize = minDist / Math.SQRT2
  const gridSize = Math.ceil((radius * 2) / cellSize) + 2
  const grid: Array<Point2 | null> = new Array(gridSize * gridSize).fill(null)
  const points: Point2[] = []
  const active: Point2[] = []
  const minX = cx - radius
  const minZ = cz - radius

  function gridIdx(p: Point2) {
    const ix = Math.floor((p.x - minX) / cellSize)
    const iz = Math.floor((p.z - minZ) / cellSize)
    return { ix, iz, k: iz * gridSize + ix }
  }

  function fits(p: Point2): boolean {
    const dx = p.x - cx, dz = p.z - cz
    if (dx * dx + dz * dz > radius * radius) return false
    const { ix, iz } = gridIdx(p)
    for (let oz = -2; oz <= 2; oz++) {
      for (let ox = -2; ox <= 2; ox++) {
        const gx = ix + ox, gz = iz + oz
        if (gx < 0 || gz < 0 || gx >= gridSize || gz >= gridSize) continue
        const n = grid[gz * gridSize + gx]
        if (!n) continue
        const ddx = n.x - p.x, ddz = n.z - p.z
        if (ddx * ddx + ddz * ddz < minDist * minDist) return false
      }
    }
    return true
  }

  // initial point at center
  const first = { x: cx, z: cz }
  points.push(first)
  active.push(first)
  grid[gridIdx(first).k] = first

  while (active.length > 0 && points.length < 8000) {
    const i = Math.floor(rand() * active.length)
    const p = active[i]
    let placed = false
    for (let tries = 0; tries < k; tries++) {
      const r = minDist * (1 + rand())
      const a = rand() * Math.PI * 2
      const cand: Point2 = { x: p.x + Math.cos(a) * r, z: p.z + Math.sin(a) * r }
      if (fits(cand)) {
        points.push(cand)
        active.push(cand)
        grid[gridIdx(cand).k] = cand
        placed = true
        break
      }
    }
    if (!placed) active.splice(i, 1)
  }

  return points
}

export interface ModuleFootprint {
  x: number
  z: number
  halfX: number
  halfZ: number
}

export function footprintsFromModules(modules: ModuleInstance[], buffer = 1.5): ModuleFootprint[] {
  return modules.map((m) => {
    const w = (m.width ?? 6) / 2 + buffer
    const d = (m.depth ?? 3) / 2 + buffer
    return { x: m.position?.[0] ?? 0, z: m.position?.[2] ?? 0, halfX: w, halfZ: d }
  })
}

export function pointInFootprint(p: Point2, fp: ModuleFootprint): boolean {
  return Math.abs(p.x - fp.x) < fp.halfX && Math.abs(p.z - fp.z) < fp.halfZ
}

export function pickSpecies(biome: BiomeDef, enabled: Record<SpeciesId, boolean>, rand: () => number): SpeciesId | null {
  const entries = Object.entries(biome.mix).filter(([s, w]) => enabled[s as SpeciesId] && (w ?? 0) > 0) as Array<[SpeciesId, number]>
  if (entries.length === 0) return null
  const total = entries.reduce((acc, [, w]) => acc + w, 0)
  let r = rand() * total
  for (const [s, w] of entries) {
    r -= w
    if (r <= 0) return s
  }
  return entries[entries.length - 1][0]
}

export interface ForestInstance {
  species: SpeciesId
  x: number
  z: number
  rotY: number
  scale: number
}

export interface BuildForestArgs {
  enabled: boolean
  biome: BiomeId
  density: number
  radius: number
  centerX: number
  centerZ: number
  seed: number
  regenSalt: number
  minSpacing: number
  speciesEnabled: Record<SpeciesId, boolean>
  modules: ModuleInstance[]
}

export function buildForest(args: BuildForestArgs): Record<SpeciesId, ForestInstance[]> {
  const result: Record<SpeciesId, ForestInstance[]> = {
    pine: [], birch: [], oak: [], spruce: [], cypress: [], olive: [],
  }
  if (!args.enabled || args.density <= 0) return result

  const biome = BIOMES[args.biome]
  const rand = mulberry32(args.seed ^ (args.regenSalt * 2654435761))

  // Effective spacing scales inversely with density. At density=1 we use raw
  // minSpacing; at density 0.1 we sparse it x3 for a meadow-like look.
  const eff = args.minSpacing * (1 / Math.max(0.15, args.density))
  const points = poissonDiskInDisk(args.centerX, args.centerZ, args.radius, eff, rand)
  const footprints = footprintsFromModules(args.modules, 1.5)

  for (const p of points) {
    let blocked = false
    for (const fp of footprints) {
      if (pointInFootprint(p, fp)) { blocked = true; break }
    }
    if (blocked) continue
    const species = pickSpecies(biome, args.speciesEnabled, rand)
    if (!species) continue
    result[species].push({
      species,
      x: p.x,
      z: p.z,
      rotY: rand() * Math.PI * 2,
      scale: 0.8 + rand() * 0.5,
    })
  }

  return result
}

export function totalTreeCount(forest: Record<SpeciesId, ForestInstance[]>): number {
  let n = 0
  for (const s of Object.keys(forest) as SpeciesId[]) n += forest[s].length
  return n
}
