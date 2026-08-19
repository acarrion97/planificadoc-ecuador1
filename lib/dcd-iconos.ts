/**
 * Helpers compartidos para incrustar los íconos DCD (competencias/inserciones
 * curriculares) asociados a un código de destreza, en las exportaciones Word y PDF.
 */
import { ImageRun, TextRun } from "docx";
import { obtenerIconosDestreza } from "../src/data/iconosPorDestreza";
import { ICONOS_DCD_BASE64 } from "./iconos-base64";

/**
 * Runs (imagen + texto) con los íconos (competencias/inserciones) de un código DCD
 * para documentos Word (.docx) vía ImageRun.
 */
export function iconosDcdRuns(
  codigo: string | undefined | null,
  size = 16,
): (TextRun | ImageRun)[] {
  if (!codigo) return [];
  const iconos = obtenerIconosDestreza(codigo);
  const runs: (TextRun | ImageRun)[] = [];
  for (const nombre of iconos) {
    const data = ICONOS_DCD_BASE64[nombre];
    if (!data) continue;
    runs.push(new ImageRun({
      data,
      transformation: { width: size, height: size },
    }));
    runs.push(new TextRun({ text: " ", size: 18 }));
  }
  return runs;
}

/** HTML `<img>` de los íconos (competencias/inserciones) asociados a una DCD. */
export function iconosDestrezaHTML(codigo: string | undefined | null, size = 14): string {
  if (!codigo) return "";
  const iconos = obtenerIconosDestreza(codigo);
  if (iconos.length === 0) return "";
  const imgs = iconos
    .map((n) => ICONOS_DCD_BASE64[n])
    .filter(Boolean)
    .map((src) => `<img src="${src}" style="width:${size}px;height:${size}px;border-radius:50%;margin-right:2px;vertical-align:middle;" />`)
    .join("");
  return `<div style="margin-top:2px;">${imgs}</div>`;
}