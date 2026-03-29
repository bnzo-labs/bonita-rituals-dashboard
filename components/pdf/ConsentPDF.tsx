import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
  Font,
} from '@react-pdf/renderer'
import type { ConsentForm, Client } from '@/types/database'

// ── Fonts ─────────────────────────────────────────────────────────────────────
Font.register({
  family: 'Cinzel',
  src: 'https://fonts.gstatic.com/s/cinzel/v23/8vIJ7ww63mVu7gt79mT7.woff2',
})

// ── Colors ────────────────────────────────────────────────────────────────────
const GOLD = '#D4A017'
const GOLD_DARK = '#B8860B'
const PEACH = '#FEDAB9'
const PEACH_LIGHT = '#FFF0E6'
const TEXT = '#2A1F0E'
const TEXT_MUTED = '#7A6551'
const WHITE = '#FFFFFF'
const BORDER = '#E8D0B8'

// ── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  page: {
    backgroundColor: PEACH_LIGHT,
    paddingTop: 40,
    paddingBottom: 60,
    paddingHorizontal: 48,
    fontFamily: 'Helvetica',
    color: TEXT,
    fontSize: 10,
  },

  // Header
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1.5,
    borderBottomColor: GOLD,
  },
  logo: {
    width: 72,
    height: 72,
    marginBottom: 6,
  },
  brandName: {
    fontFamily: 'Cinzel',
    fontSize: 20,
    color: GOLD_DARK,
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 8,
    color: TEXT_MUTED,
    fontStyle: 'italic',
    marginTop: 2,
  },
  signedDate: {
    fontSize: 8,
    color: TEXT_MUTED,
    marginTop: 6,
  },

  // Sections
  section: {
    marginBottom: 14,
    backgroundColor: WHITE,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: 'hidden',
  },
  sectionTech: {
    marginBottom: 14,
    backgroundColor: PEACH,
    borderRadius: 6,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: GOLD,
    overflow: 'hidden',
  },
  sectionHeader: {
    backgroundColor: GOLD,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  sectionHeaderTech: {
    backgroundColor: GOLD_DARK,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    color: WHITE,
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionBody: {
    padding: 10,
  },

  // Rows
  row: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  col2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  fieldHalf: {
    width: '50%',
    marginBottom: 6,
    paddingRight: 8,
  },
  fieldFull: {
    width: '100%',
    marginBottom: 6,
  },
  label: {
    fontSize: 7.5,
    color: TEXT_MUTED,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  value: {
    fontSize: 9.5,
    color: TEXT,
  },
  valueMuted: {
    fontSize: 9.5,
    color: TEXT_MUTED,
    fontStyle: 'italic',
  },

  // Health flags
  flagsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 2,
  },
  flag: {
    backgroundColor: GOLD,
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 4,
    marginBottom: 4,
  },
  flagText: {
    color: WHITE,
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
  },
  noFlags: {
    fontSize: 9,
    color: TEXT_MUTED,
    fontStyle: 'italic',
  },

  // Consent text
  consentText: {
    fontSize: 8.5,
    color: TEXT,
    lineHeight: 1.6,
    marginBottom: 10,
  },

  // Signature
  signatureBox: {
    borderWidth: 1,
    borderColor: GOLD,
    borderRadius: 4,
    padding: 4,
    backgroundColor: WHITE,
    marginTop: 6,
  },
  signatureImage: {
    height: 80,
    objectFit: 'contain',
  },
  signatureLabel: {
    fontSize: 7,
    color: TEXT_MUTED,
    marginTop: 3,
    textAlign: 'right',
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 48,
    right: 48,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 7.5,
    color: TEXT_MUTED,
  },
  footerBrand: {
    fontSize: 7.5,
    color: GOLD_DARK,
    fontFamily: 'Helvetica-Bold',
  },

  // Divider
  divider: {
    borderTopWidth: 1,
    borderTopColor: BORDER,
    marginVertical: 8,
  },

  // Checkbox row
  checkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  checkBox: {
    width: 10,
    height: 10,
    borderWidth: 1,
    borderColor: GOLD,
    borderRadius: 2,
    marginRight: 6,
    marginTop: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBoxChecked: {
    backgroundColor: GOLD_DARK,
    borderColor: GOLD_DARK,
  },
  checkMark: {
    fontSize: 7,
    color: WHITE,
    fontFamily: 'Helvetica-Bold',
  },
  checkLabel: {
    fontSize: 8.5,
    color: TEXT,
    flex: 1,
    lineHeight: 1.4,
  },
})

// ── Helpers ───────────────────────────────────────────────────────────────────

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <View style={s.fieldHalf}>
      <Text style={s.label}>{label}</Text>
      <Text style={value ? s.value : s.valueMuted}>{value || '—'}</Text>
    </View>
  )
}

