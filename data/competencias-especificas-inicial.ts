/**
 * Catálogo de Competencias Específicas — Currículo Integrado
 * Nivel de Educación Inicial (3-5 años)
 *
 * Fuente: MESOCURRICULUM / "1. Inicial.xlsx" (Matriz de distribución/desagregación
 * de saberes e indicadores de evaluación, Educación Inicial 3-4 y 4-5 años)
 * Codificación oficial:
 *   - Competencia específica: CE.CI.0.X
 *   - Saberes (declarativos/procedimentales/actitudinales): CI.0.<bloque>.<d|p|a>.<n>
 *   - Indicadores de evaluación: I.CI.0.X.<n>
 *
 * Los datos se extrajeron directamente de la matriz oficial para evitar
 * códigos inventados o desalineados con el catálogo del MINEDUC. La matriz
 * no incluye una columna separada para 5-6 años, por lo que ese grado
 * reutiliza los saberes/indicadores de 4-5 años (última franja de Inicial).
 */

export interface IndicadorInicial {
  codigo: string;
  texto: string;
}

export interface SaberesInicial {
  declarativos: string[];
  procedimentales: string[];
  actitudinales: string[];
}

export interface RecursosInicial {
  materiales: string[];
  tecnicas: string[];
  instrumentos: string[];
}

export interface CompetenciaInicialCompleta {
  codigo: string;
  descripcion: string;
  competenciasClave: string[];
  indicadores34: IndicadorInicial[];
  indicadores45: IndicadorInicial[];
  indicadores56: IndicadorInicial[];
  saberes34: SaberesInicial;
  saberes45: SaberesInicial;
  saberes56: SaberesInicial;
  recursos: RecursosInicial;
}

function buildRecursos(codigo: string): RecursosInicial {
  const recursosMap: Record<string, RecursosInicial> = {
    "CE.CI.0.1": { materiales: ["Fotografías familiares", "Espejo grande", "Muñecos de diferentes tamaños", "Láminas de personas"], tecnicas: ["Observación guiada", "Juego de roles", "Dramatización"], instrumentos: ["Lista de cotejo", "Registro de observación", "Rúbrica de desempeño"] },
    "CE.CI.0.2": { materiales: ["Kit de higiene (cepillo, jabón)", "Ropa para practicar vestirse", "Platos y cubiertos de juguete", "Reloj de rutinas"], tecnicas: ["Modelamiento", "Práctica guiada", "Rutinas de aula"], instrumentos: ["Lista de cotejo", "Registro de observación", "Ficha de seguimiento"] },
    "CE.CI.0.3": { materiales: ["Semáforo de juguete", "Señales de tránsito impresas", "Láminas de situaciones de peligro", "Teléfono de emergencia de juguete"], tecnicas: ["Simulación de emergencias", "Juego de roles", "Observación deVideos"], instrumentos: ["Lista de cotejo", "Registro de observación", "Guía de interacción"] },
    "CE.CI.0.4": { materiales: ["Juegos de mesa grupales", "Pelotas de diferentes tamaños", "Cuentos sobre amistad", "Materiales para manualidades compartidos"], tecnicas: ["Juego cooperativo", "Dramatización", "Círculo de diálogo"], instrumentos: ["Lista de cotejo", "Registro de observación", "Rúbrica de interacción social"] },
    "CE.CI.0.5": { materiales: ["Láminas de profesiones", "Vestuario de profesiones", "Fotografías de instituciones", "Modelos de edificios"], tecnicas: ["Juego de roles", "Visitas guiadas (virtuales)", "Dramatización"], instrumentos: ["Lista de cotejo", "Registro de observación", "Ficha de reconocimiento"] },
    "CE.CI.0.6": { materiales: ["Semáforo de juguete", "Señales de tránsito", "Caminos peatonales de juguete", "Vehículos de juguete"], tecnicas: ["Simulación de cruces", "Juego de roles", "Paseos por la comunidad"], instrumentos: ["Lista de cotejo", "Registro de observación", "Guía de observación"] },
    "CE.CI.0.7": { materiales: ["Instrumentos musicales tradicionales", "Ropa tradicional", "Alimentos típicos", "Fotografías de festividades"], tecnicas: ["Danzas tradicionales", "Elaboración de comidas típicas", "Cuentos de tradiciones"], instrumentos: ["Lista de cotejo", "Registro fotográfico", "Ficha de participación"] },
    "CE.CI.0.8": { materiales: ["Bandera del país", "Escudo nacional", "Fotografías de la comunidad", "Plástilina para modelos"], tecnicas: ["Canto del himno", "Paseos comunitarios", "Elaboración de símbolos"], instrumentos: ["Lista de cotejo", "Registro de observación", "Ficha de reconocimiento"] },
    "CE.CI.0.9": { materiales: ["Tarjetas de emociones", "Espejo", "Cuentos sobre emociones", "Semáforo de emociones"], tecnicas: ["Dramatización de emociones", "Círculo de expresión", "Juego de roles"], instrumentos: ["Lista de cotejo", "Registro de observación", "Rúbrica de expresión emocional"] },
    "CE.CI.0.10": { materiales: ["Plantas pequeñas en macetas", "Animales de juguete o reales (pececillos)", "Lupas", "Recipientes con agua y tierra"], tecnicas: ["Observación directa", "Exploración sensorial", "Experimentos sencillos"], instrumentos: ["Lista de cotejo", "Registro de observación", "Ficha de exploración"] },
    "CE.CI.0.11": { materiales: ["Recipientes para reciclar", "Botellas de agua", "Papel periódico", "Macetas pequeñas"], tecnicas: ["Clasificación de residuos", "Riego de plantas", "Limpieza de espacios"], instrumentos: ["Lista de cotejo", "Registro de observación", "Ficha de participación"] },
    "CE.CI.0.12": { materiales: ["Bloques de colores", "Sonidos grabados", "Calendario sencillo", "Reloj de juguete"], tecnicas: ["Secuenciación de actividades", "Reconocimiento de patrones", "Juegos de orden"], instrumentos: ["Lista de cotejo", "Registro de observación", "Ficha de seguimiento"] },
    "CE.CI.0.13": { materiales: ["Cajas de diferentes tamaños", "Pelotas grandes y pequeñas", "Cintas métricas de juguete", "Objetos variados"], tecnicas: ["Comparación de tamaños", "Medición con objetos no estándar", "Juego de ubicación"], instrumentos: ["Lista de cotejo", "Registro de observación", "Ficha de exploración"] },
    "CE.CI.0.14": { materiales: ["Objetos de colores variados", "Fichas de conteo", "Monedas de juguete", "Bolsas para clasificar"], tecnicas: ["Clasificación por atributos", "Conteo con objetos", "Correspondencia uno a uno"], instrumentos: ["Lista de cotejo", "Registro de observación", "Ficha de registro"] },
    "CE.CI.0.15": { materiales: ["Cuentos ilustrados", "Imágenes de situaciones cotidianas", "Grabaciones de sonidos", "Marionetas"], tecnicas: ["Conversación guiada", "Canciones y rondas", "Expresión oral libre"], instrumentos: ["Lista de cotejo", "Registro de observación", "Rúbrica de expresión oral"] },
    "CE.CI.0.16": { materiales: ["Cuentos ilustrados", "Libros de imágenes", "Textos sencillos", "Fotografías"], tecnicas: ["Lectura compartida", "Conteo de historias", "Dialogo sobre textos"], instrumentos: ["Lista de cotejo", "Registro de observación", "Ficha de comprensión"] },
    "CE.CI.0.17": { materiales: ["Revistas viejas para recortar", "Láminas con signos", "Pictogramas de uso cotidiano", "Señales de la comunidad"], tecnicas: ["Identificación de signos", "Secuenciación de imágenes", "Interpretación de mensajes"], instrumentos: ["Lista de cotejo", "Registro de observación", "Ficha de reconocimiento"] },
    "CE.CI.0.18": { materiales: ["Crayones y marcadores", "Papel bond", "Tijeras de punta roma", "Pegamento"], tecnicas: ["Dibujo libre", "Escritura no convencional", "Producción gráfica"], instrumentos: ["Lista de cotejo", "Registro de observación", "Ficha de producción"] },
    "CE.CI.0.19": { materiales: ["Sonajeros", "Tambores pequeños", "Maracas", "Audio de rimas"], tecnicas: ["Juegos de rimas", "Exploración de sonidos", "Canciones con movimiento"], instrumentos: ["Lista de cotejo", "Registro de observación", "Ficha de participación"] },
    "CE.CI.0.20": { materiales: ["Crayones gruesos", "Papel grueso", "Pizarras individuales", "Tizas de colores"], tecnicas: ["Trazo libre", "Escritura con propia mano", "Comunicación oral del dibujo"], instrumentos: ["Lista de cotejo", "Registro de observación", "Ficha de producción"] },
    "CE.CI.0.21": { materiales: ["Vestuario de dramatización", "Instrumentos musicales simples", "Espacio para danza", "Audio de canciones infantiles"], tecnicas: ["Dramatización", "Canto grupal", "Juegos tradicionales"], instrumentos: ["Lista de cotejo", "Registro de observación", "Rúbrica de participación artística"] },
    "CE.CI.0.22": { materiales: ["Pinturas lavables", "Papeles de diferentes texturas", "Masas de colores", "Objetos para estampar"], tecnicas: ["Pintura libre", "Manipulación de masas", "Técnicas grafoplásticas"], instrumentos: ["Lista de cotejo", "Registro de observación", "Ficha de producción artística"] },
    "CE.CI.0.23": { materiales: ["Caja de sonidos", "Objetos que producen sonidos", "Grabaciones de sonidos naturales", "Instrumentos de percusión"], tecnicas: ["Reproducción de sonidos", "Juegos de imitación sonora", "Percusión con objetos"], instrumentos: ["Lista de cotejo", "Registro de observación", "Ficha de participación"] },
    "CE.CI.0.24": { materiales: ["Espejo grande", "Fichas de partes del cuerpo", "Muñecos anatómicos simples", "Pintura para huellas"], tecnicas: ["Identificación de partes del cuerpo", "Exploración corporal", "Esquema corporal"], instrumentos: ["Lista de cotejo", "Registro de observación", "Ficha de exploración"] },
    "CE.CI.0.25": { materiales: ["Conos para obstáculos", "Pelotas de diferentes tamaños", "Cuerdas para saltar", "Espacio amplio"], tecnicas: ["Desplazamientos", "Equilibrio dinámico", "Coordinación motriz"], instrumentos: ["Lista de cotejo", "Registro de observación", "Rúbrica de psicomotricidad"] },
    "CE.CI.0.26": { materiales: ["Espejo para observar movimientos", "Pelotas para lanzar", "Cintas de colores", "Música para coordinación"], tecnicas: ["Movimientos bilaterales", "Lateralidad guiada", "Simetría corporal"], instrumentos: ["Lista de cotejo", "Registro de observación", "Ficha de seguimiento"] },
    "CE.CI.0.27": { materiales: ["Conos y aros para ubicar", "Cartulinas con nociones espaciales", "Reloj de juguete", "Calendario sencillo"], tecnicas: ["Desplazamientos con nociones", "Juegos de orientación", "Secuencias temporales"], instrumentos: ["Lista de cotejo", "Registro de observación", "Ficha de seguimiento"] },
  };
  return recursosMap[codigo] || {
    materiales: ["Materiales variados del aula", "Recursos didácticos locales"],
    tecnicas: ["Observación guiada", "Práctica participativa", "Juego educativo"],
    instrumentos: ["Lista de cotejo", "Registro de observación", "Ficha de seguimiento"],
  };
}

