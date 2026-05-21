'use client'

import { useAudio, ALL_CHANNELS, CHANNEL_LABELS, type AmbientChannel } from '@/stores/audio'
import { useFlora } from '@/stores/flora'
import { useWorld } from '@/stores/world'
import { useCinematic } from '@/stores/cinematic'

export function AudioPanel() {
  const enabled = useAudio((s) => s.enabled)
  const masterVolume = useAudio((s) => s.masterVolume)
  const channelVolumes = useAudio((s) => s.channelVolumes)
  const footstepsEnabled = useAudio((s) => s.footstepsEnabled)
  const footstepVolume = useAudio((s) => s.footstepVolume)
  const setEnabled = useAudio((s) => s.setEnabled)
  const setMasterVolume = useAudio((s) => s.setMasterVolume)
  const setChannelVolume = useAudio((s) => s.setChannelVolume)
  const setFootstepsEnabled = useAudio((s) => s.setFootstepsEnabled)
  const setFootstepVolume = useAudio((s) => s.setFootstepVolume)
  const markUnlocked = useAudio((s) => s.markUnlocked)
  const floraEnabled = useFlora((s) => s.enabled)
  const biome = useFlora((s) => s.biome)
  const weather = useWorld((s) => s.weather)
  const inWalk = useCinematic((s) => s.mode === 'walkthrough')

  return (
    <div className="glass rounded-3xl p-3.5">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink3">🔊 Ambient</div>
        <button
          onClick={() => { markUnlocked(); setEnabled(!enabled) }}
          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border transition ${enabled ? 'bg-emerald-500 text-white border-emerald-500 shadow-aurora-primary' : 'bg-white text-ink2 border-hairline hover:text-ink'}`}
        >
          {enabled ? 'ON' : 'OFF'}
        </button>
      </div>

      {enabled && (
        <>
          <div className="mb-3">
            <div className="flex items-center justify-between text-[10px] mb-1">
              <span className="text-ink2 font-medium">Общая громкость</span>
              <span className="font-mono text-emerald-600 font-bold">{Math.round(masterVolume * 100)}%</span>
            </div>
            <input
              type="range" min={0} max={1} step={0.05} value={masterVolume}
              onChange={(e) => setMasterVolume(Number(e.target.value))}
              className="aurora-range w-full"
            />
          </div>

          <div className="space-y-2 mb-3">
            {ALL_CHANNELS.map((ch) => (
              <ChannelRow
                key={ch}
                ch={ch}
                value={channelVolumes[ch]}
                onChange={(v) => setChannelVolume(ch, v)}
              />
            ))}
          </div>

          <div className="pt-3 border-t border-hairline">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] uppercase tracking-wider text-ink3">👣 Шаги в Walk Mode</span>
              <button
                onClick={() => setFootstepsEnabled(!footstepsEnabled)}
                className={`rounded-full px-2 py-0.5 text-[9px] font-bold border transition ${footstepsEnabled ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-ink3 border-hairline'}`}
              >
                {footstepsEnabled ? 'ON' : 'OFF'}
              </button>
            </div>
            {footstepsEnabled && (
              <div>
                <div className="flex items-center justify-between text-[10px] mb-1">
                  <span className="text-ink3">Громкость</span>
                  <span className="font-mono text-emerald-600 font-bold">{Math.round(footstepVolume * 100)}%</span>
                </div>
                <input
                  type="range" min={0} max={1} step={0.05} value={footstepVolume}
                  onChange={(e) => setFootstepVolume(Number(e.target.value))}
                  className="aurora-range w-full"
                />
              </div>
            )}
            <div className="mt-2 text-[9px] text-ink3 leading-snug">
              {inWalk ? '🟢 Активно — иди и слушай' : 'Шаги звучат только в Walk Mode'}
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-hairline text-[9px] text-ink3 leading-snug">
            Микс автоматически подхватывает
            {floraEnabled ? <> биом <span className="text-emerald-600 font-bold">{biome}</span></> : <> базовую среду</>}
            {' · погода '}<span className="text-emerald-600 font-bold">{weather}</span>.
          </div>
        </>
      )}
    </div>
  )
}

function ChannelRow({ ch, value, onChange }: { ch: AmbientChannel; value: number; onChange: (v: number) => void }) {
  const meta = CHANNEL_LABELS[ch]
  return (
    <div>
      <div className="flex items-center justify-between text-[10px] mb-1">
        <span className="text-ink2 font-medium">{meta.emoji} {meta.label}</span>
        <span className="font-mono text-emerald-600 font-bold">{Math.round(value * 100)}%</span>
      </div>
      <input
        type="range" min={0} max={1} step={0.05} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="aurora-range w-full"
      />
    </div>
  )
}
