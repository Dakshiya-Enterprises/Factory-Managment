import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GoalFooter } from "@/components/layout/GoalFooter";
import { Card } from "@/components/ui/Card";
import { KpiCard } from "@/components/ui/KpiCard";
import { DonutStat } from "@/components/ui/DonutStat";
import { GaugeStat } from "@/components/ui/GaugeStat";
import { RankedBars } from "@/components/ui/RankedBars";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SimpleTable, type Column } from "@/components/ui/SimpleTable";
import { generateProductionOpsData, type ProductionRow } from "@/data/productionOps";
import { useLiveData } from "@/lib/useLiveData";
import type { StatusTone } from "@/types/dashboard";

const STATUS_TONE: Record<ProductionRow["status"], StatusTone> = { Good: "good", Average: "average", Critical: "bad" };

const columns: Column<ProductionRow>[] = [
  { key: "unit", header: "Unit / Shop", render: (r) => <span className="font-semibold text-[var(--color-navy-950)]">{r.unit}</span> },
  { key: "product", header: "Product", render: (r) => r.product },
  { key: "grade", header: "Grade", render: (r) => r.grade },
  { key: "target", header: "Target (MT)", align: "right", render: (r) => (r.target === null ? "-" : r.target.toLocaleString()) },
  { key: "actual", header: "Actual (MT)", align: "right", render: (r) => (r.actual === null ? "-" : r.actual.toLocaleString()) },
  { key: "achievement", header: "Achievement (%)", align: "right", render: (r) => (r.achievement === null ? "-" : <span className="font-bold text-[var(--color-status-good)]">{r.achievement}%</span>) },
  { key: "oee", header: "OEE (%)", align: "right", render: (r) => r.oee },
  { key: "status", header: "Status", align: "center", render: (r) => <StatusBadge label={r.status} tone={STATUS_TONE[r.status]} /> },
  { key: "vsYesterday", header: "vs Yesterday (%)", align: "right", render: (r) => <span className={r.vsYesterday >= 0 ? "text-[var(--color-status-good)]" : "text-[var(--color-status-bad)]"}>{r.vsYesterday >= 0 ? "↑" : "↓"} {Math.abs(r.vsYesterday)}%</span> },
];

