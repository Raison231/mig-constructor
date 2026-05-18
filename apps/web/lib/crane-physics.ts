import type { ModuleInstance } from '@/stores/configurator'

// Высота, с которой кран опускает модули (метры)
export const CRANE_DROP_HEIGHT = 12

// Гравитация поля (Rapier)
export const FIELD_GRAVITY: [number, number, number] = [0, -9.81, 0]

// Восстановление (упругость) при ударе об землю
export const FIELD_RESTITUTION = 0.05

// Демпфирование линейное/угловое — чтобы модули не катались бесконечно
export const LINEAR_DAMPING = 0.8
export const ANGULAR_DAMPING = 1.5

export type CraneTarget = {
	instanceId: string
	spawnY: number // высота старта
	finalPos: [number, number, number] // целевое положение (X, finalY, Z)
}

/**
 * Преобразует ModuleInstance[] в очередь спавна для кран-физики.
 * Каждый модуль появляется на высоте CRANE_DROP_HEIGHT над своей целевой позицией.
 * Спавн с шагом, чтобы крановая последовательность была визуально читаема.
 */
export function buildCraneQueue(
	instances: ModuleInstance[],
	dropHeight: number = CRANE_DROP_HEIGHT
): CraneTarget[] {
	return instances.map((m) => ({
		instanceId: m.instanceId,
		spawnY: dropHeight + Math.random() * 2,
		finalPos: [m.position[0], m.position[1], m.position[2]],
	}))
}

/**
 * Интервал между спавнами модулей в крановой последовательности (мс).
 * Базируется на природном ритме дыхания (6/мин = 0.1 Гц = 10 сек),
	 * но ускорен в 10 раз для UX. φ-делитель.
 */
export const CRANE_SPAWN_INTERVAL_MS = 618 // 1000 / φ ≈ 618

/**
 * Проверка, остановился ли модуль (по сумме модулей скоростей).
 */
export function isAtRest(linvelMag: number, angvelMag: number): boolean {
	return linvelMag < 0.05 && angvelMag < 0.05
}
