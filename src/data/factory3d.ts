import { jitter } from "@/lib/useLiveData";
import type { AlertEvent, CameraDevice, Factory3DData, Point3, Worker, WifiAccessPoint, Zone } from "@/types/factory3d";

/**
 * This module keeps mutable state at module scope (`workerState`) instead of
 * being a pure per-call generator like the rest of `src/data/*.ts`. That's a
 * deliberate exception: workers need to *wander* smoothly frame to frame
 * rather than teleport to a fresh random spot every tick, which requires
 * remembering where each one was last seen.
 *
 * Assumes the page polls this at TICK_SECONDS-second intervals (see
 * Factory3DDashboard.tsx's useLiveData call) — only used to convert idle
 * ticks into a human idle-time reading, movement itself is tick-agnostic.
 */
const TICK_SECONDS = 3;

const WORKER_HEIGHT = 0.95; // avatar center height above the floor
const RESTRICTED_ZONE_ID = "restricted";

export const ZONES: Zone[] = [
  { id: "line-01", label: "Line 01", kind: "line", bounds: { x0: 2, z0: 2, x1: 17, z1: 17 }, height: 4.2, color: "#1e56c9", capacity: 6 },
  { id: "line-02", label: "Line 02", kind: "line", bounds: { x0: 19, z0: 2, x1: 34, z1: 17 }, height: 4.2, color: "#16a34a", capacity: 6 },
  { id: "line-03", label: "Line 03", kind: "line", bounds: { x0: 2, z0: 19, x1: 17, z1: 34 }, height: 4.2, color: "#f59e0b", capacity: 6 },
  { id: "line-04", label: "Line 04", kind: "line", bounds: { x0: 19, z0: 19, x1: 34, z1: 34 }, height: 4.2, color: "#7c3aed", capacity: 6 },
  { id: "cutting", label: "Cutting Area", kind: "area", bounds: { x0: 38, z0: 2, x1: 60, z1: 13 }, height: 5, color: "#0891b2", capacity: 5 },
  { id: "sewing", label: "Sewing Area", kind: "area", bounds: { x0: 38, z0: 15, x1: 60, z1: 26 }, height: 5, color: "#059669", capacity: 5 },
  { id: "finishing", label: "Finishing Area", kind: "area", bounds: { x0: 38, z0: 28, x1: 60, z1: 39 }, height: 5, color: "#ea580c", capacity: 5 },
  { id: RESTRICTED_ZONE_ID, label: "Chemical Store", kind: "restricted", bounds: { x0: 2, z0: 36, x1: 17, z1: 41 }, height: 3.5, color: "#dc2626", capacity: 2 },
];

const WORKER_SEED: { empId: string; name: string; zoneId: string }[] = [
  // Reused from src/data/operator.ts so names/empIds line up with the Operator dashboard.
  { empId: "E1001", name: "Ramesh Kumar", zoneId: "line-01" },
  { empId: "E1002", name: "Sita Devi", zoneId: "line-01" },
  { empId: "E1003", name: "Mahesh Yadav", zoneId: "line-02" },
  { empId: "E1004", name: "Sunita Kumari", zoneId: "line-02" },
  { empId: "E1005", name: "Anita Patel", zoneId: "line-03" },
  { empId: "E1006", name: "Raju Sharma", zoneId: "line-03" },
  { empId: "E1007", name: "Pawan Kumar", zoneId: "line-04" },
  { empId: "E1008", name: "Neha Singh", zoneId: "line-04" },
  { empId: "E1009", name: "Kiran Bhosale", zoneId: "line-01" },
  { empId: "E1010", name: "Vijay Naik", zoneId: "line-02" },
  { empId: "E1011", name: "Suresh Patil", zoneId: "line-03" },
  { empId: "E1012", name: "Meena Joshi", zoneId: "line-04" },
  { empId: "E1013", name: "Arjun Rao", zoneId: "cutting" },
  { empId: "E1014", name: "Deepa Nair", zoneId: "cutting" },
  { empId: "E1015", name: "Farhan Sheikh", zoneId: "cutting" },
  { empId: "E1016", name: "Geeta Reddy", zoneId: "cutting" },
  { empId: "E1017", name: "Harish Gupta", zoneId: "sewing" },
  { empId: "E1018", name: "Indira Menon", zoneId: "sewing" },
  { empId: "E1019", name: "Javed Ali", zoneId: "sewing" },
  { empId: "E1020", name: "Kavita Desai", zoneId: "sewing" },
  { empId: "E1021", name: "Lokesh Verma", zoneId: "finishing" },
  { empId: "E1022", name: "Manisha Iyer", zoneId: "finishing" },
  { empId: "E1023", name: "Naveen Chauhan", zoneId: "finishing" },
  { empId: "E1024", name: "Om Prakash", zoneId: "finishing" },
  { empId: "E1025", name: "Priya Bhatt", zoneId: RESTRICTED_ZONE_ID },
  { empId: "E1026", name: "Qasim Sheikh", zoneId: RESTRICTED_ZONE_ID },
  { empId: "E1027", name: "Rohit Malhotra", zoneId: "line-01" },
  { empId: "E1028", name: "Sunil Bora", zoneId: "line-02" },
  { empId: "E1029", name: "Tara Chawla", zoneId: "line-03" },
  { empId: "E1030", name: "Uday Singh", zoneId: "line-04" },
];

