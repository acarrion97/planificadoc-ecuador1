import type { TipoNEE } from "./types";

export interface NeeStrategySet {
  id: TipoNEE;
  nombre: string;
  emoji: string;
  descripcionContextual: string;
  estiloAprendizajeSugerido: string;
  estrategiasAcceso: string[];
  estrategiasProceso: string[];
  estrategiasResultado: string[];
  recursosEspecificos: string[];
}

export const NEE_STRATEGIES: Record<TipoNEE, NeeStrategySet> = {
  discapacidad_visual: {
    id: "discapacidad_visual",
    nombre: "Discapacidad Visual",
    emoji: "👁️",
    descripcionContextual:
      "Estudiante con limitación total o parcial de la visión que requiere materiales y estrategias que privilegien canales auditivos, táctiles y kinestésicos.",
    estiloAprendizajeSugerido: "auditivo-kinestésico",
    estrategiasAcceso: [
      "Materiales en formato digital accesible (texto grande, alto contraste o braille)",
      "Descripción verbal detallada de imágenes, gráficos y pizarrón",
      "Ubicación preferencial cerca del frente del aula",
      "Uso de lectores de pantalla y software de magnificación cuando se requiera",
      "Etiquetas en relieve o código de colores en materiales manipulativos",
    ],
    estrategiasProceso: [
      "Instrucciones orales claras, secuenciadas y repetidas",
      "Tiempo adicional para completar actividades que impliquen lectura o escritura",
      "Asignación de compañero de apoyo para tareas visuales",
      "Uso de materiales tridimensionales y manipulativos táctiles",
    ],
    estrategiasResultado: [
      "Evaluación oral en lugar de escrita cuando se requiera",
      "Presentaciones grabadas o en audio como evidencia de aprendizaje",
      "Reducción de ítems visuales en pruebas; reemplazo por ítems auditivos o manipulativos",
    ],
    recursosEspecificos: [
      "Láminas táctiles y materiales en relieve",
      "Audiolibros y grabaciones",
      "Software lector de pantalla (NVDA, JAWS)",
      "Tabletas con accesibilidad visual activada",
      "Marcadores de posición táctiles",
    ],
  },

  discapacidad_auditiva: {
    id: "discapacidad_auditiva",
    nombre: "Discapacidad Auditiva / Hipoacusia",
    emoji: "👂",
    descripcionContextual:
      "Estudiante con pérdida auditiva parcial o total que requiere apoyos visuales, comunicación alternativa y reducción de barreras sonoras.",
    estiloAprendizajeSugerido: "visual-lector/escritor",
    estrategiasAcceso: [
      "Ubicación preferencial con vista directa al docente y a los labios",
      "Uso de lenguaje de señas ecuatoriano (LSEC) cuando sea posible",
      "Apoyo de intérprete o mediador comunicacional en clases",
      "Iluminación adecuada del rostro del docente para facilitar lectura labial",
      "Subtítulos en videos y presentaciones multimedia",
    ],
    estrategiasProceso: [
      "Instrucciones escritas o visuales complementando las verbales",
      "Repetición de preguntas del grupo para que el estudiante pueda seguir el hilo",
      "Uso de señales visuales para indicar cambios de actividad o alertas",
      "Materiales impresos con el contenido de las explicaciones orales",
    ],
    estrategiasResultado: [
      "Evaluaciones escritas en reemplazo de evaluaciones orales cuando corresponda",
      "Uso de LSEC o comunicación escrita en la evaluación si el estudiante lo requiere",
      "Reducción del peso de la participación oral en la calificación",
    ],
    recursosEspecificos: [
      "Diccionario visual y tablas de LSEC",
      "Videos con subtítulos",
      "Pizarrón digital interactivo",
      "Aplicaciones de comunicación aumentativa y alternativa (CAA)",
      "Sistemas de FM o amplificación de sonido en el aula",
    ],
  },

  discapacidad_motriz: {
    id: "discapacidad_motriz",
    nombre: "Discapacidad Motriz / Física",
    emoji: "♿",
    descripcionContextual:
      "Estudiante con limitaciones en el movimiento o coordinación motriz que requiere adaptaciones en el entorno físico, los instrumentos y los tiempos.",
    estiloAprendizajeSugerido: "visual-auditivo",
    estrategiasAcceso: [
      "Garantizar accesibilidad física: rampas, mesas adaptadas, espacios amplios",
      "Material de escritura adaptado: lápices engrosados, tabletas con accesibilidad, teclados especiales",
      "Ubicación que minimice desplazamientos innecesarios",
      "Eliminación de barreras físicas en el aula y en los materiales",
      "Apoyo de compañero facilitador para actividades que requieran desplazamiento",
    ],
    estrategiasProceso: [
      "Tiempo adicional para actividades escritas o manipulativas",
      "Actividades alternativas que no requieran movilidad extensa",
      "Uso de tecnología asistiva: software de voz a texto, ratón adaptado",
      "Actividades grupales donde el estudiante pueda contribuir desde su posición",
    ],
    estrategiasResultado: [
      "Evaluaciones orales o en formato digital en lugar de escritura manual",
      "Extensión del tiempo de pruebas",
      "Evidencias en formato de audio, video o portafolio digital",
    ],
    recursosEspecificos: [
      "Tablet con lápiz digital o acceso por voz",
      "Software de dictado de voz (Google Docs Voice Typing)",
      "Mesa o pupitre ajustable",
      "Materiales de escritura ergonómicos",
      "Aplicaciones de CAA para comunicación si es necesario",
    ],
  },

  discapacidad_intelectual: {
    id: "discapacidad_intelectual",
    nombre: "Discapacidad Intelectual",
    emoji: "🧠",
    descripcionContextual:
      "Estudiante con limitaciones significativas en el funcionamiento intelectual y conducta adaptativa, que requiere simplificación de contenidos, instrucciones concretas y mayor andamiaje.",
    estiloAprendizajeSugerido: "kinestésico-visual",
    estrategiasAcceso: [
      "Vocabulario simple, frases cortas y lenguaje claro en todas las instrucciones",
      "Uso de pictogramas, imágenes y apoyos visuales para secuenciar tareas",
      "Rutinas y estructuras de clase predecibles y constantes",
      "Instrucciones paso a paso con verificación de comprensión en cada etapa",
      "Ambiente ordenado y sin distractores visuales excesivos",
    ],
    estrategiasProceso: [
      "Desglose de actividades en pasos muy pequeños y concretos",
      "Modelado de procedimientos antes de pedir que el estudiante los realice",
      "Aprendizaje basado en manipulación de objetos reales y experiencias concretas",
      "Repetición y práctica distribuida para consolidar aprendizajes",
    ],
    estrategiasResultado: [
      "Criterios de evaluación simplificados y contextualizados a la vida cotidiana",
      "Uso de rúbricas adaptadas con pocos descriptores y lenguaje simple",
      "Valoración del proceso y esfuerzo además del producto final",
    ],
    recursosEspecificos: [
      "Fichas de trabajo adaptadas con pictogramas",
      "Materiales manipulativos concretos",
      "Aplicaciones educativas de nivel básico con interfaz sencilla",
      "Agendas visuales de la jornada",
      "Libros adaptados con texto simple e imágenes",
    ],
  },

  tea: {
    id: "tea",
    nombre: "TEA — Trastorno del Espectro Autista",
    emoji: "🧩",
    descripcionContextual:
      "Estudiante con características del espectro autista que puede requerir apoyo en comunicación social, regulación sensorial, flexibilidad ante cambios y comprensión de normas implícitas.",
    estiloAprendizajeSugerido: "visual-lector/escritor",
    estrategiasAcceso: [
      "Agendas visuales claras que anticipen la estructura de la clase",
      "Zona de trabajo definida, ordenada y libre de estímulos sensoriales perturbadores",
      "Instrucciones visuales escritas además de las verbales",
      "Anticipación verbal y visual de cualquier cambio de rutina",
      "Uso de intereses especiales del estudiante como puente para el aprendizaje",
    ],
    estrategiasProceso: [
      "Tiempos de trabajo estructurados con descansos sensoriales regulares",
      "Actividades con inicio y fin claros, sin ambigüedades",
      "Trabajo individual prioritario; trabajo en grupo con roles explícitos",
      "Uso de organizadores gráficos, mapas conceptuales y apoyo visual",
    ],
    estrategiasResultado: [
      "Diversificación de formatos de evaluación (escrito, oral, visual, manipulativo)",
      "Reducción de demandas de interacción social en evaluaciones cuando sea posible",
      "Rúbricas concretas y explícitas sin criterios implícitos o ambiguos",
    ],
    recursosEspecificos: [
      "Agendas y calendarios visuales",
      "Objetos sensoriales reguladores (fidgets, audífonos reductores de ruido)",
      "Tableros de comunicación o aplicaciones CAA si es necesario",
      "Materiales de trabajo con estructura clara y predecible",
      "Temporizadores visuales (reloj de arena, cronómetro)",
    ],
  },

  tdah: {
    id: "tdah",
    nombre: "TDAH — Déficit de Atención e Hiperactividad",
    emoji: "⚡",
    descripcionContextual:
      "Estudiante con dificultades sostenidas en la atención, el control de impulsos y/o la actividad motriz, que requiere estructura, variedad metodológica y estrategias de autorregulación.",
    estiloAprendizajeSugerido: "kinestésico-visual",
    estrategiasAcceso: [
      "Ubicación preferencial cerca del docente, lejos de ventanas y de distractores",
      "Instrucciones breves, claras y verificadas con el estudiante",
      "Contacto visual frecuente y señales discretas de apoyo (tocar el hombro, clave visual)",
      "Reducción de estímulos visuales innecesarios en el área de trabajo",
      "Rutinas predecibles con transiciones claramente señaladas",
    ],
    estrategiasProceso: [
      "División de tareas largas en segmentos cortos con metas intermedias",
      "Alternancia de actividades estáticas y kinestésicas (cada 15-20 minutos)",
      "Permiso para movimiento funcional en el aula (repartir materiales, escribir en pizarrón)",
      "Uso de listas de verificación y organizadores gráficos para autorregular el trabajo",
    ],
    estrategiasResultado: [
      "Evaluaciones cortas y frecuentes en lugar de pruebas extensas únicas",
      "Tiempo adicional para completar evaluaciones",
      "Evaluaciones en ambiente con mínimas distracciones",
    ],
    recursosEspecificos: [
      "Temporizadores visuales para bloques de trabajo",
      "Objetos de autorregulación (fidgets discretos)",
      "Cascos o audífonos reductores de ruido para concentración",
      "Listas de verificación de pasos para tareas complejas",
      "Aplicaciones de organización y gestión del tiempo",
    ],
  },

  dislexia: {
    id: "dislexia",
    nombre: "Dislexia",
    emoji: "📖",
    descripcionContextual:
      "Estudiante con dificultades específicas en la decodificación y comprensión lectora de base neurológica, que requiere apoyos en el procesamiento del lenguaje escrito.",
    estiloAprendizajeSugerido: "auditivo-kinestésico",
    estrategiasAcceso: [
      "Fuentes sans-serif de tamaño grande (mínimo 14pt) en todos los materiales escritos",
      "Fondos de papel de color crema o amarillo claro en documentos impresos",
      "Texto con mayor espaciado entre líneas y párrafos",
      "Lectura en voz alta de todos los enunciados y consignas",
      "Acceso a versión de audio de los textos de estudio",
    ],
    estrategiasProceso: [
      "Tiempo adicional para actividades que requieran lectura y escritura",
      "Permitir respuestas orales como alternativa a la escritura",
      "Uso de herramientas de síntesis de voz y corrector ortográfico",
      "División de textos largos en párrafos cortos con resaltado de ideas clave",
    ],
    estrategiasResultado: [
      "No penalizar errores ortográficos en evaluaciones cuando el objetivo no sea la ortografía",
      "Permitir evaluación oral en lugar de escrita",
      "Tiempo extendido en evaluaciones escritas",
    ],
    recursosEspecificos: [
      "Aplicaciones con texto a voz (Google Read Along, Immersive Reader)",
      "Papel de color y tipografía amigable para dislexia (OpenDyslexic)",
      "Grabadora para tomar notas en audio",
      "Diccionario visual y mapas conceptuales",
      "Reglas de lectura y marcadores de página",
    ],
  },

  discalculia: {
    id: "discalculia",
    nombre: "Discalculia",
    emoji: "🔢",
    descripcionContextual:
      "Estudiante con dificultades específicas para comprender y manejar conceptos numéricos y operaciones matemáticas de base neurológica.",
    estiloAprendizajeSugerido: "visual-kinestésico",
    estrategiasAcceso: [
      "Uso de materiales concretos y manipulativos para representar cantidades",
      "Referentes visuales permanentes: recta numérica, tabla de multiplicar, fórmulas",
      "Organización espacial clara en hojas de trabajo (cuadriculado)",
      "Codificación de colores para diferentes operaciones o pasos de resolución",
      "Instrucciones verbales acompañadas de ejemplos visuales paso a paso",
    ],
    estrategiasProceso: [
      "Permitir el uso de calculadora para cálculo operativo cuando el objetivo sea la comprensión conceptual",
      "Desglose de problemas en pasos numerados y visibles",
      "Tiempo adicional para tareas matemáticas",
      "Reducción de la cantidad de problemas sin reducir la complejidad conceptual",
    ],
    estrategiasResultado: [
      "Permitir el uso de apoyos visuales (tablas, rectas) en evaluaciones cuando corresponda",
      "Evaluar el proceso de resolución, no solo el resultado final",
      "Reducción del número de ítems en pruebas manteniendo la representatividad",
    ],
    recursosEspecificos: [
      "Material manipulativo: bloques base 10, fichas, ábaco",
      "Hoja cuadriculada para alineación de números",
      "Calculadora científica",
      "Aplicaciones de matemáticas con representación visual (GeoGebra, Khan Academy)",
      "Tablas de referencia y formularios autorizados",
    ],
  },

  trastorno_lenguaje: {
    id: "trastorno_lenguaje",
    nombre: "Trastorno del Lenguaje",
    emoji: "💬",
    descripcionContextual:
      "Estudiante con dificultades en la comprensión y/o expresión del lenguaje oral o escrito que requieren apoyos en la comunicación y en el procesamiento lingüístico.",
    estiloAprendizajeSugerido: "visual-kinestésico",
    estrategiasAcceso: [
      "Lenguaje simple, frases cortas y ritmo lento al hablar",
      "Verificar comprensión pidiendo al estudiante que reformule con sus propias palabras",
      "Apoyo de imágenes, gestos y lenguaje corporal al explicar conceptos",
      "Uso de tableros de comunicación o apoyos alternativos si fuera necesario",
      "Tiempo adicional para procesar instrucciones verbales antes de responder",
    ],
    estrategiasProceso: [
      "Actividades con menos demanda lingüística cuando el objetivo no sea el lenguaje",
      "Respuestas alternativas: señalar, dibujar, seleccionar entre opciones",
      "Apoyo del logopeda/fonoaudiólogo en clase o en sesiones de apoyo",
      "Uso de organizadores visuales para estructurar el discurso antes de hablar o escribir",
    ],
    estrategiasResultado: [
      "Diversificar formatos de evaluación: dibujo, selección múltiple, demostración práctica",
      "No penalizar la fluidez o la forma cuando el objetivo es la comprensión del contenido",
      "Evaluación oral en formato de diálogo en lugar de exposición formal",
    ],
    recursosEspecificos: [
      "Tableros de comunicación pictográfica",
      "Aplicaciones CAA (Proloquo, LetMe Talk)",
      "Tarjetas de vocabulario visual-conceptual",
      "Grabadora para autoevaluación del lenguaje",
      "Organizadores gráficos para planificar el discurso",
    ],
  },

  altas_capacidades: {
    id: "altas_capacidades",
    nombre: "Altas Capacidades / Superdotación",
    emoji: "⭐",
    descripcionContextual:
      "Estudiante con capacidad intelectual, creativa o de rendimiento notablemente superior al promedio, que requiere enriquecimiento, complejización y mayor desafío para mantener la motivación.",
    estiloAprendizajeSugerido: "lector/escritor-visual",
    estrategiasAcceso: [
      "Proyectos de enriquecimiento que profundicen o amplíen la destreza más allá del nivel del grado",
      "Conexión con contenidos de niveles superiores o áreas transversales",
      "Oportunidades de aprendizaje autodirigido e investigación independiente",
      "Uso de recursos bibliográficos avanzados y fuentes primarias",
      "Mentorías con docentes especializados o profesionales externos",
    ],
    estrategiasProceso: [
      "Compactación del currículo: acelerar partes ya dominadas para profundizar otras",
      "Proyectos de investigación con grado de autonomía progresivo",
      "Rol de mediador o experto en el grupo para fomentar habilidades sociales",
      "Desafíos de pensamiento crítico, creativo y de resolución de problemas complejos",
    ],
    estrategiasResultado: [
      "Criterios de evaluación que valoren pensamiento divergente y profundidad",
      "Opciones de demostración alternativas: investigaciones, ensayos, proyectos creativos",
      "Portafolio de aprendizaje que evidencie la profundidad del proceso",
    ],
    recursosEspecificos: [
      "Libros de referencia avanzados y artículos científicos adaptados",
      "Plataformas de aprendizaje enriquecido (Khan Academy, Coursera for Schools)",
      "Proyectos STEM, concursos académicos y olimpiadas",
      "Software especializado (GeoGebra avanzado, Scratch, Arduino)",
      "Acceso a biblioteca digital y bases de datos educativas",
    ],
  },

  dificultades_socioemocionales: {
    id: "dificultades_socioemocionales",
    nombre: "Dificultades Socioemocionales",
    emoji: "💛",
    descripcionContextual:
      "Estudiante que presenta dificultades en la regulación emocional, las habilidades sociales o la adaptación al entorno escolar, lo que puede afectar su participación y rendimiento académico.",
    estiloAprendizajeSugerido: "kinestésico-visual",
    estrategiasAcceso: [
      "Ambiente de aula seguro, predecible y emocionalmente positivo",
      "Establecimiento de vínculos de confianza con el docente y los pares",
      "Señales de calma y apoyo discretas (palabras de aliento, lenguaje corporal cálido)",
      "Rutinas claras que reduzcan la incertidumbre y la ansiedad",
      "Espacio de descanso emocional disponible dentro o fuera del aula",
    ],
    estrategiasProceso: [
      "Actividades cooperativas con roles definidos que faciliten la integración social",
      "Inicio gradual con tareas de menor exigencia para construir confianza",
      "Retroalimentación positiva frecuente, enfocada en el esfuerzo y el progreso",
      "Incorporación de la dimensión socioemocional en las actividades de aprendizaje",
    ],
    estrategiasResultado: [
      "Evaluación del proceso y el esfuerzo con igual o mayor peso que el producto",
      "Autoevaluación y coevaluación para desarrollar autonomía y reflexión",
      "Flexibilidad en plazos de entrega ante situaciones de crisis emocional documentadas",
    ],
    recursosEspecificos: [
      "Termómetro emocional o ruleta de emociones",
      "Actividades de mindfulness o regulación emocional",
      "Cuentos y literatura socioemocional",
      "Apoyo del departamento de orientación y bienestar",
      "Cuaderno de emociones o diario reflexivo",
    ],
  },

  otra: {
    id: "otra",
    nombre: "Otra NEE",
    emoji: "📋",
    descripcionContextual:
      "Necesidad educativa especial no clasificada en las categorías anteriores. Se aplicarán adaptaciones en función del perfil pedagógico específico del estudiante.",
    estiloAprendizajeSugerido: "a determinar por el docente",
    estrategiasAcceso: [
      "Identificar las barreras de acceso específicas del estudiante y eliminarlas",
      "Adaptar el formato y presentación de materiales según las necesidades identificadas",
      "Establecer apoyos humanos o tecnológicos según requiera el caso",
      "Mantener comunicación constante con la familia y el equipo de apoyo",
    ],
    estrategiasProceso: [
      "Flexibilizar tiempos y ritmos de trabajo según las capacidades del estudiante",
      "Diseñar actividades multinivel que permitan distintos niveles de participación",
      "Brindar andamiaje individualizado durante el proceso de aprendizaje",
    ],
    estrategiasResultado: [
      "Diversificar los formatos e instrumentos de evaluación",
      "Adaptar los criterios de evaluación al nivel de desempeño esperado del estudiante",
      "Incluir autoevaluación como parte del proceso evaluativo",
    ],
    recursosEspecificos: [
      "Materiales adaptados según el perfil específico del estudiante",
      "Tecnología asistiva adecuada a la necesidad identificada",
      "Apoyo del equipo de Departamento de Consejería Estudiantil (DECE)",
    ],
  },
};
