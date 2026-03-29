'use client'

import Image from 'next/image'

interface ConsentConfirmationProps {
  consentId: string
  clientName: string
  downloadLabel: string
  confirmationTitle: string
  confirmationBody: string
}

export function ConsentConfirmation({
  consentId,
  clientName,
  downloadLabel,
  confirmationTitle,
  confirmationBody,
}: ConsentConfirmationProps) {
  function handleDownloadPDF() {
    window.open(`/api/pdf/${consentId}`, '_blank')
  }

  return (
    <div className="max-w-[640px] mx-auto text-center py-16 px-4">
      <div className="flex justify-center mb-6">
        <Image src="/logo.PNG" alt="Bonita Rituals" width={80} height={80} className="object-contain" />
      </div>

      {/* Gold circle checkmark */}
      <div className="flex justify-center mb-6">
        <div className="h-16 w-16 rounded-full border-2 border-gold flex items-center justify-center">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#B8860B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20,6 9,17 4,12" />
          </svg>
        </div>
      </div>

      <h1 className="font-display font-light text-[28px] tracking-[0.04em] text-gold-dark mb-2">
        {confirmationTitle}
      </h1>
      {clientName && (
        <p className="text-warm-gray text-[15px] mb-2">{clientName}</p>
      )}
      <p className="text-charcoal/75 text-[15px] leading-relaxed mb-10">{confirmationBody}</p>

      <button
        onClick={handleDownloadPDF}
        className="inline-flex items-center justify-center gap-2 h-12 px-10 bg-gold text-charcoal font-sans text-[13px] font-medium tracking-[0.1em] uppercase rounded-sm transition-all duration-200 hover:-translate-y-px hover:bg-gold-dark"
      >
        {downloadLabel}
      </button>
    </div>
  )
}
