'use client'

import { useState } from 'react'
import { useCustomModules } from '@/stores/customModules'
import { useConfigurator } from '@/stores/configurator'
import { pickGlbFile, readGlbFile, makeCustomModuleId, humanBytes } from '@/lib/customGlbImport'

export function CustomModulesPanel() {
  const items = useCustomModules((s) => Object.values(s.modules).sort((a, b) => (a.addedAt < b.addedAt ? 1 : -1)))
  const add = useCustomModules((s) => s.add)
  const remove = useCustomModules((s) => s.remove)
  const addModule = useConfigurator((s) => s.addModule)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function importGlb() {
    setError(null)
    try {
      setBusy(true)
      const file = await pickGlbFile()
      if (!file) {
        setBusy(false)
        return
      }
      const sizeMB = file.size / (1024 * 1024)
      if (sizeMB > 25) {
        setError(`\u0424\u0430\u0439\u043B \u0441\u043B\u0438\u0448\u043A\u043E\u043C \u0431\u043E\u043B\u044C\u0448\u043E\u0439 (${sizeMB.toFixed(1)} \u041C\u0411, \u043B\u0438\u043C\u0438\u0442 25 \u041C\u0411)`)
        setBusy(false)
        return
      }
      const info = await readGlbFile(file)
      add(info)
      setBusy(false)
    } catch (e) {
      console.error('[importGlb]', e)
      setError('\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0440\u0430\u0441\u043F\u0430\u0440\u0441\u0438\u0442\u044C GLB. \u0424\u0430\u0439\u043B \u043F\u043E\u0432\u0440\u0435\u0436\u0434\u0451\u043D?')
      setBusy(false)
    }
  }

  function placeOnScene(id: string) {
    addModule(makeCustomModuleId(id), 'hybrid')
  }

  return (
    <div className="glass rounded-3xl p-3.5">
      <div className="mb-2.5 flex items-center justify-between">
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink3">\u{1F4E5} \u0421\u0432\u043E\u0438 GLB</div>
        <span className="text-[10px] text-ink3">{items.length}</span>
      </div>

      <button
        type="button"
        onClick={importGlb}
        disabled={busy}
        className="w-full rounded-2xl border border-brand-secondary/40 bg-brand-secondary/10 px-3 py-2 text-[12px] font-bold text-ink hover:bg-brand-secondary/20 hover:border-brand-secondary disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        {busy ? '\u231B \u0418\u043C\u043F\u043E\u0440\u0442\u2026' : '+ \u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C .glb'}
      </button>

      {error && (
        <div className="mt-2 rounded-xl border border-brand-coral/30 bg-brand-coral/10 px-2.5 py-1.5 text-[10px] font-bold text-brand-coral">
          {error}
        </div>
      )}

      {items.length > 0 && (
        <div className="mt-2.5 space-y-1.5 max-h-44 overflow-y-auto pr-1">
          {items.map((info) => (
            <div key={info.id} className="rounded-2xl border border-hairline bg-white/60 p-2">
              <div className="flex items-center justify-between gap-1.5">
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[11px] font-bold text-ink">{info.name}</div>
                  <div className="text-[9px] text-ink3">
                    {info.width.toFixed(1)}\u00D7{info.height.toFixed(1)}\u00D7{info.depth.toFixed(1)} \u043C \u00B7 {humanBytes(info.sizeBytes)}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => placeOnScene(info.id)}
                  title="\u041F\u043E\u0441\u0442\u0430\u0432\u0438\u0442\u044C \u0432 \u0441\u0446\u0435\u043D\u0443"
                  className="rounded-xl border border-brand-primary bg-brand-primary px-2 py-0.5 text-[10px] font-extrabold text-white hover:brightness-110 shadow-aurora-primary transition"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => remove(info.id)}
                  title="\u0423\u0434\u0430\u043B\u0438\u0442\u044C"
                  className="rounded-xl border border-hairline bg-white/60 px-1.5 py-0.5 text-[10px] font-bold text-ink2 hover:bg-brand-coral hover:text-white hover:border-brand-coral transition"
                >
                  \u2715
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {items.length === 0 && !error && (
        <div className="mt-2 text-[10px] text-ink3 leading-tight">
          \u041F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u044E\u0442\u0441\u044F .glb / .gltf \u0434\u043E 25 \u041C\u0411. \u041F\u043E\u0441\u043B\u0435 \u0438\u043C\u043F\u043E\u0440\u0442\u0430 \u043C\u043E\u0434\u0443\u043B\u044C \u043F\u043E\u044F\u0432\u0438\u0442\u0441\u044F \u0437\u0434\u0435\u0441\u044C \u2014 \u0436\u043C\u0438 \u00AB+\u00BB \u0447\u0442\u043E\u0431\u044B \u043F\u043E\u0441\u0442\u0430\u0432\u0438\u0442\u044C \u0432 \u0441\u0446\u0435\u043D\u0443.
        </div>
      )}
    </div>
  )
}
