import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ACCESS_STORAGE_KEY = "@planificadoc_access";

/**
 * Lista de códigos de acceso válidos.
 * El propietario de la app puede agregar o quitar códigos aquí.
 * Cada código es único y se entrega al docente después de confirmar el pago.
 */
const VALID_CODES: string[] = [
  // Lote 1 — Códigos iniciales (agregar más según se vendan)
  "PLANIFICA2026",
  "DOCENTE001",
  "DOCENTE002",
  "DOCENTE003",
  "DOCENTE004",
  "DOCENTE005",
  "DOCENTE006",
  "DOCENTE007",
  "DOCENTE008",
  "DOCENTE009",
  "DOCENTE010",
  "DOCENTE011",
  "DOCENTE012",
  "DOCENTE013",
  "DOCENTE014",
  "DOCENTE015",
  "DOCENTE016",
  "DOCENTE017",
  "DOCENTE018",
  "DOCENTE019",
  "DOCENTE020",
  "PROFE001",
  "PROFE002",
  "PROFE003",
  "PROFE004",
  "PROFE005",
  "PROFE006",
  "PROFE007",
  "PROFE008",
  "PROFE009",
  "PROFE010",
  "EDUCA001",
  "EDUCA002",
  "EDUCA003",
  "EDUCA004",
  "EDUCA005",
  "EDUCA006",
  "EDUCA007",
  "EDUCA008",
  "EDUCA009",
  "EDUCA010",
  "PLAN001",
  "PLAN002",
  "PLAN003",
  "PLAN004",
  "PLAN005",
  "PLAN006",
  "PLAN007",
  "PLAN008",
  "PLAN009",
  "PLAN010",
];

/**
 * Verifica si un código es válido (case-insensitive, trimmed).
 */
export function isValidCode(code: string): boolean {
  const normalized = code.trim().toUpperCase();
  return VALID_CODES.includes(normalized);
}

/**
 * Obtiene la lista de códigos válidos (para testing).
 */
export function getValidCodes(): string[] {
  return [...VALID_CODES];
}

// --- Context & Provider ---

interface AccessContextValue {
  /** Whether the access state has been loaded from storage */
  loaded: boolean;
  /** Whether the user has unlocked access */
  hasAccess: boolean;
  /** The code that was used to unlock (if any) */
  activatedCode: string | null;
  /** Attempt to unlock with a code. Returns true if successful. */
  unlockWithCode: (code: string) => Promise<boolean>;
  /** Reset access (for testing/admin purposes) */
  resetAccess: () => Promise<void>;
}

const AccessContext = createContext<AccessContextValue | null>(null);

export function AccessProvider({ children }: { children: React.ReactNode }) {
  const [loaded, setLoaded] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [activatedCode, setActivatedCode] = useState<string | null>(null);

  // Load access state from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(ACCESS_STORAGE_KEY);
        if (raw) {
          const data = JSON.parse(raw);
          if (data.hasAccess && data.code) {
            setHasAccess(true);
            setActivatedCode(data.code);
          }
        }
      } catch {
        // If reading fails, default to no access
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const unlockWithCode = useCallback(async (code: string): Promise<boolean> => {
    const normalized = code.trim().toUpperCase();
    if (isValidCode(normalized)) {
      setHasAccess(true);
      setActivatedCode(normalized);
      await AsyncStorage.setItem(
        ACCESS_STORAGE_KEY,
        JSON.stringify({ hasAccess: true, code: normalized, activatedAt: new Date().toISOString() })
      );
      return true;
    }
    return false;
  }, []);

  const resetAccess = useCallback(async () => {
    setHasAccess(false);
    setActivatedCode(null);
    await AsyncStorage.removeItem(ACCESS_STORAGE_KEY);
  }, []);

  return (
    <AccessContext.Provider
      value={{ loaded, hasAccess, activatedCode, unlockWithCode, resetAccess }}
    >
      {children}
    </AccessContext.Provider>
  );
}

export function useAccess() {
  const ctx = useContext(AccessContext);
  if (!ctx) throw new Error("useAccess must be used within AccessProvider");
  return ctx;
}
