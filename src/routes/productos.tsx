import { useId, useMemo, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowDownRight,
  ArrowUpRight,
  LayoutGrid,
  PackageSearch,
  Percent,
  Search,
  Sparkles,
  Star,
  Table2,
  Trophy,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { EmptyState, PageHeading, chartTooltipStyle, formatPEN } from "@/components/market-ui";
import { Sparkline } from "@/components/sparkline";
import { products, type Product } from "@/lib/demo-data";
import {
  averageMargin,
  formatPercent,
  formatUnits,
  marginPercent,
  salesSeries,
  starProduct,
  topCategory,
} from "@/lib/market-metrics";
import { requireSession } from "@/lib/demo-auth";
import { pageMeta } from "@/lib/page-meta";
import { emojiForCategory } from "@/lib/presentation-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/productos")({
  beforeLoad: requireSession,
  head: () =>
    pageMeta(
      "Productos | SmartMarket AI",
      "Catálogo comercial con precios, márgenes, proveedores y ventas de los últimos 30 días.",
    ),
  component: ProductsPage,
});

type SortKey = "sales" | "price" | "margin";
type ViewMode = "cards" | "table";

const sortLabels: Record<SortKey, string> = {
  sales: "Ventas 30 días",
  price: "Precio",
  margin: "Margen %",
};

function TrendBadge({ value }: { value: number }) {
  const positive = value >= 0;
  const Icon = positive ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums",
        positive ? "bg-status-good/10 text-status-good" : "bg-status-urgent/10 text-status-urgent",
      )}
    >
      <Icon aria-hidden="true" className="h-3 w-3" />
      {formatPercent(value, true)}
    </span>
  );
}

function MiniKpi({
  label,
  value,
  note,
  icon: Icon,
  index = 0,
}: {
  label: string;
  value: string;
  note: string;
  icon: typeof Star;
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
        <span className="icon-chip h-9 w-9 shrink-0">
          <Icon aria-hidden="true" className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-2 truncate text-xs text-muted-foreground">{note}</p>
    </article>
  );
}

