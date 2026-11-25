import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  BarChart3,
  Boxes,
  CircleDollarSign,
  PackageCheck,
  Plus,
  ShoppingCart,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Button } from "@/components/ui/button";
import {
  PageHeading,
  SectionTitle,
  StatusBadge,
  chartTooltipStyle,
  formatPEN,
} from "@/components/market-ui";
import type { StockState } from "@/lib/demo-data";
import {
  belowMinimum,
  coverageAverage,
  formatDays,
  formatMovementDate,
  formatUnits,
  getInventoryRows,
  inventoryValue,
  mergeOrderLines,
  movementRows,
  orderTotal,
  sortByUrgency,
  toOrderLine,
  tomorrowISO,
  unitsInStock,
  type OrderLine,
} from "@/lib/market-metrics";
import { statusLabels } from "@/lib/neural-sim";
import { requireSession } from "@/lib/demo-auth";
import { pageMeta } from "@/lib/page-meta";
import { emojiForCategory } from "@/lib/presentation-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/inventario")({
  beforeLoad: requireSession,
  head: () =>
    pageMeta(
      "Inventario | SmartMarket AI",
      "Control operativo de existencias, cobertura y órdenes de reposición simuladas.",
    ),
  component: InventoryPage,
});

const stateFilters: { value: StockState | "all"; label: string }[] = [
  { value: "all", label: "Todos" },
  ...(["urgent", "recommended", "risk", "sufficient"] as StockState[]).map((value) => ({
    value,
    label: statusLabels[value],
  })),
];

function InventoryKpi({
  label,
  value,
  note,
  icon: Icon,
  index = 0,
}: {
  label: string;
  value: string;
  note: string;
  icon: LucideIcon;
  index?: number;
}) {
  return (
    <article
      className="surface-panel surface-hover animate-fade-up p-4 sm:p-5"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {label}
          </p>
          <p
            className="mt-2 truncate font-display text-xl font-semibold tabular-nums text-foreground"
            title={value}
          >
            {value}
          </p>
        </div>
        <span className="icon-chip h-10 w-10 shrink-0">
          <Icon aria-hidden="true" className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">{note}</p>
    </article>
  );
}

function shortName(name: string): string {
  return name.split(" · ")[0] ?? name;
}

