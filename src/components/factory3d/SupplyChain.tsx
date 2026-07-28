/**
 * SupplyChain — exterior + interior transport layer.
 *
 *  • Train       — freight locomotive + wagons running on a rail line
 *                  along the left exterior of the building.
 *  • DeliveryTruck — articulated lorry that loops in/out of the
 *                  loading bay on the front face.
 *  • Forklift    — two forklifts that patrol the interior aisles,
 *                  lifting/lowering their mast as they move.
 *  • DeliveryAgent — worker who carries a package from the truck
 *                  to the building entrance and back.
 *
 * All movement is driven by clock.elapsedTime — no external state.
 * Waypoints are baked from the FloorBounds, so nothing hardcodes
 * specific zone coordinates.
 */

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { FloorBounds } from "./FactoryShell";

// ── Shared helpers ────────────────────────────────────────────────────────────

/** Linear interpolation of position along an array of waypoints, looping. */
function waypointPosition(waypoints: THREE.Vector3[], t: number): THREE.Vector3 {
  const n = waypoints.length;
  const total = n; // one unit of t per segment
  const tWrapped = ((t % total) + total) % total;
  const segIdx = Math.floor(tWrapped);
  const frac   = tWrapped - segIdx;
  const a = waypoints[segIdx % n];
  const b = waypoints[(segIdx + 1) % n];
  return new THREE.Vector3().lerpVectors(a, b, frac);
}

/** Smoothed look-at heading (yaw only). */
function headingY(from: THREE.Vector3, to: THREE.Vector3): number {
  const dx = to.x - from.x;
  const dz = to.z - from.z;
  return Math.atan2(dx, dz);
}

// ── Shared materials (constants, never mutated) ───────────────────────────────
const MAT = {
  steelDark:  { color: "#263238", metalness: 0.88, roughness: 0.22 } as const,
  steelMid:   { color: "#37474f", metalness: 0.82, roughness: 0.28 } as const,
  steelLight: { color: "#546e7a", metalness: 0.75, roughness: 0.35 } as const,
  rubber:     { color: "#181818", metalness: 0.0,  roughness: 0.95 } as const,
  glass:      { color: "#b3e5fc", metalness: 0.1,  roughness: 0.05, transparent: true, opacity: 0.45 } as const,
  yellow:     { color: "#f9a825", metalness: 0.2,  roughness: 0.6  } as const,
  white:      { color: "#eceff1", metalness: 0.1,  roughness: 0.7  } as const,
  red:        { color: "#c62828", metalness: 0.3,  roughness: 0.5  } as const,
};

// ─────────────────────────────────────────────────────────────────────────────
// TRAIN
// ─────────────────────────────────────────────────────────────────────────────

function TrackTie({ z }: { z: number }) {
  return (
    <mesh position={[0, 0.05, z]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
      <boxGeometry args={[2.6, 0.1, 0.22]} />
      <meshStandardMaterial color="#5d4037" roughness={0.95} />
    </mesh>
  );
}

function RailTrack({ trackX, z0, z1 }: { trackX: number; z0: number; z1: number }) {
  const len = z1 - z0;
  const tieCount = Math.ceil(len / 1.2);
  return (
    <group position={[trackX, 0, 0]}>
      {/* Ballast bed */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, (z0 + z1) / 2]} receiveShadow>
        <planeGeometry args={[3.6, len]} />
        <meshStandardMaterial color="#5a5a5a" roughness={0.98} />
      </mesh>
      {/* Left rail */}
      <mesh position={[-0.72, 0.1, (z0 + z1) / 2]}>
        <boxGeometry args={[0.1, 0.1, len]} />
        <meshStandardMaterial {...MAT.steelLight} />
      </mesh>
      {/* Right rail */}
      <mesh position={[0.72, 0.1, (z0 + z1) / 2]}>
        <boxGeometry args={[0.1, 0.1, len]} />
        <meshStandardMaterial {...MAT.steelLight} />
      </mesh>
      {/* Ties */}
      {Array.from({ length: tieCount }, (_, i) => (
        <TrackTie key={i} z={z0 + i * (len / tieCount) + 0.6} />
      ))}
    </group>
  );
}

