import type MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

/**
 * Catálogo único de creación (spec `hub-de-creacion`, tasks 2.1 y 2.2).
 *
 * Lista tipada única que cubre los 12 flujos de creación. Es la fuente de
 * verdad de `/crear`: añadir un módulo nuevo = añadir una línea aquí, sin tocar
 * ni Inicio ni Mis planes (scenario "Módulo nuevo en una categoría").
 *
 * Los `ruta` apuntan a flujos EXISTENTES en su estado inicial; no se les
 * exigen parámetros nuevos (no-goals del cambio).
 */

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

export type Categoria = "aula" | "area" | "programaciones" | "curriculo" | "niveles" | "contextuales";

export interface Modulo {
  /** Clave técnica (para tests y habilitación contextual). */
  id: string;
  categoria: Categoria;
  modulo: string;
  /** Descripción corta en lenguaje de usuario. */
  resumen: string;
  /** Ruta de navegación hacia el flujo existente. */
  ruta: string;
  icono: IconName;
  /** true → necesita una planificación o semana de origen (design D4). */
  requiereContexto: boolean;
}

export const CATEGORIAS: { id: Categoria; label: string }[] = [
  { id: "aula", label: "Plan de aula" },
  { id: "area", label: "Plan de área" },
  { id: "programaciones", label: "Programaciones" },
  { id: "curriculo", label: "Currículo" },
  { id: "niveles", label: "Niveles educativos" },
  { id: "contextuales", label: "Contextuales" },
];

/**
 * El plan diario se construye a partir de una destreza elegida, así que su
 * entrada lleva al buscador de Inicio en lugar de a un formulario con parámetros.
 */
export const CATALOGO_MODULOS: Modulo[] = [
  {
    id: "diario",
    categoria: "aula",
    modulo: "Plan diario",
    resumen: "Planificación diaria de un área a partir de una destreza",
    ruta: "/",
    icono: "file-document-edit-outline",
    requiereContexto: false,
  },
  {
    id: "semanal",
    categoria: "aula",
    modulo: "Plan semanal",
    resumen: "Organiza los días de la semana y exporta a Word",
    ruta: "/planificar-semanal",
    icono: "calendar-week",
    requiereContexto: false,
  },
  {
    id: "pca",
    categoria: "area",
    modulo: "PCA Anual",
    resumen: "Planificación curricular anual del área",
    ruta: "/planificacion-anual",
    icono: "calendar-month",
    requiereContexto: false,
  },
  {
    id: "pct",
    categoria: "area",
    modulo: "PCT Trimestral",
    resumen: "Planificación curricular por trimestre",
    ruta: "/planificacion-trimestral",
    icono: "calendar-blank",
    requiereContexto: false,
  },
  {
    id: "cnc",
    categoria: "programaciones",
    modulo: "Conecta Nivela y Crea",
    resumen: "Plan de nivelación para estudiantes con brechas",
    ruta: "/conecta-nivela-crea",
    icono: "link-variant",
    requiereContexto: false,
  },
  {
    id: "proyecto",
    categoria: "programaciones",
    modulo: "Proyecto Interdisciplinar",
    resumen: "Proyecto con guía paso a paso",
    ruta: "/proyecto-interdisciplinar",
    icono: "lightbulb-on-outline",
    requiereContexto: false,
  },
  {
    id: "bt",
    categoria: "programaciones",
    modulo: "Bachillerato Técnico",
    resumen: "Planificación por perfil de egreso y figuras",
    ruta: "/bachillerato-tecnico",
    icono: "tools",
    requiereContexto: false,
  },
  {
    id: "cxc",
    categoria: "curriculo",
    modulo: "Currículo por Competencias",
    resumen: "Currículo por grado o para EGB/BGU",
    ruta: "/curriculo-competencias",
    icono: "book-open-page-variant",
    requiereContexto: false,
  },
  {
    id: "inicial",
    categoria: "niveles",
    modulo: "Inicial",
    resumen: "Planificación para Educación Inicial y Preprimaria",
    ruta: "/planificar-inicial",
    icono: "baby-face-outline",
    requiereContexto: false,
  },
  {
    id: "preparatoria",
    categoria: "niveles",
    modulo: "Preparatoria",
    resumen: "Planificación para Educación Preparatoria",
    ruta: "/planificar-preparatoria",
    icono: "school",
    requiereContexto: false,
  },
  {
    id: "adaptacion",
    categoria: "contextuales",
    modulo: "Adaptación curricular",
    resumen: "Adapta una planificación a necesidades específicas",
    ruta: "/adaptacion-curricular",
    icono: "account-edit-outline",
    requiereContexto: true,
  },
  {
    id: "diagnostico",
    categoria: "contextuales",
    modulo: "Evaluación diagnóstica",
    resumen: "Diagnóstico inicial por grado o asignatura",
    ruta: "/evaluacion-diagnostica",
    icono: "clipboard-check-outline",
    requiereContexto: false,
  },
];

/** Los 12 flujos, en el orden del catálogo. */
export const TOTAL_MODULOS = CATALOGO_MODULOS.length;
