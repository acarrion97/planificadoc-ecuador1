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

// ============================================================
// PLANTILLAS BACHILLERATO: BIOLOGÍA
// ============================================================

const PLANTILLAS_BIOLOGIA: PlantillaActividades = {
  experiencia: (d, v) => {
    const desc = d.descripcion;
    const opciones: string[][] = [
      [
        `Presentar un caso de estudio o fenómeno biológico relacionado con: ${desc}`,
        "Explorar conocimientos previos mediante preguntas generadoras.",
        "Observar muestras, imágenes o videos introductorios del tema.",
        "Presentar el objetivo de aprendizaje y la metodología de la clase.",
      ],
      [
        `Plantear un problema científico vinculado con: ${desc}`,
        "Solicitar hipótesis iniciales a los estudiantes y registrarlas.",
        "Relacionar el tema con la biodiversidad ecuatoriana (Galápagos, Amazonía, páramos).",
        "Compartir el objetivo de investigación de la clase.",
      ],
      [
        `Mostrar un documental corto o animación sobre: ${desc}`,
        "Formular preguntas de observación: \u00bfQué procesos biológicos identifican?",
        "Conectar con experiencias previas de los estudiantes sobre el tema.",
        "Anunciar el tema y la práctica de laboratorio planificada.",
      ],
    ];
    return opciones[v % opciones.length];
  },
  reflexion: (d, v) => {
    const desc = d.descripcion;
    const opciones: string[][] = [
      [
        "Formular preguntas de análisis: \u00bfQué relación existe entre estructura y función?",
        "Solicitar que comparen sus hipótesis con la evidencia observada.",
        `Guiar la discusión sobre las implicaciones de: ${desc.substring(0, 60).toLowerCase()}...`,
        "Registrar las conclusiones preliminares en la pizarra.",
      ],
      [
        "Organizar una discusión grupal sobre los resultados de la observación.",
        "Analizar las relaciones causa-efecto en los procesos biológicos estudiados.",
        "Comparar diferentes explicaciones propuestas por los estudiantes.",
        "Identificar las variables que influyen en el fenómeno biológico.",
      ],
      [
        "Solicitar que describan con sus propias palabras los procesos observados.",
        "Analizar colectivamente los datos recopilados en la observación.",
        "Formular preguntas: \u00bfCómo se relaciona esto con la evolución y la adaptación?",
        "Guiar hacia la formulación de explicaciones científicas fundamentadas.",
      ],
    ];
    return opciones[v % opciones.length];
  },
  conceptualizacion: (d, v) => {
    const desc = d.descripcion;
    const opciones: string[][] = [
      [
        `Explicar el concepto biológico central: ${desc}`,
        "Utilizar modelos celulares, diagramas de ADN o esquemas de ecosistemas.",
        "Realizar una práctica de laboratorio guiada (observación microscópica, disecciones, etc.).",
        "Trabajar en el texto del estudiante: analizar información científica.",
        "Formalizar los conceptos con organizadores gráficos en el cuaderno.",
      ],
      [
        `Presentar la teoría biológica relacionada: ${desc}`,
        "Guiar la lectura comprensiva de artículos científicos adaptados.",
        "Explicar los procesos moleculares, celulares o ecológicos involucrados.",
        "Solicitar que elaboren un mapa conceptual del tema.",
        "Resolver ejercicios de aplicación del concepto biológico.",
      ],
      [
        `Introducir el contenido de forma estructurada: ${desc}`,
        "Utilizar animaciones y simulaciones para visualizar procesos biológicos.",
        "Modelar el análisis de datos experimentales paso a paso.",
        "Guiar la elaboración de un informe de laboratorio.",
        "Sintetizar los aprendizajes en un cuadro comparativo.",
      ],
    ];
    return opciones[v % opciones.length];
  },
  aplicacion: (d, v) => {
    const opciones: string[][] = [
      [
        "Asignar una práctica de laboratorio o actividad experimental.",
        "Solicitar la elaboración de un informe científico con resultados.",
        "Socializar los hallazgos y conclusiones por equipos.",
        "Formular preguntas: \u00bfCómo se aplica esto en medicina, agricultura o conservación?",
        "Asignar investigación sobre biodiversidad ecuatoriana para la próxima clase.",
      ],
      [
        "Proponer un problema ambiental o de salud para resolver en equipos.",
        "Guiar la aplicación del método científico al problema planteado.",
        "Organizar la presentación de soluciones con fundamento biológico.",
        "Promover la reflexión sobre bioética y conservación.",
        "Asignar proyecto de investigación para la próxima clase.",
      ],
      [
        "Asignar ejercicios de aplicación del concepto biológico estudiado.",
        "Organizar una actividad práctica de campo o laboratorio.",
        "Solicitar que relacionen lo aprendido con ecosistemas ecuatorianos.",
        "Realizar autoevaluación del aprendizaje con rúbrica.",
        "Asignar tarea de extensión con enfoque investigativo.",
      ],
    ];
    return opciones[v % opciones.length];
  },
  recursos: (d, v) => {
    const base = ["Texto del estudiante", "Cuaderno de trabajo", "Pizarra y marcadores"];
    const extras: string[][] = [
      ["Microscopio y portaobjetos", "Muestras biológicas", "Láminas didácticas"],
      ["Modelos celulares y anatómicos", "Material audiovisual", "Guías de laboratorio"],
      ["Material del entorno natural", "Simulaciones digitales", "Artículos científicos"],
    ];
    return [...base, ...extras[v % extras.length]];
  },
};