function Locomotive({ color }: { color: string }) {
  return (
    <group>
      {/* Body */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <boxGeometry args={[2.0, 1.8, 5.5]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Cab */}
      <mesh position={[0, 2.4, -1.6]} castShadow>
        <boxGeometry args={[1.8, 1.0, 2.2]} />
        <meshStandardMaterial color={color} metalness={0.45} roughness={0.45} />
      </mesh>
      {/* Windshield */}
      <mesh position={[0, 2.6, -2.75]}>
        <boxGeometry args={[1.4, 0.7, 0.06]} />
        <meshStandardMaterial {...MAT.glass} />
      </mesh>
      {/* Chimney / exhaust */}
      <mesh position={[0, 3.1, 1.5]} castShadow>
        <cylinderGeometry args={[0.18, 0.22, 0.7, 10]} />
        <meshStandardMaterial {...MAT.steelDark} />
      </mesh>
      {/* Headlight */}
      <mesh position={[0, 1.6, -2.76]}>
        <circleGeometry args={[0.18, 12]} />
        <meshStandardMaterial color="#fffde7" emissive="#fff176" emissiveIntensity={1.2} />
      </mesh>
      {/* Wheels */}
      {[-1.5, 0, 1.5].map((wz, i) => (
        [- 1.05, 1.05].map((wx) => (
          <mesh key={`${i}-${wx}`} position={[wx, 0.38, wz]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.38, 0.38, 0.18, 16]} />
            <meshStandardMaterial {...MAT.rubber} />
          </mesh>
        ))
      ))}
    </group>
  );
}

function FreightWagon({ color }: { color: string }) {
  return (
    <group>
      <mesh position={[0, 1.1, 0]} castShadow>
        <boxGeometry args={[2.0, 1.6, 4.8]} />
        <meshStandardMaterial color={color} metalness={0.45} roughness={0.55} />
      </mesh>
      {/* Cargo markings */}
      <mesh position={[1.02, 1.1, 0]}>
        <boxGeometry args={[0.02, 1.0, 3.0]} />
        <meshStandardMaterial color="#fff" transparent opacity={0.3} />
      </mesh>
      {[-1.4, 0, 1.4].map((wz, i) =>
        [-1.05, 1.05].map((wx) => (
          <mesh key={`${i}-${wx}`} position={[wx, 0.36, wz]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.36, 0.36, 0.16, 14]} />
            <meshStandardMaterial {...MAT.rubber} />
          </mesh>
        ))
      )}
    </group>
  );
}

