import { create } from 'zustand'

export type Locale = 'ru' | 'en' | 'ka'

type LocaleState = {
  locale: Locale
  setLocale: (l: Locale) => void
}

const STORAGE_KEY = 'mig-locale'

function load(): Locale {
  if (typeof window === 'undefined') return 'ru'
  try {
    const v = localStorage.getItem(STORAGE_KEY) as Locale | null
    if (v === 'ru' || v === 'en' || v === 'ka') return v
  } catch {}
  return 'ru'
}

export const useLocale = create<LocaleState>((set) => ({
  locale: load(),
  setLocale: (l) => {
    if (typeof window !== 'undefined') {
      try { localStorage.setItem(STORAGE_KEY, l) } catch {}
    }
    set({ locale: l })
  },
}))
