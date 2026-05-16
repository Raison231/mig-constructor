import { modules } from '@mig/modules-schema'
import type { ModuleInstance } from '@/stores/configurator'

export type EnergyScore = {
  rating: 'A+' | 'A' | 'B' | 'C' | 'D'
  consumptionKwhYear: number
  solarKwhYear: number
  waterLDay: number
  co2EmbodiedKg: number
  autonomyPct: number     // 0..100, solar / consumption
  hasWaterSource: boolean
}

// Per-module heuristics (kWh/year, water L/day, CO2 kg embodied) by id.
// Solar generation: SolarTower 5500, Carport 3500 kWh/year typical for Georgia.
const SOLAR_GEN: Record<string, number> = {
  'solar-tower': 5500,
  'carport': 3500,
}

const WATER_SOURCE_IDS = new Set(['well-cap', 'water-tank'])

// Heating/cooling/lighting/appliances annual kWh per module type
const CONSUMPTION: Record<string, number> = {
  'hub-core':        2400,
  'sleep':           1200,
  'sleep-loft':      1500,
  'bathroom':        1800,
  'kitchen':         2800,
  'workshop':        3200,
  'greenhouse':      1600,
  'sauna':           2200,
  'garage':          1400,
  'observation-deck': 600,
  'glass-bridge':    400,
  'terrace-roof':    300,
  'carport':         200,
  'well-cap':        300,
  'water-tank':      100,
  'solar-tower':     150,
}

// Embodied CO2 kg per material per m2 (rough industry averages)
const CO2_PER_M2: Record<string, number> = {
  container: 320,
  timber:    180,
  hybrid:    240,
}

const WATER_L_DAY: Record<string, number> = {
  'well-cap':   1500,
  'water-tank': 800,
}

export function calculateEnergyScore(instances: ModuleInstance[]): EnergyScore {
  let consumption = 0
  let solar = 0
  let waterL = 0
  let co2 = 0
  let hasWaterSource = false

  for (const inst of instances) {
    const m = modules.find((x) => x.id === inst.moduleId)
    if (!m) continue
    consumption += CONSUMPTION[m.id] ?? 1000
    solar       += SOLAR_GEN[m.id] ?? 0
    waterL      += WATER_L_DAY[m.id] ?? 0
    co2         += (CO2_PER_M2[inst.material] ?? 200) * m.area_m2
    if (WATER_SOURCE_IDS.has(m.id)) hasWaterSource = true
  }

  const autonomyPct = consumption > 0 ? Math.min(100, Math.round((solar / consumption) * 100)) : 0
  const rating = pickRating(autonomyPct, hasWaterSource, co2, consumption)

  return {
    rating,
    consumptionKwhYear: Math.round(consumption),
    solarKwhYear: Math.round(solar),
    waterLDay: Math.round(waterL),
    co2EmbodiedKg: Math.round(co2),
    autonomyPct,
    hasWaterSource,
  }
}

function pickRating(
  autonomy: number,
  hasWater: boolean,
  co2: number,
  consumption: number,
): EnergyScore['rating'] {
  const co2PerKwh = consumption > 0 ? co2 / consumption : 0
  if (autonomy >= 80 && hasWater && co2PerKwh < 4)  return 'A+'
  if (autonomy >= 60 && hasWater)                   return 'A'
  if (autonomy >= 40)                                return 'B'
  if (autonomy >= 20)                                return 'C'
  return 'D'
}
