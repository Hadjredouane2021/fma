import { localizedText } from "@/lib/localized-content";
import type { Locale } from "@/types";

export type ConventionsHeroImageUrls = {
  fr: string;
  en: string;
  ar: string;
};

export const EMPTY_CONVENTIONS_HERO_IMAGE_URLS: ConventionsHeroImageUrls = {
  fr: "",
  en: "",
  ar: "",
};

/** Parse BDD : objet { fr, en, ar } ou ancienne URL unique (string / imageUrl). */
export function normalizeConventionsHeroImageUrls(input: unknown): ConventionsHeroImageUrls {
  if (typeof input === "string") {
    const v = input.trim();
    return v ? { fr: v, en: "", ar: "" } : { ...EMPTY_CONVENTIONS_HERO_IMAGE_URLS };
  }

  if (!input || typeof input !== "object") {
    return { ...EMPTY_CONVENTIONS_HERO_IMAGE_URLS };
  }

  const d = input as Partial<ConventionsHeroImageUrls> & { imageUrl?: string };
  if (typeof d.imageUrl === "string") {
    const v = d.imageUrl.trim();
    return v ? { fr: v, en: "", ar: "" } : { ...EMPTY_CONVENTIONS_HERO_IMAGE_URLS };
  }

  return {
    fr: String(d.fr ?? "").trim(),
    en: String(d.en ?? "").trim(),
    ar: String(d.ar ?? "").trim(),
  };
}

export function parseConventionsHeroImageUrlsFromSetting(
  raw: string | null | undefined
): ConventionsHeroImageUrls {
  if (!raw?.trim()) return { ...EMPTY_CONVENTIONS_HERO_IMAGE_URLS };
  const trimmed = raw.trim();
  if (trimmed.startsWith("{")) {
    try {
      return normalizeConventionsHeroImageUrls(JSON.parse(trimmed));
    } catch {
      return normalizeConventionsHeroImageUrls(trimmed);
    }
  }
  return normalizeConventionsHeroImageUrls(trimmed);
}

export function conventionsHeroImageUrl(
  images: ConventionsHeroImageUrls,
  locale: Locale
): string | null {
  const url = localizedText(images, locale);
  return url || null;
}
