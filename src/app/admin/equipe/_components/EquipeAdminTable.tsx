"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonTabActive, buttonTabInactive } from "@/lib/button-styles";
import { AdminLocaleBadges } from "@/components/admin/AdminLocaleBadges";
import {
  ADMIN_LOCALE_TABS,
  teamMemberFieldUsesFallback,
  teamMemberLocaleStatus,
  teamMemberName,
  teamMemberTitle,
  type AdminLocale,
} from "@/lib/admin-locale";
import { teamDepartmentLabel, teamDepartmentPublicSection } from "@/lib/team-member-site";
import DeleteTeamMemberButton from "./DeleteTeamMemberButton";

export type EquipeTableRow = {
  id: string;
  nameFr: string;
  nameEn: string | null;
  nameAr: string | null;
  titleFr: string | null;
  titleEn: string | null;
  titleAr: string | null;
  photo: string | null;
  department: string | null;
  order: number;
  active: boolean;
};

function FallbackHint({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <span className="ml-1.5 text-[10px] font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">
      (FR)
    </span>
  );
}

export function EquipeAdminTable({ team }: { team: EquipeTableRow[] }) {
  const [locale, setLocale] = useState<AdminLocale>("fr");
  const currentTab = ADMIN_LOCALE_TABS.find((t) => t.key === locale)!;

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
        <p className="w-full text-xs text-[var(--text-3)] sm:w-auto sm:ml-auto">
          Même logique que /{locale}/la-fma — repli FR si traduction absente.
        </p>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--border)] bg-[var(--bg-alt)]">
            <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">Photo</th>
            <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">
              Nom ({currentTab.label})
            </th>
            <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">Fonction</th>
            <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">Traductions</th>
            <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">Section site</th>
            <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">Ordre</th>
            <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">Actif</th>
            <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)]">
          {team.map((m) => {
            const name = teamMemberName(m, locale);
            const title = teamMemberTitle(m, locale);
            const localeStatus = teamMemberLocaleStatus(m);
            const nameFallback = teamMemberFieldUsesFallback(m, locale, "name");
            const titleFallback = teamMemberFieldUsesFallback(m, locale, "title");
            const showsTitle = m.department === "direction";

            return (
              <tr key={m.id} className="group transition-colors hover:bg-[var(--bg-alt)]/80">
                <td className="px-4 py-3">
                  <div className="relative h-11 w-11 overflow-hidden rounded-full border border-[var(--border)] bg-[var(--bg-alt)]">
                    {m.photo ? (
                      <Image src={m.photo} alt="" fill className="object-cover" sizes="44px" unoptimized={m.photo.startsWith("/uploads")} />
                    ) : (
                      <span className="flex h-full items-center justify-center text-xs font-bold text-primary/40">
                        {name.charAt(0)}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 font-semibold text-primary" dir={currentTab.dir}>
                  {name}
                  <FallbackHint show={nameFallback} />
                </td>
                <td className="px-4 py-3 text-[var(--text-2)]" dir={currentTab.dir}>
                  {showsTitle ? (
                    <>
                      {title || "—"}
                      <FallbackHint show={titleFallback} />
                    </>
                  ) : (
                    <span className="text-xs text-[var(--text-3)]">— (non affiché)</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <AdminLocaleBadges status={localeStatus} />
                </td>
                <td className="px-4 py-3">
                  <div>
                    <span className="rounded-lg bg-[var(--bg-alt)] px-2 py-1 text-xs font-medium text-primary">
                      {teamDepartmentLabel(m.department)}
                    </span>
                    {m.active ? (
                      <p className="mt-1 text-[10px] leading-snug text-[var(--text-3)]">
                        {teamDepartmentPublicSection(m.department, locale)}
                      </p>
                    ) : (
                      <p className="mt-1 text-[10px] text-amber-600 dark:text-amber-400">Masqué (inactif)</p>
                    )}
                  </div>
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
                      href={`/admin/equipe/${m.id}`}
                      className="rounded-lg p-2 text-[var(--text-3)] transition-colors hover:bg-[var(--bg-alt)] hover:text-primary"
                      title="Modifier"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <DeleteTeamMemberButton id={m.id} />
                  </div>
                </td>
              </tr>
            );
          })}
          {team.length === 0 && (
            <tr>
              <td colSpan={8} className="py-16 text-center text-[var(--text-3)]">
                <p className="mb-2 text-4xl">👤</p>
                <p className="text-sm">Aucun membre. Ajoutez-en un pour la page La FMA.</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
