import { AREAS_INFO, SUBNIVEL_NAMES } from "../data/types";
import { METODOLOGIAS_ACTIVAS, TECNICAS_EVALUACION } from "../data/secciones-planificacion";
import { EJES_TRANSVERSALES_PCA } from "../data/pca-ejes-transversales";

// Mapas ID → nombre legible
const METODOLOGIA_LABEL: Record<string, string> = Object.fromEntries(
  METODOLOGIAS_ACTIVAS.map(m => [m.id, m.nombre])
);
const TECNICA_LABEL: Record<string, string> = Object.fromEntries(
  TECNICAS_EVALUACION.map(t => [t.id, t.nombre])
);
const EJE_LABEL: Record<string, string> = Object.fromEntries(
  EJES_TRANSVERSALES_PCA.map(e => [e.id, e.nombre])
);

/**
 * Genera el HTML del PCA siguiendo el formato del documento de referencia MinEduc:
 * - A4 landscape
 * - Fuente Arial
 * - Cabeceras de sección: color #DDEFF1 (celeste MinEduc)
 * - Columnas de unidades: N° | Título | Obj. específicos | Destrezas | Orientaciones | Indicador evaluación | Duración
 * - Número de filas de unidades DINÁMICO
 */
export function generarHTMLPca(formData: any, aiResult: any): string {
  const areaInfo      = AREAS_INFO[formData.area as keyof typeof AREAS_INFO];
  const areaName      = areaInfo?.name || formData.area;
  const subnivelName  = SUBNIVEL_NAMES[formData.subnivel as keyof typeof SUBNIVEL_NAMES] || `Subnivel ${formData.subnivel}`;
  const semanasClase  = (formData.semanasTrabajoTotal || 0) - (formData.semanasEvaluacion || 0);
  const totalPeriodos = semanasClase * (formData.cargaHorariaSemanal || 0);

  const ejesTexto = formData.usaEjesTransversales && formData.ejesTransversales?.length > 0
    ? formData.ejesTransversales.map((e: string) => EJE_LABEL[e] || e).join(", ")
    : "No aplica";
  const metodoTexto = (formData.metodologiasActivas || []).map((m: string) => METODOLOGIA_LABEL[m] || m).join(", ") || "—";
  const tecnicaTexto = (formData.tecnicasEvaluacion || []).map((t: string) => TECNICA_LABEL[t] || t).join(", ") || "—";

  const aiUnidades: any[] = aiResult?.unidades || [];

  // Columnas de unidades: % del total (suma ≈ 100%)
  // N°    Título  ObjEsp  Destrezas  Orientaciones  Indicador  Duración
  const COL_PCT = ["5%", "12%", "15%", "15%", "22%", "22%", "9%"];

  const unidadesFilas = (formData.unidades || []).map((unidad: any, idx: number) => {
    const ai = aiUnidades.find((a: any) => a.numero === unidad.numero) || aiUnidades[idx] || {};
    const dcdHTML = (unidad.dcdsSeleccionadas || []).length > 0
      ? (unidad.dcdsSeleccionadas as any[]).map((d: any) =>
          `<div style="margin-bottom:3px;"><b style="color:#1a6b3a;">${d.codigo}</b> ${d.enunciado}</div>`
        ).join("")
      : "<em style='color:#999;'>—</em>";

    return `
    <tr>
      <td style="${TD}text-align:center;font-weight:700;font-size:8px;width:${COL_PCT[0]};">
        ${unidad.numero}<br><span style="font-size:7px;font-weight:400;color:#555;">${ai.duracionSemanas || unidad.duracionSemanas || "—"} sem.</span>
      </td>
      <td style="${TD}font-weight:700;font-size:8px;width:${COL_PCT[1]};">${ai.titulo || `Unidad ${unidad.numero}`}</td>
      <td style="${TD}font-size:8px;line-height:1.5;width:${COL_PCT[2]};">${ai.objetivosEspecificos || "—"}</td>
      <td style="${TD}font-size:7.5px;line-height:1.5;width:${COL_PCT[3]};">${dcdHTML}</td>
      <td style="${TD}font-size:8px;line-height:1.5;width:${COL_PCT[4]};">${ai.orientacionesMetodologicas || "—"}</td>
      <td style="${TD}font-size:8px;line-height:1.5;width:${COL_PCT[5]};">${ai.evaluacion || "—"}</td>
      <td style="${TD}text-align:center;font-size:8px;width:${COL_PCT[6]};">${ai.duracionSemanas || unidad.duracionSemanas || "—"}</td>
    </tr>`;
  }).join("");

  const BORDER = "border:1px solid #AAAAAA;";
  const TD = `padding:5px 6px;${BORDER}vertical-align:top;`;
  const TH = `padding:6px 5px;${BORDER}background:#DDEFF1;font-weight:700;font-size:8px;text-align:center;vertical-align:middle;`;
  const SEC = `padding:5px 8px;${BORDER}background:#DDEFF1;font-weight:700;font-size:8.5px;`;

  const firmas = [
    { rol: "ELABORADO", cargo: "DOCENTE", nombre: formData.firmaElaboradoPor || formData.docente || "—", fecha: formData.firmaElaboradoFecha || "" },
    { rol: "REVISADO",  cargo: "VICERRECTOR", nombre: formData.firmaRevisadoPor || "—",  fecha: formData.firmaRevisadoFecha  || "" },
    { rol: "APROBADO",  cargo: "DIRECTOR",    nombre: formData.firmaAprobadoPor  || "—",  fecha: formData.firmaAprobadoFecha  || "" },
  ];

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>PCA — ${areaName} — ${formData.grado} — ${formData.anioLectivo}</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:Arial,Helvetica,sans-serif; font-size:9px; color:#000; background:#fff; padding:8mm; }
    @media print { body { padding:0; } @page { size:A4 landscape; margin:8mm; } }
    table { border-collapse:collapse; width:100%; table-layout:fixed; }
    td, th { word-wrap:break-word; }
    .gap { height:4px; }
  </style>
</head>
<body>

<!-- ═══ ENCABEZADO ═══ -->
<table style="margin-bottom:0;">
  <colgroup>
    <col style="width:13%">
    <col style="width:62%">
    <col style="width:25%">
  </colgroup>
  <tr>
    <td rowspan="2" style="${BORDER}text-align:center;padding:8px 4px;vertical-align:middle;">
      <div style="font-size:7.5px;font-weight:700;color:#555;">LOGO<br>INSTITUCIONAL</div>
    </td>
    <td style="${BORDER}text-align:center;padding:6px;">
      <div style="font-size:14px;font-weight:900;letter-spacing:1px;">PLAN CURRICULAR ANUAL</div>
    </td>
    <td rowspan="2" style="${BORDER}text-align:center;padding:6px;vertical-align:middle;">
      <div style="font-size:7.5px;font-weight:700;">AÑO LECTIVO</div>
      <div style="font-size:11px;font-weight:900;">${formData.anioLectivo || "—"}</div>
    </td>
  </tr>
  <tr>
    <td style="${BORDER}padding:0;">
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:3px 6px;border-right:1px solid #AAA;font-size:7.5px;width:25%;">
            <b>Área:</b> ${areaName}<br><b>Asignatura:</b> ${areaName}
          </td>
          <td style="padding:3px 6px;border-right:1px solid #AAA;font-size:7.5px;width:35%;">
            <b>Docente(s):</b> ${formData.docente || "—"}
          </td>
          <td style="padding:3px 6px;font-size:7.5px;width:40%;">
            <b>Grado/Curso:</b> ${formData.grado || "—"} — Paralelo ${formData.paralelo || "—"}<br>
            <b>Nivel Educativo:</b> ${subnivelName}
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>

<div class="gap"></div>

<!-- ═══ 2. TIEMPO ═══ -->
<table>
  <tr><td colspan="5" style="${SEC}">2. TIEMPO</td></tr>
  <tr>
    <th style="${TH}" colspan="2">Carga horaria semanal</th>
    <th style="${TH}">No. Semanas de trabajo</th>
    <th style="${TH}" colspan="2">Evaluación del aprendizaje e imprevistos</th>
    <th style="${TH}">Total de semanas de clase</th>
    <th style="${TH}">Total de periodos</th>
  </tr>
  <tr style="text-align:center;">
    <td style="${TD}" colspan="2">${formData.cargaHorariaSemanal || "—"}</td>
    <td style="${TD}">${formData.semanasTrabajoTotal || "—"}</td>
    <td style="${TD}" colspan="2">${formData.semanasEvaluacion || "—"}</td>
    <td style="${TD}">${semanasClase}</td>
    <td style="${TD}">${totalPeriodos}</td>
  </tr>
</table>

<div class="gap"></div>

<!-- ═══ 3. OBJETIVOS GENERALES ═══ -->
<table>
  <tr><td colspan="2" style="${SEC}">3. OBJETIVOS GENERALES</td></tr>
  <tr>
    <td style="${TD}font-size:8px;line-height:1.5;width:50%;">
      <b>Objetivos del área:</b><br>${aiResult?.objetivosArea || "—"}
    </td>
    <td style="${TD}font-size:8px;line-height:1.5;width:50%;">
      <b>Objetivos del grado / curso:</b><br>${aiResult?.objetivosGrado || "—"}
    </td>
  </tr>
</table>

<div class="gap"></div>

<!-- ═══ 4. INSERCIONES CURRICULARES ═══ -->
<table>
  <tr><td style="${SEC}">4. INSERCIONES CURRICULARES</td></tr>
  <tr>
    <td style="${TD}font-size:8px;line-height:1.6;">
      <b>Ejes transversales:</b> ${ejesTexto}<br>
      <b>Metodologías activas:</b> ${metodoTexto}<br>
      <b>Técnicas de evaluación:</b> ${tecnicaTexto}
    </td>
  </tr>
</table>

<div class="gap"></div>

<!-- ═══ 5. UNIDADES DE PLANIFICACIÓN ═══ -->
<table>
  <tr><td colspan="7" style="${SEC}">5. DESARROLLO DE UNIDADES DE PLANIFICACIÓN</td></tr>
  <tr>
    <th style="${TH}width:${COL_PCT[0]};">N.°</th>
    <th style="${TH}width:${COL_PCT[1]};">Título de la unidad de planificación</th>
    <th style="${TH}width:${COL_PCT[2]};">Objetivos específicos de la unidad de planificación</th>
    <th style="${TH}width:${COL_PCT[3]};">Destrezas con criterios de desempeño (DCD)</th>
    <th style="${TH}width:${COL_PCT[4]};">Orientaciones metodológicas</th>
    <th style="${TH}width:${COL_PCT[5]};">Indicador de evaluación</th>
    <th style="${TH}width:${COL_PCT[6]};">Duración en semanas</th>
  </tr>
  ${unidadesFilas}
</table>

<div class="gap"></div>

<!-- ═══ 6. BIBLIOGRAFÍA + 7. OBSERVACIONES ═══ -->
<table>
  <tr>
    <td style="${SEC}width:72%;">6. BIBLIOGRAFÍA / WEBGRAFÍA (Utilizar normas APA VI edición)</td>
    <td style="${SEC}width:28%;">7. OBSERVACIONES</td>
  </tr>
  <tr>
    <td style="${TD}font-size:7.5px;line-height:1.6;vertical-align:top;width:72%;">
      ${formData.bibliografiaDocente ? formData.bibliografiaDocente + "<br><br>" : ""}${aiResult?.bibliografiaSugerida || "—"}
    </td>
    <td style="${TD}font-size:8px;line-height:1.5;vertical-align:top;width:28%;">
      ${aiResult?.observaciones || "—"}
    </td>
  </tr>
</table>

<div class="gap"></div>

<!-- ═══ FIRMAS ═══ -->
<table>
  <tr>
    ${firmas.map(f => `<td style="${BORDER}text-align:center;padding:4px 8px;width:33.33%;"><b style="font-size:8px;">${f.rol}</b></td>`).join("")}
  </tr>
  <tr>
    ${firmas.map(f => `<td style="${BORDER}padding:4px 8px;font-size:7.5px;"><b>${f.cargo}:</b> ${f.nombre}</td>`).join("")}
  </tr>
  <tr>
    ${firmas.map(f => `<td style="${BORDER}padding:20px 8px 6px;font-size:7.5px;">Firma: ___________________________</td>`).join("")}
  </tr>
  <tr>
    ${firmas.map(f => `<td style="${BORDER}padding:4px 8px;font-size:7.5px;">Fecha: ${f.fecha || "___________"}</td>`).join("")}
  </tr>
</table>

</body>
</html>`;
}
