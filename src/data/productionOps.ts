import { jitter } from "@/lib/useLiveData";
import type { DonutSlice, Kpi, RankedBar, TrendPoint } from "@/types/dashboard";

const DAYS = ["23 May", "24 May", "26 May", "27 May", "28 May", "29 May"];
const HOURS = ["12 AM", "04 AM", "08 AM", "12 PM", "04 PM", "08 PM", "11 PM"];
const CUM_DAYS = ["1 Apr", "8 Apr", "15 Apr", "22 Apr", "29 Apr", "6 May", "13 May", "20 May", "29 May"];

export interface ProductionRow {
  id: string;
  unit: string;
  product: string;
  grade: string;
  target: number | null;
  actual: number | null;
  achievement: number | null;
  oee: number;
  status: "Good" | "Average" | "Critical";
  vsYesterday: number;
}

export interface ProductionOpsData {
  kpis: Kpi[];
  byPlant: DonutSlice[];
  mix: DonutSlice[];
  summary: ProductionRow[];
  oeeBreakdown: { availability: number; performance: number; quality: number };
  downtimeSummary: DonutSlice[];
  downtimeTotalHrs: number;
  topDowntimeReasons: RankedBar[];
  targetAchievement: number;
  productionTrend: { x: string; target: number; actual: number }[];
  hourlyProduction: TrendPoint[];
  cumulativeProduction: { x: string; target: number; actual: number }[];
  oeeTrend: TrendPoint[];
  oeeByUnit: RankedBar[];
  downtimeTrend: TrendPoint[];
  planVsActual: { planned: number; actual: number; achievementPct: number };
  insights: string[];
}

export function generateProductionOpsData(): ProductionOpsData {
  const totalProduction = Math.round(jitter(458760, 400, 0));
  const oee = jitter(78.6, 0.3, 1);

  return {
    kpis: [
      { label: "Total Production (MTD)", value: `${totalProduction.toLocaleString()} MT`, delta: "12.6%", direction: "up", sentiment: "good", icon: "trendingUp", color: "blue" },
      { label: "Production Today (MT)", value: "15,820 MT", delta: "8.7%", direction: "up", sentiment: "good", icon: "gauge", color: "green" },
      { label: "Production Target (MT)", value: "16,500 MT", caption: "95.9% Achievement", icon: "target", color: "purple" },
      { label: "Overall OEE", value: `${oee}%`, delta: "4.3%", direction: "up", sentiment: "good", icon: "percent", color: "orange" },
      { label: "Planned Downtime (Hrs)", value: "24.5 Hrs", delta: "8.1%", direction: "up", sentiment: "bad", icon: "clock", color: "teal" },
      { label: "Unplanned Downtime (Hrs)", value: "5.6 Hrs", delta: "11.4%", direction: "down", sentiment: "good", icon: "alertTriangle", color: "red" },
    ],
    byPlant: [
      { label: "Blast Furnace", value: 168450, color: "#1e56c9" },
      { label: "SMS", value: 125380, color: "#16a34a" },
      { label: "Rolling Mill", value: 98560, color: "#f59e0b" },
      { label: "Other Units", value: 66370, color: "#7c3aed" },
    ],
    mix: [
      { label: "Hot Metal", value: 168450, color: "#1e56c9" },
      { label: "Steel", value: 210760, color: "#16a34a" },
      { label: "Finished Products", value: 79550, color: "#f59e0b" },
    ],
    summary: [
      { id: "u1", unit: "Blast Furnace", product: "Hot Metal", grade: "HM", target: 175000, actual: 168450, achievement: 96.2, oee: 82.4, status: "Good", vsYesterday: 7.2 },
      { id: "u2", unit: "SMS", product: "Steel", grade: "Liquid Steel", target: 220000, actual: 210760, achievement: 95.8, oee: 76.1, status: "Good", vsYesterday: 6.8 },
      { id: "u3", unit: "CCM", product: "Slab", grade: "-", target: 210000, actual: 202340, achievement: 96.4, oee: 79.3, status: "Good", vsYesterday: 5.9 },
      { id: "u4", unit: "Rolling Mill", product: "HR Coil", grade: "SA-516", target: 105000, actual: 98560, achievement: 93.9, oee: 73.8, status: "Average", vsYesterday: -1.8 },
      { id: "u5", unit: "CRM", product: "CR Coil", grade: "CRCA", target: 65000, actual: 61230, achievement: 94.2, oee: 72.6, status: "Average", vsYesterday: 2.3 },
      { id: "u6", unit: "Utilities", product: "Power", grade: "-", target: null, actual: null, achievement: null, oee: 85.7, status: "Good", vsYesterday: 1.6 },
    ],
    oeeBreakdown: { availability: 84.1, performance: 81.3, quality: 91.1 },
    downtimeSummary: [
      { label: "Planned Maintenance", value: 24.5, color: "#1e56c9" },
      { label: "Breakdown", value: 2.8, color: "#dc2626" },
      { label: "Setup & Changeover", value: 1.4, color: "#f59e0b" },
      { label: "Others", value: 1.4, color: "#7c3aed" },
    ],
    downtimeTotalHrs: 30.1,
    topDowntimeReasons: [
      { label: "Equipment Breakdown", value: 2.2 },
      { label: "Roll Change / Setup", value: 1.3 },
      { label: "Utilities Failure", value: 0.8 },
      { label: "Material Shortage", value: 0.6 },
      { label: "Others", value: 0.7 },
    ],
    targetAchievement: 95.9,
    productionTrend: [16200, 15600, 16800, 15200, 17100, 15820].map((actual, i) => ({ x: DAYS[i], target: 16500, actual })),
    hourlyProduction: [1120, 980, 1500, 1820, 1950, 1780, 1670].map((y, i) => ({ x: HOURS[i], y })),
    cumulativeProduction: [0, 62000, 128000, 195000, 258000, 320000, 385000, 422000, 458760].map((actual, i) => ({
      x: CUM_DAYS[i],
      target: Math.round((478200 / 8) * i),
      actual,
    })),
    oeeTrend: [74.2, 75.6, 76.1, 77.3, 78.0, 78.8, 78.6].map((y, i) => ({ x: ["23 May", "24 May", "25 May", "26 May", "27 May", "28 May", "29 May"][i], y })),
    oeeByUnit: [
      { label: "Blast Furnace", value: 82.4 },
      { label: "SMS", value: 76.1 },
      { label: "CCM", value: 79.3 },
      { label: "Rolling Mill", value: 73.8 },
      { label: "CRM", value: 72.6 },
    ],
    downtimeTrend: [5.8, 7.2, 4.5, 6.8, 5.2, 6.4, 5.6].map((y, i) => ({ x: ["23 May", "24 May", "25 May", "26 May", "27 May", "28 May", "29 May"][i], y })),
    planVsActual: { planned: 478200, actual: 458760, achievementPct: 95.9 },
    insights: [
      "Production today is 8.7% higher than yesterday.",
      "SMS shop achieved highest production.",
      "Unplanned downtime reduced by 11.4% vs yesterday.",
      "Focus on Rolling Mill OEE improvement.",
      "Material availability improved overall production.",
    ],
  };
}
