'use client'

import { useMemo, type CSSProperties } from 'react'
import { useConfigurator } from '@/stores/configurator'
import { useThermal, type ThermalSeason } from '@/stores/thermal'
import { computeThermal, heatLossColor } from '@/lib/thermal'

const SEASONS: Array<{ id: ThermalSeason; label: string; emoji: string }> = [
  { id: 'winter', label: 'Зима', emoji: '❄️' },
  { id: 'spring', label: 'Весна', emoji: '🌱' },
  { id: 'summer', label: 'Лето', emoji: '☀️' },
  { id: 'autumn', label: 'Осень', emoji: '🍂' },
]

const MATERIAL_LABELS: Record<string, { label: string; emoji: string }> = {
  container: { label: 'Контейнер', emoji: '📦' },
  timber: { label: 'Дерево', emoji: '🪵' },
  hybrid: { label: 'Гибрид', emoji: '⚡' },
}

const SWATCH_STYLE: CSSProperties = {
  display: 'inline-block',
  width: 10,
  height: 10,
  borderRadius: 999,
  marginRight: 6,
}

export function ThermalPanel() {
  const enabled = useThermal((s) => s.enabled)
  const setEnabled = useThermal((s) => s.setEnabled)
  const season = useThermal((s) => s.season)
  const setSeason = useThermal((s) => s.setSeason)
  const outdoorTempC = useThermal((s) => s.outdoorTempC)
  const setOutdoorTempC = useThermal((s) => s.setOutdoorTempC)
  const indoorTargetC = useThermal((s) => s.indoorTargetC)
  const setIndoorTargetC = useThermal((s) => s.setIndoorTargetC)
  const modules = useConfigurator((s) => s.modules)

  const summary = useMemo(
    () => computeThermal(modules, outdoorTempC, indoorTargetC),
    [modules, outdoorTempC, indoorTargetC],
  )

  return (
    <div className="glass rounded-3xl p-3.5 border border-hairline bg-white/60">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-base">🌡️</span>
          <span className="text-[13px] font-semibold text-ink">Тепловой анализ</span>
        </div>
        <button
          type="button"
          onClick={() => setEnabled(!enabled)}
          className={`text-[10px] font-bold uppercase tracking-wide rounded-full px-2.5 py-1 ${
            enabled ? 'bg-aurora-primary text-white shadow-aurora-primary' : 'bg-ink/10 text-ink2'
          }`}
        >
          {enabled ? 'ON' : 'off'}
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-2.5">
        {SEASONS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSeason(s.id)}
            className={`text-[11px] font-bold rounded-full px-2.5 py-1 ${
              season === s.id ? 'bg-ink text-white' : 'bg-ink/5 text-ink2 hover:bg-ink/10'
            }`}
          >
            {s.emoji} {s.label}
          </button>
        ))}
      </div>

      <label className="block mb-2">
        <div className="flex items-center justify-between text-[11px] text-ink2 mb-1">
          <span>Снаружи</span>
          <span className="font-mono text-ink">{outdoorTempC.toFixed(0)} °C</span>
        </div>
        <input
          type="range"
          min={-30}
          max={40}
          step={1}
          value={outdoorTempC}
          onChange={(e) => setOutdoorTempC(parseFloat(e.target.value))}
          className="aurora-range w-full"
        />
      </label>

      <label className="block mb-2.5">
        <div className="flex items-center justify-between text-[11px] text-ink2 mb-1">
          <span>Внутри (цель)</span>
          <span className="font-mono text-ink">{indoorTargetC.toFixed(0)} °C</span>
        </div>
        <input
          type="range"
          min={15}
          max={25}
          step={1}
          value={indoorTargetC}
          onChange={(e) => setIndoorTargetC(parseFloat(e.target.value))}
          className="aurora-range w-full"
        />
      </label>

      <div className="rounded-2xl bg-ink/5 px-3 py-2 mb-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-ink2">Суммарные потери</span>
          <span className="text-[14px] font-bold text-ink">
            {summary.totalKw >= 1
              ? `${summary.totalKw.toFixed(2)} кВт`
              : `${summary.totalWatts.toFixed(0)} Вт`}
          </span>
        </div>
        <div className="text-[10px] text-ink3 mt-0.5">
          ΔT = {summary.deltaT.toFixed(0)} °C · {modules.length} модулей
        </div>
      </div>

      {modules.length > 0 && (
        <div className="flex flex-col gap-1">
          {(['container', 'timber', 'hybrid'] as const).map((mat) => {
            const w = summary.perMaterial[mat]
            if (Math.abs(w) < 1) return null
            const meta = MATERIAL_LABELS[mat]
            return (
              <div key={mat} className="flex items-center justify-between text-[11px]">
                <span className="text-ink2">
                  <span style= ...SWATCH_STYLE, background: heatLossColor(w / 50)  />
                  {meta.emoji} {meta.label}
                </span>
                <span className="font-mono text-ink">
                  {w >= 1000 ? `${(w / 1000).toFixed(2)} кВт` : `${w.toFixed(0)} Вт`}
                </span>
              </div>
            )
          })}
        </div>
      )}

      {modules.length === 0 && (
        <div className="text-[11px] text-ink3 mt-1">Добавь модули, чтобы увидеть теплопотери.</div>
      )}
    </div>
  )
}
