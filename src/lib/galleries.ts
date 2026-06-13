export type GalleryTitle = { fr: string; en: string; ar: string };
export type GalleryItem = { url: string; link: string };
export type GalleryData = { title: GalleryTitle; items: GalleryItem[] };

export type GalleryCategory =
  | "conseil-fma"
  | "glossaire"
  | "saviez-vous"
  | "prevention"
  | "quiz-time"
  | "reglementation"
  | "interventions-fma"
  | "reseaux-sociaux";

export const GALLERY_CATEGORIES: GalleryCategory[] = [
  "conseil-fma",
  "glossaire",
  "saviez-vous",
  "prevention",
  "quiz-time",
  "reglementation",
  "interventions-fma",
  "reseaux-sociaux",
];

const CONSEIL_FMA_FILES = [
  "040324.png", "040625.png", "040725.png", "050325.png", "060324.png",
  "080825.png", "090425.png", "100724.png", "120824.png", "171025.png",
  "180725.png", "220525.png", "220925.png", "240725.png", "260624.png",
  "260724.png", "260825.png", "280225.png", "280825.png", "290725.png",
];

const GLOSSAIRE_FILES = [
  "050825.jpg", "100925.jpeg", "110725.png", "120925.jpeg", "131125.png",
  "141125.png", "170925.png", "230224.png", "290224.png", "300925.png",
];

const SAVIEZ_VOUS_FILES = [
  "050525.png", "060824.png", "070525.png", "070725.png", "090725.png",
  "090924.png", "100624.png", "110825.png", "120624.png", "120825.png",
  "130225.png", "130924.png", "150525.png", "150724 AUTRE PHTO.png", "150925.png",
  "160725.png", "160824.png", "161024.jpg", "170724.png", "180724.png",
  "180925.png", "200125.png", "220824.png", "240624.png", "240925.png",
  "250924.png", "260824.png", "280125.jpeg", "300525.jpg", "300824.png",
  "310725.jpg",
];

const PREVENTION_FILES = [
  "010925.png", "040825.png", "080724.png", "090525.png", "110925.jpeg",
  "111224.png", "130324.png", "140225.png", "140725.png", "141025.png",
  "160525.png", "170725.png", "180825.png", "190124.png", "200624.png",
  "220725.png", "230725.png", "250125.png", "250725.png", "250825.png",
  "251125.jpg", "260625.png", "260924.png", "300425-1.png", "300425-2.png",
  "300425-3.png",
];

const QUIZ_TIME_FILES = [
  "010825.jpg", "030425.png", "060325.png", "150225.png", "220125.png",
  "230724.png", "260925.png", "270924.png",
];

const REGLEMENTATION_FILES = [
  "010324.png", "020824.png", "040425.png", "050725.jpg", "070824.png",
  "090824.png", "111024.png", "210624.png", "260224.png", "310724.png",
];

export const GALLERY_CONFIG: Record<GalleryCategory, { title: GalleryTitle; folder: string; uploadFolder: string; defaultFiles: string[] }> = {
  "conseil-fma": {
    title: { fr: "Le Conseil FMA", en: "The FMA Council", ar: "مجلس الاتحاد" },
    folder: "/LE CONSEIL FMA",
    uploadFolder: "conseil-fma",
    defaultFiles: CONSEIL_FMA_FILES,
  },
  glossaire: {
    title: { fr: "Le Glossaire", en: "Glossary", ar: "المعجم" },
    folder: "/LE GLOSSAIRE",
    uploadFolder: "gallery-glossaire",
    defaultFiles: GLOSSAIRE_FILES,
  },
  "saviez-vous": {
    title: { fr: "Le Saviez-vous", en: "Did You Know", ar: "هل تعلم" },
    folder: "/LE SAVIEZ-VOUS",
    uploadFolder: "gallery-saviez-vous",
    defaultFiles: SAVIEZ_VOUS_FILES,
  },
  prevention: {
    title: { fr: "Prévention", en: "Prevention", ar: "الوقاية" },
    folder: "/PREVENTION",
    uploadFolder: "gallery-prevention",
    defaultFiles: PREVENTION_FILES,
  },
  "quiz-time": {
    title: { fr: "Quiz Time", en: "Quiz Time", ar: "وقت الاختبار" },
    folder: "/QUIZ TIME",
    uploadFolder: "gallery-quiz-time",
    defaultFiles: QUIZ_TIME_FILES,
  },
  reglementation: {
    title: { fr: "Réglementation", en: "Regulation", ar: "التنظيم" },
    folder: "/REGLEMENTATION",
    uploadFolder: "gallery-reglementation",
    defaultFiles: REGLEMENTATION_FILES,
  },
  "interventions-fma": {
    title: { fr: "Interventions FMA", en: "FMA Interventions", ar: "تدخلات الاتحاد" },
    folder: "/INTERVENTIONS-FMA",
    uploadFolder: "gallery-interventions-fma",
    defaultFiles: [],
  },
  "reseaux-sociaux": {
    title: { fr: "Réseaux sociaux", en: "Social media", ar: "الشبكات الاجتماعية" },
    folder: "/RESEAUX-SOCIAUX",
    uploadFolder: "gallery-reseaux-sociaux",
    defaultFiles: [],
  },
};

export function defaultGalleryItems(category: GalleryCategory): GalleryItem[] {
  const { folder, defaultFiles } = GALLERY_CONFIG[category];
  return defaultFiles.map((f) => ({ url: `${folder}/${encodeURIComponent(f)}`, link: "" }));
}

export function isGalleryCategory(value: string): value is GalleryCategory {
  return (GALLERY_CATEGORIES as string[]).includes(value);
}

export function dbKeyForGallery(category: GalleryCategory): string {
  return `gallery_${category.replace(/-/g, "_")}_images`;
}

export function normalizeGalleryItems(value: unknown): GalleryItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry): GalleryItem | null => {
      if (typeof entry === "string") return { url: entry, link: "" };
      if (entry && typeof entry === "object" && typeof (entry as { url?: unknown }).url === "string") {
        const link = (entry as { link?: unknown }).link;
        return { url: (entry as { url: string }).url, link: typeof link === "string" ? link : "" };
      }
      return null;
    })
    .filter((v): v is GalleryItem => v !== null && v.url.trim().length > 0);
}

export function parseGalleryData(value: string | null | undefined, category: GalleryCategory): GalleryData {
  const defaults = GALLERY_CONFIG[category].title;
  if (!value) return { title: defaults, items: defaultGalleryItems(category) };
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      const items = normalizeGalleryItems(parsed);
      return { title: defaults, items: items.length > 0 ? items : defaultGalleryItems(category) };
    }
    const items = normalizeGalleryItems(parsed.items ?? parsed.images);
    const title = {
      fr: typeof parsed.title?.fr === "string" ? parsed.title.fr : defaults.fr,
      en: typeof parsed.title?.en === "string" ? parsed.title.en : defaults.en,
      ar: typeof parsed.title?.ar === "string" ? parsed.title.ar : defaults.ar,
    };
    return { title, items: items.length > 0 ? items : defaultGalleryItems(category) };
  } catch {
    return { title: defaults, items: defaultGalleryItems(category) };
  }
}
