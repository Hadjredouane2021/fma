import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { prisma } from "@/lib/prisma";
import ConventionForm from "../_components/ConventionForm";

export default async function EditerConventionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const convention = await prisma.convention.findUnique({ where: { id } }).catch(() => null);
  if (!convention) notFound();

  return (
    <>
      <AdminPageHeader title="Modifier la convention" subtitle={convention.titleFr} />
      <main className="p-8">
        <ConventionForm initial={convention} />
      </main>
    </>
  );
}
