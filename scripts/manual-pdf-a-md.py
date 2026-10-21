"""
Convierte el Manual de Usuario (PDF) a Markdown por capítulo para la sección
Ayuda → Manual (app/ayuda/manual.tsx).

Uso:
    python scripts/manual-pdf-a-md.py "<ruta al PDF>" public/manual

Genera en public/manual/: un .md por capítulo, index.json (capítulos y secciones)
e img/ con las capturas (WebP). Requiere PyMuPDF (pip install pymupdf) y Pillow.
"""
import hashlib
import io
import json
import re
import sys
import unicodedata
from pathlib import Path

import fitz
from PIL import Image

PDF, OUT = sys.argv[1], Path(sys.argv[2])
OUT.mkdir(parents=True, exist_ok=True)
(OUT / "img").mkdir(exist_ok=True)
for f in list(OUT.glob("*.md")) + list((OUT / "img").glob("*")):
    f.unlink()

doc = fitz.open(PDF)
TOP, BOTTOM = 52, 783


def slug(t):
    t = unicodedata.normalize("NFD", t.lower())
    t = "".join(c for c in t if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9]+", "-", t).strip("-")


def esc_cell(t):
    return re.sub(r"\s*\n\s*", " ", (t or "")).replace("|", "\\|").strip()


def line_md(line):
    out = ""
    for s in line["spans"]:
        txt = s["text"]
        core = txt.strip()
        if not core:
            out += " "
            continue
        b = "Bold" in s["font"]
        i = "Italic" in s["font"]
        lead = " " if txt[:1].isspace() else ""
        trail = " " if txt[-1:].isspace() else ""
        if b and i:
            core = f"***{core}***"
        elif b:
            core = f"**{core}**"
        elif i:
            core = f"*{core}*"
        out += lead + core + trail
    out = re.sub(r"\*\*\s+\*\*", " ", out)  # negrita contigua
    out = out.replace("****", "")
    return re.sub(r"\s+", " ", out).strip()


def plain(line):
    return "".join(s["text"] for s in line["spans"]).strip()


def all_bold(line):
    sp = [s for s in line["spans"] if s["text"].strip()]
    return bool(sp) and all("Bold" in s["font"] for s in sp)


def mid(l):
    return fitz.Point((l["bbox"][0] + l["bbox"][2]) / 2, (l["bbox"][1] + l["bbox"][3]) / 2)


