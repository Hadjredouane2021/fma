import { publicAssetUrl } from "@/lib/utils";

export type GalleryTitle = { fr: string; en: string; ar: string };
export type GalleryItem = { url: string; link: string; photoTitle?: GalleryTitle };
export type GalleryFolderItem = GalleryItem & { inCarousel?: boolean; isCover?: boolean };
export type GalleryFolder = {
  id: string;
  title: GalleryTitle;
  description: GalleryTitle;
  items: GalleryFolderItem[];
};
export type GalleryData = {
  title: GalleryTitle;
  items: GalleryItem[];
  folders?: GalleryFolder[];
};

export const FOLDER_GALLERY_CATEGORIES = ["interventions-fma", "reseaux-sociaux"] as const;
export type FolderGalleryCategory = (typeof FOLDER_GALLERY_CATEGORIES)[number];

export function isFolderGalleryCategory(category: GalleryCategory): category is FolderGalleryCategory {
  return (FOLDER_GALLERY_CATEGORIES as readonly string[]).includes(category);
}

export type GalleryCategory = "interventions-fma" | "reseaux-sociaux";

export const GALLERY_CATEGORIES: GalleryCategory[] = [
  "interventions-fma",
  "reseaux-sociaux",
];

export const GALLERY_CONFIG: Record<GalleryCategory, { title: GalleryTitle; folder: string; uploadFolder: string; defaultFiles: string[] }> = {
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
  return defaultFiles.map((f) => ({ url: publicAssetUrl(folder, f), link: "" }));
}

export function isGalleryCategory(value: string): value is GalleryCategory {
  return (GALLERY_CATEGORIES as string[]).includes(value);
}

export function dbKeyForGallery(category: GalleryCategory): string {
  return `gallery_${category.replace(/-/g, "_")}_images`;
}

function normalizePhotoTitle(value: unknown): GalleryTitle | undefined {
  if (!value || typeof value !== "object") return undefined;
  const d = value as Record<string, unknown>;
  const fr = typeof d.fr === "string" ? d.fr : "";
  const en = typeof d.en === "string" ? d.en : "";
  const ar = typeof d.ar === "string" ? d.ar : "";
  if (!fr && !en && !ar) return undefined;
  return { fr, en, ar };
}

export function normalizeGalleryItems(value: unknown): GalleryItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry): GalleryItem | null => {
      if (typeof entry === "string") return { url: entry, link: "" };
      if (entry && typeof entry === "object" && typeof (entry as { url?: unknown }).url === "string") {
        const link = (entry as { link?: unknown }).link;
        const photoTitle = normalizePhotoTitle((entry as { photoTitle?: unknown }).photoTitle);
        return {
          url: (entry as { url: string }).url,
          link: typeof link === "string" ? link : "",
          ...(photoTitle ? { photoTitle } : {}),
        };
      }
      return null;
    })
    .filter((v): v is GalleryItem => v !== null && v.url.trim().length > 0);
}

function normalizeGalleryTitle(value: unknown, fallback: GalleryTitle): GalleryTitle {
  if (!value || typeof value !== "object") return { ...fallback };
  const d = value as Partial<GalleryTitle>;
  return {
    fr: typeof d.fr === "string" ? d.fr : fallback.fr,
    en: typeof d.en === "string" ? d.en : fallback.en,
    ar: typeof d.ar === "string" ? d.ar : fallback.ar,
  };
}

function normalizeFolderItem(entry: unknown): GalleryFolderItem | null {
  if (typeof entry === "string") return { url: entry, link: "" };
  if (!entry || typeof entry !== "object" || typeof (entry as { url?: unknown }).url !== "string") {
    return null;
  }
  const e = entry as Partial<GalleryFolderItem>;
  const photoTitle = normalizePhotoTitle(e.photoTitle);
  const url = e.url!.trim();
  if (!url) return null;
  return {
    url,
    link: typeof e.link === "string" ? e.link : "",
    ...(photoTitle ? { photoTitle } : {}),
    inCarousel: e.inCarousel === true,
    isCover: e.isCover === true,
  };
}

