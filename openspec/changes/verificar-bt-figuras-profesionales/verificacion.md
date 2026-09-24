# Informe de verificación — módulos formativos BT

Generado por `scripts/bt/informe.py` a partir de los PDF oficiales de la carpeta
`planificadoc/figuras profecionales` (extractor `scripts/bt/extraer_modulos.py`).

## Resumen

- Figuras verificadas contra su PDF: **31** de 34.
- Módulos oficiales: **274** · RA: **1126** · CE: **4054**.
- Fidelidad del texto (objetivos, UC, RA, CE): **5847** textos; 5818 aparecen literalmente en el PDF, 25 aparecen en 2-3 tramos (celda de tabla partida entre filas o páginas) y 4 requirieron revisión manual (ver abajo).
- Los módulos anteriores (sin respaldo documental) quedan como `historico`: siguen
  resolviendo planes guardados y no se ofrecen para planes nuevos.

## Figuras sin PDF de módulos formativos

- `climatizacion`: se conserva la transcripción previa (fuente `docs/bt-modulos-formativos/txt/cli.txt`).
- `actividad-fisica`: se conserva la transcripción previa; 5 módulos siguen `pendiente`.
- `gestion-deportiva`: sin fuente; sus 3 módulos quedan `pendiente` (sin RA/CE).
- `construcciones-metalicas`: figura deprecada, sin cambios.

## Por figura

| Figura | Sigla | PDF | Módulos | RA | CE | Estado |
|---|---|---|---|---|---|---|
| `gestion-administrativa` | GAL | curriculo-FIP-al.pdf | 7 | 28 | 98 | OK |
| `gestion-financiera` | GFC | curriculo-FIP-gestion-financiera-contable.pdf | 9 | 40 | 132 | ver notas |
| `recursos-hidrobiologicos` | MRH | curriculo-mrh.pdf | 9 | 36 | 130 | OK |
| `produccion-agropecuaria` | PAS | curriculo-pas.pdf | 9 | 34 | 129 | OK |
| `areas-protegidas` | CMA | curriculo-cma.pdf | 9 | 32 | 127 | ver notas |
| `gestion-ambiental` | GADS | curriculo-gads.pdf | 8 | 30 | 116 | OK |
| `obra-civil` | OC | curriculo-FIP-construccion-oc.pdf | 9 | 35 | 120 | OK |
| `instalaciones-electricas` | IEA | curriculo-FIP-iea.pdf | 10 | 41 | 158 | OK |
| `electromecanica-industrial` | ECLI | curriculo-fip-ecli.pdf | 8 | 34 | 128 | OK |
| `electromecanica-automotriz` | EMA | curriculo-FIP-ema.pdf | 8 | 34 | 128 | OK |
| `electronica` | ELEC | curriculo-elec.pdf | 9 | 40 | 152 | OK |
| `fabricacion-madera` | FM | 3modulos-formativos-fem.pdf | 8 | 40 | 130 | OK |
| `mecatronica` | ME | curriculo-FP-me.pdf | 9 | 38 | 140 | OK |
| `procesamiento-alimentos` | CPA | 3modulos-formativos-conservacion-y-procesamiento-de-alimentos.pdf | 10 | 47 | 165 | ver notas |
| `produccion-calzado` | PDC | curriculo-pdc.pdf | 9 | 38 | 145 | OK |
| `mecanica-industrial` | MI | curriculo-FIP-mi.pdf | 9 | 38 | 143 | ver notas |
| `ciencia-datos` | CD | 3.-Modulos-Formativos-de-la-FIP-Ciencia-de-Datos.pdf | 9 | 42 | 166 | OK |
| `desarrollo-software` | DS | 3.-Modulos-Formativos-de-la-FIP-Desarrollo-de-Software.pdf | 9 | 42 | 163 | OK |
| `redes-telecomunicaciones` | RT | 3-Modulos-Formativos-de-la-FIP-Redes-y-Telecomunicaciones.pdf | 9 | 39 | 145 | OK |
| `seguridad-informatica` | SI | 3.-Modulos-Formativos-FIP-Seguridad-Informatica.pdf | 10 | 50 | 190 | ver notas |
| `soporte-informatico` | SOP | 3.-Modulos-Formativos-de-la-FIP-Soporte-Informatico.pdf | 9 | 40 | 143 | OK |
| `gestion-turistica` | GT | Modulos-Formativos-de-la-FIP-Gestion-Turistica.pdf | 9 | 36 | 131 | ver notas |
| `hosteleria-culinario` | HAC | Modulos-Formativos-de-la-FIP-Hosteleria-y-Arte-Culinario.pdf | 9 | 36 | 135 | ver notas |
| `primera-infancia` | API | 3Modulos-Formativos-de-la-FIP-API.pdf | 9 | 35 | 107 | OK |
| `seguridad-ciudadana` | SC | 3.-Modulos-Formativos-de-la-FIP-Seguridad-Ciudadana.pdf | 8 | 30 | 94 | OK |
| `grupos-prioritarios` | GP | 3.-Modulos-Formativos-de-la-FIP-Asistencia-y-Cuidado-a-Grupos-Prioritarios.pdf | 8 | 30 | 100 | OK |
| `artes-plasticas` | APL | curriculo-FIP-ag.pdf | 8 | 25 | 75 | OK |
| `artes-escenicas` | AESC | 3modulos-formativos-de-la-FIP-aesges.pdf | 9 | 33 | 115 | OK |
| `musica` | MUS | curriculo-FIP-mg.pdf | 10 | 31 | 93 | OK |
| `diseno-modas` | DM | Modulos-Formativos-de-la-FIP-Diseno-de-Modas.pdf | 9 | 36 | 128 | OK |
| `diseno-grafico` | DG | Modulos-Formativos-de-la-FIP-Diseno-Grafico-y-Multimedia.pdf | 9 | 36 | 128 | OK |

