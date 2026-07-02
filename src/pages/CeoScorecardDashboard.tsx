import { AlertCircle, AlertTriangle, Building2, Cog, Sun, UsersRound } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { PillarFooter } from "@/components/layout/PillarFooter";
import { Card } from "@/components/ui/Card";
import { SparkKpiCard } from "@/components/ui/SparkKpiCard";
import { DonutStat } from "@/components/ui/DonutStat";
import { GaugeStat } from "@/components/ui/GaugeStat";
import { MiniSpark } from "@/components/ui/MiniSpark";
import { generateCeoScorecardData, VALUE_PILLARS } from "@/data/ceoScorecard";
import { useLiveData } from "@/lib/useLiveData";

export function CeoScorecardDashboard() {
  const { data, lastUpdated } = useLiveData(generateCeoScorecardData, 30_000);
  if (!data) return null;
  const { factoryOverview } = data;

  return (
    <DashboardShell order={1} title="CEO Live Scorecard" subtitle="Real Time Overview of Factory Performance" lastUpdated={lastUpdated}>
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[240px_1fr]">
        <div className="flex flex-col gap-5">
          <Card title="Factory Overview">
            <ul className="flex flex-col gap-2.5 text-[12.5px]">
              {[
                { icon: Building2, label: "Total Lines", value: factoryOverview.totalLines },
                { icon: Cog, label: "Total Machines", value: factoryOverview.totalMachines },
                { icon: UsersRound, label: "Total Operators", value: factoryOverview.totalOperators },
                { icon: UsersRound, label: "Supervisors", value: factoryOverview.supervisors },
                { icon: Sun, label: "Working Days", value: factoryOverview.workingDays },
                { icon: AlertCircle, label: "Shift", value: factoryOverview.shift },
              ].map((row) => (
                <li key={row.label} className="flex items-center justify-between gap-2 border-b border-[var(--color-border)] pb-2 last:border-0 last:pb-0">
                  <span className="flex items-center gap-2 text-[var(--color-muted)]">
                    <row.icon className="h-4 w-4 shrink-0 text-[var(--color-brand-blue)]" />
                    {row.label}
                  </span>
                  <span className="font-bold text-[var(--color-navy-950)]">{row.value}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card title="Factory Status" bodyClassName="flex flex-col items-center">
            <GaugeStat value={data.overallPerformance} label="Overall Performance" size={170} />
          </Card>
        </div>

        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_280px]">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 2xl:grid-cols-5">
              {data.kpis.map((kpi) => (
                <SparkKpiCard key={kpi.label} kpi={kpi} />
              ))}
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
              <Card title="Today's Production">
                <DonutStat data={data.todaysProduction} total={data.todaysProductionTotal.toLocaleString()} totalLabel="Today" height={150} />
              </Card>
            </div>
          </div>

          <Card title="Live Trends" subtitle="(Last 8 Hours)">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
              {data.liveTrends.map((t) => (
                <div key={t.label}>
                  <div className="text-[10.5px] font-semibold uppercase tracking-wide text-[var(--color-muted)]">{t.label}</div>
                  <div className="text-lg font-extrabold text-[var(--color-navy-950)]">{t.value}</div>
                  <MiniSpark data={t.data.map((p) => ({ y: p.y }))} color={t.color} height={44} />
                  <div className="flex justify-between text-[9.5px] text-[var(--color-muted)]">
                    <span>{t.data[0].x}</span>
                    <span>{t.data[t.data.length - 1].x}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <PillarFooter pillars={VALUE_PILLARS} />
    </DashboardShell>
  );
}
