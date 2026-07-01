import { jitter } from "@/lib/useLiveData";
import type { DonutSlice, Kpi, RankedBar, TrendPoint } from "@/types/dashboard";

const MONTHS = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May"];

export interface MaintenanceRow {
  id: string;
  area: string;
  totalAssets: number;
  pmPlan: number;
  pmCompleted: number;
  pmCompliance: number;
  breakdowns: number;
  mttr: number;
  mtbf: number;
  costCr: number;
  status: "Good" | "Average" | "Critical";
}

export interface ShutdownRow {
  id: string;
  shutdown: string;
  area: string;
  start: string;
  end: string;
  status: "Completed" | "Planned" | "In Progress";
  progress: number;
}

export interface MaintenanceData {
  kpis: Kpi[];
  costBreakdown: DonutSlice[];
  costTotalCr: number;
  workOrderStatus: DonutSlice[];
  breakdownsByCategory: DonutSlice[];
  topBreakdownAssets: RankedBar[];
  summary: MaintenanceRow[];
  pmComplianceTrend: TrendPoint[];
  mttrTrend: TrendPoint[];
  mtbfTrend: TrendPoint[];
  costTrend: TrendPoint[];
  assetAvailability: number;
  scheduledVsUnscheduled: DonutSlice[];
  shutdowns: ShutdownRow[];
  sparesConsumption: DonutSlice[];
  criticalAssetHealth: { good: number; monitor: number; critical: number };
  insights: string[];
}

