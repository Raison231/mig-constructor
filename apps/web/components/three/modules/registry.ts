import type { ComponentType } from 'react'
import type { Material } from '@mig/modules-schema'
import { HubCore } from './HubCore'
import { KitchenPod } from './KitchenPod'
import { BedroomPano } from './BedroomPano'
import { BathroomSpa } from './BathroomSpa'
import { OfficeStudio } from './OfficeStudio'
import { SaunaWellness } from './SaunaWellness'
import { PoolHottub } from './PoolHottub'
import { Greenhouse } from './Greenhouse'
import { Workshop } from './Workshop'
import { Rooftop } from './Rooftop'
import { Cellar } from './Cellar'
import { KidsLab } from './KidsLab'
import { SoundStudio } from './SoundStudio'
import { OutdoorShower } from './OutdoorShower'
import { AFrameLoft } from './AFrameLoft'
import { GeoDome } from './GeoDome'

export type ModuleVisualProps = { material: Material; w: number; h: number; d: number }

export const moduleComponents: Record<string, ComponentType<ModuleVisualProps>> = {
  'hub-core': HubCore,
  'kitchen-pod': KitchenPod,
  'bedroom-pano': BedroomPano,
  'bathroom-spa': BathroomSpa,
  'office-studio': OfficeStudio,
  'sauna-wellness': SaunaWellness,
  'pool-hottub': PoolHottub,
  greenhouse: Greenhouse,
  workshop: Workshop,
  rooftop: Rooftop,
  cellar: Cellar,
  'kids-lab': KidsLab,
  'sound-studio': SoundStudio,
  'outdoor-shower': OutdoorShower,
  'aframe-loft': AFrameLoft,
  'geo-dome': GeoDome,
}
