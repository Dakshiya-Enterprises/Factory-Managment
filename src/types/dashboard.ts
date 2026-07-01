export type AccentColor = "blue" | "green" | "orange" | "purple" | "red" | "teal" | "navy";

export interface Kpi {
  label: string;
  value: string;
  /** either a "vs LYTD" delta pair, or a plain caption (e.g. "Target: 85%") */
  delta?: string;
  direction?: "up" | "down";
  /** whether the delta direction is a good or bad thing for this metric */
  sentiment?: "good" | "bad";
  caption?: string;
  icon: string;
  color: AccentColor;
}

export interface DonutSlice {
  label: string;
  value: number;
  color: string;
}

export interface TrendPoint {
  x: string;
  y: number;
}

export interface RankedBar {
  label: string;
  value: number;
}

export interface StatusRow {
  [key: string]: string | number;
}

export type StatusTone = "good" | "average" | "warn" | "bad" | "info" | "neutral";
