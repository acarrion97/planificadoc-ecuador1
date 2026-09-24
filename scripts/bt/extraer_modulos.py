"""
Extrae los módulos formativos de un PDF oficial "Módulos formativos de la
figura profesional" (MINEDUC) a JSON: objetivo general y, por módulo,
categoría, nombre, nivel, duración, UC asociada, objetivo y RA/CE.

Herramienta local (requiere `pip install pymupdf`); no es dependencia de la app.
Uso: python scripts/bt/extraer_modulos.py <pdf> <salida.json>
"""
import json
import re
import sys

import pymupdf

NL = chr(10)

# Variantes vistas en los PDF: "RA 1:", "RA1.", "RA.1 Texto", "RA 4.: Texto", "RA3 Texto".
RA_RE = re.compile(r"^R\.?A\s?[.:]?\s?(\d+)\s?(?:\.\s?:|:|\.|\s(?=[A-ZÁÉÍÓÚ])|$)\s*(.*)$")
# "CE1.1:", "CE.1.1:", "CE 1.1", "CE1:" (numeración por RA sin prefijo).
CE_RE = re.compile(r"^C\.?[ED]\s?\.?\s?(\d+)(?:\s?\.\s?(\d+))?\s?(?:\.\s?:|:|\.|\s(?=[A-ZÁÉÍÓÚ])|$)\s*(.*)$")
# Un RA/CE puede empezar a mitad de línea (celdas de tabla): se fuerza salto antes.
MARCA_RE = re.compile(r"\s(?=(?:C\.?E\s?\.?\s?\d+\s?\.\s?\d+\s?:|R\.?A\s?\.?\s?\d+\s?(?::|\.\s?[A-ZÁÉÍÓÚ])))")
# Encabezados que cierran la lista de RA/CE de un módulo. Sensible a mayúsculas:
# "contenidos protegidos…" dentro de un CE no debe cortarlo.
# Líneas de referencias bibliográficas que el PDF intercala entre bloques de texto.
REFERENCIA_RE = re.compile(
    r"https?://|www\.|\bdoi\b|ISBN|\(\d{4}[a-z]?\)\.|^[A-ZÁÉÍÓÚ][\wáéíóúñ-]+(?: [A-ZÁÉÍÓÚ][\wáéíóúñ-]+)*, [A-Z]\. ?(?:[A-Z]\.)?"
)
FIN_RA = re.compile(
    r"^(CONTENIDOS|Contenidos\b|Conceptuales\b|Perfil del|PERFIL DEL|Orientaciones [Mm]etodol|ORIENTACIONES|Referencias|REFERENCIAS|Bibliograf|Requisitos|Nota:|\d\.\s+M[óo]dulo)"
)


def unir(lineas):
    """Une líneas cortadas del PDF (guiones de corte y espacios)."""
    out = ""
    for l in lineas:
        l = l.strip()
        if not l:
            continue
        if out.endswith(("-", "­")) and l[:1].islower():
            out = out[:-1] + l
        else:
            out = (out + " " + l).strip()
    return re.sub(r"\s+", " ", out.replace("­", "")).strip()


def parse_ra_ce(*fuentes):
    """RA y CE a partir de líneas.

    Con una sola fuente (módulos regulares) el texto sigue el orden del documento
    y cada CE pertenece al último RA leído. Con dos fuentes (tabla del práctico:
    columna RA y columna CE por separado) los CE se agrupan por su prefijo
    (CEn.m → RA n). Se conserva la etiqueta del CE tal como figura en la fuente
    (p. ej. "1.2" o "3" cuando el documento numera CE1…CE4 dentro de cada RA).
    """
    ras, orden = {}, []
    ces = []  # (ra_asignado, etiqueta, [líneas])
    avisos = []
    secuencial = len(fuentes) == 1
    for fuente in fuentes:
        cur, ra_actual, pista = None, None, None
        for l in MARCA_RE.sub(NL, NL.join(fuente)).split(NL):
            s = l.strip()
            if s.startswith("@@RA="):  # pista de fila puesta por practico_por_bloques
                pista = int(s[5:])
                continue
            m = RA_RE.match(s)
            if m:
                n = int(m.group(1))
                ra_actual = n
                if n in ras:
                    # Algunos PDF repiten el texto del RA en otra celda: se conserva el primero.
                    cur = None
                    continue
                ras[n] = [m.group(2)]
                orden.append(n)
                cur = ras[n]
                continue
            m = CE_RE.match(s)
            if m:
                a, b = int(m.group(1)), m.group(2)
                etiqueta = f"{a}.{int(b)}" if b else str(a)
                if secuencial:
                    destino = ra_actual
                    if b and destino is not None and a != destino:
                        avisos.append(f"CE{etiqueta} bajo RA{destino}")
                else:
                    # Tabla del práctico: manda el prefijo "CEn.m" si ese RA existe;
                    # si no (CE1:, CE7.1 con 4 RA…) se usa la fila de la tabla.
                    destino = a if (b and a in ras) else pista
                    previo = next((v for (d, e, v) in ces if d == destino and e == etiqueta), None)
                    if previo is not None and pista is not None and pista != destino:
                        destino = pista  # etiqueta repetida en otra fila (errata del PDF)
                        previo = next((v for (d, e, v) in ces if d == destino and e == etiqueta), None)
                    if previo is not None:
                        # Texto duplicado en otra celda: se conserva el primero.
                        cur = None
                        continue
                    if b and a != destino:
                        avisos.append(f"CE{etiqueta} en la fila del RA{destino}")
                entrada = (destino, etiqueta, [m.group(3)])
                ces.append(entrada)
                cur = entrada[2]
                continue
            if FIN_RA.match(s) or REFERENCIA_RE.search(s):
                cur = None
                continue
            if cur is not None:
                cur.append(s)
    out = []
    for n in (orden if secuencial else sorted(orden)):
        crit = [{"n": et, "texto": unir(v)} for (dest, et, v) in ces if dest == n]
        out.append({"n": n, "texto": unir(ras[n]), "ce": crit})
    huerfanos = [et for (dest, et, _v) in ces if dest not in ras]
    return out, huerfanos + [f"aviso: {a}" for a in avisos]


