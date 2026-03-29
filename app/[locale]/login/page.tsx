import type { Metadata } from 'next'
import { LoginForm } from '@/components/dashboard/LoginForm'

export const metadata: Metadata = { title: 'Acceso — Bonita Rituals' }

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-peach flex items-center justify-center px-4 py-12">
      <LoginForm />
    </main>
  )
}
