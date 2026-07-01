import { ShieldCheck, Target } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { KpiCard } from "@/components/ui/KpiCard";
import { DonutStat } from "@/components/ui/DonutStat";
import { TrendChart } from "@/components/ui/TrendChart";
import { RankedBars } from "@/components/ui/RankedBars";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SimpleTable, type Column } from "@/components/ui/SimpleTable";
import { generateQualityData, type QualityRow } from "@/data/quality";
import { useLiveData } from "@/lib/useLiveData";
import type { StatusTone } from "@/types/dashboard";

const STATUS_TONE: Record<QualityRow["status"], StatusTone> = {
  Good: "good",
  Average: "average",
  Critical: "bad",
};

const columns: Column<QualityRow>[] = [
  { key: "line", header: "Line / Area", render: (r) => <span className="font-semibold text-[var(--color-navy-950)]">{r.line}</span> },
  { key: "product", header: "Product", render: (r) => r.product },
  { key: "grade", header: "Grade", render: (r) => r.grade },
  { key: "production", header: "Production (MT)", align: "right", render: (r) => r.production.toLocaleString() },
  { key: "inspected", header: "Inspected (MT)", align: "right", render: (r) => r.inspected.toLocaleString() },
  { key: "fpy", header: "First Pass Yield (%)", align: "right", render: (r) => <span className="font-bold text-[var(--color-status-good)]">{r.fpy}%</span> },
  { key: "rejectionMt", header: "Rejection (MT)", align: "right", render: (r) => r.rejectionMt.toLocaleString() },
  { key: "rejectionPct", header: "Rejection (%)", align: "right", render: (r) => <span className="font-bold text-[var(--color-status-bad)]">{r.rejectionPct}%</span> },
  { key: "cpk", header: "Cpk", align: "right", render: (r) => r.cpk },
  { key: "qualityScore", header: "Quality Score (%)", align: "right", render: (r) => r.qualityScore },
  { key: "status", header: "Status", align: "center", render: (r) => <StatusBadge label={r.status} tone={STATUS_TONE[r.status]} /> },
];

export function QualityDashboard() {
  const { data, lastUpdated } = useLiveData(generateQualityData, 30_000);
  if (!data) return null;

  return (
    <DashboardShell order={9} title="Quality Management Dashboard" subtitle="Real Time Quality Performance & Process Conformance" lastUpdated={lastUpdated}>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 2xl:grid-cols-6">
        {data.kpis.map((kpi) => (
          <KpiCard key={kpi.label} kpi={kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[300px_1fr_320px]">
        <div className="flex flex-col gap-5">
          <Card title="Quality Score Trend" subtitle="(12 Mo)">
            <TrendChart data={data.qualityScoreTrend} color="var(--color-status-purple)" unit="%" height={160} />
          </Card>
          <Card title="Rejection Breakdown" subtitle="(YTD)">
            <DonutStat data={data.rejectionBreakdown} total={`${data.rejectionTotalMt.toLocaleString()}`} totalLabel="MT" height={170} />
          </Card>
        </div>

        <Card title="Quality Inspection Summary" subtitle="(Real Time)">
          <SimpleTable columns={columns} rows={data.inspectionSummary} />
        </Card>

        <div className="flex flex-col gap-5">
          <Card title="Customer Complaints" subtitle="(YTD)">
            <DonutStat data={data.customerComplaints} total={data.customerComplaints.reduce((s, d) => s + d.value, 0)} height={170} />
          </Card>
          <Card title="Top Defect Types" subtitle="(YTD)">
            <RankedBars data={data.topDefectTypes} color="var(--color-status-bad)" />
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-4">
        <Card title="Quality Cost" subtitle="(YTD)">
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-[var(--color-navy-950)]">₹ {data.qualityCostCr} Cr</span>
            <span className="text-[11px] font-bold text-[var(--color-status-bad)]">↑ {data.qualityCostDelta} vs LYTD</span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            {data.costSplit.map((c) => (
              <div key={c.label}>
                <div className="text-[13px] font-extrabold text-[var(--color-navy-950)]">₹ {c.valueCr} Cr</div>
                <div className="text-[10px] font-semibold text-[var(--color-muted)]">{c.label}</div>
                <div className="text-[10px] text-[var(--color-muted)]">({c.pct}%)</div>
              </div>
            ))}
          </div>
        </Card>
        <Card title="First Pass Yield Trend" subtitle="(12 Mo)">
          <TrendChart data={data.fpyTrend} color="var(--color-status-good)" target={93} unit="%" />
        </Card>
        <Card title="Process Capability Trend" subtitle="Cpk (12 Mo)">
          <TrendChart data={data.cpkTrend} color="var(--color-brand-blue)" target={1.33} unit="" />
        </Card>
        <Card title="Rejection % Trend" subtitle="(12 Mo)">
          <TrendChart data={data.rejectionTrend} color="var(--color-status-bad)" target={5} unit="%" />
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

      <div className="card flex flex-wrap items-center justify-between gap-4 px-5 py-3">
        <div className="flex max-w-md items-start gap-2">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-brand-blue)]" />
          <div>
            <div className="text-[11px] font-extrabold uppercase text-[var(--color-navy-950)]">Quality Policy</div>
            <div className="text-[11px] text-[var(--color-muted)]">We are committed to deliver defect free products and delight our customers.</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[12px] font-extrabold uppercase tracking-wide text-[var(--color-navy-950)]">
          <Target className="h-4 w-4 text-[var(--color-status-good)]" />
          Quality Goal 2026-27
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
          {[
            { label: "FPY", value: "≥ 93%" },
            { label: "Rejection", value: "≤ 5%" },
            { label: "CpK", value: "≥ 1.33" },
            { label: "Complaints", value: "≤ 20/Yr" },
          ].map((g) => (
            <div key={g.label} className="text-center">
              <div className="text-[10px] font-bold uppercase tracking-wide text-[var(--color-muted)]">{g.label}</div>
              <div className="text-[13px] font-extrabold text-[var(--color-navy-950)]">{g.value}</div>
            </div>
          ))}
        </div>
        <div className="text-[11px] font-bold italic text-[var(--color-status-good)]">"Quality is not an act, it is a habit."</div>
      </div>
    </DashboardShell>
  );
}
