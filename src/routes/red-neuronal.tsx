import { createFileRoute } from "@tanstack/react-router";
import { Pause, Play, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { PageHeading, SectionTitle } from "@/components/market-ui";
import { products } from "@/lib/demo-data";
import { pageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/red-neuronal")({
  head: () =>
    pageMeta(
      "Simulación de red neuronal | SmartMarket AI",
      "Estructura visual educativa para mostrar los conceptos de una red neuronal aplicada a la demanda.",
    ),
  component: NeuralNetworkPage,
});

const concepts = [
  { title: "Neurona", text: "Unidad que combina señales de entrada para producir un resultado." },
  { title: "Capa de entrada", text: "Recibe los datos que se presentan al modelo." },
  { title: "Capas ocultas", text: "Transforman las señales entre la entrada y la salida." },
  { title: "Pesos", text: "Representan la importancia asignada a cada señal." },
  { title: "Sesgo", text: "Ajuste adicional aplicado a la suma de entradas." },
  { title: "Función de activación", text: "Transforma la suma para definir la respuesta de la neurona." },
  { title: "Capa de salida", text: "Presenta el resultado final de la red." },
];

function NeuralNetworkPage() {
  return (
    <div>
      <PageHeading
        eyebrow="Vista educativa"
        title="Simulación de red neuronal"
        description="Una estructura conceptual para explorar cómo se organiza una red neuronal."
      />

      <div role="note" className="mb-5 flex items-start gap-3 rounded-md border border-status-risk/30 bg-status-risk/10 px-4 py-3 text-sm text-status-risk">
        <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-status-risk" />
        <p>Simulación educativa. No es un modelo entrenado ni usa datos reales.</p>
      </div>

      <section aria-label="Controles visuales de la simulación" className="mb-4 flex flex-col gap-4 rounded-md border border-border bg-card p-4 shadow-sm lg:flex-row lg:items-end lg:justify-between">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:flex-wrap">
          <label className="grid min-w-44 gap-1.5 text-xs font-medium text-muted-foreground">
            Producto
            <Select defaultValue="P-001">
              <SelectTrigger aria-label="Producto"><SelectValue /></SelectTrigger>
              <SelectContent>
                {products.map((product) => <SelectItem key={product.id} value={product.id}>{product.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </label>
          <label className="grid min-w-40 gap-1.5 text-xs font-medium text-muted-foreground">
            Fecha
            <Select defaultValue="tomorrow">
              <SelectTrigger aria-label="Fecha"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Hoy</SelectItem>
                <SelectItem value="tomorrow">Mañana</SelectItem>
              </SelectContent>
            </Select>
          </label>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <label className="inline-flex items-center gap-2 text-sm text-foreground">
            Promoción <Switch aria-label="Promoción" />
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-foreground">
            Feriado <Switch aria-label="Feriado" />
          </label>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm"><Play aria-hidden="true" />Iniciar simulación</Button>
          <Button type="button" size="sm" variant="outline"><Pause aria-hidden="true" />Pausar</Button>
          <Button type="button" size="icon" variant="outline" aria-label="Reiniciar"><RotateCcw aria-hidden="true" /></Button>
        </div>
      </section>

      <div className="mb-5 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section aria-label="Espacio de simulación" className="flex min-h-[500px] items-center justify-center rounded-md border-2 border-dashed border-border bg-card/60 px-6 py-10">
          <p className="max-w-2xl text-center text-sm font-medium leading-7 text-muted-foreground sm:text-base">
            AQUÍ IRÁ LA SIMULACIÓN DE LA NEURONA: grafo de la red (6 entradas → 3 capas ocultas → 1 salida) con animación de la señal
          </p>
        </section>

        <aside className="surface-panel min-h-[260px] p-4 sm:p-5">
          <SectionTitle title="Anatomía de una neurona" />
          <div className="flex min-h-44 items-center justify-center rounded-md border border-dashed border-border bg-muted/40 px-5 text-center text-sm leading-6 text-muted-foreground">
            Aquí se mostrará la neurona seleccionada: entradas, pesos, sesgo, suma ponderada y función de activación
          </div>
        </aside>
      </div>

      <div className="mb-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <section className="surface-panel p-4 sm:p-5">
          <p className="text-sm text-muted-foreground">Demanda estimada</p>
          <p className="mt-2 text-xl font-semibold tabular-nums text-foreground">-- unidades</p>
        </section>
        <section className="surface-panel p-4 sm:p-5">
          <p className="text-sm text-muted-foreground">Recomendación de reposición</p>
          <p className="mt-2 text-xl font-semibold text-foreground">--</p>
        </section>
      </div>

      <section aria-labelledby="concepts-title">
        <div className="mb-4">
          <h2 id="concepts-title" className="text-base font-semibold text-foreground">Conceptos</h2>
          <p className="mt-1 text-sm text-muted-foreground">Elementos básicos de una red neuronal</p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {concepts.map((concept) => (
            <article key={concept.title} className="surface-panel min-h-28 p-4">
              <h3 className="text-sm font-semibold text-foreground">{concept.title}</h3>
              <p className="mt-2 text-sm leading-5 text-muted-foreground">{concept.text}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}