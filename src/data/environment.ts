import { jitter } from "@/lib/useLiveData";
import type { DonutSlice, Kpi, TrendPoint } from "@/types/dashboard";

const MONTHS = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May"];

export interface EnvParamRow {
  id: string;
  parameter: string;
  location: string;
  unit: string;
  value: number;
  limit: string;
  status: "Good" | "Average" | "Critical";
  vsYesterday: number;
}

export interface EnvironmentData {
  kpis: Kpi[];
  emissionSummary: DonutSlice[];
  waterBreakdown: DonutSlice[];
  wasteBreakdown: DonutSlice[];
  co2Trend: TrendPoint[];
  parameters: EnvParamRow[];
  carbonFootprintTrend: { x: string; current: number; prior: number }[];
  renewableEnergy: DonutSlice[];
  waterTrend: TrendPoint[];
  wasteTrend: TrendPoint[];
  energyMix: DonutSlice[];
  energyTotal: string;
  insights: string[];
}

export function generateEnvironmentData(): EnvironmentData {
  const specificCo2 = jitter(1.82, 0.02, 2);

  return {
    kpis: [
      { label: "Total CO2 Emission (YTD)", value: "1,24,560 T", delta: "12.4%", direction: "down", sentiment: "good", icon: "cloud", color: "green" },
      { label: "Specific CO2 Emission", value: `${specificCo2} t/t`, delta: "10.6%", direction: "down", sentiment: "good", icon: "leaf", color: "green" },
      { label: "Water Consumption (YTD)", value: "1,24,850 KL", delta: "8.3%", direction: "up", sentiment: "bad", icon: "droplets", color: "blue" },
      { label: "Water Recirculation", value: "92.6%", delta: "4.5%", direction: "up", sentiment: "good", icon: "recycle", color: "blue" },
      { label: "Waste Generated (YTD)", value: "18,425 T", delta: "9.2%", direction: "up", sentiment: "bad", icon: "trash", color: "orange" },
      { label: "Waste Utilization", value: "95.3%", delta: "3.7%", direction: "up", sentiment: "good", icon: "recycle", color: "green" },
      { label: "Green Energy Usage", value: "28.6%", delta: "5.1%", direction: "up", sentiment: "good", icon: "sun", color: "orange" },
    ],
    emissionSummary: [
      { label: "BF & Sinter Plant", value: 52480, color: "#16a34a" },
      { label: "Power Plant", value: 31240, color: "#f59e0b" },
      { label: "SMS & Casting", value: 24150, color: "#7c3aed" },
      { label: "Others", value: 16690, color: "#1e56c9" },
    ],
    waterBreakdown: [
      { label: "Process", value: 58450, color: "#1e56c9" },
      { label: "Cooling", value: 42650, color: "#16a34a" },
      { label: "DM & Boiler", value: 15320, color: "#f59e0b" },
      { label: "Others", value: 8430, color: "#7c3aed" },
    ],
    wasteBreakdown: [
      { label: "Slag", value: 8250, color: "#16a34a" },
      { label: "Dust & Sludge", value: 5210, color: "#f59e0b" },
      { label: "Used Oil & Others", value: 2865, color: "#7c3aed" },
      { label: "Scrap & Residue", value: 2100, color: "#1e56c9" },
    ],
    co2Trend: [38000, 36500, 37200, 35800, 34900, 34200, 33500, 32800, 32100, 31500, 31000, 30600].map((y, i) => ({ x: MONTHS[i], y })),
    parameters: [
      { id: "p1", parameter: "Dust (PM)", location: "Sinter Plant Stack", unit: "mg/Nm³", value: 18.6, limit: "≤ 30", status: "Good", vsYesterday: -8.2 },
      { id: "p2", parameter: "SO2", location: "CPP Stack", unit: "ppm", value: 24.2, limit: "≤ 50", status: "Good", vsYesterday: -5.1 },
      { id: "p3", parameter: "NOx", location: "Power Plant Stack", unit: "ppm", value: 37.8, limit: "≤ 75", status: "Good", vsYesterday: -6.3 },
      { id: "p4", parameter: "CO", location: "BF Top Gas", unit: "ppm", value: 28.5, limit: "≤ 50", status: "Good", vsYesterday: -3.6 },
      { id: "p5", parameter: "pH (Water)", location: "ETP Inlet", unit: "-", value: 7.23, limit: "6.5 - 8.5", status: "Good", vsYesterday: 0.8 },
      { id: "p6", parameter: "COD", location: "ETP Outlet", unit: "mg/L", value: 42, limit: "≤ 250", status: "Good", vsYesterday: -12.4 },
      { id: "p7", parameter: "TSS", location: "ETP Outlet", unit: "mg/L", value: 18, limit: "≤ 100", status: "Good", vsYesterday: -9.5 },
      { id: "p8", parameter: "Oil & Grease", location: "ETP Outlet", unit: "mg/L", value: 2.1, limit: "≤ 10", status: "Good", vsYesterday: -11.2 },
    ],
    carbonFootprintTrend: [1.98, 1.95, 1.92, 1.90, 1.88, 1.87, 1.86, 1.85, 1.84, 1.83, 1.82, specificCo2].map((current, i) => ({
      x: MONTHS[i],
      current,
      prior: 2.1 - i * 0.01,
    })),
    renewableEnergy: [
      { label: "Solar Power", value: 18.4, color: "#f59e0b" },
      { label: "WHRB Power", value: 7.6, color: "#1e56c9" },
      { label: "Others", value: 2.6, color: "#7c3aed" },
    ],
    waterTrend: [128000, 127200, 126800, 126100, 125700, 125200, 124950, 124700, 124600, 124800, 124900, 124850].map((y, i) => ({ x: MONTHS[i], y })),
    wasteTrend: [3200, 3450, 3100, 3600, 3300, 3800, 3500, 3200, 3400, 3600, 3300, 3450].map((y, i) => ({ x: MONTHS[i], y })),
    energyMix: [
      { label: "Coal & Coke", value: 58.6, color: "#334155" },
      { label: "WHRB Power", value: 18.7, color: "#1e56c9" },
      { label: "Purchased Power", value: 14.1, color: "#f59e0b" },
      { label: "Solar & Others", value: 8.6, color: "#16a34a" },
    ],
    energyTotal: "1.24 M GJ",
    insights: [
      "Specific CO2 emission improved by 10.6% vs LYTD.",
      "Water recirculation increased by 4.5% vs LYTD.",
      "Waste utilization at 95.3% (above target 90%).",
      "Green energy usage improved to 28.6%.",
      "All critical parameters are within permissible limits.",
    ],
  };
}
