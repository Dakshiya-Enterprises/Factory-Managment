import { ArrowDown, ArrowUp } from "lucide-react";
import type { AccentColor, Kpi } from "@/types/dashboard";
import { ICONS } from "@/lib/iconMap";

const ACCENT: Record<AccentColor, { bg: string; fg: string }> = {
  blue: { bg: "bg-[var(--color-status-info-bg)]", fg: "text-[var(--color-status-info)]" },
  green: { bg: "bg-[var(--color-status-good-bg)]", fg: "text-[var(--color-status-good)]" },
  orange: { bg: "bg-[var(--color-status-warn-bg)]", fg: "text-[var(--color-status-warn)]" },
  purple: { bg: "bg-[var(--color-status-purple-bg)]", fg: "text-[var(--color-status-purple)]" },
  red: { bg: "bg-[var(--color-status-bad-bg)]", fg: "text-[var(--color-status-bad)]" },
  teal: { bg: "bg-[var(--color-status-teal-bg)]", fg: "text-[var(--color-status-teal)]" },
  navy: { bg: "bg-[var(--color-track)]", fg: "text-[var(--color-navy-900)]" },
};

export function KpiCard({ kpi }: { kpi: Kpi }) {
  const accent = ACCENT[kpi.color];
  const Icon = ICONS[kpi.icon] ?? ICONS.activity;
  const deltaGood = kpi.sentiment === "good";

  return (
    <div className="card flex items-center gap-3 px-4 py-3.5">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${accent.bg}`}>
        <Icon className={`h-5 w-5 ${accent.fg}`} strokeWidth={2.25} />
      </div>
      <div className="min-w-0">
        <div className={`text-[11px] font-bold uppercase tracking-wide ${accent.fg}`}>{kpi.label}</div>
        <div className="mt-0.5 text-2xl font-extrabold text-[var(--color-navy-950)] leading-none">{kpi.value}</div>
        {kpi.caption ? (
          <div className="mt-1 text-[11px] font-semibold text-[var(--color-muted)]">{kpi.caption}</div>
        ) : (
          <div
            className={`mt-1 flex items-center gap-0.5 text-[11px] font-semibold ${
              deltaGood ? "text-[var(--color-status-good)]" : "text-[var(--color-status-bad)]"
            }`}
          >
            {kpi.direction === "up" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
            {kpi.delta} <span className="font-medium text-[var(--color-muted)]">vs LYTD</span>
          </div>
        )}
      </div>
    </div>
  );
}
