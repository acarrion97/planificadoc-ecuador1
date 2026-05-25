import { PcaFormData, PcaAiResult, AREAS_INFO, SUBNIVEL_NAMES } from "../data/types";
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
 * Genera el HTML en formato oficial MinEduc Ecuador — A4 HORIZONTAL (landscape)
 * Planificación Curricular Anual (PCA) — Currículo Priorizado 2023-2024
 */
export function generarHTMLPca(formData: PcaFormData, aiResult: PcaAiResult): string {
  const areaInfo = AREAS_INFO[formData.area];
  const subnivelName = SUBNIVEL_NAMES[formData.subnivel];
  const areaColor = areaInfo?.color || "#003366";
  const areaName = areaInfo?.name || formData.area;
  const semanasClase = formData.semanasTrabajoTotal - formData.semanasEvaluacion;
  const totalHoras = semanasClase * formData.cargaHorariaSemanal;

  const metodologiasTexto = formData.metodologiasActivas
    .map(m => METODOLOGIA_LABEL[m] || m).join(" · ") || "—";
  const tecnicasTexto = formData.tecnicasEvaluacion
    .map(t => TECNICA_LABEL[t] || t).join(" · ") || "—";
  const ejesTexto = formData.usaEjesTransversales && formData.ejesTransversales.length > 0
    ? formData.ejesTransversales.map(e => EJE_LABEL[e] || e).join(" · ")
    : "No aplica";

  // ── Tabla de unidades didácticas (landscape, columnas anchas) ──────────────
  const aiUnidades = aiResult.unidades || [];

  const unidadesFilas = formData.unidades.map((unidad, idx) => {
    const ai = aiUnidades.find(u => u.numero === unidad.numero) || aiUnidades[idx] || {};
    const titulo = ai.titulo || `Unidad ${unidad.numero}`;

    // DCDs: código + enunciado, una por fila
    const dcdHTML = unidad.dcdsSeleccionadas.length > 0
      ? unidad.dcdsSeleccionadas.map(d =>
          `<div style="margin-bottom:4px;"><span style="font-weight:700;color:${areaColor};">${d.codigo}</span>&nbsp;${d.enunciado}</div>`
        ).join("")
      : "<span style='color:#999;font-style:italic;'>Sin DCD seleccionadas</span>";

    return `
    <tr>
      <td style="${tdBase}text-align:center;font-weight:800;font-size:11px;color:${areaColor};background:#F8FAFC;width:70px;">
        ${unidad.numero}
        <div style="font-size:8px;color:#64748B;font-weight:400;margin-top:2px;">${ai.duracionSemanas || unidad.duracionSemanas || "—"} sem.</div>
      </td>
      <td style="${tdBase}font-weight:700;color:#1E293B;font-size:9px;background:#F8FAFC;">
        ${titulo}
      </td>
      <td style="${tdBase}font-size:8.5px;line-height:1.55;color:#1E293B;">
        ${ai.objetivosEspecificos || "—"}
      </td>
      <td style="${tdBase}font-size:8px;line-height:1.5;">
        ${dcdHTML}
      </td>
      <td style="${tdBase}font-size:8.5px;line-height:1.55;color:#1E293B;">
        ${ai.contenidos || "—"}
      </td>
      <td style="${tdBase}font-size:8.5px;line-height:1.55;color:#1E293B;">
        ${ai.orientacionesMetodologicas || "—"}
      </td>
      <td style="${tdBase}font-size:8.5px;line-height:1.55;color:#1E293B;">
        ${ai.evaluacion || "—"}
      </td>
    </tr>`;
  }).join("");

  const tdBase = "padding:7px 8px;border:1px solid #CBD5E1;vertical-align:top;";
  const thBase = `padding:8px 8px;border:1px solid #CBD5E1;text-align:center;font-size:9px;font-weight:700;color:#fff;background:${areaColor};`;

  // ── Firmas ─────────────────────────────────────────────────────────────────
  const firmas = [
    { label: "ELABORADO POR", nombre: formData.firmaElaboradoPor || formData.docente || "—", fecha: formData.firmaElaboradoFecha || "" },
    { label: "REVISADO POR",  nombre: formData.firmaRevisadoPor  || "—", fecha: formData.firmaRevisadoFecha  || "" },
    { label: "APROBADO POR",  nombre: formData.firmaAprobadoPor  || "—", fecha: formData.firmaAprobadoFecha  || "" },
  ];

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>PCA — ${areaName} — ${formData.grado} — ${formData.anioLectivo}</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 9px;
      color: #1a1a1a;
      background: #fff;
      padding: 12mm 10mm;
    }
    @media print {
      body { padding: 8mm 8mm; }
      @page { size: A4 landscape; margin: 8mm; }
    }
    table { border-collapse: collapse; width: 100%; }
    .section-gap { height: 6px; }
  </style>
