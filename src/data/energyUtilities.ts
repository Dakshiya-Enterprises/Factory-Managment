import { jitter } from "@/lib/useLiveData";
import type { DonutSlice, Kpi, RankedBar, TrendPoint } from "@/types/dashboard";

const MONTHS_6 = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"];
const MONTHS_12 = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May"];
const DAYS = ["23 May", "24 May", "26 May", "27 May", "28 May", "29 May"];
const HOURS = ["00", "04", "08", "12", "16", "20", "24"];

export interface UtilityRow {
  id: string;
  utility: string;
  unit: string;
  today: number;
  yesterday: number;
  mtd: number;
  lyMtd: number;
  mtdVariance: number;
  ytd: number;
  lytd: number;
  ytdVariance: number;
  status: "Good" | "Average" | "Critical";
}

export interface SavingsOpportunity {
  id: string;
  opportunity: string;
  area: string;
  potentialMwh: number;
  potentialCr: number;
  status: "In Progress" | "Identified" | "Approved" | "Completed";
}

export interface AlertItem {
  id: string;
  text: string;
  tone: "bad" | "warn" | "info" | "good";
}

export interface EnergyUtilitiesData {
  kpis: Kpi[];
  energyMix: DonutSlice[];
  energyTotalMwh: string;
  costBreakdown: DonutSlice[];
  costTotalCr: string;
  utilities: UtilityRow[];
  energyCostTrend: { x: string; costCr: number; costPerTon: number }[];
  topConsumingAreas: RankedBar[];
  specificEnergyTrend: { x: string; current: number; prior: number }[];
  dailyConsumption: TrendPoint[];
  costTrend12mo: TrendPoint[];
  savingsMwh: number;
  savingsCr: number;
  performanceVsTarget: number;
  plantWiseSpecificEnergy: RankedBar[];
  alerts: AlertItem[];
  savingsOpportunities: SavingsOpportunity[];
  insights: string[];
}

