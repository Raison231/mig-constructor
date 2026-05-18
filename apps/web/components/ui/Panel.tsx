import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Tone = 'default' | 'elevated' | 'flat' | 'subtle'

export interface PanelProps extends HTMLAttributes<HTMLDivElement> {
  tone?: Tone
  padded?: boolean
  children?: ReactNode
}

const TONE: Record<Tone, string> = {
  default:
    'bg-surface backdrop-blur-2xl backdrop-saturate-150 border border-hairline shadow-aurora',
  elevated:
    'bg-surface backdrop-blur-2xl backdrop-saturate-150 border border-hairline shadow-aurora-lg',
  flat: 'bg-white/60 border border-hairline',
  subtle:
    'bg-white/40 backdrop-blur-xl border border-hairline/60',
}

export const Panel = forwardRef<HTMLDivElement, PanelProps>(function Panel(
  { className, tone = 'default', padded = true, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        'rounded-3xl text-ink transition-shadow duration-300',
        TONE[tone],
        padded && 'p-4',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
})
