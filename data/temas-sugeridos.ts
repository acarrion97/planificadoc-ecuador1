import { Destreza, TemaSugerido, Area, AREAS_INFO } from "./types";

/**
 * Genera temas sugeridos ESPECÍFICOS para cada destreza.
 * Cada tema incluye una estructura de clase de 45 minutos en 4 fases ERCA:
 * - Experiencia (10 min): Activación de conocimientos previos y vivencias
 * - Reflexión (10 min): Análisis y cuestionamiento de la experiencia
 * - Conceptualización (15 min): Construcción formal del conocimiento
 * - Aplicación (10 min): Transferencia y práctica del aprendizaje
 *
 * Los temas se generan dinámicamente a partir de la descripción de la destreza,
 * garantizando que cada destreza tenga temas únicos y relevantes.
 */

// ============================================================
// UTILIDADES
// ============================================================

function generarId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 6);
}

/**
 * Genera un hash numérico determinístico a partir de un string.
 * Permite seleccionar variaciones consistentes para la misma destreza.
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

/**
 * Extrae palabras clave de la descripción de una destreza.
 */
function extraerPalabrasClave(descripcion: string): string[] {
  const stopWords = new Set([
    "de", "del", "la", "las", "el", "los", "en", "con", "por", "para",
    "un", "una", "unos", "unas", "y", "o", "que", "se", "su", "sus",
    "al", "a", "como", "entre", "sobre", "desde", "hasta", "más",
    "es", "son", "ser", "estar", "ha", "han", "lo", "le", "les",
    "no", "ni", "si", "ya", "muy", "bien", "mal", "cada", "todo",
    "esta", "este", "estos", "estas", "ese", "esa", "esos", "esas",
    "aquel", "aquella", "otros", "otras", "otro", "otra", "mismo",
    "misma", "mismos", "mismas", "tanto", "tanta", "tantos", "tantas",
    "mediante", "través", "traves", "partir", "base", "basándose",
    "basandose", "diferentes", "diversos", "diversas",
  ]);

  return descripcion
    .toLowerCase()
    .replace(/[.,;:()¿?¡!""]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !stopWords.has(w));
}

/**
 * Genera un título de tema creativo basado en la destreza.
 */
function generarTituloTema(destreza: Destreza, variante: number): string {
  const palabras = extraerPalabrasClave(destreza.descripcion);
  const areaInfo = AREAS_INFO[destreza.area];
  const bloque = areaInfo.bloques[destreza.bloque] || "";

  const prefijos: Record<number, string[]> = {
    0: [
      "Descubriendo", "Explorando", "Aprendiendo sobre", "Conociendo",
      "Investigando", "Comprendiendo",
    ],
    1: [
      "Taller práctico:", "Manos a la obra:", "Aprendemos jugando:",
      "Laboratorio de", "Creando con", "Construyendo",
    ],
    2: [
      "Reto creativo:", "Proyecto:", "Misión:", "Desafío:",
      "Aventura de aprendizaje:", "Expedición:",
    ],
  };

  const hash = hashString(destreza.codigo);
  const prefijoList = prefijos[variante] || prefijos[0];
  const prefijo = prefijoList[hash % prefijoList.length];

  const temaBase = palabras.slice(0, 4).join(" ");
  if (temaBase.length > 10) {
    return `${prefijo} ${temaBase}`;
  }
  return `${prefijo} ${bloque.toLowerCase()}`;
}

// ============================================================
// PLANTILLAS DE ACTIVIDADES POR ÁREA (MODELO ERCA)
// ============================================================

interface PlantillaActividades {
  experiencia: (destreza: Destreza, variante: number) => string[];
  reflexion: (destreza: Destreza, variante: number) => string[];
  conceptualizacion: (destreza: Destreza, variante: number) => string[];
  aplicacion: (destreza: Destreza, variante: number) => string[];
  recursos: (destreza: Destreza, variante: number) => string[];
}