// ============================================================
// PLANTILLAS BACHILLERATO: QUÍMICA
// ============================================================

const PLANTILLAS_QUIMICA: PlantillaActividades = {
  experiencia: (d, v) => {
    const desc = d.descripcion;
    const opciones: string[][] = [
      [
        `Presentar un fenómeno químico cotidiano relacionado con: ${desc}`,
        "Explorar conocimientos previos sobre la materia y sus transformaciones.",
        "Realizar una demostración química introductoria segura.",
        "Presentar el objetivo de aprendizaje y las normas de seguridad.",
      ],
      [
        `Plantear un problema químico vinculado con: ${desc}`,
        "Solicitar predicciones sobre lo que sucederá en el experimento.",
        "Relacionar el tema con aplicaciones industriales o ambientales del Ecuador.",
        "Compartir el objetivo de la práctica de laboratorio.",
      ],
      [
        `Mostrar un video de reacciones químicas o procesos industriales sobre: ${desc}`,
        "Formular preguntas: \u00bfQué cambios observan? \u00bfEs un cambio físico o químico?",
        "Conectar con productos químicos de uso cotidiano.",
        "Anunciar el tema y la metodología experimental.",
      ],
    ];
    return opciones[v % opciones.length];
  },
  reflexion: (d, v) => {
    const desc = d.descripcion;
    const opciones: string[][] = [
      [
        "Formular preguntas de análisis: \u00bfQué evidencias de reacción química observaron?",
        "Solicitar que comparen sus predicciones con los resultados experimentales.",
        `Guiar la discusión sobre los principios químicos de: ${desc.substring(0, 60).toLowerCase()}...`,
        "Registrar las observaciones y conclusiones en la pizarra.",
      ],
      [
        "Organizar una discusión sobre los resultados del experimento.",
        "Analizar las relaciones entre reactivos, productos y condiciones.",
        "Comparar diferentes interpretaciones de los datos experimentales.",
        "Identificar las variables que afectaron el resultado.",
      ],
      [
        "Solicitar que expliquen a nivel molecular lo observado.",
        "Analizar colectivamente los datos cuantitativos obtenidos.",
        "Formular preguntas: \u00bfCómo se conserva la materia en esta reacción?",
        "Guiar hacia la formulación de ecuaciones químicas.",
      ],
    ];
    return opciones[v % opciones.length];
  },
  conceptualizacion: (d, v) => {
    const desc = d.descripcion;
    const opciones: string[][] = [
      [
        `Explicar el concepto químico central: ${desc}`,
        "Utilizar modelos moleculares y la tabla periódica para representar el concepto.",
        "Realizar cálculos estequiométricos guiados paso a paso.",
        "Trabajar en el texto del estudiante: analizar ecuaciones y reacciones.",
        "Formalizar los conceptos con esquemas y fórmulas en el cuaderno.",
      ],
      [
        `Presentar la teoría química relacionada: ${desc}`,
        "Guiar el uso de la tabla periódica para predecir propiedades.",
        "Explicar los tipos de enlaces y reacciones involucradas.",
        "Solicitar que balanceen ecuaciones químicas.",
        "Resolver problemas de estequiometría de complejidad creciente.",
      ],
      [
        `Introducir el contenido de forma estructurada: ${desc}`,
        "Utilizar simulaciones moleculares para visualizar estructuras.",
        "Modelar la resolución de problemas químicos paso a paso.",
        "Guiar la elaboración de un informe de laboratorio.",
        "Sintetizar los aprendizajes en un cuadro comparativo.",
      ],
    ];
    return opciones[v % opciones.length];
  },
  aplicacion: (d, v) => {
    const opciones: string[][] = [
      [
        "Asignar una práctica de laboratorio con medidas de seguridad.",
        "Solicitar la elaboración de un informe con cálculos y conclusiones.",
        "Socializar los resultados experimentales por equipos.",
        "Formular preguntas: \u00bfDónde se aplica esta química en la industria ecuatoriana?",
        "Asignar investigación sobre aplicaciones químicas para la próxima clase.",
      ],
      [
        "Proponer un problema ambiental (contaminación, tratamiento de aguas) para resolver.",
        "Guiar la aplicación de principios químicos al problema planteado.",
        "Organizar la presentación de soluciones con fundamento químico.",
        "Promover la reflexión sobre química verde y sostenibilidad.",
        "Asignar proyecto de investigación química para la próxima clase.",
      ],
      [
        "Asignar ejercicios de cálculo y balanceo de ecuaciones.",
        "Organizar un experimento práctico con materiales cotidianos.",
        "Solicitar que relacionen lo aprendido con la petroquímica ecuatoriana.",
        "Realizar autoevaluación del aprendizaje.",
        "Asignar tarea de extensión con enfoque experimental.",
      ],
    ];
    return opciones[v % opciones.length];
  },
  recursos: (d, v) => {
    const base = ["Texto del estudiante", "Cuaderno de trabajo", "Pizarra y marcadores"];
    const extras: string[][] = [
      ["Material de laboratorio", "Tabla periódica", "Reactivos seguros"],
      ["Modelos moleculares", "Material audiovisual", "Guías de laboratorio"],
      ["Simulaciones químicas digitales", "Materiales cotidianos", "Equipo de protección"],
    ];
    return [...base, ...extras[v % extras.length]];
  },
};

