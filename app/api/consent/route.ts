import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import type { ClientInsert, ConsentFormInsert } from '@/types/database'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = createServiceClient()

    const {
      full_name,
      phone,
      has_previous_extensions,
      wears_contacts,
      wear_type,
      look_type,
      health_flags,
      notes,
      technique,
      style,
      thickness,
      curl,
      brand,
      signature_data_url,
      photo_permission,
      photo_tag_username,
      client_age_confirmed,
      locale,
    } = body

    // Upsert client by phone
    let clientId: string

    const { data: existingClient } = await supabase
      .from('clients')
      .select('id')
      .eq('phone', phone)
      .single()

    if (existingClient) {
      clientId = existingClient.id
      // Update notes and basic info on repeat visits
      if (notes) {
        await supabase
          .from('clients')
          .update({ notes, has_previous_extensions: has_previous_extensions ?? false, wears_contacts: wears_contacts ?? false })
          .eq('id', clientId)
      }
    } else {
      const clientData: ClientInsert = {
        full_name,
        phone,
        has_previous_extensions: has_previous_extensions ?? false,
        wears_contacts: wears_contacts ?? false,
        notes,
      }

      const { data: newClient, error: clientError } = await supabase
        .from('clients')
        .insert(clientData)
        .select('id')
        .single()

      if (clientError || !newClient) {
        console.error('Client insert error:', clientError)
        return NextResponse.json({ error: 'Failed to create client' }, { status: 500 })
      }

      clientId = newClient.id
    }

    // Create consent form
    const consentData: ConsentFormInsert = {
      client_id: clientId,
      wear_type,
      look_type,
      health_flags,
      technique,
      style,
      thickness,
      curl,
      brand,
      signed_at: new Date().toISOString(),
      signature_data_url,
      photo_permission: photo_permission ?? false,
      photo_tag_username,
      client_age_confirmed: client_age_confirmed ?? false,
      locale: locale ?? 'es',
    }

    const { data: consent, error: consentError } = await supabase
      .from('consent_forms')
      .insert(consentData)
      .select('id')
      .single()

    if (consentError || !consent) {
      console.error('Consent insert error:', consentError)
      return NextResponse.json({ error: 'Failed to create consent form' }, { status: 500 })
    }

    return NextResponse.json({ consentId: consent.id, clientId }, { status: 201 })
  } catch (error) {
    console.error('Consent API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
