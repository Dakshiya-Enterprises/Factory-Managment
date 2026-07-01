import type { ReactNode } from "react";

interface CardProps {
  title?: string;
  subtitle?: string;
  right?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}

export function Card({ title, subtitle, right, children, className = "", bodyClassName = "" }: CardProps) {
  return (
    <div className={`card flex flex-col overflow-hidden ${className}`}>
      {title && (
        <div className="flex items-start justify-between gap-2 border-b border-[var(--color-border)] px-4 py-3">
          <div>
            <h3 className="text-[13px] font-bold uppercase tracking-wide text-[var(--color-navy-950)]">
              {title}
              {subtitle && (
                <span className="ml-1.5 text-[11px] font-semibold text-[var(--color-muted)]">{subtitle}</span>
              )}
            </h3>
          </div>
          {right}
        </div>
      )}
      <div className={`flex-1 p-4 ${bodyClassName}`}>{children}</div>
    </div>
  );
}
