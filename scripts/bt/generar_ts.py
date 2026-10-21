"""Genera el catálogo TS de módulos oficiales BT a partir de los JSON extraídos.

Uso:
  python scripts/bt/figuras.py "<carpeta PDFs>" <carpeta_json>
  python scripts/bt/generar_ts.py <carpeta_json>

Escribe data/bt/modulos-oficiales.generated.ts. Convenciones (ver
openspec/changes/verificar-bt-figuras-profesionales/design.md):
  - código de módulo  `${SIGLA}.M${n}` (n = orden en el documento)
  - RA  `${SIGLA}-M${n}-RA.${k}`, CE `${SIGLA}-M${n}-CE${k}.${j}` (únicos en la figura)
  - UC  `${SIGLA}-UC${n}` (especialización/práctico) y `${SIGLA}-UCG${n}` (genéricos)
Los textos visibles conservan la numeración del documento ("RA 1: …", "CE1.2: …").
"""
import glob
import json
import os
import re
import sys

from figuras import FIGURAS

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SALIDA = os.path.join(RAIZ, "data", "bt", "modulos-oficiales.generated.ts")

ANIOS = [
    (1, r"\b(1\s?(ro|er|ero)|primero)\b"),
    (2, r"\b(2\s?do|segundo)\b"),
    (3, r"\b(3\s?(ro|er|ero)|tercero)\b"),
]


def anio_inicio(nivel):
    """Primer año de BT mencionado en el campo Nivel (1 si no menciona años de BT)."""
    anios = [n for n, pat in ANIOS if re.search(pat, (nivel or "").lower())]
    return min(anios) if anios else 1


def primera_oracion(texto):
    m = re.match(r"(.+?[.;])(\s|$)", texto or "")
    return (m.group(1) if m else (texto or "")).rstrip(".;").strip()


def js(v):
    return json.dumps(v, ensure_ascii=False)


def normalizar(t):
    return re.sub(r"\W+", "", (t or "").lower())


def generar(carpeta):
    datos = {os.path.basename(f)[:-5]: json.load(open(f, encoding="utf-8")) for f in glob.glob(carpeta + "/*.json")}
    lineas = [
        "/**",
        " * Módulos formativos OFICIALES del Bachillerato Técnico, transcritos de los PDF",
        ' * "Módulos formativos de la figura profesional" del MINEDUC.',
        " *",
        " * ARCHIVO GENERADO por scripts/bt/generar_ts.py — no editar a mano: corregir",
        " * el extractor (scripts/bt/extraer_modulos.py) y regenerar. Informe de la",
        " * verificación: openspec/changes/verificar-bt-figuras-profesionales/verificacion.md",
        " */",
        'import type { UnidadCompetencia, ModuloUnidadCompetencia } from "../types-bt";',
        'import type { ModuloFormativo } from "../bachillerato-tecnico";',
        "",
        "export interface CatalogoOficialFigura {",
        "  /** PDF oficial del que se transcribió */",
        "  fuente: string;",
        "  objetivoGeneral: string;",
        "  modulos: ModuloFormativo[];",
        "}",
        "",
        "export const MODULOS_OFICIALES_BT: Record<string, CatalogoOficialFigura> = {",
    ]
    ucs_ts, rel_ts = [], []
    for pdf, figura, sigla in FIGURAS:
        d = datos[figura]
        lineas.append(f"  {js(figura)}: {{")
        lineas.append(f"    fuente: {js(pdf)},")
        lineas.append(f"    objetivoGeneral: {js(d['objetivoGeneral'])},")
        lineas.append("    modulos: [")
        ucs_figura = {}  # texto normalizado → id

        def id_uc(uc, generico):
            clave = normalizar(uc["texto"])
            if clave in ucs_figura:
                return ucs_figura[clave]
            base = f"{sigla}-UCG{uc['n']}" if generico else f"{sigla}-UC{uc['n']}"
            uid, k = base, 2
            while uid in ucs_figura.values():
                uid, k = f"{base}-{k}", k + 1
            ucs_figura[clave] = uid
            ucs_ts.append(f"  {{ id: {js(uid)}, texto: {js(f'UC{uc['n']}: ' + uc['texto'])} }},")
            return uid

        # Primero las UC de módulos no prácticos, para que el práctico reutilice sus ids.
        orden = sorted(enumerate(d["modulos"], 1), key=lambda t: t[1]["categoria"] == "practico")
        uc_por_modulo = {}
        for n, m in orden:
            uc_por_modulo[n] = [id_uc(uc, m["categoria"] == "generico") for uc in m["uc"]]

        for n, m in enumerate(d["modulos"], 1):
            codigo = f"{sigla}.M{n}"
            lineas.append("      {")
            lineas.append(f"        codigo: {js(codigo)},")
            lineas.append(f"        nombre: {js(m['nombre'])},")
            lineas.append(f"        descripcion: {js(primera_oracion(m['objetivo']))},")
            lineas.append(f"        anio: {anio_inicio(m['nivel'])},")
            lineas.append(f"        categoria: {js(m['categoria'])},")
            lineas.append(f"        nivel: {js(m['nivel'])},")
            if m["duracionTotalPeriodos"]:
                lineas.append(f"        duracionTotalPeriodos: {m['duracionTotalPeriodos']},")
            lineas.append('        estadoCatalogo: "completo",')
            lineas.append(f"        objetivoModulo: {js(m['objetivo'])},")
            lineas.append("        resultadosAprendizaje: [")
            for r in m["ra"]:
                lineas.append("          {")
                lineas.append(f"            id: {js(f'{sigla}-M{n}-RA.{r['n']}')},")
                lineas.append(f"            texto: {js(f'RA {r['n']}: ' + r['texto'])},")
                lineas.append("            criteriosEvaluacion: [")
                for j, c in enumerate(r["ce"], 1):
                    cid = f"{sigla}-M{n}-CE{r['n']}.{j}"
                    lineas.append(f"              {{ id: {js(cid)}, texto: {js(f'CE{c['n']}: ' + c['texto'])} }},")
                lineas.append("            ],")
                lineas.append("          },")
            lineas.append("        ],")
            lineas.append("      },")
            for uid in uc_por_modulo[n]:
                rel_ts.append(f"  {{ moduloId: {js(codigo)}, unidadCompetenciaId: {js(uid)} }},")
        lineas.append("    ],")
        lineas.append("  },")
    lineas.append("};")
    lineas.append("")
    lineas.append("/** UC asociadas declaradas en cada módulo oficial (texto del documento). */")
    lineas.append("export const UNIDADES_COMPETENCIA_OFICIALES_BT: UnidadCompetencia[] = [")
    lineas += ucs_ts
    lineas.append("];")
    lineas.append("")
    lineas.append("export const MODULO_UNIDAD_COMPETENCIA_OFICIALES_BT: ModuloUnidadCompetencia[] = [")
    lineas += rel_ts
    lineas.append("];")
    os.makedirs(os.path.dirname(SALIDA), exist_ok=True)
    with open(SALIDA, "w", encoding="utf-8", newline="\n") as f:
        f.write("\n".join(lineas) + "\n")
    print(f"{SALIDA}: {len(lineas)} líneas, {len(ucs_ts)} UC, {len(rel_ts)} relaciones módulo-UC")


if __name__ == "__main__":
    generar(sys.argv[1])
