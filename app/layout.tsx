import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Nosifer, Oswald } from 'next/font/google'
import './globals.css'

const display = Nosifer({
  variable: '--font-display',
  subsets: ['latin'],
  weight: '400',
})

const heading = Oswald({
  variable: '--font-heading',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Noite das Sombras — Controle de Acesso',
  description:
    'A festa de Halloween onde cada convidado carrega o nome de um monstro. Compre seu ingresso, receba seu vilão-senha e sua pulseira digital.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#160a0b',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      className={`dark ${display.variable} ${heading.variable}`}
    >
      <body className="bg-background font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
