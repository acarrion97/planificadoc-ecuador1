import { Area } from "./types";

/**
 * Diseño Universal para el Aprendizaje (DUA)
 * Basado en los 3 principios del CAST (Center for Applied Special Technology)
 * Adaptado al contexto educativo ecuatoriano según lineamientos del MinEduc.
 */

export interface EstrategiaDUA {
  principio: "representacion" | "accion_expresion" | "implicacion";
  titulo: string;
  descripcion: string;
}

export interface DUAPlanificacion {
  representacion: string[];
  accionExpresion: string[];
  implicacion: string[];
}

/**
 * Nombres de los 3 principios DUA
 */
export const DUA_PRINCIPIOS = {
  representacion: {
    nombre: "Múltiples formas de Representación",
    subtitulo: "El QUÉ del aprendizaje",
    descripcion: "Proporcionar múltiples formas de presentar la información y el contenido.",
    icono: "visibility",
  },
  accionExpresion: {
    nombre: "Múltiples formas de Acción y Expresión",
    subtitulo: "El CÓMO del aprendizaje",
    descripcion: "Proporcionar múltiples formas para que el estudiante demuestre lo que sabe.",
    icono: "edit",
  },
  implicacion: {
    nombre: "Múltiples formas de Implicación",
    subtitulo: "El POR QUÉ del aprendizaje",
    descripcion: "Proporcionar múltiples formas de motivar e involucrar al estudiante.",
    icono: "favorite",
  },
};

/**
 * Estrategias DUA generales aplicables a todas las áreas
 */
const ESTRATEGIAS_GENERALES: DUAPlanificacion = {
  representacion: [
    "Presentar la información en formato visual (imágenes, diagramas, organizadores gráficos) y auditivo (explicación oral, audio).",
    "Utilizar vocabulario clave con definiciones claras y ejemplos concretos del contexto ecuatoriano.",
    "Ofrecer material impreso con letra ampliada y alto contraste para estudiantes con dificultades visuales.",
    "Activar conocimientos previos mediante preguntas generadoras y lluvia de ideas.",
  ],
  accionExpresion: [
    "Permitir que los estudiantes elijan cómo demostrar su aprendizaje: oral, escrito, gráfico o práctico.",
    "Proporcionar modelos y ejemplos resueltos paso a paso antes de la práctica independiente.",
    "Ofrecer herramientas de apoyo: calculadora, diccionario, plantillas, organizadores gráficos.",
    "Graduar la complejidad de las actividades (básico, intermedio, avanzado) según el ritmo de cada estudiante.",
  ],
  implicacion: [
    "Relacionar el contenido con situaciones reales y cotidianas del entorno del estudiante.",
    "Fomentar el trabajo colaborativo en parejas y grupos pequeños heterogéneos.",
    "Ofrecer retroalimentación inmediata, positiva y constructiva durante todo el proceso.",
    "Permitir la elección de temas o actividades dentro del marco curricular para aumentar la autonomía.",
  ],
};

/**
 * Estrategias DUA específicas por área curricular
 */
