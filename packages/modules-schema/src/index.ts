import { ModuleSchema, type Module } from './schema'
import modulesData from './modules.json' with { type: 'json' }

export * from './schema'

export const modules: Module[] = (modulesData as unknown[]).map((m) => ModuleSchema.parse(m))

export function getModule(id: string): Module | undefined {
  return modules.find((m) => m.id === id)
}
