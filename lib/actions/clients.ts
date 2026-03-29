'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { ServiceType, Technique, LashStyle } from '@/types/database'

export async function updateClientNotes(clientId: string, notes: string) {
  const supabase = await createClient()
  await supabase.from('clients').update({ notes }).eq('id', clientId)
  revalidatePath(`/dashboard/clients/${clientId}`)
}

export async function updatePaymentStatus(consentId: string, clientId: string, status: 'paid' | 'pending') {
  const supabase = await createClient()
  await supabase.from('consent_forms').update({ payment_status: status }).eq('id', consentId)
  revalidatePath(`/dashboard/clients/${clientId}`)
}

export async function addService(formData: FormData) {
  const supabase = await createClient()
  const clientId = formData.get('client_id') as string

  await supabase.from('services').insert({
    client_id: clientId,
    service_date: formData.get('service_date') as string,
    service_type: (formData.get('service_type') as ServiceType) || null,
    technique: (formData.get('technique') as Technique) || null,
    style: (formData.get('style') as LashStyle) || null,
    thickness: (formData.get('thickness') as string) || null,
    curl: (formData.get('curl') as string) || null,
    brand: (formData.get('brand') as string) || null,
    price_cad: formData.get('price_cad') ? Number(formData.get('price_cad')) : null,
    payment_status: (formData.get('payment_status') as 'pending' | 'paid') ?? 'pending',
    notes: (formData.get('notes') as string) || null,
  })

  revalidatePath(`/dashboard/clients/${clientId}`)
}
