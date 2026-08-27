---
name: planificadoc
description: "PlanificaDoc — generador de planificaciones docentes alineado al MINEDUC Ecuador. Usa este skill para implementar funcionalidades de planificación curricular (PCA, PCT, Adaptaciones Curriculares, BT, CNC), importación/exportación de formatos oficiales, generación con IA, exportación Word/PDF, suscripciones, y cualquier módulo del sistema. Trigger con: planificación, PCA, PCT, formato, importar, exportar, Word, PDF, IA, suscripción, PayPhone, adaptación, BT, CNC, evaluación, informe."
license: MIT
metadata:
  author: PlanificaDoc Team
---

# PlanificaDoc — Sistema de Planificación Docente MINEDUC Ecuador

## Stack Tecnológico

- **Frontend**: Expo SDK 54 + React Native + React Native Web
- **Router**: Expo Router v6
- **API**: tRPC v11 (server + client)
- **Server**: Express.js (local dev) / Vercel Serverless Functions (producción)
- **Base de datos**: MySQL (TiDB en PlanetScale) + Drizzle ORM
- **IA**: LLM via Built-In Forge API
- **Exportación**: docx (Word), HTML→PDF (nativo), plantillas DOCX (JSZip + fast-xml-parser)
- **Pagos**: PayPhone (botón de pago + renovación automática)
- **Deploy**: Vercel (serverless + crons)

---

# Arquitectura General

## Estructura de Directorios

```txt
planificadoc-ecuador1/
├── app/                    # Expo Router — pantallas
│   ├── (tabs)/             # Navegación por tabs
│   ├── pca-preview/        # Preview de PCA antes de exportar
│   ├── importar-formato/   # Pantalla de importación
│   └── ...
├── server/                 # Lógica de negocio (tRPC routers + handlers)
│   ├── _core/              # trpc.ts, llm.ts, env.ts
│   ├── routers.ts          # Router principal que concatena todos los sub-routers
│   ├── pca-router.ts       # PCA anual
│   ├── pca-trimestral-router.ts  # PCA trimestral
│   ├── import-formato/     # Sistema de importación (reconocimiento + handlers)
│   └── ...
├── api/                    # Vercel Serverless Functions
│   ├── trpc/[trpc].ts     # Entry point tRPC en Vercel
│   ├── payment/            # PayPhone (page.ts, confirm.ts, activate.ts)
│   ├── admin/              # Admin endpoints
│   └── _lib/               # Helpers compartidos (db.ts, migrate.ts)
├── lib/                    # Generadores de documentos (client-side)
│   ├── pca-word-generator.ts
│   ├── pca-pdf-generator.ts
│   └── ...
├── drizzle/                # Schema + migraciones
│   ├── schema.ts           # Definiciones de tablas
│   ├── 0000_*.sql ... 0010_*.sql  # Migraciones SQL
│   └── meta/               # Journal de Drizzle Kit
├── data/                   # Datos estáticos (destrezas, áreas, etc.)
├── hooks/                  # Custom hooks React
└── __tests__/              # Tests (Vitest)
```

## Flujo de Datos

```txt
Expo App (React Native/Web)
    │
    ▼
tRPC Client (@trpc/react-query)
    │
    ▼
tRPC Router (server/routers.ts)
    │
    ├──→ Express (dev local: server/_core/index.ts)
    │
    └──→ Vercel Serverless (producción: api/trpc/[trpc].ts)
            │
            ▼
        Drizzle ORM → MySQL/TiDB
```

## Reglas Clave

- **tRPC es la capa de API** — No hay REST para lógica de negocio
- **Server-side rendering**: La generación con IA y exportación corren en el server
- **Client-side**: La app Expo renderiza UI, maneja navegación y estado local
- **Vercel auto-migrates**: `api/_lib/migrate.ts` ejecuta migraciones pendientes en el primer request
- **Pagos server-side**: PayPhone confirm/activate corre en Vercel, nunca en el cliente

---

# Módulos del Sistema

## 1. PCA — Planificación Curricular Anual

### Archivos clave
- `server/pca-router.ts` — tRPC router (generate, get, list, regenerarSeccion, exportarConPlantilla)
- `server/import-formato/handlers/pca.ts` — Handler de importación
- `server/import-formato/mapear-pca.ts` — Extracción de campos desde documento parseado
- `server/import-formato/completar-pca.ts` — Completado con IA
- `lib/pca-word-generator.ts` — Generador Word nativo (client-side)
- `lib/pca-pdf-generator.ts` — Generador PDF/HTML nativo (client-side)
- `app/pca-preview/[id].tsx` — Pantalla de preview + exportación

