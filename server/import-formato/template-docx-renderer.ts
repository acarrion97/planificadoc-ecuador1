import JSZip from "jszip";
import { XMLParser, XMLBuilder } from "fast-xml-parser";
import {
  PlantillaBindings,
  FieldBinding,
  RepeatRegion,
  DocxCellLocation,
} from "./types";

const parser = new XMLParser({
  ignoreAttributes: false,
  preserveOrder: true,
  trimValues: false,
});

const builder = new XMLBuilder({
  ignoreAttributes: false,
  preserveOrder: true,
  format: false,
});

type XmlNode = Record<string, any>;

// ─── Funciones XML ──────────────────────────────────────────────────────────

function buscarNodos(arbol: XmlNode[], tag: string): XmlNode[] {
  const encontrados: XmlNode[] = [];
  const recorrer = (nodos: XmlNode[]) => {
    for (const nodo of nodos) {
      const key = Object.keys(nodo).find((k) => k !== ":@");
      if (!key) continue;
      if (key === tag) encontrados.push(nodo);
      if (Array.isArray(nodo[key])) recorrer(nodo[key]);
    }
  };
  recorrer(arbol);
  return encontrados;
}

function textoDeNodo(nodo: XmlNode[]): string {
  let out = "";
  for (const hijo of nodo) {
    const tag = Object.keys(hijo).find((k) => k !== ":@");
    if (!tag) continue;
    if (tag === "w:t") {
      const valor = hijo[tag];
      out += Array.isArray(valor)
        ? valor.map((v) => v["#text"] ?? "").join("")
        : (hijo["#text"] ?? "");
    } else if (tag === "w:tab") {
      out += "\t";
    } else if (tag === "w:br" || tag === "w:cr") {
      out += "\n";
    } else if (Array.isArray(hijo[tag])) {
      out += textoDeNodo(hijo[tag]);
    }
  }
  return out;
}

/**
 * Reemplaza el texto de un nodo w:tc (celda) preservando los estilos.
 * Busca recursivamente todos los w:t dentro de la celda y reemplaza su contenido.
 * Si la celda está vacía, crea la estructura w:p → w:r → w:t.
 */
function reemplazarTextoEnCelda(celda: XmlNode, nuevoTexto: string): void {
  const key = Object.keys(celda).find((k) => k !== ":@");
  if (!key || key !== "w:tc") return;

  // Buscar todos los w:t recursivamente en la celda
  const textos = buscarNodos(celda[key] ?? [], "w:t");

  if (textos.length === 0) {
    // Celda vacía: crear estructura w:p → w:r → w:t
    const contenido = celda[key];
    if (!Array.isArray(contenido)) return;

    // Buscar un w:r existente para clonar estilo, o crear uno genérico
    const runs = buscarNodos(contenido, "w:r");
    let nuevoRun: XmlNode;
    if (runs.length > 0) {
      // Clonar el primer w:r preservando sus atributos/estilo
      nuevoRun = JSON.parse(JSON.stringify(runs[0]));
      // Reemplazar su w:t
      const tNodes = buscarNodos([nuevoRun], "w:t");
      for (const t of tNodes) {
        const tKey = Object.keys(t).find((k) => k !== ":@");
        if (tKey === "w:t") {
          if (Array.isArray(t["w:t"])) {
            t["w:t"][0]["#text"] = nuevoTexto;
          } else {
            t["#text"] = nuevoTexto;
          }
          return; // Ya tiene el texto
        }
      }
      // Si no tenía w:t, agregarlo
      const runChildren = nuevoRun["w:r"];
      if (Array.isArray(runChildren)) {
        runChildren.push({ "w:t": [{ "#text": nuevoTexto }] });
      }
    } else {
      // No hay w:r existente, crear estructura completa
      nuevoRun = {
        "w:r": [
          { "w:t": [{ "#text": nuevoTexto }] },
        ],
      };
    }

    // Insertar el nuevo w:r en el contenido de la celda
    // Buscar dónde insertar (después de w:p si existe, o al final)
    const pNodes = buscarNodos(contenido, "w:p");
    if (pNodes.length > 0) {
      // Insertar w:r dentro del último w:p
      const ultimoP = pNodes[pNodes.length - 1];
      const pKey = Object.keys(ultimoP).find((k) => k !== ":@");
      if (pKey && Array.isArray(ultimoP[pKey])) {
        ultimoP[pKey].push(nuevoRun);
      }
    } else {
      // No hay w:p, crear uno envolviendo
      const nuevoP: XmlNode = { "w:p": [nuevoRun] };
      contenido.push(nuevoP);
    }
    return;
  }

  // Celda con contenido: reemplazar el primer w:t, vaciar el resto
  let primero = true;
  for (const nodoTexto of textos) {
    if (primero) {
      const valKey = Object.keys(nodoTexto).find((k) => k !== ":@");
      if (valKey === "w:t") {
        if (Array.isArray(nodoTexto["w:t"])) {
          nodoTexto["w:t"][0]["#text"] = nuevoTexto;
        } else {
          nodoTexto["#text"] = nuevoTexto;
        }
      }
      primero = false;
    } else {
      const valKey = Object.keys(nodoTexto).find((k) => k !== ":@");
      if (valKey === "w:t") {
        if (Array.isArray(nodoTexto["w:t"])) {
          nodoTexto["w:t"][0]["#text"] = "";
        } else {
          nodoTexto["#text"] = "";
        }
      }
    }
  }
}

