'use client'

import { useEffect, useState } from 'react'

/**
 * Subscribe to a CSS media query. SSR-safe: returns false on first render,
 * then resolves to the real value after mount.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mql = window.matchMedia(query)
    setMatches(mql.matches)

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    if (mql.addEventListener) {
      mql.addEventListener('change', handler)
      return () => mql.removeEventListener('change', handler)
    } else {
      // Safari < 14 fallback
      mql.addListener(handler)
      return () => mql.removeListener(handler)
    }
  }, [query])

  return matches
}

/** True on phones / small tablets (<768px). */
export function useIsMobile(): boolean {
  return !useMediaQuery('(min-width: 768px)')
}

/** True on tablets / desktop (>=768px). */
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 768px)')
}