const PLANTILLAS_MATEMATICA: PlantillaActividades = {
  experiencia: (d, v) => {
    const desc = d.descripcion;
    const opciones: string[][] = [
      [
        `Plantear una situación problema del contexto cotidiano relacionada con: ${desc}`,
        "Invitar a los estudiantes a compartir experiencias previas sobre el tema.",
        "Realizar una lluvia de ideas y registrar las respuestas en la pizarra.",
        "Presentar el objetivo de la clase y lo que se espera lograr al finalizar.",
      ],
      [
        `Presentar un acertijo o desafío matemático vinculado con: ${desc}`,
        "Solicitar que los estudiantes intenten resolverlo en parejas (3 minutos).",
        "Socializar las estrategias utilizadas y registrar en la pizarra.",
        "Conectar las respuestas con el contenido nuevo de la clase.",
      ],
      [
        `Mostrar imágenes o material concreto relacionado con: ${desc}`,
        "Formular preguntas generadoras: ¿Qué observan? ¿Qué relación tiene con las matemáticas?",
        "Explorar conocimientos previos mediante preguntas dirigidas.",
        "Anunciar el tema y objetivo de aprendizaje de la clase.",
      ],
    ];
    return opciones[v % opciones.length];
  },
  reflexion: (d, v) => {
    const desc = d.descripcion;
    const opciones: string[][] = [
      [
        "Formular preguntas de análisis: ¿Qué estrategias usaron? ¿Cuál fue más efectiva?",
        "Solicitar que comparen sus respuestas con las de otros compañeros.",
        `Guiar la discusión sobre las dificultades encontradas al resolver: ${desc.substring(0, 60).toLowerCase()}...`,
        "Registrar en la pizarra las conclusiones del grupo.",
      ],
      [
        "Organizar una puesta en común de las soluciones encontradas.",
        "Indagar sobre las razones del éxito de cada estrategia utilizada.",
        "Identificar errores comunes y analizarlos colectivamente.",
        "Relacionar las respuestas con conceptos matemáticos formales.",
      ],
      [
        "Solicitar que expliquen con sus propias palabras cómo resolvieron el problema.",
        "Comparar diferentes caminos de solución presentados por los estudiantes.",
        "Formular preguntas: ¿Qué tienen en común estas soluciones?",
        "Guiar hacia la identificación de patrones o reglas.",
      ],
    ];
    return opciones[v % opciones.length];
  },
  conceptualizacion: (d, v) => {
    const desc = d.descripcion;
    const opciones: string[][] = [
      [
        `Explicar el concepto central: ${desc}`,
        "Utilizar material concreto (regletas, bloques, ábacos) para representar el concepto.",
        "Realizar práctica guiada: resolver 2-3 ejercicios paso a paso en la pizarra.",
        "Trabajar en el texto del estudiante: analizar ejemplos resueltos.",
        "Formalizar las reglas y procedimientos en el cuaderno.",
      ],
      [
        `Introducir el tema mediante una demostración práctica: ${desc}`,
        "Entregar material manipulativo a cada grupo de trabajo.",
        "Guiar la exploración: solicitar que descubran patrones o relaciones.",
        "Formalizar el concepto a partir de los descubrimientos de los estudiantes.",
        "Resolver ejercicios de complejidad creciente en la pizarra.",
      ],
      [
        `Presentar el contenido de forma estructurada: ${desc}`,
        "Utilizar representaciones gráficas (diagramas, tablas, recta numérica) para visualizar.",
        "Modelar la resolución de un problema paso a paso.",
        "Solicitar que los estudiantes resuelvan un problema similar de forma guiada.",
        "Sintetizar el concepto con un organizador gráfico en el cuaderno.",
      ],
    ];
    return opciones[v % opciones.length];
  },
  aplicacion: (d, v) => {
    const opciones: string[][] = [
      [
        "Asignar ejercicios individuales de aplicación directa.",
        "Recorrer el aula para orientar y resolver dudas individuales.",
        "Proponer un ejercicio de mayor complejidad para quienes terminan primero.",
        "Socializar resultados y corregir colectivamente los ejercicios.",
        "Promover la metacognición: ¿Qué fue fácil? ¿Qué necesito repasar?",
      ],
      [
        "Asignar trabajo en parejas: resolver problemas contextualizados.",
        "Organizar la socialización de resultados entre parejas.",
        "Corregir errores comunes identificados durante la clase.",
        "Asignar tarea de extensión con problemas del contexto real.",
        "Realizar autoevaluación: ¿Puedo explicar lo aprendido a un compañero?",
      ],
      [
        "Asignar trabajo en equipos: resolver un reto matemático contextualizado.",
        "Invitar a cada equipo a explicar su estrategia de resolución.",
        "Organizar un juego rápido de repaso (preguntas y respuestas).",
        "Asignar tarea diferenciada según el nivel de avance.",
        "Destacar el progreso logrado en la clase para motivar al estudiante.",
      ],
    ];
    return opciones[v % opciones.length];
  },
  recursos: (d, v) => {
    const base = ["Texto del estudiante", "Cuaderno de trabajo", "Pizarra y marcadores"];
    const extras: string[][] = [
      ["Material concreto (regletas, bloques lógicos, ábacos)", "Hojas de ejercicios impresas"],
      ["Material manipulativo del aula", "Papelotes y marcadores de colores", "Calculadora (si aplica)"],
      ["Fichas de trabajo", "Material reciclado para representaciones", "Recursos tecnológicos (si están disponibles)"],
    ];
    return [...base, ...extras[v % extras.length]];
  },
};

