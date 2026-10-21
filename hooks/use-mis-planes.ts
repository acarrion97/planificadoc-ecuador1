/**
 * Agregación de "Mis planes" (fase 4, `ux-navigation-and-creation-hub`).
 *
 * Reúne los planes de TODOS los tipos en una sola lista (spec
 * `mis-planes-gestion`): los cinco contextos de AsyncStorage (diario,
 * semanal, CNC, BT, evaluación), las tres consultas tRPC (PCA/PCT, Currículo
 * por Competencias, Proyecto) y las acciones de gestión por plan
 * (Continuar vive en `PlanResumen.rutaContinuar`; aquí Eliminar y Duplicar).
 *
 * El modelo puro (tipos, filtros, rutas) está en `lib/mis-planes.ts`.
 *
 * Nota: la adaptación curricular AI (`@planificadoc_adaptaciones`) queda
 * fuera del listado por ahora: su formulario no admite reabrir un registro
 * por id, así que no podría ofrecersele "Continuar" conservando la
 * información (brecha documentada en design.md D10).
 */
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { trpc } from "@/lib/trpc";
import { usePlanificaciones } from "@/lib/planificaciones-context";
import { usePlanificacionesCNC } from "@/lib/planificaciones-cnc-context";
import { usePlanificacionesBT } from "@/lib/planificaciones-bt-context";
import { useEvaluaciones } from "@/lib/evaluaciones-context";
import {
  duplicarRegistro,
  resumenBt,
  resumenCnc,
  resumenCxc,
  resumenDiario,
  resumenEvaluacion,
  resumenPca,
  resumenProyecto,
  resumenSemanal,
  type DocPcaListado,
  type FilaCxcListado,
  type FilaProyectoListado,
  type PlanResumen,
} from "@/lib/mis-planes";

/** Mismo sessionId que usa `app/curriculo-competencias/index.tsx`. */
const CXC_SESSION_ID = "default";

/** Mismo patrón de id de dispositivo que PCA y Proyecto (app existentes). */
async function getDeviceId(): Promise<string> {
  let id = await AsyncStorage.getItem("@planificadoc_device_id");
  if (!id) {
    id = Math.random().toString(36).substring(2, 18) + Date.now().toString(36);
    await AsyncStorage.setItem("@planificadoc_device_id", id);
  }
  return id;
}

/** Plan de la lista con sus acciones de gestión (spec: Continuar/Eliminar/Duplicar). */
export interface PlanGestion extends PlanResumen {
  eliminar: () => Promise<void>;
  duplicar: () => Promise<void>;
}

