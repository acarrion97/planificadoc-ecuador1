## 1. Núcleo de resolución por grado

- [ ] 1.1 Añadir `subnivelDelGradoAnterior(grado: string): Subnivel | null` en `lib/evaluacion-utils.ts`: devuelve el subnivel del grado anterior (reutiliza la lógica de `subnivelDesdeGrado`; "1.° EGB" → null, "1.° BGU" → subnivel 4, "2.°/3.° BGU" → 5; Inicial → null)
- [ ] 1.2 Añadir `resolverPrerequisitoPorGrado(area: Area, grado: string): PrerequisitoCurricular | null` en `lib/curriculo-prerrequisitos.ts` siguiendo design D1: subnivel del curso → subnivel del grado anterior → null si sin grado anterior, null si mismo subnivel, CAI@1 si Preparatoria, candidato validado con `existeAreaSubnivel`
- [ ] 1.3 No modificar `resolverPrerequisito` (subnivel): conserva su comportamiento para consumidores que solo conocen subnivel

## 2. Tests del resolver (red de seguridad)

- [ ] 2.1 Añadir tests de `subnivelDelGradoAnterior` en `__tests__/curriculo-prerrequisitos.test.ts` (o archivo nuevo si el patrón de tests lo requiere): 1.° EGB, 2.°, 3.°, 5.°, 6.°, 8.°, 9.°, 10.° EGB, 1.° BGU, 2.°/3.° BGU, Inicial
- [ ] 2.2 Añadir tests de `resolverPrerequisitoPorGrado` cubriendo: 2.° EGB → CAI@1; 5.° EGB → LL@2; 8.° EGB → LL@3; 1.° BGU → LL@4; 1.° BGU CN.F → CN@4; 3.°/4.° EGB, 6.°/7.° EGB, 9.°/10.° EGB, 2.°/3.° BGU → null (mismo subnivel); EG@1.° BGU → null; 1.° EGB → null
- [ ] 2.3 Confirmar que los tests del resolver antiguo (`resolverPrerequisito`) siguen pasando sin cambios

## 3. Migración de Evaluación Diagnóstica

- [ ] 3.1 En `app/evaluacion-diagnostica/index.tsx` (selección manual, ~línea 216-218): reemplazar `resolverPrerequisito(area, subnivel)` por `resolverPrerequisitoPorGrado(area, grado)` en el `useMemo`, añadiendo `grado` a las deps
- [ ] 3.2 En `preseleccionarDcdsDeWizard` (~línea 257): usar `resolverPrerequisitoPorGrado(v, grado)`
- [ ] 3.3 Ajustar los mensajes de "sin prerrequisito" para distinguir "grado anterior en el mismo subnivel" de "área sin predecesor" (spec "Mensajes diferenciados")

## 4. Migración del buscador CNC

- [ ] 4.1 Añadir prop `grado: string` a `DestrezaBuscadorCNC` en `app/conecta-nivela-crea/index.tsx` (reemplaza o complementa `subnivelCurso`)
- [ ] 4.2 En `DestrezaBuscadorCNC` (~línea 235): usar `resolverPrerequisitoPorGrado(area, grado)` y quitar la resta `subnivel - 1` local
- [ ] 4.3 Pasar la prop `grado` desde todos los usos de `DestrezaBuscadorCNC` en el wizard (Semana 1 y Semanas 2-3)

## 5. Verificación

- [ ] 5.1 `pnpm check` sin nuevos errores de tipos (tope actual: 49 preexistentes)
- [ ] 5.2 Ejecutar la suite de tests relevante (base 28/28 y CNC 16/16)
- [ ] 5.3 Verificación manual de casos límite: 3.° EGB, 6.° EGB, 9.° EGB, 2.° BGU (todos → subnivel del curso), y 2.° EGB, 5.° EGB, 8.° EGB, 1.° BGU (→ subnivel del grado anterior) en los tres flujos