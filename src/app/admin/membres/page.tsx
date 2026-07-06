import { prisma } from "@/lib/prisma";
import { getLaFmaContent } from "@/lib/site-content";
import {
  DEFAULT_LA_FMA_CONTENT,
  type LaFmaMemberCategory,
  type LocalizedString,
} from "@/lib/la-fma-site-public";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { MembresAdminTable } from "./_components/MembresAdminTable";
import { MembresCategoriesForm } from "./_components/MembresCategoriesForm";
import { MembresSectionTitleForm } from "./_components/MembresSectionTitleForm";
export default async function AdminMembresPage() {
  const [members, laFmaContent] = await Promise.all([
    prisma.member.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] }).catch(() => []),
    getLaFmaContent().catch(() => null),
  ]);
  const sectionTitle = laFmaContent?.membersSectionTitle ?? DEFAULT_LA_FMA_CONTENT.membersSectionTitle;
  const memberCategories: LaFmaMemberCategory[] =
    laFmaContent?.memberCategories?.length
      ? laFmaContent.memberCategories
      : DEFAULT_LA_FMA_CONTENT.memberCategories;
  const memberCategoryOtherLabel: LocalizedString =
    laFmaContent?.memberCategoryOtherLabel ?? DEFAULT_LA_FMA_CONTENT.memberCategoryOtherLabel;

  return (
    <>
      <AdminPageHeader
        title="Membres FMA"
        subtitle={`${members.length} société${members.length !== 1 ? "s" : ""} — logos sur La FMA (membres actifs, tri par ordre). Noms et catégories multilingues (FR, EN, AR).`}
        action={{ label: "Ajouter un membre", href: "/admin/membres/nouveau" }}
      />

      <main className="p-8">
        <MembresSectionTitleForm initial={sectionTitle} />
        <MembresCategoriesForm
          initialCategories={memberCategories}
          initialOtherLabel={memberCategoryOtherLabel}
        />
        <MembresAdminTable
          members={members}
          memberCategories={memberCategories}
          memberCategoryOtherLabel={memberCategoryOtherLabel}
        />
      </main>
    </>
  );
}
