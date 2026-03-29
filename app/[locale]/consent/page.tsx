import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { ConsentForm, type AllMessages } from '@/components/consent/ConsentForm'
import type { Locale } from '@/components/consent/LanguageSwitcher'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('consent')
  return { title: `${t('title')} — Bonita Rituals` }
}

export default async function ConsentPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // Load all three message sets on the server so the client can switch
  // languages without navigation (preserving form state)
  const [es, en, fr] = await Promise.all([
    import('@/messages/es.json').then((m) => m.default),
    import('@/messages/en.json').then((m) => m.default),
    import('@/messages/fr.json').then((m) => m.default),
  ])

  const allMessages: AllMessages = { es, en, fr }
  const initialLocale = (['es', 'en', 'fr'].includes(locale) ? locale : 'es') as Locale

  return (
    <main className="min-h-screen bg-peach--background py-8 px-4 sm:py-12">
      <ConsentForm initialLocale={initialLocale} allMessages={allMessages} />
    </main>
  )
}
