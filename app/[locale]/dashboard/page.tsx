import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { ClientTable } from '@/components/dashboard/ClientTable'
import type { ClientWithLatestService, ConsentForm, Service } from '@/types/database'

export const metadata: Metadata = { title: 'Clientas — Bonita Rituals' }

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/${locale}/login`)

  // Fetch clients with their latest consent form and service
  const { data: clients } = await supabase
    .from('clients')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (!clients) {
    return (
      <div className="min-h-screen bg-peach">
        <DashboardHeader />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-warm-gray">Error al cargar las clientas.</p>
        </main>
      </div>
    )
  }

  // Fetch latest consent form per client
  const { data: consents } = await supabase
    .from('consent_forms')
    .select('*')
    .in('client_id', clients.map((c) => c.id))
    .order('created_at', { ascending: false })

  // Fetch latest service per client
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .in('client_id', clients.map((c) => c.id))
    .order('service_date', { ascending: false })

  // Map latest consent and service onto each client
  const latestConsentByClient = new Map<string, ConsentForm>()
  for (const consent of (consents ?? [])) {
    if (!latestConsentByClient.has(consent.client_id)) {
      latestConsentByClient.set(consent.client_id, consent as ConsentForm)
    }
  }

  const latestServiceByClient = new Map<string, Service>()
  for (const service of (services ?? [])) {
    if (!latestServiceByClient.has(service.client_id)) {
      latestServiceByClient.set(service.client_id, service as Service)
    }
  }

  const clientsWithData: ClientWithLatestService[] = clients.map((c) => ({
    ...c,
    latest_consent: latestConsentByClient.get(c.id) ?? null,
    latest_service: latestServiceByClient.get(c.id) ?? null,
  }))

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display font-light text-[28px] tracking-[0.04em] text-gold-dark uppercase">Clientas</h1>
          <span className="text-sm text-muted-foreground">{clients.length} registradas</span>
        </div>
        <ClientTable clients={clientsWithData} locale={locale} />
      </main>
    </div>
  )
}
