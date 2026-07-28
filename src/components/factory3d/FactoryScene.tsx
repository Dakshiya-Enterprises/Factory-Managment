import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { FactoryShell, useFloorBounds, type FloorBounds } from "./FactoryShell";
import { ZoneVolume } from "./ZoneVolume";
import { WorkerInstances } from "./WorkerInstances";
import { CameraMarker } from "./CameraMarker";
import { WifiApMarker } from "./WifiApMarker";
import type { Factory3DData } from "@/types/factory3d";

export type ViewMode = "perspective" | "top-down" | "cross-section";

function SceneCamera({ viewMode, bounds }: { viewMode: ViewMode; bounds: FloorBounds }) {
  const { cx, cz, width, depth } = bounds;
  const span = Math.max(width, depth);

  if (viewMode === "top-down") {
    return <PerspectiveCamera makeDefault position={[cx, span * 1.6, cz + 0.01]} fov={45} />;
  }

  const elevated = viewMode === "cross-section";
  return (
    <PerspectiveCamera
      makeDefault
      position={[cx + span * (elevated ? 0.5 : 0.85), span * (elevated ? 0.85 : 0.55), cz + span * (elevated ? 0.5 : 0.85)]}
      fov={45}
    />
  );
}

/**
 * Purely presentational — receives already-fetched data + the current view
 * mode as props. No polling/fetching happens in here, so swapping the data
 * source later (real CCTV/WiFi pipeline) never touches this component tree.
 */
export function FactoryScene({ data, viewMode }: { data: Factory3DData; viewMode: ViewMode }) {
  const bounds = useFloorBounds(data.zones);
  const crossSection = viewMode === "cross-section";
  const roofHidden = crossSection || viewMode === "top-down";

  return (
    <Canvas shadows dpr={[1, 1.5]}>
      <color attach="background" args={["#1a2338"]} />
      <ambientLight intensity={0.65} />
      <directionalLight position={[bounds.cx + 20, 30, bounds.cz + 20]} intensity={0.9} castShadow />

      <SceneCamera viewMode={viewMode} bounds={bounds} />
      <OrbitControls
        makeDefault
        target={[bounds.cx, 1, bounds.cz]}
        enableRotate={viewMode !== "top-down"}
        maxPolarAngle={Math.PI / 2.1}
        minDistance={5}
        maxDistance={Math.max(bounds.width, bounds.depth) * 2}
      />

      <Suspense fallback={null}>
        <FactoryShell zones={data.zones} crossSection={roofHidden} />
        {data.zones.map((zone) => (
          <ZoneVolume key={zone.id} zone={zone} crossSection={crossSection} />
        ))}
        <WorkerInstances workers={data.workers} />
        {data.cameras.map((camera) => (
          <CameraMarker key={camera.id} camera={camera} />
        ))}
        {data.wifiAps.map((ap) => (
          <WifiApMarker key={ap.id} ap={ap} />
        ))}
      </Suspense>
    </Canvas>
  );
}
