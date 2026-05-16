'use client'

import { useMemo } from 'react'
import { useWorld, SITE_META } from '@/stores/world'

export function SiteEnvironment() {
  const site = useWorld((s) => s.site)
  const bg = SITE_META[site].bgColor
  const bgArgs = useMemo(() => [bg] as [string], [bg])
  return <color attach="background" args={bgArgs} />
}
