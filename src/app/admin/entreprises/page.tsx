import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DB_KEYS } from "@/lib/db-keys";
import {
  DEFAULT_ENTREPRISES_CONTENT,
  ENTREPRISES_KEY,
  normalizeEntreprisesContent,
  type EntreprisesContent,
} from "@/lib/entreprises-site-public";
import EntreprisesForm from "./_components/EntreprisesForm";
import EntreprisesHeroImageForm from "./_components/EntreprisesHeroImageForm";

async function getContent(): Promise<EntreprisesContent> {
  const row = await prisma.setting.findUnique({ where: { key: ENTREPRISES_KEY } }).catch(() => null);
  if (!row) return DEFAULT_ENTREPRISES_CONTENT;
  try {
    return normalizeEntreprisesContent(JSON.parse(row.value));
  } catch {
    return DEFAULT_ENTREPRISES_CONTENT;
  }
}

export default async function AdminEntreprisesPage() {
  const [content, heroRow] = await Promise.all([
    getContent(),
    prisma.setting.findUnique({ where: { key: DB_KEYS.ENTREPRISES_HERO } }).catch(() => null),
  ]);
  const heroImage = heroRow?.value ?? "";

  return (
    <>
      <AdminPageHeader
        title="Page Entreprises & Professionnels"
        subtitle="Gérez le contenu de la page Entreprises : hero, produits, FAQ et bloc CTA."
      />
      <main className="p-8">
        <EntreprisesHeroImageForm initial={heroImage} />
        <EntreprisesForm initial={content} />
      </main>
    </>
  );
}
