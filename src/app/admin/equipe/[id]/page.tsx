import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { prisma } from "@/lib/prisma";
import TeamMemberForm from "../_components/TeamMemberForm";

export default async function EditerMembreEquipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const member = await prisma.teamMember.findUnique({ where: { id } }).catch(() => null);
  if (!member) notFound();

  return (
    <>
      <AdminPageHeader title="Modifier le membre" subtitle={member.nameFr} />
      <main className="p-8">
        <TeamMemberForm initial={member} />
      </main>
    </>
  );
}
