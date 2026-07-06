import { localizedText } from "@/lib/localized-content";
import { GALLERY_CATEGORIES } from "@/lib/galleries";
import type { Locale } from "@/types";

export const PUBLICATION_HERO_TYPES = [
  "chiffres-cles",
  "faits-marquants",
  "courrier",
  ...GALLERY_CATEGORIES,
] as const;

export type PublicationHeroType = (typeof PUBLICATION_HERO_TYPES)[number];

export type PublicationHeroLocaleUrls = {
  fr: string;
  en: string;
  ar: string;
};

export const EMPTY_PUBLICATION_HERO_LOCALE_URLS: PublicationHeroLocaleUrls = {
  fr: "",
  en: "",
  ar: "",
};

export type PublicationsHeroImages = Record<PublicationHeroType, PublicationHeroLocaleUrls>;

export function emptyPublicationsHeroImages(): PublicationsHeroImages {
  return Object.fromEntries(
    PUBLICATION_HERO_TYPES.map((t) => [t, { ...EMPTY_PUBLICATION_HERO_LOCALE_URLS }])
  ) as PublicationsHeroImages;
}

export function normalizePublicationHeroLocaleUrls(input: unknown): PublicationHeroLocaleUrls {
  if (typeof input === "string") {
    const v = input.trim();
    return v ? { fr: v, en: "", ar: "" } : { ...EMPTY_PUBLICATION_HERO_LOCALE_URLS };
  }

  if (!input || typeof input !== "object") {
    return { ...EMPTY_PUBLICATION_HERO_LOCALE_URLS };
  }

  const d = input as Partial<PublicationHeroLocaleUrls>;
  return {
    fr: String(d.fr ?? "").trim(),
    en: String(d.en ?? "").trim(),
    ar: String(d.ar ?? "").trim(),
  };
}

/** Parse BDD : `{ type: url }` (legacy) ou `{ type: { fr, en, ar } }`. */
export function normalizePublicationsHeroImages(input: unknown): PublicationsHeroImages {
  const result = emptyPublicationsHeroImages();
  if (!input || typeof input !== "object") return result;

  const d = input as Record<string, unknown>;
  for (const t of PUBLICATION_HERO_TYPES) {
    if (t in d) {
      result[t] = normalizePublicationHeroLocaleUrls(d[t]);
    }
  }
  return result;
}

export function parsePublicationsHeroImagesFromSetting(
  raw: string | null | undefined
): PublicationsHeroImages {
  if (!raw?.trim()) return emptyPublicationsHeroImages();
  try {
    return normalizePublicationsHeroImages(JSON.parse(raw.trim()));
  } catch {
    return emptyPublicationsHeroImages();
  }
}

export function mergePublicationsHeroImages(
  current: PublicationsHeroImages,
  patch: unknown
): PublicationsHeroImages {
  const next = { ...current };
  if (!patch || typeof patch !== "object") return next;

  const d = patch as Record<string, unknown>;
  for (const t of PUBLICATION_HERO_TYPES) {
    if (!(t in d)) continue;
    const val = d[t];
    if (typeof val === "string") {
      next[t] = normalizePublicationHeroLocaleUrls(val);
    } else {
      next[t] = normalizePublicationHeroLocaleUrls({ ...current[t], ...(val as object) });
    }
  }
  return next;
}

export function publicationsHeroImageUrl(
  images: PublicationsHeroImages,
  type: string,
  locale: Locale
): string | null {
  if (!(PUBLICATION_HERO_TYPES as readonly string[]).includes(type)) return null;
  const urls = images[type as PublicationHeroType];
  const url = localizedText(urls, locale);
  return url || null;
}
