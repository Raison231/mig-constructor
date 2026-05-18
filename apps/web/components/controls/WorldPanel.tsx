'use client'

import { useWorld, SITE_META } from '@/stores/world'
import type { Weather, Site, CameraMode } from '@/stores/world'
import { useLocale } from '@/stores/locale'
import { t } from '@mig/i18n'

const WEATHERS: Weather[] = ['clear', 'rain', 'snow', 'fog']
const SITES: Site[] = ['tbilisi', 'bakuriani', 'kakheti', 'adjara']
const CAMERAS: CameraMode[] = ['orbit', 'topdown', 'cinematic', 'interior']

const WEATHER_ICON: Record<Weather, string> = { clear: '☀️', rain: '🌧', snow: '❄️', fog: '🌫' }
const CAMERA_ICON: Record<CameraMode, string> = { orbit: '🎥', topdown: '🛰', cinematic: '🏞', interior: '🚪' }

function hourLabel(h: number) {
  const hh = Math.floor(h)
  const mm = Math.round((h - hh) * 60)
  return `${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}`
}

export function WorldPanel() {
  const hour = useWorld((s) => s.hour)
  const weather = useWorld((s) => s.weather)
  const site = useWorld((s) => s.site)
  const cameraMode = useWorld((s) => s.cameraMode)
  const setHour = useWorld((s) => s.setHour)
  const setWeather = useWorld((s) => s.setWeather)
  const setSite = useWorld((s) => s.setSite)
  const setCameraMode = useWorld((s) => s.setCameraMode)
  const locale = useLocale((s) => s.locale)

  const temp = SITE_META[site].tempC

  return (
    <div className="glass rounded-3xl p-3.5 space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink3">{t('world.title', locale)}</div>
        <div className="flex items-center gap-1.5">
          <span className="rounded-full bg-brand-secondary/12 text-brand-secondary text-[10px] font-bold px-2 py-0.5 border border-brand-secondary/25">{hourLabel(hour)}</span>
          <span className="rounded-full bg-brand-accent/15 text-[#8B4F00] text-[10px] font-bold px-2 py-0.5 border border-brand-accent/30">{temp}°C</span>
        </div>
      </div>

      <div>
        <div className="mb-1 text-[10px] text-ink3 font-medium">{t('world.sun', locale)}</div>
        <input
          type="range" min={0} max={24} step={0.25} value={hour}
          onChange={(e) => setHour(parseFloat(e.target.value))}
          className="aurora-range w-full"
        />
      </div>

      <div>
        <div className="mb-1.5 text-[10px] text-ink3 font-medium">{t('world.weather', locale)}</div>
        <div className="grid grid-cols-4 gap-1">
          {WEATHERS.map((w) => (
            <button
              key={w}
              onClick={() => setWeather(w)}
              className={`rounded-xl py-1.5 text-base border transition ${
                weather === w
                  ? 'border-brand-primary bg-brand-primary/15 shadow-aurora'
                  : 'border-hairline bg-white/55 hover:bg-white'
              }`}
              title={t(`weather.${w}`, locale)}
            >
              {WEATHER_ICON[w]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-1.5 text-[10px] text-ink3 font-medium">{t('world.site', locale)}</div>
        <div className="grid grid-cols-2 gap-1">
          {SITES.map((s) => (
            <button
              key={s}
              onClick={() => setSite(s)}
              className={`rounded-xl py-1.5 text-[10px] font-bold border transition ${
                site === s
                  ? 'border-brand-primary bg-brand-primary text-white shadow-aurora-primary'
                  : 'border-hairline bg-white/55 text-ink hover:bg-white'
              }`}
            >
              {t(`site.${s}`, locale)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-1.5 text-[10px] text-ink3 font-medium">{t('world.camera', locale)}</div>
        <div className="grid grid-cols-4 gap-1">
          {CAMERAS.map((c) => (
            <button
              key={c}
              onClick={() => setCameraMode(c)}
              className={`rounded-xl py-1.5 text-base border transition ${
                cameraMode === c
                  ? 'border-brand-field bg-brand-field/15 shadow-aurora'
                  : 'border-hairline bg-white/55 hover:bg-white'
              }`}
              title={t(`camera.${c}`, locale)}
            >
              {CAMERA_ICON[c]}
            </button>
          ))}
        </div>
        {cameraMode === 'interior' && (
          <div className="mt-1.5 text-[9px] text-ink2 leading-tight">
            {t('camera.interiorHint', locale)}
          </div>
        )}
      </div>
    </div>
  )
}
