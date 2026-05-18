'use client'

import { useCinematic, type CinematicMode } from '@/stores/cinematic'
import { useRealtime } from '@/stores/realtime'
import { useLocale } from '@/stores/locale'
import { t } from '@mig/i18n'
import { ARButton } from '@/components/ui/ARButton'
import { isSupabaseConfigured } from '@/lib/supabase-client'

const MODES: CinematicMode[] = ['off', 'walkthrough', 'drone', 'orbit']

/**
 * FIX: в Wave 8 этот компонент имел inline-styles со смесью shorthand `border`
 * и отдельного `borderColor` — React выдавал warning "Removing a style property during
 * rerender (borderColor) when a conflicting property is set (border)". Переписал
 * полностью на Tailwind — без inline styles, без shorthand-конфликтов.
 */
export function CinematicPanel() {
  const mode = useCinematic((s) => s.mode)
  const speed = useCinematic((s) => s.speed)
  const orbitRadius = useCinematic((s) => s.orbitRadius)
  const orbitHeight = useCinematic((s) => s.orbitHeight)
  const walkHeight = useCinematic((s) => s.walkHeight)
  const walkSpeed = useCinematic((s) => s.walkSpeed)
  const setMode = useCinematic((s) => s.setMode)
  const setSpeed = useCinematic((s) => s.setSpeed)
  const setOrbitRadius = useCinematic((s) => s.setOrbitRadius)
  const setOrbitHeight = useCinematic((s) => s.setOrbitHeight)
  const setWalkHeight = useCinematic((s) => s.setWalkHeight)
  const setWalkSpeed = useCinematic((s) => s.setWalkSpeed)
  const connected = useRealtime((s) => s.connected)
  const cursors = useRealtime((s) => s.cursors)
  const locale = useLocale((s) => s.locale)
  const peers = Object.keys(cursors).length

  const rtConfigured = isSupabaseConfigured()
  const rtLabel = rtConfigured
    ? connected ? `${t('realtime.online', locale)} · ${peers} ${t('realtime.peers', locale)}` : t('realtime.connecting', locale)
    : t('realtime.offline', locale)

  return (
    <div className="glass rounded-3xl p-3.5">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink3">{t('cinematic.title', locale)}</div>
        <ARButton />
      </div>

      <div className="grid grid-cols-4 gap-1 mb-3">
        {MODES.map((m) => {
          const active = mode === m
          // НИ одного inline-style с border-shorthand — только Tailwind utility-классы.
          const className = active
            ? 'rounded-xl border border-brand-field bg-brand-field text-white font-extrabold shadow-aurora py-1.5 text-[11px] transition'
            : 'rounded-xl border border-hairline bg-white/60 text-ink2 hover:bg-white hover:text-ink py-1.5 text-[11px] font-bold transition'
          return (
            <button key={m} type="button" onClick={() => setMode(m)} className={className}>
              {t(`cinematic.${m}`, locale)}
            </button>
          )
        })}
      </div>

      {(mode === 'drone' || mode === 'orbit') && (
        <div className="space-y-2.5">
          <SliderRow label={t('cinematic.speed', locale)} value={speed} display={`${speed.toFixed(2)}x`} min={0.1} max={3} step={0.1} onChange={setSpeed} />
          <SliderRow label={t('cinematic.radius', locale)} value={orbitRadius} display={`${orbitRadius.toFixed(0)}m`} min={5} max={40} step={1} onChange={setOrbitRadius} />
          <SliderRow label={t('cinematic.height', locale)} value={orbitHeight} display={`${orbitHeight.toFixed(0)}m`} min={2} max={30} step={1} onChange={setOrbitHeight} />
        </div>
      )}

      {mode === 'walkthrough' && (
        <div className="space-y-2.5">
          <SliderRow label={t('cinematic.eyeHeight', locale)} value={walkHeight} display={`${walkHeight.toFixed(2)}m`} min={0.5} max={2.2} step={0.05} onChange={setWalkHeight} />
          <SliderRow label={t('cinematic.walkSpeed', locale)} value={walkSpeed} display={`${walkSpeed.toFixed(1)} m/s`} min={1} max={6} step={0.1} onChange={setWalkSpeed} />
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-hairline flex items-center text-[11px] text-ink2">
        <span className={`inline-block h-2 w-2 rounded-full mr-2 ${connected ? 'bg-brand-primary animate-pulse-glow' : 'bg-ink3'}`} />
        <span className="font-medium">{rtLabel}</span>
      </div>
    </div>
  )
}

function SliderRow({
  label, value, display, min, max, step, onChange,
}: {
  label: string; value: number; display: string;
  min: number; max: number; step: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-[10px] mb-1">
        <span className="text-ink2 font-medium">{label}</span>
        <span className="font-mono text-brand-field font-bold">{display}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="aurora-range w-full"
      />
    </div>
  )
}
