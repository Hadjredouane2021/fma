import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getHomeContent } from "@/lib/site-content";
import { prisma } from "@/lib/prisma";
import { getChiffresClesContent } from "@/lib/chiffres-cles-cache";
import FolderGalleryForm from "@/app/admin/publications/_components/FolderGalleryForm";
import { dbKeyForGallery, isFolderGalleryCategory, parseGalleryData } from "@/lib/galleries";
import HomeContentForm from "./_components/HomeContentForm";

export const metadata = {
  title: "Page d'accueil — Admin FMA",
  description: "Édition du contenu du hero affiché sur la page d'accueil du site.",
};

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const [content, interventionsFmaRow, reseauxSociauxRow, chiffresCles] = await Promise.all([
    getHomeContent(),
    prisma.setting.findUnique({ where: { key: dbKeyForGallery("interventions-fma") } }).catch(() => null),
    prisma.setting.findUnique({ where: { key: dbKeyForGallery("reseaux-sociaux") } }).catch(() => null),
    getChiffresClesContent(),
  ]);

  const interventionsFma = parseGalleryData(interventionsFmaRow?.value, "interventions-fma");
  const reseauxSociaux = parseGalleryData(reseauxSociauxRow?.value, "reseaux-sociaux");

  return (
    <>
      <AdminPageHeader
        title="Page d'accueil"
        subtitle="Hero du site : badge, titre, sous-titre, boutons d'appel à l'action et chiffres clés."
      />
      <main className="p-8">
        <HomeContentForm
          initial={content}
          chiffresClesRows={chiffresCles.rows.map((r) => ({
            id: r.id,
            label: r.category.fr || r.id,
          }))}
        />
        <FolderGalleryForm
          category="interventions-fma"
          label="Carrousel — Interventions FMA (page d'accueil)"
          uploadFolder="gallery-interventions-fma"
          initialTitle={interventionsFma.title}
          initialFolders={interventionsFma.folders ?? []}
        />
        <FolderGalleryForm
          category="reseaux-sociaux"
          label="Carrousel — Réseaux sociaux (page d'accueil)"
          uploadFolder="gallery-reseaux-sociaux"
          initialTitle={reseauxSociaux.title}
          initialFolders={reseauxSociaux.folders ?? []}
        />
      </main>
    </>
  );
}
