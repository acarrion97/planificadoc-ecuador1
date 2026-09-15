/**
 * Catálogo de Competencias Específicas — Currículo Integrado
 * Fuente: MESOCURRICULUM / "7. Educación Cultural y Artística.xlsx" (Matriz de distribución/desagregación
 * de saberes e indicadores de evaluación).
 *
 * Codificación oficial:
 *   - Competencia específica: CE.<ÁREA>.<subnivel>.<secuencial>
 *   - Saberes: <ÁREA>.<subnivel>.<bloque>.<d|p|a>.<n>
 *   - Indicadores de evaluación: I.<ÁREA>.<subnivel>.<secuencial>.<n>
 *
 * Extraído directamente de la matriz oficial (no texto parafraseado) para
 * evitar códigos inventados o desalineados con el catálogo del MINEDUC.
 */

import type { CompetenciaEspecificaCompleta } from "./types-competencias-especificas";

export const COMPETENCIAS_ECA: CompetenciaEspecificaCompleta[] = [
  {
    codigo: "CE.ECA.2.1",
    descripcion: "Representar las características del propio cuerpo y de otras personas mediante producciones gráficas, sonoras y corporales para expresar la identidad, fortalecer el autoconocimiento y valorar la diversidad",
    competenciasClave: ["CC", "CSE", "CECA", "CCICC"],
    porGrado: [
      {
        nivel: "ELEMENTAL",
        grado: "SEGUNDO GRADO",
        indicadores: [
          { codigo: "I.ECA.2.1.1", texto: "Explica los rasgos de su cuerpo representados en la actividad de autorrepresentación y describe cómo los plasmó mediante posturas, movimientos y materiales gráficos, sonoros o corporales" },
        ],
        saberes: {
          declarativos: [
            "ECA.2.1.d.1. Recursos de color, gesto y soporte para representar siluetas del cuerpo y huellas de las manos y pies.",
            "ECA.2.1.d.2. Elementos identitarios del cuerpo (rasgos, accesorios, símbolos personales).",
            "ECA.2.1.d.5. Posibilidades del cuerpo en movimiento ante distintos estímulos.",
            "ECA.2.3.d.1. Rasgos de personas (piel, pelo, fisonomía, voz) en diversas culturas y contextos.",
          ],
          procedimentales: [
            "ECA.2.1.p.1. Estampar siluetas y huellas con diversos materiales y soportes.",
            "ECA.2.1.p.2. Incorporar rasgos de individualidad en autorrepresentaciones gráficas.",
            "ECA.2.1.p.5. Explorar desplazamientos y gestos corporales en respuesta a estímulos.",
            "ECA.2.3.p.1. Explicar similitudes y diferencias de rasgos personales con observación directa o fotográfica.",
          ],
          actitudinales: [
            "ECA.2.1.a.3. Valorar el cuerpo como medio de expresión y el entorno como fuente de inspiración.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "TERCER GRADO",
        indicadores: [
          { codigo: "I.ECA.2.1.2", texto: "Describe rasgos de personas de su entorno y de representaciones artísticas del contexto próximo, señalando similitudes y diferencias con vocabulario claro y respetuoso" },
        ],
        saberes: {
          declarativos: [
            "ECA.2.1.d.6. Descripción de texturas naturales y artificiales.",
            "ECA.2.3.d.2. Representaciones de personas en artesanía, escultura e imagen (cultura visual local).",
          ],
          procedimentales: [
            "ECA.2.1.p.6. Reconocer y clasificar texturas naturales y artificiales; inventar texturas nuevas.",
            "ECA.2.3.p.2. Indagar, observar, describir y comparar representaciones de personas en el entorno cultural.",
          ],
          actitudinales: [
            "ECA.2.1.a.1. Reflexionar oralmente sobre los resultados de sus representaciones.",
            "ECA.2.3.a.1. Respetar la diversidad de rasgos y culturas representadas en el entorno.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "CUARTO GRADO",
        indicadores: [
          { codigo: "I.ECA.2.1.1", texto: "Explica los rasgos de su cuerpo representados en la actividad de autorrepresentación y describe cómo los plasmó mediante posturas, movimientos y materiales gráficos, sonoros o corporales" },
          { codigo: "I.ECA.2.1.2", texto: "Describe rasgos de personas de su entorno y de representaciones artísticas del contexto próximo, señalando similitudes y diferencias con vocabulario claro y respetuoso" },
        ],
        saberes: {
          declarativos: [
            "ECA.2.1.d.1. Recursos de color, gesto y soporte para representar siluetas del cuerpo y huellas de las manos y pies.",
            "ECA.2.1.d.2. Elementos identitarios del cuerpo (rasgos, accesorios, símbolos personales).",
            "ECA.2.1.d.5. Posibilidades del cuerpo en movimiento ante distintos estímulos.",
            "ECA.2.1.d.6. Descripción de texturas naturales y artificiales.",
            "ECA.2.3.d.1. Rasgos de personas (piel, pelo, fisonomía, voz) en diversas culturas y contextos.",
            "ECA.2.3.d.2. Representaciones de personas en artesanía, escultura e imagen (cultura visual local).",
          ],
          procedimentales: [
            "ECA.2.1.p.1. Estampar siluetas y huellas con diversos materiales y soportes.",
            "ECA.2.1.p.2. Incorporar rasgos de individualidad en autorrepresentaciones gráficas.",
            "ECA.2.1.p.5. Explorar desplazamientos y gestos corporales en respuesta a estímulos.",
            "ECA.2.1.p.6. Reconocer y clasificar texturas naturales y artificiales; inventar texturas nuevas.",
            "ECA.2.3.p.1. Explicar similitudes y diferencias de rasgos personales con observación directa o fotográfica.",
            "ECA.2.3.p.2. Indagar, observar, describir y comparar representaciones de personas en el entorno cultural.",
          ],
          actitudinales: [
            "ECA.2.1.a.1. Reflexionar oralmente sobre los resultados de sus representaciones.",
            "ECA.2.1.a.3. Valorar el cuerpo como medio de expresión y el entorno como fuente de inspiración.",
            "ECA.2.3.a.1. Respetar la diversidad de rasgos y culturas representadas en el entorno.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.ECA.2.2",
    descripcion: "Experimentar con las cualidades de elementos naturales y artificiales utilizando los sentidos y diversos materiales para crear producciones artísticas que fortalezcan el criterio estético, la creatividad y el pensamiento crítico",
    competenciasClave: ["CMCT", "CECA", "CIT"],
    porGrado: [
      {
        nivel: "ELEMENTAL",
        grado: "SEGUNDO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "ECA.2.1.d.1. Recursos de color, gesto y soporte para representar siluetas del cuerpo y huellas de las manos y pies.",
            "ECA.2.1.d.2. Elementos identitarios del cuerpo (rasgos, accesorios, símbolos personales).",
            "ECA.2.3.d.1. Rasgos de personas (piel, pelo, fisonomía, voz) en diversas culturas y contextos.",
          ],
          procedimentales: [
            "ECA.2.1.p.1. Estampar siluetas y huellas con diversos materiales y soportes.",
            "ECA.2.1.p.2. Incorporar rasgos de individualidad en autorrepresentaciones gráficas.",
            "ECA.2.1.p.5. Explorar desplazamientos y gestos corporales en respuesta a estímulos.",
            "ECA.2.3.p.1. Explicar similitudes y diferencias de rasgos personales con observación directa o fotográfica.",
          ],
          actitudinales: [
            "ECA.2.1.a.1. Reflexionar oralmente sobre los resultados de sus representaciones.",
            "ECA.2.1.a.3. Valorar el cuerpo como medio de expresión y el entorno como fuente de inspiración.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "TERCER GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "ECA.2.1.d.6. Descripción de texturas naturales y artificiales.",
            "ECA.2.3.d.1. Rasgos de personas (piel, pelo, fisonomía, voz) en diversas culturas y contextos.",
            "ECA.2.3.d.2. Representaciones de personas en artesanía, escultura e imagen (cultura visual local).",
          ],
          procedimentales: [
            "ECA.2.1.p.6. Reconocer y clasificar texturas naturales y artificiales; inventar texturas nuevas.",
            "ECA.2.3.p.1. Explicar similitudes y diferencias de rasgos personales con observación directa o fotográfica.",
            "ECA.2.3.p.2. Indagar, observar, describir y comparar representaciones de personas en el entorno cultural.",
          ],
          actitudinales: [
            "ECA.2.3.a.1. Respetar la diversidad de rasgos y culturas representadas en el entorno.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "CUARTO GRADO",
        indicadores: [
        ],
        saberes: {
          declarativos: [
            "ECA.2.1.d.1. Recursos de color, gesto y soporte para representar siluetas del cuerpo y huellas de las manos y pies.",
            "ECA.2.1.d.2. Elementos identitarios del cuerpo (rasgos, accesorios, símbolos personales).",
            "ECA.2.1.d.5. Posibilidades del cuerpo en movimiento ante distintos estímulos.",
            "ECA.2.1.d.6. Descripción de texturas naturales y artificiales.",
            "ECA.2.3.d.1. Rasgos de personas (piel, pelo, fisonomía, voz) en diversas culturas y contextos.",
            "ECA.2.3.d.2. Representaciones de personas en artesanía, escultura e imagen (cultura visual local).",
          ],
          procedimentales: [
            "ECA.2.1.p.1. Estampar siluetas y huellas con diversos materiales y soportes.",
            "ECA.2.1.p.2. Incorporar rasgos de individualidad en autorrepresentaciones gráficas.",
            "ECA.2.1.p.5. Explorar desplazamientos y gestos corporales en respuesta a estímulos.",
            "ECA.2.1.p.6. Reconocer y clasificar texturas naturales y artificiales; inventar texturas nuevas.",
            "ECA.2.3.p.1. Explicar similitudes y diferencias de rasgos personales con observación directa o fotográfica.",
            "ECA.2.3.p.2. Indagar, observar, describir y comparar representaciones de personas en el entorno cultural.",
          ],
          actitudinales: [
            "ECA.2.1.a.1. Reflexionar oralmente sobre los resultados de sus representaciones.",
            "ECA.2.1.a.3. Valorar el cuerpo como medio de expresión y el entorno como fuente de inspiración.",
            "ECA.2.3.a.1. Respetar la diversidad de rasgos y culturas representadas en el entorno.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.ECA.2.3",
    descripcion: "Representar el entorno natural y artificial mediante la observación, la comparación y la utilización de diversas técnicas y lenguajes artísticos para fortalecer la sensibilidad estética, el cuidado del ambiente y el sentido de pertenencia",
    competenciasClave: ["CC", "CECA", "CCICC", "CIT"],
    porGrado: [
      {
        nivel: "ELEMENTAL",
        grado: "SEGUNDO GRADO",
        indicadores: [
          { codigo: "I.ECA.2.3.1", texto: "Observa representaciones del entorno natural y artificial y comenta sus características con vocabulario sencillo" },
          { codigo: "I.ECA.2.3.2", texto: "Representa el entorno natural y artificial aplicando diversas técnicas gráficas, sonoras o corporales" },
        ],
        saberes: {
          declarativos: [
            "ECA.2.1.d.6. Descripción de texturas naturales y artificiales.",
            "ECA.2.1.d.7. Rasgos y sensaciones producidas de elementos del entorno natural (plantas, agua, sonidos, etc.).",
            "ECA.2.1.d.9. Partes y espacios de la vivienda (estancias y usos cotidianos) y su representación.",
            "ECA.2.2.d.4. Registros del entorno: gráficos, corporales y sonoros.",
            "ECA.2.3.d.5. Lugares representativos del patrimonio cultural y natural del entorno próximo.",
          ],
          procedimentales: [
            "ECA.2.1.p.6. Reconocer y clasificar texturas naturales y artificiales; inventar texturas nuevas. colectivas.",
            "ECA.2.3.p.3. Describir elementos plásticos del entorno artificial con un adecuado vocabulario.",
            "ECA.2.3.p.5. Registrar y describir, mediante textos, imágenes o grabaciones, los lugares patrimoniales y los espacios escolares intervenidos.",
            "ECA.2.3.p.6. Diseñar y construir juguetes tradicionales con materiales de desecho o bajo costo.",
            "ECA.2.3.p.7. Observar, fotografiar y comparar construcciones y sitios representativos durante paseos.",
          ],
          actitudinales: [
            "ECA.2.1.a.3. Valorar el cuerpo como medio de expresión y el entorno como fuente de inspiración.",
            "ECA.2.3.a.2. Valorar el patrimonio cultural y natural local como bien común.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "TERCER GRADO",
        indicadores: [
          { codigo: "I.ECA.2.3.3", texto: "Elabora producciones propias tomando como modelo objetos y obras artísticas del entorno" },
        ],
        saberes: {
          declarativos: [
            "ECA.2.2.d.5. Creaciones con elementos del entorno (land art, instrumentos con vegetales, etc.).",
            "ECA.2.3.d.3. Elementos plásticos del entorno artificial y vocabulario descriptivo.",
            "ECA.2.3.d.6. Juguetes tradicionales y populares; materiales reciclados.",
            "ECA.2.3.d.7. Transformación creativa de objetos y espacios en la escuela.",
          ],
          procedimentales: [
            "ECA.2.1.p.8. Representar un espacio cotidiano del entorno próximo (hogar, aula, patio o barrio) y describir sus rasgos principales.",
            "ECA.2.2.p.4. Producir representaciones propias del entorno natural y artificial utilizando diversas técnicas.",
            "ECA.2.2.p.5. Utilizar elementos del entorno (madera, hojas, piedras, etc.) en creaciones colectivas.",
            "ECA.2.3.p.3. Describir elementos plásticos del entorno artificial con un adecuado vocabulario.",
          ],
          actitudinales: [
            "ECA.2.2.a.3. Valorar el uso creativo de objetos cotidianos y elementos del entorno en obras colectivas.",
            "ECA.2.3.a.2. Valorar el patrimonio cultural y natural local como bien común.",
            "ECA.2.3.a.3. Cuidar y mejorar los espacios escolares compartidos con responsabilidad.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "CUARTO GRADO",
        indicadores: [
          { codigo: "I.ECA.2.3.1", texto: "Observa representaciones del entorno natural y artificial y comenta sus características con vocabulario sencillo" },
          { codigo: "I.ECA.2.3.2", texto: "Representa el entorno natural y artificial aplicando diversas técnicas gráficas, sonoras o corporales" },
          { codigo: "I.ECA.2.3.3", texto: "Elabora producciones propias tomando como modelo objetos y obras artísticas del entorno" },
        ],
        saberes: {
          declarativos: [
            "ECA.2.1.d.6. Descripción de texturas naturales y artificiales.",
            "ECA.2.1.d.7. Rasgos y sensaciones producidas de elementos del entorno natural (plantas, agua, sonidos, etc.).",
            "ECA.2.1.d.9. Partes y espacios de la vivienda (estancias y usos cotidianos) y su representación.",
            "ECA.2.2.d.4. Registros del entorno: gráficos, corporales y sonoros.",
            "ECA.2.2.d.5. Creaciones con elementos del entorno (land art, instrumentos con vegetales, etc.).",
            "ECA.2.3.d.3. Elementos plásticos del entorno artificial y vocabulario. descriptivo.",
            "ECA.2.3.d.5. Lugares representativos del patrimonio cultural y natural del entorno próximo.",
            "ECA.2.3.d.6. Juguetes tradicionales y populares; materiales reciclados.",
            "ECA.2.3.d.7. Transformación creativa de objetos y espacios en la escuela.",
          ],
          procedimentales: [
            "ECA.2.1.p.6. Reconocer y clasificar texturas naturales y artificiales; inventar texturas nuevas.",
            "ECA.2.1.p.8. Representar un espacio cotidiano del entorno próximo (hogar, aula, patio o barrio) y describir sus rasgos principales.",
            "ECA.2.2.p.4. Producir representaciones propias del entorno natural y artificial utilizando diversas técnicas.",
            "ECA.2.2.p.5. Utilizar elementos del entorno (madera, hojas, piedras, etc.) en creaciones colectivas.",
            "ECA.2.3.p.3. Describir elementos plásticos del entorno artificial con un adecuado vocabulario.",
            "ECA.2.3.p.5. Registrar y describir, mediante textos, imágenes o grabaciones, los lugares patrimoniales y los espacios escolares intervenidos.",
            "ECA.2.3.p.6. Diseñar y construir juguetes tradicionales con materiales de desecho o bajo costo.",
            "ECA.2.3.p.7. Observar, fotografiar y comparar construcciones y sitios representativos durante paseos.",
          ],
          actitudinales: [
            "ECA.2.1.a.3. Valorar el cuerpo como medio de expresión y el entorno como fuente de inspiración.",
            "ECA.2.2.a.3. Valorar el uso creativo de objetos cotidianos y elementos del entorno en obras colectivas.",
            "ECA.2.3.a.2. Valorar el patrimonio cultural y natural local como bien común.",
            "ECA.2.3.a.3. Cuidar y mejorar los espacios escolares compartidos con responsabilidad.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.ECA.2.4",
    descripcion: "Crear producciones artísticas individuales y colectivas utilizando referentes, técnicas y diversos lenguajes artísticos para expresar emociones, vivencias e ideas, fortaleciendo la imaginación, la comunicación estética y el trabajo colaborativo",
    competenciasClave: ["CC", "CSE", "CECA", "CIT"],
    porGrado: [
      {
        nivel: "ELEMENTAL",
        grado: "SEGUNDO GRADO",
        indicadores: [
          { codigo: "I.ECA.2.4.1", texto: "Crea producciones artísticas propias inspiradas en referentes visuales, sonoros o escénicos, aplicando elementos observados" },
        ],
        saberes: {
          declarativos: [
            "ECA.2.1.d.5. Posibilidades del cuerpo en movimiento ante distintos estímulos.",
            "ECA.2.2.d.1. Elementos para interpretar historias breves en grupo (espacios, personajes, recursos visuales/sonoros).",
            "ECA.2.2.d.3. Principios simples de coreografía e interacción (dirigir, seguir, acercarse, alejarse).",
          ],
          procedimentales: [
            "ECA.2.1.p.5. Explorar desplazamientos y gestos corporales en respuesta a estímulos.",
            "ECA.2.1.p.7. Seleccionar y usar materiales orgánicos e inorgánicos para producciones, títeres u objetos sonoros.",
            "ECA.2.2.p.1. Interpretar historias en pequeños grupos, acordando acciones y caracterizaciones.",
            "ECA.2.2.p.3. Crear coreografías a partir de improvisaciones y roles de interacción.",
            "ECA.2.2.p.4. Producir representaciones propias del entorno natural y artificial utilizando diversas técnicas.",
            "ECA.2.2.p.5. Utilizar elementos del entorno (madera, hojas, piedras, etc.) en creaciones colectivas.",
          ],
          actitudinales: [
            "ECA.2.2.a.2. Asumir con disposición roles de liderazgo y de seguimiento en actividades grupales.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "TERCER GRADO",
        indicadores: [
          { codigo: "I.ECA.2.4.2", texto: "Participa en representaciones colectivas de música, movimiento o teatro, asumiendo un rol definido y aplicando técnicas básicas de expresión artística" },
        ],
        saberes: {
          declarativos: [
            "ECA.2.2.d.5. Creaciones con elementos del entorno (land art, instrumentos con vegetales, etc.).",
            "ECA.2.2.d.6. Esculturas sonoras y su relación con el espacio de uso.",
            "ECA.2.2.d.7. Recursos de títeres y marionetas para narración.",
            "ECA.2.3.d.4. Producciones escénicas del entorno (música, danza, teatro) y criterios de apreciación básica.",
          ],
          procedimentales: [
            "ECA.2.2.p.6. Construir e instalar esculturas sonoras y observar su uso por la comunidad.",
            "ECA.2.2.p.7. Construir y utilizar títeres o marionetas, coordinando ensayos y representación.",
            "ECA.2.2.p.8. Reinterpretar cuentos y mitos incorporando personajes nuevos.",
            "ECA.2.3.p.4. Comentar impresiones ante producciones escénicas locales.",
            "ECA.2.3.p.8. Recopilar información sobre personajes de cuentos tradicionales, mitos y leyendas.",
            "ECA.2.3.p.9. Modificar personajes tradicionales y elaborar nuevas historias (dibujo, figuras o relato).",
          ],
          actitudinales: [
            "ECA.2.2.a.1. Cooperar y respetar acuerdos en proyectos colectivos.",
            "ECA.2.2.a.3. Valorar el uso creativo de objetos cotidianos y elementos del entorno en obras colectivas.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "CUARTO GRADO",
        indicadores: [
          { codigo: "I.ECA.2.4.1", texto: "Crea producciones artísticas propias inspiradas en referentes visuales, sonoros o escénicos, aplicando elementos observados" },
          { codigo: "I.ECA.2.4.2", texto: "Participa en representaciones colectivas de música, movimiento o teatro, asumiendo un rol definido y aplicando técnicas básicas de expresión artística" },
        ],
        saberes: {
          declarativos: [
            "ECA.2.1.d.5. Posibilidades del cuerpo en movimiento ante distintos estímulos.",
            "ECA.2.2.d.1. Elementos para interpretar historias breves en grupo (espacios, personajes, recursos visuales/sonoros).",
            "ECA.2.2.d.3. Principios simples de coreografía e interacción (dirigir, seguir, acercarse, alejarse).",
            "ECA.2.2.d.5. Creaciones con elementos del entorno (land art, instrumentos con vegetales, etc.).",
            "ECA.2.2.d.6. Esculturas sonoras y su relación con el espacio de uso.",
            "ECA.2.2.d.7. Recursos de títeres y marionetas para narración.",
            "ECA.2.3.d.4. Producciones escénicas del entorno (música, danza, teatro) y criterios de apreciación básica.",
          ],
          procedimentales: [
            "ECA.2.1.p.5. Explorar desplazamientos y gestos corporales en respuesta a estímulos.",
            "ECA.2.1.p.7. Seleccionar y usar materiales orgánicos e inorgánicos para producciones, títeres u objetos sonoros.",
            "ECA.2.2.p.1. Interpretar historias en pequeños grupos, acordando acciones y caracterizaciones.",
            "ECA.2.2.p.3. Crear coreografías a partir de improvisaciones y roles de interacción.",
            "ECA.2.2.p.4. Producir representaciones propias del entorno natural y artificial utilizando diversas técnicas.",
            "ECA.2.2.p.5. Utilizar elementos del entorno (madera, hojas, piedras, etc.) en creaciones colectivas.",
            "ECA.2.2.p.6. Construir e instalar esculturas sonoras y observar su uso por la comunidad.",
            "ECA.2.2.p.7. Construir y utilizar títeres o marionetas, coordinando ensayos y representación.",
            "ECA.2.2.p.8. Reinterpretar cuentos y mitos incorporando personajes nuevos.",
            "ECA.2.3.p.4. Comentar impresiones ante producciones escénicas locales.",
            "ECA.2.3.p.8. Recopilar información sobre personajes de cuentos tradicionales, mitos y leyendas.",
            "ECA.2.3.p.9. Modificar personajes tradicionales y elaborar nuevas historias (dibujo, figuras o relato).",
          ],
          actitudinales: [
            "ECA.2.2.a.1. Cooperar y respetar acuerdos en proyectos colectivos.",
            "ECA.2.2.a.2. Asumir con disposición roles de liderazgo y de seguimiento en actividades grupales.",
            "ECA.2.2.a.3. Valorar el uso creativo de objetos cotidianos y elementos del entorno en obras colectivas.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.ECA.2.5",
    descripcion: "Identificar manifestaciones culturales y artísticas del entorno cercano mediante su registro, descripción y organización en diversos lenguajes y recursos, para fortalecer la apreciación estética, el respeto por la diversidad cultural y la valoración del patrimonio como parte de la memoria social",
    competenciasClave: ["CC", "CMCT", "CD", "CCICC", "CSE", "CECA"],
    porGrado: [
      {
        nivel: "ELEMENTAL",
        grado: "SEGUNDO GRADO",
        indicadores: [
          { codigo: "I.ECA.2.5.1", texto: "Expresa puntos de vista sobre manifestaciones culturales y artísticas del entorno próximo mediante descripciones orales o escritas" },
        ],
        saberes: {
          declarativos: [
            "ECA.2.2.d.4. Registros del entorno: gráficos, corporales y sonoros.",
            "ECA.2.3.d.4. Producciones escénicas del entorno (música, danza, teatro) y criterios de apreciación básica.",
            "ECA.2.3.d.7. Transformación creativa de objetos y espacios en la escuela.",
          ],
          procedimentales: [
            "ECA.2.2.p.9. Documentar con imágenes, fotos o videos la preparación de comidas típicas y elaborar recetarios ilustrados.",
            "ECA.2.3.p.4. Comentar impresiones ante producciones escénicas locales.",
            "ECA.2.3.p.7. Observar, fotografiar y comparar construcciones y sitios representativos durante paseos.",
            "ECA.2.3.p.8. Recopilar información sobre personajes de cuentos tradicionales, mitos y leyendas.",
          ],
          actitudinales: [
            "ECA.2.1.a.3. Valorar el cuerpo como medio de expresión y el entorno como fuente de inspiración.",
            "ECA.2.3.a.2. Valorar el patrimonio cultural y natural local como bien común.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "TERCER GRADO",
        indicadores: [
          { codigo: "I.ECA.2.5.2", texto: "Registra manifestaciones culturales y artísticas en soportes gráficos, sonoros o audiovisuales y organiza la información en producciones colectivas como álbumes, murales o archivos" },
        ],
        saberes: {
          declarativos: [
            "ECA.2.2.d.4. Registros del entorno: gráficos, corporales y sonoros.",
            "ECA.2.3.d.4. Producciones escénicas del entorno (música, danza, teatro) y criterios de apreciación básica.",
            "ECA.2.3.d.5. Lugares representativos del patrimonio cultural y natural del entorno próximo.",
            "ECA.2.3.d.7. Transformación creativa de objetos y espacios en la escuela.",
          ],
          procedimentales: [
            "ECA.2.2.p.4. Producir representaciones propias del entorno natural y artificial utilizando diversas técnicas.",
            "ECA.2.3.p.5. Registrar y describir, mediante textos, imágenes o grabaciones, los lugares patrimoniales y los espacios escolares intervenidos.",
            "ECA.2.3.p.11. Incorporar producciones artísticas al mejoramiento de espacios escolares.",
          ],
          actitudinales: [
            "ECA.2.3.a.3. Cuidar y mejorar los espacios escolares compartidos con responsabilidad.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "CUARTO GRADO",
        indicadores: [
          { codigo: "I.ECA.2.5.1", texto: "Expresa puntos de vista sobre manifestaciones culturales y artísticas del entorno próximo mediante descripciones orales o escritas" },
          { codigo: "I.ECA.2.5.2", texto: "Registra manifestaciones culturales y artísticas en soportes gráficos, sonoros o audiovisuales y organiza la información en producciones colectivas como álbumes, murales o archivos" },
        ],
        saberes: {
          declarativos: [
            "ECA.2.2.d.4. Registros del entorno: gráficos, corporales y sonoros.",
            "ECA.2.3.d.4. Producciones escénicas del entorno (música, danza, teatro) y criterios de apreciación básica.",
            "ECA.2.3.d.5. Lugares representativos del patrimonio cultural y natural del entorno próximo.",
            "ECA.2.3.d.7. Transformación creativa de objetos y espacios en la escuela.",
          ],
          procedimentales: [
            "ECA.2.2.p.4. Producir representaciones propias del entorno natural y artificial utilizando diversas técnicas.",
            "ECA.2.2.p.9. Documentar con imágenes, fotos o videos la preparación de comidas típicas y elaborar recetarios ilustrados.",
            "ECA.2.3.p.4. Comentar impresiones ante producciones escénicas locales.",
            "ECA.2.3.p.5. Registrar y describir, mediante textos, imágenes o grabaciones, los lugares patrimoniales y los espacios escolares intervenidos.",
            "ECA.2.3.p.7. Observar, fotografiar y comparar construcciones y sitios representativos durante paseos.",
            "ECA.2.3.p.8. Recopilar información sobre personajes de cuentos tradicionales, mitos y leyendas.",
            "ECA.2.3.p.11. Incorporar producciones artísticas al mejoramiento de espacios escolares.",
          ],
          actitudinales: [
            "ECA.2.1.a.3. Valorar el cuerpo como medio de expresión y el entorno como fuente de inspiración.",
            "ECA.2.3.a.2. Valorar el patrimonio cultural y natural local como bien común.",
            "ECA.2.3.a.3. Cuidar y mejorar los espacios escolares compartidos con responsabilidad.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.ECA.2.6",
    descripcion: "Documentar la gastronomía local mediante la investigación de platos típicos, sus procesos de elaboración y la comunicación de los hallazgos en recetarios ilustrados, planos y calendarios gastronómicos, para valorar la gastronomía como patrimonio cultural vivo en articulación con la comunidad educativa",
    competenciasClave: ["CC", "CMCT", "CD", "CCICC", "CSE", "CECA"],
    porGrado: [
      {
        nivel: "ELEMENTAL",
        grado: "SEGUNDO GRADO",
        indicadores: [
          { codigo: "I.ECA.2.6.1", texto: "Reconoce platos típicos de la zona y los documenta mediante registros gráficos o escritos" },
        ],
        saberes: {
          declarativos: [
            "ECA.2.3.d.8. Alimentación tradicional y sus procesos de elaboración en el pasado y el presente, así como los elementos culturales que se mantienen.",
          ],
          procedimentales: [
            "ECA.2.2.p.9. Documentar con imágenes, fotos o videos la preparación de comidas típicas y elaborar recetarios ilustrados.",
            "ECA.2.3.p.12. Indagar sobre alimentos de la dieta tradicional y su elaboración histórica y actual.",
          ],
          actitudinales: [
            "ECA.2.3.a.4. Conocer y comunicar prácticas gastronómicas locales con sentido de pertenencia.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "TERCER GRADO",
        indicadores: [
          { codigo: "I.ECA.2.6.1", texto: "Reconoce platos típicos de la zona y los documenta mediante registros gráficos o escritos" },
          { codigo: "I.ECA.2.6.2", texto: "Organiza información sobre la gastronomía local en producciones como recetarios ilustrados, planos o calendarios gastronómicos" },
        ],
        saberes: {
          declarativos: [
            "ECA.2.3.d.8. Alimentación tradicional y sus procesos de elaboración en el pasado y el presente, así como los elementos culturales que se mantienen.",
            "ECA.2.3.d.9. Cartografía sencilla de establecimientos de comida (planos, ubicación, especialidad).",
          ],
          procedimentales: [
            "ECA.2.3.p.13. Elaborar planos sencillos de establecimientos de comida de la zona.",
            "ECA.2.3.p.14. Identificar platos típicos y crear calendarios de preparación en fechas clave.",
          ],
          actitudinales: [
            "ECA.2.3.a.4. Conocer y comunicar prácticas gastronómicas locales con sentido de pertenencia.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "CUARTO GRADO",
        indicadores: [
          { codigo: "I.ECA.2.6.1", texto: "Reconoce platos típicos de la zona y los documenta mediante registros gráficos o escritos" },
          { codigo: "I.ECA.2.6.2", texto: "Organiza información sobre la gastronomía local en producciones como recetarios ilustrados, planos o calendarios gastronómicos" },
        ],
        saberes: {
          declarativos: [
            "ECA.2.3.d.8. Alimentación tradicional y sus procesos de elaboración en el pasado y el presente, así como los elementos culturales que se mantienen.",
            "ECA.2.3.d.9. Cartografía sencilla de establecimientos de comida (planos, ubicación, especialidad).",
          ],
          procedimentales: [
            "ECA.2.2.p.9. Documentar con imágenes, fotos o videos la preparación de comidas típicas y elaborar recetarios ilustrados.",
            "ECA.2.3.p.12. Indagar sobre alimentos de la dieta tradicional y su elaboración histórica y actual.",
            "ECA.2.3.p.13. Elaborar planos sencillos de establecimientos de comida de la zona.",
            "ECA.2.3.p.14. Identificar platos típicos y crear calendarios de preparación en fechas clave.",
          ],
          actitudinales: [
            "ECA.2.3.a.4. Conocer y comunicar prácticas gastronómicas locales con sentido de pertenencia.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.ECA.4.1",
    descripcion: "Analizar obras y producciones de artistas del Ecuador y del mundo mediante la observación, la descripción informada y la argumentación fundamentada, para construir criterio estético, valorar la diversidad cultural y expresar opiniones respetuosas sobre las manifestaciones artísticas",
    competenciasClave: ["CC", "CCICC", "CECA"],
    porGrado: [
      {
        nivel: "MEDIA",
        grado: "QUINTO GRADO",
        indicadores: [
          { codigo: "I.ECA.4.1.1", texto: "Sustenta un punto de vista sobre una obra o manifestación artística utilizando vocabulario específico y referencias a rasgos formales y expresivos" },
        ],
        saberes: {
          declarativos: [
            "ECA.4.1.d.1. Conceptos básicos de retrato y autorretrato: figura, carácter, intención, función de la obra.",
            "ECA.4.1.d.2. Técnicas de dibujo, pintura, escultura y referentes locales e internacionales (pasado y presente).",
          ],
          procedimentales: [
            "ECA.4.1.p.1. Analizar retratos y esculturas para identificar técnica, rasgos del personaje, función e intención.",
            "ECA.4.2.p.3. Dialogar sobre personajes representados en obras artísticas argumentando impresiones con respeto y evidencia.",
          ],
          actitudinales: [
            "ECA.4.1.p.1. Analizar retratos y esculturas para identificar técnica, rasgos del personaje, función e intención.",
            "ECA.4.2.p.3. Dialogar sobre personajes representados en obras artísticas argumentando impresiones con respeto y evidencia.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SEXTO GRADO",
        indicadores: [
          { codigo: "I.ECA.4.1.2", texto: "Selecciona fuentes pertinentes para una visita cultural considerando autoría, fecha y propósito, y dejando evidencia de la elección" },
          { codigo: "I.ECA.4.1.3", texto: "Organiza una línea de tiempo que sitúa obras y piezas musicales con autor, fecha y contexto básico para establecer comparaciones" },
        ],
        saberes: {
          declarativos: [
            "ECA.4.1.d.5. Nociones de línea de tiempo musical y relación música–biografía.",
            "ECA.4.2.d.5. Protocolos y normas de visita a espacios culturales; fuentes de información sobre patrimonio y programación.",
            "ECA.4.3.d.1. Concepciones históricas del ideal de figura humana en distintas culturas y épocas.",
            "ECA.4.3.d.2. Mujeres artistas (históricas y contemporáneas) y sus condicionantes sociales e históricos.",
          ],
          procedimentales: [
            "ECA.4.1.p.5. Elaborar una línea de tiempo con obras y manifestaciones artísticas significativas y comparar semejanzas/diferencias con pares.",
            "ECA.4.2.p.8. Investigar fuentes y preparar visitas culturales (itinerarios, normas, objetivos) y elaborar guías para la comunidad educativa.",
            "ECA.4.3.p.1. Indagar y documentar ideales de figura humana en productos escritos, visuales o audiovisuales.",
          ],
          actitudinales: [
            "ECA.4.1.p.5. Elaborar una línea de tiempo con obras y manifestaciones artísticas significativas y comparar semejanzas/diferencias con pares.",
            "ECA.4.2.p.8. Investigar fuentes y preparar visitas culturales (itinerarios, normas, objetivos) y elaborar guías para la comunidad educativa.",
            "ECA.4.3.p.1. Indagar y documentar ideales de figura humana en productos escritos, visuales o audiovisuales.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SÉPTIMO GRADO",
        indicadores: [
          { codigo: "I.ECA.4.1.1", texto: "Sustenta un punto de vista sobre una obra o manifestación artística utilizando vocabulario específico y referencias a rasgos formales y expresivos" },
          { codigo: "I.ECA.4.1.2", texto: "Selecciona fuentes pertinentes para una visita cultural considerando autoría, fecha y propósito, y dejando evidencia de la elección" },
          { codigo: "I.ECA.4.1.3", texto: "Organiza una línea de tiempo que sitúa obras y piezas musicales con autor, fecha y contexto básico para establecer comparaciones" },
        ],
        saberes: {
          declarativos: [
            "ECA.4.1.d.1. Conceptos básicos de retrato y autorretrato: figura, carácter, intención, función de la obra.",
            "ECA.4.1.d.2. Técnicas de dibujo, pintura, escultura y referentes locales e internacionales (pasado y presente).",
            "ECA.4.1.d.5. Nociones de línea de tiempo musical y relación música–biografía.",
            "ECA.4.2.d.5. Protocolos y normas de visita a espacios culturales; fuentes de información sobre patrimonio y programación.",
            "ECA.4.3.d.1. Concepciones históricas del ideal de figura humana en distintas culturas y épocas.",
            "ECA.4.3.d.2. Mujeres artistas (históricas y contemporáneas) y sus condicionantes sociales e históricos.",
          ],
          procedimentales: [
            "ECA.4.1.p.1. Analizar retratos y esculturas para identificar técnica, rasgos del personaje, función e intención.",
            "ECA.4.1.p.5. Elaborar una línea de tiempo con obras y manifestaciones artísticas significativas y comparar semejanzas/diferencias con pares.",
            "ECA.4.2.p.3. Dialogar sobre personajes representados en obras artísticas argumentando impresiones con respeto y evidencia.",
            "ECA.4.2.p.8. Investigar fuentes y preparar visitas culturales (itinerarios, normas, objetivos) y elaborar guías para la comunidad educativa.",
            "ECA.4.3.p.1. Indagar y documentar ideales de figura humana en productos escritos, visuales o audiovisuales.",
          ],
          actitudinales: [
            "ECA.4.1.p.1. Analizar retratos y esculturas para identificar técnica, rasgos del personaje, función e intención.",
            "ECA.4.1.p.5. Elaborar una línea de tiempo con obras y manifestaciones artísticas significativas y comparar semejanzas/diferencias con pares.",
            "ECA.4.2.p.3. Dialogar sobre personajes representados en obras artísticas argumentando impresiones con respeto y evidencia.",
            "ECA.4.2.p.8. Investigar fuentes y preparar visitas culturales (itinerarios, normas, objetivos) y elaborar guías para la comunidad educativa.",
            "ECA.4.3.p.1. Indagar y documentar ideales de figura humana en productos escritos, visuales o audiovisuales.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "OCTAVO GRADO",
        indicadores: [
          { codigo: "I.ECA.4.1.1", texto: "Sustenta un punto de vista sobre una obra o manifestación artística utilizando vocabulario específico y referencias a rasgos formales y expresivos" },
          { codigo: "I.ECA.4.1.2", texto: "Selecciona fuentes pertinentes para una visita cultural considerando autoría, fecha y propósito, y dejando evidencia de la elección" },
        ],
        saberes: {
          declarativos: [
            "ECA.4.1.d.1. Conceptos básicos de retrato y autorretrato: figura, carácter, intención, función de la obra.",
            "ECA.4.1.d.5. Nociones de línea de tiempo musical y relación música–biografía.",
            "ECA.4.3.d.5. Cartografía cultural de museos, auditorios, teatros, salas de cine del Ecuador.",
            "ECA.4.3.d.6. Rasgos del arte contemporáneo (instalación) y del arte cinético.",
            "ECA.4.3.d.10. Manifestaciones musicales tradicionales (pasillo, sanjuanito, albazo, pasacalle), instrumentos y danzas.",
            "ECA.4.3.d.11. Cosmovisiones ancestrales y su vigencia en ritos y celebraciones.",
          ],
          procedimentales: [
            "ECA.4.2.p.8. Investigar fuentes y preparar visitas culturales (itinerarios, normas, objetivos) y elaborar guías para la comunidad educativa.",
            "ECA.4.3.p.2. Buscar información en fuentes impresas y digitales sobre mujeres artistas y sintetizar hallazgos con citas.",
            "ECA.4.3.p.3. Analizar condicionantes histórico-sociales y exponer resultados en presentaciones, carteles, blogs u otros soportes.",
            "ECA.4.3.p.5. Entrevistar a artesanos/artistas locales preparando guion, registrando audio/video y editando el material.",
            "ECA.4.3.p.6. Elaborar una guía turística cultural del Ecuador seleccionando y describiendo espacios artísticos.",
            "ECA.4.3.p.7. Observar y explicar instalaciones contemporáneas interpretando ideas subyacentes.",
            "ECA.4.3.p.8. Explicar mecanismos de movimiento en obras cinéticas tras experimentar y modelar ejemplos.",
            "ECA.4.3.p.13. Elaborar dosieres sobre obras/objetos identitarios ecuatorianos integrando texto e imágenes.",
            "ECA.4.3.p.14. Compilar archivos sonoros y gráficos sobre músicas tradicionales describiendo instrumentos y bailes.",
          ],
          actitudinales: [
            "ECA.4.1.p.1. Analizar retratos y esculturas para identificar técnica, rasgos del personaje, función e intención.",
            "ECA.4.2.p.8. Investigar fuentes y preparar visitas culturales (itinerarios, normas, objetivos) y elaborar guías para la comunidad educativa.",
            "ECA.4.3.p.1. Indagar y documentar ideales de figura humana en productos escritos, visuales o audiovisuales.",
            "ECA.4.3.p.2. Buscar información en fuentes impresas y digitales sobre mujeres artistas y sintetizar hallazgos con citas.",
            "ECA.4.3.p.3. Analizar condicionantes histórico-sociales y exponer resultados en presentaciones, carteles, blogs u otros soportes.",
            "ECA.4.3.p.5. Entrevistar a artesanos/artistas locales preparando guion, registrando audio/video y editando el material.",
            "ECA.4.3.p.6. Elaborar una guía turística cultural del Ecuador seleccionando y describiendo espacios artísticos.",
            "ECA.4.3.p.7. Observar y explicar instalaciones contemporáneas interpretando ideas subyacentes.",
            "ECA.4.3.p.8. Explicar mecanismos de movimiento en obras cinéticas tras experimentar y modelar ejemplos.",
            "ECA.4.3.p.14. Compilar archivos sonoros y gráficos sobre músicas tradicionales describiendo instrumentos y bailes.",
            "ECA.4.3.p.15. Investigar cosmovisiones ancestrales y relacionar su vigencia con prácticas actuales.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "NOVENO GRADO",
        indicadores: [
          { codigo: "I.ECA.4.1.3", texto: "Organiza una línea de tiempo que sitúa obras y piezas musicales con autor, fecha y contexto básico para establecer comparaciones" },
        ],
        saberes: {
          declarativos: [
            "ECA.4.1.d.2. Técnicas de dibujo, pintura, escultura y referentes locales e internacionales (pasado y presente).",
            "ECA.4.2.d.5. Protocolos y normas de visita a espacios culturales; fuentes de información sobre patrimonio y programación.",
            "ECA.4.3.d.1. Concepciones históricas del ideal de figura humana en distintas culturas y épocas.",
            "ECA.4.3.d.2. Mujeres artistas (históricas y contemporáneas) y sus condicionantes sociales e históricos.",
            "ECA.4.3.d.4. Metodologías de entrevista a artistas y artesanos locales.",
            "ECA.4.3.d.5. Cartografía cultural de museos, auditorios, teatros, salas de cine del Ecuador.",
            "ECA.4.3.d.6. Rasgos del arte contemporáneo (instalación) y del arte cinético.",
            "ECA.4.3.d.7. Primeras películas del cine y comparación con el cine actual analizando su contexto técnico y social.",
            "ECA.4.3.d.9. Señas de identidad de la cultura ecuatoriana (cerámicas, metalurgia, escultura quiteña, textiles, retratos).",
          ],
          procedimentales: [
            "ECA.4.1.p.5. Elaborar una línea de tiempo con obras y manifestaciones artísticas significativas y comparar semejanzas/diferencias con pares.",
            "ECA.4.2.p.3. Dialogar sobre personajes representados en obras artísticas argumentando impresiones con respeto y evidencia.",
            "ECA.4.2.p.8. Investigar fuentes y preparar visitas culturales (itinerarios, normas, objetivos) y elaborar guías para la comunidad educativa.",
            "ECA.4.3.p.1. Indagar y documentar ideales de figura humana en productos escritos, visuales o audiovisuales.",
            "ECA.4.3.p.3. Analizar condicionantes histórico-sociales y exponer resultados en presentaciones, carteles, blogs u otros soportes.",
            "ECA.4.3.p.6. Elaborar una guía turística cultural del Ecuador seleccionando y describiendo espacios artísticos.",
            "ECA.4.3.p.11. Analizar películas del cine clásico y comparar con el cine actual en términos técnicos, estéticos y de recepción del público.",
          ],
          actitudinales: [
            "ECA.4.1.p.5. Elaborar una línea de tiempo con obras y manifestaciones artísticas significativas y comparar semejanzas/diferencias con pares.",
            "ECA.4.2.p.3. Dialogar sobre personajes representados en obras artísticas argumentando impresiones con respeto y evidencia.",
            "ECA.4.3.p.1. Indagar y documentar ideales de figura humana en productos escritos, visuales o audiovisuales.",
            "ECA.4.3.p.3. Analizar condicionantes histórico-sociales y exponer resultados en presentaciones, carteles, blogs u otros soportes.",
            "ECA.4.3.p.5. Entrevistar a artesanos/artistas locales preparando guion, registrando audio/video y editando el material.",
            "ECA.4.3.p.6. Elaborar una guía turística cultural del Ecuador seleccionando y describiendo espacios artísticos.",
            "ECA.4.3.p.7. Observar y explicar instalaciones contemporáneas interpretando ideas subyacentes.",
            "ECA.4.3.p.8. Explicar mecanismos de movimiento en obras cinéticas tras experimentar y modelar ejemplos.",
            "ECA.4.3.p.11. Analizar películas del cine clásico y comparar con el cine actual en términos técnicos, estéticos y de recepción del público.",
            "ECA.4.3.p.13. Elaborar dosieres sobre obras/objetos identitarios ecuatorianos integrando texto e imágenes.",
            "ECA.4.3.p.14. Compilar archivos sonoros y gráficos sobre músicas tradicionales describiendo instrumentos y bailes.",
            "ECA.4.3.p.15. Investigar cosmovisiones ancestrales y relacionar su vigencia con prácticas actuales.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "DÉCIMO GRADO",
        indicadores: [
          { codigo: "I.ECA.4.1.1", texto: "Sustenta un punto de vista sobre una obra o manifestación artística utilizando vocabulario específico y referencias a rasgos formales y expresivos" },
          { codigo: "I.ECA.4.1.2", texto: "Selecciona fuentes pertinentes para una visita cultural considerando autoría, fecha y propósito, y dejando evidencia de la elección" },
          { codigo: "I.ECA.4.1.3", texto: "Organiza una línea de tiempo que sitúa obras y piezas musicales con autor, fecha y contexto básico para establecer comparaciones" },
        ],
        saberes: {
          declarativos: [
            "ECA.4.1.d.1. Conceptos básicos de retrato y autorretrato: figura, carácter, intención, función de la obra.",
            "ECA.4.1.d.2. Técnicas de dibujo, pintura, escultura y referentes locales e internacionales (pasado y presente).",
            "ECA.4.1.d.5. Nociones de línea de tiempo musical y relación música–biografía.",
            "ECA.4.2.d.5. Protocolos y normas de visita a espacios culturales; fuentes de información sobre patrimonio y programación.",
            "ECA.4.3.d.1. Concepciones históricas del ideal de figura humana en distintas culturas y épocas.",
            "ECA.4.3.d.2. Mujeres artistas (históricas y contemporáneas) y sus condicionantes sociales e históricos.",
            "ECA.4.3.d.4. Metodologías de entrevista a artistas y artesanos locales.",
            "ECA.4.3.d.5. Cartografía cultural de museos, auditorios, teatros, salas de cine del Ecuador.",
            "ECA.4.3.d.6. Rasgos del arte contemporáneo (instalación) y del arte cinético.",
            "ECA.4.3.d.7. Primeras películas del cine y comparación con el cine actual analizando su contexto técnico y social.",
            "ECA.4.3.d.9. Señas de identidad de la cultura ecuatoriana (cerámicas, metalurgia, escultura quiteña, textiles, retratos).",
            "ECA.4.3.d.10. Manifestaciones musicales tradicionales (pasillo, sanjuanito, albazo, pasacalle), instrumentos y danzas.",
            "ECA.4.3.d.11. Cosmovisiones ancestrales y su vigencia en ritos y celebraciones.",
          ],
          procedimentales: [
            "ECA.4.1.p.1. Analizar retratos y esculturas para identificar técnica, rasgos del personaje, función e intención.",
            "ECA.4.1.p.5. Elaborar una línea de tiempo con obras y manifestaciones artísticas significativas y comparar semejanzas/diferencias con pares.",
            "ECA.4.2.p.3. Dialogar sobre personajes representados en obras artísticas argumentando impresiones con respeto y evidencia.",
            "ECA.4.2.p.8. Investigar fuentes y preparar visitas culturales (itinerarios, normas, objetivos) y elaborar guías para la comunidad educativa.",
            "ECA.4.3.p.1. Indagar y documentar ideales de figura humana en productos escritos, visuales o audiovisuales.",
            "ECA.4.3.p.2. Buscar información en fuentes impresas y digitales sobre mujeres artistas y sintetizar hallazgos con citas.",
            "ECA.4.3.p.3. Analizar condicionantes histórico-sociales y exponer resultados en presentaciones, carteles, blogs u otros soportes.",
            "ECA.4.3.p.5. Entrevistar a artesanos/artistas locales preparando guion, registrando audio/video y editando el material.",
            "ECA.4.3.p.6. Elaborar una guía turística cultural del Ecuador seleccionando y describiendo espacios artísticos.",
            "ECA.4.3.p.7. Observar y explicar instalaciones contemporáneas interpretando ideas subyacentes.",
            "ECA.4.3.p.8. Explicar mecanismos de movimiento en obras cinéticas tras experimentar y modelar ejemplos.",
            "ECA.4.3.p.11. Analizar películas del cine clásico y comparar con el cine actual en términos técnicos, estéticos y de recepción del público.",
            "ECA.4.3.p.13. Elaborar dosieres sobre obras/objetos identitarios ecuatorianos integrando texto e imágenes.",
            "ECA.4.3.p.14. Compilar archivos sonoros y gráficos sobre músicas tradicionales describiendo instrumentos y bailes.",
            "ECA.4.3.p.15. Investigar cosmovisiones ancestrales y relacionar su vigencia con prácticas actuales.",
          ],
          actitudinales: [
            "ECA.4.1.p.1. Analizar retratos y esculturas para identificar técnica, rasgos del personaje, función e intención.",
            "ECA.4.1.p.5. Elaborar una línea de tiempo con obras y manifestaciones artísticas significativas y comparar semejanzas/diferencias con pares.",
            "ECA.4.2.p.3. Dialogar sobre personajes representados en obras artísticas argumentando impresiones con respeto y evidencia.",
            "ECA.4.2.p.8. Investigar fuentes y preparar visitas culturales (itinerarios, normas, objetivos) y elaborar guías para la comunidad educativa.",
            "ECA.4.3.p.1. Indagar y documentar ideales de figura humana en productos escritos, visuales o audiovisuales.",
            "ECA.4.3.p.2. Buscar información en fuentes impresas y digitales sobre mujeres artistas y sintetizar hallazgos con citas.",
            "ECA.4.3.p.3. Analizar condicionantes histórico-sociales y exponer resultados en presentaciones, carteles, blogs u otros soportes.",
            "ECA.4.3.p.5. Entrevistar a artesanos/artistas locales preparando guion, registrando audio/video y editando el material.",
            "ECA.4.3.p.6. Elaborar una guía turística cultural del Ecuador seleccionando y describiendo espacios artísticos.",
            "ECA.4.3.p.7. Observar y explicar instalaciones contemporáneas interpretando ideas subyacentes.",
            "ECA.4.3.p.8. Explicar mecanismos de movimiento en obras cinéticas tras experimentar y modelar ejemplos.",
            "ECA.4.3.p.11. Analizar películas del cine clásico y comparar con el cine actual en términos técnicos, estéticos y de recepción del público.",
            "ECA.4.3.p.13. Elaborar dosieres sobre obras/objetos identitarios ecuatorianos integrando texto e imágenes.",
            "ECA.4.3.p.14. Compilar archivos sonoros y gráficos sobre músicas tradicionales describiendo instrumentos y bailes.",
            "ECA.4.3.p.15. Investigar cosmovisiones ancestrales y relacionar su vigencia con prácticas actuales.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.ECA.4.2",
    descripcion: "Investigar artistas, obras y manifestaciones culturales mediante el análisis de sus contextos históricos, sociales y culturales, la organización rigurosa de información y su comunicación en diferentes formatos, para construir interpretaciones fundamentadas, valorar la diversidad cultural y fortalecer el pensamiento crítico",
    competenciasClave: ["CC", "CD", "CCICC", "CECA"],
    porGrado: [
      {
        nivel: "MEDIA",
        grado: "QUINTO GRADO",
        indicadores: [
          { codigo: "I.ECA.4.2.1", texto: "Selecciona fuentes y técnicas básicas (búsqueda, fichado, entrevista) para obtener datos relevantes sobre obras y manifestaciones, registrando autoría, fecha y propósito" },
          { codigo: "I.ECA.4.2.3", texto: "Contrasta la consideración social e histórica de prácticas, obras o agentes (figura humana, artistas, artesanías, cine) para formular interpretaciones propias con criterios de selección y consumo responsable" },
        ],
        saberes: {
          declarativos: [
            "ECA.4.1.d.3. Componentes y organización del diario/portafolio personal (imágenes, objetos, recortes, audio, video, texto).",
            "ECA.4.1.d.5. Nociones de línea de tiempo musical y relación música–biografía.",
            "ECA.4.2.d.5. Protocolos y normas de visita a espacios culturales; fuentes de información sobre patrimonio y programación.",
            "ECA.4.3.d.6. Rasgos del arte contemporáneo (instalación) y del arte cinético.",
            "ECA.4.3.d.8. Nociones de patrimonio: monumentos (planos, maquetas), reconstrucción hipotética y color original.",
            "ECA.4.3.d.9. Señas de identidad de la cultura ecuatoriana (cerámicas, metalurgia, escultura quiteña, textiles, retratos).",
            "ECA.4.3.d.10. Manifestaciones musicales tradicionales (pasillo, sanjuanito, albazo, pasacalle), instrumentos y danzas.",
            "ECA.4.3.d.11. Cosmovisiones ancestrales y su vigencia en ritos y celebraciones.",
          ],
          procedimentales: [
            "ECA.4.1.p.5. Elaborar una línea de tiempo con obras y manifestaciones artísticas significativas y comparar semejanzas/diferencias con pares.",
            "ECA.4.1.p.6. Indagar sobre una actividad artesanal local, sistematizar técnicas y procesos, y citar fuentes consultadas.",
            "ECA.4.2.p.3. Dialogar sobre personajes representados en obras artísticas argumentando impresiones con respeto y evidencia.",
            "ECA.4.2.p.8. Investigar fuentes y preparar visitas culturales (itinerarios, normas, objetivos) y elaborar guías para la comunidad educativa.",
            "ECA.4.3.p.2. Buscar información en fuentes impresas y digitales sobre mujeres artistas y sintetizar hallazgos con citas.",
            "ECA.4.3.p.3. Analizar condicionantes histórico-sociales y exponer resultados en presentaciones, carteles, blogs u otros soportes.",
            "ECA.4.3.p.5. Entrevistar a artesanos/artistas locales preparando guion, registrando audio/video y editando el material.",
            "ECA.4.3.p.7. Observar y explicar instalaciones contemporáneas interpretando ideas subyacentes.",
            "ECA.4.3.p.9. Investigar instalaciones con recursos tecnológicos y comparar enfoques de distintos creadores.",
          ],
          actitudinales: [
            "ECA.4.1.a.2. Respetar la autoría y los referentes culturales locales.",
            "ECA.4.2.a.3. Cuidar los espacios culturales y cumplir normas de convivencia y seguridad.",
            "ECA.4.3.a.2. Reconocer y visibilizar aportes de mujeres artistas y creadores poco representados.",
            "ECA.4.3.a.3. Respetar la diversidad cultural y promover el diálogo entre tradiciones y contemporaneidad.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SEXTO GRADO",
        indicadores: [
          { codigo: "I.ECA.4.2.2", texto: "Produce presentaciones, guías o dosieres que integran texto, imagen y/o audio a partir de datos organizados, incluyendo citas y créditos" },
        ],
        saberes: {
          declarativos: [
            "ECA.4.1.d.2. Técnicas de dibujo, pintura, escultura y referentes locales e internacionales (pasado y presente).",
            "ECA.4.1.d.5. Nociones de línea de tiempo musical y relación música–biografía.",
            "ECA.4.1.d.6. Artes y oficios: procesos, herramientas y características de tejido, cerámica, joyería u otras prácticas artesanales.",
            "ECA.4.3.d.2. Mujeres artistas (históricas y contemporáneas) y sus condicionantes sociales e históricos.",
            "ECA.4.3.d.3. Especialidades y profesiones artísticas: itinerarios de estudio y salidas profesionales.",
            "ECA.4.3.d.4. Metodologías de entrevista a artistas y artesanos locales.",
            "ECA.4.3.d.5. Cartografía cultural de museos, auditorios, teatros, salas de cine del Ecuador.",
            "ECA.4.3.d.6. Rasgos del arte contemporáneo (instalación) y del arte cinético.",
            "ECA.4.3.d.7. Primeras películas del cine y comparación con el cine actual analizando su contexto técnico y social.",
            "ECA.4.3.d.8. Nociones de patrimonio: monumentos (planos, maquetas), reconstrucción hipotética y color original.",
          ],
          procedimentales: [
            "ECA.4.2.p.8. Investigar fuentes y preparar visitas culturales (itinerarios, normas, objetivos) y elaborar guías para la comunidad educativa.",
            "ECA.4.3.p.1. Indagar y documentar ideales de figura humana en productos escritos, visuales o audiovisuales.",
            "ECA.4.3.p.2. Buscar información en fuentes impresas y digitales sobre mujeres artistas y sintetizar hallazgos con citas.",
            "ECA.4.3.p.3. Analizar condicionantes histórico-sociales y exponer resultados en presentaciones, carteles, blogs u otros soportes.",
            "ECA.4.3.p.4. Diseñar y producir presentaciones multimedia o piezas audiovisuales sobre formaciones y profesiones artísticas.",
            "ECA.4.3.p.6. Elaborar una guía turística cultural del Ecuador seleccionando y describiendo espacios artísticos.",
            "ECA.4.3.p.7. Observar y explicar instalaciones contemporáneas interpretando ideas subyacentes.",
            "ECA.4.3.p.11. Analizar películas del cine clásico y comparar con el cine actual en términos técnicos, estéticos y de recepción del público.",
            "ECA.4.3.p.12. Recrear patrimonio en plano o volumen imaginando hipótesis de estado original argumentadas.",
            "ECA.4.3.p.13. Elaborar dosieres sobre obras/objetos identitarios ecuatorianos integrando texto e imágenes.",
          ],
          actitudinales: [
            "ECA.4.2.a.2. Valorar la diversidad de ideas, culturas y lenguajes expresivos en procesos colectivos.",
            "ECA.4.2.a.3. Cuidar los espacios culturales y cumplir normas de convivencia y seguridad.",
            "ECA.4.3.a.2. Reconocer y visibilizar aportes de mujeres artistas y creadores poco representados.",
            "ECA.4.3.a.3. Respetar la diversidad cultural y promover el diálogo entre tradiciones y contemporaneidad.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SÉPTIMO GRADO",
        indicadores: [
          { codigo: "I.ECA.4.2.1", texto: "Selecciona fuentes y técnicas básicas (búsqueda, fichado, entrevista) para obtener datos relevantes sobre obras y manifestaciones, registrando autoría, fecha y propósito" },
          { codigo: "I.ECA.4.2.2", texto: "Produce presentaciones, guías o dosieres que integran texto, imagen y/o audio a partir de datos organizados, incluyendo citas y créditos" },
          { codigo: "I.ECA.4.2.3", texto: "Contrasta la consideración social e histórica de prácticas, obras o agentes (figura humana, artistas, artesanías, cine) para formular interpretaciones propias con criterios de selección y consumo responsable" },
        ],
        saberes: {
          declarativos: [
            "ECA.4.1.d.2. Técnicas de dibujo, pintura, escultura y referentes locales e internacionales (pasado y presente).",
            "ECA.4.1.d.3. Componentes y organización del diario/portafolio personal (imágenes, objetos, recortes, audio, video, texto).",
            "ECA.4.1.d.5. Nociones de línea de tiempo musical y relación música–biografía.",
            "ECA.4.1.d.6. Artes y oficios: procesos, herramientas y características de tejido, cerámica, joyería u otras prácticas artesanales.",
            "ECA.4.2.d.5. Protocolos y normas de visita a espacios culturales; fuentes de información sobre patrimonio y programación.",
            "ECA.4.3.d.2. Mujeres artistas (históricas y contemporáneas) y sus condicionantes sociales e históricos.",
            "ECA.4.3.d.3. Especialidades y profesiones artísticas: itinerarios de estudio y salidas profesionales.",
            "ECA.4.3.d.4. Metodologías de entrevista a artistas y artesanos locales.",
            "ECA.4.3.d.5. Cartografía cultural de museos, auditorios, teatros, salas de cine del Ecuador.",
            "ECA.4.3.d.6. Rasgos del arte contemporáneo (instalación) y del arte cinético.",
            "ECA.4.3.d.7. Primeras películas del cine y comparación con el cine actual analizando su contexto técnico y social.",
            "ECA.4.3.d.8. Nociones de patrimonio: monumentos (planos, maquetas), reconstrucción hipotética y color original.",
            "ECA.4.3.d.9. Señas de identidad de la cultura ecuatoriana (cerámicas, metalurgia, escultura quiteña, textiles, retratos).",
            "ECA.4.3.d.10. Manifestaciones musicales tradicionales (pasillo, sanjuanito, albazo, pasacalle), instrumentos y danzas.",
            "ECA.4.3.d.11. Cosmovisiones ancestrales y su vigencia en ritos y celebraciones.",
          ],
          procedimentales: [
            "ECA.4.1.p.5. Elaborar una línea de tiempo con obras y manifestaciones artísticas significativas y comparar semejanzas/diferencias con pares.",
            "ECA.4.1.p.6. Indagar sobre una actividad artesanal local, sistematizar técnicas y procesos, y citar fuentes consultadas.",
            "ECA.4.2.p.3. Dialogar sobre personajes representados en obras artísticas argumentando impresiones con respeto y evidencia.",
            "ECA.4.2.p.8. Investigar fuentes y preparar visitas culturales (itinerarios, normas, objetivos) y elaborar guías para la comunidad educativa.",
            "ECA.4.3.p.1. Indagar y documentar ideales de figura humana en productos escritos, visuales o audiovisuales.",
            "ECA.4.3.p.2. Buscar información en fuentes impresas y digitales sobre mujeres artistas y sintetizar hallazgos con citas.",
            "ECA.4.3.p.3. Analizar condicionantes histórico-sociales y exponer resultados en presentaciones, carteles, blogs u otros soportes.",
            "ECA.4.3.p.4. Diseñar y producir presentaciones multimedia o piezas audiovisuales sobre formaciones y profesiones artísticas.",
            "ECA.4.3.p.5. Entrevistar a artesanos/artistas locales preparando guion, registrando audio/video y editando el material.",
            "ECA.4.3.p.6. Elaborar una guía turística cultural del Ecuador seleccionando y describiendo espacios artísticos.",
            "ECA.4.3.p.7. Observar y explicar instalaciones contemporáneas interpretando ideas subyacentes.",
            "ECA.4.3.p.9. Investigar instalaciones con recursos tecnológicos y comparar enfoques de distintos creadores.",
            "ECA.4.3.p.11. Analizar películas del cine clásico y comparar con el cine actual en términos técnicos, estéticos y de recepción del público.",
            "ECA.4.3.p.12. Recrear patrimonio en plano o volumen imaginando hipótesis de estado original argumentadas.",
            "ECA.4.3.p.13. Elaborar dosieres sobre obras/objetos identitarios ecuatorianos integrando texto e imágenes.",
          ],
          actitudinales: [
            "ECA.4.1.a.2. Respetar la autoría y los referentes culturales locales.",
            "ECA.4.2.a.2. Valorar la diversidad de ideas, culturas y lenguajes expresivos en procesos colectivos.",
            "ECA.4.2.a.3. Cuidar los espacios culturales y cumplir normas de convivencia y seguridad.",
            "ECA.4.3.a.2. Reconocer y visibilizar aportes de mujeres artistas y creadores poco representados.",
            "ECA.4.3.a.3. Respetar la diversidad cultural y promover el diálogo entre tradiciones y contemporaneidad.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "OCTAVO GRADO",
        indicadores: [
          { codigo: "I.ECA.4.2.1", texto: "Selecciona fuentes y técnicas básicas (búsqueda, fichado, entrevista) para obtener datos relevantes sobre obras y manifestaciones, registrando autoría, fecha y propósito" },
          { codigo: "I.ECA.4.2.2", texto: "Produce presentaciones, guías o dosieres que integran texto, imagen y/o audio a partir de datos organizados, incluyendo citas y créditos" },
        ],
        saberes: {
          declarativos: [
            "ECA.4.1.d.2. Técnicas de dibujo, pintura, escultura y referentes locales e internacionales (pasado y presente).",
            "ECA.4.1.d.3. Componentes y organización del diario/portafolio personal (imágenes, objetos, recortes, audio, video, texto).",
            "ECA.4.1.d.5. Nociones de línea de tiempo musical y relación música–biografía.",
            "ECA.4.1.d.6. Artes y oficios: procesos, herramientas y características de tejido, cerámica, joyería u otras prácticas artesanales.",
            "ECA.4.3.d.2. Mujeres artistas (históricas y contemporáneas) y sus condicionantes sociales e históricos.",
            "ECA.4.3.d.7. Primeras películas del cine y comparación con el cine actual analizando su contexto técnico y social.",
            "ECA.4.3.d.8. Nociones de patrimonio: monumentos (planos, maquetas), reconstrucción hipotética y color original.",
            "ECA.4.3.d.9. Señas de identidad de la cultura ecuatoriana (cerámicas, metalurgia, escultura quiteña, textiles, retratos).",
            "ECA.4.3.d.10. Manifestaciones musicales tradicionales (pasillo, sanjuanito, albazo, pasacalle), instrumentos y danzas.",
            "ECA.4.3.d.11. Cosmovisiones ancestrales y su vigencia en ritos y celebraciones.",
          ],
          procedimentales: [
            "ECA.4.1.p.5. Elaborar una línea de tiempo con obras y manifestaciones artísticas significativas y comparar semejanzas/diferencias con pares.",
            "ECA.4.1.p.6. Indagar sobre una actividad artesanal local, sistematizar técnicas y procesos, y citar fuentes consultadas.",
            "ECA.4.3.p.2. Buscar información en fuentes impresas y digitales sobre mujeres artistas y sintetizar hallazgos con citas.",
            "ECA.4.3.p.3. Analizar condicionantes histórico-sociales y exponer resultados en presentaciones, carteles, blogs u otros soportes.",
            "ECA.4.3.p.4. Diseñar y producir presentaciones multimedia o piezas audiovisuales sobre formaciones y profesiones artísticas.",
            "ECA.4.3.p.5. Entrevistar a artesanos/artistas locales preparando guion, registrando audio/video y editando el material.",
            "ECA.4.3.p.6. Elaborar una guía turística cultural del Ecuador seleccionando y describiendo espacios artísticos.",
            "ECA.4.3.p.13. Elaborar dosieres sobre obras/objetos identitarios ecuatorianos integrando texto e imágenes.",
          ],
          actitudinales: [
            "ECA.4.2.a.2. Valorar la diversidad de ideas, culturas y lenguajes expresivos en procesos colectivos.",
            "ECA.4.3.a.2. Reconocer y visibilizar aportes de mujeres artistas y creadores poco representados.",
            "ECA.4.3.a.3. Respetar la diversidad cultural y promover el diálogo entre tradiciones y contemporaneidad.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "NOVENO GRADO",
        indicadores: [
          { codigo: "I.ECA.4.2.3", texto: "Contrasta la consideración social e histórica de prácticas, obras o agentes (figura humana, artistas, artesanías, cine) para formular interpretaciones propias con criterios de selección y consumo responsable" },
        ],
        saberes: {
          declarativos: [
            "ECA.4.2.d.5. Protocolos y normas de visita a espacios culturales; fuentes de información sobre patrimonio y programación.",
            "ECA.4.3.d.3. Especialidades y profesiones artísticas: itinerarios de estudio y salidas profesionales.",
            "ECA.4.3.d.4. Metodologías de entrevista a artistas y artesanos locales.",
            "ECA.4.3.d.5. Cartografía cultural de museos, auditorios, teatros, salas de cine del Ecuador.",
            "ECA.4.3.d.6. Rasgos del arte contemporáneo (instalación) y del arte cinético.",
            "ECA.4.3.d.8. Nociones de patrimonio: monumentos (planos, maquetas), reconstrucción hipotética y color original.",
          ],
          procedimentales: [
            "ECA.4.2.p.3. Dialogar sobre personajes representados en obras artísticas argumentando impresiones con respeto y evidencia.",
            "ECA.4.2.p.8. Investigar fuentes y preparar visitas culturales (itinerarios, normas, objetivos) y elaborar guías para la comunidad educativa.",
            "ECA.4.3.p.1. Indagar y documentar ideales de figura humana en productos escritos, visuales o audiovisuales.",
            "ECA.4.3.p.2. Buscar información en fuentes impresas y digitales sobre mujeres artistas y sintetizar hallazgos con citas.",
            "ECA.4.3.p.3. Analizar condicionantes histórico-sociales y exponer resultados en presentaciones, carteles, blogs u otros soportes.",
            "ECA.4.3.p.5. Entrevistar a artesanos/artistas locales preparando guion, registrando audio/video y editando el material.",
            "ECA.4.3.p.7. Observar y explicar instalaciones contemporáneas interpretando ideas subyacentes.",
            "ECA.4.3.p.9. Investigar instalaciones con recursos tecnológicos y comparar enfoques de distintos creadores.",
            "ECA.4.3.p.11. Analizar películas del cine clásico y comparar con el cine actual en términos técnicos, estéticos y de recepción del público.",
            "ECA.4.3.p.12. Recrear patrimonio en plano o volumen imaginando hipótesis de estado original argumentadas.",
          ],
          actitudinales: [
            "ECA.4.1.a.2. Respetar la autoría y los referentes culturales locales.",
            "ECA.4.2.a.3. Cuidar los espacios culturales y cumplir normas de convivencia y seguridad.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "DÉCIMO GRADO",
        indicadores: [
          { codigo: "I.ECA.4.2.1", texto: "Selecciona fuentes y técnicas básicas (búsqueda, fichado, entrevista) para obtener datos relevantes sobre obras y manifestaciones, registrando autoría, fecha y propósito" },
          { codigo: "I.ECA.4.2.2", texto: "Produce presentaciones, guías o dosieres que integran texto, imagen y/o audio a partir de datos organizados, incluyendo citas y créditos" },
          { codigo: "I.ECA.4.2.3", texto: "Contrasta la consideración social e histórica de prácticas, obras o agentes (figura humana, artistas, artesanías, cine) para formular interpretaciones propias con criterios de selección y consumo responsable" },
        ],
        saberes: {
          declarativos: [
            "ECA.4.1.d.2. Técnicas de dibujo, pintura, escultura y referentes locales e internacionales (pasado y presente).",
            "ECA.4.1.d.3. Componentes y organización del diario/portafolio personal (imágenes, objetos, recortes, audio, video, texto).",
            "ECA.4.1.d.5. Nociones de línea de tiempo musical y relación música–biografía.",
            "ECA.4.1.d.6. Artes y oficios: procesos, herramientas y características de tejido, cerámica, joyería u otras prácticas artesanales.",
            "ECA.4.2.d.5. Protocolos y normas de visita a espacios culturales; fuentes de información sobre patrimonio y programación.",
            "ECA.4.3.d.2. Mujeres artistas (históricas y contemporáneas) y sus condicionantes sociales e históricos.",
            "ECA.4.3.d.3. Especialidades y profesiones artísticas: itinerarios de estudio y salidas profesionales.",
            "ECA.4.3.d.4. Metodologías de entrevista a artistas y artesanos locales.",
            "ECA.4.3.d.5. Cartografía cultural de museos, auditorios, teatros, salas de cine del Ecuador.",
            "ECA.4.3.d.6. Rasgos del arte contemporáneo (instalación) y del arte cinético.",
            "ECA.4.3.d.7. Primeras películas del cine y comparación con el cine actual analizando su contexto técnico y social.",
            "ECA.4.3.d.8. Nociones de patrimonio: monumentos (planos, maquetas), reconstrucción hipotética y color original.",
            "ECA.4.3.d.9. Señas de identidad de la cultura ecuatoriana (cerámicas, metalurgia, escultura quiteña, textiles, retratos).",
            "ECA.4.3.d.10. Manifestaciones musicales tradicionales (pasillo, sanjuanito, albazo, pasacalle), instrumentos y danzas.",
            "ECA.4.3.d.11. Cosmovisiones ancestrales y su vigencia en ritos y celebraciones.",
          ],
          procedimentales: [
            "ECA.4.1.p.5. Elaborar una línea de tiempo con obras y manifestaciones artísticas significativas y comparar semejanzas/diferencias con pares.",
            "ECA.4.1.p.6. Indagar sobre una actividad artesanal local, sistematizar técnicas y procesos, y citar fuentes consultadas.",
            "ECA.4.2.p.3. Dialogar sobre personajes representados en obras artísticas argumentando impresiones con respeto y evidencia.",
            "ECA.4.2.p.8. Investigar fuentes y preparar visitas culturales (itinerarios, normas, objetivos) y elaborar guías para la comunidad educativa.",
            "ECA.4.3.p.1. Indagar y documentar ideales de figura humana en productos escritos, visuales o audiovisuales.",
            "ECA.4.3.p.2. Buscar información en fuentes impresas y digitales sobre mujeres artistas y sintetizar hallazgos con citas.",
            "ECA.4.3.p.3. Analizar condicionantes histórico-sociales y exponer resultados en presentaciones, carteles, blogs u otros soportes.",
            "ECA.4.3.p.4. Diseñar y producir presentaciones multimedia o piezas audiovisuales sobre formaciones y profesiones artísticas.",
            "ECA.4.3.p.5. Entrevistar a artesanos/artistas locales preparando guion, registrando audio/video y editando el material.",
            "ECA.4.3.p.6. Elaborar una guía turística cultural del Ecuador seleccionando y describiendo espacios artísticos.",
            "ECA.4.3.p.7. Observar y explicar instalaciones contemporáneas interpretando ideas subyacentes.",
            "ECA.4.3.p.9. Investigar instalaciones con recursos tecnológicos y comparar enfoques de distintos creadores.",
            "ECA.4.3.p.11. Analizar películas del cine clásico y comparar con el cine actual en términos técnicos, estéticos y de recepción del público.",
            "ECA.4.3.p.12. Recrear patrimonio en plano o volumen imaginando hipótesis de estado original argumentadas.",
            "ECA.4.3.p.13. Elaborar dosieres sobre obras/objetos identitarios ecuatorianos integrando texto e imágenes.",
          ],
          actitudinales: [
            "ECA.4.1.a.2. Respetar la autoría y los referentes culturales locales.",
            "ECA.4.2.a.2. Valorar la diversidad de ideas, culturas y lenguajes expresivos en procesos colectivos.",
            "ECA.4.2.a.3. Cuidar los espacios culturales y cumplir normas de convivencia y seguridad.",
            "ECA.4.3.a.2. Reconocer y visibilizar aportes de mujeres artistas y creadores poco representados.",
            "ECA.4.3.a.3. Respetar la diversidad cultural y promover el diálogo entre tradiciones y contemporaneidad.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.ECA.4.3",
    descripcion: "Analizar las interacciones entre diversos lenguajes artísticos en producciones contemporáneas y aplicarlas en la creación de propuestas expresivas propias, para fortalecer la creatividad, la experimentación y la comunicación artística con sentido crítico",
    competenciasClave: ["CC", "CECA", "CIT"],
    porGrado: [
      {
        nivel: "MEDIA",
        grado: "QUINTO GRADO",
        indicadores: [
          { codigo: "I.ECA.4.3.1", texto: "Analiza obras contemporáneas híbridas identificando características e interacciones entre lenguajes (performance, instalación, teatro, etc.) con ejemplos concretos" },
        ],
        saberes: {
          declarativos: [
            "ECA.4.1.d.3. Componentes y organización del diario/portafolio personal (imágenes, objetos, recortes, audio, video, texto).",
            "ECA.4.1.d.5. Nociones de línea de tiempo musical y relación música–biografía.",
            "ECA.4.2.d.1. Elementos del movimiento y gesto (cuerpo y rostro) en plano y volumen.",
            "ECA.4.2.d.2. Convenciones básicas del teatro, danza, títeres, música y producción audiovisual escolar.",
            "ECA.4.2.d.3. Roles en proyectos escénicos y audiovisuales: guion, dirección, cámara, actuación, edición, sonido, mediación.",
          ],
          procedimentales: [
            "ECA.4.2.p.1. Representar acciones y gestos en plano y volumen observando proporción, secuencia y expresividad.",
            "ECA.4.3.p.8. Explicar mecanismos de movimiento en obras cinéticas tras experimentar y modelar ejemplos.",
          ],
          actitudinales: [
            "ECA.4.1.a.4. Persistir ante la dificultad técnica, solicitar y aceptar retroalimentación y mejorar el trabajo propio.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SEXTO GRADO",
        indicadores: [
          { codigo: "I.ECA.4.3.2", texto: "Integra relaciones entre lenguajes en una creación colectiva, manteniendo coherencia forma–intención y cumpliendo el rol asignado" },
          { codigo: "I.ECA.4.3.3", texto: "Documenta una instalación artística mediante registro fotográfico y/o escrito, incluyendo descriptores técnicos, decisiones curatoriales y sustentando un punto de vista personal" },
        ],
        saberes: {
          declarativos: [
            "ECA.4.1.d.5. Nociones de línea de tiempo musical y relación música–biografía.",
            "ECA.4.2.d.1. Elementos del movimiento y gesto (cuerpo y rostro) en plano y volumen.",
            "ECA.4.2.d.2. Convenciones básicas del teatro, danza, títeres, música y producción audiovisual escolar.",
            "ECA.4.2.d.6. Principios de instalación y performance en contextos escolares.",
            "ECA.4.3.d.6. Rasgos del arte contemporáneo (instalación) y del arte cinético.",
          ],
          procedimentales: [
            "ECA.4.1.p.2. Representarse mediante dibujo, pintura o escultura integrando referentes artísticos pertinentes.",
            "ECA.4.3.p.7. Observar y explicar instalaciones contemporáneas interpretando ideas subyacentes.",
            "ECA.4.3.p.8. Explicar mecanismos de movimiento en obras cinéticas tras experimentar y modelar ejemplos.",
            "ECA.4.3.p.9. Investigar instalaciones con recursos tecnológicos y comparar enfoques de distintos creadores.",
          ],
          actitudinales: [
            "ECA.4.2.a.1. Cooperar en equipos asumiendo responsabilidades y negociando acuerdos.",
            "ECA.4.2.a.3. Cuidar los espacios culturales y cumplir normas de convivencia y seguridad.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SÉPTIMO GRADO",
        indicadores: [
          { codigo: "I.ECA.4.3.1", texto: "Analiza obras contemporáneas híbridas identificando características e interacciones entre lenguajes (performance, instalación, teatro, etc.) con ejemplos concretos" },
          { codigo: "I.ECA.4.3.2", texto: "Integra relaciones entre lenguajes en una creación colectiva, manteniendo coherencia forma–intención y cumpliendo el rol asignado" },
          { codigo: "I.ECA.4.3.3", texto: "Documenta una instalación artística mediante registro fotográfico y/o escrito, incluyendo descriptores técnicos, decisiones curatoriales y sustentando un punto de vista personal" },
        ],
        saberes: {
          declarativos: [
            "ECA.4.1.d.2. Técnicas de dibujo, pintura, escultura y referentes locales e internacionales (pasado y presente).",
            "ECA.4.1.d.3. Componentes y organización del diario/portafolio personal (imágenes, objetos, recortes, audio, video, texto).",
            "ECA.4.1.d.5. Nociones de línea de tiempo musical y relación música–biografía.",
            "ECA.4.2.d.1. Elementos del movimiento y gesto (cuerpo y rostro) en plano y volumen.",
            "ECA.4.2.d.2. Convenciones básicas del teatro, danza, títeres, música y producción audiovisual escolar.",
            "ECA.4.2.d.3. Roles en proyectos escénicos y audiovisuales: guion, dirección, cámara, actuación, edición, sonido, mediación.",
            "ECA.4.2.d.6. Principios de instalación y performance en contextos escolares.",
            "ECA.4.3.d.6. Rasgos del arte contemporáneo (instalación) y del arte cinético.",
          ],
          procedimentales: [
            "ECA.4.1.p.2. Representarse mediante dibujo, pintura o escultura integrando referentes artísticos pertinentes.",
            "ECA.4.2.p.1. Representar acciones y gestos en plano y volumen observando proporción, secuencia y expresividad.",
            "ECA.4.2.p.2. Dramatizar poemas o cuentos en equipo adaptando textos, asignando roles y coordinando entradas/salidas.",
            "ECA.4.2.p.6. Diseñar y realizar instalaciones colectivas y performances que intervengan espacios escolares desde una idea común.",
            "ECA.4.2.p.7. Asumir distintos roles en producciones audiovisuales y producir piezas breves con guion y registro básicos.",
            "ECA.4.3.p.7. Observar y explicar instalaciones contemporáneas interpretando ideas subyacentes.",
            "ECA.4.3.p.8. Explicar mecanismos de movimiento en obras cinéticas tras experimentar y modelar ejemplos.",
            "ECA.4.3.p.9. Investigar instalaciones con recursos tecnológicos y comparar enfoques de distintos creadores.",
          ],
          actitudinales: [
            "ECA.4.1.a.4. Persistir ante la dificultad técnica, solicitar y aceptar retroalimentación y mejorar el trabajo propio.",
            "ECA.4.2.a.1. Cooperar en equipos asumiendo responsabilidades y negociando acuerdos.",
            "ECA.4.2.a.3. Cuidar los espacios culturales y cumplir normas de convivencia y seguridad.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "OCTAVO GRADO",
        indicadores: [
          { codigo: "I.ECA.4.3.1", texto: "Analiza obras contemporáneas híbridas identificando características e interacciones entre lenguajes (performance, instalación, teatro, etc.) con ejemplos concretos" },
        ],
        saberes: {
          declarativos: [
            "ECA.4.1.d.3. Componentes y organización del diario/portafolio personal (imágenes, objetos, recortes, audio, video, texto).",
            "ECA.4.1.d.5. Nociones de línea de tiempo musical y relación música–biografía.",
            "ECA.4.2.d.1. Elementos del movimiento y gesto (cuerpo y rostro) en plano y volumen.",
          ],
          procedimentales: [
            "ECA.4.3.p.7. Observar y explicar instalaciones contemporáneas interpretando ideas subyacentes.",
            "ECA.4.3.p.8. Explicar mecanismos de movimiento en obras cinéticas tras experimentar y modelar ejemplos.",
            "ECA.4.3.p.9. Investigar instalaciones con recursos tecnológicos y comparar enfoques de distintos creadores.",
          ],
          actitudinales: [
            "ECA.4.2.a.3. Cuidar los espacios culturales y cumplir normas de convivencia y seguridad.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "NOVENO GRADO",
        indicadores: [
          { codigo: "I.ECA.4.3.2", texto: "Integra relaciones entre lenguajes en una creación colectiva, manteniendo coherencia forma–intención y cumpliendo el rol asignado" },
          { codigo: "I.ECA.4.3.3", texto: "Documenta una instalación artística mediante registro fotográfico y/o escrito, incluyendo descriptores técnicos, decisiones curatoriales y sustentando un punto de vista personal" },
        ],
        saberes: {
          declarativos: [
            "ECA.4.1.d.2. Técnicas de dibujo, pintura, escultura y referentes locales e internacionales (pasado y presente).",
            "ECA.4.2.d.2. Convenciones básicas del teatro, danza, títeres, música y producción audiovisual escolar.",
            "ECA.4.2.d.3. Roles en proyectos escénicos y audiovisuales: guion, dirección, cámara, actuación, edición, sonido, mediación.",
            "ECA.4.2.d.6. Principios de instalación y performance en contextos escolares.",
            "ECA.4.3.d.6. Rasgos del arte contemporáneo (instalación) y del arte cinético.",
          ],
          procedimentales: [
            "ECA.4.1.p.2. Representarse mediante dibujo, pintura o escultura integrando referentes artísticos pertinentes.",
            "ECA.4.2.p.1. Representar acciones y gestos en plano y volumen observando proporción, secuencia y expresividad.",
            "ECA.4.2.p.2. Dramatizar poemas o cuentos en equipo adaptando textos, asignando roles y coordinando entradas/salidas.",
            "ECA.4.2.p.6. Diseñar y realizar instalaciones colectivas y performances que intervengan espacios escolares desde una idea común.",
            "ECA.4.2.p.7. Asumir distintos roles en producciones audiovisuales y producir piezas breves con guion y registro básicos.",
          ],
          actitudinales: [
            "ECA.4.1.a.4. Persistir ante la dificultad técnica, solicitar y aceptar retroalimentación y mejorar el trabajo propio.",
            "ECA.4.2.a.1. Cooperar en equipos asumiendo responsabilidades y negociando acuerdos.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "DÉCIMO GRADO",
        indicadores: [
          { codigo: "I.ECA.4.3.1", texto: "Analiza obras contemporáneas híbridas identificando características e interacciones entre lenguajes (performance, instalación, teatro, etc.) con ejemplos concretos" },
          { codigo: "I.ECA.4.3.2", texto: "Integra relaciones entre lenguajes en una creación colectiva, manteniendo coherencia forma–intención y cumpliendo el rol asignado" },
          { codigo: "I.ECA.4.3.3", texto: "Documenta una instalación artística mediante registro fotográfico y/o escrito, incluyendo descriptores técnicos, decisiones curatoriales y sustentando un punto de vista personal" },
        ],
        saberes: {
          declarativos: [
            "ECA.4.1.d.2. Técnicas de dibujo, pintura, escultura y referentes locales e internacionales (pasado y presente).",
            "ECA.4.1.d.3. Componentes y organización del diario/portafolio personal (imágenes, objetos, recortes, audio, video, texto).",
            "ECA.4.1.d.5. Nociones de línea de tiempo musical y relación música–biografía.",
            "ECA.4.2.d.1. Elementos del movimiento y gesto (cuerpo y rostro) en plano y volumen.",
            "ECA.4.2.d.2. Convenciones básicas del teatro, danza, títeres, música y producción audiovisual escolar.",
            "ECA.4.2.d.3. Roles en proyectos escénicos y audiovisuales: guion, dirección, cámara, actuación, edición, sonido, mediación.",
            "ECA.4.2.d.6. Principios de instalación y performance en contextos escolares.",
            "ECA.4.3.d.6. Rasgos del arte contemporáneo (instalación) y del arte cinético.",
          ],
          procedimentales: [
            "ECA.4.1.p.2. Representarse mediante dibujo, pintura o escultura integrando referentes artísticos pertinentes.",
            "ECA.4.2.p.1. Representar acciones y gestos en plano y volumen observando proporción, secuencia y expresividad.",
            "ECA.4.2.p.2. Dramatizar poemas o cuentos en equipo adaptando textos, asignando roles y coordinando entradas/salidas.",
            "ECA.4.2.p.6. Diseñar y realizar instalaciones colectivas y performances que intervengan espacios escolares desde una idea común.",
            "ECA.4.2.p.7. Asumir distintos roles en producciones audiovisuales y producir piezas breves con guion y registro básicos.",
            "ECA.4.3.p.7. Observar y explicar instalaciones contemporáneas interpretando ideas subyacentes.",
            "ECA.4.3.p.8. Explicar mecanismos de movimiento en obras cinéticas tras experimentar y modelar ejemplos.",
            "ECA.4.3.p.9. Investigar instalaciones con recursos tecnológicos y comparar enfoques de distintos creadores.",
          ],
          actitudinales: [
            "ECA.4.1.a.4. Persistir ante la dificultad técnica, solicitar y aceptar retroalimentación y mejorar el trabajo propio.",
            "ECA.4.2.a.1. Cooperar en equipos asumiendo responsabilidades y negociando acuerdos.",
            "ECA.4.2.a.3. Cuidar los espacios culturales y cumplir normas de convivencia y seguridad.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.ECA.3.4",
    descripcion: "Crear producciones escénicas colectivas mediante la aplicación de técnicas teatrales, la distribución de roles y el trabajo colaborativo, para comunicar ideas y emociones, fortalecer la empatía y asumir responsabilidades compartidas durante el proceso creativo",
    competenciasClave: ["CC", "CSE", "CECA"],
    porGrado: [
      {
        nivel: "MEDIA",
        grado: "QUINTO GRADO",
        indicadores: [
          { codigo: "I.ECA.3.4.1", texto: "Describe la proyección de su sombra corporal y las características básicas del teatro de sombras a partir de la observación y búsqueda de información" },
        ],
        saberes: {
          declarativos: [
          ],
          procedimentales: [
          ],
          actitudinales: [
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SEXTO GRADO",
        indicadores: [
          { codigo: "I.ECA.3.4.2", texto: "Aplica recursos básicos del teatro de sombras (siluetas, foco, pantalla y movimiento), títeres o dramatizaciones en una creación colectiva con interpretación y roles acordados" },
        ],
        saberes: {
          declarativos: [
          ],
          procedimentales: [
          ],
          actitudinales: [
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SÉPTIMO GRADO",
        indicadores: [
          { codigo: "I.ECA.3.4.1", texto: "Describe la proyección de su sombra corporal y las características básicas del teatro de sombras a partir de la observación y búsqueda de información" },
          { codigo: "I.ECA.3.4.2", texto: "Aplica recursos básicos del teatro de sombras (siluetas, foco, pantalla y movimiento), títeres o dramatizaciones en una creación colectiva con interpretación y roles acordados" },
        ],
        saberes: {
          declarativos: [
          ],
          procedimentales: [
          ],
          actitudinales: [
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "OCTAVO GRADO",
        indicadores: [
          { codigo: "I.ECA.3.4.1", texto: "Describe la proyección de su sombra corporal y las características básicas del teatro de sombras a partir de la observación y búsqueda de información" },
        ],
        saberes: {
          declarativos: [
          ],
          procedimentales: [
          ],
          actitudinales: [
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "NOVENO GRADO",
        indicadores: [
          { codigo: "I.ECA.3.4.2", texto: "Aplica recursos básicos del teatro de sombras (siluetas, foco, pantalla y movimiento), títeres o dramatizaciones en una creación colectiva con interpretación y roles acordados" },
        ],
        saberes: {
          declarativos: [
          ],
          procedimentales: [
          ],
          actitudinales: [
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "DÉCIMO GRADO",
        indicadores: [
          { codigo: "I.ECA.3.4.1", texto: "Describe la proyección de su sombra corporal y las características básicas del teatro de sombras a partir de la observación y búsqueda de información" },
          { codigo: "I.ECA.3.4.2", texto: "Aplica recursos básicos del teatro de sombras (siluetas, foco, pantalla y movimiento), títeres o dramatizaciones en una creación colectiva con interpretación y roles acordados" },
        ],
        saberes: {
          declarativos: [
          ],
          procedimentales: [
          ],
          actitudinales: [
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.ECA.4.5",
    descripcion: "Gestionar proyectos artísticos y eventos culturales mediante la planificación, la organización, la ejecución y la evaluación participativa, para fortalecer el trabajo colaborativo, la participación comunitaria y la valoración de las manifestaciones culturales",
    competenciasClave: ["CC", "CCICC", "CIT", "CECA"],
    porGrado: [
      {
        nivel: "MEDIA",
        grado: "QUINTO GRADO",
        indicadores: [
          { codigo: "I.ECA.4.5.1", texto: "Planifica un proyecto artístico local definiendo propósito, público, cronograma, roles y recursos, incluyendo criterios básicos de difusión y cuidado del espacio" },
        ],
        saberes: {
          declarativos: [
            "ECA.4.1.d.3. Componentes y organización del diario/portafolio personal (imágenes, objetos, recortes, audio, video, texto).",
            "ECA.4.1.d.5. Nociones de línea de tiempo musical y relación música–biografía.",
            "ECA.4.1.d.6. Artes y oficios: procesos, herramientas y características de tejido, cerámica, joyería u otras prácticas artesanales.",
            "ECA.4.2.d.2. Convenciones básicas del teatro, danza, títeres, música y producción audiovisual escolar.",
            "ECA.4.2.d.4. Estrategias de autoaprendizaje en música y danza comunitaria.",
            "ECA.4.2.d.5. Protocolos y normas de visita a espacios culturales; fuentes de información sobre patrimonio y programación.",
            "ECA.4.2.d.6. Principios de instalación y performance en contextos escolares.",
          ],
          procedimentales: [
            "ECA.4.1.p.6. Indagar sobre una actividad artesanal local, sistematizar técnicas y procesos, y citar fuentes consultadas.",
            "ECA.4.2.p.5. Conectar con estudiantes de otros contextos para compartir procesos y co-crear piezas que favorezcan el entendimiento intercultural.",
            "ECA.4.2.p.6. Diseñar y realizar instalaciones colectivas y performances que intervengan espacios escolares desde una idea común.",
          ],
          actitudinales: [
            "ECA.4.1.a.2. Respetar la autoría y los referentes culturales locales.",
            "ECA.4.2.a.1. Cooperar en equipos asumiendo responsabilidades y negociando acuerdos.",
            "ECA.4.2.a.2. Valorar la diversidad de ideas, culturas y lenguajes expresivos en procesos colectivos.",
            "ECA.4.2.a.3. Cuidar los espacios culturales y cumplir normas de convivencia y seguridad.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SEXTO GRADO",
        indicadores: [
          { codigo: "I.ECA.4.5.2", texto: "Implementa el proyecto aplicando técnicas aprendidas y ajustando procedimientos ante imprevistos para asegurar la calidad del resultado" },
          { codigo: "I.ECA.4.5.3", texto: "Evalúa el proyecto con participación de la comunidad recogiendo evidencias (asistencia, retroalimentación, registros) y argumentando mejoras para futuras ediciones" },
        ],
        saberes: {
          declarativos: [
            "ECA.4.2.d.3. Roles en proyectos escénicos y audiovisuales: guion, dirección, cámara, actuación, edición, sonido, mediación.",
            "ECA.4.3.d.4. Metodologías de entrevista a artistas y artesanos locales.",
            "ECA.4.3.d.5. Cartografía cultural de museos, auditorios, teatros, salas de cine del Ecuador.",
            "ECA.4.3.d.6. Rasgos del arte contemporáneo (instalación) y del arte cinético.",
          ],
          procedimentales: [
            "ECA.4.1.p.3. Construir un diario/portafolio personal que seleccione, organice y describa evidencias significativas.",
            "ECA.4.1.p.7. Diseñar y producir un objeto artesanal sencillo aplicando técnicas, resolviendo problemas y documentando el proceso.",
            "ECA.4.2.p.4. Practicar canciones y danzas de la comunidad empleando recursos de autoaprendizaje y ajustando la interpretación.",
            "ECA.4.2.p.6. Diseñar y realizar instalaciones colectivas y performances que intervengan espacios escolares desde una idea común.",
            "ECA.4.2.p.7. Asumir distintos roles en producciones audiovisuales y producir piezas breves con guion y registro básicos.",
            "ECA.4.2.p.8. Investigar fuentes y preparar visitas culturales (itinerarios, normas, objetivos) y elaborar guías para la comunidad educativa.",
            "ECA.4.3.p.4. Diseñar y producir presentaciones multimedia o piezas audiovisuales sobre formaciones y profesiones artísticas.",
            "ECA.4.3.p.5. Entrevistar a artesanos/artistas locales preparando guion, registrando audio/video y editando el material.",
            "ECA.4.3.p.6. Elaborar una guía turística cultural del Ecuador seleccionando y describiendo espacios artísticos.",
            "ECA.4.3.p.7. Observar y explicar instalaciones contemporáneas interpretando ideas subyacentes.",
          ],
          actitudinales: [
            "ECA.4.1.a.4. Persistir ante la dificultad técnica, solicitar y aceptar retroalimentación y mejorar el trabajo propio.",
            "ECA.4.2.a.4. Apreciar el intercambio intercultural con apertura, curiosidad y respeto.",
            "ECA.4.3.a.4. Comprometerse con la comunidad compartiendo hallazgos de forma ética, clara y accesible.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SÉPTIMO GRADO",
        indicadores: [
          { codigo: "I.ECA.4.5.1", texto: "Planifica un proyecto artístico local definiendo propósito, público, cronograma, roles y recursos, incluyendo criterios básicos de difusión y cuidado del espacio" },
          { codigo: "I.ECA.4.5.2", texto: "Implementa el proyecto aplicando técnicas aprendidas y ajustando procedimientos ante imprevistos para asegurar la calidad del resultado" },
          { codigo: "I.ECA.4.5.3", texto: "Evalúa el proyecto con participación de la comunidad recogiendo evidencias (asistencia, retroalimentación, registros) y argumentando mejoras para futuras ediciones" },
        ],
        saberes: {
          declarativos: [
            "ECA.4.1.d.3. Componentes y organización del diario/portafolio personal (imágenes, objetos, recortes, audio, video, texto).",
            "ECA.4.1.d.5. Nociones de línea de tiempo musical y relación música–biografía.",
            "ECA.4.1.d.6. Artes y oficios: procesos, herramientas y características de tejido, cerámica, joyería u otras prácticas artesanales.",
            "ECA.4.2.d.2. Convenciones básicas del teatro, danza, títeres, música y producción audiovisual escolar.",
            "ECA.4.2.d.3. Roles en proyectos escénicos y audiovisuales: guion, dirección, cámara, actuación, edición, sonido, mediación.",
            "ECA.4.2.d.4. Estrategias de autoaprendizaje en música y danza comunitaria.",
            "ECA.4.2.d.5. Protocolos y normas de visita a espacios culturales; fuentes de información sobre patrimonio y programación.",
            "ECA.4.2.d.6. Principios de instalación y performance en contextos escolares.",
            "ECA.4.3.d.3. Especialidades y profesiones artísticas: itinerarios de estudio y salidas profesionales.",
            "ECA.4.3.d.4. Metodologías de entrevista a artistas y artesanos locales.",
            "ECA.4.3.d.5. Cartografía cultural de museos, auditorios, teatros, salas de cine del Ecuador.",
            "ECA.4.3.d.6. Rasgos del arte contemporáneo (instalación) y del arte cinético.",
          ],
          procedimentales: [
            "ECA.4.1.p.3. Construir un diario/portafolio personal que seleccione, organice y describa evidencias significativas.",
            "ECA.4.1.p.6. Indagar sobre una actividad artesanal local, sistematizar técnicas y procesos, y citar fuentes consultadas.",
            "ECA.4.1.p.7. Diseñar y producir un objeto artesanal sencillo aplicando técnicas, resolviendo problemas y documentando el proceso.",
            "ECA.4.2.p.4. Practicar canciones y danzas de la comunidad empleando recursos de autoaprendizaje y ajustando la interpretación.",
            "ECA.4.2.p.5. Conectar con estudiantes de otros contextos para compartir procesos y co-crear piezas que favorezcan el entendimiento intercultural.",
            "ECA.4.2.p.6. Diseñar y realizar instalaciones colectivas y performances que intervengan espacios escolares desde una idea común.",
            "ECA.4.2.p.7. Asumir distintos roles en producciones audiovisuales y producir piezas breves con guion y registro básicos.",
            "ECA.4.2.p.8. Investigar fuentes y preparar visitas culturales (itinerarios, normas, objetivos) y elaborar guías para la comunidad educativa.",
            "ECA.4.3.p.4. Diseñar y producir presentaciones multimedia o piezas audiovisuales sobre formaciones y profesiones artísticas.",
            "ECA.4.3.p.5. Entrevistar a artesanos/artistas locales preparando guion, registrando audio/video y editando el material.",
            "ECA.4.3.p.6. Elaborar una guía turística cultural del Ecuador seleccionando y describiendo espacios artísticos.",
            "ECA.4.3.p.7. Observar y explicar instalaciones contemporáneas interpretando ideas subyacentes.",
          ],
          actitudinales: [
            "ECA.4.1.a.2. Respetar la autoría y los referentes culturales locales.",
            "ECA.4.1.a.4. Persistir ante la dificultad técnica, solicitar y aceptar retroalimentación y mejorar el trabajo propio.",
            "ECA.4.2.a.1. Cooperar en equipos asumiendo responsabilidades y negociando acuerdos.",
            "ECA.4.2.a.2. Valorar la diversidad de ideas, culturas y lenguajes expresivos en procesos colectivos.",
            "ECA.4.2.a.3. Cuidar los espacios culturales y cumplir normas de convivencia y seguridad.",
            "ECA.4.2.a.4. Apreciar el intercambio intercultural con apertura, curiosidad y respeto.",
            "ECA.4.3.a.4. Comprometerse con la comunidad compartiendo hallazgos de forma ética, clara y accesible.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "OCTAVO GRADO",
        indicadores: [
          { codigo: "I.ECA.4.5.1", texto: "Planifica un proyecto artístico local definiendo propósito, público, cronograma, roles y recursos, incluyendo criterios básicos de difusión y cuidado del espacio" },
        ],
        saberes: {
          declarativos: [
            "ECA.4.1.d.3. Componentes y organización del diario/portafolio personal (imágenes, objetos, recortes, audio, video, texto).",
            "ECA.4.2.d.5. Protocolos y normas de visita a espacios culturales; fuentes de información sobre patrimonio y programación.",
            "ECA.4.2.d.6. Principios de instalación y performance en contextos escolares.",
            "ECA.4.3.d.3. Especialidades y profesiones artísticas: itinerarios de estudio y salidas profesionales.",
            "ECA.4.3.d.4. Metodologías de entrevista a artistas y artesanos locales.",
            "ECA.4.3.d.5. Cartografía cultural de museos, auditorios, teatros, salas de cine del Ecuador.",
            "ECA.4.3.d.6. Rasgos del arte contemporáneo (instalación) y del arte cinético.",
          ],
          procedimentales: [
            "ECA.4.1.p.3. Construir un diario/portafolio personal que seleccione, organice y describa evidencias significativas.",
            "ECA.4.1.p.6. Indagar sobre una actividad artesanal local, sistematizar técnicas y procesos, y citar fuentes consultadas.",
            "ECA.4.1.p.7. Diseñar y producir un objeto artesanal sencillo aplicando técnicas, resolviendo problemas y documentando el proceso.",
            "ECA.4.2.p.4. Practicar canciones y danzas de la comunidad empleando recursos de autoaprendizaje y ajustando la interpretación.",
            "ECA.4.2.p.5. Conectar con estudiantes de otros contextos para compartir procesos y co-crear piezas que favorezcan el entendimiento intercultural.",
            "ECA.4.2.p.6. Diseñar y realizar instalaciones colectivas y performances que intervengan espacios escolares desde una idea común.",
            "ECA.4.2.p.7. Asumir distintos roles en producciones audiovisuales y producir piezas breves con guion y registro básicos.",
            "ECA.4.2.p.8. Investigar fuentes y preparar visitas culturales (itinerarios, normas, objetivos) y elaborar guías para la comunidad educativa.",
            "ECA.4.3.p.4. Diseñar y producir presentaciones multimedia o piezas audiovisuales sobre formaciones y profesiones artísticas.",
            "ECA.4.3.p.5. Entrevistar a artesanos/artistas locales preparando guion, registrando audio/video y editando el material.",
            "ECA.4.3.p.6. Elaborar una guía turística cultural del Ecuador seleccionando y describiendo espacios artísticos.",
            "ECA.4.3.p.7. Observar y explicar instalaciones contemporáneas interpretando ideas subyacentes.",
          ],
          actitudinales: [
            "ECA.4.1.a.2. Respetar la autoría y los referentes culturales locales.",
            "ECA.4.1.a.4. Persistir ante la dificultad técnica, solicitar y aceptar retroalimentación y mejorar el trabajo propio.",
            "ECA.4.2.a.4. Apreciar el intercambio intercultural con apertura, curiosidad y respeto.",
            "ECA.4.3.a.4. Comprometerse con la comunidad compartiendo hallazgos de forma ética, clara y accesible.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "NOVENO GRADO",
        indicadores: [
          { codigo: "I.ECA.4.5.2", texto: "Implementa el proyecto aplicando técnicas aprendidas y ajustando procedimientos ante imprevistos para asegurar la calidad del resultado" },
          { codigo: "I.ECA.4.5.3", texto: "Evalúa el proyecto con participación de la comunidad recogiendo evidencias (asistencia, retroalimentación, registros) y argumentando mejoras para futuras ediciones" },
        ],
        saberes: {
          declarativos: [
            "ECA.4.1.d.5. Nociones de línea de tiempo musical y relación música–biografía.",
            "ECA.4.1.d.6. Artes y oficios: procesos, herramientas y características de tejido, cerámica, joyería u otras prácticas artesanales.",
            "ECA.4.2.d.2. Convenciones básicas del teatro, danza, títeres, música y producción audiovisual escolar.",
            "ECA.4.2.d.3. Roles en proyectos escénicos y audiovisuales: guion, dirección, cámara, actuación, edición, sonido, mediación.",
            "ECA.4.2.d.4. Estrategias de autoaprendizaje en música y danza comunitaria.",
          ],
          procedimentales: [
            "ECA.4.1.p.3. Construir un diario/portafolio personal que seleccione, organice y describa evidencias significativas.",
            "ECA.4.1.p.6. Indagar sobre una actividad artesanal local, sistematizar técnicas y procesos, y citar fuentes consultadas.",
            "ECA.4.1.p.7. Diseñar y producir un objeto artesanal sencillo aplicando técnicas, resolviendo problemas y documentando el proceso.",
            "ECA.4.2.p.4. Practicar canciones y danzas de la comunidad empleando recursos de autoaprendizaje y ajustando la interpretación.",
            "ECA.4.2.p.5. Conectar con estudiantes de otros contextos para compartir procesos y co-crear piezas que favorezcan el entendimiento intercultural.",
            "ECA.4.2.p.6. Diseñar y realizar instalaciones colectivas y performances que intervengan espacios escolares desde una idea común.",
            "ECA.4.2.p.7. Asumir distintos roles en producciones audiovisuales y producir piezas breves con guion y registro básicos.",
            "ECA.4.2.p.8. Investigar fuentes y preparar visitas culturales (itinerarios, normas, objetivos) y elaborar guías para la comunidad educativa.",
            "ECA.4.3.p.4. Diseñar y producir presentaciones multimedia o piezas audiovisuales sobre formaciones y profesiones artísticas.",
            "ECA.4.3.p.5. Entrevistar a artesanos/artistas locales preparando guion, registrando audio/video y editando el material.",
            "ECA.4.3.p.6. Elaborar una guía turística cultural del Ecuador seleccionando y describiendo espacios artísticos.",
            "ECA.4.3.p.7. Observar y explicar instalaciones contemporáneas interpretando ideas subyacentes.",
          ],
          actitudinales: [
            "ECA.4.2.a.1. Cooperar en equipos asumiendo responsabilidades y negociando acuerdos.",
            "ECA.4.2.a.2. Valorar la diversidad de ideas, culturas y lenguajes expresivos en procesos colectivos.",
            "ECA.4.2.a.3. Cuidar los espacios culturales y cumplir normas de convivencia y seguridad.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "DÉCIMO GRADO",
        indicadores: [
          { codigo: "I.ECA.4.5.1", texto: "Planifica un proyecto artístico local definiendo propósito, público, cronograma, roles y recursos, incluyendo criterios básicos de difusión y cuidado del espacio" },
          { codigo: "I.ECA.4.5.2", texto: "Implementa el proyecto aplicando técnicas aprendidas y ajustando procedimientos ante imprevistos para asegurar la calidad del resultado" },
          { codigo: "I.ECA.4.5.3", texto: "Evalúa el proyecto con participación de la comunidad recogiendo evidencias (asistencia, retroalimentación, registros) y argumentando mejoras para futuras ediciones" },
        ],
        saberes: {
          declarativos: [
            "ECA.4.1.d.3. Componentes y organización del diario/portafolio personal (imágenes, objetos, recortes, audio, video, texto).",
            "ECA.4.1.d.5. Nociones de línea de tiempo musical y relación música–biografía.",
            "ECA.4.1.d.6. Artes y oficios: procesos, herramientas y características de tejido, cerámica, joyería u otras prácticas artesanales.",
            "ECA.4.2.d.2. Convenciones básicas del teatro, danza, títeres, música y producción audiovisual escolar.",
            "ECA.4.2.d.3. Roles en proyectos escénicos y audiovisuales: guion, dirección, cámara, actuación, edición, sonido, mediación.",
            "ECA.4.2.d.4. Estrategias de autoaprendizaje en música y danza comunitaria.",
            "ECA.4.2.d.5. Protocolos y normas de visita a espacios culturales; fuentes de información sobre patrimonio y programación.",
            "ECA.4.2.d.6. Principios de instalación y performance en contextos escolares.",
            "ECA.4.3.d.3. Especialidades y profesiones artísticas: itinerarios de estudio y salidas profesionales.",
            "ECA.4.3.d.4. Metodologías de entrevista a artistas y artesanos locales.",
            "ECA.4.3.d.5. Cartografía cultural de museos, auditorios, teatros, salas de cine del Ecuador.",
            "ECA.4.3.d.6. Rasgos del arte contemporáneo (instalación) y del arte cinético.",
          ],
          procedimentales: [
            "ECA.4.1.p.3. Construir un diario/portafolio personal que seleccione, organice y describa evidencias significativas.",
            "ECA.4.1.p.6. Indagar sobre una actividad artesanal local, sistematizar técnicas y procesos, y citar fuentes consultadas.",
            "ECA.4.1.p.7. Diseñar y producir un objeto artesanal sencillo aplicando técnicas, resolviendo problemas y documentando el proceso.",
            "ECA.4.2.p.4. Practicar canciones y danzas de la comunidad empleando recursos de autoaprendizaje y ajustando la interpretación.",
            "ECA.4.2.p.5. Conectar con estudiantes de otros contextos para compartir procesos y co-crear piezas que favorezcan el entendimiento intercultural.",
            "ECA.4.2.p.6. Diseñar y realizar instalaciones colectivas y performances que intervengan espacios escolares desde una idea común.",
            "ECA.4.2.p.7. Asumir distintos roles en producciones audiovisuales y producir piezas breves con guion y registro básicos.",
            "ECA.4.2.p.8. Investigar fuentes y preparar visitas culturales (itinerarios, normas, objetivos) y elaborar guías para la comunidad educativa.",
            "ECA.4.3.p.4. Diseñar y producir presentaciones multimedia o piezas audiovisuales sobre formaciones y profesiones artísticas.",
            "ECA.4.3.p.5. Entrevistar a artesanos/artistas locales preparando guion, registrando audio/video y editando el material.",
            "ECA.4.3.p.6. Elaborar una guía turística cultural del Ecuador seleccionando y describiendo espacios artísticos.",
            "ECA.4.3.p.7. Observar y explicar instalaciones contemporáneas interpretando ideas subyacentes.",
          ],
          actitudinales: [
            "ECA.4.1.a.2. Respetar la autoría y los referentes culturales locales.",
            "ECA.4.1.a.4. Persistir ante la dificultad técnica, solicitar y aceptar retroalimentación y mejorar el trabajo propio.",
            "ECA.4.2.a.1. Cooperar en equipos asumiendo responsabilidades y negociando acuerdos.",
            "ECA.4.2.a.2. Valorar la diversidad de ideas, culturas y lenguajes expresivos en procesos colectivos.",
            "ECA.4.2.a.3. Cuidar los espacios culturales y cumplir normas de convivencia y seguridad.",
            "ECA.4.2.a.4. Apreciar el intercambio intercultural con apertura, curiosidad y respeto.",
            "ECA.4.3.a.4. Comprometerse con la comunidad compartiendo hallazgos de forma ética, clara y accesible.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.ECA.4.6",
    descripcion: "Utilizar recursos digitales para buscar, analizar, crear y difundir contenidos artísticos y culturales con criterios éticos de uso de fuentes, licencias, protección de datos y comunicación responsable, para fortalecer los aprendizajes, la participación cultural y la ciudadanía digital",
    competenciasClave: ["CD", "CC", "CCICC", "CECA"],
    porGrado: [
      {
        nivel: "MEDIA",
        grado: "QUINTO GRADO",
        indicadores: [
          { codigo: "I.ECA.4.6.1", texto: "Selecciona información pertinente sobre arte y cultura en fuentes impresas y digitales, con registro de autoría, fecha y licencia para su uso escolar" },
        ],
        saberes: {
          declarativos: [
            "ECA.4.1.d.2. Técnicas de dibujo, pintura, escultura y referentes locales e internacionales (pasado y presente).",
            "ECA.4.1.d.3. Componentes y organización del diario/portafolio personal (imágenes, objetos, recortes, audio, video, texto).",
            "ECA.4.1.d.5. Nociones de línea de tiempo musical y relación música–biografía.",
          ],
          procedimentales: [
            "ECA.4.1.p.3. Construir un diario/portafolio personal que seleccione, organice y describa evidencias significativas.",
            "ECA.4.1.p.5. Elaborar una línea de tiempo con obras y manifestaciones artísticas significativas y comparar semejanzas/diferencias con pares.",
            "ECA.4.3.p.3. Analizar condicionantes histórico-sociales y exponer resultados en presentaciones, carteles, blogs u otros soportes.",
            "ECA.4.3.p.5. Entrevistar a artesanos/artistas locales preparando guion, registrando audio/video y editando el material.",
            "ECA.4.3.p.7. Observar y explicar instalaciones contemporáneas interpretando ideas subyacentes.",
            "ECA.4.3.p.9. Investigar instalaciones con recursos tecnológicos y comparar enfoques de distintos creadores.",
            "ECA.4.3.p.10. Fotografiar cambios en objetos/entorno y montar presentaciones que muestren el paso del tiempo.",
          ],
          actitudinales: [
            "ECA.4.1.a.2. Respetar la autoría y los referentes culturales locales.",
            "ECA.4.2.a.2. Valorar la diversidad de ideas, culturas y lenguajes expresivos en procesos colectivos.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SEXTO GRADO",
        indicadores: [
          { codigo: "I.ECA.4.6.1", texto: "Selecciona información pertinente sobre arte y cultura en fuentes impresas y digitales, con registro de autoría, fecha y licencia para su uso escolar" },
          { codigo: "I.ECA.4.6.2", texto: "Produce contenidos audiovisuales o multimedia de forma individual o colectiva, empleando herramientas digitales acordes al propósito y la audiencia" },
          { codigo: "I.ECA.4.6.3", texto: "Difunde producciones originales o remezclas en entornos definidos por el centro, con atribución de autorías, uso de licencias adecuadas y cuidado de datos e imagen" },
        ],
        saberes: {
          declarativos: [
            "ECA.4.2.d.2. Convenciones básicas del teatro, danza, títeres, música y producción audiovisual escolar.",
            "ECA.4.2.d.3. Roles en proyectos escénicos y audiovisuales: guion, dirección, cámara, actuación, edición, sonido, mediación.",
            "ECA.4.3.d.2. Mujeres artistas (históricas y contemporáneas) y sus condicionantes sociales e históricos.",
            "ECA.4.3.d.3. Especialidades y profesiones artísticas: itinerarios de estudio y salidas profesionales.",
            "ECA.4.3.d.4. Metodologías de entrevista a artistas y artesanos locales.",
            "ECA.4.3.d.6. Rasgos del arte contemporáneo (instalación) y del arte cinético.",
          ],
          procedimentales: [
            "ECA.4.2.p.5. Conectar con estudiantes de otros contextos para compartir procesos y co-crear piezas que favorezcan el entendimiento intercultural.",
            "ECA.4.2.p.7. Asumir distintos roles en producciones audiovisuales y producir piezas breves con guion y registro básicos.",
            "ECA.4.3.p.2. Buscar información en fuentes impresas y digitales sobre mujeres artistas y sintetizar hallazgos con citas.",
            "ECA.4.3.p.4. Diseñar y producir presentaciones multimedia o piezas audiovisuales sobre formaciones y profesiones artísticas.",
            "ECA.4.3.p.10. Fotografiar cambios en objetos/entorno y montar presentaciones que muestren el paso del tiempo.",
          ],
          actitudinales: [
            "ECA.4.1.a.4. Persistir ante la dificultad técnica, solicitar y aceptar retroalimentación y mejorar el trabajo propio.",
            "ECA.4.2.a.3. Cuidar los espacios culturales y cumplir normas de convivencia y seguridad.",
            "ECA.4.2.a.4. Apreciar el intercambio intercultural con apertura, curiosidad y respeto.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SÉPTIMO GRADO",
        indicadores: [
          { codigo: "I.ECA.4.6.1", texto: "Selecciona información pertinente sobre arte y cultura en fuentes impresas y digitales, con registro de autoría, fecha y licencia para su uso escolar" },
          { codigo: "I.ECA.4.6.2", texto: "Produce contenidos audiovisuales o multimedia de forma individual o colectiva, empleando herramientas digitales acordes al propósito y la audiencia" },
          { codigo: "I.ECA.4.6.3", texto: "Difunde producciones originales o remezclas en entornos definidos por el centro, con atribución de autorías, uso de licencias adecuadas y cuidado de datos e imagen" },
        ],
        saberes: {
          declarativos: [
            "ECA.4.1.d.2. Técnicas de dibujo, pintura, escultura y referentes locales e internacionales (pasado y presente).",
            "ECA.4.1.d.3. Componentes y organización del diario/portafolio personal (imágenes, objetos, recortes, audio, video, texto).",
            "ECA.4.1.d.5. Nociones de línea de tiempo musical y relación música–biografía.",
            "ECA.4.2.d.2. Convenciones básicas del teatro, danza, títeres, música y producción audiovisual escolar.",
            "ECA.4.2.d.3. Roles en proyectos escénicos y audiovisuales: guion, dirección, cámara, actuación, edición, sonido, mediación.",
            "ECA.4.3.d.2. Mujeres artistas (históricas y contemporáneas) y sus condicionantes sociales e históricos.",
            "ECA.4.3.d.3. Especialidades y profesiones artísticas: itinerarios de estudio y salidas profesionales.",
            "ECA.4.3.d.4. Metodologías de entrevista a artistas y artesanos locales.",
            "ECA.4.3.d.6. Rasgos del arte contemporáneo (instalación) y del arte cinético.",
          ],
          procedimentales: [
            "ECA.4.1.p.3. Construir un diario/portafolio personal que seleccione, organice y describa evidencias significativas.",
            "ECA.4.1.p.5. Elaborar una línea de tiempo con obras y manifestaciones artísticas significativas y comparar semejanzas/diferencias con pares.",
            "ECA.4.2.p.5. Conectar con estudiantes de otros contextos para compartir procesos y co-crear piezas que favorezcan el entendimiento intercultural.",
            "ECA.4.2.p.7. Asumir distintos roles en producciones audiovisuales y producir piezas breves con guion y registro básicos.",
            "ECA.4.3.p.2. Buscar información en fuentes impresas y digitales sobre mujeres artistas y sintetizar hallazgos con citas.",
            "ECA.4.3.p.3. Analizar condicionantes histórico-sociales y exponer resultados en presentaciones, carteles, blogs u otros soportes.",
            "ECA.4.3.p.4. Diseñar y producir presentaciones multimedia o piezas audiovisuales sobre formaciones y profesiones artísticas.",
            "ECA.4.3.p.5. Entrevistar a artesanos/artistas locales preparando guion, registrando audio/video y editando el material.",
            "ECA.4.3.p.7. Observar y explicar instalaciones contemporáneas interpretando ideas subyacentes.",
            "ECA.4.3.p.9. Investigar instalaciones con recursos tecnológicos y comparar enfoques de distintos creadores.",
            "ECA.4.3.p.10. Fotografiar cambios en objetos/entorno y montar presentaciones que muestren el paso del tiempo.",
          ],
          actitudinales: [
            "ECA.4.1.a.2. Respetar la autoría y los referentes culturales locales.",
            "ECA.4.1.a.4. Persistir ante la dificultad técnica, solicitar y aceptar retroalimentación y mejorar el trabajo propio.",
            "ECA.4.2.a.2. Valorar la diversidad de ideas, culturas y lenguajes expresivos en procesos colectivos.",
            "ECA.4.2.a.3. Cuidar los espacios culturales y cumplir normas de convivencia y seguridad.",
            "ECA.4.2.a.4. Apreciar el intercambio intercultural con apertura, curiosidad y respeto.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "OCTAVO GRADO",
        indicadores: [
          { codigo: "I.ECA.4.6.1", texto: "Selecciona información pertinente sobre arte y cultura en fuentes impresas y digitales, con registro de autoría, fecha y licencia para su uso escolar" },
          { codigo: "I.ECA.4.6.2", texto: "Produce contenidos audiovisuales o multimedia de forma individual o colectiva, empleando herramientas digitales acordes al propósito y la audiencia" },
        ],
        saberes: {
          declarativos: [
            "ECA.4.1.d.2. Técnicas de dibujo, pintura, escultura y referentes locales e internacionales (pasado y presente).",
            "ECA.4.1.d.5. Nociones de línea de tiempo musical y relación música–biografía.",
            "ECA.4.2.d.2. Convenciones básicas del teatro, danza, títeres, música y producción audiovisual escolar.",
            "ECA.4.2.d.3. Roles en proyectos escénicos y audiovisuales: guion, dirección, cámara, actuación, edición, sonido, mediación.",
            "ECA.4.3.d.2. Mujeres artistas (históricas y contemporáneas) y sus condicionantes sociales e históricos.",
            "ECA.4.3.d.3. Especialidades y profesiones artísticas: itinerarios de estudio y salidas profesionales.",
            "ECA.4.3.d.6. Rasgos del arte contemporáneo (instalación) y del arte cinético.",
          ],
          procedimentales: [
            "ECA.4.1.p.3. Construir un diario/portafolio personal que seleccione, organice y describa evidencias significativas.",
            "ECA.4.1.p.5. Elaborar una línea de tiempo con obras y manifestaciones artísticas significativas y comparar semejanzas/diferencias con pares.",
            "ECA.4.2.p.7. Asumir distintos roles en producciones audiovisuales y producir piezas breves con guion y registro básicos.",
            "ECA.4.3.p.2. Buscar información en fuentes impresas y digitales sobre mujeres artistas y sintetizar hallazgos con citas.",
            "ECA.4.3.p.3. Analizar condicionantes histórico-sociales y exponer resultados en presentaciones, carteles, blogs u otros soportes.",
            "ECA.4.3.p.4. Diseñar y producir presentaciones multimedia o piezas audiovisuales sobre formaciones y profesiones artísticas.",
            "ECA.4.3.p.5. Entrevistar a artesanos/artistas locales preparando guion, registrando audio/video y editando el material.",
            "ECA.4.3.p.9. Investigar instalaciones con recursos tecnológicos y comparar enfoques de distintos creadores.",
          ],
          actitudinales: [
            "ECA.4.1.a.2. Respetar la autoría y los referentes culturales locales.",
            "ECA.4.1.a.4. Persistir ante la dificultad técnica, solicitar y aceptar retroalimentación y mejorar el trabajo propio.",
            "ECA.4.2.a.2. Valorar la diversidad de ideas, culturas y lenguajes expresivos en procesos colectivos.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "NOVENO GRADO",
        indicadores: [
          { codigo: "I.ECA.4.6.3", texto: "Difunde producciones originales o remezclas en entornos definidos por el centro, con atribución de autorías, uso de licencias adecuadas y cuidado de datos e imagen" },
        ],
        saberes: {
          declarativos: [
            "ECA.4.1.d.3. Componentes y organización del diario/portafolio personal (imágenes, objetos, recortes, audio, video, texto).",
            "ECA.4.1.d.5. Nociones de línea de tiempo musical y relación música–biografía.",
            "ECA.4.3.d.4. Metodologías de entrevista a artistas y artesanos locales.",
          ],
          procedimentales: [
            "ECA.4.2.p.5. Conectar con estudiantes de otros contextos para compartir procesos y co-crear piezas que favorezcan el entendimiento intercultural. CA.4.3.p.5. Entrevistar a artesanos/artistas locales preparando guion, registrando audio/video y editando el material.",
            "ECA.4.3.p.7. Observar y explicar instalaciones contemporáneas interpretando ideas subyacentes.",
            "ECA.4.3.p.9. Investigar instalaciones con recursos tecnológicos y comparar enfoques de distintos creadores.",
            "ECA.4.3.p.10. Fotografiar cambios en objetos/entorno y montar presentaciones que muestren el paso del tiempo.",
          ],
          actitudinales: [
            "ECA.4.1.a.2. Respetar la autoría y los referentes culturales locales.",
            "ECA.4.1.a.4. Persistir ante la dificultad técnica, solicitar y aceptar retroalimentación y mejorar el trabajo propio.",
            "ECA.4.2.a.2. Valorar la diversidad de ideas, culturas y lenguajes expresivos en procesos colectivos.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "DÉCIMO GRADO",
        indicadores: [
          { codigo: "I.ECA.4.6.1", texto: "Selecciona información pertinente sobre arte y cultura en fuentes impresas y digitales, con registro de autoría, fecha y licencia para su uso escolar" },
          { codigo: "I.ECA.4.6.2", texto: "Produce contenidos audiovisuales o multimedia de forma individual o colectiva, empleando herramientas digitales acordes al propósito y la audiencia" },
          { codigo: "I.ECA.4.6.3", texto: "Difunde producciones originales o remezclas en entornos definidos por el centro, con atribución de autorías, uso de licencias adecuadas y cuidado de datos e imagen" },
        ],
        saberes: {
          declarativos: [
            "ECA.4.1.d.2. Técnicas de dibujo, pintura, escultura y referentes locales e internacionales (pasado y presente).",
            "ECA.4.1.d.3. Componentes y organización del diario/portafolio personal (imágenes, objetos, recortes, audio, video, texto).",
            "ECA.4.1.d.5. Nociones de línea de tiempo musical y relación música–biografía.",
            "ECA.4.2.d.2. Convenciones básicas del teatro, danza, títeres, música y producción audiovisual escolar.",
            "ECA.4.2.d.3. Roles en proyectos escénicos y audiovisuales: guion, dirección, cámara, actuación, edición, sonido, mediación.",
            "ECA.4.3.d.2. Mujeres artistas (históricas y contemporáneas) y sus condicionantes sociales e históricos.",
            "ECA.4.3.d.3. Especialidades y profesiones artísticas: itinerarios de estudio y salidas profesionales.",
            "ECA.4.3.d.4. Metodologías de entrevista a artistas y artesanos locales.",
            "ECA.4.3.d.6. Rasgos del arte contemporáneo (instalación) y del arte cinético.",
          ],
          procedimentales: [
            "ECA.4.1.p.3. Construir un diario/portafolio personal que seleccione, organice y describa evidencias significativas.",
            "ECA.4.1.p.5. Elaborar una línea de tiempo con obras y manifestaciones artísticas significativas y comparar semejanzas/diferencias con pares.",
            "ECA.4.2.p.5. Conectar con estudiantes de otros contextos para compartir procesos y co-crear piezas que favorezcan el entendimiento intercultural.",
            "ECA.4.2.p.7. Asumir distintos roles en producciones audiovisuales y producir piezas breves con guion y registro básicos.",
            "ECA.4.3.p.2. Buscar información en fuentes impresas y digitales sobre mujeres artistas y sintetizar hallazgos con citas.",
            "ECA.4.3.p.3. Analizar condicionantes histórico-sociales y exponer resultados en presentaciones, carteles, blogs u otros soportes.",
            "ECA.4.3.p.4. Diseñar y producir presentaciones multimedia o piezas audiovisuales sobre formaciones y profesiones artísticas.",
            "ECA.4.3.p.5. Entrevistar a artesanos/artistas locales preparando guion, registrando audio/video y editando el material.",
            "ECA.4.3.p.7. Observar y explicar instalaciones contemporáneas interpretando ideas subyacentes.",
            "ECA.4.3.p.9. Investigar instalaciones con recursos tecnológicos y comparar enfoques de distintos creadores.",
            "ECA.4.3.p.10. Fotografiar cambios en objetos/entorno y montar presentaciones que muestren el paso del tiempo.",
          ],
          actitudinales: [
            "ECA.4.1.a.2. Respetar la autoría y los referentes culturales locales.",
            "ECA.4.1.a.4. Persistir ante la dificultad técnica, solicitar y aceptar retroalimentación y mejorar el trabajo propio.",
            "ECA.4.2.a.2. Valorar la diversidad de ideas, culturas y lenguajes expresivos en procesos colectivos.",
            "ECA.4.2.a.3. Cuidar los espacios culturales y cumplir normas de convivencia y seguridad.",
            "ECA.4.2.a.4. Apreciar el intercambio intercultural con apertura, curiosidad y respeto.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.ECA.5.1",
    descripcion: "Argumentar críticamente puntos de vista sobre manifestaciones artísticas y culturales a través de la investigación rigurosa, la interpretación de sus usos e intenciones, y el diálogo constructivo, para valorar su sentido en la vida personal y social, fundamentando posiciones de respeto frente a la diversidad y el patrimonio colectivo",
    competenciasClave: ["CC", "CD", "CCICC", "CSE", "CECA"],
    porGrado: [
      {
        nivel: "BACHILLERATO",
        grado: "PRIMER CURSO",
        indicadores: [
          { codigo: "I.ECA.5.1.1", texto: "Analiza producciones artísticas de distintas épocas y culturas mediante la identificación y descripción de elementos, personajes, símbolos, técnicas e ideas principales y el establecimiento de asociaciones con formas de pensar, movimientos estéticos y modas" },
          { codigo: "I.ECA.5.1.2", texto: "Caracteriza la presencia y funciones de las mujeres en manifestaciones culturales y artísticas mediante la identificación de casos y la inferencia de roles (autoras, intérpretes, directoras, artesanas, motivo de representación), con ejemplos de obras y fuentes pertinentes" },
        ],
        saberes: {
          declarativos: [
            "ECA.5.1.d.1. Lenguajes y formatos autorales (visual, sonoro, corporal, audiovisual, transmedia) y sus finalidades expresivas.",
            "ECA.5.1.d.2. Criterios técnicos de creación y edición (composición, encuadre, luz/sonido, continuidad, montaje, versión).",
            "ECA.5.1.d.3. Estrategias de lectura crítica y microcrítica de obras (descripción, interpretación, valoración).",
            "ECA.5.2.d.5. Documentación y difusión (catálogo, making-of, programa de mano, bitácora).",
            "ECA.5.3.d.1. Recursos expresivos para comunicar ideas y emociones (motivo, símbolo, composición, ritmo, luz/sonido).",
            "ECA.5.3.d.2. Métodos de investigación oral, escrita, visual y audiovisual (entrevista, archivo, curaduría básica).",
            "ECA.5.3.d.3. Elementos y análisis de cine y teatro (imagen, tiempo, movimiento, sonido, iluminación; personaje, trama, mensaje).",
            "ECA.5.3.d.5. Léxico técnico y criterios de apreciación/crítica adaptados a distintos medios y audiencias.",
            "ECA.5.3.d.6. Diversidad de representaciones a lo largo de tiempos y culturas (miradas, enfoques, sentidos).",
            "ECA.5.3.d.7. Movimientos estéticos y su vínculo con manifestaciones culturales (moda, pensamiento, prácticas).",
            "ECA.5.3.d.8. Prácticas del arte contemporáneo (instalación, performance, happening, videoarte, body art, acción poética).",
          ],
          procedimentales: [
            "ECA.5.1.p.2. Autoevaluar procesos creativos con criterios técnicos y emocionales, y promover mejoras.",
            "ECA.5.1.p.3. Expresar opiniones y sentimientos mediante diálogos, reseñas o microcríticas fundamentadas.",
            "ECA.5.1.p.4. Investigar representaciones de emociones en artistas y producir una serie fotográfica o de dibujos.",
            "ECA.5.2.p.5. Documentar procesos, productos y crear catálogos, cápsulas o programas radiofónicos (podcasts).",
            "ECA.5.2.p.6. Participar en todas las fases del proceso creativo y debatir con audiencias/agentes externos.",
            "ECA.5.3.p.1. Crear presentaciones multimedia que ejemplifiquen cómo se logran ideas/emociones en distintas artes.",
            "ECA.5.3.p.2. Investigar mitos/historias locales y elaborar un documento textual, visual o audiovisual de hallazgos.",
            "ECA.5.3.p.5. Escribir críticas o comentarios para prensa escolar, blog o redes, adecuando el registro al medio.",
            "ECA.5.3.p.7. Elaborar presentaciones/carteles sobre prácticas del arte contemporáneo con ejemplos visuales/sonoros.",
          ],
          actitudinales: [
            "ECA.5.1.a.3. Practicar escucha activa y respeto en diálogos críticos sobre obras y procesos.",
            "ECA.5.1.a.4. Respetar normas de ética y licenciamiento en publicación y uso de materiales digitales.",
            "ECA.5.1.a.5. Mantener constancia y responsabilidad en la planificación y entrega de productos.",
            "ECA.5.2.a.2. Aceptar y ofrecer crítica constructiva para la mejora del producto colectivo.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "SEGUNDO CURSO",
        indicadores: [
          { codigo: "I.ECA.5.1.3", texto: "Sustenta posturas y producciones mediante investigación autónoma y uso adecuado de información de diversas fuentes, aplicándola en debates, críticas escritas y piezas artísticas, audiovisuales o multimedia con registro y léxico apropiados" },
        ],
        saberes: {
          declarativos: [
            "ECA.5.1.d.4. Referentes sobre representación de emociones y memoria (series fotográficas, diarios visuales, performance).",
            "ECA.5.1.d.5. Principios de relectura/remezcla y superación de estereotipos (apropiación, variación, intertexto).",
            "ECA.5.1.d.7. Portafolio digital y criterios curatoriales (selección, organización, metadatos, comentario crítico) y ética de autoría/licencias.",
            "ECA.5.3.d.7. Movimientos estéticos y su vínculo con manifestaciones culturales (moda, pensamiento, prácticas).",
            "ECA.5.3.d.8. Prácticas del arte contemporáneo (instalación, performance, happening, videoarte, body art, acción poética).",
          ],
          procedimentales: [
            "ECA.5.1.p.9. Construir y mantener un portafolio digital con muestras y comentarios curatoriales.",
            "ECA.5.3.p.3. Identificar y describir componentes estéticos y narrativos de piezas teatrales y cinematográficas.",
          ],
          actitudinales: [
            "ECA.5.2.a.2. Aceptar y ofrecer crítica constructiva para la mejora del producto colectivo.",
            "ECA.5.2.a.4. Valorar la diversidad de aportes y perspectivas en la co-creación.",
            "ECA.5.3.a.1. Mantener escucha respetuosa con agentes culturales y portadores de saberes.",
            "ECA.5.3.a.2. Practicar respeto intercultural y evitar estereotipos en análisis y difusión.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.ECA.5.2",
    descripcion: "Reconocer críticamente obras de artistas (mujeres y hombres) y manifestaciones culturales del pasado y del presente mediante el análisis comparado de sus contextos, estilos y significados, para valorar la diversidad cultural y participar de manera informada en su conservación, renovación y salvaguarda como patrimonio vivo",
    competenciasClave: ["CC", "CCICC", "CD", "CSE", "CECA"],
    porGrado: [
      {
        nivel: "BACHILLERATO",
        grado: "PRIMER CURSO",
        indicadores: [
          { codigo: "I.ECA.5.2.1", texto: "Analiza producciones artísticas (artes visuales, cine, publicidad, fotografía, música, teatro, etc.) de distintas características mediante la identificación de recursos que expresan ideas y generan emociones y la elaboración de presentaciones/sonorizaciones que evidencien su aplicación" },
        ],
        saberes: {
          declarativos: [
            "ECA.5.1.d.5. Principios de relectura/remezcla y superación de estereotipos (apropiación, variación, intertexto).",
            "ECA.5.2.d.5. Documentación y difusión (catálogo, making-of, programa de mano, bitácora).",
            "ECA.5.2.d.6. Adaptación contemporánea de mitos/leyendas (contextualización, enfoque, sensibilidad cultural).",
            "ECA.5.2.d.7. Rasgos estilísticos de compositores/as y géneros (motivo, forma, instrumentación).",
            "ECA.5.3.d.1. Recursos expresivos para comunicar ideas y emociones (motivo, símbolo, composición, ritmo, luz/sonido).",
            "ECA.5.3.d.2. Métodos de investigación oral, escrita, visual y audiovisual (entrevista, archivo, curaduría básica).",
            "ECA.5.3.d.4. Artistas y agentes culturales del Ecuador y su relación con contextos históricos-sociales.",
            "ECA.5.3.d.5. Léxico técnico y criterios de apreciación/crítica adaptados a distintos medios y audiencias.",
          ],
          procedimentales: [
            "ECA.5.3.p.4. Reconocer artistas/agentes y relacionarlos con sus contextos mediante fichas y líneas de tiempo.",
            "ECA.5.3.p.5. Escribir críticas o comentarios para prensa escolar, blog o redes, adecuando el registro al medio.",
            "ECA.5.3.p.6. Asociar manifestaciones culturales con movimientos/ideas y diseñar carteles informativos.",
            "ECA.5.3.p.9. Investigar trayectorias formativas/profesionales y producir microdocumentales o videoentrevistas.",
          ],
          actitudinales: [
            "ECA.5.2.a.2. Aceptar y ofrecer crítica constructiva para la mejora del producto colectivo.",
            "ECA.5.2.a.3. Respetar derechos, normas y ciudadanía en espacios públicos y digitales.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "SEGUNDO CURSO",
        indicadores: [
          { codigo: "I.ECA.5.2.1", texto: "Analiza producciones artísticas (artes visuales, cine, publicidad, fotografía, música, teatro, etc.) de distintas características mediante la identificación de recursos que expresan ideas y generan emociones y la elaboración de presentaciones/sonorizaciones que evidencien su aplicación" },
          { codigo: "I.ECA.5.2.2", texto: "Reinterpreta producciones preexistentes proponiendo múltiples soluciones de renovación o remezcla y justificando las decisiones técnicas y expresivas adoptadas" },
          { codigo: "I.ECA.5.2.3", texto: "Compara modos de representación de ideas, gestos, expresiones y emociones en obras de distintas épocas y culturas mediante argumentos sustentados y la elaboración de producciones propias que reflejen las elecciones realizadas" },
        ],
        saberes: {
          declarativos: [
            "ECA.5.1.d.7. Portafolio digital y criterios curatoriales (selección, organización, metadatos, comentario crítico) y ética de autoría/licencias.",
            "ECA.5.2.d.6. Adaptación contemporánea de mitos/leyendas (contextualización, enfoque, sensibilidad cultural).",
            "ECA.5.2.d.7. Rasgos estilísticos de compositores/as y géneros (motivo, forma, instrumentación).",
            "ECA.5.3.d.1. Recursos expresivos para comunicar ideas y emociones (motivo, símbolo, composición, ritmo, luz/sonido).",
            "ECA.5.3.d.2. Métodos de investigación oral, escrita, visual y audiovisual (entrevista, archivo, curaduría básica).",
            "ECA.5.3.d.4. Artistas y agentes culturales del Ecuador y su relación con contextos históricos-sociales.",
            "ECA.5.3.d.5. Léxico técnico y criterios de apreciación/crítica adaptados a distintos medios y audiencias.",
            "ECA.5.3.d.6. Diversidad de representaciones a lo largo de tiempos y culturas (miradas, enfoques, sentidos).",
            "ECA.5.3.d.7. Movimientos estéticos y su vínculo con manifestaciones culturales (moda, pensamiento, prácticas).",
            "ECA.5.3.d.8. Prácticas del arte contemporáneo (instalación, performance, happening, videoarte, body art, acción poética).",
            "ECA.5.3.d.10. Itinerarios formativos y ocupacionales en artes y cultura y perfiles profesionales.",
            "ECA.5.3.d.11. Materiales, herramientas y lenguajes del grafiti/arte urbano y su documentación.",
          ],
          procedimentales: [
            "ECA.5.1.p.3. Expresar opiniones y sentimientos mediante diálogos, reseñas o microcríticas fundamentadas.",
            "ECA.5.1.p.5. Remezclar y transformar creaciones de otros justificando decisiones para superar convencionalismos.",
            "ECA.5.2.p.2. Representar historias con guion gráfico, secuencia sonora, escena corporal o video.",
            "ECA.5.2.p.5. Documentar procesos, productos y crear catálogos, cápsulas o programas radiofónicos (podcasts).",
            "ECA.5.2.p.7. Adaptar un mito/leyenda y grabar una versión propia contextualizada al presente.",
            "ECA.5.2.p.8. Componer una pieza en estilo de un/a compositor/a elegido/a y publicarla para retroalimentación.",
            "ECA.5.3.p.4. Reconocer artistas/agentes y relacionarlos con sus contextos mediante fichas y líneas de tiempo.",
          ],
          actitudinales: [
            "ECA.5.3.a.5. Comprometerse con la convivencia y el respeto del espacio público en prácticas de arte urbano.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.ECA.5.3",
    descripcion: "Gestionar creativamente procesos de creación artística individuales y colectivos mediante la planificación, producción, revisión sistemática y evaluación con roles definidos, para expresar, comunicar y representar ideas, vivencias y emociones con coherencia técnica y expresiva",
    competenciasClave: ["CC", "CD", "CIT", "CSE", "CECA"],
    porGrado: [
      {
        nivel: "BACHILLERATO",
        grado: "PRIMER CURSO",
        indicadores: [
          { codigo: "I.ECA.5.3.1", texto: "Coordina un proceso de creación artística o un evento cultural asegurando la secuenciación de fases, la gestión de tiempos y recursos, y realizando ajustes pertinentes ante incidencias" },
          { codigo: "I.ECA.5.3.3", texto: "Desarrolla una nueva destreza o una producción artística mediante autoaprendizaje con fuentes seleccionadas por el estudiantado" },
          { codigo: "I.ECA.5.3.6", texto: "Documenta procesos de creación artística o eventos culturales mediante selección de recursos adecuados y difusión en medios pertinentes" },
        ],
        saberes: {
          declarativos: [
            "ECA.5.1.d.2. Criterios técnicos de creación y edición (composición, encuadre, luz/sonido, continuidad, montaje, versión).",
            "ECA.5.1.d.3. Estrategias de lectura crítica y microcrítica de obras (descripción, interpretación, valoración).",
            "ECA.5.1.d.7. Portafolio digital y criterios curatoriales (selección, organización, metadatos, comentario crítico) y ética de autoría/licencias.",
            "ECA.5.2.d.1. Roles y dispositivos de producción escénico-musical (dirección, actuación, escenografía, diseño sonoro/luz).",
            "ECA.5.2.d.5. Documentación y difusión (catálogo, making-of, programa de mano, bitácora).",
            "ECA.5.3.d.5. Léxico técnico y criterios de apreciación/crítica adaptados a distintos medios y audiencias.",
          ],
          procedimentales: [
            "ECA.5.1.p.6. Planificar la creación/interpretación con guion de pasos, recursos y evidencias.",
            "ECA.5.1.p.7. Aprender de forma autónoma una técnica/ámbito y aplicarlo en un mini proyecto.",
            "ECA.5.2.p.1. Seleccionar, ensayar e interpretar obras escénico-musicales asumiendo roles definidos.",
            "ECA.5.2.p.4. Registrar versiones (audio/video), comparar resultados y acordar mejoras en grupo.",
            "ECA.5.3.p.8. Programar y realizar un evento cultural escolar/comunitario con criterios de pertinencia y cuidado.",
          ],
          actitudinales: [
            "ECA.5.1.a.3. Practicar escucha activa y respeto en diálogos críticos sobre obras y procesos.",
            "ECA.5.1.a.4. Respetar normas de ética y licenciamiento en publicación y uso de materiales digitales.",
            "ECA.5.1.a.5. Mantener constancia y responsabilidad en la planificación y entrega de productos.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "SEGUNDO CURSO",
        indicadores: [
          { codigo: "I.ECA.5.3.4", texto: "Aplica técnicas, recursos y convenciones de lenguajes artísticos para expresar ideas, sentimientos y emociones con coherencia técnica y expresiva" },
          { codigo: "I.ECA.5.3.5", texto: "Colabora responsablemente en un proyecto artístico colectivo desde la idea inicial hasta su conclusión, manteniendo el respeto por las aportaciones de los demás" },
        ],
        saberes: {
          declarativos: [
            "ECA.5.2.d.2. Guion gráfico/sonoro y narrativas multimodales (storyboard, cues, partitura/playlist).",
            "ECA.5.2.d.3. Gestión de proyectos colectivos (fases, tareas, cronograma, recursos, difusión).",
            "ECA.5.2.d.4. Técnicas de ensayo, improvisación, registro y revisión de versiones.",
            "ECA.5.2.d.5. Documentación y difusión (catálogo, making-of, programa de mano, bitácora).",
            "ECA.5.3.d.1. Recursos expresivos para comunicar ideas y emociones (motivo, símbolo, composición, ritmo, luz/sonido).",
            "ECA.5.3.d.5. Léxico técnico y criterios de apreciación/crítica adaptados a distintos medios y audiencias.",
            "ECA.5.3.d.9. Gestión básica de eventos culturales (programación, producción, mediación, evaluación).",
          ],
          procedimentales: [
            "ECA.5.1.p.1. Realizar producciones artísticas sobre temas de interés juvenil con intención estética y argumento propio.",
            "ECA.5.2.p.3. Diseñar y ejecutar proyectos colectivos desde la ideación hasta la presentación y difusión.",
            "ECA.5.2.p.10. Producir obras de arte urbano respetando técnicas, normativa y cuidado del espacio común.",
          ],
          actitudinales: [
            "ECA.5.1.a.1. Valorar la propia voz autoral y la diversidad de expresiones del grupo.",
            "ECA.5.1.a.2. Asumir flexibilidad, apertura a la experimentación y tolerancia al error como parte del proceso.",
            "ECA.5.2.a.1. Colaborar con corresponsabilidad, comunicación asertiva y cumplimiento de acuerdos.",
            "ECA.5.2.a.2. Aceptar y ofrecer crítica constructiva para la mejora del producto colectivo.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.ECA.5.4",
    descripcion: "Integrar tecnológicamente medios audiovisuales y recursos digitales en la creación artística a través de la selección ética de herramientas, la producción, edición y difusión de obras propias, para ampliar lenguajes, audiencias y formatos, reforzando el ejercicio de una ciudadanía digital responsable",
    competenciasClave: ["CC", "CD", "CIT", "CCICC", "CECA"],
    porGrado: [
      {
        nivel: "BACHILLERATO",
        grado: "PRIMER CURSO",
        indicadores: [
          { codigo: "I.ECA.5.4.2", texto: "Produce materiales informativos con recursos audiovisuales y tecnológicos, como catálogos de profesiones, videos con testimonios de profesionales y piezas para difundir jornadas o eventos, que den a conocer el trabajo de artistas y agentes culturales" },
        ],
        saberes: {
          declarativos: [
            "ECA.5.1.d.2. Criterios técnicos de creación y edición (composición, encuadre, luz/sonido, continuidad, montaje, versión).",
            "ECA.5.1.d.6. Narrativa secuencial en cómic/novela gráfica (trama, ritmo, encuadres, viñeta, cliffhanger, suspenso, final inesperado).",
            "ECA.5.2.d.2. Guion gráfico/sonoro y narrativas multimodales (storyboard, cues, partitura/playlist).",
            "ECA.5.2.d.4. Técnicas de ensayo, improvisación, registro y revisión de versiones.",
            "ECA.5.2.d.8. Música y emoción en medios (intencionalidad, manipulación, reemplazo de banda sonora).",
            "ECA.5.2.d.9. Arte urbano: técnicas básicas y marco normativo/convivencia.",
            "ECA.5.3.d.1. Recursos expresivos para comunicar ideas y emociones (motivo, símbolo, composición, ritmo, luz/sonido).",
          ],
          procedimentales: [
            "ECA.5.1.p.8. Versionar un cómic/novela gráfica (finales alternativos) con software específico.",
            "ECA.5.2.p.9. Analizar música en spots/clips y reemplazar la banda sonora buscando distintos efectos emocionales.",
            "ECA.5.3.p.10. Crear una exposición virtual de grafiti/arte urbano con piezas geolocalizadas y créditos.",
          ],
          actitudinales: [
            "ECA.5.1.a.2. Asumir flexibilidad, apertura a la experimentación y tolerancia al error como parte del proceso.",
            "ECA.5.1.a.3. Practicar escucha activa y respeto en diálogos críticos sobre obras y procesos.",
            "ECA.5.1.a.5. Mantener constancia y responsabilidad en la planificación y entrega de productos.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "SEGUNDO CURSO",
        indicadores: [
          { codigo: "I.ECA.5.4.1", texto: "Organiza un portafolio digital de producciones propias, seleccionando, ordenando y reuniendo muestras significativas para presentarlas y reflexionar sobre ellas" },
        ],
        saberes: {
          declarativos: [
            "ECA.5.1.d.7. Portafolio digital y criterios curatoriales (selección, organización, metadatos, comentario crítico) y ética de autoría/licencias.",
            "ECA.5.2.d.5. Documentación y difusión (catálogo, making-of, programa de mano, bitácora).",
            "ECA.5.2.d.8. Música y emoción en medios (intencionalidad, manipulación, reemplazo de banda sonora).",
            "ECA.5.2.d.9. Arte urbano: técnicas básicas y marco normativo/convivencia.",
          ],
          procedimentales: [
            "ECA.5.1.p.9. Construir y mantener un portafolio digital con muestras y comentarios curatoriales.",
          ],
          actitudinales: [
            "ECA.5.2.a.1. Colaborar con corresponsabilidad, comunicación asertiva y cumplimiento de acuerdos.",
            "ECA.5.2.a.2. Aceptar y ofrecer crítica constructiva para la mejora del producto colectivo.",
            "ECA.5.2.a.3. Respetar derechos, normas y ciudadanía en espacios públicos y digitales.",
            "ECA.5.3.a.4. Aplicar criterios éticos de documentación, citación y licenciamiento.",
          ],
        },
      },
    ],
  },
];

export function buscarCompetenciaEca(codigo: string): CompetenciaEspecificaCompleta | undefined {
  return COMPETENCIAS_ECA.find((c) => c.codigo === codigo);
}
