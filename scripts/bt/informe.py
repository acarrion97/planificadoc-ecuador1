"""Genera el informe de verificación (Markdown) a partir de los JSON extraídos.

Uso: python scripts/bt/informe.py "<carpeta PDFs>" <carpeta_json> <salida.md>
"""
import json
import os
import sys

from figuras import FIGURAS
from revisar import anomalias
from verificar_fidelidad import verificar


def main(origen, carpeta, salida):
    total, partidos, dudosos = verificar(origen, carpeta)
    filas, avisos = [], []
    tot_m = tot_ra = tot_ce = 0
    for pdf, figura, sigla in FIGURAS:
        d = json.load(open(os.path.join(carpeta, f"{figura}.json"), encoding="utf-8"))
        n_m = len(d["modulos"])
        n_ra = sum(len(m["ra"]) for m in d["modulos"])
        n_ce = sum(len(r["ce"]) for m in d["modulos"] for r in m["ra"])
        tot_m, tot_ra, tot_ce = tot_m + n_m, tot_ra + n_ra, tot_ce + n_ce
        probs = anomalias(d)
        filas.append(f"| `{figura}` | {sigla} | {pdf} | {n_m} | {n_ra} | {n_ce} | {'ver notas' if probs else 'OK'} |")
        avisos += [f"- `{figura}` {p}" for p in probs]
    L = [
        "# Informe de verificación — módulos formativos BT",
        "",
        "Generado por `scripts/bt/informe.py` a partir de los PDF oficiales de la carpeta",
        "`planificadoc/figuras profecionales` (extractor `scripts/bt/extraer_modulos.py`).",
        "",
        "## Resumen",
        "",
        f"- Figuras verificadas contra su PDF: **{len(FIGURAS)}** de 34.",
        f"- Módulos oficiales: **{tot_m}** · RA: **{tot_ra}** · CE: **{tot_ce}**.",
        f"- Fidelidad del texto (objetivos, UC, RA, CE): **{total}** textos; "
        f"{total - len(partidos) - len(dudosos)} aparecen literalmente en el PDF, "
        f"{len(partidos)} aparecen en 2-3 tramos (celda de tabla partida entre filas o páginas) "
        f"y {len(dudosos)} requirieron revisión manual (ver abajo).",
        "- Los módulos anteriores (sin respaldo documental) quedan como `historico`: siguen",
        "  resolviendo planes guardados y no se ofrecen para planes nuevos.",
        "",
        "## Figuras sin PDF de módulos formativos",
        "",
        "- `climatizacion`: se conserva la transcripción previa (fuente `docs/bt-modulos-formativos/txt/cli.txt`).",
        "- `actividad-fisica`: se conserva la transcripción previa; 5 módulos siguen `pendiente`.",
        "- `gestion-deportiva`: sin fuente; sus 3 módulos quedan `pendiente` (sin RA/CE).",
        "- `construcciones-metalicas`: figura deprecada, sin cambios.",
        "",
        "## Por figura",
        "",
        "| Figura | Sigla | PDF | Módulos | RA | CE | Estado |",
        "|---|---|---|---|---|---|---|",
        *filas,
        "",
        "## Incidencias del documento fuente",
        "",
        "Numeración irregular en el propio PDF. Se conserva la etiqueta original; cada CE se",
        "asigna al RA bajo el que aparece (o a la fila de la tabla, en el práctico):",
        "",
        *(avisos or ["- Ninguna."]),
        "",
        "## Textos revisados manualmente",
        "",
        "Solo el final de la frase queda separado en el PDF (celda partida por el salto de fila);",
        "se comprobó a mano contra el texto del PDF que la transcripción es completa:",
        "",
        *([f"- `{f}` {e}: {t}" for f, e, t in dudosos] or ["- Ninguno."]),
        "",
        "## Auditoría de consumidores (tarea 1.3)",
        "",
        "- Filtran módulos `historico` (selección para planes nuevos): `app/planificar-bt/[figuraId].tsx`",
        "  (`obtenerModulosSeleccionables`), `app/conecta-nivela-crea/index.tsx` (selector de módulo) y",
        "  `app/bachillerato-tecnico.tsx` (conteo de módulos).",
        "- Resuelven por código y siguen encontrando los históricos (sin cambios): `lib/planificaciones-bt-context.tsx`,",
        "  `app/conecta-nivela-crea/index.tsx` (módulo del plan), `app/ver-cnc/[id].tsx`, `server/cnc-router.ts`,",
        "  `lib/cnc-word-generator.ts`, `lib/pdf-generator.ts`.",
        "",
    ]
    with open(salida, "w", encoding="utf-8", newline="\n") as f:
        f.write("\n".join(L))
    print(salida)


if __name__ == "__main__":
    main(*sys.argv[1:4])
