import React, { createContext, useContext, useEffect, useReducer, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Planificacion, PlanificacionSemanal } from "@/data/types";
import { trpc } from "@/lib/trpc";
import { getDeviceSessionId, mergeMissingById } from "@/lib/local-cloud-backup";

const STORAGE_KEY = "@planificadoc_planificaciones";
const STORAGE_KEY_SEMANAS = "@planificadoc_semanas";

interface State {
  planificaciones: Planificacion[];
  loaded: boolean;
  semanas: PlanificacionSemanal[];
  semanasLoaded: boolean;
}

type Action =
  | { type: "SET_ALL"; payload: Planificacion[] }
  | { type: "ADD"; payload: Planificacion }
  | { type: "UPDATE"; payload: Planificacion }
  | { type: "DELETE"; payload: string }
  | { type: "SET_ALL_SEMANAS"; payload: PlanificacionSemanal[] }
  | { type: "ADD_SEMANA"; payload: PlanificacionSemanal }
  | { type: "UPDATE_SEMANA"; payload: PlanificacionSemanal }
  | { type: "DELETE_SEMANA"; payload: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_ALL":
      return { ...state, planificaciones: action.payload, loaded: true };
    case "ADD":
      return { ...state, planificaciones: [action.payload, ...state.planificaciones] };
    case "UPDATE":
      return {
        ...state,
        planificaciones: state.planificaciones.map((p) =>
          p.id === action.payload.id ? action.payload : p
        ),
      };
    case "DELETE":
      return {
        ...state,
        planificaciones: state.planificaciones.filter((p) => p.id !== action.payload),
      };
    case "SET_ALL_SEMANAS":
      return { ...state, semanas: action.payload, semanasLoaded: true };
    case "ADD_SEMANA":
      return { ...state, semanas: [action.payload, ...state.semanas] };
    case "UPDATE_SEMANA":
      return {
        ...state,
        semanas: state.semanas.map((s) =>
          s.id === action.payload.id ? action.payload : s
        ),
      };
    case "DELETE_SEMANA":
      return {
        ...state,
        semanas: state.semanas.filter((s) => s.id !== action.payload),
      };
    default:
      return state;
  }
}

interface PlanificacionesContextValue {
  planificaciones: Planificacion[];
  loaded: boolean;
  addPlanificacion: (p: Planificacion) => Promise<void>;
  updatePlanificacion: (p: Planificacion) => Promise<void>;
  deletePlanificacion: (id: string) => Promise<void>;
  getPlanificacion: (id: string) => Planificacion | undefined;
  semanas: PlanificacionSemanal[];
  semanasLoaded: boolean;
  addSemana: (s: PlanificacionSemanal) => Promise<void>;
  updateSemana: (s: PlanificacionSemanal) => Promise<void>;
  deleteSemana: (id: string) => Promise<void>;
  getSemana: (id: string) => PlanificacionSemanal | undefined;
}

const PlanificacionesContext = createContext<PlanificacionesContextValue | null>(null);

