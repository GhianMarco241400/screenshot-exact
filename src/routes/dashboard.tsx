import { useId, useMemo } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  Boxes,
  ChartNoAxesCombined,
  CircleDollarSign,
  PackagePlus,
  Sparkles,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  KpiCard,
  PageHeading,
  SectionTitle,
  StatusBadge,
  chartTooltipStyle,
} from "@/components/market-ui";
import { Sparkline } from "@/components/sparkline";
import { salesTrend } from "@/lib/demo-data";
import {
  atRisk,
  formatUnits,
  getInventoryRows,
  inventoryAlerts,
  salesRevenue,
  stockByCategory,
  tomorrowISO,
  unitsInStock,
} from "@/lib/market-metrics";
import { requireSession } from "@/lib/demo-auth";
import { pageMeta } from "@/lib/page-meta";
import { kpiMeta } from "@/lib/presentation-data";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: requireSession,
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
  const salesGradientId = `sales-${useId().replace(/:/g, "")}`;
  const forecastGradientId = `forecast-${useId().replace(/:/g, "")}`;
  const inventoryGradientId = `inventory-${useId().replace(/:/g, "")}`;

  const rows = useMemo(() => getInventoryRows(tomorrowISO()), []);
  const alerts = useMemo(() => inventoryAlerts(rows), [rows]);
  const categoryStock = useMemo(() => stockByCategory(), []);
  const totalStock = unitsInStock();
  const demandValue = rows.reduce((sum, row) => sum + row.demand, 0);
  const alertCount = rows.filter((row) => row.purchase > 0).length;

  const kpis = [
    {
      key: "sales",
      label: "Ventas del mes",
      value: salesRevenue(),
      format: "currency",
      icon: CircleDollarSign,
      note: "Ingresos de los últimos 30 días",
      meta: kpiMeta.sales,
    },
    {
      key: "risk",
      label: "Productos en riesgo",
      value: atRisk(rows),
      format: "count",
      icon: AlertTriangle,
      note: "Requieren seguimiento",
      meta: kpiMeta.risk,
    },
    {
      key: "demand",
      label: "Demanda de mañana",
      value: demandValue,
      format: "units",
      icon: ChartNoAxesCombined,
      note: "Estimación de unidades",
      meta: kpiMeta.demand,
    },
    {
      key: "stock",
      label: "Unidades en stock",
      value: totalStock,
      format: "units",
      icon: Boxes,
      note: "Suma de existencias",
      meta: kpiMeta.stock,
    },
  ] as const;

  return (
    <div>
      <PageHeading
        eyebrow="Vista general"
        title="Dashboard"
        description="Ventas, demanda e inventario en un solo lugar, con lectura rápida del estado del minimarket."
      />

      <section aria-labelledby="welcome-title" className="hero-panel mb-6 p-5 sm:p-8">
        <div className="relative z-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-ai/30 bg-ai/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-ai">
              <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
              Panel de IA · datos de demostración
            </span>
            <h2 className="mt-4 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Buenos días, equipo SmartMarket
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Hoy se esperan{" "}
              <strong className="font-semibold text-foreground">
                {formatUnits(demandValue)} unidades
              </strong>{" "}
              de demanda y{" "}
              <strong className="font-semibold text-foreground">{alertCount} productos</strong>{" "}
              requieren reposición prioritaria.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild variant="brand">
                <Link to="/prediccion">
                  <Sparkles aria-hidden="true" />
                  Ver predicción
                </Link>
              </Button>
              <Button asChild className="border-border/70 bg-card/40" variant="outline">
                <Link to="/inventario">
                  Revisar inventario
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="surface-panel relative overflow-hidden p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Demanda estimada
            </p>
            <p className="mt-2 font-display text-4xl font-semibold tabular-nums text-foreground">
              {formatUnits(demandValue)}
              <span className="ml-1 text-base font-medium text-muted-foreground">u.</span>
            </p>
            <div className="mt-3 flex items-end justify-between gap-3">
              <span className="inline-flex items-center gap-1 rounded-full bg-status-good/10 px-2 py-1 text-xs font-semibold text-status-good">
                {kpiMeta.demand.delta}
              </span>
              <Sparkline className="h-9 w-24" data={kpiMeta.demand.spark} tone="ai" />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">Proyección para mañana</p>
          </div>
        </div>
      </section>

      <section
        aria-label="Indicadores del mes"
        className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
      >
        {kpis.map((metric, index) => (
          <KpiCard
            delta={metric.meta.delta}
            direction={metric.meta.direction}
            format={metric.format}
            icon={metricIcons[metric.key]}
            index={index}
            key={metric.key}
            label={metric.label}
            note={metric.note}
            spark={metric.meta.spark}
            sparkTone={metric.key === "demand" ? "ai" : "primary"}
            tone={metric.meta.tone}
            value={metric.value}
          />
        ))}
      </section>

      <div className="mb-6 grid grid-cols-1 gap-4 xl:grid-cols-5">
        <section
          aria-label="Ventas y predicción"
          className="surface-panel min-w-0 p-4 sm:p-5 xl:col-span-3"
        >
          <SectionTitle detail="Últimos 7 días · S/" title="Ventas y demanda estimada" />
          <div className="h-72 min-w-0">
            <ResponsiveContainer height="100%" width="100%">
              <AreaChart data={salesTrend} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id={salesGradientId} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id={forecastGradientId} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--ai)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--ai)" stopOpacity={0} />
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
                  formatter={(value, name) => [`S/ ${value ?? 0}`, String(name)]}
                />
                <ReferenceArea fill="var(--ai)" fillOpacity={0.06} x1="Jue" x2="Dom" />
                <Area
                  activeDot={{ r: 4, strokeWidth: 0 }}
                  connectNulls={false}
                  dataKey="actual"
                  dot={{ fill: "var(--chart-1)", r: 3, strokeWidth: 0 }}
                  fill={`url(#${salesGradientId})`}
                  isAnimationActive={false}
                  name="Ventas registradas"
                  stroke="var(--chart-1)"
                  strokeWidth={2.5}
                  type="monotone"
                />
                <Area
                  activeDot={{ r: 4, strokeWidth: 0 }}
                  connectNulls={false}
                  dataKey="forecast"
                  dot={{ fill: "var(--ai)", r: 3, strokeWidth: 0 }}
                  fill={`url(#${forecastGradientId})`}
                  isAnimationActive={false}
                  name="Demanda estimada"
                  stroke="var(--ai)"
                  strokeDasharray="6 5"
                  strokeWidth={2.5}
                  type="monotone"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-5 rounded-full bg-chart-1" aria-hidden="true" />
              Ventas registradas
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-5 rounded-full bg-ai" aria-hidden="true" />
              Demanda estimada
            </span>
            <span className="inline-flex items-center gap-2">
              <span
                className="h-2 w-5 rounded-full border border-ai/40 bg-ai/10"
                aria-hidden="true"
              />
              Zona de predicción
            </span>
          </div>
        </section>

        <section
          aria-label="Stock por categoría"
          className="surface-panel min-w-0 p-4 sm:p-5 xl:col-span-2"
        >
          <SectionTitle detail="Unidades disponibles" title="Stock por categoría" />
          <div className="h-72 min-w-0">
            <ResponsiveContainer height="100%" width="100%">
              <BarChart
                data={categoryStock}
                layout="vertical"
                margin={{ top: 0, right: 12, bottom: 0, left: 8 }}
              >
                <defs>
                  <linearGradient id={inventoryGradientId} x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="var(--ai)" stopOpacity={0.9} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="4 6" horizontal={false} />
                <XAxis
                  axisLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                  tickLine={false}
                  type="number"
                />
                <YAxis
                  axisLine={false}
                  dataKey="category"
                  tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                  tickLine={false}
                  type="category"
                  width={70}
                />
                <Tooltip
                  contentStyle={chartTooltipStyle}
                  formatter={(value) => [`${value ?? 0} u.`, "Stock"]}
                />
                <Bar
                  dataKey="units"
                  fill={`url(#${inventoryGradientId})`}
                  isAnimationActive={false}
                  name="Stock"
                  radius={[0, 6, 6, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Total disponible:{" "}
            <span className="font-semibold text-foreground">{formatUnits(totalStock)} u.</span>
          </p>
        </section>
      </div>

      <section aria-labelledby="replenishment-title" className="surface-panel p-4 sm:p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2
              className="font-display text-lg font-semibold text-foreground"
              id="replenishment-title"
            >
              Alertas de reposición
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">Productos que necesitan atención</p>
          </div>
          <Button asChild size="sm" variant="outline">
            <Link to="/inventario">
              Ver inventario
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
        {alerts.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No hay reposiciones pendientes con los datos actuales.
          </p>
        ) : (
          <div className="divide-y divide-border/60">
            {alerts.map((row, index) => {
              const suggested = `Comprar ${formatUnits(row.purchase)} u.`;
              return (
                <div
                  className="animate-fade-up grid grid-cols-1 items-center gap-2 py-3 sm:grid-cols-[minmax(0,1fr)_auto_auto_auto] sm:gap-4"
                  key={row.product.id}
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {row.product.name}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {row.product.stock} u. · mínimo {row.product.minimum} · seguridad{" "}
                      {row.safetyStock}
                    </p>
                  </div>
                  <StatusBadge state={row.status} />
                  <p className="font-display text-sm font-semibold tabular-nums text-foreground sm:text-right">
                    {suggested}
                  </p>
                  <Button
                    className="w-fit"
                    onClick={() =>
                      toast.info("Reposición sugerida", {
                        description: `${row.product.name} · ${suggested} (demostración)`,
                      })
                    }
                    size="sm"
                    variant="outline"
                  >
                    <PackagePlus aria-hidden="true" />
                    Reponer
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
