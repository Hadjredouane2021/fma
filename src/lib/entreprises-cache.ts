import { unstable_cache, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { DB_KEYS } from "@/lib/db-keys";
import { CACHE_TAGS } from "@/lib/site-settings-cache";
import {
  DEFAULT_ENTREPRISES_CONTENT,
  ENTREPRISES_KEY,
  normalizeEntreprisesContent,
  type EntreprisesContent,
} from "@/lib/entreprises-site-public";
import {
  parseEntreprisesHeroImageUrlsFromSetting,
  type EntreprisesHeroImageUrls,
} from "@/lib/entreprises-hero-image";

export type EntreprisesPageData = {
  content: EntreprisesContent;
  heroImages: EntreprisesHeroImageUrls;
};

export const getEntreprisesPageData = unstable_cache(
  async (): Promise<EntreprisesPageData> => {
    try {
      const [contentRow, heroRow] = await Promise.all([
        prisma.setting.findUnique({ where: { key: ENTREPRISES_KEY } }),
        prisma.setting.findUnique({ where: { key: DB_KEYS.ENTREPRISES_HERO } }),
      ]);
      let content = DEFAULT_ENTREPRISES_CONTENT;
      if (contentRow) {
        try {
          content = normalizeEntreprisesContent(JSON.parse(contentRow.value));
        } catch {
          content = DEFAULT_ENTREPRISES_CONTENT;
        }
      }
      return {
        content,
        heroImages: parseEntreprisesHeroImageUrlsFromSetting(heroRow?.value),
      };
    } catch (error) {
      console.error("[entreprises-cache] getEntreprisesPageData failed:", error);
      return {
        content: DEFAULT_ENTREPRISES_CONTENT,
        heroImages: { fr: "", en: "", ar: "" },
      };
    }
  },
  ["site-entreprises-page:v2"],
  { tags: [CACHE_TAGS.entreprises], revalidate: 300 }
);

export function revalidateEntreprisesContent() {
  revalidateTag(CACHE_TAGS.entreprises);
}
