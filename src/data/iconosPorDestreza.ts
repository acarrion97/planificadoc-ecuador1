import iconosPorDestrezaData from "./iconosPorDestreza.json";

const iconosPorDestreza: Record<string, string[]> = iconosPorDestrezaData;

/**
 * Nombres de archivo (sin extensión) disponibles en assets/iconos/.
 * Todos los archivos actuales usan extensión .png.
 */
const EXTENSIONES_ICONOS: Record<string, string> = {
  competencias_comunicacionales: "png",
  competencias_digitales: "png",
  competencias_matematicas: "png",
  competencias_socioemocionales: "png",
  insercion_civica_etica_integridad: "png",
  insercion_desarrollo_sostenible: "png",
  insercion_educacion_financiera: "png",
  insercion_educacion_socioemocional: "png",
  insercion_educacion_vial: "png",
  insercion_seguridad_integral: "png",
};

/** Devuelve los nombres de los íconos (competencias/inserciones) asociados a una DCD. */
export function obtenerIconosDestreza(codigo: string): string[] {
  const clave = codigo.trim().toUpperCase().replace(/\s+/g, "");
  return iconosPorDestreza[clave] ?? [];
}

/** Devuelve la ruta pública del ícono, respetando su extensión real. */
export function obtenerRutaIcono(nombreIcono: string): string {
  const ext = EXTENSIONES_ICONOS[nombreIcono] ?? "png";
  return `/assets/iconos/${nombreIcono}.${ext}`;
}

export default iconosPorDestreza;
