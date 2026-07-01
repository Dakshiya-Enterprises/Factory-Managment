import type { ReactNode } from "react";

export interface Column<T> {
  key: string;
  header: string;
  align?: "left" | "right" | "center";
  render: (row: T) => ReactNode;
}

const ALIGN_CLASS: Record<"left" | "right" | "center", string> = {
  left: "text-left",
  right: "text-right",
  center: "text-center",
};

export function SimpleTable<T extends { id: string | number }>({
  columns,
  rows,
}: {
  columns: Column<T>[];
  rows: T[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-[12.5px]">
        <thead>
          <tr className="bg-[var(--color-navy-900)] text-white">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`whitespace-nowrap px-3 py-2 text-[11px] font-bold uppercase tracking-wide first:rounded-l-md last:rounded-r-md ${ALIGN_CLASS[col.align ?? "left"]}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.id}
              className={`border-b border-[var(--color-border)] last:border-0 ${i % 2 === 1 ? "bg-slate-50/60" : ""} hover:bg-[var(--color-status-info-bg)]/60`}
            >
              {columns.map((col) => (
                <td key={col.key} className={`whitespace-nowrap px-3 py-2 ${ALIGN_CLASS[col.align ?? "left"]}`}>
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