// ============================================================
// PLANTILLAS BACHILLERATO: FÍSICA
// ============================================================

const PLANTILLAS_FISICA: PlantillaActividades = {
  experiencia: (d, v) => {
    const desc = d.descripcion;
    const opciones: string[][] = [
      [
        `Presentar un fenómeno físico observable relacionado con: ${desc}`,
        "Explorar conocimientos previos sobre las leyes físicas involucradas.",
        "Realizar una demostración práctica con materiales sencillos.",
        "Presentar el objetivo de aprendizaje y las magnitudes a medir.",
      ],
      [
        `Plantear un desafío de ingeniería vinculado con: ${desc}`,
        "Solicitar predicciones basadas en la intuición física de los estudiantes.",
        "Relacionar el tema con tecnología y fenómenos naturales del Ecuador.",
        "Compartir el objetivo experimental de la clase.",
      ],
      [
        `Mostrar un video de experimentos físicos sobre: ${desc}`,
        "Formular preguntas: \u00bfQué fuerzas actúan? \u00bfQué magnitudes cambian?",
        "Conectar con situaciones cotidianas: transporte, deportes, construcción.",
        "Anunciar el tema y la práctica experimental planificada.",
      ],
    ];
    return opciones[v % opciones.length];
  },
  reflexion: (d, v) => {
    const desc = d.descripcion;
    const opciones: string[][] = [
      [
        "Formular preguntas de análisis: \u00bfQué variables influyeron en el resultado?",
        "Solicitar que comparen sus predicciones con las mediciones obtenidas.",
        `Guiar la discusión sobre los principios físicos de: ${desc.substring(0, 60).toLowerCase()}...`,
        "Registrar los datos experimentales y conclusiones en la pizarra.",
      ],
      [
        "Organizar una discusión sobre los datos experimentales obtenidos.",
        "Analizar las gráficas de movimiento, fuerza o energía generadas.",
        "Comparar diferentes métodos de medición utilizados por los equipos.",
        "Identificar fuentes de error experimental.",
      ],
      [
        "Solicitar que expresen matemáticamente las relaciones observadas.",
        "Analizar colectivamente los datos cuantitativos.",
        "Formular preguntas: \u00bfQué ley física explica este comportamiento?",
        "Guiar hacia la formulación de ecuaciones y modelos.",
      ],
    ];
    return opciones[v % opciones.length];
  },
  conceptualizacion: (d, v) => {
    const desc = d.descripcion;
    const opciones: string[][] = [
      [
        `Explicar el principio físico central: ${desc}`,
        "Utilizar diagramas de cuerpo libre, gráficas y esquemas de circuitos.",
        "Resolver problemas de física paso a paso en la pizarra.",
        "Trabajar en el texto del estudiante: analizar fórmulas y leyes.",
        "Formalizar las ecuaciones y unidades en el cuaderno.",
      ],
      [
        `Presentar la ley o principio físico: ${desc}`,
        "Guiar la deducción matemática de las ecuaciones involucradas.",
        "Explicar las unidades del SI y las conversiones necesarias.",
        "Solicitar que resuelvan ejercicios de complejidad creciente.",
        "Resolver problemas de aplicación con datos reales.",
      ],
      [
        `Introducir el contenido de forma estructurada: ${desc}`,
        "Utilizar simulaciones (PhET, GeoGebra) para visualizar fenómenos.",
        "Modelar la resolución de problemas con análisis dimensional.",
        "Guiar la elaboración de un informe de laboratorio.",
        "Sintetizar las leyes y fórmulas en un cuadro resumen.",
      ],
    ];
    return opciones[v % opciones.length];
  },
  aplicacion: (d, v) => {
    const opciones: string[][] = [
      [
        "Asignar problemas de física con aplicación al contexto real.",
        "Solicitar la elaboración de un informe experimental con gráficas.",
        "Socializar las soluciones y métodos utilizados.",
        "Formular preguntas: \u00bfDónde se aplica este principio en la ingeniería?",
        "Asignar investigación sobre energías renovables en Ecuador.",
      ],
      [
        "Proponer un desafío de ingeniería (puente, catapulta, circuito) para resolver.",
        "Guiar la aplicación de principios físicos al diseño.",
        "Organizar la presentación de prototipos por equipos.",
        "Promover la reflexión sobre tecnología y sostenibilidad.",
        "Asignar proyecto de física aplicada para la próxima clase.",
      ],
      [
        "Asignar ejercicios de cálculo con diferentes niveles de complejidad.",
        "Organizar un experimento práctico con materiales sencillos.",
        "Solicitar que relacionen lo aprendido con fenómenos naturales.",
        "Realizar autoevaluación del aprendizaje.",
        "Asignar tarea de extensión con enfoque experimental.",
      ],
    ];
    return opciones[v % opciones.length];
  },
  recursos: (d, v) => {
    const base = ["Texto del estudiante", "Cuaderno de trabajo", "Pizarra y marcadores"];
    const extras: string[][] = [
      ["Material de laboratorio (cronómetro, regla, dinamométro)", "Calculadora científica", "Formulario de física"],
      ["Simulaciones PhET", "Material audiovisual", "Guías de laboratorio"],
      ["Materiales para prototipos", "Sensores y medidores", "Recursos tecnológicos"],
    ];
    return [...base, ...extras[v % extras.length]];
  },
};

