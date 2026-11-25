import type { SimulationResult } from "@/lib/neural-sim";

export type Vec3 = [number, number, number];

export const POSITIVE_COLOR = "#22d3ee";
export const NEGATIVE_COLOR = "#e879f9";
export const INPUT_COLOR = "#38bdf8";
export const HIDDEN_COLOR = "#818cf8";
export const OUTPUT_COLOR = "#22d3ee";

const LAYER_X = [-5.4, -2.7, 0, 2.7, 5.4] as const;
const VERTICAL_SPREAD = 1.18;

export type NeuralNode = {
  key: string;
  layer: number;
  index: number;
  position: Vec3;
  label: string;
  value: number;
  detail: string;
};

export type NeuralConnection = {
  key: string;
  fromLayer: number;
  toLayer: number;
  from: Vec3;
  to: Vec3;
  weight: number;
};

export function nodePosition(layer: number, index: number, count: number): Vec3 {
  const y = (index - (count - 1) / 2) * VERTICAL_SPREAD;
  const z = Math.sin((layer + 1) * 2.1 + index * 1.3) * 0.42;
  return [LAYER_X[layer] ?? 0, y, z];
}

export function buildNodes(result: SimulationResult): NeuralNode[] {
  const inputs = result.features.map((feature, index) => ({
    key: `in-${index}`,
    layer: 0,
    index,
    position: nodePosition(0, index, result.features.length),
    label: feature.label,
    value: feature.value,
    detail: feature.detail,
  }));

  const layers = result.layers.flatMap((layer, layerIndex) =>
    layer.neurons.map((neuron, index) => ({
      key: `l${layerIndex + 1}-${index}`,
      layer: layerIndex + 1,
      index,
      position: nodePosition(layerIndex + 1, index, layer.neurons.length),
      label: layerIndex === result.layers.length - 1 ? "Salida" : neuron.label,
      value: neuron.output,
      detail:
        layerIndex === result.layers.length - 1
          ? `${result.demand} unidades`
          : `f(z) = ${neuron.output.toFixed(3)}`,
    })),
  );

  return [...inputs, ...layers];
}

export function buildConnections(result: SimulationResult): NeuralConnection[] {
  const nodes = buildNodes(result);
  const connections: NeuralConnection[] = [];

  for (let layer = 1; layer <= result.layers.length; layer += 1) {
    const targets = nodes.filter((node) => node.layer === layer);
    const sources = nodes.filter((node) => node.layer === layer - 1);
    const traces = (result.layers[layer - 1]?.neurons ?? []).flat();

    for (const target of targets) {
      const weights = traces[target.index]?.weights ?? [];
      for (const source of sources) {
        const weight = weights[source.index] ?? 0;
        connections.push({
          key: `${source.key}->${target.key}`,
          fromLayer: source.layer,
          toLayer: target.layer,
          from: source.position,
          to: target.position,
          weight,
        });
      }
    }
  }

  return connections;
}
