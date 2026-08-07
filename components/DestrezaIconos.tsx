import { Image, View, type ImageSourcePropType, type ViewStyle } from "react-native";
import { obtenerIconosDestreza } from "@/src/data/iconosPorDestreza";

const ICONOS_IMAGES: Record<string, ImageSourcePropType> = {
  competencias_comunicacionales: require("@/assets/iconos/competencias_comunicacionales.png"),
  competencias_matematicas: require("@/assets/iconos/competencias_matematicas.png"),
  competencias_digitales: require("@/assets/iconos/competencias_digitales.png"),
  competencias_socioemocionales: require("@/assets/iconos/competencias_socioemocionales.png"),
  insercion_civica_etica_integridad: require("@/assets/iconos/insercion_civica_etica_integridad.png"),
  insercion_desarrollo_sostenible: require("@/assets/iconos/insercion_desarrollo_sostenible.png"),
  insercion_educacion_financiera: require("@/assets/iconos/insercion_educacion_financiera.png"),
  insercion_educacion_socioemocional: require("@/assets/iconos/insercion_educacion_socioemocional.png"),
  insercion_educacion_vial: require("@/assets/iconos/insercion_educacion_vial.png"),
  insercion_seguridad_integral: require("@/assets/iconos/insercion_seguridad_integral.png"),
};

export const ICONOS_NOMBRES: Record<string, string> = {
  competencias_comunicacionales: "Competencias Comunicacionales",
  competencias_matematicas: "Competencias Matemáticas",
  competencias_digitales: "Competencias Digitales",
  competencias_socioemocionales: "Competencias Socioemocionales",
  insercion_civica_etica_integridad: "Educación Cívica, Ética e Integridad",
  insercion_desarrollo_sostenible: "Educación para el Desarrollo Sostenible",
  insercion_educacion_financiera: "Educación Financiera",
  insercion_educacion_socioemocional: "Educación Socioemocional",
  insercion_educacion_vial: "Educación para la Seguridad Vial y Movilidad Sostenible",
  insercion_seguridad_integral: "Seguridad Integral",
};

interface DestrezaIconosProps {
  /** Código exacto de la DCD, ej. "LL.2.1.1" */
  codigo: string | undefined | null;
  /** Tamaño en px de cada ícono (default 18) */
  size?: number;
  style?: ViewStyle;
}

/** Fila de íconos pequeños (competencias/inserciones) asociados a una DCD, según los PDF oficiales. */
export function DestrezaIconos({ codigo, size = 18, style }: DestrezaIconosProps) {
  if (!codigo) return null;
  const iconos = obtenerIconosDestreza(codigo);
  if (iconos.length === 0) return null;

  return (
    <View style={[{ flexDirection: "row", flexWrap: "wrap", gap: 3, alignItems: "center" }, style]}>
      {iconos.map((nombre) => {
        const source = ICONOS_IMAGES[nombre];
        if (!source) return null;
        return (
          <Image
            key={nombre}
            source={source}
            accessibilityLabel={ICONOS_NOMBRES[nombre] ?? nombre}
            style={{ width: size, height: size, borderRadius: size / 2 }}
            resizeMode="contain"
          />
        );
      })}
    </View>
  );
}
