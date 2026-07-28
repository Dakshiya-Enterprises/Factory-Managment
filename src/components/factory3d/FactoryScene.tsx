/**
 * FactoryScene — Canvas root + camera/VR interaction layer.
 *
 * Props contract:
 *   cameraTarget    — when set, camera smoothly flies to that position/lookAt
 *   selectedWorkerId — highlighted worker (yellow ring)
 *   onWorkerClick   — fired when a worker mesh is clicked in the scene
 *   vrTriggerRef    — caller writes a () => void into this ref to trigger VR
 */

import { Suspense, useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Sky } from "@react-three/drei";
import * as THREE from "three";

import { FactoryShell, useFloorBounds, type FloorBounds, WALL_HEIGHT } from "./FactoryShell";
import { ZoneVolume } from "./ZoneVolume";
import { ZoneMachinery } from "./Machinery";
import { WorkerInstances } from "./WorkerInstances";
import { CameraMarker } from "./CameraMarker";
import { WifiApMarker } from "./WifiApMarker";
import { SupplyChain } from "./SupplyChain";
import type { Factory3DData } from "@/types/factory3d";

// ── Public types ──────────────────────────────────────────────────────────────

export type ViewMode = "perspective" | "top-down" | "cross-section";

export interface CameraTarget {
  position: THREE.Vector3;
  lookAt: THREE.Vector3;
}

// ── Camera controller (lives inside Canvas) ───────────────────────────────────

function CameraController({
  target,
  controlsRef,
}: {
  target: CameraTarget | null;
  controlsRef: React.MutableRefObject<any>;
}) {
  const { camera } = useThree();
  const lerpT = useRef(0);
  const startPos = useRef(new THREE.Vector3());
  const startLook = useRef(new THREE.Vector3());

  // When target changes, reset lerp from current position
  const prevTarget = useRef<CameraTarget | null>(null);
  useEffect(() => {
    if (target && target !== prevTarget.current) {
      startPos.current.copy(camera.position);
      startLook.current.copy(controlsRef.current?.target ?? new THREE.Vector3());
      lerpT.current = 0;
      prevTarget.current = target;
    }
  });

  useFrame((_, delta) => {
    if (!target || !controlsRef.current) return;
    lerpT.current = Math.min(1, lerpT.current + delta * 1.6);
    const t = THREE.MathUtils.smoothstep(lerpT.current, 0, 1);

    camera.position.lerpVectors(startPos.current, target.position, t);
    controlsRef.current.target.lerpVectors(startLook.current, target.lookAt, t);
    controlsRef.current.update();
  });

  return null;
}

// ── WebXR VR handler (lives inside Canvas) ────────────────────────────────────

function VRHandler({ vrTriggerRef }: { vrTriggerRef: React.MutableRefObject<(() => void) | undefined> }) {
  const { gl } = useThree();

  useEffect(() => {
    vrTriggerRef.current = async () => {
      if (!navigator.xr) {
        alert("WebXR is not supported on this device or browser.");
        return;
      }
      const supported = await navigator.xr.isSessionSupported("immersive-vr");
      if (!supported) {
        alert("Immersive VR is not supported on this device.");
        return;
      }
      try {
        gl.xr.enabled = true;
        const session = await navigator.xr.requestSession("immersive-vr", {
          optionalFeatures: ["local-floor", "bounded-floor", "hand-tracking"],
        });
        await gl.xr.setSession(session as any);
      } catch (e) {
        console.error("VR session failed:", e);
      }
    };

    return () => {
      vrTriggerRef.current = undefined;
    };
  }, [gl, vrTriggerRef]);

  return null;
}

// ── Scene camera positions ────────────────────────────────────────────────────

function SceneCamera({ viewMode, bounds }: { viewMode: ViewMode; bounds: FloorBounds }) {
  const { cx, cz } = bounds;
  const span = Math.max(bounds.width, bounds.depth);

  if (viewMode === "top-down") {
    return <PerspectiveCamera makeDefault position={[cx, span * 1.45, cz + 0.01]} fov={48} />;
  }
  if (viewMode === "cross-section") {
    return (
      <PerspectiveCamera
        makeDefault
        position={[cx + span * 0.55, span * 0.55, cz + span * 0.55]}
        fov={52}
      />
    );
  }
  return (
    <PerspectiveCamera
      makeDefault
      position={[cx + span * 0.85, span * 0.45, cz + span * 0.85]}
      fov={52}
    />
  );
}

// ── Ceiling pendant lamp ──────────────────────────────────────────────────────

