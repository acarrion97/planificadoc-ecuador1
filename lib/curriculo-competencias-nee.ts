import { Alert, Platform } from "react-native";

/**
 * Tras guardar una planificación de Currículo por competencias con el switch
 * "¿Hay estudiantes con NEE en este paralelo?" activo, ofrece crear una
 * adaptación curricular individual a partir del plan. Sigue el patrón de
 * confirmación del repo: `confirm()` en web y `Alert.alert` en nativo.
 *
 * `onCrear` navega a Adaptación curricular con el plan como origen;
 * `onOmitir` sigue al detalle del plan (flujo normal de guardado).
 */
export function ofrecerAdaptacionNEE(onCrear: () => void, onOmitir: () => void): void {
  const titulo = "Estudiantes con NEE";
  const mensaje =
    "Indicaste que hay estudiantes con NEE en este paralelo. ¿Quieres crear ahora una adaptación curricular individual a partir de esta planificación? Puedes crear una por cada estudiante desde el detalle del plan.";

  if (Platform.OS === "web") {
    if (typeof window !== "undefined" && window.confirm(`${titulo}\n\n${mensaje}`)) onCrear();
    else onOmitir();
    return;
  }

  Alert.alert(titulo, mensaje, [
    { text: "Ahora no", style: "cancel", onPress: onOmitir },
    { text: "Crear adaptación", onPress: onCrear },
  ]);
}

/** Ruta de Adaptación curricular con un plan de Currículo por competencias como origen. */
export function rutaAdaptacionDesdeCurriculo(planId: number | string) {
  return { pathname: "/adaptacion-curricular", params: { cxcId: String(planId) } } as const;
}
