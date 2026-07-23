/**
 * Ejes transversales seleccionables en la Planificación Curricular Anual (PCA).
 * Fuente: Acuerdo MINEDUC-2024-00060-A y currículos oficiales Ecuador 2025-2026.
 */

export interface EjeTransversalPCA {
  id: string;
  nombre: string;
  descripcion: string;
  emoji: string;
}

export const EJES_TRANSVERSALES_PCA: EjeTransversalPCA[] = [
  {
    id: "desarrollo_sostenible",
    nombre: "Desarrollo Sostenible",
    descripcion: "Promueve el uso responsable de los recursos naturales y la conciencia ambiental para garantizar la sostenibilidad del planeta.",
    emoji: "🌱",
  },
  {
    id: "educacion_financiera",
    nombre: "Educación Financiera",
    descripcion: "Desarrolla competencias para la gestión responsable de las finanzas personales, el ahorro y la toma de decisiones económicas informadas.",
    emoji: "💰",
  },
  {
    id: "socioemocional",
    nombre: "Socioemocional",
    descripcion: "Fortalece el autoconocimiento, la empatía, la regulación emocional y las habilidades para la convivencia armónica.",
    emoji: "💚",
  },
  {
    id: "seguridad_vial",
    nombre: "Seguridad Vial",
    descripcion: "Promueve comportamientos seguros en el tránsito y la vía pública, fomentando la responsabilidad como peatones y usuarios de transporte.",
    emoji: "🚦",
  },
  {
    id: "civica_etica",
    nombre: "Cívica, Ética e Integridad",
    descripcion: "Fortalece la formación en valores éticos y morales, la participación democrática, la lucha contra la corrupción y el ejercicio responsable de derechos y deberes ciudadanos.",
    emoji: "⚖️",
  },

];
