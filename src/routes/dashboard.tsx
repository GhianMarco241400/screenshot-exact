import { Link, createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  Boxes,
  ChartNoAxesCombined,
  CircleDollarSign,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Button } from "@/components/ui/button";
import { MetricCard, PageHeading, SectionTitle, StatusBadge, chartTooltipStyle } from "@/components/market-ui";
import {
  categoryStock,
  monthlyMetrics,
  replenishmentAlerts,
  salesTrend,
} from "@/lib/demo-data";
import { pageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/dashboard")({
  head: () =>
    pageMeta(
      "Dashboard | SmartMarket AI",
      "Resumen de ventas del mes, demanda estimada, stock disponible y alertas de reposición.",
    ),
  component: DashboardPage,
});

const metricIcons = {
  sales: CircleDollarSign,
  risk: AlertTriangle,
  demand: ChartNoAxesCombined,
  stock: Boxes,
};

function DashboardPage() {
  return (
    <div>
      <PageHeading
        eyebrow="Vista general"
        title="Dashboard"
        description="Ventas, demanda e inventario en un solo lugar."
      />

      <section aria-label="Indicadores del mes" className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {monthlyMetrics.map((metric) => (
          <MetricCard
            key={metric.label}
            icon={metricIcons[metric.icon]}
            label={metric.label}
            note={metric.note}
            value={metric.value}
          />
        ))}
      </section>

      <div className="mb-6 grid grid-cols-1 gap-4 xl:grid-cols-5">
        <section aria-label="Ventas y predicción" className="surface-panel min-w-0 p-4 sm:p-5 xl:col-span-3">
          <SectionTitle title="Ventas y demanda estimada" detail="Últimos 7 días · S/" />
          <div className="h-64 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesTrend} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="4 5" vertical={false} />
                <XAxis axisLine={false} dataKey="day" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} tickLine={false} />
                <YAxis axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} tickLine={false} tickFormatter={(value: number) => `${value}`} width={42} />
                <Tooltip contentStyle={chartTooltipStyle} formatter={(value) => [`S/ ${value ?? 0}`, "Venta"]} />
                <Line dataKey="actual" dot={{ fill: "var(--chart-1)", r: 3 }} name="Ventas" stroke="var(--chart-1)" strokeWidth={2.5} type="monotone" />
                <Line connectNulls={false} dataKey="forecast" dot={{ fill: "var(--chart-2)", r: 3 }} name="Predicción" stroke="var(--chart-2)" strokeDasharray="6 5" strokeWidth={2.5} type="monotone" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-2"><span className="h-2 w-5 rounded-full bg-chart-1" />Ventas registradas</span>
            <span className="inline-flex items-center gap-2"><span className="h-2 w-5 rounded-full bg-chart-2" />Demanda estimada</span>
          </div>
        </section>

        <section aria-label="Stock por categoría" className="surface-panel min-w-0 p-4 sm:p-5 xl:col-span-2">
          <SectionTitle title="Stock por categoría" detail="Unidades disponibles" />
          <div className="h-64 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryStock} layout="vertical" margin={{ top: 0, right: 12, bottom: 0, left: 8 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="4 5" horizontal={false} />
                <XAxis axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} tickLine={false} type="number" />
                <YAxis axisLine={false} dataKey="category" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} tickLine={false} type="category" width={70} />
                <Tooltip contentStyle={chartTooltipStyle} formatter={(value) => [`${value ?? 0} u.`, "Stock"]} />
                <Bar dataKey="units" fill="var(--chart-1)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section aria-labelledby="replenishment-title" className="surface-panel p-4 sm:p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 id="replenishment-title" className="text-base font-semibold text-foreground">Alertas de reposición</h2>
            <p className="mt-1 text-xs text-muted-foreground">Productos que necesitan atención</p>
          </div>
          <Button asChild size="sm" variant="outline"><Link to="/inventario">Ver inventario</Link></Button>
        </div>
        <div className="divide-y divide-border">
          {replenishmentAlerts.map((alert) => (
            <div key={alert.product} className="grid grid-cols-1 gap-2 py-3 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center sm:gap-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{alert.product}</p>
                <p className="mt-1 text-xs text-muted-foreground">{alert.detail}</p>
              </div>
              <StatusBadge state={alert.state} />
              <p className="text-sm font-semibold tabular-nums text-foreground sm:text-right">{alert.suggested}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}