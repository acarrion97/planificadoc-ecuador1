## Context

- `data/bachillerato-tecnico.ts` define 34 figuras (`FiguraProfesional.modulos: ModuloFormativo[]`). Los campos de `ModuloFormativoBTExtras` (`categoria`, `nivel`, `duracionPeriodos`, `objetivoModulo`, `resultadosAprendizaje`, `estadoCatalogo`, …) ya existen, pero solo `climatizacion` (9 completos, 1 pendiente) y `actividad-fisica` (3 completos, 5 pendientes) los usan.
- Los códigos de módulo actuales (`GAL.1.1`, `DS.1.1`, …) están guardados en planes: `PlanUnidadTrabajoBT` (`lib/planificaciones-bt-context.tsx`, AsyncStorage) y planes de Conecta Nivela Crea (`server/cnc-router.ts`, `drizzle/schema.ts`), y se resuelven en las exportaciones Word/PDF.
- Fuente: `C:\Users\Lukas\OneDrive\Documentos\planificadoc\figuras profecionales` (95 PDF). Cada figura tiene "Módulos formativos de la figura profesional" y sigue una estructura estable: "1. Objetivo general"; por módulo, "Módulo Genérico Nro. N / Especialización / Práctico Experimental", "Nombre del módulo", "Nivel", "Duración", "Unidad de competencia asociada: UCn: …", "Objetivo del módulo", y la lista "RA n:" / "CEn.m:".

Correspondencia PDF → figura (31 con fuente):

| PDF | Figura |
|---|---|
| curriculo-FIP-al.pdf | gestion-administrativa |
| curriculo-FIP-gestion-financiera-contable.pdf | gestion-financiera |
| curriculo-mrh.pdf | recursos-hidrobiologicos |
| curriculo-pas.pdf | produccion-agropecuaria |
| curriculo-cma.pdf | areas-protegidas |
| curriculo-gads.pdf | gestion-ambiental |
| curriculo-FIP-construccion-oc.pdf | obra-civil |
| curriculo-FIP-iea.pdf | instalaciones-electricas |
| curriculo-fip-ecli.pdf | electromecanica-industrial |
| curriculo-FIP-ema.pdf | electromecanica-automotriz |
| curriculo-elec.pdf | electronica |
| 3modulos-formativos-fem.pdf | fabricacion-madera |
| curriculo-FP-me.pdf | mecatronica |
| 3modulos-formativos-conservacion-y-procesamiento-de-alimentos.pdf | procesamiento-alimentos |
| curriculo-pdc.pdf | produccion-calzado |
| curriculo-FIP-mi.pdf | mecanica-industrial |
| 3.-Modulos-Formativos-de-la-FIP-Ciencia-de-Datos.pdf | ciencia-datos |
| 3.-Modulos-Formativos-de-la-FIP-Desarrollo-de-Software.pdf | desarrollo-software |
| 3-Modulos-Formativos-de-la-FIP-Redes-y-Telecomunicaciones.pdf | redes-telecomunicaciones |
| 3.-Modulos-Formativos-FIP-Seguridad-Informatica.pdf | seguridad-informatica |
| 3.-Modulos-Formativos-de-la-FIP-Soporte-Informatico.pdf | soporte-informatico |
| Modulos-Formativos-de-la-FIP-Gestion-Turistica.pdf | gestion-turistica |
| Modulos-Formativos-de-la-FIP-Hosteleria-y-Arte-Culinario.pdf | hosteleria-culinario |
| 3Modulos-Formativos-de-la-FIP-API.pdf | primera-infancia |
| 3.-Modulos-Formativos-de-la-FIP-Seguridad-Ciudadana.pdf | seguridad-ciudadana |
| 3.-Modulos-Formativos-de-la-FIP-Asistencia-y-Cuidado-a-Grupos-Prioritarios.pdf | grupos-prioritarios |
| curriculo-FIP-ag.pdf | artes-plasticas |
| 3modulos-formativos-de-la-FIP-aesges.pdf | artes-escenicas |
| curriculo-FIP-mg.pdf | musica |
| Modulos-Formativos-de-la-FIP-Diseno-de-Modas.pdf | diseno-modas |
| Modulos-Formativos-de-la-FIP-Diseno-Grafico-y-Multimedia.pdf | diseno-grafico |

Sin PDF de módulos: `climatizacion` (ya transcrita; solo perfil disponible), `actividad-fisica` (solo perfil; 5 módulos pendientes), `gestion-deportiva` y `construcciones-metalicas` (deprecada).

## Goals / Non-Goals

**Goals:**
- Hacer la transcripción reproducible: un script local extrae el contenido y un humano revisa el resultado.
- Que los planes guardados sigan funcionando.

