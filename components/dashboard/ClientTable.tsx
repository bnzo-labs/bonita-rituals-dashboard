'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { ClientWithLatestService } from '@/types/database'

const SERVICE_TYPE_LABELS: Record<string, string> = {
  new_set: 'Juego nuevo',
  fill: 'Relleno',
  removal: 'Remoción',
}

type Filter = 'all' | 'paid' | 'pending' | 'signed' | 'unsigned'

interface ClientTableProps {
  clients: ClientWithLatestService[]
  locale: string
}

export function ClientTable({ clients, locale }: ClientTableProps) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  const filtered = useMemo(() => {
    return clients.filter((c) => {
      const matchesSearch =
        search === '' ||
        c.full_name.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search)

      const matchesFilter = (() => {
        if (filter === 'all') return true
        if (filter === 'paid') return c.latest_consent?.payment_status === 'paid'
        if (filter === 'pending') return c.latest_consent?.payment_status === 'pending'
        if (filter === 'signed') return !!c.latest_consent?.signed_at
        if (filter === 'unsigned') return !c.latest_consent?.signed_at
        return true
      })()

      return matchesSearch && matchesFilter
    })
  }, [clients, search, filter])

  const filters: { id: Filter; label: string }[] = [
    { id: 'all', label: 'Todas' },
    { id: 'paid', label: 'Pagadas' },
    { id: 'pending', label: 'Pendiente' },
    { id: 'signed', label: 'Firmadas' },
    { id: 'unsigned', label: 'Sin firmar' },
  ]

  return (
    <div className="space-y-4">
      {/* Search + filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-warm-gray" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o teléfono..."
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                'px-3 py-1 rounded-md text-[11px] font-sans font-medium uppercase tracking-[0.06em] transition-all duration-150',
                filter === f.id
                  ? 'bg-gold text-charcoal'
                  : 'bg-warm-white border border-gold/25 text-warm-gray hover:border-gold/60 hover:text-gold-dark'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-gold/15 bg-warm-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[15px]">
            <thead>
              <tr className="border-b border-gold/15 bg-peach/30">
                <th className="text-left px-5 py-3 text-[11px] font-sans font-medium uppercase tracking-[0.08em] text-warm-gray">Nombre</th>
                <th className="text-left px-5 py-3 text-[11px] font-sans font-medium uppercase tracking-[0.08em] text-warm-gray hidden sm:table-cell">Teléfono</th>
                <th className="text-left px-5 py-3 text-[11px] font-sans font-medium uppercase tracking-[0.08em] text-warm-gray hidden md:table-cell">Registro</th>
                <th className="text-left px-5 py-3 text-[11px] font-sans font-medium uppercase tracking-[0.08em] text-warm-gray hidden lg:table-cell">Último servicio</th>
                <th className="text-left px-5 py-3 text-[11px] font-sans font-medium uppercase tracking-[0.08em] text-warm-gray hidden lg:table-cell">Tipo</th>
                <th className="text-center px-5 py-3 text-[11px] font-sans font-medium uppercase tracking-[0.08em] text-warm-gray">Firma</th>
                <th className="text-center px-5 py-3 text-[11px] font-sans font-medium uppercase tracking-[0.08em] text-warm-gray">Pago</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-warm-gray text-[15px]">
                    {search || filter !== 'all' ? 'No se encontraron resultados.' : 'No hay clientas registradas aún.'}
                  </td>
                </tr>
              ) : (
                filtered.map((client, i) => (
                  <tr
                    key={client.id}
                    onClick={() => router.push(`/${locale}/dashboard/clients/${client.id}`)}
                    className={cn(
                      'cursor-pointer transition-colors duration-100 hover:bg-gold/5',
                      i > 0 && 'border-t border-gold/10'
                    )}
                  >
                    <td className="px-5 py-3.5 font-medium text-charcoal">{client.full_name}</td>
                    <td className="px-5 py-3.5 text-warm-gray hidden sm:table-cell">{client.phone}</td>
                    <td className="px-5 py-3.5 text-warm-gray hidden md:table-cell">
                      {format(new Date(client.created_at), 'dd/MM/yyyy')}
                    </td>
                    <td className="px-5 py-3.5 text-warm-gray hidden lg:table-cell">
                      {client.latest_service?.service_date
                        ? format(new Date(client.latest_service.service_date), 'dd/MM/yyyy')
                        : '—'}
                    </td>
                    <td className="px-5 py-3.5 hidden lg:table-cell text-charcoal/70">
                      {client.latest_service?.service_type
                        ? SERVICE_TYPE_LABELS[client.latest_service.service_type] ?? client.latest_service.service_type
                        : '—'}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      {client.latest_consent?.signed_at ? (
                        <Badge variant="success">Firmado</Badge>
                      ) : (
                        <Badge variant="error">Sin firmar</Badge>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      {client.latest_consent?.payment_status === 'paid' ? (
                        <Badge variant="success">Pagado</Badge>
                      ) : (
                        <Badge variant="warning">Pendiente</Badge>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-[13px] text-warm-gray text-right">
        {filtered.length} de {clients.length} clientas
      </p>
    </div>
  )
}
