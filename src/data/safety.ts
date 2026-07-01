import { jitter } from "@/lib/useLiveData";
import type { DonutSlice, Kpi, RankedBar } from "@/types/dashboard";

export interface IncidentRow {
  id: string;
  incidentId: string;
  datetime: string;
  location: string;
  type: string;
  severity: "Low" | "Medium" | "High";
  description: string;
  ltiPotential: "Low" | "Medium" | "High";
  status: "Open" | "Under Investigation" | "Closed";
  daysOpen: number;
}

export interface SafetyData {
  kpis: Kpi[];
  incidentSummary: DonutSlice[];
  incidents: IncidentRow[];
  incidentsByLocation: RankedBar[];
  severityDistribution: DonutSlice[];
  ltifrTrend: { x: string; current: number; prior: number }[];
  topCauses: RankedBar[];
  safetyObservations: DonutSlice[];
  nearMiss: number;
  nearMissDelta: string;
  insights: string[];
}

const MONTHS = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May"];

export function generateSafetyData(): SafetyData {
  const totalIncidents = 32;
  const ltifr = jitter(0.42, 0.02, 2);

  return {
    kpis: [
      { label: "Total Incidents (YTD)", value: `${totalIncidents}`, delta: "18.4%", direction: "down", sentiment: "good", icon: "shieldCheck", color: "green" },
      { label: "LTIFR (YTD)", value: `${ltifr}`, delta: "16.0%", direction: "down", sentiment: "good", icon: "xCircle", color: "red" },
      { label: "TRIFR (YTD)", value: "1.12", delta: "12.8%", direction: "down", sentiment: "good", icon: "clipboard", color: "orange" },
      { label: "MTC (YTD)", value: "256", delta: "8.1%", direction: "up", sentiment: "bad", icon: "clipboardCheck", color: "purple" },
      { label: "Safety Observations", value: "1,842", delta: "15.6%", direction: "up", sentiment: "good", icon: "users", color: "blue" },
      { label: "Safety Training (Hrs)", value: "3,420", delta: "10.3%", direction: "up", sentiment: "good", icon: "hardHat", color: "teal" },
    ],
    incidentSummary: [
      { label: "Lost Time Injury", value: 8, color: "#dc2626" },
      { label: "Medical Treatment Case", value: 14, color: "#f59e0b" },
      { label: "Restricted Work Case", value: 6, color: "#7c3aed" },
      { label: "First Aid Case", value: 4, color: "#16a34a" },
    ],
    incidents: [
      { id: "i1", incidentId: "INC-0256", datetime: "29 May 25, 09:15 AM", location: "Line 02 - SMS", type: "Slips / Trips", severity: "Low", description: "Employee slipped on water near pump area", ltiPotential: "Low", status: "Open", daysOpen: 0 },
      { id: "i2", incidentId: "INC-0255", datetime: "28 May 25, 04:30 PM", location: "Line 01 - RMHS", type: "Equipment Related", severity: "Medium", description: "Hand injury while cleaning conveyor", ltiPotential: "Medium", status: "Under Investigation", daysOpen: 1 },
      { id: "i3", incidentId: "INC-0254", datetime: "27 May 25, 11:40 AM", location: "Utilities - CPP", type: "Electrical", severity: "High", description: "Electric shock during panel maintenance", ltiPotential: "High", status: "Open", daysOpen: 2 },
      { id: "i4", incidentId: "INC-0253", datetime: "26 May 25, 02:20 PM", location: "Line 03 - BF", type: "Fire / Explosion (Near Miss)", severity: "Medium", description: "Gas leak detected during routine check", ltiPotential: "Medium", status: "Closed", daysOpen: 3 },
      { id: "i5", incidentId: "INC-0252", datetime: "25 May 25, 08:10 AM", location: "Warehouse", type: "Material Handling", severity: "Low", description: "Minor cut while handling MS plate", ltiPotential: "Low", status: "Closed", daysOpen: 4 },
      { id: "i6", incidentId: "INC-0251", datetime: "24 May 25, 03:55 PM", location: "Line 04 - Caster", type: "Mechanical", severity: "High", description: "Finger injury in roller maintenance", ltiPotential: "High", status: "Open", daysOpen: 5 },
      { id: "i7", incidentId: "INC-0250", datetime: "23 May 25, 10:05 AM", location: "Lab Area", type: "Chemical Exposure (Near Miss)", severity: "Medium", description: "Spill of chemical during sample preparation", ltiPotential: "Medium", status: "Closed", daysOpen: 6 },
    ],
    incidentsByLocation: [
      { label: "Line 02 - SMS", value: 8 },
      { label: "Line 01 - RMHS", value: 7 },
      { label: "Line 03 - BF", value: 6 },
      { label: "Line 04 - Caster", value: 5 },
      { label: "Utilities - CPP", value: 3 },
      { label: "Others", value: 3 },
    ],
    severityDistribution: [
      { label: "High (Risk 4-5)", value: 10, color: "#dc2626" },
      { label: "Medium (Risk 2-3)", value: 14, color: "#f59e0b" },
      { label: "Low (Risk 1)", value: 8, color: "#16a34a" },
    ],
    ltifrTrend: [1.15, 1.05, 0.95, 0.88, 0.8, 0.72, 0.65, 0.6, 0.55, 0.5, 0.46, ltifr].map((current, i) => ({
      x: MONTHS[i],
      current,
      prior: 0.5,
    })),
    topCauses: [
      { label: "Unsafe Acts", value: 12 },
      { label: "Equipment Failure", value: 7 },
      { label: "Poor Housekeeping", value: 5 },
      { label: "Procedural Deviation", value: 4 },
      { label: "Others", value: 4 },
    ],
    safetyObservations: [
      { label: "Safe Act", value: 912, color: "#16a34a" },
      { label: "At Risk", value: 654, color: "#f59e0b" },
      { label: "Unsafe Act", value: 276, color: "#dc2626" },
    ],
    nearMiss: 118,
    nearMissDelta: "9.2%",
    insights: [
      "LTIFR improved by 16% compared to last year.",
      "Unsafe acts contribute to 37.5% of incidents.",
      "Line 02 - SMS has highest incidents (25%).",
      "Increase safety observations for better control.",
    ],
  };
}
