import { useEffect, useRef } from "react";
import { View } from "react-native";

const CSS = `
@keyframes pd-book {
  0%   { stroke-dashoffset:1; opacity:0; }
  8%   { opacity:1; }
  100% { stroke-dashoffset:0; opacity:1; }
}
@keyframes pd-pencil-in {
  0%   { transform:translate(64px,-92px) rotate(8deg); opacity:0; }
  12%  { opacity:1; }
  30%  { transform:translate(-47px,-40px) rotate(0deg); opacity:1; }
  55%  { transform:translate(-29px,-20px) rotate(0deg); opacity:1; }
  80%  { transform:translate(-3px,-58px) rotate(0deg); opacity:1; }
  100% { transform:translate(-3px,-58px) rotate(0deg); opacity:1; }
}
@keyframes pd-check {
  0%,30% { stroke-dashoffset:1; }
  55%    { stroke-dashoffset:0.631; }
  80%    { stroke-dashoffset:0; }
  100%   { stroke-dashoffset:0; }
}
@keyframes pd-check-pop {
  0%,80% { transform:scale(1); }
  88%    { transform:scale(1.1); }
  95%    { transform:scale(0.98); }
  100%   { transform:scale(1); }
}
@keyframes pd-rise {
  0%   { transform:translateY(14px); opacity:0; }
  100% { transform:translateY(0); opacity:1; }
}
@keyframes pd-fade {
  0%   { opacity:0; }
  100% { opacity:1; }
}
`;

const HTML = `
<div style="display:flex;flex-direction:column;align-items:center;gap:34px;">
  <svg width="200" height="200" viewBox="0 0 240 240" fill="none" style="overflow:visible;">
    <g transform="translate(-5,7)">
      <path pathLength="1" stroke="#cf8f12" stroke-width="20" stroke-linecap="round" stroke-linejoin="round" fill="none"
        style="animation:pd-book .65s ease both;stroke-dasharray:1;"
        d="M120 73 C102 58 72 58 54 68 L51 169 C51 182 87 185 120 185"/>
      <path pathLength="1" stroke="#cf8f12" stroke-width="20" stroke-linecap="round" stroke-linejoin="round" fill="none"
        style="animation:pd-book .65s ease .12s both;stroke-dasharray:1;"
        d="M120 73 C138 58 168 58 186 68 L189 169 C189 182 153 185 120 185"/>
    </g>
    <g>
      <path pathLength="1" stroke="#ffffff" stroke-width="13" stroke-linecap="round" stroke-linejoin="round" fill="none"
        style="animation:pd-book .65s ease both;stroke-dasharray:1;"
        d="M120 73 C102 58 72 58 54 68 L51 169 C51 182 87 185 120 185"/>
      <path pathLength="1" stroke="#ffffff" stroke-width="13" stroke-linecap="round" stroke-linejoin="round" fill="none"
        style="animation:pd-book .65s ease .12s both;stroke-dasharray:1;"
        d="M120 73 C138 58 168 58 186 68 L189 169 C189 182 153 185 120 185"/>
      <path pathLength="1" stroke="#ffffff" stroke-width="13" stroke-linecap="round" stroke-linejoin="round" fill="none"
        style="animation:pd-book .55s ease .22s both;stroke-dasharray:1;"
        d="M120 73 L120 185"/>
    </g>
    <g style="transform-box:fill-box;transform-origin:center;animation:pd-check-pop 2.8s ease .4s both;">
      <path pathLength="1" stroke="#e0a41e" stroke-width="15" stroke-linecap="round" stroke-linejoin="round" fill="none"
        style="animation:pd-check 2.8s linear .4s both;stroke-dasharray:1;"
        d="M66 120 L84 140 L110 102"/>
    </g>
    <g style="transform-box:fill-box;transform-origin:center;animation:pd-pencil-in 2.8s linear .4s both;">
      <g transform="rotate(48 158 119)">
        <rect x="145" y="60" width="26" height="16" rx="8" fill="#e0a41e"/>
        <rect x="145" y="74" width="26" height="8" fill="#ffffff"/>
        <rect x="145" y="80" width="26" height="70" rx="2" fill="#e0a41e"/>
        <rect x="155" y="92" width="6" height="50" rx="3" fill="#ffffff" opacity="0.92"/>
        <path d="M145 150 L171 150 L158 180 Z" fill="#f6e2a6"/>
        <path d="M150 167 L166 167 L158 180 Z" fill="#1e293b"/>
      </g>
    </g>
  </svg>
  <div style="display:flex;flex-direction:column;align-items:center;gap:12px;">
    <div style="font-size:34px;font-weight:800;letter-spacing:-0.02em;line-height:1;animation:pd-rise .7s cubic-bezier(.2,.7,.2,1) 2.95s both;">
      <span style="color:#ffffff;">Planifica</span><span style="color:#e0a41e;">Doc</span>
    </div>
    <div style="font-size:13.5px;font-weight:500;letter-spacing:0.01em;color:#9db8d6;animation:pd-fade .8s ease 3.25s both;">
      Planificación curricular para docentes de Ecuador
    </div>
  </div>
</div>
`;

export function AnimatedLogoSplash() {
  const ref = useRef<View>(null);

  useEffect(() => {
    const el = ref.current as unknown as HTMLDivElement;
    if (!el) return;

    const style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);
    el.innerHTML = HTML;

    return () => {
      try { document.head.removeChild(style); } catch {}
    };
  }, []);

  return (
    <View
      ref={ref}
      style={{
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "#003366",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    />
  );
}
