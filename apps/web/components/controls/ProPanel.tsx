'use client'

import { useConfigurator } from '@/stores/configurator'
import { useCost } from '@/stores/cost'
import { useMeasure } from '@/stores/measure'
import { useLocale } from '@/stores/locale'
import { t } from '@mig/i18n'
import { calculateEnergyScore } from '@/lib/energy-score'
import { generateBomPdf } from '@/lib/bom-pdf'
import { useMemo, useState } from 'react'

const RATING_COLOR: Record<string, string> = {
  'A+': 'text-accent-green',
  'A':  'text-accent-green',
  'B':  'text-yellow-400',
  'C':  'text-orange-400',
  'D':  'text-red-400',
}

export function ProPanel() {
  const modules = useConfigurator((s) => s.modules)
  const locale = useLocale((s) => s.locale)

  const matPremium = useCost((s) => s.materialPremium)
  const locMult    = useCost((s) => s.locationMultiplier)
  const rushMult   = useCost((s) => s.rushMultiplier)
  const setMatPremium = useCost((s) => s.setMaterialPremium)
  const setLocMult    = useCost((s) => s.setLocationMultiplier)
  const setRushMult   = useCost((s) => s.setRushMultiplier)
  const resetCost     = useCost((s) => s.reset)

  const measureActive = useMeasure((s) => s.active)
  const setMeasureActive = useMeasure((s) => s.setActive)
  const clearMeasure = useMeasure((s) => s.clear)

  const [bomBusy, setBomBusy] = useState(false)
  const [tab, setTab] = useState<'energy' | 'cost' | 'tools'>('energy')

  const energy = useMemo(() => calculateEnergyScore(modules), [modules])

  function handleBom() {
    if (modules.length === 0) return
    setBomBusy(true)
    try {
      generateBomPdf(modules, {
        materialPremium: matPremium,
        locationMultiplier: locMult,
        rushMultiplier: rushMult,
      })
    } finally {
      setTimeout(() => setBomBusy(false), 400)
    }
  }

  return (
    <div className="glass rounded-2xl p-3 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-xs uppercase tracking-wider text-fg-secondary">
          {t('pro.title', locale)}
        </h2>
        <span className="text-[9px] text-accent-green font-mono">v0.6</span>
      </div>

      <div className="grid grid-cols-3 gap-1">
        {(['energy', 'cost', 'tools'] as const).map((k) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`rounded-md py-1 text-[10px] ${tab === k ? 'bg-accent-green text-bg' : 'bg-bg hover:bg-panel'}`}
          >
            {t(`pro.tab.${k}`, locale)}
          </button>
        ))}
      </div>

      {tab === 'energy' && (
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="text-[10px] text-fg-secondary">{t('energy.rating', locale)}</span>
            <span className={`text-2xl font-bold font-mono ${RATING_COLOR[energy.rating] ?? 'text-fg'}`}>
              {energy.rating}
            </span>
          </div>
          <Bar label={t('energy.autonomy', locale)} value={energy.autonomyPct} suffix="%" max={100} />
          <Row label={t('energy.kwh', locale)}  value={`${energy.consumptionKwhYear.toLocaleString()} kWh/y`} />
          <Row label={t('energy.solar', locale)} value={`${energy.solarKwhYear.toLocaleString()} kWh/y`} />
          <Row label={t('energy.water', locale)} value={`${energy.waterLDay.toLocaleString()} L/day`} />
          <Row label={t('energy.co2', locale)}   value={`${energy.co2EmbodiedKg.toLocaleString()} kg CO2`} />
          {!energy.hasWaterSource && (
            <div className="text-[9px] text-yellow-400/80">{t('energy.noWater', locale)}</div>
          )}
          {energy.autonomyPct < 30 && energy.consumptionKwhYear > 0 && (
            <div className="text-[9px] text-orange-400/80">{t('energy.lowAutonomy', locale)}</div>
          )}
        </div>
      )}

      {tab === 'cost' && (
        <div className="space-y-3">
          <Slider
            label={t('cost.material', locale)}
            value={matPremium}
            min={0} max={1} step={0.05}
            onChange={setMatPremium}
            display={`+${Math.round(matPremium * 100)}%`}
          />
          <Slider
            label={t('cost.location', locale)}
            value={locMult}
            min={1} max={2} step={0.05}
            onChange={setLocMult}
            display={`x${locMult.toFixed(2)}`}
          />
          <Slider
            label={t('cost.rush', locale)}
            value={rushMult}
            min={1} max={2} step={0.05}
            onChange={setRushMult}
            display={`x${rushMult.toFixed(2)}`}
          />
          <button
            onClick={resetCost}
            className="w-full text-[10px] py-1 rounded-md bg-bg hover:bg-panel text-fg-secondary"
          >
            {t('cost.reset', locale)}
          </button>
        </div>
      )}

      {tab === 'tools' && (
        <div className="space-y-2">
          <button
            onClick={handleBom}
            disabled={modules.length === 0 || bomBusy}
            className="w-full text-[11px] py-2 rounded-md bg-accent-green text-bg font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110"
          >
            {bomBusy ? '...' : `\ud83d\udcc4 ${t('pro.bom', locale)}`}
          </button>
          <button
            onClick={() => setMeasureActive(!measureActive)}
            className={`w-full text-[11px] py-2 rounded-md font-medium ${measureActive ? 'bg-accent-orange text-bg' : 'bg-bg hover:bg-panel'}`}
          >
            {measureActive ? `\u25fc ${t('pro.measureOn', locale)}` : `\ud83d\udccf ${t('pro.measure', locale)}`}
          </button>
          {measureActive && (
            <>
              <div className="text-[9px] text-fg-secondary leading-tight">
                {t('pro.measureHint', locale)}
              </div>
              <button
                onClick={clearMeasure}
                className="w-full text-[10px] py-1 rounded-md bg-bg hover:bg-panel text-fg-secondary"
              >
                {t('pro.measureClear', locale)}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-[10px]">
      <span className="text-fg-secondary">{label}</span>
      <span className="font-mono text-fg">{value}</span>
    </div>
  )
}

function Bar({ label, value, max, suffix }: { label: string; value: number; max: number; suffix?: string }) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div>
      <div className="flex items-center justify-between text-[10px] mb-1">
        <span className="text-fg-secondary">{label}</span>
        <span className="font-mono text-fg">{value}{suffix}</span>
      </div>
      <div className="h-1.5 rounded-full bg-bg overflow-hidden">
        <div
          className="h-full bg-accent-green transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

function Slider({
  label, value, min, max, step, onChange, display,
}: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; display: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-[10px] mb-1">
        <span className="text-fg-secondary">{label}</span>
        <span className="font-mono text-accent-green">{display}</span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-accent-green"
      />
    </div>
  )
}
