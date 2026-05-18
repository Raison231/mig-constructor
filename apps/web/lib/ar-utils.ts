// AR helpers. Detect WebXR "immersive-ar" support, normalize hit-test pose.

export async function detectARSupport(): Promise<boolean> {
  if (typeof navigator === 'undefined') return false
  const xr = (navigator as Navigator & { xr?: { isSessionSupported: (m: string) => Promise<boolean> } }).xr
  if (!xr || typeof xr.isSessionSupported !== 'function') return false
  try {
    return await xr.isSessionSupported('immersive-ar')
  } catch {
    return false
  }
}

export const AR_DEFAULT_SCALE = 0.04 // 1m in editor → 4cm on table
export const AR_MIN_SCALE = 0.01
export const AR_MAX_SCALE = 0.5

export function clampScale(v: number): number {
  return Math.max(AR_MIN_SCALE, Math.min(AR_MAX_SCALE, v))
}
