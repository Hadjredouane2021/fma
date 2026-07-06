import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { prisma } from "@/lib/prisma";
import { getMemberCategoryConfig } from "@/lib/member-categories";
import MemberForm from "../_components/MemberForm";

export default async function EditerMembreFmaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [member, categoryConfig] = await Promise.all([
    prisma.member.findUnique({ where: { id } }).catch(() => null),
    getMemberCategoryConfig(),
  ]);
  if (!member) notFound();

  return (
    <>
      <AdminPageHeader title="Modifier le membre FMA" subtitle={member.nameFr} />
      <main className="p-8">
        <MemberForm initial={member} categoryConfig={categoryConfig} />
      </main>
    </>
  );
}