function FieldFull({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <View style={s.fieldFull}>
      <Text style={s.label}>{label}</Text>
      <Text style={value ? s.value : s.valueMuted}>{value || '—'}</Text>
    </View>
  )
}

function CheckRow({ checked, label }: { checked: boolean; label: string }) {
  return (
    <View style={s.checkRow}>
      <View style={[s.checkBox, checked ? s.checkBoxChecked : {}]}>
        {checked && <Text style={s.checkMark}>x</Text>}
      </View>
      <Text style={s.checkLabel}>{label}</Text>
    </View>
  )
}

function SectionHeader({ title, tech = false }: { title: string; tech?: boolean }) {
  return (
    <View style={tech ? s.sectionHeaderTech : s.sectionHeader}>
      <Text style={s.sectionTitle}>{title}</Text>
    </View>
  )
}

// ── PDF labels by locale ──────────────────────────────────────────────────────

const LABELS = {
  es: {
    client_info: 'Información del cliente',
    preferences: 'Preferencias',
    health: 'Salud y estilo de vida',
    technician: 'Mapa de pestañas (técnica)',
    consent: 'Consentimiento informado',
    photo: 'Permiso de fotos',
    full_name: 'Nombre y apellido',
    phone: 'Teléfono',
    previous_extensions: 'Extensiones previas',
    contacts: 'Lentes de contacto / gafas',
    wear_type: 'Uso',
    look_type: 'Look',
    health_flags: 'Condiciones de salud',
    notes: 'Notas',
    technique: 'Técnica',
    style: 'Estilo',
    thickness: 'Grosor',
    curl: 'Curvatura',
    brand: 'Marca',
    consent_body: 'Al firmar este formulario, confirmo que la información proporcionada es correcta y que entiendo los cuidados necesarios post-servicio. Acepto los términos y condiciones del servicio de Bonita Rituals.',
    age_confirmed: 'Confirmo que soy mayor de 18 años.',
    signature: 'Firma digital',
    photo_permission: 'Autorizo a Bonita Rituals a tomar y publicar fotos de mi trabajo en redes sociales.',
    instagram: 'Instagram',
    yes: 'Sí',
    no: 'No',
    signed_on: 'Firmado el',
    tagline: "Glow like it's sacred",
    none: 'Ninguna',
    health_flags_map: {
      dry_eyes: 'Ojos secos',
      allergies: 'Alergias',
      oily_skin: 'Piel grasa',
      sensitive_eyes: 'Ojos sensibles',
      hay_fever: 'Fiebre del heno',
      alopecia: 'Alopecia',
      thyroid: 'Tiroides',
      chemotherapy: 'Quimioterapia',
    },
    wear_type_map: { long_term: 'Uso continuo', special_occasion: 'Ocasión especial' },
    look_type_map: { natural: 'Natural', dramatic: 'Dramático' },
    technique_map: { classic: 'Clásica', brazilian_v: 'Brasileña V', hawaiian_v: 'Hawaiana V', egyptian_v: 'Egipcia V' },
    style_map: { natural: 'Natural', cat_eye: 'Cat Eye', squirrel: 'Squirrel', doll: 'Doll' },
  },
  en: {
    client_info: 'Client Information',
    preferences: 'Preferences',
    health: 'Health & Lifestyle',
    technician: 'Lash Map (Technician)',
    consent: 'Informed Consent',
    photo: 'Photo Permission',
    full_name: 'Full Name',
    phone: 'Phone',
    previous_extensions: 'Previous extensions',
    contacts: 'Contact lenses / glasses',
    wear_type: 'Wear type',
    look_type: 'Look',
    health_flags: 'Health conditions',
    notes: 'Notes',
    technique: 'Technique',
    style: 'Style',
    thickness: 'Thickness',
    curl: 'Curl',
    brand: 'Brand',
    consent_body: 'By signing this form, I confirm that the information provided is correct and that I understand the aftercare instructions. I accept the terms and conditions of Bonita Rituals services.',
    age_confirmed: 'I confirm that I am 18 years of age or older.',
    signature: 'Digital signature',
    photo_permission: 'I authorize Bonita Rituals to take and publish photos of my work on social media.',
    instagram: 'Instagram',
    yes: 'Yes',
    no: 'No',
    signed_on: 'Signed on',
    tagline: "Glow like it's sacred",
    none: 'None',
    health_flags_map: {
      dry_eyes: 'Dry eyes',
      allergies: 'Allergies',
      oily_skin: 'Oily skin',
      sensitive_eyes: 'Sensitive eyes',
      hay_fever: 'Hay fever',
      alopecia: 'Alopecia',
      thyroid: 'Thyroid',
      chemotherapy: 'Chemotherapy',
    },
    wear_type_map: { long_term: 'Ongoing use', special_occasion: 'Special occasion' },
    look_type_map: { natural: 'Natural', dramatic: 'Dramatic' },
    technique_map: { classic: 'Classic', brazilian_v: 'Brazilian V', hawaiian_v: 'Hawaiian V', egyptian_v: 'Egyptian V' },
    style_map: { natural: 'Natural', cat_eye: 'Cat Eye', squirrel: 'Squirrel', doll: 'Doll' },
  },
  fr: {
    client_info: 'Informations du client',
    preferences: 'Préférences',
    health: 'Santé et mode de vie',
    technician: 'Carte des cils (technicienne)',
    consent: 'Consentement éclairé',
    photo: 'Autorisation photo',
    full_name: 'Nom complet',
    phone: 'Téléphone',
    previous_extensions: 'Extensions précédentes',
    contacts: 'Lentilles / lunettes',
    wear_type: 'Usage',
    look_type: 'Look',
    health_flags: 'Conditions de santé',
    notes: 'Notes',
    technique: 'Technique',
    style: 'Style',
    thickness: 'Épaisseur',
    curl: 'Courbure',
    brand: 'Marque',
    consent_body: 'En signant ce formulaire, je confirme que les informations fournies sont exactes et que je comprends les instructions d\'entretien. J\'accepte les termes et conditions des services Bonita Rituals.',
    age_confirmed: 'Je confirme que j\'ai 18 ans ou plus.',
    signature: 'Signature numérique',
    photo_permission: 'J\'autorise Bonita Rituals à prendre et publier des photos de mon travail sur les réseaux sociaux.',
    instagram: 'Instagram',
    yes: 'Oui',
    no: 'Non',
    signed_on: 'Signé le',
    tagline: "Glow like it's sacred",
    none: 'Aucune',
    health_flags_map: {
      dry_eyes: 'Yeux secs',
      allergies: 'Allergies',
      oily_skin: 'Peau grasse',
      sensitive_eyes: 'Yeux sensibles',
      hay_fever: 'Rhume des foins',
      alopecia: 'Alopécie',
      thyroid: 'Thyroïde',
      chemotherapy: 'Chimiothérapie',
    },
    wear_type_map: { long_term: 'Usage continu', special_occasion: 'Occasion spéciale' },
    look_type_map: { natural: 'Naturel', dramatic: 'Dramatique' },
    technique_map: { classic: 'Classique', brazilian_v: 'Brésilienne V', hawaiian_v: 'Hawaïenne V', egyptian_v: 'Égyptienne V' },
    style_map: { natural: 'Naturel', cat_eye: 'Cat Eye', squirrel: 'Squirrel', doll: 'Doll' },
  },
} as const

