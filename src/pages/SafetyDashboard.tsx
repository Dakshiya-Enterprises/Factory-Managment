import { CartesianGrid, Legend, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ShieldAlert, ThumbsUp } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { KpiCard } from "@/components/ui/KpiCard";
import { DonutStat } from "@/components/ui/DonutStat";
import { RankedBars } from "@/components/ui/RankedBars";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SimpleTable, type Column } from "@/components/ui/SimpleTable";
import { generateSafetyData, type IncidentRow } from "@/data/safety";
import { useLiveData } from "@/lib/useLiveData";
import type { StatusTone } from "@/types/dashboard";

const SEVERITY_TONE: Record<IncidentRow["severity"], StatusTone> = { Low: "good", Medium: "average", High: "bad" };
const STATUS_TONE: Record<IncidentRow["status"], StatusTone> = { Open: "bad", "Under Investigation": "average", Closed: "good" };

const columns: Column<IncidentRow>[] = [
  { key: "incidentId", header: "Incident ID", render: (r) => <span className="font-mono text-[11.5px] font-semibold text-[var(--color-navy-950)]">{r.incidentId}</span> },
  { key: "datetime", header: "Date & Time", render: (r) => r.datetime },
  { key: "location", header: "Location / Area", render: (r) => r.location },
  { key: "type", header: "Incident Type", render: (r) => r.type },
  { key: "severity", header: "Severity", align: "center", render: (r) => <StatusBadge label={r.severity} tone={SEVERITY_TONE[r.severity]} /> },
  { key: "description", header: "Description", render: (r) => <span className="whitespace-normal">{r.description}</span> },
  { key: "ltiPotential", header: "LTI Potential", align: "center", render: (r) => <StatusBadge label={r.ltiPotential} tone={SEVERITY_TONE[r.ltiPotential]} /> },
  { key: "status", header: "Status", align: "center", render: (r) => <StatusBadge label={r.status} tone={STATUS_TONE[r.status]} /> },
  { key: "daysOpen", header: "Days Open", align: "right", render: (r) => r.daysOpen },
];

export function SafetyDashboard() {
  const { data, lastUpdated } = useLiveData(generateSafetyData, 30_000);
  if (!data) return null;

  return (
    <DashboardShell order={7} title="Safety & Incident Dashboard" subtitle="Real Time Safety Performance & Incident Management" lastUpdated={lastUpdated}>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 2xl:grid-cols-6">
        {data.kpis.map((kpi) => (
          <KpiCard key={kpi.label} kpi={kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[300px_1fr_300px]">
        <Card title="Incident Summary" subtitle="(YTD)">
          <DonutStat data={data.incidentSummary} total={data.incidentSummary.reduce((s, d) => s + d.value, 0)} height={190} />
        </Card>

        <Card title="Incident Details" subtitle="(Real Time)">
          <SimpleTable columns={columns} rows={data.incidents} />
        </Card>

        <Card title="Incidents by Location" subtitle="(YTD)">
          <RankedBars data={data.incidentsByLocation} color="var(--color-status-bad)" />
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-4">
        <Card title="LTIFR Trend" subtitle="(12 Mo)">
          <ResponsiveContainer width="100%" height={170}>
            <LineChart data={data.ltifrTrend} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="x" tick={{ fontSize: 10, fill: "var(--color-muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "var(--color-muted)" }} axisLine={false} tickLine={false} width={30} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--color-border)", fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <ReferenceLine y={0.5} stroke="var(--color-status-warn)" strokeDasharray="4 4" />
              <Line type="monotone" dataKey="current" name="FY 2025-26" stroke="var(--color-brand-blue)" strokeWidth={2.25} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="prior" name="FY 2024-25" stroke="#9aa5b8" strokeDasharray="4 4" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Top 5 Incident Causes" subtitle="(YTD)">
          <RankedBars data={data.topCauses} color="var(--color-status-warn)" />
        </Card>
        <Card title="Safety Observations" subtitle="(YTD)">
          <DonutStat data={data.safetyObservations} total={data.safetyObservations.reduce((s, d) => s + d.value, 0).toLocaleString()} height={170} />
        </Card>
        <Card title="Severity Distribution" subtitle="(YTD)">
          <DonutStat data={data.severityDistribution} total={data.severityDistribution.reduce((s, d) => s + d.value, 0)} height={170} />
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[280px_1fr]">
        <Card title="Near Miss Reporting" subtitle="(YTD)">
          <div className="text-2xl font-extrabold text-[var(--color-navy-950)]">{data.nearMiss}</div>
          <div className="text-[11px] font-semibold text-[var(--color-muted)]">Near Misses Reported</div>
          <div className="mt-1 text-[11px] font-bold text-[var(--color-status-good)]">↑ {data.nearMissDelta} vs LYTD</div>
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-[var(--color-status-good-bg)] px-3 py-2 text-[11.5px] font-semibold text-[var(--color-status-good)]">
            <ThumbsUp className="h-4 w-4 shrink-0" />
            Good! Keep reporting & prevent incidents.
          </div>
        </Card>
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
      </div>

      <div className="card flex flex-wrap items-center justify-between gap-4 px-5 py-3">
        <div className="flex items-center gap-2 text-[11.5px] font-semibold text-[var(--color-navy-950)]">
          <ShieldAlert className="h-4 w-4 shrink-0 text-[var(--color-status-warn)]" />
          Smart Insight: Zero Harm is Possible! Stay Alert, Follow Procedures & Care for Each Other.
        </div>
        <div className="text-[12px] font-extrabold uppercase tracking-wide text-[var(--color-navy-950)]">
          Safety Goal: Zero Harm | Zero Compromise | Zero Excuse
        </div>
        <div className="flex items-center gap-3 text-[11px] font-semibold text-[var(--color-navy-900)]">
          {[
            { label: "Low", color: "#16a34a" },
            { label: "Medium", color: "#f59e0b" },
            { label: "High", color: "#dc2626" },
            { label: "Critical", color: "#7c1d1d" },
          ].map((s) => (
            <span key={s.label} className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
              {s.label}
            </span>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
