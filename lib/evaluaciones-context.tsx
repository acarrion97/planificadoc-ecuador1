/**
 * Contexto de persistencia de "Evaluación Diagnóstica" — 100% SEPARADO de
 * lib/planificaciones-context.tsx (EGB/BGU), lib/planificaciones-bt-context.tsx
 * (Bachillerato Técnico) y lib/planificaciones-cnc-context.tsx (Conecta,
 * Nivela y Crea). Mismo patrón interno (reducer + AsyncStorage), árbol de
 * estado independiente, para que el módulo no pueda romper ningún flujo
 * existente en producción.
 */
import React, { createContext, useContext, useEffect, useReducer, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { EvaluacionDiagnostica, PreguntaDiagnostica } from "@/data/types-evaluacion";
import { trpc } from "@/lib/trpc";
import { getDeviceSessionId, mergeMissingById } from "@/lib/local-cloud-backup";

const STORAGE_KEY_EVALUACIONES = "@planificadoc_evaluaciones";
const STORAGE_KEY_BANCO = "@planificadoc_banco_preguntas";

interface State {
  evaluaciones: EvaluacionDiagnostica[];
  evaluacionesLoaded: boolean;
  bancoPreguntas: PreguntaDiagnostica[];
  bancoLoaded: boolean;
}

type Action =
  | { type: "SET_ALL_EVALUACIONES"; payload: EvaluacionDiagnostica[] }
  | { type: "ADD_EVALUACION"; payload: EvaluacionDiagnostica }
  | { type: "UPDATE_EVALUACION"; payload: EvaluacionDiagnostica }
  | { type: "DELETE_EVALUACION"; payload: string }
  | { type: "SET_ALL_BANCO"; payload: PreguntaDiagnostica[] }
  | { type: "ADD_BANCO"; payload: PreguntaDiagnostica }
  | { type: "UPDATE_BANCO"; payload: PreguntaDiagnostica }
  | { type: "DELETE_BANCO"; payload: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_ALL_EVALUACIONES":
      return { ...state, evaluaciones: action.payload, evaluacionesLoaded: true };
    case "ADD_EVALUACION":
      return { ...state, evaluaciones: [action.payload, ...state.evaluaciones] };
    case "UPDATE_EVALUACION":
      return {
        ...state,
        evaluaciones: state.evaluaciones.map((e) =>
          e.id === action.payload.id ? action.payload : e
        ),
      };
    case "DELETE_EVALUACION":
      return {
        ...state,
        evaluaciones: state.evaluaciones.filter((e) => e.id !== action.payload),
      };
    case "SET_ALL_BANCO":
      return { ...state, bancoPreguntas: action.payload, bancoLoaded: true };
    case "ADD_BANCO":
      return { ...state, bancoPreguntas: [action.payload, ...state.bancoPreguntas] };
    case "UPDATE_BANCO":
      return {
        ...state,
        bancoPreguntas: state.bancoPreguntas.map((p) =>
          p.id === action.payload.id ? action.payload : p
        ),
      };
    case "DELETE_BANCO":
      return {
        ...state,
        bancoPreguntas: state.bancoPreguntas.filter((p) => p.id !== action.payload),
      };
    default:
      return state;
  }
}

interface EvaluacionesContextValue {
  evaluaciones: EvaluacionDiagnostica[];
  evaluacionesLoaded: boolean;
  addEvaluacion: (e: EvaluacionDiagnostica) => Promise<void>;
  updateEvaluacion: (e: EvaluacionDiagnostica) => Promise<void>;
  deleteEvaluacion: (id: string) => Promise<void>;
  getEvaluacion: (id: string) => EvaluacionDiagnostica | undefined;
  bancoPreguntas: PreguntaDiagnostica[];
  bancoLoaded: boolean;
  addPreguntaBanco: (p: PreguntaDiagnostica) => Promise<void>;
  updatePreguntaBanco: (p: PreguntaDiagnostica) => Promise<void>;
  deletePreguntaBanco: (id: string) => Promise<void>;
}

const EvaluacionesContext = createContext<EvaluacionesContextValue | null>(null);

