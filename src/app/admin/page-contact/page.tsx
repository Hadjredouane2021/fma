import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DB_KEYS } from "@/lib/db-keys";
import { getContactContent } from "@/lib/contact-site-public";
import { parseContactHeroImageUrlsFromSetting } from "@/lib/contact-hero-image";
import ContactContentForm from "./_components/ContactContentForm";
import ContactHeroImageForm from "./_components/ContactHeroImageForm";

export const metadata = {
  title: "Page Contact — Admin FMA",
  description: "Édition des textes et coordonnées de la page contact publique.",
};

export const dynamic = "force-dynamic";

export default async function AdminContactPageContent() {
  const [content, heroRow] = await Promise.all([
    getContactContent(),
    prisma.setting.findUnique({ where: { key: DB_KEYS.CONTACT_HERO } }).catch(() => null),
  ]);
  const heroImages = parseContactHeroImageUrlsFromSetting(heroRow?.value);

  return (
    <>
      <AdminPageHeader
        title="Page Contact"
        subtitle="Image hero, textes, coordonnées, horaires et carte affichés sur /fr/contact (et équivalents EN/AR). Les messages reçus se gèrent dans Messages."
      />
      <main className="p-8">
        <ContactHeroImageForm initial={heroImages} />
        <ContactContentForm initial={content} />
      </main>
    </>
  );
}
