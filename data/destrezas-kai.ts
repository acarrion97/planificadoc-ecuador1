import { Destreza } from "./types";

// CAI — Cívica y Acompañamiento Integral en el Aula
// Período transversal obligatorio en todos los subniveles — MinEduc Ecuador 2026
// Evaluación: CUALITATIVA con escala A (Muy Satisfactorio) / B (Satisfactorio) / C (Poco Satisfactorio)

// ── Indicadores de evaluación por bloque (seleccionables para cualquier destreza del bloque) ──

const IND_2_1 = [
  "Pensamiento crítico: Indaga información sencilla y respalda sus opiniones. (A / B / C)",
  "Manejo de problemas: Describe problemas cotidianos simples y propone posibles soluciones, considerando las consecuencias. (A / B / C)",
  "Toma de decisiones: Identifica diferentes opciones y consecuencias a corto plazo y su responsabilidad al elegirlas. (A / B / C)",
  "Pensamiento creativo: Genera ideas y soluciones diversas a problemas en actividades de arte, música y juego. (A / B / C)",
  "Conciencia social: Respeta las reglas de convivencia y muestra actitudes de respeto y consideración hacia las demás personas. (A / B / C)",
  "Pensamiento ético: Comprende la importancia de actuar de manera justa y respetuosa. (A / B / C)",
  "Ciudadanía global: Compara y contrasta diferentes culturas, geografías y formas de vida en diversas partes del mundo. (A / B / C)",
];

