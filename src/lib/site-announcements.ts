import { prisma } from "@/lib/prisma";
import type { AnnouncementPost } from "@/lib/posts-cache";
import type { AnnouncementPublication } from "@/lib/publications-cache";

const postSelect = {
  id: true,
  slug: true,
  updatedAt: true,
  titleFr: true,
  titleEn: true,
  titleAr: true,
  excerptFr: true,
  excerptEn: true,
  excerptAr: true,
  featuredImage: true,
} as const;

const publicationSelect = {
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
  pdfFile: true,
  readMoreUrl: true,
} as const;

export async function fetchSiteAnnouncements(): Promise<{
  news: AnnouncementPost | null;
  publication: AnnouncementPublication | null;
}> {
  const [news, publication] = await Promise.all([
    prisma.post.findFirst({
      where: { status: "PUBLISHED", deletedAt: null, announcePopup: true },
      select: postSelect,
      orderBy: { publishedAt: "desc" },
    }),
    prisma.publication.findFirst({
      where: { status: "PUBLISHED", deletedAt: null, announcePopup: true },
      select: publicationSelect,
      orderBy: { publishedAt: "desc" },
    }),
  ]);

  return { news, publication };
}