function InventoryPage() {
  const [activeState, setActiveState] = useState<StockState | "all">("all");
  const [orders, setOrders] = useState<OrderLine[]>([]);

  const date = useMemo(() => tomorrowISO(), []);
  const rows = useMemo(() => sortByUrgency(getInventoryRows(date)), [date]);
  const filteredRows = useMemo(
    () => (activeState === "all" ? rows : rows.filter((row) => row.status === activeState)),
    [rows, activeState],
  );
  const chartData = useMemo(
    () =>
      rows.map((row) => ({
        producto: shortName(row.product.name),
        stock: row.product.stock,
        minimo: row.product.minimum,
      })),
    [rows],
  );
  const movements = useMemo(() => movementRows(), []);
  const pending = rows.filter((row) => row.purchase > 0);

  const addOrder = (row: (typeof rows)[number]) => {
    if (row.purchase <= 0) return;
    setOrders((current) => mergeOrderLines(current, [toOrderLine(row)]));
  };

  const addAllOrders = () => {
    setOrders((current) => mergeOrderLines(current, pending.map(toOrderLine)));
  };

  return (
    <div>
      <PageHeading
        eyebrow="Control operativo"
        title="Inventario"
        description="Existencias, cobertura y reposición calculadas con la misma simulación neuronal. Ordena las prioridades y genera órdenes de ejemplo sin contactar a proveedores."
      />

      <section
        aria-label="Indicadores de existencias"
        className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
      >
        <InventoryKpi
          icon={CircleDollarSign}
          index={0}
          label="Valor del inventario"
          note="Suma de stock × costo"
          value={formatPEN(inventoryValue())}
        />
        <InventoryKpi
          icon={Boxes}
          index={1}
          label="Unidades en stock"
          note="Existencias disponibles"
          value={`${formatUnits(unitsInStock())} u.`}
        />
        <InventoryKpi
          icon={TriangleAlert}
          index={2}
          label="Productos bajo mínimo"
          note="Stock por debajo del mínimo"
          value={`${belowMinimum()} productos`}
        />
        <InventoryKpi
          icon={BarChart3}
          index={3}
          label="Cobertura promedio"
          note="Stock total / venta diaria total"
          value={formatDays(coverageAverage())}
        />
      </section>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div aria-label="Filtrar por estado" className="flex flex-wrap gap-2" role="group">
          {stateFilters.map((filter) => {
            const active = activeState === filter.value;
            return (
              <button
                aria-pressed={active}
                className={cn("chip", active && "chip-active")}
                key={filter.value}
                onClick={() => setActiveState(filter.value)}
                type="button"
              >
                {active ? (
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-ai" />
                ) : null}
                {filter.label}
              </button>
            );
          })}
        </div>
        <Button
          disabled={pending.length === 0}
          onClick={addAllOrders}
          size="sm"
          type="button"
          variant="brand"
        >
          <ShoppingCart aria-hidden="true" />
          Generar órdenes sugeridas
        </Button>
      </div>

      <div className="surface-panel mb-5 overflow-hidden">
        <p className="border-b border-border/60 px-4 py-2 text-[11px] text-muted-foreground sm:hidden">
          Desliza la tabla para ver demanda, compra sugerida y proveedor.
        </p>
        <div className="scroll-slim max-h-[68vh] overflow-auto">
          <table className="w-full min-w-[1180px] border-collapse text-left text-sm">
            <caption className="sr-only">
              Existencias, cobertura y reposición sugerida por producto
            </caption>
            <thead className="sticky top-0 z-10 bg-card/95 text-xs font-semibold uppercase text-muted-foreground backdrop-blur">
              <tr className="border-b border-border/70">
                <th className="px-4 py-3" scope="col">
                  Producto
                </th>
                <th className="px-4 py-3 text-right" scope="col">
                  Stock actual
                </th>
                <th className="px-4 py-3 text-right" scope="col">
                  Mínimo
                </th>
                <th className="px-4 py-3 text-right" scope="col">
                  Seguridad
                </th>
                <th className="px-4 py-3 text-right" scope="col">
                  Cobertura
                </th>
                <th className="px-4 py-3 text-right" scope="col">
                  Demanda mañana
                </th>
                <th className="px-4 py-3 text-right" scope="col">
                  Compra sugerida
                </th>
                <th className="px-4 py-3" scope="col">
                  Proveedor
                </th>
                <th className="px-4 py-3" scope="col">
                  Estado
                </th>
                <th className="px-4 py-3 text-right" scope="col">
                  Acción
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredRows.map((row, index) => (
                <tr
                  className="animate-fade-up transition-colors even:bg-muted/20 hover:bg-accent/40"
                  key={row.product.id}
                  style={{ animationDelay: `${Math.min(index, 8) * 35}ms` }}
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/50 text-base"
                      >
                        {emojiForCategory(row.product.category)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-foreground">{row.product.name}</p>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {row.product.category}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-right font-semibold tabular-nums text-foreground">
                    {row.product.stock} u.
                  </td>
                  <td className="px-4 py-3.5 text-right tabular-nums text-muted-foreground">
                    {row.product.minimum} u.
                  </td>
                  <td className="px-4 py-3.5 text-right tabular-nums text-muted-foreground">
                    {row.safetyStock} u.
                  </td>
                  <td className="px-4 py-3.5 text-right tabular-nums text-foreground">
                    {formatDays(row.coverageDays)}
                  </td>
                  <td className="px-4 py-3.5 text-right tabular-nums text-foreground">
                    {row.demand} u.
                  </td>
                  <td className="px-4 py-3.5 text-right font-semibold tabular-nums text-status-good">
                    {row.purchase > 0 ? `${row.purchase} u.` : "—"}
                  </td>
                  <td className="px-4 py-3.5 text-muted-foreground">{row.product.supplier}</td>
                  <td className="px-4 py-3.5">
                    <StatusBadge state={row.status} />
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    {row.purchase > 0 ? (
                      <Button
                        onClick={() => addOrder(row)}
                        size="sm"
                        type="button"
                        variant="outline"
                      >
                        <Plus aria-hidden="true" />
                        Generar orden
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">Sin acción</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredRows.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No hay productos con este estado.
            </p>
          ) : null}
        </div>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <section
          aria-label="Stock actual frente a stock mínimo"
          className="surface-panel min-w-0 p-4 sm:p-5"
        >
          <SectionTitle detail="Unidades por producto" title="Stock actual vs. mínimo" />
          <div className="h-[340px] min-w-0">
            <ResponsiveContainer height="100%" width="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 4, right: 16, bottom: 0, left: 8 }}
              >
                <CartesianGrid stroke="var(--border)" strokeDasharray="4 6" horizontal={false} />
                <XAxis
                  axisLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                  tickLine={false}
                  type="number"
                />
                <YAxis
                  axisLine={false}
                  dataKey="producto"
                  tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                  tickLine={false}
                  type="category"
                  width={120}
                />
                <Tooltip
                  contentStyle={chartTooltipStyle}
                  formatter={(value, name) => [`${value ?? 0} u.`, String(name)]}
                />
                <Bar
                  dataKey="stock"
                  fill="var(--primary)"
                  isAnimationActive={false}
                  name="Stock actual"
                  radius={[0, 5, 5, 0]}
                />
                <Bar
                  dataKey="minimo"
                  fill="var(--status-risk)"
                  isAnimationActive={false}
                  name="Stock mínimo"
                  radius={[0, 5, 5, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section
          aria-label="Órdenes de reposición (simuladas)"
          className="surface-panel flex flex-col p-4 sm:p-5"
        >
          <SectionTitle
            detail={`${orders.length} líneas`}
            title="Órdenes de reposición (simuladas)"
          />
          <p className="mb-3 text-xs leading-5 text-muted-foreground">
            Simulación: no se envía a ningún proveedor.
          </p>
          {orders.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 py-8 text-center">
              <PackageCheck aria-hidden="true" className="h-8 w-8 text-muted-foreground/60" />
              <p className="text-sm text-muted-foreground">
                Aún no hay líneas. Genera una orden desde una fila o usa el botón general.
              </p>
            </div>
          ) : (
            <>
              <div className="scroll-slim max-h-64 overflow-auto">
                <table className="w-full min-w-[360px] border-collapse text-left text-xs">
                  <thead className="sticky top-0 bg-card/95 text-[10px] uppercase tracking-wider text-muted-foreground">
                    <tr className="border-b border-border/70">
                      <th className="py-2" scope="col">
                        Proveedor
                      </th>
                      <th className="py-2 text-right" scope="col">
                        Cantidad
                      </th>
                      <th className="py-2 text-right" scope="col">
                        Costo estimado
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {orders.map((line) => (
                      <tr key={line.productId}>
                        <td className="py-2.5 pr-2 text-foreground">{line.supplier}</td>
                        <td className="py-2.5 text-right tabular-nums text-foreground">
                          {formatUnits(line.quantity)} u.
                        </td>
                        <td className="py-2.5 text-right tabular-nums text-foreground">
                          {formatPEN(line.cost)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-auto border-t border-border/60 pt-3">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-sm font-medium text-foreground">Total estimado</span>
                  <strong className="font-display text-lg tabular-nums text-status-good">
                    {formatPEN(orderTotal(orders))}
                  </strong>
                </div>
                <Button
                  className="mt-3"
                  onClick={() => setOrders([])}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  Vaciar panel
                </Button>
              </div>
            </>
          )}
        </section>
      </div>

      <section aria-label="Movimientos recientes" className="surface-panel p-4 sm:p-5">
        <SectionTitle detail="Últimas 8 operaciones" title="Movimientos recientes" />
        <div className="scroll-slim overflow-auto">
          <table className="w-full min-w-[520px] border-collapse text-left text-sm">
            <caption className="sr-only">
              Movimientos recientes de entrada y salida de stock
            </caption>
            <thead className="text-xs font-semibold uppercase text-muted-foreground">
              <tr className="border-b border-border/70">
                <th className="py-2" scope="col">
                  Fecha
                </th>
                <th className="py-2" scope="col">
                  Producto
                </th>
                <th className="py-2" scope="col">
                  Tipo
                </th>
                <th className="py-2 text-right" scope="col">
                  Cantidad
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {movements.map((movement) => (
                <tr key={movement.id}>
                  <td className="py-2.5 tabular-nums text-muted-foreground">
                    {formatMovementDate(movement.date)}
                  </td>
                  <td className="py-2.5 text-foreground">{movement.product.name}</td>
                  <td className="py-2.5">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[11px] font-semibold",
                        movement.type === "entrada"
                          ? "bg-status-good/10 text-status-good"
                          : "bg-status-risk/10 text-status-risk",
                      )}
                    >
                      {movement.type === "entrada" ? "Entrada" : "Salida"}
                    </span>
                  </td>
                  <td className="py-2.5 text-right font-semibold tabular-nums text-foreground">
                    {movement.type === "entrada" ? "+" : "−"}
                    {movement.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
