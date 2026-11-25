import { createFileRoute } from "@tanstack/react-router";
import { useReducedMotion } from "motion/react";
import { Pause, Play, RotateCcw, Sparkles, TriangleAlert } from "lucide-react";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";

import { AnatomyPanel } from "@/components/neural/AnatomyPanel";
import { NeuralGraphFallback } from "@/components/neural/NeuralGraphFallback";
import { buildNodes } from "@/components/neural/neural-layout";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { PageHeading } from "@/components/market-ui";
import { useCountUp } from "@/hooks/use-count-up";
import { SEQUENCE_STEPS, useNeuralSequence } from "@/hooks/use-neural-sequence";
import { useWebGLSupport } from "@/hooks/use-webgl-support";
import { products } from "@/lib/demo-data";
import { simulate, statusLabels, type Activation } from "@/lib/neural-sim";
import { requireSession } from "@/lib/demo-auth";
import { pageMeta } from "@/lib/page-meta";
import { cn } from "@/lib/utils";

const NeuralScene3D = lazy(() =>
  import("@/components/neural/NeuralScene3D").then((module) => ({ default: module.NeuralScene3D })),
);

const TODAY_ISO = new Date().toISOString().slice(0, 10);
const TOMORROW = new Date(`${TODAY_ISO}T00:00:00Z`);
TOMORROW.setUTCDate(TOMORROW.getUTCDate() + 1);
const TOMORROW_ISO = TOMORROW.toISOString().slice(0, 10);

const concepts = [
  { title: "Neurona", text: "Unidad que combina señales de entrada para producir un resultado." },
  { title: "Capa de entrada", text: "Recibe seis variables normalizadas entre 0 y 1." },
  { title: "Capas ocultas", text: "Tres capas (6, 5 y 4 neuronas) transforman la señal." },
  { title: "Pesos", text: "Cian si suman y magenta si restan; su grosor muestra su magnitud." },
  { title: "Sesgo", text: "Ajuste adicional aplicado a la suma de entradas." },
  { title: "Función de activación", text: "ReLU, sigmoide o tanh transforman la suma de la capa." },
  {
    title: "Capa de salida",
    text: "Una neurona presenta la demanda estimada entre 15 y 80 unidades.",
  },
];

const statusStyles: Record<string, string> = {
  sufficient: "border-status-good/30 bg-status-good/10 text-status-good",
  risk: "border-status-risk/30 bg-status-risk/10 text-status-risk",
  recommended: "border-primary/30 bg-primary/10 text-primary",
  urgent: "border-status-urgent/30 bg-status-urgent/10 text-status-urgent",
};

function SceneLoading() {
  return (
    <div className="surface-panel flex h-[560px] w-full items-center justify-center rounded-2xl">
      <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
        <Sparkles aria-hidden="true" className="h-4 w-4 animate-pulse text-ai" />
        Preparando la red neuronal 3D…
      </p>
    </div>
  );
}