export function generateMaintenanceData(): MaintenanceData {
  const mttr = jitter(4.32, 0.08, 2);
  const mtbf = jitter(182.6, 1.5, 1);
  const breakdowns = 356;
  const assetAvailability = jitter(94.7, 0.15, 1);

  return {
    kpis: [
      { label: "MTTR (YTD)", value: `${mttr} Hrs`, delta: "12.6%", direction: "down", sentiment: "good", icon: "wrench", color: "blue" },
      { label: "MTBF (YTD)", value: `${mtbf} Hrs`, delta: "18.4%", direction: "up", sentiment: "good", icon: "clock", color: "green" },
      { label: "PM Compliance (YTD)", value: "91.6%", delta: "7.8%", direction: "up", sentiment: "good", icon: "calendar", color: "orange" },
      { label: "Breakdowns (YTD)", value: `${breakdowns}`, delta: "9.1%", direction: "down", sentiment: "good", icon: "clipboard", color: "purple" },
      { label: "Maintenance Cost (YTD)", value: "₹ 18.65 Cr", delta: "6.7%", direction: "up", sentiment: "bad", icon: "rupee", color: "red" },
      { label: "Asset Availability (YTD)", value: `${assetAvailability}%`, delta: "4.5%", direction: "up", sentiment: "good", icon: "gauge", color: "teal" },
    ],
    costTotalCr: 18.65,
    costBreakdown: [
      { label: "Corrective Maintenance", value: 8.62, color: "#1e56c9" },
      { label: "Preventive Maintenance", value: 5.19, color: "#16a34a" },
      { label: "Shutdown / Turnaround", value: 2.91, color: "#f59e0b" },
      { label: "Others", value: 1.93, color: "#7c3aed" },
    ],
    workOrderStatus: [
      { label: "Completed", value: 4102, color: "#16a34a" },
      { label: "In Progress", value: 986, color: "#f59e0b" },
      { label: "Pending", value: 512, color: "#dc2626" },
      { label: "Cancelled", value: 242, color: "#7c3aed" },
    ],
    breakdownsByCategory: [
      { label: "Mechanical", value: 124, color: "#1e56c9" },
      { label: "Electrical", value: 92, color: "#16a34a" },
      { label: "Instrumentation", value: 68, color: "#f59e0b" },
      { label: "Hydraulic", value: 42, color: "#7c3aed" },
      { label: "Others", value: 30, color: "#0d9488" },
    ],
    topBreakdownAssets: [
      { label: "ID Fan - 3 (BF)", value: 18 },
      { label: "Roller Table Drive (CCM)", value: 15 },
      { label: "Hydraulic Power Pack (RM)", value: 14 },
      { label: "Gear Box - 2 (SMS)", value: 12 },
      { label: "Ladle Turret (RM)", value: 11 },
    ],
    summary: [
      { id: "bf", area: "Blast Furnace", totalAssets: 1245, pmPlan: 1102, pmCompleted: 1028, pmCompliance: 93.3, breakdowns: 28, mttr: 5.12, mtbf: 210.5, costCr: 3.45, status: "Good" },
      { id: "sms", area: "SMS", totalAssets: 980, pmPlan: 870, pmCompleted: 792, pmCompliance: 91.0, breakdowns: 35, mttr: 4.28, mtbf: 178.6, costCr: 2.95, status: "Good" },
      { id: "ccm", area: "CCM", totalAssets: 612, pmPlan: 520, pmCompleted: 478, pmCompliance: 91.9, breakdowns: 22, mttr: 3.95, mtbf: 195.4, costCr: 1.85, status: "Good" },
      { id: "rm", area: "Rolling Mill", totalAssets: 1134, pmPlan: 1020, pmCompleted: 905, pmCompliance: 88.7, breakdowns: 48, mttr: 5.68, mtbf: 162.3, costCr: 3.80, status: "Average" },
      { id: "crm", area: "CRM", totalAssets: 845, pmPlan: 740, pmCompleted: 695, pmCompliance: 93.9, breakdowns: 27, mttr: 4.15, mtbf: 186.7, costCr: 2.10, status: "Good" },
      { id: "util", area: "Utilities", totalAssets: 1256, pmPlan: 1145, pmCompleted: 1032, pmCompliance: 90.1, breakdowns: 64, mttr: 4.82, mtbf: 171.2, costCr: 2.75, status: "Average" },
      { id: "oth", area: "Others", totalAssets: 548, pmPlan: 480, pmCompleted: 420, pmCompliance: 87.5, breakdowns: 32, mttr: 5.94, mtbf: 148.6, costCr: 1.75, status: "Average" },
    ],
    pmComplianceTrend: [78, 76, 84, 71, 80, 83, 77, 85, 87, 89, 90, 91.6].map((y, i) => ({ x: MONTHS[i], y })),
    mttrTrend: [5.4, 5.1, 5.6, 4.9, 5.2, 4.7, 5.0, 4.6, 4.5, 4.4, 4.35, mttr].map((y, i) => ({ x: MONTHS[i], y })),
    mtbfTrend: [155, 162, 148, 170, 165, 175, 168, 178, 180, 176, 185, mtbf].map((y, i) => ({ x: MONTHS[i], y })),
    costTrend: [2.1, 1.8, 2.4, 1.6, 2.0, 1.5, 1.9, 1.4, 1.6, 1.5, 1.5, 1.35].map((y, i) => ({ x: MONTHS[i], y })),
    assetAvailability,
    scheduledVsUnscheduled: [
      { label: "Scheduled", value: 198, color: "#16a34a" },
      { label: "Unscheduled", value: 158, color: "#dc2626" },
    ],
    shutdowns: [
      { id: "s1", shutdown: "BF Relining - Stave Change", area: "Blast Furnace", start: "05 Apr 25", end: "18 Apr 25", status: "Completed", progress: 100 },
      { id: "s2", shutdown: "SMS Annual Shutdown", area: "SMS", start: "10 May 25", end: "20 May 25", status: "Completed", progress: 100 },
      { id: "s3", shutdown: "RM Gear Box Overhaul", area: "Rolling Mill", start: "01 Jun 25", end: "08 Jun 25", status: "Planned", progress: 45 },
      { id: "s4", shutdown: "Power Plant Boiler Inspection", area: "Utilities", start: "15 Jun 25", end: "22 Jun 25", status: "Planned", progress: 20 },
    ],
    sparesConsumption: [
      { label: "Mechanical Spares", value: 6.48, color: "#1e56c9" },
      { label: "Electrical Spares", value: 5.12, color: "#16a34a" },
      { label: "Instrumentation Spares", value: 3.68, color: "#f59e0b" },
      { label: "Others", value: 3.37, color: "#7c3aed" },
    ],
    criticalAssetHealth: { good: 132, monitor: 48, critical: 14 },
    insights: [
      "MTBF improved by 18.4% compared to last year.",
      "PM Compliance at 91.6%. Focus on Rolling Mill & Utilities.",
      "58% breakdowns are unscheduled. Reduce repeat failures.",
      "Overall Asset Availability is 94.7% against target of 92%.",
    ],
  };
}
