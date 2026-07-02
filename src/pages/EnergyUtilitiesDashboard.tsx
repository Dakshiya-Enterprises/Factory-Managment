import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AlertTriangle, CheckCircle2, Info, Leaf, Wallet } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GoalFooter } from "@/components/layout/GoalFooter";
import { Card } from "@/components/ui/Card";
import { KpiCard } from "@/components/ui/KpiCard";
import { DonutStat } from "@/components/ui/DonutStat";
import { GaugeStat } from "@/components/ui/GaugeStat";
import { RankedBars } from "@/components/ui/RankedBars";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SimpleTable, type Column } from "@/components/ui/SimpleTable";
import { generateEnergyUtilitiesData, type AlertItem, type SavingsOpportunity, type UtilityRow } from "@/data/energyUtilities";
import { useLiveData } from "@/lib/useLiveData";
import type { StatusTone } from "@/types/dashboard";

const STATUS_TONE: Record<UtilityRow["status"], StatusTone> = { Good: "good", Average: "average", Critical: "bad" };
const OPP_TONE: Record<SavingsOpportunity["status"], StatusTone> = { "In Progress": "average", Identified: "info", Approved: "good", Completed: "good" };
const ALERT_ICON: Record<AlertItem["tone"], typeof AlertTriangle> = { bad: AlertTriangle, warn: AlertTriangle, info: Info, good: CheckCircle2 };
const ALERT_COLOR: Record<AlertItem["tone"], string> = {
  bad: "var(--color-status-bad)",
  warn: "var(--color-status-warn)",
  info: "var(--color-status-info)",
  good: "var(--color-status-good)",
};

const utilityColumns: Column<UtilityRow>[] = [
  { key: "utility", header: "Utility", render: (r) => <span className="font-semibold text-[var(--color-navy-950)]">{r.utility}</span> },
  { key: "unit", header: "Unit", render: (r) => r.unit },
  { key: "today", header: "Today", align: "right", render: (r) => r.today.toLocaleString() },
  { key: "yesterday", header: "Yesterday", align: "right", render: (r) => r.yesterday.toLocaleString() },
  { key: "mtd", header: "MTD (This Month)", align: "right", render: (r) => r.mtd.toLocaleString() },
  { key: "lyMtd", header: "LY MTD", align: "right", render: (r) => r.lyMtd.toLocaleString() },
  { key: "mtdVariance", header: "Variance (%)", align: "right", render: (r) => <span className="font-bold text-[var(--color-status-good)]">{r.mtdVariance}%</span> },
  { key: "ytd", header: "YTD", align: "right", render: (r) => r.ytd.toLocaleString() },
  { key: "lytd", header: "LYTD", align: "right", render: (r) => r.lytd.toLocaleString() },
  { key: "ytdVariance", header: "Variance (%)", align: "right", render: (r) => <span className="font-bold text-[var(--color-status-good)]">{r.ytdVariance}%</span> },
  { key: "status", header: "Status", align: "center", render: (r) => <StatusBadge label={r.status} tone={STATUS_TONE[r.status]} /> },
];

const oppColumns: Column<SavingsOpportunity>[] = [
  { key: "opportunity", header: "Opportunity", render: (r) => <span className="font-semibold text-[var(--color-navy-950)]">{r.opportunity}</span> },
  { key: "area", header: "Area", render: (r) => r.area },
  { key: "potentialMwh", header: "Potential Savings (MWh/Yr)", align: "right", render: (r) => r.potentialMwh.toLocaleString() },
  { key: "potentialCr", header: "Potential Savings (₹ Cr/Yr)", align: "right", render: (r) => r.potentialCr.toFixed(2) },
  { key: "status", header: "Status", align: "center", render: (r) => <StatusBadge label={r.status} tone={OPP_TONE[r.status]} /> },
];

