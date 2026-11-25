import { SectionTitle } from "@/components/market-ui";
import { activate, type Activation, type NeuronTrace } from "@/lib/neural-sim";
import { cn } from "@/lib/utils";

const OPTIONS: { value: Activation; label: string }[] = [
  { value: "relu", label: "ReLU" },
  { value: "sigmoid", label: "Sigmoide" },
  { value: "tanh", label: "Tanh" },
];

function ActivationCurve({ activation }: { activation: Activation }) {
  const width = 264;
  const height = 76;
  const points = Array.from({ length: 49 }, (_, index) => {
    const x = -3 + index * (6 / 48);
    const y = activate(x, activation);
    const px = 8 + (index / 48) * (width - 16);
    const py = height - 8 - ((Math.max(-1, Math.min(1.5, y)) + 1) / 2.5) * (height - 16);
    return `${px.toFixed(1)},${py.toFixed(1)}`;
  }).join(" ");

  return (
    <svg
      aria-label={`Curva de la función ${activation}`}
      className="h-20 w-full rounded-lg border border-border/60 bg-card/40"
      role="img"
      viewBox={`0 0 ${width} ${height}`}
    >
      <line
        stroke="currentColor"
        className="text-border"
        x1="8"
        x2={width - 8}
        y1={height / 2}
        y2={height / 2}
      />
      <line
        stroke="currentColor"
        className="text-border"
        x1={width / 2}
        x2={width / 2}
        y1="6"
        y2={height - 6}
      />
      <polyline fill="none" points={points} stroke="var(--ai)" strokeWidth="2" />
    </svg>
  );
}

export function AnatomyPanel({
  neuron,
  label,
  layerName,
  activation,
  onActivationChange,
}: {
  neuron: NeuronTrace | null;
  label: string;
  layerName: string;
  activation: Activation;
  onActivationChange: (value: Activation) => void;
}) {
  const weightedSum = neuron ? neuron.z - neuron.bias : 0;

  return (
    <aside aria-label="Anatomía de una neurona" className="surface-panel flex flex-col p-4 sm:p-5">
      <SectionTitle detail={layerName} title="Anatomía de una neurona" />
      <p className="mb-3 text-xs leading-5 text-muted-foreground">
        Neurona seleccionada: <span className="font-semibold text-foreground">{label}</span>
      </p>

      <div
        className="mb-3 grid grid-cols-3 gap-1.5"
        role="group"
        aria-label="Función de activación"
      >
        {OPTIONS.map((option) => (
          <button
            aria-pressed={activation === option.value}
            className={cn(
              "rounded-md border px-2 py-1.5 text-xs font-medium transition-colors",
              activation === option.value
                ? "border-primary/40 bg-primary/15 text-foreground"
                : "border-border/70 bg-card/40 text-muted-foreground hover:text-foreground",
            )}
            key={option.value}
            onClick={() => onActivationChange(option.value)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="scroll-slim max-h-56 space-y-1 overflow-y-auto pr-1">
        <div className="grid grid-cols-[1fr_auto_auto] gap-2 border-b border-border/60 px-1 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          <span>Entrada</span>
          <span className="text-right">xᵢ</span>
          <span className="text-right">wᵢ</span>
        </div>
        {(neuron?.weights ?? []).map((weight, index) => (
          <div
            className="grid grid-cols-[1fr_auto_auto] gap-2 rounded-md bg-card/40 px-1.5 py-1 text-[11px] tabular-nums"
            key={index}
          >
            <span className="truncate text-muted-foreground">x{index + 1}</span>
            <span className="text-right text-foreground">
              {(neuron?.inputs[index] ?? 0).toFixed(3)}
            </span>
            <span className={cn("text-right", weight >= 0 ? "text-cyan-300" : "text-fuchsia-300")}>
              {weight.toFixed(3)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3 space-y-1.5 text-xs tabular-nums">
        <div className="flex justify-between gap-2">
          <span className="text-muted-foreground">Σ(wᵢ·xᵢ)</span>
          <span className="font-semibold text-foreground">{weightedSum.toFixed(3)}</span>
        </div>
        <div className="flex justify-between gap-2">
          <span className="text-muted-foreground">Sesgo b</span>
          <span className="font-semibold text-foreground">{(neuron?.bias ?? 0).toFixed(3)}</span>
        </div>
        <div className="flex justify-between gap-2 border-t border-border/60 pt-1.5">
          <span className="text-muted-foreground">z = Σ + b</span>
          <span className="font-semibold text-foreground">{(neuron?.z ?? 0).toFixed(3)}</span>
        </div>
        <div className="flex justify-between gap-2">
          <span className="text-muted-foreground">f(z) → salida</span>
          <span className="font-semibold text-ai">{(neuron?.output ?? 0).toFixed(3)}</span>
        </div>
      </div>

      <div className="mt-3">
        <ActivationCurve activation={activation} />
      </div>

      <p className="mt-3 border-t border-border/60 pt-3 text-xs leading-5 text-muted-foreground">
        Cada neurona combina sus entradas con pesos, suma el sesgo y aplica una función de
        activación.
      </p>
    </aside>
  );
}
