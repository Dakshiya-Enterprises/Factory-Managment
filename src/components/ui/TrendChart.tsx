import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { TrendPoint } from "@/types/dashboard";

interface TrendChartProps {
  data: TrendPoint[];
  color?: string;
  target?: number;
  unit?: string;
  height?: number;
}

export function TrendChart({ data, color = "var(--color-brand-blue)", target, unit = "", height = 150 }: TrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
        <XAxis dataKey="x" tick={{ fontSize: 10, fill: "var(--color-muted)" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 10, fill: "var(--color-muted)" }} axisLine={false} tickLine={false} width={34} />
        <Tooltip
          formatter={(value: number) => [`${value}${unit}`, ""]}
          contentStyle={{ borderRadius: 8, border: "1px solid var(--color-border)", fontSize: 12 }}
        />
        {target !== undefined && (
          <ReferenceLine y={target} stroke="var(--color-status-good)" strokeDasharray="4 4" strokeWidth={1.5} />
        )}
        <Line type="monotone" dataKey="y" stroke={color} strokeWidth={2.25} dot={{ r: 3, fill: color, strokeWidth: 0 }} activeDot={{ r: 5 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
