import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import PostForm from "../_components/PostForm";
import { prisma } from "@/lib/prisma";

export default async function NouvelleActualitePage() {
  const categories = await prisma.category.findMany({ orderBy: { order: "asc" } }).catch(() => []);
  return (
    <>
      <AdminPageHeader title="Nouvelle actualité" subtitle="Créer un article multilingue" />
      <main className="p-8 max-w-4xl">
        <PostForm categories={categories} />
      </main>
    </>
  );
}
