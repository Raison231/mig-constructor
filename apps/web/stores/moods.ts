'use client'

import { create } from 'zustand'
import { useWorld, type Weather } from './world'
import { useAudio, type AmbientChannel } from './audio'

export type MoodPreset = {
  id: string
  label: string
  emoji: string
  description: string
  hour: number
  weather: Weather
  audioEnabled: boolean
  masterVolume: number
  channels: Partial<Record<AmbientChannel, number>>
}

export const MOOD_PRESETS: MoodPreset[] = [
  {
    id: 'morning-coffee',
    label: 'Утро',
    emoji: '☕',
    description: 'Кофе на веранде, птицы, роса.',
    hour: 7,
    weather: 'clear',
    audioEnabled: true,
    masterVolume: 0.55,
    channels: { birds: 1, wind: 0.4, rustle: 0.6, rain: 0, water: 0.2, drone: 0 },
  },
  {
    id: 'midday-clear',
    label: 'Полдень',
    emoji: '☀️',
    description: 'Солнце в зените, ветерок, птицы.',
    hour: 13,
    weather: 'clear',
    audioEnabled: true,
    masterVolume: 0.5,
    channels: { wind: 0.8, birds: 0.7, rustle: 0.5, rain: 0, water: 0.2, drone: 0 },
  },
  {
    id: 'rainy-day',
    label: 'Дождь',
    emoji: '🌧️',
    description: 'Плед, чай, ровный дождь за окном.',
    hour: 14,
    weather: 'rain',
    audioEnabled: true,
    masterVolume: 0.7,
    channels: { rain: 1, wind: 0.5, water: 0.4, birds: 0, rustle: 0.2, drone: 0 },
  },
  {
    id: 'sunset-vibes',
    label: 'Закат',
    emoji: '🌇',
    description: 'Золотой час, ветер, тихие птицы.',
    hour: 19,
    weather: 'clear',
    audioEnabled: true,
    masterVolume: 0.55,
    channels: { wind: 0.7, birds: 0.4, rustle: 0.5, rain: 0, water: 0.3, drone: 0 },
  },
  {
    id: 'starry-night',
    label: 'Ночь',
    emoji: '🌟',
    description: 'Звёзды, луна, тихий ветер.',
    hour: 23,
    weather: 'clear',
    audioEnabled: true,
    masterVolume: 0.45,
    channels: { wind: 0.5, rustle: 0.3, drone: 0.4, birds: 0, rain: 0, water: 0.2 },
  },
  {
    id: 'winter-morning',
    label: 'Зима',
    emoji: '❄️',
    description: 'Снег, холодный ветер, тишина.',
    hour: 9,
    weather: 'snow',
    audioEnabled: true,
    masterVolume: 0.5,
    channels: { wind: 1, rustle: 0.2, birds: 0, rain: 0, water: 0, drone: 0.3 },
  },
  {
    id: 'party-night',
    label: 'Вечеринка',
    emoji: '🎉',
    description: 'Ночные огни, городской гул.',
    hour: 21,
    weather: 'clear',
    audioEnabled: true,
    masterVolume: 0.7,
    channels: { drone: 1, wind: 0.3, rustle: 0.2, birds: 0, rain: 0, water: 0.1 },
  },
  {
    id: 'meditation',
    label: 'Медитация',
    emoji: '🧘',
    description: 'Рассвет, туман, вода, дыхание.',
    hour: 6,
    weather: 'fog',
    audioEnabled: true,
    masterVolume: 0.4,
    channels: { water: 1, wind: 0.3, rustle: 0.4, birds: 0.2, rain: 0, drone: 0.2 },
  },
]

type MoodsState = {
  activeId: string | null
  setActive: (id: string | null) => void
}

const STORAGE_KEY = 'mig-moods-v1'

function loadActive(): string | null {
  if (typeof window === 'undefined') return null
  try { return localStorage.getItem(STORAGE_KEY) } catch { return null }
}
function persistActive(id: string | null) {
  if (typeof window === 'undefined') return
  try {
    if (id) localStorage.setItem(STORAGE_KEY, id)
    else localStorage.removeItem(STORAGE_KEY)
  } catch {}
}

export const useMoods = create<MoodsState>((set) => ({
  activeId: loadActive(),
  setActive: (id) => { set({ activeId: id }); persistActive(id) },
}))

/**
 * Apply a packaged mood to world + audio in one atomic call.
 * No-op if id is unknown. Marks audio as user-unlocked because pressing a mood
 * chip is a user gesture (satisfies Web Audio autoplay policy).
 */
export function applyMood(id: string) {
  const mood = MOOD_PRESETS.find((m) => m.id === id)
  if (!mood) return

  const world = useWorld.getState()
  world.setHour(mood.hour)
  world.setWeather(mood.weather)

  const audio = useAudio.getState()
  audio.markUnlocked()
  audio.setEnabled(mood.audioEnabled)
  audio.setMasterVolume(mood.masterVolume)
  for (const ch of Object.keys(mood.channels) as AmbientChannel[]) {
    const v = mood.channels[ch]
    if (typeof v === 'number') audio.setChannelVolume(ch, v)
  }

  useMoods.getState().setActive(id)
}
