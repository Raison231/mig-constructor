'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useHeal } from '@/stores/heal'
import {
  clearAllSnapshots,
  formatRelativeTime,
  listSnapshots,
  quickSnapshot,
  restoreLatest,
} from '@/lib/migHeal'

const POPOVER_STYLE: CSSProperties = {
  width: 320,
}

function fpsTone(fps: number): { dot: string; ring: string; label: string } {
  if (fps >= 50) return { dot: 'bg-emerald-500', ring: 'ring-emerald-500/30', label: 'text-emerald-600' }
  if (fps >= 30) return { dot: 'bg-amber-500', ring: 'ring-amber-500/30', label: 'text-amber-600' }
  return { dot: 'bg-rose-500', ring: 'ring-rose-500/30', label: 'text-rose-600' }
}

export function HealthBadge() {
  const fps = useHeal((s) => s.fps)
  const frameMs = useHeal((s) => s.frameMs)
  const drawCalls = useHeal((s) => s.drawCalls)
  const triangles = useHeal((s) => s.triangles)
  const geometries = useHeal((s) => s.geometries)
  const textures = useHeal((s) => s.textures)
  const contextLostCount = useHeal((s) => s.contextLostCount)
  const lastSnapshotAt = useHeal((s) => s.lastSnapshotAt)
  const events = useHeal((s) => s.events)
  const autoSnapshotEnabled = useHeal((s) => s.autoSnapshotEnabled)
  const setAutoSnapshotEnabled = useHeal((s) => s.setAutoSnapshotEnabled)
  const autoSnapshotIntervalSec = useHeal((s) => s.autoSnapshotIntervalSec)
  const setAutoSnapshotIntervalSec = useHeal((s) => s.setAutoSnapshotIntervalSec)

  const [open, setOpen] = useState(false)
  const [snapshotCount, setSnapshotCount] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    setSnapshotCount(listSnapshots().length)
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current) return
      if (!rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const tone = fpsTone(fps)
  const ctxBad = contextLostCount > 0

  function handleSnapshot() {
    quickSnapshot('manual')
    setSnapshotCount(listSnapshots().length)
  }

  function handleRestore() {
    const ok = restoreLatest()
    if (!ok) {
      // event already pushed by lib if any
    }
  }

  function handleClear() {
    clearAllSnapshots()
    setSnapshotCount(0)
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`glass rounded-2xl px-2.5 py-1.5 text-[11px] font-semibold text-ink hover:bg-white transition flex items-center gap-1.5 ring-1 ${tone.ring}`}
        title="FIELD HEAL · диагностика и резервный снапшот"
      >
        <span className={`inline-block h-1.5 w-1.5 rounded-full ${tone.dot} ${fps < 50 ? 'animate-pulse' : ''}`} />
        <span className={`tabular-nums ${tone.label}`}>{Math.round(fps)}</span>
        <span className="text-ink3">fps</span>
        {ctxBad && <span className="ml-0.5 text-rose-600">🛟</span>}
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 rounded-3xl border border-hairline bg-white/95 backdrop-blur p-4 shadow-aurora-primary text-ink animate-fade-up"
          style={POPOVER_STYLE}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-base">🛟</span>
              <span className="font-semibold text-[13px]">FIELD HEAL</span>
            </div>
            <span className="text-[10px] text-ink3">v1</span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 mb-3">
            <Stat label="FPS" value={`${fps.toFixed(1)}`} tone={tone.label} />
            <Stat label="Frame" value={`${frameMs.toFixed(1)}ms`} />
            <Stat label="Draws" value={String(drawCalls)} />
            <Stat label="Tris" value={formatBig(triangles)} />
            <Stat label="Geom" value={String(geometries)} />
            <Stat label="Tex" value={String(textures)} />
          </div>

          <div className="flex items-center justify-between text-[11px] mb-3">
            <span className="text-ink2">Context loss</span>
            <span className={ctxBad ? 'text-rose-600 font-semibold' : 'text-ink3'}>
              {contextLostCount}
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-ink2">Авто-снапшот</span>
            <button
              onClick={() => setAutoSnapshotEnabled(!autoSnapshotEnabled)}
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold border ${autoSnapshotEnabled ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-ink2 border-hairline'}`}
            >
              {autoSnapshotEnabled ? 'ON' : 'OFF'}
            </button>
          </div>
          {autoSnapshotEnabled && (
            <div className="flex items-center gap-2 mb-3">
              <input
                type="range"
                min={5}
                max={300}
                step={5}
                value={autoSnapshotIntervalSec}
                onChange={(e) => setAutoSnapshotIntervalSec(Number(e.target.value))}
                className="flex-1 accent-emerald-500"
              />
              <span className="text-[10px] tabular-nums text-ink3 w-12 text-right">{autoSnapshotIntervalSec}с</span>
            </div>
          )}

          <div className="text-[10px] text-ink3 mb-2">
            Снапшотов: <span className="text-ink font-semibold">{snapshotCount}</span>
            <span className="mx-1">·</span>
            Последний: <span className="text-ink">{formatRelativeTime(lastSnapshotAt)}</span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 mb-3">
            <button onClick={handleSnapshot} className="rounded-2xl bg-brand-primary text-white text-[10px] font-bold py-1.5 hover:bg-emerald-600 transition">📸 Сохранить</button>
            <button onClick={handleRestore} className="rounded-2xl bg-brand-secondary text-white text-[10px] font-bold py-1.5 hover:bg-sky-500 transition">⟲ Откатить</button>
            <button onClick={handleClear} className="rounded-2xl bg-white text-brand-coral text-[10px] font-bold py-1.5 border border-brand-coral/30 hover:bg-rose-50 transition">🗑 Очистить</button>
          </div>

          {events.length > 0 && (
            <div className="max-h-32 overflow-y-auto rounded-2xl bg-ink/[0.03] p-2">
              {events.slice(0, 6).map((e) => (
                <div key={e.id} className="flex items-start gap-1.5 text-[10px] py-0.5">
                  <span className="shrink-0">{kindIcon(e.kind)}</span>
                  <span className="text-ink2 flex-1 truncate" title={e.message}>{e.message}</span>
                  <span className="text-ink3 shrink-0 tabular-nums">{formatRelativeTime(e.at)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="rounded-2xl bg-ink/[0.03] px-2 py-1.5">
      <div className="text-[9px] uppercase tracking-wider text-ink3">{label}</div>
      <div className={`text-[12px] font-bold tabular-nums ${tone ?? 'text-ink'}`}>{value}</div>
    </div>
  )
}

function kindIcon(k: string) {
  switch (k) {
    case 'snapshot': return '📸'
    case 'restore': return '⟲'
    case 'context_lost': return '⚠️'
    case 'context_restored': return '✅'
    case 'clear': return '🗑'
    case 'error': return '🛑'
    default: return '•'
  }
}

function formatBig(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
  return String(n)
}