/** Full train — locomotive + wagons — moves along a Z-axis track. */
export function Train({ trackX, z0, z1, speed = 6 }: {
  trackX: number; z0: number; z1: number; speed?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const locoRef  = useRef<THREE.Group>(null);
  const smokeRef = useRef<THREE.Mesh>(null);
  const range = z1 - z0;

  useFrame(({ clock }) => {
    const t   = clock.elapsedTime;
    const pos = ((t * speed) % range + range) % range;
    const zPos = z0 + pos;

    if (groupRef.current) {
      groupRef.current.position.set(trackX, 0, zPos);
      // direction — reverse at ends by mapping 0-range as ping-pong
      const goingForward = Math.floor((t * speed) / range) % 2 === 0;
      groupRef.current.rotation.y = goingForward ? 0 : Math.PI;
    }
    if (smokeRef.current) {
      // puff smoke particle (scale pulse)
      const puff = 1 + Math.sin(t * 4) * 0.15;
      smokeRef.current.scale.setScalar(puff);
    }
  });

  const WAGON_COLORS = ["#b71c1c", "#1a237e", "#1b5e20", "#4a148c"];

  return (
    <>
      <RailTrack trackX={trackX} z0={z0} z1={z1} />
      <group ref={groupRef}>
        <group ref={locoRef}>
          <Locomotive color="#212121" />
        </group>
        {/* Smoke puff above chimney */}
        <mesh ref={smokeRef} position={[0, 4.0, 1.5]}>
          <sphereGeometry args={[0.35, 8, 6]} />
          <meshStandardMaterial color="#888" transparent opacity={0.22} depthWrite={false} />
        </mesh>
        {/* Wagons trailing behind */}
        {WAGON_COLORS.map((wc, i) => (
          <group key={i} position={[0, 0, 6 + i * 5.5]}>
            <FreightWagon color={wc} />
          </group>
        ))}
      </group>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DELIVERY TRUCK
// ─────────────────────────────────────────────────────────────────────────────

function TruckBody({ color }: { color: string }) {
  return (
    <group>
      {/* Cab */}
      <mesh position={[0, 1.4, -3.2]} castShadow>
        <boxGeometry args={[2.2, 2.2, 2.6]} />
        <meshStandardMaterial color={color} metalness={0.4} roughness={0.5} />
      </mesh>
      {/* Windshield */}
      <mesh position={[0, 1.95, -4.52]}>
        <boxGeometry args={[1.8, 1.0, 0.05]} />
        <meshStandardMaterial {...MAT.glass} />
      </mesh>
      {/* Headlights */}
      {[-0.7, 0.7].map((hx, i) => (
        <mesh key={i} position={[hx, 1.15, -4.55]}>
          <circleGeometry args={[0.22, 10]} />
          <meshStandardMaterial color="#fffde7" emissive="#fff9c4" emissiveIntensity={0.8} />
        </mesh>
      ))}
      {/* Cargo box */}
      <mesh position={[0, 1.85, 1.0]} castShadow>
        <boxGeometry args={[2.2, 2.8, 7.0]} />
        <meshStandardMaterial {...MAT.white} />
      </mesh>
      {/* Company branding stripe */}
      <mesh position={[1.12, 1.85, 1.0]}>
        <boxGeometry args={[0.02, 1.6, 6.0]} />
        <meshStandardMaterial color="#1976d2" metalness={0.1} roughness={0.6} />
      </mesh>
      {/* Rear door */}
      <mesh position={[0, 1.85, 4.52]}>
        <boxGeometry args={[2.0, 2.6, 0.05]} />
        <meshStandardMaterial color="#bdbdbd" metalness={0.3} roughness={0.6} />
      </mesh>
      {/* Wheels — 3 axles */}
      {[-2.8, -0.5, 2.2].map((wz, i) =>
        [-1.15, 1.15].map((wx) => (
          <mesh key={`${i}-${wx}`} position={[wx, 0.55, wz]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.55, 0.55, 0.28, 16]} />
            <meshStandardMaterial {...MAT.rubber} />
          </mesh>
        ))
      )}
    </group>
  );
}

/** Truck loops: drives in from road → parks at loading dock → backs out. */
export function DeliveryTruck({ bounds }: { bounds: FloorBounds }) {
  const ref = useRef<THREE.Group>(null);
  const prevPos = useRef(new THREE.Vector3());

  const dockX = bounds.cx - bounds.width * 0.22;
  const dockZ = bounds.maxZ + 2;

  // Waypoints: road approach → dock → road exit
  const waypoints = [
    new THREE.Vector3(dockX, 0, bounds.maxZ + 30),
    new THREE.Vector3(dockX, 0, dockZ),
    new THREE.Vector3(dockX, 0, dockZ),       // pause at dock
    new THREE.Vector3(dockX, 0, dockZ),
    new THREE.Vector3(dockX, 0, bounds.maxZ + 30),
    new THREE.Vector3(dockX + 20, 0, bounds.maxZ + 30), // loop around
  ];

  useFrame(({ clock }) => {
    const t   = clock.elapsedTime * 0.18;
    const pos = waypointPosition(waypoints, t);
    const nextPos = waypointPosition(waypoints, t + 0.01);

    if (ref.current) {
      ref.current.position.copy(pos);
      if (!pos.equals(nextPos)) {
        ref.current.rotation.y = headingY(pos, nextPos);
      }
    }
    prevPos.current.copy(pos);
  });

  return (
    <group ref={ref}>
      <TruckBody color="#e53935" />
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FORKLIFT (interior)
// ─────────────────────────────────────────────────────────────────────────────

function ForkliftMesh({ mastHeight }: { mastHeight: number }) {
  return (
    <group>
      {/* Body */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[1.0, 1.0, 1.6]} />
        <meshStandardMaterial {...MAT.yellow} />
      </mesh>
      {/* Counterweight bump */}
      <mesh position={[0, 0.5, 0.85]} castShadow>
        <boxGeometry args={[0.9, 0.7, 0.5]} />
        <meshStandardMaterial {...MAT.steelDark} />
      </mesh>
      {/* Cab */}
      <mesh position={[0, 1.15, -0.1]} castShadow>
        <boxGeometry args={[0.85, 0.5, 1.1]} />
        <meshStandardMaterial {...MAT.yellow} />
      </mesh>
      {/* Operator */}
      <mesh position={[0, 1.5, -0.1]}>
        <sphereGeometry args={[0.18, 8, 8]} />
        <meshStandardMaterial color="#f5cba7" roughness={0.8} />
      </mesh>
      {/* Mast */}
      {[-0.28, 0.28].map((mx, i) => (
        <mesh key={i} position={[mx, mastHeight / 2 + 0.9, -0.85]} castShadow>
          <boxGeometry args={[0.08, mastHeight, 0.08]} />
          <meshStandardMaterial {...MAT.steelMid} />
        </mesh>
      ))}
      {/* Carriage */}
      <mesh position={[0, mastHeight * 0.7 + 0.9, -0.9]}>
        <boxGeometry args={[0.7, 0.15, 0.12]} />
        <meshStandardMaterial {...MAT.steelDark} />
      </mesh>
      {/* Forks */}
      {[-0.22, 0.22].map((fx, i) => (
        <mesh key={i} position={[fx, mastHeight * 0.7 + 0.82, -1.2]}>
          <boxGeometry args={[0.08, 0.06, 0.65]} />
          <meshStandardMaterial {...MAT.steelLight} />
        </mesh>
      ))}
      {/* Wheels */}
      {[-0.7, 0.7].flatMap((wx) =>
        [-0.5, 0.5].map((wz, i) => (
          <mesh key={`${wx}-${i}`} position={[wx, 0.22, wz]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.22, 0.22, 0.2, 12]} />
            <meshStandardMaterial {...MAT.rubber} />
          </mesh>
        ))
      )}
    </group>
  );
}

/** Single forklift patrolling an interior aisle. */
function Forklift({ waypoints, speed }: { waypoints: THREE.Vector3[]; speed: number }) {
  const ref     = useRef<THREE.Group>(null);
  const mastRef = useRef<number>(1.0);
  const prevPos = useRef(waypoints[0].clone());

  useFrame(({ clock }) => {
    const t   = clock.elapsedTime * speed;
    const pos = waypointPosition(waypoints, t);
    const next = waypointPosition(waypoints, t + 0.05);

    if (ref.current) {
      ref.current.position.copy(pos);
      if (pos.distanceTo(next) > 0.001) {
        ref.current.rotation.y = headingY(pos, next);
      }
    }
    // Mast goes up while stationary, down while moving
    const moving = pos.distanceTo(prevPos.current) > 0.01;
    mastRef.current = THREE.MathUtils.lerp(mastRef.current, moving ? 0.6 : 2.0, 0.04);
    prevPos.current.copy(pos);
  });

  return (
    <group ref={ref}>
      <ForkliftMesh mastHeight={mastRef.current} />
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DELIVERY AGENT
// ─────────────────────────────────────────────────────────────────────────────

function DeliveryAgent({ bounds }: { bounds: FloorBounds }) {
  const ref    = useRef<THREE.Group>(null);
  const armRef = useRef<THREE.Mesh>(null);

  const entranceX = bounds.cx;
  const entranceZ = bounds.maxZ;
  const dockX     = bounds.cx - bounds.width * 0.22;
  const dockZ     = bounds.maxZ + 4;

  const waypoints = [
    new THREE.Vector3(dockX, 0, dockZ + 6),
    new THREE.Vector3(dockX, 0, dockZ),
    new THREE.Vector3(entranceX, 0, entranceZ + 1),
    new THREE.Vector3(entranceX, 0, entranceZ + 1),
    new THREE.Vector3(dockX, 0, dockZ),
    new THREE.Vector3(dockX, 0, dockZ + 6),
  ];

  useFrame(({ clock }) => {
    const t   = clock.elapsedTime * 0.22;
    const pos = waypointPosition(waypoints, t);
    const next = waypointPosition(waypoints, t + 0.02);

    if (ref.current) {
      ref.current.position.copy(pos);
      if (pos.distanceTo(next) > 0.001) {
        ref.current.rotation.y = headingY(pos, next);
      }
      // walking bob
      ref.current.position.y = Math.abs(Math.sin(clock.elapsedTime * 4)) * 0.04;
    }
    // Arm swing
    if (armRef.current) {
      armRef.current.rotation.x = Math.sin(clock.elapsedTime * 4) * 0.3;
    }
  });

  return (
    <group ref={ref}>
      {/* Body */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <capsuleGeometry args={[0.2, 0.55, 4, 8]} />
        <meshStandardMaterial color="#1565c0" roughness={0.7} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.42, 0]} castShadow>
        <sphereGeometry args={[0.17, 10, 10]} />
        <meshStandardMaterial color="#f5cba7" roughness={0.8} />
      </mesh>
      {/* Hard-hat */}
      <mesh position={[0, 1.57, 0]}>
        <sphereGeometry args={[0.19, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#f57f17" roughness={0.5} />
      </mesh>
      {/* Package */}
      <mesh ref={armRef} position={[0.35, 0.85, -0.1]} castShadow>
        <boxGeometry args={[0.32, 0.28, 0.26]} />
        <meshStandardMaterial color="#a1887f" roughness={0.75} />
      </mesh>
      {/* Package tape */}
      <mesh position={[0.35, 0.85, -0.1]}>
        <boxGeometry args={[0.34, 0.04, 0.28]} />
        <meshStandardMaterial color="#b3e5fc" roughness={0.6} />
      </mesh>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUPPLY CHAIN — top-level export
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Places all transport/logistics elements relative to the factory bounds.
 * The train runs along the left exterior, trucks loop at the front,
 * forklifts patrol interior aisles, and a delivery agent shuttles packages.
 */
export function SupplyChain({ bounds }: { bounds: FloorBounds }) {
  const { minX, maxX, minZ, maxZ, cx, cz } = bounds;

  // Rail line: left exterior, clear of the building wall
  const trackX = minX - 14;
  const trackZ0 = minZ - 20;
  const trackZ1 = maxZ + 20;

  // Interior aisle waypoints
  const aisleZ  = (minZ + maxZ) / 2; // mid-depth aisle
  const aisleX1 = minX + 2;
  const aisleX2 = maxX - 2;

  const forkWaypoints1 = [
    new THREE.Vector3(aisleX1 + 2, 0, aisleZ - 8),
    new THREE.Vector3(aisleX2 - 2, 0, aisleZ - 8),
    new THREE.Vector3(aisleX2 - 2, 0, aisleZ + 4),
    new THREE.Vector3(aisleX1 + 2, 0, aisleZ + 4),
  ];

  const forkWaypoints2 = [
    new THREE.Vector3(cx - 5, 0, minZ + 4),
    new THREE.Vector3(cx + 5, 0, minZ + 4),
    new THREE.Vector3(cx + 5, 0, maxZ - 4),
    new THREE.Vector3(cx - 5, 0, maxZ - 4),
  ];

  return (
    <>
      {/* Freight train */}
      <Train trackX={trackX} z0={trackZ0} z1={trackZ1} speed={7} />

      {/* Delivery truck looping at front */}
      <DeliveryTruck bounds={bounds} />

      {/* Second parked truck */}
      <group position={[cx + 14, 0, maxZ + 8]} rotation={[0, Math.PI * 0.5, 0]}>
        <TruckBody color="#1565c0" />
      </group>

      {/* Interior forklifts */}
      <Forklift waypoints={forkWaypoints1} speed={0.14} />
      <Forklift waypoints={forkWaypoints2} speed={0.10} />

      {/* Delivery agent */}
      <DeliveryAgent bounds={bounds} />
    </>
  );
}
