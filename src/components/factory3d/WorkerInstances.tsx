import { Instance, Instances } from "@react-three/drei";
import type { Worker } from "@/types/factory3d";
import { STATUS_COLOR } from "./colors";

/**
 * All worker avatars share a single instanced draw call — critical for
 * keeping frame rate acceptable with 30+ workers updating every tick.
 * Worker count is fixed at module load in src/data/factory3d.ts, so the
 * instance list never grows/shrinks, only positions and colors change.
 */
export function WorkerInstances({ workers }: { workers: Worker[] }) {
  return (
    <Instances limit={workers.length} range={workers.length}>
      <capsuleGeometry args={[0.28, 0.9, 4, 8]} />
      <meshStandardMaterial />
      {workers.map((worker) => (
        <Instance
          key={worker.id}
          position={[worker.position.x, worker.position.y, worker.position.z]}
          color={STATUS_COLOR[worker.status]}
        />
      ))}
    </Instances>
  );
}