// ============================================================
// PLANTILLAS BACHILLERATO: HISTORIA
// ============================================================

const PLANTILLAS_HISTORIA: PlantillaActividades = {
  experiencia: (d, v) => {
    const desc = d.descripcion;
    const opciones: string[][] = [
      [
        `Presentar una fuente histórica (documento, imagen, mapa) relacionada con: ${desc}`,
        "Explorar conocimientos previos: \u00bfQué saben sobre esta época o evento?",
        "Ubicar el tema en una línea de tiempo y mapa histórico.",
        "Presentar el objetivo de aprendizaje y las fuentes a analizar.",
      ],
      [
        `Narrar un relato histórico o presentar un testimonio sobre: ${desc}`,
        "Solicitar opiniones iniciales y contextualización temporal.",
        "Relacionar el tema con la historia del Ecuador y América Latina.",
        "Compartir el objetivo de análisis histórico de la clase.",
      ],
      [
        `Mostrar un documental o recreación histórica sobre: ${desc}`,
        "Formular preguntas generadoras: \u00bfPor qué es importante estudiar esto?",
        "Conectar con la realidad socioeconómica actual del Ecuador.",
        "Anunciar el tema y la metodología de análisis histórico.",
      ],
    ];
    return opciones[v % opciones.length];
  },
  reflexion: (d, v) => {
    const desc = d.descripcion;
    const opciones: string[][] = [
      [
        "Formular preguntas de análisis: \u00bfCuáles fueron las causas y consecuencias?",
        "Solicitar que identifiquen múltiples perspectivas sobre el hecho histórico.",
        `Guiar la discusión sobre la relevancia actual de: ${desc.substring(0, 60).toLowerCase()}...`,
        "Registrar las reflexiones críticas del grupo.",
      ],
      [
        "Organizar un debate histórico con posiciones fundamentadas.",
        "Plantear escenarios contrafactuales para desarrollar el pensamiento crítico.",
        "Comparar fuentes primarias y secundarias sobre el mismo evento.",
        "Relacionar con valores democráticos y derechos humanos.",
      ],
      [
        "Solicitar que expresen su opinión fundamentada con evidencia histórica.",
        "Analizar críticamente las fuentes presentadas: \u00bfQuién las escribió? \u00bfCon qué intención?",
        "Formular preguntas: \u00bfCómo afectó esto a la sociedad ecuatoriana?",
        "Guiar hacia la comprensión de procesos históricos de larga duración.",
      ],
    ];
    return opciones[v % opciones.length];
  },
  conceptualizacion: (d, v) => {
    const desc = d.descripcion;
    const opciones: string[][] = [
      [
        `Explicar el proceso histórico central: ${desc}`,
        "Utilizar líneas de tiempo, mapas y esquemas para contextualizar.",
        "Analizar fuentes primarias y secundarias de forma guiada.",
        "Trabajar en el texto del estudiante: lectura crítica de fuentes.",
        "Formalizar los conceptos con un organizador gráfico en el cuaderno.",
      ],
      [
        `Presentar el contexto histórico: ${desc}`,
        "Guiar el análisis comparativo de civilizaciones, épocas o procesos.",
        "Explicar las relaciones de causalidad y multicausalidad.",
        "Solicitar que elaboren una línea de tiempo comentada.",
        "Resolver ejercicios de análisis de fuentes históricas.",
      ],
      [
        `Introducir el contenido de forma estructurada: ${desc}`,
        "Utilizar recursos audiovisuales y cartografía histórica.",
        "Modelar el análisis crítico de un documento histórico.",
        "Guiar la elaboración de un ensayo histórico breve.",
        "Sintetizar los aprendizajes en un cuadro cronológico.",
      ],
    ];
    return opciones[v % opciones.length];
  },
  aplicacion: (d, v) => {
    const opciones: string[][] = [
      [
        "Asignar un análisis de fuentes históricas con guía de preguntas.",
        "Solicitar la elaboración de un ensayo histórico argumentativo.",
        "Socializar las conclusiones y perspectivas por equipos.",
        "Formular preguntas: \u00bfQué lecciones nos deja este proceso histórico?",
        "Asignar investigación sobre historia local para la próxima clase.",
      ],
      [
        "Proponer una dramatización o juego de roles histórico.",
        "Guiar la elaboración de una línea de tiempo ilustrada.",
        "Organizar la presentación de investigaciones por equipos.",
        "Promover la reflexión sobre identidad y memoria histórica.",
        "Asignar proyecto de historia oral para la próxima clase.",
      ],
      [
        "Asignar ejercicios de análisis comparativo de épocas.",
        "Organizar un debate sobre temas históricos controversiales.",
        "Solicitar que relacionen lo aprendido con la actualidad ecuatoriana.",
        "Realizar autoevaluación del aprendizaje.",
        "Asignar tarea de extensión con enfoque investigativo.",
      ],
    ];
    return opciones[v % opciones.length];
  },
  recursos: (d, v) => {
    const base = ["Texto del estudiante", "Cuaderno de trabajo", "Pizarra y marcadores"];
    const extras: string[][] = [
      ["Fuentes históricas primarias", "Mapas históricos", "Líneas de tiempo"],
      ["Documentales históricos", "Atlas geográfico", "Fichas de análisis"],
      ["Material audiovisual", "Fotografías históricas", "Recursos digitales"],
    ];
    return [...base, ...extras[v % extras.length]];
  },
};

