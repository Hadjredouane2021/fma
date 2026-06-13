"use client";

import { ArrowRight } from "lucide-react";
import type { Publication, Locale } from "@/types";
import { cn } from "@/lib/utils";
import { resolvePublicationDisplayDate } from "@/lib/publication-date";
import { isPdfUrl, PdfViewerModal } from "@/components/common/PdfViewerModal";

const localeMap: Record<Locale, string> = { fr: "fr-FR", en: "en-US", ar: "ar-MA" };

const yearBandLabels: Record<Locale, string> = {
  fr: "Année",
  en: "Year",
  ar: "السنة",
};

const typeLabels: Record<string, Record<string, string>> = {
  "chiffres-cles": { fr: "Chiffres clés", en: "Key Figures", ar: "أرقام رئيسية" },
  "faits-marquants": { fr: "Faits marquants", en: "Highlights", ar: "أبرز الأحداث" },
  courrier: { fr: "Le Courrier", en: "Newsletter", ar: "نشرة التأمين" },
};

const readMoreLabels: Record<Locale, string> = {
  fr: "Lire la suite",
  en: "Read more",
  ar: "اقرأ المزيد",
};

const pdfLabels: Record<Locale, string> = {
  fr: "Consulter le PDF",
  en: "View PDF",
  ar: "عرض PDF",
};

interface PublicationCardProps {
  publication: Publication;
  locale: Locale;
  className?: string;
}

function PublicationDateCalendar({ publication, locale }: { publication: Publication; locale: Locale }) {
  const { date, mode } = resolvePublicationDisplayDate(publication);
  const loc = localeMap[locale];

  const year = date.getFullYear();
  const month = new Intl.DateTimeFormat(loc, { month: "short" }).format(date).replace(/\./g, "");
  const day = String(date.getDate());

  const dateLabel =
    mode === "year"
      ? String(year)
      : new Intl.DateTimeFormat(loc, { day: "numeric", month: "long", year: "numeric" }).format(date);

  const bandLabel = mode === "year" ? yearBandLabels[locale] : month;
  const mainLabel = mode === "full" ? day : String(year);

  return (
    <div
      className="publication-date-calendar relative z-10 flex h-[4.25rem] w-[4.25rem] shrink-0 flex-col rounded-xl text-center"
      aria-label={dateLabel}
      title={dateLabel}
    >
      <div className="publication-date-calendar__band shrink-0 px-1 py-1 text-[10px] font-bold uppercase leading-none tracking-wide">
        {bandLabel}
      </div>
      <div className="publication-date-calendar__body flex min-h-0 flex-1 flex-col items-center justify-center px-1">
        <span
          className={cn(
            "publication-date-calendar__day font-display font-bold leading-none tabular-nums",
            mode === "full" ? "text-xl" : mode === "month-year" ? "text-lg" : "text-base"
          )}
        >
          {mainLabel}
        </span>
        {mode === "full" ? (
          <span className="publication-date-calendar__year mt-0.5 text-[11px] font-bold leading-none tabular-nums">
            {year}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function ActionLink({
  href,
  label,
  external,
}: {
  href: string;
  label: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      className="group/action relative z-10 inline-flex items-center gap-2 text-sm font-bold text-accent transition-all hover:gap-3 hover:text-primary"
    >
      <span>{label}</span>
      <ArrowRight className="h-4 w-4" />
    </a>
  );
}

export function PublicationCard({ publication, locale, className }: PublicationCardProps) {
  const title =
    locale === "ar"
      ? publication.titleAr || publication.titleFr
      : locale === "en"
        ? publication.titleEn || publication.titleFr
        : publication.titleFr;
  const typeLabel = typeLabels[publication.type]?.[locale] || publication.type;

  const readMore = publication.readMoreUrl?.trim() || "";
  const pdfFile = publication.pdfFile?.trim() || "";
  const readMoreIsPdf = Boolean(readMore && isPdfUrl(readMore));
  const pdfUrl = pdfFile || (readMoreIsPdf ? readMore : "");
  const externalReadMore = readMore && !readMoreIsPdf ? readMore : "";

  const meta = typeLabel;
  const readMoreLabel = readMoreLabels[locale];
  const pdfLabel = pdfLabels[locale];
  const showPdfAction = Boolean(pdfUrl);
  const showReadMore = Boolean(externalReadMore);
  const showFooter = showPdfAction || showReadMore;

  const cardClass = cn(
    "glass-liquid flex w-full flex-col overflow-hidden rounded-2xl card-hover transition-colors",
    className
  );

  const actionClass =
    "group/action relative z-10 inline-flex items-center gap-2 text-sm font-bold text-accent transition-all hover:gap-3 hover:text-primary";

  return (
    <div className={cardClass}>
      <div className="relative z-10 flex items-center gap-4 px-4 py-4">
        <PublicationDateCalendar publication={publication} locale={locale} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-snug text-[var(--text-1)] line-clamp-2">{title}</p>
          {meta ? <p className="mt-0.5 text-xs text-[var(--text-3)]">{meta}</p> : null}
        </div>
      </div>

      {showFooter ? (
        <div className="relative z-10 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[var(--border)]/40 px-4 py-3">
          {showPdfAction ? (
            showReadMore ? (
              <PdfViewerModal url={pdfUrl} title={title} locale={locale} className="inline-flex">
                <span className={actionClass}>
                  <span>{pdfLabel}</span>
                  <ArrowRight className="h-4 w-4" />
                </span>
              </PdfViewerModal>
            ) : (
              <PdfViewerModal url={pdfUrl} title={title} locale={locale} className="inline-flex">
                <span className={actionClass}>
                  <span>{readMoreLabel}</span>
                  <ArrowRight className="h-4 w-4" />
                </span>
              </PdfViewerModal>
            )
          ) : null}
          {showReadMore ? (
            <ActionLink href={externalReadMore} label={readMoreLabel} external />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
