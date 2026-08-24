# Traspaso: Carga de catálogos oficiales de módulos formativos BT

> Estado guardado para continuar en otra máquina. Fecha: 2026-08-24.

## Objetivo

Transcribir los catálogos oficiales de **módulos formativos** de las 34 figuras
profesionales de Bachillerato Técnico (documentos "Módulos Formativos de la FIP"
del Acuerdo Ministerial 00065-A, MinEduc) al archivo `data/bachillerato-tecnico.ts`,
completando los campos de `ModuloFormativoBTExtras` con fidelidad total al documento
oficial (sin fabricar contenido).

## Fuentes oficiales

- Página fuente: https://educacion.gob.ec/BACHILLERATO-TECNICO/ → sección
  "Currículo Acuerdo Ministerial 00065-A" → "Módulos formativos de la FIP".
- Lista completa de 34 URLs: `urls-fuentes-oficiales.txt` (formato `sigla|url`).
- PDFs ya descargados y textos extraídos en este repo:
  - `txt/<sigla>.txt` — extraídos con `pdftotext -layout curriculo.pdf <sigla>.txt`.
- Para regenerar en otra máquina:
  ```bash
  mkdir -p /tmp/opencode/bt-curriculos && cd /tmp/opencode/bt-curriculos
  while IFS='|' read -r sigla url; do curl -sL -o "$sigla.pdf" "$url"; done < urls-fuentes-oficiales.txt
  for p in *.pdf; do pdftotext -layout "$p" "txt/${p%.pdf}.txt"; done
  ```

## Mapeo definitivo sigla ↔ figura id (resuelto 34/34)

| Sigla | Figura id en app | Título oficial |
|---|---|---|
| gal | gestion-administrativa | Gestión Administrativa y Logística |
| gfc | gestion-financiera | Gestión Financiera y Contable |
| mrh | recursos-hidrobiologicos | Manejo de Recursos Hidrobiológicos |
| pas | produccion-agropecuaria | Producción Agropecuaria Sostenible |
| cma | areas-protegidas | Conservación y Manejo de Áreas Protegidas |
| gads | gestion-ambiental | Gestión Ambiental y Desarrollo Sostenible |
| cli | climatizacion | Climatización |
| oc | obra-civil | Construcción de Obra Civil |
| iea | instalaciones-electricas | Instalaciones Eléctricas y Automatización |
| ema | electromecanica-automotriz | Electromecánica Automotriz |
| ecli | electromecanica-industrial | Electromecánica Industrial |
| elec | electronica | Electrónica |
| fm | fabricacion-madera | Fabricación de Muebles de Madera |
| me | mecatronica | Mecatrónica |
| cpa | procesamiento-alimentos | Conservación y Procesamiento de Alimentos |
| pdc | produccion-calzado | Producción de Calzado |
| mi | mecanica-industrial | Mecánica Industrial |
| cd | ciencia-datos | Ciencia de Datos |
| ds | desarrollo-software | Desarrollo de Software |
| rt | redes-telecomunicaciones | Redes y Telecomunicaciones |
| si | seguridad-informatica | Seguridad Informática |
| sop | soporte-informatico | Soporte Informático |
| gt | gestion-turistica | Gestión Turística |
| hac | hosteleria-culinario | Hostelería y Arte Culinario |
| afdr | actividad-fisica | Actividad Física, Deporte y Recreación |
| gdc | gestion-deportiva | Gestión Deportiva y Cultural |
| api | primera-infancia | Atención a la Primera Infancia |
| sc | seguridad-ciudadana | Seguridad Ciudadana |
| gp | grupos-prioritarios | Asistencia y Cuidado a Grupos Prioritarios |
| apl | artes-plasticas | Artes Plásticas y Gestión Cultural |
| aesc | artes-escenicas | Artes Escénicas y Gestión Cultural |
| mus | musica | Música y Gestión Cultural |
| dm | diseno-modas | Diseño de Modas |
| dg | diseno-grafico | Diseño Gráfico y Multimedia |

La figura deprecada `construcciones-metalicas` no tiene documento (correcto).

## Estructura del documento oficial (patrón verificado, ej. cli.txt)

1. Objetivo general de la figura.
2. **Plan de estudios (malla)**: tabla con periodos por año (1ro/2do/3ro) por módulo.
3. **Módulos Genéricos de la Familia Profesional** (3, compartidos entre figuras de la familia):
   - Industrial: Seguridad Industrial (2+2), Procesos Industriales Sostenibles (2+2), Dibujo Técnico Aplicado (4+2).
4. **Módulos de Especialización** (4–6 propios de la figura), cada uno con:
   - Nombre del módulo, Nivel (ej. "1ro, 2do"), Duración total en periodos pedagógicos,
   - Unidad de competencia asociada (UC, texto),
   - Objetivo del módulo,
   - **RA + CE**: Resultados de Aprendizaje (3–4 por módulo) con 3–4 Criterios de Evaluación c/u,
   - Contenidos (conceptuales / procedimentales / actitudinales),
   - Perfil del o la docente,
   - Orientaciones Metodológicas (ABP, Contextos Reales, Role-Playing, STEAM),
   - Requisitos de infraestructura/equipamiento + Referencias bibliográficas.
5. **Módulo Práctico Experimental** (nivel 1ro-3ro, ~320 periodos): tabla RA | CE | Actividades Prácticas Experimentales.
6. Nota de flexibilidad curricular.

## Decisiones tomadas

