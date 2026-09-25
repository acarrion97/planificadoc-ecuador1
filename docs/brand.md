# PlanificaDoc Ecuador — Guía de Marca

> Fuente canónica de la identidad visual y verbal del sistema.
> Extraída del código el 22 de septiembre de 2026. Si el código cambia, actualizar este documento.
>
> Archivos de referencia: `theme.config.js`, `design.md`, `app.config.ts`,
> `components/animated-logo-splash.tsx`, `lib/_core/theme.ts`, `data/types.ts`,
> `data/types-evaluacion.ts`, `data/competencias-transversales.ts`,
> `lib/pdf-generator.ts`, `server/email.ts`, `server/payphone.ts`.

---

## 1. Esencia de marca

| Elemento | Definición |
|---|---|
| **Nombre** | PlanificaDoc Ecuador |
| **Slug** | `planificador-docente-ec` (`app.config.ts:32`) |
| **Claim** | *Planificación curricular para docentes de Ecuador* |
| **Wordmark** | "Planifica" en blanco + "Doc" en dorado `#e0a41e` |
| **Dominio** | https://planificadoc.app |
| **Soporte** | soporte@planificadoc.app |
| **Modelo** | Freemium con prueba de 3 días; planes Mensual ($6.99/mes) y Anual ($58.71/año) bajo la marca **PlanificaDoc Premium** |
| **Ámbito** | App móvil (Expo/React Native) + web + generación de documentos (Word/PDF) para docentes del sistema educativo ecuatoriano |

### Propósito
Permitir al docente ecuatoriano generar planificaciones microcurriculares
(PCA, PCT, semanal, Currículo por Competencias, CNC, Bachillerato Técnico,
Inicial, Preparatoria, Proyecto Interdisciplinar) a partir del código de la
destreza con criterio de desempeño (DCD), con base de datos local y plena
alineación al currículo nacional del MINEDUC.

### Valores implícitos (reflejados en el producto)
- **Fidelidad a la fuente oficial** — datos trazados a documentos MINEDUC.
- **Accesibilidad y diversidad** — DUA, NEE y adaptaciones curriculares de primera clase.
- **Rapidez** — generar en minutos lo que toma horas a mano.
- **Respaldo local** — las planificaciones del docente son suyas y quedan en su dispositivo.
- **Cercanía** — trato de tú a tú, en español ecuatoriano.

---

## 2. Fundamentos

### 2.1 Isotipo
Libro abierto de trazo **blanco** (`#ffffff`) con contorno **dorado** (`#cf8f12`),
un **check dorado** (`#e0a41e`) y un **lápiz dorado** que lo atraviesa
(punta `#f6e2a6`, mina `#1e293b`), sobre fondo **azul marino `#003366`**.

Secuencia de animación del splash (`components/animated-logo-splash.tsx`):
libro → check + lápiz → wordmark → claim.

Assets:
- `assets/images/icon.png` (app) y `favicon.png` (web)
- `assets/images/android-icon-{foreground,background,monochrome}.png`
  (fondo adaptativo `#E6F4FE`)
- `assets/images/splash-icon.png` (splash nativo: `#ffffff` light / `#000000` dark)
- Logo remote (`logoUrl` en `app.config.ts`)

### 2.2 Tipografía
| Contexto | Familia | Pesos |
|---|---|---|
| UI (app/web) | Sistema: `system-ui` / `-apple-system`, Segoe UI, Roboto, Helvetica, Arial (`Fonts` en `lib/_core/theme.ts`) | 400–800; títulos 700–800 |
| Documentos Word/PDF | **Arial** (todos los `lib/*-word-generator.ts` y `lib/pdf-generator.ts`) | regular / bold |

Escala usada en UI: títulos `text-3xl font-bold`, subtítulos 15–16, cuerpo 14–15,
metadatos 11–12. Letter-spacing del wordmark: `-0.5`.

### 2.3 Tema claro / oscuro
Soportado (`darkMode: "class"`, variantes `light`/`dark` en `tailwind.config.js`,
`userInterfaceStyle: "automatic"` en `app.config.ts`).

---

## 3. Paleta de colores

### 3.1 Tokens oficiales del tema (canónicos)
Fuente: `theme.config.js` → `tailwind.config.js` → `lib/_core/theme.ts`.
Documentado también en `design.md`.

