import { localizedText } from "@/lib/localized-content";
import type { Locale } from "@/types";

export type FormationsHeroImageUrls = {
  fr: string;
  en: string;
  ar: string;
};

export const EMPTY_FORMATIONS_HERO_IMAGE_URLS: FormationsHeroImageUrls = {
  fr: "",
  en: "",
  ar: "",
};

/** Parse BDD : objet { fr, en, ar } ou ancienne URL unique (string / imageUrl). */
export function normalizeFormationsHeroImageUrls(input: unknown): FormationsHeroImageUrls {
  if (typeof input === "string") {
    const v = input.trim();
    return v ? { fr: v, en: "", ar: "" } : { ...EMPTY_FORMATIONS_HERO_IMAGE_URLS };
  }

  if (!input || typeof input !== "object") {
    return { ...EMPTY_FORMATIONS_HERO_IMAGE_URLS };
  }

  const d = input as Partial<FormationsHeroImageUrls> & { imageUrl?: string };
  if (typeof d.imageUrl === "string") {
    const v = d.imageUrl.trim();
    return v ? { fr: v, en: "", ar: "" } : { ...EMPTY_FORMATIONS_HERO_IMAGE_URLS };
  }

  return {
    fr: String(d.fr ?? "").trim(),
    en: String(d.en ?? "").trim(),
    ar: String(d.ar ?? "").trim(),
  };
}

export function parseFormationsHeroImageUrlsFromSetting(
  raw: string | null | undefined
): FormationsHeroImageUrls {
  if (!raw?.trim()) return { ...EMPTY_FORMATIONS_HERO_IMAGE_URLS };
  const trimmed = raw.trim();
  if (trimmed.startsWith("{")) {
    try {
      return normalizeFormationsHeroImageUrls(JSON.parse(trimmed));
    } catch {
      return normalizeFormationsHeroImageUrls(trimmed);
    }
  }
  return normalizeFormationsHeroImageUrls(trimmed);
}

export function formationsHeroImageUrl(
  images: FormationsHeroImageUrls,
  locale: Locale
): string | null {
  const url = localizedText(images, locale);
  return url || null;
}
