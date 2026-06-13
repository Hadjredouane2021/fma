import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { prisma } from "@/lib/prisma";
import ConventionForm from "../_components/ConventionForm";

export default async function NouvelleConventionPage() {
  const agg = await prisma.convention.aggregate({ _max: { order: true } }).catch(() => ({ _max: { order: null as number | null } }));
  const defaultOrder = (agg._max.order ?? 0) + 1;

  return (
    <>
      <AdminPageHeader title="Nouvelle convention" subtitle="Slug unique, PDF optionnel, statut brouillon ou publié" />
      <main className="p-8">
        <ConventionForm defaultOrder={defaultOrder} />
      </main>
    </>
  );
}
