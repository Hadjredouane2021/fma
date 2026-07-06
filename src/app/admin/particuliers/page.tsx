import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DB_KEYS } from "@/lib/db-keys";
import {
  DEFAULT_PARTICULIERS_CONTENT,
  normalizeParticuliersContent,
  PARTICULIERS_KEY,
  type ParticuliersContent,
} from "@/lib/particuliers-site-public";
import { parseParticuliersHeroImageUrlsFromSetting } from "@/lib/particuliers-hero-image";
import ParticuliersForm from "./_components/ParticuliersForm";
import ParticuliersHeroImageForm from "./_components/ParticuliersHeroImageForm";

async function getContent(): Promise<ParticuliersContent> {
  const row = await prisma.setting.findUnique({ where: { key: PARTICULIERS_KEY } }).catch(() => null);
  if (!row) return DEFAULT_PARTICULIERS_CONTENT;
  try {
    return normalizeParticuliersContent(JSON.parse(row.value));
  } catch {
    return DEFAULT_PARTICULIERS_CONTENT;
  }
}

export default async function AdminParticuliersPage() {
  const [content, heroRow] = await Promise.all([
    getContent(),
    prisma.setting.findUnique({ where: { key: DB_KEYS.PARTICULIERS_HERO } }).catch(() => null),
  ]);
  const heroImages = parseParticuliersHeroImageUrlsFromSetting(heroRow?.value);

  return (
    <>
      <AdminPageHeader
        title="Page Particuliers"
        subtitle="Gérez le contenu de la page Particuliers : hero, cartes d'assurance et bloc CTA."
      />
      <main className="p-8">
        <ParticuliersHeroImageForm initial={heroImages} />
        <ParticuliersForm initial={content} />
      </main>
    </>
  );
}