function NeuralNetworkPage() {
  const reducedMotion = useReducedMotion() === true;
  const [productId, setProductId] = useState("P-001");
  const [dateMode, setDateMode] = useState<"today" | "tomorrow">("tomorrow");
  const [promotion, setPromotion] = useState(false);
  const [holiday, setHoliday] = useState(false);
  const [activation, setActivation] = useState<Activation>("relu");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const webgl = useWebGLSupport();
  useEffect(() => setMounted(true), []);

  const product = useMemo(
    () => products.find((item) => item.id === productId) ?? products[0]!,
    [productId],
  );
  const date = dateMode === "today" ? TODAY_ISO : TOMORROW_ISO;
  const result = useMemo(
    () => simulate({ product, date, promotion, holiday, activation }),
    [product, date, promotion, holiday, activation],
  );

  const sequence = useNeuralSequence({
    resetKey: `${productId}-${date}-${promotion}-${holiday}-${activation}`,
    reducedMotion,
  });
  const animatedDemand = useCountUp(sequence.complete ? result.demand : 0, 850);
  const nodes = useMemo(() => buildNodes(result), [result]);

  const selectedNode = nodes.find((node) => node.key === selectedKey) ?? nodes[nodes.length - 1];
  const tracedLayer =
    selectedNode && selectedNode.layer > 0
      ? result.layers[Math.min(selectedNode.layer, result.layers.length) - 1]
      : result.layers[0];
  const tracedNeuron =
    tracedLayer?.neurons[0] ?? result.layers[result.layers.length - 1]?.neurons[0] ?? null;

  return (
    <div>
      <PageHeading
        eyebrow="Vista educativa"
        title="Simulación de red neuronal"
        description="Explora cómo una red 6 → 6 → 5 → 4 → 1 transforma los datos del producto en una estimación de demanda."
      />

      <div
        className="mb-5 flex items-start gap-3 rounded-xl border border-status-risk/30 bg-status-risk/10 px-4 py-3 text-sm text-status-risk"
        role="note"
      >
        <TriangleAlert aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
        <p>Simulación educativa. No es un modelo entrenado ni usa datos reales.</p>
      </div>

      <section
        aria-label="Controles de la simulación"
        className="surface-panel mb-5 flex flex-col gap-4 p-4 lg:flex-row lg:items-end lg:justify-between"
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:flex-wrap">
          <label className="grid min-w-44 gap-1.5 text-xs font-medium text-muted-foreground">
            Producto
            <Select onValueChange={setProductId} value={productId}>
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
          <label className="grid min-w-40 gap-1.5 text-xs font-medium text-muted-foreground">
            Fecha
            <Select
              onValueChange={(value) => setDateMode(value === "today" ? "today" : "tomorrow")}
              value={dateMode}
            >
              <SelectTrigger aria-label="Fecha" className="bg-card/40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Hoy</SelectItem>
                <SelectItem value="tomorrow">Mañana</SelectItem>
              </SelectContent>
            </Select>
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <label className="inline-flex items-center gap-2 text-sm text-foreground">
            Promoción
            <Switch aria-label="Promoción" checked={promotion} onCheckedChange={setPromotion} />
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-foreground">
            Feriado
            <Switch aria-label="Feriado" checked={holiday} onCheckedChange={setHoliday} />
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            disabled={sequence.playing}
            onClick={sequence.start}
            size="sm"
            type="button"
            variant="brand"
          >
            <Play aria-hidden="true" />
            Iniciar simulación
          </Button>
          <Button
            disabled={!sequence.playing}
            onClick={sequence.pause}
            size="sm"
            type="button"
            variant="outline"
          >
            <Pause aria-hidden="true" />
            Pausar
          </Button>
          {!sequence.playing && sequence.stage >= 0 && sequence.stage < 4 ? (
            <Button onClick={sequence.resume} size="sm" type="button" variant="outline">
              <Play aria-hidden="true" />
              Reanudar
            </Button>
          ) : null}
          <Button
            aria-label="Reiniciar simulación"
            onClick={sequence.restart}
            size="icon"
            type="button"
            variant="outline"
          >
            <RotateCcw aria-hidden="true" />
          </Button>
          <div
            className="flex items-center gap-1 rounded-md border border-border/70 bg-card/40 p-0.5"
            role="group"
            aria-label="Velocidad"
          >
            {[0.5, 1, 2].map((value) => (
              <button
                aria-pressed={sequence.speed === value}
                className={cn(
                  "rounded px-2 py-1 text-[11px] font-semibold tabular-nums",
                  sequence.speed === value
                    ? "bg-primary/15 text-foreground"
                    : "text-muted-foreground",
                )}
                key={value}
                onClick={() => sequence.setSpeed(value)}
                type="button"
              >
                {value}x
              </button>
            ))}
          </div>
        </div>
      </section>

      <ol
        aria-label="Etapas de la simulación"
        className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-5"
      >
        {SEQUENCE_STEPS.map((label, index) => {
          const done = sequence.complete || sequence.stage > index;
          const active = sequence.stage === index;
          return (
            <li
              className={cn(
                "rounded-lg border px-3 py-2 text-xs font-medium transition-colors",
                active
                  ? "border-ai/40 bg-ai/10 text-foreground"
                  : done
                    ? "border-primary/30 bg-primary/10 text-foreground"
                    : "border-border/60 bg-card/40 text-muted-foreground",
              )}
              key={label}
            >
              <span className="mr-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                0{index + 1}
              </span>
              {label}
            </li>
          );
        })}
      </ol>

      <div className="mb-5 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <section aria-label="Espacio de simulación 3D" className="min-w-0">
          {mounted && webgl === "available" ? (
            <Suspense fallback={<SceneLoading />}>
              <NeuralScene3D
                clockRef={sequence.clockRef}
                onSelect={setSelectedKey}
                reducedMotion={reducedMotion}
                result={result}
                selectedKey={selectedKey}
                stage={sequence.stage}
              />
            </Suspense>
          ) : mounted ? (
            <NeuralGraphFallback result={result} />
          ) : (
            <SceneLoading />
          )}
        </section>

        <AnatomyPanel
          activation={activation}
          label={
            selectedNode?.layer === 0
              ? `Entrada · ${selectedNode.label}`
              : (tracedNeuron?.label ?? "Salida")
          }
          layerName={
            selectedNode?.layer === 0 ? "Capa de entrada" : (tracedLayer?.name ?? "Salida")
          }
          neuron={tracedNeuron}
          onActivationChange={setActivation}
        />
      </div>

      <div className="mb-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <section className="surface-panel flex items-center justify-between gap-4 p-4 sm:p-5">
          <div>
            <p className="text-sm text-muted-foreground">Demanda estimada</p>
            <p className="mt-2 font-display text-2xl font-semibold tabular-nums text-foreground">
              {sequence.complete ? `${Math.round(animatedDemand)} unidades` : "-- unidades"}
            </p>
          </div>
          <span
            className={cn(
              "rounded-full border px-2.5 py-1 text-[11px] font-medium",
              sequence.complete
                ? "border-ai/30 bg-ai/10 text-ai"
                : "border-border/70 bg-muted/60 text-muted-foreground",
            )}
          >
            {sequence.complete ? "Calculado" : "Simulando"}
          </span>
        </section>
        <section className="surface-panel flex items-center justify-between gap-4 p-4 sm:p-5">
          <div>
            <p className="text-sm text-muted-foreground">Recomendación de reposición</p>
            <p className="mt-2 font-display text-2xl font-semibold tabular-nums text-foreground">
              {sequence.complete ? `${result.purchase} unidades` : "--"}
            </p>
          </div>
          <span
            className={cn(
              "rounded-full border px-2.5 py-1 text-[11px] font-medium",
              sequence.complete
                ? statusStyles[result.status]
                : "border-border/70 bg-muted/60 text-muted-foreground",
            )}
          >
            {sequence.complete ? statusLabels[result.status] : "Simulando"}
          </span>
        </section>
      </div>

      <section aria-labelledby="concepts-title">
        <div className="mb-4">
          <h2 className="font-display text-lg font-semibold text-foreground" id="concepts-title">
            Conceptos
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Elementos básicos de una red neuronal
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {concepts.map((concept, index) => (
            <article
              className="surface-panel surface-hover animate-fade-up min-h-28 p-4"
              key={concept.title}
              style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
            >
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ai">
                0{index + 1}
              </span>
              <h3 className="mt-2 font-display text-sm font-semibold text-foreground">
                {concept.title}
              </h3>
              <p className="mt-2 text-sm leading-5 text-muted-foreground">{concept.text}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export const Route = createFileRoute("/red-neuronal")({
  beforeLoad: requireSession,
  head: () =>
    pageMeta(
      "Simulación de red neuronal | SmartMarket AI",
      "Visualización 3D y simulación educativa de una red neuronal aplicada a la demanda.",
    ),
  component: NeuralNetworkPage,
});
