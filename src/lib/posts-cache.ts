import { unstable_cache, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { CACHE_TAGS } from "@/lib/site-settings-cache";

export const getLatestPublishedPosts = unstable_cache(
  async () => {
    try {
      return await prisma.post.findMany({
        where: { status: "PUBLISHED", deletedAt: null },
        include: { category: true },
        orderBy: { publishedAt: "desc" },
        take: 5,
      });
    } catch (error) {
      console.error("[posts-cache] getLatestPublishedPosts failed:", error);
      return [];
    }
  },
  ["posts:latest-published:5:v1"],
  { tags: [CACHE_TAGS.postsLatest], revalidate: 120 }
);

export function revalidateLatestPosts() {
  revalidateTag(CACHE_TAGS.postsLatest);
}

export type AnnouncementPost = {
  id: string;
  slug: string;
  updatedAt: Date;
  titleFr: string;
  titleEn: string | null;
  titleAr: string | null;
  excerptFr: string | null;
  excerptEn: string | null;
  excerptAr: string | null;
  featuredImage: string | null;
};

export const getAnnouncementPost = unstable_cache(
  async (): Promise<AnnouncementPost | null> => {
    try {
      return await prisma.post.findFirst({
        where: { status: "PUBLISHED", deletedAt: null, announcePopup: true },
        select: {
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
        },
        orderBy: { publishedAt: "desc" },
      });
    } catch (error) {
      console.error("[posts-cache] getAnnouncementPost failed:", error);
      return null;
    }
  },
  ["posts:announcement-popup:v1"],
  { tags: [CACHE_TAGS.postsLatest], revalidate: 120 }
);
