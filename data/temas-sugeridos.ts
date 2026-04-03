import { Destreza, TemaSugerido, Area, AREAS_INFO } from "./types";

/**
 * Genera temas sugeridos para una destreza dada.
 * Cada tema incluye una estructura de clase de 45 minutos en 3 fases:
 * - Anticipacion (10 min): Activacion de conocimientos previos
 * - Desarrollo (25 min): Construccion del conocimiento
 * - Cierre (10 min): Consolidacion + preguntas de retroalimentacion
 *
 * Todas las actividades estan redactadas con verbos en INFINITIVO.
 */

interface TemaBase {
  patron: string;
  temas: Omit<TemaSugerido, "id">[];
}

const BANCO_TEMAS: TemaBase[] = [
  // ==========================================
  // MATEMATICA - Basica Elemental (Subnivel 2)
  // ==========================================
  {
    patron: "M.2.1",
    temas: [
      {
        titulo: "Jugando con conjuntos y clasificaciones",
        descripcionBreve: "Clasificar objetos del aula por color, forma y tamano para formar conjuntos.",
        objetivoClase: "Representar graficamente conjuntos discriminando propiedades de los objetos mediante actividades ludicas y manipulativas.",
        estructura: {
          anticipacion: {
            titulo: "Anticipacion",
            duracion: "10 minutos",
            actividades: [
              "Colocar en una mesa objetos variados (bloques de colores, figuras geometricas, lapices, borradores) y preguntar: Como podriamos agrupar estos objetos?",
              "Realizar una lluvia de ideas para que los estudiantes propongan criterios de clasificacion (por color, tamano, forma, uso).",
              "Registrar las ideas en la pizarra y preguntar: Que tienen en comun los objetos de cada grupo?",
              "Explorar conocimientos previos preguntando: Alguna vez han agrupado cosas en su casa? Como lo hicieron?",
            ],
          },
          desarrollo: {
            titulo: "Desarrollo",
            duracion: "25 minutos",
            actividades: [
              "Presentar el concepto de CONJUNTO como una agrupacion de elementos que comparten una caracteristica comun.",
              "Entregar a cada grupo una bolsa con objetos variados y solicitar que formen al menos 3 conjuntos diferentes.",
              "Guiar la representacion grafica: Indicar a los estudiantes que dibujen diagramas de Venn en papelotes.",
              "Explicar los elementos de un diagrama de Venn: nombre del conjunto, elementos, linea de frontera.",
              "Realizar una practica guiada resolviendo juntos un ejercicio de clasificacion en el texto del estudiante.",
              "Asignar trabajo individual: Solicitar que cada estudiante dibuje 2 conjuntos con objetos de su entorno.",
              "Organizar el juego 'El conjunto veloz': Nombrar una caracteristica y pedir que los estudiantes se agrupen segun esa caracteristica.",
            ],
          },
          cierre: {
            titulo: "Cierre",
            duracion: "10 minutos",
            actividades: [
              "Invitar a 3 estudiantes a presentar sus conjuntos al grupo y explicar el criterio de clasificacion.",
              "Formular preguntas de retroalimentacion: Que es un conjunto? Que necesitamos para formar un conjunto?",
              "Corregir colectivamente errores comunes (elementos que no pertenecen al conjunto, falta de criterio claro).",
              "Asignar tarea para casa: Formar 3 conjuntos con objetos de su hogar y dibujarlos en el cuaderno.",
              "Promover la metacognicion preguntando: Que aprendimos hoy? Para que nos sirve clasificar objetos?",
            ],
          },
        },
        recursos: ["Objetos variados del aula", "Papelotes y marcadores de colores", "Texto del estudiante", "Cuaderno de trabajo", "Diagramas de Venn impresos"],
        evaluacionFormativa: "Lista de cotejo: Identifica propiedades de objetos / Forma conjuntos con criterio claro / Representa conjuntos graficamente / Explica el criterio de clasificacion.",
      },
      {
        titulo: "Patrones con figuras y colores",
        descripcionBreve: "Descubrir y crear patrones usando figuras geometricas y colores en secuencias repetitivas.",
        objetivoClase: "Describir y reproducir patrones de objetos y figuras basandose en sus atributos de forma, color y tamano.",
        estructura: {
          anticipacion: {
            titulo: "Anticipacion",
            duracion: "10 minutos",
            actividades: [
              "Mostrar una secuencia de figuras en la pizarra (circulo rojo, cuadrado azul, circulo rojo, cuadrado azul, ?) y preguntar: Que figura sigue?",
              "Invitar a los estudiantes a observar patrones en el aula: baldosas del piso, disenos de cortinas, decoraciones.",
              "Formular la pregunta generadora: Donde mas han visto secuencias que se repiten?",
              "Realizar un juego ritmico: Palmada-golpe-palmada-golpe... Que sigue?",
            ],
          },
          desarrollo: {
            titulo: "Desarrollo",
            duracion: "25 minutos",
            actividades: [
              "Definir PATRON como una secuencia que se repite siguiendo una regla.",
              "Entregar bloques logicos y solicitar que los estudiantes reproduzcan patrones dados.",
              "Aumentar la complejidad progresivamente: Patrones de 2 elementos, luego 3, luego 4 elementos.",
              "Guiar la identificacion del nucleo del patron (la parte que se repite).",
              "Indicar que registren en el cuaderno los patrones trabajados y los coloreen siguiendo la secuencia.",
              "Proponer creacion libre: Solicitar que cada estudiante invente su propio patron usando al menos 3 atributos diferentes.",
              "Organizar el intercambio: Pedir que los companeros descubran la regla del patron y lo continuen.",
            ],
          },
          cierre: {
            titulo: "Cierre",
            duracion: "10 minutos",
            actividades: [
              "Organizar una galeria de patrones: Exhibir las creaciones y recorrerlas entre companeros.",
              "Formular preguntas de retroalimentacion: Que es un patron? Como identificamos la regla de un patron?",
              "Reforzar conceptos clave y aclarar dudas.",
              "Asignar tarea: Buscar 3 patrones en su casa o comunidad y dibujarlos.",
              "Promover la autoevaluacion: Pude crear mi propio patron? Pude descubrir el patron de mi companero?",
            ],
          },
        },
        recursos: ["Bloques logicos", "Fichas de colores", "Cuaderno cuadriculado", "Lapices de colores", "Texto del estudiante"],
        evaluacionFormativa: "Rubrica: Identifica el nucleo del patron / Reproduce patrones dados / Crea patrones originales / Explica la regla del patron.",
      },
      {
        titulo: "Sumas y restas en la tienda escolar",
        descripcionBreve: "Simulacion de compra-venta para practicar sumas y restas con numeros hasta 4 cifras.",
        objetivoClase: "Resolver problemas de sumas y restas con numeros hasta cuatro cifras en contextos de la vida cotidiana.",
        estructura: {
          anticipacion: {
            titulo: "Anticipacion",
            duracion: "10 minutos",
            actividades: [
              "Presentar una situacion: Maria tiene $25 y quiere comprar un cuaderno de $8 y un lapiz de $3. Le alcanza el dinero? Cuanto le sobra?",
              "Invitar a los estudiantes a resolver mentalmente y compartir sus estrategias.",
              "Realizar un repaso rapido de la tabla posicional (unidades, decenas, centenas, unidades de mil).",
              "Formular la pregunta motivadora: Alguna vez han ayudado a comprar en la tienda? Como calculan el vuelto?",
            ],
          },
          desarrollo: {
            titulo: "Desarrollo",
            duracion: "25 minutos",
            actividades: [
              "Montar la Tienda Escolar: Colocar productos con precios en una mesa.",
              "Modelar el proceso: Seleccionar productos, sumar precios y calcular vuelto (resta).",
              "Entregar billetes y monedas didacticas para representar las cantidades.",
              "Explicar el algoritmo de suma y resta con reagrupacion usando la tabla posicional.",
              "Resolver 3 problemas juntos paso a paso como practica guiada.",
              "Organizar juego de roles: Asignar el rol de vendedor y comprador para realizar transacciones.",
              "Solicitar que cada pareja registre 4 transacciones en su cuaderno con las operaciones completas.",
            ],
          },
          cierre: {
            titulo: "Cierre",
            duracion: "10 minutos",
            actividades: [
              "Invitar a 2 parejas a presentar sus transacciones mas interesantes.",
              "Revisar errores comunes: olvido de reagrupacion, errores en la tabla posicional.",
              "Formular preguntas de retroalimentacion: Cuando usamos la suma en la vida diaria? Y la resta?",
              "Asignar tarea: Acompanar a un familiar a la tienda y registrar 3 compras con sus operaciones.",
              "Promover la reflexion: Que fue lo mas dificil? Que estrategia me ayudo mas?",
            ],
          },
        },
        recursos: ["Billetes y monedas didacticas", "Productos con etiquetas de precios", "Tabla posicional impresa", "Cuaderno cuadriculado", "Texto del estudiante"],
        evaluacionFormativa: "Lista de cotejo: Suma correctamente con reagrupacion / Resta correctamente con reagrupacion / Resuelve problemas de compra-venta / Explica su proceso.",
      },
    ],
  },

  // ==========================================
  // MATEMATICA - Basica Media (Subnivel 3)
  // ==========================================
  {
    patron: "M.3.1",
    temas: [
      {
        titulo: "Fracciones en la cocina ecuatoriana",
        descripcionBreve: "Aprender fracciones usando recetas de comida tipica ecuatoriana como contexto.",
        objetivoClase: "Representar, leer, escribir y comparar fracciones mediante situaciones cotidianas relacionadas con la gastronomia ecuatoriana.",
        estructura: {
          anticipacion: {
            titulo: "Anticipacion",
            duracion: "10 minutos",
            actividades: [
              "Mostrar imagenes de platos tipicos ecuatorianos (encebollado, bolon, ceviche) y preguntar: Como repartirian este plato entre 4 personas?",
              "Presentar una receta que dice media taza de arroz, un cuarto de cebolla y preguntar: Que significan estas cantidades?",
              "Explorar conocimientos previos: Que es una fraccion? Donde han visto fracciones en su vida diaria?",
              "Repartir una hoja de papel a cada estudiante y pedir que la doblen en partes iguales.",
            ],
          },
          desarrollo: {
            titulo: "Desarrollo",
            duracion: "25 minutos",
            actividades: [
              "Definir FRACCION como una parte de un todo, identificando numerador y denominador.",
              "Demostrar con material concreto: Dividir frutas reales o de plastico en partes iguales (1/2 naranja, 1/4 manzana).",
              "Explicar la representacion grafica: Circulos y rectangulos divididos en partes iguales, coloreando las partes indicadas.",
              "Trabajar con la receta: Calcular ingredientes para 2, 4 y 8 personas usando fracciones.",
              "Ensenar a comparar fracciones usando material concreto y la recta numerica.",
              "Asignar practica en parejas: Resolver problemas de fracciones con contexto de cocina.",
              "Plantear desafios: Si una receta es para 6 personas y solo somos 3, que fraccion de cada ingrediente necesitamos?",
            ],
          },
          cierre: {
            titulo: "Cierre",
            duracion: "10 minutos",
            actividades: [
              "Invitar a cada pareja a presentar una fraccion que usaron en la receta.",
              "Formular preguntas de retroalimentacion: Que es el numerador? Que es el denominador? Como comparamos fracciones?",
              "Corregir errores frecuentes: confundir numerador con denominador, fracciones impropias.",
              "Asignar tarea: Buscar 5 fracciones en recetas de casa y escribirlas en el cuaderno.",
              "Promover la reflexion: Donde mas encontramos fracciones en nuestra vida?",
            ],
          },
        },
        recursos: ["Imagenes de platos ecuatorianos", "Frutas reales o de plastico", "Recetas impresas", "Circulos fraccionarios", "Texto del estudiante"],
        evaluacionFormativa: "Lista de cotejo: Lee y escribe fracciones / Representa graficamente / Compara fracciones / Resuelve problemas con fracciones.",
      },
      {
        titulo: "Geometria en la arquitectura de Quito",
        descripcionBreve: "Identificar figuras geometricas en edificaciones patrimoniales de Quito.",
        objetivoClase: "Clasificar y construir figuras geometricas (triangulos, cuadrilateros, circulos) reconociendolas en el entorno arquitectonico ecuatoriano.",
        estructura: {
          anticipacion: {
            titulo: "Anticipacion",
            duracion: "10 minutos",
            actividades: [
              "Mostrar fotografias de edificaciones de Quito (Basilica del Voto Nacional, Palacio de Carondelet, iglesias coloniales).",
              "Preguntar: Que formas geometricas pueden identificar en estas construcciones?",
              "Realizar una lluvia de ideas sobre figuras geometricas que conocen.",
              "Entregar una hoja con la silueta de un edificio y pedir que encierren las figuras geometricas que encuentren.",
            ],
          },
          desarrollo: {
            titulo: "Desarrollo",
            duracion: "25 minutos",
            actividades: [
              "Presentar la clasificacion de figuras geometricas: triangulos, cuadrilateros, circulos y poligonos.",
              "Explicar las propiedades de cada figura: lados, vertices, angulos.",
              "Demostrar con material concreto: Construir figuras con palillos y plastilina.",
              "Guiar la clasificacion de triangulos (equilatero, isosceles, escaleno) y cuadrilateros (cuadrado, rectangulo, rombo, trapecio).",
              "Asignar trabajo en grupos: Cada grupo recibe fotos de edificaciones y debe identificar y clasificar todas las figuras geometricas.",
              "Solicitar que midan con regla las figuras construidas y calculen perimetros.",
              "Proponer un reto: Disenar la fachada de un edificio usando al menos 5 figuras geometricas diferentes.",
            ],
          },
          cierre: {
            titulo: "Cierre",
            duracion: "10 minutos",
            actividades: [
              "Invitar a cada grupo a presentar las figuras encontradas en sus edificaciones.",
              "Formular preguntas de retroalimentacion: Que diferencia hay entre un cuadrado y un rectangulo? Cuantos tipos de triangulos existen?",
              "Corregir errores de clasificacion comunes.",
              "Asignar tarea: Fotografiar o dibujar 5 figuras geometricas encontradas en su barrio.",
              "Promover la reflexion: Por que la geometria es importante en la construccion?",
            ],
          },
        },
        recursos: ["Fotografias de edificaciones de Quito", "Palillos y plastilina", "Regla y transportador", "Cuaderno cuadriculado", "Texto del estudiante"],
        evaluacionFormativa: "Rubrica: Identifica figuras geometricas / Clasifica correctamente / Conoce propiedades / Aplica en contexto real.",
      },
    ],
  },

  // ==========================================
  // MATEMATICA - Basica Superior (Subnivel 4)
  // ==========================================
  {
    patron: "M.4.1",
    temas: [
      {
        titulo: "Numeros enteros: temperatura y altitud",
        descripcionBreve: "Comprender los numeros enteros usando contextos de temperatura y altitud en Ecuador.",
        objetivoClase: "Representar, ordenar y operar con numeros enteros en la recta numerica utilizando contextos reales de temperatura y altitud.",
        estructura: {
          anticipacion: {
            titulo: "Anticipacion",
            duracion: "10 minutos",
            actividades: [
              "Presentar datos reales: Temperatura en el Chimborazo: -5 grados C, en Guayaquil: +32 grados C. Preguntar: Que significa el signo negativo?",
              "Mostrar un termometro grande y preguntar: Que numeros ven debajo del cero?",
              "Explorar conocimientos previos: Donde han visto numeros negativos? (ascensores, cuentas bancarias, temperaturas).",
              "Formular la pregunta generadora: Si estamos a 3 grados y la temperatura baja 5 grados, a cuanto estamos?",
            ],
          },
          desarrollo: {
            titulo: "Desarrollo",
            duracion: "25 minutos",
            actividades: [
              "Definir NUMEROS ENTEROS como el conjunto que incluye positivos, negativos y el cero.",
              "Construir una recta numerica grande en la pizarra y ubicar numeros enteros.",
              "Explicar el concepto de valor absoluto y opuestos.",
              "Ensenar a ordenar y comparar numeros enteros usando la recta numerica.",
              "Resolver problemas contextualizados: temperaturas de ciudades ecuatorianas, altitudes (Quito 2850m, Fosa de las Marianas -11000m).",
              "Asignar trabajo en parejas: Ubicar numeros enteros en la recta numerica y compararlos.",
              "Introducir las reglas de signos para la suma: mismo signo se suman y se conserva el signo; diferente signo se restan y se pone el signo del mayor.",
            ],
          },
          cierre: {
            titulo: "Cierre",
            duracion: "10 minutos",
            actividades: [
              "Organizar el juego 'Mayor o Menor': Mostrar pares de numeros enteros y solicitar que indiquen cual es mayor.",
              "Corregir el error frecuente: -5 NO es mayor que -2.",
              "Formular preguntas de retroalimentacion: Que son los numeros enteros? Como se ubican en la recta numerica? Que es el valor absoluto?",
              "Asignar tarea: Investigar 5 situaciones reales donde se usen numeros negativos.",
              "Realizar evaluacion de salida: Ubicar 5 numeros enteros en la recta numerica.",
            ],
          },
        },
        recursos: ["Termometro", "Recta numerica grande para pizarra", "Imagenes de contextos con numeros negativos", "Cuaderno cuadriculado", "Texto del estudiante"],
        evaluacionFormativa: "Prueba corta: Ordenar 8 numeros enteros / Ubicar 5 en la recta numerica / Resolver 2 problemas contextualizados.",
      },
      {
        titulo: "Operaciones con enteros: ganancias y perdidas",
        descripcionBreve: "Aprender a sumar, restar, multiplicar y dividir numeros enteros con situaciones de finanzas.",
        objetivoClase: "Resolver problemas de aplicacion con operaciones de adicion, sustraccion, multiplicacion y division de numeros enteros.",
        estructura: {
          anticipacion: {
            titulo: "Anticipacion",
            duracion: "10 minutos",
            actividades: [
              "Presentar la situacion: Pedro tiene $50 y debe $30. Luego gana $20 pero gasta $15. Cuanto tiene al final?",
              "Motivar a los estudiantes a intentar resolverlo con sus propias estrategias.",
              "Repasar: Preguntar a los estudiantes que son los numeros enteros y como se ubican en la recta numerica.",
              "Introducir la idea de que sumar un negativo es como restar, y restar un negativo es como sumar.",
            ],
          },
          desarrollo: {
            titulo: "Desarrollo",
            duracion: "25 minutos",
            actividades: [
              "Presentar las REGLAS DE SIGNOS para la suma: mismo signo se suman y se conserva el signo; diferente signo se restan y se pone el signo del mayor.",
              "Presentar las REGLAS DE SIGNOS para multiplicacion y division: (+)(+)=+, (+)(-)=-, (-)(+)=-, (-)(-) =+.",
              "Demostrar con la recta numerica y con fichas bicolor (rojas = negativo, azules = positivo).",
              "Resolver paso a paso 6 ejercicios de complejidad creciente.",
              "Indicar que los estudiantes practiquen en sus cuadernos junto al docente.",
              "Organizar el juego 'El Banco': Entregar a cada estudiante una cuenta bancaria con saldo inicial y tarjetas de eventos (ganancias y perdidas).",
              "Asignar trabajo individual: 8 ejercicios de operaciones combinadas con enteros.",
            ],
          },
          cierre: {
            titulo: "Cierre",
            duracion: "10 minutos",
            actividades: [
              "Corregir colectivamente los ejercicios mas desafiantes.",
              "Elaborar entre todos una tabla resumen de reglas de signos.",
              "Formular preguntas de retroalimentacion: Que pasa cuando multiplicamos dos numeros negativos? Como sabemos el signo del resultado en una suma?",
              "Asignar tarea: 10 ejercicios de operaciones con enteros del texto.",
              "Promover la autoevaluacion: Domino las reglas de signos? Puedo resolver problemas con enteros?",
            ],
          },
        },
        recursos: ["Fichas bicolor (rojas y azules)", "Recta numerica", "Tarjetas de eventos para el juego", "Calculadora", "Cuaderno", "Texto del estudiante"],
        evaluacionFormativa: "Prueba escrita: 4 operaciones con enteros + 2 problemas contextualizados. Criterio: aplica correctamente las reglas de signos.",
      },
    ],
  },

  // ==========================================
  // MATEMATICA - Bachillerato (Subnivel 5)
  // ==========================================
  {
    patron: "M.5.1",
    temas: [
      {
        titulo: "Productos notables y factorizacion",
        descripcionBreve: "Dominar los productos notables y la factorizacion como herramientas algebraicas fundamentales.",
        objetivoClase: "Aplicar las propiedades algebraicas de los numeros reales en la resolucion de productos notables y factorizacion.",
        estructura: {
          anticipacion: {
            titulo: "Anticipacion",
            duracion: "10 minutos",
            actividades: [
              "Repasar propiedades de potenciacion y multiplicacion de polinomios.",
              "Presentar (a+b) al cuadrado y pedir a los estudiantes que lo desarrollen multiplicando.",
              "Formular la pregunta: Existe una forma mas rapida de obtener el resultado sin multiplicar termino a termino?",
              "Establecer la conexion geometrica: Representar (a+b) al cuadrado como el area de un cuadrado de lado (a+b).",
            ],
          },
          desarrollo: {
            titulo: "Desarrollo",
            duracion: "25 minutos",
            actividades: [
              "Presentar los PRODUCTOS NOTABLES: Cuadrado de binomio, Diferencia de cuadrados, Cubo de binomio.",
              "Realizar la demostracion algebraica y geometrica de cada caso.",
              "Explicar la FACTORIZACION como proceso inverso: Factor comun, Trinomio cuadrado perfecto, Diferencia de cuadrados.",
              "Elaborar una tabla comparativa: Producto Notable y su Factorizacion correspondiente (procesos inversos).",
              "Resolver 6 ejercicios guiados (3 de productos notables, 3 de factorizacion).",
              "Asignar trabajo individual: 10 ejercicios variados de productos notables y factorizacion.",
              "Proponer desafio: Simplificar fracciones algebraicas usando factorizacion.",
            ],
          },
          cierre: {
            titulo: "Cierre",
            duracion: "10 minutos",
            actividades: [
              "Corregir ejercicios seleccionados en la pizarra.",
              "Elaborar un mapa mental colectivo: Tipos de productos notables y sus factorizaciones correspondientes.",
              "Formular preguntas de retroalimentacion: Cual es la relacion entre producto notable y factorizacion? Que errores debemos evitar?",
              "Senalar errores frecuentes: (a+b) al cuadrado NO es igual a a cuadrado + b cuadrado.",
              "Asignar tarea: 15 ejercicios mixtos del texto.",
            ],
          },
        },
        recursos: ["Pizarra y marcadores", "Material geometrico para representaciones", "Calculadora cientifica", "Texto del estudiante", "Cuaderno"],
        evaluacionFormativa: "Prueba escrita: 5 productos notables + 5 factorizaciones + 2 aplicaciones. Criterio: desarrollo correcto paso a paso.",
      },
    ],
  },

  // ==========================================
  // LENGUA Y LITERATURA - Basica Elemental
  // ==========================================
  {
    patron: "LL.2",
    temas: [
      {
        titulo: "Cuentos de mi comunidad",
        descripcionBreve: "Explorar la tradicion oral ecuatoriana a traves de cuentos y leyendas locales.",
        objetivoClase: "Valorar la diversidad linguistica y cultural del Ecuador a traves de la lectura y narracion de cuentos tradicionales.",
        estructura: {
          anticipacion: {
            titulo: "Anticipacion",
            duracion: "10 minutos",
            actividades: [
              "Preguntar: Conocen algun cuento o leyenda que les hayan contado sus abuelos?",
              "Realizar una lluvia de ideas sobre cuentos tradicionales ecuatorianos (La Llorona, El Duende, La Dama Tapada).",
              "Mostrar imagenes de personajes de leyendas ecuatorianas.",
              "Formular la pregunta: Por que creen que nuestros antepasados contaban estas historias?",
            ],
          },
          desarrollo: {
            titulo: "Desarrollo",
            duracion: "25 minutos",
            actividades: [
              "Realizar la lectura en voz alta de un cuento tradicional ecuatoriano seleccionado.",
              "Guiar el analisis: Quienes son los personajes? Donde ocurre? Que problema hay? Como se resuelve?",
              "Identificar la ESTRUCTURA del cuento: Inicio, Nudo, Desenlace.",
              "Senalar vocabulario nuevo: Identificar palabras desconocidas y buscar su significado.",
              "Explicar que es la TRADICION ORAL y su importancia cultural.",
              "Asignar trabajo en grupos: Entregar a cada grupo un cuento diferente y solicitar que identifiquen inicio, nudo y desenlace.",
              "Proponer escritura creativa: Solicitar que cada estudiante escriba un final alternativo para el cuento leido.",
            ],
          },
          cierre: {
            titulo: "Cierre",
            duracion: "10 minutos",
            actividades: [
              "Invitar a los grupos a presentar brevemente sus dramatizaciones.",
              "Leer algunos finales alternativos creativos.",
              "Formular preguntas de retroalimentacion: Que ensenanza nos deja el cuento? Por que es importante conservar nuestras historias?",
              "Asignar tarea: Pedir a un familiar que les cuente una historia o leyenda y escribirla en el cuaderno.",
              "Establecer el compromiso: Valorar y compartir las historias de nuestra cultura.",
            ],
          },
        },
        recursos: ["Libro de cuentos ecuatorianos", "Imagenes de personajes de leyendas", "Papelotes para dramatizacion", "Lapices de colores", "Cuaderno"],
        evaluacionFormativa: "Lista de cotejo: Identifica la estructura del cuento / Participa en la dramatizacion / Escribe un final alternativo coherente / Valora la tradicion oral.",
      },
    ],
  },

  // ==========================================
  // LENGUA Y LITERATURA - Basica Media
  // ==========================================
  {
    patron: "LL.3",
    temas: [
      {
        titulo: "Escribimos noticias de nuestra escuela",
        descripcionBreve: "Aprender la estructura de la noticia escribiendo sobre eventos escolares.",
        objetivoClase: "Producir textos periodisticos (noticias) aplicando las propiedades textuales de coherencia, cohesion y adecuacion.",
        estructura: {
          anticipacion: {
            titulo: "Anticipacion",
            duracion: "10 minutos",
            actividades: [
              "Mostrar recortes de periodicos ecuatorianos (El Comercio, El Universo) y preguntar: Que tipo de textos son estos?",
              "Leer un titular y preguntar: Que informacion nos da? Que preguntas responde?",
              "Explorar conocimientos previos: Que diferencia hay entre un cuento y una noticia?",
              "Presentar el reto: Hoy vamos a convertirnos en periodistas de nuestra escuela.",
            ],
          },
          desarrollo: {
            titulo: "Desarrollo",
            duracion: "25 minutos",
            actividades: [
              "Presentar la estructura de la NOTICIA: Titular, Entrada (lead), Cuerpo, Cierre.",
              "Explicar las 6 preguntas basicas: Que? Quien? Cuando? Donde? Como? Por que?",
              "Analizar juntos una noticia real identificando cada parte de la estructura.",
              "Modelar la escritura de una noticia sobre un evento escolar reciente.",
              "Asignar trabajo en parejas: Elegir un evento escolar y redactar una noticia siguiendo la estructura.",
              "Guiar la revision: Verificar que la noticia responda las 6 preguntas basicas.",
              "Solicitar que diagramen su noticia como en un periodico real (titular grande, columnas, imagen).",
            ],
          },
          cierre: {
            titulo: "Cierre",
            duracion: "10 minutos",
            actividades: [
              "Invitar a 3 parejas a leer sus noticias frente al grupo.",
              "Formular preguntas de retroalimentacion: Que partes tiene una noticia? Que preguntas debe responder? Que diferencia hay entre una noticia y una opinion?",
              "Corregir errores comunes de redaccion periodistica.",
              "Asignar tarea: Escribir una noticia sobre un evento familiar o del barrio.",
              "Proponer la creacion del Periodico Escolar como proyecto de aula.",
            ],
          },
        },
        recursos: ["Recortes de periodicos ecuatorianos", "Papelotes y marcadores", "Cuaderno", "Texto del estudiante", "Plantilla de noticia"],
        evaluacionFormativa: "Rubrica: Estructura correcta de la noticia / Responde las 6 preguntas / Redaccion clara y coherente / Presentacion adecuada.",
      },
    ],
  },

  // ==========================================
  // CIENCIAS NATURALES - Basica Elemental
  // ==========================================
  {
    patron: "CN.2",
    temas: [
      {
        titulo: "Los seres vivos de mi entorno",
        descripcionBreve: "Observar y clasificar seres vivos del entorno inmediato segun sus caracteristicas.",
        objetivoClase: "Explorar y clasificar los seres vivos del entorno en animales y plantas segun sus caracteristicas observables.",
        estructura: {
          anticipacion: {
            titulo: "Anticipacion",
            duracion: "10 minutos",
            actividades: [
              "Llevar a los estudiantes al patio o jardin de la escuela y pedir que observen todo lo que les rodea.",
              "Preguntar: Que seres vivos pueden ver? Que diferencia hay entre una planta y un animal?",
              "Realizar una lluvia de ideas: Que necesitan los seres vivos para vivir?",
              "Registrar las respuestas en un papelote dividido en dos columnas: Animales y Plantas.",
            ],
          },
          desarrollo: {
            titulo: "Desarrollo",
            duracion: "25 minutos",
            actividades: [
              "Presentar la clasificacion de seres vivos: Animales (vertebrados e invertebrados) y Plantas (con flor y sin flor).",
              "Mostrar laminas con ejemplos de cada grupo, priorizando fauna y flora ecuatoriana.",
              "Guiar la observacion con lupa de insectos, hojas y flores del jardin escolar.",
              "Solicitar que los estudiantes dibujen y clasifiquen 5 seres vivos observados.",
              "Explicar las caracteristicas comunes de los seres vivos: nacen, crecen, se reproducen, mueren.",
              "Asignar trabajo en grupos: Completar una tabla de clasificacion con imagenes recortadas de revistas.",
              "Proponer la creacion de un mini herbario con hojas recolectadas.",
            ],
          },
          cierre: {
            titulo: "Cierre",
            duracion: "10 minutos",
            actividades: [
              "Invitar a cada grupo a presentar su tabla de clasificacion.",
              "Formular preguntas de retroalimentacion: Que caracteristicas comparten todos los seres vivos? Como diferenciamos animales de plantas?",
              "Corregir clasificaciones incorrectas y aclarar dudas.",
              "Asignar tarea: Observar el jardin de casa e identificar 5 seres vivos, dibujarlos y clasificarlos.",
              "Promover la reflexion: Por que debemos cuidar a los seres vivos de nuestro entorno?",
            ],
          },
        },
        recursos: ["Lupas", "Laminas de seres vivos ecuatorianos", "Revistas para recortar", "Cuaderno de campo", "Texto del estudiante"],
        evaluacionFormativa: "Lista de cotejo: Identifica seres vivos / Clasifica en animales y plantas / Describe caracteristicas observables / Valora la biodiversidad.",
      },
    ],
  },

  // ==========================================
  // CIENCIAS NATURALES - Basica Media
  // ==========================================
  {
    patron: "CN.3",
    temas: [
      {
        titulo: "El ciclo del agua en Ecuador",
        descripcionBreve: "Comprender el ciclo del agua relacionandolo con la geografia y el clima ecuatoriano.",
        objetivoClase: "Describir el ciclo del agua y su importancia para los ecosistemas ecuatorianos mediante observacion y experimentacion.",
        estructura: {
          anticipacion: {
            titulo: "Anticipacion",
            duracion: "10 minutos",
            actividades: [
              "Mostrar imagenes de diferentes fuentes de agua en Ecuador (rios Guayas, Napo; nevados, Amazonas) y preguntar: De donde viene el agua que tomamos?",
              "Realizar un experimento rapido: Colocar un vaso con agua al sol y observar la condensacion en una tapa.",
              "Explorar conocimientos previos: Que pasa con el agua de los charcos despues de la lluvia?",
              "Formular la pregunta generadora: El agua se acaba o se recicla?",
            ],
          },
          desarrollo: {
            titulo: "Desarrollo",
            duracion: "25 minutos",
            actividades: [
              "Presentar las fases del ciclo del agua: evaporacion, condensacion, precipitacion, escorrentia, infiltracion.",
              "Realizar un experimento demostrativo: Calentar agua en un recipiente, observar el vapor y la condensacion en un plato frio.",
              "Explicar cada fase con ejemplos del contexto ecuatoriano (nevados, selva amazonica, costa).",
              "Guiar la elaboracion de un diagrama del ciclo del agua en el cuaderno.",
              "Relacionar el ciclo del agua con los climas de Ecuador: Costa (humedo), Sierra (templado), Oriente (tropical).",
              "Asignar trabajo en grupos: Construir una maqueta del ciclo del agua con materiales reciclados.",
              "Discutir la importancia del agua y los problemas de contaminacion en rios ecuatorianos.",
            ],
          },
          cierre: {
            titulo: "Cierre",
            duracion: "10 minutos",
            actividades: [
              "Invitar a cada grupo a explicar su maqueta del ciclo del agua.",
              "Formular preguntas de retroalimentacion: Cuales son las fases del ciclo del agua? Que pasaria si no lloviera? Como afecta la contaminacion al ciclo del agua?",
              "Reforzar la importancia de cuidar las fuentes de agua.",
              "Asignar tarea: Investigar de donde viene el agua potable de su ciudad.",
              "Promover el compromiso: Que podemos hacer para cuidar el agua en nuestra escuela y hogar?",
            ],
          },
        },
        recursos: ["Recipiente para calentar agua", "Plato frio", "Imagenes de fuentes de agua ecuatorianas", "Materiales reciclados para maqueta", "Texto del estudiante"],
        evaluacionFormativa: "Rubrica: Identifica las fases del ciclo del agua / Explica cada fase / Relaciona con el contexto ecuatoriano / Propone acciones de cuidado.",
      },
    ],
  },

  // ==========================================
  // ESTUDIOS SOCIALES - Basica Elemental
  // ==========================================
  {
    patron: "CS.2",
    temas: [
      {
        titulo: "Mi comunidad y sus costumbres",
        descripcionBreve: "Conocer y valorar las costumbres y tradiciones de la comunidad local.",
        objetivoClase: "Describir y valorar las costumbres, tradiciones y manifestaciones culturales de la comunidad como parte de la identidad ecuatoriana.",
        estructura: {
          anticipacion: {
            titulo: "Anticipacion",
            duracion: "10 minutos",
            actividades: [
              "Mostrar fotografias de fiestas y tradiciones ecuatorianas (Inti Raymi, Mama Negra, Carnaval de Guaranda) y preguntar: Reconocen alguna de estas celebraciones?",
              "Invitar a los estudiantes a compartir que fiestas celebran en su familia o comunidad.",
              "Explorar conocimientos previos: Que es una tradicion? Que es una costumbre?",
              "Formular la pregunta: Por que es importante conocer nuestras tradiciones?",
            ],
          },
          desarrollo: {
            titulo: "Desarrollo",
            duracion: "25 minutos",
            actividades: [
              "Definir TRADICION y COSTUMBRE con ejemplos concretos del Ecuador.",
              "Presentar las principales fiestas y tradiciones de las 4 regiones del Ecuador: Costa, Sierra, Oriente e Insular.",
              "Mostrar videos cortos o imagenes de celebraciones tipicas.",
              "Guiar la elaboracion de un mapa del Ecuador senalando tradiciones por region.",
              "Asignar trabajo en grupos: Cada grupo investiga una tradicion asignada y prepara una exposicion.",
              "Solicitar que los estudiantes dibujen su tradicion favorita y escriban por que es importante.",
              "Comparar tradiciones: Que tienen en comun? En que se diferencian?",
            ],
          },
          cierre: {
            titulo: "Cierre",
            duracion: "10 minutos",
            actividades: [
              "Invitar a cada grupo a presentar su tradicion investigada.",
              "Formular preguntas de retroalimentacion: Que tradiciones tiene Ecuador? Por que son diferentes en cada region? Que pasaria si olvidamos nuestras tradiciones?",
              "Reforzar el valor de la diversidad cultural.",
              "Asignar tarea: Entrevistar a un familiar mayor sobre una tradicion de su comunidad.",
              "Establecer el compromiso: Respetar y valorar todas las culturas de nuestro pais.",
            ],
          },
        },
        recursos: ["Fotografias de fiestas ecuatorianas", "Mapa del Ecuador", "Videos cortos de tradiciones", "Papelotes y marcadores", "Cuaderno"],
        evaluacionFormativa: "Lista de cotejo: Identifica tradiciones ecuatorianas / Ubica tradiciones por region / Valora la diversidad cultural / Participa activamente.",
      },
    ],
  },

  // ==========================================
  // ESTUDIOS SOCIALES - Basica Media
  // ==========================================
  {
    patron: "CS.3",
    temas: [
      {
        titulo: "Las regiones naturales del Ecuador",
        descripcionBreve: "Conocer las caracteristicas geograficas, climaticas y culturales de las regiones del Ecuador.",
        objetivoClase: "Describir las caracteristicas geograficas, climaticas y culturales de las cuatro regiones naturales del Ecuador.",
        estructura: {
          anticipacion: {
            titulo: "Anticipacion",
            duracion: "10 minutos",
            actividades: [
              "Mostrar un mapa fisico del Ecuador y preguntar: Cuantas regiones naturales tiene Ecuador? Cuales son?",
              "Realizar una lluvia de ideas: Que saben de cada region? Que animales, plantas o comidas son tipicas?",
              "Mostrar fotografias de paisajes de las 4 regiones y pedir que identifiquen a cual pertenecen.",
              "Formular la pregunta: Por que Ecuador es considerado un pais megadiverso?",
            ],
          },
          desarrollo: {
            titulo: "Desarrollo",
            duracion: "25 minutos",
            actividades: [
              "Presentar las 4 regiones naturales: Costa, Sierra, Oriente (Amazonia) e Insular (Galapagos).",
              "Explicar las caracteristicas de cada region: relieve, clima, flora, fauna, actividades economicas.",
              "Guiar la elaboracion de un cuadro comparativo de las 4 regiones.",
              "Mostrar videos cortos de cada region destacando su biodiversidad.",
              "Asignar trabajo en grupos: Cada grupo se convierte en experto de una region y prepara un afiche informativo.",
              "Solicitar que ubiquen en el mapa las principales ciudades, rios y elevaciones de cada region.",
              "Discutir los problemas ambientales de cada region y posibles soluciones.",
            ],
          },
          cierre: {
            titulo: "Cierre",
            duracion: "10 minutos",
            actividades: [
              "Invitar a cada grupo a presentar su afiche de la region asignada.",
              "Formular preguntas de retroalimentacion: Que region tiene el clima mas calido? Donde estan las Islas Galapagos? Por que Ecuador es megadiverso?",
              "Corregir conceptos erroneos sobre las regiones.",
              "Asignar tarea: Investigar un animal o planta endemica de una region y preparar una ficha informativa.",
              "Promover la reflexion: Como podemos contribuir a cuidar la biodiversidad de nuestro pais?",
            ],
          },
        },
        recursos: ["Mapa fisico del Ecuador", "Fotografias de las 4 regiones", "Videos de biodiversidad ecuatoriana", "Papelotes y marcadores", "Texto del estudiante"],
        evaluacionFormativa: "Rubrica: Identifica las 4 regiones / Describe caracteristicas de cada una / Ubica elementos en el mapa / Valora la biodiversidad.",
      },
    ],
  },

  // ==========================================
  // EDUCACION FISICA
  // ==========================================
  {
    patron: "EF",
    temas: [
      {
        titulo: "Juegos tradicionales ecuatorianos",
        descripcionBreve: "Practicar juegos tradicionales del Ecuador valorando el patrimonio ludico cultural.",
        objetivoClase: "Participar en juegos tradicionales ecuatorianos reconociendo su valor cultural y desarrollando habilidades motrices basicas.",
        estructura: {
          anticipacion: {
            titulo: "Anticipacion",
            duracion: "10 minutos",
            actividades: [
              "Preguntar: Conocen juegos que jugaban sus padres o abuelos cuando eran ninos?",
              "Realizar una lluvia de ideas: Solicitar que los estudiantes nombren juegos tradicionales (rayuela, trompo, canicas, saltar la cuerda).",
              "Dirigir el calentamiento general: Trote suave, movilidad articular, estiramientos dinamicos.",
              "Organizar un calentamiento especifico con el juego de persecucion 'El lobo y las ovejas'.",
            ],
          },
          desarrollo: {
            titulo: "Desarrollo",
            duracion: "25 minutos",
            actividades: [
              "Organizar la Estacion 1 - RAYUELA: Explicar las reglas, demostrar y solicitar que los estudiantes practiquen.",
              "Organizar la Estacion 2 - SALTAR LA CUERDA: Practicar de forma individual y grupal con diferentes formas de saltar.",
              "Organizar la Estacion 3 - CARRERA DE ENSACADOS: Organizar por equipos y ensenar la tecnica de salto.",
              "Rotar cada 8 minutos para que todos experimenten cada estacion.",
              "Observar y corregir posturas, tecnicas y actitudes durante las actividades.",
              "Organizar un mini torneo de juegos tradicionales: Asignar puntos por participacion, respeto y deportivismo.",
              "Invitar a los estudiantes a proponer variantes creativas de los juegos.",
            ],
          },
          cierre: {
            titulo: "Cierre",
            duracion: "10 minutos",
            actividades: [
              "Dirigir ejercicios de estiramiento y respiracion para la vuelta a la calma.",
              "Organizar un circulo de reflexion: Que juego les gusto mas? Por que?",
              "Formular preguntas de retroalimentacion: Por que es importante mantener vivos estos juegos? Que habilidades desarrollamos al jugar?",
              "Asignar tarea: Preguntar a un adulto mayor sobre un juego tradicional que ya no se practique y traer la descripcion.",
              "Recordar la importancia de la hidratacion y el aseo personal.",
            ],
          },
        },
        recursos: ["Rayuela dibujada en el patio", "Cuerdas para saltar", "Sacos para carrera", "Silbato", "Conos para delimitar estaciones"],
        evaluacionFormativa: "Ficha de observacion: Participa activamente / Respeta reglas y companeros / Demuestra habilidades motrices basicas / Valora los juegos tradicionales.",
      },
    ],
  },

  // ==========================================
  // EDUCACION CULTURAL Y ARTISTICA
  // ==========================================
  {
    patron: "ECA",
    temas: [
      {
        titulo: "Arte con materiales reciclados",
        descripcionBreve: "Crear obras artisticas usando materiales reciclados, fomentando la creatividad y la conciencia ambiental.",
        objetivoClase: "Explorar las posibilidades expresivas de materiales reciclados para crear obras artisticas originales.",
        estructura: {
          anticipacion: {
            titulo: "Anticipacion",
            duracion: "10 minutos",
            actividades: [
              "Mostrar obras de arte hechas con materiales reciclados (esculturas, collages, instrumentos musicales).",
              "Preguntar: Se puede hacer arte con basura? Que materiales reciclados podrian servir?",
              "Invitar a los estudiantes a observar los materiales disponibles (botellas, carton, tapas, periodicos, telas).",
              "Compartir una breve historia de artistas que trabajan con materiales reciclados como inspiracion.",
            ],
          },
          desarrollo: {
            titulo: "Desarrollo",
            duracion: "25 minutos",
            actividades: [
              "Presentar tecnicas basicas: collage, ensamblaje, escultura con carton, pintura sobre materiales reciclados.",
              "Demostrar la creacion de un objeto artistico simple paso a paso.",
              "Permitir la exploracion libre: Solicitar que los estudiantes manipulen los materiales y experimenten con diferentes combinaciones.",
              "Guiar la planificacion: Indicar que cada estudiante o pareja dibuje un boceto de lo que quiere crear.",
              "Acompanar la creacion: Guiar y apoyar individualmente durante el proceso creativo.",
              "Solicitar que agreguen detalles: pintura, decoracion, acabados.",
              "Indicar que cada estudiante prepare una breve explicacion de su obra: titulo, materiales usados, significado.",
            ],
          },
          cierre: {
            titulo: "Cierre",
            duracion: "10 minutos",
            actividades: [
              "Organizar una galeria de arte: Exhibir las obras en el aula o pasillo.",
              "Invitar a cada artista a presentar su obra al grupo.",
              "Solicitar que los companeros expresen que les gusta de cada obra (critica constructiva).",
              "Formular preguntas de retroalimentacion: Que aprendimos sobre la creatividad? Como el arte puede ayudar al medio ambiente?",
              "Asignar tarea: Crear en casa una obra artistica con materiales reciclados y traer fotos.",
            ],
          },
        },
        recursos: ["Botellas plasticas, carton, tapas, periodicos", "Tijeras, goma, cinta adhesiva", "Pinturas y pinceles", "Telas y retazos", "Marcadores"],
        evaluacionFormativa: "Rubrica: Creatividad y originalidad / Uso adecuado de materiales / Tecnica empleada / Presentacion y explicacion de la obra.",
      },
    ],
  },
];

