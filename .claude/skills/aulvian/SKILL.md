---
name: aulvian
description: "Use this skill for educational management systems aligned with the Ministerio de Educación del Ecuador using Laravel + Inertia.js + React. Trigger whenever implementing enrollment, grading, attendance, academic reports, academic periods, teacher assignments, institutional structures, qualitative and quantitative grading, reinforcement workflows, or MINEDUC-compliant reports. Covers: multi-institution management, academic structures, grading formulas, educational levels, attendance, reports, academic reinforcement, representative access, Inertia forms, validation rules, academic workflows, and institutional permissions. Do not use for unrelated ERP, ecommerce, or generic CMS modules."
license: MIT
metadata:
  author: Henry Simbaña Cruz
---

# Sistema Educativo Ecuador — Laravel + Inertia React

## Stack Tecnológico

- Laravel
- Inertia.js
- React
- TailwindCSS
- MySQL o PostgreSQL

---

# Arquitectura

## Principios Generales

- NO usar API REST tradicional
- Laravel controla:
  - navegación
  - autorización
  - validaciones
  - lógica académica
  - renderizado Inertia
- React únicamente renderiza vistas
- Navegación usando Inertia.js
- Formularios usando `useForm`
- Validaciones críticas siempre en backend
- No calcular notas finales únicamente en frontend

---

# Dominio Académico

## Estructura Académica

```txt
Nivel
 └── Subnivel
      └── Curso
           └── Paralelo
```

---

## Relaciones Principales

- Estudiantes matriculados por:
  - institución
  - periodo académico
  - oferta educativa
  - curso
  - paralelo

- Docentes asignados a:
  - materias
  - cursos
  - paralelos

- Representantes legales pueden visualizar:
  - estudiantes asociados
  - asistencia
  - calificaciones
  - observaciones
  - informes

---

# Reglas Académicas MINEDUC Ecuador

## Inicial y Preparatoria

### Reglas

- NO usar calificaciones numéricas
- NO generar promedios
- SOLO evaluación cualitativa

### Escala Permitida

| Código | Descripción |
|---|---|
| A | Adquirido |
| EP | En Proceso |
| I | Iniciado |
| NE | No Evaluado |

---

## Educación General Básica Elemental

### Reglas

- Puede manejar:
  - notas numéricas
  - equivalencia cualitativa

- Promedio simple de actividades y aportes

### Equivalencias Sugeridas

| Rango | Equivalencia |
|---|---|
| 9.00 - 10.00 | DA |
| 7.00 - 8.99 | AA |
| 4.01 - 6.99 | PA |
| 0.00 - 4.00 | NA |

---

## EGB Media, Superior y Bachillerato

### Ponderación Oficial

| Componente | Peso |
|---|---:|
| Formativa | 70% |
| Sumativa | 30% |

### Fórmula Oficial

```txt
Nota Final = (Formativa × 0.70) + (Sumativa × 0.30)
```

---

## Metacognición

### Reglas

- Es parte del proceso pedagógico
- NO debe registrarse como nota independiente
- Puede almacenarse como:
  - observación
  - reflexión
  - evidencia pedagógica

---

## Proyectos Interdisciplinarios

### Reglas

- Obligatorios o recomendados según nivel
- Pueden formar parte de:
  - evaluación sumativa
  - proyectos quimestrales
  - evidencias integradoras

---

# Backend Rules

## Persistencia De Notas

Guardar siempre por separado:

```txt
formativa_score
sumativa_score
final_score
qualitative_grade
```

---

## Cálculo Obligatorio

```txt
final_score = (formativa_score * 0.70) + (sumativa_score * 0.30)
```

---

## Regla De Truncamiento

- Truncar a 2 decimales antes de guardar
- NO redondear automáticamente si la institución no lo permite

Ejemplo:

```txt
8.999 → 8.99
```

---

# Reglas De Validación

## Notas

- No permitir:
  - valores negativos
  - valores mayores a 10
  - NaN
  - null en periodos cerrados

---

## Estados Académicos

Estados sugeridos:

```txt
active
inactive
withdrawn
graduated
failed
transferred
```

---

# Periodos Académicos

## Debe Soportar

- Año lectivo
- Quimestre
- Parcial
- Unidad
- Recuperación
- Supletorio
- Remedial
- Gracia

---

# Multiinstitución

## Cada Registro Académico Debe Relacionarse Con

```txt
institution_id
academic_period_id
tenant_id
```

---

# Seguridad

## Reglas

- Los docentes SOLO pueden modificar:
  - materias asignadas
  - cursos asignados

- Representantes SOLO visualizan:
  - estudiantes relacionados

- Auditoría obligatoria:

```txt
created_by
updated_by
created_at
updated_at
```

---

# Frontend Rules

## React + Inertia

### Reglas

- Usar:
  - `useForm`
  - `router`
  - `Link`
  - `Head`

- Evitar:
  - fetch manual innecesario
  - axios para navegación
  - manejo duplicado de estado servidor

---

# Reportes

## El Sistema Debe Generar

- Boletas
- Reportes quimestrales
- Reportes anuales
- Cuadros de calificaciones
- Reportes de asistencia
- Reportes de refuerzo académico
- Actas
- Certificados

---

# Consideraciones Técnicas

## Base De Datos

- Preferir UUID para entidades críticas
- Usar foreign keys reales
- SoftDeletes únicamente donde aplique

---

# Objetivo Final

El sistema debe permitir administrar instituciones educativas ecuatorianas respetando:

- normativa MINEDUC
- estructura académica oficial
- procesos de evaluación
- auditoría institucional
- generación automática de reportes
- trazabilidad académica

---

# Fix Diagnostics

## Purpose

Fix issues found by the Chat Customizations Evaluations analyzer in prompt, agent, skill, and instruction files. The diagnostics include contradictions, ambiguities, persona conflicts, cognitive load issues, and coverage gaps.

## Usage

This skill is invoked automatically when the user clicks the "Fix Diagnostics" button in the editor title bar. It receives the diagnostics as context and rewrites the affected sections of the file to resolve them.

## Instructions

- You will receive a list of diagnostics from the Chat Customizations Evaluations extension. Each diagnostic includes a line number, code, message, and optionally a suggestion.
- For each diagnostic, apply the fix directly to the file content. Use the suggestion if one is provided; otherwise, use your judgment to resolve the issue.
- Preserve the overall structure, tone, and intent of the prompt file. Only change what is necessary to resolve the diagnostics.
- If two diagnostics conflict with each other, prefer the fix that keeps the prompt clearer and more consistent.
- Output the fixed file content as a code block so it can be applied as an edit.
- Do NOT add new instructions or sections that were not in the original file.
- Do NOT remove instructions unless a diagnostic specifically calls for it (e.g., contradictions).
