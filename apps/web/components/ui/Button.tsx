import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'soft' | 'glass'
type Size = 'xs' | 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  active?: boolean
  iconLeft?: ReactNode
  iconRight?: ReactNode
  full?: boolean
}

const VARIANT: Record<Variant, string> = {
  primary:
    'bg-gradient-to-br from-brand-primary to-emerald-600 text-white shadow-[0_8px_24px_-8px_rgba(16,185,129,0.55)] hover:brightness-110 active:brightness-95',
  secondary:
    'bg-ink text-white hover:bg-ink/90 active:bg-ink',
  ghost:
    'text-ink2 hover:text-ink hover:bg-ink/[0.04] active:bg-ink/[0.08]',
  danger:
    'bg-gradient-to-br from-brand-coral to-rose-500 text-white shadow-[0_8px_24px_-8px_rgba(255,107,107,0.55)] hover:brightness-110',
  soft:
    'bg-ink/[0.04] text-ink hover:bg-ink/[0.08] active:bg-ink/[0.12]',
  glass:
    'bg-white/70 backdrop-blur-xl text-ink border border-hairline hover:bg-white/90 hover:border-hairline-strong shadow-aurora',
}

const SIZE: Record<Size, string> = {
  xs: 'h-7 px-2.5 text-[11px] gap-1 rounded-lg',
  sm: 'h-8 px-3 text-xs gap-1.5 rounded-xl',
  md: 'h-10 px-4 text-sm gap-2 rounded-2xl',
  lg: 'h-12 px-5 text-base gap-2.5 rounded-2xl',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant = 'soft',
    size = 'sm',
    active = false,
    iconLeft,
    iconRight,
    full,
    type = 'button',
    children,
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'relative inline-flex items-center justify-center font-medium tracking-tight',
        'transition-all duration-200 ease-out',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40 focus-visible:ring-offset-1 focus-visible:ring-offset-canvas',
        'disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none',
        VARIANT[variant],
        SIZE[size],
        active && variant !== 'primary' && 'bg-brand-primary/10 text-brand-primary ring-1 ring-brand-primary/30',
        full && 'w-full',
        className,
      )}
      {...rest}
    >
      {iconLeft}
      {children}
      {iconRight}
    </button>
  )
})
