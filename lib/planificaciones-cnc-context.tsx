/**
 * Contexto de persistencia de "Conecta, Nivela y Crea" (CNC) — 100% SEPARADO de
 * lib/planificaciones-context.tsx (EGB/BGU) y de lib/planificaciones-bt-context.tsx
 * (Bachillerato Técnico). No se modifica ni se depende de ninguno de los dos:
 * mismo patrón interno (reducer + AsyncStorage), árbol de estado independiente,
 * para que el módulo CNC no pueda romper ningún flujo existente en producción.
 */
import React, { createContext, useContext, useEffect, useReducer, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { PlanConectaNivelaCrea } from "@/data/types-cnc";

const STORAGE_KEY_CNC = "@planificadoc_cnc_planes";

interface State {
  planesCNC: PlanConectaNivelaCrea[];
  planesCNCLoaded: boolean;
}

type Action =
  | { type: "SET_ALL_CNC"; payload: PlanConectaNivelaCrea[] }
  | { type: "ADD_CNC"; payload: PlanConectaNivelaCrea }
  | { type: "UPDATE_CNC"; payload: PlanConectaNivelaCrea }
  | { type: "DELETE_CNC"; payload: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_ALL_CNC":
      return { ...state, planesCNC: action.payload, planesCNCLoaded: true };
    case "ADD_CNC":
      return { ...state, planesCNC: [action.payload, ...state.planesCNC] };
    case "UPDATE_CNC":
      return {
        ...state,
        planesCNC: state.planesCNC.map((p) => (p.id === action.payload.id ? action.payload : p)),
      };
    case "DELETE_CNC":
      return { ...state, planesCNC: state.planesCNC.filter((p) => p.id !== action.payload) };
    default:
      return state;
  }
}

interface PlanificacionesCNCContextValue {
  planesCNC: PlanConectaNivelaCrea[];
  planesCNCLoaded: boolean;
  addPlanCNC: (p: PlanConectaNivelaCrea) => Promise<void>;
  updatePlanCNC: (p: PlanConectaNivelaCrea) => Promise<void>;
  deletePlanCNC: (id: string) => Promise<void>;
  getPlanCNC: (id: string) => PlanConectaNivelaCrea | undefined;
}

const PlanificacionesCNCContext = createContext<PlanificacionesCNCContextValue | null>(null);

export function PlanificacionesCNCProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    planesCNC: [],
    planesCNCLoaded: false,
  });

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY_CNC);
        dispatch({ type: "SET_ALL_CNC", payload: raw ? JSON.parse(raw) : [] });
      } catch {
        dispatch({ type: "SET_ALL_CNC", payload: [] });
      }
    })();
  }, []);

  const persistPlanes = useCallback(async (planes: PlanConectaNivelaCrea[]) => {
    await AsyncStorage.setItem(STORAGE_KEY_CNC, JSON.stringify(planes));
  }, []);

  const addPlanCNC = useCallback(async (p: PlanConectaNivelaCrea) => {
    dispatch({ type: "ADD_CNC", payload: p });
    await AsyncStorage.getItem(STORAGE_KEY_CNC).then((raw) => {
      const current: PlanConectaNivelaCrea[] = raw ? JSON.parse(raw) : [];
      persistPlanes([p, ...current]);
    });
  }, [persistPlanes]);

  const updatePlanCNC = useCallback(async (p: PlanConectaNivelaCrea) => {
    dispatch({ type: "UPDATE_CNC", payload: p });
    await AsyncStorage.getItem(STORAGE_KEY_CNC).then((raw) => {
      const current: PlanConectaNivelaCrea[] = raw ? JSON.parse(raw) : [];
      persistPlanes(current.map((x) => (x.id === p.id ? p : x)));
    });
  }, [persistPlanes]);

  const deletePlanCNC = useCallback(async (id: string) => {
    dispatch({ type: "DELETE_CNC", payload: id });
    await AsyncStorage.getItem(STORAGE_KEY_CNC).then((raw) => {
      const current: PlanConectaNivelaCrea[] = raw ? JSON.parse(raw) : [];
      persistPlanes(current.filter((x) => x.id !== id));
    });
  }, [persistPlanes]);

  const getPlanCNC = useCallback(
    (id: string) => state.planesCNC.find((p) => p.id === id),
    [state.planesCNC]
  );

  return (
    <PlanificacionesCNCContext.Provider
      value={{
        planesCNC: state.planesCNC,
        planesCNCLoaded: state.planesCNCLoaded,
        addPlanCNC,
        updatePlanCNC,
        deletePlanCNC,
        getPlanCNC,
      }}
    >
      {children}
    </PlanificacionesCNCContext.Provider>
  );
}

export function usePlanificacionesCNC() {
  const ctx = useContext(PlanificacionesCNCContext);
  if (!ctx) throw new Error("usePlanificacionesCNC must be used within PlanificacionesCNCProvider");
  return ctx;
}
