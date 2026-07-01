import { jitter } from "@/lib/useLiveData";
import type { DonutSlice, Kpi, RankedBar, TrendPoint } from "@/types/dashboard";

const DAYS = ["23 May", "24 May", "25 May", "26 May", "28 May", "29 May"];

export interface OperatorRow {
  id: string;
  empId: string;
  name: string;
  line: string;
  skill: string;
  efficiency: number;
  target: number;
  output: number;
  reject: number;
  attendance: "P" | "A";
  incentive: number;
  happiness: number;
  status: "Excellent" | "Good" | "Average" | "Needs Support";
}

export interface OperatorData {
  kpis: Kpi[];
  performanceList: OperatorRow[];
  happinessTotal: number;
  happinessBreakdown: { label: string; value: number; max: number }[];
  skillDistribution: DonutSlice[];
  topPerformers: { rank: number; name: string; line: string; efficiency: number }[];
  attendance: { present: number; absent: number; onLeave: number; halfDay: number; total: number };
  performanceTrend: { x: string; efficiency: number; target: number }[];
  efficiencyDistribution: RankedBar[];
  rejectRateByGroup: RankedBar[];
  incentiveToday: number;
  avgIncentive: number;
  operatorsEligible: number;
  insights: string[];
  smartInsight: string;
  trendTargetLine: number;
}

export function generateOperatorData(): OperatorData {
  const present = Math.round(jitter(1186, 4, 0));
  const total = 1248;
  const absent = total - present;
  const efficiency = jitter(82.6, 0.6, 1);
  const happiness = jitter(78.4, 0.3, 1);

  return {
    kpis: [
      { label: "Total Operators", value: total.toLocaleString(), caption: "Present Today", icon: "users", color: "purple" },
      { label: "Present", value: present.toLocaleString(), caption: `${((present / total) * 100).toFixed(2)}%`, icon: "userCheck", color: "green" },
      { label: "Absent", value: absent.toLocaleString(), caption: `${((absent / total) * 100).toFixed(2)}%`, icon: "userX", color: "red" },
      { label: "Avg Operator Efficiency", value: `${efficiency}%`, caption: "Target: 85%", icon: "trendingUp", color: "blue" },
      { label: "Top Performers", value: "178", caption: "14.3% of Total", icon: "star", color: "orange" },
      { label: "Happiness Index", value: `${happiness} /100`, caption: "Good", icon: "smile", color: "teal" },
    ],
    performanceList: [
      { id: "e1", empId: "E1001", name: "Ramesh Kumar", line: "Line 01", skill: "Skilled", efficiency: 92.5, target: 85, output: 126, reject: 0.6, attendance: "P", incentive: 485, happiness: 85, status: "Excellent" },
      { id: "e2", empId: "E1002", name: "Sita Devi", line: "Line 01", skill: "Skilled", efficiency: 88.3, target: 85, output: 118, reject: 0.7, attendance: "P", incentive: 420, happiness: 82, status: "Good" },
      { id: "e3", empId: "E1003", name: "Mahesh Yadav", line: "Line 02", skill: "Semi Skilled", efficiency: 76.8, target: 85, output: 102, reject: 1.2, attendance: "P", incentive: 310, happiness: 72, status: "Average" },
      { id: "e4", empId: "E1004", name: "Sunita Kumari", line: "Line 02", skill: "Skilled", efficiency: 93.2, target: 85, output: 128, reject: 0.5, attendance: "P", incentive: 510, happiness: 88, status: "Excellent" },
      { id: "e5", empId: "E1005", name: "Anita Patel", line: "Line 03", skill: "Semi Skilled", efficiency: 79.1, target: 85, output: 106, reject: 0.9, attendance: "P", incentive: 335, happiness: 75, status: "Average" },
      { id: "e6", empId: "E1006", name: "Raju Sharma", line: "Line 03", skill: "Helper", efficiency: 65.4, target: 85, output: 88, reject: 1.5, attendance: "P", incentive: 210, happiness: 60, status: "Needs Support" },
      { id: "e7", empId: "E1007", name: "Pawan Kumar", line: "Line 04", skill: "Skilled", efficiency: 90.6, target: 85, output: 123, reject: 0.6, attendance: "P", incentive: 460, happiness: 84, status: "Good" },
      { id: "e8", empId: "E1008", name: "Neha Singh", line: "Line 04", skill: "Multi Skilled", efficiency: 94.1, target: 85, output: 130, reject: 0.4, attendance: "P", incentive: 540, happiness: 90, status: "Excellent" },
    ],
    happinessTotal: happiness,
    happinessBreakdown: [
      { label: "Attendance", value: 18.5, max: 25 },
      { label: "Overtime", value: 16.2, max: 20 },
      { label: "Salary & Benefits", value: 17.8, max: 20 },
      { label: "Work Environment", value: 14.3, max: 20 },
      { label: "Recognition", value: 7.6, max: 10 },
      { label: "Growth & Training", value: 4.0, max: 5 },
    ],
    skillDistribution: [
      { label: "Helper", value: 474, color: "#16a34a" },
      { label: "Operator", value: 424, color: "#1e56c9" },
      { label: "Semi Skilled", value: 200, color: "#f59e0b" },
      { label: "Skilled", value: 112, color: "#dc2626" },
      { label: "Multi Skilled", value: 38, color: "#7c3aed" },
    ],
    topPerformers: [
      { rank: 1, name: "Ramesh Kumar", line: "Line 01", efficiency: 92.5 },
      { rank: 2, name: "Neha Singh", line: "Line 04", efficiency: 94.1 },
      { rank: 3, name: "Sunita Kumari", line: "Line 02", efficiency: 93.2 },
    ],
    attendance: { present, absent, onLeave: 28, halfDay: 10, total },
    performanceTrend: [79, 80, 78, 81, 80, efficiency].map((efficiencyVal, i) => ({
      x: DAYS[i],
      efficiency: efficiencyVal,
      target: 70,
    })),
    trendTargetLine: 70,
    efficiencyDistribution: [
      { label: "< 60%", value: 76 },
      { label: "60 - 70%", value: 152 },
      { label: "70 - 80%", value: 258 },
      { label: "80 - 90%", value: 482 },
      { label: ">= 90%", value: 280 },
    ],
    rejectRateByGroup: [
      { label: "Helper", value: 1.45 },
      { label: "Semi Skilled", value: 1.02 },
      { label: "Skilled", value: 0.62 },
      { label: "Multi Skilled", value: 0.48 },
    ],
    incentiveToday: 548760,
    avgIncentive: 438,
    operatorsEligible: 1086,
    insights: [
      "82 operators efficiency below 70%. Need coaching.",
      "Line 03 has highest absenteeism (7.2%).",
      "Recognize top performers to boost motivation.",
      "Provide additional training for low performers.",
    ],
    smartInsight: "Happy Operators are 23% more productive. Keep engaging, recognizing & supporting your team!",
  };
}
