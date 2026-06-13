import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DB_KEYS } from "@/lib/db-keys";
import { getChiffresClesContent } from "@/lib/chiffres-cles-site-public";
import ChiffresClesHeroImageForm from "./_components/ChiffresClesHeroImageForm";
import ChiffresClesStructureForm from "./_components/ChiffresClesStructureForm";

export const metadata = {
  title: "Chiffres clés — Admin FMA",
  description: "Édition du tableau Structure du chiffre d'affaires.",
};

export const dynamic = "force-dynamic";

function parseChiffresClesHero(value: string | undefined): string {
  if (!value) return "";
  try {
    const parsed = JSON.parse(value) as Record<string, unknown>;
    return typeof parsed["chiffres-cles"] === "string" ? parsed["chiffres-cles"] : "";
  } catch {
    return "";
  }
}

export default async function AdminChiffresClesPage() {
  const [content, heroRow] = await Promise.all([
    getChiffresClesContent(),
    prisma.setting.findUnique({ where: { key: DB_KEYS.PUBLICATIONS_HERO } }).catch(() => null),
  ]);
  const heroImage = parseChiffresClesHero(heroRow?.value);

  return (
    <>
      <AdminPageHeader
        title="Chiffres clés"
        subtitle="Image hero, structure du chiffre d'affaires et cartes de l'accueil."
      />
      <main className="p-8">
        <ChiffresClesHeroImageForm initial={heroImage} />
        <ChiffresClesStructureForm initial={content} />
      </main>
    </>
  );
}
