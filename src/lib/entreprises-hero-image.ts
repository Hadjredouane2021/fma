import { localizedText } from "@/lib/localized-content";
import type { Locale } from "@/types";

export type EntreprisesHeroImageUrls = {
  fr: string;
  en: string;
  ar: string;
};

export const EMPTY_ENTREPRISES_HERO_IMAGE_URLS: EntreprisesHeroImageUrls = {
  fr: "",
  en: "",
  ar: "",
};

/** Parse BDD : objet { fr, en, ar } ou ancienne URL unique (string / imageUrl). */
export function normalizeEntreprisesHeroImageUrls(input: unknown): EntreprisesHeroImageUrls {
  if (typeof input === "string") {
    const v = input.trim();
    return v ? { fr: v, en: "", ar: "" } : { ...EMPTY_ENTREPRISES_HERO_IMAGE_URLS };
  }

  if (!input || typeof input !== "object") {
    return { ...EMPTY_ENTREPRISES_HERO_IMAGE_URLS };
  }

  const d = input as Partial<EntreprisesHeroImageUrls> & { imageUrl?: string };
  if (typeof d.imageUrl === "string") {
    const v = d.imageUrl.trim();
    return v ? { fr: v, en: "", ar: "" } : { ...EMPTY_ENTREPRISES_HERO_IMAGE_URLS };
  }

  return {
    fr: String(d.fr ?? "").trim(),
    en: String(d.en ?? "").trim(),
    ar: String(d.ar ?? "").trim(),
  };
}

export function parseEntreprisesHeroImageUrlsFromSetting(
  raw: string | null | undefined
): EntreprisesHeroImageUrls {
  if (!raw?.trim()) return { ...EMPTY_ENTREPRISES_HERO_IMAGE_URLS };
  const trimmed = raw.trim();
  if (trimmed.startsWith("{")) {
    try {
      return normalizeEntreprisesHeroImageUrls(JSON.parse(trimmed));
    } catch {
      return normalizeEntreprisesHeroImageUrls(trimmed);
    }
  }
  return normalizeEntreprisesHeroImageUrls(trimmed);
}

export function entreprisesHeroImageUrl(
  images: EntreprisesHeroImageUrls,
  locale: Locale
): string | null {
  const url = localizedText(images, locale);
  return url || null;
}
