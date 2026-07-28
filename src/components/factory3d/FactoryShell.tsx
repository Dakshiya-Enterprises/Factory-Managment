/**
 * FactoryShell — building envelope: exterior ground, concrete floor,
 * steel walls, columns, roof trusses, ceiling strip lights.
 *
 * ROOF POLICY: we never render a solid opaque roof plane — it occludes
 * the interior from every external camera angle. The roof is implied by
 * the structural trusses + wall parapet only.
 */
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Zone } from "@/types/factory3d";

export const WALL_HEIGHT   = 8;
const WALL_T               = 0.28;   // wall thickness
const FLOOR_PAD            = 6;      // padding beyond zone extents
const COL_W                = 0.36;   // column flange width
const COL_H                = WALL_HEIGHT + 0.2;
const GROUND_HALF          = 100;    // half-size of outdoor ground plane

export interface FloorBounds {
  minX: number; maxX: number; minZ: number; maxZ: number;
  cx: number; cz: number; width: number; depth: number;
}

export function useFloorBounds(zones: Zone[]): FloorBounds {
  return useMemo(() => {
    const minX = Math.min(...zones.map((z) => z.bounds.x0)) - FLOOR_PAD;
    const maxX = Math.max(...zones.map((z) => z.bounds.x1)) + FLOOR_PAD;
    const minZ = Math.min(...zones.map((z) => z.bounds.z0)) - FLOOR_PAD;
    const maxZ = Math.max(...zones.map((z) => z.bounds.z1)) + FLOOR_PAD;
    return {
      minX, maxX, minZ, maxZ,
      cx: (minX + maxX) / 2,
      cz: (minZ + maxZ) / 2,
      width: maxX - minX,
      depth: maxZ - minZ,
    };
  }, [zones]);
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SteelColumn({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, COL_H / 2, z]}>
      {/* web */}
      <mesh castShadow>
        <boxGeometry args={[COL_W * 0.2, COL_H, COL_W]} />
        <meshStandardMaterial color="#455a64" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* flanges */}
      <mesh castShadow>
        <boxGeometry args={[COL_W, COL_H, COL_W * 0.18]} />
        <meshStandardMaterial color="#455a64" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
}

function TrussBeamX({ x0, x1, z, y }: { x0: number; x1: number; z: number; y: number }) {
  return (
    <mesh position={[(x0 + x1) / 2, y, z]} castShadow>
      <boxGeometry args={[x1 - x0, 0.13, 0.26]} />
      <meshStandardMaterial color="#37474f" metalness={0.85} roughness={0.25} />
    </mesh>
  );
}

function TrussBeamZ({ x, z0, z1, y }: { x: number; z0: number; z1: number; y: number }) {
  return (
    <mesh position={[x, y, (z0 + z1) / 2]} castShadow>
      <boxGeometry args={[0.26, 0.13, z1 - z0]} />
      <meshStandardMaterial color="#37474f" metalness={0.85} roughness={0.25} />
    </mesh>
  );
}

function CeilingStripLight({ x, z, length, axis }: {
  x: number; z: number; length: number; axis: "x" | "z";
}) {
  const ref = useRef<any>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.emissiveIntensity = 0.75 + Math.sin(clock.elapsedTime * 0.55 + x) * 0.06;
  });
  const [w, d] = axis === "x" ? [length, 0.2] : [0.2, length];
  return (
    <mesh ref={ref} position={[x, WALL_HEIGHT - 0.07, z]}>
      <boxGeometry args={[w, 0.05, d]} />
      <meshStandardMaterial ref={ref} color="#fffde7" emissive="#fff9c4" emissiveIntensity={0.75} />
    </mesh>
  );
}