export function useMisPlanes(): { planes: PlanGestion[]; cargando: boolean } {
  const {
    planificaciones,
    loaded,
    addPlanificacion,
    deletePlanificacion,
    semanas,
    semanasLoaded,
    addSemana,
    deleteSemana,
  } = usePlanificaciones();
  const { planesCNC, planesCNCLoaded, addPlanCNC, deletePlanCNC } = usePlanificacionesCNC();
  const { planesBT, planesBTLoaded, addPlanBT, deletePlanBT } = usePlanificacionesBT();
  const { evaluaciones, evaluacionesLoaded, addEvaluacion, deleteEvaluacion } = useEvaluaciones();

  const [sessionId, setSessionId] = useState("");
  useEffect(() => {
    let vivo = true;
    getDeviceId().then((id) => {
      if (vivo) setSessionId(id);
    });
    return () => {
      vivo = false;
    };
  }, []);

  // ── Fuentes en servidor ──
  // `listMisPcas` devuelve anuales Y trimestrales: se separan por `formData.tipo`
  // (mismo criterio que `listMisPcasTrimestral`).
  const docsPca = trpc.pca.listMisPcas.useQuery(
    { sessionId },
    { enabled: sessionId.length > 0 }
  );
  const filasCxc = trpc.curriculoCompetencias.list.useQuery({ sessionId: CXC_SESSION_ID });
  const filasProyecto = trpc.proyectoInterdisciplinar.list.useQuery(
    { sessionId },
    { enabled: sessionId.length > 0 }
  );

  const mutPcaDuplicate = trpc.pca.duplicate.useMutation();
  const mutPcaDelete = trpc.pca.delete.useMutation();
  const mutCxcDuplicate = trpc.curriculoCompetencias.duplicate.useMutation();
  const mutCxcDelete = trpc.curriculoCompetencias.delete.useMutation();
  const mutProyectoDuplicate = trpc.proyectoInterdisciplinar.duplicate.useMutation();
  const mutProyectoDelete = trpc.proyectoInterdisciplinar.delete.useMutation();

  const planes: PlanGestion[] = [];

  // ── Locales (AsyncStorage vía contextos) ──
  for (const p of planificaciones) {
    planes.push({
      ...resumenDiario(p),
      eliminar: () => deletePlanificacion(p.id),
      duplicar: async () => {
        await addPlanificacion(duplicarRegistro(p));
      },
    });
  }
  for (const s of semanas) {
    planes.push({
      ...resumenSemanal(s),
      eliminar: () => deleteSemana(s.id),
      duplicar: async () => {
        await addSemana(duplicarRegistro(s));
      },
    });
  }
  for (const c of planesCNC) {
    planes.push({
      ...resumenCnc(c),
      eliminar: () => deletePlanCNC(c.id),
      duplicar: async () => {
        await addPlanCNC(duplicarRegistro(c));
      },
    });
  }
  for (const b of planesBT) {
    planes.push({
      ...resumenBt(b),
      eliminar: () => deletePlanBT(b.id),
      duplicar: async () => {
        await addPlanBT(duplicarRegistro(b));
      },
    });
  }
  for (const e of evaluaciones) {
    planes.push({
      ...resumenEvaluacion(e),
      eliminar: () => deleteEvaluacion(e.id),
      duplicar: async () => {
        await addEvaluacion(duplicarRegistro(e));
      },
    });
  }

  // ── PCA / PCT (una sola consulta, separadas por `formData.tipo`) ──
  for (const doc of (docsPca.data ?? []) as DocPcaListado[]) {
    const esTrimestral = (doc.formData as { tipo?: string } | null)?.tipo === "trimestral";
    planes.push({
      ...resumenPca(doc, esTrimestral ? "trimestral" : "anual"),
      eliminar: async () => {
        await mutPcaDelete.mutateAsync({ id: doc.id });
        await docsPca.refetch();
      },
      duplicar: async () => {
        await mutPcaDuplicate.mutateAsync({ id: doc.id, sessionId });
        await docsPca.refetch();
      },
    });
  }

  // ── Currículo por Competencias ──
  for (const fila of (filasCxc.data ?? []) as FilaCxcListado[]) {
    planes.push({
      ...resumenCxc(fila),
      eliminar: async () => {
        await mutCxcDelete.mutateAsync({ id: fila.id });
        await filasCxc.refetch();
      },
      duplicar: async () => {
        await mutCxcDuplicate.mutateAsync({ id: fila.id });
        await filasCxc.refetch();
      },
    });
  }

  // ── Proyecto Interdisciplinar ──
  for (const fila of (filasProyecto.data ?? []) as FilaProyectoListado[]) {
    planes.push({
      ...resumenProyecto(fila),
      eliminar: async () => {
        await mutProyectoDelete.mutateAsync({ id: fila.id });
        await filasProyecto.refetch();
      },
      duplicar: async () => {
        await mutProyectoDuplicate.mutateAsync({ id: fila.id, sessionId });
        await filasProyecto.refetch();
      },
    });
  }

  const cargando =
    !sessionId ||
    docsPca.isLoading ||
    filasCxc.isLoading ||
    filasProyecto.isLoading ||
    !loaded ||
    !semanasLoaded ||
    !planesCNCLoaded ||
    !planesBTLoaded ||
    !evaluacionesLoaded;

  return { planes, cargando };
}
