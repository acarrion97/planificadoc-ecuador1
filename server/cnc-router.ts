import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { publicProcedure, router } from "./_core/trpc";
import { invokeLLM, repairJson } from "./_core/llm";
import { getDb } from "./db";
import { connectaNivelaCrea } from "../drizzle/schema";
import { obtenerFiguraPorId } from "../data/bachillerato-tecnico";
import { obtenerUnidadesCompetenciaDeModulo } from "../data/bachillerato-tecnico-uc";
import type { ConectaNivelaCreaAiResult } from "../data/types-cnc";
import type { DUAActividad } from "../data/types";
import { subnivelDesdeGrado } from "../lib/evaluacion-utils";
import { textoCalibracionInstrumento, estrategiasMetodologicasPorSubnivel } from "../lib/curriculo-prerrequisitos";

// ─── Zod schemas ──────────────────────────────────────────────────────────────

const DiagnosticoAcademicoSchema = z.object({
  destrezaCodigo: z.string(),
  destrezaDescripcion: z.string(),
  area: z.enum(["LL", "M"]),
  observaciones: z.string(),
  nivelDetectado: z.enum(["logrado", "en_proceso", "iniciado"]),
});

const DiagnosticoSocioemocionalSchema = z.object({
  habilidadId: z.string(),
  observaciones: z.string(),
});

const Semana1Schema = z.object({
  metodologiaDeclarada: z.string().default(""),
  actividadesAdaptacion: z.array(z.string()),
  diagnosticoAcademico: z.array(DiagnosticoAcademicoSchema),
  diagnosticoSocioemocional: z.array(DiagnosticoSocioemocionalSchema),
  coordinacionDece: z.string(),
  tecnicasReflexion: z.array(z.string()),
});

const Semana1BTSchema = z.object({
  reconocimientoEspacios: z.array(z.string()),
  diagnosticoTecnico: z.array(z.object({
    criterioId: z.string(),
    criterioTexto: z.string(),
    observaciones: z.string(),
    nivelDetectado: z.enum(["logrado", "en_proceso", "iniciado"]),
  })),
});

const ParejaConivelacionSchema = z.object({
  id: z.string(),
  estudianteApoyoNombre: z.string(),
  estudianteApoyadoNombre: z.string(),
  destrezaFocoCodigo: z.string(),
  destrezaFocoDescripcion: z.string(),
  notas: z.string().optional(),
});

const ActividadNivelacionSchema = z.object({
  destrezaCodigo: z.string(),
  destrezaDescripcion: z.string(),
  area: z.enum(["LL", "M"]),
  descripcionActividad: z.string(),
  semana: z.union([z.literal(2), z.literal(3)]),
});

const Semana2y3Schema = z.object({
  actividadesNivelacion: z.array(ActividadNivelacionSchema),
  parejasConivelacion: z.array(ParejaConivelacionSchema),
});

const Semana2y3BTSchema = z.object({
  actividadesNivelacionTecnica: z.array(z.object({
    criterioId: z.string(),
    criterioTexto: z.string(),
    descripcionActividad: z.string(),
    semana: z.union([z.literal(2), z.literal(3)]),
    articulacionMatematica: z.string().optional(),
  })),
});

const Semana4y5Schema = z.object({
  titulo: z.string(),
  descripcion: z.string(),
  areasIntegradas: z.array(z.string()),
  notasDocente: z.string().optional(),
  objetivoAprendizaje: z.string().optional(),
  productoFinal: z.string().optional(),
  productoIntermedio: z.string().optional(),
  objetivoSemana4: z.string().optional(),
  objetivoSemana5: z.string().optional(),
  actividadesSemana4: z.array(z.string()).optional(),
  actividadesSemana5: z.array(z.string()).optional(),
  destrezasReforzadas: z.array(z.string()).optional(),
  compromisos: z.string().optional(),
  autoevaluacion: z.array(z.string()).optional(),
});

const Semana4y5BTSchema = z.object({
  tipoProducto: z.enum([
    "maqueta", "software_basico", "plan_negocio", "mantenimiento_equipo",
    "servicio_programa", "evento_presentacion", "material_protocolo", "otro",
  ]),
  descripcion: z.string(),
  actividadesSemana4: z.array(z.string()).optional(),
  actividadesSemana5: z.array(z.string()).optional(),
});

const FormSchema = z.object({
  institucion: z.string(),
  docente: z.string(),
  anioLectivo: z.string(),
  grado: z.string(),
  paralelo: z.string(),
  subnivel: z.string(),
  modalidad: z.enum(["general", "bt"]),
  figuraProfesionalId: z.string().optional(),
  moduloId: z.string().optional(),
  semana1: Semana1Schema,
  semana1BT: Semana1BTSchema.optional(),
  semana2y3: Semana2y3Schema,
  semana2y3BT: Semana2y3BTSchema.optional(),
  semana4y5: Semana4y5Schema,
  semana4y5BT: Semana4y5BTSchema.optional(),
});