blocks = []
img_hash = {}
img_count = 0
START = None
for pno, page in enumerate(doc):
    d = page.get_text("dict")
    if START is None:
        for b in d["blocks"]:
            if b["type"] == 0 and b["lines"]:
                s0 = b["lines"][0]["spans"][0]
                if abs(s0["size"] - 16) < 0.3 and plain(b["lines"][0]).startswith("1."):
                    START = pno
        if START is None:
            continue
    tables = []
    try:
        tables = page.find_tables().tables
    except Exception:
        pass
    tb = [fitz.Rect(t.bbox) for t in tables]

    items = []
    for ti, t in enumerate(tables):
        items.append((t.bbox[1], t.bbox[0], "table", (t, tb[ti])))
    for b in d["blocks"]:
        if b["type"] == 1:
            items.append((b["bbox"][1], b["bbox"][0], "img", b))
        else:
            for l in b["lines"]:
                y0, y1 = l["bbox"][1], l["bbox"][3]
                if y0 < TOP or y1 > BOTTOM:
                    continue
                if any(r.contains(mid(l)) for r in tb):
                    continue
                if not plain(l):
                    continue
                items.append((y0, l["bbox"][0], "line", l))
    items.sort(key=lambda it: (round(it[0]), it[1]))

    first_item = True
    prev_y = None
    for y, x, kind, p in items:
        if kind == "img":
            img_count += 1
            data = p["image"]
            h = hashlib.md5(data).hexdigest()
            if h not in img_hash:
                name = f"fig-{pno + 1:03d}-{img_count:03d}.webp"
                im = Image.open(io.BytesIO(data))
                if im.mode not in ("RGB", "RGBA"):
                    im = im.convert("RGB")
                if im.width > 1400:
                    im = im.resize((1400, round(im.height * 1400 / im.width)), Image.LANCZOS)
                im.save(OUT / "img" / name, "WEBP", quality=82, method=6)
                img_hash[h] = name
            blocks.append({"k": "img", "src": img_hash[h], "page": pno + 1})
            prev_y = None
            first_item = False
            continue
        if kind == "table":
            t, rect = p
            tl = [
                l
                for bb in d["blocks"]
                if bb["type"] == 0
                for l in bb["lines"]
                if rect.contains(mid(l)) and plain(l)
            ]
            if not tl:
                continue
            # filas por salto vertical; columnas por agrupación del borde izquierdo
            tl.sort(key=lambda l: l["bbox"][1])
            rws, cur_r = [], [tl[0]]
            for l in tl[1:]:
                if l["bbox"][1] - max(q["bbox"][1] for q in cur_r) > 16:
                    rws.append(cur_r)
                    cur_r = [l]
                else:
                    cur_r.append(l)
            rws.append(cur_r)
            xs = sorted(l["bbox"][0] for l in tl)
            cols = [xs[0]]
            for x0 in xs[1:]:
                if x0 - cols[-1] > 14:
                    cols.append(x0)

            def col_of(l):
                return max(i for i, c in enumerate(cols) if l["bbox"][0] >= c - 6)

            rows = []
            for r in rws:
                cells = [[] for _ in cols]
                for l in sorted(r, key=lambda q: (q["bbox"][1], q["bbox"][0])):
                    cells[col_of(l)].append(line_md(l))
                rows.append([esc_cell(" ".join(c)) for c in cells])
            hdr = all_bold(rws[0][0]) and all(all_bold(l) for l in rws[0])
            last = blocks[-1] if blocks else None
            if len(rows) == 1 and len(cols) == 1:
                blocks.append({"k": "callout", "text": rows[0][0].replace("**", "")})
            elif first_item and last and last["k"] == "table" and last["rows"][0] == rows[0]:
                last["rows"].extend(rows[1:])
            else:
                blocks.append({"k": "table", "rows": rows, "hdr": hdr})
            prev_y = None
            first_item = False
            continue

        l = p
        sp0 = next(s for s in l["spans"] if s["text"].strip())
        size = round(sp0["size"], 1)
        txt = plain(l)
        bold0 = "Bold" in sp0["font"]
        if 15.5 <= size < 20 and bold0:
            blocks.append({"k": "h", "lvl": 1, "text": txt})
            prev_y = None
        elif 13.5 <= size < 14 and bold0:
            blocks.append({"k": "h", "lvl": 2, "text": txt})
            prev_y = None
        elif abs(size - 12) < 0.3 and all_bold(l) and re.match(r"^\d+(\.\d+)+\.?\s", txt):
            blocks.append({"k": "h", "lvl": 3, "text": txt})
            prev_y = None
        elif size == 9.0 and txt.startswith("Figura "):
            last = blocks[-1] if blocks else None
            cap = line_md(l).replace("**", "")
            if last and last["k"] == "img" and "cap" not in last:
                last["cap"] = cap
            else:
                blocks.append({"k": "p", "text": f"*{cap}*"})
            prev_y = None
        else:
            first_txt = l["spans"][0]["text"].strip()
            nonempty = [s for s in l["spans"] if s["text"].strip()]
            is_bullet = (
                len(nonempty) == 1
                and len(first_txt) <= 1
                and not first_txt.isalnum()
                and x < 140
                and (l["bbox"][2] - l["bbox"][0]) < 30
            )
            body = line_md(l)
            if is_bullet:
                blocks.append({"k": "li", "lvl": max(0, round((x - 75) / 18)), "text": "", "pending": True, "ord": None})
                prev_y = y
                first_item = False
                continue
            last = blocks[-1] if blocks else None
            if last and last["k"] == "li" and last.get("pending") and prev_y is not None and abs(y - prev_y) < 6:
                last["text"] = body
                last["pending"] = False
                prev_y = y
                first_item = False
                continue
            m = re.match(r"^(\*\*)?(\d{1,2})\.(?:\*\*)?\s+(.*)$", body)
            if m and x < 82:
                blocks.append({"k": "li", "lvl": 0, "text": m.group(3), "ord": int(m.group(2)), "pending": False})
            elif last and last["k"] in ("p", "li") and (
                (prev_y is not None and 0 < y - prev_y < 19 and (last["k"] == "p" or x >= 85))
                or (prev_y is None and first_item and not re.search(r"[.:;?!)”\"]\**$", last["text"]))
            ):
                last["text"] = (last["text"] + " " + body).strip()
            else:
                blocks.append({"k": "p", "text": body})
            prev_y = y
        first_item = False

