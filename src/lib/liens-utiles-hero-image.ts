import { localizedText } from "@/lib/localized-content";
import type { Locale } from "@/types";

export type LiensUtilesHeroImageUrls = {
  fr: string;
  en: string;
  ar: string;
};

export const EMPTY_LIENS_UTILES_HERO_IMAGE_URLS: LiensUtilesHeroImageUrls = {
  fr: "",
  en: "",
  ar: "",
};

/** Parse BDD : objet { fr, en, ar } ou ancienne URL unique (string / imageUrl). */
export function normalizeLiensUtilesHeroImageUrls(input: unknown): LiensUtilesHeroImageUrls {
  if (typeof input === "string") {
    const v = input.trim();
    return v ? { fr: v, en: "", ar: "" } : { ...EMPTY_LIENS_UTILES_HERO_IMAGE_URLS };
  }

  if (!input || typeof input !== "object") {
    return { ...EMPTY_LIENS_UTILES_HERO_IMAGE_URLS };
  }

  const d = input as Partial<LiensUtilesHeroImageUrls> & { imageUrl?: string };
  if (typeof d.imageUrl === "string") {
    const v = d.imageUrl.trim();
    return v ? { fr: v, en: "", ar: "" } : { ...EMPTY_LIENS_UTILES_HERO_IMAGE_URLS };
  }

  return {
    fr: String(d.fr ?? "").trim(),
    en: String(d.en ?? "").trim(),
    ar: String(d.ar ?? "").trim(),
  };
}

export function parseLiensUtilesHeroImageUrlsFromSetting(
  raw: string | null | undefined
): LiensUtilesHeroImageUrls {
  if (!raw?.trim()) return { ...EMPTY_LIENS_UTILES_HERO_IMAGE_URLS };
  const trimmed = raw.trim();
  if (trimmed.startsWith("{")) {
    try {
      return normalizeLiensUtilesHeroImageUrls(JSON.parse(trimmed));
    } catch {
      return normalizeLiensUtilesHeroImageUrls(trimmed);
    }
  }
  return normalizeLiensUtilesHeroImageUrls(trimmed);
}

export function liensUtilesHeroImageUrl(
  images: LiensUtilesHeroImageUrls,
  locale: Locale
): string | null {
  const url = localizedText(images, locale);
  return url || null;
}