### Modelo de datos (pcaDocuments)
```txt
id, sessionId, status, formData (JSON), aiResult (JSON),
clientTransactionId, payphoneTransactionId, authorizationCode,
amountPaid, formatoPlantillaId, createdAt, updatedAt
```

### Flujo de generación
```txt
Frontend → generatePca mutation
    → LLM genera JSON (área, grado, unidades, etc.)
    → Guarda en pcaDocuments
    → Devuelve resourceId → navega a /pca-preview/[id]
```

### Flujo de exportación
```txt
Botón "Descargar Word"
    → exportarConPlantilla mutation
    → ¿Tiene formatoPlantillaId?
        SÍ → renderizarDocxPlantilla() (rellena template original)
        NO → generarWordPca() (generador nativo)
    → Descarga .docx
```

## 2. Importación de Formatos Oficiales

### Archivos clave
- `server/importar-formato-router.ts` — tRPC router principal
- `server/import-formato/types.ts` — Tipos: ImportHandler, Huella, ResultadoReconocimiento
- `server/import-formato/huellas.ts` — Huellas digitales de cada tipo (PCA, PCT, BT, etc.)
- `server/import-formato/matcher.ts` — Score de similitud + detección de ambigüedad
- `server/import-formato/importer.ts` — Orquestador: mapear → completar → guardar
- `server/import-formato/parse.ts` — Dispatcher de parsing (DOCX/DOC/PDF)
- `server/import-formato/parse-docx.ts` — Parser DOCX (JSZip + fast-xml-parser)
- `server/import-formato/parse-doc.ts` — Parser DOC (word-extractor)
- `server/import-formato/schemas.ts` — Zod schemas para validación de IA

### Flujo de importación
```txt
Subir archivo → parseDocumento()
    → Magic bytes detection (extensión real vs declarada)
    → Parse DOCX/DOC/PDF → DocumentoParseado (tablas + texto)
    → matcher: scoring contra huellas de cada tipo
    → ¿Reconocido?
        SÍ (score > 0.7) → importar(tipo, documento)
        AMBIGUO (0.6-0.7) → devolver candidatos, frontend muestra opciones
        NO → error "formato no reconocido"
    → handler.mapear() → campos extraídos
    → handler.completar() → IA llena vacíos
    → handler.guardar() → persiste + crea FormatoPlantilla
    → resultado con destination URL
```

### Tipos soportados
| Tipo | Estado | Huella |
|------|--------|--------|
| pca | ✅ Implementado | "Planificación Curricular Anual" |
| pct | 📋 Pendiente | "Planificación Curricular Trimestral" |
| bt | 📋 Pendiente | "Boleta de Trabajo" |
| cnc | 📋 Pendiente | "Cuaderno de Control" |
| adaptaciones | 📋 Pendiente | "Adaptaciones Curriculares" |
| inicial | 📋 Pendiente | "Inicial / Preparatoria" |
| refuerzo | 📋 Pendiente | "Refuerzo Académico" |
| informe | 📋 Pendiente | "Informe" |

## 3. Sistema de Plantillas (Template-Based Export)

### Archivos clave
- `server/import-formato/types.ts` — PlantillaEstructura, FieldBinding, RepeatRegion
- `server/import-formato/template-builder.ts` — Analiza DOCX, detecta bindings
- `server/import-formato/template-docx-renderer.ts` — Rellena DOCX in-place

### Conceptos
```txt
PlantillaEstructura
  ├── celdas: DocxCellLocation[]     (ubicación física: tabla/fila/columna)
  └── regiones: RepeatRegion[]       (filas dinámicas: unidades PCA)

FieldBinding
  ├── campo: string                  (nombre canónico: "institucion", "area")
  ├── location: DocxCellLocation     (donde está en el DOCX)
  └── confianza: number              (0-1, qué tan seguro está el heuristic)

FormatoPlantilla (DB)
  ├── estructura: JSON               (PlantillaEstructura)
  ├── bindings: JSON                 (PlantillaBindings)
  ├── configuracion: JSON            (PlantillaConfiguracion)
  └── templateBufferBase64: TEXT     (buffer del DOCX original)
```

### Flujo
```txt
Importar DOCX → template-builder analiza estructura
    → Detecta headers, celdas vacías, regiones repetibles
    → Mapea campos canónicos a celdas (heuristics + keywords)
    → Guarda FormatoPlantilla con buffer original

Exportar → template-docx-renderer
    → Abre template con JSZip
    → Rellena celdas simples (institución, área, etc.)
    → Rellena regiones repetibles (unidades PCA)
    → Devuelve Buffer DOCX completo
```

