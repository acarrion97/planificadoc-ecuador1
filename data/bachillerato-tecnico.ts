/**
 * Datos del Bachillerato Técnico - Catálogo de Figuras Profesionales
 * Fuente: Acuerdo Ministerial Nro. MINEDUC-MINEDUC-2024-00065-A
 */
import type { ModuloFormativoBTExtras } from "./types-bt";
import { obtenerUnidadesCompetenciaDeModulo } from "./bachillerato-tecnico-uc";

export interface ModuloFormativo extends Partial<ModuloFormativoBTExtras> {
  codigo: string;
  nombre: string;
  descripcion: string;
  anio: number; // 1, 2 o 3 (año de inicio de BT; ver duracionPeriodos para el detalle por año)
}

export interface FiguraProfesional {
  id: string;
  nombre: string;
  familia: string;
  area: "tecnica" | "deportes_salud" | "artistica";
  objetivoGeneral: string;
  modulos: ModuloFormativo[];
  /** Código oficial MINEDUC de la figura (DS-xx / AR-xx / TC-xx-xx) */
  codigo?: string;
  /** Estado del catálogo. Ausente equivale a "activa". */
  estado?: "activa" | "deprecada";
  /** ID de la figura que la reemplaza (solo si estado === "deprecada") */
  reemplazadaPor?: string;
  /** Acuerdo ministerial que establece la vigencia de esta figura */
  normativaVigente?: string;
}

export interface FamiliaProfesional {
  id: string;
  nombre: string;
  area: "tecnica" | "deportes_salud" | "artistica";
  figuras: string[]; // IDs de figuras profesionales
}

/**
 * Módulos de la figura histórica `construcciones-metalicas` (00065-A),
 * reutilizados por referencia en `mecanica-industrial` (00051-A) porque
 * representan el currículo de mecanizado/soldadura de la Mecánica industrial.
 * Se comparten para que la figura deprecada conserve sus módulos (planes
 * históricos reproducibles) sin duplicar el catálogo.
 */