export function ProductionOpsDashboard() {
  const { data, lastUpdated } = useLiveData(generateProductionOpsData, 30_000);
  if (!data) return null;

  return (
    <DashboardShell order={10} title="Production & Operations Dashboard" subtitle="Real Time Production Performance & Operational Excellence" lastUpdated={lastUpdated}>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 2xl:grid-cols-6">
        {data.kpis.map((kpi) => (
          <KpiCard key={kpi.label} kpi={kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[280px_1fr_300px]">
        <div className="flex flex-col gap-5">
          <Card title="Production by Plant" subtitle="(MTD)">
            <DonutStat data={data.byPlant} total={data.byPlant.reduce((s, d) => s + d.value, 0).toLocaleString()} totalLabel="Total MT" height={160} />
          </Card>
          <Card title="Production Mix" subtitle="(MTD)">
            <DonutStat data={data.mix} total={data.mix.reduce((s, d) => s + d.value, 0).toLocaleString()} totalLabel="Total MT" height={160} />
          </Card>
        </div>

        <Card title="Real Time Production Summary">
          <SimpleTable columns={columns} rows={data.summary} />
        </Card>

        <div className="flex flex-col gap-5">
          <Card title="Overall OEE Breakdown">
            <div className="grid grid-cols-3 gap-1">
              <GaugeStat value={data.oeeBreakdown.availability} label="Availability" size={100} />
              <GaugeStat value={data.oeeBreakdown.performance} label="Performance" size={100} />
              <GaugeStat value={data.oeeBreakdown.quality} label="Quality" size={100} />
            </div>
          </Card>
          <Card title="Downtime Summary" subtitle="(MTD)">
            <DonutStat data={data.downtimeSummary} total={data.downtimeTotalHrs} totalLabel="Total Hrs" height={160} />
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card title="Target Achievement" subtitle="(MTD)" bodyClassName="flex flex-col items-center justify-center">
          <GaugeStat value={data.targetAchievement} label="On Track" size={170} />
        </Card>
        <Card title="Production Trend" subtitle="(Last 7 Days)">
          <ResponsiveContainer width="100%" height={170}>
            <LineChart data={data.productionTrend} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="x" tick={{ fontSize: 10, fill: "var(--color-muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "var(--color-muted)" }} axisLine={false} tickLine={false} width={34} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--color-border)", fontSize: 12, background: "var(--color-surface)", color: "var(--color-navy-950)" }} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Line type="monotone" dataKey="target" name="Target (MT)" stroke="#9aa5b8" strokeDasharray="4 4" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="actual" name="Actual (MT)" stroke="var(--color-status-good)" strokeWidth={2.25} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Hourly Production Today" subtitle="(MT)">
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={data.hourlyProduction} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="x" tick={{ fontSize: 9.5, fill: "var(--color-muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "var(--color-muted)" }} axisLine={false} tickLine={false} width={34} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--color-border)", fontSize: 12, background: "var(--color-surface)", color: "var(--color-navy-950)" }} cursor={{ fill: "var(--color-page)" }} />
              <Bar dataKey="y" fill="var(--color-status-good)" radius={[6, 6, 0, 0]} maxBarSize={26} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Cumulative Production" subtitle="(MTD)">
          <ResponsiveContainer width="100%" height={170}>
            <LineChart data={data.cumulativeProduction} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="x" tick={{ fontSize: 9, fill: "var(--color-muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "var(--color-muted)" }} axisLine={false} tickLine={false} width={34} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--color-border)", fontSize: 12, background: "var(--color-surface)", color: "var(--color-navy-950)" }} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Line type="monotone" dataKey="target" name="Target" stroke="var(--color-brand-blue)" strokeWidth={2.25} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="actual" name="Actual" stroke="var(--color-status-good)" strokeWidth={2.25} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card title="OEE Trend" subtitle="(Last 7 Days)">
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={data.oeeTrend} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="x" tick={{ fontSize: 9.5, fill: "var(--color-muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "var(--color-muted)" }} axisLine={false} tickLine={false} width={30} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--color-border)", fontSize: 12, background: "var(--color-surface)", color: "var(--color-navy-950)" }} cursor={{ fill: "var(--color-page)" }} />
              <Bar dataKey="y" fill="var(--color-status-good)" radius={[6, 6, 0, 0]} maxBarSize={26} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card title="OEE by Unit" subtitle="(MTD)">
          <RankedBars data={data.oeeByUnit} color="var(--color-status-good)" />
        </Card>
        <Card title="Downtime Trend" subtitle="(Last 7 Days)">
          <ResponsiveContainer width="100%" height={170}>
            <LineChart data={data.downtimeTrend} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="x" tick={{ fontSize: 9.5, fill: "var(--color-muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "var(--color-muted)" }} axisLine={false} tickLine={false} width={30} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--color-border)", fontSize: 12, background: "var(--color-surface)", color: "var(--color-navy-950)" }} />
              <Line type="monotone" dataKey="y" stroke="var(--color-status-bad)" strokeWidth={2.25} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Production Plan vs Actual" subtitle="(MTD)">
          <DonutStat
            data={[
              { label: "Planned", value: data.planVsActual.planned, color: "var(--color-brand-blue)" },
              { label: "Actual", value: data.planVsActual.actual, color: "var(--color-status-good)" },
            ]}
            total={`${data.planVsActual.achievementPct}%`}
            totalLabel="Achievement"
            height={150}
          />
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[300px_1fr]">
        <Card title="Top 5 Downtime Reasons" subtitle="(Hrs)">
          <RankedBars data={data.topDowntimeReasons} color="var(--color-status-bad)" />
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

      <GoalFooter
        title="Production Goal 2026-27"
        goals={[
          { label: "Total Production", value: "> 5.2 MMT" },
          { label: "OEE", value: "> 80%" },
          { label: "Capacity Utilization", value: "> 90%" },
          { label: "Downtime", value: "< 30 Hrs / Mo" },
          { label: "Quality Yield", value: "> 92%" },
        ]}
        slogan="Excellence in Every Ton"
      />
    </DashboardShell>
  );
}
