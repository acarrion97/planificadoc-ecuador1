/**
 * Retícula y tarjeta de creación de Mis planes (spec `mis-planes-gestion`).
 *
 * Las 7 entradas de creación comparten un único componente para que la cuadrícula
 * sea coherente: 3 columnas en escritorio, 2 en tablet y 1 en móvil.
 *
 * Lenguaje cromático: **sin relleno de color**. El color del módulo vive solo en
 * el borde de 1.5px y en la flecha; el fondo es `colors.surface` (light y dark).
 * El relieve lo aporta la sombra (offset 4 / radio 10).
 *
 * El ancho de celda es un porcentaje del contenedor (no del ancho de ventana),
 * así el sidebar —240px, 64px o drawer— no descuadra la retícula.
 */
import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";

import { useColors } from "@/hooks/use-colors";

/** Columnas de la retícula según el ancho de pantalla. */
export function useCreateColumns(): 1 | 2 | 3 {
  const { width } = useWindowDimensions();
  if (width >= 1080) return 3;
  if (width >= 720) return 2;
  return 1;
}

/** Contenedor de la retícula: fila envolvente con hueco de 12px en ambos ejes. */
export function CreateGrid({ children }: { children: ReactNode }) {
  return <View style={styles.grid}>{children}</View>;
}

export interface CreateCardProps {
  /** Emoji del módulo. */
  icono: string;
  titulo: string;
  subtitulo: string;
  /** Color del módulo: solo borde y flecha, nunca relleno. */
  color: string;
  onPress: () => void;
}

export function CreateCard({ icono, titulo, subtitulo, color, onPress }: CreateCardProps) {
  const colors = useColors();
  const columnas = useCreateColumns();
  // 31.5% / 48% dejan holgura para los huecos de 12px (3×31.5 + 2×12px ≤ 100%).
  const ancho = columnas === 3 ? "31.5%" : columnas === 2 ? "48%" : "100%";

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={titulo}
      style={({ pressed }) => [
        styles.card,
        {
          width: ancho,
          backgroundColor: colors.surface,
          borderColor: color,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <Text style={styles.icono}>{icono}</Text>
      <View style={{ flex: 1 }}>
        <Text style={[styles.titulo, { color: colors.foreground }]}>{titulo}</Text>
        <Text style={[styles.subtitulo, { color: colors.muted }]}>{subtitulo}</Text>
      </View>
      <Text style={[styles.flecha, { color }]}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 4,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    padding: 16,
    gap: 12,
    // Sin relleno de color: el color de módulo vive solo en el borde y la flecha.
    borderWidth: 1.5,
    // Relieve.
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 4,
  },
  icono: { fontSize: 26 },
  titulo: { fontSize: 15, fontWeight: "700" },
  subtitulo: { fontSize: 12, marginTop: 2 },
  flecha: { fontSize: 24, fontWeight: "300" },
});