// ============================================================
// PLANTILLAS BACHILLERATO: FILOSOFÍA
// ============================================================

const PLANTILLAS_FILOSOFIA: PlantillaActividades = {
  experiencia: (d, v) => {
    const desc = d.descripcion;
    const opciones: string[][] = [
      [
        `Presentar un dilema ético o situación filosófica relacionada con: ${desc}`,
        "Explorar opiniones previas: \u00bfQué piensan sobre esta cuestión?",
        "Realizar una lluvia de ideas filosóficas y registrarlas.",
        "Presentar el objetivo de reflexión filosófica de la clase.",
      ],
      [
        `Plantear una pregunta filosófica vinculada con: ${desc}`,
        "Solicitar respuestas espontáneas y argumentos iniciales.",
        "Relacionar el tema con situaciones cotidianas y sociales del Ecuador.",
        "Compartir el objetivo de la comunidad de indagación.",
      ],
      [
        `Mostrar un fragmento de texto filosófico o video sobre: ${desc}`,
        "Formular preguntas generadoras: \u00bfQué significa esto para ustedes?",
        "Conectar con experiencias personales y dilemas morales.",
        "Anunciar el tema y la metodología de diálogo filosófico.",
      ],
    ];
    return opciones[v % opciones.length];
  },
  reflexion: (d, v) => {
    const desc = d.descripcion;
    const opciones: string[][] = [
      [
        "Formular preguntas socráticas: \u00bfQué entendemos por...? \u00bfPor qué lo creemos?",
        "Solicitar que identifiquen supuestos y contradicciones en sus argumentos.",
        `Guiar la discusión filosófica sobre: ${desc.substring(0, 60).toLowerCase()}...`,
        "Registrar los argumentos y contraargumentos en la pizarra.",
      ],
      [
        "Organizar un diálogo socrático estructurado.",
        "Plantear objeciones y contraejemplos para profundizar el análisis.",
        "Comparar diferentes posiciones filosóficas sobre el tema.",
        "Relacionar con el pensamiento filosófico latinoamericano y el Sumak Kawsay.",
      ],
      [
        "Solicitar que formulen sus propias preguntas filosóficas.",
        "Analizar colectivamente la lógica de los argumentos presentados.",
        "Formular preguntas: \u00bfEs válido este razonamiento? \u00bfPor qué?",
        "Guiar hacia la construcción de argumentos sólidos.",
      ],
    ];
    return opciones[v % opciones.length];
  },
  conceptualizacion: (d, v) => {
    const desc = d.descripcion;
    const opciones: string[][] = [
      [
        `Explicar la corriente o concepto filosófico: ${desc}`,
        "Presentar los filósofos principales y sus ideas centrales.",
        "Analizar fragmentos de textos filosóficos de forma guiada.",
        "Trabajar en el texto del estudiante: lectura crítica.",
        "Formalizar los conceptos con un mapa conceptual.",
      ],
      [
        `Presentar el contexto histórico-filosófico: ${desc}`,
        "Guiar la lectura comprensiva de textos filosóficos adaptados.",
        "Explicar las relaciones entre corrientes filosóficas.",
        "Solicitar que elaboren un cuadro comparativo de ideas.",
        "Practicar la construcción de argumentos lógicos.",
      ],
      [
        `Introducir el contenido de forma estructurada: ${desc}`,
        "Utilizar esquemas de argumentación lógica (premisas, conclusión).",
        "Modelar el análisis crítico de un texto filosófico.",
        "Guiar la elaboración de un ensayo filosófico breve.",
        "Sintetizar las ideas principales en un organizador gráfico.",
      ],
    ];
    return opciones[v % opciones.length];
  },
  aplicacion: (d, v) => {
    const opciones: string[][] = [
      [
        "Asignar un ensayo filosófico argumentativo sobre el tema.",
        "Solicitar la elaboración de un diálogo filosófico escrito.",
        "Socializar las reflexiones y argumentos por equipos.",
        "Formular preguntas: \u00bfCómo se aplica esta filosofía a nuestra realidad?",
        "Asignar lectura filosófica para la próxima clase.",
      ],
      [
        "Proponer un debate filosófico con posiciones asignadas.",
        "Guiar la aplicación del método socrático a un problema actual.",
        "Organizar la presentación de ensayos filosóficos.",
        "Promover la reflexión sobre ética y ciudadanía.",
        "Asignar proyecto de filosofía aplicada para la próxima clase.",
      ],
      [
        "Asignar ejercicios de análisis lógico y argumentación.",
        "Organizar una comunidad de indagación filosófica.",
        "Solicitar que relacionen lo aprendido con dilemas éticos actuales.",
        "Realizar autoevaluación de la capacidad argumentativa.",
        "Asignar diario filosófico reflexivo.",
      ],
    ];
    return opciones[v % opciones.length];
  },
  recursos: (d, v) => {
    const base = ["Texto del estudiante", "Cuaderno de trabajo", "Pizarra y marcadores"];
    const extras: string[][] = [
      ["Fragmentos de textos filosóficos", "Dilemas éticos impresos", "Esquemas de argumentación"],
      ["Videos de filosofía", "Artículos de opinión", "Fichas de análisis"],
      ["Material audiovisual", "Textos de filosofía latinoamericana", "Recursos digitales"],
    ];
    return [...base, ...extras[v % extras.length]];
  },
};

