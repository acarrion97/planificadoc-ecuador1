/**
 * Genera HTML para exportación PDF de un Proyecto Interdisciplinar.
 * El HTML se imprime con window.print() en web (mismo patrón que
 * curriculo-competencias-pdf-generator.ts) — no es un PDF binario directo.
 *
 * Mismas secciones y mismo contenido que
 * `proyecto-interdisciplinar-word-generator.ts` (tasks.md 10.3: el PDF debe
 * ser equivalente en contenido al Word): FORMATO OFICIAL "Proyecto
 * Interdisciplinar para la Evaluación Sumativa" del MinEduc — datos
 * informativos, planificación curricular, 5 fases oficiales, sección por
 * asignatura, planificación día a día, rúbricas disciplinar e
 * interdisciplinar con sus fórmulas, recomendaciones y firmas.
 */
import type { AreaProyectoInterdisciplinar, ProyectoInterdisciplinarPlan, BaseCurricular, RubricaProyecto } from "../data/types-proyecto-interdisciplinar";
import { FASES_OFICIALES, normalizarFase, puntajeMaximoRubrica } from "../data/proyecto-interdisciplinar-formato";
import { buscarPorCodigo } from "../data/index";
import { buscarCompetenciaEspecificaEGBBGU } from "../data/competencias-especificas-egb-bgu";

// ── Colores (mismos que el generador Word del módulo) ──
// A diferencia de `docx` (que espera hex sin "#" en sus campos de color),
// el CSS de este generador SÍ necesita el prefijo — sin él, el navegador
// ignora el valor y el color queda transparente/heredado (texto invisible
// en fondos con color de texto blanco, como se vio al verificar visualmente).
const COLOR_PRIMARY = "#0F766E";
const COLOR_SECTION = "#CCFBF1";
const COLOR_HEADER = "#F0FDFA";

/** Título de sección numerado como TEXTO (no como fila de tabla): el formato
 * oficial solo usa tablas en las matrices (planificación curricular, fases,
 * secciones por asignatura, día a día y rúbricas); el resto va numerado en
 * texto corrido. */
function sectionTitleHtml(numero: string, titulo: string): string {
  return `<h2 class="seccion">${numero}. ${escapeHtml(titulo)}</h2>`;
}

/** Línea de texto con etiqueta en negrita y su valor (patrón del formato oficial). */
function lineaDatoHtml(label: string, valor: string | undefined): string {
  return `<p class="dato"><strong>${escapeHtml(label)}:</strong> ${escapeHtml(valor?.trim() || "—")}</p>`;
}

function headerRow(celdas: string[], colspan = 1): string {
  return `<tr class="header-row">${celdas
    .map((c) => `<td${colspan > 1 ? ` colspan="${colspan}"` : ""}>${c}</td>`)
    .join("")}</tr>`;
}

/** Resuelve la descripción de un código contra el catálogo VIGENTE (nunca se copia al guardar). */
function descripcionDeElemento(baseCurricular: BaseCurricular, codigo: string): string {
  if (baseCurricular === "destrezas") {
    return buscarPorCodigo(codigo)?.descripcion || "(no encontrado en el catálogo actual)";
  }
  return buscarCompetenciaEspecificaEGBBGU(codigo)?.descripcion || "(no encontrado en el catálogo actual)";
}

interface SaberesDeElemento {
  indicadores: string[];
  declarativos: string[];
  procedimentales: string[];
  actitudinales: string[];
}

/**
 * Indicadores de evaluación y saberes declarativos/procedimentales/actitudinales
 * de un elemento curricular para el nivel/grado del área. Solo el catálogo de
 * competencias específicas (CNC) trae saberes desagregados por grado; para
 * destrezas solo hay indicadores de evaluación.
 */