/**
 * Instrucción de fusión interdisciplinaria para el proyecto de Semanas 4-5
 * (Crea) — usada TAL CUAL en los dos puntos de generación de esta fase
 * (`generate` y `sugerirProyecto`, el endpoint dedicado a regenerar solo
 * Crea) para que no diverjan y uno no reintroduzca el bug de áreas
 * paralelas después de arreglar el otro. Ver spec.md "Semanas 4-5 project
 * has authentic cross-area articulation, not parallel tracks".
 */
const INSTRUCCION_FUSION_AREAS = `Cuando "areasIntegradas" tenga más de un área (p. ej. Lengua y Literatura + Matemática): el proyecto debe tener una articulación auténtica entre las áreas — "titulo", "descripcion" y "productoFinal" deben describir UNA experiencia/producto compartido en el que ambas áreas se necesiten mutuamente, no un área con la otra apenas mencionada. Esto NO significa que cada actividad individual de "actividadesSemana4"/"actividadesSemana5" tenga que evaluar ambas áreas a la vez — puede haber actividades específicas de un área siempre que visiblemente alimenten el mismo producto/objetivo común. Solo produce pistas totalmente independientes por área (título/producto separados) si el docente lo pide explícitamente.`;

/**
 * Normaliza el DUA por ítem que devuelve la IA (formato compacto {I,R,A})
 * al tipo `DUAActividad` del catálogo, y garantiza que los 3 principios
 * queden cubiertos al menos una vez en el conjunto — mismo mecanismo que
 * `server/topics-router.ts` usa para la planificación de clase (ver spec
 * "DUA is a mandatory principle in Semana 1 activities and instruments").
 * `count` es la longitud del array de texto correspondiente (fuente de
 * verdad de los índices), no la del array `dua` crudo de la IA.
 */
function normalizarDua(raw: unknown, count: number): DUAActividad[] {
  const arr = Array.isArray(raw) ? raw : [];
  const duaActividades: DUAActividad[] = Array.from({ length: count }, (_, i) => {
    const d = (arr[i] as any) || {};
    return { implicacion: !!d.I, representacion: !!d.R, accionExpresion: !!d.A };
  });
  if (duaActividades.length > 0) {
    const last = duaActividades[duaActividades.length - 1];
    if (!duaActividades.some((d) => d.implicacion)) last.implicacion = true;
    if (!duaActividades.some((d) => d.representacion)) last.representacion = true;
    if (!duaActividades.some((d) => d.accionExpresion)) last.accionExpresion = true;
  }
  return duaActividades;
}

// ─── Prompt builder ───────────────────────────────────────────────────────────

