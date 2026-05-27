import { Planificacion, AREAS_INFO, SUBNIVEL_NAMES } from "../data/types";
import { INSERCIONES_CURRICULARES } from "../data/inserciones-curriculares";
import { COMPETENCIAS, METODOLOGIAS_ACTIVAS, TECNICAS_EVALUACION, ESTILOS_APRENDIZAJE } from "../data/secciones-planificacion";
import { HABILIDADES_SOCIOEMOCIONALES } from "../data/habilidades-socioemocionales";

/**
 * Genera el HTML con formato oficial del Ministerio de Educación de Ecuador 2026-2027
 * Planificación Microcurricular por Trimestre
 */
export function generarHTMLPlanificacion(plan: Planificacion): string {
  const areaInfo = AREAS_INFO[plan.destreza.area];
  const subnivelName = SUBNIVEL_NAMES[plan.destreza.subnivel];
  const isEFL = plan.destreza.area === "EFL";
  const fechaFormateada = new Date(plan.createdAt).toLocaleDateString(isEFL ? "en-US" : "es-EC", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Competencias como iconos/badges
  const competenciasBadgesHTML = (() => {
    if (!plan.competencias || plan.competencias.length === 0) return "";
    const badgeMap: Record<string, { label: string; color: string }> = {
      matematicas: { label: "CM", color: "#7C3AED" },
      comunicacionales: { label: "C", color: "#059669" },
      digitales: { label: "CD", color: "#2563EB" },
      socioemocionales: { label: "CS", color: "#DC2626" },
    };
    return plan.competencias.map((id: string) => {
      const badge = badgeMap[id];
      if (!badge) return "";
      return `<span style="display:inline-block;background:${badge.color};color:white;font-size:7px;font-weight:bold;padding:1px 4px;border-radius:3px;margin-right:3px;">${badge.label}</span>`;
    }).join("");
  })();

  // Habilidades socioemocionales
  const habHTML = (() => {
    const ids = plan.habilidadesSocioemocionales || [];
    if (ids.length === 0) return isEFL ? "Not specified" : "No especificadas";
    return '<ul style="margin:0;padding-left:16px;">' + ids.map(id => {
      const hab = HABILIDADES_SOCIOEMOCIONALES.find(h => h.id === id);
      return hab ? `<li>${isEFL ? hab.nameEN : hab.nombre}</li>` : "";
    }).filter(Boolean).join("") + "</ul>";
  })();

  // Estilos de aprendizaje con porcentajes
  const estilosPctHTML = (() => {
    const pct = plan.estilosAprendizajePorcentaje;
    if (!pct) return "";
    return `
      <tr>
        <td style="width:25%;font-weight:bold;font-size:8.5px;">VISUAL: ${pct.visual}%</td>
        <td style="width:25%;font-weight:bold;font-size:8.5px;">AUDITIVO: ${pct.auditivo}%</td>
        <td style="width:25%;font-weight:bold;font-size:8.5px;">LECTOR-ESCRITOR: ${pct.lectorEscritor}%</td>
        <td style="width:25%;font-weight:bold;font-size:8.5px;">KINESTÉSICO: ${pct.kinestesico}%</td>
      </tr>
    `;
  })();

  // Construir las actividades ERCA con DUA squares
  let actividadesHTML = "";
  if (plan.temaSeleccionado?.estructura) {
    const est = plan.temaSeleccionado.estructura;
    const fases = [
      { key: "experiencia" as const, label: isEFL ? "EXPERIENCE" : "EXPERIENCIA", cssClass: "experiencia" },
      { key: "reflexion" as const, label: isEFL ? "REFLECTION" : "REFLEXIÓN", cssClass: "reflexion" },
      { key: "conceptualizacion" as const, label: isEFL ? "CONCEPTUALIZATION" : "CONCEPTUALIZACIÓN", cssClass: "conceptualizacion" },
      { key: "aplicacion" as const, label: isEFL ? "APPLICATION" : "APLICACIÓN", cssClass: "aplicacion" },
    ];

    actividadesHTML = fases.map(fase => {
      const data = est[fase.key];
      if (!data) return "";
      const actividades = data.actividades || [];
      const duaActividades = data.duaActividades || [];

      const actItems = actividades.map((act: string, idx: number) => {
        const dua = duaActividades[idx] || { representacion: false, accionExpresion: false, implicacion: false };
        // Limpiar texto: remover indicadores DUA del texto
        const cleanAct = act
          .replace(/\s*\(\s*I\s*:\s*(true|false)\s*,\s*R\s*:\s*(true|false)\s*,\s*A\s*:\s*(true|false)\s*\)\s*/gi, "")
          .replace(/\s*\[\s*I\s*:\s*(true|false)\s*,\s*R\s*:\s*(true|false)\s*,\s*A\s*:\s*(true|false)\s*\]\s*/gi, "")
          .replace(/\s*DUA\s*:\s*\{[^}]*\}\s*/gi, "")
          .replace(/\s*\(DUA[^)]*\)\s*/gi, "")
          .trim();
        const squares = `
          <span class="dua-sq" style="background:${dua.representacion ? '#EC4899' : '#EC489940'};"></span>
          <span class="dua-sq" style="background:${dua.accionExpresion ? '#1E3A5F' : '#1E3A5F40'};"></span>
          <span class="dua-sq" style="background:${dua.implicacion ? '#22C55E' : '#22C55E40'};"></span>
        `;
        return `<li>${idx + 1}. ${cleanAct} ${squares}</li>`;
      }).join("");

      return `
        <div class="fase">
          <div class="fase-header ${fase.cssClass}">${fase.label} (${data.duracion})</div>
          <div class="fase-label">${isEFL ? "Activities:" : "Actividades:"}</div>
          <ul>${actItems}</ul>
        </div>
      `;
    }).join("");
  } else {
    actividadesHTML = `<p>${plan.actividades || (isEFL ? "Not specified" : "No especificadas")}</p>`;
  }

  // Recursos
  const recursosTexto = plan.temaSeleccionado?.recursos
    ? plan.temaSeleccionado.recursos.join(", ")
    : plan.recursos || (isEFL ? "Not specified" : "No especificados");

  // Evaluación
  const evaluacionTexto = plan.temaSeleccionado?.evaluacionFormativa
    ? plan.temaSeleccionado.evaluacionFormativa
    : plan.evaluacion || (isEFL ? "Not specified" : "No especificada");

  // Indicadores de evaluación
  const indicadoresHTML = plan.destreza.indicadoresEvaluacion
    .map((ind) => `<li>${ind}</li>`)
    .join("");

  // Criterios de evaluación
  const criteriosHTML = plan.destreza.criteriosEvaluacion
    .map((crit) => `<li>${crit}</li>`)
    .join("");

  // Objetivos
  const objetivosHTML = plan.destreza.objetivos
    .map((obj) => `<li>${obj}</li>`)
    .join("");

  // Inserciones curriculares
  const insercionesHTML = (() => {
    const ids = plan.insercionesCurriculares || (plan.insercionCurricular ? [plan.insercionCurricular] : []);
    if (ids.length === 0) return isEFL ? "Not specified" : "No especificadas";
    return '<ul style="margin:0;padding-left:16px;">' + ids.map((id: string) => {
      const ins = INSERCIONES_CURRICULARES.find(i => i.id === id);
      return ins ? `<li>${isEFL ? ins.nameEN : ins.nombreCorto}</li>` : '';
    }).join('') + '</ul>';
  })();

  // Competencias
  const competenciasHTML = (() => {
    if (!plan.competencias || plan.competencias.length === 0) return "";
    return '<ul style="margin:0;padding-left:16px;">' + plan.competencias.map((id: string) => {
      const comp = COMPETENCIAS.find(c => c.id === id);
      return comp ? `<li>${isEFL ? comp.nameEN : comp.nombre}</li>` : '';
    }).join('') + '</ul>';
  })();

  // Metodologías activas
  const metodologiasHTML = (() => {
    if (!plan.metodologiasActivas || plan.metodologiasActivas.length === 0) return "";
    return '<ul style="margin:0;padding-left:16px;">' + plan.metodologiasActivas.map((id: string) => {
      const met = METODOLOGIAS_ACTIVAS.find(m => m.id === id);
      return met ? `<li>${isEFL ? met.nameEN : met.nombre}</li>` : '';
    }).join('') + '</ul>';
  })();

  return `<!DOCTYPE html>
<html lang="${isEFL ? 'en' : 'es'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isEFL ? "Microcurricular Lesson Plan" : "Planificación Microcurricular"} - ${plan.destreza.codigo}</title>
  <style>
    @page {
      size: A4 landscape;
      margin: 10mm 8mm 10mm 8mm;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 9px;
      color: #1a1a1a;
      line-height: 1.35;
      background: #fff;
    }

    /* ===== ENCABEZADO ===== */
    .header-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 6px;
    }

    .sello {
      font-size: 9px;
      font-weight: bold;
      color: #003366;
      border: 1px solid #003366;
      padding: 4px 8px;
      text-transform: uppercase;
    }

    .institucion-nombre {
      text-align: center;
      font-size: 12px;
      font-weight: bold;
      color: #003366;
      text-transform: uppercase;
    }

    .anio-lectivo {
      font-size: 11px;
      font-weight: bold;
      color: #003366;
    }

    /* ===== TÍTULO PRINCIPAL ===== */
    .titulo-principal {
      background: #D4A5C7;
      color: #1a1a1a;
      text-align: center;
      padding: 5px 10px;
      font-size: 10px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
      border: 1px solid #999;
    }

    /* ===== SECCIÓN TÍTULOS ===== */
    .seccion-titulo {
      background: #D4A5C7;
      color: #1a1a1a;
      padding: 3px 8px;
      font-size: 9px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      margin-bottom: 0;
      border: 1px solid #999;
      border-bottom: none;
    }

    /* ===== TABLAS ===== */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 6px;
    }

    table td, table th {
      border: 1px solid #666;
      padding: 3px 5px;
      font-size: 8.5px;
      vertical-align: top;
    }

    table th {
      background: #D4A5C7;
      color: #1a1a1a;
      font-weight: bold;
      text-align: center;
      font-size: 8px;
      text-transform: uppercase;
      padding: 4px 3px;
    }

    .label {
      background: #F5E6F0;
      font-weight: bold;
      color: #1a3c5e;
      font-size: 8px;
    }

    .value {
      font-size: 8.5px;
      color: #1a1a1a;
    }

    /* ===== TABLA PRINCIPAL ===== */
    .tabla-principal th {
      background: #D4A5C7;
      color: #1a1a1a;
      font-size: 7.5px;
      padding: 5px 3px;
      text-transform: uppercase;
    }

    .tabla-principal td {
      font-size: 8.5px;
      padding: 5px;
    }

    .col-destreza { width: 20%; }
    .col-indicadores { width: 18%; }
    .col-estrategias { width: 32%; }
    .col-recursos { width: 12%; }
    .col-evaluacion { width: 18%; }

    /* ===== FASES ERCA ===== */
    .fase {
      margin-bottom: 5px;
    }

    .fase-header {
      font-weight: bold;
      font-size: 8px;
      padding: 2px 5px;
      margin-bottom: 2px;
      border-radius: 2px;
      color: white;
    }

    .fase-header.experiencia { background: #2980b9; }
    .fase-header.reflexion { background: #8e44ad; }
    .fase-header.conceptualizacion { background: #27ae60; }
    .fase-header.aplicacion { background: #e67e22; }

    .fase-label {
      font-size: 8px;
      font-weight: bold;
      color: #333;
      margin-bottom: 2px;
    }

    ul {
      padding-left: 12px;
      margin: 2px 0;
      list-style: none;
    }

    li {
      font-size: 8px;
      margin-bottom: 2px;
      line-height: 1.3;
      position: relative;
    }

    /* ===== DUA SQUARES ===== */
    .dua-sq {
      display: inline-block;
      width: 10px;
      height: 10px;
      margin-left: 2px;
      vertical-align: middle;
      border-radius: 1px;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    .dua-legend {
      font-size: 7.5px;
      margin-bottom: 4px;
      padding: 3px 6px;
      background: #f9f9f9;
      border: 1px solid #ddd;
      border-radius: 2px;
    }

    .dua-legend-item {
      display: inline-block;
      margin-right: 10px;
    }

    .dua-legend-sq {
      display: inline-block;
      width: 10px;
      height: 10px;
      vertical-align: middle;
      margin-right: 3px;
      border-radius: 1px;
    }

    /* ===== PRINCIPIOS DUA BOX ===== */
    .dua-principios-box {
      border: 1px solid #666;
      margin-bottom: 6px;
    }

    .dua-principio-row {
      padding: 3px 6px;
      border-bottom: 1px solid #ddd;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .dua-principio-row:last-child {
      border-bottom: none;
    }

    .dua-principio-text {
      font-size: 8.5px;
      flex: 1;
    }

    .dua-box-sq {
      width: 14px;
      height: 14px;
      border-radius: 2px;
      display: inline-block;
    }

    /* ===== ESTILOS APRENDIZAJE ===== */
    .estilos-box {
      border: 1px solid #666;
      margin-bottom: 6px;
      padding: 4px 6px;
      font-size: 8px;
    }

    .estilo-item {
      margin-bottom: 2px;
    }

    .estilo-item strong {
      display: inline-block;
      width: 100px;
    }

    /* ===== RECURSOS ===== */
    .recursos-box {
      border: 1px solid #666;
      padding: 4px 6px;
      margin-bottom: 6px;
      font-size: 8.5px;
    }

    /* ===== FIRMAS ===== */
    .firmas {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
      padding-top: 8px;
    }

    .firma-box {
      text-align: center;
      width: 40%;
    }

    .firma-linea {
      border-top: 1px solid #333;
      padding-top: 3px;
      font-size: 8px;
      font-weight: bold;
      color: #333;
    }

    .firma-cargo {
      font-size: 7.5px;
      color: #666;
      margin-top: 2px;
    }

    /* ===== PIE DE PÁGINA ===== */
    .footer {
      margin-top: 12px;
      border-top: 2px solid #003366;
      padding-top: 4px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .footer-text {
      font-size: 7px;
      color: #666;
      line-height: 1.3;
    }

    .footer-logo {
      text-align: right;
      font-size: 7.5px;
      color: #003366;
      font-weight: bold;
    }

    .app-badge {
      display: inline-block;
      background: #003366;
      color: white;
      font-size: 6.5px;
      padding: 2px 5px;
      border-radius: 2px;
      margin-top: 2px;
    }

    /* ===== OBSERVACIONES ===== */
    .observaciones {
      border: 1px solid #666;
      padding: 4px 6px;
      margin-bottom: 6px;
      min-height: 20px;
      font-size: 8.5px;
    }

    /* ===== DUA SECTION ===== */
    .dua-container {
      border: 1px solid #666;
      margin-bottom: 6px;
    }

    .dua-principio {
      padding: 4px 6px;
      border-bottom: 1px solid #ddd;
    }

    .dua-principio:last-child {
      border-bottom: none;
    }

    .dua-principio-titulo {
      font-weight: bold;
      font-size: 8px;
      text-transform: uppercase;
      margin-bottom: 1px;
      padding: 1px 4px;
      border-radius: 2px;
      color: white;
      display: inline-block;
    }

    .dua-p1 { background: #EC4899; }
    .dua-p2 { background: #1E3A5F; }
    .dua-p3 { background: #22C55E; }

    .dua-subtitulo {
      font-size: 7px;
      color: #666;
      font-style: italic;
      margin-bottom: 2px;
    }

    .dua-texto {
      font-size: 8.5px;
      line-height: 1.35;
      white-space: pre-line;
    }

    .tema-titulo {
      background: #eaf2f8;
      border-left: 4px solid #003366;
      padding: 3px 6px;
      font-weight: bold;
      font-size: 9px;
      color: #003366;
      margin-bottom: 4px;
    }

    .objetivo-clase {
      font-style: italic;
      font-size: 8.5px;
      color: #333;
      margin-bottom: 4px;
      padding: 2px 6px;
      background: #f9f9f9;
      border-left: 3px solid #2980b9;
    }
  </style>
</head>
<body>

  <!-- ENCABEZADO -->
  <div class="header-row">
    <div class="sello">SELLO</div>
    <div class="institucion-nombre">${plan.institucion || (isEFL ? "EDUCATIONAL INSTITUTION" : "UNIDAD EDUCATIVA FISCAL")}</div>
    <div class="anio-lectivo">2026 - 2027</div>
  </div>

  <!-- TÍTULO PRINCIPAL -->
  <div class="titulo-principal">
    ${isEFL
      ? `MICROCURRICULAR LESSON PLAN - ${areaInfo.name.toUpperCase()}`
      : `PLANIFICACIÓN MICROCURRICULAR DE CLASE - ${areaInfo.name.toUpperCase()}`}
  </div>

  <!-- SECCIÓN 1: DATOS INFORMATIVOS -->
  <div class="seccion-titulo">${isEFL ? "1. General Information" : "1. DATOS INFORMATIVOS"}</div>
  <table>
    <tr>
      <td class="label" style="width:14%;">${isEFL ? "Grade/Level:" : "Grado/Curso:"}</td>
      <td class="value" style="width:14%;">${plan.grado || "___"}</td>
      <td class="label" style="width:16%;">${isEFL ? "Pedagogical Period:" : "Período Pedagógico:"}</td>
      <td class="value" style="width:20%;">${plan.periodoPedagogico || areaInfo.name}</td>
      <td class="label" style="width:12%;">${isEFL ? "Quarter:" : "Trimestre:"}</td>
      <td class="value" style="width:14%;">${plan.trimestre || "Primero"}</td>
    </tr>
    <tr>
      <td class="label">${isEFL ? "Level:" : "Nivel:"}</td>
      <td class="value">${plan.nivel || (plan.destreza.subnivel <= 4 ? "Educación General Básica" : "Bachillerato General Unificado")}</td>
      <td class="label">${isEFL ? "Curricular Insertion:" : "Inserción Curricular:"}</td>
      <td class="value">${(() => {
        const ids = plan.insercionesCurriculares || (plan.insercionCurricular ? [plan.insercionCurricular] : []);
        if (ids.length === 0) return areaInfo.name;
        return ids.map((id: string) => {
          const ins = INSERCIONES_CURRICULARES.find(i => i.id === id);
          return ins ? (isEFL ? ins.nameEN : ins.nombreCorto) : "";
        }).filter(Boolean).join(", ");
      })()}</td>
      <td class="label">${isEFL ? "Start Date:" : "Fecha Inicio:"}</td>
      <td class="value">${plan.fechaInicio || "___/___/______"}</td>
    </tr>
    <tr>
      <td class="label">${isEFL ? "Sublevel:" : "Subnivel:"}</td>
      <td class="value">${subnivelName}</td>
      <td class="label">${isEFL ? "Teacher:" : "Nombre Docente:"}</td>
      <td class="value">${plan.docente || "___"}</td>
      <td class="label">${isEFL ? "End Date:" : "Fecha Fin:"}</td>
      <td class="value">${plan.fechaFin || "___/___/______"}</td>
    </tr>
    <tr>
      <td class="label">${isEFL ? "Section:" : "Paralelo:"}</td>
      <td class="value">${plan.paralelo || '"A"'}</td>
      <td class="label" colspan="4"></td>
    </tr>
  </table>

  <!-- SECCIÓN 2: PRINCIPIOS DUA -->
  <div class="seccion-titulo">${isEFL ? "2. UDL PRINCIPLES" : "2. PRINCIPIOS DUA"}</div>
  <table>
    <tr>
      <td colspan="2" style="width:55%;">
        <div style="padding:2px 0;">
          <span style="font-size:8px;">I. ${isEFL ? "Provide multiple means of representation: What?" : "Proporcionar múltiples formas de representación: ¿qué?"}</span>
          <span class="dua-box-sq" style="background:#EC4899;margin-left:6px;"></span>
        </div>
        <div style="padding:2px 0;">
          <span style="font-size:8px;">II. ${isEFL ? "Provide multiple means of action and expression: How?" : "Proporcionar múltiples formas de acción y expresión: ¿Cómo?"}</span>
          <span class="dua-box-sq" style="background:#1E3A5F;margin-left:6px;"></span>
        </div>
        <div style="padding:2px 0;">
          <span style="font-size:8px;">III. ${isEFL ? "Provide multiple means of engagement or participation: Why?" : "Proporcionar múltiples formas de implicación o participación: ¿Por qué?"}</span>
          <span class="dua-box-sq" style="background:#22C55E;margin-left:6px;"></span>
        </div>
      </td>
      <td colspan="2" style="width:45%;">
        <div style="font-size:8px;font-weight:bold;margin-bottom:3px;">
          ${isEFL ? "3. LEARNING STYLES:" : "3. ESTILOS DE APRENDIZAJE:"} 
          <span style="font-weight:normal;font-style:italic;">${isEFL ? "Percentage distribution in this grade/level." : "Distribución porcentual en este grado/curso."}</span>
        </div>
        <div style="font-size:8px;padding:1px 0;">• <strong>VISUAL</strong>${plan.estilosAprendizajePorcentaje ? ` (${plan.estilosAprendizajePorcentaje.visual}%)` : ""}: ${isEFL ? "diagrams, graphics, colors, texts, outlines, etc." : "diagramas, gráficas, colores, textos, esquemas, etc."}</div>
        <div style="font-size:8px;padding:1px 0;">• <strong>AUDITIVO</strong>${plan.estilosAprendizajePorcentaje ? ` (${plan.estilosAprendizajePorcentaje.auditivo}%)` : ""}: ${isEFL ? "debates, discussions, seminars, music, narrations, etc." : "debates, discusiones, seminarios, música, narraciones, etc."}</div>
        <div style="font-size:8px;padding:1px 0;">• <strong>LECTOR – ESCRITOR</strong>${plan.estilosAprendizajePorcentaje ? ` (${plan.estilosAprendizajePorcentaje.lectorEscritor}%)` : ""}: ${isEFL ? "books, texts, readings, note-taking, essays, summaries, etc." : "libros, textos, lecturas, toma de notas, ensayos, resumen, etc."}</div>
        <div style="font-size:8px;padding:1px 0;">• <strong>KINESTÉSICO</strong>${plan.estilosAprendizajePorcentaje ? ` (${plan.estilosAprendizajePorcentaje.kinestesico}%)` : ""}: ${isEFL ? "demonstrations, physical activities, role plays." : "demostraciones, actividades físicas, juegos de roles."}</div>
      </td>
    </tr>
  </table>

  <!-- SECCIÓN 4: HABILIDADES SOCIOEMOCIONALES -->
  <div class="seccion-titulo">${isEFL ? "4. ASSOCIATED SOCIOEMOTIONAL SKILLS" : "4. HABILIDADES SOCIOEMOCIONALES ASOCIADAS"}</div>
  <div class="recursos-box">
    ${habHTML}
  </div>

  <!-- SECCIÓN 5: OBJETIVOS -->
  <div class="seccion-titulo">${isEFL ? "5. OBJECTIVES" : "5. OBJETIVOS"}</div>
  <div class="recursos-box">
    ${plan.objetivoAprendizaje || (objetivosHTML ? `<ul style="margin:0;padding-left:16px;">${objetivosHTML}</ul>` : (isEFL ? "Not specified" : "No especificado"))}
  </div>

  <!-- SECCIÓN 6: CRITERIOS DE EVALUACIÓN -->
  <div class="seccion-titulo">${isEFL ? "6. ASSESSMENT CRITERIA" : "6. CRITERIOS DE EVALUACIÓN"}</div>
  <div class="recursos-box">
    ${criteriosHTML ? `<ul style="margin:0;padding-left:16px;">${criteriosHTML}</ul>` : (isEFL ? "Not specified" : "No especificados")}
  </div>

  <!-- TABLA PRINCIPAL -->
  ${plan.temaSeleccionado ? `
    <div class="tema-titulo">${isEFL ? "Topic" : "Tema"}: ${plan.temaSeleccionado.titulo}</div>
  ` : ""}

  <table class="tabla-principal">
    <thead>
      <tr>
        <th class="col-destreza">${isEFL ? "Performance Criteria Skills" : "DESTREZAS CON CRITERIOS DE DESEMPEÑO"}</th>
        <th class="col-indicadores">${isEFL ? "Assessment Indicators" : "INDICADORES DE EVALUACIÓN"}</th>
        <th class="col-estrategias">${isEFL ? "Active Methodological Strategies for Teaching and Learning and UDL-based Diversified Strategies" : "ESTRATEGIAS METODOLÓGICAS ACTIVAS PARA LA ENSEÑANZA Y APRENDIZAJE Y ESTRATEGIAS METODOLÓGICAS DIVERSIFICADAS CON BASE AL DUA"}</th>
        <th class="col-recursos">${isEFL ? "Resources" : "RECURSOS"}</th>
        <th class="col-evaluacion">${isEFL ? "Assessment Activities" : "ACTIVIDADES EVALUATIVAS"}</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <strong>${plan.destreza.codigo}</strong>
          ${competenciasBadgesHTML ? `<div style="margin-top:3px;">${competenciasBadgesHTML}</div>` : ""}
          <br/>
          ${plan.destreza.descripcion}
        </td>
        <td>
          ${habHTML !== (isEFL ? "Not specified" : "No especificadas") ? `
            <div style="margin-bottom:4px;">
              ${(() => {
                const ids = plan.habilidadesSocioemocionales || [];
                return ids.map(id => {
                  const hab = HABILIDADES_SOCIOEMOCIONALES.find(h => h.id === id);
                  if (!hab) return "";
                  return `<div style="margin-bottom:3px;"><strong style="font-size:8px;">${isEFL ? hab.nameEN : hab.nombre}:</strong> <span style="font-size:8px;">${getHabilidadDescripcion(hab.id, isEFL)}</span></div>`;
                }).join("");
              })()}
            </div>
          ` : ""}
          ${indicadoresHTML ? `<ul style="margin-top:4px;">${indicadoresHTML}</ul>` : (isEFL ? "Not specified" : "No especificados")}
        </td>
        <td>
          <!-- DUA Legend -->
          <div class="dua-legend">
            <span class="dua-legend-item"><span class="dua-legend-sq" style="background:#EC4899;"></span>${isEFL ? "Representation" : "Representación"}</span>
            <span class="dua-legend-item"><span class="dua-legend-sq" style="background:#1E3A5F;"></span>${isEFL ? "Action & Expression" : "Acción y Expresión"}</span>
            <span class="dua-legend-item"><span class="dua-legend-sq" style="background:#22C55E;"></span>${isEFL ? "Engagement" : "Implicación"}</span>
          </div>
          ${actividadesHTML}
        </td>
        <td>
          ${recursosTexto}
        </td>
        <td>
          <strong style="font-size:7.5px;">${isEFL ? "Assessment indicators:" : "Indicadores de evaluación:"}</strong><br/>
          ${evaluacionTexto}
          <br/><br/>
          <strong style="font-size:7.5px;">${isEFL ? "Technique:" : "Técnica:"}</strong><br/>
          ${plan.tecnicasInstrumentos || (isEFL ? "Direct observation, participation analysis." : "Observación de participación, análisis de casos y reflexión personal.")}
          <br/><br/>
          <strong style="font-size:7.5px;">${isEFL ? "Instrument:" : "Instrumento:"}</strong><br/>
          ${(() => {
            if (plan.tecnicasEvaluacionSeleccionadas && plan.tecnicasEvaluacionSeleccionadas.length > 0) {
              return plan.tecnicasEvaluacionSeleccionadas.map((id: string) => {
                const tec = TECNICAS_EVALUACION.find(t => t.id === id);
                return tec ? (isEFL ? tec.nameEN : tec.nombre) : '';
              }).filter(Boolean).join(", ");
            }
            return isEFL ? "Checklist, assessment rubric" : "Lista de cotejo, rúbrica de evaluación";
          })()}
        </td>
      </tr>
    </tbody>
  </table>

  <!-- SECCIÓN: DUA DETALLADO -->
  <div class="seccion-titulo">${isEFL ? "UNIVERSAL DESIGN FOR LEARNING (UDL)" : "DISEÑO UNIVERSAL PARA EL APRENDIZAJE (DUA)"}</div>
  <div class="dua-container">
    <div class="dua-principio">
      <span class="dua-principio-titulo dua-p1">${isEFL ? "Principle 1: Multiple Means of Representation" : "Principio 1: Múltiples formas de Representación"}</span>
      <div class="dua-subtitulo">${isEFL ? "The WHAT of learning" : "El QUÉ del aprendizaje"}</div>
      <div class="dua-texto">${plan.dua?.representacion || (isEFL ? "Present information through visual, auditory, and hands-on resources." : "Presentar la información mediante recursos visuales, auditivos y manipulativos.")}</div>
    </div>
    <div class="dua-principio">
      <span class="dua-principio-titulo dua-p2">${isEFL ? "Principle 2: Multiple Means of Action and Expression" : "Principio 2: Múltiples formas de Acción y Expresión"}</span>
      <div class="dua-subtitulo">${isEFL ? "The HOW of learning" : "El CÓMO del aprendizaje"}</div>
      <div class="dua-texto">${plan.dua?.accionExpresion || (isEFL ? "Allow students to demonstrate learning through oral, written, graphic, or practical means." : "Permitir que los estudiantes demuestren lo aprendido de forma oral, escrita, gráfica o práctica.")}</div>
    </div>
    <div class="dua-principio">
      <span class="dua-principio-titulo dua-p3">${isEFL ? "Principle 3: Multiple Means of Engagement" : "Principio 3: Múltiples formas de Implicación"}</span>
      <div class="dua-subtitulo">${isEFL ? "The WHY of learning" : "El POR QUÉ del aprendizaje"}</div>
      <div class="dua-texto">${plan.dua?.implicacion || (isEFL ? "Motivate students through meaningful activities and connection to their context." : "Motivar a los estudiantes mediante actividades significativas y conexión con su contexto.")}</div>
    </div>
  </div>

  ${plan.usaCompetencias && competenciasHTML ? `
  <!-- COMPETENCIAS -->
  <div class="seccion-titulo">${isEFL ? "COMPETENCIES" : "COMPETENCIAS"}</div>
  <div class="recursos-box">${competenciasHTML}</div>
  ` : ""}

  ${metodologiasHTML ? `
  <!-- METODOLOGÍAS ACTIVAS -->
  <div class="seccion-titulo">${isEFL ? "ACTIVE METHODOLOGIES" : "METODOLOGÍAS ACTIVAS"}</div>
  <div class="recursos-box">${metodologiasHTML}</div>
  ` : ""}

  <!-- OBSERVACIONES -->
  <div class="seccion-titulo">${isEFL ? "OBSERVATIONS" : "OBSERVACIONES"}</div>
  <div class="observaciones">
    ${plan.observaciones || (isEFL ? "No additional observations." : "Sin observaciones adicionales.")}
  </div>

  <!-- FIRMAS -->
  <div class="firmas">
    <div class="firma-box">
      <div class="firma-linea">${plan.docente || "________________________"}</div>
      <div class="firma-cargo">${isEFL ? "Teacher" : "Docente"}</div>
    </div>
    <div class="firma-box">
      <div class="firma-linea">________________________</div>
      <div class="firma-cargo">${isEFL ? "Area Director" : "Director/a de Área"}</div>
    </div>
  </div>

  <!-- PIE DE PÁGINA -->
  <div class="footer">
    <div class="footer-text">
      ${isEFL ? "Format based on the guidelines of the Ministry of Education of Ecuador 2026-2027.<br/>National Curriculum - General Basic Education and Unified General Baccalaureate." : "Formato basado en los lineamientos del Ministerio de Educación del Ecuador 2026-2027.<br/>Currículo Nacional - Educación General Básica y Bachillerato General Unificado."}
    </div>
    <div class="footer-logo">
      PlanificaDoc Ecuador
      <div class="app-badge">Generado con PlanificaDoc</div>
    </div>
  </div>

</body>
</html>`;
}

