import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Alert,
  Modal,
} from "react-native";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import type { PlanificacionSemanal } from "@/data/types";
import { generarHTMLSemanal } from "@/lib/pdf-generator";
import { generarWordSemanal } from "@/lib/semanal-word-generator";
import { useColors } from "@/hooks/use-colors";

interface ExportModalProps {
  /** La planificación semanal a exportar */
  semana: PlanificacionSemanal;
  /** Label del botón detonador */
  triggerLabel?: string;
}

/**
 * Botón + modal de exportación para una Planificación Semanal.
 * En web: abre el HTML en una nueva ventana y dispara window.print().
 * En móvil: genera un PDF y abre el diálogo de compartir.
 */
export function ExportModal({ semana, triggerLabel = "Exportar" }: ExportModalProps) {
  const colors = useColors();
  const [visible, setVisible] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportingWord, setExportingWord] = useState(false);

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      const html = generarHTMLSemanal(semana);

      if (Platform.OS === "web") {
        const win = window.open("", "_blank");
        if (win) {
          win.document.write(html);
          win.document.close();
          win.focus();
          setTimeout(() => win.print(), 500);
        }
      } else {
        const { uri } = await Print.printToFileAsync({ html, base64: false });
        await shareAsync(uri, {
          UTI: ".pdf",
          mimeType: "application/pdf",
          dialogTitle: `Planificación Semanal ${semana.semanaInicio}`,
        });
      }
      setVisible(false);
    } catch (err) {
      console.error("Error al exportar PDF semanal:", err);
      if (Platform.OS !== "web") {
        Alert.alert("Error", "No se pudo generar el PDF. Intente nuevamente.", [{ text: "OK" }]);
      }
    } finally {
      setExporting(false);
    }
  };

  const handleExportWord = async () => {
    setExportingWord(true);
    try {
      const blob = await generarWordSemanal(semana);
      if (Platform.OS === "web") {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `PlanificacionSemanal-${semana.semanaInicio}.docx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        const arrayBuffer = await blob.arrayBuffer();
        const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
        const uri = `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${base64}`;
        await shareAsync(uri, {
          UTI: ".docx",
          mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          dialogTitle: `Planificación Semanal ${semana.semanaInicio}`,
        });
      }
      setVisible(false);
    } catch (err) {
      console.error("Error al exportar Word semanal:", err);
      if (Platform.OS !== "web") {
        Alert.alert("Error", "No se pudo generar el Word. Intente nuevamente.", [{ text: "OK" }]);
      }
    } finally {
      setExportingWord(false);
    }
  };

  return (
    <>
      {/* Botón detonador */}
      <Pressable
        onPress={() => setVisible(true)}
        style={({ pressed }) => [
          styles.trigger,
          { backgroundColor: "#003366", opacity: pressed ? 0.8 : 1 },
        ]}
      >
        <Text style={styles.triggerIcon}>📄</Text>
        <Text style={styles.triggerText}>{triggerLabel}</Text>
      </Pressable>

      {/* Modal de opciones */}
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setVisible(false)}>
          <View style={[styles.sheet, { backgroundColor: colors.background }]}>
            {/* Handle bar */}
            <View style={[styles.handle, { backgroundColor: colors.border }]} />

            <Text style={[styles.sheetTitle, { color: colors.foreground }]}>
              Exportar planificación semanal
            </Text>
            <Text style={[styles.sheetSubtitle, { color: colors.muted }]}>
              {semana.semanaInicio} — {semana.semanaFin}
            </Text>

            {/* Opción PDF */}
            <Pressable
              onPress={handleExportPDF}
              disabled={exporting || exportingWord}
              style={({ pressed }) => [
                styles.optionBtn,
                { backgroundColor: "#003366", opacity: pressed ? 0.8 : (exporting || exportingWord) ? 0.6 : 1 },
              ]}
            >
              {exporting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.optionIcon}>📄</Text>
              )}
              <View style={{ flex: 1 }}>
                <Text style={styles.optionTitle}>
                  {exporting ? "Generando PDF…" : "Exportar como PDF"}
                </Text>
                <Text style={styles.optionDesc}>
                  Formato oficial del Ministerio de Educación
                </Text>
              </View>
            </Pressable>

            {/* Opción Word */}
            <Pressable
              onPress={handleExportWord}
              disabled={exporting || exportingWord}
              style={({ pressed }) => [
                styles.optionBtn,
                { backgroundColor: "#1A56DB", opacity: pressed ? 0.8 : (exporting || exportingWord) ? 0.6 : 1 },
              ]}
            >
              {exportingWord ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.optionIcon}>📝</Text>
              )}
              <View style={{ flex: 1 }}>
                <Text style={styles.optionTitle}>
                  {exportingWord ? "Generando Word…" : "Exportar como Word"}
                </Text>
                <Text style={styles.optionDesc}>
                  Archivo .docx editable (Microsoft Word)
                </Text>
              </View>
            </Pressable>

            {/* Cancelar */}
            <Pressable
              onPress={() => setVisible(false)}
              style={({ pressed }) => [
                styles.cancelBtn,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Text style={[styles.cancelText, { color: colors.muted }]}>Cancelar</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  triggerIcon: { fontSize: 16 },
  triggerText: { color: "#fff", fontWeight: "600", fontSize: 14 },

  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 36,
    gap: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 8,
  },
  sheetTitle: { fontSize: 17, fontWeight: "700" },
  sheetSubtitle: { fontSize: 13, marginTop: -6 },

  optionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 12,
    padding: 14,
  },
  optionIcon: { fontSize: 24 },
  optionTitle: { color: "#fff", fontSize: 15, fontWeight: "600" },
  optionDesc: { color: "rgba(255,255,255,0.75)", fontSize: 12, marginTop: 1 },

  cancelBtn: {
    borderRadius: 12,
    padding: 13,
    borderWidth: 1,
    alignItems: "center",
    marginTop: 4,
  },
  cancelText: { fontSize: 15, fontWeight: "500" },
});
