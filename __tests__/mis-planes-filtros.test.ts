/**
 * Filtros por tipo y duplicación de "Mis planes" (tarea 4.10).
 *
 *  - Los filtros derivan del estado EXISTENTE (design D5): los tipos sin
 *    estado (plan diario, semanal, BT) nunca aparecen en "En progreso" ni
 *    "Completados", pero sí en "Todos" y "Recientes".
 *  - La duplicación entrega un id nuevo con el mismo contenido y deja el
 *    original intacto (spec `mis-planes-gestion`).
 */
import { describe, expect, it } from "vitest";

import {
  duplicarRegistro,
  estadoDe,
  filtrarPlanes,
  formatoFecha,
  normalizarFecha,
  ordenarPlanes,
  resumenBt,
  resumenCnc,
  resumenCxc,
  resumenDiario,
  resumenEvaluacion,
  resumenPca,
  resumenProyecto,
  resumenSemanal,
  rutaEdicionCxc,
  VENTANA_RECIENTES_DIAS,
  type FiltroPlanes,
  type PlanResumen,
} from "../lib/mis-planes";
import type { Planificacion } from "../data/types";
import type { PlanUnidadTrabajoBT } from "../data/types-bt";

// ─── Helpers ──────────────────────────────────────────────────────────────

const haceDias = (dias: number): string =>
  new Date(Date.now() - dias * 24 * 60 * 60 * 1000).toISOString();

function resumen(parcial: Partial<PlanResumen>): PlanResumen {
  return {
    key: "x:1",
    id: 1,
    tipo: "diario",
    tipoLabel: "Plan diario",
    titulo: "Título",
    detalle: "Detalle",
    actualizadoEn: haceDias(0),
    estado: null,
    rutaContinuar: "/ver-plan/1",
    rutaEditar: null,
    ...parcial,
  };
}

/** Los 8 tipos con/sin estado representativos, con fechas mezcladas. */
function fixtureLista(): PlanResumen[] {
  return [
    resumen({ key: "diario:1", tipo: "diario", actualizadoEn: haceDias(60) }),
    resumen({ key: "semanal:1", tipo: "semanal", actualizadoEn: haceDias(2) }),
    resumen({ key: "bt:1", tipo: "bt", actualizadoEn: haceDias(1) }),
    resumen({
      key: "pca:1",
      tipo: "pca",
      actualizadoEn: haceDias(3),
      estado: { label: "Borrador", categoria: "progreso" },
    }),
    resumen({
      key: "pct:1",
      tipo: "pct",
      actualizadoEn: haceDias(40),
      estado: { label: "Pagada", categoria: "completado" },
    }),
    resumen({
      key: "cnc:1",
      tipo: "cnc",
      actualizadoEn: haceDias(5),
      estado: { label: "Generado", categoria: "completado" },
    }),
    resumen({
      key: "proyecto:1",
      tipo: "proyecto",
      actualizadoEn: haceDias(4),
      estado: { label: "Borrador", categoria: "progreso" },
    }),
    resumen({
      key: "evaluacion:1",
      tipo: "evaluacion",
      actualizadoEn: haceDias(6),
      estado: { label: "Analizada", categoria: "completado" },
    }),
  ];
}

const claves = (planes: PlanResumen[]): string[] => ordenarPlanes(planes).map((p) => p.key);

// ─── Filtros (tareas 4.3 y 4.4) ───────────────────────────────────────────

