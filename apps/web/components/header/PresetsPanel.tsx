'use client'

import { useState } from 'react'
import { useConfigurator } from '@/stores/configurator'
import { SCENE_PRESETS, presetToInstances, type ScenePreset } from '@/lib/scene-presets'

export function PresetsPanel() {
  const setLayout = useConfigurator((s) => s.setLayout)
  const [loadedId, setLoadedId] = useState<string | null>(null)
  const [confirm, setConfirm] = useState<ScenePreset | null>(null)

  function load(p: ScenePreset) {
    setLayout(presetToInstances(p.modules))
    setLoadedId(p.id)
    setConfirm(null)
    setTimeout(() => setLoadedId(null), 1800)
  }

  function tryLoad(p: ScenePreset) {
    const currentCount = useConfigurator.getState().modules.length
    if (currentCount > 0) {
      setConfirm(p)
    } else {
      load(p)
    }
  }

  return (
    <div className="glass rounded-3xl p-3.5">
      <div className="mb-2.5 flex items-center justify-between">
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink3">\u{1F3A8} \u0413\u043E\u0442\u043E\u0432\u044B\u0435 \u0441\u0446\u0435\u043D\u044B</div>
        <span className="text-[10px] text-ink3">{SCENE_PRESETS.length}</span>
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        {SCENE_PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => tryLoad(p)}
            title={p.description}
            className={
              'rounded-2xl border px-2 py-2 text-left transition ' +
              (loadedId === p.id
                ? 'border-brand-primary bg-brand-primary/12 shadow-aurora-primary'
                : 'border-hairline bg-white/60 hover:bg-white hover:border-brand-primary/40')
            }
          >
            <div className="text-base leading-none">{p.emoji}</div>
            <div className="mt-1 text-[11px] font-bold text-ink leading-tight">{p.nameRu}</div>
            <div className="mt-0.5 text-[9px] text-ink3">{p.modules.length} \u043C\u043E\u0434\u0443\u043B\u0435\u0439</div>
          </button>
        ))}
      </div>

      {confirm && (
        <div className="mt-2.5 rounded-2xl border border-brand-coral/30 bg-brand-coral/10 p-2.5">
          <div className="text-[11px] font-bold text-ink mb-1.5">
            \u26A0\uFE0F \u0412 \u0441\u0446\u0435\u043D\u0435 \u0443\u0436\u0435 \u0435\u0441\u0442\u044C \u043C\u043E\u0434\u0443\u043B\u0438. \u0417\u0430\u043C\u0435\u043D\u0438\u0442\u044C \u043D\u0430 \u00AB{confirm.nameRu}\u00BB?
          </div>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => load(confirm)}
              className="rounded-xl border border-brand-primary bg-brand-primary px-2.5 py-1 text-[11px] font-extrabold text-white hover:brightness-110 shadow-aurora-primary transition"
            >
              \u0417\u0430\u043C\u0435\u043D\u0438\u0442\u044C
            </button>
            <button
              type="button"
              onClick={() => setConfirm(null)}
              className="rounded-xl border border-hairline bg-white/60 px-2.5 py-1 text-[11px] font-bold text-ink2 hover:bg-white hover:text-ink transition"
            >
              \u041E\u0442\u043C\u0435\u043D\u0430
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
