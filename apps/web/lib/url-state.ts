import type { ModuleInstance } from '@/stores/configurator'

type Serialized = Array<[string, string, number, number, number, number]>

function encodeBase64Url(s: string): string {
  if (typeof window === 'undefined') return ''
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function decodeBase64Url(s: string): string {
  if (typeof window === 'undefined') return ''
  const pad = s.length % 4 === 0 ? '' : '='.repeat(4 - (s.length % 4))
  return atob(s.replace(/-/g, '+').replace(/_/g, '/') + pad)
}

let counter = 0
const genId = () => `mod-${Date.now()}-${++counter}`

export function encodeLayout(modules: ModuleInstance[]): string {
  const data: Serialized = modules.map((m) => [
    m.moduleId,
    m.material,
    +m.position[0].toFixed(2),
    +m.position[1].toFixed(2),
    +m.position[2].toFixed(2),
    +m.rotationY.toFixed(3),
  ])
  return encodeBase64Url(JSON.stringify(data))
}

export function decodeLayout(hash: string): ModuleInstance[] | null {
  try {
    const raw = decodeBase64Url(hash)
    const data = JSON.parse(raw) as Serialized
    if (!Array.isArray(data)) return null
    return data.map((row) => ({
      instanceId: genId(),
      moduleId: row[0],
      material: row[1] as ModuleInstance['material'],
      position: [row[2], row[3], row[4]],
      rotationY: row[5],
    }))
  } catch {
    return null
  }
}

export async function copyShareLink(modules: ModuleInstance[]): Promise<boolean> {
  if (typeof window === 'undefined') return false
  const hash = encodeLayout(modules)
  const url = `${window.location.origin}${window.location.pathname}#layout=${hash}`
  try {
    await navigator.clipboard.writeText(url)
    return true
  } catch {
    return false
  }
}
