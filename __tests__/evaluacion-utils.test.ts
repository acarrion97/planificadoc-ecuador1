import { describe, it, expect } from "vitest";
import {
  UMBRALES_DEFECTO,
  clasificarAprendizaje,
  calcularResultadoEstudiante,
  calcularBrechasCurso,
  generarRecomendaciones,
  subnivelDesdeGrado,
  esBachilleratoTecnico,
  origenDeDcd,
  agruparBrechasPorOrigen,
} from "../lib/evaluacion-utils";
import { resolverPrerrequisito } from "../lib/curriculo-prerrequisitos";
import type {
  EvaluacionDiagnostica,
  PreguntaDiagnostica,
} from "../data/types-evaluacion";

function pregunta(overrides: Partial<PreguntaDiagnostica> & { id: string; dcdCodigo: string }): PreguntaDiagnostica {
  return {
    enunciado: "Pregunta",
    tipo: "opcion_multiple",
    dificultad: "basica",
    puntaje: 1,
    indicador: "I.1",
    opciones: [
      { id: "a", texto: "Opción A", esCorrecta: true },
      { id: "b", texto: "Opción B", esCorrecta: false },
    ],
    activa: true,
    ...overrides,
  };
}

function evaluacionBasica(overrides: Partial<EvaluacionDiagnostica> = {}): EvaluacionDiagnostica {
  return {
    id: "ev-1",
    nombre: "Diagnóstico inicial",
    anioLectivo: "2026-2027",
    area: "M",
    subnivel: 2,
    grado: "3ro",
    paralelo: "A",
    asignatura: "Matemática",
    fecha: "2026-09-01",
    duracionMinutos: 30,
    instrucciones: "",
    puntajeTotal: 4,
    dcdsEvaluadas: [
      { codigo: "M.2.1.1", descripcion: "Representar conjuntos", indicadores: ["I.M.2.1.1."] },
      { codigo: "M.2.1.2", descripcion: "Reproducir patrones", indicadores: ["I.M.2.1.2."] },
    ],
    preguntas: [
      pregunta({ id: "p1", dcdCodigo: "M.2.1.1" }),
      pregunta({ id: "p2", dcdCodigo: "M.2.1.1" }),
      pregunta({ id: "p3", dcdCodigo: "M.2.1.2" }),
      pregunta({ id: "p4", dcdCodigo: "M.2.1.2" }),
    ],
    estudiantes: [
      { id: "s1", codigo: "E01", incluirEnReportes: true },
      { id: "s2", codigo: "E02", incluirEnReportes: true },
    ],
    resultados: [],
    umbrales: { ...UMBRALES_DEFECTO },
    status: "aplicada",
    createdAt: "2026-09-01T10:00:00Z",
    updatedAt: "2026-09-01T10:00:00Z",
    ...overrides,
  };
}

describe("clasificarAprendizaje", () => {
  it("clasifica con umbrales por defecto (70/40)", () => {
    expect(clasificarAprendizaje(80, UMBRALES_DEFECTO)).toBe("dominado");
    expect(clasificarAprendizaje(70, UMBRALES_DEFECTO)).toBe("dominado");
    expect(clasificarAprendizaje(55, UMBRALES_DEFECTO)).toBe("en_proceso");
    expect(clasificarAprendizaje(40, UMBRALES_DEFECTO)).toBe("en_proceso");
    expect(clasificarAprendizaje(39, UMBRALES_DEFECTO)).toBe("requiere_refuerzo");
    expect(clasificarAprendizaje(0, UMBRALES_DEFECTO)).toBe("requiere_refuerzo");
  });

  it("clasifica con umbrales personalizados", () => {
    const umbrales = { dominadoMin: 80, refuerzoMax: 50 };
    expect(clasificarAprendizaje(75, umbrales)).toBe("en_proceso");
    expect(clasificarAprendizaje(80, umbrales)).toBe("dominado");
    expect(clasificarAprendizaje(49, umbrales)).toBe("requiere_refuerzo");
  });
});

