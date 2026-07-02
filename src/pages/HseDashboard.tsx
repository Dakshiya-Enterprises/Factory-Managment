import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GoalFooter } from "@/components/layout/GoalFooter";
import { Card } from "@/components/ui/Card";
import { KpiCard } from "@/components/ui/KpiCard";
import { DonutStat } from "@/components/ui/DonutStat";
import { GaugeStat } from "@/components/ui/GaugeStat";
import { RadialScore } from "@/components/ui/RadialScore";
import { RankedBars } from "@/components/ui/RankedBars";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SimpleTable, type Column } from "@/components/ui/SimpleTable";
import { generateHseData, type PlantHseRow, type RiskControlRow } from "@/data/hse";
import { useLiveData } from "@/lib/useLiveData";
import type { StatusTone } from "@/types/dashboard";

const STATUS_TONE: Record<PlantHseRow["status"], StatusTone> = { Good: "good", Average: "average", Critical: "bad" };

const plantColumns: Column<PlantHseRow>[] = [
  { key: "plant", header: "Plant / Shop", render: (r) => <span className="font-semibold text-[var(--color-navy-950)]">{r.plant}</span> },
  { key: "manHours", header: "Man Hours (YTD)", align: "right", render: (r) => r.manHours },
  { key: "ltifr", header: "LTIFR", align: "right", render: (r) => <span className={r.ltifr > 0.3 ? "font-bold text-[var(--color-status-bad)]" : "font-bold text-[var(--color-status-good)]"}>{r.ltifr}</span> },
  { key: "trifr", header: "TRIFR", align: "right", render: (r) => <span className={r.trifr > 0.7 ? "font-bold text-[var(--color-status-bad)]" : "font-bold text-[var(--color-status-good)]"}>{r.trifr}</span> },
  { key: "incidents", header: "Total Incidents", align: "right", render: (r) => r.incidents },
  { key: "nearMiss", header: "Near Miss", align: "right", render: (r) => r.nearMiss },
  { key: "observations", header: "Safety Observations", align: "right", render: (r) => r.observations },
  { key: "sif", header: "SIF Events", align: "right", render: (r) => r.sifEvents },
  { key: "status", header: "Status", align: "center", render: (r) => <StatusBadge label={r.status} tone={STATUS_TONE[r.status]} /> },
];

const riskColumns: Column<RiskControlRow>[] = [
  { key: "category", header: "Risk Category", render: (r) => <span className="font-semibold text-[var(--color-navy-950)]">{r.category}</span> },
  { key: "total", header: "Total Controls", align: "right", render: (r) => r.totalControls },
  { key: "effective", header: "Effective", align: "right", render: (r) => <span className="font-bold text-[var(--color-status-good)]">{r.effective} ({r.effectivePct}%)</span> },
  { key: "partial", header: "Partially Effective", align: "right", render: (r) => <span className="text-[var(--color-status-warn)]">{r.partial} ({r.partialPct}%)</span> },
  { key: "ineffective", header: "Ineffective", align: "right", render: (r) => <span className="text-[var(--color-status-bad)]">{r.ineffective} ({r.ineffectivePct}%)</span> },
  { key: "status", header: "Status", align: "center", render: (r) => <StatusBadge label={r.status} tone={STATUS_TONE[r.status]} /> },
];

