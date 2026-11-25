import { createFileRoute } from "@tanstack/react-router";
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

import { PageHeading, SectionTitle, chartTooltipStyle, formatPEN } from "@/components/market-ui";
import { salesByCategory, salesByDay, salesHistory } from "@/lib/demo-data";
import { pageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/ventas")({
  head: () =>
    pageMeta(
      "Ventas | SmartMarket AI",
      "Historial de ventas de ejemplo y gráficos de ingresos por día y por categoría.",
    ),
  component: SalesPage,
});

function SalesPage() {
  return (
    <div>
      <PageHeading
        eyebrow="Rendimiento"
        title="Ventas"
        description="Historial de ejemplo y comparación de ventas por día y categoría."
      />

      <div className="mb-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <section aria-label="Ventas por día" className="surface-panel min-w-0 p-4 sm:p-5">
          <SectionTitle title="Ventas por día" detail="Últimos 7 días · S/" />
          <div className="h-64 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesByDay} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="4 5" vertical={false} />
                <XAxis axisLine={false} dataKey="day" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} tickLine={false} />
                <YAxis axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} tickLine={false} width={42} />
                <Tooltip contentStyle={chartTooltipStyle} formatter={(value) => [`S/ ${value ?? 0}`, "Venta"]} />
                <Line dataKey="sales" dot={{ fill: "var(--chart-1)", r: 3 }} stroke="var(--chart-1)" strokeWidth={2.5} type="monotone" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section aria-label="Ventas por categoría" className="surface-panel min-w-0 p-4 sm:p-5">
          <SectionTitle title="Ventas por categoría" detail="Acumulado de muestra · S/" />
          <div className="h-64 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesByCategory} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="4 5" vertical={false} />
                <XAxis axisLine={false} dataKey="category" interval={0} tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} tickLine={false} />
                <YAxis axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} tickLine={false} width={46} />
                <Tooltip contentStyle={chartTooltipStyle} formatter={(value) => [`S/ ${value ?? 0}`, "Venta"]} />
                <Bar dataKey="sales" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section aria-labelledby="sales-history-title" className="surface-panel overflow-hidden">
        <div className="border-b border-border px-4 py-4 sm:px-5">
          <h2 id="sales-history-title" className="text-base font-semibold text-foreground">Historial de ventas</h2>
          <p className="mt-1 text-xs text-muted-foreground">Transacciones recientes de ejemplo</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <caption className="sr-only">Historial de ventas de ejemplo</caption>
            <thead className="bg-muted/70 text-xs font-semibold uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3" scope="col">Comprobante</th>
                <th className="px-4 py-3" scope="col">Fecha y hora</th>
                <th className="px-4 py-3 text-right" scope="col">Artículos</th>
                <th className="px-4 py-3" scope="col">Categoría</th>
                <th className="px-4 py-3" scope="col">Pago</th>
                <th className="px-4 py-3 text-right" scope="col">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {salesHistory.map((sale) => (
                <tr key={sale.receipt} className="transition-colors hover:bg-muted/40">
                  <td className="px-4 py-3 font-medium text-foreground">{sale.receipt}</td>
                  <td className="px-4 py-3 text-muted-foreground">{sale.date}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-foreground">{sale.items}</td>
                  <td className="px-4 py-3 text-muted-foreground">{sale.category}</td>
                  <td className="px-4 py-3 text-muted-foreground">{sale.payment}</td>
                  <td className="px-4 py-3 text-right font-medium tabular-nums text-foreground">{formatPEN(sale.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}