function ProductsPage() {
  const chartGradientId = `product-sales-${useId().replace(/:/g, "")}`;
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todos");
  const [view, setView] = useState<ViewMode>("cards");
  const [sortKey, setSortKey] = useState<SortKey>("sales");
  const [sortAscending, setSortAscending] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const categories = useMemo(
    () => ["Todos", ...Array.from(new Set(products.map((product) => product.category)))],
    [],
  );
  const chartData = useMemo(
    () =>
      selected
        ? salesSeries(selected).map((units, index) => ({ dia: `D${index + 1}`, unidades: units }))
        : [],
    [selected],
  );

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const result = products.filter((product) => {
      const matchesCategory = category === "Todos" || product.category === category;
      const matchesQuery =
        normalized.length === 0 ||
        [product.name, product.id, product.category, product.supplier].some((field) =>
          field.toLowerCase().includes(normalized),
        );
      return matchesCategory && matchesQuery;
    });

    const sortValue = (product: Product) =>
      sortKey === "price"
        ? product.price
        : sortKey === "margin"
          ? marginPercent(product)
          : product.sales30;
    return result.sort((left, right) => {
      const difference = sortValue(left) - sortValue(right);
      return sortAscending ? difference : -difference;
    });
  }, [query, category, sortKey, sortAscending]);

  const bestCategory = topCategory();
  const star = starProduct();
  const kpis = [
    {
      label: "Total de productos",
      value: String(products.length),
      note: "Referencias en el catálogo",
      icon: PackageSearch,
    },
    {
      label: "Margen promedio",
      value: formatPercent(averageMargin()),
      note: "(precio − costo) / precio",
      icon: Percent,
    },
    {
      label: "Categoría más vendida",
      value: bestCategory.category,
      note: `${formatUnits(bestCategory.sales)} unidades en 30 días`,
      icon: Trophy,
    },
    {
      label: "Producto estrella",
      value: star?.name ?? "—",
      note: star ? `${formatUnits(star.sales30)} unidades en 30 días` : "Sin datos",
      icon: Star,
    },
  ];

  const openDetails = (product: Product) => {
    setSelected(product);
    setDetailsOpen(true);
  };

  const resetFilters = () => {
    setQuery("");
    setCategory("Todos");
  };

  return (
    <div>
      <PageHeading
        eyebrow="Catálogo comercial"
        title="Productos"
        description="Gestiona la información comercial del catálogo: precio, costo, margen, proveedor y ventas recientes. Las existencias se controlan en Inventario."
      />

      <section
        aria-label="Indicadores del catálogo"
        className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
      >
        {kpis.map((kpi, index) => (
          <MiniKpi
            icon={kpi.icon}
            index={index}
            key={kpi.label}
            label={kpi.label}
            note={kpi.note}
            value={kpi.value}
          />
        ))}
      </section>

      <div className="surface-panel mb-5 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              aria-label="Buscar producto por nombre, código, categoría o proveedor"
              className="bg-card/40 pl-10"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por nombre, código o proveedor…"
              type="search"
              value={query}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select onValueChange={(value) => setSortKey(value as SortKey)} value={sortKey}>
              <SelectTrigger aria-label="Ordenar catálogo" className="w-44 bg-card/40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(sortLabels) as SortKey[]).map((key) => (
                  <SelectItem key={key} value={key}>
                    {sortLabels[key]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              aria-label={sortAscending ? "Orden ascendente" : "Orden descendente"}
              aria-pressed={sortAscending}
              onClick={() => setSortAscending((current) => !current)}
              size="icon"
              type="button"
              variant="outline"
            >
              {sortAscending ? (
                <ArrowUpRight aria-hidden="true" className="rotate-180" />
              ) : (
                <ArrowDownRight aria-hidden="true" />
              )}
            </Button>
            <div
              aria-label="Vista del catálogo"
              className="flex items-center gap-1 rounded-full border border-border/70 bg-card/40 p-1"
              role="group"
            >
              <button
                aria-pressed={view === "cards"}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                  view === "cards"
                    ? "bg-primary/15 text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
                onClick={() => setView("cards")}
                type="button"
              >
                <LayoutGrid aria-hidden="true" className="h-3.5 w-3.5" />
                Tarjetas
              </button>
              <button
                aria-pressed={view === "table"}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                  view === "table"
                    ? "bg-primary/15 text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
                onClick={() => setView("table")}
                type="button"
              >
                <Table2 aria-hidden="true" className="h-3.5 w-3.5" />
                Tabla
              </button>
            </div>
          </div>
        </div>

        <div aria-label="Filtrar por categoría" className="mt-3 flex flex-wrap gap-2" role="group">
          {categories.map((item) => {
            const active = category === item;
            return (
              <button
                aria-pressed={active}
                className={cn("chip", active && "chip-active")}
                key={item}
                onClick={() => setCategory(item)}
                type="button"
              >
                {active ? (
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-ai" />
                ) : null}
                {item}
              </button>
            );
          })}
          <p
            aria-live="polite"
            className="ml-auto self-center text-xs font-medium text-muted-foreground"
          >
            {filtered.length} de {products.length} productos
          </p>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="surface-panel">
          <EmptyState
            action={
              <Button onClick={resetFilters} size="sm" variant="brand">
                Limpiar filtros
              </Button>
            }
            description="Prueba con otra categoría o un término de búsqueda distinto."
            title="No encontramos productos"
          />
        </div>
      ) : view === "cards" ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filtered.map((product, index) => (
            <button
              className="surface-panel surface-hover animate-fade-up flex min-h-52 flex-col gap-3 p-4 text-left"
              key={product.id}
              onClick={() => openDetails(product)}
              style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
              type="button"
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/50 text-lg"
                >
                  {emojiForCategory(product.category)}
                </span>
                <TrendBadge value={product.trend} />
              </div>
              <div className="min-w-0">
                <p className="truncate font-display text-sm font-semibold text-foreground">
                  {product.name}
                </p>
                <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                  {product.id} · {product.category}
                </p>
              </div>
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Precio
                  </p>
                  <p className="font-display text-lg font-semibold tabular-nums text-foreground">
                    {formatPEN(product.price)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Margen
                  </p>
                  <p className="text-sm font-semibold tabular-nums text-status-good">
                    {formatPercent(marginPercent(product))}
                  </p>
                </div>
              </div>
              <Sparkline
                className="h-8 w-full"
                data={salesSeries(product)}
                tone={product.trend >= 0 ? "good" : "risk"}
              />
              <p className="text-[10px] text-muted-foreground">
                Ventas 30 días ·{" "}
                <span className="font-semibold tabular-nums text-foreground">
                  {formatUnits(product.sales30)} u.
                </span>
              </p>
            </button>
          ))}
        </div>
      ) : (
        <div className="surface-panel overflow-hidden">
          <p className="border-b border-border/60 px-4 py-2 text-[11px] text-muted-foreground sm:hidden">
            Desliza la tabla para ver costos, márgenes y proveedores.
          </p>
          <div className="scroll-slim max-h-[68vh] overflow-auto">
            <table className="w-full min-w-[1060px] border-collapse text-left text-sm">
              <caption className="sr-only">
                Catálogo comercial con precios, costos, márgenes y ventas
              </caption>
              <thead className="sticky top-0 z-10 bg-card/95 text-xs font-semibold uppercase text-muted-foreground backdrop-blur">
                <tr className="border-b border-border/70">
                  <th className="px-4 py-3" scope="col">
                    Código
                  </th>
                  <th className="px-4 py-3" scope="col">
                    Producto
                  </th>
                  <th className="px-4 py-3" scope="col">
                    Categoría
                  </th>
                  <th className="px-4 py-3 text-right" scope="col">
                    Precio
                  </th>
                  <th className="px-4 py-3 text-right" scope="col">
                    Costo
                  </th>
                  <th className="px-4 py-3 text-right" scope="col">
                    Margen %
                  </th>
                  <th className="px-4 py-3 text-right" scope="col">
                    Ventas 30 días
                  </th>
                  <th className="px-4 py-3 text-right" scope="col">
                    Tendencia
                  </th>
                  <th className="px-4 py-3" scope="col">
                    Proveedor
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filtered.map((product) => (
                  <tr
                    className="animate-fade-up cursor-pointer transition-colors even:bg-muted/20 hover:bg-accent/40"
                    key={product.id}
                    onClick={() => openDetails(product)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        openDetails(product);
                      }
                    }}
                    tabIndex={0}
                  >
                    <td className="px-4 py-3.5 font-mono text-xs text-muted-foreground">
                      {product.id}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <span
                          aria-hidden="true"
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/50 text-base"
                        >
                          {emojiForCategory(product.category)}
                        </span>
                        <span className="truncate font-medium text-foreground">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-muted-foreground">{product.category}</td>
                    <td className="px-4 py-3.5 text-right font-medium tabular-nums text-foreground">
                      {formatPEN(product.price)}
                    </td>
                    <td className="px-4 py-3.5 text-right tabular-nums text-muted-foreground">
                      {formatPEN(product.cost)}
                    </td>
                    <td className="px-4 py-3.5 text-right font-semibold tabular-nums text-status-good">
                      {formatPercent(marginPercent(product))}
                    </td>
                    <td className="px-4 py-3.5 text-right tabular-nums text-foreground">
                      {formatUnits(product.sales30)} u.
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <TrendBadge value={product.trend} />
                    </td>
                    <td className="px-4 py-3.5 text-muted-foreground">{product.supplier}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Sheet onOpenChange={setDetailsOpen} open={detailsOpen}>
        <SheetContent className="scroll-slim w-full overflow-y-auto sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{selected?.name ?? "Ficha del producto"}</SheetTitle>
            <SheetDescription>Datos comerciales y ventas de los últimos 30 días.</SheetDescription>
          </SheetHeader>
          {selected ? (
            <div className="mt-5 space-y-5">
              <dl className="grid grid-cols-2 gap-2.5">
                {[
                  { label: "Código", value: selected.id },
                  { label: "Categoría", value: selected.category },
                  { label: "Precio", value: formatPEN(selected.price) },
                  { label: "Costo", value: formatPEN(selected.cost) },
                  { label: "Margen", value: formatPercent(marginPercent(selected)) },
                  { label: "Proveedor", value: selected.supplier },
                  { label: "Ventas 30 días", value: `${formatUnits(selected.sales30)} u.` },
                  { label: "Tendencia", value: formatPercent(selected.trend, true) },
                ].map((item) => (
                  <div
                    className="rounded-lg border border-border/60 bg-card/40 p-3"
                    key={item.label}
                  >
                    <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {item.label}
                    </dt>
                    <dd
                      className="mt-1 truncate text-sm font-semibold tabular-nums text-foreground"
                      title={item.value}
                    >
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <div>
                <div className="mb-2 flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-sm font-semibold text-foreground">
                    Ventas de 30 días
                  </h3>
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {formatUnits(selected.sales30)} unidades
                  </span>
                </div>
                <div className="h-56 min-w-0">
                  <ResponsiveContainer height="100%" width="100%">
                    <AreaChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                      <defs>
                        <linearGradient id={chartGradientId} x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.45} />
                          <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        stroke="var(--border)"
                        strokeDasharray="4 6"
                        vertical={false}
                      />
                      <XAxis
                        axisLine={false}
                        dataKey="dia"
                        interval={4}
                        tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                        tickLine={false}
                      />
                      <YAxis
                        axisLine={false}
                        tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                        tickLine={false}
                        width={34}
                      />
                      <Tooltip
                        contentStyle={chartTooltipStyle}
                        formatter={(value) => [`${value ?? 0} u.`, "Ventas"]}
                      />
                      <Area
                        activeDot={{ r: 3, strokeWidth: 0 }}
                        dataKey="unidades"
                        dot={false}
                        fill={`url(#${chartGradientId})`}
                        isAnimationActive={false}
                        name="Ventas"
                        stroke="var(--chart-1)"
                        strokeWidth={2.5}
                        type="monotone"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <Button asChild className="w-full" variant="brand">
                <Link search={{ producto: selected.id }} to="/prediccion">
                  <Sparkles aria-hidden="true" />
                  Simular demanda
                </Link>
              </Button>
            </div>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}
