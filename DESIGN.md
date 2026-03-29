# DESIGN.md — Bonita Rituals UI/UX Guidelines

## Dirección estética

**Luxury organic.** El negocio es un ritual de belleza personal — la UI debe sentirse como una experiencia de spa, no como un formulario de gobierno ni como un SaaS genérico. Cada pantalla debe evocar cuidado, precisión y feminidad sofisticada.

**La una cosa que alguien debe recordar:** que esto se siente premium, como si hubiera una persona real detrás del negocio que se preocupa por cada detalle.

---

## Paleta de colores

```css
:root {
  /* Brand */
  --gold-primary: #D4A017;
  --gold-deep:    #B8860B;
  --gold-light:   #F0C94A;
  --peach-bg:     #FAEBD7;
  --peach-deep:   #F5D5B8;

  /* Neutrales */
  --cream:        #FDF8F3;
  --warm-white:   #FFFDF9;
  --warm-gray:    #8C7B6B;
  --charcoal:     #2C2420;

  /* Status */
  --success:      #4A7C59;
  --warning:      #C4820A;
  --danger:       #A63228;
  --pending:      #8C7B6B;
}
```

Uso: el dorado es el acento dominante. Nunca lo uses como fondo de página — solo en bordes, iconos, botones primarios y detalles. El fondo principal es `--cream` o `--warm-white`, no blanco puro.

---

## Tipografía

```css
/* Display / headings: elegante, con carácter */
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');

/* Body / UI: legible, moderno pero cálido */
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
```

- **Headings y títulos de sección**: Cormorant Garamond, weight 300-400, tracking amplio
- **Labels, botones, texto de UI**: DM Sans, weight 400-500
- **Tamaño base**: 15px body, 13px labels, nunca menos de 12px
- **NUNCA usar**: Inter, Roboto, Arial, System fonts, Space Grotesk

Ejemplo de jerarquía:
```
h1: Cormorant 32px / weight 300 / letter-spacing: 0.04em
h2: Cormorant 22px / weight 400 / letter-spacing: 0.02em
label: DM Sans 12px / weight 500 / uppercase / letter-spacing: 0.08em
body: DM Sans 15px / weight 400 / line-height: 1.6
button: DM Sans 13px / weight 500 / letter-spacing: 0.06em / uppercase
```

---

## Componentes

### Inputs y campos del formulario

```css
.input {
  background: var(--warm-white);
  border: 1px solid rgba(180, 140, 60, 0.25);
  border-radius: 2px;  /* casi cuadrado — elegante, no genérico */
  padding: 12px 16px;
  font-family: 'DM Sans', sans-serif;
  font-size: 15px;
  color: var(--charcoal);
  transition: border-color 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: var(--gold-primary);
  box-shadow: 0 0 0 3px rgba(212, 160, 23, 0.1);
}
```

### Checkboxes

No usar el checkbox nativo. Crear un custom checkbox con:
- Borde dorado fino (1px)
- Check SVG dorado cuando está seleccionado
- Fondo levemente cálido al hover

### Botón primario

```css
.btn-primary {
  background: var(--gold-primary);
  color: var(--charcoal);
  border: none;
  padding: 14px 32px;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border-radius: 1px;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.1s ease;
}

.btn-primary:hover {
  background: var(--gold-deep);
  transform: translateY(-1px);
}
```

### Cards (en el dashboard)

```css
.card {
  background: var(--warm-white);
  border: 1px solid rgba(180, 140, 60, 0.15);
  border-radius: 4px;
  padding: 24px;
  /* Sin box-shadow fuerte — usar bordes sutiles en vez de sombras */
}
```

### Badges de status

```css
/* Pagado */
.badge-paid {
  background: rgba(74, 124, 89, 0.1);
  color: var(--success);
  border: 1px solid rgba(74, 124, 89, 0.2);
}

/* Pendiente */
.badge-pending {
  background: rgba(196, 130, 10, 0.1);
  color: var(--warning);
  border: 1px solid rgba(196, 130, 10, 0.2);
}

/* Sin firmar */
.badge-unsigned {
  background: rgba(166, 50, 40, 0.08);
  color: var(--danger);
  border: 1px solid rgba(166, 50, 40, 0.15);
}

/* Todos los badges */
.badge {
  padding: 3px 10px;
  border-radius: 2px;
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
```

---

## Layout

