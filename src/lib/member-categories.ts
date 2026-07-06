import { prisma } from "@/lib/prisma";
import { getLaFmaContent } from "@/lib/site-content";
import { DEFAULT_LA_FMA_CONTENT } from "@/lib/la-fma-site-public";
import {
  resolveMemberCategorySlug,
  type MemberCategoryConfig,
} from "@/lib/member-categories-shared";

export { resolveMemberCategorySlug, type MemberCategoryConfig } from "@/lib/member-categories-shared";

export async function getMemberCategoryConfig(): Promise<MemberCategoryConfig> {
  const [content, members] = await Promise.all([
    getLaFmaContent().catch(() => null),
    prisma.member.findMany({ select: { category: true } }).catch(() => []),
  ]);

  const categories = content?.memberCategories ?? DEFAULT_LA_FMA_CONTENT.memberCategories;
  const otherLabel = content?.memberCategoryOtherLabel ?? DEFAULT_LA_FMA_CONTENT.memberCategoryOtherLabel;
  const knownSlugs = new Set(categories.map((c) => c.slug));
  const fromMembers = members.map((m) => m.category?.trim()).filter(Boolean) as string[];
  const extraSlugs = [
    ...new Set(
      fromMembers
        .map((raw) => resolveMemberCategorySlug(raw, categories))
        .filter((slug) => slug && !knownSlugs.has(slug))
    ),
  ];

  return { categories, otherLabel, extraSlugs };
}

export async function getMemberCategorySlugs(): Promise<string[]> {
  const { categories, extraSlugs } = await getMemberCategoryConfig();
  return [...categories.map((c) => c.slug), ...extraSlugs];
}
