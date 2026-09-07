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

export interface CompetenciaEspecifica {
  codigo: string;
  descripcion: string;
}

interface Props {
  /** Todas las destrezas disponibles del área/subnivel */
  destrezas: { codigo: string; criteriosEvaluacion: string[]; descripcion: string }[];
  /** Competencias específicas seleccionadas */
  value: CompetenciaEspecifica[];
  /** Callback al cambiar selección */
  onChange: (selected: CompetenciaEspecifica[]) => void;
  placeholder?: string;
}

/**
 * Extrae competencias específicas únicas de una lista de destrezas.
 * Cada criterio tiene formato: "CE.M.2.1. Descripción..."
 */
function extraerCompetencias(destrezas: Props["destrezas"]): CompetenciaEspecifica[] {
  const seen = new Set<string>();
  const result: CompetenciaEspecifica[] = [];
  for (const d of destrezas) {
    for (const ce of d.criteriosEvaluacion) {
      const match = ce.match(/^(CE\.[A-Z]+\.[0-9]+\.[0-9]+)\.\s*(.*)/);
      if (match) {
        const codigo = match[1];
        if (!seen.has(codigo)) {
          seen.add(codigo);
          result.push({ codigo, descripcion: match[2] || ce });
        }
      }
    }
  }
  return result.sort((a, b) => a.codigo.localeCompare(b.codigo));
}

export function CompetenciasEspecificasSelector({ destrezas, value, onChange, placeholder }: Props) {
  const colors = useColors();
  const [query, setQuery] = useState("");

  const allCompetencias = useMemo(() => extraerCompetencias(destrezas), [destrezas]);

  const filtered = useMemo(() => {
    if (!query.trim()) return allCompetencias;
    const q = query.trim().toLowerCase();
    return allCompetencias.filter(
      (ce) =>
        ce.codigo.toLowerCase().includes(q) ||
        ce.descripcion.toLowerCase().includes(q)
    );
  }, [allCompetencias, query]);

  const selectedCodes = useMemo(() => new Set(value.map((c) => c.codigo)), [value]);

  const toggle = useCallback(
    (ce: CompetenciaEspecifica) => {
      if (selectedCodes.has(ce.codigo)) {
        onChange(value.filter((v) => v.codigo !== ce.codigo));
      } else {
        onChange([...value, ce]);
      }
    },
    [value, onChange, selectedCodes]
  );

  const remove = useCallback(
    (codigo: string) => {
      onChange(value.filter((v) => v.codigo !== codigo));
    },
    [value, onChange]
  );

  return (
    <View>
      {/* Chips de seleccionadas */}
      {value.length > 0 && (
        <View style={styles.chipsWrap}>
          {value.map((ce) => (
            <View key={ce.codigo} style={[styles.chip, { backgroundColor: "#EEEDFE", borderColor: "#7C3AED" }]}>
              <Text style={[styles.chipText, { color: "#4C1D95" }]}>{ce.codigo}</Text>
              <Text style={[styles.chipDesc, { color: "#6D28D9" }]} numberOfLines={1}>
                {ce.descripcion.length > 40 ? ce.descripcion.substring(0, 40) + "..." : ce.descripcion}
              </Text>
              <Pressable onPress={() => remove(ce.codigo)} hitSlop={6} style={styles.chipX}>
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
        placeholder={placeholder || "Buscar por código o texto..."}
        placeholderTextColor={colors.muted}
        autoCorrect={false}
        autoCapitalize="none"
      />

      {/* Lista */}
      <View style={[styles.listBox, { borderColor: colors.border, backgroundColor: colors.surface }]}>
        {filtered.length === 0 ? (
          <Text style={[styles.empty, { color: colors.muted }]}>
            {query ? "Sin resultados. Intenta con otro código o palabra." : "Selecciona un área y grado primero para ver las competencias."}
          </Text>
        ) : (
          <ScrollView style={{ maxHeight: 280 }} nestedScrollEnabled keyboardShouldPersistTaps="handled">
            {filtered.map((ce, idx) => {
              const sel = selectedCodes.has(ce.codigo);
              return (
                <Pressable
                  key={ce.codigo}
                  onPress={() => toggle(ce)}
                  style={({ pressed }) => [
                    styles.row,
                    idx !== filtered.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
                    sel && { backgroundColor: "#EEEDFE" },
                    pressed && { opacity: 0.75 },
                  ]}
                >
                  <View style={[styles.checkbox, sel && { backgroundColor: "#7C3AED", borderColor: "#7C3AED" }]}>
                    {sel && <Text style={{ color: "#fff", fontSize: 10, fontWeight: "900" }}>✓</Text>}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.rowCode, { color: sel ? "#4C1D95" : colors.foreground }]}>{ce.codigo}</Text>
                    <Text style={[styles.rowDesc, { color: colors.muted }]} numberOfLines={2}>
                      {ce.descripcion}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        )}
      </View>

      {value.length > 0 && (
        <Text style={[styles.count, { color: "#7C3AED" }]}>
          {value.length} competencia{value.length !== 1 ? "s" : ""} seleccionada{value.length !== 1 ? "s" : ""}
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
    maxWidth: "100%",
  },
  chipText: {
    fontSize: 12,
    fontWeight: "700",
  },
  chipDesc: {
    fontSize: 11,
    flexShrink: 1,
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
  count: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 6,
  },
});