const ESTRATEGIAS_POR_AREA: Record<Area, DUAPlanificacion> = {
  M: {
    representacion: [
      "Utilizar material concreto y manipulativo (regletas, ábacos, bloques lógicos) para representar conceptos abstractos.",
      "Presentar los problemas matemáticos con apoyo visual: dibujos, diagramas, tablas y gráficos.",
      "Ofrecer múltiples representaciones del mismo concepto: concreto, pictórico y simbólico (método CPA).",
      "Usar colores diferentes para distinguir operaciones, signos y pasos en la resolución de problemas.",
    ],
    accionExpresion: [
      "Permitir el uso de calculadora para estudiantes que dominan el concepto pero tienen dificultad en el cálculo.",
      "Ofrecer plantillas con pasos guiados para la resolución de problemas (Entender, Planificar, Resolver, Verificar).",
      "Aceptar diferentes estrategias de resolución: algoritmo tradicional, descomposición, estimación, dibujo.",
      "Proporcionar ejercicios con diferentes niveles de complejidad para que cada estudiante avance a su ritmo.",
    ],
    implicacion: [
      "Plantear problemas matemáticos contextualizados en la realidad ecuatoriana (mercados, tiendas, recetas locales).",
      "Organizar juegos matemáticos y competencias amistosas por equipos para motivar la participación.",
      "Celebrar los avances individuales, no solo los resultados correctos, valorando el proceso de razonamiento.",
      "Utilizar aplicaciones y recursos digitales interactivos cuando estén disponibles.",
    ],
  },
  LL: {
    representacion: [
      "Acompañar los textos escritos con imágenes, pictogramas o ilustraciones que faciliten la comprensión.",
      "Ofrecer textos en diferentes formatos: impreso, digital, audio (lectura en voz alta por el docente).",
      "Utilizar organizadores gráficos (mapas conceptuales, secuencias, causa-efecto) para estructurar la información.",
      "Presentar vocabulario nuevo con definiciones sencillas, sinónimos y ejemplos en contexto.",
    ],
    accionExpresion: [
      "Permitir la expresión oral como alternativa a la escrita para estudiantes con dificultades de escritura.",
      "Ofrecer plantillas y esquemas para la producción de textos (inicio, desarrollo, cierre).",
      "Aceptar diferentes formatos de producción: texto escrito, dibujo con descripción, grabación de audio, dramatización.",
      "Proporcionar listas de cotejo para la autorrevisión de textos antes de la entrega final.",
    ],
    implicacion: [
      "Seleccionar textos de lectura relacionados con la cultura ecuatoriana, leyendas locales y tradiciones.",
      "Fomentar la lectura compartida y los círculos de lectura entre compañeros.",
      "Permitir la libre elección de temas para la producción escrita dentro del tipo textual estudiado.",
      "Crear un ambiente de confianza donde el error sea parte natural del proceso de aprendizaje.",
    ],
  },
  CN: {
    representacion: [
      "Utilizar maquetas, modelos tridimensionales y material del entorno natural para explicar fenómenos.",
      "Presentar videos, imágenes y láminas didácticas que ilustren los procesos científicos.",
      "Usar organizadores gráficos para clasificar, comparar y relacionar conceptos científicos.",
      "Realizar demostraciones prácticas y experimentos sencillos con materiales accesibles.",
    ],
    accionExpresion: [
      "Permitir que los estudiantes registren sus observaciones mediante dibujos, esquemas o texto.",
      "Ofrecer guías de laboratorio con pasos claros e ilustrados para los experimentos.",
      "Aceptar diferentes formas de presentar conclusiones: exposición oral, póster, maqueta, infografía.",
      "Proporcionar fichas de observación estructuradas con espacios para dibujar y escribir.",
    ],
    implicacion: [
      "Relacionar los contenidos con el entorno natural ecuatoriano: biodiversidad, ecosistemas locales, Galápagos.",
      "Fomentar la curiosidad científica mediante preguntas generadoras y situaciones problema del contexto.",
      "Organizar salidas de campo o recorridos por el entorno escolar para observación directa.",
      "Promover proyectos de investigación sencillos sobre temas de interés del estudiante.",
    ],
  },
  CS: {
    representacion: [
      "Utilizar líneas de tiempo, mapas históricos y geográficos para contextualizar los hechos.",
      "Presentar relatos, testimonios y fuentes primarias adaptadas al nivel del estudiante.",
      "Usar material audiovisual: documentales cortos, fotografías históricas, mapas interactivos.",
      "Ofrecer organizadores gráficos para comparar épocas, culturas, formas de gobierno.",
    ],
    accionExpresion: [
      "Permitir la dramatización de hechos históricos como forma de demostrar comprensión.",
      "Aceptar diferentes productos: ensayos, líneas de tiempo, mapas conceptuales, presentaciones orales.",
      "Ofrecer guías de análisis de fuentes históricas con preguntas orientadoras.",
      "Fomentar el debate estructurado con roles asignados para desarrollar el pensamiento crítico.",
    ],
    implicacion: [
      "Conectar los hechos históricos con la realidad actual del Ecuador y la comunidad local.",
      "Promover la investigación sobre la historia local, familiar y comunitaria.",
      "Organizar simulaciones de asambleas, elecciones o resolución de conflictos para vivenciar la ciudadanía.",
      "Valorar la diversidad cultural ecuatoriana: pueblos y nacionalidades, tradiciones, cosmovisiones.",
    ],
  },
  EF: {
    representacion: [
      "Demostrar los movimientos y ejercicios de forma visual antes de solicitar la ejecución.",
      "Utilizar señales visuales (conos de colores, líneas en el piso) para delimitar espacios y recorridos.",
      "Ofrecer instrucciones verbales claras, cortas y acompañadas de gestos demostrativos.",
      "Presentar videos o imágenes de la técnica correcta como referencia visual.",
    ],
    accionExpresion: [
      "Adaptar las actividades físicas según las capacidades individuales (distancia, velocidad, complejidad).",
      "Ofrecer opciones de participación: ejecutar, arbitrar, registrar, animar, según la condición del estudiante.",
      "Permitir el uso de implementos adaptados para estudiantes con necesidades especiales.",
      "Graduar la exigencia física respetando el ritmo y las posibilidades de cada estudiante.",
    ],
    implicacion: [
      "Incluir juegos tradicionales ecuatorianos (rayuela, trompo, canicas, pelota nacional) en las actividades.",
      "Fomentar el juego limpio, el respeto y la cooperación por encima de la competencia.",
      "Permitir que los estudiantes propongan y organicen actividades físicas y juegos.",
      "Celebrar la participación y el esfuerzo individual, no solo el rendimiento deportivo.",
    ],
  },
  ECA: {
    representacion: [
      "Presentar obras artísticas de diferentes culturas ecuatorianas como referencia e inspiración.",
      "Ofrecer múltiples estímulos sensoriales: visual, auditivo, táctil, kinestésico.",
      "Utilizar ejemplos de técnicas artísticas con demostraciones paso a paso.",
      "Mostrar el proceso creativo de artistas ecuatorianos como modelo de referencia.",
    ],
    accionExpresion: [
      "Permitir la libre elección de materiales y técnicas artísticas para la creación.",
      "Aceptar diferentes formas de expresión: dibujo, pintura, modelado, música, danza, teatro.",
      "Ofrecer plantillas o guías opcionales para estudiantes que necesiten estructura inicial.",
      "Valorar el proceso creativo tanto como el producto final.",
    ],
    implicacion: [
      "Incorporar manifestaciones artísticas y culturales de los pueblos y nacionalidades del Ecuador.",
      "Fomentar la expresión de emociones, ideas y experiencias personales a través del arte.",
      "Organizar exposiciones y presentaciones artísticas para que los estudiantes compartan su trabajo.",
      "Crear un ambiente de respeto donde toda expresión artística sea valorada sin juicio.",
    ],
  },
};

