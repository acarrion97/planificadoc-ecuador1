# Fase 14 — QA Visual + E2E + Contratos de Integración

**Objetivo:** Verificar que todo el circuito (UI → tRPC → BD → normalizador → exportador) funciona correctamente después de las Fases 12-13. Esta fase NO agrega funcionalidad nueva; solo valida y endurece.

**Estado:** Plan técnico (antes de implementar)

---

## 1. Checklist de Prueba Visual (Vercel Preview)

> El usuario realiza estas pruebas manualmente en Vercel Preview.

### 1.1 EGB — Flujo completo

| # | Paso | Criterio de aceptación | Archivo |
|---|------|----------------------|---------|
| 1 | Ir a `/curriculo-competencias` | Lista vacía muestra "No hay planificaciones" | `index.tsx` |
| 2 | Click "+ Nueva Planificación" | Selector de tipo muestra 2 opciones | `nuevo.tsx` |
| 3 | Seleccionar "EGB / BGU" | Abre formulario en paso 1 (Datos) | `egb-bgu.tsx` |
| 4 | Verificar chips de áreas | Se muestran 6 chips para EGB: M, LL, CN, CS, EF, ECA con emoji y color | `egb-bgu.tsx:264-290` |
| 5 | Seleccionar chip "Matemática" | Chip se marca con borde, color de fondo del área | `egb-bgu.tsx:273-289` |
| 6 | Cambiar nivel a "BGU" | Chips cambian a 15 áreas (M, LL, CN, CS, EF, ECA + CN.B, CN.Q, etc.) | `egb-bgu.tsx:195-210` |
| 7 | Seleccionar chip "Ciencias Naturales" | Chip se marca correctamente | `egb-bgu.tsx:273-289` |
| 8 | Completar Institución y Docente | Texto ingresa correctamente | `egb-bgu.tsx` |
| 9 | Click "Siguiente →" | Avanza a paso 2 (DCD) si hay área seleccionada | `egb-bgu.tsx:412` |
| 10 | Click "🔍 Buscar DCD" | Abre modal de búsqueda DCD | `egb-bgu.tsx:319-377` |
| 11 | Buscar "fracciones" | Filtra destrezas que contienen "fracciones" | `egb-bgu.tsx:331-333` |
| 12 | Verificar código en resultados | Muestra código (ej: "M.2.1.1") + descripción | `egb-bgu.tsx:354-365` |
| 13 | Seleccionar una DCD | Modal cierra, código se muestra en paso 2 | `egb-bgu.tsx:370-375` |
| 14 | Verificar autocompletado | Descripción, indicador y objetivo se llenan automáticamente | `egb-bgu.tsx:84-117` |
| 15 | Editar descripción autocompletada | El campo permite edición (no es readonly) | `egb-bgu.tsx:398` |
| 16 | Cambiar chip de área | DCD seleccionada se limpia, código y campos de DCD se resetean | `egb-bgu.tsx:286-289` |
| 17 | Seleccionar nueva DCD | Autocompleta con la nueva DCD del área seleccionada | `egb-bgu.tsx:84-117` |
| 18 | Avanzar a paso 3 (Estructura) | Muestra estrategias: ERCA, Directa, Proyectos | `egb-bgu.tsx` |
| 19 | Seleccionar estrategia "ERCA" | Se muestra descripción de ERCA | `egb-bgu.tsx` |
| 20 | Avanzar a paso 4 (Evaluación) | Muestra campos de evaluación + botón IA | `egb-bgu.tsx` |
| 21 | Dejar campos vacíos | Botón IA está habilitado | `egb-bgu.tsx:437-453` |
| 22 | Click "✨ Sugerir campos con IA" | Spinner se muestra, espera 3-5 segundos | `egb-bgu.tsx:439-453` |
| 23 | Verificar campos completados | Los campos vacíos se llenan con sugerencias de IA | `egb-bgu.tsx:314-326` |
| 24 | Modificar un campo ya lleno | Re-escribir el valor sugerido por IA | `egb-bgu.tsx` |
| 25 | Click "✨ Sugerir" de nuevo | El campo modificado NO se sobrescribe | `egb-bgu.tsx:314-326` |
| 26 | Click "Guardar" | Se muestra "Guardando...", luego redirige a lista | `egb-bgu.tsx:460-482` |
| 27 | Verificar en lista | La nueva planificación aparece con estado "Borrador" | `index.tsx` |
| 28 | Click en la card | Abre detalle (`ver/[id].tsx`) | `ver/[id].tsx` |
| 29 | Verificar datos informativos | Institución, docente, grado, área, nivel, trimestre correctos | `ver/[id].tsx:231-248` |
| 30 | Verificar DCD | Código y descripción de DCD correctos | `ver/[id].tsx:250-260` |
| 31 | Verificar evaluación | Técnica, instrumento, actividades correctos | `ver/[id].tsx:280-295` |
| 32 | Click "📄 Word" | Se descarga archivo .docx | `ver/[id].tsx:63-103` |
| 33 | Abrir .docx | Contiene todos los datos de la planificación | Word generator |
| 34 | Click "🖨️ PDF" | Se abre nueva pestaña con vista previa | `ver/[id].tsx:105-134` |
| 35 | Imprimir PDF | Formato A4 horizontal, colores correctos | PDF generator |
| 36 | Click "✏️ Editar" | Abre formulario con datos precargados | `ver/[id].tsx:136-152` |
| 37 | Modificar un campo | Cambiar descripción de DCD | `egb-bgu.tsx` |
| 38 | Guardar cambios | Actualiza sin crear nueva planificación | `egb-bgu.tsx:460-482` |
| 39 | Volver a verificar | Los cambios persisten | `ver/[id].tsx` |
| 40 | Click "🗑️ Eliminar" | Muestra confirmación | `ver/[id].tsx:154-176` |
| 41 | Confirmar eliminación | Redirige a lista, planificación ya no aparece | `index.tsx` |

