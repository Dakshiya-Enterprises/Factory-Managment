import { jitter } from "@/lib/useLiveData";
import type { DonutSlice, Kpi } from "@/types/dashboard";

export interface OrderRow {
  id: string;
  buyer: string;
  po: string;
  style: string;
  orderQty: number;
  completed: number;
  balance: number;
  pctComplete: number;
  expectedDispatch: string;
  riskPct: number;
  delayPrediction: "On Time" | "May Delay" | "Likely Delay" | "Will Delay";
  currentLine: string;
  currentOperator: string;
  efficiency: number;
}

export interface HighRiskRow {
  id: string;
  po: string;
  buyer: string;
  balance: number;
  riskPct: number;
  predictedDelay: string;
  action: string;
}

export interface OrderStatusData {
  kpis: Kpi[];
  orders: OrderRow[];
  buyerWise: DonutSlice[];
  delayRisk: DonutSlice[];
  highRisk: HighRiskRow[];
  aiInsights: string[];
}

export function generateOrderStatusData(): OrderStatusData {
  const otif = jitter(96.2, 0.15, 1);

  return {
    kpis: [
      { label: "Total Orders", value: "125", caption: "Active Orders", icon: "clipboard", color: "purple" },
      { label: "Total Quantity", value: "12,54,000", caption: "PCS", icon: "package", color: "green" },
      { label: "Completed", value: "7,82,000", caption: "PCS (62.4%)", icon: "checkCircle", color: "blue" },
      { label: "In Progress", value: "4,21,500", caption: "PCS (33.6%)", icon: "clock", color: "orange" },
      { label: "Pending", value: "50,500", caption: "PCS (4.0%)", icon: "truck", color: "red" },
      { label: "On Time Delivery", value: `${otif}%`, caption: "OTIF", icon: "calendar", color: "purple" },
    ],
    orders: [
      { id: "o1", buyer: "ZARA", po: "PO1024", style: "ZS-5621", orderQty: 50000, completed: 41800, balance: 8200, pctComplete: 84, expectedDispatch: "30 May 25", riskPct: 18, delayPrediction: "On Time", currentLine: "Line 12", currentOperator: "Ramesh", efficiency: 91 },
      { id: "o2", buyer: "H&M", po: "PO1025", style: "HM-8712", orderQty: 75000, completed: 48600, balance: 26400, pctComplete: 64, expectedDispatch: "02 Jun 25", riskPct: 62, delayPrediction: "May Delay", currentLine: "Line 07", currentOperator: "Sita", efficiency: 78 },
      { id: "o3", buyer: "LEVI'S", po: "PO1026", style: "LV-2210", orderQty: 45000, completed: 30500, balance: 14500, pctComplete: 68, expectedDispatch: "01 Jun 25", riskPct: 48, delayPrediction: "May Delay", currentLine: "Line 03", currentOperator: "Mahesh", efficiency: 76 },
      { id: "o4", buyer: "NIKE", po: "PO1027", style: "NK-4412", orderQty: 60000, completed: 50400, balance: 9600, pctComplete: 84, expectedDispatch: "29 May 25", riskPct: 15, delayPrediction: "On Time", currentLine: "Line 08", currentOperator: "Sunita", efficiency: 93 },
      { id: "o5", buyer: "PUMA", po: "PO1028", style: "PM-3311", orderQty: 35000, completed: 22400, balance: 12600, pctComplete: 64, expectedDispatch: "03 Jun 25", riskPct: 70, delayPrediction: "Likely Delay", currentLine: "Line 11", currentOperator: "Raju", efficiency: 69 },
      { id: "o6", buyer: "GAP", po: "PO1029", style: "GP-1188", orderQty: 30000, completed: 18000, balance: 12000, pctComplete: 60, expectedDispatch: "02 Jun 25", riskPct: 55, delayPrediction: "May Delay", currentLine: "Line 05", currentOperator: "Anita", efficiency: 71 },
      { id: "o7", buyer: "UNIQLO", po: "PO1030", style: "UQ-9981", orderQty: 25000, completed: 12500, balance: 12500, pctComplete: 50, expectedDispatch: "04 Jun 25", riskPct: 85, delayPrediction: "Will Delay", currentLine: "Line 02", currentOperator: "Pawan", efficiency: 58 },
    ],
    buyerWise: [
      { label: "ZARA", value: 35, color: "#1e56c9" },
      { label: "H&M", value: 27, color: "#16a34a" },
      { label: "LEVI'S", value: 23, color: "#f59e0b" },
      { label: "NIKE", value: 18, color: "#7c3aed" },
      { label: "PUMA", value: 12, color: "#0d9488" },
      { label: "GAP", value: 6, color: "#dc2626" },
      { label: "UNIQLO", value: 4, color: "#94a3b8" },
    ],
    delayRisk: [
      { label: "On Time (Risk < 30%)", value: 45, color: "#16a34a" },
      { label: "May Delay (30% - 70%)", value: 58, color: "#f59e0b" },
      { label: "Will Delay (Risk > 70%)", value: 22, color: "#dc2626" },
    ],
    highRisk: [
      { id: "h1", po: "PO1030", buyer: "UNIQLO", balance: 12500, riskPct: 85, predictedDelay: "2 Days", action: "Add 8 Operators in Line 02" },
      { id: "h2", po: "PO1028", buyer: "PUMA", balance: 12600, riskPct: 70, predictedDelay: "1 Day", action: "Move to Line 09" },
      { id: "h3", po: "PO1025", buyer: "H&M", balance: 26400, riskPct: 62, predictedDelay: "1 Day", action: "Increase Output by 15%" },
      { id: "h4", po: "PO1026", buyer: "LEVI'S", balance: 14500, riskPct: 48, predictedDelay: "10 Hrs", action: "Add 1 Helper in Line 03" },
      { id: "h5", po: "PO1029", buyer: "GAP", balance: 12000, riskPct: 55, predictedDelay: "16 Hrs", action: "Reallocate from Line 05" },
    ],
    aiInsights: [
      "8 Orders are at risk of delay.",
      "Total 58,700 pcs may be delayed.",
      "Recommended action can improve OTIF by 6.4%.",
      "Focus on Line 02, 07, 11 for capacity balancing.",
    ],
  };
}