describe("filtros de Mis planes por tipo (4.3/4.4)", () => {
  it("Todos lista todos los tipos ordenados del más reciente al más antiguo", () => {
    const todos = filtrarPlanes(fixtureLista(), "todos");
    expect(todos).toHaveLength(8);
    expect(new Set(todos.map((p) => p.tipo)).size).toBe(8);
    const fechas = todos.map((p) => p.actualizadoEn);
    expect(fechas).toEqual([...fechas].sort().reverse());
  });

  it("Recientes limita la ventana a 30 días para cualquier tipo", () => {
    const recientes = filtrarPlanes(fixtureLista(), "recientes");
    expect(claves(recientes)).toEqual([
      "bt:1", // 1 día
      "semanal:1", // 2
      "pca:1", // 3
      "proyecto:1", // 4
      "cnc:1", // 5
      "evaluacion:1", // 6
    ]);
    // Fuera de la ventana: 40 y 60 días.
    expect(recientes.map((p) => p.key)).not.toContain("diario:1");
    expect(recientes.map((p) => p.key)).not.toContain("pct:1");
    expect(VENTANA_RECIENTES_DIAS).toBe(30);
  });

  it("En progreso muestra solo los estados draft/borrador", () => {
    const progreso = filtrarPlanes(fixtureLista(), "progreso");
    expect(claves(progreso)).toEqual(["pca:1", "proyecto:1"]);
  });

  it("Completados muestra los estados terminados de todo tipo", () => {
    const completados = filtrarPlanes(fixtureLista(), "completados");
    expect(claves(completados)).toEqual(["cnc:1", "evaluacion:1", "pct:1"]);
  });

  it("los tipos sin estado (diario, semanal, BT) no aparecen en los filtros de estado", () => {
    const lista = fixtureLista();
    const sinEstado = ["diario:1", "semanal:1", "bt:1"];

    for (const filtro of ["progreso", "completados"] as FiltroPlanes[]) {
      const vistas = filtrarPlanes(lista, filtro).map((p) => p.key);
      for (const key of sinEstado) expect(vistas, `${filtro} no debe contener ${key}`).not.toContain(key);
    }

    // …pero sí siguen presentes en Todos y Recientes.
    expect(claves(filtrarPlanes(lista, "todos"))).toEqual(expect.arrayContaining(sinEstado));
    expect(claves(filtrarPlanes(lista, "recientes"))).toEqual(
      expect.arrayContaining(["semanal:1", "bt:1"])
    );
  });

  it("el mapeo de estados de D5 cubre todos los valores existentes", () => {
    expect(estadoDe("draft")).toEqual({ label: "Borrador", categoria: "progreso" });
    expect(estadoDe("borrador")).toEqual({ label: "Borrador", categoria: "progreso" });
    expect(estadoDe("generated")?.categoria).toBe("completado");
    expect(estadoDe("generado")?.categoria).toBe("completado");
    expect(estadoDe("paid")).toEqual({ label: "Pagada", categoria: "completado" });
    expect(estadoDe("publicada")?.categoria).toBe("completado");
    expect(estadoDe("aplicada")?.categoria).toBe("completado");
    expect(estadoDe("analizada")?.categoria).toBe("completado");
    // Sin inventar estados: desconocido o ausente ⇒ sin estado.
    expect(estadoDe("archivada")).toBeNull();
    expect(estadoDe(null)).toBeNull();
    expect(estadoDe(undefined)).toBeNull();
    expect(estadoDe("")).toBeNull();
  });
});

// ─── Constructores por tipo ───────────────────────────────────────────────

