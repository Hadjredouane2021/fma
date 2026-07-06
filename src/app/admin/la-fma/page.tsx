import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getLaFmaContent } from "@/lib/site-content";
import { prisma } from "@/lib/prisma";
import { DB_KEYS } from "@/lib/db-keys";
import { parseLaFmaStatsImagesFromSetting } from "@/lib/la-fma-stats-image";
import LaFmaContentForm from "./_components/LaFmaContentForm";

export const metadata = {
  title: "La FMA — Admin FMA",
  description: "Édition des textes de la page institutionnelle La FMA (hero, présentation, chiffres, missions, titres de sections).",
};

export const dynamic = "force-dynamic";

export default async function AdminLaFmaPage() {
  const [content, statsImageRow] = await Promise.all([
    getLaFmaContent(),
    prisma.setting.findUnique({ where: { key: DB_KEYS.LA_FMA_STATS_IMAGE } }).catch(() => null),
  ]);

  return (
    <>
      <AdminPageHeader
        title="Page La FMA"
        subtitle="Textes affichés sur /fr/la-fma (et équivalents EN/AR). Les photos direction se gèrent dans Équipe ; les logos sociétés membres dans Membres FMA."
      />
      <main className="p-8">
        <LaFmaContentForm
          initial={content}
          statsImagesInitial={parseLaFmaStatsImagesFromSetting(statsImageRow?.value)}
        />
      </main>
    </>
  );
}
