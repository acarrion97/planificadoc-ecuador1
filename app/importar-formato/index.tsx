import React, { useCallback, useState } from "react";
import { View, Text, Pressable, StyleSheet, Alert, ActivityIndicator, Platform } from "react-native";
import { useRouter } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAccess } from "@/lib/access-control";
import { trpc } from "@/lib/trpc";

const MIME_TYPES_ACEPTADOS = [
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/pdf",
];
const EXTENSIONES_ACEPTADAS = ["doc", "docx", "pdf"];
const TAMANO_MAXIMO_MB = 15;

async function getSessionId(): Promise<string> {
  let id = await AsyncStorage.getItem("@planificadoc_device_id");
  if (!id) {
    id = Math.random().toString(36).substr(2, 16) + Date.now().toString(36);
    await AsyncStorage.setItem("@planificadoc_device_id", id);
  }
  return id;
}

function extensionDe(nombre: string): string | null {
  const match = /\.([a-zA-Z0-9]+)$/.exec(nombre.trim());
  return match?.[1]?.toLowerCase() ?? null;
}

/** Lee el contenido del archivo elegido como base64, sea web (asset.base64) o nativo (expo-file-system). */
async function leerComoBase64(asset: DocumentPicker.DocumentPickerAsset): Promise<string> {
  if (asset.base64) return asset.base64;
  // Mismo patrón que app/pca-preview/[id].tsx — los tipos instalados de
  // expo-file-system no exponen `EncodingType` en su nivel superior todavía.
  const FileSystem: any = await import("expo-file-system");
  return FileSystem.readAsStringAsync(asset.uri, { encoding: FileSystem.EncodingType.Base64 });
}

export default function ImportarFormatoScreen() {
  const colors = useColors();
  const router = useRouter();
  const { subscribedEmail, authEmail } = useAccess();
  const emailParaImportar = subscribedEmail ?? authEmail ?? undefined;

  const [archivo, setArchivo] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [procesando, setProcesando] = useState(false);
  const [estadoTexto, setEstadoTexto] = useState("");
  const subir = trpc.importarFormato.subirYProcesar.useMutation();

  const handleSeleccionar = useCallback(async () => {
    const resultado = await DocumentPicker.getDocumentAsync({
      type: MIME_TYPES_ACEPTADOS,
      copyToCacheDirectory: true,
      multiple: false,
      base64: true,
    });
    if (resultado.canceled || !resultado.assets?.[0]) return;

    const asset = resultado.assets[0];
    const extension = extensionDe(asset.name);
    if (!extension || !EXTENSIONES_ACEPTADAS.includes(extension)) {
      Alert.alert("Formato no soportado", "Sube un archivo .doc, .docx o .pdf.");
      return;
    }
    if (asset.size && asset.size > TAMANO_MAXIMO_MB * 1024 * 1024) {
      Alert.alert("Archivo muy grande", `El archivo excede el límite de ${TAMANO_MAXIMO_MB} MB.`);
      return;
    }

    setArchivo(asset);
  }, []);

  const handleImportar = useCallback(async () => {
    if (!archivo) return;
    setProcesando(true);
    setEstadoTexto("Subiendo documento...");
    try {
      const sessionId = await getSessionId();
      const fileBase64 = await leerComoBase64(archivo);

      setEstadoTexto("Analizando documento...");
      const resultado = await subir.mutateAsync({
        sessionId,
        email: emailParaImportar,
        fileName: archivo.name,
        mimeType: archivo.mimeType || "application/octet-stream",
        fileBase64,
      });

      if (resultado.success) {
        router.replace(`/pca-preview/${resultado.pcaId}` as any);
      } else {
        Alert.alert("No se pudo importar", resultado.error);
      }
    } catch (err: any) {
      Alert.alert("Error", err.message || "Error de conexión. Verifica tu internet.");
    } finally {
      setProcesando(false);
      setEstadoTexto("");
    }
  }, [archivo, emailParaImportar, router, subir]);

  return (
    <ScreenContainer>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={{ fontSize: 22 }}>←</Text>
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>Importar formato</Text>
          <Text style={[styles.headerSub, { color: colors.muted }]}>Sube tu PCA en Word o PDF y complétala con IA</Text>
        </View>
      </View>

      <View style={{ padding: 20, gap: 16 }}>
        <Text style={{ color: colors.muted, fontSize: 13, lineHeight: 19 }}>
          Sube el formato oficial del Ministerio de Educación (PCA) en .doc, .docx o .pdf — en blanco o
          parcialmente llenado a mano. Reconoceremos su estructura y completaremos los campos vacíos con IA,
          usando tus planificaciones guardadas cuando correspondan.
        </Text>

        <Pressable
          onPress={handleSeleccionar}
          disabled={procesando}
          style={({ pressed }) => [
            styles.dropZone,
            { borderColor: colors.border, opacity: pressed || procesando ? 0.7 : 1 },
          ]}
        >
          <Text style={{ fontSize: 32 }}>📄</Text>
          <Text style={[styles.dropZoneText, { color: colors.foreground }]}>
            {archivo ? archivo.name : "Toca para elegir un archivo"}
          </Text>
          <Text style={[styles.dropZoneSub, { color: colors.muted }]}>.doc · .docx · .pdf — máx. {TAMANO_MAXIMO_MB} MB</Text>
        </Pressable>

        <Pressable
          onPress={handleImportar}
          disabled={!archivo || procesando}
          style={({ pressed }) => [
            styles.importBtn,
            { opacity: !archivo || procesando ? 0.5 : pressed ? 0.85 : 1 },
          ]}
        >
          {procesando ? (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <ActivityIndicator color="#fff" size="small" />
              <Text style={styles.importBtnText}>{estadoTexto || "Procesando..."}</Text>
            </View>
          ) : (
            <Text style={styles.importBtnText}>Importar y completar con IA</Text>
          )}
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 10,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 17, fontWeight: "800" },
  headerSub: { fontSize: 12 },
  dropZone: {
    borderWidth: 2,
    borderStyle: Platform.OS === "web" ? "dashed" : "solid",
    borderRadius: 16,
    paddingVertical: 36,
    alignItems: "center",
    gap: 6,
  },
  dropZoneText: { fontSize: 14, fontWeight: "700", textAlign: "center", paddingHorizontal: 20 },
  dropZoneSub: { fontSize: 12 },
  importBtn: {
    backgroundColor: "#003366",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  importBtnText: { color: "#fff", fontWeight: "800", fontSize: 15 },
});
