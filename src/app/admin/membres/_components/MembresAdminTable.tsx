"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonTabActive, buttonTabInactive } from "@/lib/button-styles";
import { AdminLocaleBadges } from "@/components/admin/AdminLocaleBadges";
import { ADMIN_LOCALE_TABS, type AdminLocale } from "@/lib/admin-locale";
import {
  fmaMemberCategoryLabel,
  fmaMemberLocaleLevel,
  fmaMemberName,
  fmaMemberNameUsesFallback,
  type FmaMemberCategoryLabel,
  type TeamMemberLocaleLevel,
} from "@/lib/localized-content";
import type { LocalizedString } from "@/lib/la-fma-site-public";
import type { Locale } from "@/types";
import DeleteMemberButton from "./DeleteMemberButton";

export type MembresTableRow = {
  id: string;
  nameFr: string;
  nameEn: string | null;
  nameAr: string | null;
  logo: string | null;
  category: string | null;
  order: number;
  active: boolean;
};

function localeStatus(member: MembresTableRow): Record<AdminLocale, TeamMemberLocaleLevel> {
  return {
    fr: fmaMemberLocaleLevel(member, "fr"),
    en: fmaMemberLocaleLevel(member, "en"),
    ar: fmaMemberLocaleLevel(member, "ar"),
  };
}

function FallbackHint({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <span className="ml-1.5 text-[10px] font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">
      (FR)
    </span>
  );
}

export function MembresAdminTable({
  members,
  memberCategories,
  memberCategoryOtherLabel,
}: {
  members: MembresTableRow[];
  memberCategories: FmaMemberCategoryLabel[];
  memberCategoryOtherLabel: LocalizedString;
}) {
  const [locale, setLocale] = useState<AdminLocale>("fr");
  const currentTab = ADMIN_LOCALE_TABS.find((t) => t.key === locale)!;
  const l = locale as Locale;

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] shadow-sm dark:shadow-none">
      <div className="flex flex-wrap items-center gap-2 border-b border-[var(--border)] bg-[var(--bg-alt)] px-4 py-3 sm:px-6">
        <span className="text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">Aperçu site</span>
        {ADMIN_LOCALE_TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setLocale(t.key)}
            className={cn(
              "rounded-xl px-3 py-1.5 text-sm font-medium",
              locale === t.key ? buttonTabActive : buttonTabInactive
            )}
          >
            {t.flag} {t.label}
          </button>
        ))}
        <p className="w-full text-xs text-[var(--text-3)] sm:ml-auto sm:w-auto">
          Nom utilisé en alt du logo ou en repli texte — même logique que /{locale}/la-fma.
        </p>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--border)] bg-[var(--bg-alt)]">
            <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">Logo</th>
            <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">
              Nom ({currentTab.label})
            </th>
            <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">Traductions</th>
            <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">Catégorie</th>
            <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">Ordre</th>
            <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">Actif</th>
            <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)]">
          {members.map((m) => {
            const name = fmaMemberName(m, l);
            const nameFallback = fmaMemberNameUsesFallback(m, l);
            const categoryLabel = fmaMemberCategoryLabel(
              m.category,
              l,
              memberCategories,
              memberCategoryOtherLabel
            );

            return (
              <tr key={m.id} className="group transition-colors hover:bg-[var(--bg-alt)]/80">
                <td className="px-4 py-3">
                  <div className="relative h-10 w-24 overflow-hidden rounded border border-[var(--border)] bg-[var(--bg-alt)]">
                    {m.logo ? (
                      <Image
                        src={m.logo}
                        alt={name}
                        fill
                        className="object-contain p-0.5"
                        sizes="96px"
                        unoptimized={m.logo.startsWith("/uploads")}
                      />
                    ) : (
                      <span
                        className="flex h-full items-center justify-center px-1 text-center text-[10px] font-medium leading-tight text-[var(--text-3)]"
                        dir={currentTab.dir}
                      >
                        {name.slice(0, 18)}
                        {name.length > 18 ? "…" : ""}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 font-semibold text-primary" dir={currentTab.dir}>
                  {name}
                  <FallbackHint show={nameFallback} />
                </td>
                <td className="px-4 py-3">
                  <AdminLocaleBadges status={localeStatus(m)} />
                </td>
                <td className="px-4 py-3" dir={currentTab.dir}>
                  <span className="rounded-lg bg-[var(--bg-alt)] px-2 py-1 text-xs font-medium text-primary">
                    {categoryLabel}
                  </span>
                  {m.category ? (
                    <p className="mt-1 font-mono text-[10px] text-[var(--text-3)]">{m.category}</p>
                  ) : null}
                </td>
                <td className="px-4 py-3 text-[var(--text-3)]">{m.order}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${
                      m.active
                        ? "border-green-100 bg-green-50 text-green-700 dark:border-green-800/50 dark:bg-green-950/40 dark:text-green-300"
                        : "border-neutral-200 bg-neutral-50 text-neutral-600 dark:border-neutral-700 dark:bg-neutral-900/50 dark:text-neutral-400"
                    }`}
                  >
                    {m.active ? "Oui" : "Non"}
                  </span>
                </td>
                <td className="px-6 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/admin/membres/${m.id}`}
                      className="rounded-lg p-2 text-[var(--text-3)] transition-colors hover:bg-[var(--bg-alt)] hover:text-primary"
                      title="Modifier"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <DeleteMemberButton id={m.id} />
                  </div>
                </td>
              </tr>
            );
          })}
          {members.length === 0 && (
            <tr>
              <td colSpan={7} className="py-16 text-center text-[var(--text-3)]">
                <p className="mb-2 text-4xl">🏢</p>
                <p className="text-sm">Aucune société membre. Ajoutez-en une pour la grille La FMA.</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
