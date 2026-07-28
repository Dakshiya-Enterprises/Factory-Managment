import type { CameraDevice, WifiAccessPoint, Worker } from "@/types/factory3d";

/** Mirrors the --color-status-* tokens in src/index.css — three.js materials can't consume CSS vars directly. */
export const STATUS_COLOR: Record<Worker["status"], string> = {
  present: "#16a34a",
  idle: "#f59e0b",
  alert: "#dc2626",
  offline: "#6b7280",
};

export const DEVICE_COLOR: Record<CameraDevice["status"] | WifiAccessPoint["status"], string> = {
  online: "#16a34a",
  offline: "#dc2626",
};
