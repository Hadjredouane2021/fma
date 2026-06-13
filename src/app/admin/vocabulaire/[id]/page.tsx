import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { prisma } from "@/lib/prisma";
import GlossaryTermForm from "../_components/GlossaryTermForm";

export default async function EditerTermeVocabulairePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const term = await prisma.glossaryTerm.findUnique({ where: { id } }).catch(() => null);
  if (!term) notFound();

  return (
    <>
      <AdminPageHeader title="Modifier le terme" subtitle={term.termFr} />
      <main className="p-8">
        <GlossaryTermForm initial={term} />
      </main>
    </>
  );
}
