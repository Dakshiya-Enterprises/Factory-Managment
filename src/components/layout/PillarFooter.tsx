import type { AccentColor } from "@/types/dashboard";
import { ICONS } from "@/lib/iconMap";

const ACCENT: Record<AccentColor, string> = {
  blue: "var(--color-status-info)",
  green: "var(--color-status-good)",
  orange: "var(--color-status-warn)",
  purple: "var(--color-status-purple)",
  red: "var(--color-status-bad)",
  teal: "var(--color-status-teal)",
  navy: "var(--color-navy-900)",
};

export function PillarFooter({ pillars }: { pillars: { title: string; subtitle: string; icon: string; color: AccentColor }[] }) {
  return (
    <div className="card flex flex-wrap items-center justify-around gap-4 px-5 py-4">
      {pillars.map((p) => {
        const Icon = ICONS[p.icon] ?? ICONS.activity;
        const color = ACCENT[p.color];
        return (
          <div key={p.title} className="flex min-w-[170px] items-center gap-2.5">
            <Icon className="h-6 w-6 shrink-0" style={{ color }} strokeWidth={2} />
            <div>
              <div className="text-[12px] font-extrabold uppercase leading-tight text-[var(--color-navy-950)]">{p.title}</div>
              <div className="text-[10.5px] leading-tight text-[var(--color-muted)]">{p.subtitle}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