function saberesDeElemento(
  baseCurricular: BaseCurricular,
  codigo: string,
  area: AreaProyectoInterdisciplinar
): SaberesDeElemento {
  if (baseCurricular === "destrezas") {
    return {
      indicadores: buscarPorCodigo(codigo)?.indicadoresEvaluacion ?? [],
      declarativos: [],
      procedimentales: [],
      actitudinales: [],
    };
  }
  const ce = buscarCompetenciaEspecificaEGBBGU(codigo);
  const porGrado = ce?.porGrado.find((g) => g.nivel === area.nivel && g.grado === area.grado);
  return {
    // El formato oficial muestra cada indicador precedido de su código.
    indicadores:
      porGrado?.indicadores.map((i) => (i.codigo ? `${i.codigo}. ${i.texto}` : i.texto)) ?? [],
    declarativos: porGrado?.saberes.declarativos ?? [],
    procedimentales: porGrado?.saberes.procedimentales ?? [],
    actitudinales: porGrado?.saberes.actitudinales ?? [],
  };
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function listaHtml(items: string[]): string {
  return items.length ? items.map((i) => escapeHtml(i)).join("<br>") : "—";
}

/** Tabla de rúbrica analítica (Criterio | 4 | 3 | 2 | 1) + línea de puntaje. */
function tablaRubricaHtml(
  rubrica: RubricaProyecto,
  etiqueta: string,
  nombreCalificacion: "disciplinar" | "interdisciplinar"
): string {
  const maximo = puntajeMaximoRubrica(rubrica);
  const filas = rubrica.criterios
    .map(
      (c) => `
        <tr>
          <td><strong>${escapeHtml(c.criterio || "—")}</strong></td>
          <td>${escapeHtml(c.nivel4 || "—")}</td>
          <td>${escapeHtml(c.nivel3 || "—")}</td>
          <td>${escapeHtml(c.nivel2 || "—")}</td>
          <td>${escapeHtml(c.nivel1 || "—")}</td>
        </tr>`
    )
    .join("");

  return `
    <table>
      ${headerRow([
        etiqueta,
        "4 – Logro destacado",
        "3 – Logro esperado",
        "2 – En proceso",
        "1 – Requiere apoyo",
      ])}
      ${filas}
    </table>
    <p style="margin:2px 0 8px 0;"><strong>Puntaje máximo: ${maximo} puntos (4 puntos por criterio).</strong>
    Calificación ${nombreCalificacion} = (puntaje obtenido ÷ ${maximo}) × 10</p>`;
}

export function generarProyectoInterdisciplinarPdf(plan: ProyectoInterdisciplinarPlan): string {
  const baseLabel =
    plan.baseCurricular === "destrezas"
      ? "Destrezas con criterios de desempeño"
      : "Competencias específicas (Currículo Nacional por Competencias)";

  const elementoLabel = plan.baseCurricular === "destrezas" ? "Destreza con criterio de desempeño" : "Competencia específica";
  const asignaturas = Array.from(new Set(plan.areas.map((a) => a.nombreArea))).join(", ");
  const primeraArea = plan.areas[0];
  const gradoBase = primeraArea
    ? `${primeraArea.grado}${primeraArea.subnivel ? ` (${primeraArea.subnivel})` : ` (${primeraArea.nivel})`}`
    : "";
  const cursoLabel = plan.paralelo ? `${gradoBase} — Paralelo ${plan.paralelo}` : gradoBase;

  // ── Planificación del proyecto interdisciplinar ──
  const planificacionHtml = plan.areas.length
    ? plan.areas
        .map((area) => {
          const elementosDeArea = plan.elementosCurriculares.filter((e) => e.areaProyectoId === area.id);
          if (elementosDeArea.length === 0) {
            return `
        <tr>
          <td><strong>${escapeHtml(area.nombreArea)}</strong></td>
          <td colspan="5">Sin elementos curriculares seleccionados.</td>
        </tr>`;
          }
          return elementosDeArea
            .map((e) => {
              const info = saberesDeElemento(plan.baseCurricular, e.codigo, area);
              return `
        <tr>
          <td><strong>${escapeHtml(area.nombreArea)}</strong></td>
          <td>${escapeHtml(`${e.codigo}. ${descripcionDeElemento(plan.baseCurricular, e.codigo)}`)}</td>
          <td>${listaHtml(info.indicadores)}</td>
          <td>${listaHtml(info.declarativos)}</td>
          <td>${listaHtml(info.procedimentales)}</td>
          <td>${listaHtml(info.actitudinales)}</td>
        </tr>`;
            })
            .join("");
        })
        .join("")
    : `<tr><td colspan="6">Sin áreas registradas.</td></tr>`;

  // ── 5 fases oficiales (Fase | Pregunta orientadora | Resultado | Actividades) ──
  const fasesHtml = FASES_OFICIALES.map((f) => {
    const actividadesDeFase = plan.actividades.filter((a) => normalizarFase(a.fase) === f.key);
    const actividadesTexto = actividadesDeFase.length
      ? actividadesDeFase
          .map(
            (a) =>
              `${escapeHtml(a.actividad || "—")}${
                a.evidencia ? `<br><em>Evidencia: ${escapeHtml(a.evidencia)}</em>` : ""
              }${a.evaluacion ? `<br><em>Evaluación: ${escapeHtml(a.evaluacion)}</em>` : ""}${
                a.instrumentoEvaluacion ? `<br><em>Instrumento: ${escapeHtml(a.instrumentoEvaluacion)}</em>` : ""
              }`
          )
          .join("<br>")
      : "—";
    return `
        <tr>
          <td><strong>${escapeHtml(f.label)}</strong></td>
          <td>${escapeHtml(f.preguntaOrientadora)}</td>
          <td>${escapeHtml(f.resultado)}</td>
          <td>${actividadesTexto}</td>
        </tr>`;
  }).join("");

  // ── Sección por asignatura ──
  const detallePorArea = (plan.detalleAreas ?? [])
    .map((d) => ({ detalle: d, area: plan.areas.find((a) => a.id === d.areaProyectoId) }))
    .filter((x): x is { detalle: NonNullable<typeof x.detalle>; area: AreaProyectoInterdisciplinar } => !!x.area);

  const seccionesAsignaturaHtml = detallePorArea.length
    ? detallePorArea
        .map(({ detalle, area }) => {
          const filas = FASES_OFICIALES.map((f) => {
            const bloque = detalle.fases.find((b) => normalizarFase(b.fase) === f.key);
            if (!bloque) return "";
            return `
        <tr>
          <td><strong>${escapeHtml(f.corto)}</strong></td>
          <td>${escapeHtml(bloque.semana || "—")}</td>
          <td>${listaHtml(bloque.actividades)}</td>
          <td>${listaHtml(bloque.recursos)}</td>
        </tr>`;
          }).join("");
          return `
    <p class="subtitulo"><strong>${escapeHtml(area.nombreArea.toUpperCase())}: PROYECTO INTERDISCIPLINARIO — ${escapeHtml(plan.titulo || "")}</strong></p>
    <table>
      ${headerRow(["Fase", "Semana", "Actividades", "Recursos"])}
      ${filas}
    </table>`;
        })
        .join("")
    : "";

  // ── Planificación día a día ──
  const diaPorDiaHtml = plan.diaPorDia?.length
    ? `
    <table>
      ${headerRow(["Fase", "Día", "Fecha", "Actividad diaria paso a paso", "Producto diario específico"])}
      ${plan.diaPorDia
        .map((d) => {
          const fase = FASES_OFICIALES.find((f) => f.key === normalizarFase(d.fase));
          const area = d.areaProyectoId ? plan.areas.find((a) => a.id === d.areaProyectoId) : undefined;
          return `
        <tr>
          <td>${escapeHtml(fase?.corto || "—")}${area ? `<br><em>${escapeHtml(area.nombreArea)}</em>` : ""}</td>
          <td>${escapeHtml(d.dia || "—")}</td>
          <td>${escapeHtml(d.fecha || "—")}</td>
          <td>${escapeHtml(d.actividad || "—")}</td>
          <td>${escapeHtml(d.productoDiario || "—")}</td>
        </tr>`;
        })
        .join("")}
    </table>`
    : "";

  // ── Instrumentos de evaluación (numeración dinámica: N.1 / N.2) ──
  const rubricaDisciplinarHtml = (num: number): string =>
    plan.rubricaDisciplinar?.criterios.length
      ? `
    <p class="subtitulo"><strong>${num}.1 Instrumento de evaluación disciplinar — ${escapeHtml(plan.rubricaDisciplinar.titulo || "Disciplina")}</strong></p>
    <p class="dato">Proyecto: ${escapeHtml(plan.titulo || "—")} · Grado/Curso: ${escapeHtml(gradoBase || "—")} · Técnica: análisis del desempeño · Instrumento: rúbrica analítica</p>
    ${tablaRubricaHtml(plan.rubricaDisciplinar, "Criterio disciplinar", "disciplinar")}`
      : "";

  const rubricaInterdisciplinarHtml = (num: number): string =>
    plan.rubricaInterdisciplinar?.criterios.length
      ? `
    <p class="subtitulo"><strong>${num}.2 Instrumento de evaluación interdisciplinar — Producto final</strong></p>
    <p class="dato">Producto final: ${escapeHtml(plan.productoFinal || "—")} · Técnica: análisis del producto y presentación · Instrumento: rúbrica interdisciplinar · Aplicación: conjunta por el equipo docente</p>
    ${tablaRubricaHtml(plan.rubricaInterdisciplinar, "Criterio interdisciplinar", "interdisciplinar")}
    <p class="texto">La rúbrica interdisciplinar es común para el producto final; cada asignatura combina su calificación disciplinar con la calificación común del producto interdisciplinar.</p>
    <p class="texto"><strong>Nota final del proyecto en cada asignatura = (calificación disciplinar + calificación interdisciplinar) ÷ 2</strong></p>`
      : "";

  const instrumentosHtml = (num: number): string =>
    `<h2 class="seccion">${num}. Instrumentos de evaluación</h2>` +
    (rubricaDisciplinarHtml(num) || rubricaInterdisciplinarHtml(num)
      ? `${rubricaDisciplinarHtml(num)}${rubricaInterdisciplinarHtml(num)}`
      : `<p class="texto">Sin instrumentos de evaluación registrados.</p>`);

  // ── Firmas ──
  const docentes = plan.docentesParticipantes?.length ? plan.docentesParticipantes : ["Docente responsable"];
  const firmasHtml = docentes
    .map((d) => `<td><div class="firma-line"></div><br>${escapeHtml(d)}</td>`)
    .join("");

  // ── Numeración dinámica de secciones (las opcionales se saltan un número):
  //    1 Datos, 2 Proyecto, 3 Planificación, 4 Fases, [5 Asignatura],
  //    [6 Día a día], N Instrumentos, N+1 Evaluación, N+2 Recomendaciones,
  //    N+3 Firmas.
  let numSeccion = 0;
  const sigSeccion = (titulo: string): string => {
    numSeccion += 1;
    return sectionTitleHtml(String(numSeccion), titulo);
  };

  const tituloDatos = sigSeccion("Datos informativos");
  const tituloProyecto = sigSeccion(`Proyecto interdisciplinar: “${plan.titulo || "—"}”`);
  const tituloPlanificacion = sigSeccion("Planificación del proyecto interdisciplinar");
  const tituloFases = sigSeccion("Fases del proyecto interdisciplinar");
  const conAsignatura = detallePorArea.length > 0;
  const conDiaAPorDia = !!plan.diaPorDia?.length;
  const tituloAsignatura = conAsignatura ? sigSeccion("Planificación por asignatura") : "";
  const tituloDiaADia = conDiaAPorDia ? sigSeccion("Planificación día a día") : "";
  // Los instrumentos generan su propio H2 (para compartir el número con N.1/N.2).
  const instrumentos = instrumentosHtml(numSeccion + 1);
  numSeccion += 1;
  const tituloEvaluacion = sigSeccion("Evaluación general");
  const tituloRecomendaciones = sigSeccion("Recomendaciones para el docente");
  const tituloFirmas = sigSeccion("Firmas");

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Proyecto Interdisciplinar — ${escapeHtml(plan.institucion || plan.titulo || "PlanificaDoc")}</title>
  <style>
    @page { size: A4 landscape; margin: 8mm; }
    * { margin:0; padding:0; box-sizing:border-box; -webkit-print-color-adjust:exact!important; print-color-adjust:exact!important; }
    body { font-family:Arial,Helvetica,sans-serif; font-size:14px; color:#1A1A1A; padding:8px; }
    .titulo-doc { text-align:center; font-weight:bold; font-size:18px; margin:2px 0 2px 0; }
    .base-curricular { text-align:center; color:#555; font-size:12px; margin-bottom:10px; }
    h2.seccion { background:${COLOR_SECTION}; color:${COLOR_PRIMARY}; font-weight:bold; font-size:16px; padding:6px 10px; margin:12px 0 6px 0; }
    p.dato { margin:2px 0 2px 14px; }
    p.texto { margin:2px 0 2px 14px; }
    p.subtitulo { margin:8px 0 2px 0; }
    table { border-collapse:collapse; width:100%; margin-bottom:8px; }
    td, th { border:1px solid #ccc; padding:5px 8px; vertical-align:top; font-size:13px; }
    .header-row { background:${COLOR_HEADER}; font-weight:bold; }
    .firma-row td { text-align:center; padding-top:30px; border:none; }
    .firma-line { border-top:1px solid #333; width:150px; margin:0 auto; }
    .disclaimer { font-size:11px; color:#555; }
  </style>
</head>
<body>
  <p class="titulo-doc">PROYECTO INTERDISCIPLINAR PARA LA EVALUACIÓN SUMATIVA</p>
  <p class="base-curricular">Base curricular: ${baseLabel}</p>

  <!-- 1. Datos informativos (texto numerado) -->
  ${tituloDatos}
  ${lineaDatoHtml("Institución educativa", plan.institucion)}
  ${lineaDatoHtml("Año lectivo", plan.anioLectivo)}
  ${lineaDatoHtml("Grado/Curso y paralelo", cursoLabel)}
  ${lineaDatoHtml("Docentes", plan.docentesParticipantes?.join(", "))}
  ${lineaDatoHtml("Duración", plan.duracion)}
  ${lineaDatoHtml("Trimestre", plan.trimestre)}
  ${lineaDatoHtml("Asignaturas", asignaturas)}

  <!-- 2. Proyecto interdisciplinar (2.1–2.4, texto numerado) -->
  ${tituloProyecto}
  ${lineaDatoHtml("2.1. Objetivo del proyecto", plan.objetivoGeneral)}
  ${lineaDatoHtml("2.2. Descripción del proyecto", plan.contexto)}
  ${
    plan.objetivosEspecificos?.length
      ? `<p class="texto"><strong>Objetivos específicos:</strong></p>${plan.objetivosEspecificos
          .map((o) => `<p class="texto">• ${escapeHtml(o)}</p>`)
          .join("")}`
      : ""
  }
  ${plan.metodologia ? lineaDatoHtml("Metodología", plan.metodologia) : ""}
  ${lineaDatoHtml("2.3. Desafío", plan.preguntaGuia)}
  ${lineaDatoHtml("2.4. Producto", plan.productoFinal)}

  <!-- 3. Planificación del proyecto interdisciplinar (tabla) -->
  ${tituloPlanificacion}
  <table>
    ${headerRow(["Asignatura", elementoLabel, "Indicadores de evaluación", "Saberes declarativos", "Saberes procedimentales", "Saberes actitudinales"])}
    ${planificacionHtml}
  </table>

  <!-- 4. Fases oficiales (tabla) -->
  ${tituloFases}
  <table>
    ${headerRow(["Fase", "Pregunta orientadora", "Resultado", "Actividades del proyecto"])}
    ${fasesHtml}
  </table>

  <!-- Planificación por asignatura (opcional) -->
  ${conAsignatura ? `${tituloAsignatura}${seccionesAsignaturaHtml}` : ""}

  <!-- Planificación día a día (opcional) -->
  ${conDiaAPorDia ? `${tituloDiaADia}${diaPorDiaHtml}` : ""}

  <!-- Instrumentos de evaluación (rúbricas con fórmulas) -->
  ${instrumentos}

  <!-- Evaluación general -->
  ${tituloEvaluacion}
  <p class="texto">${escapeHtml(plan.evaluacionGeneral || "—")}</p>

  <!-- Recomendaciones para el docente -->
  ${tituloRecomendaciones}
  ${plan.adaptaciones ? `<p class="dato"><strong>Adaptaciones / inclusión:</strong> ${escapeHtml(plan.adaptaciones)}</p>` : ""}
  ${plan.observaciones ? `<p class="dato"><strong>Observaciones:</strong> ${escapeHtml(plan.observaciones)}</p>` : ""}
  <p class="texto disclaimer">Este documento se generó a partir de la información registrada por el docente en PlanificaDoc. Es responsabilidad
    del docente validar y ajustar el contenido conforme a las disposiciones específicas de su institución educativa
    y distrito, y verificar la estructura vigente del instructivo oficial de Proyecto Interdisciplinar del
    Ministerio de Educación.</p>

  <!-- Firmas (tabla de firmas) -->
  ${tituloFirmas}
  <table>
    <tr class="firma-row">
      ${firmasHtml}
    </tr>
  </table>
</body>
</html>`;
}
