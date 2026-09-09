/**
 * Contexto de persistencia de Bachillerato Técnico (BT) — 100% SEPARADO de
 * lib/planificaciones-context.tsx (EGB/BGU). No se modifica ni se depende del
 * contexto existente: mismo patrón interno (reducer + AsyncStorage), árbol de
 * estado independiente, para que el módulo BT no pueda romper el flujo
 * EGB/BGU en producción.
 */
import React, { createContext, useContext, useEffect, useReducer, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { PlanUnidadTrabajoBT, CatalogoUsuarioBT, ModuloFormativoBTExtras, UnidadCompetencia } from "@/data/types-bt";
import { obtenerFiguraPorId, tieneCatalogoCompleto as tieneCatalogoCompletoEstatico, type ModuloFormativo } from "@/data/bachillerato-tecnico";
import { obtenerUnidadesCompetenciaDeModulo } from "@/data/bachillerato-tecnico-uc";

const STORAGE_KEY_BT = "@planificadoc_bt_planes";
const STORAGE_KEY_CATALOGO_BT = "@planificadoc_bt_catalogo_usuario";

const CATALOGO_VACIO: CatalogoUsuarioBT = { modulos: {}, unidadesCompetencia: [], moduloUnidadCompetencia: [] };

function claveModulo(figuraId: string, moduloCodigo: string) {
  return `${figuraId}::${moduloCodigo}`;
}

interface State {
  planesBT: PlanUnidadTrabajoBT[];
  planesBTLoaded: boolean;
  catalogoUsuarioBT: CatalogoUsuarioBT;
  catalogoUsuarioBTLoaded: boolean;
}

type Action =
  | { type: "SET_ALL_BT"; payload: PlanUnidadTrabajoBT[] }
  | { type: "ADD_BT"; payload: PlanUnidadTrabajoBT }
  | { type: "UPDATE_BT"; payload: PlanUnidadTrabajoBT }
  | { type: "DELETE_BT"; payload: string }
  | { type: "SET_CATALOGO_BT"; payload: CatalogoUsuarioBT };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_ALL_BT":
      return { ...state, planesBT: action.payload, planesBTLoaded: true };
    case "ADD_BT":
      return { ...state, planesBT: [action.payload, ...state.planesBT] };
    case "UPDATE_BT":
      return {
        ...state,
        planesBT: state.planesBT.map((p) => (p.id === action.payload.id ? action.payload : p)),
      };
    case "DELETE_BT":
      return { ...state, planesBT: state.planesBT.filter((p) => p.id !== action.payload) };
    case "SET_CATALOGO_BT":
      return { ...state, catalogoUsuarioBT: action.payload, catalogoUsuarioBTLoaded: true };
    default:
      return state;
  }
}

/** Módulo estático + lo ingresado por el usuario, combinado en memoria. */
export interface ModuloBTCombinado extends ModuloFormativo {
  unidadesCompetencia: UnidadCompetencia[];
}

interface PlanificacionesBTContextValue {
  planesBT: PlanUnidadTrabajoBT[];
  planesBTLoaded: boolean;
  addPlanBT: (p: PlanUnidadTrabajoBT) => Promise<void>;
  updatePlanBT: (p: PlanUnidadTrabajoBT) => Promise<void>;
  deletePlanBT: (id: string) => Promise<void>;
  getPlanBT: (id: string) => PlanUnidadTrabajoBT | undefined;

  catalogoUsuarioBT: CatalogoUsuarioBT;
  catalogoUsuarioBTLoaded: boolean;
  guardarCatalogoUsuarioBT: (
    figuraId: string,
    moduloCodigo: string,
    extras: ModuloFormativoBTExtras,
    nuevaUC?: UnidadCompetencia
  ) => Promise<void>;
  /** Módulo estático (si existe) combinado con lo que el usuario haya guardado. */
  obtenerCatalogoModulo: (figuraId: string, moduloCodigo: string) => ModuloBTCombinado | undefined;
  /** true si el módulo, ya combinado, tiene UC/RA suficientes para generar con IA sin completar catálogo. */
  moduloTieneCatalogoCompleto: (figuraId: string, moduloCodigo: string) => boolean;
}

const PlanificacionesBTContext = createContext<PlanificacionesBTContextValue | null>(null);

