import { TriangleAlert } from "lucide-react";

import type { SimulationResult } from "@/lib/neural-sim";

const inputY = [48, 84, 120, 156, 192, 228];
const hiddenY = [72, 138, 204];

export function NeuralGraphFallback({ result }: { result: SimulationResult }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 px-6 py-8">
      <svg
        aria-label="Grafo 2D de la red neuronal: seis entradas, tres neuronas ocultas y una salida"
        className="w-full max-w-[420px]"
        role="img"
        viewBox="0 0 360 280"
      >
        <g stroke="var(--border)" strokeWidth="1">
          {inputY.flatMap((y1) =>
            hiddenY.map((y2) => <line key={`i-${y1}-${y2}`} x1="60" x2="190" y1={y1} y2={y2} />),
          )}
          {hiddenY.map((y) => (
            <line key={`h-${y}`} x1="190" x2="310" y1={y} y2="138" />
          ))}
        </g>
        <g stroke="var(--ai)" strokeOpacity="0.65" strokeWidth="1.4">
          {inputY.slice(0, 3).map((y, index) => (
            <line key={`lit-${y}`} x1="60" x2="190" y1={y} y2={hiddenY[index] ?? 138} />
          ))}
        </g>
        <g fill="var(--card)" stroke="var(--primary)" strokeWidth="2">
          {inputY.map((y) => (
            <circle cx="60" cy={y} key={`input-${y}`} r="6" />
          ))}
          {hiddenY.map((y) => (
            <circle cx="190" cy={y} key={`hidden-${y}`} r="7" />
          ))}
        </g>
        <circle cx="310" cy="138" fill="var(--ai)" opacity="0.2" r="18" />
        <circle cx="310" cy="138" fill="var(--ai)" r="9" />
        <g fill="var(--muted-foreground)" fontSize="9" textAnchor="middle">
          <text x="60" y="262">
            Entrada · 6
          </text>
          <text x="190" y="262">
            Ocultas · 3
          </text>
          <text x="310" y="262">
            Salida · 1
          </text>
        </g>
      </svg>
      <div
        className="flex max-w-md items-start gap-2 rounded-lg border border-status-risk/30 bg-status-risk/10 px-3 py-2 text-xs leading-5 text-status-risk"
        role="status"
      >
        <TriangleAlert aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
        <span>
          Tu navegador no dispone de WebGL. Mostramos el grafo 2D; la demanda estimada sigue siendo
          de {result.demand} unidades.
        </span>
      </div>
    </div>
  );
}
