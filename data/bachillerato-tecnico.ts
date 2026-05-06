/**
 * Datos del Bachillerato Técnico - Catálogo de Figuras Profesionales
 * Fuente: Acuerdo Ministerial Nro. MINEDUC-MINEDUC-2024-00065-A
 */

export interface ModuloFormativo {
  codigo: string;
  nombre: string;
  descripcion: string;
  anio: number; // 1, 2 o 3 (año de BT)
}

export interface FiguraProfesional {
  id: string;
  nombre: string;
  familia: string;
  area: "tecnica" | "deportes_salud" | "artistica";
  objetivoGeneral: string;
  modulos: ModuloFormativo[];
}

export interface FamiliaProfesional {
  id: string;
  nombre: string;
  area: "tecnica" | "deportes_salud" | "artistica";
  figuras: string[]; // IDs de figuras profesionales
}

export const AREAS_BT = [
  { id: "tecnica", nombre: "Técnica" },
  { id: "deportes_salud", nombre: "Deportes y Salud" },
  { id: "artistica", nombre: "Artística" },
] as const;

export const FAMILIAS_PROFESIONALES: FamiliaProfesional[] = [
  // Área Técnica
  { id: "administrativa", nombre: "Administrativa y Financiera", area: "tecnica", figuras: ["gestion-administrativa", "gestion-financiera"] },
  { id: "agropecuaria", nombre: "Agropecuaria", area: "tecnica", figuras: ["recursos-hidrobiologicos", "produccion-agropecuaria"] },
  { id: "ambiente", nombre: "Ambiente", area: "tecnica", figuras: ["areas-protegidas", "gestion-ambiental"] },
  { id: "construccion", nombre: "Construcción Sostenible", area: "tecnica", figuras: ["climatizacion", "obra-civil", "construcciones-metalicas", "instalaciones-electricas"] },
  { id: "industrial", nombre: "Industrial", area: "tecnica", figuras: ["electromecanica-industrial", "electromecanica-automotriz", "electronica", "fabricacion-madera", "mecatronica", "procesamiento-alimentos", "produccion-calzado"] },
  { id: "tecnologias", nombre: "Tecnologías", area: "tecnica", figuras: ["ciencia-datos", "desarrollo-software", "redes-telecomunicaciones", "seguridad-informatica", "soporte-informatico"] },
  { id: "turismo", nombre: "Turismo", area: "tecnica", figuras: ["gestion-turistica", "hosteleria-culinario"] },
  // Área Deportes y Salud
  { id: "deportes", nombre: "Deportes", area: "deportes_salud", figuras: ["actividad-fisica", "gestion-deportiva"] },
  { id: "salud-servicio", nombre: "Salud y Servicio", area: "deportes_salud", figuras: ["primera-infancia", "seguridad-ciudadana", "grupos-prioritarios"] },
  // Área Artística
  { id: "artes", nombre: "Artes", area: "deportes_salud", figuras: ["artes-plasticas", "artes-escenicas", "musica"] },
  { id: "diseno", nombre: "Diseño", area: "artistica", figuras: ["diseno-modas", "diseno-grafico"] },
];