describe("constructores por tipo", () => {
  it("los tipos sin estado propio construyen `estado: null`", () => {
    const diario = resumenDiario({
      id: "plan-1",
      grado: "5.°",
      docente: "Docente",
      asignatura: "Matemática",
      fecha: "2026-09-01",
      createdAt: haceDias(10),
      updatedAt: haceDias(10),
      destreza: { codigo: "M01", area: "M", descripcion: "x" },
    } as unknown as Planificacion);

    expect(diario.estado).toBeNull();
    expect(diario.rutaContinuar).toBe("/ver-plan/plan-1");
    expect(diario.rutaEditar).toBeNull();
    expect(diario.detalle).toContain("M01");

    const semanal = resumenSemanal({
      id: "sem-1",
      semanaInicio: "1/9/2026",
      semanaFin: "5/9/2026",
      grado: "5.°",
      paralelo: "B",
      docente: "",
      createdAt: haceDias(3),
      updatedAt: haceDias(3),
    } as never);

    expect(semanal.estado).toBeNull();
    expect(semanal.rutaContinuar).toBe("/ver-semana/sem-1");
    expect(semanal.titulo).toContain("1/9/2026");

    const bt = resumenBt({
      id: "bt-1",
      figuraProfesionalId: "ds",
      nombreModuloFormativo: "Módulo X",
      unidadTrabajo: { nombre: "Unidad 1" },
      createdAt: haceDias(2),
      updatedAt: haceDias(2),
    } as unknown as PlanUnidadTrabajoBT);

    expect(bt.estado).toBeNull(); // PlanUnidadTrabajoBT no tiene status
    expect(bt.rutaContinuar).toBe("/planificar-bt/ds"); // brecha D10: sin detalle propio
    expect(bt.detalle).toContain("Módulo X");
  });

  it("los tipos con estado construyen su categoría y su ruta de Continuar", () => {
    const pca = resumenPca(
      { id: 11, status: "draft", formData: { grado: "10.°", area: "M" }, createdAt: haceDias(4) },
      "anual"
    );
    expect(pca.tipo).toBe("pca");
    expect(pca.estado).toEqual({ label: "Borrador", categoria: "progreso" });
    expect(pca.rutaContinuar).toBe("/pca-preview/11");
    expect(pca.rutaEditar).toBeNull();

    const pct = resumenPca(
      { id: 12, status: "paid", formData: { grado: "10.°" }, createdAt: haceDias(4) },
      "trimestral"
    );
    expect(pct.tipo).toBe("pct");
    expect(pct.estado?.categoria).toBe("completado");
    expect(pct.rutaContinuar).toBe("/pca-trimestral-preview/12");

    const cnc = resumenCnc({
      id: "cnc-1",
      grado: "2.°",
      paralelo: "A",
      modalidad: "general",
      anioLectivo: "2026-2027",
      docente: "Docente",
      status: "generado",
      createdAt: haceDias(5),
      updatedAt: haceDias(5),
    } as never);
    expect(cnc.estado?.categoria).toBe("completado");
    expect(cnc.rutaContinuar).toBe("/ver-cnc/cnc-1");

    const evaluacion = resumenEvaluacion({
      id: "ev-1",
      nombre: "Diagnóstico",
      grado: "5.°",
      paralelo: "",
      anioLectivo: "2026-2027",
      fecha: "2026-09-01",
      status: "analizada",
      createdAt: haceDias(6),
      updatedAt: haceDias(6),
    } as never);
    expect(evaluacion.estado).toEqual({ label: "Analizada", categoria: "completado" });
    expect(evaluacion.rutaContinuar).toBe("/ver-evaluacion/ev-1");

    const proyecto = resumenProyecto({
      id: 3,
      titulo: "Proyecto ambiental",
      baseCurricular: "BC",
      nivelPrincipal: "BGU",
      estado: "borrador",
      updatedAt: haceDias(1),
    });
    expect(proyecto.estado?.categoria).toBe("progreso");
    expect(proyecto.rutaContinuar).toBe("/proyecto-interdisciplinar/wizard?id=3");
    expect(proyecto.rutaEditar).toBeNull(); // Continuar ya abre el wizard reanudable
  });

  it("CxC construye Editar según su familia (reanudación por id)", () => {
    expect(rutaEdicionCxc("egb_bgu_dcd", 7)).toBe("/curriculo-competencias/egb-bgu?id=7");
    expect(rutaEdicionCxc("curriculo_integrado_inicial", 7)).toBe(
      "/curriculo-competencias/inicial?id=7"
    );
    expect(rutaEdicionCxc("curriculo_integrado_single", 7)).toBe(
      "/curriculo-competencias/egb-bgu-integrado?id=7"
    );
    expect(rutaEdicionCxc("curriculo_integrado_multigrado", 7)).toBe(
      "/curriculo-competencias/egb-bgu-integrado?id=7"
    );

    const cxc = resumenCxc({
      id: 7,
      status: "generated",
      createdAt: haceDias(2),
      familia: "egb_bgu_dcd",
      grado: "6.°",
      asignaturaNombre: "Matemática",
      docente: "Docente",
    });
    expect(cxc.tipo).toBe("cxc");
    expect(cxc.estado?.categoria).toBe("completado");
    expect(cxc.rutaContinuar).toBe("/curriculo-competencias/ver/7");
    expect(cxc.rutaEditar).toBe("/curriculo-competencias/egb-bgu?id=7");
  });
});

