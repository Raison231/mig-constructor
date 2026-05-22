/**
 * Thermal-loss math for mig-constructor.
 *
 * Q = U * A * ΔT, summed over walls + roof + floor.
 * U-values are SI W/(m²·K). Floor U is lower than walls to model insulation.
 */

import type { ModuleInstance } from '@/stores/configurator'
import { footprintsFromModules } from '@/lib/flora'

export type MaterialKey = 'container' | 'timber' | 'hybrid'

export const U_VALUES: Record<MaterialKey, { wall: number; roof: number; floor: number }> = {
  // Steel container: thin walls, awful thermal envelope without retrofit.
  container: { wall: 0.42, roof: 0.45, floor: 0.32 },
  // CLT / timber frame: best of the three.
  timber: { wall: 0.18, roof: 0.16, floor: 0.14 },
  // Hybrid (steel skeleton + insulated panels): middle ground.
  hybrid: { wall: 0.26, roof: 0.24, floor: 0.20 },
}

export const WALL_HEIGHT_M = 2.7

export type PerModuleLoss = {
  instanceId: string
  moduleId: string
  material: MaterialKey
  widthM: number
  depthM: number
  envelopeAreaM2: number
  watts: number
  wattsPerM2: number
}

export type ThermalSummary = {
  totalWatts: number
  totalKw: number
  perModule: PerModuleLoss[]
  perMaterial: Record<MaterialKey, number>
  deltaT: number
}

/**
 * Computes heat loss for the current scene.
 * Positive watts = energy leaving the heated indoor space (winter case).
 * Negative watts (when outdoor > indoor target) = gain (cooling load).
 */
export function computeThermal(
  modules: ModuleInstance[],
  outdoorTempC: number,
  indoorTargetC: number,
): ThermalSummary {
  const deltaT = indoorTargetC - outdoorTempC
  const footprints = footprintsFromModules(modules)
  const perModule: PerModuleLoss[] = []
  const perMaterial: Record<MaterialKey, number> = { container: 0, timber: 0, hybrid: 0 }
  let totalWatts = 0

  for (let i = 0; i < modules.length; i += 1) {
    const m = modules[i]
    const fp = footprints[i]
    const widthM = fp?.width ?? 6
    const depthM = fp?.depth ?? 3
    const material = (m.material as MaterialKey) ?? 'container'
    const u = U_VALUES[material] ?? U_VALUES.container

    const floorArea = widthM * depthM
    const roofArea = widthM * depthM
    const wallArea = 2 * (widthM + depthM) * WALL_HEIGHT_M

    const wallLoss = u.wall * wallArea * deltaT
    const roofLoss = u.roof * roofArea * deltaT
    const floorLoss = u.floor * floorArea * (deltaT * 0.6) // ground attenuates dT

    const watts = wallLoss + roofLoss + floorLoss
    const envelopeAreaM2 = floorArea + roofArea + wallArea
    const wattsPerM2 = envelopeAreaM2 > 0 ? watts / envelopeAreaM2 : 0

    perModule.push({
      instanceId: m.instanceId,
      moduleId: m.moduleId,
      material,
      widthM,
      depthM,
      envelopeAreaM2,
      watts,
      wattsPerM2,
    })

    perMaterial[material] += watts
    totalWatts += watts
  }

  return {
    totalWatts,
    totalKw: totalWatts / 1000,
    perModule,
    perMaterial,
    deltaT,
  }
}

/**
 * Maps W/m² envelope loss to a heatmap color (HSL string).
 * Cold blue = great insulation. Hot red = bleeding heat.
 * Domain: clamp |watts/m²| to [0..18] then map to hue 220 (blue) → 0 (red).
 */
export function heatLossColor(wattsPerM2: number): string {
  const v = Math.min(18, Math.max(0, Math.abs(wattsPerM2))) / 18
  const hue = 220 * (1 - v) // 220 cold → 0 hot
  const sat = 80
  const light = 55 - v * 12
  return `hsl(${hue.toFixed(0)}, ${sat}%, ${light.toFixed(0)}%)`
}
