import type { CameraDevice } from "@/types/factory3d";
import { DEVICE_COLOR } from "./colors";

/** Small cone marker at each CCTV camera's mounted position, colored by online/offline status. */
export function CameraMarker({ camera }: { camera: CameraDevice }) {
  const color = DEVICE_COLOR[camera.status];
  return (
    <mesh position={[camera.position.x, camera.position.y, camera.position.z]} rotation={[Math.PI, 0, 0]}>
      <coneGeometry args={[0.35, 0.6, 12]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} />
    </mesh>
  );
}