// ============================================================
// FUNCION PRINCIPAL: Obtener temas sugeridos para una destreza
// ============================================================

function generarId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 6);
}

export function obtenerTemasSugeridos(destreza: Destreza): TemaSugerido[] {
  const patronExacto = `${destreza.area}.${destreza.subnivel}.${destreza.bloque}`;
  const patronSubnivel = `${destreza.area}.${destreza.subnivel}`;
  const patronArea = destreza.area;

  let temasBase: Omit<TemaSugerido, "id">[] = [];

  // 1. Buscar por patron exacto (area.subnivel.bloque)
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

  // 3. Si no hay match por subnivel, buscar por area
  if (temasBase.length === 0) {
    const matchArea = BANCO_TEMAS.find((t) => t.patron === patronArea);
    if (matchArea) {
      temasBase = matchArea.temas;
    }
  }

  // 4. Si aun no hay temas, generar temas genericos basados en la destreza
  if (temasBase.length === 0) {
    temasBase = generarTemasGenericos(destreza);
  }

  return temasBase.map((tema) => ({
    ...tema,
    id: generarId(),
  }));
}

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
          titulo: "Anticipacion",
          duracion: "10 minutos",
          actividades: [
            `Presentar una situacion o pregunta generadora relacionada con: ${destreza.descripcion}`,
            "Invitar a los estudiantes a compartir sus experiencias y conocimientos previos sobre el tema.",
            "Realizar una lluvia de ideas y registrar las respuestas en la pizarra sin corregir.",
            "Presentar el objetivo de la clase y lo que se espera lograr.",
          ],
        },
        desarrollo: {
          titulo: "Desarrollo",
          duracion: "25 minutos",
          actividades: [
            "Presentar el contenido nuevo de manera estructurada y con ejemplos claros.",
            "Utilizar material concreto, visual o tecnologico para facilitar la comprension.",
            "Realizar practica guiada: Resolver ejercicios junto a los estudiantes.",
            "Trabajar en el texto del estudiante: Leer y analizar ejemplos.",
            "Solicitar que los estudiantes tomen notas y formulen preguntas.",
            "Asignar trabajo individual o en parejas: Ejercicios de aplicacion del contenido aprendido.",
            "Proponer una actividad practica o ludica que refuerce el aprendizaje.",
          ],
        },
        cierre: {
          titulo: "Cierre",
          duracion: "10 minutos",
          actividades: [
            "Socializar resultados y corregir colectivamente.",
            "Aclarar dudas y reforzar conceptos clave.",
            "Formular preguntas de retroalimentacion: Que aprendimos hoy? Como lo aplicamos en la vida diaria?",
            "Asignar tarea para reforzar el aprendizaje.",
            "Promover la metacognicion: Que fue facil? Que fue dificil? Que necesito repasar?",
          ],
        },
      },
      recursos: [
        "Texto del estudiante",
        "Cuaderno de trabajo",
        "Pizarra y marcadores",
        "Material concreto segun el tema",
        "Recursos tecnologicos (si estan disponibles)",
      ],
      evaluacionFormativa: `Observacion directa y revision de ejercicios. Criterio: ${destreza.indicadoresEvaluacion[0] || "Demuestra comprension del contenido trabajado."}`,
    },
    {
      titulo: `Taller practico: ${bloqueName}`,
      descripcionBreve: `Clase practica y colaborativa enfocada en ${bloqueName.toLowerCase()} con trabajo en equipos.`,
      objetivoClase: destreza.objetivos[0] || destreza.descripcion,
      estructura: {
        anticipacion: {
          titulo: "Anticipacion",
          duracion: "10 minutos",
          actividades: [
            "Realizar una dinamica grupal de activacion: Juego o actividad corta relacionada con el tema.",
            `Repasar rapidamente conceptos previos necesarios para: ${destreza.descripcion}`,
            "Formar equipos de trabajo (4-5 integrantes) con roles asignados.",
            "Presentar el reto o proyecto que desarrollaran en la clase.",
          ],
        },
        desarrollo: {
          titulo: "Desarrollo",
          duracion: "25 minutos",
          actividades: [
            "Presentar el procedimiento del taller paso a paso.",
            "Realizar una demostracion practica (modelamiento).",
            "Guiar a los equipos en el desarrollo del reto o proyecto asignado.",
            "Recorrer los grupos, orientar y resolver dudas.",
            "Solicitar que los equipos registren su proceso y resultados.",
            "Invitar a cada equipo a presentar sus resultados o productos al grupo.",
            "Proponer un ejercicio individual de aplicacion para verificar el aprendizaje.",
          ],
        },
        cierre: {
          titulo: "Cierre",
          duracion: "10 minutos",
          actividades: [
            "Sintetizar los aprendizajes clave de la clase.",
            "Organizar la coevaluacion: Solicitar que los equipos evaluen el trabajo de otro equipo con criterios dados.",
            "Formular preguntas de retroalimentacion: Que aprendimos? Que aporte hice al equipo? Que puedo mejorar?",
            "Asignar tarea de extension para profundizar el aprendizaje.",
            "Realizar un cierre motivacional: Destacar la importancia de lo aprendido para su formacion.",
          ],
        },
      },
      recursos: [
        "Material concreto y manipulativo",
        "Papelotes y marcadores",
        "Texto del estudiante",
        "Rubrica de evaluacion",
        "Materiales especificos segun la actividad",
      ],
      evaluacionFormativa: `Rubrica de trabajo colaborativo y producto final. Criterio: ${destreza.criteriosEvaluacion[0] || "Demuestra dominio del contenido mediante trabajo practico."}`,
    },
  ];
}