const PLANTILLAS_LENGUA: PlantillaActividades = {
  experiencia: (d, v) => {
    const desc = d.descripcion;
    const opciones: string[][] = [
      [
        `Presentar un texto o situación comunicativa relacionada con: ${desc}`,
        "Explorar conocimientos previos mediante preguntas abiertas.",
        "Realizar una lluvia de ideas sobre el tema y registrar en la pizarra.",
        "Presentar el propósito comunicativo de la clase.",
      ],
      [
        `Leer en voz alta un fragmento motivador vinculado con: ${desc}`,
        "Solicitar predicciones: ¿De qué creen que tratará la clase?",
        "Activar vocabulario previo relacionado con el tema.",
        "Compartir el objetivo de aprendizaje.",
      ],
      [
        `Mostrar imágenes o un video corto relacionado con: ${desc}`,
        "Formular preguntas generadoras sobre lo observado.",
        "Conectar las respuestas con experiencias comunicativas cotidianas.",
        "Presentar el tema y lo que se espera lograr.",
      ],
    ];
    return opciones[v % opciones.length];
  },
  reflexion: (d, v) => {
    const desc = d.descripcion;
    const opciones: string[][] = [
      [
        "Formular preguntas de análisis: ¿Qué les llamó la atención del texto?",
        "Solicitar que identifiquen las ideas principales.",
        `Guiar la discusión sobre la intención comunicativa: ${desc.substring(0, 50).toLowerCase()}...`,
        "Registrar las opiniones del grupo en la pizarra.",
      ],
      [
        "Organizar una discusión grupal sobre lo leído u observado.",
        "Indagar sobre las razones del autor para elegir esas palabras o estructura.",
        "Comparar diferentes interpretaciones de los estudiantes.",
        "Relacionar el texto con experiencias personales.",
      ],
      [
        "Solicitar que expresen con sus propias palabras lo comprendido.",
        "Analizar colectivamente la estructura del texto presentado.",
        "Formular preguntas: ¿Qué recursos lingüísticos identifican?",
        "Guiar hacia la comprensión profunda del contenido.",
      ],
    ];
    return opciones[v % opciones.length];
  },
  conceptualizacion: (d, v) => {
    const desc = d.descripcion;
    const opciones: string[][] = [
      [
        `Presentar el contenido de forma estructurada: ${desc}`,
        "Realizar lectura compartida del texto seleccionado.",
        "Guiar el análisis del contenido, estructura y recursos del texto.",
        "Modelar la producción textual o actividad comunicativa.",
        "Formalizar las reglas o conceptos lingüísticos en el cuaderno.",
      ],
      [
        `Introducir el tema mediante ejemplos contextualizados: ${desc}`,
        "Analizar colectivamente un texto modelo identificando sus características.",
        "Trabajar en el texto del estudiante: ejercicios de comprensión.",
        "Explicar las reglas gramaticales o literarias aplicables.",
        "Elaborar un organizador gráfico con los conceptos clave.",
      ],
      [
        `Explicar la estructura y características del tipo textual: ${desc}`,
        "Presentar ejemplos variados del tipo textual estudiado.",
        "Identificar colectivamente los elementos constitutivos.",
        "Guiar la construcción de un texto modelo en la pizarra.",
        "Sintetizar las características en un cuadro comparativo.",
      ],
    ];
    return opciones[v % opciones.length];
  },
  aplicacion: (d, v) => {
    const opciones: string[][] = [
      [
        "Asignar producción individual o en parejas del tipo textual estudiado.",
        "Organizar revisión entre pares y corrección colaborativa.",
        "Socializar las producciones más destacadas.",
        "Formular preguntas de retroalimentación: ¿Qué aprendimos hoy?",
        "Asignar tarea de escritura creativa para la casa.",
      ],
      [
        "Solicitar la producción de un texto siguiendo el modelo estudiado.",
        "Guiar la revisión y edición del texto producido.",
        "Organizar la lectura en voz alta de las producciones.",
        "Promover la coevaluación respetuosa entre compañeros.",
        "Asignar lectura complementaria para la casa.",
      ],
      [
        "Proponer un ejercicio de producción textual contextualizado.",
        "Acompañar el proceso de escritura individualmente.",
        "Organizar una exposición oral de las producciones.",
        "Realizar autoevaluación del proceso de escritura.",
        "Asignar tarea de extensión relacionada con el tema.",
      ],
    ];
    return opciones[v % opciones.length];
  },
  recursos: (d, v) => {
    const base = ["Texto del estudiante", "Cuaderno de trabajo", "Pizarra y marcadores"];
    const extras: string[][] = [
      ["Láminas didácticas", "Diccionario escolar"],
      ["Textos literarios seleccionados", "Papelotes y marcadores de colores"],
      ["Material audiovisual", "Fichas de lectura y escritura"],
    ];
    return [...base, ...extras[v % extras.length]];
  },
};

