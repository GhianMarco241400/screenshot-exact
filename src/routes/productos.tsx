import { createFileRoute } from "@tanstack/react-router";

import { PageHeading, StatusBadge, formatPEN } from "@/components/market-ui";
import { products } from "@/lib/demo-data";
import { pageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/productos")({
  head: () =>
    pageMeta(
      "Productos | SmartMarket AI",
      "Listado de productos del minimarket con precios, categorías y disponibilidad de stock.",
    ),
  component: ProductsPage,
});

function ProductsPage() {
  return (
    <div>
      <PageHeading
        eyebrow="Catálogo"
        title="Productos"
        description="Artículos de ejemplo con su precio, categoría y nivel de existencias."
      />
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-foreground">12 productos</p>
        <p className="text-xs text-muted-foreground">Precios en soles peruanos</p>
      </div>
      <div className="surface-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <caption className="sr-only">Productos, precios y estado de stock</caption>
            <thead className="bg-muted/70 text-xs font-semibold uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3" scope="col">Producto</th>
                <th className="px-4 py-3" scope="col">Categoría</th>
                <th className="px-4 py-3 text-right" scope="col">Precio</th>
                <th className="px-4 py-3 text-right" scope="col">Stock</th>
                <th className="px-4 py-3" scope="col">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product) => (
                <tr key={product.id} className="transition-colors hover:bg-muted/40">
                  <td className="px-4 py-3.5">
                    <p className="font-medium text-foreground">{product.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Código {product.id}</p>
                  </td>
                  <td className="px-4 py-3.5 text-muted-foreground">{product.category}</td>
                  <td className="px-4 py-3.5 text-right font-medium tabular-nums text-foreground">{formatPEN(product.price)}</td>
                  <td className="px-4 py-3.5 text-right tabular-nums text-foreground">{product.stock} u.</td>
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