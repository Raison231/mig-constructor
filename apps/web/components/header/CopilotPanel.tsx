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
      return '\u{1F9F9} \u0421\u0446\u0435\u043D\u0430 \u043E\u0447\u0438\u0449\u0435\u043D\u0430'
    case 'undo':
      useConfigurator.getState().undo()
      return '\u21A9\uFE0F \u041E\u0442\u043A\u0430\u0442'
    case 'redo':
      useConfigurator.getState().redo()
      return '\u21AA\uFE0F \u041F\u043E\u0432\u0442\u043E\u0440'
    case 'rotate':
      useConfigurator.getState().rotateSelected(Math.PI / 2)
      return '\u{1F504} \u041F\u043E\u0432\u043E\u0440\u043E\u0442 +90\u00B0'
    case 'duplicate':
      useConfigurator.getState().duplicateSelected()
      return '\u{1F4D1} \u0414\u0443\u0431\u043B\u0438\u0440\u043E\u0432\u0430\u043D\u043E'
    case 'remove':
      useConfigurator.getState().removeSelected()
      return '\u{1F5D1}\uFE0F \u0423\u0434\u0430\u043B\u0435\u043D\u043E'
    case 'add_module':
      useConfigurator.getState().addModule(action.moduleId, action.material)
      return `\u2795 ${action.moduleId} (${action.material})`
    case 'set_hour':
      useWorld.getState().setHour(action.hour)
      return `\u{1F550} \u0427\u0430\u0441: ${action.hour}:00`
    case 'set_weather':
      useWorld.getState().setWeather(action.weather)
      return `\u{1F326}\uFE0F \u041F\u043E\u0433\u043E\u0434\u0430: ${action.weather}`
    case 'set_site':
      useWorld.getState().setSite(action.site)
      return `\u{1F4CD} \u041B\u043E\u043A\u0430\u0446\u0438\u044F: ${action.site}`
    case 'set_camera':
      useWorld.getState().setCameraMode(action.mode)
      return `\u{1F4F7} \u041A\u0430\u043C\u0435\u0440\u0430: ${action.mode}`
    case 'load_preset': {
      const preset = findPreset(action.presetId)
      if (!preset) return `\u2753 \u041F\u0440\u0435\u0441\u0435\u0442 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D: ${action.presetId}`
      useConfigurator.getState().setLayout(presetToInstances(preset.modules))
      return `\u{1F3AC} \u041F\u0440\u0435\u0441\u0435\u0442: ${preset.nameRu}`
    }
    case 'unknown':
    default:
      return '\u{1F914} \u041D\u0435 \u043F\u043E\u043D\u044F\u043B \u043A\u043E\u043C\u0430\u043D\u0434\u0443. \u041D\u0430\u043F\u0438\u0448\u0438 "help"'
  }
}

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
          \u{1F916} MIG Copilot \u2014 \u043E\u0442\u043A\u0440\u044B\u0442\u044C
        </button>
      </div>
    )
  }

  return (
    <div className="glass rounded-3xl p-3.5 flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink3">\u{1F916} MIG COPILOT</div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={clear}
            title="\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u044C \u0447\u0430\u0442"
            className="rounded-xl border border-hairline bg-white/60 px-2 py-0.5 text-[10px] font-bold text-ink2 hover:bg-white hover:text-ink transition"
          >
            \u27F2
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-xl border border-hairline bg-white/60 px-2 py-0.5 text-[10px] font-bold text-ink2 hover:bg-white hover:text-ink transition"
          >
            \u2715
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-1.5 pr-1"
        style= minHeight: 100, maxHeight: 220 
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
          placeholder="\u043F\u043E\u0441\u0442\u0430\u0432\u044C \u0441\u0430\u0443\u043D\u0443, \u043D\u043E\u0447\u044C, \u043F\u0440\u0435\u0441\u0435\u0442 \u0433\u043B\u044D\u043C\u043F\u0438\u043D\u0433\u2026"
          className="flex-1 rounded-xl border border-hairline bg-white/70 px-2.5 py-1.5 text-[12px] text-ink placeholder:text-ink3 focus:outline-none focus:border-brand-primary/40"
        />
        <button
          type="button"
          onClick={send}
          className="rounded-xl border border-brand-primary bg-brand-primary px-3 py-1.5 text-[11px] font-extrabold text-white hover:brightness-110 shadow-aurora-primary transition"
        >
          \u25B6
        </button>
      </div>
    </div>
  )
}
