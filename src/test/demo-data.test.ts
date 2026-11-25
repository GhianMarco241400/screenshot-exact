import { describe, expect, it } from "vitest";

import { predictionDemo, products } from "@/lib/demo-data";

describe("SmartMarket example data", () => {
  it("keeps the fixed demand and replenishment example values", () => {
    expect(predictionDemo).toEqual({
      demand: 42,
      currentStock: 20,
      safetyStock: 5,
      recommendedPurchase: 27,
    });
  });

  it("contains 12 sample minimarket products", () => {
    expect(products).toHaveLength(12);
  });
});