describe("calcularResultadoEstudiante", () => {
  it("calcula puntaje, porcentaje y conteos de un estudiante", () => {
    const ev = evaluacionBasica();
    const resultado = {
      estudianteId: "s1",
      intentoPermitido: false,
      respuestas: [
        { preguntaId: "p1", respuesta: "a", correcta: true },
        { preguntaId: "p2", respuesta: "b", correcta: false },
      ],
    };
    const r = calcularResultadoEstudiante(ev, resultado);
    expect(r.puntaje).toBe(1);
    expect(r.puntajeMaximo).toBe(4);
    expect(r.porcentaje).toBe(25);
    expect(r.correctas).toBe(1);
    expect(r.incorrectas).toBe(1);
    expect(r.sinResponder).toBe(2);
  });

  it("calcula tiempo empleado desde inicio/fin", () => {
    const ev = evaluacionBasica();
    const resultado = {
      estudianteId: "s1",
      intentoPermitido: false,
      inicio: "2026-09-01T10:00:00Z",
      fin: "2026-09-01T10:05:30Z",
      respuestas: [],
    };
    const r = calcularResultadoEstudiante(ev, resultado);
    expect(r.tiempoEmpleado).toBe(330);
  });

  it("desglosa por DCD con % de logro (sin responder cuenta como incorrecta)", () => {
    const ev = evaluacionBasica();
    const resultado = {
      estudianteId: "s1",
      intentoPermitido: false,
      respuestas: [{ preguntaId: "p1", respuesta: "a", correcta: true }],
    };
    const r = calcularResultadoEstudiante(ev, resultado);
    const dcd1 = r.porDcd.find((d) => d.dcdCodigo === "M.2.1.1")!;
    const dcd2 = r.porDcd.find((d) => d.dcdCodigo === "M.2.1.2")!;
    expect(dcd1.porcentajeLogro).toBe(50); // 1 de 2
    expect(dcd1.estado).toBe("en_proceso");
    expect(dcd1.correctas).toBe(1);
    expect(dcd1.incorrectas).toBe(0);
    expect(dcd1.sinResponder).toBe(1);
    expect(dcd2.porcentajeLogro).toBe(0); // sin responder
    expect(dcd2.estado).toBe("requiere_refuerzo");
  });

  it("DCD sin preguntas respondidas → 🔴 0% de logro", () => {
    const ev = evaluacionBasica();
    const resultado = {
      estudianteId: "s1",
      intentoPermitido: false,
      respuestas: [],
    };
    const r = calcularResultadoEstudiante(ev, resultado);
    expect(r.porcentaje).toBe(0);
    for (const d of r.porDcd) {
      expect(d.porcentajeLogro).toBe(0);
      expect(d.estado).toBe("requiere_refuerzo");
    }
  });
});

describe("calcularBrechasCurso", () => {
  it("agrega resultados de múltiples estudiantes por DCD", () => {
    const ev = evaluacionBasica({
      resultados: [
        {
          estudianteId: "s1",
          intentoPermitido: false,
          respuestas: [
            { preguntaId: "p1", respuesta: "a", correcta: true },
            { preguntaId: "p2", respuesta: "a", correcta: true },
            { preguntaId: "p3", respuesta: "a", correcta: true },
            { preguntaId: "p4", respuesta: "a", correcta: true },
          ],
        },
        {
          estudianteId: "s2",
          intentoPermitido: false,
          respuestas: [
            { preguntaId: "p1", respuesta: "b", correcta: false },
            { preguntaId: "p2", respuesta: "b", correcta: false },
            { preguntaId: "p3", respuesta: "b", correcta: false },
            { preguntaId: "p4", respuesta: "b", correcta: false },
          ],
        },
      ],
    });
    const brechas = calcularBrechasCurso(ev);
    const dcd1 = brechas.find((b) => b.dcdCodigo === "M.2.1.1")!;
    expect(dcd1.totalEstudiantes).toBe(2);
    expect(dcd1.dominado).toBe(1);
    expect(dcd1.requiereRefuerzo).toBe(1);
    expect(dcd1.porcentajeDominio).toBe(50);
    expect(dcd1.porcentajeDificultad).toBe(50);
    expect(brechas).toHaveLength(2);
  });
});

describe("generarRecomendaciones", () => {
  it("genera recomendación anclada para DCD en refuerzo, priorizada", () => {
    const ev = evaluacionBasica({
      resultados: [
        {
          estudianteId: "s1",
          intentoPermitido: false,
          respuestas: [
            { preguntaId: "p1", respuesta: "b", correcta: false },
            { preguntaId: "p2", respuesta: "b", correcta: false },
            { preguntaId: "p3", respuesta: "a", correcta: true },
            { preguntaId: "p4", respuesta: "a", correcta: true },
          ],
        },
      ],
    });
    const recs = generarRecomendaciones(ev);
    expect(recs.length).toBeGreaterThan(0);
    const rec1 = recs[0];
    expect(rec1.dcdCodigo).toBe("M.2.1.1");
    expect(rec1.texto).toContain("Representar conjuntos");
    expect(rec1.prioridad).toBe(1);
  });

  it("sin brechas → sin recomendaciones", () => {
    const ev = evaluacionBasica({
      resultados: [
        {
          estudianteId: "s1",
          intentoPermitido: false,
          respuestas: [
            { preguntaId: "p1", respuesta: "a", correcta: true },
            { preguntaId: "p2", respuesta: "a", correcta: true },
            { preguntaId: "p3", respuesta: "a", correcta: true },
            { preguntaId: "p4", respuesta: "a", correcta: true },
          ],
        },
      ],
    });
    expect(generarRecomendaciones(ev)).toEqual([]);
  });

  it("sin estudiantes evaluados → sin recomendaciones", () => {
    expect(generarRecomendaciones(evaluacionBasica())).toEqual([]);
  });
});

