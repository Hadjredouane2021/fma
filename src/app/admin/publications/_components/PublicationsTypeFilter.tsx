"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const SELECT_CLASS =
  "form-field w-full min-w-[11rem] appearance-none rounded-xl border border-[var(--border)] bg-[var(--bg)] py-2.5 pl-3 pr-9 text-sm font-semibold text-[var(--text-1)] shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

export function PublicationsTypeFilter({
  options,
  totalCount,
  className,
}: {
  options: { value: string; label: string; count: number }[];
  totalCount: number;
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("type") ?? "";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = new URLSearchParams(searchParams.toString());
    const value = e.target.value;
    if (value) next.set("type", value);
    else next.delete("type");
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  return (
    <div className={cn("relative", className)}>
      <select
        value={current}
        onChange={handleChange}
        aria-label="Filtrer par type de publication"
        className={SELECT_CLASS}
      >
        <option value="">Tous les types ({totalCount})</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label} ({opt.count})
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-3)]"
        aria-hidden
      />
    </div>
  );
}
