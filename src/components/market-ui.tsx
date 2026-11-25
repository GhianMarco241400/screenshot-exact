import type { LucideIcon } from "lucide-react";

import type { StockState } from "@/lib/demo-data";

const stateLabels: Record<StockState, string> = {
  sufficient: "Stock suficiente",
  risk: "Riesgo de quiebre",
  recommended: "Reposición recomendada",
  urgent: "Reposición urgente",
};

const stateStyles: Record<StockState, string> = {
  sufficient: "bg-status-good/10 text-status-good ring-status-good/20",
  risk: "bg-status-risk/10 text-status-risk ring-status-risk/20",
  recommended: "bg-primary/10 text-primary ring-primary/20",
  urgent: "bg-status-urgent/10 text-status-urgent ring-status-urgent/20",
};

export function PageHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-6 flex flex-col gap-2">
      {eyebrow ? <p className="text-xs font-semibold uppercase text-primary">{eyebrow}</p> : null}
      <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">{title}</h1>
      <p className="max-w-3xl text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
  );
}

export function SectionTitle({ title, detail }: { title: string; detail?: string }) {
  return (
    <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      {detail ? <p className="text-xs text-muted-foreground">{detail}</p> : null}
    </div>
  );
}

export function StatusBadge({ state }: { state: StockState }) {
  return (
    <span
      className={`inline-flex max-w-full items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${stateStyles[state]}`}
    >
      {stateLabels[state]}
    </span>
  );
}

export function MetricCard({
  label,
  value,
  note,
  icon: Icon,
}: {
  label: string;
  value: string;
  note: string;
  icon: LucideIcon;
}) {
  return (
    <article className="surface-panel flex min-h-32 items-start justify-between gap-4 p-4 sm:p-5">
      <div className="min-w-0">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="mt-3 text-2xl font-semibold tabular-nums text-foreground">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{note}</p>
      </div>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
        <Icon aria-hidden="true" className="h-5 w-5" />
      </span>
    </article>
  );
}

export const chartTooltipStyle = {
  backgroundColor: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: "6px",
  color: "var(--popover-foreground)",
  boxShadow: "var(--shadow-panel)",
};

export function formatPEN(amount: number) {
  return `S/ ${amount.toFixed(2)}`;
}