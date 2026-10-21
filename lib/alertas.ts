/**
 * Alertas de la app con SweetAlert2 (web) y fallback nativo.
 *
 * `Alert.alert` de React Native NO se muestra en web (react-native-web lo
 * deja como no-op), así que en el navegador las validaciones y los errores
 * de generación parecían "no hacer nada". Este módulo unifica las alertas
 * en SweetAlert2 para que siempre se vean, manteniendo el diálogo nativo
 * en iOS/Android.
 *
 * Uso:
 *   await alertaError("Falta información", "Selecciona el trimestre.");
 *   const ok = await confirmar({ titulo: "¿Eliminar?", mensaje: "..." });
 */
import { Alert, Platform } from "react-native";

// sweetalert2/dist/sweetalert2.all.js inyecta sus estilos al DOM, así que no
// hace falta importar ningún .css (Metro/Expo no procesan CSS en web igual).
function swal(): typeof import("sweetalert2").default {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require("sweetalert2/dist/sweetalert2.all.js").default;
}

const BASE = {
  buttonsStyling: true,
  reverseButtons: true,
  confirmButtonColor: "#003366",
  cancelButtonColor: "#6c757d",
  fontFamily: "inherit",
  fontSize: 15,
};

/** Diálogo informativo/éxito. Devuelve siempre true (compatible con awaits). */
export async function alertaOk(
  titulo: string,
  mensaje?: string,
  icono: "success" | "info" | "warning" | "error" = "info"
): Promise<true> {
  if (Platform.OS !== "web") {
    Alert.alert(titulo, mensaje);
    return true;
  }
  await swal().fire({ ...BASE, title: titulo, text: mensaje, icon: icono });
  return true;
}

/** Error de validación o de generación. */
export function alertaError(titulo: string, mensaje?: string): Promise<true> {
  return alertaOk(titulo, mensaje, "error");
}

/** Éxito (exportación, regeneración, etc.). */
export function alertaExito(titulo: string, mensaje?: string): Promise<true> {
  return alertaOk(titulo, mensaje, "success");
}

/** Aviso. */
export function alertaAviso(titulo: string, mensaje?: string): Promise<true> {
  return alertaOk(titulo, mensaje, "warning");
}

export interface ConfirmacionOpts {
  titulo: string;
  mensaje?: string;
  textoOk?: string;
  textoCancelar?: string;
  /** "success" | "warning" | "error" | "info" | undefined */
  icono?: "success" | "info" | "warning" | "error" | "question";
}

/** Diálogo de confirmación. Devuelve true si el usuario confirma. */
export function confirmar({
  titulo,
  mensaje,
  textoOk = "Sí, continuar",
  textoCancelar = "Cancelar",
  icono = "question",
}: ConfirmacionOpts): Promise<boolean> {
  if (Platform.OS !== "web") {
    return new Promise((resolve) => {
      Alert.alert(titulo, mensaje, [
        { text: textoCancelar, style: "cancel", onPress: () => resolve(false) },
        { text: textoOk, onPress: () => resolve(true) },
      ]);
    });
  }
  return swal()
    .fire({
      ...BASE,
      title: titulo,
      text: mensaje,
      icon: icono,
      showCancelButton: true,
      confirmButtonText: textoOk,
      cancelButtonText: textoCancelar,
    })
    .then((r) => r.isConfirmed === true)
    .catch(() => false);
}
