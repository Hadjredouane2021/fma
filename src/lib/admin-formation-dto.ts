import type { Status } from "@prisma/client";

export type FormationWriteBody = {
  slug: string;
  titleFr: string;
  titleEn: string | null;
  titleAr: string | null;
  descriptionFr: string | null;
  descriptionEn: string | null;
  descriptionAr: string | null;
  organizer: string | null;
  duration: string | null;
  format: string | null;
  level: string | null;
  price: string | null;
  startDate: Date | null;
  endDate: Date | null;
  location: string | null;
  registrationUrl: string | null;
  status: Status;
};

function str(v: unknown): string | null {
  const t = String(v ?? "").trim();
  return t === "" ? null : t;
}

function parseDate(v: unknown): Date | null {
  if (v == null || v === "") return null;
  const d = new Date(String(v).trim());
  return Number.isNaN(d.getTime()) ? null : d;
}

export function parseFormationBody(input: unknown): { ok: true; data: FormationWriteBody } | { ok: false; message: string } {
  if (!input || typeof input !== "object") return { ok: false, message: "Corps JSON invalide" };
  const b = input as Record<string, unknown>;

  const slug = String(b.slug ?? "").trim().toLowerCase().replace(/\s+/g, "-");
  if (!slug) return { ok: false, message: "Le slug est obligatoire" };
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
    return { ok: false, message: "Slug invalide (lettres minuscules, chiffres et tirets uniquement)" };

  const titleFr = String(b.titleFr ?? "").trim();
  if (!titleFr) return { ok: false, message: "Le titre (FR) est obligatoire" };

  const statusRaw = String(b.status ?? "PUBLISHED").toUpperCase();
  const status: Status = statusRaw === "DRAFT" ? "DRAFT" : "PUBLISHED";

  return {
    ok: true,
    data: {
      slug,
      titleFr,
      titleEn: str(b.titleEn),
      titleAr: str(b.titleAr),
      descriptionFr: str(b.descriptionFr),
      descriptionEn: str(b.descriptionEn),
      descriptionAr: str(b.descriptionAr),
      organizer: str(b.organizer),
      duration: str(b.duration),
      format: str(b.format),
      level: str(b.level),
      price: str(b.price),
      startDate: parseDate(b.startDate),
      endDate: parseDate(b.endDate),
      location: str(b.location),
      registrationUrl: str(b.registrationUrl),
      status,
    },
  };
}
