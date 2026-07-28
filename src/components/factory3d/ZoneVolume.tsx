import { useMemo } from "react";
import { Html } from "@react-three/drei";
import type { Zone } from "@/types/factory3d";

/** Procedural translucent volume + floor tile for one zone, derived entirely from zone.bounds. */
export function ZoneVolume({ zone, crossSection }: { zone: Zone; crossSection: boolean }) {
  const { cx, cz, width, depth } = useMemo(() => {
    return {
      cx: (zone.bounds.x0 + zone.bounds.x1) / 2,
      cz: (zone.bounds.z0 + zone.bounds.z1) / 2,
      width: zone.bounds.x1 - zone.bounds.x0,
      depth: zone.bounds.z1 - zone.bounds.z0,
    };
  }, [zone]);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[cx, 0.03, cz]}>
        <planeGeometry args={[width, depth]} />
        <meshBasicMaterial color={zone.color} transparent opacity={zone.kind === "restricted" ? 0.35 : 0.22} />
      </mesh>
      <mesh position={[cx, zone.height / 2, cz]}>
        <boxGeometry args={[width, zone.height, depth]} />
        <meshStandardMaterial color={zone.color} transparent opacity={crossSection ? 0.28 : 0.14} />
      </mesh>
      <Html position={[cx, zone.height + 0.5, cz]} center>
        <div
          style={{
            color: zone.color,
            fontWeight: 700,
            fontSize: 12,
            whiteSpace: "nowrap",
            textShadow: "0 1px 3px rgba(0,0,0,0.7)",
            pointerEvents: "none",
          }}
        >
          {zone.label}
        </div>
      </Html>
    </group>
  );
}