export function generateEnergyUtilitiesData(): EnergyUtilitiesData {
  const specificEnergy = Math.round(jitter(524, 3, 0));

  return {
    kpis: [
      { label: "Total Energy (YTD)", value: "1,24,560 MWh", delta: "6.4%", direction: "down", sentiment: "good", icon: "zap", color: "blue" },
      { label: "Energy Cost (YTD)", value: "₹ 12.48 Cr", delta: "7.2%", direction: "down", sentiment: "good", icon: "wallet", color: "green" },
      { label: "Specific Energy (YTD)", value: `${specificEnergy} kWh/t`, delta: "5.8%", direction: "down", sentiment: "good", icon: "gauge", color: "orange" },
      { label: "Water Consumption (YTD)", value: "1,24,850 KL", delta: "8.3%", direction: "down", sentiment: "good", icon: "droplets", color: "purple" },
      { label: "Steam Consumption (YTD)", value: "2,45,310 MT", delta: "6.1%", direction: "down", sentiment: "good", icon: "wind", color: "teal" },
      { label: "Fuel Consumption (YTD)", value: "18,450 MT", delta: "7.0%", direction: "down", sentiment: "good", icon: "flame", color: "red" },
      { label: "Utilization Index (YTD)", value: "91.2%", delta: "4.6%", direction: "up", sentiment: "good", icon: "target", color: "teal" },
    ],
    energyMix: [
      { label: "Power (Grid)", value: 62.1, color: "#1e56c9" },
      { label: "Captive Power", value: 21.8, color: "#16a34a" },
      { label: "Gas", value: 11.4, color: "#f59e0b" },
      { label: "Others", value: 4.7, color: "#7c3aed" },
    ],
    energyTotalMwh: "1,24,560",
    costBreakdown: [
      { label: "Power", value: 8.12, color: "#1e56c9" },
      { label: "Fuel", value: 2.65, color: "#16a34a" },
      { label: "Water", value: 1.05, color: "#f59e0b" },
      { label: "Others", value: 0.66, color: "#7c3aed" },
    ],
    costTotalCr: "12.48",
    utilities: [
      { id: "e1", utility: "Electrical Energy", unit: "MWh", today: 4850, yesterday: 4620, mtd: 124560, lyMtd: 132980, mtdVariance: -6.3, ytd: 124560, lytd: 133110, ytdVariance: -6.4, status: "Good" },
      { id: "e2", utility: "Steam", unit: "MT", today: 8420, yesterday: 7980, mtd: 245310, lyMtd: 261200, mtdVariance: -6.1, ytd: 245310, lytd: 261350, ytdVariance: -6.1, status: "Good" },
      { id: "e3", utility: "Water", unit: "KL", today: 5120, yesterday: 4980, mtd: 124850, lyMtd: 136150, mtdVariance: -8.3, ytd: 124850, lytd: 136450, ytdVariance: -8.5, status: "Good" },
      { id: "e4", utility: "Natural Gas", unit: "MT", today: 630, yesterday: 612, mtd: 18450, lyMtd: 19830, mtdVariance: -7.0, ytd: 18450, lytd: 19980, ytdVariance: -7.7, status: "Good" },
      { id: "e5", utility: "Compressed Air", unit: "Nm³", today: 185000, yesterday: 178000, mtd: 5245000, lyMtd: 5490000, mtdVariance: -4.5, ytd: 5245000, lytd: 5510000, ytdVariance: -4.8, status: "Good" },
      { id: "e6", utility: "Oxygen", unit: "Nm³", today: 2150, yesterday: 2020, mtd: 59850, lyMtd: 61700, mtdVariance: -3.0, ytd: 59850, lytd: 61850, ytdVariance: -3.2, status: "Good" },
      { id: "e7", utility: "LPG / Fuel Oil", unit: "KL", today: 120, yesterday: 115, mtd: 3250, lyMtd: 3480, mtdVariance: -6.6, ytd: 3250, lytd: 3520, ytdVariance: -7.7, status: "Good" },
    ],
    energyCostTrend: [13.2, 14.8, 13.6, 15.1, 14.2, 13.9].map((costCr, i) => ({ x: MONTHS_6[i], costCr, costPerTon: [520, 545, 528, 552, 535, 524][i] })),
    topConsumingAreas: [
      { label: "Blast Furnace", value: 32.5 },
      { label: "SMS", value: 21.7 },
      { label: "Rolling Mill", value: 15.8 },
      { label: "Utilities", value: 12.6 },
      { label: "Others", value: 17.4 },
    ],
    specificEnergyTrend: [540, 532, 528, 535, 526, specificEnergy].map((current, i) => ({ x: DAYS[i], current, prior: [510, 505, 515, 508, 512, 500][i] })),
    dailyConsumption: [2100, 2400, 3600, 5200, 5800, 5100, 3200].map((y, i) => ({ x: HOURS[i], y })),
    costTrend12mo: [12.5, 12.8, 13.1, 12.9, 13.4, 13.2, 14.8, 13.6, 15.1, 14.2, 13.9, 12.48].map((y, i) => ({ x: MONTHS_12[i], y })),
    savingsMwh: 8450,
    savingsCr: 0.92,
    performanceVsTarget: 95.2,
    plantWiseSpecificEnergy: [
      { label: "BF", value: 562 },
      { label: "SMS", value: 518 },
      { label: "RM", value: 501 },
      { label: "CRM", value: 489 },
      { label: "Others", value: 476 },
    ],
    alerts: [
      { id: "a1", text: "High steam consumption in SMS Shop (+8.5% vs target)", tone: "bad" },
      { id: "a2", text: "Compressed air leakage detected in Rolling Mill Area", tone: "warn" },
      { id: "a3", text: "Water consumption higher in CPP Cooling Tower", tone: "info" },
      { id: "a4", text: "Energy data reconciled successfully for all plants", tone: "good" },
    ],
    savingsOpportunities: [
      { id: "s1", opportunity: "VFD installation in ID Fans", area: "Blast Furnace", potentialMwh: 1250, potentialCr: 0.14, status: "In Progress" },
      { id: "s2", opportunity: "WHRB optimization", area: "Power Plant", potentialMwh: 2100, potentialCr: 0.22, status: "Identified" },
      { id: "s3", opportunity: "LED lighting upgrade", area: "Utilities", potentialMwh: 450, potentialCr: 0.04, status: "In Progress" },
      { id: "s4", opportunity: "Compressed air system optimization", area: "Rolling Mill", potentialMwh: 1800, potentialCr: 0.18, status: "Approved" },
    ],
    insights: [
      "Specific energy improved by 5.8% compared to last year.",
      "Energy cost reduced by 7.2% vs LYTD.",
      "Steam & water consumption needs continuous monitoring.",
      "Focus on energy efficiency projects for higher savings.",
    ],
  };
}
