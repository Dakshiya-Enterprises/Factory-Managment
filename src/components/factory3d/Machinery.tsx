/**
 * Procedural industrial machinery built from primitive geometries.
 * Each "machine" type is a small self-contained scene graph.
 * Placed by FactoryScene into line/area zones based on zone kind.
 */
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Zone } from "@/types/factory3d";

// ── Shared materials (created once) ──────────────────────────────────────────
const METAL_DARK   = { color: "#263238", metalness: 0.85, roughness: 0.25 } as const;
const METAL_MID    = { color: "#37474f", metalness: 0.80, roughness: 0.30 } as const;
const METAL_LIGHT  = { color: "#546e7a", metalness: 0.75, roughness: 0.35 } as const;
const PANEL_BLUE   = { color: "#1565c0", metalness: 0.4,  roughness: 0.5  } as const;
const PANEL_GREEN  = { color: "#2e7d32", metalness: 0.4,  roughness: 0.5  } as const;
const PANEL_ORANGE = { color: "#e65100", metalness: 0.4,  roughness: 0.5  } as const;
const RUBBER       = { color: "#1a1a1a", metalness: 0.0,  roughness: 0.95 } as const;

function Mat({ cfg }: { cfg: typeof METAL_DARK }) {
  return <meshStandardMaterial {...cfg} />;
}

// ── CNC Milling Machine ───────────────────────────────────────────────────────
function CNCMachine({ x, z, color }: { x: number; z: number; color: string }) {
  const spindleRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (spindleRef.current) spindleRef.current.rotation.y = clock.elapsedTime * 12;
  });

  return (
    <group position={[x, 0, z]}>
      {/* Base cabinet */}
      <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 1.4, 1.4]} />
        <meshStandardMaterial {...METAL_MID} />
      </mesh>
      {/* Control panel front */}
      <mesh position={[0, 0.9, 0.72]}>
        <boxGeometry args={[1.6, 0.8, 0.04]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.6} />
      </mesh>
      {/* Screen */}
      <mesh position={[0.4, 1.05, 0.75]}>
        <boxGeometry args={[0.5, 0.35, 0.02]} />
        <meshStandardMaterial color="#0d1b2a" emissive="#1565c0" emissiveIntensity={0.6} />
      </mesh>
      {/* Buttons */}
      {[-0.3, -0.45, -0.6].map((bx, i) => (
        <mesh key={i} position={[bx, 0.82, 0.75]}>
          <cylinderGeometry args={[0.04, 0.04, 0.03, 8]} />
          <meshStandardMaterial color={i === 0 ? "#4caf50" : i === 1 ? "#f44336" : "#ff9800"} emissive={i === 0 ? "#4caf50" : "#000"} emissiveIntensity={0.8} />
        </mesh>
      ))}
      {/* Gantry column */}
      <mesh position={[-0.7, 2.0, 0]} castShadow>
        <boxGeometry args={[0.18, 1.6, 0.18]} />
        <meshStandardMaterial {...METAL_LIGHT} />
      </mesh>
      <mesh position={[0.7, 2.0, 0]} castShadow>
        <boxGeometry args={[0.18, 1.6, 0.18]} />
        <meshStandardMaterial {...METAL_LIGHT} />
      </mesh>
      {/* Cross-beam */}
      <mesh position={[0, 2.7, 0]}>
        <boxGeometry args={[1.6, 0.14, 0.14]} />
        <meshStandardMaterial {...METAL_DARK} />
      </mesh>
      {/* Spindle head */}
      <mesh ref={spindleRef} position={[0, 2.4, 0]}>
        <cylinderGeometry args={[0.12, 0.06, 0.5, 12]} />
        <meshStandardMaterial color="#78909c" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Work table */}
      <mesh position={[0, 1.45, 0]}>
        <boxGeometry args={[1.5, 0.06, 1.1]} />
        <meshStandardMaterial color="#455a64" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Work piece */}
      <mesh position={[0, 1.52, 0]}>
        <boxGeometry args={[0.4, 0.12, 0.3]} />
        <meshStandardMaterial color="#b0bec5" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Coolant hose */}
      <mesh position={[0.6, 1.8, 0.3]} rotation={[0.4, 0.3, 0.2]}>
        <cylinderGeometry args={[0.03, 0.03, 0.8, 6]} />
        <meshStandardMaterial {...RUBBER} />
      </mesh>
    </group>
  );
}