### 1.2 BGU — Verificaciones adicionales

| # | Paso | Criterio |
|---|------|----------|
| 42 | Crear planificación BGU | 15 chips de áreas visibles |
| 43 | Seleccionar "Ciencias Sociales" → subárea "Historia" | Filtrado correcto por subnivel |
| 44 | DCD de BGU diferente a EGB | Las destrezas mostradas corresponden al subnivel 3-4 |
| 45 | Exportar Word/PDF | Contenido BGU correcto (sin "Nivel"/"Paralelo" si no aplica) | 

### 1.3 Casos límite visuales

| # | Paso | Criterio |
|---|------|----------|
| 46 | No seleccionar área → intentar avanzar | Botón "Siguiente" deshabilitado |
| 47 | No seleccionar DCD → intentar avanzar | Botón "Siguiente" deshabilitado en paso 2 |
| 48 | Conexión lenta → click Guardar | Spinner se muestra, no se puede hacer doble click |
| 49 | Error de IA → click "Sugerir" | Mensaje de error, formulario no se rompe |
| 50 | Refrescar página en medio del formulario | Selector de tipo vuelve a mostrar opciones |

---

## 2. Tests E2E Automatizados (Nuevos)

> Estos tests se implementan en `__tests__/curriculo-competencias-e2e.test.ts` (extender archivo existente).

### 2.1 Flujo completo EGB/BGU con catálogos

```typescript
it("E2E completo: crear → área → DCD → autocompletar → IA → guardar → recuperar → exportar", async () => {
  // 1. Normalizar input con areaCode
  const input = egbBguInput({ areaCode: "M", asignatura: "Matemáticas" });
  
  // 2. Verificar que la DCD del catálogo se resuelve correctamente
  const dcd = buscarPorCodigo(input.dcd.codigo);
  expect(dcd).toBeDefined();
  expect(dcd!.area).toBe("M");
  
  // 3. Normalizar y verificar areaCode en canonical
  const plan = normalizarPlanificacionEGBBGU(input);
  expect(plan.areaCode).toBe("M");
  expect(plan.asignatura).toBe("Matemáticas");
  
  // 4. Persistir
  const { id } = await crearPlanificacion(input, "egb_bgu");
  expect(id).toBeGreaterThan(0);
  
  // 5. Recuperar y verificar
  const retrieved = await getPlanificacion(id);
  expect(retrieved.formData.areaCode).toBe("M");
  expect(retrieved.formData.dcd.codigo).toBe(input.dcd.codigo);
  
  // 6. Exportar Word y verificar contenido
  const wordBlob = await generarCurriculoCompetenciasWordEGBBGU(retrieved.formData);
  expect(wordBlob.size).toBeGreaterThan(0);
  
  // 7. Exportar PDF y verificar HTML
  const html = generarCurriculoCompetenciasPdfEGBBGU(retrieved.formData);
  expect(html).toContain("Matemáticas");
  expect(html).toContain(input.dcd.codigo);
});
```

