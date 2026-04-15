import { Destreza, TemaSugerido, Area, AREAS_INFO } from "./types";

/**
 * Genera temas sugeridos ESPECÍFICOS para cada destreza.
 * Cada tema incluye una estructura de clase de 45 minutos en 3 fases:
 * - Anticipación (10 min): Activación de conocimientos previos
 * - Desarrollo (25 min): Construcción del conocimiento
 * - Cierre (10 min): Consolidación + preguntas de retroalimentación
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
    hash = hash & hash; // Convert to 32bit integer
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

  // Prefijos creativos por variante
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

  // Construir tema basado en las palabras clave de la destreza
  const temaBase = palabras.slice(0, 4).join(" ");
  if (temaBase.length > 10) {
    return `${prefijo} ${temaBase}`;
  }
  return `${prefijo} ${bloque.toLowerCase()}`;
}

// ============================================================
// PLANTILLAS DE ACTIVIDADES POR ÁREA
// ============================================================

interface PlantillaActividades {
  anticipacion: (destreza: Destreza, variante: number) => string[];
  desarrollo: (destreza: Destreza, variante: number) => string[];
  cierre: (destreza: Destreza, variante: number) => string[];
  recursos: (destreza: Destreza, variante: number) => string[];
}

const PLANTILLAS_MATEMATICA: PlantillaActividades = {
  anticipacion: (d, v) => {
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
  desarrollo: (d, v) => {
    const desc = d.descripcion;
    const opciones: string[][] = [
      [
        `Explicar el concepto central: ${desc}`,
        "Utilizar material concreto (regletas, bloques, ábacos) para representar el concepto.",
        "Realizar práctica guiada: resolver 2-3 ejercicios paso a paso en la pizarra.",
        "Trabajar en el texto del estudiante: analizar ejemplos resueltos.",
        "Asignar trabajo individual: 4-5 ejercicios de aplicación directa.",
        "Recorrer el aula para orientar y resolver dudas individuales.",
        "Proponer un ejercicio de mayor complejidad para quienes terminan primero.",
      ],
      [
        `Introducir el tema mediante una demostración práctica: ${desc}`,
        "Entregar material manipulativo a cada grupo de trabajo.",
        "Guiar la exploración: solicitar que descubran patrones o relaciones.",
        "Formalizar el concepto a partir de los descubrimientos de los estudiantes.",
        "Resolver ejercicios de complejidad creciente en la pizarra.",
        "Asignar trabajo en parejas: resolver problemas contextualizados.",
        "Organizar la socialización de resultados entre parejas.",
      ],
      [
        `Presentar el contenido de forma estructurada: ${desc}`,
        "Utilizar representaciones gráficas (diagramas, tablas, recta numérica) para visualizar.",
        "Modelar la resolución de un problema paso a paso.",
        "Solicitar que los estudiantes resuelvan un problema similar de forma guiada.",
        "Asignar trabajo en equipos: resolver un reto matemático contextualizado.",
        "Invitar a cada equipo a explicar su estrategia de resolución.",
        "Proponer ejercicios individuales de consolidación.",
      ],
    ];
    return opciones[v % opciones.length];
  },
  cierre: (d, v) => {
    const desc = d.descripcion;
    const opciones: string[][] = [
      [
        "Socializar resultados y corregir colectivamente los ejercicios.",
        `Formular preguntas de retroalimentación: ¿Qué aprendimos hoy sobre ${desc.substring(0, 50).toLowerCase()}...?`,
        "Aclarar dudas y reforzar conceptos clave.",
        "Asignar tarea de refuerzo para la casa.",
        "Promover la metacognición: ¿Qué fue fácil? ¿Qué necesito repasar?",
      ],
      [
        "Invitar a 2-3 estudiantes a explicar cómo resolvieron un ejercicio.",
        "Corregir errores comunes identificados durante la clase.",
        "Sintetizar los aprendizajes clave en un organizador gráfico.",
        "Asignar tarea de extensión con problemas del contexto real.",
        "Realizar autoevaluación: ¿Puedo explicar lo aprendido a un compañero?",
      ],
      [
        "Organizar un juego rápido de repaso (preguntas y respuestas).",
        "Reforzar los procedimientos y conceptos trabajados.",
        "Formular preguntas de cierre: ¿Para qué nos sirve lo aprendido?",
        "Asignar tarea diferenciada según el nivel de avance.",
        "Motivar: destacar el progreso logrado en la clase.",
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
  anticipacion: (d, v) => {
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
  desarrollo: (d, v) => {
    const desc = d.descripcion;
    const opciones: string[][] = [
      [
        `Presentar el contenido de forma estructurada: ${desc}`,
        "Realizar lectura compartida del texto seleccionado.",
        "Guiar el análisis del contenido, estructura y recursos del texto.",
        "Modelar la producción textual o actividad comunicativa.",
        "Asignar producción individual o en parejas.",
        "Organizar revisión entre pares y corrección colaborativa.",
        "Socializar las producciones más destacadas.",
      ],
      [
        `Introducir el tema mediante ejemplos contextualizados: ${desc}`,
        "Analizar colectivamente un texto modelo identificando sus características.",
        "Trabajar en el texto del estudiante: ejercicios de comprensión.",
        "Asignar trabajo en grupos: producción textual colaborativa.",
        "Guiar la revisión y edición de los textos producidos.",
        "Invitar a cada grupo a compartir su producción.",
        "Proponer ejercicios individuales de consolidación.",
      ],
      [
        `Explorar el tema a través de la lectura guiada: ${desc}`,
        "Identificar colectivamente elementos clave del texto.",
        "Realizar ejercicios de vocabulario y comprensión.",
        "Asignar trabajo creativo: producción textual individual.",
        "Acompañar el proceso de escritura individualmente.",
        "Organizar la lectura en voz alta de las producciones.",
        "Proporcionar retroalimentación constructiva.",
      ],
    ];
    return opciones[v % opciones.length];
  },
  cierre: (d, v) => {
    const opciones: string[][] = [
      [
        "Compartir las producciones escritas con el grupo.",
        "Formular preguntas de retroalimentación sobre el aprendizaje.",
        "Reforzar conceptos y estrategias comunicativas trabajadas.",
        "Asignar tarea de extensión (lectura o producción escrita).",
        "Promover la metacognición: ¿Qué estrategia me ayudó más?",
      ],
      [
        "Organizar una galería de textos para lectura entre compañeros.",
        "Sintetizar los aprendizajes clave de la clase.",
        "Aclarar dudas sobre el contenido trabajado.",
        "Asignar tarea para reforzar la competencia comunicativa.",
        "Reflexionar: ¿Cómo puedo mejorar mi comunicación?",
      ],
      [
        "Socializar resultados y destacar logros.",
        "Realizar coevaluación de las producciones.",
        "Formular preguntas de cierre sobre lo aprendido.",
        "Asignar lectura complementaria para la casa.",
        "Motivar la práctica de la lectura y escritura diaria.",
      ],
    ];
    return opciones[v % opciones.length];
  },
  recursos: (d, v) => {
    const base = ["Texto del estudiante", "Cuaderno de trabajo", "Diccionario"];
    const extras: string[][] = [
      ["Biblioteca del aula", "Papelotes y marcadores"],
      ["Textos impresos seleccionados", "Fichas de comprensión lectora"],
      ["Material audiovisual", "Hojas de producción textual"],
    ];
    return [...base, ...extras[v % extras.length]];
  },
};

const PLANTILLAS_CN: PlantillaActividades = {
  anticipacion: (d, v) => {
    const desc = d.descripcion;
    const opciones: string[][] = [
      [
        `Presentar una pregunta de investigación relacionada con: ${desc}`,
        "Solicitar que los estudiantes formulen hipótesis.",
        "Realizar observación directa o indirecta del fenómeno.",
        "Presentar el objetivo de la clase y la metodología.",
      ],
      [
        `Mostrar un fenómeno natural o experimento sencillo vinculado con: ${desc}`,
        "Formular preguntas: ¿Por qué sucede esto? ¿Qué creen que pasará?",
        "Explorar conocimientos previos sobre el tema.",
        "Compartir el propósito de aprendizaje.",
      ],
      [
        `Presentar imágenes o un video corto sobre: ${desc}`,
        "Solicitar observaciones y preguntas de los estudiantes.",
        "Registrar las ideas previas en la pizarra.",
        "Anunciar el tema y el objetivo de investigación.",
      ],
    ];
    return opciones[v % opciones.length];
  },
  desarrollo: (d, v) => {
    const desc = d.descripcion;
    const opciones: string[][] = [
      [
        `Explicar los conceptos científicos centrales: ${desc}`,
        "Realizar un experimento o actividad práctica con materiales del entorno.",
        "Guiar el registro de observaciones y datos en el cuaderno de campo.",
        "Analizar colectivamente los resultados obtenidos.",
        "Trabajar en el texto del estudiante: leer y comparar con lo observado.",
        "Asignar trabajo en grupos: elaborar conclusiones.",
        "Socializar los hallazgos de cada grupo.",
      ],
      [
        `Introducir el tema mediante la indagación: ${desc}`,
        "Organizar estaciones de aprendizaje con diferentes actividades prácticas.",
        "Guiar la rotación por estaciones (5 minutos cada una).",
        "Solicitar el registro de observaciones en cada estación.",
        "Formalizar los conceptos a partir de la experiencia.",
        "Asignar ejercicios de aplicación del texto del estudiante.",
        "Proponer un reto de investigación para profundizar.",
      ],
      [
        `Presentar el contenido con apoyo visual y concreto: ${desc}`,
        "Realizar una demostración práctica paso a paso.",
        "Solicitar que los estudiantes repliquen la actividad en grupos.",
        "Guiar la elaboración de organizadores gráficos con los conceptos clave.",
        "Asignar trabajo individual: ejercicios de comprensión.",
        "Recorrer el aula para orientar y resolver dudas.",
        "Organizar la presentación de resultados.",
      ],
    ];
    return opciones[v % opciones.length];
  },
  cierre: (d, v) => {
    const opciones: string[][] = [
      [
        "Socializar conclusiones y comparar con las hipótesis iniciales.",
        "Formular preguntas de retroalimentación: ¿Qué descubrimos? ¿Se confirmó nuestra hipótesis?",
        "Reforzar conceptos clave y vocabulario científico.",
        "Asignar tarea de investigación o experimentación en casa.",
        "Promover la curiosidad: ¿Qué más les gustaría investigar?",
      ],
      [
        "Presentar los hallazgos de cada grupo al resto de la clase.",
        "Elaborar colectivamente un mapa conceptual de lo aprendido.",
        "Aclarar dudas y corregir concepciones erróneas.",
        "Asignar tarea de observación del entorno natural.",
        "Reflexionar: ¿Cómo se relaciona lo aprendido con nuestra vida?",
      ],
      [
        "Sintetizar los aprendizajes mediante preguntas dirigidas.",
        "Completar un organizador gráfico de cierre.",
        "Formular preguntas de extensión para motivar la investigación.",
        "Asignar lectura complementaria del texto del estudiante.",
        "Destacar la importancia de la ciencia en la vida cotidiana.",
      ],
    ];
    return opciones[v % opciones.length];
  },
  recursos: (d, v) => {
    const base = ["Texto del estudiante", "Cuaderno de campo"];
    const extras: string[][] = [
      ["Materiales del entorno para experimentación", "Láminas didácticas", "Lupa o instrumentos de observación"],
      ["Kit de laboratorio escolar", "Material reciclado", "Fichas de registro"],
      ["Material audiovisual", "Materiales naturales del entorno", "Papelotes y marcadores"],
    ];
    return [...base, ...extras[v % extras.length]];
  },
};

const PLANTILLAS_CS: PlantillaActividades = {
  anticipacion: (d, v) => {
    const desc = d.descripcion;
    const opciones: string[][] = [
      [
        `Contextualizar históricamente mediante un relato o imagen: ${desc}`,
        "Explorar conocimientos previos sobre el tema.",
        "Formular preguntas generadoras que conecten pasado y presente.",
        "Presentar el objetivo de aprendizaje.",
      ],
      [
        `Presentar un mapa, línea de tiempo o documento histórico relacionado con: ${desc}`,
        "Solicitar observaciones y preguntas de los estudiantes.",
        "Activar conocimientos previos mediante preguntas dirigidas.",
        "Compartir el propósito de la clase.",
      ],
      [
        `Narrar una anécdota o caso real vinculado con: ${desc}`,
        "Formular preguntas: ¿Qué opinan? ¿Por qué es importante?",
        "Realizar una lluvia de ideas sobre el tema.",
        "Anunciar el tema y objetivo de la sesión.",
      ],
    ];
    return opciones[v % opciones.length];
  },
  desarrollo: (d, v) => {
    const desc = d.descripcion;
    const opciones: string[][] = [
      [
        `Presentar el contenido de forma estructurada: ${desc}`,
        "Guiar la lectura comprensiva de fuentes primarias o secundarias.",
        "Analizar colectivamente el contenido identificando causas y consecuencias.",
        "Trabajar en el texto del estudiante: ejercicios de comprensión.",
        "Asignar trabajo en grupos: elaborar organizadores gráficos.",
        "Organizar un debate dirigido sobre el tema.",
        "Solicitar conclusiones escritas de cada grupo.",
      ],
      [
        `Introducir el tema mediante análisis de fuentes: ${desc}`,
        "Distribuir documentos o textos para análisis en grupos.",
        "Guiar la identificación de ideas principales y secundarias.",
        "Formalizar los conceptos y hechos históricos clave.",
        "Asignar la elaboración de una línea de tiempo o mapa conceptual.",
        "Socializar los productos de cada grupo.",
        "Proponer ejercicios de reflexión crítica.",
      ],
      [
        `Explorar el tema a través de material audiovisual: ${desc}`,
        "Guiar la observación con preguntas de análisis.",
        "Organizar trabajo colaborativo: investigación en el texto.",
        "Solicitar la elaboración de un resumen o infografía.",
        "Presentar los hallazgos al grupo.",
        "Debatir sobre la relevancia actual del tema.",
        "Asignar ejercicios de consolidación.",
      ],
    ];
    return opciones[v % opciones.length];
  },
  cierre: (d, v) => {
    const opciones: string[][] = [
      [
        "Presentar conclusiones de cada grupo al resto de la clase.",
        "Formular preguntas de retroalimentación: ¿Qué aprendimos? ¿Por qué es importante?",
        "Reflexionar sobre la importancia del tema en la actualidad.",
        "Asignar tarea de investigación complementaria.",
        "Promover el pensamiento crítico: ¿Qué hubiera pasado si...?",
      ],
      [
        "Sintetizar los aprendizajes en un organizador gráfico colectivo.",
        "Aclarar dudas y reforzar conceptos clave.",
        "Conectar lo aprendido con la realidad ecuatoriana actual.",
        "Asignar lectura complementaria.",
        "Reflexionar: ¿Cómo nos afecta esto como ciudadanos?",
      ],
      [
        "Organizar un juego de repaso (preguntas y respuestas).",
        "Reforzar los hechos y conceptos más importantes.",
        "Formular preguntas de extensión para motivar la investigación.",
        "Asignar tarea de análisis crítico.",
        "Destacar valores cívicos relacionados con el tema.",
      ],
    ];
    return opciones[v % opciones.length];
  },
  recursos: (d, v) => {
    const base = ["Texto del estudiante", "Cuaderno de trabajo"];
    const extras: string[][] = [
      ["Mapas y atlas", "Material audiovisual", "Fuentes históricas impresas"],
      ["Líneas de tiempo impresas", "Papelotes y marcadores", "Documentos históricos"],
      ["Láminas didácticas", "Material cartográfico", "Recursos tecnológicos"],
    ];
    return [...base, ...extras[v % extras.length]];
  },
};

const PLANTILLAS_EF: PlantillaActividades = {
  anticipacion: (d, v) => {
    const desc = d.descripcion;
    const opciones: string[][] = [
      [
        "Dirigir calentamiento general: trote suave, movilidad articular.",
        `Explicar el objetivo de la clase relacionado con: ${desc}`,
        "Realizar juego de activación relacionado con el tema.",
        "Organizar los grupos de trabajo.",
      ],
      [
        "Dirigir calentamiento con juego dinámico grupal.",
        `Presentar la actividad principal: ${desc}`,
        "Demostrar brevemente los movimientos o técnicas a trabajar.",
        "Verificar el espacio y materiales necesarios.",
      ],
      [
        "Realizar calentamiento específico para la actividad.",
        "Explorar conocimientos previos: ¿Han practicado algo similar?",
        `Presentar el reto de la clase: ${desc}`,
        "Establecer las reglas y normas de seguridad.",
      ],
    ];
    return opciones[v % opciones.length];
  },
  desarrollo: (d, v) => {
    const desc = d.descripcion;
    const opciones: string[][] = [
      [
        `Demostrar la actividad paso a paso: ${desc}`,
        "Organizar práctica guiada en grupos pequeños.",
        "Supervisar la ejecución y corregir posturas/técnicas.",
        "Aumentar progresivamente la complejidad.",
        "Proponer variantes del ejercicio para diferentes niveles.",
        "Organizar juego o actividad competitiva aplicando lo aprendido.",
        "Permitir práctica libre supervisada.",
      ],
      [
        `Introducir la actividad mediante juego pre-deportivo: ${desc}`,
        "Explicar las reglas y técnicas fundamentales.",
        "Organizar práctica por estaciones.",
        "Rotar los grupos cada 5 minutos.",
        "Supervisar y corregir individualmente.",
        "Proponer un desafío grupal integrador.",
        "Realizar actividad lúdica de cierre activo.",
      ],
      [
        `Presentar la secuencia de movimientos: ${desc}`,
        "Practicar en parejas con retroalimentación mutua.",
        "Organizar circuito de ejercicios relacionados.",
        "Guiar la ejecución con correcciones grupales.",
        "Proponer variantes creativas de la actividad.",
        "Organizar mini-competencia amistosa.",
        "Permitir exploración libre del movimiento.",
      ],
    ];
    return opciones[v % opciones.length];
  },
  cierre: (d, v) => {
    const opciones: string[][] = [
      [
        "Dirigir vuelta a la calma con estiramientos.",
        "Formular preguntas de retroalimentación: ¿Qué aprendimos? ¿Qué fue más difícil?",
        "Reforzar la importancia de la actividad física.",
        "Recordar la hidratación y el cuidado del cuerpo.",
        "Asignar práctica para realizar en casa.",
      ],
      [
        "Realizar ejercicios de relajación y respiración.",
        "Socializar experiencias: ¿Cómo se sintieron?",
        "Reforzar las técnicas trabajadas.",
        "Motivar la práctica deportiva regular.",
        "Recordar normas de higiene post-ejercicio.",
      ],
      [
        "Dirigir estiramientos específicos de los músculos trabajados.",
        "Realizar autoevaluación: ¿Mejoré respecto a la clase anterior?",
        "Destacar los logros individuales y grupales.",
        "Asignar reto físico para la semana.",
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
  anticipacion: (d, v) => {
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
  desarrollo: (d, v) => {
    const desc = d.descripcion;
    const opciones: string[][] = [
      [
        `Explicar la técnica artística a trabajar: ${desc}`,
        "Realizar una demostración paso a paso.",
        "Permitir la exploración libre de materiales.",
        "Guiar la creación artística individual o colectiva.",
        "Acompañar el proceso creativo individualmente.",
        "Proponer variantes y desafíos creativos.",
        "Solicitar que documenten su proceso.",
      ],
      [
        `Introducir el tema artístico mediante experimentación: ${desc}`,
        "Organizar trabajo por estaciones creativas.",
        "Guiar la exploración de diferentes técnicas.",
        "Solicitar la creación de una obra personal.",
        "Fomentar la expresión libre y la originalidad.",
        "Organizar intercambio de ideas entre compañeros.",
        "Proponer mejoras y refinamiento de las obras.",
      ],
      [
        `Presentar el proyecto artístico: ${desc}`,
        "Distribuir materiales y organizar espacios de trabajo.",
        "Modelar la técnica principal.",
        "Asignar trabajo creativo individual.",
        "Recorrer el aula para orientar y motivar.",
        "Fomentar la colaboración y el intercambio de ideas.",
        "Solicitar la preparación de las obras para exposición.",
      ],
    ];
    return opciones[v % opciones.length];
  },
  cierre: (d, v) => {
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

  // Generar 3 temas únicos para esta destreza
  const temas: TemaSugerido[] = [];

  for (let variante = 0; variante < 3; variante++) {
    // Usar hash + variante para seleccionar combinaciones diferentes
    const v = (hash + variante) % 3;

    const titulo = generarTituloTema(destreza, variante);
    const descripcionBreve = generarDescripcionBreve(destreza, variante, bloque);

    temas.push({
      id: generarId(),
      titulo,
      descripcionBreve,
      objetivoClase: destreza.objetivos[0] || destreza.descripcion,
      estructura: {
        anticipacion: {
          titulo: "Anticipación",
          duracion: "10 minutos",
          actividades: plantilla.anticipacion(destreza, v),
        },
        desarrollo: {
          titulo: "Desarrollo",
          duracion: "25 minutos",
          actividades: plantilla.desarrollo(destreza, v),
        },
        cierre: {
          titulo: "Cierre",
          duracion: "10 minutos",
          actividades: plantilla.cierre(destreza, v),
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
