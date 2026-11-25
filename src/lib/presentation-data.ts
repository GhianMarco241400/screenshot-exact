export type KpiFormat = "currency" | "units" | "count";
export type KpiDirection = "up" | "down";
export type KpiTone = "good" | "bad" | "neutral";

export type KpiMeta = {
  value: number;
  format: KpiFormat;
  delta: string;
  direction: KpiDirection;
  tone: KpiTone;
  spark: number[];
};

/**
 * Presentation-only data for the dashboard. Business values stay in
 * `demo-data.ts`; this file only adds visual affordances (deltas, sparklines).
 */
export const kpiMeta: Record<"sales" | "risk" | "demand" | "stock", KpiMeta> = {
  sales: {
    value: 28430,
    format: "currency",
    delta: "+12,4%",
    direction: "up",
    tone: "good",
    spark: [18, 22, 20, 26, 24, 31, 34],
  },
  risk: {
    value: 4,
    format: "count",
    delta: "−1 alerta",
    direction: "down",
    tone: "good",
    spark: [7, 6, 6, 5, 5, 4, 4],
  },
  demand: {
    value: 178,
    format: "units",
    delta: "+6,1%",
    direction: "up",
    tone: "good",
    spark: [140, 150, 146, 158, 165, 170, 178],
  },
  stock: {
    value: 1248,
    format: "units",
    delta: "+2,3%",
    direction: "up",
    tone: "good",
    spark: [1180, 1195, 1202, 1218, 1226, 1240, 1248],
  },
};

const categoryEmoji: Record<string, string> = {
  Abarrotes: "🌾",
  Bebidas: "🥤",
  Lácteos: "🥛",
  Snacks: "🍪",
  Limpieza: "🧴",
  Higiene: "🧼",
};

export function emojiForCategory(category: string) {
  return categoryEmoji[category] ?? "📦";
}

export const chartSeriesColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
] as const;

export function seriesColor(index: number) {
  return chartSeriesColors[index % chartSeriesColors.length] ?? "var(--chart-1)";
}