def practico_por_bloques(doc, desde):
    """RA/CE de la tabla del Módulo Práctico Experimental (RA | CE | Actividades).

    Las tablas de los PDF varían (celdas partidas entre páginas, encabezados
    centrados, columnas vacías), así que se trabaja con los bloques de texto y se
    asigna cada bloque a una columna según la x de los marcadores "RA n" y "CEn.m".
    Devuelve las fuentes para parse_ra_ce: [columna RA, columna CE], o una sola
    fuente si RA y CE van en la misma columna.
    """
    # Se trabaja por líneas (no por bloques): pymupdf a veces fusiona celdas
    # vecinas en un bloque que abarca toda la fila, pero una línea no cruza celdas.
    bloques = []
    for i in range(desde, len(doc)):
        for bl in doc[i].get_text("dict")["blocks"]:
            for ln in bl.get("lines", []):
                txt = "".join(s["text"] for s in ln["spans"])
                if txt.strip():
                    bloques.append((i, round(ln["bbox"][1]), ln["bbox"][0], txt))
    bloques.sort(key=lambda b: (b[0], b[1], b[2]))
    k = next((n for n, b in enumerate(bloques) if re.search(r"(?m)^\s*Resultados", b[3])), None)
    if k is None:
        return None
    bloques = bloques[k + 1:]
    # "RA" en una línea y "1: Texto" en la siguiente de la misma celda → "RA 1: Texto".
    unidas = []
    for b in bloques:
        # misma celda: misma página y la línea anterior en x, o en la misma altura
        k_prev = next(
            (
                k
                for k in range(len(unidas) - 1, -1, -1)
                if unidas[k][0] == b[0]
                and (abs(unidas[k][2] - b[2]) < 15 or (abs(unidas[k][1] - b[1]) <= 3 and 0 < b[2] - unidas[k][2] < 80))
            ),
            None,
        )
        prev = unidas[k_prev] if k_prev is not None else None
        if prev and re.fullmatch(r"\s*R\.?A\.?\s*", prev[3]) and re.match(r"\s*\d+\s?[:.]", b[3]):
            unidas[k_prev] = (prev[0], prev[1], prev[2], "RA " + b[3].strip())
        else:
            unidas.append(b)
    bloques = unidas

    def primera(t):
        return t.strip().split(NL)[0].strip()

    x_ra = [b[2] for b in bloques if RA_RE.match(primera(b[3]))]
    x_ce = [b[2] for b in bloques if CE_RE.match(primera(b[3]))]
    if not x_ra:
        return None
    ra_x = min(x_ra)
    ce_x = min((x for x in x_ce if x > ra_x + 20), default=None)
    if ce_x is None:
        return [[l for b in bloques for l in b[3].split(NL)]]
    # Inicio de la columna de actividades: la x más a la izquierda (a la derecha
    # de los CE) en la que empiezan varias líneas. El texto justificado de un CE
    # llega a veces en trozos con x dispersas, que no se repiten.
    frecuencia = {}
    for b in bloques:
        if b[2] > ce_x + 40:
            frecuencia[round(b[2])] = frecuencia.get(round(b[2]), 0) + 1
    repetidas = [x for x, n in frecuencia.items() if n >= 3]
    act_x_estimado = min(repetidas or frecuencia or [float("inf")])

    # Donde la tabla tiene bordes dibujados, el límite CE | Actividades es la
    # línea vertical (a la derecha de los CE) tras la que empiezan más líneas de
    # texto: la columna de actividades. Una columna vacía intermedia no cuenta.
    limite_por_pagina, reglas_por_pagina, borde_ra_ce = {}, {}, {}
    for p in {b[0] for b in bloques}:
        xs = set()
        for dr in doc[p].get_drawings():
            for it in dr["items"]:
                if it[0] == "l" and abs(it[1].x - it[2].x) < 1 and abs(it[1].y - it[2].y) > 10:
                    xs.add(round(it[1].x))
                elif it[0] == "re" and it[1].width < 3 and it[1].height > 10:
                    xs.add(round(it[1].x0))
        reglas_por_pagina[p] = [x for x in xs if x > ce_x + 40]
        # borde RA | CE: la línea vertical justo a la izquierda de los marcadores CE
        izquierda = [x for x in xs if ce_x - 25 <= x <= ce_x]
        if izquierda:
            borde_ra_ce[p] = max(izquierda)
        inicios = [b[2] for b in bloques if b[0] == p]
        puntaje = {x: sum(1 for i in inicios if x <= i <= x + 12) for x in reglas_por_pagina[p]}
        if puntaje and max(puntaje.values()) > 0:
            limite_por_pagina[p] = max(puntaje, key=lambda x: (puntaje[x], -x))
    # Páginas cuya columna de actividades viene vacía: el límite más frecuente
    # del resto, ajustado a la línea vertical más cercana de la página.
    if limite_por_pagina:
        vals = list(limite_por_pagina.values())
        habitual = max(set(vals), key=vals.count)
        for p, reglas in reglas_por_pagina.items():
            if p not in limite_por_pagina:
                limite_por_pagina[p] = min(reglas, key=lambda x: abs(x - habitual)) if reglas else habitual

    def inicio_ce(p):
        return borde_ra_ce[p] - 1 if p in borde_ra_ce else ce_x - 15

    def en_col_ce(b):
        limite = limite_por_pagina.get(b[0])
        return inicio_ce(b[0]) <= b[2] < (limite - 2 if limite else act_x_estimado - 5)

    col_ra = [b for b in bloques if b[2] < inicio_ce(b[0])]
    col_ce = [b for b in bloques if en_col_ce(b)]
    marcas_ra = [(p, y, int(m.group(1))) for (p, y, _x, t) in col_ra if (m := RA_RE.match(primera(t)))]

    def ra_de_fila(p, y):
        """RA más cercano en altura en la misma página (o el último de páginas previas)."""
        misma = [(abs(yr - y), yr > y + 5, n) for (pr, yr, n) in marcas_ra if pr == p]
        if misma:
            return min(misma)[2]
        previas = [n for (pr, _yr, n) in marcas_ra if pr < p]
        return previas[-1] if previas else None

    ra = [l for b in col_ra for l in b[3].split(NL)]
    ce = []
    for (p, y, _x, t) in col_ce:
        if CE_RE.match(primera(t)):
            # Pista de fila para CE sin número de RA ("CE1:") o con numeración
            # inconsistente en el PDF; parse_ra_ce la usa solo en esos casos.
            n = ra_de_fila(p, y)
            if n is not None:
                ce.append(f"@@RA={n}")
        ce += t.split(NL)
    return [ra, ce]