function PendantLamp({ x, z }: { x: number; z: number }) {
  const matRef = useRef<any>(null);
  useFrame(({ clock }) => {
    if (matRef.current) {
      matRef.current.emissiveIntensity = 0.9 + Math.sin(clock.elapsedTime * 0.7 + x) * 0.05;
    }
  });
  return (
    <group position={[x, WALL_HEIGHT - 0.05, z]}>
      <mesh>
        <cylinderGeometry args={[0.013, 0.013, 0.85, 4]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <mesh position={[0, -0.62, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.34, 0.38, 16]} />
        <meshStandardMaterial color="#455a64" metalness={0.88} roughness={0.22} side={2} />
      </mesh>
      <mesh ref={matRef} position={[0, -0.62, 0]}>
        <sphereGeometry args={[0.075, 8, 8]} />
        <meshStandardMaterial ref={matRef} color="#fff9c4" emissive="#fff176" emissiveIntensity={0.9} />
      </mesh>
      <pointLight position={[0, -0.8, 0]} color="#fff8e1" intensity={22} distance={22} decay={2} />
    </group>
  );
}

function CeilingLamps({ bounds }: { bounds: FloorBounds }) {
  const { minX, maxX, minZ, maxZ } = bounds;
  const lamps: { x: number; z: number }[] = [];
  for (let x = minX + 7; x < maxX - 2; x += 12) {
    for (let z = minZ + 6; z < maxZ - 2; z += 10) lamps.push({ x, z });
  }
  return <>{lamps.map(({ x, z }, i) => <PendantLamp key={i} x={x} z={z} />)}</>;
}

// ── Roof vent ─────────────────────────────────────────────────────────────────

function RoofVent({ x, z }: { x: number; z: number }) {
  const bladeRef = useRef<any>(null);
  useFrame(({ clock }) => {
    if (bladeRef.current) bladeRef.current.rotation.y = clock.elapsedTime * 2.8;
  });
  return (
    <group position={[x, WALL_HEIGHT - 0.1, z]}>
      <mesh>
        <cylinderGeometry args={[0.52, 0.52, 0.1, 18]} />
        <meshStandardMaterial color="#37474f" metalness={0.72} roughness={0.3} />
      </mesh>
      <group ref={bladeRef}>
        {[0, 1, 2, 3].map((i) => (
          <mesh
            key={i}
            position={[Math.sin((i * Math.PI) / 2) * 0.3, 0, Math.cos((i * Math.PI) / 2) * 0.3]}
            rotation={[0, (i * Math.PI) / 2, 0.35]}
          >
            <boxGeometry args={[0.36, 0.04, 0.1]} />
            <meshStandardMaterial color="#546e7a" metalness={0.6} roughness={0.4} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

interface FactorySceneProps {
  data: Factory3DData;
  viewMode: ViewMode;
  cameraTarget?: CameraTarget | null;
  selectedWorkerId?: string | null;
  onWorkerClick?: (workerId: string) => void;
  vrTriggerRef?: React.MutableRefObject<(() => void) | undefined>;
}

export function FactoryScene({
  data,
  viewMode,
  cameraTarget = null,
  selectedWorkerId = null,
  onWorkerClick,
  vrTriggerRef,
}: FactorySceneProps) {
  const bounds = useFloorBounds(data.zones);
  const crossSection = viewMode === "cross-section";
  const { cx, cz } = bounds;
  const controlsRef = useRef<any>(null);
  const internalVrRef = useRef<(() => void) | undefined>();
  const effectiveVrRef = vrTriggerRef ?? internalVrRef;

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true, toneMappingExposure: 1.05 }}
    >
      <Sky
        distance={450}
        sunPosition={[80, 35, -60]}
        turbidity={5}
        rayleigh={0.45}
        mieCoefficient={0.003}
        mieDirectionalG={0.82}
        inclination={0.50}
        azimuth={0.25}
      />
      {/* Lights */}
      <directionalLight
        position={[cx + 70, 90, cz - 50]}
        intensity={4.0}
        color="#fff5e0"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
        shadow-camera-far={350}
        shadow-bias={-0.0008}
      />
      <directionalLight position={[cx - 40, 50, cz + 40]} intensity={0.8} color="#aabbd8" />
      <directionalLight position={[cx, -8, cz]} intensity={0.35} color="#ddbb88" />
      <hemisphereLight args={["#4477bb", "#6b4e2a", 0.7]} />
      <ambientLight intensity={0.5} color="#c8d8f0" />

      {data.zones.map((zone) => (
        <pointLight
          key={zone.id}
          position={[
            (zone.bounds.x0 + zone.bounds.x1) / 2,
            zone.height * 0.6,
            (zone.bounds.z0 + zone.bounds.z1) / 2,
          ]}
          color={zone.color}
          intensity={5}
          distance={14}
          decay={2}
        />
      ))}

      <SceneCamera viewMode={viewMode} bounds={bounds} />
      <OrbitControls
        ref={controlsRef}
        makeDefault
        target={[cx, 2.5, cz]}
        enableRotate={viewMode !== "top-down"}
        maxPolarAngle={Math.PI / 2.0}
        minPolarAngle={viewMode === "top-down" ? 0 : 0.05}
        minDistance={8}
        maxDistance={Math.max(bounds.width, bounds.depth) * 3.5}
        enableDamping
        dampingFactor={0.07}
      />

      {/* Programmatic camera flight */}
      <CameraController target={cameraTarget} controlsRef={controlsRef} />

      {/* WebXR VR session handler */}
      <VRHandler vrTriggerRef={effectiveVrRef} />

      <Suspense fallback={null}>
        <FactoryShell zones={data.zones} crossSection={crossSection} />
        <CeilingLamps bounds={bounds} />
        <RoofVent x={cx - 10} z={cz - 8} />
        <RoofVent x={cx + 10} z={cz + 8} />
        <RoofVent x={cx - 10} z={cz + 8} />
        <RoofVent x={cx + 10} z={cz - 8} />

        {data.zones.map((zone) => (
          <ZoneVolume key={zone.id} zone={zone} crossSection={crossSection} />
        ))}
        {data.zones.map((zone) => (
          <ZoneMachinery key={`mach-${zone.id}`} zone={zone} />
        ))}

        <SupplyChain bounds={bounds} />

        <WorkerInstances
          workers={data.workers}
          selectedWorkerId={selectedWorkerId}
          onWorkerClick={onWorkerClick}
        />

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
