"""Correspondencia PDF oficial de módulos formativos → figura de la app → sigla.

Siglas según docs/bt-modulos-formativos/HANDOFF.md. Los PDF viven fuera del repo
(carpeta "figuras profecionales" del docente); se pasa la carpeta por argumento.
"""

FIGURAS = [
    # (pdf, figura_id, sigla)
    ("curriculo-FIP-al.pdf", "gestion-administrativa", "GAL"),
    ("curriculo-FIP-gestion-financiera-contable.pdf", "gestion-financiera", "GFC"),
    ("curriculo-mrh.pdf", "recursos-hidrobiologicos", "MRH"),
    ("curriculo-pas.pdf", "produccion-agropecuaria", "PAS"),
    ("curriculo-cma.pdf", "areas-protegidas", "CMA"),
    ("curriculo-gads.pdf", "gestion-ambiental", "GADS"),
    ("curriculo-FIP-construccion-oc.pdf", "obra-civil", "OC"),
    ("curriculo-FIP-iea.pdf", "instalaciones-electricas", "IEA"),
    ("curriculo-fip-ecli.pdf", "electromecanica-industrial", "ECLI"),
    ("curriculo-FIP-ema.pdf", "electromecanica-automotriz", "EMA"),
    ("curriculo-elec.pdf", "electronica", "ELEC"),
    ("3modulos-formativos-fem.pdf", "fabricacion-madera", "FM"),
    ("curriculo-FP-me.pdf", "mecatronica", "ME"),
    ("3modulos-formativos-conservacion-y-procesamiento-de-alimentos.pdf", "procesamiento-alimentos", "CPA"),
    ("curriculo-pdc.pdf", "produccion-calzado", "PDC"),
    ("curriculo-FIP-mi.pdf", "mecanica-industrial", "MI"),
    ("3.-Modulos-Formativos-de-la-FIP-Ciencia-de-Datos.pdf", "ciencia-datos", "CD"),
    ("3.-Modulos-Formativos-de-la-FIP-Desarrollo-de-Software.pdf", "desarrollo-software", "DS"),
    ("3-Modulos-Formativos-de-la-FIP-Redes-y-Telecomunicaciones.pdf", "redes-telecomunicaciones", "RT"),
    ("3.-Modulos-Formativos-FIP-Seguridad-Informatica.pdf", "seguridad-informatica", "SI"),
    ("3.-Modulos-Formativos-de-la-FIP-Soporte-Informatico.pdf", "soporte-informatico", "SOP"),
    ("Modulos-Formativos-de-la-FIP-Gestion-Turistica.pdf", "gestion-turistica", "GT"),
    ("Modulos-Formativos-de-la-FIP-Hosteleria-y-Arte-Culinario.pdf", "hosteleria-culinario", "HAC"),
    ("3Modulos-Formativos-de-la-FIP-API.pdf", "primera-infancia", "API"),
    ("3.-Modulos-Formativos-de-la-FIP-Seguridad-Ciudadana.pdf", "seguridad-ciudadana", "SC"),
    ("3.-Modulos-Formativos-de-la-FIP-Asistencia-y-Cuidado-a-Grupos-Prioritarios.pdf", "grupos-prioritarios", "GP"),
    ("curriculo-FIP-ag.pdf", "artes-plasticas", "APL"),
    ("3modulos-formativos-de-la-FIP-aesges.pdf", "artes-escenicas", "AESC"),
    ("curriculo-FIP-mg.pdf", "musica", "MUS"),
    ("Modulos-Formativos-de-la-FIP-Diseno-de-Modas.pdf", "diseno-modas", "DM"),
    ("Modulos-Formativos-de-la-FIP-Diseno-Grafico-y-Multimedia.pdf", "diseno-grafico", "DG"),
]


if __name__ == "__main__":
    # python scripts/bt/figuras.py <carpeta_pdfs> <carpeta_salida>
    import json
    import os
    import sys

    from extraer_modulos import extraer

    origen, destino = sys.argv[1], sys.argv[2]
    os.makedirs(destino, exist_ok=True)
    for pdf, figura, sigla in FIGURAS:
        res = extraer(os.path.join(origen, pdf))
        res.update(figura=figura, sigla=sigla, fuente=pdf)
        with open(os.path.join(destino, f"{figura}.json"), "w", encoding="utf-8") as f:
            json.dump(res, f, ensure_ascii=False, indent=1)
        n_ra = sum(len(m["ra"]) for m in res["modulos"])
        n_ce = sum(len(r["ce"]) for m in res["modulos"] for r in m["ra"])
        print(f"{figura:28} mod={len(res['modulos']):2} RA={n_ra:3} CE={n_ce:4} obj={'si' if res['objetivoGeneral'] else 'NO'}")
