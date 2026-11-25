import { inventoryMovements, products, type Product, type StockState } from "@/lib/demo-data";
import { simulate } from "@/lib/neural-sim";

export type InventoryRow = {
  product: Product;
  demand: number;
  purchase: number;
  status: StockState;
  safetyStock: number;
  coverageDays: number;
  estimatedCost: number;
};

export type OrderLine = {
  productId: string;
  supplier: string;
  quantity: number;
  cost: number;
};

const urgency: Record<StockState, number> = {
  urgent: 0,
  recommended: 1,
  risk: 2,
  sufficient: 3,
};

const integerFormat = new Intl.NumberFormat("es-PE", { maximumFractionDigits: 0 });
const percentFormat = new Intl.NumberFormat("es-PE", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

function hashUnit(text: string): number {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) / 4294967296;
}

export function formatUnits(value: number): string {
  return integerFormat.format(Math.round(value));
}

export function formatPercent(value: number, signed = false): string {
  const prefix = signed ? (value >= 0 ? "+" : "−") : "";
  return `${prefix}${percentFormat.format(Math.abs(value))} %`;
}

export function formatDays(value: number): string {
  return `${percentFormat.format(value)} días`;
}

export function formatMovementDate(iso: string): string {
  const parsed = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return iso;
  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
  })
    .format(parsed)
    .replace(".", "");
}

/** Fecha de mañana en UTC, para que el navegador y el prerender no discrepen. */
export function tomorrowISO(from: Date = new Date()): string {
  const date = new Date(`${from.toISOString().slice(0, 10)}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
}

export function marginPercent(product: Product): number {
  if (product.price <= 0) return 0;
  return ((product.price - product.cost) / product.price) * 100;
}

export function dailySales(product: Product): number {
  return product.sales30 / 30;
}

/** 30 puntos deterministas que suman exactamente las ventas del producto. */
export function salesSeries(product: Product): number[] {
  const weights = Array.from({ length: 30 }, (_, index) => {
    const weekend = index % 7 === 5 || index % 7 === 6 ? 1.22 : 0.93;
    return weekend * (0.78 + hashUnit(`${product.id}-${index}`) * 0.44);
  });
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0) || 1;
  const rounded = weights.map((weight) => Math.round((weight / totalWeight) * product.sales30));
  const difference = product.sales30 - rounded.reduce((sum, value) => sum + value, 0);
  const last = rounded.length - 1;
  rounded[last] = (rounded[last] ?? 0) + difference;
  return rounded;
}

export function salesRevenue(): number {
  return products.reduce((sum, product) => sum + product.sales30 * product.price, 0);
}

export function averageMargin(): number {
  if (products.length === 0) return 0;
  return products.reduce((sum, product) => sum + marginPercent(product), 0) / products.length;
}

export function topCategory(): { category: string; sales: number } {
  const byCategory = new Map<string, number>();
  for (const product of products) {
    byCategory.set(product.category, (byCategory.get(product.category) ?? 0) + product.sales30);
  }
  let best = { category: "—", sales: 0 };
  for (const [category, sales] of byCategory) {
    if (sales > best.sales) best = { category, sales };
  }
  return best;
}

export function starProduct(): Product | null {
  if (products.length === 0) return null;
  return products.reduce(
    (best, product) => (product.sales30 > best.sales30 ? product : best),
    products[0]!,
  );
}

export function unitsInStock(): number {
  return products.reduce((sum, product) => sum + product.stock, 0);
}

export function belowMinimum(): number {
  return products.filter((product) => product.stock < product.minimum).length;
}

export function inventoryValue(): number {
  return products.reduce((sum, product) => sum + product.stock * product.cost, 0);
}

export function coverageAverage(): number {
  const totalDaily = products.reduce((sum, product) => sum + dailySales(product), 0);
  if (totalDaily <= 0) return 0;
  return unitsInStock() / totalDaily;
}

export function stockByCategory(): { category: string; units: number }[] {
  const byCategory = new Map<string, number>();
  for (const product of products) {
    byCategory.set(product.category, (byCategory.get(product.category) ?? 0) + product.stock);
  }
  return [...byCategory].map(([category, units]) => ({ category, units }));
}

/** Todas las filas operativas salen de la misma simulación neuronal. */
export function getInventoryRows(date: string): InventoryRow[] {
  return products.map((product) => {
    const simulation = simulate({
      product,
      date,
      promotion: false,
      holiday: false,
      activation: "relu",
    });
    const daily = dailySales(product);
    return {
      product,
      demand: simulation.demand,
      purchase: simulation.purchase,
      status: simulation.status,
      safetyStock: simulation.safetyStock,
      coverageDays: daily > 0 ? product.stock / daily : 0,
      estimatedCost: simulation.purchase * product.cost,
    };
  });
}

export function sortByUrgency(rows: InventoryRow[]): InventoryRow[] {
  return [...rows].sort((left, right) => {
    const byStatus = urgency[left.status] - urgency[right.status];
    if (byStatus !== 0) return byStatus;
    if (left.purchase !== right.purchase) return right.purchase - left.purchase;
    return left.product.name.localeCompare(right.product.name, "es");
  });
}

export function atRisk(rows: InventoryRow[]): number {
  return rows.filter((row) => row.status !== "sufficient").length;
}

export function inventoryAlerts(rows: InventoryRow[], limit = 4): InventoryRow[] {
  return sortByUrgency(rows.filter((row) => row.purchase > 0)).slice(0, limit);
}

export function toOrderLine(row: InventoryRow): OrderLine {
  return {
    productId: row.product.id,
    supplier: row.product.supplier,
    quantity: row.purchase,
    cost: row.purchase * row.product.cost,
  };
}

export function mergeOrderLines(current: OrderLine[], incoming: OrderLine[]): OrderLine[] {
  const lines = new Map(current.map((line) => [line.productId, line]));
  for (const line of incoming) lines.set(line.productId, line);
  return [...lines.values()];
}

export function orderTotal(lines: OrderLine[]): number {
  return lines.reduce((sum, line) => sum + line.cost, 0);
}

export function movementRows() {
  return inventoryMovements.flatMap((movement) => {
    const product = products.find((item) => item.id === movement.productId);
    return product ? [{ ...movement, product }] : [];
  });
}
