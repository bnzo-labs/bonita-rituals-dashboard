# CLAUDE.md — Bonita Rituals Hub

## Contexto del proyecto

**Bonita Rituals** es un negocio de lash extensions en Montreal dirigido por una sola técnica. Este sistema es su hub de gestión privado: reemplaza formularios en papel, centraliza el registro de clientas y permite a la técnica consultar el historial de cada servicio.

El sistema tiene **dos zonas**:

1. **Zona pública** — el consent form, accesible via link o QR, sin autenticación. Las clientas lo llenan y firman digitalmente antes o durante su cita.
2. **Zona protegida** — el dashboard de la técnica, protegido con auth. Muestra la lista de clientas, el estado de cada una y el historial de servicios.

El branding de Bonita Rituals usa **colores dorado (#B8860B / #D4A017) sobre fondo durazno (#FAEBD7)**. El logo debe aparecer en el header y en el PDF generado. Tagline: *"Glow like it's sacred"*.

---

## Stack

- **Framework**: Next.js 14 App Router (TypeScript)
- **Base de datos y Auth**: Supabase
- **UI**: Tailwind CSS + shadcn/ui
- **i18n**: next-intl (idiomas: `es`, `en`, `fr`)
- **Firma digital**: react-signature-canvas
- **PDF**: @react-pdf/renderer
- **Deploy**: Vercel
- **Repo**: `bnzo-labs/bonita-rituals-hub`

---

## Estructura de rutas

```
app/
├── [locale]/                    # next-intl locale wrapper (es/en/fr)
│   ├── layout.tsx               # layout con header, logo, lang switcher
│   ├── page.tsx                 # redirect → /dashboard o /consent según auth
│   ├── consent/
│   │   └── page.tsx             # formulario público, no requiere auth
│   ├── dashboard/
│   │   ├── page.tsx             # lista de clientas con filtros y status
│   │   └── clients/
│   │       └── [id]/
│   │           └── page.tsx     # detalle de clienta + historial + PDFs
│   └── login/
│       └── page.tsx             # login simple para la técnica
├── api/
│   ├── consent/route.ts         # POST: guarda consent form + registra clienta
│   └── pdf/[consentId]/route.ts # GET: genera y devuelve PDF del consent
middleware.ts                    # next-intl routing
```

---

## Base de datos (Supabase)

### Tabla: `clients`

```sql
create table clients (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  full_name text not null,
  phone text not null,
  has_previous_extensions boolean default false,
  wears_contacts boolean default false,
  notes text,
  -- status fields
  is_active boolean default true
);
```

### Tabla: `consent_forms`

```sql
create table consent_forms (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  client_id uuid references clients(id),
  -- Preferences
  wear_type text,       -- 'long_term' | 'special_occasion'
  look_type text,       -- 'natural' | 'dramatic'
  -- Health flags (array of strings o columnas booleanas)
  health_flags text[],  -- ['dry_eyes', 'allergies', 'oily_skin', ...]
  -- Technician section
  technique text,       -- 'classic' | 'brazilian_v' | 'hawaiian_v' | 'egyptian_v'
  style text,           -- 'natural' | 'cat_eye' | 'squirrel' | 'doll'
  thickness text,
  curl text,
  brand text,
  -- Consent
  signed_at timestamptz,
  signature_data_url text,  -- base64 de la firma
  photo_permission boolean default false,
  photo_tag_username text,
  client_age_confirmed boolean default false,
  -- Status tracking (rellenado por la técnica)
  payment_status text default 'pending',  -- 'pending' | 'paid'
  locale text default 'es'  -- idioma en que se firmó
);
```

### Tabla: `services`

```sql
create table services (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  client_id uuid references clients(id),
  consent_form_id uuid references consent_forms(id),
  service_date date not null,
  service_type text,   -- 'new_set' | 'fill' | 'removal'
  price_cad numeric(8,2),
  payment_status text default 'pending',
  notes text
);
```

### RLS (Row Level Security)

Habilitar RLS en todas las tablas. La técnica accede a todo via su sesión de Supabase Auth. El consent form público usa una API route del servidor (service role key) para insertar, nunca expone la key al cliente.

---

## i18n — next-intl

Crear archivos de traducción en `/messages/`:

```
messages/
├── es.json
├── en.json
└── fr.json
```

Cada archivo debe cubrir exactamente las mismas keys. El idioma por defecto es `es`. El switcher de idioma aparece en el header del consent form (no hace falta en el dashboard — la técnica siempre usará el mismo).

### Keys principales requeridas (ejemplo en `es.json`)

```json
{
  "consent": {
    "title": "Bonita Rituals",
    "subtitle": "Glow like it's sacred",
    "sections": {
      "client_info": "Información del cliente",
      "preferences": "Tus preferencias",
      "health": "Información de salud y estilo de vida",
      "technician": "Mapa de pestañas (solo técnica)",
      "consent_text": "Consentimiento",
      "photo": "Permiso de fotos"
    },
    "fields": {
      "full_name": "Nombre y apellido",
      "phone": "Número de teléfono",
      "previous_extensions": "¿Has tenido extensiones antes?",
      "contacts": "¿Usas lentes de contacto o gafas?",
      ...
    },
    "submit": "Firmar y enviar",
    "download_pdf": "Descargar PDF"
  },
  "dashboard": {
    "title": "Clientas",
    "columns": {
      "name": "Nombre",
      "phone": "Teléfono",
      "last_service": "Último servicio",
      "payment": "Pago",
      "signed": "Firmado",
      "service_type": "Servicio"
    },
    "status": {
      "paid": "Pagado",
      "pending": "Pendiente",
      "signed": "Firmado",
      "unsigned": "Sin firmar"
    }
  }
}
```

---

## Componentes clave

### `<ConsentForm />` — `components/consent/ConsentForm.tsx`

El componente más importante del sistema. Debe:

- Renderizar el formulario completo en el idioma activo (via `useTranslations`)
- Mostrar el logo de Bonita Rituals en el header
- Tener secciones colapsables o una sola página larga (preferir una sola página para no perder el estado)
- Incluir `<SignaturePad />` al final para capturar la firma
- Al submit: POST a `/api/consent` con todos los datos + la firma como data URL
- Después del submit exitoso: mostrar pantalla de confirmación con botón de descarga del PDF

### `<SignaturePad />` — `components/consent/SignaturePad.tsx`

- Usa `react-signature-canvas`
- Canvas con borde dorado, fondo blanco
- Botón de limpiar
- Exporta la firma como `dataURL` (PNG base64)
- Debe funcionar bien en mobile (touch events)
- Mostrar placeholder text "Firma aquí" mientras esté vacío

### `<LanguageSwitcher />` — `components/consent/LanguageSwitcher.tsx`

- Botones: `ES | EN | FR`
- Activo con borde dorado, inactivo gris
- Usar `useRouter` de next-intl para cambiar locale manteniendo la ruta

### `<ClientTable />` — `components/dashboard/ClientTable.tsx`

- Tabla con columnas: Nombre, Teléfono, Fecha de registro, Último servicio, Tipo, Pago, Firmado, Acciones
- Badges de color: `paid` = verde, `pending` = amarillo; `signed` = verde, `unsigned` = rojo
- Click en fila → navega a `/dashboard/clients/[id]`
- Filtros simples: por status de pago, por tipo de servicio
- Buscador por nombre o teléfono

### `<ConsentPDF />` — `components/pdf/ConsentPDF.tsx`

PDF generado con `@react-pdf/renderer`. Debe replicar fielmente el diseño del form original:

- Header con logo (base64 embebido) y colores Bonita Rituals
- Todas las secciones del form rellenadas
- Firma digital embebida como imagen
- Footer con fecha y nombre de la técnica
- Tamaño carta (Letter)

La generación ocurre en la API route `/api/pdf/[consentId]`, que consulta Supabase y devuelve el PDF como `application/pdf` con header `Content-Disposition: attachment`.

---

## Flujo completo del consent form

```
1. Técnica comparte el link/QR con la clienta antes de la cita
2. Clienta abre el link → ve el form en español por defecto
3. Clienta puede cambiar idioma (EN / FR) si lo desea
4. Clienta llena todos los campos, firma digitalmente, confirma los checkboxes de consentimiento
5. Submit → POST /api/consent:
   a. Busca si el teléfono ya existe en `clients`
   b. Si existe: usa el client_id existente
   c. Si no: crea nuevo registro en `clients`
   d. Crea registro en `consent_forms` con los datos + firma
6. Respuesta incluye el `consentId`
7. Clienta ve pantalla de confirmación con botón "Descargar PDF"
8. PDF se genera on-demand via GET /api/pdf/[consentId]
9. En el dashboard, la técnica ve la nueva clienta con status "Firmado"
```

---

## Dashboard — funcionalidades

### Lista de clientas (`/dashboard`)

- Tabla ordenable por fecha de registro (desc por defecto)
- Badge de status por cada clienta:
  - **Firma**: ✓ verde si `consent_forms.signed_at` no es null, ✗ rojo si null
  - **Pago**: "Pagado" verde / "Pendiente" amarillo
- La técnica puede hacer click en cualquier clienta para ver su detalle
- Botón "Nueva clienta" → abre modal para crear clienta manualmente (sin pasar por el form público)

### Detalle de clienta (`/dashboard/clients/[id]`)

- Info básica (nombre, teléfono, fecha de registro)
- Historial de consent forms con link para descargar cada PDF
- Historial de servicios con precio y notas
- Formulario inline para agregar nuevo servicio
- Toggle para marcar pago como completado
- Campo de notas libres sobre la clienta
- Preferencias guardadas (para recordar qué estilo le gusta)

---

## Autenticación

- **Un solo usuario**: la técnica. No hace falta registro público.
- Usar Supabase Auth con email + password.
- Crear el usuario manualmente desde el dashboard de Supabase o via script de seed.
- Middleware de Next.js protege todo bajo `/dashboard`.
- El consent form en `/consent` es completamente público.

```ts
// middleware.ts
export const config = {
  matcher: ['/dashboard/:path*']
}
```

---

## Variables de entorno

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=    # solo en server — para las API routes del consent form
NEXT_PUBLIC_BASE_URL=https://bonita.rituals.ca
```

---

## Convenciones de código

- TypeScript strict mode
- Todos los componentes en `components/` con subcarpetas por feature (`consent/`, `dashboard/`, `pdf/`, `ui/`)
- Server components por defecto; usar `'use client'` solo cuando sea necesario (signature pad, interacciones con estado)
- Tipos de Supabase generados via `supabase gen types typescript`
- Nombres de archivos en kebab-case, componentes en PascalCase
- No usar `any`

---

## Criterios de éxito del MVP

- [ ] El consent form se puede llenar y firmar desde un teléfono móvil en menos de 3 minutos
- [ ] El PDF generado incluye la firma digital y todos los campos rellenados
- [ ] El form funciona correctamente en los tres idiomas (ES / EN / FR)
- [ ] El dashboard muestra todas las clientas con sus status correctos
- [ ] La técnica puede descargar el PDF de cualquier consent form desde el dashboard
- [ ] El sistema está deployado en Vercel y accesible desde el dominio del negocio

---

## Módulos del MVP (en orden de prioridad)

### Módulo 1 — Setup y schema
- Inicializar proyecto Next.js 14 con TypeScript
- Configurar Supabase (tablas, RLS, auth)
- Configurar next-intl con los tres idiomas
- Configurar Tailwind + shadcn/ui con la paleta de Bonita Rituals

### Módulo 2 — Consent form público
- Componente `<ConsentForm />` completo y trilingüe
- Componente `<SignaturePad />`
- API route `/api/consent` (POST)
- Pantalla de confirmación post-submit

### Módulo 3 — Generación de PDF
- Componente `<ConsentPDF />` con branding
- API route `/api/pdf/[consentId]` (GET)
- Botón de descarga en la confirmación y en el dashboard

### Módulo 4 — Dashboard
- Auth login page
- Lista de clientas con filtros y badges
- Detalle de clienta con historial

### Módulo 5 — Polish y deploy
- Responsive final (especialmente el consent form en mobile)
- Logo y branding consistentes en toda la app
- Deploy en Vercel con variables de entorno

---

## Notas adicionales

- El logo de Bonita Rituals debe estar disponible como archivo en `/public/logo.png` (fondo transparente, versión dorada)
- Para el PDF, embeber el logo como base64 para evitar problemas de URL en el servidor
- El consent form completo original (en papel) es el documento de referencia para todos los campos — no agregar ni quitar campos sin confirmación
- Guardar el `locale` usado al firmar en `consent_forms.locale` para que el PDF se genere en el mismo idioma que lo firmó la clienta

## Design
Lee y sigue estrictamente el archivo DESIGN.md para todo 
lo relacionado con UI, componentes, tipografía y colores.