function buildPrompt(input: z.infer<typeof FormSchema>): string {
  const esBT = input.modalidad === "bt";

  let contextoBT = "";
  if (esBT && input.figuraProfesionalId && input.moduloId) {
    const figura = obtenerFiguraPorId(input.figuraProfesionalId);
    const modulo = figura?.modulos.find((m) => m.codigo === input.moduloId);
    const ucs = obtenerUnidadesCompetenciaDeModulo(input.moduloId);
    const criteriosReales: string[] = [];
    modulo?.resultadosAprendizaje?.forEach((ra) => {
      criteriosReales.push(ra.texto);
      ra.criteriosEvaluacion.forEach((ce) => criteriosReales.push(`  ${ce.texto}`));
    });
    ucs.forEach((uc) => {
      criteriosReales.push(uc.texto);
      uc.elementosCompetencia?.forEach((ec) => {
        criteriosReales.push(`  ${ec.texto}`);
        ec.criteriosDesempeno.forEach((cd) => criteriosReales.push(`    ${cd.texto}`));
      });
    });

    contextoBT = `
──────────────────────────────────────────────────────────────────
MODALIDAD BACHILLERATO TÉCNICO — Figura Profesional: "${figura?.nombre ?? input.figuraProfesionalId}"
Módulo: "${modulo?.nombre ?? input.moduloId}" — ${modulo?.descripcion ?? ""}

CRITERIOS TÉCNICOS REALES DEL MÓDULO (usa ÚNICAMENTE estos, no inventes otros):
${criteriosReales.length ? criteriosReales.join("\n") : "(sin catálogo técnico transcrito para este módulo — no fabriques criterios; limita el diagnóstico técnico a lo que el docente haya escrito manualmente)"}

REGLAS BT:
- Semana 1: además de la adaptación general, incluye reconocimiento de espacios técnicos (talleres/laboratorios/granjas) y diagnóstico de prerrequisitos técnicos reales tomados EXCLUSIVAMENTE de los criterios listados arriba.
- Semanas 2-3: la nivelación debe reforzar destrezas procedimentales/técnicas del módulo (no solo teoría), articulando cada actividad técnica con el refuerzo de Matemática cuando sea pertinente.
- Semanas 4-5: en vez de un proyecto interdisciplinario genérico, sugiere un "productoAcreditableSugerido" técnico-práctico coherente con la Figura Profesional — nunca un ensayo o cartel genérico. Si la figura es industrial/técnica (construcción, mecánica, electrónica, agropecuaria, TI, etc.), usa maqueta / software básico / plan de negocio inicial / mantenimiento de equipo. Si la figura es de servicio, cuidado o cultura (p. ej. Atención a la Primera Infancia, Asistencia y Cuidado a Grupos Prioritarios, Seguridad Ciudadana, Gestión Cultural, Hostelería, Gestión Turística, Actividad Física y Deporte), usa servicio_programa, evento_presentacion o material_protocolo — nunca fuerces una maqueta o un mantenimiento de equipo donde no corresponde.
──────────────────────────────────────────────────────────────────
`;
  }

  // Calibración curricular de Semana 1 por subnivel REAL (no por texto de grado
  // ni por edad) — no aplica a BT, que se calibra exclusivamente por contextoBT
  // (Figura Profesional/módulo) arriba. Ver lib/curriculo-prerrequisitos.ts.
  const subnivelCurso = esBT ? null : subnivelDesdeGrado(input.grado);
  const estrategias = subnivelCurso !== null ? estrategiasMetodologicasPorSubnivel(subnivelCurso) : null;
  const calibracionInstrumento = subnivelCurso !== null ? textoCalibracionInstrumento(subnivelCurso) : null;

  const calibracionSemana1 = !esBT && (estrategias || calibracionInstrumento) ? `
CALIBRACIÓN CURRICULAR PARA ESTE SUBNIVEL (Semana 1):
${estrategias ? `Estrategias metodológicas respaldadas por los Lineamientos Pedagógicos 2026-2027 para este subnivel (EJEMPLOS orientativos, no una lista cerrada ni obligatoria — puedes proponer otra estrategia coherente con el propósito, el área, la destreza y las características del grupo):
${estrategias.ejemplos.map((e) => `- ${e}`).join("\n")}
(Fuente: ${estrategias.fuente})` : ""}
${calibracionInstrumento ? `\nCalibración del instrumento/evidencia diagnóstica para este subnivel:\n${calibracionInstrumento}` : ""}
` : "";

  const destrezasAcademicas = input.semana1.diagnosticoAcademico
    .map((d) => `- [${d.area}] ${d.destrezaCodigo}: "${d.destrezaDescripcion}" (nivel detectado: ${d.nivelDetectado}) — obs: ${d.observaciones || "(sin observaciones)"}`)
    .join("\n") || "(sin destrezas diagnosticadas aún)";

  const habilidadesSocioemocionales = input.semana1.diagnosticoSocioemocional
    .map((h) => `- ${h.habilidadId}: ${h.observaciones || "(sin observaciones)"}`)
    .join("\n") || "(sin habilidades socioemocionales seleccionadas)";

  const destrezasNivelacion = input.semana2y3.actividadesNivelacion
    .map((a) => `- [${a.area}] ${a.destrezaCodigo}: "${a.destrezaDescripcion}" (semana ${a.semana})`)
    .join("\n") || "(sin destrezas de nivelación seleccionadas aún)";

  const parejas = input.semana2y3.parejasConivelacion
    .map((p) => `- ${p.estudianteApoyoNombre} apoya a ${p.estudianteApoyadoNombre} en "${p.destrezaFocoDescripcion}" (${p.destrezaFocoCodigo})`)
    .join("\n") || "(sin parejas de conivelación registradas aún)";

  return `Eres un experto en el programa "Conecta, Nivela y Crea" del Ministerio de Educación del Ecuador (Lineamientos Pedagógicos, arranque del año escolar — 5 semanas en 3 fases), aplicable a todos los niveles y ofertas del sistema educativo nacional, incluido Bachillerato Técnico.

CONTEXTO DEL DOCUMENTO:
- Institución: ${input.institucion || "(sin especificar)"}
- Docente: ${input.docente || "(sin especificar)"}
- Grado/Curso: ${input.grado} paralelo ${input.paralelo || ""}
- Subnivel: ${input.subnivel}
- Año lectivo: ${input.anioLectivo || ""}
- Modalidad: ${esBT ? "Bachillerato Técnico" : "General (EGB/BGU)"}
${contextoBT}
SEMANA 1 — CONECTA (adaptación + diagnóstico dual académico y socioemocional, coordinado con DECE):
${calibracionSemana1}
Metodología/estrategia pedagógica ya declarada por el docente: ${input.semana1.metodologiaDeclarada || "(vacío — declara una, coherente con el propósito de adaptación e integración al entorno escolar y con la calibración de arriba si existe)"}
Actividades de adaptación ya definidas por el docente: ${input.semana1.actividadesAdaptacion.join(" | ") || "(ninguna aún)"}
Nota de coordinación DECE: ${input.semana1.coordinacionDece || "(sin nota)"}
Técnicas de reflexión: ${input.semana1.tecnicasReflexion.join(" | ") || "(ninguna aún)"}

Diagnóstico académico (destrezas reales de Lengua/Matemática seleccionadas por el docente — NO inventes códigos ni destrezas nuevas):
${destrezasAcademicas}

Diagnóstico socioemocional (habilidades reales del catálogo MinEduc seleccionadas por el docente):
${habilidadesSocioemocionales}

SEMANAS 2-3 — NIVELA (refuerzo focalizado, secuencia diagnóstico → nivelación → solo después avance curricular):
Destrezas de nivelación seleccionadas (usa ÚNICAMENTE estas, no inventes otras):
${destrezasNivelacion}

IMPORTANTE SOBRE LA DISTRIBUCIÓN EN DOS SEMANAS:
- Distribuye las actividades de nivelación ENTRE las DOS semanas: la Semana 2 se enfoca en la base (activación de saberes, repaso estructurado, modelado guiado) y la Semana 3 en la consolidación y la transferencia (práctica independiente, aplicación, cierre).
- Asigna a cada actividad sugerida "semana": 2 o "semana": 3 de modo que SIEMPRE queden actividades en AMBAS semanas (idealmente 2-3 por semana).
- Si el docente ya seleccionó una destreza indicando la semana (p. ej. "semana 3"), respeta esa semana y no la cambies.
- No dejes la Semana 3 vacía: si faltan destrezas para la Semana 3, reparte parte de las listadas hacia ella o propón actividades de consolidación para las mismas destrezas.

Parejas de "co-nivelación" (tutoría entre pares — estudiante más consolidado apoya a un compañero):
${parejas}

SEMANAS 4-5 — CREA (proyecto interdisciplinario que constituye FORMALMENTE una evaluación cualitativa y formativa oficial, no una actividad de cierre opcional):
Título propuesto por el docente: ${input.semana4y5.titulo || "(el docente no propuso título — sugiere uno)"}
Descripción/notas del docente: ${input.semana4y5.descripcion || "(sin notas)"}
Objetivo de aprendizaje propuesto por el docente: ${input.semana4y5.objetivoAprendizaje || "(vacío — sugiere uno)"}
Áreas a integrar sugeridas por el docente: ${input.semana4y5.areasIntegradas.join(", ") || "(ninguna — sugiere áreas coherentes con el diagnóstico)"}
Destrezas a reforzar seleccionadas por el docente: ${input.semana4y5.destrezasReforzadas?.filter(Boolean).length ? input.semana4y5.destrezasReforzadas!.join(", ") : "(vacío — sugiere las destrezas del diagnóstico de Semana 1 que este proyecto debería reforzar)"}
Producto intermedio (Semana 4) propuesto por el docente: ${input.semana4y5.productoIntermedio || "(vacío — sugiere un primer entregable, distinto del producto final)"}
Producto final (Semana 5) propuesto por el docente: ${input.semana4y5.productoFinal || "(vacío — sugiere un producto final concreto)"}
Objetivo de la Semana 4 propuesto por el docente: ${input.semana4y5.objetivoSemana4 || "(vacío — sugiere uno)"}
Actividades de la Semana 4 propuestas por el docente: ${input.semana4y5.actividadesSemana4?.filter(Boolean).length ? input.semana4y5.actividadesSemana4!.join("; ") : "(vacío — sugiere 3-5 actividades de planificación/organización/elaboración)"}
Objetivo de la Semana 5 propuesto por el docente: ${input.semana4y5.objetivoSemana5 || "(vacío — sugiere uno)"}
Actividades de la Semana 5 propuestas por el docente: ${input.semana4y5.actividadesSemana5?.filter(Boolean).length ? input.semana4y5.actividadesSemana5!.join("; ") : "(vacío — sugiere 3-5 actividades de finalización/socialización/reflexión)"}
Compromisos propuestos por el docente: ${input.semana4y5.compromisos || "(vacío — sugiere unos, orientados a la mejora continua cognitiva/procedimental/actitudinal)"}
Preguntas de autoevaluación propuestas por el docente: ${input.semana4y5.autoevaluacion?.filter(Boolean).length ? input.semana4y5.autoevaluacion!.join("; ") : "(vacío — sugiere 2-3 preguntas de metacognición)"}

INSTRUCCIONES IMPORTANTES:
- NO inventes destrezas, códigos curriculares ni criterios técnicos que no estén listados arriba — usa únicamente los proporcionados por el docente${esBT ? " o el catálogo técnico del módulo" : ""}.
- Semana 1 — distingue claramente cuatro cosas distintas, no las mezcles: (1) "metodologiaDeclarada" es la ESTRATEGIA/enfoque pedagógico general (usa como referencia los ejemplos de la calibración curricular de arriba, si existen para este subnivel); (2) "actividadesAdaptacionSugeridas" son las ACTIVIDADES concretas que aplican esa estrategia; (3) "tecnicaDiagnosticoSugerida" es el INSTRUMENTO/evidencia para diagnosticar (calibrado por subnivel arriba, si hay calibración); (4) el array "dua" de cada ítem son los PRINCIPIOS DUA que cubre. "Usar apoyos visuales/pictogramas" NUNCA es una metodología por sí sola — es, cuando corresponda, parte de CÓMO se aplica el principio DUA de Representación dentro de una actividad o instrumento.
- Si el subnivel tiene una calibración curricular (arriba), las estrategias listadas ahí son EJEMPLOS respaldados oficialmente — selecciona la(s) más pertinente(s) según el propósito, el área, la destreza diagnosticada y las características del grupo, o propón otra igualmente coherente con el subnivel; NO las apliques todas ni las trates como una receta fija obligatoria.
- El proyecto/producto de Semanas 4-5 debe derivarse coherentemente del diagnóstico de Semana 1 y reforzar exactamente las destrezas allí listadas.
- ${INSTRUCCION_FUSION_AREAS}
- "productoIntermedio" (entregable de Semana 4) y "productoFinal" (entregable de Semana 5) son DISTINTOS: el intermedio es un avance parcial (borrador, primera versión), el final es el proyecto terminado. No los confundas ni repitas el mismo texto en ambos.
- "objetivoAprendizaje" es único y rector de todo el proyecto; "objetivoSemana4"/"objetivoSemana5" son los logros parciales que aportan a ese objetivo general al término de cada semana — más específicos y acotados que el objetivo de aprendizaje.
- "productoFinal", "productoIntermedio" y las actividades de cada semana: derívalos de las DCD diagnosticadas en Semana 1, las destrezas a reforzar, las áreas integradas y el contexto. Si el docente ya escribió un campo, devuélvelo EXACTAMENTE como está; solo sugiere contenido cuando el campo está vacío.
- "compromisos": una síntesis breve de mejora continua (cognitiva, procedimental, actitudinal) coherente con las destrezas reforzadas — no una lista de tareas pendientes.
- "autoevaluacion": preguntas dirigidas al estudiantado para reflexionar sobre su propio proceso de aprendizaje, no al docente.
- Para cada actividad de nivelación sugerida, incluye "estrategiaConivelacion": una sugerencia concreta de cómo aprovechar tutoría entre pares para esa destreza específica.
- El campo "esEvaluacionFormativaOficial" del proyecto SIEMPRE debe ser true — es un requisito formal del MinEduc, no una opción.
- "cronogramaSemanal": un resumen narrativo de 4-6 oraciones que recorra las 5 semanas, mencionando explícitamente que el proyecto de Semanas 4-5 constituye una evaluación cualitativa formativa oficial.
- "recursosSemana1Sugeridos": 3-5 recursos didácticos concretos (materiales, textos, fichas, recursos digitales) apropiados para las actividades de adaptación y el diagnóstico de la Semana 1.
- "actividadesEvaluativasNivelacionSugeridas": 2-3 actividades evaluativas concretas (técnica + instrumento, ej. "Observación directa con lista de cotejo") para dar seguimiento al progreso durante las Semanas 2-3.
- DUA (Diseño Universal para el Aprendizaje) en Semana 1: para CADA actividad de "actividadesAdaptacionSugeridas" y CADA instrumento de "tecnicaDiagnosticoSugerida", indica en el array paralelo "dua" (mismo índice) qué principios cubre: "I" = Implicación (motiva/involucra), "R" = Representación (presenta la información de múltiples formas — aquí es donde corresponde mencionar apoyo visual/pictográfico si aplica), "A" = Acción y Expresión (permite demostrar el aprendizaje de formas distintas). GARANTIZA que, entre el conjunto de actividades de adaptación, los 3 principios queden cubiertos al menos una vez. CRÍTICO: no incluyas los indicadores DUA dentro del texto de la actividad — van solo en el array "dua" separado.
- Lenguaje pedagógico, concreto y aplicable en el aula ecuatoriana.

Responde ÚNICAMENTE con JSON válido siguiendo EXACTAMENTE este esquema:
{
  "metodologiaDeclaradaSugerida": "string (estrategia/enfoque pedagógico de Semana 1, distinta de las actividades)",
  "actividadesAdaptacionSugeridas": ["string", "string", "string"],
  "duaActividadesAdaptacionSugeridas": [{"I": true, "R": false, "A": true}, {"I": false, "R": true, "A": false}, {"I": true, "R": true, "A": false}],
  "tecnicaDiagnosticoSugerida": ["string", "string"],
  "duaTecnicaDiagnosticoSugerida": [{"I": false, "R": true, "A": true}, {"I": true, "R": false, "A": false}],
  "actividadesNivelacionSugeridas": [
    { "destrezaCodigo": "string", "destrezaDescripcion": "string", "area": "LL o M", "descripcionActividad": "string", "semana": 2, "estrategiaConivelacion": "string" },
    { "destrezaCodigo": "string", "destrezaDescripcion": "string", "area": "LL o M", "descripcionActividad": "string", "semana": 3, "estrategiaConivelacion": "string" }
  ],
  "proyectoSugerido": {
    "titulo": "string",
    "descripcion": "string (3-4 oraciones)",
    "areasIntegradas": ["string", "string"],
    "objetivoAprendizaje": "string (1 oración: el logro rector que persigue todo el proyecto)",
    "productoIntermedio": "string (1 oración: entregable parcial de la Semana 4, distinto del producto final)",
    "productoFinal": "string (1 oración concreta del producto final del proyecto, entregado en Semana 5)",
    "objetivoSemana4": "string (1 oración: logro parcial al término de la Semana 4)",
    "actividadesSemana4": ["string (3-5 actividades: planificación, organización de equipos, investigación, elaboración, revisión)"],
    "objetivoSemana5": "string (1 oración: logro parcial al término de la Semana 5)",
    "actividadesSemana5": ["string (3-5 actividades: finalización, socialización, presentación, reflexión)"],
    "destrezasReforzadas": ["string (códigos del diagnóstico de Semana 1 que este proyecto refuerza)"],
    "evidenciasCognitivas": ["string", "string", "string"],
    "evidenciasActitudinales": ["string", "string", "string"],
    "compromisos": "string (síntesis de mejora continua, no una lista de tareas)",
    "autoevaluacion": ["string (pregunta de metacognición para el estudiantado)", "string"],
    "esEvaluacionFormativaOficial": true
  },
  "cronogramaSemanal": "string",
  "recursosSemana1Sugeridos": ["string", "string", "string"],
  "actividadesEvaluativasNivelacionSugeridas": ["string", "string"]${esBT ? `,
  "diagnosticoTecnicoSugerido": [
    { "criterioId": "string (id real del catálogo)", "criterioTexto": "string (texto real del catálogo)", "observaciones": "string", "nivelDetectado": "iniciado" }
  ],
  "actividadesNivelacionTecnicaSugeridas": [
    { "criterioId": "string", "criterioTexto": "string", "descripcionActividad": "string", "semana": 2, "articulacionMatematica": "string" }
  ],
  "productoAcreditableSugerido": { "tipo": "maqueta|software_basico|plan_negocio|mantenimiento_equipo|servicio_programa|evento_presentacion|material_protocolo|otro (elige el que corresponda a la Figura Profesional, ver REGLAS BT)", "descripcion": "string", "actividadesSemana4": ["string (3-5 actividades de elaboración del producto)"], "actividadesSemana5": ["string (3-5 actividades de presentación/evaluación del producto)"] }` : ""}
}`;
}

