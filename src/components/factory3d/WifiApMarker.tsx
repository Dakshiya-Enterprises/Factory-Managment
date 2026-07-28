import type { WifiAccessPoint } from "@/types/factory3d";
import { DEVICE_COLOR } from "./colors";

/** WiFi access point marker with a faint translucent range halo, colored by online/offline status. */
export function WifiApMarker({ ap }: { ap: WifiAccessPoint }) {
  const color = DEVICE_COLOR[ap.status];
  return (
    <group position={[ap.position.x, ap.position.y, ap.position.z]}>
      <mesh>
        <sphereGeometry args={[0.3, 12, 12]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
      </mesh>
      <mesh>
        <sphereGeometry args={[ap.rangeMeters * 0.3, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.05} depthWrite={false} />
      </mesh>
    </group>
  );
}
