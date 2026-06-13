import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getHomeContent } from "@/lib/site-content";
import { prisma } from "@/lib/prisma";
import { getChiffresClesContent } from "@/lib/chiffres-cles-site-public";
import GalleryAdminForm from "@/app/admin/publications/_components/GalleryAdminForm";
import { dbKeyForGallery, parseGalleryData } from "@/lib/galleries";
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
        <GalleryAdminForm
          category="interventions-fma"
          uploadFolder="gallery-interventions-fma"
          label="Carrousel — Interventions FMA (page d'accueil)"
          initial={interventionsFma.items}
          initialTitle={interventionsFma.title}
        />
        <GalleryAdminForm
          category="reseaux-sociaux"
          uploadFolder="gallery-reseaux-sociaux"
          label="Carrousel — Réseaux sociaux (page d'accueil)"
          initial={reseauxSociaux.items}
          initialTitle={reseauxSociaux.title}
        />
      </main>
    </>
  );
}
