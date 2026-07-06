import { unstable_cache, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { CACHE_TAGS } from "@/lib/site-settings-cache";

export type AnnouncementPublication = {
  id: string;
  slug: string;
  updatedAt: Date;
  titleFr: string;
  titleEn: string | null;
  titleAr: string | null;
  descriptionFr: string | null;
  descriptionEn: string | null;
  descriptionAr: string | null;
  coverImage: string | null;
  pdfFileFr: string | null;
  pdfFileEn: string | null;
  pdfFileAr: string | null;
  readMoreUrlFr: string | null;
  readMoreUrlEn: string | null;
  readMoreUrlAr: string | null;
};

const announcementSelect = {
  id: true,
  slug: true,
  updatedAt: true,
  titleFr: true,
  titleEn: true,
  titleAr: true,
  descriptionFr: true,
  descriptionEn: true,
  descriptionAr: true,
  coverImage: true,
  pdfFileFr: true,
  pdfFileEn: true,
  pdfFileAr: true,
  readMoreUrlFr: true,
  readMoreUrlEn: true,
  readMoreUrlAr: true,
} as const;

export const getAnnouncementPublication = unstable_cache(
  async (): Promise<AnnouncementPublication | null> => {
    try {
      return await prisma.publication.findFirst({
        where: { status: "PUBLISHED", deletedAt: null, announcePopup: true },
        select: announcementSelect,
        orderBy: { publishedAt: "desc" },
      });
    } catch (error) {
      console.error("[publications-cache] getAnnouncementPublication failed:", error);
      return null;
    }
  },
  ["publications:announcement-popup:v2"],
  { tags: [CACHE_TAGS.publicationsAnnouncement], revalidate: 120 }
);

export function revalidatePublicationAnnouncements() {
  revalidateTag(CACHE_TAGS.publicationsAnnouncement);
}
