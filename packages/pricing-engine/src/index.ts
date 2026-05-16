import { getModule, type Material } from '@mig/modules-schema'

export type LayoutItem = {
  moduleId: string
  material: Material
}

export type PriceBreakdown = {
  modulesCost: number
  deliveryCost: number
  earthworksCost: number
  assemblyCost: number
  totalAreaM2: number
  weeks: number
  total: number
}

const DELIVERY_PER_MODULE_GE = 350 // USD, Tbilisi base
const EARTHWORKS_PER_M2 = 80
const ASSEMBLY_PER_MODULE = 1200
const PRODUCTION_WEEKS_PER_MODULE = 0.7

export function calculatePrice(layout: ReadonlyArray<LayoutItem>): PriceBreakdown {
  let modulesCost = 0
  let totalAreaM2 = 0

  for (const item of layout) {
    const mod = getModule(item.moduleId)
    if (!mod) continue
    const price = mod.price_usd[item.material]
    if (price == null) continue
    modulesCost += price
    totalAreaM2 += mod.area_m2
  }

  const deliveryCost = layout.length * DELIVERY_PER_MODULE_GE
  const earthworksCost = Math.round(totalAreaM2 * EARTHWORKS_PER_M2)
  const assemblyCost = layout.length * ASSEMBLY_PER_MODULE
  const weeks = Math.max(4, Math.ceil(layout.length * PRODUCTION_WEEKS_PER_MODULE + 3))
  const total = modulesCost + deliveryCost + earthworksCost + assemblyCost

  return { modulesCost, deliveryCost, earthworksCost, assemblyCost, totalAreaM2, weeks, total }
}
