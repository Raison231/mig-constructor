'use client'

import dynamic from 'next/dynamic'
import { useCompare } from '@/stores/compare'
import { useLocale } from '@/stores/locale'
import { t } from '@mig/i18n'
import { calculatePrice } from '@mig/pricing-engine'

const SnapshotScene = dynamic(() => import('@/components/three/SnapshotScene').then((m) => m.SnapshotScene), {
  ssr: false,
  loading: () => null,
})

export function CompareView() {
  const active = useCompare((s) => s.active)
  const snapshotA = useCompare((s) => s.snapshotA)
  const snapshotB = useCompare((s) => s.snapshotB)
  const swap = useCompare((s) => s.swap)
  const clear = useCompare((s) => s.clear)
  const locale = useLocale((s) => s.locale)

  if (!active) return null

  const priceA = snapshotA ? calculatePrice(snapshotA) : 0
  const priceB = snapshotB ? calculatePrice(snapshotB) : 0

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-bg">
      <div className="flex items-center justify-between border-b border-white/10 bg-panel px-6 py-3">
        <div className="flex items-center gap-4">
          <h2 className="text-base font-bold text-fg">{t('compare.title', locale)}</h2>
          <span className="text-xs text-fg-muted">
            A: {snapshotA?.length ?? 0} · {Math.round(priceA).toLocaleString()} GEL   |   B: {snapshotB?.length ?? 0} · {Math.round(priceB).toLocaleString()} GEL
          </span>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={swap} className="rounded-md border border-white/10 px-3 py-1 text-sm text-fg hover:bg-white/5">
            {t('compare.swap', locale)}
          </button>
          <button type="button" onClick={clear} className="rounded-md border border-acc px-3 py-1 text-sm font-semibold text-acc hover:bg-acc hover:text-bg">
            {t('compare.close', locale)}
          </button>
        </div>
      </div>
      <div className="grid flex-1 grid-cols-2 gap-px bg-white/10">
        <div className="relative bg-bg">
          {snapshotA && snapshotA.length > 0 ? (
            <SnapshotScene modules={snapshotA} label={`A · ${t('compare.snapshotA', locale)}`} />
          ) : (
            <div className="flex h-full items-center justify-center text-fg-muted">{t('compare.emptyA', locale)}</div>
          )}
        </div>
        <div className="relative bg-bg">
          {snapshotB && snapshotB.length > 0 ? (
            <SnapshotScene modules={snapshotB} label={`B · ${t('compare.snapshotB', locale)}`} />
          ) : (
            <div className="flex h-full items-center justify-center text-fg-muted">{t('compare.emptyB', locale)}</div>
          )}
        </div>
      </div>
    </div>
  )
}