// ─── Router ───────────────────────────────────────────────────────────────────

export const cncRouter = router({

  /** Genera el plan "Conecta, Nivela y Crea" con IA y lo guarda en BD (best-effort) */
  generate: publicProcedure
    .input(z.object({
      form: FormSchema,
      sessionId: z.string().min(1),
      existingId: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const prompt = buildPrompt(input.form);

      const raw = await invokeLLM({
        messages: [
          { role: "system", content: "Eres un experto en el programa Conecta, Nivela y Crea del sistema educativo ecuatoriano. Responde siempre con JSON válido." },
          { role: "user", content: prompt },
        ],
        maxTokens: 8000,
        responseFormat: { type: "json_object" },
      });

      const rawContent = raw.choices?.[0]?.message?.content;
      if (!rawContent || typeof rawContent !== "string") {
        throw new Error("Sin respuesta de la IA. Intenta de nuevo.");
      }

      let parsed: any;
      try {
        parsed = JSON.parse(rawContent);
      } catch {
        try {
          parsed = JSON.parse(repairJson(rawContent));
        } catch {
          throw new Error("La IA devolvio una respuesta incompleta. Intenta de nuevo.");
        }
      }

      const aiResult: ConectaNivelaCreaAiResult = {
        ...parsed,
        duaActividadesAdaptacionSugeridas: normalizarDua(
          parsed.duaActividadesAdaptacionSugeridas,
          Array.isArray(parsed.actividadesAdaptacionSugeridas) ? parsed.actividadesAdaptacionSugeridas.length : 0
        ),
        duaTecnicaDiagnosticoSugerida: normalizarDua(
          parsed.duaTecnicaDiagnosticoSugerida,
          Array.isArray(parsed.tecnicaDiagnosticoSugerida) ? parsed.tecnicaDiagnosticoSugerida.length : 0
        ),
      };

      // Intentar guardar en BD (no crítico si falla)
      try {
        const db = await getDb();
        if (db) {
          const row = {
            sessionId: input.sessionId,
            institucion: input.form.institucion || null,
            docente: input.form.docente || null,
            anioLectivo: input.form.anioLectivo || null,
            grado: input.form.grado || null,
            paralelo: input.form.paralelo || null,
            subnivel: input.form.subnivel || null,
            modalidad: input.form.modalidad,
            figuraProfesionalId: input.form.figuraProfesionalId || null,
            moduloId: input.form.moduloId || null,
            form: JSON.stringify(input.form),
            aiResult: JSON.stringify(aiResult),
            status: "generated" as const,
          };

          if (input.existingId) {
            await db.update(connectaNivelaCrea)
              .set(row)
              .where(eq(connectaNivelaCrea.id, input.existingId));
            return { id: input.existingId, aiResult };
          } else {
            const res = await db.insert(connectaNivelaCrea).values(row);
            return { id: (res as any).insertId as number, aiResult };
          }
        }
      } catch (err) {
        console.warn("[cnc] DB save failed (non-critical):", err);
      }

      return { id: null, aiResult };
    }),

  /** Sugiere técnicas de reflexión directa y la nota de coordinación DECE a partir del diagnóstico ya ingresado */
  sugerirReflexionDece: publicProcedure
    .input(z.object({
      diagnosticoAcademico: z.array(DiagnosticoAcademicoSchema),
      diagnosticoSocioemocional: z.array(DiagnosticoSocioemocionalSchema),
    }))
    .mutation(async ({ input }) => {
      const academico = input.diagnosticoAcademico
        .map((d) => `- [${d.area}] ${d.destrezaCodigo}: "${d.destrezaDescripcion}" (${d.nivelDetectado})`)
        .join("\n") || "(sin diagnóstico académico aún)";
      const socioemocional = input.diagnosticoSocioemocional
        .map((h) => `- ${h.habilidadId}`)
        .join("\n") || "(sin habilidades socioemocionales seleccionadas aún)";

      const prompt = `Eres un experto en el programa "Conecta, Nivela y Crea" del MinEduc Ecuador (Semana 1 — diagnóstico dual académico y socioemocional, coordinado con el equipo DECE).

Diagnóstico académico registrado:
${academico}

Habilidades socioemocionales seleccionadas:
${socioemocional}

Genera:
- "tecnicasReflexion": 3-4 técnicas de reflexión directa concretas y aplicables en el aula (ej. preguntas abiertas para indagar saberes previos), coherentes con las destrezas y habilidades listadas arriba.
- "coordinacionDece": 1-2 oraciones de nota de coordinación con el equipo DECE, coherente con las habilidades socioemocionales seleccionadas (o un texto genérico de invitación a coordinar si no hay habilidades seleccionadas).

Responde ÚNICAMENTE con JSON: { "tecnicasReflexion": ["string", "string", "string"], "coordinacionDece": "string" }`;

      const raw = await invokeLLM({
        messages: [
          { role: "system", content: "Eres un experto en el programa Conecta, Nivela y Crea del sistema educativo ecuatoriano. Responde siempre con JSON válido." },
          { role: "user", content: prompt },
        ],
        maxTokens: 1200,
        responseFormat: { type: "json_object" },
      });

      const rawContent = raw.choices?.[0]?.message?.content;
      if (!rawContent || typeof rawContent !== "string") {
        throw new Error("Sin respuesta de la IA. Intenta de nuevo.");
      }
      try {
        return JSON.parse(rawContent) as { tecnicasReflexion: string[]; coordinacionDece: string };
      } catch {
        return JSON.parse(repairJson(rawContent)) as { tecnicasReflexion: string[]; coordinacionDece: string };
      }
    }),

  /** Sugiere la lógica de emparejamiento de conivelación (qué destreza trabajar en cada pareja) — el docente completa los nombres reales */
  sugerirConivelacion: publicProcedure
    .input(z.object({
      actividadesNivelacion: z.array(ActividadNivelacionSchema),
    }))
    .mutation(async ({ input }) => {
      if (!input.actividadesNivelacion.length) {
        return { parejasSugeridas: [] as { destrezaFocoCodigo: string; destrezaFocoDescripcion: string; sugerenciaEnfoque: string }[] };
      }

      const destrezas = input.actividadesNivelacion
        .map((a) => `- [${a.area}] ${a.destrezaCodigo}: "${a.destrezaDescripcion}"`)
        .join("\n");

      const prompt = `Eres un experto en "co-nivelación" (tutoría entre pares) del programa "Conecta, Nivela y Crea" del MinEduc Ecuador.

Destrezas de nivelación seleccionadas por el docente (usa ÚNICAMENTE estas, no inventes otras):
${destrezas}

Para CADA destreza, sugiere una pareja de co-nivelación: no inventes nombres de estudiantes (el docente los completará), solo sugiere el enfoque de la tutoría entre pares para esa destreza específica.

Responde ÚNICAMENTE con JSON: { "parejasSugeridas": [ { "destrezaFocoCodigo": "string", "destrezaFocoDescripcion": "string", "sugerenciaEnfoque": "string (1 oración concreta de cómo el estudiante más consolidado puede apoyar al compañero en esta destreza)" } ] }`;

      const raw = await invokeLLM({
        messages: [
          { role: "system", content: "Eres un experto en el programa Conecta, Nivela y Crea del sistema educativo ecuatoriano. Responde siempre con JSON válido." },
          { role: "user", content: prompt },
        ],
        maxTokens: 1500,
        responseFormat: { type: "json_object" },
      });

      const rawContent = raw.choices?.[0]?.message?.content;
      if (!rawContent || typeof rawContent !== "string") {
        throw new Error("Sin respuesta de la IA. Intenta de nuevo.");
      }
      try {
        return JSON.parse(rawContent) as { parejasSugeridas: { destrezaFocoCodigo: string; destrezaFocoDescripcion: string; sugerenciaEnfoque: string }[] };
      } catch {
        return JSON.parse(repairJson(rawContent)) as { parejasSugeridas: { destrezaFocoCodigo: string; destrezaFocoDescripcion: string; sugerenciaEnfoque: string }[] };
      }
    }),

  /** Sugiere el proyecto/producto de Semanas 4-5 (última fase) con IA antes de generar el plan completo */
  sugerirProyecto: publicProcedure
    .input(z.object({
      modalidad: z.enum(["general", "bt"]),
      grado: z.string(),
      figuraProfesionalId: z.string().optional(),
      moduloId: z.string().optional(),
      diagnosticoAcademico: z.array(DiagnosticoAcademicoSchema),
      actividadesNivelacion: z.array(ActividadNivelacionSchema),
      semana4y5: Semana4y5Schema.optional(),
    }))
    .mutation(async ({ input }) => {
      const esBT = input.modalidad === "bt";

      const destrezasDiag = input.diagnosticoAcademico
        .map((d) => `- [${d.area}] ${d.destrezaCodigo}: "${d.destrezaDescripcion}"`)
        .join("\n") || "(sin diagnóstico académico aún)";
      const destrezasNivelacion = input.actividadesNivelacion
        .map((a) => `- [${a.area}] ${a.destrezaCodigo}: "${a.destrezaDescripcion}" (semana ${a.semana})`)
        .join("\n") || "(sin destrezas de nivelación aún)";

      let contextoBT = "";
      if (esBT && input.figuraProfesionalId && input.moduloId) {
        const figura = obtenerFiguraPorId(input.figuraProfesionalId);
        const modulo = figura?.modulos.find((m) => m.codigo === input.moduloId);
        contextoBT = `- Figura Profesional: "${figura?.nombre ?? input.figuraProfesionalId}" — Módulo: "${modulo?.nombre ?? input.moduloId}". El producto acreditable debe ser técnico-práctico y coherente con la figura: industrial/técnica → maqueta, software básico, plan de negocio inicial o mantenimiento de equipo; de servicio/cuidado/cultura → servicio_programa, evento_presentacion o material_protocolo. Nunca un ensayo o cartel genérico.`;
      }

      const semana = input.semana4y5;
      const prompt = `Eres un experto en el programa "Conecta, Nivela y Crea" del MinEduc Ecuador (Semanas 4-5 — CREA). El proyecto interdisciplinario constituye formalmente una evaluación cualitativa y formativa oficial; debe derivarse coherentemente del diagnóstico de Semana 1 y reforzar las destrezas de nivelación.

Grado/Curso: ${input.grado}
${contextoBT}

Destrezas diagnosticadas en Semana 1 (Lengua/Matemática):
${destrezasDiag}

Destrezas de nivelación de Semanas 2-3:
${destrezasNivelacion}

Lo que el docente ya escribió (devuélvelo EXACTAMENTE si no está vacío; solo sugiere cuando el campo está vacío):
- Título: ${semana?.titulo || "(vacío — sugiere uno)"}
- Descripción: ${semana?.descripcion || "(vacío — sugiere 3-4 oraciones)"}
- Áreas integradas: ${semana?.areasIntegradas?.join(", ") || "(vacío — sugiere áreas coherentes con el diagnóstico, ej. CN, CS, ECA)"}
- Producto final: ${semana?.productoFinal || "(vacío — sugiere un producto final concreto en 1 oración)"}
- Actividades Semana 4: ${semana?.actividadesSemana4?.filter(Boolean).length ? semana!.actividadesSemana4.join("; ") : "(vacío — sugiere 3-5 actividades: planificación, organización de equipos, investigación, elaboración, revisión)"}
- Actividades Semana 5: ${semana?.actividadesSemana5?.filter(Boolean).length ? semana!.actividadesSemana5.join("; ") : "(vacío — sugiere 3-5 actividades: finalización, socialización, presentación, reflexión)"}

${esBT ? "" : INSTRUCCION_FUSION_AREAS}

Responde ÚNICAMENTE con JSON válido:
${esBT
  ? `{ "productoAcreditableSugerido": { "tipo": "maqueta|software_basico|plan_negocio|mantenimiento_equipo|servicio_programa|evento_presentacion|material_protocolo|otro", "descripcion": "string", "actividadesSemana4": ["string (3-5 actividades de elaboración)"], "actividadesSemana5": ["string (3-5 actividades de presentación/evaluación)"] } }`
  : `{ "proyectoSugerido": {
  "titulo": "string",
  "descripcion": "string (3-4 oraciones)",
  "areasIntegradas": ["string", "string"],
  "productoFinal": "string (1 oración concreta)",
  "actividadesSemana4": ["string (3-5 actividades)"],
  "actividadesSemana5": ["string (3-5 actividades)"],
  "destrezasReforzadas": ["string (códigos del diagnóstico)"],
  "evidenciasCognitivas": ["string", "string", "string"],
  "evidenciasActitudinales": ["string", "string", "string"],
  "esEvaluacionFormativaOficial": true
} }`}`;

      const raw = await invokeLLM({
        messages: [
          { role: "system", content: "Eres un experto en el programa Conecta, Nivela y Crea del sistema educativo ecuatoriano. Responde siempre con JSON válido." },
          { role: "user", content: prompt },
        ],
        maxTokens: 3000,
        responseFormat: { type: "json_object" },
      });

      const rawContent = raw.choices?.[0]?.message?.content;
      if (!rawContent || typeof rawContent !== "string") {
        throw new Error("Sin respuesta de la IA. Intenta de nuevo.");
      }
      try {
        return JSON.parse(rawContent);
      } catch {
        return JSON.parse(repairJson(rawContent));
      }
    }),

  /** Lista los planes guardados de una sesión */
  list: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) return [];
        return db
          .select({
            id: connectaNivelaCrea.id,
            institucion: connectaNivelaCrea.institucion,
            grado: connectaNivelaCrea.grado,
            modalidad: connectaNivelaCrea.modalidad,
            status: connectaNivelaCrea.status,
            createdAt: connectaNivelaCrea.createdAt,
          })
          .from(connectaNivelaCrea)
          .where(eq(connectaNivelaCrea.sessionId, input.sessionId))
          .orderBy(desc(connectaNivelaCrea.createdAt))
          .limit(50);
      } catch {
        return [];
      }
    }),
});
