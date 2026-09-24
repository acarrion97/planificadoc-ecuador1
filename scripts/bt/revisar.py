"""Lista anomalías de los JSON extraídos (módulos sin RA, RA sin CE, textos
sospechosamente largos, numeración irregular…) para revisión humana.

Uso: python scripts/bt/revisar.py <carpeta_json>
"""
import collections
import glob
import json
import sys


def anomalias(d):
    probs = []
    cats = collections.Counter(m["categoria"] for m in d["modulos"])
    if cats["practico"] != 1:
        probs.append(f"módulos prácticos detectados: {cats['practico']}")
    if not d.get("objetivoGeneral"):
        probs.append("sin objetivo general")
    for i, m in enumerate(d["modulos"], 1):
        tag = f"M{i} «{(m['nombre'] or '?')[:40]}»"
        if not m["ra"]:
            probs.append(f"{tag}: sin RA")
        if m["ce_huerfanos"]:
            probs.append(f"{tag}: {m['ce_huerfanos']}")
        if not m["uc"]:
            probs.append(f"{tag}: UC sin código: {(m['ucTextoSinCodigo'] or '')[:50]}")
        for campo in ("nivel", "objetivo", "duracionTotalPeriodos"):
            if not m[campo]:
                probs.append(f"{tag}: sin {campo}")
        if m["nombre"] and len(m["nombre"]) > 80:
            probs.append(f"{tag}: nombre largo")
        ns = [r["n"] for r in m["ra"]]
        if ns != list(range(1, len(ns) + 1)):
            probs.append(f"{tag}: numeración RA {ns}")
        for r in m["ra"]:
            if not r["ce"]:
                probs.append(f"{tag}: RA{r['n']} sin CE")
            if not 25 <= len(r["texto"]) <= 400:
                probs.append(f"{tag}: RA{r['n']} longitud {len(r['texto'])}")
            for c in r["ce"]:
                if not 20 <= len(c["texto"]) <= 350:
                    probs.append(f"{tag}: CE{c['n']} longitud {len(c['texto'])}")
    return probs


if __name__ == "__main__":
    for f in sorted(glob.glob(sys.argv[1] + "/*.json")):
        d = json.load(open(f, encoding="utf-8"))
        probs = anomalias(d)
        print(d["figura"], "OK" if not probs else f"({len(probs)})")
        for p in probs:
            print("   ", p)