const PLANTILLAS_CN: PlantillaActividades = {
  experiencia: (d, v) => {
    const desc = d.descripcion;
    const opciones: string[][] = [
      [
        `Presentar un fenómeno natural o situación relacionada con: ${desc}`,
        "Explorar conocimientos previos: ¿Qué saben sobre este tema?",
        "Realizar una observación directa o experimento introductorio.",
        "Presentar el objetivo de investigación de la clase.",
      ],
      [
        `Plantear una pregunta de investigación: ¿Por qué ocurre...? vinculada con: ${desc}`,
        "Solicitar hipótesis iniciales de los estudiantes.",
        "Registrar las predicciones en la pizarra.",
        "Compartir el objetivo de aprendizaje.",
      ],
      [
        `Mostrar un video o imágenes de un fenómeno relacionado con: ${desc}`,
        "Formular preguntas de observación: ¿Qué observan? ¿Qué creen que pasará?",
        "Conectar con experiencias cotidianas de los estudiantes.",
        "Anunciar el tema y la metodología de la clase.",
      ],
    ];
    return opciones[v % opciones.length];
  },
  reflexion: (d, v) => {
    const desc = d.descripcion;
    const opciones: string[][] = [
      [
        "Formular preguntas de análisis: ¿Qué observaron? ¿Coincide con sus predicciones?",
        "Solicitar que comparen sus hipótesis con los resultados observados.",
        `Guiar la discusión sobre las causas del fenómeno: ${desc.substring(0, 50).toLowerCase()}...`,
        "Registrar las conclusiones preliminares del grupo.",
      ],
      [
        "Organizar una discusión grupal sobre los resultados del experimento.",
        "Indagar sobre las posibles causas del fenómeno observado.",
        "Comparar diferentes explicaciones propuestas por los estudiantes.",
        "Identificar las variables que influyeron en el resultado.",
      ],
      [
        "Solicitar que describan con sus propias palabras lo observado.",
        "Analizar colectivamente los datos recopilados.",
        "Formular preguntas: ¿Qué relación existe entre las variables?",
        "Guiar hacia la formulación de explicaciones científicas.",
      ],
    ];
    return opciones[v % opciones.length];
  },
  conceptualizacion: (d, v) => {
    const desc = d.descripcion;
    const opciones: string[][] = [
      [
        `Explicar el concepto científico central: ${desc}`,
        "Utilizar modelos, diagramas o esquemas para representar el concepto.",
        "Realizar una demostración o experimento guiado.",
        "Trabajar en el texto del estudiante: analizar información científica.",
        "Formalizar los conceptos en el cuaderno con organizadores gráficos.",
      ],
      [
        `Presentar la teoría científica relacionada: ${desc}`,
        "Guiar la lectura comprensiva del texto científico.",
        "Explicar los procesos y relaciones causa-efecto.",
        "Solicitar que elaboren un resumen o mapa conceptual.",
        "Resolver ejercicios de aplicación del concepto.",
      ],
      [
        `Introducir el contenido de forma estructurada: ${desc}`,
        "Utilizar recursos audiovisuales para complementar la explicación.",
        "Modelar el procedimiento científico paso a paso.",
        "Guiar la elaboración de un informe de observación.",
        "Sintetizar los aprendizajes en un cuadro sinóptico.",
      ],
    ];
    return opciones[v % opciones.length];
  },
  aplicacion: (d, v) => {
    const opciones: string[][] = [
      [
        "Asignar un experimento práctico o actividad de laboratorio.",
        "Solicitar la elaboración de un informe de resultados.",
        "Socializar los hallazgos y conclusiones.",
        "Formular preguntas de retroalimentación: ¿Cómo se aplica esto en la vida diaria?",
        "Asignar investigación complementaria para la casa.",
      ],
      [
        "Proponer un problema ambiental o científico para resolver en equipos.",
        "Guiar la aplicación del método científico al problema planteado.",
        "Organizar la presentación de soluciones por equipos.",
        "Promover la reflexión sobre el impacto en el entorno.",
        "Asignar proyecto de investigación para la próxima clase.",
      ],
      [
        "Asignar ejercicios de aplicación del concepto estudiado.",
        "Organizar una actividad práctica de campo o laboratorio.",
        "Solicitar que relacionen lo aprendido con su entorno.",
        "Realizar autoevaluación del aprendizaje.",
        "Asignar tarea de extensión con enfoque investigativo.",
      ],
    ];
    return opciones[v % opciones.length];
  },
  recursos: (d, v) => {
    const base = ["Texto del estudiante", "Cuaderno de trabajo", "Pizarra y marcadores"];
    const extras: string[][] = [
      ["Material de laboratorio", "Láminas didácticas", "Muestras naturales"],
      ["Microscopio (si está disponible)", "Material audiovisual", "Fichas de observación"],
      ["Material del entorno natural", "Guías de experimentación", "Recursos tecnológicos"],
    ];
    return [...base, ...extras[v % extras.length]];
  },
};

