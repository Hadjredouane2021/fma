import { unstable_cache, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  dbKeyForGallery,
  parseGalleryData,
  type GalleryCategory,
  type GalleryData,
} from "@/lib/galleries";

const HOME_GALLERY_CATEGORIES = ["interventions-fma", "reseaux-sociaux"] as const;

export type HomePageGalleries = {
  interventionsFma: GalleryData;
  reseauxSociaux: GalleryData;
};

function galleryTag(category: GalleryCategory) {
  return `site:gallery:${category}`;
}

export const getHomePageGalleries = unstable_cache(
  async (): Promise<HomePageGalleries> => {
    const keys = HOME_GALLERY_CATEGORIES.map(dbKeyForGallery);
    try {
      const rows = await prisma.setting.findMany({
        where: { key: { in: keys } },
        select: { key: true, value: true },
      });
      const map = new Map(rows.map((row) => [row.key, row.value]));
      return {
        interventionsFma: parseGalleryData(
          map.get(dbKeyForGallery("interventions-fma")),
          "interventions-fma"
        ),
        reseauxSociaux: parseGalleryData(
          map.get(dbKeyForGallery("reseaux-sociaux")),
          "reseaux-sociaux"
        ),
      };
    } catch (error) {
      console.error("[galleries-cache] getHomePageGalleries failed:", error);
      return {
        interventionsFma: parseGalleryData(null, "interventions-fma"),
        reseauxSociaux: parseGalleryData(null, "reseaux-sociaux"),
      };
    }
  },
  ["home-page-galleries:v4"],
  {
    tags: HOME_GALLERY_CATEGORIES.map((category) => galleryTag(category)),
    revalidate: 300,
  }
);

export function getGalleryContent(category: GalleryCategory) {
  return unstable_cache(
    async (): Promise<GalleryData> => {
      try {
        const row = await prisma.setting
          .findUnique({ where: { key: dbKeyForGallery(category) } })
          .catch(() => null);
        return parseGalleryData(row?.value, category);
      } catch (error) {
        console.error(`[galleries-cache] getGalleryContent(${category}) failed:`, error);
        return parseGalleryData(null, category);
      }
    },
    [`gallery-content:${category}:v1`],
    { tags: [galleryTag(category)], revalidate: 300 }
  )();
}

export function revalidateGalleryContent(category: GalleryCategory) {
  revalidateTag(galleryTag(category));
}