function zoneOf(id: string): Zone {
  return ZONES.find((z) => z.id === id)!;
}

function randomPointInZone(zone: Zone, margin = 1.4): Point3 {
  const halfW = (zone.bounds.x1 - zone.bounds.x0) / 2 - margin;
  const halfD = (zone.bounds.z1 - zone.bounds.z0) / 2 - margin;
  const cx = (zone.bounds.x0 + zone.bounds.x1) / 2;
  const cz = (zone.bounds.z0 + zone.bounds.z1) / 2;
  return { x: jitter(cx, Math.max(halfW, 0.5), 2), y: WORKER_HEIGHT, z: jitter(cz, Math.max(halfD, 0.5), 2) };
}

function clampToZone(pos: Point3, zone: Zone, margin = 1.2): Point3 {
  return {
    x: Math.min(Math.max(pos.x, zone.bounds.x0 + margin), zone.bounds.x1 - margin),
    y: WORKER_HEIGHT,
    z: Math.min(Math.max(pos.z, zone.bounds.z0 + margin), zone.bounds.z1 - margin),
  };
}

function createWorkers(): Worker[] {
  return WORKER_SEED.map((seed, i) => ({
    id: `w${i + 1}`,
    empId: seed.empId,
    name: seed.name,
    zoneId: seed.zoneId,
    position: randomPointInZone(zoneOf(seed.zoneId)),
    status: "present",
    source: "simulated",
    lastSeen: new Date().toISOString(),
    idleSeconds: 0,
  }));
}

function createCameras(): CameraDevice[] {
  return ZONES.map((zone, i) => {
    const cx = (zone.bounds.x0 + zone.bounds.x1) / 2;
    const cz = (zone.bounds.z0 + zone.bounds.z1) / 2;
    return {
      id: `cam-${zone.id}`,
      zoneId: zone.id,
      position: { x: zone.bounds.x0 + 1, y: zone.height - 0.4, z: zone.bounds.z0 + 1 },
      target: { x: cx, y: 0, z: cz },
      fovDeg: 70,
      status: "online",
    };
  });
}

function createWifiAps(): WifiAccessPoint[] {
  return ZONES.map((zone) => {
    const cx = (zone.bounds.x0 + zone.bounds.x1) / 2;
    const cz = (zone.bounds.z0 + zone.bounds.z1) / 2;
    const diag = Math.hypot(zone.bounds.x1 - zone.bounds.x0, zone.bounds.z1 - zone.bounds.z0);
    return {
      id: `ap-${zone.id}`,
      zoneId: zone.id,
      position: { x: cx, y: zone.height * 0.6, z: cz },
      rangeMeters: Math.round(diag / 2),
      status: "online",
    };
  });
}

let workerState = createWorkers();
let cameraState = createCameras();
let wifiApState = createWifiAps();