// ─── Normalización de valores ────────────────────────────────────────────────

/**
 * Conierte cualquier valor a string plano para insertar en el DOCX.
 * Evita que objetos/arrays aparezcan como "[object Object]".
 */
function valorParaDocx(valor: unknown): string {
  if (valor == null) return "";
  if (typeof valor === "string") return valor;
  if (typeof valor === "number" || typeof valor === "boolean") return String(valor);
  if (Array.isArray(valor)) {
    return valor.map(valorParaDocx).filter(Boolean).join("\n");
  }
  if (typeof valor === "object") {
    return Object.values(valor as Record<string, unknown>)
      .map(valorParaDocx)
      .filter(Boolean)
      .join("\n");
  }
  return String(valor);
}

// ─── Renderizado de campos simples ──────────────────────────────────────────

/**
 * Reemplaza los campos simples en las celdas del DOCX.
 * Usa los bindings para saber dónde está cada campo.
 */
function renderizarCampos(
  tablas: XmlNode[],
  bindings: FieldBinding[],
  datos: Record<string, any>
): void {
  for (const binding of bindings) {
    const valor = datos[binding.campo];
    if (valor === undefined || valor === null) continue;

    const loc = binding.ubicacion as DocxCellLocation;
    if (loc.tipo !== "docx-cell") continue;

    const tabla = tablas[loc.tabla];
    if (!tabla) continue;

    const filas = buscarNodos([tabla], "w:tr");
    const fila = filas[loc.fila];
    if (!fila) continue;

    const celdas = buscarNodos([fila], "w:tc");
    const celda = celdas[loc.columna];
    if (!celda) continue;

    const textoValor = valorParaDocx(valor);

    // Manejar transformación append-after-label
    if (binding.transformacion === "append-after-label") {
      const key = Object.keys(celda).find((k) => k !== ":@");
      if (key && key === "w:tc") {
        const contenido = celda[key];
        if (Array.isArray(contenido)) {
          const textos = buscarNodos([contenido], "w:t");
          let textoActual = "";
          for (const nodo of textos) {
            const nodoKey = Object.keys(nodo).find((k) => k !== ":@");
            if (nodoKey === "w:t") {
              if (Array.isArray(nodo["w:t"])) {
                textoActual += nodo["w:t"][0]["#text"] ?? "";
              } else {
                textoActual += nodo["#text"] ?? "";
              }
            }
          }
          const textoFinal = `${textoActual.trim()} ${textoValor}`.trim();
          reemplazarTextoEnCelda(celda, textoFinal);
        } else {
          reemplazarTextoEnCelda(celda, textoValor);
        }
      }
    } else {
      reemplazarTextoEnCelda(celda, textoValor);
    }
  }
}

// ─── Renderizado de regiones repetibles ─────────────────────────────────────

/**
 * Renderiza una región repetible (ej. unidades de PCA).
 *
 * Para cada elemento del array de datos:
 *   1. Clona la fila plantilla
 *   2. Reemplaza el texto en las celdas correspondientes
 *   3. Inserta la fila clonada después de la última fila existente
 *
 * Nota: Esta implementación modifica el XML directamente.
 * Para una inserción más robusta, se necesitaría manipular
 * la estructura de nodos XML de forma más cuidadosa.
 */
