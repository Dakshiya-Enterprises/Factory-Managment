interface RadialScoreProps {
  value: number;
  max?: number;
  label: string;
  sublabel?: string;
  size?: number;
  color?: string;
}

/** Full-circle progress ring with a value in the center — used for single composite scores (Happiness Index, Quality Score, etc). */
export function RadialScore({ value, max = 100, label, sublabel, size = 150, color = "var(--color-brand-blue)" }: RadialScoreProps) {
  const pct = Math.min(value / max, 1);
  const r = size / 2 - 12;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - pct);

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--color-border)" strokeWidth={12} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={12}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-extrabold text-[var(--color-navy-950)] leading-none">{value}</span>
        <span className="mt-1 text-[10px] font-bold uppercase tracking-wide text-[var(--color-muted)]">{label}</span>
        {sublabel && <span className="mt-0.5 text-[10px] font-semibold text-[var(--color-status-good)]">{sublabel}</span>}
      </div>
    </div>
  );
}
