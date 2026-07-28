import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import type { CameraDevice } from "@/types/factory3d";
import { DEVICE_COLOR } from "./colors";

/** Animated CCTV camera — body + lens + rotating scan cone */
export function CameraMarker({ camera }: { camera: CameraDevice }) {
  const coneRef = useRef<any>(null);
  const ledRef = useRef<any>(null);
  const isOnline = camera.status === "online";
  const color = DEVICE_COLOR[camera.status];

  useFrame(({ clock }) => {
    if (coneRef.current && isOnline) {
      coneRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.8) * 0.6;
    }
    if (ledRef.current && isOnline) {
      ledRef.current.emissiveIntensity = 0.6 + Math.sin(clock.elapsedTime * 3) * 0.4;
    }
  });

  const { x, y, z } = camera.position;

  return (
    <group position={[x, y, z]}>
      {/* Mount bracket */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[0.08, 0.3, 0.08]} />
        <meshStandardMaterial color="#37474f" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Camera body */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.5, 0.22, 0.22]} />
        <meshStandardMaterial color="#263238" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Lens ring */}
      <mesh position={[0.28, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.08, 0.025, 8, 16]} />
        <meshStandardMaterial color="#546e7a" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Lens glass */}
      <mesh position={[0.3, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <circleGeometry args={[0.065, 16]} />
        <meshStandardMaterial color="#1a237e" transparent opacity={0.8} metalness={0.5} roughness={0.1} />
      </mesh>

      {/* Status LED */}
      <mesh ref={ledRef} position={[-0.22, 0.08, 0.12]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshStandardMaterial
          ref={ledRef}
          color={color}
          emissive={color}
          emissiveIntensity={isOnline ? 0.8 : 0.2}
        />
      </mesh>

      {/* Scan cone — rotates when online */}
      <group ref={coneRef} position={[0.2, -0.05, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <coneGeometry args={[0.9, 1.8, 16, 1, true]} />
          <meshStandardMaterial
            color={color}
            transparent
            opacity={isOnline ? 0.07 : 0.02}
            depthWrite={false}
            side={2}
          />
        </mesh>
      </group>

      {/* Point light glow if online */}
      {isOnline && (
        <pointLight color="#4fc3f7" intensity={0.4} distance={4} decay={2} position={[0.3, 0, 0]} />
      )}

      {/* Tooltip */}
      <Html position={[0, 0.55, 0]} center>
        <div
          style={{
            fontSize: 9,
            fontFamily: "monospace",
            color: color,
            background: "rgba(10,16,28,0.75)",
            border: `1px solid ${color}55`,
            borderRadius: 3,
            padding: "1px 5px",
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}
        >
          {camera.id} · {camera.status}
        </div>
      </Html>
    </group>
  );
}