// ============================================================
// PLANTILLAS BACHILLERATO: INGLÉS (EFL)
// ============================================================

const PLANTILLAS_INGLES: PlantillaActividades = {
  experiencia: (d, v) => {
    const desc = d.descripcion;
    const opciones: string[][] = [
      [
        `Present a communicative situation in English related to: ${desc}`,
        "Activate prior knowledge with simple English questions.",
        "Listen to an audio clip or watch a short video in English about the topic.",
        "Present the learning objective and key vocabulary.",
      ],
      [
        `Set up a role-play or simulation linked to: ${desc}`,
        "Ask students to share experiences using known vocabulary.",
        "Connect the topic with Ecuadorian culture (describe in English).",
        "Share the communicative objective of the lesson.",
      ],
      [
        `Show images, realia, or a video about: ${desc}`,
        "Ask questions in English: What do you see? What do you think about...?",
        "Connect with students' personal experiences.",
        "Announce the topic and the main communicative activity.",
      ],
    ];
    return opciones[v % opciones.length];
  },
  reflexion: (d, v) => {
    const desc = d.descripcion;
    const opciones: string[][] = [
      [
        "Ask analytical questions in English: What patterns do you notice?",
        "Have students compare their answers with their classmates.",
        `Guide the discussion about the linguistic structures used in: ${desc.substring(0, 50).toLowerCase()}...`,
        "Record key structures and vocabulary on the board.",
      ],
      [
        "Organize a pair discussion about the topic in English.",
        "Analyze common errors and self-correction strategies.",
        "Compare different ways to express the same idea.",
        "Identify the grammatical structures used.",
      ],
      [
        "Ask students to explain in their own English words what they learned.",
        "Analyze a model text collectively.",
        "Ask questions: How can we say this differently?",
        "Guide students toward identifying linguistic patterns.",
      ],
    ];
    return opciones[v % opciones.length];
  },
  conceptualizacion: (d, v) => {
    const desc = d.descripcion;
    const opciones: string[][] = [
      [
        `Explain the linguistic structure or communicative skill: ${desc}`,
        "Present contextualized examples of the grammatical structure.",
        "Carry out controlled practice: complete sentences, transform phrases.",
        "Work with the student textbook: analyze model texts.",
        "Formalize grammar rules and vocabulary in the notebook.",
      ],
      [
        `Present the linguistic content: ${desc}`,
        "Guide the reading comprehension of an authentic English text.",
        "Explain the communicative functions and structures involved.",
        "Have students practice in pairs with guided dialogues.",
        "Solve grammar and vocabulary exercises.",
      ],
      [
        `Introduce the content in a structured way: ${desc}`,
        "Use authentic audiovisual resources in English.",
        "Model oral or written production step by step.",
        "Guide the writing of a text in English.",
        "Synthesize structures and vocabulary in a graphic organizer.",
      ],
    ];
    return opciones[v % opciones.length];
  },
  aplicacion: (d, v) => {
    const opciones: string[][] = [
      [
        "Assign a communicative activity in pairs or groups.",
        "Request the production of a written text in English.",
        "Share oral or written productions with the class.",
        "Ask feedback questions: How can we improve?",
        "Assign listening or reading practice for the next class.",
      ],
      [
        "Propose a communicative project: presentation, poster, video in English.",
        "Guide free production with vocabulary and structure support.",
        "Organize the presentation of work in English.",
        "Promote intercultural reflection.",
        "Assign an English project for the next class.",
      ],
      [
        "Assign communicative practice exercises.",
        "Organize a role-play or simulation in English.",
        "Ask students to use English to describe their Ecuadorian environment.",
        "Carry out self-assessment of English production.",
        "Assign an extension task with a communicative focus.",
      ],
    ];
    return opciones[v % opciones.length];
  },
  recursos: (d, v) => {
    const base = ["Student textbook", "Workbook", "Whiteboard and markers"];
    const extras: string[][] = [
      ["English audio and video", "Vocabulary flashcards", "English-Spanish dictionary"],
      ["Authentic English texts", "Audiovisual material", "Grammar worksheets"],
      ["English songs and podcasts", "Vocabulary games", "Digital resources"],
    ];
    return [...base, ...extras[v % extras.length]];
  },
};

