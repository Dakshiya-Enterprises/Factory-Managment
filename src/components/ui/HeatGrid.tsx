import { bandFor, BAND_COLOR, type LayoutCell } from "@/data/productionLine";

const BAND_BG: Record<ReturnType<typeof bandFor>, string> = {
  Excellent: "var(--color-status-good-bg)",
  Good: "#eaf6ee",
  Average: "var(--color-status-warn-bg)",
  Poor: "var(--color-status-bad-bg)",
};

export function HeatGrid({ rows }: { rows: { area: string; cells: LayoutCell[] }[] }) {
  return (
    <div className="flex flex-col gap-2.5">
      {rows.map((row) => (
        <div key={row.area} className="flex items-center gap-3">
          <span className="w-24 shrink-0 text-[10.5px] font-bold uppercase tracking-wide text-[var(--color-muted)]">{row.area}</span>
          <div className="grid flex-1 grid-cols-10 gap-1.5">
            {row.cells.map((cell) => {
              const band = bandFor(cell.efficiency);
              return (
                <div
                  key={cell.id}
                  className="flex flex-col items-center justify-center rounded-md py-1.5 text-center"
                  style={{ background: BAND_BG[band], border: `1px solid ${BAND_COLOR[band]}33` }}
                >
                  <span className="text-[9.5px] font-bold text-[var(--color-muted)]">{cell.id}</span>
                  <span className="text-[11px] font-extrabold" style={{ color: BAND_COLOR[band] }}>{cell.efficiency}%</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
