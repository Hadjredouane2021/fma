import { prisma } from "@/lib/prisma";
import { DB_KEYS } from "@/lib/db-keys";
import { ExternalLink } from "lucide-react";
import { PageHero } from "@/components/common/PageHero";
import { PageHeroImage } from "@/components/common/PageHeroImage";
import { Section } from "@/components/ui/Section";
import type { Locale } from "@/types";

export default async function LiensUtilesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;

  type LinkRow = { id: string; titleFr: string; titleEn: string | null; titleAr: string | null; url: string; descriptionFr: string | null; descriptionEn: string | null; descriptionAr: string | null; category: string | null; icon: string | null; order: number; active: boolean };
  const [links, heroRow] = await Promise.all([
    prisma.usefulLink.findMany({
      where: { active: true },
      orderBy: [{ category: "asc" }, { order: "asc" }],
    }).catch(() => []) as Promise<LinkRow[]>,
    prisma.setting.findUnique({ where: { key: DB_KEYS.LIENS_UTILES_HERO } }).catch(() => null),
  ]);
  const heroImage = heroRow?.value?.trim() || null;

  const grouped = links.reduce((acc: Record<string, LinkRow[]>, link: LinkRow) => {
    const cat = link.category || "Autres";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(link);
    return acc;
  }, {});

  return (
    <div>
      <PageHero locale={l}>
        {heroImage && <PageHeroImage src={heroImage} alt={l === "ar" ? "روابط مفيدة" : l === "en" ? "Useful Links" : "Liens utiles"} />}
      </PageHero>
      <Section>
          {Object.keys(grouped).length === 0 ? (
            <div className="text-center py-20 text-[var(--text-3)]"><div className="text-5xl mb-4">🔗</div><p>{l === "ar" ? "لا توجد روابط" : l === "en" ? "No links available" : "Aucun lien disponible"}</p></div>
          ) : Object.entries(grouped).map(([cat, catLinks]) => (
            <div key={cat} className="mb-10">
              <h2 className="text-lg font-bold text-primary mb-5 capitalize gold-accent">{cat}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {catLinks.map((link) => {
                  const title = l === "ar" ? (link.titleAr || link.titleFr) : l === "en" ? (link.titleEn || link.titleFr) : link.titleFr;
                  const desc = l === "ar" ? (link.descriptionAr || link.descriptionFr || "") : l === "en" ? (link.descriptionEn || link.descriptionFr || "") : (link.descriptionFr || "");
                  return (
                    <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="glass-liquid rounded-2xl p-5 card-hover flex gap-4 group">
                      <div className="relative z-10 glass-panel w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:border-primary transition-colors shadow-sm">
                        <ExternalLink className="w-4 h-4 text-primary group-hover:text-white transition-colors" />
                      </div>
                      <div className="relative z-10 min-w-0">
                        <h3 className="font-semibold text-primary text-sm mb-1 group-hover:text-gold transition-colors">{title}</h3>
                        {desc && <p className="text-xs text-[var(--text-3)] leading-relaxed line-clamp-2">{desc}</p>}
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          ))}
      </Section>
    </div>
  );
}
