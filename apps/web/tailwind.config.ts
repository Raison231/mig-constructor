import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#F8F9FC',
        'canvas-soft': '#F1F4F9',
        surface: 'rgb(255 255 255 / 0.72)',
        ink: '#0B1220',
        ink2: '#475569',
        ink3: '#94A3B8',
        ink4: '#CBD5E1',
        hairline: 'rgba(15, 23, 42, 0.06)',
        'hairline-strong': 'rgba(15, 23, 42, 0.12)',
        brand: {
          primary: '#10B981',
          secondary: '#38BDF8',
          accent: '#F59E0B',
          field: '#8B5CF6',
          coral: '#FF6B6B',
          ink: '#0B1220',
        },

        // legacy aliases — старые компоненты ещё используют эти имена,
        // мапим их на новые токены, чтобы ничего не сломалось мгновенно
        bg: '#F8F9FC',
        panel: 'rgb(255 255 255 / 0.72)',
        fg: '#0B1220',
        'fg-muted': '#475569',
        'fg-secondary': '#475569',
        acc: '#10B981',
        accent: {
          green: '#10B981',
          orange: '#FF6B6B',
          blue: '#38BDF8',
          timber: '#B08968',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'monospace'],
        georgian: ['var(--font-noto-georgian)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        aurora:
          '0 1px 2px rgba(15,23,42,0.04), 0 8px 24px rgba(15,23,42,0.06), 0 24px 80px -16px rgba(15,23,42,0.08)',
        'aurora-lg':
          '0 2px 4px rgba(15,23,42,0.05), 0 16px 40px rgba(15,23,42,0.08), 0 40px 120px -20px rgba(15,23,42,0.14)',
        'aurora-primary':
          '0 10px 30px -10px rgba(16,185,129,0.5)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.15)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 320ms cubic-bezier(0.22, 1, 0.36, 1) both',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        shimmer: 'shimmer 3s linear infinite',
        float: 'float 6s ease-in-out infinite',
      },
      backdropBlur: {
        '2xl': '28px',
        '3xl': '40px',
      },
    },
  },
  plugins: [],
} satisfies Config
