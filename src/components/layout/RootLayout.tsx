import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";

export function RootLayout() {
  return (
    <div className="flex h-screen min-w-[1100px] overflow-hidden bg-[var(--color-page)]">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  );
}
