import { redirect, notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { ClientDetail } from '@/components/dashboard/ClientDetail'
import type { ConsentForm, Service } from '@/types/database'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  return { title: 'Clienta — Bonita Rituals' }
}

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/${locale}/login`)

  const [{ data: client }, { data: consents }, { data: services }] = await Promise.all([
    supabase.from('clients').select('*').eq('id', id).single(),
    supabase
      .from('consent_forms')
      .select('*')
      .eq('client_id', id)
      .order('created_at', { ascending: false }),
    supabase
      .from('services')
      .select('*')
      .eq('client_id', id)
      .order('service_date', { ascending: false }),
  ])

  if (!client) notFound()

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <ClientDetail
          client={client}
          consents={(consents ?? []) as ConsentForm[]}
          services={(services ?? []) as Service[]}
          locale={locale}
        />
      </main>
    </div>
  )
}
