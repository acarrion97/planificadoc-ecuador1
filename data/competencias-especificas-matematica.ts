/**
 * Catálogo de Competencias Específicas — Currículo Integrado
 * Fuente: MESOCURRICULUM / "3. Matemática.xlsx" (Matriz de distribución/desagregación
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

export const COMPETENCIAS_MATEMATICA: CompetenciaEspecificaCompleta[] = [
  {
    codigo: "CE.M.2.1",
    descripcion: "Construir patrones y agrupar objetos, mediante el uso de conjuntos y operaciones con números naturales, para la resolución de situaciones en la vida diaria de manera lógica, ordenada y eficiente",
    competenciasClave: ["CMCT", "CC", "CD", "CCICC", "CIT"],
    porGrado: [
      {
        nivel: "ELEMENTAL",
        grado: "SEGUNDO GRADO",
        indicadores: [
          { codigo: "I.M.2.1.1", texto: "Identifica propiedades de los objetos a partir de subconjuntos de un conjunto universo, demostrando orden y precisión en sus representaciones" },
          { codigo: "I.M.2.1.2", texto: "Construye series de objetos, figuras y secuencias numéricas a partir de patrones determinados, mostrando curiosidad e interés por identificar regularidades en situaciones cotidianas" },
          { codigo: "I.M.2.1.3", texto: "Representa relaciones entre conjuntos mediante diagramas, tablas y cuadrículas, identificando pares ordenados del producto cartesiano AxB que cumplen correspondencia uno a uno, y cuidando la claridad de sus representaciones" },
        ],
        saberes: {
          declarativos: [
            "M.2.1.d.1. Atributos de los conjuntos.",
            "M.2.1.d.2. Noción de correspondencia de un conjunto de llegada y uno de salida.",
            "M.2.1.d.3. Formas matemáticas de representar relaciones entre conjuntos.",
            "M.2.1.d.4. Noción de correspondencia uno a uno en relaciones entre conjuntos.",
          ],
          procedimentales: [
            "M.2.1.p.1. Agrupar colecciones de objetos del entorno por un solo atributo físico observable (color, forma, tamaño).",
            "M.2.1.p.2. Utilizar material concreto y representaciones gráficas en el aprendizaje de la noción de correspondencia.",
            "M.2.1.p.3. Identificar la ubicación de objetos en cuadrículas como base para la comprensión de pares ordenados como representación de relaciones entre conjuntos.",
            "M.2.1.p.4. Explorar relaciones entre conjuntos mediante el emparejamiento físico de objetos reales y gráficos para determinar cantidades (tantos como, más que, menos que).",
          ],
          actitudinales: [
            "M.2.1.a.1. Valorar el orden y el cuidado en el entorno escolar.",
            "M.2.1.a.2. Mostrar interés por descubrir patrones en el entorno.",
            "M.2.1.a.3. Manifestar curiosidad al explorar secuencias numéricas. Respetar las reglas en la construcción de patrones gráficos.",
            "M.2.1.a.5. Mostrar orden en la representación de conjuntos.",
            "M.2.1.a.6. Mostrar precisión al representar relaciones entre conjuntos.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "TERCER GRADO",
        indicadores: [
          { codigo: "I.M.2.1.1", texto: "Identifica propiedades de los objetos a partir de subconjuntos de un conjunto universo, demostrando orden y precisión en sus representaciones" },
          { codigo: "I.M.2.1.2", texto: "Construye series de objetos, figuras y secuencias numéricas a partir de patrones determinados, mostrando curiosidad e interés por identificar regularidades en situaciones cotidianas" },
          { codigo: "I.M.2.1.3", texto: "Representa relaciones entre conjuntos mediante diagramas, tablas y cuadrículas, identificando pares ordenados del producto cartesiano AxB que cumplen correspondencia uno a uno, y cuidando la claridad de sus representaciones" },
        ],
        saberes: {
          declarativos: [
            "M.2.1.d.1. Propiedades y atributos de los conjuntos.",
            "M.2.1.d.2. Relación de correspondencia entre elementos del conjunto de salida y del conjunto de llegada.",
            "M.2.1.d.3. Pares ordenados y diagramas.",
            "M.2.1.d.4. Relación de correspondencia uno a uno en relaciones entre conjuntos.",
          ],
          procedimentales: [
            "M.2.1.p.1. Agrupar colecciones de objetos del entorno con mas de un atributo físico observable (color, forma, tamaño o utilidad).",
            "M.2.1.p.2. Examinar objetos reales y gráficos (por ejemplo: asociar platos con cucharas, o animales con sus comidas), identificando visualmente el conjunto de partida y de llegada.",
            "M.2.1.p.3. Elaborar diagramas de Venn basados en reglas de relación cotidianas.",
            "M.2.1.p.4. Organizar pares ordenados en tablas de doble entrada y diagramas de árbol como representación de relaciones entre conjuntos.",
          ],
          actitudinales: [
            "M.2.1.a.1. Valora el orden y cuidado en la presentación de conjuntos.",
            "M.2.1.a.2. Mostrar interés por descubrir patrones en figuras y objetos.",
            "M.2.1.a.3. Manifestar curiosidad al explorar secuencias numéricas. Respetar las reglas a seguir para la construcción de patrones gráficos y numéricos.",
            "M.2.1.a.5. Mostrar orden y claridad en la representación de conjuntos mediante tablas y diagramas de datos. Mostrar cuidado y precisión al representar relaciones entre conjuntos.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "CUARTO GRADO",
        indicadores: [
          { codigo: "I.M.2.1.1", texto: "Identifica propiedades de los objetos a partir de subconjuntos de un conjunto universo, demostrando orden y precisión en sus representaciones" },
          { codigo: "I.M.2.1.2", texto: "Construye series de objetos, figuras y secuencias numéricas a partir de patrones determinados, mostrando curiosidad e interés por identificar regularidades en situaciones cotidianas" },
          { codigo: "I.M.2.1.3", texto: "Representa relaciones entre conjuntos mediante diagramas, tablas y cuadrículas, identificando pares ordenados del producto cartesiano AxB que cumplen correspondencia uno a uno, y cuidando la claridad de sus representaciones" },
        ],
        saberes: {
          declarativos: [
            "M.2.1.d.1. Propiedades y atributos de los conjuntos y subconjuntos.",
            "M.2.1.d.2. Noción de correspondencia entre elementos del conjunto de salida y del conjunto de llegada.",
            "M.2.1.d.3. Pares ordenados como representación de relaciones entre conjuntos.",
            "M.2.1.d.4. Noción de correspondencia uno a uno en relaciones entre conjuntos.",
          ],
          procedimentales: [
            "M.2.1.p.1. Identificar atributos en objetos y figuras para describir y reproducir patrones.",
            "M.2.1.p.2. Reconocer patrones numéricos mediante sumas y restas, contando hacia adelante y hacia atrás.",
            "M.2.1.p.3. Reproducir secuencias numéricas crecientes con suma y multiplicación.",
            "M.2.1.p.4. Construir patrones visuales y numéricos usando suma, resta y multiplicación.",
            "M.2.1.p.5. Representar relaciones entre conjuntos usando diagramas, tablas y cuadrículas.",
            "M.2.1.p.6. Identificar pares ordenados que relacionan elementos de dos conjuntos.",
            "M.2.1.p.7. Representar por extensión y gráficamente pares ordenados del producto cartesiano Ax.",
            "B.M.2.1.p.8. Reconocer elementos de conjuntos a partir de pares ordenados ubicados en una cuadrícula.",
            "M.2.1.p.9. Identificar subconjuntos con correspondencia uno a uno en AxB.",
          ],
          actitudinales: [
            "M.2.1.a.1. Valorar el orden y cuidado en la presentación de conjuntos.",
            "M.2.1.a.2. Mostrar interés por descubrir patrones en figuras y objetos.",
            "M.2.1.a.3. Manifestar curiosidad al explorar secuencias numéricas.",
            "M.2.1.a.4. Respetar las reglas a seguir para la construcción de patrones.",
            "M.2.1.a.5. Mostrar orden y claridad en la representación de conjuntos mediante tablas y diagramas de datos.",
            "M.2.1.a.6. Mostrar cuidado y precisión al representar gráficamente relaciones entre conjuntos.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.M.2.2",
    descripcion: "Resolver problemas de la vida cotidiana mediante el conteo, el concepto de número, propiedades y procedimientos de cálculo (suma, resta, multiplicación sin reagrupación y división exacta con números naturales hasta 9 999, para comunicar y argumentar los resultados con claridad, precisión, colaboración y responsabilidad",
    competenciasClave: ["CMCT", "CC", "CD", "CIT"],
    porGrado: [
      {
        nivel: "ELEMENTAL",
        grado: "SEGUNDO GRADO",
        indicadores: [
          { codigo: "I.M.2.2.1", texto: "Representa números naturales de hasta cuatro cifras mediante el uso de material concreto" },
          { codigo: "I.M.2.2.2", texto: "Completas secuencias numéricas, utilizando números ordinales, distinguiendo números pares e impares para organizar elementos" },
          { codigo: "I.M.2.2.3", texto: "Aplica estrategias de conteo, composición y descomposición de números para establecer relaciones de orden, verificar estimaciones y resolver problemas matemáticos del entorno, interpretando y comunicando sus resultados" },
          { codigo: "I.M.2.2.4", texto: "Opera con adición y sustracción en la resolución de problemas del entorno, empleando propiedades matemáticas y mostrando disposición para el trabajo colaborativo y el cálculo mental" },
          { codigo: "I.M.2.2.5", texto: "Aplica la multiplicación, división y sus relaciones inversas en situaciones cotidianas, reconociendo mitades y dobles, memorizando combinaciones multiplicativas y usando números de emergencia responsablemente" },
          { codigo: "I.M.2.2.6", texto: "Demuestra comprensión del valor del ahorro aplicando operaciones matemáticas en situaciones financieras simples" },
        ],
        saberes: {
          declarativos: [
            "M.2.1.d.5. Números naturales, valor posicional y representaciones hasta 99.",
            "M.2.1.d.6. Noción de conteo.",
            "M.2.1.d.7. Valor posicional en números de hasta dos cifras: unidades, decenas.",
            "M.2.1.d.8. Relación de orden y secuencia en los números naturales de hasta dos cifras.",
            "M.2.1.d.10. Números pares e impares de una cifra.",
            "M.2.1.d.11. Mitades y dobles en contextos concretos.",
            "M.2.1.d.12. Noción de adición como acción de agregar.",
            "M.2.1.d.13. Noción de sustracción como acción de quitar o comparar.",
          ],
          procedimentales: [
            "M.2.1.p.10. Representar, escribir y leer números naturales hasta 99.",
            "M.2.1.p.11. Construir experiencias concretas y juegos que les permitan pasar de la estimación a la verificación.",
            "M.2.1.p.12. Ordenar números naturales de hasta dos cifras, usando símbolos >, =, <.",
            "M.2.1.p.13. Realizar adiciones y sustracciones hasta 99 de manera concreta, pictórica, mental y simbólica.",
            "M.2.1.p.14. Aplicar estrategias de descomposición en decenas.",
            "M.2.1.p.15. Identificar las propiedades de la adición.",
            "M.2.1.p.22. Identificar y usar números de emergencia.",
          ],
          actitudinales: [
            "M.2.1.a.7. Colaborar activamente en el trabajo grupal al resolver problemas con operaciones.",
            "M.2.1.a.8. Disfrutar del desafío de calcular mentalmente.",
            "M.2.1.a.9. Reconocer el valor del ahorro mediante su aplicación práctica y diaria.",
            "M.2.1.a.10. Usar responsablemente los números de emergencia y comprender su importancia social.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "TERCER GRADO",
        indicadores: [
          { codigo: "I.M.2.2.1", texto: "Representa números naturales de hasta cuatro cifras mediante el uso de material concreto" },
          { codigo: "I.M.2.2.2", texto: "Completas secuencias numéricas, utilizando números ordinales, distinguiendo números pares e impares para organizar elementos" },
          { codigo: "I.M.2.2.3", texto: "Aplica estrategias de conteo, composición y descomposición de números para establecer relaciones de orden, verificar estimaciones y resolver problemas matemáticos del entorno, interpretando y comunicando sus resultados" },
          { codigo: "I.M.2.2.4", texto: "Opera con adición y sustracción en la resolución de problemas del entorno, empleando propiedades matemáticas y mostrando disposición para el trabajo colaborativo y el cálculo mental" },
          { codigo: "I.M.2.2.5", texto: "Aplica la multiplicación, división y sus relaciones inversas en situaciones cotidianas, reconociendo mitades y dobles, memorizando combinaciones multiplicativas y usando números de emergencia responsablemente" },
          { codigo: "I.M.2.2.6", texto: "Demuestra comprensión del valor del ahorro aplicando operaciones matemáticas en situaciones financieras simples" },
        ],
        saberes: {
          declarativos: [
            "M.2.1.d.5. Números naturales, valor posicional y representaciones hasta 999.",
            "M.2.1.d.6. Noción de conteo como estrategia para verificar estimaciones. Valor posicional en números de hasta tres cifras: unidades, decenas y centenas.",
            "M.2.1.d.8. Relación de orden y secuencia en los números naturales de hasta tres cifras.",
            "M.2.1.d.9. Noción de número ordinal y su uso en la organización de elementos.",
            "M.2.1.d.11. Mitades y dobles en contextos concretos.",
            "M.2.1.d.12. Noción de adición como acción de agregar.",
            "M.2.1.d.13. Noción de sustracción como acción de quitar o comparar.",
            "M.2.1.d.14. Noción de multiplicación como sumandos repetidos.",
          ],
          procedimentales: [
            "M.2.1.p.10. Representar, escribir y leer números naturales hasta 999.",
            "M.2.1.p.11. Contar objetos en grupos (2, 3, 5, 10) para verificar estimaciones. Ordenar números naturales de hasta tres cifras, usando símbolos >, =, <.",
            "M.2.1.p.13. Realizar adiciones y sustracciones hasta 999 de manera concreta, pictórica, mental y simbólica.",
            "M.2.1.p.14. Aplicar estrategias de descomposición en decenas y centenas.",
            "M.2.1.p.15. Aplicar la propiedad conmutativa y asociativa de la adición en cálculo mental.",
            "M.2.1.p.16. Realizar multiplicaciones con modelos grupales, geométricos y lineales utilizando números de hasta dos cifras.",
            "M.2.1.p.19. Usar propiedades conmutativa y asociativa de la multiplicación en cálculos. Interpretar soluciones dentro del contexto del problema utilizando la suma, resta y la multiplicación.",
          ],
          actitudinales: [
            "M.2.1.a.7. Colaborar activamente en el trabajo grupal al resolver problemas con operaciones.",
            "M.2.1.a.8. Disfrutar del desafío de calcular mentalmente.",
            "M.2.1.a.9. Reconocer el valor del ahorro mediante su aplicación práctica y diaria.",
            "M.2.1.a.10. Usar responsablemente los números de emergencia y comprender su importancia social.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "CUARTO GRADO",
        indicadores: [
          { codigo: "I.M.2.2.1", texto: "Representa números naturales de hasta cuatro cifras mediante el uso de material concreto" },
          { codigo: "I.M.2.2.2", texto: "Completas secuencias numéricas, utilizando números ordinales, distinguiendo números pares e impares para organizar elementos" },
          { codigo: "I.M.2.2.3", texto: "Aplica estrategias de conteo, composición y descomposición de números para establecer relaciones de orden, verificar estimaciones y resolver problemas matemáticos del entorno, interpretando y comunicando sus resultados" },
          { codigo: "I.M.2.2.4", texto: "Opera con adición y sustracción en la resolución de problemas del entorno, empleando propiedades matemáticas y mostrando disposición para el trabajo colaborativo y el cálculo mental" },
          { codigo: "I.M.2.2.5", texto: "Aplica la multiplicación, división y sus relaciones inversas en situaciones cotidianas, reconociendo mitades y dobles, memorizando combinaciones multiplicativas y usando números de emergencia responsablemente" },
          { codigo: "I.M.2.2.6", texto: "Demuestra comprensión del valor del ahorro aplicando operaciones matemáticas en situaciones financieras simples" },
        ],
        saberes: {
          declarativos: [
            "M.2.1.d.5. Números naturales, valor posicional y representaciones hasta 9 999.",
            "M.2.1.d.6. Noción de conteo como estrategia para verificar estimaciones.",
            "M.2.1.d.7. Valor posicional en números de hasta cuatro cifras: unidades, decenas, centenas y unidades de mil.",
            "M.2.1.d.8. Relación de orden y secuencia en los números naturales.",
            "M.2.1.d.9. Noción de número ordinal y su uso en la organización de elementos.",
            "M.2.1.d.10. Números pares e impares.",
            "M.2.1.d.11. Mitades y dobles en contextos concretos.",
            "M.2.1.d.12. Noción de adición como acción de agregar.",
            "M.2.1.d.13. Noción de sustracción como acción de quitar o comparar.",
            "M.2.1.d.14. Noción de multiplicación como sumandos repetidos.",
            "M.2.1.d.15. Noción de división como reparto equitativo o resta repetida.",
            "M.2.1.d.16. Relación inversa entre multiplicación y división.",
          ],
          procedimentales: [
            "M.2.1.p.10. Representar, escribir y leer números naturales hasta 9 999.",
            "M.2.1.p.11. Contar objetos en grupos (2, 3, 5, 10) para verificar estimaciones.",
            "M.2.1.p.12. Ordenar números naturales usando símbolos >, =, <.",
            "M.2.1.p.13. Realizar adiciones y sustracciones hasta 9 999 de manera concreta, pictórica, mental y simbólica.",
            "M.2.1.p.14. Aplicar estrategias de descomposición en decenas, centenas y miles.",
            "M.2.1.p.15. Aplicar las propiedades conmutativa y asociativa de la adición en cálculo mental.",
            "M.2.1.p.16. Realizar multiplicaciones con modelos grupales, geométricos y lineales.",
            "M.2.1.p.17. Construir y utilizar progresivamente las combinaciones multiplicativas mediante estrategias concretas y patrones numéricos.",
            "M.2.1.p.18. Aplicar las reglas de multiplicación por 10, 100 y 1 000.",
            "M.2.1.p.19. Usar propiedades conmutativa y asociativa de la multiplicación en cálculos.",
            "M.2.1.p.20. Calcular mentalmente productos y cocientes exactos usando distintas estrategias.",
            "M.2.1.p.21. Interpretar soluciones dentro del contexto del problema utilizando las operaciones básicas.",
            "M.2.1.p.22. Identificar y usar números de emergencia.",
          ],
          actitudinales: [
            "M.2.1.a.7. Colaborar activamente en el trabajo grupal al resolver problemas con operaciones.",
            "M.2.1.a.8. Disfrutar del desafío de calcular mentalmente.",
            "M.2.1.a.9. Reconocer el valor del ahorro mediante su aplicación práctica y diaria.",
            "M.2.1.a.10. Usar responsablemente los números de emergencia y comprender su importancia social.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.M.2.3",
    descripcion: "Resolver situaciones cotidianas de carácter geométrico mediante la aplicación de elementos básicos, propiedades de cuerpos y figuras, y el cálculo o estimación de perímetros, para desarrollar el pensamiento espacial y la toma de decisiones en el entorno diario",
    competenciasClave: ["CMCT", "CC", "CD"],
    porGrado: [
      {
        nivel: "ELEMENTAL",
        grado: "SEGUNDO GRADO",
        indicadores: [
          { codigo: "I.M.2.3.1", texto: "Clasifica, según sus elementos y propiedades, cuerpos y figuras geométricas, mostrando disposición para observar con atención las características geométricas del entorno" },
          { codigo: "I.M.2.3.2", texto: "Identifica elementos básicos de la Geometría en cuerpos y figuras geométricas" },
          { codigo: "I.M.2.3.3", texto: "Utiliza elementos básicos de la Geometría para dibujar y describir figuras planas en objetos del entorno, demostrando interés y precisión en sus construcciones" },
          { codigo: "I.M.2.3.4", texto: "Resuelve situaciones cotidianas que requieran de la medición y/o estimación del perímetro de figuras planas, valorando el uso de la geometría en la vida diaria" },
        ],
        saberes: {
          declarativos: [
            "M.2.2.d.3. Formas geométricas básicas (cuadradas, triangulares, rectangulares y circulares) presentes en el entorno. Elementos de las figuras geométricas: lados y vértices.",
            "M.2.2.d.5. Características de cuadrados y rectángulos.",
            "M.2.2.d.6. Líneas rectas y curvas en objetos del entorno.",
          ],
          procedimentales: [
            "M.2.2.p.1. Dibujar figuras geométricas (cuadrados, triángulos, rectángulos y círculos), utilizando diferentes técnicas y recursos. Representar gráficamente líneas rectas y curvas.",
            "M.2.2.p.5. Identificar líneas en elementos del entorno.",
          ],
          actitudinales: [
            "M.2.2.a.1. Demostrar una actitud reflexiva en la identificación de propiedades geométricas.",
            "M.2.2.a.3. Valorar el uso de la geometría para resolver situaciones cotidianas.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "TERCER GRADO",
        indicadores: [
          { codigo: "I.M.2.3.1", texto: "Clasifica, según sus elementos y propiedades, cuerpos y figuras geométricas, mostrando disposición para observar con atención las características geométricas del entorno" },
          { codigo: "I.M.2.3.2", texto: "Identifica elementos básicos de la Geometría en cuerpos y figuras geométricas" },
          { codigo: "I.M.2.3.3", texto: "Utiliza elementos básicos de la Geometría para dibujar y describir figuras planas en objetos del entorno, demostrando interés y precisión en sus construcciones" },
          { codigo: "I.M.2.3.4", texto: "Resuelve situaciones cotidianas que requieran de la medición y/o estimación del perímetro de figuras planas, valorando el uso de la geometría en la vida diaria" },
        ],
        saberes: {
          declarativos: [
            "M.2.2.d.1. Elementos y propiedades de cilindros, esferas, conos, cubos y pirámides.",
            "M.2.2.d.2. Propiedades de cuerpos y figuras geométricas para su clasificación.",
            "M.2.2.d.4. Elementos de las figuras geométricas: lados, vértices, ángulos, fronteras interior y exterior. El perímetro.",
            "M.2.2.d.6. Diferencias entre líneas rectas y curvas en representaciones del entorno.",
            "M.2.2.d.7. Los ángulos.",
          ],
          procedimentales: [
            "M.2.2.p.2. Medir perímetros en cuadrados y rectángulos. Representar gráficamente la semirrecta y el segmento.",
            "M.2.2.p.4. Clasificar ángulos en objetos del entorno.",
            "M.2.2.p.5. Clasificar ángulos rectos, agudos y obtusos en elementos del entorno.",
          ],
          actitudinales: [
            "M.2.2.a.1. Demostrar una actitud reflexiva en la identificación de propiedades geométricas.",
            "M.2.2.a.2. Mostrar interés y precisión en la construcción de figuras geométricas.",
            "M.2.2.a.3. Valorar el uso de la geometría para resolver situaciones cotidianas.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "CUARTO GRADO",
        indicadores: [
          { codigo: "I.M.2.3.1", texto: "Clasifica, según sus elementos y propiedades, cuerpos y figuras geométricas, mostrando disposición para observar con atención las características geométricas del entorno" },
          { codigo: "I.M.2.3.2", texto: "Identifica elementos básicos de la Geometría en cuerpos y figuras geométricas" },
          { codigo: "I.M.2.3.3", texto: "Utiliza elementos básicos de la Geometría para dibujar y describir figuras planas en objetos del entorno, demostrando interés y precisión en sus construcciones" },
          { codigo: "I.M.2.3.4", texto: "Resuelve situaciones cotidianas que requieran de la medición y/o estimación del perímetro de figuras planas, valorando el uso de la geometría en la vida diaria" },
        ],
        saberes: {
          declarativos: [
            "M.2.2.d.1. Elementos y propiedades de cilindros, esferas, conos, cubos, pirámides y prismas rectangulares.",
            "M.2.2.d.2. Propiedades de cuerpos y figuras geométricas para su clasificación.",
            "M.2.2.d.3. Formas geométricas básicas (cuadradas, triangulares, rectangulares y circulares) presentes en el entorno.",
            "M.2.2.d.4. Elementos de las figuras geométricas: lados, vértices, ángulos, fronteras interior y exterior.",
            "M.2.2.d.5. Características de cuadrados y rectángulos y concepto de perímetro.",
            "M.2.2.d.6. Diferencias entre líneas, rectas y curvas en representaciones geométricas.",
            "M.2.2.d.7. Tipos de ángulos según su amplitud: rectos, agudos y obtusos.",
          ],
          procedimentales: [
            "M.2.2.p.1. Dibujar figuras geométricas (cuadrados, triángulos, rectángulos y círculos), utilizando diferentes técnicas y recursos.",
            "M.2.2.p.2. Medir perímetros en cuadrados y rectángulos.",
            "M.2.2.p.3. Representar gráficamente la semirrecta, el segmento y el ángulo.",
            "M.2.2.p.4. Clasificar ángulos en objetos y figuras geométricas del entorno.",
            "M.2.2.p.5. Identificar líneas y clasificar ángulos rectos, agudos y obtusos en elementos del entorno.",
          ],
          actitudinales: [
            "M.2.2.a.1. Demostrar una actitud reflexiva en la identificación de propiedades geométricas.",
            "M.2.2.a.2. Mostrar interés y precisión en la construcción de figuras geométricas.",
            "M.2.2.a.3. Valorar el uso de la geometría para resolver situaciones cotidianas.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.M.2.4",
    descripcion: "Resolver problemas cotidianos y explicar actividades temporales mediante el uso de instrumentos de medida y la conversión de unidades de longitud, masa, capacidad y costo, para comunicar resultados con claridad, demostrando perseverancia, actitud positiva, honestidad e integridad",
    competenciasClave: ["CMCT", "CC", "CD", "CCICC"],
    porGrado: [
      {
        nivel: "ELEMENTAL",
        grado: "SEGUNDO GRADO",
        indicadores: [
          { codigo: "I.M.2.4.1", texto: "Resuelve situaciones problémicas sencillas que requieran de la comparación de longitudes y la conversión de unidades, solicitando ayuda cuando enfrenta dificultades y perseverando con actitud positiva" },
          { codigo: "I.M.2.4.2", texto: "Resuelve situaciones cotidianas que requieran conversiones monetarias simples, valorando la honestidad y responsabilidad en el uso del dinero" },
          { codigo: "I.M.2.4.3", texto: "Utiliza las unidades de tiempo para describir sus actividades cotidianas" },
          { codigo: "I.M.2.4.4", texto: "Resuelve situaciones problémicas sencillas que requieran de la comparación de la masa de objetos del entorno, de la conversión entre kilogramo y gramo, y la identificación de la libra como unidad de medida de masa, reconociendo el valor de sus pertenencias" },
          { codigo: "I.M.2.4.5", texto: "Resuelve situaciones problémicas sencillas que requieran de la estimación y comparación de capacidades y la conversión entre la unidad de medida de capacidad y sus submúltiplos, usando el dinero de manera consciente y responsable" },
        ],
        saberes: {
          declarativos: [
            "M.2.2.d.11. Valor de monedas y billetes.",
            "M.2.2.d.13. Nociones básicas de tiempo (día, noche, mañana, tarde, días de la semana, meses). Unidades de tiempo.",
            "M.2.2.d.16. Noción de peso y comparación entre objetos.",
            "M.2.2.d.20. Exploración sensorial de las medidas de capacidad, con la comparación de objetos y clasificación por tamaño y forma.",
            "M.2.2.d.23. Símbolos y terminologías básicas del dinero y su uso en contextos cotidianos.",
          ],
          procedimentales: [
            "M.2.2.p.8. Resolver situaciones significativas aplicando conversiones monetarias simples. Usar el dinero en actividades lúdicas y cotidianas.",
            "M.2.2.p.11. Reconocer los estados del tiempo y observar su medición en los diferentes objetos.",
            "M.2.2.p.16. Estimar capacidades y medir en los objetos en el entorno.",
          ],
          actitudinales: [
            "M.2.2.a.4. Valorar el uso honesto del dinero.",
            "M.2.2.a.5. Mostrar perseverancia y disposición para solicitar ayuda ante dificultades matemáticas. Reconocer el valor de sus pertenencias.",
            "M.2.2.a.7. Usar el dinero de manera responsable.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "TERCER GRADO",
        indicadores: [
          { codigo: "I.M.2.4.1", texto: "Resuelve situaciones problémicas sencillas que requieran de la comparación de longitudes y la conversión de unidades, solicitando ayuda cuando enfrenta dificultades y perseverando con actitud positiva" },
          { codigo: "I.M.2.4.2", texto: "Resuelve situaciones cotidianas que requieran conversiones monetarias simples, valorando la honestidad y responsabilidad en el uso del dinero" },
          { codigo: "I.M.2.4.3", texto: "Utiliza las unidades de tiempo para describir sus actividades cotidianas" },
          { codigo: "I.M.2.4.4", texto: "Resuelve situaciones problémicas sencillas que requieran de la comparación de la masa de objetos del entorno, de la conversión entre kilogramo y gramo, y la identificación de la libra como unidad de medida de masa, reconociendo el valor de sus pertenencias" },
          { codigo: "I.M.2.4.5", texto: "Resuelve situaciones problémicas sencillas que requieran de la estimación y comparación de capacidades y la conversión entre la unidad de medida de capacidad y sus submúltiplos, usando el dinero de manera consciente y responsable" },
        ],
        saberes: {
          declarativos: [
            "M.2.2.d.8. Concepto de longitud y comparación con patrones no convencionales. El metro y sus submúltiplos.",
            "M.2.2.d.11. Valor y representación de monedas y billetes (1, 5, 10, 20, 50 y 100). Unidades de tiempo y sus relaciones (años, meses, semanas, días, horas, minutos y segundos).(Ref.",
            "M.2.2.d.15. Noción de lectura del tiempo en relojes analógicos.",
            "M.2.2.d.16. Concepto de masa y comparación con patrones no convencionales.",
            "M.2.2.d.19. Reconocimiento de la libra como unidad de medida de masa.",
            "M.2.2.d.20. Concepto de capacidad y comparación con patrones no convencionales.",
            "M.2.2.d.21. Unidades de capacidad: litro, decilitro, centilitro, mililitro.",
          ],
          procedimentales: [
            "M.2.2.p.5. Estimar, medir y comparar longitudes con patrones no convencionales.",
            "M.2.2.p.9. Usar el dinero en actividades lúdicas y transacciones cotidianas.",
            "M.2.2.p.10. Realizar conversiones entre unidades de tiempo en situaciones significativas.",
            "M.2.2.p.11. Leer y escribir las horas y minutos.",
            "M.2.2.p.12. Medir y comparar masas con patrones no convencionales.",
            "M.2.2.p.13. Utilizar gramos y kilogramos para medir objetos reales.",
            "M.2.2.p.15. Medir y comparar capacidades con patrones no convencionales.",
            "M.2.2.p.16. Utilizar unidades de capacidad para estimar y medir en el entorno.",
          ],
          actitudinales: [
            "M.2.2.a.4. Valorar la honestidad y ser responsable en el uso del dinero.",
            "M.2.2.a.5. Mostrar perseverancia y disposición para solicitar ayuda ante dificultades matemáticas.",
            "M.2.2.a.6. Reconocer el valor de sus pertenencias y usarlas de forma responsable.",
            "M.2.2.a.7. Usar el dinero de manera consciente y responsable.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "CUARTO GRADO",
        indicadores: [
          { codigo: "I.M.2.4.1", texto: "Resuelve situaciones problémicas sencillas que requieran de la comparación de longitudes y la conversión de unidades, solicitando ayuda cuando enfrenta dificultades y perseverando con actitud positiva" },
          { codigo: "I.M.2.4.2", texto: "Resuelve situaciones cotidianas que requieran conversiones monetarias simples, valorando la honestidad y responsabilidad en el uso del dinero" },
          { codigo: "I.M.2.4.3", texto: "Utiliza las unidades de tiempo para describir sus actividades cotidianas" },
          { codigo: "I.M.2.4.4", texto: "Resuelve situaciones problémicas sencillas que requieran de la comparación de la masa de objetos del entorno, de la conversión entre kilogramo y gramo, y la identificación de la libra como unidad de medida de masa, reconociendo el valor de sus pertenencias" },
          { codigo: "I.M.2.4.5", texto: "Resuelve situaciones problémicas sencillas que requieran de la estimación y comparación de capacidades y la conversión entre la unidad de medida de capacidad y sus submúltiplos, usando el dinero de manera consciente y responsable" },
        ],
        saberes: {
          declarativos: [
            "M.2.2.d.8. Concepto de longitud y comparación con patrones no convencionales.",
            "M.2.2.d.9. Unidades de longitud: metro, decímetro, centímetro y milímetro.",
            "M.2.2.d.10. Relación entre el metro y sus submúltiplos para conversiones simples.",
            "M.2.2.d.11. Valor y representación de monedas y billetes (1, 5, 10, 20, 50 y 100).",
            "M.2.2.d.12. Equivalencias y conversiones monetarias simples.",
            "M.2.2.d.13. Nociones básicas de tiempo (día, noche, mañana, tarde, días de la semana, meses).",
            "M.2.2.d.14. Unidades de tiempo y sus relaciones (años, meses, semanas, días, horas, minutos y segundos).",
            "M.2.2.d.15. Noción de lectura del tiempo en relojes analógicos.",
            "M.2.2.d.16. Concepto de masa y comparación con patrones no convencionales.",
            "M.2.2.d.17. Unidades de masa: gramo y kilogramo.",
            "M.2.2.d.18. Relaciones básicas entre unidades de masa para conversiones simples.",
            "M.2.2.d.19. Reconocimiento de la libra como unidad de medida de masa.",
            "M.2.2.d.20. Concepto de capacidad y comparación con patrones no convencionales.",
            "M.2.2.d.21. Unidades de capacidad: litro, decilitro, centilitro, mililitro.",
            "M.2.2.d.22. Relaciones entre el litro y sus submúltiplos para conversiones simples.",
            "M.2.2.d.23. Símbolos y terminologías básicas del dinero y su uso en contextos cotidianos.",
          ],
          procedimentales: [
            "M.2.2.p.5. Estimar, medir y comparar longitudes con patrones no convencionales.",
            "M.2.2.p.6. Utilizar unidades de longitud para medir objetos del entorno.",
            "M.2.2.p.7. Realizar conversiones simples del metro a sus submúltiplos.",
            "M.2.2.p.8. Resolver situaciones significativas aplicando conversiones monetarias simples.",
            "M.2.2.p.9. Usar el dinero en actividades lúdicas y transacciones cotidianas.",
            "M.2.2.p.10. Realizar conversiones entre unidades de tiempo en situaciones significativas.",
            "M.2.2.p.11. Leer y escribir las horas y minutos.",
            "M.2.2.p.12. Medir y comparar masas con patrones no convencionales.",
            "M.2.2.p.13. Utilizar gramos y kilogramos para medir objetos reales.",
            "M.2.2.p.14. Realizar conversiones simples entre gramos y kilogramos.",
            "M.2.2.p.15. Medir y comparar capacidades con patrones no convencionales.",
            "M.2.2.p.16. Utilizar unidades de capacidad para estimar y medir en el entorno.",
            "M.2.2.p.17. Realizar conversiones simples del litro a sus submúltiplos.",
          ],
          actitudinales: [
            "M.2.2.a.4. Valorar la honestidad y ser responsable en el uso del dinero.",
            "M.2.2.a.5. Mostrar perseverancia y disposición para solicitar ayuda ante dificultades matemáticas.",
            "M.2.2.a.6. Reconocer el valor de sus pertenencias y usarlas de forma responsable.",
            "M.2.2.a.7. Usar el dinero de manera consciente y responsable.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.M.2.5",
    descripcion: "Gestionar responsablemente el dinero en transacciones cotidianas mediante la aplicación de operaciones básicas, el reconocimiento del sistema monetario ecuatoriano y de principios elementales de ahorro, para desenvolverse de manera autónoma con hábitos financieros saludables en contextos familiares y comunitarios, demostrando responsabilidad, generosidad y gratitud",
    competenciasClave: ["CMCT", "CC", "CD", "CCICC", "CIT"],
    porGrado: [
      {
        nivel: "ELEMENTAL",
        grado: "SEGUNDO GRADO",
        indicadores: [
          { codigo: "I.M.2.5.1", texto: "Utiliza correctamente el sistema monetario ecuatoriano en transacciones comerciales simuladas, calcula vueltos en compras menores a $10 y compara precios usando vocabulario matemático apropiado" },
          { codigo: "I.M.2.5.2", texto: "Diferencia entre necesidades y deseos al planificar compras personales y familiares, establece metas de ahorro simples y registra progresos usando representaciones gráficas elementales" },
          { codigo: "I.M.2.5.3", texto: "Identifica oficios y trabajos de la comunidad local, valorando el trabajo como fuente honesta de ingresos y mostrando respeto hacia las diferencias socioeconómicas entre familias" },
          { codigo: "I.M.2.5.4", texto: "Demuestra actitudes de generosidad y gratitud al compartir recursos con quienes lo necesitan y al recibir ayudas económicas, reconociendo la importancia del voluntariado en la comunidad" },
          { codigo: "I.M.2.5.5", texto: "Practica formas seguras de guardar el dinero y demuestra responsabilidad en su cuidado, transporte y uso en situaciones cotidianas" },
        ],
        saberes: {
          declarativos: [
            "M.2.4.d.1. Sistema monetario ecuatoriano: monedas y billetes en circulación.",
            "M.2.4.d.4. Diferencia entre necesidades básicas y deseos. Concepto de ahorro.",
            "M.2.4.d.6. Oficios y profesiones.",
            "M.2.4.d.7. Importancia de compartir y ayudar a otros con nuestros recursos.",
            "M.2.4.d.8. Cuidado y seguridad del dinero en casa como en el entorno.",
          ],
          procedimentales: [
            "M.2.4.p.1. Reconocer y utilizar monedas y billetes.",
            "M.2.4.p.2. Calcular vueltos en compras simples.",
            "M.2.4.p.3. Comparar precios de productos similares.",
            "M.2.4.p.5. Clasificar gastos familiares en necesidades y deseos.",
            "M.2.4.p.6. Simular compras en contextos lúdicos (tienda escolar).",
            "M.2.4.p.8. Practicar formas seguras de guardar el dinero ahorrado.",
          ],
          actitudinales: [
            "M.2.4.a.2. Actuar con responsabilidad frente al cuidado del dinero, guardándolo, transportándolo y utilizándolo con seguridad.",
            "M.2.4.a.3. Ahorrar mediante la postergación de gratificaciones inmediatas en favor de objetivos más grandes.",
            "M.2.4.a.5. Practicar la generosidad y la solidaridad compartiendo recursos con quienes lo necesitan.",
            "M.2.4.a.6. Manifestar gratitud al recibir dinero, regalos o ayudas económicas de otras personas.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "TERCER GRADO",
        indicadores: [
          { codigo: "I.M.2.5.1", texto: "Utiliza correctamente el sistema monetario ecuatoriano en transacciones comerciales simuladas, calcula vueltos en compras menores a $10 y compara precios usando vocabulario matemático apropiado" },
          { codigo: "I.M.2.5.2", texto: "Diferencia entre necesidades y deseos al planificar compras personales y familiares, establece metas de ahorro simples y registra progresos usando representaciones gráficas elementales" },
          { codigo: "I.M.2.5.3", texto: "Identifica oficios y trabajos de la comunidad local, valorando el trabajo como fuente honesta de ingresos y mostrando respeto hacia las diferencias socioeconómicas entre familias" },
          { codigo: "I.M.2.5.4", texto: "Demuestra actitudes de generosidad y gratitud al compartir recursos con quienes lo necesitan y al recibir ayudas económicas, reconociendo la importancia del voluntariado en la comunidad" },
          { codigo: "I.M.2.5.5", texto: "Practica formas seguras de guardar el dinero y demuestra responsabilidad en su cuidado, transporte y uso en situaciones cotidianas" },
        ],
        saberes: {
          declarativos: [
            "M.2.4.d.2. Equivalencias monetarias básicas (centavos-dólares).",
            "M.2.4.d.3. Conceptos elementales: compra, venta, cambio precio, vuelto.",
            "M.2.4.d.5. Concepto de ahorro y su importancia.",
            "M.2.4.d.6. Oficios y trabajos en la comunidad local.",
            "M.2.4.d.7. Importancia de compartir y ayudar a otros con nuestros recursos.",
            "M.2.4.d.8. Cuidado y seguridad del dinero en casa como en el entorno.",
          ],
          procedimentales: [
            "M.2.4.p.1. Reconocer y utilizar correctamente monedas y billetes ecuatorianos.",
            "M.2.4.p.2. Calcular vueltos en compras simples menores a $10.",
            "M.2.4.p.3. Comparar precios de productos similares usando vocabulario apropiado.",
            "M.2.4.p.4. Registrar dinero ahorrado usando representaciones simples.",
            "M.2.4.p.7. Reconocer situaciones en las que el uso solidario de los recursos beneficia a otras personas.",
          ],
          actitudinales: [
            "M.2.4.a.1. Valorar el trabajo como fuente honesta de ingresos que permite cubrir necesidades y alcanzar metas de ahorro.",
            "M.2.4.a.4. Respetar las diferencias socioeconómicas entre familias y reconocer la diversidad en la administración de ingresos y gastos.",
            "M.2.4.a.5. Practicar la generosidad y la solidaridad compartiendo recursos con quienes lo necesitan.",
            "M.2.4.a.6. Manifestar gratitud al recibir dinero, regalos o ayudas económicas de otras personas.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "CUARTO GRADO",
        indicadores: [
          { codigo: "I.M.2.5.1", texto: "Utiliza correctamente el sistema monetario ecuatoriano en transacciones comerciales simuladas, calcula vueltos en compras menores a $10 y compara precios usando vocabulario matemático apropiado" },
          { codigo: "I.M.2.5.2", texto: "Diferencia entre necesidades y deseos al planificar compras personales y familiares, establece metas de ahorro simples y registra progresos usando representaciones gráficas elementales" },
          { codigo: "I.M.2.5.3", texto: "Identifica oficios y trabajos de la comunidad local, valorando el trabajo como fuente honesta de ingresos y mostrando respeto hacia las diferencias socioeconómicas entre familias" },
          { codigo: "I.M.2.5.4", texto: "Demuestra actitudes de generosidad y gratitud al compartir recursos con quienes lo necesitan y al recibir ayudas económicas, reconociendo la importancia del voluntariado en la comunidad" },
          { codigo: "I.M.2.5.5", texto: "Practica formas seguras de guardar el dinero y demuestra responsabilidad en su cuidado, transporte y uso en situaciones cotidianas" },
        ],
        saberes: {
          declarativos: [
            "M.2.4.d.1. Sistema monetario ecuatoriano: monedas y billetes en circulación.",
            "M.2.4.d.2. Equivalencias monetarias básicas (centavos-dólares).",
            "M.2.4.d.3. Conceptos elementales: compra, venta, cambio precio, vuelto.",
            "M.2.4.d.4. Diferencia entre necesidades básicas y deseos.",
            "M.2.4.d.5. Concepto de ahorro y su importancia.",
            "M.2.4.d.6. Oficios y trabajos en la comunidad local.",
            "M.2.4.d.7. Importancia de compartir y ayudar a otros con nuestros recursos.",
            "M.2.4.d.8. Cuidado y seguridad del dinero en casa como en el entorno.",
          ],
          procedimentales: [
            "M.2.4.p.1. Reconocer y utilizar correctamente monedas y billetes ecuatorianos.",
            "M.2.4.p.2. Calcular vueltos en compras simples menores a $10.",
            "M.2.4.p.3. Comparar precios de productos similares usando vocabulario apropiado.",
            "M.2.4.p.4. Registrar dinero ahorrado usando representaciones simples.",
            "M.2.4.p.5. Clasificar gastos familiares en necesidades y deseos.",
            "M.2.4.p.6. Simular compras en contextos lúdicos (tienda escolar).",
            "M.2.4.p.7. Reconocer situaciones en las que el uso solidario de los recursos beneficia a otras personas.",
            "M.2.4.p.8. Practicar formas seguras de guardar el dinero ahorrado.",
          ],
          actitudinales: [
            "M.2.4.a.1. Valorar el trabajo como fuente honesta de ingresos que permite cubrir necesidades y alcanzar metas de ahorro.",
            "M.2.4.a.2. Actuar con responsabilidad frente al cuidado del dinero, guardándolo, transportándolo y utilizándolo con seguridad.",
            "M.2.4.a.3. Ahorrar mediante la postergación de gratificaciones inmediatas en favor de objetivos más grandes.",
            "M.2.4.a.4. Respetar las diferencias socioeconómicas entre familias y reconocer la diversidad en la administración de ingresos y gastos.",
            "M.2.4.a.5. Practicar la generosidad y la solidaridad compartiendo recursos con quienes lo necesitan.",
            "M.2.4.a.6. Manifestar gratitud al recibir dinero, regalos o ayudas económicas de otras personas.",
            "M.2.4.a.7. Valorar el aporte de los diferentes trabajos y servicios al bienestar de la comunidad.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.M.3.1",
    descripcion: "Resolver problemas de la vida cotidiana mediante el uso reflexivo de tecnologías digitales, estrategias de cálculo y algoritmos de las operaciones básicas con números naturales, decimales y fraccionarios (racionales), demostrando comprensión en la generación de sucesiones numéricas, la revisión de procesos y la verificación de resultados, así como la comunicación clara de los procedimientos empleados, integrando saberes matemáticos, tecnológicos y metacognitivos para fortalecer el pensamiento lógico, la autonomía y la toma de decisiones responsables, con una actitud ética, inclusiva y respetuosa de la diversidad y de los derechos humanos",
    competenciasClave: ["CC", "CMCT", "CCICC", "CSE", "CECA"],
    porGrado: [
      {
        nivel: "MEDIA",
        grado: "QUINTO GRADO",
        indicadores: [
          { codigo: "I.M.3.1.1", texto: "Aplica estrategias de cálculo y algoritmos de adición, sustracción, multiplicación y división con números naturales, decimales y fracciones (racionales), construye sucesiones numéricas crecientes y decrecientes, y resuelve situaciones cotidianas sencillas, utilizando cálculo mental, escrito y tecnologías digitales para verificar resultados con precisión" },
          { codigo: "I.M.3.1.2", texto: "Formula y resuelve problemas que implican operaciones combinadas, explicando los procesos de planteamiento, solución y comprobación de manera clara y ordenada, validando los resultados con diferentes métodos, incluido el uso de herramientas tecnológicas" },
          { codigo: "I.M.3.1.3", texto: "Comunica conclusiones y procedimientos matemáticos con lenguaje preciso, reflexiona críticamente sobre sus estrategias, coopera con otras personas en la resolución de problemas y actúa con ética, inclusión y respeto por la diversidad en el uso de tecnologías y saberes matemáticos" },
        ],
        saberes: {
          declarativos: [
            "M.3.1.d.1. Números naturales de hasta seis cifras y su estructura posicional.",
            "M.3.1.d.2. Algoritmos de las operaciones básicas con números naturales hasta seis cifras.",
            "M.3.1.d.3. Propiedad Distributiva de la multiplicación.",
            "M.3.1.d.4. Patrones matemáticos con restas y divisiones sucesivas.",
            "M.3.1.d.5. Estrategias de cálculo mental y estimación numérica. Sistema de coordenadas y ubicación en la cuadrícula.",
            "M.3.1.d.7. Relaciones de secuencia y orden entre diferentes conjuntos numéricos. z.",
          ],
          procedimentales: [
            "M.3.1.p.1. Generar patrones decrecientes con sumas, restas y divisiones sucesivas, con números naturales, a partir de ejercicios numéricos o problemas sencillos.",
            "M.3.1.p.2. Escribir números naturales de hasta seis cifras según su composición y descomposición, con el uso de material concreto y representación simbólica.",
            "M.3.1.p.3. Establecer relaciones de secuencia y orden entre números naturales y decimales, utilizando material concreto, la semirrecta numérica y simbología matemática.",
            "M.3.1.p.4. Aplicar las propiedades de las operaciones con números naturales para el mediante el cálculo escrito y mental en la resolución de ejercicios y problemas de la vida cotidiana. Resolver problemas del entorno cotidiano mediante el calculo de productos y cocientes por 10, 100 y 1000 de números naturales.",
          ],
          actitudinales: [
            "M.3.1.a.1. Demostrar paciencia en la resolución de problemas matemáticos, reconociendo que los errores son parte natural del proceso de aprendizaje.",
            "M.3.1.a.2. Valorar la importancia de la precisión y el rigor en los procedimientos matemáticos, demostrando cuidado en la aplicación de algoritmos y verificación de resultados.",
            "M.3.1.a.3. Mostrar disposición para explorar diferentes estrategias de cálculo, apreciando la diversidad de métodos matemáticos según contextos culturales.",
            "M.3.1.a.4. Demostrar responsabilidad y ética en el uso de tecnologías digitales para el cálculo, reconociendo su papel como herramienta de apoyo y no sustituto del pensamiento matemático.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SEXTO GRADO",
        indicadores: [
          { codigo: "I.M.3.1.1", texto: "Aplica estrategias de cálculo y algoritmos de adición, sustracción, multiplicación y división con números naturales, decimales y fracciones (racionales), construye sucesiones numéricas crecientes y decrecientes, y resuelve situaciones cotidianas sencillas, utilizando cálculo mental, escrito y tecnologías digitales para verificar resultados con precisión" },
          { codigo: "I.M.3.1.2", texto: "Formula y resuelve problemas que implican operaciones combinadas, explicando los procesos de planteamiento, solución y comprobación de manera clara y ordenada, validando los resultados con diferentes métodos, incluido el uso de herramientas tecnológicas" },
          { codigo: "I.M.3.1.3", texto: "Comunica conclusiones y procedimientos matemáticos con lenguaje preciso, reflexiona críticamente sobre sus estrategias, coopera con otras personas en la resolución de problemas y actúa con ética, inclusión y respeto por la diversidad en el uso de tecnologías y saberes matemáticos" },
        ],
        saberes: {
          declarativos: [
            "M.3.1.d.1. Números naturales de hasta ocho cifras y su estructura posicional.",
            "M.3.1.d.2. Algoritmos de las operaciones básicas con números naturales hasta ocho cifras.",
            "M.3.1.d.4. Sucesiones numéricas con sumas y restas de números naturales.",
            "M.3.1.d.5. Estrategias de cálculo mental y estimación numérica. Plano cartesiano con números naturales.",
            "M.3.1.d.7. Relaciones de secuencia y orden entre diferentes conjuntos numéricos. z.",
          ],
          procedimentales: [
            "M.3.1.p.1. Generar sucesiones con sumas y restas con números naturales, a partir de ejercicios numéricos o problemas sencillos.",
            "M.3.1.p.2. Escribir números naturales de hasta ocho cifras según su composición y descomposición, con el uso de material concreto y representación simbólica.",
            "M.3.1.p.3. Establecer relaciones de secuencia y orden entre números fraccionarios, utilizando material concreto, la semirrecta numérica y simbología matemática.",
            "M.3.1.p.5. Resolver problemas del entorno cotidiano mediante el calculo de productos y cocientes por 10, 100 y 1000 de números decimales.",
            "M.3.1.p.6. Resolver problemas que requieran el uso de operaciones combinadas con números naturales, aplicando la jerarquía de las operaciones.",
          ],
          actitudinales: [
            "M.3.1.a.1. Demostrar paciencia en la resolución de problemas matemáticos, reconociendo que los errores son parte natural del proceso de aprendizaje.",
            "M.3.1.a.2. Valorar la importancia de la precisión y el rigor en los procedimientos matemáticos, demostrando cuidado en la aplicación de algoritmos y verificación de resultados.",
            "M.3.1.a.3. Mostrar disposición para explorar diferentes estrategias de cálculo, apreciando la diversidad de métodos matemáticos según contextos culturales.",
            "M.3.1.a.4. Demostrar responsabilidad y ética en el uso de tecnologías digitales para el cálculo, reconociendo su papel como herramienta de apoyo y no sustituto del pensamiento matemático.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SÉPTIMO GRADO",
        indicadores: [
          { codigo: "I.M.3.1.1", texto: "Aplica estrategias de cálculo y algoritmos de adición, sustracción, multiplicación y división con números naturales, decimales y fracciones (racionales), construye sucesiones numéricas crecientes y decrecientes, y resuelve situaciones cotidianas sencillas, utilizando cálculo mental, escrito y tecnologías digitales para verificar resultados con precisión" },
          { codigo: "I.M.3.1.2", texto: "Formula y resuelve problemas que implican operaciones combinadas, explicando los procesos de planteamiento, solución y comprobación de manera clara y ordenada, validando los resultados con diferentes métodos, incluido el uso de herramientas tecnológicas" },
          { codigo: "I.M.3.1.3", texto: "Comunica conclusiones y procedimientos matemáticos con lenguaje preciso, reflexiona críticamente sobre sus estrategias, coopera con otras personas en la resolución de problemas y actúa con ética, inclusión y respeto por la diversidad en el uso de tecnologías y saberes matemáticos" },
        ],
        saberes: {
          declarativos: [
            "M.3.1.d.1. Números naturales de hasta nueve cifras y su estructura posicional.",
            "M.3.1.d.2. Algoritmos de las operaciones básicas con números naturales hasta nueve cifras.",
            "M.3.1.d.3. Propiedades de las operaciones básicas con números naturales. Sucesiones numéricas con multiplicaciones y divisiones de números naturales.",
            "M.3.1.d.5. Estrategias de cálculo mental y estimación numérica. Plano cartesiano con decimales y fracciones.",
            "M.3.1.d.7. Relaciones de secuencia y orden entre diferentes conjuntos numéricos. z.",
          ],
          procedimentales: [
            "M.3.1.p.1. Generar sucesiones con multiplicaciones y divisiones, con números naturales, a partir de ejercicios numéricos o problemas sencillos.",
            "M.3.1.p.2. Escribir números naturales de hasta nueve cifras según su composición y descomposición, con el uso de material concreto y representación simbólica.",
            "M.3.1.p.3. Establecer relaciones de secuencia y orden entre números naturales, fracciones y decimales, utilizando material concreto, la semirrecta numérica y simbología matemática.",
            "M.3.1.p.4. Aplicar las propiedades de las operaciones con números naturales para el mediante el cálculo escrito y mental en la resolución de ejercicios y problemas de la vida cotidiana.",
            "M.3.1.p.5. Resolver problemas del entorno cotidiano mediante el calculo de productos y cocientes por 10, 100 y 1000.",
            "M.3.1.p.6. Resolver problemas que requieran el uso de operaciones combinadas con números naturales, aplicando la jerarquía de las operaciones.",
            "M.3.1.p.7. Resolver problemas del entorno mediante la representación de puntos en el sistema de coordenadas.",
            "M.3.1.p.8. Aplicar las sucesiones numéricas crecientes y decrecientes identificando patrones en la resolución de problemas cotidianos.",
            "M.3.1.p.9. Emplear estrategias de cálculo mental y algoritmos escritos para resolver operaciones básicas con precisión y eficiencia.",
            "M.3.1.p.10. Explicar la estrategia de cálculo más apropiada según el contexto del problema (mental, escrito, con tecnología).",
          ],
          actitudinales: [
            "M.3.1.a.1. Demostrar paciencia en la resolución de problemas matemáticos, reconociendo que los errores son parte natural del proceso de aprendizaje.",
            "M.3.1.a.2. Valorar la importancia de la precisión y el rigor en los procedimientos matemáticos, demostrando cuidado en la aplicación de algoritmos y verificación de resultados.",
            "M.3.1.a.3. Mostrar disposición para explorar diferentes estrategias de cálculo, apreciando la diversidad de métodos matemáticos según contextos culturales.",
            "M.3.1.a.4. Demostrar responsabilidad y ética en el uso de tecnologías digitales para el cálculo, reconociendo su papel como herramienta de apoyo y no sustituto del pensamiento matemático.",
            "M.3.1.a.5. Fomentar actitudes colaborativas y respetuosas en el trabajo matemático grupal, valorando las ideas y aportes de todos los compañeros sin distinción de género, origen cultural o habilidades.",
            "M.3.1.a.6. Desarrollar confianza en las propias capacidades matemáticas, reconociendo que todas las personas pueden aprender matemáticas mediante esfuerzo y práctica constante.",
            "M.3.1.a.7. Apreciar la utilidad y belleza de las matemáticas en la vida cotidiana, reconociendo su presencia en la naturaleza, el arte y las actividades humanas.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.M.3.2",
    descripcion: "Aplicar las relaciones de secuencia y orden entre diferentes conjuntos numéricos, así como la simbología matemática en situaciones del entorno cotidiano mediante el análisis e interpretación crítica de la información para valorar su veracidad y comunicar conclusiones de forma clara, con responsabilidad social y apertura a la diversidad de contextos",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "MEDIA",
        grado: "QUINTO GRADO",
        indicadores: [
          { codigo: "I.M.3.2.1", texto: "Expresa números naturales, fraccionarios y decimales, aplicando estrategias de cálculo mental, redondeo y estimación en la resolución de situaciones cotidianas; verifica la validez de los resultados con apoyo de tecnologías digitales, demostrando precisión y cuidado en los procedimientos" },
          { codigo: "I.M.3.2.2", texto: "Utiliza expresiones numéricas adecuadas para secuenciar y ordenar conjuntos de números naturales, fracciones y decimales; analiza críticamente la información presentada en distintos medios, valorando su veracidad y coherencia, y comunica conclusiones fundamentadas con lenguaje matemático preciso" },
          { codigo: "I.M.3.2.3", texto: "Evalúa la coherencia y pertinencia de datos numéricos de diferentes fuentes, identificando errores o manipulaciones, y argumentando sus conclusiones desde una perspectiva ética y socialmente responsable, reconociendo la diversidad de contextos" },
        ],
        saberes: {
          declarativos: [
            "M.3.1.d.8. Operaciones combinadas con y sin signos de agrupación y orden de las operaciones de numeros naturales.",
            "M.3.1.d.9. Valor posicional de números naturales de hasta seis cifras y su estructura decimal.",
            "M.3.1.d.10. Composición y descomposición aditiva de números naturales y decimales.",
            "M.3.1.d.11. Simbología matemática para expresar relaciones de orden: mayor que (>), menor que (<), igual (=).",
            "M.3.1.d.12. Sistemas de representación numérica: material concreto, semirrecta numérica graduada y representación simbólica.",
          ],
          procedimentales: [
            "M.3.1.p.13. Analizar e interpretar información numérica presente en diferentes medios de comunicación y contextos cotidianos.",
            "M.3.1.p.14. Comparar datos numéricos de diferentes fuentes para evaluar su consistencia y veracidad.",
            "M.3.1.p.15. Organizar y clasificar información numérica según criterios de secuencia y orden establecidos.",
            "M.3.1.p.16. Fundamentar conclusiones basadas en el análisis de información numérica, utilizando lenguaje matemático preciso.",
          ],
          actitudinales: [
            "M.3.1.a.1. Desarrollar perseverancia y paciencia en la resolución de problemas matemáticos, reconociendo que los errores son parte natural del proceso de aprendizaje.",
            "M.3.1.a.2. Valorar la importancia de la precisión y el rigor en los procedimientos matemáticos, en la aplicación de algoritmos y verificación de resultados.",
            "M.3.1.a.3. Mostrar disposición para explorar diferentes estrategias de cálculo, apreciando la diversidad de métodos matemáticos según contextos culturales.",
            "M.3.1.a.8. Promover la equidad y justicia en el acceso a recursos y oportunidades de aprendizaje matemático, respetando los derechos de todos los estudiantes.",
            "M.3.1.a.9. Fomentar la curiosidad intelectual por comprender el entorno a través del análisis de datos y patrones numéricos.",
            "M.3.1.a.10. Valoración del trabajo cooperativo en tareas matemáticas.",
            "M.3.1.a.11. Responsabilidad al verificar resultados y justificar decisiones.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SEXTO GRADO",
        indicadores: [
          { codigo: "I.M.3.2.1", texto: "Expresa números naturales, fraccionarios y decimales, aplicando estrategias de cálculo mental, redondeo y estimación en la resolución de situaciones cotidianas; verifica la validez de los resultados con apoyo de tecnologías digitales, demostrando precisión y cuidado en los procedimientos" },
          { codigo: "I.M.3.2.2", texto: "Utiliza expresiones numéricas adecuadas para secuenciar y ordenar conjuntos de números naturales, fracciones y decimales; analiza críticamente la información presentada en distintos medios, valorando su veracidad y coherencia, y comunica conclusiones fundamentadas con lenguaje matemático preciso" },
          { codigo: "I.M.3.2.3", texto: "Evalúa la coherencia y pertinencia de datos numéricos de diferentes fuentes, identificando errores o manipulaciones, y argumentando sus conclusiones desde una perspectiva ética y socialmente responsable, reconociendo la diversidad de contextos" },
        ],
        saberes: {
          declarativos: [
            "M.3.1.d.8. Operaciones combinadas con y sin signos de agrupación y orden de las operaciones de numeros decimales con naturales.",
            "M.3.1.d.9. Valor posicional de números naturales de hasta ocho cifras y su estructura decimal.",
            "M.3.1.d.10. Composición y descomposición multiplicativa de números naturales.",
            "M.3.1.d.12. Sistemas de representación numérica: material concreto, semirrecta numérica graduada y representación simbólica.",
          ],
          procedimentales: [
            "M.3.1.p.13. Analizar e interpretar información numérica presente en diferentes medios de comunicación y contextos cotidianos.",
            "M.3.1.p.14. Comparar datos numéricos de diferentes fuentes para evaluar su consistencia y veracidad.",
            "M.3.1.p.15. Organizar y clasificar información numérica según criterios de secuencia y orden establecidos.",
            "M.3.1.p.16. Fundamentar conclusiones basadas en el análisis de información numérica, utilizando lenguaje matemático preciso.",
          ],
          actitudinales: [
            "M.3.1.a.1. Desarrollar perseverancia y paciencia en la resolución de problemas matemáticos, reconociendo que los errores son parte natural del proceso de aprendizaje.",
            "M.3.1.a.2. Valorar la importancia de la precisión y el rigor en los procedimientos matemáticos, en la aplicación de algoritmos y verificación de resultados.",
            "M.3.1.a.3. Mostrar disposición para explorar diferentes estrategias de cálculo, apreciando la diversidad de métodos matemáticos según contextos culturales.",
            "M.3.1.a.8. Promover la equidad y justicia en el acceso a recursos y oportunidades de aprendizaje matemático, respetando los derechos de todos los estudiantes.",
            "M.3.1.a.9. Fomentar la curiosidad intelectual por comprender el entorno a través del análisis de datos y patrones numéricos.",
            "M.3.1.a.10. Valoración del trabajo cooperativo en tareas matemáticas.",
            "M.3.1.a.11. Responsabilidad al verificar resultados y justificar decisiones.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SÉPTIMO GRADO",
        indicadores: [
          { codigo: "I.M.3.2.1", texto: "Expresa números naturales, fraccionarios y decimales, aplicando estrategias de cálculo mental, redondeo y estimación en la resolución de situaciones cotidianas; verifica la validez de los resultados con apoyo de tecnologías digitales, demostrando precisión y cuidado en los procedimientos" },
          { codigo: "I.M.3.2.2", texto: "Utiliza expresiones numéricas adecuadas para secuenciar y ordenar conjuntos de números naturales, fracciones y decimales; analiza críticamente la información presentada en distintos medios, valorando su veracidad y coherencia, y comunica conclusiones fundamentadas con lenguaje matemático preciso" },
          { codigo: "I.M.3.2.3", texto: "Evalúa la coherencia y pertinencia de datos numéricos de diferentes fuentes, identificando errores o manipulaciones, y argumentando sus conclusiones desde una perspectiva ética y socialmente responsable, reconociendo la diversidad de contextos" },
        ],
        saberes: {
          declarativos: [
            "M.3.1.d.8. Operaciones combinadas con y sin signos de agrupación y orden de las operaciones de números fraccionarios y decimales con suma, resta y multiplicación.",
            "M.3.1.d.9. Valor posicional de números naturales de hasta nueve cifras y su estructura decimal. Descomposición multiplicativa de números naturales y decimales.",
            "M.3.1.d.11. Simbología matemática para expresar relaciones de orden: mayor que (>), menor que (<), igual (=).",
            "M.3.1.d.12. Sistemas de representación numérica: material concreto, semirrecta numérica graduada y representación simbólica.",
          ],
          procedimentales: [
            "M.3.1.p.13. Analizar e interpretar información numérica presente en diferentes medios de comunicación y contextos cotidianos.",
            "M.3.1.p.14. Comparar datos numéricos de diferentes fuentes para evaluar su consistencia y veracidad.",
            "M.3.1.p.15. Organizar y clasificar información numérica según criterios de secuencia y orden establecidos.",
            "M.3.1.p.16. Fundamentar conclusiones basadas en el análisis de información numérica, utilizando lenguaje matemático preciso.",
          ],
          actitudinales: [
            "M.3.1.a.1. Desarrollar perseverancia y paciencia en la resolución de problemas matemáticos, reconociendo que los errores son parte natural del proceso de aprendizaje.",
            "M.3.1.a.2. Valorar la importancia de la precisión y el rigor en los procedimientos matemáticos, en la aplicación de algoritmos y verificación de resultados.",
            "M.3.1.a.3. Mostrar disposición para explorar diferentes estrategias de cálculo, apreciando la diversidad de métodos matemáticos según contextos culturales.",
            "M.3.1.a.8. Promover la equidad y justicia en el acceso a recursos y oportunidades de aprendizaje matemático, respetando los derechos de todos los estudiantes.",
            "M.3.1.a.9. Fomentar la curiosidad intelectual por comprender el entorno a través del análisis de datos y patrones numéricos.",
            "M.3.1.a.10. Valoración del trabajo cooperativo en tareas matemáticas.",
            "M.3.1.a.11. Responsabilidad al verificar resultados y justificar decisiones.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.M.3.3",
    descripcion: "Resolver problemas numéricos y geométricos del entorno mediante la descomposición en factores primos, del cálculo del MCM y MCD, de potencias, raíces y medidas de longitud, superficie, capacidad y volumen, empleando tecnología digital para realizar y verificar cálculos; argumentación con claridad y apertura lógica de los procesos utilizados, valorando las ideas de otras personas, desarrollando pensamiento crítico, cooperación y responsabilidad en el uso del conocimiento matemático",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "MEDIA",
        grado: "QUINTO GRADO",
        indicadores: [
          { codigo: "I.M.3.3.1", texto: "Aplica la descomposición en factores primos y el cálculo del MCD y MCM en la resolución de problemas numéricos, explicando con claridad los procesos seguidos, justificando los procedimientos y comunicando los resultados con precisión" },
          { codigo: "I.M.3.3.2", texto: "Emplea el cálculo y la estimación de potencias de números naturales y de raíces cuadradas y cúbicas, así como las medidas de longitud, superficie, capacidad y volumen, en el planteamiento y solución de problemas; utiliza responsablemente la tecnología para verificar los resultados, discute y argumenta en equipo los procedimientos aplicados" },
          { codigo: "I.M.3.3.3", texto: "Evalúa críticamente la validez de los resultados y de las estrategias empleadas, reflexiona sobre errores y alternativas de solución, y actúa con responsabilidad y ética en el uso del conocimiento matemático, valorando las ideas de otras personas" },
        ],
        saberes: {
          declarativos: [
            "M.3.1.d.20. Aplicaciones geométricas de potencias y raíces (metro cuadrado y metro cúbico).",
          ],
          procedimentales: [
            "M.3.1.p.20. Representar potencias cuadradas y cúbicas en modelos bidimensionales y tridimensionales.",
            "M.3.1.p.21. Calcular potencias y raíces exactas con y sin tecnología.",
            "M.3.1.p.24. Utilizar herramientas tecnológicas (calculadoras, simuladores, software) para verificar cálculos.",
            "M.3.1.p.25. Aplicar los conceptos en contextos cotidianos como organización de grupos, planificación de espacios, diseño de objetos, etc.",
          ],
          actitudinales: [
            "M.3.1.a.12. Valorar el uso del razonamiento lógico en la resolución de problemas.",
            "M.3.1.a.13. Mostrar apertura al diálogo matemático y al intercambio de ideas con otros.",
            "M.3.1.a.14. Reconocer y corregir errores en sus procedimientos con autonomía.",
            "M.3.1.a.15. Reflexionar sobre sus estrategias y justificar sus elecciones matemáticas.",
            "M.3.1.a.16. Integrar el uso de tecnología de forma ética y crítica al momento de calcular o representar procesos.",
            "M.3.1.a.25. Promover la inclusión de todos y todas en el trabajo colaborativo, valorando la diversidad de ideas.",
            "M.3.1.a.26. Reflexionar sobre los errores cometidos y mejorar las estrategias de resolución.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SEXTO GRADO",
        indicadores: [
          { codigo: "I.M.3.3.1", texto: "Aplica la descomposición en factores primos y el cálculo del MCD y MCM en la resolución de problemas numéricos, explicando con claridad los procesos seguidos, justificando los procedimientos y comunicando los resultados con precisión" },
          { codigo: "I.M.3.3.2", texto: "Emplea el cálculo y la estimación de potencias de números naturales y de raíces cuadradas y cúbicas, así como las medidas de longitud, superficie, capacidad y volumen, en el planteamiento y solución de problemas; utiliza responsablemente la tecnología para verificar los resultados, discute y argumenta en equipo los procedimientos aplicados" },
          { codigo: "I.M.3.3.3", texto: "Evalúa críticamente la validez de los resultados y de las estrategias empleadas, reflexiona sobre errores y alternativas de solución, y actúa con responsabilidad y ética en el uso del conocimiento matemático, valorando las ideas de otras personas" },
        ],
        saberes: {
          declarativos: [
            "M.3.1.d.13. Definición y propiedades de múltiplos y divisores de números naturales.",
            "M.3.1.d.14. Criterios de divisibilidad del 2 al 10.",
            "M.3.1.d.15. Números primos y compuestos: definición y características.",
            "M.3.1.d.16. Procedimiento para hallar el MCD y el.",
            "MCM.M.3.1.d.17. Potenciación como multiplicación repetida y potencias con exponentes 2 y 3 y su representación gráfica.",
            "M.3.1.d.18. Radicación como operación inversa de la potenciación. Aplicaciones geométricas de potencias y raíces (metro cuadradp, metro cúbico y submúltiplos).",
          ],
          procedimentales: [
            "M.3.1.p.17. Identificar múltiplos, divisores, primos y compuestos con criterios de divisibilidad.",
            "M.3.1.p.18. Descomponer números en factores primos utilizando criterios de divisibilidad.",
            "M.3.1.p.19. Resolver problemas contextualizados aplicando MCD y.",
            "MCM.M.3.1.p.22. Estimar raíces cuadradas y cúbicas mediante descomposición y tecnología.",
            "M.3.1.p.23. Resolver problemas de potenciación y radicación con distintas estrategias.",
          ],
          actitudinales: [
            "M.3.1.a.12. Valorar el uso del razonamiento lógico en la resolución de problemas.",
            "M.3.1.a.13. Mostrar apertura al diálogo matemático y al intercambio de ideas con otros.",
            "M.3.1.a.14. Reconocer y corregir errores en sus procedimientos con autonomía.",
            "M.3.1.a.15. Reflexionar sobre sus estrategias y justificar sus elecciones matemáticas.",
            "M.3.1.a.16. Integrar el uso de tecnología de forma ética y crítica al momento de calcular o representar procesos.",
            "M.3.1.a.25. Promover la inclusión de todos y todas en el trabajo colaborativo, valorando la diversidad de ideas.",
            "M.3.1.a.26. Reflexionar sobre los errores cometidos y mejorar las estrategias de resolución.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SÉPTIMO GRADO",
        indicadores: [
          { codigo: "I.M.3.3.1", texto: "Aplica la descomposición en factores primos y el cálculo del MCD y MCM en la resolución de problemas numéricos, explicando con claridad los procesos seguidos, justificando los procedimientos y comunicando los resultados con precisión" },
          { codigo: "I.M.3.3.2", texto: "Emplea el cálculo y la estimación de potencias de números naturales y de raíces cuadradas y cúbicas, así como las medidas de longitud, superficie, capacidad y volumen, en el planteamiento y solución de problemas; utiliza responsablemente la tecnología para verificar los resultados, discute y argumenta en equipo los procedimientos aplicados" },
          { codigo: "I.M.3.3.3", texto: "Evalúa críticamente la validez de los resultados y de las estrategias empleadas, reflexiona sobre errores y alternativas de solución, y actúa con responsabilidad y ética en el uso del conocimiento matemático, valorando las ideas de otras personas" },
        ],
        saberes: {
          declarativos: [
            "M.3.1.d.19. Raíces cuadradas y cúbicas. Aplicaciones geométricas de potencias y raíces (metro cuadrado, metro cúbico y múltiplos).",
          ],
          procedimentales: [
            "M.3.1.p.17. Identificar múltiplos, divisores, primos y compuestos con criterios de divisibilidad.",
            "M.3.1.p.18. Descomponer números en factores primos utilizando criterios de divisibilidad.",
            "M.3.1.p.19. Resolver problemas contextualizados aplicando MCD y.",
            "MCM.M.3.1.p.20. Representar potencias cuadradas y cúbicas en modelos bidimensionales y tridimensionales.",
            "M.3.1.p.21. Calcular potencias y raíces exactas con y sin tecnología.",
            "M.3.1.p.22. Estimar raíces cuadradas y cúbicas mediante descomposición y tecnología.",
            "M.3.1.p.23. Resolver problemas de potenciación y radicación con distintas estrategias.",
            "M.3.1.p.24. Utilizar herramientas tecnológicas (calculadoras, simuladores, software) para verificar cálculos.",
            "M.3.1.p.25. Aplicar los conceptos en contextos cotidianos como organización de grupos, planificación de espacios, diseño de objetos, etc.",
          ],
          actitudinales: [
            "M.3.1.a.12. Valorar el uso del razonamiento lógico en la resolución de problemas.",
            "M.3.1.a.13. Mostrar apertura al diálogo matemático y al intercambio de ideas con otros.",
            "M.3.1.a.14. Reconocer y corregir errores en sus procedimientos con autonomía.",
            "M.3.1.a.15. Reflexionar sobre sus estrategias y justificar sus elecciones matemáticas.",
            "M.3.1.a.16. Integrar el uso de tecnología de forma ética y crítica al momento de calcular o representar procesos.",
            "M.3.1.a.25. Promover la inclusión de todos y todas en el trabajo colaborativo, valorando la diversidad de ideas.",
            "M.3.1.a.26. Reflexionar sobre los errores cometidos y mejorar las estrategias de resolución.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.M.3.4",
    descripcion: "Aplicar los números romanos, fraccionarios y decimales en situaciones reales, estableciendo relaciones, equivalencia, transformaciones y comparaciones entre ellos, para analizar críticamente la información presentada en varios contextos con evidencia fundamentada",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "MEDIA",
        grado: "QUINTO GRADO",
        indicadores: [
          { codigo: "I.M.3.4.1", texto: "Utiliza números romanos, decimales y fraccionarios para expresar y comunicar situaciones cotidianas" },
          { codigo: "I.M.3.4.2", texto: "Interpreta información matemática presentada en distintos medios para resolver problemas, con precisión y claridad en los procedimientos" },
          { codigo: "I.M.3.4.3", texto: "Aplica las equivalencias entre números fraccionarios y decimales en la resolución de ejercicios y situaciones reales, seleccionando el procedimiento más adecuado según la naturaleza del cálculo, y justificando sus decisiones con lenguaje matemático claro" },
        ],
        saberes: {
          declarativos: [
            "M.3.1.d.22. Número decimal: décimos, centésimos y milésimos.",
            "M.3.1.d.23. Fracción como: parte de un todo, parte de un conjunto y unidad de medida.",
            "M.3.1.d.26. Transformación de decimales en fracciones con denominadores 10, 100 y 1000.",
          ],
          procedimentales: [
            "M.3.1.p.28. Representar gráficamente fracciones y decimales en la semirrecta numérica.",
            "M.3.1.p.29. Transformar decimales en fracciones con denominador 10, 100 o 1000, y viceversa.",
          ],
          actitudinales: [
            "M.3.1.a.1. Desarrollar perseverancia y paciencia en la resolución de problemas matemáticos, reconociendo que los errores son parte natural del proceso de aprendizaje.",
            "M.3.1.a.17. Valorar la diversidad de representaciones numéricas como parte del patrimonio cultural y matemático.",
            "M.3.1.a.18. Reconocer la utilidad de los distintos sistemas numéricos para representar la realidad.",
            "M.3.1.a.19. Actuar con ética frente a la información cuantitativa.",
            "M.3.1.a.20. Comunicar de manera clara y precisa al usar en situaciones cotidianas fracciones y decimales.",
            "M.3.1.a.21. Promover el respeto por la diversidad de saberes y contextos donde se usan diferentes formatos numéricos.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SEXTO GRADO",
        indicadores: [
          { codigo: "I.M.3.4.1", texto: "Utiliza números romanos, decimales y fraccionarios para expresar y comunicar situaciones cotidianas" },
          { codigo: "I.M.3.4.2", texto: "Interpreta información matemática presentada en distintos medios para resolver problemas, con precisión y claridad en los procedimientos" },
          { codigo: "I.M.3.4.3", texto: "Aplica las equivalencias entre números fraccionarios y decimales en la resolución de ejercicios y situaciones reales, seleccionando el procedimiento más adecuado según la naturaleza del cálculo, y justificando sus decisiones con lenguaje matemático claro" },
        ],
        saberes: {
          declarativos: [
            "M.3.1.d.22. Número decimal: décimos, centésimos y milésimos.",
            "M.3.1.d.23. Fracciones: clases y relación de orden.",
          ],
          procedimentales: [
            "M.3.1.p.27. Leer, escribir y usar números decimales y fracciones para representar cantidades en contextos reales.",
            "M.3.1.p.30. Establecer equivalencias entre fracciones y decimales para interpretar datos.",
            "M.3.1.p.31. Analizar información en medios de comunicación o textos cotidianos que utilizan fracciones o decimales.",
          ],
          actitudinales: [
            "M.3.1.a.1. Desarrollar perseverancia y paciencia en la resolución de problemas matemáticos, reconociendo que los errores son parte natural del proceso de aprendizaje.",
            "M.3.1.a.17. Valorar la diversidad de representaciones numéricas como parte del patrimonio cultural y matemático.",
            "M.3.1.a.18. Reconocer la utilidad de los distintos sistemas numéricos para representar la realidad.",
            "M.3.1.a.19. Actuar con ética frente a la información cuantitativa.",
            "M.3.1.a.20. Comunicar de manera clara y precisa al usar en situaciones cotidianas fracciones y decimales.",
            "M.3.1.a.21. Promover el respeto por la diversidad de saberes y contextos donde se usan diferentes formatos numéricos.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SÉPTIMO GRADO",
        indicadores: [
          { codigo: "I.M.3.4.1", texto: "Utiliza números romanos, decimales y fraccionarios para expresar y comunicar situaciones cotidianas" },
          { codigo: "I.M.3.4.2", texto: "Interpreta información matemática presentada en distintos medios para resolver problemas, con precisión y claridad en los procedimientos" },
          { codigo: "I.M.3.4.3", texto: "Aplica las equivalencias entre números fraccionarios y decimales en la resolución de ejercicios y situaciones reales, seleccionando el procedimiento más adecuado según la naturaleza del cálculo, y justificando sus decisiones con lenguaje matemático claro" },
        ],
        saberes: {
          declarativos: [
            "M.3.1.d.21. Números romanos hasta 1000: reglas y símbolos.",
            "M.3.1.d.22. Número decimal: décimos, centésimos y milésimos.",
            "M.3.1.d.24. Relaciones entre fracciones y decimales.",
            "M.3.1.d.25. Representación gráfica de fracciones y decimales en la recta numérica.",
          ],
          procedimentales: [
            "M.3.1.p.30. Establecer equivalencias entre fracciones y decimales para interpretar datos.",
            "M.3.1.p.26. Leer y escribir cantidades en números romanos hasta 1000.",
            "M.3.1.p.31. Analizar información en medios de comunicación o textos cotidianos que utilizan fracciones o decimales.",
          ],
          actitudinales: [
            "M.3.1.a.1. Desarrollar perseverancia y paciencia en la resolución de problemas matemáticos, reconociendo que los errores son parte natural del proceso de aprendizaje.",
            "M.3.1.a.17. Valorar la diversidad de representaciones numéricas como parte del patrimonio cultural y matemático.",
            "M.3.1.a.18. Reconocer la utilidad de los distintos sistemas numéricos para representar la realidad.",
            "M.3.1.a.19. Actuar con ética frente a la información cuantitativa.",
            "M.3.1.a.20. Comunicar de manera clara y precisa al usar en situaciones cotidianas fracciones y decimales.",
            "M.3.1.a.21. Promover el respeto por la diversidad de saberes y contextos donde se usan diferentes formatos numéricos.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.M.3.5",
    descripcion: "Resolver problemas numéricos aplicando, operaciones aritméticas, algoritmos convencionales y estrategias de cálculo mental con números naturales, decimales y fraccionarios empleando procedimientos de estimación, redondeo y operaciones combinadas para interpretar, verificar y comunicar resultados con precisión",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "MEDIA",
        grado: "QUINTO GRADO",
        indicadores: [
          { codigo: "I.M.3.5.1", texto: "Aplica las propiedades de las operaciones, estrategias de cálculo mental y algoritmos de la adición, sustracción, multiplicación y división con números naturales, decimales y fraccionarios para resolver ejercicios y problemas con operaciones combinadas; utilizando tecnologías digitales para verificar los resultados con rigor y precisión" },
          { codigo: "I.M.3.5.2", texto: "Resuelve problemas contextualizados, selecciona las operaciones y procedimientos adecuados con números naturales, decimales y fraccionarios, emplea reglas de redondeo y tecnologías digitales, y justifica de manera clara los procesos y resultados obtenidos" },
          { codigo: "I.M.3.5.3", texto: "Comunica sus procedimientos en el trabajo individual y colaborativo, empleando un lenguaje matemático claro y crítico sobre sus estrategias, promoviendo la inclusión y el respeto a la diversidad en la resolución de problemas" },
        ],
        saberes: {
          declarativos: [
            "M.3.1.d.3. Propiedades de la adición.",
            "M.3.1.d.27. Algoritmos convencionales para la suma, resta, multiplicación y división con números naturales y decimales de hasta seis cifras.",
            "M.3.1.d.28. Reglas de redondeo y su aplicación en contextos reales.",
            "M.3.1.d.29. Estrategias de cálculo mental: agrupación, descomposición, estimación. Criterios para resolver operaciones combinadas con y sin signos de agrupación de números naturales.",
            "M.3.1.d.31. Clases de fracciones y relación de orden.",
          ],
          procedimentales: [
            "M.3.1.p.32. Aplicar propiedades y estrategias de cálculo mental en la resolución de problemas con números naturales, decimales y fraccionarios.",
            "M.3.1.p.33. Utilizar algoritmos para resolver operaciones con números decimales y justificar los pasos realizados.",
            "M.3.1.p.34. Redondear números en función del contexto y estimar resultados. Plantear y resolver problemas con operaciones combinadas con números naturales.",
            "M.3.1.p.36. Calcular sumas, restas, de fracciones con y sin simplificación.",
            "M.3.1.p.37. Determinar el denominador común para resolver sumas y restas de fracciones.",
          ],
          actitudinales: [
            "M.3.1.a.1. Desarrollar perseverancia y paciencia en la resolución de problemas matemáticos, reconociendo que los errores son parte natural del proceso de aprendizaje.",
            "M.3.1.a.22. Justificar con argumentos los procedimientos utilizados, promoviendo el diálogo matemático y el respeto por las ideas ajenas.",
            "M.3.1.a.23. Actuar con responsabilidad y honestidad al usar tecnología para realizar cálculos.",
            "M.3.1.a.24. Mostrar apertura a diferentes formas de resolver problemas, reconociendo que pueden existir varios caminos válidos.",
            "M.3.1.a.25. Promover la inclusión de todos y todas en el trabajo colaborativo, valorando la diversidad de ideas.",
            "M.3.1.a.26. Reflexionar sobre los errores cometidos y mejorar las estrategias de resolución.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SEXTO GRADO",
        indicadores: [
          { codigo: "I.M.3.5.1", texto: "Aplica las propiedades de las operaciones, estrategias de cálculo mental y algoritmos de la adición, sustracción, multiplicación y división con números naturales, decimales y fraccionarios para resolver ejercicios y problemas con operaciones combinadas; utilizando tecnologías digitales para verificar los resultados con rigor y precisión" },
          { codigo: "I.M.3.5.2", texto: "Resuelve problemas contextualizados, selecciona las operaciones y procedimientos adecuados con números naturales, decimales y fraccionarios, emplea reglas de redondeo y tecnologías digitales, y justifica de manera clara los procesos y resultados obtenidos" },
          { codigo: "I.M.3.5.3", texto: "Comunica sus procedimientos en el trabajo individual y colaborativo, empleando un lenguaje matemático claro y crítico sobre sus estrategias, promoviendo la inclusión y el respeto a la diversidad en la resolución de problemas" },
        ],
        saberes: {
          declarativos: [
            "M.3.1.d.3. Propiedades de la adición y multiplicación.",
            "M.3.1.d.27. Algoritmos convencionales para la suma, resta, multiplicación y división con números naturales de hasta ocho cifras y decimales.",
            "M.3.1.d.28. Reglas de redondeo y su aplicación en contextos reales.",
            "M.3.1.d.29. Estrategias de cálculo mental: agrupación, descomposición, estimación. Criterios para resolver operaciones combinadas con y sin signos de agrupación de números naturales y decimales.",
            "M.3.1.d.31. Operaciones de fracciones: suma, resta, denominador común y simplificación.",
          ],
          procedimentales: [
            "M.3.1.p.32. Aplicar propiedades y estrategias de cálculo mental en la resolución de problemas con números naturales, decimales y fraccionarios.",
            "M.3.1.p.33. Utilizar algoritmos para resolver operaciones con números decimales y justificar los pasos realizados.",
            "M.3.1.p.34. Redondear números en función del contexto y estimar resultados. Plantear y resolver problemas con operaciones combinadas con números naturales y decimales.",
            "M.3.1.p.36. Calcular sumas, restas, multiplicaciones y divisiones de fracciones con y sin simplificación.",
            "M.3.1.p.37. Determinar el denominador común para resolver sumas y restas de fracciones.",
          ],
          actitudinales: [
            "M.3.1.a.1. Desarrollar perseverancia y paciencia en la resolución de problemas matemáticos, reconociendo que los errores son parte natural del proceso de aprendizaje.",
            "M.3.1.a.22. Justificar con argumentos los procedimientos utilizados, promoviendo el diálogo matemático y el respeto por las ideas ajenas.",
            "M.3.1.a.23. Actuar con responsabilidad y honestidad al usar tecnología para realizar cálculos.",
            "M.3.1.a.24. Mostrar apertura a diferentes formas de resolver problemas, reconociendo que pueden existir varios caminos válidos.",
            "M.3.1.a.25. Promover la inclusión de todos y todas en el trabajo colaborativo, valorando la diversidad de ideas.",
            "M.3.1.a.26. Reflexionar sobre los errores cometidos y mejorar las estrategias de resolución.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SÉPTIMO GRADO",
        indicadores: [
          { codigo: "I.M.3.5.1", texto: "Aplica las propiedades de las operaciones, estrategias de cálculo mental y algoritmos de la adición, sustracción, multiplicación y división con números naturales, decimales y fraccionarios para resolver ejercicios y problemas con operaciones combinadas; utilizando tecnologías digitales para verificar los resultados con rigor y precisión" },
          { codigo: "I.M.3.5.2", texto: "Resuelve problemas contextualizados, selecciona las operaciones y procedimientos adecuados con números naturales, decimales y fraccionarios, emplea reglas de redondeo y tecnologías digitales, y justifica de manera clara los procesos y resultados obtenidos" },
          { codigo: "I.M.3.5.3", texto: "Comunica sus procedimientos en el trabajo individual y colaborativo, empleando un lenguaje matemático claro y crítico sobre sus estrategias, promoviendo la inclusión y el respeto a la diversidad en la resolución de problemas" },
        ],
        saberes: {
          declarativos: [
            "M.3.1.d.3. Propiedades de las operaciones básicas.",
            "M.3.1.d.27. Algoritmos convencionales para la suma, resta, multiplicación y división con números naturales y decimales.",
            "M.3.1.d.29. Estrategias de cálculo mental: agrupación, descomposición, estimación. Criterios para resolver operaciones combinadas con y sin signos de agrupación de números naturales, fracciones y decimales.",
            "M.3.1.d.31. Operaciones de fracciones: suma, resta, multiplicación, división, denominador común y simplificación.",
          ],
          procedimentales: [
            "M.3.1.p.32. Aplicar propiedades y estrategias de cálculo mental en la resolución de problemas con números naturales, decimales y fraccionarios.",
            "M.3.1.p.33. Utilizar algoritmos para resolver operaciones con números decimales y justificar los pasos realizados.",
            "M.3.1.p.34. Redondear números en función del contexto y estimar resultados.",
            "M.3.1.p.35. Plantear y resolver problemas con operaciones combinadas con números naturales, fracciones y decimales.",
            "M.3.1.p.36. Calcular sumas, restas, multiplicaciones y divisiones de fracciones con y sin simplificación.",
            "M.3.1.p.37. Determinar el denominador común para resolver sumas y restas de fracciones.",
          ],
          actitudinales: [
            "M.3.1.a.1. Desarrollar perseverancia y paciencia en la resolución de problemas matemáticos, reconociendo que los errores son parte natural del proceso de aprendizaje.",
            "M.3.1.a.22. Justificar con argumentos los procedimientos utilizados, promoviendo el diálogo matemático y el respeto por las ideas ajenas.",
            "M.3.1.a.23. Actuar con responsabilidad y honestidad al usar tecnología para realizar cálculos.",
            "M.3.1.a.24. Mostrar apertura a diferentes formas de resolver problemas, reconociendo que pueden existir varios caminos válidos.",
            "M.3.1.a.25. Promover la inclusión de todos y todas en el trabajo colaborativo, valorando la diversidad de ideas.",
            "M.3.1.a.26. Reflexionar sobre los errores cometidos y mejorar las estrategias de resolución.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.M.3.6",
    descripcion: "Resolver problemas de proporcionalidad directa e inversa en contextos reales mediante el uso de razones y proporciones representadas en tablas, diagramas y gráficas cartesianas, explicando con claridad los procesos empleados valorando la importancia del uso ético, honesto y responsable de la información cuantitativa y de los documentos comerciales",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "MEDIA",
        grado: "QUINTO GRADO",
        indicadores: [
          { codigo: "I.M.3.6.1", texto: "Explica situaciones cotidianas con magnitudes directa o inversamente proporcionales mediante tablas y gráficas cartesianas con números naturales, decimales y fraccionarios, comunicando con claridad los procedimientos empleados" },
          { codigo: "I.M.3.6.2", texto: "Representa porcentajes como fracciones y decimales, los comunica en diagramas circulares y otros gráficos, e interpreta críticamente información porcentual del entorno, reconociendo posibles errores o manipulaciones" },
          { codigo: "I.M.3.6.3", texto: "Resuelve problemas de proporcionalidad contextualizados, justifica los procedimientos con representaciones gráficas y verifica resultados; argumenta con criterios razonados la utilidad de documentos comerciales y actúa con responsabilidad y ética en la interpretación de información cuantitativa" },
          { codigo: "I.M.3.6.4", texto: "Participa en el trabajo colaborativo para analizar y resolver situaciones de proporcionalidad, comunica conclusiones fundamentadas con lenguaje matemático claro y asume compromiso ciudadano en el uso de datos proporcionales y porcentuales" },
        ],
        saberes: {
          declarativos: [
            "M.3.1.d.33. Reconocimiento de relaciones de proporcionalidad directa entre magnitudes en situaciones cotidianas.",
            "M.3.1.d.37. Ubicación y sistema de coordenadas en la cuadrícula.",
            "M.3.1.d.38. Documentos comerciales: facturas e IVA.",
          ],
          procedimentales: [
            "M.3.1.p.39. Utilizar el sistema de coordenadas para representar situaciones reales con proporciones. Reconocer relaciones de proporcionalidad directa a partir de tablas, gráficos o enunciados.",
            "M.3.1.p.41. Plantear proporciones y resolverlas para calcular cantidades faltantes en contextos cotidianos. Representar porcentajes y rangos en tablas de frecuencias y diagramas de barras para comunicar información.",
            "M.3.1.p.44. Convertir fracciones y decimales en porcentajes, y viceversa, para resolver problemas. Calcular porcentajes en aplicaciones reales: descuentos, impuestos, propinas, etc.",
            "M.3.1.p.45. Resolver problemas de proporcionalidad contextualizados, explicando los procedimientos utilizados.",
            "M.3.1.p.45. Resolver problemas de proporcionalidad contextualizados, explicando los procedimientos utilizados.",
          ],
          actitudinales: [
            "M.3.1.a.22. Justificar con argumentos los procedimientos utilizados, promoviendo el diálogo matemático y el respeto por las ideas ajenas.",
            "M.3.1.a.23. Actuar con responsabilidad y honestidad al usar tecnología para realizar cálculos.",
            "M.3.1.a.24. Mostrar apertura a diferentes formas de resolver problemas, reconociendo que pueden existir varios caminos válidos.",
            "M.3.1.a.25. Promover la inclusión de todos y todas en el trabajo colaborativo, valorando la diversidad de ideas.",
            "M.3.1.a.26. Reflexionar sobre los errores cometidos y mejorar las estrategias de resolución.",
            "M.3.1.a.27. Valorar la proporcionalidad como herramienta para la toma de decisiones justas y responsables.",
            "M.3.1.a.28. Justificar los procedimientos usados con lenguaje claro y representación matemática adecuada.",
            "M.3.1.a.29. Utilizar responsablemente datos financieros y comerciales en cálculos y representaciones.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SEXTO GRADO",
        indicadores: [
          { codigo: "I.M.3.6.1", texto: "Explica situaciones cotidianas con magnitudes directa o inversamente proporcionales mediante tablas y gráficas cartesianas con números naturales, decimales y fraccionarios, comunicando con claridad los procedimientos empleados" },
          { codigo: "I.M.3.6.2", texto: "Representa porcentajes como fracciones y decimales, los comunica en diagramas circulares y otros gráficos, e interpreta críticamente información porcentual del entorno, reconociendo posibles errores o manipulaciones" },
          { codigo: "I.M.3.6.3", texto: "Resuelve problemas de proporcionalidad contextualizados, justifica los procedimientos con representaciones gráficas y verifica resultados; argumenta con criterios razonados la utilidad de documentos comerciales y actúa con responsabilidad y ética en la interpretación de información cuantitativa" },
          { codigo: "I.M.3.6.4", texto: "Participa en el trabajo colaborativo para analizar y resolver situaciones de proporcionalidad, comunica conclusiones fundamentadas con lenguaje matemático claro y asume compromiso ciudadano en el uso de datos proporcionales y porcentuales" },
        ],
        saberes: {
          declarativos: [
            "M.3.1.d.32. Par ordenado y sistema de coordenadas rectangulares con números naturales.",
            "M.3.1.d.33. Proporcionalidad directa entre dos magnitudes medibles.",
            "M.3.1.d.35. Porcentajes del 10%, 25% y sus múltiplos.",
            "M.3.1.d.37. Representaciones gráficas en el plano cartesiano: tablas y puntos.",
            "M.3.1.d.38. Porcentajes en facturas.",
          ],
          procedimentales: [
            "M.3.1.p.38. Leer y ubicar pares ordenados en el sistema de coordenadas rectangulares con números naturales y decimales.",
            "M.3.1.p.40. Reconocer relaciones de proporcionalidad directa e inversa a partir de tablas, gráficos o enunciados.",
            "M.3.1.p.41. Plantear proporciones y resolverlas para calcular cantidades faltantes en contextos cotidianos.",
            "M.3.1.p.42. Convertir fracciones y decimales en porcentajes, y viceversa, para resolver problemas. Representar porcentajes en diagramas de barras, circulares, poligonales y tablas para comunicar información.",
            "M.3.1.p.45. Resolver problemas de proporcionalidad contextualizados, explicando los procedimientos utilizados.",
          ],
          actitudinales: [
            "M.3.1.a.22. Justificar con argumentos los procedimientos utilizados, promoviendo el diálogo matemático y el respeto por las ideas ajenas.",
            "M.3.1.a.23. Actuar con responsabilidad y honestidad al usar tecnología para realizar cálculos.",
            "M.3.1.a.24. Mostrar apertura a diferentes formas de resolver problemas, reconociendo que pueden existir varios caminos válidos.",
            "M.3.1.a.25. Promover la inclusión de todos y todas en el trabajo colaborativo, valorando la diversidad de ideas.",
            "M.3.1.a.26. Reflexionar sobre los errores cometidos y mejorar las estrategias de resolución.",
            "M.3.1.a.27. Valorar la proporcionalidad como herramienta para la toma de decisiones justas y responsables.",
            "M.3.1.a.28. Justificar los procedimientos usados con lenguaje claro y representación matemática adecuada.",
            "M.3.1.a.29. Utilizar responsablemente datos financieros y comerciales en cálculos y representaciones.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SÉPTIMO GRADO",
        indicadores: [
          { codigo: "I.M.3.6.1", texto: "Explica situaciones cotidianas con magnitudes directa o inversamente proporcionales mediante tablas y gráficas cartesianas con números naturales, decimales y fraccionarios, comunicando con claridad los procedimientos empleados" },
          { codigo: "I.M.3.6.2", texto: "Representa porcentajes como fracciones y decimales, los comunica en diagramas circulares y otros gráficos, e interpreta críticamente información porcentual del entorno, reconociendo posibles errores o manipulaciones" },
          { codigo: "I.M.3.6.3", texto: "Resuelve problemas de proporcionalidad contextualizados, justifica los procedimientos con representaciones gráficas y verifica resultados; argumenta con criterios razonados la utilidad de documentos comerciales y actúa con responsabilidad y ética en la interpretación de información cuantitativa" },
          { codigo: "I.M.3.6.4", texto: "Participa en el trabajo colaborativo para analizar y resolver situaciones de proporcionalidad, comunica conclusiones fundamentadas con lenguaje matemático claro y asume compromiso ciudadano en el uso de datos proporcionales y porcentuales" },
        ],
        saberes: {
          declarativos: [
            "M.3.1.d.32. Par ordenado y sistema de coordenadas rectangulares con números fraccionarios y decimales.",
            "M.3.1.d.33. Magnitudes directa e inversamente proporcionales.",
            "M.3.1.d.34. Razones y proporciones: definiciones, propiedades y uso en contextos reales.",
            "M.3.1.d.35. Porcentaje como razón: interpretación de fracciones y decimales como porcentajes.",
            "M.3.1.d.36. Diagramas circulares y su utilidad para representar porcentajes.",
            "M.3.1.d.37. Representaciones gráficas en el plano cartesiano: tablas, puntos y tendencias.",
            "M.3.1.d.38. Porcentajes en facturas, descuentos, intereses, notas de venta y documentos comerciales.",
          ],
          procedimentales: [
            "M.3.1.p.38. Leer y ubicar pares ordenados en el sistema de coordenadas rectangulares con números naturales, decimales y fracciones.",
            "M.3.1.p.40. Resolver relaciones de proporcionalidad directa e inversa a partir de tablas, gráficos o enunciados.",
            "M.3.1.p.41. Plantear proporciones y resolverlas para calcular cantidades faltantes en contextos cotidianos.",
            "M.3.1.p.42. Convertir fracciones y decimales en porcentajes, y viceversa, para resolver problemas. Recolectar datos y representar porcentajes en diagramas circulares para comunicar información.",
            "M.3.1.p.44. Calcular porcentajes en aplicaciones reales: descuentos, impuestos, propinas, intereses simples, etc.",
            "M.3.1.p.45. Resolver problemas de proporcionalidad contextualizados, explicando los procedimientos utilizados.",
          ],
          actitudinales: [
            "M.3.1.a.22. Justificar con argumentos los procedimientos utilizados, promoviendo el diálogo matemático y el respeto por las ideas ajenas.",
            "M.3.1.a.23. Actuar con responsabilidad y honestidad al usar tecnología para realizar cálculos.",
            "M.3.1.a.24. Mostrar apertura a diferentes formas de resolver problemas, reconociendo que pueden existir varios caminos válidos.",
            "M.3.1.a.25. Promover la inclusión de todos y todas en el trabajo colaborativo, valorando la diversidad de ideas.",
            "M.3.1.a.26. Reflexionar sobre los errores cometidos y mejorar las estrategias de resolución.",
            "M.3.1.a.27. Valorar la proporcionalidad como herramienta para la toma de decisiones justas y responsables.",
            "M.3.1.a.28. Justificar los procedimientos usados con lenguaje claro y representación matemática adecuada.",
            "M.3.1.a.29. Utilizar responsablemente datos financieros y comerciales en cálculos y representaciones.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.M.3.7",
    descripcion: "Aplicar conocimientos geométricos en contextos reales y culturales mediante la construcción de figuras planas y cuerpos geométricos, identificando y explicando sus características y propiedades con el uso de elementos geométricos, la posición de rectas, la clasificación de ángulos y la fórmula de Euler, para resolver problemas con pensamiento lógico y precisión",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "MEDIA",
        grado: "QUINTO GRADO",
        indicadores: [
          { codigo: "I.M.3.7.1", texto: "Construye triángulos, paralelogramos y trapecios con material geométrico, aplicando conocimientos sobre la posición relativa de rectas y clasificación de ángulos; mide con precisión sus lados y ángulos, comunica procedimientos con lenguaje matemático y resuelve situaciones cotidianas vinculadas a estas figuras" },
          { codigo: "I.M.3.7.2", texto: "Reconoce polígonos regulares e irregulares, poliedros y cuerpos de revolución, los relaciona con objetos y contextos culturales o científicos aplicando la fórmula de Euler argumentando los procedimientos utilizados" },
          { codigo: "I.M.3.7.3", texto: "Emplea instrumentos de medición (regla, compás, transportador) para representar y verificar con precisión ángulos y figuras; reflexiona sobre la importancia de la visualización espacial y del rigor geométrico en la comprensión del entorno" },
        ],
        saberes: {
          declarativos: [
            "M.3.2.d.1. Rectas paralelas, secantes y secantes perpendiculares.",
            "M.3.2.d.3. Propiedades y clasificación de paralelogramos y trapecios. Clasificación de triángulos según lados y ángulos.",
            "M.3.2.d.8. Ángulos rectos, agudos y obtusos.",
          ],
          procedimentales: [
            "M.3.2.p.1. Reconocer y representar rectas paralelas, secantes y perpendiculares en figuras geométricas planas.",
            "M.3.2.p.2. Determinar y describir la posición relativa entre dos rectas en diferentes representaciones.",
            "M.3.2.p.3. Identificar y clasificar figuras planas como paralelogramos, trapecios y triángulos, analizando sus propiedades.",
            "M.3.2.p.8. Medir y trazar ángulos rectos, agudos y obtusos con instrumentos como transportador o graduador, en contextos escolares o cotidianos.",
            "M.3.2.p.9. Representar figuras geométricas en el plano con precisión, usando vocabulario geométrico correcto.",
          ],
          actitudinales: [
            "M.3.2.a.1. Valorar la precisión y claridad en la construcción y representación de figuras geométricas.",
            "M.3.2.a.2. Comunicar con lenguaje matemático apropiado las propiedades de figuras y cuerpos geométricos.",
            "M.3.2.a.3. Argumentar con base en propiedades geométricas para clasificar y resolver problemas.",
            "M.3.2.a.4. Demostrar interés por la visualización espacial como herramienta para comprender y transformar el entorno.",
            "M.3.2.a.5. Mostrar responsabilidad y atención al detalle al utilizar instrumentos de medición y construcción geométrica.",
            "M.3.2.a.6. Reconocer la importancia de la geometría en contextos culturales, artísticos, arquitectónicos y científicos.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SEXTO GRADO",
        indicadores: [
          { codigo: "I.M.3.7.1", texto: "Construye triángulos, paralelogramos y trapecios con material geométrico, aplicando conocimientos sobre la posición relativa de rectas y clasificación de ángulos; mide con precisión sus lados y ángulos, comunica procedimientos con lenguaje matemático y resuelve situaciones cotidianas vinculadas a estas figuras" },
          { codigo: "I.M.3.7.2", texto: "Reconoce polígonos regulares e irregulares, poliedros y cuerpos de revolución, los relaciona con objetos y contextos culturales o científicos aplicando la fórmula de Euler argumentando los procedimientos utilizados" },
          { codigo: "I.M.3.7.3", texto: "Emplea instrumentos de medición (regla, compás, transportador) para representar y verificar con precisión ángulos y figuras; reflexiona sobre la importancia de la visualización espacial y del rigor geométrico en la comprensión del entorno" },
        ],
        saberes: {
          declarativos: [
            "M.3.2.d.1. Rectas paralelas, secantes y secantes perpendiculares. Construcción del triángulo y área.",
            "M.3.2.d.3. Área y deducción de formulas de los paralelogramos y trapecios.",
            "M.3.2.d.5. Clasificación y perímetro de polígonos regulares.",
            "M.3.2.d.8. Ángulos en el sistema sexagesimal y conversiones entre grados, minutos y segundos.",
          ],
          procedimentales: [
            "M.3.2.p.1. Reconocer y representar rectas paralelas, secantes y perpendiculares en figuras geométricas planas.",
            "M.3.2.p.2. Determinar y describir la posición relativa entre dos rectas en diferentes representaciones.",
            "M.3.2.p.3. Identificar y clasificar figuras planas como paralelogramos, trapecios y triángulos, analizando sus propiedades.",
            "M.3.2.p.4. Construir triángulos, paralelogramos y trapecios usando regla y compás, midiendo ángulos y lados. Clasificar y describir polígonos regulares según sus elementos.",
            "M.3.2.p.8. Trazar ángulos según la medida y según la posición, con instrumentos como transportador o graduador, en contextos escolares o cotidianos.",
            "M.3.2.p.9. Representar figuras geométricas en el plano con precisión, usando vocabulario geométrico correcto.",
          ],
          actitudinales: [
            "M.3.2.a.1. Valorar la precisión y claridad en la construcción y representación de figuras geométricas.",
            "M.3.2.a.2. Comunicar con lenguaje matemático apropiado las propiedades de figuras y cuerpos geométricos.",
            "M.3.2.a.3. Argumentar con base en propiedades geométricas para clasificar y resolver problemas.",
            "M.3.2.a.4. Demostrar interés por la visualización espacial como herramienta para comprender y transformar el entorno.",
            "M.3.2.a.5. Mostrar responsabilidad y atención al detalle al utilizar instrumentos de medición y construcción geométrica.",
            "M.3.2.a.6. Reconocer la importancia de la geometría en contextos culturales, artísticos, arquitectónicos y científicos.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SÉPTIMO GRADO",
        indicadores: [
          { codigo: "I.M.3.7.1", texto: "Construye triángulos, paralelogramos y trapecios con material geométrico, aplicando conocimientos sobre la posición relativa de rectas y clasificación de ángulos; mide con precisión sus lados y ángulos, comunica procedimientos con lenguaje matemático y resuelve situaciones cotidianas vinculadas a estas figuras" },
          { codigo: "I.M.3.7.2", texto: "Reconoce polígonos regulares e irregulares, poliedros y cuerpos de revolución, los relaciona con objetos y contextos culturales o científicos aplicando la fórmula de Euler argumentando los procedimientos utilizados" },
          { codigo: "I.M.3.7.3", texto: "Emplea instrumentos de medición (regla, compás, transportador) para representar y verificar con precisión ángulos y figuras; reflexiona sobre la importancia de la visualización espacial y del rigor geométrico en la comprensión del entorno" },
        ],
        saberes: {
          declarativos: [
            "M.3.2.d.2. Posición relativa de dos rectas en gráficos y figuras planas. Trazado de paralelogramos y trapecios.",
            "M.3.2.d.5. Clasificación según sus lados y ángulos de los polígonos irregulares y perímetro.",
            "M.3.2.d.6. Clasificación de poliedros y cuerpos de revolución según sus elementos.",
            "M.3.2.d.7. Fórmula de Euler: definición y aplicación a poliedros convexos.",
            "M.3.2.d.8. Ángulos rectos, agudos y obtusos.",
            "M.3.2.d.9. Instrumentos y estrategias para la medición de ángulos.",
          ],
          procedimentales: [
            "M.3.2.p.5. Clasificar y describir polígonos regulares e irregulares según sus elementos.",
            "M.3.2.p.6. Identificar, nombrar y clasificar cuerpos geométricos como poliedros y cuerpos de revolución.",
            "M.3.2.p.7. Aplicar la fórmula de Euler en la resolución de problemas relacionados con poliedros.",
            "M.3.2.p.9. Representar figuras geométricas en el plano con precisión, usando vocabulario geométrico correcto.",
          ],
          actitudinales: [
            "M.3.2.a.1. Valorar la precisión y claridad en la construcción y representación de figuras geométricas.",
            "M.3.2.a.2. Comunicar con lenguaje matemático apropiado las propiedades de figuras y cuerpos geométricos.",
            "M.3.2.a.3. Argumentar con base en propiedades geométricas para clasificar y resolver problemas.",
            "M.3.2.a.4. Demostrar interés por la visualización espacial como herramienta para comprender y transformar el entorno.",
            "M.3.2.a.5. Mostrar responsabilidad y atención al detalle al utilizar instrumentos de medición y construcción geométrica.",
            "M.3.2.a.6. Reconocer la importancia de la geometría en contextos culturales, artísticos, arquitectónicos y científicos.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.M.3.8",
    descripcion: "Resolver problemas de la vida cotidiana con el cálculo del perímetro y el área de figuras planas mediante la deducción de estrategias a partir del uso de fórmulas, explicando de forma razonada los procedimientos realizados, verificando los resultados y valorando su validez con pensamiento lógico, metacognición y responsabilidad en la aplicación del conocimiento geométrico en contextos reales",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "MEDIA",
        grado: "QUINTO GRADO",
        indicadores: [
          { codigo: "I.M.3.8.1", texto: "Deduce, a partir del análisis de polígonos regulares, irregulares y del círculo, fórmulas de perímetro y área; las aplica en la solución de problemas geométricos y en la descripción de objetos culturales o naturales de su entorno" },
          { codigo: "I.M.3.8.2", texto: "Compara resultados obtenidos en el cálculo de perímetro y área mediante estrategias diversas (cálculo directo, estimación, uso de tecnología), reflexiona sobre la validez de los procedimientos aplicados y ajusta sus estrategias en caso necesario" },
          { codigo: "I.M.3.8.3", texto: "Explica con claridad los procesos seguidos en el cálculo de perímetros y áreas, justificando sus decisiones con pensamiento lógico y responsabilidad en la aplicación del conocimiento geométrico en contextos reales" },
        ],
        saberes: {
          declarativos: [
            "M.3.2.d.10. Perímetro de triángulos y cuadriláteros.",
            "M.3.2.d.11. Area de triángulos y cuadriláteros.",
            "M.3.2.d.11. Area como medida de la superficie de una figura plana.",
            "M.3.2.d.13. Fórmulas del perímetro y área de triángulos.",
            "M.3.2.d.17. Unidades de medida del sistema métrico para perímetro y área.",
            "M.3.2.d.18. Aplicaciones geométricas de potencias y raíces (áreas y volúmenes).",
          ],
          procedimentales: [
            "M.3.2.p.11. Determinar el perímetro y área de triángulos, aplicando las fórmulas con datos dados o calculados.",
            "M.3.2.p.15. Comprobar los resultados de los cálculos de perímetro y áreas realizados, identificando errores o inconsistencias.",
            "M.3.2.p.16. Aplicar razonamiento lógico para deducir fórmulas para el cálculo de perímetro y áreas o adaptar estrategias según el tipo de figura o datos disponibles.",
            "M.3.2.p.17. Resolver problemas contextualizados (por ejemplo: cercar un terreno, pintar una pared, decorar una mesa) que impliquen perímetro o área.",
          ],
          actitudinales: [
            "M.3.2.a.7. Valorar la importancia de la precisión en el cálculo de perímetros y áreas.",
            "M.3.2.a.8. Justificar los procedimientos utilizados con claridad y coherencia lógica.",
            "M.3.2.a.9. Reflexionar sobre los errores y verificar resultados mediante el análisis crítico de los datos y del procedimiento aplicado.",
            "M.3.2.a.10. Asumir responsabilidad en el uso del conocimiento geométrico para resolver problemas reales.",
            "M.3.2.a.11. Mostrar disposición para revisar y mejorar estrategias cuando los resultados no son coherentes.",
            "M.3.2.a.12. Aplicar el conocimiento geométrico con sentido práctico, ético y contextualizado.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SEXTO GRADO",
        indicadores: [
          { codigo: "I.M.3.8.1", texto: "Deduce, a partir del análisis de polígonos regulares, irregulares y del círculo, fórmulas de perímetro y área; las aplica en la solución de problemas geométricos y en la descripción de objetos culturales o naturales de su entorno" },
          { codigo: "I.M.3.8.2", texto: "Compara resultados obtenidos en el cálculo de perímetro y área mediante estrategias diversas (cálculo directo, estimación, uso de tecnología), reflexiona sobre la validez de los procedimientos aplicados y ajusta sus estrategias en caso necesario" },
          { codigo: "I.M.3.8.3", texto: "Explica con claridad los procesos seguidos en el cálculo de perímetros y áreas, justificando sus decisiones con pensamiento lógico y responsabilidad en la aplicación del conocimiento geométrico en contextos reales" },
        ],
        saberes: {
          declarativos: [
            "M.3.2.d.12. Fórmulas del perímetro y área de paralelogramos y trapecios. Fórmulas del perímetro y área de polígonos regulares.",
            "M.3.2.d.17. Unidades de medida del sistema métrico para perímetro y área.",
            "M.3.2.d.18. Aplicaciones geométricas de potencias y raíces (áreas y volúmenes).",
          ],
          procedimentales: [
            "M.3.2.p.10. Calcular el perímetro y el área de paralelogramos y trapecios a partir de fórmulas conocidas o deducidas.",
            "M.3.2.p.12. Calcular el perímetro y el área de polígonos regulares, utilizando medidas y fórmulas conocidas.",
            "M.3.2.p.15. Comprobar los resultados de los cálculos de perímetro y áreas realizados, identificando errores o inconsistencias.",
            "M.3.2.p.16. Aplicar razonamiento lógico para deducir fórmulas para el cálculo de perímetro y áreas o adaptar estrategias según el tipo de figura o datos disponibles.",
            "M.3.2.p.17. Resolver problemas contextualizados (por ejemplo: cercar un terreno, pintar una pared, decorar una mesa) que impliquen perímetro o área.",
          ],
          actitudinales: [
            "M.3.2.a.7. Valorar la importancia de la precisión en el cálculo de perímetros y áreas.",
            "M.3.2.a.8. Justificar los procedimientos utilizados con claridad y coherencia lógica.",
            "M.3.2.a.9. Reflexionar sobre los errores y verificar resultados mediante el análisis crítico de los datos y del procedimiento aplicado.",
            "M.3.2.a.10. Asumir responsabilidad en el uso del conocimiento geométrico para resolver problemas reales.",
            "M.3.2.a.11. Mostrar disposición para revisar y mejorar estrategias cuando los resultados no son coherentes.",
            "M.3.2.a.12. Aplicar el conocimiento geométrico con sentido práctico, ético y contextualizado.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SÉPTIMO GRADO",
        indicadores: [
          { codigo: "I.M.3.8.1", texto: "Deduce, a partir del análisis de polígonos regulares, irregulares y del círculo, fórmulas de perímetro y área; las aplica en la solución de problemas geométricos y en la descripción de objetos culturales o naturales de su entorno" },
          { codigo: "I.M.3.8.2", texto: "Compara resultados obtenidos en el cálculo de perímetro y área mediante estrategias diversas (cálculo directo, estimación, uso de tecnología), reflexiona sobre la validez de los procedimientos aplicados y ajusta sus estrategias en caso necesario" },
          { codigo: "I.M.3.8.3", texto: "Explica con claridad los procesos seguidos en el cálculo de perímetros y áreas, justificando sus decisiones con pensamiento lógico y responsabilidad en la aplicación del conocimiento geométrico en contextos reales" },
        ],
        saberes: {
          declarativos: [
            "M.3.2.d.14. Fórmulas del perímetro y área de polígonos regulares e irregulares.",
            "M.3.2.d.15. Elementos del círculo.",
            "M.3.2.d.16. Fórmulas del perímetro (longitud de la circunferencia) y área del círculo.",
            "M.3.2.d.17. Unidades de medida del sistema métrico para perímetro y área.",
            "M.3.2.d.18. Aplicaciones geométricas de potencias y raíces (áreas y volúmenes).",
          ],
          procedimentales: [
            "M.3.2.p.12. Calcular el perímetro y el área de polígonos regulares, utilizando medidas y fórmulas conocidas.",
            "M.3.2.p.13. Resolver problemas que impliquen el cálculo del perímetro de polígonos irregulares, sumando la longitud de sus lados.",
            "M.3.2.p.14. Identificar elementos de un círculo y aplicar correctamente las fórmulas para calcular su perímetro y área.",
            "M.3.2.p.15. Comprobar los resultados de los cálculos de perímetro y áreas realizados, identificando errores o inconsistencias.",
            "M.3.2.p.16. Aplicar razonamiento lógico para deducir fórmulas para el cálculo de perímetro y áreas o adaptar estrategias según el tipo de figura o datos disponibles.",
            "M.3.2.p.17. Resolver problemas contextualizados (por ejemplo: cercar un terreno, pintar una pared, decorar una mesa) que impliquen perímetro o área.",
          ],
          actitudinales: [
            "M.3.2.a.7. Valorar la importancia de la precisión en el cálculo de perímetros y áreas.",
            "M.3.2.a.8. Justificar los procedimientos utilizados con claridad y coherencia lógica.",
            "M.3.2.a.9. Reflexionar sobre los errores y verificar resultados mediante el análisis crítico de los datos y del procedimiento aplicado.",
            "M.3.2.a.10. Asumir responsabilidad en el uso del conocimiento geométrico para resolver problemas reales.",
            "M.3.2.a.11. Mostrar disposición para revisar y mejorar estrategias cuando los resultados no son coherentes.",
            "M.3.2.a.12. Aplicar el conocimiento geométrico con sentido práctico, ético y contextualizado.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.M.3.9",
    descripcion: "Aplicar procesos utilizando datos relacionados con situaciones del entorno mediante la aplicación de conceptos geométricos de conversión de unidades de medida, justificando la utilización de múltiplos o submúltiplos para optimizar procesos y comunicar información de manera precisa y contextualizada, con pensamiento lógico y responsable",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "MEDIA",
        grado: "QUINTO GRADO",
        indicadores: [
          { codigo: "I.M.3.9.1", texto: "Utiliza unidades de longitud, superficie, volumen, masa, angulares y de tiempo, junto con instrumentos adecuados, para realizar mediciones y estimaciones precisas, resolviendo situaciones de la vida real y comunicando con claridad los procedimientos empleados" },
          { codigo: "I.M.3.9.2", texto: "Resuelve situaciones problemáticas variadas empleando relaciones y conversiones entre unidades, múltiplos y submúltiplos, en medidas de tiempo, angulares, de longitud, superficie, volumen y masa; justifica los procesos aplicados y comunica la información con precisión" },
          { codigo: "I.M.3.9.3", texto: "Reconoce unidades de medida tradicionales o locales (como quintal, saco, balde, lustro, década) en contextos familiares y comunitarios, valorando su pertinencia cultural y comparándolas con el sistema métrico" },
          { codigo: "I.M.3.9.4", texto: "Analiza críticamente la elección de unidades en distintas representaciones numéricas o gráficas, identificando errores o sesgos, y asume responsabilidad en la comunicación ética y precisa de los resultados" },
        ],
        saberes: {
          declarativos: [
            "M.3.2.d.19. Unidades del sistema métrico decimal para longitud: metro, múltiplos (kilómetro, hectómetro...) y submúltiplos (decímetro, centímetro, milímetro).",
            "M.3.2.d.20. Unidades de superficie: metro cuadrado y sus múltiplos y submúltiplos.",
            "M.3.2.d.22. Unidades de volumen: metro cúbico, litros y submúltiplos (mililitro, centilitro).",
            "M.3.2.d.23. Medidas de masa: kilogramo, gramo, libra, y otras unidades utilizadas en el contexto local.",
            "M.3.2.d.25. Unidades tradicionales o locales como el quintal, saco, balde, lustro, década, etc.",
          ],
          procedimentales: [
            "M.3.2.p.18. Realizar conversiones entre unidades de longitud (múltiplos y submúltiplos del metro) en contextos reales. Comparar medidas de masa considerando el contexto local.",
            "M.3.2.p.23. Interpretar y emplear unidades de medida temporales no convencionales como lustro y década en la comprensión de información contextualizada.",
            "M.3.2.p.24. Seleccionar la unidad más adecuada para presentar datos con claridad y optimizar la comunicación.",
          ],
          actitudinales: [
            "M.3.2.a.13. Valorar el uso consciente y responsable del conocimiento matemático en la selección y conversión de unidades.",
            "M.3.2.a.14. Utilizar la información presentada en diferentes formatos numéricos o gráficos, reconociendo errores o sesgos en las unidades empleadas.",
            "M.3.2.a.15. Mostrar disposición para verificar cálculos y corregir errores en procesos de medición o conversión.",
            "M.3.2.a.16. Participar activamente en discusiones sobre la pertinencia de ciertas unidades en contextos locales y globales.",
            "M.3.2.a.17. Comunicar resultados de procesos de conversión, especialmente cuando tienen implicaciones prácticas o sociales.",
            "M.3.2.a.18. Reconocer la diversidad cultural en el uso de sistemas de medida y valorar la utilidad de las unidades tradicionales en el entorno comunitario.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SEXTO GRADO",
        indicadores: [
          { codigo: "I.M.3.9.1", texto: "Utiliza unidades de longitud, superficie, volumen, masa, angulares y de tiempo, junto con instrumentos adecuados, para realizar mediciones y estimaciones precisas, resolviendo situaciones de la vida real y comunicando con claridad los procedimientos empleados" },
          { codigo: "I.M.3.9.2", texto: "Resuelve situaciones problemáticas variadas empleando relaciones y conversiones entre unidades, múltiplos y submúltiplos, en medidas de tiempo, angulares, de longitud, superficie, volumen y masa; justifica los procesos aplicados y comunica la información con precisión" },
          { codigo: "I.M.3.9.3", texto: "Reconoce unidades de medida tradicionales o locales (como quintal, saco, balde, lustro, década) en contextos familiares y comunitarios, valorando su pertinencia cultural y comparándolas con el sistema métrico" },
          { codigo: "I.M.3.9.4", texto: "Analiza críticamente la elección de unidades en distintas representaciones numéricas o gráficas, identificando errores o sesgos, y asume responsabilidad en la comunicación ética y precisa de los resultados" },
        ],
        saberes: {
          declarativos: [
            "M.3.2.d.20. Unidades de superficie: metro cuadrado y sus múltiplos y submúltiplos.",
            "M.3.2.d.22. Unidades de volumen: metro cúbico, litros y submúltiplos (mililitro, centilitro).",
            "M.3.2.d.24. Sistemas angulares: grado, minuto, segundo.",
          ],
          procedimentales: [
            "M.3.2.p.19. Reconocer y convertir unidades de superficie.",
            "M.3.2.p.21. Convertir medidas de masa entre unidades (kilogramo, gramo, libra), considerando el contexto local.",
            "M.3.2.p.22. Aplicar conversiones de ángulos entre grados decimales y sexagesimales.",
            "M.3.2.p.24. Seleccionar la unidad más adecuada para presentar datos con claridad y optimizar la comunicación.",
          ],
          actitudinales: [
            "M.3.2.a.13. Valorar el uso consciente y responsable del conocimiento matemático en la selección y conversión de unidades.",
            "M.3.2.a.14. Utilizar la información presentada en diferentes formatos numéricos o gráficos, reconociendo errores o sesgos en las unidades empleadas.",
            "M.3.2.a.15. Mostrar disposición para verificar cálculos y corregir errores en procesos de medición o conversión.",
            "M.3.2.a.16. Participar activamente en discusiones sobre la pertinencia de ciertas unidades en contextos locales y globales.",
            "M.3.2.a.17. Comunicar resultados de procesos de conversión, especialmente cuando tienen implicaciones prácticas o sociales.",
            "M.3.2.a.18. Reconocer la diversidad cultural en el uso de sistemas de medida y valorar la utilidad de las unidades tradicionales en el entorno comunitario.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SÉPTIMO GRADO",
        indicadores: [
          { codigo: "I.M.3.9.1", texto: "Utiliza unidades de longitud, superficie, volumen, masa, angulares y de tiempo, junto con instrumentos adecuados, para realizar mediciones y estimaciones precisas, resolviendo situaciones de la vida real y comunicando con claridad los procedimientos empleados" },
          { codigo: "I.M.3.9.2", texto: "Resuelve situaciones problemáticas variadas empleando relaciones y conversiones entre unidades, múltiplos y submúltiplos, en medidas de tiempo, angulares, de longitud, superficie, volumen y masa; justifica los procesos aplicados y comunica la información con precisión" },
          { codigo: "I.M.3.9.3", texto: "Reconoce unidades de medida tradicionales o locales (como quintal, saco, balde, lustro, década) en contextos familiares y comunitarios, valorando su pertinencia cultural y comparándolas con el sistema métrico" },
          { codigo: "I.M.3.9.4", texto: "Analiza críticamente la elección de unidades en distintas representaciones numéricas o gráficas, identificando errores o sesgos, y asume responsabilidad en la comunicación ética y precisa de los resultados" },
        ],
        saberes: {
          declarativos: [
            "M.3.2.d.20. Unidades de superficie: metro cuadrado y sus múltiplos y submúltiplos.",
            "M.3.2.d.21. Medidas agrarias: hectárea, área, centiárea.",
            "M.3.2.d.22. Unidades de volumen: metro cúbico, litros y submúltiplos (mililitro, centilitro).",
            "M.3.2.d.23. Medidas de masa: kilogramo, gramo, libra, y otras unidades utilizadas en el contexto local.",
          ],
          procedimentales: [
            "M.3.2.p.19. Reconocer y convertir unidades de superficie, incluyendo las agrarias más comunes.",
            "M.3.2.p.20. Realizar conversiones de volumen y capacidad entre unidades cúbicas y medidas de capacidad líquida.",
            "M.3.2.p.24. Seleccionar la unidad más adecuada para presentar datos con claridad y optimizar la comunicación.",
          ],
          actitudinales: [
            "M.3.2.a.13. Valorar el uso consciente y responsable del conocimiento matemático en la selección y conversión de unidades.",
            "M.3.2.a.14. Utilizar la información presentada en diferentes formatos numéricos o gráficos, reconociendo errores o sesgos en las unidades empleadas.",
            "M.3.2.a.15. Mostrar disposición para verificar cálculos y corregir errores en procesos de medición o conversión.",
            "M.3.2.a.16. Participar activamente en discusiones sobre la pertinencia de ciertas unidades en contextos locales y globales.",
            "M.3.2.a.17. Comunicar resultados de procesos de conversión, especialmente cuando tienen implicaciones prácticas o sociales.",
            "M.3.2.a.18. Reconocer la diversidad cultural en el uso de sistemas de medida y valorar la utilidad de las unidades tradicionales en el entorno comunitario.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.M.3.10",
    descripcion: "Analizar información estadística del entorno mediante el uso de programas informáticos, gráficos y tablas, aplicando parámetros como media, mediana, moda y rango para la formulación de conclusiones fundamentadas, con pensamiento crítico, ética digital y responsabilidad ciudadana, valorando el uso de la estadística para la toma de decisiones en contextos personales, sociales y culturales",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "MEDIA",
        grado: "QUINTO GRADO",
        indicadores: [
          { codigo: "I.M.3.10.1", texto: "Representa datos discretos del entorno mediante tablas de frecuencias y diagramas estadísticos (barras, circulares, poligonales), con o sin el uso de programas informáticos, aplicando criterios de claridad y precisión" },
          { codigo: "I.M.3.10.2", texto: "Aplica parámetros estadísticos (media, mediana, moda y rango) para analizar e interpretar información del entorno, utilizando herramientas tecnológicas para verificar procesos y resultados" },
          { codigo: "I.M.3.10.3", texto: "Analiza críticamente información estadística publicada en medios de comunicación o en su comunidad, detecta posibles sesgos o manipulaciones y argumenta conclusiones con responsabilidad y ética digital" },
          { codigo: "I.M.3.10.4", texto: "Comunica conclusiones estadísticas de manera clara y fundamentada, valorando el uso de la estadística en la toma de decisiones personales, sociales y culturales, y participa colaborativamente en la interpretación de datos con sentido ciudadano" },
        ],
        saberes: {
          declarativos: [
            "M.3.3.d.1. Concepto de estadística como herramienta para organizar, analizar y comunicar información.",
            "M.3.3.d.2. Datos discretos: definición y ejemplos del entorno cercano. Representaciones gráficas: tablas de frecuencias y diagramas de barra.",
            "M.3.3.d.5. Medidas de dispersión: rango. Importancia de la estadística en la vida cotidiana.",
          ],
          procedimentales: [
            "M.3.3.p.1. Recoger y organizar datos discretos del entorno escolar, familiar o comunitario. Construir tablas de frecuencias y representar gráficamente los datos con diagramas de barra.",
            "M.3.3.p.4. Calcular el rango como medida de dispersión.",
            "M.3.3.p.5. Utilizar herramientas digitales para tabular, graficar e interpretar datos estadísticos.",
            "M.3.3.p.6. Analizar críticamente la información publicada en medios de comunicación desde una perspectiva estadística.",
            "M.3.3.p.7. Formular conclusiones relevantes a partir del análisis de los datos representados.",
          ],
          actitudinales: [
            "M.3.3.a.1. Valorar el uso de la estadística como herramienta para comprender y transformar realidades del entorno.",
            "M.3.3.a.2. Demostrar responsabilidad y ética en el uso, representación y comunicación de datos.",
            "M.3.3.a.3. Reconocer la importancia de la veracidad, claridad y transparencia al presentar información estadística.",
            "M.3.3.a.4. Ejercitar pensamiento crítico frente a datos manipulados o gráficos engañosos en los medios.",
            "M.3.3.a.5. Apreciar el uso de herramientas digitales como medios para mejorar la comprensión y comunicación de información cuantitativa.",
            "M.3.3.a.6. Participar activamente en el trabajo colaborativo para analizar e interpretar datos con sentido ciudadano y social.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SEXTO GRADO",
        indicadores: [
          { codigo: "I.M.3.10.1", texto: "Representa datos discretos del entorno mediante tablas de frecuencias y diagramas estadísticos (barras, circulares, poligonales), con o sin el uso de programas informáticos, aplicando criterios de claridad y precisión" },
          { codigo: "I.M.3.10.2", texto: "Aplica parámetros estadísticos (media, mediana, moda y rango) para analizar e interpretar información del entorno, utilizando herramientas tecnológicas para verificar procesos y resultados" },
          { codigo: "I.M.3.10.3", texto: "Analiza críticamente información estadística publicada en medios de comunicación o en su comunidad, detecta posibles sesgos o manipulaciones y argumenta conclusiones con responsabilidad y ética digital" },
          { codigo: "I.M.3.10.4", texto: "Comunica conclusiones estadísticas de manera clara y fundamentada, valorando el uso de la estadística en la toma de decisiones personales, sociales y culturales, y participa colaborativamente en la interpretación de datos con sentido ciudadano" },
        ],
        saberes: {
          declarativos: [
            "M.3.3.d.2. Representación de datos discretos en diagramas de barras y poligonales.",
            "M.3.3.d.3. Representaciones gráficas: tablas de frecuencias, diagramas de barra, diagramas circulares y diagramas poligonales.",
            "M.3.3.d.4. Medidas de tendencia central: media aritmética, mediana y moda.",
            "M.3.3.d.6. Importancia de la estadística en la vida cotidiana, en los medios de comunicación y en la toma de decisiones sociales.",
          ],
          procedimentales: [
            "M.3.3.p.1. Recoger y organizar datos discretos del entorno escolar, familiar o comunitario.",
            "M.3.3.p.2. Construir tablas de frecuencias y representar gráficamente los datos con diagramas de barra, circulares y poligonales.",
            "M.3.3.p.3. Calcular medidas de tendencia central (media, mediana, moda) a partir de un conjunto de datos.",
            "M.3.3.p.5. Utilizar herramientas digitales para tabular, graficar e interpretar datos estadísticos.",
            "M.3.3.p.6. Analizar críticamente la información publicada en medios de comunicación desde una perspectiva estadística.",
            "M.3.3.p.7. Formular conclusiones relevantes a partir del análisis de los datos representados.",
          ],
          actitudinales: [
            "M.3.3.a.1. Valorar el uso de la estadística como herramienta para comprender y transformar realidades del entorno.",
            "M.3.3.a.2. Demostrar responsabilidad y ética en el uso, representación y comunicación de datos.",
            "M.3.3.a.3. Reconocer la importancia de la veracidad, claridad y transparencia al presentar información estadística.",
            "M.3.3.a.4. Ejercitar pensamiento crítico frente a datos manipulados o gráficos engañosos en los medios.",
            "M.3.3.a.5. Apreciar el uso de herramientas digitales como medios para mejorar la comprensión y comunicación de información cuantitativa.",
            "M.3.3.a.6. Participar activamente en el trabajo colaborativo para analizar e interpretar datos con sentido ciudadano y social.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SÉPTIMO GRADO",
        indicadores: [
          { codigo: "I.M.3.10.1", texto: "Representa datos discretos del entorno mediante tablas de frecuencias y diagramas estadísticos (barras, circulares, poligonales), con o sin el uso de programas informáticos, aplicando criterios de claridad y precisión" },
          { codigo: "I.M.3.10.2", texto: "Aplica parámetros estadísticos (media, mediana, moda y rango) para analizar e interpretar información del entorno, utilizando herramientas tecnológicas para verificar procesos y resultados" },
          { codigo: "I.M.3.10.3", texto: "Analiza críticamente información estadística publicada en medios de comunicación o en su comunidad, detecta posibles sesgos o manipulaciones y argumenta conclusiones con responsabilidad y ética digital" },
          { codigo: "I.M.3.10.4", texto: "Comunica conclusiones estadísticas de manera clara y fundamentada, valorando el uso de la estadística en la toma de decisiones personales, sociales y culturales, y participa colaborativamente en la interpretación de datos con sentido ciudadano" },
        ],
        saberes: {
          declarativos: [
            "M.3.3.d.3. Representaciones gráficas: tablas de frecuencias, diagramas de barra, diagramas circulares y diagramas poligonales.",
            "M.3.3.d.4. Medidas de tendencia central: media aritmética, mediana y moda.",
            "M.3.3.d.6. Importancia de la estadística en la vida cotidiana, en los medios de comunicación y en la toma de decisiones sociales.",
          ],
          procedimentales: [
            "M.3.3.p.2. Construir tablas de frecuencias y representar gráficamente los datos con diagramas de barra, circulares y poligonales.",
            "M.3.3.p.3. Calcular medidas de tendencia central (media, mediana, moda) a partir de un conjunto de datos.",
            "M.3.3.p.5. Utilizar herramientas digitales para tabular, graficar e interpretar datos estadísticos.",
            "M.3.3.p.6. Analizar críticamente la información publicada en medios de comunicación desde una perspectiva estadística.",
            "M.3.3.p.7. Formular conclusiones relevantes a partir del análisis de los datos representados.",
          ],
          actitudinales: [
            "M.3.3.a.1. Valorar el uso de la estadística como herramienta para comprender y transformar realidades del entorno.",
            "M.3.3.a.2. Demostrar responsabilidad y ética en el uso, representación y comunicación de datos.",
            "M.3.3.a.3. Reconocer la importancia de la veracidad, claridad y transparencia al presentar información estadística.",
            "M.3.3.a.4. Ejercitar pensamiento crítico frente a datos manipulados o gráficos engañosos en los medios.",
            "M.3.3.a.5. Apreciar el uso de herramientas digitales como medios para mejorar la comprensión y comunicación de información cuantitativa.",
            "M.3.3.a.6. Participar activamente en el trabajo colaborativo para analizar e interpretar datos con sentido ciudadano y social.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.M.3.11",
    descripcion: "Resolver situaciones cotidianas mediante el uso de combinaciones simples y el cálculo de probabilidades, justificando con razonamiento lógico y pensamiento crítico los procesos aplicados y los resultados obtenidos, con una actitud ética, reflexiva",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "MEDIA",
        grado: "QUINTO GRADO",
        indicadores: [
          { codigo: "I.M.3.11.1", texto: "Resuelve situaciones cotidianas empleando combinaciones simples, utilizando la regla del producto y representaciones (tablas, diagramas, árboles), justificando la estrategia elegida" },
          { codigo: "I.M.3.11.2", texto: "Identifica el espacio muestral de experiencias aleatorias y asigna probabilidades (como fracciones y mediante gráficos) a distintos eventos, explicando el razonamiento y resolviendo problemas del entorno" },
          { codigo: "I.M.3.11.3", texto: "Interpreta y compara probabilidades provenientes de diversas fuentes; detecta errores o afirmaciones engañosas y argumenta conclusiones con pensamiento crítico y lenguaje matemático claro" },
          { codigo: "I.M.3.11.4", texto: "Reflexiona sobre la validez de los procedimientos aplicados, ajusta estrategias cuando es necesario y actúa con ética, respeto y apertura al trabajo colaborativo al comunicar resultados probabilísticos" },
        ],
        saberes: {
          declarativos: [
            "M.3.3.d.8. Combinación simple y su diferencia con la permutación.",
            "M.3.3.d.9. Regla del producto para contar combinaciones simples.",
            "M.3.3.d.10. Representaciones gráficas de sucesos aleatorios: diagramas, tablas, gráficas circulares, etc.",
            "M.3.3.d.11. Probabilidad: evento, espacio muestral, probabilidad, suceso aleatorio.",
            "M.3.3.d.13. Probabilidad en la vida cotidiana.",
          ],
          procedimentales: [
            "M.3.3.p.8. Realizar combinaciones simples de hasta 3 × 4 elementos en contextos reales (vestimenta, comidas, rutas, etc.).",
            "M.3.3.p.9. Representar gráficamente situaciones aleatorias o combinatorias mediante tablas o diagramas.",
            "M.3.3.p.10. Identificar el espacio muestral de un experimento aleatorio.",
            "M.3.3.p.12. Resolver problemas sencillos de probabilidad basados en datos del entorno.",
          ],
          actitudinales: [
            "M.3.3.a.7. Valorar el análisis probabilístico como herramienta para tomar decisiones informadas y responsables.",
            "M.3.3.a.8. Mostrar pensamiento crítico frente a predicciones o afirmaciones basadas en datos probabilísticos.",
            "M.3.3.a.9. Presentar resultados relacionados con la probabilidad de manera honesta y transparente.",
            "M.3.3.a.10. Argumentar sus decisiones con base en datos probabilísticos y combinatorios.",
            "M.3.3.a.11. Reflexionar sobre la validez de los procedimientos aplicados y ajustar estrategias en caso necesario.",
            "M.3.3.a.12. Respetar los aportes de otras personas al resolver problemas que implican incertidumbre y combinatoria.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SEXTO GRADO",
        indicadores: [
          { codigo: "I.M.3.11.1", texto: "Resuelve situaciones cotidianas empleando combinaciones simples, utilizando la regla del producto y representaciones (tablas, diagramas, árboles), justificando la estrategia elegida" },
          { codigo: "I.M.3.11.2", texto: "Identifica el espacio muestral de experiencias aleatorias y asigna probabilidades (como fracciones y mediante gráficos) a distintos eventos, explicando el razonamiento y resolviendo problemas del entorno" },
          { codigo: "I.M.3.11.3", texto: "Interpreta y compara probabilidades provenientes de diversas fuentes; detecta errores o afirmaciones engañosas y argumenta conclusiones con pensamiento crítico y lenguaje matemático claro" },
          { codigo: "I.M.3.11.4", texto: "Reflexiona sobre la validez de los procedimientos aplicados, ajusta estrategias cuando es necesario y actúa con ética, respeto y apertura al trabajo colaborativo al comunicar resultados probabilísticos" },
        ],
        saberes: {
          declarativos: [
            "M.3.3.d.10. Representaciones gráficas de sucesos aleatorios: diagramas, tablas, gráficas circulares, etc.",
            "M.3.3.d.12. Probabilidad como fracción del número de casos favorables entre los posibles.",
          ],
          procedimentales: [
            "M.3.3.p.9. Representar gráficamente situaciones aleatorias o combinatorias mediante tablas o diagramas.",
            "M.3.3.p.10. Identificar el espacio muestral de un experimento aleatorio.",
            "M.3.3.p.11. Calcular la probabilidad de un evento utilizando fracciones y explicaciones verbales.",
            "M.3.3.p.13. Justificar los procedimientos utilizados para calcular probabilidades o establecer combinaciones.",
            "M.3.3.p.14. Interpretar y comparar probabilidades en función de sus representaciones gráficas y sus significados.",
          ],
          actitudinales: [
            "M.3.3.a.7. Valorar el análisis probabilístico como herramienta para tomar decisiones informadas y responsables.",
            "M.3.3.a.8. Mostrar pensamiento crítico frente a predicciones o afirmaciones basadas en datos probabilísticos.",
            "M.3.3.a.9. Presentar resultados relacionados con la probabilidad de manera honesta y transparente.",
            "M.3.3.a.10. Argumentar sus decisiones con base en datos probabilísticos y combinatorios.",
            "M.3.3.a.11. Reflexionar sobre la validez de los procedimientos aplicados y ajustar estrategias en caso necesario.",
            "M.3.3.a.12. Respetar los aportes de otras personas al resolver problemas que implican incertidumbre y combinatoria.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SÉPTIMO GRADO",
        indicadores: [
          { codigo: "I.M.3.11.1", texto: "Resuelve situaciones cotidianas empleando combinaciones simples, utilizando la regla del producto y representaciones (tablas, diagramas, árboles), justificando la estrategia elegida" },
          { codigo: "I.M.3.11.2", texto: "Identifica el espacio muestral de experiencias aleatorias y asigna probabilidades (como fracciones y mediante gráficos) a distintos eventos, explicando el razonamiento y resolviendo problemas del entorno" },
          { codigo: "I.M.3.11.3", texto: "Interpreta y compara probabilidades provenientes de diversas fuentes; detecta errores o afirmaciones engañosas y argumenta conclusiones con pensamiento crítico y lenguaje matemático claro" },
          { codigo: "I.M.3.11.4", texto: "Reflexiona sobre la validez de los procedimientos aplicados, ajusta estrategias cuando es necesario y actúa con ética, respeto y apertura al trabajo colaborativo al comunicar resultados probabilísticos" },
        ],
        saberes: {
          declarativos: [
            "M.3.3.d.10. Representaciones gráficas de sucesos aleatorios: diagramas, tablas, gráficas circulares, etc.",
            "M.3.3.d.12. Probabilidad como fracción del número de casos favorables entre los posibles.",
            "M.3.3.d.13. Probabilidad en la vida cotidiana.",
          ],
          procedimentales: [
            "M.3.3.p.9. Representar gráficamente situaciones aleatorias o combinatorias mediante tablas o diagramas.",
            "M.3.3.p.10. Identificar el espacio muestral de un experimento aleatorio.",
            "M.3.3.p.11. Calcular la probabilidad de un evento utilizando fracciones y explicaciones verbales.",
            "M.3.3.p.13. Justificar los procedimientos utilizados para calcular probabilidades o establecer combinaciones.",
            "M.3.3.p.14. Interpretar y comparar probabilidades en función de sus representaciones gráficas y sus significados.",
          ],
          actitudinales: [
            "M.3.3.a.7. Valorar el análisis probabilístico como herramienta para tomar decisiones informadas y responsables.",
            "M.3.3.a.8. Mostrar pensamiento crítico frente a predicciones o afirmaciones basadas en datos probabilísticos.",
            "M.3.3.a.9. Presentar resultados relacionados con la probabilidad de manera honesta y transparente.",
            "M.3.3.a.10. Argumentar sus decisiones con base en datos probabilísticos y combinatorios.",
            "M.3.3.a.11. Reflexionar sobre la validez de los procedimientos aplicados y ajustar estrategias en caso necesario.",
            "M.3.3.a.12. Respetar los aportes de otras personas al resolver problemas que implican incertidumbre y combinatoria.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.M.3.12",
    descripcion: "Planificar la economía familiar a través del uso de herramientas matemáticas básicas (tablas, gráficos y porcentajes) para comprender la relación entre ingresos y egresos en el hogar, con el fin de establecer metas de ahorro, gestionar contingencias financieras y promover la toma de decisiones de consumo responsable",
    competenciasClave: [],
    porGrado: [
      {
        nivel: "MEDIA",
        grado: "QUINTO GRADO",
        indicadores: [
          { codigo: "I.M.3.12.1", texto: "Elabora presupuestos familiares básicos aplicando operaciones con números decimales, identifica fuentes de ingreso y categorías de gasto, y calcula balances simples para evaluar la situación económica del hogar" },
          { codigo: "I.M.3.12.2", texto: "Resuelve problemas de proporcionalidad directa y cálculo de porcentajes en contextos comerciales ecuatorianos (descuentos, IVA, interés simple), comparando alternativas para fundamentar decisiones de compra responsables" },
          { codigo: "I.M.3.12.3", texto: "Establece planes de ahorro familiar a corto y mediano plazo, representando la información financiera en gráficos de barras y circulares, y demuestra comprensión en la fijación y evaluación de metas temporales" },
          { codigo: "I.M.3.12.4", texto: "Analiza el impacto ambiental y social de las decisiones de consumo familiar, proponiendo alternativas sostenibles y solidarias ante emergencias económicas o necesidades comunitarias" },
        ],
        saberes: {
          declarativos: [
            "M.3.4.d.3. Educación financiera básica: ahorro como hábito financiero.",
            "M.3.4.d.4. Proporcionalidad en situaciones comerciales y relación precio-cantidad.",
            "M.3.4.d.5. Comparación de precios y gastos.",
          ],
          procedimentales: [
            "M.3.4.p.3. Resolver problemas de proporcionalidad directa en contextos comerciales. Establecer metas de ahorro e inversión a mediano plazo (3-6 meses).",
            "M.3.4.p.6. Comparar ofertas comerciales calculando valor por unidad.",
          ],
          actitudinales: [
            "M.3.4.a.1. Tomar conciencia sobre la importancia de la planificación en el hogar.",
            "M.3.4.a.2. Adoptar una actitud crítica hacia el consumismo y la publicidad engañosa.",
            "M.3.4.a.3. Valorar el ahorro y la inversión como herramienta de bienestar familiar. económicas familiares.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SEXTO GRADO",
        indicadores: [
          { codigo: "I.M.3.12.1", texto: "Elabora presupuestos familiares básicos aplicando operaciones con números decimales, identifica fuentes de ingreso y categorías de gasto, y calcula balances simples para evaluar la situación económica del hogar" },
          { codigo: "I.M.3.12.2", texto: "Resuelve problemas de proporcionalidad directa y cálculo de porcentajes en contextos comerciales ecuatorianos (descuentos, IVA, interés simple), comparando alternativas para fundamentar decisiones de compra responsables" },
          { codigo: "I.M.3.12.3", texto: "Establece planes de ahorro familiar a corto y mediano plazo, representando la información financiera en gráficos de barras y circulares, y demuestra comprensión en la fijación y evaluación de metas temporales" },
          { codigo: "I.M.3.12.4", texto: "Analiza el impacto ambiental y social de las decisiones de consumo familiar, proponiendo alternativas sostenibles y solidarias ante emergencias económicas o necesidades comunitarias" },
        ],
        saberes: {
          declarativos: [
            "M.3.4.d.1. Presupuesto familiar básico.",
            "M.3.4.d.2. Porcentajes aplicados a descuentos, impuestos e interés simple.",
            "M.3.4.d.3. Educación financiera básica: ahorro como hábito financiero.",
            "M.3.4.d.4. Proporcionalidad en situaciones comerciales, economía familiar y aplicaciones económicas financieras.",
            "M.3.4.d.5. Inflación y poder adquisitivo a nivel familiar.",
            "M.3.4.d.6. Economía familiar y comunitaria ecuatoriana: agricultura, comercio, servicios.",
            "M.3.4.d.8. Fondos de emergencia familiar: importancia y cálculo básico.",
            "M.3.4.d.9. Impacto de las decisiones de consumo en el medio ambiente y la comunidad.",
          ],
          procedimentales: [
            "M.3.4.p.1. Elaborar presupuestos familiares simples identificando ingresos y gastos.",
            "M.3.4.p.2. Calcular descuentos, IVA e interés simple en situaciones cotidianas.",
            "M.3.4.p.3. Resolver problemas de proporcionalidad directa en contextos comerciales. Establecer metas de ahorro e inversión a mediano plazo (3-6 meses).",
            "M.3.4.p.5. Interpretar información básica en facturas de servicios básicos.",
            "M.3.4.p.7. Representar información financiera en gráficos de barras y circulares.",
            "M.3.4.p.9. Evaluar el impacto ambiental y social de decisiones de compra familiares.",
          ],
          actitudinales: [
            "M.3.4.a.1. Tomar conciencia sobre la importancia de la planificación en el hogar.",
            "M.3.4.a.2. Adoptar una actitud crítica hacia el consumismo y la publicidad engañosa.",
            "M.3.4.a.3. Valorar el ahorro y la inversión como herramienta de bienestar familiar.",
            "M.3.4.a.5. Asumir responsabilidad ambiental en decisiones de consumo personal, familiar y comunitario.",
            "M.3.4.a.6. Ejercer prudencia y previsión de gastos ante emergencias económicas familiares.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SÉPTIMO GRADO",
        indicadores: [
          { codigo: "I.M.3.12.1", texto: "Elabora presupuestos familiares básicos aplicando operaciones con números decimales, identifica fuentes de ingreso y categorías de gasto, y calcula balances simples para evaluar la situación económica del hogar" },
          { codigo: "I.M.3.12.2", texto: "Resuelve problemas de proporcionalidad directa y cálculo de porcentajes en contextos comerciales ecuatorianos (descuentos, IVA, interés simple), comparando alternativas para fundamentar decisiones de compra responsables" },
          { codigo: "I.M.3.12.3", texto: "Establece planes de ahorro familiar a corto y mediano plazo, representando la información financiera en gráficos de barras y circulares, y demuestra comprensión en la fijación y evaluación de metas temporales" },
          { codigo: "I.M.3.12.4", texto: "Analiza el impacto ambiental y social de las decisiones de consumo familiar, proponiendo alternativas sostenibles y solidarias ante emergencias económicas o necesidades comunitarias" },
        ],
        saberes: {
          declarativos: [
            "M.3.4.d.1. Presupuesto familiar básico: ingresos y gastos principales.",
            "M.3.4.d.2. Porcentajes aplicados a descuentos, impuestos (IVA 15%) e interés simple.",
            "M.3.4.d.3. Servicios financieros básicos: cuenta de ahorros y tasa de interés (pasiva).",
            "M.3.4.d.4. Proporcionalidad en situaciones comerciales y económicas.",
            "M.3.4.d.5. Inflación y poder adquisitivo a nivel familiar.",
            "M.3.4.d.6. Economía familiar y comunitaria ecuatoriana: agricultura, comercio, servicios.",
            "M.3.4.d.7. Cooperativas de ahorro y crédito en Ecuador.",
            "M.3.4.d.8. Fondos de emergencia familiar: importancia y cálculo básico.",
            "M.3.4.d.9. Impacto de las decisiones de consumo en el medio ambiente y la comunidad.",
            "M.3.4.d.10. Riesgos básicos del dinero: pérdida, robo, lugares seguros de ahorro e inversiones.",
          ],
          procedimentales: [
            "M.3.4.p.1. Elaborar presupuestos familiares simples identificando ingresos y gastos.",
            "M.3.4.p.2. Calcular descuentos, IVA e interés simple en situaciones cotidianas.",
            "M.3.4.p.3. Resolver problemas de proporcionalidad directa en contextos comerciales.",
            "M.3.4.p.4. Establecer y monitorear metas de ahorro e inversión a mediano plazo (3-6 meses).",
            "M.3.4.p.5. Interpretar información básica en facturas de servicios básicos.",
            "M.3.4.p.6. Comparar ofertas comerciales calculando valor por unidad.",
            "M.3.4.p.7. Representar información financiera en gráficos de barras y circulares.",
            "M.3.4.p.8. Calcular fondos de emergencia básicos (equivalentes a 2-3 meses de gastos esenciales).",
            "M.3.4.p.9. Evaluar el impacto ambiental y social de decisiones de compra familiares.",
            "M.3.4.p.10. Identificar y comparar lugares seguros para guardar ahorros familiares.",
          ],
          actitudinales: [
            "M.3.4.a.1. Tomar conciencia sobre la importancia de la planificación en el hogar.",
            "M.3.4.a.2. Adoptar una actitud crítica hacia el consumismo y la publicidad engañosa.",
            "M.3.4.a.3. Valorar el ahorro y la inversión como herramienta de bienestar familiar.",
            "M.3.4.a.4. Practicar la solidaridad y la ayuda mutua en situaciones económicas difíciles.",
            "M.3.4.a.5. Asumir responsabilidad ambiental en decisiones de consumo personal, familiar y comunitario.",
            "M.3.4.a.6. Ejercer prudencia y previsión de gastos ante emergencias económicas familiares.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.M.4.1",
    descripcion: "Aplicar relaciones de orden, operaciones numéricas y expresiones algebraicas en los conjuntos de números enteros, racionales, irracionales y reales (ℤ, ℚ y ℝ.), para resolver ecuaciones e inecuaciones de primer grado en diversos contextos , interpretando las soluciones obtenidas y apoyándose en herramientas tecnológicas cuando corresponda",
    competenciasClave: ["CMCT", "CC", "CD", "CIT"],
    porGrado: [
      {
        nivel: "SUPERIOR",
        grado: "OCTAVO GRADO",
        indicadores: [
          { codigo: "I.M.4.1.1", texto: "Aplica las relaciones de orden en los conjuntos de números enteros, sus propiedades algebraicas en expresiones con operaciones combinadas y la jerarquía de las operaciones para resolver situaciones cotidianas" },
          { codigo: "I.M.4.1.2", texto: "Resuelve problemas contextualizados, que involucren propiedades algebraicas (conmutativa, asociativa, distributiva) de los números enteros, racionales e irracionales, mediante el planteamiento y resolución de ecuaciones e inecuaciones de primer grado con una incógnita, interpretando críticamente las soluciones de acuerdo con el contexto planteado" },
          { codigo: "I.M.4.1.3", texto: "Aplica relaciones de orden en los conjuntos de números racionales e irracionales con apoyo en la recta numérica, así como las propiedades de adición, multiplicación y radicales en el cálculo de expresiones numéricas y algebraicas en operaciones combinadas" },
          { codigo: "I.M.4.1.4", texto: "Aplica operaciones con números reales (adición, producto, potencias, raíces) y racionalización en expresiones numéricas y algebraicas, utilizando las reglas de exponentes con base natural y exponente entero. Resuelve ejercicios con expresiones algebraicas mediante la simplificación, la reducción de términos semejantes y las operaciones básicas con monomios y polinomios" },
        ],
        saberes: {
          declarativos: [
            "M.4.1.d.1. Conjunto de números enteros (ℤ) y relaciones de orden.",
            "M.4.1.d.2. Propiedades y jerarquía de las operaciones básicas con números enteros.",
            "M.4.1.d.3. Conjunto de los números racionales (ℚ) y sus relaciones de orden.",
            "M.4.1.d.4. Propiedades básicas de las operaciones con números racionales ℚ.",
            "M.4.1.d.5. Conjunto de los números irracionales (𝕀).",
            "M.4.1.d.6. Conjunto de los números reales (R) y relaciones de orden.",
            "M.4.1.d.7. Definición y propiedades de la recta real. Intervalos y semirrectas.",
            "M.4.1.d.10. Expresiones algebraicas.",
            "M.4.1.d.11. Monomios y polinomios.",
          ],
          procedimentales: [
            "M.4.1.p.1. Identificar el cero como punto de referencia ubicando enteros positivos y negativos en la recta numérica.",
            "M.4.1.p.2. Establecer relaciones de orden en un conjunto de números enteros, utilizando la recta numérica y la simbología matemática (=, >, <, ≥, ≤).",
            "M.4.1.p.3. Aplicar las propiedades de la adición y multiplicación en operaciones combinadas con números enteros.",
            "M.4.1.p.4. Realizar operaciones con números enteros respetando la jerarquía.",
            "M.4.1.p.5. Establecer relaciones de orden en un conjunto de números racionales.",
            "M.4.1.p.6. Convertir fracciones a decimales y viceversa. Analizar la expansión decimal de los números para diferenciar los números racionales de los irracionales.",
            "M.4.1.p.8. Aplicar las propiedades de la suma y la multiplicación para resolver operaciones con números racionales.",
            "M.4.1.p.9. Clasificar números racionales e irracionales mediante el análisis de su expresión decimal.",
            "M.4.1.p.10. Reconocer números irracionales específicos (√𝑥, π, e, φ), dentro de fórmulas, teoremas y situaciones del entorno real.",
            "M.4.1.p.11. Representar números reales en la recta numérica.",
            "M.4.1.p.12. Establecer relaciones de orden en un conjunto de números reales, utilizando símbolos de orden (=, >, <, ≥, ≤). Representar intervalos y semirrectas en la recta real mediante notación gráfica.",
            "M.4.1.p.20. Identificar y simplificar expresiones algebraicas sencillas mediante la aplicación de operaciones básicas.",
            "M.4.1.p.21. Identificar y reducir términos semejantes en expresiones algebraicas sencillas.",
            "M.4.1.p.22. Identificar y clasificar monomios, binomios y trinomios según el número de términos.",
            "M.4.1.p.23. Resolver operaciones básicas de adición y sustracción con monomios y polinomios.",
          ],
          actitudinales: [
            "M.4.1.a.1. Demostrar interés por descubrir cómo el conjunto de los números enteros amplia las posibilidades de los números naturales.",
            "M.4.1.a.2. Valorar la importancia del uso correcto de los signos en la representación de situaciones reales.",
            "M.4.1.a.3. Perseverar al realizar operaciones con números enteros.",
            "M.4.1.a.4. Apreciar la importancia de la jerarquía de operaciones al resolver operaciones combinadas con números enteros.",
            "M.4.1.a.5. Mostrar curiosidad por los números racionales e irracionales y su significado.",
            "M.4.1.a.6. Valorar la importancia de la rigurosidad en la ubicación exacta de números racionales en la recta numérica.",
            "M.4.1.a.7. Mostrar apertura ante las distintas formas de representación de un número racional.",
            "M.4.1.a.8. Respetar el orden y la precisión al resolver operaciones combinadas con números racionales.",
            "M.4.1.a.9. Demostrar curiosidad por los números cuyas cifras decimales son infinitas y la belleza de estos en el entorno.",
            "M.4.1.a.10. Valorar la importancia de números irracionales dentro de fórmulas, teoremas y el entorno real.",
            "M.4.1.a.11. Valorar la importancia de ubicar números reales en la recta numérica con precisión y rigor.",
            "M.4.1.a.12. Apreciar la jerarquía numérica y la precisión en la comparación de cantidades de números reales.",
            "M.4.1.a.13. Demostrar curiosidad intelectual ante la propiedad de que la recta real no tiene \"huecos\", valorando la complejidad del infinito dentro de un intervalo acotado.",
            "M.4.1.a.14. Valorar el uso de intervalos y semirrectas para representar situaciones de la vida real (como rangos de edad, límites de velocidad o escalas salariales).",
            "M.4.1.a.15. Mantener una actitud crítica para verificar si una propiedad es aplicable o no a un conjunto numérico específico. Demostrar orden y cuidado al calcular el valor numérico de expresiones algebraicas.",
            "M.4.1.a.20. Valorar la utilidad de las expresiones algebraicas para representar situaciones matemáticas de la vida cotidiana.",
            "M.4.1.a.21. Mostrar interés y confianza al identificar la parte literal y los exponentes en expresiones algebraicas.",
            "M.4.1.a.22. Demostrar orden y responsabilidad al realizar operaciones básicas con monomios y polinomios.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "NOVENO GRADO",
        indicadores: [
          { codigo: "I.M.4.1.4", texto: "Aplica operaciones con números reales (adición, producto, potencias, raíces) y racionalización en expresiones numéricas y algebraicas, utilizando las reglas de exponentes con base natural y exponente entero" },
          { codigo: "I.M.4.1.5", texto: "Emplea las operaciones con polinomios en la solución de ejercicios algebraicos; reconociendo y aplicando productos notables y expresando polinomios como producto de factores (factorización)" },
          { codigo: "I.M.4.1.6", texto: "Resuelve problemas de la vida cotidiana, a través de ecuaciones e inecuaciones de primer grado en ℝ" },
          { codigo: "I.M.4.1.7", texto: "Traduce expresiones simples de lenguaje cotidiano a lenguaje algebraico, identificando coeficientes y variables en el contexto" },
        ],
        saberes: {
          declarativos: [
            "M.4.1.d.8. Propiedades de las operaciones básicas en ℝ.",
            "M.4.1.d.9. Nociones del lenguaje algebraico.",
            "M.4.1.d.10. Expresiones algebraicas.",
            "M.4.1.d.11. Monomios y polinomios.",
            "M.4.1.d.12. Productos notables y factorización.",
            "M.4.1.d.13. Ecuaciones e inecuaciones de primer grado con una incógnita en ℤ, ℚ y ℝ.",
          ],
          procedimentales: [
            "M.4.1.p.14. Identificar intervalos y semirrectas con las soluciones de inecuaciones lineales.",
            "M.4.1.p.15. Aplicar las propiedades de las operaciones con números reales (ℝ) para resolver expresiones numéricas y algebraicas.",
            "M.4.1.p.16. Resolver operaciones con números reales, respetando el orden de prioridad (paréntesis, potencias, productos y sumas).",
            "M.4.1.p.17. Traducir enunciados del lenguaje común al lenguaje algebraico y viceversa.",
            "M.4.1.p.18. Representar relaciones matemáticas mediante el lenguaje algebraico.",
            "M.4.1.p.19. Calcular el valor numérico de expresiones algebraicas.",
            "M.4.1.p.20. Simplificar expresiones algebraicas.",
            "M.4.1.p.21. Reducir términos semejantes en expresiones algebraicas. Identificar y clasificar monomios, binomios y trinomios según el número de términos.",
            "M.4.1.p.23. Resolver operaciones de adición, sustracción, multiplicación y división con monomios y polinomios.",
            "M.4.1.p.24. Realizar la adición y multiplicación por escalar en polinomios de grado ≤ 2.",
            "M.4.1.p.25. Reconocer productos notables.",
            "M.4.1.p.26. Descomponer en factores expresiones algebraicas.",
            "M.4.1.p.27. Resolver ecuaciones e inecuaciones de primer grado con una incógnita en ℤ, ℚ y ℝ.",
            "M.4.1.p.28. Comprobar la validez del valor obtenido en la ecuación original para constatar que se cumple la igualdad.",
          ],
          actitudinales: [
            "M.4.1.a.16. Respetar el orden de prioridad en la resolución de operaciones con números reales.",
            "M.4.1.a.17. Demostrar claridad y precisión al traducir problemas de lenguaje ordinario a lenguaje algebraico.",
            "M.4.1.a.18. Valorar la utilidad del lenguaje algebraico para modelar situaciones cotidianas y científicas.",
            "M.4.1.a.19. Respetar la precisión y orden para obtener el valor numérico correcto de una expresión algebraica.",
            "M.4.1.a.20. Valorar la importancia de las expresiones algebraicas para describir leyes y fenómenos físicos, modelar problemas financieros y programación, etc.",
            "M.4.1.a.21. Demostrar seguridad y rigurosidad en la identificación correcta de la parte literal y sus exponentes antes de reducir términos en expresiones algebraicas.",
            "M.4.1.a.22. Respetar la precisión y el orden al operar con monomios y polinomios.",
            "M.4.1.a.23. Valorar el uso de productos notables como herramientas que simplifican el trabajo algebraico.",
            "M.4.1.a.24. Mostrar flexibilidad cognitiva para probar los diferentes métodos de factorización.",
            "M.4.1.a.25. Demostrar rigor al resolver ecuaciones e inecuaciones de primer grado y comprobar la validez de sus soluciones.",
            "M.4.1.a.26. Demostrar disposición para realizar procedimientos algebraicos con orden y precisión.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "DÉCIMO GRADO",
        indicadores: [
          { codigo: "I.M.4.1.4", texto: "Aplica operaciones con números reales (adición, producto, potencias, raíces) y racionalización en expresiones numéricas y algebraicas, utilizando las reglas de exponentes con base natural y exponente entero" },
          { codigo: "I.M.4.1.5", texto: "Emplea las operaciones con polinomios en la solución de ejercicios algebraicos; reconociendo y aplicando productos notables y expresando polinomios como producto de factores (factorización)" },
          { codigo: "I.M.4.1.6", texto: "Resuelve problemas de la vida cotidiana, a través de ecuaciones e inecuaciones de primer grado en ℝ" },
        ],
        saberes: {
          declarativos: [
            "M.4.1.d.12. Productos notables y factorización.",
            "M.4.1.d.13. Ecuaciones e inecuaciones de primer grado con una incógnita en ℤ, ℚ y ℝ.",
          ],
          procedimentales: [
            "M.4.1.p.25. Identificar y resolver productos notables para simplificar expresiones algebraicas que involucren factorización.",
            "M.4.1.p.26. Descomponer expresiones algebraicas mediante la aplicación y selección del método de factorización más adecuado.",
            "M.4.1.p.27. Resolver ecuaciones e inecuaciones de primer grado con una incógnita en los conjuntos ℤ, ℚ y ℝ, interpretando el conjunto solución y aplicándolo en la resolución de problemas del contexto matemático.",
            "M.4.1.p.28. Comprobar y justificar la validez de las soluciones obtenidas mediante su sustitución en la ecuación original, analizando la coherencia de los resultados en función del problema planteado.",
          ],
          actitudinales: [
            "M.4.1.a.23. Valorar el uso de los productos notables como estrategias eficientes para simplificar expresiones algebraicas, en la resolución de problemas matemáticos.",
            "M.4.1.a.24. Demostrar autonomía y pensamiento crítico al aplicar el método de factorización más adecuado, en los procedimientos matemáticos.",
            "M.4.1.a.25. Demostrar rigor, precisión y pensamiento analítico al resolver ecuaciones e inecuaciones de primer grado, justificando y verificando la validez de las soluciones obtenidas.",
            "M.4.1.a.26. Manifestar responsabilidad, perseverancia y precisión en la ejecución de procedimientos algebraicos, verificando la coherencia y exactitud de los resultados obtenidos.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.M.4.2",
    descripcion: "Reconocer, analizar y utilizar las funciones lineales, en la interpretación de representaciones gráficas y algebraicas, identificando sus propiedades y características con el objetivo de plantear y resolver problemas en contextos reales y valorando el uso de herramientas tecnológicas como apoyo",
    competenciasClave: ["CMCT", "CC", "CD", "CIT", "CECA"],
    porGrado: [
      {
        nivel: "SUPERIOR",
        grado: "OCTAVO GRADO",
        indicadores: [
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
          { codigo: "I.M.4.2.1", texto: "Analiza el dominio, recorrido, monotonía y cortes con los ejes de funciones lineales dadas mediante tablas de valores, representaciones algebraicas y gráficas" },
          { codigo: "I.M.4.2.2", texto: "Interpreta la solución de problemas en contextos reales, mediante representaciones (algebraicas, tablas o gráficas) de funciones lineales" },
          { codigo: "I.M.4.2.3", texto: "Determina el comportamiento (crecimiento o decrecimiento) de las funciones lineales, basándose en su formulación algebraica, tabla de valores o en gráficas" },
        ],
        saberes: {
          declarativos: [
            "M.4.1.d.14. Concepto de función lineal y sus representaciones mediante tablas, expresiones algebraicas y gráficas.",
            "M.4.1.d.15. Concepto de funciones crecientes y decrecientes a partir de su representación gráfica.",
          ],
          procedimentales: [
            "M.4.1.p.29. Reconocer las principales características de las funciones lineales mediante tablas, expresiones algebraicas y representaciones gráficas.",
            "M.4.1.p.30. Representar situaciones sencillas mediante funciones lineales utilizando tablas, expresiones algebraicas y gráficas.",
            "M.4.1.p.31. Identificar si una función lineal es creciente o decreciente a partir de su representación gráfica.",
            "M.4.1.p.32. Representar gráficamente funciones lineales crecientes y decrecientes a partir de tablas de valores.",
          ],
          actitudinales: [
            "M.4.1.a.27. Valorar la utilidad de las representaciones gráficas para comprender e interpretar el comportamiento de las funciones lineales.",
            "M.4.1.a.28. Mostrar una actitud crítica y precisión en el análisis de funciones al determinar los principales elementos, reconociendo su impacto en la graficación de la función. Mostrar una actitud crítica al identificar si una función lineal es creciente o decreciente a partir de su representación gráfica.",
            "M.4.1.a.30. Valorar el uso de la representación gráfica y tecnológica como apoyo para comprender el comportamiento (monotonía) de funciones.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "DÉCIMO GRADO",
        indicadores: [
          { codigo: "I.M.4.2.1", texto: "Analiza el dominio, recorrido, monotonía y cortes con los ejes de funciones lineales dadas mediante tablas de valores, representaciones algebraicas y gráficas" },
          { codigo: "I.M.4.2.3", texto: "Determina el comportamiento (crecimiento o decrecimiento) de las funciones lineales, basándose en su formulación algebraica, tabla de valores o en gráficas" },
          { codigo: "I.M.4.2.4", texto: "Resuelve problemas que involucren sistemas de dos ecuaciones lineales con dos incógnitas utilizando métodos algebraicos y gráficos, y juzgando la validez de las soluciones obtenidas en el contexto del problema" },
          { codigo: "I.M.4.2.5", texto: "Analiza gráficamente la recta como representación de una ecuación lineal y su intersección con otra recta como solución de un sistema de ecuaciones lineales, relacionando formas algebraicas, gráfica y tabulación de funciones" },
          { codigo: "I.M.4.2.6", texto: "Relaciona las representaciones de rectas de forma algebraica, gráfica y tabular con funciones lineales" },
        ],
        saberes: {
          declarativos: [
            "M.4.1.d.14. Definición, características y gráficas de funciones lineales en.",
            "Z.M.4.1.d.15. Funciones crecientes y decrecientes. Sistemas de ecuaciones lineales de 2x2 y sus métodos de resolución.",
            "M.4.1.d.17. Problemas que se resuelven mediante funciones y sistemas de ecuaciones lineales.",
          ],
          procedimentales: [
            "M.4.1.p.30. Elaborar modelos matemáticos sencillos usando funciones lineales para resolver problemas diversos. Analizar el comportamiento de funciones lineales, identificando si son crecientes o decrecientes mediante sus representaciones gráficas.",
            "M.4.1.p.32. Representar gráficamente funciones crecientes y decrecientes, a partir de tablas de valores para observar su comportamiento monótono.",
            "M.4.1.p.33. Determinar la intersección gráfica de dos rectas como solución de un sistema de ecuaciones lineales con dos incógnitas.",
            "M.4.1.p.34. Resolver sistemas de dos ecuaciones lineales con dos incógnitas usando métodos gráficos y algebraicos.",
            "M.4.1.p.35. Resolver problemas que involucren funciones lineales y sistemas de ecuaciones, interpretando y validando las soluciones en su contexto.",
          ],
          actitudinales: [
            "M.4.1.a.27. Valorar la utilidad de las representaciones gráficas como herramientas visuales que permiten anticipar la monotonía y el dominio de una función de manera inmediata.",
            "M.4.1.a.28. Mostrar una actitud crítica y precisión en el análisis de funciones al determinar los principales elementos, reconociendo su impacto en la graficación de la función.",
            "M.4.1.a.29. Mostrar una actitud crítica para identificar con lógica y claridad los intervalos de crecimiento o decrecimiento de una función.",
            "M.4.1.a.30. Valorar el uso de la representación gráfica y tecnológica como apoyo para comprender el comportamiento (monotonía) de funciones.",
            "M.4.1.a.31. Juzgar la validez de la representación gráfica de dos rectas para hallar la solución de un sistema de ecuaciones lineales con dos incógnitas.",
            "M.4.1.a.32. Demostrar confianza al elegir el método algebraico (sustitución, igualación o eliminación) adecuado para resolver sistemas de ecuaciones lineales.",
            "M.4.1.a.33. Asumir con responsabilidad la interpretación crítica de soluciones de problemas contextuales relacionados con funciones y sistemas lineales.",
            "M.4.1.a.34. Demostrar honestidad al verificar la validez de las soluciones y reconocer errores en la resolución de problemas.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.M.4.3",
    descripcion: "Aplicar la teoría de conjuntos para definir y analizar conceptos y propiedades de los conjuntos y la lógica proposicional para resolver problemas con tablas de verdad y silogismos de forma clara y coherente",
    competenciasClave: ["CMCT", "CCICC", "CSE", "CC", "CD", "CIT"],
    porGrado: [
      {
        nivel: "SUPERIOR",
        grado: "OCTAVO GRADO",
        indicadores: [
          { codigo: "I.M.4.3.5", texto: "Representa de forma gráfica y algebraica las operaciones de unión, intersección, diferencia y complemento entre conjuntos para resolver problemas del contexto real, mediante operaciones algebraicas o Diagramas de Venn" },
        ],
        saberes: {
          declarativos: [
            "M.4.1.d.22. Definición de conjunto y sus elementos.",
            "M.4.1.d.23. Operaciones entre conjuntos.",
          ],
          procedimentales: [
            "M.4.1.p.41. Diferenciar los elementos de un conjunto finito descrito por comprensión o por extensión, respetando que el orden no altera el conjunto.",
            "M.4.1.p.42. Realizar operaciones algebraicas con conjuntos, utilizando unión, intersección, diferencia y complemento.",
            "M.4.1.p.43. Representar conjuntos y sus operaciones mediante diagramas de Venn.",
          ],
          actitudinales: [
            "M.4.1.a.39. Promover la tolerancia a la ambigüedad al diferenciar descripciones “por comprensión” (propiedades) de las “por extensión” (listado).",
            "M.4.1.a.40. Valorar el uso de Diagramas de Venn como herramienta visual efectiva para representar y comprender las operaciones con conjuntos.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "NOVENO GRADO",
        indicadores: [
          { codigo: "I.M.4.3.2", texto: "Crea proposiciones lógicas simples y compuestas, asignando valores de verdad, utilizando conectivos (negación, conjunción, disyunción, condicional y bicondicional) y reconociendo su estructura basada en proposiciones simples" },
          { codigo: "I.M.4.3.3", texto: "Determina el valor lógico de proposiciones compuestas, con ayuda de los conectivos lógicos" },
          { codigo: "I.M.4.3.4", texto: "Verifica tautologías, contradicciones y contingencias, utilizando tablas de verdad" },
        ],
        saberes: {
          declarativos: [
            "M.4.1.d.18. Proposiciones lógicas simples.",
            "M.4.1.d.19. Conectivos lógicos: negación, conjunción, disyunción, condicional y bicondicional.",
            "M.4.1.d.20. Proposiciones compuestas.",
            "M.4.1.d.21. Tautologías.",
          ],
          procedimentales: [
            "M.4.1.p.36. Identificar proposiciones simples y asignarles un valor de verdad (verdadero o falso).",
            "M.4.1.p.37. Reconocer los conectivos lógicos básicos (negación, conjunción, disyunción, condicional, bicondicional) en proposiciones y expresarlos en lenguaje simbólico.",
            "M.4.1.p.38. Construir fórmulas lógicas a partir de enunciados en lenguaje cotidiano, utilizando proposiciones simples y conectivos.",
            "M.4.1.p.39. Formar proposiciones compuestas utilizando conectivos lógicos: negación, conjunción, disyunción, condicional y bicondicional.",
            "M.4.1.p.40. Elaborar tablas de verdad para reconocer o verificar tautologías.",
          ],
          actitudinales: [
            "M.4.1.a.34. Valorar la importancia de la aplicación de la lógica proposicional en situaciones cotidianas, identificando afirmaciones que pueden ser verdaderas o falsas. M.4.1.35. Apreciar la importancia de los conectivos básicos (negación, conjunción, disyunción, condicional y bicondicional) para evitar ambigüedades en proposiciones. M.4.1.36. Mostrar curiosidad y rigor al construir fórmulas lógicas a partir de proposiciones simples, identificando conectivos lógicos en contextos reales.",
            "M.4.1.a.37. Valorar la exactitud en el uso de conectivos (negación, conjunción, disyunción, condicional y bicondicional) para formar proposiciones compuestas correctamente.",
            "M.4.1.a.38. Fomentar el respeto por la verdad objetiva en discusiones grupales, aplicando tautologías para modelar inferencias válidas.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.M.4.4",
    descripcion: "Aplicar criterios de congruencia, semejanza, simetría y sus propiedades para construir figuras geométricas y resolver problemas de perímetros y áreas, calculando previamente las longitudes necesarias; y explicando con claridad los procesos y razonamientos utilizados para fundamentar sus soluciones",
    competenciasClave: ["CMCT", "CCICC", "CSE", "CC", "CD", "CIT", "CECA"],
    porGrado: [
      {
        nivel: "SUPERIOR",
        grado: "OCTAVO GRADO",
        indicadores: [
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
          { codigo: "I.M.4.4.1", texto: "Resuelve problemas geométricos que impliquen el cálculo de longitudes en figuras geométricas, mediante la aplicación de conceptos y criterios de congruencia, semejanza, simetría y el teorema de Tales, justificando los procesos y razonamientos utilizados" },
          { codigo: "I.M.4.4.2", texto: "Aplica las proporciones, semejanza y el factor de escala entre figuras semejantes para resolver problemas relacionados con el entorno" },
        ],
        saberes: {
          declarativos: [
            "M.4.2.d.1. Figuras geométricas congruentes y semejantes.",
            "M.4.2.d.2. Factor de escala entre figuras semejantes (teorema de Tales).",
            "M.4.2.d.3. Figuras semejantes.",
          ],
          procedimentales: [
            "M.4.2.p.1. Identificar figuras congruentes y semejantes, según la amplitud de sus ángulos y longitud de sus lados.",
            "M.4.2.p.2. Determinar el factor de escala entre figuras semejantes aplicando el teorema de Tales. Construir figuras semejantes mediante la ampliación o reducción de sus dimensiones.",
          ],
          actitudinales: [
            "M.4.2.a.1. Mostrar curiosidad por identificar figuras congruentes y semejantes, tanto en su entorno como en la naturaleza.",
            "M.4.2.a.2. Valorar la importancia del Teorema de Tales para determinar el factor escala entre figuras semejantes.",
            "M.4.2.a.3. Demostrar rigor y precisión en la construcción de figuras semejantes.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "DÉCIMO GRADO",
        indicadores: [
          { codigo: "I.M.4.4.3", texto: "Aplica los criterios LAL, ALA, LLL para comprobar si dos triángulos son congruentes" },
          { codigo: "I.M.4.4.4", texto: "Calcula medidas desconocidas en triángulos rectángulos, perímetros y áreas de triángulos, utilizando la clasificación de triángulos y comunicando las estrategias utilizadas" },
          { codigo: "I.M.4.4.5", texto: "Distingue las rectas y puntos notables en un triángulo, para calcular perímetro y área en la problemas del contexto real, explicando los procedimientos y estrategias empleados" },
        ],
        saberes: {
          declarativos: [
            "M.4.2.d.4. Congruencia de triángulos.",
            "M.4.2.d.5. Triángulos rectángulos semejantes.",
            "M.4.2.d.6. Perímetro y área de triángulos.",
            "M.4.2.d.7. Elementos notables en triángulos.",
          ],
          procedimentales: [
            "M.4.2.p.4. Aplicar los criterios de congruencia para comprobar si dos triángulos son congruentes.",
            "M.4.2.p.5. Reconocer triángulos rectángulos semejantes.",
            "M.4.2.p.6. Resolver problemas de cálculo de longitudes utilizando semejanza de triángulos.",
            "M.4.2.p.7. Calcular el perímetro y el área de un triángulo utilizando datos dados o deducidos.",
            "M.4.4.p.8. Identificar rectas y puntos notables en un triángulo.",
            "M.4.1.p.9. Dibujar medianas, mediatrices, bisectrices y alturas en un triángulo.",
          ],
          actitudinales: [
            "M.4.2.a.4. Actuar con responsabilidad al aplicar los criterios de congruencia de triángulos.",
            "M.4.2.a.5. Apreciar la exactitud en cálculos de longitudes de triángulos, verificando los resultados.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.M.4.5",
    descripcion: "Aplicar el Teorema de Pitágoras y las relaciones trigonométricas en triángulos rectángulos para calcular longitudes desconocidas, áreas y volúmenes de figuras y cuerpos geométricos, en contextos reales o abstractos, valorando el trabajo en equipo con actitud flexible y crítica",
    competenciasClave: ["CMCT", "CCICC", "CSE", "CC", "CD", "CIT"],
    porGrado: [
      {
        nivel: "SUPERIOR",
        grado: "OCTAVO GRADO",
        indicadores: [
          { codigo: "I.M.4.5.4", texto: "Aplica el cálculo de volúmenes de cuerpos geométricos (pirámides, prismas, conos y cilindros), juzgando la validez de los resultados" },
        ],
        saberes: {
          declarativos: [
            "M.4.2.d.10. Elementos y características de prismas, pirámides, cilindros y conos, y sus superficies.",
            "M.4.2.d.11. Concepto y representación del volumen de prismas, pirámides, cilindros y conos.",
          ],
          procedimentales: [
            "M.4.2.p.12. Identificar y calcular el área de prismas y pirámides sencillas utilizando las fórmulas correspondientes.",
            "M.4.2.p.14. Calcular el volumen de prismas y cilindros mediante la aplicación de sus fórmulas.",
          ],
          actitudinales: [
            "M.4.2.a.10. Demostrar orden y responsabilidad al calcular áreas de cuerpos geométricos utilizando las fórmulas correspondientes.",
            "M.4.2.a.11. Valorar la utilidad de las fórmulas para calcular el volumen de prismas y cilindros en situaciones matemáticas sencillas.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "NOVENO GRADO",
        indicadores: [
          { codigo: "I.M.4.5.1", texto: "Aplica el teorema de Pitágoras para calcular lados desconocidos en triángulos rectángulos y resolver problemas sencillos" },
        ],
        saberes: {
          declarativos: [
            "M.4.2.d.8. Teorema de Pitágoras.",
          ],
          procedimentales: [
            "M.4.2.p.10. Calcular lados desconocidos en triángulos rectángulos, aplicando el teorema de Pitágoras.",
          ],
          actitudinales: [
            "M.4.2.a.8. Valorar la importancia del Teorema de Pitágoras como herramienta para calcular lados desconocidos en triángulos rectángulos.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "DÉCIMO GRADO",
        indicadores: [
          { codigo: "I.M.4.5.1", texto: "Aplica el teorema de Pitágoras para resolver situaciones reales relacionadas con triángulos rectángulos; demostrando creatividad en los procesos empleados y valorando el trabajo individual y grupal" },
          { codigo: "I.M.4.5.2", texto: "Aplica las razones trigonométricas y sus relaciones para resolver triángulos rectángulos y en contextos reales" },
          { codigo: "I.M.4.5.3", texto: "Resuelve problemas geométricos mediante el cálculo de áreas de polígonos regulares y cuerpos geométricos (pirámides, prismas, conos y cilindros), la descomposición en triángulos y juzgando la validez de los resultados" },
          { codigo: "I.M.4.5.4", texto: "Aplica el cálculo de volúmenes de cuerpos geométricos (pirámides, prismas, conos y cilindros), juzgando la validez de los resultados" },
        ],
        saberes: {
          declarativos: [
            "M.4.2.d.8. Teorema de Pitágoras.",
            "M.4.2.d.9. Razones trigonométricas.",
            "M.4.2.d.10. Áreas laterales y totales de cuerpos geométricos: pirámides, prismas, cilindros y conos.",
            "M.4.2.d.11. Volúmenes de cuerpos geométricos: pirámides, prismas, conos y cilindros.",
          ],
          procedimentales: [
            "M.4.2.p.10. Resolver problemas geométricos mediante la aplicación del teorema de Pitágoras para calcular lados desconocidos en triángulos rectángulos.",
            "M.4.2.p.11. Resolver triángulos rectángulos numéricamente, aplicando las razones trigonométricas (seno, coseno, tangente).",
            "M.4.2.p.12. Calcular áreas laterales y totales de pirámides y prismas, aplicando fórmulas específicas.",
            "M.4.2.p.13. Calcular áreas laterales y totales de cilindros y conos, aplicando fórmulas específicas.",
            "M.4.2.p.14. Calcular volúmenes de cuerpos geométricos: pirámides, prismas, conos y cilindros. pirámides, prismas, conos y cilindros mediante las fórmulas correspondientes.",
          ],
          actitudinales: [
            "M.4.2.a.8. Demostrar autonomía, pensamiento crítico y rigor matemático al seleccionar y aplicar el teorema de Pitágoras en la resolución de problemas de triángulos rectángulos, verificando la coherencia de las soluciones obtenidas.",
            "M.4.2.a.9. Reflexionar sobre los errores cometidos al aplicar las razones trigonométricas de forma crítica verificando los resultados en situaciones reales y contextos matemáticos.",
            "M.4.2.a.10. Justificar los procedimientos usados para calcular áreas de cuerpos geométricos con lenguaje claro y representación matemática adecuada.",
            "M.4.2.a.11. Valorar la importancia de la comprensión de las fórmulas para el cálculo de volúmenes de prismas, pirámides, conos y cilindros.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.M.4.6",
    descripcion: "Representar gráficamente la información estadística del entorno, identificando tipos de variables estadísticas, organizándola en tablas de frecuencias mediante herramientas tecnológicas disponibles y aplicando el cálculo de medidas de tendencia central para variable discretas y continuas, para establecer conclusiones fundamentadas con orden y claridad",
    competenciasClave: ["CMCT", "CCICC", "CSE", "CC", "CD", "CIT"],
    porGrado: [
      {
        nivel: "SUPERIOR",
        grado: "OCTAVO GRADO",
        indicadores: [
          { codigo: "I.M.4.6.1", texto: "Identifica variables estadísticas cualitativas y cuantitativas en situaciones sencillas, reconociendo las características de los datos obtenidos" },
          { codigo: "I.M.4.6.2", texto: "Organiza datos estadísticos en tablas de frecuencia simples utilizando información obtenida de situaciones cercanas" },
          { codigo: "I.M.4.6.3", texto: "Registra información estadística sencilla en tablas de frecuencia para facilitar su organización e interpretación" },
          { codigo: "I.M.4.6.4", texto: "Interpreta información presentada en tablas de frecuencia y gráficos estadísticos básicos" },
          { codigo: "I.M.4.6.5", texto: "Describe información estadística representada en tablas o gráficos, comunicando resultados de manera ordenada" },
          { codigo: "I.M.4.6.6", texto: "Representa datos estadísticos mediante gráficos básicos como barras, pictogramas y diagramas circulares, utilizando recursos tecnológicos cuando sea necesario" },
          { codigo: "I.M.4.6.7", texto: "Calcula e interpreta la media, mediana y moda en conjuntos de datos sencillos" },
        ],
        saberes: {
          declarativos: [
            "M.4.3.d.1. Concepto y clasificación básica de datos estadísticos cualitativos y cuantitativos.",
            "M.4.3.d.2. Organización de datos mediante tablas de frecuencia simples.",
            "M.4.3.d.4. Representación de datos mediante gráficos estadísticos básicos (barras, pictogramas y diagramas circulares). (Ref. M.4.3.d.) Concepto y cálculo de medidas de tendencia central: media, mediana y moda en datos sencillos.",
          ],
          procedimentales: [
            "M.4.3.p.1. Identificar y clasificar variables estadísticas cualitativas y cuantitativas en situaciones sencillas.",
            "M.4.3.p.2. Organizar datos estadísticos en tablas de frecuencia simples.",
            "M.4.3.p.3. Elaborar tablas de frecuencia con datos sencillos utilizando frecuencia absoluta.",
            "M.4.3.p.4. Interpretar información básica presentada en tablas de frecuencia.",
            "M.4.3.p.5. Representar datos estadísticos mediante gráficos básicos como barras, pictogramas y diagramas circulares.",
            "M.4.3.p.6. Calcular e interpretar la media, mediana y moda en conjuntos de datos sencillos.",
          ],
          actitudinales: [
            "M.4.3.a.1. Mostrar interés por reconocer y clasificar diferentes tipos de variables estadísticas en situaciones sencillas.",
            "M.4.3.a.2. Demostrar orden y responsabilidad al organizar datos en tablas de frecuencia.",
            "M.4.3.a.3. Valorar el uso de herramientas tecnológicas para representar datos estadísticos de manera sencilla.",
            "M.4.3.a.4. Mostrar interés y responsabilidad al interpretar medidas de tendencia central en conjuntos de datos sencillos.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "NOVENO GRADO",
        indicadores: [
          { codigo: "I.M.4.6.3", texto: "Organiza información estadística mediante tablas de frecuencia, incorporando datos agrupados en intervalos para facilitar su análisis e interpretación" },
          { codigo: "I.M.4.6.4", texto: "Interpreta información estadística representada en tablas de frecuencia y gráficos estadísticos como histogramas, polígonos de frecuencia y diagramas circulares, identificando características relevantes de los datos" },
          { codigo: "I.M.4.6.5", texto: "Analiza información estadística presentada en tablas y gráficos, relacionando los resultados obtenidos y comunicando conclusiones de manera clara y ordenada" },
          { codigo: "I.M.4.6.6", texto: "Representa datos estadísticos mediante gráficos adecuados según el tipo de información, utilizando herramientas tecnológicas para organizar y presentar los resultados" },
          { codigo: "I.M.4.6.7", texto: "Calcula e interpreta medidas de tendencia central (media, mediana y moda) en datos agrupados y no agrupados, relacionando los resultados con la información analizada" },
        ],
        saberes: {
          declarativos: [
            "M.4.3.d.1. Variables estadísticas cualitativas y cuantitativas, clasificación y análisis según el tipo de información recolectada.",
            "M.4.3.d.2. Tablas de distribución de frecuencias para datos agrupados y no agrupados. Representación de datos estadísticos mediante histogramas, polígonos de frecuencia y diagramas circulares.",
            "M.4.3.d.4. Medidas de tendencia central (media, mediana, moda) con datos agrupados y no agrupados.",
          ],
          procedimentales: [
            "M.4.3.p.1. Clasificar variables estadísticas cualitativas y cuantitativas según las características de los datos obtenidos.",
            "M.4.3.p.2. Organizar datos estadísticos en tablas de frecuencia para facilitar su análisis e interpretación.",
            "M.4.3.p.3. Construir tablas de distribución de frecuencias: absoluta, absoluta acumulada, relativa y relativa acumulada para datos agrupados y no agrupados.",
            "M.4.3.p.4. Analizar información dada en tablas de frecuencias. Representar datos estadísticos mediante gráficos como histogramas, diagramas circulares y polígonos de frecuencia utilizando las TIC cuando sea necesario.",
            "M.4.3.p.6. Calcular medidas de tendencia central para interpretar conjuntos de datos (agrupados y no agrupados) en problemas reales.",
          ],
          actitudinales: [
            "M.4.3.a.1. Demostrar interés y responsabilidad al clasificar variables estadísticas según las características de la información obtenida.",
            "M.4.3.a.2. Valorar la importancia del orden y precisión en la elaboración e interpretación de tablas de distribución de frecuencias.",
            "M.4.3.a.3. Reconocer la utilidad de las herramientas tecnológicas para representar e interpretar datos estadísticos de manera adecuada.",
            "M.4.3.a.4. Demostrar responsabilidad y criterio al interpretar medidas de tendencia central en diferentes conjuntos de datos.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "DÉCIMO GRADO",
        indicadores: [
          { codigo: "I.M.4.6.1", texto: "Clasifica variables cualitativas (nominales, ordinales) y cuantitativas (discretas, continuas) en diferentes conjuntos de datos para seleccionar las medidas estadísticas apropiadas según el tipo de variable y valorando la importancia de identificar correctamente las variables para un análisis estadístico preciso" },
          { codigo: "I.M.4.6.2", texto: "Construye tablas de frecuencias absoluta, absoluta acumulada, relativa y relativa acumulada para datos agrupados y no agrupados" },
          { codigo: "I.M.4.6.3", texto: "Organiza información estadística cuantificable del entorno en tablas de frecuencias absoluta, absoluta acumulada, relativa y relativa acumulada para datos agrupados y no agrupados" },
          { codigo: "I.M.4.6.4", texto: "Interpreta datos agrupados y no agrupados, representados en tablas de distribución de frecuencias y en gráficas estadísticas (histogramas, polígono de frecuencias, ojiva y/o diagramas circulares)" },
          { codigo: "I.M.4.6.5", texto: "Analiza información dada en tablas de frecuencias o gráficos, verificando la coherencia entre diferentes representaciones de los mismos datos y comunicando los resultados estadísticos con claridad y orden" },
          { codigo: "I.M.4.6.6", texto: "Representa datos estadísticos en gráficos, según la naturaleza de los datos, de forma clara y precisa, valorando el uso de las TIC" },
          { codigo: "I.M.4.6.7", texto: "Calcula medidas de tendencia central (media, mediana y moda) de información cuantificable del entorno, interpretando los resultados obtenidos" },
        ],
        saberes: {
          declarativos: [
            "M.4.3.d.2. Tablas de distribución de frecuencias para datos agrupados y no agrupados.",
            "M.4.3.d.3. Gráficos estadísticos: histogramas, polígono de frecuencias, ojiva y/o diagramas circulares.",
            "M.4.3.d.4. Medidas de tendencia central (media, mediana, moda) con datos agrupados y no agrupados.",
          ],
          procedimentales: [
            "M.4.3.p.2. Organizar datos procesados en tablas de frecuencias.",
            "M.4.3.p.3. Construir tablas de distribución de frecuencias: absoluta, absoluta acumulada, relativa y relativa acumulada para datos agrupados y no agrupados.",
            "M.4.3.p.4. Analizar información dada en tablas de frecuencias.",
            "M.4.3.p.5. Representar datos procesados mediante gráficos estadísticos y con apoyo de las.",
            "TIC.M.4.3.p.6. Calcular medidas de tendencia central para interpretar conjuntos de datos (agrupados y no agrupados) en problemas reales.",
          ],
          actitudinales: [
            "M.4.3.a.1. Mostrar curiosidad por los tipos y subtipos de variables estadísticas en un estudio estadístico para un análisis preciso.",
            "M.4.3.a.2. Mantener una actitud crítica y responsable en la construcción y análisis de tablas de frecuencias para comprender la información.",
            "M.4.3.p.3. Valorar el uso de tecnologías para representar y analizar datos estadísticos de forma clara y precisa.",
            "M.4.3.a.4. Mantener una actitud crítica y responsable al interpretar medidas de tendencia central en contextos reales.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.M.4.8",
    descripcion: "Aplicar funciones lineales y propiedades de los exponentes, cálculo de interés simple y compuesto, y análisis de datos estadísticos económicos para evaluar alternativas de ahorro e inversión, gestionar riesgos financieros básicos, elaborar planes financieros personales o comerciales y desarrollar competencias de análisis cuantitativo aplicado a decisiones económicas en situaciones financieras básicas",
    competenciasClave: ["CMCT", "CC", "CD", "CCICC", "CIT"],
    porGrado: [
      {
        nivel: "SUPERIOR",
        grado: "OCTAVO GRADO",
        indicadores: [
          { codigo: "I.M.4.8.2", texto: "Analiza datos económicos familiares aplicando estadística descriptiva (media, mediana, moda, frecuencias, etc.)," },
        ],
        saberes: {
          declarativos: [
            "M.4.4.d.3. Estadística aplicada: análisis de gastos personales, familiares y comunitarios y tendencias.",
          ],
          procedimentales: [
            "M.4.4.p.3. Analizar datos familiares y comunitarios de ingresos y gastos usando estadística descriptiva.",
          ],
          actitudinales: [
            "M.4.4.a.2. Valorar la planificación matemática en decisiones financieras.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "NOVENO GRADO",
        indicadores: [
          { codigo: "I.M.4.8.1", texto: "Aplica fórmulas de interés simple y compuesto para comparar alternativas financieras básicas y modelar situaciones de ahorro e inversión" },
        ],
        saberes: {
          declarativos: [
            "M.4.4.d.1. Interés simple e interés compuesto: diferencias y aplicaciones.",
          ],
          procedimentales: [
            "M.4.4.p.1. Aplicar fórmulas de interés simple e interés compuesto en cálculos prácticos.",
          ],
          actitudinales: [
            "M.4.4.a.1. Mostrar rigor y precisión al aplicar las fórmulas de interés simple y compuesto, reconociendo su impacto en decisiones personales de ahorro e inversión.",
            "M.4.4.a.3. Mantener una actitud analítica ante propuestas financieras.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "DÉCIMO GRADO",
        indicadores: [
          { codigo: "I.M.4.8.3", texto: "Elabora planes financieros personales con metas a mediano plazo, mediante el análisis de datos económicos familiares y la aplicación herramientas tecnológicas para cálculos y proyecciones" },
          { codigo: "I.M.4.8.4", texto: "Diseña estrategias de recuperación ante crisis financieras familiares, identificando los riesgos financieros básicos" },
        ],
        saberes: {
          declarativos: [
            "M.4.4.d.2. Función lineal aplicada a planes de ahorro constante.",
            "M.4.4.d.4. Gestión de crisis financieras personales y familiares.",
            "M.4.4.d.5. Impacto social y ambiental en decisiones de consumo e inversión.",
          ],
          procedimentales: [
            "M.4.4.p.2. Modelar situaciones de ahorro usando funciones lineales.",
            "M.4.4.p.4. Elaborar planes financieros personales con objetivos a 1-2 años.",
            "M.4.4.p.5. Diseñar estrategias de recuperación ante crisis financieras familiares.",
            "M.4.4.p.6. Evaluar inversiones considerando criterios sociales y ambientales básicos.",
          ],
          actitudinales: [
            "M.4.4.a.4. Demostrar responsabilidad al identificar oportunamente señales de crisis financieras en el ámbito personal y familiar, priorizando soluciones éticas y sostenibles.",
            "M.4.4.a.5. Demostrar compromiso con decisiones financieras socialmente responsables.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.M.4.7",
    descripcion: "Aplicar técnicas de conteo en el cálculo de probabilidades, comprendiendo su utilidad en situaciones y contextos reales",
    competenciasClave: ["CMCT", "CCICC", "CSE", "CC", "CD", "CIT"],
    porGrado: [
      {
        nivel: "SUPERIOR",
        grado: "DÉCIMO GRADO",
        indicadores: [
          { codigo: "I.M.4.7.1", texto: "Calcula probabilidades de eventos aleatorios empleando combinaciones y permutaciones y el factorial de un número, valorando las diferentes estrategias que se pueden aplicar y explicando con claridad el proceso lógico seguido para la resolución de problemas" },
          { codigo: "I.M.4.7.2", texto: "Determina la probabilidad empírica de eventos mediante la realización de experimentos y el análisis de frecuencias relativas" },
          { codigo: "I.M.4.7.3", texto: "Reconoce la independencia entre experimentos estadísticos, comprendiendo los conceptos de azar, espacio muestral y eventos en contextos reales" },
          { codigo: "I.M.4.7.4", texto: "Aplica principios básicos de conteo (principio multiplicativo y aditivo) en la resolución de problemas, demostrando rigor y comprensión del azar y persevera y presta atención al detalle en la aplicación de métodos de conteo" },
        ],
        saberes: {
          declarativos: [
            "M.4.3.d.5. Probabilidad de eventos aleatorios y factorial de un número.",
            "M.4.3.d.6. Conceptos de probabilidad empírica, azar, eventos y experimentos independientes.",
            "M.4.3.d.7. Principios básicos de conteo: combinaciones y permutaciones.",
          ],
          procedimentales: [
            "M.4.3.p.7. Calcular probabilidades de eventos aleatorios empleando combinaciones y permutaciones y el factorial de un número.",
            "M.4.3.p.8. Determinar la probabilidad empírica de eventos y experimentos independientes. Identificar situaciones de eventos independientes en experimentos aleatorios sencillos.",
            "M.4.3.p.10. Aplicar combinaciones y permutaciones en el conteo para resolver problemas de probabilidad.",
          ],
          actitudinales: [
            "M.4.3.a.5. Valorar la importancia de emplear factoriales, combinaciones y permutaciones para evitar errores en el cálculo de probabilidades.",
            "M.4.3.a.6. Demostrar rigor en el manejo de la probabilidad y comprensión del azar en experimentos.",
            "M.4.3.a.7. Perseverar y prestar atención al detalle en la aplicación de métodos de conteo para resolver problemas de probabilidad.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.M.5.1",
    descripcion: "Aplicar ecuaciones lineales y cuadráticas, y sistemas de ecuaciones de hasta tres incógnitas; mediante modelos algebraicos y matriciales, operaciones con matrices y determinantes, en la resolución de problemas en diferentes contextos, valorando el lenguaje algebraico y matricial como herramientas organizativas, optimizando procedimientos de manera lógica y crítica, garantizando la validez y expresando con claridad las soluciones obtenidas",
    competenciasClave: ["CMCT", "CC", "CD", "CIT", "CSE"],
    porGrado: [
      {
        nivel: "BACHILLERATO",
        grado: "PRIMER CURSO",
        indicadores: [
          { codigo: "I.M.5.1.1", texto: "Aplica ecuaciones de primer grado con valor absoluto para modelar y solucionar situaciones del entorno en diferentes contextos" },
          { codigo: "I.M.5.1.2", texto: "Aplica la resolución de sistemas de ecuaciones lineales mxm y mxn con diferentes tipos de soluciones empleando varios métodos, para modelar y solucionar problemas de la vida cotidiana, juzgando la validez de las soluciones obtenidas" },
        ],
        saberes: {
          declarativos: [
            "M.5.1.d.1. * Ecuaciones de primer grado con valor absoluto.",
            "M.5.1.d.2. ) * Sistemas de tres ecuaciones lineales con tres incógnitas.",
          ],
          procedimentales: [
            "M.5.1.p.1. * Reconocer la ecuación de la forma ∣ax+b∣=c.",
            "M.5.1.p.2. * Resolver una ecuación de primer grado con valor absoluto.",
            "M.5.1.p.3. * Resolver sistemas de tres ecuaciones lineales de 3×2.",
            "M.5.1.p.4. Resolver sistemas de ecuaciones de 3×3.",
          ],
          actitudinales: [
            "M.5.1.a.1. * Valorar la importancia del lenguaje algebraico.",
            "M.5.1.a.2. * Demostrar precisión en los procedimientos algebraicos.",
            "M.5.1.a.3. * Valorar el uso de las TIC para representar sistemas de ecuaciones lineales.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "SEGUNDO CURSO",
        indicadores: [
          { codigo: "I.M.5.1.3", texto: "Aplica modelos cuadráticos para solucionar problemas reales o hipotéticos de optimización, utilizando las TIC" },
          { codigo: "I.M.5.1.4", texto: "Aplica la resolución de sistemas de ecuaciones, para calcular la intersección entre una recta y una parábola, o entre dos parábolas" },
        ],
        saberes: {
          declarativos: [
            "M.5.1.d.4. * Ecuaciones reducibles a la forma cuadrática.",
            "M.5.1.d.5. * Sistemas de ecuaciones de una recta y una parábola.",
            "M.5.1.d.6. Sistemas de dos ecuaciones de segundo grado.",
          ],
          procedimentales: [
            "M.5.1.p.5. * Resolver ecuaciones que se reducen a un modelo cuadrático.",
            "M.5.1.p.6. * Resolver sistemas de dos ecuaciones: lineal y cuadrática.",
            "M.5.1.p.7. * Resolver sistemas de dos ecuaciones cuadráticas.",
            "M.5.1.p.8. Resolver sistemas de dos ecuaciones cuadráticas.",
          ],
          actitudinales: [
            "M.5.1.a.4. * Asumir con responsabilidad los errores en el proceso de reducción de una ecuación a la forma cuadrática.",
            "M.5.1.a.5. * Demostrar pensamiento crítico para identificar el conjunto de soluciones factibles con rigor y precisión.",
            "M.5.1.a.6. * Valorar la optimización como una herramienta para la toma de decisiones.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "TERCER CURSO",
        indicadores: [
          { codigo: "I.M.5.1.5", texto: "Opera con matrices de hasta tercer orden, analizando sus elementos y tipos de matrices" },
          { codigo: "I.M.5.1.6", texto: "Aplica el determinante y el método de la matriz inversa para resolver sistemas de ecuaciones" },
        ],
        saberes: {
          declarativos: [
            "M.5.1.d.7. * Matrices Mnxn [R] y matrices especiales.",
            "M.5.1.d.8. * Definición , propiedades y operaciones con matrices: (adición, producto, multiplicación por un escalar y potencias).",
            "M.5.1.d.9. * Matrices Mmxn y sus condiciones para operar.",
            "M.5.1.d.10. * Determinantes de matrices reales cuadradas de orden 2 y 3.",
            "M.5.1.d.11. Matriz inversa (A−1) con el método de Gauss.",
          ],
          procedimentales: [
            "M.5.1.p.9. * Análizar los elementos de las matrices M_(n×n).",
            "M.5.1.p.10. * Realizar operaciones con matrices M_(2×2) [R].",
            "M.5.1.p.11. * Realizar operaciones entre matrices de orden m×n.",
            "M.5.1.p.12. * Cálcular determinantes de matrices reales cuadradas de orden 2 y 3.",
            "M.5.1.p.13. * Cálcular la matriz inversa de una matriz cuadrada.",
          ],
          actitudinales: [
            "M.5.1.a.7. Apreciar la utilidad de las operaciones matriciales como herramientas para organizar información y resolver problemas de la vida cotidiana o de otras ciencias.",
            "M.5.1.a.8. Valorar la precisión y el orden en la aplicación de métodos para garantizar la exactitud en el cálculo de determinantes.",
            "M.5.1.a.9. Asumir una actitud crítica y reflexiva al verificar la validez de los resultados obtenidos (comprobando que A.A-1=1).",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.M.5.2",
    descripcion: "Resolver problemas contextualizados mediante el uso de inecuaciones lineales con valor absoluto y sistemas de inecuaciones con dos incógnitas, aplicando técnicas de programación lineal que incluyan la representación gráfica, la identificación de regiones de factibilidad y el cálculo de soluciones óptimas, con rigor lógico y sentido crítico hacia la toma de decisiones",
    competenciasClave: ["CMCT", "CC", "CD", "CSE"],
    porGrado: [
      {
        nivel: "BACHILLERATO",
        grado: "PRIMER CURSO",
        indicadores: [
          { codigo: "I.M.5.2.1", texto: "Halla la solución de una inecuación de primer grado, con valor absoluto, expresando su respuesta en intervalos y de forma gráfica en la recta numérica" },
        ],
        saberes: {
          declarativos: [
            "M.5.1.d.12. * Propiedades de orden de los números reales.",
            "M.5.1.d.13. * Inecuaciones lineales con valor absoluto.",
            "M.5.1.d.14. * Sistema de inecuaciones lineales.",
            "M.5.1.d.15. * Teoría de conjuntos aplicada a intervalos reales: propiedades de la unión, intersección, diferencia y complemento.",
          ],
          procedimentales: [
            "M.5.1.p.14. * Aplicar las propiedades de orden de los números reales para resolver inecuaciones lineales con valor absoluto.",
            "M.5.1.p.15. * Resolver inecuaciones lineales con una incógnita y valor absoluto.",
            "M.5.1.p.16. * Resolver sistemas de inecuaciones lineales de forma gráfica y analítica, aplicando las operaciones con intervalos.",
          ],
          actitudinales: [
            "M.5.1.a.11. * Actuar con sentido crítico en la validación de las soluciones de inecuaciones.",
            "M.5.1.a.12. * Perseverar para resolver sistemas de inecuaciones lineales.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "SEGUNDO CURSO",
        indicadores: [
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
        nivel: "BACHILLERATO",
        grado: "TERCER CURSO",
        indicadores: [
          { codigo: "I.M.5.2.2", texto: "Resuelve sistemas de inecuaciones, utilizando el método gráfico y analítico, para determinar el conjunto de soluciones factibles y la solución óptima de problemas de programación lineal" },
        ],
        saberes: {
          declarativos: [
            "M.5.1.d.16. Fundamentos de programación lineal.",
          ],
          procedimentales: [
            "M.5.1.p.17. Resolver problemas de programación lineal mediante la representación gráfica de inecuaciones, la determinación de los puntos extremos de la región de soluciones factibles y el hallazgo de la solución óptima.",
          ],
          actitudinales: [
            "M.5.1.a.13. Valorar la optimización como una herramienta para la toma de decisiones.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.M.5.3",
    descripcion: "Modelar y resolver problemas contextualizados mediante el uso de funciones reales, lineales, cuadráticas, polinomiales, exponenciales, logarítmicas y trigonométricas; analizando sus características, operaciones y representaciones gráficas con el apoyo de las TIC y realizando una discusión crítica de la validez de los procedimientos aplicados, interpretación de sus resultados y valoración de la funcionalidad de los modelos matemáticos en diversas temáticas",
    competenciasClave: ["CMCT", "CC", "CD", "CIT", "CSE"],
    porGrado: [
      {
        nivel: "BACHILLERATO",
        grado: "PRIMER CURSO",
        indicadores: [
          { codigo: "I.M.5.3.1", texto: "Resuelve problemas reales o hipotéticos del entorno cotidiano, mediante el análisis de las características, propiedades, operaciones y representaciones gráficas de funciones reales (afines, potencias, raíz cuadrada, valor absoluto), con el apoyo de las TIC y valorando la efectividad de los procedimientos aplicados" },
          { codigo: "I.M.5.3.2", texto: "Reconoce si una función es inyectiva, sobreyectiva o biyectiva, analizando la relación entre los elementos de un conjunto de origen (dominio) con los de llegada (condominio)" },
          { codigo: "I.M.5.3.3", texto: "Realiza operaciones con funciones aplicando las propiedades de los números reales en problemas reales e hipotéticos" },
          { codigo: "I.M.5.3.4", texto: "Resuelve problemas del entorno, utilizando modelos cuadráticos, mediante la identificación y cálculo del vértice, intersecciones con los ejes, dominio, rango y monotonía, para representar la función cuadrática mediante el uso de las TIC" },
        ],
        saberes: {
          declarativos: [
            "M.5.1.d.17. * Características y análisis de funciones reales específicas.",
            "M.5.1.d.18. * Funcion inyectiva, Biyectivia, sobreyectiva de funciones y función inversa.",
            "M.5.1.d.19. * Adición y producto entre funciones reales, y producto de números reales por funciones reales.",
          ],
          procedimentales: [
            "M.5.1.p.18. * Analizar las características de las funciones reales específicas para representar e interpretar su comportamiento gráfico.",
            "M.5.1.p.19. * Reconocer funciones inyectivas, sobreyectivas, biyectivas e inversas mediante el análisis de sus propiedades algebraicas y gráficas.",
            "M.5.1.p.20. * Analizar las propiedades de las funciones inyectivas, sobreyectivas, biyectivas e inversas para establecer relaciones entre dominio, codominio e imagen.",
            "M.5.1.p.21. * Realizar operaciones de adición, producto, composición y multiplicación de funciones por escalares para resolver situaciones matemáticas.",
          ],
          actitudinales: [
            "M.5.1.a.1. * Reconocer la utilidad de las funciones reales para representar situaciones del entorno.",
            "M.5.1.a.15. * Justificar, mediante procedimientos algebraicos y gráficos, la clasificación de una función.",
            "M.5.1.a.16. * Aplica responsablemente las propiedades algebraicas en las operaciones entre funciones, analizando y validando los procedimientos y resultados obtenidos.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "SEGUNDO CURSO",
        indicadores: [
          { codigo: "I.M.5.3.5", texto: "Resuelve problemas contextualizados, identificando las funciones polinomiales de grado n , realizando las operaciones con funciones polinomiales de grado ≤4 y racionales de grado ≤3, así como las ecuaciones de las asíntotas, para discutir la validez y coherencia de sus resultados" },
          { codigo: "I.M.5.3.6", texto: "Halla gráfica y analíticamente el dominio, recorrido, monotonía, periodicidad, desplazamientos, máximos y mínimos de funciones trigonométricas para modelar movimientos circulares y comportamientos de fenómenos naturales, y discute su pertinencia; emplea la tecnología para corroborar sus resultados" },
          { codigo: "I.M.5.3.7", texto: "Resuelve situaciones reales o hipotéticas modeladas mediante funciones logarítmicas, a partir del reconocimiento de su relación inversa con la función exponencial, el análisis de sus elementos esenciales (dominio, recorrido, asíntotas e intersecciones) y la validación de resultados con y sin apoyo de la tecnología" },
        ],
        saberes: {
          declarativos: [
            "M.5.1.d.20. * Función racional y sus características. (.",
            "M.5.1.d.21. * Adición y multiplicación entre funciones racionales.",
            "M.5.1.d.22. * Características de las funciones trigonométricas.",
            "M.5.1.d.23. * Características de las funciones exponenciales.",
            "M.5.1.d.24. * Función logarítmica como inversa de la función exponencial.",
            "M.5.1.d.25. * Propiedades de los logaritmos.",
            "M.5.1.d.26. * Modelos matemáticos que usan funciones exponenciales y logarítmicas.",
          ],
          procedimentales: [
            "M.5.1.p.22. * Determinar las características de las funciones racionales mediante el análisis de su dominio, recorrido, asíntotas y representación gráfica.",
            "M.5.1.p.23. * Simplificar funciones racionales aplicando procedimientos algebraicos para facilitar su análisis y resolución de problemas.",
            "M.5.1.p.24. * Evaluar el comportamiento de funciones trigonométricas, a través del análisis de sus características y su representación gráfica mediante el uso de TIC.",
            "M.5.1.p.25. ) * Evaluar el comportamiento de la función logarítmica como inversa de la función exponencial mediante el análisis de sus propiedades y representación gráfica.",
            "M.5.1.p.27. * Aplicar las propiedades de exponentes y logaritmos para resolver ecuaciones.",
            "M.5.1.p.28. * Resolver problemas del entorno utilizando modelos basados en funciones exponenciales y logarítmicas para interpretar situaciones reales.",
          ],
          actitudinales: [
            "M.5.1.a.17. * Analizar con precisión el dominio, rango, asíntotas, interceptos y discontinuidades de las funciones racionales.",
            "M.5.1.a.18. * Desarrollar procedimientos algebraicos ordenados y precisos, verificando cada paso para prevenir errores de cálculo y de signos.",
            "M.5.1.a.19. * Interpretar el período, amplitud, dominio, rango y comportamiento de las funciones trigonométricas.",
            "M.5.1.a.20. * Identificar dominio, rango, asíntotas, crecimiento y decrecimiento de la función.",
            "M.5.1.a.21. * Valora la función logarítmica como herramienta para modelar y resolver problemas, reconociendo su relación inversa con la función exponencial.",
            "M.5.1.a.22. Mostrar disposición crítica al interpretar la pertinencia de un modelo funcional y sus resultados.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "TERCER CURSO",
        indicadores: [
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
    codigo: "CE.M.5.4",
    descripcion: "Aplicar los patrones en sucesiones numéricas, monótonas, definidas por recurrencia, progresiones aritméticas y geométricas en la resolución de problemas reales o hipotéticos en contextos académicos o económicos, para interpretar resultados financieros, promoviendo el pensamiento lógico, la responsabilidad y la valoración del conocimiento matemático en la toma de decisiones",
    competenciasClave: ["CMCT", "CC", "CD", "CIT", "CSE"],
    porGrado: [
      {
        nivel: "BACHILLERATO",
        grado: "PRIMER CURSO",
        indicadores: [
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
        nivel: "BACHILLERATO",
        grado: "SEGUNDO CURSO",
        indicadores: [
          { codigo: "I.M.5.4.1", texto: "Identifica las sucesiones numéricas según sus características" },
          { codigo: "I.M.5.4.2", texto: "Calcula los parámetros desconocidos en progresiones aritméticas y geométricas" },
          { codigo: "I.M.5.4.3", texto: "Aplica progresiones aritméticas y geométricas en situaciones cotidianas, apreciando la importancia de estos conocimientos para la toma de decisiones en el Sistema financiero local" },
        ],
        saberes: {
          declarativos: [
            "M.5.1.d.27. * Sucesiones numéricas reales.",
            "M.5.1.d.28. * Patrones y regularidades en sucesiones numéricas.",
            "M.5.1.d.29. * Progresiones aritméticas.",
            "M.5.1.d.30. Progresiones geométricas.",
          ],
          procedimentales: [
            "M.5.1.p.29. * Identificar sucesiones numéricas reales, distinguiendo las monótonas y las definidas por recurrencia mediante diferentes representaciones.",
            "M.5.1.p.30. * Analizar patrones numéricos para determinar la regla de formación y deducir la fórmula general de una sucesión.",
            "M.5.1.p.31. * Aplicar las fórmulas del término general y de la suma de progresiones aritméticas para resolver e interpretar problemas contextualizados.",
            "M.5.1.p.32. * Determinar términos desconocidos de progresiones aritméticas mediante procedimientos algebraicos y verificar la validez de los resultados.",
            "M.5.1.p.33. * Aplicar las fórmulas del término general y de la suma de progresiones geométricas para resolver situaciones del contexto e interpretar sus resultados.",
            "M.5.1.p.34. * Calcular términos desconocidos de progresiones geométricas utilizando procedimientos algebraicos y comprobar la coherencia de las soluciones.",
          ],
          actitudinales: [
            "M.5.1.a.23. * Valorar las sucesiones numéricas como herramientas para analizar situaciones y fundamentar la toma de decisiones en diferentes contextos.",
            "M.5.1.a.24. * Manifestar curiosidad e iniciativa para identificar patrones, formular conjeturas y descubrir regularidades en secuencias numéricas.",
            "M.5.1.a.25. * Aplicar con rigor las fórmulas de progresiones aritméticas y geométricas, verificando procedimientos y argumentando las estrategias empleadas.",
            "M.5.1.a.26. * Valorar las progresiones geométricas como modelos para interpretar y predecir fenómenos de crecimiento en contextos científicos, financieros y sociales.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "TERCER CURSO",
        indicadores: [
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
    codigo: "CE.M.5.5",
    descripcion: "Aplicar el álgebra de límites como base para el desarrollo del cálculo diferencial e integral, interpretación de la derivada desde un enfoque geométrico y físico para resolver problemas de áreas y optimización, mediante procedimientos analíticos y gráficos, valorando la utilidad del cálculo en la comprensión de fenómenos reales y la toma de decisiones fundamentadas",
    competenciasClave: ["CMCT", "CC", "CD", "CIT", "CSE"],
    porGrado: [
      {
        nivel: "BACHILLERATO",
        grado: "PRIMER CURSO",
        indicadores: [
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
        nivel: "BACHILLERATO",
        grado: "SEGUNDO CURSO",
        indicadores: [
          { codigo: "I.M.5.5.1", texto: "Calcula límites de funciones reales, identificando casos convergentes, divergentes e indeterminaciones y verificando los resultados obtenidos mediante representaciones gráficas" },
          { codigo: "I.M.5.5.2", texto: "Calcula la derivada de una función a partir del cociente incremental, aplicando las reglas de derivación en funciones polinomiales de grado ≤ 4 y mostrando precisión en los procedimientos" },
          { codigo: "I.M.5.5.3", texto: "Interpreta geométrica y físicamente la derivada como pendiente de la recta tangente a la curva y la tasa de cambio instantánea, explicando su relación con fenómenos de movimiento y variación" },
        ],
        saberes: {
          declarativos: [
            "M.5.1.d.31. * Límites de funciones reales.",
            "M.5.1.d.32. * Concepto de derivada.",
            "M.5.1.d.33. * Derivadas de funciones polinomiales.",
            "M.5.1.d.34. * Propiedades y reglas de derivación.",
            "M.5.1.d.35. * Aplicaciones e interpretación de la derivada.",
          ],
          procedimentales: [
            "M.5.1.p.35. * Calcular límites de funciones reales aplicando propiedades algebraicas e interpreta el comportamiento de las funciones en torno a un punto.",
            "M.5.1.p.36. * Determinar la derivada de una función mediante el cociente incremental y el concepto de límite, verificando los procedimientos realizados.",
            "M.5.1.p.37. * Calcular la derivada de funciones polinomiales de hasta cuarto grado aplicando correctamente las reglas de derivación.",
            "M.5.1.p.38. * Aplicar las propiedades de la derivada y la regla de la cadena para resolver funciones polinomiales compuestas, justificando los procedimientos empleados.",
            "M.5.1.p.39. * Interpretar la derivada desde una perspectiva geométrica y física para analizar la razón de cambio y resolver problemas contextualizados.",
          ],
          actitudinales: [
            "M.5.1.a.27. * Valorar el cálculo como una herramienta para modelar, interpretar y analizar fenómenos de cambio en contextos matemáticos y del entorno.",
            "M.5.1.a.28. * Mostrar con rigurosidad, precisión y perseverancia al aplicar límites, derivadas e integrales, verificando y justificando los procedimientos empleados.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "TERCER CURSO",
        indicadores: [
          { codigo: "I.M.5.5.4", texto: "Calcula integrales indefinidas y definidas de funciones polinomiales, aplicando propiedades y verificando los resultados mediante derivación inversa o uso de herramientas tecnológicas" },
          { codigo: "I.M.5.5.5", texto: "Aplica la integral definida para determinar el área bajo la curva en problemas geométricos o de contexto real, representando y analizando gráficamente los resultados obtenidos" },
        ],
        saberes: {
          declarativos: [
            "M.5.1.d.36. * Integral indefinida y definida.",
            "M.5.1.d.37. * Aplicaciones e interpretación de la integral definida.",
          ],
          procedimentales: [
            "M.5.1.p.40. * Calcular integrales definidas e indefinidas aplicando las propiedades básicas de integración y verificando los resultados obtenidos.",
            "M.5.1.p.41. * Utilizar la integral definida para calcular e interpretar el área bajo la curva en situaciones matemáticas y contextualizadas.",
          ],
          actitudinales: [
            "M.5.1.a.29. * Manifiesta curiosidad por comprender la interpretación geométrica y física de la derivada y la integral, relacionándolas con situaciones reales.",
            "M.5.1.a.30. * Demuestra iniciativa para aplicar el cálculo en la resolución de problemas de optimización, proponiendo estrategias y fundamentando sus decisiones matemáticas.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.M.5.6",
    descripcion: "Resolver y representar situaciones geométricas en contextos matemáticos, físicos y tecnológicos, aplicando con perseverancia y rigor, las propiedades de los vectores, sus operaciones y las distintas formas de ecuación de la recta (vectorial, paramétrica y cartesiana) para modelar situaciones reales con rectas y cónicas, a través de métodos analíticos y gráficos, con o sin soporte tecnológico e interpretando y comunicando los resultados obtenidos con el lenguaje matemático adecuado",
    competenciasClave: ["CMCT", "CC", "CD", "CIT", "CSE"],
    porGrado: [
      {
        nivel: "BACHILLERATO",
        grado: "PRIMER CURSO",
        indicadores: [
          { codigo: "I.M.5.6.1", texto: "Representa gráficamente vectores en el plano cartesiano, a partir de sus componentes o puntos inicial y final" },
          { codigo: "I.M.5.6.2", texto: "Resuelve problemas de contextos reales que requieran el cálculo del módulo de un vector y de las operaciones de suma, resta y producto por un escalar, tanto de forma analítica como gráfica" },
        ],
        saberes: {
          declarativos: [
            "M.5.2.d.1. * Vectores en el plano.",
            "M.5.2.d.2. * Operaciones con vectores.",
            "M.5.2.d.3. * Producto escalar y norma de un vector.",
            "M.5.2.d.4. Relaciones entre vectores.",
          ],
          procedimentales: [
            "M.5.2.p.1. * Representar e interpretar vectores en el plano cartesiano, identificando sus características y componentes.",
            "M.5.2.p.2. * Realizar operaciones vectoriales mediante procedimientos geométricos y analíticos, interpretando sus resultados.",
            "M.5.2.p.3. * Calcular el producto escalar, la norma de un vector y la distancia entre dos puntos para resolver problemas geométricos.",
            "M.5.2.p.4. Determinar relaciones de paralelismo y perpendicularidad entre vectores mediante criterios algebraicos y geométricos.",
          ],
          actitudinales: [
            "M.5.2.a.1. * Valorar el uso del lenguaje vectorial para describir, representar e interpretar la posición y el movimiento de vectores en el plano.",
            "M.5.2.a.2. * Demostrar interés por aplicar las operaciones vectoriales en la resolución de problemas geométricos y situaciones del entorno.",
            "M.5.2.a.3. * Actuar con rigor y precisión al representar e interpretar vectores mediante procedimientos geométricos y analíticos.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "SEGUNDO CURSO",
        indicadores: [
          { codigo: "I.M.5.6.3", texto: "Aplica el cálculo de la distancia entre dos puntos, el módulo y la dirección de un vector y las condiciones de paralelismo y perpendicularidad entre vectores, en el espacio vectorial R, con o sin el apoyo de las TIC" },
          { codigo: "I.M.5.6.4", texto: "Determina la ecuación vectorial y paramétrica de una recta a partir de elementos dados, valorando sus aplicaciones reales y la validez de los resultados" },
        ],
        saberes: {
          declarativos: [
            "M.5.2.d.5. Ecuaciones vectoriales y paramétricas de la recta.",
            "M.5.2.d.7. Posición relativa de dos rectas en ℝ² (paralelas, secantes y perpendiculares).",
          ],
          procedimentales: [
            "M.5.2.p.5. * Determinar y representar las ecuaciones vectorial y paramétrica de una recta utilizando sus elementos característicos.",
            "M.5.2.p.6. * Calcular la pendiente y determinar las diferentes ecuaciones de la recta para modelar y resolver problemas en el plano cartesiano.",
            "M.5.2.p.7. * Determinar la posición relativa de dos rectas mediante el análisis algebraico y gráfico de sus ecuaciones.",
          ],
          actitudinales: [
            "M.5.2.a.4. Manifestar rigurosidad y perseverancia al resolver problemas relacionados con vectores y ecuaciones de la recta, verificando la validez de los procedimientos.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "TERCER CURSO",
        indicadores: [
          { codigo: "I.M.5.6.5", texto: "Calcula la pendiente de una recta y la posición relativa entre dos rectas en el plano o el espacio, valorando sus aplicaciones reales, la validez de los resultados y el aporte de las TIC" },
          { codigo: "I.M.5.6.6", texto: "Grafica las ecuaciones cartesianas de las cónicas (circunferencia, parábola, elipse, hipérbola), determinando sus elementos característicos para aplicarlas a problemas del contexto con o sin apoyo de las TIC" },
        ],
        saberes: {
          declarativos: [
            "M.5.2.d.8. Ecuaciones cartesianas de cónicas (circunferencia, parábola, elipse, hipérbola) con centro en y fuera del origen.",
          ],
          procedimentales: [
            "M.5.2.p.8. Identificar, determinar y representar las ecuaciones cartesianas y los elementos geométricos de las cónicas para resolver problemas del contexto.",
          ],
          actitudinales: [
            "M.5.2.a.5. Manifestar rigurosidad y perseverancia al resolver problemas relacionados con las cónicas, verificando la validez de los procedimientos y resultados.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.M.5.7",
    descripcion: "Aplicar la estadística descriptiva para la organización, resumen, representación e interpretación de datos agrupados y no agrupados, mediante el uso de medidas de dispersión y de posición con el apoyo de TIC y valorando su uso para la toma de decisiones informadas en contextos reales",
    competenciasClave: ["CMCT", "CC", "CD", "CIT", "CSE"],
    porGrado: [
      {
        nivel: "BACHILLERATO",
        grado: "PRIMER CURSO",
        indicadores: [
          { codigo: "I.M.5.7.1", texto: "Calcula, con y sin apoyo de las TIC, las medidas de dispersión, para datos agrupados y no agrupados y las interpreta juzgando su validez" },
        ],
        saberes: {
          declarativos: [
            "M.5.3.d.1. Medidas de dispersión para datos agrupados y no agrupados: rango, desviación media, varianza y desviación estándar en variables continuas.",
          ],
          procedimentales: [
            "M.5.3.p.1. * Calcular medidas de dispersión (rango, desviación media, varianza y desviación estándar) para datos agrupados, aplicando procedimientos estadísticos adecuados.",
            "M.5.3.p.2. * Interpretar representaciones gráficas de medidas de dispersión para analizar la variabilidad y comportamiento de conjuntos de datos agrupados.",
          ],
          actitudinales: [
            "M.5.3.a.1. * Valorar el análisis estadístico como una herramienta para interpretar información y comprender fenómenos de la realidad.",
            "M.5.3.a.2. * Demostrar responsabilidad en la obtención, organización e interpretación de resultados estadísticos, reconociendo la importancia de la precisión de los datos.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "SEGUNDO CURSO",
        indicadores: [
          { codigo: "I.M.5.7.2", texto: "Calcula medidas de posición para datos agrupados y no agrupados y los interpreta juzgando su validez" },
        ],
        saberes: {
          declarativos: [
            "M.5.3.d.2. Medidas de posición para datos agrupados y no agrupados: cuartiles, deciles y percentiles.",
          ],
          procedimentales: [
          ],
          actitudinales: [
            "M.5.3.a.3. * Manifestar una actitud crítica al analizar la representatividad y pertinencia de las diferentes medidas estadísticas en diversos contextos.",
            "M.5.3.a.4. * Mostrar disposición proactiva para explorar, analizar e interpretar datos, identificando patrones y significados relevantes.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "TERCER CURSO",
        indicadores: [
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
    codigo: "CE.M.5.8",
    descripcion: "Resolver problemas de conteo, probabilidad e inferencia estadística en contextos reales e hipotéticos, mediante el uso de técnicas combinatorias, variables aleatorias, distribuciones de probabilidad (con énfasis en la binomial) y el análisis de la covarianza; con o sin el apoyo de TIC. Contrastar procedimientos, realizando la interpretación y discusión crítica de sus resultados y valorando la incertidumbre y la estadística inferencial como herramientas fundamentales para la comprensión y el análisis de fenómenos en la vida personal, académica y social",
    competenciasClave: ["CMCT", "CC", "CD", "CIT", "CSE"],
    porGrado: [
      {
        nivel: "BACHILLERATO",
        grado: "PRIMER CURSO",
        indicadores: [
          { codigo: "I.M.5.8.1", texto: "Aplica técnicas combinatorias (permutaciones, combinaciones y variaciones) en problemas de contextos reales o hipotéticos, identificando los eventos del problema, seleccionando las técnicas de conteo adecuadas, según las restricciones del problema" },
          { codigo: "I.M.5.8.2", texto: "Aplica las variables aleatorias discretas y la distribución binomial en situaciones de incertidumbre en ámbitos personales, académicos o sociales, calculando sus parámetros fundamentales y probabilidades con o sin el apoyo de las TIC" },
        ],
        saberes: {
          declarativos: [
            "M.5.3.d.3. * Experimento aleatorio, espacio muestral, suceso o evento, tipos de eventos y axiomas fundamentales de la probabilidad.",
            "M.5.3.d.6. * Principios de conteo, permutaciones, combinaciones y variaciones para determinar la cantidad de eventos simples y compuestos.",
          ],
          procedimentales: [
            "M.5.3.p.4. * Aplicar el concepto de probabilidad y sus axiomas para resolver e interpretar problemas relacionados con eventos aleatorios en diferentes contextos.",
            "M.5.3.p.7. * Aplicar técnicas de conteo, mediante permutaciones, combinaciones y variaciones, para resolver problemas de eventos simples y compuestos.",
          ],
          actitudinales: [
            "M.5.3.a.5. * Valorar el análisis de probabilidades como una herramienta para comprender, explicar y tomar decisiones frente a fenómenos del mundo real.",
            "M.5.3.a.6. * Reconocer la probabilidad como un lenguaje matemático para describir, interpretar y analizar situaciones de incertidumbre.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "SEGUNDO CURSO",
        indicadores: [
          { codigo: "I.M.5.8.3", texto: "Analiza la relación bidimensional entre variables cuantitativas mediante el cálculo e interpretación de la covarianza y el coeficiente de correlación, contrastando la fuerza y el sentido de la asociación lineal en fenómenos cotidianos o científicos" },
          { codigo: "I.M.5.8.4", texto: "Resuelve problemas del entorno aplicando el experimento de Bernoulli y la distribución binomial para el cálculo de probabilidades" },
        ],
        saberes: {
          declarativos: [
            "M.5.3.d.4. Concepto de variable aleatoria discreta, distribución de probabilidad, función de probabilidad y representación de sus valores.",
            "M.5.3.d.5. Valor esperado o esperanza matemática como medida de tendencia de una variable aleatoria y sus aplicaciones.",
          ],
          procedimentales: [
            "M.5.3.p.5. Plantear la función de probabilidad de una variable aleatoria discreta a partir del análisis de situaciones reales o hipotéticas.",
            "M.5.3.p.6. Calcular el valor esperado de variables aleatorias discretas para interpretar y analizar resultados en diferentes contextos.",
          ],
          actitudinales: [
            "M.5.3.a.7. Manifestar una actitud crítica al analizar e interpretar afirmaciones sustentadas en probabilidades y datos estadísticos.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "TERCER CURSO",
        indicadores: [
          { codigo: "I.M.5.8.5", texto: "Representa gráficamente distribuciones de probabilidad discretas mediante el uso de las TIC" },
          { codigo: "I.M.5.8.6", texto: "Calcula el coeficiente de correlación para interpretar si dicha relación es nula, débil, moderada, fuerte o perfecta" },
        ],
        saberes: {
          declarativos: [
            "M.5.3.d.7. Características de la distribución binomial, fórmula, parámetros, media, varianza y aplicaciones en situaciones probabilísticas.",
            "M.5.3.d.8. Covarianza entre variables aleatorias, dependencia lineal, interpretación y análisis de relaciones estadísticas.",
          ],
          procedimentales: [
            "M.5.3.p.8. Calcular probabilidades binomiales, la media y la varianza de una distribución binomial, representando e interpretando sus resultados gráficamente.",
            "M.5.3.p.9. Calcular la covarianza entre dos variables aleatorias para analizar la relación existente entre ellas.",
            "M.5.3.p.10. Interpretar la covarianza para determinar la existencia, el sentido y la intensidad de la dependencia lineal entre dos variables aleatorias.",
          ],
          actitudinales: [
            "M.5.3.a.8. Mantener curiosidad intelectual para modelar fenómenos aleatorios del entorno mediante herramientas probabilísticas y estadísticas.",
          ],
        },
      },
    ],
  },
];

export function buscarCompetenciaMatematica(codigo: string): CompetenciaEspecificaCompleta | undefined {
  return COMPETENCIAS_MATEMATICA.find((c) => c.codigo === codigo);
}
