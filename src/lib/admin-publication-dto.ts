import type { Status } from "@prisma/client";

type PublicationBody = Record<string, unknown>;

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const strOrNull = (v: unknown) => {
  const s = str(v);
  return s || null;
};

export function publicationDataFromBody(body: PublicationBody) {
  return {
    titleFr: str(body.titleFr),
    titleEn: strOrNull(body.titleEn),
    titleAr: strOrNull(body.titleAr),
    slug: str(body.slug),
    type: str(body.type) || "chiffres-cles",
    descriptionFr: strOrNull(body.descriptionFr),
    descriptionEn: strOrNull(body.descriptionEn),
    descriptionAr: strOrNull(body.descriptionAr),
    pdfFile: strOrNull(body.pdfFile),
    coverImage: strOrNull(body.coverImage),
    readMoreUrl: strOrNull(body.readMoreUrl),
    year: body.year != null && body.year !== "" ? Number(body.year) : null,
    status: (str(body.status) || "DRAFT") as Status,
    featured: Boolean(body.featured),
    announcePopup: Boolean(body.announcePopup),
  };
}
