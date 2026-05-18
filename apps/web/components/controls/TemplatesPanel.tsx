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
        'rounded-md border px-2 py-1 text-xs font-medium transition ' +
        (active
          ? 'border-acc bg-acc text-bg'
          : 'border-white/10 text-fg-muted hover:border-white/30 hover:text-fg')
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

  function handleAddNote() {
    if (!annActive) setAnnActive(true)
    const text = window.prompt(t('annotations.placeholder', locale))
    if (!text || !text.trim()) return
    annAdd({
      position: [0, 1.5, 0],
      text: text.trim(),
      color: '#00D26A',
    })
  }

  return (
    <>
      <div className="rounded-xl border border-white/10 bg-panel/95 p-3 backdrop-blur">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-xs font-bold uppercase tracking-wider text-fg">{t('w7.title', locale)}</div>
          {activePresetLabel && (
            <span className="rounded-full bg-acc/20 px-2 py-0.5 text-[10px] font-semibold text-acc">{activePresetLabel}</span>
          )}
        </div>

        {/* Templates */}
        <div className="mb-3">
          <div className="mb-1 text-[10px] uppercase tracking-wider text-fg-muted">{t('templates.title', locale)}</div>
          <button
            type="button"
            onClick={() => setGalleryOpen(true)}
            className="w-full rounded-md border border-white/10 px-3 py-2 text-left text-sm font-medium text-fg transition hover:border-acc hover:bg-white/5"
          >
            🎨 {t('templates.open', locale)}
          </button>
        </div>

        {/* Physics */}
        <div className="mb-3">
          <div className="mb-1 text-[10px] uppercase tracking-wider text-fg-muted">{t('physics.title', locale)}</div>
          <div className="flex flex-wrap gap-2">
            <ToggleButton active={physicsActive} onClick={() => setPhysicsActive(!physicsActive)}>
              {physicsActive ? t('physics.on', locale) : t('physics.off', locale)}
            </ToggleButton>
            <button
              type="button"
              onClick={() => { if (!physicsActive) setPhysicsActive(true); dropAll() }}
              className="rounded-md border border-white/10 px-2 py-1 text-xs text-fg-muted hover:border-white/30 hover:text-fg"
            >
              🏗️ {t('physics.dropAll', locale)}
            </button>
          </div>
        </div>

        {/* Annotations */}
        <div className="mb-3">
          <div className="mb-1 text-[10px] uppercase tracking-wider text-fg-muted">
            {t('annotations.title', locale)} · {annList.length}
          </div>
          <div className="flex flex-wrap gap-2">
            <ToggleButton active={annActive} onClick={() => setAnnActive(!annActive)}>
              {annActive ? t('annotations.shown', locale) : t('annotations.hidden', locale)}
            </ToggleButton>
            <button
              type="button"
              onClick={handleAddNote}
              className="rounded-md border border-white/10 px-2 py-1 text-xs text-fg-muted hover:border-white/30 hover:text-fg"
            >
              + {t('annotations.add', locale)}
            </button>
            {annList.length > 0 && (
              <button
                type="button"
                onClick={annClear}
                className="rounded-md border border-white/10 px-2 py-1 text-xs text-fg-muted hover:border-red-400 hover:text-red-400"
              >
                {t('annotations.clear', locale)}
              </button>
            )}
          </div>
        </div>

        {/* Compare */}
        <div>
          <div className="mb-1 text-[10px] uppercase tracking-wider text-fg-muted">{t('compare.title', locale)}</div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => snapshotToA(modules)}
              disabled={modules.length === 0}
              className="rounded-md border border-white/10 px-2 py-1 text-xs text-fg hover:border-acc disabled:cursor-not-allowed disabled:opacity-40"
            >
              📸 A ({snapshotA?.length ?? 0})
            </button>
            <button
              type="button"
              onClick={() => snapshotToB(modules)}
              disabled={modules.length === 0}
              className="rounded-md border border-white/10 px-2 py-1 text-xs text-fg hover:border-acc disabled:cursor-not-allowed disabled:opacity-40"
            >
              📸 B ({snapshotB?.length ?? 0})
            </button>
            <button
              type="button"
              onClick={() => setCompareActive(!compareActive)}
              disabled={!snapshotA && !snapshotB}
              className="rounded-md border border-acc px-2 py-1 text-xs font-semibold text-acc hover:bg-acc hover:text-bg disabled:cursor-not-allowed disabled:opacity-40"
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
