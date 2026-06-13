const YEAR_ONLY_TYPES = new Set(["chiffres-cles", "faits-marquants"]);

const MONTH_NAMES: Record<string, number> = {
  janvier: 0,
  january: 0,
  jan: 0,
  février: 1,
  fevrier: 1,
  february: 1,
  feb: 1,
  mars: 2,
  march: 2,
  mar: 2,
  avril: 3,
  april: 3,
  apr: 3,
  mai: 4,
  may: 4,
  juin: 5,
  june: 5,
  jun: 5,
  juillet: 6,
  july: 6,
  jul: 6,
  août: 7,
  aout: 7,
  august: 7,
  aug: 7,
  septembre: 8,
  september: 8,
  sep: 8,
  octobre: 9,
  october: 9,
  oct: 9,
  novembre: 10,
  november: 10,
  nov: 10,
  décembre: 11,
  decembre: 11,
  december: 11,
  dec: 11,
};

export function parseMonthFromTitle(title: string): number | null {
  const lower = title.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");
  for (const [name, index] of Object.entries(MONTH_NAMES)) {
    const normalized = name.normalize("NFD").replace(/\p{M}/gu, "");
    if (lower.includes(normalized)) return index;
  }
  return null;
}

type PublicationDateInput = {
  type: string;
  titleFr: string;
  titleEn?: string | null;
  year?: number | null;
  publishedAt?: Date | string | null;
  createdAt?: Date | string;
};

export type PublicationCalendarMode = "year" | "month-year" | "full";

export function resolvePublicationDisplayDate(
  publication: PublicationDateInput
): { date: Date; mode: PublicationCalendarMode } {
  if (publication.year != null && !Number.isNaN(publication.year)) {
    if (YEAR_ONLY_TYPES.has(publication.type)) {
      return { date: new Date(publication.year, 0, 1), mode: "year" };
    }

    const titles = [publication.titleFr, publication.titleEn].filter(Boolean) as string[];
    for (const title of titles) {
      const month = parseMonthFromTitle(title);
      if (month !== null) {
        return { date: new Date(publication.year, month, 1), mode: "month-year" };
      }
    }

    return { date: new Date(publication.year, 0, 1), mode: "year" };
  }

  if (publication.publishedAt) {
    const d = new Date(publication.publishedAt);
    if (!Number.isNaN(d.getTime())) return { date: d, mode: "full" };
  }

  const d = new Date(publication.createdAt ?? Date.now());
  return { date: d, mode: "full" };
}

export function resolvePublicationPublishedAt(
  publication: Pick<PublicationDateInput, "type" | "titleFr" | "titleEn" | "year">
): Date {
  const { date } = resolvePublicationDisplayDate({
    ...publication,
    createdAt: new Date(),
  });
  return date;
}