chapters = []
cur = None
for b in blocks:
    if b["k"] == "h" and b["lvl"] == 1:
        cur = {"title": b["text"].strip(), "md": [], "secs": []}
        chapters.append(cur)
        continue
    if cur is None:
        continue
    md = cur["md"]
    k = b["k"]
    if k == "h":
        t = b["text"].strip()
        md.append(f"\n{'#' * b['lvl']} {t}\n")
        if b["lvl"] == 2:
            cur["secs"].append({"title": t, "id": slug(t)})
    elif k == "p":
        md.append(f"\n{b['text']}\n")
    elif k == "li":
        ind = "  " * b["lvl"]
        mark = f"{b['ord']}." if b["ord"] else "-"
        md.append(f"{ind}{mark} {b['text']}")
    elif k == "img":
        cap = b.get("cap", "")
        alt = cap.replace("[", "(").replace("]", ")")
        md.append(f"\n![{alt}](img/{b['src']})\n")
        if cap:
            md.append(f"*{cap}*\n")
    elif k == "callout":
        t = b["text"].strip()
        m = re.match(r"^(Nota|Consejo|Importante|Advertencia|Atención)\s*:\s*(.*)$", t, re.S)
        if m:
            md.append(f"\n> **{m.group(1)}:** {m.group(2)}\n")
        else:
            md.append(f"\n> {t}\n")
    elif k == "table":
        rows = b["rows"]
        n = max(len(r) for r in rows)
        rows = [r + [""] * (n - len(r)) for r in rows]
        head, body = (rows[0], rows[1:]) if b["hdr"] else ([""] * n, rows)
        md.append("")
        md.append("| " + " | ".join(head) + " |")
        md.append("|" + "|".join([" --- "] * n) + "|")
        for r in body:
            md.append("| " + " | ".join(r) + " |")
        md.append("")

index = []
for i, c in enumerate(chapters, 1):
    title = c["title"]
    fname = f"{i:02d}-{slug(re.sub(r'^[0-9]+[.]\s*', '', title))}.md"
    text = f"# {title}\n" + "\n".join(c["md"]) + "\n"
    text = re.sub(r"\n{3,}", "\n\n", text)
    # los códigos hexadecimales de la paleta se muestran como muestras de color
    text = re.sub(r"(?<![`\w])(#[0-9A-Fa-f]{6})(?![`\w])", r"`\1`", text)
    (OUT / fname).write_text(text, encoding="utf-8")
    index.append({"file": fname, "title": title, "id": slug(title), "sections": c["secs"]})

(OUT / "index.json").write_text(
    json.dumps(
        {
            "title": "Manual de Usuario — PlanificaDoc",
            "version": "1.0",
            "date": "28/09/2026",
            "pdf": "manual-usuario-planificadoc-v1.0.pdf",
            "chapters": index,
        },
        ensure_ascii=False,
        indent=2,
    ),
    encoding="utf-8",
)
print(len(chapters), "capitulos;", len(img_hash), "imagenes;", sum(len(c["md"]) for c in chapters), "bloques")
