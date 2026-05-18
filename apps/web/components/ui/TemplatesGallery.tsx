'use client'

import { useConfigurator } from '@/stores/configurator'
import { useTemplates } from '@/stores/templates'
import { useLocale } from '@/stores/locale'
import { t } from '@mig/i18n'
import { TEMPLATE_PRESETS } from '@/lib/template-presets'

interface TemplatesGalleryProps {
  open: boolean
  onClose: () => void
}

export function TemplatesGallery({ open, onClose }: TemplatesGalleryProps) {
  const locale = useLocale((s) => s.locale)
  const setLayout = useConfigurator((s) => s.setLayout)
  const setActivePresetId = useTemplates((s) => s.setActivePresetId)
  const getPresetInstances = useTemplates((s) => s.getPresetInstances)

  if (!open) return null

  const pickName = (p: typeof TEMPLATE_PRESETS[number]) =>
    locale === 'ru' ? p.nameRu : locale === 'ka' ? p.nameKa : p.nameEn

  const pickDesc = (p: typeof TEMPLATE_PRESETS[number]) =>
    locale === 'ru' ? p.descriptionRu : p.descriptionEn

  function apply(id: typeof TEMPLATE_PRESETS[number]['id']) {
    const instances = getPresetInstances(id)
    if (instances.length === 0) return
    setLayout(instances)
    setActivePresetId(id)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[80vh] w-[min(90vw,920px)] overflow-y-auto rounded-2xl border border-white/10 bg-panel p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-fg">{t('templates.title', locale)}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-white/10 px-3 py-1 text-sm text-fg-muted hover:text-fg"
          >
            ✕
          </button>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TEMPLATE_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => apply(p.id)}
              className="group flex flex-col gap-2 rounded-xl border border-white/10 bg-bg p-4 text-left transition hover:border-acc hover:bg-white/5"
            >
              <div className="text-3xl">{p.icon}</div>
              <div className="font-semibold text-fg">{pickName(p)}</div>
              <div className="text-xs leading-relaxed text-fg-muted">{pickDesc(p)}</div>
              <div className="mt-1 text-[10px] uppercase tracking-wider text-acc opacity-0 group-hover:opacity-100">
                {t('templates.apply', locale)} →
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
