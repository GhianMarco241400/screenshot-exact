import { createFileRoute } from "@tanstack/react-router";
import {
  Boxes,
  CalendarDays,
  CircleDollarSign,
  ShieldCheck,
  ShoppingBasket,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { PageHeading } from "@/components/market-ui";
import { products } from "@/lib/demo-data";
import { simulate, statusLabels } from "@/lib/neural-sim";
import { requireSession } from "@/lib/demo-auth";
import { pageMeta } from "@/lib/page-meta";
import { cn } from "@/lib/utils";

const DEFAULT_DATE = new Date().toISOString().slice(0, 10);

const statusStyles: Record<string, string> = {
  sufficient: "bg-status-good/10 text-status-good ring-status-good/25",
  risk: "bg-status-risk/10 text-status-risk ring-status-risk/25",
  recommended: "bg-primary/10 text-primary ring-primary/25",
  urgent: "bg-status-urgent/10 text-status-urgent ring-status-urgent/25",
};

function PredictionPage() {
  const search = Route.useSearch();
  const preselected =
    products.find((item) => item.id === search.producto) ??
    products.find((item) => item.id === "P-002") ??
    products[0]!;

  const [productId, setProductId] = useState(preselected.id);
  const [date, setDate] = useState(DEFAULT_DATE);
  const [price, setPrice] = useState(preselected.price);
  const [recentSales, setRecentSales] = useState(preselected.sales30);
  const [promotion, setPromotion] = useState(false);
  const [holiday, setHoliday] = useState(false);

  useEffect(() => {
    const next = products.find((item) => item.id === search.producto);
    if (!next || next.id === productId) return;
    setProductId(next.id);
    setPrice(next.price);
    setRecentSales(next.sales30);
  }, [search.producto, productId]);

  const changeProduct = (id: string) => {
    setProductId(id);
    const next = products.find((item) => item.id === id);
    if (next) {
      setPrice(next.price);
      setRecentSales(next.sales30);
    }
  };

  const product = useMemo(
    () => products.find((item) => item.id === productId) ?? products[0]!,
    [productId],
  );
  const result = useMemo(
    () =>
      simulate({
        product,
        date,
        price,
        recentSales,
        promotion,
        holiday,
        activation: "relu",
      }),
    [product, date, price, recentSales, promotion, holiday],
  );
  const coverage =
    result.demand > 0 ? Math.min(100, Math.round((result.currentStock / result.demand) * 100)) : 0;

  return (
    <div>
      <PageHeading
        eyebrow="Planificación"
        title="Predicción de demanda"
        description="Ajusta las variables y observa cómo la misma red neuronal educativa estima la demanda y la reposición."
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <section aria-labelledby="prediction-inputs-title" className="surface-panel p-4 sm:p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h2
                className="font-display text-lg font-semibold text-foreground"
                id="prediction-inputs-title"
              >
                Datos del producto
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                La estimación se recalcula al cambiar cualquier campo
              </p>
            </div>
            <span className="icon-chip h-10 w-10 shrink-0">
              <ShoppingBasket aria-hidden="true" className="h-4 w-4" />
            </span>
          </div>

          <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-foreground">
              Producto
              <Select onValueChange={changeProduct} value={productId}>
                <SelectTrigger aria-label="Producto" className="bg-card/40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {products.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>

            <label className="grid gap-2 text-sm font-medium text-foreground">
              Fecha de predicción
              <Input
                aria-label="Fecha de predicción"
                className="bg-card/40"
                onChange={(event) => setDate(event.target.value)}
                type="date"
                value={date}
              />
            </label>

            <label className="grid gap-2 text-sm font-medium text-foreground">
              Precio de venta
              <span className="relative">
                <CircleDollarSign
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  aria-label="Precio de venta en soles"
                  className="bg-card/40 pl-9"
                  min="0"
                  onChange={(event) => setPrice(Number(event.target.value))}
                  step="0.10"
                  type="number"
                  value={price}
                />
              </span>
            </label>

            <label className="grid gap-2 text-sm font-medium text-foreground">
              Ventas recientes
              <span className="relative">
                <Input
                  aria-label="Ventas recientes"
                  className="bg-card/40 pr-16"
                  min="0"
                  onChange={(event) => setRecentSales(Number(event.target.value))}
                  type="number"
                  value={recentSales}
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-normal text-muted-foreground">
                  unidades
                </span>
              </span>
            </label>

            <div className="flex min-h-12 items-center justify-between rounded-lg border border-border/70 bg-card/40 px-3 py-2">
              <div className="flex items-center gap-2.5">
                <TrendingUp aria-hidden="true" className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Promoción</span>
              </div>
              <Switch aria-label="Promoción" checked={promotion} onCheckedChange={setPromotion} />
            </div>

            <div className="flex min-h-12 items-center justify-between rounded-lg border border-border/70 bg-card/40 px-3 py-2">
              <div className="flex items-center gap-2.5">
                <CalendarDays aria-hidden="true" className="h-4 w-4 text-status-risk" />
                <span className="text-sm font-medium text-foreground">Feriado</span>
              </div>
              <Switch aria-label="Feriado" checked={holiday} onCheckedChange={setHoliday} />
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-4 border-t border-border/60 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3 text-xs leading-5 text-muted-foreground">
              <Boxes aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p>Simulación educativa. No es un modelo entrenado ni usa datos reales.</p>
            </div>
            <Button
              onClick={() =>
                toast.info("Estimación actual", {
                  description: `${result.demand} unidades · ${statusLabels[result.status]}. Compra recomendada: ${result.purchase} unidades.`,
                })
              }
              type="button"
              variant="brand"
            >
              <Sparkles aria-hidden="true" />
              Estimar demanda
            </Button>
          </div>
        </section>

        <aside
          aria-labelledby="prediction-result-title"
          className="surface-panel relative flex flex-col overflow-hidden p-5 sm:p-6"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-ai/20 blur-3xl"
          />
          <div className="relative mb-5 flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ai">
                Resultado en vivo
              </p>
              <h2
                className="mt-2 font-display text-lg font-semibold text-foreground"
                id="prediction-result-title"
              >
                Estimación de demanda
              </h2>
            </div>
            <span className="icon-chip h-10 w-10 shrink-0">
              <ShoppingBasket aria-hidden="true" className="h-5 w-5" />
            </span>
          </div>

          <div className="relative rounded-xl border border-primary/25 bg-primary/5 p-4">
            <p className="text-sm text-muted-foreground">Demanda estimada</p>
            <p className="mt-1 font-display text-4xl font-semibold tabular-nums text-foreground">
              <span className="text-gradient">{result.demand}</span>
              <span className="ml-1 text-base font-medium text-muted-foreground">unidades</span>
            </p>
          </div>

          <dl className="relative mt-4 divide-y divide-border/60">
            <div className="flex items-center justify-between gap-4 py-3">
              <dt className="text-sm text-muted-foreground">Stock actual</dt>
              <dd className="text-sm font-semibold tabular-nums text-foreground">
                {result.currentStock} unidades
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4 py-3">
              <dt className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck aria-hidden="true" className="h-4 w-4" />
                Stock de seguridad
              </dt>
              <dd className="text-sm font-semibold tabular-nums text-foreground">
                {result.safetyStock} unidades
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4 py-3">
              <dt className="text-sm text-muted-foreground">Estado</dt>
              <dd
                className={cn(
                  "rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1",
                  statusStyles[result.status],
                )}
              >
                {statusLabels[result.status]}
              </dd>
            </div>
          </dl>

          <div className="relative mt-2">
            <div className="flex items-baseline justify-between gap-3 text-xs">
              <span className="font-medium text-foreground">Cobertura de stock</span>
              <span className="tabular-nums text-muted-foreground">{coverage}% de la demanda</span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted" aria-hidden="true">
              <div
                className="h-full rounded-full bg-status-risk"
                style={{ width: `${coverage}%` }}
              />
            </div>
          </div>

          <div className="relative mt-auto border-t border-border/60 pt-4">
            <p className="text-sm font-medium text-foreground">Compra recomendada</p>
            <p className="mt-1 font-display text-3xl font-semibold tabular-nums text-status-good">
              {result.purchase} unidades
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/prediccion")({
  beforeLoad: requireSession,
  validateSearch: (search: Record<string, unknown>): { producto?: string } => {
    const producto = search["producto"];
    return typeof producto === "string" ? { producto } : {};
  },
  head: () =>
    pageMeta(
      "Predicción de demanda | SmartMarket AI",
      "Estimación educativa de demanda y recomendación de reposición con una red neuronal determinista.",
    ),
  component: PredictionPage,
});
