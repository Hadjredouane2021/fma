import type { Status } from "@prisma/client";
import { hasAnyLocalizedText, primaryLocalizedText } from "@/lib/localized-content";

type PublicationBody = Record<string, unknown>;

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const strOrNull = (v: unknown) => {
  const s = str(v);
  return s || null;
};

function localizedPdfFromBody(body: PublicationBody) {
  return {
    fr: strOrNull(body.pdfFileFr) ?? strOrNull(body.pdfFile),
    en: strOrNull(body.pdfFileEn),
    ar: strOrNull(body.pdfFileAr),
  };
}

function localizedReadMoreFromBody(body: PublicationBody) {
  return {
    fr: strOrNull(body.readMoreUrlFr) ?? strOrNull(body.readMoreUrl),
    en: strOrNull(body.readMoreUrlEn),
    ar: strOrNull(body.readMoreUrlAr),
  };
}

export function publicationDataFromBody(body: PublicationBody) {
  const titleFr = str(body.titleFr);
  const titleEn = strOrNull(body.titleEn);
  const titleAr = strOrNull(body.titleAr);

  if (!hasAnyLocalizedText({ fr: titleFr, en: titleEn, ar: titleAr })) {
    return null;
  }

  const pdf = localizedPdfFromBody(body);
  const readMore = localizedReadMoreFromBody(body);

  return {
    titleFr,
    titleEn,
    titleAr,
    slug: str(body.slug),
    type: str(body.type) || "chiffres-cles",
    descriptionFr: strOrNull(body.descriptionFr),
    descriptionEn: strOrNull(body.descriptionEn),
    descriptionAr: strOrNull(body.descriptionAr),
    pdfFileFr: pdf.fr,
    pdfFileEn: pdf.en,
    pdfFileAr: pdf.ar,
    readMoreUrlFr: readMore.fr,
    readMoreUrlEn: readMore.en,
    readMoreUrlAr: readMore.ar,
    coverImage: strOrNull(body.coverImage),
    year: body.year != null && body.year !== "" ? Number(body.year) : null,
    status: (str(body.status) || "DRAFT") as Status,
    featured: Boolean(body.featured),
    announcePopup: Boolean(body.announcePopup),
  };
}

export function publicationSlugFromData(data: NonNullable<ReturnType<typeof publicationDataFromBody>>): string {
  return data.slug || primaryLocalizedText({ fr: data.titleFr, en: data.titleEn, ar: data.titleAr });
}