export function PlanificacionesBTProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    planesBT: [],
    planesBTLoaded: false,
    catalogoUsuarioBT: CATALOGO_VACIO,
    catalogoUsuarioBTLoaded: false,
  });

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY_BT);
        dispatch({ type: "SET_ALL_BT", payload: raw ? JSON.parse(raw) : [] });
      } catch {
        dispatch({ type: "SET_ALL_BT", payload: [] });
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY_CATALOGO_BT);
        dispatch({ type: "SET_CATALOGO_BT", payload: raw ? JSON.parse(raw) : CATALOGO_VACIO });
      } catch {
        dispatch({ type: "SET_CATALOGO_BT", payload: CATALOGO_VACIO });
      }
    })();
  }, []);

  const persistPlanes = useCallback(async (planes: PlanUnidadTrabajoBT[]) => {
    await AsyncStorage.setItem(STORAGE_KEY_BT, JSON.stringify(planes));
  }, []);

  const persistCatalogo = useCallback(async (catalogo: CatalogoUsuarioBT) => {
    await AsyncStorage.setItem(STORAGE_KEY_CATALOGO_BT, JSON.stringify(catalogo));
  }, []);

  const addPlanBT = useCallback(async (p: PlanUnidadTrabajoBT) => {
    dispatch({ type: "ADD_BT", payload: p });
    await AsyncStorage.getItem(STORAGE_KEY_BT).then((raw) => {
      const current: PlanUnidadTrabajoBT[] = raw ? JSON.parse(raw) : [];
      persistPlanes([p, ...current]);
    });
  }, [persistPlanes]);

  const updatePlanBT = useCallback(async (p: PlanUnidadTrabajoBT) => {
    dispatch({ type: "UPDATE_BT", payload: p });
    await AsyncStorage.getItem(STORAGE_KEY_BT).then((raw) => {
      const current: PlanUnidadTrabajoBT[] = raw ? JSON.parse(raw) : [];
      persistPlanes(current.map((x) => (x.id === p.id ? p : x)));
    });
  }, [persistPlanes]);

  const deletePlanBT = useCallback(async (id: string) => {
    dispatch({ type: "DELETE_BT", payload: id });
    await AsyncStorage.getItem(STORAGE_KEY_BT).then((raw) => {
      const current: PlanUnidadTrabajoBT[] = raw ? JSON.parse(raw) : [];
      persistPlanes(current.filter((x) => x.id !== id));
    });
  }, [persistPlanes]);

  const getPlanBT = useCallback(
    (id: string) => state.planesBT.find((p) => p.id === id),
    [state.planesBT]
  );

  const guardarCatalogoUsuarioBT = useCallback(
    async (figuraId: string, moduloCodigo: string, extras: ModuloFormativoBTExtras, nuevaUC?: UnidadCompetencia) => {
      const clave = claveModulo(figuraId, moduloCodigo);
      const actual = state.catalogoUsuarioBT;
      const nuevo: CatalogoUsuarioBT = {
        modulos: { ...actual.modulos, [clave]: { ...actual.modulos[clave], ...extras, estadoCatalogo: "completo" } },
        unidadesCompetencia: nuevaUC ? [...actual.unidadesCompetencia, nuevaUC] : actual.unidadesCompetencia,
        moduloUnidadCompetencia: nuevaUC
          ? [...actual.moduloUnidadCompetencia, { moduloId: moduloCodigo, unidadCompetenciaId: nuevaUC.id }]
          : actual.moduloUnidadCompetencia,
      };
      dispatch({ type: "SET_CATALOGO_BT", payload: nuevo });
      await persistCatalogo(nuevo);
    },
    [state.catalogoUsuarioBT, persistCatalogo]
  );

  const obtenerCatalogoModulo = useCallback(
    (figuraId: string, moduloCodigo: string): ModuloBTCombinado | undefined => {
      const figura = obtenerFiguraPorId(figuraId);
      const moduloEstatico = figura?.modulos.find((m) => m.codigo === moduloCodigo);
      if (!moduloEstatico) return undefined;

      const clave = claveModulo(figuraId, moduloCodigo);
      const extrasUsuario = state.catalogoUsuarioBT.modulos[clave];

      const ucEstaticas = obtenerUnidadesCompetenciaDeModulo(moduloCodigo);
      const ucIdsUsuario = state.catalogoUsuarioBT.moduloUnidadCompetencia
        .filter((r) => r.moduloId === moduloCodigo)
        .map((r) => r.unidadCompetenciaId);
      const ucUsuario = state.catalogoUsuarioBT.unidadesCompetencia.filter((uc) => ucIdsUsuario.includes(uc.id));

      return {
        ...moduloEstatico,
        ...(extrasUsuario || {}),
        unidadesCompetencia: [...ucEstaticas, ...ucUsuario],
      };
    },
    [state.catalogoUsuarioBT]
  );

  const moduloTieneCatalogoCompleto = useCallback(
    (figuraId: string, moduloCodigo: string): boolean => {
      const combinado = obtenerCatalogoModulo(figuraId, moduloCodigo);
      if (!combinado) return false;
      if (combinado.unidadesCompetencia.length > 0) return true;
      return tieneCatalogoCompletoEstatico(combinado);
    },
    [obtenerCatalogoModulo]
  );

  return (
    <PlanificacionesBTContext.Provider
      value={{
        planesBT: state.planesBT,
        planesBTLoaded: state.planesBTLoaded,
        addPlanBT,
        updatePlanBT,
        deletePlanBT,
        getPlanBT,
        catalogoUsuarioBT: state.catalogoUsuarioBT,
        catalogoUsuarioBTLoaded: state.catalogoUsuarioBTLoaded,
        guardarCatalogoUsuarioBT,
        obtenerCatalogoModulo,
        moduloTieneCatalogoCompleto,
      }}
    >
      {children}
    </PlanificacionesBTContext.Provider>
  );
}

export function usePlanificacionesBT() {
  const ctx = useContext(PlanificacionesBTContext);
  if (!ctx) throw new Error("usePlanificacionesBT must be used within PlanificacionesBTProvider");
  return ctx;
}
