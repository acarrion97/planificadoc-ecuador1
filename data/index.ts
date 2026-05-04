import { destrezasMatematica } from "./destrezas-matematica";
import { destrezasLengua } from "./destrezas-lengua";
import { destrezasCienciasNaturales } from "./destrezas-cn";
import { destrezasEstudiosSociales } from "./destrezas-cs";
import { destrezasEducacionFisica } from "./destrezas-ef";
import { destrezasECA } from "./destrezas-eca";
import { destrezasBiologia } from "./destrezas-biologia";
import { destrezasQuimica } from "./destrezas-quimica";
import { destrezasFisica } from "./destrezas-fisica";
import { destrezasHistoria } from "./destrezas-historia";
import { destrezasFilosofia } from "./destrezas-filosofia";
import { destrezasIngles } from "./destrezas-ingles";
import { destrezasEmprendimiento } from "./destrezas-emprendimiento";
import { Area, Destreza, Subnivel, AREAS_INFO, SUBNIVEL_NAMES } from "./types";

export * from "./types";
export { obtenerTemasSugeridos } from "./temas-sugeridos";
export { obtenerEstrategiasDUA, obtenerEstrategiasGeneralesDUA, generarTextoDUA, DUA_PRINCIPIOS, DUA_PRINCIPIOS_EN } from "./dua-estrategias";
export type { DUAPlanificacion } from "./dua-estrategias";
export { INSERCIONES_CURRICULARES, obtenerInsercion, obtenerNombreInsercion } from "./inserciones-curriculares";
export type { InsercionCurricular } from "./inserciones-curriculares";

export const TODAS_LAS_DESTREZAS: Destreza[] = [
  ...destrezasMatematica,
  ...destrezasLengua,
  ...destrezasCienciasNaturales,
  ...destrezasEstudiosSociales,
  ...destrezasEducacionFisica,
  ...destrezasECA,
  ...destrezasBiologia,
  ...destrezasQuimica,
  ...destrezasFisica,
  ...destrezasHistoria,
  ...destrezasFilosofia,
  ...destrezasIngles,
  ...destrezasEmprendimiento,
];

export function buscarPorCodigo(codigo: string): Destreza | undefined {
  const codigoNormalizado = codigo.trim().toUpperCase();
  return TODAS_LAS_DESTREZAS.find(
    (d) => d.codigo.toUpperCase() === codigoNormalizado
  );
}

export function buscarDestrezas(query: string): Destreza[] {
  const q = query.trim().toUpperCase();
  if (!q) return [];
  return TODAS_LAS_DESTREZAS.filter(
    (d) =>
      d.codigo.toUpperCase().includes(q) ||
      d.descripcion.toUpperCase().includes(q)
  );
}

export function filtrarPorArea(area: Area): Destreza[] {
  return TODAS_LAS_DESTREZAS.filter((d) => d.area === area);
}

export function filtrarPorAreaYSubnivel(
  area: Area,
  subnivel: Subnivel
): Destreza[] {
  return TODAS_LAS_DESTREZAS.filter(
    (d) => d.area === area && d.subnivel === subnivel
  );
}

export function filtrarPorAreaSubnivelBloque(
  area: Area,
  subnivel: Subnivel,
  bloque: number
): Destreza[] {
  return TODAS_LAS_DESTREZAS.filter(
    (d) => d.area === area && d.subnivel === subnivel && d.bloque === bloque
  );
}

export function obtenerSubnivelesDeArea(area: Area): Subnivel[] {
  const subniveles = new Set<Subnivel>();
  TODAS_LAS_DESTREZAS.filter((d) => d.area === area).forEach((d) =>
    subniveles.add(d.subnivel)
  );
  return Array.from(subniveles).sort();
}

export function obtenerBloquesDeAreaSubnivel(
  area: Area,
  subnivel: Subnivel
): number[] {
  const bloques = new Set<number>();
  TODAS_LAS_DESTREZAS.filter(
    (d) => d.area === area && d.subnivel === subnivel
  ).forEach((d) => bloques.add(d.bloque));
  return Array.from(bloques).sort();
}

export function contarDestrezasPorArea(): Record<Area, number> {
  const counts = {} as Record<Area, number>;
  for (const area of Object.keys(AREAS_INFO) as Area[]) {
    counts[area] = TODAS_LAS_DESTREZAS.filter((d) => d.area === area).length;
  }
  return counts;
}

export function obtenerNombreBloque(area: Area, bloque: number): string {
  return AREAS_INFO[area]?.bloques[bloque] ?? `Bloque ${bloque}`;
}

export function obtenerNombreSubnivel(subnivel: Subnivel): string {
  return SUBNIVEL_NAMES[subnivel] ?? `Subnivel ${subnivel}`;
}
