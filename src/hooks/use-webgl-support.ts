import { useEffect, useState } from "react";

export type WebGLSupport = "checking" | "available" | "unavailable";

/** Checks WebGL after mount only, so the prerendered shell never touches the DOM API. */
export function useWebGLSupport(): WebGLSupport {
  const [support, setSupport] = useState<WebGLSupport>("checking");

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const context =
        (canvas.getContext("webgl2") as WebGL2RenderingContext | null) ??
        (canvas.getContext("webgl") as WebGLRenderingContext | null);

      if (!context) {
        setSupport("unavailable");
        return;
      }

      context.getExtension("WEBGL_lose_context")?.loseContext();
      setSupport("available");
    } catch {
      setSupport("unavailable");
    }
  }, []);

  return support;
}