// ─── Duplicación (tarea 4.10) ─────────────────────────────────────────────

describe("duplicación de un plan local", () => {
  const original: Planificacion = {
    id: "plan-abc",
    fecha: "1/9/2026",
    institucion: "Institución",
    docente: "Docente",
    grado: "5.°",
    asignatura: "Matemática",
    periodos: "5",
    destreza: { codigo: "M01", area: "M", descripcion: "Descripción" },
    actividades: "Actividades",
    recursos: "Recursos",
    evaluacion: "Evaluación",
    tecnicasInstrumentos: "Técnicas",
    observaciones: "Obs",
    createdAt: haceDias(10),
    updatedAt: haceDias(5),
  } as unknown as Planificacion;

  it("genera un id nuevo conservando el contenido", () => {
    const ahora = "2026-09-22T12:00:00.000Z";
    const copia = duplicarRegistro(original, ahora);

    expect(copia.id).not.toBe(original.id);
    expect(copia.id).toMatch(/^[0-9a-z]+-[0-9a-z]+$/);
    expect(copia.createdAt).toBe(ahora);
    expect(copia.updatedAt).toBe(ahora);

    // Contenido idéntico salvo identidad y marcas de tiempo.
    const { id: _id, createdAt: _c, updatedAt: _u, ...contenidoCopia } = copia;
    const { id: _oid, createdAt: _oc, updatedAt: _ou, ...contenidoOriginal } = original;
    expect(contenidoCopia).toEqual(contenidoOriginal);
    expect(_id).toBeDefined();
    expect(_oid).toBeDefined();
    expect(_c).toBeDefined();
    expect(_ou).toBeDefined();
  });

  it("deja el original intacto y produce copias independientes", () => {
    const antes = JSON.stringify(original);

    const una = duplicarRegistro(original);
    const dos = duplicarRegistro(original);

    expect(JSON.stringify(original)).toBe(antes);
    expect(original.id).toBe("plan-abc");
    expect(una.id).not.toBe(dos.id);
    expect(una.grado).toBe(original.grado);
    expect(dos.destreza.codigo).toBe("M01");
  });
});

// ─── Fechas ───────────────────────────────────────────────────────────────

describe("fechas heterogéneas entre fuentes", () => {
  it("normaliza ISO, MySQL y Date al mismo formato", () => {
    expect(normalizarFecha("2026-09-22T10:00:00.000Z")).toBe("2026-09-22T10:00:00.000Z");
    expect(normalizarFecha("2026-09-22 10:00:00")).toBe("2026-09-22T10:00:00");
    expect(normalizarFecha(new Date("2026-09-22T10:00:00.000Z"))).toBe(
      "2026-09-22T10:00:00.000Z"
    );
    expect(normalizarFecha(null)).toBe("");
    expect(normalizarFecha(undefined)).toBe("");
    expect(normalizarFecha("")).toBe("");
  });

  it("formatea la fecha de actualización como dd/mm/aaaa", () => {
    expect(formatoFecha("2026-03-05T00:00:00.000Z")).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    expect(formatoFecha("no-es-fecha")).toBe("");
  });
});