1. **Estrategia híbrida de códigos** (aprobada por el usuario):
   - Los módulos existentes en la app (ej. CL.1.1 "Fundamentos de Refrigeración") son genéricos/inventados;
     solo se conservan cuando hay correspondencia directa con un módulo oficial.
   - Los módulos oficiales sin contraparte se agregan con **código nuevo** prefijo oficial
     (ej. CLI.x.x). No borrar códigos históricos (los planes guardados los referencian).
   - Módulos existentes sin correspondencia oficial quedan `estadoCatalogo: "pendiente"`
     (no fabricar contenido).
2. **Formato TS** (patrón AFDR ya implementado en `data/bachillerato-tecnico.ts:408-455`):

```ts
{
  codigo: "CLI.1.1",
  nombre: "Seguridad Industrial",           // nombre OFICIAL del documento
  descripcion: "...",                        // 1 línea del objetivo
  anio: 1,                                   // primer año del nivel del módulo
  categoria: "generico" | "especializacion" | "practico",
  estadoCatalogo: "completo",
  nivel: "1ro y 2do",                        // texto oficial del campo Nivel
  duracionPeriodos: { 1: 2, 2: 2, 3: null }, // periodos semanales según malla oficial
  objetivoModulo: "Objetivo del módulo (texto íntegro)",
  resultadosAprendizaje: [
    {
      id: "CLI-RA.1",                        // `${SIGLA}-RA.${n}`
      texto: "RA1: ...",
      criteriosEvaluacion: [
        { id: "CLI-CE1.1", texto: "CE1.1: ..." },  // `${SIGLA}-CE${n}.${m}`
      ],
    },
  ],
  contenidos: { conceptuales: [...], procedimentales: [...], actitudinales: [...] },
  perfilDocente: "...",
  orientacionesMetodologicas: ["ABP", "Contextos Reales", "Role-Playing", "STEAM"],
}
```

3. **Campos disponibles** en `data/types-bt.ts` (`ModuloFormativoBTExtras`, todos opcionales):
   `resultadosAprendizaje`, `estadoCatalogo` ("completo"|"pendiente"), `categoria`,
   `nivel`, `duracionPeriodos`, `objetivoModulo`, `objetivoPorAnio`, `contenidos`,
   `perfilDocente`, `orientacionesMetodologicas`. También existe `UnidadCompetencia`
   y `ElementoCompetencia`/`CriterioDesempeno` (EC/CD viven en docs de perfil profesional,
   NO en los docs de módulos; los docs de módulos usan UC asociada como texto).
4. `tieneCatalogoCompleto()` = `estadoCatalogo==="completo"` && (RA o UC presentes).
5. Invariante: IDs estables para planes históricos; nunca inventar contenido oficial.

## Estado actual

- [x] Fuentes localizadas y descargadas (34 PDFs OK).
- [x] Textos extraídos (`txt/*.txt`, 34 archivos, ~4.3 MB).
- [x] Estructura oficial analizada (patrón completo leído en cli.txt, 1955 líneas).
- [x] Mapeo sigla↔figura resuelto (tabla arriba).
- [x] Estrategia híbrida y formato TS aprobados.
- [x] AFDR parcialmente transcrito (8 módulos, algunos con RA; UC solo 1/2/4) — revisar contra afdr.txt.
- [x] ~116 módulos existentes sin RA; UCs solo cubren 2 módulos.
- [ ] **PENDIENTE: transcripción figura por figura** (~7-10 módulos oficiales × 34 figuras ≈ 290 módulos).
- [ ] Verificación de cobertura (script/tests) y commit final.

## Orden de trabajo sugerido

1. **Climatización (cli)** como piloto — es la figura más leída (cli.txt completo).
   Malla: Seguridad Industrial 2+2, Procesos Industriales Sostenibles 2+2, Dibujo Técnico Aplicado 4+2,
   Instalación de Sistemas de Climatización y Refrigeración 4+3+3, Montaje de Sistemas 3+3+3,
   Mantenimiento Técnico de Sistemas Térmicos 4+3+3, Ahorro Energético 2+(4?), Proyectos 240p, Práctico Exp. 320p.
2. Resto de familia Industrial (oc, iea, ecli, elec, ema, fm, me, mi, cpa, pdc).
3. Familias restantes por orden del data file.

## Notas de transcripción

- El texto PDF tiene saltos de columna/linea irregulares (pdftotext -layout); unir palabras cortadas.
- Algunas tablas RA|CE|Actividades se desalinean; leer con contexto amplio.
- Conteos aproximados de RA/CE por figura (grep orientativo, verificar siempre):
  aesc m=6 RA~18 CE~59 · afdr m=6 · api m=9 · apl m=6 · cd m=9 · cli m=6 · cma m=9 ·
  cpa m=10 · dg m=9 · dm m=9 · ds m=9 · ecli m=6 · elec m=8 · ema m=6 · fm m=7 ·
  gads m=8 · gal m=6 · gdc m=9 · gfc m=7 · gp m=8 · gt m=9 · hac m=8 · iea m=8 ·
  me m=8 · mi m=8 · mrh m=8 · mus m=6 · oc m=9 · pas m=8 · pdc m=8 · rt m=9 ·
  sc m=8 · si m=6 · sop m=9  (m = bloques "Nombre del módulo:")
- Tests de regresión existentes: `__tests__/catalogo-bt.test.ts` (34 activas + 1 deprecada,
  suma por familia = 34). Correr con `pnpm test __tests__/catalogo-bt.test.ts`.