export function HseDashboard() {
  const { data, lastUpdated } = useLiveData(generateHseData, 30_000);
  if (!data) return null;

  return (
    <DashboardShell order={13} title="Health, Safety & Environment (HSE) Dashboard" subtitle="Real Time HSE Performance Monitoring & Incident Prevention" lastUpdated={lastUpdated}>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 2xl:grid-cols-7">
        {data.kpis.map((kpi) => (
          <KpiCard key={kpi.label} kpi={kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[280px_1fr_280px]">
        <Card title="Incident Breakdown" subtitle="(YTD)">
          <DonutStat data={data.incidentBreakdown} total={data.incidentBreakdown.reduce((s, d) => s + d.value, 0)} height={170} />
        </Card>
        <Card title="HSE Performance by Plant" subtitle="(Real Time)">
          <SimpleTable columns={plantColumns} rows={data.plants} />
        </Card>
        <Card title="HSE Performance Index" subtitle="(YTD)" bodyClassName="flex flex-col items-center">
          <GaugeStat value={data.hseIndex} target={85} label="vs Target ≥ 85%" />
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_1fr]">
        <Card title="Incident Trend" subtitle="(Last 12 Months)">
          <ResponsiveContainer width="100%" height={170}>
            <LineChart data={data.incidentTrend} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="x" tick={{ fontSize: 10, fill: "var(--color-muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "var(--color-muted)" }} axisLine={false} tickLine={false} width={30} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--color-border)", fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Line type="monotone" dataKey="current" name="FY 2025-26" stroke="var(--color-brand-blue)" strokeWidth={2.25} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="prior" name="FY 2024-25" stroke="#9aa5b8" strokeDasharray="4 4" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Near Miss Trend" subtitle="(Last 6 Months)">
          <ResponsiveContainer width="100%" height={170}>
            <LineChart data={data.nearMissTrend} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="x" tick={{ fontSize: 10, fill: "var(--color-muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "var(--color-muted)" }} axisLine={false} tickLine={false} width={30} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--color-border)", fontSize: 12 }} />
              <Line type="monotone" dataKey="y" stroke="var(--color-status-good)" strokeWidth={2.25} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        <Card title="Top Incident Locations" subtitle="(YTD)">
          <RankedBars data={data.topLocations} color="var(--color-status-bad)" />
        </Card>
        <Card title="Safety Training" subtitle="(YTD)" bodyClassName="flex flex-col items-center gap-2">
          <RadialScore value={data.safetyTraining.pct} label="Completed" size={110} color="var(--color-status-good)" />
          <ul className="w-full text-[11px]">
            <li className="flex justify-between"><span className="text-[var(--color-status-good)]">Completed</span><b>{data.safetyTraining.completed.toLocaleString()}</b></li>
            <li className="flex justify-between"><span className="text-[var(--color-status-info)]">Planned</span><b>{data.safetyTraining.planned.toLocaleString()}</b></li>
            <li className="flex justify-between"><span className="text-[var(--color-status-warn)]">Pending</span><b>{data.safetyTraining.pending.toLocaleString()}</b></li>
          </ul>
        </Card>
        <Card title="Behaviour Based Safety" subtitle="(YTD)" bodyClassName="flex flex-col items-center gap-2">
          <RadialScore value={data.behaviourSafety.pct} label="Positive Obs." size={110} color="var(--color-status-info)" />
          <ul className="w-full text-[11px]">
            <li className="flex justify-between"><span className="text-[var(--color-status-good)]">Positive</span><b>{data.behaviourSafety.positive.toLocaleString()}</b></li>
            <li className="flex justify-between"><span className="text-[var(--color-status-bad)]">At Risk</span><b>{data.behaviourSafety.atRisk.toLocaleString()}</b></li>
          </ul>
        </Card>
        <Card title="Permit Compliance" subtitle="(YTD)" bodyClassName="flex flex-col items-center gap-2">
          <RadialScore value={data.permitCompliance.pct} label="Compliance" size={110} color="var(--color-status-good)" />
          <ul className="w-full text-[11px]">
            <li className="flex justify-between"><span className="text-[var(--color-status-info)]">Issued</span><b>{data.permitCompliance.issued.toLocaleString()}</b></li>
            <li className="flex justify-between"><span className="text-[var(--color-status-good)]">Compliant</span><b>{data.permitCompliance.compliant.toLocaleString()}</b></li>
            <li className="flex justify-between"><span className="text-[var(--color-status-bad)]">Non Compliant</span><b>{data.permitCompliance.nonCompliant.toLocaleString()}</b></li>
          </ul>
        </Card>
        <Card title="Hazard Reporting" subtitle="(YTD)">
          <DonutStat data={data.hazardReporting} total={data.hazardReporting.reduce((s, d) => s + d.value, 0).toLocaleString()} height={150} />
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[300px_1fr]">
        <Card title="Top 5 Hazards" subtitle="(YTD)">
          <RankedBars data={data.topHazards} color="var(--color-status-warn)" />
        </Card>
        <Card title="Critical Risk Control Status" subtitle="(YTD)">
          <SimpleTable columns={riskColumns} rows={data.riskControls} />
        </Card>
      </div>

      <Card title="Key Insights">
        <ul className="grid grid-cols-1 gap-2 text-[12.5px] text-[var(--color-navy-900)] md:grid-cols-2">
          {data.insights.map((line) => (
            <li key={line} className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-brand-blue)]" />
              {line}
            </li>
          ))}
        </ul>
      </Card>

      <GoalFooter
        title="HSE Goal 2026-27"
        goals={[
          { label: "LTIFR", value: "≤ 0.30" },
          { label: "TRIFR", value: "≤ 0.70" },
          { label: "Safety Observations", value: "≥ 2,000" },
          { label: "HSE Training", value: "≥ 95%" },
          { label: "Permit Compliance", value: "≥ 95%" },
          { label: "SIF Events", value: "Zero" },
        ]}
        slogan="Safe Today. Strong Tomorrow."
      />
    </DashboardShell>
  );
}
