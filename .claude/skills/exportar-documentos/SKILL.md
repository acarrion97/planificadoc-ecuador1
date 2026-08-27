---
name: exportar-documentos
description: Patrón obligatorio al crear o modificar pantallas de exportación de documentos (PCA, PCT, adaptaciones, planes semanales, etc.) en este repo. Cubre: uso correcto de tRPC v11 con React Query (useMutation), exportación con plantilla vs generador nativo, preservación de figuras/imágenes del DOCX importado, y clonación de documentos. Trigger con "exportar", "descargar", "word", "pdf", "plantilla", "exportarConPlantilla", "clonar PCA", o al modificar archivos *-preview/*.tsx o *-router.ts.
---

# Patrón de exportación de documentos PlanificaDoc

Reglas obligatorias al trabajar con exportación de documentos en este repo.

## 1. tRPC v11: SIEMPRE usar `useMutation()` hook

En tRPC v11 con React Query, el proxy de procedimientos **NO** tiene `.mutate()` como método directo. Solo `.useMutation()` devuelve el hook con `.mutate()`/`.mutateAsync()`.

### ❌ INCORRECTO (compila pero falla en runtime)
```tsx
// Esto NO funciona en tRPC v11
await trpc.pca.exportarConPlantilla.mutate({ pcaId: 1 });
```

### ✅ CORRECTO
```tsx
// 1. Declarar el hook en el componente (fuera de useEffect, antes del return)
const exportPlantillaMutation = trpc.pca.exportarConPlantilla.useMutation();

// 2. Usar .mutateAsync() en callbacks/async functions
const result = await exportPlantillaMutation.mutateAsync({ pcaId: 1 });

// 3. Agregar a dependencias del useCallback
useCallback(async () => {
  // ...
}, [doc, exportPlantillaMutation]);
```

### Patrón completo para mutations en componentes
```tsx
// En el body del componente:
const miMutation = trpc.miRouter.miEndpoint.useMutation();

// En handlers:
const handleAlgo = useCallback(async () => {
  try {
    setMiEstado(true);
    const result = await miMutation.mutateAsync({ campo: valor });
    if (result.success) {
      // éxito
    }
  } catch (err: any) {
    Alert.alert("Error", err.message);
  } finally {
    setMiEstado(false);
  }
}, [dependencias, miMutation]);  // ← INCLUIR miMutation
```

## 2. Exportación de documentos Word

El flujo de exportación tiene dos caminos:

### A. Exportar con plantilla (DOCX fiel al original importado)
- Solo funciona si el PCA tiene `formatoPlantillaId` (se guarda al importar)
- Preserva el formato exacto del documento original (figuras, logos, estilos)
- Usa `template-docx-renderer.ts` que trabaja con JSZip

### B. Exportar con generador nativo (fallback)
- Usa `lib/pca-word-generator.ts` (o similar según tipo)
- Genera un DOCX desde cero con la librería `docx`
- No preserva figuras/imágenes del original

### Flujo en el componente
```tsx
const handleExportWord = useCallback(async () => {
  let blob: Blob;

  // Intentar con plantilla primero
  const plantillaResult = await exportPlantillaMutation.mutateAsync({ pcaId: doc.id });

  if (plantillaResult.success && plantillaResult.docxBase64) {
    // Convertir base64 a Blob
    const binaryString = atob(plantillaResult.docxBase64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    blob = new Blob([bytes], { type: plantillaResult.mimeType });
  } else {
    // Fallback: generador nativo
    blob = await generarWordXxx(formData, aiResult);
  }

  // Descargar...
}, [doc, formData, aiResult, exportPlantillaMutation]);
```

## 3. Preservación de figuras/imágenes al importar

El `template-docx-renderer.ts` trabaja con JSZip:
1. Carga el ZIP original del DOCX (incluye `word/media/` con imágenes)
2. Solo modifica `word/document.xml` (reemplaza texto en celdas)
3. Las imágenes en `word/media/` se mantienen intactas
4. El renderer clona filas para regiones repetibles preservando nodos `w:drawing`

**Requisito**: El PCA debe tener `formatoPlantillaId` asociado. Si no lo tiene, el sistema usa el generador nativo y pierde las figuras.

## 4. Clonación de documentos

Para duplicar un PCA existente:
```tsx
// Mutation
const clonarMutation = trpc.pca.clonarPca.useMutation();

// Handler
const handleClonar = useCallback(async () => {
  const result = await clonarMutation.mutateAsync({
    sourcePcaId: pcaId,
    sessionId,
  });
  if (result.success) {
    router.push(`/pca-preview/${result.newPcaId}`);
  }
}, [pcaId, clonarMutation, router]);
```

El clon preserva: `formData`, `aiResult`, `formatoPlantillaId`.
El clon inicia con: `status: "draft"`.

## 5. Archivos relevantes

| Archivo | Función |
|---------|---------|
| `server/pca-router.ts` | Mutations: `generatePca`, `clonarPca`, `exportarConPlantilla`, `regenerarSeccion` |
| `server/import-formato/handlers/pca.ts` | Handler de importación: crea PCA + plantilla |
| `server/import-formato/template-docx-renderer.ts` | Renderiza DOCX desde plantilla preservando imágenes |
| `server/db.ts` | CRUD: `createPcaDocument`, `clonePcaDocument`, `setPcaFormatoPlantillaId` |
| `app/pca-preview/[id].tsx` | Pantalla de preview con exportación |
