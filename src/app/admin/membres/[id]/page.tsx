import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { prisma } from "@/lib/prisma";
import MemberForm from "../_components/MemberForm";

export default async function EditerMembreFmaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const member = await prisma.member.findUnique({ where: { id } }).catch(() => null);
  if (!member) notFound();

  return (
    <>
      <AdminPageHeader title="Modifier le membre FMA" subtitle={member.nameFr} />
      <main className="p-8">
        <MemberForm initial={member} />
      </main>
    </>
  );
}