## Incidencias del documento fuente

Numeración irregular en el propio PDF. Se conserva la etiqueta original; cada CE se
asigna al RA bajo el que aparece (o a la fila de la tabla, en el práctico):

- `gestion-financiera` M5 «Financiamiento e Inversión»: ['aviso: CE1.1 bajo RA2', 'aviso: CE1.2 bajo RA2', 'aviso: CE1.3 bajo RA2', 'aviso: CE1.4 bajo RA2']
- `areas-protegidas` M4 «Conservación de Áreas Protegidas»: ['aviso: CE3.4 bajo RA4']
- `areas-protegidas` M9 «Practico Experimental»: ['aviso: CE1.1 en la fila del RA2', 'aviso: CE1.2 en la fila del RA2']
- `procesamiento-alimentos` M9 «Procesamiento de Frutas y Verduras»: ['aviso: CE4.4 bajo RA3']
- `procesamiento-alimentos` M10 «Práctico Experimental»: ['aviso: CE3.1 en la fila del RA4', 'aviso: CE3.2 en la fila del RA4']
- `mecanica-industrial` M5 «Cálculo Mecánico y Estructural»: ['aviso: CE4.1 bajo RA3', 'aviso: CE4.2 bajo RA3', 'aviso: CE4.3 bajo RA3', 'aviso: CE4.4 bajo RA3']
- `seguridad-informatica` M4 «Fundamentos de Seguridad Informática»: ['aviso: CE2.3 bajo RA3']
- `seguridad-informatica` M5 «Manejo de Incidentes y Recuperación Info»: ['aviso: CE4.3 bajo RA3', 'aviso: CE4.4 bajo RA3']
- `seguridad-informatica` M10 «Practico Experimental»: ['aviso: CE7.1 en la fila del RA4', 'aviso: CE7.2 en la fila del RA4', 'aviso: CE7.3 en la fila del RA4']
- `gestion-turistica` M5 «Técnicas de Guianza»: ['aviso: CE1.1 bajo RA2', 'aviso: CE1.2 bajo RA2', 'aviso: CE1.3 bajo RA2', 'aviso: CE1.4 bajo RA2', 'aviso: CE1.5 bajo RA2']
- `hosteleria-culinario` M5 «Técnicas Culinarias»: ['aviso: CE1.1 bajo RA2', 'aviso: CE1.2 bajo RA2', 'aviso: CE1.3 bajo RA2', 'aviso: CE1.4 bajo RA2']

## Textos revisados manualmente

Solo el final de la frase queda separado en el PDF (celda partida por el salto de fila);
se comprobó a mano contra el texto del PDF que la transcripción es completa:

- `procesamiento-alimentos` M10 CE3.1: Utiliza equipos e insumos respetando normativa de calidad e inocuidad.
- `ciencia-datos` M9 CE3.3: Comunicar hallazgos en informes técnicos aplicando principios de ética y responsabilidad.
- `diseno-modas` M9 RA2: Elaborar patrones básicos y transformados para diferentes tipos de prendas.
- `diseno-modas` M9 CE2.1: Dibuja patrones base aplicando proporciones y medidas correctas.

## Auditoría de consumidores (tarea 1.3)

- Filtran módulos `historico` (selección para planes nuevos): `app/planificar-bt/[figuraId].tsx`
  (`obtenerModulosSeleccionables`), `app/conecta-nivela-crea/index.tsx` (selector de módulo) y
  `app/bachillerato-tecnico.tsx` (conteo de módulos).
- Resuelven por código y siguen encontrando los históricos (sin cambios): `lib/planificaciones-bt-context.tsx`,
  `app/conecta-nivela-crea/index.tsx` (módulo del plan), `app/ver-cnc/[id].tsx`, `server/cnc-router.ts`,
  `lib/cnc-word-generator.ts`, `lib/pdf-generator.ts`.
