"use client";

import { ArrowRight } from "lucide-react";
import type { Publication, Locale } from "@/types";
import { cn } from "@/lib/utils";
import { localizedText, publicationTitle } from "@/lib/localized-content";
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
      className={cn(
        "publication-date-calendar relative z-10 flex shrink-0 flex-col rounded-xl text-center",
        "h-14 w-14 sm:h-[4.25rem] sm:w-[4.25rem] lg:mx-auto lg:h-[3.75rem] lg:w-[3.75rem]"
      )}
      aria-label={dateLabel}
      title={dateLabel}
    >
      <div className="publication-date-calendar__band shrink-0 px-1 py-0.5 text-[9px] font-bold uppercase leading-none tracking-wide sm:py-1 sm:text-[10px]">
        {bandLabel}
      </div>
      <div className="publication-date-calendar__body flex min-h-0 flex-1 flex-col items-center justify-center px-1">
        <span
          className={cn(
            "publication-date-calendar__day font-display font-bold leading-none tabular-nums",
            mode === "full"
              ? "text-lg sm:text-xl"
              : mode === "month-year"
                ? "text-base sm:text-lg"
                : "text-sm sm:text-base"
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
  const title = publicationTitle(publication, locale);
  const typeLabel = typeLabels[publication.type]?.[locale] || publication.type;

  const pdfFile = localizedText(
    { fr: publication.pdfFileFr, en: publication.pdfFileEn, ar: publication.pdfFileAr },
    locale
  );
  const readMore = localizedText(
    { fr: publication.readMoreUrlFr, en: publication.readMoreUrlEn, ar: publication.readMoreUrlAr },
    locale
  );
  const readMoreIsPdf = Boolean(readMore && isPdfUrl(readMore));
  const pdfUrl = pdfFile || (readMoreIsPdf ? readMore : "");
  const externalReadMore = readMore && !readMoreIsPdf ? readMore : "";

  const meta = typeLabel;
  const readMoreLabel = readMoreLabels[locale];
  const pdfLabel = pdfLabels[locale];
  const showPdfAction = Boolean(pdfUrl);
  const showReadMore = Boolean(externalReadMore);
  const showFooter = showPdfAction || showReadMore;

  const cardClass = cn("publication-card-glass flex w-full flex-col", className);

  const actionClass =
    "group/action relative z-10 inline-flex items-center gap-1.5 text-xs font-bold text-accent transition-all hover:gap-2 hover:text-primary sm:gap-2 sm:text-sm";

  return (
    <div className={cardClass}>
      <div className="publication-card-glass__accent" aria-hidden />
      <div className="publication-card-glass__main flex items-start gap-3 px-3 py-3.5 sm:items-center sm:gap-4 sm:px-4 sm:py-4 lg:flex-col lg:items-stretch lg:gap-2.5 lg:px-3.5 lg:py-3.5">
        <PublicationDateCalendar publication={publication} locale={locale} />
        <div className="min-w-0 flex-1 lg:w-full">
          <p className="text-[13px] font-semibold leading-snug text-[var(--text-1)] line-clamp-3 sm:text-sm sm:line-clamp-2 lg:text-center lg:text-xs lg:leading-relaxed lg:line-clamp-4">
            {title}
          </p>
          {meta ? (
            <p className="mt-1 text-[11px] text-[var(--text-3)] sm:text-xs lg:text-center">{meta}</p>
          ) : null}
        </div>
      </div>

      {showFooter ? (
        <div className="publication-card-glass__footer flex flex-wrap items-center justify-start gap-x-4 gap-y-2 px-3 py-2.5 sm:gap-x-5 sm:px-4 sm:py-3 lg:justify-center">
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
