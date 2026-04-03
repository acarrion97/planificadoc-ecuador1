import { useState, useCallback } from "react";
import { Platform, Alert } from "react-native";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import { Planificacion } from "@/data/types";
import { generarHTMLPlanificacion } from "@/lib/pdf-generator";

interface UseExportPdfReturn {
  exportarPDF: (plan: Planificacion) => Promise<void>;
  isExporting: boolean;
}

/**
 * Hook para exportar una planificación a PDF.
 * En móvil genera el PDF y abre el diálogo de compartir.
 * En web abre la ventana de impresión del navegador.
 */
export function useExportPdf(): UseExportPdfReturn {
  const [isExporting, setIsExporting] = useState(false);

  const exportarPDF = useCallback(async (plan: Planificacion) => {
    setIsExporting(true);
    try {
      const html = generarHTMLPlanificacion(plan);

      if (Platform.OS === "web") {
        // En web, crear un iframe oculto con el HTML y abrir diálogo de impresión
        const printWindow = window.open("", "_blank");
        if (printWindow) {
          printWindow.document.write(html);
          printWindow.document.close();
          printWindow.focus();
          setTimeout(() => {
            printWindow.print();
          }, 500);
        }
      } else {
        // En móvil, generar PDF y compartir
        const { uri } = await Print.printToFileAsync({
          html,
          base64: false,
        });

        await shareAsync(uri, {
          UTI: ".pdf",
          mimeType: "application/pdf",
          dialogTitle: `Planificación ${plan.destreza.codigo}`,
        });
      }
    } catch (error) {
      console.error("Error al exportar PDF:", error);
      if (Platform.OS !== "web") {
        Alert.alert(
          "Error",
          "No se pudo generar el PDF. Intente nuevamente.",
          [{ text: "OK" }]
        );
      }
    } finally {
      setIsExporting(false);
    }
  }, []);

  return { exportarPDF, isExporting };
}
