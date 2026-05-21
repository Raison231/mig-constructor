'use client'

import { useOsm } from '@/stores/osm'
import { useLand } from '@/stores/land'

function formatHHMM(ts: number): string {
  const d = new Date(ts)
  const h = d.getHours().toString().padStart(2, '0')
  const m = d.getMinutes().toString().padStart(2, '0')
  return `${h}:${m}`
}

/**
 * OSM Context panel. Fetches building footprints from Overpass around the
 * lot lat/lon and displays them as extruded boxes via OsmBuildings.
 */
export function OsmPanel() {
  const enabled = useOsm((s) => s.enabled)
  const setEnabled = useOsm((s) => s.setEnabled)
  const radius = useOsm((s) => s.radiusMeters)
  const setRadius = useOsm((s) => s.setRadiusMeters)
  const buildings = useOsm((s) => s.buildings)
  const fetching = useOsm((s) => s.fetching)
  const error = useOsm((s) => s.error)
  const fetchedAt = useOsm((s) => s.fetchedAt)
  const fetchAround = useOsm((s) => s.fetchAround)
  const clear = useOsm((s) => s.clear)

  const lat = useLand((s) => s.lat)
  const lon = useLand((s) => s.lon)
  const hasCoords = typeof lat === 'number' && typeof lon === 'number' && Number.isFinite(lat) && Number.isFinite(lon)

  return (
    <div className="rounded-3xl border border-black/10 bg-white/65 backdrop-blur-md p-3.5 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-base leading-none">🗺️</span>
          <h3 className="text-[12px] font-bold tracking-tight text-black/80">OSM Контекст</h3>
        </div>
        <button
          type="button"
          onClick={() => setEnabled(!enabled)}
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${enabled ? 'bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25' : 'bg-black/10 text-black/60 hover:bg-black/15'}`}
        >
          {enabled ? 'ON' : 'off'}
        </button>
      </div>

      {!hasCoords && (
        <p className="text-[10px] text-black/55 leading-snug">
          Укажи координаты в панели «Участок» (Lat / Lon), потом загрузим здания вокруг из OpenStreetMap.
        </p>
      )}

      {hasCoords && (
        <>
          <div>
            <div className="flex items-center justify-between text-[10px] font-semibold text-black/60 mb-1">
              <span>Радиус</span>
              <span>{radius} м</span>
            </div>
            <input
              type="range"
              min={50}
              max={800}
              step={25}
              value={radius}
              onChange={(e) => setRadius(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-500"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              if (typeof lat === 'number' && typeof lon === 'number') {
                void fetchAround(lat, lon, radius)
              }
            }}
            disabled={fetching}
            className="mt-2 w-full h-9 rounded-2xl text-[11px] font-bold bg-sky-500/95 hover:bg-sky-500 text-white shadow-aurora-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {fetching ? '⏳ Загружаю…' : (buildings.length > 0 ? '🔄 Обновить' : '⬇️ Загрузить здания')}
          </button>

          {error && (
            <p className="mt-2 text-[10px] text-red-600 leading-snug bg-red-500/10 rounded-lg px-2 py-1">
              ⚠️ {error}
            </p>
          )}

          {buildings.length > 0 && (
            <div className="mt-2 flex items-center justify-between text-[10px] text-black/65">
              <span>🏢 {buildings.length} зданий{fetchedAt ? ` · ${formatHHMM(fetchedAt)}` : ''}</span>
              <button
                type="button"
                onClick={() => clear()}
                className="px-2 py-0.5 rounded-full bg-black/10 hover:bg-black/15 text-black/70 font-bold transition-colors"
              >
                Очистить
              </button>
            </div>
          )}

          {!enabled && buildings.length > 0 && (
            <p className="mt-2 text-[10px] text-black/50 leading-snug">
              Данные загружены, но слой выключен. Нажми ON, чтобы увидеть.
            </p>
          )}
        </>
      )}
    </div>
  )
}
