import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { prisma } from "@/lib/prisma";
import { getMemberCategoryConfig } from "@/lib/member-categories";
import MemberForm from "../_components/MemberForm";

export default async function NouveauMembreFmaPage() {
  const [agg, categoryConfig] = await Promise.all([
    prisma.member.aggregate({ _max: { order: true } }).catch(() => ({ _max: { order: null as number | null } })),
    getMemberCategoryConfig(),
  ]);
  const defaultOrder = (agg._max.order ?? 0) + 1;

  return (
    <>
      <AdminPageHeader title="Nouveau membre FMA" subtitle="Société adhérente — logo affiché sur La FMA" />
      <main className="p-8">
        <MemberForm defaultOrder={defaultOrder} categoryConfig={categoryConfig} />
      </main>
    </>
  );
}
