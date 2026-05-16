'use client'

import { useWorld, SITE_META } from '@/stores/world'
import type { Weather, Site, CameraMode } from '@/stores/world'
import { useLocale } from '@/stores/locale'
import { t } from '@mig/i18n'

const WEATHERS: Weather[] = ['clear', 'rain', 'snow', 'fog']
const SITES: Site[] = ['tbilisi', 'bakuriani', 'kakheti', 'adjara']
const CAMERAS: CameraMode[] = ['orbit', 'topdown', 'cinematic']

const WEATHER_ICON: Record<Weather, string> = { clear: '☀️', rain: '🌧', snow: '❄️', fog: '🌫' }
const CAMERA_ICON: Record<CameraMode, string> = { orbit: '🎥', topdown: '🛰', cinematic: '🏞' }

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
    <div className="glass rounded-2xl p-3 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-xs uppercase tracking-wider text-fg-secondary">
          {t('world.title', locale)}
        </h2>
        <span className="text-[10px] text-fg-secondary">{hourLabel(hour)} · {temp}°C</span>
      </div>

      <div>
        <div className="mb-1 text-[10px] text-fg-secondary">{t('world.sun', locale)}</div>
        <input
          type="range"
          min={0}
          max={24}
          step={0.25}
          value={hour}
          onChange={(e) => setHour(parseFloat(e.target.value))}
          className="w-full accent-accent-green"
        />
      </div>

      <div>
        <div className="mb-1 text-[10px] text-fg-secondary">{t('world.weather', locale)}</div>
        <div className="grid grid-cols-4 gap-1">
          {WEATHERS.map((w) => (
            <button
              key={w}
              onClick={() => setWeather(w)}
              className={`rounded-md py-1.5 text-base ${weather === w ? 'bg-accent-green text-bg' : 'bg-bg hover:bg-panel'}`}
              title={t(`weather.${w}`, locale)}
            >
              {WEATHER_ICON[w]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-1 text-[10px] text-fg-secondary">{t('world.site', locale)}</div>
        <div className="grid grid-cols-2 gap-1">
          {SITES.map((s) => (
            <button
              key={s}
              onClick={() => setSite(s)}
              className={`rounded-md py-1 text-[10px] ${site === s ? 'bg-accent-green text-bg' : 'bg-bg hover:bg-panel'}`}
            >
              {t(`site.${s}`, locale)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-1 text-[10px] text-fg-secondary">{t('world.camera', locale)}</div>
        <div className="grid grid-cols-3 gap-1">
          {CAMERAS.map((c) => (
            <button
              key={c}
              onClick={() => setCameraMode(c)}
              className={`rounded-md py-1 text-[10px] ${cameraMode === c ? 'bg-accent-green text-bg' : 'bg-bg hover:bg-panel'}`}
            >
              <span className="mr-1">{CAMERA_ICON[c]}</span>{t(`camera.${c}`, locale)}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
