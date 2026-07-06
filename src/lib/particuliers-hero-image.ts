import { localizedText } from "@/lib/localized-content";
import type { Locale } from "@/types";

export type ParticuliersHeroImageUrls = {
  fr: string;
  en: string;
  ar: string;
};

export const EMPTY_PARTICULIERS_HERO_IMAGE_URLS: ParticuliersHeroImageUrls = {
  fr: "",
  en: "",
  ar: "",
};

/** Parse BDD : objet { fr, en, ar } ou ancienne URL unique (string / imageUrl). */
export function normalizeParticuliersHeroImageUrls(input: unknown): ParticuliersHeroImageUrls {
  if (typeof input === "string") {
    const v = input.trim();
    return v ? { fr: v, en: "", ar: "" } : { ...EMPTY_PARTICULIERS_HERO_IMAGE_URLS };
  }

  if (!input || typeof input !== "object") {
    return { ...EMPTY_PARTICULIERS_HERO_IMAGE_URLS };
  }

  const d = input as Partial<ParticuliersHeroImageUrls> & { imageUrl?: string };
  if (typeof d.imageUrl === "string") {
    const v = d.imageUrl.trim();
    return v ? { fr: v, en: "", ar: "" } : { ...EMPTY_PARTICULIERS_HERO_IMAGE_URLS };
  }

  return {
    fr: String(d.fr ?? "").trim(),
    en: String(d.en ?? "").trim(),
    ar: String(d.ar ?? "").trim(),
  };
}

export function parseParticuliersHeroImageUrlsFromSetting(
  raw: string | null | undefined
): ParticuliersHeroImageUrls {
  if (!raw?.trim()) return { ...EMPTY_PARTICULIERS_HERO_IMAGE_URLS };
  const trimmed = raw.trim();
  if (trimmed.startsWith("{")) {
    try {
      return normalizeParticuliersHeroImageUrls(JSON.parse(trimmed));
    } catch {
      return normalizeParticuliersHeroImageUrls(trimmed);
    }
  }
  return normalizeParticuliersHeroImageUrls(trimmed);
}

export function particuliersHeroImageUrl(
  images: ParticuliersHeroImageUrls,
  locale: Locale
): string | null {
  const url = localizedText(images, locale);
  return url || null;
}