// ============================================================
// PLANTILLAS BACHILLERATO: EMPRENDIMIENTO Y GESTIÓN
// ============================================================

const PLANTILLAS_EMPRENDIMIENTO: PlantillaActividades = {
  experiencia: (d, v) => {
    const desc = d.descripcion;
    const opciones: string[][] = [
      [
        `Presentar un caso de emprendimiento ecuatoriano relacionado con: ${desc}`,
        "Explorar conocimientos previos sobre negocios y economía.",
        "Realizar una actividad de brainstorming sobre ideas de negocio.",
        "Presentar el objetivo de aprendizaje y su aplicación práctica.",
      ],
      [
        `Plantear un desafío empresarial vinculado con: ${desc}`,
        "Solicitar que compartan experiencias con emprendimientos familiares.",
        "Relacionar el tema con la economía local y oportunidades del Ecuador.",
        "Compartir el objetivo del proyecto de emprendimiento.",
      ],
      [
        `Mostrar un video de un emprendedor exitoso hablando sobre: ${desc}`,
        "Formular preguntas: \u00bfQué habilidades necesita un emprendedor?",
        "Conectar con la realidad económica de la comunidad.",
        "Anunciar el tema y la actividad práctica planificada.",
      ],
    ];
    return opciones[v % opciones.length];
  },
  reflexion: (d, v) => {
    const desc = d.descripcion;
    const opciones: string[][] = [
      [
        "Formular preguntas de análisis: \u00bfQué factores determinan el éxito de un emprendimiento?",
        "Solicitar que identifiquen fortalezas y debilidades del caso presentado.",
        `Guiar la discusión sobre los aspectos financieros de: ${desc.substring(0, 60).toLowerCase()}...`,
        "Registrar las ideas clave y lecciones aprendidas.",
      ],
      [
        "Organizar una discusión sobre los riesgos y oportunidades del emprendimiento.",
        "Analizar los factores económicos que afectan al caso presentado.",
        "Comparar diferentes estrategias de negocio propuestas.",
        "Identificar las obligaciones legales y tributarias involucradas.",
      ],
      [
        "Solicitar que evalúen críticamente el modelo de negocio presentado.",
        "Analizar colectivamente los datos financieros del caso.",
        "Formular preguntas: \u00bfEs viable este emprendimiento en nuestra comunidad?",
        "Guiar hacia la identificación de oportunidades de mejora.",
      ],
    ];
    return opciones[v % opciones.length];
  },
  conceptualizacion: (d, v) => {
    const desc = d.descripcion;
    const opciones: string[][] = [
      [
        `Explicar el concepto empresarial central: ${desc}`,
        "Utilizar plantillas de plan de negocios y estados financieros.",
        "Realizar cálculos contables o financieros guiados paso a paso.",
        "Trabajar en el texto del estudiante: analizar casos de estudio.",
        "Formalizar los conceptos con esquemas y plantillas en el cuaderno.",
      ],
      [
        `Presentar la teoría administrativa o financiera: ${desc}`,
        "Guiar el análisis de estados financieros básicos.",
        "Explicar la normativa tributaria y laboral ecuatoriana aplicable.",
        "Solicitar que elaboren un presupuesto o plan básico.",
        "Resolver ejercicios de contabilidad o análisis de mercado.",
      ],
      [
        `Introducir el contenido de forma estructurada: ${desc}`,
        "Utilizar herramientas digitales para simulaciones financieras.",
        "Modelar la elaboración de un plan de negocios paso a paso.",
        "Guiar la creación de un estudio de mercado básico.",
        "Sintetizar los conceptos en un cuadro resumen.",
      ],
    ];
    return opciones[v % opciones.length];
  },
  aplicacion: (d, v) => {
    const opciones: string[][] = [
      [
        "Asignar la elaboración de un componente del plan de negocios.",
        "Solicitar la presentación de un elevator pitch del emprendimiento.",
        "Socializar los proyectos de emprendimiento por equipos.",
        "Formular preguntas: \u00bfCómo mejorarían la propuesta de valor?",
        "Asignar investigación de mercado para la próxima clase.",
      ],
      [
        "Proponer una simulación de negocio o feria de emprendimiento.",
        "Guiar la aplicación de conceptos contables a un caso real.",
        "Organizar la presentación de planes de negocio.",
        "Promover la reflexión sobre responsabilidad social empresarial.",
        "Asignar proyecto de emprendimiento para la próxima clase.",
      ],
      [
        "Asignar ejercicios de cálculo financiero y contable.",
        "Organizar una actividad de análisis FODA de emprendimientos locales.",
        "Solicitar que relacionen lo aprendido con la economía ecuatoriana.",
        "Realizar autoevaluación del proyecto de emprendimiento.",
        "Asignar tarea de extensión con enfoque práctico.",
      ],
    ];
    return opciones[v % opciones.length];
  },
  recursos: (d, v) => {
    const base = ["Texto del estudiante", "Cuaderno de trabajo", "Pizarra y marcadores"];
    const extras: string[][] = [
      ["Plantillas de plan de negocios", "Calculadora", "Formularios del SRI"],
      ["Casos de emprendimientos ecuatorianos", "Material audiovisual", "Hojas de cálculo"],
      ["Herramientas digitales de gestión", "Material de papelería", "Recursos tecnológicos"],
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
  "CN.B": PLANTILLAS_BIOLOGIA,
  "CN.Q": PLANTILLAS_QUIMICA,
  "CN.F": PLANTILLAS_FISICA,
  "CS.H": PLANTILLAS_HISTORIA,
  "CS.F": PLANTILLAS_FILOSOFIA,
  EFL: PLANTILLAS_INGLES,
  EG: PLANTILLAS_EMPRENDIMIENTO,
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

function generarEvaluacionEFL(destreza: Destreza, variante: number): string {
  const indicador = destreza.indicadoresEvaluacion[0] || "Demonstrates understanding of the content covered.";
  const criterio = destreza.criteriosEvaluacion[0] || "";

  const instrumentos: string[][] = [
    [
      `Checklist with the following indicators:`,
      `- ${indicador}`,
      `- Actively participates in the proposed activities.`,
      `- Applies what was learned in practical exercises.`,
    ],
    [
      `Assessment rubric. Main criterion: ${criterio || indicador}`,
      `Levels: Mastery (9-10) / Achievement (7-8) / Developing (5-6) / Beginning (< 5).`,
      `Assessed: comprehension, application, and participation.`,
    ],
    [
      `Direct observation and product review.`,
      `Criterion: ${indicador}`,
      `Technique: Oral feedback questions during and after the lesson.`,
      `Instrument: Anecdotal record.`,
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
    const isEFL = destreza.area === "EFL";

    temas.push({
      id: generarId(),
      titulo,
      descripcionBreve,
      objetivoClase: destreza.objetivos[0] || destreza.descripcion,
      estructura: {
        experiencia: {
          titulo: isEFL ? "Experience" : "Experiencia",
          duracion: isEFL ? "10 minutes" : "10 minutos",
          actividades: plantilla.experiencia(destreza, v),
        },
        reflexion: {
          titulo: isEFL ? "Reflection" : "Reflexión",
          duracion: isEFL ? "10 minutes" : "10 minutos",
          actividades: plantilla.reflexion(destreza, v),
        },
        conceptualizacion: {
          titulo: isEFL ? "Conceptualization" : "Conceptualización",
          duracion: isEFL ? "15 minutes" : "15 minutos",
          actividades: plantilla.conceptualizacion(destreza, v),
        },
        aplicacion: {
          titulo: isEFL ? "Application" : "Aplicación",
          duracion: isEFL ? "10 minutes" : "10 minutos",
          actividades: plantilla.aplicacion(destreza, v),
        },
      },
      recursos: plantilla.recursos(destreza, v),
      evaluacionFormativa: isEFL ? generarEvaluacionEFL(destreza, v) : generarEvaluacion(destreza, v),
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
