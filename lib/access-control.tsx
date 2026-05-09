import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { getApiBaseUrl } from "@/constants/oauth";
import * as Crypto from "expo-crypto";

const ACCESS_STORAGE_KEY = "@planificadoc_access";

/**
 * Lista de códigos de acceso válidos (legacy - mantener para usuarios existentes).
 */
const VALID_CODES: string[] = [
  "PLANIFICA2026",
  "DOCENTE001", "DOCENTE002", "DOCENTE003", "DOCENTE004", "DOCENTE005",
  "DOCENTE006", "DOCENTE007", "DOCENTE008", "DOCENTE009", "DOCENTE010",
  "DOCENTE011", "DOCENTE012", "DOCENTE013", "DOCENTE014", "DOCENTE015",
  "DOCENTE016", "DOCENTE017", "DOCENTE018", "DOCENTE019", "DOCENTE020",
  "PROFE001", "PROFE002", "PROFE003", "PROFE004", "PROFE005",
  "PROFE006", "PROFE007", "PROFE008", "PROFE009", "PROFE010",
  "EDUCA001", "EDUCA002", "EDUCA003", "EDUCA004", "EDUCA005",
  "EDUCA006", "EDUCA007", "EDUCA008", "EDUCA009", "EDUCA010",
  "PLAN001", "PLAN002", "PLAN003", "PLAN004", "PLAN005",
  "PLAN006", "PLAN007", "PLAN008", "PLAN009", "PLAN010",
];

export function isValidCode(code: string): boolean {
  const normalized = code.trim().toUpperCase();
  return VALID_CODES.includes(normalized);
}

export function getValidCodes(): string[] {
  return [...VALID_CODES];
}

// --- Types ---

interface AccessState {
  hasAccess: boolean;
  method: "code" | "subscription" | null;
  code: string | null;
  email: string | null;
  subscriptionEndDate: string | null;
  activatedAt: string | null;
}

interface AccessContextValue {
  loaded: boolean;
  hasAccess: boolean;
  activatedCode: string | null;
  subscribedEmail: string | null;
  subscriptionEndDate: string | null;
  accessMethod: "code" | "subscription" | null;
  unlockWithCode: (code: string) => Promise<boolean>;
  unlockWithSubscription: (email: string) => Promise<boolean>;
  checkSubscriptionStatus: (email: string) => Promise<{
    active: boolean;
    endDate?: string;
    pricing?: { amount: number; label: string; isPromo: boolean };
  }>;
  resetAccess: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
}

const AccessContext = createContext<AccessContextValue | null>(null);

