import { unstable_cache, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { DB_KEYS } from "@/lib/db-keys";
import {
  laFmaStatsImageUrl,
  parseLaFmaStatsImagesFromSetting,
  type LaFmaStatsImages,
} from "@/lib/la-fma-stats-image";
import type { Member, TeamMember } from "@/types";

export const LA_FMA_PAGE_TAG = "site:la-fma-page";

export type LaFmaPageData = {
  members: Member[];
  direction: TeamMember[];
  comiteDirecteur: TeamMember[];
  statsImages: LaFmaStatsImages;
};

export const getLaFmaPageData = unstable_cache(
  async (): Promise<LaFmaPageData> => {
    try {
      const [members, direction, comiteDirecteur, statsImageRow] = await Promise.all([
        prisma.member
          .findMany({ where: { active: true }, orderBy: { order: "asc" } })
          .catch(() => [] as Member[]),
        prisma.teamMember
          .findMany({
            where: { active: true, department: "direction" },
            orderBy: { order: "asc" },
          })
          .catch(() => [] as TeamMember[]),
        prisma.teamMember
          .findMany({
            where: { active: true, department: "comite_directeur" },
            orderBy: [{ order: "asc" }, { nameFr: "asc" }],
          })
          .catch(() => [] as TeamMember[]),
        prisma.setting
          .findUnique({ where: { key: DB_KEYS.LA_FMA_STATS_IMAGE } })
          .catch(() => null),
      ]);

      const statsImages = parseLaFmaStatsImagesFromSetting(statsImageRow?.value);

      return {
        members,
        direction,
        comiteDirecteur,
        statsImages,
      };
    } catch (error) {
      console.error("[la-fma-page-cache] getLaFmaPageData failed:", error);
      return {
        members: [],
        direction: [],
        comiteDirecteur: [],
        statsImages: { fr: "", en: "", ar: "" },
      };
    }
  },
  ["la-fma-page-data:v2"],
  { tags: [LA_FMA_PAGE_TAG], revalidate: 300 }
);

export { laFmaStatsImageUrl };

export function revalidateLaFmaPageData() {
  revalidateTag(LA_FMA_PAGE_TAG);
}
