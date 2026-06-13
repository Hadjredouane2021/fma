import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { prisma } from "@/lib/prisma";
import UsefulLinkForm from "../_components/UsefulLinkForm";

export default async function NouveauLienUtilePage() {
  const agg = await prisma.usefulLink.aggregate({ _max: { order: true } }).catch(() => ({ _max: { order: null as number | null } }));
  const defaultOrder = (agg._max.order ?? 0) + 1;

  return (
    <>
      <AdminPageHeader title="Nouveau lien utile" subtitle="Multilingue — URL complète (https://…)" />
      <main className="p-8">
        <UsefulLinkForm defaultOrder={defaultOrder} />
      </main>
    </>
  );
}
