'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { ArrowLeft, Download, CheckCircle, Clock, FileText, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { updateClientNotes, updatePaymentStatus, addService } from '@/lib/actions/clients'
import type { Client, ConsentForm, Service } from '@/types/database'

const SERVICE_TYPE_LABELS: Record<string, string> = {
  new_set: 'Juego nuevo',
  fill: 'Relleno',
  removal: 'Remoción',
}

const TECHNIQUE_LABELS: Record<string, string> = {
  classic: 'Clásica',
  brazilian_v: 'Brasileña V',
  hawaiian_v: 'Hawaiana V',
  egyptian_v: 'Egipcia V',
}

const STYLE_LABELS: Record<string, string> = {
  natural: 'Natural',
  cat_eye: 'Cat Eye',
  squirrel: 'Squirrel',
  doll: 'Doll',
}

interface ClientDetailProps {
  client: Client
  consents: ConsentForm[]
  services: Service[]
  locale: string
}

export function ClientDetail({ client, consents, services, locale }: ClientDetailProps) {
  const router = useRouter()
  const [notes, setNotes] = useState(client.notes ?? '')
  const [savingNotes, setSavingNotes] = useState(false)
  const [showServiceForm, setShowServiceForm] = useState(false)
  const [addingService, setAddingService] = useState(false)

  async function handleSaveNotes() {
    setSavingNotes(true)
    await updateClientNotes(client.id, notes)
    setSavingNotes(false)
  }

  async function handleTogglePayment(consent: ConsentForm) {
    const next = consent.payment_status === 'paid' ? 'pending' : 'paid'
    await updatePaymentStatus(consent.id, client.id, next)
  }

  async function handleAddService(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setAddingService(true)
    const fd = new FormData(e.currentTarget)
    fd.append('client_id', client.id)
    await addService(fd)
    setAddingService(false)
    setShowServiceForm(false)
    ;(e.target as HTMLFormElement).reset()
  }

  return (
    <div className="space-y-6">
      {/* Back */}
      <button
        onClick={() => router.push(`/${locale}/dashboard`)}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-gold-700 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver
      </button>

      {/* Client header */}
      <div className="bg-white rounded-lg border border-border p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-display font-light text-[26px] tracking-[0.03em] text-gold-dark">{client.full_name}</h1>
            <p className="text-muted-foreground mt-1">{client.phone}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Registrada el {format(new Date(client.created_at), 'dd/MM/yyyy')}
            </p>
          </div>
          <div className="flex flex-col gap-1.5 text-sm">
            <span className="text-muted-foreground">
              Extensiones previas: <strong>{client.has_previous_extensions ? 'Sí' : 'No'}</strong>
            </span>
            <span className="text-muted-foreground">
              Lentes de contacto: <strong>{client.wears_contacts ? 'Sí' : 'No'}</strong>
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: notes */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Notas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notas sobre esta clienta..."
                rows={5}
              />
              <Button
                onClick={handleSaveNotes}
                disabled={savingNotes}
                size="sm"
                className="w-full"
              >
                {savingNotes ? 'Guardando...' : 'Guardar notas'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right column: consents + services */}
        <div className="lg:col-span-2 space-y-6">

          {/* Consent history */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4 text-gold" />
                Historial de consentimientos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {consents.length === 0 ? (
                <p className="text-sm text-muted-foreground">Sin formularios de consentimiento.</p>
              ) : (
                <div className="space-y-3">
                  {consents.map((consent) => (
                    <div
                      key={consent.id}
                      className="flex items-center justify-between gap-4 p-3 rounded-md border border-border bg-peach/20"
                    >
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-sm font-medium">
                          {consent.signed_at
                            ? format(new Date(consent.signed_at), 'dd/MM/yyyy')
                            : 'Sin fecha'}
                        </span>
                        {consent.signed_at ? (
                          <Badge variant="success">Firmado</Badge>
                        ) : (
                          <Badge variant="error">Sin firmar</Badge>
                        )}
                        <button
                          onClick={() => handleTogglePayment(consent)}
                          className="cursor-pointer"
                        >
                          {consent.payment_status === 'paid' ? (
                            <Badge variant="success">Pagado</Badge>
                          ) : (
                            <Badge variant="warning">Pendiente</Badge>
                          )}
                        </button>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/api/pdf/${consent.id}`, '_blank')}
                        className="shrink-0 gap-1.5"
                      >
                        <Download className="h-3.5 w-3.5" />
                        PDF
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Service history */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-gold" />
                  Historial de servicios
                </CardTitle>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowServiceForm((v) => !v)}
                  className="gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Agregar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">

              {/* Add service form */}
              {showServiceForm && (
                <form
                  onSubmit={handleAddService}
                  className="p-4 rounded-md border border-gold/30 bg-peach/20 space-y-4"
                >
                  {/* Date, type, price, payment */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="service_date">Fecha *</Label>
                      <Input
                        id="service_date"
                        name="service_date"
                        type="date"
                        required
                        defaultValue={format(new Date(), 'yyyy-MM-dd')}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="service_type">Tipo</Label>
                      <select
                        id="service_type"
                        name="service_type"
                        className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="">—</option>
                        <option value="new_set">Juego nuevo</option>
                        <option value="fill">Relleno</option>
                        <option value="removal">Remoción</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="price_cad">Precio (CAD)</Label>
                      <Input
                        id="price_cad"
                        name="price_cad"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="payment_status">Pago</Label>
                      <select
                        id="payment_status"
                        name="payment_status"
                        className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="pending">Pendiente</option>
                        <option value="paid">Pagado</option>
                      </select>
                    </div>
                  </div>

                  {/* Lash map */}
                  <div>
                    <p className="text-xs font-semibold text-gold-700 uppercase tracking-wide mb-2">Mapa de pestañas</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="technique">Técnica</Label>
                        <select
                          id="technique"
                          name="technique"
                          className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <option value="">—</option>
                          <option value="classic">Clásica</option>
                          <option value="brazilian_v">Brasileña V</option>
                          <option value="hawaiian_v">Hawaiana V</option>
                          <option value="egyptian_v">Egipcia V</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="style">Estilo</Label>
                        <select
                          id="style"
                          name="style"
                          className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <option value="">—</option>
                          <option value="natural">Natural</option>
                          <option value="cat_eye">Cat Eye</option>
                          <option value="squirrel">Squirrel</option>
                          <option value="doll">Doll</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="thickness">Grosor</Label>
                        <Input id="thickness" name="thickness" placeholder="ej. 0.10" />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="curl">Curvatura</Label>
                        <Input id="curl" name="curl" placeholder="ej. C, D" />
                      </div>
                      <div className="space-y-1.5 col-span-2">
                        <Label htmlFor="brand">Marca</Label>
                        <Input id="brand" name="brand" placeholder="ej. Lashbrow" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="service_notes">Notas del servicio</Label>
                    <Textarea id="service_notes" name="notes" rows={2} placeholder="Observaciones..." />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" size="sm" disabled={addingService}>
                      {addingService ? 'Guardando...' : 'Guardar servicio'}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowServiceForm(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              )}

              {/* Service list */}
              {services.length === 0 ? (
                <p className="text-sm text-muted-foreground">Sin servicios registrados.</p>
              ) : (
                <div className="space-y-2">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className="p-3 rounded-md border border-border space-y-2"
                    >
                      <div className="flex items-center gap-3 flex-wrap">
                        <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-sm font-medium">
                          {format(new Date(service.service_date), 'dd/MM/yyyy')}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {service.service_type ? SERVICE_TYPE_LABELS[service.service_type] : '—'}
                        </span>
                        {service.price_cad && (
                          <span className="text-sm font-semibold text-gold-700">
                            ${service.price_cad} CAD
                          </span>
                        )}
                        {service.payment_status === 'paid' ? (
                          <Badge variant="success">Pagado</Badge>
                        ) : (
                          <Badge variant="warning">Pendiente</Badge>
                        )}
                      </div>
                      {(service.technique || service.style || service.thickness || service.curl || service.brand) && (
                        <div className="flex gap-x-4 gap-y-0.5 flex-wrap text-xs text-muted-foreground pl-7">
                          {service.technique && <span>Técnica: <strong>{TECHNIQUE_LABELS[service.technique]}</strong></span>}
                          {service.style && <span>Estilo: <strong>{STYLE_LABELS[service.style]}</strong></span>}
                          {service.thickness && <span>Grosor: <strong>{service.thickness}</strong></span>}
                          {service.curl && <span>Curvatura: <strong>{service.curl}</strong></span>}
                          {service.brand && <span>Marca: <strong>{service.brand}</strong></span>}
                        </div>
                      )}
                      {service.notes && (
                        <p className="text-xs text-muted-foreground pl-7 truncate">
                          {service.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
