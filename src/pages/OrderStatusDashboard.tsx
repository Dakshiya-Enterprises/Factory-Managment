import { ArrowRight, Bot, CheckCircle2 } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { KpiCard } from "@/components/ui/KpiCard";
import { DonutStat } from "@/components/ui/DonutStat";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SimpleTable, type Column } from "@/components/ui/SimpleTable";
import { generateOrderStatusData, type HighRiskRow, type OrderRow } from "@/data/orderStatus";
import { useLiveData } from "@/lib/useLiveData";
import type { StatusTone } from "@/types/dashboard";

const DELAY_TONE: Record<OrderRow["delayPrediction"], StatusTone> = {
  "On Time": "good",
  "May Delay": "average",
  "Likely Delay": "bad",
  "Will Delay": "bad",
};

function riskTone(risk: number): StatusTone {
  if (risk < 30) return "good";
  if (risk <= 70) return "average";
  return "bad";
}

const columns: Column<OrderRow>[] = [
  { key: "buyer", header: "Buyer", render: (r) => <span className="font-extrabold text-[var(--color-navy-950)]">{r.buyer}</span> },
  { key: "po", header: "PO Number", render: (r) => r.po },
  { key: "style", header: "Style Number", render: (r) => r.style },
  { key: "orderQty", header: "Order Qty (PCS)", align: "right", render: (r) => r.orderQty.toLocaleString() },
  { key: "completed", header: "Completed (PCS)", align: "right", render: (r) => r.completed.toLocaleString() },
  { key: "balance", header: "Balance (PCS)", align: "right", render: (r) => r.balance.toLocaleString() },
  {
    key: "pct",
    header: "% Complete",
    render: (r) => (
      <div className="flex items-center gap-2">
        <div className="h-2 w-24 overflow-hidden rounded-full bg-[var(--color-track)]">
          <div
            className="h-full rounded-full"
            style={{ width: `${r.pctComplete}%`, background: r.pctComplete >= 80 ? "var(--color-status-good)" : r.pctComplete >= 55 ? "var(--color-status-warn)" : "var(--color-status-bad)" }}
          />
        </div>
        <span className="text-[11px] font-bold">{r.pctComplete}%</span>
      </div>
    ),
  },
  { key: "dispatch", header: "Expected Dispatch", render: (r) => r.expectedDispatch },
  { key: "risk", header: "Risk %", align: "center", render: (r) => <StatusBadge label={`${r.riskPct}%`} tone={riskTone(r.riskPct)} /> },
  { key: "delay", header: "Delay Prediction", align: "center", render: (r) => <StatusBadge label={r.delayPrediction} tone={DELAY_TONE[r.delayPrediction]} /> },
  { key: "line", header: "Current Line", render: (r) => r.currentLine },
  { key: "operator", header: "Current Operator", render: (r) => r.currentOperator },
  { key: "efficiency", header: "Efficiency", align: "right", render: (r) => <span className="font-bold text-[var(--color-status-good)]">{r.efficiency}%</span> },
];

const highRiskColumns: Column<HighRiskRow>[] = [
  { key: "po", header: "PO Number", render: (r) => <span className="font-semibold text-[var(--color-navy-950)]">{r.po}</span> },
  { key: "buyer", header: "Buyer", render: (r) => r.buyer },
  { key: "balance", header: "Balance (PCS)", align: "right", render: (r) => r.balance.toLocaleString() },
  { key: "risk", header: "Risk %", align: "center", render: (r) => <StatusBadge label={`${r.riskPct}%`} tone={riskTone(r.riskPct)} /> },
  { key: "predicted", header: "Predicted Delay", render: (r) => r.predictedDelay },
  { key: "action", header: "Action Suggested", render: (r) => r.action },
];

export function OrderStatusDashboard() {
  const { data, lastUpdated } = useLiveData(generateOrderStatusData, 60_000);
  if (!data) return null;

  return (
    <DashboardShell order={2} title="Order Status Dashboard" subtitle="Real Time Tracking of Orders from PO to Dispatch" lastUpdated={lastUpdated}>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 2xl:grid-cols-6">
        {data.kpis.map((kpi) => (
          <KpiCard key={kpi.label} kpi={kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[260px_1fr]">
        <Card title="Buyer Wise Orders">
          <DonutStat data={data.buyerWise} total={data.buyerWise.reduce((s, d) => s + d.value, 0)} totalLabel="Orders" height={170} />
        </Card>
        <Card title="Order Tracking - Live Status">
          <SimpleTable columns={columns} rows={data.orders} />
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[280px_1fr_320px]">
        <Card title="Delay Risk Summary">
          <DonutStat data={data.delayRisk} total={data.delayRisk.reduce((s, d) => s + d.value, 0)} height={170} />
        </Card>
        <Card title="Top 5 High Risk Orders">
          <SimpleTable columns={highRiskColumns} rows={data.highRisk} />
        </Card>
        <Card title="AI Prediction & Recommendation">
          <div className="flex items-center gap-2 pb-2 text-[var(--color-brand-blue)]">
            <Bot className="h-5 w-5" />
            <span className="text-[11px] font-bold uppercase tracking-wide">Smart Forecast</span>
          </div>
          <ul className="flex flex-col gap-2 text-[12px] text-[var(--color-navy-900)]">
            {data.aiInsights.map((line) => (
              <li key={line} className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-status-good)]" />
                {line}
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg bg-[var(--color-brand-blue)] px-3 py-2 text-[12px] font-bold text-white transition-opacity hover:opacity-90"
          >
            View Detailed AI Insights
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </Card>
      </div>

      <div className="card flex flex-wrap items-center justify-between gap-4 px-5 py-3">
        <div className="text-[12px] font-semibold text-[var(--color-navy-950)]">
          Smart Insight: Reallocate resources from low utilization lines to high risk orders to improve On Time Delivery.
        </div>
        <div className="flex items-center gap-4 text-[11px] font-semibold text-[var(--color-navy-900)]">
          {[
            { label: "On Time", color: "#16a34a" },
            { label: "May Delay", color: "#f59e0b" },
            { label: "Will Delay", color: "#dc2626" },
          ].map((s) => (
            <span key={s.label} className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
              {s.label}
            </span>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
