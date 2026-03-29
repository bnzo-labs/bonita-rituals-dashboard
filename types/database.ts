// Generated types for Bonita Rituals database
// Run `supabase gen types typescript --project-id <id>` to regenerate

export type PaymentStatus = 'pending' | 'paid'
export type ServiceType = 'new_set' | 'fill' | 'removal'
export type WearType = 'long_term' | 'special_occasion'
export type LookType = 'natural' | 'dramatic'
export type Technique = 'classic' | 'brazilian_v' | 'hawaiian_v' | 'egyptian_v'
export type LashStyle = 'natural' | 'cat_eye' | 'squirrel' | 'doll'
export type Locale = 'es' | 'en' | 'fr'

export type HealthFlag =
  | 'dry_eyes'
  | 'allergies'
  | 'oily_skin'
  | 'sensitive_eyes'
  | 'hay_fever'
  | 'alopecia'
  | 'thyroid'
  | 'chemotherapy'

export interface Client {
  id: string
  created_at: string
  full_name: string
  phone: string
  has_previous_extensions: boolean
  wears_contacts: boolean
  notes: string | null
  is_active: boolean
}

export interface ConsentForm {
  id: string
  created_at: string
  client_id: string
  wear_type: WearType | null
  look_type: LookType | null
  health_flags: HealthFlag[] | null
  technique: Technique | null
  style: LashStyle | null
  thickness: string | null
  curl: string | null
  brand: string | null
  signed_at: string | null
  signature_data_url: string | null
  photo_permission: boolean
  photo_tag_username: string | null
  client_age_confirmed: boolean
  payment_status: PaymentStatus
  locale: Locale
}

export interface Service {
  id: string
  created_at: string
  client_id: string
  consent_form_id: string | null
  service_date: string
  service_type: ServiceType | null
  technique: Technique | null
  style: LashStyle | null
  thickness: string | null
  curl: string | null
  brand: string | null
  price_cad: number | null
  payment_status: PaymentStatus
  notes: string | null
}

// Joined types for the dashboard
export interface ClientWithLatestService extends Client {
  latest_consent: ConsentForm | null
  latest_service: Service | null
}

export interface ConsentFormInsert {
  client_id: string
  wear_type?: WearType
  look_type?: LookType
  health_flags?: HealthFlag[]
  technique?: Technique
  style?: LashStyle
  thickness?: string
  curl?: string
  brand?: string
  signed_at: string
  signature_data_url: string
  photo_permission: boolean
  photo_tag_username?: string
  client_age_confirmed: boolean
  payment_status?: PaymentStatus
  locale: Locale
}

export interface ClientInsert {
  full_name: string
  phone: string
  has_previous_extensions?: boolean
  wears_contacts?: boolean
  notes?: string
}
