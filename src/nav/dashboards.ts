import {
  Activity,
  BadgeCheck,
  Boxes,
  ClipboardList,
  Factory,
  Gauge,
  HeartPulse,
  Leaf,
  Presentation,
  ShieldAlert,
  Stethoscope,
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
 * All 14 dashboard slots. Titles/slugs mirror the real screen names as
 * they're handed off; unbuilt slots render as disabled "coming soon"
 * nav entries so the sidebar/routing shape doesn't change as more
 * screens arrive.
 */
export const DASHBOARDS: DashboardNavItem[] = [
  { order: 1, slug: "overview", title: "CEO Live Scorecard", subtitle: "Real Time Factory Performance", icon: Gauge, status: "live" },
  { order: 2, slug: "orders", title: "Order Status", subtitle: "PO to Dispatch Tracking", icon: ClipboardList, status: "live" },
  { order: 3, slug: "production-line", title: "Production Line", subtitle: "Real Time Line Performance", icon: Factory, status: "live" },
  { order: 4, slug: "machine-health", title: "Machine Health", subtitle: "Real Time Health & Utilization", icon: HeartPulse, status: "live" },
  { order: 5, slug: "operator", title: "Operator", subtitle: "People Performance & Happiness", icon: Users, status: "live" },
  { order: 6, slug: "inventory", title: "Inventory", subtitle: "Spares & Stock", icon: Boxes, status: "soon" },
  { order: 7, slug: "safety", title: "Safety & Incident", subtitle: "Real Time Safety Performance", icon: ShieldAlert, status: "live" },
  { order: 8, slug: "environment", title: "Environment & Sustainability", subtitle: "Emissions, Water & Waste", icon: Leaf, status: "live" },
  { order: 9, slug: "quality", title: "Quality Management", subtitle: "Real Time Quality & Conformance", icon: BadgeCheck, status: "live" },
  { order: 10, slug: "production-ops", title: "Production & Operations", subtitle: "Real Time Production & OEE", icon: Activity, status: "live" },
  { order: 11, slug: "energy-utilities", title: "Energy & Utilities", subtitle: "Consumption & Cost Optimization", icon: Zap, status: "live" },
  { order: 12, slug: "maintenance", title: "Maintenance Performance", subtitle: "Monitoring & Asset Reliability", icon: Wrench, status: "live" },
  { order: 13, slug: "hse", title: "HSE Performance", subtitle: "Incident Prevention & Compliance", icon: Stethoscope, status: "live" },
  { order: 14, slug: "executive", title: "Executive Summary", subtitle: "Plant-Wide Roll-up", icon: Presentation, status: "soon" },
];

export const TOTAL_DASHBOARDS = DASHBOARDS.length;
