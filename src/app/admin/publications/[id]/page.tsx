import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import PublicationForm from "../_components/PublicationForm";

export default async function EditPublicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const publication = await prisma.publication.findUnique({ where: { id } }).catch(() => null);
  if (!publication) notFound();

  return (
    <>
      <AdminPageHeader title="Modifier la publication" subtitle={publication.titleFr} />
      <main className="p-8 max-w-3xl">
        <PublicationForm initialData={publication as any} />
      </main>
    </>
  );
}