/**
 * Obtiene las estrategias DUA sugeridas para un área curricular.
 * Combina estrategias generales con las específicas del área.
 */
export function obtenerEstrategiasDUA(area: Area): DUAPlanificacion {
  const especificas = ESTRATEGIAS_POR_AREA[area];
  return {
    representacion: [...especificas.representacion],
    accionExpresion: [...especificas.accionExpresion],
    implicacion: [...especificas.implicacion],
  };
}

/**
 * Obtiene las estrategias DUA generales (aplicables a cualquier área).
 */
export function obtenerEstrategiasGeneralesDUA(): DUAPlanificacion {
  return {
    representacion: [...ESTRATEGIAS_GENERALES.representacion],
    accionExpresion: [...ESTRATEGIAS_GENERALES.accionExpresion],
    implicacion: [...ESTRATEGIAS_GENERALES.implicacion],
  };
}

/**
 * Genera un texto formateado con las estrategias DUA para incluir en la planificación.
 */
export function generarTextoDUA(area: Area): string {
  const estrategias = obtenerEstrategiasDUA(area);
  const lineas: string[] = [];

  lineas.push("PRINCIPIO 1: MÚLTIPLES FORMAS DE REPRESENTACIÓN");
  lineas.push("(El QUÉ del aprendizaje)");
  estrategias.representacion.forEach((e, i) => {
    lineas.push(`${i + 1}. ${e}`);
  });

  lineas.push("");
  lineas.push("PRINCIPIO 2: MÚLTIPLES FORMAS DE ACCIÓN Y EXPRESIÓN");
  lineas.push("(El CÓMO del aprendizaje)");
  estrategias.accionExpresion.forEach((e, i) => {
    lineas.push(`${i + 1}. ${e}`);
  });

  lineas.push("");
  lineas.push("PRINCIPIO 3: MÚLTIPLES FORMAS DE IMPLICACIÓN");
  lineas.push("(El POR QUÉ del aprendizaje)");
  estrategias.implicacion.forEach((e, i) => {
    lineas.push(`${i + 1}. ${e}`);
  });

  return lineas.join("\n");
}
