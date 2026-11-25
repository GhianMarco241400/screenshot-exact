import { useId } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, Receipt, TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { PageHeading, SectionTitle, chartTooltipStyle, formatPEN } from "@/components/market-ui";
import { salesByCategory, salesByDay, salesHistory } from "@/lib/demo-data";
import { requireSession } from "@/lib/demo-auth";
import { pageMeta } from "@/lib/page-meta";
import { seriesColor } from "@/lib/presentation-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/ventas")({
  beforeLoad: requireSession,
  head: () =>
    pageMeta(
      "Ventas | SmartMarket AI",
      "Historial de ventas de ejemplo y gráficos de ingresos por día y por categoría.",
    ),
  component: SalesPage,
});

const paymentStyles: Record<string, string> = {
  Yape: "border-violet/25 bg-violet/10 text-violet",
  Efectivo: "border-status-good/25 bg-status-good/10 text-status-good",
  Tarjeta: "border-ai/25 bg-ai/10 text-ai",
};

function SalesPage() {
  const dailyGradientId = `daily-${useId().replace(/:/g, "")}`;

  const weekTotal = salesByDay.reduce((sum, day) => sum + day.sales, 0);
  const categoryTotal = salesByCategory.reduce((sum, item) => sum + item.sales, 0);
  const averageTicket =
    salesHistory.length > 0
      ? salesHistory.reduce((sum, sale) => sum + sale.total, 0) / salesHistory.length
      : 0;

  const summary = [
    {
      label: "Ventas de la semana",
      value: formatPEN(weekTotal),
      note: "Lun a dom · muestra",
      icon: TrendingUp,
    },
    {
      label: "Ticket promedio",
      value: formatPEN(averageTicket),
      note: `${salesHistory.length} comprobantes`,
      icon: Receipt,
    },
    {
      label: "Categorías activas",
      value: String(salesByCategory.length),
      note: "Abarrotes lidera",
      icon: BarChart3,
    },
  ];

  return (
    <div>
      <PageHeading
        eyebrow="Rendimiento"
        title="Ventas"
        description="Historial de ejemplo y comparación de ventas por día y categoría, con lectura de participación."
      />

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {summary.map((item, index) => {
          const Icon = item.icon;
          return (
            <article
              className="surface-panel surface-hover animate-fade-up p-4 sm:p-5"
              key={item.label}
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="mt-2 font-display text-2xl font-semibold tabular-nums text-foreground">
                    {item.value}
                  </p>
                </div>
                <span className="icon-chip h-10 w-10 shrink-0">
                  <Icon aria-hidden="true" className="h-4 w-4" />
                </span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{item.note}</p>
            </article>
          );
        })}
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <section aria-label="Ventas por día" className="surface-panel min-w-0 p-4 sm:p-5">
          <SectionTitle detail="Últimos 7 días · S/" title="Ventas por día" />
          <div className="h-64 min-w-0">
            <ResponsiveContainer height="100%" width="100%">
              <AreaChart data={salesByDay} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id={dailyGradientId} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="4 6" vertical={false} />
                <XAxis
                  axisLine={false}
                  dataKey="day"
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis
                  axisLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                  tickLine={false}
                  width={42}
                />
                <Tooltip
                  contentStyle={chartTooltipStyle}
                  formatter={(value) => [`S/ ${value ?? 0}`, "Venta"]}
                />
                <Area
                  activeDot={{ r: 4, strokeWidth: 0 }}
                  dataKey="sales"
                  dot={{ fill: "var(--chart-1)", r: 3, strokeWidth: 0 }}
                  fill={`url(#${dailyGradientId})`}
                  isAnimationActive={false}
                  name="Ventas"
                  stroke="var(--chart-1)"
                  strokeWidth={2.5}
                  type="monotone"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section aria-label="Ventas por categoría" className="surface-panel min-w-0 p-4 sm:p-5">
          <SectionTitle detail="Acumulado de muestra · S/" title="Ventas por categoría" />
          <div className="h-64 min-w-0">
            <ResponsiveContainer height="100%" width="100%">
              <BarChart data={salesByCategory} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="4 6" vertical={false} />
                <XAxis
                  axisLine={false}
                  dataKey="category"
                  interval={0}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                  tickLine={false}
                />
                <YAxis
                  axisLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                  tickLine={false}
                  width={46}
                />
                <Tooltip
                  contentStyle={chartTooltipStyle}
                  formatter={(value) => [`S/ ${value ?? 0}`, "Venta"]}
                />
                <Bar dataKey="sales" isAnimationActive={false} name="Venta" radius={[6, 6, 0, 0]}>
                  {salesByCategory.map((item, index) => (
                    <Cell fill={seriesColor(index)} key={item.category} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section aria-labelledby="sales-history-title" className="surface-panel overflow-hidden">
          <div className="border-b border-border/60 px-4 py-4 sm:px-5">
            <h2
              className="font-display text-lg font-semibold text-foreground"
              id="sales-history-title"
            >
              Historial de ventas
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">Transacciones recientes de ejemplo</p>
          </div>
          <p className="border-b border-border/60 px-4 py-2 text-[11px] text-muted-foreground sm:hidden">
            Desliza la tabla para ver artículos, pago y total.
          </p>
          <div className="scroll-slim max-h-[420px] overflow-auto">
            <table className="w-full min-w-[700px] border-collapse text-left text-sm">
              <caption className="sr-only">Historial de ventas de ejemplo</caption>
              <thead className="sticky top-0 z-10 bg-card/95 text-xs font-semibold uppercase text-muted-foreground backdrop-blur">
                <tr className="border-b border-border/70">
                  <th className="px-4 py-3" scope="col">
                    Comprobante
                  </th>
                  <th className="px-4 py-3" scope="col">
                    Fecha y hora
                  </th>
                  <th className="px-4 py-3 text-right" scope="col">
                    Artículos
                  </th>
                  <th className="px-4 py-3" scope="col">
                    Categoría
                  </th>
                  <th className="px-4 py-3" scope="col">
                    Pago
                  </th>
                  <th className="px-4 py-3 text-right" scope="col">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {salesHistory.map((sale, index) => (
                  <tr
                    className="animate-fade-up transition-colors even:bg-muted/20 hover:bg-accent/40"
                    key={sale.receipt}
                    style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
                  >
                    <td className="px-4 py-3 font-medium text-foreground">{sale.receipt}</td>
                    <td className="px-4 py-3 text-muted-foreground">{sale.date}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-foreground">
                      {sale.items}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{sale.category}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-medium",
                          paymentStyles[sale.payment] ??
                            "border-border/60 bg-muted text-muted-foreground",
                        )}
                      >
                        {sale.payment}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium tabular-nums text-foreground">
                      {formatPEN(sale.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="category-share-title" className="surface-panel p-4 sm:p-5">
          <div className="mb-4">
            <h2
              className="font-display text-lg font-semibold text-foreground"
              id="category-share-title"
            >
              Participación por categoría
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Cuota sobre el acumulado de muestra
            </p>
          </div>
          <div className="space-y-4">
            {salesByCategory.map((item, index) => {
              const share = categoryTotal > 0 ? (item.sales / categoryTotal) * 100 : 0;
              return (
                <div key={item.category}>
                  <div className="flex items-baseline justify-between gap-3 text-xs">
                    <span className="font-medium text-foreground">{item.category}</span>
                    <span className="tabular-nums text-muted-foreground">
                      {formatPEN(item.sales)} · {share.toFixed(1)}%
                    </span>
                  </div>
                  <div
                    className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted"
                    aria-hidden="true"
                  >
                    <div
                      className="h-full rounded-full"
                      style={{ background: seriesColor(index), width: `${share}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
