import {
  View,
  Text,
  Modal,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from "react-native";
import { useColors } from "@/hooks/use-colors";
import { useExportOptions } from "@/hooks/use-export-options";
import type { Planificacion } from "@/data/types";

interface ExportModalProps {
  visible: boolean;
  onClose: () => void;
  plan: Planificacion;
  isEFL?: boolean;
}

export function ExportModal({ visible, onClose, plan, isEFL = false }: ExportModalProps) {
  const colors = useColors();
  const {
    exportarPDF,
    exportarWord,
    subirPlantilla,
    borrarPlantilla,
    tieneTemplate,
    isExporting,
    exportFormat,
  } = useExportOptions();

  const handleExportPDF = async () => {
    onClose();
    await exportarPDF(plan);
  };

  const handleExportWord = async () => {
    onClose();
    await exportarWord(plan);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[
            styles.sheet,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
          onPress={() => {}}
        >
          {/* Title */}
          <View style={styles.header}>
            <Text style={{ fontSize: 20 }}>{"📤"}</Text>
            <Text style={[styles.title, { color: colors.foreground }]}>
              {isEFL ? "Export Lesson Plan" : "Exportar planificación"}
            </Text>
          </View>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            {isEFL
              ? "Choose a format to export your lesson plan"
              : "Elige el formato para exportar tu planificación"}
          </Text>

          {/* PDF Button */}
          <Pressable
            onPress={handleExportPDF}
            disabled={isExporting}
            style={({ pressed }) => [
              styles.exportBtn,
              { backgroundColor: "#CC0000", opacity: pressed || isExporting ? 0.7 : 1 },
            ]}
          >
            {isExporting && exportFormat === "pdf" ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={{ fontSize: 22 }}>{"📄"}</Text>
            )}
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.exportBtnTitle}>
                {isEFL ? "Export as PDF" : "Exportar en PDF"}
              </Text>
              <Text style={styles.exportBtnSub}>
                {isEFL
                  ? "Horizontal A4 · Ready to print"
                  : "Horizontal A4 · Listo para imprimir"}
              </Text>
            </View>
            <Text style={{ fontSize: 16, color: "#fff99" }}>{"›"}</Text>
          </Pressable>

          {/* Word Button */}
          <Pressable
            onPress={handleExportWord}
            disabled={isExporting}
            style={({ pressed }) => [
              styles.exportBtn,
              { backgroundColor: "#2B579A", opacity: pressed || isExporting ? 0.7 : 1 },
            ]}
          >
            {isExporting && exportFormat === "docx" ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={{ fontSize: 22 }}>{"📝"}</Text>
            )}
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.exportBtnTitle}>
                {isEFL ? "Export as Word (.docx)" : "Exportar en Word (.docx)"}
              </Text>
              <Text style={styles.exportBtnSub}>
                {tieneTemplate
                  ? (isEFL ? "Using your custom template" : "Usando tu plantilla personalizada")
                  : (isEFL ? "Standard MinEduc format · Editable" : "Formato MinEduc estándar · Editable")}
              </Text>
            </View>
            <Text style={{ fontSize: 16, color: "#fff99" }}>{"›"}</Text>
          </Pressable>

          {/* Template section */}
          <View style={[styles.templateSection, { borderColor: colors.border }]}>
            <Text style={[styles.templateTitle, { color: colors.foreground }]}>
              {"🗂️ "}
              {isEFL ? "Custom Word Template" : "Plantilla Word personalizada"}
            </Text>
            <Text style={[styles.templateDesc, { color: colors.muted }]}>
              {isEFL
                ? "Upload your institution's .docx template with {{tags}} like {{docente}}, {{destreza_desc}}, {{experiencia}}, etc."
                : "Sube la plantilla .docx de tu institución con etiquetas {{tags}} como {{docente}}, {{destreza_desc}}, {{experiencia}}, etc."}
            </Text>

            <View style={styles.templateBtns}>
              <Pressable
                onPress={subirPlantilla}
                style={({ pressed }) => [
                  styles.templateBtn,
                  {
                    backgroundColor: tieneTemplate ? colors.border : "#003366",
                    opacity: pressed ? 0.7 : 1,
                    flex: 1,
                  },
                ]}
              >
                <Text style={{ fontSize: 14 }}>{"⬆️"}</Text>
                <Text
                  style={[
                    styles.templateBtnText,
                    { color: tieneTemplate ? colors.foreground : "#fff" },
                  ]}
                >
                  {tieneTemplate
                    ? (isEFL ? "Replace template" : "Cambiar plantilla")
                    : (isEFL ? "Upload template" : "Subir plantilla")}
                </Text>
              </Pressable>

              {tieneTemplate && (
                <Pressable
                  onPress={borrarPlantilla}
                  style={({ pressed }) => [
                    styles.templateBtn,
                    {
                      backgroundColor: "#FEE2E2",
                      opacity: pressed ? 0.7 : 1,
                      marginLeft: 8,
                    },
                  ]}
                >
                  <Text style={{ fontSize: 14 }}>{"🗑️"}</Text>
                  <Text style={[styles.templateBtnText, { color: "#DC2626" }]}>
                    {isEFL ? "Remove" : "Borrar"}
                  </Text>
                </Pressable>
              )}
            </View>

            {tieneTemplate && (
              <View style={styles.templateActiveBadge}>
                <View style={styles.templateActiveDot} />
                <Text style={styles.templateActiveText}>
                  {isEFL ? "Custom template active" : "Plantilla personalizada activa"}
                </Text>
              </View>
            )}
          </View>

          {/* Cancel */}
          <Pressable
            onPress={onClose}
            style={({ pressed }) => [
              styles.cancelBtn,
              { borderColor: colors.border, opacity: pressed ? 0.6 : 1 },
            ]}
          >
            <Text style={[styles.cancelText, { color: colors.muted }]}>
              {isEFL ? "Cancel" : "Cancelar"}
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === "ios" ? 36 : 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 13,
    marginBottom: 16,
  },
  exportBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  exportBtnTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  exportBtnSub: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 12,
    marginTop: 1,
  },
  templateSection: {
    borderTopWidth: 1,
    paddingTop: 14,
    marginTop: 6,
    marginBottom: 10,
  },
  templateTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  templateDesc: {
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 10,
  },
  templateBtns: {
    flexDirection: "row",
    alignItems: "center",
  },
  templateBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    gap: 6,
  },
  templateBtnText: {
    fontSize: 13,
    fontWeight: "600",
  },
  templateActiveBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 6,
  },
  templateActiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#22C55E",
  },
  templateActiveText: {
    fontSize: 12,
    color: "#22C55E",
    fontWeight: "600",
  },
  cancelBtn: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  cancelText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