describe("subnivelDesdeGrado", () => {
  it("mapea grados EGB y BGU al subnivel correcto", () => {
    expect(subnivelDesdeGrado("1.° Grado EGB")).toBe(1);
    expect(subnivelDesdeGrado("2.° EGB")).toBe(2);
    expect(subnivelDesdeGrado("4.° EGB")).toBe(2);
    expect(subnivelDesdeGrado("5.° EGB")).toBe(3);
    expect(subnivelDesdeGrado("7.° EGB")).toBe(3);
    expect(subnivelDesdeGrado("8.° EGB")).toBe(4);
    expect(subnivelDesdeGrado("10.° EGB")).toBe(4);
    expect(subnivelDesdeGrado("1.° BGU")).toBe(5);
    expect(subnivelDesdeGrado("3ro BGU")).toBe(5);
  });

  it("tolera variaciones de formato", () => {
    expect(subnivelDesdeGrado("3ro EGB")).toBe(2);
    expect(subnivelDesdeGrado("8vo EGB")).toBe(4);
    expect(subnivelDesdeGrado("Bachillerato 2")).toBe(5);
  });

  it("no puede inferir sin grado o número", () => {
    expect(subnivelDesdeGrado("")).toBeNull();
    expect(subnivelDesdeGrado("Paralelo A")).toBeNull();
  });
});

describe("Brechas por origen curricular", () => {
  /** Curso de 8.° EGB (subnivel 4) que diagnostica arrastre de Básica Media. */
  function evaluacionMixta(overrides: Partial<EvaluacionDiagnostica> = {}) {
    return evaluacionBasica({
      subnivel: 4,
      grado: "8vo EGB",
      dcdsEvaluadas: [
        { codigo: "M.3.1.1", descripcion: "Arrastre de Básica Media", indicadores: [] },
        { codigo: "M.4.1.1", descripcion: "Del nivel actual", indicadores: [] },
      ],
      preguntas: [
        pregunta({ id: "p1", dcdCodigo: "M.3.1.1" }),
        pregunta({ id: "p2", dcdCodigo: "M.4.1.1" }),
      ],
      estudiantes: [{ id: "s1", codigo: "E01", incluirEnReportes: true }],
      resultados: [
        {
          estudianteId: "s1",
          intentoPermitido: false,
          respuestas: [
            { preguntaId: "p1", respuesta: "b", correcta: false },
            { preguntaId: "p2", respuesta: "b", correcta: false },
          ],
        },
      ],
      ...overrides,
    });
  }

  it("clasifica cada DCD según su subnivel real", () => {
    expect(origenDeDcd("M.3.1.1", 4)).toEqual({ origen: "arrastre", subnivel: 3 });
    expect(origenDeDcd("M.4.1.1", 4)).toEqual({ origen: "nivel_actual", subnivel: 4 });
  });

  it("agrupa brechas mixtas por origen", () => {
    const brechas = calcularBrechasCurso(evaluacionMixta());
    const grupos = agruparBrechasPorOrigen(brechas);

    expect(grupos.agrupar).toBe(true);
    expect(grupos.arrastre.map((b) => b.dcdCodigo)).toEqual(["M.3.1.1"]);
    expect(grupos.nivelActual.map((b) => b.dcdCodigo)).toEqual(["M.4.1.1"]);
    expect(grupos.noDeterminado).toEqual([]);
  });

  it("no agrupa cuando todas las DCD comparten subnivel", () => {
    const brechas = calcularBrechasCurso(
      evaluacionMixta({
        dcdsEvaluadas: [
          { codigo: "M.4.1.1", descripcion: "Del nivel actual", indicadores: [] },
          { codigo: "M.4.1.2", descripcion: "También del nivel actual", indicadores: [] },
        ],
        preguntas: [
          pregunta({ id: "p1", dcdCodigo: "M.4.1.1" }),
          pregunta({ id: "p2", dcdCodigo: "M.4.1.2" }),
        ],
      })
    );
    const grupos = agruparBrechasPorOrigen(brechas);

    expect(grupos.agrupar).toBe(false);
    expect(grupos.arrastre).toEqual([]);
    expect(grupos.nivelActual).toHaveLength(2);
  });

  it("una DCD con código no resoluble queda con origen no determinado", () => {
    const evaluacion = evaluacionMixta({
      dcdsEvaluadas: [
        {
          codigo: "XX.9.9.9",
          descripcion: "Destreza retirada del catálogo",
          indicadores: ["Indicador registrado en su momento"],
        },
      ],
      preguntas: [pregunta({ id: "p1", dcdCodigo: "XX.9.9.9" })],
      resultados: [
        {
          estudianteId: "s1",
          intentoPermitido: false,
          respuestas: [{ preguntaId: "p1", respuesta: "b", correcta: false }],
        },
      ],
    });

    const brechas = calcularBrechasCurso(evaluacion);
    expect(brechas).toHaveLength(1);
    expect(brechas[0].origen).toBe("no_determinado");
    expect(brechas[0].subnivelOrigen).toBeNull();
    // No cae por defecto en "nivel actual"
    expect(brechas[0].origen).not.toBe("nivel_actual");
    // Conserva la descripción registrada y el cálculo de logro sigue siendo válido
    expect(brechas[0].descripcion).toBe("Destreza retirada del catálogo");
    expect(brechas[0].porcentajeDificultad).toBe(100);

    const calculado = calcularResultadoEstudiante(evaluacion, evaluacion.resultados[0]);
    expect(calculado.porDcd[0].porcentajeLogro).toBe(0);
  });

  it("origenDeDcd no inventa subnivel para un código desconocido", () => {
    expect(origenDeDcd("XX.9.9.9", 4)).toEqual({
      origen: "no_determinado",
      subnivel: null,
    });
  });
});

