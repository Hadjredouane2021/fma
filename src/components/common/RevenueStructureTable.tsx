import {
  type ChiffresClesContent,
  formatAmountFr,
  formatPercentFr,
  isAggregateRow,
  resolveRowValues,
  sumContribution,
  sumRevenue,
} from "@/lib/chiffres-cles-site-public";
import type { Locale } from "@/types";

interface RevenueStructureTableProps {
  content: ChiffresClesContent;
  locale: Locale;
}

export function RevenueStructureTable({ content, locale }: RevenueStructureTableProps) {
  const l = locale;
  const totalRevenue = sumRevenue(content.rows);
  const totalContribution = sumContribution(content.rows);

  return (
    <div className="revenue-structure">
      <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="text-lg font-bold uppercase tracking-wide text-primary sm:text-xl">
          {content.title[l] || content.title.fr}
        </h2>
        <p className="text-xs italic text-[var(--text-3)] sm:text-sm">
          {content.unitNote[l] || content.unitNote.fr}
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[var(--border)] shadow-sm">
        <table className="w-full min-w-[32rem] border-collapse text-sm">
          <thead>
            <tr className="bg-primary text-primary-foreground">
              <th className="px-4 py-3 text-left font-semibold">
                {content.columnCategory[l] || content.columnCategory.fr || "\u00a0"}
              </th>
              <th className="px-4 py-3 text-right font-semibold whitespace-nowrap">
                {content.columnRevenue[l] || content.columnRevenue.fr}
              </th>
              <th className="px-4 py-3 text-right font-semibold whitespace-nowrap">
                {content.columnContribution[l] || content.columnContribution.fr}
              </th>
            </tr>
          </thead>
          <tbody>
            {content.rows.map((row, i) => {
              const resolved = resolveRowValues(row, content.rows);
              return (
              <tr
                key={row.id}
                className={i % 2 === 0 ? "bg-[var(--bg-surface)]" : "bg-[var(--bg-alt)]"}
              >
                <td className={`px-4 py-2.5 font-medium text-[var(--text-1)] ${isAggregateRow(row) ? "font-bold" : ""}`}>
                  {row.category[l] || row.category.fr}
                </td>
                <td className="px-4 py-2.5 text-right tabular-nums text-[var(--text-1)]">
                  {formatAmountFr(resolved.revenue)}
                </td>
                <td className="px-4 py-2.5 text-right tabular-nums text-[var(--text-1)]">
                  {formatPercentFr(resolved.contribution)}
                </td>
              </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-primary font-bold text-primary-foreground">
              <td className="px-4 py-3">
                {content.totalLabel[l] || content.totalLabel.fr}
              </td>
              <td className="px-4 py-3 text-right tabular-nums">
                {formatAmountFr(totalRevenue)}
              </td>
              <td className="px-4 py-3 text-right tabular-nums">
                {formatPercentFr(totalContribution)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
