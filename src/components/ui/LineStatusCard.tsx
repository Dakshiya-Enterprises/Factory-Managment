import { User } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { bandFor, BAND_COLOR, type LineCard } from "@/data/productionLine";
import type { StatusTone } from "@/types/dashboard";

const TONE: Record<ReturnType<typeof bandFor>, StatusTone> = {
  Excellent: "good",
  Good: "good",
  Average: "average",
  Poor: "bad",
};

export function LineStatusCard({ line }: { line: LineCard }) {
  const band = bandFor(line.efficiency);
  const color = BAND_COLOR[band];

  return (
    <div className="card flex flex-col gap-1.5 px-3.5 py-3">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[12px] font-extrabold text-[var(--color-navy-950)]">
          <span className="h-2 w-2 rounded-full" style={{ background: color }} />
          {line.name}
        </span>
        <StatusBadge label={band} tone={TONE[band]} />
      </div>
      <span className="text-xl font-extrabold leading-none" style={{ color }}>{line.efficiency}%</span>
      <span className="text-[11px] font-semibold text-[var(--color-muted)]">{line.output.toLocaleString()} / {line.target.toLocaleString()} pcs</span>
      <div className="text-[10.5px] text-[var(--color-muted)]">Target 85% &middot; Reject {line.reject}%</div>
      <div className="mt-1 flex items-center gap-1.5 border-t border-[var(--color-border)] pt-1.5 text-[11px] text-[var(--color-navy-900)]">
        <User className="h-3.5 w-3.5 text-[var(--color-muted)]" />
        {line.supervisor}
      </div>
    </div>
  );
}
