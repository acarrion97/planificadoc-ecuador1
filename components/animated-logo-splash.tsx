import { useEffect, useRef } from "react";
import { Animated, View, Text, StyleSheet, Easing } from "react-native";
import Svg, { G, Path, Rect } from "react-native-svg";

const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedPath = Animated.createAnimatedComponent(Path);

export function AnimatedLogoSplash() {
  const bookOpacity  = useRef(new Animated.Value(0)).current;
  const checkOpacity = useRef(new Animated.Value(0)).current;
  const pencilOpacity= useRef(new Animated.Value(0)).current;
  const textOpacity  = useRef(new Animated.Value(0)).current;
  const textY        = useRef(new Animated.Value(14)).current;
  const subOpacity   = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(bookOpacity,  { toValue: 1, duration: 650, useNativeDriver: true }),
      Animated.delay(100),
      Animated.parallel([
        Animated.timing(checkOpacity,  { toValue: 1, duration: 400, easing: Easing.out(Easing.ease), useNativeDriver: true }),
        Animated.timing(pencilOpacity, { toValue: 1, duration: 600, easing: Easing.out(Easing.ease), useNativeDriver: true }),
      ]),
      Animated.delay(1400),
      Animated.parallel([
        Animated.timing(textOpacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(textY,       { toValue: 0, duration: 700, easing: Easing.out(Easing.ease), useNativeDriver: true }),
      ]),
      Animated.timing(subOpacity, { toValue: 1, duration: 800, delay: 200, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={s.container}>
      <Animated.View style={{ opacity: bookOpacity }}>
        <Svg width={200} height={200} viewBox="0 0 240 240" fill="none">
          <G transform="translate(-5,7)">
            <Path stroke="#cf8f12" strokeWidth={20} strokeLinecap="round" strokeLinejoin="round" fill="none"
              d="M120 73 C102 58 72 58 54 68 L51 169 C51 182 87 185 120 185"/>
            <Path stroke="#cf8f12" strokeWidth={20} strokeLinecap="round" strokeLinejoin="round" fill="none"
              d="M120 73 C138 58 168 58 186 68 L189 169 C189 182 153 185 120 185"/>
          </G>
          <G>
            <Path stroke="#ffffff" strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" fill="none"
              d="M120 73 C102 58 72 58 54 68 L51 169 C51 182 87 185 120 185"/>
            <Path stroke="#ffffff" strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" fill="none"
              d="M120 73 C138 58 168 58 186 68 L189 169 C189 182 153 185 120 185"/>
            <Path stroke="#ffffff" strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" fill="none"
              d="M120 73 L120 185"/>
          </G>
          <Animated.View style={{ opacity: checkOpacity }}>
            <Path stroke="#e0a41e" strokeWidth={15} strokeLinecap="round" strokeLinejoin="round" fill="none"
              d="M66 120 L84 140 L110 102"/>
          </Animated.View>
          <Animated.View style={{ opacity: pencilOpacity }}>
            <G transform="rotate(48 158 119)">
              <Rect x={145} y={60} width={26} height={16} rx={8} fill="#e0a41e"/>
              <Rect x={145} y={74} width={26} height={8} fill="#ffffff"/>
              <Rect x={145} y={80} width={26} height={70} rx={2} fill="#e0a41e"/>
              <Rect x={155} y={92} width={6} height={50} rx={3} fill="#ffffff" opacity={0.92}/>
              <Path d="M145 150 L171 150 L158 180 Z" fill="#f6e2a6"/>
              <Path d="M150 167 L166 167 L158 180 Z" fill="#1e293b"/>
            </G>
          </Animated.View>
        </Svg>
      </Animated.View>

      <Animated.View style={[s.textBlock, { opacity: textOpacity, transform: [{ translateY: textY }] }]}>
        <Text style={s.title}>
          <Text style={s.titleWhite}>Planifica</Text>
          <Text style={s.titleGold}>Doc</Text>
        </Text>
        <Animated.Text style={[s.subtitle, { opacity: subOpacity }]}>
          Planificación curricular para docentes de Ecuador
        </Animated.Text>
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "#003366",
    alignItems: "center",
    justifyContent: "center",
    gap: 34,
    zIndex: 9999,
  },
  textBlock: { alignItems: "center", gap: 12 },
  title: { fontSize: 34, fontWeight: "800", letterSpacing: -0.5, lineHeight: 38 },
  titleWhite: { color: "#ffffff" },
  titleGold:  { color: "#e0a41e" },
  subtitle: { fontSize: 13.5, fontWeight: "500", color: "#9db8d6", textAlign: "center" },
});
