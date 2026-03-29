'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { LanguageSwitcher, type Locale } from './LanguageSwitcher'
import { SignaturePad } from './SignaturePad'
import { ConsentConfirmation } from './ConsentConfirmation'
import type { HealthFlag, WearType, LookType } from '@/types/database'
import { cn } from '@/lib/utils'

// ── Translator ────────────────────────────────────────────────────────────────
type NestedMessages = Record<string, unknown>

function makeT(messages: NestedMessages, namespace: string) {
  const ns = (messages as Record<string, unknown>)[namespace] as NestedMessages
  return function t(key: string): string {
    const parts = key.split('.')
    let current: unknown = ns
    for (const part of parts) {
      if (typeof current !== 'object' || current === null) return key
      current = (current as Record<string, unknown>)[part]
    }
    return typeof current === 'string' ? current : key
  }
}

// ── Types ─────────────────────────────────────────────────────────────────────
export type AllMessages = Record<Locale, NestedMessages>

const HEALTH_FLAGS: HealthFlag[] = [
  'dry_eyes', 'allergies', 'oily_skin', 'sensitive_eyes',
  'hay_fever', 'alopecia', 'thyroid', 'chemotherapy',
]

interface FormState {
  full_name: string
  phone: string
  has_previous_extensions: boolean | null
  wears_contacts: boolean | null
  wear_type: WearType | ''
  look_type: LookType | ''
  health_flags: HealthFlag[]
  notes: string
  signature_data_url: string | null
  photo_permission: boolean
  photo_tag_username: string
  client_age_confirmed: boolean
}

interface FormErrors {
  full_name?: string
  phone?: string
  has_previous_extensions?: string
  wears_contacts?: string
  signature?: string
  age?: string
}

const initialState: FormState = {
  full_name: '',
  phone: '',
  has_previous_extensions: null,
  wears_contacts: null,
  wear_type: '',
  look_type: '',
  health_flags: [],
  notes: '',
  signature_data_url: null,
  photo_permission: false,
  photo_tag_username: '',
  client_age_confirmed: false,
}

// ── Component ─────────────────────────────────────────────────────────────────
interface ConsentFormProps {
  initialLocale: Locale
  allMessages: AllMessages
}

