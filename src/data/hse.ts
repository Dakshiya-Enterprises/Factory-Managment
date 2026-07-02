import { jitter } from "@/lib/useLiveData";
import type { DonutSlice, Kpi, RankedBar } from "@/types/dashboard";

const MONTHS = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May"];
const RECENT_MONTHS = ["Dec", "Jan", "Feb", "Mar", "Apr", "May"];

export interface PlantHseRow {
  id: string;
  plant: string;
  manHours: string;
  ltifr: number;
  trifr: number;
  incidents: number;
  nearMiss: number;
  observations: number;
  sifEvents: number;
  status: "Good" | "Average" | "Critical";
}

export interface RiskControlRow {
  id: string;
  category: string;
  totalControls: number;
  effective: number;
  effectivePct: number;
  partial: number;
  partialPct: number;
  ineffective: number;
  ineffectivePct: number;
  status: "Good" | "Average" | "Critical";
}

export interface HseData {
  kpis: Kpi[];
  incidentBreakdown: DonutSlice[];
  plants: PlantHseRow[];
  hseIndex: number;
  incidentTrend: { x: string; current: number; prior: number }[];
  nearMissTrend: { x: string; y: number }[];
  topLocations: RankedBar[];
  safetyTraining: { completed: number; planned: number; pending: number; pct: number };
  behaviourSafety: { positive: number; atRisk: number; pct: number };
  permitCompliance: { issued: number; compliant: number; nonCompliant: number; pct: number };
  hazardReporting: DonutSlice[];
  topHazards: RankedBar[];
  riskControls: RiskControlRow[];
  insights: string[];
}

