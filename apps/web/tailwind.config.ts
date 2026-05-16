import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0A0A0B',
        panel: '#141417',
        fg: '#F5F5F7',
        'fg-secondary': '#8E8E93',
        accent: {
          green: '#00D26A',
          orange: '#FF6B35',
          blue: '#4A90FF',
          timber: '#8B6F47',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'monospace'],
        georgian: ['var(--font-noto-georgian)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
