'use client'

import { useState } from 'react'
import { useLand } from '@/stores/land'
import { fetchHeightmap } from '@/lib/topography'

export function LandPanel() {
  const enabled = useLand((s) => s.enabled)
  const imageDataUrl = useLand((s) => s.imageDataUrl)
  const widthMeters = useLand((s) => s.widthMeters)
  const rotationDeg = useLand((s) => s.rotationDeg)
  const offsetX = useLand((s) => s.offsetX)
  const offsetZ = useLand((s) => s.offsetZ)
  const opacity = useLand((s) => s.opacity)
  const heightmap = useLand((s) => s.heightmap)
  const heightmapScale = useLand((s) => s.heightmapScale)
  const lat = useLand((s) => s.lat)
  const lon = useLand((s) => s.lon)
  const setEnabled = useLand((s) => s.setEnabled)
  const setImage = useLand((s) => s.setImage)
  const setWidthMeters = useLand((s) => s.setWidthMeters)
  const setRotationDeg = useLand((s) => s.setRotationDeg)
  const setOffset = useLand((s) => s.setOffset)
  const setOpacity = useLand((s) => s.setOpacity)
  const setLatLon = useLand((s) => s.setLatLon)
  const setHeightmap = useLand((s) => s.setHeightmap)
  const setHeightmapScale = useLand((s) => s.setHeightmapScale)
  const reset = useLand((s) => s.reset)

  const [latInput, setLatInput] = useState(lat?.toString() ?? '41.715')
  const [lonInput, setLonInput] = useState(lon?.toString() ?? '44.827')
  const [sizeKm, setSizeKm] = useState(0.2)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  function onImageFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') setImage(reader.result, f.type)
    }
    reader.readAsDataURL(f)
  }

  async function loadTopography() {
    setErr(null)
    const la = parseFloat(latInput)
    const lo = parseFloat(lonInput)
    if (Number.isNaN(la) || Number.isNaN(lo)) {
      setErr('\u041A\u043E\u043E\u0440\u0434\u0438\u043D\u0430\u0442\u044B \u043D\u0435\u0432\u0430\u043B\u0438\u0434\u043D\u044B\u0435')
      return
    }
    setLoading(true)
    try {
      const r = await fetchHeightmap(la, lo, sizeKm * 1000, 32)
      setLatLon(la, lo)
      setHeightmap(r.heights, r.size)
      setWidthMeters(r.sizeMeters)
      setEnabled(true)
    } catch (e) {
      console.error('[topography]', e)
      setErr('\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0432\u044B\u0441\u043E\u0442\u044B')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass rounded-2xl p-4 space-y-3 text-xs text-ink">
      <div className="flex items-center justify-between">
        <div className="font-bold text-ink tracking-wide uppercase text-[11px]">\u{1F5FA}\uFE0F \u0423\u0447\u0430\u0441\u0442\u043E\u043A</div>
        <label className="inline-flex items-center gap-1 cursor-pointer">
          <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} className="accent-brand-primary" />
          <span className="text-[10px] text-ink2">\u0432\u043A\u043B</span>
        </label>
      </div>

      <div className="space-y-2">
        <label className="block">
          <span className="text-[10px] text-ink3 uppercase tracking-wider">\u0424\u043E\u0442\u043E / \u043F\u043B\u0430\u043D \u0443\u0447\u0430\u0441\u0442\u043A\u0430</span>
          <input type="file" accept="image/*" onChange={onImageFile} className="mt-1 block w-full text-[10px] text-ink2 file:mr-2 file:rounded-full file:border-0 file:bg-brand-primary file:px-3 file:py-1 file:text-[10px] file:font-semibold file:text-white hover:file:bg-brand-primary/90" />
        </label>
        {imageDataUrl && (
          <button onClick={() => setImage(null, null)} className="text-[10px] text-brand-coral hover:underline">\u{1F5D1} \u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435</button>
        )}
      </div>

      <div className="space-y-2">
        <SliderRow label="\u0420\u0430\u0437\u043C\u0435\u0440, \u043C" value={widthMeters} min={5} max={500} step={1} onChange={setWidthMeters} />
        <SliderRow label="\u041F\u043E\u0432\u043E\u0440\u043E\u0442, \u00B0" value={rotationDeg} min={-180} max={180} step={1} onChange={setRotationDeg} />
        <SliderRow label="\u041F\u0440\u043E\u0437\u0440\u0430\u0447\u043D\u043E\u0441\u0442\u044C" value={opacity} min={0} max={1} step={0.05} onChange={setOpacity} />
        <div className="grid grid-cols-2 gap-2">
          <NumberInput label="X offset" value={offsetX} step={0.5} onChange={(v) => setOffset(v, offsetZ)} />
          <NumberInput label="Z offset" value={offsetZ} step={0.5} onChange={(v) => setOffset(offsetX, v)} />
        </div>
      </div>

      <div className="border-t border-black/10 pt-3 space-y-2">
        <div className="text-[10px] text-ink3 uppercase tracking-wider">\u{1F310} \u0422\u043E\u043F\u043E\u0433\u0440\u0430\u0444\u0438\u044F (SRTM)</div>
        <div className="grid grid-cols-2 gap-2">
          <label className="block">
            <span className="text-[10px] text-ink3">\u0428\u0438\u0440\u043E\u0442\u0430</span>
            <input value={latInput} onChange={(e) => setLatInput(e.target.value)} className="mt-0.5 w-full rounded-md border border-black/10 bg-white px-2 py-1 text-xs text-ink" />
          </label>
          <label className="block">
            <span className="text-[10px] text-ink3">\u0414\u043E\u043B\u0433\u043E\u0442\u0430</span>
            <input value={lonInput} onChange={(e) => setLonInput(e.target.value)} className="mt-0.5 w-full rounded-md border border-black/10 bg-white px-2 py-1 text-xs text-ink" />
          </label>
        </div>
        <SliderRow label={`\u0420\u0430\u0434\u0438\u0443\u0441: ${sizeKm.toFixed(2)} \u043A\u043C`} value={sizeKm} min={0.05} max={2} step={0.05} onChange={setSizeKm} hideValue />
        <button
          onClick={loadTopography}
          disabled={loading}
          className="w-full rounded-2xl bg-brand-secondary px-3 py-2 text-[11px] font-semibold text-white shadow-aurora-primary hover:bg-brand-secondary/90 disabled:opacity-50 transition"
        >
          {loading ? '\u23F3 \u0413\u0440\u0443\u0437\u0438\u043C \u0432\u044B\u0441\u043E\u0442\u044B\u2026' : '\u{1F310} \u041F\u043E\u0434\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0432\u044B\u0441\u043E\u0442\u044B'}
        </button>
        {heightmap && (
          <>
            <div className="text-[10px] text-ink2">\u0412\u044B\u0441\u043E\u0442\u044B: {heightmap.length} \u0442\u043E\u0447\u0435\u043A</div>
            <SliderRow label="\u0423\u0441\u0438\u043B\u0435\u043D\u0438\u0435 \u0440\u0435\u043B\u044C\u0435\u0444\u0430" value={heightmapScale} min={0.1} max={5} step={0.1} onChange={setHeightmapScale} />
          </>
        )}
        {err && <div className="text-[10px] text-brand-coral">{err}</div>}
      </div>

      <button onClick={reset} className="w-full text-[10px] text-brand-coral hover:underline">⟲ \u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u0443\u0447\u0430\u0441\u0442\u043E\u043A</button>
    </div>
  )
}

type SliderProps = { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; hideValue?: boolean }

function SliderRow({ label, value, min, max, step, onChange, hideValue }: SliderProps) {
  return (
    <label className="block">
      <div className="flex justify-between text-[10px] text-ink3">
        <span>{label}</span>
        {!hideValue && <span className="text-ink2">{value.toFixed(2)}</span>}
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} className="mt-0.5 w-full accent-brand-primary" />
    </label>
  )
}

type NumberInputProps = { label: string; value: number; step: number; onChange: (v: number) => void }

function NumberInput({ label, value, step, onChange }: NumberInputProps) {
  return (
    <label className="block">
      <span className="text-[10px] text-ink3">{label}</span>
      <input type="number" value={value} step={step} onChange={(e) => onChange(parseFloat(e.target.value) || 0)} className="mt-0.5 w-full rounded-md border border-black/10 bg-white px-2 py-1 text-xs text-ink" />
    </label>
  )
}
