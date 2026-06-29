import { prisma } from "@/lib/prisma";
import { DB_KEYS } from "@/lib/db-keys";
import { PageHero } from "@/components/common/PageHero";
import { PageHeroImage } from "@/components/common/PageHeroImage";
import { SectionBackground } from "@/components/common/SectionBackground";
import { UsefulLinksGrid, usefulLinksPageCopy } from "@/components/common/UsefulLinksGrid";
import { Section } from "@/components/ui/Section";
import type { Locale } from "@/types";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = locale as Locale;
  const copy = usefulLinksPageCopy(l);
  return { title: `${copy.title} | FMA`, description: copy.subtitle };
}

type LinkRow = {
  id: string;
  titleFr: string;
  titleEn: string | null;
  titleAr: string | null;
  url: string;
  descriptionFr: string | null;
  descriptionEn: string | null;
  descriptionAr: string | null;
  icon: string | null;
  order: number;
};

export default async function LiensUtilesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const copy = usefulLinksPageCopy(l);

  const [links, heroRow] = await Promise.all([
    prisma.usefulLink
      .findMany({
        where: { active: true },
        orderBy: [{ order: "asc" }, { titleFr: "asc" }],
      })
      .catch(() => []) as Promise<LinkRow[]>,
    prisma.setting.findUnique({ where: { key: DB_KEYS.LIENS_UTILES_HERO } }).catch(() => null),
  ]);

  const heroImage = heroRow?.value?.trim() || null;

  const items = links.map((link) => ({
    id: link.id,
    title: l === "ar" ? link.titleAr || link.titleFr : l === "en" ? link.titleEn || link.titleFr : link.titleFr,
    description:
      l === "ar"
        ? link.descriptionAr || link.descriptionFr || ""
        : l === "en"
          ? link.descriptionEn || link.descriptionFr || ""
          : link.descriptionFr || "",
    url: link.url,
    logo: link.icon,
  }));

  return (
    <SectionBackground id="liens-utiles">
      <PageHero locale={l}>
        {heroImage ? <PageHeroImage src={heroImage} alt={copy.title} /> : null}
      </PageHero>

      <Section>
        <UsefulLinksGrid links={items} locale={l} />
      </Section>
    </SectionBackground>
  );
}
