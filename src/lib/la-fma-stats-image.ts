import { localizedText } from "@/lib/localized-content";
import type { Locale } from "@/types";

export type LaFmaStatsImages = {
  fr: string;
  en: string;
  ar: string;
};

export const DEFAULT_LA_FMA_STATS_IMAGES: LaFmaStatsImages = {
  fr: "",
  en: "",
  ar: "",
};

const DEFAULT_FALLBACK_IMAGE = "/hero4.PNG";

/** Parse BDD : objet { fr, en, ar } ou ancienne URL unique (string / imageUrl). */
export function normalizeLaFmaStatsImages(input: unknown): LaFmaStatsImages {
  if (typeof input === "string") {
    const v = input.trim();
    return v ? { fr: v, en: "", ar: "" } : { ...DEFAULT_LA_FMA_STATS_IMAGES };
  }

  if (!input || typeof input !== "object") {
    return { ...DEFAULT_LA_FMA_STATS_IMAGES };
  }

  const d = input as Partial<LaFmaStatsImages> & { imageUrl?: string };
  if (typeof d.imageUrl === "string") {
    const v = d.imageUrl.trim();
    return v ? { fr: v, en: "", ar: "" } : { ...DEFAULT_LA_FMA_STATS_IMAGES };
  }

  return {
    fr: String(d.fr ?? "").trim(),
    en: String(d.en ?? "").trim(),
    ar: String(d.ar ?? "").trim(),
  };
}

export function laFmaStatsImageUrl(images: LaFmaStatsImages, locale: Locale): string {
  const url = localizedText(images, locale);
  return url || DEFAULT_FALLBACK_IMAGE;
}

export function parseLaFmaStatsImagesFromSetting(raw: string | null | undefined): LaFmaStatsImages {
  if (!raw?.trim()) return { ...DEFAULT_LA_FMA_STATS_IMAGES };
  const trimmed = raw.trim();
  if (trimmed.startsWith("{")) {
    try {
      return normalizeLaFmaStatsImages(JSON.parse(trimmed));
    } catch {
      return normalizeLaFmaStatsImages(trimmed);
    }
  }
  return normalizeLaFmaStatsImages(trimmed);
}
