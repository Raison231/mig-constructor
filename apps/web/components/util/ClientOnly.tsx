'use client'

import { useEffect, useState, type ReactNode } from 'react'

/**
 * Mounted-guard для компонентов, чья верстка зависит от browser-only состояния
 * (localStorage, window, размер вьюпорта, persisted Zustand store).
 *
 * SSR → fallback. CSR после mount → children. Жёстко режет class hydration
 * mismatch'ей вида { modules.length } 0 vs 3, disabled "" vs false и т.п.
 */
export function ClientOnly({
  children,
  fallback = null,
}: {
  children: ReactNode
  fallback?: ReactNode
}) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return <>{fallback}</>
  return <>{children}</>
}