export const COMPETENCIAS_INICIAL: CompetenciaInicialCompleta[] = [
  {
    codigo: "CE.CI.0.1",
    descripcion: "Reconocer las características físicas, emociones, gustos y pertenencia familiar en situaciones cotidianas para fortalecer su identidad personal.",
    competenciasClave: ["CC", "CSE", "CCICC", "CIT", "CECA"],
    indicadores34: [
    { codigo: "I.CI.0.1.1", texto: "Identifica algunas características físicas propias mediante la observación, el juego y la interacción con otras personas" },
    { codigo: "I.CI.0.1.2", texto: "Expresa sus datos personales: nombre, edad y reconoce a familiares cercanos en situaciones cotidianas" },
    { codigo: "I.CI.0.1.3", texto: "Representa a su familia en sus diálogos, juegos, dibujos o dramatizaciones y que forma parte de ella" },
    { codigo: "I.CI.0.1.4", texto: "Expresa emociones y gustos mediante gestos, palabras o diferentes formas de expresión en situaciones cotidianas. Participa con seguridad en actividades cotidianas, mostrando aceptación de sí mismo e iniciando relaciones respetuosas con otras personas" },
    ],
    indicadores45: [
    { codigo: "I.CI.0.1.1", texto: "Reconoce sus características físicas y las de las personas de su entorno" },
    { codigo: "I.CI.0.1.2", texto: "Expresa sus datos personales: nombres completos, edad, nombres de sus padres y lugar donde vive en situaciones cotidianas" },
    { codigo: "I.CI.0.1.3", texto: "Representa a su familia en sus diálogos, juegos, dibujos o dramatizaciones y que forma parte de ella" },
    { codigo: "I.CI.0.1.4", texto: "Expresa sus emociones, gustos y sentimientos de manera verbal y no verbal en situaciones cotidianas" },
    { codigo: "I.CI.0.1.5", texto: "Muestra aceptación de sí mismo y actitudes de respeto hacia los demás" },
    ],
    indicadores56: [
    { codigo: "I.CI.0.1.1", texto: "Reconoce sus características físicas y las de las personas de su entorno" },
    { codigo: "I.CI.0.1.2", texto: "Expresa sus datos personales: nombres completos, edad, nombres de sus padres y lugar donde vive en situaciones cotidianas" },
    { codigo: "I.CI.0.1.3", texto: "Representa a su familia en sus diálogos, juegos, dibujos o dramatizaciones y que forma parte de ella" },
    { codigo: "I.CI.0.1.4", texto: "Expresa sus emociones, gustos y sentimientos de manera verbal y no verbal en situaciones cotidianas" },
    { codigo: "I.CI.0.1.5", texto: "Muestra aceptación de sí mismo y actitudes de respeto hacia los demás" },
    ],
    saberes34: {
      declarativos: [
    "CI.0.1.d.1. Datos personales: Nombre, edad y nombre de un familiar cercano.",
    "CI.0.1.d.2. Características físicas: Partes principales del cuerpo.",
    "CI.0.1.d.3. Emociones básicas, sentimientos y gustos personales.",
    "CI.0.1.d.4. Miembros de su familia.",
      ],
      procedimentales: [
    "CI.0.1.p.1. Identificar algunas características físicas propias mediante el juego, la observación y la interacción.",
    "CI.0.1.p.2. Representar a su familia mediante dibujos, juegos, dramatizaciones o conversaciones sencillas.",
    "CI.0.1.p.3. Nombrar sus datos personales (nombre, edad, nombres de un familiar cercano).",
      ],
      actitudinales: [
    "CI.0.1.a.1. Expresar emociones, gustos y sentimientos utilizando del lenguaje verbal y no verbal. Mostrar seguridad y confianza al participar en actividades junto a su familia y grupo.",
    "CI.0.1.a.3. Iniciar relaciones respetuosas con otras personas durante el juego y las actividades cotidianas.",
      ],
    },
    saberes45: {
      declarativos: [
    "CI.0.1.d.1. Datos personales: Nombre, apellido, edad, nombres de un familiar cercano.",
    "CI.0.1.d.2. Características físicas: partes del cuerpo.",
    "CI.0.1.d.3. Emociones, gustos y sentimientos.",
    "CI.0.1.d.4. Miembros de la familia.",
      ],
      procedimentales: [
    "CI.0.1.p.1. Describir sus características físicas y de las personas de su entorno a través del juego o interacción.",
    "CI.0.1.p.2. Representar a su familia mediante dibujos, juegos, dramatizaciones o diálogos.",
    "CI.0.1.p.3. Nombrar sus datos personales (nombre, apellido, edad, nombres de un familiar cercano).",
      ],
      actitudinales: [
    "CI.0.1.a.1. Expresar emociones, gustos y sentimientos utilizando del lenguaje verbal y no verbal.",
    "CI.0.1.a.2. Reconocer que es un miembro importante de su familia.",
    "CI.0.1.a.3. Mostrar aceptación de sí mismo y respeto a las demás personas.",
      ],
    },
    saberes56: {
      declarativos: [
    "CI.0.1.d.1. Datos personales: Nombre, apellido, edad, nombres de un familiar cercano.",
    "CI.0.1.d.2. Características físicas: partes del cuerpo.",
    "CI.0.1.d.3. Emociones, gustos y sentimientos.",
    "CI.0.1.d.4. Miembros de la familia.",
      ],
      procedimentales: [
    "CI.0.1.p.1. Describir sus características físicas y de las personas de su entorno a través del juego o interacción.",
    "CI.0.1.p.2. Representar a su familia mediante dibujos, juegos, dramatizaciones o diálogos.",
    "CI.0.1.p.3. Nombrar sus datos personales (nombre, apellido, edad, nombres de un familiar cercano).",
      ],
      actitudinales: [
    "CI.0.1.a.1. Expresar emociones, gustos y sentimientos utilizando del lenguaje verbal y no verbal.",
    "CI.0.1.a.2. Reconocer que es un miembro importante de su familia.",
    "CI.0.1.a.3. Mostrar aceptación de sí mismo y respeto a las demás personas.",
      ],
    },
    recursos: buildRecursos("CE.CI.0.1"),
  },
  {
    codigo: "CE.CI.0.2",
    descripcion: "Desarrollar progresivamente la autonomía mediante la práctica de hábitos cotidianos para fortalecer la autoestima la y confianza en sí mismo.",
    competenciasClave: ["CC", "CMCT", "CIT", "CCICC", "CSE", "CECA"],
    indicadores34: [
    { codigo: "I.CI.0.2.6", texto: "Participa en rutinas de higiene, alimentación y orden con acompañamiento del adulto" },
    { codigo: "I.CI.0.2.7", texto: "Elige entre dos opciones sencillas relacionadas con la alimentación, los juegos o la vestimenta cuando se le brinda apoyo" },
    { codigo: "I.CI.0.2.8", texto: "Realiza acciones de cuidado personal como vestirse, desvestirse e ir al baño con apoyo progresivo de un adulto" },
    ],
    indicadores45: [
    { codigo: "I.CI.0.2.6", texto: "Practica hábitos de higiene, alimentación y orden con progresiva autonomía" },
    { codigo: "I.CI.0.2.7", texto: "Selecciona entre opciones en actividades cotidianas (alimentación, juegos, vestimenta) según sus preferencias" },
    { codigo: "I.CI.0.2.8", texto: "Realiza acciones de cuidado personal como vestirse, desvestirse e ir al baño con apoyo progresivo de un adulto" },
    ],
    indicadores56: [
    { codigo: "I.CI.0.2.6", texto: "Practica hábitos de higiene, alimentación y orden con progresiva autonomía" },
    { codigo: "I.CI.0.2.7", texto: "Selecciona entre opciones en actividades cotidianas (alimentación, juegos, vestimenta) según sus preferencias" },
    { codigo: "I.CI.0.2.8", texto: "Realiza acciones de cuidado personal como vestirse, desvestirse e ir al baño con apoyo progresivo de un adulto" },
    ],
    saberes34: {
      declarativos: [
    "CI.0.1.d.5. Hábitos de higiene personal.",
    "CI.0.1.d.6. Hábitos de alimentación y uso de utensilios.",
    "CI.0.1.d.7. Hábitos de orden en el entorno.",
    "CI.0.1.d.8. Hábitos de sueño y descanso.",
    "CI.0.1.d.9. Elementos de la vida cotidiana (alimentación, juegos, vestimenta).",
      ],
      procedimentales: [
    "CI.0.1.p.4. Utilizar utensilios básicos al alimentarse con apoyo progresivo hacia la autonomía.",
    "CI.0.1.p.5. Identificar elementos de la vida cotidiana (alimentación, juegos, vestimenta).",
    "CI.0.1.p.6. Practicar rutina de descanso y sueño.",
    "CI.0.1.p.7. Realizar rutinas básicas de higiene personal (lavado de manos, cara y dientes).",
    "CI.0.1.p.8. Organizar objetos en su lugar.",
      ],
      actitudinales: [
    "CI.0.1.a.4. Participar con disposición en hábitos cotidianos de cuidado personal.",
    "CI.0.1.a.5. Mostrar interés por realizar algunas acciones cotidianas con apoyo del adulto.",
    "CI.0.1.a.6. Colaborar en el cuidado y orden de sus objetos y espacios.",
      ],
    },
    saberes45: {
      declarativos: [
    "CI.0.1.d.5. Hábitos de higiene personal.",
    "CI.0.1.d.6. Hábitos de alimentación y uso de utensilios.",
    "CI.0.1.d.7. Hábitos de orden en el entorno.",
    "CI.0.1.d.8. Hábitos de sueño y descanso.",
    "CI.0.1.d.9. Elementos de la vida cotidiana (alimentación, juegos, vestimenta).",
      ],
      procedimentales: [
    "CI.0.1.p.4. Utilizar utensilios básicos al alimentarse con apoyo progresivo hacia la autonomía.",
    "CI.0.1.p.5. Identificar elementos de la vida cotidiana (alimentación, juegos, vestimenta).",
    "CI.0.1.p.6. Practicar rutina de descanso y sueño.",
    "CI.0.1.p.7. Realizar rutinas básicas de higiene personal (lavado de manos, cara y dientes).",
    "CI.0.1.p.8. Organizar objetos en su lugar.",
      ],
      actitudinales: [
    "CI.0.1.a.4. Mostrar autonomía progresiva en hábitos cotidianos.",
    "CI.0.1.a.5. Mostrar interés por realizar acciones cotidianas de forma autónoma.",
    "CI.0.1.a.6. Participar en el orden de sus objetos y espacios.",
      ],
    },
    saberes56: {
      declarativos: [
    "CI.0.1.d.5. Hábitos de higiene personal.",
    "CI.0.1.d.6. Hábitos de alimentación y uso de utensilios.",
    "CI.0.1.d.7. Hábitos de orden en el entorno.",
    "CI.0.1.d.8. Hábitos de sueño y descanso.",
    "CI.0.1.d.9. Elementos de la vida cotidiana (alimentación, juegos, vestimenta).",
      ],
      procedimentales: [
    "CI.0.1.p.4. Utilizar utensilios básicos al alimentarse con apoyo progresivo hacia la autonomía.",
    "CI.0.1.p.5. Identificar elementos de la vida cotidiana (alimentación, juegos, vestimenta).",
    "CI.0.1.p.6. Practicar rutina de descanso y sueño.",
    "CI.0.1.p.7. Realizar rutinas básicas de higiene personal (lavado de manos, cara y dientes).",
    "CI.0.1.p.8. Organizar objetos en su lugar.",
      ],
      actitudinales: [
    "CI.0.1.a.4. Mostrar autonomía progresiva en hábitos cotidianos.",
    "CI.0.1.a.5. Mostrar interés por realizar acciones cotidianas de forma autónoma.",
    "CI.0.1.a.6. Participar en el orden de sus objetos y espacios.",
      ],
    },
    recursos: buildRecursos("CE.CI.0.2"),
  },
  {
    codigo: "CE.CI.0.3",
    descripcion: "Aplicar normas básicas de seguridad en el hogar, en la escuela y en la calle, en situaciones cotidianas, para evitar accidentes y fortalecer la autonomía y autocuidado de manera progresiva.",
    competenciasClave: ["CCICC", "CIT", "CC", "CSE"],
    indicadores34: [
    { codigo: "I.CI.0.3.9", texto: "Reconoce algunas situaciones que pueden representar peligro en el hogar y la escuela con apoyo del adulto" },
    { codigo: "I.CI.0.3.10", texto: "Sigue instrucciones sencillas relacionadas con su seguridad durante las actividades cotidianas y el juego" },
    { codigo: "I.CI.0.3.11", texto: "Participa en acciones básicas de autocuidado al responder a las orientaciones del adulto en situaciones cotidianas" },
    { codigo: "I.CI.0.3.12", texto: "Reconoce a las personas adultas a quienes puede acudir cuando necesita ayuda en el hogar o la escuela" },
    ],
    indicadores45: [
    { codigo: "I.CI.0.3.9", texto: "Reconoce situaciones de peligro en el entorno cercano: hogar, escuela y calle" },
    { codigo: "I.CI.0.3.10", texto: "Aplica normas básicas de seguridad en actividades cotidianas del hogar, la escuela y el transporte" },
    { codigo: "I.CI.0.3.11", texto: "Demuestra actitudes de autocuidado de manera progresiva al seguir instrucciones en situaciones de peligro" },
    { codigo: "I.CI.0.3.12", texto: "Identifica situaciones que requieren pedir ayuda y los números de emergencia en contextos cotidianos" },
    ],
    indicadores56: [
    { codigo: "I.CI.0.3.9", texto: "Reconoce situaciones de peligro en el entorno cercano: hogar, escuela y calle" },
    { codigo: "I.CI.0.3.10", texto: "Aplica normas básicas de seguridad en actividades cotidianas del hogar, la escuela y el transporte" },
    { codigo: "I.CI.0.3.11", texto: "Demuestra actitudes de autocuidado de manera progresiva al seguir instrucciones en situaciones de peligro" },
    { codigo: "I.CI.0.3.12", texto: "Identifica situaciones que requieren pedir ayuda y los números de emergencia en contextos cotidianos" },
    ],
    saberes34: {
      declarativos: [
    "CI.0.1.d.10. Situaciones de peligro presentes en el hogar y la escuela.",
    "CI.0.1.d.11. Normas básicas de seguridad en el entorno cotidiano. Personas adultas que brindan ayuda en situaciones de riesgo.",
      ],
      procedimentales: [
    "CI.0.1.p.9. Reconocer situaciones de peligro en el hogar y la escuela mediante el juego, imágenes y conversaciones.",
    "CI.0.1.p.10. Seguir normas sencillas de seguridad durante las actividades cotidianas y el juego con acompañamiento del adulto.",
    "CI.0.1.p.11. Participar en juegos y dramatizaciones donde practique acciones básicas de seguridad al desplazarse o utilizar medios de transporte.",
      ],
      actitudinales: [
    "CI.0.1.a.7. Mostrar disposición para seguir indicaciones que favorezcan su seguridad y bienestar.",
    "CI.0.1.a.8. Participar en acciones sencillas de autocuidado durante las actividades cotidianas.",
      ],
    },
    saberes45: {
      declarativos: [
    "CI.0.1.d.10. Situaciones de peligro en el hogar, en la escuela y en su entorno.",
    "CI.0.1.d.11. Normas básicas de seguridad en el entorno cotidiano.",
    "CI.0.1.d.12. Número de emergencia.",
      ],
      procedimentales: [
    "CI.0.1.p.9. Identificar situaciones de peligro en su entorno inmediato y números de emergencia.",
    "CI.0.1.p.10. Practicar normas básicas de seguridad en el hogar y escuela y en su entorno.",
    "CI.0.1.p.11. Practicar normas básicas de seguridad al utilizar medios de transporte en situaciones de juego.",
      ],
      actitudinales: [
    "CI.0.1.a.7. Actuar con atención y cuidado en situaciones de peligro.",
    "CI.0.1.a.8. Mostrar hábitos de autocuidado y seguridad en actividades cotidianas.",
      ],
    },
    saberes56: {
      declarativos: [
    "CI.0.1.d.10. Situaciones de peligro en el hogar, en la escuela y en su entorno.",
    "CI.0.1.d.11. Normas básicas de seguridad en el entorno cotidiano.",
    "CI.0.1.d.12. Número de emergencia.",
      ],
      procedimentales: [
    "CI.0.1.p.9. Identificar situaciones de peligro en su entorno inmediato y números de emergencia.",
    "CI.0.1.p.10. Practicar normas básicas de seguridad en el hogar y escuela y en su entorno.",
    "CI.0.1.p.11. Practicar normas básicas de seguridad al utilizar medios de transporte en situaciones de juego.",
      ],
      actitudinales: [
    "CI.0.1.a.7. Actuar con atención y cuidado en situaciones de peligro.",
    "CI.0.1.a.8. Mostrar hábitos de autocuidado y seguridad en actividades cotidianas.",
      ],
    },
    recursos: buildRecursos("CE.CI.0.3"),
  },
  {
    codigo: "CE.CI.0.4",
    descripcion: "Interactuar con otros, mostrando actitudes de solidaridad, el respeto y la empatía ante las diferencias individuales, para favorecer la convivencia armónica en su entorno.",
    competenciasClave: ["CSE", "CC", "CIT", "CCICC"],
    indicadores34: [
    { codigo: "I.CI.0.4.13", texto: "Reconoce normas básicas de convivencia en distintos espacios" },
    { codigo: "I.CI.0.4.14", texto: "Participa en juegos y actividades grupales respetando reglas y acuerdos. Reconoce que las personas son diferentes y participa respetuosamente en actividades con sus compañeros" },
    { codigo: "I.CI.0.4.16", texto: "Expresa acciones de cortesía y colaboración durante la interacción con otras personas" },
    ],
    indicadores45: [
    { codigo: "I.CI.0.4.13", texto: "Reconoce normas básicas de convivencia en distintos espacios" },
    { codigo: "I.CI.0.4.14", texto: "Participa en juegos y actividades grupales respetando reglas y acuerdos" },
    { codigo: "I.CI.0.4.15", texto: "Respeta diferencias individuales entre sus compañeros en actividades cotidianas" },
    { codigo: "I.CI.0.4.16", texto: "Demuestra cortesía, solidaridad y comunicación asertiva al interactuar con sus pares y adultos de su entorno" },
    ],
    indicadores56: [
    { codigo: "I.CI.0.4.13", texto: "Reconoce normas básicas de convivencia en distintos espacios" },
    { codigo: "I.CI.0.4.14", texto: "Participa en juegos y actividades grupales respetando reglas y acuerdos" },
    { codigo: "I.CI.0.4.15", texto: "Respeta diferencias individuales entre sus compañeros en actividades cotidianas" },
    { codigo: "I.CI.0.4.16", texto: "Demuestra cortesía, solidaridad y comunicación asertiva al interactuar con sus pares y adultos de su entorno" },
    ],
    saberes34: {
      declarativos: [
    "CI.0.1.d.13. Reglas y normas básicos de convivencia. Personas con características y gustos diferentes.",
    "CI.0.1.d.15. Respeto, empatía, solidaridad y colaboración.",
      ],
      procedimentales: [
    "CI.0.1.p.12. Participar en rutinas de convivencia utilizando expresiones de cortesía con acompañamiento del adulto (saludar, despedirse, pedir por favor y dar las gracias).",
    "CI.0.1.p.13. Participar en juegos y actividades sencillas compartiendo materiales y colaborando con otras personas.",
    "CI.0.1.p.14. Expresar sus necesidades y buscar acuerdos sencillos durante el juego con apoyo del adulto.",
      ],
      actitudinales: [
    "CI.0.1.a.9. Aceptar que cada persona tiene características propias durante las actividades compartidas.",
    "CI.0.1.a.10. Participar en actividades grupales. Mostrar disposición para ayudar y compartir con otras personas en situaciones cotidianas.",
    "CI.0.1.a.12. Mostrar interés por reconocer las emociones y necesidades de otras personas con acompañamiento del adulto.",
      ],
    },
    saberes45: {
      declarativos: [
    "CI.0.1.d.13. Reglas y normas básicos de convivencia.",
    "CI.0.1.d.14. Características y diferencias entre las personas y familias.",
    "CI.0.1.d.15. Respeto, empatía, solidaridad y colaboración.",
      ],
      procedimentales: [
    "CI.0.1.p.12. Practicar normas básicas de convivencia en situaciones cotidianas (saludo y despedida, por favor, gracias, etc.).",
    "CI.0.1.p.13. Participar en actividades de colaboración con los demás.",
    "CI.0.1.p.14. Expresar sus necesidades y buscar acuerdos sencillos durante el juego con apoyo del adulto.",
      ],
      actitudinales: [
    "CI.0.1.a.09. Respetar las diferencias individuales.",
    "CI.0.1.a.10. Participar en actividades grupales.",
    "CI.0.1.a.11. Demostrar actitudes de colaboración y solidaridad con niños/niñas y adultos de su entorno.",
    "CI.0.1.a.12. Demostrar sensibilidad ante deseos, emociones y sentimientos de otras personas.",
      ],
    },
    saberes56: {
      declarativos: [
    "CI.0.1.d.13. Reglas y normas básicos de convivencia.",
    "CI.0.1.d.14. Características y diferencias entre las personas y familias.",
    "CI.0.1.d.15. Respeto, empatía, solidaridad y colaboración.",
      ],
      procedimentales: [
    "CI.0.1.p.12. Practicar normas básicas de convivencia en situaciones cotidianas (saludo y despedida, por favor, gracias, etc.).",
    "CI.0.1.p.13. Participar en actividades de colaboración con los demás.",
    "CI.0.1.p.14. Expresar sus necesidades y buscar acuerdos sencillos durante el juego con apoyo del adulto.",
      ],
      actitudinales: [
    "CI.0.1.a.09. Respetar las diferencias individuales.",
    "CI.0.1.a.10. Participar en actividades grupales.",
    "CI.0.1.a.11. Demostrar actitudes de colaboración y solidaridad con niños/niñas y adultos de su entorno.",
    "CI.0.1.a.12. Demostrar sensibilidad ante deseos, emociones y sentimientos de otras personas.",
      ],
    },
    recursos: buildRecursos("CE.CI.0.4"),
  },
  {
    codigo: "CE.CI.0.5",
    descripcion: "Valorar los roles y actividades que realizan las personas del entorno familiar, escolar y comunitario, así como los servicios que brindan algunas instituciones, con respeto, para conocer su importancia en la vida cotidiana.",
    competenciasClave: ["CC", "CCICC", "CD", "CIT", "CSE"],
    indicadores34: [
    { codigo: "I.CI.0.5.17", texto: "Reconoce profesiones y oficios de las personas de su entorno familiar" },
    { codigo: "I.CI.0.5.18", texto: "Identifica algunas instituciones de la comunidad y los servicios que brindan. Expresa respeto por las actividades que realizan las personas de su familia, escuela y comunidad durante el juego y las actividades cotidianas" },
    ],
    indicadores45: [
    { codigo: "I.CI.0.5.17", texto: "Reconoce profesiones y oficios de las personas de su entorno familiar" },
    { codigo: "I.CI.0.5.18", texto: "Identifica algunas instituciones de la comunidad y los servicios que brindan" },
    { codigo: "I.CI.0.5.19", texto: "Reconoce la importancia del trabajo de las personas en su familia y comunidad" },
    ],
    indicadores56: [
    { codigo: "I.CI.0.5.17", texto: "Reconoce profesiones y oficios de las personas de su entorno familiar" },
    { codigo: "I.CI.0.5.18", texto: "Identifica algunas instituciones de la comunidad y los servicios que brindan" },
    { codigo: "I.CI.0.5.19", texto: "Reconoce la importancia del trabajo de las personas en su familia y comunidad" },
    ],
    saberes34: {
      declarativos: [
    "CI.0.1.d.16. Profesiones y oficios de las personas de su entorno. Instituciones y servicios básicos de la comunidad (escuela, centro de salud, y espacios próximos).",
      ],
      procedimentales: [
    "CI.0.1.p.15. Reconocer algunos lugares de la comunidad y las personas que trabajan en ellos mediante la observación, el juego y la exploración de imágenes.",
    "CI.0.1.p.16. Reconocer las actividades que realizan las personas de su entorno inmediato en la vida cotidiana.",
    "CI.0.1.p.17. Relacionar las profesiones y oficios con actividades de la vida cotidiana.",
      ],
      actitudinales: [
    "CI.0.1.a.13. Mostrar interés por el trabajo de las personas de su entorno.",
      ],
    },
    saberes45: {
      declarativos: [
    "CI.0.1.d.16. Profesiones y oficios de las personas de su entorno.",
    "CI.0.1.d.17. Instituciones y servicios básicos de la comunidad (salud, seguridad, educación y de emergencia).",
      ],
      procedimentales: [
    "CI.0.1.p.15. Identificar los servicios que brindan algunas instituciones de la comunidad mediante la observación, el juego de roles y la exploración de imágenes y recursos audiovisuales.",
    "CI.0.1.p.16. Identificar funciones de las personas de su entorno inmediato.",
    "CI.0.1.p.17. Relacionar las profesiones y oficios con actividades de la vida cotidiana.",
      ],
      actitudinales: [
    "CI.0.1.a.13. Valorar el trabajo de las personas de su entorno.",
      ],
    },
    saberes56: {
      declarativos: [
    "CI.0.1.d.16. Profesiones y oficios de las personas de su entorno.",
    "CI.0.1.d.17. Instituciones y servicios básicos de la comunidad (salud, seguridad, educación y de emergencia).",
      ],
      procedimentales: [
    "CI.0.1.p.15. Identificar los servicios que brindan algunas instituciones de la comunidad mediante la observación, el juego de roles y la exploración de imágenes y recursos audiovisuales.",
    "CI.0.1.p.16. Identificar funciones de las personas de su entorno inmediato.",
    "CI.0.1.p.17. Relacionar las profesiones y oficios con actividades de la vida cotidiana.",
      ],
      actitudinales: [
    "CI.0.1.a.13. Valorar el trabajo de las personas de su entorno.",
      ],
    },
    recursos: buildRecursos("CE.CI.0.5"),
  },
  {
    codigo: "CE.CI.0.6",
    descripcion: "Aplicar de normas básicas de convivencia y seguridad vial, para relacionarse de manera respetuosa y segura en los diferentes espacios de su entorno.",
    competenciasClave: ["CC", "CCICC", "CIT", "CSE"],
    indicadores34: [
    { codigo: "I.CI.0.6.20", texto: "Participa en actividades cotidianas siguiendo normas sencillas de convivencia con acompañamiento del adulto" },
    { codigo: "I.CI.0.6.21", texto: "Reconoce algunas señales de tránsito básicas como el pare, el semáforo y el paso peatonal en actividades lúdicas o situaciones cotidianas" },
    ],
    indicadores45: [
    { codigo: "I.CI.0.6.20", texto: "Aplica normas básicas de convivencia en la familia, el aula y comunidad en actividades lúdicas o cotidianas" },
    { codigo: "I.CI.0.6.21", texto: "Reconoce señales de tránsito básicas en actividades lúdicas o situaciones cotidianas" },
    ],
    indicadores56: [
    { codigo: "I.CI.0.6.20", texto: "Aplica normas básicas de convivencia en la familia, el aula y comunidad en actividades lúdicas o cotidianas" },
    { codigo: "I.CI.0.6.21", texto: "Reconoce señales de tránsito básicas en actividades lúdicas o situaciones cotidianas" },
    ],
    saberes34: {
      declarativos: [
    "CI.0.1.d.18. Señales básicas de tránsito: (pare, semáforo y paso peatonal).",
    "CI.0.1.d.19. Normas de convivencia en el hogar, en el aula y en la comunidad. Actores viales: peatones, conductores y agentes de tránsito.",
      ],
      procedimentales: [
    "CI.0.1.p.18. Reconocer actores viales: peatones, conductores y agentes de tránsito en situaciones simuladas o reales.",
    "CI.0.1.p.19. Participar en juegos donde siga algunas señales básicas para desplazarse de forma segura.",
      ],
      actitudinales: [
    "CI.0.1.a.14. Mostrar disposición para respetar normas sencillas durante el juego y las actividades compartidas.",
    "CI.0.1.a.15. Mostrar cuidado al desplazarse con acompañamiento en diferentes espacios de la escuela y su entorno cercano.",
      ],
    },
    saberes45: {
      declarativos: [
    "CI.0.1.d.18. Señales básicas de tránsito: (pare, semáforo y señalética, paso peatonal).",
    "CI.0.1.d.19. Normas de convivencia en el hogar, en el aula y en la comunidad.",
    "CI.0.1.d.20. Actores viales: peatones, conductores, motociclistas, ciclistas, pasajeros y agentes de tránsito.",
      ],
      procedimentales: [
    "CI.0.1.p.18. Reconocer actores viales: peatones, conductores, motociclistas, ciclistas y agentes de tránsito, en situaciones simuladas o reales.",
    "CI.0.1.p.19. Practicar señales básicas de tránsito en situaciones simuladas o reales.",
      ],
      actitudinales: [
    "CI.0.1.a.14. Mostrar respeto al interactuar con otros en diferentes espacios.",
    "CI.0.1.a.15. Mostrar cuidado al desplazarse en espacios comunes.",
      ],
    },
    saberes56: {
      declarativos: [
    "CI.0.1.d.18. Señales básicas de tránsito: (pare, semáforo y señalética, paso peatonal).",
    "CI.0.1.d.19. Normas de convivencia en el hogar, en el aula y en la comunidad.",
    "CI.0.1.d.20. Actores viales: peatones, conductores, motociclistas, ciclistas, pasajeros y agentes de tránsito.",
      ],
      procedimentales: [
    "CI.0.1.p.18. Reconocer actores viales: peatones, conductores, motociclistas, ciclistas y agentes de tránsito, en situaciones simuladas o reales.",
    "CI.0.1.p.19. Practicar señales básicas de tránsito en situaciones simuladas o reales.",
      ],
      actitudinales: [
    "CI.0.1.a.14. Mostrar respeto al interactuar con otros en diferentes espacios.",
    "CI.0.1.a.15. Mostrar cuidado al desplazarse en espacios comunes.",
      ],
    },
    recursos: buildRecursos("CE.CI.0.6"),
  },
  {
    codigo: "CE.CI.0.7",
    descripcion: "Participar en manifestaciones culturales de su contexto, a través del descubrimiento, la participación y disfrute de las prácticas tradicionales, para fortalecer su identidad y sentido de pertenencia a su familia y comunidad.",
    competenciasClave: ["CSE", "CECA", "CIT", "CCICC", "CC"],
    indicadores34: [
    { codigo: "I.CI.0.7.22", texto: "Reconoce tradiciones y prácticas socioculturales presentes en su familia y en la escuela" },
    { codigo: "I.CI.0.7.23", texto: "Participa en actividades tradicionales de su entorno" },
    ],
    indicadores45: [
    { codigo: "I.CI.0.7.22", texto: "Reconoce tradiciones y prácticas socioculturales de su localidad" },
    { codigo: "I.CI.0.7.23", texto: "Participa en actividades tradicionales de su entorno" },
    ],
    indicadores56: [
    { codigo: "I.CI.0.7.22", texto: "Reconoce tradiciones y prácticas socioculturales de su localidad" },
    { codigo: "I.CI.0.7.23", texto: "Participa en actividades tradicionales de su entorno" },
    ],
    saberes34: {
      declarativos: [
    "CI.0.1.d.21. Manifestaciones culturales de su localidad.",
    "CI.0.1.d.22. Tradiciones culturales.",
      ],
      procedimentales: [
    "CI.0.1.p.20. Participar en manifestaciones culturales y prácticas tradicionales de su familia y comunidad mediante juegos, celebraciones, relatos, música y expresiones artísticas.",
      ],
      actitudinales: [
    "CI.0.1.a.16. Mostrar interés y disfrute al participar en actividades, juegos y celebraciones propias de su familia y escuela.",
      ],
    },
    saberes45: {
      declarativos: [
    "CI.0.1.d.21. Manifestaciones culturales de su localidad.",
    "CI.0.1.d.22. Tradiciones familiares.",
      ],
      procedimentales: [
    "CI.0.1.p.20. Participar en manifestaciones culturales y prácticas tradicionales de su familia y comunidad mediante juegos, celebraciones, relatos, música y expresiones artísticas.",
      ],
      actitudinales: [
    "CI.0.1.a.16. Disfrutar actividades culturales de su entorno.",
      ],
    },
    saberes56: {
      declarativos: [
    "CI.0.1.d.21. Manifestaciones culturales de su localidad.",
    "CI.0.1.d.22. Tradiciones familiares.",
      ],
      procedimentales: [
    "CI.0.1.p.20. Participar en manifestaciones culturales y prácticas tradicionales de su familia y comunidad mediante juegos, celebraciones, relatos, música y expresiones artísticas.",
      ],
      actitudinales: [
    "CI.0.1.a.16. Disfrutar actividades culturales de su entorno.",
      ],
    },
    recursos: buildRecursos("CE.CI.0.7"),
  },
  {
    codigo: "CE.CI.0.8",
    descripcion: "Demostrar sentido de pertenencia hacia la comunidad y país mediante el reconocimiento de símbolos representativos y la participación en acciones de cuidado del entorno.",
    competenciasClave: ["CIT", "CECA", "CCICC", "CMCT", "CC"],
    indicadores34: [
    { codigo: "I.CI.0.8.1", texto: "Reconoce algunos elementos representativos de su escuela, comunidad o país en actividades cotidianas" },
    { codigo: "I.CI.0.8.2", texto: "Participa en acciones sencillas para cuidar los espacios, materiales y elementos de su entorno con acompañamiento del adulto" },
    ],
    indicadores45: [
    { codigo: "I.CI.0.8.24", texto: "Reconoce símbolos nacionales y elementos representativos de su comunidad y país en actividades cotidianas" },
    { codigo: "I.CI.0.8.25", texto: "Participa en actividades del cuidado del entorno mostrando respeto hacia los demás" },
    ],
    indicadores56: [
    { codigo: "I.CI.0.8.24", texto: "Reconoce símbolos nacionales y elementos representativos de su comunidad y país en actividades cotidianas" },
    { codigo: "I.CI.0.8.25", texto: "Participa en actividades del cuidado del entorno mostrando respeto hacia los demás" },
    ],
    saberes34: {
      declarativos: [
    "CI.0.1.d.23. Elementos representativos de la escuela, la comunidad y algunos símbolos del país.",
    "CI.0.1.d.24. Acciones de cuidado y de conservación del entorno.",
      ],
      procedimentales: [
    "CI.0.1.p.21. Reconocer algunos elementos representativos de la escuela, la comunidad y del país en diferentes situaciones cotidianas.",
    "CI.0.1.p.22. Participar en actividades sencillas de cuidado del entorno escolar y comunitario.",
      ],
      actitudinales: [
    "CI.0.1.a.17. Participar con disposición en actividades compartidas para cuidar el entorno y colaborar con otras personas.",
    "CI.0.1.a.18. Mostrar respeto por los espacios, materiales y las personas durante las actividades cotidianas.",
      ],
    },
    saberes45: {
      declarativos: [
    "CI.0.1.d.23. Símbolos representativos de su comunidad y país.",
    "CI.0.1.d.24. Acciones de cuidado y de conservación del entorno.",
      ],
      procedimentales: [
    "CI.0.1.p.21. Reconocer símbolos representativos de la comunidad y del país en diferentes situaciones cotidianas.",
    "CI.0.1.p.22. Participar en actividades sencillas de cuidado del entorno escolar y comunitario.",
      ],
      actitudinales: [
    "CI.0.1.a.17. Valorar la cooperación, la participación y el respeto.",
    "CI.0.1.a.18. Mostrar respeto hacia las demás personas.",
      ],
    },
    saberes56: {
      declarativos: [
    "CI.0.1.d.23. Símbolos representativos de su comunidad y país.",
    "CI.0.1.d.24. Acciones de cuidado y de conservación del entorno.",
      ],
      procedimentales: [
    "CI.0.1.p.21. Reconocer símbolos representativos de la comunidad y del país en diferentes situaciones cotidianas.",
    "CI.0.1.p.22. Participar en actividades sencillas de cuidado del entorno escolar y comunitario.",
      ],
      actitudinales: [
    "CI.0.1.a.17. Valorar la cooperación, la participación y el respeto.",
    "CI.0.1.a.18. Mostrar respeto hacia las demás personas.",
      ],
    },
    recursos: buildRecursos("CE.CI.0.8"),
  },
  {
    codigo: "CE.CI.0.9",
    descripcion: "Expresar emociones básicas en situaciones cotidianas mediante interacciones respetuosas y la regulación progresiva de sus emociones con acompañamiento de un adulto, para favorecer el bienestar y la convivencia en el entorno familiar y escolar.",
    competenciasClave: ["CC", "CCICC", "CIT", "CSE"],
    indicadores34: [
    { codigo: "I.CI.0.9.26", texto: "Relaciona las emociones básicas de alegría, tristeza, ira y miedo con eventos cotidianos" },
    { codigo: "I.CI.0.9.27", texto: "Expresa emociones (alegría, tristeza, ira y miedo) en diferentes contextos Participa en actividades cotidianas siguiendo normas sencillas de convivencia con apoyo del adulto" },
    { codigo: "I.CI.0.9.29", texto: "Participa en acciones sencillas para tranquilizarse o buscar ayuda cuando experimenta emociones intensas con acompañamiento del adulto" },
    ],
    indicadores45: [
    { codigo: "I.CI.0.9.26", texto: "Relaciona las emociones básicas de alegría, tristeza, ira y miedo con eventos cotidianos" },
    { codigo: "I.CI.0.9.27", texto: "Expresa emociones (alegría, tristeza, ira y miedo) en diferentes contextos" },
    { codigo: "I.CI.0.9.28", texto: "Respeta normas básicas de convivencia en actividades cotidianas" },
    { codigo: "I.CI.0.9.29", texto: "Aplica acciones sencillas para regular progresivamente sus emociones con acompañamiento del adulto" },
    ],
    indicadores56: [
    { codigo: "I.CI.0.9.26", texto: "Relaciona las emociones básicas de alegría, tristeza, ira y miedo con eventos cotidianos" },
    { codigo: "I.CI.0.9.27", texto: "Expresa emociones (alegría, tristeza, ira y miedo) en diferentes contextos" },
    { codigo: "I.CI.0.9.28", texto: "Respeta normas básicas de convivencia en actividades cotidianas" },
    { codigo: "I.CI.0.9.29", texto: "Aplica acciones sencillas para regular progresivamente sus emociones con acompañamiento del adulto" },
    ],
    saberes34: {
      declarativos: [
    "CI.0.1.d.25. Emociones básicas: alegría, tristeza, ira y miedo.",
    "CI.0.1.d.26. Normas básicas de convivencia, del entorno familiar y escolar.",
    "CI.0.1.d.27. Acciones básicas para la regulación progresiva de emociones.",
    "CI.0.1.d.28. Formas de interacción respetuosa con los demás.",
      ],
      procedimentales: [
    "CI.0.1.p.23. Expresar emociones básicas de manera respetuosa en situaciones del entorno familiar y escolar.",
    "CI.0.1.p.24. Relacionar emociones básicas con situaciones cotidianas. Participar en acciones sencillas para tranquilizarse, respirar o buscar ayuda cuando experimenta emociones intensas con apoyo del adulto.",
      ],
      actitudinales: [
    "CI.0.1.a.19. Mostrar respeto por sí mismo y por los demás durante las actividades cotidianas.",
    "CI.0.1.a.20. Mostrar disposición para expresar emociones de manera respetuosa Mostrar disposición para participar en estrategias sencillas que favorezcan la regulación de sus emociones con apoyo del adulto.",
      ],
    },
    saberes45: {
      declarativos: [
    "CI.0.1.d.25. Emociones básicas: alegría, tristeza, ira y miedo.",
    "CI.0.1.d.26. Normas básicas de convivencia, del entorno familiar y escolar.",
    "CI.0.1.d.27. Acciones básicas para la regulación progresiva de emociones.",
    "CI.0.1.d.28. Formas de interacción respetuosa con los demás.",
      ],
      procedimentales: [
    "CI.0.1.p.23. Expresar emociones básicas de manera respetuosa en situaciones del entorno familiar y escolar.",
    "CI.0.1.p.24. Relacionar emociones básicas con situaciones cotidianas.",
    "CI.0.1.p.25. Practicar acciones sencillas para regular progresivamente sus emociones con ayuda del adulto.",
      ],
      actitudinales: [
    "CI.0.1.a.19. Respetar a sí mismo y a los demás.",
    "CI.0.1.a.20. Mostrar disposición para expresar emociones de manera respetuosa.",
    "CI.0.1.a.21. Mostrar disposición para regular progresivamente sus emociones con acompañamiento del adulto.",
      ],
    },
    saberes56: {
      declarativos: [
    "CI.0.1.d.25. Emociones básicas: alegría, tristeza, ira y miedo.",
    "CI.0.1.d.26. Normas básicas de convivencia, del entorno familiar y escolar.",
    "CI.0.1.d.27. Acciones básicas para la regulación progresiva de emociones.",
    "CI.0.1.d.28. Formas de interacción respetuosa con los demás.",
      ],
      procedimentales: [
    "CI.0.1.p.23. Expresar emociones básicas de manera respetuosa en situaciones del entorno familiar y escolar.",
    "CI.0.1.p.24. Relacionar emociones básicas con situaciones cotidianas.",
    "CI.0.1.p.25. Practicar acciones sencillas para regular progresivamente sus emociones con ayuda del adulto.",
      ],
      actitudinales: [
    "CI.0.1.a.19. Respetar a sí mismo y a los demás.",
    "CI.0.1.a.20. Mostrar disposición para expresar emociones de manera respetuosa.",
    "CI.0.1.a.21. Mostrar disposición para regular progresivamente sus emociones con acompañamiento del adulto.",
      ],
    },
    recursos: buildRecursos("CE.CI.0.9"),
  },
  {
    codigo: "CE.CI.0.10",
    descripcion: "Explorar características y elementos del mundo natural mediante los sentidos y experiencias sencillas, para favorecer la curiosidad, el descubrimiento progresivo y el cuidado de su entorno con apoyo del adulto.",
    competenciasClave: ["CSE", "CC", "CIT"],
    indicadores34: [
    { codigo: "I.CI.0.10.1", texto: "Reconoce seres vivos y elementos no vivos de su entorno" },
    { codigo: "I.CI.0.10.2", texto: "Identifica algunas características observables de animales, plantas, y elementos del entorno" },
    { codigo: "I.CI.0.10.3", texto: "Observa cambios sencillos en el crecimiento de plantas y animales mediante experiencias cotidianas con acompañamiento del adulto" },
    { codigo: "I.CI.0.10.04", texto: "Explora elementos del entorno mediante los sentidos" },
    ],
    indicadores45: [
    { codigo: "I.CI.0.10.01", texto: "Diferencia seres vivos y elementos no vivos de su entorno" },
    { codigo: "I.CI.0.10.02", texto: "Describe características observables de animales, plantas y elementos del entorno" },
    { codigo: "I.CI.0.10.03", texto: "Ordena secuencias sencillas del crecimiento de plantas y animales" },
    { codigo: "I.CI.0.10.04", texto: "Explora elementos del entorno mediante los sentidos" },
    ],
    indicadores56: [
    { codigo: "I.CI.0.10.01", texto: "Diferencia seres vivos y elementos no vivos de su entorno" },
    { codigo: "I.CI.0.10.02", texto: "Describe características observables de animales, plantas y elementos del entorno" },
    { codigo: "I.CI.0.10.03", texto: "Ordena secuencias sencillas del crecimiento de plantas y animales" },
    { codigo: "I.CI.0.10.04", texto: "Explora elementos del entorno mediante los sentidos" },
    ],
    saberes34: {
      declarativos: [
    "CI.0.2.d.01. Seres vivos y no vivos. Animales domésticos.",
    "CI.0.2.d.03. Características de las plantas y animales. Cambios que experimentan algunas plantas y animales durante su crecimiento.",
    "CI.0.2.d.05. Fenómenos naturales del entorno (lluvia, viento, cambios del clima).",
      ],
      procedimentales: [
    "CI.0.2.p.01. Reconocer elementos del entorno mediante la exploración con los sentidos.",
    "CI.0.2.p.02. Explorar elementos del entorno mediante experiencias sencillas con apoyo de un adulto. Participar en acciones sencillas de cuidado de plantas y animales en situaciones de juego y cotidianas.",
      ],
      actitudinales: [
    "CI.0.2.a.01. Mostrar curiosidad por explorar elementos del entorno, siguiendo instrucciones.",
    "CI.0.2.a.02. Mostrar interés por el cuidado de plantas y animales.",
      ],
    },
    saberes45: {
      declarativos: [
    "CI.0.2.d.01. Seres vivos y no vivos.",
    "CI.0.2.d.02. Animales domésticos y silvestres.",
    "CI.0.2.d.03. Características de las plantas y animales.",
    "CI.0.2.d.04. Ciclo vital de las plantas y animales.",
    "CI.0.2.d.05. Fenómenos naturales del entorno (lluvia, viento, cambios del clima).",
      ],
      procedimentales: [
    "CI.0.2.p.01. Comparar los elementos del entorno a través de la discriminación sensorial.",
    "CI.0.2.p.02. Explorar elementos del entorno mediante experiencias sencillas con apoyo de un adulto.",
    "CI.0.2.p.03. Practicar acciones de cuidado de plantas y animales en situaciones de juego y cotidianas.",
      ],
      actitudinales: [
    "CI.0.2.a.01. Mostrar curiosidad por explorar elementos del entorno, siguiendo instrucciones.",
    "CI.0.2.a.02. Mostrar interés por el cuidado de plantas y animales.",
      ],
    },
    saberes56: {
      declarativos: [
    "CI.0.2.d.01. Seres vivos y no vivos.",
    "CI.0.2.d.02. Animales domésticos y silvestres.",
    "CI.0.2.d.03. Características de las plantas y animales.",
    "CI.0.2.d.04. Ciclo vital de las plantas y animales.",
    "CI.0.2.d.05. Fenómenos naturales del entorno (lluvia, viento, cambios del clima).",
      ],
      procedimentales: [
    "CI.0.2.p.01. Comparar los elementos del entorno a través de la discriminación sensorial.",
    "CI.0.2.p.02. Explorar elementos del entorno mediante experiencias sencillas con apoyo de un adulto.",
    "CI.0.2.p.03. Practicar acciones de cuidado de plantas y animales en situaciones de juego y cotidianas.",
      ],
      actitudinales: [
    "CI.0.2.a.01. Mostrar curiosidad por explorar elementos del entorno, siguiendo instrucciones.",
    "CI.0.2.a.02. Mostrar interés por el cuidado de plantas y animales.",
      ],
    },
    recursos: buildRecursos("CE.CI.0.10"),
  },
  {
    codigo: "CE.CI.0.11",
    descripcion: "Participar en acciones sencillas de cuidado y conservación de los espacios naturales y cotidianos, reconociendo la importancia de mantener ambientes limpios y saludables con acompañamiento del adulto.",
    competenciasClave: ["CIT", "CC", "CMCT", "CSE"],
    indicadores34: [
    { codigo: "I.CI.0.11.05", texto: "Reconoce medios de transporte de su enotorno" },
    { codigo: "I.CI.0.11.06", texto: "Participa en actividades sencillas para cuidar el agua" },
    { codigo: "I.CI.0.11.07", texto: "Colabora en la separación de algunos materiales para reutilizarlos durante actividades de juego" },
    ],
    indicadores45: [
    { codigo: "I.CI.0.11.05", texto: "Identifica medios de transporte que favorecen el cuidado del ambiente en situaciones cotidianas" },
    { codigo: "I.CI.0.11.06", texto: "Practica acciones sencillas del cuidado del agua, suelo y espacios naturales en actividades cotidianas" },
    { codigo: "I.CI.0.11.07", texto: "Participa en acciones sencillas de reducción, reutilización y clasificación de materiales" },
    ],
    indicadores56: [
    { codigo: "I.CI.0.11.05", texto: "Identifica medios de transporte que favorecen el cuidado del ambiente en situaciones cotidianas" },
    { codigo: "I.CI.0.11.06", texto: "Practica acciones sencillas del cuidado del agua, suelo y espacios naturales en actividades cotidianas" },
    { codigo: "I.CI.0.11.07", texto: "Participa en acciones sencillas de reducción, reutilización y clasificación de materiales" },
    ],
    saberes34: {
      declarativos: [
    "CI.0.2.d.06. Hábitos de cuidado.",
    "CI.0.2.d.07. Situaciones de contaminación del agua.",
    "CI.0.2.d.08. Medios de transporte sostenibles de su entorno.",
      ],
      procedimentales: [
    "CI.0.2.p.04. Reconocer algunos medios de transporte presentes en su entorno.",
    "CI.0.2.p.05. Reconocer características básicas de medios de transporte presentes en su entorno.",
    "CI.0.2.p.06. Participar en actividades de cuidado del medio ambiente.",
    "CI.0.2.p.07. Agrupar materiales según sus características visibles para reutilizarlos en actividades de juego.",
      ],
      actitudinales: [
    "CI.0.2.a.03. Mostrar disposición para mantener limpio su entorno.",
    "CI.0.2.a.04. Mostrar curiosidad por observar los diferentes medios de transporte presentes en su entorno.",
      ],
    },
    saberes45: {
      declarativos: [
    "CI.0.2.d.06. Hábitos de cuidado y conservación del medio ambiente.",
    "CI.0.2.d.07. Situaciones de contaminación del suelo y agua.",
    "CI.0.2.d.08. Medios de transporte sostenibles de su entorno.",
      ],
      procedimentales: [
    "CI.0.2.p.04. Diferenciar medios de transporte de su entorno según su aporte al cuidado del ambiente.",
    "CI.0.2.p.05. Identificar características básicas de medios de transporte presentes en su entorno.",
    "CI.0.2.p.06. Participar en actividades de cuidado del medio ambiente.",
    "CI.0.2.p.07. Clasificar residuos según características visibles para favorecer su reutilización.",
      ],
      actitudinales: [
    "CI.0.2.a.03. Mostrar interés por mantener limpio su entorno.",
    "CI.0.2.a.04. Mostrar interés por conocer medios de transporte que favorecen el cuidado del entorno.",
      ],
    },
    saberes56: {
      declarativos: [
    "CI.0.2.d.06. Hábitos de cuidado y conservación del medio ambiente.",
    "CI.0.2.d.07. Situaciones de contaminación del suelo y agua.",
    "CI.0.2.d.08. Medios de transporte sostenibles de su entorno.",
      ],
      procedimentales: [
    "CI.0.2.p.04. Diferenciar medios de transporte de su entorno según su aporte al cuidado del ambiente.",
    "CI.0.2.p.05. Identificar características básicas de medios de transporte presentes en su entorno.",
    "CI.0.2.p.06. Participar en actividades de cuidado del medio ambiente.",
    "CI.0.2.p.07. Clasificar residuos según características visibles para favorecer su reutilización.",
      ],
      actitudinales: [
    "CI.0.2.a.03. Mostrar interés por mantener limpio su entorno.",
    "CI.0.2.a.04. Mostrar interés por conocer medios de transporte que favorecen el cuidado del entorno.",
      ],
    },
    recursos: buildRecursos("CE.CI.0.11"),
  },
  {
    codigo: "CE.CI.0.12",
    descripcion: "Construir patrones, secuencias y nociones básicas de tiempo en juegos y situaciones cotidianas para establecer y organizar sus experiencias con apoyo del adulto.",
    competenciasClave: ["CC", "CMCT", "CSE", "CECA", "CIT"],
    indicadores34: [
    { codigo: "I.CI.0.12.08", texto: "Reconoce patrones sencillos con objetos, sonidos o movimientos de situaciones cotidianas" },
    { codigo: "I.CI.0.12.09", texto: "Reconoce el orden de algunas actividades de su rutina diaria utilizando expresiones como primero y después, con acompañamiento del adulto" },
    { codigo: "I.CI.0.12.10", texto: "Reconoce diferencias entre el día y la noche a partir de experiencias de la vida cotidiana" },
    { codigo: "I.CI.0.12.11", texto: "Reproduce patrones sencillos utilizando objetos, sonidos o movimientos con apoyo del adulto" },
    ],
    indicadores45: [
    { codigo: "I.CI.0.12.08", texto: "Identifica patrones y secuencias sencillas con objetos, sonidos y movimientos de situaciones cotidianas" },
    { codigo: "I.CI.0.12.09", texto: "Ordena secuencias de actividades cotidianas utilizando nociones temporales básicas" },
    { codigo: "I.CI.0.12.10", texto: "Reconoce las características del día, tarde y noche en situaciones de la vida cotidiana" },
    { codigo: "I.CI.0.12.11", texto: "Construye patrones utilizando objetos del entorno, sonidos y movimientos" },
    { codigo: "I.CI.0.12.12", texto: "Relaciona actividades cotidianas con referencias a temporales como días y de la semana" },
    ],
    indicadores56: [
    { codigo: "I.CI.0.12.08", texto: "Identifica patrones y secuencias sencillas con objetos, sonidos y movimientos de situaciones cotidianas" },
    { codigo: "I.CI.0.12.09", texto: "Ordena secuencias de actividades cotidianas utilizando nociones temporales básicas" },
    { codigo: "I.CI.0.12.10", texto: "Reconoce las características del día, tarde y noche en situaciones de la vida cotidiana" },
    { codigo: "I.CI.0.12.11", texto: "Construye patrones utilizando objetos del entorno, sonidos y movimientos" },
    { codigo: "I.CI.0.12.12", texto: "Relaciona actividades cotidianas con referencias a temporales como días y de la semana" },
    ],
    saberes34: {
      declarativos: [
    "CI.0.2.d.09. Día y noche. Nociones temporales: antes y después; mañana y noche.",
    "CI.0.2.d.11. Patrones.",
    "CI.0.2.d.13. Referencias temporales (actividades cotidianas y días de la semana).",
      ],
      procedimentales: [
    "CI.0.2.p.08. Reproducir patrones con objetos del entorno, sonidos y movimientos.",
    "CI.0.2.p.09. Ordenar secuencias temporales en situaciones cotidianas. Relacionar actividades habituales con el día y la noche mediante experiencias cotidianas.",
      ],
      actitudinales: [
    "CI.0.2.a.05. Mostrar curiosidad por rutinas y secuencias temporales en la vida cotidiana. Participar con interés en juegos y actividades que impliquen seguir secuencias y rutinas sencillas.",
      ],
    },
    saberes45: {
      declarativos: [
    "CI.0.2.d.09. Día y noche.",
    "CI.0.2.d.10. Nociones temporales: antes, ahora, después; mañana, tarde, noche.",
    "CI.0.2.d.11. Patrones.",
    "CI.0.2.d.12. Secuencias temporales.",
    "CI.0.2.d.13. Referencias temporales (actividades cotidianas y días de la semana).",
      ],
      procedimentales: [
    "CI.0.2.p.08. Reproducir patrones con objetos del entorno, sonidos y movimientos.",
    "CI.0.2.p.09. Ordenar secuencias temporales en situaciones cotidianas.",
    "CI.0.2.p.10. Relacionar momentos del día con actividades cotidianas.",
    "CI.0.2.p.11. Relacionar actividades cotidianas con referencias temporales.",
      ],
      actitudinales: [
    "CI.0.2.a.05. Mostrar curiosidad por rutinas y secuencias temporales en la vida cotidiana.",
    "CI.0.2.a.06. Participar con interés en rutinas y secuencias temporales en la vida cotidiana.",
      ],
    },
    saberes56: {
      declarativos: [
    "CI.0.2.d.09. Día y noche.",
    "CI.0.2.d.10. Nociones temporales: antes, ahora, después; mañana, tarde, noche.",
    "CI.0.2.d.11. Patrones.",
    "CI.0.2.d.12. Secuencias temporales.",
    "CI.0.2.d.13. Referencias temporales (actividades cotidianas y días de la semana).",
      ],
      procedimentales: [
    "CI.0.2.p.08. Reproducir patrones con objetos del entorno, sonidos y movimientos.",
    "CI.0.2.p.09. Ordenar secuencias temporales en situaciones cotidianas.",
    "CI.0.2.p.10. Relacionar momentos del día con actividades cotidianas.",
    "CI.0.2.p.11. Relacionar actividades cotidianas con referencias temporales.",
      ],
      actitudinales: [
    "CI.0.2.a.05. Mostrar curiosidad por rutinas y secuencias temporales en la vida cotidiana.",
    "CI.0.2.a.06. Participar con interés en rutinas y secuencias temporales en la vida cotidiana.",
      ],
    },
    recursos: buildRecursos("CE.CI.0.12"),
  },
  {
    codigo: "CE.CI.0.13",
    descripcion: "Relación de objetos del entorno mediante nociones espaciales, de tamaño, cantidad y medida a través de la manipulación y el juego. CSE.",
    competenciasClave: ["CECA", "CIT", "CCICC", "CMCT", "CD"],
    indicadores34: [
    { codigo: "I.CI.0.13.1", texto: "Explora objetos utilizando nociones espaciales sencillas en relación con su cuerpo y otros objetos" },
    { codigo: "I.CI.0.13.2", texto: "Reconoce diferencias sencillas de tamaño y cantidad entre objetos y personas" },
    ],
    indicadores45: [
    { codigo: "I.CI.0.13.13", texto: "Ubica objetos utilizando nociones espaciales en relación con su cuerpo y otros objetos" },
    { codigo: "I.CI.0.13.14", texto: "Compara relaciones de tamaño, cantidad y medida en objetos y atributos físicos de las personas" },
    ],
    indicadores56: [
    { codigo: "I.CI.0.13.13", texto: "Ubica objetos utilizando nociones espaciales en relación con su cuerpo y otros objetos" },
    { codigo: "I.CI.0.13.14", texto: "Compara relaciones de tamaño, cantidad y medida en objetos y atributos físicos de las personas" },
    ],
    saberes34: {
      declarativos: [
    "CI.0.2.d.14. Nociones espaciales básicas: arriba/abajo, dentro/fuera y cerca/lejos.",
    "CI.0.2.d.15. Nociones básicas de medida: grande/pequeño, alto/bajo y largo/corto.",
    "CI.0.2.d.16. Nociones básicas de cantidad: lleno/vacío.",
    "CI.0.2.d.17. Relaciones sencillas de tamaño y cantidad entre objetos.",
      ],
      procedimentales: [
    "CI.0.2.p.12. Explorar objetos utilizando nociones espaciales básicas durante el juego y las actividades cotidianas.",
    "CI.0.2.p.13. Agrupar y reconocer diferencias sencillas entre objetos según su tamaño, cantidad o textura mediante la manipulación.",
    "CI.0.2.p.14. Reconocer características físicas visibles de tamaño y edad entre personas.",
      ],
      actitudinales: [
    "CI.0.2.a.07. Mostrar interés por explorar, manipular y comparar objetos de su entorno utilizando nociones espaciales, de tamaño y cantidad.",
      ],
    },
    saberes45: {
      declarativos: [
    "CI.0.2.d.14. Nociones espaciales: arriba/ abajo, al lado, dentro/fuera, cerca/lejos, entre, adelante/ atrás, junto a, cerca/ lejos.",
    "CI.0.2.d.15. Nociones de medida: alto/bajo, pesado/liviano, largo/ corto, grueso/ delgado, joven/viejo.",
    "CI.0.2.d.16. Nociones de cantidad: lleno/vacío, más/menos.",
    "CI.0.2.d.17. Relaciones de tamaño y cantidad.",
      ],
      procedimentales: [
    "CI.0.2.p.12. Ubicar objetos en relación consigo mismo y diferentes puntos de referencia.",
    "CI.0.2.p.13. Relacionar objetos según tamaño, cantidad, forma y textura.",
    "CI.0.2.p.14. Comparar características físicas básicas: estatura y edad.",
      ],
      actitudinales: [
    "CI.0.2.a.07. Mostrar curiosidad por nociones espaciales, de medida y de cantidad.",
      ],
    },
    saberes56: {
      declarativos: [
    "CI.0.2.d.14. Nociones espaciales: arriba/ abajo, al lado, dentro/fuera, cerca/lejos, entre, adelante/ atrás, junto a, cerca/ lejos.",
    "CI.0.2.d.15. Nociones de medida: alto/bajo, pesado/liviano, largo/ corto, grueso/ delgado, joven/viejo.",
    "CI.0.2.d.16. Nociones de cantidad: lleno/vacío, más/menos.",
    "CI.0.2.d.17. Relaciones de tamaño y cantidad.",
      ],
      procedimentales: [
    "CI.0.2.p.12. Ubicar objetos en relación consigo mismo y diferentes puntos de referencia.",
    "CI.0.2.p.13. Relacionar objetos según tamaño, cantidad, forma y textura.",
    "CI.0.2.p.14. Comparar características físicas básicas: estatura y edad.",
      ],
      actitudinales: [
    "CI.0.2.a.07. Mostrar curiosidad por nociones espaciales, de medida y de cantidad.",
      ],
    },
    recursos: buildRecursos("CE.CI.0.13"),
  },
  {
    codigo: "CE.CI.0.14",
    descripcion: "Clasificar objetos del entorno mediante sus características, el conteo, la correspondencia y situaciones cotidianas de uso responsable de los recursos, para desarrollar el pensamiento lógico-matemático inicial.",
    competenciasClave: ["CC", "CMCT", "CD", "CIT", "CSE", "CECA"],
    indicadores34: [
    { codigo: "I.CI.0.14.15", texto: "Agrupa objetos del entorno considerando un atributo visible, como el color, la forma o el tamaño en situaciones cotidianas" },
    { codigo: "I.CI.0.14.16", texto: "Establece relaciones de cantidad mediante correspondencia y conteo secuencial del 1 al 10, y relación numeral-cantidad hasta el 5" },
    { codigo: "I.CI.0.14.17", texto: "Reconoce la moneda de 1 dólar" },
    { codigo: "I.CI.0.14.18", texto: "Reconoce situaciones sencillas relacionadas con lo que necesita y lo que le gusta durante actividades cotidianas" },
    { codigo: "I.CI.0.14.19", texto: "Intenta nuevamente una actividad con el apoyo y la motivación del adulto cuando encuentra dificultades" },
    ],
    indicadores45: [
    { codigo: "I.CI.0.14.15", texto: "Clasifica objetos del entorno según atributos como: textura, forma, tamaño, color) en situaciones cotidianas" },
    { codigo: "I.CI.0.14.16", texto: "Establece relaciones de cantidad mediante correspondencia y conteo secuencial del 1 al 15, y relación numeral-cantidad hasta el 10" },
    { codigo: "I.CI.0.14.17", texto: "Identifica la moneda y billete de 1 dólar" },
    { codigo: "I.CI.0.14.18", texto: "Diferencia entre deseos y necesidades" },
    { codigo: "I.CI.0.14.19", texto: "Intenta nuevamente resolver una actividad después de cometer un error" },
    ],
    indicadores56: [
    { codigo: "I.CI.0.14.15", texto: "Clasifica objetos del entorno según atributos como: textura, forma, tamaño, color) en situaciones cotidianas" },
    { codigo: "I.CI.0.14.16", texto: "Establece relaciones de cantidad mediante correspondencia y conteo secuencial del 1 al 15, y relación numeral-cantidad hasta el 10" },
    { codigo: "I.CI.0.14.17", texto: "Identifica la moneda y billete de 1 dólar" },
    { codigo: "I.CI.0.14.18", texto: "Diferencia entre deseos y necesidades" },
    { codigo: "I.CI.0.14.19", texto: "Intenta nuevamente resolver una actividad después de cometer un error" },
    ],
    saberes34: {
      declarativos: [
    "CI.0.2.d.18. Colores primarios y blanco y negro.",
    "CI.0.2.d.19. Texturas sencillas de los objetos: suave/duro.",
    "CI.0.2.d.20. Figuras geométricas básicas: círculo, cuadrado y triángulo.",
    "CI.0.2.d.21. Números del 1 al 10 secuencia numérica y relación número-cantidad hasta el 5.",
    "CI.0.2.d.23. Moneda de 1 dólar.",
    "CI.0.2.d.24. Deseos y necesidades.",
      ],
      procedimentales: [
    "CI.0.2.p.15. Agrupar objetos de acuerdo con los colores primarios.",
    "CI.0.2.p.16. Explorar colores mediante la manipulación de materiales y pinturas.",
    "CI.0.2.p.17. Reconocer formas geométricas básicas presentes en objetos del entorno.",
    "CI.0.2.p.18. Agrupar figuras geométricas básicas según su forma.",
    "CI.0.2.p.19. Establecer la relación de número-cantidad hasta el 5.",
    "CI.0.2.p.21. Agrupar objetos considerando un solo atributo visible.",
    "CI.0.2.p.23. Reconocer situaciones sencillas relacionadas con lo que necesita y lo que desea durante el juego.",
    "CI.0.2.p.24. Reconocer la moneda de 1 dólar en situaciones de juego o de la vida cotidiana.",
      ],
      actitudinales: [
    "CI.0.2.a.07. Mostrar disposición para volver a intentar una actividad con acompañamiento del adulto cuando encuentra dificultades.",
    "CI.0.2.a.08. Mostrar curiosidad por explorar, manipular y agrupar objetos según sus características.",
      ],
    },
    saberes45: {
      declarativos: [
    "CI.0.2.d.18. Colores primarios, secundarios, blanco y negro.",
    "CI.0.2.d.19. Texturas de los objetos: suave/duro, liso/áspero.",
    "CI.0.2.d.20. Figuras geométricas: círculo, cuadrado, triángulo y rectángulo.",
    "CI.0.2.d.21. Números del 1 al 15 secuencia numérica, y relación numeral-cantidad hasta el 10.",
    "CI.0.2.d.22. Relación de correspondencia entre elementos y colecciones.",
    "CI.0.2.d.23. Moneda y billete de 1 dólar.",
    "CI.0.2.d.24. Deseos y necesidades.",
      ],
      procedimentales: [
    "CI.0.2.p.15. Clasificar objetos de acuerdo con los colores primarios.",
    "CI.0.2.p.16. Experimentar la mezcla de dos colores primarios para formar colores secundarios.",
    "CI.0.2.p.17. Asociar los objetos del entorno con las formas circulares, cuadradas, triangulares y rectangulares.",
    "CI.0.2.p.18. Clasificar las figuras geométricas: círculo, cuadrado, triángulo y rectángulo.",
    "CI.0.2.p.19. Establecer la relación de número-cantidad hasta el 10.",
    "CI.0.2.p.20. Relacionar numerales (representación y simbólica) y cantidades hasta el 5.",
    "CI.0.2.p.21. Clasificar objetos con dos atributos (tamaño, textura, color o forma).",
    "CI.0.2.p.22. Comparar y armar colecciones de más, igual y menos objetos.",
    "CI.0.2.p.23. Diferenciar entre lo que se desea comprar y lo que necesita.",
    "CI.0.2.p.24. Reconocer la moneda y el billete de 1 dólar en situaciones de juego o de la vida cotidiana.",
      ],
      actitudinales: [
    "CI.0.2.a.07. Aceptar el error como oportunidad de aprendizaje.",
    "CI.0.2.a.08. Mostrar interés por explorar las características de los objetos.",
      ],
    },
    saberes56: {
      declarativos: [
    "CI.0.2.d.18. Colores primarios, secundarios, blanco y negro.",
    "CI.0.2.d.19. Texturas de los objetos: suave/duro, liso/áspero.",
    "CI.0.2.d.20. Figuras geométricas: círculo, cuadrado, triángulo y rectángulo.",
    "CI.0.2.d.21. Números del 1 al 15 secuencia numérica, y relación numeral-cantidad hasta el 10.",
    "CI.0.2.d.22. Relación de correspondencia entre elementos y colecciones.",
    "CI.0.2.d.23. Moneda y billete de 1 dólar.",
    "CI.0.2.d.24. Deseos y necesidades.",
      ],
      procedimentales: [
    "CI.0.2.p.15. Clasificar objetos de acuerdo con los colores primarios.",
    "CI.0.2.p.16. Experimentar la mezcla de dos colores primarios para formar colores secundarios.",
    "CI.0.2.p.17. Asociar los objetos del entorno con las formas circulares, cuadradas, triangulares y rectangulares.",
    "CI.0.2.p.18. Clasificar las figuras geométricas: círculo, cuadrado, triángulo y rectángulo.",
    "CI.0.2.p.19. Establecer la relación de número-cantidad hasta el 10.",
    "CI.0.2.p.20. Relacionar numerales (representación y simbólica) y cantidades hasta el 5.",
    "CI.0.2.p.21. Clasificar objetos con dos atributos (tamaño, textura, color o forma).",
    "CI.0.2.p.22. Comparar y armar colecciones de más, igual y menos objetos.",
    "CI.0.2.p.23. Diferenciar entre lo que se desea comprar y lo que necesita.",
    "CI.0.2.p.24. Reconocer la moneda y el billete de 1 dólar en situaciones de juego o de la vida cotidiana.",
      ],
      actitudinales: [
    "CI.0.2.a.07. Aceptar el error como oportunidad de aprendizaje.",
    "CI.0.2.a.08. Mostrar interés por explorar las características de los objetos.",
      ],
    },
    recursos: buildRecursos("CE.CI.0.14"),
  },
  {
    codigo: "CE.CI.0.15",
    descripcion: "Expresar necesidades, emociones, intenciones y vivencias, mediante la exploración y uso del lenguaje oral para interactuar en diferentes situaciones y contextos.",
    competenciasClave: ["CSE", "CECA", "CIT", "CMCT", "CD", "CC"],
    indicadores34: [
    { codigo: "I.CI.0.15.01", texto: "Responde a preguntas sencillas sobre imágenes o" },
    { codigo: "I.CI.0.15.2", texto: "Participa en canciones, rimas, rondas y poemas cortos, repitiendo palabras o frases con interés" },
    { codigo: "I.CI.0.15.3", texto: "Expresa necesidades, emociones y vivencias mediante palabras o frases sencillas con apoyo del adulto" },
    { codigo: "I.CI.0.15.4", texto: "Expresa aceptación o rechazo utilizando palabras, gestos o expresiones respetuosas en situaciones cotidianas" },
    ],
    indicadores45: [
    { codigo: "I.CI.0.15.01", texto: "Participa en conversaciones e interacciones cotidianas, utilizando palabras y frases para describir objetos, imágenes o situaciones" },
    { codigo: "I.CI.0.15.02", texto: "Reproduce rimas, retahílas, trabalenguas sencillos, adivinanzas, rondas, canciones y poemas cortos con interés" },
    { codigo: "I.CI.0.15.03", texto: "Expresa ideas, vivencias, necesidades y emociones, mediante oraciones cortas y coherentes" },
    { codigo: "I.CI.0.15.04", texto: "Expresa aceptación o rechazo en situaciones cotidianas de manera respetuosa" },
    ],
    indicadores56: [
    { codigo: "I.CI.0.15.01", texto: "Participa en conversaciones e interacciones cotidianas, utilizando palabras y frases para describir objetos, imágenes o situaciones" },
    { codigo: "I.CI.0.15.02", texto: "Reproduce rimas, retahílas, trabalenguas sencillos, adivinanzas, rondas, canciones y poemas cortos con interés" },
    { codigo: "I.CI.0.15.03", texto: "Expresa ideas, vivencias, necesidades y emociones, mediante oraciones cortas y coherentes" },
    { codigo: "I.CI.0.15.04", texto: "Expresa aceptación o rechazo en situaciones cotidianas de manera respetuosa" },
    ],
    saberes34: {
      declarativos: [
    "CI.0.3.d.01. Frases cortas.",
    "CI.0.3.d.02. Canciones infantiles, rimas, rondas y poemas.",
    "CI.0.3.d.03. Necesidades y emociones.",
      ],
      procedimentales: [
    "CI.0.3.p.01. Describir de forma oral y breve imágenes gráficas y digitales.",
    "CI.0.3.p.02. Participar en conversaciones relacionadas con un mismo tema.",
    "CI.0.3.p.03. Repetir canciones, rimas, rondas y poemas cortos.",
    "CI.0.3.p.04. Comunicar necesidades, emociones utilizando oraciones cortas y coherentes.",
      ],
      actitudinales: [
    "CI.0.3.a.01. Mostrar interés por participar en intercambios orales.",
    "CI.0.3.a.02. Expresar necesidades, emociones y vivencias con confianza y acompañamiento de un adulto.",
    "CI.0.3.a.03. Mostrar disposición para expresar aceptación o rechazo de manera respetuosa mediante palabras o gestos.",
      ],
    },
    saberes45: {
      declarativos: [
    "CI.0.3.d.01. Oraciones cortas y coherentes.",
    "CI.0.3.d.02. Rimas, canciones, trabalenguas, retahílas, rondas, canciones y poemas cortos.",
    "CI.0.3.d.03. Necesidades, vivencias y emociones.",
      ],
      procedimentales: [
    "CI.0.3.p.01. Describir oralmente imágenes gráficas y digitales.",
    "CI.0.3.p.02. Participar en conversaciones relacionadas con un mismo tema.",
    "CI.0.3.p.03. Reproducir rimas, retahílas, trabalenguas sencillos, adivinanzas, rondas, canciones y poemas cortos.",
    "CI.0.3.p.04. Comunicar utilizando oraciones cortas y coherentes.",
      ],
      actitudinales: [
    "CI.0.2.a.01. Mostrar interés por participar en conversaciones e intercambios orales.",
    "CI.0.3.a.02. Expresar ideas, necesidades, emociones y vivencias con confianza y respeto.",
    "CI.0.3.a.03. Mostrar seguridad de aceptación o rechazo de manera respetuosa.",
      ],
    },
    saberes56: {
      declarativos: [
    "CI.0.3.d.01. Oraciones cortas y coherentes.",
    "CI.0.3.d.02. Rimas, canciones, trabalenguas, retahílas, rondas, canciones y poemas cortos.",
    "CI.0.3.d.03. Necesidades, vivencias y emociones.",
      ],
      procedimentales: [
    "CI.0.3.p.01. Describir oralmente imágenes gráficas y digitales.",
    "CI.0.3.p.02. Participar en conversaciones relacionadas con un mismo tema.",
    "CI.0.3.p.03. Reproducir rimas, retahílas, trabalenguas sencillos, adivinanzas, rondas, canciones y poemas cortos.",
    "CI.0.3.p.04. Comunicar utilizando oraciones cortas y coherentes.",
      ],
      actitudinales: [
    "CI.0.2.a.01. Mostrar interés por participar en conversaciones e intercambios orales.",
    "CI.0.3.a.02. Expresar ideas, necesidades, emociones y vivencias con confianza y respeto.",
    "CI.0.3.a.03. Mostrar seguridad de aceptación o rechazo de manera respetuosa.",
      ],
    },
    recursos: buildRecursos("CE.CI.0.15"),
  },
  {
    codigo: "CE.CI.0.16",
    descripcion: "Participar en actividades individuales y colectivas relacionadas con textos literarios y no literarios para comprender, relatar e intercambiar ideas con interés y disfrute.",
    competenciasClave: ["CSE", "CECA", "CD", "CCICC", "CC"],
    indicadores34: [
    { codigo: "I.CI.0.16.05", texto: "Participa con interes en la escucha de cuentos, canciones, poemas y textos cortos" },
    { codigo: "I.CI.0.16.06", texto: "Identifica personajes, objetos o acciones presentes en los textos escuchados" },
    { codigo: "I.CI.0.16.07", texto: "Expresa palabras, frases o experiencias relacionadas con los textos escuchados" },
    ],
    indicadores45: [
    { codigo: "I.CI.0.16.05", texto: "Participa con interés en actividades de lectura compartida" },
    { codigo: "I.CI.0.16.06", texto: "Responde preguntas sencillas sobre textos escuchados" },
    { codigo: "I.CI.0.16.07", texto: "Relata hechos de cuentos con apoyo, manteniendo una secuencia narrativa básica" },
    { codigo: "I.CI.0.16.08", texto: "Expresa comentarios, opiniones o experiencias relacionadas con los textos escuchados" },
    ],
    indicadores56: [
    { codigo: "I.CI.0.16.05", texto: "Participa con interés en actividades de lectura compartida" },
    { codigo: "I.CI.0.16.06", texto: "Responde preguntas sencillas sobre textos escuchados" },
    { codigo: "I.CI.0.16.07", texto: "Relata hechos de cuentos con apoyo, manteniendo una secuencia narrativa básica" },
    { codigo: "I.CI.0.16.08", texto: "Expresa comentarios, opiniones o experiencias relacionadas con los textos escuchados" },
    ],
    saberes34: {
      declarativos: [
    "CI.0.3.d.04. Textos orales breves del entorno cotidiano.",
    "CI.0.3.d.05. Cuentos cortos, canciones, rimas y poemas breves.",
      ],
      procedimentales: [
    "CI.0.3.p.05. Escuchar cuentos, canciones y poemas mostrando atención durante períodos cortos.",
    "CI.0.3.p.06. Identificar personajes, objetos o acciones presentes en los textos escuchados.",
    "CI.0.3.p.07. Responder preguntas sencillas con apoyo sobre los textos escuchados.",
      ],
      actitudinales: [
    "CI.0.3.a.04. Mostrar interés por escuchar cuentos, canciones y poemas.",
    "CI.0.3.a.05. Participar espontaneamente en compartir frases sobre cuentos escuchados.",
      ],
    },
    saberes45: {
      declarativos: [
    "CI.0.3.d.04. Textos literarios y no literarios.",
    "CI.0.3.d.05. Cuentos, poemas, canciones y textos informativos sencillos.",
      ],
      procedimentales: [
    "CI.0.3.p.05. Seguir instrucciones sencillas presentes en juegos, relatos o actividades que involucren la ejecución de tres o más acciones.",
    "CI.0.3.p.06. Relatar cuentos escuchados con secuencia narrativa básica.",
    "CI.0.3.p.07. Expresar ideas, comentarios o respuestas sobre textos escuchados.",
    "CI.0.3.p.08. Responder preguntas sobre un texto narrado.",
      ],
      actitudinales: [
    "CI.0.3.a.04. Disfrutar en actividades de lectura.",
    "CI.0.3.a.05. Mostrar interés en el intercambio de ideas.",
      ],
    },
    saberes56: {
      declarativos: [
    "CI.0.3.d.04. Textos literarios y no literarios.",
    "CI.0.3.d.05. Cuentos, poemas, canciones y textos informativos sencillos.",
      ],
      procedimentales: [
    "CI.0.3.p.05. Seguir instrucciones sencillas presentes en juegos, relatos o actividades que involucren la ejecución de tres o más acciones.",
    "CI.0.3.p.06. Relatar cuentos escuchados con secuencia narrativa básica.",
    "CI.0.3.p.07. Expresar ideas, comentarios o respuestas sobre textos escuchados.",
    "CI.0.3.p.08. Responder preguntas sobre un texto narrado.",
      ],
      actitudinales: [
    "CI.0.3.a.04. Disfrutar en actividades de lectura.",
    "CI.0.3.a.05. Mostrar interés en el intercambio de ideas.",
      ],
    },
    recursos: buildRecursos("CE.CI.0.16"),
  },
  {
    codigo: "CE.CI.0.17",
    descripcion: "Interpretar imágenes, signos, mensajes, textos y representaciones a partir de experiencias cotidianas para su comprensión.",
    competenciasClave: ["CC", "CSE", "CMCT", "CCICC", "CD", "CIT"],
    indicadores34: [
    { codigo: "I.CI.0.17.09", texto: "Identifica imágenes, fotografías, pictogramas, etiquetas y signos presentes en su entorno cotidiano" },
    { codigo: "I.CI.0.17.10", texto: "Ordena dos o tres imágenes para representar la secuencia de un cuento con apoyo del adulto" },
    ],
    indicadores45: [
    { codigo: "I.CI.0.17.09", texto: "Reconoce etiquetas, signos, rótulos, imágenes y portadas de uso cotidiano" },
    { codigo: "I.CI.0.17.10", texto: "Narra cuentos, historietas, leyendas tradicionales a partir de imágenes, manteniendo una secuencia lógica de los hechos" },
    ],
    indicadores56: [
    { codigo: "I.CI.0.17.09", texto: "Reconoce etiquetas, signos, rótulos, imágenes y portadas de uso cotidiano" },
    { codigo: "I.CI.0.17.10", texto: "Narra cuentos, historietas, leyendas tradicionales a partir de imágenes, manteniendo una secuencia lógica de los hechos" },
    ],
    saberes34: {
      declarativos: [
    "CI.0.3.d.06. Imágenes, fotografías, pictogramas y símbolos del entorno inmediato.",
    "CI.0.3.d.07. Cuentos ilustrados e imágenes sencillas.",
      ],
      procedimentales: [
    "CI.0.3.p.10. Identificar etiquetas, signos, rótulos, portadas e imágenes de uso cotidiano.",
    "CI.0.3.p.11. Ordenar secuencias de dos o tres imágenes de un cuento con apoyo de un adulto.",
      ],
      actitudinales: [
    "CI.0.3.a.06. Mostrar curiosidad por imágenes y representaciones de su entorno.",
      ],
    },
    saberes45: {
      declarativos: [
    "CI.0.3.d.06. Etiquetas, signos, rótulos de uso cotidiano.",
    "CI.0.3.d.07. Portadas e imágenes de textos.",
      ],
      procedimentales: [
    "CI.0.3.p.09. Narrar un cuento, historieta, leyenda tradicional o relato en forma secuencial a partir de imágenes.",
    "CI.0.3.p.10. Interpretar etiquetas, signos, rótulos, portadas e imágenes de uso cotidiano.",
      ],
      actitudinales: [
    "CI.0.3.a.06. Disfrutar de la lectura de imágenes y diversos tipos de textos. Orientaciones.",
      ],
    },
    saberes56: {
      declarativos: [
    "CI.0.3.d.06. Etiquetas, signos, rótulos de uso cotidiano.",
    "CI.0.3.d.07. Portadas e imágenes de textos.",
      ],
      procedimentales: [
    "CI.0.3.p.09. Narrar un cuento, historieta, leyenda tradicional o relato en forma secuencial a partir de imágenes.",
    "CI.0.3.p.10. Interpretar etiquetas, signos, rótulos, portadas e imágenes de uso cotidiano.",
      ],
      actitudinales: [
    "CI.0.3.a.06. Disfrutar de la lectura de imágenes y diversos tipos de textos. Orientaciones.",
      ],
    },
    recursos: buildRecursos("CE.CI.0.17"),
  },
  {
    codigo: "CE.CI.0.18",
    descripcion: "Participar en actividades de producción de textos mediante dibujos y escritura no convencional, para comunicar ideas en situaciones cotidianas.",
    competenciasClave: ["CC", "CMCT", "CIT", "CCICC", "CSE"],
    indicadores34: [
    { codigo: "I.CI.0.18.11", texto: "Participa en actividades gráficas utilizando dibujos, trazos y marcas con intención comunicativa" },
    { codigo: "I.CI.0.18.12", texto: "Expresa oralmente el significado de sus dibujos o producciones gráficas" },
    { codigo: "I.CI.0.18.13", texto: "Explora diferentes materiales y para realizar producciones gráficas" },
    ],
    indicadores45: [
    { codigo: "I.CI.0.18.11", texto: "Participa en la creación de cuentos colectivos" },
    { codigo: "I.CI.0.18.12", texto: "Comunica ideas mediante dibujos y escritura no convencionales (propio código)" },
    { codigo: "I.CI.0.18.13", texto: "Explora el lenguaje escrito en actividades lúdicas" },
    ],
    indicadores56: [
    { codigo: "I.CI.0.18.11", texto: "Participa en la creación de cuentos colectivos" },
    { codigo: "I.CI.0.18.12", texto: "Comunica ideas mediante dibujos y escritura no convencionales (propio código)" },
    { codigo: "I.CI.0.18.13", texto: "Explora el lenguaje escrito en actividades lúdicas" },
    ],
    saberes34: {
      declarativos: [
    "CI.0.3.d.08. Dibujos y trazos.",
    "CI.0.3.d.09. Materiales gráficos.",
      ],
      procedimentales: [
    "CI.0.3.p.11. Realizar dibujos o trazos para representar personas, objetos, acciones o experiencias.",
    "CI.0.3.p.12. Expresar oralmente el significado de sus producciones gráficas.",
    "CI.0.3.p.13. Explorar diversos materiales para realizar producciones gráficas.",
      ],
      actitudinales: [
    "CI.0.3.a.07. Mostrar interés por expresarse mediante dibujos, trazos y diferentes materiales gráficos.",
      ],
    },
    saberes45: {
      declarativos: [
    "CI.0.3.d.08. Producción escrita: códigos propios y dibujos.",
    "CI.0.3.d.09. Lenguaje gráfico y escrito como medio de comunicación y expresión.",
      ],
      procedimentales: [
    "CI.0.3.p.11. Participar en la creación de cuentos colectivos.",
    "CI.0.3.p.12. Comunicar sus ideas de manera escrita con su propio código y/o dibujos.",
    "CI.0.3.p.13. Expresar oralmente el significado de sus producciones escritas.",
      ],
      actitudinales: [
    "CI.0.3.a.07. Mostrar interés por explorar el lenguaje escrito como medio de comunicación y expresión.",
      ],
    },
    saberes56: {
      declarativos: [
    "CI.0.3.d.08. Producción escrita: códigos propios y dibujos.",
    "CI.0.3.d.09. Lenguaje gráfico y escrito como medio de comunicación y expresión.",
      ],
      procedimentales: [
    "CI.0.3.p.11. Participar en la creación de cuentos colectivos.",
    "CI.0.3.p.12. Comunicar sus ideas de manera escrita con su propio código y/o dibujos.",
    "CI.0.3.p.13. Expresar oralmente el significado de sus producciones escritas.",
      ],
      actitudinales: [
    "CI.0.3.a.07. Mostrar interés por explorar el lenguaje escrito como medio de comunicación y expresión.",
      ],
    },
    recursos: buildRecursos("CE.CI.0.18"),
  },
  {
    codigo: "CE.CI.0.19",
    descripcion: "Participar en juegos de lenguaje mediante sonidos, rimas y palabras para fortalecer la expresión oral.",
    competenciasClave: ["CC", "CECA", "CSE", "CIT", "CD", "CCICC"],
    indicadores34: [
    { codigo: "I.CI.0.19.14", texto: "Participa en juegos orales con canciones, sonidos, rimas y repeticiones de palabras" },
    { codigo: "I.CI.0.19.15", texto: "Realiza movimientos sencillos de labios, lengua y mejillas durante juegos y canciones" },
    ],
    indicadores45: [
    { codigo: "I.CI.0.19.14", texto: "Practica motricidad bucofacial con labios, lengua y mandíbulas" },
    { codigo: "I.CI.0.19.15", texto: "Pronuncia palabras con fonemas de difícil articulación" },
    { codigo: "I.CI.0.19.16", texto: "Reconoce rimas y sonidos iniciales o finales en palabras sencillas durante actividades lúdicas" },
    { codigo: "I.CI.0.19.17", texto: "Participa en juegos de rimas y palabras" },
    ],
    indicadores56: [
    { codigo: "I.CI.0.19.14", texto: "Practica motricidad bucofacial con labios, lengua y mandíbulas" },
    { codigo: "I.CI.0.19.15", texto: "Pronuncia palabras con fonemas de difícil articulación" },
    { codigo: "I.CI.0.19.16", texto: "Reconoce rimas y sonidos iniciales o finales en palabras sencillas durante actividades lúdicas" },
    { codigo: "I.CI.0.19.17", texto: "Participa en juegos de rimas y palabras" },
    ],
    saberes34: {
      declarativos: [
    "CI.0.3.d.10. Motricidad bucofacial de labios, lengua y mandíbula Juegos de lenguaje: rimas, juegos de palabras y sonidos iniciales.",
    "CI.0.3.d.12. Sonido inicial de su nombre.",
      ],
      procedimentales: [
    "CI.0.3.p.14. Realizar ejercicios de motricidad bucofacial con movimientos de labios, lengua, mandíbula y mejillas. Pronunciar palabras de uso cotidiano con fonemas de difícil articulaciónsencilla y progrsivamente con el fonema /s/.",
    "CI.0.3.p.16. Identificar rimas sencillas en rimas, caciones o sonidos de palabras.",
    "CI.0.3.p.17. Reconocer el sonido inicial de su nombre.",
      ],
      actitudinales: [
    "CI.0.3.a.08. Mostrar disposición para expresarse oralmente en juegos de lenguaje.",
    "CI.0.3.a.09. Disfrutar de los juegos de palabras, rimas y sonidos.",
      ],
    },
    saberes45: {
      declarativos: [
    "CI.0.3.d.10. Motricidad bucofacial de labios, lengua y mandíbula.",
    "CI.0.3.d.11. Juegos de lenguaje: rimas, juegos de palabras, sonidos iniciales y finales.",
    "CI.0.3.d.12. Sonido inicial de su nombre.",
      ],
      procedimentales: [
    "CI.0.3.p.14. Realizar ejercicios de motricidad bucofacial con movimientos de labios, lengua, mandíbula y mejillas.",
    "CI.0.3.p.15. Pronunciar palabras de uso cotidiano con fonemas de difícil articulación /s/ y /r/.",
    "CI.0.3.p.16. Discriminar rimas, sonidos iniciales o finales en juegos de palabras, rimas y/o sonidos.",
      ],
      actitudinales: [
    "CI.0.3.a.08. Mostrar disposición para expresarse oralmente en juegos de lenguaje.",
    "CI.0.3.a.09. Disfrutar de los juegos de palabras., rimas y sonidos.",
      ],
    },
    saberes56: {
      declarativos: [
    "CI.0.3.d.10. Motricidad bucofacial de labios, lengua y mandíbula.",
    "CI.0.3.d.11. Juegos de lenguaje: rimas, juegos de palabras, sonidos iniciales y finales.",
    "CI.0.3.d.12. Sonido inicial de su nombre.",
      ],
      procedimentales: [
    "CI.0.3.p.14. Realizar ejercicios de motricidad bucofacial con movimientos de labios, lengua, mandíbula y mejillas.",
    "CI.0.3.p.15. Pronunciar palabras de uso cotidiano con fonemas de difícil articulación /s/ y /r/.",
    "CI.0.3.p.16. Discriminar rimas, sonidos iniciales o finales en juegos de palabras, rimas y/o sonidos.",
      ],
      actitudinales: [
    "CI.0.3.a.08. Mostrar disposición para expresarse oralmente en juegos de lenguaje.",
    "CI.0.3.a.09. Disfrutar de los juegos de palabras., rimas y sonidos.",
      ],
    },
    recursos: buildRecursos("CE.CI.0.19"),
  },
  {
    codigo: "CE.CI.0.20",
    descripcion: "Producir mensajes mediante el lenguaje gráfico y escrito (propios códigos) para comunicar ideas, necesidades y experiencias en situaciones cotidianos.",
    competenciasClave: ["CC", "CMCT", "CCICC", "CIT", "CSE"],
    indicadores34: [
    { codigo: "I.CI.0.20.18", texto: "Realiza trazos intencionados explicando verbalmente la idea que elaboró" },
    ],
    indicadores45: [
    { codigo: "I.CI.0.20.18", texto: "Comunica ideas y experiencias mediante gráficos, trazos, símbolos o formas similares a letras" },
    ],
    indicadores56: [
    { codigo: "I.CI.0.20.18", texto: "Comunica ideas y experiencias mediante gráficos, trazos, símbolos o formas similares a letras" },
    ],
    saberes34: {
      declarativos: [
    "CI.0.3.d.13. Trazos espontáneos con intención de comunicar.",
      ],
      procedimentales: [
    "CI.0.3.p.17. Realizar trazos, marcas sobre papel o masa expresando ideas sobre sus creaciones.",
      ],
      actitudinales: [
    "CI.0.3.a.10. Disfruta sus propios trazos y producciones.",
      ],
    },
    saberes45: {
      declarativos: [
    "CI.0.3.d.13. Lenguaje gráfico y escrito (propios códigos).",
      ],
      procedimentales: [
    "CI.0.3.p.17. Expresar ideas mediante grafismos, trazos, símbolos o formas similares a letras con intención comunicativa.",
      ],
      actitudinales: [
    "CI.0.3.a.10. Disfrutar del uso del lenguaje escrito y gráfico como medio de comunicación.",
      ],
    },
    saberes56: {
      declarativos: [
    "CI.0.3.d.13. Lenguaje gráfico y escrito (propios códigos).",
      ],
      procedimentales: [
    "CI.0.3.p.17. Expresar ideas mediante grafismos, trazos, símbolos o formas similares a letras con intención comunicativa.",
      ],
      actitudinales: [
    "CI.0.3.a.10. Disfrutar del uso del lenguaje escrito y gráfico como medio de comunicación.",
      ],
    },
    recursos: buildRecursos("CE.CI.0.20"),
  },
  {
    codigo: "CE.CI.0.21",
    descripcion: "Participar en actividades artísticas individuales y colectivas mediante dramatizaciones, música, danzas y juegos para favorecer la creatividad y el disfrute.",
    competenciasClave: ["CC", "CECA", "CD", "CIT", "CSE", "CCICC"],
    indicadores34: [
    { codigo: "I.CI.0.21.19", texto: "Participa en juegos sencillos" },
    { codigo: "I.CI.0.21.21", texto: "Entona canciones cortas acompañadas de corporalidad o palmadas en actividades artísticas o juegos tradicionales" },
    ],
    indicadores45: [
    { codigo: "I.CI.0.21.19", texto: "Participa en dramatizaciones y juegos de roles" },
    { codigo: "I.CI.0.21.20", texto: "Participa en juegos tradicionales y manifestaciones culturales reconociendo normas básicas de interacción y colaboración" },
    { codigo: "I.CI.0.21.21", texto: "Entona canciones con ritmo y movimientos corporales" },
    { codigo: "I.CI.0.21.22", texto: "Muestra creatividad en actividades artísticas y culturales" },
    ],
    indicadores56: [
    { codigo: "I.CI.0.21.19", texto: "Participa en dramatizaciones y juegos de roles" },
    { codigo: "I.CI.0.21.20", texto: "Participa en juegos tradicionales y manifestaciones culturales reconociendo normas básicas de interacción y colaboración" },
    { codigo: "I.CI.0.21.21", texto: "Entona canciones con ritmo y movimientos corporales" },
    { codigo: "I.CI.0.21.22", texto: "Muestra creatividad en actividades artísticas y culturales" },
    ],
    saberes34: {
      declarativos: [
    "CI.0.3.d.14. Juego simbólico (imitación de roles).",
    "CI.0.3.d.15. Actividades artísticas individuales y grupales: rondas populares, canciones, bailes y juegos tradicionales.",
      ],
      procedimentales: [
    "CI.0.3.p.18. Imitar a personas cercanas o animales en situaciones de juegos.",
    "CI.0.3.p.19. Participar en actividades artísticas y juegos tradicionales.",
    "CI.0.3.p.20. Mover el cuerpo al ritmo de música de diferentes géneros.",
      ],
      actitudinales: [
    "CI.0.3.a.11. Mostrar entusiasmo al participar de bailes, canciones y juegos.",
      ],
    },
    saberes45: {
      declarativos: [
    "CI.0.3.d.14. Dramatizaciones y juegos de roles.",
    "CI.0.3.d.15. Actividades artísticas individuales y grupales: rondas populares, canciones, bailes y juegos tradicionales.",
      ],
      procedimentales: [
    "CI.0.3.p.18. Participar en dramatizaciones con roles de personas del entorno y de personajes de cuentos e historietas.",
    "CI.0.3.p.19. Participar en actividades artísticas, culturales y juegos tradicionales.",
    "CI.0.3.p.20. Entonar canciones con ritmo y movimientos corporales.",
      ],
      actitudinales: [
    "CI.0.3.a.11. Mostrar creatividad en actividades artísticas, culturales y lúdicas.",
      ],
    },
    saberes56: {
      declarativos: [
    "CI.0.3.d.14. Dramatizaciones y juegos de roles.",
    "CI.0.3.d.15. Actividades artísticas individuales y grupales: rondas populares, canciones, bailes y juegos tradicionales.",
      ],
      procedimentales: [
    "CI.0.3.p.18. Participar en dramatizaciones con roles de personas del entorno y de personajes de cuentos e historietas.",
    "CI.0.3.p.19. Participar en actividades artísticas, culturales y juegos tradicionales.",
    "CI.0.3.p.20. Entonar canciones con ritmo y movimientos corporales.",
      ],
      actitudinales: [
    "CI.0.3.a.11. Mostrar creatividad en actividades artísticas, culturales y lúdicas.",
      ],
    },
    recursos: buildRecursos("CE.CI.0.21"),
  },
  {
    codigo: "CE.CI.0.22",
    descripcion: "Expresar creativamente ideas, emociones y vivencias mediante técnicas grafoplásticas y diversos materiales artísticos.",
    competenciasClave: ["CC", "CCICC", "CMCT", "CD", "CSE", "CECA"],
    indicadores34: [
    { codigo: "I.CI.0.22.24", texto: "Comunica sus ideas sobre producciones artística propias" },
    { codigo: "I.CI.0.22.25", texto: "Explora materiales y técnicas grafoplásticas" },
    { codigo: "I.CI.0.22.26", texto: "Manipula libremente masas, pinturas, papeles, texturas" },
    ],
    indicadores45: [
    { codigo: "I.CI.0.22.23", texto: "Expresa ideas, emociones y vivencias mediante el dibujo libre y técnicas grafoplásticas" },
    { codigo: "I.CI.0.22.24", texto: "Comunica sus ideas y opiniones sobre producciones artística propias o de otros relacionadas con la plástica y la escultura" },
    { codigo: "I.CI.0.22.25", texto: "Explora materiales y técnicas grafoplásticas" },
    { codigo: "I.CI.0.22.26", texto: "Muestra creatividad en actividades grafoplásticas" },
    ],
    indicadores56: [
    { codigo: "I.CI.0.22.23", texto: "Expresa ideas, emociones y vivencias mediante el dibujo libre y técnicas grafoplásticas" },
    { codigo: "I.CI.0.22.24", texto: "Comunica sus ideas y opiniones sobre producciones artística propias o de otros relacionadas con la plástica y la escultura" },
    { codigo: "I.CI.0.22.25", texto: "Explora materiales y técnicas grafoplásticas" },
    { codigo: "I.CI.0.22.26", texto: "Muestra creatividad en actividades grafoplásticas" },
    ],
    saberes34: {
      declarativos: [
    "CI.0.3.d.16. Técnicas artísticas: dactilopintura, rasgado/trozado y materiales diversos para la expresión artística.",
      ],
      procedimentales: [
    "CI.0.3.p.21. Experimentar la pintura usando los dedos, manos o estampados.",
    "CI.0.3.p.22. Experimentar actividades grafoplásticas : rasgado, trozado, etc.",
    "CI.0.3.p.23. Practicar actividades artísticas (plastilina, masa, foami, etc).",
      ],
      actitudinales: [
    "CI.0.3.a.12. Disfrutar del contacto sensorial con diferentes materiales artísticos.",
      ],
    },
    saberes45: {
      declarativos: [
    "CI.0.3.d.16. Técnicas grafoplásticas y materiales diversos para la expresión artística.",
      ],
      procedimentales: [
    "CI.0.3.p.21. Representar ideas, opiniones, emociones, vivencias y experiencias a través del dibujo libre.",
    "CI.0.3.p.22. Expresar ideas y opiniones sobre producciones artísticas propias o de otros relacionadas con plástica y la escultura.",
    "CI.0.3.p.23. Aplicar técnicas grafoplásticas con diversos materiales.",
      ],
      actitudinales: [
    "CI.0.3.a.12. Valorar el lenguaje plástico como medio de expresión y comunicación.",
      ],
    },
    saberes56: {
      declarativos: [
    "CI.0.3.d.16. Técnicas grafoplásticas y materiales diversos para la expresión artística.",
      ],
      procedimentales: [
    "CI.0.3.p.21. Representar ideas, opiniones, emociones, vivencias y experiencias a través del dibujo libre.",
    "CI.0.3.p.22. Expresar ideas y opiniones sobre producciones artísticas propias o de otros relacionadas con plástica y la escultura.",
    "CI.0.3.p.23. Aplicar técnicas grafoplásticas con diversos materiales.",
      ],
      actitudinales: [
    "CI.0.3.a.12. Valorar el lenguaje plástico como medio de expresión y comunicación.",
      ],
    },
    recursos: buildRecursos("CE.CI.0.22"),
  },
  {
    codigo: "CE.CI.0.23",
    descripcion: "Reproducir patrones rítmicos y sonidos onomatopéyicos, naturales y artificiales mediante el cuerpo, la voz y objetos para fortalecer la percepción auditiva, coordinación y expresión creativa.",
    competenciasClave: ["CC", "CMCT", "CECA", "CSE"],
    indicadores34: [
    { codigo: "I.CI.0.23.27", texto: "Sigue un ritmo simple con palmas o pies" },
    { codigo: "I.CI.0.23.28", texto: "Reproduce sonidos onomatopéyicos en juegos y actividades lúdicas Identifica sonidos naturales y artificiales del entorno" },
    ],
    indicadores45: [
    { codigo: "I.CI.0.23.27", texto: "Ejecuta patrones rítmicos con el cuerpo, la voz y objetos" },
    { codigo: "I.CI.0.23.28", texto: "Reproduce sonidos onomatopéyicos en juegos y actividades lúdicas" },
    { codigo: "I.CI.0.23.29", texto: "Identificar sonidos naturales y artificiales del entorno" },
    { codigo: "I.CI.0.23.30", texto: "Sigue secuencias sonoras sencillas mediante movimientos corporales, voz u objetos" },
    ],
    indicadores56: [
    { codigo: "I.CI.0.23.27", texto: "Ejecuta patrones rítmicos con el cuerpo, la voz y objetos" },
    { codigo: "I.CI.0.23.28", texto: "Reproduce sonidos onomatopéyicos en juegos y actividades lúdicas" },
    { codigo: "I.CI.0.23.29", texto: "Identificar sonidos naturales y artificiales del entorno" },
    { codigo: "I.CI.0.23.30", texto: "Sigue secuencias sonoras sencillas mediante movimientos corporales, voz u objetos" },
    ],
    saberes34: {
      declarativos: [
    "CI.0.3.d.17. Sonidos onomatopéyicos.",
    "CI.0.3.d.19. Sonidos del entorno (naturales y artificiales).",
      ],
      procedimentales: [
    "CI.0.3.p.24. Acompañar una melodía con palmadas o pies.",
    "CI.0.3.p.25. Imitar sonidos onomatopéyicos en situaciones lúdicas.",
    "CI.0.3.p.27. Imitar sonidos naturales y artificiales.",
      ],
      actitudinales: [
    "CI.0.3.a.13. Disfrutar de actividades rítmicas y sonoras.",
      ],
    },
    saberes45: {
      declarativos: [
    "CI.0.3.d.17. Sonidos onomatopéyicos.",
    "CI.0.3.d.18. Patrones de ritmo y sonoros.",
    "CI.0.3.d.19. Sonidos del entorno (naturales y artificiales).",
      ],
      procedimentales: [
    "CI.0.3.p.24. Ejecutar patrones rítmicos con el cuerpo, la voz y objetos sonoros.",
    "CI.0.3.p.25. Reconocer y reproducir sonidos onomatopéyicos en situaciones lúdicas.",
    "CI.0.3.p.26. Imitar sonidos onomatopéyicos.",
    "CI.0.3.p.27. Diferenciar sonidos naturales de los artificiales.",
      ],
      actitudinales: [
    "CI.0.3.a.13. Disfrutar de actividades rítmicas y sonoras.",
      ],
    },
    saberes56: {
      declarativos: [
    "CI.0.3.d.17. Sonidos onomatopéyicos.",
    "CI.0.3.d.18. Patrones de ritmo y sonoros.",
    "CI.0.3.d.19. Sonidos del entorno (naturales y artificiales).",
      ],
      procedimentales: [
    "CI.0.3.p.24. Ejecutar patrones rítmicos con el cuerpo, la voz y objetos sonoros.",
    "CI.0.3.p.25. Reconocer y reproducir sonidos onomatopéyicos en situaciones lúdicas.",
    "CI.0.3.p.26. Imitar sonidos onomatopéyicos.",
    "CI.0.3.p.27. Diferenciar sonidos naturales de los artificiales.",
      ],
      actitudinales: [
    "CI.0.3.a.13. Disfrutar de actividades rítmicas y sonoras.",
      ],
    },
    recursos: buildRecursos("CE.CI.0.23"),
  },
  {
    codigo: "CE.CI.0.24",
    descripcion: "Construir progresivamente el esquema corporal mediante la identificación de las partes y articulaciones del cuerpo, lado dominante, exploración sensorial, fortaleciendo la identidad, autonomía, y valoración positiva de sí mismo.",
    competenciasClave: ["CC", "CECA", "CSE"],
    indicadores34: [
    { codigo: "I.CI.0.24.31", texto: "Nombra las partes principales del cuerpo en sí mismo y en otros" },
    { codigo: "I.CI.0.24.32", texto: "Representa la figura humana en producciones gráficas (trazos globales) o corporales" },
    { codigo: "I.CI.0.24.34", texto: "Valora positivamente su cuerpo y sus características personales" },
    { codigo: "I.CI.0.24.36", texto: "Explora su cuerpo mediante experiencias sensoriales" },
    ],
    indicadores45: [
    { codigo: "I.CI.0.24.31", texto: "Nombra las partes principales del cuerpo y algunas articulaciones en sí mismo y en otros" },
    { codigo: "I.CI.0.24.32", texto: "Representa la figura humana en producciones gráficas o corporales" },
    { codigo: "I.CI.0.24.33", texto: "Utiliza el lado dominante con mano, ojo y pie" },
    { codigo: "I.CI.0.24.34", texto: "Valora positivamente su cuerpo y sus características personales" },
    { codigo: "I.CI.0.24.35", texto: "Muestra seguridad en actividades corporales" },
    { codigo: "I.CI.0.24.36", texto: "Explora su cuerpo mediante experiencias sensoriales" },
    ],
    indicadores56: [
    { codigo: "I.CI.0.24.31", texto: "Nombra las partes principales del cuerpo y algunas articulaciones en sí mismo y en otros" },
    { codigo: "I.CI.0.24.32", texto: "Representa la figura humana en producciones gráficas o corporales" },
    { codigo: "I.CI.0.24.33", texto: "Utiliza el lado dominante con mano, ojo y pie" },
    { codigo: "I.CI.0.24.34", texto: "Valora positivamente su cuerpo y sus características personales" },
    { codigo: "I.CI.0.24.35", texto: "Muestra seguridad en actividades corporales" },
    { codigo: "I.CI.0.24.36", texto: "Explora su cuerpo mediante experiencias sensoriales" },
    ],
    saberes34: {
      declarativos: [
    "CI.0.3.d.26. Partes gruesas del cuerpo y de la cara.",
    "CI.0.3.d.331. Figura humana.",
      ],
      procedimentales: [
    "CI.0.3.p.39. Identificar las partes del cuerpo mediante experiencias corporales y sensoriales.",
    "CI.0.3.p.40. Representar la figura humana de forma sencilla mediante el trazos globales, pintura y modelado.",
      ],
      actitudinales: [
    "CI.0.3.a.19. Mostrar agrado por su cuerpo y destrezas corporales.",
    "CI.0.3.a.20. Mostrar autonomía progresiva y confianza en actividades corporales.",
    "CI.0.3.a.21. Respetar el cuerpo propio y el de los demás.",
      ],
    },
    saberes45: {
      declarativos: [
    "CI.0.3.d.26. Esquema corporal.",
    "CI.0.3.d.27. Articulaciones básicas del cuerpo.",
    "CI.0.3.d.28. Lado dominante.",
    "CI.0.3.d.30. Características personales.",
    "CI.0.3.d.331. Representación de la figura humana.",
      ],
      procedimentales: [
    "CI.0.3.p.39. Identificar las partes del cuerpo y articulaciones mediante experiencias corporales y sensoriales.",
    "CI.0.3.p.40. Representar la figura humana mediante diferentes lenguajes expresivos.",
    "CI.0.3.p.41. Utilizar progresivamente el lado dominante en actividades manipulativas y motrices.",
    "CI.0.3.p.42. Reconocer las posibilidades de movimiento de las diferentes partes del cuerpo mediante juegos corporales.",
    "CI.0.3.p.43. Reconocer sensaciones corporales mediante experiencias táctiles, de movimiento y percepción.",
      ],
      actitudinales: [
    "CI.0.3.a.19. Valorar positivamente el cuerpo y características personales.",
    "CI.0.3.a.20. Mostrar autonomía y confianza en actividades corporales.",
    "CI.0.3.a.21. Respetar el cuerpo propio y el de los demás.",
      ],
    },
    saberes56: {
      declarativos: [
    "CI.0.3.d.26. Esquema corporal.",
    "CI.0.3.d.27. Articulaciones básicas del cuerpo.",
    "CI.0.3.d.28. Lado dominante.",
    "CI.0.3.d.30. Características personales.",
    "CI.0.3.d.331. Representación de la figura humana.",
      ],
      procedimentales: [
    "CI.0.3.p.39. Identificar las partes del cuerpo y articulaciones mediante experiencias corporales y sensoriales.",
    "CI.0.3.p.40. Representar la figura humana mediante diferentes lenguajes expresivos.",
    "CI.0.3.p.41. Utilizar progresivamente el lado dominante en actividades manipulativas y motrices.",
    "CI.0.3.p.42. Reconocer las posibilidades de movimiento de las diferentes partes del cuerpo mediante juegos corporales.",
    "CI.0.3.p.43. Reconocer sensaciones corporales mediante experiencias táctiles, de movimiento y percepción.",
      ],
      actitudinales: [
    "CI.0.3.a.19. Valorar positivamente el cuerpo y características personales.",
    "CI.0.3.a.20. Mostrar autonomía y confianza en actividades corporales.",
    "CI.0.3.a.21. Respetar el cuerpo propio y el de los demás.",
      ],
    },
    recursos: buildRecursos("CE.CI.0.24"),
  },
  {
    codigo: "CE.CI.0.25",
    descripcion: "Desarrollar progresivamente el control mediante movimientos coordinados, desplazamientos seguros en diferentes espacios fortaleciendo la fuerza, el equilibrio, la coordinación motriz, el control y seguridad en la acción corporal.",
    competenciasClave: ["CC", "CMCT", "CSE", "CECA"],
    indicadores34: [
    { codigo: "I.CI.0.25.37", texto: "Realiza movimientos de locomoción y desplazamiento" },
    { codigo: "I.CI.0.25.38", texto: "Mantiene el equilibrio dinámico" },
    { codigo: "I.CI.0.25.41", texto: "Coordina movimientos gruesos del cuerpo y con objetos" },
    { codigo: "I.CI.0.25.42", texto: "Expresa sentimientos y emociones a través del cuerpo y gestos" },
    { codigo: "I.CI.0.25.43", texto: "Practica desplazamientos seguros en diferentes entornos" },
    ],
    indicadores45: [
    { codigo: "I.CI.0.25.37", texto: "Ejecuta movimientos de locomoción y desplazamiento en diferentes ritmos, velocidades y superficies" },
    { codigo: "I.CI.0.25.38", texto: "Mantiene el equilibrio estático y dinámico en diferentes superficies" },
    { codigo: "I.CI.0.25.39", texto: "Controla la postura en desplazamientos y posiciones corporales" },
    { codigo: "I.CI.0.25.40", texto: "Controla la fuerza y el tono muscular en movimientos corporales" },
    { codigo: "I.CI.0.25.41", texto: "Coordina movimientos gruesas y finas del cuerpo y objetos" },
    { codigo: "I.CI.0.25.42", texto: "Expresa sentimientos y emociones a través del cuerpo y gestos" },
    { codigo: "I.CI.0.25.43", texto: "Practica desplazamientos seguros en diferentes entornos" },
    ],
    indicadores56: [
    { codigo: "I.CI.0.25.37", texto: "Ejecuta movimientos de locomoción y desplazamiento en diferentes ritmos, velocidades y superficies" },
    { codigo: "I.CI.0.25.38", texto: "Mantiene el equilibrio estático y dinámico en diferentes superficies" },
    { codigo: "I.CI.0.25.39", texto: "Controla la postura en desplazamientos y posiciones corporales" },
    { codigo: "I.CI.0.25.40", texto: "Controla la fuerza y el tono muscular en movimientos corporales" },
    { codigo: "I.CI.0.25.41", texto: "Coordina movimientos gruesas y finas del cuerpo y objetos" },
    { codigo: "I.CI.0.25.42", texto: "Expresa sentimientos y emociones a través del cuerpo y gestos" },
    { codigo: "I.CI.0.25.43", texto: "Practica desplazamientos seguros en diferentes entornos" },
    ],
    saberes34: {
      declarativos: [
    "CI.0.3.d.25. Movimientos básicos: correr, caminar, saltar en dos pies.",
    "CI.0.3.d.26. Movimientos y desplazamientos:rodar, gatear, reptar, galopar.",
    "CI.0.3.d.27. Equilibrio dinámico :caminar sobre líneas gruesas sobre el piso.",
    "CI.0.3.d.30. Coordinación motriz gruesa :lanzar una pelota conlas dos manos, subir y bajar gradas.",
      ],
      procedimentales: [
    "CI.0.3.p.33. Realizar desplazamientos variados (caminar, correr, saltar, trepar, reptar y galopar) en diferentes espacios y superficies. Mantener equilibrio dinámico mediante diferentes movimientos corporales: caminar sobre líneas gruesas sobre el piso.",
    "CI.0.3.p.35. Coordinar movimientos gruesos mediante juegos motores con objetos.",
    "CI.0.3.p.36. Mantener equilibrio caminando sobre una cinta trazada.",
    "CI.0.3.p.37. Expresar emociones y experiencias mediante movimientos corporales y gestos. Realizar desplazamientos seguros respetando normas de cuidado personal y del entorno, con apoyo de un adulto.",
      ],
      actitudinales: [
    "CI.0.3.a.17. Disfrutar del juego al aire libre.",
    "CI.0.3.a.18. Mostrar confianza y seguridad durante sencillos retos motrices.",
    "CI.0.3.a.19. Expresar sentimientos y emociones mediante el movimiento corporal.",
    "CI.0.3.a.20. Respetar las posibilidades propias y de los demás durante las actividades motrices.",
    "CI.0.3.a.21. Practicar desplazamientos seguros cuidando de sí mismo y de los demás.",
      ],
    },
    saberes45: {
      declarativos: [
    "CI.0.3.d.25. Fuerza y tono muscular.",
    "CI.0.3.d.26. Movimientos y desplazamientos.",
    "CI.0.3.d.27. Equilibrio estático y dinámico.",
    "CI.0.3.d.28. Control postural.",
    "CI.0.3.d.29. Movimientos segmentados.",
    "CI.0.3.d.30. Coordinación motriz gruesa y fina.",
      ],
      procedimentales: [
    "CI.0.3.p.33. Realizar desplazamientos variados (caminar, correr, saltar, trepar, reptar y galopar) en diferentes espacios y superficies.",
    "CI.0.3.p.34. Mantener equilibrio estático y dinámico durante diferentes movimientos corporales.",
    "CI.0.3.p.35. Coordinar movimientos gruesos y finos mediante juegos motores con objetos.",
    "CI.0.3.p.36. Controlar fuerza, postura y tono muscular durante actividades corporales.",
    "CI.0.3.p.37. Expresar emociones y experiencias mediante movimientos corporales y gestos.",
    "CI.0.3.p.38. Realizar desplazamientos seguros respetando normas de cuidado personal y del entorno.",
      ],
      actitudinales: [
    "CI.0.3.a.17. Disfrutar del movimiento y la actividad física.",
    "CI.0.3.a.18. Mostrar confianza y seguridad durante las actividades motrices.",
    "CI.0.3.a.19. Expresar sentimientos y emociones mediante el movimiento corporal.",
    "CI.0.3.a.20. Respetar las posibilidades propias y de los demás durante las actividades motrices.",
    "CI.0.3.a.21. Practicar desplazamientos seguros cuidando de sí mismo y de los demás.",
      ],
    },
    saberes56: {
      declarativos: [
    "CI.0.3.d.25. Fuerza y tono muscular.",
    "CI.0.3.d.26. Movimientos y desplazamientos.",
    "CI.0.3.d.27. Equilibrio estático y dinámico.",
    "CI.0.3.d.28. Control postural.",
    "CI.0.3.d.29. Movimientos segmentados.",
    "CI.0.3.d.30. Coordinación motriz gruesa y fina.",
      ],
      procedimentales: [
    "CI.0.3.p.33. Realizar desplazamientos variados (caminar, correr, saltar, trepar, reptar y galopar) en diferentes espacios y superficies.",
    "CI.0.3.p.34. Mantener equilibrio estático y dinámico durante diferentes movimientos corporales.",
    "CI.0.3.p.35. Coordinar movimientos gruesos y finos mediante juegos motores con objetos.",
    "CI.0.3.p.36. Controlar fuerza, postura y tono muscular durante actividades corporales.",
    "CI.0.3.p.37. Expresar emociones y experiencias mediante movimientos corporales y gestos.",
    "CI.0.3.p.38. Realizar desplazamientos seguros respetando normas de cuidado personal y del entorno.",
      ],
      actitudinales: [
    "CI.0.3.a.17. Disfrutar del movimiento y la actividad física.",
    "CI.0.3.a.18. Mostrar confianza y seguridad durante las actividades motrices.",
    "CI.0.3.a.19. Expresar sentimientos y emociones mediante el movimiento corporal.",
    "CI.0.3.a.20. Respetar las posibilidades propias y de los demás durante las actividades motrices.",
    "CI.0.3.a.21. Practicar desplazamientos seguros cuidando de sí mismo y de los demás.",
      ],
    },
    recursos: buildRecursos("CE.CI.0.25"),
  },
  {
    codigo: "CE.CI.0.26",
    descripcion: "Coordinar progresivamente los movimientos de ambos lados del cuerpo mediante actividades de bilateralidad, lateralidad y simetría, fortaleciendo la coordinación corporal, la autonomía motriz y la precisión de los movimientos.",
    competenciasClave: ["CMCT", "CSE", "CECA"],
    indicadores34: [
    { codigo: "I.CI.0.26.46", texto: "Ejecuta acciones corporales y manipulativas coordinando ambos lados del cuerpo de forma simultánea. Muestra autonomía progresiva y seguridad en movimientos con ambos lados del cuerpo" },
    ],
    indicadores45: [
    { codigo: "I.CI.0.26.44", texto: "Identifica las partes del cuerpo en relación con los lados derecho e izquierdo en sí mismo" },
    { codigo: "I.CI.0.26.45", texto: "Diferencia los lados derecho e izquierdo en movimientos del cuerpo" },
    { codigo: "I.CI.0.26.46", texto: "Coordina movimientos simétricos utilizando ambos lados del cuerpo" },
    { codigo: "I.CI.0.26.47", texto: "Muestra autonomía y seguridad en movimientos con ambos lados del cuerpo" },
    ],
    indicadores56: [
    { codigo: "I.CI.0.26.44", texto: "Identifica las partes del cuerpo en relación con los lados derecho e izquierdo en sí mismo" },
    { codigo: "I.CI.0.26.45", texto: "Diferencia los lados derecho e izquierdo en movimientos del cuerpo" },
    { codigo: "I.CI.0.26.46", texto: "Coordina movimientos simétricos utilizando ambos lados del cuerpo" },
    { codigo: "I.CI.0.26.47", texto: "Muestra autonomía y seguridad en movimientos con ambos lados del cuerpo" },
    ],
    saberes34: {
      declarativos: [
    "CI.0.3.d.33. Bilateralidad y coordinación (ambos lados).",
      ],
      procedimentales: [
    "CI.0.3.p.40. Ejecutar movimientos diferenciados utilizando el lado derecho e izquierdo del cuerpo. Coordinar acciones bilaterales utilizando objetos durante juegos motores y en actividades cotindianas (Abrir y cerrar recipientes con ambas manos, entre otros).",
      ],
      actitudinales: [
    "CI.0.3.a.22. Mostrar autonomía progresiva y seguridad durante movimientos coordinados. Realizar ejercicios de coordinación con persistencia.",
    "CI.0.3.a.24. Disfrutar actividades que involucren ambos lados del cuerpo.",
      ],
    },
    saberes45: {
      declarativos: [
    "CI.0.3.d.31. Eje de simetría del cuerpo.",
    "CI.0.3.d.32. Lateralidad.",
    "CI.0.3.d.33. Bilateralidad y coordinación (ambos lados).",
      ],
      procedimentales: [
    "CI.0.3.p.39. Identificar las partes semejantes del lado derecho e izquierdo del cuerpo.",
    "CI.0.3.p.40. Ejecutar movimientos diferenciados utilizando el lado derecho e izquierdo del cuerpo.",
    "CI.0.3.p.41. Realizar movimientos simétricos con ambos lados del cuerpo.",
    "CI.0.3.p.42. Coordinar acciones bilaterales utilizando objetos durante juegos motores.",
      ],
      actitudinales: [
    "CI.0.3.a.22. Mostrar autonomía y seguridad durante movimientos coordinados.",
    "CI.0.3.a.23. Perseverar ante retos que impliquen coordinación bilateral.",
    "CI.0.3.a.24. Disfrutar actividades que involucren ambos lados del cuerpo.",
      ],
    },
    saberes56: {
      declarativos: [
    "CI.0.3.d.31. Eje de simetría del cuerpo.",
    "CI.0.3.d.32. Lateralidad.",
    "CI.0.3.d.33. Bilateralidad y coordinación (ambos lados).",
      ],
      procedimentales: [
    "CI.0.3.p.39. Identificar las partes semejantes del lado derecho e izquierdo del cuerpo.",
    "CI.0.3.p.40. Ejecutar movimientos diferenciados utilizando el lado derecho e izquierdo del cuerpo.",
    "CI.0.3.p.41. Realizar movimientos simétricos con ambos lados del cuerpo.",
    "CI.0.3.p.42. Coordinar acciones bilaterales utilizando objetos durante juegos motores.",
      ],
      actitudinales: [
    "CI.0.3.a.22. Mostrar autonomía y seguridad durante movimientos coordinados.",
    "CI.0.3.a.23. Perseverar ante retos que impliquen coordinación bilateral.",
    "CI.0.3.a.24. Disfrutar actividades que involucren ambos lados del cuerpo.",
      ],
    },
    recursos: buildRecursos("CE.CI.0.26"),
  },
  {
    codigo: "CE.CI.0.27",
    descripcion: "Desarrollar progresivamente la orientación espacial y temporal mediante desplazamientos, recorridos y experiencias cotidianas que favorezcan el uso de nociones espaciales y temporales para ubicarse en relación consigo mismo, las personas, los objetos y el entorno.",
    competenciasClave: ["CC", "CMCT", "CSE"],
    indicadores34: [
    { codigo: "I.CI.0.27.48", texto: "Ubica su cuerpo utilizando nociones espaciales básicas (arriba/abajo, sobre/debajo, al lado, junto a, cerca/lejos" },
    { codigo: "I.CI.0.27.49", texto: "Se desplaza siguiendo consignas que implica nociones espaciales (entre, adelante/atrás, junto a, cerca/lejos)" },
    { codigo: "I.CI.0.27.50", texto: "Realiza desplazamientos siguiendo diferentes distancias, direcciones, velocidades y secuencias temporales sencillas" },
    { codigo: "I.CI.0.27.51", texto: "Utiliza nociones temporales básicas (antes, después, hoy, mañana, primero, último) en actividades cotidianas y juegos" },
    ],
    indicadores45: [
    { codigo: "I.CI.0.27.48", texto: "Ubica su cuerpo utilizando nociones espaciales básicas (arriba/abajo, sobre/debajo, al lado, junto a, cerca/lejos" },
    { codigo: "I.CI.0.27.49", texto: "Se desplaza siguiendo consignas que implica nociones espaciales (entre, adelante/atrás, junto a, cerca/lejos)" },
    { codigo: "I.CI.0.27.50", texto: "Realiza desplazamientos siguiendo diferentes distancias, direcciones, velocidades y secuencias temporales sencillas" },
    { codigo: "I.CI.0.27.51", texto: "Utiliza nociones temporales básicas (antes, después, hoy, mañana, primero, último) en actividades cotidianas y juegos" },
    ],
    indicadores56: [
    { codigo: "I.CI.0.27.48", texto: "Ubica su cuerpo utilizando nociones espaciales básicas (arriba/abajo, sobre/debajo, al lado, junto a, cerca/lejos" },
    { codigo: "I.CI.0.27.49", texto: "Se desplaza siguiendo consignas que implica nociones espaciales (entre, adelante/atrás, junto a, cerca/lejos)" },
    { codigo: "I.CI.0.27.50", texto: "Realiza desplazamientos siguiendo diferentes distancias, direcciones, velocidades y secuencias temporales sencillas" },
    { codigo: "I.CI.0.27.51", texto: "Utiliza nociones temporales básicas (antes, después, hoy, mañana, primero, último) en actividades cotidianas y juegos" },
    ],
    saberes34: {
      declarativos: [
    "CI.0.3.d.34. Nociones básicas de orientación espacial (adelante/detrás, cerca/lejos).",
      ],
      procedimentales: [
    "CI.0.3.p.43. Colocar juguetes u objetos \"sobre\" y \"debajo\", siguienendo instrucciones directas.",
    "CI.0.3.p.44. Realizar desplazamientos en el espacio hacia adelante-atrás, siguiendo señales visuales o auditivas en situacioens de juego o cotidianas.",
    "CI.0.3.p.45. Desplazarse utilizando diferentes distancias, direcciones y velocidades. Seguir con su cuerpo huellas o líneas marcadas en el suelo (trayectorias rectas o curvas) en situaciones de juego o situaciones cotidianas.",
    "CI.0.3.p.47. Identificar actividades que se realizan antes o despues de un momento clave del día (ej. lavarse las manos antes de comer, antes de dormir colocarse la pijama).",
      ],
      actitudinales: [
    "CI.0.3.a.26. Disfrutar de dinámicas y juegos de desplazamiento.",
      ],
    },
    saberes45: {
      declarativos: [
    "CI.0.3.d.34. Nociones básicas de orientación espacial y temporal.",
      ],
      procedimentales: [
    "CI.0.3.p.43. Ubicar su cuerpo y objetos utilizando nociones espaciales: arriba-abajo, sobre-debajo, al lado, junto a, cerca-lejos.",
    "CI.0.3.p.44. Realizar desplazamientos en el espacio siguiendo consignas de nociones espaciales: entre, adelante-atrás, junto a, cerca-lejos.",
    "CI.0.3.p.45. Desplazarse utilizando diferentes distancias, direcciones y velocidades.",
    "CI.0.3.p.46. Representar recorridos y trayectorias mediante diferentes lenguajes.",
    "CI.0.3.p.47. Ordenar secuencias temporales sencillas relacionadas con actividades cotidianas.",
      ],
      actitudinales: [
    "CI.0.3.a.25. Valorar las posibilidades de su cuerpo durante desplazamientos.",
    "CI.0.3.a.26. Participar con confianza en juegos de orientación espacial y temporal.",
      ],
    },
    saberes56: {
      declarativos: [
    "CI.0.3.d.34. Nociones básicas de orientación espacial y temporal.",
      ],
      procedimentales: [
    "CI.0.3.p.43. Ubicar su cuerpo y objetos utilizando nociones espaciales: arriba-abajo, sobre-debajo, al lado, junto a, cerca-lejos.",
    "CI.0.3.p.44. Realizar desplazamientos en el espacio siguiendo consignas de nociones espaciales: entre, adelante-atrás, junto a, cerca-lejos.",
    "CI.0.3.p.45. Desplazarse utilizando diferentes distancias, direcciones y velocidades.",
    "CI.0.3.p.46. Representar recorridos y trayectorias mediante diferentes lenguajes.",
    "CI.0.3.p.47. Ordenar secuencias temporales sencillas relacionadas con actividades cotidianas.",
      ],
      actitudinales: [
    "CI.0.3.a.25. Valorar las posibilidades de su cuerpo durante desplazamientos.",
    "CI.0.3.a.26. Participar con confianza en juegos de orientación espacial y temporal.",
      ],
    },
    recursos: buildRecursos("CE.CI.0.27"),
  },
];

export function buscarCompetenciaInicial(codigo: string): CompetenciaInicialCompleta | undefined {
  return COMPETENCIAS_INICIAL.find((c) => c.codigo === codigo);
}
