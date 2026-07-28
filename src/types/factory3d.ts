import type { Kpi } from "@/types/dashboard";

export type ZoneKind = "line" | "area" | "restricted";

/**
 * Where a worker's position reading came from. Every worker is "simulated"
 * today — this field is the seam a real pipeline plugs into later (a CCTV
 * person-detection service, or WiFi-based indoor positioning) without any
 * change to the 3D scene or dashboard components that consume it.
 */
export type PresenceSource = "cctv" | "wifi" | "simulated";

export type WorkerStatus = "present" | "idle" | "alert" | "offline";

export interface Point3 {
  x: number;
  y: number;
  z: number;
}

export interface Zone {
  id: string;
  label: string;
  kind: ZoneKind;
  /** Footprint on the shared factory floor plane. */
  bounds: { x0: number; z0: number; x1: number; z1: number };
  height: number;
  color: string;
  capacity: number;
}

export interface Worker {
  id: string;
  /** Ties back to OperatorRow.empId in src/data/operator.ts. */
  empId: string;
  name: string;
  zoneId: string;
  position: Point3;
  status: WorkerStatus;
  source: PresenceSource;
  lastSeen: string;
  idleSeconds: number;
  alertReason?: "restricted-zone" | "prolonged-idle" | "offline";
}

export interface CameraDevice {
  id: string;
  zoneId: string;
  position: Point3;
  target: Point3;
  fovDeg: number;
  status: "online" | "offline";
}

export interface WifiAccessPoint {
  id: string;
  zoneId: string;
  position: Point3;
  rangeMeters: number;
  status: "online" | "offline";
}

export interface AlertEvent {
  id: string;
  workerId: string;
  text: string;
  severity: "bad" | "warn";
}

export interface Factory3DData {
  zones: Zone[];
  workers: Worker[];
  cameras: CameraDevice[];
  wifiAps: WifiAccessPoint[];
  kpis: Kpi[];
  alerts: AlertEvent[];
}
