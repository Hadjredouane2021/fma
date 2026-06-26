import { unstable_cache, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { CACHE_TAGS } from "@/lib/site-settings-cache";
import {
  CHIFFRES_CLES_KEY,
  DEFAULT_CHIFFRES_CLES_CONTENT,
  normalizeChiffresClesContent,
  type ChiffresClesContent,
} from "@/lib/chiffres-cles-site-public";

export const getChiffresClesContent = unstable_cache(
  async (): Promise<ChiffresClesContent> => {
    const row = await prisma.setting.findUnique({ where: { key: CHIFFRES_CLES_KEY } }).catch(() => null);
    if (!row) return DEFAULT_CHIFFRES_CLES_CONTENT;
    try {
      return normalizeChiffresClesContent(JSON.parse(row.value));
    } catch {
      return DEFAULT_CHIFFRES_CLES_CONTENT;
    }
  },
  ["site-chiffres-cles:v1"],
  { tags: [CACHE_TAGS.chiffresCles], revalidate: 300 }
);

export function revalidateChiffresClesContent() {
  revalidateTag(CACHE_TAGS.chiffresCles);
}