export const FIGURAS_PROFESIONALES: FiguraProfesional[] = [
  // === ADMINISTRATIVA Y FINANCIERA ===
  {
    id: "gestion-administrativa",
    nombre: "Gestión Administrativa y Logística",
    familia: "administrativa",
    area: "tecnica",
    objetivoGeneral: "Ejecutar procesos administrativos y logísticos en organizaciones públicas y privadas, aplicando técnicas de gestión documental, atención al cliente y coordinación de recursos, con eficiencia y ética profesional.",
    modulos: [
      { codigo: "GAL.1.1", nombre: "Gestión Documental y Archivo", descripcion: "Organizar, clasificar y gestionar documentos administrativos aplicando normativas de archivo y conservación documental.", anio: 1 },
      { codigo: "GAL.1.2", nombre: "Atención al Cliente", descripcion: "Aplicar técnicas de comunicación y servicio al cliente para satisfacer necesidades de usuarios internos y externos.", anio: 1 },
      { codigo: "GAL.2.1", nombre: "Logística y Cadena de Suministro", descripcion: "Coordinar procesos logísticos de almacenamiento, distribución y transporte de bienes y servicios.", anio: 2 },
      { codigo: "GAL.2.2", nombre: "Administración de Recursos", descripcion: "Gestionar recursos humanos, materiales y financieros de una organización aplicando principios administrativos.", anio: 2 },
      { codigo: "GAL.3.1", nombre: "Emprendimiento y Gestión de Proyectos", descripcion: "Formular y gestionar proyectos productivos y de emprendimiento aplicando metodologías de planificación.", anio: 3 },
    ],
  },
  {
    id: "gestion-financiera",
    nombre: "Gestión Financiera",
    familia: "administrativa",
    area: "tecnica",
    objetivoGeneral: "Realizar operaciones inherentes al manejo del proceso contable en diferentes actividades económicas dando cumplimiento a las obligaciones tributarias mediante la gestión del talento humano con sujeción a las leyes, normas y principios contables.",
    modulos: [
      { codigo: "GF.1.1", nombre: "Contabilidad General", descripcion: "Desarrollar el proceso contable de empresas de servicios y comerciales con sujeción a normas contables, laborales y tributarias.", anio: 1 },
      { codigo: "GF.1.2", nombre: "Contabilidad de Costos", descripcion: "Determinar los costos de producción mediante sistemas de costeo por órdenes y por procesos.", anio: 1 },
      { codigo: "GF.2.1", nombre: "Tributación", descripcion: "Determinar las obligaciones tributarias del sujeto pasivo de conformidad con la normativa vigente del SRI.", anio: 2 },
      { codigo: "GF.2.2", nombre: "Contabilidad Bancaria", descripcion: "Registrar operaciones bancarias activas y pasivas del sistema financiero nacional.", anio: 2 },
      { codigo: "GF.3.1", nombre: "Gestión del Talento Humano", descripcion: "Administrar el talento humano en organizaciones económicas de acuerdo a la normativa laboral vigente.", anio: 3 },
      { codigo: "GF.3.2", nombre: "Paquetes Contables y Tributarios", descripcion: "Utilizar software contable y tributario para procesar datos optimizando tiempo y recursos.", anio: 3 },
    ],
  },
  // === AGROPECUARIA ===
  {
    id: "recursos-hidrobiologicos",
    nombre: "Manejo de Recursos Hidrobiológicos",
    familia: "agropecuaria",
    area: "tecnica",
    objetivoGeneral: "Manejar recursos hidrobiológicos aplicando técnicas de acuicultura, pesca responsable y procesamiento de productos acuáticos, con criterios de sostenibilidad ambiental.",
    modulos: [
      { codigo: "RH.1.1", nombre: "Biología Acuática", descripcion: "Identificar y clasificar organismos acuáticos y sus ecosistemas para el manejo sostenible de recursos hidrobiológicos.", anio: 1 },
      { codigo: "RH.2.1", nombre: "Acuicultura", descripcion: "Aplicar técnicas de cultivo de especies acuáticas en sistemas controlados.", anio: 2 },
      { codigo: "RH.3.1", nombre: "Procesamiento de Productos Acuáticos", descripcion: "Procesar y conservar productos hidrobiológicos aplicando normas de calidad e inocuidad alimentaria.", anio: 3 },
    ],
  },
  {
    id: "produccion-agropecuaria",
    nombre: "Producción Agropecuaria Sostenible",
    familia: "agropecuaria",
    area: "tecnica",
    objetivoGeneral: "Ejecutar procesos de producción agrícola y pecuaria aplicando técnicas sostenibles, manejo integrado de plagas y buenas prácticas agropecuarias para contribuir a la seguridad alimentaria.",
    modulos: [
      { codigo: "PA.1.1", nombre: "Producción Agrícola", descripcion: "Ejecutar labores de preparación de suelo, siembra, mantenimiento y cosecha de cultivos aplicando técnicas agrícolas sostenibles.", anio: 1 },
      { codigo: "PA.1.2", nombre: "Producción Pecuaria", descripcion: "Manejar especies animales menores y mayores aplicando técnicas de alimentación, sanidad y reproducción.", anio: 1 },
      { codigo: "PA.2.1", nombre: "Manejo Integrado de Cultivos", descripcion: "Aplicar técnicas de manejo integrado de plagas, enfermedades y malezas en sistemas productivos.", anio: 2 },
      { codigo: "PA.2.2", nombre: "Maquinaria y Riego Agrícola", descripcion: "Operar maquinaria agrícola y sistemas de riego para optimizar la producción.", anio: 2 },
      { codigo: "PA.3.1", nombre: "Agroindustria", descripcion: "Procesar productos agropecuarios aplicando normas de calidad e inocuidad alimentaria.", anio: 3 },
      { codigo: "PA.3.2", nombre: "Administración Agropecuaria", descripcion: "Gestionar unidades productivas agropecuarias aplicando principios de administración y comercialización.", anio: 3 },
    ],
  },
  // === AMBIENTE ===
  {
    id: "areas-protegidas",
    nombre: "Conservación y Manejo de Áreas Protegidas",
    familia: "ambiente",
    area: "tecnica",
    objetivoGeneral: "Ejecutar actividades de conservación y manejo de áreas protegidas aplicando técnicas de monitoreo ambiental, educación ambiental y gestión de biodiversidad.",
    modulos: [
      { codigo: "AP.1.1", nombre: "Ecología y Biodiversidad", descripcion: "Identificar componentes de ecosistemas y su biodiversidad para fundamentar acciones de conservación.", anio: 1 },
      { codigo: "AP.2.1", nombre: "Manejo de Áreas Naturales", descripcion: "Aplicar técnicas de manejo y monitoreo en áreas naturales protegidas.", anio: 2 },
      { codigo: "AP.3.1", nombre: "Educación y Turismo Ambiental", descripcion: "Diseñar y ejecutar programas de educación ambiental y ecoturismo.", anio: 3 },
    ],
  },
  {
    id: "gestion-ambiental",
    nombre: "Gestión Ambiental y Desarrollo Sostenible",
    familia: "ambiente",
    area: "tecnica",
    objetivoGeneral: "Ejecutar procesos de gestión ambiental aplicando normativas vigentes, técnicas de evaluación de impacto ambiental y estrategias de desarrollo sostenible.",
    modulos: [
      { codigo: "GA.1.1", nombre: "Fundamentos Ambientales", descripcion: "Comprender los principios ecológicos y la normativa ambiental vigente en Ecuador.", anio: 1 },
      { codigo: "GA.2.1", nombre: "Evaluación de Impacto Ambiental", descripcion: "Aplicar metodologías de evaluación de impacto ambiental en proyectos productivos.", anio: 2 },
      { codigo: "GA.3.1", nombre: "Gestión de Residuos y Energías Renovables", descripcion: "Implementar sistemas de gestión de residuos sólidos y aprovechamiento de energías renovables.", anio: 3 },
    ],
  },
  // === CONSTRUCCIÓN SOSTENIBLE ===
  {
    id: "climatizacion",
    nombre: "Climatización",
    familia: "construccion",
    area: "tecnica",
    objetivoGeneral: "Instalar y mantener sistemas de climatización y refrigeración aplicando normativas técnicas y de seguridad vigentes.",
    modulos: [
      { codigo: "CL.1.1", nombre: "Fundamentos de Refrigeración", descripcion: "Comprender los principios termodinámicos aplicados a sistemas de refrigeración y climatización.", anio: 1 },
      { codigo: "CL.2.1", nombre: "Instalación de Sistemas de Climatización", descripcion: "Instalar equipos de aire acondicionado y refrigeración según especificaciones técnicas.", anio: 2 },
      { codigo: "CL.3.1", nombre: "Mantenimiento de Sistemas HVAC", descripcion: "Ejecutar mantenimiento preventivo y correctivo en sistemas de climatización.", anio: 3 },
    ],
  },
  {
    id: "obra-civil",
    nombre: "Construcción de Obra Civil",
    familia: "construccion",
    area: "tecnica",
    objetivoGeneral: "Ejecutar procesos constructivos de obra civil aplicando técnicas, normativas y estándares de calidad y seguridad en la construcción.",
    modulos: [
      { codigo: "OC.1.1", nombre: "Dibujo Técnico y Lectura de Planos", descripcion: "Interpretar y elaborar planos arquitectónicos y estructurales para la construcción.", anio: 1 },
      { codigo: "OC.2.1", nombre: "Procesos Constructivos", descripcion: "Ejecutar procesos de cimentación, estructura, mampostería y acabados en obra civil.", anio: 2 },
      { codigo: "OC.3.1", nombre: "Presupuestos y Administración de Obra", descripcion: "Elaborar presupuestos y cronogramas de obra aplicando técnicas de administración de proyectos.", anio: 3 },
    ],
  },
  {
    id: "construcciones-metalicas",
    nombre: "Estructuras y Construcciones Metálicas",
    familia: "construccion",
    area: "tecnica",
    objetivoGeneral: "Fabricar y montar estructuras metálicas aplicando técnicas de soldadura, corte y conformado de metales según normativas de seguridad.",
    modulos: [
      { codigo: "CM.1.1", nombre: "Metalmecánica Básica", descripcion: "Aplicar técnicas básicas de mecanizado, corte y conformado de metales.", anio: 1 },
      { codigo: "CM.2.1", nombre: "Soldadura y Uniones Metálicas", descripcion: "Ejecutar procesos de soldadura (SMAW, GMAW, GTAW) en estructuras metálicas.", anio: 2 },
      { codigo: "CM.3.1", nombre: "Fabricación de Estructuras", descripcion: "Fabricar y montar estructuras metálicas según planos y especificaciones técnicas.", anio: 3 },
    ],
  },
  {
    id: "instalaciones-electricas",
    nombre: "Instalaciones Eléctricas",
    familia: "construccion",
    area: "tecnica",
    objetivoGeneral: "Diseñar, instalar y mantener instalaciones eléctricas residenciales e industriales aplicando normativas de seguridad y calidad vigentes.",
    modulos: [
      { codigo: "IE.1.1", nombre: "Electricidad Básica", descripcion: "Comprender los fundamentos de electricidad, circuitos y mediciones eléctricas.", anio: 1 },
      { codigo: "IE.2.1", nombre: "Instalaciones Eléctricas Residenciales", descripcion: "Diseñar e instalar sistemas eléctricos residenciales según normativas vigentes.", anio: 2 },
      { codigo: "IE.3.1", nombre: "Instalaciones Eléctricas Industriales", descripcion: "Instalar y mantener sistemas eléctricos industriales y de control.", anio: 3 },
    ],
  },
  // === INDUSTRIAL ===
  {
    id: "electromecanica-industrial",
    nombre: "Electromecánica Industrial",
    familia: "industrial",
    area: "tecnica",
    objetivoGeneral: "Instalar, operar y mantener equipos y sistemas electromecánicos industriales aplicando procedimientos técnicos y normas de seguridad.",
    modulos: [
      { codigo: "EI.1.1", nombre: "Mecánica Industrial Básica", descripcion: "Aplicar técnicas de mecanizado, ajuste y montaje de elementos mecánicos.", anio: 1 },
      { codigo: "EI.2.1", nombre: "Sistemas Eléctricos Industriales", descripcion: "Instalar y mantener sistemas eléctricos y de control en entornos industriales.", anio: 2 },
      { codigo: "EI.3.1", nombre: "Automatización Industrial", descripcion: "Programar y mantener sistemas automatizados con PLCs y sensores industriales.", anio: 3 },
    ],
  },
  {
    id: "electromecanica-automotriz",
    nombre: "Electromecánica Automotriz",
    familia: "industrial",
    area: "tecnica",
    objetivoGeneral: "Diagnosticar, reparar y mantener sistemas mecánicos, eléctricos y electrónicos de vehículos automotores aplicando procedimientos técnicos.",
    modulos: [
      { codigo: "EA.1.1", nombre: "Motores de Combustión Interna", descripcion: "Diagnosticar y reparar motores de combustión interna y sus sistemas auxiliares.", anio: 1 },
      { codigo: "EA.2.1", nombre: "Sistemas Eléctricos y Electrónicos Automotrices", descripcion: "Diagnosticar y reparar sistemas eléctricos y electrónicos del vehículo.", anio: 2 },
      { codigo: "EA.3.1", nombre: "Sistemas de Transmisión y Suspensión", descripcion: "Mantener y reparar sistemas de transmisión, dirección, frenos y suspensión.", anio: 3 },
    ],
  },
  {
    id: "electronica",
    nombre: "Electrónica",
    familia: "industrial",
    area: "tecnica",
    objetivoGeneral: "Diseñar, ensamblar y reparar circuitos y equipos electrónicos aplicando principios de electrónica analógica y digital.",
    modulos: [
      { codigo: "EL.1.1", nombre: "Electrónica Analógica", descripcion: "Analizar y ensamblar circuitos electrónicos analógicos con componentes pasivos y activos.", anio: 1 },
      { codigo: "EL.2.1", nombre: "Electrónica Digital", descripcion: "Diseñar y construir circuitos digitales combinacionales y secuenciales.", anio: 2 },
      { codigo: "EL.3.1", nombre: "Microcontroladores y Sistemas Embebidos", descripcion: "Programar microcontroladores para aplicaciones de control y automatización.", anio: 3 },
    ],
  },
  {
    id: "fabricacion-madera",
    nombre: "Fabricación en Madera",
    familia: "industrial",
    area: "tecnica",
    objetivoGeneral: "Fabricar productos en madera aplicando técnicas de carpintería, ebanistería y acabados según diseños y especificaciones técnicas.",
    modulos: [
      { codigo: "FM.1.1", nombre: "Carpintería Básica", descripcion: "Aplicar técnicas básicas de corte, ensamble y acabado en madera.", anio: 1 },
      { codigo: "FM.2.1", nombre: "Ebanistería y Diseño de Muebles", descripcion: "Diseñar y fabricar muebles aplicando técnicas de ebanistería.", anio: 2 },
      { codigo: "FM.3.1", nombre: "Producción Industrial en Madera", descripcion: "Gestionar procesos de producción industrial de productos en madera.", anio: 3 },
    ],
  },
  {
    id: "mecatronica",
    nombre: "Mecatrónica",
    familia: "industrial",
    area: "tecnica",
    objetivoGeneral: "Integrar sistemas mecánicos, electrónicos, informáticos y de control para diseñar y mantener sistemas mecatrónicos automatizados.",
    modulos: [
      { codigo: "MC.1.1", nombre: "Fundamentos de Mecatrónica", descripcion: "Comprender los principios de mecánica, electrónica y programación aplicados a sistemas mecatrónicos.", anio: 1 },
      { codigo: "MC.2.1", nombre: "Sistemas de Control y Automatización", descripcion: "Diseñar e implementar sistemas de control automático con sensores y actuadores.", anio: 2 },
      { codigo: "MC.3.1", nombre: "Robótica y Sistemas Inteligentes", descripcion: "Programar y mantener robots industriales y sistemas inteligentes de manufactura.", anio: 3 },
    ],
  },
  {
    id: "procesamiento-alimentos",
    nombre: "Conservación y Procesamiento de Alimentos",
    familia: "industrial",
    area: "tecnica",
    objetivoGeneral: "Ejecutar procesos de conservación y transformación de alimentos aplicando normas de calidad, inocuidad y buenas prácticas de manufactura.",
    modulos: [
      { codigo: "CA.1.1", nombre: "Microbiología e Inocuidad Alimentaria", descripcion: "Aplicar principios de microbiología y normativas de inocuidad en la industria alimentaria.", anio: 1 },
      { codigo: "CA.2.1", nombre: "Tecnología de Conservación de Alimentos", descripcion: "Aplicar técnicas de conservación (frío, calor, deshidratación, fermentación) en alimentos.", anio: 2 },
      { codigo: "CA.3.1", nombre: "Procesamiento Industrial de Alimentos", descripcion: "Operar líneas de producción de alimentos procesados aplicando control de calidad.", anio: 3 },
    ],
  },
  {
    id: "produccion-calzado",
    nombre: "Producción de Calzado",
    familia: "industrial",
    area: "tecnica",
    objetivoGeneral: "Diseñar y fabricar calzado aplicando técnicas de patronaje, corte, aparado y montaje según tendencias y estándares de calidad.",
    modulos: [
      { codigo: "PC.1.1", nombre: "Diseño y Patronaje de Calzado", descripcion: "Diseñar modelos de calzado y elaborar patrones según tendencias y especificaciones.", anio: 1 },
      { codigo: "PC.2.1", nombre: "Procesos de Fabricación de Calzado", descripcion: "Ejecutar procesos de corte, aparado, montaje y acabado de calzado.", anio: 2 },
      { codigo: "PC.3.1", nombre: "Control de Calidad y Producción", descripcion: "Gestionar la producción de calzado aplicando control de calidad y optimización de recursos.", anio: 3 },
    ],
  },
  // === TECNOLOGÍAS ===
  {
    id: "ciencia-datos",
    nombre: "Ciencia de Datos",
    familia: "tecnologias",
    area: "tecnica",
    objetivoGeneral: "Recopilar, procesar y analizar datos utilizando herramientas estadísticas y de programación para generar información útil en la toma de decisiones.",
    modulos: [
      { codigo: "CD.1.1", nombre: "Fundamentos de Programación y Estadística", descripcion: "Aplicar conceptos de programación y estadística descriptiva para el tratamiento de datos.", anio: 1 },
      { codigo: "CD.2.1", nombre: "Bases de Datos y Procesamiento de Datos", descripcion: "Diseñar bases de datos y aplicar técnicas de limpieza y transformación de datos.", anio: 2 },
      { codigo: "CD.3.1", nombre: "Análisis y Visualización de Datos", descripcion: "Analizar conjuntos de datos y crear visualizaciones para comunicar hallazgos.", anio: 3 },
    ],
  },
  {
    id: "desarrollo-software",
    nombre: "Desarrollo de Software",
    familia: "tecnologias",
    area: "tecnica",
    objetivoGeneral: "Desarrollar aplicaciones de software aplicando metodologías de desarrollo, lenguajes de programación y buenas prácticas de ingeniería de software.",
    modulos: [
      { codigo: "DS.1.1", nombre: "Algoritmos y Programación", descripcion: "Desarrollar algoritmos y programas utilizando estructuras de datos y control de flujo.", anio: 1 },
      { codigo: "DS.2.1", nombre: "Desarrollo de Aplicaciones Web", descripcion: "Construir aplicaciones web con tecnologías frontend y backend.", anio: 2 },
      { codigo: "DS.3.1", nombre: "Desarrollo de Aplicaciones Móviles", descripcion: "Diseñar y desarrollar aplicaciones móviles multiplataforma.", anio: 3 },
    ],
  },
  {
    id: "redes-telecomunicaciones",
    nombre: "Redes y Telecomunicaciones",
    familia: "tecnologias",
    area: "tecnica",
    objetivoGeneral: "Diseñar, implementar y administrar redes de comunicaciones aplicando protocolos, estándares y normativas de telecomunicaciones.",
    modulos: [
      { codigo: "RT.1.1", nombre: "Fundamentos de Redes", descripcion: "Comprender arquitecturas de red, modelos OSI/TCP-IP y configuración básica de equipos.", anio: 1 },
      { codigo: "RT.2.1", nombre: "Administración de Redes", descripcion: "Configurar y administrar servicios de red, servidores y equipos de comunicación.", anio: 2 },
      { codigo: "RT.3.1", nombre: "Telecomunicaciones y Conectividad", descripcion: "Implementar soluciones de telecomunicaciones y conectividad empresarial.", anio: 3 },
    ],
  },
  {
    id: "seguridad-informatica",
    nombre: "Seguridad Informática",
    familia: "tecnologias",
    area: "tecnica",
    objetivoGeneral: "Implementar medidas de seguridad informática para proteger sistemas, redes y datos aplicando estándares y buenas prácticas de ciberseguridad.",
    modulos: [
      { codigo: "SI.1.1", nombre: "Fundamentos de Seguridad Informática", descripcion: "Comprender amenazas, vulnerabilidades y principios de seguridad de la información.", anio: 1 },
      { codigo: "SI.2.1", nombre: "Seguridad de Redes y Sistemas", descripcion: "Implementar controles de seguridad en redes, sistemas operativos y aplicaciones.", anio: 2 },
      { codigo: "SI.3.1", nombre: "Auditoría y Respuesta a Incidentes", descripcion: "Ejecutar auditorías de seguridad y planes de respuesta ante incidentes informáticos.", anio: 3 },
    ],
  },
  {
    id: "soporte-informatico",
    nombre: "Soporte Informático",
    familia: "tecnologias",
    area: "tecnica",
    objetivoGeneral: "Optimizar el tratamiento de la información mediante el procesamiento automático utilizando herramientas ofimáticas, redes informáticas, sistemas operativos y soporte técnico.",
    modulos: [
      { codigo: "SIN.1.1", nombre: "Aplicaciones Ofimáticas", descripcion: "Procesar información utilizando herramientas ofimáticas locales y en línea según requerimientos del usuario.", anio: 1 },
      { codigo: "SIN.1.2", nombre: "Sistemas Operativos y Redes", descripcion: "Implantar y mantener sistemas operativos y redes utilizando recursos físicos y lógicos.", anio: 1 },
      { codigo: "SIN.2.1", nombre: "Programación y Bases de Datos", descripcion: "Desarrollar sistemas informáticos con lenguajes de programación y bases de datos.", anio: 2 },
      { codigo: "SIN.2.2", nombre: "Soporte Técnico", descripcion: "Ejecutar procesos de soporte técnico en equipos informáticos mediante normas y procedimientos.", anio: 2 },
      { codigo: "SIN.3.1", nombre: "Diseño y Desarrollo Web", descripcion: "Diseñar y construir soluciones web con interfaz amigable empleando herramientas multimedia.", anio: 3 },
    ],
  },
  // === TURISMO ===
  {
    id: "gestion-turistica",
    nombre: "Gestión Turística",
    familia: "turismo",
    area: "tecnica",
    objetivoGeneral: "Gestionar servicios turísticos aplicando técnicas de planificación, promoción y operación turística para satisfacer las necesidades del visitante.",
    modulos: [
      { codigo: "GT.1.1", nombre: "Fundamentos del Turismo", descripcion: "Comprender la industria turística, sus componentes y la oferta turística del Ecuador.", anio: 1 },
      { codigo: "GT.2.1", nombre: "Operación Turística", descripcion: "Planificar y operar paquetes turísticos, guianza y servicios de información.", anio: 2 },
      { codigo: "GT.3.1", nombre: "Marketing y Gestión Turística", descripcion: "Aplicar estrategias de marketing digital y gestión empresarial en el sector turístico.", anio: 3 },
    ],
  },
  {
    id: "hosteleria-culinario",
    nombre: "Hostelería y Arte Culinario",
    familia: "turismo",
    area: "tecnica",
    objetivoGeneral: "Gestionar servicios de alojamiento y gastronomía aplicando técnicas culinarias, servicio al cliente y administración hotelera.",
    modulos: [
      { codigo: "HC.1.1", nombre: "Cocina Básica y Manipulación de Alimentos", descripcion: "Aplicar técnicas culinarias básicas y normas de manipulación e higiene de alimentos.", anio: 1 },
      { codigo: "HC.2.1", nombre: "Gastronomía Nacional e Internacional", descripcion: "Preparar platos de la gastronomía ecuatoriana e internacional aplicando técnicas avanzadas.", anio: 2 },
      { codigo: "HC.3.1", nombre: "Gestión Hotelera y Servicio", descripcion: "Administrar servicios de alojamiento, recepción y atención al huésped.", anio: 3 },
    ],
  },
  // === DEPORTES ===
  {
    id: "actividad-fisica",
    nombre: "Actividad Física, Deporte y Recreación",
    familia: "deportes",
    area: "deportes_salud",
    objetivoGeneral: "Planificar y ejecutar programas de actividad física, deporte y recreación aplicando principios de entrenamiento deportivo y promoción de la salud.",
    modulos: [
      { codigo: "AF.1.1", nombre: "Fundamentos de la Actividad Física", descripcion: "Comprender principios anatómicos, fisiológicos y biomecánicos del movimiento humano.", anio: 1 },
      { codigo: "AF.2.1", nombre: "Entrenamiento Deportivo", descripcion: "Planificar y dirigir sesiones de entrenamiento deportivo aplicando metodologías.", anio: 2 },
      { codigo: "AF.3.1", nombre: "Recreación y Gestión Deportiva", descripcion: "Organizar eventos deportivos y programas recreativos para diferentes poblaciones.", anio: 3 },
    ],
  },
  {
    id: "gestion-deportiva",
    nombre: "Gestión Deportiva y Cultural",
    familia: "deportes",
    area: "deportes_salud",
    objetivoGeneral: "Gestionar organizaciones deportivas y culturales aplicando principios de administración, planificación de eventos y promoción deportiva.",
    modulos: [
      { codigo: "GD.1.1", nombre: "Administración Deportiva", descripcion: "Aplicar principios de administración en organizaciones deportivas y culturales.", anio: 1 },
      { codigo: "GD.2.1", nombre: "Planificación de Eventos", descripcion: "Planificar y ejecutar eventos deportivos y culturales.", anio: 2 },
      { codigo: "GD.3.1", nombre: "Marketing Deportivo", descripcion: "Aplicar estrategias de marketing y comunicación en el ámbito deportivo y cultural.", anio: 3 },
    ],
  },
  // === SALUD Y SERVICIO ===
  {
    id: "primera-infancia",
    nombre: "Atención a la Primera Infancia",
    familia: "salud-servicio",
    area: "deportes_salud",
    objetivoGeneral: "Atender integralmente a niños y niñas de 0 a 5 años aplicando técnicas de estimulación temprana, cuidado y educación inicial.",
    modulos: [
      { codigo: "PI.1.1", nombre: "Desarrollo Infantil", descripcion: "Comprender las etapas del desarrollo infantil y sus necesidades en la primera infancia.", anio: 1 },
      { codigo: "PI.2.1", nombre: "Estimulación Temprana", descripcion: "Aplicar técnicas de estimulación temprana para el desarrollo integral del niño.", anio: 2 },
      { codigo: "PI.3.1", nombre: "Educación Inicial y Cuidado", descripcion: "Planificar y ejecutar actividades educativas y de cuidado para la primera infancia.", anio: 3 },
    ],
  },
  {
    id: "seguridad-ciudadana",
    nombre: "Seguridad Ciudadana",
    familia: "salud-servicio",
    area: "deportes_salud",
    objetivoGeneral: "Ejecutar acciones de seguridad ciudadana, prevención de riesgos y atención de emergencias aplicando protocolos y normativas vigentes.",
    modulos: [
      { codigo: "SC.1.1", nombre: "Fundamentos de Seguridad", descripcion: "Comprender marcos legales, derechos humanos y principios de seguridad ciudadana.", anio: 1 },
      { codigo: "SC.2.1", nombre: "Prevención y Gestión de Riesgos", descripcion: "Aplicar técnicas de prevención de riesgos y gestión de emergencias.", anio: 2 },
      { codigo: "SC.3.1", nombre: "Primeros Auxilios y Protección Civil", descripcion: "Ejecutar protocolos de primeros auxilios y protección civil ante emergencias.", anio: 3 },
    ],
  },
  {
    id: "grupos-prioritarios",
    nombre: "Asistencia y Cuidado a Grupos Prioritarios",
    familia: "salud-servicio",
    area: "deportes_salud",
    objetivoGeneral: "Brindar asistencia y cuidado a personas de grupos prioritarios (adultos mayores, personas con discapacidad) aplicando técnicas de atención integral.",
    modulos: [
      { codigo: "GP.1.1", nombre: "Fundamentos de Atención Social", descripcion: "Comprender las necesidades de grupos prioritarios y el marco legal de protección.", anio: 1 },
      { codigo: "GP.2.1", nombre: "Cuidado y Asistencia", descripcion: "Aplicar técnicas de cuidado personal, movilización y acompañamiento a grupos prioritarios.", anio: 2 },
      { codigo: "GP.3.1", nombre: "Inclusión y Desarrollo Comunitario", descripcion: "Ejecutar programas de inclusión social y desarrollo comunitario.", anio: 3 },
    ],
  },
  // === ARTES ===
  {
    id: "artes-plasticas",
    nombre: "Gestión Cultural y Artes Plásticas",
    familia: "artes",
    area: "artistica",
    objetivoGeneral: "Crear obras de artes plásticas y gestionar proyectos culturales aplicando técnicas artísticas y principios de gestión cultural.",
    modulos: [
      { codigo: "APL.1.1", nombre: "Fundamentos de Artes Plásticas", descripcion: "Aplicar técnicas de dibujo, pintura y escultura como medios de expresión artística.", anio: 1 },
      { codigo: "APL.2.1", nombre: "Técnicas Artísticas Avanzadas", descripcion: "Desarrollar proyectos artísticos con técnicas mixtas y materiales diversos.", anio: 2 },
      { codigo: "APL.3.1", nombre: "Gestión Cultural y Curaduría", descripcion: "Gestionar proyectos culturales, exposiciones y espacios artísticos.", anio: 3 },
    ],
  },
  {
    id: "artes-escenicas",
    nombre: "Gestión Cultural y Artes Escénicas",
    familia: "artes",
    area: "artistica",
    objetivoGeneral: "Crear y producir obras de artes escénicas (teatro, danza) y gestionar proyectos culturales aplicando técnicas de interpretación y producción.",
    modulos: [
      { codigo: "AE.1.1", nombre: "Expresión Corporal y Teatral", descripcion: "Desarrollar habilidades de expresión corporal, vocal y teatral.", anio: 1 },
      { codigo: "AE.2.1", nombre: "Producción Escénica", descripcion: "Producir montajes escénicos integrando actuación, dirección y diseño.", anio: 2 },
      { codigo: "AE.3.1", nombre: "Gestión de Proyectos Escénicos", descripcion: "Gestionar proyectos de artes escénicas y festivales culturales.", anio: 3 },
    ],
  },
  {
    id: "musica",
    nombre: "Gestión Cultural y Música",
    familia: "artes",
    area: "artistica",
    objetivoGeneral: "Interpretar y producir música aplicando técnicas instrumentales, vocales y de producción musical, y gestionar proyectos culturales musicales.",
    modulos: [
      { codigo: "MU.1.1", nombre: "Lenguaje Musical y Práctica Instrumental", descripcion: "Desarrollar habilidades de lectura musical e interpretación instrumental.", anio: 1 },
      { codigo: "MU.2.1", nombre: "Ensamble y Producción Musical", descripcion: "Participar en ensambles musicales y aplicar técnicas de producción y grabación.", anio: 2 },
      { codigo: "MU.3.1", nombre: "Gestión de Proyectos Musicales", descripcion: "Gestionar proyectos musicales, eventos y emprendimientos culturales.", anio: 3 },
    ],
  },
  // === DISEÑO ===
  {
    id: "diseno-modas",
    nombre: "Diseño de Modas",
    familia: "diseno",
    area: "artistica",
    objetivoGeneral: "Diseñar y confeccionar prendas de vestir aplicando técnicas de patronaje, corte, confección y tendencias de moda.",
    modulos: [
      { codigo: "DM.1.1", nombre: "Diseño y Patronaje", descripcion: "Diseñar prendas de vestir y elaborar patrones según tendencias y especificaciones.", anio: 1 },
      { codigo: "DM.2.1", nombre: "Confección y Acabados", descripcion: "Confeccionar prendas aplicando técnicas de corte, costura y acabados textiles.", anio: 2 },
      { codigo: "DM.3.1", nombre: "Producción y Comercialización de Moda", descripcion: "Gestionar la producción y comercialización de colecciones de moda.", anio: 3 },
    ],
  },
  {
    id: "diseno-grafico",
    nombre: "Diseño Gráfico y Multimedia",
    familia: "diseno",
    area: "artistica",
    objetivoGeneral: "Crear productos de comunicación visual y multimedia aplicando principios de diseño gráfico, herramientas digitales y técnicas de producción audiovisual.",
    modulos: [
      { codigo: "DG.1.1", nombre: "Fundamentos de Diseño Gráfico", descripcion: "Aplicar principios de composición, color y tipografía en productos de comunicación visual.", anio: 1 },
      { codigo: "DG.2.1", nombre: "Diseño Digital y Multimedia", descripcion: "Crear productos multimedia (animación, video, web) con herramientas digitales.", anio: 2 },
      { codigo: "DG.3.1", nombre: "Producción Gráfica y Branding", descripcion: "Desarrollar identidad visual corporativa y gestionar producción gráfica.", anio: 3 },
    ],
  },
];

