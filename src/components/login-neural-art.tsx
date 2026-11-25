import { useId } from "react";

const inputs = [
  { x: 28, y: 38 },
  { x: 28, y: 90 },
  { x: 28, y: 142 },
];

const hidden = [
  { x: 156, y: 30 },
  { x: 156, y: 74 },
  { x: 156, y: 118 },
  { x: 156, y: 150 },
];

const outputs = [
  { x: 296, y: 56 },
  { x: 296, y: 124 },
];

const firstLayer = inputs.flatMap((from) =>
  hidden.map((to) => ({ from, to, key: `${from.x}-${from.y}-${to.y}` })),
);
const secondLayer = hidden.flatMap((from) =>
  outputs.map((to) => ({ from, to, key: `${from.y}-${to.y}` })),
);

/** Decoración ligera: SVG + CSS, sin three.js ni recursos externos. */
export function LoginNeuralArt() {
  const glowId = `login-neural-${useId().replace(/:/g, "")}`;

  return (
    <svg
      aria-hidden="true"
      className="mt-6 h-40 w-full max-w-md lg:h-48"
      fill="none"
      viewBox="0 0 324 180"
    >
      <defs>
        <radialGradient id={glowId}>
          <stop offset="0%" stopColor="#a5b4fc" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#a5b4fc" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="162" cy="90" rx="150" ry="76" fill={`url(#${glowId})`} />

      {firstLayer.map((connection, index) => (
        <line
          className={index % 4 === 0 ? "signal-line" : undefined}
          key={connection.key}
          stroke="white"
          strokeOpacity={index % 4 === 0 ? 0.5 : 0.17}
          strokeWidth={index % 4 === 0 ? 1.4 : 1}
          x1={connection.from.x}
          x2={connection.to.x}
          y1={connection.from.y}
          y2={connection.to.y}
        />
      ))}
      {secondLayer.map((connection, index) => (
        <line
          className={index % 3 === 0 ? "signal-line" : undefined}
          key={connection.key}
          stroke="white"
          strokeOpacity={index % 3 === 0 ? 0.55 : 0.2}
          strokeWidth={index % 3 === 0 ? 1.4 : 1}
          x1={connection.from.x}
          x2={connection.to.x}
          y1={connection.from.y}
          y2={connection.to.y}
        />
      ))}

      {[...inputs, ...hidden, ...outputs].map((node, index) => (
        <g key={`${node.x}-${node.y}`}>
          <circle cx={node.x} cy={node.y} fill="white" fillOpacity="0.08" r="12" />
          <circle
            className="animate-pulse-glow"
            cx={node.x}
            cy={node.y}
            fill="white"
            r={index % 3 === 0 ? 5 : 4}
            style={{ animationDelay: `${index * 170}ms` }}
          />
        </g>
      ))}

      <text fill="white" fillOpacity="0.42" fontSize="8" letterSpacing="1.4" x="8" y="170">
        ENTRADA
      </text>
      <text fill="white" fillOpacity="0.42" fontSize="8" letterSpacing="1.4" x="138" y="170">
        CAPAS OCULTAS
      </text>
      <text fill="white" fillOpacity="0.42" fontSize="8" letterSpacing="1.4" x="274" y="170">
        SALIDA
      </text>
    </svg>
  );
}