function SafetyStripe({ x, z, length, axis }: {
  x: number; z: number; length: number; axis: "x" | "z";
}) {
  const [w, d] = axis === "x" ? [length, 0.13] : [0.13, length];
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.005, z]}>
      <planeGeometry args={[w, d]} />
      <meshBasicMaterial color="#f9a825" />
    </mesh>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function FactoryShell({ zones, crossSection }: { zones: Zone[]; crossSection: boolean }) {
  const { minX, maxX, minZ, maxZ, cx, cz, width, depth } = useFloorBounds(zones);

  const BEAM_STEP = 12;

  const colXs = useMemo(() => {
    const xs: number[] = [];
    for (let x = minX; x <= maxX + 0.1; x += BEAM_STEP) xs.push(x);
    if (xs[xs.length - 1] < maxX) xs.push(maxX);
    return xs;
  }, [minX, maxX]);

  const colZs = useMemo(() => {
    const zs: number[] = [];
    for (let z = minZ; z <= maxZ + 0.1; z += BEAM_STEP) zs.push(z);
    if (zs[zs.length - 1] < maxZ) zs.push(maxZ);
    return zs;
  }, [minZ, maxZ]);

  const stripLights = useMemo(() => {
    const lights: { x: number; z: number; length: number; axis: "x" | "z" }[] = [];
    for (let x = minX + 9; x < maxX; x += 14) {
      lights.push({ x, z: cz, length: depth * 0.72, axis: "z" });
    }
    return lights;
  }, [minX, maxX, cz, depth]);

  return (
    <group>

      {/* ── OUTDOOR TERRAIN ─────────────────────────────────────────── */}
      {/* Grass */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[cx, -0.02, cz]} receiveShadow>
        <planeGeometry args={[GROUND_HALF * 2, GROUND_HALF * 2]} />
        <meshStandardMaterial color="#4a6741" roughness={0.95} metalness={0.0} />
      </mesh>
      {/* Tarmac apron around building */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[cx, 0.0, cz]} receiveShadow>
        <planeGeometry args={[width + 22, depth + 22]} />
        <meshStandardMaterial color="#303540" roughness={0.9} metalness={0.05} />
      </mesh>
      {/* Road lane markings (dashed yellow) */}
      {[minX - 5, maxX + 5].map((rx, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[rx, 0.003, cz]}>
          <planeGeometry args={[0.25, depth + 18]} />
          <meshBasicMaterial color="#e8c840" />
        </mesh>
      ))}
      {[minZ - 5, maxZ + 5].map((rz, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[cx, 0.003, rz]}>
          <planeGeometry args={[width + 18, 0.25]} />
          <meshBasicMaterial color="#e8c840" />
        </mesh>
      ))}

      {/* ── INTERIOR FLOOR — light concrete ─────────────────────────── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[cx, 0.02, cz]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color="#c2c8d4" roughness={0.85} metalness={0.03} />
      </mesh>
      {/* Subtle grid overlay */}
      <gridHelper
        args={[Math.max(width, depth), Math.ceil(Math.max(width, depth) / 2), "#a0a8b5", "#b2b9c6"]}
        position={[cx, 0.022, cz]}
      />
      {/* Safety perimeter stripes */}
      <SafetyStripe x={cx} z={minZ + 2.2} length={width - 4} axis="x" />
      <SafetyStripe x={cx} z={maxZ - 2.2} length={width - 4} axis="x" />
      <SafetyStripe x={minX + 2.2} z={cz} length={depth - 4} axis="z" />
      <SafetyStripe x={maxX - 2.2} z={cz} length={depth - 4} axis="z" />

      {/* ── WALLS ──────────────────────────────────────────────────── */}
      {/* Each wall: exterior face (darker steel) + thin interior liner (off-white) */}
      {/* Back wall — always visible */}
      <mesh position={[cx, WALL_HEIGHT / 2, minZ - WALL_T / 2]} castShadow receiveShadow>
        <boxGeometry args={[width + WALL_T * 2, WALL_HEIGHT, WALL_T]} />
        <meshStandardMaterial color="#4a5568" metalness={0.55} roughness={0.5} />
      </mesh>
      <mesh position={[cx, WALL_HEIGHT / 2, minZ + 0.02]}>
        <boxGeometry args={[width, WALL_HEIGHT, 0.02]} />
        <meshStandardMaterial color="#dce3ef" roughness={0.8} />
      </mesh>

      {/* Front wall — hidden in cross-section */}
      <mesh position={[cx, WALL_HEIGHT / 2, maxZ + WALL_T / 2]} visible={!crossSection} castShadow receiveShadow>
        <boxGeometry args={[width + WALL_T * 2, WALL_HEIGHT, WALL_T]} />
        <meshStandardMaterial color="#4a5568" metalness={0.55} roughness={0.5} />
      </mesh>
      <mesh position={[cx, WALL_HEIGHT / 2, maxZ - 0.02]} visible={!crossSection}>
        <boxGeometry args={[width, WALL_HEIGHT, 0.02]} />
        <meshStandardMaterial color="#dce3ef" roughness={0.8} />
      </mesh>

      {/* Left wall — always visible */}
      <mesh position={[minX - WALL_T / 2, WALL_HEIGHT / 2, cz]} castShadow receiveShadow>
        <boxGeometry args={[WALL_T, WALL_HEIGHT, depth + WALL_T * 2]} />
        <meshStandardMaterial color="#4a5568" metalness={0.55} roughness={0.5} />
      </mesh>
      <mesh position={[minX + 0.02, WALL_HEIGHT / 2, cz]}>
        <boxGeometry args={[0.02, WALL_HEIGHT, depth]} />
        <meshStandardMaterial color="#dce3ef" roughness={0.8} />
      </mesh>

      {/* Right wall — hidden in cross-section */}
      <mesh position={[maxX + WALL_T / 2, WALL_HEIGHT / 2, cz]} visible={!crossSection} castShadow receiveShadow>
        <boxGeometry args={[WALL_T, WALL_HEIGHT, depth + WALL_T * 2]} />
        <meshStandardMaterial color="#4a5568" metalness={0.55} roughness={0.5} />
      </mesh>
      <mesh position={[maxX - 0.02, WALL_HEIGHT / 2, cz]} visible={!crossSection}>
        <boxGeometry args={[0.02, WALL_HEIGHT, depth]} />
        <meshStandardMaterial color="#dce3ef" roughness={0.8} />
      </mesh>

      {/* Parapet trim — cap on top of each wall */}
      {[
        [cx, WALL_HEIGHT + 0.1, minZ,  width + WALL_T * 2, 0.2, WALL_T + 0.1] as const,
        [cx, WALL_HEIGHT + 0.1, maxZ,  width + WALL_T * 2, 0.2, WALL_T + 0.1] as const,
        [minX, WALL_HEIGHT + 0.1, cz,  WALL_T + 0.1, 0.2, depth + WALL_T * 2] as const,
        [maxX, WALL_HEIGHT + 0.1, cz,  WALL_T + 0.1, 0.2, depth + WALL_T * 2] as const,
      ].map(([px, py, pz, pw, ph, pd], i) => (
        <mesh key={i} position={[px, py, pz]}>
          <boxGeometry args={[pw, ph, pd]} />
          <meshStandardMaterial color="#6b7a8d" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}

      {/* ── STRUCTURAL COLUMNS ─────────────────────────────────────── */}
      {colXs.flatMap((x) => [minZ, maxZ].map((z) => <SteelColumn key={`c-${x}-${z}`} x={x} z={z} />))}
      {colZs.flatMap((z) => [minX, maxX].map((x) => <SteelColumn key={`c-${x}-${z}`} x={x} z={z} />))}

      {/* ── ROOF TRUSSES (no solid roof — keeps interior visible) ────── */}
      {colZs.map((z) => <TrussBeamX key={`tx-${z}`} x0={minX} x1={maxX} z={z} y={WALL_HEIGHT - 0.25} />)}
      {colXs.map((x) => <TrussBeamZ key={`tz-${x}`} x={x} z0={minZ} z1={maxZ} y={WALL_HEIGHT - 0.42} />)}

      {/* ── CEILING STRIP LIGHTS ───────────────────────────────────── */}
      {stripLights.map((l, i) => (
        <CeilingStripLight key={i} x={l.x} z={l.z} length={l.length} axis={l.axis} />
      ))}

      {/* ── EXTERIOR DETAILS ───────────────────────────────────────── */}
      {/* Loading dock platform */}
      <mesh position={[cx - width * 0.22, 0.15, maxZ + 2.5]} receiveShadow>
        <boxGeometry args={[8, 0.3, 5]} />
        <meshStandardMaterial color="#555e6a" roughness={0.9} />
      </mesh>
      {/* Parking bay lines */}
      {[-3, -1, 1, 3].map((s, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[cx + s * 4.5, 0.004, maxZ + 12]}>
          <planeGeometry args={[3.5, 6]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.12} />
        </mesh>
      ))}

    </group>
  );
}