describe("Bachillerato Técnico en el grado", () => {
  const SUBNIVEL_PREPARATORIA = 1;
  const SUBNIVEL_BACHILLERATO = 5;

  it("reconoce la forma extendida", () => {
    expect(subnivelDesdeGrado("1ro Bachillerato Técnico")).toBe(SUBNIVEL_BACHILLERATO);
    expect(subnivelDesdeGrado("2do Bachillerato Tecnico")).toBe(SUBNIVEL_BACHILLERATO);
    expect(esBachilleratoTecnico("3ro Bachillerato Técnico")).toBe(true);
  });

  it("reconoce la abreviatura que usa la app", () => {
    expect(subnivelDesdeGrado("1ro BT")).toBe(SUBNIVEL_BACHILLERATO);
    expect(subnivelDesdeGrado("2do BT")).toBe(SUBNIVEL_BACHILLERATO);
    expect(subnivelDesdeGrado("3ro B.T.")).toBe(SUBNIVEL_BACHILLERATO);
    expect(subnivelDesdeGrado("BT 1")).toBe(SUBNIVEL_BACHILLERATO);
  });

  it("nunca deriva a Preparatoria", () => {
    for (const grado of ["1ro BT", "2do BT", "3ro BT", "1ro B.T.", "BT 1"]) {
      expect(subnivelDesdeGrado(grado)).not.toBe(SUBNIVEL_PREPARATORIA);
    }
  });

  it("un curso de BT sí tiene nivel prerrequisito: no dispara el aviso de ausencia", () => {
    // El aviso "sin nivel prerrequisito definido" se muestra cuando el
    // resolvedor devuelve null. Con BT bien reconocido, un área de formación
    // general resuelve normalmente.
    const subnivel = subnivelDesdeGrado("1ro BT");
    expect(subnivel).not.toBeNull();
    expect(resolverPrerrequisito("LL", subnivel!)).toEqual({ area: "LL", subnivel: 4 });
    expect(resolverPrerrequisito("M", subnivel!)).toEqual({ area: "M", subnivel: 4 });
    expect(resolverPrerrequisito("CN.F", subnivel!)).toEqual({ area: "CN", subnivel: 4 });
  });

  it("distingue la modalidad BT de un grado corriente", () => {
    expect(esBachilleratoTecnico("1ro BT")).toBe(true);
    expect(esBachilleratoTecnico("1ro BGU")).toBe(false);
    expect(esBachilleratoTecnico("8vo EGB")).toBe(false);
    expect(esBachilleratoTecnico("")).toBe(false);
  });

  it("no altera el parseo de grados que no son BT", () => {
    expect(subnivelDesdeGrado("8vo EGB")).toBe(4);
    expect(subnivelDesdeGrado("1.° BGU")).toBe(5);
    expect(subnivelDesdeGrado("Paralelo A")).toBeNull();
  });
});