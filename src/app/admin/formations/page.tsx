import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DB_KEYS } from "@/lib/db-keys";
import {
  DEFAULT_FORMATIONS_CONTENT,
  FORMATIONS_KEY,
  normalizeFormationsContent,
  prismaFormationToItem,
  type FormationsContent,
} from "@/lib/formations-site-public";
import FormationsForm from "./_components/FormationsForm";
import FormationsHeroImageForm from "./_components/FormationsHeroImageForm";

async function getContent(): Promise<FormationsContent> {
  const row = await prisma.setting.findUnique({ where: { key: FORMATIONS_KEY } }).catch(() => null);
  if (row) {
    try {
      return normalizeFormationsContent(JSON.parse(row.value));
    } catch {
      return DEFAULT_FORMATIONS_CONTENT;
    }
  }

  const legacy = await prisma.formation
    .findMany({ orderBy: [{ startDate: "desc" }, { titleFr: "asc" }] })
    .catch(() => []);
  if (legacy.length > 0) {
    return normalizeFormationsContent({
      ...DEFAULT_FORMATIONS_CONTENT,
      formations: legacy.map(prismaFormationToItem),
    });
  }

  return DEFAULT_FORMATIONS_CONTENT;
}

export default async function AdminFormationsPage() {
  const [content, heroRow] = await Promise.all([
    getContent(),
    prisma.setting.findUnique({ where: { key: DB_KEYS.FORMATIONS_HERO } }).catch(() => null),
  ]);
  const heroImage = heroRow?.value ?? "";

  return (
    <>
      <AdminPageHeader
        title="Page Formations"
        subtitle="Gérez le contenu de la page Formations : hero, fiches, FAQ et bloc CTA."
      />
      <main className="p-8">
        <FormationsHeroImageForm initial={heroImage} />
        <FormationsForm initial={content} />
      </main>
    </>
  );
}