| Token | Light | Dark | Uso |
|---|---|---|---|
| `primary` | `#1B5E9E` | `#4DA3E8` | Azul institucional (referencia MinEduc) |
| `brand` | `#003366` | `#003366` | Marca como **fondo**: ítem activo del sidebar/drawer, botones y chips (texto blanco encima) |
| `brandFg` | `#003366` | `#7DB9EA` | Marca como **texto/icono/tinte**: títulos, links, chips y acentos (en dark se aclara para contraste ≥5:1) |
| `background` | `#F8FAFC` | `#0A2E5C` | Fondo principal (dark: azul marino) |
| `surface` | `#FFFFFF` | `#123C72` | Tarjetas y superficies elevadas |
| `foreground` | `#0F172A` | `#EBF1FA` | Texto principal |
| `muted` | `#64748B` | `#93AED2` | Texto secundario, iconos, ítem de navegación inactivo |
| `border` | `#E2E8F0` | `#174E97` | Bordes y divisores |
| `success` | `#16A34A` | `#4ADE80` | Estados exitosos |
| `warning` | `#D97706` | `#FBBF24` | Advertencias |
| `error` | `#DC2626` | `#F87171` | Errores |

Alias de runtime (`lib/_core/theme.ts`):
`text = foreground` · `tint = primary` · `icon = muted`.
(Se retiraron los alias `tabIconDefault`/`tabIconSelected` al eliminar la tab bar.)

### 3.2 Colores de identidad (los que "ven" al usuario)
Están hardcodeados fuera de los tokens y dominan splash, encabezados,
botones primarios, documentos y correos:

| Rol | Hex | Dónde se usa |
|---|---|---|
| **Azul marino de marca** | `#003366` | Splash, encabezados, botones primarios (exportar/pagar), títulos y pie de PDF, HTML de Payphone, correos, panel admin, **navegación** (token `brand`: ítem activo del sidebar/drawer y hub `/crear`) |
| **Dorado de marca** | `#e0a41e` | Check y lápiz del isotipo, "Doc" del wordmark |
| Dorado contorno | `#cf8f12` | Contorno del libro |
| Dorado claro | `#f6e2a6` | Punta del lápiz |
| Blanco | `#ffffff` | Trazo del libro, "Planifica" |
| Azul claro de texto | `#9db8d6` | Claim en splash |
| Fondo icono Android | `#E6F4FE` | `app.config.ts` adaptiveIcon |
| Splash nativo | `#ffffff` / `#000000` | `expo-splash-screen` |
| WhatsApp | `#25D366` | Botón flotante de contacto |

### 3.3 Colores por área curricular (`data/types.ts` → `AREAS_INFO`)

| Área | Código | Color |
|---|---|---|
| Matemática | `M` | `#2563EB` |
| Lengua y Literatura | `LL` | `#DC2626` |
| Ciencias Naturales | `CN` | `#16A34A` |
| Estudios Sociales | `CS` | `#D97706` |
| Educación Física | `EF` | `#7C3AED` |
| Educación Cultural y Artística | `ECA` | `#EC4899` |
| Biología | `CN.B` | `#059669` |
| Química | `CN.Q` | `#7C3AED` |
| Física | `CN.F` | `#0284C7` |
| Historia | `CS.H` | `#B45309` |
| Filosofía | `CS.F` | `#6D28D9` |
| Educación para la Ciudadanía | `CS.EC` | `#0F766E` |
| Cívica — Acompañamiento Integral | `CAI` | `#DC2626` |
| Inglés | `EFL` | `#0369A1` |
| Emprendimiento y Gestión | `EG` | `#CA8A04` |
| Educación Inicial | `INI` | `#0EA5E9` |

### 3.4 Paletas semánticas de dominio

**DUA (Diseño Universal para el Aprendizaje)**
| Principio | Color |
|---|---|
| Representación | `#EC4899` |
| Acción y Expresión | `#1E3A5F` |
| Implicación | `#22C55E` |

**Fases didácticas (CNC "Conecta, Nivela y Crea")**
| Fase | Color |
|---|---|
| Experiencia | `#2980B9` |
| Reflexión | `#8E44AD` |
| Conceptualización | `#27AE60` |
| Aplicación | `#E67E22` |

**Evaluación y estados** (`data/types-evaluacion.ts`)
| Concepto | Color |
|---|---|
| Dominado / Analizada / Básica | `#16A34A` |
| En proceso / Aplicada / Media | `#D97706` |
| Requiere refuerzo / Avanzada | `#DC2626` |
| Borrador | `#6B7280` |
| Publicada | `#2563EB` |

**NEE y adaptaciones curriculares**
| Elemento | Color |
|---|---|
| Grado 1 — No significativa | `#16A34A` |
| Grado 2 — Moderada | `#D97706` |
| Grado 3 — Significativa | `#DC2626` |
| Adaptaciones de acceso | `#1A56DB` |
| Adaptaciones de proceso | `#D97706` |
| Adaptaciones de resultado | `#059669` |
| Cabecera de tarjeta de adaptación | `#4A1942` |
| Morado principal de adaptaciones | `#7B2D8B` |
| Hover / pressed | `#9D3FB5` |
| Texto claro sobre morado | `#E9D5FF` |
| Chip / fondo suave | `#F9F5FF` |

