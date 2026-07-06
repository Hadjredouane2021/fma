import { localizedText } from "@/lib/localized-content";
import type { Locale } from "@/types";

export type ContactHeroImageUrls = {
  fr: string;
  en: string;
  ar: string;
};

export const EMPTY_CONTACT_HERO_IMAGE_URLS: ContactHeroImageUrls = {
  fr: "",
  en: "",
  ar: "",
};

/** Parse BDD : objet { fr, en, ar } ou ancienne URL unique (string / imageUrl). */
export function normalizeContactHeroImageUrls(input: unknown): ContactHeroImageUrls {
  if (typeof input === "string") {
    const v = input.trim();
    return v ? { fr: v, en: "", ar: "" } : { ...EMPTY_CONTACT_HERO_IMAGE_URLS };
  }

  if (!input || typeof input !== "object") {
    return { ...EMPTY_CONTACT_HERO_IMAGE_URLS };
  }

  const d = input as Partial<ContactHeroImageUrls> & { imageUrl?: string };
  if (typeof d.imageUrl === "string") {
    const v = d.imageUrl.trim();
    return v ? { fr: v, en: "", ar: "" } : { ...EMPTY_CONTACT_HERO_IMAGE_URLS };
  }

  return {
    fr: String(d.fr ?? "").trim(),
    en: String(d.en ?? "").trim(),
    ar: String(d.ar ?? "").trim(),
  };
}

export function parseContactHeroImageUrlsFromSetting(
  raw: string | null | undefined
): ContactHeroImageUrls {
  if (!raw?.trim()) return { ...EMPTY_CONTACT_HERO_IMAGE_URLS };
  const trimmed = raw.trim();
  if (trimmed.startsWith("{")) {
    try {
      return normalizeContactHeroImageUrls(JSON.parse(trimmed));
    } catch {
      return normalizeContactHeroImageUrls(trimmed);
    }
  }
  return normalizeContactHeroImageUrls(trimmed);
}

export function contactHeroImageUrl(
  images: ContactHeroImageUrls,
  locale: Locale
): string | null {
  const url = localizedText(images, locale);
  return url || null;
}
