import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { prisma } from "@/lib/prisma";
import UsefulLinkForm from "../_components/UsefulLinkForm";

export default async function EditerLienUtilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const link = await prisma.usefulLink.findUnique({ where: { id } }).catch(() => null);
  if (!link) notFound();

  return (
    <>
      <AdminPageHeader title="Modifier le lien" subtitle={link.titleFr} />
      <main className="p-8">
        <UsefulLinkForm initial={link} />
      </main>
    </>
  );
}
