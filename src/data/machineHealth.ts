import { jitter } from "@/lib/useLiveData";
import type { DonutSlice, Kpi, RankedBar } from "@/types/dashboard";

export interface MachineRow {
  id: string;
  machineId: string;
  line: string;
  model: string;
  status: "Running" | "Idle" | "Breakdown" | "Maintenance";
  healthScore: number | null;
  runningHours: number;
  stitchCount: number;
  needleCount: number;
  needleMax: number;
  vibration: number | null;
  temp: number | null;
  lastService: string;
  rulDays: number | null;
}

export interface AlertRow {
  id: string;
  machine: string;
  message: string;
  time: string;
  severity: "bad" | "warn";
}

export interface MachineHealthData {
  kpis: Kpi[];
  utilization: DonutSlice[];
  oee: { availability: number; performance: number; quality: number; oee: number };
  ageProfile: RankedBar[];
  machines: MachineRow[];
  alerts: AlertRow[];
  healthBreakdown: DonutSlice[];
  healthTrend: { x: string; y: number }[];
  breakdownTrend: { x: string; y: number }[];
  rulDistribution: RankedBar[];
  downtimeReasons: RankedBar[];
  insights: string[];
  lowHealthCount: number;
}

const DAYS = ["23 May", "24 May", "25 May", "26 May", "27 May", "28 May", "29 May"];

export function generateMachineHealthData(): MachineHealthData {
  const running = Math.round(jitter(912, 3, 0));
  const total = 980;
  const availability = jitter(96.4, 0.2, 1);

  return {
    kpis: [
      { label: "Total Machines", value: `${total}`, caption: "All Lines Combined", icon: "cpu", color: "blue" },
      { label: "Running", value: `${running}`, caption: `${((running / total) * 100).toFixed(2)}%`, icon: "playCircle", color: "green" },
      { label: "Idle", value: "38", caption: "3.88%", icon: "pauseCircle", color: "orange" },
      { label: "Breakdown", value: "17", caption: "1.73%", icon: "wrench", color: "red" },
      { label: "Maintenance", value: "13", caption: "1.33%", icon: "settings", color: "purple" },
      { label: "Overall Availability", value: `${availability}%`, caption: "Target ≥ 95%", icon: "heartPulse", color: "teal" },
    ],
    utilization: [
      { label: "Running", value: 912, color: "#16a34a" },
      { label: "Idle", value: 38, color: "#f59e0b" },
      { label: "Breakdown", value: 17, color: "#dc2626" },
      { label: "Maintenance", value: 13, color: "#7c3aed" },
    ],
    oee: { availability: 96.4, performance: 88.7, quality: 96.8, oee: 82.7 },
    ageProfile: [
      { label: "0 - 1 Year", value: 120 },
      { label: "1 - 3 Year", value: 260 },
      { label: "3 - 5 Year", value: 340 },
      { label: "5 - 10 Year", value: 200 },
      { label: "Above 10 Year", value: 60 },
    ],
    machines: [
      { id: "m1", machineId: "MC-0001", line: "Line 01", model: "JUKI DDL-8700", status: "Running", healthScore: 96, runningHours: 1250, stitchCount: 125400, needleCount: 3200, needleMax: 5000, vibration: 1.2, temp: 38, lastService: "20 May 25", rulDays: 18 },
      { id: "m2", machineId: "MC-0002", line: "Line 01", model: "JUKI DDL-8700", status: "Running", healthScore: 92, runningHours: 980, stitchCount: 98750, needleCount: 2800, needleMax: 5000, vibration: 1.6, temp: 41, lastService: "18 May 25", rulDays: 12 },
      { id: "m3", machineId: "MC-0003", line: "Line 02", model: "JACK A4F", status: "Running", healthScore: 88, runningHours: 1450, stitchCount: 145300, needleCount: 4200, needleMax: 5000, vibration: 2.8, temp: 46, lastService: "15 May 25", rulDays: 7 },
      { id: "m4", machineId: "MC-0004", line: "Line 02", model: "JACK A4F", status: "Idle", healthScore: 75, runningHours: 320, stitchCount: 32400, needleCount: 1900, needleMax: 5000, vibration: 2.1, temp: 44, lastService: "10 May 25", rulDays: 5 },
      { id: "m5", machineId: "MC-0005", line: "Line 03", model: "BROTHER S-7200", status: "Breakdown", healthScore: 32, runningHours: 650, stitchCount: 56200, needleCount: 2100, needleMax: 5000, vibration: 6.5, temp: 67, lastService: "05 May 25", rulDays: 0 },
      { id: "m6", machineId: "MC-0006", line: "Line 03", model: "BROTHER S-7200", status: "Running", healthScore: 90, runningHours: 1120, stitchCount: 112600, needleCount: 3100, needleMax: 5000, vibration: 1.9, temp: 40, lastService: "12 May 25", rulDays: 10 },
      { id: "m7", machineId: "MC-0007", line: "Line 04", model: "PEGASUS W500", status: "Maintenance", healthScore: null, runningHours: 0, stitchCount: 0, needleCount: 0, needleMax: 5000, vibration: null, temp: null, lastService: "29 May 25", rulDays: null },
      { id: "m8", machineId: "MC-0008", line: "Line 04", model: "PEGASUS W500", status: "Running", healthScore: 95, runningHours: 980, stitchCount: 97300, needleCount: 2900, needleMax: 5000, vibration: 1.3, temp: 39, lastService: "19 May 25", rulDays: 15 },
    ],
    alerts: [
      { id: "a1", machine: "MC-0005", message: "Vibration High (6.5 mm/s)", time: "10:28 AM", severity: "bad" },
      { id: "a2", machine: "MC-0005", message: "Temperature High (67°C)", time: "10:28 AM", severity: "bad" },
      { id: "a3", machine: "MC-0003", message: "RUL Less than 7 Days", time: "10:20 AM", severity: "warn" },
      { id: "a4", machine: "MC-0004", message: "Oil Level Low", time: "10:15 AM", severity: "warn" },
      { id: "a5", machine: "MC-0002", message: "Needle Life Low (56%)", time: "10:10 AM", severity: "warn" },
    ],
    healthBreakdown: [
      { label: "Excellent (90-100%)", value: 312, color: "#16a34a" },
      { label: "Good (75-89%)", value: 428, color: "#1e56c9" },
      { label: "Average (50-74%)", value: 168, color: "#f59e0b" },
      { label: "Poor (<50%)", value: 72, color: "#dc2626" },
    ],
    healthTrend: [68, 65, 72, 70, 74, 71, 76].map((y, i) => ({ x: DAYS[i], y })),
    breakdownTrend: [15, 14, 13, 15, 12, 9, 17].map((y, i) => ({ x: DAYS[i], y })),
    rulDistribution: [
      { label: "< 7 Days", value: 120 },
      { label: "7 - 15 Days", value: 160 },
      { label: "15 - 30 Days", value: 280 },
      { label: "> 30 Days", value: 420 },
    ],
    downtimeReasons: [
      { label: "Needle Breakage", value: 3.2 },
      { label: "Thread Jam", value: 2.1 },
      { label: "Motor Overload", value: 1.8 },
      { label: "Oil Leakage", value: 1.2 },
      { label: "Belt / Pulley Issue", value: 0.9 },
    ],
    insights: [
      "17 machines are down. Immediate attention required.",
      "Average health score dropped by 3% vs yesterday.",
      "Line 03 has highest breakdown machines (7).",
      "Schedule preventive maintenance on 32 machines.",
    ],
    lowHealthCount: 24,
  };
}