/**
 * Obtener familias profesionales por área
 */
export function obtenerFamiliasPorArea(area: string): FamiliaProfesional[] {
  return FAMILIAS_PROFESIONALES.filter((f) => f.area === area);
}

/**
 * Obtener figuras profesionales por familia
 */
export function obtenerFigurasPorFamilia(familiaId: string): FiguraProfesional[] {
  const familia = FAMILIAS_PROFESIONALES.find((f) => f.id === familiaId);
  if (!familia) return [];
  return FIGURAS_PROFESIONALES.filter((fig) => familia.figuras.includes(fig.id));
}

/**
 * Obtener una figura profesional por su ID
 */
export function obtenerFiguraPorId(figuraId: string): FiguraProfesional | undefined {
  return FIGURAS_PROFESIONALES.find((f) => f.id === figuraId);
}

/**
 * Obtener módulos formativos de una figura profesional por año
 */
export function obtenerModulosPorAnio(figuraId: string, anio: number): ModuloFormativo[] {
  const figura = FIGURAS_PROFESIONALES.find((f) => f.id === figuraId);
  if (!figura) return [];
  return figura.modulos.filter((m) => m.anio === anio);
}

/**
 * Obtener todos los módulos de una figura profesional
 */
export function obtenerTodosLosModulos(figuraId: string): ModuloFormativo[] {
  const figura = FIGURAS_PROFESIONALES.find((f) => f.id === figuraId);
  if (!figura) return [];
  return figura.modulos;
}
