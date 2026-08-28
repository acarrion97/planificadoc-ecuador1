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
 * Encuentra todos los w:t dentro de la celda y reemplaza su contenido.
 */
function reemplazarTextoEnCelda(celda: XmlNode, nuevoTexto: string): void {
  const key = Object.keys(celda).find((k) => k !== ":@");
  if (!key || key !== "w:tc") return;

  const contenido = celda[key];
  if (!Array.isArray(contenido)) return;

  // Buscar todos los nodos w:t y reemplazar su contenido
  let textoReemplazado = false;
  for (const nodo of contenido) {
    const nodoKey = Object.keys(nodo).find((k) => k !== ":@");
    if (nodoKey === "w:t") {
      // Mantener el primer w:t, eliminar los demás
      if (!textoReemplazado) {
        if (Array.isArray(nodo["w:t"])) {
          // Si hay múltiples w:t, cambiar el primero y marcar para limpiar
          nodo["w:t"][0]["#text"] = nuevoTexto;
          textoReemplazado = true;
        } else {
          nodo["#text"] = nuevoTexto;
          textoReemplazado = true;
        }
      } else {
        // Marcar para eliminar (poner texto vacío)
        if (Array.isArray(nodo["w:t"])) {
          nodo["w:t"][0]["#text"] = "";
        } else {
          nodo["#text"] = "";
        }
      }
    }
  }
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
  console.log(`[template-renderer] Renderizando ${bindings.length} campos`);
  console.log(`[template-renderer] Datos disponibles:`, Object.keys(datos));

  for (const binding of bindings) {
    const valor = datos[binding.campo];
    if (valor === undefined || valor === null) {
      console.log(`[template-renderer] Campo '${binding.campo}' no tiene valor en datos`);
      continue;
    }

    const loc = binding.ubicacion as DocxCellLocation;
    if (loc.tipo !== "docx-cell") {
      console.log(`[template-renderer] Binding '${binding.campo}' tiene ubicación tipo '${loc.tipo}', esperado 'docx-cell'`);
      continue;
    }

    const tabla = tablas[loc.tabla];
    if (!tabla) {
      console.log(`[template-renderer] Tabla ${loc.tabla} no encontrada (total: ${tablas.length})`);
      continue;
    }

    const filas = buscarNodos([tabla], "w:tr");
    const fila = filas[loc.fila];
    if (!fila) {
      console.log(`[template-renderer] Fila ${loc.fila} no encontrada en tabla ${loc.tabla} (total: ${filas.length})`);
      continue;
    }

    const celdas = buscarNodos([fila], "w:tc");
    const celda = celdas[loc.columna];
    if (!celda) {
      console.log(`[template-renderer] Columna ${loc.columna} no encontrada en fila ${loc.fila} (total: ${celdas.length})`);
      continue;
    }

    const textoValor = binding.tipo === "number"
      ? String(valor)
      : String(valor);

    console.log(`[template-renderer] Reemplazando campo '${binding.campo}' = '${textoValor}' en [${loc.tabla},${loc.fila},${loc.columna}]`);
    reemplazarTextoEnCelda(celda, textoValor);
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
    // Clonar la fila plantilla (shallow clone del nodo)
    const nuevaFila = JSON.parse(JSON.stringify(filaPlantilla));

    // Reemplazar textos en las celdas
    const celdas = buscarNodos([nuevaFila], "w:tc");
    for (const { campo, columna } of region.columnas) {
      const valor = item[campo];
      if (valor === undefined || valor === null) continue;

      const celda = celdas[columna];
      if (!celda) continue;

      reemplazarTextoEnCelda(celda, String(valor));
    }

    nuevasFilas.push(nuevaFila);
  }

  // Insertar las nuevas filas después de la última fila existente
  const contenidoTabla = tabla[Object.keys(tabla).find((k) => k !== ":@")!];
  if (Array.isArray(contenidoTabla)) {
    // Encontrar el índice de la última fila
    let ultimoIndiceFila = -1;
    for (let i = 0; i < contenidoTabla.length; i++) {
      const key = Object.keys(contenidoTabla[i]).find((k) => k !== ":@");
      if (key === "w:tr") {
        ultimoIndiceFila = i;
      }
    }

    // Insertar después de la última fila
    if (ultimoIndiceFila >= 0) {
      contenidoTabla.splice(ultimoIndiceFila + 1, 0, ...nuevasFilas);
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
