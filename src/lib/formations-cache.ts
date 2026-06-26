import { unstable_cache, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { DB_KEYS } from "@/lib/db-keys";
import { CACHE_TAGS } from "@/lib/site-settings-cache";
import {
  DEFAULT_FORMATIONS_CONTENT,
  FORMATIONS_KEY,
  normalizeFormationsContent,
  prismaFormationToItem,
  type FormationsContent,
} from "@/lib/formations-site-public";

export type FormationsPageData = {
  content: FormationsContent;
  heroImage: string | null;
};

export const getFormationsPageData = unstable_cache(
  async (): Promise<FormationsPageData> => {
    try {
      const [contentRow, heroRow] = await Promise.all([
        prisma.setting.findUnique({ where: { key: FORMATIONS_KEY } }),
        prisma.setting.findUnique({ where: { key: DB_KEYS.FORMATIONS_HERO } }),
      ]);
      let content = DEFAULT_FORMATIONS_CONTENT;
      if (contentRow) {
        try {
          content = normalizeFormationsContent(JSON.parse(contentRow.value));
        } catch {
          content = DEFAULT_FORMATIONS_CONTENT;
        }
      } else {
        const legacy = await prisma.formation
          .findMany({ where: { status: "PUBLISHED" }, orderBy: [{ startDate: "desc" }] })
          .catch(() => []);
        if (legacy.length > 0) {
          content = normalizeFormationsContent({
            ...DEFAULT_FORMATIONS_CONTENT,
            formations: legacy.map(prismaFormationToItem),
          });
        }
      }
      return {
        content,
        heroImage: heroRow?.value?.trim() || null,
      };
    } catch (error) {
      console.error("[formations-cache] getFormationsPageData failed:", error);
      return { content: DEFAULT_FORMATIONS_CONTENT, heroImage: null };
    }
  },
  ["site-formations-page:v1"],
  { tags: [CACHE_TAGS.formations], revalidate: 300 }
);

export function revalidateFormationsContent() {
  revalidateTag(CACHE_TAGS.formations);
}
