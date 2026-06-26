import { unstable_cache, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { DB_KEYS } from "@/lib/db-keys";
import { CACHE_TAGS } from "@/lib/site-settings-cache";
import {
  DEFAULT_PARTICULIERS_CONTENT,
  normalizeParticuliersContent,
  PARTICULIERS_KEY,
  type ParticuliersContent,
} from "@/lib/particuliers-site-public";

export type ParticuliersPageData = {
  content: ParticuliersContent;
  heroImage: string | null;
};

export const getParticuliersPageData = unstable_cache(
  async (): Promise<ParticuliersPageData> => {
    try {
      const [contentRow, heroRow] = await Promise.all([
        prisma.setting.findUnique({ where: { key: PARTICULIERS_KEY } }),
        prisma.setting.findUnique({ where: { key: DB_KEYS.PARTICULIERS_HERO } }),
      ]);
      let content = DEFAULT_PARTICULIERS_CONTENT;
      if (contentRow) {
        try {
          content = normalizeParticuliersContent(JSON.parse(contentRow.value));
        } catch {
          content = DEFAULT_PARTICULIERS_CONTENT;
        }
      }
      return {
        content,
        heroImage: heroRow?.value?.trim() || null,
      };
    } catch (error) {
      console.error("[particuliers-cache] getParticuliersPageData failed:", error);
      return { content: DEFAULT_PARTICULIERS_CONTENT, heroImage: null };
    }
  },
  ["site-particuliers-page:v1"],
  { tags: [CACHE_TAGS.particuliers], revalidate: 300 }
);

export function revalidateParticuliersContent() {
  revalidateTag(CACHE_TAGS.particuliers);
}
