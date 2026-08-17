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
  PreguntaDiagnostica,
  Recomendacion,
  RespuestaPregunta,
  ResultadoCalculadoEstudiante,
  ResultadoEstudiante,
  UmbralesEvaluacion,
} from "@/data/types-evaluacion";

/** Umbrales por defecto: dominado ≥ 70, refuerzo < 40. Configurables por evaluación. */
export const UMBRALES_DEFECTO: UmbralesEvaluacion = {
  dominadoMin: 70,
  refuerzoMax: 40,
};

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
    brechas.push({
      dcdCodigo: codigo,
      descripcion: c.descripcion,
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