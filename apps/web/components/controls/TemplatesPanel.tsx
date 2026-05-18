'use client'

import { useState } from 'react'
import { useConfigurator } from '@/stores/configurator'
import { useTemplates } from '@/stores/templates'
import { useCompare } from '@/stores/compare'
import { useAnnotations } from '@/stores/annotations'
import { usePhysics } from '@/stores/physics'
import { useLocale } from '@/stores/locale'
import { t } from '@mig/i18n'
import { TemplatesGallery } from '@/components/ui/TemplatesGallery'
import { TEMPLATE_PRESETS } from '@/lib/template-presets'

interface ToggleButtonProps {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}

function ToggleButton({ active, onClick, children }: ToggleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        'rounded-xl px-2.5 py-1 text-[11px] font-bold transition border ' +
        (active
          ? 'bg-brand-primary text-white border-brand-primary shadow-aurora-primary'
          : 'bg-white/60 text-ink2 border-hairline hover:bg-white hover:text-ink')
      }
    >
      {children}
    </button>
  )
}

export function TemplatesPanel() {
  const [galleryOpen, setGalleryOpen] = useState(false)
  const locale = useLocale((s) => s.locale)

  const modules = useConfigurator((s) => s.modules)
  const activePresetId = useTemplates((s) => s.activePresetId)

  const compareActive = useCompare((s) => s.active)
  const setCompareActive = useCompare((s) => s.setActive)
  const snapshotToA = useCompare((s) => s.snapshotToA)
  const snapshotToB = useCompare((s) => s.snapshotToB)
  const snapshotA = useCompare((s) => s.snapshotA)
  const snapshotB = useCompare((s) => s.snapshotB)

  const annActive = useAnnotations((s) => s.active)
  const setAnnActive = useAnnotations((s) => s.setActive)
  const annAdd = useAnnotations((s) => s.add)
  const annList = useAnnotations((s) => s.list)
  const annClear = useAnnotations((s) => s.clear)

  const physicsActive = usePhysics((s) => s.active)
  const setPhysicsActive = usePhysics((s) => s.setActive)
  const dropAll = usePhysics((s) => s.dropAll)

  const activePreset = TEMPLATE_PRESETS.find((p) => p.id === activePresetId)
  const activePresetLabel = activePreset
    ? locale === 'ru' ? activePreset.nameRu : locale === 'ka' ? activePreset.nameKa : activePreset.nameEn
    : null

  const hasModules = modules.length > 0
  const hasSnapshot = !!(snapshotA || snapshotB)

  function handleAddNote() {
    if (!annActive) setAnnActive(true)
    const text = window.prompt(t('annotations.placeholder', locale))
    if (!text || !text.trim()) return
    annAdd({
      position: [0, 1.5, 0],
      text: text.trim(),
      color: '#10B981',
    })
  }

  return (
    <>
      <div className="glass rounded-3xl p-3.5">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink3">{t('w7.title', locale)}</div>
          {activePresetLabel && (
            <span className="rounded-full bg-brand-primary/12 text-brand-primary text-[10px] font-bold px-2 py-0.5 border border-brand-primary/25">{activePresetLabel}</span>
          )}
        </div>

        <div className="mb-3">
          <div className="mb-1.5 text-[10px] text-ink3 font-medium">{t('templates.title', locale)}</div>
          <button
            type="button"
            onClick={() => setGalleryOpen(true)}
            className="w-full rounded-2xl border border-hairline bg-gradient-to-r from-brand-primary/12 via-brand-secondary/12 to-brand-field/12 px-3 py-2.5 text-left text-[13px] font-bold text-ink hover:border-brand-primary/40 hover:from-brand-primary/18 hover:to-brand-field/18 transition"
          >
            🎨 {t('templates.open', locale)}
          </button>
        </div>

        <div className="mb-3">
          <div className="mb-1.5 text-[10px] text-ink3 font-medium">{t('physics.title', locale)}</div>
          <div className="flex flex-wrap gap-1.5">
            <ToggleButton active={physicsActive} onClick={() => setPhysicsActive(!physicsActive)}>
              {physicsActive ? t('physics.on', locale) : t('physics.off', locale)}
            </ToggleButton>
            <button
              type="button"
              onClick={() => { if (!physicsActive) setPhysicsActive(true); dropAll() }}
              className="rounded-xl border border-hairline bg-white/60 px-2.5 py-1 text-[11px] font-bold text-ink2 hover:bg-white hover:text-ink transition"
            >
              🏗️ {t('physics.dropAll', locale)}
            </button>
          </div>
        </div>

        <div className="mb-3">
          <div className="mb-1.5 flex items-center gap-2 text-[10px] text-ink3 font-medium">
            <span>{t('annotations.title', locale)}</span>
            <span className="rounded-full bg-brand-field/15 text-brand-field px-1.5 py-px text-[9px] font-extrabold">{annList.length}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <ToggleButton active={annActive} onClick={() => setAnnActive(!annActive)}>
              {annActive ? t('annotations.shown', locale) : t('annotations.hidden', locale)}
            </ToggleButton>
            <button
              type="button"
              onClick={handleAddNote}
              className="rounded-xl border border-hairline bg-white/60 px-2.5 py-1 text-[11px] font-bold text-ink2 hover:bg-white hover:text-ink transition"
            >
              + {t('annotations.add', locale)}
            </button>
            {annList.length > 0 && (
              <button
                type="button"
                onClick={annClear}
                className="rounded-xl border border-brand-coral/30 bg-brand-coral/10 px-2.5 py-1 text-[11px] font-bold text-brand-coral hover:bg-brand-coral hover:text-white transition"
              >
                {t('annotations.clear', locale)}
              </button>
            )}
          </div>
        </div>

        <div>
          <div className="mb-1.5 text-[10px] text-ink3 font-medium">{t('compare.title', locale)}</div>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => snapshotToA(modules)}
              disabled={!hasModules}
              className="rounded-xl border border-hairline bg-white/60 px-2.5 py-1 text-[11px] font-bold text-ink hover:bg-white hover:border-brand-primary/40 disabled:cursor-not-allowed disabled:opacity-40 transition"
            >
              📸 A ({snapshotA?.length ?? 0})
            </button>
            <button
              type="button"
              onClick={() => snapshotToB(modules)}
              disabled={!hasModules}
              className="rounded-xl border border-hairline bg-white/60 px-2.5 py-1 text-[11px] font-bold text-ink hover:bg-white hover:border-brand-secondary/40 disabled:cursor-not-allowed disabled:opacity-40 transition"
            >
              📸 B ({snapshotB?.length ?? 0})
            </button>
            <button
              type="button"
              onClick={() => setCompareActive(!compareActive)}
              disabled={!hasSnapshot}
              className="rounded-xl border border-brand-primary bg-brand-primary px-2.5 py-1 text-[11px] font-extrabold text-white hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 shadow-aurora-primary transition"
            >
              ⚚ {compareActive ? t('compare.close', locale) : t('compare.open', locale)}
            </button>
          </div>
        </div>
      </div>

      <TemplatesGallery open={galleryOpen} onClose={() => setGalleryOpen(false)} />
    </>
  )
}
