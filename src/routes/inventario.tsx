import { createFileRoute } from "@tanstack/react-router";

import { Progress } from "@/components/ui/progress";
import { PageHeading, StatusBadge } from "@/components/market-ui";
import { products } from "@/lib/demo-data";
import { pageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/inventario")({
  head: () =>
    pageMeta(
      "Inventario | SmartMarket AI",
      "Consulta existencias, niveles mínimos y recomendaciones de reposición del minimarket.",
    ),
  component: InventoryPage,
});

const progressStyles = {
  sufficient: "[&>span]:bg-status-good",
  risk: "[&>span]:bg-status-risk",
  recommended: "[&>span]:bg-primary",
  urgent: "[&>span]:bg-status-urgent",
};

function InventoryPage() {
  return (
    <div>
      <PageHeading
        eyebrow="Control de existencias"
        title="Inventario"
        description="Niveles actuales frente al stock mínimo de cada producto."
      />
      <div className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
        <span>{products.length} productos</span>
        <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-status-good" />Suficiente</span>
        <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-status-risk" />Riesgo</span>
        <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-status-urgent" />Urgente</span>
      </div>
      <div className="surface-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] border-collapse text-left text-sm">
            <caption className="sr-only">Existencias, stock mínimo y estado de reposición</caption>
            <thead className="bg-muted/70 text-xs font-semibold uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3" scope="col">Producto</th>
                <th className="px-4 py-3 text-right" scope="col">Stock actual</th>
                <th className="px-4 py-3 text-right" scope="col">Stock mínimo</th>
                <th className="px-4 py-3" scope="col">Nivel</th>
                <th className="px-4 py-3" scope="col">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product) => (
                <tr key={product.id} className="transition-colors hover:bg-muted/40">
                  <td className="px-4 py-3.5 font-medium text-foreground">{product.name}</td>
                  <td className="px-4 py-3.5 text-right font-semibold tabular-nums text-foreground">{product.stock} u.</td>
                  <td className="px-4 py-3.5 text-right tabular-nums text-muted-foreground">{product.minimum} u.</td>
                  <td className="w-56 px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <Progress
                        aria-label={`Nivel de stock de ${product.name}`}
                        className={`h-2 ${progressStyles[product.state]}`}
                        value={product.stockPercent}
                      />
                      <span className="w-9 text-right text-xs tabular-nums text-muted-foreground">{product.stockPercent}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5"><StatusBadge state={product.state} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}