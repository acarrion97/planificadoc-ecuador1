import { Slot } from "expo-router";

/**
 * Layout del grupo de rutas `(tabs)`.
 *
 * El nombre del grupo se conserva porque dependen de él `unstable_settings.anchor`
 * y varios `push("/(tabs)/…")` (design D1). La navegación visible (sidebar /
 * encabezado + drawer) vive ahora en `components/app-navigation.tsx`, que el
 * layout raíz monta alrededor del `<Stack/>`; por lo tanto este layout solo
 * deja pasar el contenido.
 */
export default function TabLayout() {
  return <Slot />;
}
