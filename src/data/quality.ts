import { jitter } from "@/lib/useLiveData";
import type { DonutSlice, Kpi, RankedBar, TrendPoint } from "@/types/dashboard";

const MONTHS = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May"];

export interface QualityRow {
  id: string;
  line: string;
  product: string;
  grade: string;
  production: number;
  inspected: number;
  fpy: number;
  rejectionMt: number;
  rejectionPct: number;
  cpk: number;
  qualityScore: number;
  status: "Good" | "Average" | "Critical";
}

export interface QualityData {
  kpis: Kpi[];
  qualityScoreTrend: TrendPoint[];
  rejectionBreakdown: DonutSlice[];
  rejectionTotalMt: number;
  inspectionSummary: QualityRow[];
  customerComplaints: DonutSlice[];
  topDefectTypes: RankedBar[];
  qualityCostCr: number;
  qualityCostDelta: string;
  costSplit: { label: string; valueCr: number; pct: number }[];
  fpyTrend: TrendPoint[];
  cpkTrend: TrendPoint[];
  rejectionTrend: TrendPoint[];
  insights: string[];
}

export function generateQualityData(): QualityData {
  const overallScore = jitter(89.4, 0.2, 1);
  const fpy = jitter(92.1, 0.2, 1);
  const cpk = jitter(1.45, 0.02, 2);

  return {
    kpis: [
      { label: "Overall Quality Score (YTD)", value: `${overallScore}%`, delta: "6.3%", direction: "up", sentiment: "good", icon: "badgeCheck", color: "purple" },
      { label: "First Pass Yield (YTD)", value: `${fpy}%`, delta: "4.8%", direction: "up", sentiment: "good", icon: "checkCircle", color: "green" },
      { label: "Total Rejections (YTD)", value: "2,458 MT", delta: "12.7%", direction: "up", sentiment: "bad", icon: "xCircle", color: "orange" },
      { label: "Customer Complaints (YTD)", value: "18", delta: "18.2%", direction: "down", sentiment: "good", icon: "flask", color: "blue" },
      { label: "Process Capability (Cpk)", value: `${cpk}`, delta: "9.0%", direction: "up", sentiment: "good", icon: "target", color: "red" },
      { label: "QC Inspections (YTD)", value: "45,632", delta: "11.5%", direction: "up", sentiment: "good", icon: "clipboardCheck", color: "teal" },
    ],
    qualityScoreTrend: [80, 78, 82, 76, 84, 83, 85, 87, 88, 90, 91, overallScore].map((y, i) => ({ x: MONTHS[i], y })),
    rejectionBreakdown: [
      { label: "Dimensional", value: 946, color: "#1e56c9" },
      { label: "Surface Defect", value: 678, color: "#16a34a" },
      { label: "Internal Defect", value: 460, color: "#f59e0b" },
      { label: "Chemical", value: 241, color: "#7c3aed" },
      { label: "Others", value: 133, color: "#0d9488" },
    ],
    rejectionTotalMt: 2458,
    inspectionSummary: [
      { id: "l1", line: "Line 01 - BF", product: "Hot Metal", grade: "HM-1", production: 128450, inspected: 127820, fpy: 94.2, rejectionMt: 4730, rejectionPct: 3.70, cpk: 1.52, qualityScore: 91.2, status: "Good" },
      { id: "l2", line: "Line 02 - SMS", product: "Billet", grade: "B-500", production: 95560, inspected: 94980, fpy: 91.5, rejectionMt: 8070, rejectionPct: 8.48, cpk: 1.38, qualityScore: 87.6, status: "Good" },
      { id: "l3", line: "Line 03 - CCM", product: "Slab", grade: "IS-2062", production: 142300, inspected: 141650, fpy: 93.1, rejectionMt: 5620, rejectionPct: 3.96, cpk: 1.41, qualityScore: 90.3, status: "Good" },
      { id: "l4", line: "Line 04 - Rolling", product: "HR Coil", grade: "SA-516", production: 110250, inspected: 109430, fpy: 90.3, rejectionMt: 10590, rejectionPct: 9.63, cpk: 1.25, qualityScore: 84.7, status: "Average" },
      { id: "l5", line: "Line 05 - CRM", product: "CR Coil", grade: "CRCA", production: 86750, inspected: 86120, fpy: 92.7, rejectionMt: 6380, rejectionPct: 7.40, cpk: 1.46, qualityScore: 88.9, status: "Good" },
      { id: "l6", line: "Line 06 - WRM", product: "Wire Rod", grade: "WR-5.5", production: 68890, inspected: 68210, fpy: 94.8, rejectionMt: 3650, rejectionPct: 5.31, cpk: 1.61, qualityScore: 92.1, status: "Good" },
      { id: "l7", line: "Line 07 - BRM", product: "Bar Rod", grade: "TMT-500", production: 74120, inspected: 73410, fpy: 91.2, rejectionMt: 6510, rejectionPct: 8.86, cpk: 1.33, qualityScore: 86.2, status: "Average" },
    ],
    customerComplaints: [
      { label: "Dimensional", value: 7, color: "#1e56c9" },
      { label: "Surface", value: 5, color: "#16a34a" },
      { label: "Mechanical", value: 3, color: "#f59e0b" },
      { label: "Packaging", value: 2, color: "#7c3aed" },
      { label: "Others", value: 1, color: "#0d9488" },
    ],
    topDefectTypes: [
      { label: "Surface Defect", value: 953 },
      { label: "Dimensional", value: 714 },
      { label: "Internal Defect", value: 482 },
      { label: "Chemical", value: 202 },
      { label: "Others", value: 107 },
    ],
    qualityCostCr: 3.62,
    qualityCostDelta: "8.6%",
    costSplit: [
      { label: "Internal Failure", valueCr: 1.85, pct: 51.1 },
      { label: "External Failure", valueCr: 1.12, pct: 31.0 },
      { label: "Appraisal Cost", valueCr: 0.65, pct: 17.9 },
    ],
    fpyTrend: [90, 91, 89, 93, 90, 92, 91, 93, 92, 94, 93, fpy].map((y, i) => ({ x: MONTHS[i], y })),
    cpkTrend: [1.4, 1.5, 1.35, 1.55, 1.42, 1.48, 1.44, 1.52, 1.46, 1.50, 1.55, cpk].map((y, i) => ({ x: MONTHS[i], y })),
    rejectionTrend: [6.2, 5.4, 6.8, 4.9, 5.6, 5.1, 5.8, 4.6, 5.0, 4.4, 4.2, 4.0].map((y, i) => ({ x: MONTHS[i], y })),
    insights: [
      "Overall Quality Score improved by 6.3% vs last year.",
      "Line 04 - Rolling has highest rejection %. Focus required.",
      "Customer complaints reduced by 18.2% vs LYTD.",
      "Maintain process capability above target (Cpk ≥ 1.33).",
      "Focus on surface and dimensional defects reduction.",
    ],
  };
}
