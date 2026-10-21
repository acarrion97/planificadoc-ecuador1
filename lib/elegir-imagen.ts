import { Platform } from "react-native";

/**
 * Abre el selector de archivos del navegador y devuelve la imagen elegida como
 * data URI JPEG reducida (lado mayor ≤ maxLado px), lista para guardarse
 * dentro de la evaluación en AsyncStorage sin inflarla.
 *
 * Solo web: devuelve null en nativo (no hay picker instalado) o si el docente
 * cancela.
 */
export function elegirImagenReducida(maxLado = 480, calidad = 0.75): Promise<string | null> {
  if (Platform.OS !== "web" || typeof document === "undefined") return Promise.resolve(null);

  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) { resolve(null); return; }
      const reader = new FileReader();
      reader.onerror = () => resolve(null);
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => resolve(null);
        img.onload = () => {
          const escala = Math.min(1, maxLado / Math.max(img.width, img.height));
          const canvas = document.createElement("canvas");
          canvas.width = Math.round(img.width * escala);
          canvas.height = Math.round(img.height * escala);
          const ctx = canvas.getContext("2d");
          if (!ctx) { resolve(null); return; }
          // Fondo blanco: los PNG transparentes quedarían negros en JPEG.
          ctx.fillStyle = "#fff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", calidad));
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    };
    input.click();
  });
}
