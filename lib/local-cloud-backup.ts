import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";

export type TipoPlanificacionLocal = "diario" | "semanal" | "bt" | "cnc" | "evaluacion";

export interface RegistroPlanificacionLocal {
  tipo: string;
  itemId: string;
  form: string;
}

let deviceSessionPromise: Promise<string> | null = null;

export function getDeviceSessionId(): Promise<string> {
  if (!deviceSessionPromise) {
    deviceSessionPromise = (async () => {
      const current = await AsyncStorage.getItem("@planificadoc_device_id");
      if (current) return current;

      const id = Crypto.randomUUID();
      await AsyncStorage.setItem("@planificadoc_device_id", id);
      return id;
    })().catch((error: unknown) => {
      deviceSessionPromise = null;
      throw error;
    });
  }
  return deviceSessionPromise;
}

export function mergeMissingById<T extends { id: string }>(
  local: T[],
  backups: RegistroPlanificacionLocal[],
  tipo: TipoPlanificacionLocal,
): T[] {
  const merged = [...local];
  const ids = new Set(local.map((item) => item.id));

  for (const backup of backups) {
    if (backup.tipo !== tipo || ids.has(backup.itemId)) continue;
    try {
      const parsed: unknown = JSON.parse(backup.form);
      if (
        typeof parsed !== "object" ||
        parsed === null ||
        !("id" in parsed) ||
        parsed.id !== backup.itemId
      ) {
        console.warn(`[${tipo}] cloud backup has a mismatched id; skipped`);
        continue;
      }

      merged.push(parsed as T);
      ids.add(backup.itemId);
    } catch (error) {
      console.warn(`[${tipo}] cloud backup could not be parsed; skipped:`, error);
    }
  }

  return merged;
}
