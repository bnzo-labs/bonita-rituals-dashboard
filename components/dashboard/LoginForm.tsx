'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { login } from '@/lib/actions/auth'

export function LoginForm() {
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(false)
    setLoading(true)
    const result = await login(new FormData(e.currentTarget))
    if (result?.error) {
      setError(true)
      setLoading(false)
    }
  }

  return (
    <div className="bg-warm-white border border-gold/15 rounded-lg p-8 w-full max-w-sm mx-auto">
      <div className="flex justify-center mb-6">
        <Image src="/logo.PNG" alt="Bonita Rituals" width={72} height={72} className="object-contain" />
      </div>

      <h1 className="font-display font-light text-[24px] tracking-[0.06em] text-gold-dark text-center uppercase mb-8">
        Bonita Rituals
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required autoComplete="email" />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Contraseña</Label>
          <Input id="password" name="password" type="password" required autoComplete="current-password" />
        </div>

        {error && (
          <p className="text-danger text-[13px] text-center">
            Correo o contraseña incorrectos.
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 bg-gold text-charcoal font-sans text-[13px] font-medium tracking-[0.1em] uppercase rounded-sm transition-all duration-200 hover:-translate-y-px hover:bg-gold-dark disabled:opacity-60 disabled:pointer-events-none mt-2"
        >
          {loading ? '...' : 'Ingresar'}
        </button>
      </form>
    </div>
  )
}