type PDFLocale = keyof typeof LABELS

// ── Component ─────────────────────────────────────────────────────────────────

interface ConsentPDFProps {
  consent: ConsentForm
  client: Client
  logoBase64: string
}

export function ConsentPDF({ consent, client, logoBase64 }: ConsentPDFProps) {
  const locale = (consent.locale ?? 'es') as PDFLocale
  const L = LABELS[locale] ?? LABELS.es

  const signedDate = consent.signed_at
    ? new Date(consent.signed_at).toLocaleDateString(
        locale === 'es' ? 'es-CA' : locale === 'fr' ? 'fr-CA' : 'en-CA',
        { year: 'numeric', month: 'long', day: 'numeric' }
      )
    : '—'

  const healthFlagLabels =
    consent.health_flags && consent.health_flags.length > 0
      ? consent.health_flags.map((f) => L.health_flags_map[f] ?? f)
      : null

  return (
    <Document title={`Bonita Rituals — ${client.full_name}`} author="Bonita Rituals">
      <Page size="LETTER" style={s.page}>

        {/* ── Header ── */}
        <View style={s.header}>
          <Image style={s.logo} src={`data:image/png;base64,${logoBase64}`} />
          <Text style={s.brandName}>BONITA RITUALS</Text>
          <Text style={s.tagline}>{L.tagline}</Text>
          <Text style={s.signedDate}>{L.signed_on}: {signedDate}</Text>
        </View>

        {/* ── Client Info ── */}
        <View style={s.section}>
          <SectionHeader title={L.client_info} />
          <View style={s.sectionBody}>
            <View style={s.col2}>
              <Field label={L.full_name} value={client.full_name} />
              <Field label={L.phone} value={client.phone} />
              <Field
                label={L.previous_extensions}
                value={client.has_previous_extensions ? L.yes : L.no}
              />
              <Field
                label={L.contacts}
                value={client.wears_contacts ? L.yes : L.no}
              />
            </View>
          </View>
        </View>

        {/* ── Preferences ── */}
        <View style={s.section}>
          <SectionHeader title={L.preferences} />
          <View style={s.sectionBody}>
            <View style={s.col2}>
              <Field
                label={L.wear_type}
                value={consent.wear_type ? L.wear_type_map[consent.wear_type] : null}
              />
              <Field
                label={L.look_type}
                value={consent.look_type ? L.look_type_map[consent.look_type] : null}
              />
            </View>
          </View>
        </View>

        {/* ── Health ── */}
        <View style={s.section}>
          <SectionHeader title={L.health} />
          <View style={s.sectionBody}>
            <Text style={s.label}>{L.health_flags}</Text>
            {healthFlagLabels ? (
              <View style={s.flagsGrid}>
                {healthFlagLabels.map((flag) => (
                  <View key={flag} style={s.flag}>
                    <Text style={s.flagText}>{flag}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={s.noFlags}>{L.none}</Text>
            )}
            {client.notes && (
              <>
                <View style={s.divider} />
                <FieldFull label={L.notes} value={client.notes} />
              </>
            )}
          </View>
        </View>

        {/* ── Consent ── */}
        <View style={s.section}>
          <SectionHeader title={L.consent} />
          <View style={s.sectionBody}>
            <Text style={s.consentText}>{L.consent_body}</Text>
            <CheckRow checked={consent.client_age_confirmed} label={L.age_confirmed} />
            <View style={s.divider} />
            <Text style={s.label}>{L.signature}</Text>
            {consent.signature_data_url ? (
              <View style={s.signatureBox}>
                <Image style={s.signatureImage} src={consent.signature_data_url} />
                <Text style={s.signatureLabel}>{signedDate}</Text>
              </View>
            ) : (
              <Text style={s.valueMuted}>—</Text>
            )}
          </View>
        </View>

        {/* ── Photo permission ── */}
        <View style={s.section}>
          <SectionHeader title={L.photo} />
          <View style={s.sectionBody}>
            <CheckRow checked={consent.photo_permission} label={L.photo_permission} />
            {consent.photo_permission && consent.photo_tag_username && (
              <Field label={L.instagram} value={consent.photo_tag_username} />
            )}
          </View>
        </View>

        {/* ── Footer ── */}
        <View style={s.footer} fixed>
          <Text style={s.footerText}>{L.signed_on}: {signedDate}</Text>
          <Text style={s.footerBrand}>BONITA RITUALS · Montreal</Text>
        </View>

      </Page>
    </Document>
  )
}
