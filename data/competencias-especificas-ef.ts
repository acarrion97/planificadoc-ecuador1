/**
 * Competencias de Educación Física extraídas de los PDF curriculares
 * suministrados para Preparatoria, EGB Media, EGB Superior y Bachillerato.
 * Los documentos presentan los indicadores por subnivel; se exponen para
 * cada grado correspondiente. Los códigos discordantes se normalizan según
 * el subnivel del archivo y la secuencia indicada por sus indicadores.
 */
import type {
  CompetenciaEspecificaCompleta,
  IndicadorCompetenciaEspecifica,
  SaberesCompetenciaEspecifica,
} from "./types-competencias-especificas";

interface CompetenciaEFPorSubnivel {
  codigo: string;
  descripcion: string;
  nivel: string;
  grados: string[];
  indicadores: IndicadorCompetenciaEspecifica[];
  saberes: SaberesCompetenciaEspecifica;
}

const COMPETENCIAS_EF_POR_SUBNIVEL: CompetenciaEFPorSubnivel[] = [
  {
    codigo: "CE.EF.1.1",
    descripcion:
      "Participar en diferentes tipos de juegos ajustando sus acciones motrices en función de sus estados corporales, ritmos internos y objetivo de los juegos, comprendiendo la necesidad de respetar reglas, roles y acuerdos simples para el cuidado de sí mismo, sus pares y el ambiente de aprendizaje e identificando las características básicas y los materiales necesarios para la construcción de implementos",
    nivel: "PREPARATORIA",
    grados: ["PRIMER GRADO"],
    indicadores: [
      {
        codigo: "I.EF.1.1.1",
        texto:
          "Adapta sus acciones motrices básicas durante las actividades lúdicas, regulando el movimiento corporal en concordancia con sus ritmos internos, fatiga y el propósito específico de cada juego",
      },
      {
        codigo: "I.EF.1.1.2",
        texto:
          "Cumple las reglas, roles asignados y acuerdos básicos de convivencia establecidos para el juego, demostrando una actitud de respeto mutuo y juego limpio con sus compañeros",
      },
      {
        codigo: "I.EF.1.1.3",
        texto:
          "Aplica normas colectivas de seguridad e higiene durante las prácticas expresivo-comunicativas, protegiendo su integridad física, la de sus pares y el estado del entorno de aprendizaje",
      },
    ],
    saberes: {
      declarativos: [
        "EF.1.1.d.1. Los juegos como parte de la cultura, espacio de disfrute y la acción de jugar como derecho",
        "EF.1.1.d.2. Importancia de la seguridad propia y de los pares durante la participación en diferentes juegos",
        "EF.1.1.d.3. Vínculo entre el dominio corporal, la regulación de emociones, la seguridad propia y del grupo cuando se participa en diversos juegos",
      ],
      procedimentales: [
        "EF.1.1.p.1. Reconocer, verbalizar y reflexionar sobre el vínculo entre la participación y los estados corporales, ritmos internos, emociones y sensaciones percibidas durante los juegos",
        "EF.1.1.p.2. Utilizar nociones espaciales (cerca, lejos, dentro, fuera, arriba, abajo, a los lados, adelante y atrás) y temporales (lento, rápido, al mismo tiempo) para resolver objetivos y demandas en diferentes juegos",
        "EF.1.1.p.3. Distinguir nociones espaciales (cerca, lejos, dentro, fuera, arriba, abajo, a los lados, adelante y atrás) y temporales (lento, rápido, al mismo tiempo) con relación a sí mismo y a sus pares durante la realización de diferentes juegos y prácticas lúdicas",
      ],
      actitudinales: [
        "EF.1.1.a.1. Disfrutar y valorar los juegos como expresiones culturales y del derecho a jugar, reconociendo su dominio corporal, emociones propias y de los demás",
        "EF.1.1.a.2. Reconocer y valorar la participación segura y placentera en juegos, respetando la diversidad sin distinción de género",
        "EF.1.1.a.3. Participar de manera atenta en diversos juegos tomando conciencia de cada parte de su cuerpo (pies, tobillos, piernas, muslo, etc.) sus características (blandas, duras, sensibles, fuertes, etc.) y posibilidades de movimiento; estados (fatiga, agitación, excitación, tensión, relajación, entre otros), ritmos (cardíaco y respiratorio) sensaciones y emociones",
        "EF.1.1.a.4. Autorregular sus acciones motrices, sensaciones, emociones y modos de vincularse durante la participación en juegos",
      ],
    },
  },
  {
    codigo: "CE.EF.1.3",
    descripcion:
      "Ejecutar prácticas gimnásticas individuales y colectivas mediante el reconocimiento de las posiciones, movimientos y capacidades del propio cuerpo, valorando la diversidad y las posibilidades motrices individuales",
    nivel: "PREPARATORIA",
    grados: ["PRIMER GRADO"],
    indicadores: [
      {
        codigo: "I.EF.1.3.1",
        texto:
          "Expresa posiciones y movimientos corporales durante las prácticas gimnásticas, manifestando coherencia entre la acción motriz, sus propias emociones y las sensaciones percibidas en sus compañeros",
      },
      {
        codigo: "I.EF.1.3.2",
        texto:
          "Corrige la ejecución de habilidades motrices básicas, destrezas y acrobacias sencillas, identificando de manera autónoma sus dificultades y aciertos para resolver de forma pertinente cada desafío gimnástico",
      },
    ],
    saberes: {
      declarativos: [
        "EF.1.2.d.1. Posiciones corporales (sentado, arrodillado, cuadrupedia, parado, de cúbito dorsal, ventral y lateral) y sus posibilidades de movimiento en la resolución de prácticas gimnásticas",
        "EF.1.2.d.2. Estados corporales (fatiga, agitación, excitación, tensión, relajación, entre otros) y ritmos internos (cardiaco, respiratorio) en reposo y durante la realización de diferentes prácticas corporales",
      ],
      procedimentales: [
        "EF.1.2.p.1. Identificar y explorar posiciones y movimientos corporales, integrales y segmentados, según las condiciones de participación en prácticas gimnásticas",
        "EF.1.2.p.2. Reconocer emociones y sensaciones propias (verbal o gestualmente) y relacionarlas con la participación en las prácticas gimnásticas, sin distinción de género",
        "EF.1.2.p.3. Diferenciar y practicar habilidades motrices básicas y sus posibles combinaciones (por ejemplo, correr y saltar o solo saltar)",
        "EF.1.2.p.4. Vivenciar y reconocer las propias capacidades motoras (coordinación, flexibilidad, velocidad, resistencia, fuerza) y habilidades motrices durante las prácticas gimnásticas",
        "EF.1.2.p.5. Participar atentamente en diferentes prácticas gimnásticas tomando conciencia de las diferentes partes de su cuerpo (pies, tobillos, piernas, muslo, etc.) sus características (blandas, duras, sensibles, fuertes, etc.) y posibilidades de movimiento; sus estados (fatiga, agitación, excitación, tensión, relajación, entre otros), ritmos (cardíaco y respiratorio) sensaciones y emociones",
        "EF.1.2.p.6. Explorar movimientos corporales, percibiendo sensaciones y emociones, en función de una participación segura y placentera en las prácticas gimnásticas",
      ],
      actitudinales: [
        "EF.1.2.a.1. Valorar y respetar la diversidad corporal, emocional y afectiva sin prejuicios ni estereotipos de género en las prácticas gimnásticas",
        "EF.1.2.a.2. Tener apertura para explorar e identificar posibilidades de movimiento del cuerpo en la construcción de la identidad corporal",
        "EF.1.2.a.3. Participar activamente en las prácticas gimnásticas con apertura al aprendizaje individual y colectivo, buscando la mejora progresiva",
        "EF.1.2.a.4. Valorar las diferencias corporales y sus posibilidades de movimiento",
      ],
    },
  },
  {
    codigo: "CE.EF.1.4",
    descripcion:
      "Realizar destrezas gimnásticas y acrobacias individuales o colectivas mediante el cumplimiento de acuerdos de seguridad y el cuidado corporal, demostrando una actitud de autosuperación y respeto por el entorno de trabajo",
    nivel: "PREPARATORIA",
    grados: ["PRIMER GRADO"],
    indicadores: [
      {
        codigo: "I.EF.1.4.1",
        texto:
          "Cumple los acuerdos de seguridad e higiene establecidos para la ejecución de acrobacias sencillas, manifestando acciones concretas de autocuidado, protección hacia sus pares y preservación del ambiente de aprendizaje",
      },
    ],
    saberes: {
      declarativos: [
        "EF.1.2.d.3. Nociones de cuidado corporal y riesgos en la realización de prácticas gimnásticas con destrezas gimnásticas (girar, rolar, equilibrartrepar, rodar, etc.) y acrobáticas básicas",
        "EF.1.2.d.4. Importancia de la seguridad propia y de los pares durante la participación en diferentedestrezas gimnásticas y acrobacias básicas",
      ],
      procedimentales: [
        "EF.1.2.p.7. Reconocer y prevenir riesgos en el desarrollo de prácticas gimnásticas con destrezas y acrobacias básicas",
        "EF.1.2.p.8. Realizar ejercicios, destrezas gimnásticas (girar, rolar, equilibrar, trepar, rodar, etc.) y acrobacias básicas individuales y colectivas respetando acuerdos y consignas simples de seguridad",
        "EF.1.2.p.9. Cuidar la higiene personal y del ambiente (escolar y natural) durante la realización de prácticas gimnásticas",
      ],
      actitudinales: [
        "EF.1.2.a.5. Ser responsable y respetar los acuerdos durante la ejecución de destrezas gimnásticas y acrobacias básicas, disfrutando su realización",
        "EF.1.2.a.6. Cuidar de sí, de sus pares, de los espacios de trabajo y del medio ambiente durante la participación en destrezas gimnásticas y acrobacias básicas. Orientaciones metodológicas La metodología se fundamenta en la exploración motriz guiada, el juego y la resolución de desafíos corporales, utilizando actividades adaptadas como desplazamientos, equilibrios, giros, rodadas, saltos, apoyos, trepas y combinaciones simples de movimientos gimnásticos. Estas experiencias permiten desarrollar coordinación, equilibrio, fuerza, flexibilidad y control postural, favoreciendo la seguridad y confianza del estudiante al realizar diferentes acciones motrices. El docente cumple un rol de mediador, generando ambientes de aprendizaje seguros mediante la enseñanza progresiva de acuerdos básicos de prevención, como el uso adecuado del espacio, cuidado de materiales, respeto de turnos, reconocimiento de riesgos y apoyo entre compañeros. Las actividades deben desarrollarse en espacios organizados que permitan la exploración libre y responsable, fortaleciendo la conciencia sobre el cuidado del propio cuerpo, el de sus pares y el entorno. A través de actividades individuales y cooperativas, se fomenta la autonomía, perseverancia y auto superación, permitiendo que el estudiantado reconozca sus avances, enfrenten pequeños desafíos y valoren el esfuerzo más que el resultado final. La retroalimentación positiva y la reflexión sobre las experiencias corporales favorecen la construcción de seguridad emocional y confianza en sus capacidades. Asimismo, se promueve la relación armónica con el ambiente escolar y natural mediante prácticas responsables como mantener ordenados los espacios, cuidar los recursos utilizados y participar activamente en la conservación del entorno. De esta manera, la actividad gimnástica trasciende la ejecución técnica del movimiento y se convierte en una experiencia educativa integral",
      ],
    },
  },
  {
    codigo: "CE.EF.1.5",
    descripcion:
      "Reconocer las prácticas corporales expresivo- comunicativas del contexto local y nacional como saberes culturales fundamentales, ejerciendo el derecho a participar y aprender de ellas en igualdad de condiciones",
    nivel: "PREPARATORIA",
    grados: ["PRIMER GRADO"],
    indicadores: [
      {
        codigo: "I.EF.1.5.1",
        texto:
          "Describe las características básicas y los elementos culturales de las prácticas expresivo-comunicativas de su entorno cercano, utilizándolos como referentes para la construcción de su propia identidad corporal",
      },
    ],
    saberes: {
      declarativos: [
        "EF.1.3.d.1. Características de las prácticas expresivo-comunicativas locales y cotidianas",
        "EF.1.3.d.2. Lógicas, sentidos y modos de participación de las prácticas expresivo- comunicativas territoriales (danzas tradicionales y/o locales, celebraciones, entre otras)",
        "EF.1.3.d.3. Importancia de la seguridad propia y de sus pares durante la participación en diferentes prácticas expresivo-comunicativas",
      ],
      procedimentales: [
        "EF.1.3.p.1. Reconocer el derecho a la participación, de múltiples maneras, en prácticas expresivo- comunicativas locales como modo de acceder a la cultura",
      ],
      actitudinales: [
        "EF.1.3.a.1. Participar con respeto y compromiso en prácticas corporales expresivo-comunicativas, tanto individuales como colectivas",
        "EF.1.3.a.5. Tener apertura para cuidar de sí, sus pares, los espacios y el ambiente durante la participación en prácticas expresivo- comunicativas. Orientaciones metodológicas La metodología se fundamenta en la exploración corporal, el juego expresivo y el aprendizaje vivencial, donde el docente propone actividades relacionadas con experiencias cercanas al entorno familiar, escolar y comunitario. Mediante canciones, juegos tradicionales, bailes, dramatizaciones, imitaciones y actividades rítmicas, el estudiantado reconoce que las prácticas corporales forman parte de la cultura y representan formas de comunicación y participación social. El docente genera ambientes inclusivos y seguros donde cada estudiante pueda expresarse libremente, respetando sus características personales, emociones, formas de movimiento y diversidad cultural. Las actividades deben promover la participación activa, evitando modelos únicos de expresión corporal y valorando las diferentes maneras en que cada niño y niña interpreta, crea y comunica mediante su cuerpo. A través del diálogo, la observación y la reflexión sobre las experiencias realizadas, el estudiantado identifica semejanzas y diferencias entre diversas prácticas expresivas de su comunidad y comprende su importancia como manifestaciones culturales que transmiten historias, valores, tradiciones y formas de convivencia. El aprendizaje se fortalece mediante la participación de familias y comunidad, recuperando juegos, danzas y expresiones propias del contexto ecuatoriano",
      ],
    },
  },
  {
    codigo: "CE.EF.1.6",
    descripcion:
      "Interpretar mensajes y estados emocionales mediante la participación en diversas prácticas corporales expresivo- comunicativas, utilizando los propios recursos expresivos, estableciendo acuerdos simples y valorando la diversidad cultural y personal del grupo",
    nivel: "PREPARATORIA",
    grados: ["PRIMER GRADO"],
    indicadores: [
      {
        codigo: "I.EF.1.6.1",
        texto:
          "Comunica mensajes, estados de ánimo y emociones a través del uso creativo de recursos expresivos como gestos, posturas y variaciones de movimiento en relación con el tiempo y el espacio",
      },
      {
        codigo: "I.EF.1.6.2",
        texto:
          "Establece pautas sencillas de convivencia con sus pares que facilitan la organización y participación equitativa en las actividades expresivo-comunicativas",
      },
    ],
    saberes: {
      declarativos: [
        "EF.1.3.d.4. El tiempo, el espacio, los gestos, las posturas, los tipos de movimiento, los estados de ánimo y emociones como recursos expresivos para crear mensajes corporales",
        "EF.1.3.d.5. Importancia del respeto y cuidado del propio cuerpo y el de sus pares (derecho al cuidado, respeto y contacto personal consentido) en prácticas expresivas y comunicativas",
      ],
      procedimentales: [
        "EF.1.3.p.2. Identificar y utilizar recursos expresivos (tiempo, espacio, gestos, tipos de movimientos, estados de ánimo, sensaciones y emociones) para crear, expresar y comunicar mensajes corporales",
        "EF.1.3.p.3. Reconocer las propias posibilidades de creación, expresión, comunicación e interpretación de mensajes corporales en prácticas expresivo- comunicativas",
        "EF.1.3.p.4. Establecer acuerdos colectivos simples para la participación (creación, comunicación y observación) grupal en prácticas expresivo- comunicativas",
      ],
      actitudinales: [
        "EF.1.3.a.2. Cuidar de sí, de sus pares, de los espacios de trabajo y de la cultura durante su participación en prácticas expresivo-comunicativas",
        "EF.1.3.a.3. Crear, comunicar e interpretar mensajes corporales desde el respeto por los tiempos personales y del colectivo",
        "EF.1.3.a.4. Respetar los acuerdos colectivos en la creación y comunicación de mensajes durante la participación en prácticas expresivo- comunicativas",
      ],
    },
  },
  {
    codigo: "CE.EF.3.1",
    descripcion:
      "Participar en diversos juegos valorando sus posibilidades de creación y recreación, diferenciándolos en función de sus características, proveniencia y objetivos, sobre la base del reconocimiento de la importancia de jugar de manera segura para preservarlos como parte del patrimonio cultural intangible del país",
    nivel: "MEDIA",
    grados: ["QUINTO GRADO", "SEXTO GRADO", "SÉPTIMO GRADO"],
    indicadores: [
      {
        codigo: "I.EF.3.1.1",
        texto:
          "Clasifica diferentes tipos de juegos en función de sus características, objetivos y proveniencias regionales o ancestrales, reconociendo su valor histórico y sociocultural como parte del patrimonio cultural inmaterial de la humanidad",
      },
      {
        codigo: "I.EF.3.1.2",
        texto:
          "Adapta los sentidos, objetivos y reglas de juegos creados y colectivos de diversas regiones, participando de manera segura, inclusiva y democrática al reconocer el impacto de estas producciones culturales en la construcción de su identidad corporal",
      },
    ],
    saberes: {
      declarativos: [],
      procedimentales: [],
      actitudinales: [],
    },
  },
  {
    codigo: "CE.EF.3.2",
    descripcion:
      "Participar en diversos tipos de juegos colaborando activamente con sus pares y desarrollando el dominio progresivo de sus acciones motrices, estados corporales, sensaciones y habilidades de autorregulación emocional, con el fin de contribuir a la creación de entornos lúdicos equitativos, inclusivos y respetuosos de la diversidad, que promuevan el bienestar integral propio y colectivo sin distinciones de género",
    nivel: "MEDIA",
    grados: ["QUINTO GRADO", "SEXTO GRADO", "SÉPTIMO GRADO"],
    indicadores: [
      {
        codigo: "I.EF.3.2.1",
        texto:
          "Expresa sus estados corporales, sensaciones y emociones durante la práctica lúdica, vinculándolos con la autorregulación de sus acciones para mantener un comportamiento respetuoso, colaborativo y de juego limpio con sus pares",
      },
      {
        codigo: "I.EF.3.2.2",
        texto:
          "Participa en actividades lúdicas colectivas demostrando habilidades de autorregulación emocional y asumiendo actitudes de respeto, inclusión y valoración de la diversidad, sin distinciones de género",
      },
    ],
    saberes: {
      declarativos: [
        "EF.2.1.d.6. El trabajo en equipo, la colaboración para alcanzar metas comunes y acordar reglas de juego",
        "EF.2.1.d.7. La valoración de la diversidad sin distinción de géneros ni habilidades y promoción de la inclusión en todos los juegos y tareas",
        "EF.2.1.d.8. Diferentes tipos de juegos, características, objetivos y roles",
        "EF.2.1.d.9. Los juegos, sus posibilidades de recrearlos y transformarlos",
        "EF.2.1.d.10. La seguridad propia y del grupo. Conciencia de riesgos e importancia de cuidados durante los juegos",
        "EF.2.1.d.11. Las demandas motoras, de comprensión, actitudinales y emocionales y sus posibilidades de resolución",
      ],
      procedimentales: [
        "EF.2.1.p.9. Identificar y practicar diferentes tipos de juegos",
        "EF.2.1.p.10. Reconocer objetivos, características y roles en diversos juegos",
        "EF.3.1.p.11. Modificar los juegos según las necesidades del grupo para que resulten inclusivos",
        "EF.3.1.p.12. Reconocer, reflexionar y explorar acciones en respuesta a las demandas (motoras, de comprensión, actitudinales, emocionales) que presentan los juegos",
        "EF.2.1.p.13. Identificar respuestas pertinentes y seguras a las demandas motoras, de comprensión, actitudinales y emocionales",
        "EF.2.1.p.14. Practicar diversos juegos registrando diferentes aspectos del propio desempeño en cada caso",
        "EF.2.1.p.15. Diferenciar situaciones de resolución individual de aquellas que requieren coordinar acciones y sentidos para trabajar en equipo con pares en diversas situaciones de juego",
        "EF.2.1.p.16. Optimizar las acciones (motoras, de comprensión, actitudinales, emocionales, entre otras) necesarias para participar en cada juego, según los objetivos a alcanzar",
      ],
      actitudinales: [
        "EF.2.1.a.7. Colaborar con sus pares, autorregulando sus acciones y emociones",
        "EF.2.1.a.8. Perseverar en la búsqueda de respuestas más adecuadas y seguras a diversas situaciones de juego tanto individual como colectivamente",
        "EF.2.1.a.9. Valorar la diversidad como riqueza de la especie humana.",
      ],
    },
  },
  {
    codigo: "CE.EF.3.3",
    descripcion:
      "Comprender la flexibilidad de las reglas de juego y su proceso de construcción consensuada en función de los diferentes contextos y objetivos lúdicos, reconociendo la necesidad de respetarlas de manera rigurosa para garantizar la inclusión, la seguridad de sus pares, el autocuidado y la protección del ambiente",
    nivel: "MEDIA",
    grados: ["QUINTO GRADO", "SEXTO GRADO", "SÉPTIMO GRADO"],
    indicadores: [
      {
        codigo: "I.EF.3.3.1",
        texto:
          "Explica la importancia y la flexibilidad de las reglas en los juegos, identificando cómo su modificación consensuada permite adaptar la práctica lúdica a las necesidades del contexto y de los participantes",
      },
      {
        codigo: "I.EF.3.3.2",
        texto:
          "Participa en actividades lúdicas respetando de manera rigurosa las reglas y los acuerdos co-construidos, demostrando apertura al diálogo, empatía y respeto absoluto por las decisiones tomadas colectivamente con sus pares",
      },
    ],
    saberes: {
      declarativos: [
        "EF.2.1.d.12. Las reglas en los juegos, su flexibilidad como componente intrínseco",
        "EF.2.1.d.13. La modificación consensuada de reglas para favorecer una participación equitativa e inclusiva",
      ],
      procedimentales: [
        "EF.2.1.p.17. Intercambiar ideas sobre objetivos y características de los juegos, espacios disponibles y riesgos que involucra",
        "EF.2.1.p.18. Analizar las adecuaciones de las reglas que favorecen la participación segura y placentera de todos y todas. EF.2.1.p.19 Construir consensuadamente reglas en función de los objetivos y características de los juegos, atendiendo que resulten inclusivas y seguras, evitando arquetipos de género",
        "EF.2.1.p.20. Construir colaborativamente reglas que favorezcan una participación segura e inclusiva en los juegos",
      ],
      actitudinales: [
        "EF.2.1.a.10. Respetar las reglas y acuerdos establecidos",
        "EF.2.1.a.11. Practicar hábitos de higiene y cuidado personal y del ambiente.",
      ],
    },
  },
  {
    codigo: "CE.EF.3.4",
    descripcion:
      "Participar en prácticas gimnásticas individuales y grupales incluyendo habilidades motrices básicas, ejercicios, destrezas gimnásticas y acrobacias sencillas, dominando las posiciones dinámicas y estáticas del propio cuerpo en diversas situaciones temporal espaciale, de manera saludable, segura y placentera",
    nivel: "MEDIA",
    grados: ["QUINTO GRADO", "SEXTO GRADO", "SÉPTIMO GRADO"],
    indicadores: [
      {
        codigo: "I.EF.3.4.1",
        texto:
          "Domina las posiciones corporales estáticas y dinámicas en la ejecución de tareas gimnásticas, ajustando sus movimientos a diferentes orientaciones temporal espaciale y aplicando de manera autónoma las precauciones necesarias para su autocuidado y la seguridad de sus pares",
      },
    ],
    saberes: {
      declarativos: [
        "EF.2.2.d.1. Las prácticas gimnásticas: características de habilidades motrices básicas (caminar, correr, saltar, girar, lanzar, trepar, etc.), tipos de destrezas gimnásticas y acrobacias (rol adelante, rol atrás, pirámides estáticas y dinámicas)",
        "EF.2.2.d.2. Combinaciones de ejercicios, destrezas gimnásticas y habilidades motrices básicas (desplazarse, rolar o combinar roles con saltos, enlazar destrezas con desplazamientos o giros, etc.), y posiciones corporales (cuadrupedia, de pie, de cúbito dorsal, ventral, etc.)",
        "EF.2.2.d.3. El cuerpo en movimiento en vinculación con el tiempo (simultáneo, alternado, sincronizado) y el espacio (cerca, lejos, dentro, fuera, arriba, abajo, a los lados, adelante y atrás) para mejorar su desempeño en las tareas individuales y colectivas",
      ],
      procedimentales: [
        "EF.2.2.p.1. Experimentar diferentes habilidades motrices básicas, ejercicios, destrezas gimnásticas y acrobacias en diversas situaciones, atendiendo a la autorregulación de forma segura",
        "EF.2.2.p.2. Identificar y ensayar combinaciones de ejercicios, destrezas gimnásticas y acrobacias de forma individual y colaborativa",
        "EF.2.2.p.3. Reconocer, en la realización de prácticas gimnásticas, el dominio y autoconocimiento del propio cuerpo",
        "EF.2.2.p.4. Identificar diferentes estados corporales y niveles de tensión y relajación, atendiendo a la respiración para la realización de prácticas gimnásticas",
      ],
      actitudinales: [
        "EF.2.2.a.1. Valorar la participación individual y colectiva en el desarrollo de prácticas gimnásticas",
        "EF.2.2.a.2. Reflexionar con pares sobre los diferentes estados corporales al momento de realizar ejercicios, destrezas gimnásticas y acrobacias",
        "EF.2.2.a.3. Respetar y cuidar el propio cuerpo y el de sus pares para la realización de prácticas gimnásticas seguras y placenteras.",
      ],
    },
  },
  {
    codigo: "CE.EF.3.5",
    descripcion:
      "Reconocer las propias capacidades físicas (coordinativas y condicionales), sensaciones, emociones y modos de participación durante la realización de prácticas gimnásticas, reflexionando sobre su impacto en la ejecución motriz para asegurar el autocuidado y la protección de sus pares",
    nivel: "MEDIA",
    grados: ["QUINTO GRADO", "SEXTO GRADO", "SÉPTIMO GRADO"],
    indicadores: [
      {
        codigo: "I.EF.3.5.1",
        texto:
          "Explica las emociones, sensaciones corporales y capacidades físicas (coordinativas y condicionales) que experimenta durante la ejecución de ejercicios, destrezas gimnásticas y acrobacias, identificando de forma proactiva situaciones de riesgo para aplicar las reglas de cuidado establecidas",
      },
      {
        codigo: "I.EF.3.5.2",
        texto:
          "Construye acuerdos de participación segura, de manera individual y colectiva, para la práctica de habilidades motrices básicas, destrezas gimnásticas y acrobacias, reflexionando críticamente sobre la diversidad corporal para garantizar entornos inclusivos",
      },
    ],
    saberes: {
      declarativos: [
        "EF.2.2.d.4. El cuerpo, las emociones y las sensaciones corporales en la realización de ejercicios, destrezas gimnásticas y acrobacias",
        "EF.2.2.d.5. Capacidades físicas y coordinativas (equilibrio, ritmo, orientación, diferenciación, acoplamiento, flexibilidad, velocidad, resistencia y fuerza)",
        "EF.2.2.d.6. La diversidad corporal para una participación respetuosa, equitativa y segura desde una perspectiva de derechos",
        "EF.2.2.d.7. Estados corporales: tensión- relajación, activación-reposo y estabilidad- inestabilidad",
      ],
      procedimentales: [
        "EF.2.2.p.5. Reconocer y comunicar sensaciones y emociones (si gusta la práctica, si se comprende lo que se debe hacer para resolverla, qué acciones presentan dificultad y cuáles resultan sencillas, entre otras) para poder participar con pares en diferentes prácticas gimnásticas",
        "EF.2.2.p.6. Experimentar y poner en práctica diferentes formas de moverse (saltar, correr, girar, trepar, lanzar, mantener el equilibrio, cambiar de ritmo) en ejercicios, destrezas gimnásticas y acrobacias, reconociendo cómo responde el propio cuerpo ante cada acción y ajustando los movimientos para realizarlos de manera segura y efectiva",
        "EF.2.2.p.7. Reconocer sensaciones y emociones que favorecen u obstaculizan la realización de prácticas gimnásticas, para trabajar en su superación",
        "EF.2.2.p.8. Construir acuerdos de participación basados en el cuidado, la confianza y el respeto por los derechos de todos y todas",
      ],
      actitudinales: [
        "EF.2.2.a.4. Identificar y reflexionar con sus pares sobre las vivencias corporales en prácticas gimnásticas, respetando las diferencias",
        "EF.2.2.a.5. Valorar y reflexionar sobre la diversidad corporal y el compromiso en la construcción de vínculos basados en el cuidado, la confianza y el respeto por los derechos de todos y todas, favoreciendo una participación segura y colaborativa en actividades de acrobacias y destrezas",
        "EF.2.2.a.6. Respetar y cuidar el propio cuerpo y el de sus pares durante la realización de destrezas gimnásticas y acrobacias",
        "EF.2.2.a.7. Valorar la posibilidad de expresarse en un ambiente seguro, como parte importante del reconocimiento de la diversidad como riqueza.",
      ],
    },
  },
  {
    codigo: "CE.EF.3.6",
    descripcion:
      "Valorar las prácticas expresivo-comunicativas del propio entorno sociocultural y de otros contextos mediante su identificación, descripción y recreación, reconociéndolas como saberes culturales con derecho a ser aprendidos, compartidos y transmitidos a través de la participación activa y respetuosa en experiencias individuales y colectivas. E",
    nivel: "MEDIA",
    grados: ["QUINTO GRADO", "SEXTO GRADO", "SÉPTIMO GRADO"],
    indicadores: [
      {
        codigo: "I.EF.3.6.1",
        texto:
          "Describe las características, elementos simbólicos y significados de las prácticas expresivo-comunicativas tradicionales de su contexto sociocultural, empleando el lenguaje verbal y corporal para comunicar sus hallazgos de forma clara",
      },
      {
        codigo: "I.EF.3.6.2",
        texto:
          "Recrea manifestaciones expresivo-comunicativas individuales y colectivas de manera activa, integrando movimientos rítmicos y gestuales con base en el respeto absoluto a la diversidad de los miembros del grupo",
      },
      {
        codigo: "I.EF.3.6.3",
        texto:
          "Compara las prácticas expresivas de su propia comunidad con las de otros contextos históricos o geográficos, identificando semejanzas y diferencias estructurales para valorar la riqueza del patrimonio pluricultural",
      },
    ],
    saberes: {
      declarativos: [
        "EF.2.3.d.1. Prácticas expresivo-comunicativas del propio contexto cultural, sus objetivos, lógicas y sentidos: danzas, celebraciones, juegos, rituales escolares y comunitarios",
        "EF.2.3.d.2. El derecho propio y de la comunidad a la cultura y a la participación en prácticas expresivas como patrimonio común",
        "EF.2.3.d.3. Diferenciación entre expresión y comunicación en las prácticas expresivo- comunicativas y su lugar en la producción y transmisión cultural",
      ],
      procedimentales: [
        "EF.2.3.p.1. Reconocer y diferenciar expresiones culturales diversas, sus objetivos, lógicas y sentidos (identitarios, festivos, comunitarios, históricos) que tienen en cada contexto",
        "EF.2.3.p.2. Identificar y diferenciar entre la realización de prácticas propias y expresiones culturales contextuales",
        "EF.2.3.p.3. Reconocer y transmitir mensajes expresivos propios de prácticas expresivo-comunicativas de su contexto",
        "EF.2.3.p.4. Participar en variadas prácticas expresivo- comunicativas locales y regionales, diferenciando sus lógicas y sentidos, interpelando los arquetipos de género",
      ],
      actitudinales: [
        "EF.2.3.a.1. Valorar la participación inclusiva en prácticas corporales expresivo-comunicativas",
        "EF.2.3.a.2. Reconocer y respetar las múltiples formas de participación en prácticas expresivo- comunicativas (creación, comunicación, observación, entre otras), propias y de los demás",
        "EF.2.3.a.3. Respetar acuerdos colectivos simples para la participación grupal en prácticas expresivo- comunicativas.",
      ],
    },
  },
  {
    codigo: "CE.EF.3.7",
    descripcion:
      "Participar en prácticas expresivo-comunicativas para crear e interpretar mensajes corporales con intención expresiva o comunicativa, utilizando creativamente los recursos del entorno, asumiendo diversos roles y traduciendo mensajes a otros lenguajes, sobre la base del establecimiento de acuerdos para el cuidado mutuo y el respeto por las diversas formas de expresión",
    nivel: "MEDIA",
    grados: ["QUINTO GRADO", "SEXTO GRADO", "SÉPTIMO GRADO"],
    indicadores: [
      {
        codigo: "I.EF.3.7.1",
        texto:
          "Crea secuencias expresivas corporales mediante la integración intencional y estética de diversos recursos del entorno, estructurando de manera clara una intención comunicativa específica",
      },
      {
        codigo: "I.EF.3.7.2",
        texto:
          "Traduce los mensajes expresados con su cuerpo a través de explicaciones verbales o representaciones en otros lenguajes (artísticos, escritos o visuales), demostrando coherencia entre la acción motriz y el significado comunicado",
      },
      {
        codigo: "I.EF.3.7.3",
        texto:
          "Desempeña de manera autónoma los roles de intérprete, creador, espectador u organizador en producciones corporales, adaptando su participación a los requerimientos técnicos y comunicativos de cada función asumida",
      },
      {
        codigo: "I.EF.3.7.4",
        texto:
          "Colabora activamente en la organización y montaje de propuestas expresivas colectivas, respetando con rigurosidad los acuerdos de cuidado mutuo y valorando la diversidad en las formas de expresión de sus pares",
      },
    ],
    saberes: {
      declarativos: [
        "EF.2.3.d.4. Recursos expresivos del espacio y el tiempo para la creación de mensajes corporales: planos (sagital, frontal y transversal), niveles (bajo, medio, alto), trayectorias, velocidades, pausas y silencios",
        "EF.2.3.d.5. Recursos expresivos corporales para la creación de mensajes: intensidades de movimiento, tono muscular, gestos espontáneos y códigos gestuales, desplazamientos, posturas, imitaciones e imágenes internas",
        "EF.2.3.d.6. Los roles en la creación y producción de prácticas expresivo- comunicativas: creación, ejecución, organización y observación, entre otros",
      ],
      procedimentales: [
        "EF.2.3.p.5. Reconocer las propias posibilidades de diseño, creación, expresión y comunicación de mensajes corporales en prácticas expresivo-comunicativas",
        "EF.2.3.p.6. Producir e interpretar mensajes corporales propios y de otros, y su traducción al lenguaje oral, escrito o visual",
        "EF.2.3.p.7. Identificar y utilizar componentes expresivos (de tiempo, de espacio y de movimiento) para crear y comunicar mensajes corporales",
        "EF.2.3.p.8. Integrar los recursos expresivos internos o propios (espacio, tiempo, movimiento, emociones, estados corporales) con los externos (música, objetos, vestuario) en creaciones expresivas",
        "EF.2.3.p.9. Participar en propuestas grupales inclusivas con asignación de roles en la creación y comunicación de mensajes desde el respeto por los tiempos personales y del colectivo",
      ],
      actitudinales: [
        "EF.2.3.a.4. Valorar las prácticas expresivo- comunicativas propias del territorio y su cultura",
        "EF.2.3.a.5. Respetar acuerdos colectivos en la creación y comunicación de prácticas expresivo-comunicativas",
        "EF.2.3.a.6. Celebrar la diversidad en la creación y participación en prácticas expresivo- comunicativas.",
      ],
    },
  },
  {
    codigo: "CE.EF.4.1",
    descripcion:
      "Participar en diversos juegos valorando sus posibilidades de creación y recreación, diferenciándolos en función de sus características, proveniencia y objetivos, sobre la base del reconocimiento de la importancia de jugar de manera segura para preservarlos como parte del patrimonio cultural intangible del país",
    nivel: "SUPERIOR",
    grados: ["OCTAVO GRADO", "NOVENO GRADO", "DÉCIMO GRADO"],
    indicadores: [
      {
        codigo: "I.EF.4.1.1",
        texto:
          "Resuelve con pertinencia las demandas técnicas y tácticas individuales o de equipo que se presentan en diversas categorías de juego para optimizar el desempeño motriz colectivo",
      },
      {
        codigo: "I.EF.4.1.2",
        texto:
          "Modifica las dinámicas de juego que reproducen segregaciones por niveles de desempeño físico, ejecutando estrategias colectivas que transformen las barreras motrices en oportunidades de disfrute compartido",
      },
      {
        codigo: "I.EF.4.1.3",
        texto:
          "Propone cambios asertivos en el entorno físico o regulador de diferentes juegos tras evaluar la gravedad de los riesgos asociados, con la finalidad de incrementar su propia seguridad y la de sus pares",
      },
    ],
    saberes: {
      declarativos: [],
      procedimentales: [],
      actitudinales: [],
    },
  },
  {
    codigo: "CE.EF.4.4",
    descripcion:
      "Diseña composiciones expresivo- comunicativas individuales y colectivas, seleccionando diversos recursos compositivos (ritmo, espacio, tiempo, objetos) para comunicar ideas y mensajes significativos con intencionalidad estética",
    nivel: "SUPERIOR",
    grados: ["OCTAVO GRADO", "NOVENO GRADO", "DÉCIMO GRADO"],
    indicadores: [
      {
        codigo: "I.EF.4.4.2",
        texto:
          "Ejerce diferentes roles de gestión (dirección, ejecución, asistencia técnica o mediación) en producciones expresivas colectivas, evidenciando un compromiso ético y democrático en el trabajo con sus pares",
      },
      {
        codigo: "I.EF.4.4.3",
        texto:
          "Transmite ideas complejas y mensajes significativos mediante el uso de lenguajes corporales y gestuales abstractos en la ejecución de secuencias coreográficas creativas",
      },
      {
        codigo: "I.EF.4.4.4",
        texto:
          "Diagnóstica los factores emocionales, sociales, contextuales y técnicos que favorecen u obstaculizan su desempeño activo, confortable y seguro en las prácticas expresivas, proponiendo estrategias de autorregulación y mejora colectiva",
      },
    ],
    saberes: {
      declarativos: [
        "EF.4.3.d.4. La composición corporal expresiva, sus posibilidades y momentos: creación, ensayo o práctica, escenificación, estructura y secuencias",
        "EF.4.3.d.5. Recursos expresivos corporales, espaciales y temporales y sus posibles combinaciones: intensidades y combinaciones de movimiento, planos, niveles, trayectorias, pausas, silencios, música, vestuario, escenografía, relaciones grupales, combinaciones rítmicas y gestuales",
        "EF.4.3.d.6. Funciones y acciones en cada rol de participación en las prácticas expresivas y comunicativas: interpretación, creación, organización, crítica y público",
      ],
      procedimentales: [
        "EF.4.3.p.6. Identificar, usar y combinar recursos compositivos en la creación y resignificación de mensajes expresivos en diversas prácticas (danza, circo, murga, juegos de roles, expresión corporal)",
        "EF.4.3.p.7. Reconocer percepciones y emociones y su influencia en la comunicación mediante el cuerpo y otros lenguajes (oral, gráfico, audiovisual)",
        "EF.4.3.p.8. Analizar y reflexionar sobre el proceso creativo y de participación en las prácticas expresivo- comunicativas",
        "EF.4.3.p.9. Identificar y proponer modificaciones alternativas para mejorar la experiencia individual y grupal de participación en prácticas expresivo- comunicativas",
        "EF.4.3.p.10. Reconocer, diferenciar y llevar a cabo las acciones propias de cada rol en la participación en prácticas expresivo-comunicativas",
      ],
      actitudinales: [
        "EF.4.3.a.4. Mostrar disposición hacia la composición comprometida y creativa de mensajes mediados por el uso de recursos corporales, espaciales y temporales",
        "EF.4.3.a.5. Valorar la dimensión emocional y subjetiva en las prácticas corporales expresivo-comunicativas",
        "EF.4.3.a.6. Comprometerse con los roles asumidos y con los acuerdos colectivos en la participación expresiva",
        "EF.4.3.a.7. Mantener una disposición crítica y reflexiva para reconocer fortalezas y dificultades en la participación expresiva y comunicativa",
      ],
    },
  },
  {
    codigo: "CE.EF.4.6",
    descripcion:
      "Valorar las prácticas expresivo- comunicativas del propio entorno sociocultural y de otros contextos mediante su identificación, descripción y recreación, reconociéndolas como saberes culturales con derecho a ser aprendidos, compartidos y transmitidos a través de la participación activa y respetuosa en experiencias individuales y colectivas",
    nivel: "SUPERIOR",
    grados: ["OCTAVO GRADO", "NOVENO GRADO", "DÉCIMO GRADO"],
    indicadores: [
      {
        codigo: "I.EF.4.6.1",
        texto:
          "Describe las características, elementos simbólicos y significados de las prácticas expresivo- comunicativas tradicionales de su contexto sociocultural, empleando el lenguaje verbal y corporal para comunicar sus hallazgos de forma clara",
      },
      {
        codigo: "I.EF.4.6.2",
        texto:
          "Recrea manifestaciones expresivo-comunicativas individuales y colectivas de manera activa, integrando movimientos rítmicos y gestuales con base en el respeto absoluto a la diversidad de los miembros del grupo",
      },
      {
        codigo: "I.EF.4.6.3",
        texto:
          "Compara las prácticas expresivas de su propia comunidad con las de otros contextos históricos o geográficos, identificando semejanzas y diferencias estructurales para valorar la riqueza del patrimonio pluricultural",
      },
    ],
    saberes: {
      declarativos: [
        "EF.2.3.d.1. Prácticas expresivo-comunicativas del propio contexto cultural, sus objetivos, lógicas y sentidos: danzas, celebraciones, juegos, rituales escolares y comunitarios",
        "EF.2.3.d.2. El derecho propio y de la comunidad a la cultura y a la participación en prácticas expresivas como patrimonio común",
        "EF.2.3.d.3. Diferenciación entre expresión y comunicación en las prácticas expresivo- comunicativas y su lugar en la producción y transmisión cultural",
      ],
      procedimentales: [
        "EF.2.3.p.1. Reconocer y diferenciar expresiones culturales diversas, sus objetivos, lógicas y sentidos (identitarios, festivos, comunitarios, históricos) que tienen en cada contexto",
        "EF.2.3.p.2. Identificar y diferenciar entre la realización de prácticas propias y expresiones culturales contextuales",
        "EF.2.3.p.3. Reconocer y transmitir mensajes expresivos propios de prácticas expresivo-comunicativas de su contexto",
        "EF.2.3.p.4. Participar en variadas prácticas expresivo- comunicativas locales y regionales, diferenciando sus lógicas y sentidos, interpelando los arquetipos de género",
      ],
      actitudinales: [
        "EF.2.3.a.1. Valorar la participación inclusiva en prácticas corporales expresivo-comunicativas",
        "EF.2.3.a.2. Reconocer y respetar las múltiples formas de participación en prácticas expresivo-comunicativas (creación, comunicación, observación, entre otras), propias y de los demás",
        "EF.2.3.a.3. Respetar acuerdos colectivos simples para la participación grupal en prácticas expresivo- comunicativas.",
      ],
    },
  },
  {
    codigo: "CE.EF.4.7",
    descripcion:
      "Participar en prácticas expresivo- comunicativas para crear e interpretar mensajes corporales con intención expresiva o comunicativa, utilizando creativamente los recursos del entorno, asumiendo diversos roles y traduciendo mensajes a otros lenguajes, sobre la base del establecimiento de acuerdos para el cuidado mutuo y el respeto por las diversas formas de expresión",
    nivel: "SUPERIOR",
    grados: ["OCTAVO GRADO", "NOVENO GRADO", "DÉCIMO GRADO"],
    indicadores: [
      {
        codigo: "I.EF.4.7.1",
        texto:
          "Crea secuencias expresivas corporales mediante la integración intencional y estética de diversos recursos del entorno, estructurando de manera clara una intención comunicativa específica",
      },
      {
        codigo: "I.EF.4.7.2",
        texto:
          "Traduce los mensajes expresados con su cuerpo a través de explicaciones verbales o representaciones en otros lenguajes (artísticos, escritos o visuales), demostrando coherencia entre la acción motriz y el significado comunicado",
      },
      {
        codigo: "I.EF.4.7.3",
        texto:
          "Desempeña de manera autónoma los roles de intérprete, creador, espectador u organizador en producciones corporales, adaptando su participación a los requerimientos técnicos y comunicativos de cada función asumida",
      },
      {
        codigo: "I.EF.4.7.4",
        texto:
          "Colabora activamente en la organización y montaje de propuestas expresivas colectivas, respetando con rigurosidad los acuerdos de cuidado mutuo y valorando la diversidad en las formas de expresión de sus pares",
      },
    ],
    saberes: {
      declarativos: [
        "EF.2.3.d.4. Recursos expresivos del espacio y el tiempo para la creación de mensajes corporales: planos (sagital, frontal y transversal), niveles (bajo, medio, alto), trayectorias, velocidades, pausas y silencios",
        "EF.2.3.d.5. Recursos expresivos corporales para la creación de mensajes: intensidades de movimiento, tono muscular, gestos espontáneos y códigos gestuales, desplazamientos, posturas, imitaciones e imágenes internas",
        "EF.2.3.d.6. Los roles en la creación y producción de prácticas expresivo-comunicativas: creación, ejecución, organización y observación, entre otros",
      ],
      procedimentales: [
        "EF.2.3.p.5. Reconocer las propias posibilidades de diseño, creación, expresión y comunicación de mensajes corporales en prácticas expresivo- comunicativas",
        "EF.2.3.p.6. Producir e interpretar mensajes corporales propios y de otros, y su traducción al lenguaje oral, escrito o visual",
      ],
      actitudinales: [
        "EF.2.3.a.4. Valorar las prácticas expresivo- comunicativas propias del territorio y su cultura",
        "EF.2.3.a.5. Respetar acuerdos colectivos en la creación y comunicación de prácticas expresivo-comunicativas",
        "EF.2.3.a.6. Celebrar la diversidad en la creación y participación en prácticas expresivo-comunicativas",
      ],
    },
  },
  {
    codigo: "CE.EF.5.1",
    descripcion:
      "Analizar diversas prácticas lúdicas mediante la construcción de estrategias cooperativas, el reconocimiento de sus contextos sociohistóricos y la valoración de las diferencias individuales, para transferir aprendizajes de equidad, trabajo en equipo y convivencia pacífica a su vida en comunidad",
    nivel: "BACHILLERATO",
    grados: ["PRIMER CURSO", "SEGUNDO CURSO", "TERCER CURSO"],
    indicadores: [
      {
        codigo: "I.EF.5.1.1",
        texto:
          "Resuelve las demandas técnicas, tácticas y estratégicas en diversas categorías de juego mediante la toma de decisiones autónoma para optimizar el desempeño motriz individual y colectivo",
      },
      {
        codigo: "I.EF.5.1.2",
        texto:
          "Transforma las dinámicas de juego que generan exclusión o discriminación mediante la aplicación de estrategias colectivas e inclusivas para garantizar el disfrute equitativo y la participación de todos los integrantes",
      },
      {
        codigo: "I.EF.5.1.3",
        texto:
          "Reorganiza el entorno físico y el sistema de reglas tras evaluar los factores de riesgo en el juego para prevenir lesiones y salvaguardar la seguridad propia y la de sus pares",
      },
    ],
    saberes: {
      declarativos: [
        "EF.5.1.d.1. Los juegos como manifestaciones sociales, históricas y culturales constantes en la historia de la humanidad, sus relaciones con el disfrute, la competencia y los resultados",
        "EF.5.1.d.2. Contextos de origen de los juegos, la creación de juegos como derecho y producción de cultura",
        "EF.5.1.d.3. Sentidos, significados y requerimientos (de comprensión, motrices, actitudinales y emocionales) otorgados por los y las participantes para la elaboración de tácticas y estrategias efectivas y seguras",
      ],
      procedimentales: [
        "EF.5.1.p.1. Participar en juegos reconociendo los contextos de origen y las formas en que expresan valores culturales",
        "EF.5.1.p.2. Establecer relaciones entre las características de los juegos y las dimensiones de comprensión, dominio motor, actitudinal y emocional de los participantes para procurar su análisis y mejorar los aspectos que lo requieran individual y colectivamente",
      ],
      actitudinales: [
        "EF.5.1.a.1. Valorar los juegos como expresiones sociales, históricas y culturales que fortalecen la identidad individual, colectiva y nacional, reconociendo su rol en la transmisión de tradiciones y valores comunitarios",
      ],
    },
  },
  {
    codigo: "CE.EF.5.2",
    descripcion:
      "Diseñar planes de ejercitación gimnástica mediante la evaluación consciente de la propia condición física, el análisis crítico de la información y la aplicación de estrategias de autoconfianza, para transferir hábitos de autocuidado al bienestar integral en la vida cotidiana",
    nivel: "BACHILLERATO",
    grados: ["PRIMER CURSO", "SEGUNDO CURSO", "TERCER CURSO"],
    indicadores: [
      {
        codigo: "I.EF.5.2.1",
        texto:
          "Diseña planes de ejercitación y composiciones gimnásticas complejas mediante la selección y adaptación autónoma de secuencias motrices para mejorar la condición física y transferir hábitos de autocuidado a la vida cotidiana",
      },
      {
        codigo: "I.EF.5.2.2",
        texto:
          "Evalúa las fuentes de información sobre rutinas gimnásticas difundidas en medios digitales y redes sociales mediante el análisis de su pertinencia y riesgos para aplicar prácticas de entrenamiento seguras y responsables",
      },
    ],
    saberes: {
      declarativos: [
        "EF.5.2.d.1. Conceptos de autonomía y conciencia corporal en las prácticas gimnásticas",
        "EF.5.2.d.2. La gimnasia formativa: estrategias de diseño y planificación para la mejora de la condición física",
      ],
      procedimentales: [
        "EF.5.2.p.1. Construir estrategias de autoobservación y autorregulación durante la ejecución de ejercicios gimnásticos, ajustando movimientos, intensidad y ritmo según las propias capacidades y sensaciones corporales, para favorecer la autonomía y la conciencia corporal en la práctica",
        "EF.5.2.p.2. Diseñar y realizar rutinas de ejercicios gimnásticos con diferentes elementos, favoreciendo la mejora de la condición física, reconociendo progresos y transferencias posibles a la vida cotidiana",
        "EF.5.2.p.3. Seleccionar, adaptar y combinar ejercicios gimnásticos (individuales y grupales) de manera autónoma, aplicando estrategias de mejora progresiva y autocontrol corporal",
      ],
      actitudinales: [
        "EF.5.2.a.1. Valorar la toma de decisiones en la práctica gimnástica como base para la autonomía y la conciencia corporal orientadas a una vida saludable",
        "EF.5.2.a.2. Disfrutar de las prácticas gimnásticas y de sus efectos en el reconocimiento del propio cuerpo y sus posibilidades",
      ],
    },
  },
  {
    codigo: "CE.EF.5.3",
    descripcion:
      "Crear producciones escénicas mediante la combinación consciente de diversos lenguajes corporales y la identificación de sus requerimientos técnicos, para valorar las manifestaciones expresivo-comunicativas como producciones socioculturales significativas en su entorno",
    nivel: "BACHILLERATO",
    grados: ["PRIMER CURSO", "SEGUNDO CURSO", "TERCER CURSO"],
    indicadores: [
      {
        codigo: "I.EF.5.3.1",
        texto:
          "Ejecuta prácticas expresivas mediante la articulación de requerimientos motores, actitudinales y emocionales para crear composiciones corporales auténticas y desinhibidas",
      },
      {
        codigo: "I.EF.5.3.2",
        texto:
          "Diseña composiciones escénicas mediante la integración consciente de diversos lenguajes corporales para transmitir mensajes con intencionalidad estética y comunicativa",
      },
      {
        codigo: "I.EF.5.3.3",
        texto:
          "Analiza los sentidos socioculturales de las prácticas expresivas que integra en sus producciones mediante la contextualización de su origen histórico, colectivo y situado para revalorizar el patrimonio cultural",
      },
    ],
    saberes: {
      declarativos: [
        "EF.5.3.d.1. La combinación de lenguajes corporales expresivos (danza, acrobacia, teatro, gimnasia, performance, circo) como formas de comunicación artística y cultural",
        "EF.5.3.d.2. Diferencias y similitudes entre los recursos expresivos de diferentes prácticas expresivo-comunicativas: espacio, tiempo, energía, ritmo, intención, relación, imagen, palabra, sonido, objetos, escenografía y recursos tecnológicos",
      ],
      procedimentales: [
        "EF.5.3.p.1. Diseñar y componer producciones escénicas que integren diversos lenguajes corporales, considerando el propósito expresivo y comunicativo",
        "EF.5.3.p.2. Seleccionar, combinar y adaptar recursos escénicos (movimiento, gesto, voz, objetos, música, imagen) de acuerdo con las intenciones comunicativas y el código de cada práctica corporal expresiva",
        "EF.5.3.p.3. Identificar y participar en distintos roles dentro del proceso creativo (intérprete, creador/a, director/a, espectador/a, técnico/a, crítico/a), reconociendo la importancia de cada función",
      ],
      actitudinales: [
        "EF.5.3.a.1. Valorar la diversidad de lenguajes corporales y estéticos como manifestaciones culturales legítimas y significativas",
        "EF.5.3.a.2. Asumir una actitud de apertura, sensibilidad y respeto frente a las diferentes formas de expresión propias y ajenas",
      ],
    },
  },
  {
    codigo: "CE.EF.5.4",
    descripcion:
      "Reconocer las características específicas de diversas manifestaciones dancísticas mediante la exploración de pasos básicos, la construcción de ambientes de trabajo colaborativo y la adopción de diversos roles, para promover la creación libre y el disfrute de la danza",
    nivel: "BACHILLERATO",
    grados: ["PRIMER CURSO", "SEGUNDO CURSO", "TERCER CURSO"],
    indicadores: [
      {
        codigo: "I.EF.5.4.1",
        texto:
          "Experimenta las características distintivas de diferentes danzas mediante la exploración de sus pasos, ritmos y estructuras para reconocer su diversidad cultural",
      },
      {
        codigo: "I.EF.5.4.2",
        texto:
          "Asume diversos roles en los procesos de creación e interpretación dancística mediante la práctica del respeto mutuo para consolidar producciones individuales y colectivas",
      },
      {
        codigo: "I.EF.5.4.3",
        texto:
          "Ejecuta formas propias de bailar mediante la integración autónoma de elementos de distintas danzas para favorecer la libre expresión y el disfrute corporal",
      },
    ],
    saberes: {
      declarativos: [
        "EF.5.4.d.1. Relación entre condición física, competencia motriz y estados corporales con los modos de participación en prácticas corporales y sus posibilidades de mejora y variabilidad",
        "EF.5.4.d.2. Factores personales y socioculturales que influyen en la elección y vivencia de las prácticas corporales: intereses, accesibilidad, contextos, disfrute y posibilidades",
      ],
      procedimentales: [
        "EF.5.4.p.1. Analizar la propia condición física, los estados corporales y la competencia motriz, identificando fortalezas y aspectos a mejorar para orientar decisiones sobre cómo participar en diversas prácticas corporales",
        "EF.5.4.p.2. Diseñar estrategias personales de mejora de la condición física y la competencia motriz, considerando objetivos, contextos y posibilidades en relación con las demandas de distintas prácticas corporales",
      ],
      actitudinales: [
        "EF.5.4.a.1. Asumir una participación responsable y autónoma, reconociendo los ritmos, posibilidades y deseos personales en la práctica corporal como condicionantes de los modos de actuación",
        "EF.5.4.a.2. Reflexionar críticamente sobre las relaciones entre la mejora de la condición física y la competencia motriz con la constancia en la práctica",
      ],
    },
  },
  {
    codigo: "CE.EF.5.5",
    descripcion:
      "Participar de manera consciente y autónoma en diversas prácticas corporales mediante el reconocimiento de la competencia motriz, estados corporales, sensaciones y emociones, para diseñar estrategias que sostengan desempeños activos, placenteros, seguros e inclusivos a lo largo de la vida",
    nivel: "BACHILLERATO",
    grados: ["PRIMER CURSO", "SEGUNDO CURSO", "TERCER CURSO"],
    indicadores: [
      {
        codigo: "I.EF.5.5.1",
        texto:
          "Autorregula su desempeño motriz mediante la lectura de sus estados corporales y emociones para adecuar su participación a sus posibilidades individuales y al contexto",
      },
      {
        codigo: "I.EF.5.5.2",
        texto:
          "Aplica estrategias de ajuste personal durante la práctica corporal para sostener su autonomía y disfrute a lo largo de las actividades",
      },
      {
        codigo: "I.EF.5.5.3",
        texto:
          "Adapta sus acciones motrices durante las actividades grupales para garantizar una participación autónoma, segura e inclusiva propia y de sus pares",
      },
    ],
    saberes: {
      declarativos: [
        "EF.2.3.d.1. Prácticas expresivo-comunicativas del propio contexto cultural, sus objetivos, lógicas y sentidos: danzas, celebraciones, juegos, rituales escolares y comunitarios",
        "EF.2.3.d.2. El derecho propio y de la comunidad a la cultura y a la participación en prácticas expresivas como patrimonio común",
        "EF.2.3.d.3. Diferenciación entre expresión y comunicación en las prácticas expresivo- comunicativas y su lugar en la producción y transmisión cultural",
      ],
      procedimentales: [
        "EF.2.3.p.1. Reconocer y diferenciar expresiones culturales diversas, sus objetivos, lógicas y sentidos (identitarios, festivos, comunitarios, históricos) que tienen en cada contexto",
        "EF.2.3.p.2. Identificar y diferenciar entre la realización de prácticas propias y expresiones culturales contextuales",
        "EF.2.3.p.3. Reconocer y transmitir mensajes expresivos propios de prácticas expresivo- comunicativas de su contexto",
        "EF.2.3.p.4. Participar en variadas prácticas expresivo-comunicativas locales y regionales, diferenciando sus lógicas y sentidos, interpelando los arquetipos de género",
      ],
      actitudinales: [
        "EF.2.3.a.1. Valorar la participación inclusiva en prácticas corporales expresivo-comunicativas",
        "EF.2.3.a.2. Reconocer y respetar las múltiples formas de participación en prácticas expresivo- comunicativas (creación, comunicación, observación, entre otras), propias y de los demás",
        "EF.2.3.a.3. Respetar acuerdos colectivos simples para la participación grupal en prácticas expresivo- comunicativas",
      ],
    },
  },
  {
    codigo: "CE.EF.5.6",
    descripcion:
      "Ejecutar diversas prácticas corporales de manera sistemática y reflexiva mediante el análisis de las relaciones entre movimiento, salud, diversidad y contextos socioculturales, para promover el cuidado personal, comunitario y ambiental en la vida cotidiana",
    nivel: "BACHILLERATO",
    grados: ["PRIMER CURSO", "SEGUNDO CURSO", "TERCER CURSO"],
    indicadores: [
      {
        codigo: "I.EF.5.6.1",
        texto:
          "Participa en diversas prácticas corporales mediante la adecuación consciente del esfuerzo a sus posibilidades para alcanzar sus objetivos de salud personales y colectivos",
      },
      {
        codigo: "I.EF.5.6.2",
        texto:
          "Reflexiona sobre la relación entre las prácticas corporales, la salud y los entornos socioculturales mediante la identificación de factores que condicionan el bienestar comunitario",
      },
      {
        codigo: "I.EF.5.6.3",
        texto:
          "Promueve acciones de cuidado personal, comunitario y ambiental durante la práctica corporal mediante la valoración activa de la diversidad corporal y las diferencias individuales",
      },
    ],
    saberes: {
      declarativos: [
        "EF.5.5.d.1. La salud como un bienestar físico, emocional, social y ambiental",
        "EF.5.5.d.2. Relaciones entre prácticas corporales, salud y contexto: factores personales (condición física, edad, genética, autopercepción, deseo), sociales (redes de apoyo, políticas públicas, roles de género), ambientales (seguridad, contaminación, accesibilidad) y culturales (tradiciones, influencia de los medios, concepción de cuerpo, belleza y salud) que inciden en el bienestar",
      ],
      procedimentales: [
        "EF.5.5.p.1. Participar en diversas prácticas corporales ajustando el esfuerzo, la intensidad y la duración de acuerdo con las propias posibilidades y objetivos personales",
        "EF.5.5.p.2. Planificar y sostener hábitos saludables en las prácticas corporales: acondicionamientos previos y recuperación, descanso, hidratación, uso responsable de los materiales, entre otros",
      ],
      actitudinales: [
        "EF.5.5.a.1. Valorar las prácticas corporales como un derecho y como medio de bienestar personal, social y ambiental",
        "EF.5.5.a.2. Reflexionar crítica y responsablemente sobre el impacto que tienen las prácticas corporales en el propio cuerpo y en el entorno",
      ],
    },
  },
  {
    codigo: "CE.EF.5.7",
    descripcion:
      "Aplicar la lógica interna y las reglas de diferentes deportes mediante ajustes tácticos individuales, colectivos y contextuales, para alcanzar objetivos comunes en un marco de juego limpio, seguridad, colaboración y análisis crítico de arquetipos excluyentes",
    nivel: "BACHILLERATO",
    grados: ["PRIMER CURSO", "SEGUNDO CURSO", "TERCER CURSO"],
    indicadores: [
      {
        codigo: "I.EF.5.7.1",
        texto:
          "Toma decisiones técnicas, tácticas y estratégicas en situaciones de juego mediante la identificación de la lógica interna, objetivos y reglas de diferentes deportes",
      },
      {
        codigo: "I.EF.5.7.2",
        texto:
          "Ajusta su desempeño individual y colectivo en diversos roles deportivos para contribuir a la consecución de objetivos comunes de manera segura y eficaz",
      },
      {
        codigo: "I.EF.5.7.3",
        texto:
          "Propone alternativas de participación equitativa y resolución pacífica de conflictos mediante la práctica del juego limpio y el análisis crítico de las dinámicas sociales del deporte",
      },
    ],
    saberes: {
      declarativos: [
        "EF.5.6.d.1. Lógica interna de diferentes prácticas deportivas: reglas, roles, espacios, tiempos, objetivos e interacción entre jugadores",
        "EF.5.6.d.2. Reconocimiento de los reglamentos oficiales y adaptados de diversas disciplinas deportivas",
        "EF.5.6.d.3. Identificación y comprensión de principios técnicos, tácticos y estratégicos básicos aplicables a deportes colectivos e individuales",
      ],
      procedimentales: [
        "EF.5.6.p.1. Participar en prácticas deportivas siguiendo reglas básicas y adaptadas",
        "EF.5.6.p.2. Resolver técnicas fundamentales (pases, recepciones, lanzamientos, desplazamientos, entre otras) de manera efectiva y segura, para favorecer una participación placentera en diferentes deportes",
        "EF.5.6.p.3. Seleccionar y ajustar técnicas y tácticas individuales en función de los pares, los oponentes, las situaciones de juego y la diversidad de contextos",
      ],
      actitudinales: [
        "EF.5.6.a.1. Valorar y practicar el juego limpio, mostrando respeto por las reglas, los compañeros/as, adversarios y árbitros",
        "EF.5.6.a.2. Colaborar activamente en los equipos, demostrando compromiso con los objetivos comunes",
        "EF.5.6.a.3. Respetar y promover la inclusión, reconociendo y valorando las diferencias individuales (género, habilidades, cultura, entre otras)",
      ],
    },
  },
];

export const COMPETENCIAS_EF: CompetenciaEspecificaCompleta[] =
  COMPETENCIAS_EF_POR_SUBNIVEL.map(
    ({ codigo, descripcion, nivel, grados, indicadores, saberes }) => ({
      codigo,
      descripcion,
      competenciasClave: [],
      porGrado: grados.map((grado) => ({ nivel, grado, indicadores, saberes })),
    }),
  );