// ── Robotic Arm ───────────────────────────────────────────────────────────────
function RoboticArm({ x, z, color }: { x: number; z: number; color: string }) {
  const seg1Ref = useRef<THREE.Group>(null);
  const seg2Ref = useRef<THREE.Group>(null);
  const gripRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (seg1Ref.current) seg1Ref.current.rotation.y = Math.sin(t * 0.5) * 0.6;
    if (seg2Ref.current) seg2Ref.current.rotation.x = -0.4 + Math.sin(t * 0.7 + 1) * 0.3;
    if (gripRef.current) gripRef.current.rotation.z = Math.sin(t * 1.2) * 0.2;
  });

  return (
    <group position={[x, 0, z]}>
      {/* Base pedestal */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.5, 0.6, 16]} />
        <meshStandardMaterial {...METAL_DARK} />
      </mesh>
      {/* Base disc */}
      <mesh position={[0, 0.62, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.08, 16]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Segment 1 */}
      <group ref={seg1Ref} position={[0, 0.7, 0]}>
        <mesh position={[0, 0.55, 0]} castShadow>
          <boxGeometry args={[0.2, 1.1, 0.2]} />
          <meshStandardMaterial {...METAL_MID} />
        </mesh>
        {/* Joint 1 sphere */}
        <mesh position={[0, 1.1, 0]}>
          <sphereGeometry args={[0.15, 10, 10]} />
          <meshStandardMaterial {...METAL_LIGHT} />
        </mesh>
        {/* Segment 2 */}
        <group ref={seg2Ref} position={[0, 1.1, 0]}>
          <mesh position={[0, 0.45, 0.05]} castShadow>
            <boxGeometry args={[0.16, 0.9, 0.16]} />
            <meshStandardMaterial {...METAL_MID} />
          </mesh>
          {/* Joint 2 */}
          <mesh position={[0, 0.9, 0.05]}>
            <sphereGeometry args={[0.12, 10, 10]} />
            <meshStandardMaterial color={color} metalness={0.5} roughness={0.4} />
          </mesh>
          {/* Gripper */}
          <group ref={gripRef} position={[0, 0.9, 0.05]}>
            <mesh position={[0, 0.18, 0]}>
              <boxGeometry args={[0.12, 0.36, 0.12]} />
              <meshStandardMaterial {...METAL_DARK} />
            </mesh>
            {/* Fingers */}
            {[-1, 1].map((s, i) => (
              <mesh key={i} position={[s * 0.1, 0.42, 0]} rotation={[0, 0, s * 0.25]}>
                <boxGeometry args={[0.05, 0.18, 0.06]} />
                <meshStandardMaterial color="#b0bec5" metalness={0.7} roughness={0.3} />
              </mesh>
            ))}
            {/* LED eye */}
            <mesh position={[0, 0.18, 0.07]}>
              <circleGeometry args={[0.03, 8]} />
              <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={1.2} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}

// ── Conveyor Belt with Rollers ────────────────────────────────────────────────
function ConveyorBelt({ x0, x1, z, color }: { x0: number; x1: number; z: number; color: string }) {
  const len = x1 - x0;
  const cx = (x0 + x1) / 2;
  const rollerCount = Math.max(2, Math.floor(len / 1.2));
  const rollerRefs = useRef<THREE.Mesh[]>([]);

  useFrame(({ clock }) => {
    rollerRefs.current.forEach((r) => {
      if (r) r.rotation.z = clock.elapsedTime * -3;
    });
  });

  return (
    <group position={[0, 0, z]}>
      {/* Left support leg */}
      <mesh position={[x0 + 0.1, 0.4, 0]} castShadow>
        <boxGeometry args={[0.1, 0.8, 0.5]} />
        <meshStandardMaterial {...METAL_DARK} />
      </mesh>
      {/* Right support leg */}
      <mesh position={[x1 - 0.1, 0.4, 0]} castShadow>
        <boxGeometry args={[0.1, 0.8, 0.5]} />
        <meshStandardMaterial {...METAL_DARK} />
      </mesh>
      {/* Frame rail left */}
      <mesh position={[cx, 0.82, -0.22]}>
        <boxGeometry args={[len, 0.07, 0.07]} />
        <meshStandardMaterial {...METAL_MID} />
      </mesh>
      {/* Frame rail right */}
      <mesh position={[cx, 0.82, 0.22]}>
        <boxGeometry args={[len, 0.07, 0.07]} />
        <meshStandardMaterial {...METAL_MID} />
      </mesh>
      {/* Belt surface */}
      <mesh position={[cx, 0.86, 0]}>
        <boxGeometry args={[len - 0.1, 0.04, 0.4]} />
        <meshStandardMaterial color="#1b1b1b" roughness={0.9} metalness={0.05} />
      </mesh>
      {/* Belt stripe markings */}
      {Array.from({ length: Math.floor(len / 1.5) }).map((_, i) => (
        <mesh key={i} position={[x0 + 0.75 + i * 1.5, 0.89, 0]}>
          <boxGeometry args={[0.06, 0.01, 0.38]} />
          <meshBasicMaterial color="#ffff00" />
        </mesh>
      ))}
      {/* Rollers */}
      {Array.from({ length: rollerCount }).map((_, i) => {
        const rx = x0 + ((i + 0.5) / rollerCount) * len;
        return (
          <mesh
            key={i}
            ref={(el) => { if (el) rollerRefs.current[i] = el; }}
            position={[rx, 0.82, 0]}
            rotation={[0, 0, 0]}
          >
            <cylinderGeometry args={[0.05, 0.05, 0.46, 8]} />
            <meshStandardMaterial color="#546e7a" metalness={0.8} roughness={0.2} />
          </mesh>
        );
      })}
      {/* Box items on belt */}
      {Array.from({ length: Math.max(1, Math.floor(len / 3)) }).map((_, i) => (
        <mesh key={i} position={[x0 + 1 + i * 3, 0.98, 0]} castShadow>
          <boxGeometry args={[0.35, 0.3, 0.28]} />
          <meshStandardMaterial color={color} metalness={0.1} roughness={0.8} opacity={0.9} transparent />
        </mesh>
      ))}
    </group>
  );
}

