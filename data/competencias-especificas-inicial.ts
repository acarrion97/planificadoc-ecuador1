/**
 * Catálogo de Competencias Específicas — Currículo Integrado
 * Nivel de Educación Inicial (3-5 años)
 *
 * Fuente: MESOCURRICULUM / 1. Inicial.xlsx
 * Codificación: CE.CI.0.X (Currículo Integrado, subnivel 0 = Inicial)
 *
 * Incluye: indicadores por grado, saberes (declarativos/procedimentales/actitudinales)
 * y sugerencias de recursos/contexto por competencia.
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
  saberes: SaberesInicial;
  recursos: RecursosInicial;
}

function parseIndicadores(raw: string): IndicadorInicial[] {
  if (!raw) return [];
  const parts = raw
    .split(/\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  return parts.map((line) => {
    const codeMatch = line.match(/^(I\.CI\.0\.\d+\.\d+|IC\.0\.\d+\.\d+|Ref\.I\.CI\.0\.\d+\.\d+\.?)\s*/);
    const code = codeMatch ? codeMatch[1].replace(/\.\s*$/, "") : "";
    const texto = line.replace(/^(I\.CI\.0\.\d+\.\d+|IC\.0\.\d+\.\d+|Ref\.I\.CI\.0\.\d+\.\d+\.?)\s*/, "").replace(/\(Ref\.[^)]+\)/g, "").trim();
    return { codigo: code, texto };
  }).filter((i) => i.texto.length > 0);
}

