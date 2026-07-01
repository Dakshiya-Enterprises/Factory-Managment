import { Lightbulb } from "lucide-react";

export function InsightBanner({ text }: { text: string }) {
  return (
    <div className="card flex items-center gap-2 border-l-4 border-l-[var(--color-status-good)] bg-[var(--color-status-good-bg)] px-5 py-3 text-[12.5px] font-semibold text-[var(--color-navy-950)]">
      <Lightbulb className="h-4 w-4 shrink-0 text-[var(--color-status-good)]" />
      {text}
    </div>
  );
}