const PLANTILLAS_CS: PlantillaActividades = {
  experiencia: (d, v) => {
    const desc = d.descripcion;
    const opciones: string[][] = [
      [
        `Presentar una situación histórica o social relacionada con: ${desc}`,
        "Explorar conocimientos previos: ¿Qué saben sobre este tema?",
        "Realizar una lluvia de ideas y registrar en la pizarra.",
        "Presentar el objetivo de aprendizaje de la clase.",
      ],
      [
        `Narrar un relato histórico o presentar un caso vinculado con: ${desc}`,
        "Solicitar opiniones iniciales de los estudiantes.",
        "Ubicar el tema en el tiempo y el espacio (línea de tiempo, mapa).",
        "Compartir el objetivo de la clase.",
      ],
      [
        `Mostrar imágenes históricas o un video documental sobre: ${desc}`,
        "Formular preguntas generadoras sobre lo observado.",
        "Conectar con la realidad ecuatoriana actual.",
        "Anunciar el tema y la metodología de trabajo.",
      ],
    ];
    return opciones[v % opciones.length];
  },
  reflexion: (d, v) => {
    const desc = d.descripcion;
    const opciones: string[][] = [
      [
        "Formular preguntas de análisis: ¿Por qué ocurrieron estos hechos?",
        "Solicitar que identifiquen causas y consecuencias.",
        `Guiar la discusión sobre la relevancia actual de: ${desc.substring(0, 50).toLowerCase()}...`,
        "Registrar las reflexiones del grupo en la pizarra.",
      ],
      [
        "Organizar un debate guiado sobre el tema presentado.",
        "Plantear escenarios hipotéticos para desarrollar el pensamiento contrafactual.",
        "Comparar diferentes perspectivas sobre el hecho histórico o social.",
        "Relacionar con valores ciudadanos y derechos humanos.",
      ],
      [
        "Solicitar que expresen su opinión fundamentada sobre el tema.",
        "Analizar colectivamente las fuentes históricas presentadas.",
        "Formular preguntas: ¿Cómo afecta esto a nuestra comunidad?",
        "Guiar hacia la comprensión de las relaciones causa-efecto.",
      ],
    ];
    return opciones[v % opciones.length];
  },
  conceptualizacion: (d, v) => {
    const desc = d.descripcion;
    const opciones: string[][] = [
      [
        `Explicar el contenido de forma estructurada: ${desc}`,
        "Utilizar líneas de tiempo, mapas o esquemas para contextualizar.",
        "Guiar la lectura comprensiva del texto del estudiante.",
        "Analizar fuentes históricas primarias y secundarias.",
        "Formalizar los conceptos clave en el cuaderno.",
      ],
      [
        `Presentar el tema histórico o social: ${desc}`,
        "Organizar trabajo en equipos: analizar diferentes aspectos del tema.",
        "Guiar la elaboración de un organizador gráfico colectivo.",
        "Explicar las relaciones entre los hechos estudiados.",
        "Sintetizar los aprendizajes en un cuadro comparativo.",
      ],
      [
        `Introducir el contenido mediante análisis de documentos: ${desc}`,
        "Explicar el contexto histórico, geográfico y social.",
        "Solicitar la identificación de personajes y hechos clave.",
        "Guiar la construcción de una línea de tiempo o mapa conceptual.",
        "Formalizar las conclusiones en el cuaderno de trabajo.",
      ],
    ];
    return opciones[v % opciones.length];
  },
  aplicacion: (d, v) => {
    const opciones: string[][] = [
      [
        "Asignar trabajo en equipos: elaborar un producto (afiche, exposición, dramatización).",
        "Organizar la presentación de los productos por equipos.",
        "Formular preguntas de retroalimentación: ¿Qué aprendimos? ¿Para qué nos sirve?",
        "Promover la reflexión ciudadana y la identidad nacional.",
        "Asignar investigación complementaria para la casa.",
      ],
      [
        "Proponer un estudio de caso o problema social para analizar.",
        "Solicitar la elaboración de propuestas o soluciones.",
        "Organizar un debate o mesa redonda sobre el tema.",
        "Promover la participación ciudadana y el pensamiento crítico.",
        "Asignar tarea de extensión con enfoque investigativo.",
      ],
      [
        "Asignar ejercicios de aplicación del contenido estudiado.",
        "Organizar una actividad de simulación o juego de roles.",
        "Solicitar que relacionen lo aprendido con su comunidad.",
        "Realizar autoevaluación del aprendizaje.",
        "Asignar proyecto de investigación local.",
      ],
    ];
    return opciones[v % opciones.length];
  },
  recursos: (d, v) => {
    const base = ["Texto del estudiante", "Cuaderno de trabajo", "Pizarra y marcadores"];
    const extras: string[][] = [
      ["Fuentes históricas (documentos, imágenes)", "Mapas y atlas", "Líneas de tiempo"],
      ["Material audiovisual (documentales)", "Papelotes y marcadores", "Fichas de trabajo"],
      ["Recursos tecnológicos", "Material cartográfico", "Periódicos y revistas"],
    ];
    return [...base, ...extras[v % extras.length]];
  },
};

