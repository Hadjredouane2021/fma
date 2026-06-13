import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import FormationForm from "../_components/FormationForm";

export default async function EditFormationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const formation = await prisma.formation.findUnique({ where: { id } }).catch(() => null);
  if (!formation) notFound();

  return (
    <>
      <AdminPageHeader title="Modifier la formation" subtitle={formation.titleFr} />
      <main className="p-8">
        <FormationForm initial={formation} />
      </main>
    </>
  );
}
