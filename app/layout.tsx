import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import './globals.css'

export const metadata: Metadata = {
  title: 'Bootcamp Treinos',
  description: 'Gestao e execucao de treinos com Next.js, Elysia e Drizzle.',
}

interface RootLayoutProps {
  children: ReactNode
}

const RootLayout = ({ children }: RootLayoutProps) => (
  <html lang="pt-BR">
    <body>{children}</body>
  </html>
)

export default RootLayout