const PLANTILLAS_EF: PlantillaActividades = {
  experiencia: (d, v) => {
    const desc = d.descripcion;
    const opciones: string[][] = [
      [
        "Realizar calentamiento general con ejercicios de movilidad articular.",
        `Presentar la actividad del día: ${desc}`,
        "Demostrar brevemente los movimientos o técnicas a trabajar.",
        "Verificar el espacio y materiales necesarios.",
      ],
      [
        "Realizar calentamiento específico para la actividad.",
        "Explorar conocimientos previos: ¿Han practicado algo similar?",
        `Presentar el reto de la clase: ${desc}`,
        "Establecer las reglas y normas de seguridad.",
      ],
      [
        "Dirigir calentamiento lúdico con juego de activación.",
        `Introducir la actividad mediante una demostración: ${desc}`,
        "Solicitar que los estudiantes imiten los movimientos básicos.",
        "Presentar el objetivo de la sesión.",
      ],
    ];
    return opciones[v % opciones.length];
  },
  reflexion: (d, v) => {
    const opciones: string[][] = [
      [
        "Formular preguntas: ¿Qué dificultades encontraron en los movimientos?",
        "Solicitar que identifiquen qué músculos o habilidades están trabajando.",
        "Comparar diferentes formas de ejecutar el movimiento.",
        "Guiar la discusión sobre la importancia de la técnica correcta.",
      ],
      [
        "Indagar sobre las sensaciones experimentadas durante el calentamiento.",
        "Solicitar que describan los movimientos realizados.",
        "Analizar colectivamente las dificultades encontradas.",
        "Relacionar la actividad con la salud y el bienestar.",
      ],
      [
        "Organizar una breve discusión: ¿Qué estrategias usaron?",
        "Solicitar que evalúen su propio desempeño inicial.",
        "Identificar aspectos a mejorar en la ejecución.",
        "Conectar la actividad con hábitos de vida saludable.",
      ],
    ];
    return opciones[v % opciones.length];
  },
  conceptualizacion: (d, v) => {
    const desc = d.descripcion;
    const opciones: string[][] = [
      [
        `Demostrar la actividad paso a paso: ${desc}`,
        "Organizar práctica guiada en grupos pequeños.",
        "Supervisar la ejecución y corregir posturas/técnicas.",
        "Aumentar progresivamente la complejidad.",
        "Proponer variantes del ejercicio para diferentes niveles.",
      ],
      [
        `Introducir la actividad mediante juego pre-deportivo: ${desc}`,
        "Explicar las reglas y técnicas fundamentales.",
        "Organizar práctica por estaciones.",
        "Rotar los grupos cada 5 minutos.",
        "Supervisar y corregir individualmente.",
      ],
      [
        `Presentar la secuencia de movimientos: ${desc}`,
        "Practicar en parejas con retroalimentación mutua.",
        "Organizar circuito de ejercicios relacionados.",
        "Guiar la ejecución con correcciones grupales.",
        "Proponer variantes creativas de la actividad.",
      ],
    ];
    return opciones[v % opciones.length];
  },
  aplicacion: (d, v) => {
    const opciones: string[][] = [
      [
        "Organizar juego o actividad competitiva aplicando lo aprendido.",
        "Permitir práctica libre supervisada.",
        "Dirigir vuelta a la calma con estiramientos.",
        "Formular preguntas de retroalimentación: ¿Qué aprendimos? ¿Qué fue más difícil?",
        "Asignar práctica para realizar en casa.",
      ],
      [
        "Proponer un desafío grupal integrador.",
        "Realizar actividad lúdica de cierre activo.",
        "Realizar ejercicios de relajación y respiración.",
        "Socializar experiencias: ¿Cómo se sintieron?",
        "Recordar normas de higiene post-ejercicio.",
      ],
      [
        "Organizar mini-competencia amistosa.",
        "Permitir exploración libre del movimiento.",
        "Dirigir estiramientos específicos de los músculos trabajados.",
        "Realizar autoevaluación: ¿Mejoré respecto a la clase anterior?",
        "Promover hábitos de vida saludable.",
      ],
    ];
    return opciones[v % opciones.length];
  },
  recursos: (d, v) => {
    const base = ["Espacio abierto o cancha", "Silbato", "Cronómetro"];
    const extras: string[][] = [
      ["Balones", "Conos", "Aros"],
      ["Cuerdas", "Colchonetas", "Bastones"],
      ["Material reciclado", "Pañuelos", "Cintas"],
    ];
    return [...base, ...extras[v % extras.length]];
  },
};

