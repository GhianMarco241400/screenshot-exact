import { createFileRoute } from "@tanstack/react-router";
import { Boxes, CalendarDays, CircleDollarSign, ShieldCheck, ShoppingBasket, TrendingUp } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { PageHeading } from "@/components/market-ui";
import { predictionDemo, products } from "@/lib/demo-data";
import { pageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/prediccion")({
  head: () =>
    pageMeta(
      "Predicción de demanda | SmartMarket AI",
      "Formulario visual de ejemplo para mostrar una estimación de demanda y recomendación de compra.",
    ),
  component: PredictionPage,
});

function PredictionPage() {
  return (
    <div>
      <PageHeading
        eyebrow="Planificación"
        title="Predicción de demanda"
        description="Variables de ejemplo y una recomendación fija para planificar la reposición."
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section aria-labelledby="prediction-inputs-title" className="surface-panel p-4 sm:p-6">
          <div className="mb-5">
            <h2 id="prediction-inputs-title" className="text-base font-semibold text-foreground">Datos del producto</h2>
            <p className="mt-1 text-sm text-muted-foreground">Valores de muestra para la estimación</p>
          </div>
          <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-foreground">
              Producto
              <Select defaultValue="P-002">
                <SelectTrigger aria-label="Producto"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {products.map((product) => <SelectItem key={product.id} value={product.id}>{product.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </label>
            <label className="grid gap-2 text-sm font-medium text-foreground">
              Fecha de predicción
              <span className="relative">
                <Input aria-label="Fecha de predicción" className="pr-10" defaultValue="2026-11-26" type="date" />
                <CalendarDays aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </span>
            </label>
            <label className="grid gap-2 text-sm font-medium text-foreground">
              Precio de venta
              <span className="relative">
                <CircleDollarSign aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input aria-label="Precio de venta en soles" className="pl-9" defaultValue="8.50" min="0" step="0.10" type="number" />
              </span>
            </label>
            <label className="grid gap-2 text-sm font-medium text-foreground">
              Ventas recientes
              <span className="relative">
                <Input aria-label="Ventas recientes" className="pr-16" defaultValue="36" min="0" type="number" />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-normal text-muted-foreground">unidades</span>
              </span>
            </label>
            <div className="flex min-h-12 items-center justify-between rounded-md border border-border px-3 py-2">
              <div className="flex items-center gap-2.5">
                <TrendingUp aria-hidden="true" className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Promoción</span>
              </div>
              <Switch aria-label="Promoción" />
            </div>
            <div className="flex min-h-12 items-center justify-between rounded-md border border-border px-3 py-2">
              <div className="flex items-center gap-2.5">
                <CalendarDays aria-hidden="true" className="h-4 w-4 text-status-risk" />
                <span className="text-sm font-medium text-foreground">Feriado</span>
              </div>
              <Switch aria-label="Feriado" />
            </div>
          </div>
          <div className="mt-6 flex items-start gap-3 border-t border-border pt-4 text-xs leading-5 text-muted-foreground">
            <Boxes aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p>La demanda de ejemplo permanece fija y no cambia al editar los campos.</p>
          </div>
        </section>

        <aside aria-labelledby="prediction-result-title" className="surface-panel flex flex-col p-5 sm:p-6">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase text-primary">Resultado de muestra</p>
              <h2 id="prediction-result-title" className="mt-2 text-lg font-semibold text-foreground">Estimación de demanda</h2>
            </div>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <ShoppingBasket aria-hidden="true" className="h-5 w-5" />
            </span>
          </div>
          <div className="rounded-md bg-primary/5 p-4">
            <p className="text-sm text-muted-foreground">Demanda estimada</p>
            <p className="mt-1 text-3xl font-semibold tabular-nums text-primary">{predictionDemo.demand} <span className="text-base font-medium">unidades</span></p>
          </div>
          <dl className="mt-4 divide-y divide-border">
            <div className="flex items-center justify-between gap-4 py-3">
              <dt className="text-sm text-muted-foreground">Stock actual</dt>
              <dd className="text-sm font-semibold tabular-nums text-foreground">{predictionDemo.currentStock} unidades</dd>
            </div>
            <div className="flex items-center justify-between gap-4 py-3">
              <dt className="inline-flex items-center gap-2 text-sm text-muted-foreground"><ShieldCheck aria-hidden="true" className="h-4 w-4" />Stock de seguridad</dt>
              <dd className="text-sm font-semibold tabular-nums text-foreground">{predictionDemo.safetyStock} unidades</dd>
            </div>
          </dl>
          <div className="mt-auto border-t border-border pt-4">
            <p className="text-sm font-medium text-foreground">Compra recomendada</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-status-good">{predictionDemo.recommendedPurchase} unidades</p>
          </div>
        </aside>
      </div>
    </div>
  );
}