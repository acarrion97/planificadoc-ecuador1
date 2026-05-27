import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
  Platform,
} from "react-native";
import { useColors } from "@/hooks/use-colors";
import { Destreza } from "@/data/types";

export interface DcdSeleccionada {
  codigo: string;
  enunciado: string;
}

interface Props {
  destrezas: Destreza[];
  value: DcdSeleccionada[];
  onChange: (selected: DcdSeleccionada[]) => void;
  placeholder?: string;
}

export function DcdMultiSelector({ destrezas, value, onChange, placeholder }: Props) {
  const colors = useColors();
  const [query, setQuery] = useState("");

  // Filtrado en memoria — instantáneo, sin red
  const filtered = useMemo(() => {
    if (!query.trim()) return destrezas.slice(0, 80); // primeras 80 si no hay búsqueda
    const q = query.trim().toLowerCase();
    return destrezas.filter(
      d =>
        d.codigo.toLowerCase().includes(q) ||
        d.descripcion.toLowerCase().includes(q)
    ).slice(0, 80);
  }, [destrezas, query]);

  const selectedCodes = useMemo(() => new Set(value.map(d => d.codigo)), [value]);

  const toggle = useCallback((d: Destreza) => {
    if (selectedCodes.has(d.codigo)) {
      onChange(value.filter(s => s.codigo !== d.codigo));
    } else {
      onChange([...value, { codigo: d.codigo, enunciado: d.descripcion }]);
    }
  }, [value, onChange, selectedCodes]);

  const remove = useCallback((codigo: string) => {
    onChange(value.filter(s => s.codigo !== codigo));
  }, [value, onChange]);

  return (
    <View>
      {/* Chips de seleccionadas */}
      {value.length > 0 && (
        <View style={styles.chipsWrap}>
          {value.map(d => (
            <View
              key={d.codigo}
              style={[styles.chip, { backgroundColor: "#EEEDFE", borderColor: "#7C3AED" }]}
            >
              <Text style={[styles.chipText, { color: "#4C1D95" }]}>{d.codigo}</Text>
              <Pressable onPress={() => remove(d.codigo)} hitSlop={6} style={styles.chipX}>
                <Text style={{ color: "#7C3AED", fontSize: 13, fontWeight: "700" }}>×</Text>
              </Pressable>
            </View>
          ))}
        </View>
      )}

      {/* Buscador */}
      <TextInput
        style={[styles.search, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.surface }]}
        value={query}
        onChangeText={setQuery}
        placeholder={placeholder || "Buscar por código (ej: CN.4.1) o palabra clave..."}
        placeholderTextColor={colors.muted}
        autoCorrect={false}
        autoCapitalize="none"
      />

      {/* Lista */}
      <View
        style={[styles.listBox, { borderColor: colors.border, backgroundColor: colors.surface }]}
      >
        {filtered.length === 0 ? (
          <Text style={[styles.empty, { color: colors.muted }]}>
            {query ? "Sin resultados. Intenta con otro código o palabra." : "Ingresa Área + Subnivel + Grado primero."}
          </Text>
        ) : (
          <ScrollView style={{ maxHeight: 280 }} nestedScrollEnabled keyboardShouldPersistTaps="handled">
            {filtered.map((d, idx) => {
              const sel = selectedCodes.has(d.codigo);
              return (
                <Pressable
                  key={d.codigo}
                  onPress={() => toggle(d)}
                  style={({ pressed }) => [
                    styles.row,
                    idx !== filtered.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
                    sel && { backgroundColor: "#EEEDFE" },
                    pressed && { opacity: 0.75 },
                  ]}
                >
                  {/* Checkbox visual */}
                  <View style={[styles.checkbox, sel && { backgroundColor: "#7C3AED", borderColor: "#7C3AED" }]}>
                    {sel && <Text style={{ color: "#fff", fontSize: 10, fontWeight: "900" }}>✓</Text>}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.rowCode, { color: sel ? "#4C1D95" : colors.foreground }]}>
                      {d.codigo}
                    </Text>
                    <Text
                      style={[styles.rowDesc, { color: colors.muted }]}
                      numberOfLines={Platform.OS === "web" ? 2 : 2}
                    >
                      {d.descripcion}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
            {destrezas.length > 80 && !query && (
              <Text style={[styles.hint, { color: colors.muted }]}>
                Usa el buscador para encontrar destrezas específicas ({destrezas.length} disponibles)
              </Text>
            )}
          </ScrollView>
        )}
      </View>

      {value.length > 0 && (
        <Text style={[styles.count, { color: "#7C3AED" }]}>
          {value.length} DCD seleccionada{value.length !== 1 ? "s" : ""}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    gap: 4,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "700",
  },
  chipX: {
    paddingLeft: 2,
  },
  search: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 14,
    marginBottom: 6,
  },
  listBox: {
    borderWidth: 1,
    borderRadius: 10,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
    flexShrink: 0,
  },
  rowCode: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 2,
  },
  rowDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  empty: {
    padding: 16,
    fontSize: 13,
    textAlign: "center",
  },
  hint: {
    fontSize: 11,
    textAlign: "center",
    padding: 10,
  },
  count: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 6,
  },
});
