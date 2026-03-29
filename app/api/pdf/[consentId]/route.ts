import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { readFileSync } from 'fs'
import { join } from 'path'
import React from 'react'
import { createServiceClient } from '@/lib/supabase/server'
import { ConsentPDF } from '@/components/pdf/ConsentPDF'
import type { ConsentForm, Client } from '@/types/database'

export async function GET(
  _request: NextRequest,
  { params }: { params: { consentId: string } }
) {
  const { consentId } = params
  const supabase = createServiceClient()

  // Fetch consent form + client in one query
  const { data, error } = await supabase
    .from('consent_forms')
    .select('*, clients(*)')
    .eq('id', consentId)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Consent form not found' }, { status: 404 })
  }

  const consent = data as ConsentForm
  const client = data.clients as unknown as Client

  if (!client) {
    return NextResponse.json({ error: 'Client not found' }, { status: 404 })
  }

  // Read logo and convert to base64 for embedding in PDF
  let logoBase64 = ''
  try {
    const logoPath = join(process.cwd(), 'public', 'logo.PNG')
    const logoBuffer = readFileSync(logoPath)
    logoBase64 = logoBuffer.toString('base64')
  } catch {
    // Logo missing — PDF will render without it
  }

  // Generate PDF buffer
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const element = React.createElement(ConsentPDF, { consent, client, logoBase64 }) as any
  const pdfBuffer = await renderToBuffer(element)

  const clientName = client.full_name.replace(/[^a-z0-9]/gi, '_').toLowerCase()
  const filename = `bonita-rituals-consent-${clientName}.pdf`

  // Convert Node Buffer to Uint8Array for the Web Response API
  const uint8 = new Uint8Array(pdfBuffer)

  return new NextResponse(uint8, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': uint8.byteLength.toString(),
    },
  })
}
