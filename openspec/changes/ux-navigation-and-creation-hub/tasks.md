## 1. Base: navegación (fase 1)

- [x] 1.1 Agregar el token `brand` (`#003366` light y dark) en `theme.config.js` sin tocar `primary` (design D6)
- [x] 1.2 Crear el componente de navegación lateral con las zonas **principal** (Inicio, Crear, Explorar, Mis planes) y **gestión** (Mi cuenta, Ayuda), ítem de marca "PlanificaDoc Ecuador" al pie e iconos de `@expo/vector-icons` (design D7)
- [x] 1.3 Implementar los tres breakpoints con `useWindowDimensions`: ≥1024 sidebar expandido (240px), 768–1023 colapsado (64px), <768 header con `☰` (design D2)
- [x] 1.4 Implementar el control de colapso/expansión del sidebar conservando el estado durante la sesión
- [x] 1.5 Implementar el drawer móvil (apertura por `☰`, cierre al elegir ítem o al tocar el fondo)
- [x] 1.6 Reemplazar el contenido de `app/(tabs)/_layout.tsx`: de `<Tabs>` al layout de navegación envolviendo `<Slot/>`, **conservando el nombre del grupo** (design D1, riesgo R3)
- [x] 1.7 Ajustar el manejo de safe-area inferior en el layout de secciones al no existir tab bar (design D8, riesgo R2)
- [x] 1.8 Destacar visualmente el ítem "Crear" y marcar el ítem activo con `brand` + gris neutro en ambas plataformas
- [x] 1.9 Crear la ruta `app/ayuda/index.tsx`, registrarla en `app/_layout.tsx` y darle diseño responsive con contenido **estático** inicial (spec `navegacion-principal`)
- [x] 1.10 Implementar la FAQ agrupada con buscador simple de texto, cubriendo las 9 preguntas aprobadas (crear planificación, PCA vs PCT, continuar un plan, dónde están mis planes, planificar desde una destreza, requisitos de adaptación curricular, evaluación diagnóstica, exportación, funciones Premium). El contenido explica **cómo usar PlanificaDoc** (p. ej. "Crear → Plan de área → PCA Anual") y **no** contiene normativa ni criterios curriculares. Contenido estático: sin CMS, sin base de datos de artículos, sin tickets, chat ni búsqueda semántica
- [x] 1.11 Añadir enlaces desde la FAQ a los destinos reales (`/crear`, Mis planes y sus flujos), el enlace "Ver ayuda" desde el aviso contextual de Adaptación curricular, y el botón **Contactar soporte** (`soporte@planificadoc.app`)
- [ ] 1.12 Verificar en escritorio/tablet/móvil que todas las secciones siguen alcanzables desde pantallas profundas (spec `navegacion-principal`)

## 2. Hub de creación (fase 2)

- [x] 2.1 Crear la lista tipada única de módulos `{categoria, modulo, ruta, icono, requiereContexto}` que cubra los 12 flujos: diario, semanal, PCA, PCT, CNC, Proyecto interdisciplinar, BT, Currículo por Competencias, Inicial, Preparatoria, Adaptación curricular, Evaluación diagnóstica
- [x] 2.2 Crear la ruta `app/crear/index.tsx` que renderiza el catálogo agrupado por las 6 categorías del spec `hub-de-creacion`
- [x] 2.3 Aplicar el lenguaje cromático único (`brand` + blanco + gris) a todas las tarjetas, eliminando los colores de módulo
- [ ] 2.4 Implementar la habilitación contextual: "Adaptación curricular" deshabilitada con razón visible sin origen, habilitada y precargada al llegar desde `ver-semana`/`ver-plan` (design D4)
- [ ] 2.5 Verificar que "Evaluación diagnóstica" inicia de forma autónoma desde el catálogo conservando la precarga opcional `from=cnc`
- [x] 2.6 Registrar `crear/index` en `app/_layout.tsx` y enlazarlo desde el ítem "Crear" de la navegación
- [ ] 2.7 Test: los 12 módulos aparecen en `/crear` agrupados en su categoría correcta
- [ ] 2.8 Verificar que los flujos abiertos desde `/crear` arrancan en su estado inicial sin exigir parámetros nuevos (spec `hub-de-creacion`, no-goals)

