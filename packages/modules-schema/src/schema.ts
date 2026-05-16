import { z } from 'zod'

export const MaterialSchema = z.enum(['container', 'timber', 'hybrid'])
export type Material = z.infer<typeof MaterialSchema>

export const CategorySchema = z.enum([
  'core',
  'wet',
  'leisure',
  'utility',
  'roof',
  'cellar',
  'exterior',
])
export type Category = z.infer<typeof CategorySchema>

export const ConnectorSideSchema = z.enum(['north', 'south', 'east', 'west', 'top', 'bottom'])
export type ConnectorSide = z.infer<typeof ConnectorSideSchema>

export const PriceMatrixSchema = z.object({
  container: z.number().nullable(),
  timber: z.number().nullable(),
  hybrid: z.number().nullable(),
})
export type PriceMatrix = z.infer<typeof PriceMatrixSchema>

export const I18nNameSchema = z.object({
  ru: z.string(),
  en: z.string(),
  ka: z.string(),
})

export const ModuleSpecsSchema = z.object({
  power: z.string().optional(),
  water: z.boolean().optional(),
  sewage: z.boolean().optional(),
  heating: z.string().optional(),
})

export const ModuleSchema = z.object({
  id: z.string().min(1),
  name: I18nNameSchema,
  category: CategorySchema,
  materials: z.array(MaterialSchema).min(1),
  area_m2: z.number().positive(),
  connectors: z.array(ConnectorSideSchema).min(1),
  frequency_hz: z.number().optional(),
  description: z.string(),
  model_glb: z.string(),
  thumbnail: z.string(),
  price_usd: PriceMatrixSchema,
  specs: ModuleSpecsSchema,
})
export type Module = z.infer<typeof ModuleSchema>
