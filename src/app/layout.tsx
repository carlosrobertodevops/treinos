import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Inter_Tight } from 'next/font/google'

import './globals.css'

const interTight = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-inter-tight',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'FIT.AI',
  description: 'O app que vai transformar a forma como voce treina.',
}

interface RootLayoutProps {
  children: ReactNode
}

const RootLayout = ({ children }: RootLayoutProps) => (
  <html lang="pt-BR" className={interTight.variable}>
    <body>{children}</body>
  </html>
)

export default RootLayout
