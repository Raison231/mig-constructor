/**
 * Проверка поддержки WebXR AR в текущем браузере.
 * Возвращает true если доступен 'immersive-ar' сеанс.
 */
export async function isARSupported(): Promise<boolean> {
	if (typeof navigator === 'undefined') return false
	const xr = (navigator as Navigator & { xr?: { isSessionSupported: (mode: string) => Promise<boolean> } }).xr
	if (!xr || typeof xr.isSessionSupported !== 'function') return false
	try {
		return await xr.isSessionSupported('immersive-ar')
	} catch {
		return false
	}
}

/** Базовая инфа о AR-фичах устройства. */
export function getARCapabilityHint(): {
	platform: 'ios' | 'android' | 'desktop' | 'unknown'
	hint: string
} {
	if (typeof navigator === 'undefined') return { platform: 'unknown', hint: '' }
	const ua = navigator.userAgent.toLowerCase()
	if (/iphone|ipad|ipod/.test(ua)) {
		return {
			platform: 'ios',
			hint: 'iOS: WebXR ограничен. Используй Safari + iOS 17+ или экспортируй .usdz для AR Quick Look.',
		}
	}
	if (/android/.test(ua)) {
		return {
			platform: 'android',
			hint: 'Android: Chrome + ARCore. Нужно разрешение камеры.',
		}
	}
	return {
		platform: 'desktop',
		hint: 'Desktop не поддерживает immersive-ar. Открой ссылку на телефоне.',
	}
}

/** Утилита: snap значение к сетке (для placement в AR). */
export function snapToGrid(value: number, gridSize = 0.1): number {
	return Math.round(value / gridSize) * gridSize
}