const PLANTILLAS_ECA: PlantillaActividades = {
  experiencia: (d, v) => {
    const desc = d.descripcion;
    const opciones: string[][] = [
      [
        `Presentar obras artísticas relacionadas con: ${desc}`,
        "Explorar conocimientos previos y sensibilizar sobre el tema.",
        "Formular preguntas: ¿Qué sienten? ¿Qué les transmite?",
        "Presentar el objetivo creativo de la clase.",
      ],
      [
        `Realizar una dinámica de sensibilización: ${desc}`,
        "Explorar materiales y técnicas disponibles.",
        "Compartir experiencias artísticas previas.",
        "Anunciar el proyecto creativo de la sesión.",
      ],
      [
        `Mostrar ejemplos de producciones artísticas vinculadas con: ${desc}`,
        "Solicitar observaciones y opiniones.",
        "Conectar con la cultura y tradiciones ecuatorianas.",
        "Presentar el reto artístico de la clase.",
      ],
    ];
    return opciones[v % opciones.length];
  },
  reflexion: (d, v) => {
    const opciones: string[][] = [
      [
        "Formular preguntas: ¿Qué les transmitieron las obras observadas?",
        "Solicitar que identifiquen elementos artísticos (color, forma, ritmo).",
        "Comparar diferentes interpretaciones de los estudiantes.",
        "Guiar la discusión sobre el mensaje artístico.",
      ],
      [
        "Organizar una discusión sobre las emociones generadas.",
        "Indagar sobre las técnicas que los estudiantes creen que usó el artista.",
        "Relacionar las obras con la cultura ecuatoriana.",
        "Identificar los elementos expresivos más destacados.",
      ],
      [
        "Solicitar que expresen con sus propias palabras lo que percibieron.",
        "Analizar colectivamente los elementos artísticos presentes.",
        "Formular preguntas: ¿Cómo se relaciona con nuestra identidad cultural?",
        "Guiar hacia la apreciación estética fundamentada.",
      ],
    ];
    return opciones[v % opciones.length];
  },
  conceptualizacion: (d, v) => {
    const desc = d.descripcion;
    const opciones: string[][] = [
      [
        `Explicar la técnica artística a trabajar: ${desc}`,
        "Realizar una demostración paso a paso.",
        "Permitir la exploración libre de materiales.",
        "Guiar la creación artística individual o colectiva.",
        "Acompañar el proceso creativo individualmente.",
      ],
      [
        `Introducir el tema artístico mediante experimentación: ${desc}`,
        "Organizar trabajo por estaciones creativas.",
        "Guiar la exploración de diferentes técnicas.",
        "Solicitar la creación de una obra personal.",
        "Fomentar la expresión libre y la originalidad.",
      ],
      [
        `Presentar el proyecto artístico: ${desc}`,
        "Distribuir materiales y organizar espacios de trabajo.",
        "Modelar la técnica principal.",
        "Asignar trabajo creativo individual.",
        "Recorrer el aula para orientar y motivar.",
      ],
    ];
    return opciones[v % opciones.length];
  },
  aplicacion: (d, v) => {
    const opciones: string[][] = [
      [
        "Organizar la presentación y exposición de trabajos.",
        "Formular preguntas de retroalimentación: ¿Qué quisieron expresar?",
        "Promover la autoevaluación del proceso creativo.",
        "Valorar la diversidad de expresiones artísticas.",
        "Asignar tarea creativa para la casa.",
      ],
      [
        "Realizar una galería de arte con las producciones.",
        "Solicitar que cada estudiante explique su obra.",
        "Organizar coevaluación respetuosa entre compañeros.",
        "Reflexionar sobre el proceso creativo vivido.",
        "Motivar la práctica artística cotidiana.",
      ],
      [
        "Presentar las obras al grupo con una breve explicación.",
        "Destacar los elementos más creativos de cada trabajo.",
        "Formular preguntas de cierre: ¿Qué descubrieron sobre sí mismos?",
        "Conectar la experiencia con la cultura ecuatoriana.",
        "Asignar proyecto artístico de extensión.",
      ],
    ];
    return opciones[v % opciones.length];
  },
  recursos: (d, v) => {
    const base = ["Materiales artísticos variados"];
    const extras: string[][] = [
      ["Papel, cartulina, tijeras, goma", "Pinturas y pinceles", "Material reciclado"],
      ["Instrumentos musicales", "Telas y materiales textiles", "Elementos naturales"],
      ["Material audiovisual", "Arcilla o plastilina", "Materiales del entorno"],
    ];
    return [...base, ...extras[v % extras.length]];
  },
};

