import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { prisma } from "@/lib/prisma";
import TeamMemberForm from "../_components/TeamMemberForm";

export default async function NouveauMembreEquipePage() {
  const agg = await prisma.teamMember.aggregate({ _max: { order: true } }).catch(() => ({ _max: { order: null as number | null } }));
  const defaultOrder = (agg._max.order ?? 0) + 1;

  return (
    <>
      <AdminPageHeader title="Nouveau membre" subtitle="Équipe FMA — multilingue" />
      <main className="p-8">
        <TeamMemberForm defaultOrder={defaultOrder} />
      </main>
    </>
  );
}
