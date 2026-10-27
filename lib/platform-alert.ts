import { Alert, Platform } from "react-native";

export function mostrarAlerta(titulo: string, mensaje: string): void {
  if (Platform.OS === "web") {
    alert(titulo ? `${titulo}\n\n${mensaje}` : mensaje);
    return;
  }
  Alert.alert(titulo, mensaje);
}
