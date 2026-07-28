import { useState } from "react";
import { Box, Layers3, SquareStack } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { KpiCard } from "@/components/ui/KpiCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SimpleTable, type Column } from "@/components/ui/SimpleTable";
import { FactoryScene, type ViewMode } from "@/components/factory3d/FactoryScene";
import { generateFactory3DData } from "@/data/factory3d";
import { useLiveData } from "@/lib/useLiveData";
import type { StatusTone } from "@/types/dashboard";
import type { Worker } from "@/types/factory3d";

const STATUS_TONE: Record<Worker["status"], StatusTone> = {
  present: "good",
  idle: "average",
  alert: "bad",
  offline: "neutral",
};

const columns: Column<Worker>[] = [
  { key: "name", header: "Name", render: (w) => w.name },
  { key: "empId", header: "Emp ID", render: (w) => <span className="font-mono text-[11.5px]">{w.empId}</span> },
  { key: "zoneId", header: "Zone", render: (w) => w.zoneId },
  { key: "status", header: "Status", align: "center", render: (w) => <StatusBadge label={w.status} tone={STATUS_TONE[w.status]} /> },
  { key: "source", header: "Source", align: "center", render: (w) => <StatusBadge label={w.source} tone="info" /> },
];

const VIEW_MODES: { mode: ViewMode; label: string; icon: typeof Box }[] = [
  { mode: "perspective", label: "Perspective", icon: Box },
  { mode: "top-down", label: "Top-Down", icon: SquareStack },
  { mode: "cross-section", label: "Cross-Section", icon: Layers3 },
];

function ViewModeButtons({ viewMode, onChange }: { viewMode: ViewMode; onChange: (mode: ViewMode) => void }) {
  return (
    <div className="flex items-center gap-1.5">
      {VIEW_MODES.map(({ mode, label, icon: Icon }) => {
        const active = viewMode === mode;
        return (
          <button
            key={mode}
            type="button"
            onClick={() => onChange(mode)}
            className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-[11px] font-semibold transition-colors ${
              active
                ? "border-[var(--color-brand-blue)] bg-[var(--color-brand-blue)] text-white"
                : "border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-brand-blue)] hover:text-[var(--color-brand-blue)]"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        );
      })}
    </div>
  );
}

export function Factory3DDashboard() {
  const { data, lastUpdated } = useLiveData(generateFactory3DData, 3_000);
  const [viewMode, setViewMode] = useState<ViewMode>("perspective");
  if (!data) return null;

  return (
    <DashboardShell order={15} title="3D Factory Monitoring & Surveillance" subtitle="Realtime Worker Presence & Zone Occupancy" lastUpdated={lastUpdated}>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 2xl:grid-cols-6">
        {data.kpis.map((kpi) => (
          <KpiCard key={kpi.label} kpi={kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_360px]">
        <Card title="Factory Floor" subtitle="(Live)" right={<ViewModeButtons viewMode={viewMode} onChange={setViewMode} />}>
          <div className="h-[560px] w-full overflow-hidden rounded-lg">
            <FactoryScene data={data} viewMode={viewMode} />
          </div>
        </Card>

        <div className="flex flex-col gap-5">
          <Card title="Active Alerts" subtitle={`(${data.alerts.length})`}>
            {data.alerts.length === 0 ? (
              <div className="text-[12px] text-[var(--color-muted)]">No active alerts.</div>
            ) : (
              <div className="flex flex-col gap-2">
                {data.alerts.map((a) => (
                  <div key={a.id} className="flex items-center gap-2">
                    <StatusBadge label={a.severity === "bad" ? "Alert" : "Warning"} tone={a.severity === "bad" ? "bad" : "average"} />
                    <span className="text-[12px] text-[var(--color-navy-900)]">{a.text}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
          <Card title="Worker Presence" subtitle="(Live)">
            <SimpleTable columns={columns} rows={data.workers} />
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
