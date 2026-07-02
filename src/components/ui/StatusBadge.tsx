import type { StatusTone } from "@/types/dashboard";

const TONE_STYLES: Record<StatusTone, string> = {
  good: "bg-[var(--color-status-good-bg)] text-[var(--color-status-good)]",
  average: "bg-[var(--color-status-warn-bg)] text-[var(--color-status-warn)]",
  warn: "bg-[var(--color-status-warn-bg)] text-[var(--color-status-warn)]",
  bad: "bg-[var(--color-status-bad-bg)] text-[var(--color-status-bad)]",
  info: "bg-[var(--color-status-info-bg)] text-[var(--color-status-info)]",
  neutral: "bg-[var(--color-track)] text-[var(--color-muted)]",
};

export function StatusBadge({ label, tone }: { label: string; tone: StatusTone }) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-bold whitespace-nowrap ${TONE_STYLES[tone]}`}
    >
      {label}
    </span>
  );
}
