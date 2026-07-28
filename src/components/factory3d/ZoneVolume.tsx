import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, Line } from "@react-three/drei";
import type { Zone } from "@/types/factory3d";

/** Animated corner post — glows in zone color */
function CornerPost({ x, z, color }: { x: number; z: number; color: string }) {
  const ref = useRef<any>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.emissiveIntensity = 0.4 + Math.sin(clock.elapsedTime * 1.5 + x) * 0.2;
    }
  });
  return (
    <mesh position={[x, 1.5, z]}>
      <cylinderGeometry args={[0.06, 0.06, 3, 8]} />
      <meshStandardMaterial ref={ref} color={color} emissive={color} emissiveIntensity={0.4} metalness={0.6} roughness={0.3} />
    </mesh>
  );
}

/** Thin animated border ring at floor level */
function ZoneBorder({ points, color }: { points: [number, number, number][]; color: string }) {
  const ref = useRef<any>(null);
  useFrame(({ clock }) => {
    if (ref.current?.material) {
      ref.current.material.opacity = 0.5 + Math.sin(clock.elapsedTime * 2) * 0.25;
    }
  });
  return (
    <Line
      ref={ref}
      points={points}
      color={color}
      lineWidth={2.5}
      transparent
      opacity={0.7}
    />
  );
}

export function ZoneVolume({ zone, crossSection }: { zone: Zone; crossSection: boolean }) {
  const { cx, cz, width, depth, x0, z0, x1, z1 } = useMemo(() => {
    const x0 = zone.bounds.x0;
    const x1 = zone.bounds.x1;
    const z0 = zone.bounds.z0;
    const z1 = zone.bounds.z1;
    return {
      cx: (x0 + x1) / 2,
      cz: (z0 + z1) / 2,
      width: x1 - x0,
      depth: z1 - z0,
      x0, x1, z0, z1,
    };
  }, [zone]);

  const borderPoints: [number, number, number][] = [
    [x0, 0.05, z0],
    [x1, 0.05, z0],
    [x1, 0.05, z1],
    [x0, 0.05, z1],
    [x0, 0.05, z0],
  ];

  const topBorderPoints: [number, number, number][] = [
    [x0, zone.height, z0],
    [x1, zone.height, z0],
    [x1, zone.height, z1],
    [x0, zone.height, z1],
    [x0, zone.height, z0],
  ];

  const verticalLines: [number, number, number][][] = [
    [[x0, 0.05, z0], [x0, zone.height, z0]],
    [[x1, 0.05, z0], [x1, zone.height, z0]],
    [[x1, 0.05, z1], [x1, zone.height, z1]],
    [[x0, 0.05, z1], [x0, zone.height, z1]],
  ];

  return (
    <group>
      {/* Floor tile — subtle tinted overlay */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[cx, 0.03, cz]}>
        <planeGeometry args={[width, depth]} />
        <meshBasicMaterial color={zone.color} transparent opacity={zone.kind === "restricted" ? 0.2 : 0.1} />
      </mesh>

      {/* Wire-frame box volume — visible in all views */}
      <ZoneBorder points={borderPoints} color={zone.color} />
      {!crossSection && (
        <>
          <ZoneBorder points={topBorderPoints} color={zone.color} />
          {verticalLines.map((pts, i) => (
            <Line key={i} points={pts} color={zone.color} lineWidth={1.5} transparent opacity={0.35} />
          ))}
        </>
      )}

      {/* Corner posts */}
      <CornerPost x={x0} z={z0} color={zone.color} />
      <CornerPost x={x1} z={z0} color={zone.color} />
      <CornerPost x={x0} z={z1} color={zone.color} />
      <CornerPost x={x1} z={z1} color={zone.color} />

      {/* Zone label — billboard style */}
      <Html position={[cx, zone.height + 0.8, cz]} center>
        <div
          style={{
            background: `${zone.color}22`,
            border: `1px solid ${zone.color}88`,
            borderRadius: 4,
            padding: "2px 8px",
            color: zone.color,
            fontWeight: 700,
            fontSize: 11,
            fontFamily: "monospace",
            letterSpacing: 1,
            whiteSpace: "nowrap",
            textShadow: `0 0 8px ${zone.color}`,
            backdropFilter: "blur(4px)",
            pointerEvents: "none",
          }}
        >
          {zone.label.toUpperCase()}
        </div>
      </Html>
    </group>
  );
}
