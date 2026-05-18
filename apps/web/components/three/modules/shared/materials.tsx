import type { JSX } from 'react'

// ════════════════════════════════════════════════════════════════
// PBR Materials Registry — Wave 11
// Единый реестр физически-корректных материалов для 3D-модулей.
// Tuned под canvas #f8f9fc + drei <Environment preset="city" /> IBL.
// ════════════════════════════════════════════════════════════════

export type PBRPresetName =
  | 'cortenSteel'
  | 'cortenSteelDark'
  | 'corner'
  | 'timberLight'
  | 'timberDark'
  | 'timberCharred'
  | 'concrete'
  | 'concretePolished'
  | 'glassClear'
  | 'glassFrosted'
  | 'glassBlue'
  | 'glassTinted'
  | 'aluminum'
  | 'aluminumBrushed'
  | 'copper'
  | 'brass'
  | 'blackMatte'
  | 'blackGlossy'
  | 'ledWarm'
  | 'ledCool'
  | 'ledOrange'
  | 'water'
  | 'foliage'
  | 'terracotta'
  | 'stone'

type BaseProps = {
  color: string
  roughness: number
  metalness: number
  envMapIntensity?: number
  emissive?: string
  emissiveIntensity?: number
}

type StandardPreset = BaseProps & { physical?: false }

type PhysicalPreset = BaseProps & {
  physical: true
  transmission?: number
  thickness?: number
  ior?: number
  transparent?: boolean
  opacity?: number
  clearcoat?: number
  clearcoatRoughness?: number
  sheen?: number
  sheenColor?: string
}

export type PBRPreset = StandardPreset | PhysicalPreset

export const pbrPresets: Record<PBRPresetName, PBRPreset> = {
  // ─── COR-TEN сталь (контейнеры) ───
  cortenSteel: { color: '#B45A3C', roughness: 0.62, metalness: 0.55, envMapIntensity: 0.9 },
  cortenSteelDark: { color: '#8A4429', roughness: 0.7, metalness: 0.5, envMapIntensity: 0.85 },
  corner: { color: '#1a1a1d', roughness: 0.45, metalness: 0.75, envMapIntensity: 1.0 },

  // ─── Дерево ───
  timberLight: { color: '#A87C5A', roughness: 0.78, metalness: 0, envMapIntensity: 0.7 },
  timberDark: { color: '#6B4F38', roughness: 0.82, metalness: 0, envMapIntensity: 0.65 },
  timberCharred: { color: '#2A1810', roughness: 0.95, metalness: 0.02, envMapIntensity: 0.5 },

  // ─── Бетон / камень / земля ───
  concrete: { color: '#C8C5BE', roughness: 0.88, metalness: 0.02, envMapIntensity: 0.6 },
  concretePolished: {
    physical: true,
    color: '#D6D3CC',
    roughness: 0.35,
    metalness: 0.05,
    envMapIntensity: 1.1,
    clearcoat: 0.35,
    clearcoatRoughness: 0.4,
  },
  stone: { color: '#8E8A82', roughness: 0.92, metalness: 0.02, envMapIntensity: 0.55 },
  terracotta: { color: '#C0613B', roughness: 0.85, metalness: 0, envMapIntensity: 0.65 },

  // ─── Стекло (physical + transmission) ───
  glassClear: {
    physical: true,
    color: '#ffffff',
    roughness: 0.05,
    metalness: 0,
    envMapIntensity: 1.3,
    transmission: 0.95,
    thickness: 0.3,
    ior: 1.5,
    transparent: true,
    opacity: 0.45,
    clearcoat: 1,
    clearcoatRoughness: 0.02,
  },
  glassFrosted: {
    physical: true,
    color: '#eef3f8',
    roughness: 0.55,
    metalness: 0,
    envMapIntensity: 1.0,
    transmission: 0.7,
    thickness: 0.4,
    ior: 1.45,
    transparent: true,
    opacity: 0.7,
  },
  glassBlue: {
    physical: true,
    color: '#a8d0ff',
    roughness: 0.08,
    metalness: 0,
    envMapIntensity: 1.25,
    transmission: 0.82,
    thickness: 0.3,
    ior: 1.5,
    transparent: true,
    opacity: 0.55,
    clearcoat: 0.9,
    clearcoatRoughness: 0.05,
  },
  glassTinted: {
    physical: true,
    color: '#4a5566',
    roughness: 0.12,
    metalness: 0,
    envMapIntensity: 1.1,
    transmission: 0.55,
    thickness: 0.35,
    ior: 1.5,
    transparent: true,
    opacity: 0.75,
    clearcoat: 0.7,
    clearcoatRoughness: 0.08,
  },

  // ─── Металлы ───
  aluminum: { color: '#C5C9CE', roughness: 0.4, metalness: 0.92, envMapIntensity: 1.2 },
  aluminumBrushed: { color: '#B8BCC2', roughness: 0.55, metalness: 0.88, envMapIntensity: 1.1 },
  copper: { color: '#B87333', roughness: 0.35, metalness: 0.95, envMapIntensity: 1.3 },
  brass: { color: '#C9A227', roughness: 0.42, metalness: 0.9, envMapIntensity: 1.2 },

  // ─── Чёрные ───
  blackMatte: { color: '#15151a', roughness: 0.85, metalness: 0.05, envMapIntensity: 0.5 },
  blackGlossy: {
    physical: true,
    color: '#0a0a0d',
    roughness: 0.18,
    metalness: 0.25,
    envMapIntensity: 1.4,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
  },

  // ─── LED-подсветка (emissive) ───
  ledWarm: {
    color: '#ffe4b5',
    roughness: 0.4,
    metalness: 0,
    emissive: '#ffaa55',
    emissiveIntensity: 1.2,
    envMapIntensity: 0.4,
  },
  ledCool: {
    color: '#cce6ff',
    roughness: 0.4,
    metalness: 0,
    emissive: '#7fb8ff',
    emissiveIntensity: 1.0,
    envMapIntensity: 0.4,
  },
  ledOrange: {
    color: '#ffaa55',
    roughness: 0.45,
    metalness: 0,
    emissive: '#ff7733',
    emissiveIntensity: 1.4,
    envMapIntensity: 0.35,
  },

  // ─── Вода / зелень ───
  water: {
    physical: true,
    color: '#3a7fb8',
    roughness: 0.08,
    metalness: 0,
    envMapIntensity: 1.5,
    transmission: 0.5,
    thickness: 0.5,
    ior: 1.33,
    transparent: true,
    opacity: 0.85,
    clearcoat: 1,
    clearcoatRoughness: 0.04,
  },
  foliage: { color: '#4a7d3a', roughness: 0.78, metalness: 0, envMapIntensity: 0.7 },
}

export function getPBR(name: PBRPresetName): PBRPreset {
  return pbrPresets[name]
}

export function isPhysical(p: PBRPreset): p is PhysicalPreset {
  return p.physical === true
}

// ─── JSX-компонент ──────────────────────────────────────────────
// <PBRMaterial preset="cortenSteel" />
// Авто-выбор: meshPhysicalMaterial для физических пресетов,
// meshStandardMaterial для остальных.
// ────────────────────────────────────────────────────────────────
export function PBRMaterial({ preset }: { preset: PBRPresetName }): JSX.Element {
  const p = pbrPresets[preset]
  if (isPhysical(p)) {
    const { physical: _physical, ...rest } = p
    void _physical
    return <meshPhysicalMaterial {...rest} />
  }
  const { physical: _physical, ...rest } = p
  void _physical
  return <meshStandardMaterial {...rest} />
}
