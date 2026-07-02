import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GoalFooter } from "@/components/layout/GoalFooter";
import { Card } from "@/components/ui/Card";
import { KpiCard } from "@/components/ui/KpiCard";
import { DonutStat } from "@/components/ui/DonutStat";
import { TrendChart } from "@/components/ui/TrendChart";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SimpleTable, type Column } from "@/components/ui/SimpleTable";
import { generateEnvironmentData, type EnvParamRow } from "@/data/environment";
import { useLiveData } from "@/lib/useLiveData";
import type { StatusTone } from "@/types/dashboard";

const STATUS_TONE: Record<EnvParamRow["status"], StatusTone> = { Good: "good", Average: "average", Critical: "bad" };

const columns: Column<EnvParamRow>[] = [
  { key: "parameter", header: "Parameter", render: (r) => <span className="font-semibold text-[var(--color-navy-950)]">{r.parameter}</span> },
  { key: "location", header: "Location", render: (r) => r.location },
  { key: "unit", header: "Unit", render: (r) => r.unit },
  { key: "value", header: "Real Time Value", align: "right", render: (r) => <span className="font-bold text-[var(--color-status-good)]">{r.value}</span> },
  { key: "limit", header: "Limit", align: "right", render: (r) => r.limit },
  { key: "status", header: "Status", align: "center", render: (r) => <StatusBadge label={r.status} tone={STATUS_TONE[r.status]} /> },
  { key: "vsYesterday", header: "vs Yesterday", align: "right", render: (r) => <span className={r.vsYesterday <= 0 ? "text-[var(--color-status-good)]" : "text-[var(--color-status-bad)]"}>{r.vsYesterday > 0 ? "↑" : "↓"} {Math.abs(r.vsYesterday)}%</span> },
];

export function EnvironmentDashboard() {
  const { data, lastUpdated } = useLiveData(generateEnvironmentData, 30_000);
  if (!data) return null;

  return (
    <DashboardShell order={8} title="Environment & Sustainability" subtitle="Real Time Environmental Monitoring & Sustainability Performance" lastUpdated={lastUpdated}>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 2xl:grid-cols-7">
        {data.kpis.map((kpi) => (
          <KpiCard key={kpi.label} kpi={kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[300px_1fr_300px]">
        <div className="flex flex-col gap-5">
          <Card title="Emission Summary" subtitle="(YTD)">
            <DonutStat data={data.emissionSummary} total={data.emissionSummary.reduce((s, d) => s + d.value, 0).toLocaleString()} totalLabel="Tonnes CO2" height={160} />
          </Card>
          <Card title="Water Consumption Breakdown" subtitle="(YTD)">
            <DonutStat data={data.waterBreakdown} total={data.waterBreakdown.reduce((s, d) => s + d.value, 0).toLocaleString()} totalLabel="KL" height={160} />
          </Card>
        </div>

        <Card title="Environmental Parameters" subtitle="(Real Time)">
          <SimpleTable columns={columns} rows={data.parameters} />
        </Card>

        <div className="flex flex-col gap-5">
          <Card title="Carbon Footprint Trend" subtitle="tCO2 / t Steel">
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={data.carbonFootprintTrend} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="x" tick={{ fontSize: 10, fill: "var(--color-muted)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "var(--color-muted)" }} axisLine={false} tickLine={false} width={30} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--color-border)", fontSize: 12, background: "var(--color-surface)", color: "var(--color-navy-950)" }} />
                <Legend wrapperStyle={{ fontSize: 9 }} />
                <Line type="monotone" dataKey="current" name="FY 2025-26" stroke="var(--color-status-good)" strokeWidth={2.25} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="prior" name="FY 2024-25" stroke="#9aa5b8" strokeDasharray="4 4" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
          <Card title="Renewable Energy Usage" subtitle="(YTD)">
            <DonutStat data={data.renewableEnergy} total="28.6%" totalLabel="Green Energy" height={160} />
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card title="CO2 Emission Trend" subtitle="(12 Mo)">
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={data.co2Trend} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="x" tick={{ fontSize: 10, fill: "var(--color-muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "var(--color-muted)" }} axisLine={false} tickLine={false} width={34} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--color-border)", fontSize: 12, background: "var(--color-surface)", color: "var(--color-navy-950)" }} cursor={{ fill: "var(--color-page)" }} />
              <Bar dataKey="y" fill="var(--color-status-good)" radius={[6, 6, 0, 0]} maxBarSize={26} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Water Consumption Trend" subtitle="(12 Mo)">
          <TrendChart data={data.waterTrend} color="var(--color-status-info)" unit=" KL" />
        </Card>
        <Card title="Waste Generation Trend" subtitle="(12 Mo)">
          <TrendChart data={data.wasteTrend} color="var(--color-status-warn)" unit=" T" />
        </Card>
        <Card title="Energy Mix" subtitle="(YTD)">
          <DonutStat data={data.energyMix} total={data.energyTotal} totalLabel="Total Energy" height={160} />
        </Card>
      </div>

      <Card title="Key Insights">
        <ul className="grid grid-cols-1 gap-2 text-[12.5px] text-[var(--color-navy-900)] md:grid-cols-2">
          {data.insights.map((line) => (
            <li key={line} className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-status-good)]" />
              {line}
            </li>
          ))}
        </ul>
      </Card>

      <GoalFooter
        title="Sustainability Goal 2026-27"
        goals={[
          { label: "Specific CO2", value: "≤ 1.70 t/t" },
          { label: "Water Recirculation", value: "≥ 95%" },
          { label: "Waste Utilization", value: "≥ 90%" },
          { label: "Green Energy", value: "≥ 30%" },
          { label: "Zero Liquid Discharge", value: "100%" },
        ]}
        slogan="Together Towards a Greener Tomorrow"
      />
    </DashboardShell>
  );
}