def extraer(pdf):
    doc = pymupdf.open(pdf)
    # El Módulo Práctico Experimental es el último: su tabla se lee aparte.
    ultima_nombre = max(
        (i for i, p in enumerate(doc) if re.search(r"Nombre\s+del\s+m[óo]dulo", p.get_text(), re.I)),
        default=None,
    )
    fuentes_practico = None
    texto = []
    for i, p in enumerate(doc):
        lineas = p.get_text().split(NL)
        if i == ultima_nombre:
            t = NL.join(lineas)
            if re.search(r"Pr[aá]ctico", t, re.I):
                fuentes_practico = practico_por_bloques(doc, i)
            if fuentes_practico is not None:
                # Cabecera del práctico (nombre, nivel, UC, objetivo) hasta la tabla,
                # que puede empezar en la página siguiente.
                for q in range(i, len(doc)):
                    lq = doc[q].get_text().split(NL)
                    corte = next((k for k, l in enumerate(lq) if l.strip().startswith("Resultados")), None)
                    texto += lq if corte is None else lq[:corte]
                    if corte is not None:
                        break
                break
        texto += lineas
    texto = [l.rstrip() for l in texto]
    # Etiquetas partidas palabra por palabra en celdas estrechas ("Nombre / del / módulo:").
    for k in range(len(texto) - 2):
        if texto[k].strip() in ("Nombre", "Objetivo") and texto[k + 1].strip() == "del" and texto[k + 2].strip().startswith("módulo"):
            texto[k], texto[k + 1], texto[k + 2] = f"{texto[k].strip()} del {texto[k + 2].strip()}", "", ""

    i = next((k for k, l in enumerate(texto) if re.match(r"^(1\.\s*)?Objetivo\s+[Gg]eneral", l.strip())), None)
    objetivo_general = None
    if i is not None:
        j = next((k for k in range(i + 1, len(texto)) if re.match(r"^(2\.\s|Plan de estudios|Malla)", texto[k].strip())), len(texto))
        objetivo_general = unir(texto[i + 1:j])

    idx = [k for k, l in enumerate(texto) if re.match(r"^nombre del m[óo]dulo", l.strip(), re.I)]
    modulos = []
    categoria = "generico"
    limites = idx + [len(texto)]
    for a, b in zip(limites, limites[1:]):
        for l in reversed(texto[max(0, a - 8):a]):
            if re.search(r"M[óo]dulo.*Pr[aá]ctico", l, re.I):
                categoria = "practico"
                break
            if re.search(r"M[óo]dulo.*Especializaci", l, re.I):
                categoria = "especializacion"
                break
            if re.search(r"M[óo]dulo.*Gen[eé]rico", l, re.I):
                categoria = "generico"
                break
        bloque = texto[a:b]
        es_ultimo = b == len(texto)

        def campo(ini_re, fin_re):
            k = next((n for n, l in enumerate(bloque) if re.match(ini_re, l.strip(), re.I)), None)
            if k is None:
                return None
            j = next((n for n in range(k + 1, len(bloque)) if re.match(fin_re, bloque[n].strip(), re.I)), len(bloque))
            primera = re.sub(ini_re, "", bloque[k].strip(), flags=re.I)
            return unir([primera] + bloque[k + 1:j])

        nombre = campo(r"^nombre del m[óo]dulo( formativo)?:?", r"^(Sub)?nivel")
        if nombre:
            nombre = re.sub(r"^formativo:\s*", "", nombre).rstrip(" :.")
        nivel = campo(r"^(Sub)?nivel:?", r"^Duraci")
        duracion = campo(r"^Duraci[óo]n:?", r"^Unidad")
        uc_txt = campo(r"^Unidad", r"^Objetivo (del m|de aprendizaje)")
        # "Objetivo del módulo:" (algunos PDF: "Objetivo de aprendizaje:")
        objetivo = campo(r"^Objetivo (del m[óo]dulo|de aprendizaje):?", r"^(Resultados|RA\s?\.?\s?\d)")
        uc_txt = re.sub(r"^(de\s+)?competencia\s+asociada:?\s*", "", uc_txt or "", flags=re.I)
        ucs = [
            {"n": int(m.group(1)), "texto": m.group(2).strip()}
            for m in re.finditer(r"UC\s?\.?\s?(\d+)\s?[.:]\s*(.*?)(?=\s*UC\s?\.?\s?\d+\s?[.:]|$)", uc_txt)
        ]
        if nombre and re.search(r"Pr[aá]ctico", nombre, re.I):
            categoria = "practico"
        if es_ultimo and fuentes_practico is not None:
            ras, huerf = parse_ra_ce(*fuentes_practico)
        else:
            k0 = next((k for k, l in enumerate(bloque) if RA_RE.match(l.strip())), None)
            ras, huerf = parse_ra_ce(bloque[k0:]) if k0 is not None else ([], [])
        dur = re.search(r"(\d+)", duracion or "")
        modulos.append({
            "categoria": categoria,
            "nombre": nombre,
            "nivel": nivel,
            "duracion": duracion,
            "duracionTotalPeriodos": int(dur.group(1)) if dur else None,
            "uc": ucs,
            "ucTextoSinCodigo": uc_txt if not ucs else None,
            "objetivo": objetivo,
            "ra": ras,
            "ce_huerfanos": huerf,
        })
    return {"objetivoGeneral": objetivo_general, "modulos": modulos}


if __name__ == "__main__":
    res = extraer(sys.argv[1])
    with open(sys.argv[2], "w", encoding="utf-8") as f:
        json.dump(res, f, ensure_ascii=False, indent=1)
    for m in res["modulos"]:
        n_ce = sum(len(r["ce"]) for r in m["ra"])
        print(
            f'{m["categoria"]:15} {len(m["ra"]):2} RA {n_ce:3} CE  uc={[u["n"] for u in m["uc"]]} '
            f'dur={m["duracionTotalPeriodos"]} | {m["nombre"]} | huerf={m["ce_huerfanos"]}'
        )
