import type { Product, StockState } from "@/lib/demo-data";

export type Activation = "relu" | "sigmoid" | "tanh";

export type NeuralInput = {
  product: Product;
  /** ISO date (YYYY-MM-DD). Parsed as UTC so SSR and client agree. */
  date: string;
  promotion: boolean;
  holiday: boolean;
  price?: number;
  recentSales?: number;
  activation?: Activation;
};

export type NeuronTrace = {
  label: string;
  inputs: number[];
  weights: number[];
  bias: number;
  z: number;
  output: number;
};

export type LayerTrace = {
  name: string;
  neurons: NeuronTrace[];
};

export type NeuralFeature = {
  label: string;
  value: number;
  detail: string;
};

export type SimulationResult = {
  features: NeuralFeature[];
  layers: LayerTrace[];
  output: number;
  demand: number;
  purchase: number;
  status: StockState;
  currentStock: number;
  safetyStock: number;
};

export const statusLabels: Record<StockState, string> = {
  sufficient: "Stock suficiente",
  risk: "Riesgo de quiebre",
  recommended: "Reposición recomendada",
  urgent: "Reposición urgente",
};

const LAYER_SIZES = [6, 6, 5, 4, 1] as const;
const DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"] as const;
const MONTHS = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
] as const;

function mulberry32(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

/** Fixed, seed-derived weights. No training and no Math.random at runtime. */
function buildWeights(): { weights: number[][][]; biases: number[][] } {
  const random = mulberry32(20261125);
  const weights: number[][][] = [];
  const biases: number[][] = [];

  for (let layer = 1; layer < LAYER_SIZES.length; layer += 1) {
    const size = LAYER_SIZES[layer] ?? 1;
    const previous = LAYER_SIZES[layer - 1] ?? 1;
    const layerWeights: number[][] = [];
    const layerBiases: number[] = [];

    for (let neuron = 0; neuron < size; neuron += 1) {
      const row: number[] = [];
      for (let input = 0; input < previous; input += 1) {
        if (layer === 1 && (input === 1 || input === 5)) {
          // Promoción y feriado siempre empujan la red en la misma dirección.
          row.push(0.95 + random() * 0.85);
        } else if (layer === 1) {
          row.push((random() * 2 - 1) * 0.9);
        } else if (layer === LAYER_SIZES.length - 1) {
          row.push(0.08 + random() * 0.08);
        } else {
          row.push(0.12 + random() * 0.2);
        }
      }
      layerWeights.push(row);
      layerBiases.push(layer === 1 ? 0.1 + random() * 0.2 : 0.02 + random() * 0.12);
    }

    weights.push(layerWeights);
    biases.push(layerBiases);
  }

  // The output neuron has a negative bias so sigmoid does not saturate at 1.
  const output = biases[biases.length - 1];
  if (output) output[0] = -0.45;

  return { weights, biases };
}

const NETWORK = buildWeights();

export function activate(value: number, activation: Activation): number {
  switch (activation) {
    case "relu":
      return Math.max(0, value);
    case "sigmoid":
      return 1 / (1 + Math.exp(-value));
    case "tanh":
      return Math.tanh(value);
  }
}

function parseDate(date: string): Date {
  const parsed = new Date(`${date}T00:00:00Z`);
  return Number.isNaN(parsed.getTime()) ? new Date("2026-11-26T00:00:00Z") : parsed;
}

export function buildFeatures(input: NeuralInput): NeuralFeature[] {
  const price = input.price ?? input.product.price;
  const recentSales = input.recentSales ?? Math.round(input.product.sales30 / 30);
  const date = parseDate(input.date);
  const day = date.getUTCDay();
  const month = date.getUTCMonth();

  return [
    { label: "Precio", value: clamp(price / 30), detail: `S/ ${price.toFixed(2)}` },
    { label: "Promoción", value: input.promotion ? 1 : 0, detail: input.promotion ? "Sí" : "No" },
    {
      label: "Ventas recientes",
      value: clamp(recentSales / 60),
      detail: `${Math.round(recentSales)} u.`,
    },
    { label: "Día", value: day / 6, detail: DAYS[day] ?? "Dom" },
    { label: "Mes", value: month / 11, detail: MONTHS[month] ?? "Ene" },
    { label: "Feriado", value: input.holiday ? 1 : 0, detail: input.holiday ? "Sí" : "No" },
  ];
}

export function replenishment(demand: number, currentStock: number, safetyStock: number) {
  const purchase = Math.max(0, demand + safetyStock - currentStock);
  let status: StockState = "sufficient";

  if (purchase > 0) {
    if (currentStock === 0 || currentStock < safetyStock * 0.6) {
      status = "urgent";
    } else if (currentStock < safetyStock) {
      status = "recommended";
    } else {
      status = "risk";
    }
  }

  return { purchase, status };
}

export function simulate(input: NeuralInput): SimulationResult {
  const features = buildFeatures(input);
  const activation = input.activation ?? "relu";
  let values = features.map((feature) => feature.value);
  const layers: LayerTrace[] = [];

  for (let layer = 0; layer < NETWORK.weights.length; layer += 1) {
    const rows = NETWORK.weights[layer] ?? [];
    const biases = NETWORK.biases[layer] ?? [];
    const isOutput = layer === NETWORK.weights.length - 1;
    const functionUsed: Activation = isOutput ? "sigmoid" : activation;
    const neurons: NeuronTrace[] = rows.map((row, index) => {
      const bias = biases[index] ?? 0;
      const z =
        row.reduce((sum, weight, inputIndex) => sum + (values[inputIndex] ?? 0) * weight, 0) + bias;
      return {
        label: isOutput ? "Salida" : `Capa ${layer + 1} · N${index + 1}`,
        inputs: [...values],
        weights: [...row],
        bias,
        z,
        output: activate(z, functionUsed),
      };
    });

    values = neurons.map((neuron) => neuron.output);
    layers.push({ name: isOutput ? "Salida" : `Capa ${layer + 1}`, neurons });
  }

  const output = values[0] ?? 0;
  // Efecto directo y determinista de las dos palancas de negocio sobre la demanda.
  const boost = (features[1]?.value ?? 0) * 4 + (features[5]?.value ?? 0) * 3;
  const demand = Math.round(clamp(15 + 65 * output + boost, 15, 80));
  const safetyStock = input.product.safetyStock ?? input.product.minimum;
  const { purchase, status } = replenishment(demand, input.product.stock, safetyStock);

  return {
    features,
    layers,
    output,
    demand,
    purchase,
    status,
    currentStock: input.product.stock,
    safetyStock,
  };
}