</head>
<body>

  <!-- ══════════════════════════════════════════════════════════
       1. ENCABEZADO INSTITUCIONAL
  ══════════════════════════════════════════════════════════ -->
  <table style="margin-bottom:0;">
    <tr>
      <!-- Logo institución -->
      <td style="width:80px;border:1.5px solid #334155;text-align:center;padding:8px 6px;vertical-align:middle;">
        <div style="font-size:28px;line-height:1;">🏫</div>
        <div style="font-size:7px;color:#64748B;margin-top:3px;font-weight:600;">INSTITUCIÓN</div>
      </td>

      <!-- Bloque central: título + datos -->
      <td style="border:1.5px solid #334155;padding:0;vertical-align:top;">
        <!-- Título -->
        <div style="background:${areaColor};color:#fff;text-align:center;padding:7px 10px;">
          <div style="font-size:13px;font-weight:900;letter-spacing:1.5px;">PLANIFICACIÓN CURRICULAR ANUAL</div>
          <div style="font-size:8px;margin-top:2px;opacity:0.85;">Sistema Educativo Ecuatoriano — Currículo Priorizado</div>
        </div>
        <!-- Datos institucionales en tabla interna -->
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:5px 8px;border-right:1px solid #CBD5E1;border-bottom:1px solid #CBD5E1;font-size:8.5px;width:25%;">
              <span style="color:#64748B;font-weight:700;">Institución:</span><br>
              <span style="font-weight:600;">${formData.institucion || "—"}</span>
            </td>
            <td style="padding:5px 8px;border-right:1px solid #CBD5E1;border-bottom:1px solid #CBD5E1;font-size:8.5px;width:25%;">
              <span style="color:#64748B;font-weight:700;">Docente(s):</span><br>
              <span style="font-weight:600;">${formData.docente || "—"}</span>
            </td>
            <td style="padding:5px 8px;border-right:1px solid #CBD5E1;border-bottom:1px solid #CBD5E1;font-size:8.5px;width:25%;">
              <span style="color:#64748B;font-weight:700;">Área / Asignatura:</span><br>
              <span style="font-weight:700;color:${areaColor};">${areaName}</span>
            </td>
            <td style="padding:5px 8px;border-bottom:1px solid #CBD5E1;font-size:8.5px;width:25%;">
              <span style="color:#64748B;font-weight:700;">Subnivel:</span><br>
              <span style="font-weight:600;">${subnivelName}</span>
            </td>
          </tr>
          <tr>
            <td style="padding:5px 8px;border-right:1px solid #CBD5E1;font-size:8.5px;">
              <span style="color:#64748B;font-weight:700;">Grado / Curso:</span><br>
              <span style="font-weight:600;">${formData.grado}</span>
            </td>
            <td style="padding:5px 8px;border-right:1px solid #CBD5E1;font-size:8.5px;">
              <span style="color:#64748B;font-weight:700;">Año Lectivo:</span><br>
              <span style="font-weight:600;">${formData.anioLectivo}</span>
            </td>
            <td style="padding:5px 8px;border-right:1px solid #CBD5E1;font-size:8.5px;">
              <span style="color:#64748B;font-weight:700;">Paralelo:</span><br>
              <span style="font-weight:600;">${formData.paralelo || "—"}</span>
            </td>
            <td style="padding:5px 8px;font-size:8.5px;">
              <span style="color:#64748B;font-weight:700;">Fecha:</span><br>
              <span style="font-weight:600;">${new Date().toLocaleDateString("es-EC")}</span>
            </td>
          </tr>
        </table>
      </td>

      <!-- Logo período -->
      <td style="width:80px;border:1.5px solid #334155;text-align:center;padding:8px 6px;vertical-align:middle;">
        <div style="font-size:28px;line-height:1;">📅</div>
        <div style="font-size:7px;color:#64748B;margin-top:3px;font-weight:600;">PERÍODO</div>
        <div style="font-size:9px;font-weight:800;color:${areaColor};margin-top:2px;">${formData.anioLectivo}</div>
      </td>
    </tr>
  </table>

  <div class="section-gap"></div>

  <!-- ══════════════════════════════════════════════════════════
       2. DISTRIBUCIÓN DEL TIEMPO
  ══════════════════════════════════════════════════════════ -->
  <table>
    <tr style="background:${areaColor};">
      <td colspan="5" style="padding:5px 10px;color:#fff;font-size:9px;font-weight:700;letter-spacing:0.5px;">
        DISTRIBUCIÓN DEL TIEMPO
      </td>
    </tr>
    <tr style="background:#F1F5F9;text-align:center;">
      <td style="padding:6px 8px;border:1px solid #CBD5E1;font-size:8.5px;">
        <div style="color:#64748B;font-weight:700;margin-bottom:2px;">Carga Horaria Semanal</div>
        <div style="font-size:15px;font-weight:800;color:${areaColor};">${formData.cargaHorariaSemanal}<span style="font-size:10px;"> períodos</span></div>
      </td>
      <td style="padding:6px 8px;border:1px solid #CBD5E1;font-size:8.5px;">
        <div style="color:#64748B;font-weight:700;margin-bottom:2px;">Semanas Totales</div>
        <div style="font-size:15px;font-weight:800;color:${areaColor};">${formData.semanasTrabajoTotal}</div>
      </td>
      <td style="padding:6px 8px;border:1px solid #CBD5E1;font-size:8.5px;">
        <div style="color:#64748B;font-weight:700;margin-bottom:2px;">Semanas de Evaluación</div>
        <div style="font-size:15px;font-weight:800;color:${areaColor};">${formData.semanasEvaluacion}</div>
      </td>
      <td style="padding:6px 8px;border:1px solid #CBD5E1;font-size:8.5px;">
        <div style="color:#64748B;font-weight:700;margin-bottom:2px;">Semanas de Clase</div>
        <div style="font-size:15px;font-weight:800;color:${areaColor};">${semanasClase}</div>
      </td>
      <td style="padding:6px 8px;border:1px solid #CBD5E1;font-size:8.5px;">
        <div style="color:#64748B;font-weight:700;margin-bottom:2px;">Total Períodos Anuales</div>
        <div style="font-size:15px;font-weight:800;color:${areaColor};">${totalHoras}</div>
      </td>
    </tr>
  </table>

  <div class="section-gap"></div>

  <!-- ══════════════════════════════════════════════════════════
       3. OBJETIVOS + EJES + METODOLOGÍAS  (3 columnas)
  ══════════════════════════════════════════════════════════ -->
  <table>
    <tr style="background:${areaColor};">
      <td style="padding:5px 10px;color:#fff;font-size:9px;font-weight:700;width:35%;">OBJETIVOS DEL ÁREA — ${areaName.toUpperCase()}</td>
      <td style="padding:5px 10px;color:#fff;font-size:9px;font-weight:700;border-left:1px solid rgba(255,255,255,0.3);width:35%;">OBJETIVOS DEL GRADO / CURSO — ${formData.grado}</td>
      <td style="padding:5px 10px;color:#fff;font-size:9px;font-weight:700;border-left:1px solid rgba(255,255,255,0.3);width:30%;">EJES TRANSVERSALES</td>
    </tr>
    <tr>
      <td style="padding:8px 10px;border:1px solid #CBD5E1;font-size:8.5px;line-height:1.6;vertical-align:top;">
        ${aiResult.objetivosArea || "—"}
      </td>
      <td style="padding:8px 10px;border:1px solid #CBD5E1;font-size:8.5px;line-height:1.6;vertical-align:top;">
        ${aiResult.objetivosGrado || "—"}
      </td>
      <td style="padding:8px 10px;border:1px solid #CBD5E1;font-size:8.5px;line-height:1.7;vertical-align:top;">
        <div style="margin-bottom:6px;">${ejesTexto}</div>
        <div style="border-top:1px solid #E2E8F0;padding-top:6px;margin-top:6px;">
          <span style="color:#64748B;font-weight:700;font-size:8px;">METODOLOGÍAS ACTIVAS</span><br>
          <span style="line-height:1.6;">${metodologiasTexto}</span>
        </div>
        <div style="border-top:1px solid #E2E8F0;padding-top:6px;margin-top:6px;">
          <span style="color:#64748B;font-weight:700;font-size:8px;">TÉCNICAS DE EVALUACIÓN</span><br>
          <span style="line-height:1.6;">${tecnicasTexto}</span>
        </div>
      </td>
    </tr>
  </table>

  <div class="section-gap"></div>

  <!-- ══════════════════════════════════════════════════════════
       4. TABLA DE UNIDADES DIDÁCTICAS (formato landscape)
  ══════════════════════════════════════════════════════════ -->
  <table>
    <tr style="background:${areaColor};">
      <td colspan="7" style="padding:5px 10px;color:#fff;font-size:10px;font-weight:900;letter-spacing:0.5px;">
        UNIDADES DIDÁCTICAS DE PLANIFICACIÓN ANUAL
      </td>
    </tr>
    <tr>
      <th style="${thBase}width:70px;">N.° / SEMANAS</th>
      <th style="${thBase}width:100px;">TÍTULO DE LA UNIDAD</th>
      <th style="${thBase}">OBJETIVOS ESPECÍFICOS</th>
      <th style="${thBase}width:18%;">DESTREZAS CON CRITERIOS DE DESEMPEÑO (DCD)</th>
      <th style="${thBase}">CONTENIDOS / SABERES ESENCIALES</th>
      <th style="${thBase}">ORIENTACIONES METODOLÓGICAS</th>
      <th style="${thBase}">CRITERIOS E INDICADORES DE EVALUACIÓN</th>
    </tr>
    ${unidadesFilas}
  </table>

  <div class="section-gap"></div>

  <!-- ══════════════════════════════════════════════════════════
       5. BIBLIOGRAFÍA + OBSERVACIONES + DUA  (en una fila)
  ══════════════════════════════════════════════════════════ -->
  <table>
    <tr style="background:${areaColor};">
      <td style="padding:5px 10px;color:#fff;font-size:9px;font-weight:700;width:35%;">BIBLIOGRAFÍA Y RECURSOS</td>
      <td style="padding:5px 10px;color:#fff;font-size:9px;font-weight:700;border-left:1px solid rgba(255,255,255,0.3);width:35%;">OBSERVACIONES Y RECOMENDACIONES</td>
      <td style="padding:5px 10px;color:#fff;font-size:9px;font-weight:700;border-left:1px solid rgba(255,255,255,0.3);width:30%;">DISEÑO UNIVERSAL PARA EL APRENDIZAJE (DUA)</td>
    </tr>
    <tr>
      <td style="padding:8px 10px;border:1px solid #CBD5E1;font-size:8px;line-height:1.65;vertical-align:top;">
        ${formData.bibliografiaDocente
          ? `<div style="margin-bottom:4px;font-weight:700;color:#64748B;font-size:7.5px;">DEL DOCENTE</div>${formData.bibliografiaDocente}<br>`
          : ""}
        ${aiResult.bibliografiaSugerida
          ? `<div style="margin-top:6px;margin-bottom:4px;font-weight:700;color:#64748B;font-size:7.5px;">SUGERIDA</div>${aiResult.bibliografiaSugerida}`
          : ""}
        ${!formData.bibliografiaDocente && !aiResult.bibliografiaSugerida ? "—" : ""}
      </td>
      <td style="padding:8px 10px;border:1px solid #CBD5E1;font-size:8.5px;line-height:1.6;vertical-align:top;">
        ${aiResult.observaciones || "—"}
      </td>
      <td style="padding:8px 10px;border:1px solid #CBD5E1;vertical-align:top;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:4px 5px;border:1px solid #E2E8F0;text-align:center;vertical-align:top;width:33%;">
              <div style="background:#EC4899;color:#fff;border-radius:5px;padding:4px 3px;font-size:7.5px;font-weight:700;margin-bottom:4px;">REPRESENTACIÓN</div>
              <div style="font-size:7.5px;color:#374151;line-height:1.4;">Múltiples medios: imágenes, audio, video, texto.</div>
            </td>
            <td style="padding:4px 5px;border:1px solid #E2E8F0;text-align:center;vertical-align:top;width:33%;">
              <div style="background:#1E3A5F;color:#fff;border-radius:5px;padding:4px 3px;font-size:7.5px;font-weight:700;margin-bottom:4px;">ACCIÓN Y EXPRESIÓN</div>
              <div style="font-size:7.5px;color:#374151;line-height:1.4;">Oral, escrito, digital, kinestésico.</div>
            </td>
            <td style="padding:4px 5px;border:1px solid #E2E8F0;text-align:center;vertical-align:top;width:33%;">
              <div style="background:#22C55E;color:#fff;border-radius:5px;padding:4px 3px;font-size:7.5px;font-weight:700;margin-bottom:4px;">IMPLICACIÓN</div>
              <div style="font-size:7.5px;color:#374151;line-height:1.4;">Interés, persistencia y autorregulación.</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

  <div class="section-gap"></div>

  <!-- ══════════════════════════════════════════════════════════
       6. FIRMAS DE APROBACIÓN
  ══════════════════════════════════════════════════════════ -->
  <table>
    ${firmas.map(f => `
      <td style="padding:30px 12px 8px;border:1px solid #CBD5E1;text-align:center;width:33.3%;">
        <div style="border-top:1.5px solid #334155;padding-top:6px;font-size:8.5px;font-weight:700;">${f.nombre}</div>
        ${f.fecha ? `<div style="font-size:7.5px;color:#64748B;margin-top:2px;">${f.fecha}</div>` : ""}
        <div style="font-size:7.5px;color:#94A3B8;margin-top:3px;font-weight:600;">${f.label}</div>
      </td>`
    ).join("")}
  </table>

  <!-- Pie de página -->
  <div style="text-align:center;margin-top:10px;font-size:7px;color:#94A3B8;border-top:1px solid #E2E8F0;padding-top:5px;">
    Generado con PlanificaDoc Ecuador &nbsp;·&nbsp; ${new Date().toLocaleDateString("es-EC")} &nbsp;·&nbsp;
    Ministerio de Educación — Currículo Priorizado 2023-2024
  </div>

</body>
</html>`;
}