const PLANTILLAS_POR_AREA: Record<Area, PlantillaActividades> = {
  M: PLANTILLAS_MATEMATICA,
  LL: PLANTILLAS_LENGUA,
  CN: PLANTILLAS_CN,
  CS: PLANTILLAS_CS,
  EF: PLANTILLAS_EF,
  ECA: PLANTILLAS_ECA,
};

// ============================================================
// GENERACIÓN DE EVALUACIÓN FORMATIVA
// ============================================================

function generarEvaluacion(destreza: Destreza, variante: number): string {
  const indicador = destreza.indicadoresEvaluacion[0] || "Demuestra comprensión del contenido trabajado.";
  const criterio = destreza.criteriosEvaluacion[0] || "";

  const instrumentos: string[][] = [
    [
      `Lista de cotejo con los siguientes indicadores:`,
      `- ${indicador}`,
      `- Participa activamente en las actividades propuestas.`,
      `- Aplica lo aprendido en ejercicios prácticos.`,
    ],
    [
      `Rúbrica de evaluación. Criterio principal: ${criterio || indicador}`,
      `Niveles: Domina (9-10) / Alcanza (7-8) / Está próximo (5-6) / No alcanza (< 5).`,
      `Se evalúa: comprensión, aplicación y participación.`,
    ],
    [
      `Observación directa y revisión de productos.`,
      `Criterio: ${indicador}`,
      `Técnica: Preguntas orales de retroalimentación durante y después de la clase.`,
      `Instrumento: Registro anecdótico.`,
    ],
  ];

  return instrumentos[variante % instrumentos.length].join("\n");
}

// ============================================================
// FUNCIÓN PRINCIPAL
// ============================================================

export function obtenerTemasSugeridos(destreza: Destreza): TemaSugerido[] {
  const plantilla = PLANTILLAS_POR_AREA[destreza.area];
  const areaInfo = AREAS_INFO[destreza.area];
  const bloque = areaInfo.bloques[destreza.bloque] || `Bloque ${destreza.bloque}`;
  const hash = hashString(destreza.codigo);

  const temas: TemaSugerido[] = [];

  for (let variante = 0; variante < 3; variante++) {
    const v = (hash + variante) % 3;

    const titulo = generarTituloTema(destreza, variante);
    const descripcionBreve = generarDescripcionBreve(destreza, variante, bloque);

    temas.push({
      id: generarId(),
      titulo,
      descripcionBreve,
      objetivoClase: destreza.objetivos[0] || destreza.descripcion,
      estructura: {
        experiencia: {
          titulo: "Experiencia",
          duracion: "10 minutos",
          actividades: plantilla.experiencia(destreza, v),
        },
        reflexion: {
          titulo: "Reflexión",
          duracion: "10 minutos",
          actividades: plantilla.reflexion(destreza, v),
        },
        conceptualizacion: {
          titulo: "Conceptualización",
          duracion: "15 minutos",
          actividades: plantilla.conceptualizacion(destreza, v),
        },
        aplicacion: {
          titulo: "Aplicación",
          duracion: "10 minutos",
          actividades: plantilla.aplicacion(destreza, v),
        },
      },
      recursos: plantilla.recursos(destreza, v),
      evaluacionFormativa: generarEvaluacion(destreza, v),
    });
  }

  return temas;
}

function generarDescripcionBreve(destreza: Destreza, variante: number, bloque: string): string {
  const desc = destreza.descripcion;
  const corta = desc.length > 80 ? desc.substring(0, 77) + "..." : desc;

  const plantillas = [
    `Clase enfocada en: ${corta}`,
    `Taller práctico y colaborativo sobre: ${corta}`,
    `Proyecto creativo aplicado a: ${corta}`,
  ];

  return plantillas[variante % plantillas.length];
}
