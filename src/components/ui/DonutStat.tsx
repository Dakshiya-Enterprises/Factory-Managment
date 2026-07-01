import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { DonutSlice } from "@/types/dashboard";

interface DonutStatProps {
  data: DonutSlice[];
  total: number | string;
  totalLabel?: string;
  height?: number;
}

export function DonutStat({ data, total, totalLabel = "TOTAL", height = 160 }: DonutStatProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative shrink-0" style={{ width: height, height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              innerRadius="68%"
              outerRadius="100%"
              paddingAngle={data.length > 1 ? 2 : 0}
              stroke="none"
              startAngle={90}
              endAngle={-270}
            >
              {data.map((slice) => (
                <Cell key={slice.label} fill={slice.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [value.toLocaleString(), name]}
              contentStyle={{ borderRadius: 8, border: "1px solid var(--color-border)", fontSize: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-extrabold text-[var(--color-navy-950)] leading-none">{total}</span>
          <span className="mt-1 text-[10px] font-bold uppercase tracking-wide text-[var(--color-muted)]">
            {totalLabel}
          </span>
        </div>
      </div>
      <ul className="flex w-full flex-col gap-1.5">
        {data.map((slice) => (
          <li key={slice.label} className="flex items-center justify-between gap-2 text-[12px]">
            <span className="flex min-w-0 items-center gap-1.5 text-[var(--color-navy-900)]">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: slice.color }} />
              <span className="leading-tight">{slice.label}</span>
            </span>
            <span className="shrink-0 font-bold text-[var(--color-navy-950)]">
              {slice.value.toLocaleString()}
              {typeof total === "number" && total > 0 && (
                <span className="ml-1 font-medium text-[var(--color-muted)]">
                  ({((slice.value / total) * 100).toFixed(1)}%)
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
