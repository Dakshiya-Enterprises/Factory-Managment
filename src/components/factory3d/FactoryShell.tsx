import { useMemo } from "react";
import { DoubleSide } from "three";
import type { Zone } from "@/types/factory3d";

export const WALL_HEIGHT = 6;
const WALL_THICKNESS = 0.3;
const FLOOR_PAD = 4;

export interface FloorBounds {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  cx: number;
  cz: number;
  width: number;
  depth: number;
}

/** Bounding box of the shared factory floor, derived from all zone footprints. */
export function useFloorBounds(zones: Zone[]): FloorBounds {
  return useMemo(() => {
    const minX = Math.min(...zones.map((z) => z.bounds.x0)) - FLOOR_PAD;
    const maxX = Math.max(...zones.map((z) => z.bounds.x1)) + FLOOR_PAD;
    const minZ = Math.min(...zones.map((z) => z.bounds.z0)) - FLOOR_PAD;
    const maxZ = Math.max(...zones.map((z) => z.bounds.z1)) + FLOOR_PAD;
    return { minX, maxX, minZ, maxZ, cx: (minX + maxX) / 2, cz: (minZ + maxZ) / 2, width: maxX - minX, depth: maxZ - minZ };
  }, [zones]);
}

/**
 * Procedural floor + perimeter walls + roof, sized from the zone bounding box —
 * no authored building model. Roof and the two "front" walls hide when
 * `crossSection` is on so the interior reads clearly (a visibility-toggle
 * cutaway, not true geometric clipping — see plan notes for the v2 upgrade).
 */
export function FactoryShell({ zones, crossSection }: { zones: Zone[]; crossSection: boolean }) {
  const { minX, maxX, minZ, maxZ, cx, cz, width, depth } = useFloorBounds(zones);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[cx, 0, cz]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color="#c7cedd" />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[cx, WALL_HEIGHT, cz]} visible={!crossSection}>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color="#dfe4ef" transparent opacity={0.35} side={DoubleSide} />
      </mesh>

      <mesh position={[cx, WALL_HEIGHT / 2, minZ]}>
        <boxGeometry args={[width, WALL_HEIGHT, WALL_THICKNESS]} />
        <meshStandardMaterial color="#aeb8cc" />
      </mesh>
      <mesh position={[cx, WALL_HEIGHT / 2, maxZ]} visible={!crossSection}>
        <boxGeometry args={[width, WALL_HEIGHT, WALL_THICKNESS]} />
        <meshStandardMaterial color="#aeb8cc" />
      </mesh>
      <mesh position={[minX, WALL_HEIGHT / 2, cz]}>
        <boxGeometry args={[WALL_THICKNESS, WALL_HEIGHT, depth]} />
        <meshStandardMaterial color="#aeb8cc" />
      </mesh>
      <mesh position={[maxX, WALL_HEIGHT / 2, cz]} visible={!crossSection}>
        <boxGeometry args={[WALL_THICKNESS, WALL_HEIGHT, depth]} />
        <meshStandardMaterial color="#aeb8cc" />
      </mesh>
    </group>
  );
}