## 3. Inicio por intención (fase 3)

- [ ] 3.1 Reordenar `app/(tabs)/index.tsx`: identidad de marca + claim, buscador de DCD, bloque "Continuar", CTA "＋ Nueva planificación"
- [ ] 3.2 Eliminar del Home las cuadrículas de áreas EGB/BGU, las tarjetas de módulo (Inicial, Preparatoria, PCA, PCT, BT) y el bloque `false &&` de Bachillerato Técnico
- [ ] 3.3 Implementar el bloque "Continuar" con los planes recientes, navegando al detalle correspondiente por tipo (`ver-plan`, `ver-semana`, `ver-cnc`, etc.)
- [ ] 3.4 Implementar el estado vacío: ocultar "Continuar" cuando no hay planes, sin dejar huecos
- [ ] 3.5 Conectar el CTA "＋ Nueva planificación" a `/crear`
- [ ] 3.6 Retirar el banner de WhatsApp del Home y añadirlo a `app/(tabs)/cuenta.tsx`
- [ ] 3.7 Verificar que el buscador conserva resultados y detalle de destreza tal como hoy
- [ ] 3.8 Test: el Home no renderiza cuadrículas de áreas ni tarjetas de módulo

## 4. Mis planes: solo gestión (fase 4)

- [ ] 4.1 Quitar de `app/(tabs)/planes.tsx` los 6 botones de creación (PCA, PCT, semanal, CxC, Proyecto interdisciplinar) y las secciones `PlanesBTSection`/`PlanesCNCSection`/`PlanesEvaluacionSection` como puntos de creación, conservando sus listados
- [ ] 4.2 Implementar el listado unificado de los 8 tipos de plan con tipo, identificación y fecha de actualización
- [ ] 4.3 Implementar los filtros Todos y Recientes para todos los tipos
- [ ] 4.4 Implementar los filtros "En progreso" y "Completados" solo para tipos con estado, con el mapeo de la tabla de design D5, excluyendo plan diario y semanal
- [ ] 4.5 Implementar la acción "Continuar" por plan navegando a su detalle o formulario
- [ ] 4.6 Implementar "Eliminar" con confirmación (ya existente) moviéndola a la interacción unificada
- [ ] 4.7 Implementar "Editar" visible únicamente en los tipos que admiten reanudación
- [ ] 4.8 Implementar "Duplicar": copia con id nuevo, contenido igual, original intacto, sin cambios de esquema (design D5 y spec `mis-planes-gestion`)
- [ ] 4.9 Implementar el estado vacío que invita a crear desde el hub
- [ ] 4.10 Test: volcado de filtros por tipo (los tipos sin estado no aparecen en "En progreso"/"Completados") y que la duplicación deja el original intacto

## 5. Cierre y verificación (fase 5)

- [ ] 5.1 Retiro final de la tab bar (confirmado el sidebar y el drawer en fases previas, riesgo R1)
- [ ] 5.2 Pulido cromático: sin colores de módulo en navegación, Inicio, `/crear` ni Mis planes; `AREAS_INFO` solo en badges de datos
- [ ] 5.3 Limitar el ancho máximo del área de trabajo dentro del layout con sidebar (riesgo R4)
- [ ] 5.4 `pnpm check` y `pnpm lint` sin errores nuevos sobre la línea base (56 preexistentes)
- [ ] 5.5 `pnpm test` en verde con los tests nuevos
- [ ] 5.6 Actualizar `docs/brand.md` y `design.md` de la raíz: navegación, paleta de navegación y divergencia de las 3 pestañas descritas
- [ ] 5.7 Verificación visual en navegador por el usuario (escritorio, tablet y móvil) antes del merge
