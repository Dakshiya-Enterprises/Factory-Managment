import type { ReactNode } from "react";
import { Topbar } from "@/components/layout/Topbar";

interface DashboardShellProps {
  order: number;
  title: string;
  subtitle: string;
  lastUpdated: Date | null;
  children: ReactNode;
}

/** Shared page frame (topbar + scrollable content) every live dashboard renders inside. */
export function DashboardShell({ order, title, subtitle, lastUpdated, children }: DashboardShellProps) {
  return (
    <div className="flex h-full flex-col">
      <Topbar order={order} title={title} subtitle={subtitle} lastUpdated={lastUpdated} />
      <main className="flex-1 overflow-y-auto bg-[var(--color-page)] p-5">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-5">{children}</div>
      </main>
    </div>
  );
}
