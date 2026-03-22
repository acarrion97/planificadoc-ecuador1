import { Destreza, TemaSugerido, Area, AREAS_INFO } from "./types";

/**
 * Genera temas sugeridos para una destreza dada.
 * Cada tema incluye una estructura de clase completa con el ciclo ERCA:
 * Experiencia (Anticipación) → Reflexión (Construcción) → Conceptualización (Consolidación) → Aplicación (Retroalimentación)
 */

// ============================================================
// BANCO DE TEMAS POR ÁREA, BLOQUE Y SUBNIVEL
// ============================================================

interface TemaBase {
  /** Patrón de código: "M.2.1" = Matemática, subnivel 2, bloque 1 */
  patron: string;
  temas: Omit<TemaSugerido, "id">[];
}

const BANCO_TEMAS: TemaBase[] = [
  // ==========================================
  // MATEMÁTICA - Básica Elemental (Subnivel 2)
  // ==========================================
  {
    patron: "M.2.1",
    temas: [
      {
        titulo: "Jugando con conjuntos y clasificaciones",
        descripcionBreve: "Los estudiantes clasifican objetos del aula por color, forma y tamaño para formar conjuntos.",
        objetivoClase: "Representar gráficamente conjuntos discriminando propiedades de los objetos mediante actividades lúdicas y manipulativas.",
        estructura: {
          anticipacion: {
            titulo: "Activación de conocimientos previos",
            duracion: "10 minutos",
            actividades: [
              "Dinámica de inicio: El docente coloca en una mesa objetos variados (bloques de colores, figuras geométricas, lápices, borradores) y pregunta: ¿Cómo podríamos agrupar estos objetos?",
              "Lluvia de ideas: Los estudiantes proponen criterios de clasificación (por color, tamaño, forma, uso).",
              "El docente registra las ideas en la pizarra y pregunta: ¿Qué tienen en común los objetos de cada grupo?",
              "Exploración de conocimientos previos: ¿Alguna vez han agrupado cosas en su casa? ¿Cómo lo hicieron?"
            ],
          },
          construccion: {
            titulo: "Construcción del conocimiento",
            duracion: "20 minutos",
            actividades: [
              "El docente presenta el concepto de CONJUNTO como una agrupación de elementos que comparten una característica común.",
              "Trabajo con material concreto: Cada grupo recibe una bolsa con objetos variados y debe formar al menos 3 conjuntos diferentes.",
              "Representación gráfica: Los estudiantes dibujan diagramas de Venn en papelotes para representar sus conjuntos.",
              "El docente explica los elementos de un diagrama de Venn: nombre del conjunto, elementos, línea de frontera.",
              "Práctica guiada: Juntos resuelven un ejercicio de clasificación en el texto del estudiante."
            ],
          },
          consolidacion: {
            titulo: "Consolidación y práctica",
            duracion: "15 minutos",
            actividades: [
              "Trabajo individual: Cada estudiante dibuja 2 conjuntos con objetos de su entorno (útiles escolares, frutas, animales).",
              "Juego 'El conjunto veloz': El docente nombra una característica y los estudiantes deben agruparse según esa característica (color de camiseta, tipo de zapato, etc.).",
              "Resolución de ejercicios del cuaderno de trabajo (página correspondiente).",
              "Los estudiantes comparten sus conjuntos con un compañero y verifican si la clasificación es correcta."
            ],
          },
          retroalimentacion: {
            titulo: "Retroalimentación y cierre",
            duracion: "10 minutos",
            actividades: [
              "Puesta en común: 3 estudiantes presentan sus conjuntos al grupo y explican el criterio de clasificación.",
              "El docente realiza preguntas de verificación: ¿Qué es un conjunto? ¿Qué necesitamos para formar un conjunto?",
              "Corrección colectiva de errores comunes (elementos que no pertenecen al conjunto, falta de criterio claro).",
              "Tarea para casa: Formar 3 conjuntos con objetos de su hogar y dibujarlos en el cuaderno.",
              "Metacognición: ¿Qué aprendimos hoy? ¿Para qué nos sirve clasificar objetos?"
            ],
          },
        },
        recursos: ["Objetos variados del aula (bloques, figuras, lápices)", "Papelotes y marcadores de colores", "Texto del estudiante", "Cuaderno de trabajo", "Diagramas de Venn impresos"],
        evaluacionFormativa: "Lista de cotejo: Identifica propiedades de objetos / Forma conjuntos con criterio claro / Representa conjuntos gráficamente / Explica el criterio de clasificación.",
      },
      {
        titulo: "Patrones con figuras y colores",
        descripcionBreve: "Descubrir y crear patrones usando figuras geométricas y colores en secuencias repetitivas.",
        objetivoClase: "Describir y reproducir patrones de objetos y figuras basándose en sus atributos de forma, color y tamaño.",
        estructura: {
          anticipacion: {
            titulo: "Activación de conocimientos previos",
            duracion: "10 minutos",
            actividades: [
              "El docente muestra una secuencia de figuras en la pizarra (círculo rojo, cuadrado azul, círculo rojo, cuadrado azul, ?) y pregunta: ¿Qué figura sigue?",
              "Los estudiantes observan patrones en el aula: baldosas del piso, diseños de cortinas, decoraciones.",
              "Pregunta generadora: ¿Dónde más han visto secuencias que se repiten? (collares, telas, música).",
              "Juego rítmico: Palmada-golpe-palmada-golpe... ¿Qué sigue?"
            ],
          },
          construccion: {
            titulo: "Construcción del conocimiento",
            duracion: "20 minutos",
            actividades: [
              "El docente define PATRÓN como una secuencia que se repite siguiendo una regla.",
              "Trabajo con material concreto: Usando bloques lógicos, los estudiantes reproducen patrones dados por el docente.",
              "Complejidad creciente: Patrones de 2 elementos → 3 elementos → 4 elementos.",
              "Los estudiantes identifican el 'núcleo' del patrón (la parte que se repite).",
              "Registro en el cuaderno: Dibujan los patrones trabajados y colorean siguiendo la secuencia."
            ],
          },
          consolidacion: {
            titulo: "Consolidación y práctica",
            duracion: "15 minutos",
            actividades: [
              "Creación libre: Cada estudiante inventa su propio patrón usando al menos 3 atributos diferentes.",
              "Intercambio: Los compañeros deben descubrir la regla del patrón y continuarlo.",
              "Desafío: El docente presenta patrones con errores y los estudiantes deben encontrar el error.",
              "Trabajo en el cuaderno de actividades con ejercicios de completar patrones."
            ],
          },
          retroalimentacion: {
            titulo: "Retroalimentación y cierre",
            duracion: "10 minutos",
            actividades: [
              "Galería de patrones: Los estudiantes exhiben sus creaciones y los compañeros las recorren.",
              "Preguntas de cierre: ¿Qué es un patrón? ¿Cómo identificamos la regla de un patrón?",
              "El docente refuerza conceptos clave y aclara dudas.",
              "Tarea: Buscar 3 patrones en su casa o comunidad y dibujarlos.",
              "Autoevaluación: ¿Pude crear mi propio patrón? ¿Pude descubrir el patrón de mi compañero?"
            ],
          },
        },
        recursos: ["Bloques lógicos", "Fichas de colores", "Cuaderno cuadriculado", "Lápices de colores", "Texto del estudiante"],
        evaluacionFormativa: "Rúbrica: Identifica el núcleo del patrón / Reproduce patrones dados / Crea patrones originales / Explica la regla del patrón.",
      },
      {
        titulo: "Sumas y restas en la tienda escolar",
        descripcionBreve: "Simulación de compra-venta para practicar sumas y restas con números hasta 4 cifras.",
        objetivoClase: "Resolver problemas de sumas y restas con números hasta cuatro cifras en contextos de la vida cotidiana.",
        estructura: {
          anticipacion: {
            titulo: "Activación de conocimientos previos",
            duracion: "10 minutos",
            actividades: [
              "El docente presenta una situación: 'María tiene $25 y quiere comprar un cuaderno de $8 y un lápiz de $3. ¿Le alcanza el dinero? ¿Cuánto le sobra?'",
              "Los estudiantes resuelven mentalmente y comparten sus estrategias.",
              "Repaso rápido: Tabla posicional (unidades, decenas, centenas, unidades de mil).",
              "Pregunta motivadora: ¿Alguna vez han ayudado a comprar en la tienda? ¿Cómo calculan el vuelto?"
            ],
          },
          construccion: {
            titulo: "Construcción del conocimiento",
            duracion: "20 minutos",
            actividades: [
              "Montaje de la 'Tienda Escolar': El docente coloca productos con precios (útiles escolares, alimentos) en una mesa.",
              "El docente modela el proceso: Seleccionar productos → Sumar precios → Calcular vuelto (resta).",
              "Trabajo con material concreto: Billetes y monedas didácticas para representar las cantidades.",
              "Explicación del algoritmo de suma y resta con reagrupación usando la tabla posicional.",
              "Práctica guiada: Resuelven 3 problemas juntos paso a paso."
            ],
          },
          consolidacion: {
            titulo: "Consolidación y práctica",
            duracion: "15 minutos",
            actividades: [
              "Juego de roles: En parejas, uno es vendedor y otro comprador. Deben realizar transacciones y calcular correctamente.",
              "Cada pareja registra 4 transacciones en su cuaderno con las operaciones completas.",
              "Desafío: Problemas con datos faltantes ('Compré 3 cosas y pagué $45. Si dos cosas costaron $12 y $18, ¿cuánto costó la tercera?').",
              "Verificación cruzada: Las parejas intercambian cuadernos y revisan las operaciones."
            ],
          },
          retroalimentacion: {
            titulo: "Retroalimentación y cierre",
            duracion: "10 minutos",
            actividades: [
              "Socialización: 2 parejas presentan sus transacciones más interesantes.",
              "El docente revisa errores comunes: olvido de reagrupación, errores en la tabla posicional.",
              "Preguntas de cierre: ¿Cuándo usamos la suma en la vida diaria? ¿Y la resta?",
              "Tarea: Acompañar a un familiar a la tienda y registrar 3 compras con sus operaciones.",
              "Reflexión: ¿Qué fue lo más difícil? ¿Qué estrategia me ayudó más?"
            ],
          },
        },
        recursos: ["Billetes y monedas didácticas", "Productos con etiquetas de precios", "Tabla posicional impresa", "Cuaderno cuadriculado", "Texto del estudiante"],
        evaluacionFormativa: "Lista de cotejo: Suma correctamente con reagrupación / Resta correctamente con reagrupación / Interpreta el problema / Verifica su respuesta.",
      },
    ],
  },

  // ==========================================
  // MATEMÁTICA - Básica Media (Subnivel 3)
  // ==========================================
  {
    patron: "M.3.1",
    temas: [
      {
        titulo: "Sucesiones numéricas en la naturaleza",
        descripcionBreve: "Explorar patrones numéricos presentes en la naturaleza y generar sucesiones con las cuatro operaciones.",
        objetivoClase: "Generar sucesiones con sumas, restas, multiplicaciones y divisiones a partir de patrones encontrados en la naturaleza.",
        estructura: {
          anticipacion: {
            titulo: "Activación de conocimientos previos",
            duracion: "10 minutos",
            actividades: [
              "El docente muestra imágenes de patrones en la naturaleza: pétalos de flores (3, 5, 8, 13...), espirales de caracoles, ramas de árboles.",
              "Pregunta generadora: ¿Notan algún patrón numérico en estas imágenes?",
              "Repaso: ¿Qué es una secuencia? ¿Qué secuencias conocen? (números pares, impares, tablas de multiplicar).",
              "Actividad rápida: Completar la secuencia 2, 5, 8, 11, __, __, __. ¿Cuál es la regla?"
            ],
          },
          construccion: {
            titulo: "Construcción del conocimiento",
            duracion: "20 minutos",
            actividades: [
              "El docente define SUCESIÓN como una secuencia ordenada de números que sigue una regla matemática.",
              "Tipos de sucesiones: Aditivas (+), Sustractivas (-), Multiplicativas (×), Divisivas (÷).",
              "Ejemplo de cada tipo con material concreto (fichas, regletas).",
              "Los estudiantes identifican la regla de formación en 5 sucesiones diferentes presentadas en la pizarra.",
              "Trabajo en el texto: Lectura y análisis de ejemplos resueltos."
            ],
          },
          consolidacion: {
            titulo: "Consolidación y práctica",
            duracion: "15 minutos",
            actividades: [
              "Trabajo en equipos: Cada equipo recibe una tarjeta con una sucesión incompleta y debe encontrar la regla y completarla.",
              "Creación: Cada equipo inventa 2 sucesiones (una aditiva y una multiplicativa) para desafiar a otro equipo.",
              "Resolución de problemas: 'Un árbol tiene 3 ramas en el primer nivel, 9 en el segundo, 27 en el tercero. ¿Cuántas tendrá en el quinto nivel?'",
              "Ubicación de sucesiones en el plano cartesiano (pares ordenados)."
            ],
          },
          retroalimentacion: {
            titulo: "Retroalimentación y cierre",
            duracion: "10 minutos",
            actividades: [
              "Competencia de sucesiones: El docente dicta el inicio de una sucesión y los equipos compiten por completarla primero.",
              "Revisión de errores frecuentes: confundir operación, saltar términos.",
              "Conexión con la vida real: ¿Dónde encontramos sucesiones? (crecimiento poblacional, ahorro semanal, etc.).",
              "Tarea: Crear un 'álbum de sucesiones' con 5 sucesiones diferentes encontradas en su entorno.",
              "Autoevaluación: Semáforo (verde = entendí todo, amarillo = tengo algunas dudas, rojo = necesito ayuda)."
            ],
          },
        },
        recursos: ["Imágenes de patrones naturales", "Fichas numéricas", "Regletas de Cuisenaire", "Cuaderno cuadriculado", "Texto del estudiante", "Calculadora"],
        evaluacionFormativa: "Rúbrica: Identifica la regla de formación / Completa sucesiones correctamente / Crea sucesiones propias / Resuelve problemas con sucesiones.",
      },
      {
        titulo: "Operaciones combinadas: el orden importa",
        descripcionBreve: "Aprender la jerarquía de operaciones resolviendo problemas de la vida cotidiana.",
        objetivoClase: "Resolver problemas que requieran el uso de operaciones combinadas con números naturales respetando la jerarquía de operaciones.",
        estructura: {
          anticipacion: {
            titulo: "Activación de conocimientos previos",
            duracion: "10 minutos",
            actividades: [
              "El docente escribe en la pizarra: 3 + 4 × 2 = ? y pide a los estudiantes que resuelvan.",
              "Debate: Algunos dirán 14, otros 11. ¿Quién tiene razón y por qué?",
              "Repaso de las cuatro operaciones básicas y sus propiedades.",
              "Pregunta motivadora: ¿Existe un orden para resolver operaciones? ¿Importa el orden?"
            ],
          },
          construccion: {
            titulo: "Construcción del conocimiento",
            duracion: "20 minutos",
            actividades: [
              "El docente presenta la JERARQUÍA DE OPERACIONES: 1° Paréntesis, 2° Multiplicación y División, 3° Suma y Resta.",
              "Regla mnemotécnica: 'Primero los Paréntesis, luego Multiplicar y Dividir, finalmente Sumar y Restar'.",
              "Resolución paso a paso de 4 ejercicios de complejidad creciente.",
              "Los estudiantes copian los pasos y resuelven junto al docente.",
              "Uso de la calculadora para verificar resultados."
            ],
          },
          consolidacion: {
            titulo: "Consolidación y práctica",
            duracion: "15 minutos",
            actividades: [
              "Trabajo en parejas: Resolver 6 ejercicios de operaciones combinadas.",
              "Problema contextualizado: 'En la feria, Juan compró 3 empanadas a $2 cada una y 2 jugos a $1.50 cada uno. Si pagó con $20, ¿cuánto recibió de vuelto?'",
              "Desafío inverso: Dado el resultado, crear la expresión con operaciones combinadas.",
              "Verificación con calculadora."
            ],
          },
          retroalimentacion: {
            titulo: "Retroalimentación y cierre",
            duracion: "10 minutos",
            actividades: [
              "Corrección colectiva de los ejercicios en la pizarra.",
              "El docente identifica y corrige errores comunes.",
              "Juego 'Verdadero o Falso' con expresiones resueltas (algunas correctas, otras con errores de jerarquía).",
              "Tarea: 5 ejercicios de operaciones combinadas del texto.",
              "Reflexión final: ¿Por qué es importante respetar el orden de las operaciones?"
            ],
          },
        },
        recursos: ["Pizarra y marcadores", "Calculadora", "Texto del estudiante", "Cuaderno cuadriculado", "Tarjetas con ejercicios"],
        evaluacionFormativa: "Prueba corta: 4 ejercicios de operaciones combinadas con diferente nivel de complejidad. Criterio: aplica correctamente la jerarquía.",
      },
      {
        titulo: "Coordenadas cartesianas: el mapa del tesoro",
        descripcionBreve: "Usar el plano cartesiano como un mapa para ubicar puntos y descubrir figuras ocultas.",
        objetivoClase: "Leer y ubicar pares ordenados en el sistema de coordenadas rectangulares con números naturales.",
        estructura: {
          anticipacion: {
            titulo: "Activación de conocimientos previos",
            duracion: "10 minutos",
            actividades: [
              "El docente presenta un mapa cuadriculado del aula y pregunta: ¿Cómo le indicarían a alguien dónde está su pupitre?",
              "Juego 'Batalla Naval' simplificado: Los estudiantes ya conocen el concepto de ubicar con filas y columnas.",
              "Pregunta: ¿Conocen los mapas con cuadrículas? ¿Cómo se ubican los lugares?",
              "El docente dibuja una cuadrícula simple en la pizarra y coloca un punto."
            ],
          },
          construccion: {
            titulo: "Construcción del conocimiento",
            duracion: "20 minutos",
            actividades: [
              "El docente presenta el PLANO CARTESIANO: eje X (horizontal), eje Y (vertical), origen (0,0).",
              "Explicación de PAR ORDENADO (x, y): primero horizontal, luego vertical.",
              "Práctica guiada: Ubicar 5 puntos dados en un plano cartesiano grande en la pizarra.",
              "Los estudiantes copian el plano en su cuaderno cuadriculado y ubican los mismos puntos.",
              "Lectura de coordenadas: Dado un punto en el plano, escribir su par ordenado."
            ],
          },
          consolidacion: {
            titulo: "Consolidación y práctica",
            duracion: "15 minutos",
            actividades: [
              "Actividad 'El Mapa del Tesoro': Los estudiantes reciben una hoja con un plano cartesiano y una lista de coordenadas. Al unir los puntos en orden, se forma una figura (estrella, casa, animal).",
              "Trabajo en parejas: Un estudiante dicta coordenadas y el otro las ubica. Luego intercambian roles.",
              "Creación: Cada estudiante diseña su propia figura oculta con coordenadas para que un compañero la descubra.",
              "Resolución de ejercicios del texto."
            ],
          },
          retroalimentacion: {
            titulo: "Retroalimentación y cierre",
            duracion: "10 minutos",
            actividades: [
              "Presentación de las figuras ocultas más creativas.",
              "Corrección de errores comunes: invertir x e y, contar desde 1 en vez de 0.",
              "Conexión con la vida real: GPS, mapas de Google, planos de ciudades.",
              "Tarea: Dibujar una figura en el plano cartesiano y escribir las coordenadas de cada vértice.",
              "Evaluación formativa: Ubicar 3 puntos dados por el docente en una hoja cuadriculada."
            ],
          },
        },
        recursos: ["Plano cartesiano grande para pizarra", "Hojas cuadriculadas", "Regla", "Lápices de colores", "Hojas con actividad 'Mapa del Tesoro'", "Texto del estudiante"],
        evaluacionFormativa: "Ejercicio práctico: Ubicar 5 pares ordenados en el plano cartesiano y leer las coordenadas de 5 puntos ya ubicados. Criterio: precisión en la ubicación.",
      },
    ],
  },

  // ==========================================
  // MATEMÁTICA - Básica Media, Bloque 2 (Geometría)
  // ==========================================
  {
    patron: "M.3.2",
    temas: [
      {
        titulo: "Explorando ángulos con el transportador",
        descripcionBreve: "Medir y clasificar ángulos usando el transportador en objetos del entorno.",
        objetivoClase: "Clasificar ángulos según su amplitud (agudos, rectos, obtusos, llanos y completos) en objetos del entorno.",
        estructura: {
          anticipacion: {
            titulo: "Activación de conocimientos previos",
            duracion: "10 minutos",
            actividades: [
              "El docente abre y cierra una tijera y pregunta: ¿Qué se forma entre las dos hojas? ¿Cambia cuando la abro más?",
              "Los estudiantes buscan ángulos en el aula: esquinas de mesas, apertura de puertas, agujas del reloj.",
              "Pregunta: ¿Todos los ángulos son iguales? ¿Cómo podríamos medirlos?",
              "Repaso: ¿Qué es un ángulo? (dos rayos que parten de un mismo punto)."
            ],
          },
          construccion: {
            titulo: "Construcción del conocimiento",
            duracion: "20 minutos",
            actividades: [
              "El docente presenta los tipos de ángulos con ejemplos visuales: Agudo (<90°), Recto (=90°), Obtuso (>90° y <180°), Llano (=180°), Completo (=360°).",
              "Demostración del uso del TRANSPORTADOR: cómo colocarlo, cómo leer la medida.",
              "Práctica guiada: Medir 5 ángulos dibujados en la pizarra.",
              "Los estudiantes construyen ángulos de medidas específicas con el transportador.",
              "Clasificación de los ángulos medidos según su tipo."
            ],
          },
          consolidacion: {
            titulo: "Consolidación y práctica",
            duracion: "15 minutos",
            actividades: [
              "Cacería de ángulos: Los estudiantes recorren el aula midiendo ángulos de objetos reales y los clasifican en una tabla.",
              "Trabajo en parejas: Uno dibuja un ángulo, el otro lo mide y clasifica.",
              "Resolución de ejercicios del cuaderno de trabajo.",
              "Desafío: ¿Cuántos ángulos rectos hay en un cuadrado? ¿Y en un triángulo rectángulo?"
            ],
          },
          retroalimentacion: {
            titulo: "Retroalimentación y cierre",
            duracion: "10 minutos",
            actividades: [
              "Socialización de la 'Cacería de ángulos': ¿Qué tipo de ángulo encontraron más?",
              "Juego rápido: El docente muestra un ángulo y los estudiantes levantan tarjetas (A=agudo, R=recto, O=obtuso).",
              "Corrección de errores en la lectura del transportador.",
              "Tarea: Medir y clasificar 5 ángulos encontrados en casa.",
              "Metacognición: ¿Qué fue lo más difícil de usar el transportador?"
            ],
          },
        },
        recursos: ["Transportador para cada estudiante", "Regla", "Tijeras (para demostración)", "Reloj analógico", "Cuaderno", "Texto del estudiante"],
        evaluacionFormativa: "Ejercicio práctico: Medir 4 ángulos y clasificarlos correctamente. Criterio: precisión en la medición (±5°) y clasificación correcta.",
      },
    ],
  },

  // ==========================================
  // MATEMÁTICA - Básica Media, Bloque 3 (Estadística)
  // ==========================================
  {
    patron: "M.3.3",
    temas: [
      {
        titulo: "Encuesta escolar: nuestros datos en gráficos",
        descripcionBreve: "Realizar una encuesta en el aula, organizar datos en tablas y representarlos en gráficos de barras y circulares.",
        objetivoClase: "Analizar y representar datos estadísticos del entorno en tablas de frecuencias y diagramas de barras.",
        estructura: {
          anticipacion: {
            titulo: "Activación de conocimientos previos",
            duracion: "10 minutos",
            actividades: [
              "El docente muestra un gráfico de barras de una revista o periódico y pregunta: ¿Qué información nos da este gráfico?",
              "Pregunta generadora: Si quisiéramos saber cuál es la fruta favorita del curso, ¿cómo lo averiguaríamos?",
              "Los estudiantes proponen ideas: preguntar uno por uno, levantar la mano, votar.",
              "El docente introduce el concepto de ENCUESTA como método de recolección de datos."
            ],
          },
          construccion: {
            titulo: "Construcción del conocimiento",
            duracion: "20 minutos",
            actividades: [
              "Realización de la encuesta: '¿Cuál es tu deporte favorito?' (fútbol, básquet, natación, atletismo, otro).",
              "El docente modela cómo organizar los datos en una TABLA DE FRECUENCIAS: categoría, conteo (palotes), frecuencia.",
              "Construcción paso a paso de un DIAGRAMA DE BARRAS con los datos obtenidos.",
              "Explicación de los elementos del gráfico: título, ejes, escala, barras.",
              "Interpretación: ¿Cuál es el deporte más popular? ¿Cuál el menos? ¿Cuántos estudiantes participaron?"
            ],
          },
          consolidacion: {
            titulo: "Consolidación y práctica",
            duracion: "15 minutos",
            actividades: [
              "Trabajo en equipos: Cada equipo diseña su propia encuesta (comida favorita, materia preferida, mascota ideal).",
              "Los equipos recolectan datos, organizan en tabla de frecuencias y crean su diagrama de barras en papelote.",
              "Cada equipo prepara 3 preguntas de interpretación sobre su gráfico para otro equipo.",
              "Resolución de ejercicios del texto con datos estadísticos."
            ],
          },
          retroalimentacion: {
            titulo: "Retroalimentación y cierre",
            duracion: "10 minutos",
            actividades: [
              "Exposición de gráficos: Cada equipo presenta su encuesta y gráfico.",
              "Los demás equipos responden las preguntas de interpretación.",
              "El docente refuerza: importancia de la escala, proporcionalidad de las barras, título descriptivo.",
              "Tarea: Realizar una encuesta a 10 familiares sobre un tema de interés y representar los datos.",
              "Reflexión: ¿Para qué sirven los gráficos estadísticos en la vida real?"
            ],
          },
        },
        recursos: ["Papelotes cuadriculados", "Marcadores de colores", "Regla", "Recortes de gráficos de periódicos/revistas", "Cuaderno cuadriculado", "Texto del estudiante"],
        evaluacionFormativa: "Rúbrica: Recolecta datos correctamente / Organiza en tabla de frecuencias / Construye diagrama de barras proporcional / Interpreta datos del gráfico.",
      },
    ],
  },

  // ==========================================
  // MATEMÁTICA - Básica Superior (Subnivel 4)
  // ==========================================
  {
    patron: "M.4.1",
    temas: [
      {
        titulo: "Números enteros: temperatura y altitud",
        descripcionBreve: "Comprender los números enteros a través de contextos reales como temperatura y altitud.",
        objetivoClase: "Reconocer los elementos del conjunto Z, ordenarlos y ubicarlos en la recta numérica usando contextos reales.",
        estructura: {
          anticipacion: {
            titulo: "Activación de conocimientos previos",
            duracion: "10 minutos",
            actividades: [
              "El docente muestra un termómetro y pregunta: ¿Qué temperatura marca? ¿Puede la temperatura ser menor que cero?",
              "Video corto o imágenes de lugares con temperaturas bajo cero (Chimborazo, Antártida).",
              "Pregunta: ¿Cómo representamos 5 grados bajo cero? ¿Y un submarino a 200 metros bajo el nivel del mar?",
              "Los estudiantes mencionan situaciones donde se usan números negativos (deudas, pisos de sótano, etc.)."
            ],
          },
          construccion: {
            titulo: "Construcción del conocimiento",
            duracion: "20 minutos",
            actividades: [
              "El docente presenta el CONJUNTO Z: {..., -3, -2, -1, 0, 1, 2, 3, ...}",
              "Construcción de la RECTA NUMÉRICA en la pizarra con números positivos y negativos.",
              "Concepto de VALOR ABSOLUTO y OPUESTO de un número.",
              "Orden en Z: Reglas para comparar números enteros (todo negativo es menor que todo positivo).",
              "Ejercicios guiados: Ordenar conjuntos de números enteros de menor a mayor."
            ],
          },
          consolidacion: {
            titulo: "Consolidación y práctica",
            duracion: "15 minutos",
            actividades: [
              "Actividad 'El ascensor': Un edificio tiene pisos del -3 (sótano) al 10. Los estudiantes resuelven problemas de desplazamiento.",
              "Trabajo en parejas: Ubicar números enteros en la recta numérica y compararlos.",
              "Problemas contextualizados: temperaturas de ciudades ecuatorianas, altitudes (Quito 2850m, Fosa de las Marianas -11000m).",
              "Ejercicios del texto del estudiante."
            ],
          },
          retroalimentacion: {
            titulo: "Retroalimentación y cierre",
            duracion: "10 minutos",
            actividades: [
              "Juego 'Mayor o Menor': El docente muestra pares de números enteros y los estudiantes indican cuál es mayor.",
              "Corrección de errores: -5 NO es mayor que -2 (error frecuente).",
              "Mapa conceptual colectivo sobre los números enteros.",
              "Tarea: Investigar 5 situaciones reales donde se usen números negativos.",
              "Evaluación de salida: Ubicar 5 números enteros en la recta numérica."
            ],
          },
        },
        recursos: ["Termómetro", "Recta numérica grande para pizarra", "Imágenes de contextos con números negativos", "Cuaderno cuadriculado", "Texto del estudiante", "Calculadora"],
        evaluacionFormativa: "Prueba corta: Ordenar 8 números enteros / Ubicar 5 en la recta numérica / Resolver 2 problemas contextualizados.",
      },
      {
        titulo: "Operaciones con enteros: ganancias y pérdidas",
        descripcionBreve: "Aprender a sumar, restar, multiplicar y dividir números enteros con situaciones de finanzas.",
        objetivoClase: "Resolver problemas de aplicación con operaciones de adición, sustracción, multiplicación y división de números enteros.",
        estructura: {
          anticipacion: {
            titulo: "Activación de conocimientos previos",
            duracion: "10 minutos",
            actividades: [
              "Situación: 'Pedro tiene $50 y debe $30. Luego gana $20 pero gasta $15. ¿Cuánto tiene al final?'",
              "Los estudiantes intentan resolverlo con sus propias estrategias.",
              "Repaso: ¿Qué son los números enteros? ¿Cómo se ubican en la recta numérica?",
              "El docente introduce la idea de que sumar un negativo es como restar, y restar un negativo es como sumar."
            ],
          },
          construccion: {
            titulo: "Construcción del conocimiento",
            duracion: "20 minutos",
            actividades: [
              "REGLAS DE SIGNOS para la suma: mismo signo = se suman y se conserva el signo; diferente signo = se restan y se pone el signo del mayor.",
              "REGLAS DE SIGNOS para multiplicación y división: (+)(+)=+, (+)(-)=-, (-)(+)=-, (-)(-) =+.",
              "Demostración con la recta numérica y con fichas bicolor (rojas = negativo, azules = positivo).",
              "Resolución paso a paso de 6 ejercicios de complejidad creciente.",
              "Los estudiantes practican en sus cuadernos junto al docente."
            ],
          },
          consolidacion: {
            titulo: "Consolidación y práctica",
            duracion: "15 minutos",
            actividades: [
              "Juego 'El Banco': Cada estudiante recibe una 'cuenta bancaria' con saldo inicial. Tarjetas de eventos (ganancias y pérdidas) determinan operaciones.",
              "Trabajo individual: 8 ejercicios de operaciones combinadas con enteros.",
              "Problemas contextualizados: temperaturas que suben y bajan, altitudes, finanzas.",
              "Verificación con calculadora."
            ],
          },
          retroalimentacion: {
            titulo: "Retroalimentación y cierre",
            duracion: "10 minutos",
            actividades: [
              "Corrección colectiva de los ejercicios más desafiantes.",
              "Tabla resumen de reglas de signos elaborada entre todos.",
              "Juego 'Ping Pong matemático': El docente dice una operación, el estudiante responde rápidamente.",
              "Tarea: 10 ejercicios de operaciones con enteros del texto.",
              "Autoevaluación: ¿Domino las reglas de signos? ¿Puedo resolver problemas con enteros?"
            ],
          },
        },
        recursos: ["Fichas bicolor (rojas y azules)", "Recta numérica", "Tarjetas de eventos para el juego", "Calculadora", "Cuaderno", "Texto del estudiante"],
        evaluacionFormativa: "Prueba escrita: 4 operaciones con enteros + 2 problemas contextualizados. Criterio: aplica correctamente las reglas de signos.",
      },
    ],
  },

  // ==========================================
  // MATEMÁTICA - Bachillerato (Subnivel 5)
  // ==========================================
  {
    patron: "M.5.1",
    temas: [
      {
        titulo: "Productos notables y factorización",
        descripcionBreve: "Dominar los productos notables y la factorización como herramientas algebraicas fundamentales.",
        objetivoClase: "Aplicar las propiedades algebraicas de los números reales en la resolución de productos notables y factorización.",
        estructura: {
          anticipacion: {
            titulo: "Activación de conocimientos previos",
            duracion: "10 minutos",
            actividades: [
              "Repaso de propiedades de potenciación y multiplicación de polinomios.",
              "El docente presenta: (a+b)² y pide a los estudiantes que lo desarrollen multiplicando.",
              "Pregunta: ¿Existe una forma más rápida de obtener el resultado sin multiplicar término a término?",
              "Conexión geométrica: Representar (a+b)² como el área de un cuadrado de lado (a+b)."
            ],
          },
          construccion: {
            titulo: "Construcción del conocimiento",
            duracion: "20 minutos",
            actividades: [
              "Presentación de los PRODUCTOS NOTABLES: Cuadrado de binomio, Diferencia de cuadrados, Cubo de binomio.",
              "Demostración algebraica y geométrica de cada caso.",
              "FACTORIZACIÓN como proceso inverso: Factor común, Trinomio cuadrado perfecto, Diferencia de cuadrados.",
              "Tabla comparativa: Producto Notable ↔ Factorización (procesos inversos).",
              "Resolución de 6 ejercicios guiados (3 de productos notables, 3 de factorización)."
            ],
          },
          consolidacion: {
            titulo: "Consolidación y práctica",
            duracion: "15 minutos",
            actividades: [
              "Trabajo individual: 10 ejercicios variados de productos notables y factorización.",
              "Desafío: Simplificar fracciones algebraicas usando factorización.",
              "Trabajo en parejas: Uno desarrolla el producto notable, el otro factoriza el resultado para verificar.",
              "Aplicación: Resolver ecuaciones cuadráticas por factorización."
            ],
          },
          retroalimentacion: {
            titulo: "Retroalimentación y cierre",
            duracion: "10 minutos",
            actividades: [
              "Corrección de ejercicios seleccionados en la pizarra.",
              "Mapa mental colectivo: Tipos de productos notables y sus factorizaciones correspondientes.",
              "Errores frecuentes: (a+b)² ≠ a² + b², olvidar el doble producto.",
              "Tarea: 15 ejercicios mixtos del texto.",
              "Reflexión: ¿Por qué la factorización es útil para simplificar expresiones?"
            ],
          },
        },
        recursos: ["Pizarra y marcadores", "Material geométrico para representaciones", "Calculadora científica", "Texto del estudiante", "Cuaderno"],
        evaluacionFormativa: "Prueba escrita: 5 productos notables + 5 factorizaciones + 2 aplicaciones. Criterio: desarrollo correcto paso a paso.",
      },
    ],
  },

  // ==========================================
  // LENGUA Y LITERATURA - Básica Elemental
  // ==========================================
  {
    patron: "LL.2",
    temas: [
      {
        titulo: "Cuentos de mi comunidad",
        descripcionBreve: "Explorar la tradición oral ecuatoriana a través de cuentos y leyendas locales.",
        objetivoClase: "Valorar la diversidad lingüística y cultural del Ecuador a través de la lectura y narración de cuentos tradicionales.",
        estructura: {
          anticipacion: {
            titulo: "Activación de conocimientos previos",
            duracion: "10 minutos",
            actividades: [
              "El docente pregunta: ¿Conocen algún cuento o leyenda que les hayan contado sus abuelos?",
              "Lluvia de ideas sobre cuentos tradicionales ecuatorianos (La Llorona, El Duende, La Dama Tapada).",
              "El docente muestra imágenes de personajes de leyendas ecuatorianas.",
              "Pregunta: ¿Por qué creen que nuestros antepasados contaban estas historias?"
            ],
          },
          construccion: {
            titulo: "Construcción del conocimiento",
            duracion: "20 minutos",
            actividades: [
              "Lectura en voz alta de un cuento tradicional ecuatoriano seleccionado.",
              "Análisis guiado: ¿Quiénes son los personajes? ¿Dónde ocurre? ¿Qué problema hay? ¿Cómo se resuelve?",
              "Identificación de la ESTRUCTURA del cuento: Inicio, Nudo, Desenlace.",
              "Vocabulario nuevo: Identificar palabras desconocidas y buscar su significado.",
              "El docente explica qué es la TRADICIÓN ORAL y su importancia cultural."
            ],
          },
          consolidacion: {
            titulo: "Consolidación y práctica",
            duracion: "15 minutos",
            actividades: [
              "Trabajo en grupos: Cada grupo recibe un cuento diferente y debe identificar inicio, nudo y desenlace.",
              "Dramatización: Los grupos preparan una breve representación de su cuento.",
              "Escritura creativa: Cada estudiante escribe un final alternativo para el cuento leído.",
              "Ilustración: Dibujar la escena favorita del cuento."
            ],
          },
          retroalimentacion: {
            titulo: "Retroalimentación y cierre",
            duracion: "10 minutos",
            actividades: [
              "Presentación de las dramatizaciones de cada grupo.",
              "Lectura de algunos finales alternativos creativos.",
              "Reflexión: ¿Qué enseñanza nos deja el cuento? ¿Por qué es importante conservar nuestras historias?",
              "Tarea: Pedir a un familiar que les cuente una historia o leyenda y escribirla en el cuaderno.",
              "Compromiso: Valorar y compartir las historias de nuestra cultura."
            ],
          },
        },
        recursos: ["Libro de cuentos ecuatorianos", "Imágenes de personajes de leyendas", "Papelotes para dramatización", "Lápices de colores", "Cuaderno"],
        evaluacionFormativa: "Lista de cotejo: Identifica la estructura del cuento / Participa en la dramatización / Escribe un final alternativo coherente / Valora la tradición oral.",
      },
      {
        titulo: "Escribimos instrucciones claras",
        descripcionBreve: "Aprender a redactar textos instructivos paso a paso con orden y claridad.",
        objetivoClase: "Producir textos instructivos sencillos con estructura clara, utilizando conectores de secuencia.",
        estructura: {
          anticipacion: {
            titulo: "Activación de conocimientos previos",
            duracion: "10 minutos",
            actividades: [
              "El docente pide a un estudiante que explique cómo hacer un sándwich. Los demás evalúan si las instrucciones son claras.",
              "Pregunta: ¿Qué pasa si no seguimos el orden correcto? (Ejemplo gracioso: ponerse los zapatos antes de los calcetines).",
              "Exploración: ¿Dónde encontramos instrucciones? (recetas, manuales, juegos).",
              "El docente muestra ejemplos de textos instructivos: receta de cocina, instrucciones de un juego."
            ],
          },
          construccion: {
            titulo: "Construcción del conocimiento",
            duracion: "20 minutos",
            actividades: [
              "El docente presenta la ESTRUCTURA del texto instructivo: Título, Materiales, Pasos numerados.",
              "Conectores de secuencia: Primero, Luego, Después, A continuación, Finalmente.",
              "Modelo: Juntos escriben las instrucciones para hacer un avión de papel (mientras lo hacen paso a paso).",
              "Análisis: ¿Qué características tiene un buen texto instructivo? (claro, ordenado, preciso).",
              "Los estudiantes identifican verbos en infinitivo o imperativo usados en instrucciones."
            ],
          },
          consolidacion: {
            titulo: "Consolidación y práctica",
            duracion: "15 minutos",
            actividades: [
              "Trabajo individual: Cada estudiante escribe las instrucciones de algo que sabe hacer (preparar un jugo, un juego, una manualidad).",
              "Revisión entre pares: Intercambian textos y el compañero intenta seguir las instrucciones. ¿Son claras?",
              "Corrección colaborativa: Mejoran el texto según la retroalimentación recibida.",
              "Versión final: Pasan en limpio con ilustraciones."
            ],
          },
          retroalimentacion: {
            titulo: "Retroalimentación y cierre",
            duracion: "10 minutos",
            actividades: [
              "Lectura de 3 textos instructivos destacados.",
              "Un voluntario lee sus instrucciones y otro compañero las ejecuta en tiempo real.",
              "El docente refuerza: importancia del orden, los conectores y la claridad.",
              "Tarea: Escribir las instrucciones de su juego favorito para compartir con la clase.",
              "Autoevaluación: ¿Mi texto es claro? ¿Usé conectores de secuencia? ¿Está ordenado?"
            ],
          },
        },
        recursos: ["Ejemplos de textos instructivos impresos", "Papel para aviones", "Cuaderno", "Lápices de colores", "Papelotes"],
        evaluacionFormativa: "Rúbrica: Estructura correcta (título, materiales, pasos) / Uso de conectores de secuencia / Claridad y orden / Ortografía y presentación.",
      },
    ],
  },

  // ==========================================
  // LENGUA Y LITERATURA - Básica Media
  // ==========================================
  {
    patron: "LL.3",
    temas: [
      {
        titulo: "El texto informativo: noticias de mi escuela",
        descripcionBreve: "Leer, analizar y producir textos informativos con estructura de noticia escolar.",
        objetivoClase: "Comprender y producir textos informativos con estructura clara, distinguiendo hechos de opiniones.",
        estructura: {
          anticipacion: {
            titulo: "Activación de conocimientos previos",
            duracion: "10 minutos",
            actividades: [
              "El docente muestra la portada de un periódico y pregunta: ¿Qué tipo de textos encontramos aquí?",
              "Diferencia entre INFORMAR y OPINAR: ¿Es lo mismo decir 'Llovió ayer' que 'El clima estuvo horrible'?",
              "Los estudiantes mencionan noticias recientes que conocen.",
              "Pregunta motivadora: ¿Qué noticias interesantes hay en nuestra escuela?"
            ],
          },
          construccion: {
            titulo: "Construcción del conocimiento",
            duracion: "20 minutos",
            actividades: [
              "Lectura de una noticia adaptada. Identificación de las 6 preguntas: ¿Qué? ¿Quién? ¿Cuándo? ¿Dónde? ¿Cómo? ¿Por qué?",
              "Estructura de la noticia: Titular, Entrada (lead), Cuerpo, Cierre.",
              "Análisis de 2 noticias: Subrayar hechos con un color y opiniones con otro.",
              "El docente modela la escritura de una noticia escolar sobre un evento reciente.",
              "Vocabulario periodístico: titular, corresponsal, fuente, crónica."
            ],
          },
          consolidacion: {
            titulo: "Consolidación y práctica",
            duracion: "15 minutos",
            actividades: [
              "Trabajo en equipos: Cada equipo elige un evento escolar y redacta una noticia completa.",
              "Roles: Redactor, editor, ilustrador, presentador.",
              "Revisión cruzada entre equipos usando una lista de verificación.",
              "Maquetación: Diseñar la noticia como página de periódico en un papelote."
            ],
          },
          retroalimentacion: {
            titulo: "Retroalimentación y cierre",
            duracion: "10 minutos",
            actividades: [
              "Presentación del 'Periódico Escolar': Cada equipo expone su noticia.",
              "Los demás estudiantes identifican las 6 preguntas en cada noticia presentada.",
              "El docente destaca fortalezas y áreas de mejora en la redacción.",
              "Tarea: Recortar una noticia del periódico, pegarla en el cuaderno e identificar su estructura.",
              "Reflexión: ¿Por qué es importante distinguir hechos de opiniones?"
            ],
          },
        },
        recursos: ["Periódicos y revistas", "Papelotes", "Marcadores", "Tijeras y goma", "Cuaderno", "Texto del estudiante"],
        evaluacionFormativa: "Rúbrica: Estructura correcta de la noticia / Responde las 6 preguntas / Distingue hechos de opiniones / Redacción clara y coherente.",
      },
    ],
  },

  // ==========================================
  // CIENCIAS NATURALES - Básica Elemental
  // ==========================================
  {
    patron: "CN.2",
    temas: [
      {
        titulo: "Los seres vivos de mi entorno",
        descripcionBreve: "Observar, clasificar y valorar los seres vivos del entorno cercano.",
        objetivoClase: "Observar y clasificar los seres vivos del entorno según sus características, valorando la biodiversidad local.",
        estructura: {
          anticipacion: {
            titulo: "Activación de conocimientos previos",
            duracion: "10 minutos",
            actividades: [
              "El docente muestra imágenes de diferentes seres vivos y objetos inertes. Pregunta: ¿Cuáles están vivos?",
              "Lluvia de ideas: ¿Qué necesita un ser vivo para vivir? (agua, alimento, aire, luz).",
              "Los estudiantes nombran seres vivos que conocen de su comunidad.",
              "Pregunta: ¿Una planta está viva? ¿Cómo lo sabemos?"
            ],
          },
          construccion: {
            titulo: "Construcción del conocimiento",
            duracion: "20 minutos",
            actividades: [
              "Características de los SERES VIVOS: nacen, crecen, se reproducen, se alimentan, mueren.",
              "Clasificación: Animales, Plantas, Hongos, Microorganismos.",
              "Observación directa: Salida al patio para observar seres vivos (plantas, insectos, aves).",
              "Registro en cuaderno de campo: Dibujar y describir 5 seres vivos observados.",
              "El docente explica la importancia de cada ser vivo en el ecosistema."
            ],
          },
          consolidacion: {
            titulo: "Consolidación y práctica",
            duracion: "15 minutos",
            actividades: [
              "Elaboración de un mural clasificatorio: Los estudiantes pegan imágenes de seres vivos en categorías.",
              "Trabajo en el texto: Completar actividades de clasificación.",
              "Juego 'Adivina el ser vivo': Un estudiante describe características y los demás adivinan.",
              "Ficha de observación: Completar una tabla con nombre, tipo, hábitat y alimentación de 5 seres vivos."
            ],
          },
          retroalimentacion: {
            titulo: "Retroalimentación y cierre",
            duracion: "10 minutos",
            actividades: [
              "Presentación del mural clasificatorio.",
              "Preguntas de verificación: ¿Cuáles son las características de los seres vivos? ¿Cómo los clasificamos?",
              "Reflexión: ¿Por qué debemos cuidar a los seres vivos de nuestro entorno?",
              "Tarea: Observar seres vivos en casa o barrio y completar una ficha de observación.",
              "Compromiso ambiental: Una acción concreta para cuidar los seres vivos de su entorno."
            ],
          },
        },
        recursos: ["Imágenes de seres vivos e inertes", "Lupa", "Cuaderno de campo", "Lápices de colores", "Papelote para mural", "Texto del estudiante"],
        evaluacionFormativa: "Lista de cotejo: Identifica características de seres vivos / Clasifica correctamente / Completa ficha de observación / Valora la biodiversidad.",
      },
    ],
  },

  // ==========================================
  // CIENCIAS NATURALES - Básica Media
  // ==========================================
  {
    patron: "CN.3",
    temas: [
      {
        titulo: "El ciclo del agua y el clima",
        descripcionBreve: "Comprender el ciclo del agua mediante experimentación y su relación con el clima ecuatoriano.",
        objetivoClase: "Explicar el ciclo del agua y su importancia para los ecosistemas mediante observación y experimentación.",
        estructura: {
          anticipacion: {
            titulo: "Activación de conocimientos previos",
            duracion: "10 minutos",
            actividades: [
              "El docente pregunta: ¿De dónde viene la lluvia? ¿A dónde va el agua cuando se seca un charco?",
              "Los estudiantes comparten sus ideas y el docente las registra sin corregir aún.",
              "Observación: El docente hierve agua en un recipiente y coloca un plato frío encima. ¿Qué observan?",
              "Pregunta: ¿El agua se crea o se destruye, o siempre es la misma agua que se transforma?"
            ],
          },
          construccion: {
            titulo: "Construcción del conocimiento",
            duracion: "20 minutos",
            actividades: [
              "Presentación del CICLO DEL AGUA: Evaporación → Condensación → Precipitación → Escorrentía → Infiltración.",
              "Experimento: Crear un mini ciclo del agua en una bolsa plástica con agua y colorante, pegada a la ventana.",
              "Los estudiantes dibujan el ciclo del agua en su cuaderno con flechas y etiquetas.",
              "Relación con el clima ecuatoriano: Costa (lluvias), Sierra (páramos como reservas de agua), Amazonía (alta humedad).",
              "Importancia del agua: consumo humano, agricultura, ecosistemas."
            ],
          },
          consolidacion: {
            titulo: "Consolidación y práctica",
            duracion: "15 minutos",
            actividades: [
              "Trabajo en equipos: Elaborar una maqueta del ciclo del agua con materiales reciclados.",
              "Resolución de preguntas del texto del estudiante.",
              "Análisis de caso: ¿Qué pasaría si no lloviera durante un año en nuestra comunidad?",
              "Cada equipo prepara una exposición breve sobre una etapa del ciclo."
            ],
          },
          retroalimentacion: {
            titulo: "Retroalimentación y cierre",
            duracion: "10 minutos",
            actividades: [
              "Exposición de maquetas por equipos.",
              "Verificación de hipótesis iniciales: ¿Cambiaron sus ideas sobre de dónde viene la lluvia?",
              "El docente corrige concepciones erróneas comunes.",
              "Tarea: Observar el experimento de la bolsa durante una semana y registrar cambios.",
              "Reflexión: ¿Cómo podemos cuidar el agua en nuestra vida diaria?"
            ],
          },
        },
        recursos: ["Recipiente para hervir agua", "Bolsas plásticas transparentes", "Colorante alimenticio", "Materiales reciclados para maqueta", "Láminas del ciclo del agua", "Texto del estudiante"],
        evaluacionFormativa: "Rúbrica: Explica las etapas del ciclo / Relaciona con el clima local / Participa en el experimento / Propone acciones de cuidado del agua.",
      },
    ],
  },

  // ==========================================
  // ESTUDIOS SOCIALES - Básica Media
  // ==========================================
  {
    patron: "CS.3",
    temas: [
      {
        titulo: "Las regiones naturales del Ecuador",
        descripcionBreve: "Conocer las cuatro regiones del Ecuador, sus características geográficas y culturales.",
        objetivoClase: "Identificar las regiones naturales del Ecuador y sus características geográficas, climáticas y culturales.",
        estructura: {
          anticipacion: {
            titulo: "Activación de conocimientos previos",
            duracion: "10 minutos",
            actividades: [
              "El docente muestra un mapa del Ecuador y pregunta: ¿En qué región vivimos? ¿Conocen otras regiones?",
              "Los estudiantes comparten experiencias de viajes a otras regiones.",
              "Juego de asociación: El docente dice una palabra (playa, volcán, selva, tortuga gigante) y los estudiantes dicen a qué región pertenece.",
              "Pregunta: ¿Por qué Ecuador es un país tan diverso si es pequeño?"
            ],
          },
          construccion: {
            titulo: "Construcción del conocimiento",
            duracion: "20 minutos",
            actividades: [
              "Presentación de las 4 REGIONES: Costa, Sierra, Amazonía (Oriente), Región Insular (Galápagos).",
              "Para cada región: ubicación, clima, relieve, flora, fauna, actividades económicas, cultura.",
              "Uso de imágenes, videos cortos o láminas de cada región.",
              "Los estudiantes completan una tabla comparativa en su cuaderno.",
              "Mapa del Ecuador: Colorear cada región con un color diferente."
            ],
          },
          consolidacion: {
            titulo: "Consolidación y práctica",
            duracion: "15 minutos",
            actividades: [
              "Trabajo en equipos: Cada equipo se convierte en 'experto' de una región y prepara una presentación.",
              "Elaboración de un afiche turístico de su región asignada.",
              "Juego 'Viajero ecuatoriano': Tarjetas con descripciones y los estudiantes identifican la región.",
              "Resolución de actividades del texto."
            ],
          },
          retroalimentacion: {
            titulo: "Retroalimentación y cierre",
            duracion: "10 minutos",
            actividades: [
              "Presentación de afiches turísticos por equipos.",
              "Quiz rápido: 5 preguntas sobre las regiones.",
              "Reflexión: ¿Qué hace especial a cada región? ¿Por qué debemos valorar nuestra diversidad?",
              "Tarea: Investigar un plato típico, una fiesta y un animal representativo de cada región.",
              "Compromiso: Valorar y respetar la diversidad cultural del Ecuador."
            ],
          },
        },
        recursos: ["Mapa del Ecuador", "Imágenes de las 4 regiones", "Papelotes y marcadores", "Lápices de colores", "Texto del estudiante", "Material audiovisual"],
        evaluacionFormativa: "Tabla comparativa completada correctamente / Afiche turístico con información relevante / Participación en el quiz / Identifica características de cada región.",
      },
    ],
  },

  // ==========================================
  // EDUCACIÓN FÍSICA
  // ==========================================
  {
    patron: "EF",
    temas: [
      {
        titulo: "Juegos tradicionales ecuatorianos",
        descripcionBreve: "Practicar juegos tradicionales del Ecuador valorando la cultura y el trabajo en equipo.",
        objetivoClase: "Participar en juegos tradicionales ecuatorianos desarrollando habilidades motrices y valorando el patrimonio cultural.",
        estructura: {
          anticipacion: {
            titulo: "Activación y calentamiento",
            duracion: "10 minutos",
            actividades: [
              "Pregunta inicial: ¿Conocen juegos que jugaban sus padres o abuelos cuando eran niños?",
              "Lluvia de ideas: Los estudiantes nombran juegos tradicionales (rayuela, trompo, canicas, saltar la cuerda, las escondidas).",
              "Calentamiento general: Trote suave, movilidad articular, estiramientos dinámicos.",
              "Calentamiento específico: Juego de persecución 'El lobo y las ovejas'."
            ],
          },
          construccion: {
            titulo: "Desarrollo de la actividad",
            duracion: "20 minutos",
            actividades: [
              "Estación 1: RAYUELA - El docente explica las reglas y demuestra. Los estudiantes practican.",
              "Estación 2: SALTAR LA CUERDA - Individual y grupal. Diferentes formas de saltar.",
              "Estación 3: CARRERA DE ENSACADOS - Organización por equipos, técnica de salto.",
              "Rotación cada 7 minutos para que todos experimenten cada estación.",
              "El docente observa y corrige posturas, técnicas y actitudes."
            ],
          },
          consolidacion: {
            titulo: "Juego aplicativo",
            duracion: "15 minutos",
            actividades: [
              "Mini torneo de juegos tradicionales: Los equipos compiten en las 3 estaciones.",
              "Sistema de puntos por participación, respeto y deportivismo (no solo por ganar).",
              "Los estudiantes proponen variantes creativas de los juegos.",
              "Registro: Cada estudiante escribe las reglas de su juego favorito."
            ],
          },
          retroalimentacion: {
            titulo: "Vuelta a la calma y reflexión",
            duracion: "10 minutos",
            actividades: [
              "Ejercicios de estiramiento y respiración.",
              "Círculo de reflexión: ¿Qué juego les gustó más? ¿Por qué?",
              "Reflexión cultural: ¿Por qué es importante mantener vivos estos juegos?",
              "Tarea: Preguntar a un adulto mayor sobre un juego tradicional que ya no se practique y traer la descripción.",
              "Hidratación y aseo personal."
            ],
          },
        },
        recursos: ["Rayuela dibujada en el patio", "Cuerdas para saltar", "Sacos para carrera", "Silbato", "Conos para delimitar estaciones"],
        evaluacionFormativa: "Ficha de observación: Participa activamente / Respeta reglas y compañeros / Demuestra habilidades motrices básicas / Valora los juegos tradicionales.",
      },
    ],
  },

  // ==========================================
  // EDUCACIÓN CULTURAL Y ARTÍSTICA
  // ==========================================
  {
    patron: "ECA",
    temas: [
      {
        titulo: "Arte con materiales reciclados",
        descripcionBreve: "Crear obras artísticas usando materiales reciclados, fomentando la creatividad y la conciencia ambiental.",
        objetivoClase: "Explorar las posibilidades expresivas de materiales reciclados para crear obras artísticas originales.",
        estructura: {
          anticipacion: {
            titulo: "Activación y sensibilización",
            duracion: "10 minutos",
            actividades: [
              "El docente muestra obras de arte hechas con materiales reciclados (esculturas, collages, instrumentos musicales).",
              "Pregunta: ¿Se puede hacer arte con 'basura'? ¿Qué materiales reciclados podrían servir?",
              "Los estudiantes observan los materiales disponibles (botellas, cartón, tapas, periódicos, telas).",
              "Inspiración: Breve historia de artistas que trabajan con materiales reciclados."
            ],
          },
          construccion: {
            titulo: "Exploración y creación",
            duracion: "20 minutos",
            actividades: [
              "El docente presenta técnicas básicas: collage, ensamblaje, escultura con cartón, pintura sobre materiales reciclados.",
              "Demostración: Crear un objeto artístico simple paso a paso.",
              "Exploración libre: Los estudiantes manipulan los materiales y experimentan con diferentes combinaciones.",
              "Planificación: Cada estudiante o pareja dibuja un boceto de lo que quiere crear.",
              "Creación: Manos a la obra. El docente guía y apoya individualmente."
            ],
          },
          consolidacion: {
            titulo: "Producción artística",
            duracion: "15 minutos",
            actividades: [
              "Los estudiantes continúan y finalizan sus creaciones.",
              "Agregan detalles: pintura, decoración, acabados.",
              "Cada estudiante prepara una breve explicación de su obra: título, materiales usados, significado.",
              "Fotografía de las obras para el portafolio."
            ],
          },
          retroalimentacion: {
            titulo: "Exposición y reflexión",
            duracion: "10 minutos",
            actividades: [
              "Galería de arte: Las obras se exhiben en el aula o pasillo.",
              "Cada artista presenta su obra al grupo.",
              "Los compañeros expresan qué les gusta de cada obra (crítica constructiva).",
              "Reflexión: ¿Qué aprendimos sobre la creatividad? ¿Cómo el arte puede ayudar al medio ambiente?",
              "Tarea: Crear en casa una obra artística con materiales reciclados y traer fotos."
            ],
          },
        },
        recursos: ["Botellas plásticas, cartón, tapas, periódicos", "Tijeras, goma, cinta adhesiva", "Pinturas y pinceles", "Telas y retazos", "Marcadores"],
        evaluacionFormativa: "Rúbrica: Creatividad y originalidad / Uso adecuado de materiales / Técnica empleada / Presentación y explicación de la obra.",
      },
    ],
  },
];

