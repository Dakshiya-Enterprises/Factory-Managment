import type { ReactNode } from "react";
import { Settings } from "lucide-react";
import { useClock } from "@/lib/useLiveData";

interface SettingsShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

/** Non-dashboard page frame — same visual language as DashboardShell, minus the "Dashboard X of 14" chip and live-refresh badges. */
export function SettingsShell({ title, subtitle, children }: SettingsShellProps) {
  const now = useClock();
  const dateStr = now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", weekday: "long" }).toUpperCase();
  const timeStr = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });

  return (
    <div className="flex h-full flex-col">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-3.5">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 rounded-md bg-[var(--color-status-info-bg)] px-2 py-1 text-[11px] font-bold text-[var(--color-status-info)]">
            <Settings className="h-3.5 w-3.5" />
            SYSTEM
          </span>
          <div>
            <h1 className="text-lg font-extrabold uppercase leading-tight text-[var(--color-navy-950)]">{title}</h1>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-muted)]">{subtitle}</p>
          </div>
        </div>
        <div className="hidden flex-col items-end leading-tight md:flex">
          <span className="text-[11px] font-bold text-[var(--color-navy-900)]">{dateStr}</span>
          <span className="text-[11px] text-[var(--color-muted)]">{timeStr}</span>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto bg-[var(--color-page)] p-5">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-5">{children}</div>
      </main>
    </div>
  );
}
