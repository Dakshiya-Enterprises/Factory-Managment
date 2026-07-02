import { AlertTriangle, ArrowRightLeft, ClipboardCheck, PackageSearch, Wrench } from "lucide-react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { InsightBanner } from "@/components/layout/InsightBanner";
import { Card } from "@/components/ui/Card";
import { KpiCard } from "@/components/ui/KpiCard";
import { LineStatusCard } from "@/components/ui/LineStatusCard";
import { HeatGrid } from "@/components/ui/HeatGrid";
import { generateProductionLineData, BAND_COLOR, type LineBand } from "@/data/productionLine";
import { useLiveData } from "@/lib/useLiveData";

const QUICK_ACTION_ICONS = [ArrowRightLeft, PackageSearch, Wrench, ClipboardCheck];

export function ProductionLineDashboard() {
  const { data, lastUpdated } = useLiveData(generateProductionLineData, 30_000);
  if (!data) return null;

  return (
    <DashboardShell order={3} title="Production Line Monitoring" subtitle="Real Time Performance of All Production Lines" lastUpdated={lastUpdated}>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 2xl:grid-cols-6">
        {data.kpis.map((kpi) => (
          <KpiCard key={kpi.label} kpi={kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[220px_1fr_280px]">
        <div className="flex flex-col gap-5">
          <Card title="Line Summary">
            <ul className="flex flex-col gap-2.5 text-[12.5px]">
              {(Object.entries(data.summary) as [LineBand, number][]).map(([band, count]) => (
                <li key={band} className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[var(--color-navy-900)]">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: BAND_COLOR[band] }} />
                    {band}
                  </span>
                  <span className="font-bold text-[var(--color-navy-950)]">{count}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card title="Quick Actions">
            <ul className="flex flex-col gap-2">
              {data.quickActions.map((action, i) => {
                const Icon = QUICK_ACTION_ICONS[i % QUICK_ACTION_ICONS.length];
                return (
                  <li key={action} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[11.5px] font-semibold text-[var(--color-navy-900)] hover:bg-[var(--color-page)]">
                    <Icon className="h-4 w-4 shrink-0 text-[var(--color-brand-blue)]" />
                    {action}
                  </li>
                );
              })}
            </ul>
          </Card>
        </div>

        <div className="flex flex-col gap-5">
          <Card title="Line Status Overview">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
              {data.lines.map((line) => (
                <LineStatusCard key={line.id} line={line} />
              ))}
            </div>
          </Card>
          <Card title="Plant Layout" subtitle="Line Performance Map">
            <HeatGrid rows={data.layout} />
          </Card>
        </div>

        <div className="flex flex-col gap-5">
          <Card title="Top Alerts">
            <ul className="flex flex-col gap-2.5 text-[12px]">
              {data.alerts.map((a) => (
                <li key={a.id} className="flex items-start gap-2">
                  <AlertTriangle className={`mt-0.5 h-4 w-4 shrink-0 ${a.severity === "bad" ? "text-[var(--color-status-bad)]" : "text-[var(--color-status-warn)]"}`} />
                  <span className="text-[var(--color-navy-900)]">{a.text}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card title="Line Performance Trend" subtitle="(Avg)">
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={data.trend} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="x" tick={{ fontSize: 10, fill: "var(--color-muted)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "var(--color-muted)" }} axisLine={false} tickLine={false} width={30} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--color-border)", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Line type="monotone" dataKey="today" name="Today" stroke="var(--color-brand-blue)" strokeWidth={2.25} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="yesterday" name="Yesterday" stroke="#9aa5b8" strokeDasharray="4 4" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>

      <InsightBanner text={`Insight: ${data.insight}`} />
    </DashboardShell>
  );
}