export function generateHseData(): HseData {
  const ltifr = jitter(0.28, 0.01, 2);
  const hseIndex = jitter(86.7, 0.2, 1);

  return {
    kpis: [
      { label: "LTIFR (YTD)", value: `${ltifr}`, delta: "20.0%", direction: "down", sentiment: "good", icon: "shieldCheck", color: "blue" },
      { label: "TRIFR (YTD)", value: "0.62", delta: "13.9%", direction: "down", sentiment: "good", icon: "clock", color: "green" },
      { label: "Total Incidents (YTD)", value: "48", delta: "15.8%", direction: "up", sentiment: "bad", icon: "alertTriangle", color: "orange" },
      { label: "Near Miss (YTD)", value: "152", delta: "22.6%", direction: "up", sentiment: "good", icon: "clipboardCheck", color: "purple" },
      { label: "Safety Observations (YTD)", value: "1,245", delta: "18.7%", direction: "up", sentiment: "good", icon: "heartPulse", color: "green" },
      { label: "First Aid Cases (YTD)", value: "36", delta: "21.7%", direction: "up", sentiment: "bad", icon: "flask", color: "red" },
      { label: "Man Hours (YTD)", value: "18.45 M", delta: "6.5%", direction: "up", sentiment: "good", icon: "users", color: "teal" },
    ],
    incidentBreakdown: [
      { label: "Lost Time Injury", value: 15, color: "#dc2626" },
      { label: "Medical Treatment", value: 12, color: "#f59e0b" },
      { label: "Restricted Work", value: 7, color: "#16a34a" },
      { label: "First Aid", value: 10, color: "#1e56c9" },
      { label: "Property Damage", value: 4, color: "#7c3aed" },
    ],
    plants: [
      { id: "p1", plant: "Blast Furnace", manHours: "2.85 M", ltifr: 0.21, trifr: 0.45, incidents: 6, nearMiss: 18, observations: 156, sifEvents: 0, status: "Good" },
      { id: "p2", plant: "SMS", manHours: "3.62 M", ltifr: 0.32, trifr: 0.68, incidents: 11, nearMiss: 32, observations: 218, sifEvents: 1, status: "Good" },
      { id: "p3", plant: "CCM", manHours: "2.15 M", ltifr: 0.18, trifr: 0.42, incidents: 5, nearMiss: 14, observations: 132, sifEvents: 0, status: "Good" },
      { id: "p4", plant: "Rolling Mill", manHours: "4.25 M", ltifr: 0.46, trifr: 0.92, incidents: 14, nearMiss: 38, observations: 286, sifEvents: 1, status: "Average" },
      { id: "p5", plant: "CRM", manHours: "1.78 M", ltifr: 0.17, trifr: 0.33, incidents: 3, nearMiss: 8, observations: 96, sifEvents: 0, status: "Good" },
      { id: "p6", plant: "Utilities", manHours: "2.28 M", ltifr: 0.19, trifr: 0.41, incidents: 6, nearMiss: 22, observations: 185, sifEvents: 0, status: "Good" },
      { id: "p7", plant: "Others", manHours: "1.52 M", ltifr: 0.24, trifr: 0.55, incidents: 3, nearMiss: 20, observations: 172, sifEvents: 0, status: "Good" },
    ],
    hseIndex,
    incidentTrend: [68, 72, 65, 78, 74, 70, 66, 62, 58, 55, 52, 48].map((current, i) => ({ x: MONTHS[i], current, prior: [60, 62, 58, 66, 64, 62, 60, 58, 56, 54, 53, 50][i] })),
    nearMissTrend: [42, 48, 45, 52, 49, 152].map((y, i) => ({ x: RECENT_MONTHS[i], y })),
    topLocations: [
      { label: "Rolling Mill", value: 12 },
      { label: "SMS", value: 9 },
      { label: "Blast Furnace", value: 8 },
      { label: "Utilities", value: 7 },
      { label: "CCM", value: 6 },
      { label: "Others", value: 6 },
    ],
    safetyTraining: { completed: 12456, planned: 13500, pending: 1044, pct: 92.3 },
    behaviourSafety: { positive: 3245, atRisk: 882, pct: 78.6 },
    permitCompliance: { issued: 24850, compliant: 23892, nonCompliant: 958, pct: 96.2 },
    hazardReporting: [
      { label: "Closed", value: 1056, color: "#16a34a" },
      { label: "Open", value: 189, color: "#dc2626" },
    ],
    topHazards: [
      { label: "Unsafe Acts", value: 312 },
      { label: "Mechanical", value: 256 },
      { label: "Electrical", value: 198 },
      { label: "Work at Height", value: 176 },
      { label: "Chemical", value: 142 },
    ],
    riskControls: [
      { id: "r1", category: "Fall Protection", totalControls: 248, effective: 220, effectivePct: 88.7, partial: 20, partialPct: 8.1, ineffective: 8, ineffectivePct: 3.2, status: "Good" },
      { id: "r2", category: "Energy Isolation (LOTO)", totalControls: 186, effective: 169, effectivePct: 90.9, partial: 12, partialPct: 6.5, ineffective: 5, ineffectivePct: 2.6, status: "Good" },
      { id: "r3", category: "Confined Space", totalControls: 132, effective: 116, effectivePct: 87.9, partial: 13, partialPct: 9.8, ineffective: 3, ineffectivePct: 2.3, status: "Good" },
      { id: "r4", category: "Hot Work", totalControls: 156, effective: 131, effectivePct: 84.0, partial: 18, partialPct: 11.5, ineffective: 7, ineffectivePct: 4.5, status: "Average" },
      { id: "r5", category: "Material Handling", totalControls: 198, effective: 165, effectivePct: 83.3, partial: 22, partialPct: 11.1, ineffective: 11, ineffectivePct: 5.6, status: "Average" },
    ],
    insights: [
      "LTIFR improved by 20.0% compared to last year.",
      "Near miss reporting increased by 22.6% — good safety culture.",
      "Rolling Mill shows higher incident rate — focus area.",
      "Permit compliance is excellent at 96.2%.",
      "Continue focus on critical risk control effectiveness.",
    ],
  };
}
