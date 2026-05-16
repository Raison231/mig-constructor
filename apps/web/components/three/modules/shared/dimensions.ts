import type { Material } from '@mig/modules-schema'

export function moduleDims(areaM2: number, material: Material) {
  if (material === 'container') {
    const d = 2.44
    const h = 2.59
    const w = areaM2 > 20 ? 12.2 : 6.06
    return { w, h, d }
  }
  const side = Math.sqrt(Math.max(areaM2, 6))
  return { w: side, h: 2.7, d: side }
}
