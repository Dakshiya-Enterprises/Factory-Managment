import { DashboardShell } from "@/components/layout/DashboardShell";
import { GoalFooter } from "@/components/layout/GoalFooter";
import { Card } from "@/components/ui/Card";
import { KpiCard } from "@/components/ui/KpiCard";
import { DonutStat } from "@/components/ui/DonutStat";
import { TrendChart } from "@/components/ui/TrendChart";
import { RankedBars } from "@/components/ui/RankedBars";
import { GaugeStat } from "@/components/ui/GaugeStat";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SimpleTable, type Column } from "@/components/ui/SimpleTable";
import { generateMaintenanceData, type MaintenanceRow, type ShutdownRow } from "@/data/maintenance";
import { useLiveData } from "@/lib/useLiveData";
import type { StatusTone } from "@/types/dashboard";

const STATUS_TONE: Record<MaintenanceRow["status"], StatusTone> = {
  Good: "good",
  Average: "average",
  Critical: "bad",
};

const shutdownTone: Record<ShutdownRow["status"], StatusTone> = {
  Completed: "good",
  Planned: "info",
  "In Progress": "average",
};

const summaryColumns: Column<MaintenanceRow>[] = [
  { key: "area", header: "Area / Shop", render: (r) => <span className="font-semibold text-[var(--color-navy-950)]">{r.area}</span> },
  { key: "assets", header: "Total Assets", align: "right", render: (r) => r.totalAssets.toLocaleString() },
  { key: "plan", header: "PM Plan", align: "right", render: (r) => r.pmPlan.toLocaleString() },
  { key: "completed", header: "PM Completed", align: "right", render: (r) => r.pmCompleted.toLocaleString() },
  { key: "compliance", header: "PM Compliance %", align: "right", render: (r) => <span className="font-bold text-[var(--color-status-good)]">{r.pmCompliance}%</span> },
  { key: "breakdowns", header: "Breakdowns", align: "right", render: (r) => r.breakdowns },
  { key: "mttr", header: "MTTR (Hrs)", align: "right", render: (r) => r.mttr },
  { key: "mtbf", header: "MTBF (Hrs)", align: "right", render: (r) => r.mtbf },
  { key: "cost", header: "Cost (₹ Cr)", align: "right", render: (r) => r.costCr.toFixed(2) },
  { key: "status", header: "Status", align: "center", render: (r) => <StatusBadge label={r.status} tone={STATUS_TONE[r.status]} /> },
];

const shutdownColumns: Column<ShutdownRow>[] = [
  { key: "name", header: "Shutdown", render: (r) => <span className="font-semibold text-[var(--color-navy-950)]">{r.shutdown}</span> },
  { key: "area", header: "Area", render: (r) => r.area },
  { key: "start", header: "Start Date", render: (r) => r.start },
  { key: "end", header: "End Date", render: (r) => r.end },
  { key: "status", header: "Status", render: (r) => <StatusBadge label={r.status} tone={shutdownTone[r.status]} /> },
  {
    key: "progress",
    header: "Progress",
    render: (r) => (
      <div className="flex items-center gap-2">
        <div className="h-2 w-24 overflow-hidden rounded-full bg-[var(--color-track)]">
          <div
            className="h-full rounded-full"
            style={{ width: `${r.progress}%`, background: r.progress === 100 ? "var(--color-status-good)" : "var(--color-status-info)" }}
          />
        </div>
        <span className="text-[11px] font-bold">{r.progress}%</span>
      </div>
    ),
  },
];