**Non-Goals:**
- EC/CD desde los PDF de "Perfil profesional"/"Análisis funcional" (queda para un cambio posterior).
- Cambios de UX del flujo `planificar-bt` más allá de ocultar los módulos históricos del selector.

## Decisions

1. **Extracción con script local + revisión humana, no a mano ni con IA.** Un script Python (pymupdf) en el scratchpad o en `scripts/bt/` (sin tocar `package.json`) genera un JSON intermedio por figura. Otro paso lo convierte en TS con el mismo formato que ya usa `climatizacion`. Alternativa descartada: transcribir a mano, que no es reproducible y es propensa a errores en ~30 figuras. Se descarta la IA porque la regla del catálogo prohíbe contenido sin respaldo humano.
2. **Códigos de módulo nuevos por figura, con el prefijo que ya usa la figura** (p. ej. `DS.G1`, `DS.E1`, `DS.PE`, o el esquema de `climatizacion` si ya existe uno). Se verifica que no colisionen con los códigos históricos. Alternativa descartada: reutilizar `DS.1.1` para el módulo oficial, porque cambiaría en silencio el contenido de planes guardados.
3. **Módulos históricos**: los módulos anteriores se conservan en la figura con `estadoCatalogo: "historico"` (nuevo valor del union). Los selectores de planes nuevos filtran `historico`, y los resolutores por código (`buscar módulo por código`) siguen encontrándolos. Alternativa descartada: un mapa aparte de códigos legados, que duplicaría la lógica de resolución en los 7 consumidores.
4. **IDs de RA/CE con prefijo de figura** (`DS-RA.1`, `DS-CE1.1`), como en `climatizacion` (`CLI-RA.1`), porque el texto visible conserva la numeración oficial ("RA 1", "CE1.1").
5. **UC** en `data/bachillerato-tecnico-uc.ts` como `UnidadCompetencia` sin `elementosCompetencia`, más `ModuloUnidadCompetencia` para el vínculo.
6. **Informe de verificación** en `openspec/changes/verificar-bt-figuras-profesionales/verificacion.md`: por figura, el PDF usado, el número de módulos, RA y CE, las diferencias con el catálogo anterior y las incidencias (texto cortado por salto de página, numeración irregular del PDF, etc.).

## Risks / Trade-offs

- [El texto del PDF tiene guiones de corte, cabeceras repetidas o tablas partidas entre páginas] → normalizar en el script y revisar el conteo de RA/CE por módulo contra el PDF en el informe.
- [Un PDF trae errores de numeración (CE repetidos o saltos)] → conservar la numeración de la fuente y anotarlo en el informe, sin "corregir" el documento oficial.
- [El archivo `data/bachillerato-tecnico.ts` crece mucho (31 figuras × RA/CE)] → aceptable. Si pasa de ~5 000 líneas, se divide por familia en `data/bt/*.ts` y se reexporta desde el mismo módulo.
- [Un consumidor asume que todos los módulos son seleccionables] → la tarea de auditoría de consumidores revisa cada uno. Las pruebas cubren que un plan con código histórico se resuelva.

## Migration Plan

Sin migración de datos: los planes guardados siguen apuntando a códigos que aún existen (ahora como históricos). Para revertir basta con hacer revert del commit de datos.

## Decisiones fijadas en la implementación

- Códigos de módulo `${SIGLA}.M${n}` (n = orden en el PDF; siglas de `docs/bt-modulos-formativos/HANDOFF.md`). RA `${SIGLA}-M${n}-RA.${k}`, CE `${SIGLA}-M${n}-CE${k}.${j}`, UC `${SIGLA}-UC${n}` (genéricas: `${SIGLA}-UCG${n}`). Los textos visibles conservan la numeración del PDF.
- Los módulos oficiales viven en `data/bt/modulos-oficiales.generated.ts`, generado con `scripts/bt/` (`figuras.py` → `generar_ts.py`). `bachillerato-tecnico.ts` los combina en `FIGURAS_PROFESIONALES` y marca `historico` los módulos previos.
- Se añade `duracionTotalPeriodos` (campo "Duración" del PDF). No se reparte por año porque la malla del PDF no se extrae de forma fiable.
- La unicidad de IDs de RA/CE se exige por módulo: Climatización ya repetía `CLI-RA.n` entre módulos. Los IDs nuevos son además únicos en la figura.
- Música: algunos módulos de especialización declaran nivel "EGB Superior (Octavo…Décimo)". Se conserva el texto y `anio` queda en 1.
- Fidelidad: `scripts/bt/verificar_fidelidad.py` comprueba cada texto contra su PDF. El resultado está en `verificacion.md`.
