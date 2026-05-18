import type { ModuleInstance } from '@mig/modules-schema'

export type TemplatePresetId =
  | 'studio'
  | 'family'
  | 'office'
  | 'workshop'
  | 'glamping'
  | 'hub'

export interface TemplatePreset {
  id: TemplatePresetId
  nameRu: string
  nameEn: string
  nameKa: string
  descriptionRu: string
  descriptionEn: string
  icon: string
  instances: ModuleInstance[]
}

// Helper to build instance
const inst = (
  idx: number,
  moduleId: string,
  material: 'container' | 'timber' | 'hybrid',
  x: number,
  z: number,
  rotationY = 0,
): ModuleInstance => ({
  instanceId: `preset-${moduleId}-${idx}`,
  moduleId,
  material,
  position: [x, 0, z],
  rotationY,
})

export const TEMPLATE_PRESETS: TemplatePreset[] = [
  {
    id: 'studio',
    nameRu: 'Студия',
    nameEn: 'Studio',
    nameKa: 'სტუდია',
    descriptionRu: 'Минимум: жилой блок + санузел + терраса',
    descriptionEn: 'Minimal: living + bath + terrace',
    icon: '🏠',
    instances: [
      inst(0, 'living', 'timber', 0, 0),
      inst(1, 'bath', 'timber', 4, 0),
      inst(2, 'terrace', 'timber', 0, 4),
    ],
  },
  {
    id: 'family',
    nameRu: 'Семья',
    nameEn: 'Family',
    nameKa: 'ოჯახი',
    descriptionRu: 'Гостиная + 2 спальни + кухня + санузел + терраса',
    descriptionEn: 'Living + 2 bedrooms + kitchen + bath + terrace',
    icon: '👨\u200d👩\u200d👧',
    instances: [
      inst(0, 'living', 'hybrid', 0, 0),
      inst(1, 'kitchen', 'hybrid', 4, 0),
      inst(2, 'bedroom', 'hybrid', 0, 4),
      inst(3, 'bedroom', 'hybrid', 4, 4),
      inst(4, 'bath', 'hybrid', -4, 0),
      inst(5, 'terrace', 'hybrid', 0, -4),
    ],
  },
  {
    id: 'office',
    nameRu: 'Офис',
    nameEn: 'Office',
    nameKa: 'ოფისი',
    descriptionRu: 'Хаб + 2 рабочих + переговорка + санузел',
    descriptionEn: 'Hub + 2 workspaces + meeting + bath',
    icon: '💼',
    instances: [
      inst(0, 'hub-core', 'container', 0, 0),
      inst(1, 'workspace', 'container', 4, 0),
      inst(2, 'workspace', 'container', -4, 0),
      inst(3, 'meeting', 'container', 0, 4),
      inst(4, 'bath', 'container', 0, -4),
    ],
  },
  {
    id: 'workshop',
    nameRu: 'Мастерская',
    nameEn: 'Workshop',
    nameKa: 'სახელოსნო',
    descriptionRu: 'Мастерская + склад + санузел + солнечная башня',
    descriptionEn: 'Workshop + storage + bath + solar tower',
    icon: '🔧',
    instances: [
      inst(0, 'workshop', 'container', 0, 0),
      inst(1, 'storage', 'container', 4, 0),
      inst(2, 'bath', 'container', -4, 0),
      inst(3, 'solar-tower', 'container', 0, 4),
    ],
  },
  {
    id: 'glamping',
    nameRu: 'Глэмпинг',
    nameEn: 'Glamping',
    nameKa: 'გლემპინგი',
    descriptionRu: '3 жилых модуля + санузлы + терраса + карпорт',
    descriptionEn: '3 living units + baths + terrace + carport',
    icon: '⛺',
    instances: [
      inst(0, 'living', 'timber', -6, 0),
      inst(1, 'living', 'timber', 0, 0),
      inst(2, 'living', 'timber', 6, 0),
      inst(3, 'bath', 'timber', -6, 4),
      inst(4, 'bath', 'timber', 6, 4),
      inst(5, 'terrace', 'timber', 0, -4),
      inst(6, 'carport', 'timber', 0, 8),
    ],
  },
  {
    id: 'hub',
    nameRu: 'Хаб',
    nameEn: 'Hub',
    nameKa: 'ჰაბი',
    descriptionRu: 'Большой коммьюнити-хаб: центр + мост + 4 спутника',
    descriptionEn: 'Community hub: core + bridge + 4 satellites',
    icon: '🌐',
    instances: [
      inst(0, 'hub-core', 'hybrid', 0, 0),
      inst(1, 'glass-bridge', 'hybrid', 4, 0, Math.PI / 2),
      inst(2, 'living', 'hybrid', 8, 0),
      inst(3, 'kitchen', 'hybrid', -4, 0),
      inst(4, 'meeting', 'hybrid', 0, 4),
      inst(5, 'workspace', 'hybrid', 0, -4),
    ],
  },
]
