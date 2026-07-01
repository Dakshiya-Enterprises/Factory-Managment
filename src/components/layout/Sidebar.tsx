import { NavLink } from "react-router-dom";
import { Lock } from "lucide-react";
import { DASHBOARDS } from "@/nav/dashboards";
import { useBranding } from "@/branding/BrandingContext";

export function Sidebar() {
  const branding = useBranding();

  return (
    <aside className="flex h-full w-[248px] shrink-0 flex-col border-r border-[var(--color-border)] bg-[var(--color-navy-950)]">
      <div className="flex items-center gap-2.5 border-b border-white/10 px-4 py-4">
        <img
          src={branding.logo}
          alt={`${branding.companyName} logo`}
          className="h-9 w-9 rounded-md bg-white object-contain p-1"
        />
        <div className="min-w-0">
          <div className="truncate text-[13px] font-extrabold leading-tight text-white">{branding.companyName}</div>
          <div className="truncate text-[10px] font-medium uppercase tracking-wide text-white/50">{branding.tagline}</div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-white/35">
          Dashboards ({DASHBOARDS.length})
        </div>
        <ul className="flex flex-col gap-0.5">
          {DASHBOARDS.map((item) => {
            const Icon = item.icon;
            if (item.status === "soon") {
              return (
                <li key={item.slug}>
                  <div className="group flex cursor-not-allowed items-center gap-2.5 rounded-lg px-2.5 py-2 text-white/30">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center text-[10px] font-bold text-white/25">
                      {item.order}
                    </span>
                    <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />
                    <span className="min-w-0 flex-1 truncate text-[12.5px] font-medium">{item.title}</span>
                    <Lock className="h-3 w-3 shrink-0" />
                  </div>
                </li>
              );
            }
            return (
              <li key={item.slug}>
                <NavLink
                  to={`/d/${item.slug}`}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[12.5px] font-semibold transition-colors ${
                      isActive
                        ? "bg-[var(--color-brand-blue)] text-white shadow-sm"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/10 text-[10px] font-bold">
                    {item.order}
                  </span>
                  <Icon className="h-4 w-4 shrink-0" strokeWidth={2.25} />
                  <span className="min-w-0 flex-1 truncate">{item.title}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-white/10 px-4 py-3 text-[10.5px] leading-snug text-white/40">
        Live screens are seeded with mock data today; the automation layer swaps in live IoT/data-pipeline feeds without UI changes.
      </div>
    </aside>
  );
}
