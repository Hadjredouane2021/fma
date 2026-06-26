"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonFilterActive, buttonFilterInactive } from "@/lib/button-styles";

type ActualitesPaginationProps = {
  page: number;
  totalPages: number;
  category?: string;
  q?: string;
  locale: string;
};

function pageHref(page: number, category?: string, q?: string) {
  const sp = new URLSearchParams();
  if (page > 1) sp.set("page", String(page));
  if (category) sp.set("category", category);
  if (q) sp.set("q", q);
  const qs = sp.toString();
  return qs ? `?${qs}` : "?";
}

export function ActualitesPagination({ page, totalPages, category, q, locale }: ActualitesPaginationProps) {
  if (totalPages <= 1) return null;

  const prevLabel = locale === "ar" ? "السابق" : locale === "en" ? "Previous" : "Précédent";
  const nextLabel = locale === "ar" ? "التالي" : locale === "en" ? "Next" : "Suivant";

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter((p) => {
    if (totalPages <= 7) return true;
    if (p === 1 || p === totalPages) return true;
    return Math.abs(p - page) <= 1;
  });

  return (
    <nav
      className="mt-12 flex flex-wrap items-center justify-center gap-2"
      aria-label={locale === "ar" ? "ترقيم الصفحات" : locale === "en" ? "Pagination" : "Pagination"}
    >
      {page > 1 ? (
        <Link
          href={pageHref(page - 1, category, q)}
          className={cn(buttonFilterInactive, "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold")}
        >
          <ChevronLeft className="h-4 w-4" />
          {prevLabel}
        </Link>
      ) : null}

      <div className="flex items-center gap-1.5">
        {pages.map((p, idx) => {
          const prev = pages[idx - 1];
          const showEllipsis = prev !== undefined && p - prev > 1;
          return (
            <span key={p} className="flex items-center gap-1.5">
              {showEllipsis ? <span className="px-1 text-[var(--text-3)]">…</span> : null}
              <Link
                href={pageHref(p, category, q)}
                aria-current={p === page ? "page" : undefined}
                className={cn(
                  "flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-semibold transition-colors",
                  p === page ? buttonFilterActive : buttonFilterInactive
                )}
              >
                {p}
              </Link>
            </span>
          );
        })}
      </div>

      {page < totalPages ? (
        <Link
          href={pageHref(page + 1, category, q)}
          className={cn(buttonFilterInactive, "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold")}
        >
          {nextLabel}
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : null}
    </nav>
  );
}
