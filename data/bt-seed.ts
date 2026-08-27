/**
 * Seed oficial del catálogo de Bachillerato Técnico
 * Fuente: Acuerdo Ministerial MINEDUC-2024-00065-A
 * Registro Oficial No. 645 del 17 de septiembre del 2024
 *
 * 3 áreas técnicas | 11 familias | 34 figuras profesionales
 */

// ═══════════════════════════════════════════════════════════════════════════
// ÁREAS TÉCNICAS
// ═══════════════════════════════════════════════════════════════════════════

export const BT_AREAS = [
  {
    nombre: "Técnica",
    descripcion: "Área técnica del Bachillerato Técnico que agrupa las familias orientadas a la formación en sectores productivos industriales, tecnológicos, comerciales y de servicios.",
  },
  {
    nombre: "Artística",
    descripcion: "Área artística del Bachillerato Técnico que agrupa las familias orientadas a la formación en expresiones artísticas y diseño.",
  },
  {
    nombre: "Deportes y Salud",
    descripcion: "Área de deportes y salud del Bachillerato Técnico que agrupa las familias orientadas a la formación en actividad física, deportes, salud y servicios sociales.",
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// FAMILIAS PROFESIONALES
// ═══════════════════════════════════════════════════════════════════════════

export const BT_FAMILIAS = [
  // ─── Área Técnica ──────────────────────────────────────────────────────
  {
    areaNombre: "Técnica",
    nombre: "Administrativa y Financiera",
    codigo: "TEC-ADMIN-FIN",
    descripcion: "Familia orientada a la gestión administrativa, contable y financiera de organizaciones.",
  },
  {
    areaNombre: "Técnica",
    nombre: "Agropecuaria",
    codigo: "TEC-AGRO",
    descripcion: "Familia orientada a la producción agropecuaria, manejo de recursos hídricos y sostenibilidad.",
  },
  {
    areaNombre: "Técnica",
    nombre: "Ambiente",
    codigo: "TEC-AMB",
    descripcion: "Familia orientada a la conservación del ambiente, áreas protegidas y desarrollo sostenible.",
  },
  {
    areaNombre: "Técnica",
    nombre: "Construcción Sostenible",
    codigo: "TEC-CONST",
    descripcion: "Familia orientada a la construcción de obras civiles, instalaciones y estructuras.",
  },
  {
    areaNombre: "Técnica",
    nombre: "Industrial",
    codigo: "TEC-IND",
    descripcion: "Familia orientada a los procesos industriales, manufactura, electrónica y mecánica.",
  },
  {
    areaNombre: "Técnica",
    nombre: "Tecnologías",
    codigo: "TEC-TEC",
    descripcion: "Familia orientada al desarrollo de software, ciencias de datos, redes e informática.",
  },
  {
    areaNombre: "Técnica",
    nombre: "Turismo",
    codigo: "TEC-TURISMO",
    descripcion: "Familia orientada a la gestión turística, hostelería y arte culinario.",
  },
  // ─── Área Artística ────────────────────────────────────────────────────
  {
    areaNombre: "Artística",
    nombre: "Artes",
    codigo: "ART-ARTES",
    descripcion: "Familia orientada a las expresiones artísticas: plásticas, escénicas y musicales.",
  },
  {
    areaNombre: "Artística",
    nombre: "Diseño",
    codigo: "ART-DISENO",
    descripcion: "Familia orientada al diseño gráfico, multimedia y de modas.",
  },
  // ─── Área Deportes y Salud ─────────────────────────────────────────────
  {
    areaNombre: "Deportes y Salud",
    nombre: "Deportes",
    codigo: "DS-DEPORTES",
    descripcion: "Familia orientada a la actividad física, deporte, recreación y gestión deportiva.",
  },
  {
    areaNombre: "Deportes y Salud",
    nombre: "Salud y Servicio",
    codigo: "DS-SALUD",
    descripcion: "Familia orientada a la atención de la primera infancia, seguridad ciudadana y cuidado de grupos prioritarios.",
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// FIGURAS PROFESIONALES
// ═══════════════════════════════════════════════════════════════════════════

export const BT_FIGURAS = [
  // ─── Familia: Administrativa y Financiera ──────────────────────────────
  {
    familiaCodigo: "TEC-ADMIN-FIN",
    nombre: "Gestión Administrativa y Logística",
    codigo: "TEC-AL-01",
    perfilProfesional: "Ejecuta procesos administrativos, logísticos y de gestión documental en organizaciones públicas y privadas.",
  },
  {
    familiaCodigo: "TEC-ADMIN-FIN",
    nombre: "Gestión Financiera",
    codigo: "TEC-AF-02",
    perfilProfesional: "Ejecuta procesos contables, financieros y de control presupuestario en organizaciones.",
  },
  // ─── Familia: Agropecuaria ─────────────────────────────────────────────
  {
    familiaCodigo: "TEC-AGRO",
    nombre: "Manejo de Recursos Hidrobiológicos",
    codigo: "TEC-AG-03",
    perfilProfesional: "Ejecuta técnicas de manejo, producción y conservación de recursos hidrobiológicos.",
  },
  {
    familiaCodigo: "TEC-AGRO",
    nombre: "Producción Agropecuaria Sostenible",
    codigo: "TEC-AG-04",
    perfilProfesional: "Ejecuta técnicas de producción agropecuaria con enfoque sostenible y responsabilidad ambiental.",
  },
  // ─── Familia: Ambiente ─────────────────────────────────────────────────
  {
    familiaCodigo: "TEC-AMB",
    nombre: "Conservación y Manejo de Áreas Protegidas",
    codigo: "TEC-AM-05",
    perfilProfesional: "Ejecuta técnicas de conservación, manejo y monitoreo de áreas naturales protegidas.",
  },
  {
    familiaCodigo: "TEC-AMB",
    nombre: "Gestión Ambiental y Desarrollo Sostenible",
    codigo: "TEC-AM-06",
    perfilProfesional: "Ejecuta procesos de gestión ambiental, auditorías y desarrollo sostenible en organizaciones.",
  },
  // ─── Familia: Construcción Sostenible ──────────────────────────────────
  {
    familiaCodigo: "TEC-CONST",
    nombre: "Climatización",
    codigo: "TEC-CS-07",
    perfilProfesional: "Ejecuta instalación, mantenimiento y reparación de sistemas de climatización.",
  },
  {
    familiaCodigo: "TEC-CONST",
    nombre: "Construcción de Obra Civil",
    codigo: "TEC-CS-08",
    perfilProfesional: "Ejecuta procesos de construcción de obras civiles conforme a normas técnicas y de seguridad.",
  },
  {
    familiaCodigo: "TEC-CONST",
    nombre: "Estructuras y Construcciones Metálicas",
    codigo: "TEC-CS-09",
    perfilProfesional: "Ejecuta fabricación, montaje y soldadura de estructuras metálicas para la construcción.",
  },
  {
    familiaCodigo: "TEC-CONST",
    nombre: "Instalaciones Eléctricas",
    codigo: "TEC-CS-10",
    perfilProfesional: "Ejecuta instalación, mantenimiento y reparación de sistemas eléctricos residenciales e industriales.",
  },
  // ─── Familia: Industrial ───────────────────────────────────────────────
  {
    familiaCodigo: "TEC-IND",
    nombre: "Electromecánica Industrial",
    codigo: "TEC-IN-11",
    perfilProfesional: "Ejecuta mantenimiento y reparación de equipos electromecánicos industriales.",
  },
  {
    familiaCodigo: "TEC-IND",
    nombre: "Electromecánica Automotriz",
    codigo: "TEC-IN-12",
    perfilProfesional: "Ejecuta diagnóstico, mantenimiento y reparación de sistemas electromecánicos automotrices.",
  },
  {
    familiaCodigo: "TEC-IND",
    nombre: "Electrónica",
    codigo: "TEC-IN-13",
    perfilProfesional: "Ejecuta diseño, montaje y mantenimiento de circuitos y equipos electrónicos.",
  },
  {
    familiaCodigo: "TEC-IND",
    nombre: "Fabricación en Madera",
    codigo: "TEC-IN-14",
    perfilProfesional: "Ejecuta procesos de transformación y fabricación de productos en madera.",
  },
  {
    familiaCodigo: "TEC-IND",
    nombre: "Mecatrónica",
    codigo: "TEC-IN-15",
    perfilProfesional: "Ejecuta mantenimiento y reparación de sistemas mecatrónicos: mecánica, electrónica y automatización.",
  },
  {
    familiaCodigo: "TEC-IND",
    nombre: "Conservación y Procesamiento de Alimentos",
    codigo: "TEC-IN-16",
    perfilProfesional: "Ejecuta procesos de conservación, transformación y aseguramiento de calidad de alimentos.",
  },
  {
    familiaCodigo: "TEC-IND",
    nombre: "Producción de Calzado",
    codigo: "TEC-IN-17",
    perfilProfesional: "Ejecuta procesos de diseño, corte, confección y acabado de calzado.",
  },
  // ─── Familia: Tecnologías ──────────────────────────────────────────────
  {
    familiaCodigo: "TEC-TEC",
    nombre: "Ciencia de Datos",
    codigo: "TEC-TC-18",
    perfilProfesional: "Ejecuta procesos de recolección, análisis e interpretación de datos para la toma de decisiones.",
  },
  {
    familiaCodigo: "TEC-TEC",
    nombre: "Desarrollo de Software",
    codigo: "TEC-TC-19",
    perfilProfesional: "Ejecuta diseño, desarrollo y mantenimiento de aplicaciones de software.",
  },
  {
    familiaCodigo: "TEC-TEC",
    nombre: "Redes y Telecomunicaciones",
    codigo: "TEC-TC-20",
    perfilProfesional: "Ejecuta instalación, configuración y mantenimiento de redes de datos y telecomunicaciones.",
  },
  {
    familiaCodigo: "TEC-TEC",
    nombre: "Seguridad Informática",
    codigo: "TEC-TC-21",
    perfilProfesional: "Ejecuta procesos de protección de sistemas informáticos, análisis de vulnerabilidades y respuesta a incidentes.",
  },
  {
    familiaCodigo: "TEC-TEC",
    nombre: "Soporte Informático",
    codigo: "TEC-TC-22",
    perfilProfesional: "Ejecuta soporte técnico, mantenimiento preventivo y correctivo de equipos de cómputo.",
  },
  // ─── Familia: Turismo ──────────────────────────────────────────────────
  {
    familiaCodigo: "TEC-TURISMO",
    nombre: "Gestión Turística",
    codigo: "TEC-TU-23",
    perfilProfesional: "Ejecuta procesos de planificación, organización y promoción de productos turísticos.",
  },
  {
    familiaCodigo: "TEC-TURISMO",
    nombre: "Hostelería y Arte Culinario",
    codigo: "TEC-TU-24",
    perfilProfesional: "Ejecuta técnicas de preparación culinaria, servicio de alimentos y atención al cliente en hostelería.",
  },
  // ─── Familia: Artes ────────────────────────────────────────────────────
  {
    familiaCodigo: "ART-ARTES",
    nombre: "Gestión Cultural y Artes Plásticas",
    codigo: "ART-AR-25",
    perfilProfesional: "Ejecuta expresiones artísticas plásticas y procesos de gestión cultural.",
  },
  {
    familiaCodigo: "ART-ARTES",
    nombre: "Gestión Cultural y Artes Escénicas",
    codigo: "ART-AR-26",
    perfilProfesional: "Ejecuta expresiones artísticas escénicas y procesos de gestión cultural.",
  },
  {
    familiaCodigo: "ART-ARTES",
    nombre: "Gestión Cultural y Música",
    codigo: "ART-AR-27",
    perfilProfesional: "Ejecuta expresiones musicales y procesos de gestión cultural.",
  },
  // ─── Familia: Diseño ───────────────────────────────────────────────────
  {
    familiaCodigo: "ART-DISENO",
    nombre: "Diseño de Modas",
    codigo: "ART-DI-28",
    perfilProfesional: "Ejecuta diseño, patronaje y confección de prendas de vestir y accesorios.",
  },
  {
    familiaCodigo: "ART-DISENO",
    nombre: "Diseño Gráfico y Multimedia",
    codigo: "ART-DI-29",
    perfilProfesional: "Ejecuta diseño gráfico, audiovisual y multimedia para medios impresos y digitales.",
  },
  // ─── Familia: Deportes ─────────────────────────────────────────────────
  {
    familiaCodigo: "DS-DEPORTES",
    nombre: "Actividad Física, Deporte y Recreación",
    codigo: "DS-DE-30",
    perfilProfesional: "Planifica, organiza y dirige programas de actividad física, deporte y recreación.",
  },
  {
    familiaCodigo: "DS-DEPORTES",
    nombre: "Gestión Deportiva y Cultural",
    codigo: "DS-DE-31",
    perfilProfesional: "Gestiona proyectos deportivos y culturales para organizaciones e instituciones.",
  },
  // ─── Familia: Salud y Servicio ─────────────────────────────────────────
  {
    familiaCodigo: "DS-SALUD",
    nombre: "Atención a la Primera Infancia",
    codigo: "DS-SA-32",
    perfilProfesional: "Ejecuta programas de atención, cuidado y desarrollo integral de la primera infancia.",
  },
  {
    familiaCodigo: "DS-SALUD",
    nombre: "Seguridad Ciudadana",
    codigo: "DS-SA-33",
    perfilProfesional: "Ejecuta procedimientos de prevención, protección y seguridad ciudadana.",
  },
  {
    familiaCodigo: "DS-SALUD",
    nombre: "Asistencia y Cuidado a Grupos Prioritarios",
    codigo: "DS-SA-34",
    perfilProfesional: "Ejecuta programas de asistencia, cuidado y acompañamiento a personas en situación de vulnerabilidad.",
  },
];