export function EnergyUtilitiesDashboard() {
  const { data, lastUpdated } = useLiveData(generateEnergyUtilitiesData, 30_000);
  if (!data) return null;

  return (
    <DashboardShell order={11} title="Energy & Utilities Management Dashboard" subtitle="Real Time Energy Monitoring, Consumption & Cost Optimization" lastUpdated={lastUpdated}>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 2xl:grid-cols-7">
        {data.kpis.map((kpi) => (
          <KpiCard key={kpi.label} kpi={kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[280px_1fr_300px]">
        <div className="flex flex-col gap-5">
          <Card title="Energy Mix" subtitle="(YTD)">
            <DonutStat data={data.energyMix} total={data.energyTotalMwh} totalLabel="Total MWh" height={160} />
          </Card>
          <Card title="Cost Breakdown" subtitle="(YTD)">
            <DonutStat data={data.costBreakdown} total={`₹ ${data.costTotalCr}`} totalLabel="Cr" height={160} />
          </Card>
        </div>

        <Card title="Utility Consumption Summary" subtitle="(Real Time)">
          <SimpleTable columns={utilityColumns} rows={data.utilities} />
        </Card>

        <Card title="Energy Cost Trend" subtitle="(₹ Cr)">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.energyCostTrend} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="x" tick={{ fontSize: 10, fill: "var(--color-muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "var(--color-muted)" }} axisLine={false} tickLine={false} width={30} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--color-border)", fontSize: 12 }} cursor={{ fill: "var(--color-page)" }} />
              <Bar dataKey="costCr" name="Cost (₹ Cr)" fill="var(--color-brand-blue)" radius={[6, 6, 0, 0]} maxBarSize={30} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2">
            <RankedBars data={data.topConsumingAreas.map((a) => ({ label: a.label, value: a.value }))} color="var(--color-status-warn)" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card title="Specific Energy Trend" subtitle="(Last 7 Days)">
          <ResponsiveContainer width="100%" height={170}>
            <LineChart data={data.specificEnergyTrend} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="x" tick={{ fontSize: 9.5, fill: "var(--color-muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "var(--color-muted)" }} axisLine={false} tickLine={false} width={34} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--color-border)", fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 9 }} />
              <Line type="monotone" dataKey="current" name="FY 2025-26" stroke="var(--color-brand-blue)" strokeWidth={2.25} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="prior" name="FY 2024-25" stroke="#9aa5b8" strokeDasharray="4 4" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Daily Energy Consumption" subtitle="(MWh)">
          <ResponsiveContainer width="100%" height={170}>
            <AreaChart data={data.dailyConsumption} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
              <defs>
                <linearGradient id="dailyEnergyFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-brand-blue)" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="var(--color-brand-blue)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="x" tick={{ fontSize: 10, fill: "var(--color-muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "var(--color-muted)" }} axisLine={false} tickLine={false} width={34} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--color-border)", fontSize: 12 }} />
              <Area type="monotone" dataKey="y" stroke="var(--color-brand-blue)" strokeWidth={2.25} fill="url(#dailyEnergyFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Energy Cost Trend" subtitle="(Last 12 Months)">
          <ResponsiveContainer width="100%" height={170}>
            <LineChart data={data.costTrend12mo} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="x" tick={{ fontSize: 10, fill: "var(--color-muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "var(--color-muted)" }} axisLine={false} tickLine={false} width={30} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--color-border)", fontSize: 12 }} formatter={(v: number) => [`₹ ${v} Cr`, ""]} />
              <Line type="monotone" dataKey="y" stroke="var(--color-status-good)" strokeWidth={2.25} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <div className="flex flex-col gap-4">
          <Card title="Energy Savings" subtitle="(YTD)">
            <div className="flex items-center gap-2.5">
              <Leaf className="h-6 w-6 shrink-0 text-[var(--color-status-good)]" />
              <div>
                <div className="text-lg font-extrabold text-[var(--color-navy-950)]">{data.savingsMwh.toLocaleString()} MWh</div>
                <div className="text-[10.5px] text-[var(--color-muted)]">Estimated Savings</div>
              </div>
            </div>
            <div className="mt-2.5 flex items-center gap-2.5">
              <Wallet className="h-6 w-6 shrink-0 text-[var(--color-status-good)]" />
              <div>
                <div className="text-lg font-extrabold text-[var(--color-navy-950)]">₹ {data.savingsCr} Cr</div>
                <div className="text-[10.5px] text-[var(--color-muted)]">Cost Savings</div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[280px_1fr]">
        <Card title="Energy Performance vs Target" subtitle="(YTD)" bodyClassName="flex flex-col items-center justify-center">
          <GaugeStat value={data.performanceVsTarget} label="Achieved vs Target" size={170} />
        </Card>
        <Card title="Plant Wise Specific Energy" subtitle="(kWh / t Steel)">
          <RankedBars data={data.plantWiseSpecificEnergy} color="var(--color-brand-blue)" />
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[320px_1fr_320px]">
        <Card title="Alerts & Notifications">
          <ul className="flex flex-col gap-2.5 text-[12px]">
            {data.alerts.map((a) => {
              const Icon = ALERT_ICON[a.tone];
              return (
                <li key={a.id} className="flex items-start gap-2">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0" style={{ color: ALERT_COLOR[a.tone] }} />
                  <span className="text-[var(--color-navy-900)]">{a.text}</span>
                </li>
              );
            })}
          </ul>
        </Card>
        <Card title="Energy Savings Opportunities">
          <SimpleTable columns={oppColumns} rows={data.savingsOpportunities} />
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
        title="Energy Goal 2026-27"
        goals={[
          { label: "Specific Energy", value: "≤ 510 kWh/t" },
          { label: "Energy Cost", value: "≤ ₹ 11.50 Cr" },
          { label: "Renewable Use", value: "≥ 20%" },
          { label: "WHRB Efficiency", value: "≥ 92%" },
          { label: "Energy Loss", value: "Zero Unaccounted" },
        ]}
        slogan="Save Energy Today, Sustain Tomorrow"
      />
    </DashboardShell>
  );
}
