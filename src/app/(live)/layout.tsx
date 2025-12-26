'use client'

import { Providers } from '@/providers'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { Anek_Malayalam, Noto_Sans_Malayalam, Oswald, Roboto_Condensed } from 'next/font/google'
import { cn } from '@/utilities/ui'
import '../(frontend)/globals.css'

// Configure Google Fonts
const oswald = Oswald({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-oswald',
  display: 'swap',
})

const robotoCondensed = Roboto_Condensed({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-roboto-condensed',
  display: 'swap',
})

const anekMalayalam = Anek_Malayalam({
  subsets: ['latin', 'malayalam'],
  variable: '--font-anek-malayalam',
  display: 'swap',
})

const notoSansMalayalam = Noto_Sans_Malayalam({
  subsets: ['latin', 'malayalam'],
  variable: '--font-noto-sans-malayalam',
  display: 'swap',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={cn(
        GeistSans.variable,
        GeistMono.variable,
        oswald.variable,
        robotoCondensed.variable,
        anekMalayalam.variable,
        notoSansMalayalam.variable,
      )}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
