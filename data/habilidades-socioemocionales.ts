/**
 * Habilidades Socioemocionales Asociadas
 * Fuente: Formato oficial de planificación microcurricular 2026-2027
 * Ministerio de Educación del Ecuador
 */

export interface HabilidadSocioemocional {
  id: string;
  nombre: string;
  nameEN: string;
  emoji: string;
}

export const HABILIDADES_SOCIOEMOCIONALES: HabilidadSocioemocional[] = [
  { id: "conciencia_social", nombre: "Conciencia social", nameEN: "Social awareness", emoji: "\uD83E\uDD1D" },
  { id: "pensamiento_critico", nombre: "Pensamiento crítico", nameEN: "Critical thinking", emoji: "\uD83E\uDDE0" },
  { id: "pensamiento_etico", nombre: "Pensamiento ético", nameEN: "Ethical thinking", emoji: "\u2696\uFE0F" },
  { id: "manejo_problemas", nombre: "Manejo de problemas", nameEN: "Problem management", emoji: "\uD83D\uDCA1" },
  { id: "trabajo_colaborativo", nombre: "Trabajo colaborativo", nameEN: "Collaborative work", emoji: "\uD83D\uDC65" },
  { id: "comunicacion_asertiva", nombre: "Comunicación asertiva", nameEN: "Assertive communication", emoji: "\uD83D\uDDE3\uFE0F" },
  { id: "autoconocimiento", nombre: "Autoconocimiento", nameEN: "Self-awareness", emoji: "\uD83E\uDE9E" },
  { id: "autorregulacion", nombre: "Autorregulación", nameEN: "Self-regulation", emoji: "\uD83C\uDFAF" },
  { id: "empatia", nombre: "Empatía", nameEN: "Empathy", emoji: "\u2764\uFE0F" },
  { id: "resiliencia", nombre: "Resiliencia", nameEN: "Resilience", emoji: "\uD83D\uDCAA" },
  { id: "toma_decisiones", nombre: "Toma de decisiones responsable", nameEN: "Responsible decision-making", emoji: "\u2705" },
  { id: "perseverancia", nombre: "Perseverancia", nameEN: "Perseverance", emoji: "\uD83C\uDFC6" },
];
