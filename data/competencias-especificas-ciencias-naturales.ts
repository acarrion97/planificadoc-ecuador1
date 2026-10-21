/**
 * Catálogo de Competencias Específicas — Currículo Integrado
 * Fuente: MESOCURRICULUM / "4. Ciencias Naturales.xlsx" (Matriz de distribución/desagregación
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

export const COMPETENCIAS_CIENCIAS_NATURALES: CompetenciaEspecificaCompleta[] = [
  {
    codigo: "CE.CN.2.1",
    descripcion: "Analizar los ciclos de vida del ser humano, animales (incluidos insectos con metamorfosis) y plantas mediante la observación directa, la experimentación sencilla y el uso de registros científicos para reconocer el cambio temporal como característica común de los seres vivos y aplicar este conocimiento en el cuidado responsable de sí mismo, de otros seres vivos y de su entorno",
    competenciasClave: ["CC", "CMCT", "CD", "CSE", "CCICC", "CIT"],
    porGrado: [
      {
        nivel: "ELEMENTAL",
        grado: "SEGUNDO GRADO",
        indicadores: [
          { codigo: "I.CN.2.1.1", texto: "Explica los ciclos de vida del ser humano, animales, identificando sus etapas de nacimiento, crecimiento, reproducción y muerte, con apoyo de dibujos y lenguaje sencillo" },
          { codigo: "I.CN.2.1.3", texto: "Valora el ciclo de vida humano, estableciendo relaciones con otros seres vivos, reconociendo el paso del tiempo y los cambios que se producen desde la infancia hasta la vejez como procesos naturales que requieren cuidado, respeto y responsabilidad" },
        ],
        saberes: {
          declarativos: [
            "CN.2.1.d.1. Ciclo vital de los seres humanos (nacimiento, crecimiento, reproducción y muerte), y las etapas asociadas al paso del tiempo.",
            "CN.2.1.d.2. Ciclo vital en animales representativos del entorno, considerando sus características biológicas.",
          ],
          procedimentales: [
            "CN.2.1.p.4. Observar de manera guiada los cambios en seres vivos en diferentes etapas de su ciclo de vida. Elaborar registros científicos mediante dibujos detallados y la construcción de líneas de tiempo ilustradas para representar, describir y comparar las diferentes etapas del ciclo de vida de seres humanos y animales, a partir de observaciones directas y sistemáticas.",
            "CN.2.1.p.5. Representar gráficamente los cambios del ser humano a lo largo de su ciclo vital, estableciendo relaciones con otros seres vivos.",
            "CN.2.1.p.6. Comunicar hallazgos mediante exposiciones orales, esquemas o producciones gráficas basadas en evidencias de observación.",
          ],
          actitudinales: [
            "CN.2.1.a.1. Valorar el ciclo de vida de los seres vivos como un proceso natural que implica cambio y crecimiento.",
            "CN.2.1.a.2. Mostrar curiosidad e interés por observar y comprender los cambios en animales y en sí mismo.",
            "CN.2.1.a.4. Reconocer el paso del tiempo y los cambios en el ser humano como parte natural del crecimiento, promoviendo el autocuidado y la aceptación.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "TERCER GRADO",
        indicadores: [
          { codigo: "I.CN.2.1.1", texto: "Explica los ciclos de vida de animales (insectos con metamorfosis) y plantas, , identificando sus etapas de nacimiento, crecimiento, reproducción y muerte y reconociniendo semejanzas y diferencias en función del tiempo y las características biológicas" },
          { codigo: "I.CN.2.1.2", texto: "Comunica de manera sistemática, utilizando dibujos científicos detallados, cuadernos de campo y líneas de tiempo ilustradas, los cambios observados en germinación de plantas y ciclos de insectos, valorando la importancia del cuidado de los seres vivos" },
          { codigo: "I.CN.2.1.3", texto: "Valora el ciclo de vida humano, estableciendo relaciones con otros seres vivos y reconociendo el paso del tiempo y los cambios desde la infancia hasta la vejez como procesos naturales que requieren cuidado, respeto y responsabilidad" },
        ],
        saberes: {
          declarativos: [
            "CN.2.1.d.3. Ciclo vital de las plantas (semilla, germinación, crecimiento, reproducción, polinización y dispersión).",
            "CN.2.1.d.4. Ciclo de vida de insectos con metamorfosis (mariposa, escarabajo, libélula) como evidencia de transformación en los seres vivos.",
          ],
          procedimentales: [
            "CN.2.1.p.1. Observar de manera guiada los cambios en seres vivos (plantas e insectos) en diferentes etapas de su ciclo de vida.",
            "CN.2.1.p.2. Germinar semillas en condiciones controladas y registrar sistemáticamente los cambios observados.",
            "CN.2.1.p.3. Utilizar instrumentos de observación (lupas simples o binoculares) para identificar características y cambios en plantas e insectos. Elaborar registros científicos mediante dibujos detallados y la construcción de líneas de tiempo ilustradas para representar, describir y comparar las diferentes etapas del ciclo de vida de insectos y plantas, a partir de observaciones directas y sistemáticas.",
            "CN.2.1.p.6. Comunicar hallazgos mediante exposiciones orales, esquemas o producciones gráficas basadas en evidencias de observación.",
          ],
          actitudinales: [
            "CN.2.1.a.1. Valorar el ciclo de vida de los seres vivos como un proceso natural que implica cambio, crecimiento y en algunos casos transformación.",
            "CN.2.1.a.2. Mostrar curiosidad e interés por observar y comprender los cambios en plantas, animales y en sí mismo.",
            "CN.2.1.a.3. Mostrar curiosidad por conocer la flora y fauna de su entorno cercano.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.CN.2.2",
    descripcion: "Reconocer la diversidad de plantas y animales del entorno y del Ecuador, mediante la observación, clasificación, comparación y uso de herramientas simples de registro, identificando sus características, funciones, hábitat y usos, para explicar sus relaciones con los ecosistemas, la vida de las personas y las tradiciones culturales, y participar con responsabilidad y respeto en acciones de cuidado y conservación de la biodiversidad",
    competenciasClave: ["CMCT", "CC", "CD", "CCICC", "CIT", "CSE"],
    porGrado: [
      {
        nivel: "ELEMENTAL",
        grado: "SEGUNDO GRADO",
        indicadores: [
          { codigo: "I.CN.2.2.1", texto: "Reconoce las partes de la planta y sus funciones" },
          { codigo: "I.CN.2.2.2", texto: "Reconoce animales de su entorno y los relaciona con su funcionalidad y con los beneficios o usos que aportan a las personas" },
          { codigo: "I.CN.2.2.4", texto: "Participa de manera activa y responsable en acciones de cuidado de plantas y animales en su entorno, demostrando respeto por los seres vivos" },
        ],
        saberes: {
          declarativos: [
            "CN.2.1.d.6. Funciones de los animales en la vida de las personas (alimentación, compañía, protección).",
            "CN.2.1.d.8. Partes principales de una planta y su función.",
          ],
          procedimentales: [
            "CN.2.1.p.9. Identificar las partes de una planta y relacionarlas con su función.",
            "CN.2.1.p.12. Observar plantas y animales del entorno mediante salidas de campo, visitas guiadas o recursos visuales, registrando sus características a través de dibujos científicos básicos o fichas de observación.",
            "CN.2.1.p.16. Explorar entornos locales para observar cómo los hábitats sostienen la vida de animales y plantas.",
          ],
          actitudinales: [
            "CN.2.1.a.5. Cuidar de manera responsable las plantas del entorno escolar, familiar o comunitario.",
            "CN.2.1.a.6. Reconocer el valor de los animales y las plantas y asume compromisos de cuidado y protección.",
            "CN.2.1.a.7. Mantener una actitud de respeto hacia todos los seres vivos, especialmente insectos y plantas, como parte del equilibrio de los ecosistemas.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "TERCER GRADO",
        indicadores: [
          { codigo: "I.CN.2.2.1", texto: "Clasifica las plantas de su entorno, reconociendo sus partes y funciones, y las clasifica según características visibles (tipo de hojas, semillas, estrato y uso), utilizando registros como dibujos o herbarios para explicar su importancia para las personas y los ecosistemas. Reconoce animales de su entorno clasificándolos en vertebrados relacionándolos con su funcionalidad ecológica (polinizadores, dispersores, controladores)" },
          { codigo: "I.CN.2.2.4", texto: "Participa de manera activa y responsable en acciones de cuidado de plantas y animales en su entorno, demostrando respeto por los seres vivos" },
        ],
        saberes: {
          declarativos: [
            "CN.2.1.d.6. Funciones de los animales en los ecosistemas (polinización, dispersión de semillas, control de poblaciones).",
            "CN.2.1.d.8. Partes principales de una planta y su función; clasificación según tipo de hojas (herbáceas, arbustos, árboles; perennes y caducas) y su papel en los ecosistemas.",
            "CN.2.1.d.10. Clasificación de plantas según su estrato (arbóreo, arbustivo, herbáceo) y su uso (alimenticio, medicinal, ornamental y otros).",
            "CN.2.1.d.7. Características básicas de los vertebrados (mamíferos, aves, reptiles, anfibios y peces) y su relación con el hábitat donde viven.",
          ],
          procedimentales: [
            "CN.2.1.p.10. Elaborar herbarios sencillos para clasificar hojas y relacionarlas con su función y tipo de planta, inspirados en el trabajo de Misael Acosta Solís. Utilizar claves dicotómicas simples para identificar plantas y animales del entorno.",
            "CN.2.1.p.8. Agrupar a los animales vertebrados según criterios simples (tipo de cuerpo, hábitat, forma de desplazamiento).",
            "CN.2.1.p.12. Observar plantas del entorno mediante salidas de campo, visitas guiadas o recursos visuales, registrando sus características a través de dibujos científicos básicos o fichas de observación.",
          ],
          actitudinales: [
            "CN.2.1.a.5. Cuidar de manera responsable las plantas del entorno escolar, familiar o comunitario.",
            "CN.2.1.a.6. Reconocer el valor de los animales y las plantas y asume compromisos de cuidado y protección.",
            "CN.2.1.a.7. Mantener una actitud de respeto hacia todos los seres vivos, especialmente insectos y plantas, como parte del equilibrio de los ecosistemas.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "CUARTO GRADO",
        indicadores: [
          { codigo: "I.CN.2.2.2", texto: "Reconoce animales de su entorno clasificándolos en vertebrados o invertebrados y relacionándolos con su funcionalidad ecológica (polinizadores, dispersores, controladores) y con los beneficios o usos que aportan a las personas" },
          { codigo: "I.CN.2.2.3", texto: "Reconoce especies nativas, endémicas e introducidas del Ecuador, así como plantas y animales vinculados a las tradiciones culturales, valorando su importancia para la identidad y biodiversidad" },
          { codigo: "I.CN.2.2.4", texto: "Participa de manera activa y responsable en acciones de cuidado de plantas y animales en su entorno, demostrando respeto por los seres vivos y por los saberes y prácticas culturales asociadas a la biodiversidad" },
        ],
        saberes: {
          declarativos: [
            "CN.2.1.d.5. Características observables que permiten distinguir animales vertebrados e invertebrados (presencia de columna vertebral, tipo de cuerpo, cubierta corporal).",
            "CN.2.1.d.9. Diferencias entre especies nativas, endémicas e introducidas del Ecuador.",
            "CN.2.1.d.11. Plantas y animales representativos vinculados a la cultura, tradiciones y saberes ancestrales de los pueblos del Ecuador.",
          ],
          procedimentales: [
            "CN.2.1.p.7. Clasificar los animales en vertebrados e invertebrados a partir de sus características visibles.",
            "CN.2.1.p.11. Utilizar claves dicotómicas simples para identificar plantas y animales del entorno, especialmente insectos.",
            "CN.2.1.p.12. Observar plantas y animales del entorno mediante salidas de campo, visitas guiadas o recursos visuales, registrando sus características a través de dibujos científicos básicos o fichas de observación.",
          ],
          actitudinales: [
            "CN.2.1.a.5. Cuidar de manera responsable las plantas del entorno escolar, familiar o comunitario.",
            "CN.2.1.a.6. Reconocer el valor de los animales y las plantas y asume compromisos de cuidado y protección.",
            "CN.2.1.a.7. Mantener una actitud de respeto hacia todos los seres vivos, especialmente insectos y plantas, como parte del equilibrio de los ecosistemas.",
            "CN.2.1.a.8. Valorar los saberes, prácticas y tradiciones culturales relacionadas con el uso y cuidado de plantas y animales en el Ecuador.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.CN.2.3",
    descripcion: "Analizar la diversidad de los seres vivos y las características de los hábitats de las regiones naturales del Ecuador, comprendiendo sus interrelaciones, las amenazas que los afectan y las respuestas de los organismos, para proponer y participar en acciones de conservación, mediante la observación, comparación y registro de información del entorno, demostrando respeto y compromiso con la biodiversidad",
    competenciasClave: ["CMCT", "CC", "CCICC", "CIT"],
    porGrado: [
      {
        nivel: "ELEMENTAL",
        grado: "SEGUNDO GRADO",
        indicadores: [
          { codigo: "I.CN.2.3.1", texto: "Compara plantas y animales de su entorno y identificando características de sus hábitats" },
          { codigo: "I.CN.2.3.2", texto: "Identifica amenazas que afectan los hábitats" },
          { codigo: "I.CN.2.3.3", texto: "Propone acciones sencillas de conservación de especies de los hábitats locales" },
        ],
        saberes: {
          declarativos: [
            "CN.2.1.d.12. Características de los hábitats locales.",
            "CN.2.1.d.18. Acciones de cuidado y protección hacia la diversidad de los seres vivos y hábitats.",
          ],
          procedimentales: [
            "CN.2.3.p.13. Registrar las características de plantas y animales del entorno, relacionándolas con su hábitat mediante dibujos o esquemas simples.",
            "CN.2.3.p.15. Identificar situaciones de riesgo para los hábitats y proponer acciones sencillas de conservación en su entorno escolar o familiar.",
          ],
          actitudinales: [
            "CN.2.1.a.9. Practicar el cuidado y respeto por las especies, los hábitats y la biodiversidad del Ecuador, reconociendo su valor natural.",
            "CN.2.1.a.10. Valorar las acciones humanas que contribuyen a la conservación de las especies y asume compromisos para la protección de los seres vivos y su entorno.",
            "CN.2.1.a.11. Proponer acciones sencillas de conservación y solución de problemas ambientales en su entorno escolar o comunitario.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "TERCER GRADO",
        indicadores: [
          { codigo: "I.CN.2.3.1", texto: "Compara plantas y animales de su entorno y de las regiones del Ecuador, identificando características de sus hábitats" },
          { codigo: "I.CN.2.3.2", texto: "Identifica amenazas que afectan los hábitats y describe las reacciones de los seres vivos frente a estos cambios, explicando sus consecuencias sobre la biodiversidad" },
          { codigo: "I.CN.2.3.3", texto: "Propone y participa en acciones sencillas de conservación de especies y ecosistemas, demostrando responsabilidad, respeto y valoración de la biodiversidad y la diversidad cultural" },
        ],
        saberes: {
          declarativos: [
            "CN.2.1.d.12. Características de los hábitats locales y de las regiones naturales del Ecuador.",
            "CN.2.1.d.14. Diversidad de animales y plantas terrestres y acuáticos, nativos y/o endémicos del Ecuador.",
            "CN.2.1.d.17. Reacciones de los seres vivos ante los cambios y amenazas en sus hábitats.",
            "CN.2.1.d.18. Acciones de cuidado y protección hacia la diversidad de los seres vivos y hábitats.",
          ],
          procedimentales: [
            "CN.2.3.p.14. Comparar a los seres vivos de las diferentes regiones del Ecuador identificando sus reacciones en función del ambiente donde viven.",
            "CN.2.1.p.16. Explorar entornos locales para observar cómo los hábitats sostienen la vida de animales y plantas.",
            "CN.2.3.p.15. Identificar situaciones de riesgo para los hábitats y proponer acciones sencillas de conservación en su entorno escolar o familiar.",
          ],
          actitudinales: [
            "CN.2.1.a.9. Practicar el cuidado y respeto por las especies, los hábitats y la biodiversidad del Ecuador, reconociendo su valor natural.",
            "CN.2.1.a.10. Valorar las acciones humanas que contribuyen a la conservación de las especies y asume compromisos para la protección de los seres vivos y su entorno.",
            "CN.2.1.a.11. Proponer acciones sencillas de conservación y solución de problemas ambientales en su entorno escolar o comunitario.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "CUARTO GRADO",
        indicadores: [
          { codigo: "I.CN.2.3.1", texto: "Compara plantas y animales de su entorno y de las regiones del Ecuador, identificando características de sus hábitats" },
          { codigo: "I.CN.2.3.2", texto: "Identifica amenazas que afectan los hábitats y describe las reacciones de los seres vivos frente a estos cambios, explicando sus consecuencias sobre la biodiversidad" },
          { codigo: "I.CN.2.3.3", texto: "Propone y participa en acciones sencillas de conservación de especies y ecosistemas, demostrando responsabilidad, respeto y valoración de la biodiversidad y la diversidad cultural" },
        ],
        saberes: {
          declarativos: [
            "CN.2.1.d.13. Diversidad de animales vertebrados de las regiones naturales del Ecuador.",
            "CN.2.1.d.15. Diversidad de plantas con semilla de las regiones naturales del Ecuador.",
            "CN.2.1.d.16. Amenazas que afectan los hábitats locales y sus consecuencias.",
            "CN.2.1.d.17. Reacciones de los seres vivos ante los cambios y amenazas en sus hábitats.",
            "CN.2.1.d.18. Acciones de cuidado y protección hacia la diversidad de los seres vivos y hábitats.",
          ],
          procedimentales: [
            "CN.2.3.p.15. Identificar situaciones de riesgo para los hábitats y proponer acciones sencillas de conservación en su entorno escolar o familiar.",
            "CN.2.1.p.16. Explorar entornos locales para observar cómo los hábitats sostienen la vida de animales y plantas.",
          ],
          actitudinales: [
            "CN.2.1.a.9. Practicar el cuidado y respeto por las especies, los hábitats y la biodiversidad del Ecuador, reconociendo su valor natural.",
            "CN.2.1.a.10. Valorar las acciones humanas que contribuyen a la conservación de las especies y asume compromisos para la protección de los seres vivos y su entorno.",
            "CN.2.1.a.11. Proponer acciones sencillas de conservación y solución de problemas ambientales en su entorno escolar o comunitario.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.CN.2.4",
    descripcion: "Promover el cuidado personal mediante la comprensión de los órganos y sistemas del cuerpo, así como de la importancia de una alimentación equilibrada, la actividad física, el descanso, la higiene y el uso responsable de pantallas, a través de prácticas y decisiones cotidianas que evidencien autonomía y respeto hacia sí mismo, los demás y el entorno",
    competenciasClave: ["CMCT", "CC", "CD", "CCICC", "CIT"],
    porGrado: [
      {
        nivel: "ELEMENTAL",
        grado: "SEGUNDO GRADO",
        indicadores: [
          { codigo: "I.CN.2.4.1", texto: "Explica la función básica de órganos (cerebro, corazón, pulmones, estómago), y los representa gráficamente o a través de maquetas, relacionando sus funciones con el cuidado de la salud" },
          { codigo: "I.CN.2.4.3", texto: "Aplica hábitos de higiene, actividad física y descanso en su vida cotidiana, participando en actividades individuales y grupales que promueven el bienestar físico y emocional, registrando sus prácticas y demostrando responsabilidad, autonomía, respeto y convivencia saludable" },
        ],
        saberes: {
          declarativos: [
            "CN.2.2.d.1. Ubicación y funciones básicas del cerebro, corazón, pulmones y estómago.",
            "CN.2.2.d.3. Función de la respiración y de los órganos de los sentidos en la relación con el entorno.",
            "CN.2.2.d.5. Normas básicas de higiene personal y alimentaria para la prevención de enfermedades.",
          ],
          procedimentales: [
            "CN.2.2.p.1. Representar los órganos del cuerpo humano mediante dibujos, esquemas o maquetas, explicando sus funciones básicas.",
            "CN.2.2.p.2. Observar y analizar prácticas de higiene en el manejo de alimentos en contextos cercanos o mediante recursos visuales.",
            "CN.2.2.p.4. Practicar técnicas básicas de respiración, relajación y expresión de emociones para su bienestar.",
            "CN.2.2.p.5. Participar en actividades cooperativas que promuevan el respeto, la convivencia y la resolución pacífica de conflictos.",
          ],
          actitudinales: [
            "CN.2.2.a.1. Practicar hábitos de cuidado personal mediante la actividad física, la higiene.",
            "CN.2.2.a.3. Reconocer y respetar su identidad personal, su cuerpo y el de los demás, valorando los saberes culturales, familiares y ancestrales.",
            "CN.2.2.a.4. Demostrar actitudes de cooperación, respeto y convivencia pacífica, participando de manera responsable en acciones que promueven el bienestar común y el cuidado del entorno.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "TERCER GRADO",
        indicadores: [
          { codigo: "I.CN.2.4.1", texto: "Explica la función básica de órganos ( músculos y huesos), el sistema osteomuscular y los representa gráficamente o a través de maquetas, relacionando sus funciones con el cuidado de la salud , valorando alternativas saludables frente al uso excesivo de pantallas" },
          { codigo: "I.CN.2.4.3", texto: "Aplica hábitos de higiene, actividad física, descanso en su vida cotidiana, participando en actividades individuales y grupales que promueven el bienestar físico y emocional, registrando sus prácticas y demostrando responsabilidad, autonomía, respeto y convivencia saludable" },
        ],
        saberes: {
          declarativos: [
            "CN.2.2.d.2. Componentes y funciones del sistema osteomuscular y su relación con el movimiento corporal.",
            "CN.2.2.d.4. Relación entre alimentación equilibrada, actividad física, descanso y bienestar integral.",
            "CN.2.2.d.5. Normas básicas de higiene personal y alimentaria para la prevención de enfermedades.",
            "CN.2.2.d.8. Efectos del uso excesivo de pantallas en la salud (vista, sueño, actividad física y bienestar).",
          ],
          procedimentales: [
            "CN.2.2.p.1. Representar el sistema osteomuscular del cuerpo humano mediante dibujos, esquemas o maquetas, explicando sus funciones básicas.",
            "CN.2.2.p.2. Observar y analizar prácticas de higiene en el manejo de alimentos en contextos cercanos o mediante recursos visuales.",
            "CN.2.2.p.3. Registrar y analizar el tiempo de uso de pantallas, comparándolo con recomendaciones de hábitos saludables.",
            "CN.2.2.p.4. Practicar técnicas básicas de respiración, relajación y expresión de emociones para su bienestar.",
            "CN.2.2.p.5. Participar en actividades cooperativas que promuevan el respeto, la convivencia y la resolución pacífica de conflictos.",
          ],
          actitudinales: [
            "CN.2.2.a.1. Practicar hábitos de cuidado personal mediante la actividad física, la higiene y el uso equilibrado del tiempo libre.",
            "CN.2.2.a.2. Asumir una alimentación responsable y sostenible.",
            "CN.2.2.a.3. Reconocer y respetar su identidad personal, su cuerpo y el de los demás, valorando los saberes culturales, familiares y ancestrales relacionados con la alimentación y el bienestar.",
            "CN.2.2.a.4. Demostrar actitudes de cooperación, respeto y convivencia pacífica, participando de manera responsable en acciones que promueven el bienestar común y el cuidado del entorno.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "CUARTO GRADO",
        indicadores: [
          { codigo: "I.CN.2.4.1", texto: "Explica la función básica de órganos ( músculos y huesos), el sistema osteomuscular y los representa gráficamente o a través de maquetas, relacionando sus funciones con el cuidado de la salud" },
          { codigo: "I.CN.2.4.2", texto: "Elabora menús equilibrados a partir del reconocimiento del origen de los alimentos, diferenciando productos saludables, locales y ultraprocesados, y relacionándolos con el bienestar personal y ambiental" },
          { codigo: "I.CN.2.4.3", texto: "Aplica hábitos de higiene, actividad física, descanso y uso responsable de pantallas en su vida cotidiana, participando en actividades individuales y grupales que promueven el bienestar físico y emocional, registrando sus prácticas y demostrando responsabilidad, autonomía, respeto y convivencia saludable" },
        ],
        saberes: {
          declarativos: [
            "CN.2.2.d.2. Componentes y funciones del sistema osteomuscular y su relación con el movimiento corporal.",
            "CN.2.2.d.6. Clasificación de los alimentos según su función (energética, constructora y reguladora).",
            "CN.2.2.d.7. Hábitos saludables y medidas básicas para prevenir enfermedades y accidentes en el entorno cotidiano.",
            "CN.2.2.d.8. Efectos del uso excesivo de pantallas en la salud (vista, sueño, actividad física y bienestar).",
          ],
          procedimentales: [
            "CN.2.2.p.1. Representar los órganos y el sistema osteomuscular mediante dibujos, esquemas o maquetas, explicando sus funciones básicas.",
            "CN.2.2.p.2. Observar y analizar prácticas de higiene en el manejo de alimentos en contextos cercanos o mediante recursos visuales.",
            "CN.2.2.p.3. Registrar y analizar el tiempo de uso de pantallas, comparándolo con recomendaciones de hábitos saludables.",
            "CN.2.2.p.4. Practicar técnicas básicas de respiración, relajación y expresión de emociones para su bienestar.",
            "CN.2.2.p.5. Participar en actividades cooperativas que promuevan el respeto, la convivencia y la resolución pacífica de conflictos.",
            "CN.2.2.p.6. Elaborar menús equilibrados que incluyan alimentos locales, de temporada y saludables.",
          ],
          actitudinales: [
            "CN.2.2.a.1. Practicar hábitos de cuidado personal mediante la actividad física, la higiene y el uso equilibrado del tiempo libre, valorando alternativas saludables frente al uso excesivo de pantallas.",
            "CN.2.2.a.2. Asumir una alimentación responsable y sostenible, valorando prácticas respetuosas con la naturaleza, evitando el desperdicio y favoreciendo el consumo de productos locales.",
            "CN.2.2.a.3. Reconocer y respetar su identidad personal, su cuerpo y el de los demás, valorando los saberes culturales, familiares y ancestrales relacionados con la alimentación y el bienestar.",
            "CN.2.2.a.4. Demostrar actitudes de cooperación, respeto y convivencia pacífica, participando de manera responsable en acciones que promueven el bienestar común y el cuidado del entorno.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.CN.2.5",
    descripcion: "Explicar la relación entre el agua, el suelo, los recursos naturales y las formas del relieve mediante la identificación de las características de las rocas, los minerales, el suelo, los recursos naturales renovables y no renovables, las regiones naturales del Ecuador y los cambios de estado del agua en su ciclo natural y procesos de potabilización, a través de la observación, la clasificación, la experimentación y la modelación, participando en acciones de uso sostenible, cuidado y conservación",
    competenciasClave: ["CMCT", "CC", "CD", "CCICC", "CIT", "CECA"],
    porGrado: [
      {
        nivel: "ELEMENTAL",
        grado: "SEGUNDO GRADO",
        indicadores: [
          { codigo: "I.CN.2.5.1", texto: "Explica los cambios de estado del agua mediante experimentos sencillos" },
          { codigo: "I.CN.2.5.4", texto: "Explica el ciclo natural y el uso del agua en su comunidad mediante modelos, dibujos o maquetas, proponiendo acciones sencillas para su cuidado y conservación" },
        ],
        saberes: {
          declarativos: [
            "CN.2.3.d.6. Características del suelo.",
            "CN.2.3.d.7. Ciclo del agua y sus cambios de estado en la naturaleza.",
            "CN.2.4.d.1. Estados físicos de la materia: sólido, líquido y gaseoso.",
          ],
          procedimentales: [
            "CN.2.3.p.6. Indagar sobre el uso del agua en su entorno y proponer acciones sencillas y sostenibles para su cuidado. Modelar el ciclo del agua.",
            "CN.2.4.p.1. Clasificar objetos según su estado físico.",
          ],
          actitudinales: [
            "CN.2.3.a.3. Participar en actividades escolares o comunitarias de conservación y manejo sostenible del agua y del suelo.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "TERCER GRADO",
        indicadores: [
          { codigo: "I.CN.2.5.1", texto: "Explica los cambios de estado del agua mediante experimentos sencillos, relacionándolos con el ciclo del agua y fenómenos como la lluvia" },
          { codigo: "I.CN.2.5.2", texto: "Identifica las características y tipos básicos de rocas (ígneas, sedimentarias y metamórficas) a partir de la observación y clasificación según propiedades como color, brillo y textura. Explica la relación entre el agua y las formas del relieve (montañas, ríos y valles), mediante la experimentación" },
          { codigo: "I.CN.2.5.4", texto: "Explica el ciclo natural y el uso del agua en su comunidad mediante modelos, dibujos o maquetas, proponiendo acciones sencillas para su cuidado y conservación. Explica la clasificación de los recursos naturales en renovables y no renovables, describiendo sus usos" },
        ],
        saberes: {
          declarativos: [
            "CN.2.3.d.1. Características de las rocas, minerales y suelo (color, textura, dureza) en el entorno cercano.",
            "CN.2.3.d.2. Tipos básicos de rocas: ígneas, sedimentarias y metamórficas. Recursos naturales renovables y no renovables del Ecuador, usos.",
            "CN.2.3.d.6. Características del suelo, el relieve y el clima de los páramos, los manglares y las islas volcánicas del Ecuador.",
            "CN.2.3.d.7. Ciclo del agua, sus cambios de estado en la naturaleza y su relación con la lluvia y los hábitats.",
          ],
          procedimentales: [
            "CN.2.3.p.1. Observar y clasificar rocas y minerales por color, brillo y textura. Clasificar a los recursos naturales en renovables y no renovable en función de sus características y usos.",
            "CN.2.3.p.6. Indagar sobre el uso del agua en su entorno y proponer acciones sencillas y sostenibles para su cuidado.",
          ],
          actitudinales: [
            "CN.2.3.a.2. Asumir el cuidado de los recursos naturales como un recurso esencial para la vida en su entorno.",
            "CN.2.3.a.3. Participar en actividades escolares o comunitarias de conservación y manejo sostenible del agua, del suelo y de los hábitats locales, reconociendo su importancia para el bienestar común.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "CUARTO GRADO",
        indicadores: [
          { codigo: "I.CN.2.5.1", texto: "Explica los cambios de estado del agua mediante experimentos sencillos, relacionándolos con el ciclo del agua y fenómenos como la lluvia" },
          { codigo: "I.CN.2.5.2", texto: "Identifica las características y tipos básicos de rocas (ígneas, sedimentarias y metamórficas) a partir de la observación y clasificación según propiedades como color, brillo y textura" },
          { codigo: "I.CN.2.5.3", texto: "Explica la relación entre el agua y las formas del relieve (montañas, ríos y valles), mediante la experimentación de procesos como la erosión y sedimentación" },
          { codigo: "I.CN.2.5.4", texto: "Explica el ciclo natural y el uso del agua en su comunidad mediante modelos, dibujos o maquetas, proponiendo acciones sencillas para su cuidado y conservación" },
          { codigo: "I.CN.2.5.5", texto: "Explica la clasificación de los recursos naturales en renovables y no renovables, describiendo sus usos, importancia y formas de aprovechamiento responsable en el Ecuador" },
        ],
        saberes: {
          declarativos: [
            "CN.2.3.d.3. Relieve (montañas, valles, ríos) y su relación con erosión y sedimentación.",
            "CN.2.3.d.4. Regiones naturales del Ecuador (Costa, Sierra, Amazonía e Insular) y sus factores físicos y geológicos.",
            "CN.2.3.d.5. Recursos naturales renovables y no renovables del Ecuador, usos, importancia y explotación controlada.",
            "CN.2.3.d.8. Proceso de potabilización del agua.",
            "CN.2.4.d.2. Cambios de los estados físicos de la materia (sólido, líquido y gaseoso) por efecto de la temperatura, especialmente en el agua.",
          ],
          procedimentales: [
            "CN.2.3.p.3. Clasificar a los recursos naturales en renovables y no renovable en función de sus características, importancia y usos.",
            "CN.2.3.p.4. Experimentar con arena y agua para evidenciar erosión y sedimentación.",
            "CN.2.3.p.5. Modelar el ciclo del agua y el proceso de potabilización del agua mediante experiencias prácticas y representaciones gráficas.",
            "CN.2.3.p.6. Indagar sobre el uso del agua en su entorno y proponer acciones sencillas y sostenibles para su cuidado.",
            "CN.2.4.p.1. Clasificar objetos según su estado físico.",
            "CN.2.4.p.2. Experimentar con agua para identificar sus cambios de estado al variar la temperatura.",
          ],
          actitudinales: [
            "CN.2.3.a.1. Valorar el entorno natural y el patrimonio geológico, manteniendo comportamientos responsables en actividades al aire libre.",
            "CN.2.3.a.2. Asumir el cuidado de los recursos naturales como un recurso esencial para la vida en su entorno.",
            "CN.2.3.a.3. Participar en actividades escolares o comunitarias de conservación y manejo sostenible del agua, del suelo y de los hábitats locales, reconociendo su importancia para el bienestar común.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.CN.2.6",
    descripcion: "Explicar los ciclos naturales del tiempo a partir de la relación entre los movimientos de la Tierra y la Luna y los cambios observables en el cielo (día, noche, estaciones y fases lunares), mediante la observación, el registro y la modelización, aplicando este conocimiento en la organización de actividades cotidianas y valorando los saberes ancestrales y la tecnología",
    competenciasClave: ["CMCT", "CD", "CCICC", "CIT", "CECA"],
    porGrado: [
      {
        nivel: "ELEMENTAL",
        grado: "SEGUNDO GRADO",
        indicadores: [
          { codigo: "I.CN.2.6.1", texto: "Explica los cambios observables del cielo (día/noche) mediante la observación y registro sistemático en dibujos, cuadernos o murales" },
          { codigo: "I.CN.2.6.4", texto: "Reconoce la importancia de los saberes ancestrales y las tecnologías para observar y medir el tiempo, comparando herramientas tradicionales y actuales." },
        ],
        saberes: {
          declarativos: [
            "CN.2.3.d.9. Características del día y la noche a partir de la presencia del Sol, la Luna y las estrellas.",
            "CN.2.3.d.12. Formas tradicionales y ancestrales de medir el tiempo y observar el cielo y su relación con los ciclos naturales.",
          ],
          procedimentales: [
            "CN.2.3.p.8. Observar el cielo durante el día y la noche, registrando los cambios.",
            "CN.2.3.p.10. Elaborar dibujos o registros gráficos para representar observaciones del cielo y de los ciclos del tiempo.",
          ],
          actitudinales: [
            "CN.2.3.a.4. Mostrar interés por observar los cambios del cielo y reconoce su influencia en la vida de las personas, animales y plantas.",
            "CN.2.3.a.5. Valorar el uso de saberes ancestrales y herramientas tecnológicas para comprender y medir el tiempo.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "TERCER GRADO",
        indicadores: [
          { codigo: "I.CN.2.6.1", texto: "Explica los cambios observables del cielo (día/noche, fases de la Luna, variaciones de luz y temperatura) mediante la observación y registro sistemático en dibujos, cuadernos o murales" },
          { codigo: "I.CN.2.6.2", texto: "Reconoce los movimientos de rotación y traslación de la Tierra y la Luna mediante modelos o maquetas, relacionándolos con el origen del día, la noche, las estaciones y las fases lunares" },
          { codigo: "I.CN.2.6.3", texto: "Analiza la relación entre los ciclos naturales y la organización de actividades cotidianas (juegos, siembra, tradiciones), utilizando ejemplos de su entorno" },
          { codigo: "I.CN.2.6.4", texto: "Reconoce la importancia de los saberes ancestrales y las tecnologías para observar y medir el tiempo, comparando herramientas tradicionales y actuales" },
          { codigo: "I.CN.2.6.5", texto: "Explica la influencia de los ciclos del Sol y la Luna en la vida de las personas, los animales y las plantas, demostrando interés y valoración por estos fenómenos" },
        ],
        saberes: {
          declarativos: [
            "CN.2.3.d.9. Características del día y la noche a partir de la presencia del Sol, la Luna y las estrellas, y sus efectos en la luz y la temperatura.",
            "CN.2.3.d.10. Movimientos de la Tierra (rotación y traslación) y sus efectos en el día, la noche y las estaciones.",
            "CN.2.3.d.11. Fases de la Luna y su influencia en fenómenos terrestres.",
            "CN.2.3.d.12. Formas tradicionales y ancestrales de medir el tiempo y observar el cielo y su relación con los ciclos naturales.",
          ],
          procedimentales: [
            "CN.2.3.p.7. Reconocer los saberes ancestrales relacionados con el Sol y la Luna en actividades como la agricultura o la organización del tiempo.",
            "CN.2.3.p.8. Observar el cielo durante el día y la noche, registrando cambios como la luz, la temperatura y las fases de la Luna.",
            "CN.2.3.p.9. Utilizar de manera guiada instrumentos y recursos (telescopios, binoculares o medios digitales) para la observación del cielo.",
            "CN.2.3.p.10. Elaborar dibujos o registros gráficos para representar observaciones del cielo y de los ciclos del tiempo.",
          ],
          actitudinales: [
            "CN.2.3.a.4. Mostrar interés por observar los cambios del cielo y reconoce su influencia en la vida de las personas, animales y plantas.",
            "CN.2.3.a.5. Valorar el uso de saberes ancestrales y herramientas tecnológicas para comprender y medir el tiempo.",
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
    codigo: "CE.CN.2.7",
    descripcion: "Proponer soluciones sostenibles a partir de la comprensión de las propiedades de la materia, las mezclas, las máquinas simples, el movimiento de los objetos en función de la fuerza y la gestión de residuos, mediante la experimentación, construcción y uso de materiales reciclados, demostrando creatividad, trabajo colaborativo y compromiso con el cuidado del ambiente",
    competenciasClave: ["CMTC", "CC", "CD", "CCICC", "CIT", "CECA"],
    porGrado: [
      {
        nivel: "ELEMENTAL",
        grado: "SEGUNDO GRADO",
        indicadores: [
          { codigo: "I.CN.2.7.1", texto: "Clasifica los materiales de su entorno identificando propiedades de la materia (masa, volumen, peso)" },
          { codigo: "I.CN.2.7.4", texto: "Diseña propuestas de gestión de residuos mediante la clasificación, reutilización, reciclaje" },
        ],
        saberes: {
          declarativos: [
            "CN.2.4.d.3. Propiedades básicas de la materia: masa, volumen y peso.",
            "CN.2.4.d.10. Estrategias ambientales de reducir, reciclar y reutilizar.",
          ],
          procedimentales: [
            "CN.2.4.p.6. Clasificar los residuos de su entorno cercano según sus características.",
          ],
          actitudinales: [
            "CN.2.4.a.3. Mostrar sensibilidad y compromiso ante la contaminación ambiental y el cuidado del entorno, mediante la reducción, reutilización, reciclaje y compostaje.",
            "CN.2.4.a.4. Valorar la creatividad y el trabajo colaborativo en la construcción de soluciones sostenibles.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "TERCER GRADO",
        indicadores: [
          { codigo: "I.CN.2.7.1", texto: "Clasifica los materiales de su entorno identificando propiedades de la materia (masa, volumen, peso)" },
          { codigo: "I.CN.2.7.3", texto: "Diseña y construye prototipos que integran máquinas simples y el movimiento de objetos, experimentando la relación entre fuerza y rapidez en la solución de problemas cotidianos. Diseña propuestas de gestión de residuos mediante la clasificación, reutilización, reciclaje demostrando creatividad, equidad y compromiso con el cuidado del ambiente" },
        ],
        saberes: {
          declarativos: [
            "CN.2.4.d.3. Propiedades básicas de la materia: masa, volumen y peso.",
            "CN.2.4.d.10. Estrategias ambientales de reducir, reciclar y reutilizar.",
            "CN.2.4.d.4. Máquinas simples (palanca, polea, plano inclinado) y su uso en actividades cotidianas.",
            "CN.2.4.d.15. Características del movimiento y la fuerza.",
          ],
          procedimentales: [
            "CN.2.4.p.4. Realizar experimentos sencillos con máquinas simples (palancas, poleas).",
            "CN.2.4.p.8. Describir movimientos en objetos del entorno.",
          ],
          actitudinales: [
            "CN.2.3.a.5. Valorar el uso de saberes ancestrales y herramientas tecnológicas para comprender y medir el tiempo.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "CUARTO GRADO",
        indicadores: [
          { codigo: "I.CN.2.7.1", texto: "Clasifica los materiales de su entorno identificando propiedades de la materia (masa, volumen, peso) y las sustancias puras y mezclas" },
          { codigo: "I.CN.2.7.2", texto: "Experimenta con distintos métodos de separación de mezclas (tamizado, filtración, decantación, evaporación) explicando sus resultados en situaciones cotidianas" },
          { codigo: "I.CN.2.7.3", texto: "Diseña y construye prototipos que integran máquinas simples y el movimiento de objetos, experimentando la relación entre fuerza, rapidez y gravedad en la solución de problemas cotidianos" },
          { codigo: "I.CN.2.7.4", texto: "Diseña propuestas de gestión de residuos mediante la clasificación, reutilización, reciclaje y compostaje, integrando el uso responsable de materiales y el trabajo colaborativo, y demostrando creatividad, equidad y compromiso con el cuidado del ambiente" },
        ],
        saberes: {
          declarativos: [
            "CN.2.4.d.3. Propiedades básicas de la materia: masa, volumen y peso.",
            "CN.2.4.d.8. Diferencias entre sustancias puras y mezclas, tanto naturales como artificiales.",
            "CN.2.4.d.14. Tipos de mezclas presentes en la preparación de alimentos y estados físicos de sus componentes.",
            "CN.2.4.d.13. Métodos y técnicas sencillas para separar mezclas.",
            "CN.2.4.d.10. Estrategias ambientales de reducir, reciclar y reutilizar.",
            "CN.2.4.d.11. Ciclo de biodegradación como proceso natural en el que los residuos orgánicos se transforman en abono.",
            "CN.2.4.d.12. Compostaje como técnica de aprovechamiento de residuos orgánicos (restos de frutas, verduras, hojas secas) para producir abono natural.",
            "CN.2.4.d.4. Máquinas simples (palanca, polea, plano inclinado) y su uso en actividades cotidianas.",
            "CN.2.4.d.15. Características del movimiento y la fuerza.",
          ],
          procedimentales: [
            "CN.2.4.p.3. Aplicar métodos sencillos de separación de mezclas (filtración, decantación, tamizado, evaporación) en situaciones cotidianas, explicando de forma básica cuál es el más adecuado según el tipo de mezcla y sus componentes.",
            "CN.2.4.p.6. Clasificar los residuos de su entorno cercano según sus características en biodegradables y no biodegradables.",
            "CN.2.4.p.7. Diseñar y construir prototipos sencillos con materiales reciclados o de uso.",
            "CN.2.4.p.4. Realizar experimentos sencillos con máquinas simples (palancas, poleas).",
            "CN.2.4.p.8. Describir movimientos en objetos del entorno.",
            "CN.2.4.p.9. Experimentar los movimientos con objetos del entorno en función de la fuerza de gravedad.",
          ],
          actitudinales: [
            "CN.2.4.a.3. Mostrar sensibilidad y compromiso ante la contaminación ambiental y el cuidado del entorno, mediante la reducción, reutilización, reciclaje y compostaje.",
            "CN.2.4.a.4. Valorar la creatividad y el trabajo colaborativo en la construcción de soluciones sostenibles.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.CN.2.8",
    descripcion: "Proponer acciones para el uso responsable de la energía en la vida cotidiana mediante la comprensión, la experimentación y la representación de diversas fuentes y transformaciones energéticas, con el fin de diseñar y aplicar medidas concretas de ahorro en el hogar y la escuela, reconociendo los beneficios de las energías limpias y sostenibles, y valorando el aporte de la ciencia y la tecnología, incluido el trabajo de las mujeres científicas, en el cuidado del ambiente",
    competenciasClave: ["CMTC", "CC", "CCICC", "CIT"],
    porGrado: [
      {
        nivel: "ELEMENTAL",
        grado: "SEGUNDO GRADO",
        indicadores: [
          { codigo: "I.CN.2.8.1", texto: "Reconoce y explica, mediante ejemplos cercanos y sencillos, las fuentes la energía" },
          { codigo: "I.CN.2.8.2", texto: "Experimenta y representa en posters, maquetas o prototipos interactivos el ciclo de la energía y sus transformaciones en la vida cotidiana" },
          { codigo: "I.CN.2.8.3", texto: "Propone y aplica acciones de ahorro y uso responsable de la energía, valorando su importancia para la sostenibilidad ambiental y la vida cotidiana" },
        ],
        saberes: {
          declarativos: [
            "CN.2.4.d.5. Tipos de energía en la vida diaria (solar, eléctrica, térmica, eólica, hidráulica).",
            "CN.2.4.d.6. Acciones cotidianas para el uso responsable y el ahorro de energía en el hogar y la escuela.",
          ],
          procedimentales: [
            "CN.2.4.p.5. Identificar las fuentes de energía, su transformación y el uso en situaciones cotidianas sencillas.",
            "CN.2.4.p.10. Representar gráficamente o en maquetas el ciclo de la energía: de la fuente - transformación- uso.",
          ],
          actitudinales: [
            "CN.2.4.a.1. Mostrar curiosidad e interés por descubrir cómo funciona la energía en su entorno.",
            "CN.2.4.a.2. Comprometerse con el ahorro energético en la vida cotidiana.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "TERCER GRADO",
        indicadores: [
          { codigo: "I.CN.2.8.1", texto: "Reconoce y explica, mediante ejemplos cercanos y sencillos, las fuentes y transformaciones de la energía y sus principales consecuencias ambientales" },
          { codigo: "I.CN.2.8.2", texto: "Experimenta y representa en posters, maquetas o prototipos interactivos el ciclo de la energía y sus transformaciones en la vida cotidiana" },
          { codigo: "I.CN.2.8.3", texto: "Propone y aplica acciones de ahorro y uso responsable de la energía, valorando su importancia para la sostenibilidad ambiental y la vida cotidiana" },
        ],
        saberes: {
          declarativos: [
            "CN.2.4.d.5. Tipos de energía en la vida diaria (solar, eléctrica, térmica, eólica, hidráulica).",
            "CN.2.4.d.6. Acciones cotidianas para el uso responsable y el ahorro de energía en el hogar y la escuela.",
            "CN.2.4.d.7. Principales problemas derivados del uso de fuentes no renovables (contaminación, agotamiento).",
          ],
          procedimentales: [
            "CN.2.4.p.5. Identificar las fuentes de energía, su transformación y el uso en situaciones cotidianas sencillas.",
            "CN.2.4.p.10. Representar gráficamente o en maquetas el ciclo de la energía: de la fuente - transformación- uso.",
            "CN.2.4.p.11. Explicar con lenguaje sencillo, apoyándose en dibujos, maquetas o dramatizaciones, algunos problemas ambientales asociados al uso de energías no renovables.",
          ],
          actitudinales: [
            "CN.2.4.a.1. Mostrar curiosidad e interés por descubrir cómo funciona la energía en su entorno.",
            "CN.2.4.a.2. Comprometerse con el ahorro energético en la vida cotidiana.",
            "CN.2.4.a.5. Valorar la equidad de género en la ciencia, reconociendo la importancia de la participación de mujeres y hombres en el avance del conocimiento.",
          ],
        },
      },
      {
        nivel: "ELEMENTAL",
        grado: "CUARTO GRADO",
        indicadores: [
          { codigo: "I.CN.2.8.1", texto: "Reconoce y explica, mediante ejemplos cercanos y sencillos, las fuentes y transformaciones de la energía y sus principales consecuencias ambientales" },
          { codigo: "I.CN.2.8.2", texto: "Experimenta y representa en posters, maquetas o prototipos interactivos el ciclo de la energía y sus transformaciones en la vida cotidiana" },
          { codigo: "I.CN.2.8.3", texto: "Propone y aplica acciones de ahorro y uso responsable de la energía, valorando su importancia para la sostenibilidad ambiental y la vida cotidiana" },
        ],
        saberes: {
          declarativos: [
            "CN.2.4.d.5. Tipos de energía en la vida diaria (solar, eléctrica, térmica, eólica, hidráulica).",
            "CN.2.4.d.6. Acciones cotidianas para el uso responsable y el ahorro de energía en el hogar y la escuela.",
            "CN.2.4.d.7. Principales problemas derivados del uso de fuentes no renovables (contaminación, agotamiento).",
            "CN.2.4.d.9. Papel de las mujeres en la ciencia y la tecnología, con ejemplos de científicas relevantes del Ecuador, para reconocer que la ciencia es una actividad humana y colectiva.",
          ],
          procedimentales: [
            "CN.2.4.p.5. Identificar las fuentes de energía, su transformación y el uso en situaciones cotidianas sencillas.",
            "CN.2.4.p.10. Representar gráficamente o en maquetas el ciclo de la energía: de la fuente - transformación- uso.",
            "CN.2.4.p.11. Explicar con lenguaje sencillo, apoyándose en dibujos, maquetas o dramatizaciones, algunos problemas ambientales asociados al uso de energías no renovables.",
          ],
          actitudinales: [
            "CN.2.4.a.1. Mostrar curiosidad e interés por descubrir cómo funciona la energía en su entorno.",
            "CN.2.4.a.2. Comprometerse con el ahorro energético en la vida cotidiana.",
            "CN.2.4.a.5. Valorar la equidad de género en la ciencia, reconociendo la importancia de la participación de mujeres y hombres en el avance del conocimiento.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.CN.3.1",
    descripcion: "Reconocer la célula como unidad básica de todos los seres vivos y las funciones vitales mediante la observación de muestras, la construcción de modelos y la realización de experimentos sencillos, clasificando la diversidad de los seres vivos y valorando la investigación científica como un proceso en constante evolución",
    competenciasClave: ["CC", "CMCT", "CSE", "CD", "CCICC"],
    porGrado: [
      {
        nivel: "MEDIA",
        grado: "QUINTO GRADO",
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
        nivel: "MEDIA",
        grado: "SEXTO GRADO",
        indicadores: [
          { codigo: "I.CN.3.1.4", texto: "Clasifica organismos en los diferentes reinos atendiendo a criterios celulares, de organización y nutrición, valorando la diversidad biológica" },
        ],
        saberes: {
          declarativos: [
            "CN.3.1.d.6. Principales grupos de seres vivos (reinos) y su evolución desde el modelo de cinco reinos hasta el modelo de seis reinos (Bacteria, Archaea, Protista, Fungi, Plantae y Animalia).",
            "CN.3.1.d.7. Características fundamentales de los principales reinos de los seres vivos, con ejemplos de especies locales, reconociendo que la clasificación científica evoluciona conforme surgen nuevas evidencias.",
          ],
          procedimentales: [
            "CN.3.1.p.2. Identificar organismos de distintos reinos en muestras, imágenes o salidas de campo y la comparación entre modelos de cinco y seis reinos.",
          ],
          actitudinales: [
            "CN.3.1.a.2. Respetar los embriones animales y vegetales como manifestaciones iniciales de la vida, desarrollando actitudes de cuidado, responsabilidad y ética frente a los seres vivos, y evitando prácticas que generen daño innecesario en contextos científicos, escolares y cotidianos.",
            "CN.3.1.a.3. Valorar la diversidad biológica como resultado de la evolución y adaptación.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SÉPTIMO GRADO",
        indicadores: [
          { codigo: "I.CN.3.1.1", texto: "Identifica las principales características y funciones vitales que diferencian a los seres vivos de los objetos inertes" },
          { codigo: "I.CN.3.1.2", texto: "Reconoce la célula como unidad básica de la vida y distingue entre células animales y vegetales mediante la observación de muestras al microscopio y la construcción de modelos" },
          { codigo: "I.CN.3.1.3", texto: "Realiza experimentos sencillos (germinación de semillas, extracción de ADN) aplicando procedimientos básicos de indagación científica" },
          { codigo: "I.CN.3.1.4", texto: "Clasifica organismos en los diferentes reinos atendiendo a criterios celulares, de organización y nutrición, valorando la diversidad biológica" },
        ],
        saberes: {
          declarativos: [
            "CN.3.1.d.1. Los seres vivos están formados por células, realizan funciones vitales y se reproducen transmitiendo sus características.",
            "CN.3.1.d.2. La célula como unidad básica de la vida; diferencias entre células animales y vegetales.",
            "CN.3.1.d.3. El ADN como material común a todos los seres vivos, que contiene la información para su funcionamiento y se transmite de padres a hijos.",
            "CN.3.1.d.4. Ejemplos visibles y microscópicos de células (vegetales y animales) y embriones como seres vivos en desarrollo.",
            "CN.3.1.d.5. Criterios de clasificación de los seres vivos: tipo de célula, forma de nutrición y organización (unicelulares/pluricelulares).",
            "CN.3.1.d.6. Principales grupos de seres vivos (reinos) y su evolución desde el modelo de cinco reinos hasta el modelo de seis reinos (Bacteria, Archaea, Protista, Fungi, Plantae y Animalia).",
          ],
          procedimentales: [
            "CN.3.1.p.1. Observar células vegetales y animales y construir modelos básicos de células para representar sus partes principales.",
            "CN.3.1.p.2. Identificar organismos de distintos reinos en muestras, imágenes o salidas de campo y compararlos utilizando criterios celulares, de organización y de nutrición, incluyendo la comparación entre modelos de cinco y seis reinos.",
            "CN.3.1.p.3. Realizar experimentos sencillos de germinación y extracción de ADN en frutas, registrando procedimientos y resultados como parte de la indagación científica.",
          ],
          actitudinales: [
            "CN.3.1.a.1. Reconocer que todos los seres vivos comparten funciones vitales y están formados por células, valorando el ADN como elemento común.",
            "CN.3.1.a.2. Respetar los embriones animales y vegetales como manifestaciones iniciales de la vida, desarrollando actitudes de cuidado, responsabilidad y ética frente a los seres vivos, y evitando prácticas que generen daño innecesario en contextos científicos, escolares y cotidianos.",
            "CN.3.1.a.3. Valorar la diversidad biológica como resultado de la evolución y adaptación.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.CN.3.2",
    descripcion: "Explicar la diversidad de plantas con y sin semilla, y con y sin flores, a partir del análisis de sus estructuras morfológicas y reproductivas, la experimentación con procesos vitales como la fotosíntesis y la germinación, y el estudio de ejemplos del Ecuador, comprendiendo su evolución desde formas más simples hasta más complejas, y valorando la biodiversidad vegetal y los saberes ancestrales como parte del patrimonio natural y cultural que debe conservarse",
    competenciasClave: ["CMTC", "CD", "CC"],
    porGrado: [
      {
        nivel: "MEDIA",
        grado: "QUINTO GRADO",
        indicadores: [
          { codigo: "I.CN.3.2.1", texto: "Distingue las plantas con semilla y con flores, identificando sus características básicas de reproducción y morfología" },
          { codigo: "I.CN.3.2.2", texto: "Reconoce que todas las plantas realizan funciones vitales como fotosíntesis respiración y nutrición, relacionándolas con su ambiente. Explica el papel de los agentes polinizadores en la reproducción de las plantas" },
        ],
        saberes: {
          declarativos: [
            "CN.3.1.d.9. Funciones vitales de las plantas (fotosíntesis, respiración, nutrición y reproducción) y su relación con el ambiente.",
            "CN.3.1.d.11. Agentes polinizadores y su papel en la reproducción de las plantas y las principales amenazas que enfrentan en los ecosistemas actuales.",
          ],
          procedimentales: [
            "CN.3.1.p.4. Clasificar plantas del entorno local según la presencia semilla y flor y la ausencia de flor; realizar experimentos de germinación, fotosíntesis y respiración, registrando observaciones y resultados.",
            "CN.3.1.p.5. Identificar agentes polinizadores en el ciclo reproductivo de las plantas.",
          ],
          actitudinales: [
            "CN.3.1.a.3. Valorar la diversidad biológica como resultado de la evolución y adaptación.",
            "CN.3.1.a.5. Reconocer el valor de los conocimientos ancestrales en el cuidado responsable de la flora, participando en acciones de conservación del patrimonio natural y cultural.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SEXTO GRADO",
        indicadores: [
          { codigo: "I.CN.3.2.1", texto: "Reconoce las plantas sin semilla, con flores y sin flores, identificando sus características básicas de reproducción y morfología" },
          { codigo: "I.CN.3.2.2", texto: "Reconoce que todas las plantas realizan funciones vitales como fotosíntesis respiración y nutrición, relacionándolas con su ambiente" },
        ],
        saberes: {
          declarativos: [
            "CN.3.1.d.8. Clasificación de las plantas sin semilla y sin flores, inclyendo a las pteridofitas y briofitas, y sus ciclos de vida.",
            "CN.3.1.d.9. Funciones vitales de las plantas (fotosíntesis, respiración, nutrición y reproducción) y su relación con el ambiente.",
          ],
          procedimentales: [
            "CN.3.1.p.4. Clasificar plantas del entorno local sin flor y semilla.",
          ],
          actitudinales: [
            "CN.3.1.a.3. Valorar la diversidad biológica como resultado de la evolución y adaptación.",
            "CN.3.1.a.5. Reconocer el valor de los conocimientos ancestrales en el cuidado responsable de la flora, participando en acciones de conservación del patrimonio natural y cultural.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SÉPTIMO GRADO",
        indicadores: [
          { codigo: "I.CN.3.2.3", texto: "Explica la evolución de las plantas desde formas primitivas hasta las más complejas, utilizando ejemplos del Ecuador y reconociendo la idea de antepasados comunes y la relación con otros seres vivos. Explica las amenazas que enfrentan las plantas, identificando ejemplos en su entorno" },
          { codigo: "I.CN.3.2.5", texto: "Valora la biodiversidad de las plantas del Ecuador y los saberes ancestrales sobre la flora nativa, fomentando la corresponsabilidad en la conservación del patrimonio natural" },
        ],
        saberes: {
          declarativos: [
            "CN.3.1.d.10. Plantas nativas del Ecuador y sus valores ecológicos, culturales y económicos; conocimientos ancestrales sobre su uso. Principales amenazas que enfrentan en los ecosistemas actuales.",
            "CN.3.1.d.20. Adaptaciones de las plantas a diferentes condiciones ambientales.",
          ],
          procedimentales: [
            "CN.3.1.p.6. Registrar especies de plantas nativas en salidas de campo usando registros físicos o digitales.",
            "CN.3.1.p.9. Construir líneas temporales que representen la evolución de las plantas, incluyendo organismos extintos, para visualizar la transición desde formas más simples a más complejas.",
          ],
          actitudinales: [
            "CN.3.1.a.3. Valorar la diversidad biológica como resultado de la evolución y adaptación.",
            "CN.3.1.a.5. Reconocer el valor de los conocimientos ancestrales en el cuidado responsable de la flora, participando en acciones de conservación del patrimonio natural y cultural.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.CN.3.3",
    descripcion: "Explicar la diversidad de animales invertebrados y vertebrados a partir del análisis de sus características básicas (tipo de esqueleto, formas de reproducción y adaptaciones) y el análisis de evidencias evolutivas, reconociendo su origen común, comprendiendo su papel en los ecosistemas y valorando la necesidad de su conservación responsable",
    competenciasClave: ["CMCT", "CC", "CD", "CCICC"],
    porGrado: [
      {
        nivel: "MEDIA",
        grado: "QUINTO GRADO",
        indicadores: [
          { codigo: "I.CN.3.3.1", texto: "Clasifica animales vertebrados a partir de sus características básicas (esqueleto y reproducción)" },
          { codigo: "I.CN.3.3.3", texto: "Valora la biodiversidad animal y propone actitudes responsables para la conservación de especies y ecosistemas" },
        ],
        saberes: {
          declarativos: [
            "CN.3.1.d.13. Clasificación de los animales vertebrados.",
            "CN.3.1.d.14. Diversidad de ciclos reproductivos en vertebrados.",
          ],
          procedimentales: [
            "CN.3.1.p.7. Identificar animales vertebrados e invertebrados locales, describiendo sus características y analizando sus funciones ecológicas.",
            "CN.3.1.p.8. Comparar los ciclos reproductivos de vertebrados mediante ejemplos y esquemas.",
          ],
          actitudinales: [
            "CN.3.1.a.4. Reconocer la importancia ecológica de los animales vertebrados y promover su conservación.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SEXTO GRADO",
        indicadores: [
          { codigo: "I.CN.3.3.1", texto: "Clasifica animales invertebrados a partir de sus características básicas (esqueleto, reproducción y adaptaciones)" },
        ],
        saberes: {
          declarativos: [
            "CN.3.1.d.12. Clasificación de los animales invertebrados. Diversidad de ciclos reproductivos sexuales y asexuales de los invertebrados.",
          ],
          procedimentales: [
            "CN.3.1.p.7. Identificar animales invertebrados locales, describiendo sus características y analizando sus funciones ecológicas. Comparar los ciclos reproductivos de invertebrados mediante ejemplos y esquemas.",
          ],
          actitudinales: [
            "CN.3.1.a.4. Reconocer la importancia ecológica de los animales invertebrados y promover su conservación.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SÉPTIMO GRADO",
        indicadores: [
          { codigo: "I.CN.3.3.1", texto: "Clasifica animales invertebrados y vertebrados a partir de sus adaptaciones" },
          { codigo: "I.CN.3.3.2", texto: "Reconoce el origen común de los animales a partir de la observación y comparación de las funciones vitales y rasgos morfológicos entre distintos grupos" },
          { codigo: "I.CN.3.3.3", texto: "Valora la biodiversidad animal y propone actitudes responsables para la conservación de especies y ecosistemas" },
        ],
        saberes: {
          declarativos: [
            "CN.3.1.d.15. Evolución de los animales desde formas primitivas a más complejas, reconociendo la idea de antepasados comunes.",
            "CN.3.1.d.16. Relevancia ecológica de insectos y otros invertebrados en los servicios ecosistémicos (polinización, reciclaje, control biológico).",
            "CN.3.1.d.21. Adaptaciones de los animales a diferentes condiciones ambientales.",
          ],
          procedimentales: [
            "CN.3.1.p.10. Analizar evidencias evolutivas básicas, como fósiles, reconstrucciones o ilustraciones de organismos extintos, relacionándolas con animales actuales para inferir cambios en estructuras, adaptaciones y condiciones ambientales a lo largo del tiempo.",
          ],
          actitudinales: [
            "CN.3.1.a.3. Valorar la diversidad biológica como resultado de la evolución y adaptación.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.CN.3.4",
    descripcion: "Explicar la importancia de proteger los ecosistemas y la biodiversidad del Ecuador, incluyendo especies nativas y endémicas, mediante el análisis de sus elementos, interacciones, niveles tróficos, adaptaciones y amenazas, identificando las consecuencias de la acción humana, la extinción de especies y el manejo inadecuado de residuos, para diseñar y participar en acciones de conservación y manejo sostenible, valorando la corresponsabilidad ciudadana, el aporte de la investigación científica, los saberes locales y la biodiversidad como patrimonio natural y cultural del país",
    competenciasClave: ["CMTC", "CC", "CD", "CCICC"],
    porGrado: [
      {
        nivel: "MEDIA",
        grado: "QUINTO GRADO",
        indicadores: [
          { codigo: "I.CN.3.4.3", texto: "Explica las principales amenazas a la biodiversidad en la localidad (deforestación, monocultivos, cambio climático, manejo inadecuado de residuos)" },
          { codigo: "I.CN.3.4.5", texto: "Explica, con ejemplos de ecosistemas de la localidad y las amenazas que enfrentan" },
        ],
        saberes: {
          declarativos: [
            "CN.3.1.d.18. Características y clases de ecosistemas de su localidad.",
            "CN.3.1.d.23. Principales amenazas que enfrentan la biodiversidad de la localidad.",
          ],
          procedimentales: [
            "CN.3.1.p.12. Elaborar registros sobre la biodiversidad en ecosistemas locales.",
          ],
          actitudinales: [
            "CN.3.1.a.3. Valorar la diversidad biológica de la localidad.",
            "CN.3.1.a.6. Participar en acciones escolares y comunitarias orientadas a la protección de ecosistemas.",
            "CN.3.1.a.7. Reconocer la biodiversidad como patrimonio natural y cultural del Ecuador.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SEXTO GRADO",
        indicadores: [
          { codigo: "I.CN.3.4.1", texto: "Explica el funcionamiento de los ecosistemas identificando sus elementos, interacciones y relaciones tróficas" },
          { codigo: "I.CN.3.4.2", texto: "Analiza las adaptaciones de plantas y animales en ecosistemas locales y nacionales, explicando cómo estas adaptaciones contribuyen al equilibrio de los ecosistemas y a la supervivencia de especies nativas y endémicas" },
          { codigo: "I.CN.3.4.3", texto: "Explica las principales amenazas a la biodiversidad en el Ecuador (deforestación, monocultivos, cambio climático, manejo inadecuado de residuos), describiendo sus efectos sobre la pérdida de especies" },
        ],
        saberes: {
          declarativos: [
            "CN.3.1.d.18. Características y clases de ecosistemas y las interacciones entre sus componentes.",
            "CN.3.1.d.19. Diversidad biológica de los ecosistemas del Ecuador y su importancia ecológica.",
            "CN.3.1.d.22. Niveles tróficos (productores, consumidores y descomponedores) y especies clave de los ecosistemas.",
            "CN.3.1.d.23. Principales amenazas que enfrentan la biodiversidad en el Ecuador (deforestación, monocultivos, cambio climático).",
            "CN.3.1.d.24. Causas naturales, antropogénicas y consecuencias de la extinción de especies.",
          ],
          procedimentales: [
            "CN.3.1.p.12. Elaborar registros sobre la biodiversidad en ecosistemas locales y Áreas Protegidas, mediante observación directa y TIC.",
          ],
          actitudinales: [
            "CN.3.1.a.3. Valorar la diversidad biológica como resultado de la evolución y adaptación.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SÉPTIMO GRADO",
        indicadores: [
          { codigo: "I.CN.3.4.1", texto: "Explica el funcionamiento de los ecosistemas identificando sus elementos, interacciones y relaciones tróficas" },
          { codigo: "I.CN.3.4.2", texto: "Analiza las adaptaciones de plantas y animales en ecosistemas locales y nacionales, explicando cómo estas adaptaciones contribuyen al equilibrio de los ecosistemas y a la supervivencia de especies nativas y endémicas" },
          { codigo: "I.CN.3.4.3", texto: "Explica las principales amenazas a la biodiversidad en el Ecuador (deforestación, monocultivos, cambio climático, manejo inadecuado de residuos), describiendo sus efectos sobre la pérdida de especies" },
          { codigo: "I.CN.3.4.4", texto: "Diseña y comunica propuestas de conservación y manejo sostenible de ecosistemas y especies nativas, integrando información científica, saberes locales o ancestrales y acciones concretas de corresponsabilidad ciudadana en la escuela y la comunidad" },
          { codigo: "I.CN.3.4.5", texto: "Explica, con ejemplos de ecosistemas del Ecuador, cómo las relaciones intra e interespecíficas entre las especies se ven afectadas por causas naturales y acciones humanas que pueden llevar a su extinción; relaciona estas situaciones con la importancia del patrimonio geológico y paleontológico como memoria natural y cultural, y con el papel de las Áreas Naturales Protegidas en la conservación de la biodiversidad" },
        ],
        saberes: {
          declarativos: [
            "CN.3.1.d.19. Diversidad biológica de los ecosistemas del Ecuador y su importancia ecológica.",
            "CN.3.1.d.17. Fósiles y organismos extintos como evidencia científica de la evolución y de los cambios ambientales.",
            "CN.3.1.d.25. Relaciones interespecíficas e intraespecíficas.",
            "CN.3.1.d.26. El patrimonio geológico y paleontológico como memoria natural y cultural.",
            "CN.3.1.d.27. Importancia de las Áreas Naturales Protegidas en la conservación de la biodiversidad.",
            "CN.3.1.d.28. Aportes de la investigación científica y de los saberes locales en la conservación de ecosistemas.",
            "CN.3.1.d.29. Manejo de residuos sólidos en la comunidad.",
          ],
          procedimentales: [
            "CN.3.1.p.11. Analizar adaptaciones de plantas y animales y describir interacciones intra e interespecíficas en ecosistemas.",
            "CN.3.1.p.12. Elaborar registros sobre la biodiversidad en ecosistemas locales y Áreas Protegidas, mediante observación directa y.",
            "TIC.CN.3.1.p.13. Diseñar propuestas de conservación integrando investigación científica y saberes ancestrales.",
            "CN.3.1.p.14. Aplica prácticas de manejo responsable de residuos y uso de recursos en la escuela y la comunidad, relacionándolas con la protección de ecosistemas y la reducción de impactos ambientales.",
          ],
          actitudinales: [
            "CN.3.1.a.3. Valorar la diversidad biológica como resultado de la evolución y adaptación.",
            "CN.3.1.a.6. Participar en acciones escolares y comunitarias orientadas a la protección de ecosistemas mostrando respeto por los saberes ancestrales.",
            "CN.3.1.a.7. Reconocer la biodiversidad como patrimonio natural y cultural del Ecuador.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.CN.3.5",
    descripcion: "Promover la salud integral mediante la comprensión del cuerpo humano como un organismo complejo y pluricelular, en el que sistemas, tejidos y órganos funcionan de manera integrada en la nutrición celular, y la adopción de hábitos saludables fundamentados en la ciencia y los saberes ancestrales, para tomar decisiones responsables sobre el propio bienestar y el de la comunidad, valorando la corresponsabilidad personal y colectiva en el cuidado de la vida",
    competenciasClave: ["CMTC", "CC", "CD", "CCICC", "CECA"],
    porGrado: [
      {
        nivel: "MEDIA",
        grado: "QUINTO GRADO",
        indicadores: [
          { codigo: "I.CN.3.5.1", texto: "Explica el funcionamiento integrado y coordinado de los sistemas digestivo, circulatorio, respiratorio y excretor en el proceso de nutrición celular" },
        ],
        saberes: {
          declarativos: [
            "CN.3.2.d.1. Estructura y función de los sistemas digestivo, respiratorio, circulatorio y excretor como parte del organismo humano. Enfermedades comunes relacionadas con los sistemas digestivo, respiratorio, circulatorio y excretor y medidas preventivas.",
            "CN.3.2.d.4. Beneficios de la actividad física, la higiene y la dieta equilibrada para la prevención de enfermedades.",
            "CN.3.2.d.8. Relación de los procesos de nutrición con los sistemas circulatorio, respiratorio y excretor, como parte del funcionamiento integrado del organismo.",
          ],
          procedimentales: [
            "CN.3.2.p.1. Modelizar, con apoyo de TIC y materiales sencillos, la estructura y función de los distintos sistemas y aparatos del cuerpo humano.",
            "CN.3.2.p.4. Indagar en fuentes confiables sobre enfermedades digestivas, contrastando con información científica.",
          ],
          actitudinales: [
            "CN.3.2.a.2. Valorar el autocuidado, la higiene personal y la actividad física como prácticas esenciales para la prevención de enfermedades de distinto tipo.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SEXTO GRADO",
        indicadores: [
          { codigo: "I.CN.3.5.2", texto: "Explica la diferencia entre alimentación y nutrición, identificando hábitos saludables y no saludables, y sus efectos en la salud integral" },
        ],
        saberes: {
          declarativos: [
            "CN.3.2.d.2. Relación entre el sistema digestivo y la nutrición celular.",
            "CN.3.2.d.3. Diferencia entre alimentación y nutrición, y su importancia en la salud integral.",
            "CN.3.2.d.4. Beneficios de la actividad física, la higiene y la dieta equilibrada para la prevención de enfermedades.",
            "CN.3.2.d.5. Enfermedades comunes relacionadas con el sistema digestivo y la nutrición, y medidas preventivas.",
          ],
          procedimentales: [
            "CN.3.2.p.2. Relacionar el proceso digestivo con la nutrición celular mediante esquemas o simulaciones.",
          ],
          actitudinales: [
            "CN.3.2.a.1. Promover la responsabilidad personal en la práctica de hábitos de alimentación saludable y sostenible.",
            "CN.3.2.a.2. Valorar el autocuidado, la higiene personal y la actividad física como prácticas esenciales para la prevención de enfermedades de distinto tipo.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SÉPTIMO GRADO",
        indicadores: [
          { codigo: "I.CN.3.5.3", texto: "Analiza la relación entre hábitos de consumo insostenibles (como alimentos ultraprocesados, productos fuera de temporada) y su impacto en la salud personal y en el ambiente" },
          { codigo: "I.CN.3.5.4", texto: "Diseña propuestas de promoción de salud integral basadas en evidencia científica y saberes ancestrales, fomentando la corresponsabilidad personal y colectiva" },
        ],
        saberes: {
          declarativos: [
            "CN.3.2.d.6. Hábitos de consumo insostenibles (ultraprocesados, fuera de temporada) y su impacto en la salud y en el ambiente.",
            "CN.3.2.d.7. Conocimientos de medicina ancestral en Ecuador y su aporte a la medicina moderna y la promoción de la salud.",
          ],
          procedimentales: [
            "CN.3.2.p.3. Analizar etiquetas de alimentos y compararlas en función de su valor nutricional, origen (local/importado, temporada/fuera de temporada) y sostenibilidad.",
            "CN.3.2.p.5. Recoger y organizar información sobre hábitos alimenticios familiares y saberes ancestrales vinculados a la salud.",
            "CN.3.2.p.6. Elaborar listas y afiches que diferencien entre hábitos saludables/sostenibles y poco saludables/insostenibles.",
            "CN.3.2.p.7. Proponer estrategias de promoción de la salud integral basadas en evidencia científica y en saberes locales.",
          ],
          actitudinales: [
            "CN.3.2.a.3. Reconocer los riesgos del consumo de drogas y comprometerse con su prevención.",
            "CN.3.2.a.4. Respetar y valorar el aporte de la medicina ancestral en el cuidado de la salud junto a la medicina moderna.",
            "CN.3.2.a.5. Desarrollar conciencia crítica frente a la influencia cultural y mediática en los hábitos alimenticios y desórdenes asociados.",
            "CN.3.2.a.6. Fomentar la corresponsabilidad social en la promoción de la salud integral y en el consumo sostenible para reducir la huella ecológica.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.CN.3.6",
    descripcion: "Proponer acciones para la salud integral y el autocuidado a partir del estudio del sistema reproductor, endocrino y nervioso, analizando los cambios fisiológicos, emocionales y sociales propios de la pubertad y la sexualidad como dimensión humana, para asumir hábitos de vida saludable",
    competenciasClave: ["CMCT", "CC", "CCICC", "CD", "CSE"],
    porGrado: [
      {
        nivel: "MEDIA",
        grado: "QUINTO GRADO",
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
        nivel: "MEDIA",
        grado: "SEXTO GRADO",
        indicadores: [
          { codigo: "I.CN.3.6.1", texto: "Comprende el sistema reproductor, y describe su estructura y funciones" },
          { codigo: "I.CN.3.6.3", texto: "Propone hábitos de autocuidado y prevención fundamentados en la indagación científica" },
        ],
        saberes: {
          declarativos: [
            "CN.3.2.d.9. Estructura y función del sistema reproductor humano femenino y masculino.",
            "CN.3.2.d.12. Importancia del sistema reproductor en la transmisión de características hereditarias.",
          ],
          procedimentales: [
            "CN.3.2.p.12. Analizar esquemas y modelos que comparen procesos reproductivos en plantas, animales y seres humanos. Representar, con apoyo de esquemas, maquetas o recursos digitales, la estructura de los sistemas reproductor femenino y masculino.",
          ],
          actitudinales: [
            "CN.3.2.a.7. Valorar el autocuidado, la higiene personal y la actividad física como prácticas esenciales para una vida saludable.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SÉPTIMO GRADO",
        indicadores: [
          { codigo: "I.CN.3.6.1", texto: "Comprende la relación entre los sistemas reproductor, endocrino y nervioso describiendo su estructura y funciones, y explicando cómo intervienen en los cambios de la pubertad" },
          { codigo: "I.CN.3.6.2", texto: "Reconoce la sexualidad como dimensión biológica, psicológica, social y cultural de la persona, formulando preguntas, hipótesis y análisis críticos sobre los cambios de la adolescencia y contrastando explicaciones científicas con mitos y creencias culturales" },
          { codigo: "I.CN.3.6.3", texto: "Propone hábitos de autocuidado y prevención fundamentados en la indagación científica" },
        ],
        saberes: {
          declarativos: [
            "CN.3.2.d.10. Estructura y función del sistema endocrino y su papel en la homeostasis y la pubertad.",
            "CN.3.2.d.11. Estructura y función del sistema nervioso y su relación con la salud integral.",
            "CN.3.2.d.13. Relación entre el sistema nervioso y endocrino en la percepción de estímulos y la producción de respuestas.",
            "CN.3.2.d.14. Sexualidad como dimensión humana que integra aspectos biológicos, psicológicos, sociales y culturales.",
            "CN.3.2.d.15. Mitos y creencias culturales sobre la pubertad en comunidades ecuatorianas y su contraste con el conocimiento científico.",
          ],
          procedimentales: [
            "CN.3.2.p.8. Formular preguntas e hipótesis sobre los cambios fisiológicos, anatómicos y conductuales de la pubertad.",
            "CN.3.2.p.9. Analizar y comunicar hallazgos sobre los procesos de madurez sexual en mujeres y hombres.",
            "CN.3.2.p.10. Investigar testimonios intergeneracionales en la familia o comunidad sobre la vivencia de la pubertad y compararlos con explicaciones científicas actuales.",
            "CN.3.2.p.11. Participar en debates guiados para identificar mitos y realidades sobre la pubertad. Representar, con apoyo de esquemas, maquetas o recursos digitales, la estructura de los sistemas,, endocrino y nervioso, describiendo sus funciones básicas y explicando cómo se relacionan entre sí en la pubertad.( Ref:.",
          ],
          actitudinales: [
            "CN.3.2.a.7. Valorar el autocuidado, la higiene personal y la actividad física como prácticas esenciales para una vida saludable.",
            "CN.3.2.a.8. Reconocer la sexualidad como un componente integral del crecimiento del ser humano.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.CN.3.7",
    descripcion: "Valorar la Tierra como un sistema integrado formado por la geósfera, la hidrósfera, la atmósfera y la biósfera, mediante el análisis de fenómenos como la contaminación, el cambio climático y el vulcanismo, para plantear acciones de prevención, adaptación y mitigación frente a problemas ambientales y riesgos naturales, fortaleciendo la resiliencia ambiental y ciudadana, así como la corresponsabilidad en la conservación de los ecosistemas",
    competenciasClave: ["CMTC", "CC", "CD", "CCICC"],
    porGrado: [
      {
        nivel: "MEDIA",
        grado: "QUINTO GRADO",
        indicadores: [
          { codigo: "I.CN.3.7.1", texto: "Comprende la interacción entre geósfera, hidrósfera, atmósfera y biósfera representando mediante maquetas, dibujos o esquemas" },
        ],
        saberes: {
          declarativos: [
            "CN.3.3.d.1. Sistema Solar y sus componentes.",
            "CN.3.3.d.2. Eclipses de la Luna y el Sol.",
            "CN.3.3.d.3. Estructura interna del planeta Tierra.",
            "CN.3.3.d.4. Capas externas de la Tierra: hidrósfera, biósfera, litósfera y atmósfera, y sus interacciones.",
            "CN.3.3.d.5. Capas de la atmósfera y su importancia para la vida.",
          ],
          procedimentales: [
            "CN.3.3.p.1. Representar con maquetas o dibujos el sistema solar, las capas internas y externas de la Tierra y las capas de la atmósfera.",
            "CN.3.3.p.5. Comparar mediante esquemas la interacción entre geósfera, hidrósfera, atmósfera y biósfera en un ecosistema local.",
          ],
          actitudinales: [
            "CN.3.3.a.1. Valorar la Tierra como nuestro hogar y reconocer la importancia de cuidarla frente a riesgos naturales y ambientales.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SEXTO GRADO",
        indicadores: [
          { codigo: "I.CN.3.7.1", texto: "Comprende fenómenos como el ciclo del agua, el vulcanismo y su relación con la biodiversidad en el Ecuador" },
          { codigo: "I.CN.3.7.4", texto: "Comprende la importancia de participar en proyectos escolares y comunitarios de conservación ambiental, mostrando actitudes de corresponsabilidad, prevención y resiliencia ante amenazas naturales y climáticas" },
        ],
        saberes: {
          declarativos: [
            "CN.3.3.d.6. Reservas de agua dulce en Ecuador (glaciares andinos, páramos, ríos amazónicos, acuíferos subterráneos) y su importancia para las personas y los ecosistemas.",
            "CN.3.3.d.7. Principales contaminantes del agua: vertidos urbanos, agrícolas e industriales, y sus consecuencias en la salud y los ecosistemas.",
            "CN.3.3.d.8. Agentes geológicos internos (movimientos orogénicos y epirogénicos, vulcanismo, sismos) y sus consecuencias en el relieve, con ejemplos del Ecuador.",
            "CN.3.3.d.9. Relación entre relieve, agentes geológicos internos, externos y el clima en las diferentes regiones del Ecuador.",
          ],
          procedimentales: [
            "CN.3.3.p.2. Observar y registrar el ciclo del agua mediante experimentos sencillos, relacionándolo con la hidrósfera.",
            "CN.3.3.p.3. Identificar en mapas físicos del Ecuador las principales reservas de agua, volcanes, montañas y regiones climáticas.",
            "CN.3.3.p.4. Analizar casos locales de contaminación del agua, identificando causas y consecuencias para la salud y el ambiente.",
            "CN.3.3.p.6. Investigar cómo el relieve y los agentes geológicos internos y externos influyen en el clima de las regiones ecuatorianas.",
          ],
          actitudinales: [
            "CN.3.3.a.2. Desarrollar conciencia ambiental sobre los efectos de la contaminación del agua y del aire, y la necesidad de reducirlos.",
            "CN.3.3.a.3. Reconocer la importancia del relieve y del clima en la biodiversidad y la vida cotidiana en Ecuador.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SÉPTIMO GRADO",
        indicadores: [
          { codigo: "I.CN.3.7.1", texto: "Comprende el cambio climático y su impacto en la biodiversidad en el Ecuador" },
          { codigo: "I.CN.3.7.2", texto: "Analiza las causas y consecuencias de problemas ambientales (como contaminación del aire y del agua, cambio climático) y de riesgos naturales (como erupciones volcánicas, e inundaciones) a partir de datos locales y globales" },
          { codigo: "I.CN.3.7.3", texto: "Diseña propuestas de prevención, adaptación y mitigación frente a problemáticas ambientales y riesgos naturales, integrando saberes científicos y conocimientos locales/ancestrales" },
          { codigo: "I.CN.3.7.4", texto: "Comprende la importancia de participar en proyectos escolares y comunitarios de conservación ambiental, mostrando actitudes de corresponsabilidad, prevención y resiliencia ante amenazas naturales y climáticas" },
        ],
        saberes: {
          declarativos: [
            "CN.3.3.d.10. Contaminación atmosférica: causas naturales y antrópicas, y consecuencias para la salud y el ambiente.",
            "CN.3.3.d.11. Calentamiento de la superficie terrestre como resultado de la interacción entre la radiación solar y la atmósfera.",
            "CN.3.3.d.12. El clima en el Ecuador: principales zonas climáticas según relieve de las regiones naturales del Ecuador.",
            "CN.3.3.d.13. Fenómenos y catástrofes climáticas frecuentes en Ecuador (inundaciones, sequías, erupciones volcánicas) y sus efectos en la población y ecosistemas.",
          ],
          procedimentales: [
            "CN.3.3.p.7. Documentar fenómenos naturales y catástrofes en Ecuador mediante TIC y proponer medidas preventivas.",
            "CN.3.3.p.8. Analizar, a partir de observaciones, noticias o recursos multimedia, situaciones de contaminación atmosférica y de calentamiento de la superficie terrestre, identificando sus causas naturales y antrópicas y explicando de forma sencilla sus posibles efectos en la salud y en el ambiente.",
          ],
          actitudinales: [
            "CN.3.3.a.4. Fomentar actitudes responsables de prevención y solidaridad ante catástrofes naturales y climáticas.",
            "CN.3.3.a.5. Promover la corresponsabilidad ciudadana en el cuidado de las reservas de agua y en la mitigación del cambio climático.",
            "CN.3.3.a.6. Desarrollar curiosidad científica frente a la historia de la Tierra y la vida, conectando el pasado con problemas actuales.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.CN.3.8",
    descripcion: "Proponer soluciones a problemas cotidianos relacionados con la materia, la flotabilidad, las ondas, la luz y la energía mediante la experimentación y la indagación sistemática, evaluando propiedades y transformaciones de materiales y fenómenos de transmisión de energía (calor, sonido, luz y electricidad), para diseñar estrategias creativas y sostenibles que promuevan la comprensión científica y el uso responsable de los recursos naturales",
    competenciasClave: ["CMCT", "CC", "CD", "CCICC"],
    porGrado: [
      {
        nivel: "MEDIA",
        grado: "QUINTO GRADO",
        indicadores: [
          { codigo: "I.CN.3.8.3", texto: "Comprende problemas locales vinculados a la materia, analizando sus causas y consecuencias y proponiendo soluciones fundamentadas en la experimentación y la evidencia" },
          { codigo: "I.CN.3.8.4", texto: "Valora la experimentación, el trabajo en equipo y la creatividad científica como herramientas para comprender fenómenos físicos y promover un uso responsable y sostenible de los recursos naturales" },
        ],
        saberes: {
          declarativos: [
            "CN.3.4.d.3. Materias primas: origen natural (minerales, vegetales, animales) y su aprovechamiento.",
            "CN.3.4.d.4. Propiedades físicas de la materia: densidad, solubilidad, elasticidad, dureza y brillo.",
            "CN.3.4.d.5. Cambios de estado de la materia y su relación con la energía térmica.",
          ],
          procedimentales: [
            "CN.3.4.p.1. Utilizar instrumentos y procedimientos para medir masa y volumen de materiales y cuerpos.",
            "CN.3.4.p.2. Clasificar y describir materiales y mezclas según sus propiedades físicas observables.",
            "CN.3.4.p.3. Realizar experimentos sencillos para observar cambios de estado de la materia.",
            "CN.3.4.p.18. Investigar el origen y el procesamiento de materias primas utilizadas en la vida cotidiana, relacionándolas con consumo responsable y sostenibilidad.",
          ],
          actitudinales: [
            "CN.3.4.a.2. Desarrollar curiosidad científica frente a las propiedades de la materia y su comportamiento.",
            "CN.3.4.a.7. Reconocer el impacto ambiental que genera la producción y el uso de materiales y adoptar acciones concretas para reducir, reutilizar y reciclar, demostrando compromiso y preocupación por el cuidado del ambiente.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SEXTO GRADO",
        indicadores: [
          { codigo: "I.CN.3.8.1", texto: "Experimenta con materiales y fenómenos cotidianos ( luz, sonido y electricidad ), registrando datos y elaborando conclusiones que expliquen sus propiedades y transformaciones" },
          { codigo: "I.CN.3.8.2", texto: "Diseña y prueba modelos o prototipos sencillos (barcos flotantes, circuitos eléctricos, modelos atómicos, instrumentos para experimentar con ondas y luz), comunicando sus hallazgos. Comprende problemas locales vinculados a a la energía (por ejemplo, conservación de calor en alimentos, ahorro energético, contaminación lumínica o acústica), analizando sus causas y consecuencias y proponiendo soluciones fundamentadas en la experimentación y la evidencia" },
          { codigo: "I.CN.3.8.4", texto: "Valora la experimentación, el trabajo en equipo y la creatividad científica como herramientas para comprender fenómenos físicos y promover un uso responsable y sostenible de los recursos naturales" },
        ],
        saberes: {
          declarativos: [
            "CN.3.4.d.6. Concepto de onda como forma de transmisión de energía en la materia.",
            "CN.3.4.d.7. Transformaciones de la energía eléctrica en luz, calor, sonido y movimiento.",
            "CN.3.4.d.8. Propiedades del sonido: tono, intensidad, timbre y velocidad.",
            "CN.3.4.d.9. Propiedades elementales de la luz natural y la descomposición de la luz blanca.",
            "CN.3.4.d.10. Interacción de los cuerpos y materiales ante la luz: reflexión, absorción y transparencia.",
          ],
          procedimentales: [
            "CN.3.4.p.4. Simular ondas (agua, sonido) y registrar sus propiedades mediante instrumentos digitales o sencillos.",
            "CN.3.4.p.5. Experimentar con luz (descomposición, reflexión, absorción) para comprender fenómenos ópticos.",
          ],
          actitudinales: [
            "CN.3.4.a.1. Valorar la importancia de la energía en la vida cotidiana y la necesidad de usarla de forma responsable.",
            "CN.3.4.a.3. Fomentar actitudes de precisión, orden y seguridad en el trabajo experimental.",
            "CN.3.4.a.4. Fomentar hábitos de ahorro energético y consumo responsable en la escuela y la familia.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SÉPTIMO GRADO",
        indicadores: [
          { codigo: "I.CN.3.8.1", texto: "Experimenta con materiales y fenómenos cotidianos (flotabilidad, calor, luz, sonido, electricidad ), registrando datos y elaborando conclusiones que expliquen sus propiedades y transformaciones" },
          { codigo: "I.CN.3.8.3", texto: "Comprende problemas locales vinculados a la materia y la energía (por ejemplo, conservación de calor en alimentos, ahorro energético, contaminación lumínica o acústica), analizando sus causas y consecuencias y proponiendo soluciones fundamentadas en la experimentación y la evidencia" },
          { codigo: "I.CN.3.8.4", texto: "Valora la experimentación, el trabajo en equipo y la creatividad científica como herramientas para comprender fenómenos físicos y promover un uso responsable y sostenible de los recursos naturales" },
        ],
        saberes: {
          declarativos: [
            "CN.3.4.d.1. Estructura de la materia: átomos, elementos, moléculas y compuestos.",
            "CN.3.4.d.2. La tabla periódica de los elementos: utilidad básica para clasificar y organizar los elementos químicos.",
            "CN.3.4.d.11. Flotabilidad: fuerzas que intervienen y características de los cuerpos ante la misma.",
            "CN.3.4.d.12. Concepto de densidad y su relación con la flotación de los cuerpos.",
            "CN.3.4.d.13. Concepto de energía como capacidad de producir cambios.",
            "CN.3.4.d.14. Formas de energía: mecánica, térmica, eléctrica, luminosa y sonora.",
          ],
          procedimentales: [
            "CN.3.4.p.6. Investigar flotabilidad en cuerpos de distintas densidades mediante experimentos controlados.",
            "CN.3.4.p.8. Usar modelos sencillos para representar átomos, moléculas y compuestos.",
            "CN.3.4.p.19. Documentar en formato físico y digital experimentos sobre fenómenos físicos y químicos.",
          ],
          actitudinales: [
            "CN.3.4.a.1. Valorar la importancia de la energía en la vida cotidiana y la necesidad de usarla de forma responsable.",
            "CN.3.4.a.3. Fomentar actitudes de precisión, orden y seguridad en el trabajo experimental.",
            "CN.3.4.a.4. Fomentar hábitos de ahorro energético y consumo responsable en la escuela y la familia.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.CN.3.9",
    descripcion: "Analizar las diferentes formas de energía (mecánica, eléctrica, luminosa, sonora, térmica y magnética), sus transformaciones y el papel de las máquinas en la vida cotidiana, mediante la experimentación, la modelización y el estudio de situaciones reales, para plantear alternativas sostenibles que reduzcan el impacto ambiental y social del consumo energético y la corresponsabilidad ciudadana en la gestión de la energía",
    competenciasClave: ["CMCT", "CC", "CD", "CSE", "CCICC"],
    porGrado: [
      {
        nivel: "MEDIA",
        grado: "QUINTO GRADO",
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
        nivel: "MEDIA",
        grado: "SEXTO GRADO",
        indicadores: [
          { codigo: "I.CN.3.9.1", texto: "Explica cómo se transforman y transmiten las diferentes formas de energía en la vida cotidiana" },
          { codigo: "I.CN.3.9.2", texto: "Diseña máquinas simples, circuitos eléctricos y prototipos escolares para comprender el funcionamiento de la energía, comunicando los resultados con claridad mediante TIC, esquemas o informes" },
        ],
        saberes: {
          declarativos: [
            "CN.3.4.d.16. Máquinas como sistemas que transforman y transmiten energía.",
            "CN.3.4.d.17. Máquinas simples (palanca, polea, plano inclinado) y compuestas.",
            "CN.3.4.d.18. Tipos de fuerzas: de contacto (fricción, tensión) y de campo (gravitatoria, magnética, eléctrica).",
          ],
          procedimentales: [
            "CN.3.4.p.10. Construir modelos sencillos de máquinas para comprobar cómo transforman energía.",
            "CN.3.4.p.11. Experimentar con objetos para observar efectos de las fuerzas y comunicar resultados.",
          ],
          actitudinales: [
            "CN.3.4.a.6. Promover el trabajo colaborativo en investigaciones y proyectos científicos.",
            "CN.3.4.a.8. Fomentar la creatividad en el diseño de soluciones tecnológicas sostenibles.",
          ],
        },
      },
      {
        nivel: "MEDIA",
        grado: "SÉPTIMO GRADO",
        indicadores: [
          { codigo: "I.CN.3.9.1", texto: "Explica cómo se transforman y transmiten las diferentes formas de energía (mecánica, térmica, eléctrica, luminosa, sonora y magnética) en la vida cotidiana" },
          { codigo: "I.CN.3.9.2", texto: "Diseña máquinas simples, circuitos eléctricos y prototipos escolares para comprender el funcionamiento de la energía, comunicando los resultados con claridad mediante TIC, esquemas o informes" },
          { codigo: "I.CN.3.9.3", texto: "Propone alternativas sostenibles e innovadoras de ahorro y eficiencia energética, fundamentadas en evidencia científica y en saberes locales, valorando el aporte de mujeres científicas y tecnólogas como referentes" },
        ],
        saberes: {
          declarativos: [
            "CN.3.4.d.15. Principio de conservación de la energía.",
            "CN.3.4.d.19. Introducción a la energía eléctrica: corriente, voltaje y resistencia.",
            "CN.3.4.d.20. Magnetismo: imanes, polos magnéticos y aplicaciones en la vida diaria.",
            "CN.3.4.d.21. El magnetismo terrestre y su relación con la orientación (brújula).",
            "CN.3.4.d.22. Energías renovables y no renovables: ventajas e inconvenientes.",
            "CN.3.4.d.23. Mujeres científicas y tecnólogas que contribuyeron al estudio de la energía (referentes locales y globales).",
            "CN.3.4.d.24. Concepto básico de eficiencia energética y ejemplos de dispositivos eficientes (focos LED, electrodomésticos de bajo consumo, etc.).",
          ],
          procedimentales: [
            "CN.3.4.p.9. Construir ejemplos sencillos de circuitos eléctricos y reconocer la relación entre magnetismo y electricidad.",
            "CN.3.4.p.7. Demostrar transformaciones de energía con aparatos simples y juguetes (dinamo, motor eléctrico, bombilla).",
            "CN.3.4.p.12. Construir y probar circuitos eléctricos simples con materiales accesibles.",
            "CN.3.4.p.13. Experimentar con imanes para identificar polos y fuerza de atracción/repulsión.",
            "CN.3.4.p.14. Usar brújulas para comprender el magnetismo terrestre y la orientación.",
            "CN.3.4.p.15. Diseñar prototipos que utilicen energías renovables (solar, eólica) con materiales sencillos.",
            "CN.3.4.p.16. Analizar el consumo energético en el hogar, registrando los datos de los cálculos y mediciones, proponiendo medidas de ahorro.",
            "CN.3.4.p.17. Representar mediante diagramas o murales transformaciones de energía en la vida diaria.",
          ],
          actitudinales: [
            "CN.3.4.a.5. Valorar las contribuciones de mujeres científicas al desarrollo de la física y la química.",
            "CN.3.4.a.6. Promover el trabajo colaborativo en investigaciones y proyectos científicos.",
            "CN.3.4.a.8. Fomentar la creatividad en el diseño de soluciones tecnológicas sostenibles.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.CN.4.1",
    descripcion: "Explicar la célula como unidad fundamental de la vida y su evolución mediante el análisis de su estructura, sus procesos metabólicos y el ciclo celular, a través de la observación, la indagación y la interpretación de evidencias científicas, para comprender el papel de los microorganismos y valorar la biodiversidad y los procesos evolutivos que sostienen la vida en el planeta",
    competenciasClave: ["CMCT", "CC", "CD", "CCICC", "CSE"],
    porGrado: [
      {
        nivel: "SUPERIOR",
        grado: "OCTAVO GRADO",
        indicadores: [
          { codigo: "I.CN.4.1.1", texto: "Diferencia y compara las células animales y vegetales, identificando sus estructuras y funciones principales" },
          { codigo: "I.CN.4.1.2", texto: "Relaciona los procesos metabólicos de la fotosíntesis y la respiración celular como procesos interconectados que mantienen la vida en el planeta" },
          { codigo: "I.CN.4.1.3", texto: "Comprende el papel de las bacterias y otros microorganismos en los ecosistemas, valorando sus funciones beneficiosas y reconociendo también los riesgos potenciales para la salud y el ambiente" },
          { codigo: "I.CN.4.1.4", texto: "Comprende los ciclos celulares mitótico y meiótico, analizándolos como procesos de división celular que permiten el crecimiento, la reparación de tejidos y la formación de células sexuales, y relacionándolos de manera básica con la continuidad y la diversidad de los seres vivos, así como con la reproducción sexual y asexual en distintos organismos, describiendo su importancia para la supervivencia de la especie" },
        ],
        saberes: {
          declarativos: [
            "CN.4.1.d.1. La célula y la teoría celular como base de la vida: origen y evolución de las primeras formas celulares.",
            "CN.4.1.d.2. Tipos de célula: procariotas (bacterias) y eucariotas (animales y vegetales).",
            "CN.4.1.d.3. Estructura y función de los componentes celulares: membranas y orgánulos.",
          ],
          procedimentales: [
            "CN.4.1.p.1. Establecer semejanzas y diferencias entre la célula animal y la vegetal.",
            "CN.4.1.p.2. Observar a través de microscopio, apoyos visuales, TICS entre otros, diversas muestras de células.",
          ],
          actitudinales: [
            "CN.4.1.a.1. Cuestionarse a partir de evidencias científicas y modelos, cómo pudo surgir la vida celular y qué criterios se usan para definir un ser vivo.",
            "CN.4.1.a.2. Reflexionar sobre la antigüedad y utilidad de las bacterias como organismos beneficiosos.",
            "CN.4.1.a.3. Valorar que la célula es la unidad fundamental de la vida mostrando respeto por la diversidad de seres vivos y disposición a cuidar los ambientes donde habitan.",
            "CN.4.1.a.4. Valorar la indagación científica y el pensamiento crítico como herramientas para comprender la célula y los procesos evolutivos, participando activamente en actividades de observación y discusión.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "NOVENO GRADO",
        indicadores: [
          { codigo: "I.CN.4.1.1", texto: "Diferencia y compara las células animales y vegetales, identificando sus estructuras y funciones principales" },
          { codigo: "I.CN.4.1.2", texto: "Relaciona los procesos metabólicos de la fotosíntesis y la respiración celular como procesos interconectados que mantienen la vida en el planeta" },
          { codigo: "I.CN.4.1.3", texto: "Comprende el papel de las bacterias y otros microorganismos en los ecosistemas, valorando sus funciones beneficiosas y reconociendo también los riesgos potenciales para la salud y el ambiente" },
          { codigo: "I.CN.4.1.4", texto: "Comprende los ciclos celulares mitótico y meiótico, analizándolos como procesos de división celular que permiten el crecimiento, la reparación de tejidos y la formación de células sexuales, y relacionándolos de manera básica con la continuidad y la diversidad de los seres vivos, así como con la reproducción sexual y asexual en distintos organismos, describiendo su importancia para la supervivencia de la especie" },
        ],
        saberes: {
          declarativos: [
            "CN.4.1.d.2. Tipos de célula: procariotas (bacterias) y eucariotas (animales y vegetales).",
            "CN.4.1.d.3. Estructura y función de los componentes celulares: membranas y orgánulos.",
            "CN.4.1.d.4. Ciclo celular.",
            "CN.4.1.d.5. Reproducción sexual y asexual en los seres vivos.",
            "CN.4.1.d.6. Origen y agrupación de los dominios y reinos de la vida.",
          ],
          procedimentales: [
            "CN.4.1.p.1. Establecer semejanzas y diferencias entre la célula animal y la vegetal.",
            "CN.4.1.p.2. Observar a través de microscopio, apoyos visuales, TICS entre otros, diversas muestras de células.",
            "CN.4.1.p.3. Representar mediante diagramas simples los procesos de fotosíntesis y respiración celular, indicando entradas, salidas y relación entre ambos.",
            "CN.4.1.p.4. Analizar los ciclos celulares mitótico y meiótico.",
            "CN.4.1.p5. Describir la reproducción sexual y asexual en los seres vivos y su importancia para la supervivencia de la especie.",
          ],
          actitudinales: [
            "CN.4.1.a.2. Reflexionar sobre la antigüedad y utilidad de las bacterias como organismos beneficiosos.",
            "CN.4.1.a.3. Valorar que la célula es la unidad fundamental de la vida mostrando respeto por la diversidad de seres vivos y disposición a cuidar los ambientes donde habitan.",
            "CN.4.1.a.4. Valorar la indagación científica y el pensamiento crítico como herramientas para comprender la célula y los procesos evolutivos, participando activamente en actividades de observación y discusión.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "DÉCIMO GRADO",
        indicadores: [
          { codigo: "I.CN.4.1.1", texto: "Diferencia y compara las células animales y vegetales, identificando sus estructuras y funciones principales" },
          { codigo: "I.CN.4.1.2", texto: "Relaciona los procesos metabólicos de la fotosíntesis y la respiración celular como procesos interconectados que mantienen la vida en el planeta" },
          { codigo: "I.CN.4.1.3", texto: "Comprende el papel de las bacterias y otros microorganismos en los ecosistemas, valorando sus funciones beneficiosas y reconociendo también los riesgos potenciales para la salud y el ambiente" },
          { codigo: "I.CN.4.1.4", texto: "Comprende los ciclos celulares mitótico y meiótico, analizándolos como procesos de división celular que permiten el crecimiento, la reparación de tejidos y la formación de células sexuales, y relacionándolos de manera básica con la continuidad y la diversidad de los seres vivos, así como con la reproducción sexual y asexual en distintos organismos, describiendo su importancia para la supervivencia de la especie" },
        ],
        saberes: {
          declarativos: [
            "CN.4.1.d.4. Ciclo celular.",
            "CN.4.1.d.5. Reproducción sexual y asexual en los seres vivos.",
            "CN.4.1.d.7. Metabolismo celular básico: fotosíntesis (cloroplasto) y respiración celular (mitocondria).",
            "CN.4.1.d.8. Microorganismos y formas acelulares.",
            "CN.4.1.p.3. Representar mediante diagramas simples los procesos de fotosíntesis y respiración celular, indicando entradas, salidas y relación entre ambos.",
            "CN.4.1.p.4. Analizar los ciclos celulares mitótico y meiótico.",
            "CN.4.1.p5. Describir la reproducción sexual y asexual en los seres vivos y su importancia para la supervivencia de la especie.",
          ],
          procedimentales: [
            "CN.4.1.p.3. Representar mediante diagramas simples los procesos de fotosíntesis y respiración celular, indicando entradas, salidas y relación entre ambos.",
            "CN.4.1.p.4. Analizar los ciclos celulares mitótico y meiótico.",
            "CN.4.1.p5. Describir la reproducción sexual y asexual en los seres vivos y su importancia para la supervivencia de la especie.",
          ],
          actitudinales: [
            "CN.4.1.a.2. Reflexionar sobre la antigüedad y utilidad de las bacterias como organismos beneficiosos.",
            "CN.4.1.a.3. Valorar que la célula es la unidad fundamental de la vida mostrando respeto por la diversidad de seres vivos y disposición a cuidar los ambientes donde habitan.",
            "CN.4.1.a.4. Valorar la indagación científica y el pensamiento crítico como herramientas para comprender la célula y los procesos evolutivos, participando activamente en actividades de observación y discusión.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.CN.4.4",
    descripcion: "Explicar la estructura y dinámica de los ecosistemas ecuatorianos (Amazonía, Sierra, Costa e Insular) mediante la modelización, la formulación de hipótesis y el análisis de cadenas tróficas, ciclos biogeoquímicos y flujos de energía, para comprender los impactos de la actividad humana y promover actitudes de conservación y sostenibilidad ambiental",
    competenciasClave: ["CMTC", "CC", "CD", "CCICC", "CIT"],
    porGrado: [
      {
        nivel: "SUPERIOR",
        grado: "OCTAVO GRADO",
        indicadores: [
          { codigo: "I.CN.4.4.1", texto: "Distingue entre ecología y ecologismo, reconociendo los derechos de la naturaleza en el Ecuador y las normas para su cuidado y protección ambiental" },
          { codigo: "I.CN.4.4.2", texto: "Analiza y diferencia los distintos tipos de ecosistemas y sus componentes clave" },
          { codigo: "I.CN.4.4.3", texto: "Comprende la dinámica de las cadenas tróficas, los flujos de energía y los ciclos biogeoquímicos en diferentes ecosistemas, explicando cómo la energía se transforma y se degrada en cada nivel trófico y relacionándola con el principio de conservación de la energía" },
          { codigo: "I.CN.4.4.4", texto: "Reconoce y valora el entorno natural de Ecuador y propone estrategias concretas y viables para la conservación de los ecosistemas terrestres, acuáticos y mixtos" },
        ],
        saberes: {
          declarativos: [
            "CN.4.1.d.20. Diferencia entre ecología y ecologismo, y el reconocimiento de los derechos de la naturaleza en el Ecuador.",
            "CN.4.1.d.21. Ecosistemas y tipos.",
            "CN.4.1.d.22. Productores en los ecosistemas, su función en las cadenas tróficas y en el equilibrio del ecosistema.",
            "CN.4.1.d.23. Cadenas tróficas y flujos de energía.",
            "CN.4.1.d.24. Relaciones entre individuos.",
            "CN.4.1.d.25. Ciclos biogeoquímicos.",
          ],
          procedimentales: [
            "CN.4.1.p.16. Diferenciar tipos de ecosistemas en Ecuador.",
            "CN.4.1.p.17. Proponer estrategias para conservar los ecosistemas terrestres, acuáticos y mixtos.",
            "CN.4.1.p.18. Relacionar cadenas tróficas con el principio de conservación de la energía.",
            "CN.4.1.p.19. Modelizar los ciclos biogeoquímicos.",
          ],
          actitudinales: [
            "CN.4.1.a.8. Desarrollar una actitud crítica frente a prácticas que ponen en riesgo la biodiversidad.",
            "CN.4.1.a.9. Adquirir hábitos para sostenibilidad de recursos naturales.",
            "CN.4.1.a.10. Fomentar la curiosidad, la observación y el trabajo colaborativo en el estudio del entorno natural.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.CN.4.5",
    descripcion: "Formular estrategias de salud pública y autocuidado mediante el conocimiento de la anatomía, la fisiología y los sistemas básicos del cuerpo humano y sus funciones vitales (nutrición, relación y reproducción), con el fin de fomentar una alimentación equilibrada, la educación sexual integral, la vacunación y la prevención de adicciones, valorando la importancia de la salud individual y colectiva como fundamento del bienestar social",
    competenciasClave: ["CMTC", "CC", "CD", "CIT", "CSE"],
    porGrado: [
      {
        nivel: "SUPERIOR",
        grado: "OCTAVO GRADO",
        indicadores: [
          { codigo: "I.CN.4.5.1", texto: "Analiza la estructura y funciones del cuerpo humano (tejidos, órganos, aparatos y sistemas), relacionándolas con las funciones vitales de nutrición, relación y reproducción, para comprender su importancia en el mantenimiento de la salud" },
        ],
        saberes: {
          declarativos: [
            "CN.4.2.d.1. Estructura y funciones del cuerpo humano: tejido, órgano, aparato y sistema.",
            "CN.4.2.d.2. Funciones vitales: nutrición, relación y reproducción.",
          ],
          procedimentales: [
            "CN.4.2.p.1. Investigar sobre la estructura y funciones del cuerpo humano.",
          ],
          actitudinales: [
            "CN.4.2.a.1. Valorar la importancia de estilos de vida saludables: alimentación, ejercicio y salud sexual.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "NOVENO GRADO",
        indicadores: [
          { codigo: "I.CN.4.5.2", texto: "Explica, con ejemplos cercanos, cómo una alimentación saludable (nutrientes, dietas equilibradas, reducción de ultraprocesados) contribuye al funcionamiento adecuado de los sistemas de nutrición y a la prevención de enfermedades crónicas y trastornos alimenticios" },
        ],
        saberes: {
          declarativos: [
            "CN.4.2.d.3. Alimentación saludable: nutrientes, dietas equilibradas y riesgos de los alimentos ultraprocesados.",
          ],
          procedimentales: [
            "CN.4.2.p.1. Investigar sobre las enfermedades nutricionales comunes (obesidad, diabetes, trastornos alimenticios).",
          ],
          actitudinales: [
            "CN.4.2.a.1. Valorar la importancia de estilos de vida saludables: alimentación, ejercicio.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "DÉCIMO GRADO",
        indicadores: [
          { codigo: "I.CN.4.5.3", texto: "Explica los componentes de la salud sexual integral (reproducción, infecciones de transmisión sexual, prevención y bienestar socioemocional), analizando sus implicaciones personales en el proyecto de vida y proponiendo medidas de cuidado, respeto y toma de decisiones informadas" },
          { codigo: "I.CN.4.5.4", texto: "Explica el papel de los virus, el sistema inmune y las vacunas en la prevención de enfermedades, diferenciando tipos de vacunas y medicamentos (antibióticos, antivirales, antimicóticos) y valorando un uso responsable y fundamentado" },
          { codigo: "I.CN.4.5.5", texto: "Compara prácticas de medicina tradicional y plantas medicinales ecuatorianas con la medicina basada en evidencia, reconociendo beneficios, limitaciones y riesgos, así como la importancia de la lactancia materna para la salud física y emocional" },
          { codigo: "I.CN.4.5.6", texto: "Relaciona estilos de vida (alimentación, ejercicio, efectos negativos de sustancias nocivas, uso de redes sociales y tecnología) con la salud integral, proponiendo actividades de autocuidado y estrategias para mejorar el bienestar personal" },
        ],
        saberes: {
          declarativos: [
            "CN.4.2.d.4. Salud sexual integral: reproducción, enfermedades de trasmisión sexual, prevención y bienestar socioemocional.",
            "CN.4.2.d.5. Características de los virus y formas de trasmisión.",
            "CN.4.2.d.6. Sistema inmune y vacunas: defensas, mecanismos de acción, tipos e historia.",
            "CN.4.2.d.7. Medicamentos y antibióticos: concepto de principio activo, beneficios y riesgos del exceso.",
            "CN.4.2.d.8. Remedios naturales y plantas medicinales del Ecuador: usos, beneficios y limitaciones.",
            "CN.4.2.d.9. Lactancia materna: importancia como alimento, medicina preventiva, bienestar emocional y la promoción del vínculo afectivo.",
            "CN.4.2.d.10. Salud integral: cuerpo, mente, emociones y relaciones sociales.",
          ],
          procedimentales: [
            "CN.4.2.p.2. Analizar los efectos negativos del alcohol y drogas sobre el sistema nervioso y la salud integral.",
            "CN.4.2.p.3. Investigar sobre las enfermedades de transmisión sexual agruparlas en virales, bacterianas y micóticas, y sus implicaciones socioemocionales.",
            "CN.4.2.p.4. Relacionar los hábitos de consumo alimenticio con enfermedades crónicas y huella ecológica.",
            "CN.4.2.p.5. Documentar sobre la medicina tradicional y plantas medicinales ecuatorianas contrastadas con la ciencia.",
            "CN.4.2.p.6. Explorar y practicar actividades de autocuidado: yoga, meditación, arte, deporte, respiración consciente y desarrollar actividades de contacto con la naturaleza para mejorar bienestar emocional y la concentración.",
            "CN.4.2.p.7. Analizar críticamente el impacto de redes sociales y tecnología en la salud mental.",
          ],
          actitudinales: [
            "CN.4.2.a.1. Valorar la importancia de estilos de vida saludables: alimentación, ejercicio y salud sexual.",
            "CN.4.2.a.2. Adoptar una actitud crítica frente al uso de antibióticos, medicamentos y vacunas (antibióticos, antivirales y antimicóticos) fomentando un consumo responsable y fundamentado.",
            "CN.4.2.a.3. Reconocer y valorar distintas formas de cuidado de la salud como la lactancia, los saberes ancestrales y la salud de la mujer promoviendo la salud mental, la sostenibilidad y la cooperación social.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.CN.4.6",
    descripcion: "Proponer medidas de prevención de riesgos geológicos del Ecuador, mediante el conocimiento de los procesos geológicos internos y externos, su evolución a lo largo de las escalas de tiempo y los principales eventos de la historia del Ecuador, para predecir y mitigar posibles eventos futuros que puedan afectar a la conservación del patrimonio natural y cultural, valorando la importancia de la gestión del riesgo para la seguridad de las poblaciones",
    competenciasClave: ["CTMC", "CC", "CCICC", "CIT", "CSE"],
    porGrado: [
      {
        nivel: "SUPERIOR",
        grado: "OCTAVO GRADO",
        indicadores: [
          { codigo: "I.CN.4.6.1", texto: "Analiza los principales procesos geológicos internos y externos de Ecuador (vulcanismo, sismicidad y formación del relieve) para evaluar los riesgos asociados" },
          { codigo: "I.CN.4.6.2", texto: "Comprende la estructura y dinámica de la geósfera y la teoría de la tectónica de placas con posibles impactos en los ecosistemas y las poblaciones" },
        ],
        saberes: {
          declarativos: [
            "CN.4.3.d.1. Escalas del tiempo geológico y principales eventos en la historia del Ecuador.",
            "CN.4.3.d.2. Estructura y dinámica de la geósfera.",
          ],
          procedimentales: [
            "CN.4.3.p.3. Analizar cronologías y escalas de tiempo geológico vinculadas a eventos relevantes en el territorio ecuatoriano.",
            "CN.4.3.p.6. Reconocer e investigar problemas socioambientales locales y globales asociados a la dinámica geológica.",
          ],
          actitudinales: [
            "CN.4.3.a.1. Valorar la importancia del conocimiento geológico para la seguridad de las comunidades y la conservación del paisaje.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "NOVENO GRADO",
        indicadores: [
          { codigo: "I.CN.4.6.2", texto: "Comprende la estructura y dinámica de la geósfera y la teoría de la tectónica de placas con posibles impactos en los ecosistemas y las poblaciones" },
          { codigo: "I.CN.4.6.3", texto: "Diseña propuestas de prevención y mitigación de riesgos geológicos en la escuela y la comunidad (planes de evacuación, uso responsable del suelo, educación en emergencias), integrando información científica y el contexto local, y demostrando actitudes de responsabilidad, cooperación y solidaridad, así como una reflexión crítica sobre cómo las acciones humanas pueden intensificar dichos riesgos" },
        ],
        saberes: {
          declarativos: [
            "CN.4.3.d.4. Procesos geológicos internos: vulcanismo, sismicidad, formación de cordilleras.",
            "CN.4.3.d.5. Procesos geológicos externos: erosión, meteorización, sedimentación.",
            "CN.4.3.d.6. Riesgos naturales de origen geológico en Ecuador: terremotos, erupciones, tsunamis, deslizamientos.",
          ],
          procedimentales: [
            "CN.4.3.p.1. Identificar y clasificar los principales procesos internos y externos en ejemplos locales y regionales.",
            "CN.4.3.p.2. Interpretar mapas geológicos, tectónicos y de riesgos naturales del Ecuador.",
            "CN.4.3.p.4. Establecer relaciones entre actividad humana y aumento de vulnerabilidad frente a riesgos geológicos.",
            "CN.4.3.p.5. Formular propuestas de medidas de prevención y mitigación de riesgos naturales en el ámbito escolar y comunitario.",
            "CN.4.3.p.6. Reconocer e investigar problemas socioambientales locales y globales asociados a la dinámica geológica.",
          ],
          actitudinales: [
            "CN.4.3.a.2. Adoptar una actitud responsable en la prevención y gestión de riesgos geológicos.",
            "CN.4.3.a.3. Reconocer la vulnerabilidad de poblaciones locales y promover la solidaridad y la cooperación en situaciones de emergencia.",
            "CN.4.3.a.4. Desarrollar conciencia crítica sobre el impacto humano en la intensificación de riesgos naturales.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.CN.4.7",
    descripcion: "Diseñar modelos explicativos sobre el origen y la evolución del planeta Tierra desde una perspectiva holística, mediante la integración del paradigma biológico de la evolución de los seres vivos (a partir del registro fósil) y del paradigma geológico de la deriva continental, para comprender los procesos que configuraron el relieve y posibilitaron la aparición de la vida, valorando la importancia de la investigación científica para interpretar el pasado y proyectar el futuro del planeta",
    competenciasClave: ["CMCT", "CC", "CCICC", "CIT", "CECA"],
    porGrado: [
      {
        nivel: "SUPERIOR",
        grado: "OCTAVO GRADO",
        indicadores: [
          { codigo: "I.CN.4.7.1", texto: "Demuestra cómo los procesos geológicos y biológicos se han influenciado mutuamente a lo largo del tiempo geológico, moldeando el relieve del planeta y la evolución de la vida" },
          { codigo: "I.CN.4.7.2", texto: "Explica el ciclo de formación de las rocas (origen, transformación y clasificación) y su relación con procesos eruptivos y tectónicos, vinculándolos con cambios en la corteza terrestre y en los ambientes donde se desarrollan los seres vivos" },
          { codigo: "I.CN.4.7.3", texto: "Analiza la distribución de fósiles y especies actuales para relacionarla con modelos geológicos como la deriva continental y la tectónica de placas, identificando evidencias de desplazamiento de continentes y cambios en la biodiversidad" },
          { codigo: "I.CN.4.7.4", texto: "Valora el patrimonio geológico y paleontológico como fuente fundamental de información para comprender la historia natural de la Tierra y la vida, reconociendo su importancia científica, educativa y cultural, y adoptando una actitud crítica frente al carácter provisional del conocimiento científico" },
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
          { codigo: "I.CN.4.7.1", texto: "Demuestra cómo los procesos geológicos y biológicos se han influenciado mutuamente a lo largo del tiempo geológico, moldeando el relieve del planeta y la evolución de la vida" },
          { codigo: "I.CN.4.7.2", texto: "Explica el ciclo de formación de las rocas (origen, transformación y clasificación) y su relación con procesos eruptivos y tectónicos, vinculándolos con cambios en la corteza terrestre y en los ambientes donde se desarrollan los seres vivos" },
          { codigo: "I.CN.4.7.3", texto: "Analiza la distribución de fósiles y especies actuales para relacionarla con modelos geológicos como la deriva continental y la tectónica de placas, identificando evidencias de desplazamiento de continentes y cambios en la biodiversidad" },
          { codigo: "I.CN.4.7.4", texto: "Valora el patrimonio geológico y paleontológico como fuente fundamental de información para comprender la historia natural de la Tierra y la vida, reconociendo su importancia científica, educativa y cultural, y adoptando una actitud crítica frente al carácter provisional del conocimiento científico" },
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
          { codigo: "I.CN.4.7.1", texto: "Demuestra cómo los procesos geológicos y biológicos se han influenciado mutuamente a lo largo del tiempo geológico, moldeando el relieve del planeta y la evolución de la vida" },
          { codigo: "I.CN.4.7.2", texto: "Explica el ciclo de formación de las rocas (origen, transformación y clasificación) y su relación con procesos eruptivos y tectónicos, vinculándolos con cambios en la corteza terrestre y en los ambientes donde se desarrollan los seres vivos" },
          { codigo: "I.CN.4.7.3", texto: "Analiza la distribución de fósiles y especies actuales para relacionarla con modelos geológicos como la deriva continental y la tectónica de placas, identificando evidencias de desplazamiento de continentes y cambios en la biodiversidad" },
          { codigo: "I.CN.4.7.4", texto: "Valora el patrimonio geológico y paleontológico como fuente fundamental de información para comprender la historia natural de la Tierra y la vida, reconociendo su importancia científica, educativa y cultural, y adoptando una actitud crítica frente al carácter provisional del conocimiento científico" },
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
    codigo: "CE.CN.4.8",
    descripcion: "Diseñar modelos explicativos sobre las teorías del Universo, el sistema solar y los principales fenómenos astronómicos mediante el desarrollo de proyectos colaborativos de investigación y comunicación científica, para comprender la evolución de los modelos astronómicos (geocéntrico, heliocéntrico e hipótesis nebular) y valorar el papel de los telescopios y de la exploración espacial en el avance del conocimiento humano",
    competenciasClave: ["CMCT", "CC", "CCICC", "CIT", "CECA"],
    porGrado: [
      {
        nivel: "SUPERIOR",
        grado: "OCTAVO GRADO",
        indicadores: [
          { codigo: "I.CN.4.8.1", texto: "Explica la composición del sistema solar" },
          { codigo: "I.CN.4.8.2", texto: "Construye modelos explicativos del Universo, del sistema solar y de fenómenos astronómicos relevantes (eclipses, fases lunares, cometas, mareas) mediante proyectos colaborativos, utilizando diversas fuentes de información científica y tecnológica y representándolos en maquetas, gráficos o simulaciones digitales. Investiga en diversas fuentes (digitales, bibliográficas y audiovisuales) sobre teorías del origen del Universo, características de los planetas y evolución de los telescopios, comunicando los resultados en formatos como exposiciones, infografías o videos. )Re" },
        ],
        saberes: {
          declarativos: [
            "CN.4.3.d.16. Composición y características esenciales de los planetas del sistema solar: planetas rocosos, gaseosos y helados, considerando su estructura, atmósfera y condiciones físicas básicas.",
            "CN.4.3.d.17. Fenómenos astronómicos relevantes: eclipses, fases lunares, cometas y mareas.",
            "CN.4.3.d.18. Evolución y aportes de los telescopios en el conocimiento astronómico, con énfasis en el telescopio como instrumento de observación y descubrimiento.",
            "CN.4.3.d.19. Contribución histórica de mujeres científicas, mediante el reconocimiento de algunas astrónomas y científicas espaciales relevantes.",
            "CN.4.3.d.20. Naturaleza del conocimiento sobre el origen y funcionamiento del Universo: carácter histórico, evolutivo y multicultural, con aproximación a saberes astronómicos de pueblos y culturas diversas.",
          ],
          procedimentales: [
            "CN.4.3.p.11. Formular preguntas e hipótesis sobre fenómenos astronómicos, especialmente a partir de la observación de la Luna, el cielo diurno y nocturno, los eclipses o los cambios estacionales.",
            "CN.4.3.p.13. Construir y representar modelos explicativos gráficos, maquetas y simulaciones sencillas sobre los planetas, las fases de la Luna y los eclipses.",
            "CN.4.3.p.14. Comunicar resultados en formatos básicos: dibujos científicos, carteles, fichas planetarias, exposiciones orales breves e infografías sencillas.",
            "CN.4.3.p.16. Relacionar fenómenos astronómicos con la vida cotidiana: calendario, orientación, cambios visibles de la Luna, actividades agrícolas y organización del tiempo.",
          ],
          actitudinales: [
            "CN.4.3.a.10. Valorar la diversidad de los planetas del sistema solar como parte del patrimonio científico de la humanidad, desarrollando curiosidad, asombro y respeto hacia la exploración espacial.",
            "CN.4.3.a.12. Respetar y mostrar predisposición al trabajo colaborativo en equipos diversos.",
            "CN.4.3.a.13. Tener curiosidad y asombro frente a la observación del cielo y los fenómenos del cosmos.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "NOVENO GRADO",
        indicadores: [
          { codigo: "I.CN.4.8.1", texto: "Compara los principales modelos astronómicos (geocéntrico, heliocéntrico y la hipótesis nebular como modelo de formación del sistema solar), explicando sus características, sus aportes al conocimiento del sistema solar y sus limitaciones en el contexto histórico en que surgieron Construye modelos explicativos del Universo de fenómenos astronómicos relevantes (eclipses, fases lunares, cometas, mareas) mediante proyectos colaborativos, utilizando diversas fuentes de información científica y tecnológica y representándolos en maquetas, gráficos o simulaciones digitales" },
          { codigo: "I.CN.4.8.3", texto: "Investiga en diversas fuentes (digitales, bibliográficas y audiovisuales) sobre los modelos del sistema solar: geocéntrico, heliocéntrico e hipótesis nebular" },
        ],
        saberes: {
          declarativos: [
            "CN.4.3.d.15. Modelos del sistema solar: geocéntrico, heliocéntrico e hipótesis nebular. Eclipses, fases lunares, mareas y cometas por medio de modelos Sol,Tierra, Luna y relaciones gravitacionales básicas.",
          ],
          procedimentales: [
            "CN.4.3.p.12. Investigar en fuentes digitales, bibliográficas y audiovisuales para contrastar los modelos geocéntrico, heliocéntrico y nebular.",
            "CN.4.3.p.13. Construir y representar modelos explicativos de mayor complejidad: movimientos relativos, ordenamiento planetario, eclipses, fases lunares, mareas y formación básica del sistema solar.",
            "CN.4.3.p.14. Comunicar resultados mediante cuadros comparativos, líneas de tiempo, informes breves, presentaciones digitales o infografías científicas.",
            "CN.4.3.p.15. Desarrollar proyectos colaborativos que integren observación, construcción de modelos, investigación histórica y comunicación científica.",
          ],
          actitudinales: [
            "CN.4.3.a.8. Valorar la astronomía como construcción colectiva y en constante evolución.",
            "CN.4.3.a.11. Poseer una actitud crítica frente a modelos y teorías, comprendiendo que cambian ante nuevas evidencias.",
            "CN.4.3.a.12. Respetar y mostrar predisposición al trabajo colaborativo en equipos diversos.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "DÉCIMO GRADO",
        indicadores: [
          { codigo: "I.CN.4.8.1", texto: "Compara los principales modelos astronómicos (geocéntrico, heliocéntrico y la hipótesis nebular como modelo de formación del sistema solar), explicando sus características, sus aportes al conocimiento del sistema solar y sus limitaciones en el contexto histórico en que surgieron" },
          { codigo: "I.CN.4.8.2", texto: "Construye modelos explicativos del Universo, del sistema solar y de fenómenos astronómicos relevantes (eclipses, fases lunares, cometas, mareas) mediante proyectos colaborativos, utilizando diversas fuentes de información científica y tecnológica y representándolos en maquetas, gráficos o simulaciones digitales" },
          { codigo: "I.CN.4.8.3", texto: "Investiga en diversas fuentes (digitales, bibliográficas y audiovisuales) sobre teorías del origen del Universo, características de los planetas y evolución de los telescopios, comunicando los resultados en formatos como exposiciones, infografías o videos y reconociendo el aporte de mujeres y distintas culturas a la astronomía" },
        ],
        saberes: {
          declarativos: [
            "CN.4.3.d.14. Teorías sobre el origen del Universo: Big Bang y teorías alternativas.",
            "CN.4.3.d.19. Contribución histórica de mujeres científicas, con profundización en el análisis de sus aportes, obstáculos, reconocimiento histórico y presencia actual de mujeres en ciencias espaciales.",
            "CN.4.3.d.20. Naturaleza del conocimiento sobre el origen y funcionamiento del Universo: carácter histórico, evolutivo y multicultural, con análisis de evidencias, modelos científicos y saberes culturales diversos.",
          ],
          procedimentales: [
            "CN.4.3.p.11. Formular preguntas e hipótesis investigables sobre el origen, evolución y funcionamiento del Universo, justificándolas mediante conocimientos previos.",
            "CN.4.3.p.12. Investigar y contrastar teorías, modelos y evidencias mediante fuentes confiables, identificando autoría, fecha, propósito, respaldo científico y posibles limitaciones.",
            "CN.4.3.p.14. Comunicar conclusiones mediante informes, debates, ensayos breves, videos, pódcast, exposiciones argumentadas o infografías fundamentadas.",
            "CN.4.3.p.15. Desarrollar proyectos colaborativos que articulen astronomía, historia de la ciencia, aportes de mujeres, diversidad cultural, tecnología y divulgación científica.",
          ],
          actitudinales: [
            "CN.4.3.a.8. Valorar la astronomía como construcción colectiva y en constante evolución.",
            "CN.4.3.a.9. Reconocer el aporte de mujeres y culturas diversas a la astronomía.",
            "CN.4.3.a.11. Poseer una actitud crítica frente a modelos y teorías, comprendiendo que cambian con nuevas evidencias.",
            "CN.4.3.a.12. Respetar y mostrar predisposición al trabajo colaborativo en equipos diversos.",
            "CN.4.3.a.13. Tener curiosidad y asombro frente a la observación del cielo y los fenómenos del cosmos.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.CN.4.9",
    descripcion: "Explicar las propiedades y la composición de la materia orgánica e inorgánica mediante el uso del lenguaje químico básico y la aplicación de conocimientos experimentales, para comprender procesos naturales y productivos relevantes del país, como la agricultura y la industria, valorando la importancia de la química en el desarrollo sostenible y en la mejora de la calidad de vida",
    competenciasClave: ["CMCT", "CC", "CD", "CCICC"],
    porGrado: [
      {
        nivel: "SUPERIOR",
        grado: "OCTAVO GRADO",
        indicadores: [
          { codigo: "I.CN.4.9.1", texto: "Utiliza correctamente el lenguaje químico básico (símbolos, fórmulas sencillas y nomenclatura elemental) para representar átomos, elementos y compuestos orgánicos e inorgánicos relacionados con situaciones cotidianas y productivas del Ecuador" },
          { codigo: "I.CN.4.9.4", texto: "Valora la importancia de la química en la agricultura, la industria y el cuidado del ambiente, reconociendo impactos sociales y económicos de procesos como la combustión y el uso de fertilizantes, mostrando actitud crítica y respeto por normas de bioseguridad" },
        ],
        saberes: {
          declarativos: [
            "CN.4.4.d.1. Materia, átomos, elementos y compuestos.",
            "CN.4.4.d.3. Características generales de las reacciones químicas: reactivos, productos y energía, en un nivel introductorio.",
            "CN.4.4.d.5. Reacciones químicas de interés cotidiano y productivo: combustión y fermentación, con énfasis en reconocer ejemplos y resultados observables.",
          ],
          procedimentales: [
            "CN.4.4.p.4. Relacionar ejemplos locales producción agrícola, fermentación artesanal y combustibles con reacciones químicas concretas.",
          ],
          actitudinales: [
            "CN.4.4.a.1. Valorar la importancia de la química para explicar procesos naturales y productivos en el Ecuador.",
            "CN.4.4.a.3. Mostrar interés y actitud crítica frente al uso de procesos químicos en la vida cotidiana, la industria y la agricultura.",
            "CN.4.4.a.4. Promover el respeto a normas de bioseguridad en la manipulación de materiales y reacciones químicas en el laboratorio y la vida cotidiana.",
            "CN.4.1.a.5. Valorar el papel de la fermentación en la vida humana.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "NOVENO GRADO",
        indicadores: [
          { codigo: "I.CN.4.9.2", texto: "Explica la composición y propiedades de sustancias orgánicas e inorgánicas (por ejemplo, combustibles, fertilizantes, productos de fermentación), relacionándolas con procesos naturales y productivos del país y con la ley de conservación de la masa en reacciones químicas simples" },
          { codigo: "I.CN.4.9.4", texto: "Valora la importancia de la química en la agricultura, la industria y el cuidado del ambiente, reconociendo impactos sociales y económicos de procesos como la combustión y el uso de fertilizantes, mostrando actitud crítica y respeto por normas de bioseguridad" },
        ],
        saberes: {
          declarativos: [
            "CN.4.4.d.2. Ley de la conservación de la masa.",
            "CN.4.4.d.3. Características generales de las reacciones químicas: reactivos, productos y energía, con profundización en la representación mediante ecuaciones químicas.",
            "CN.4.4.d.5. Reacciones químicas de interés cotidiano y productivo: combustión y fermentación, con representación y explicación básica.",
          ],
          procedimentales: [
            "CN.4.4.p.1. Ajustar ecuaciones químicas simples verificando la conservación de la masa.",
            "CN.4.4.p.2. Predecir productos en reacciones químicas sencillas: combustión y fermentación.",
            "CN.4.4.p.4. Relacionar ejemplos locales producción agrícola, fermentación artesanal y combustibles con reacciones químicas concretas, con mayor precisión conceptual.",
          ],
          actitudinales: [
            "CN.4.4.a.1. Valorar la importancia de la química para explicar procesos naturales y productivos en el Ecuador.",
            "CN.4.4.a.2. Reconocer el impacto ambiental y social de reacciones químicas como la combustión y su relación con la sostenibilidad.",
            "CN.4.4.a.3. Mostrar interés y actitud crítica frente al uso de procesos químicos en la vida cotidiana, la industria y la agricultura.",
            "CN.4.4.a.4. Promover el respeto a normas de bioseguridad en la manipulación de materiales y reacciones químicas en el laboratorio y la vida cotidiana.",
            "CN.4.1.a.5. Valorar el papel de la fermentación en la vida humana.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "DÉCIMO GRADO",
        indicadores: [
          { codigo: "I.CN.4.9.1", texto: "Utiliza correctamente el lenguaje químico básico (símbolos, fórmulas sencillas y nomenclatura elemental) para representar átomos, elementos y compuestos orgánicos e inorgánicos relacionados con situaciones cotidianas y productivas del Ecuador" },
          { codigo: "I.CN.4.9.2", texto: "Explica la composición y propiedades de sustancias orgánicas e inorgánicas (por ejemplo, combustibles, fertilizantes, productos de fermentación), relacionándolas con procesos naturales y productivos del país y con la ley de conservación de la masa en reacciones químicas simples" },
          { codigo: "I.CN.4.9.3", texto: "Ajusta ecuaciones químicas sencillas y analiza experimentalmente factores que modifican la velocidad de reacciones de interés cotidiano (combustión, fermentación), verificando la conservación de la masa y prediciendo productos de manera fundamentada" },
          { codigo: "I.CN.4.9.4", texto: "Valora la importancia de la química en la agricultura, la industria y el cuidado del ambiente, reconociendo impactos sociales y económicos de procesos como la combustión y el uso de fertilizantes, mostrando actitud crítica y respeto por normas de bioseguridad" },
        ],
        saberes: {
          declarativos: [
            "CN.4.4.d.4. Factores que influyen en la velocidad de las reacciones químicas.",
            "CN.4.4.d.6. Importancia de la química en procesos agrícolas e industriales del Ecuador.",
            "CN.4.4.d.5. Reacciones químicas de interés cotidiano y productivo: combustión y fermentación. Características generales de las reacciones químicas: reactivos, productos y energía, incorporando velocidad, energía y condiciones de reacción. (Ref;.",
          ],
          procedimentales: [
            "CN.4.4.p.3. Analizar experimentalmente factores que modifican la velocidad de una reacción. Relacionar ejemplos locales producción agrícola, fermentación artesanal y combustiblescon reacciones químicas concretas, integrando explicación científica, datos y análisis de sostenibilidad.",
            "CN.4.4.p.1. Ajustar ecuaciones químicas simples verificando la conservación de la masa, como herramienta de apoyo para interpretar reacciones.",
            "CN.4.4.p.2. Predecir productos en reacciones químicas sencillas, vinculada con experiencias de combustión y fermentación.",
          ],
          actitudinales: [
            "CN.4.4.a.1. Valorar la importancia de la química para explicar procesos naturales y productivos en el Ecuador.",
            "CN.4.4.a.2. Reconocer el impacto ambiental y social de reacciones químicas como la combustión y su relación con la sostenibilidad.",
            "CN.4.4.a.3. Mostrar interés y actitud crítica frente al uso de procesos químicos en la vida cotidiana, la industria y la agricultura.",
            "CN.4.4.a.4. Promover el respeto a normas de bioseguridad en la manipulación de materiales y reacciones químicas en el laboratorio y la vida cotidiana.",
            "CN.4.1.a.5. Valorar el papel de la fermentación en la vida humana.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.CN.4.10",
    descripcion: "Explicar, a partir de la experimentación, la aplicación de conocimientos sobre fenómenos físicos cotidianos (movimiento, fuerzas, energía, electricidad, densidad, presión y magnetismo) y el uso del pensamiento computacional en la construcción de prototipos o artefactos sencillos, para resolver problemas socioambientales y valorar la ciencia y la tecnología como herramientas para el desarrollo sostenible y la mejora de la calidad de vida",
    competenciasClave: ["CMCT", "CC", "CD", "CIT", "CCICC", "CECA"],
    porGrado: [
      {
        nivel: "SUPERIOR",
        grado: "OCTAVO GRADO",
        indicadores: [
          { codigo: "I.CN.4.10.1", texto: "Explica fenómenos físicos cotidianos en el contexto ecuatoriano (movimiento, fuerzas equilibradas y no equilibradas, tipos de energía y sus transformaciones, electricidad, magnetismo, presión, densidad y sonido), relacionándolos con posibles aplicaciones tecnológicas para mejorar la calidad de vida y atender problemas socioambientales" },
          { codigo: "I.CN.4.10.2", texto: "Experimenta con prototipos o artefactos sencillos que aplican principios de movimiento, fuerzas, energía, electricidad o magnetismo, analizando su eficiencia, seguridad y sostenibilidad, y proponiendo mejoras basadas en resultados experimentales" },
          { codigo: "I.CN.4.10.3", texto: "Determina la relación entre masa, fuerza y movimiento de los objetos, así como entre densidad y presión de sólidos, líquidos y gases, mediante experiencias y resolución de problemas, explicando el comportamiento de los materiales en situaciones cotidianas y su vínculo con el diseño de soluciones tecnológicas (por ejemplo, autos eléctricos frente a gasolina). Aplica pensamiento computacional (formulación de algoritmos, descomposición de problemas, simulaciones digitales) en el diseño, prueba o comunicación de prototipos y soluciones tecnológicas, investigando" },
        ],
        saberes: {
          declarativos: [
            "CN.4.4.d.7. Movimiento y fuerzas en situaciones cotidianas.",
            "CN.4.4.d.8. Aplicación de las fuerzas equilibradas.",
            "CN.4.4.d.9. Fuerzas no equilibradas.",
            "CN.4.4.d.10. Tipos de energía y transformaciones en sistemas simples.",
            "CN.4.4.d.11. Principios básicos del magnetismo y sus aplicaciones prácticas.",
            "CN.4.4.d.12. Presión absoluta, atmosférica nanométrica.",
            "CN.4.4.d.13. Densidad de los objetos sólidos, líquidos y gaseosos.",
          ],
          procedimentales: [
            "CN.4.4.p.6. Diseñar y construir prototipos experimentales que apliquen principios de movimiento, fuerzas, energía o magnetismo, sencillos.",
            "CN.4.4.p.5. Identificar problemas socioambientales locales que puedan resolverse con artefactos tecnológicos sencillos, mediante observación del aula, hogar o comunidad.",
            "CN.4.4.p.7. Relacionar entre masa, fuerza y la respuesta de un objeto. Evaluar la eficiencia, seguridad y sostenibilidad de los artefactos construidos, proponiendo mejoras, en una versión básica: comprobar si funciona, si es seguro y si usa materiales reutilizable.",
          ],
          actitudinales: [
            "CN.4.4.a.6. Mostrar responsabilidad en el uso de materiales y recursos durante el diseño y construcción de artefactos.",
            "CN.4.4.a.8. Fomentar la colaboración y el respeto en el trabajo en equipo para el diseño de prototipos.",
            "CN.4.4.a.11. Valorar la creatividad y la innovación como herramientas para resolver problemas socioambientales.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "NOVENO GRADO",
        indicadores: [
          { codigo: "I.CN.4.10.1", texto: "Explica fenómenos físicos cotidianos en el contexto ecuatoriano,relacionándolos con posibles aplicaciones tecnológicas para mejorar la calidad de vida y atender problemas socioambientales" },
          { codigo: "I.CN.4.10.2", texto: "Experimenta con prototipos o artefactos sencillos que aplican principios de movimiento, fuerzas, energía, electricidad , analizando su eficiencia, seguridad y sostenibilidad, y proponiendo mejoras basadas en resultados experimentales" },
          { codigo: "I.CN.4.10.4", texto: "Aplica pensamiento computacional (formulación de algoritmos, descomposición de problemas, simulaciones digitales) en el diseño, prueba o comunicación de prototipos y soluciones tecnológicas, investigando y valorando el aporte de mujeres científicas y tecnológicas, y adoptando actitudes de responsabilidad, colaboración y crítica frente al impacto ambiental de las tecnologías" },
        ],
        saberes: {
          declarativos: [
            "CN.4.4.d.14. Naturaleza del sonido, propiedades, transmisión en diferentes medios y su impacto ambiental y social.",
            "CN.4.4.d.15. Contaminación acústica y su impacto ambiental y social.",
            "CN.4.4.d.16. Electricidad: corriente eléctrica, efectos de la electricidad, circuitos eléctricos, conductores y aislantes.",
            "CN.4.4.d.17. Fundamentos del diseño tecnológico y del pensamiento computacional aplicados a la resolución de problemas, en nivel introductorio.",
            "CN.4.4.d.18. Aportes de mujeres en la ciencia y la tecnología y su invención precursora de las telecomunicaciones modernas, con énfasis en Hedy Lamarr y otras científicas o tecnólogas.",
          ],
          procedimentales: [
            "CN.4.4.p.5. Identificar problemas socioambientales locales que puedan resolverse con artefactos tecnológicos sencillos. Diseñar y construir prototipos experimentales que apliquen principios de electricidad, por ejemplo circuitos simples, alarmas, semáforos, interruptores, timbres o sistemas de iluminación de bajo voltaje.",
            "CN.4.4.p.8. Realizar experiencias sobre propagación del sonido en diferentes medios. Aplicar pensamiento computacional mediante algoritmos simples, por ejemplo diagramas de flujo para planificar un circuito, una alarma o una secuencia de construcción.",
            "CN.4.4.p.10. Investigar y comunicar aportes de científicas como Hedy Lamarr al desarrollo de soluciones tecnológicas actuales.",
            "CN.4.4.p.11. Evaluar la eficiencia, seguridad y sostenibilidad de los artefactos construidos, proponiendo mejoras.",
          ],
          actitudinales: [
            "CN.4.4.a.7. Promover actitudes colectivas responsables frente a la contaminación acústica y otros problemas socioambientales.",
            "CN.4.4.a.8. Fomentar la colaboración y el respeto en el trabajo en equipo para el diseño de prototipos.",
            "CN.4.4.a.10. Reconocer y valorar la contribución de mujeres en la ciencia y la tecnología, promoviendo la equidad de género en el ámbito científico-tecnológico.",
            "CN.4.4.a.11. Valorar la creatividad y la innovación como herramientas para resolver problemas socioambientales.",
            "CN.4.4.a.6. Mostrar responsabilidad en el uso de materiales y recursos durante el diseño y construcción de artefactos.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "DÉCIMO GRADO",
        indicadores: [
          { codigo: "I.CN.4.10.1", texto: "Explica fenómenos físicos cotidianos en el contexto ecuatoriano (movimiento, fuerzas equilibradas y no equilibradas, tipos de energía y sus transformaciones, electricidad, magnetismo, presión, densidad y sonido), relacionándolos con posibles aplicaciones tecnológicas para mejorar la calidad de vida y atender problemas socioambientales" },
          { codigo: "I.CN.4.10.2", texto: "Experimenta con prototipos o artefactos sencillos que aplican principios de movimiento, fuerzas, energía, electricidad o magnetismo, analizando su eficiencia, seguridad y sostenibilidad, y proponiendo mejoras basadas en resultados experimentales" },
          { codigo: "I.CN.4.10.3", texto: "Determina la relación entre masa, fuerza y movimiento de los objetos, así como entre densidad y presión de sólidos, líquidos y gases, mediante experiencias y resolución de problemas, explicando el comportamiento de los materiales en situaciones cotidianas y su vínculo con el diseño de soluciones tecnológicas (por ejemplo, autos eléctricos frente a gasolina)" },
          { codigo: "I.CN.4.10.4", texto: "Aplica pensamiento computacional (formulación de algoritmos, descomposición de problemas, simulaciones digitales) en el diseño, prueba o comunicación de prototipos y soluciones tecnológicas, investigando y valorando el aporte de mujeres científicas y tecnológicas, y adoptando actitudes de responsabilidad, colaboración y crítica frente al impacto ambiental de las tecnologías" },
        ],
        saberes: {
          declarativos: [
            "CN.4.4.d.17. Fundamentos del diseño tecnológico y del pensamiento computacional aplicados a la resolución de problemas, en nivel de aplicación e integración. Tipos de energía y transformaciones en sistemas simples, especialmente eficiencia energética y fuentes de energía utilizadas en tecnologías.",
            "CN.4.4.d.16. Electricidad, en relación con sistemas tecnológicos, consumo eléctrico, motores y movilidad.",
            "CN.4.4.d.18. Aportes de mujeres en la ciencia y la tecnología y su invención precursora de las telecomunicaciones modernas.",
          ],
          procedimentales: [
            "CN.4.4.p.5. Identificar problemas socioambientales locales que puedan resolverse con artefactos tecnológicos sencillos.",
            "CN.4.4.p.6. Diseñar y construir prototipos experimentales que apliquen principios de movimiento, fuerzas, energía, electricidad o magnetismo.",
            "CN.4.4.p.9. Aplicar pensamiento computacional —algoritmos y simulaciones digitales— en el diseño o prueba de prototipos.",
            "CN.4.4.p.10. Investigar y comunicar aportes de científicas como Hedy Lamarr al desarrollo de soluciones tecnológicas actuales.",
            "CN.4.4.p.11. Evaluar la eficiencia, seguridad y sostenibilidad de los artefactos construidos, proponiendo mejoras.",
          ],
          actitudinales: [
            "CN.4.4.a.6. Mostrar responsabilidad en el uso de materiales y recursos durante el diseño y construcción de artefactos.",
            "CN.4.4.a.7. Promover actitudes colectivas responsables frente a la contaminación acústica y otros problemas socioambientales.",
            "CN.4.4.a.8. Fomentar la colaboración y el respeto en el trabajo en equipo para el diseño de prototipos.",
            "CN.4.4.a.9. Adoptar una actitud crítica hacia el impacto ambiental de las tecnologías, priorizando soluciones sostenibles.",
            "CN.4.4.a.10. Reconocer y valorar la contribución de mujeres en la ciencia y la tecnología, promoviendo la equidad de género en el ámbito científico-tecnológico.",
            "CN.4.4.a.11. Valorar la creatividad y la innovación como herramientas para resolver problemas socioambientales.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.CN.4.3",
    descripcion: "Valorar la importancia de la flora y fauna ecuatoriana en la conservación del ambiente mediante el reconocimiento de sus estructuras, funciones biológicas, usos medicinales y alimenticios, así como de los saberes ancestrales asociados, para promover prácticas de sostenibilidad y reconocer el patrimonio natural y cultural del país",
    competenciasClave: ["CMTC", "CC", "CCICC", "CIT", "CECA"],
    porGrado: [
      {
        nivel: "SUPERIOR",
        grado: "NOVENO GRADO",
        indicadores: [
          { codigo: "I.CN.4.3.1", texto: "Valora la diversidad de la flora del Ecuador, clasificándola según sus características y usos medicinales y alimenticios, mediante la documentación de saberes ancestrales y el reconocimiento de la importancia de su conservación" },
          { codigo: "I.CN.4.3.2", texto: "Explica las estructuras y funciones biológicas básicas de tejidos y órganos en plantas relacionándolos con su adaptación y rol en los ecosistemas" },
        ],
        saberes: {
          declarativos: [
            "CN.4.1.d.14. Tejidos y órganos de las plantas.",
            "CN.4.1.d.15. Polinización y reproducción sexual de las plantas.",
            "CN.4.1.d.16. Plantas nativas y endémicas del Ecuador y saberes ancestrales con valor medicinal, alimenticio y cultural.",
          ],
          procedimentales: [
            "CN.4.1.p.11. Realizar cortes simples de órganos vegetales (por ejemplo, tallos o hojas) y los observa con lupa o microscopio escolar, identificando tejidos básicos (epidermis, tejido conductor) y relacionándolos con su función.",
            "CN.4.1.p.12. Identificar en flores reales o modelos las estructuras reproductoras (estambres, pistilo, óvulos) y representa el proceso de polinización mediante esquemas o secuencias gráficas.",
            "CN.4.1.p.13. Elaborar un álbum / registro ilustrado o mini-herbarios de plantas nativas y endémicas del entorno, registrando nombre común, uso principal (medicinal, alimenticio, cultural) y hábitat.",
          ],
          actitudinales: [
            "CN.4.1.a.7. Valora la flora nativa y endémica del Ecuador como parte del patrimonio natural y cultural, mostrando respeto hacia las especies y sus hábitats.",
          ],
        },
      },
      {
        nivel: "SUPERIOR",
        grado: "DÉCIMO GRADO",
        indicadores: [
          { codigo: "I.CN.4.3.1", texto: "Valora la diversidad de la fauna del Ecuador, clasificándola según sus características y usos medicinales y alimenticios, mediante la documentación de saberes ancestrales y el reconocimiento de la importancia de su conservación" },
          { codigo: "I.CN.4.3.2", texto: "Explica las estructuras y funciones biológicas básicas de tejidos y órganos y de tejidos relacionándolos con su adaptación y rol en los ecosistemas" },
        ],
        saberes: {
          declarativos: [
            "CN.4.1.d.17. Tejidos y sistemas de los animales.",
            "CN.4.1.d.18. Animales nativos del Ecuador.",
            "CN.4.1.d.19. Biodiversidad en las áreas protegidas del país.",
          ],
          procedimentales: [
            "CN.4.1.p.14. Analizar ilustraciones, modelos o preparaciones sencillas para identificar tejidos básicos (epitelial, muscular, conectivo) y los relaciona con su función en diferentes sistemas animales.",
            "CN.4.1.p.15. Identificar y clasificar animales nativos del Ecuador a partir de observaciones directas.",
          ],
          actitudinales: [
            "CN.4.1.a.7. Valora la fauna nativas y endémicas del Ecuador como parte del patrimonio natural y cultural, mostrando respeto hacia las especies y sus hábitats.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.CN.4.2",
    descripcion: "Explicar la estructura y función de las biomoléculas, los ácidos nucleicos como portadores de la herencia, mediante la construcción y análisis de modelos explicativos, para interpretar los mecanismos de la evolución biológica y valorar la importancia de la investigación científica",
    competenciasClave: ["CMCT", "CC", "CD", "CIT", "CSE"],
    porGrado: [
      {
        nivel: "SUPERIOR",
        grado: "DÉCIMO GRADO",
        indicadores: [
          { codigo: "I.CN.4.2.1", texto: "Explica la importancia de las biomoléculas como componentes esenciales de los seres vivos y de nuestra alimentación" },
          { codigo: "I.CN.4.2.2", texto: "Reconoce el rol del ADN como molécula portadora de la información genética y su contribución fundamental a la evolución biológica a lo largo del tiempo" },
          { codigo: "I.CN.4.2.3", texto: "Relaciona los procesos metabólicos de la fotosíntesis y la respiración celular como procesos interconectados que mantienen la vida en el planeta" },
        ],
        saberes: {
          declarativos: [
            "CN.4.1.d.9. Bioelementos: principales elementos químicos presentes en los seres vivos.",
            "CN.4.1.d.10. Clasificación general de las biomoléculas.",
            "CN.4.1.d.11. Química de las biomoléculas y sus funciones en las células: azúcares, lípidos, vitaminas, proteínas, enzimas y ácidos nucleicos.",
            "CN.4.1.d.12. Estructura del ADN como molécula portadora de la información genética y evolución biológica.",
            "CN.4.1.d.13. Relación entre tipos de biomoléculas en la nutrición y el funcionamiento saludable del organismo (macronutrientes y micronutrientes).",
          ],
          procedimentales: [
            "CN.4.1.p.6. Relacionar los procesos metabólicos con ejemplos cercanos de la vida cotidiana.",
            "CN.4.1.p.7. Relacionar biomoléculas con su función en el funcionamiento de los seres vivos.",
            "CN.4.1.p.8. Conectar biomoléculas con la nutrición en los seres vivos.",
            "CN.4.1.p.9. Identificar experimentalmente la presencia de ADN y otras biomoléculas con materiales sencillos.",
            "CN.4.1.p.10. Elaborar modelos de la doble hélice de ADN y relacionar estructura con su función.",
          ],
          actitudinales: [
            "CN.4.1.a.5. Reconocer que las biomoléculas forman parte de los seres vivos y de los alimentos.",
            "CN.4.1.a.6. Valorar el papel del ADN en la herencia, la evolución y la salud, demostrando respeto por la diversidad genética y por la importancia de la investigación científica en la comprensión de la vida.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.CN.B.5.1",
    descripcion: "Construir modelos explicativos sobre la evolución prebiótica, la formación de las primeras estructuras biológicas y el origen de la vida en la Tierra primitiva, fundamentados en el conocimiento e importancia de bioelementos y biomoléculas inorgánicas y orgánicas, a partir de la argumentación y la discusión de las teorías de la biología actual frente a aquellas interpretaciones del origen de la vida que no se sustentan en el método científico, demostrando pensamiento crítico y honestidad intelectual",
    competenciasClave: ["CMCT", "CC", "CCICC", "CECA"],
    porGrado: [
      {
        nivel: "BIOLOGÍA",
        grado: "PRIMER CURSO",
        indicadores: [
          { codigo: "I.CN.B.5.1.1", texto: "Explica de manera fundamentada la validez de las pruebas científicas sobre el origen de la vida y de las condiciones de la Tierra primitiva, diferenciándolas de explicaciones pseudocientíficas mediante criterios del método científico. Explica cómo el conocimiento de los bioelementos y las biomoléculas fundamenta la comprensión de la evolución prebiótica y la formación de las primeras estructuras biológicas" },
          { codigo: "I.CN.B.5.1.3", texto: "Argumenta la hipótesis del ARN y la aparición de la primera célula" },
        ],
        saberes: {
          declarativos: [
            "CN.B.5.1.d.1. Método y pruebas científicas sobre el origen de la vida.",
            "CN.B.5.1.d.2. Condiciones de la Tierra primitiva y composición de su atmósfera versus la atmósfera actual.",
            "CN.B.5.1.d.3. Tipos de bioelementos. Biomoléculas inorgánicas.",
            "CN.B.5.1.d.5. Biomoléculas orgánicas.",
            "CN.B.5.1.d.6. Autoorganización y replicación: El mundo del ARN y la primera célula.",
          ],
          procedimentales: [
            "CN.B.5.1.p.1. Diferenciar entre la composición de la atmósfera primitiva y la actual, infiriendo la importancia de la atmósfera reductora.",
            "CN.B.5.1.p.2. Establecer la importancia para la vida de los bioelementos, y biomoléculas inorgánicas.",
            "CN.B.5.1.p.4. Experimentar con materiales sencillos para detectar la presencia de biomoléculas.",
            "CN.B.5.1.p.6. Construir explicaciones coherentes sobre los pasos propuestos para el ensamblado de la primera célula a partir del conocimiento del ARN. Seleccionar fuentes confiables sobre experimentos clave relacionados con el origen de la vida, la replicación del ARN extrayendo conclusiones fundamentadas en el método científico.",
          ],
          actitudinales: [
            "CN.B.5.1.a.1. Cuestionar cómo pudo surgir la vida.",
            "CN.B.5.1.a.9. Posicionar el método científico ante las pseudociencias.",
          ],
        },
      },
      {
        nivel: "BIOLOGÍA",
        grado: "SEGUNDO CURSO",
        indicadores: [
          { codigo: "I.CN.B.5.1.2", texto: "Explica cómo el conocimiento de las biomoléculas fundamenta su importancia en los seres vivos" },
        ],
        saberes: {
          declarativos: [
            "CN.B.5.1.d.4. Biomoléculas inorgánicas: Propiedades del agua y sales minerales. Biomoléculas orgánicas: Enlaces, estructuras.",
          ],
          procedimentales: [
            "CN.B.5.1.p.3. Reconocer los monómeros y polímeros correspondientes a cada biomolécula orgánica, así como sus enlaces, estructuras y funciones.",
            "CN.B.5.1.p.5. Establecer relación entre cada biomolécula y su función en los seres vivos.",
            "CN.B.5.1.p.16. Diseñar investigaciones experimentales sobre el valor nutricional de los distintos alimentos desde el conocimiento de las biomoléculas. Seleccionar fuentes confiables sobre experimentos clave relacionados con las biomoléculas, extrayendo conclusiones fundamentadas en el método científico.",
          ],
          actitudinales: [
            "CN.B.5.1.a.2. Comprender cómo las moléculas se ensamblan en estructuras más complejas, valorando la organización de la materia viva.",
          ],
        },
      },
      {
        nivel: "BIOLOGÍA",
        grado: "TERCER CURSO",
        indicadores: [
          { codigo: "I.CN.B.5.1.2", texto: "Explica cómo el conocimiento de las biomoléculas inorgánicas (agua, sales minerales) y biomoléculas orgánicas (carbohidratos, lípidos, proteínas (enzimas), ácidos nucleicos) fundamenta su importancia en los seres vivos" },
        ],
        saberes: {
          declarativos: [
            "CN.B.5.1.d.4. Biomoléculas inorgánicas: Propiedades del agua y sales minerales.",
            "CN.B.5.1.d.5. Biomoléculas orgánicas: Enlaces, estructuras, relaciones y funciones de los azúcares, lípidos, proteínas (enzimas) y ácidos nucleicos.",
          ],
          procedimentales: [
            "CN.B.5.1.p.2. Establecer la importancia para la vida de los bioelementos, y biomoléculas inorgánicas.",
          ],
          actitudinales: [
            "CN.B.5.1.a.3. Asimilar que los bioelementos constituyen las biomoléculas que forman parte del ser humano y de los alimentos que ingerimos, demostrando responsabilidad en la adopción de estilos de vida saludables.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.CN.B.5.2",
    descripcion: "Predecir las consecuencias de las alteraciones genéticas, cromosómicas y epigenéticas con base en la comprensión del concepto de flujo de información del ADN a las proteínas, así como de los mecanismos de regulación epigenética, demostrando empatía ante las diferencias de los seres humanos",
    competenciasClave: ["CMCT", "CC", "CD", "CCICC", "CSE"],
    porGrado: [
      {
        nivel: "BIOLOGÍA",
        grado: "PRIMER CURSO",
        indicadores: [
          { codigo: "I.CN.B.5.2.1", texto: "Explica la naturaleza química del ADN, a partir de su organización en cromosomas y genes, así como la propiedad de perpetuarse en el tiempo de acuerdo con su capacidad replicativa" },
        ],
        saberes: {
          declarativos: [
            "CN.B.5.1.d.7. Estructura y replicación del ADN.",
            "CN.B.5.1.d.8. Cromosoma y gen.",
          ],
          procedimentales: [
            "CN.B.5.1.p.7. Aplicar el conocimiento del código genético para entender la relación entre el ADN, el ARN y las proteínas. Seleccionar fuentes confiables sobre experimentos clave en genética (ADN), extrayendo conclusiones fundamentadas.",
          ],
          actitudinales: [
            "CN.B.5.1.a.4. Apreciar el papel del ADN como la molécula portadora de la herencia.",
            "CN.B.5.1.a.10. Valorar el papel de la mujer en la ciencia, reconociendo contribuciones fundamentales como las de Rosalind Franklin en la estructura del ADN, Martha Chase en la demostración del ADN como material genético y Nettie Stevens en el descubrimiento de los cromosomas sexuales.",
          ],
        },
      },
      {
        nivel: "BIOLOGÍA",
        grado: "SEGUNDO CURSO",
        indicadores: [
          { codigo: "I.CN.B.5.2.2", texto: "Predice las consecuencias básicas de alteraciones genéticas (mutaciones) y su relación con patologías conocidas" },
        ],
        saberes: {
          declarativos: [
            "CN.B.5.1.d.9. Mutación: causas y consecuencias.",
          ],
          procedimentales: [
            "CN.B.5.1.p.9. Establecer la relación entre los cambios en los genes y las patologías a través de cambios en las proteínas que codifican.",
            "CN.B.5.1.p.23. Seleccionar fuentes confiables sobre experimentos clave en mutaciones, extrayendo conclusiones fundamentadas.",
          ],
          actitudinales: [
            "CN.B.5.1.a.12. Actuar con empatía ante las personas que presentan afectaciones a su salud o desarrollo debido a mutaciones, a partir del conocimiento adquirido (.",
          ],
        },
      },
      {
        nivel: "BIOLOGÍA",
        grado: "TERCER CURSO",
        indicadores: [
          { codigo: "I.CN.B.5.2.2", texto: "Predice las consecuencias básicas de aberraciones cromosómicas, epigenéticas epigenéticas y su relación con patologías conocidas (incluyendo enfermedades raras) basándose en la comprensión del flujo de información del ADN a las proteínas y en la comprensión de los mecanismos de regulación epigenética" },
        ],
        saberes: {
          declarativos: [
            "CN.B.5.1.d.10. Aberración cromosómica.",
            "CN.B.5.1.d.11. Epigenética y enfermedades raras.",
          ],
          procedimentales: [
            "CN.B.5.1.p.8. Diferenciar entre alteración cromosómica y génica.",
            "CN.B.5.1.p.10. Establecer el impacto a nivel fenotípico de los cambios en la estructura o número de cromosomas (enfermedades raras).",
            "CN.B.5.1.p.11. Explicar que los cambios en los patrones de lectura de los genes también acarrean problemas sin alterar la propia secuencia de.",
            "ADN.CN.B.5.3.a.9. Reconocer la importancia del estudio de las enfermedades raras.",
          ],
          actitudinales: [
            "CN.B.5.1.a.12. Actuar con empatía ante las personas que presentan afectaciones a su salud o desarrollo debido a aberraciones cromosómicas o epigenéticas, a partir del conocimiento adquirido.",
            "CN.B.5.3.a.10. Valorar la investigación en enfermedades que afectan a países en desarrollo.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.CN.B.5.3",
    descripcion: "Comprender la teoría celular, el origen evolutivo de las células eucariotas y el conocimiento sobre los microorganismos y las formas acelulares, así como la organización de las células procariotas y eucariotas que determina su clasificación taxonómica, además de la interpretación de cómo las alteraciones metabólicas y de las estructuras celulares (incluyendo las membranas biológicas) afectan la salud humana demostrando compromiso responsable en la prevención de enfermedades",
    competenciasClave: ["CMCT", "CC", "CD", "CIT", "CCICC"],
    porGrado: [
      {
        nivel: "BIOLOGÍA",
        grado: "PRIMER CURSO",
        indicadores: [
          { codigo: "I.CN.B.5.3.5", texto: "Explica la teoría de la endosimbiosis y su relación con las mitocondrias y cloroplastos, reconociendo el papel de los aportes científicos como el de Lyn Margulis. Compara células eucariotas y procariotas, describiendo sus diferencias clave" },
          { codigo: "I.CN.B.5.3.1", texto: "Explica el enfoque de la teoría celular, así como las estructuras y funciones principales de células eucariotas (animales y vegetales) y procariotas (importancia de las bacterias y medidas para conservar la salud). Fundamenta las alteraciones básicas de estructuras celulares" },
          { codigo: "I.CN.B.5.3.7", texto: "Relaciona la importancia de la membrana celular en el proceso de ósmosis y su influencia en funciones vitales" },
        ],
        saberes: {
          declarativos: [
            "CN.B.5.2.d.8. Teoría endosimbiótica.",
            "CN.B.5.2.d.1. Célula y Teoría celular.",
            "CN.B.5.2.d.2. Tipos de célula y su evolución: procariotas (bacterias) y eucariotas (animales y vegetales).",
            "CN.B.5.2.d.3. Estructura y función de las membranas biológicas: importancia de la ósmosis.",
            "CN.B.5.2.d.4. Estructura y función del citoesqueleto.",
            "CN.B.5.2.d.5. Estructura y función de los orgánulos.",
            "CN.B.5.2.d.6. El núcleo celular.",
          ],
          procedimentales: [
            "CN.B.5.2.p.1. Conectar las características de mitocondrias y cloroplastos con las de bacterias para justificar su origen endosimbiótico.",
            "CN.B.5.2.p.2. Establecer las diferencias y semejanzas existentes, a partir de su estructura y función, entre las células procariotas y eucariotas; célula animal y la vegetal.",
            "CN.B.5.2.p.4. Observar al microscopio óptico muestras de diversas células.",
            "CN.B.5.2.p.5. Experimentar con membranas biológicas para visualizar el proceso de ósmosis y sus implicaciones en la hidratación celular. Seleccionar fuentes confiables sobre experimentos clave en biología celular extrayendo conclusiones basadas en evidencia.",
          ],
          actitudinales: [
            "CN.B.5.2.a.1. Evaluar la solidez de la Teoría endosimbiótica.",
            "CN.B.5.2.a.2. Reconocer que las bacterias llevan más tiempo que nosotros sobre el planeta y que existen algunas beneficiosas.",
            "CN.B.5.2.a.3. Apreciar la Teoría celular como una teoría central y unificadora en la biología y que da respuesta de qué estamos hechos los seres vivos.",
            "CN.B.5.2.a.8. Valorar el papel de la mujer en la ciencia, reconociendo contribuciones como la de Lynn Margulis en la teoría endosimbiótica y otras científicas en biología celular. Recomendar medidas para conservar su salud a partir del conocimiento las bacterias y las alteraciones de los orgánulos celulares que pueden ser prevenibles.",
          ],
        },
      },
      {
        nivel: "BIOLOGÍA",
        grado: "SEGUNDO CURSO",
        indicadores: [
          { codigo: "I.CN.B.5.3.3", texto: "Explica los procesos metabólicos fundamentales (respiración celular, fotosíntesis, fermentación) y su importancia para la vida. Relaciona las alteraciones básicas de procesos metabólicos con sus posibles efectos en la salud humana, utilizando ejemplos de patologías comunes, así como el papel de la industria farmacéutica" },
          { codigo: "I.CN.B.5.3.6", texto: "Argumenta por qué los virus y priones son formas acelulares, así como las medidas para evitar enfermedades causadas por estas" },
        ],
        saberes: {
          declarativos: [
            "CN.B.5.2.d.9. Metabolismo: anabolismo y catabolismo.",
            "CN.B.5.2.d.10. Fotosíntesis: cloroplasto.",
            "CN.B.5.2.d.11. Fermentación.",
            "CN.B.5.2.d.12. Respiración celular: mitocondria.",
            "CN.B.5.2.d.13. Microorganismos y formas acelulares (virus y priones).",
          ],
          procedimentales: [
            "CN.B.5.2.p.6. Vincular la función de las enzimas con los procesos metabólicos celulares, relacionándolos con ejemplos cercanos de la vida cotidiana, así como sus alteraciones y efectos en la salud humana.",
            "CN.B.5.2.p.7. Conectar la relación circular entre la fotosíntesis, la respiración celular y el principio de conservación de la energía.",
            "CN.B.5.2.p.12. Argumentar si los virus y los priones son formas de vida, estableciendo medidas para conservar la salud. Seleccionar fuentes confiables sobre experimentos clave en procesos metabólicos, extrayendo conclusiones basadas en evidencia.",
          ],
          actitudinales: [
            "CN.B.5.2.a.4. Destacar la importancia de la fotosíntesis en el mantenimiento de la vida.",
            "CN.B.5.2.a.5. Valorar el uso que hemos hecho los humanos del proceso de fermentación. Recomendar medidas para conservar su salud a partir del conocimiento de los microorganismos, las formas acelulares, las alteraciones de los procesos metabólicos.",
            "CN.B.5.3.a.11. Discutir, desde un punto de vista ético, el papel de la industria farmacéutica en el desarrollo, producción y acceso a tratamientos para enfermedades metabólicas.",
          ],
        },
      },
      {
        nivel: "BIOLOGÍA",
        grado: "TERCER CURSO",
        indicadores: [
          { codigo: "I.CN.B.5.3.2", texto: "Clasifica los organismos según su tipo celular en los dominios y reinos correspondientes" },
        ],
        saberes: {
          declarativos: [
            "CN.B.5.2.d.7. Dominios y reinos de la vida.",
          ],
          procedimentales: [
            "CN.B.5.2.p.3. Clasificar los organismos en dominios y reinos.",
          ],
          actitudinales: [
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.CN.B.5.4",
    descripcion: "Modelar los fenómenos de transmisión hereditaria utilizando los principios de las leyes de Mendel, las definiciones de alelo, genotipo, fenotipo y del ciclo celular, explicando cómo la variabilidad genética, generada por la meiosis, sustenta la diversidad biológica y la evolución de las especies, y la comprensión de la fecundación In Vitro, así como las aplicaciones de la genética con actitud crítica y responsable",
    competenciasClave: ["CMCT", "CC", "CIT", "CCICC", "CSE", "CECA"],
    porGrado: [
      {
        nivel: "BIOLOGÍA",
        grado: "PRIMER CURSO",
        indicadores: [
          { codigo: "I.CN.B.5.4.1", texto: "Resuelve problemas de genética y de herencia ligada al sexo a partir de la comprensión de conceptos básicos como alelo, genotipo, fenotipo, leyes de Mendel. Explica la importancia de la herencia mendeliana" },
          { codigo: "I.CN.B.5.4.3", texto: "Argumenta las aplicaciones de la genética en diversos campos" },
          { codigo: "I.CN.B.5.4.4", texto: "Explica los riesgos de discriminación basada en alteraciones cromosómicas" },
        ],
        saberes: {
          declarativos: [
            "CN.B.5.1.d.12. Alelo.",
            "CN.B.5.1.d.13. Genotipo y fenotipo.",
            "CN.B.5.1.d.14. Leyes de Mendel.",
            "CN.B.5.1.d.15. Cromosomas sexuales y herencia ligada al sexo.",
          ],
          procedimentales: [
            "CN.B.5.1.p.22. Resolver problemas de genética aplicando las leyes de Mendel.",
            "CN.B.5.1.p.24. Resolver problemas de herencia ligada al sexo.",
            "CN.B.5.2.p.16. Seleccionar fuentes confiables sobre las aplicaciones de la genética, estableciendo conclusiones basadas en evidencia.",
          ],
          actitudinales: [
            "CN.B.5.1.a.5. Reconocer la importancia de las Leyes de Mendel como base de la herencia. Demostrar empatía y respeto hacia las personas con enfermedades ligadas al sexo o alteraciones cromosómicas.",
          ],
        },
      },
      {
        nivel: "BIOLOGÍA",
        grado: "SEGUNDO CURSO",
        indicadores: [
          { codigo: "I.CN.B.5.4.2", texto: "Explica la importancia del ciclo celular (mitosis) en el sustento científico de los mecanismos de perpetuación de las especies y la generación de variabilidad genética (meiosis). Relaciona las alteraciones en el ciclo celular con el desarrollo y progresión del cáncer, a partir de las investigaciones en este campo" },
          { codigo: "I.CN.B.5.4.6", texto: "Explica cómo el conocimiento de la meiosis y la fecundación In Vitro ha permitido el desarrollo de técnicas de reproducción asistida, reconociendo su impacto positivo en la vida de las personas, así como la importancia de las contribuciones científicas como la de Jean Purdy. Explica los riesgos de discriminación a personas con enfermedades genéticas como el cáncer" },
        ],
        saberes: {
          declarativos: [
            "CN.B.5.2.d.14. Ciclo celular y sus fases.",
            "CN.B.5.2.d.15. Control del ciclo celular: proliferación celular (controlada y descontrolada) y muerte celular programada.",
            "CN.B.5.2.d.16. Mitosis, meiosis: Consecuencias biológicas.",
            "CN.B.5.2.d.17. La Fecundación In Vitro.",
          ],
          procedimentales: [
            "CN.B.5.2.p.8. Hacer modelos de la mitosis y la meiosis.",
            "CN.B.5.2.p.9. Hacer preparaciones al microscopio óptico para visualizar las fases de la mitosis y de la meiosis.",
            "CN.B.5.2.p.10. Resolver problemas relacionados con la ploidía y el número de cromosomas y cromátidas.",
            "CN.B.5.2.p.11. Diferenciar entre mitosis y meiosis.",
            "CN.B.5.2.p.13. Indagar en las investigaciones sobre el ciclo celular para el estudio del cáncer y las enfermedades neurodegenerativas.",
            "CN.B.5.2.p.14. Establecer cómo los avances en la investigación de la meiosis y la fecundación ha mejorado la vida de las personas que no pueden tener hijos.",
          ],
          actitudinales: [
            "CN.B.5.2.a.6. Valorar la investigación en el ciclo celular para el estudio del cáncer y las enfermedades neurodegenerativas.",
            "CN.B.5.2.a.7. Reconocer que los avances en la investigación de la meiosis y la fecundación In Vitro han mejorado la vida de las personas que no pueden tener hijos.",
            "CN.B.5.2.a.9. Valorar el papel de la mujer en la ciencia, reconociendo contribuciones como la de Jean Purdy en la fecundación in vitro. Demostrar empatía y respeto hacia las personas con cáncer.",
          ],
        },
      },
      {
        nivel: "BIOLOGÍA",
        grado: "TERCER CURSO",
        indicadores: [
          { codigo: "I.CN.B.5.4.3", texto: "Argumenta la importancia de la variabilidad genética como motor clave en la evolución de la vida" },
          { codigo: "I.CN.B.5.4.4", texto: "Explica la importancia de la diversidad genética en las poblaciones humanas" },
        ],
        saberes: {
          declarativos: [
            "CN.B.5.1.d.16. Genética de poblaciones y diversidad genética.",
            "CN.B.5.1.d.17. Equilibrio Hardy-Weinberg.",
            "CN.B.5.1.d.18. Variabilidad genética y perpetuación de especies.",
            "CN.B.5.1.d.19. Aplicaciones de la genética en medicina, conservación y agricultura.",
          ],
          procedimentales: [
            "CN.B.5.1.p.15. Relacionar los principios de la genética de poblaciones con la evolución, la variabilidad genética y la perpetuación de especies.",
            "CN.B.5.2.p.16. Seleccionar fuentes confiables sobre las aplicaciones de la genética, estableciendo conclusiones basadas en evidencia.",
          ],
          actitudinales: [
            "CN.B.5.1.a.11. Apreciar la relevancia de la genética de poblaciones en campos como la conservación de especies, la medicina y la agricultura.",
            "CN.B.5.1.a.14. Tomar conciencia de la importancia de la diversidad genética como fuente económica en el presente y futuro de la humanidad.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.CN.B.5.5",
    descripcion: "Generar iniciativas responsables para promover la salud integral del ser humano, de manera individual y colectiva, a partir del análisis de los efectos de enfermedades y desórdenes asociados a estilos de vida, enfocándose en los sistemas fundamentales para el mantenimiento de la vida: digestivo, respiratorio, circulatorio y excretor, su organización y funcionamiento al compararlos con otros animales, reconociendo su estructura y función",
    competenciasClave: ["CMCT", "CC", "CD", "CIT", "CCICC", "CSE"],
    porGrado: [
      {
        nivel: "BIOLOGÍA",
        grado: "PRIMER CURSO",
        indicadores: [
          { codigo: "I.CN.B.5.5.1", texto: "Explica que en los organismos multicelulares la forma y función de las células y los tejidos determinan la organización de órganos, aparatos y sistemas, demostrando respeto por los seres vivos" },
          { codigo: "I.CN.B.5.5.2", texto: "Establece semejanzas y diferencias, estructurales funcionales entre los tejidos, órganos, aparatos, sistemas de diferentes especies animales a lo largo de la escala evolutiva, valorando la complejidad biológica" },
        ],
        saberes: {
          declarativos: [
            "CN.B.5.3.d.1. Tejido, órgano y aparato/sistema.",
            "CN.B.5.3.d.2. Tipos de tejidos animales y sus células.",
            "CN.B.5.3.d.3. Aparatos y sistemas de los animales.",
            "CN.B.5.3.d.4. Evolución y clasificación de los animales a partir de su complejidad biológica.",
          ],
          procedimentales: [
            "CN.B.5.3.p.1. Usar muñecos clásticos y modelos anatómicos para el estudio de órganos y aparatos.",
            "CN.B.5.3.p.2. Comparar la complejidad de los sistemas de los animales invertebrados y vertebrados.",
            "CN.B.5.3.p.3. Observar preparaciones de los diferentes órganos de los distintos sistemas al microscopio óptico.",
            "CN.B.5.3.p.4. Distinguir los distintos tipos de tejidos y las células que componen los órganos.",
          ],
          actitudinales: [
            "CN.B.5.3.a.4. Desarrollar una actitud de respeto a los seres vivos, a partir del reconocimiento de sus niveles de organización jerárquica.",
          ],
        },
      },
      {
        nivel: "BIOLOGÍA",
        grado: "SEGUNDO CURSO",
        indicadores: [
          { codigo: "I.CN.B.5.5.2", texto: "Establece semejanzas y diferencias, estructurales y funcionales entre los sistemas (digestivo, excretor) del ser humano" },
          { codigo: "I.CN.B.5.5.3", texto: "Establece la relación entre estilos de vida saludable y la aparición o prevención de enfermedades y desórdenes que afectan a los sistemas fundamentales de mantenimiento (digestivo, respiratorio) a partir de medidas concretas relacionadas con estilos de vida saludables" },
          { codigo: "I.CN.B.5.5.4", texto: "Infiere el rol que cumplen los microorganismos en el tracto digestivo, así como la influencia de la contaminación en los sistemas del cuerpo humano" },
        ],
        saberes: {
          declarativos: [
            "CN.B.5.3.d.5. Componentes y funciones de los sistemas humanos: digestivo, excretor.",
            "CN.B.5.3.d.6. Enfermedades y medidas de cuidado de los sistemas humanos: digestivo, excretor.",
          ],
          procedimentales: [
            "CN.B.5.3.p.13. Indagar acerca de las enfermedades nutricionales y desórdenes alimenticios más comunes que afectan a la población (intolerancias, anorexia, bulimia, obesidad) así como la importancia del microbiota. Seleccionar fuentes confiables sobre investigaciones en fisiología animal, para identificar cómo funcionan los sistemas del cuerpo humano (digestivo, excretor) planteando conclusiones aplicables en lo cotidiano y su bienestar.",
            "CN.B.5.3.p.23. Proponer acciones relacionadas con hábitos de vida saludables como medida de prevención de enfermedades de los sistemas digestivo, excretor, respiratorio y circulatorio.",
          ],
          actitudinales: [
            "CN.B.5.3.a.1. Tomar conciencia de la importancia de los hábitos saludables de alimentación, ejercicio físico y sueño para el mantenimiento de los sistemas del cuerpo humano.",
            "CN.B.5.3.a.2. Valorar el papel de todos los microorganismos que viven en simbiosis con el ser humano en el tracto digestivo.",
            "CN.B.5.3.a.3. Reflexionar sobre el problema de la contaminación atmosférica, agua, suelo y el deterioro de los sistemas del cuerpo humano.",
          ],
        },
      },
      {
        nivel: "BIOLOGÍA",
        grado: "TERCER CURSO",
        indicadores: [
          { codigo: "I.CN.B.5.5.2", texto: "Establece semejanzas y diferencias estructurales y funcionales entre los sistemas (respiratorio y circulatorio) del ser humano. Establece la relación entre estilos de vida saludable y la aparición o prevención de enfermedades y desórdenes que afectan a los sistemas fundamentales de mantenimiento (circulatorio y excretor) a partir de medidas concretas relacionadas con estilos de vida saludables" },
          { codigo: "I.CN.B.5.5.4", texto: "Infiere la influencia de la contaminación en los sistemas del cuerpo humano" },
        ],
        saberes: {
          declarativos: [
            "CN.B.5.3.d.5. Componentes y funciones de los sistemas humanos: respiratorio y circulatorio.",
            "CN.B.5.3.d.6. Enfermedades y medidas de cuidado de los sistemas humanos: respiratorio y circulatorio.",
          ],
          procedimentales: [
            "CN.B.5.3.p.14. Indagar en diversas fuentes sobre las enfermedades causadas por el consumo de tabaco y la exposición a contaminantes ambientales sobre el sistema respiratorio. Seleccionar fuentes confiables sobre investigaciones en fisiología animal, para identificar cómo funcionan los sistemas del cuerpo humano (respiratorio, circulatorio) planteando conclusiones aplicables en lo cotidiano y su bienestar.",
          ],
          actitudinales: [
            "CN.B.5.3.a.1. Tomar conciencia de la importancia de los hábitos saludables de alimentación, ejercicio físico y sueño para el mantenimiento de los sistemas del cuerpo humano.",
            "CN.B.5.3.a.3. Reflexionar sobre el problema de la contaminación atmosférica, agua, suelo y el deterioro de los sistemas del cuerpo humano.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.CN.B.5.6",
    descripcion: "Plantear estrategias de prevención de enfermedades y toma de decisiones sobre la salud biológica y mental, basadas en una comprensión integral de los sistemas de control (incluido su funcionamiento y evolución), regulación, defensa y reproducción del organismo humano (nervioso, endocrino, inmunológico y reproductor), demostrando responsabilidad por la salud individual y colectiva",
    competenciasClave: ["CMCT", "CC", "CD", "CCICC", "CSE"],
    porGrado: [
      {
        nivel: "BIOLOGÍA",
        grado: "PRIMER CURSO",
        indicadores: [
          { codigo: "I.CN.B.5.6.1", texto: "Explica los componentes y cómo funcionan los sistemas nervioso, endocrino, inmunológico (inmunidad innata y adquirida) y reproductor (diferencias entre los sistemas femeninos y masculinos)" },
          { codigo: "I.CN.B.5.6.2", texto: "Establece la relación entre estilos de vida y la aparición o prevención de enfermedades y desórdenes que afectan a los sistemas de control, regulación, defensa y reproducción (nervioso, endocrino, inmunológico y reproductor), proponiendo medidas concretas para su cuidado" },
          { codigo: "I.CN.B.5.6.4", texto: "Sustenta la importancia de la salud biológica y mental como componente fundamental del bienestar integral, proponiendo medidas básicas de cuidado" },
        ],
        saberes: {
          declarativos: [
            "CN.B.5.3.d.8. Componentes de los sistemas humanos: nervioso, endocrino, inmunológico y reproductor. Función de los sistemas: nervioso, endocrino, inmunológico y reproductor.",
            "CN.B.5.3.d.10. Diferencias entre los sistemas femeninos y masculinos.",
          ],
          procedimentales: [
            "CN.B.5.3.p.6. Relacionar la neurociencia básica y salud mental.",
            "CN.B.5.3.p.8. Diferenciar inmunidad innata e inmunidad adaptativa.",
            "CN.B.5.3.p.15. Indagar en diversas fuentes sobre los efectos nocivos en el sistema nervioso ocasionados por el consumo de alcohol y otras drogas.",
            "CN.B.5.3.p.16. Indagar acerca de las enfermedades relacionadas con el sistema inmunitario más frecuentes en la población (alergias y enfermedades autoinmunes).",
            "CN.B.5.3.p.17. Indagar acerca de las anomalías relacionadas con el sistema reproductor más frecuentes y sus consecuencias para la población humana.",
            "CN.B.5.3.p.21. Proponer medidas concretas para el cuidado de los sistemas nervioso, endocrino, inmunológico y reproductor.",
          ],
          actitudinales: [
            "CN.B.5.3.a.12. Reconocer la importancia de la salud biológica y mental en niños/as, adolescentes, jóvenes, personas adultas y mayores, a través del planteamiento de medidas básicas de cuidado.",
          ],
        },
      },
      {
        nivel: "BIOLOGÍA",
        grado: "SEGUNDO CURSO",
        indicadores: [
          { codigo: "I.CN.B.5.6.1", texto: "Explica cómo funcionan los sistemas nervioso, endocrino, inmunológico y reproductor para trabajar coordinadamente a partir del conocimiento de su importancia para el bienestar del ser humano" },
          { codigo: "I.CN.B.5.6.2", texto: "Establece la relación entre estilos de vida y la aparición o prevención de enfermedades y desórdenes que afectan a los sistemas de control, regulación, defensa y reproducción (nervioso, endocrino, inmunológico y reproductor), proponiendo medidas concretas para su cuidado. Argumenta los beneficios de las vacunas" },
        ],
        saberes: {
          declarativos: [
            "CN.B.5.3.d.7. Función (individual y conjunta) de los sistemas: nervioso, endocrino, inmunológico y reproductor. Vacuna.",
          ],
          procedimentales: [
            "CN.B.5.3.p.7. Ejemplificar la relación existente entre los sistemas nervioso, endocrino, inmunológico y reproductor a partir de sus funciones.",
            "CN.B.5.3.p.15. Indagar en diversas fuentes sobre los efectos nocivos en el sistema nervioso ocasionados por el consumo de alcohol y otras drogas.",
            "CN.B.5.3.p.21. Proponer medidas concretas para el cuidado de los sistemas nervioso, endocrino, inmunológico y reproductor.",
          ],
          actitudinales: [
            "CN.B.5.1.p.17. Indagar sobre las vacunas.",
            "CN.B.5.3.a.13. Compartir la importancia del sistema inmunitario en la salud global y de otros sistemas.",
            "CN.B.5.3.a.15. Valorar el papel de la mujer en la ciencia, reconociendo contribuciones como la de Lady Mary Montagu en la introducción de la variolación.",
          ],
        },
      },
      {
        nivel: "BIOLOGÍA",
        grado: "TERCER CURSO",
        indicadores: [
          { codigo: "I.CN.B.5.6.1", texto: "Explica cómo funcionan los sistemas nervioso, endocrino, inmunológico y reproductor para trabajar coordinadamente a partir del conocimiento de su evolución" },
          { codigo: "I.CN.B.5.6.3", texto: "Argumenta los beneficios de las vacunas para la salud pública y su relación con la ingeniería genética, valorando su importancia" },
        ],
        saberes: {
          declarativos: [
            "CN.B.5.3.d.7. Evolución de los sistemas: nervioso, endocrino, inmunológico y reproductor.",
            "CN.B.5.3.d.9. Vacuna y su importancia.",
          ],
          procedimentales: [
            "CN.B.5.3.p.7. Ejemplificar la relación existente entre los sistemas nervioso, endocrino, inmunológico y reproductor a partir de sus funciones y evolución.",
            "CN.B.5.1.p.17. Indagar la relación entre la ingeniería génica y las vacunas.",
          ],
          actitudinales: [
            "CN.B.5.3.a.14. Reconocer la importancia desde un punto de vista científico de las vacunas para salvar vidas humanas, descartando los discursos de las pseudociencias.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.CN.B.5.7",
    descripcion: "Tomar decisiones informadas y constructivas que impactan positivamente en su proyecto de vida personal y social basándose en la comprensión de los procesos biológicos (fecundación, desarrollo embrionario y fetal, parto e interrupción del embarazo) y la comprensión de lo que representa la sexualidad para el establecimiento de estrategias responsables de autocuidado y prevención en salud sexual y reproductiva",
    competenciasClave: ["CMCT", "CC", "CD", "CIT", "CCICC", "CSE"],
    porGrado: [
      {
        nivel: "BIOLOGÍA",
        grado: "PRIMER CURSO",
        indicadores: [
          { codigo: "I.CN.B.5.7.1", texto: "Describe los procesos biológicos de la fecundación, el desarrollo embrionario y fetal, el parto reconociendo su importancia" },
          { codigo: "I.CN.B.5.7.2", texto: "Reflexiona sobre la sexualidad, reproducción humana y sus implicaciones" },
          { codigo: "I.CN.B.5.7.4", texto: "Detalla la relación entre la función de las hormonas con la sexualidad, el crecimiento del cuerpo, el proceso reproductivo, el embarazo, así como su importancia" },
        ],
        saberes: {
          declarativos: [
            "CN.B.5.3.d.14. Crecimiento y etapas del desarrollo humano.",
            "CN.B.5.3.d.15. La sexualidad.",
            "CN.B.5.3.d.16. Rol de las hormonas en la sexualidad.",
            "CN.B.5.3.d.11. Fecundación, embarazo, desarrollo y parto.",
            "CN.B.5.3.d.13. El papel del sistema neuroendocrino en el proceso reproductivo.",
          ],
          procedimentales: [
            "CN.B.5.3.p.9. Explicar de forma integral la función de la reproducción humana.",
            "CN.B.5.3.p.10. Reconocer el papel de la placenta como órgano mixto entre la madre y el hijo.",
            "CN.B.5.3.p.11. Analizar las consecuencias del bipedismo y el parto en la mujer.",
            "CN.B.5.3.p.12. Analizar las consecuencias de los cambios hormonales producidos durante el embarazo en la mujer.",
            "CN.B.5.3.p.22. Indagar sobre las hormonas sexuales y las hormonas del crecimiento y sus efectos en el cuerpo humano. Seleccionar fuentes confiables sobre investigaciones relacionadas con la fecundación, embarazo, desarrollo, parto, planteando conclusiones aplicables para su bienestar en el marco de su proyecto de vida.",
          ],
          actitudinales: [
            "CN.B.5.3.a.5. Reconocer la reproducción humana como una decisión personal basada en el respeto, priorizando el papel de la mujer y en el marco del proyecto de vida personal.",
            "CN.B.5.3.a.7. Analizar críticamente los mitos, estereotipos y prejuicios asociados con la sexualidad.",
            "CN.B.5.3.a.16. Valorar el papel de la mujer en la ciencia, reconociendo contribuciones como la de Metrodora, pionera en medicina ginecológica y Eugenia del Pino en el estudio del desarrollo embrionario.",
            "CN.B.5.3.a.17. Valorar la importancia de comprender la relación entre hormonas, sexualidad y crecimiento.",
          ],
        },
      },
      {
        nivel: "BIOLOGÍA",
        grado: "SEGUNDO CURSO",
        indicadores: [
          { codigo: "I.CN.B.5.7.1", texto: "Describe el proceso biológico de la interrupción del embarazo, reconociendo las repercusiones para la vida de las personas" },
          { codigo: "I.CN.B.5.7.2", texto: "Argumenta los riesgos de una maternidad/paternidad prematura, según su proyecto de vida, partiendo del análisis crítico y reflexivo de la salud sexual y reproductiva y sus implicaciones" },
          { codigo: "I.CN.B.5.7.3", texto: "Explica la relevancia de la planificación familiar y la prevención de enfermedades de transmisión sexual en el contexto del desarrollo individual y social" },
        ],
        saberes: {
          declarativos: [
            "CN.B.5.3.d.12. Interrupción del embarazo: causas y consecuencias.",
            "CN.B.5.3.d.17. Salud sexual.",
            "CN.B.5.3.d.18. Métodos anticonceptivos.",
            "CN.B.5.3.d.19. Enfermedades de transmisión sexual.",
            "CN.B.5.3.d.20. Proyecto de vida.",
          ],
          procedimentales: [
            "CN.B.5.3.p.18. Indagar acerca de las enfermedades de transmisión sexual más frecuentes en la población, proponiendo medidas preventivas.",
            "CN.B.5.3.p.19. Relacionar la salud sexual y reproductiva (métodos anticonceptivos) con las implicaciones en el proyecto de vida. Seleccionar fuentes confiables sobre investigaciones relacionadas con la interrupción del embarazo y la salud sexual, planteando conclusiones aplicables para su bienestar en el marco de su proyecto de vida.",
          ],
          actitudinales: [
            "CN.B.5.3.a.6. Argumentar las implicaciones biológicas, sociales y éticas de los procesos reproductivos y la interrupción del embarazo con fundamentación científica.",
            "CN.B.5.3.a.8. Reconocer que la salud sexual, reproductiva y afectiva son componentes esenciales del bienestar general y del desarrollo personal.",
          ],
        },
      },
      {
        nivel: "BIOLOGÍA",
        grado: "TERCER CURSO",
        indicadores: [
          { codigo: "I.CN.B.5.7.2", texto: "Argumenta los riesgos de una maternidad/paternidad prematura, según su proyecto de vida, partiendo del análisis crítico y reflexivo de la salud sexual y reproductiva y sus implicaciones" },
          { codigo: "I.CN.B.5.7.3", texto: "Explica la relevancia de la planificación familiar y la prevención de enfermedades de transmisión sexual en el contexto del desarrollo individual y social" },
        ],
        saberes: {
          declarativos: [
            "CN.B.5.3.d.17. Salud sexual.",
            "CN.B.5.3.d.18. Métodos anticonceptivos.",
            "CN.B.5.3.d.19. Enfermedades de transmisión sexual.",
            "CN.B.5.3.d.20. Proyecto de vida.",
          ],
          procedimentales: [
            "CN.B.5.3.p.18. Indagar acerca de las enfermedades de transmisión sexual, proponiendo medidas preventivas.",
            "CN.B.5.3.p.19. Relacionar la salud sexual y reproductiva (métodos anticonceptivos) con las implicaciones en el proyecto de vida. Seleccionar fuentes confiables sobre investigaciones relacionadas con la salud sexual planteando conclusiones aplicables para su bienestar en el marco de su proyecto de vida.",
          ],
          actitudinales: [
            "CN.B.5.3.a.8. Reconocer que la salud sexual, reproductiva y afectiva son componentes esenciales del bienestar general y del desarrollo personal.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.CN.B.5.8",
    descripcion: "Promover la conservación y uso responsable de los recursos naturales del país, reconociendo el valor de la biodiversidad, y sus servicios ecosistémicos para el bienestar humano, proponiendo acciones de desarrollo sostenible apropiadas para el contexto local, con actitud crítica y considerando las actividades antrópicas que amenazan su estabilidad",
    competenciasClave: ["CMCT", "CC", "CD", "CIT", "CCICC", "CSE"],
    porGrado: [
      {
        nivel: "BIOLOGÍA",
        grado: "PRIMER CURSO",
        indicadores: [
          { codigo: "I.CN.B.5.8.1", texto: "Explica el valor de la biodiversidad, la megadiversidad en los ecosistemas del Ecuador, a partir del conocimiento de la importancia de la ecología y de la tipología de ecosistemas existentes en el país" },
        ],
        saberes: {
          declarativos: [
            "CN.B.5.5.d.1. Ecología: definición e importancia.",
            "CN.B.5.5.d.2. Ecosistemas y biomas: tipos.",
            "CN.B.5.5.d.3. Biodiversidad y megadiversidad.",
            "CN.B.5.5.d.4. Factores de la megadiversidad y principales ecosistemas de Ecuador (Litoral, Interandina, Amazonía, Insular).",
            "CN.B.5.5.d.12. Recursos naturales.",
          ],
          procedimentales: [
            "CN.B.5.5.p.1. Explicar la importancia de la biodiversidad para el equilibrio de los ecosistemas, la sociedad y el planeta poniendo ejemplos concretos. Reflexionar acerca de la importancia social, económica y ambiental de la biodiversidad y los recursos naturales, identificando los retos de Ecuador frente a su patrimonio natural.",
            "CN.B.5.5.p.8. Evaluar el estado de los ecosistemas del Ecuador, con énfasis en los ecosistemas acuáticos (marinos, costeros y de agua dulce). Seleccionar fuentes confiables sobre ecología planteando conclusiones.",
          ],
          actitudinales: [
            "CN.B.5.5.a.1. Reconocer el valor intrínseco y la importancia de la biodiversidad.",
            "CN.B.5.5.a.3. Apreciar la riqueza natural de Ecuador y su megadiversidad.",
            "CN.B.5.5.a.4. Fortalecer el sentido de identidad con el entorno natural del Ecuador y el compromiso con su protección.",
          ],
        },
      },
      {
        nivel: "BIOLOGÍA",
        grado: "SEGUNDO CURSO",
        indicadores: [
          { codigo: "I.CN.B.5.8.2", texto: "Describe los principales servicios ecosistémicos y el impacto de su alteración en los sistemas globales. Explica el importancia de la biodiversidad y de los recursos naturales y el impacto de las actividades humanas en ellos" },
          { codigo: "I.CN.B.5.8.3", texto: "Propone acciones sencillas de conservación para su entorno local, considerando la importancia de equilibrar las necesidades humanas con la protección ambiental en el marco del desarrollo sostenible" },
        ],
        saberes: {
          declarativos: [
            "CN.B.5.5.d.5. Servicio ecosistémico: abastecimiento, reguladores, de sostenimiento y culturales.",
            "CN.B.5.5.d.6. Sistemas globales: definición e importancia.",
            "CN.B.5.5.d.8. Pérdida y conservación de la biodiversidad.",
            "CN.B.5.5.d.10. Desarrollo sostenible: definición e importancia.",
          ],
          procedimentales: [
            "CN.B.5.5.p.2. Reflexionar acerca de la importancia social, económica y ambiental de la biodiversidad y los recursos naturales, identificando los retos de Ecuador frente a su patrimonio natural y el desarrollo sostenible.",
            "CN.B.5.5.p.3. Clasificar los servicios ecosistémicos en sus cuatro grandes grupos (aprovisionamiento, regulación, culturales, y de soporte).",
            "CN.B.5.5.p.4. Relacionar las actividades antrópicas con la pérdida de biodiversidad.",
            "CN.B.5.5.p.6. Diseñar estrategias de desarrollo sostenible.",
            "CN.B.5.5.p.9. Debatir sobre los beneficios del uso del transporte público y compartido, considerando los impactos ambientales enfocados en el desarrollo sostenible.",
            "CN.B.5.5.p.10. Descubrir maneras de vivir con un estilo sostenible desde el punto de vista ecológico y financiero. Seleccionar fuentes confiables sobre estudios ecológicos planteando conclusiones para la sostenibilidad ambiental.",
          ],
          actitudinales: [
            "CN.B.5.5.a.1. Reconocer el valor intrínseco de los servicios ecosistémicos para el planeta y la humanidad.",
            "CN.B.5.5.a.2. Asumir un compromiso personal y social con la conservación de la diversidad biológica y el ambiente.",
            "CN.B.5.5.a.6. Mostrar disposición a promover cambios en su vida enfocados a la sostenibilidad.",
          ],
        },
      },
      {
        nivel: "BIOLOGÍA",
        grado: "TERCER CURSO",
        indicadores: [
          { codigo: "I.CN.B.5.8.1", texto: "Explica la influencia de las actividades humanas con impacto global (cambio climático, deforestación, sobreexplotación, especies introducidas e invasoras)" },
          { codigo: "I.CN.B.5.8.3", texto: "Propone acciones sencillas de conservación para su entorno local, considerando la importancia de equilibrar las necesidades humanas y problemáticas actuales como el crecimiento poblacional" },
        ],
        saberes: {
          declarativos: [
            "CN.B.5.5.d.7. Principales actividades humanas con impacto global (cambio climático, deforestación, sobreexplotación, especies introducidas e invasoras).",
            "CN.B.5.5.d.9. Estrategias para la conservación de la biodiversidad: in situ y ex situ.",
            "CN.B.5.5.d.11. Crecimiento poblacional.",
          ],
          procedimentales: [
            "CN.B.5.5.p.5. Proponer soluciones a la pérdida de biodiversidad para su conservación y la del ambiente.",
            "CN.B.5.5.p.7. Proponer soluciones innovadoras a los desafíos socioambientales y de crecimiento poblacional desde el respeto a la diversidad cultural y fomentando el desarrollo sostenible. Seleccionar fuentes confiables sobre la conservación de la biodiversidad, planteando conclusiones para la sostenibilidad ambiental.",
          ],
          actitudinales: [
            "CN.B.5.5.a.5. Cuestionar los modelos de consumo y desarrollo insostenibles.",
            "CN.B.5.5.a.7. Valorar el papel de la mujer en la ciencia, reconociendo contribuciones pioneras como la de Rachel Carson o Yolanda Kakabadse en el movimiento ambientalista moderno.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.CN.B.5.9",
    descripcion: "Reconocer la importancia ecológica, cultural y socioeconómica de las plantas en el Ecuador a partir de sus estructuras, funciones, evolución y adaptaciones, conectando con su rol vital en los ecosistemas y su impacto en la sociedad, incluyendo el desarrollo sostenible agrícola del país, demostrando respeto por la naturaleza",
    competenciasClave: ["CMCT", "CC", "CD", "CIT", "CCICC", "CSE"],
    porGrado: [
      {
        nivel: "BIOLOGÍA",
        grado: "PRIMER CURSO",
        indicadores: [
          { codigo: "I.CN.B.5.9.1", texto: "Explica los procesos que se realizan en las plantas (vegetativos y reproductores) desde la experimentación y la identificación de sus estructuras" },
        ],
        saberes: {
          declarativos: [
            "CN.B.5.4.d.1. Tipos de tejidos vegetales.",
            "CN.B.5.4.d.2. Meristemos: características, clases y funciones.",
            "CN.B.5.4.d.3. Tejidos diferenciados: características, clases y funciones.",
            "CN.B.5.4.d.4. Órganos vegetativos de las plantas superiores: raíz, tallo y hojas, características y funciones.",
            "CN.B.5.4.d.5. Órganos reproductores de las plantas superiores: flor, fruto y semilla, características y funciones.",
          ],
          procedimentales: [
            "CN.B.5.4.p.1. Observar preparaciones de tejidos y órganos vegetales al microscopio óptico.",
            "CN.B.5.4.p.2. Trazar el flujo del agua y las sales minerales desde la tierra por el xilema y la fabricación de nutrientes en las hojas y su transporte por el floema.",
            "CN.B.5.4.p.4. Diseñar experimentos sobre factores que afectan el crecimiento vegetal. Seleccionar fuentes confiables sobre experimentos clave en fisiología vegetal, extrayendo conclusiones prácticas.",
          ],
          actitudinales: [
            "CN.B.5.4.a.1. Fomentar una actitud de respeto hacia la vida vegetal a partir del conocimiento de su estructura (tejidos, órganos).",
          ],
        },
      },
      {
        nivel: "BIOLOGÍA",
        grado: "SEGUNDO CURSO",
        indicadores: [
          { codigo: "I.CN.B.5.9.2", texto: "Explica el papel vital de las plantas en los ecosistemas, a partir de su evolución, (comparado con los animales), y adaptaciones a los pisos climáticos ecuatorianos" },
          { codigo: "I.CN.B.5.9.4", texto: "Plantea medidas de conservación de la flora (nativa y endémica) a partir del conocimiento de sus usos etnobotánicos y su importancia ecológica, cultural y socioeconómica" },
        ],
        saberes: {
          declarativos: [
            "CN.B.5.4.d.6. Evolución, clasificación e importancia de las plantas.",
            "CN.B.5.4.d.7. Adaptaciones de plantas a pisos climáticos ecuatorianos.",
            "CN.B.5.4.d.8. Plantas nativas y endémicas del Ecuador y sus usos etnobotánicos.",
          ],
          procedimentales: [
            "CN.B.5.4.p.3. Relacionar las estrategias adaptativas de las plantas durante la evolución.",
            "CN.B.5.4.p.5. Investigar las medidas de conservación para las plantas nativas y endémicas del Ecuador.",
            "CN.B.5.4.p.6. Comparar las estrategias evolutivas de plantas (sedentarismo y estructura modular/plasticidad) y animales (nomadismo y estructura fija). Seleccionar fuentes confiables sobre la importancia ecológica, cultural y socioeconómica de las plantas, extrayendo conclusiones prácticas.",
          ],
          actitudinales: [
            "CN.B.5.4.a.2. Valorar la riqueza vegetal del Ecuador.",
            "CN.B.5.4.a.3. Promover la conservación de especies vegetales nativas y endémicas.",
            "CN.B.5.4.a.4. Valorar el papel de la mujer en la ciencia, reconociendo contribuciones como la de Mary Agnes Chase en la taxonomía y clasificación de plantas.",
          ],
        },
      },
      {
        nivel: "BIOLOGÍA",
        grado: "TERCER CURSO",
        indicadores: [
          { codigo: "I.CN.B.5.9.2", texto: "Explica el papel vital de las plantas en la seguridad alimentaria y en la medicina tradicional" },
          { codigo: "I.CN.B.5.9.3", texto: "Analiza la contribución de las plantas al desarrollo agrícola del país, así como el impacto de las prácticas agrícolas en los ecosistemas y las contribuciones de la Biotecnología en el campo de la Agricultura" },
        ],
        saberes: {
          declarativos: [
            "CN.B.5.4.d.9. Agricultura sostenible y seguridad alimentaria.",
            "CN.B.5.4.d.10. Plantas medicinales y principios activos.",
            "CN.B.5.4.d.11. Biotecnología vegetal y mejoramiento genético.",
          ],
          procedimentales: [
            "CN.B.5.5.p.11. Evaluar el impacto de prácticas agrícolas en el ecosistema.",
            "CN.B.5.4.p.7. Indagar sobre el desarrollo de la Biotecnología en el campo de la Agricultura, interpretando su aplicación para una mejor alimentación. Seleccionar fuentes confiables sobre experimentos clave en biotecnología agrícola, extrayendo conclusiones prácticas.",
          ],
          actitudinales: [
            "CN.B.5.4.a.2. Valorar la riqueza vegetal del Ecuador y su potencial biotecnológico. Promover prácticas agrícolas sostenibles.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.CN.B.5.10",
    descripcion: "Demostrar pensamiento crítico al explicar con evidencia científica la importancia de la evolución biológica como el marco unificador de la biología, a partir de la comprensión de la teoría de Darwin, de la teoría sintética, de los mecanismos evolutivos, de las pruebas de la evolución para comprender la diversidad de los seres vivos y su parentesco evolutivo",
    competenciasClave: ["CMCT", "CC", "CD", "CCICC", "CSE"],
    porGrado: [
      {
        nivel: "BIOLOGÍA",
        grado: "PRIMER CURSO",
        indicadores: [
          { codigo: "I.CN.B.5.10.2", texto: "Explica los fundamentos básicos de la teoría de la evolución biológica" },
          { codigo: "I.CN.B.5.10.1", texto: "Relaciona las pruebas de la evolución con la diversidad de los seres vivos y su parentesco evolutivo" },
        ],
        saberes: {
          declarativos: [
            "CN.B.5.1.d.20. Evolución biológica: definición e importancia.",
            "CN.B.5.1.d.21. Teoría de la Evolución de Darwin y Wallace.",
            "CN.B.5.1.d.22. Pruebas a favor de la Teoría de la Evolución: fósiles, anatómicas, embriológicas, geológicas, biogeográficas, biología molecular.",
          ],
          procedimentales: [
            "CN.B.5.1.p.12. Extraer conclusiones sobre las relaciones filogenéticas y los procesos de cambio.",
            "CN.B.5.1.p.13. Explicar los principios evolutivos con casos concretos.",
            "CN.B.5.1.p.14. Interpretar árboles filogenéticos.",
            "CN.B.5.1.p.18. Aplicar los principios fundamentales de la evolución para interpretar la diversidad, la historia y las interrelaciones de la vida en la Tierra.",
            "CN.B.5.1.p.20. Indagar sobre la evolución de los pinzones de las Galápagos y sus picos que sustentaron la Teoría de la evolución de Darwin basada en los principios de la selección natural.",
          ],
          actitudinales: [
            "CN.B.5.1.a.6. Deconstruir ideas pseudocientíficas, reconociendo la evolución como una teoría central y unificadora en la biología y que da respuesta de dónde venimos.",
            "CN.B.5.1.a.7. Asimilar que somos un componente más del planeta, descartando la visión teleológica de la vida.",
          ],
        },
      },
      {
        nivel: "BIOLOGÍA",
        grado: "SEGUNDO CURSO",
        indicadores: [
          { codigo: "I.CN.B.5.10.3", texto: "Describe los principales mecanismos de evolución como la mutación, selección natural, deriva génica y migración y su importancia para los seres vivos" },
          { codigo: "I.CN.B.5.10.2", texto: "Explica los fundamentos básicos de la teoría de la evolución biológica a partir de la teoría sintética que aúna las ideas de Darwin con las leyes de Mendel y la genética moderna" },
          { codigo: "I.CN.B.5.10.3", texto: "Explica la relación entre adaptación y eficacia biológica con la posibilidad de aparición de nuevas especies por cambios en el ambiente" },
        ],
        saberes: {
          declarativos: [
            "CN.B.5.1.d.23. Mecanismos de la evolución: mutación, selección natural, deriva génica y migración.",
            "CN.B.5.1.d.24. Adaptación y eficacia biológica.",
            "CN.B.5.1.d.25. Teoría sintética de la Evolución.",
          ],
          procedimentales: [
            "CN.B.5.3.p.5. Relacionar las estrategias adaptativas de los animales durante la evolución.",
            "CN.B.5.1.p.19. Analizar la posibilidad de aparición de nuevas especies por cambios en el ambiente.",
            "CN.B.5.1.p.25. Comparar la teoría de la evolución de Darwin con la teoría sintética de la evolución para evidenciar su complementariedad.",
          ],
          actitudinales: [
            "CN.B.5.1.a.8. Valorar el papel de la evolución en la configuración de la vida humana considerando las pruebas a favor de la Teoría de la Evolución.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.CN.Q.5.3",
    descripcion: "Modelizar la estructura atómica y los enlaces químicos para explicar las propiedades y funciones de distintos compuestos en contextos naturales, sociales y ambientales, aplicando la nomenclatura IUPAC y valorando sus implicaciones en la vida cotidiana y la sostenibilidad",
    competenciasClave: ["CMCT", "CC", "CD", "CCICC", "CIT"],
    porGrado: [
      {
        nivel: "QUÍMICA",
        grado: "PRIMER CURSO",
        indicadores: [
          { codigo: "I.CN.Q.5.3.1", texto: "Compara modelos atómicos (Demócrito, Dalton, Thomson, Rutherford, Bohr y mecánico-cuántico), a partir de sus representaciones y los relaciona con la estructura atómica, la configuración electrónica y las propiedades de los compuestos" },
          { codigo: "I.CN.Q.5.3.2", texto: "Aplica las reglas de formulación y nomenclatura IUPAC para identificar y comunicar de manera precisa la estructura y composición, de compuestos de origen natural, o contaminante" },
          { codigo: "I.CN.Q.5.3.3", texto: "Analiza la relación entre el tipo de enlace, la estructura y las propiedades físicas y químicas de los compuestos, explicando su comportamiento e implicaciones en sustancias de la vida cotidiana, utilizando criterios de sostenibilidad y responsabilidad ambiental" },
        ],
        saberes: {
          declarativos: [
            "CN.Q.5.2.d.3. Configuración electrónica de los elementos y su relación con la tabla periódica.",
            "CN.Q.5.2.d.4. Propiedades periódicas de los elementos (radio atómico, energía de ionización, afinidad electrónica y electronegatividad).",
            "CN.Q.5.2.d.5. Enlace químico: iónico, covalente, metálico y fuerzas intermoleculares.",
            "CN.Q.5.2.d.6. Teoría de Lewis y estructuras de enlace.",
            "CN.Q.5.2.d.7. Propiedades físicas y químicas de sustancias según su estructura y tipo de enlace.",
            "CN.Q.5.2.d.9. Nomenclatura y formulación de compuestos inorgánicos según normas IUPAC.",
          ],
          procedimentales: [
            "CN.Q.5.2.p.2. Representar configuraciones electrónicas y relacionar las propiedades periódicas de los elementos.",
            "CN.Q.5.2.p.3. Formular compuestos químicos siguiendo las normas I.",
            "UPAC.CN.Q.5.2.p.6. Relacionar propiedades físicas observadas en laboratorio con el tipo de enlace y estructura de la sustancia.",
            "CN.Q.5.2.p.7. Utilizar de herramientas tecnológicas (simulaciones digitales, software de modelado molecular e impresión 3D) para representar estructuras químicas y relacionarlas con sus propiedades.",
            "CN.Q.5.2.p.8. Nombrar compuestos químicos siguiendo las normas IUPAC.",
          ],
          actitudinales: [
            "CN.Q.5.2.a.1. Reconocer el carácter evolutivo, provisional y perfectible de los modelos atómicos y del conocimiento científico.",
            "CN.Q.5.2.a.2. Valorar la importancia de la química en el desarrollo tecnológico, la medicina, la industria y la sostenibilidad ambiental.",
            "CN.Q.5.2.a.3. Valorar el conocimiento ancestral y los saberes tradicionales relacionados con compuestos químicos de origen natural (plantas medicinales, pigmentos, fermentaciones.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.CN.Q.5.1",
    descripcion: "Analizar diferentes muestras de materia en prácticas experimentales y situaciones cotidianas, mediante la determinación de la densidad, el cálculo de la concentración de disoluciones y la aplicación de técnicas sencillas de separación y purificación de mezclas, para interpretar fenómenos cotidianos y resolver problemas con criterio científico, precisión y responsabilidad ambiental y social",
    competenciasClave: ["CMCT", "CC", "CD", "CSE", "CCICC", "CIT"],
    porGrado: [
      {
        nivel: "QUÍMICA",
        grado: "PRIMER CURSO",
        indicadores: [
          { codigo: "I.CN.Q.5.1.1", texto: "Determina la densidad de distintas muestras de materia y la concentración de distintas disoluciones mediante mediciones y cálculos, con registro y comparación de resultados, uso adecuado de las unidades correspondientes, rigor científico y precisión" },
          { codigo: "I.CN.Q.5.1.2", texto: "Aplica técnicas sencillas de separación y purificación de mezclas, como filtración, decantación, destilación, y adsorción, según las propiedades de sus componentes y su utilidad en procesos cotidianos de tratamiento del agua y otras mezclas" },
          { codigo: "I.CN.Q.5.1.3", texto: "Interpreta los resultados experimentales de distintas muestras de materia con base en criterios fisicoquímicos básicos, para la clasificación de las muestras y la valoración de sus implicaciones para la salud y el ambiente" },
        ],
        saberes: {
          declarativos: [
            "CN.Q.5.1.d.1. Magnitudes físicas (fundamentales y derivadas) y Sistema Internacional de Unidades (SI).",
            "CN.Q.5.1.d.2. Densidad como propiedad física de la materia: concepto, relación entre masa y volumen.",
            "CN.Q.5.1.d.5. Clasificación de la materia: sustancias puras, mezclas, disoluciones y coloides.",
            "CN.Q.5.1.d.6. Concentración de disoluciones: porcentaje masa/volumen, molaridad, molalidad.",
            "CN.Q.5.1.d.12. Técnicas sencillas de separación y purificación de mezclas: filtración, decantación, destilación y adsorción.",
            "CN.Q.5.1.d.13. Criterios fisicoquímicos básicos para el análisis de muestras de materia, como agua y mezclas cotidianas.",
          ],
          procedimentales: [
            "CN.Q.5.1.p.1. Determinar la densidad de muestras de materia a partir de la medición de masa y volumen.",
            "CN.Q.5.1.p.6. Calcular la concentración de disoluciones en porcentajes masa/volumen, molaridad y molalidad.",
            "CN.Q.5.1.p.10. Aplicar técnicas sencillas de separación y purificación de mezclas.",
            "CN.Q.5.1.p.11. Interpretar resultados experimentales para clasificar muestras de materia según criterios fisicoquímicos básicos.",
          ],
          actitudinales: [
            "CN.Q.5.1.a.1. Valorar la importancia del uso correcto del Sistema Internacional de Unidades para asegurar una comunicación científica precisa.",
            "CN.Q.5.1.a.2. Demostrar rigor, orden y precisión en la toma de datos experimentales y en los cálculos numéricos.",
            "CN.Q.5.1.a.3. Desarrollar curiosidad científica y la capacidad de formular preguntas a partir de la observación de fenómenos cotidianos.",
            "CN.Q.5.1.a.4. Valorar la importancia del método científico en el estudio experimental de la materia y sus cambios.",
            "CN.Q.5.1.a.5. Actuar con responsabilidad ambiental y social en el uso de materiales, sustancias y residuos durante las prácticas experimentales.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.CN.Q.5.2",
    descripcion: "Analizar el comportamiento de los gases y de los cambios de estado de la materia mediante la aplicación de las leyes de los gases, modelos cinético-moleculares y procedimientos experimentales o simulados, para interpretar los efectos de la contaminación atmosférica, proponer estrategias de prevención y mitigación de riesgos ambientales, y tomar decisiones informadas que contribuyan a la conservación de la salud y el entorno",
    competenciasClave: ["CMCT", "CC", "CD", "CCICC", "CIT"],
    porGrado: [
      {
        nivel: "QUÍMICA",
        grado: "SEGUNDO CURSO",
        indicadores: [
          { codigo: "I.CN.Q.5.2.1", texto: "Aplica las leyes de los gases (Boyle, Charles, Gay-Lussac, Dalton e ideal), mediante procedimientos experimentales o simulaciones digitales, con apoyo de representaciones gráficas, para interpretar la relación entre presión, volumen y temperatura en fenómenos reales y atmosféricos" },
          { codigo: "I.CN.Q.5.2.2", texto: "Analiza los cambios de estado y los procesos de equilibrio térmico mediante la teoría cinético-molecular, para interpretar fenómenos cotidianos y atmosféricos, como la formación de nubes y la contaminación del aire" },
          { codigo: "I.CN.Q.5.2.3", texto: "Propone medidas de prevención y mitigación sobre contaminación ambiental atmosférica, sustentadas en evidencias y en el reconocimiento del carácter provisional y perfectible de los modelos científicos, con actitud crítica y responsabilidad ambiental" },
        ],
        saberes: {
          declarativos: [
            "CN.Q.5.1.d.3. Estados de agregación de la materia y sus propiedades.",
            "CN.Q.5.1.d.4. Cambios de estado y su relación con la energía.",
            "CN.Q.5.1.d.7. Leyes experimentales de los gases: Boyle, Charles y Gay-Lussac.",
            "CN.Q.5.1.d.8. Teoría cinético-molecular de los gases.",
            "CN.Q.5.1.d.9. Ley de los gases ideales y comportamiento de mezclas gaseosas.",
            "CN.Q.5.1.d.10. Ley de Dalton de presiones parciales.",
            "CN.Q.5.1.d.11. Impacto de los gases contaminantes de origen natural y antropogénico en la salud humana y los ecosistemas.",
            "CN.Q.5.1.d.14. Evolución y limitaciones de los modelos científicos que explican el comportamiento de los gases y los cambios de estado de la materia.",
          ],
          procedimentales: [
            "CN.Q.5.1.p.2. Interpretar evidencias experimentales sobre los cambios de estado de las sustancias y su relación con la transferencia de energía térmica.",
            "CN.Q.5.1.p.3. Aplicar la ley de los gases ideales en la resolución de situaciones experimentales, reales o simuladas.",
            "CN.Q.5.1.p.4. Resolver problemas de gases aplicando las leyes de Boyle, Charles y Gay-Lussac.",
            "CN.Q.5.1.p.5. Modelizar el comportamiento de sistemas gaseosos mediante simulaciones y herramientas digitales.",
            "CN.Q.5.1.p.7. Analizar experimentalmente la relación entre presión, volumen y temperatura en sistemas gaseoso.",
            "CN.Q.5.1.p.8. Representar gráficamente la relación entre presión, volumen y temperatura en sistemas gaseosos a partir de datos experimentales o simulados.",
            "CN.Q.5.1.p.9. Calcular presiones parciales en mezclas gaseosas aplicando la ley de Dalton.",
            "CN.Q.5.1.p.12. Proponer medidas de prevención y mitigación frente a situaciones de contaminación atmosférica, a partir del análisis de sus efectos en la salud humana y en los ecosistemas.",
          ],
          actitudinales: [
            "CN.Q.5.1.a.6. Valorar el aporte de las leyes de los gases para explicar el comportamiento de la atmósfera y su relación con problemas ambientales.",
            "CN.Q.5.1.a.7. Desarrollar una actitud crítica frente a explicaciones no fundamentadas sobre fenómenos naturales.",
            "CN.Q.5.1.a.8. Promover el trabajo colaborativo en prácticas de laboratorio, respetando roles, aportes y la seguridad.",
            "CN.Q.5.1.a.9. Valorar el aporte de la química y la física en la interpretación de fenómenos atmosféricos y en la búsqueda de soluciones sostenibles.",
            "CN.Q.5.1.a.10. Demostrar responsabilidad ambiental en el uso de materiales de laboratorio y en la gestión de residuos.",
            "CN.Q.5.1.a.11. Valorar el carácter provisional, evolutivo y perfectible de los modelos científicos y su constante revisión.",
            "CN.Q.5.1.a.12. Tomar conciencia de los riesgos asociados a la contaminación atmosférica, promoviendo actitudes responsables para la prevención y conservación del aire limpio como bien común.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.CN.Q.5.4",
    descripcion: "Analizar las transformaciones químicas en procesos naturales, cotidianos y productivos, considerando las cantidades y proporciones entre reactivos y productos, los intercambios de energía, la velocidad de reacción, el equilibrio químico y el comportamiento ácido-base, como base para explicar científicamente y tomar decisiones responsables sobre las implicaciones ambientales, sociales y culturales",
    competenciasClave: ["CMCT", "CC", "CD", "CCICC", "CIT"],
    porGrado: [
      {
        nivel: "QUÍMICA",
        grado: "SEGUNDO CURSO",
        indicadores: [
          { codigo: "I.CN.Q.5.4.1", texto: "Aplica las leyes ponderales, el concepto de mol, el ajuste de ecuaciones y la estequiometría para determinar las cantidades y proporciones entre reactivos y productos en reacciones químicas presentes en procesos naturales, cotidianos y productivos" },
          { codigo: "I.CN.Q.5.4.2", texto: "Interpreta los intercambios de energía en reacciones endotérmicas y exotérmicas mediante evidencias experimentales y diagramas energéticos, reconociendo el cambio de entalpía, la energía de activación y el efecto de los catalizadores" },
          { codigo: "I.CN.Q.5.4.3", texto: "Analiza la influencia de la concentración, la temperatura, la presión, la superficie de contacto y los catalizadores sobre la velocidad y el equilibrio químico, así como el comportamiento ácido-base y el pH, mediante evidencias experimentales, cálculos o simulaciones, con criterios de seguridad y sostenibilidad" },
        ],
        saberes: {
          declarativos: [
            "CN.Q.5.3.d.1. Leyes ponderales: conservación de la masa, proporciones definidas y proporciones múltiples.",
            "CN.Q.5.3.d.2. Mol, número de Avogadro y su relación con la cantidad de sustancia.",
            "CN.Q.5.3.d.3. Ecuaciones químicas y tipos de reacciones: síntesis, descomposición, desplazamiento, combustión, neutralización y oxidación-reducción.",
            "CN.Q.5.3.d.4. Estequiometría: cantidades y proporciones entre reactivos y productos.",
            "CN.Q.5.3.d.5. Intercambios de energía en las reacciones químicas: reacciones endotérmicas y exotérmicas, entalpía, cambio de entalpía, energía de activación y diagramas energéticos.",
            "CN.Q.5.3.d.6. Velocidad de reacción y factores que la modifican: concentración, temperatura, presión, superficie de contacto y catalizadores.",
            "CN.Q.5.3.d.7. Equilibrio químico, constante de equilibrio y principio de Le Châtelier.",
            "CN.Q.5.3.d.8. Ácidos y bases: propiedades, neutralización, escala de pH, indicadores ácido-base y relación entre el pH y la concentración de iones hidronio.",
            "CN.Q.5.3.d.9. Parámetros de calidad y seguridad de productos químicos de uso cotidiano (pH, seguridad en pieles, biodegradabilidad).",
            "CN.Q.5.3.d.10. Transformaciones químicas en procesos naturales, cotidianos, productivos y tradicionales: fotosíntesis, respiración, fermentación, combustión, corrosión, elaboración de alimentos, curtido y obtención de tintes naturales.",
            "CN.Q.5.3.d.11. Principios de química verde: prevención de residuos, eficiencia energética, reducción de sustancias peligrosas y diseño de procesos sostenibles.",
          ],
          procedimentales: [
            "CN.Q.5.3.p.1. Realizar la clasificación y el balanceo de ecuaciones químicas de reacciones sencillas mediante la aplicación de la ley de conservación de la masa y los números de oxidación en reacciones sencillas.",
            "CN.Q.5.3.p.2. Resolver cálculos estequiométricos relacionados con masas, moles, partículas, reactivos y productos.",
            "CN.Q.5.3.p.3. Interpretar evidencias experimentales y diagramas energéticos para distinguir reacciones endotérmicas y exotérmicas, el cambio de entalpía y la energía de activación.",
            "CN.Q.5.3.p.4. Analizar experimentalmente los factores que modifican la velocidad de reacción.",
            "CN.Q.5.3.p.5. Predecir cambios en el equilibrio químico mediante la aplicación del principio de Le Châtelier.",
            "CN.Q.5.3.p.6. Determinar el pH de disoluciones mediante cálculos, indicadores ácido-base, papel indicador o sensores digitales.",
          ],
          actitudinales: [
            "CN.Q.5.3.a.1. Actuar con rigor, orden y honestidad en la obtención, el registro y la interpretación de datos experimentales.",
            "CN.Q.5.3.a.2. Cumplir las normas de seguridad durante el manejo de sustancias, materiales, fuentes de calor y residuos químicos.",
            "CN.Q.5.3.a.3. Adoptar una postura crítica frente a las implicaciones ambientales y sociales de las transformaciones químicas.",
            "CN.Q.5.3.a.4. Valorar la química verde como alternativa para reducir riesgos, residuos y afectaciones ambientales.",
            "CN.Q.5.3.a.5. Respetar los saberes ancestrales y las prácticas tradicionales relacionadas con las transformaciones químicas.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.CN.Q.5.5",
    descripcion: "Analizar la estructura, las propiedades y las transformaciones de los compuestos del carbono y su relación con los contaminantes derivados de la actividad petrolera mediante la interpretación de procesos químicos asociados al petróleo, para diagnosticar riesgos ambientales y argumentar sus implicaciones ecológicas y sociales con responsabilidad ambiental",
    competenciasClave: ["CMCT", "CC", "CD", "CCICC", "CIT", "CSE"],
    porGrado: [
      {
        nivel: "QUÍMICA",
        grado: "TERCER CURSO",
        indicadores: [
          { codigo: "I.CN.Q.5.5.1", texto: "Explica los principales contaminantes orgánicos derivados del petróleo, mediante el análisis de su composición química, estructura molecular, transformaciones y reacciones características, así como sus efectos sobre el agua, el suelo, la atmósfera y los seres vivos" },
          { codigo: "I.CN.Q.5.5.2", texto: "Analiza información científica, ambiental y social proveniente de diversas fuentes estableciendo relaciones entre los procesos químicos implicados y las implicaciones ecológicas y sociales de los contaminantes derivados de la actividad petrolera en el contexto ecuatoriano" },
          { codigo: "I.CN.Q.5.5.3", texto: "Argumenta el diagnóstico de riesgos ambientales asociados a contaminantes derivados de la actividad petrolera, considerando evidencias químicas, ecológicas y sociales para sustentar decisiones responsables" },
        ],
        saberes: {
          declarativos: [
            "CN.Q.5.4.d.1. Carbono como elemento esencial de la vida y base de los recursos orgánicos naturales del Ecuador: suelos, biomasa, petróleo y gas natural.",
            "CN.Q.5.4.d.2. Estructura y propiedades del carbono que le permiten formar cadenas, anillos y compuestos complejos presentes en los ecosistemas.",
            "CN.Q.5.4.d.3. Compuestos orgánicos: clasificación general y relación entre su estructura, propiedades y aplicaciones en hidrocarburos y derivados del petróleo.",
            "CN.Q.5.4.d.4. Reglas básicas de nomenclatura IUPAC para hidrocarburos extraídos o derivados del petróleo ecuatoriano (alcanos, alquenos, alquinos y aromáticos).",
            "CN.Q.5.4.d.5. Grupos funcionales orgánicos (alcoholes, éteres, ácidos carboxílicos, ésteres, aminas) y su relación con productos naturales y sintéticos de uso cotidiano.",
            "CN.Q.5.4.d.6. Isomería estructural y geométrica de compuestos orgánicos y su relación con las propiedades de hidrocarburos presentes en derivados del petróleo.",
            "CN.Q.5.4.d.7. Petróleo ecuatoriano: origen orgánico, composición química, propiedades físicas y principales yacimientos (Amazonía: Sucumbíos, Orellana, Pastaza).",
            "CN.Q.5.4.d.8. Procesos industriales del petróleo en Ecuador: extracción, refinación, transporte y producción de derivados petroquímicos.",
            "CN.Q.5.4.d.10. Procesos de transformación petroquímica: craqueo catalítico, reformado, polimerización y síntesis de plásticos.",
            "CN.Q.5.4.d.14. Impactos ambientales de la industria petrolera en los ecosistemas amazónicos y marinos del Ecuador.",
          ],
          procedimentales: [
            "CN.Q.5.4.p.1. Aplicar las normas IUPAC en la nomenclatura y formulación de hidrocarburos y compuestos orgánicos.",
            "CN.Q.5.4.p.2. Construir modelos moleculares tridimensionales de hidrocarburos y otros compuestos orgánicos derivados del petróleo.",
            "CN.Q.5.4.p.3. Identificar grupos funcionales en muestras seguras de productos de uso cotidiano mediante modelos moleculares, análisis de etiquetas y pruebas químicas cualitativas sencillas.",
            "CN.Q.5.4.p.5. Representar esquemáticamente el ciclo de producción del petróleo ecuatoriano desde el pozo hasta el consumidor.",
            "CN.Q.5.4.p.12. Argumentar diagnósticos de riesgos ambientales derivados de contaminantes petroleros mediante evidencias químicas, ecológicas y sociales.",
          ],
          actitudinales: [
            "CN.Q.5.4.a.1. Valorar la importancia del carbono como elemento fundamental para los sistemas vivos y las actividades industriales del Ecuador.",
            "CN.Q.5.4.a.2. Valorar la química orgánica como herramienta para generar energía y materiales de forma sostenible.",
            "CN.Q.5.4.a.3. Desarrollar una actitud crítica frente al impacto ambiental de la extracción y procesamiento del petróleo.",
            "CN.Q.5.4.a.7. Mostrar respeto y empatía hacia las comunidades afectadas por la contaminación química.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.CN.Q.5.6",
    descripcion: "Diseñar estrategias y artefactos sencillos para prevenir o mitigar la contaminación química generada por la actividad petrolera en el suelo, el agua, la atmósfera y los seres vivos, integrando principios de química verde, biotecnología, ingeniería limpia y saberes ancestrales, para promover la innovación sostenible, el pensamiento científico y la responsabilidad socioambiental en el contexto ecuatoriano",
    competenciasClave: ["CMCT", "CC", "CD", "CIT", "CCICC"],
    porGrado: [
      {
        nivel: "QUÍMICA",
        grado: "TERCER CURSO",
        indicadores: [
          { codigo: "I.CN.Q.5.6.1", texto: "Compara estrategias sostenibles, como la química verde, la biotecnología, la ingeniería limpia y los saberes ancestrales para prevenir, mitigar la contaminación química derivada de la actividad petrolera en medios terrestres, acuáticos y atmosféricos" },
          { codigo: "I.CN.Q.5.6.2", texto: "Diseña prototipos o artefactos sencillos de depuración o reciclaje químico, aplicando principios de química verde mediante procesos de catálisis, adsorción o filtrado, y evalúa su eficacia a partir de registros experimentales y análisis de resultados" },
          { codigo: "I.CN.Q.5.6.3", texto: "Argumenta propuestas de solución a problemas de contaminación química, valorando su viabilidad técnica, sostenibilidad ambiental y coherencia ética y cultural en regiones afectadas por la industria petrolera" },
        ],
        saberes: {
          declarativos: [
            "CN.Q.5.4.d.9. Principales fracciones del petróleo y sus usos: gas licuado (GLP), gasolina, diésel, queroseno y lubricantes.",
            "CN.Q.5.4.d.11. Polímeros derivados del petróleo: aplicaciones en la industria ecuatoriana, impactos ambientales, reciclaje y gestión sostenible de residuos.",
            "CN.Q.5.4.d.12. Biocombustibles ecuatorianos como aplicación de la biotecnología: bioetanol de caña de azúcar, biodiésel de palma africana y biogás de residuos agrícolas.",
            "CN.Q.5.4.d.13. Catálisis y su aplicación en la refinación y la producción sostenible de combustibles.",
            "CN.Q.5.4.d.15. Tecnologías limpias y saberes ancestrales aplicados a la prevención y mitigación de la contaminación química: depuración de agua, filtración, adsorción, catálisis verde, reciclaje químico y prácticas tradicionales de conservación ambiental.",
          ],
          procedimentales: [
            "CN.Q.5.4.p.4. Identificar las fraccionada del petróleo mediante la simulación de la destilación fraccionada.",
            "CN.Q.5.4.p.6. Comparar propiedades físicas entre hidrocarburos ecuatorianos y biocombustibles.",
            "CN.Q.5.4.p.7. Diseñar un sistema de filtrado de agua contaminada con aceites o residuos orgánicos usando materiales simples.",
            "CN.Q.5.4.p.8. Realizar prácticas experimentales con adsorbentes naturales, como carbón vegetal, zeolitas u otros materiales de uso tradicional, para la eliminación de compuestos orgánicos presentes en el agua.",
            "CN.Q.5.4.p.9. Elaborar maquetas o simulaciones de plantas depuradoras y catalizadores verdes.",
            "CN.Q.5.4.p.10. Diseñar proyectos escolares sobre recuperación y reutilización de residuos orgánicos y plásticos.",
            "CN.Q.5.4.p.11. Calcular la huella de carbono personal o escolar como base para la formulación de medidas de reducción.",
          ],
          actitudinales: [
            "CN.Q.5.4.a.4. Actuar con responsabilidad en el uso de los recursos energéticos y los materiales derivados del carbono.",
            "CN.Q.5.4.a.5. Valorar las tecnologías limpias y los procesos de descontaminación como alternativas para reducir la contaminación química.",
            "CN.Q.5.4.a.6. Cumplir con las normas de seguridad y prevención en el manejo de sustancias orgánicas y combustibles.",
            "CN.Q.5.4.a.8. Promover hábitos de consumo responsable, reciclaje y reducción de residuos plásticos.",
            "CN.Q.5.4.a.9. Desarrollar conciencia ecológica y compromiso con la sostenibilidad ambiental en el Ecuador.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.CN.F.5.1",
    descripcion: "Analizar situaciones reales y actividades cotidianas que involucran MRU y MRUV, mediante la elaboración de tablas y gráficas y el uso de herramientas tecnológicas dentro de un sistema de referencia definido, para resolver problemas vinculados a la educación vial y a la movilidad sostenible",
    competenciasClave: ["CC", "CMCT", "CD", "CIT", "CCICC"],
    porGrado: [
      {
        nivel: "FÍSICA",
        grado: "PRIMER CURSO",
        indicadores: [
          { codigo: "I.CN.F.5.1.1", texto: "Sistematiza información sobre situaciones cotidianas que involucran MRU y MRUV mediante la observación, experimentación y elaboración de tablas y gráficas de movimiento en función del tiempo y determina magnitudes cinemáticas (posición, desplazamiento, velocidad y aceleración) a partir de dichas gráficas" },
          { codigo: "I.CN.F.5.1.2", texto: "Resuelve problemas del entorno que involucran MRU y MRUV, obteniendo e interpretando magnitudes cinemáticas (posición, desplazamiento, velocidad y aceleración) mediante la aplicación de herramientas tecnológicas para la toma de decisiones con criterio científico" },
        ],
        saberes: {
          declarativos: [
            "CN.F.5.1.d.1. Sistemas de referencia, ejes coordenados en el plano cartesiano y sus componentes.",
            "CN.F.5.1.d.2. Magnitudes escalares y vectoriales (elementos de un vector: módulo y dirección).",
            "CN.F.5.1.d.3. Magnitudes cinemáticas: posición, desplazamiento, velocidad y aceleración.",
            "CN.F.5.1.d.4. Ecuaciones del MRU y.",
            "MRUV.CN.F.5.1.d.5. Movimiento vertical: Caída libre y lanzamiento vertical.",
          ],
          procedimentales: [
            "CN.F.5.1.p.1. Identificar sistemas de referencia y magnitudes escalares y vectoriales justificando su uso en la resolución de problemas físicos contextualizados en la vida cotidiana.",
            "CN.F.5.1.p.2. Reconocer las magnitudes presentes en el MRU y MRUV (trayectoria, distancia, rapidez, posición, desplazamiento, velocidad y aceleración).",
            "CN.F.5.1.p.3. Analizar de forma gráfica el movimiento de un cuerpo mediante los diagramas: posición en función del tiempo, velocidad en función del tiempo, aceleración en función del tiempo.",
            "CN.F.5.1.p.4. Deducir las ecuaciones cinemáticas del MRU y.",
            "MRUV.CN.F.5.1.p.5. Identificar el movimiento vertical bajo la acción de la gravedad (lanzamiento vertical y caída libre) como un caso particular del MRUV sin y con rozamiento con el aire.",
            "CN.F.5.1.p.6. Resolver problemas que involucren MRU y MRUV (incluidos la caída libre y el lanzamiento vertical sin y con rozamiento del aire).",
          ],
          actitudinales: [
            "CN.F.5.1.a.1. Resaltar la importancia del método científico para validar definiciones y relaciones entre magnitudes.",
            "CN.F.5.1.a.2. Impulsar la curiosidad científica para comprender los fenómenos físicos relacionados con el MRU, MRUV presente en contextos movilidad vial.",
            "CN.F.5.1.a.3. Fomentar el pensamiento crítico, lógico y científico para la resolución de MRU, MRUV y movimiento vertical en problemas reales.",
            "CN.F.5.1.a.4. Promover la creatividad para encontrar soluciones innovadoras a problemas contextualizados de MRU, MRUV y movimiento vertical.",
            "CN.F.5.1.a.5. Concientizar sobre la importancia de las normas de tránsito aplicando MRU y MRUV a la seguridad vial (importancia de respetar los límites de velocidad, el tiempo de reacción y la distancia de seguridad) y movilidad sostenible.",
            "CN.F.5.1.a.6. Perseverar ante desafíos conceptuales o matemáticos en la resolución de problemas de cinemática en una dimensión.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.CN.F.5.2",
    descripcion: "Inferir soluciones a problemas cotidianos relacionados con las aplicaciones prácticas del movimiento en dos dimensiones en el campo de deportes y actividades físicas, a través del análisis de tablas y gráficas, a fin de fomentar la calidad de vida y la cultura científica en el desarrollo de capacidades basadas en la convivencia armónica, inclusiva, el respeto por las normas, reglas y prácticas éticas",
    competenciasClave: ["CC", "CD"],
    porGrado: [
      {
        nivel: "FÍSICA",
        grado: "PRIMER CURSO",
        indicadores: [
          { codigo: "I.CN.F.5.2.1", texto: "Aplica los conceptos de marcos de referencia para determinar la velocidad relativa de un objeto en movimiento" },
          { codigo: "I.CN.F.5.2.2", texto: "Analiza situaciones de movimiento en dos dimensiones en actividades deportivas, descomponiendo el movimiento en componentes horizontal y vertical para explicar el comportamiento de la trayectoria parabólica" },
          { codigo: "I.CN.F.5.2.3", texto: "Propone soluciones que mejoren la práctica deportiva basadas en el análisis del movimiento en dos dimensiones mediante tablas y gráficas cinemáticas, relacionando la cultura científica en la comprensión y evaluación crítica de la información" },
        ],
        saberes: {
          declarativos: [
            "CN.F.5.1.d.6. Marcos de referencia y velocidad relativa.",
            "CN.F.5.1.d.7. La independencia del movimiento en los ejes “x” y “y”.",
            "CN.F.5.1.d.8. Tiro parabólico.",
          ],
          procedimentales: [
            "CN.F.5.1.p.7. Descomponer vectores de velocidad en sus componentes horizontal y vertical.",
            "CN.F.5.1.p.8. Resolver problemas de velocidad relativa aplicando la suma vectorial en diferentes marcos de referencia.",
            "CN.F.5.1.p.9. Descomponer el movimiento en dos dimensiones como una combinación de MRU (horizontal) y MRUV (vertical) al describir la trayectoria de un objeto que se mueve en trayectoria parabólica.",
            "CN.F.5.1.p.10. Calcular el desplazamiento, velocidad y aceleración promedio en dos dimensiones en la resolución de problemas.",
            "CN.F.5.1.p.11. Deducir las ecuaciones que describen el movimiento parabólico a partir de los concetos asociados a la rapidez, velocidad inicial, ángulo de lanzamiento, aceleración de la gravedad, alcance, altura máxima y tiempo de vuelo.",
            "CN.F.5.1.p.12. Resolver problemas asociados a prácticas deportivas al determinar el ángulo de tiro, alcance, altura máxima y tiempo de vuelo de un proyectil.",
          ],
          actitudinales: [
            "CN.F.5.1.a.7. Promover la cultura científica como base para la toma de decisiones responsables en la vida cotidiana.",
            "CN.F.5.1.a.8. Demostrar responsabilidad y compromiso en la recolección y análisis de datos experimentales sobre el movimiento en dos dimensiones.",
            "CN.F.5.1.a.9. Referenciar adecuadamente el trabajo de otros autores y de la inteligencia artificial como requisito ético y legal en la investigación científica sobre el estudio de movimiento de proyectiles.",
            "CN.F.5.1.a.10. Mostrar interés por analizar fenómenos cotidianos desde una perspectiva científica.",
            "CN.F.5.1.a.11. Fomentar el respeto por el trabajo grupal y por los aportes de los compañeros al momento de analizar y resolver ejercicios de aplicación de la cinemática en dos dimensiones.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.CN.F.5.3",
    descripcion: "Analizar fenómenos físicos en contextos de educación para la seguridad vial y la movilidad sostenible, mediante la aplicación de las leyes de Newton y elaboración de diagramas de cuerpo libre, a fin de explicar el movimiento e interacción de los cuerpos, tomar conciencia de las consecuencias sociales de las decisiones individuales en la movilidad",
    competenciasClave: ["CC", "CMCT", "CD", "CIT", "CSE"],
    porGrado: [
      {
        nivel: "FÍSICA",
        grado: "PRIMER CURSO",
        indicadores: [
          { codigo: "I.CN.F.5.3.1", texto: "Analiza situaciones físicas reales o experimentales de objetos en reposo o en movimiento uniforme, identificando condiciones de equilibrio mediante la aplicación de la primera ley de Newton y su representación en diagramas de cuerpo libre" },
          { codigo: "I.CN.F.5.3.2", texto: "Analiza el movimiento de objetos a partir de la relación entre fuerza, masa y aceleración, aplicando la segunda ley de Newton en la resolución de problemas mediante diagramas de cuerpo libre" },
          { codigo: "I.CN.F.5.3.2", texto: "Explica la interacción entre cuerpos mediante la identificación de pares de acción y reacción, aplicando la tercera ley de Newton en situaciones físicas cotidianas relacionados con la seguridad vial y la movilidad sostenible" },
        ],
        saberes: {
          declarativos: [
            "CN.F.5.1.d.9. Sistemas de referencia inerciales y no inerciales.",
            "CN.F.5.1.d.10. Leyes de Newton.",
            "CN.F.5.1.d.11. Diagramas de cuerpo libre.",
            "CN.F.5.1.d.12. Relación entre las magnitudes: aceleración y fuerza que actúan sobre un objeto y su masa.",
            "CN.F.5.1.d.13. Fuerzas de contacto (fricción, tensión, entre otras).",
            "CN.F.5.1.d.14. Objetos en equilibrio.",
            "CN.F.5.1.d.15. Campo gravitatorio.",
            "CN.F.5.1.d.16. Relación entre peso, masa e intensidad del campo gravitatorio.",
            "CN.F.5.1.d.17. Rapidez terminal.",
          ],
          procedimentales: [
            "CN.F.5.1.p.13. Reconocer los sistemas inerciales y no inerciales en diferentes contextos.",
            "CN.F.5.1.p.14. Explicar el significado conceptual de las tres leyes de Newton, relacionándolas con fenómenos cotidianos.",
            "CN.F.5.1.p.15. Elaborar diagramas de cuerpo libre para distintos sistemas físicos representando las fuerzas de contacto.",
            "CN.F.5.1.p.16. Resolver problemas que involucre el equilibrio en objetos según las leyes del movimiento.",
            "CN.F.5.1.p.17. Explicar que la intensidad del campo gravitatorio de un planeta determina el peso de un objeto de masa (m), estableciendo que el peso puede variar, pero la masa es la misma.",
            "CN.F.5.1.p.18. Determinar el peso de un objeto en distintos campos gravitatorios.",
            "CN.F.5.1.p.19. Deducir el valor aproximado de la gravedad en la superficie terrestre en el Ecuador y calcular la rapidez terminar de los objetos.",
            "CN.F.5.1.p.20. Aplicar las leyes de Newton para resolver problemas en situaciones reales.",
          ],
          actitudinales: [
            "CN.F.5.1.a.7. Promover la cultura científica como base para la toma de decisiones responsables en la vida cotidiana.",
            "CN.F.5.1.a.12. Concientizar sobre la importancia de la ciencia para prevenir accidentes y proteger la vida aplicando la comprensión de las fuerzas.",
            "CN.F.5.1.a.13. Reconocer el impacto de las leyes de Newton en avances tecnológicos útiles para enfrentar los retos del siglo XXI.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.CN.F.5.4",
    descripcion: "Modelar fenómenos cotidianos y tecnológicos relacionados con el MCU y el MCUV, mediante el análisis de representaciones gráficas y el uso de herramientas digitales, para comprender fenómenos físicos y resolver problemas de la vida cotidiana, integrando conocimientos científicos y matemáticos en la resolución de problemas reales, comunicando los hallazgos de forma rigurosa y crítica",
    competenciasClave: ["CC", "CMCT", "CD", "CIT"],
    porGrado: [
      {
        nivel: "FÍSICA",
        grado: "SEGUNDO CURSO",
        indicadores: [
          { codigo: "I.CN.F.5.4.1", texto: "Interpreta las magnitudes del movimiento circular (posición angular, velocidad angular, aceleración angular y tiempo) mediante representaciones gráficas, uso de herramientas digitales y aplicación de modelos físicos para explicar fenómenos cotidianos y tecnológicos" },
          { codigo: "I.CN.F.5.4.2", texto: "Establece relaciones entre MRU y MRUV, y entre el MCU y MCUV, utilizando razonamiento científico y matemático para resolver problemas y la toma de decisiones con base en evidencias científicas" },
        ],
        saberes: {
          declarativos: [
            "CN.F.5.1.d.18. El MCU y MCUV como modelos de del movimiento circular.",
            "CN.F.5.1.d.19. Magnitudes angulares: posición angular, velocidad angular y aceleración angular.",
            "CN.F.5.1.d.20. Ecuaciones del MCU y.",
            "MCUV.CN.F.5.1.d.21. Relaciones entre cantidades angulares y lineales.",
            "CN.F.5.1.d.22. Aceleración y fuerza centrípeta.",
            "CN.F.5.1.d.23. Fuerza centrífuga (ficticia).",
          ],
          procedimentales: [
            "CN.F.5.1.p.21. Diferenciar el MCU del MCUV, en fenómenos cotidianos y tecnológicos, a partir del análisis de sus magnitudes características y mediante el análisis de gráficos.",
            "CN.F.5.1.p.22. Deducir las ecuaciones de movimiento que intervienen en el MCU y MCUV. y determinar la posición, rapidez y aceleración angular, rapidez y aceleración tangencial, aceleración centrípeta, aceleración total y fuerza centrípeta en el movimiento circular.",
            "CN.F.5.1.p.23. Relacionar los conceptos y magnitudes existentes entre el MCU y MRU, y entre el MCUV y.",
            "MRUV.CN.F.5.1.p.24. Aplicar las ecuaciones del MCU y MCUV en la resolución de problemas.",
          ],
          actitudinales: [
            "CN.F.5.1.a.7. Promover la cultura científica como base para la toma de decisiones responsables en la vida cotidiana.",
            "CN.F.5.1.a.14. Reconocer la importancia de la gestión del tiempo, considerando la influencia del movimiento circular en la Tierra.",
            "CN.F.5.1.a.15. Desarrollar habilidades de razonar sobre la física del movimiento, anticipando resultados y explicando observaciones en el MCU y.",
            "MCUV.CN.F.5.1.a.16. Gestionar procesos de trabajo en equipo al resolver problemas físicos de movimiento circular.",
            "CN.F.5.1.a.17. Impulsar la creatividad para encontrar soluciones innovadoras a problemas contextualizados de MCU y MCUV.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.CN.F.5.5",
    descripcion: "Aplicar los principios de la energía mecánica mediante el análisis del trabajo mecánico y la conservación de la energía para resolver problemas cotidianos y valorar, con pensamiento crítico y compromiso ético, el impacto del uso de máquinas y motores en el consumo energético y en el cambio climático",
    competenciasClave: ["CC", "CMCT", "CD", "CIT"],
    porGrado: [
      {
        nivel: "FÍSICA",
        grado: "SEGUNDO CURSO",
        indicadores: [
          { codigo: "I.CN.F.5.5.1", texto: "Resuelve problemas de la vida cotidiana relacionados con el trabajo mecánico y la conservación de la energía, aplicando representaciones matemáticas y digitales para reconocer el uso eficiente y la transformación de la energía realizadas por máquinas y motores" },
          { codigo: "I.CN.F.5.5.2", texto: "Argumenta con pensamiento crítico y compromiso ético sobre el impacto del consumo energético en el cambio climático, proponiendo alternativas responsables y sostenibles para el uso eficiente de la energía en su entorno escolar y comunitario" },
        ],
        saberes: {
          declarativos: [
            "CN.F.5.2.d.1. Trabajo mecánico.",
            "CN.F.5.2.d.2. Tipos de energía mecánica: cinética y potencial.",
            "CN.F.5.2.d.3. Conservación de energía mecánica.",
            "CN.F.5.2.d.4. Potencia.",
          ],
          procedimentales: [
            "CN.F.5.2.p.1. Medir desplazamientos y fuerzas para calcular trabajo mecánico.",
            "CN.F.5.2.p.2. Resolver ejercicios de aplicación contextualizados en la resolución de trabajo mecánico.",
            "CN.F.5.2.p.3. Analizar casos de trabajo positivo, negativo y nulo.",
            "CN.F.5.2.p.4. Interpretar el signo del trabajo según el sentido de la fuerza y del desplazamiento.",
            "CN.F.5.2.p.5. Calcular la energía cinética y potencial en objetos en movimiento y en reposo a distintas alturas.",
            "CN.F.5.2.p.6. Resolver ejercicios donde se aplica el principio de conservación de energía.",
            "CN.F.5.2.p.7. Analizar el principio de conservación de energía mecánica en situaciones reales o simulaciones en softwares interactivos.",
            "CN.F.5.2.p.8. Relacionar la potencia con el tiempo y el trabajo realizado.",
            "CN.F.5.2.p.9. Resolver problemas contextualizados aplicando la potencia mecánica.",
          ],
          actitudinales: [
            "CN.F.5.2.a.1. Valorar la importancia del trabajo mecánico en aplicaciones tecnológicas y en la vida cotidiana.",
            "CN.F.5.2.a.2. Reconocer la utilidad de los diferentes tipos de energía mecánica en el funcionamiento de máquinas y sistemas naturales.",
            "CN.F.5.2.a.7. Impulsar el consumo responsable de los recursos energéticos para el desarrollo sostenible.",
            "CN.F.5.2.a.3. Desarrollar el pensamiento crítico y reflexivo al analizar sistemas donde se transforma la energía mecánica.",
            "CN.F.5.2.a.5. Explorar alternativas innovadoras para aprovechar el uso eficiente de la energía en la vida cotidiana.",
            "CN.F.5.2.a.6. Promover prácticas responsables en el consumo energético para afrontar el cambio climático.",
            "CN.F.5.2.a.4. Impulsar el interés por identificar y describir ejemplos reales de energías mecánicas en su entorno.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.CN.F.5.6",
    descripcion: "Proponer soluciones a problemas cotidianos y tecnológicos a partir del análisis de fenómenos físicos relacionados con el movimiento periódico y oscilatorio, mediante la identificación, cálculo e interpretación de sus magnitudes, modelos y representaciones gráficas, con el fin de fortalecer el pensamiento crítico, la resolución de problemas, la seguridad y prevención de riesgos",
    competenciasClave: ["CC", "CD", "CIT", "CECA"],
    porGrado: [
      {
        nivel: "FÍSICA",
        grado: "SEGUNDO CURSO",
        indicadores: [
          { codigo: "I.CN.F.5.6.1", texto: "Analiza fenómenos físicos periódicos y oscilatorios presentes en situaciones cotidianas y tecnológicas, diferenciando sus características, condiciones de ocurrencia y magnitudes principales, para explicar su comportamiento y reconocer su relación con la seguridad y la prevención de riesgos" },
          { codigo: "I.CN.F.5.6.2", texto: "Interpreta magnitudes del movimiento periódico y oscilatorio, mediante relaciones físicas, modelos matemáticos y representaciones gráficas, para resolver problemas contextualizados y justificar el comportamiento de sistemas físicos simples" },
          { codigo: "I.CN.F.5.6.3", texto: "Propone soluciones a problemas cotidianos y tecnológicos relacionados con fenómenos periódicos y oscilatorios, considerando criterios físicos como amplitud, frecuencia, resonancia, amortiguamiento y disipación de energía, para fortalecer la seguridad, la prevención de riesgos y la toma de decisiones responsables" },
        ],
        saberes: {
          declarativos: [
            "CN.F.5.1.d.24. Elasticidad, deformación y el límite elástico de distintos materiales.",
            "CN.F.5.1.d.25. Enunciado y expresión matemática de la ley de Hooke.",
            "CN.F.5.1.d.26. Energía potencial elástica.",
            "CN.F.5.1.d.27. Características del movimiento periódico y movimiento oscilatorio.",
            "CN.F.5.1.d.28. Movimiento armónico simple (MAS) como un movimiento oscilatorio y periódico.",
            "CN.F.5.1.d.29. Magnitudes del MAS: elongación, amplitud, frecuencia, periodo, fase, velocidad angular.",
            "CN.F.5.1.d.30. Relación entre MAS y el movimiento circular.",
            "CN.F.5.1.d.31. Ecuaciones del.",
            "MAS.CN.F.5.1.d.32. Trabajo y energía en el.",
            "MAS.CN.F.5.1.d.33. Movimiento de un péndulo.",
            "CN.F.5.1.d.34. Oscilaciones amortiguadas.",
            "CN.F.5.1.d.35. Movimiento ondulatorio.",
            "CN.F.5.1.d.36. Tipos de onda.",
          ],
          procedimentales: [
            "CN.F.5.1.p.25. Diferenciar entre el comportamiento elástico y plástico de diversos materiales en distintas experimentaciones.",
            "CN.F.5.1.p.26. Diferenciar fenómenos periódicos y oscilatorios en situaciones cotidianas, tecnológicas y naturales, justificando sus características principales.",
            "CN.F.5.1.p.27. Explicar conceptos como fuerza elástica, constante del resorte, elongación y límite elástico.",
            "CN.F.5.1.p.28. Graficar la fuerza aplicada a un resorte en función de la elongación y obtener el valor de la constante (k) a partir de datos experimentales.",
            "CN.F.5.1.p.29. Reconocer ejemplos cotidianos donde se aplica la ley de Hooke.",
            "CN.F.5.1.p.30. Aplicar el modelo matemático de la energía potencial elástica en la resolución de problemas contextualizados.",
            "CN.F.5.1.p31. Emplear modelos matemáticos y simuladores digitales para representar el comportamiento del péndulo en oscilaciones pequeñas y grandes.",
            "CN.F.5.1.p.32. Identificar las magnitudes principales del MAS en representaciones gráficas, esquemas, simulaciones o situaciones experimentales.",
            "CN.F.5.1.p.33. Explicar la relación del movimiento armónico simple (MAS) con el movimiento circular uniforme (MCU).",
            "CN.F.5.1.p.34. Aplicar las ecuaciones del MAS en la resolución de ejercicios.",
            "CN.F.5.1.p.35. Aplicar las expresiones matemáticas de energía potencial elástica, energía cinética y energía mecánica total en el.",
            "MAS.CN.F.5.1.p.36. Describir qué es un péndulo y las características que definen su movimiento.",
            "CN.F.5.1.p.37. Analizar el papel de las oscilaciones amortiguadas en sistemas reales mediante simulaciones digitales o videos experimentales.",
            "CN.F.5.1.p.38. Hallar la frecuencia, amplitud y longitud de onda en ejercicios propuestos sobre movimientos ondulatorios.",
            "CN.F.5.1.p.39. Determinar la rapidez de ondas en cuerdas.",
            "CN.F.5.1.p.40. Diferenciar ondas transversales y longitudinales mediante la observación de modelos o simulaciones.",
          ],
          actitudinales: [
            "CN.F.5.1.a.18. Reconocer cómo la ley de Hooke se aplica en elementos de la vida cotidiana, mostrando curiosidad y motivación por conectar la teoría con la práctica, como en el uso de bandas elásticas en la rehabilitación física y el uso de resortes en sistemas mecánicos.",
            "CN.F.5.1.a.19. Reconocer la relevancia de los modelos de MAS y la ley de Hooke en el desarrollo de aplicaciones científicas y tecnológicas.",
            "CN.F.5.1.a.20. Realizar trabajos en equipo y al resolver problemas físicos sobre el.",
            "MAS.CN.F.5.1.a.21. Valorar la importancia de los sistemas de amortiguación en construcciones y edificaciones como medida de prevención y seguridad frente a fenómenos naturales.",
            "CN.F.5.1.a.22. Reconocer que los fenómenos de oscilaciones y ondas forman parte de la naturaleza y se manifiestan en procesos cotidianos, apreciando la importancia de su estudio para comprender y respetar el entorno.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.CN.F.5.7",
    descripcion: "Generar iniciativas para la gestión eficiente de los principios de la termodinámica en hogares y espacios públicos a partir del análisis de la transferencia de calor, los cambios de estado y el equilibrio térmico en sistemas físicos, para la toma de decisiones informadas frente al calentamiento global, desarrollando la cultura científica-digital que facilite acercar la ciencia a la sociedad",
    competenciasClave: ["CC", "CMCT", "CD", "CIT"],
    porGrado: [
      {
        nivel: "FÍSICA",
        grado: "SEGUNDO CURSO",
        indicadores: [
          { codigo: "I.CN.F.5.7.1", texto: "Analiza la temperatura como energía cinética promedio de sus partículas y experimenta la ley cero de la termodinámica (usando conceptos de calor especifico, cambio de estado, calor latente y temperatura de equilibrio), la transferencia de calor( por conducción, convección y radiación), el trabajo mecánico producido por la energía térmica de un sistema y las pérdidas de energía en forma de calor hacia el ambiente y disminución del orden, que tienen lugar durante los procesos de transformación de energía promoviendo la alfabetización científica-digital" },
          { codigo: "I.CN.F.5.7.2", texto: "Propone medidas y estrategias para gestionar de manera eficiente la transferencia de calor, los cambios de estado y el equilibrio térmico en hogares y espacios públicos, aplicando el pensamiento crítico, la resolución de problemas y la sostenibilidad, para tomar decisiones responsables frente al calentamiento global" },
        ],
        saberes: {
          declarativos: [
            "CN.F.5.2.d.5. Temperatura y equilibrio térmico.",
            "CN.F.5.2.d.6. Dilatación térmica.",
            "CN.F.5.2.d.7. Calor y energía interna.",
            "CN.F.5.2.d.8. Transferencia de calor: conducción, convección y radiación.",
            "CN.F.5.2.d.9. Calorimetría.",
            "CN.F.5.2.d.10. Cambios de estado.",
            "CN.F.5.2.d.11. Trabajo en procesos termodinámicos.",
            "CN.F.5.2.d.12. Leyes de la termodinámica.",
          ],
          procedimentales: [
            "CN.F.5.2.p.10. Relacionar escalas de temperatura (Celsius, Kelvin, Fahrenheit) mediante conversiones de unidades.",
            "CN.F.5.2.p.11. Observar el equilibrio térmico entre dos objetos a través de la ley cero de la termodinámica.",
            "CN.F.5.2.p.12. Determinar el coeficiente lineal, superficial y volumétrico a través de la aplicación de las ecuaciones de dilatación térmica.",
            "CN.F.5.2.p.13. Relacionar variaciones de temperatura con cambios de energía interna.",
            "CN.F.5.2.p.14. Experimentar y describir los tres mecanismos de transferencia de calor mediante experiencias prácticas.",
            "CN.F.5.2.p.15. Determinar el calor específico en distintas muestras a través del uso de simuladores interactivos o experiencias prácticas.",
            "CN.F.5.2.p.16. Interpretar la relación entre calor, temperatura y cambio de estado.",
            "CN.F.5.2.p.17. Aplicar la relación entre trabajo, calor y cambio de energía interna para analizar sistemas termodinámicos.",
            "CN.F.5.2.p.18. Explicar con ejemplos prácticos las leyes de la termodinámica.",
            "CN.F.5.2.p.19. Analizar el funcionamiento de un motor de combustión interna identificando las transformaciones de energía y los principios termodinámicos que intervienen en él.",
          ],
          actitudinales: [
            "CN.F.5.2.a.8. Valorar la importancia del equilibrio térmico en la seguridad, salud y procesos industriales.",
            "CN.F.5.2.a.9. Valorar la termodinámica como ciencia clave para comprender y optimizar procesos energéticos.",
            "CN.F.5.2.a.10. Promover la cultura científica en el estudio de trabajo, energía y procesos termodinámicos.",
            "CN.F.5.2.a.11. Proponer soluciones creativas para mejorar la eficiencia energética en el hogar o comunidad, aplicando principios termodinámicos.",
            "CN.F.5.2.a.12. Adoptar una actitud comprometida con la reducción del impacto ambiental derivado de procesos termodinámicos industriales y energéticos que contribuyen al calentamiento global.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.CN.F.5.8",
    descripcion: "Modelar fenómenos físicos relacionados con la aplicación de los principios de la electricidad a fin de explicar el funcionamiento de los sistemas eléctricos, prevenir riesgos y promover decisiones responsables y sostenibles en la vida diaria, en contextos cotidianos vinculados al uso responsable de la energía y la seguridad eléctrica (como el ahorro energético y el uso de implementos de bioseguridad)",
    competenciasClave: ["CC", "CMCT", "CD", "CIT", "CSE"],
    porGrado: [
      {
        nivel: "FÍSICA",
        grado: "TERCER CURSO",
        indicadores: [
          { codigo: "I.CN.F.5.8.1", texto: "Resuelve problemas y explica fenómenos relacionados con cargas y campos eléctricos, aplicando la ley de Coulomb para analizar fuerzas entre cargas, representar gráficamente la dirección y magnitud de los campos, y proponer medidas de prevención de riesgos y uso responsable de la energía eléctrica en contextos cotidianos" },
          { codigo: "I.CN.F.5.8.2", texto: "Resuelve problemas de aplicación de la electricidad, incluyendo cálculos de corriente eléctrica, voltaje, intensidad de corriente y resistencia, en circuitos sencillos (serie, paralelo y mixto) alimentados por baterías o fuentes de corriente continúa fomentando el razonamiento lógico matemático" },
        ],
        saberes: {
          declarativos: [
            "CN.F.5.2.d.13. Carga eléctrica.",
            "CN.F.5.2.d.14. Ley de Coulomb: características, principios, y ecuación.",
            "CN.F.5.2.d.15. Campo eléctrico y líneas de campo.",
            "CN.F.5.2.d.16. Potencial eléctrico y diferencia de potencial.",
            "CN.F.5.2.d.17. Componentes básicos de un circuito simple: fuente, resistor, conductor, interruptor.",
            "CN.F.5.2.d.18. Corriente eléctrica y resistencia en circuitos simples.",
            "CN.F.5.2.d.19. Ley de Ohm.",
            "CN.F.5.2.d.20. Circuitos en serie, paralelo y mixto.",
            "CN.F.5.2.d.21. Energía eléctrica, potencia y transformación de energía en circuitos simples.",
          ],
          procedimentales: [
            "CN.F.5.2.p.20. Describir fenómenos de electrización por frotamiento, contacto e inducción.",
            "CN.F.5.2.p.21. Analizar las interacciones eléctricas según el tipo de carga: positiva–positiva (repulsión), negativa–negativa (repulsión) y positiva–negativa (atracción).",
            "CN.F.5.2.p.22. Aplicar la ley de Coulomb para calcular la magnitud de la fuerza entre dos cargas puntuales.",
            "CN.F.5.2.p.23. Representar y analizar diagramas de campo eléctrico con sus líneas de fuerza alrededor de cargas aisladas y sistemas de cargas.",
            "CN.F.5.2.p.24. Analizar el potencial eléctrico y la diferencia de potencial entre dos puntos de un campo eléctrico.",
            "CN.F.5.2.p.25. Construir circuitos eléctricos simples con componentes físicos o mediante simulaciones y medir el voltaje, corriente y resistencia usando un multímetro.",
            "CN.F.5.2.p.26. Graficar e interpretar el diagrama voltaje en función de la intensidad de corriente para distintos resistores y comprobar la proporcionalidad (ley de Ohm).",
            "CN.F.5.2.p.27. Resolver problemas numéricos y prácticos para determinar el voltaje, la corriente o la resistencia en un circuito en en serie, paralelo y mixtos.",
            "CN.F.5.2.p.28. Calcular la potencia eléctrica en circuitos de corriente continua.",
            "CN.F.5.2.p.29. Determinar la energía eléctrica consumida por un dispositivo a partir de la potencia y el tiempo de funcionamiento.",
            "CN.F.5.2.p.30. Calcular el costo de funcionamiento de diferentes aparatos eléctricos, a partir de su potencia, el tiempo de uso diario y el valor del kilovatio-hora establecido por la empresa eléctrica de la localidad.",
            "CN.F.5.2.p.31. Comparar consumos y costos de distintos aparatos eléctricos para proponer estrategias de ahorro energético.",
          ],
          actitudinales: [
            "CN.F.5.2.a.18. Valorar las contribuciones históricas en el estudio de la energía eléctrica.",
            "CN.F.5.2.a.14. Desarrollar ingenio para visualizar conceptos abstractos como las líneas de campo eléctrico.",
            "CN.F.5.2.a.17. Impulsar el pensamiento crítico en el análisis e interpretación de resultados obtenidos experimentalmente.",
            "CN.F.5.2.a.13. Abordar la resolución de problemas, aplicando la ley de Ohm, de forma organizada y paso a paso.",
            "CN.F.5.2.a.15. Integrar en los procesos orden, disciplina y responsabilidad en el manejo de componentes eléctricos y en el uso de energía.",
            "CN.F.5.2.a.16. Cuestionar las observaciones de consumos y costos de la energía eléctrica para explicaciones lógicas de los fenómenos eléctricos.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.CN.F.5.9",
    descripcion: "Modelar fenómenos magnéticos y electromagnéticos mediante la representación de campos magnéticos, la interacción entre corriente eléctrica y campo magnético, y el principio de inducción electromagnética, para explicar el funcionamiento básico de imanes, motores, generadores y aplicaciones tecnológicas o médicas, valorando su uso seguro, responsable y pertinente en la vida cotidiana",
    competenciasClave: ["CC", "CMCT", "CD", "CIT"],
    porGrado: [
      {
        nivel: "FÍSICA",
        grado: "TERCER CURSO",
        indicadores: [
          { codigo: "I.CN.F.5.9.1", texto: "Explica la relación entre corriente eléctrica y campo magnético mediante experimentos o simulaciones, identificando la dirección del campo magnético generado por una corriente y su aplicación en electroimanes y motores eléctricos de uso cotidiano" },
          { codigo: "I.CN.F.5.9.2", texto: "Analiza el principio de inducción electromagnética de Faraday mediante la interpretación de cambios en el flujo magnético, para explicar el funcionamiento básico de generadores eléctricos y otras aplicaciones tecnológicas de uso cotidiano" },
        ],
        saberes: {
          declarativos: [
            "CN.F.5.2.d.22. Imanes y materiales ferromagnéticos.",
            "CN.F.5.2.d.23. Campo magnético.",
            "CN.F.5.2.d.24. Campo magnético de la Tierra.",
            "CN.F.5.2.d.25. Campo magnético producido por corriente eléctrica.",
            "CN.F.5.2.d.26. Regla de la mano derecha.",
            "CN.F.5.2.d.27. Ley de Ampere.",
            "CN.F.5.2.d.28. Fuerza magnética.",
            "CN.F.5.2.d.29. Movimiento de cargas en campo magnético.",
            "CN.F.5.2.d.30. Motor eléctrico.",
            "CN.F.5.2.d.31. Inducción magnética y flujo magnético.",
            "CN.F.5.2.d.32. Inducción electromagnética.",
            "CN.F.5.2.d.33. Ley de Faraday.",
            "CN.F.5.2.d.34. Generador eléctrico.",
          ],
          procedimentales: [
            "CN.F.5.2.p.32. Describir la interacción entre imanes y materiales ferromagnéticos, identificando atracción, repulsión y orientación de polos.",
            "CN.F.5.2.p.33. Representar las líneas de campo magnético mediante limaduras de hierro o simuladores digitales.",
            "CN.F.5.2.p.34. Interpretar la orientación de una brújula como evidencia del campo magnético terrestre y relacionarla con la representación de líneas de campo.",
            "CN.F.5.2.p.35. Representar la dirección del campo magnético generado por una corriente en un conductor recto, una espira y un solenoide, aplicando la regla de la mano derecha en diferentes contextos como electroimanes y motores eléctricos.",
            "CN.F.5.2.p.36. Calcular el campo magnético generado por un conductor recto aplicando la Ley de Ampere.",
            "CN.F.5.2.p.37. Analizar la dirección y el sentido de la fuerza magnética ejercida sobre una carga en movimiento o un conductor con corriente mediante la regla de la mano derecha.",
            "CN.F.5.2.p.38. Resolver ejercicios sobre la fuerza magnética ejercida sobre una carga en movimiento o un conductor con corriente.",
            "CN.F.5.2.p.39. Analizar el movimiento de una partícula cargada en un campo magnético aplicando la regla de la mano derecha.",
            "CN.F.5.2.p.40. Construir o simula un modelo sencillo de motor eléctrico, explicando el papel de la corriente, el campo magnético y la fuerza magnética en su funcionamiento.",
            "CN.F.5.2.p.41. Interpretar cambios en el flujo magnético al variar la intensidad del campo, el área de una espira o su orientación.",
            "CN.F.5.2.p.42. Interpretar simulaciones sobre la generación de corriente inducida al mover un imán cerca de una bobina o al variar el campo magnético.",
            "CN.F.5.2.p.43. Analizar cualitativamente la ley de Faraday a partir de experimentos o simulaciones con bobinas, imanes y galvanómetros.",
            "CN.F.5.2.p.44. Explicar el funcionamiento básico de un generador eléctrico a partir del movimiento relativo entre una espira o bobina y un campo magnético.",
          ],
          actitudinales: [
            "CN.F.5.2.a.19. Mostrar curiosidad, interés y disposición para explorar y comprender fenómenos magnéticos presentes en la naturaleza y la tecnología, valorando su importancia en el desarrollo científico y cotidiano.",
            "CN.F.5.2.a.20. Trabajar con responsabilidad, orden y respeto por las normas de seguridad durante las actividades experimentales con imanes, conductores y campos magnéticos, demostrando actitud preventiva y conciencia del riesgo eléctrico.",
            "CN.F.5.2.a.21. Participar activamente en proyectos colaborativos relacionados con la construcción de prototipos electromagnéticos, aportando ideas, escuchando a sus compañeros y fomentando el trabajo en equipo y la cooperación científica.",
            "CN.F.5.2.a.22. Asumir una actitud crítica y comprometida frente al uso de tecnologías magnéticas en medicina, transporte y dispositivos electrónicos, promoviendo prácticas responsables que prioricen el beneficio en la salud humana.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.CN.F.5.10",
    descripcion: "Interpretar las leyes de Kepler y la ley de gravitación universal de Newton para explicar el movimiento de los cuerpos celestes, reconociendo la importancia de las observaciones astronómicas en el avance de la ciencia y la tecnología, y comparando, mediante simuladores, el comportamiento orbital de la Luna y los satélites artificiales, con el fin de acercar la ciencia a la sociedad como un conocimiento comprensible, vinculado con la cultura científica",
    competenciasClave: ["CC", "CMCT", "CD", "CIT"],
    porGrado: [
      {
        nivel: "FÍSICA",
        grado: "TERCER CURSO",
        indicadores: [
          { codigo: "I.CN.F.5.10.1", texto: "Explica cómo las leyes de Kepler y la ley de gravitación universal de Newton permiten comprender el movimiento de los cuerpos celestes, relacionándolas con la importancia de las observaciones astronómicas en el desarrollo de la ciencia y la tecnología, promoviendo la cultura científica" },
          { codigo: "I.CN.F.5.10.2", texto: "Resuelve problemas de aplicación de las leyes de Kepler y de la ley de gravitación universal de Newton para explicar y comparar el movimiento de la Luna y los satélites artificiales en el campo gravitacional, utilizando simuladores y acercando este conocimiento a situaciones comprensibles y útiles para la sociedad" },
        ],
        saberes: {
          declarativos: [
            "CN.F.5.3.d.1. El sistema solar y las estrellas.",
            "CN.F.5.3.d.2. Principales teorías sobre el movimiento de los planetas: Teoría Geocéntrica, de los Epiciclos, Heliocéntrica y Teoría actual.",
            "CN.F.5.3.d.3. El papel histórico de las observaciones astronómicas en el desarrollo de las leyes de Kepler.",
            "CN.F.5.3.d.4. Las leyes de Kepler y el movimiento de los planetas.",
            "CN.F.5.3.d.5. La ley de la gravitación universal de Newton.",
            "CN.F.5.3.d.6. Campo gravitatorio.",
            "CN.F.5.3.d.7. Movimiento de satélites.",
            "CN.F.5.3.d.8. Energía potencial gravitacional.",
          ],
          procedimentales: [
            "CN.F.5.3.p.1. Describir las características físicas de los planetas, los satélites, los asteroides y el sol, como estrella principal.",
            "CN.F.5.3.p.2. Elaborar líneas de tiempo que muestren la evolución de las principales teorías sobre el movimiento de los planetas.",
            "CN.F.5.3.p.3. Explicar las tres leyes de Kepler sobre el movimiento planetario, mediante la indagación del trabajo investigativo de Tycho Brahe y el análisis de sus datos referentes al planeta Marte.",
            "CN.F.5.3.p.4. Resolver ejercicios aplicando las leyes de Kepler y de gravitación universal a planetas y satélites.",
            "CN.F.5.3.p.5. Argumentar cómo la ley de gravitación universal de Newton explica las órbitas elípticas de los planetas y el movimiento de los satélites.",
            "CN.F.5.3.p.6. Calcular la fuerza gravitacional entre dos cuerpos celestes.",
            "CN.F.5.3.p.7. Establecer semejanzas y diferencias entre el movimiento de la Luna y de los satélites artificiales alrededor de la Tierra, mediante el uso de simuladores.",
            "CN.F.5.3.p.8. Calcular energía potencial gravitacional en diferentes contextos (planetas, satélites).",
            "CN.F.5.3.p.9. Explicar cómo se distribuye la masa en cuerpos esféricos y su efecto en la gravedad.",
          ],
          actitudinales: [
            "CN.F.5.3.a.1. Promover una actitud proactiva durante el aprendizaje del movimiento de los cuerpos celestes y los misterios del cosmos.",
            "CN.F.5.3.a.2. Desarrollar actitud crítica para cuestionar modelos antiguos y aceptar cambios basados en evidencia.",
            "CN.F.5.3.a.5. Reconocer la importancia histórica de las diferentes teorías y respetar la evolución del conocimiento científico.",
            "CN.F.5.3.a.3. Apreciar cómo la observación sistemática y la formulación de leyes (de Kepler y de gravitación universal) son fundamentales para el avance del conocimiento científico.",
            "CN.F.5.3.a.4. Respetar el criterio del resto de compañeros y dar apertura a nuevas ideas sobre los fenómenos orbitales.",
            "CN.F.5.3.a.6. Reconocer la universalidad de las leyes físicas y su aplicabilidad tanto en la Tierra como en el espacio.",
          ],
        },
      },
    ],
  },
];

export function buscarCompetenciaCienciasNaturales(codigo: string): CompetenciaEspecificaCompleta | undefined {
  return COMPETENCIAS_CIENCIAS_NATURALES.find((c) => c.codigo === codigo);
}
