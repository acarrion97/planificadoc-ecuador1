/**
 * Catálogo de Competencias Específicas — Currículo Integrado
 * Nivel de Educación Inicial (3-5 años)
 *
 * Fuente: MESOCURRICULUM / 1. Inicial.xlsx
 * Codificación: CE.CI.0.X (Currículo Integrado, subnivel 0 = Inicial)
 */

export interface CompetenciaInicial {
  codigo: string;
  descripcion: string;
  competenciasClave: string[];
}

export const COMPETENCIAS_INICIAL: CompetenciaInicial[] = [
  {
    codigo: "CE.CI.0.1",
    descripcion: "Reconocer las características físicas, emociones, gustos y pertenencia familiar en situaciones cotidianas para fortalecer su identidad personal.",
    competenciasClave: ["CC", "CSE", "CCICC", "CIT", "CECA"],
  },
  {
    codigo: "CE.CI.0.2",
    descripcion: "Desarrollar progresivamente la autonomía mediante la práctica de hábitos cotidianos para fortalecer la autoestima y confianza en sí mismo.",
    competenciasClave: ["CC", "CMCT", "CIT", "CCICC", "CSE", "CECA"],
  },
  {
    codigo: "CE.CI.0.3",
    descripcion: "Aplicar normas básicas de seguridad en el hogar, en la escuela y en la calle, en situaciones cotidianas, para evitar accidentes y fortalecer la autonomía y autocuidado de manera progresiva.",
    competenciasClave: ["CCICC", "CIT", "CC", "CSE"],
  },
  {
    codigo: "CE.CI.0.4",
    descripcion: "Interactuar con otros, mostrando actitudes de solidaridad, el respeto y la empatía ante las diferencias individuales, para favorecer la convivencia armónica en su entorno.",
    competenciasClave: ["CSE", "CC", "CIT", "CCICC"],
  },
  {
    codigo: "CE.CI.0.5",
    descripcion: "Valorar los roles y actividades que realizan las personas del entorno familiar, escolar y comunitario, así como los servicios que brindan algunas instituciones, con respeto, para conocer su importancia en la vida cotidiana.",
    competenciasClave: ["CC", "CCICC", "CD", "CIT", "CSE"],
  },
  {
    codigo: "CE.CI.0.6",
    descripcion: "Aplicar normas básicas de convivencia y seguridad vial, para relacionarse de manera respetuosa y segura en los diferentes espacios de su entorno.",
    competenciasClave: ["CC", "CCICC", "CIT", "CSE"],
  },
  {
    codigo: "CE.CI.0.7",
    descripcion: "Participar en manifestaciones culturales de su contexto, a través del descubrimiento, la participación y disfrute de las prácticas tradicionales, para fortalecer su identidad y sentido de pertenencia a su familia y comunidad.",
    competenciasClave: ["CSE", "CECA", "CIT", "CCICC", "CC"],
  },
  {
    codigo: "CE.CI.0.8",
    descripcion: "Demostrar sentido de pertenencia hacia la comunidad y país mediante el reconocimiento de símbolos representativos y la participación en acciones de cuidado del entorno.",
    competenciasClave: ["CIT", "CECA", "CCICC", "CMCT", "CC"],
  },
  {
    codigo: "CE.CI.0.9",
    descripcion: "Expresar emociones básicas en situaciones cotidianas mediante interacciones respetuosas y la regulación progresiva de sus emociones con acompañamiento de un adulto, para favorecer el bienestar y la convivencia en el entorno familiar y escolar.",
    competenciasClave: ["CC", "CCICC", "CIT", "CSE"],
  },
  {
    codigo: "CE.CI.0.10",
    descripcion: "Explorar características y elementos del mundo natural mediante los sentidos y experiencias sencillas, para favorecer la curiosidad, el descubrimiento progresivo y el cuidado de su entorno con apoyo del adulto.",
    competenciasClave: ["CSE", "CC", "CIT"],
  },
  {
    codigo: "CE.CI.0.11",
    descripcion: "Participar en acciones sencillas de cuidado y conservación de los espacios naturales y cotidianos, reconociendo la importancia de mantener ambientes limpios y saludables con acompañamiento del adulto.",
    competenciasClave: ["CIT", "CC", "CMCT", "CSE"],
  },
  {
    codigo: "CE.CI.0.12",
    descripcion: "Construir patrones, secuencias y nociones básicas de tiempo en juegos y situaciones cotidianas para establecer y organizar sus experiencias con apoyo del adulto.",
    competenciasClave: ["CC", "CMCT", "CSE", "CECA", "CIT"],
  },
  {
    codigo: "CE.CI.0.13",
    descripcion: "Relación de objetos del entorno mediante nociones espaciales, de tamaño, cantidad y medida a través de la manipulación y el juego.",
    competenciasClave: ["CSE", "CECA", "CIT", "CCICC", "CMCT", "CD"],
  },
  {
    codigo: "CE.CI.0.14",
    descripcion: "Clasificar objetos del entorno mediante sus características, el conteo, la correspondencia y situaciones cotidianas de uso responsable de los recursos, para desarrollar el pensamiento lógico-matemático inicial.",
    competenciasClave: ["CC", "CMCT", "CD", "CIT", "CSE", "CECA"],
  },
  {
    codigo: "CE.CI.0.15",
    descripcion: "Expresar necesidades, emociones, intenciones y vivencias, mediante la exploración y uso del lenguaje oral para interactuar en diferentes situaciones y contextos.",
    competenciasClave: ["CSE", "CECA", "CIT", "CMCT", "CD", "CC"],
  },
  {
    codigo: "CE.CI.0.16",
    descripcion: "Participar en actividades individuales y colectivas relacionadas con textos literarios y no literarios para comprender, relatar e intercambiar ideas con interés y disfrute.",
    competenciasClave: ["SSE", "CECA", "CD", "CCICC", "CC"],
  },
  {
    codigo: "CE.CI.0.17",
    descripcion: "Interpretar imágenes, signos, mensajes, textos y representaciones a partir de experiencias cotidianas para su comprensión.",
    competenciasClave: ["CC", "CSE", "CMCT", "CCICC", "CD", "CIT"],
  },
  {
    codigo: "CE.CI.0.18",
    descripcion: "Participar en actividades de producción de textos mediante dibujos y escritura no convencional, para comunicar ideas en situaciones cotidianas.",
    competenciasClave: ["CC", "CMCT", "CIT", "CCICC", "CSE"],
  },
  {
    codigo: "CE.CI.0.19",
    descripcion: "Participar en juegos de lenguaje mediante sonidos, rimas y palabras para fortalecer la expresión oral.",
    competenciasClave: ["CC", "CECA", "CSE", "CIT", "CD", "CCICC"],
  },
  {
    codigo: "CE.CI.0.20",
    descripcion: "Producir mensajes mediante el lenguaje gráfico y escrito (propios códigos) para comunicar ideas, necesidades y experiencias en situaciones cotidianas.",
    competenciasClave: ["CC", "CMCT", "CCICC", "CIT", "CSE"],
  },
  {
    codigo: "CE.CI.0.21",
    descripcion: "Participar en actividades artísticas individuales y colectivas mediante dramatizaciones, música, danzas y juegos para favorecer la creatividad y el disfrute.",
    competenciasClave: ["CC", "CECA", "CD", "CIT", "CSE", "CCICC"],
  },
  {
    codigo: "CE.CI.0.22",
    descripcion: "Expresar creativamente ideas, emociones y vivencias mediante técnicas grafoplásticas y diversos materiales artísticos.",
    competenciasClave: ["CC", "CCICC", "CMCT", "CD", "CSE", "CECA"],
  },
  {
    codigo: "CE.CI.0.23",
    descripcion: "Reproducir patrones rítmicos y sonidos onomatopéyicos, naturales y artificiales mediante el cuerpo, la voz y objetos para fortalecer la percepción auditiva, coordinación y expresión creativa.",
    competenciasClave: ["CC", "CMCT", "CECA", "CSE"],
  },
  {
    codigo: "CE.CI.0.24",
    descripcion: "Construir progresivamente el esquema corporal mediante la identificación de las partes y articulaciones del cuerpo, lado dominante, exploración sensorial, fortaleciendo la identidad, autonomía, y valoración positiva de sí mismo.",
    competenciasClave: ["CC", "CECA", "CSE"],
  },
  {
    codigo: "CE.CI.0.25",
    descripcion: "Desarrollar progresivamente el control mediante movimientos coordinados, desplazamientos seguros en diferentes espacios fortaleciendo la fuerza, el equilibrio, la coordinación motriz, el control y seguridad en la acción corporal.",
    competenciasClave: ["CC", "CMCT", "CSE", "CECA"],
  },
  {
    codigo: "CE.CI.0.26",
    descripcion: "Coordinar progresivamente los movimientos de ambos lados del cuerpo mediante actividades de bilateralidad, lateralidad y simetría, fortaleciendo la coordinación corporal, la autonomía motriz y la precisión de los movimientos.",
    competenciasClave: ["CMCT", "CSE", "CECA"],
  },
  {
    codigo: "CE.CI.0.27",
    descripcion: "Desarrollar progresivamente la orientación espacial y temporal mediante desplazamientos, recorridos y experiencias cotidianas que favorezcan el uso de nociones espaciales y temporales para ubicarse en relación consigo mismo, las personas, los objetos y el entorno.",
    competenciasClave: ["CC", "CMCT", "CSE"],
  },
];