const MODULOS_MECANICA_INDUSTRIAL: ModuloFormativo[] = [
  { codigo: "CM.1.1", nombre: "Metalmecánica Básica", descripcion: "Aplicar técnicas básicas de mecanizado, corte y conformado de metales.", anio: 1 , categoria: "generico", estadoCatalogo: "completo", nivel: "1ro, 2do", objetivoModulo: "Comprender la interrelación entre los sistemas ambientales y sociales, analizando las problemáticas que afectan al entorno natural y humano, para fomentar una conciencia crítica, responsable y participativa orientada a la conservación del ambiente, la equidad social y el desarrollo sostenible.", resultadosAprendizaje:[{id:"CMA-RA.1",texto:"RA1: Reconocer los principios y conceptos de conservación ambiental y desarrollo sostenible.",criteriosEvaluacion:[{id:"CMA-CE1.1",texto:"CE1.1: Comprende los conceptos de conservación ambiental, sostenibilidad y desarrollo social."},{id:"CMA-CE1.2",texto:"CE1.2: Establece la relación entre los ecosistemas, recursos naturales y actividades humanas."},{id:"CMA-CE1.3",texto:"CE1.3: Realiza estudios de caso, observaciones de campo, registros de consumo de recursos, para analizar los impactos de las acciones humanas sobre el entorno, aplicando criterios de sostenibilidad y conservación ambiental."},{id:"CMA-CE1.4",texto:"CE1.4: Aplica los principios y conceptos de conservación ambiental y sostenibilidad a situaciones de la vida cotidiana o proyectos comunitarios"}]},{id:"CMA-RA.2",texto:"RA2: Promover el uso responsable de los recursos naturales, implementando estrategias de reducción, reutilización y reciclaje, asegurando el cumplimiento de normas de manejo ambiental y criterios de sostenibilidad.",criteriosEvaluacion:[{id:"CMA-CE2.1",texto:"CE2.1: Emplea estrategias de reducción, reutilización y reciclaje de recursos, siguiendo los procedimientos adecuados y utilizando materiales disponibles, respetando normas de manejo de residuos y criterios de sostenibilidad."},{id:"CMA-CE2.2",texto:"CE2.2: Fomenta el uso responsable de los recursos naturales como agua, energía y materiales, aplicando protocolos de eficiencia y cuidado ambiental en actividades escolares, comunitarias o familiares."},{id:"CMA-CE2.3",texto:"CE2.3: Utiliza los recursos naturales de manera responsable, cumpliendo normas de cuidado ambiental."},{id:"CMA-CE2.4",texto:"CE2.4: Promueve acciones de conservación ambiental en proyectos escolares, comunitarios o familiares, evaluando su efectividad."}]},{id:"CMA-RA.3",texto:"RA3: Elaborar propuestas de conservación, recuperación y restauración orientadas a la protección de especies animales y vegetales.",criteriosEvaluacion:[{id:"CMA-CE3.1",texto:"CE3.1: Identifica amenazas y oportunidades para la conservación de especies animales y vegetales, utilizando estudios de campo, registros y fuentes bibliográficas o digitales."},{id:"CMA-CE3.2",texto:"CE3.2: Establece objetivos y metas para la conservación, recuperación o restauración de especies, considerando criterios de sostenibilidad, normas ambientales y buenas prácticas de manejo de fauna y flora."},{id:"CMA-CE3.3",texto:"CE3.3: Establece estrategias y acciones específicas para la protección de especies, incorporando técnicas de conservación, restauración ecológica y participación comunitaria, adecuadas a los recursos disponibles y al contexto local."},{id:"CMA-CE3.4",texto:"CE3.4: Evalúa la viabilidad y el impacto de las propuestas, proponiendo ajustes para optimizar la eficacia de las acciones, promoviendo la sostenibilidad ambiental y social de los proyectos."}]},{id:"CMA-RA.4",texto:"RA4: Promover la responsabilidad social y el compromiso ambiental mediante proyectos que articulen desarrollo humano y sostenibilidad.",criteriosEvaluacion:[{id:"CMA-CE4.1",texto:"CE4.1: Reconoce las necesidades sociales y ambientales del entorno, para promover el desarrollo humano y la sostenibilidad mediante proyectos comunitarios o escolares."},{id:"CMA-CE4.2",texto:"CE4.2: Propone iniciativas y estrategias que integren acciones de cuidado ambiental con el fortalecimiento de capacidades y bienestar de la comunidad, considerando criterios de sostenibilidad y normas ambientales."},{id:"CMA-CE4.3",texto:"CE4.3: Implementa proyectos de responsabilidad social y ambiental, coordinando la participación de la comunidad y promoviendo hábitos sostenibles, cooperación y compromiso colectivo."},{id:"CMA-CE4.4",texto:"CE4.4: Evalúa los resultados e impactos de los proyectos ejecutados, proponiendo mejoras que optimicen la eficacia de las acciones y potencien la integración entre desarrollo humano y sostenibilidad."}]}]},
  { codigo: "CM.2.1", nombre: "Soldadura y Uniones Metálicas", descripcion: "Ejecutar procesos de soldadura (SMAW, GMAW, GTAW) en estructuras metálicas.", anio: 2 },
  { codigo: "CM.3.1", nombre: "Fabricación de Estructuras", descripcion: "Fabricar y montar estructuras metálicas según planos y especificaciones técnicas.", anio: 3 },
];

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
  { id: "construccion", nombre: "Construcción Sostenible", area: "tecnica", figuras: ["obra-civil"] },
  { id: "industrial", nombre: "Industrial", area: "tecnica", figuras: ["electromecanica-industrial", "electromecanica-automotriz", "electronica", "fabricacion-madera", "mecatronica", "procesamiento-alimentos", "produccion-calzado", "mecanica-industrial", "instalaciones-electricas", "climatizacion"] },
  { id: "tecnologias", nombre: "Tecnologías", area: "tecnica", figuras: ["ciencia-datos", "desarrollo-software", "redes-telecomunicaciones", "seguridad-informatica", "soporte-informatico"] },
  { id: "turismo", nombre: "Turismo", area: "tecnica", figuras: ["gestion-turistica", "hosteleria-culinario"] },
  // Área Deportes y Salud
  { id: "deportes", nombre: "Deportes", area: "deportes_salud", figuras: ["actividad-fisica", "gestion-deportiva"] },
  { id: "salud-servicio", nombre: "Salud y Servicio", area: "deportes_salud", figuras: ["primera-infancia", "seguridad-ciudadana", "grupos-prioritarios"] },
  // Área Artística
  { id: "artes", nombre: "Artes", area: "artistica", figuras: ["artes-plasticas", "artes-escenicas", "musica"] },
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
      { codigo: "GAL.1.1", nombre: "Gestión Documental y Archivo", descripcion: "Organizar, clasificar y gestionar documentos administrativos aplicando normativas de archivo y conservación documental.", anio: 1 , categoria: "generico", estadoCatalogo: "completo", nivel: "1ro, 2do", objetivoModulo: "Emplear herramientas informáticas empresariales en entornos estudiantiles, personales, familiares y laborales, para optimizar tareas administrativas, financieras y de gestión, con criterios de eficiencia y seguridad", resultadosAprendizaje:[{id:"GAL-RA.1",texto:"RA1: Utilizar herramientas informáticas empresariales para registrar transacciones financieras, elaborar reportes y gestionar datos, siguiendo protocolos establecidos.",criteriosEvaluacion:[{id:"GAL-CE1.1",texto:"CE1.1: Describe las funcionalidades básicas de las herramientas informáticas empresariales y los protocolos establecidos para el registro de información financiera"},{id:"GAL-CE1.2",texto:"CE1.2: Registra transacciones financieras utilizando herramientas informáticas empresariales, cumpliendo con los formatos y procedimientos definidos."},{id:"GAL-CE1.3",texto:"CE1.3: Genera reportes y gestiona datos financieros con precisión, aplicando funciones y comandos adecuados dentro del entorno digital, respetando los protocolos de seguridad y confidencialidad."}]},{id:"GAL-RA.2",texto:"RA2: Aplicar funciones avanzadas de hojas de cálculo y sistemas de gestión de datos para resolver situaciones administrativas o financieras, asegurando precisión en el procesamiento de la información y cumplimiento de normas de seguridad digital.",criteriosEvaluacion:[{id:"GAL-CE2.1",texto:"CE2.1: Explica el propósito y funcionamiento de funciones avanzadas en hojas de cálculo y sistemas de gestión de datos, así como la importancia de las normas de seguridad digital en el manejo de información administrativa y financiera."},{id:"GAL-CE2.2",texto:"CE2.2: Utiliza funciones avanzadas de hojas de cálculo para procesar datos administrativos o financieros, aplicando fórmulas, tablas dinámicas y herramientas de análisis para obtener resultados precisos."},{id:"GAL-CE2.3",texto:"CE2.3: Aplica normas y protocolos de seguridad digital durante la gestión y procesamiento de datos en sistemas informáticos, garantizando la integridad y confidencialidad de la información."}]},{id:"GAL-RA.3",texto:"RA3: Analizar información financiera y administrativa mediante tablas dinámicas, gráficos y comparativos, identificando discrepancias o tendencias relevantes para la toma de decisiones.",criteriosEvaluacion:[{id:"GAL-CE3.1",texto:"CE3.1: Describe la función y utilidad de las tablas dinámicas, gráficos y comparativos en el análisis de información financiera y administrativa."},{id:"GAL-CE3.2",texto:"CE3.2: Construye tablas dinámicas, gráficos y comparativos a partir de datos financieros y administrativos para organizar y visualizar información relevante."},{id:"GAL-CE3.3",texto:"CE3.3: Identifica discrepancias y tendencias significativas en los análisis realizados y explica su impacto en la toma de decisiones administrativas o financieras."}]}]},
      { codigo: "GAL.1.2", nombre: "Atención al Cliente", descripcion: "Aplicar técnicas de comunicación y servicio al cliente para satisfacer necesidades de usuarios internos y externos.", anio: 1 , categoria: "generico", estadoCatalogo: "completo", nivel: "Bachillerato 1ro y 2do", objetivoModulo: "Aplicar conocimientos de gestión contable y administración financiera para evaluar condiciones financieras y colaborar activamente con el equipo de trabajo, y utilizando principios de economía circular para optimizar recursos, reducir el impacto ambiental y mantener relaciones laborales, familiares y personales equilibradas", resultadosAprendizaje:[{id:"GAL-RA.1",texto:"RA1: Aplicar fundamentos de administración en el diseño de estructuras organizacionales y procesos, bajo normativas laborales y principios éticos y criterios de economía circular",criteriosEvaluacion:[{id:"GAL-CE1.1",texto:"CE1.1: Explica los elementos básicos de una estructura organizacional (jerarquías, departamentos) y normativas laborales ecuatorianas, aplicándolos en casos simulados"},{id:"GAL-CE1.2",texto:"CE1.2: Aplica procedimientos administrativos en casos reales o simulados, identificando aspectos que contribuyen a la eficiencia y proponiendo mejoras sencillas basadas en principios de calidad y ética profesional."},{id:"GAL-CE1.3",texto:"CE1.3: Incorpora criterios éticos y de economía circular en la propuesta de mejoras a procesos administrativos, promoviendo la sostenibilidad organizacional."}]},{id:"GAL-RA.2",texto:"RA2: Registrar operaciones contables en libros diarios y mayores según PCGE, asegurando el cumplimiento de normativas tributarias y considerando criterios de sostenibilidad y uso eficiente de recursos en el contexto de la economía circular.",criteriosEvaluacion:[{id:"GAL-CE2.1",texto:"CE2.1: Identifica las cuentas contables según el Plan Contable General Ecuatoriano (PCGE) para registrar transacciones básicas"},{id:"GAL-CE2.2",texto:"CE2.2: Recopila operaciones contables en libros diario y mayor, aplicando principios de partida doble y normativas tributarias básicas (IVA, retenciones)."},{id:"GAL-CE2.3",texto:"CE2.3: Aplica criterios de sostenibilidad y uso eficiente de recursos al momento de registrar y analizar las operaciones contables"},{id:"GAL-CE2.4",texto:"CE2.4: Elabora un ciclo contable completo para una PYME simulada, integrando registros, ajustes básicos y cumplimiento de obligaciones tributarias"}]},{id:"GAL-RA.3",texto:"RA3: Calcular costos de producción, servicios o comercio, determinando puntos de equilibrio y elaborando presupuestos con enfoque en economía circular.",criteriosEvaluacion:[{id:"GAL-CE3.1",texto:"CE3.1: Analiza costos fijos, variables y totales en actividades de producción, comercio o servicios, identificando oportunidades para reducir el uso de recursos y reutilizar materiales, de acuerdo con los principios de economía circular."},{id:"GAL-CE3.2",texto:"CE3.2: Determina el punto de equilibrio en diferentes tipos de proyectos o emprendimientos, evaluando su viabilidad económica y su contribución a la reducción de residuos y aprovechamiento de insumos."},{id:"GAL-CE3.3",texto:"CE3.3: Compara presupuestos operativos y financieros básicos con los resultados reales o proyectados, identificando desviaciones y analizando el impacto económico y ambiental de las decisiones tomadas."},{id:"GAL-CE3.4",texto:"CE3.4: Diseña un plan de costos y presupuesto para un emprendimiento productivo o comercial (real o simulado), integrando el análisis de equilibrio y estrategias de economía circular, como la reutilización de insumos, el reciclaje o la mejora en la eficiencia energética."}]},{id:"GAL-RA.4",texto:"RA4: Aplicar técnicas de análisis financiero para interpretar estados financieros (Balance General, Estado de Resultados) y flujos de caja, evaluando la situación económica de una organización e identificando oportunidades de mejora con base en principios de economía circular.",criteriosEvaluacion:[{id:"GAL-CE4.1",texto:"CE4.1: Describe los componentes clave del Balance General, Estado de Resultados y Flujo de Caja, explicando su interrelación."},{id:"GAL-CE4.2",texto:"CE4.2: Calcula ratios financieros (liquidez, endeudamiento, rentabilidad) para diagnosticar la situación económica de una organización."},{id:"GAL-CE4.3",texto:"CE4.3: Emplea técnicas básicas para revisar estados financieros y flujos de caja, identificando posibles incongruencias o riesgos financieros."},{id:"GAL-CE4.4",texto:"CE4.4: Incorpora criterios de economía circular para identificar prácticas que mejoren la eficiencia y sostenibilidad financiera dentro del análisis financiero."}]},{id:"GAL-RA.5",texto:"RA5: Evaluar alternativas de inversión y financiamiento (créditos, préstamos), considerando costos, riesgos y beneficios y su contribución al uso eficiente de recursos y la sostenibilidad económica y ambiental.",criteriosEvaluacion:[{id:"GAL-CE5.1",texto:"CE5.1: Describe las características principales de diferentes alternativas de inversión y financiamiento, incluyendo créditos y préstamos."},{id:"GAL-CE5.2",texto:"CE5.2: Utiliza métodos para valorar alternativas de inversión y financiamiento considerando costos, riesgos y beneficios."},{id:"GAL-CE5.3",texto:"CE5.3: Aplica criterios de sostenibilidad y economía circular para valorar la contribución de las alternativas a la eficiencia y sustentabilidad."},{id:"GAL-CE5.4",texto:"CE5.4: Analiza diferentes alternativas de inversión y financiamiento, proponiendo la opción más adecuada que optimice recursos y minimice impactos."}]},{id:"GAL-RA.6",texto:"RA6: Emplear procesos de control interno para verificar el cumplimiento normativo, mejorar la eficiencia operativa y promover prácticas sostenibles que optimicen el uso de recursos y minimicen impactos ambientales, en concordancia con los principios de economía circular.",criteriosEvaluacion:[{id:"GAL-CE6.1",texto:"CE6.1: Identifica los elementos y objetivos del control interno en contextos administrativos y contables."},{id:"GAL-CE6.2",texto:"CE6.2: Aplica procedimientos básicos de control interno en actividades simuladas o reales, como manejo de inventarios, caja chica o archivos."},{id:"GAL-CE6.3",texto:"CE6.3: Utiliza prácticas sostenibles dentro de los procesos de control interno para optimizar el uso de recursos y reducir impactos ambientales."},{id:"GAL-CE6.4",texto:"CE6.4: Propone mejoras a partir del análisis de los resultados del control interno para identificar oportunidades de mejora que integren eficiencia operativa y sostenibilidad ambiental."}]}]},
      { codigo: "GAL.2.1", nombre: "Logística y Cadena de Suministro", descripcion: "Coordinar procesos logísticos de almacenamiento, distribución y transporte de bienes y servicios.", anio: 2 },
      { codigo: "GAL.2.2", nombre: "Administración de Recursos", descripcion: "Gestionar recursos humanos, materiales y financieros de una organización aplicando principios administrativos.", anio: 2 },
      { codigo: "GAL.3.1", nombre: "Emprendimiento y Gestión de Proyectos", descripcion: "Formular y gestionar proyectos productivos y de emprendimiento aplicando metodologías de planificación.", anio: 3 },
    ],
  },
  {
    id: "gestion-financiera",
    nombre: "Gestión financiera y contable",
    familia: "administrativa",
    area: "tecnica",
    codigo: "TC-01-01",
    normativaVigente: "MINEDEC-MINEDEC-2025-00051-A",
    objetivoGeneral: "Realizar operaciones inherentes al manejo del proceso contable en diferentes actividades económicas dando cumplimiento a las obligaciones tributarias mediante la gestión del talento humano con sujeción a las leyes, normas y principios contables.",
    modulos: [
      { codigo: "GF.1.1", nombre: "Contabilidad General", descripcion: "Desarrollar el proceso contable de empresas de servicios y comerciales con sujeción a normas contables, laborales y tributarias.", anio: 1 , categoria: "generico", estadoCatalogo: "completo", nivel: "1ro, 2do", objetivoModulo: "Emplear herramientas informáticas empresariales en entornos estudiantiles, personales, familiares y laborales, para optimizar tareas administrativas, financieras y de gestión, con criterios de eficiencia y seguridad", resultadosAprendizaje:[{id:"GFC-RA.1",texto:"RA1: Utilizar herramientas informáticas empresariales para registrar transacciones financieras, elaborar reportes y gestionar datos, siguiendo protocolos establecidos.",criteriosEvaluacion:[{id:"GFC-CE1.1",texto:"CE1.1: Describe las funcionalidades básicas de las herramientas informáticas empresariales y los protocolos establecidos para el registro de información financiera"},{id:"GFC-CE1.2",texto:"CE1.2: Registra transacciones financieras utilizando herramientas informáticas empresariales, cumpliendo con los formatos y procedimientos definidos."},{id:"GFC-CE1.3",texto:"CE1.3: Genera reportes y gestiona datos financieros con precisión, aplicando funciones y comandos adecuados dentro del entorno digital, respetando los protocolos de seguridad y confidencialidad."}]},{id:"GFC-RA.2",texto:"RA2: Aplicar funciones avanzadas de hojas de cálculo y sistemas de gestión de datos para resolver situaciones administrativas o financieras, asegurando precisión en el procesamiento de la información y cumplimiento de normas de seguridad digital.",criteriosEvaluacion:[{id:"GFC-CE2.1",texto:"CE2.1: Explica el propósito y funcionamiento de funciones avanzadas en hojas de cálculo y sistemas de gestión de datos, así como la importancia de las normas de seguridad digital en el manejo de información administrativa y financiera."},{id:"GFC-CE2.2",texto:"CE2.2: Utiliza funciones avanzadas de hojas de cálculo para procesar datos administrativos o financieros, aplicando fórmulas, tablas dinámicas y herramientas de análisis para obtener resultados precisos."},{id:"GFC-CE2.3",texto:"CE2.3: Aplica normas y protocolos de seguridad digital durante la gestión y procesamiento de datos en sistemas informáticos, garantizando la integridad y confidencialidad de la información."}]},{id:"GFC-RA.3",texto:"RA3: Analizar información financiera y administrativa mediante tablas dinámicas, gráficos y comparativos, identificando discrepancias o tendencias relevantes para la toma de decisiones.",criteriosEvaluacion:[{id:"GFC-CE3.1",texto:"CE3.1: Describe la función y utilidad de las tablas dinámicas, gráficos y comparativos en el análisis de información financiera y administrativa."},{id:"GFC-CE3.2",texto:"CE3.2: Construye tablas dinámicas, gráficos y comparativos a partir de datos financieros y administrativos para organizar y visualizar información relevante."},{id:"GFC-CE3.3",texto:"CE3.3: Identifica discrepancias y tendencias significativas en los análisis realizados y explica su impacto en la toma de decisiones administrativas o financieras."}]}]},
      { codigo: "GF.1.2", nombre: "Contabilidad de Costos", descripcion: "Determinar los costos de producción mediante sistemas de costeo por órdenes y por procesos.", anio: 1 , categoria: "generico", estadoCatalogo: "completo", nivel: "Bachillerato 1ro y 2do", objetivoModulo: "Aplicar conocimientos de gestión contable y administración financiera para evaluar condiciones financieras y colaborar activamente con el equipo de trabajo, y utilizando principios de economía circular para optimizar recursos, reducir el impacto ambiental y mantener relaciones laborales, familiares y personales equilibradas", resultadosAprendizaje:[{id:"GFC-RA.1",texto:"RA1: Aplicar fundamentos de administración en el diseño de estructuras organizacionales y procesos, bajo normativas laborales y principios éticos y criterios de economía circular",criteriosEvaluacion:[{id:"GFC-CE1.1",texto:"CE1.1: Explica los elementos básicos de una estructura organizacional (jerarquías, departamentos) y normativas laborales ecuatorianas, aplicándolos en casos simulados"},{id:"GFC-CE1.2",texto:"CE1.2: Aplica procedimientos administrativos en casos reales o simulados, identificando aspectos que contribuyen a la eficiencia y proponiendo mejoras sencillas basadas en principios de calidad y ética profesional."},{id:"GFC-CE1.3",texto:"CE1.3: Incorpora criterios éticos y de economía circular en la propuesta de mejoras a procesos administrativos, promoviendo la sostenibilidad organizacional."}]},{id:"GFC-RA.2",texto:"RA2: Registrar operaciones contables en libros diarios y mayores según PCGE, asegurando el cumplimiento de normativas tributarias y considerando criterios de sostenibilidad y uso eficiente de recursos en el contexto de la economía circular.",criteriosEvaluacion:[{id:"GFC-CE2.1",texto:"CE2.1: Identifica las cuentas contables según el Plan Contable General Ecuatoriano (PCGE) para registrar transacciones básicas"},{id:"GFC-CE2.2",texto:"CE2.2: Recopila operaciones contables en libros diario y mayor, aplicando principios de partida doble y normativas tributarias básicas (IVA, retenciones)."},{id:"GFC-CE2.3",texto:"CE2.3: Aplica criterios de sostenibilidad y uso eficiente de recursos al momento de registrar y analizar las operaciones contables"},{id:"GFC-CE2.4",texto:"CE2.4: Elabora un ciclo contable completo para una PYME simulada, integrando registros, ajustes básicos y cumplimiento de obligaciones tributarias"}]},{id:"GFC-RA.3",texto:"RA3: Calcular costos de producción, servicios o comercio, determinando puntos de equilibrio y elaborando presupuestos con enfoque en economía circular.",criteriosEvaluacion:[{id:"GFC-CE3.1",texto:"CE3.1: Analiza costos fijos, variables y totales en actividades de producción, comercio o servicios, identificando oportunidades para reducir el uso de recursos y reutilizar materiales, de acuerdo con los principios de economía circular."},{id:"GFC-CE3.2",texto:"CE3.2: Determina el punto de equilibrio en diferentes tipos de proyectos o emprendimientos, evaluando su viabilidad económica y su contribución a la reducción de residuos y aprovechamiento de insumos."},{id:"GFC-CE3.3",texto:"CE3.3: Compara presupuestos operativos y financieros básicos con los resultados reales o proyectados, identificando desviaciones y analizando el impacto económico y ambiental de las decisiones tomadas."},{id:"GFC-CE3.4",texto:"CE3.4: Diseña un plan de costos y presupuesto para un emprendimiento productivo o comercial (real o simulado), integrando el análisis de equilibrio y estrategias de economía circular, como la reutilización de insumos, el reciclaje o la mejora en la eficiencia energética."}]},{id:"GFC-RA.4",texto:"RA4: Aplicar técnicas de análisis financiero para interpretar estados financieros (Balance General, Estado de Resultados) y flujos de caja, evaluando la situación económica de una organización e identificando oportunidades de mejora con base en principios de economía circular.",criteriosEvaluacion:[{id:"GFC-CE4.1",texto:"CE4.1: Describe los componentes clave del Balance General, Estado de Resultados y Flujo de Caja, explicando su interrelación."},{id:"GFC-CE4.2",texto:"CE4.2: Calcula ratios financieros (liquidez, endeudamiento, rentabilidad) para diagnosticar la situación económica de una organización."},{id:"GFC-CE4.3",texto:"CE4.3: Emplea técnicas básicas para revisar estados financieros y flujos de caja, identificando posibles incongruencias o riesgos financieros."},{id:"GFC-CE4.4",texto:"CE4.4: Incorpora criterios de economía circular para identificar prácticas que mejoren la eficiencia y sostenibilidad financiera dentro del análisis financiero."}]},{id:"GFC-RA.5",texto:"RA5: Evaluar alternativas de inversión y financiamiento (créditos, préstamos), considerando costos, riesgos y beneficios y su contribución al uso eficiente de recursos y la sostenibilidad económica y ambiental.",criteriosEvaluacion:[{id:"GFC-CE5.1",texto:"CE5.1: Describe las características principales de diferentes alternativas de inversión y financiamiento, incluyendo créditos y préstamos."},{id:"GFC-CE5.2",texto:"CE5.2: Utiliza métodos para valorar alternativas de inversión y financiamiento considerando costos, riesgos y beneficios."},{id:"GFC-CE5.3",texto:"CE5.3: Aplica criterios de sostenibilidad y economía circular para valorar la contribución de las alternativas a la eficiencia y sustentabilidad."},{id:"GFC-CE5.4",texto:"CE5.4: Analiza diferentes alternativas de inversión y financiamiento, proponiendo la opción más adecuada que optimice recursos y minimice impactos."}]},{id:"GFC-RA.6",texto:"RA6: Emplear procesos de control interno para verificar el cumplimiento normativo, mejorar la eficiencia operativa y promover prácticas sostenibles que optimicen el uso de recursos y minimicen impactos ambientales, en concordancia con los principios de economía circular.",criteriosEvaluacion:[{id:"GFC-CE6.1",texto:"CE6.1: Identifica los elementos y objetivos del control interno en contextos administrativos y contables."},{id:"GFC-CE6.2",texto:"CE6.2: Aplica procedimientos básicos de control interno en actividades simuladas o reales, como manejo de inventarios, caja chica o archivos."},{id:"GFC-CE6.3",texto:"CE6.3: Utiliza prácticas sostenibles dentro de los procesos de control interno para optimizar el uso de recursos y reducir impactos ambientales."},{id:"GFC-CE6.4",texto:"CE6.4: Propone mejoras a partir del análisis de los resultados del control interno para identificar oportunidades de mejora que integren eficiencia operativa y sostenibilidad ambiental."}]}]},
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
      { codigo: "RH.1.1", nombre: "Biología Acuática", descripcion: "Identificar y clasificar organismos acuáticos y sus ecosistemas para el manejo sostenible de recursos hidrobiológicos.", anio: 1 , categoria: "generico", estadoCatalogo: "completo", nivel: "Bachillerato 1ro y 2do", objetivoModulo: "Desarrollar competencias para investigar la producción y manejo de recursos agropecuarios e hidrobiológicos mediante la recolección, análisis y sistematización de información técnica, con el fin de apoyar la planificación y ejecución de actividades productivas en contextos sostenibles y pertinentes al sector.", resultadosAprendizaje:[{id:"MRH-RA.1",texto:"RA1: Reconocer técnicas e instrumentos de investigación aplicables a la producción y manejo de recursos agropecuarios e hidrobiológicos, identificando su función y relevancia para recolectar información confiable en contextos productivos.",criteriosEvaluacion:[{id:"MRH-CE1.1",texto:"CE1.1: Describe técnicas, instrumentos e insumos de recolección de datos aplicables a la producción y manejo de recursos agropecuarios e hidrobiológicos en contextos productivos."},{id:"MRH-CE1.2",texto:"CE1.2: Selecciona técnicas, instrumentos e insumos necesarios para recolectar información confiable en el contexto productivo."},{id:"MRH-CE1.3",texto:"CE1.3: Prepara las técnicas, instrumentos e insumos requeridos para el levantamiento de información técnica en campo o laboratorio."},{id:"MRH-CE1.4",texto:"CE1.4: Incorpora normas de seguridad, bioseguridad y sanidad en el manejo de las técnicas e instrumentos de investigación."}]},{id:"MRH-RA.2",texto:"RA2: Ejecutar técnicas e instrumentos de recolección de datos en actividades productivas agropecuarias e hidrobiológicas, asegurando precisión, orden y confiabilidad de la información. CE 2.1: Aplica procedimientos de muestreo y recopilación de datos siguiendo protocolos establecidos, asegurando validez, confiabilidad y relevancia de la información. CE 2.2: Analiza la información recopilada, detectando tendencias, anomalías y variaciones relevantes en los procesos productivos agropecuarios e hidrobiológicos. CE 2.3: Verifica la consistencia y coherencia de los datos recopilados, identificando y corrigiendo errores o inconsistencias. CE 2.4: Formula recomendaciones técnicas que fortalezcan las prácticas agropecuarias e hidrobiológicas, promoviendo el uso sostenible de los recursos y la eficiencia de los procesos productivos.",criteriosEvaluacion:[]},{id:"MRH-RA.3",texto:"RA3: Presentar la información recolectada mediante registros técnicos, tablas, gráficos y diagramas, asegurando su comprensión y facilitando el análisis. CE 3.1: Organiza la información recolectada según criterios técnicos y relevancia para la actividad productiva. CE 3.2: Representa la información mediante tablas, diagramas o gráficos básicos, asegurando claridad y orden. CE 3.3: Resume los hallazgos de la investigación de manera coherente, utilizando formatos escritos o gráficos para su adecuada visualización. CE 3.4: Interpreta tendencias, patrones o problemas detectados en los sistemas productivos a partir de la información organizada.",criteriosEvaluacion:[]},{id:"MRH-RA.4",texto:"RA4: Analizar los resultados de investigación para relacionarlos con los procesos productivos y el manejo de recursos agropecuarios e hidrobiológicos, proponiendo acciones que apoyen la ejecución de actividades productivas. CE 4.1: Explica la relación entre los resultados de investigación y los procesos productivos o de manejo de recursos agropecuarios e hidrobiológicos, identificando su incidencia en la eficiencia y sostenibilidad de las actividades. CE 4.2: Analiza los resultados de investigación para identificar tendencias, problemáticas, oportunidades o innovaciones que aporten a la mejora de los procesos productivos. CE 4.3: Presenta los resultados obtenidos, evidenciando tendencias, problemáticas, oportunidades de mejora e innovaciones en los procesos de producción y manejo de recursos. CE 4.4: Aplica los resultados de investigación en el diseño o ajustes de prácticas productivas, incorporando innovaciones y estrategias que mejoren la sostenibilidad, rentabilidad y calidad de los proceso agropecuarios e hidrobiológicos.",criteriosEvaluacion:[]}]},
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
      { codigo: "PA.1.1", nombre: "Producción Agrícola", descripcion: "Ejecutar labores de preparación de suelo, siembra, mantenimiento y cosecha de cultivos aplicando técnicas agrícolas sostenibles.", anio: 1 , categoria: "generico", estadoCatalogo: "completo", nivel: "1ro, 2do", objetivoModulo: "Implementar normas y procedimientos de seguridad e higiene en entornos técnicos e industriales, mediante el uso responsable de herramientas, equipos y maquinaria, para prevenir accidentes y garantizar un ambiente seguro, con disciplina, ética y compromiso profesional.", resultadosAprendizaje:[{id:"CPA-RA.1",texto:"RA1: Aplicar normas de seguridad e higiene en actividades industriales utilizando equipos de protección, señalización y rutinas de limpieza, garantizando condiciones seguras de trabajo.",criteriosEvaluacion:[{id:"CPA-CE1.1",texto:"CE1.1: Reconoce señales de seguridad en talleres y laboratorios verificando su ubicación y legibilidad en las áreas de trabajo según normativa vigente."},{id:"CPA-CE1.2",texto:"CE1.2: Verifica el estado de los equipos de protección personal asegurando su operatividad antes de cada actividad."},{id:"CPA-CE1.3",texto:"CE1.3: Inspecciona las condiciones de talleres y laboratorios comprobando el cumplimiento de protocolos establecidos para mantener el orden y la limpieza."},{id:"CPA-CE1.4",texto:"CE1.4: Aplica rutinas de higiene al finalizar las tareas comprobando la eliminación de riesgos residuales."}]},{id:"CPA-RA.2",texto:"RA2: Ejecutar procedimientos de identificación, análisis y prevención de riesgos en entornos industriales aplicando metodologías técnicas y normativa vigente.",criteriosEvaluacion:[{id:"CPA-CE2.1",texto:"CE2.1: Detecta condiciones de riesgo utilizando listas de verificación y formatos de inspección estandarizados."},{id:"CPA-CE2.2",texto:"CE2.2: Clasifica peligros según tipo, frecuencia y severidad determinando su nivel de criticidad en las actividades industriales."},{id:"CPA-CE2.3",texto:"CE2.3: Establece medidas preventivas acordes con los riesgos detectados verificando su pertinencia y viabilidad."},{id:"CPA-CE2.4",texto:"CE2.4: Evalúa la efectividad de las medidas preventivas constatando la disminución de incidentes o condiciones inseguras."}]},{id:"CPA-RA.3",texto:"RA3: Aplicar planes de acción frente a emergencias siguiendo protocolos de comunicación, evacuación y control de incidentes, con el fin de reducir daños humanos y materiales.",criteriosEvaluacion:[{id:"CPA-CE3.1",texto:"CE3.1: Reconoce alarmas, señales y rutas de evacuación comprobando su correspondencia con los planes establecidos."},{id:"CPA-CE3.2",texto:"CE3.2: Aplica los protocolos de comunicación de emergencia al personal responsable utilizando los medios de comunicación definidos en el plan."},{id:"CPA-CE3.3",texto:"CE3.3: Ejecuta la evacuación siguiendo procedimientos establecidos y tiempos previstos."},{id:"CPA-CE3.4",texto:"CE3.4: Aplica técnicas básicas de control de emergencias verificando la preservación de la integridad de personas y bienes."}]},{id:"CPA-RA.4",texto:"RA4: Integrar prácticas de seguridad, higiene y sostenibilidad en actividades industriales promoviendo disciplina, ética profesional y mejora continua.",criteriosEvaluacion:[{id:"CPA-CE4.1",texto:"CE4.1: Inspecciona las condiciones del área de trabajo aplicando listas de control de seguridad, higiene y orden."},{id:"CPA-CE4.2",texto:"CE4.2: Motiva la participación en campañas de seguridad y salud ocupacional mediante actividades colaborativas."},{id:"CPA-CE4.3",texto:"CE4.3: Detecta desviaciones menores en las condiciones de seguridad registrando las observaciones en los formatos correspondientes."},{id:"CPA-CE4.4",texto:"CE4.4: Cumple normas y protocolos demostrando disciplina, ética profesional y compromiso con la mejora continua."}]}]},
      { codigo: "PA.1.2", nombre: "Producción Pecuaria", descripcion: "Manejar especies animales menores y mayores aplicando técnicas de alimentación, sanidad y reproducción.", anio: 1 , categoria: "generico", estadoCatalogo: "completo", nivel: "1ro, 2do", objetivoModulo: "Implementar prácticas de sostenibilidad y control de calidad en procesos industriales, a través del uso de tecnologías limpias, criterios de eficiencia energética, técnicas de minimización de residuos, fundamentos de salud ocupacional y orientación laboral, con el propósito de reducir impactos ambientales, optimizar recursos y contribuir al desarrollo equilibrado en lo social, lo económico y lo ambiental.", resultadosAprendizaje:[{id:"CPA-RA.1",texto:"RA1: Aplicar estrategias de reducción de consumo energético en equipos y procesos industriales mediante energías renovables y técnicas de optimización del consumo eléctrico, asegurando mejoras comprobables en sostenibilidad.",criteriosEvaluacion:[{id:"CPA-CE1.1",texto:"CE1.1: Registra consumos energéticos de equipos verificando su correspondencia con valores de referencia."},{id:"CPA-CE1.2",texto:"CE1.2: Analiza pérdidas de energía en rutinas operativas comprobando desviaciones frente a estándares de eficiencia."},{id:"CPA-CE1.3",texto:"CE1.3: Ajusta parámetros de funcionamiento en equipos eléctricos evidenciando reducción en el gasto energético."},{id:"CPA-CE1.4",texto:"CE1.4: Contrasta resultados obtenidos con el uso de energías renovables demostrando beneficios ambientales y económicos."}]},{id:"CPA-RA.2",texto:"RA2: Implementar procedimientos de reducción, reutilización y reciclaje de materiales en procesos industriales aplicando técnicas de minimización de residuos y emisiones contaminantes bajo normativa ambiental vigente.",criteriosEvaluacion:[{id:"CPA-CE2.1",texto:"CE2.1: Clasifica residuos sólidos en contenedores diferenciados asegurando su segregación conforme normativa ambiental."},{id:"CPA-CE2.2",texto:"CE2.2: Reduce el uso de insumos en prácticas experimentales verificando el aprovechamiento máximo de materiales industriales."},{id:"CPA-CE2.3",texto:"CE2.3: Reutiliza subproductos en actividades prácticas evidenciando funcionalidad en nuevos usos."},{id:"CPA-CE2.4",texto:"CE2.4: Evalúa emisiones generadas en procesos industriales comprobando su disminución mediante prácticas de control."}]},{id:"CPA-RA.3",texto:"RA3: Gestionar el uso de materias primas y energía en procesos industriales garantizando reducción de costos operativos y aprovechamiento responsable de los recursos.",criteriosEvaluacion:[{id:"CPA-CE3.1",texto:"CE3.1: Distingue puntos críticos de consumo de recursos industriales determinando su incidencia en costos operativos."},{id:"CPA-CE3.2",texto:"CE3.2: Propone ajustes en el uso de materias primas demostrando ahorro sin afectar la calidad del producto."},{id:"CPA-CE3.3",texto:"CE3.3: Aplica técnicas de aprovechamiento eficiente de recursos industriales comprobando reducción de desperdicio."},{id:"CPA-CE3.4",texto:"CE3.4: Contrasta costos operativos antes y después de la optimización justificando beneficios económicos y ambientales."}]},{id:"CPA-RA.4",texto:"RA4: Incorporar tecnologías limpias en sistemas de automatización y procesos comprobando mejoras en eficiencia, rendimiento y reducción del impacto ambiental.",criteriosEvaluacion:[{id:"CPA-CE4.1",texto:"CE4.1: Opera sensores o controladores básicos verificando la automatización de tareas repetitivas."},{id:"CPA-CE4.2",texto:"CE4.2: Ajusta configuraciones en dispositivos didácticos demostrando incremento en la eficiencia operativa."},{id:"CPA-CE4.3",texto:"CE4.3: Simula procesos automatizados en software educativo comprobando reducción de desperdicios y errores."},{id:"CPA-CE4.4",texto:"CE4.4: Contrasta resultados entre procesos tradicionales y tecnologías limpias evidenciando beneficios ambientales y económicos."}]},{id:"CPA-RA.5",texto:"RA5: Integrar fundamentos de orientación laboral y salud ocupacional en actividades académicas e industriales fortaleciendo habilidades profesionales y condiciones de seguridad.",criteriosEvaluacion:[{id:"CPA-CE5.1",texto:"CE5.1: Explica las normativas laborales y de seguridad ocupacional con el fin de fortalecer habilidades técnicas profesionales."},{id:"CPA-CE5.2",texto:"CE5.2: Aplica normativa en actividades de trabajo individual y en equipo considerando cooperación, comunicación efectiva y responsabilidad compartida."},{id:"CPA-CE5.3",texto:"CE5.3: Practica acciones preventivas siguiendo protocolos de salud ocupacional, ergonomía y normas de seguridad industrial con el fin de reducir riesgos laborales."},{id:"CPA-CE5.4",texto:"CE5.4: Valora la participación en procesos de orientación laboral evidenciando mejora en el desempeño profesional."}]},{id:"CPA-RA.6",texto:"RA6: Ejecutar procedimientos básicos de control de calidad en productos y procesos industriales verificando cumplimiento de normas técnicas y mejora continua.",criteriosEvaluacion:[{id:"CPA-CE6.1",texto:"CE6.1: Utiliza productos y materiales según parámetros establecidos en normas técnicas y procedimientos internos."},{id:"CPA-CE6.2",texto:"CE6.2: Ejecuta pruebas de control de calidad estandarizadas de acuerdo con procedimientos internos y normativas técnicas."},{id:"CPA-CE6.3",texto:"CE6.3: Registra resultados de pruebas de calidad utilizando formatos establecidos y respetando la secuencia de procesos."},{id:"CPA-CE6.4",texto:"CE6.4: Comunica los hallazgos de control de calidad siguiendo documentación estandarizada y sugiriendo medidas correctivas."}]}]},
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
      { codigo: "AP.1.1", nombre: "Ecología y Biodiversidad", descripcion: "Identificar componentes de ecosistemas y su biodiversidad para fundamentar acciones de conservación.", anio: 1 , categoria: "generico", estadoCatalogo: "completo", nivel: "1ro y 2do", objetivoModulo: "Desarrollar competencias para la aplicación de normas, procedimientos y planes de seguridad e higiene, mediante la práctica en talleres, laboratorios y actividades industriales con el uso adecuado de herramientas, equipos y máquinas, con el fin de prevenir riesgos, garantizar la integridad personal y colectiva, fomentar la disciplina, responsabilidad y ética profesional en el entorno productivo.", resultadosAprendizaje:[{id:"ECLI-RA.1",texto:"RA1: Aplicar normas de seguridad e higiene en actividades industriales utilizando equipos de protección, señalización y rutinas de limpieza, garantizando condiciones seguras de trabajo.",criteriosEvaluacion:[{id:"ECLI-CE1.1",texto:"CE1.1: Identifica señales de seguridad en talleres y laboratorios verificando su ubicación y legibilidad en las áreas de trabajo según normativa vigente."},{id:"ECLI-CE1.2",texto:"CE1.2: Revisa el estado de los equipos de protección personal asegurando su operatividad antes de cada actividad."},{id:"ECLI-CE1.3",texto:"CE1.3: Verifica las condiciones de talleres y laboratorios comprobando el cumplimiento de protocolos establecidos para mantener el orden y la limpieza."},{id:"ECLI-CE1.4",texto:"CE1.4: Aplica rutinas de higiene al finalizar las tareas comprobando la eliminación de riesgos residuales."}]},{id:"ECLI-RA.2",texto:"RA2: Ejecutar procedimientos de identificación, análisis y prevención de riesgos en entornos industriales aplicando metodologías técnicas y normativa vigente. CE 2.1: Detecta condiciones de riesgo utilizando listas de verificación y formatos de inspección estandarizados. CE 2.2: Clasifica peligros según tipo, frecuencia y severidad determinando su nivel de criticidad en las actividades industriales. CE 2.3: Establece medidas preventivas acordes con los riesgos detectados verificando su pertinencia y viabilidad. CE 2.4: Evalúa la efectividad de las medidas preventivas constatando la disminución de incidentes o condiciones inseguras.",criteriosEvaluacion:[]},{id:"ECLI-RA.3",texto:"RA3: Aplicar planes de acción frente a emergencias siguiendo protocolos de comunicación, evacuación y control de incidentes, con el fin de reducir daños humanos y materiales. CE 3.1: Reconoce alarmas, señales y rutas de evacuación comprobando su correspondencia con los planes establecidos. CE 3.2: Notifica la emergencia al personal responsable utilizando los medios de comunicación definidos en el plan. CE 3.3: Ejecuta la evacuación siguiendo procedimientos establecidos y tiempos previstos. CE 3.4: Aplica técnicas básicas de control de emergencias verificando la preservación de la integridad de personas y bienes.",criteriosEvaluacion:[]},{id:"ECLI-RA.4",texto:"RA4: Integrar prácticas de seguridad, higiene y sostenibilidad en actividades industriales promoviendo disciplina, ética profesional y mejora continua. CE 4.1: Inspecciona las condiciones del área de trabajo aplicando listas de control de seguridad, higiene y orden. CE 4.2: Motiva la participación en campañas de seguridad y salud ocupacional mediante actividades colaborativas. CE 4.3: Detecta desviaciones menores en las condiciones de seguridad registrando las observaciones en los formatos correspondientes. CE 4.4: Cumple normas y protocolos demostrando disciplina, ética profesional y compromiso con la mejora continua.",criteriosEvaluacion:[]}]},
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
      { codigo: "GA.1.1", nombre: "Fundamentos Ambientales", descripcion: "Comprender los principios ecológicos y la normativa ambiental vigente en Ecuador.", anio: 1 , categoria: "generico", estadoCatalogo: "completo", nivel: "1ro y 2do", objetivoModulo: "Desarrollar competencias para la aplicación de normas, procedimientos y planes de seguridad e higiene, mediante la práctica en talleres, laboratorios y actividades industriales con el uso adecuado de herramientas, equipos y máquinas, con el fin de prevenir riesgos, garantizar la integridad personal y colectiva, fomentar la disciplina, responsabilidad y ética profesional en el entorno productivo.", resultadosAprendizaje:[{id:"ELEC-RA.1",texto:"RA1: Emplear normas de seguridad e higiene en actividades industriales utilizando equipos de protección, señalización y rutinas de limpieza, garantizando condiciones seguras de trabajo.",criteriosEvaluacion:[{id:"ELEC-CE1.1",texto:"CE1.1: Identifica señales de seguridad en talleres y laboratorios verificando su ubicación y legibilidad en las áreas de trabajo según normativa vigente."},{id:"ELEC-CE1.2",texto:"CE1.2: Revisa el estado de los equipos de protección personal asegurando su operatividad antes de cada actividad."},{id:"ELEC-CE1.3",texto:"CE1.3: Verifica las condiciones de talleres y laboratorios comprobando el cumplimiento de protocolos establecidos para mantener el orden y la limpieza."},{id:"ELEC-CE1.4",texto:"CE1.4: Aplica rutinas de higiene al finalizar las tareas comprobando la eliminación de riesgos residuales."}]},{id:"ELEC-RA.2",texto:"RA2: Establecer procedimientos de identificación, análisis y prevención de riesgos en entornos industriales aplicando metodologías técnicas y normativa vigente.",criteriosEvaluacion:[{id:"ELEC-CE2.1",texto:"CE2.1: Detecta condiciones de riesgo utilizando listas de verificación y formatos de inspección estandarizados."},{id:"ELEC-CE2.2",texto:"CE2.2: Clasifica peligros según tipo, frecuencia y severidad determinando su nivel de criticidad en las actividades industriales."},{id:"ELEC-CE2.3",texto:"CE2.3: Ejecuta medidas preventivas acordes con los riesgos detectados verificando su pertinencia y viabilidad."},{id:"ELEC-CE2.4",texto:"CE2.4: Evalúa la efectividad de las medidas preventivas constatando la disminución de incidentes o condiciones inseguras."}]},{id:"ELEC-RA.3",texto:"RA3: Ejecutar planes de acción frente a emergencias siguiendo protocolos de comunicación, evacuación y control de incidentes, con el fin de reducir daños humanos y materiales.",criteriosEvaluacion:[{id:"ELEC-CE3.1",texto:"CE3.1: Reconoce alarmas, señales y rutas de evacuación comprobando su correspondencia con los planes establecidos."},{id:"ELEC-CE3.2",texto:"CE3.2: Notifica la emergencia al personal responsable utilizando los medios de comunicación definidos en el plan."},{id:"ELEC-CE3.3",texto:"CE3.3: Emplea la evacuación siguiendo procedimientos establecidos y tiempos previstos."},{id:"ELEC-CE3.4",texto:"CE3.4: Aplica técnicas básicas de control de emergencias verificando la preservación de la integridad de personas y bienes."}]},{id:"ELEC-RA.4",texto:"RA4: Integrar prácticas de seguridad, higiene y sostenibilidad en actividades industriales promoviendo disciplina, ética profesional y mejora continua.",criteriosEvaluacion:[{id:"ELEC-CE4.1",texto:"CE4.1: Inspecciona las condiciones del área de trabajo aplicando listas de control de seguridad, higiene y orden."},{id:"ELEC-CE4.2",texto:"CE4.2: Motiva la participación en campañas de seguridad y salud ocupacional mediante actividades colaborativas."},{id:"ELEC-CE4.3",texto:"CE4.3: Detecta desviaciones menores en las condiciones de seguridad registrando las observaciones en los formatos correspondientes."},{id:"ELEC-CE4.4",texto:"CE4.4: Cumple normas y protocolos demostrando disciplina, ética profesional y compromiso con la mejora continua."}]}]},
      { codigo: "GA.2.1", nombre: "Evaluación de Impacto Ambiental", descripcion: "Aplicar metodologías de evaluación de impacto ambiental en proyectos productivos.", anio: 2 },
      { codigo: "GA.3.1", nombre: "Gestión de Residuos y Energías Renovables", descripcion: "Implementar sistemas de gestión de residuos sólidos y aprovechamiento de energías renovables.", anio: 3 },
    ],
  },
  // === INDUSTRIAL (Climatización: movida de Construcción sostenible por 00051-A) ===
  {
    id: "climatizacion",
    nombre: "Climatización",
    familia: "industrial",
    area: "tecnica",
    codigo: "TC-05-10",
    normativaVigente: "MINEDEC-MINEDEC-2025-00051-A",
    objetivoGeneral: "Ejecutar operaciones de montaje, instalación, mantenimiento, reparación y mejora de sistemas de climatización, refrigeración, calefacción, redes de agua y gases, en edificaciones residenciales, comerciales, industriales y unidades móviles con requerimientos térmicos, aplicando normativas técnicas, ambientales y de seguridad, promoviendo la eficiencia energética, el uso responsable de los recursos y el desarrollo de iniciativas de emprendimiento técnico que respondan a las necesidades del entorno productivo.",
    // Catálogo transcrito de "Módulos formativos de la FIP - Climatización" (Acuerdo 00065-A),
    // docs/bt-modulos-formativos/txt/cli.txt. Sin correspondencia oficial queda "pendiente".
    modulos: [
      {
        codigo: "CL.1.1",
        nombre: "Fundamentos de Refrigeración",
        descripcion: "Comprender los principios termodinámicos aplicados a sistemas de refrigeración y climatización.",
        anio: 1,
        estadoCatalogo: "pendiente",
      },
      {
        codigo: "CL.1.2",
        nombre: "Seguridad Industrial",
        descripcion: "Aplicar normas, procedimientos y planes de seguridad e higiene en talleres y procesos industriales previniendo riesgos.",
        anio: 1,
        categoria: "generico",
        nivel: "1ro y 2do",
        duracionPeriodos: { 1: 2, 2: 2, 3: null },
        estadoCatalogo: "completo",
        objetivoModulo:
          "Desarrollar competencias para la aplicación de normas, procedimientos y planes de seguridad e higiene, mediante la práctica en talleres, laboratorios y actividades industriales con el uso adecuado de herramientas, equipos y máquinas, con el fin de prevenir riesgos, garantizar la integridad personal y colectiva, fomentar la disciplina, responsabilidad y ética profesional en el entorno productivo.",
        resultadosAprendizaje: [
          {
            id: "CLI-RA.1",
            texto: "RA 1: Emplear normas de seguridad e higiene en actividades industriales utilizando equipos de protección, señalización y rutinas de limpieza, garantizando condiciones seguras de trabajo.",
            criteriosEvaluacion: [
              { id: "CLI-CE1.1", texto: "CE1.1: Identifica señales de seguridad en talleres y laboratorios verificando su ubicación y legibilidad en las áreas de trabajo según normativa vigente." },
              { id: "CLI-CE1.2", texto: "CE1.2: Revisa el estado de los equipos de protección personal asegurando su operatividad antes de cada actividad." },
              { id: "CLI-CE1.3", texto: "CE1.3: Verifica las condiciones de talleres y laboratorios comprobando el cumplimiento de protocolos establecidos para mantener el orden y la limpieza." },
              { id: "CLI-CE1.4", texto: "CE1.4: Aplica rutinas de higiene al finalizar las tareas comprobando la eliminación de riesgos residuales." },
            ],
          },
          {
            id: "CLI-RA.2",
            texto: "RA 2: Establecer procedimientos de identificación, análisis y prevención de riesgos en entornos industriales aplicando metodologías técnicas y normativa vigente.",
            criteriosEvaluacion: [
              { id: "CLI-CE2.1", texto: "CE2.1: Detecta condiciones de riesgo utilizando listas de verificación y formatos de inspección estandarizados." },
              { id: "CLI-CE2.2", texto: "CE2.2: Clasifica peligros según tipo, frecuencia y severidad determinando su nivel de criticidad en las actividades industriales." },
              { id: "CLI-CE2.3", texto: "CE2.3: Ejecuta medidas preventivas acordes con los riesgos detectados verificando su pertinencia y viabilidad." },
              { id: "CLI-CE2.4", texto: "CE2.4: Evalúa la efectividad de las medidas preventivas constatando la disminución de incidentes o condiciones inseguras." },
            ],
          },
          {
            id: "CLI-RA.3",
            texto: "RA 3: Ejecutar planes de acción frente a emergencias siguiendo protocolos de comunicación, evacuación y control de incidentes, con el fin de reducir daños humanos y materiales.",
            criteriosEvaluacion: [
              { id: "CLI-CE3.1", texto: "CE3.1: Reconoce alarmas, señales y rutas de evacuación comprobando su correspondencia con los planes establecidos." },
              { id: "CLI-CE3.2", texto: "CE3.2: Notifica la emergencia al personal responsable utilizando los medios de comunicación definidos en el plan." },
              { id: "CLI-CE3.3", texto: "CE3.3: Emplea la evacuación siguiendo procedimientos establecidos y tiempos previstos." },
              { id: "CLI-CE3.4", texto: "CE3.4: Aplica técnicas básicas de control de emergencias verificando la preservación de la integridad de personas y bienes." },
            ],
          },
          {
            id: "CLI-RA.4",
            texto: "RA 4: Integrar prácticas de seguridad, higiene y sostenibilidad en actividades industriales promoviendo disciplina, ética profesional y mejora continua.",
            criteriosEvaluacion: [
              { id: "CLI-CE4.1", texto: "CE4.1: Inspecciona las condiciones del área de trabajo aplicando listas de control de seguridad, higiene y orden." },
              { id: "CLI-CE4.2", texto: "CE4.2: Motiva la participación en campañas de seguridad y salud ocupacional mediante actividades colaborativas." },
              { id: "CLI-CE4.3", texto: "CE4.3: Detecta desviaciones menores en las condiciones de seguridad registrando las observaciones en los formatos correspondientes." },
              { id: "CLI-CE4.4", texto: "CE4.4: Cumple normas y protocolos demostrando disciplina, ética profesional y compromiso con la mejora continua." },
            ],
          },
        ],
      },
      {
        codigo: "CL.1.3",
        nombre: "Procesos Industriales Sostenibles",
        descripcion: "Implementar prácticas de sostenibilidad y control de calidad en procesos industriales mediante tecnologías limpias.",
        anio: 1,
        categoria: "generico",
        nivel: "1ro y 2do",
        duracionPeriodos: { 1: 2, 2: 2, 3: null },
        estadoCatalogo: "completo",
        objetivoModulo:
          "Implementar prácticas de sostenibilidad y control de calidad en procesos industriales, a través del uso de tecnologías limpias, criterios de eficiencia energética, técnicas de minimización de residuos, fundamentos de salud ocupacional y orientación laboral, con el propósito de reducir impactos ambientales, optimizar recursos y contribuir al desarrollo equilibrado en lo social, lo económico y lo ambiental.",
        resultadosAprendizaje: [
          {
            id: "CLI-RA.1",
            texto: "RA 1: Aplicar estrategias de reducción de consumo energético en equipos y procesos industriales mediante energías renovables y técnicas de optimización del consumo eléctrico, asegurando mejoras comprobables en sostenibilidad.",
            criteriosEvaluacion: [
              { id: "CLI-CE1.1", texto: "CE1.1: Registra consumos energéticos de equipos verificando su correspondencia con valores de referencia." },
              { id: "CLI-CE1.2", texto: "CE1.2: Analiza pérdidas de energía en rutinas operativas comprobando desviaciones frente a estándares de eficiencia." },
              { id: "CLI-CE1.3", texto: "CE1.3: Ajusta parámetros de funcionamiento en equipos eléctricos evidenciando reducción en el gasto energético." },
              { id: "CLI-CE1.4", texto: "CE1.4: Contrasta resultados obtenidos con el uso de energías renovables demostrando beneficios ambientales y económicos." },
            ],
          },
          {
            id: "CLI-RA.2",
            texto: "RA 2: Implementar procedimientos de reducción, reutilización y reciclaje de materiales en procesos industriales aplicando técnicas de minimización de residuos y emisiones contaminantes bajo normativa ambiental vigente.",
            criteriosEvaluacion: [
              { id: "CLI-CE2.1", texto: "CE2.1: Clasifica residuos sólidos en contenedores diferenciados asegurando su segregación conforme normativa ambiental." },
              { id: "CLI-CE2.2", texto: "CE2.2: Reduce el uso de insumos en prácticas experimentales verificando el aprovechamiento máximo de materiales industriales." },
              { id: "CLI-CE2.3", texto: "CE2.3: Reutiliza subproductos en actividades prácticas evidenciando funcionalidad en nuevos usos." },
              { id: "CLI-CE2.4", texto: "CE2.4: Evalúa emisiones generadas en procesos industriales comprobando su disminución mediante prácticas de control." },
            ],
          },
          {
            id: "CLI-RA.3",
            texto: "RA 3: Gestionar el uso de materias primas y energía en procesos industriales garantizando reducción de costos operativos y aprovechamiento responsable de los recursos.",
            criteriosEvaluacion: [
              { id: "CLI-CE3.1", texto: "CE3.1: Identifica puntos críticos de consumo de recursos industriales determinando su incidencia en costos operativos." },
              { id: "CLI-CE3.2", texto: "CE3.2: Propone ajustes en el uso de materias primas demostrando ahorro sin afectar la calidad del producto." },
              { id: "CLI-CE3.3", texto: "CE3.3: Aplica técnicas de aprovechamiento eficiente de recursos industriales comprobando reducción de desperdicio." },
              { id: "CLI-CE3.4", texto: "CE3.4: Contrasta costos operativos antes y después de la optimización justificando beneficios económicos y ambientales." },
            ],
          },
          {
            id: "CLI-RA.4",
            texto: "RA 4: Incorporar tecnologías limpias en sistemas de automatización y procesos comprobando mejoras en eficiencia, rendimiento y reducción del impacto ambiental.",
            criteriosEvaluacion: [
              { id: "CLI-CE4.1", texto: "CE4.1: Opera sensores o controladores básicos verificando la automatización de tareas repetitivas." },
              { id: "CLI-CE4.2", texto: "CE4.2: Ajusta configuraciones en dispositivos didácticos demostrando incremento en la eficiencia operativa." },
              { id: "CLI-CE4.3", texto: "CE4.3: Simula procesos automatizados en software educativo comprobando reducción de desperdicios y errores." },
              { id: "CLI-CE4.4", texto: "CE4.4: Contrasta resultados entre procesos tradicionales y tecnologías limpias evidenciando beneficios ambientales y económicos." },
            ],
          },
          {
            id: "CLI-RA.5",
            texto: "RA 5: Integrar fundamentos de orientación laboral y salud ocupacional en actividades académicas e industriales fortaleciendo habilidades profesionales y condiciones de seguridad.",
            criteriosEvaluacion: [
              { id: "CLI-CE5.1", texto: "CE5.1: Identifica normativas laborales y de seguridad ocupacional con el fin de fortalecer habilidades técnicas profesionales." },
              { id: "CLI-CE5.2", texto: "CE5.2: Aplica normativa en actividades de trabajo individual y en equipo considerando cooperación, comunicación efectiva y responsabilidad compartida." },
              { id: "CLI-CE5.3", texto: "CE5.3: Practica acciones preventivas siguiendo protocolos de salud ocupacional, ergonomía y normas de seguridad industrial con el fin de reducir riesgos laborales." },
              { id: "CLI-CE5.4", texto: "CE5.4: Valora la participación en procesos de orientación laboral evidenciando mejora en el desempeño profesional." },
            ],
          },
          {
            id: "CLI-RA.6",
            texto: "RA 6: Ejecutar procedimientos básicos de control de calidad en productos y procesos industriales verificando cumplimiento de normas técnicas y mejora continua.",
            criteriosEvaluacion: [
              { id: "CLI-CE6.1", texto: "CE6.1: Identifica productos y materiales según parámetros establecidos en normas técnicas y procedimientos internos." },
              { id: "CLI-CE6.2", texto: "CE6.2: Emplea pruebas de control de calidad estandarizadas de acuerdo con procedimientos internos y normativas técnicas." },
              { id: "CLI-CE6.3", texto: "CE6.3: Registra resultados de pruebas de calidad utilizando formatos establecidos y respetando la secuencia de procesos." },
              { id: "CLI-CE6.4", texto: "CE6.4: Comunica los hallazgos de control de calidad siguiendo documentación estandarizada y sugiriendo medidas correctivas." },
            ],
          },
        ],
      },
      {
        codigo: "CL.1.4",
        nombre: "Dibujo Técnico Aplicado",
        descripcion: "Elaborar representaciones gráficas técnicas y planos con herramientas digitales como CAD, CAE y modelado 3D.",
        anio: 1,
        categoria: "generico",
        nivel: "1ro y 2do",
        duracionPeriodos: { 1: 4, 2: 2, 3: null },
        estadoCatalogo: "completo",
        objetivoModulo:
          "Desarrollar competencias en la elaboración de representaciones gráficas técnicas, utilizando normas de dibujo, principios de geometría y herramientas digitales como CAD, CAE y modelado 3D, con el propósito de producir planos, modelos y prototipos industriales creativos y de calidad, que respondan a las necesidades de diseño y producción en diversos contextos industriales.",
        resultadosAprendizaje: [
          {
            id: "CLI-RA.1",
            texto: "RA 1: Aplicar normas de dibujo técnico y principios de geometría en planos, esquemas y representaciones gráficas verificando coherencia y exactitud en la información.",
            criteriosEvaluacion: [
              { id: "CLI-CE1.1", texto: "CE1.1: Identifica símbolos, líneas, escalas y convenciones gráficas en planos técnicos comprobando su correcta aplicación según normativa." },
              { id: "CLI-CE1.2", texto: "CE1.2: Analiza diagramas y esquemas verificando coherencia entre elementos y relaciones espaciales." },
              { id: "CLI-CE1.3", texto: "CE1.3: Diferencia elementos constructivos y funcionales en representaciones técnicas evidenciando correspondencia con el objeto real." },
              { id: "CLI-CE1.4", texto: "CE1.4: Evalúa la pertinencia de símbolos, escalas y convenciones gráficas utilizadas en planos verificando cumplimiento de estándares técnicos." },
            ],
          },
          {
            id: "CLI-RA.2",
            texto: "RA 2: Elaborar representaciones gráficas manuales y digitales de componentes y sistemas aplicando principios geométricos, escalas y normas de rotulación con claridad, precisión y legibilidad.",
            criteriosEvaluacion: [
              { id: "CLI-CE2.1", texto: "CE2.1: Traza figuras geométricas y vistas básicas utilizando instrumentos de dibujo en condiciones de orden y limpieza." },
              { id: "CLI-CE2.2", texto: "CE2.2: Aplica escalas en representaciones gráficas comprobando proporcionalidad entre objeto real y dibujo técnico." },
              { id: "CLI-CE2.3", texto: "CE2.3: Realiza planos técnicos de piezas, estructuras y ensamblajes comprobando exactitud de medidas y proporciones." },
              { id: "CLI-CE2.4", texto: "CE2.4: Presenta planos manuales y digitales con formatos estandarizados cumpliendo criterios de orden y legibilidad." },
            ],
          },
          {
            id: "CLI-RA.3",
            texto: "RA 3: Crear modelos y prototipos digitales mediante herramientas CAD/CAE aplicando operaciones de construcción, ensamblaje y simulación en función de requerimientos técnicos.",
            criteriosEvaluacion: [
              { id: "CLI-CE3.1", texto: "CE3.1: Configura parámetros de software CAD ajustando unidades, capas y formatos de acuerdo con requerimientos técnicos." },
              { id: "CLI-CE3.2", texto: "CE3.2: Construye modelos y prototipos básicos aplicando operaciones de diseño y ensamblaje." },
              { id: "CLI-CE3.3", texto: "CE3.3: Ejecuta simulaciones de funcionamiento o resistencia comprobando la operatividad del diseño." },
              { id: "CLI-CE3.4", texto: "CE3.4: Presenta prototipos digitales evidenciando precisión geométrica y factibilidad técnica conforme a los estándares establecidos." },
            ],
          },
          {
            id: "CLI-RA.4",
            texto: "RA 4: Integrar creatividad, responsabilidad y mejora continua en representaciones gráficas técnicas fomentando innovación, optimización de recursos y trabajo colaborativo.",
            criteriosEvaluacion: [
              { id: "CLI-CE4.1", texto: "CE4.1: Propone soluciones innovadoras en diseños de piezas o sistemas verificando su factibilidad técnica." },
              { id: "CLI-CE4.2", texto: "CE4.2: Analiza resultados de simulaciones gráficas identificando ajustes en geometría o materiales según especificaciones técnicas." },
              { id: "CLI-CE4.3", texto: "CE4.3: Mejora diseños digitales reduciendo complejidad, tiempos o recursos y manteniendo calidad técnica del producto." },
              { id: "CLI-CE4.4", texto: "CE4.4: Colabora en el diseño de planos, modelos y sistemas aplicando especificaciones técnicas, criterios de precisión, innovación y mejora continua." },
            ],
          },
        ],
      },
      {
        codigo: "CL.2.1",
        nombre: "Instalación de Sistemas de Climatización y Refrigeración",
        descripcion: "Aplicar procedimientos técnicos para la instalación de sistemas de climatización y refrigeración en edificaciones residenciales, comerciales o industriales.",
        anio: 1,
        categoria: "especializacion",
        nivel: "1ro, 2do, 3ro",
        duracionPeriodos: { 1: 4, 2: 3, 3: 3 },
        estadoCatalogo: "completo",
        objetivoModulo:
          "Aplicar procedimientos técnicos para la instalación de sistemas de climatización y refrigeración en edificaciones residenciales, comerciales o industriales, considerando criterios de eficiencia energética, sostenibilidad ambiental y oportunidades de emprendimiento técnico, de acuerdo con planos, normativas vigentes y las demandas del entorno productivo.",
        resultadosAprendizaje: [
          {
            id: "CLI-RA.1",
            texto: "RA 1: Interpretar planos técnicos, esquemas y manuales de instalación de sistemas térmicos, reconociendo componentes, conexiones y condiciones técnicas que influyen en la eficiencia energética y la sostenibilidad del sistema.",
            criteriosEvaluacion: [
              { id: "CLI-CE1.1", texto: "CE1.1: Distingue los símbolos, componentes y conexiones representados en planos técnicos, esquemas y manuales básicos de sistemas térmicos." },
              { id: "CLI-CE1.2", texto: "CE1.2: Relaciona la información contenida en planos y manuales con los procesos técnicos necesarios para la instalación eficiente de sistemas térmicos." },
              { id: "CLI-CE1.3", texto: "CE1.3: Analiza las condiciones técnicas descritas en los documentos y planos para prever posibles interferencias o requisitos específicos durante la instalación." },
              { id: "CLI-CE1.4", texto: "CE1.4: Propone ajustes o recomendaciones sobre la interpretación de los planos y manuales, con base en criterios de sostenibilidad, eficiencia energética y el contexto de uso." },
            ],
          },
          {
            id: "CLI-RA.2",
            texto: "RA 2: Seleccionar herramientas, materiales y equipos eficientes y compatibles con prácticas sostenibles, considerando el tipo de edificación, las condiciones de uso y el cumplimiento normativo.",
            criteriosEvaluacion: [
              { id: "CLI-CE2.1", texto: "CE2.1: Diferencia las funciones y características básicas de herramientas, materiales y equipos utilizados en sistemas térmicos." },
              { id: "CLI-CE2.2", texto: "CE2.2: Aplica adecuadamente herramientas y materiales en función del tipo de instalación, edificación y condiciones operativas." },
              { id: "CLI-CE2.3", texto: "CE2.3: Verifica la compatibilidad de los equipos seleccionados con normativas técnicas y criterios de sostenibilidad ambiental." },
              { id: "CLI-CE2.4", texto: "CE2.4: Plantea alternativas de selección más eficientes o sostenibles en herramientas o equipos, justificando técnica y ambientalmente su elección." },
            ],
          },
          {
            id: "CLI-RA.3",
            texto: "RA 3: Instalar sistemas de climatización y refrigeración, aplicando buenas prácticas técnicas, ambientales y de seguridad que aseguren el óptimo funcionamiento, bajo consumo energético y reducción del impacto ambiental.",
            criteriosEvaluacion: [
              { id: "CLI-CE3.1", texto: "CE3.1: Describe los procedimientos básicos para la instalación segura y eficiente de sistemas de climatización y refrigeración." },
              { id: "CLI-CE3.2", texto: "CE3.2: Ejecuta la instalación de sistemas térmicos siguiendo las especificaciones técnicas, normas de seguridad y criterios ambientales establecidos." },
              { id: "CLI-CE3.3", texto: "CE3.3: Realiza medidas preventivas para minimizar el consumo energético y el impacto ambiental durante la instalación." },
              { id: "CLI-CE3.4", texto: "CE3.4: Presenta mejoras en los procesos de instalación que contribuyan a optimizar el rendimiento energético y la sostenibilidad del sistema instalado." },
            ],
          },
          {
            id: "CLI-RA.4",
            texto: "RA 4: Proponer mejoras en la configuración, ubicación o selección de componentes para optimizar el desempeño energético del sistema, reducir costos de operación y abrir posibilidades para servicios técnicos sostenibles y emprendimientos propios.",
            criteriosEvaluacion: [
              { id: "CLI-CE4.1", texto: "CE4.1: Distingue factores técnicos, energéticos y económicos que influyen en el desempeño de los sistemas térmicos." },
              { id: "CLI-CE4.2", texto: "CE4.2: Selecciona prácticas y configuraciones que favorecen la eficiencia energética y reducen el impacto ambiental en la instalación de sistemas de climatización." },
              { id: "CLI-CE4.3", texto: "CE4.3: Aplica técnicas de ajuste (calibración, ubicación de sensores, aislamiento de tuberías) para optimizar el rendimiento del sistema y reducir pérdidas energéticas." },
              { id: "CLI-CE4.4", texto: "CE4.4: Plantea mejoras técnicas o de diseño que potencien el ahorro energético, la vida útil del sistema o la creación de servicios técnicos diferenciados como parte de una iniciativa de emprendimiento sostenible." },
            ],
          },
        ],
      },
      {
        codigo: "CL.2.2",
        nombre: "Montaje de Sistemas",
        descripcion: "Instalar redes de distribución de agua, gases y combustibles asociadas a sistemas térmicos con seguridad y eficiencia.",
        anio: 1,
        categoria: "especializacion",
        nivel: "1ro, 2do, 3ro",
        duracionPeriodos: { 1: 3, 2: 3, 3: 3 },
        estadoCatalogo: "completo",
        objetivoModulo:
          "Aplicar procedimientos técnicos y normativas vigentes para la instalación de redes de distribución de agua, gases y combustibles asociadas a sistemas térmicos, considerando criterios de eficiencia energética, sostenibilidad ambiental y condiciones del entorno productivo, con el fin de garantizar la seguridad, el cumplimiento técnico y la adaptación al tipo de edificación.",
        resultadosAprendizaje: [
          {
            id: "CLI-RA.1",
            texto: "RA 1: Interpretar planos, diagramas y fichas técnicas de redes hidráulicas, de gas y combustibles, identificando trayectorias, puntos críticos de instalación y condiciones técnicas y de seguridad.",
            criteriosEvaluacion: [
              { id: "CLI-CE1.1", texto: "CE1.1: Distingue símbolos, tipos de líneas, escalas y convenciones gráficas en planos y esquemas de redes térmicas, comprendiendo su significado técnico." },
              { id: "CLI-CE1.2", texto: "CE1.2: Ubica correctamente en los planos los puntos de conexión, derivación y paso de tuberías de agua, gas y combustibles, reconociendo las condiciones específicas de montaje." },
              { id: "CLI-CE1.3", texto: "CE1.3: Relaciona la información de los planos con las condiciones reales del entorno (tipo de edificación, acceso, espacio físico), anticipando posibles dificultades de instalación." },
              { id: "CLI-CE1.4", texto: "CE1.4: Propone ajustes o recomendaciones sobre trayectorias o ubicación de elementos de red, considerando eficiencia en el uso del espacio, seguridad operativa y criterios sostenibles que podrían integrarse en un servicio técnico o emprendimiento." },
            ],
          },
          {
            id: "CLI-RA.2",
            texto: "RA 2: Seleccionar materiales, equipos y accesorios adecuados para el tendido y conexión de redes térmicas, considerando eficiencia, normativas y sostenibilidad.",
            criteriosEvaluacion: [
              { id: "CLI-CE2.1", texto: "CE2.1: Clasifica materiales y componentes de uso común en redes de agua, gases y combustibles, reconociendo sus propiedades técnicas, eficiencia y compatibilidad con normativas." },
              { id: "CLI-CE2.2", texto: "CE2.2: Utiliza materiales y equipos de instalación (tuberías, válvulas, uniones, herramientas) de acuerdo con el tipo de fluido, presión de trabajo, condiciones ambientales y seguridad." },
              { id: "CLI-CE2.3", texto: "CE2.3: Aplica criterios técnicos y ambientales para elegir alternativas que optimicen el consumo de recursos y reduzcan el impacto ambiental, priorizando eficiencia energética y durabilidad." },
              { id: "CLI-CE2.4", texto: "CE2.4: Presenta alternativas sostenibles y técnicamente viables ante limitaciones de materiales o recursos disponibles en obra, considerando su posible aplicación en servicios autónomos o iniciativas de emprendimiento local." },
            ],
          },
          {
            id: "CLI-RA.3",
            texto: "RA 3: Integrar redes de distribución de agua, gases o combustibles de manera segura, eficiente y ambientalmente responsable.",
            criteriosEvaluacion: [
              { id: "CLI-CE3.1", texto: "CE3.1: Reconoce los pasos básicos del procedimiento de instalación para redes de distribución de agua, gases o combustibles, destacando los riesgos y precauciones necesarios." },
              { id: "CLI-CE3.2", texto: "CE3.2: Ejecuta el tendido e interconexión de tuberías y accesorios según planos y normas técnicas, asegurando estanqueidad, alineación y fijación adecuada." },
              { id: "CLI-CE3.3", texto: "CE3.3: Aplica medidas de seguridad personal, ambiental y operativa durante la instalación, evitando fugas, pérdidas o impactos negativos al entorno." },
              { id: "CLI-CE3.4", texto: "CE3.4: Formula ajustes técnicos o de procedimiento durante la instalación de redes ante condiciones imprevistas (espacio limitado, interferencias, cambios de diseño), manteniendo la funcionalidad, seguridad y eficiencia del sistema." },
            ],
          },
          {
            id: "CLI-RA.4",
            texto: "RA 4: Proponer soluciones técnicas para adaptar instalaciones a condiciones reales de obra, integrando criterios de ahorro energético, seguridad y emprendimiento.",
            criteriosEvaluacion: [
              { id: "CLI-CE4.1", texto: "CE4.1: Diferencia los factores del entorno de instalación (limitaciones físicas, condiciones de seguridad, accesibilidad, normativas locales) que pueden afectar la ejecución de la red." },
              { id: "CLI-CE4.2", texto: "CE4.2: Analiza posibles interferencias o restricciones en el sitio de instalación y plantea alternativas viables para su ejecución sin comprometer la funcionalidad del sistema." },
              { id: "CLI-CE4.3", texto: "CE4.3: Aplica criterios de eficiencia energética y sostenibilidad al proponer cambios en la disposición, materiales o métodos de instalación." },
              { id: "CLI-CE4.4", texto: "CE4.4: Expone soluciones técnicas contextualizadas que mejoren el diseño o ejecución de redes térmicas, considerando su replicabilidad como parte de un servicio técnico o una iniciativa de emprendimiento local." },
            ],
          },
        ],
      },
      {
        codigo: "CL.3.1",
        nombre: "Mantenimiento Técnico Sistemas Térmicos",
        descripcion: "Desarrollar mantenimiento preventivo y correctivo en sistemas térmicos garantizando su operatividad y vida útil.",
        anio: 1,
        categoria: "especializacion",
        nivel: "1ro, 2do, 3ro",
        duracionPeriodos: { 1: 4, 2: 3, 3: 3 },
        estadoCatalogo: "completo",
        objetivoModulo:
          "Desarrollar mantenimiento preventivo y correctivo en sistemas térmicos, garantizando su operatividad y prolongación de vida útil. Los estudiantes aprenderán a diagnosticar fallas, realizar ajustes y reemplazos de componentes, y aplicar prácticas sostenibles y de bajo impacto ambiental en los procesos de mantenimiento de sistemas térmicos de climatización y refrigeración.",
        resultadosAprendizaje: [
          {
            id: "CLI-RA.1",
            texto: "RA 1: Diferenciar componentes, funciones y señales de falla en sistemas térmicos, interpretando manuales técnicos, esquemas de operación y evidencias de deterioro en condiciones reales de uso.",
            criteriosEvaluacion: [
              { id: "CLI-CE1.1", texto: "CE1.1: Distingue los componentes principales de sistemas térmicos (unidades de condensación, evaporadores, termostatos, filtros, válvulas, entre otras) y describe su función básica a partir de manuales técnicos o planos." },
              { id: "CLI-CE1.2", texto: "CE1.2: Inspecciona visualmente y mediante pruebas simples el estado de los componentes, detectando señales de desgaste, ruidos anómalos, fugas o acumulación de residuos." },
              { id: "CLI-CE1.3", texto: "CE1.3: Registra los síntomas o indicadores de fallas observados, relacionándolos con posibles causas técnicas conforme a protocolos de diagnóstico preventivo." },
              { id: "CLI-CE1.4", texto: "CE1.4: Plantea una hipótesis de falla basada en la información recogida, considerando su impacto en la eficiencia energética, seguridad del sistema y posibles soluciones técnicas aplicables." },
            ],
          },
          {
            id: "CLI-RA.2",
            texto: "RA 2: Realizar mantenimiento preventivo en equipos térmicos, aplicando procedimientos técnicos establecidos que aseguren eficiencia energética, operación segura y continuidad del servicio.",
            criteriosEvaluacion: [
              { id: "CLI-CE2.1", texto: "CE2.1: Selecciona las tareas y frecuencias recomendadas para el mantenimiento preventivo de sistemas térmicos, según manuales técnicos, tipo de equipo y condiciones de uso." },
              { id: "CLI-CE2.2", texto: "CE2.2: Aplica rutinas de mantenimiento preventivo (limpieza de filtros, revisión de conexiones, verificación de presiones, lubricación, entre otros) utilizando herramientas adecuadas y siguiendo protocolos técnicos." },
              { id: "CLI-CE2.3", texto: "CE2.3: Emplea medidas de seguridad personal y ambiental durante el mantenimiento, minimizando riesgos y el uso innecesario de recursos energéticos o materiales." },
              { id: "CLI-CE2.4", texto: "CE2.4: Formula ajustes al plan de mantenimiento preventivo considerando el entorno de uso, la carga de trabajo del equipo y estrategias para optimizar el consumo energético y prolongar la vida útil del sistema." },
            ],
          },
          {
            id: "CLI-RA.3",
            texto: "RA 3: Aplicar acciones correctivas básicas en sistemas térmicos (ajustes, sustitución de partes, limpieza, sellado), aplicando criterios técnicos y buenas prácticas para la sostenibilidad y reducción de residuos.",
            criteriosEvaluacion: [
              { id: "CLI-CE3.1", texto: "CE3.1: Selecciona los procedimientos básicos para corregir fallas comunes en sistemas térmicos, de acuerdo con la naturaleza del equipo y el tipo de avería." },
              { id: "CLI-CE3.2", texto: "CE3.2: Emplea ajustes, reparaciones o reemplazo de componentes defectuosos (válvulas, sensores, cables, tubos, entre otras) utilizando herramientas, materiales y técnicas adecuadas." },
              { id: "CLI-CE3.3", texto: "CE3.3: Utiliza prácticas de mantenimiento correctivo que reduzcan residuos y eviten el reemplazo innecesario de piezas, promoviendo el uso racional de recursos." },
              { id: "CLI-CE3.4", texto: "CE3.4: Propone mejoras en los procedimientos correctivos que aumenten la eficiencia del sistema, reduzcan el tiempo de intervención y puedan ser implementadas en contextos de servicios técnicos o emprendimientos personales." },
            ],
          },
          {
            id: "CLI-RA.4",
            texto: "RA 4: Proponer soluciones técnicas preliminares para fallas identificadas en sistemas térmicos, fundamentadas en el análisis de manuales del fabricante, evidencias funcionales y criterios de eficiencia energética.",
            criteriosEvaluacion: [
              { id: "CLI-CE4.1", texto: "CE4.1: Distingue oportunidades de mejora en el sistema térmico evaluado, a partir de observaciones realizadas durante el mantenimiento o diagnóstico." },
              { id: "CLI-CE4.2", texto: "CE4.2: Realiza recomendaciones técnicas que mejoren la eficiencia energética o funcionalidad del sistema (cambios en configuración, uso de termostatos, ventilación, entre otras)." },
              { id: "CLI-CE4.3", texto: "CE4.3: Emplea principios de sostenibilidad y responsabilidad ambiental en prácticas de mantenimiento, selección de componentes o reducción de consumo energético." },
              { id: "CLI-CE4.4", texto: "CE4.4: Desarrolla un servicio técnico para contextos locales, considerando necesidades del cliente, viabilidad económica y criterios de emprendimiento técnico." },
            ],
          },
        ],
      },
      {
        codigo: "CL.3.2",
        nombre: "Ahorro Energético",
        descripcion: "Optimizar la eficiencia energética y funcionalidad de sistemas térmicos mediante propuestas de mejora.",
        anio: 2,
        categoria: "especializacion",
        nivel: "2do, 3ro",
        duracionPeriodos: { 1: null, 2: 2, 3: 4 },
        estadoCatalogo: "completo",
        objetivoModulo:
          "Aplicar propuestas de mejora en sistemas térmicos para optimizar su eficiencia energética y funcionalidad, considerando criterios técnicos, principios de sostenibilidad ambiental y las condiciones del entorno productivo.",
        resultadosAprendizaje: [
          {
            id: "CLI-RA.1",
            texto: "RA 1: Reconocer oportunidades de mejora en sistemas térmicos a partir de su evaluación funcional, consumo energético y condiciones de operación.",
            criteriosEvaluacion: [
              { id: "CLI-CE1.1", texto: "CE1.1: Distingue los parámetros clave que afectan el rendimiento de un sistema térmico (consumo eléctrico, pérdida de refrigerante, ciclos de trabajo, temperatura de retorno, entre otras)." },
              { id: "CLI-CE1.2", texto: "CE1.2: Analiza el funcionamiento del sistema en operación, comparando lecturas reales con valores recomendados para detectar posibles ineficiencias." },
              { id: "CLI-CE1.3", texto: "CE1.3: Registra evidencias del comportamiento térmico y energético del sistema, utilizando herramientas de medición y observación directa." },
              { id: "CLI-CE1.4", texto: "CE1.4: Deduce aspectos del sistema que podrían ser mejorados (aislamiento térmico, ubicación de equipos, configuración de control), justificando técnicamente su impacto positivo en eficiencia, sostenibilidad o funcionalidad." },
            ],
          },
          {
            id: "CLI-RA.2",
            texto: "RA 2: Aplicar procedimientos técnicos de ajuste, configuración o modernización en sistemas térmicos, priorizando la mejora del rendimiento energético.",
            criteriosEvaluacion: [
              { id: "CLI-CE2.1", texto: "CE2.1: Distingue los procedimientos técnicos básicos para mejorar la eficiencia de un sistema térmico (calibración de termostatos, limpieza de intercambiadores, optimización de flujo de aire, entre otros)." },
              { id: "CLI-CE2.2", texto: "CE2.2: Ejecuta ajustes o configuraciones (presiones, temperaturas, velocidades de ventilación) según recomendaciones técnicas para optimizar el desempeño energético." },
              { id: "CLI-CE2.3", texto: "CE2.3: Sustituye o reubica componentes cuando sea necesario (sensores, ductos, difusores, entre otros), verificando la mejora en la operación del sistema." },
              { id: "CLI-CE2.4", texto: "CE2.4: Formula ajustes adicionales o mejoras complementarias en función del análisis técnico, el entorno de uso y las condiciones específicas del equipo." },
            ],
          },
          {
            id: "CLI-RA.3",
            texto: "RA 3: Incorporar tecnologías, materiales o componentes que reduzcan el impacto ambiental y aumenten la eficiencia del sistema, según su viabilidad técnica y normativa.",
            criteriosEvaluacion: [
              { id: "CLI-CE3.1", texto: "CE3.1: Selecciona tecnologías, materiales y dispositivos que contribuyen a la eficiencia energética y reducción del impacto ambiental (refrigerantes ecológicos, aislamiento eficiente, controladores inteligentes, entre otras)." },
              { id: "CLI-CE3.2", texto: "CE3.2: Plantea soluciones tecnológicas viables de acuerdo con el tipo de sistema térmico, condiciones del entorno y normativa vigente." },
              { id: "CLI-CE3.3", texto: "CE3.3: Integra materiales o componentes en la instalación (reemplazo de piezas, mejoras en aislamiento, incorporación de controles automáticos), validando su correcto funcionamiento." },
              { id: "CLI-CE3.4", texto: "CE3.4: Establece mejoras o sustituciones tecnológicas con base en criterios de sostenibilidad, eficiencia energética y costos razonables, considerando su aplicación en el entorno local o como oferta de valor en servicios técnicos." },
            ],
          },
          {
            id: "CLI-RA.4",
            texto: "RA 4: Proponer soluciones técnicas viables e innovadoras adaptadas a contextos reales, que respondan a necesidades del entorno y puedan desarrollarse como servicios técnicos o emprendimientos sostenibles.",
            criteriosEvaluacion: [
              { id: "CLI-CE4.1", texto: "CE4.1: Diferencia necesidades o problemas técnicos frecuentes en sistemas térmicos del entorno productivo local (sobrecostos, ineficiencia, fallas repetitivas, uso inadecuado del equipo)." },
              { id: "CLI-CE4.2", texto: "CE4.2: Analiza alternativas de solución basadas en criterios técnicos, económicos y ambientales que puedan responder a esas necesidades específicas." },
              { id: "CLI-CE4.3", texto: "CE4.3: Elabora propuestas de mejora o rediseño de sistemas que respondan a un contexto real, considerando materiales disponibles y condiciones del entorno." },
              { id: "CLI-CE4.4", texto: "CE4.4: Desarrolla un servicio técnico o emprendimiento que incorpore las mejoras planteadas, destacando su valor agregado en eficiencia, sostenibilidad y aplicabilidad práctica en la comunidad o sector productivo." },
            ],
          },
        ],
      },
      {
        codigo: "CL.3.3",
        nombre: "Proyectos de Climatización y Refrigeración",
        descripcion: "Desarrollar propuestas de emprendimiento técnico en climatización integrando viabilidad técnica y sostenibilidad.",
        anio: 2,
        categoria: "especializacion",
        nivel: "2do, 3ro",
        duracionPeriodos: { 1: null, 2: 2, 3: 4 },
        estadoCatalogo: "completo",
        objetivoModulo:
          "Realizar propuestas de emprendimiento técnico en climatización, integrando el análisis del entorno productivo local, viabilidad técnica, criterios de sostenibilidad y demandas del mercado.",
        resultadosAprendizaje: [
          {
            id: "CLI-RA.1",
            texto: "RA 1: Reconocer oportunidades de negocio en el sector de climatización, a partir de problemáticas o necesidades técnicas del entorno.",
            criteriosEvaluacion: [
              { id: "CLI-CE1.1", texto: "CE1.1: Diferencia problemáticas o necesidades no cubiertas en servicios de climatización del entorno local (fallas recurrentes, falta de mantenimiento, baja eficiencia, entre otras)." },
              { id: "CLI-CE1.2", texto: "CE1.2: Investiga las condiciones del entorno (clima, tipo de edificaciones, nivel socioeconómico, normativas, entre otras) que inciden en la demanda de productos o servicios en climatización." },
              { id: "CLI-CE1.3", texto: "CE1.3: Analiza posibles soluciones técnicas que podrían generar valor, teniendo en cuenta los recursos, herramientas y conocimientos disponibles en su contexto." },
              { id: "CLI-CE1.4", texto: "CE1.4: Experimenta ideas de negocio viables relacionadas con instalación, mantenimiento, mejora o asesoría en sistemas térmicos, que respondan a una necesidad local y aporten eficiencia, sostenibilidad o accesibilidad." },
            ],
          },
          {
            id: "CLI-RA.2",
            texto: "RA 2: Diseñar una propuesta técnica de producto o servicio en climatización, considerando recursos disponibles, conocimientos adquiridos y principios de eficiencia y sostenibilidad.",
            criteriosEvaluacion: [
              { id: "CLI-CE2.1", texto: "CE2.1: Selecciona los elementos básicos que debe incluir una propuesta técnica de emprendimiento en climatización (objetivo, servicio o producto, materiales, equipo, destinatarios, entre otras)." },
              { id: "CLI-CE2.2", texto: "CE2.2: Elabora el diseño técnico preliminar de un producto o servicio (por ejemplo, mantenimiento domiciliario, instalación eficiente, consultoría en ahorro energético), ajustado a las capacidades técnicas del estudiante." },
              { id: "CLI-CE2.3", texto: "CE2.3: Incorpora principios de eficiencia energética, uso racional de recursos y sostenibilidad ambiental en la propuesta, justificando su pertinencia." },
              { id: "CLI-CE2.4", texto: "CE2.4: Propone un enfoque diferenciador o valor agregado de la propuesta (servicio ecológico, bajo costo, innovación técnica o adaptación local) con base en su contexto social y económico." },
            ],
          },
          {
            id: "CLI-RA.3",
            texto: "RA 3: Organizar los recursos humanos, materiales y técnicos necesarios para la puesta en marcha del emprendimiento, incluyendo la planificación básica de operaciones y costos.",
            criteriosEvaluacion: [
              { id: "CLI-CE3.1", texto: "CE3.1: Emplea los recursos humanos, materiales, tecnológicos y financieros necesarios para iniciar el producto o servicio propuesto en climatización." },
              { id: "CLI-CE3.2", texto: "CE3.2: Analiza un plan básico de actividades técnicas (instalación, mantenimiento, asesoría, distribución, entre otros), con cronograma y responsables definidos." },
              { id: "CLI-CE3.3", texto: "CE3.3: Calcula de forma inicial los costos operativos y precios referenciales, considerando materiales, tiempo de trabajo y herramientas requeridas." },
              { id: "CLI-CE3.4", texto: "CE3.4: Formula estrategias para optimizar el uso de recursos y minimizar gastos, incluyendo alternativas sostenibles (materiales reutilizables, herramientas compartidas, alianzas locales, entre otros)." },
            ],
          },
          {
            id: "CLI-RA.4",
            texto: "RA 4: Proponer un modelo de negocio o servicio técnico innovador y viable, fundamentado en un análisis del entorno, que responda a necesidades locales y promueva el desarrollo sostenible.",
            criteriosEvaluacion: [
              { id: "CLI-CE4.1", texto: "CE4.1: Distingue diferentes tipos de modelos de negocio aplicables al sector de climatización (servicio técnico, venta de repuestos, asesoría, instalación eficiente, entre otras)." },
              { id: "CLI-CE4.2", texto: "CE4.2: Desarrolla el funcionamiento general del modelo de negocio propuesto, incluyendo cliente objetivo, propuesta de valor, canales de atención y fuentes de ingreso." },
              { id: "CLI-CE4.3", texto: "CE4.3: Presenta una propuesta de marca o identidad del servicio (nombre, logo, mensaje diferenciador), orientada al entorno local y con enfoque técnico." },
              { id: "CLI-CE4.4", texto: "CE4.4: Aplica un modelo de negocio técnicamente viable, con enfoque sostenible e innovador, que responda a las condiciones del entorno productivo y contribuya a la mejora económica, social y ambiental de su comunidad." },
            ],
          },
        ],
      },
      {
        codigo: "CL.3.4",
        nombre: "Práctico Experimental",
        descripcion: "Consolidar las competencias técnicas mediante proyectos y situaciones reales de aprendizaje articuladas con el sector productivo.",
        anio: 1,
        categoria: "practico",
        nivel: "1ro, 2do, 3ro",
        duracionPeriodos: { 1: 2, 2: 2, 3: 4 },
        estadoCatalogo: "completo",
        objetivoModulo:
          "Fortalecer las competencias técnicas y las habilidades socioemocionales en la ejecución de un proyecto para demostrar las habilidades aprendidas en la aplicación de normas, instalar sistemas de climatización y refrigeración.",
        resultadosAprendizaje: [
          {
            id: "CLI-RA.1",
            texto: "RA 1: Elaborar una estructura básica de un proyecto educativo eligiendo diversas opciones de instalación de sistemas básicos de climatización.",
            criteriosEvaluacion: [
              { id: "CLI-CE1.1", texto: "CE1.1: Indaga opciones para la elaboración de un proyecto educativo en Climatización." },
              { id: "CLI-CE1.2", texto: "CE1.2: Aplica los conocimientos adquiridos en instalación de sistemas de climatización en un proyecto educativo." },
            ],
          },
          {
            id: "CLI-RA.2",
            texto: "RA 2: Ejecutar un proyecto educativo de climatización de acuerdo con las especificaciones técnicas y normativa vigente de instalación de sistemas de climatización.",
            criteriosEvaluacion: [
              { id: "CLI-CE2.1", texto: "CE2.1: Elabora un análisis de mercado: demanda, competencia directa, precios." },
              { id: "CLI-CE2.2", texto: "CE2.2: Identifica la normativa vigente: certificaciones, permisos, normativas locales de eficiencia energética." },
              { id: "CLI-CE2.3", texto: "CE2.3: Emplea los conocimientos adquiridos en instalación de sistemas de climatización en el proyecto educativo." },
              { id: "CLI-CE2.4", texto: "CE2.4: Presenta el proyecto educativo y demuestra los conocimientos adquiridos." },
            ],
          },
          {
            id: "CLI-RA.3",
            texto: "RA 3: Interpretar planos, diagramas y esquemas técnicos; montar sistemas de climatización, refrigeración y redes asociadas, interpretando documentación técnica, seleccionando recursos y aplicando procedimientos de seguridad, eficiencia energética y protección ambiental.",
            criteriosEvaluacion: [
              { id: "CLI-CE3.1", texto: "CE3.1: Interpreta planos, diagramas y esquemas técnicos; montaje de fichas técnicas y manuales, estableciendo componentes, trayectorias, conexiones y condiciones de montaje." },
              { id: "CLI-CE3.2", texto: "CE3.2: Selecciona herramientas, equipos, materiales, tuberías, accesorios y elementos de protección personal según las características del sistema, el tipo de edificación y la normativa aplicable." },
              { id: "CLI-CE3.3", texto: "CE3.3: Ejecuta y verifica el montaje de equipos, tuberías, ductos, válvulas y dispositivos de control mediante pruebas de presión, vacío, estanqueidad y funcionamiento." },
            ],
          },
          {
            id: "CLI-RA.4",
            texto: "RA 4: Diagnosticar el estado operativo de sistemas térmicos mediante inspecciones, mediciones y pruebas funcionales, determinando fallas, causas probables y necesidades de mantenimiento.",
            criteriosEvaluacion: [
              { id: "CLI-CE4.1", texto: "CE4.1: Examina componentes mecánicos, eléctricos, electrónicos y frigoríficos." },
              { id: "CLI-CE4.2", texto: "CE4.2: Mide parámetros de temperatura, presión, consumo eléctrico, flujo de aire, humedad y continuidad, utilizando instrumentos adecuados y procedimientos seguros." },
              { id: "CLI-CE4.3", texto: "CE4.3: Formula un diagnóstico técnico preliminar relacionando síntomas, mediciones, posibles causas, componentes afectados y acciones recomendadas." },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "obra-civil",
    nombre: "Construcción de Obra Civil",
    familia: "construccion",
    area: "tecnica",
    objetivoGeneral: "Ejecutar procesos constructivos de obra civil aplicando técnicas, normativas y estándares de calidad y seguridad en la construcción.",
    modulos: [
      { codigo: "OC.1.1", nombre: "Dibujo Técnico y Lectura de Planos", descripcion: "Interpretar y elaborar planos arquitectónicos y estructurales para la construcción.", anio: 1 , categoria: "generico", estadoCatalogo: "completo", nivel: "1ro, 2do", objetivoModulo: "Desarrollar la capacidad de interpretar planos técnicos y comunicar información propia de la especialidad, aplicando simbología convencional, formatos establecidos y herramientas digitales, para registrar procedimientos, resolver problemas técnicos y colaborar de manera eficaz en entornos de trabajo.", resultadosAprendizaje:[{id:"OC-RA.1",texto:"RA1: Reconocer la simbología, escalas, vistas y convenciones presentes en planos técnicos según las normas establecidas en la especialidad.",criteriosEvaluacion:[{id:"OC-CE1.1",texto:"CE1.1: Distingue correctamente los símbolos gráficos convencionales utilizados en planos técnicos de su especialidad, distinguiéndolos de otros signos o representaciones."},{id:"OC-CE1.2",texto:"CE1.2: Clasifica con precisión las partes de un plano (vistas, cortes, escalas, leyendas) según la función que cumplen y la información que representan."},{id:"OC-CE1.3",texto:"CE1.3: Establece la relación entre la simbología representada en el plano y los elementos reales del proceso o sistema técnico correspondiente."},{id:"OC-CE1.4",texto:"CE1.4: Formula observaciones o propone correcciones básicas en la lectura de planos cuando identifica incongruencias, omisiones o errores gráficos, sustentando sus aportes en las normas técnicas de la especialidad."}]},{id:"OC-RA.2",texto:"RA2: Interpretar planos técnicos y esquemas de la especialidad para explicar procesos, estructuras, circuitos o instalaciones representadas.",criteriosEvaluacion:[{id:"OC-CE2.1",texto:"CE2.1: Describe de manera clara la información contenida en planos técnicos (dimensiones, materiales, procesos, conexiones, rutas de instalación, entre otros) según su especialidad."},{id:"OC-CE2.2",texto:"CE2.2: Analiza planos o esquemas para extraer datos relevantes que orienten la ejecución de procesos técnicos como ubicación de componentes, secuencia de montaje o rutas de tendido."},{id:"OC-CE2.3",texto:"CE2.3: Resuelve dudas operativas básicas mediante la lectura e interpretación de planos, demostrando comprensión sin necesidad de modificar su contenido."},{id:"OC-CE2.4",texto:"CE2.4: Propone alternativas operativas simples (ajustes, replanteos, secuencias) en función de las condiciones reales del entorno de trabajo, utilizando como base la información del plano interpretado."}]},{id:"OC-RA.3",texto:"RA3: Utilizar herramientas digitales de dibujo y visualización para representar, consultar y compartir información técnica básica vinculada a planos.",criteriosEvaluacion:[{id:"OC-CE3.1",texto:"CE3.1: Identifica las principales funciones de programas y plataformas digitales utilizadas para visualizar, modificar o crear planos técnicos (CAD, software 2D/3D, visualizadores PDF, entre otros)."},{id:"OC-CE3.2",texto:"CE3.2: Opera herramientas digitales básicas para consultar e interpretar planos técnicos en formato digital, demostrando autonomía en su uso."},{id:"OC-CE3.3",texto:"CE3.3: Registra o edita información técnica simple (medidas, comentarios, referencias) en planos digitales, utilizando funciones del software correspondiente y respetando normas de pres"},{id:"OC-CE3.4",texto:"CE3.4: Plantea mejoras básicas en la forma de presentar, archivar o compartir planos digitales, considerando criterios de claridad, trazabilidad y colaboración en el trabajo técnico."}]},{id:"OC-RA.4",texto:"RA4: Proponer alternativas de mejora simples o ajustes básicos a partir del análisis de planos, esquemas o diagramas, considerando el entorno productivo y el trabajo en equipo.",criteriosEvaluacion:[{id:"OC-CE4.1",texto:"CE4.1: Reconoce situaciones problemáticas del entorno de trabajo que pueden resolverse mediante la correcta interpretación de planos, como errores en medidas, ubicación de elementos o interferencias."},{id:"OC-CE4.2",texto:"CE4.2: Analiza planos técnicos considerando los requerimientos del proyecto o proceso productivo, identificando oportunidades básicas de mejora en la ejecución o planificación."},{id:"OC-CE4.3",texto:"CE4.3: Elabora propuestas simples de ajuste o modificación operativa (secuencia de montaje, ubicación de equipos o trazado de instalaciones), justificándolas con información obtenida del plano."},{id:"OC-CE4.4",texto:"CE4.4: Presenta mejoras básicas en la forma de utilizar planos dentro del equipo de trabajo (formato de presentación, integración digital, uso colaborativo), que contribuyan a la eficiencia y comprensión en el contexto técnico."}]}]},
      { codigo: "OC.2.1", nombre: "Procesos Constructivos", descripcion: "Ejecutar procesos de cimentación, estructura, mampostería y acabados en obra civil.", anio: 2 },
      { codigo: "OC.3.1", nombre: "Presupuestos y Administración de Obra", descripcion: "Elaborar presupuestos y cronogramas de obra aplicando técnicas de administración de proyectos.", anio: 3 },
    ],
  },
  {
    id: "construcciones-metalicas",
    nombre: "Estructuras y Construcciones Metálicas",
    familia: "construccion",
    area: "tecnica",
    estado: "deprecada",
    reemplazadaPor: "mecanica-industrial",
    normativaVigente: "MINEDEC-MINEDEC-2025-00051-A",
    objetivoGeneral: "Fabricar y montar estructuras metálicas aplicando técnicas de soldadura, corte y conformado de metales según normativas de seguridad.",
    modulos: MODULOS_MECANICA_INDUSTRIAL,
  },
  {
    id: "instalaciones-electricas",
    nombre: "Instalaciones eléctricas y automatización",
    familia: "industrial",
    area: "tecnica",
    codigo: "TC-05-09",
    normativaVigente: "MINEDEC-MINEDEC-2025-00051-A",
    objetivoGeneral: "Diseñar, instalar y mantener instalaciones eléctricas residenciales e industriales aplicando normativas de seguridad y calidad vigentes.",
    modulos: [
      { codigo: "IE.1.1", nombre: "Electricidad Básica", descripcion: "Comprender los fundamentos de electricidad, circuitos y mediciones eléctricas.", anio: 1 , categoria: "generico", estadoCatalogo: "completo", nivel: "1ro y 2do", objetivoModulo: "Desarrollar competencias para la aplicación de normas, procedimientos y planes de seguridad e higiene, mediante la práctica en talleres, laboratorios y actividades industriales con el uso adecuado de herramientas, equipos y máquinas, con el fin de prevenir riesgos, garantizar la integridad personal y colectiva, fomentar la disciplina, responsabilidad y ética profesional en el entorno productivo.", resultadosAprendizaje:[{id:"IEA-RA.1",texto:"RA1: Emplear normas de seguridad e higiene en actividades industriales utilizando equipos de protección, señalización y rutinas de limpieza, garantizando condiciones seguras de trabajo.",criteriosEvaluacion:[{id:"IEA-CE1.1",texto:"CE1.1: Monitorea señales de seguridad en talleres y laboratorios verificando su ubicación y legibilidad en las áreas de trabajo según normativa vigente."},{id:"IEA-CE1.2",texto:"CE1.2: Utiliza los equipos de protección personal antes de iniciar actividades asegurando su funcionalidad."},{id:"IEA-CE1.3",texto:"CE1.3: Verifica las condiciones de talleres y laboratorios comprobando el cumplimiento de protocolos establecidos para mantener el orden y la limpieza."},{id:"IEA-CE1.4",texto:"CE1.4: Aplica rutinas de higiene al finalizar las tareas comprobando la eliminación de riesgos residuales."}]},{id:"IEA-RA.2",texto:"RA2: Ejecutar procedimientos de identificación, análisis y prevención de riesgos en entornos industriales aplicando metodologías técnicas y normativa vigente. CE 2.1: Detecta condiciones de riesgo utilizando listas de verificación y formatos de inspección estandarizados. CE 2.2: Clasifica peligros según tipo, frecuencia y severidad determinando su nivel de criticidad en las actividades industriales. CE 2.3: Emplea medidas preventivas acordes con los riesgos detectados verificando su pertinencia y viabilidad. CE 2.4: Evalúa la efectividad de las medidas preventivas constatando la disminución de incidentes o condiciones inseguras.",criteriosEvaluacion:[]},{id:"IEA-RA.3",texto:"RA3: Establecer planes de acción frente a emergencias siguiendo protocolos de comunicación, evacuación y control de incidentes, con el fin de reducir daños humanos y materiales. CE 3.1: Reconoce alarmas, señales y rutas de evacuación comprobando su correspondencia con los planes establecidos. CE 3.2: Notifica la emergencia al personal responsable utilizando los medios de comunicación definidos en el plan. CE 3.3: Ejecuta la evacuación siguiendo procedimientos establecidos y tiempos previstos. CE 3.4: Aplica técnicas básicas de control de emergencias verificando la preservación de la integridad de personas y bienes.",criteriosEvaluacion:[]},{id:"IEA-RA.4",texto:"RA4: Fomentar prácticas de seguridad, higiene y sostenibilidad en actividades industriales promoviendo disciplina, ética profesional y mejora continua. CE 4.1: Inspecciona las condiciones del área de trabajo aplicando listas de control de seguridad, higiene y orden. CE 4.2: Motiva la participación en campañas de seguridad y salud ocupacional mediante actividades colaborativas. CE 4.3: Detecta desviaciones menores en las condiciones de seguridad registrando las observaciones en los formatos correspondientes. CE 4.4: Cumple normas y protocolos demostrando disciplina, ética profesional y compromiso con la mejora continua.",criteriosEvaluacion:[]}]},
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
      { codigo: "EI.1.1", nombre: "Mecánica Industrial Básica", descripcion: "Aplicar técnicas de mecanizado, ajuste y montaje de elementos mecánicos.", anio: 1 , categoria: "generico", estadoCatalogo: "completo", nivel: "1ro y 2do", objetivoModulo: "Desarrollar competencias para la aplicación de normas, procedimientos y planes de seguridad e higiene, mediante la práctica en talleres, laboratorios y actividades industriales con el uso adecuado de herramientas, equipos y máquinas, con el fin de prevenir riesgos, garantizar la integridad personal y colectiva, fomentar la disciplina, responsabilidad y ética profesional en el entorno productivo.", resultadosAprendizaje:[{id:"EMA-RA.1",texto:"RA1: Emplear normas de seguridad e higiene en actividades industriales utilizando equipos de protección, señalización y rutinas de limpieza, garantizando condiciones seguras de trabajo.",criteriosEvaluacion:[{id:"EMA-CE1.1",texto:"CE1.1: Monitorea señales de seguridad en talleres y laboratorios verificando su ubicación y legibilidad en las áreas de trabajo según normativa vigente."},{id:"EMA-CE1.2",texto:"CE1.2: Utiliza los equipos de protección personal antes de iniciar actividades asegurando su funcionalidad."},{id:"EMA-CE1.3",texto:"CE1.3: Verifica las condiciones de talleres y laboratorios comprobando el cumplimiento de protocolos establecidos para mantener el orden y la limpieza."},{id:"EMA-CE1.4",texto:"CE1.4: Aplica rutinas de higiene al finalizar las tareas comprobando la eliminación de riesgos residuales."}]},{id:"EMA-RA.2",texto:"RA2: Ejecutar procedimientos de identificación, análisis y prevención de riesgos en entornos industriales aplicando metodologías técnicas y normativa vigente. CE 2.1: Detecta condiciones de riesgo utilizando listas de verificación y formatos de inspección estandarizados. CE 2.2: Clasifica peligros según tipo, frecuencia y severidad determinando su nivel de criticidad en las actividades industriales. CE 2.3: Emplea medidas preventivas acordes con los riesgos detectados verificando su pertinencia y viabilidad. CE 2.4: Evalúa la efectividad de las medidas preventivas constatando la disminución de incidentes o condiciones inseguras.",criteriosEvaluacion:[]},{id:"EMA-RA.3",texto:"RA3: Establecer planes de acción frente a emergencias siguiendo protocolos de comunicación, evacuación y control de incidentes, con el fin de reducir daños humanos y materiales. CE 3.1: Reconoce alarmas, señales y rutas de evacuación comprobando su correspondencia con los planes establecidos. CE 3.2: Notifica la emergencia al personal responsable utilizando los medios de comunicación definidos en el plan. CE 3.3: Ejecuta la evacuación siguiendo procedimientos establecidos y tiempos previstos. CE 3.4: Aplica técnicas básicas de control de emergencias verificando la preservación de la integridad de personas y bienes.",criteriosEvaluacion:[]},{id:"EMA-RA.4",texto:"RA4: Fomentar prácticas de seguridad, higiene y sostenibilidad en actividades industriales promoviendo disciplina, ética profesional y mejora continua. CE 4.1: Inspecciona las condiciones del área de trabajo aplicando listas de control de seguridad, higiene y orden. CE 4.2: Motiva la participación en campañas de seguridad y salud ocupacional mediante actividades colaborativas. CE 4.3: Detecta desviaciones menores en las condiciones de seguridad registrando las observaciones en los formatos correspondientes. CE 4.4: Cumple normas y protocolos demostrando disciplina, ética profesional y compromiso con la mejora continua.",criteriosEvaluacion:[]}]},
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
      { codigo: "EA.1.1", nombre: "Motores de Combustión Interna", descripcion: "Diagnosticar y reparar motores de combustión interna y sus sistemas auxiliares.", anio: 1 , categoria: "generico", estadoCatalogo: "completo", nivel: "1ro y 2do", objetivoModulo: "Desarrollar competencias para la aplicación de normas, procedimientos y planes de seguridad e higiene, mediante la práctica en talleres, laboratorios y actividades industriales con el uso adecuado de herramientas, equipos y máquinas, con el fin de prevenir riesgos, garantizar la integridad personal y colectiva, fomentar la disciplina, responsabilidad y ética profesional en el entorno productivo.", resultadosAprendizaje:[{id:"ME-RA.1",texto:"RA1: Emplear normas de seguridad e higiene en actividades industriales utilizando equipos de protección, señalización y rutinas de limpieza, garantizando condiciones seguras de trabajo.",criteriosEvaluacion:[{id:"ME-CE1.1",texto:"CE1.1: Monitorea señales de seguridad en talleres y laboratorios verificando su ubicación y legibilidad en las áreas de trabajo según normativa vigente."},{id:"ME-CE1.2",texto:"CE1.2: Utiliza los equipos de protección personal antes de iniciar actividades asegurando su funcionalidad."},{id:"ME-CE1.3",texto:"CE1.3: Verifica las condiciones de talleres y laboratorios comprobando el cumplimiento de protocolos establecidos para mantener el orden y la limpieza."},{id:"ME-CE1.4",texto:"CE1.4: Aplica rutinas de higiene al finalizar las tareas comprobando la eliminación de riesgos residuales."}]},{id:"ME-RA.2",texto:"RA2: Ejecutar procedimientos de identificación, análisis y prevención de riesgos en entornos industriales aplicando metodologías técnicas y normativa vigente. CE 2.1: Detecta condiciones de riesgo utilizando listas de verificación y formatos de inspección estandarizados. CE 2.2: Clasifica peligros según tipo, frecuencia y severidad determinando su nivel de criticidad en las actividades industriales. CE 2.3: Emplea medidas preventivas acordes con los riesgos detectados verificando su pertinencia y viabilidad. CE 2.4: Evalúa la efectividad de las medidas preventivas constatando la disminución de incidentes o condiciones inseguras.",criteriosEvaluacion:[]},{id:"ME-RA.3",texto:"RA3: Establecer planes de acción frente a emergencias siguiendo protocolos de comunicación, evacuación y control de incidentes, con el fin de reducir daños humanos y materiales. CE 3.1: Reconoce alarmas, señales y rutas de evacuación comprobando su correspondencia con los planes establecidos. CE 3.2: Notifica la emergencia al personal responsable utilizando los medios de comunicación definidos en el plan. CE 3.3: Ejecuta la evacuación siguiendo procedimientos establecidos y tiempos previstos. CE 3.4: Aplica técnicas básicas de control de emergencias verificando la preservación de la integridad de personas y bienes.",criteriosEvaluacion:[]},{id:"ME-RA.4",texto:"RA4: Fomentar prácticas de seguridad, higiene y sostenibilidad en actividades industriales promoviendo disciplina, ética profesional y mejora continua. CE 4.1: Inspecciona las condiciones del área de trabajo aplicando listas de control de seguridad, higiene y orden. CE 4.2: Motiva la participación en campañas de seguridad y salud ocupacional mediante actividades colaborativas. CE 4.3: Detecta desviaciones menores en las condiciones de seguridad registrando las observaciones en los formatos correspondientes. CE 4.4: Cumple normas y protocolos demostrando disciplina, ética profesional y compromiso con la mejora continua.",criteriosEvaluacion:[]}]},
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
      { codigo: "FM.1.1", nombre: "Carpintería Básica", descripcion: "Aplicar técnicas básicas de corte, ensamble y acabado en madera.", anio: 1 , categoria: "generico", estadoCatalogo: "completo", nivel: "1ro y 2do", objetivoModulo: "Desarrollar competencias para la aplicación de normas, procedimientos y planes de seguridad e higiene, mediante la práctica en talleres, laboratorios y actividades industriales con el uso adecuado de herramientas, equipos y máquinas, con el fin de prevenir riesgos, garantizar la integridad personal y colectiva, fomentar la disciplina, responsabilidad y ética profesional en el entorno productivo.", resultadosAprendizaje:[{id:"FM-RA.1",texto:"RA1: Emplear normas de seguridad e higiene en actividades industriales utilizando equipos de protección, señalización y rutinas de limpieza, garantizando condiciones seguras de trabajo.",criteriosEvaluacion:[{id:"FM-CE1.1",texto:"CE1.1: Identifica señales de seguridad en talleres y laboratorios verificando su ubicación y legibilidad en las áreas de trabajo según normativa vigente."},{id:"FM-CE1.2",texto:"CE1.2: Revisa el estado de los equipos de protección personal asegurando su operatividad antes de cada actividad."},{id:"FM-CE1.3",texto:"CE1.3: Verifica las condiciones de talleres y laboratorios comprobando el cumplimiento de protocolos establecidos para mantener el orden y la limpieza."},{id:"FM-CE1.4",texto:"CE1.4: Aplica rutinas de higiene al finalizar las tareas comprobando la eliminación de riesgos residuales."}]},{id:"FM-RA.2",texto:"RA2: Establecer procedimientos de identificación, análisis y prevención de riesgos en entornos industriales aplicando metodologías técnicas y normativa vigente.",criteriosEvaluacion:[{id:"FM-CE2.1",texto:"CE2.1: Detecta condiciones de riesgo utilizando listas de verificación y formatos de inspección estandarizados."},{id:"FM-CE2.2",texto:"CE2.2: Clasifica peligros según tipo, frecuencia y severidad determinando su nivel de criticidad en las actividades industriales."},{id:"FM-CE2.3",texto:"CE2.3: Ejecuta medidas preventivas acordes con los riesgos detectados verificando su pertinencia y viabilidad."},{id:"FM-CE2.4",texto:"CE2.4: Evalúa la efectividad de las medidas preventivas constatando la disminución de incidentes o condiciones inseguras."}]},{id:"FM-RA.3",texto:"RA3: Ejecutar planes de acción frente a emergencias siguiendo protocolos de comunicación, evacuación y control de incidentes, con el fin de reducir daños humanos y materiales.",criteriosEvaluacion:[{id:"FM-CE3.1",texto:"CE3.1: Reconoce alarmas, señales y rutas de evacuación comprobando su correspondencia con los planes establecidos."},{id:"FM-CE3.2",texto:"CE3.2: Notifica la emergencia al personal responsable utilizando los medios de comunicación definidos en el plan."},{id:"FM-CE3.3",texto:"CE3.3: Emplea la evacuación siguiendo procedimientos establecidos y tiempos previstos."},{id:"FM-CE3.4",texto:"CE3.4: Aplica técnicas básicas de control de emergencias verificando la preservación de la integridad de personas y bienes."}]},{id:"FM-RA.4",texto:"RA4: Integrar prácticas de seguridad, higiene y sostenibilidad en actividades industriales promoviendo disciplina, ética profesional y mejora continua.",criteriosEvaluacion:[{id:"FM-CE4.1",texto:"CE4.1: Inspecciona las condiciones del área de trabajo aplicando listas de control de seguridad, higiene y orden."},{id:"FM-CE4.2",texto:"CE4.2: Motiva la participación en campañas de seguridad y salud ocupacional mediante actividades colaborativas."},{id:"FM-CE4.3",texto:"CE4.3: Detecta desviaciones menores en las condiciones de seguridad registrando las observaciones en los formatos correspondientes."},{id:"FM-CE4.4",texto:"CE4.4: Cumple normas y protocolos demostrando disciplina, ética profesional y compromiso con la mejora continua."}]}]},
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
      { codigo: "MC.1.1", nombre: "Fundamentos de Mecatrónica", descripcion: "Comprender los principios de mecánica, electrónica y programación aplicados a sistemas mecatrónicos.", anio: 1 , categoria: "generico", estadoCatalogo: "completo", nivel: "1ro y 2do", objetivoModulo: "Desarrollar competencias para la aplicación de normas, procedimientos y planes de seguridad e higiene, mediante la práctica en talleres, laboratorios y actividades industriales con el uso adecuado de herramientas, equipos y máquinas, con el fin de prevenir riesgos, garantizar la integridad personal y colectiva, fomentar la disciplina, responsabilidad y ética profesional en el entorno productivo.", resultadosAprendizaje:[{id:"MI-RA.1",texto:"RA1: Emplear normas de seguridad e higiene en actividades industriales utilizando equipos de protección, señalización y rutinas de limpieza, garantizando condiciones seguras de trabajo.",criteriosEvaluacion:[{id:"MI-CE1.1",texto:"CE1.1: Monitorea señales de seguridad en talleres y laboratorios verificando su ubicación y legibilidad en las áreas de trabajo según normativa vigente."},{id:"MI-CE1.2",texto:"CE1.2: Utiliza los equipos de protección personal antes de iniciar actividades asegurando su funcionalidad."},{id:"MI-CE1.3",texto:"CE1.3: Verifica las condiciones de talleres y laboratorios comprobando el cumplimiento de protocolos establecidos para mantener el orden y la limpieza."},{id:"MI-CE1.4",texto:"CE1.4: Aplica rutinas de higiene al finalizar las tareas comprobando la eliminación de riesgos residuales."}]},{id:"MI-RA.2",texto:"RA2: Ejecutar procedimientos de identificación, análisis y prevención de riesgos en entornos industriales aplicando metodologías técnicas y normativa vigente. CE 2.1: Detecta condiciones de riesgo utilizando listas de verificación y formatos de inspección estandarizados. CE 2.2: Clasifica peligros según tipo, frecuencia y severidad determinando su nivel de criticidad en las actividades industriales. CE 2.3: Emplea medidas preventivas acordes con los riesgos detectados verificando su pertinencia y viabilidad. CE 2.4: Evalúa la efectividad de las medidas preventivas constatando la disminución de incidentes o condiciones inseguras.",criteriosEvaluacion:[]},{id:"MI-RA.3",texto:"RA3: Establecer planes de acción frente a emergencias siguiendo protocolos de comunicación, evacuación y control de incidentes, con el fin de reducir daños humanos y materiales. CE 3.1: Reconoce alarmas, señales y rutas de evacuación comprobando su correspondencia con los planes establecidos. CE 3.2: Notifica la emergencia al personal responsable utilizando los medios de comunicación definidos en el plan. CE 3.3: Ejecuta la evacuación siguiendo procedimientos establecidos y tiempos previstos. CE 3.4: Aplica técnicas básicas de control de emergencias verificando la preservación de la integridad de personas y bienes.",criteriosEvaluacion:[]},{id:"MI-RA.4",texto:"RA4: Fomentar prácticas de seguridad, higiene y sostenibilidad en actividades industriales promoviendo disciplina, ética profesional y mejora continua. CE 4.1: Inspecciona las condiciones del área de trabajo aplicando listas de control de seguridad, higiene y orden. CE 4.2: Motiva la participación en campañas de seguridad y salud ocupacional mediante actividades colaborativas. CE 4.3: Detecta desviaciones menores en las condiciones de seguridad registrando las observaciones en los formatos correspondientes. CE 4.4: Cumple normas y protocolos demostrando disciplina, ética profesional y compromiso con la mejora continua.",criteriosEvaluacion:[]}]},
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
      { codigo: "CA.1.1", nombre: "Microbiología e Inocuidad Alimentaria", descripcion: "Aplicar principios de microbiología y normativas de inocuidad en la industria alimentaria.", anio: 1 , categoria: "generico", estadoCatalogo: "completo", nivel: "Bachillerato 1ro y 2do", objetivoModulo: "Desarrollar competencias para investigar la producción y manejo de recursos agropecuarios e hidrobiológicos mediante la recolección, análisis y sistematización de información técnica, con el fin de apoyar la planificación y ejecución de actividades productivas en contextos sostenibles y pertinentes al sector.", resultadosAprendizaje:[{id:"PAS-RA.1",texto:"RA1: Reconocer técnicas e instrumentos de investigación aplicables a la producción y manejo de recursos agropecuarios e hidrobiológicos, identificando su función y relevancia para recolectar información confiable en contextos productivos.",criteriosEvaluacion:[{id:"PAS-CE1.1",texto:"CE1.1: Describe técnicas, instrumentos e insumos de recolección de datos aplicables a la producción y manejo de recursos agropecuarios e hidrobiológicos en contextos productivos."},{id:"PAS-CE1.2",texto:"CE1.2: Selecciona técnicas, instrumentos e insumos necesarios para recolectar información confiable en el contexto productivo."},{id:"PAS-CE1.3",texto:"CE1.3: Prepara las técnicas, instrumentos e insumos requeridos para el levantamiento de información técnica en campo o laboratorio."},{id:"PAS-CE1.4",texto:"CE1.4: Incorpora normas de seguridad, bioseguridad y sanidad en el manejo de las técnicas e instrumentos de investigación."}]},{id:"PAS-RA.2",texto:"RA2: Ejecutar técnicas e instrumentos de recolección de datos en actividades productivas agropecuarias e hidrobiológicas, asegurando precisión, orden y confiabilidad de la información. CE 2.1: Aplica procedimientos de muestreo y recopilación de datos siguiendo protocolos establecidos, asegurando validez, confiabilidad y relevancia de la información. CE 2.2: Analiza la información recopilada, detectando tendencias, anomalías y variaciones relevantes en los procesos productivos agropecuarios e hidrobiológicos. CE 2.3: Verifica la consistencia y coherencia de los datos recopilados, identificando y corrigiendo errores o inconsistencias. CE 2.4: Formula recomendaciones técnicas que fortalezcan las prácticas agropecuarias e hidrobiológicas, promoviendo el uso sostenible de los recursos y la eficiencia de los procesos productivos.",criteriosEvaluacion:[]},{id:"PAS-RA.3",texto:"RA3: Presentar la información recolectada mediante registros técnicos, tablas, gráficos y diagramas, asegurando su comprensión y facilitando el análisis. CE 3.1: Organiza la información recolectada según criterios técnicos y relevancia para la actividad productiva.",criteriosEvaluacion:[{id:"PAS-CE3.2",texto:"CE3.2: Representa la información mediante tablas, diagramas o gráficos básicos, asegurando claridad y orden. CE 3.3: Resume los hallazgos de la investigación de manera coherente, utilizando formatos escritos o gráficos para su adecuada visualización. CE 3.4: Interpreta tendencias, patrones o problemas detectados en los sistemas productivos a partir de la información organizada."}]},{id:"PAS-RA.4",texto:"RA4: Analizar los resultados de investigación para relacionarlos con los procesos productivos y el manejo de recursos agropecuarios e hidrobiológicos, proponiendo acciones que apoyen la ejecución de actividades productivas. CE 4.1: Explica la relación entre los resultados de investigación y los procesos productivos o de manejo de recursos agropecuarios e hidrobiológicos, identificando su incidencia en la eficiencia y sostenibilidad de las actividades. CE 4.2: Analiza los resultados de investigación para identificar tendencias, problemáticas, oportunidades o innovaciones que aporten a la mejora de los procesos productivos. CE 4.3: Presenta los resultados obtenidos, evidenciando tendencias, problemáticas, oportunidades de mejora e innovaciones en los procesos de producción y manejo de recursos. CE 4.4: Aplica los resultados de investigación en el diseño o ajustes de prácticas productivas, incorporando innovaciones y estrategias que mejoren la sostenibilidad, rentabilidad y calidad de los proceso agropecuarios e hidrobiológicos.",criteriosEvaluacion:[]}]},
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
      { codigo: "PC.1.1", nombre: "Diseño y Patronaje de Calzado", descripcion: "Diseñar modelos de calzado y elaborar patrones según tendencias y especificaciones.", anio: 1 , categoria: "generico", estadoCatalogo: "completo", nivel: "1ro y 2do", objetivoModulo: "Desarrollar competencias para la aplicación de normas, procedimientos y planes de seguridad e higiene, mediante la práctica en talleres, laboratorios y actividades industriales con el uso adecuado de herramientas, equipos y máquinas, con el fin de prevenir riesgos, garantizar la integridad personal y colectiva, fomentar la disciplina, responsabilidad y ética profesional en el entorno productivo.", resultadosAprendizaje:[{id:"PDC-RA.1",texto:"RA1: Emplear normas de seguridad e higiene en actividades industriales utilizando equipos de protección, señalización y rutinas de limpieza, garantizando condiciones seguras de trabajo.",criteriosEvaluacion:[{id:"PDC-CE1.1",texto:"CE1.1: Monitorea señales de seguridad en talleres y laboratorios verificando su ubicación y legibilidad en las áreas de trabajo según normativa vigente."},{id:"PDC-CE1.2",texto:"CE1.2: Utiliza los equipos de protección personal antes de iniciar actividades asegurando su funcionalidad."},{id:"PDC-CE1.3",texto:"CE1.3: Verifica las condiciones de talleres y laboratorios comprobando el cumplimiento de protocolos establecidos para mantener el orden y la limpieza."},{id:"PDC-CE1.4",texto:"CE1.4: Aplica rutinas de higiene al finalizar las tareas comprobando la eliminación de riesgos residuales."}]},{id:"PDC-RA.2",texto:"RA2: Ejecutar procedimientos de identificación, análisis y prevención de riesgos en entornos industriales aplicando metodologías técnicas y normativa vigente. CE 2.1: Detecta condiciones de riesgo utilizando listas de verificación y formatos de inspección estandarizados. CE 2.2: Clasifica peligros según tipo, frecuencia y severidad determinando su nivel de criticidad en las actividades industriales. CE 2.3: Emplea medidas preventivas acordes con los riesgos detectados verificando su pertinencia y viabilidad. CE 2.4: Evalúa la efectividad de las medidas preventivas constatando la disminución de incidentes o condiciones inseguras.",criteriosEvaluacion:[]},{id:"PDC-RA.3",texto:"RA3: Establecer planes de acción frente a emergencias siguiendo protocolos de comunicación, evacuación y control de incidentes, con el fin de reducir daños humanos y materiales. CE 3.1: Reconoce alarmas, señales y rutas de evacuación comprobando su correspondencia con los planes establecidos. CE 3.2: Notifica la emergencia al personal responsable utilizando los medios de comunicación definidos en el plan. CE 3.3: Ejecuta la evacuación siguiendo procedimientos establecidos y tiempos previstos. CE 3.4: Aplica técnicas básicas de control de emergencias verificando la preservación de la integridad de personas y bienes.",criteriosEvaluacion:[]},{id:"PDC-RA.4",texto:"RA4: Fomentar prácticas de seguridad, higiene y sostenibilidad en actividades industriales promoviendo disciplina, ética profesional y mejora continua. CE 4.1: Inspecciona las condiciones del área de trabajo aplicando listas de control de seguridad, higiene y orden. CE 4.2: Motiva la participación en campañas de seguridad y salud ocupacional mediante actividades colaborativas. CE 4.3: Detecta desviaciones menores en las condiciones de seguridad registrando las observaciones en los formatos correspondientes. CE 4.4: Cumple normas y protocolos demostrando disciplina, ética profesional y compromiso con la mejora continua.",criteriosEvaluacion:[]}]},
      { codigo: "PC.2.1", nombre: "Procesos de Fabricación de Calzado", descripcion: "Ejecutar procesos de corte, aparado, montaje y acabado de calzado.", anio: 2 },
      { codigo: "PC.3.1", nombre: "Control de Calidad y Producción", descripcion: "Gestionar la producción de calzado aplicando control de calidad y optimización de recursos.", anio: 3 },
    ],
  },
  {
    id: "mecanica-industrial",
    nombre: "Mecánica industrial",
    familia: "industrial",
    area: "tecnica",
    codigo: "TC-05-08",
    estado: "activa",
    normativaVigente: "MINEDEC-MINEDEC-2025-00051-A",
    objetivoGeneral: "Ejecutar procesos de mecanizado, soldadura y fabricación de componentes y estructuras metálicas aplicando técnicas de manufactura y normas de seguridad.",
    modulos: MODULOS_MECANICA_INDUSTRIAL,
  },
  // === TECNOLOGÍAS ===
  {
    id: "ciencia-datos",
    nombre: "Ciencia de Datos",
    familia: "tecnologias",
    area: "tecnica",
    objetivoGeneral: "Recopilar, procesar y analizar datos utilizando herramientas estadísticas y de programación para generar información útil en la toma de decisiones.",
    modulos: [
      { codigo: "CD.1.1", nombre: "Fundamentos de Programación y Estadística", descripcion: "Aplicar conceptos de programación y estadística descriptiva para el tratamiento de datos.", anio: 1 , categoria: "generico", estadoCatalogo: "completo", nivel: "1ro, 2do", objetivoModulo: "Desarrollar en el estudiante competencias que analice la evolución de las tecnologías de la información y la comunicación, identifique la arquitectura, el funcionamiento de hardware y software, manipule sistemas de redes y sistemas operativos, organice la información digital, con el fin de resolver de manera efectiva requerimientos en distintos entornos tecnológicos.", resultadosAprendizaje:[{id:"CD-RA.1",texto:"RA1: Analizar la evolución de las tecnologías de la información y la comunicación reconociendo sus hitos históricos, transformaciones tecnológicas y su impacto en los entornos productivos, educativos y sociales.",criteriosEvaluacion:[{id:"CD-CE1.1",texto:"CE1.1: Distingue la evolución de las TIC con base en líneas de tiempo o esquemas cronológicos."},{id:"CD-CE1.2",texto:"CE1.2: Emplea los avances tecnológicos con sus aplicaciones en distintos sectores de la sociedad."},{id:"CD-CE1.3",texto:"CE1.3: Define las generaciones de computadoras y dispositivos en función de su capacidad y arquitectura."},{id:"CD-CE1.4",texto:"CE1.4: Argumenta el impacto social, económico y cultural del uso de las TIC, mediante análisis de casos actuales o discusiones dirigidas."}]},{id:"CD-RA.2",texto:"RA2: Examinar la arquitectura de sistemas informáticos, identificando componentes de hardware, software y su funcionamiento integrado en distintos entornos tecnológicos.",criteriosEvaluacion:[{id:"CD-CE2.1",texto:"CE2.1: Inspecciona los componentes físicos de un sistema informático, clasificándolos según su función principal (entrada, procesamiento, almacenamiento, salida y comunicación)."},{id:"CD-CE2.2",texto:"CE2.2: Distingue entre software de sistema, de aplicación y de desarrollo, explicando su propósito funcional con ejemplos representativos."},{id:"CD-CE2.3",texto:"CE2.3: Elabora esquemas de arquitectura de computadoras donde ubicar los componentes funcionales y describe el flujo básico de información entre ellos."},{id:"CD-CE2.4",texto:"CE2.4: Determina el tipo de sistema informático (doméstico, industrial, educativo, entre otros) a partir de su estructura y características técnicas, según el contexto de uso."}]},{id:"CD-RA.3",texto:"RA3: Emplear sistemas operativos y entornos digitales gestionando recursos, configuración inicial y funciones elementales en la administración del sistema.",criteriosEvaluacion:[{id:"CD-CE3.1",texto:"CE3.1: Ejecuta tareas básicas de administración de archivos y carpetas, diferenciando procedimientos entre sistemas operativos gráficos y basados en línea de comandos."},{id:"CD-CE3.2",texto:"CE3.2: Identifica parámetros esenciales del sistema operativo como nombre de usuario, configuración de red y capacidad de almacenamiento, utilizando herramientas del entorno."},{id:"CD-CE3.3",texto:"CE3.3: Aplica funciones básicas de herramientas de mantenimiento del sistema operativo para optimizar su funcionamiento."},{id:"CD-CE3.4",texto:"CE3.4: Emplea instrucciones en los entornos gráficos o de línea de comandos según el tipo de operación administrativa requerida, justificando su elección."}]},{id:"CD-RA.4",texto:"RA4: Utilizar los fundamentos básicos de electricidad y electrónica digital para la construcción de circuitos simples.",criteriosEvaluacion:[{id:"CD-CE4.1",texto:"CE4.1: Examina los principios básicos de electricidad y su relación con el funcionamiento de dispositivos electrónicos utilizados en computación."},{id:"CD-CE4.2",texto:"CE4.2: Analiza componentes electrónicos digitales y su aplicación en sistemas informáticos."},{id:"CD-CE4.3",texto:"CE4.3: Establece conocimientos de lógica en la resolución de problemas digitales."},{id:"CD-CE4.4",texto:"CE4.4: Diseña esquemas y diagramas electrónicos básicos para comprender la estructura de circuitos eléctricos simples."}]},{id:"CD-RA.5",texto:"RA5: Diseñar redes informáticas comprendiendo su estructura, tipos, dispositivos, protocolos de comunicación y funciones esenciales.",criteriosEvaluacion:[{id:"CD-CE5.1",texto:"CE5.1: Clasifica elementos físicos y lógicos de una red informática según su función en el sistema."},{id:"CD-CE5.2",texto:"CE5.2: Diferencia tipos de redes (LAN, WAN, WLAN) en función de su alcance, propósito y características."},{id:"CD-CE5.3",texto:"CE5.3: Representa dispositivos de red en esquemas funcionales según su rol en la infraestructura."},{id:"CD-CE5.4",texto:"CE5.4: Elabora cuadros técnicos sobre el funcionamiento de protocolos de comunicación en la transmisión de datos."}]},{id:"CD-RA.6",texto:"RA6: Gestionar información digital utilizando herramientas tecnológicas mediante la organización, almacenamiento, protección y compartición de datos.",criteriosEvaluacion:[{id:"CD-CE6.1",texto:"CE6.1: Analiza información digital considerando su tipo, relevancia y nivel de confidencialidad en contextos educativos o profesionales."},{id:"CD-CE6.2",texto:"CE6.2: Organiza carpetas y archivos con nombres coherentes en soportes físicos y virtuales con base en criterios de estructuración lógica."},{id:"CD-CE6.3",texto:"CE6.3: Implementa medidas básicas de protección de datos mediante contraseñas, permisos de acceso o cifrado en entornos digitales."},{id:"CD-CE6.4",texto:"CE6.4: Transfiere información en plataformas colaborativas o servicios en la nube respetando estándares de seguridad y compatibilidad."}]}]},
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
      { codigo: "DS.1.1", nombre: "Algoritmos y Programación", descripcion: "Desarrollar algoritmos y programas utilizando estructuras de datos y control de flujo.", anio: 1 , categoria: "generico", estadoCatalogo: "completo", nivel: "1ro, 2do", objetivoModulo: "Desarrollar en el estudiante competencias que analice la evolución de las tecnologías de la información y la comunicación, identifique la arquitectura, el funcionamiento de hardware y software, manipule sistemas de redes y sistemas operativos, organice la información digital, con el fin de resolver de manera efectiva requerimientos en distintos entornos tecnológicos.", resultadosAprendizaje:[{id:"DS-RA.1",texto:"RA1: Analizar la evolución de las tecnologías de la información y la comunicación reconociendo sus hitos históricos, transformaciones tecnológicas y su impacto en los entornos productivos, educativos y sociales.",criteriosEvaluacion:[{id:"DS-CE1.1",texto:"CE1.1: Distingue la evolución de las TIC con base en líneas de tiempo o esquemas cronológicos."},{id:"DS-CE1.2",texto:"CE1.2: Emplea los avances tecnológicos con sus aplicaciones en distintos sectores de la sociedad."},{id:"DS-CE1.3",texto:"CE1.3: Define las generaciones de computadoras y dispositivos en función de su capacidad y arquitectura."},{id:"DS-CE1.4",texto:"CE1.4: Argumenta el impacto social, económico y cultural del uso de las TIC, mediante análisis de casos actuales o discusiones dirigidas."}]},{id:"DS-RA.2",texto:"RA2: Examinar la arquitectura de sistemas informáticos, identificando componentes de hardware, software y su funcionamiento integrado en distintos entornos tecnológicos.",criteriosEvaluacion:[{id:"DS-CE2.1",texto:"CE2.1: Inspecciona los componentes físicos de un sistema informático, clasificándolos según su función principal (entrada, procesamiento, almacenamiento, salida y comunicación)."},{id:"DS-CE2.2",texto:"CE2.2: Distingue entre software de sistema, de aplicación y de desarrollo, explicando su propósito funcional con ejemplos representativos."},{id:"DS-CE2.3",texto:"CE2.3: Elabora esquemas de arquitectura de computadoras donde ubicar los componentes funcionales y describe el flujo básico de información entre ellos."},{id:"DS-CE2.4",texto:"CE2.4: Determina el tipo de sistema informático (doméstico, industrial, educativo, entre otros) a partir de su estructura y características técnicas, según el contexto de uso."}]},{id:"DS-RA.3",texto:"RA3: Emplear sistemas operativos y entornos digitales gestionando recursos, configuración inicial y funciones elementales en la administración del sistema.",criteriosEvaluacion:[{id:"DS-CE3.1",texto:"CE3.1: Ejecuta tareas básicas de administración de archivos y carpetas, diferenciando procedimientos entre sistemas operativos gráficos y basados en línea de comandos."},{id:"DS-CE3.2",texto:"CE3.2: Identifica parámetros esenciales del sistema operativo como nombre de usuario, configuración de red y capacidad de almacenamiento, utilizando herramientas del entorno."},{id:"DS-CE3.3",texto:"CE3.3: Aplica funciones básicas de herramientas de mantenimiento del sistema operativo para optimizar su funcionamiento."},{id:"DS-CE3.4",texto:"CE3.4: Emplea instrucciones en los entornos gráficos o de línea de comandos según el tipo de operación administrativa requerida, justificando su elección."}]},{id:"DS-RA.4",texto:"RA4: Utilizar los fundamentos básicos de electricidad y electrónica digital para la construcción de circuitos simples.",criteriosEvaluacion:[{id:"DS-CE4.1",texto:"CE4.1: Examina los principios básicos de electricidad y su relación con el funcionamiento de dispositivos electrónicos utilizados en computación."},{id:"DS-CE4.2",texto:"CE4.2: Analiza componentes electrónicos digitales y su aplicación en sistemas informáticos."},{id:"DS-CE4.3",texto:"CE4.3: Establece conocimientos de lógica en la resolución de problemas digitales."},{id:"DS-CE4.4",texto:"CE4.4: Diseña esquemas y diagramas electrónicos básicos para comprender la estructura de circuitos eléctricos simples."}]},{id:"DS-RA.5",texto:"RA5: Diseñar redes informáticas comprendiendo su estructura, tipos, dispositivos, protocolos de comunicación y funciones esenciales.",criteriosEvaluacion:[{id:"DS-CE5.1",texto:"CE5.1: Clasifica elementos físicos y lógicos de una red informática según su función en el sistema."},{id:"DS-CE5.2",texto:"CE5.2: Diferencia tipos de redes (LAN, WAN, WLAN) en función de su alcance, propósito y características."},{id:"DS-CE5.3",texto:"CE5.3: Representa dispositivos de red en esquemas funcionales según su rol en la infraestructura."},{id:"DS-CE5.4",texto:"CE5.4: Elabora cuadros técnicos sobre el funcionamiento de protocolos de comunicación en la transmisión de datos."}]},{id:"DS-RA.6",texto:"RA6: Gestionar información digital utilizando herramientas tecnológicas mediante la organización, almacenamiento, protección y compartición de datos.",criteriosEvaluacion:[{id:"DS-CE6.1",texto:"CE6.1: Analiza información digital considerando su tipo, relevancia y nivel de confidencialidad en contextos educativos o profesionales."},{id:"DS-CE6.2",texto:"CE6.2: Organiza carpetas y archivos con nombres coherentes en soportes físicos y virtuales con base en criterios de estructuración lógica."},{id:"DS-CE6.3",texto:"CE6.3: Implementa medidas básicas de protección de datos mediante contraseñas, permisos de acceso o cifrado en entornos digitales."},{id:"DS-CE6.4",texto:"CE6.4: Transfiere información en plataformas colaborativas o servicios en la nube respetando estándares de seguridad y compatibilidad."}]}]},
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
      { codigo: "RT.1.1", nombre: "Fundamentos de Redes", descripcion: "Comprender arquitecturas de red, modelos OSI/TCP-IP y configuración básica de equipos.", anio: 1 , categoria: "generico", estadoCatalogo: "completo", nivel: "1ro, 2do", objetivoModulo: "Desarrollar en el estudiante competencias que analice la evolución de las tecnologías de la información y la comunicación, identifique la arquitectura, el funcionamiento de hardware y software, manipule sistemas de redes y sistemas operativos, organice la información digital, con el fin de resolver de manera efectiva requerimientos en distintos entornos tecnológicos.", resultadosAprendizaje:[{id:"RT-RA.1",texto:"RA1: Analizar la evolución de las tecnologías de la información y la comunicación reconociendo sus hitos históricos, transformaciones tecnológicas y su impacto en los entornos productivos, educativos y sociales.",criteriosEvaluacion:[{id:"RT-CE1.1",texto:"CE1.1: Distingue la evolución de las TIC con base en líneas de tiempo o esquemas cronológicos."},{id:"RT-CE1.2",texto:"CE1.2: Emplea los avances tecnológicos con sus aplicaciones en distintos sectores de la sociedad."},{id:"RT-CE1.3",texto:"CE1.3: Define las generaciones de computadoras y dispositivos en función de su capacidad y arquitectura."},{id:"RT-CE1.4",texto:"CE1.4: Argumenta el impacto social, económico y cultural del uso de las TIC, mediante análisis de casos actuales o discusiones dirigidas."}]},{id:"RT-RA.2",texto:"RA2: Examinar la arquitectura de sistemas informáticos, identificando componentes de hardware, software y su funcionamiento integrado en distintos entornos tecnológicos.",criteriosEvaluacion:[{id:"RT-CE2.1",texto:"CE2.1: Inspecciona los componentes físicos de un sistema informático, clasificándolos según su función principal (entrada, procesamiento, almacenamiento, salida y comunicación)."},{id:"RT-CE2.2",texto:"CE2.2: Distingue entre software de sistema, de aplicación y de desarrollo, explicando su propósito funcional con ejemplos representativos."},{id:"RT-CE2.3",texto:"CE2.3: Elabora esquemas de arquitectura de computadoras donde ubicar los componentes funcionales y describe el flujo básico de información entre ellos."},{id:"RT-CE2.4",texto:"CE2.4: Determina el tipo de sistema informático (doméstico, industrial, educativo, entre otros) a partir de su estructura y características técnicas, según el contexto de uso."}]},{id:"RT-RA.3",texto:"RA3: Emplear sistemas operativos y entornos digitales gestionando recursos, configuración inicial y funciones elementales en la administración del sistema.",criteriosEvaluacion:[{id:"RT-CE3.1",texto:"CE3.1: Ejecuta tareas básicas de administración de archivos y carpetas, diferenciando procedimientos entre sistemas operativos gráficos y basados en línea de comandos."},{id:"RT-CE3.2",texto:"CE3.2: Identifica parámetros esenciales del sistema operativo como nombre de usuario, configuración de red y capacidad de almacenamiento, utilizando herramientas del entorno."},{id:"RT-CE3.3",texto:"CE3.3: Aplica funciones básicas de herramientas de mantenimiento del sistema operativo para optimizar su funcionamiento."},{id:"RT-CE3.4",texto:"CE3.4: Emplea instrucciones en los entornos gráficos o de línea de comandos según el tipo de operación administrativa requerida, justificando su elección."}]},{id:"RT-RA.4",texto:"RA4: Utilizar los fundamentos básicos de electricidad y electrónica digital para la construcción de circuitos simples.",criteriosEvaluacion:[{id:"RT-CE4.1",texto:"CE4.1: Examina los principios básicos de electricidad y su relación con el funcionamiento de dispositivos electrónicos utilizados en computación."},{id:"RT-CE4.2",texto:"CE4.2: Analiza componentes electrónicos digitales y su aplicación en sistemas informáticos."},{id:"RT-CE4.3",texto:"CE4.3: Establece conocimientos de lógica en la resolución de problemas digitales."},{id:"RT-CE4.4",texto:"CE4.4: Diseña esquemas y diagramas electrónicos básicos para comprender la estructura de circuitos eléctricos simples."}]},{id:"RT-RA.5",texto:"RA5: Diseñar redes informáticas comprendiendo su estructura, tipos, dispositivos, protocolos de comunicación y funciones esenciales.",criteriosEvaluacion:[{id:"RT-CE5.1",texto:"CE5.1: Clasifica elementos físicos y lógicos de una red informática según su función en el sistema."},{id:"RT-CE5.2",texto:"CE5.2: Diferencia tipos de redes (LAN, WAN, WLAN) en función de su alcance, propósito y características."},{id:"RT-CE5.3",texto:"CE5.3: Representa dispositivos de red en esquemas funcionales según su rol en la infraestructura."},{id:"RT-CE5.4",texto:"CE5.4: Elabora cuadros técnicos sobre el funcionamiento de protocolos de comunicación en la transmisión de datos."}]},{id:"RT-RA.6",texto:"RA6: Gestionar información digital utilizando herramientas tecnológicas mediante la organización, almacenamiento, protección y compartición de datos.",criteriosEvaluacion:[{id:"RT-CE6.1",texto:"CE6.1: Analiza información digital considerando su tipo, relevancia y nivel de confidencialidad en contextos educativos o profesionales."},{id:"RT-CE6.2",texto:"CE6.2: Organiza carpetas y archivos con nombres coherentes en soportes físicos y virtuales con base en criterios de estructuración lógica."},{id:"RT-CE6.3",texto:"CE6.3: Implementa medidas básicas de protección de datos mediante contraseñas, permisos de acceso o cifrado en entornos digitales."},{id:"RT-CE6.4",texto:"CE6.4: Transfiere información en plataformas colaborativas o servicios en la nube respetando estándares de seguridad y compatibilidad."}]}]},
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
      { codigo: "SI.1.1", nombre: "Fundamentos de Seguridad Informática", descripcion: "Comprender amenazas, vulnerabilidades y principios de seguridad de la información.", anio: 1 , categoria: "generico", estadoCatalogo: "completo", nivel: "1ro, 2do", objetivoModulo: "Desarrollar en el estudiante competencias que analice la evolución de las tecnologías de la información y la comunicación, identifique la arquitectura, el funcionamiento de hardware y software, manipule sistemas de redes y sistemas operativos, organice la información digital, con el fin de resolver de manera efectiva requerimientos en distintos entornos tecnológicos.", resultadosAprendizaje:[{id:"SI-RA.1",texto:"RA1: Analizar la evolución de las tecnologías de la información y la comunicación reconociendo sus hitos históricos, transformaciones tecnológicas y su impacto en los entornos productivos, educativos y sociales.",criteriosEvaluacion:[{id:"SI-CE1.1",texto:"CE1.1: Distingue la evolución de las TIC con base en líneas de tiempo o esquemas cronológicos."},{id:"SI-CE1.2",texto:"CE1.2: Emplea los avances tecnológicos con sus aplicaciones en distintos sectores de la sociedad."},{id:"SI-CE1.3",texto:"CE1.3: Define las generaciones de computadoras y dispositivos en función de su capacidad y arquitectura."},{id:"SI-CE1.4",texto:"CE1.4: Argumenta el impacto social, económico y cultural del uso de las TIC, mediante análisis de casos actuales o discusiones dirigidas."}]},{id:"SI-RA.2",texto:"RA2: Examinar la arquitectura de sistemas informáticos, identificando componentes de hardware, software y su funcionamiento integrado en distintos entornos tecnológicos.",criteriosEvaluacion:[{id:"SI-CE2.1",texto:"CE2.1: Inspecciona los componentes físicos de un sistema informático, clasificándolos según su función principal (entrada, procesamiento, almacenamiento, salida y comunicación)."},{id:"SI-CE2.2",texto:"CE2.2: Distingue entre software de sistema, de aplicación y de desarrollo, explicando su propósito funcional con ejemplos representativos."},{id:"SI-CE2.3",texto:"CE2.3: Elabora esquemas de arquitectura de computadoras donde ubicar los componentes funcionales y describe el flujo básico de información entre ellos."},{id:"SI-CE2.4",texto:"CE2.4: Determina el tipo de sistema informático (doméstico, industrial, educativo, entre otros) a partir de su estructura y características técnicas, según el contexto de uso."}]},{id:"SI-RA.3",texto:"RA3: Emplear sistemas operativos y entornos digitales gestionando recursos, configuración inicial y funciones elementales en la administración del sistema.",criteriosEvaluacion:[{id:"SI-CE3.1",texto:"CE3.1: Ejecuta tareas básicas de administración de archivos y carpetas, diferenciando procedimientos entre sistemas operativos gráficos y basados en línea de comandos."},{id:"SI-CE3.2",texto:"CE3.2: Identifica parámetros esenciales del sistema operativo como nombre de usuario, configuración de red y capacidad de almacenamiento, utilizando herramientas del entorno."},{id:"SI-CE3.3",texto:"CE3.3: Aplica funciones básicas de herramientas de mantenimiento del sistema operativo para optimizar su funcionamiento."},{id:"SI-CE3.4",texto:"CE3.4: Emplea instrucciones en los entornos gráficos o de línea de comandos según el tipo de operación administrativa requerida, justificando su elección."}]},{id:"SI-RA.4",texto:"RA4: Utilizar los fundamentos básicos de electricidad y electrónica digital para la construcción de circuitos simples.",criteriosEvaluacion:[{id:"SI-CE4.1",texto:"CE4.1: Examina los principios básicos de electricidad y su relación con el funcionamiento de dispositivos electrónicos utilizados en computación."},{id:"SI-CE4.2",texto:"CE4.2: Analiza componentes electrónicos digitales y su aplicación en sistemas informáticos."},{id:"SI-CE4.3",texto:"CE4.3: Establece conocimientos de lógica en la resolución de problemas digitales."},{id:"SI-CE4.4",texto:"CE4.4: Diseña esquemas y diagramas electrónicos básicos para comprender la estructura de circuitos eléctricos simples."}]},{id:"SI-RA.5",texto:"RA5: Diseñar redes informáticas comprendiendo su estructura, tipos, dispositivos, protocolos de comunicación y funciones esenciales.",criteriosEvaluacion:[{id:"SI-CE5.1",texto:"CE5.1: Clasifica elementos físicos y lógicos de una red informática según su función en el sistema."},{id:"SI-CE5.2",texto:"CE5.2: Diferencia tipos de redes (LAN, WAN, WLAN) en función de su alcance, propósito y características."},{id:"SI-CE5.3",texto:"CE5.3: Representa dispositivos de red en esquemas funcionales según su rol en la infraestructura."},{id:"SI-CE5.4",texto:"CE5.4: Elabora cuadros técnicos sobre el funcionamiento de protocolos de comunicación en la transmisión de datos."}]},{id:"SI-RA.6",texto:"RA6: Gestionar información digital utilizando herramientas tecnológicas mediante la organización, almacenamiento, protección y compartición de datos.",criteriosEvaluacion:[{id:"SI-CE6.1",texto:"CE6.1: Analiza información digital considerando su tipo, relevancia y nivel de confidencialidad en contextos educativos o profesionales."},{id:"SI-CE6.2",texto:"CE6.2: Organiza carpetas y archivos con nombres coherentes en soportes físicos y virtuales con base en criterios de estructuración lógica."},{id:"SI-CE6.3",texto:"CE6.3: Implementa medidas básicas de protección de datos mediante contraseñas, permisos de acceso o cifrado en entornos digitales."},{id:"SI-CE6.4",texto:"CE6.4: Transfiere información en plataformas colaborativas o servicios en la nube respetando estándares de seguridad y compatibilidad."}]}]},
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
      { codigo: "SIN.1.1", nombre: "Aplicaciones Ofimáticas", descripcion: "Procesar información utilizando herramientas ofimáticas locales y en línea según requerimientos del usuario.", anio: 1 , categoria: "generico", estadoCatalogo: "completo", nivel: "1ro, 2do", objetivoModulo: "Desarrollar en el estudiante competencias que analice la evolución de las tecnologías de la información y la comunicación, identifique la arquitectura, el funcionamiento de hardware y software, manipule sistemas de redes y sistemas operativos, organice la información digital, con el fin de resolver de manera efectiva requerimientos en distintos entornos tecnológicos.", resultadosAprendizaje:[{id:"SOP-RA.1",texto:"RA1: Analizar la evolución de las tecnologías de la información y la comunicación reconociendo sus hitos históricos, transformaciones tecnológicas y su impacto en los entornos productivos, educativos y sociales.",criteriosEvaluacion:[{id:"SOP-CE1.1",texto:"CE1.1: Distingue la evolución de las TIC con base en líneas de tiempo o esquemas cronológicos."},{id:"SOP-CE1.2",texto:"CE1.2: Emplea los avances tecnológicos con sus aplicaciones en distintos sectores de la sociedad."},{id:"SOP-CE1.3",texto:"CE1.3: Define las generaciones de computadoras y dispositivos en función de su capacidad y arquitectura."},{id:"SOP-CE1.4",texto:"CE1.4: Argumenta el impacto social, económico y cultural del uso de las TIC, mediante análisis de casos actuales o discusiones dirigidas."}]},{id:"SOP-RA.2",texto:"RA2: Examinar la arquitectura de sistemas informáticos, identificando componentes de hardware, software y su funcionamiento integrado en distintos entornos tecnológicos.",criteriosEvaluacion:[{id:"SOP-CE2.1",texto:"CE2.1: Inspecciona los componentes físicos de un sistema informático, clasificándolos según su función principal (entrada, procesamiento, almacenamiento, salida y comunicación)."},{id:"SOP-CE2.2",texto:"CE2.2: Distingue entre software de sistema, de aplicación y de desarrollo, explicando su propósito funcional con ejemplos representativos."},{id:"SOP-CE2.3",texto:"CE2.3: Elabora esquemas de arquitectura de computadoras donde ubicar los componentes funcionales y describe el flujo básico de información entre ellos."},{id:"SOP-CE2.4",texto:"CE2.4: Determina el tipo de sistema informático (doméstico, industrial, educativo, entre otros) a partir de su estructura y características técnicas, según el contexto de uso."}]},{id:"SOP-RA.3",texto:"RA3: Emplear sistemas operativos y entornos digitales gestionando recursos, configuración inicial y funciones elementales en la administración del sistema.",criteriosEvaluacion:[{id:"SOP-CE3.1",texto:"CE3.1: Ejecuta tareas básicas de administración de archivos y carpetas, diferenciando procedimientos entre sistemas operativos gráficos y basados en línea de comandos."},{id:"SOP-CE3.2",texto:"CE3.2: Identifica parámetros esenciales del sistema operativo como nombre de usuario, configuración de red y capacidad de almacenamiento, utilizando herramientas del entorno."},{id:"SOP-CE3.3",texto:"CE3.3: Aplica funciones básicas de herramientas de mantenimiento del sistema operativo para optimizar su funcionamiento."},{id:"SOP-CE3.4",texto:"CE3.4: Emplea instrucciones en los entornos gráficos o de línea de comandos según el tipo de operación administrativa requerida, justificando su elección."}]},{id:"SOP-RA.4",texto:"RA4: Utilizar los fundamentos básicos de electricidad y electrónica digital para la construcción de circuitos simples.",criteriosEvaluacion:[{id:"SOP-CE4.1",texto:"CE4.1: Examina los principios básicos de electricidad y su relación con el funcionamiento de dispositivos electrónicos utilizados en computación."},{id:"SOP-CE4.2",texto:"CE4.2: Analiza componentes electrónicos digitales y su aplicación en sistemas informáticos."},{id:"SOP-CE4.3",texto:"CE4.3: Establece conocimientos de lógica en la resolución de problemas digitales."},{id:"SOP-CE4.4",texto:"CE4.4: Diseña esquemas y diagramas electrónicos básicos para comprender la estructura de circuitos eléctricos simples."}]},{id:"SOP-RA.5",texto:"RA5: Diseñar redes informáticas comprendiendo su estructura, tipos, dispositivos, protocolos de comunicación y funciones esenciales.",criteriosEvaluacion:[{id:"SOP-CE5.1",texto:"CE5.1: Clasifica elementos físicos y lógicos de una red informática según su función en el sistema."},{id:"SOP-CE5.2",texto:"CE5.2: Diferencia tipos de redes (LAN, WAN, WLAN) en función de su alcance, propósito y características."},{id:"SOP-CE5.3",texto:"CE5.3: Representa dispositivos de red en esquemas funcionales según su rol en la infraestructura."},{id:"SOP-CE5.4",texto:"CE5.4: Elabora cuadros técnicos sobre el funcionamiento de protocolos de comunicación en la transmisión de datos."}]},{id:"SOP-RA.6",texto:"RA6: Gestionar información digital utilizando herramientas tecnológicas mediante la organización, almacenamiento, protección y compartición de datos.",criteriosEvaluacion:[{id:"SOP-CE6.1",texto:"CE6.1: Analiza información digital considerando su tipo, relevancia y nivel de confidencialidad en contextos educativos o profesionales."},{id:"SOP-CE6.2",texto:"CE6.2: Organiza carpetas y archivos con nombres coherentes en soportes físicos y virtuales con base en criterios de estructuración lógica."},{id:"SOP-CE6.3",texto:"CE6.3: Implementa medidas básicas de protección de datos mediante contraseñas, permisos de acceso o cifrado en entornos digitales."},{id:"SOP-CE6.4",texto:"CE6.4: Transfiere información en plataformas colaborativas o servicios en la nube respetando estándares de seguridad y compatibilidad."}]}]},
      { codigo: "SIN.1.2", nombre: "Sistemas Operativos y Redes", descripcion: "Implantar y mantener sistemas operativos y redes utilizando recursos físicos y lógicos.", anio: 1 , categoria: "generico", estadoCatalogo: "completo", nivel: "1ro, 2do", objetivoModulo: "Fortalecer en el estudiante competencias técnicas en la formulación y representación algorítmica, programación básica, aplicando metodologías de desarrollo, conceptos lógicos matemáticos y sistemas numéricos para la resolución de problemas computacionales.", resultadosAprendizaje:[{id:"SOP-RA.1",texto:"RA1: Aplicar conceptos de lógica matemática, conjuntos y sistemas numéricos en la resolución de problemas computacionales.",criteriosEvaluacion:[{id:"SOP-CE1.1",texto:"CE1.1: Distingue proposiciones y operaciones lógicas utilizando tablas de verdad y leyes del álgebra booleana."},{id:"SOP-CE1.2",texto:"CE1.2: Representa operaciones de conjuntos en problemas computacionales mediante diagramas y notación formal."},{id:"SOP-CE1.3",texto:"CE1.3: Transforma valores entre sistemas numéricos binario, decimal, hexadecimal y octal como base para el tratamiento de datos."},{id:"SOP-CE1.4",texto:"CE1.4: Resuelve problemas que combinan lógica proposicional y sistemas numéricos en contextos computacionales específicos."}]},{id:"SOP-RA.2",texto:"RA2: Resolver algoritmos de aplicaciones informáticas, representarlos mediante diagramas de flujo y pseudocódigo.",criteriosEvaluacion:[{id:"SOP-CE2.1",texto:"CE2.1: Descompone problemas en pasos secuenciales mediante la elaboración de diagramas de flujo estructurados."},{id:"SOP-CE2.2",texto:"CE2.2: Traduce diagramas de flujo a pseudocódigo utilizando sintaxis estructurada y lógica funcional."},{id:"SOP-CE2.3",texto:"CE2.3: Verifica algoritmos mediante pruebas y simulaciones, identificando errores de lógica y eficiencia."},{id:"SOP-CE2.4",texto:"CE2.4: Contrasta resultados esperados y obtenidos para evaluar el comportamiento funcional del algoritmo."}]},{id:"SOP-RA.3",texto:"RA3: Utilizar programación en la construcción de soluciones computacionales.",criteriosEvaluacion:[{id:"SOP-CE3.1",texto:"CE3.1: Emplea estructuras secuenciales, condicionales y repetitivas al desarrollar programas en un lenguaje de programación resolviendo problemas computacionales básicos."},{id:"SOP-CE3.2",texto:"CE3.2: Construye clases, atributos y métodos aplicando principios de encapsulamiento, herencia y polimorfismo en un lenguaje orientado a objetos."},{id:"SOP-CE3.3",texto:"CE3.3: Elabora estructuras de datos simples como vectores, listas y matrices para la gestión de información en aplicaciones básicas."},{id:"SOP-CE3.4",texto:"CE3.4: Codifica programas simples verificando la funcionalidad conforme a los requerimientos establecidos y resultados esperados."},{id:"SOP-CE3.5",texto:"CE3.5: Documenta mediante comentarios técnicos explicando la lógica, estructura y funcionamiento del código fuente."}]},{id:"SOP-RA.4",texto:"RA4: Diseñar interfaces básicas facilitando la interacción con usuarios en aplicaciones de consola y GUI.",criteriosEvaluacion:[{id:"SOP-CE4.1",texto:"CE4.1: Aplica elementos visuales, etiquetas y campos adecuados al tipo de aplicación (consola o GUI) para representar la funcionalidad esperada."},{id:"SOP-CE4.2",texto:"CE4.2: Integra principios de usabilidad y accesibilidad en el diseño de interfaces, considerando la disposición, navegación y comprensión visual"},{id:"SOP-CE4.3",texto:"CE4.3: Programa eventos y validaciones que responden correctamente a las acciones del usuario, previniendo errores en tiempo de ejecución."},{id:"SOP-CE4.4",texto:"CE4.4: Realiza pruebas para identificar mejoras en la interacción y funcionalidad de la interfaz desarrollada."}]},{id:"SOP-RA.5",texto:"RA5: Implementar metodologías de desarrollo de software en función del tipo de proyecto, integrando tiempos de entrega y colaboración en equipo.",criteriosEvaluacion:[{id:"SOP-CE5.1",texto:"CE5.1: Selecciona adecuadamente la metodología de desarrollo (ágil, tradicional, híbrida) según los requerimientos del proyecto."},{id:"SOP-CE5.2",texto:"CE5.2: Realiza las tareas de desarrollo de acuerdo con la metodología seleccionada, cumpliendo entregables y estándares."},{id:"SOP-CE5.3",texto:"CE5.3: Coordina la colaboración en equipo utilizando herramientas digitales que facilitan la comunicación y el seguimiento de actividades."},{id:"SOP-CE5.4",texto:"CE5.4: Documenta el proceso de desarrollo mediante registros técnicos que evidencian el avance y la gestión del proyecto."}]}]},
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
      { codigo: "GT.1.1", nombre: "Fundamentos del Turismo", descripcion: "Comprender la industria turística, sus componentes y la oferta turística del Ecuador.", anio: 1 , categoria: "generico", estadoCatalogo: "completo", nivel: "1ro", objetivoModulo: "Integrar los principios fundamentales, los conceptos clave y las prácticas relevantes sobre la cultura y la interculturalidad, para aplicarlos al ámbito del turismo y la gastronomía.", resultadosAprendizaje:[{id:"GT-RA.1",texto:"RA1: Reconocer los principios fundamentales y conceptos clave relacionados con la cultura y la interculturalidad a nivel mundial y nacional.",criteriosEvaluacion:[{id:"GT-CE1.1",texto:"CE1.1: Describe sobre la diversidad cultural del país, y su influencia en los productos turísticos y gastronómicos."},{id:"GT-CE1.2",texto:"CE1.2: Cataloga al turismo como una relación intercultural, destacando el intercambio de conocimientos, culturas y su contribución a la promoción de la paz entre los visitantes y las comunidades locales."},{id:"GT-CE1.3",texto:"CE1.3: Analiza el valor de la diversidad cultural del Ecuador, subrayando la importancia de las costumbres y tradiciones de los grupos y nacionalidades que conforman el país."}]},{id:"GT-RA.2",texto:"RA2: Clasificar los pueblos y nacionalidades del Ecuador, identificando su espacio territorial, las manifestaciones y el patrimonio culturales material de cada uno, destacando su relevancia dentro del contexto ecuatoriano. CE 2.1: Selecciona características principales de los pueblos y nacionalidades del Ecuador",criteriosEvaluacion:[{id:"GT-CE2.2",texto:"CE2.2: Diagrama las manifestaciones culturales de cada pueblo y nacionalidad, detallando sus tradiciones, festividades, costumbres y expresiones artísticas."},{id:"GT-CE2.3",texto:"CE2.3: Clasifica el patrimonio cultural material de los pueblos y nacionalidades, identificando elementos clave como la arquitectura, vestimenta, artesanías y otros bienes tangibles que representan su identidad."},{id:"GT-CE2.4",texto:"CE2.4: Ejemplifica el espacio territorial de cada pueblo o nacionalidad con sus manifestaciones culturales, demostrando la influencia del entorno geográfico en su cultura, estilo de vida y prácticas tradicionales."}]},{id:"GT-RA.3",texto:"RA3: Aplicar los principios y conceptos interculturales en situaciones prácticas dentro del ámbito del turismo y la gastronomía. CE 3.1: Identifica los impactos positivos del turismo en las culturas del Ecuador, resaltando la preservación y difusión de las tradiciones, el patrimonio cultural y el desarrollo económico local CE 3.2: Distingue posibles riesgos como la pérdida de identidad cultural, la alteración de costumbres y la explotación excesiva de los recursos culturales y naturales, así como el impacto negativo del turismo en Ecuador. CE 3.3: Plantea el rol de las comunidades locales en la gestión del turismo, destacando su participación en la protección de su patrimonio cultural. CE 3.4: Propone estrategias que promuevan un turismo sostenible y respetuoso con las culturas del Ecuador",criteriosEvaluacion:[]}]},
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
      { codigo: "HC.1.1", nombre: "Cocina Básica y Manipulación de Alimentos", descripcion: "Aplicar técnicas culinarias básicas y normas de manipulación e higiene de alimentos.", anio: 1 , categoria: "generico", estadoCatalogo: "completo", nivel: "1ro", objetivoModulo: "Integrar los principios fundamentales, los conceptos clave y las prácticas relevantes sobre la cultura y la interculturalidad, para aplicarlos al ámbito del turismo y la gastronomía.", resultadosAprendizaje:[{id:"HAC-RA.1",texto:"RA1: Reconocer los principios fundamentales y conceptos clave relacionados con la cultura y la interculturalidad a nivel mundial y nacional.",criteriosEvaluacion:[{id:"HAC-CE1.1",texto:"CE1.1: Describe sobre la diversidad cultural del país, y su influencia en los productos turísticos y gastronómicos."},{id:"HAC-CE1.2",texto:"CE1.2: Cataloga al turismo como una relación intercultural, destacando el intercambio de conocimientos, culturas y su contribución a la promoción de la paz entre los visitantes y las comunidades locales."},{id:"HAC-CE1.3",texto:"CE1.3: Analiza el valor de la diversidad cultural del Ecuador, subrayando la importancia de las costumbres y tradiciones de los grupos y nacionalidades que conforman el país."}]},{id:"HAC-RA.2",texto:"RA2: Clasificar los pueblos y nacionalidades del Ecuador, identificando su espacio territorial, las manifestaciones y el patrimonio culturales material de cada uno, destacando su relevancia dentro del contexto ecuatoriano. CE 2.1: Selecciona características principales de los pueblos y nacionalidades del Ecuador",criteriosEvaluacion:[{id:"HAC-CE2.2",texto:"CE2.2: Diagrama las manifestaciones culturales de cada pueblo y nacionalidad, detallando sus tradiciones, festividades, costumbres y expresiones artísticas."},{id:"HAC-CE2.3",texto:"CE2.3: Clasifica el patrimonio cultural material de los pueblos y nacionalidades, identificando elementos clave como la arquitectura, vestimenta, artesanías y otros bienes tangibles que representan su identidad."},{id:"HAC-CE2.4",texto:"CE2.4: Ejemplifica el espacio territorial de cada pueblo o nacionalidad con sus manifestaciones culturales, demostrando la influencia del entorno geográfico en su cultura, estilo de vida y prácticas tradicionales."}]},{id:"HAC-RA.3",texto:"RA3: Aplicar los principios y conceptos interculturales en situaciones prácticas dentro del ámbito del turismo y la gastronomía. CE 3.1: Identifica los impactos positivos del turismo en las culturas del Ecuador, resaltando la preservación y difusión de las tradiciones, el patrimonio cultural y el desarrollo económico local CE 3.2: Distingue posibles riesgos como la pérdida de identidad cultural, la alteración de costumbres y la explotación excesiva de los recursos culturales y naturales, así como el impacto negativo del turismo en Ecuador. CE 3.3: Plantea el rol de las comunidades locales en la gestión del turismo, destacando su participación en la protección de su patrimonio cultural. CE 3.4: Propone estrategias que promuevan un turismo sostenible y respetuoso con las culturas del Ecuador",criteriosEvaluacion:[]}]},
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
    objetivoGeneral:
      "Planificar, ejecutar y evaluar actividades relacionadas con la actividad física, el deporte y la recreación, aplicando principios técnicos, deportivos y de seguridad, con un enfoque inclusivo, sostenible y de participación comunitaria.",
    // Catálogo real transcrito de curriculo-fip-afdr.pdf, perfil-profesional-afdr.pdf y
    // D-P-E Sesiones Deportivas y Recreativas.docx. Los módulos sin resultadosAprendizaje/UC
    // vinculada quedan con estadoCatalogo "pendiente": no se fabrica contenido curricular oficial.
    modulos: [
      {
        codigo: "AF.1.1",
        nombre: "Salud, hábitos y práctica recreativa",
        descripcion: "Comprender los fundamentos de la actividad física y su relación con la salud integral y el desarrollo humano.",
        anio: 1,
        categoria: "generico",
        estadoCatalogo: "completo",
        duracionPeriodos: { 1: 3, 2: 2, 3: null },
        objetivoModulo:
          "Comprender los fundamentos de la actividad física y su relación con la salud integral y el desarrollo humano, mediante el análisis de sus principios, la reflexión sobre la práctica regular de ejercicio físico y la aplicación de normas de seguridad, higiene y cuidado corporal, para promover estilos de vida activos, seguros y saludables.",
        resultadosAprendizaje: [
          {
            id: "AFDR-RA.1",
            texto: "RA.1. Analizar los principios de la actividad física y su relación con la salud y el bienestar incluyendo sus efectos en el cuerpo humano y la vida cotidiana.",
            criteriosEvaluacion: [
              { id: "AFDR-CE1.1", texto: "CE1.1: Relaciona los componentes de la condición física con su importancia en el mantenimiento de la salud integral." },
              { id: "AFDR-CE1.2", texto: "CE1.2: Compara las diferencias entre actividad física, recreación, ejercicio y deporte según su aporte al bienestar físico y social." },
              { id: "AFDR-CE1.3", texto: "CE1.3: Explica los beneficios del ejercicio sobre los sistemas corporales, argumentando su influencia en el rendimiento y la salud personal." },
            ],
          },
          {
            id: "AFDR-RA.2",
            texto: "RA.2 Establecer la importancia de la práctica frecuente de actividades físicas, deportivas y recreativas con propuestas que promuevan la salud integral y la prevención de enfermedades.",
            criteriosEvaluacion: [
              { id: "AFDR-CE2.1", texto: "CE2.1: Analiza hábitos de vida saludable valorando su incidencia en la práctica de actividades físicas, deportivas y recreativas." },
              { id: "AFDR-CE2.2", texto: "CE2.2: Relaciona la práctica de actividades físicas y recreativas con la prevención de enfermedades y el desarrollo humano." },
              { id: "AFDR-CE2.3", texto: "CE2.3: Diseña campañas de concienciación sobre los beneficios de los hábitos saludables y la actividad física." },
              { id: "AFDR-CE2.4", texto: "CE2.4: Formula un plan de actividades físicas, deportivas y recreativas que fomenta la salud y la prevención de enfermedades considerando recursos, contexto y necesidades del grupo." },
            ],
          },
          {
            id: "AFDR-RA.3",
            texto: "RA.3 Aplicar normas de seguridad, higiene y cuidado corporal en la participación de actividades físicas, deportivas y recreativas garantizando la prevención de riesgos y el bienestar integral.",
            criteriosEvaluacion: [
              { id: "AFDR-CE3.1", texto: "CE3.1: Clasifica las normas de seguridad, higiene y cuidado corporal según el tipo de actividad física, deportiva o recreativa." },
              { id: "AFDR-CE3.3", texto: "CE3.3: Ejecuta actividades físicas, deportivas y recreativas aplicando correctamente normas de seguridad, higiene y cuidado personal." },
              { id: "AFDR-CE3.4", texto: "CE3.4: Promueve actividades físicas, deportivas y recreativas orientadas al fortalecimiento del desarrollo físico, mental y social en su comunidad." },
            ],
          },
        ],
      },
      {
        codigo: "AF.1.2",
        nombre: "Desarrollo deportivo y cultural",
        descripcion: "Gestionar y promover proyectos que fomenten la identidad y participación social a través del deporte y la cultura.",
        anio: 1,
        categoria: "generico",
        estadoCatalogo: "pendiente",
        duracionPeriodos: { 1: 2, 2: 2, 3: null },
      },
      {
        codigo: "AF.1.3",
        nombre: "Administración deportiva y cultural",
        descripcion: "Gestionar recursos humanos, materiales y financieros en entidades deportivas y culturales de forma eficiente.",
        anio: 1,
        categoria: "generico",
        estadoCatalogo: "pendiente",
        duracionPeriodos: { 1: 2, 2: 2, 3: null },
      },
      {
        codigo: "AF.2.1",
        nombre: "Planificación de actividades deportivas y recreativas",
        descripcion: "Planificar programas y sesiones de actividades físicas, deportivas y recreativas considerando las características de los participantes, los recursos disponibles y los objetivos propuestos.",
        anio: 1,
        categoria: "especializacion",
        estadoCatalogo: "pendiente",
        duracionPeriodos: { 1: 4, 2: 3, 3: 3 },
      },
      {
        codigo: "AF.2.2",
        nombre: "Sesiones deportivas y recreativas",
        descripcion: "Ejecutar sesiones de actividad física, deporte y recreación aplicando técnicas adecuadas, criterios de seguridad y estrategias de inclusión.",
        anio: 1,
        categoria: "especializacion",
        estadoCatalogo: "completo",
        duracionPeriodos: { 1: 6, 2: 6, 3: 8 },
        objetivoModulo:
          "Ejecutar sesiones de actividad física, deporte y recreación aplicando técnicas adecuadas, criterios de seguridad y estrategias de inclusión, favoreciendo la participación activa, el aprendizaje motriz y la cohesión social.",
      },
      {
        codigo: "AF.2.3",
        nombre: "Promoción de la salud y valores en la práctica deportiva",
        descripcion: "Fomentar hábitos de vida saludable, responsable y valores sociales a través de la práctica de la actividad física, el deporte y la recreación.",
        anio: 1,
        categoria: "especializacion",
        estadoCatalogo: "pendiente",
        duracionPeriodos: { 1: 2, 2: 2, 3: 3 },
      },
      {
        codigo: "AF.2.4",
        nombre: "Seguridad, higiene y primeros auxilios deportivos",
        descripcion: "Aplicar medidas preventivas, de seguridad, higiene y primeros auxilios en actividades físicas, deportivas y recreativas.",
        anio: 2,
        categoria: "especializacion",
        estadoCatalogo: "completo",
        duracionPeriodos: { 1: null, 2: 2, 3: 4 },
      },
      {
        codigo: "AF.3.1",
        nombre: "Módulo Práctico Experimental",
        descripcion: "Aplicación práctica integradora de las competencias desarrolladas en los módulos de especialización.",
        anio: 1,
        categoria: "practico",
        estadoCatalogo: "pendiente",
        duracionPeriodos: { 1: 2, 2: 2, 3: 3 },
      },
    ],
  },
  {
    id: "gestion-deportiva",
    nombre: "Gestión Deportiva y Cultural",
    familia: "deportes",
    area: "deportes_salud",
    objetivoGeneral: "Gestionar organizaciones deportivas y culturales aplicando principios de administración, planificación de eventos y promoción deportiva.",
    modulos: [
      { codigo: "GD.1.1", nombre: "Administración Deportiva", descripcion: "Aplicar principios de administración en organizaciones deportivas y culturales.", anio: 1 , categoria: "generico", estadoCatalogo: "completo", nivel: "1ro, 2do", objetivoModulo: "Comprender los fundamentos de la actividad física y su relación con la salud integral y el desarrollo humano, mediante el análisis de sus principios, la reflexión sobre la práctica regular de ejercicio físico y la aplicación de normas de seguridad, higiene y cuidado corporal, para promover estilos de vida activos, seguros y saludables.", resultadosAprendizaje:[{id:"GDC-RA.1",texto:"RA1: Analizar los principios de la actividad física y su relación con la salud y el bienestar incluyendo sus efectos en el cuerpo humano y la vida cotidiana.",criteriosEvaluacion:[{id:"GDC-CE1.1",texto:"CE1.1: Relaciona los componentes de la condición física con su importancia en el mantenimiento de la salud integral."},{id:"GDC-CE1.2",texto:"CE1.2: Compara las diferencias entre actividad física, recreación, ejercicio y deporte según su aporte al bienestar físico y social."},{id:"GDC-CE1.3",texto:"CE1.3: Explica los beneficios del ejercicio sobre los sistemas corporales, argumentando su influencia en el rendimiento y la salud personal."}]},{id:"GDC-RA.2",texto:"RA2: Establecer la importancia de la práctica frecuente de actividades físicas, deportivas y recreativas con propuestas que promuevan la salud integral y la prevención de enfermedades.",criteriosEvaluacion:[{id:"GDC-CE2.1",texto:"CE2.1: Analiza hábitos de vida saludable valorando su incidencia en la práctica de actividades físicas, deportivas y recreativas."},{id:"GDC-CE2.2",texto:"CE2.2: Relaciona la práctica de actividades físicas y recreativas con la prevención de enfermedades y el desarrollo humano."},{id:"GDC-CE2.3",texto:"CE2.3: Diseña campañas de concienciación sobre los beneficios de los hábitos saludables y la actividad física."},{id:"GDC-CE2.4",texto:"CE2.4: Formula un plan de actividades físicas, deportivas y recreativas que fomenta la salud y la prevención de enfermedades considerando recursos, contexto y necesidades del grupo."}]},{id:"GDC-RA.3",texto:"RA3: Aplicar normas de seguridad, higiene y cuidado corporal en la participación de actividades físicas, deportivas y recreativas garantizando la prevención de riesgos y el bienestar integral.",criteriosEvaluacion:[{id:"GDC-CE3.1",texto:"CE3.1: Clasifica las normas de seguridad, higiene y cuidado corporal según el tipo de actividad física, deportiva o recreativa."},{id:"GDC-CE3.2",texto:"CE3.2: Analiza los riesgos específicos en diferentes prácticas físicas, deportivas y recreativas, determinando medidas de prevención."},{id:"GDC-CE3.3",texto:"CE3.3: Ejecuta actividades físicas, deportivas y recreativas aplicando correctamente normas de seguridad, higiene y cuidado personal."},{id:"GDC-CE3.4",texto:"CE3.4: Promueve actividades físicas, deportivas y recreativas orientadas al fortalecimiento del desarrollo físico, mental y social en su comunidad."}]}]},
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
      { codigo: "PI.1.1", nombre: "Desarrollo Infantil", descripcion: "Comprender las etapas del desarrollo infantil y sus necesidades en la primera infancia.", anio: 1 , categoria: "generico", estadoCatalogo: "completo", nivel: "1ro y 2do", objetivoModulo: "Desarrollar habilidades de atención integral comunitaria, a través del análisis de necesidades, el uso de normas de salud y seguridad, trato digno y la prevención de riesgos en entornos, con el propósito de apoyar de manera responsable a personas, familias y comunidades en contextos de atención.", resultadosAprendizaje:[{id:"API-RA.1",texto:"RA1: Analizar necesidades de atención integral de personas, familias y comunidades, a través de la recepción del requerimiento, el registro de datos relevantes y la priorización del cuidado, orientación y apoyo en distintos contextos de atención.",criteriosEvaluacion:[{id:"API-CE1.1",texto:"CE1.1: Examina el requerimiento de atención integral mediante escucha activa, trato respetuoso y registro inicial de datos relevantes."},{id:"API-CE1.2",texto:"CE1.2: Categoriza las necesidades de personas, familias y comunidades con base en criterios de salud, seguridad, protección, accesibilidad y nivel de prioridad."},{id:"API-CE1.3",texto:"CE1.3: Aplica principios de dignidad humana, inclusión, confidencialidad y prevención de riesgos durante la atención integral en distintos entornos."}]},{id:"API-RA.2",texto:"RA2: Aplicar rutas de atención integral y orientación ciudadana, a través del análisis de protocolos institucionales y comunitarios, la derivación pertinente y el seguimiento básico de casos en contextos de atención y prevención.",criteriosEvaluacion:[{id:"API-CE2.1",texto:"CE2.1: Fundamenta la importancia de las rutas y protocolos institucionales, a partir de criterios de atención integral, cultura de paz, sana convivencia y corresponsabilidad social."},{id:"API-CE2.2",texto:"CE2.2: Establece rutas de atención, prevención, detección, derivación y seguimiento, a través del análisis de casos vinculados con personas, familias y comunidades."},{id:"API-CE2.3",texto:"CE2.3: Elabora una bitácora de seguimiento sobre rutas y protocolos institucionales y comunitarios, considerando registros de atención, acciones realizadas y novedades del proceso."}]},{id:"API-RA.3",texto:"RA3: Ejecutar acciones de cuidado y apoyo comunitario, a partir de la adecuación del entorno, aplicación de normas de bioseguridad, autocuidado, seguridad personal y atención oportuna de incidentes en distintos espacios de atención.",criteriosEvaluacion:[{id:"API-CE3.1",texto:"CE3.1: Acondiciona el espacio de atención, mediante control de riesgos en entornos, orden, higiene, accesibilidad y condiciones seguras."},{id:"API-CE3.2",texto:"CE3.2: Aplica acciones de cuidado y apoyo comunitario considerando necesidades de acompañamiento, comunicación, descanso, protección y bienestar."},{id:"API-CE3.3",texto:"CE3.3: Resuelve incidentes durante la atención, a través de actuación oportuna, comunicación responsable, uso adecuado de recursos y derivación pertinente."}]},{id:"API-RA.4",texto:"RA4: Evaluar la atención integral brindada a personas, familias y comunidades, a partir de la revisión de evidencias, la valoración de criterios de calidad, salud y seguridad y la formulación de mejoras en procesos de asistencia integral.",criteriosEvaluacion:[{id:"API-CE4.1",texto:"CE4.1: Optimiza el proceso de apoyo integral, mediante ajustes en comunicación, organización del servicio, uso de recursos y control de riesgos en entornos de atención."},{id:"API-CE4.2",texto:"CE4.2: Valora la calidad de la atención comunitaria con base en trato digno, oportunidad, seguridad, pertinencia y satisfacción de la persona atendida."},{id:"API-CE4.3",texto:"CE4.3: Sustenta los resultados de la atención integral, a través de evidencias, conclusiones técnicas y recomendaciones de mejora."}]}]},
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
      { codigo: "SC.1.1", nombre: "Fundamentos de Seguridad", descripcion: "Comprender marcos legales, derechos humanos y principios de seguridad ciudadana.", anio: 1 , categoria: "generico", estadoCatalogo: "completo", nivel: "1ro y 2do", objetivoModulo: "Desarrollar habilidades de atención integral comunitaria, a través del análisis de necesidades, el uso de normas de salud y seguridad, trato digno y la prevención de riesgos en entornos, con el propósito de apoyar de manera responsable a personas, familias y comunidades en contextos de atención.", resultadosAprendizaje:[{id:"SC-RA.1",texto:"RA1: Analizar necesidades de atención integral de personas, familias y comunidades, a través de la recepción del requerimiento, el registro de datos relevantes y la priorización del cuidado, orientación y apoyo en distintos contextos de atención.",criteriosEvaluacion:[{id:"SC-CE1.1",texto:"CE1.1: Examina el requerimiento de atención integral mediante escucha activa, trato respetuoso y registro inicial de datos relevantes."},{id:"SC-CE1.2",texto:"CE1.2: Categoriza las necesidades de personas, familias y comunidades con base en criterios de salud, seguridad, protección, accesibilidad y nivel de prioridad."},{id:"SC-CE1.3",texto:"CE1.3: Aplica principios de dignidad humana, inclusión, confidencialidad y prevención de riesgos durante la atención integral en distintos entornos."}]},{id:"SC-RA.2",texto:"RA2: Aplicar rutas de atención integral y orientación ciudadana, a través del análisis de protocolos institucionales y comunitarios, la derivación pertinente y el seguimiento básico de casos en contextos de atención y prevención.",criteriosEvaluacion:[{id:"SC-CE2.1",texto:"CE2.1: Fundamenta la importancia de las rutas y protocolos institucionales, a partir de criterios de atención integral, cultura de paz, sana convivencia y corresponsabilidad social."},{id:"SC-CE2.2",texto:"CE2.2: Establece rutas de atención, prevención, detección, derivación y seguimiento, a través del análisis de casos vinculados con personas, familias y comunidades."},{id:"SC-CE2.3",texto:"CE2.3: Elabora una bitácora de seguimiento sobre rutas y protocolos institucionales y comunitarios, considerando registros de atención, acciones realizadas y novedades del proceso."}]},{id:"SC-RA.3",texto:"RA3: Ejecutar acciones de cuidado y apoyo comunitario, a partir de la adecuación del entorno, aplicación de normas de bioseguridad, autocuidado, seguridad personal y atención oportuna de incidentes en distintos espacios de atención.",criteriosEvaluacion:[{id:"SC-CE3.1",texto:"CE3.1: Acondiciona el espacio de atención, mediante control de riesgos en entornos, orden, higiene, accesibilidad y condiciones seguras."},{id:"SC-CE3.2",texto:"CE3.2: Aplica acciones de cuidado y apoyo comunitario considerando necesidades de acompañamiento, comunicación, descanso, protección y bienestar."},{id:"SC-CE3.3",texto:"CE3.3: Resuelve incidentes durante la atención, a través de actuación oportuna, comunicación responsable, uso adecuado de recursos y derivación pertinente."}]},{id:"SC-RA.4",texto:"RA4: Evaluar la atención integral brindada a personas, familias y comunidades, a partir de la revisión de evidencias, la valoración de criterios de calidad, salud y seguridad y la formulación de mejoras en procesos de asistencia integral.",criteriosEvaluacion:[{id:"SC-CE4.1",texto:"CE4.1: Optimiza el proceso de apoyo integral, mediante ajustes en comunicación, organización del servicio, uso de recursos y control de riesgos en entornos de atención."},{id:"SC-CE4.2",texto:"CE4.2: Valora la calidad de la atención comunitaria con base en trato digno, oportunidad, seguridad, pertinencia y satisfacción de la persona atendida."},{id:"SC-CE4.3",texto:"CE4.3: Sustenta los resultados de la atención integral, a través de evidencias, conclusiones técnicas y recomendaciones de mejora."}]}]},
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
      { codigo: "GP.1.1", nombre: "Fundamentos de Atención Social", descripcion: "Comprender las necesidades de grupos prioritarios y el marco legal de protección.", anio: 1 , categoria: "generico", estadoCatalogo: "completo", nivel: "1ro y 2do", objetivoModulo: "Desarrollar habilidades de atención integral comunitaria, a través del análisis de necesidades el uso de normas de salud y seguridad, trato digno y la prevención de riesgos en entornos, con el propósito de apoyar de manera responsable a personas, familias y comunidades en contextos de atención.", resultadosAprendizaje:[{id:"GP-RA.1",texto:"RA1: Analizar necesidades de atención integral de personas, familias y comunidades, a través de la recepción del requerimiento, el registro de datos relevantes y la priorización del cuidado, orientación y apoyo en distintos contextos de atención.",criteriosEvaluacion:[{id:"GP-CE1.1",texto:"CE1.1: Examina el requerimiento de atención integral mediante escucha activa, trato respetuoso y registro inicial de datos relevantes."},{id:"GP-CE1.2",texto:"CE1.2: Categoriza las necesidades de personas, familias y comunidades con base en criterios de salud, seguridad, protección, accesibilidad y nivel de prioridad."},{id:"GP-CE1.3",texto:"CE1.3: Aplica principios de dignidad humana, inclusión, confidencialidad y prevención de riesgos durante la atención integral en distintos entornos."}]},{id:"GP-RA.2",texto:"RA2: Aplicar rutas de atención integral y orientación ciudadana, a través del análisis de protocolos institucionales y comunitarios, la derivación pertinente y el seguimiento básico de casos en contextos de atención y prevención.",criteriosEvaluacion:[{id:"GP-CE2.1",texto:"CE2.1: Fundamenta la importancia de las rutas y protocolos institucionales, a partir de criterios de atención integral, cultura de paz, sana convivencia y corresponsabilidad social."},{id:"GP-CE2.2",texto:"CE2.2: Establece rutas de atención, prevención, detección, derivación y seguimiento, a través del análisis de casos vinculados con personas, familias y comunidades."},{id:"GP-CE2.3",texto:"CE2.3: Elabora una bitácora de seguimiento sobre rutas y protocolos institucionales y comunitarios, considerando registros de atención, acciones realizadas y novedades del proceso."}]},{id:"GP-RA.3",texto:"RA3: Ejecutar acciones de cuidado y apoyo comunitario, a partir de la adecuación del entorno, aplicación de normas de bioseguridad, autocuidado, seguridad personal y atención oportuna de incidentes en distintos espacios de atención.",criteriosEvaluacion:[{id:"GP-CE3.1",texto:"CE3.1: Acondiciona el espacio de atención, mediante control de riesgos en entornos, orden, higiene, accesibilidad y condiciones seguras."},{id:"GP-CE3.2",texto:"CE3.2: Aplica acciones de cuidado y apoyo comunitario considerando necesidades de acompañamiento, comunicación, descanso, protección y bienestar."},{id:"GP-CE3.3",texto:"CE3.3: Resuelve incidentes durante la atención, a través de actuación oportuna, comunicación responsable, uso adecuado de recursos y derivación pertinente."}]},{id:"GP-RA.4",texto:"RA4: Evaluar la atención integral brindada a personas, familias y comunidades, a partir de la revisión de evidencias, la valoración de criterios de calidad, salud y seguridad y la formulación de mejoras en procesos de asistencia integral.",criteriosEvaluacion:[{id:"GP-CE4.1",texto:"CE4.1: Optimiza el proceso de apoyo integral, mediante ajustes en comunicación, organización del servicio, uso de recursos y control de riesgos en entornos de atención."},{id:"GP-CE4.2",texto:"CE4.2: Valora la calidad de la atención comunitaria con base en trato digno, oportunidad, seguridad, pertinencia y satisfacción de la persona atendida."},{id:"GP-CE4.3",texto:"CE4.3: Sustenta los resultados de la atención integral, a través de evidencias, conclusiones técnicas y recomendaciones de mejora."}]}]},
      { codigo: "GP.2.1", nombre: "Cuidado y Asistencia", descripcion: "Aplicar técnicas de cuidado personal, movilización y acompañamiento a grupos prioritarios.", anio: 2 },
      { codigo: "GP.3.1", nombre: "Inclusión y Desarrollo Comunitario", descripcion: "Ejecutar programas de inclusión social y desarrollo comunitario.", anio: 3 },
    ],
  },
  // === ARTES ===
  {
    id: "artes-plasticas",
    nombre: "Artes plásticas y gestión cultural",
    familia: "artes",
    area: "artistica",
    codigo: "AR-01-01",
    normativaVigente: "MINEDEC-MINEDEC-2025-00051-A",
    objetivoGeneral: "Crear obras de artes plásticas y gestionar proyectos culturales aplicando técnicas artísticas y principios de gestión cultural.",
    modulos: [
      { codigo: "APL.1.1", nombre: "Fundamentos de Artes Plásticas", descripcion: "Aplicar técnicas de dibujo, pintura y escultura como medios de expresión artística.", anio: 1 , categoria: "generico", estadoCatalogo: "completo", nivel: "1ro y 2do", objetivoModulo: "Desarrollar capacidades para diseñar, organizar y ejecutar proyectos culturales que fortalezcan la diversidad, inclusión y sostenibilidad desde lo local.", resultadosAprendizaje:[{id:"APL-RA.1",texto:"RA1: Aplicar los principios clave de gestión cultural comunitaria",criteriosEvaluacion:[{id:"APL-CE1.1",texto:"CE1.1: Define participación, inclusión y sostenibilidad en proyectos culturales."},{id:"APL-CE1.2",texto:"CE1.2: Reconoce actores y espacios culturales locales."},{id:"APL-CE1.3",texto:"CE1.3: Describe experiencias exitosas en gestión cultural en contexto local."}]},{id:"APL-RA.2",texto:"RA2: Planificar un proyecto cultural básico con enfoque inclusivo",criteriosEvaluacion:[{id:"APL-CE2.1",texto:"CE2.1: Elabora objetivos, cronograma e insumos para una iniciativa cultural local."},{id:"APL-CE2.2",texto:"CE2.2: Incorpora la diversidad y participación comunitaria en la planificación."},{id:"APL-CE2.3",texto:"CE2.3: Presenta esquemáticamente la estructura del proyecto."}]},{id:"APL-RA.3",texto:"RA3: Colaborar en la ejecución de una actividad cultural inclusiva",criteriosEvaluacion:[{id:"APL-CE3.1",texto:"CE3.1: Ejerce un rol colaborativo dentro del equipo."},{id:"APL-CE3.2",texto:"CE3.2: Aplica comunicación efectiva y respetuosa."},{id:"APL-CE3.3",texto:"CE3.3: Evalúa en grupo el impacto de la actividad realizada."}]}]},
      { codigo: "APL.2.1", nombre: "Técnicas Artísticas Avanzadas", descripcion: "Desarrollar proyectos artísticos con técnicas mixtas y materiales diversos.", anio: 2 },
      { codigo: "APL.3.1", nombre: "Gestión Cultural y Curaduría", descripcion: "Gestionar proyectos culturales, exposiciones y espacios artísticos.", anio: 3 },
    ],
  },
  {
    id: "artes-escenicas",
    nombre: "Artes escénicas y gestión cultural",
    familia: "artes",
    area: "artistica",
    codigo: "AR-01-02",
    normativaVigente: "MINEDEC-MINEDEC-2025-00051-A",
    objetivoGeneral: "Crear y producir obras de artes escénicas (teatro, danza) y gestionar proyectos culturales aplicando técnicas de interpretación y producción.",
    modulos: [
      { codigo: "AE.1.1", nombre: "Expresión Corporal y Teatral", descripcion: "Desarrollar habilidades de expresión corporal, vocal y teatral.", anio: 1 , categoria: "generico", estadoCatalogo: "completo", nivel: "1ro y 2do", objetivoModulo: "Desarrollar capacidades para diseñar, organizar y ejecutar proyectos culturales que fortalezcan la diversidad, inclusión y sostenibilidad desde lo local.", resultadosAprendizaje:[{id:"AESC-RA.1",texto:"RA1: Aplicar los principios clave de gestión cultural comunitaria",criteriosEvaluacion:[{id:"AESC-CE1.1",texto:"CE1.1: Define participación, inclusión y sostenibilidad en proyectos culturales."},{id:"AESC-CE1.2",texto:"CE1.2: Reconoce actores y espacios culturales locales."},{id:"AESC-CE1.3",texto:"CE1.3: Describe experiencias exitosas en gestión cultural en contexto local."}]},{id:"AESC-RA.2",texto:"RA2: Planificar un proyecto cultural básico con enfoque inclusivo",criteriosEvaluacion:[{id:"AESC-CE2.1",texto:"CE2.1: Elabora objetivos, cronograma e insumos para una iniciativa cultural local."},{id:"AESC-CE2.2",texto:"CE2.2: Incorpora la diversidad y participación comunitaria en la planificación."},{id:"AESC-CE2.3",texto:"CE2.3: Presenta esquemáticamente la estructura del proyecto."}]},{id:"AESC-RA.3",texto:"RA3: Colaborar en la ejecución de una actividad cultural inclusiva",criteriosEvaluacion:[{id:"AESC-CE3.1",texto:"CE3.1: Ejerce un rol colaborativo dentro del equipo."},{id:"AESC-CE3.2",texto:"CE3.2: Aplica comunicación efectiva y respetuosa."},{id:"AESC-CE3.3",texto:"CE3.3: Evalúa en grupo el impacto de la actividad realizada."}]}]},
      { codigo: "AE.2.1", nombre: "Producción Escénica", descripcion: "Producir montajes escénicos integrando actuación, dirección y diseño.", anio: 2 },
      { codigo: "AE.3.1", nombre: "Gestión de Proyectos Escénicos", descripcion: "Gestionar proyectos de artes escénicas y festivales culturales.", anio: 3 },
    ],
  },
  {
    id: "musica",
    nombre: "Música y gestión cultural",
    familia: "artes",
    area: "artistica",
    codigo: "AR-01-03",
    normativaVigente: "MINEDEC-MINEDEC-2025-00051-A",
    objetivoGeneral: "Interpretar y producir música aplicando técnicas instrumentales, vocales y de producción musical, y gestionar proyectos culturales musicales.",
    modulos: [
      { codigo: "MU.1.1", nombre: "Lenguaje Musical y Práctica Instrumental", descripcion: "Desarrollar habilidades de lectura musical e interpretación instrumental.", anio: 1 , categoria: "generico", estadoCatalogo: "completo", nivel: "1ro y 2do", objetivoModulo: "Desarrollar capacidades para diseñar, organizar y ejecutar proyectos culturales que fortalezcan la diversidad, inclusión y sostenibilidad desde lo local.", resultadosAprendizaje:[{id:"MUS-RA.1",texto:"RA1: Aplicar los principios clave de gestión cultural comunitaria",criteriosEvaluacion:[{id:"MUS-CE1.1",texto:"CE1.1: Define participación, inclusión y sostenibilidad en proyectos culturales."},{id:"MUS-CE1.2",texto:"CE1.2: Reconoce actores y espacios culturales locales."},{id:"MUS-CE1.3",texto:"CE1.3: Describe experiencias exitosas en gestión cultural en contexto local."}]},{id:"MUS-RA.2",texto:"RA2: Planificar un proyecto cultural básico con enfoque inclusivo",criteriosEvaluacion:[{id:"MUS-CE2.1",texto:"CE2.1: Elabora objetivos, cronograma e insumos para una iniciativa cultural local."},{id:"MUS-CE2.2",texto:"CE2.2: Incorpora la diversidad y participación comunitaria en la planificación."},{id:"MUS-CE2.3",texto:"CE2.3: Presenta esquemáticamente la estructura del proyecto."}]},{id:"MUS-RA.3",texto:"RA3: Colaborar en la ejecución de una actividad cultural inclusiva",criteriosEvaluacion:[{id:"MUS-CE3.1",texto:"CE3.1: Ejerce un rol colaborativo dentro del equipo."},{id:"MUS-CE3.2",texto:"CE3.2: Aplica comunicación efectiva y respetuosa."},{id:"MUS-CE3.3",texto:"CE3.3: Evalúa en grupo el impacto de la actividad realizada."}]}]},
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
      { codigo: "DM.1.1", nombre: "Diseño y Patronaje", descripcion: "Diseñar prendas de vestir y elaborar patrones según tendencias y especificaciones.", anio: 1 , categoria: "generico", estadoCatalogo: "completo", nivel: "1ro", objetivoModulo: "Comprender contextos, necesidades de usuarios y tendencias culturales para generar conceptos de diseño creativos e innovadores, considerando funcionalidad, sostenibilidad y pertinencia cultural.", resultadosAprendizaje:[{id:"DM-RA.1",texto:"RA1: Investigar tendencias, necesidades del usuario y referentes culturales.",criteriosEvaluacion:[{id:"DM-CE1.1",texto:"CE1.1: Clasifica información relevante sobre tendencias y referentes culturales."},{id:"DM-CE1.2",texto:"CE1.2: Analiza las necesidades del usuario y su contexto para fundamentar conceptos de diseño."},{id:"DM-CE1.3",texto:"CE1.3: Relaciona la información recopilada con criterios de funcionalidad, sostenibilidad y pertinencia cultural."}]},{id:"DM-RA.2",texto:"RA2: Destacar oportunidades de innovación en productos o servicios visuales, textiles o multimedia.",criteriosEvaluacion:[{id:"DM-CE2.1",texto:"CE2.1: Distingue aspectos de los productos o servicios existentes que pueden mejorarse o reinterpretarse de manera creativa."},{id:"DM-CE2.2",texto:"CE2.2: Relaciona las oportunidades de innovación con tendencias actuales, necesidades del usuario y contexto sociocultural."},{id:"DM-CE2.3",texto:"CE2.3: Comunica claramente las oportunidades detectadas, justificando las propuestas con argumentos sencillos y coherentes."},{id:"DM-CE2.4",texto:"CE2.4: Evalúa la factibilidad básica de implementar las ideas innovadoras en proyectos reales"}]},{id:"DM-RA.3",texto:"RA3: Generar conceptos de diseño (función, estética, creatividad, contexto y técnica), en productos y/o servicios atractivos, creativos e innovadores.",criteriosEvaluacion:[{id:"DM-CE3.1",texto:"CE3.1: Propone múltiples alternativas de concepto de diseño, demostrando creatividad e innovación."},{id:"DM-CE3.2",texto:"CE3.2: Selecciona la alternativa más adecuada según criterios estéticos y contextuales."},{id:"DM-CE3.3",texto:"CE3.3: Justifica cada concepto considerando la pertinencia cultural, la funcionalidad y la sostenibilidad."},{id:"DM-CE3.4",texto:"CE3.4: Representa los conceptos mediante bocetos, esquemas o mapas visuales comprensibles."}]}]},
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
      { codigo: "DG.1.1", nombre: "Fundamentos de Diseño Gráfico", descripcion: "Aplicar principios de composición, color y tipografía en productos de comunicación visual.", anio: 1 , categoria: "generico", estadoCatalogo: "completo", nivel: "1ro", objetivoModulo: "Comprender contextos, necesidades de usuarios y tendencias culturales para generar conceptos de diseño creativos e innovadores, considerando funcionalidad, sostenibilidad y pertinencia cultural.", resultadosAprendizaje:[{id:"DG-RA.1",texto:"RA1: Investigar tendencias, necesidades del usuario y referentes culturales.",criteriosEvaluacion:[{id:"DG-CE1.1",texto:"CE1.1: Clasifica información relevante sobre tendencias y referentes culturales."},{id:"DG-CE1.2",texto:"CE1.2: Analiza las necesidades del usuario y su contexto para fundamentar conceptos de diseño."},{id:"DG-CE1.3",texto:"CE1.3: Relaciona la información recopilada con criterios de funcionalidad, sostenibilidad y pertinencia cultural."}]},{id:"DG-RA.2",texto:"RA2: Destacar oportunidades de innovación en productos o servicios visuales, textiles o multimedia.",criteriosEvaluacion:[{id:"DG-CE2.1",texto:"CE2.1: Distingue aspectos de los productos o servicios existentes que pueden mejorarse o reinterpretarse de manera creativa."},{id:"DG-CE2.2",texto:"CE2.2: Relaciona las oportunidades de innovación con tendencias actuales, necesidades del usuario y contexto sociocultural."},{id:"DG-CE2.3",texto:"CE2.3: Comunica claramente las oportunidades detectadas, justificando las propuestas con argumentos sencillos y coherentes."},{id:"DG-CE2.4",texto:"CE2.4: Evalúa la factibilidad básica de implementar las ideas innovadoras en proyectos reales"}]},{id:"DG-RA.3",texto:"RA3: Generar conceptos de diseño (función, estética, creatividad, contexto y técnica), en productos y/o servicios atractivos, creativos e innovadores.",criteriosEvaluacion:[{id:"DG-CE3.1",texto:"CE3.1: Propone múltiples alternativas de concepto de diseño, demostrando creatividad e innovación."},{id:"DG-CE3.2",texto:"CE3.2: Selecciona la alternativa más adecuada según criterios estéticos y contextuales."},{id:"DG-CE3.3",texto:"CE3.3: Justifica cada concepto considerando la pertinencia cultural, la funcionalidad y la sostenibilidad."},{id:"DG-CE3.4",texto:"CE3.4: Representa los conceptos mediante bocetos, esquemas o mapas visuales comprensibles."}]}]},
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
 * Figuras profesionales vigentes (excluye las deprecadas). Se usan para los
 * selectores de planes nuevos. La resolución por ID (obtenerFiguraPorId)
 * sigue devolviendo deprecadas para reproducir planes históricos.
 */
export function obtenerFigurasActivas(): FiguraProfesional[] {
  return FIGURAS_PROFESIONALES.filter((f) => f.estado !== "deprecada");
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

/**
 * Un módulo tiene catálogo completo si tiene Resultados de Aprendizaje propios
 * (catálogo genérico) y/o al menos una Unidad de Competencia vinculada
 * (catálogo de especialización, ver data/bachillerato-tecnico-uc.ts).
 * No considera el catálogo ingresado por el usuario — para eso usar
 * obtenerCatalogoModulo() de lib/planificaciones-bt-context.tsx, que combina
 * este catálogo estático con lo que el docente haya guardado.
 */
export function tieneCatalogoCompleto(modulo: ModuloFormativo): boolean {
  const tieneRA = !!modulo.resultadosAprendizaje?.length;
  const tieneUC = obtenerUnidadesCompetenciaDeModulo(modulo.codigo).length > 0;
  return modulo.estadoCatalogo === "completo" && (tieneRA || tieneUC);
}
