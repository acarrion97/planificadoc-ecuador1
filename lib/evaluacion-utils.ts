/**
 * Utilidades de cálculo del módulo Evaluación Diagnóstica.
 *
 * Núcleo determinista (sin IA): resultado individual, resultado por DCD con
 * umbrales configurables (🟢 Dominado / 🟡 En proceso / 🔴 Requiere refuerzo),
 * brechas del curso y recomendaciones por regla local priorizadas por
 * severidad. Todas las funciones son puras y cubiertas por tests.
 */
import type {
  BrechaCurso,
  EstadoAprendizaje,
  EvaluacionDiagnostica,
  OrigenCurricular,
  PreguntaDiagnostica,
  Recomendacion,
  RespuestaPregunta,
  ResultadoCalculadoEstudiante,
  ResultadoEstudiante,
  UmbralesEvaluacion,
} from "@/data/types-evaluacion";
import type { Subnivel } from "@/data/types";
import { buscarPorCodigo } from "@/data";

/** Umbrales por defecto: dominado ≥ 70, refuerzo < 40. Configurables por evaluación. */
export const UMBRALES_DEFECTO: UmbralesEvaluacion = {
  dominadoMin: 70,
  refuerzoMax: 40,
};

/**
 * Infiere el subnivel educativo desde el grado/curso en texto
 * (ej: "8.° EGB", "3ro EGB", "1.° BGU"). Devuelve null si no puede inferirlo.
 */
