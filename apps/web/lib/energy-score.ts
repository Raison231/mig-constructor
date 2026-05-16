import { modules as moduleCatalog } from '@mig/modules-schema'
import type { ModuleInstance } from '@/stores/configurator'

// Heuristic per-module annual energy consumption (kWh/year) by category.
const KWH_PER_M2_YEAR: Record<string, number> = {
  core: 120,
  wet: 180,
  leisure: 220,
  utility: 60,
  exterior: 20,
  roof: 80,
  cellar: 40,
}

// Water L/day per category
const WATER_L_DAY: Record<string, number> = {
  wet: 250,
  core: 60,
  leisure: 400,
  utility: 20,
  exterior: 80,
  roof: 0,
  cellar: 0,
}

// CO2 kg/m2 embodied by material
const CO2_PER_M2: Record<string, number> = {
  container: 180,
  timber: 60,
  hybrid: 120,
}

export type EnergyScore = {
  consumptionKwhYear: number
  solarKwhYear: number
  waterLDay: number
  co2EmbodiedKg: number
  autonomyPct: number
  hasWaterSource: boolean
  hasWaterStorage: boolean
  rating: 'A+' | 'A' | 'B' | 'C' | 'D'
}

export function calculateEnergyScore(instances: ModuleInstance[]): EnergyScore {
  let consumption = 0
  let solar = 0
  let water = 0
  let co2 = 0
  let hasWaterSource = false
  let hasWaterStorage = false

  for (const inst of instances) {
    const meta = moduleCatalog.find((m) => m.id === inst.moduleId)
    if (!meta) continue
    const cat = meta.category
    consumption += (KWH_PER_M2_YEAR[cat] ?? 80) * meta.area_m2
    water += WATER_L_DAY[cat] ?? 0
    co2 += (CO2_PER_M2[inst.material] ?? 100) * meta.area_m2

    if (inst.moduleId === 'solar-tower') solar += 4200
    if (inst.moduleId === 'carport') solar += 1800
    if (inst.moduleId === 'rooftop') solar += 800
    if (inst.moduleId === 'well-cap') hasWaterSource = true
    if (inst.moduleId === 'water-tank') hasWaterStorage = true
  }

  const autonomy = consumption > 0 ? Math.min(100, (solar / consumption) * 100) : 0
  const rating: EnergyScore['rating'] =
    autonomy >= 90 ? 'A+' :
    autonomy >= 60 ? 'A' :
    autonomy >= 35 ? 'B' :
    autonomy >= 15 ? 'C' : 'D'

  return {
    consumptionKwhYear: Math.round(consumption),
    solarKwhYear: Math.round(solar),
    waterLDay: Math.round(water),
    co2EmbodiedKg: Math.round(co2),
    autonomyPct: Math.round(autonomy),
    hasWaterSource,
    hasWaterStorage,
    rating,
  }
}
