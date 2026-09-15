/**
 * Catálogo de Competencias Específicas — Currículo Integrado
 * Fuente: MESOCURRICULUM / "8. Emprendimiento y Gestión.xlsx" (Matriz de distribución/desagregación
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

export const COMPETENCIAS_EMPRENDIMIENTO: CompetenciaEspecificaCompleta[] = [
  {
    codigo: "CE.M.EG.5.1",
    descripcion: "Gestionar críticamente la práctica contable básica de una organización a través del análisis de la sostenibilidad de sus operaciones mediante casos de estudio reales o modelados, proyectos integradores, debates argumentativos o talleres colaborativos, considerando el impacto social y ambiental de las decisiones contables mientras se desarrolla como agente económico, autónomo y solidario comprometido con el desarrollo social",
    competenciasClave: ["CMCT", "CC", "CD", "CIT", "CCICC", "CSE"],
    porGrado: [
      {
        nivel: "BACHILLERATO",
        grado: "PRIMER AÑO BGU",
        indicadores: [
          { codigo: "I.M.EG.5.1.1", texto: "Explica con ejemplos reales de emprendimientos la importancia del capital de trabajo, identificando el cumplimiento de normas contables en entornos familiares, empresariales o estatales" },
          { codigo: "I.M.EG.5.1.2", texto: "Presenta con exactitud los cálculos y el orden lógico del ciclo contable al registrar transacciones en un caso práctico" },
          { codigo: "I.M.EG.5.1.3", texto: "Interpreta la sostenibilidad de un emprendimiento a partir de los resultados de la construcción de los estados financieros (Balance General, Estado de Resultados y Flujo de Efectivo)" },
        ],
        saberes: {
          declarativos: [
            "M.EG.5.1.d.1. La contabilidad y su utilidad en la vida cotidiana.",
            "M.EG.5.1.d.2. Ingresos y egresos en ejercicios simples.",
            "M.EG.5.1.d.3. Elementos de la ecuación contable: activo y pasivo.",
            "M.EG.5.1.d.4. Registro de transacciones económicas (ventas y compras).",
            "M.EG.5.1.d.5. Balance de resultados.",
          ],
          procedimentales: [
            "M.EG.5.1.p.1. Analizar la utilidad de la contabilidad en entornos familiares y pequeños emprendimientos.",
            "M.EG.5.1.p.2. Clasificar los conceptos contables en transacciones económicas.",
            "M.EG.5.1.p.3. Registrar transacciones aplicando la ecuación contable y la partida doble.",
            "M.EG.5.1.p.4. Revisar registros contables identificando posibles errores.",
            "M.EG.5.1.p.5. Presentar información financiera e identificar datos relevantes en los estados financieros.",
          ],
          actitudinales: [
            "M.EG.5.1.a.1. Reconocer la importancia de la transparencia en el registro de la información contable.",
            "M.EG.5.1.a.2. Aplicar con responsabilidad los conceptos contables en situaciones económicas.",
            "M.EG.5.1.a.3. Mantener orden y cuidado en el registro de transacciones económicas básicas.",
            "M.EG.5.1.a.4. Verificar la información económica demostrando atención y compromiso.",
            "M.EG.5.1.a.5. Reconocer la importancia de los resultados financieros para la toma de decisiones responsables.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "SEGUNDO AÑO BGU",
        indicadores: [
          { codigo: "I.M.EG.5.1.1", texto: "Explica con ejemplos reales de emprendimientos la importancia del capital de trabajo, identificando el cumplimiento de normas contables en entornos familiares, empresariales o estatales" },
          { codigo: "I.M.EG.5.1.2", texto: "Presenta con exactitud los cálculos y el orden lógico del ciclo contable al registrar transacciones en un caso práctico" },
          { codigo: "I.M.EG.5.1.3", texto: "Interpreta la sostenibilidad de un emprendimiento a partir de los resultados de la construcción de los estados financieros (Balance General, Estado de Resultados y Flujo de Efectivo)" },
        ],
        saberes: {
          declarativos: [
            "M.EG.5.1.d.1. Importancia de la contabilidad, normas aplicadas a registros simples.",
            "M.EG.5.1.d.3. ) Etapas del proceso contable y la importancia del registro de transacciones.",
            "M.EG.5.1.d.5. Estructura y utilidad del Balance General, Estado de Resultados y flujo de efectivo para evaluar organizaciones.",
          ],
          procedimentales: [
            "M.EG.5.1.p.1. Analizar la aplicación de la contabilidad y el cumplimiento de normas.",
            "M.EG.5.1.p.2. Diferenciar transacciones económicas identificando su impacto en el capital de trabajo y sostenibilidad financiera.",
            "M.EG.5.1.p.3. Registrar asientos contables aplicando correctamente el principio de partida doble y verificando la igualdad entre débitos y créditos.",
            "M.EG.5.1.p.4. Analizar y modificar asientos contables de cierre verificando la validez de los resultados obtenidos.",
            "M.EG.5.1.p.5. Interpretar estados financieros para evaluar la sostenibilidad económica de un emprendimiento.",
          ],
          actitudinales: [
            "M.EG.5.1.a.1. Asumir una actitud ética y responsable frente a la transparencia de la información contable.",
            "M.EG.5.1.a.2. Aplicar criterios de conciencia financiera en la toma de decisiones de carácter económico.",
            "M.EG.5.1.a.3. Demostrar rigurosidad y sistematicidad en el registro de las transacciones económicas.",
            "M.EG.5.1.a.4. Verificar y validar información económica con perseverancia, compromiso y sentido crítico.",
            "M.EG.5.1.a.5. Valorar críticamente los resultados financieros considerando sus implicaciones sociales y ambientales.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "TERCER AÑO BGU",
        indicadores: [
          { codigo: "I.M.EG.5.1.1", texto: "Explica con ejemplos reales de emprendimientos la importancia del capital de trabajo, identificando el cumplimiento de normas contables en entornos familiares, empresariales o estatales" },
          { codigo: "I.M.EG.5.1.2", texto: "Presenta con exactitud los cálculos y el orden lógico del ciclo contable al registrar transacciones en un caso práctico" },
          { codigo: "I.M.EG.5.1.3", texto: "Interpreta la sostenibilidad de un emprendimiento a partir de los resultados de la construcción de los estados financieros (Balance General, Estado de Resultados y Flujo de Efectivo)" },
        ],
        saberes: {
          declarativos: [
            "M.EG.5.1.d.1. La Contabilidad: importancia, conceptos, objetivos y normas.",
            "M.EG.5.1.d.2. Conceptos contables: ingresos, egresos, gastos, costos de inversión y capital de trabajo.",
            "M.EG.5.1.d.3. Ecuación contable: activo pasivo patrimonio y partida doble.",
            "M.EG.5.1.d.4. Proceso contable: registro de transacciones.",
            "M.EG.5.1.d.5. Estados financieros, Balance General, Estado de Resultados y flujo de efectivo.",
          ],
          procedimentales: [
            "M.EG.5.1.p.1. Analizar la importancia y el uso de la contabilidad en entornos familiares, empresariales o estatales.",
            "M.EG.5.1.p.2. Reconocer en transacciones económicas los conceptos contables, precautelando el capital de trabajo.",
            "M.EG.5.1.p.3. Registrar asientos contables bajo el principio de partida doble, comprobando que los débitos y créditos cuadren.",
            "M.EG.5.1.p.4. Analizar y reparar asientos contables de cierre verificando sus resultados.",
            "M.EG.5.1.p.5. Presentar e interpretar los resultados de los estados financieros.",
          ],
          actitudinales: [
            "M.EG.5.1.a.1. Reconocer con responsabilidad la influencia de los asientos contables en la transparencia de una organización.",
            "M.EG.5.1.a.2. Aplicar con conciencia financiera los conceptos contables en diferentes entornos.",
            "M.EG.5.1.a.3. Respetar el orden y la sistematicidad del registro fiel de las transacciones económicas.",
            "M.EG.5.1.a.4. Verificar con paciencia a verificar la información económica.",
            "M.EG.5.1.a.5. Valorar con sentido crítico y responsabilidad social los resultados de los estados financieros.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.M.EG.5.2",
    descripcion: "Diseñar formas organizacionales y el talento humano según el contexto y tipo de emprendimiento, la asunción de un carácter emprendedor que promueva el cumplimiento de los requisitos legales y sociales previos al inicio de actividades, a partir del análisis de estudios de casos reales apoyados en tecnologías digitales que fortalezcan la identidad empresarial nacional y el respeto por la diversidad cultural y social del entorno promoviendo prácticas sostenibles y socialmente responsables",
    competenciasClave: ["CC", "CD", "CIT", "CCICC", "CSE"],
    porGrado: [
      {
        nivel: "BACHILLERATO",
        grado: "PRIMER AÑO BGU",
        indicadores: [
          { codigo: "I.M.EG.5.2.1", texto: "Aplica los requisitos legales básicos para la creación de un emprendimiento asumiendo un carácter emprendedor, clasificando los tipos de negocios y simulando el proceso de registro ante el SRI, IESS y Superintendencia de Compañías aplicándolos en la simulaciones o casos reales" },
          { codigo: "I.M.EG.5.2.2", texto: "Elabora una propuesta de planificación organizacional y recursos humanos (selección, contratación, inducción, capacitación, compensaciones y beneficios) precautelando un buen clima organizacional en el emprendimiento" },
          { codigo: "I.M.EG.5.2.3", texto: "Propone acciones empresariales que promuevan el derecho laboral y los principios de economía circular popular y solidaria fortaleciendo la cultura local en casos prácticos" },
        ],
        saberes: {
          declarativos: [
            "M.EG.5.2.d.1. Emprendimiento y requisitos básicos.",
            "M.EG.5.2.d.2. Organización básica y roles.",
            "M.EG.5.2.d.3. Trabajo en equipo y roles.",
            "M.EG.5.2.d.4. Valores y ética en el emprendimiento.",
            "M.EG.5.2.d.5. Liderazgo y trabajo en equipo.",
          ],
          procedimentales: [
            "M.EG.5.2.p.1. Identificar en casos prácticos las características de los emprendedores y los requisitos legales para la creación de un emprendimiento.",
            "M.EG.5.2.p.2. Construír estructuras organizacionales y relacionar funciones elementales según las necesidades de un emprendimiento.",
            "M.EG.5.2.p.3. Aplicar procedimientos de selección, contratación e inducción en situaciones simuladas de gestión de talento humano.",
            "M.EG.5.2.p.4. Aplicar prácticas de reutililzación, reducción y reciclaje en propuestas de emprendimientos.",
            "M.EG.5.2.p.5. Reconocer y ejecutar de manera guiada procesos de registro y formalización empresarial mediante herramientas digitales.",
          ],
          actitudinales: [
            "M.EG.5.2.a.1. Reconocer la importancia del liderazgo emprendedor y del cumplimiento de las normas legales para el ejercicio responsable de la ciudadanía.",
            "M.EG.5.2.a.2. Demostrar disposición en la colaboración y distribución equitativa de tareas en actividades grupales.",
            "M.EG.5.2.a.3. Valorar el respeto y el bienestar de las personas como elementos fundamentales para la convivencia laboral.",
            "M.EG.5.2.a.4. Manifestar interés por actuar con responsabilidad social y ética en situaciones vinculadas al emprendimiento.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "SEGUNDO AÑO BGU",
        indicadores: [
          { codigo: "I.M.EG.5.2.1", texto: "Aplica los requisitos legales básicos para la creación de un emprendimiento asumiendo un carácter emprendedor, clasificando los tipos de negocios y simulando el proceso de registro ante el SRI, IESS y Superintendencia de Compañías aplicándolos en la simulaciones o casos reales" },
          { codigo: "I.M.EG.5.2.2", texto: "Elabora una propuesta de planificación organizacional y recursos humanos (selección, contratación, inducción, capacitación, compensaciones y beneficios) precautelando un buen clima organizacional en el emprendimiento" },
          { codigo: "I.M.EG.5.2.3", texto: "Propone acciones empresariales que promuevan el derecho laboral y los principios de economía circular popular y solidaria fortaleciendo la cultura local en casos prácticos" },
        ],
        saberes: {
          declarativos: [
            "M.EG.5.2.d.1. Tipos de emprendimientos y requisitos legales.",
            "M.EG.5.2.d.2. Desarrollo de organigramas y procesos de contratación.",
            "M.EG.5.2.d.3. Procesos de selección, capacitación y beneficios.",
            "M.EG.5.2.d.4. Prácticas laborales éticas y responsabilidad social.",
            "M.EG.5.2.d.5. Cultura organizacional y liderazgo aplicado.",
          ],
          procedimentales: [
            "M.EG.5.2.p.1. Analizar casos de emprendimientos formales e informales para determinar los procedimientos legales para su funcionamiento.",
            "M.EG.5.2.p.2. Diseñar estructuras organizacionales y distribuír funciones de acuerdo con las características y necesidades de un emprendimiento.",
            "M.EG.5.2.p.3. Instrumentar propuestas de gestión de talento humano que integren selección, contratación, capacitación, compensaciones y estrategias de mejora del clima laboral.",
            "M.EG.5.2.p.4. Proponer acciones de economía circular que fortalezcan la sostenibilidad y responsabilidad social del emprendimiento.",
            "M.EG.5.2.p.5. Simular procesos de registro y formalización empresarial utilizando herramientas digitales e institucionales de manera autónoma.",
          ],
          actitudinales: [
            "M.EG.5.2.a.1. Asumir comportamientos de liderazgo emprendedor sustentados en la legalidad, la responsabilidad y el compromiso ciudadano.",
            "M.EG.5.2.a.2. Promover la distribución equitativa de funciones y la corresponsabilidad para fortalecer el compromiso laboral y organizacional.",
            "M.EG.5.2.a.3. Valorar el desarrollo humano como factor estratégico para la construcción de ambientes laborales productivos.",
            "M.EG.5.2.a.4. Tomar decisiones con conciencia ética, social y ambiental en la gestión de emprendimientos sostenibles.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "TERCER AÑO BGU",
        indicadores: [
          { codigo: "I.M.EG.5.2.1", texto: "Aplica los requisitos legales básicos para la creación de un emprendimiento asumiendo un carácter emprendedor, clasificando los tipos de negocios y simulando el proceso de registro ante el SRI, IESS y Superintendencia de Compañías aplicándolos en la simulaciones o casos reales" },
          { codigo: "I.M.EG.5.2.2", texto: "Elabora una propuesta de planificación organizacional y recursos humanos (selección, contratación, inducción, capacitación, compensaciones y beneficios) precautelando un buen clima organizacional en el emprendimiento" },
          { codigo: "I.M.EG.5.2.3", texto: "Propone acciones empresariales que promuevan el derecho laboral y los principios de economía circular popular y solidaria fortaleciendo la cultura local en casos prácticos" },
        ],
        saberes: {
          declarativos: [
            "M.EG.5.2.d.1. El emprendedor y el emprendimiento: requisitos legales para iniciar un negocio, tipos de emprendimientos, afiliaciones (SRI, IESS y Superintendencia de Compañías).",
            "M.EG.5.2.d.2. Principios de administración: organigrama estructural, necesidades de personal: selección, contratación e inducción.",
            "M.EG.5.2.d.3. Fundamentos de gestión de TT.HH.: contratación, selección, capacitación, compensaciones y beneficios, relaciones y clima laborales.",
            "M.EG.5.2.d.4. Responsabilidad Social y Sostenibilidad: derechos laborales, prácticas laborales éticas y economía circular.",
            "M.EG.5.2.d.5. Cultura organizacional, liderazgo y clima laboral.",
          ],
          procedimentales: [
            "M.EG.5.2.p.1. Analizar casos reales de emprendedores y los protocolos legales para aperturar diferentes tipos de emprendimientos formales e informales.",
            "M.EG.5.2.p.2. Diseñar estructuras organizacionales y distribuir funciones de acuerdo con las necesidades del emprendimiento.",
            "M.EG.5.2.p.3. Instrumentar necesidades de contratación, selección, capacitación, compensación, beneficios o mejoras en el clima laboral del emprendimiento.",
            "M.EG.5.2.p.4. Proponer la aplicación de economías circulares (reutilización, reciclaje, reducción) en el emprendimiento con esquemas básicos.",
            "M.EG.5.2.p.5. Simular procesos de registro y formalización empresarial mediante herramientas digitales e institucionales.",
          ],
          actitudinales: [
            "M.EG.5.2.a.1. Desarrollar elementos del liderazgo emprendedor y compromiso con la ley en la formación de una sociedad con conciencia ciudadana.",
            "M.EG.5.2.a.2. Fomentar equidad al distribuir las funciones al personal generando compromiso en los nuevos trabajadores.",
            "M.EG.5.2.a.3. Valorar el desarrollo humano como factor base para mantener un buen clima laboral.",
            "M.EG.5.2.a.4. Motivar a que los emprendedores tomen decisiones con conciencia ética y social.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.M.EG.5.3",
    descripcion: "Interpretar las necesidades humanas y sociales a partir del análisis de diversos enfoques y esquemas para el diseño de productos y servicios dirigidos a nichos de mercado específicos, mediante la aplicación ética y responsable de técnicas e instrumentos de investigación de mercados, la ejecución, análisis y presentación de los resultados de investigaciones de campo en un plan de negocio, fortaleciendo la capacidad crítica, creativa y colaborativa en diversos contextos sociales y productivos",
    competenciasClave: ["CMCT", "CC", "CD", "CIT", "CCICC", "CSE"],
    porGrado: [
      {
        nivel: "BACHILLERATO",
        grado: "PRIMER AÑO BGU",
        indicadores: [
          { codigo: "I.M.EG.5.3.1", texto: "Elabora esquemas con propuestas creativas para satisfacer las necesidades de grupos de personas demostrando pensamiento crítico" },
          { codigo: "I.M.EG.5.3.2", texto: "Analiza mercados reconociendo segmentos y nichos específicos, con criterios como edad, género, ubicación, intereses o nivel socioeconómico" },
          { codigo: "I.M.EG.5.3.3", texto: "Presenta resultados del trabajo de campo en informes claros, estructurados y con conclusiones relevantes para la toma de decisiones" },
          { codigo: "I.M.EG.5.3.4", texto: "Expone un plan de negocios estructurado aplicando herramientas de análisis de negocios para sustentar decisiones económicas viables que generen valor social" },
        ],
        saberes: {
          declarativos: [
            "M.EG.5.3.d.1. Necesidades humanas y sociales: pirámide de Maslow.",
            "M.EG.5.3.d.2. Bienes y servicios.",
            "M.EG.5.3.d.3. Encuestas y observación.",
          ],
          procedimentales: [
            "M.EG.5.3.p.1. Identificar necesidades de los diferentes grupos sociales mediante la observación y el análisis de situaciones del entorno.",
            "M.EG.5.3.p.2. Proponer productos o servicios a partir de necesidades identificadas en segmentos de mercado específicos.",
            "M.EG.5.3.p.3. Aplicar técnicas e instrumentos para recolectar y organizar información en tablas y gráficos.",
          ],
          actitudinales: [
            "M.EG.5.3.a.1. Reconocer la importancia de contribuir a la satisfacción de necesidades humanas y sociales con responsabilidad.",
            "M.EG.5.3.a.2. Respetar la diversidad de personas y grupos al analizar necesidades y preferencias de consumo.",
            "M.EG.5.3.a.3. Valorar el uso responsable de la tecnología y la importancia de la honestidad en la recolección de información.",
            "M.EG.5.3.a.4. Demostrar interés por el emprendimiento como medio para generar beneficios sociales en la comunidad.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "SEGUNDO AÑO BGU",
        indicadores: [
          { codigo: "I.M.EG.5.3.1", texto: "Elabora esquemas con propuestas creativas para satisfacer las necesidades de grupos de personas demostrando pensamiento crítico" },
          { codigo: "I.M.EG.5.3.2", texto: "Analiza mercados reconociendo segmentos y nichos específicos, con criterios como edad, género, ubicación, intereses o nivel socioeconómico" },
          { codigo: "I.M.EG.5.3.3", texto: "Presenta resultados del trabajo de campo en informes claros, estructurados y con conclusiones relevantes para la toma de decisiones" },
          { codigo: "I.M.EG.5.3.4", texto: "Expone un plan de negocios estructurado aplicando herramientas de análisis de negocios para sustentar decisiones económicas viables que generen valor social" },
        ],
        saberes: {
          declarativos: [
            "M.EG.5.3.d.1. Productos y servicios, análisis de necesidades de mercado.",
            "M.EG.5.3.d.2. Segmentación de mercado y características del producto/servicio.",
            "M.EG.5.3.d.3. Técnicas de investigación y análisis de resultados.",
            "M.EG.5.3.d.4. Estructura de planes de negocio y herramientas básicas.",
          ],
          procedimentales: [
            "M.EG.5.3.p.1. Analizar necesidades humanas y sociales para establecer oportunidades de emprendimiento en contextos específicos.",
            "M.EG.5.3.p.2. Diseñar propuestas de productos o servicios adaptadas a nichos de mercado específicos mediante criterios de segmentación.",
            "M.EG.5.3.p.3. Ejecutar procesos de investigación de mercados, analizar información obtenida e identificar tendencias y oportunidades de negocio.",
            "M.EG.5.3.p.4. Elaborar planes de negocio integrando diagnóstico del entorno, propuesta de valor, evaluación financiera y sostenibilidad mediante herramientas tecnológicas.",
          ],
          actitudinales: [
            "M.EG.5.3.a.1. Contribuir con propuestas emprendedoras orientadas a la solución de necesidades sociales desde una perspectiva ética y solidaria.",
            "M.EG.5.3.a.2. Promover el respeto, la inclusión y el análisis crítico de las tendencias de consumo y su impacto social.",
            "M.EG.5.3.a.3. Asumir comportamientos éticos en la recolección, análisis y manejo de datos, respetando la privacidad y confidencialidad de la información.",
            "M.EG.5.3.a.4. Evidenciar compromiso ético y responsabilidad social en el diseño de planes de negocio y proyectos emprendedores.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "TERCER AÑO BGU",
        indicadores: [
          { codigo: "I.M.EG.5.3.1", texto: "Elabora esquemas con propuestas creativas para satisfacer las necesidades de grupos de personas demostrando pensamiento crítico" },
          { codigo: "I.M.EG.5.3.2", texto: "Analiza mercados reconociendo segmentos y nichos específicos, con criterios como edad, género, ubicación, intereses o nivel socioeconómico" },
          { codigo: "I.M.EG.5.3.3", texto: "Presenta resultados del trabajo de campo en informes claros, estructurados y con conclusiones relevantes para la toma de decisiones" },
          { codigo: "I.M.EG.5.3.4", texto: "Expone un plan de negocios estructurado aplicando herramientas de análisis de negocios para sustentar decisiones económicas viables que generen valor social" },
        ],
        saberes: {
          declarativos: [
            "M.EG.5.3.d.1. Necesidades humanas y sociales: enfoques y esquemas diversos.",
            "M.EG.5.3.d.2. Productos – servicios y su nicho de mercado específico.",
            "M.EG.5.3.d.3. Investigación de mercados: técnicas, instrumentos , ejecución, análisis y presentación de resultados.",
            "M.EG.5.3.d.4. Planes de negocio: estructura, herramientas de análisis financiero, importancia para la toma de decisiones.",
          ],
          procedimentales: [
            "M.EG.5.3.p.1. Utilizar la teoría al contexto real para esquematizar las necesidades de diferentes grupos de personas.",
            "M.EG.5.3.p.2. Diseñar propuestas de productos o servicios adaptados a nichos de mercado específicos (edad, género, ubicación, intereses o nivel socioeconómico).",
            "M.EG.5.3.p.3. Ejecutar procesos de levantamiento de información en contextos simulados o reales, organizando los datos en tablas y gráficos e identifica tendencias y oportunidades de mercado.",
            "M.EG.5.3.p.4. Elaborar planes de negocio simulando decisiones y sus impactos en la rentabilidad y sostenibilidad, incluyendo diagnóstico del entorno, propuesta de valor, evaluación financiera, con herramientas tecnológicas.",
          ],
          actitudinales: [
            "M.EG.5.3.a.1. Contribuir a solucionar necesidades de alimentación, seguridad, inclusión, etc…con conciencia social.",
            "M.EG.5.3.a.2. Promover respeto e inclusión a diversos nichos de mercado manteniendo actitud crítica y reflexiva a tendencias del consumo y su impacto en la sociedad.",
            "M.EG.5.3.a.3. Valorar la tecnología y asume con ética la recolección y manejo de datos, demostrando objetividad con la información y respetando la privacidad de los entrevistados.",
            "M.EG.5.3.a.4. Evidenciar iniciativas emprendedora de responsabilidad social y compromiso ético en el diseño del plan de negocios y la gestión de proyectos.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.M.EG.5.4",
    descripcion: "Construir planes de mercadeo (producto, precio, plaza, promoción) que conlleven al emprendimiento a una práctica comercial ética aplicable a cualquier relación económica de una población específica, a través de los principios de microeconomía (familias, empresas y Estado) y la interpretación del comportamiento del consumidor (motivaciones, percepciones y hábitos) frente a los cambios en la oferta, demanda, empleo e inflación en simulaciones o casos reales",
    competenciasClave: ["CMCT", "CC", "CD", "CIT", "CCICC", "CSE", "CECA"],
    porGrado: [
      {
        nivel: "BACHILLERATO",
        grado: "PRIMER AÑO BGU",
        indicadores: [
          { codigo: "I.M.EG.5.4.1", texto: "Simula escenarios empresariales (familiares, empresariales y estatales) frente a cambios en oferta, demanda, precios, empleo, inflación, tasas de interés activo y pasivo, empleo, desempleo e inflación, interpretando el comportamiento del consumidor (motivaciones, percepciones y hábitos) y valorando el impacto social y medioambiental de las decisiones económicas que adopta" },
          { codigo: "I.M.EG.5.4.2", texto: "Presenta un plan de mercadeo para emprendimientos simulados o reales, privados o comunitarios, que motiva la compra del consumidor mediante una mezcla de mercado (producto, precio, plaza y promoción) ética, alineada al consumo responsable y el bienestar individual y colectivo" },
        ],
        saberes: {
          declarativos: [
            "M.EG.5.4.d.1. Economía básica y agentes económicos.",
            "M.EG.5.4.d.2. Economía nacional.",
            "M.EG.5.4.d.3. Mercado y publicidad.",
          ],
          procedimentales: [
            "M.EG.5.4.p.1. Analizar dinámicas entre familias, empresas y Estado frente a cambios en la oferta, demanda y precios.",
            "M.EG.5.4.p.2. Planificar estrategias de producto y precio para productos o servicios orientados a un público específico.",
          ],
          actitudinales: [
            "M.EG.5.4.a.1. Analizar críticamente los efectos de las variaciones económicas en los grupos sociales desde el consumo responsable.",
            "M.EG.5.4.a.2. Valorar el uso responsable de la información económica para la toma de decisiones de consumo y ahorro.",
            "M.EG.5.4.a.3. Promover prácticas de consumo éticas evitando conductas discriminatorias o manipuladoras.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "SEGUNDO AÑO BGU",
        indicadores: [
          { codigo: "I.M.EG.5.4.1", texto: "Simula escenarios empresariales (familiares, empresariales y estatales) frente a cambios en oferta, demanda, precios, empleo, inflación, tasas de interés activo y pasivo, empleo, desempleo e inflación, interpretando el comportamiento del consumidor (motivaciones, percepciones y hábitos) y valorando el impacto social y medioambiental de las decisiones económicas que adopta" },
          { codigo: "I.M.EG.5.4.2", texto: "Presenta un plan de mercadeo para emprendimientos simulados o reales, privados o comunitarios, que motiva la compra del consumidor mediante una mezcla de mercado (producto, precio, plaza y promoción) ética, alineada al consumo responsable y el bienestar individual y colectivo" },
        ],
        saberes: {
          declarativos: [
            "M.EG.5.4.d.1. Oferta, demanda y formación de precios con ejemplos aplicados.",
            "M.EG.5.4.d.2. Desarrollo aaplicado de indicadores en relación con costos y financiamiento.",
            "M.EG.5.4.d.3. Segmentación de mercado y técnicas de publicidad.",
          ],
          procedimentales: [
            "M.EG.5.4.p.1. Simular dinámicas relacionadas con empleo, desempleo, inflación, tasas de interés y políticas públicas.",
            "M.EG.5.4.p.2. Planificar estrategias de plaza y promoción para productos o servicios orientados a un público específico.",
          ],
          actitudinales: [
            "M.EG.5.4.a.1. Valorar el impacto social y ambiental de las decisiones económicas y comerciales.",
            "M.EG.5.4.a.2. Promover decisiones de compra responsables mediante estrategias de mercadeo éticas.",
            "M.EG.5.4.a.3. Fomentar la toma de decisiones informadas de consumo, ahorro e inversión mediante el análisis de indicadores económicos.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "TERCER AÑO BGU",
        indicadores: [
          { codigo: "I.M.EG.5.4.1", texto: "Simula escenarios empresariales (familiares, empresariales y estatales) frente a cambios en oferta, demanda, precios, empleo, inflación, tasas de interés activo y pasivo, empleo, desempleo e inflación, interpretando el comportamiento del consumidor (motivaciones, percepciones y hábitos) y valorando el impacto social y medioambiental de las decisiones económicas que adopta. M.EG.5.4.2. Promueve decisiones de compra en segmentos específicos de la población manejando estrategias de mercadeo que eviten prácticas de manipulación, discriminación o consumismo excesivo. Promover decisiones de compra en segmentos específicos de la población manejando estrategias de mercadeo que eviten prácticas de manipulación, discriminación o consumismo excesivo" },
        ],
        saberes: {
          declarativos: [
            "M.EG.5.4.d.1. Microeconomía: familias, empresas y Estado, oferta, demanda y formación de precios.",
            "M.EG.5.4.d.2. Indicadores económicos básicos: empleo, desempleo, inflación y tasas de interés activas y pasivas.",
            "M.EG.5.4.d.3. Estrategias de mercadeo y comportamiento del consumidor.",
          ],
          procedimentales: [
            "M.EG.5.4.p.1. Analizar y simular dinámicas entre familias, empresas y Estado frente a cambios en la oferta, demanda, precios, empleo, desempleo, inflación y tasas de interés y políticas públicas.",
            "M.EG.5.4.p.2. Planificar el mercadeo (producto, precio, plaza y promoción) para productos o servicios adaptados a un público específico.",
          ],
          actitudinales: [
            "M.EG.5.4.a.1. Analizar críticamente los efectos de las variaciones económicas en los grupos sociales desde el consumo e inversión responsable.",
            "M.EG.5.4.a.2. Promover decisiones de compra en segmentos específicos de la población manejando estrategias de mercadeo que eviten prácticas de manipulación, discriminación o consumismo excesivo.",
            "M.EG.5.4.a.3. Valorar el análisis responsable de indicadores económicos para la toma de decisiones de consumo, ahorro e inversión.",
          ],
        },
      },
    ],
  },
  {
    codigo: "CE.M.EG.5.5",
    descripcion: "Evaluar de manera financiera la sostenibilidad del negocio en escenarios empresariales reales o simulados mediante la modificación de variables como recursos (tierra, trabajo, capital y tecnología), cuentas (ventas, costos y gastos), tiempos y cantidades de producción, en sus estados financieros proyectados (Balance General, Estado de Resultados y Flujo de Efectivo) y punto de equilibrio, reconociendo el margen de contribución y valorando el resultado de sus indicadores de rentabilidad (VAN, TIR y Payback), considerando el impacto social y ambiental de las decisiones mientras se desarrolla como agente económico, autónomo y solidario comprometido con el progreso económico y social del entorno",
    competenciasClave: ["CMCT", "CC", "CD", "CIT", "CCICC", "CSE"],
    porGrado: [
      {
        nivel: "BACHILLERATO",
        grado: "PRIMER AÑO BGU",
        indicadores: [
          { codigo: "I.M.EG.5.5.1", texto: "Plantea escenarios combinando recursos de producción (tierra = agricultura local, trabajo = mano de obra en la comunidad, capital = maquinaria, tecnología = uso de TICs en empresas) para proponer de manera concreta soluciones empresariales privadas o comunitarias" },
          { codigo: "I.M.EG.5.5.2", texto: "Construye estados financieros proyectados (Balance General, Estado de Resultados y Flujo de Efectivo) simulando variaciones (con sustento científico) en las cuentas de ventas, costos y gastos, aplicando soluciones concretas" },
          { codigo: "I.M.EG.5.5.3", texto: "Resuelve el punto de equilibrio (cantidad y valor) y el margen de contribución de un proceso de producción en casos reales o simulados y según los resultados de rentabilidad que obtiene, toma decisiones que no comprometan la calidad y seguridad laboral del negocio" },
          { codigo: "I.M.EG.5.5.4", texto: "Presenta la evaluación financiera de escenarios con tiempos, costos e ingresos diversos en casos reales o simulados, tomando como base los resultados de los indicadores financieros (VAN, TIR y Payback)" },
        ],
        saberes: {
          declarativos: [
            "M.EG.5.5.d.1. Factores de producción y recursos productivos.",
            "M.EG.5.5.d.2. Contabilidad básica, registro de operaciones.",
            "M.EG.5.5.d.3. Costos y gastos de operación.",
            "M.EG.5.5.d.4. Introducción a proyectos de inversión.",
          ],
          procedimentales: [
            "M.EG.5.5.p.1. Identificar ejemplos simples de uso de tierra, trabajo y capital en actividades cotidianas.",
            "M.EG.5.5.p.2. Registrar operaciones simples en un Balance y Estados de Resultados.",
            "M.EG.5.5.p.3. Calcular costos fijos y variables en ejercicios básicos.",
            "M.EG.5.5.p.4. Identificar cómo cambios de tiempo o costos afectan un resultado.",
          ],
          actitudinales: [
            "M.EG.5.5.a.1. Valorar la equidad y la justicia en el uso de recursos.",
            "M.EG.5.5.a.2. Asumir responsabilidad frente al impacto de las decisiones financieras en trabajadores, inversionistas y comunidad.",
            "M.EG.5.5.a.3. Reconocer la importancia de trabajar con datos correctos para garantizar la viabilidad de un negocio.",
            "M.EG.5.5.a.4. Valorar el impacto social y ambiental de los negocios.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "SEGUNDO AÑO BGU",
        indicadores: [
          { codigo: "I.M.EG.5.5.1", texto: "Plantea escenarios combinando recursos de producción (tierra = agricultura local, trabajo = mano de obra en la comunidad, capital = maquinaria, tecnología = uso de TICs en empresas) para proponer de manera concreta soluciones empresariales privadas o comunitarias" },
          { codigo: "I.M.EG.5.5.2", texto: "Construye estados financieros proyectados (Balance General, Estado de Resultados y Flujo de Efectivo) simulando variaciones (con sustento científico) en las cuentas de ventas, costos y gastos, aplicando soluciones concretas" },
          { codigo: "I.M.EG.5.5.3", texto: "Resuelve el punto de equilibrio (cantidad y valor) y el margen de contribución de un proceso de producción en casos reales o simulados y según los resultados de rentabilidad que obtiene, toma decisiones que no comprometan la calidad y seguridad laboral del negocio" },
          { codigo: "I.M.EG.5.5.4", texto: "Presenta la evaluación financiera de escenarios con tiempos, costos e ingresos diversos en casos reales o simulados, tomando como base los resultados de los indicadores financieros (VAN, TIR y Payback)" },
        ],
        saberes: {
          declarativos: [
            "M.EG.5.5.d.1. El producto y su costo, costos fijos y variables.",
            "M.EG.5.5.d.2. Estados financieros básicos: Balance General y Estado de Resultados.",
            "M.EG.5.5.d.3. Determinación del costo del producti y gastos de operación.",
            "M.EG.5.5.d.4. Métodos básicos de evaluación.",
          ],
          procedimentales: [
            "M.EG.5.5.p.1. Diseñar escenarios productivos con combinación de recursos y costos básicos.",
            "M.EG.5.5.p.2. Elaborar estados financieros proyectados con variaciones en ventas y costos.",
            "M.EG.5.5.p.3. Determinar cantidad de equilibrio en casos simulados con margen de contribución.",
            "M.EG.5.5.p.4. Presentar escenarios con variaciones en ingresos y gastos para evaluar decisiones.",
          ],
          actitudinales: [
            "M.EG.5.5.a.1. Combinar conscientemente los factores de producción en favor del progreso social.",
            "M.EG.5.5.a.2. Simular variaciones en cuentas (ventas, costos y gastos) con criterio responsable.",
            "M.EG.5.5.a.3. Tomar decisiones de producción con responsabilidad y precisión.",
            "M.EG.5.5.a.4. Evaluar financieramente los negocios considerando su efecto en la comunidad y el medioambiente.",
          ],
        },
      },
      {
        nivel: "BACHILLERATO",
        grado: "TERCER AÑO BGU",
        indicadores: [
          { codigo: "I.M.EG.5.5.1", texto: "Plantea escenarios combinando recursos de producción (tierra = agricultura local, trabajo = mano de obra en la comunidad, capital = maquinaria, tecnología = uso de TICs en empresas) para proponer de manera concreta soluciones empresariales privadas o comunitarias" },
          { codigo: "I.M.EG.5.5.2", texto: "Construye estados financieros proyectados (Balance General, Estado de Resultados y Flujo de Efectivo) simulando variaciones (con sustento científico) en las cuentas de ventas, costos y gastos, aplicando soluciones concretas" },
          { codigo: "I.M.EG.5.5.3", texto: "Resuelve el punto de equilibrio (cantidad y valor) y el margen de contribución de un proceso de producción en casos reales o simulados y según los resultados de rentabilidad que obtiene, toma decisiones que no comprometan la calidad y seguridad laboral del negocio" },
          { codigo: "I.M.EG.5.5.4", texto: "Presenta la evaluación financiera de escenarios con tiempos, costos e ingresos diversos en casos reales o simulados, tomando como base los resultados de los indicadores financieros (VAN, TIR y Payback)" },
        ],
        saberes: {
          declarativos: [
            "M.EG.5.5.d.1. Recursos para la producción: tierra, trabajo, capital y tecnología. Estados financieros: Flujo de fondos proyectado y Flujo anual.",
            "M.EG.5.5.d.3. Punto de equilibrio: costos de operación y mantenimiento, margen de contribución y costos marginales.",
            "M.EG.5.5.d.4. Evaluación del proyecto de inversión: indicadores de rentabilidad (valor del dinero en el tiempo (VAN), Tasa Interna de Retorno (TIR) y Periodo de recuperación (Payback).",
          ],
          procedimentales: [
            "M.EG.5.5.p.1. Plantear escenarios que combinen recursos de producción (tierra, trabajo, capital y tecnología) que otorguen soluciones concretas.",
            "M.EG.5.5.p.2. Elaborar Balance General proyectado, Estado de Resultados proyectado y Flujo de Efectivo proyectado simulando variaciones en las cuentas (ventas, costos y gastos) aplicando posibles decisiones.",
            "M.EG.5.5.p.3. Determinar el valor y cantidad de equilibrio en casos de producción reales o simulados de manera que, junto al margen de contribución se decida la rentabilidad del negocio.",
            "M.EG.5.5.p.4. Presentar escenarios con modificaciones en las variables (tiempo, costos, ingresos) que fortalezcan la toma de decisiones a partir de la evaluación financiera de sus indicadores.",
          ],
          actitudinales: [
            "M.EG.5.5.a.1. Combinar los recursos de manera equilibrada y justa, usando conscientemente los factores de producción en favor del progreso social.",
            "M.EG.5.5.a.2. Simular variaciones en las cuentas (ventas, costos y gastos) con responsabilidad, entendiendo que las decisiones financieras impactan a trabajadores, inversionistas y comunidad.",
            "M.EG.5.5.a.3. Tomar decisiones de producción con responsabilidad y precisión asumiendo la importancia de trabajar con datos correctos para no afectar la viabilidad de un negocio.",
            "M.EG.5.5.a.4. Evaluar financieramente los negocios valorando además su impacto en la comunidad y el medioambiente.",
          ],
        },
      },
    ],
  },
];

export function buscarCompetenciaEmprendimiento(codigo: string): CompetenciaEspecificaCompleta | undefined {
  return COMPETENCIAS_EMPRENDIMIENTO.find((c) => c.codigo === codigo);
}
