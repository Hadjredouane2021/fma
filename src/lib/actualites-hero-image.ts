import { localizedText } from "@/lib/localized-content";
import type { Locale } from "@/types";

export type ActualitesHeroImageUrls = {
  fr: string;
  en: string;
  ar: string;
};

export const EMPTY_ACTUALITES_HERO_IMAGE_URLS: ActualitesHeroImageUrls = {
  fr: "",
  en: "",
  ar: "",
};

/** Parse BDD : objet { fr, en, ar } ou ancienne URL unique (string / imageUrl). */
export function normalizeActualitesHeroImageUrls(input: unknown): ActualitesHeroImageUrls {
  if (typeof input === "string") {
    const v = input.trim();
    return v ? { fr: v, en: "", ar: "" } : { ...EMPTY_ACTUALITES_HERO_IMAGE_URLS };
  }

  if (!input || typeof input !== "object") {
    return { ...EMPTY_ACTUALITES_HERO_IMAGE_URLS };
  }

  const d = input as Partial<ActualitesHeroImageUrls> & { imageUrl?: string };
  if (typeof d.imageUrl === "string") {
    const v = d.imageUrl.trim();
    return v ? { fr: v, en: "", ar: "" } : { ...EMPTY_ACTUALITES_HERO_IMAGE_URLS };
  }

  return {
    fr: String(d.fr ?? "").trim(),
    en: String(d.en ?? "").trim(),
    ar: String(d.ar ?? "").trim(),
  };
}

export function parseActualitesHeroImageUrlsFromSetting(
  raw: string | null | undefined
): ActualitesHeroImageUrls {
  if (!raw?.trim()) return { ...EMPTY_ACTUALITES_HERO_IMAGE_URLS };
  const trimmed = raw.trim();
  if (trimmed.startsWith("{")) {
    try {
      return normalizeActualitesHeroImageUrls(JSON.parse(trimmed));
    } catch {
      return normalizeActualitesHeroImageUrls(trimmed);
    }
  }
  return normalizeActualitesHeroImageUrls(trimmed);
}

export function actualitesHeroImageUrl(
  images: ActualitesHeroImageUrls,
  locale: Locale
): string | null {
  const url = localizedText(images, locale);
  return url || null;
}