export function AccessProvider({ children }: { children: React.ReactNode }) {
  const [loaded, setLoaded] = useState(false);
  const [state, setState] = useState<AccessState>({
    hasAccess: false,
    method: null,
    code: null,
    email: null,
    subscriptionEndDate: null,
    activatedAt: null,
  });

  // Load access state from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(ACCESS_STORAGE_KEY);
        if (raw) {
          const data = JSON.parse(raw);
          if (data.hasAccess) {
            // If subscription-based, verify it's still active
            if (data.method === "subscription" && data.email) {
              try {
                const result = await checkSubscriptionStatusAPI(data.email);
                if (result.active) {
                  setState({
                    hasAccess: true,
                    method: "subscription",
                    code: null,
                    email: data.email,
                    subscriptionEndDate: result.endDate || data.subscriptionEndDate,
                    activatedAt: data.activatedAt,
                  });
                } else {
                  // Subscription expired
                  setState({
                    hasAccess: false,
                    method: null,
                    code: null,
                    email: data.email,
                    subscriptionEndDate: null,
                    activatedAt: null,
                  });
                  await AsyncStorage.setItem(
                    ACCESS_STORAGE_KEY,
                    JSON.stringify({ hasAccess: false, email: data.email })
                  );
                }
              } catch {
                // Network error - trust cached state if end date is in the future
                if (data.subscriptionEndDate && new Date(data.subscriptionEndDate) > new Date()) {
                  setState({
                    hasAccess: true,
                    method: "subscription",
                    code: null,
                    email: data.email,
                    subscriptionEndDate: data.subscriptionEndDate,
                    activatedAt: data.activatedAt,
                  });
                } else {
                  setState({
                    hasAccess: false,
                    method: null,
                    code: null,
                    email: data.email,
                    subscriptionEndDate: null,
                    activatedAt: null,
                  });
                }
              }
            } else if (data.code) {
              // Code-based access (legacy)
              setState({
                hasAccess: true,
                method: "code",
                code: data.code,
                email: null,
                subscriptionEndDate: null,
                activatedAt: data.activatedAt,
              });
            }
          }
        }
      } catch {
        // Default to no access
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const unlockWithCode = useCallback(async (code: string): Promise<boolean> => {
    const normalized = code.trim().toUpperCase();
    if (isValidCode(normalized)) {
      const newState: AccessState = {
        hasAccess: true,
        method: "code",
        code: normalized,
        email: null,
        subscriptionEndDate: null,
        activatedAt: new Date().toISOString(),
      };
      setState(newState);
      await AsyncStorage.setItem(ACCESS_STORAGE_KEY, JSON.stringify(newState));

      // Register code activation on server for admin tracking
      try {
        let deviceId: string = (await AsyncStorage.getItem("@planificadoc_device_id")) || "";
        if (!deviceId) {
          deviceId = Crypto.randomUUID();
          await AsyncStorage.setItem("@planificadoc_device_id", deviceId);
        }
        const baseUrl = getApiBaseUrl();
        fetch(`${baseUrl}/api/code/activate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: normalized,
            deviceId,
            platform: Platform.OS,
          }),
        }).catch(() => {}); // Fire and forget
      } catch {
        // Don't block user if tracking fails
      }

      return true;
    }
    return false;
  }, []);

  const unlockWithSubscription = useCallback(async (email: string): Promise<boolean> => {
    try {
      const result = await checkSubscriptionStatusAPI(email);
      if (result.active) {
        const newState: AccessState = {
          hasAccess: true,
          method: "subscription",
          code: null,
          email: email.toLowerCase(),
          subscriptionEndDate: result.endDate || null,
          activatedAt: new Date().toISOString(),
        };
        setState(newState);
        await AsyncStorage.setItem(ACCESS_STORAGE_KEY, JSON.stringify(newState));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const checkSubscriptionStatus = useCallback(
    async (email: string) => {
      return checkSubscriptionStatusAPI(email);
    },
    []
  );

  const refreshSubscription = useCallback(async () => {
    if (state.method === "subscription" && state.email) {
      try {
        const result = await checkSubscriptionStatusAPI(state.email);
        if (result.active) {
          const newState: AccessState = {
            ...state,
            hasAccess: true,
            subscriptionEndDate: result.endDate || state.subscriptionEndDate,
          };
          setState(newState);
          await AsyncStorage.setItem(ACCESS_STORAGE_KEY, JSON.stringify(newState));
        } else {
          const newState: AccessState = {
            ...state,
            hasAccess: false,
            subscriptionEndDate: null,
          };
          setState(newState);
          await AsyncStorage.setItem(ACCESS_STORAGE_KEY, JSON.stringify(newState));
        }
      } catch {
        // Keep current state on network error
      }
    }
  }, [state]);

  const resetAccess = useCallback(async () => {
    setState({
      hasAccess: false,
      method: null,
      code: null,
      email: null,
      subscriptionEndDate: null,
      activatedAt: null,
    });
    await AsyncStorage.removeItem(ACCESS_STORAGE_KEY);
  }, []);

  return (
    <AccessContext.Provider
      value={{
        loaded,
        hasAccess: state.hasAccess,
        activatedCode: state.code,
        subscribedEmail: state.email,
        subscriptionEndDate: state.subscriptionEndDate,
        accessMethod: state.method,
        unlockWithCode,
        unlockWithSubscription,
        checkSubscriptionStatus,
        resetAccess,
        refreshSubscription,
      }}
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

// --- API Helper ---

async function checkSubscriptionStatusAPI(email: string): Promise<{
  active: boolean;
  endDate?: string;
  pricing?: { amount: number; label: string; isPromo: boolean };
}> {
  try {
    const baseUrl = getApiBaseUrl();
    const url = `${baseUrl}/api/payment/status?email=${encodeURIComponent(email)}`;
    const response = await fetch(url, { credentials: "include" });
    const data = await response.json();
    return {
      active: data.active === true,
      endDate: data.endDate,
      pricing: data.pricing,
    };
  } catch {
    return { active: false };
  }
}
