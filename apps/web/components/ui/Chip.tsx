import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

type ChipTone =
  | 'neutral'
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'violet'
  | 'coral'
  | 'soft'

export interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: ChipTone
  children?: ReactNode
  dot?: boolean
}

const TONE: Record<ChipTone, string> = {
  neutral: 'bg-ink/[0.06] text-ink2 ring-1 ring-inset ring-hairline',
  primary:
    'bg-brand-primary/10 text-brand-primary ring-1 ring-inset ring-brand-primary/25',
  secondary:
    'bg-brand-secondary/10 text-sky-600 ring-1 ring-inset ring-brand-secondary/25',
  accent:
    'bg-brand-accent/10 text-amber-600 ring-1 ring-inset ring-brand-accent/30',
  violet:
    'bg-brand-field/10 text-violet-600 ring-1 ring-inset ring-brand-field/25',
  coral:
    'bg-brand-coral/10 text-rose-600 ring-1 ring-inset ring-brand-coral/25',
  soft: 'bg-white/70 text-ink ring-1 ring-inset ring-hairline',
}

const DOT: Record<ChipTone, string> = {
  neutral: 'bg-ink2',
  primary: 'bg-brand-primary',
  secondary: 'bg-brand-secondary',
  accent: 'bg-brand-accent',
  violet: 'bg-brand-field',
  coral: 'bg-brand-coral',
  soft: 'bg-ink/40',
}

export const Chip = forwardRef<HTMLSpanElement, ChipProps>(function Chip(
  { className, tone = 'neutral', dot = false, children, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
        TONE[tone],
        className,
      )}
      {...rest}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full animate-pulse-glow', DOT[tone])} />}
      {children}
    </span>
  )
})
