import type { Status } from "@prisma/client";

export type ConventionWriteBody = {
  slug: string;
  titleFr: string;
  titleEn: string | null;
  titleAr: string | null;
  descriptionFr: string | null;
  descriptionEn: string | null;
  descriptionAr: string | null;
  pdfFile: string | null;
  category: string | null;
  signedAt: Date | null;
  status: Status;
  order: number;
};

function str(v: unknown): string | null {
  const t = String(v ?? "").trim();
  return t === "" ? null : t;
}

function strReq(v: unknown): string {
  return String(v ?? "").trim();
}

function parseSignedAt(v: unknown): Date | null {
  if (v == null || v === "") return null;
  const s = String(v).trim();
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function parseConventionBody(input: unknown): { ok: true; data: ConventionWriteBody } | { ok: false; message: string } {
  if (!input || typeof input !== "object") return { ok: false, message: "Corps JSON invalide" };
  const b = input as Record<string, unknown>;

  const slug = strReq(b.slug).toLowerCase().replace(/\s+/g, "-");
  if (!slug) return { ok: false, message: "Le slug est obligatoire" };
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return { ok: false, message: "Slug invalide (lettres minuscules, chiffres et tirets uniquement)" };
  }

  const titleFr = strReq(b.titleFr);
  if (!titleFr) return { ok: false, message: "Le titre (FR) est obligatoire" };

  const statusRaw = String(b.status ?? "PUBLISHED").toUpperCase();
  const status: Status = statusRaw === "DRAFT" ? "DRAFT" : "PUBLISHED";

  const orderRaw = Number(b.order);
  const order = Number.isFinite(orderRaw) ? Math.trunc(orderRaw) : 0;

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
      pdfFile: str(b.pdfFile),
      category: str(b.category),
      signedAt: parseSignedAt(b.signedAt),
      status,
      order,
    },
  };
}