function moveWorker(worker: Worker): Worker {
  if (worker.status === "offline") {
    // 30% chance per tick a dropped connection is recovered.
    if (Math.random() < 0.3) {
      return { ...worker, status: "present", lastSeen: new Date().toISOString() };
    }
    return worker;
  }

  // Rare dropped signal (simulates a lost CCTV/WiFi reading).
  if (Math.random() < 0.005) {
    return { ...worker, status: "offline", alertReason: "offline" };
  }

  const currentZone = zoneOf(worker.zoneId);
  let zoneId = worker.zoneId;
  let zone = currentZone;

  // Rare chance to wander into the restricted zone (triggers an alert).
  if (worker.zoneId !== RESTRICTED_ZONE_ID && Math.random() < 0.012) {
    zoneId = RESTRICTED_ZONE_ID;
    zone = zoneOf(zoneId);
    const position = randomPointInZone(zone);
    return { ...worker, zoneId, position, status: "alert", alertReason: "restricted-zone", idleSeconds: 0, lastSeen: new Date().toISOString() };
  }

  // Occasional normal transition to a neighboring work zone.
  if (worker.zoneId !== RESTRICTED_ZONE_ID && Math.random() < 0.02) {
    const candidates = ZONES.filter((z) => z.kind !== "restricted" && z.id !== worker.zoneId);
    zone = candidates[Math.floor(Math.random() * candidates.length)];
    zoneId = zone.id;
    const position = randomPointInZone(zone);
    return { ...worker, zoneId, position, status: "present", alertReason: undefined, idleSeconds: 0, lastSeen: new Date().toISOString() };
  }

  // Otherwise: small local wander within the current zone.
  const nudged = clampToZone(
    { x: jitter(worker.position.x, 0.5, 2), y: WORKER_HEIGHT, z: jitter(worker.position.z, 0.5, 2) },
    zone,
  );
  const moved = Math.hypot(nudged.x - worker.position.x, nudged.z - worker.position.z) > 0.15;
  const idleSeconds = moved ? 0 : worker.idleSeconds + TICK_SECONDS;

  let status: Worker["status"] = "present";
  let alertReason: Worker["alertReason"];
  if (worker.zoneId === RESTRICTED_ZONE_ID) {
    status = "alert";
    alertReason = "restricted-zone";
  } else if (idleSeconds > 180) {
    status = "alert";
    alertReason = "prolonged-idle";
  } else if (idleSeconds > 60) {
    status = "idle";
  }

  return { ...worker, position: nudged, idleSeconds, status, alertReason, lastSeen: new Date().toISOString() };
}

function flipDeviceStatus<T extends { status: "online" | "offline" }>(device: T): T {
  if (device.status === "online") {
    return Math.random() < 0.01 ? { ...device, status: "offline" } : device;
  }
  return Math.random() < 0.4 ? { ...device, status: "online" } : device;
}

function buildAlerts(workers: Worker[]): AlertEvent[] {
  const reasonText: Record<NonNullable<Worker["alertReason"]>, (w: Worker) => string> = {
    "restricted-zone": (w) => `${w.name} (${w.empId}) entered the Chemical Store — restricted zone`,
    "prolonged-idle": (w) => `${w.name} (${w.empId}) has been idle for ${Math.round(w.idleSeconds / 60)} min`,
    offline: (w) => `${w.name} (${w.empId}) presence signal lost`,
  };

  return workers
    .filter((w) => w.status === "alert" || w.status === "offline")
    .slice(0, 8)
    .map((w) => ({
      id: `alert-${w.id}-${w.alertReason ?? "offline"}`,
      workerId: w.id,
      text: (w.alertReason ? reasonText[w.alertReason] : reasonText.offline)(w),
      severity: w.alertReason === "prolonged-idle" ? "warn" : "bad",
    }));
}

export function generateFactory3DData(): Factory3DData {
  workerState = workerState.map(moveWorker);
  cameraState = cameraState.map(flipDeviceStatus);
  wifiApState = wifiApState.map(flipDeviceStatus);

  const present = workerState.filter((w) => w.status !== "offline").length;
  const activeAlerts = workerState.filter((w) => w.status === "alert").length;
  const zonesOverCapacity = ZONES.filter(
    (zone) => workerState.filter((w) => w.zoneId === zone.id).length > zone.capacity,
  ).length;
  const camerasOnline = cameraState.filter((c) => c.status === "online").length;
  const apsOnline = wifiApState.filter((a) => a.status === "online").length;
  const avgIdle = Math.round(workerState.reduce((sum, w) => sum + w.idleSeconds, 0) / workerState.length);

  return {
    zones: ZONES,
    workers: workerState,
    cameras: cameraState,
    wifiAps: wifiApState,
    kpis: [
      { label: "Workers Present", value: `${present}`, caption: `of ${workerState.length} tracked`, icon: "userCheck", color: "green" },
      { label: "Active Alerts", value: `${activeAlerts}`, caption: "Restricted zone / idle", icon: "alertTriangle", color: "red" },
      { label: "Zones Over Capacity", value: `${zonesOverCapacity}`, caption: `of ${ZONES.length} zones`, icon: "layers", color: "orange" },
      { label: "Cameras Online", value: `${camerasOnline}/${cameraState.length}`, caption: "CCTV feed", icon: "video", color: "blue" },
      { label: "WiFi APs Online", value: `${apsOnline}/${wifiApState.length}`, caption: "RTLS network", icon: "wifi", color: "teal" },
      { label: "Avg Idle Time", value: `${avgIdle}s`, caption: "Across tracked workers", icon: "clock", color: "purple" },
    ],
    alerts: buildAlerts(workerState),
  };
}