**Competencias transversales** (`data/competencias-transversales.ts`, UI)
| Competencia | Color |
|---|---|
| Comunicacionales (`C`) | `#3498DB` |
| Matemáticas (`M`) | `#E74C3C` |
| Digitales (`CD`) | `#9B59B6` |
| Socioemocionales (`CS`) | `#27AE60` |

**Selección DCD / de códigos**
| Uso | Color |
|---|---|
| Violeta principal | `#7C3AED` |
| Violeta oscuro (texto de chip) | `#4C1D95` |

**Acciones de exportación / misc**
| Uso | Color |
|---|---|
| Botón exportar / pagar (primario) | `#003366` |
| Botón descargar PDF | `#DC2626` |
| Botón descargar Word | `#2563EB` |
| Verde "unidad / PCT" (fondo) | `#EAF3DE` |
| Texto sobre ese verde | `#3B6D11` / `#5A8A1F` |
| Éxito inline | `#059669` |
| Botón WhatsApp | `#25D366` |

---

## 4. Aspectos de marca (aplicaciones)

### 4.1 App (mobile y web)
- Home: título **PlanificaDoc** (`text-3xl font-bold`) + claim debajo en `muted`,
  buscador de destreza (DCD), bloque **Continuar** y CTA **＋ Nueva planificación** → `/crear`.
- Splash animado a pantalla completa con fondo `#003366`.
- Navegación (ya **sin tab bar**): sidebar izquierdo ≥768 px (240 px expandido /
  64 px colapsado, colapso manual persistente) y header con `☰` + drawer lateral
  en móvil; zona principal **Inicio · Crear · Explorar · Mis planes**, gestión
  **Mi cuenta · Ayuda**, marca al pie en `brandFg`; ítem activo en `brand`
  `#003366` con texto blanco, "Crear" destacado; área de trabajo con ancho
  máximo de 1080 px.
- Acciones primarias con `#003366`.

### 4.2 Documentos exportados (Word y PDF)
- Encabezados, títulos de sección y bordes: `#003366`.
- Badges de área con el color de `AREAS_INFO`.
- Leyenda DUA con los tres colores de la sección 3.4.
- **Sello de marca en el pie:** `.app-badge` → fondo `#003366`, texto blanco,
  contenido **"Generado con PlanificaDoc"** (verificado en `__tests__/pdf-generator.test.ts`).
- Tipografía Arial.

### 4.3 Correos transaccionales (`server/email.ts`)
- `FROM_NAME = "PlanificaDoc Ecuador"`.
- Cabecera navy `#003366`; pie "PlanificaDoc Ecuador · planificadoc.app".
- Acento de bienvenida Premium `#006633`.
- Firmas y enlaces de soporte con `#003366`.

### 4.4 Pagos (Payphone, `server/payphone.ts`)
- HTML propio: "PlanificaDoc - Pago Seguro", títulos y valores en `#003366`.
- Referencias de cobro siempre con el prefijo `PlanificaDoc - …`.

### 4.5 Voz y tono
- Español ecuatoriano, **tuteo**, frases cortas y accionables
  ("Tu PCA está lista", "Todo listo para seguir planificando").
- Emojis funcionales (🎯 📋 ✅ ♿), nunca decorativos en exceso.
- Transparencia sobre datos y pagos; cercanía sin informalidad excesiva.

---

## 5. Deuda de consistencia detectada

Pendientes de unificar para que la marca sea de una sola fuente:

1. **Dos azules primarios:** el token `primary` del tema es `#1B5E9E`, pero la
   marca real y la mayoría de acciones usan `#003366`. Definir cuál manda
   (recomendación: `#003366` como `primary` o como token `brand`).
2. **Competencias transversales con colores distintos** entre UI
   (`data/competencias-transversales.ts`) y exportación PDF
   (`lib/pdf-generator.ts:34-37`, que usa `#7C3AED` / `#059669` / `#2563EB` / `#DC2626`).
3. **Colores fuera de token** hardcodeados por pantalla: morado de adaptaciones
   (`#7B2D8B`, `#4A1942`), violeta de DCD (`#7C3AED`), verde de unidades
   (`#EAF3DE`). Considerar moverlos a `theme.config.js`.
4. **No existe asset vectorial (SVG) del isotipo** en el repo: el logo real vive
   como SVG inline en `components/animated-logo-splash.tsx` y como PNG en
   `assets/images/`. Conviene extraerlo a `assets/brand/logo.svg`.

---

## 6. Reglas rápidas

- Cualquier color nuevo de UI **debe** entrar en `theme.config.js`.
- Los documentos exportados **siempre** llevan el sello "Generado con PlanificaDoc".
- El azul de las acciones primarias es `#003366`; el dorado es exclusivo de la marca.
- Nunca usar el dorado como color de texto sobre fondos claros (bajo contraste).
- Respetar siempre los colores DUA y de áreas: son semánticos, no decorativos.
- Modo oscuro: usar tokens `*.dark`, no valores fijos.