export function createEmptyGalleryFolder(): GalleryFolder {
  return {
    id: `folder-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: { fr: "", en: "", ar: "" },
    description: { fr: "", en: "", ar: "" },
    items: [],
  };
}

export function normalizeGalleryFolders(value: unknown, legacyItems: GalleryItem[] = []): GalleryFolder[] {
  if (Array.isArray(value) && value.length > 0) {
    const folders = value
      .map((raw): GalleryFolder | null => {
        if (!raw || typeof raw !== "object") return null;
        const f = raw as Partial<GalleryFolder>;
        const items = Array.isArray(f.items)
          ? f.items.map(normalizeFolderItem).filter((v): v is GalleryFolderItem => v !== null)
          : [];
        return {
          id: typeof f.id === "string" && f.id.trim() ? f.id.trim() : createEmptyGalleryFolder().id,
          title: normalizeGalleryTitle(f.title, { fr: "", en: "", ar: "" }),
          description: normalizeGalleryTitle(f.description, { fr: "", en: "", ar: "" }),
          items,
        };
      })
      .filter((v): v is GalleryFolder => v !== null);
    if (folders.length > 0) return folders;
  }

  if (legacyItems.length === 0) return [];
  return [
    {
      id: "legacy-default",
      title: { fr: "", en: "", ar: "" },
      description: { fr: "", en: "", ar: "" },
      items: legacyItems.map((item, index) => ({
        ...item,
        inCarousel: true,
        isCover: index === 0,
      })),
    },
  ];
}

export function flattenFolderItems(folders: GalleryFolder[]): GalleryFolderItem[] {
  return folders.flatMap((folder) => folder.items);
}

export function getFolderCoverUrl(folder: GalleryFolder): string {
  const cover = folder.items.find((item) => item.isCover);
  return cover?.url ?? folder.items[0]?.url ?? "";
}

export function getGalleryCarouselItems(data: GalleryData): GalleryFolderItem[] {
  if (data.folders && data.folders.length > 0) {
    return flattenFolderItems(data.folders).filter((item) => item.inCarousel);
  }
  return data.items.map((item) => ({ ...item, inCarousel: true }));
}

export function foldersToFlatItems(folders: GalleryFolder[]): GalleryItem[] {
  return flattenFolderItems(folders).map(({ url, link, photoTitle }) => ({
    url,
    link,
    ...(photoTitle ? { photoTitle } : {}),
  }));
}

export function parseGalleryData(value: string | null | undefined, category: GalleryCategory): GalleryData {
  const defaults = GALLERY_CONFIG[category].title;
  if (!value) {
    const items = defaultGalleryItems(category);
    return isFolderGalleryCategory(category)
      ? { title: defaults, items, folders: normalizeGalleryFolders([], items) }
      : { title: defaults, items };
  }
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      const items = normalizeGalleryItems(parsed);
      const resolved = items.length > 0 ? items : defaultGalleryItems(category);
      return isFolderGalleryCategory(category)
        ? { title: defaults, items: resolved, folders: normalizeGalleryFolders([], resolved) }
        : { title: defaults, items: resolved };
    }
    const title = {
      fr: typeof parsed.title?.fr === "string" ? parsed.title.fr : defaults.fr,
      en: typeof parsed.title?.en === "string" ? parsed.title.en : defaults.en,
      ar: typeof parsed.title?.ar === "string" ? parsed.title.ar : defaults.ar,
    };
    const legacyItems = normalizeGalleryItems(parsed.items ?? parsed.images);
    const items = legacyItems.length > 0 ? legacyItems : defaultGalleryItems(category);

    if (isFolderGalleryCategory(category)) {
      const folders = normalizeGalleryFolders(parsed.folders, items);
      return {
        title,
        items: foldersToFlatItems(folders),
        folders,
      };
    }

    return { title, items: items.length > 0 ? items : defaultGalleryItems(category) };
  } catch {
    const items = defaultGalleryItems(category);
    return isFolderGalleryCategory(category)
      ? { title: defaults, items, folders: normalizeGalleryFolders([], items) }
      : { title: defaults, items };
  }
}
