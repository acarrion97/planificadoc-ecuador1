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
  const bloqueName = areaInfo.bloques[plan.destreza.bloque] || (isEFL ? `Block ${plan.destreza.bloque}` : `Bloque ${plan.destreza.bloque}`);
  const fechaFormateada = new Date(plan.createdAt).toLocaleDateString(isEFL ? "en-US" : "es-EC", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Bloques curriculares del área
  const bloquesHTML = plan.bloquesCurriculares && plan.bloquesCurriculares.length > 0
    ? plan.bloquesCurriculares.map((b, i) => `<tr><td class="label" style="width:22%;">Bloque Curricular ${i + 1}:</td><td class="value" colspan="3">${b}</td></tr>`).join("")
    : Object.entries(areaInfo.bloques).map(([key, name], i) => `<tr><td class="label" style="width:22%;">Bloque Curricular ${i + 1}:</td><td class="value" colspan="3">${name}</td></tr>`).join("");

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
        const squares = `
          <span class="dua-sq" style="background:${dua.representacion ? '#EC4899' : '#EC489940'};"></span>
          <span class="dua-sq" style="background:${dua.accionExpresion ? '#1E3A5F' : '#1E3A5F40'};"></span>
          <span class="dua-sq" style="background:${dua.implicacion ? '#22C55E' : '#22C55E40'};"></span>
        `;
        return `<li>${idx + 1}. ${act} ${squares}</li>`;
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

    .col-destreza { width: 22%; }
    .col-indicadores { width: 20%; }
    .col-estrategias { width: 38%; }
    .col-evaluacion { width: 20%; }

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
      ? `MICROCURRICULAR PLANNING FOR ${areaInfo.name.toUpperCase()} AND COMPREHENSIVE ACCOMPANIMENT IN THE CLASSROOM PER QUARTER`
      : `PLANIFICACIÓN MICROCURRICULAR PARA ${areaInfo.name.toUpperCase()} Y ACOMPAÑAMIENTO INTEGRAL EN EL AULA POR TRIMESTRE`}
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
    ${bloquesHTML}
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
        <th class="col-evaluacion">${isEFL ? "Assessment" : "EVALUACIÓN"}</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <strong style="font-size:8px;">${isEFL ? "Curricular Block:" : "Bloque Curricular:"} ${bloqueName}</strong><br/><br/>
          <strong>${plan.destreza.codigo}</strong><br/>
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

  <!-- SECCIÓN: RECURSOS -->
  <div class="seccion-titulo">${isEFL ? "RESOURCES" : "RECURSOS"}</div>
  <div class="recursos-box">
    ${recursosTexto}
  </div>

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
