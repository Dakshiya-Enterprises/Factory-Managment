import { ArrowDown, ArrowUp } from "lucide-react";
import { ICONS } from "@/lib/iconMap";
import { MiniSpark } from "@/components/ui/MiniSpark";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { AccentColor, StatusTone } from "@/types/dashboard";

const ACCENT: Record<AccentColor, string> = {
  blue: "var(--color-status-info)",
  green: "var(--color-status-good)",
  orange: "var(--color-status-warn)",
  purple: "var(--color-status-purple)",
  red: "var(--color-status-bad)",
  teal: "var(--color-status-teal)",
  navy: "var(--color-navy-900)",
};

export interface SparkKpi {
  label: string;
  target: string;
  value: string;
  delta: string;
  direction: "up" | "down";
  sentiment: "good" | "bad";
  icon: string;
  color: AccentColor;
  status: "Good" | "Average" | "Poor";
  spark: { y: number }[];
}

const STATUS_TONE: Record<SparkKpi["status"], StatusTone> = { Good: "good", Average: "average", Poor: "bad" };

export function SparkKpiCard({ kpi }: { kpi: SparkKpi }) {
  const Icon = ICONS[kpi.icon] ?? ICONS.activity;
  const color = ACCENT[kpi.color];
  const deltaGood = kpi.sentiment === "good";

  return (
    <div className="card flex flex-col gap-2 px-4 py-3.5">
      <div className="flex items-center gap-1.5">
        <Icon className="h-4 w-4 shrink-0" style={{ color }} strokeWidth={2.25} />
        <span className="min-w-0 truncate text-[11px] font-bold uppercase tracking-wide" style={{ color }}>
          {kpi.label}
        </span>
      </div>
      <span className="text-[10px] font-semibold text-[var(--color-muted)]">Target {kpi.target}</span>

      <div className="text-2xl font-extrabold leading-none text-[var(--color-navy-950)]">{kpi.value}</div>

      <div className={`flex flex-wrap items-center gap-x-1 gap-y-0 text-[11px] font-semibold ${deltaGood ? "text-[var(--color-status-good)]" : "text-[var(--color-status-bad)]"}`}>
        <span className="flex items-center gap-0.5 whitespace-nowrap">
          {kpi.direction === "up" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
          {kpi.delta}
        </span>
        <span className="whitespace-nowrap font-medium text-[var(--color-muted)]">vs Yesterday</span>
      </div>

      <MiniSpark data={kpi.spark} color={color} />

      <div className="flex justify-center">
        <StatusBadge label={kpi.status} tone={STATUS_TONE[kpi.status]} />
      </div>
    </div>
  );
}
