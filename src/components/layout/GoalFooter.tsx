import { Target } from "lucide-react";

interface GoalFooterProps {
  title: string;
  goals: { label: string; value: string }[];
  slogan: string;
}

/** Shared bottom goal-strip pattern used across every dashboard screen. */
export function GoalFooter({ title, goals, slogan }: GoalFooterProps) {
  return (
    <div className="card flex flex-wrap items-center justify-between gap-4 px-5 py-3">
      <div className="flex items-center gap-2 text-[12px] font-extrabold uppercase tracking-wide text-[var(--color-navy-950)]">
        <Target className="h-4 w-4 text-[var(--color-status-good)]" />
        {title}
      </div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
        {goals.map((g) => (
          <div key={g.label} className="text-center">
            <div className="text-[10px] font-bold uppercase tracking-wide text-[var(--color-muted)]">{g.label}</div>
            <div className="text-[13px] font-extrabold text-[var(--color-navy-950)]">{g.value}</div>
          </div>
        ))}
      </div>
      <div className="text-[11px] font-bold uppercase tracking-wide text-[var(--color-status-good)]">{slogan}</div>
    </div>
  );
}
