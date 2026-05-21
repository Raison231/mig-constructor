'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type AmbientChannel = 'wind' | 'birds' | 'rustle' | 'rain' | 'water' | 'drone'

export interface AudioState {
  enabled: boolean
  masterVolume: number             // 0..1
  channelVolumes: Record<AmbientChannel, number> // 0..1, user-multiplied on top of biome mix
  footstepsEnabled: boolean
  footstepVolume: number
  // user has interacted at least once — needed to satisfy autoplay policy
  userUnlocked: boolean
  setEnabled: (v: boolean) => void
  setMasterVolume: (v: number) => void
  setChannelVolume: (ch: AmbientChannel, v: number) => void
  setFootstepsEnabled: (v: boolean) => void
  setFootstepVolume: (v: number) => void
  markUnlocked: () => void
}

export const ALL_CHANNELS: AmbientChannel[] = ['wind', 'birds', 'rustle', 'rain', 'water', 'drone']

export const CHANNEL_LABELS: Record<AmbientChannel, { emoji: string; label: string }> = {
  wind:   { emoji: '💨', label: 'Ветер' },
  birds:  { emoji: '🐦', label: 'Птицы' },
  rustle: { emoji: '🍃', label: 'Шелест' },
  rain:   { emoji: '🌧️', label: 'Дождь' },
  water:  { emoji: '💧', label: 'Вода' },
  drone:  { emoji: '🌆', label: 'Гул' },
}

export const useAudio = create<AudioState>()(
  persist(
    (set) => ({
      enabled: false,
      masterVolume: 0.6,
      channelVolumes: { wind: 1, birds: 1, rustle: 1, rain: 1, water: 1, drone: 0.7 },
      footstepsEnabled: true,
      footstepVolume: 0.7,
      userUnlocked: false,
      setEnabled: (v) => set({ enabled: v }),
      setMasterVolume: (v) => set({ masterVolume: Math.max(0, Math.min(1, v)) }),
      setChannelVolume: (ch, v) =>
        set((s) => ({ channelVolumes: { ...s.channelVolumes, [ch]: Math.max(0, Math.min(1, v)) } })),
      setFootstepsEnabled: (v) => set({ footstepsEnabled: v }),
      setFootstepVolume: (v) => set({ footstepVolume: Math.max(0, Math.min(1, v)) }),
      markUnlocked: () => set({ userUnlocked: true }),
    }),
    {
      name: 'mig-audio-v1',
      partialize: (s) => ({
        enabled: s.enabled,
        masterVolume: s.masterVolume,
        channelVolumes: s.channelVolumes,
        footstepsEnabled: s.footstepsEnabled,
        footstepVolume: s.footstepVolume,
      }),
    },
  ),
)
