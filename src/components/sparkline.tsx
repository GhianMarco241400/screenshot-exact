import { useId } from "react";

import { cn } from "@/lib/utils";

export type SparkTone = "primary" | "ai" | "good" | "risk";

const toneColor: Record<SparkTone, string> = {
  primary: "var(--chart-1)",
  ai: "var(--ai)",
  good: "var(--status-good)",
  risk: "var(--status-risk)",
};

export function Sparkline({
  data,
  tone = "primary",
  className,
}: {
  data: number[];
  tone?: SparkTone;
  className?: string;
}) {
  const gradientId = `spark-${useId().replace(/:/g, "")}`;

  if (data.length < 2) {
    return null;
  }

  const width = 96;
  const height = 36;
  const pad = 3;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;

  const points = data.map((value, index) => {
    const x = pad + (index / (data.length - 1)) * (width - pad * 2);
    const y = height - pad - ((value - min) / span) * (height - pad * 2);
    return { x, y };
  });

  const first = points[0];
  const last = points[points.length - 1];

  if (!first || !last) {
    return null;
  }

  const line = points.map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(" ");
  const area = `M ${first.x.toFixed(1)} ${height} L ${points
    .map((point) => `${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
    .join(" L ")} L ${last.x.toFixed(1)} ${height} Z`;
  const color = toneColor[tone];

  return (
    <svg
      aria-hidden="true"
      className={cn("overflow-visible", className)}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.32" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradientId})`} />
      <polyline
        points={line}
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
