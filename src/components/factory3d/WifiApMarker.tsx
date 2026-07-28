import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { WifiAccessPoint } from "@/types/factory3d";
import { DEVICE_COLOR } from "./colors";

/** WiFi access point — antenna shape with animated pulse ring */
export function WifiApMarker({ ap }: { ap: WifiAccessPoint }) {
  const color = DEVICE_COLOR[ap.status];
  const pulseRef = useRef<any>(null);
  const isOnline = ap.status === "online";

  useFrame(({ clock }) => {
    if (pulseRef.current && isOnline) {
      const t = (clock.elapsedTime * 0.8) % 1;
      pulseRef.current.scale.setScalar(0.8 + t * 0.6);
      pulseRef.current.material.opacity = (1 - t) * 0.25;
    }
  });

  return (
    <group position={[ap.position.x, ap.position.y, ap.position.z]}>
      {/* Mounting disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.05, 12]} />
        <meshStandardMaterial color="#37474f" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Main antenna dome */}
      <mesh position={[0, 0.18, 0]}>
        <sphereGeometry args={[0.22, 12, 12]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isOnline ? 0.6 : 0.1} metalness={0.4} roughness={0.5} />
      </mesh>

      {/* Antenna stub */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.35, 6]} />
        <meshStandardMaterial color="#546e7a" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Animated pulse ring */}
      <mesh ref={pulseRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <torusGeometry args={[ap.rangeMeters * 0.25, 0.05, 4, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} depthWrite={false} />
      </mesh>

      {/* Static range halo */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[ap.rangeMeters * 0.22, ap.rangeMeters * 0.28, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.06} depthWrite={false} />
      </mesh>
    </group>
  );
}
