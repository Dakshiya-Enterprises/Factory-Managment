import { RefreshCw, Wifi } from "lucide-react";
import { useClock } from "@/lib/useLiveData";
import { TOTAL_DASHBOARDS } from "@/nav/dashboards";

interface TopbarProps {
  order: number;
  title: string;
  subtitle: string;
  lastUpdated: Date | null;
}

export function Topbar({ order, title, subtitle, lastUpdated }: TopbarProps) {
  const now = useClock();
  const dateStr = now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", weekday: "long" }).toUpperCase();
  const timeStr = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border)] bg-white px-6 py-3.5">
      <div className="flex items-center gap-3">
        <span className="rounded-md bg-[var(--color-status-info-bg)] px-2 py-1 text-[11px] font-bold text-[var(--color-status-info)]">
          DASHBOARD {order} OF {TOTAL_DASHBOARDS}
        </span>
        <div>
          <h1 className="text-lg font-extrabold uppercase leading-tight text-[var(--color-navy-950)]">{title}</h1>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-muted)]">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden flex-col items-end leading-tight md:flex">
          <span className="text-[11px] font-bold text-[var(--color-navy-900)]">{dateStr}</span>
          <span className="text-[11px] text-[var(--color-muted)]">{timeStr}</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-[var(--color-status-good-bg)] px-3 py-1.5 text-[11px] font-bold text-[var(--color-status-good)]">
          <Wifi className="h-3.5 w-3.5" />
          Live
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-[var(--color-border)] px-3 py-1.5 text-[11px] font-semibold text-[var(--color-muted)]">
          <RefreshCw className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: "3s" }} />
          {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString("en-IN", { hour12: true })}` : "Loading…"}
        </div>
      </div>
    </header>
  );
}
