"""Comprueba que cada texto transcrito (objetivo, RA, CE, UC) aparezca literalmente
en el PDF oficial, ignorando espacios, saltos de línea y guiones de corte.

Uso: python scripts/bt/verificar_fidelidad.py "<carpeta PDFs>" <carpeta_json>
"""
import json
import os
import re
import sys

import pymupdf

from figuras import FIGURAS


def norm(t):
    return re.sub(r"[\s­\-‐]+", "", (t or "").lower())


def tramos(n, fuente):
    """Divide n en los tramos más largos que aparecen en la fuente (búsqueda voraz).

    Una celda de tabla partida entre páginas se transcribe completa pero en el
    PDF queda en 2-3 tramos separados; una palabra perdida deja tramos cortos.
    """
    out, i = [], 0
    while i < len(n):
        k = i
        while k < len(n) and n[i:k + 1] in fuente:
            k += 1
        if k == i:
            return None  # un carácter que no está en la fuente
        out.append(n[i:k])
        i = k
    return out


def verificar(origen, carpeta):
    """Devuelve (total, partidos, faltan): textos literales, en tramos largos, y dudosos."""
    total, partidos, faltan = 0, [], []
    for pdf, figura, _sigla in FIGURAS:
        fuente = norm("".join(p.get_text() for p in pymupdf.open(os.path.join(origen, pdf))))
        d = json.load(open(os.path.join(carpeta, f"{figura}.json"), encoding="utf-8"))
        textos = [("objetivo general", d["objetivoGeneral"])]
        for i, m in enumerate(d["modulos"], 1):
            textos.append((f"M{i} objetivo", m["objetivo"]))
            textos += [(f"M{i} UC{u['n']}", u["texto"]) for u in m["uc"]]
            for r in m["ra"]:
                textos.append((f"M{i} RA{r['n']}", r["texto"]))
                textos += [(f"M{i} CE{c['n']}", c["texto"]) for c in r["ce"]]
        for etiqueta, t in textos:
            total += 1
            n = norm(t)
            if n in fuente:
                continue
            partes = tramos(n, fuente)
            if partes and len(partes) <= 3 and all(len(p) >= 15 for p in partes):
                partidos.append((figura, etiqueta, t))
            else:
                faltan.append((figura, etiqueta, t))
    return total, partidos, faltan


if __name__ == "__main__":
    total, partidos, faltan = verificar(sys.argv[1], sys.argv[2])
    literales = total - len(partidos) - len(faltan)
    print(f"{total} textos: {literales} literales, {len(partidos)} en tramos (celda partida), {len(faltan)} dudosos")
    for figura, etiqueta, t in partidos:
        print(f"  PARTIDO  {figura} {etiqueta}: {t[:120]}")
    for figura, etiqueta, t in faltan:
        print(f"  DUDOSO   {figura} {etiqueta}: {t[:120]}")