export function ConsentForm({ initialLocale, allMessages }: ConsentFormProps) {
  const [locale, setLocale] = useState<Locale>(initialLocale)
  const [form, setForm] = useState<FormState>(initialState)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [consentId, setConsentId] = useState<string | null>(null)

  const t = makeT(allMessages[locale] as NestedMessages, 'consent')

  if (consentId) {
    return (
      <ConsentConfirmation
        consentId={consentId}
        clientName={form.full_name}
        downloadLabel={t('download_pdf')}
        confirmationTitle={t('confirmation_title')}
        confirmationBody={t('confirmation_body')}
      />
    )
  }

  function toggleHealthFlag(flag: HealthFlag) {
    setForm((prev) => ({
      ...prev,
      health_flags: prev.health_flags.includes(flag)
        ? prev.health_flags.filter((f) => f !== flag)
        : [...prev.health_flags, flag],
    }))
  }

  function validate(): FormErrors {
    const e: FormErrors = {}
    if (!form.full_name.trim()) e.full_name = t('errors.required')
    if (!form.phone.trim()) e.phone = t('errors.required')
    if (form.has_previous_extensions === null) e.has_previous_extensions = t('errors.required')
    if (form.wears_contacts === null) e.wears_contacts = t('errors.required')
    if (!form.signature_data_url) e.signature = t('errors.signature_required')
    if (!form.client_age_confirmed) e.age = t('errors.age_required')
    return e
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      document.querySelector('[data-error="true"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    setErrors({})
    setSubmitting(true)
    setSubmitError(null)

    try {
      const payload = {
        full_name: form.full_name.trim(),
        phone: form.phone.trim(),
        has_previous_extensions: form.has_previous_extensions,
        wears_contacts: form.wears_contacts,
        wear_type: form.wear_type || undefined,
        look_type: form.look_type || undefined,
        health_flags: form.health_flags.length > 0 ? form.health_flags : undefined,
        notes: form.notes.trim() || undefined,
        signature_data_url: form.signature_data_url,
        photo_permission: form.photo_permission,
        photo_tag_username: form.photo_tag_username.trim() || undefined,
        client_age_confirmed: form.client_age_confirmed,
        locale,
      }

      const res = await fetch('/api/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        setSubmitError(t('errors.submit_failed'))
        return
      }

      const data = await res.json()
      setConsentId(data.consentId)
    } catch {
      setSubmitError(t('errors.submit_failed'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-[640px] mx-auto">

      {/* ── Header ── */}
      <header className="text-center mb-8">
        <div className="flex justify-end mb-6">
          <LanguageSwitcher locale={locale} onLocaleChange={setLocale} />
        </div>
        <div className="flex justify-center mb-5">
          <Image
            src="/logo.PNG"
            alt="Bonita Rituals"
            width={180}
            height={180}
            className="object-contain"
            priority
          />
        </div>

      </header>

      {/* ── Form card ── */}
      <div className="bg-warm-white border border-gold/15 rounded-lg overflow-hidden">
        <form onSubmit={handleSubmit} noValidate>

          {/* ── Section 1: Client info ── */}
          <SectionDivider title={t('sections.client_info')} first />
          <div className="px-5 sm:px-8 pb-7 space-y-5">

            <div className="space-y-1.5" data-error={errors.full_name ? 'true' : undefined}>
              <Label htmlFor="full_name">{t('fields.full_name')} *</Label>
              <Input
                id="full_name"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                placeholder={t('fields.full_name_placeholder')}
                aria-invalid={!!errors.full_name}
              />
              {errors.full_name && <p className="text-danger text-[13px]">{errors.full_name}</p>}
            </div>

            <div className="space-y-1.5" data-error={errors.phone ? 'true' : undefined}>
              <Label htmlFor="phone">{t('fields.phone')} *</Label>
              <Input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder={t('fields.phone_placeholder')}
                aria-invalid={!!errors.phone}
              />
              {errors.phone && <p className="text-danger text-[13px]">{errors.phone}</p>}
            </div>

            <div className="space-y-2" data-error={errors.has_previous_extensions ? 'true' : undefined}>
              <Label>{t('fields.previous_extensions')} *</Label>
              <div className="flex gap-3">
                <YesNoButton selected={form.has_previous_extensions === true} onClick={() => setForm({ ...form, has_previous_extensions: true })} label={t('yes')} />
                <YesNoButton selected={form.has_previous_extensions === false} onClick={() => setForm({ ...form, has_previous_extensions: false })} label={t('no')} />
              </div>
              {errors.has_previous_extensions && <p className="text-danger text-[13px]">{errors.has_previous_extensions}</p>}
            </div>

            <div className="space-y-2" data-error={errors.wears_contacts ? 'true' : undefined}>
              <Label>{t('fields.contacts')} *</Label>
              <div className="flex gap-3">
                <YesNoButton selected={form.wears_contacts === true} onClick={() => setForm({ ...form, wears_contacts: true })} label={t('yes')} />
                <YesNoButton selected={form.wears_contacts === false} onClick={() => setForm({ ...form, wears_contacts: false })} label={t('no')} />
              </div>
              {errors.wears_contacts && <p className="text-danger text-[13px]">{errors.wears_contacts}</p>}
            </div>
          </div>

          {/* ── Section 2: Preferences ── */}
          <SectionDivider title={t('sections.preferences')} />
          <div className="px-5 sm:px-8 pb-7 space-y-5">

            <div className="space-y-2">
              <Label>{t('fields.wear_type')}</Label>
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                <RadioCard selected={form.wear_type === 'long_term'} onClick={() => setForm({ ...form, wear_type: 'long_term' })} label={t('fields.wear_type_long_term')} />
                <RadioCard selected={form.wear_type === 'special_occasion'} onClick={() => setForm({ ...form, wear_type: 'special_occasion' })} label={t('fields.wear_type_special')} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t('fields.look_type')}</Label>
              <div className="flex gap-3">
                <RadioCard selected={form.look_type === 'natural'} onClick={() => setForm({ ...form, look_type: 'natural' })} label={t('fields.look_natural')} />
                <RadioCard selected={form.look_type === 'dramatic'} onClick={() => setForm({ ...form, look_type: 'dramatic' })} label={t('fields.look_dramatic')} />
              </div>
            </div>
          </div>

          {/* ── Section 3: Health ── */}
          <SectionDivider title={t('sections.health')} />
          <div className="px-5 sm:px-8 pb-7 space-y-4">

            <p className="text-[15px] text-warm-gray">{t('fields.health_flags')}</p>

            <div className="grid grid-cols-2 gap-y-3 gap-x-4">
              {HEALTH_FLAGS.map((flag) => (
                <CustomCheckbox
                  key={flag}
                  checked={form.health_flags.includes(flag)}
                  onToggle={() => toggleHealthFlag(flag)}
                  label={t(`fields.${flag}`)}
                />
              ))}
            </div>

            <div className="space-y-1.5 pt-1">
              <Label htmlFor="notes">{t('fields.notes')}</Label>
              <Textarea
                id="notes"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder={t('fields.notes_placeholder')}
                rows={3}
              />
            </div>
          </div>

          {/* ── Section 4: Consent ── */}
          <SectionDivider title={t('sections.consent_text')} />
          <div className="px-5 sm:px-8 pb-7 space-y-5">

            {Array.isArray((allMessages[locale] as any)?.consent?.acknowledgements) && (
              <div className="space-y-3">
                {(allMessages[locale] as any).consent.acknowledgements.map((item: string, i: number) => (
                  <p key={i} className="text-[14px] text-charcoal/80 leading-relaxed">
                    <span className="mr-2">{i + 1}.</span>
                    {item}
                  </p>
                ))}
              </div>
            )}

            <p className="text-[15px] text-charcoal/80 leading-relaxed">{t('consent_body')}</p>


            <div data-error={errors.age ? 'true' : undefined}>
              <CustomCheckbox
                checked={form.client_age_confirmed}
                onToggle={() => setForm({ ...form, client_age_confirmed: !form.client_age_confirmed })}
                label={`${t('fields.age_confirmed')} *`}
              />
              {errors.age && <p className="text-danger text-[13px] mt-1 ml-7">{errors.age}</p>}
            </div>

            <div className="space-y-2" data-error={errors.signature ? 'true' : undefined}>
              <Label>{t('fields.signature')} *</Label>
              <SignaturePad
                onChange={(dataUrl) => setForm({ ...form, signature_data_url: dataUrl })}
                error={!!errors.signature}
                signHereLabel={t('sign_here')}
                clearLabel={t('fields.clear_signature')}
              />
              {errors.signature && <p className="text-danger text-[13px]">{errors.signature}</p>}
            </div>
          </div>

          {/* ── Section 5: Photo ── */}
          <SectionDivider title={t('sections.photo')} />
          <div className="px-5 sm:px-8 pb-7 space-y-4">

            <CustomCheckbox
              checked={form.photo_permission}
              onToggle={() => setForm({ ...form, photo_permission: !form.photo_permission })}
              label={t('fields.photo_permission')}
            />

            {form.photo_permission && (
              <div className="space-y-1.5 ml-7">
                <Label htmlFor="photo_tag">{t('fields.photo_tag_username')}</Label>
                <Input
                  id="photo_tag"
                  value={form.photo_tag_username}
                  onChange={(e) => setForm({ ...form, photo_tag_username: e.target.value })}
                  placeholder={t('fields.photo_tag_placeholder')}
                />
              </div>
            )}
          </div>

          {/* ── Submit ── */}
          <div className="px-5 sm:px-8 pb-8 pt-2">
            {submitError && (
              <p className="text-danger text-[13px] text-center mb-4">{submitError}</p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className={cn(
                'w-full h-12 bg-gold text-charcoal font-sans text-[13px] font-medium tracking-[0.1em] uppercase',
                'rounded-sm transition-all duration-200 hover:-translate-y-px hover:bg-gold-dark',
                'disabled:opacity-60 disabled:pointer-events-none'
              )}
            >
              {submitting ? '...' : t('submit')}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

// ── Local helpers ─────────────────────────────────────────────────────────────

function SectionDivider({ title, first }: { title: string; first?: boolean }) {
  return (
    <div className={cn('flex items-center gap-4 px-5 sm:px-8 py-5', !first && 'border-t border-gold/15')}>
      <div className="h-px flex-1 bg-gold/25" />
      <span className="text-[11px] font-sans font-medium uppercase tracking-[0.12em] text-gold-dark shrink-0">
        {title}
      </span>
      <div className="h-px flex-1 bg-gold/25" />
    </div>
  )
}

function CustomCheckbox({
  checked,
  onToggle,
  label,
}: {
  checked: boolean
  onToggle: () => void
  label: string
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <input type="checkbox" className="sr-only" checked={checked} onChange={onToggle} />
      <div
        className={cn(
          'flex-shrink-0 mt-0.5 h-[18px] w-[18px] border rounded-md flex items-center justify-center transition-all duration-150',
          checked
            ? 'border-gold bg-gold/10'
            : 'border-gold/40 bg-warm-white group-hover:bg-gold/5'
        )}
      >
        {checked && (
          <svg viewBox="0 0 10 8" width="10" height="8" fill="none" stroke="#B8860B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1,4 4,7 9,1" />
          </svg>
        )}
      </div>
      <span className="text-[15px] leading-snug text-charcoal">{label}</span>
    </label>
  )
}

function YesNoButton({ selected, onClick, label }: { selected: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'min-w-[72px] px-6 py-2.5 rounded-md border text-[13px] font-sans font-medium uppercase tracking-[0.06em] transition-all duration-150',
        selected
          ? 'bg-gold text-charcoal border-gold'
          : 'border-gold/30 bg-warm-white text-warm-gray hover:border-gold hover:text-gold-dark'
      )}
    >
      {label}
    </button>
  )
}

function RadioCard({ selected, onClick, label }: { selected: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex-1 px-4 py-3 rounded-md border text-[15px] font-sans text-left transition-all duration-150',
        selected
          ? 'bg-gold/8 border-gold text-gold-dark'
          : 'border-gold/25 bg-warm-white text-charcoal hover:border-gold/50'
      )}
    >
      {label}
    </button>
  )
}
