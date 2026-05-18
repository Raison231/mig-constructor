import type { Metadata, Viewport } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  title: 'MIG Constructor — собери дом-LEGO',
  description:
    '3D-конфигуратор модульных домов: контейнеры, дерево, гибрид. Грузия → мир. Open-source.',
  openGraph: {
    title: 'MIG Constructor',
    description: 'Собери дом как LEGO. Real-time 3D + цена + сроки.',
    type: 'website',
  },
}

// Next 15: themeColor / viewport / colorScheme живут отдельным viewport-экспортом.
export const viewport: Viewport = {
  themeColor: '#F8F9FC',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased aurora-mesh text-ink" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
