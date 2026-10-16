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

function sectionHeader(label: string, colspan = 6): string {
  return `
    <tr>
      <td colspan="${colspan}" style="background:${COLOR_SECTION};padding:8px 12px;font-weight:bold;color:${COLOR_PRIMARY};font-size:13px;border:1px solid #ccc;">
        ${label}
      </td>
    </tr>`;
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
    indicadores: porGrado?.indicadores.map((i) => i.texto) ?? [],
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
    <p style="margin:6px 0 2px 0;background:${COLOR_HEADER};padding:6px 10px;font-weight:bold;border:1px solid #ccc;">
      ${escapeHtml(area.nombreArea.toUpperCase())}: PROYECTO INTERDISCIPLINARIO — ${escapeHtml(plan.titulo || "")}
    </p>
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
    ${sectionHeader("PLANIFICACIÓN DÍA A DÍA")}
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

  // ── Instrumentos de evaluación ──
  const rubricaDisciplinarHtml = plan.rubricaDisciplinar?.criterios.length
    ? `
    <p style="margin:8px 0 2px 0;background:${COLOR_HEADER};padding:6px 10px;font-weight:bold;border:1px solid #ccc;">
      Instrumento de evaluación disciplinar — ${escapeHtml(plan.rubricaDisciplinar.titulo || "Disciplina")}
    </p>
    <p style="margin:2px 0 6px 0;font-size:9px;">Proyecto: ${escapeHtml(plan.titulo || "—")} · Grado/Curso: ${escapeHtml(gradoBase || "—")} · Técnica: análisis del desempeño · Instrumento: rúbrica analítica</p>
    ${tablaRubricaHtml(plan.rubricaDisciplinar, "Criterio disciplinar", "disciplinar")}`
    : "";

  const rubricaInterdisciplinarHtml = plan.rubricaInterdisciplinar?.criterios.length
    ? `
    <p style="margin:8px 0 2px 0;background:${COLOR_HEADER};padding:6px 10px;font-weight:bold;border:1px solid #ccc;">
      Instrumento de evaluación interdisciplinar — Producto final
    </p>
    <p style="margin:2px 0 6px 0;font-size:9px;">Producto final: ${escapeHtml(plan.productoFinal || "—")} · Técnica: análisis del producto y presentación · Instrumento: rúbrica interdisciplinar · Aplicación: conjunta por el equipo docente</p>
    ${tablaRubricaHtml(plan.rubricaInterdisciplinar, "Criterio interdisciplinar", "interdisciplinar")}
    <p style="margin:2px 0 4px 0;">La rúbrica interdisciplinar es común para el producto final; cada asignatura combina su calificación disciplinar con la calificación común del producto interdisciplinar.</p>
    <p style="margin:2px 0 8px 0;"><strong>Nota final del proyecto en cada asignatura = (calificación disciplinar + calificación interdisciplinar) ÷ 2</strong></p>`
    : "";

  const instrumentosHtml =
    rubricaDisciplinarHtml || rubricaInterdisciplinarHtml
      ? `${sectionHeader("INSTRUMENTOS DE EVALUACIÓN")}${rubricaDisciplinarHtml}${rubricaInterdisciplinarHtml}`
      : `${sectionHeader("INSTRUMENTOS DE EVALUACIÓN")}<tr><td colspan="6">Sin instrumentos de evaluación registrados.</td></tr>`;

  // ── Firmas ──
  const docentes = plan.docentesParticipantes?.length ? plan.docentesParticipantes : ["Docente responsable"];
  const firmasHtml = docentes
    .map((d) => `<td><div class="firma-line"></div><br>${escapeHtml(d)}</td>`)
    .join("");

  // ── Recomendaciones para el docente ──
  const recomendacionesHtml = `
    ${plan.adaptaciones ? `<strong>Adaptaciones / inclusión:</strong> ${escapeHtml(plan.adaptaciones)}<br>` : ""}
    ${plan.observaciones ? `<strong>Observaciones:</strong> ${escapeHtml(plan.observaciones)}<br>` : ""}
    <span class="disclaimer">Este documento se generó a partir de la información registrada por el docente en PlanificaDoc. Es responsabilidad
    del docente validar y ajustar el contenido conforme a las disposiciones específicas de su institución educativa
    y distrito, y verificar la estructura vigente del instructivo oficial de Proyecto Interdisciplinar del
    Ministerio de Educación.</span>`;

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Proyecto Interdisciplinar — ${escapeHtml(plan.institucion || plan.titulo || "PlanificaDoc")}</title>
  <style>
    @page { size: A4 landscape; margin: 8mm; }
    * { margin:0; padding:0; box-sizing:border-box; -webkit-print-color-adjust:exact!important; print-color-adjust:exact!important; }
    body { font-family:Arial,Helvetica,sans-serif; font-size:10px; color:#1A1A1A; padding:8px; }
    table { border-collapse:collapse; width:100%; margin-bottom:8px; }
    td, th { border:1px solid #ccc; padding:5px 8px; vertical-align:top; font-size:10px; }
    .header-row { background:${COLOR_HEADER}; font-weight:bold; }
    .section-label { background:${COLOR_SECTION}; color:${COLOR_PRIMARY}; font-weight:bold; font-size:12px; padding:6px 10px; }
    .firma-row td { text-align:center; padding-top:30px; border:none; }
    .firma-line { border-top:1px solid #333; width:150px; margin:0 auto; }
    .disclaimer { font-size:8px; color:#555; }
  </style>
</head>
<body>
  <table>
    <!-- Encabezado -->
    <tr>
      <td class="header-row" colspan="3">${escapeHtml(plan.institucion || "Unidad Educativa")}</td>
      <td class="header-row" style="text-align:right;" colspan="3">Base curricular: ${baseLabel}</td>
    </tr>
    <tr>
      <td colspan="6" style="text-align:center;font-weight:bold;font-size:13px;background:${COLOR_HEADER};">
        PROYECTO INTERDISCIPLINAR PARA LA EVALUACIÓN SUMATIVA
      </td>
    </tr>

    <!-- Datos informativos -->
    ${sectionHeader("DATOS INFORMATIVOS")}
    <tr>
      <td><strong>Institución educativa:</strong></td><td colspan="2">${escapeHtml(plan.institucion || "—")}</td>
      <td><strong>Año lectivo:</strong></td><td colspan="2">${escapeHtml(plan.anioLectivo || "—")}</td>
    </tr>
    <tr>
      <td><strong>Grado/Curso y paralelo:</strong></td><td colspan="2">${escapeHtml(cursoLabel || "—")}</td>
      <td><strong>Docentes:</strong></td><td colspan="2">${escapeHtml(plan.docentesParticipantes?.join(", ") || "—")}</td>
    </tr>
    <tr>
      <td><strong>Duración:</strong></td><td colspan="2">${escapeHtml(plan.duracion || "—")}</td>
      <td><strong>Trimestre:</strong></td><td colspan="2">${escapeHtml(plan.trimestre || "—")}</td>
    </tr>
    <tr>
      <td><strong>Asignaturas:</strong></td><td colspan="5">${escapeHtml(asignaturas || "—")}</td>
    </tr>

    <!-- Proyecto interdisciplinar -->
    <tr>
      <td colspan="6" style="background:${COLOR_HEADER};font-weight:bold;">
        Proyecto interdisciplinar: ${escapeHtml(plan.titulo || "—")}
      </td>
    </tr>

    <!-- Objetivo del proyecto -->
    ${sectionHeader("OBJETIVO DEL PROYECTO")}
    <tr><td colspan="6">${escapeHtml(plan.objetivoGeneral || "—")}</td></tr>

    <!-- Descripción del proyecto -->
    ${sectionHeader("DESCRIPCIÓN DEL PROYECTO")}
    <tr>
      <td colspan="6">
        ${escapeHtml(plan.contexto || "—")}
        ${plan.objetivosEspecificos?.length ? `<br><strong>Objetivos específicos:</strong><br>${plan.objetivosEspecificos.map((o) => `• ${escapeHtml(o)}`).join("<br>")}` : ""}
        ${plan.metodologia ? `<br><strong>Metodología:</strong> ${escapeHtml(plan.metodologia)}` : ""}
      </td>
    </tr>

    <!-- Desafío / Producto -->
    ${sectionHeader("DESAFÍO")}
    <tr><td colspan="6">${escapeHtml(plan.preguntaGuia || "—")}</td></tr>
    ${sectionHeader("PRODUCTO")}
    <tr><td colspan="6">${escapeHtml(plan.productoFinal || "—")}</td></tr>

    <!-- Planificación del proyecto interdisciplinar -->
    ${sectionHeader("PLANIFICACIÓN DEL PROYECTO INTERDISCIPLINAR")}
    ${headerRow(["Asignatura", elementoLabel, "Indicadores de evaluación", "Saberes declarativos", "Saberes procedimentales", "Saberes actitudinales"])}
    ${planificacionHtml}

    <!-- 5 fases oficiales -->
    ${sectionHeader("FASES DEL PROYECTO INTERDISCIPLINAR")}
    ${headerRow(["Fase", "Pregunta orientadora", "Resultado", "Actividades del proyecto"])}
    ${fasesHtml}

    <!-- Sección por asignatura -->
    ${
      detallePorArea.length
        ? `${sectionHeader("PLANIFICACIÓN POR ASIGNATURA")}${seccionesAsignaturaHtml}`
        : ""
    }

    <!-- Planificación día a día -->
    ${diaPorDiaHtml}

    <!-- Instrumentos de evaluación -->
    ${instrumentosHtml}

    <!-- Evaluación general -->
    ${sectionHeader("EVALUACIÓN GENERAL")}
    <tr><td colspan="6">${escapeHtml(plan.evaluacionGeneral || "—")}</td></tr>

    <!-- Recomendaciones para el docente -->
    ${sectionHeader("RECOMENDACIONES PARA EL DOCENTE")}
    <tr><td colspan="6">${recomendacionesHtml}</td></tr>

    <!-- Firmas -->
    ${sectionHeader("FIRMAS")}
    <tr class="firma-row">
      ${firmasHtml}
    </tr>
  </table>
</body>
</html>`;
}
