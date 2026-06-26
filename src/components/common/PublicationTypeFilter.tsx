"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type PublicationFilterOption = {
  value: string;
  label: string;
};

const SELECT_CLASS =
  "form-field w-full appearance-none rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] py-3 pl-4 pr-10 text-sm font-semibold text-[var(--text-1)] shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

function PublicationQuerySelect({
  param,
  options,
  allLabel,
  ariaLabel,
  className,
  showAllOption = true,
}: {
  param: "type" | "year";
  options: PublicationFilterOption[];
  allLabel: string;
  ariaLabel: string;
  className?: string;
  showAllOption?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get(param) ?? "";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = new URLSearchParams(searchParams.toString());
    const value = e.target.value;
    if (value) next.set(param, value);
    else next.delete(param);
    next.delete("page");
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  return (
    <div className={cn("relative max-w-md", className)}>
      <select
        value={current}
        onChange={handleChange}
        aria-label={ariaLabel}
        className={SELECT_CLASS}
      >
        {showAllOption ? <option value="">{allLabel}</option> : null}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-3)]"
        aria-hidden
      />
    </div>
  );
}

export function PublicationYearFilter(props: Omit<React.ComponentProps<typeof PublicationQuerySelect>, "param">) {
  return <PublicationQuerySelect param="year" {...props} />;
}
