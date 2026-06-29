import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DB_KEYS } from "@/lib/db-keys";
import {
  DEFAULT_SECTION_BACKGROUNDS,
  normalizeSectionBackgrounds,
} from "@/lib/section-backgrounds";
import SectionBackgroundsForm from "./_components/SectionBackgroundsForm";

export const metadata = {
  title: "Fonds de sections — Admin FMA",
  description: "Images décoratives des sections du site (header, accueil, pages…).",
};

export const dynamic = "force-dynamic";

export default async function AdminSectionBackgroundsPage() {
  const row = await prisma.setting
    .findUnique({ where: { key: DB_KEYS.SECTION_BACKGROUNDS } })
    .catch(() => null);

  let initial = DEFAULT_SECTION_BACKGROUNDS;
  if (row?.value) {
    try {
      initial = normalizeSectionBackgrounds(JSON.parse(row.value));
    } catch {
      /* garde les défauts */
    }
  }

  return (
    <>
      <AdminPageHeader
        title="Fonds de sections"
        subtitle="Motifs décoratifs 3D pour le header, Contact, chiffres clés, carrousels, dernières actualités et newsletter."
      />
      <main className="p-8 max-w-4xl">
        <SectionBackgroundsForm initial={initial} />
      </main>
    </>
  );
}
