"use client";

import Link from "next/link";
import { useState } from "react";
import { Download, ExternalLink, Eye, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonTabActive, buttonTabInactive } from "@/lib/button-styles";
import { AdminLocaleBadges } from "@/components/admin/AdminLocaleBadges";
import { ADMIN_LOCALE_TABS, type AdminLocale } from "@/lib/admin-locale";
import {
  localizedText,
  publicationLocaleLevel,
  publicationTitle,
  publicationTitleUsesFallback,
  type TeamMemberLocaleLevel,
} from "@/lib/localized-content";
import type { Locale } from "@/types";
import DeletePublicationButton from "./DeletePublicationButton";

export type PublicationsTableRow = {
  id: string;
  slug: string;
  type: string;
  year: number | null;
  status: string;
  announcePopup: boolean;
  titleFr: string;
  titleEn: string | null;
  titleAr: string | null;
  readMoreUrlFr: string | null;
  readMoreUrlEn: string | null;
  readMoreUrlAr: string | null;
  pdfFileFr: string | null;
  pdfFileEn: string | null;
  pdfFileAr: string | null;
};

const TYPE_LABELS: Record<string, string> = {
  "chiffres-cles": "Chiffres clés",
  "faits-marquants": "Faits marquants",
  courrier: "Le Courrier",
};

const TYPE_COLORS: Record<string, string> = {
  "chiffres-cles":
    "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/45 dark:text-blue-300 dark:border-blue-800/40",
  "faits-marquants":
    "bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-950/45 dark:text-purple-300 dark:border-purple-800/40",
  courrier:
    "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/45 dark:text-amber-300 dark:border-amber-800/40",
};

function localeStatus(pub: PublicationsTableRow): Record<AdminLocale, TeamMemberLocaleLevel> {
  return {
    fr: publicationLocaleLevel(pub, "fr"),
    en: publicationLocaleLevel(pub, "en"),
    ar: publicationLocaleLevel(pub, "ar"),
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

export function PublicationsAdminTable({
  publications,
  emptyMessage,
}: {
  publications: PublicationsTableRow[];
  emptyMessage: string;
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
          Titre affiché sur /{locale}/publications — repli FR si traduction absente.
        </p>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--border)] bg-[var(--bg-alt)]">
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">
              Titre ({currentTab.label})
            </th>
            <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">
              Traductions
            </th>
            <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">
              Type
            </th>
            <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">
              Année
            </th>
            <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">
              Statut
            </th>
            <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)]">
          {publications.map((pub) => {
            const title = publicationTitle(pub, l);
            const titleFallback = publicationTitleUsesFallback(pub, l);
            const readMore = localizedText(
              { fr: pub.readMoreUrlFr, en: pub.readMoreUrlEn, ar: pub.readMoreUrlAr },
              l
            );
            const pdfFile = localizedText(
              { fr: pub.pdfFileFr, en: pub.pdfFileEn, ar: pub.pdfFileAr },
              l
            );
            const previewHref = `/${locale}/publications?type=${encodeURIComponent(pub.type)}`;

            return (
              <tr key={pub.id} className="group transition-colors hover:bg-[var(--bg-alt)]/80">
                <td className="px-6 py-4">
                  <p className="max-w-sm truncate font-semibold text-primary transition-colors group-hover:text-gold" dir={locale === "ar" ? "rtl" : "ltr"}>
                    {title}
                    <FallbackHint show={titleFallback} />
                  </p>
                  {pub.slug ? (
                    <p className="mt-0.5 font-mono text-[10px] text-[var(--text-3)]">{pub.slug}</p>
                  ) : null}
                  {pub.announcePopup && pub.status === "PUBLISHED" ? (
                    <span className="mt-0.5 inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
                      Popup
                    </span>
                  ) : null}
                </td>
                <td className="px-4 py-4">
                  <AdminLocaleBadges status={localeStatus(pub)} />
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex rounded-lg border px-2.5 py-1 text-xs font-semibold ${TYPE_COLORS[pub.type] || "border-[var(--border)] bg-[var(--bg-alt)] text-[var(--text-2)]"}`}
                  >
                    {TYPE_LABELS[pub.type] || pub.type}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm font-medium text-[var(--text-2)]">
                    {pub.year || <span className="text-[var(--text-3)]">—</span>}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${
                      pub.status === "PUBLISHED"
                        ? "border-green-100 bg-green-50 text-green-700 dark:border-green-800/50 dark:bg-green-950/40 dark:text-green-300"
                        : "border-amber-100 bg-amber-50 text-amber-700 dark:border-amber-800/50 dark:bg-amber-950/40 dark:text-amber-300"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${pub.status === "PUBLISHED" ? "bg-green-500 dark:bg-green-400" : "bg-amber-400 dark:bg-amber-300"}`}
                    />
                    {pub.status === "PUBLISHED" ? "Publié" : "Brouillon"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-1">
                    {pub.status === "PUBLISHED" ? (
                      <a
                        href={previewHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg p-2 text-[var(--text-3)] transition-colors hover:bg-[var(--bg-alt)] hover:text-primary"
                        title={`Aperçu ${currentTab.label}`}
                      >
                        <Eye className="h-4 w-4" />
                      </a>
                    ) : null}
                    {readMore ? (
                      <a
                        href={readMore}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg p-2 text-[var(--text-3)] transition-colors hover:bg-[var(--bg-alt)] hover:text-accent"
                        title="Lien « Lire la suite »"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    ) : null}
                    {pdfFile ? (
                      <a
                        href={pdfFile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg p-2 text-[var(--text-3)] transition-colors hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-950/40 dark:hover:text-green-400"
                        title="PDF"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    ) : null}
                    <Link
                      href={`/admin/publications/${pub.id}`}
                      className="rounded-lg p-2 text-[var(--text-3)] transition-colors hover:bg-[var(--bg-alt)] hover:text-primary"
                      title="Modifier"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <DeletePublicationButton id={pub.id} />
                  </div>
                </td>
              </tr>
            );
          })}
          {publications.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-16 text-center text-[var(--text-3)]">
                <p className="mb-3 text-4xl">📄</p>
                <p className="text-sm">{emptyMessage}</p>
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
