'use client'

import { useEffect, useRef, useState } from 'react'
import { useCopilot } from '@/stores/copilot'
import { useConfigurator } from '@/stores/configurator'
import { useWorld } from '@/stores/world'
import { parseCopilotInput, COPILOT_HELP_RU, type CopilotAction } from '@/lib/copilotCommands'
import { presetToInstances, findPreset } from '@/lib/scene-presets'

function executeAction(action: CopilotAction): string {
  switch (action.type) {
    case 'help':
      return COPILOT_HELP_RU
    case 'reset':
      useConfigurator.getState().reset()
      return '🧹 Сцена очищена'
    case 'undo':
      useConfigurator.getState().undo()
      return '↩️ Откат'
    case 'redo':
      useConfigurator.getState().redo()
      return '↪️ Повтор'
    case 'rotate':
      useConfigurator.getState().rotateSelected(Math.PI / 2)
      return '🔄 Поворот +90°'
    case 'duplicate':
      useConfigurator.getState().duplicateSelected()
      return '📑 Дублировано'
    case 'remove':
      useConfigurator.getState().removeSelected()
      return '🗑️ Удалено'
    case 'add_module':
      useConfigurator.getState().addModule(action.moduleId, action.material)
      return `➕ ${action.moduleId} (${action.material})`
    case 'set_hour':
      useWorld.getState().setHour(action.hour)
      return `🕐 Час: ${action.hour}:00`
    case 'set_weather':
      useWorld.getState().setWeather(action.weather)
      return `🌦️ Погода: ${action.weather}`
    case 'set_site':
      useWorld.getState().setSite(action.site)
      return `📍 Локация: ${action.site}`
    case 'set_camera':
      useWorld.getState().setCameraMode(action.mode)
      return `📷 Камера: ${action.mode}`
    case 'load_preset': {
      const preset = findPreset(action.presetId)
      if (!preset) return `❓ Пресет не найден: ${action.presetId}`
      useConfigurator.getState().setLayout(presetToInstances(preset.modules))
      return `🎬 Пресет: ${preset.nameRu}`
    }
    case 'unknown':
    default:
      return '🤔 Не понял команду. Напиши «help»'
  }
}

const PANEL_MAX_H = { maxHeight: 360 } as const
const MESSAGES_BOX = { minHeight: 100, maxHeight: 220 } as const

export function CopilotPanel() {
  const open = useCopilot((s) => s.open)
  const setOpen = useCopilot((s) => s.setOpen)
  const messages = useCopilot((s) => s.messages)
  const push = useCopilot((s) => s.push)
  const clear = useCopilot((s) => s.clear)
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [messages.length])

  function send() {
    const text = input.trim()
    if (!text) return
    push({ role: 'user', text })
    setInput('')
    const action = parseCopilotInput(text)
    const response = executeAction(action)
    push({ role: 'assistant', text: response })
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      send()
    }
  }

  if (!open) {
    return (
      <div className="glass rounded-3xl p-3.5">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full rounded-2xl border border-brand-primary/30 bg-gradient-to-r from-brand-primary/12 via-brand-secondary/12 to-brand-field/12 px-3 py-2.5 text-left text-[13px] font-bold text-ink hover:border-brand-primary/50 hover:from-brand-primary/20 hover:to-brand-field/20 transition"
        >
          🤖 MIG Copilot — открыть
        </button>
      </div>
    )
  }

  return (
    <div className="glass rounded-3xl p-3.5 flex flex-col gap-2.5" style={PANEL_MAX_H}>
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink3">🤖 MIG COPILOT</div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={clear}
            title="Очистить чат"
            className="rounded-xl border border-hairline bg-white/60 px-2 py-0.5 text-[10px] font-bold text-ink2 hover:bg-white hover:text-ink transition"
          >
            ⟲
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-xl border border-hairline bg-white/60 px-2 py-0.5 text-[10px] font-bold text-ink2 hover:bg-white hover:text-ink transition"
          >
            ✕
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-1.5 pr-1"
        style={MESSAGES_BOX}
      >
        {messages.map((m) => (
          <div
            key={m.id}
            className={
              'rounded-2xl px-2.5 py-1.5 text-[11px] whitespace-pre-wrap leading-snug ' +
              (m.role === 'user'
                ? 'bg-brand-primary/15 text-ink border border-brand-primary/30 ml-4'
                : 'bg-white/60 text-ink2 border border-hairline mr-4')
            }
          >
            {m.text}
          </div>
        ))}
      </div>

      <div className="flex gap-1.5">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="поставь сауну, ночь, пресет глэмпинг…"
          className="flex-1 rounded-xl border border-hairline bg-white/70 px-2.5 py-1.5 text-[12px] text-ink placeholder:text-ink3 focus:outline-none focus:border-brand-primary/40"
        />
        <button
          type="button"
          onClick={send}
          className="rounded-xl border border-brand-primary bg-brand-primary px-3 py-1.5 text-[11px] font-extrabold text-white hover:brightness-110 shadow-aurora-primary transition"
        >
          ▶
        </button>
      </div>
    </div>
  )
}
