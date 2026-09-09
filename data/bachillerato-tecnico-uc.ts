/**
 * Catálogo de Unidades de Competencia (UC → EC → CD) para Bachillerato Técnico.
 *
 * Solo la figura AFDR (Actividad Física, Deporte y Recreación, id "actividad-fisica")
 * tiene contenido real aquí, transcrito directamente de los documentos oficiales:
 *   - perfil-profesional-afdr.pdf
 *   - D-P-E Sesiones Deportivas y Recreativas.docx
 *
 * Para las demás figuras este archivo no fabrica contenido: se completan desde
 * la app (ver CatalogoUsuarioBT en data/types-bt.ts y lib/planificaciones-bt-context.tsx),
 * nunca generadas por IA sin respaldo humano.
 */
import type { UnidadCompetencia, ModuloUnidadCompetencia } from "./types-bt";

export const UNIDADES_COMPETENCIA_BT: UnidadCompetencia[] = [
  // === AFDR — Módulo "Sesiones deportivas y recreativas" (especialización) ===
  {
    id: "AFDR-UC1",
    texto:
      "UC1: Organizar y asistir en la ejecución de actividades físicas, juegos recreativos y deportes de base, siguiendo las secuencias técnicas y protocolos de seguridad establecidos en el perfil de la FIP.",
    elementosCompetencia: [
      {
        id: "AFDR-EC1",
        texto:
          "EC1: Preparar el escenario y los recursos materiales necesarios para la sesión, asegurando que cumplan con los estándares de seguridad y se ajusten a las características de los participantes.",
        criteriosDesempeno: [
          { id: "AFDR-CD1.1", texto: "CD1.1: Clasifica y selecciona los implementos deportivos según el tipo de sesión recreativa o lúdica planificada." },
          { id: "AFDR-CD1.2", texto: "CD1.2: Verifica el estado de las instalaciones y materiales aplicando protocolos de seguridad para prevenir riesgos." },
          { id: "AFDR-CD1.3", texto: "CD1.3: Organiza el espacio físico de manera funcional, permitiendo un flujo de movimiento seguro para el grupo." },
          { id: "AFDR-CD1.4", texto: "CD1.4: Identifica las necesidades del grupo según su edad y habilidades para adecuar los recursos." },
        ],
      },
      {
        id: "AFDR-EC2",
        texto:
          "EC2: Ejecutar los segmentos de la sesión física bajo supervisión, manteniendo la estructura técnica y fomentando un clima de respeto e inclusión entre los integrantes.",
        criteriosDesempeno: [
          { id: "AFDR-CD2.1a", texto: "CD2.1: Dirige la fase de calentamiento aplicando ejercicios de activación muscular y movilidad articular." },
          { id: "AFDR-CD2.2a", texto: "CD2.2: Supervisa que los participantes sigan las normas de seguridad e higiene durante el desarrollo de la actividad." },
          { id: "AFDR-CD2.3a", texto: "CD2.3: Implementa dinámicas de grupo que motiven la participación activa y la convivencia armónica." },
          { id: "AFDR-CD2.4a", texto: "CD2.4: Ejecuta las técnicas de vuelta a la calma para asegurar la recuperación física adecuada de los participantes." },
        ],
      },
    ],
  },
  {
    id: "AFDR-UC2",
    texto:
      "UC2: Dirigir actividades físicas, juegos y deportes de base, empleando técnicas de enseñanza y métodos de adaptación para garantizar la participación efectiva y el desarrollo motriz de los usuarios.",
    elementosCompetencia: [
      {
        id: "AFDR-EC1b",
        texto:
          "EC1: Dirigir el desarrollo de la sesión deportiva aplicando fundamentos técnicos y tácticos básicos, adaptando las actividades a las capacidades motrices y necesidades específicas del grupo.",
        criteriosDesempeno: [
          { id: "AFDR-CD1.1b", texto: "CD1.1: Ejecuta demostraciones técnicas de fundamentos deportivos (pases, lanzamientos, desplazamientos) con precisión para el aprendizaje del grupo." },
          { id: "AFDR-CD1.2b", texto: "CD1.2: Ajusta la dificultad de las tareas motrices considerando la edad, el género y el nivel de condición física de los integrantes." },
          { id: "AFDR-CD1.3b", texto: "CD1.3: Emplea estrategias de liderazgo que fortalecen la cohesión del equipo y la resolución pacífica de conflictos durante el juego." },
        ],
      },
      {
        id: "AFDR-EC2b",
        texto:
          "EC2: Evaluar el desempeño y la participación de los usuarios durante la sesión física, utilizando instrumentos de registro para el seguimiento del desarrollo integral.",
        criteriosDesempeno: [
          { id: "AFDR-CD2.1b", texto: "CD2.1: Aplica test físicos y recreativos básicos para medir el avance en las capacidades de los participantes." },
          { id: "AFDR-CD2.2b", texto: "CD2.2: Elabora informes técnicos sencillos que resumen las novedades y logros alcanzados en la jornada deportiva." },
          { id: "AFDR-CD2.3b", texto: "CD2.3: Retroalimenta a los participantes sobre su desempeño técnico y actitudinal de manera constructiva y motivadora." },
        ],
      },
    ],
  },
  // === AFDR — Módulo "Seguridad, higiene y primeros auxilios deportivos" (especialización) ===
  {
    id: "AFDR-UC4",
    texto:
      "UC4: Aplicar medidas preventivas, de seguridad, higiene y primeros auxilios en actividades físicas, deportivas y recreativas, garantizando el bienestar y la respuesta efectiva ante situaciones de emergencia.",
    condicionesEjecucion: {
      espaciosInstalaciones: "Canchas, aulas, áreas recreativas, consultorios escolares.",
      insumosRecursos: "Botiquín básico, manuales de primeros auxilios, implementos de higiene.",
      informacionUtilizada: "Manuales de seguridad deportiva, protocolos de la Cruz Roja y Ministerio de Salud.",
    },
    elementosCompetencia: [
      // Nota: el documento fuente (perfil-profesional-afdr.pdf) también define un EC1 previo
      // a este UC, pero su texto y criterios de desempeño no quedaron legibles en el extracto
      // disponible — se omite en vez de fabricarlo. Solo EC2 y EC3, con texto completo, se incluyen.
      {
        id: "AFDR-EC2c",
        texto: "EC2: Implementar normas de higiene, bioseguridad y mantenimiento en los espacios deportivos.",
        criteriosDesempeno: [
          { id: "AFDR-CD2.1c", texto: "CD2.1: Inspecciona los espacios deportivos identificando riesgos de higiene, bioseguridad o mantenimiento y registrando observaciones." },
          { id: "AFDR-CD2.2c", texto: "CD2.2: Aplica protocolos de bioseguridad según la normativa vigente antes y después del uso del espacio." },
          { id: "AFDR-CD2.3c", texto: "CD2.3: Elabora informes de evaluación de los espacios deportivos, indicando el estado de limpieza, seguridad y mantenimiento, e incluyendo recomendaciones para su mejora." },
        ],
      },
      {
        id: "AFDR-EC3c",
        texto: "EC3: Brindar primeros auxilios básicos a los participantes para restablecer su bienestar y seguridad durante situaciones de emergencia.",
        criteriosDesempeno: [
          { id: "AFDR-CD3.2c", texto: "CD3.2: Aplica procedimientos básicos de atención y primeros auxilios según protocolos establecidos, priorizando la seguridad del participante y del entorno." },
          { id: "AFDR-CD3.3c", texto: "CD3.3: Deriva oportunamente a servicios de salud registrando la acción conforme a los protocolos establecidos cuando la condición del participante supere la atención básica." },
        ],
      },
    ],
  },
];

export const MODULO_UNIDAD_COMPETENCIA_BT: ModuloUnidadCompetencia[] = [
  { moduloId: "AF.2.2", unidadCompetenciaId: "AFDR-UC1" }, // Sesiones deportivas y recreativas
  { moduloId: "AF.2.2", unidadCompetenciaId: "AFDR-UC2" },
  { moduloId: "AF.2.4", unidadCompetenciaId: "AFDR-UC4" }, // Seguridad, higiene y primeros auxilios deportivos
];

export function obtenerUnidadesCompetenciaDeModulo(moduloId: string): UnidadCompetencia[] {
  const ids = MODULO_UNIDAD_COMPETENCIA_BT.filter((r) => r.moduloId === moduloId).map((r) => r.unidadCompetenciaId);
  return UNIDADES_COMPETENCIA_BT.filter((uc) => ids.includes(uc.id));
}