// ── Storage Rack ──────────────────────────────────────────────────────────────
function StorageRack({ x, z }: { x: number; z: number }) {
  const shelves = [0.7, 1.4, 2.1, 2.8];
  return (
    <group position={[x, 0, z]}>
      {/* Uprights */}
      {[-0.75, 0.75].map((ox, i) => (
        <mesh key={i} position={[ox, 1.6, 0]} castShadow>
          <boxGeometry args={[0.06, 3.2, 0.06]} />
          <meshStandardMaterial color="#f57f17" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}
      {/* Shelves */}
      {shelves.map((sy, i) => (
        <group key={i}>
          <mesh position={[0, sy, 0]}>
            <boxGeometry args={[1.55, 0.04, 0.6]} />
            <meshStandardMaterial color="#455a64" metalness={0.6} roughness={0.4} />
          </mesh>
          {/* Items on shelf */}
          {[- 0.45, 0, 0.45].map((bx, j) => (
            <mesh key={j} position={[bx, sy + 0.1 + (j % 2) * 0.05, 0]} castShadow>
              <boxGeometry args={[0.28, 0.2, 0.5]} />
              <meshStandardMaterial color={j === 0 ? "#1565c0" : j === 1 ? "#2e7d32" : "#c62828"} roughness={0.7} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

// ── Control Panel / Electrical Cabinet ───────────────────────────────────────
function ControlPanel({ x, z, color }: { x: number; z: number; color: string }) {
  const ledRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ledRef.current) {
      (ledRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        0.7 + Math.sin(clock.elapsedTime * 2.2) * 0.3;
    }
  });
  return (
    <group position={[x, 0, z]}>
      {/* Cabinet body */}
      <mesh position={[0, 1.0, 0]} castShadow>
        <boxGeometry args={[0.7, 2.0, 0.45]} />
        <meshStandardMaterial color="#263238" metalness={0.7} roughness={0.4} />
      </mesh>
      {/* Door panel */}
      <mesh position={[0, 1.0, 0.23]}>
        <boxGeometry args={[0.65, 1.85, 0.03]} />
        <meshStandardMaterial color={color} metalness={0.4} roughness={0.5} />
      </mesh>
      {/* HMI screen */}
      <mesh position={[0, 1.35, 0.26]}>
        <boxGeometry args={[0.4, 0.3, 0.02]} />
        <meshStandardMaterial color="#0d1b2a" emissive="#00897b" emissiveIntensity={0.7} />
      </mesh>
      {/* Indicator lights */}
      {[["#4caf50", -0.22, 0.75], ["#f44336", -0.22, 0.55], ["#ff9800", 0.22, 0.75]].map(([c, bx, by], i) => (
        <mesh key={i} ref={i === 0 ? ledRef : null} position={[bx as number, by as number, 0.26]}>
          <cylinderGeometry args={[0.035, 0.035, 0.04, 8]} />
          <meshStandardMaterial color={c as string} emissive={c as string} emissiveIntensity={0.9} />
        </mesh>
      ))}
      {/* Emergency stop */}
      <mesh position={[0.15, 0.55, 0.26]}>
        <cylinderGeometry args={[0.06, 0.06, 0.05, 12]} />
        <meshStandardMaterial color="#d32f2f" emissive="#d32f2f" emissiveIntensity={0.5} />
      </mesh>
      {/* Cable conduit */}
      <mesh position={[0, 0.05, 0.1]} rotation={[0.1, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.3, 6]} />
        <meshStandardMaterial {...RUBBER} />
      </mesh>
    </group>
  );
}

// ── Pressing / Stamping Machine ───────────────────────────────────────────────
function PressMachine({ x, z, color }: { x: number; z: number; color: string }) {
  const ramRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ramRef.current) {
      const t = (Math.sin(clock.elapsedTime * 1.8) + 1) / 2;
      ramRef.current.position.y = 1.6 - t * 0.5;
    }
  });
  return (
    <group position={[x, 0, z]}>
      {/* Base */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[1.2, 0.7, 0.9]} />
        <meshStandardMaterial {...METAL_DARK} />
      </mesh>
      {/* Frame arch left */}
      <mesh position={[-0.5, 1.6, 0]}>
        <boxGeometry args={[0.12, 2.2, 0.2]} />
        <meshStandardMaterial {...METAL_MID} />
      </mesh>
      {/* Frame arch right */}
      <mesh position={[0.5, 1.6, 0]}>
        <boxGeometry args={[0.12, 2.2, 0.2]} />
        <meshStandardMaterial {...METAL_MID} />
      </mesh>
      {/* Top crown */}
      <mesh position={[0, 2.75, 0]}>
        <boxGeometry args={[1.2, 0.2, 0.5]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Ram (animated) */}
      <mesh ref={ramRef} position={[0, 1.6, 0]} castShadow>
        <boxGeometry args={[0.6, 0.4, 0.55]} />
        <meshStandardMaterial color="#78909c" metalness={0.9} roughness={0.15} />
      </mesh>
      {/* Die plate */}
      <mesh position={[0, 0.73, 0]}>
        <boxGeometry args={[0.8, 0.06, 0.65]} />
        <meshStandardMaterial color="#b0bec5" metalness={0.85} roughness={0.1} />
      </mesh>
      {/* Status light */}
      <mesh position={[0, 2.9, 0]}>
        <sphereGeometry args={[0.09, 8, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.0} />
      </mesh>
    </group>
  );
}

// ── Main Zone Machinery Placer ────────────────────────────────────────────────
export function ZoneMachinery({ zone }: { zone: Zone }) {
  const x0 = zone.bounds.x0, x1 = zone.bounds.x1;
  const z0 = zone.bounds.z0, z1 = zone.bounds.z1;
  const w = x1 - x0, d = z1 - z0;
  const cx = (x0 + x1) / 2, cz = (z0 + z1) / 2;
  const color = zone.color;

  if (zone.kind === "line") {
    // 2 CNC machines + 1 conveyor + 1 press + 1 robotic arm + 2 control panels
    return (
      <group>
        <CNCMachine x={x0 + 2.5} z={z0 + 3} color={color} />
        <CNCMachine x={x0 + 7}   z={z0 + 3} color={color} />
        <PressMachine x={x1 - 3}  z={z0 + 3} color={color} />
        <RoboticArm   x={x0 + 2.5} z={z1 - 3.5} color={color} />
        <ConveyorBelt x0={x0 + 1} x1={x1 - 1} z={cz} color={color} />
        <ControlPanel x={x1 - 1.5} z={z1 - 2} color={color} />
        <ControlPanel x={x0 + 1.5} z={z1 - 2} color={color} />
        <StorageRack  x={x1 - 2}   z={z0 + 2.5} />
      </group>
    );
  }

  if (zone.kind === "area") {
    // Cutting / Sewing / Finishing: row of work tables + racks + panels
    const tableCount = Math.max(2, Math.floor(w / 5));
    return (
      <group>
        {Array.from({ length: tableCount }).map((_, i) => {
          const tx = x0 + 3 + i * ((w - 4) / Math.max(tableCount - 1, 1));
          return <CNCMachine key={i} x={tx} z={cz} color={color} />;
        })}
        <RoboticArm x={cx} z={z0 + 2.5} color={color} />
        <ConveyorBelt x0={x0 + 1.5} x1={x1 - 1.5} z={z1 - 2} color={color} />
        <ControlPanel x={x1 - 1.5} z={z0 + 2} color={color} />
        <StorageRack  x={x0 + 1.5} z={z0 + 3} />
        <StorageRack  x={x1 - 1.5} z={z1 - 3} />
      </group>
    );
  }

  if (zone.kind === "restricted") {
    // Chemical store: just shelves + control panel
    return (
      <group>
        <StorageRack x={cx - 2} z={cz} />
        <StorageRack x={cx + 2} z={cz} />
        <ControlPanel x={cx} z={z0 + 1.8} color={color} />
      </group>
    );
  }

  return null;
}
