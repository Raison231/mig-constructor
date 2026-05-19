import type { ModuleInstance } from '@/stores/configurator'
import type { Material } from '@mig/modules-schema'

export type PresetModule = {
  moduleId: string
  material: Material
  position: [number, number, number]
  rotationY: number
}

export type ScenePreset = {
  id: string
  nameRu: string
  nameEn: string
  emoji: string
  description: string
  modules: PresetModule[]
}

let counter = 0
const nextPresetId = () => `preset-${Date.now()}-${++counter}`

export function presetToInstances(modules: PresetModule[]): ModuleInstance[] {
  return modules.map((m) => ({ ...m, instanceId: nextPresetId() }))
}

const grid = (x: number, z: number): [number, number, number] => [x, 0, z]

export const SCENE_PRESETS: ScenePreset[] = [
  {
    id: 'minidacha',
    nameRu: 'Минидача 60м²',
    nameEn: 'Mini Dacha 60m²',
    emoji: '🏡',
    description: 'Ядро + кухня + спальня + санузел. База на одного-двоих.',
    modules: [
      { moduleId: 'hub-core', material: 'timber', position: grid(0, 0), rotationY: 0 },
      { moduleId: 'kitchen-pod', material: 'timber', position: grid(3, 0), rotationY: 0 },
      { moduleId: 'bedroom-pano', material: 'timber', position: grid(-3, 0), rotationY: 0 },
      { moduleId: 'bathroom-spa', material: 'timber', position: grid(0, 3), rotationY: 0 },
    ],
  },
  {
    id: 'glamping',
    nameRu: 'Глэмпинг ×4',
    nameEn: 'Glamping ×4',
    emoji: '⛺',
    description: 'Четыре геокупола + общий душ + бассейн.',
    modules: [
      { moduleId: 'geo-dome', material: 'hybrid', position: grid(-4, -4), rotationY: 0 },
      { moduleId: 'geo-dome', material: 'hybrid', position: grid(4, -4), rotationY: 0 },
      { moduleId: 'geo-dome', material: 'hybrid', position: grid(-4, 4), rotationY: 0 },
      { moduleId: 'geo-dome', material: 'hybrid', position: grid(4, 4), rotationY: 0 },
      { moduleId: 'outdoor-shower', material: 'timber', position: grid(0, 0), rotationY: 0 },
      { moduleId: 'pool-hottub', material: 'hybrid', position: grid(0, 7), rotationY: 0 },
    ],
  },
  {
    id: 'studio',
    nameRu: 'Студия-офис',
    nameEn: 'Studio Office',
    emoji: '💼',
    description: 'Офис + кухня + спальня + санузел. Для соло-фрилансера.',
    modules: [
      { moduleId: 'office-studio', material: 'container', position: grid(0, 0), rotationY: 0 },
      { moduleId: 'kitchen-pod', material: 'container', position: grid(3, 0), rotationY: 0 },
      { moduleId: 'bedroom-pano', material: 'container', position: grid(-3, 0), rotationY: 0 },
      { moduleId: 'bathroom-spa', material: 'container', position: grid(0, 3), rotationY: 0 },
    ],
  },
  {
    id: 'eco-estate',
    nameRu: 'Эко-усадьба',
    nameEn: 'Eco Estate',
    emoji: '🌿',
    description: 'Ядро + теплица + солнце + вода + колодец + мастерская. Автономно.',
    modules: [
      { moduleId: 'hub-core', material: 'hybrid', position: grid(0, 0), rotationY: 0 },
      { moduleId: 'kitchen-pod', material: 'hybrid', position: grid(3, 0), rotationY: 0 },
      { moduleId: 'bedroom-pano', material: 'hybrid', position: grid(-3, 0), rotationY: 0 },
      { moduleId: 'bathroom-spa', material: 'hybrid', position: grid(0, 3), rotationY: 0 },
      { moduleId: 'greenhouse', material: 'hybrid', position: grid(-6, 3), rotationY: 0 },
      { moduleId: 'solar-tower', material: 'hybrid', position: grid(6, -3), rotationY: 0 },
      { moduleId: 'water-tank', material: 'hybrid', position: grid(-6, -3), rotationY: 0 },
      { moduleId: 'well-cap', material: 'hybrid', position: grid(6, 3), rotationY: 0 },
      { moduleId: 'workshop', material: 'timber', position: grid(0, -6), rotationY: 0 },
    ],
  },
  {
    id: 'music-studio',
    nameRu: 'Музстудия Weeekend',
    nameEn: 'Music Studio',
    emoji: '🎵',
    description: 'Sound + спальня + санузел + кухня + ровный руф. Для записи.',
    modules: [
      { moduleId: 'sound-studio', material: 'hybrid', position: grid(0, 0), rotationY: 0 },
      { moduleId: 'bedroom-pano', material: 'timber', position: grid(-3, 0), rotationY: 0 },
      { moduleId: 'bathroom-spa', material: 'timber', position: grid(0, 3), rotationY: 0 },
      { moduleId: 'kitchen-pod', material: 'timber', position: grid(3, 0), rotationY: 0 },
      { moduleId: 'rooftop', material: 'hybrid', position: grid(0, -3), rotationY: 0 },
    ],
  },
  {
    id: 'resort',
    nameRu: 'Курорт-резиденция',
    nameEn: 'Resort',
    emoji: '🧖',
    description: 'Сауна + бассейн + 2 спальни + кухня + санузел + обзорная палуба.',
    modules: [
      { moduleId: 'hub-core', material: 'hybrid', position: grid(0, 0), rotationY: 0 },
      { moduleId: 'sauna-wellness', material: 'timber', position: grid(3, 0), rotationY: 0 },
      { moduleId: 'pool-hottub', material: 'hybrid', position: grid(6, 0), rotationY: 0 },
      { moduleId: 'bedroom-pano', material: 'timber', position: grid(-3, 0), rotationY: 0 },
      { moduleId: 'bedroom-pano', material: 'timber', position: grid(-3, 3), rotationY: 0 },
      { moduleId: 'kitchen-pod', material: 'hybrid', position: grid(0, 3), rotationY: 0 },
      { moduleId: 'bathroom-spa', material: 'hybrid', position: grid(3, 3), rotationY: 0 },
      { moduleId: 'observation-deck', material: 'hybrid', position: grid(6, 3), rotationY: 0 },
    ],
  },
]

export function findPreset(id: string): ScenePreset | undefined {
  return SCENE_PRESETS.find((p) => p.id === id)
}
