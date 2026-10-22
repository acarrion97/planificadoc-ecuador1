/**
 * Competencias de Educacion Fisica extraidas de los PDF curriculares
 * suministrados para Preparatoria, EGB Media, EGB Superior y Bachillerato.
 * Los documentos presentan los indicadores por subnivel; se exponen para
 * cada grado correspondiente. Codigos discordantes se normalizan segun el
 * subnivel del archivo y la secuencia indicada por sus indicadores.
 */
import type { CompetenciaEspecificaCompleta, IndicadorCompetenciaEspecifica } from "./types-competencias-especificas";

interface CompetenciaEFPorSubnivel {
  codigo: string;
  descripcion: string;
  nivel: string;
  grados: string[];
  indicadores: IndicadorCompetenciaEspecifica[];
}

const COMPETENCIAS_EF_POR_SUBNIVEL: CompetenciaEFPorSubnivel[] = [
  {
    codigo: "CE.EF.1.1",
    descripcion: "Participar en diferentes tipos de juegos ajustando sus acciones motrices en función de sus estados corporales, ritmos internos y objetivo de los juegos, comprendiendo la necesidad de respetar reglas, roles y acuerdos simples para el cuidado de sí mismo, sus pares y el ambiente de aprendizaje e identificando las características básicas y los materiales necesarios para la construcción de implementos",
    nivel: "PREPARATORIA",
    grados: ["PRIMER GRADO"],
    indicadores: [
      { codigo: "I.EF.1.1.1", texto: "Adapta sus acciones motrices básicas durante las actividades lúdicas, regulando el movimiento corporal en concordancia con sus ritmos internos, fatiga y el propósito específico de cada juego" },
      { codigo: "I.EF.1.1.2", texto: "Cumple las reglas, roles asignados y acuerdos básicos de convivencia establecidos para el juego, demostrando una actitud de respeto mutuo y juego limpio con sus compañeros" },
      { codigo: "I.EF.1.1.3", texto: "Aplica normas colectivas de seguridad e higiene durante las prácticas expresivo-comunicativas, protegiendo su integridad física, la de sus pares y el estado del entorno de aprendizaje" },
    ],
  },
  {
    codigo: "CE.EF.1.3",
    descripcion: "Ejecutar prácticas gimnásticas individuales y colectivas mediante el reconocimiento de las posiciones, movimientos y capacidades del propio cuerpo, valorando la diversidad y las posibilidades motrices individuales",
    nivel: "PREPARATORIA",
    grados: ["PRIMER GRADO"],
    indicadores: [
      { codigo: "I.EF.1.3.1", texto: "Expresa posiciones y movimientos corporales durante las prácticas gimnásticas, manifestando coherencia entre la acción motriz, sus propias emociones y las sensaciones percibidas en sus compañeros" },
      { codigo: "I.EF.1.3.2", texto: "Corrige la ejecución de habilidades motrices básicas, destrezas y acrobacias sencillas, identificando de manera autónoma sus dificultades y aciertos para resolver de forma pertinente cada desafío gimnástico" },
    ],
  },
  {
    codigo: "CE.EF.1.4",
    descripcion: "Realizar destrezas gimnásticas y acrobacias individuales o colectivas mediante el cumplimiento de acuerdos de seguridad y el cuidado corporal, demostrando una actitud de autosuperación y respeto por el entorno de trabajo",
    nivel: "PREPARATORIA",
    grados: ["PRIMER GRADO"],
    indicadores: [
      { codigo: "I.EF.1.4.1", texto: "Cumple los acuerdos de seguridad e higiene establecidos para la ejecución de acrobacias sencillas, manifestando acciones concretas de autocuidado, protección hacia sus pares y preservación del ambiente de aprendizaje" },
    ],
  },
  {
    codigo: "CE.EF.1.5",
    descripcion: "Reconocer las prácticas corporales expresivo- comunicativas del contexto local y nacional como saberes culturales fundamentales, ejerciendo el derecho a participar y aprender de ellas en igualdad de condiciones",
    nivel: "PREPARATORIA",
    grados: ["PRIMER GRADO"],
    indicadores: [
      { codigo: "I.EF.1.5.1", texto: "Describe las características básicas y los elementos culturales de las prácticas expresivo-comunicativas de su entorno cercano, utilizándolos como referentes para la construcción de su propia identidad corporal" },
    ],
  },
  {
    codigo: "CE.EF.1.6",
    descripcion: "Interpretar mensajes y estados emocionales mediante la participación en diversas prácticas corporales expresivo- comunicativas, utilizando los propios recursos expresivos, estableciendo acuerdos simples y valorando la diversidad cultural y personal del grupo",
    nivel: "PREPARATORIA",
    grados: ["PRIMER GRADO"],
    indicadores: [
      { codigo: "I.EF.1.6.1", texto: "Comunica mensajes, estados de ánimo y emociones a través del uso creativo de recursos expresivos como gestos, posturas y variaciones de movimiento en relación con el tiempo y el espacio" },
      { codigo: "I.EF.1.6.2", texto: "Establece pautas sencillas de convivencia con sus pares que facilitan la organización y participación equitativa en las actividades expresivo-comunicativas" },
    ],
  },
  {
    codigo: "CE.EF.3.1",
    descripcion: "Participar en diversos juegos valorando sus posibilidades de creación y recreación, diferenciándolos en función de sus características, proveniencia y objetivos, sobre la base del reconocimiento de la importancia de jugar de manera segura para preservarlos como parte del patrimonio cultural intangible del país",
    nivel: "MEDIA",
    grados: ["QUINTO GRADO", "SEXTO GRADO", "SÉPTIMO GRADO"],
    indicadores: [
      { codigo: "I.EF.3.1.1", texto: "Clasifica diferentes tipos de juegos en función de sus características, objetivos y proveniencias regionales o ancestrales, reconociendo su valor histórico y sociocultural como parte del patrimonio cultural inmaterial de la humanidad" },
      { codigo: "I.EF.3.1.2", texto: "Adapta los sentidos, objetivos y reglas de juegos creados y colectivos de diversas regiones, participando de manera segura, inclusiva y democrática al reconocer el impacto de estas producciones culturales en la construcción de su identidad corporal" },
    ],
  },
  {
    codigo: "CE.EF.3.2",
    descripcion: "Participar en diversos tipos de juegos colaborando activamente con sus pares y desarrollando el dominio progresivo de sus acciones motrices, estados corporales, sensaciones y habilidades de autorregulación emocional, con el fin de contribuir a la creación de entornos lúdicos equitativos, inclusivos y respetuosos de la diversidad, que promuevan el bienestar integral propio y colectivo sin distinciones de género",
    nivel: "MEDIA",
    grados: ["QUINTO GRADO", "SEXTO GRADO", "SÉPTIMO GRADO"],
    indicadores: [
      { codigo: "I.EF.3.2.1", texto: "Expresa sus estados corporales, sensaciones y emociones durante la práctica lúdica, vinculándolos con la autorregulación de sus acciones para mantener un comportamiento respetuoso, colaborativo y de juego limpio con sus pares" },
      { codigo: "I.EF.3.2.2", texto: "Participa en actividades lúdicas colectivas demostrando habilidades de autorregulación emocional y asumiendo actitudes de respeto, inclusión y valoración de la diversidad, sin distinciones de género" },
    ],
  },
  {
    codigo: "CE.EF.3.3",
    descripcion: "Comprender la flexibilidad de las reglas de juego y su proceso de construcción consensuada en función de los diferentes contextos y objetivos lúdicos, reconociendo la necesidad de respetarlas de manera rigurosa para garantizar la inclusión, la seguridad de sus pares, el autocuidado y la protección del ambiente",
    nivel: "MEDIA",
    grados: ["QUINTO GRADO", "SEXTO GRADO", "SÉPTIMO GRADO"],
    indicadores: [
      { codigo: "I.EF.3.3.1", texto: "Explica la importancia y la flexibilidad de las reglas en los juegos, identificando cómo su modificación consensuada permite adaptar la práctica lúdica a las necesidades del contexto y de los participantes" },
      { codigo: "I.EF.3.3.2", texto: "Participa en actividades lúdicas respetando de manera rigurosa las reglas y los acuerdos co-construidos, demostrando apertura al diálogo, empatía y respeto absoluto por las decisiones tomadas colectivamente con sus pares" },
    ],
  },
  {
    codigo: "CE.EF.3.4",
    descripcion: "Participar en prácticas gimnásticas individuales y grupales incluyendo habilidades motrices básicas, ejercicios, destrezas gimnásticas y acrobacias sencillas, dominando las posiciones dinámicas y estáticas del propio cuerpo en diversas situaciones temporal espaciale, de manera saludable, segura y placentera",
    nivel: "MEDIA",
    grados: ["QUINTO GRADO", "SEXTO GRADO", "SÉPTIMO GRADO"],
    indicadores: [
      { codigo: "I.EF.3.4.1", texto: "Domina las posiciones corporales estáticas y dinámicas en la ejecución de tareas gimnásticas, ajustando sus movimientos a diferentes orientaciones temporal espaciale y aplicando de manera autónoma las precauciones necesarias para su autocuidado y la seguridad de sus pares" },
    ],
  },
  {
    codigo: "CE.EF.3.5",
    descripcion: "Reconocer las propias capacidades físicas (coordinativas y condicionales), sensaciones, emociones y modos de participación durante la realización de prácticas gimnásticas, reflexionando sobre su impacto en la ejecución motriz para asegurar el autocuidado y la protección de sus pares",
    nivel: "MEDIA",
    grados: ["QUINTO GRADO", "SEXTO GRADO", "SÉPTIMO GRADO"],
    indicadores: [
      { codigo: "I.EF.3.5.1", texto: "Explica las emociones, sensaciones corporales y capacidades físicas (coordinativas y condicionales) que experimenta durante la ejecución de ejercicios, destrezas gimnásticas y acrobacias, identificando de forma proactiva situaciones de riesgo para aplicar las reglas de cuidado establecidas" },
      { codigo: "I.EF.3.5.2", texto: "Construye acuerdos de participación segura, de manera individual y colectiva, para la práctica de habilidades motrices básicas, destrezas gimnásticas y acrobacias, reflexionando críticamente sobre la diversidad corporal para garantizar entornos inclusivos" },
    ],
  },
  {
    codigo: "CE.EF.3.6",
    descripcion: "Valorar las prácticas expresivo-comunicativas del propio entorno sociocultural y de otros contextos mediante su identificación, descripción y recreación, reconociéndolas como saberes culturales con derecho a ser aprendidos, compartidos y transmitidos a través de la participación activa y respetuosa en experiencias individuales y colectivas. E",
    nivel: "MEDIA",
    grados: ["QUINTO GRADO", "SEXTO GRADO", "SÉPTIMO GRADO"],
    indicadores: [
      { codigo: "I.EF.3.6.1", texto: "Describe las características, elementos simbólicos y significados de las prácticas expresivo-comunicativas tradicionales de su contexto sociocultural, empleando el lenguaje verbal y corporal para comunicar sus hallazgos de forma clara" },
      { codigo: "I.EF.3.6.2", texto: "Recrea manifestaciones expresivo-comunicativas individuales y colectivas de manera activa, integrando movimientos rítmicos y gestuales con base en el respeto absoluto a la diversidad de los miembros del grupo" },
      { codigo: "I.EF.3.6.3", texto: "Compara las prácticas expresivas de su propia comunidad con las de otros contextos históricos o geográficos, identificando semejanzas y diferencias estructurales para valorar la riqueza del patrimonio pluricultural" },
    ],
  },
  {
    codigo: "CE.EF.3.7",
    descripcion: "Participar en prácticas expresivo-comunicativas para crear e interpretar mensajes corporales con intención expresiva o comunicativa, utilizando creativamente los recursos del entorno, asumiendo diversos roles y traduciendo mensajes a otros lenguajes, sobre la base del establecimiento de acuerdos para el cuidado mutuo y el respeto por las diversas formas de expresión",
    nivel: "MEDIA",
    grados: ["QUINTO GRADO", "SEXTO GRADO", "SÉPTIMO GRADO"],
    indicadores: [
      { codigo: "I.EF.3.7.1", texto: "Crea secuencias expresivas corporales mediante la integración intencional y estética de diversos recursos del entorno, estructurando de manera clara una intención comunicativa específica" },
      { codigo: "I.EF.3.7.2", texto: "Traduce los mensajes expresados con su cuerpo a través de explicaciones verbales o representaciones en otros lenguajes (artísticos, escritos o visuales), demostrando coherencia entre la acción motriz y el significado comunicado" },
      { codigo: "I.EF.3.7.3", texto: "Desempeña de manera autónoma los roles de intérprete, creador, espectador u organizador en producciones corporales, adaptando su participación a los requerimientos técnicos y comunicativos de cada función asumida" },
      { codigo: "I.EF.3.7.4", texto: "Colabora activamente en la organización y montaje de propuestas expresivas colectivas, respetando con rigurosidad los acuerdos de cuidado mutuo y valorando la diversidad en las formas de expresión de sus pares" },
    ],
  },
  {
    codigo: "CE.EF.4.1",
    descripcion: "Participar en diversos juegos valorando sus posibilidades de creación y recreación, diferenciándolos en función de sus características, proveniencia y objetivos, sobre la base del reconocimiento de la importancia de jugar de manera segura para preservarlos como parte del patrimonio cultural intangible del país",
    nivel: "SUPERIOR",
    grados: ["OCTAVO GRADO", "NOVENO GRADO", "DÉCIMO GRADO"],
    indicadores: [
      { codigo: "I.EF.4.1.1", texto: "Resuelve con pertinencia las demandas técnicas y tácticas individuales o de equipo que se presentan en diversas categorías de juego para optimizar el desempeño motriz colectivo" },
      { codigo: "I.EF.4.1.2", texto: "Modifica las dinámicas de juego que reproducen segregaciones por niveles de desempeño físico, ejecutando estrategias colectivas que transformen las barreras motrices en oportunidades de disfrute compartido" },
      { codigo: "I.EF.4.1.3", texto: "Propone cambios asertivos en el entorno físico o regulador de diferentes juegos tras evaluar la gravedad de los riesgos asociados, con la finalidad de incrementar su propia seguridad y la de sus pares" },
    ],
  },
  {
    codigo: "CE.EF.4.4",
    descripcion: "Diseña composiciones expresivo- comunicativas individuales y colectivas, seleccionando diversos recursos compositivos (ritmo, espacio, tiempo, objetos) para comunicar ideas y mensajes significativos con intencionalidad estética",
    nivel: "SUPERIOR",
    grados: ["OCTAVO GRADO", "NOVENO GRADO", "DÉCIMO GRADO"],
    indicadores: [
      { codigo: "I.EF.4.4.2", texto: "Ejerce diferentes roles de gestión (dirección, ejecución, asistencia técnica o mediación) en producciones expresivas colectivas, evidenciando un compromiso ético y democrático en el trabajo con sus pares" },
      { codigo: "I.EF.4.4.3", texto: "Transmite ideas complejas y mensajes significativos mediante el uso de lenguajes corporales y gestuales abstractos en la ejecución de secuencias coreográficas creativas" },
      { codigo: "I.EF.4.4.4", texto: "Diagnóstica los factores emocionales, sociales, contextuales y técnicos que favorecen u obstaculizan su desempeño activo, confortable y seguro en las prácticas expresivas, proponiendo estrategias de autorregulación y mejora colectiva" },
    ],
  },
  {
    codigo: "CE.EF.4.6",
    descripcion: "Valorar las prácticas expresivo- comunicativas del propio entorno sociocultural y de otros contextos mediante su identificación, descripción y recreación, reconociéndolas como saberes culturales con derecho a ser aprendidos, compartidos y transmitidos a través de la participación activa y respetuosa en experiencias individuales y colectivas",
    nivel: "SUPERIOR",
    grados: ["OCTAVO GRADO", "NOVENO GRADO", "DÉCIMO GRADO"],
    indicadores: [
      { codigo: "I.EF.4.6.1", texto: "Describe las características, elementos simbólicos y significados de las prácticas expresivo- comunicativas tradicionales de su contexto sociocultural, empleando el lenguaje verbal y corporal para comunicar sus hallazgos de forma clara" },
      { codigo: "I.EF.4.6.2", texto: "Recrea manifestaciones expresivo-comunicativas individuales y colectivas de manera activa, integrando movimientos rítmicos y gestuales con base en el respeto absoluto a la diversidad de los miembros del grupo" },
      { codigo: "I.EF.4.6.3", texto: "Compara las prácticas expresivas de su propia comunidad con las de otros contextos históricos o geográficos, identificando semejanzas y diferencias estructurales para valorar la riqueza del patrimonio pluricultural" },
    ],
  },
  {
    codigo: "CE.EF.4.7",
    descripcion: "Participar en prácticas expresivo- comunicativas para crear e interpretar mensajes corporales con intención expresiva o comunicativa, utilizando creativamente los recursos del entorno, asumiendo diversos roles y traduciendo mensajes a otros lenguajes, sobre la base del establecimiento de acuerdos para el cuidado mutuo y el respeto por las diversas formas de expresión",
    nivel: "SUPERIOR",
    grados: ["OCTAVO GRADO", "NOVENO GRADO", "DÉCIMO GRADO"],
    indicadores: [
      { codigo: "I.EF.4.7.1", texto: "Crea secuencias expresivas corporales mediante la integración intencional y estética de diversos recursos del entorno, estructurando de manera clara una intención comunicativa específica" },
      { codigo: "I.EF.4.7.2", texto: "Traduce los mensajes expresados con su cuerpo a través de explicaciones verbales o representaciones en otros lenguajes (artísticos, escritos o visuales), demostrando coherencia entre la acción motriz y el significado comunicado" },
      { codigo: "I.EF.4.7.3", texto: "Desempeña de manera autónoma los roles de intérprete, creador, espectador u organizador en producciones corporales, adaptando su participación a los requerimientos técnicos y comunicativos de cada función asumida" },
      { codigo: "I.EF.4.7.4", texto: "Colabora activamente en la organización y montaje de propuestas expresivas colectivas, respetando con rigurosidad los acuerdos de cuidado mutuo y valorando la diversidad en las formas de expresión de sus pares" },
    ],
  },
  {
    codigo: "CE.EF.5.1",
    descripcion: "Analizar diversas prácticas lúdicas mediante la construcción de estrategias cooperativas, el reconocimiento de sus contextos sociohistóricos y la valoración de las diferencias individuales, para transferir aprendizajes de equidad, trabajo en equipo y convivencia pacífica a su vida en comunidad",
    nivel: "BACHILLERATO",
    grados: ["PRIMER CURSO", "SEGUNDO CURSO", "TERCER CURSO"],
    indicadores: [
      { codigo: "I.EF.5.1.1", texto: "Resuelve las demandas técnicas, tácticas y estratégicas en diversas categorías de juego mediante la toma de decisiones autónoma para optimizar el desempeño motriz individual y colectivo" },
      { codigo: "I.EF.5.1.2", texto: "Transforma las dinámicas de juego que generan exclusión o discriminación mediante la aplicación de estrategias colectivas e inclusivas para garantizar el disfrute equitativo y la participación de todos los integrantes" },
      { codigo: "I.EF.5.1.3", texto: "Reorganiza el entorno físico y el sistema de reglas tras evaluar los factores de riesgo en el juego para prevenir lesiones y salvaguardar la seguridad propia y la de sus pares" },
    ],
  },
  {
    codigo: "CE.EF.5.2",
    descripcion: "Diseñar planes de ejercitación gimnástica mediante la evaluación consciente de la propia condición física, el análisis crítico de la información y la aplicación de estrategias de autoconfianza, para transferir hábitos de autocuidado al bienestar integral en la vida cotidiana",
    nivel: "BACHILLERATO",
    grados: ["PRIMER CURSO", "SEGUNDO CURSO", "TERCER CURSO"],
    indicadores: [
      { codigo: "I.EF.5.2.1", texto: "Diseña planes de ejercitación y composiciones gimnásticas complejas mediante la selección y adaptación autónoma de secuencias motrices para mejorar la condición física y transferir hábitos de autocuidado a la vida cotidiana" },
      { codigo: "I.EF.5.2.2", texto: "Evalúa las fuentes de información sobre rutinas gimnásticas difundidas en medios digitales y redes sociales mediante el análisis de su pertinencia y riesgos para aplicar prácticas de entrenamiento seguras y responsables" },
    ],
  },
  {
    codigo: "CE.EF.5.3",
    descripcion: "Crear producciones escénicas mediante la combinación consciente de diversos lenguajes corporales y la identificación de sus requerimientos técnicos, para valorar las manifestaciones expresivo-comunicativas como producciones socioculturales significativas en su entorno",
    nivel: "BACHILLERATO",
    grados: ["PRIMER CURSO", "SEGUNDO CURSO", "TERCER CURSO"],
    indicadores: [
      { codigo: "I.EF.5.3.1", texto: "Ejecuta prácticas expresivas mediante la articulación de requerimientos motores, actitudinales y emocionales para crear composiciones corporales auténticas y desinhibidas" },
      { codigo: "I.EF.5.3.2", texto: "Diseña composiciones escénicas mediante la integración consciente de diversos lenguajes corporales para transmitir mensajes con intencionalidad estética y comunicativa" },
      { codigo: "I.EF.5.3.3", texto: "Analiza los sentidos socioculturales de las prácticas expresivas que integra en sus producciones mediante la contextualización de su origen histórico, colectivo y situado para revalorizar el patrimonio cultural" },
    ],
  },
  {
    codigo: "CE.EF.5.4",
    descripcion: "Reconocer las características específicas de diversas manifestaciones dancísticas mediante la exploración de pasos básicos, la construcción de ambientes de trabajo colaborativo y la adopción de diversos roles, para promover la creación libre y el disfrute de la danza",
    nivel: "BACHILLERATO",
    grados: ["PRIMER CURSO", "SEGUNDO CURSO", "TERCER CURSO"],
    indicadores: [
      { codigo: "I.EF.5.4.1", texto: "Experimenta las características distintivas de diferentes danzas mediante la exploración de sus pasos, ritmos y estructuras para reconocer su diversidad cultural" },
      { codigo: "I.EF.5.4.2", texto: "Asume diversos roles en los procesos de creación e interpretación dancística mediante la práctica del respeto mutuo para consolidar producciones individuales y colectivas" },
      { codigo: "I.EF.5.4.3", texto: "Ejecuta formas propias de bailar mediante la integración autónoma de elementos de distintas danzas para favorecer la libre expresión y el disfrute corporal" },
    ],
  },
  {
    codigo: "CE.EF.5.5",
    descripcion: "Participar de manera consciente y autónoma en diversas prácticas corporales mediante el reconocimiento de la competencia motriz, estados corporales, sensaciones y emociones, para diseñar estrategias que sostengan desempeños activos, placenteros, seguros e inclusivos a lo largo de la vida",
    nivel: "BACHILLERATO",
    grados: ["PRIMER CURSO", "SEGUNDO CURSO", "TERCER CURSO"],
    indicadores: [
      { codigo: "I.EF.5.5.1", texto: "Autorregula su desempeño motriz mediante la lectura de sus estados corporales y emociones para adecuar su participación a sus posibilidades individuales y al contexto" },
      { codigo: "I.EF.5.5.2", texto: "Aplica estrategias de ajuste personal durante la práctica corporal para sostener su autonomía y disfrute a lo largo de las actividades" },
      { codigo: "I.EF.5.5.3", texto: "Adapta sus acciones motrices durante las actividades grupales para garantizar una participación autónoma, segura e inclusiva propia y de sus pares" },
    ],
  },
  {
    codigo: "CE.EF.5.6",
    descripcion: "Ejecutar diversas prácticas corporales de manera sistemática y reflexiva mediante el análisis de las relaciones entre movimiento, salud, diversidad y contextos socioculturales, para promover el cuidado personal, comunitario y ambiental en la vida cotidiana",
    nivel: "BACHILLERATO",
    grados: ["PRIMER CURSO", "SEGUNDO CURSO", "TERCER CURSO"],
    indicadores: [
      { codigo: "I.EF.5.6.1", texto: "Participa en diversas prácticas corporales mediante la adecuación consciente del esfuerzo a sus posibilidades para alcanzar sus objetivos de salud personales y colectivos" },
      { codigo: "I.EF.5.6.2", texto: "Reflexiona sobre la relación entre las prácticas corporales, la salud y los entornos socioculturales mediante la identificación de factores que condicionan el bienestar comunitario" },
      { codigo: "I.EF.5.6.3", texto: "Promueve acciones de cuidado personal, comunitario y ambiental durante la práctica corporal mediante la valoración activa de la diversidad corporal y las diferencias individuales" },
    ],
  },
  {
    codigo: "CE.EF.5.7",
    descripcion: "Aplicar la lógica interna y las reglas de diferentes deportes mediante ajustes tácticos individuales, colectivos y contextuales, para alcanzar objetivos comunes en un marco de juego limpio, seguridad, colaboración y análisis crítico de arquetipos excluyentes",
    nivel: "BACHILLERATO",
    grados: ["PRIMER CURSO", "SEGUNDO CURSO", "TERCER CURSO"],
    indicadores: [
      { codigo: "I.EF.5.7.1", texto: "Toma decisiones técnicas, tácticas y estratégicas en situaciones de juego mediante la identificación de la lógica interna, objetivos y reglas de diferentes deportes" },
      { codigo: "I.EF.5.7.2", texto: "Ajusta su desempeño individual y colectivo en diversos roles deportivos para contribuir a la consecución de objetivos comunes de manera segura y eficaz" },
      { codigo: "I.EF.5.7.3", texto: "Propone alternativas de participación equitativa y resolución pacífica de conflictos mediante la práctica del juego limpio y el análisis crítico de las dinámicas sociales del deporte" },
    ],
  },
];

export const COMPETENCIAS_EF: CompetenciaEspecificaCompleta[] = COMPETENCIAS_EF_POR_SUBNIVEL.map(
  ({ codigo, descripcion, nivel, grados, indicadores }) => ({
    codigo,
    descripcion,
    competenciasClave: [],
    porGrado: grados.map((grado) => ({
      nivel,
      grado,
      indicadores,
      saberes: { declarativos: [], procedimentales: [], actitudinales: [] },
    })),
  })
);