export function MaintenanceDashboard() {
  const { data, lastUpdated } = useLiveData(generateMaintenanceData, 30_000);
  if (!data) return null;

  const totalWorkOrders = data.workOrderStatus.reduce((s, d) => s + d.value, 0);
  const totalCritical = data.criticalAssetHealth.good + data.criticalAssetHealth.monitor + data.criticalAssetHealth.critical;

  return (
    <DashboardShell order={12} title="Maintenance Performance Dashboard" subtitle="Real Time Maintenance Monitoring & Asset Reliability Excellence" lastUpdated={lastUpdated}>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 2xl:grid-cols-6">
        {data.kpis.map((kpi) => (
          <KpiCard key={kpi.label} kpi={kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[300px_1fr_320px]">
        <div className="flex flex-col gap-5">
          <Card title="Maintenance Cost Breakdown" subtitle="(YTD)">
            <DonutStat data={data.costBreakdown} total={`₹ ${data.costTotalCr}`} totalLabel="Cr" height={170} />
          </Card>
          <Card title="Work Order Status" subtitle="(YTD)">
            <DonutStat data={data.workOrderStatus} total={totalWorkOrders.toLocaleString()} height={170} />
          </Card>
        </div>

        <Card title="Maintenance Summary" subtitle="(Real Time)">
          <SimpleTable columns={summaryColumns} rows={data.summary} />
        </Card>

        <div className="flex flex-col gap-5">
          <Card title="Breakdowns by Category" subtitle="(YTD)">
            <DonutStat data={data.breakdownsByCategory} total={data.breakdownsByCategory.reduce((s, d) => s + d.value, 0)} height={170} />
          </Card>
          <Card title="Top 5 Repeating Breakdown Assets" subtitle="(YTD)">
            <RankedBars data={data.topBreakdownAssets} />
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 2xl:grid-cols-6">
        <Card title="PM Compliance Trend" subtitle="(12 Mo)">
          <TrendChart data={data.pmComplianceTrend} color="var(--color-status-good)" unit="%" />
        </Card>
        <Card title="MTTR Trend" subtitle="(12 Mo)">
          <TrendChart data={data.mttrTrend} color="var(--color-brand-blue)" target={4} unit="h" />
        </Card>
        <Card title="MTBF Trend" subtitle="(12 Mo)">
          <TrendChart data={data.mtbfTrend} color="var(--color-status-good)" target={150} unit="h" />
        </Card>
        <Card title="Cost Trend" subtitle="(12 Mo)">
          <TrendChart data={data.costTrend} color="var(--color-status-warn)" unit=" Cr" />
        </Card>
        <Card title="Asset Availability" subtitle="(YTD)" bodyClassName="flex items-center justify-center">
          <GaugeStat value={data.assetAvailability} target={92} label="vs Target ≥ 92%" />
        </Card>
        <Card title="Scheduled vs Unscheduled" subtitle="(YTD)">
          <DonutStat
            data={data.scheduledVsUnscheduled}
            total={data.scheduledVsUnscheduled.reduce((s, d) => s + d.value, 0)}
            height={150}
          />
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_300px_260px_320px]">
        <Card title="Planned Shutdowns / Turnaround" subtitle="(YTD)">
          <SimpleTable columns={shutdownColumns} rows={data.shutdowns} />
        </Card>
        <Card title="Spares Consumption" subtitle="(YTD)">
          <DonutStat data={data.sparesConsumption} total={data.sparesConsumption.reduce((s, d) => s + d.value, 0).toFixed(1)} totalLabel="Cr" height={150} />
        </Card>
        <Card title="Critical Assets Health" subtitle="(YTD)">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-status-good-bg)] text-[var(--color-status-good)] font-extrabold">✓</div>
              <div className="mt-1 text-lg font-extrabold text-[var(--color-navy-950)]">{data.criticalAssetHealth.good}</div>
              <div className="text-[10px] font-semibold text-[var(--color-muted)]">Good ({((data.criticalAssetHealth.good / totalCritical) * 100).toFixed(1)}%)</div>
            </div>
            <div>
              <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-status-warn-bg)] text-[var(--color-status-warn)] font-extrabold">!</div>
              <div className="mt-1 text-lg font-extrabold text-[var(--color-navy-950)]">{data.criticalAssetHealth.monitor}</div>
              <div className="text-[10px] font-semibold text-[var(--color-muted)]">Monitor ({((data.criticalAssetHealth.monitor / totalCritical) * 100).toFixed(1)}%)</div>
            </div>
            <div>
              <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-status-bad-bg)] text-[var(--color-status-bad)] font-extrabold">✕</div>
              <div className="mt-1 text-lg font-extrabold text-[var(--color-navy-950)]">{data.criticalAssetHealth.critical}</div>
              <div className="text-[10px] font-semibold text-[var(--color-muted)]">Critical ({((data.criticalAssetHealth.critical / totalCritical) * 100).toFixed(1)}%)</div>
            </div>
          </div>
        </Card>
        <Card title="Key Insights">
          <ul className="flex flex-col gap-2 text-[12.5px] text-[var(--color-navy-900)]">
            {data.insights.map((line) => (
              <li key={line} className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-brand-blue)]" />
                {line}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <GoalFooter
        title="Maintenance Goal 2026-27"
        goals={[
          { label: "MTTR", value: "≤ 4.0 Hrs" },
          { label: "MTBF", value: "≥ 200 Hrs" },
          { label: "PM Compliance", value: "≥ 95%" },
          { label: "Asset Availability", value: "≥ 95%" },
          { label: "Breakdowns Reduction", value: "≥ 15%" },
        ]}
        slogan="Zero Failure • Zero Accident • Zero Compromise"
      />
    </DashboardShell>
  );
}
