"use client";
import { useRouter, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { useState } from "react";
import type { Category, Locale } from "@/types";

interface NewsFilterProps {
  categories: Category[];
  locale: Locale;
  currentCategory?: string;
  currentQ?: string;
}

export default function NewsFilter({ categories, locale, currentCategory, currentQ }: NewsFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [q, setQ] = useState(currentQ || "");

  const update = (params: Record<string, string | undefined>) => {
    const sp = new URLSearchParams();
    if (params.category) sp.set("category", params.category);
    if (params.q) sp.set("q", params.q);
    router.push(`${pathname}?${sp.toString()}`);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-2">
      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)]" />
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && update({ q: q || undefined, category: currentCategory })}
          placeholder={locale === "ar" ? "ابحث عن خبر..." : locale === "en" ? "Search news..." : "Rechercher une actualité..."}
          className="w-full pl-10 pr-4 py-2.5 border border-[var(--border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 bg-[var(--bg-surface)] text-[var(--text-1)]"
        />
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => update({ q: q || undefined })}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${!currentCategory ? "bg-primary-500 text-white" : "bg-[var(--bg-surface)] text-[var(--text-2)] border border-[var(--border)] hover:border-primary-300"}`}
        >
          {locale === "ar" ? "الكل" : locale === "en" ? "All" : "Toutes"}
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => update({ category: cat.slug, q: q || undefined })}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${currentCategory === cat.slug ? "bg-primary-500 text-white" : "bg-[var(--bg-surface)] text-[var(--text-2)] border border-[var(--border)] hover:border-primary-300"}`}
          >
            {locale === "ar" ? (cat.nameAr || cat.nameFr) : locale === "en" ? (cat.nameEn || cat.nameFr) : cat.nameFr}
          </button>
        ))}
      </div>
    </div>
  );
}
