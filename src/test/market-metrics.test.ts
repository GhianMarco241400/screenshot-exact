import { describe, expect, it } from "vitest";

import { inventoryMovements, products } from "@/lib/demo-data";
import {
  atRisk,
  averageMargin,
  belowMinimum,
  coverageAverage,
  getInventoryRows,
  inventoryValue,
  marginPercent,
  mergeOrderLines,
  movementRows,
  orderTotal,
  salesSeries,
  sortByUrgency,
  starProduct,
  topCategory,
  toOrderLine,
  unitsInStock,
} from "@/lib/market-metrics";
import { simulate } from "@/lib/neural-sim";

const date = "2026-11-26";

describe("Métricas compartidas de catálogo e inventario", () => {
  it("deriva el margen de precio y costo", () => {
    const product = products[0]!;
    expect(marginPercent(product)).toBeCloseTo(
      ((product.price - product.cost) / product.price) * 100,
    );
    expect(averageMargin()).toBeCloseTo(
      products.reduce((sum, item) => sum + marginPercent(item), 0) / products.length,
    );
  });

  it("genera 30 puntos deterministas que suman las ventas del producto", () => {
    for (const product of products) {
      const series = salesSeries(product);
      expect(series).toHaveLength(30);
      expect(series.reduce((sum, value) => sum + value, 0)).toBe(product.sales30);
      expect(salesSeries(product)).toEqual(series);
    }
  });

  it("calcula la categoría más vendida y el producto estrella desde sales30", () => {
    const totals = new Map<string, number>();
    for (const product of products) {
      totals.set(product.category, (totals.get(product.category) ?? 0) + product.sales30);
    }
    const bestSales = Math.max(...totals.values());
    expect(topCategory().sales).toBe(bestSales);
    expect(starProduct()?.sales30).toBe(Math.max(...products.map((product) => product.sales30)));
  });

  it("unifica existencias, valor, bajo mínimo y cobertura ponderada", () => {
    expect(unitsInStock()).toBe(products.reduce((sum, product) => sum + product.stock, 0));
    expect(inventoryValue()).toBeCloseTo(
      products.reduce((sum, product) => sum + product.stock * product.cost, 0),
    );
    expect(belowMinimum()).toBe(
      products.filter((product) => product.stock < product.minimum).length,
    );
    const totalDaily = products.reduce((sum, product) => sum + product.sales30 / 30, 0);
    expect(coverageAverage()).toBeCloseTo(unitsInStock() / totalDaily);
  });

  it("construye las filas de inventario con la misma simulación neuronal", () => {
    const rows = getInventoryRows(date);
    expect(rows).toHaveLength(products.length);

    for (const row of rows) {
      const simulation = simulate({
        product: row.product,
        date,
        promotion: false,
        holiday: false,
        activation: "relu",
      });
      expect(row.demand).toBe(simulation.demand);
      expect(row.purchase).toBe(simulation.purchase);
      expect(row.status).toBe(simulation.status);
      expect(row.purchase).toBe(Math.max(0, row.demand + row.safetyStock - row.product.stock));
    }

    expect(atRisk(rows)).toBe(rows.filter((row) => row.status !== "sufficient").length);
  });

  it("ordena por urgencia y consolida líneas de orden sin duplicados", () => {
    const rank = { urgent: 0, recommended: 1, risk: 2, sufficient: 3 };
    const rows = sortByUrgency(getInventoryRows(date));
    const ranks = rows.map((row) => rank[row.status]);
    expect(ranks).toEqual([...ranks].sort((left, right) => left - right));

    const pending = rows.filter((row) => row.purchase > 0);
    const lines = mergeOrderLines([], pending.map(toOrderLine));
    expect(lines).toHaveLength(pending.length);
    expect(orderTotal(lines)).toBeCloseTo(
      pending.reduce((sum, row) => sum + row.purchase * row.product.cost, 0),
    );
    expect(mergeOrderLines(lines, [toOrderLine(rows[0]!)])).toHaveLength(lines.length);
  });

  it("resuelve ocho movimientos con su producto del catálogo", () => {
    const movements = movementRows();
    expect(movements).toHaveLength(8);
    expect(inventoryMovements).toHaveLength(8);
    for (const movement of movements) {
      expect(products).toContain(movement.product);
      expect(["entrada", "salida"]).toContain(movement.type);
      expect(movement.quantity).toBeGreaterThan(0);
    }
  });
});