## 4. Pagos (PayPhone)

### Archivos clave
- `api/payment/page.ts` — Inicia transacción PayPhone
- `api/payment/confirm.ts` — Bridge HTML confirma con PayPhone API
- `api/payment/activate.ts` — Activa suscripción tras pago exitoso
- `server/pca-router.ts` — Precio PCA: $14.99

### Flujo
```txt
Frontend → page.ts (POST con email, monto, plan)
    → PayPhone redirige a confirm.ts
    → confirm.ts muestra HTML bridge
    → Bridge llama PayPhone Confirm API (client-side JS)
    → Bridge llama activate.ts (server-side)
    → activate.ts activa suscripción en DB
    → Muestra resultado al usuario
```

## 5. Migraciones Automáticas

### Archivos clave
- `api/_lib/migrate.ts` — Migrador ligero para Vercel
- `api/trpc/[trpc].ts` — Ejecuta ensureMigrations() en primer request

### Mecanismo
```txt
Primer request → ensureMigrations()
    → ¿Existe __drizzle_migrations?
        NO → CREATE TABLE
    → ¿Tiene tag "0010_formato_plantillas"?
        NO → ejecuta SQL, registra tag
        SÍ → skip
    → _migrated = true (no vuelve a ejecutar en este cold start)
```

### Para agregar nueva migración
1. Agregar entrada al array `MIGRATIONS` en `api/_lib/migrate.ts`
2. Incluir SQL de CREATE TABLE o ALTER TABLE
3. Deploy a Vercel → se ejecuta automáticamente

---

# Reglas de Desarrollo

## Code Style
- Sin comentarios en código除非 el usuario lo pida
- Seguir convenciones existentes del archivo
- Preferir edición de archivos existentes sobre creación de nuevos
- Verificar TypeScript compile (`npx tsc --noEmit`) antes de commit
- Tests con Vitest (`npx vitest run __tests__/importar-formato.test.ts`)

## Git Workflow
- `git fetch` antes de cada cambio (skill fetch-y-commit)
- Commits concisos en inglés
- Push a rama `feat/importar-formato-planificacion`
- Vercel genera preview automáticamente por cada push

## Base de Datos
- Drizzle ORM con MySQL/TiDB
- Schema en `drizzle/schema.ts`
- Migraciones SQL en `drizzle/00XX_name.sql`
- NO usar `drizzle-kit push` en producción
- Usar `api/_lib/migrate.ts` para migraciones en Vercel

## Exportación de Documentos
- **Client-side generators** (lib/pca-word-generator.ts): Para documentos sin template importado
- **Template renderer** (template-docx-renderer.ts): Para documentos importados con formato original
- **PDF**: Generar HTML → convertir a PDF (expo-print en móvil, print en web)

## IA (LLM)
- Endpoint: Built-In Forge API (server/_core/llm.ts)
- Input: prompt + contexto
- Output: JSON validado con Zod schemas (server/import-formato/schemas.ts)
- Nunca confiar en el output crudo → siempre parsear + validar

---

# Formato Oficial MINEDUC (PCA)

## Estructura del documento
```txt
Encabezado
  ├── Institución Educativa
  ├── Docente
  ├── Área
  ├── Grado
  ├── Paralelo
  ├── Año Lectivo
  └── Carga Horaria Semanal

Tabla de Planificación
  ├── Unidad 1-4
  │   ├── Semanas
  │   ├── DCDes (Destrezas con criterios de desempeño)
  │   ├── Ejes Transversales
  │   ├── Recursos
  │   └── Estrategias Metodológicas
  └── ...

Firmas
  ├── Elaborado por / Fecha
  ├── Revisado por / Fecha
  └── Aprobado por / Fecha
```

## Reglas de Parsing
- Detectar encabezados por keywords: "Institución", "Docente", "Área", "Grado"
- Extraer valores de celdas adyacentes
- Unidades detectadas por "Unidad N" o "Unidad N°"
- Semanas acumuladas: 4 semanas por unidad por defecto
- DCDes vacías → campos undefined (IA los completa)

---

# Comandos Útiles

```bash
# Desarrollo local
pnpm dev                    # Express + Expo simultaneously

# Tests
npx vitest run              # Todos los tests
npx vitest run __tests__/importar-formato.test.ts  # Solo importación

# Type check
npx tsc --noEmit

# Build
pnpm build                  # esbuild → dist/

# DB (requiere DATABASE_URL local)
pnpm db:generate            # Generar migración desde schema
pnpm db:migrate             # Aplicar migraciones
pnpm db:dev                 # generate + migrate
```