// ============================================================
// FUNCIÓN PRINCIPAL: Obtener temas sugeridos para una destreza
// ============================================================

function generarId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 6);
}

/**
 * Obtiene los temas sugeridos para una destreza específica.
 * Busca primero por código exacto de destreza, luego por patrón de área.subnivel.bloque,
 * luego por área.subnivel, y finalmente por área genérica.
 */
export function obtenerTemasSugeridos(destreza: Destreza): TemaSugerido[] {
  // Construir patrones de búsqueda de más específico a más general
  const patronExacto = `${destreza.area}.${destreza.subnivel}.${destreza.bloque}`;
  const patronSubnivel = `${destreza.area}.${destreza.subnivel}`;
  const patronArea = destreza.area;

  // Buscar temas en orden de especificidad
  let temasBase: Omit<TemaSugerido, "id">[] = [];

  // 1. Buscar por patrón exacto (área.subnivel.bloque)
  const matchExacto = BANCO_TEMAS.find((t) => t.patron === patronExacto);
  if (matchExacto) {
    temasBase = matchExacto.temas;
  }

  // 2. Si no hay match exacto, buscar por subnivel
  if (temasBase.length === 0) {
    const matchSubnivel = BANCO_TEMAS.find((t) => t.patron === patronSubnivel);
    if (matchSubnivel) {
      temasBase = matchSubnivel.temas;
    }
  }

  // 3. Si no hay match por subnivel, buscar por área
  if (temasBase.length === 0) {
    const matchArea = BANCO_TEMAS.find((t) => t.patron === patronArea);
    if (matchArea) {
      temasBase = matchArea.temas;
    }
  }

  // 4. Si aún no hay temas, generar temas genéricos basados en la destreza
  if (temasBase.length === 0) {
    temasBase = generarTemasGenericos(destreza);
  }

  // Asignar IDs únicos
  return temasBase.map((tema) => ({
    ...tema,
    id: generarId(),
  }));
}

