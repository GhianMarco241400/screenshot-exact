import { describe, expect, it } from "vitest";

import { products } from "@/lib/demo-data";
import {
  activate,
  buildFeatures,
  replenishment,
  simulate,
  type Activation,
} from "@/lib/neural-sim";

const product = products[0]!;
const base = {
  product,
  date: "2026-11-26",
  promotion: false,
  holiday: false,
} as const;

describe("Simulación neuronal educativa", () => {
  it("es determinista y respeta la arquitectura 6 → 6 → 5 → 4 → 1", () => {
    const first = simulate(base);
    const second = simulate(base);

    expect(first).toEqual(second);
    expect(first.features).toHaveLength(6);
    expect(first.layers.map((layer) => layer.neurons.length)).toEqual([6, 5, 4, 1]);
    expect(first.layers[0]?.neurons[0]?.weights).toHaveLength(6);
  });

  it("mantiene la demanda entre 15 y 80 unidades", () => {
    for (const sample of products) {
      for (const activation of ["relu", "sigmoid", "tanh"] as Activation[]) {
        const result = simulate({ ...base, product: sample, activation });
        expect(result.demand).toBeGreaterThanOrEqual(15);
        expect(result.demand).toBeLessThanOrEqual(80);
      }
    }
  });

  it.each(["relu", "sigmoid", "tanh"] as Activation[])(
    "Promoción y feriado aumentan la demanda con %s",
    (activation) => {
      const normal = simulate({ ...base, activation }).demand;
      const promo = simulate({ ...base, activation, promotion: true }).demand;
      const holiday = simulate({ ...base, activation, holiday: true }).demand;
      const both = simulate({ ...base, activation, promotion: true, holiday: true }).demand;

      expect(promo).toBeGreaterThan(normal);
      expect(holiday).toBeGreaterThan(normal);
      expect(both).toBeGreaterThanOrEqual(promo);
      expect(both).toBeGreaterThanOrEqual(holiday);
    },
  );

  it("aplica la activación seleccionada a las capas ocultas", () => {
    const values = (["relu", "sigmoid", "tanh"] as Activation[]).map(
      (activation) => simulate({ ...base, activation }).layers[0]?.neurons[0]?.output ?? 0,
    );
    expect(new Set(values).size).toBeGreaterThan(1);
    expect(activate(-1, "relu")).toBe(0);
    expect(activate(0, "sigmoid")).toBeCloseTo(0.5);
    expect(activate(0, "tanh")).toBe(0);
  });

  it("construye las entradas a partir del producto, la fecha y los switches", () => {
    const features = buildFeatures({
      ...base,
      price: 30,
      promotion: true,
      holiday: true,
      recentSales: 60,
    });

    expect(features.map((feature) => feature.value)).toEqual([1, 1, 1, 4 / 6, 10 / 11, 1]);
    expect(features[1]?.detail).toBe("Sí");
  });

  it("calcula la compra y los cuatro estados de reposición", () => {
    expect(replenishment(40, 50, 10)).toEqual({ purchase: 0, status: "sufficient" });
    expect(replenishment(40, 35, 10)).toEqual({ purchase: 15, status: "risk" });
    expect(replenishment(40, 12, 20)).toEqual({ purchase: 48, status: "recommended" });
    expect(replenishment(40, 5, 20)).toEqual({ purchase: 55, status: "urgent" });
  });
});
