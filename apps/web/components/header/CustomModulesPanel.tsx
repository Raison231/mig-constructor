'use client'

import { useState } from 'react'
import { useCustomModules } from '@/stores/customModules'
import { useConfigurator } from '@/stores/configurator'
import { pickGlbFile, readGlbFile, makeCustomModuleId, humanBytes } from '@/lib/customGlbImport'

export function CustomModulesPanel() {
  const items = useCustomModules((s) =>
    Object.values(s.modules).sort((a, b) => (a.addedAt < b.addedAt ? 1 : -1)),
  )
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
        setError(`Файл слишком большой (${sizeMB.toFixed(1)} МБ, лимит 25 МБ)`)
        setBusy(false)
        return
      }
      const info = await readGlbFile(file)
      add(info)
      setBusy(false)
    } catch (e) {
      console.error('[importGlb]', e)
      setError('Не удалось распарсить GLB. Файл повреждён?')
      setBusy(false)
    }
  }

  function placeOnScene(id: string) {
    addModule(makeCustomModuleId(id), 'hybrid')
  }

  return (
    <div className="glass rounded-3xl p-3.5">
      <div className="mb-2.5 flex items-center justify-between">
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink3">📥 Свои GLB</div>
        <span className="text-[10px] text-ink3">{items.length}</span>
      </div>

      <button
        type="button"
        onClick={importGlb}
        disabled={busy}
        className="w-full rounded-2xl border border-brand-secondary/40 bg-brand-secondary/10 px-3 py-2 text-[12px] font-bold text-ink hover:bg-brand-secondary/20 hover:border-brand-secondary disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        {busy ? '⌛ Импорт…' : '+ Загрузить .glb'}
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
                    {info.width.toFixed(1)}×{info.height.toFixed(1)}×{info.depth.toFixed(1)} м · {humanBytes(info.sizeBytes)}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => placeOnScene(info.id)}
                  title="Поставить в сцену"
                  className="rounded-xl border border-brand-primary bg-brand-primary px-2 py-0.5 text-[10px] font-extrabold text-white hover:brightness-110 shadow-aurora-primary transition"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => remove(info.id)}
                  title="Удалить"
                  className="rounded-xl border border-hairline bg-white/60 px-1.5 py-0.5 text-[10px] font-bold text-ink2 hover:bg-brand-coral hover:text-white hover:border-brand-coral transition"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {items.length === 0 && !error && (
        <div className="mt-2 text-[10px] text-ink3 leading-tight">
          Поддерживаются .glb / .gltf до 25 МБ. После импорта модуль появится здесь — жми «+» чтобы поставить в сцену.
        </div>
      )}
    </div>
  )
}
