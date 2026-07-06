import { cn } from "@/lib/utils";
import type { LocaleCompletionStatus } from "@/lib/admin-locale";
import type { TeamMemberLocaleLevel } from "@/lib/localized-content";

const LABELS = [
  { key: "fr" as const, label: "FR" },
  { key: "en" as const, label: "EN" },
  { key: "ar" as const, label: "AR" },
];

const LEVEL_TITLE: Record<TeamMemberLocaleLevel, string> = {
  native: "Texte natif en BDD — affiché tel quel sur le site",
  partial: "Nom traduit, fonction encore en repli français sur le site",
  fallback: "Repli sur le français sur le site public",
};

const LEVEL_CLASS: Record<TeamMemberLocaleLevel, string> = {
  native:
    "border-green-100 bg-green-50 text-green-700 dark:border-green-800/50 dark:bg-green-950/40 dark:text-green-300",
  partial:
    "border-amber-100 bg-amber-50 text-amber-700 dark:border-amber-800/50 dark:bg-amber-950/40 dark:text-amber-300",
  fallback:
    "border-neutral-200 bg-neutral-50 text-neutral-400 dark:border-neutral-700 dark:bg-neutral-900/50 dark:text-neutral-500",
};

export function AdminLocaleBadges({ status }: { status: LocaleCompletionStatus }) {
  return (
    <div className="flex flex-wrap gap-1">
      {LABELS.map(({ key, label }) => {
        const level = status[key];
        return (
          <span
            key={key}
            title={`${label} — ${LEVEL_TITLE[level]}`}
            className={cn(
              "rounded border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
              LEVEL_CLASS[level]
            )}
          >
            {label}
          </span>
        );
      })}
    </div>
  );
}
