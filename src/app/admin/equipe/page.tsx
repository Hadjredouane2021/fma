import { prisma } from "@/lib/prisma";
import { getLaFmaContent } from "@/lib/site-content";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { EquipeAdminTable } from "./_components/EquipeAdminTable";
import { EquipeSectionTitleForm } from "./_components/EquipeSectionTitleForm";

export default async function AdminEquipePage() {
  const [team, laFmaContent] = await Promise.all([
    prisma.teamMember.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] }).catch(() => []),
    getLaFmaContent().catch(() => null),
  ]);
  const sectionTitle = laFmaContent?.directionSectionTitle ?? {
    fr: "L'Équipe Opérationnelle",
    en: "The Operational Team",
    ar: "الفريق التشغيلي",
  };

  return (
    <>
      <AdminPageHeader
        title="Équipe"
        subtitle={`${team.length} membre${team.length !== 1 ? "s" : ""} — champs affichés sur /la-fma selon le service : comité directeur (nom + photo), équipe opérationnelle (nom + fonction). Membres actifs uniquement.`}
        action={{ label: "Ajouter un membre", href: "/admin/equipe/nouveau" }}
      />

      <main className="p-8">
        <EquipeSectionTitleForm initial={sectionTitle} />
        <EquipeAdminTable team={team} />
      </main>
    </>
  );
}
