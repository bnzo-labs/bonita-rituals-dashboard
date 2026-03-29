import Image from 'next/image'
import { logout } from '@/lib/actions/auth'
import { LogOut } from 'lucide-react'

export function DashboardHeader() {
  return (
    <header className="bg-warm-white border-b border-gold/20 px-5 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Image src="/logo.PNG" alt="Bonita Rituals" width={34} height={34} className="object-contain" />
        <span className="font-display font-light text-[18px] tracking-[0.06em] text-gold-dark uppercase hidden sm:block">
          Bonita Rituals
        </span>
      </div>

      <form action={logout}>
        <button
          type="submit"
          className="flex items-center gap-2 text-[12px] font-sans font-medium uppercase tracking-[0.08em] text-warm-gray hover:text-gold-dark transition-colors duration-150"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Salir</span>
        </button>
      </form>
    </header>
  )
}
