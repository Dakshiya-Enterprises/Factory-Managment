/**
 * Factory3DDashboard — interactive 3D factory monitoring page.
 * Fully responsive: mobile → tablet → desktop → wide.
 */

import { useState, useRef, useCallback, useMemo } from "react";
import {
  Box, Layers3, SquareStack, Maximize2, Minimize2,
  Headset, X, Users, AlertTriangle, Clock, Truck,
  Train, Forklift, PackageCheck, ChevronRight,
} from "lucide-react";
import * as THREE from "three";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { KpiCard } from "@/components/ui/KpiCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { FactoryScene, type ViewMode, type CameraTarget } from "@/components/factory3d/FactoryScene";
import { ZONES, generateFactory3DData } from "@/data/factory3d";
import { useLiveData } from "@/lib/useLiveData";
import type { Worker, Zone } from "@/types/factory3d";
import type { StatusTone } from "@/types/dashboard";

// ── Types ─────────────────────────────────────────────────────────────────────

type TransportId = "train" | "truck-red" | "truck-blue" | "forklift-1" | "forklift-2";

interface TransportItem {
  id: TransportId;
  label: string;
  icon: typeof Truck;
  color: string;
  status: string;
  detail: string;
  metric: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const STATUS_TONE: Record<Worker["status"], StatusTone> = {
  present: "good", idle: "average", alert: "bad", offline: "neutral",
};

const VIEW_MODES: { mode: ViewMode; label: string; icon: typeof Box }[] = [
  { mode: "perspective",   label: "3D",         icon: Box },
  { mode: "top-down",      label: "Top",         icon: SquareStack },
  { mode: "cross-section", label: "Section",     icon: Layers3 },
];

const TRANSPORT_ITEMS: TransportItem[] = [
  { id: "train",       label: "Freight Train",  icon: Train,    color: "#455a64", status: "En Route", detail: "4 wagons · 68 km/h",    metric: "ETA 14 min" },
  { id: "truck-red",   label: "Truck FOS-01",   icon: Truck,    color: "#e53935", status: "At Dock",  detail: "Loading · 12 packages", metric: "Dept. 15:40" },
  { id: "truck-blue",  label: "Truck FOS-02",   icon: Truck,    color: "#1565c0", status: "Parked",   detail: "Standby · Engine off",  metric: "Idle 22 min" },
  { id: "forklift-1",  label: "Forklift FL-01", icon: Forklift, color: "#f9a825", status: "Active",   detail: "Aisle A → Storage",     metric: "12 lifts" },
  { id: "forklift-2",  label: "Forklift FL-02", icon: Forklift, color: "#f9a825", status: "Active",   detail: "Zone cross-transfer",   metric: "8 lifts" },
];

// ── Zone insight derivation ───────────────────────────────────────────────────

function useZoneInsights(zones: Zone[], workers: Worker[]) {
  return useMemo(() => zones.map((zone) => {
    const present    = workers.filter((w) => w.zoneId === zone.id);
    const alerts     = present.filter((w) => w.status === "alert").length;
    const idle       = present.filter((w) => w.status === "idle").length;
    const seed       = zone.id.charCodeAt(zone.id.length - 1);
    const prodHours  = (6 + (seed % 4) + present.length * 0.3).toFixed(1);
    const efficiency = Math.round(70 + (seed % 25));
    return { zone, headcount: present.length, alerts, idle, prodHours, efficiency };
  }), [zones, workers]);
}

// ── Camera target builders ────────────────────────────────────────────────────

function cameraForZone(zone: Zone): CameraTarget {
  const cx   = (zone.bounds.x0 + zone.bounds.x1) / 2;
  const cz   = (zone.bounds.z0 + zone.bounds.z1) / 2;
  const size = Math.max(zone.bounds.x1 - zone.bounds.x0, zone.bounds.z1 - zone.bounds.z0);
  const d    = size * 0.9 + 6;
  return {
    position: new THREE.Vector3(cx + d, d * 0.7, cz + d),
    lookAt:   new THREE.Vector3(cx, zone.height * 0.4, cz),
  };
}

function cameraForWorker(worker: Worker): CameraTarget {
  const { x, y, z } = worker.position;
  return {
    position: new THREE.Vector3(x + 5, y + 4, z + 5),
    lookAt:   new THREE.Vector3(x, y + 0.8, z),
  };
}

// ── Tiny shared primitives ────────────────────────────────────────────────────

function StatBox({ icon, label, value, color }: {
  icon: React.ReactNode; label: string; value: string; color: string;
}) {
  return (
    <div className="flex flex-col gap-0.5 rounded-lg p-2" style={{ background: `${color}14` }}>
      <div className="flex items-center gap-1 text-[9px] text-[var(--color-muted)]">
        <span style={{ color }}>{icon}</span>{label}
      </div>
      <span className="text-[13px] font-bold leading-none" style={{ color }}>{value}</span>
    </div>
  );
}

// ── View-mode button strip ────────────────────────────────────────────────────

function ViewModeButtons({ viewMode, onChange }: { viewMode: ViewMode; onChange: (m: ViewMode) => void }) {
  return (
    <div className="flex items-center gap-1">
      {VIEW_MODES.map(({ mode, label, icon: Icon }) => {
        const active = viewMode === mode;
        return (
          <button
            key={mode}
            type="button"
            onClick={() => onChange(mode)}
            title={label}
            className={`flex items-center gap-1 rounded-md border px-2 py-1.5 text-[10px] font-semibold transition-colors ${
              active
                ? "border-[var(--color-brand-blue)] bg-[var(--color-brand-blue)] text-white"
                : "border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-brand-blue)] hover:text-[var(--color-brand-blue)]"
            }`}
          >
            <Icon className="h-3 w-3 flex-shrink-0" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ── Zone card ─────────────────────────────────────────────────────────────────

function ZoneCard({ insight, active, onClick }: {
  insight: ReturnType<typeof useZoneInsights>[number];
  active: boolean;
  onClick: () => void;
}) {
  const { zone, headcount, alerts, prodHours, efficiency } = insight;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-shrink-0 w-36 sm:w-44 rounded-xl border-2 p-2.5 text-left transition-all hover:scale-[1.03] ${
        active ? "shadow-lg scale-[1.03]" : "opacity-85 hover:opacity-100"
      }`}
      style={{
        borderColor: active ? zone.color : `${zone.color}55`,
        background:  active
          ? `linear-gradient(135deg,${zone.color}22,${zone.color}08)`
          : `${zone.color}08`,
      }}
    >
      <div className="flex items-center gap-1.5 mb-2">
        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: zone.color }} />
        <span className="text-[10px] font-bold truncate flex-1" style={{ color: zone.color }}>
          {zone.label}
        </span>
        {alerts > 0 && (
          <span className="text-[9px] font-bold text-red-500 flex items-center gap-0.5">
            <AlertTriangle className="h-2.5 w-2.5" />{alerts}
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-1">
        <StatBox icon={<Users className="h-2.5 w-2.5" />}         label="People"   value={`${headcount}/${zone.capacity}`} color={zone.color} />
        <StatBox icon={<Clock className="h-2.5 w-2.5" />}         label="Prod h"   value={`${prodHours}h`}                 color={zone.color} />
        <StatBox icon={<AlertTriangle className="h-2.5 w-2.5" />} label="Alerts"   value={String(alerts)}                  color={alerts > 0 ? "#ef4444" : zone.color} />
        <StatBox icon={<ChevronRight className="h-2.5 w-2.5" />}  label="Eff."     value={`${efficiency}%`}                color={zone.color} />
      </div>
    </button>
  );
}

// ── Zone insight detail panel ─────────────────────────────────────────────────

function ZoneInsightPanel({ insight, onClose }: {
  insight: ReturnType<typeof useZoneInsights>[number];
  onClose: () => void;
}) {
  const { zone, headcount, alerts, idle, prodHours, efficiency } = insight;
  return (
    <div className="rounded-xl border-2 p-3 space-y-2.5"
      style={{ borderColor: `${zone.color}66`, background: `${zone.color}0d` }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: zone.color }} />
          <span className="text-[12px] font-bold truncate" style={{ color: zone.color }}>{zone.label}</span>
          <span className="text-[9px] uppercase tracking-wider text-[var(--color-muted)] flex-shrink-0">{zone.kind}</span>
        </div>
        <button type="button" onClick={onClose} className="text-[var(--color-muted)] hover:text-[var(--color-navy-900)] flex-shrink-0 ml-2">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {[
          { label: "Headcount",  value: `${headcount}/${zone.capacity}`, sub: `${idle} idle` },
          { label: "Alerts",     value: String(alerts),                  sub: alerts > 0 ? "Action needed" : "All clear" },
          { label: "Prod. Hours",value: `${prodHours}h`,                 sub: "today" },
          { label: "Efficiency", value: `${efficiency}%`,                sub: efficiency >= 85 ? "On target" : "Below avg" },
        ].map(({ label, value, sub }) => (
          <div key={label} className="rounded-lg p-2" style={{ background: `${zone.color}15` }}>
            <div className="text-[9px] uppercase tracking-wide text-[var(--color-muted)]">{label}</div>
            <div className="text-[15px] font-bold leading-tight" style={{ color: zone.color }}>{value}</div>
            <div className="text-[9px] text-[var(--color-muted)]">{sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Worker detail panel ───────────────────────────────────────────────────────

function WorkerDetailPanel({ worker, onClose }: { worker: Worker; onClose: () => void }) {
  const col: Record<Worker["status"], string> = {
    present: "#22c55e", idle: "#f59e0b", alert: "#ef4444", offline: "#6b7280",
  };
  const color = col[worker.status];
  return (
    <div className="rounded-xl border-2 p-3 space-y-2.5"
      style={{ borderColor: `${color}66`, background: `${color}0d` }}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-white text-[10px] flex-shrink-0"
            style={{ background: color }}>
            {worker.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </div>
          <div className="min-w-0">
            <div className="text-[12px] font-bold text-[var(--color-navy-900)] truncate">{worker.name}</div>
            <div className="text-[9px] font-mono text-[var(--color-muted)]">{worker.empId}</div>
          </div>
        </div>
        <button type="button" onClick={onClose} className="text-[var(--color-muted)] hover:text-[var(--color-navy-900)] flex-shrink-0">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {[
          { label: "Status", value: worker.status },
          { label: "Zone",   value: worker.zoneId },
          { label: "Source", value: worker.source },
          { label: "Idle",   value: `${worker.idleSeconds}s` },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-lg p-2" style={{ background: `${color}15` }}>
            <div className="text-[9px] uppercase tracking-wide text-[var(--color-muted)]">{label}</div>
            <div className="text-[12px] font-semibold" style={{ color }}>{value}</div>
          </div>
        ))}
      </div>
      {worker.alertReason && (
        <div className="flex items-center gap-2 rounded-lg p-2 bg-red-50 border border-red-200">
          <AlertTriangle className="h-3 w-3 text-red-500 flex-shrink-0" />
          <span className="text-[11px] text-red-700">{worker.alertReason.replace(/-/g, " ")}</span>
        </div>
      )}
    </div>
  );
}

// ── Transport card ────────────────────────────────────────────────────────────

function TransportCard({ item, active, onClick }: {
  item: TransportItem; active: boolean; onClick: () => void;
}) {
  const Icon = item.icon;
  const dotCls =
    item.status === "En Route" || item.status === "Active" ? "bg-green-500" :
    item.status === "At Dock"  ? "bg-amber-500" : "bg-slate-400";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-shrink-0 flex items-start gap-2.5 rounded-xl border-2 p-2.5 text-left transition-all hover:scale-[1.02] w-40 sm:w-48 ${
        active ? "shadow-md scale-[1.02]" : "opacity-85 hover:opacity-100"
      }`}
      style={{
        borderColor: active ? item.color : `${item.color}44`,
        background:  active ? `${item.color}18` : `${item.color}08`,
      }}
    >
      <div className="p-1.5 rounded-lg flex-shrink-0" style={{ background: `${item.color}22` }}>
        <Icon className="h-3.5 w-3.5" style={{ color: item.color }} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] font-bold truncate" style={{ color: item.color }}>{item.label}</div>
        <div className="text-[9px] text-[var(--color-muted)] leading-tight truncate">{item.detail}</div>
        <div className="mt-1 flex items-center gap-1">
          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotCls}`} />
          <span className="text-[9px] font-semibold text-[var(--color-navy-900)] truncate">{item.status}</span>
        </div>
        <div className="text-[9px] text-[var(--color-muted)] truncate">{item.metric}</div>
      </div>
    </button>
  );
}

// ── Transport detail panel ────────────────────────────────────────────────────

function TransportDetailPanel({ item, onClose }: { item: TransportItem; onClose: () => void }) {
  const Icon = item.icon;
  return (
    <div className="rounded-xl border-2 p-3 space-y-2.5"
      style={{ borderColor: `${item.color}66`, background: `${item.color}0d` }}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Icon className="h-4 w-4 flex-shrink-0" style={{ color: item.color }} />
          <span className="text-[12px] font-bold truncate" style={{ color: item.color }}>{item.label}</span>
        </div>
        <button type="button" onClick={onClose} className="text-[var(--color-muted)] hover:text-[var(--color-navy-900)] flex-shrink-0">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      {[
        { label: "Status",  value: item.status },
        { label: "Details", value: item.detail },
        { label: "Metric",  value: item.metric },
      ].map(({ label, value }) => (
        <div key={label} className="flex justify-between items-center rounded-lg px-2.5 py-1.5"
          style={{ background: `${item.color}15` }}>
          <span className="text-[9px] uppercase tracking-wide text-[var(--color-muted)]">{label}</span>
          <span className="text-[11px] font-semibold" style={{ color: item.color }}>{value}</span>
        </div>
      ))}
    </div>
  );
}

// ── Main dashboard ────────────────────────────────────────────────────────────

export function Factory3DDashboard() {
  const { data, lastUpdated } = useLiveData(generateFactory3DData, 3_000);

  const [viewMode,          setViewMode]          = useState<ViewMode>("perspective");
  const [selectedZoneId,    setSelectedZoneId]    = useState<string | null>(null);
  const [selectedWorkerId,  setSelectedWorkerId]  = useState<string | null>(null);
  const [selectedTransport, setSelectedTransport] = useState<TransportId | null>(null);
  const [cameraTarget,      setCameraTarget]      = useState<CameraTarget | null>(null);
  const [isFullscreen,      setIsFullscreen]      = useState(false);

  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const vrTriggerRef     = useRef<(() => void) | undefined>(undefined);

  const zoneInsights = useZoneInsights(ZONES, data?.workers ?? []);

  const clearSelection = useCallback(() => {
    setSelectedZoneId(null);
    setSelectedWorkerId(null);
    setSelectedTransport(null);
    setCameraTarget(null);
  }, []);

  const handleZoneClick = useCallback((zoneId: string) => {
    if (selectedZoneId === zoneId) { clearSelection(); return; }
    const zone = ZONES.find((z) => z.id === zoneId);
    if (!zone) return;
    setSelectedZoneId(zoneId);
    setSelectedWorkerId(null);
    setSelectedTransport(null);
    setCameraTarget(cameraForZone(zone));
  }, [selectedZoneId, clearSelection]);

  const handleWorkerClick = useCallback((workerId: string) => {
    if (!data) return;
    if (selectedWorkerId === workerId) { clearSelection(); return; }
    const worker = data.workers.find((w) => w.id === workerId);
    if (!worker) return;
    setSelectedWorkerId(workerId);
    setSelectedZoneId(null);
    setSelectedTransport(null);
    setCameraTarget(cameraForWorker(worker));
  }, [selectedWorkerId, data, clearSelection]);

  const handleTransportClick = useCallback((id: TransportId) => {
    setSelectedTransport((prev) => prev === id ? null : id);
    setSelectedZoneId(null);
    setSelectedWorkerId(null);
    setCameraTarget(null);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const el = canvasWrapperRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  }, []);

  const selectedZoneInsight   = zoneInsights.find((i) => i.zone.id === selectedZoneId) ?? null;
  const selectedWorker        = data?.workers.find((w) => w.id === selectedWorkerId) ?? null;
  const selectedTransportItem = TRANSPORT_ITEMS.find((t) => t.id === selectedTransport) ?? null;
  const hasDetail             = !!(selectedZoneInsight || selectedWorker || selectedTransportItem);

  if (!data) return null;

  return (
    <DashboardShell
      order={15}
      title="3D Factory Monitoring & Surveillance"
      subtitle="Realtime Worker Presence · Zone Occupancy · Supply Chain"
      lastUpdated={lastUpdated}
    >

      {/* ── KPI row ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {data.kpis.map((kpi) => <KpiCard key={kpi.label} kpi={kpi} />)}
      </div>

      {/* ── Main 2-column layout (stacks on < xl) ───────────────── */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">

        {/* LEFT: canvas + zone cards + transport */}
        <div className="flex flex-col gap-4 min-w-0">

          {/* 3D canvas card */}
          <Card
            title="Factory Floor — Live 3D"
            subtitle="Click zone · worker · transport to focus"
            right={
              <div className="flex flex-wrap items-center gap-1.5">
                <ViewModeButtons viewMode={viewMode} onChange={setViewMode} />
                <button
                  type="button"
                  onClick={() => vrTriggerRef.current?.()}
                  title="Enter VR"
                  className="flex items-center gap-1 rounded-md border border-[var(--color-border)] px-2 py-1.5 text-[10px] font-semibold text-[var(--color-muted)] hover:border-purple-500 hover:text-purple-500 transition-colors"
                >
                  <Headset className="h-3 w-3" />
                  <span className="hidden sm:inline">VR</span>
                </button>
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                  className="flex items-center gap-1 rounded-md border border-[var(--color-border)] px-2 py-1.5 text-[10px] font-semibold text-[var(--color-muted)] hover:border-[var(--color-brand-blue)] hover:text-[var(--color-brand-blue)] transition-colors"
                >
                  {isFullscreen
                    ? <Minimize2 className="h-3 w-3" />
                    : <Maximize2 className="h-3 w-3" />}
                </button>
              </div>
            }
          >
            {/* Fluid canvas height: grows with viewport, never collapses */}
            <div
              ref={canvasWrapperRef}
              className="relative w-full overflow-hidden rounded-lg bg-[#0d1520]"
              style={{ height: "clamp(280px, 45vh, 600px)" }}
            >
              <FactoryScene
                data={data}
                viewMode={viewMode}
                cameraTarget={cameraTarget}
                selectedWorkerId={selectedWorkerId}
                onWorkerClick={handleWorkerClick}
                vrTriggerRef={vrTriggerRef}
              />
              <div className="absolute bottom-2 left-2 rounded bg-black/40 px-2 py-0.5 text-[9px] text-white/65 pointer-events-none select-none">
                Click worker to focus · Scroll to zoom · Drag to orbit
              </div>
            </div>
          </Card>

          {/* Zone cards */}
          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">
              Production Zones — click to zoom &amp; inspect
            </p>
            <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-0.5 px-0.5" style={{ scrollbarWidth: "thin" }}>
              {zoneInsights.map((insight) => (
                <ZoneCard
                  key={insight.zone.id}
                  insight={insight}
                  active={selectedZoneId === insight.zone.id}
                  onClick={() => handleZoneClick(insight.zone.id)}
                />
              ))}
            </div>
          </div>

          {/* Transport row */}
          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">
              Supply Chain &amp; Transport
            </p>
            <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-0.5 px-0.5" style={{ scrollbarWidth: "thin" }}>
              {TRANSPORT_ITEMS.map((item) => (
                <TransportCard
                  key={item.id}
                  item={item}
                  active={selectedTransport === item.id}
                  onClick={() => handleTransportClick(item.id)}
                />
              ))}
            </div>
          </div>

          {/* Detail panel — inline on mobile (below transport), beside canvas on xl */}
          <div className="xl:hidden space-y-3">
            {hasDetail && (
              <>
                {selectedZoneInsight && (
                  <ZoneInsightPanel insight={selectedZoneInsight}
                    onClose={() => { setSelectedZoneId(null); setCameraTarget(null); }} />
                )}
                {selectedWorker && (
                  <WorkerDetailPanel worker={selectedWorker}
                    onClose={() => { setSelectedWorkerId(null); setCameraTarget(null); }} />
                )}
                {selectedTransportItem && !selectedZoneInsight && !selectedWorker && (
                  <TransportDetailPanel item={selectedTransportItem}
                    onClose={() => setSelectedTransport(null)} />
                )}
              </>
            )}
          </div>
        </div>

        {/* RIGHT: detail panel + alerts + worker list + logistics (xl only) */}
        <div className="hidden xl:flex flex-col gap-4 min-w-0">

          {/* Detail panel */}
          {hasDetail && (
            <div>
              {selectedZoneInsight && (
                <ZoneInsightPanel insight={selectedZoneInsight}
                  onClose={() => { setSelectedZoneId(null); setCameraTarget(null); }} />
              )}
              {selectedWorker && (
                <WorkerDetailPanel worker={selectedWorker}
                  onClose={() => { setSelectedWorkerId(null); setCameraTarget(null); }} />
              )}
              {selectedTransportItem && !selectedZoneInsight && !selectedWorker && (
                <TransportDetailPanel item={selectedTransportItem}
                  onClose={() => setSelectedTransport(null)} />
              )}
            </div>
          )}

          {/* Active alerts */}
          <Card title="Active Alerts" subtitle={`(${data.alerts.length})`}>
            {data.alerts.length === 0 ? (
              <p className="text-[12px] text-[var(--color-muted)]">No active alerts.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {data.alerts.map((a) => (
                  <div key={a.id} className="flex items-start gap-2">
                    <StatusBadge
                      label={a.severity === "bad" ? "Alert" : "Warning"}
                      tone={a.severity === "bad" ? "bad" : "average"}
                    />
                    <span className="text-[11px] text-[var(--color-navy-900)] leading-snug">{a.text}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Worker list — clickable rows */}
          <Card title="Worker Presence" subtitle="Live · click to focus">
            <div className="flex flex-col gap-0.5 max-h-[280px] overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
              {data.workers.map((w) => {
                const col =
                  w.status === "present" ? "#22c55e" :
                  w.status === "idle"    ? "#f59e0b" :
                  w.status === "alert"   ? "#ef4444" : "#6b7280";
                return (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => handleWorkerClick(w.id)}
                    className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors w-full hover:bg-[var(--color-surface-secondary)] ${
                      selectedWorkerId === w.id
                        ? "bg-[var(--color-surface-secondary)] ring-1 ring-[var(--color-brand-blue)]"
                        : ""
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white flex-shrink-0"
                      style={{ background: col }}>
                      {w.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-semibold text-[var(--color-navy-900)] truncate">{w.name}</div>
                      <div className="text-[9px] font-mono text-[var(--color-muted)] truncate">{w.empId} · {w.zoneId}</div>
                    </div>
                    <StatusBadge label={w.status} tone={STATUS_TONE[w.status]} />
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Logistics summary */}
          <Card title="Logistics Today">
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: <PackageCheck className="h-4 w-4 text-green-500" />, label: "Deliveries",  value: "14" },
                { icon: <Train        className="h-4 w-4 text-slate-500"  />, label: "Train runs",  value: "3"  },
                { icon: <Truck        className="h-4 w-4 text-blue-500"   />, label: "Truck trips", value: "8"  },
                { icon: <Forklift     className="h-4 w-4 text-amber-500"  />, label: "Fork lifts",  value: "20" },
              ].map(({ icon, label, value }) => (
                <div key={label} className="flex items-center gap-2 rounded-lg p-2.5 bg-[var(--color-surface-secondary)]">
                  {icon}
                  <div>
                    <div className="text-[9px] text-[var(--color-muted)]">{label}</div>
                    <div className="text-[15px] font-bold text-[var(--color-navy-900)]">{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* ── Alerts + logistics grid on mobile / tablet ────────── */}
      <div className="xl:hidden grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card title="Active Alerts" subtitle={`(${data.alerts.length})`}>
          {data.alerts.length === 0 ? (
            <p className="text-[12px] text-[var(--color-muted)]">No active alerts.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {data.alerts.map((a) => (
                <div key={a.id} className="flex items-start gap-2">
                  <StatusBadge label={a.severity === "bad" ? "Alert" : "Warning"} tone={a.severity === "bad" ? "bad" : "average"} />
                  <span className="text-[11px] text-[var(--color-navy-900)] leading-snug">{a.text}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
        <Card title="Logistics Today">
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: <PackageCheck className="h-4 w-4 text-green-500" />, label: "Deliveries",  value: "14" },
              { icon: <Train        className="h-4 w-4 text-slate-500"  />, label: "Train runs",  value: "3"  },
              { icon: <Truck        className="h-4 w-4 text-blue-500"   />, label: "Truck trips", value: "8"  },
              { icon: <Forklift     className="h-4 w-4 text-amber-500"  />, label: "Fork lifts",  value: "20" },
            ].map(({ icon, label, value }) => (
              <div key={label} className="flex items-center gap-2 rounded-lg p-2.5 bg-[var(--color-surface-secondary)]">
                {icon}
                <div>
                  <div className="text-[9px] text-[var(--color-muted)]">{label}</div>
                  <div className="text-[15px] font-bold text-[var(--color-navy-900)]">{value}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

    </DashboardShell>
  );
}
