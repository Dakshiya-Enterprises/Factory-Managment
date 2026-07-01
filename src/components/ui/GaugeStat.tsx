interface GaugeStatProps {
  value: number;
  max?: number;
  target?: number;
  label: string;
  size?: number;
}

/** Semi-circular gauge (needle style), used for the availability-vs-target dial. */
export function GaugeStat({ value, max = 100, target, label, size = 170 }: GaugeStatProps) {
  const pct = Math.min(value / max, 1);
  const angle = -90 + pct * 180;
  const r = size / 2 - 14;
  const cx = size / 2;
  const cy = size / 2;

  const arcSegments = [
    { from: 0, to: 0.6, color: "var(--color-status-bad)" },
    { from: 0.6, to: 0.85, color: "var(--color-status-warn)" },
    { from: 0.85, to: 1, color: "var(--color-status-good)" },
  ];

  const polar = (frac: number) => {
    const a = -180 + frac * 180;
    const rad = (a * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size / 2 + 20} viewBox={`0 0 ${size} ${size / 2 + 20}`}>
        {arcSegments.map((seg) => {
          const start = polar(seg.from);
          const end = polar(seg.to);
          const largeArc = seg.to - seg.from > 0.5 ? 1 : 0;
          return (
            <path
              key={seg.color}
              d={`M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`}
              stroke={seg.color}
              strokeWidth={12}
              fill="none"
              strokeLinecap="round"
              opacity={0.85}
            />
          );
        })}
        {target !== undefined && (
          <line
            {...(() => {
              const p1 = polar(Math.min(target / max, 1));
              return { x1: cx + (p1.x - cx) * 0.72, y1: cy + (p1.y - cy) * 0.72, x2: p1.x, y2: p1.y };
            })()}
            stroke="var(--color-navy-950)"
            strokeWidth={2}
          />
        )}
        <line
          x1={cx}
          y1={cy}
          x2={cx + r * 0.78 * Math.cos((angle * Math.PI) / 180)}
          y2={cy + r * 0.78 * Math.sin((angle * Math.PI) / 180)}
          stroke="var(--color-navy-950)"
          strokeWidth={3}
          strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r={5} fill="var(--color-navy-950)" />
      </svg>
      <div className="-mt-1 text-2xl font-extrabold text-[var(--color-navy-950)]">{value}%</div>
      <div className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-muted)]">{label}</div>
    </div>
  );
}