// ============================================================
// PLANIFICACIÓN SEMANAL — HTML GENERATOR
// ============================================================

/**
 * Genera el HTML con el formato oficial del Ministerio de Educación de Ecuador
 * para una Planificación Semanal (5 días).
 * Tabla principal: DÍA | DCD | INDICADORES | ESTRATEGIAS+DUA | RECURSOS | ACTIVIDADES EVALUATIVAS
 */
export function generarHTMLSemanal(semana: import("../data/types").PlanificacionSemanal): string {
  const DIAS = ["lunes", "martes", "miercoles", "jueves", "viernes"] as const;
  type DiaSemanaKey = typeof DIAS[number];
  const DIA_LABEL: Record<DiaSemanaKey, string> = {
    lunes: "LUNES", martes: "MARTES", miercoles: "MIÉRCOLES", jueves: "JUEVES", viernes: "VIERNES",
  };

  // Helper: limpia texto de actividades quitando marcadores DUA residuales
  const cleanAct = (act: string) => act
    .replace(/\s*\(\s*I\s*:\s*(true|false)\s*,\s*R\s*:\s*(true|false)\s*,\s*A\s*:\s*(true|false)\s*\)\s*/gi, "")
    .replace(/\s*\[\s*I\s*:\s*(true|false)\s*,\s*R\s*:\s*(true|false)\s*,\s*A\s*:\s*(true|false)\s*\]\s*/gi, "")
    .replace(/\s*DUA\s*:\s*\{[^}]*\}\s*/gi, "")
    .replace(/\s*\(DUA[^)]*\)\s*/gi, "")
    .trim();

  type FaseKey = { duracion?: string; actividades?: string[]; duaActividades?: Array<{ representacion: boolean; accionExpresion: boolean; implicacion: boolean }> };
  type EstructuraMap = Record<string, FaseKey>;

  // Construir filas de la tabla principal
  // Una fila por cada hora de clase de cada día activo
  const diasActivos = DIAS.filter((d) => semana.dias[d]?.activo);

  const filasHTML = diasActivos.map((dia) => {
    const diaConfig = semana.dias[dia];
    const horasConPlan = diaConfig.horas.filter(h => h.temaSeleccionado);
    if (horasConPlan.length === 0) return "";

    return horasConPlan.map((hora, horaIdx) => {
      const plan = hora.temaSeleccionado!;
      const est = plan.estructura as EstructuraMap;

      // ── Columna 2: DCD ──
      const dcdHTML = `
        <strong style="color:#003366;font-size:8px;">${hora.codigoDestreza}</strong><br/>
        <span style="font-size:7.5px;">${hora.destreza?.descripcion || ""}</span>
        ${plan.objetivoClase ? `<div style="margin-top:3px;font-size:7px;color:#555;font-style:italic;border-left:2px solid #003366;padding-left:4px;">${plan.objetivoClase}</div>` : ""}`;

      // ── Columna 3: Indicadores de evaluación ──
      const indicadores = hora.destreza?.indicadoresEvaluacion || [];
      const indHTML = indicadores.length
        ? `<ul style="padding-left:10px;margin:0;">${indicadores.map(i => `<li style="font-size:7.5px;margin-bottom:2px;">${i}</li>`).join("")}</ul>`
        : `<span style="font-size:7.5px;color:#888;">—</span>`;

      // ── Columna 4: Estrategias ERCA + DUA ──
      const fases = [
        { key: "experiencia", label: "EXPERIENCIA", color: "#2980b9" },
        { key: "reflexion", label: "REFLEXIÓN", color: "#8e44ad" },
        { key: "conceptualizacion", label: "CONCEPTUALIZACIÓN", color: "#27ae60" },
        { key: "aplicacion", label: "APLICACIÓN", color: "#e67e22" },
      ];

      const estrategiasHTML = `
        <div style="font-size:6.5px;margin-bottom:3px;">
          <span style="display:inline-block;width:8px;height:8px;background:#EC4899;border-radius:1px;vertical-align:middle;"></span> Representación&nbsp;&nbsp;
          <span style="display:inline-block;width:8px;height:8px;background:#1E3A5F;border-radius:1px;vertical-align:middle;"></span> Acción/Expresión&nbsp;&nbsp;
          <span style="display:inline-block;width:8px;height:8px;background:#22C55E;border-radius:1px;vertical-align:middle;"></span> Implicación
        </div>
        ${fases.map(({ key, label, color }) => {
          const fase = est[key];
          if (!fase?.actividades?.length) return "";
          const actsHTML = (fase.actividades).map((act, idx) => {
            const dua = fase.duaActividades?.[idx] ?? { representacion: false, accionExpresion: false, implicacion: false };
            return `<li style="font-size:7px;margin-bottom:2px;line-height:1.3;">${idx + 1}. ${cleanAct(act)}
              <span style="display:inline-block;width:7px;height:7px;background:${dua.representacion ? "#EC4899" : "#EC489938"};border-radius:1px;vertical-align:middle;margin-left:2px;-webkit-print-color-adjust:exact;print-color-adjust:exact;"></span>
              <span style="display:inline-block;width:7px;height:7px;background:${dua.accionExpresion ? "#1E3A5F" : "#1E3A5F38"};border-radius:1px;vertical-align:middle;margin-left:1px;-webkit-print-color-adjust:exact;print-color-adjust:exact;"></span>
              <span style="display:inline-block;width:7px;height:7px;background:${dua.implicacion ? "#22C55E" : "#22C55E38"};border-radius:1px;vertical-align:middle;margin-left:1px;-webkit-print-color-adjust:exact;print-color-adjust:exact;"></span>
            </li>`;
          }).join("");
          return `<div style="margin-bottom:4px;">
            <div style="background:${color};color:white;font-size:7px;font-weight:bold;padding:1px 4px;border-radius:2px;margin-bottom:2px;">${label}${fase.duracion ? ` (${fase.duracion})` : ""}</div>
            <ul style="list-style:none;padding:0;margin:0;">${actsHTML}</ul>
          </div>`;
        }).join("")}`;

      // ── Columna 5: Recursos ──
      const recursosHTML = plan.recursos?.length
        ? plan.recursos.map(r => `<div style="font-size:7.5px;margin-bottom:2px;">• ${r}</div>`).join("")
        : `<span style="font-size:7.5px;color:#888;">—</span>`;

      // ── Columna 6: Actividades Evaluativas ──
      const evalHTML = `
        ${plan.evaluacionFormativa ? `<div style="font-size:7.5px;margin-bottom:4px;">${plan.evaluacionFormativa}</div>` : ""}
        ${hora.tecnicasEvaluacion?.length ? `<div style="font-size:7px;color:#555;margin-top:2px;"><strong>Técnicas:</strong> ${hora.tecnicasEvaluacion.join(", ")}</div>` : ""}
        ${hora.destreza?.criteriosEvaluacion?.length ? `<div style="font-size:7px;color:#555;margin-top:3px;"><strong>Criterios:</strong><ul style="padding-left:10px;margin:2px 0;">${hora.destreza.criteriosEvaluacion.map(c => `<li style="font-size:7px;">${c}</li>`).join("")}</ul></div>` : ""}`;

      // rowspan en la celda de día solo para la primera hora
      const diaCell = horaIdx === 0
        ? `<td rowspan="${horasConPlan.length}" style="background:#D4A5C7;font-weight:bold;font-size:9px;text-align:center;vertical-align:middle;writing-mode:vertical-rl;text-orientation:mixed;transform:rotate(180deg);width:28px;padding:4px 2px;letter-spacing:1px;">${DIA_LABEL[dia]}</td>`
        : "";

      return `<tr>
        ${diaCell}
        <td style="width:16%;vertical-align:top;padding:5px;">${dcdHTML}</td>
        <td style="width:14%;vertical-align:top;padding:5px;">${indHTML}</td>
        <td style="width:36%;vertical-align:top;padding:5px;">${estrategiasHTML}</td>
        <td style="width:12%;vertical-align:top;padding:5px;">${recursosHTML}</td>
        <td style="width:16%;vertical-align:top;padding:5px;">${evalHTML}</td>
      </tr>`;
    }).join("");
  }).join("");

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Planificaci&oacute;n Semanal &mdash; ${semana.semanaInicio}</title>
  <style>
    @page { size: A4 landscape; margin: 10mm 8mm; }
    * { margin:0; padding:0; box-sizing:border-box; -webkit-print-color-adjust:exact!important; print-color-adjust:exact!important; }
    body { font-family:'Helvetica Neue',Helvetica,Arial,sans-serif; font-size:9px; color:#1a1a1a; line-height:1.35; background:#fff; }

    .header-row { display:flex; align-items:center; justify-content:space-between; margin-bottom:5px; }
    .sello { font-size:9px; font-weight:bold; color:#003366; border:1px solid #003366; padding:3px 7px; text-transform:uppercase; }
    .inst-nombre { text-align:center; font-size:11px; font-weight:bold; color:#003366; text-transform:uppercase; }
    .anio { font-size:10px; font-weight:bold; color:#003366; }

    .titulo-doc { background:#D4A5C7; color:#1a1a1a; text-align:center; padding:4px 10px; font-size:9.5px; font-weight:bold; text-transform:uppercase; letter-spacing:.5px; margin-bottom:5px; border:1px solid #999; }

    table.datos { width:100%; border-collapse:collapse; margin-bottom:5px; }
    table.datos td { border:1px solid #888; padding:2px 5px; font-size:8px; vertical-align:middle; }
    .lbl { background:#F5E6F0; font-weight:bold; color:#1a3c5e; }

    table.principal { width:100%; border-collapse:collapse; margin-bottom:6px; table-layout:fixed; }
    table.principal th { background:#D4A5C7; color:#1a1a1a; font-size:8px; font-weight:bold; text-align:center; padding:4px 3px; border:1px solid #888; text-transform:uppercase; vertical-align:middle; line-height:1.2; }
    table.principal td { border:1px solid #888; vertical-align:top; font-size:8px; }

    .estilos-row { display:flex; gap:16px; margin-bottom:5px; padding:4px 8px; border:1px solid #ccc; border-radius:3px; font-size:7.5px; background:#fafafa; }
    .estilo-item { font-size:7.5px; }
    .estilo-item strong { display:inline-block; min-width:110px; }

    .footer { margin-top:10px; border-top:2px solid #003366; padding-top:4px; display:flex; justify-content:space-between; align-items:center; }
    .footer-txt { font-size:6.5px; color:#777; }
    .footer-logo { font-size:7px; color:#003366; font-weight:bold; text-align:right; }
    .app-badge { display:inline-block; background:#003366; color:white; font-size:6px; padding:1px 4px; border-radius:2px; margin-top:1px; }

    .firmas { display:flex; justify-content:space-between; margin-top:14px; }
    .firma-box { text-align:center; width:42%; }
    .firma-linea { border-top:1px solid #333; padding-top:3px; font-size:7.5px; font-weight:bold; }
    .firma-cargo { font-size:7px; color:#666; margin-top:2px; }
  </style>
</head>
<body>

  <!-- ENCABEZADO -->
  <div class="header-row">
    <div class="sello">SELLO</div>
    <div class="inst-nombre">${semana.institucion || "UNIDAD EDUCATIVA FISCAL"}</div>
    <div class="anio">2026 &ndash; 2027</div>
  </div>

  <!-- TÍTULO -->
  <div class="titulo-doc">PLANIFICACI&Oacute;N MICROCURRICULAR SEMANAL</div>

  <!-- DATOS INFORMATIVOS -->
  <table class="datos">
    <tr>
      <td class="lbl" style="width:11%;">Docente:</td>
      <td style="width:21%;">${semana.docente || "___"}</td>
      <td class="lbl" style="width:9%;">Grado/Curso:</td>
      <td style="width:13%;">${semana.grado || "___"}${semana.paralelo ? " &mdash; " + semana.paralelo : ""}</td>
      <td class="lbl" style="width:9%;">Trimestre:</td>
      <td style="width:10%;">${semana.trimestre || "___"}</td>
      <td class="lbl" style="width:9%;">Semana:</td>
      <td style="width:18%;">${semana.semanaInicio} &mdash; ${semana.semanaFin}</td>
    </tr>
    <tr>
      <td class="lbl">Instituci&oacute;n:</td>
      <td colspan="3">${semana.institucion || "___"}</td>
      <td class="lbl">Nivel:</td>
      <td>${semana.nivel || "___"}</td>
      <td class="lbl">Per&iacute;odos:</td>
      <td>${semana.periodos || "___"}</td>
    </tr>
    <tr>
      <td class="lbl">N.&ordm; de unidad de planificaci&oacute;n:</td>
      <td style="width:8%;">${(semana as any).numeroUnidad || "___"}</td>
      <td class="lbl" colspan="1">T&iacute;tulo de unidad de planificaci&oacute;n:</td>
      <td colspan="2">${(semana as any).tituloUnidad || "___"}</td>
      <td class="lbl">Objetivos espec&iacute;ficos de la unidad de planificaci&oacute;n:</td>
      <td colspan="2">${(semana as any).objetivosUnidad || "___"}</td>
    </tr>
  </table>

  <!-- TABLA PRINCIPAL -->
  <table class="principal">
    <thead>
      <tr>
        <th style="width:3%;">D&Iacute;A</th>
        <th style="width:16%;">DESTREZAS CON CRITERIOS<br/>DE DESEMPE&Ntilde;O</th>
        <th style="width:14%;">INDICADORES DE<br/>EVALUACI&Oacute;N</th>
        <th style="width:36%;">ESTRATEGIAS METODOL&Oacute;GICAS ACTIVAS PARA LA ENSE&Ntilde;ANZA Y APRENDIZAJE<br/>Y ESTRATEGIAS METODOL&Oacute;GICAS DIVERSIFICADAS CON BASE AL DUA</th>
        <th style="width:12%;">RECURSOS</th>
        <th style="width:16%;">ACTIVIDADES<br/>EVALUATIVAS</th>
      </tr>
    </thead>
    <tbody>
      ${filasHTML || `<tr><td colspan="6" style="text-align:center;padding:20px;color:#888;font-style:italic;">No hay planificaciones generadas.</td></tr>`}
    </tbody>
  </table>

  <!-- FIRMAS -->
  <div class="firmas">
    <div class="firma-box">
      <div class="firma-linea">${semana.docente || "________________________"}</div>
      <div class="firma-cargo">Docente</div>
    </div>
    <div class="firma-box">
      <div class="firma-linea">________________________</div>
      <div class="firma-cargo">Director/a de &Aacute;rea</div>
    </div>
  </div>

  <!-- PIE DE PÁGINA -->
  <div class="footer">
    <div class="footer-txt">Formato basado en los lineamientos del Ministerio de Educaci&oacute;n del Ecuador 2026-2027.<br/>Curr&iacute;culo Nacional &mdash; EGB y BGU.</div>
    <div class="footer-logo">
      PlanificaDoc Ecuador
      <div class="app-badge">Generado con PlanificaDoc</div>
    </div>
  </div>

</body>
</html>`;
}

/**
 * Descripciones breves de habilidades socioemocionales para la columna de indicadores
 */
function getHabilidadDescripcion(id: string, isEFL: boolean): string {
  const descripciones: Record<string, { es: string; en: string }> = {
    conciencia_social: {
      es: "Comprende las interacciones sociales y culturales y valora la importancia de la equidad y la justicia en las relaciones con los demás.",
      en: "Understands social and cultural interactions and values the importance of equity and justice in relationships.",
    },
    pensamiento_critico: {
      es: "Analiza la validez de la información y genera soluciones creativas a problemas complejos. Reconoce distintas fuentes de información.",
      en: "Analyzes the validity of information and generates creative solutions to complex problems.",
    },
    pensamiento_etico: {
      es: "Analiza cuestiones éticas en la toma de decisiones y actúa de manera responsable y respetuosa en diferentes contextos.",
      en: "Analyzes ethical issues in decision-making and acts responsibly and respectfully in different contexts.",
    },
    manejo_problemas: {
      es: "Identifica problemas cotidianos complejos, propone soluciones y evalúa su efectividad.",
      en: "Identifies complex everyday problems, proposes solutions and evaluates their effectiveness.",
    },
    trabajo_colaborativo: {
      es: "Trabaja de manera efectiva en equipo, demostrando habilidades de comunicación, empatía y colaboración.",
      en: "Works effectively in teams, demonstrating communication, empathy and collaboration skills.",
    },
    comunicacion_asertiva: {
      es: "Se comunica de manera clara, respetuosa y efectiva en diferentes contextos y con diferentes interlocutores.",
      en: "Communicates clearly, respectfully and effectively in different contexts and with different interlocutors.",
    },
    autoconocimiento: {
      es: "Reconoce sus fortalezas, debilidades, emociones y valores, y los utiliza para su desarrollo personal.",
      en: "Recognizes strengths, weaknesses, emotions and values, and uses them for personal development.",
    },
    autorregulacion: {
      es: "Gestiona sus emociones y comportamientos de manera efectiva para alcanzar metas personales y académicas.",
      en: "Manages emotions and behaviors effectively to achieve personal and academic goals.",
    },
    empatia: {
      es: "Comprende y comparte los sentimientos de los demás, mostrando sensibilidad ante diferentes perspectivas.",
      en: "Understands and shares others' feelings, showing sensitivity to different perspectives.",
    },
    resiliencia: {
      es: "Demuestra resiliencia y perseverancia ante los desafíos, manteniendo una actitud positiva.",
      en: "Demonstrates resilience and perseverance in the face of challenges, maintaining a positive attitude.",
    },
    toma_decisiones: {
      es: "Toma decisiones informadas, responsables y basadas en principios éticos considerando el bienestar propio y de los demás.",
      en: "Makes informed, responsible decisions based on ethical principles considering own and others' well-being.",
    },
    perseverancia: {
      es: "Mantiene el esfuerzo y la dedicación ante las dificultades, buscando alcanzar sus objetivos con constancia.",
      en: "Maintains effort and dedication in the face of difficulties, seeking to achieve goals with consistency.",
    },
  };

  const desc = descripciones[id];
  if (!desc) return "";
  return isEFL ? desc.en : desc.es;
}