function renderizarRegionRepetible(
  tabla: XmlNode,
  region: RepeatRegion,
  items: any[]
): void {
  if (!items || items.length === 0) return;

  const filas = buscarNodos([tabla], "w:tr");
  const filaPlantilla = filas[region.ubicacion.filaPlantilla];
  if (!filaPlantilla) return;

  // Para cada item, crear una nueva fila basada en la plantilla
  const nuevasFilas: XmlNode[] = [];

  for (const item of items) {
    // Clonar la fila plantilla (deep clone del nodo)
    const nuevaFila = JSON.parse(JSON.stringify(filaPlantilla));

    // Reemplazar textos en las celdas
    const celdas = buscarNodos([nuevaFila], "w:tc");
    for (const col of region.columnas) {
      const valor = item[col.campo];
      if (valor === undefined || valor === null) continue;

      // Usar celdaFisica (índice físico del w:tc) en lugar de columna (gridIndex)
      const celda = celdas[col.celdaFisica];
      if (!celda) continue;

      reemplazarTextoEnCelda(celda, valorParaDocx(valor));
    }

    nuevasFilas.push(nuevaFila);
  }

  // Insertar las nuevas filas DESPUÉS de la fila plantilla (no al final de la tabla)
  const contenidoTabla = tabla[Object.keys(tabla).find((k) => k !== ":@")!];
  if (Array.isArray(contenidoTabla)) {
    // Encontrar el índice de la fila plantilla
    let indiceFilaPlantilla = -1;
    for (let i = 0; i < contenidoTabla.length; i++) {
      if (contenidoTabla[i] === filaPlantilla) {
        indiceFilaPlantilla = i;
        break;
      }
    }

    if (indiceFilaPlantilla >= 0) {
      // Insertar justo después de la fila plantilla
      contenidoTabla.splice(indiceFilaPlantilla + 1, 0, ...nuevasFilas);
    }
  }
}

// ─── Renderer principal ─────────────────────────────────────────────────────

/**
 * Renderiza un DOCX plantilla con datos de una planificación.
 *
 * Flujo:
 *   1. Cargar el DOCX original
 *   2. Parsear word/document.xml
 *   3. Renderizar campos simples
 *   4. Renderizar regiones repetibles
 *   5. Serializar el XML modificado
 *   6. Reemplazar document.xml en el ZIP
 *   7. Devolver el buffer del DOCX final
 */
export async function renderizarDocxPlantilla(
  templateBuffer: Buffer,
  bindings: PlantillaBindings,
  datos: Record<string, any>,
  archivosAdicionales?: Record<string, Buffer>
): Promise<Buffer> {
  let zip: JSZip;
  try {
    zip = await JSZip.loadAsync(templateBuffer);
  } catch {
    throw new Error("No se pudo leer el archivo DOCX plantilla.");
  }

  const documentXml = zip.file("word/document.xml");
  if (!documentXml) {
    throw new Error("El DOCX plantilla no contiene word/document.xml.");
  }

  const xmlContent = await documentXml.async("string");
  const arbol = parser.parse(xmlContent);

  // Obtener todas las tablas
  const tablas = buscarNodos(arbol, "w:tbl");

  // 1. Renderizar campos simples
  renderizarCampos(tablas, bindings.campos, datos);

  // 2. Renderizar regiones repetibles
  for (const region of bindings.regionesRepetibles) {
    const tabla = tablas[region.ubicacion.tabla];
    if (!tabla) continue;

    const items = datos[region.origenDatos];
    if (!Array.isArray(items)) continue;

    renderizarRegionRepetible(tabla, region, items);
  }

  // 3. Serializar el XML modificado
  const xmlModificado = builder.build(arbol);

  // 4. Reemplazar document.xml en el ZIP
  zip.file("word/document.xml", xmlModificado);

  // 5. Agregar archivos adicionales si los hay (ej. imágenes)
  if (archivosAdicionales) {
    for (const [nombre, contenido] of Object.entries(archivosAdicionales)) {
      zip.file(nombre, contenido);
    }
  }

  // 6. Generar el buffer del DOCX final
  return zip.generateAsync({ type: "nodebuffer" });
}