### 2.2 Flujo completo Inicial con ámbitos

```typescript
it("E2E completo Inicial: crear → ámbitos → destrezas → guardar → recuperar → exportar", async () => {
  // 1. Input con ámbitos anidados
  const input = inicialInput({
    ambitos: [{
      nombreAmbito: "Len",
      destrezas: [{ codigo: "DCD-001", descripcion: "Comprende textos" }],
      clases: [{ nombreClase: "Lectura", inicio: "Motivación", desarrollo: "Práctica", cierre: "Reflexión" }]
    }]
  });
  
  // 2. Normalizar
  const plan = normalizarPlanificacionInicial(input);
  expect(plan.ambitos).toHaveLength(1);
  expect(plan.ambitos[0].clases).toHaveLength(1);
  
  // 3. Persistir y recuperar
  const { id } = await crearPlanificacion(input, "inicial_preparatoria");
  const retrieved = await getPlanificacion(id);
  expect(retrieved.formData.ambitos[0].nombreAmbito).toBe("Len");
  
  // 4. Exportar Word Inicial
  const blob = await generarCurriculoCompetenciasWordInicial(retrieved.formData);
  expect(blob.size).toBeGreaterThan(0);
});
```

### 2.3 Actualización (update) round-trip

```typescript
it("E2E update: crear → modificar DCD → guardar → verificar cambios", async () => {
  // 1. Crear con DCD original
  const input1 = egbBguInput({ dcd: { codigo: "M.2.1.1", descripcion: "Fracciones" } });
  const { id } = await crearPlanificacion(input1, "egb_bgu");
  
  // 2. Modificar DCD
  const input2 = egbBguInput({
    dcd: { codigo: "M.2.1.2", descripcion: "Operaciones con fracciones" },
  });
  await actualizarPlanificacion(id, input2);
  
  // 3. Verificar que cambió
  const retrieved = await getPlanificacion(id);
  expect(retrieved.formData.dcd.codigo).toBe("M.2.1.2");
  expect(retrieved.formData.dcd.descripcion).toBe("Operaciones con fracciones");
});
```

### 2.4 Eliminación

```typescript
it("E2E delete: crear → eliminar → verificar que no existe", async () => {
  const input = egbBguInput();
  const { id } = await crearPlanificacion(input, "egb_bgu");
  
  await eliminarPlanificacion(id);
  
  const result = await getPlanificacion(id);
  expect(result).toBeNull();
});
```

### 2.5 Filtro de lista

```typescript
it("E2E list: crear EGB + Inicial → filtrar por tipo", async () => {
  await crearPlanificacion(egbBguInput(), "egb_bgu");
  await crearPlanificacion(inicialInput(), "inicial_preparatoria");
  
  const all = await listarPlanificaciones("session-123");
  expect(all).toHaveLength(2);
  
  const egbOnly = await listarPlanificaciones("session-123", "egb_bgu");
  expect(egbOnly).toHaveLength(1);
  expect(egbOnly[0].tipo).toBe("egb_bgu");
});
```

---

## 3. Tests de Contratos de Integración (Nuevos)

> Estos tests se implementan en `__tests__/curriculo-competencias-integration.test.ts` (extender archivo existente).

### 3.1 Contrato Router → Normalizer

```typescript
it("createEGBBGU ejecuta normalización correcta", () => {
  const input = egbBguInput({ areaCode: "CN" });
  const plan = normalizarPlanificacionEGBBGU(input);
  
  // Verificar que el normalizador produce modelo canónico válido
  expect(plan).toHaveProperty("id");
  expect(plan).toHaveProperty("status", "draft");
  expect(plan.areaCode).toBe("CN");
  expect(plan.asignatura).toBe("Ciencias Naturales");
  expect(plan.fecha).toBeTruthy();
  expect(plan.sourceTraceability).toBeDefined();
});
```

