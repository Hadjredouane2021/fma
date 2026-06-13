import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import PostForm from "../_components/PostForm";

export default async function EditActualitePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [post, categories] = await Promise.all([
    prisma.post.findUnique({ where: { id } }).catch(() => null),
    prisma.category.findMany({ orderBy: { order: "asc" } }).catch(() => []),
  ]);

  if (!post) notFound();

  return (
    <>
      <AdminPageHeader
        title="Modifier l'actualité"
        subtitle={post.titleFr}
      />
      <main className="p-8 max-w-4xl">
        <PostForm categories={categories} initialData={post as any} />
      </main>
    </>
  );
}