export const destrezasCAI: Destreza[] = [
  // ── Educación Inicial (subnivel 0 — grupos de 3 y 4 años) ────────────────
  {
    codigo: "CAI.1.1",
    area: "CAI",
    subnivel: 0,
    bloque: 1,
    secuencial: 1,
    descripcion: "Identificar y practicar normas básicas de convivencia, respeto mutuo y cuidado de los objetos personales y comunes en el entorno familiar y escolar.",
    objetivos: [
      "Fomentar la convivencia armónica y el cuidado del entorno desde los primeros años escolares.",
    ],
    criteriosEvaluacion: [
      "Demuestra normas básicas de convivencia, respeto mutuo y cuidado de los objetos en el entorno familiar y escolar.",
    ],
    indicadoresEvaluacion: [
      "Practica reglas de convivencia y cuida los objetos del aula y del hogar. (Evaluación cualitativa: A / B / C)",
    ],
  },

  // ── Preparatoria — 1.° EGB (subnivel 1) ─────────────────────────────────
  {
    codigo: "CAI.1.2",
    area: "CAI",
    subnivel: 1,
    bloque: 1,
    secuencial: 2,
    descripcion: "Reconocer la importancia de los símbolos patrios, las responsabilidades individuales dentro del aula y las expresiones de la diversidad cultural del entorno inmediato.",
    objetivos: [
      "Desarrollar el sentido de pertenencia e identidad nacional desde la primera escolarización formal.",
    ],
    criteriosEvaluacion: [
      "Identifica los símbolos patrios y asume responsabilidades dentro del aula valorando la diversidad cultural.",
    ],
    indicadoresEvaluacion: [
      "Reconoce y valora los símbolos patrios y las expresiones culturales de su entorno, y asume sus responsabilidades en el aula. (Evaluación cualitativa: A / B / C)",
    ],
  },

  // ── Básica Elemental — 2.°, 3.° y 4.° EGB (subnivel 2) ──────────────────
  // Bloque 1 — Ciudadanía, integridad y democracia
  {
    codigo: "CAI.2.1.1",
    area: "CAI",
    subnivel: 2,
    bloque: 1,
    secuencial: 1,
    descripcion: "Comprender la importancia de la integridad en las relaciones interpersonales y el ejercicio de los derechos.",
    objetivos: [],
    criteriosEvaluacion: [],
    indicadoresEvaluacion: IND_2_1,
    habilidadesSocioemocionales: ["pensamiento_critico"],
  },
  {
    codigo: "CAI.2.1.2",
    area: "CAI",
    subnivel: 2,
    bloque: 1,
    secuencial: 2,
    descripcion: "Identificar consecuencias del accionar honesto o deshonesto en situaciones cotidianas.",
    objetivos: [],
    criteriosEvaluacion: [],
    indicadoresEvaluacion: IND_2_1,
    habilidadesSocioemocionales: ["conciencia_social"],
  },
  {
    codigo: "CAI.2.1.3",
    area: "CAI",
    subnivel: 2,
    bloque: 1,
    secuencial: 3,
    descripcion: "Participar en actividades democráticas en el entorno escolar, comprendiendo la importancia de los roles y sus responsabilidades.",
    objetivos: [],
    criteriosEvaluacion: [],
    indicadoresEvaluacion: IND_2_1,
    habilidadesSocioemocionales: ["toma_decisiones", "pensamiento_critico"],
  },
  {
    codigo: "CAI.2.1.4",
    area: "CAI",
    subnivel: 2,
    bloque: 1,
    secuencial: 4,
    descripcion: "Desarrollar un sentido de justicia social a través de la identificación de situaciones que conlleven a la reflexión.",
    objetivos: [],
    criteriosEvaluacion: [],
    indicadoresEvaluacion: IND_2_1,
    habilidadesSocioemocionales: ["conciencia_social", "pensamiento_etico"],
  },
  {
    codigo: "CAI.2.1.5",
    area: "CAI",
    subnivel: 2,
    bloque: 1,
    secuencial: 5,
    descripcion: "Identificar principios de responsabilidad social en el cuidado del medio ambiente, en el entorno escolar y comunitario.",
    objetivos: [],
    criteriosEvaluacion: [],
    indicadoresEvaluacion: IND_2_1,
    habilidadesSocioemocionales: ["conciencia_social", "ciudadania_global"],
  },
  {
    codigo: "CAI.2.1.6",
    area: "CAI",
    subnivel: 2,
    bloque: 1,
    secuencial: 6,
    descripcion: "Evaluar opciones y tomar decisiones responsables para resolver conflictos en el contexto de actividades escolares y situaciones cotidianas.",
    objetivos: [],
    criteriosEvaluacion: [],
    indicadoresEvaluacion: IND_2_1,
    habilidadesSocioemocionales: ["toma_decisiones", "pensamiento_etico"],
  },
  {
    codigo: "CAI.2.1.7",
    area: "CAI",
    subnivel: 2,
    bloque: 1,
    secuencial: 7,
    descripcion: "Describir el significado y la importancia de los símbolos nacionales y los hechos históricos, a través de relatos, actividades lúdicas y discusiones guiadas.",
    objetivos: [],
    criteriosEvaluacion: [],
    indicadoresEvaluacion: IND_2_1,
    habilidadesSocioemocionales: ["conciencia_social", "ciudadania_global"],
  },
  {
    codigo: "CAI.2.1.8",
    area: "CAI",
    subnivel: 2,
    bloque: 1,
    secuencial: 8,
    descripcion: "Analizar situaciones y generar soluciones innovadoras para resolver problemas complejos y comunicar ideas creativas, en actividades grupales.",
    objetivos: [],
    criteriosEvaluacion: [],
    indicadoresEvaluacion: IND_2_1,
    habilidadesSocioemocionales: ["pensamiento_critico"],
  },
  {
    codigo: "CAI.2.1.9",
    area: "CAI",
    subnivel: 2,
    bloque: 1,
    secuencial: 9,
    descripcion: "Reflexionar sobre la importancia de los valores de justicia, igualdad, respeto, solidaridad y empatía para aplicarlos en la interacción con las demás personas.",
    objetivos: [],
    criteriosEvaluacion: [],
    indicadoresEvaluacion: IND_2_1,
    habilidadesSocioemocionales: ["conciencia_social"],
  },
  {
    codigo: "CAI.2.1.10",
    area: "CAI",
    subnivel: 2,
    bloque: 1,
    secuencial: 10,
    descripcion: "Analizar y generar soluciones innovadoras básicas, para resolver problemas complejos y comunicar ideas creativas.",
    objetivos: [],
    criteriosEvaluacion: [],
    indicadoresEvaluacion: IND_2_1,
    habilidadesSocioemocionales: ["pensamiento_critico", "manejo_problemas", "pensamiento_creativo"],
  },

  // Bloque 2 — Autogestión emocional
  {
    codigo: "CAI.2.2.1",
    area: "CAI",
    subnivel: 2,
    bloque: 2,
    secuencial: 1,
    descripcion: "Reconocer los valores y creencias familiares que influyen en el comportamiento y las decisiones personales.",
    objetivos: [],
    criteriosEvaluacion: [],
    indicadoresEvaluacion: [],
    habilidadesSocioemocionales: ["autoconocimiento"],
  },
  {
    codigo: "CAI.2.2.2",
    area: "CAI",
    subnivel: 2,
    bloque: 2,
    secuencial: 2,
    descripcion: "Identificar y valorar sus fortalezas en la adaptación a desafíos, tanto en juegos estructurados como en tareas escolares, demostrando flexibilidad y resiliencia.",
    objetivos: [],
    criteriosEvaluacion: [],
    indicadoresEvaluacion: [],
    habilidadesSocioemocionales: ["autoconocimiento"],
  },
  {
    codigo: "CAI.2.2.3",
    area: "CAI",
    subnivel: 2,
    bloque: 2,
    secuencial: 3,
    descripcion: "Identificar estrategias para regular sus emociones y manejar el estrés en el entorno escolar y social.",
    objetivos: [],
    criteriosEvaluacion: [],
    indicadoresEvaluacion: [],
    habilidadesSocioemocionales: ["manejo_emociones", "manejo_estres"],
  },
  {
    codigo: "CAI.2.3.1",
    area: "CAI",
    subnivel: 2,
    bloque: 3,
    secuencial: 1,
    descripcion: "Desarrollar habilidades de trabajo en equipo, comunicación asertiva y empatía en la resolución de conflictos, fomentando la inclusión y el respeto hacia la diversidad cultural y social.",
    objetivos: [],
    criteriosEvaluacion: [],
    indicadoresEvaluacion: IND_2_1,
    habilidadesSocioemocionales: ["empatia", "trabajo_colaborativo", "comunicacion_asertiva"],
  },

  // ── Básica Media — 5.°, 6.° y 7.° EGB (subnivel 3) ─────────────────────
  {
    codigo: "CAI.3.1",
    area: "CAI",
    subnivel: 3,
    bloque: 1,
    secuencial: 1,
    descripcion: "Aplicar principios éticos, democráticos y de responsabilidad social en la toma de decisiones, valorando la diversidad, la transparencia, la soberanía popular y los símbolos nacionales en el entorno escolar y comunitario.",
    objetivos: [
      "Comprender la importancia de cumplir con las normas sociales, la democracia y del ejercicio de la ciudadanía, valorando la importancia de la cooperación, la diversidad y demostrando empatía y respeto hacia los demás, al gestionar sus emociones de manera adecuada y tomar decisiones responsables.",
    ],
    criteriosEvaluacion: [
      "Comprende el funcionamiento de la democracia, las reglas y normas sociales y la importancia de seguirlas. Valora la diversidad de las personas reconociendo la importancia de la cooperación, y la expresión y escucha respetuosa de opiniones. Resuelve de manera creativa problemas cotidianos tomando decisiones informadas, éticas y coherentes para el bienestar común y del entorno natural.",
    ],
    indicadoresEvaluacion: [
      "Pensamiento crítico: Genera soluciones creativas a problemas sencillos valiéndose de información. (Evaluación cualitativa: A / B / C)",
      "Manejo de problemas: Identifica las causas y consecuencias de problemas cotidianos y propone soluciones creativas y viables. (Evaluación cualitativa: A / B / C)",
      "Toma de decisiones: Analiza opciones e identifica sus responsabilidades al elegirlas. (Evaluación cualitativa: A / B / C)",
      "Pensamiento creativo: Genera ideas originales para sus expresiones artísticas y en la resolución de problemas y conflictos. (Evaluación cualitativa: A / B / C)",
      "Conciencia social: Comprende y valora la diversidad, identifica problemas de injusticia y discriminación, y promueve la inclusión. (Evaluación cualitativa: A / B / C)",
      "Pensamiento ético: Relaciona situaciones éticas al considerar consecuencias de diferentes acciones. (Evaluación cualitativa: A / B / C)",
      "Ciudadanía global: Explora formas de contribuir a un mundo más sostenible y justo. (Evaluación cualitativa: A / B / C)",
    ],
  },
  {
    codigo: "CAI.3.2",
    area: "CAI",
    subnivel: 3,
    bloque: 2,
    secuencial: 1,
    descripcion: "Reflexionar sobre la influencia de los propios valores y creencias en las decisiones personales, demostrar respuestas emocionales asertivas e identificar técnicas de regulación emocional y manejo del estrés.",
    objetivos: [
      "Comprender la importancia de cumplir con las normas sociales, la democracia y del ejercicio de la ciudadanía, valorando la importancia de la cooperación, la diversidad y demostrando empatía y respeto hacia los demás, al gestionar sus emociones de manera adecuada y tomar decisiones responsables.",
    ],
    criteriosEvaluacion: [
      "Gestiona sus emociones al tomar decisiones adecuadas para el bienestar propio, comprendiendo las consecuencias de su accionar en su presente y futuro. Identifica recursos y estrategias personales para gestionar situaciones de estrés.",
    ],
    indicadoresEvaluacion: [
      "Manejo de emociones y sentimientos: Comprende las causas y efectos de las emociones y muestra habilidades básicas de gestión de sus emociones y de las otras personas. (Evaluación cualitativa: A / B / C)",
      "Manejo de estrés y tensiones: Identifica estrategias personales de afrontamiento de situaciones de estrés. (Evaluación cualitativa: A / B / C)",
      "Autoconocimiento: Reflexiona sobre las propias experiencias, valores y creencias. (Evaluación cualitativa: A / B / C)",
    ],
  },
  {
    codigo: "CAI.3.3",
    area: "CAI",
    subnivel: 3,
    bloque: 3,
    secuencial: 1,
    descripcion: "Aplicar habilidades de comunicación asertiva, empatía y manejo de conflictos para mejorar las relaciones interpersonales, participar en la construcción del código de convivencia y fomentar relaciones saludables en el contexto académico y social.",
    objetivos: [
      "Comprender la importancia de cumplir con las normas sociales, la democracia y del ejercicio de la ciudadanía, valorando la importancia de la cooperación, la diversidad y demostrando empatía y respeto hacia los demás, al gestionar sus emociones de manera adecuada y tomar decisiones responsables.",
    ],
    criteriosEvaluacion: [
      "Colabora en actividades grupales, valorando la importancia de la cooperación y la comunicación asertiva para resolver conflictos de manera pacífica en función del bien común. Demuestra empatía y solidaridad hacia las personas que lo rodean identificando problemas de injusticia y discriminación.",
    ],
    indicadoresEvaluacion: [
      "Empatía: Muestra una actitud de escucha activa y busca formas de apoyar y comprender a las demás personas, poniéndose en el lugar de los demás. (Evaluación cualitativa: A / B / C)",
      "Trabajo en equipo: Colabora de manera efectiva con otros, respetando y valorando la diversidad de opiniones para el logro de metas comunes. (Evaluación cualitativa: A / B / C)",
      "Comunicación efectiva/asertiva: Escucha activamente, expresa opiniones de manera respetuosa y adapta el lenguaje a diferentes contextos y audiencias. (Evaluación cualitativa: A / B / C)",
      "Relaciones interpersonales: Colabora con otras personas, trabaja en equipo para alcanzar metas comunes y resolver conflictos de manera constructiva. (Evaluación cualitativa: A / B / C)",
      "Manejo de conflictos: Comunica efectivamente en situaciones de conflicto, busca soluciones creativas para resolver desacuerdos. (Evaluación cualitativa: A / B / C)",
    ],
  },

  // ── Básica Superior — 8.°, 9.° y 10.° EGB (subnivel 4) ─────────────────
  {
    codigo: "CAI.4.1",
    area: "CAI",
    subnivel: 4,
    bloque: 1,
    secuencial: 1,
    descripcion: "Analizar críticamente los fundamentos de la democracia, la soberanía popular, la división de poderes, la transparencia y la rendición de cuentas; valorar la diversidad cultural promoviendo la justicia social, la inclusión y la equidad; y comprender la importancia del cuidado ambiental.",
    objetivos: [
      "Analizar críticamente los fundamentos de la democracia, la ciudadanía, los derechos y los valores cívicos, aplicándolos en su vida diaria a través de la toma de decisiones informadas y responsables promoviendo la inclusión y la justicia social y el cuidado del medio ambiente, mientras gestiona sus emociones, y fortalece su autoestima y el ejercicio de su ciudadanía.",
    ],
    criteriosEvaluacion: [
      "Analizar críticamente los fundamentos de la democracia, incluyendo la soberanía popular, la división de poderes y la importancia de la transparencia y la rendición de cuentas. Valora la diversidad cultural, promoviendo la justicia social, la inclusión y la equidad en su entorno. Aplicar los principios de respeto, empatía, imparcialidad, cooperación, en la toma de decisiones y la resolución creativa de conflictos demostrando un compromiso con el bien común. Comprender la importancia del cuidado ambiental cuestionando las prácticas de producción y consumo contemporáneas.",
    ],
    indicadoresEvaluacion: [
      "Pensamiento crítico: Analiza la validez de la información y genera soluciones creativas a problemas complejos. Reconoce distintas fuentes de información que le permita resolver problemas o tomar decisiones. (Evaluación cualitativa: A / B / C)",
      "Manejo de problemas: Identifica problemas cotidianos complejos, propone soluciones y evalúa su efectividad. (Evaluación cualitativa: A / B / C)",
      "Toma de decisiones: Se proyecta hacia el futuro identificando elementos que le permita llegar a sus metas como su preparación para la toma de decisiones relacionadas con su vocación, analiza y evalúa opciones considerando riesgos y beneficios. (Evaluación cualitativa: A / B / C)",
      "Pensamiento creativo: Explora diferentes formas de expresión artística y comunicación y, utiliza la creatividad en la generación de soluciones innovadoras a problemas y conflictos. (Evaluación cualitativa: A / B / C)",
      "Ciudadanía global: Analiza y comprende las interconexiones entre distintas regiones y culturas, y, aborda temas globales desde una perspectiva crítica y ética. (Evaluación cualitativa: A / B / C)",
      "Conciencia social: Comprende las interacciones sociales y culturales y valora la importancia de la equidad y la justicia en las relaciones con los demás. (Evaluación cualitativa: A / B / C)",
      "Pensamiento ético: Analiza cuestiones éticas en la toma de decisiones y actúa de manera responsable y respetuosa en diferentes contextos. (Evaluación cualitativa: A / B / C)",
    ],
  },
  {
    codigo: "CAI.4.2",
    area: "CAI",
    subnivel: 4,
    bloque: 2,
    secuencial: 1,
    descripcion: "Analizar críticamente el propio sistema de valores y creencias, fortalezas y áreas de mejora, gestionando las emociones de manera efectiva, tomando decisiones informadas y responsables basadas en principios éticos, y demostrando resiliencia y perseverancia ante los desafíos.",
    objetivos: [
      "Analizar críticamente los fundamentos de la democracia, la ciudadanía, los derechos y los valores cívicos, aplicándolos en su vida diaria a través de la toma de decisiones informadas y responsables promoviendo la inclusión y la justicia social y el cuidado del medio ambiente, mientras gestiona sus emociones, y fortalece su autoestima y el ejercicio de su ciudadanía.",
    ],
    criteriosEvaluacion: [
      "Analizar críticamente su sistema de valores y creencias, fortalezas y áreas de mejora, gestionando sus emociones de manera efectiva, tomando decisiones informadas, responsables y basadas en principios éticos. Demostrar resiliencia y perseverancia ante los desafíos.",
    ],
    indicadoresEvaluacion: [
      "Manejo de emociones y sentimientos: Comprende las causas y efectos de las emociones y las autorregula y apoya a gestionar las emociones de otras personas. (Evaluación cualitativa: A / B / C)",
      "Manejo de estrés y tensiones: Comprende los factores estresantes y aplica técnicas de manejo del tiempo y el estrés. (Evaluación cualitativa: A / B / C)",
      "Autoconocimiento: Reflexiona sobre su identidad personal identificando su estilo de aprendizaje y la manera en que influye para la construcción de sus conocimientos. (Evaluación cualitativa: A / B / C)",
    ],
  },
  {
    codigo: "CAI.4.3",
    area: "CAI",
    subnivel: 4,
    bloque: 3,
    secuencial: 1,
    descripcion: "Promover la inclusión, la solidaridad y el trabajo en equipo, demostrando habilidades de comunicación efectiva, empatía y colaboración al interactuar con respeto hacia las diferencias individuales y culturales, y resolver conflictos de manera pacífica, creativa y constructiva.",
    objetivos: [
      "Analizar críticamente los fundamentos de la democracia, la ciudadanía, los derechos y los valores cívicos, aplicándolos en su vida diaria a través de la toma de decisiones informadas y responsables promoviendo la inclusión y la justicia social y el cuidado del medio ambiente, mientras gestiona sus emociones, y fortalece su autoestima y el ejercicio de su ciudadanía.",
    ],
    criteriosEvaluacion: [
      "Promover la inclusión, la solidaridad y el trabajo en equipo, demostrando habilidades de comunicación efectiva, empatía y colaboración, al interactuar con respeto hacia las diferencias individuales y culturales. Resolver conflictos de manera pacífica, creativa y constructiva.",
    ],
    indicadoresEvaluacion: [
      "Empatía: Reconoce y valora las experiencias y perspectivas de las demás personas demostrando comportamientos solidarios en situaciones diversas. (Evaluación cualitativa: A / B / C)",
      "Trabajo en equipo: Respeta la diversidad de opiniones para asumir y organizar roles en la consecución de metas comunes. (Evaluación cualitativa: A / B / C)",
      "Relaciones interpersonales: Muestra respeto, empatía y comprensión hacia los demás y, establece relaciones positivas en diversos contextos sociales. (Evaluación cualitativa: A / B / C)",
      "Comunicación efectiva/asertiva: Utiliza estrategias de comunicación clara y asertiva y argumenta de manera fundamentada adaptando el mensaje a diferentes formas de comunicación. (Evaluación cualitativa: A / B / C)",
      "Manejo de conflictos: Analiza diferentes puntos de vista y considera las necesidades de todas las partes involucradas en un conflicto y busca soluciones creativas para resolver desacuerdos. (Evaluación cualitativa: A / B / C)",
    ],
  },

  // ── Bachillerato General Unificado — 1.°, 2.° y 3.° BGU (subnivel 5) ───
  {
    codigo: "CAI.5.1",
    area: "CAI",
    subnivel: 5,
    bloque: 1,
    secuencial: 1,
    descripcion: "Promover valores cívicos, éticos y democráticos en la toma de decisiones, la rendición de cuentas y el ejercicio de derechos, valorando la diversidad cultural, la justicia social, la sostenibilidad y la historia nacional como bases de una sociedad justa y equitativa.",
    objetivos: [
      "Ejercer su ciudadanía, interactuando de manera comprometida con su comunidad, evaluando críticamente su papel en la sociedad y promoviendo el cambio social y el ejercicio de derechos a través de acciones concretas, basadas en principios éticos y democráticos, mientras desarrolla habilidades de liderazgo, cooperación y gestión emocional para enfrentar los desafíos de la vida adulta.",
    ],
    criteriosEvaluacion: [
      "Promover el respeto por la diversidad cultural, la justicia social, la equidad y la solidaridad en la toma de decisiones aplicando valores de libertad, respeto, empatía y transparencia en la rendición de cuentas y en sus interacciones sociales. Demuestra un comportamiento ético y reflexivo, proponiendo soluciones creativas a los desafíos globales desde una perspectiva crítica y de valoración de la democracia. Toma decisiones informadas, responsables y éticas en función del bienestar común comprometiéndose con la construcción de una sociedad sostenible y justa.",
    ],
    indicadoresEvaluacion: [
      "Toma de decisiones: Aborda decisiones cruciales para su futuro, considerando metas personales, valores, habilidades, oportunidades e implicaciones éticas; evaluando las consecuencias a largo plazo. (Evaluación cualitativa: A / B / C)",
      "Pensamiento creativo: Experimenta con diferentes medios y técnicas artísticas y aplica la creatividad en proyectos multidisciplinarios y la resolución de problemas y conflictos desafiantes. (Evaluación cualitativa: A / B / C)",
      "Pensamiento crítico: Investiga temas complejos y evalúa la fiabilidad de las fuentes para dar opiniones informadas. (Evaluación cualitativa: A / B / C)",
      "Manejo de problemas: Identifica problemas en diferentes contextos, plantea soluciones y reflexiona sobre el proceso y los resultados obtenidos. (Evaluación cualitativa: A / B / C)",
      "Conciencia social: Comprende interacciones sociales y globales involucrándose en iniciativas de cambio social, participación y promoción del respeto a los derechos humanos. (Evaluación cualitativa: A / B / C)",
      "Pensamiento ético: Reflexiona críticamente sobre los sistemas de valores personales y sociales, evalúa el impacto ético de las acciones individuales y colectivas, y promueve la justicia y la equidad. (Evaluación cualitativa: A / B / C)",
      "Ciudadanía global: Analiza problemas sociales a nivel global y participa en proyectos de impacto social a nivel local. (Evaluación cualitativa: A / B / C)",
    ],
  },

  {
    codigo: "CAI.5.2",
    area: "CAI",
    subnivel: 5,
    bloque: 2,
    secuencial: 1,
    descripcion: "Evaluar el impacto de los valores y creencias familiares en las decisiones personales, desarrollar la autoconciencia y la resiliencia ante situaciones estresantes, y aplicar estrategias de regulación emocional en los contextos académico, familiar y social, construyendo el proyecto de vida.",
    objetivos: [
      "Ejercer su ciudadanía, interactuando de manera comprometida con su comunidad, evaluando críticamente su papel en la sociedad y promoviendo el cambio social y el ejercicio de derechos a través de acciones concretas, basadas en principios éticos y democráticos, mientras desarrolla habilidades de liderazgo, cooperación y gestión emocional para enfrentar los desafíos de la vida adulta.",
    ],
    criteriosEvaluacion: [
      "Evaluar sus decisiones en función de su bienestar y proyecto de vida, considerando las consecuencias de su accionar, sus fortalezas y sus debilidades. Aplicar estrategias efectivas para gestionar el estrés y las emociones, buscando apoyo cuando lo necesita.",
    ],
    indicadoresEvaluacion: [
      "Manejo de emociones y sentimientos: Identifica y gestiona emociones complejas utilizando estrategias de autorregulación y demuestra habilidades para apoyo emocional hacia las demás personas. (Evaluación cualitativa: A / B / C)",
      "Manejo de estrés y tensiones: Utiliza técnicas de relajación y autocuidado y aplica estrategias efectivas de afrontamiento frente a situaciones de estrés académico y social, y busca apoyo cuando sea necesario. (Evaluación cualitativa: A / B / C)",
      "Autoconocimiento: Explora y cuestiona las propias creencias, valores y perspectivas y muestra una identidad coherente con sus intereses y aspiraciones. (Evaluación cualitativa: A / B / C)",
    ],
  },

  {
    codigo: "CAI.5.3",
    area: "CAI",
    subnivel: 5,
    bloque: 3,
    secuencial: 1,
    descripcion: "Desarrollar habilidades de comunicación asertiva, empatía y manejo de conflictos para fortalecer las relaciones interpersonales, proponer acuerdos que promuevan la inclusión y la solidaridad, y liderar iniciativas de cambio social en el contexto académico y comunitario.",
    objetivos: [
      "Ejercer su ciudadanía, interactuando de manera comprometida con su comunidad, evaluando críticamente su papel en la sociedad y promoviendo el cambio social y el ejercicio de derechos a través de acciones concretas, basadas en principios éticos y democráticos, mientras desarrolla habilidades de liderazgo, cooperación y gestión emocional para enfrentar los desafíos de la vida adulta.",
    ],
    criteriosEvaluacion: [
      "Valorar la inclusión, la solidaridad y la colaboración para la resolución de conflictos en función del bien común. Promueve la construcción de una sociedad basada en principios éticos y democráticos al liderar iniciativas creativas de cambio social.",
    ],
    indicadoresEvaluacion: [
      "Empatía: Demuestra una actitud de inclusión y respeto hacia la diversidad, y promueve la empatía en la resolución de conflictos. (Evaluación cualitativa: A / B / C)",
      "Trabajo en equipo: Trabaja en proyectos multidisciplinarios y enfrenta desafíos de manera colaborativa promoviendo una comunicación abierta y respetuosa. (Evaluación cualitativa: A / B / C)",
      "Comunicación efectiva/asertiva: Utiliza técnicas de persuasión y negociación y se adapta a diferentes audiencias y propósitos de comunicación. (Evaluación cualitativa: A / B / C)",
      "Relaciones interpersonales: Trabaja de manera efectiva en equipo, promueve la colaboración y la inclusión, y establece relaciones positivas en diferentes entornos sociales. (Evaluación cualitativa: A / B / C)",
      "Manejo de conflictos: Reconoce y analiza las causas subyacentes de los conflictos y aplica estrategias creativas para resolver los desacuerdos de manera justa y respetuosa. (Evaluación cualitativa: A / B / C)",
    ],
  },
];
