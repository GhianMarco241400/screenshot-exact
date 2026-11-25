import type { CSSProperties, ReactNode } from "react";
import { motion } from "motion/react";
import { ArrowDownRight, ArrowUpRight, SearchX, type LucideIcon } from "lucide-react";

import { Sparkline, type SparkTone } from "@/components/sparkline";
import { useCountUp } from "@/hooks/use-count-up";
import type { KpiDirection, KpiFormat, KpiTone } from "@/lib/presentation-data";
import type { StockState } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

const stateLabels: Record<StockState, string> = {
  sufficient: "Stock suficiente",
  risk: "Riesgo de quiebre",
  recommended: "Reposición recomendada",
  urgent: "Reposición urgente",
};

const stateStyles: Record<StockState, string> = {
  sufficient: "bg-status-good/10 text-status-good ring-status-good/25",
  risk: "bg-status-risk/10 text-status-risk ring-status-risk/25",
  recommended: "bg-primary/10 text-primary ring-primary/25",
  urgent: "bg-status-urgent/10 text-status-urgent ring-status-urgent/25",
};

const stateDots: Record<StockState, string> = {
  sufficient: "bg-status-good",
  risk: "bg-status-risk",
  recommended: "bg-primary",
  urgent: "bg-status-urgent",
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
    <div className="mb-7 flex flex-col gap-3">
      {eyebrow ? (
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-ai">
          <span className="h-1.5 w-1.5 rounded-full bg-ai" aria-hidden="true" />
          {eyebrow}
        </span>
      ) : null}
      <h1 className="text-gradient text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
      <p className="max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">{description}</p>
    </div>
  );
}

export function SectionTitle({ title, detail }: { title: string; detail?: string }) {
  return (
    <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
      <h2 className="font-display text-lg font-semibold tracking-tight text-foreground">{title}</h2>
      {detail ? (
        <span className="rounded-full border border-border/60 bg-card/50 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
          {detail}
        </span>
      ) : null}
    </div>
  );
}

export function StatusBadge({ state }: { state: StockState }) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        stateStyles[state],
      )}
    >
      <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", stateDots[state])} aria-hidden="true" />
      {stateLabels[state]}
    </span>
  );
}

export function formatKpiValue(format: KpiFormat, value: number) {
  const formatter = new Intl.NumberFormat("es-PE", { maximumFractionDigits: 0 });
  const rounded = Math.round(value);

  if (format === "currency") {
    return `S/ ${formatter.format(rounded)}`;
  }
  if (format === "units") {
    return `${formatter.format(rounded)} u.`;
  }
  return formatter.format(rounded);
}

export function KpiCard({
  label,
  note,
  value,
  format,
  delta,
  direction,
  tone,
  spark,
  icon: Icon,
  index = 0,
  sparkTone = "primary",
}: {
  label: string;
  note: string;
  value: number;
  format: KpiFormat;
  delta: string;
  direction: KpiDirection;
  tone: KpiTone;
  spark: number[];
  icon: LucideIcon;
  index?: number;
  sparkTone?: SparkTone;
}) {
  const animatedValue = useCountUp(value);
  const Arrow = direction === "up" ? ArrowUpRight : ArrowDownRight;

  return (
    <motion.article
      animate={{ opacity: 1, y: 0 }}
      className="surface-panel surface-hover group relative overflow-hidden p-5"
      initial={{ opacity: 0, y: 14 }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: "easeOut" }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-primary/20 opacity-60 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
      />
      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
          <p className="mt-3 font-display text-3xl font-semibold tabular-nums text-foreground">
            {formatKpiValue(format, animatedValue)}
          </p>
        </div>
        <span className="icon-chip h-11 w-11 shrink-0">
          <Icon aria-hidden="true" className="h-5 w-5" />
        </span>
      </div>

      <div className="relative mt-4 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold tabular-nums",
              tone === "good" && "bg-status-good/10 text-status-good",
              tone === "bad" && "bg-status-urgent/10 text-status-urgent",
              tone === "neutral" && "bg-muted text-muted-foreground",
            )}
          >
            <Arrow aria-hidden="true" className="h-3.5 w-3.5" />
            {delta}
          </span>
          <p className="mt-2 text-xs text-muted-foreground">{note}</p>
        </div>
        <Sparkline className="h-9 w-20 shrink-0" data={spark} tone={sparkTone} />
      </div>
    </motion.article>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-6 py-14 text-center">
      <span className="icon-chip h-12 w-12">
        <SearchX aria-hidden="true" className="h-5 w-5" />
      </span>
      <div>
        <p className="font-display text-base font-semibold text-foreground">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  );
}

export const chartTooltipStyle: CSSProperties = {
  backgroundColor: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: "10px",
  color: "var(--popover-foreground)",
  boxShadow: "0 20px 45px -24px oklch(0 0 0 / 0.6)",
  backdropFilter: "blur(14px)",
  fontSize: 12,
  padding: "8px 12px",
};

export function formatPEN(amount: number) {
  return `S/ ${amount.toFixed(2)}`;
}
