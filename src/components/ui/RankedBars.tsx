import type { RankedBar } from "@/types/dashboard";

export function RankedBars({ data, color = "var(--color-brand-blue)" }: { data: RankedBar[]; color?: string }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <ul className="flex flex-col gap-2.5">
      {data.map((row) => (
        <li key={row.label} className="grid grid-cols-[minmax(90px,150px)_1fr_32px] items-center gap-2 text-[12px]">
          <span className="truncate font-medium text-[var(--color-navy-900)]">{row.label}</span>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full"
              style={{ width: `${(row.value / max) * 100}%`, background: color }}
            />
          </div>
          <span className="text-right font-bold text-[var(--color-navy-950)]">{row.value}</span>
        </li>
      ))}
    </ul>
  );
}