### 3.2 Contrato DB → Exportador

```typescript
it("formData JSON round-trip preserva estructura completa", () => {
  const input = egbBguInput();
  const canonical = normalizarPlanificacionEGBBGU(input);
  
  // Simular persistencia
  const serialized = JSON.stringify(canonical);
  const deserialized = JSON.parse(serialized);
  
  // Verificar que la estructura se preserva
  expect(deserialized.dcd.codigo).toBe(canonical.dcd.codigo);
  expect(deserialized.competencias).toEqual(canonical.competencias);
  expect(deserialized.estructuraDidactica).toEqual(canonical.estructuraDidactica);
  expect(deserialized.evaluacion).toEqual(canonical.evaluacion);
  expect(deserialized.areaCode).toBe(canonical.areaCode);
});
```

### 3.3 Contrato Exportador → Documento

```typescript
it("Word export contiene todas las secciones requeridas", async () => {
  const input = egbBguInput();
  const plan = normalizarPlanificacionEGBBGU(input);
  
  const blob = await generarCurriculoCompetenciasWordEGBBGU(plan);
  const zip = await JSZip.loadAsync(blob);
  const docXml = await zip.file("word/document.xml")!.async("string");
  
  // Verificar secciones del documento
  expect(docXml).toContain("planificación");
  expect(docXml).toContain(plan.institucion);
  expect(docXml).toContain(plan.docente);
  expect(docXml).toContain(plan.dcd.codigo);
  expect(docXml).toContain(plan.dcd.descripcion);
  expect(docXml).toContain(plan.evaluacion.tecnicaEvaluacion);
});
```

### 3.4 Contrato PDF → HTML

```typescript
it("PDF export contiene estilos de impresión correctos", () => {
  const input = egbBguInput();
  const plan = normalizarPlanificacionEGBBGU(input);
  
  const html = generarCurriculoCompetenciasPdfEGBBGU(plan);
  
  // Verificar estilos críticos
  expect(html).toContain("@page { size: A4 landscape }");
  expect(html).toContain("print-color-adjust: exact");
  expect(html).toContain("planificación");
});
```

---

## 4. Tests de Hardening (Nuevos)

### 4.1 Estados vacíos

```typescript
it("Normalizar con todos los campos vacíos no crashea", () => {
  const input = { fecha: "", institucion: "", docente: "", grado: "", asignatura: "", areaCode: "" };
  const plan = normalizarPlanificacionEGBBGU(input);
  expect(plan.institucion).toBe("");
  expect(plan.docente).toBe("");
  expect(plan.areaCode).toBeUndefined();
});

it("Exportar Word con plan mínimo no crashea", async () => {
  const input = egbBguInput({ competencias: [], estrategiaId: "", fases: [] });
  const plan = normalizarPlanificacionEGBBGU(input);
  const blob = await generarCurriculoCompetenciasWordEGBBGU(plan);
  expect(blob.size).toBeGreaterThan(0);
});

it("Exportar PDF con plan mínimo no crashea", () => {
  const input = egbBguInput({ competencias: [], estrategiaId: "", fases: [] });
  const plan = normalizarPlanificacionEGBBGU(input);
  const html = generarCurriculoCompetenciasPdfEGBBGU(plan);
  expect(html).toContain("<!DOCTYPE html>");
});
```

### 4.2 Validación de entrada

```typescript
it("DCD con código inexistente se maneja gracefully", () => {
  const input = egbBguInput({ dcd: { codigo: "XXX.9.9.9", descripcion: "No existe" } });
  const plan = normalizarPlanificacionEGBBGU(input);
  // El normalizador debe manejar códigos no encontrados
  expect(plan.dcd.codigo).toBeTruthy();
});

it("Competencias inválidas se filtran", () => {
  const input = egbBguInput({ competencias: ["INVALID", "MATEMÁTICA", "C"] as any });
  const plan = normalizarPlanificacionEGBBGU(input);
  // Solo competencias válidas del catálogo pasan
  expect(plan.competencias.length).toBeLessThanOrEqual(3);
});
```

### 4.3 Límites de seguridad