/**
 * Genera temas genéricos cuando no hay temas específicos en el banco.
 */
function generarTemasGenericos(destreza: Destreza): Omit<TemaSugerido, "id">[] {
  const areaInfo = AREAS_INFO[destreza.area];
  const bloqueName = areaInfo.bloques[destreza.bloque] || `Bloque ${destreza.bloque}`;

  return [
    {
      titulo: `Explorando: ${bloqueName}`,
      descripcionBreve: `Clase introductoria sobre ${bloqueName.toLowerCase()} aplicada al contexto ecuatoriano.`,
      objetivoClase: destreza.objetivos[0] || destreza.descripcion,
      estructura: {
        anticipacion: {
          titulo: "Activación de conocimientos previos",
          duracion: "10 minutos",
          actividades: [
            `El docente presenta una situación o pregunta generadora relacionada con: ${destreza.descripcion}`,
            "Los estudiantes comparten sus experiencias y conocimientos previos sobre el tema.",
            "Lluvia de ideas: El docente registra las respuestas en la pizarra sin corregir.",
            "Presentación del objetivo de la clase y lo que se espera lograr.",
          ],
        },
        construccion: {
          titulo: "Construcción del conocimiento",
          duracion: "20 minutos",
          actividades: [
            "El docente presenta el contenido nuevo de manera estructurada y con ejemplos claros.",
            "Uso de material concreto, visual o tecnológico para facilitar la comprensión.",
            "Práctica guiada: Los estudiantes resuelven ejercicios junto al docente.",
            "Trabajo en el texto del estudiante: Lectura y análisis de ejemplos.",
            "Los estudiantes toman notas y hacen preguntas.",
          ],
        },
        consolidacion: {
          titulo: "Consolidación y práctica",
          duracion: "15 minutos",
          actividades: [
            "Trabajo individual o en parejas: Ejercicios de aplicación del contenido aprendido.",
            "Actividad práctica o lúdica que refuerce el aprendizaje.",
            "Resolución de problemas contextualizados a la realidad ecuatoriana.",
            "Verificación de respuestas entre compañeros.",
          ],
        },
        retroalimentacion: {
          titulo: "Retroalimentación y cierre",
          duracion: "10 minutos",
          actividades: [
            "Socialización de resultados y corrección colectiva.",
            "El docente aclara dudas y refuerza conceptos clave.",
            "Preguntas de verificación: ¿Qué aprendimos hoy? ¿Cómo lo aplicamos?",
            "Asignación de tarea para reforzar el aprendizaje.",
            "Metacognición: ¿Qué fue fácil? ¿Qué fue difícil? ¿Qué necesito repasar?",
          ],
        },
      },
      recursos: [
        "Texto del estudiante",
        "Cuaderno de trabajo",
        "Pizarra y marcadores",
        "Material concreto según el tema",
        "Recursos tecnológicos (si están disponibles)",
      ],
      evaluacionFormativa: `Observación directa y revisión de ejercicios. Criterio: ${destreza.indicadoresEvaluacion[0] || "Demuestra comprensión del contenido trabajado."}`,
    },
    {
      titulo: `Taller práctico: ${bloqueName}`,
      descripcionBreve: `Clase práctica y colaborativa enfocada en ${bloqueName.toLowerCase()} con trabajo en equipos.`,
      objetivoClase: destreza.objetivos[0] || destreza.descripcion,
      estructura: {
        anticipacion: {
          titulo: "Activación de conocimientos previos",
          duracion: "10 minutos",
          actividades: [
            "Dinámica grupal de activación: Juego o actividad corta relacionada con el tema.",
            `Repaso rápido de conceptos previos necesarios para: ${destreza.descripcion}`,
            "Formación de equipos de trabajo (4-5 integrantes) con roles asignados.",
            "Presentación del reto o proyecto que desarrollarán en la clase.",
          ],
        },
        construccion: {
          titulo: "Desarrollo del taller",
          duracion: "20 minutos",
          actividades: [
            "El docente presenta el procedimiento del taller paso a paso.",
            "Demostración práctica del docente (modelamiento).",
            "Los equipos trabajan en el desarrollo del reto o proyecto asignado.",
            "El docente recorre los grupos, orienta y resuelve dudas.",
            "Los equipos registran su proceso y resultados.",
          ],
        },
        consolidacion: {
          titulo: "Presentación y aplicación",
          duracion: "15 minutos",
          actividades: [
            "Cada equipo presenta sus resultados o productos al grupo.",
            "Los demás equipos hacen preguntas y aportan observaciones constructivas.",
            "Ejercicio individual de aplicación para verificar el aprendizaje.",
            "Conexión con situaciones de la vida cotidiana ecuatoriana.",
          ],
        },
        retroalimentacion: {
          titulo: "Retroalimentación y cierre",
          duracion: "10 minutos",
          actividades: [
            "El docente sintetiza los aprendizajes clave de la clase.",
            "Coevaluación: Los equipos evalúan el trabajo de otro equipo con criterios dados.",
            "Autoevaluación individual: ¿Qué aporté al equipo? ¿Qué aprendí?",
            "Tarea de extensión para profundizar el aprendizaje.",
            "Cierre motivacional: Importancia de lo aprendido para su formación.",
          ],
        },
      },
      recursos: [
        "Material concreto y manipulativo",
        "Papelotes y marcadores",
        "Texto del estudiante",
        "Rúbrica de evaluación",
        "Materiales específicos según la actividad",
      ],
      evaluacionFormativa: `Rúbrica de trabajo colaborativo y producto final. Criterio: ${destreza.criteriosEvaluacion[0] || "Demuestra dominio del contenido mediante trabajo práctico."}`,
    },
  ];
}
