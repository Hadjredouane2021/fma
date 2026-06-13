import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { prisma } from "@/lib/prisma";
import GlossaryTermForm from "../_components/GlossaryTermForm";

export default async function NouveauTermeVocabulairePage() {
  const agg = await prisma.glossaryTerm.aggregate({ _max: { order: true } }).catch(() => ({ _max: { order: null as number | null } }));
  const defaultOrder = (agg._max.order ?? 0) + 1;

  return (
    <>
      <AdminPageHeader title="Nouveau terme" subtitle="Glossaire — multilingue (FR obligatoire)" />
      <main className="p-8">
        <GlossaryTermForm defaultOrder={defaultOrder} />
      </main>
    </>
  );
}
