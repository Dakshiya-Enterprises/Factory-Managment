import { jitter } from "@/lib/useLiveData";
import type { AccentColor, DonutSlice } from "@/types/dashboard";
import type { SparkKpi } from "@/components/ui/SparkKpiCard";

const HOURS = ["2 AM", "4 AM", "6 AM", "8 AM", "10 AM"];

function spark(base: number, spread: number) {
  return Array.from({ length: 10 }, () => ({ y: jitter(base, spread, 2) }));
}

export interface AlertItem {
  id: string;
  text: string;
  severity: "bad" | "warn";
}

export interface CeoScorecardData {
  factoryOverview: { totalLines: number; totalMachines: number; totalOperators: number; supervisors: number; workingDays: number; shift: string };
  overallPerformance: number;
  kpis: SparkKpi[];
  alerts: AlertItem[];
  todaysProduction: DonutSlice[];
  todaysProductionTotal: number;
  liveTrends: { label: string; value: string; color: string; data: { x: string; y: number }[] }[];
}

export function generateCeoScorecardData(): CeoScorecardData {
  const revenue = jitter(2.05, 0.03, 2);
  const efficiency = Math.round(jitter(82, 1));

  const kpis: SparkKpi[] = [
    { label: "Revenue Today", target: "₹ 2.10 Cr", value: `₹ ${revenue} Cr`, delta: "2.4%", direction: "up", sentiment: "good", icon: "rupee", color: "blue", status: "Good", spark: spark(2.0, 0.08) },
    { label: "Profit Today", target: "₹ 48.00 L", value: "₹ 44.00 L", delta: "3.6%", direction: "down", sentiment: "bad", icon: "wallet", color: "green", status: "Average", spark: spark(44, 2) },
    { label: "Gross Margin", target: "21.0%", value: "19.8%", delta: "1.2%", direction: "down", sentiment: "bad", icon: "percent", color: "purple", status: "Average", spark: spark(20, 0.8) },
    { label: "Factory Efficiency", target: "87%", value: `${efficiency}%`, delta: "5%", direction: "down", sentiment: "bad", icon: "gauge", color: "blue", status: "Poor", spark: spark(82, 2) },
    { label: "Line Efficiency", target: "85%", value: "81%", delta: "4%", direction: "down", sentiment: "bad", icon: "trendingUp", color: "green", status: "Average", spark: spark(81, 2) },
    { label: "OTIF Delivery", target: "98%", value: "96%", delta: "2%", direction: "down", sentiment: "bad", icon: "truck", color: "orange", status: "Average", spark: spark(96, 1) },
    { label: "Reject Rate", target: "< 1.5%", value: "0.8%", delta: "0.3%", direction: "down", sentiment: "good", icon: "shieldCheck", color: "red", status: "Good", spark: spark(0.8, 0.1) },
    { label: "Absenteeism", target: "< 3%", value: "2.1%", delta: "0.4%", direction: "down", sentiment: "good", icon: "users", color: "purple", status: "Good", spark: spark(2.1, 0.2) },
    { label: "Machine Availability", target: "> 96%", value: "95%", delta: "1%", direction: "down", sentiment: "bad", icon: "settings", color: "blue", status: "Average", spark: spark(95, 1) },
    { label: "Energy Cost / pc", target: "₹ 2.75", value: "₹ 2.62", delta: "0.13", direction: "down", sentiment: "good", icon: "zap", color: "teal", status: "Good", spark: spark(2.62, 0.05) },
  ];

  return {
    factoryOverview: { totalLines: 40, totalMachines: 980, totalOperators: 1248, supervisors: 82, workingDays: 25, shift: "8 AM - 8 PM" },
    overallPerformance: efficiency,
    kpis,
    alerts: [
      { id: "a1", text: "Line 12 Efficiency Low 63% (Target 85%)", severity: "bad" },
      { id: "a2", text: "Machine 452 Vibration High", severity: "warn" },
      { id: "a3", text: "Order PO1056 Delay Risk: 78%", severity: "bad" },
      { id: "a4", text: "Absenteeism Increasing in Shift 2", severity: "warn" },
      { id: "a5", text: "Reject Rate High in Collar Section", severity: "bad" },
    ],
    todaysProduction: [
      { label: "Completed", value: 34025, color: "#16a34a" },
      { label: "In Progress", value: 16450, color: "#1e56c9" },
      { label: "Pending", value: 8275, color: "#f59e0b" },
    ],
    todaysProductionTotal: 58750,
    liveTrends: [
      { label: "Production (Pcs)", value: "7,500", color: "var(--color-brand-blue)", data: [7100, 7300, 7450, 7600, 7500].map((y, i) => ({ x: HOURS[i], y })) },
      { label: "Efficiency (%)", value: "82%", color: "var(--color-status-good)", data: [80, 83, 81, 84, 82].map((y, i) => ({ x: HOURS[i], y })) },
      { label: "Reject Rate (%)", value: "0.8%", color: "var(--color-status-bad)", data: [0.9, 0.7, 0.85, 0.75, 0.8].map((y, i) => ({ x: HOURS[i], y })) },
      { label: "Absenteeism (%)", value: "2.1%", color: "var(--color-status-purple)", data: [2.3, 2.0, 2.2, 1.9, 2.1].map((y, i) => ({ x: HOURS[i], y })) },
      { label: "Machine Availability (%)", value: "95%", color: "var(--color-status-info)", data: [94, 96, 95, 97, 95].map((y, i) => ({ x: HOURS[i], y })) },
    ],
  };
}

export const VALUE_PILLARS: { title: string; subtitle: string; icon: string; color: AccentColor }[] = [
  { title: "Maximize Production", subtitle: "More Output, Less Waste", icon: "trendingUp", color: "green" },
  { title: "Reduce Cost", subtitle: "Save More, Earn More", icon: "rupee", color: "orange" },
  { title: "Deliver On Time", subtitle: "Happy Customers, Repeat Business", icon: "clock", color: "blue" },
  { title: "Delight Customers", subtitle: "Quality First, Trust Always", icon: "smile", color: "purple" },
  { title: "Empower People", subtitle: "Engaged Team, Stronger Tomorrow", icon: "users", color: "teal" },
];
