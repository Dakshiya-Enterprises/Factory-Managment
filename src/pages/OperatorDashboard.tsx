import { Trophy } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { InsightBanner } from "@/components/layout/InsightBanner";
import { Card } from "@/components/ui/Card";
import { KpiCard } from "@/components/ui/KpiCard";
import { DonutStat } from "@/components/ui/DonutStat";
import { RadialScore } from "@/components/ui/RadialScore";
import { BarStat } from "@/components/ui/BarStat";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SimpleTable, type Column } from "@/components/ui/SimpleTable";
import { CartesianGrid, Line, LineChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { generateOperatorData, type OperatorRow } from "@/data/operator";
import { useLiveData } from "@/lib/useLiveData";
import type { StatusTone } from "@/types/dashboard";

const STATUS_TONE: Record<OperatorRow["status"], StatusTone> = {
  Excellent: "good",
  Good: "good",
  Average: "average",
  "Needs Support": "bad",
};

const columns: Column<OperatorRow>[] = [
  { key: "empId", header: "Emp ID", render: (r) => <span className="font-mono text-[11.5px]">{r.empId}</span> },
  { key: "name", header: "Operator Name", render: (r) => <span className="font-semibold text-[var(--color-navy-950)]">{r.name}</span> },
  { key: "line", header: "Line", render: (r) => r.line },
  { key: "skill", header: "Skill", render: (r) => r.skill },
  { key: "efficiency", header: "Efficiency (%)", align: "right", render: (r) => <span className="font-bold" style={{ color: r.efficiency >= r.target ? "var(--color-status-good)" : "var(--color-status-warn)" }}>{r.efficiency}%</span> },
  { key: "target", header: "Target (%)", align: "right", render: (r) => `${r.target}%` },
  { key: "output", header: "Output (Pcs)", align: "right", render: (r) => r.output },
  { key: "reject", header: "Reject (%)", align: "right", render: (r) => `${r.reject}%` },
  { key: "attendance", header: "Attendance", align: "center", render: (r) => <span className="font-bold text-[var(--color-status-good)]">{r.attendance}</span> },
  { key: "incentive", header: "Incentive (₹) Today", align: "right", render: (r) => r.incentive.toLocaleString() },
  { key: "happiness", header: "Happiness Score", align: "right", render: (r) => r.happiness },
  { key: "status", header: "Status", align: "center", render: (r) => <StatusBadge label={r.status} tone={STATUS_TONE[r.status]} /> },
];

export function OperatorDashboard() {
  const { data, lastUpdated } = useLiveData(generateOperatorData, 30_000);
  if (!data) return null;

  return (
    <DashboardShell order={5} title="Operator Dashboard" subtitle="People Performance, Productivity & Happiness" lastUpdated={lastUpdated}>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 2xl:grid-cols-6">
        {data.kpis.map((kpi) => (
          <KpiCard key={kpi.label} kpi={kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[280px_1fr_300px]">
        <div className="flex flex-col gap-5">
          <Card title="Operator Distribution by Skill">
            <DonutStat data={data.skillDistribution} total={data.attendance.total.toLocaleString()} height={160} />
          </Card>
        </div>

        <Card title="Operator Performance List" subtitle="(Real Time)">
          <SimpleTable columns={columns} rows={data.performanceList} />
        </Card>

        <div className="flex flex-col gap-5">
          <Card title="Happiness Index Breakdown">
            <div className="flex items-center gap-4">
              <RadialScore value={data.happinessTotal} label="Good" size={130} color="var(--color-status-good)" />
              <ul className="flex min-w-0 flex-1 flex-col gap-1.5">
                {data.happinessBreakdown.map((row) => (
                  <li key={row.label} className="text-[11.5px]">
                    <div className="flex items-center justify-between">
                      <span className="truncate text-[var(--color-navy-900)]">{row.label}</span>
                      <span className="font-bold text-[var(--color-navy-950)]">{row.value} / {row.max}</span>
                    </div>
                    <div className="mt-0.5 h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-track)]">
                      <div className="h-full rounded-full bg-[var(--color-brand-blue)]" style={{ width: `${(row.value / row.max) * 100}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
          <Card title="Today's Top Performers">
            <ul className="flex flex-col gap-2">
              {data.topPerformers
                .sort((a, b) => a.rank - b.rank)
                .map((p) => (
                  <li key={p.rank} className="flex items-center gap-2.5 text-[12.5px]">
                    <Trophy
                      className="h-4 w-4 shrink-0"
                      style={{ color: p.rank === 1 ? "#f5b400" : p.rank === 2 ? "#a3a3a3" : "#c97b3f" }}
                    />
                    <span className="min-w-0 flex-1 truncate font-semibold text-[var(--color-navy-950)]">{p.name}</span>
                    <span className="shrink-0 text-[var(--color-muted)]">{p.line}</span>
                    <span className="shrink-0 font-bold text-[var(--color-status-good)]">{p.efficiency}%</span>
                  </li>
                ))}
            </ul>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-4">
        <Card title="Operator Performance Trend" subtitle="(Last 7 Days)" className="xl:col-span-1">
          <ResponsiveContainer width="100%" height={170}>
            <LineChart data={data.performanceTrend} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="x" tick={{ fontSize: 10, fill: "var(--color-muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "var(--color-muted)" }} axisLine={false} tickLine={false} width={30} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--color-border)", fontSize: 12, background: "var(--color-surface)", color: "var(--color-navy-950)" }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="efficiency" name="Efficiency (%)" stroke="var(--color-brand-blue)" strokeWidth={2.25} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="target" name="Target (%)" stroke="var(--color-status-good)" strokeDasharray="4 4" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Efficiency Distribution" subtitle="No. of Operators">
          <BarStat data={data.efficiencyDistribution} color="var(--color-brand-blue)" />
        </Card>
        <Card title="Reject Rate by Operator Group">
          <BarStat data={data.rejectRateByGroup} color="var(--color-status-bad)" unit="%" />
        </Card>
        <div className="flex flex-col gap-5">
          <Card title="Incentive Payout Today">
            <div className="text-2xl font-extrabold text-[var(--color-status-good)]">₹ {data.incentiveToday.toLocaleString()}</div>
            <div className="text-[11px] font-semibold text-[var(--color-muted)]">Total Incentive</div>
            <div className="mt-3 flex justify-between text-[11.5px]">
              <div>
                <div className="font-bold text-[var(--color-navy-950)]">₹ {data.avgIncentive}</div>
                <div className="text-[10px] text-[var(--color-muted)]">Avg Incentive / Operator</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-[var(--color-navy-950)]">{data.operatorsEligible.toLocaleString()}</div>
                <div className="text-[10px] text-[var(--color-muted)]">Operators Eligible</div>
              </div>
            </div>
          </Card>
        </div>
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

      <InsightBanner text={`Smart Insight: ${data.smartInsight}`} />
    </DashboardShell>
  );
}