export function EvaluacionesProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    evaluaciones: [],
    evaluacionesLoaded: false,
    bancoPreguntas: [],
    bancoLoaded: false,
  });
  const [sessionId, setSessionId] = React.useState("");
  const backups = trpc.planificacionLocal.listar.useQuery(
    { sessionId, tipo: "evaluacion" },
    { enabled: sessionId.length > 0 },
  );
  const legacyBackups = trpc.evaluacion.list.useQuery(
    { sessionId },
    { enabled: sessionId.length > 0 },
  );
  const backupMutation = trpc.planificacionLocal.guardar.useMutation();
  const deleteBackupMutation = trpc.planificacionLocal.eliminar.useMutation();

  useEffect(() => {
    getDeviceSessionId().then(setSessionId).catch((error: unknown) => {
      console.warn("[evaluaciones] device session unavailable; cloud backup disabled:", error);
    });
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY_EVALUACIONES);
        dispatch({ type: "SET_ALL_EVALUACIONES", payload: raw ? JSON.parse(raw) : [] });
      } catch {
        dispatch({ type: "SET_ALL_EVALUACIONES", payload: [] });
      }
    })();
  }, []);

  useEffect(() => {
    if (!backups.data && !legacyBackups.data) return;
    const registrosLegados = (legacyBackups.data ?? []).flatMap((row) => {
      if (!row.form) return [];
      try {
        const parsed: unknown = JSON.parse(row.form);
        if (
          typeof parsed !== "object" ||
          parsed === null ||
          !("id" in parsed) ||
          typeof parsed.id !== "string"
        ) {
          console.warn("[evaluaciones] legacy cloud backup has no valid id; skipped");
          return [];
        }
        return [{ tipo: "evaluacion", itemId: parsed.id, form: row.form }];
      } catch (error) {
        console.warn("[evaluaciones] legacy cloud backup could not be parsed; skipped:", error);
        return [];
      }
    });
    const restored = mergeMissingById(
      state.evaluaciones,
      [
        ...(backups.data ?? []).filter((row) => row.tipo === "evaluacion"),
        ...registrosLegados,
      ],
      "evaluacion",
    );
    if (restored.length === state.evaluaciones.length) return;
    dispatch({ type: "SET_ALL_EVALUACIONES", payload: restored });
    AsyncStorage.setItem(STORAGE_KEY_EVALUACIONES, JSON.stringify(restored)).catch((error: unknown) => {
      console.warn("[evaluaciones] could not persist restored cloud records locally:", error);
    });
  }, [backups.data, legacyBackups.data, state.evaluaciones]);

  useEffect(() => {
    if (backups.error) {
      console.warn("[evaluaciones] cloud restore unavailable (non-critical):", backups.error);
    }
    if (legacyBackups.error) {
      console.warn("[evaluaciones] legacy cloud restore unavailable (non-critical):", legacyBackups.error);
    }
  }, [backups.error, legacyBackups.error]);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY_BANCO);
        dispatch({ type: "SET_ALL_BANCO", payload: raw ? JSON.parse(raw) : [] });
      } catch {
        dispatch({ type: "SET_ALL_BANCO", payload: [] });
      }
    })();
  }, []);

  const persistEvaluaciones = useCallback(async (list: EvaluacionDiagnostica[]) => {
    await AsyncStorage.setItem(STORAGE_KEY_EVALUACIONES, JSON.stringify(list));
  }, []);

  const persistBanco = useCallback(async (list: PreguntaDiagnostica[]) => {
    await AsyncStorage.setItem(STORAGE_KEY_BANCO, JSON.stringify(list));
  }, []);

  const guardarBackup = useCallback((item: EvaluacionDiagnostica) => {
    if (!sessionId) return;
    void backupMutation.mutateAsync({
      sessionId,
      tipo: "evaluacion",
      itemId: item.id,
      form: JSON.stringify(item),
    }).then((result) => {
      if (result.id === null) console.warn("[evaluaciones] cloud backup unavailable");
    }).catch((error: unknown) => {
      console.warn("[evaluaciones] cloud backup failed (non-critical):", error);
    });
  }, [backupMutation, sessionId]);

  const eliminarBackup = useCallback((itemId: string) => {
    if (!sessionId) return;
    void deleteBackupMutation.mutateAsync({ sessionId, tipo: "evaluacion", itemId })
      .then(({ success }) => {
        if (!success) console.warn("[evaluaciones] cloud backup delete unavailable");
      })
      .catch((error: unknown) => {
        console.warn("[evaluaciones] cloud backup delete failed (non-critical):", error);
      });
  }, [deleteBackupMutation, sessionId]);

  const addEvaluacion = useCallback(
    async (e: EvaluacionDiagnostica) => {
      dispatch({ type: "ADD_EVALUACION", payload: e });
      const raw = await AsyncStorage.getItem(STORAGE_KEY_EVALUACIONES);
      const current: EvaluacionDiagnostica[] = raw ? JSON.parse(raw) : [];
      await persistEvaluaciones([e, ...current.filter((item) => item.id !== e.id)]);
      guardarBackup(e);
    },
    [guardarBackup, persistEvaluaciones]
  );

  const updateEvaluacion = useCallback(
    async (e: EvaluacionDiagnostica) => {
      dispatch({ type: "UPDATE_EVALUACION", payload: e });
      const raw = await AsyncStorage.getItem(STORAGE_KEY_EVALUACIONES);
      const current: EvaluacionDiagnostica[] = raw ? JSON.parse(raw) : [];
      await persistEvaluaciones(current.map((x) => (x.id === e.id ? e : x)));
      guardarBackup(e);
    },
    [guardarBackup, persistEvaluaciones]
  );

  const deleteEvaluacion = useCallback(
    async (id: string) => {
      dispatch({ type: "DELETE_EVALUACION", payload: id });
      const raw = await AsyncStorage.getItem(STORAGE_KEY_EVALUACIONES);
      const current: EvaluacionDiagnostica[] = raw ? JSON.parse(raw) : [];
      await persistEvaluaciones(current.filter((x) => x.id !== id));
      eliminarBackup(id);
    },
    [eliminarBackup, persistEvaluaciones]
  );

  const getEvaluacion = useCallback(
    (id: string) => state.evaluaciones.find((e) => e.id === id),
    [state.evaluaciones]
  );

  const addPreguntaBanco = useCallback(
    async (p: PreguntaDiagnostica) => {
      dispatch({ type: "ADD_BANCO", payload: p });
      const raw = await AsyncStorage.getItem(STORAGE_KEY_BANCO);
      const current: PreguntaDiagnostica[] = raw ? JSON.parse(raw) : [];
      await persistBanco([p, ...current]);
    },
    [persistBanco]
  );

  const updatePreguntaBanco = useCallback(
    async (p: PreguntaDiagnostica) => {
      dispatch({ type: "UPDATE_BANCO", payload: p });
      const raw = await AsyncStorage.getItem(STORAGE_KEY_BANCO);
      const current: PreguntaDiagnostica[] = raw ? JSON.parse(raw) : [];
      await persistBanco(current.map((x) => (x.id === p.id ? p : x)));
    },
    [persistBanco]
  );

  const deletePreguntaBanco = useCallback(
    async (id: string) => {
      dispatch({ type: "DELETE_BANCO", payload: id });
      const raw = await AsyncStorage.getItem(STORAGE_KEY_BANCO);
      const current: PreguntaDiagnostica[] = raw ? JSON.parse(raw) : [];
      await persistBanco(current.filter((x) => x.id !== id));
    },
    [persistBanco]
  );

  return (
    <EvaluacionesContext.Provider
      value={{
        evaluaciones: state.evaluaciones,
        evaluacionesLoaded: state.evaluacionesLoaded,
        addEvaluacion,
        updateEvaluacion,
        deleteEvaluacion,
        getEvaluacion,
        bancoPreguntas: state.bancoPreguntas,
        bancoLoaded: state.bancoLoaded,
        addPreguntaBanco,
        updatePreguntaBanco,
        deletePreguntaBanco,
      }}
    >
      {children}
    </EvaluacionesContext.Provider>
  );
}

export function useEvaluaciones() {
  const ctx = useContext(EvaluacionesContext);
  if (!ctx) throw new Error("useEvaluaciones must be used within EvaluacionesProvider");
  return ctx;
}