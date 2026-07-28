import { AlertTriangle, Flame, Gauge, ThermometerSun, Wrench } from "lucide-react";
import {
  Bar, BarChart, CartesianGrid, Line, LineChart,
  RadialBar, RadialBarChart, PolarAngleAxis,
  Area, AreaChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis, Legend,
} from "recharts";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { InsightBanner } from "@/components/layout/InsightBanner";
import { Card } from "@/components/ui/Card";
import { KpiCard } from "@/components/ui/KpiCard";
import { DonutStat } from "@/components/ui/DonutStat";
import { RadialScore } from "@/components/ui/RadialScore";
import { RankedBars } from "@/components/ui/RankedBars";
import { BarStat } from "@/components/ui/BarStat";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SimpleTable, type Column } from "@/components/ui/SimpleTable";
import { generateMachineHealthData, type MachineRow } from "@/data/machineHealth";
import { useLiveData } from "@/lib/useLiveData";
import type { StatusTone } from "@/types/dashboard";

const STATUS_TONE: Record<MachineRow["status"], StatusTone> = {
  Running: "good",
  Idle: "average",
  Breakdown: "bad",
  Maintenance: "info",
};

function healthColor(score: number | null) {
  if (score === null) return "var(--color-muted)";
  if (score >= 90) return "var(--color-status-good)";
  if (score >= 75) return "var(--color-brand-blue)";
  if (score >= 50) return "var(--color-status-warn)";
  return "var(--color-status-bad)";
}

const columns: Column<MachineRow>[] = [
  { key: "machineId", header: "Machine ID", render: (r) => <span className="font-mono text-[11.5px] font-semibold text-[var(--color-navy-950)]">{r.machineId}</span> },
  { key: "line", header: "Line", render: (r) => r.line },
  { key: "model", header: "Model", render: (r) => r.model },
  { key: "status", header: "Status", align: "center", render: (r) => <StatusBadge label={r.status} tone={STATUS_TONE[r.status]} /> },
  { key: "health", header: "Health Score", align: "right", render: (r) => <span className="font-bold" style={{ color: healthColor(r.healthScore) }}>{r.healthScore === null ? "--" : `${r.healthScore}%`}</span> },
  { key: "hours", header: "Running Hours", align: "right", render: (r) => r.runningHours.toLocaleString() },
  { key: "stitch", header: "Stitch Count", align: "right", render: (r) => r.stitchCount.toLocaleString() },
  {
    key: "needle",
    header: "Needle Count",
    render: (r) => (
      <div className="flex items-center gap-2">
        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[var(--color-track)]">
          <div className="h-full rounded-full bg-[var(--color-status-good)]" style={{ width: `${(r.needleCount / r.needleMax) * 100}%` }} />
        </div>
        <span className="text-[11px] text-[var(--color-muted)]">{r.needleCount.toLocaleString()} / {r.needleMax.toLocaleString()}</span>
      </div>
    ),
  },
  { key: "vibration", header: "Vibration (mm/s)", align: "right", render: (r) => (r.vibration === null ? "--" : <span className={r.vibration > 4 ? "font-bold text-[var(--color-status-bad)]" : ""}>{r.vibration}</span>) },
  { key: "temp", header: "Temp (°C)", align: "right", render: (r) => (r.temp === null ? "--" : <span className={r.temp > 55 ? "font-bold text-[var(--color-status-bad)]" : ""}>{r.temp}</span>) },
  { key: "lastService", header: "Last Service", render: (r) => r.lastService },
  { key: "rul", header: "RUL (Days)", align: "right", render: (r) => (r.rulDays === null ? "--" : <span className={r.rulDays <= 7 ? "font-bold text-[var(--color-status-bad)]" : ""}>{r.rulDays}</span>) },
];

function alertIcon(message: string) {
  if (message.includes("Vibration")) return AlertTriangle;
  if (message.includes("Temperature")) return ThermometerSun;
  if (message.includes("RUL")) return Gauge;
  if (message.includes("Oil")) return Flame;
  return Wrench;
}

// ── OEE Gauge — concentric radial rings + progress legend ────────────────────

const OEE_METRICS = [
  { key: "oee",          label: "OEE",         fill: "#f59e0b" },
  { key: "availability", label: "Availability", fill: "#1e56c9" },
  { key: "performance",  label: "Performance",  fill: "#7c3aed" },
  { key: "quality",      label: "Quality",      fill: "#16a34a" },
] as const;

type OEEKey = (typeof OEE_METRICS)[number]["key"];

interface OEEData { availability: number; performance: number; quality: number; oee: number }