export function PlanificacionesProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    planificaciones: [],
    loaded: false,
    semanas: [],
    semanasLoaded: false,
  });
  const [sessionId, setSessionId] = React.useState("");
  const backups = trpc.planificacionLocal.listar.useQuery(
    { sessionId, tipo: "diario" },
    { enabled: sessionId.length > 0 },
  );
  const backupsSemanas = trpc.planificacionLocal.listar.useQuery(
    { sessionId, tipo: "semanal" },
    { enabled: sessionId.length > 0 },
  );
  const backupMutation = trpc.planificacionLocal.guardar.useMutation();
  const deleteBackupMutation = trpc.planificacionLocal.eliminar.useMutation();

  useEffect(() => {
    getDeviceSessionId().then(setSessionId).catch((error: unknown) => {
      console.warn("[planificaciones] device session unavailable; cloud backup disabled:", error);
    });
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        dispatch({ type: "SET_ALL", payload: raw ? JSON.parse(raw) : [] });
      } catch {
        dispatch({ type: "SET_ALL", payload: [] });
      }
    })();
  }, []);

  useEffect(() => {
    if (!backups.data) return;
    const restored = mergeMissingById(
      state.planificaciones,
      backups.data.filter((row) => row.tipo === "diario"),
      "diario",
    );
    if (restored.length === state.planificaciones.length) return;
    dispatch({ type: "SET_ALL", payload: restored });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(restored)).catch((error: unknown) => {
      console.warn("[planificaciones] could not persist restored cloud records locally:", error);
    });
  }, [backups.data, state.planificaciones]);

  useEffect(() => {
    if (!backupsSemanas.data) return;
    const restored = mergeMissingById(
      state.semanas,
      backupsSemanas.data.filter((row) => row.tipo === "semanal"),
      "semanal",
    );
    if (restored.length === state.semanas.length) return;
    dispatch({ type: "SET_ALL_SEMANAS", payload: restored });
    AsyncStorage.setItem(STORAGE_KEY_SEMANAS, JSON.stringify(restored)).catch((error: unknown) => {
      console.warn("[planificaciones] could not persist restored weekly records locally:", error);
    });
  }, [backupsSemanas.data, state.semanas]);

  useEffect(() => {
    if (backups.error) {
      console.warn("[planificaciones] cloud restore unavailable (non-critical):", backups.error);
    }
  }, [backups.error]);

  useEffect(() => {
    if (backupsSemanas.error) {
      console.warn("[planificaciones] weekly cloud restore unavailable (non-critical):", backupsSemanas.error);
    }
  }, [backupsSemanas.error]);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY_SEMANAS);
        dispatch({ type: "SET_ALL_SEMANAS", payload: raw ? JSON.parse(raw) : [] });
      } catch {
        dispatch({ type: "SET_ALL_SEMANAS", payload: [] });
      }
    })();
  }, []);

  const persist = useCallback(async (planificaciones: Planificacion[]) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(planificaciones));
  }, []);

  const persistSemanas = useCallback(async (semanas: PlanificacionSemanal[]) => {
    await AsyncStorage.setItem(STORAGE_KEY_SEMANAS, JSON.stringify(semanas));
  }, []);

  const guardarBackup = useCallback((tipo: "diario" | "semanal", item: { id: string }) => {
    if (!sessionId) return;
    void backupMutation.mutateAsync({
      sessionId,
      tipo,
      itemId: item.id,
      form: JSON.stringify(item),
    }).then((result) => {
      if (result.id === null) console.warn(`[planificaciones] ${tipo} cloud backup unavailable`);
    }).catch((error: unknown) => {
      console.warn(`[planificaciones] ${tipo} cloud backup failed (non-critical):`, error);
    });
  }, [backupMutation, sessionId]);

  const eliminarBackup = useCallback((tipo: "diario" | "semanal", itemId: string) => {
    if (!sessionId) return;
    void deleteBackupMutation.mutateAsync({ sessionId, tipo, itemId })
      .then(({ success }) => {
        if (!success) console.warn(`[planificaciones] ${tipo} cloud backup delete unavailable`);
      })
      .catch((error: unknown) => {
        console.warn(`[planificaciones] ${tipo} cloud backup delete failed (non-critical):`, error);
      });
  }, [deleteBackupMutation, sessionId]);

  const addPlanificacion = useCallback(async (p: Planificacion) => {
    dispatch({ type: "ADD", payload: p });
    await AsyncStorage.getItem(STORAGE_KEY).then(async (raw) => {
      const current: Planificacion[] = raw ? JSON.parse(raw) : [];
      await persist([p, ...current.filter((item) => item.id !== p.id)]);
    });
    guardarBackup("diario", p);
  }, [guardarBackup, persist]);

  const updatePlanificacion = useCallback(async (p: Planificacion) => {
    dispatch({ type: "UPDATE", payload: p });
    await AsyncStorage.getItem(STORAGE_KEY).then(raw => {
      const current: Planificacion[] = raw ? JSON.parse(raw) : [];
      return persist(current.map(x => x.id === p.id ? p : x));
    });
    guardarBackup("diario", p);
  }, [guardarBackup, persist]);

  const deletePlanificacion = useCallback(async (id: string) => {
    dispatch({ type: "DELETE", payload: id });
    await AsyncStorage.getItem(STORAGE_KEY).then(raw => {
      const current: Planificacion[] = raw ? JSON.parse(raw) : [];
      return persist(current.filter(x => x.id !== id));
    });
    eliminarBackup("diario", id);
  }, [eliminarBackup, persist]);

  const getPlanificacion = useCallback(
    (id: string) => state.planificaciones.find((p) => p.id === id),
    [state.planificaciones]
  );

  const addSemana = useCallback(async (s: PlanificacionSemanal) => {
    dispatch({ type: "ADD_SEMANA", payload: s });
    await AsyncStorage.getItem(STORAGE_KEY_SEMANAS).then(async (raw) => {
      const current: PlanificacionSemanal[] = raw ? JSON.parse(raw) : [];
      await persistSemanas([s, ...current.filter((item) => item.id !== s.id)]);
    });
    guardarBackup("semanal", s);
  }, [guardarBackup, persistSemanas]);

  const updateSemana = useCallback(async (s: PlanificacionSemanal) => {
    dispatch({ type: "UPDATE_SEMANA", payload: s });
    await AsyncStorage.getItem(STORAGE_KEY_SEMANAS).then(raw => {
      const current: PlanificacionSemanal[] = raw ? JSON.parse(raw) : [];
      return persistSemanas(current.map(x => x.id === s.id ? s : x));
    });
    guardarBackup("semanal", s);
  }, [guardarBackup, persistSemanas]);

  const deleteSemana = useCallback(async (id: string) => {
    dispatch({ type: "DELETE_SEMANA", payload: id });
    await AsyncStorage.getItem(STORAGE_KEY_SEMANAS).then(raw => {
      const current: PlanificacionSemanal[] = raw ? JSON.parse(raw) : [];
      return persistSemanas(current.filter(x => x.id !== id));
    });
    eliminarBackup("semanal", id);
  }, [eliminarBackup, persistSemanas]);

  const getSemana = useCallback(
    (id: string) => state.semanas.find((s) => s.id === id),
    [state.semanas]
  );

  return (
    <PlanificacionesContext.Provider
      value={{
        planificaciones: state.planificaciones,
        loaded: state.loaded,
        addPlanificacion,
        updatePlanificacion,
        deletePlanificacion,
        getPlanificacion,
        semanas: state.semanas,
        semanasLoaded: state.semanasLoaded,
        addSemana,
        updateSemana,
        deleteSemana,
        getSemana,
      }}
    >
      {children}
    </PlanificacionesContext.Provider>
  );
}

export function usePlanificaciones() {
  const ctx = useContext(PlanificacionesContext);
  if (!ctx) throw new Error("usePlanificaciones must be used within PlanificacionesProvider");
  return ctx;
}