function buildSaberes(codigo: string, desc: string, indTexts: string[]): SaberesInicial {
  const numInd = indTexts.length || 3;
  const descShort = desc.length > 140 ? desc.substring(0, 140) : desc;
  const declarativos: string[] = [];
  const procedimentales: string[] = [];
  const actitudinales: string[] = [];
  for (let i = 0; i < numInd; i++) {
    const idx = i + 1;
    const ind = indTexts[i] || descShort;
    declarativos.push(`${codigo}.d.${idx}. Conocer y comprender ${ind.substring(0, 130).toLowerCase()}`);
    procedimentales.push(`${codigo}.p.${idx}. Aplicar estrategias para ${ind.substring(0, 130).toLowerCase()}`);
    actitudinales.push(`${codigo}.a.${idx}. Valorar la importancia de ${ind.substring(0, 130).toLowerCase()}`);
  }
  return { declarativos, procedimentales, actitudinales };
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

const RAW_INDICADORES_34: Record<string, string> = {
  "CE.CI.0.1": "Identifica algunas características físicas propias mediante la observación, el juego y la interacción con otras personas. Expresa sus datos personales: nombre, edad y reconoce a familiares cercanos en situaciones cotidianas. Representa a su familia en sus diálogos, juegos, dibujos o dramatizaciones y que forma parte de ella. Expresa emociones y gustos mediante gestos, palabras o diferentes formas de expresión en situaciones cotidianas. Participa con seguridad en actividades cotidianas, mostrando aceptación de sí mismo e iniciando relaciones respetuosas con otras personas.",
  "CE.CI.0.2": "Participa en rutinas de higiene, alimentación y orden con acompañamiento del adulto. Elige entre dos opciones sencillas relacionadas con la alimentación, los juegos o la vestimenta cuando se le brinda apoyo. Realiza acciones de cuidado personal como vestirse, desvestirse e ir al baño con apoyo progresivo de un adulto.",
  "CE.CI.0.3": "Reconoce algunas situaciones que pueden representar peligro en el hogar y la escuela con apoyo del adulto. Sigue instrucciones sencillas relacionadas con su seguridad durante las actividades cotidianas y el juego. Participa en acciones básicas de autocuidado al responder a las orientaciones del adulto en situaciones cotidianas. Reconoce a las personas adultas a quienes puede acudir cuando necesita ayuda en el hogar o la escuela.",
  "CE.CI.0.4": "Reconoce normas básicas de convivencia en distintos espacios. Participa en juegos y actividades grupales respetando reglas y acuerdos. Reconoce que las personas son diferentes y participa respetuosamente en actividades con sus compañeros. Expresa acciones de cortesía y colaboración durante la interacción con otras personas.",
  "CE.CI.0.5": "Reconoce profesiones y oficios de las personas de su entorno familiar. Identifica algunas instituciones de la comunidad y los servicios que brindan. Expresa respeto por las actividades que realizan las personas de su familia, escuela y comunidad durante el juego y las actividades cotidianas.",
  "CE.CI.0.6": "Participa en actividades cotidianas siguiendo normas sencillas de convivencia con acompañamiento del adulto. Reconoce algunas señales de tránsito básicas como el pare, el semáforo y el paso peatonal en actividades lúdicas o situaciones cotidianas.",
  "CE.CI.0.7": "Reconoce tradiciones y prácticas socioculturales presentes en su familia y en la escuela. Participa en actividades tradicionales de su entorno.",
  "CE.CI.0.8": "Reconoce algunos elementos representativos de su escuela, comunidad o país en actividades cotidianas. Participa en acciones sencillas para cuidar los espacios, materiales y elementos de su entorno con acompañamiento del adulto.",
  "CE.CI.0.9": "Relaciona las emociones básicas de alegría, tristeza, ira y miedo con eventos cotidianos. Expresa emociones en diferentes contextos. Participa en actividades cotidianas siguiendo normas sencillas de convivencia con apoyo del adulto. Participa en acciones sencillas para tranquilizarse o buscar ayuda cuando experimenta emociones intensas con acompañamiento del adulto.",
  "CE.CI.0.10": "Reconoce seres vivos y elementos no vivos de su entorno. Identifica algunas características observables de animales, plantas y elementos del entorno. Observa cambios sencillos en el crecimiento de plantas y animales mediante experiencias cotidianas con acompañamiento del adulto. Explora elementos del entorno mediante los sentidos.",
  "CE.CI.0.11": "Reconoce medios de transporte de su entorno. Participa en actividades sencillas para cuidar el agua. Colabora en la separación de algunos materiales para reutilizarlos durante actividades de juego.",
  "CE.CI.0.12": "Reconoce patrones sencillos con objetos, sonidos o movimientos de situaciones cotidianas. Reconoce el orden de algunas actividades de su rutina diaria utilizando expresiones como primero y después, con acompañamiento del adulto. Reconoce diferencias entre el día y la noche a partir de experiencias de la vida cotidiana. Reproduce patrones sencillos utilizando objetos, sonidos o movimientos con apoyo del adulto.",
  "CE.CI.0.13": "Explora objetos utilizando nociones espaciales sencillas en relación con su cuerpo y otros objetos. Reconoce diferencias sencillas de tamaño y cantidad entre objetos y personas.",
  "CE.CI.0.14": "Agrupa objetos del entorno considerando un atributo visible, como el color, la forma o el tamaño en situaciones cotidianas. Establece relaciones de cantidad mediante correspondencia y conteo secuencial del 1 al 10, y relación numeral-cantidad hasta el 5. Reconoce la moneda de 1 dólar. Reconoce situaciones sencillas relacionadas con lo que necesita y lo que le gusta durante actividades cotidianas. Intenta nuevamente una actividad con el apoyo y la motivación del adulto cuando encuentra dificultades.",
  "CE.CI.0.15": "Responde a preguntas sencillas sobre imágenes o situaciones. Participa en canciones, rimas, rondas y poemas cortos, repitiendo palabras o frases con interés. Expresa necesidades, emociones y vivencias mediante palabras o frases sencillas con apoyo del adulto. Expresa aceptación o rechazo utilizando palabras, gestos o expresiones respetuosas en situaciones cotidianas.",
  "CE.CI.0.16": "Participa con interés en la escucha de cuentos, canciones, poemas y textos cortos. Identifica personajes, objetos o acciones presentes en los textos escuchados. Expresa palabras, frases o experiencias relacionadas con los textos escuchados.",
  "CE.CI.0.17": "Identifica imágenes, fotografías, pictogramas, etiquetas y signos presentes en su entorno cotidiano. Ordena dos o tres imágenes para representar la secuencia de un cuento con apoyo del adulto.",
  "CE.CI.0.18": "Participa en actividades gráficas utilizando dibujos, trazos y marcas con intención comunicativa. Expresa oralmente el significado de sus dibujos o producciones gráficas. Explora diferentes materiales y para realizar producciones gráficas.",
  "CE.CI.0.19": "Participa en juegos orales con canciones, sonidos, rimas y repeticiones de palabras. Realiza movimientos sencillos de labios, lengua y mejillas durante juegos y canciones.",
  "CE.CI.0.20": "Realiza trazos intencionados explicando verbalmente la idea que elaboró.",
  "CE.CI.0.21": "Participa en juegos sencillos. Entona canciones cortas acompañadas de corporalidad o palmadas en actividades artísticas o juegos tradicionales.",
  "CE.CI.0.22": "Comunica sus ideas sobre producciones artística propias. Explora materiales y técnicas grafoplásticas. Manipula libremente masas, pinturas, papeles, texturas.",
  "CE.CI.0.23": "Sigue un ritmo simple con palmas o pies. Reproduce sonidos onomatopéyicos en juegos y actividades lúdicas. Identifica sonidos naturales y artificiales del entorno.",
  "CE.CI.0.24": "Nombra las partes principales del cuerpo en sí mismo y en otros. Representa la figura humana en producciones gráficas o corporales. Valora positivamente su cuerpo y sus características personales. Explora su cuerpo mediante experiencias sensoriales.",
  "CE.CI.0.25": "Realiza movimientos de locomoción y desplazamiento. Mantiene el equilibrio dinámico. Coordina movimientos gruesos del cuerpo y con objetos. Expresa sentimientos y emociones a través del cuerpo y gestos. Practica desplazamientos seguros en diferentes entornos.",
  "CE.CI.0.26": "Ejecuta acciones corporales y manipulativas coordinando ambos lados del cuerpo de forma simultánea. Muestra autonomía progresiva y seguridad en movimientos con ambos lados del cuerpo.",
  "CE.CI.0.27": "Ubica su cuerpo utilizando nociones espaciales básicas. Se desplaza siguiendo consignas que implica nociones espaciales. Realiza desplazamientos siguiendo diferentes distancias, direcciones, velocidades y secuencias temporales sencillas. Utiliza nociones temporales básicas en actividades cotidianas y juegos.",
};

const RAW_INDICADORES_45: Record<string, string> = {
  "CE.CI.0.1": "Reconoce sus características físicas y las de las personas de su entorno. Expresa sus datos personales: nombres completos, edad, nombres de sus padres y lugar donde vive en situaciones cotidianas. Representa a su familia en sus diálogos, juegos, dibujos o dramatizaciones y que forma parte de ella. Expresa sus emociones, gustos y sentimientos de manera verbal y no verbal en situaciones cotidianas. Muestra aceptación de sí mismo y actitudes de respeto hacia los demás.",
  "CE.CI.0.2": "Practica hábitos de higiene, alimentación y orden con progresiva autonomía. Selecciona entre opciones en actividades cotidianas (alimentación, juegos, vestimenta) según sus preferencias. Realiza acciones de cuidado personal como vestirse, desvestirse e ir al baño con apoyo progresivo de un adulto.",
  "CE.CI.0.3": "Reconoce situaciones de peligro en el entorno cercano: hogar, escuela y calle. Aplica normas básicas de seguridad en actividades cotidianas del hogar, la escuela y el transporte. Demuestra actitudes de autocuidado de manera progresiva al seguir instrucciones en situaciones de peligro. Identifica situaciones que requieren pedir ayuda y los números de emergencia en contextos cotidianos.",
  "CE.CI.0.4": "Reconoce normas básicas de convivencia en distintos espacios. Participa en juegos y actividades grupales respetando reglas y acuerdos. Respeta diferencias individuales entre sus compañeros en actividades cotidianas. Demuestra cortesía, solidaridad y comunicación asertiva al interactuar con sus pares y adultos de su entorno.",
  "CE.CI.0.5": "Reconoce profesiones y oficios de las personas de su entorno familiar. Identifica algunas instituciones de la comunidad y los servicios que brindan. Reconoce la importancia del trabajo de las personas en su familia y comunidad.",
  "CE.CI.0.6": "Aplica normas básicas de convivencia en la familia, el aula y comunidad en actividades lúdicas o cotidianas. Reconoce señales de tránsito básicas en actividades lúdicas o situaciones cotidianas.",
  "CE.CI.0.7": "Reconoce tradiciones y prácticas socioculturales de su localidad. Participa en actividades tradicionales de su entorno.",
  "CE.CI.0.8": "Reconoce símbolos nacionales y elementos representativos de su comunidad y país en actividades cotidianas. Participa en actividades del cuidado del entorno mostrando respeto hacia los demás.",
  "CE.CI.0.9": "Relaciona las emociones básicas de alegría, tristeza, ira y miedo con eventos cotidianos. Expresa emociones en diferentes contextos. Respeta normas básicas de convivencia en actividades cotidianas. Aplica acciones sencillas para regular progresivamente sus emociones con acompañamiento del adulto.",
  "CE.CI.0.10": "Diferencia seres vivos y elementos no vivos de su entorno. Describe características observables de animales, plantas y elementos del entorno. Ordena secuencias sencillas del crecimiento de plantas y animales. Explora elementos del entorno mediante los sentidos.",
  "CE.CI.0.11": "Identifica medios de transporte que favorecen el cuidado del ambiente en situaciones cotidianas. Practica acciones sencillas del cuidado del agua, suelo y espacios naturales en actividades cotidianas. Participa en acciones sencillas de reducción, reutilización y clasificación de materiales.",
  "CE.CI.0.12": "Identifica patrones y secuencias sencillas con objetos, sonidos y movimientos de situaciones cotidianas. Ordena secuencias de actividades cotidianas utilizando nociones temporales básicas. Reconoce las características del día, tarde y noche en situaciones de la vida cotidiana. Construye patrones utilizando objetos del entorno, sonidos y movimientos. Relaciona actividades cotidianas con referencias temporales como días y de la semana.",
  "CE.CI.0.13": "Ubica objetos utilizando nociones espaciales en relación con su cuerpo y otros objetos. Compara relaciones de tamaño, cantidad y medida en objetos y atributos físicos de las personas.",
  "CE.CI.0.14": "Clasifica objetos del entorno según atributos como textura, forma, tamaño, color en situaciones cotidianas. Establece relaciones de cantidad mediante correspondencia y conteo secuencial del 1 al 15, y relación numeral-cantidad hasta el 10. Identifica la moneda y billete de 1 dólar. Diferencia entre deseos y necesidades. Intenta nuevamente resolver una actividad después de cometer un error.",
  "CE.CI.0.15": "Participa en conversaciones e interacciones cotidianas, utilizando palabras y frases para describir objetos, imágenes o situaciones. Reproduce rimas, retahílas, trabalenguas sencillos, adivinanzas, rondas, canciones y poemas cortos con interés. Expresa ideas, vivencias, necesidades y emociones mediante oraciones cortas y coherentes. Expresa aceptación o rechazo en situaciones cotidianas de manera respetuosa.",
  "CE.CI.0.16": "Participa con interés en actividades de lectura compartida. Responde preguntas sencillas sobre textos escuchados. Relata hechos de cuentos con apoyo, manteniendo una secuencia narrativa básica. Expresa comentarios, opiniones o experiencias relacionadas con los textos escuchados.",
  "CE.CI.0.17": "Reconoce etiquetas, signos, rótulos, imágenes y portadas de uso cotidiano. Narra cuentos, historietas, leyendas tradicionales a partir de imágenes, manteniendo una secuencia lógica de los hechos.",
  "CE.CI.0.18": "Participa en la creación de cuentos colectivos. Comunica ideas mediante dibujos y escritura no convencionales (propio código). Explora el lenguaje escrito en actividades lúdicas.",
  "CE.CI.0.19": "Practica motricidad bucofacial con labios, lengua y mandíbulas. Pronuncia palabras con fonemas de difícil articulación. Reconoce rimas y sonidos iniciales o finales en palabras sencillas durante actividades lúdicas. Participa en juegos de rimas y palabras.",
  "CE.CI.0.20": "Comunica ideas y experiencias mediante gráficos, trazos, símbolos o formas similares a letras.",
  "CE.CI.0.21": "Participa en dramatizaciones y juegos de roles. Participa en juegos tradicionales y manifestaciones culturales reconociendo normas básicas de interacción y colaboración. Entona canciones con ritmo y movimientos corporales. Muestra creatividad en actividades artísticas y culturales.",
  "CE.CI.0.22": "Expresa ideas, emociones y vivencias mediante el dibujo libre y técnicas grafoplásticas. Comunica sus ideas y opiniones sobre producciones artística propias o de otros relacionadas con la plástica y la escultura. Explora materiales y técnicas grafoplásticas. Muestra creatividad en actividades grafoplásticas.",
  "CE.CI.0.23": "Ejecuta patrones rítmicos con el cuerpo, la voz y objetos. Reproduce sonidos onomatopéyicos en juegos y actividades lúdicas. Identificar sonidos naturales y artificiales del entorno. Sigue secuencias sonoras sencillas mediante movimientos corporales, voz u objetos.",
  "CE.CI.0.24": "Nombra las partes principales del cuerpo y algunas articulaciones en sí mismo y en otros. Representa la figura humana en producciones gráficas o corporales. Utiliza el lado dominante con mano, ojo y pie. Valora positivamente su cuerpo y sus características personales. Muestra seguridad en actividades corporales. Explora su cuerpo mediante experiencias sensoriales.",
  "CE.CI.0.25": "Ejecuta movimientos de locomoción y desplazamiento en diferentes ritmos, velocidades y superficies. Mantiene el equilibrio estático y dinámico en diferentes superficies. Controla la postura en desplazamientos y posiciones corporales. Controla la fuerza y el tono muscular en movimientos corporales. Coordina movimientos gruesas y finas del cuerpo y objetos. Expresa sentimientos y emociones a través del cuerpo y gestos. Practica desplazamientos seguros en diferentes entornos.",
  "CE.CI.0.26": "Identifica las partes del cuerpo en relación con los lados derecho e izquierdo en sí mismo. Diferencia los lados derecho e izquierdo en movimientos del cuerpo. Coordina movimientos simétricos utilizando ambos lados del cuerpo. Muestra autonomía y seguridad en movimientos con ambos lados del cuerpo.",
  "CE.CI.0.27": "Ubica su cuerpo utilizando nociones espaciales básicas. Se desplaza siguiendo consignas que implica nociones espaciales. Realiza desplazamientos siguiendo diferentes distancias, direcciones, velocidades y secuencias temporales sencillas. Utiliza nociones temporales básicas en actividades cotidianas y juegos.",
};

export const COMPETENCIAS_INICIAL: CompetenciaInicialCompleta[] = [
  {
    codigo: "CE.CI.0.1",
    descripcion: "Reconocer las características físicas, emociones, gustos y pertenencia familiar en situaciones cotidianas para fortalecer su identidad personal.",
    competenciasClave: ["CC", "CSE", "CCICC", "CIT", "CECA"],
    indicadores34: parseIndicadores(RAW_INDICADORES_34["CE.CI.0.1"]),
    indicadores45: parseIndicadores(RAW_INDICADORES_45["CE.CI.0.1"]),
    indicadores56: parseIndicadores(RAW_INDICADORES_45["CE.CI.0.1"]),
    saberes: buildSaberes("CE.CI.0.1", "Reconocer las características físicas, emociones, gustos y pertenencia familiar en situaciones cotidianas para fortalecer su identidad personal.", parseIndicadores(RAW_INDICADORES_34["CE.CI.0.1"]).map((i) => i.texto)),
    recursos: buildRecursos("CE.CI.0.1"),
  },
  {
    codigo: "CE.CI.0.2",
    descripcion: "Desarrollar progresivamente la autonomía mediante la práctica de hábitos cotidianos para fortalecer la autoestima y confianza en sí mismo.",
    competenciasClave: ["CC", "CMCT", "CIT", "CCICC", "CSE", "CECA"],
    indicadores34: parseIndicadores(RAW_INDICADORES_34["CE.CI.0.2"]),
    indicadores45: parseIndicadores(RAW_INDICADORES_45["CE.CI.0.2"]),
    indicadores56: parseIndicadores(RAW_INDICADORES_45["CE.CI.0.2"]),
    saberes: buildSaberes("CE.CI.0.2", "Desarrollar progresivamente la autonomía mediante la práctica de hábitos cotidianos para fortalecer la autoestima y confianza en sí mismo.", parseIndicadores(RAW_INDICADORES_34["CE.CI.0.2"]).map((i) => i.texto)),
    recursos: buildRecursos("CE.CI.0.2"),
  },
  {
    codigo: "CE.CI.0.3",
    descripcion: "Aplicar normas básicas de seguridad en el hogar, en la escuela y en la calle, en situaciones cotidianas, para evitar accidentes y fortalecer la autonomía y autocuidado de manera progresiva.",
    competenciasClave: ["CCICC", "CIT", "CC", "CSE"],
    indicadores34: parseIndicadores(RAW_INDICADORES_34["CE.CI.0.3"]),
    indicadores45: parseIndicadores(RAW_INDICADORES_45["CE.CI.0.3"]),
    indicadores56: parseIndicadores(RAW_INDICADORES_45["CE.CI.0.3"]),
    saberes: buildSaberes("CE.CI.0.3", "Aplicar normas básicas de seguridad en el hogar, en la escuela y en la calle, en situaciones cotidianas, para evitar accidentes y fortalecer la autonomía y autocuidado de manera progresiva.", parseIndicadores(RAW_INDICADORES_34["CE.CI.0.3"]).map((i) => i.texto)),
    recursos: buildRecursos("CE.CI.0.3"),
  },
  {
    codigo: "CE.CI.0.4",
    descripcion: "Interactuar con otros, mostrando actitudes de solidaridad, el respeto y la empatía ante las diferencias individuales, para favorecer la convivencia armónica en su entorno.",
    competenciasClave: ["CSE", "CC", "CIT", "CCICC"],
    indicadores34: parseIndicadores(RAW_INDICADORES_34["CE.CI.0.4"]),
    indicadores45: parseIndicadores(RAW_INDICADORES_45["CE.CI.0.4"]),
    indicadores56: parseIndicadores(RAW_INDICADORES_45["CE.CI.0.4"]),
    saberes: buildSaberes("CE.CI.0.4", "Interactuar con otros, mostrando actitudes de solidaridad, el respeto y la empatía ante las diferencias individuales, para favorecer la convivencia armónica en su entorno.", parseIndicadores(RAW_INDICADORES_34["CE.CI.0.4"]).map((i) => i.texto)),
    recursos: buildRecursos("CE.CI.0.4"),
  },
  {
    codigo: "CE.CI.0.5",
    descripcion: "Valorar los roles y actividades que realizan las personas del entorno familiar, escolar y comunitario, así como los servicios que brindan algunas instituciones, con respeto, para conocer su importancia en la vida cotidiana.",
    competenciasClave: ["CC", "CCICC", "CD", "CIT", "CSE"],
    indicadores34: parseIndicadores(RAW_INDICADORES_34["CE.CI.0.5"]),
    indicadores45: parseIndicadores(RAW_INDICADORES_45["CE.CI.0.5"]),
    indicadores56: parseIndicadores(RAW_INDICADORES_45["CE.CI.0.5"]),
    saberes: buildSaberes("CE.CI.0.5", "Valorar los roles y actividades que realizan las personas del entorno familiar, escolar y comunitario, así como los servicios que brindan algunas instituciones, con respeto, para conocer su importancia en la vida cotidiana.", parseIndicadores(RAW_INDICADORES_34["CE.CI.0.5"]).map((i) => i.texto)),
    recursos: buildRecursos("CE.CI.0.5"),
  },
  {
    codigo: "CE.CI.0.6",
    descripcion: "Aplicar normas básicas de convivencia y seguridad vial, para relacionarse de manera respetuosa y segura en los diferentes espacios de su entorno.",
    competenciasClave: ["CC", "CCICC", "CIT", "CSE"],
    indicadores34: parseIndicadores(RAW_INDICADORES_34["CE.CI.0.6"]),
    indicadores45: parseIndicadores(RAW_INDICADORES_45["CE.CI.0.6"]),
    indicadores56: parseIndicadores(RAW_INDICADORES_45["CE.CI.0.6"]),
    saberes: buildSaberes("CE.CI.0.6", "Aplicar normas básicas de convivencia y seguridad vial, para relacionarse de manera respetuosa y segura en los diferentes espacios de su entorno.", parseIndicadores(RAW_INDICADORES_34["CE.CI.0.6"]).map((i) => i.texto)),
    recursos: buildRecursos("CE.CI.0.6"),
  },
  {
    codigo: "CE.CI.0.7",
    descripcion: "Participar en manifestaciones culturales de su contexto, a través del descubrimiento, la participación y disfrute de las prácticas tradicionales, para fortalecer su identidad y sentido de pertenencia a su familia y comunidad.",
    competenciasClave: ["CSE", "CECA", "CIT", "CCICC", "CC"],
    indicadores34: parseIndicadores(RAW_INDICADORES_34["CE.CI.0.7"]),
    indicadores45: parseIndicadores(RAW_INDICADORES_45["CE.CI.0.7"]),
    indicadores56: parseIndicadores(RAW_INDICADORES_45["CE.CI.0.7"]),
    saberes: buildSaberes("CE.CI.0.7", "Participar en manifestaciones culturales de su contexto, a través del descubrimiento, la participación y disfrute de las prácticas tradicionales, para fortalecer su identidad y sentido de pertenencia a su familia y comunidad.", parseIndicadores(RAW_INDICADORES_34["CE.CI.0.7"]).map((i) => i.texto)),
    recursos: buildRecursos("CE.CI.0.7"),
  },
  {
    codigo: "CE.CI.0.8",
    descripcion: "Demostrar sentido de pertenencia hacia la comunidad y país mediante el reconocimiento de símbolos representativos y la participación en acciones de cuidado del entorno.",
    competenciasClave: ["CIT", "CECA", "CCICC", "CMCT", "CC"],
    indicadores34: parseIndicadores(RAW_INDICADORES_34["CE.CI.0.8"]),
    indicadores45: parseIndicadores(RAW_INDICADORES_45["CE.CI.0.8"]),
    indicadores56: parseIndicadores(RAW_INDICADORES_45["CE.CI.0.8"]),
    saberes: buildSaberes("CE.CI.0.8", "Demostrar sentido de pertenencia hacia la comunidad y país mediante el reconocimiento de símbolos representativos y la participación en acciones de cuidado del entorno.", parseIndicadores(RAW_INDICADORES_34["CE.CI.0.8"]).map((i) => i.texto)),
    recursos: buildRecursos("CE.CI.0.8"),
  },
  {
    codigo: "CE.CI.0.9",
    descripcion: "Expresar emociones básicas en situaciones cotidianas mediante interacciones respetuosas y la regulación progresiva de sus emociones con acompañamiento de un adulto, para favorecer el bienestar y la convivencia en el entorno familiar y escolar.",
    competenciasClave: ["CC", "CCICC", "CIT", "CSE"],
    indicadores34: parseIndicadores(RAW_INDICADORES_34["CE.CI.0.9"]),
    indicadores45: parseIndicadores(RAW_INDICADORES_45["CE.CI.0.9"]),
    indicadores56: parseIndicadores(RAW_INDICADORES_45["CE.CI.0.9"]),
    saberes: buildSaberes("CE.CI.0.9", "Expresar emociones básicas en situaciones cotidianas mediante interacciones respetuosas y la regulación progresiva de sus emociones con acompañamiento de un adulto, para favorecer el bienestar y la convivencia en el entorno familiar y escolar.", parseIndicadores(RAW_INDICADORES_34["CE.CI.0.9"]).map((i) => i.texto)),
    recursos: buildRecursos("CE.CI.0.9"),
  },
  {
    codigo: "CE.CI.0.10",
    descripcion: "Explorar características y elementos del mundo natural mediante los sentidos y experiencias sencillas, para favorecer la curiosidad, el descubrimiento progresivo y el cuidado de su entorno con apoyo del adulto.",
    competenciasClave: ["CSE", "CC", "CIT"],
    indicadores34: parseIndicadores(RAW_INDICADORES_34["CE.CI.0.10"]),
    indicadores45: parseIndicadores(RAW_INDICADORES_45["CE.CI.0.10"]),
    indicadores56: parseIndicadores(RAW_INDICADORES_45["CE.CI.0.10"]),
    saberes: buildSaberes("CE.CI.0.10", "Explorar características y elementos del mundo natural mediante los sentidos y experiencias sencillas, para favorecer la curiosidad, el descubrimiento progresivo y el cuidado de su entorno con apoyo del adulto.", parseIndicadores(RAW_INDICADORES_34["CE.CI.0.10"]).map((i) => i.texto)),
    recursos: buildRecursos("CE.CI.0.10"),
  },
  {
    codigo: "CE.CI.0.11",
    descripcion: "Participar en acciones sencillas de cuidado y conservación de los espacios naturales y cotidianos, reconociendo la importancia de mantener ambientes limpios y saludables con acompañamiento del adulto.",
    competenciasClave: ["CIT", "CC", "CMCT", "CSE"],
    indicadores34: parseIndicadores(RAW_INDICADORES_34["CE.CI.0.11"]),
    indicadores45: parseIndicadores(RAW_INDICADORES_45["CE.CI.0.11"]),
    indicadores56: parseIndicadores(RAW_INDICADORES_45["CE.CI.0.11"]),
    saberes: buildSaberes("CE.CI.0.11", "Participar en acciones sencillas de cuidado y conservación de los espacios naturales y cotidianos, reconociendo la importancia de mantener ambientes limpios y saludables con acompañamiento del adulto.", parseIndicadores(RAW_INDICADORES_34["CE.CI.0.11"]).map((i) => i.texto)),
    recursos: buildRecursos("CE.CI.0.11"),
  },
  {
    codigo: "CE.CI.0.12",
    descripcion: "Construir patrones, secuencias y nociones básicas de tiempo en juegos y situaciones cotidianas para establecer y organizar sus experiencias con apoyo del adulto.",
    competenciasClave: ["CC", "CMCT", "CSE", "CECA", "CIT"],
    indicadores34: parseIndicadores(RAW_INDICADORES_34["CE.CI.0.12"]),
    indicadores45: parseIndicadores(RAW_INDICADORES_45["CE.CI.0.12"]),
    indicadores56: parseIndicadores(RAW_INDICADORES_45["CE.CI.0.12"]),
    saberes: buildSaberes("CE.CI.0.12", "Construir patrones, secuencias y nociones básicas de tiempo en juegos y situaciones cotidianas para establecer y organizar sus experiencias con apoyo del adulto.", parseIndicadores(RAW_INDICADORES_34["CE.CI.0.12"]).map((i) => i.texto)),
    recursos: buildRecursos("CE.CI.0.12"),
  },
  {
    codigo: "CE.CI.0.13",
    descripcion: "Relacionar objetos del entorno mediante nociones espaciales, de tamaño, cantidad y medida a través de la manipulación y el juego.",
    competenciasClave: ["CSE", "CECA", "CIT", "CCICC", "CMCT", "CD"],
    indicadores34: parseIndicadores(RAW_INDICADORES_34["CE.CI.0.13"]),
    indicadores45: parseIndicadores(RAW_INDICADORES_45["CE.CI.0.13"]),
    indicadores56: parseIndicadores(RAW_INDICADORES_45["CE.CI.0.13"]),
    saberes: buildSaberes("CE.CI.0.13", "Relacionar objetos del entorno mediante nociones espaciales, de tamaño, cantidad y medida a través de la manipulación y el juego.", parseIndicadores(RAW_INDICADORES_34["CE.CI.0.13"]).map((i) => i.texto)),
    recursos: buildRecursos("CE.CI.0.13"),
  },
  {
    codigo: "CE.CI.0.14",
    descripcion: "Clasificar objetos del entorno mediante sus características, el conteo, la correspondencia y situaciones cotidianas de uso responsable de los recursos, para desarrollar el pensamiento lógico-matemático inicial.",
    competenciasClave: ["CC", "CMCT", "CD", "CIT", "CSE", "CECA"],
    indicadores34: parseIndicadores(RAW_INDICADORES_34["CE.CI.0.14"]),
    indicadores45: parseIndicadores(RAW_INDICADORES_45["CE.CI.0.14"]),
    indicadores56: parseIndicadores(RAW_INDICADORES_45["CE.CI.0.14"]),
    saberes: buildSaberes("CE.CI.0.14", "Clasificar objetos del entorno mediante sus características, el conteo, la correspondencia y situaciones cotidianas de uso responsable de los recursos, para desarrollar el pensamiento lógico-matemático inicial.", parseIndicadores(RAW_INDICADORES_34["CE.CI.0.14"]).map((i) => i.texto)),
    recursos: buildRecursos("CE.CI.0.14"),
  },
  {
    codigo: "CE.CI.0.15",
    descripcion: "Expresar necesidades, emociones, intenciones y vivencias, mediante la exploración y uso del lenguaje oral para interactuar en diferentes situaciones y contextos.",
    competenciasClave: ["CSE", "CECA", "CIT", "CMCT", "CD", "CC"],
    indicadores34: parseIndicadores(RAW_INDICADORES_34["CE.CI.0.15"]),
    indicadores45: parseIndicadores(RAW_INDICADORES_45["CE.CI.0.15"]),
    indicadores56: parseIndicadores(RAW_INDICADORES_45["CE.CI.0.15"]),
    saberes: buildSaberes("CE.CI.0.15", "Expresar necesidades, emociones, intenciones y vivencias, mediante la exploración y uso del lenguaje oral para interactuar en diferentes situaciones y contextos.", parseIndicadores(RAW_INDICADORES_34["CE.CI.0.15"]).map((i) => i.texto)),
    recursos: buildRecursos("CE.CI.0.15"),
  },
  {
    codigo: "CE.CI.0.16",
    descripcion: "Participar en actividades individuales y colectivas relacionadas con textos literarios y no literarios para comprender, relatar e intercambiar ideas con interés y disfrute.",
    competenciasClave: ["SSE", "CECA", "CD", "CCICC", "CC"],
    indicadores34: parseIndicadores(RAW_INDICADORES_34["CE.CI.0.16"]),
    indicadores45: parseIndicadores(RAW_INDICADORES_45["CE.CI.0.16"]),
    indicadores56: parseIndicadores(RAW_INDICADORES_45["CE.CI.0.16"]),
    saberes: buildSaberes("CE.CI.0.16", "Participar en actividades individuales y colectivas relacionadas con textos literarios y no literarios para comprender, relatar e intercambiar ideas con interés y disfrute.", parseIndicadores(RAW_INDICADORES_34["CE.CI.0.16"]).map((i) => i.texto)),
    recursos: buildRecursos("CE.CI.0.16"),
  },
  {
    codigo: "CE.CI.0.17",
    descripcion: "Interpretar imágenes, signos, mensajes, textos y representaciones a partir de experiencias cotidianas para su comprensión.",
    competenciasClave: ["CC", "CSE", "CMCT", "CCICC", "CD", "CIT"],
    indicadores34: parseIndicadores(RAW_INDICADORES_34["CE.CI.0.17"]),
    indicadores45: parseIndicadores(RAW_INDICADORES_45["CE.CI.0.17"]),
    indicadores56: parseIndicadores(RAW_INDICADORES_45["CE.CI.0.17"]),
    saberes: buildSaberes("CE.CI.0.17", "Interpretar imágenes, signos, mensajes, textos y representaciones a partir de experiencias cotidianas para su comprensión.", parseIndicadores(RAW_INDICADORES_34["CE.CI.0.17"]).map((i) => i.texto)),
    recursos: buildRecursos("CE.CI.0.17"),
  },
  {
    codigo: "CE.CI.0.18",
    descripcion: "Participar en actividades de producción de textos mediante dibujos y escritura no convencional, para comunicar ideas en situaciones cotidianas.",
    competenciasClave: ["CC", "CMCT", "CIT", "CCICC", "CSE"],
    indicadores34: parseIndicadores(RAW_INDICADORES_34["CE.CI.0.18"]),
    indicadores45: parseIndicadores(RAW_INDICADORES_45["CE.CI.0.18"]),
    indicadores56: parseIndicadores(RAW_INDICADORES_45["CE.CI.0.18"]),
    saberes: buildSaberes("CE.CI.0.18", "Participar en actividades de producción de textos mediante dibujos y escritura no convencional, para comunicar ideas en situaciones cotidianas.", parseIndicadores(RAW_INDICADORES_34["CE.CI.0.18"]).map((i) => i.texto)),
    recursos: buildRecursos("CE.CI.0.18"),
  },
  {
    codigo: "CE.CI.0.19",
    descripcion: "Participar en juegos de lenguaje mediante sonidos, rimas y palabras para fortalecer la expresión oral.",
    competenciasClave: ["CC", "CECA", "CSE", "CIT", "CD", "CCICC"],
    indicadores34: parseIndicadores(RAW_INDICADORES_34["CE.CI.0.19"]),
    indicadores45: parseIndicadores(RAW_INDICADORES_45["CE.CI.0.19"]),
    indicadores56: parseIndicadores(RAW_INDICADORES_45["CE.CI.0.19"]),
    saberes: buildSaberes("CE.CI.0.19", "Participar en juegos de lenguaje mediante sonidos, rimas y palabras para fortalecer la expresión oral.", parseIndicadores(RAW_INDICADORES_34["CE.CI.0.19"]).map((i) => i.texto)),
    recursos: buildRecursos("CE.CI.0.19"),
  },
  {
    codigo: "CE.CI.0.20",
    descripcion: "Producir mensajes mediante el lenguaje gráfico y escrito (propios códigos) para comunicar ideas, necesidades y experiencias en situaciones cotidianas.",
    competenciasClave: ["CC", "CMCT", "CCICC", "CIT", "CSE"],
    indicadores34: parseIndicadores(RAW_INDICADORES_34["CE.CI.0.20"]),
    indicadores45: parseIndicadores(RAW_INDICADORES_45["CE.CI.0.20"]),
    indicadores56: parseIndicadores(RAW_INDICADORES_45["CE.CI.0.20"]),
    saberes: buildSaberes("CE.CI.0.20", "Producir mensajes mediante el lenguaje gráfico y escrito (propios códigos) para comunicar ideas, necesidades y experiencias en situaciones cotidianas.", parseIndicadores(RAW_INDICADORES_34["CE.CI.0.20"]).map((i) => i.texto)),
    recursos: buildRecursos("CE.CI.0.20"),
  },
  {
    codigo: "CE.CI.0.21",
    descripcion: "Participar en actividades artísticas individuales y colectivas mediante dramatizaciones, música, danzas y juegos para favorecer la creatividad y el disfrute.",
    competenciasClave: ["CC", "CECA", "CD", "CIT", "CSE", "CCICC"],
    indicadores34: parseIndicadores(RAW_INDICADORES_34["CE.CI.0.21"]),
    indicadores45: parseIndicadores(RAW_INDICADORES_45["CE.CI.0.21"]),
    indicadores56: parseIndicadores(RAW_INDICADORES_45["CE.CI.0.21"]),
    saberes: buildSaberes("CE.CI.0.21", "Participar en actividades artísticas individuales y colectivas mediante dramatizaciones, música, danzas y juegos para favorecer la creatividad y el disfrute.", parseIndicadores(RAW_INDICADORES_34["CE.CI.0.21"]).map((i) => i.texto)),
    recursos: buildRecursos("CE.CI.0.21"),
  },
  {
    codigo: "CE.CI.0.22",
    descripcion: "Expresar creativamente ideas, emociones y vivencias mediante técnicas grafoplásticas y diversos materiales artísticos.",
    competenciasClave: ["CC", "CCICC", "CMCT", "CD", "CSE", "CECA"],
    indicadores34: parseIndicadores(RAW_INDICADORES_34["CE.CI.0.22"]),
    indicadores45: parseIndicadores(RAW_INDICADORES_45["CE.CI.0.22"]),
    indicadores56: parseIndicadores(RAW_INDICADORES_45["CE.CI.0.22"]),
    saberes: buildSaberes("CE.CI.0.22", "Expresar creativamente ideas, emociones y vivencias mediante técnicas grafoplásticas y diversos materiales artísticos.", parseIndicadores(RAW_INDICADORES_34["CE.CI.0.22"]).map((i) => i.texto)),
    recursos: buildRecursos("CE.CI.0.22"),
  },
  {
    codigo: "CE.CI.0.23",
    descripcion: "Reproducir patrones rítmicos y sonidos onomatopéyicos, naturales y artificiales mediante el cuerpo, la voz y objetos para fortalecer la percepción auditiva, coordinación y expresión creativa.",
    competenciasClave: ["CC", "CMCT", "CECA", "CSE"],
    indicadores34: parseIndicadores(RAW_INDICADORES_34["CE.CI.0.23"]),
    indicadores45: parseIndicadores(RAW_INDICADORES_45["CE.CI.0.23"]),
    indicadores56: parseIndicadores(RAW_INDICADORES_45["CE.CI.0.23"]),
    saberes: buildSaberes("CE.CI.0.23", "Reproducir patrones rítmicos y sonidos onomatopéyicos, naturales y artificiales mediante el cuerpo, la voz y objetos para fortalecer la percepción auditiva, coordinación y expresión creativa.", parseIndicadores(RAW_INDICADORES_34["CE.CI.0.23"]).map((i) => i.texto)),
    recursos: buildRecursos("CE.CI.0.23"),
  },
  {
    codigo: "CE.CI.0.24",
    descripcion: "Construir progresivamente el esquema corporal mediante la identificación de las partes y articulaciones del cuerpo, lado dominante, exploración sensorial, fortaleciendo la identidad, autonomía, y valoración positiva de sí mismo.",
    competenciasClave: ["CC", "CECA", "CSE"],
    indicadores34: parseIndicadores(RAW_INDICADORES_34["CE.CI.0.24"]),
    indicadores45: parseIndicadores(RAW_INDICADORES_45["CE.CI.0.24"]),
    indicadores56: parseIndicadores(RAW_INDICADORES_45["CE.CI.0.24"]),
    saberes: buildSaberes("CE.CI.0.24", "Construir progresivamente el esquema corporal mediante la identificación de las partes y articulaciones del cuerpo, lado dominante, exploración sensorial, fortaleciendo la identidad, autonomía, y valoración positiva de sí mismo.", parseIndicadores(RAW_INDICADORES_34["CE.CI.0.24"]).map((i) => i.texto)),
    recursos: buildRecursos("CE.CI.0.24"),
  },
  {
    codigo: "CE.CI.0.25",
    descripcion: "Desarrollar progresivamente el control mediante movimientos coordinados, desplazamientos seguros en diferentes espacios fortaleciendo la fuerza, el equilibrio, la coordinación motriz, el control y seguridad en la acción corporal.",
    competenciasClave: ["CC", "CMCT", "CSE", "CECA"],
    indicadores34: parseIndicadores(RAW_INDICADORES_34["CE.CI.0.25"]),
    indicadores45: parseIndicadores(RAW_INDICADORES_45["CE.CI.0.25"]),
    indicadores56: parseIndicadores(RAW_INDICADORES_45["CE.CI.0.25"]),
    saberes: buildSaberes("CE.CI.0.25", "Desarrollar progresivamente el control mediante movimientos coordinados, desplazamientos seguros en diferentes espacios fortaleciendo la fuerza, el equilibrio, la coordinación motriz, el control y seguridad en la acción corporal.", parseIndicadores(RAW_INDICADORES_34["CE.CI.0.25"]).map((i) => i.texto)),
    recursos: buildRecursos("CE.CI.0.25"),
  },
  {
    codigo: "CE.CI.0.26",
    descripcion: "Coordinar progresivamente los movimientos de ambos lados del cuerpo mediante actividades de bilateralidad, lateralidad y simetría, fortaleciendo la coordinación corporal, la autonomía motriz y la precisión de los movimientos.",
    competenciasClave: ["CMCT", "CSE", "CECA"],
    indicadores34: parseIndicadores(RAW_INDICADORES_34["CE.CI.0.26"]),
    indicadores45: parseIndicadores(RAW_INDICADORES_45["CE.CI.0.26"]),
    indicadores56: parseIndicadores(RAW_INDICADORES_45["CE.CI.0.26"]),
    saberes: buildSaberes("CE.CI.0.26", "Coordinar progresivamente los movimientos de ambos lados del cuerpo mediante actividades de bilateralidad, lateralidad y simetría, fortaleciendo la coordinación corporal, la autonomía motriz y la precisión de los movimientos.", parseIndicadores(RAW_INDICADORES_34["CE.CI.0.26"]).map((i) => i.texto)),
    recursos: buildRecursos("CE.CI.0.26"),
  },
  {
    codigo: "CE.CI.0.27",
    descripcion: "Desarrollar progresivamente la orientación espacial y temporal mediante desplazamientos, recorridos y experiencias cotidianas que favorezcan el uso de nociones espaciales y temporales para ubicarse en relación consigo mismo, las personas, los objetos y el entorno.",
    competenciasClave: ["CC", "CMCT", "CSE"],
    indicadores34: parseIndicadores(RAW_INDICADORES_34["CE.CI.0.27"]),
    indicadores45: parseIndicadores(RAW_INDICADORES_45["CE.CI.0.27"]),
    indicadores56: parseIndicadores(RAW_INDICADORES_45["CE.CI.0.27"]),
    saberes: buildSaberes("CE.CI.0.27", "Desarrollar progresivamente la orientación espacial y temporal mediante desplazamientos, recorridos y experiencias cotidianas que favorezcan el uso de nociones espaciales y temporales para ubicarse en relación consigo mismo, las personas, los objetos y el entorno.", parseIndicadores(RAW_INDICADORES_34["CE.CI.0.27"]).map((i) => i.texto)),
    recursos: buildRecursos("CE.CI.0.27"),
  },
];

export function buscarCompetenciaInicial(codigo: string): CompetenciaInicialCompleta | undefined {
  return COMPETENCIAS_INICIAL.find((c) => c.codigo === codigo);
}