/** Normaliza un grado para analizarlo: minúsculas, sin ordinales ni puntuación. */
function normalizarGrado(grado: string): string {
  return grado
    .toLowerCase()
    .replace(/[º°]/g, " ")
    .replace(/[.,]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Indica si el grado corresponde a Bachillerato Técnico, que en el resto de la
 * app existe como *modalidad* (`plan.modalidad === "bt"`) y no como grado.
 *
 * Sirve para distinguir la modalidad de un grado que simplemente no tiene
 * prerrequisito: BT sí tiene nivel (Bachillerato), lo que no tiene todavía es
 * diagnóstico curricular técnico por módulos formativos y resultados de
 * aprendizaje — eso queda fuera de este change.
 */
export function esBachilleratoTecnico(grado: string): boolean {
  const g = normalizarGrado(grado);
  if (!g) return false;
  // "1ro BT" → "1ro bt" · "1ro B.T." → "1ro b t" (los puntos ya son espacios)
  return /\bbt\b/.test(g) || /\bb t\b/.test(g) || /\bt[eé]cnico\b/.test(g);
}

export function subnivelDesdeGrado(grado: string): Subnivel | null {
  const g = normalizarGrado(grado);
  if (!g) return null;
  // Bachillerato Técnico antes del análisis numérico: "1ro BT" contiene un 1 y
  // caería en Preparatoria, que es justo lo contrario de su nivel real.
  if (esBachilleratoTecnico(g)) return 5;
  if (g.includes("bgu") || g.includes("bachillerato") || g.includes("inicial")) {
    return g.includes("inicial") ? -1 : 5;
  }
  const match = g.match(/(\d+)/);
  if (!match) return null;
  const n = Number(match[1]);
  if (Number.isNaN(n)) return null;
  if (n <= 1) return 1;
  if (n <= 4) return 2;
  if (n <= 7) return 3;
  if (n <= 10) return 4;
  return 5;
}

/**
 * Subnivel del **grado anterior** al recibido (ej: 6.° EGB → subnivel de 5.° EGB).
 *
 * No es `subnivelDesdeGrado(grado) - 1`: varios grados comparten subnivel, así que
 * el prerrequisito del diagnóstico se calcula desde el grado, no restando uno al
 * subnivel. Devuelve null cuando no existe un grado anterior dentro del alcance
 * (1.° EGB / Inicial) o cuando el grado no es reconocible.
 */
export function subnivelDelGradoAnterior(grado: string): Subnivel | null {
  const g = normalizarGrado(grado);
  if (!g) return null;
  // Bachillerato Técnico es modalidad, no grado: el 1.° BT proviene de Básica
  // Superior (subnivel 4); 2.° y 3.° BT provienen del BT anterior (subnivel 5).
  if (esBachilleratoTecnico(g)) {
    const n = extraerNumeroGrado(g);
    if (n === null) return null;
    return n <= 1 ? 4 : 5;
  }
  if (g.includes("inicial")) return null;
  // BGU: el 1.° BGU proviene de 10.° EGB (subnivel 4); 2.° y 3.° de BGU (5).
  if (g.includes("bgu") || g.includes("bachillerato")) {
    const n = extraerNumeroGrado(g);
    if (n === null) return null;
    return n <= 1 ? 4 : 5;
  }
  const n = extraerNumeroGrado(g);
  if (n === null) return null;
  // 1.° EGB (Preparatoria) no tiene grado anterior dentro del alcance del módulo.
  if (n <= 1) return null;
  return subnivelDesdeGrado(String(n - 1));
}

function extraerNumeroGrado(g: string): number | null {
  const match = g.match(/(\d+)/);
  if (!match) return null;
  const n = Number(match[1]);
  if (Number.isNaN(n)) return null;
  return n;
}

/** Clasifica un % de logro según umbrales configurables */
export function clasificarAprendizaje(
  porcentajeLogro: number,
  umbrales: UmbralesEvaluacion
): EstadoAprendizaje {
  if (porcentajeLogro >= umbrales.dominadoMin) return "dominado";
  if (porcentajeLogro < umbrales.refuerzoMax) return "requiere_refuerzo";
  return "en_proceso";
}

/** Establece correcta automáticamente para preguntas de opciones (opcion_multiple/v_f) */
export function esRespuestaCorrectaAutomatica(
  pregunta: PreguntaDiagnostica,
  respuestaId: string
): boolean {
  if (pregunta.tipo === "opcion_multiple" || pregunta.tipo === "v_f") {
    return pregunta.opciones?.find((o) => o.id === respuestaId)?.esCorrecta ?? false;
  }
  // respuesta_corta / ejercicio: la correcta la determina el docente al registrar
  return false;
}

function construirBucketsPorDcd(evaluacion: EvaluacionDiagnostica) {
  const map = new Map<
    string,
    { correctas: number; incorrectas: number; sinResponder: number; total: number }
  >();
  for (const dcd of evaluacion.dcdsEvaluadas) {
    map.set(dcd.codigo, { correctas: 0, incorrectas: 0, sinResponder: 0, total: 0 });
  }
  for (const pregunta of evaluacion.preguntas) {
    if (!map.has(pregunta.dcdCodigo)) {
      map.set(pregunta.dcdCodigo, { correctas: 0, incorrectas: 0, sinResponder: 0, total: 0 });
    }
  }
  return map;
}

/**
 * Calcula el resultado individual de un estudiante: puntaje, porcentaje,
 * correctas/incorrectas/sin responder, tiempo y desglose por DCD.
 * Sin responder cuenta como incorrecta para el % de logro por DCD.
 */
export function calcularResultadoEstudiante(
  evaluacion: EvaluacionDiagnostica,
  resultado: ResultadoEstudiante
): ResultadoCalculadoEstudiante {
  const porDcd = construirBucketsPorDcd(evaluacion);
  const respuestasPorPregunta = new Map<string, RespuestaPregunta>(
    resultado.respuestas.map((r) => [r.preguntaId, r])
  );

  let correctas = 0;
  let incorrectas = 0;
  let sinResponder = 0;
  let puntaje = 0;
  const puntajeMaximo = evaluacion.preguntas.reduce((s, p) => s + p.puntaje, 0);

  for (const pregunta of evaluacion.preguntas) {
    const bucket = porDcd.get(pregunta.dcdCodigo)!;
    bucket.total += 1;
    const respuesta = respuestasPorPregunta.get(pregunta.id);
    if (!respuesta) {
      bucket.sinResponder += 1;
      sinResponder += 1;
    } else if (respuesta.correcta) {
      bucket.correctas += 1;
      correctas += 1;
      puntaje += pregunta.puntaje;
    } else {
      bucket.incorrectas += 1;
      incorrectas += 1;
    }
  }

  const porcentaje = puntajeMaximo > 0 ? Math.round((puntaje / puntajeMaximo) * 100) : 0;

  const porDcdArray = Array.from(porDcd.entries()).map(([codigo, b]) => {
    const porcentajeLogro = b.total > 0 ? Math.round((b.correctas / b.total) * 100) : 0;
    return {
      dcdCodigo: codigo,
      totalPreguntas: b.total,
      correctas: b.correctas,
      incorrectas: b.incorrectas,
      sinResponder: b.sinResponder,
      porcentajeLogro,
      estado: clasificarAprendizaje(porcentajeLogro, evaluacion.umbrales),
    };
  });

  const tiempoEmpleado =
    resultado.inicio && resultado.fin
      ? Math.max(
          0,
          Math.round(
            (new Date(resultado.fin).getTime() - new Date(resultado.inicio).getTime()) / 1000
          )
        )
      : 0;

  return {
    estudianteId: resultado.estudianteId,
    puntaje,
    puntajeMaximo,
    porcentaje,
    correctas,
    incorrectas,
    sinResponder,
    tiempoEmpleado,
    porDcd: porDcdArray,
  };
}

/** Estudiantes considerados evaluados: con respuestas registradas */
export function estudiantesEvaluados(evaluacion: EvaluacionDiagnostica) {
  return evaluacion.estudiantes.filter((est) =>
    evaluacion.resultados.some((r) => r.estudianteId === est.id && r.respuestas.length > 0)
  );
}

/**
 * Origen curricular de una DCD respecto del subnivel del curso.
 *
 * Se deriva del catálogo (`buscarPorCodigo`), sin campo declarado ni
 * persistido: `DcdEvaluada` solo guarda el código. Si el código no resuelve
 * —catálogo actualizado, destreza retirada— el origen queda *no determinado*
 * en lugar de caer por defecto en "nivel actual". El % de logro no depende del
 * subnivel, así que ese resultado sigue siendo correcto. Ver design.md D11.
 */
export function origenDeDcd(
  codigo: string,
  subnivelCurso: Subnivel
): { origen: OrigenCurricular; subnivel: Subnivel | null } {
  const destreza = buscarPorCodigo(codigo);
  if (!destreza) return { origen: "no_determinado", subnivel: null };
  // Solo un subnivel estrictamente anterior es arrastre. La UI no ofrece
  // subniveles superiores al del curso, así que el resto es nivel actual.
  const origen: OrigenCurricular =
    destreza.subnivel < subnivelCurso ? "arrastre" : "nivel_actual";
  return { origen, subnivel: destreza.subnivel };
}

export interface BrechasPorOrigen {
  arrastre: BrechaCurso[];
  nivelActual: BrechaCurso[];
  noDeterminado: BrechaCurso[];
  /**
   * Solo tiene sentido agrupar si más de un origen tiene contenido; con un
   * único subnivel evaluado la UI muestra la lista plana, sin grupos vacíos.
   */
  agrupar: boolean;
}

/** Reparte las brechas por origen curricular conservando el orden de prioridad. */
export function agruparBrechasPorOrigen(brechas: BrechaCurso[]): BrechasPorOrigen {
  const arrastre = brechas.filter((b) => b.origen === "arrastre");
  const nivelActual = brechas.filter((b) => b.origen === "nivel_actual");
  const noDeterminado = brechas.filter((b) => b.origen === "no_determinado");
  const gruposConContenido = [arrastre, nivelActual, noDeterminado].filter(
    (g) => g.length > 0
  ).length;
  return { arrastre, nivelActual, noDeterminado, agrupar: gruposConContenido > 1 };
}

/**
 * Agrega las brechas del curso por DCD: cuántos estudiantes dominan / están
 * en proceso / requieren refuerzo, con porcentajes del curso. Ordenadas por
 * prioridad de intervención (más 🔴 primero).
 */
export function calcularBrechasCurso(evaluacion: EvaluacionDiagnostica): BrechaCurso[] {
  const evaluados = estudiantesEvaluados(evaluacion);
  const conteo = new Map<
    string,
    { descripcion: string; dominado: number; enProceso: number; requiereRefuerzo: number }
  >();

  for (const dcd of evaluacion.dcdsEvaluadas) {
    conteo.set(dcd.codigo, {
      descripcion: dcd.descripcion,
      dominado: 0,
      enProceso: 0,
      requiereRefuerzo: 0,
    });
  }

  const resultadosPorEstudiante = new Map<string, ResultadoEstudiante>(
    evaluacion.resultados.map((r) => [r.estudianteId, r])
  );

  for (const est of evaluados) {
    const resultado = resultadosPorEstudiante.get(est.id);
    if (!resultado) continue;
    const calculado = calcularResultadoEstudiante(evaluacion, resultado);
    for (const porDcd of calculado.porDcd) {
      const c = conteo.get(porDcd.dcdCodigo);
      if (!c) continue;
      if (porDcd.estado === "dominado") c.dominado += 1;
      else if (porDcd.estado === "en_proceso") c.enProceso += 1;
      else c.requiereRefuerzo += 1;
    }
  }

  const brechas: BrechaCurso[] = [];
  for (const [codigo, c] of conteo.entries()) {
    const total = evaluados.length;
    if (total === 0) continue;
    const { origen, subnivel: subnivelOrigen } = origenDeDcd(codigo, evaluacion.subnivel);
    brechas.push({
      dcdCodigo: codigo,
      descripcion: c.descripcion,
      origen,
      subnivelOrigen,
      totalEstudiantes: total,
      dominado: c.dominado,
      enProceso: c.enProceso,
      requiereRefuerzo: c.requiereRefuerzo,
      porcentajeDominio: Math.round((c.dominado / total) * 100),
      porcentajeDificultad: Math.round(((c.enProceso + c.requiereRefuerzo) / total) * 100),
      prioridad: 0,
    });
  }

  brechas.sort((a, b) => {
    if (b.requiereRefuerzo !== a.requiereRefuerzo) return b.requiereRefuerzo - a.requiereRefuerzo;
    if (b.enProceso !== a.enProceso) return b.enProceso - a.enProceso;
    return a.dcdCodigo.localeCompare(b.dcdCodigo);
  });
  brechas.forEach((b, i) => (b.prioridad = i + 1));

  return brechas;
}

/**
 * Genera recomendaciones por regla local (determinista, sin IA): por cada DCD
 * con dificultad en el curso, una recomendación anclada a esa destreza.
 * Si no hay brechas, no se genera ninguna recomendación.
 */
export function generarRecomendaciones(evaluacion: EvaluacionDiagnostica): Recomendacion[] {
  const brechas = calcularBrechasCurso(evaluacion);
  const recomendaciones: Recomendacion[] = [];

  for (const brecha of brechas) {
    if (brecha.porcentajeDificultad <= 0) continue;
    const nivel: EstadoAprendizaje =
      brecha.requiereRefuerzo >= brecha.enProceso ? "requiere_refuerzo" : "en_proceso";
    const texto =
      nivel === "requiere_refuerzo"
        ? `Reforzar la destreza "${brecha.descripcion}" antes de abordar aprendizajes que requieren este conocimiento; priorizar actividades de nivelación, práctica guiada y evaluación formativa continua.`
        : `Dar seguimiento a la destreza "${brecha.descripcion}" con actividades de consolidación y refuerzo focalizado para alcanzar el dominio.`;
    recomendaciones.push({
      dcdCodigo: brecha.dcdCodigo,
      dcdDescripcion: brecha.descripcion,
      nivel,
      texto,
      prioridad: brecha.prioridad,
    });
  }

  return recomendaciones;
}