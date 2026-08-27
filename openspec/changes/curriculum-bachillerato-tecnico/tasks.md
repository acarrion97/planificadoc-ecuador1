## 1. Schema Drizzle — Modelo de datos

- [x] 1.1 Crear tabla `btAreasTecnicas` (id, nombre, descripcion)
- [x] 1.2 Crear tabla `btFamiliasProfesionales` (id, areaId, nombre, codigo, descripcion)
- [x] 1.3 Crear tabla `btFigurasProfesionales` (id, familiaId, nombre, codigo, perfilProfesional, activa, figuraReemplazoId)
- [x] 1.4 Crear tabla `btModulosFormativos` (id, figuraId, nombre, codigo, tipo: "generico"|"especializacion")
- [x] 1.5 Crear tabla `btContenidos` (id, moduloId, tipo: "conceptual"|"procedimental"|"actitudinal", descripcion, orden)
- [x] 1.6 Crear tabla `btResultadosAprendizaje` (id, moduloId, codigo, descripcion)
- [x] 1.7 Crear tabla `btCriteriosEvaluacion` (id, raId, codigo, descripcion)
- [x] 1.8 Crear tabla `btModuloPorAnio` (id, moduloId, anioBGU: 1|2|3, cargaHorariaSemanal)
- [x] 1.9 Crear tabla `btPlanificaciones` (id, sessionId, figuraId, anioBGU, anioLectivo, nombre)
- [x] 1.10 Crear tabla `btDistribucionTrimestre` (id, planificacionId, trimestre: 1|2|3, contenidoId, raId)

## 2. Migración SQL

- [x] 2.1 Generar migración SQL para las 10 tablas nuevas
- [x] 2.2 Agregar migración al array `MIGRATIONS` en `api/_lib/migrate.ts`

## 3. Datos semilla

- [x] 3.1 Crear script `data/bt-seed.ts` con las 10 familias profesionales del Acuerdo 00065-A
- [x] 3.2 Cargar las ~34 figuras profesionales vigentes por familia
- [x] 3.3 Integrar seed en el flujo de migración o como endpoint admin

## 4. Tipos TypeScript

- [x] 4.1 Exportar tipos derivados del schema: `BtAreaTecnica`, `BtFamiliaProfesional`, `BtFiguraProfesional`, etc.
- [x] 4.2 Crear tipo `BtModuloConDistribucion` (módulo + años asociados)
- [x] 4.3 Crear tipo `BtPlanificacionCompleta` (planificación + distribución trimestral)

## 5. Funciones de base de datos

- [x] 5.1 Crear CRUD para `btFigurasProfesionales` (listar por familia, obtener por ID)
- [x] 5.2 Crear función `getModulosPorFiguraYAnio(figuraId, anioBGU)`
- [x] 5.3 Crear función `getContenidosPorModulo(moduloId, tipo?)`
- [x] 5.4 Crear función `getRAPorModulo(moduloId)`
- [x] 5.5 Crear función `getPlanificacionConDistribucion(planificacionId)`

## 6. Validaciones

- [x] 6.1 Validar que un contenido no se asigne dos veces al mismo trimestre
- [x] 6.2 Validar que la carga horaria por trimestre no exceda 21 horas pedagógicas
- [x] 6.3 Validar que una figura deprecada no se asigne a planes nuevos

## 7. Tests

- [x] 7.1 Test de schema: insertar y consultar jerarquía completa (área → familia → figura → módulo)
- [x] 7.2 Test de distribución: asignar módulo a múltiples años con carga horaria
- [x] 7.3 Test de contenidos: CRUD atómico por tipo
- [x] 7.4 Test de planificación: crear planificación con distribución trimestral
- [x] 7.5 Test de validaciones: carga horaria excesiva, contenido duplicado