```typescript
it("Texto extremadamente largo se trunca en normalización", () => {
  const longText = "A".repeat(10000);
  const input = egbBguInput({ institucion: longText });
  const plan = normalizarPlanificacionEGBBGU(input);
  expect(plan.institucion.length).toBeLessThanOrEqual(500);
});

it("Array de competencias extremadamente grande se trunca", () => {
  const input = egbBguInput({ competencias: Array(100).fill("MATEMÁTICA") as any });
  const plan = normalizarPlanificacionEGBBGU(input);
  expect(plan.competencias.length).toBeLessThanOrEqual(20);
});
```

### 4.4 Inyección de scripts

```typescript
it("Campo con <script> se sanitiza en normalización", () => {
  const input = egbBguInput({ institucion: '<script>alert("xss")</script> Escuela' });
  const plan = normalizarPlanificacionEGBBGU(input);
  expect(plan.institucion).not.toContain("<script>");
  expect(plan.institucion).toContain("Escuela");
});
```

---

## 5. Archivos a Revisar (Checklist)

| Archivo | Qué revisar | Prioridad |
|---------|-------------|-----------|
| `app/curriculo-competencias/egb-bgu.tsx` | Chips de área, DCD modal, autocompletado, botón IA | 🔴 |
| `app/curriculo-competencias/inicial.tsx` | Formulario de ámbitos, persistencia | 🟠 |
| `app/curriculo-competencias/ver/[id].tsx` | Detalle, exportación, edición, eliminación | 🔴 |
| `app/curriculo-competencias/index.tsx` | Lista, filtros, estados vacíos | 🟠 |
| `app/curriculo-competencias/nuevo.tsx` | Selector de tipo | 🟡 |
| `server/curriculo-competencias-router.ts` | CRUD, exportación, IA, validación Zod | 🔴 |
| `lib/curriculo-competencias-normalizer.ts` | Transformaciones, edge cases | 🔴 |
| `lib/curriculo-competencias-word-generator.ts` | Estructura del documento Word | 🟠 |
| `lib/curriculo-competencias-pdf-generator.ts` | HTML, estilos, contenido | 🟠 |
| `lib/curriculo-competencias-inicial-word-generator.ts` | Word para Inicial | 🟠 |
| `data/types-curriculo-competencias.ts` | Modelo canónico, campos opcionales | 🟡 |
| `data/index.ts` | Catálogos de destrezas, búsqueda | 🟡 |

---

## 6. Criterios de Aceptación de Fase 14

### Automatizados (tests)
- [ ] 196 tests existentes pasan (sin regresiones)
- [ ] +15 tests E2E nuevos pasan (flujo completo ambas familias)
- [ ] +10 tests de contratos pasan (UI→tRPC→BD→export)
- [ ] +10 tests de hardening pasan (estados vacíos, validación, límites)
- [ ] Total: ≥231 tests passing

### Manuales (Vercel Preview)
- [ ] Flujo EGB completo: crear → área → DCD → autocompletar → IA → guardar → recuperar → Word → PDF
- [ ] Flujo BGU completo: 15 chips → DCD filtrado → autocompletar → guardar
- [ ] Flujo Inicial completo: ámbitos → destrezas → guardar → Word
- [ ] Edición: abrir existente → modificar → guardar → verificar cambios
- [ ] Eliminación: confirmar que desaparece de la lista
- [ ] IA: solo completa campos vacíos, nunca sobrescribe existentes
- [ ] IA: error de conexión no rompe el formulario
- [ ] Exportación Word: se descarga y contiene todos los datos
- [ ] Exportación PDF: se abre en pestaña y formato correcto

### Contractuales
- [ ] `areaCode` se preserva en todo el ciclo de vida
- [ ] DCD seleccionada se serializa/deserializa correctamente
- [ ] Competencias se mantienen en JSON round-trip
- [ ] SourceTraceability se adjunta automáticamente
- [ ] Status inicial es siempre "draft"

---

## 7. Orden de Implementación

1. **Tests E2E** (2.1-2.5) — Extender `curriculo-competencias-e2e.test.ts`
2. **Tests de contratos** (3.1-3.4) — Extender `curriculo-competencias-integration.test.ts`
3. **Tests de hardening** (4.1-4.4) — Extender `curriculo-competencias-integration.test.ts`
4. **Verificar** que todos los tests pasan
5. **Commit** con mensaje descriptivo
6. **Vercel Preview** para prueba visual manual