### Consent form (zona pública)

- Ancho máximo: 640px, centrado
- Fondo de página: `--peach-bg` (#FAEBD7)
- Card del formulario: `--warm-white` con borde dorado muy sutil
- Header: logo centrado + tagline en Cormorant italic
- Separadores entre secciones: línea dorada de 0.5px con opacidad 30%
- Títulos de sección: DM Sans 11px uppercase + letter-spacing amplio + color dorado

```
┌─────────────────────────────────┐   ← peach background
│                                 │
│        [LOGO]                   │   ← centrado, 80px
│   BONITA RITUALS                │   ← Cormorant 28px
│   Glow like it's sacred         │   ← Cormorant italic 16px / warm-gray
│                                 │
│  ─────────── INFORMACIÓN ───────│   ← divider dorado
│                                 │
│  [campo]  [campo]               │
│  ...                            │
│                                 │
│  ─────────── PREFERENCIAS ──────│
│  ...                            │
│                                 │
│  [FIRMA AQUÍ]                   │   ← canvas con borde dorado
│                                 │
│  [     FIRMAR Y ENVIAR     ]    │   ← botón full-width
└─────────────────────────────────┘
```

### Dashboard (zona técnica)

- Fondo: `--cream` (#FDF8F3)
- Sidebar izquierdo: `--warm-white` con borde derecho dorado 1px
- Tabla: filas alternadas con fondo ligeramente diferente, sin grid lines pesadas
- Header del dashboard: logo pequeño a la izquierda, nombre del negocio, botón logout derecha

No hacer el dashboard dark — mantener el mismo sistema cálido. La técnica lo usa con buena luz.

---

## Microinteracciones

- **Inputs**: transición de borde a dorado en focus (0.2s ease)
- **Botones**: translateY(-1px) en hover para sensación de levantamiento
- **Rows de la tabla**: background cálido en hover (rgba(212, 160, 23, 0.05))
- **Language switcher**: transición suave al cambiar idioma
- **Signature pad**: placeholder "Firma aquí" desaparece suavemente al primer trazo
- **Submit exitoso**: fade-in de la pantalla de confirmación

**No usar**: bounce, shake, loaders giratorios genéricos, confetti, modales con backdrop blur exagerado.

---

## Signature Pad

El canvas de firma debe sentirse premium:

```css
.signature-canvas {
  border: 1px solid var(--gold-primary);
  border-radius: 2px;
  background: var(--warm-white);
  width: 100%;
  height: 160px;
  cursor: crosshair;
}

.signature-placeholder {
  /* texto centrado sobre el canvas cuando está vacío */
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-size: 18px;
  color: rgba(140, 123, 107, 0.4);
  pointer-events: none;
}
```

Botón de limpiar: texto "Limpiar" en DM Sans uppercase, sin borde, color `--warm-gray`, hover color `--gold-deep`.

---

## Language Switcher

```
[ ES ]  EN   FR
```

- Activo: borde dorado 1px, texto dorado, fondo cálido sutil
- Inactivo: sin borde, texto `--warm-gray`
- Transición: 0.15s ease
- Sin flags, solo las siglas — más limpio

---

## PDF generado

El PDF debe verse como un documento de spa premium, no como un formulario genérico:

- Header con logo centrado sobre fondo `--peach-bg`
- Línea dorada de separación bajo el header
- Secciones con títulos en uppercase + letter-spacing
- Firma en un recuadro con borde fino dorado
- Footer con fecha, nombre de la técnica y tagline
- Márgenes generosos (40px laterales mínimo)
- Tipografía: usar la fuente más cercana disponible en @react-pdf/renderer

---

## Lo que NUNCA hacer

- Fondo blanco puro (#FFFFFF) — siempre usar el blanco cálido
- Bordes radius grandes (>8px) en inputs — el negocio es refinado, no playful
- Sombras fuertes (box-shadow >4px blur)
- Colores saturados fuera de la paleta
- Iconos de heroicons/lucide sin personalización — si se usan, en tamaño pequeño y color dorado
- Gradients de múltiples colores
- Cualquier cosa que se vea como un SaaS B2B genérico

---

## Referencia visual

El benchmark estético es: una mezcla entre la UI de **Aesop** (farmacia de lujo) y un planner de bodas de alta gama. Sofisticado, cálido, femenino sin ser infantil, minimal sin ser frío.
