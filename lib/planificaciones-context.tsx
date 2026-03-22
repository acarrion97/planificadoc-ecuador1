import React, { createContext, useContext, useEffect, useReducer, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Planificacion } from "@/data/types";

const STORAGE_KEY = "@planificadoc_planificaciones";

interface State {
  planificaciones: Planificacion[];
  loaded: boolean;
}

type Action =
  | { type: "SET_ALL"; payload: Planificacion[] }
  | { type: "ADD"; payload: Planificacion }
  | { type: "UPDATE"; payload: Planificacion }
  | { type: "DELETE"; payload: string };

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
}

const PlanificacionesContext = createContext<PlanificacionesContextValue | null>(null);

export function PlanificacionesProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { planificaciones: [], loaded: false });

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          dispatch({ type: "SET_ALL", payload: JSON.parse(raw) });
        } else {
          dispatch({ type: "SET_ALL", payload: [] });
        }
      } catch {
        dispatch({ type: "SET_ALL", payload: [] });
      }
    })();
  }, []);

  const persist = useCallback(async (planificaciones: Planificacion[]) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(planificaciones));
  }, []);

  const addPlanificacion = useCallback(async (p: Planificacion) => {
    dispatch({ type: "ADD", payload: p });
    const updated = [p, ...state.planificaciones];
    await persist(updated);
  }, [state.planificaciones, persist]);

  const updatePlanificacion = useCallback(async (p: Planificacion) => {
    dispatch({ type: "UPDATE", payload: p });
    const updated = state.planificaciones.map((x) => (x.id === p.id ? p : x));
    await persist(updated);
  }, [state.planificaciones, persist]);

  const deletePlanificacion = useCallback(async (id: string) => {
    dispatch({ type: "DELETE", payload: id });
    const updated = state.planificaciones.filter((x) => x.id !== id);
    await persist(updated);
  }, [state.planificaciones, persist]);

  const getPlanificacion = useCallback(
    (id: string) => state.planificaciones.find((p) => p.id === id),
    [state.planificaciones]
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
