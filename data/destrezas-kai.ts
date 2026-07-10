import { Destreza } from "./types";

// KAI — Acompañamiento Integral en el Aula (Cívica)
// Período transversal obligatorio en todos los subniveles — MinEduc Ecuador 2026
// Evaluación: CUALITATIVA con escala A (Muy Satisfactorio) / B (Satisfactorio) / C (Poco Satisfactorio)

export const destrezasKAI: Destreza[] = [
  // ── Educación Inicial (subnivel 0 — grupos de 3 y 4 años) ────────────────
  {
    codigo: "KAI.1.1",
    area: "KAI",
    subnivel: 0,
    bloque: 1,
    secuencial: 1,
    descripcion: "Identificar y practicar normas básicas de convivencia, respeto mutuo y cuidado de los objetos personales y comunes en el entorno familiar y escolar.",
    objetivos: [
      "Fomentar la convivencia armónica y el cuidado del entorno desde los primeros años escolares.",
    ],
    criteriosEvaluacion: [
      "Demuestra normas básicas de convivencia, respeto mutuo y cuidado de los objetos en el entorno familiar y escolar.",
    ],
    indicadoresEvaluacion: [
      "Practica reglas de convivencia y cuida los objetos del aula y del hogar. (Evaluación cualitativa: A / B / C)",
    ],
  },

  // ── Preparatoria — 1.° EGB (subnivel 1) ─────────────────────────────────
  {
    codigo: "KAI.1.2",
    area: "KAI",
    subnivel: 1,
    bloque: 1,
    secuencial: 2,
    descripcion: "Reconocer la importancia de los símbolos patrios, las responsabilidades individuales dentro del aula y las expresiones de la diversidad cultural del entorno inmediato.",
    objetivos: [
      "Desarrollar el sentido de pertenencia e identidad nacional desde la primera escolarización formal.",
    ],
    criteriosEvaluacion: [
      "Identifica los símbolos patrios y asume responsabilidades dentro del aula valorando la diversidad cultural.",
    ],
    indicadoresEvaluacion: [
      "Reconoce y valora los símbolos patrios y las expresiones culturales de su entorno, y asume sus responsabilidades en el aula. (Evaluación cualitativa: A / B / C)",
    ],
  },

  // ── Básica Elemental — 2.°, 3.° y 4.° EGB (subnivel 2) ──────────────────
  {
    codigo: "KAI.2.1",
    area: "KAI",
    subnivel: 2,
    bloque: 1,
    secuencial: 1,
    descripcion: "Identificar los derechos y deberes fundamentales del niño en el contexto escolar y familiar, fomentando el sentido de pertenencia y honestidad académica.",
    objetivos: [
      "Construir el reconocimiento del 'yo' en la comunidad escolar a través del ciclo ERCA.",
    ],
    criteriosEvaluacion: [
      "Reconoce los derechos y deberes propios en el entorno escolar y familiar, demostrando sentido de pertenencia y honestidad académica.",
    ],
    indicadoresEvaluacion: [
      "Identifica sus derechos y deberes, los relaciona entre sí y los practica con honestidad en el entorno escolar y familiar. (Evaluación cualitativa: A / B / C)",
    ],
  },

  // ── Básica Media — 5.°, 6.° y 7.° EGB (subnivel 3) ─────────────────────
  {
    codigo: "KAI.3.2",
    area: "KAI",
    subnivel: 3,
    bloque: 1,
    secuencial: 2,
    descripcion: "Aplicar estrategias de comunicación asertiva y resolución pacífica de conflictos en el aula, valorando la inclusión y la equidad social.",
    objetivos: [
      "Desarrollar la empatía y el pensamiento ético mediante el análisis de dilemas morales y debates sencillos.",
    ],
    criteriosEvaluacion: [
      "Aplica estrategias de comunicación asertiva y resuelve conflictos de forma pacífica promoviendo la inclusión y la equidad.",
    ],
    indicadoresEvaluacion: [
      "Utiliza la comunicación asertiva y la mediación pacífica ante situaciones de conflicto en el aula, diferenciando entre agresividad, pasividad y asertividad. (Evaluación cualitativa: A / B / C)",
    ],
  },

  // ── Básica Superior — 8.°, 9.° y 10.° EGB (subnivel 4) ─────────────────
  {
    codigo: "KAI.4.2",
    area: "KAI",
    subnivel: 4,
    bloque: 1,
    secuencial: 2,
    descripcion: "Analizar los principios democráticos vigentes, el valor de la integridad pública y el impacto de la participación juvenil en el entorno comunitario.",
    objetivos: [
      "Fortalecer la conciencia democrática y el ejercicio activo de los derechos constitucionales mediante el Aprendizaje Basado en Problemas.",
    ],
    criteriosEvaluacion: [
      "Comprende y aplica los principios democráticos y de integridad pública, participando activamente en el entorno comunitario.",
    ],
    indicadoresEvaluacion: [
      "Analiza principios democráticos, identifica el valor de la integridad pública y propone acciones de participación juvenil comunitaria. (Evaluación cualitativa: A / B / C)",
    ],
  },

  // ── Bachillerato General Unificado — 1.°, 2.° y 3.° BGU (subnivel 5) ───
  {
    codigo: "KAI.5.1",
    area: "KAI",
    subnivel: 5,
    bloque: 1,
    secuencial: 1,
    descripcion: "Evaluar críticamente situaciones éticas de la vida cotidiana y social, fundamentando sus decisiones en los derechos humanos, la Constitución y el desarrollo sostenible.",
    objetivos: [
      "Desarrollar el proyecto de vida, la ética ciudadana rigurosa y la cultura de legalidad en el marco de la Participación Política Estudiantil (PPE).",
    ],
    criteriosEvaluacion: [
      "Evalúa con juicio crítico situaciones éticas fundamentadas en los derechos humanos, la Constitución ecuatoriana y el desarrollo sostenible.",
    ],
    indicadoresEvaluacion: [
      "Fundamenta decisiones éticas en los derechos humanos, la Constitución y principios de desarrollo sostenible, y las defiende ante situaciones de la vida cotidiana. (Evaluación cualitativa: A / B / C)",
    ],
  },
];