function OEEGauge({ oee }: { oee: OEEData }) {
  // RadialBarChart: first entry = outermost ring
  const chartData = OEE_METRICS.map((m) => ({
    name:  m.label,
    value: oee[m.key as OEEKey],
    fill:  m.fill,
  }));

  return (
    <div>
      {/* Concentric rings */}
      <div className="relative">
        <ResponsiveContainer width="100%" height={210}>
          <RadialBarChart
            cx="50%" cy="50%"
            innerRadius="22%" outerRadius="92%"
            data={chartData}
            startAngle={90} endAngle={-270}
            barCategoryGap={4}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <RadialBar
              background={{ fill: "var(--color-track)" }}
              dataKey="value"
              cornerRadius={6}
            />
          </RadialBarChart>
        </ResponsiveContainer>

        {/* Centre label — OEE composite score */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
          <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--color-muted)]">OEE Score</span>
          <span className="text-[34px] font-black leading-none" style={{ color: "#f59e0b" }}>{oee.oee}</span>
          <span className="text-[9px] text-[var(--color-muted)] mt-0.5">Target ≥ 85%</span>
        </div>
      </div>

      {/* Legend rows with inline progress bars */}
      <div className="mt-1 space-y-2">
        {OEE_METRICS.map((m) => {
          const val = oee[m.key as OEEKey];
          return (
            <div key={m.key} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: m.fill }} />
              <span className="w-[72px] flex-shrink-0 text-[10.5px] font-semibold text-[var(--color-muted)]">{m.label}</span>
              <div className="flex-1 h-2 rounded-full overflow-hidden bg-[var(--color-track)]">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${val}%`, background: m.fill }}
                />
              </div>
              <span className="w-10 text-right text-[11px] font-bold flex-shrink-0" style={{ color: m.fill }}>
                {val}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export function MachineHealthDashboard() {
  const { data, lastUpdated } = useLiveData(generateMachineHealthData, 30_000);
  if (!data) return null;

  return (
    <DashboardShell order={4} title="Machine Health Dashboard" subtitle="Real Time Health & Utilization of All Machines" lastUpdated={lastUpdated}>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 2xl:grid-cols-6">
        {data.kpis.map((kpi) => (
          <KpiCard key={kpi.label} kpi={kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[300px_1fr_300px]">
        <div className="flex flex-col gap-5">
          <Card title="Machine Utilization">
            <DonutStat data={data.utilization} total={data.utilization.reduce((s, d) => s + d.value, 0)} height={160} />
          </Card>
          <Card title="OEE Overview" subtitle="(All Machines)">
            <OEEGauge oee={data.oee} />
          </Card>
        </div>

        <Card title="Machine Health List" subtitle="(Real Time)">
          <SimpleTable columns={columns} rows={data.machines} />
        </Card>

        <div className="flex flex-col gap-5">
          <Card title="Top Alerts">
            <ul className="flex flex-col gap-2.5">
              {data.alerts.map((a) => {
                const Icon = alertIcon(a.message);
                return (
                  <li key={a.id} className="flex items-start gap-2 text-[12px]">
                    <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${a.severity === "bad" ? "text-[var(--color-status-bad)]" : "text-[var(--color-status-warn)]"}`} />
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-[var(--color-navy-950)]">
                        {a.machine} <span className="font-normal text-[var(--color-muted)]">{a.message}</span>
                      </div>
                    </div>
                    <span className="shrink-0 text-[10.5px] text-[var(--color-muted)]">{a.time}</span>
                  </li>
                );
              })}
            </ul>
          </Card>
          <Card title="Health Score Breakdown">
            <DonutStat data={data.healthBreakdown} total={data.healthBreakdown.reduce((s, d) => s + d.value, 0)} height={160} />
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-4">
        <Card title="Machine Age Profile">
          <RankedBars data={data.ageProfile} color="var(--color-brand-blue)" />
        </Card>
        <Card title="Health Trend" subtitle="(Last 7 Days)">
          <ResponsiveContainer width="100%" height={170}>
            <AreaChart data={data.healthTrend} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
              <defs>
                <linearGradient id="healthGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-brand-blue)" stopOpacity={0.22} />
                  <stop offset="95%" stopColor="var(--color-brand-blue)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="x" tick={{ fontSize: 10, fill: "var(--color-muted)" }} axisLine={false} tickLine={false} />
              <YAxis domain={[70, 100]} tick={{ fontSize: 10, fill: "var(--color-muted)" }} axisLine={false} tickLine={false} width={30} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--color-border)", fontSize: 12, background: "var(--color-surface)", color: "var(--color-navy-950)" }} />
              <Area type="monotone" dataKey="y" stroke="var(--color-brand-blue)" strokeWidth={2.25} fill="url(#healthGrad)" dot={{ r: 3, fill: "var(--color-brand-blue)" }} activeDot={{ r: 5 }} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Breakdown Trend" subtitle="(Last 7 Days)">
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={data.breakdownTrend} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="x" tick={{ fontSize: 10, fill: "var(--color-muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "var(--color-muted)" }} axisLine={false} tickLine={false} width={30} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--color-border)", fontSize: 12, background: "var(--color-surface)", color: "var(--color-navy-950)" }} cursor={{ fill: "var(--color-page)" }} />
              <Bar dataKey="y" fill="var(--color-status-bad)" radius={[6, 6, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card title="RUL Distribution" subtitle="Remaining Useful Life">
          <BarStat data={data.rulDistribution} color="var(--color-status-teal)" />
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_1fr]">
        <Card title="Top 5 Machine Downtime Reason" subtitle="(Today)">
          <RankedBars data={data.downtimeReasons} color="var(--color-status-warn)" />
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

      <InsightBanner text={`Smart Insight: Machines with Health Score < 70% are ${data.lowHealthCount}. Schedule maintenance to avoid unplanned downtime and improve productivity.`} />
    </DashboardShell>
  );
}
