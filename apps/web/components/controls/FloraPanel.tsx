'use client'

import { useMemo } from 'react'
import { useFlora, ALL_SPECIES, type BiomeId } from '@/stores/flora'
import { useConfigurator } from '@/stores/configurator'
import { BIOMES, SPECIES, buildForest, totalTreeCount } from '@/lib/flora'

const BIOME_ORDER: BiomeId[] = ['forest', 'taiga', 'mediterranean', 'subtropical', 'meadow']

export function FloraPanel() {
  const enabled = useFlora((s) => s.enabled)
  const biome = useFlora((s) => s.biome)
  const density = useFlora((s) => s.density)
  const radius = useFlora((s) => s.radius)
  const seed = useFlora((s) => s.seed)
  const regenSalt = useFlora((s) => s.regenSalt)
  const minSpacing = useFlora((s) => s.minSpacing)
  const speciesEnabled = useFlora((s) => s.speciesEnabled)
  const windStrength = useFlora((s) => s.windStrength)
  const centerX = useFlora((s) => s.centerX)
  const centerZ = useFlora((s) => s.centerZ)
  const setEnabled = useFlora((s) => s.setEnabled)
  const setBiome = useFlora((s) => s.setBiome)
  const setDensity = useFlora((s) => s.setDensity)
  const setRadius = useFlora((s) => s.setRadius)
  const setSeed = useFlora((s) => s.setSeed)
  const setMinSpacing = useFlora((s) => s.setMinSpacing)
  const setWindStrength = useFlora((s) => s.setWindStrength)
  const toggleSpecies = useFlora((s) => s.toggleSpecies)
  const regenerate = useFlora((s) => s.regenerate)
  const modules = useConfigurator((s) => s.modules)

  const count = useMemo(() => {
    if (!enabled) return 0
    const forest = buildForest({
      enabled: true, biome, density, radius, centerX, centerZ, seed, regenSalt,
      minSpacing, speciesEnabled, modules,
    })
    return totalTreeCount(forest)
    // build is cheap enough for panel preview; depends on same inputs as the scene.
  }, [enabled, biome, density, radius, centerX, centerZ, seed, regenSalt, minSpacing, speciesEnabled, modules])

  return (
    <div className="glass rounded-3xl p-3.5">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink3">🌲 Flora</div>
        <button
          onClick={() => setEnabled(!enabled)}
          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border transition ${enabled ? 'bg-emerald-500 text-white border-emerald-500 shadow-aurora-primary' : 'bg-white text-ink2 border-hairline hover:text-ink'}`}
        >
          {enabled ? 'ON' : 'OFF'}
        </button>
      </div>

      {enabled && (
        <>
          <div className="grid grid-cols-5 gap-1 mb-3">
            {BIOME_ORDER.map((b) => {
              const def = BIOMES[b]
              const active = biome === b
              return (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBiome(b)}
                  title={def.description}
                  className={active
                    ? 'rounded-xl border border-brand-primary bg-brand-primary text-white py-1.5 text-[10px] font-extrabold shadow-aurora-primary transition'
                    : 'rounded-xl border border-hairline bg-white/60 text-ink2 hover:bg-white hover:text-ink py-1.5 text-[10px] font-bold transition'
                  }
                >
                  <div className="text-base leading-none">{def.emoji}</div>
                  <div className="mt-0.5">{def.label}</div>
                </button>
              )
            })}
          </div>

          <div className="space-y-2.5">
            <SliderRow label="Плотность" value={density} display={`${Math.round(density * 100)}%`} min={0.05} max={1} step={0.05} onChange={setDensity} />
            <SliderRow label="Радиус" value={radius} display={`${radius.toFixed(0)} м`} min={10} max={80} step={1} onChange={setRadius} />
            <SliderRow label="Расстояние" value={minSpacing} display={`${minSpacing.toFixed(1)} м`} min={1.2} max={6} step={0.1} onChange={setMinSpacing} />
            <SliderRow label="Ветер" value={windStrength} display={`${Math.round(windStrength * 100)}%`} min={0} max={1} step={0.05} onChange={setWindStrength} />
          </div>

          <div className="mt-3 pt-3 border-t border-hairline">
            <div className="text-[10px] uppercase tracking-wider text-ink3 mb-1.5">Виды</div>
            <div className="grid grid-cols-3 gap-1">
              {ALL_SPECIES.map((s) => {
                const def = SPECIES[s]
                const on = speciesEnabled[s]
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSpecies(s)}
                    title={def.label}
                    className={on
                      ? 'rounded-xl border border-emerald-500 bg-emerald-500/15 text-emerald-700 py-1 text-[10px] font-bold transition'
                      : 'rounded-xl border border-hairline bg-white/40 text-ink3 hover:text-ink py-1 text-[10px] font-medium transition'
                    }
                  >
                    <span className="mr-0.5">{def.emoji}</span>{def.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="text-[10px] text-ink3">
              Деревьев: <span className="font-bold text-emerald-600 tabular-nums">{count}</span>
              <span className="mx-1">·</span>
              seed <span className="font-mono text-ink2">{seed}</span>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setSeed(Math.floor(Math.random() * 1_000_000))}
                className="rounded-2xl bg-white/60 border border-hairline text-ink2 hover:text-ink hover:bg-white text-[10px] font-bold px-2 py-1 transition"
                title="Случайный seed"
              >
                🎲
              </button>
              <button
                onClick={regenerate}
                className="rounded-2xl bg-brand-primary text-white text-[10px] font-extrabold px-2.5 py-1 hover:bg-emerald-600 transition shadow-aurora-primary"
                title="Перераспределить деревья"
              >
                ⟳ Пересадить
              </button>
            </div>
          </div>
        </>
      )}
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
        <span className="font-mono text-emerald-600 font-bold">{display}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="aurora-range w-full"
      />
    </div>
  )
}
