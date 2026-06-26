"use client";

import { useRouter, usePathname } from "next/navigation";
import { Search, X } from "lucide-react";
import { useState } from "react";
import type { Category, Locale } from "@/types";
import { cn } from "@/lib/utils";
import { buttonFilterActive, buttonFilterInactive } from "@/lib/button-styles";

interface NewsFilterProps {
  categories: Category[];
  locale: Locale;
  currentCategory?: string;
  currentQ?: string;
  resultCount?: number;
}

function categoryLabel(cat: Category, locale: Locale) {
  return locale === "ar" ? cat.nameAr || cat.nameFr : locale === "en" ? cat.nameEn || cat.nameFr : cat.nameFr;
}

export default function NewsFilter({ categories, locale, currentCategory, currentQ, resultCount }: NewsFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [q, setQ] = useState(currentQ || "");

  const update = (params: Record<string, string | undefined>) => {
    const sp = new URLSearchParams();
    if (params.category) sp.set("category", params.category);
    if (params.q) sp.set("q", params.q);
    router.push(`${pathname}?${sp.toString()}`);
  };

  const allLabel = locale === "ar" ? "الكل" : locale === "en" ? "All" : "Toutes";
  const searchPlaceholder =
    locale === "ar" ? "ابحث عن خبر..." : locale === "en" ? "Search news..." : "Rechercher une actualité...";
  const resultsLabel =
    locale === "ar"
      ? `${resultCount ?? 0} خبر`
      : locale === "en"
        ? `${resultCount ?? 0} article${resultCount === 1 ? "" : "s"}`
        : `${resultCount ?? 0} actualité${resultCount === 1 ? "" : "s"}`;

  return (
    <div className="actualites-toolbar space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="actualites-toolbar__search relative flex-1 lg:max-w-md">
          <Search className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-3)]" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && update({ q: q || undefined, category: currentCategory })}
            placeholder={searchPlaceholder}
            className="w-full rounded-[inherit] bg-transparent py-2.5 ps-11 pe-10 text-sm text-[var(--text-1)] placeholder:text-[var(--text-3)] focus:outline-none"
          />
          {q ? (
            <button
              type="button"
              onClick={() => {
                setQ("");
                update({ category: currentCategory });
              }}
              className="absolute end-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-[var(--text-3)] transition-colors hover:bg-[var(--hover-bg)] hover:text-[var(--text-1)]"
              aria-label={locale === "ar" ? "مسح" : locale === "en" ? "Clear" : "Effacer"}
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        {typeof resultCount === "number" ? (
          <p className="shrink-0 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-3)] lg:text-end">
            {resultsLabel}
          </p>
        ) : null}
      </div>

      <div className="actualites-categories" role="tablist" aria-label={locale === "ar" ? "الفئات" : locale === "en" ? "Categories" : "Catégories"}>
        <button
          type="button"
          role="tab"
          aria-selected={!currentCategory}
          onClick={() => update({ q: q || undefined })}
          className={cn(
            "shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
            !currentCategory ? buttonFilterActive : buttonFilterInactive
          )}
        >
          {allLabel}
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            role="tab"
            aria-selected={currentCategory === cat.slug}
            onClick={() => update({ category: cat.slug, q: q || undefined })}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
              currentCategory === cat.slug ? buttonFilterActive : buttonFilterInactive
            )}
          >
            {categoryLabel(cat, locale)}
          </button>
        ))}
      </div>
    </div>
  );
}
