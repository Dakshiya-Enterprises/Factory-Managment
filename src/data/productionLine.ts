import { jitter } from "@/lib/useLiveData";
import type { Kpi } from "@/types/dashboard";

export type LineBand = "Excellent" | "Good" | "Average" | "Poor";

export function bandFor(efficiency: number): LineBand {
  if (efficiency >= 90) return "Excellent";
  if (efficiency >= 75) return "Good";
  if (efficiency >= 60) return "Average";
  return "Poor";
}

export const BAND_COLOR: Record<LineBand, string> = {
  Excellent: "#16a34a",
  Good: "#3b9c55",
  Average: "#f59e0b",
  Poor: "#dc2626",
};

export interface LineCard {
  id: string;
  name: string;
  efficiency: number;
  output: number;
  target: number;
  reject: number;
  supervisor: string;
}

export interface LayoutCell {
  id: string;
  efficiency: number;
}

export interface AlertItem {
  id: string;
  text: string;
  severity: "bad" | "warn";
}

export interface ProductionLineData {
  kpis: Kpi[];
  summary: Record<LineBand, number>;
  lines: LineCard[];
  layout: { area: string; cells: LayoutCell[] }[];
  alerts: AlertItem[];
  trend: { x: string; today: number; yesterday: number }[];
  quickActions: string[];
  insight: string;
}

const BASE_LINES: Omit<LineCard, "id">[] = [
  { name: "Line 01", efficiency: 92, output: 1450, target: 1580, reject: 0.6, supervisor: "Ramesh" },
  { name: "Line 02", efficiency: 88, output: 1320, target: 1500, reject: 0.7, supervisor: "Sita" },
  { name: "Line 03", efficiency: 63, output: 950, target: 1500, reject: 1.2, supervisor: "Mahesh" },
  { name: "Line 04", efficiency: 91, output: 1400, target: 1540, reject: 0.5, supervisor: "Sunita" },
  { name: "Line 05", efficiency: 78, output: 1170, target: 1500, reject: 0.9, supervisor: "Anita" },
  { name: "Line 06", efficiency: 94, output: 1560, target: 1660, reject: 0.4, supervisor: "Raju" },
  { name: "Line 07", efficiency: 69, output: 1030, target: 1500, reject: 1.1, supervisor: "Pawan" },
  { name: "Line 08", efficiency: 83, output: 1240, target: 1500, reject: 0.8, supervisor: "Kiran" },
  { name: "Line 09", efficiency: 55, output: 820, target: 1500, reject: 1.5, supervisor: "Vijay" },
  { name: "Line 10", efficiency: 87, output: 1300, target: 1500, reject: 0.7, supervisor: "Neha" },
];

const CUTTING = [92, 88, 63, 91, 78, 94, 69, 83, 55, 87];
const SEWING = [90, 76, 61, 89, 82, 58, 93, 85, 64, 81];
const FINISHING = [88, 72, 67, 90, 84, 60, 86, 73, 54, 79];

export function generateProductionLineData(): ProductionLineData {
  const avgEfficiency = Math.round(jitter(81, 1));

  const lines: LineCard[] = BASE_LINES.map((l, i) => ({ id: `l${i + 1}`, ...l }));
  const summary: Record<LineBand, number> = { Excellent: 12, Good: 15, Average: 7, Poor: 6 };

  return {
    kpis: [
      { label: "Total Lines", value: "40", caption: "Active Lines", icon: "layers", color: "blue" },
      { label: "Avg Line Efficiency", value: `${avgEfficiency}%`, caption: "Target: 85%", icon: "gauge", color: "green" },
      { label: "Total Output Today", value: "58,750", caption: "PCS", icon: "package", color: "purple" },
      { label: "Total Target Today", value: "72,000", caption: "PCS", icon: "target", color: "orange" },
      { label: "Lines Below Target", value: "9", caption: "22.5%", icon: "alertTriangle", color: "red" },
      { label: "Operators At Work", value: "1,248", caption: "Present", icon: "users", color: "teal" },
    ],
    summary,
    lines,
    layout: [
      { area: "Cutting Area", cells: CUTTING.map((efficiency, i) => ({ id: `L${String(i + 1).padStart(2, "0")}`, efficiency })) },
      { area: "Sewing Area", cells: SEWING.map((efficiency, i) => ({ id: `L${String(i + 11).padStart(2, "0")}`, efficiency })) },
      { area: "Finishing Area", cells: FINISHING.map((efficiency, i) => ({ id: `L${String(i + 21).padStart(2, "0")}`, efficiency })) },
    ],
    alerts: [
      { id: "a1", text: "Line 09 Efficiency Very Low 55% (Target 85%)", severity: "bad" },
      { id: "a2", text: "Line 03 Behind Target — Delay Risk: 1 Day", severity: "warn" },
      { id: "a3", text: "High Reject in Line 09: 1.5% (Limit < 1.0%)", severity: "bad" },
      { id: "a4", text: "Absenteeism High — Line 07 (12%)", severity: "warn" },
      { id: "a5", text: "Machine Down in Line 04 — MC-125 (15 Min)", severity: "warn" },
    ],
    trend: ["8 AM", "10 AM", "12 PM", "2 PM", "4 PM"].map((x, i) => ({
      x,
      today: [78, 82, 80, 85, 81][i],
      yesterday: [72, 76, 75, 78, 76][i],
    })),
    quickActions: ["Reallocate Operators", "Move Work In Progress", "Check Machine Status", "View Detailed Analysis"],
    insight: "9 lines are below target efficiency. Immediate attention required on Line 03, 07, 09, 13, 16, 19 & 29.",
  };
}
