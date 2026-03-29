import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Bonita Rituals',
  description: 'Glow like it\'s sacred',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
