import { useState, useCallback } from "react";
import { Platform, Alert } from "react-native";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Planificacion } from "@/data/types";
import { generarHTMLPlanificacion } from "@/lib/pdf-generator";

const API_BASE = "https://planificadoc.app";
const TEMPLATE_KEY = "@planificadoc_word_template";

export type ExportFormat = "pdf" | "docx";

export interface UseExportOptionsReturn {
  exportarPDF: (plan: Planificacion) => Promise<void>;
  exportarWord: (plan: Planificacion) => Promise<void>;
  subirPlantilla: () => Promise<void>;
  borrarPlantilla: () => Promise<void>;
  tieneTemplate: boolean;
  isExporting: boolean;
  exportFormat: ExportFormat | null;
}

/** Reads the stored Word template (base64) from AsyncStorage */
async function getTemplate(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(TEMPLATE_KEY);
  } catch {
    return null;
  }
}

/** Stores a Word template as base64 */
async function saveTemplate(base64: string): Promise<void> {
  await AsyncStorage.setItem(TEMPLATE_KEY, base64);
}

/** Picks a .docx file on web using a hidden <input> and returns base64 */
function pickDocxWeb(): Promise<string | null> {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return resolve(null);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        // result is "data:...;base64,XXXX"
        const base64 = result.split(",")[1];
        resolve(base64 ?? null);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  });
}

/** Downloads a blob on web */
function downloadBlobWeb(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

export function useExportOptions(): UseExportOptionsReturn {
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat | null>(null);
  const [tieneTemplate, setTieneTemplate] = useState(false);

  // Check template on mount
  useState(() => {
    getTemplate().then((t) => setTieneTemplate(!!t));
  });

  // ── PDF ─────────────────────────────────────────────────────────
  const exportarPDF = useCallback(async (plan: Planificacion) => {
    setIsExporting(true);
    setExportFormat("pdf");
    try {
      const html = generarHTMLPlanificacion(plan);

      if (Platform.OS === "web") {
        const printWindow = window.open("", "_blank");
        if (printWindow) {
          printWindow.document.write(html);
          printWindow.document.close();
          printWindow.focus();
          setTimeout(() => printWindow.print(), 500);
        }
      } else {
        const { uri } = await Print.printToFileAsync({
          html,
          base64: false,
          width: 842,  // A4 landscape width in points
          height: 595, // A4 landscape height in points
        });
        await shareAsync(uri, {
          UTI: ".pdf",
          mimeType: "application/pdf",
          dialogTitle: `Planificación ${plan.destreza.codigo}`,
        });
      }
    } catch (err) {
      console.error("[export] PDF error:", err);
      Alert.alert("Error", "No se pudo generar el PDF. Intente nuevamente.");
    } finally {
      setIsExporting(false);
      setExportFormat(null);
    }
  }, []);

  // ── Word ─────────────────────────────────────────────────────────
  const exportarWord = useCallback(async (plan: Planificacion) => {
    setIsExporting(true);
    setExportFormat("docx");
    try {
      const templateBase64 = await getTemplate();
      const filename = `Planificacion_${plan.destreza.codigo}_${Date.now()}.docx`;

      const res = await fetch(`${API_BASE}/api/export/docx`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, templateBase64 }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Error ${res.status}`);
      }

      const blob = await res.blob();

      if (Platform.OS === "web") {
        downloadBlobWeb(blob, filename);
      } else {
        // On mobile: save to cache then share
        const { FileSystem } = await import("expo-file-system");
        const path = `${FileSystem.cacheDirectory}${filename}`;
        const reader = new FileReader();
        const base64: string = await new Promise((resolve) => {
          reader.onload = () => resolve((reader.result as string).split(",")[1]);
          reader.readAsDataURL(blob);
        });
        await FileSystem.writeAsStringAsync(path, base64, {
          encoding: FileSystem.EncodingType.Base64,
        });
        await shareAsync(path, {
          UTI: ".docx",
          mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          dialogTitle: `Planificación ${plan.destreza.codigo}`,
        });
      }
    } catch (err: any) {
      console.error("[export] Word error:", err);
      const msg = Platform.OS === "web"
        ? `Error al generar Word: ${err.message}`
        : "No se pudo generar el Word. Intente nuevamente.";
      if (Platform.OS === "web") {
        alert(msg);
      } else {
        Alert.alert("Error", msg);
      }
    } finally {
      setIsExporting(false);
      setExportFormat(null);
    }
  }, []);

  // ── Template upload ───────────────────────────────────────────────
  const subirPlantilla = useCallback(async () => {
    try {
      let base64: string | null = null;

      if (Platform.OS === "web") {
        base64 = await pickDocxWeb();
      } else {
        // Mobile: use expo-document-picker if available
        try {
          const DocPicker = await import("expo-document-picker");
          const result = await DocPicker.getDocumentAsync({
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            copyToCacheDirectory: true,
          });
          if (result.canceled || !result.assets?.[0]) return;

          const { FileSystem } = await import("expo-file-system");
          base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {
            encoding: FileSystem.EncodingType.Base64,
          });
        } catch {
          Alert.alert(
            "Función no disponible",
            "La subida de plantillas en móvil requiere actualizar la app. Usa la versión web para subir tu plantilla.",
          );
          return;
        }
      }

      if (!base64) return;
      await saveTemplate(base64);
      setTieneTemplate(true);

      const msg = "✅ Plantilla guardada. Al exportar en Word se usará tu formato personalizado.\n\nAsegúrate de que tu plantilla tenga etiquetas como {{docente}}, {{destreza_desc}}, {{experiencia}}, etc.";
      if (Platform.OS === "web") alert(msg);
      else Alert.alert("Plantilla guardada", msg);
    } catch (err: any) {
      console.error("[template] upload error:", err);
    }
  }, []);

  const borrarPlantilla = useCallback(async () => {
    await AsyncStorage.removeItem(TEMPLATE_KEY);
    setTieneTemplate(false);
  }, []);

  return {
    exportarPDF,
    exportarWord,
    subirPlantilla,
    borrarPlantilla,
    tieneTemplate,
    isExporting,
    exportFormat,
  };
}
