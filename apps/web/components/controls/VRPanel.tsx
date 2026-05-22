'use client'

import { useEffect } from 'react'
import { xrStore } from '@/components/three/ARScene'
import { useVR } from '@/stores/vr'

export function VRPanel() {
  const supported = useVR((s) => s.supported)
  const status = useVR((s) => s.status)
  const teleportEnabled = useVR((s) => s.teleportEnabled)
  const locomotionSpeed = useVR((s) => s.locomotionSpeed)
  const setSupported = useVR((s) => s.setSupported)
  const setStatus = useVR((s) => s.setStatus)
  const setTeleportEnabled = useVR((s) => s.setTeleportEnabled)
  const setLocomotionSpeed = useVR((s) => s.setLocomotionSpeed)
  const reset = useVR((s) => s.reset)

  useEffect(() => {
    let cancelled = false
    const nav = navigator as Navigator & {
      xr?: { isSessionSupported?: (m: string) => Promise<boolean> }
    }
    if (!nav.xr || !nav.xr.isSessionSupported) {
      setSupported(false)
      return
    }
    nav.xr
      .isSessionSupported('immersive-vr')
      .then((ok) => {
        if (!cancelled) setSupported(!!ok)
      })
      .catch(() => {
        if (!cancelled) setSupported(false)
      })
    return () => {
      cancelled = true
    }
  }, [setSupported])

  async function enterVR() {
    if (!supported) {
      setStatus('unsupported')
      return
    }
    try {
      setStatus('requesting')
      await xrStore.enterVR()
    } catch (e) {
      console.error('[enter VR]', e)
      setStatus('denied')
    }
  }

  async function exitVR() {
    try {
      await xrStore.getState().session?.end()
    } catch {}
    reset()
  }

  const active = status === 'active'
  const statusLabel = active
    ? 'ACTIVE'
    : status === 'requesting'
      ? 'WAIT'
      : status === 'denied'
        ? 'DENIED'
        : supported
          ? 'READY'
          : 'N/A'

  return (
    <div className="glass rounded-3xl p-3.5 border border-hairline bg-white/60">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-base">🥽</span>
          <span className="text-[13px] font-semibold text-ink">VR Immersion</span>
        </div>
        <span className={`text-[10px] font-mono ${active ? 'text-brand-primary' : 'text-ink3'}`}>
          {statusLabel}
        </span>
      </div>

      <button
        type="button"
        onClick={active ? exitVR : enterVR}
        disabled={!supported && !active}
        className={`w-full rounded-2xl px-3 py-2 text-[12px] font-bold transition ${
          active
            ? 'bg-brand-field text-white shadow-aurora-primary'
            : supported
              ? 'bg-aurora-primary text-white shadow-aurora-primary hover:opacity-90'
              : 'bg-ink/10 text-ink3 cursor-not-allowed'
        }`}
      >
        {active ? 'Выйти из VR' : supported ? 'Войти в VR' : 'VR недоступен'}
      </button>

      <label className="mt-2.5 flex items-center justify-between text-[11px] text-ink2">
        <span>Телепорт (триггер в землю)</span>
        <input
          type="checkbox"
          checked={teleportEnabled}
          onChange={(e) => setTeleportEnabled(e.target.checked)}
          className="h-4 w-4 accent-emerald-500"
        />
      </label>

      <div className="mt-2 flex items-center justify-between text-[11px] text-ink2">
        <span>Локомоция</span>
        <span className="font-mono text-ink">{locomotionSpeed.toFixed(1)} м/с</span>
      </div>
      <input
        type="range"
        min={0}
        max={3}
        step={0.1}
        value={locomotionSpeed}
        onChange={(e) => setLocomotionSpeed(parseFloat(e.target.value))}
        className="aurora-range w-full"
      />

      <div className="mt-2 rounded-2xl bg-ink/5 px-3 py-2 text-[10px] text-ink3 leading-snug">
        Headset + 2 контроллера. Целься триггером в землю — мгновенный телепорт. Без VR-железа кнопка задизейблена.
      </div>
    </div>
  )
}
