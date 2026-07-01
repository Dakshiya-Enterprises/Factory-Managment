import {
  BadgeCheck,
  Boxes,
  Factory,
  FileCheck2,
  HeartPulse,
  IndianRupee,
  LayoutGrid,
  Leaf,
  Presentation,
  ShieldAlert,
  Truck,
  Users,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

export interface DashboardNavItem {
  order: number;
  slug: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  status: "live" | "soon";
}

/**
 * All 14 dashboard slots. Only 5 are wired to real screens right now
 * (status: "live"); the rest render as disabled "coming soon" nav
 * entries so the sidebar/routing doesn't need to change shape when the
 * remaining screens are handed off.
 */
export const DASHBOARDS: DashboardNavItem[] = [
  { order: 1, slug: "overview", title: "Plant Overview", subtitle: "Command Center", icon: LayoutGrid, status: "soon" },
  { order: 2, slug: "production", title: "Production", subtitle: "Output & Throughput", icon: Factory, status: "soon" },
  { order: 3, slug: "energy", title: "Energy & Utilities", subtitle: "Consumption Tracking", icon: Zap, status: "soon" },
  { order: 4, slug: "machine-health", title: "Machine Health", subtitle: "Real Time Health & Utilization", icon: HeartPulse, status: "live" },
  { order: 5, slug: "operator", title: "Operator", subtitle: "People Performance & Happiness", icon: Users, status: "live" },
  { order: 6, slug: "inventory", title: "Inventory", subtitle: "Spares & Stock", icon: Boxes, status: "soon" },
  { order: 7, slug: "safety", title: "Safety & Incident", subtitle: "Real Time Safety Performance", icon: ShieldAlert, status: "live" },
  { order: 8, slug: "environment", title: "Environment", subtitle: "Emissions & Compliance", icon: Leaf, status: "soon" },
  { order: 9, slug: "quality", title: "Quality Management", subtitle: "Real Time Quality & Conformance", icon: BadgeCheck, status: "live" },
  { order: 10, slug: "logistics", title: "Logistics", subtitle: "Dispatch & Transport", icon: Truck, status: "soon" },
  { order: 11, slug: "finance", title: "Cost & Finance", subtitle: "Spend Analytics", icon: IndianRupee, status: "soon" },
  { order: 12, slug: "maintenance", title: "Maintenance Performance", subtitle: "Monitoring & Asset Reliability", icon: Wrench, status: "live" },
  { order: 13, slug: "compliance", title: "Compliance", subtitle: "Audits & Certifications", icon: FileCheck2, status: "soon" },
  { order: 14, slug: "executive", title: "Executive Summary", subtitle: "Plant-Wide Roll-up", icon: Presentation, status: "soon" },
];

export const TOTAL_DASHBOARDS = DASHBOARDS.length;
