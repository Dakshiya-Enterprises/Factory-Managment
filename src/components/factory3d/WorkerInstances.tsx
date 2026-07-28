/**
 * WorkerInstances — smoothly lerped worker avatars with motion trails.
 *
 * Each avatar:
 *  - Lerps position toward the latest data tick (no teleporting)
 *  - Leaves a fading trail line behind it
 *  - Highlights with a gold selection ring when selectedWorkerId matches
 *  - Fires onWorkerClick(id) when clicked
 */

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import type { Worker } from "@/types/factory3d";
import { STATUS_COLOR } from "./colors";

const LERP_SPEED    = 3.5;
const TRAIL_LENGTH  = 28;
const TRAIL_MIN_DIST = 0.08;

interface WorkerAvatarProps {
  worker: Worker;
  index: number;
  selected: boolean;
  onWorkerClick?: (id: string) => void;
}

function WorkerAvatar({ worker, index, selected, onWorkerClick }: WorkerAvatarProps) {
  const color = STATUS_COLOR[worker.status];
  const isAlert = worker.status === "alert";
  const phase = index * 1.37;

  const currentPos = useRef(new THREE.Vector3(worker.position.x, worker.position.y, worker.position.z));
  const targetPos  = useRef(new THREE.Vector3(worker.position.x, worker.position.y, worker.position.z));
  const trailPoints = useRef<THREE.Vector3[]>(
    Array.from({ length: TRAIL_LENGTH }, () => currentPos.current.clone())
  );

  const bodyRef   = useRef<THREE.Mesh>(null);
  const headRef   = useRef<THREE.Mesh>(null);
  const shadowRef = useRef<THREE.Mesh>(null);
  const alertRef  = useRef<THREE.Mesh>(null);
  const selectRef = useRef<THREE.Mesh>(null);
  const lineRef   = useRef<any>(null);

  useFrame((_, delta) => {
    targetPos.current.set(worker.position.x, worker.position.y, worker.position.z);
    currentPos.current.lerp(targetPos.current, Math.min(1, LERP_SPEED * delta));
    const { x, y, z } = currentPos.current;
    const bob = Math.sin(Date.now() * 0.002 + phase) * 0.04;

    bodyRef.current?.position.set(x, y + bob, z);
    headRef.current?.position.set(x, y + 0.78 + bob, z);
    shadowRef.current?.position.set(x, 0.01, z);
    alertRef.current?.position.set(x, y + 0.78 + bob, z);
    selectRef.current?.position.set(x, 0.04, z);

    // Trail update
    const last = trailPoints.current[trailPoints.current.length - 1];
    if (last.distanceTo(currentPos.current) > TRAIL_MIN_DIST) {
      trailPoints.current.push(new THREE.Vector3(x, 0.05, z));
      if (trailPoints.current.length > TRAIL_LENGTH) trailPoints.current.shift();
    }
    if (lineRef.current) {
      const attr = lineRef.current.geometry?.attributes?.position;
      if (attr) {
        trailPoints.current.forEach((p, i) => attr.setXYZ(i, p.x, p.y, p.z));
        attr.needsUpdate = true;
      }
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    onWorkerClick?.(worker.id);
  };

  return (
    <group>
      {/* Floor shadow */}
      <mesh
        ref={shadowRef}
        position={[worker.position.x, 0.01, worker.position.z]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[0.3, 12]} />
        <meshBasicMaterial color={color} transparent opacity={0.25} depthWrite={false} />
      </mesh>

      {/* Selection ring — gold, only when selected */}
      {selected && (
        <mesh
          ref={selectRef}
          position={[worker.position.x, 0.04, worker.position.z]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <torusGeometry args={[0.55, 0.06, 6, 24]} />
          <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={1.5} />
        </mesh>
      )}

      {/* Motion trail */}
      {trailPoints.current.length >= 2 && (
        <Line
          ref={lineRef}
          points={trailPoints.current}
          color={color}
          lineWidth={1.6}
          transparent
          opacity={0.5}
        />
      )}

      {/* Body */}
      <mesh
        ref={bodyRef}
        position={[worker.position.x, worker.position.y, worker.position.z]}
        castShadow
        onClick={handleClick}
      >
        <capsuleGeometry args={[0.2, 0.55, 4, 8]} />
        <meshStandardMaterial color={color} roughness={0.65} metalness={0.05} />
      </mesh>

      {/* Head */}
      <mesh
        ref={headRef}
        position={[worker.position.x, worker.position.y + 0.78, worker.position.z]}
        castShadow
        onClick={handleClick}
      >
        <sphereGeometry args={[0.16, 10, 10]} />
        <meshStandardMaterial color="#f5cba7" roughness={0.8} />
      </mesh>

      {/* Hard-hat */}
      <mesh position={[worker.position.x, worker.position.y + 0.94, worker.position.z]}>
        <sphereGeometry args={[0.18, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.2} />
      </mesh>

      {/* Alert ring */}
      {isAlert && (
        <mesh
          ref={alertRef}
          position={[worker.position.x, worker.position.y + 0.78, worker.position.z]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <torusGeometry args={[0.3, 0.035, 6, 24]} />
          <meshStandardMaterial color="#ef5350" emissive="#ef5350" emissiveIntensity={1.4} />
        </mesh>
      )}
    </group>
  );
}

interface WorkerInstancesProps {
  workers: Worker[];
  selectedWorkerId?: string | null;
  onWorkerClick?: (workerId: string) => void;
}

export function WorkerInstances({ workers, selectedWorkerId, onWorkerClick }: WorkerInstancesProps) {
  return (
    <>
      {workers.map((worker, i) => (
        <WorkerAvatar
          key={worker.id}
          worker={worker}
          index={i}
          selected={worker.id === selectedWorkerId}
          onWorkerClick={onWorkerClick}
        />
      ))}
    </>
  );
}
